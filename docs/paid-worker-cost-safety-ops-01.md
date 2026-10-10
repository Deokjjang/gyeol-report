# GYEOL-V4-OPS-01 — paid worker / expiry cost safety

검증일: 2026-10-10. 작업 기준 `86a21ecad26ebc137195d85ae479929271b869d8`, 브랜치 `v4/worker-cost-safety`.
**Production 적용 문서가 아니라 검증·승인 대기 자료다.** 가격 1,290원, 본문, 계산, 결제·보상 정책, 공개 gate는 변경하지 않았다.

## BEFORE → AFTER

| 항목 | 기존 | 변경 |
|---|---|---|
| Cron | `* * * * *`, 매분 | 동일 |
| 함수 | Node, `maxDuration=300` | 동일 |
| 생성 claim | 호출당 1회 | 순차 최대 8회 처리(재시도 포함), 빈 큐면 즉시 종료 |
| 새 작업 admission | 별도 예산 없음 | route 시작 45초 이후 새 claim 없음; RSS 1.25GiB 이상 새 claim 없음 |
| 처리 중 작업 | 기존 single worker | 동일; timeout race로 버리거나 lease를 강제 해제하지 않음 |
| 발행 실패 | SQL의 RETRYING / ATTENTION | 해당 주문은 기존 정책, 다음 정상 주문은 계속 처리 |
| DB 오류/응답 유실 | 기존 lease 복구 | 해당 batch 중단; 불확실한 finish를 즉시 재전송하지 않음 |
| payment recovery | 호출당 1개, 생성과 독립 | 그대로 병행, batch 건수만큼 늘리지 않음 |
| 이미 만료·정리된 row | job/report/attempt 모두 반복 UPDATE 가능 | 변경할 값이 남은 행만 UPDATE |
| claim의 attention 동기화 | 이미 attention인 snapshot도 UPDATE | 이미 attention/expired면 제외 |

### 유지한 실제 계약

- `runPublicPaidReportJob → runPaidReportJob → claim_job / finish_job` 재사용. 새로운 queue/state machine 없음.
- Book gate OFF: 기존 경로. ON: 서버가 저장한 `bookGeneration.version=v4`와 결제/상품/리포트 identity를 검증한 주문만 V4. 이전 주문은 V3. 사용자 query/cookie로 선택 불가.
- `FOR UPDATE ... SKIP LOCKED`, RUNNING lease 10분, 최대 자동 attempt 3개 유지.
- 첫 attempt만 외부 writer 기회 1회, 이후 deterministic fallback. 30초/2분 retry, canonical 불변식 실패 attention, 명시적 admin retry의 run number 유지.
- Writer network deadline 120초, reliability RPC deadline 10초 유지. Annual은 구매 당시 허용 연도와 immutable acceptance 재확인.
- 결제 confirm lease 2분과 provider idempotency 유지. recovery provider deadline 10초, 자동 recovery 최대 5회 및 기존 backoff 유지.
- HTTP 인증/응답 `{ok}` / 401 / 503 유지. 예산 때문에 한 건도 시작하지 못한 호출은 503, 일부를 안전하게 완료한 호출은 200.
- 로그/응답에 이름, 입력, 결제 key, 원고, snapshot을 새로 출력하지 않는다.

## 실행시간·메모리 한도의 의미

45초는 **새 claim을 시작할 수 있는 구간**이다. 마지막 작업을 마칠 255초 여유를 남기지만, 함수 전체의 강제 종료/취소 보장은 아니다. 동기식 생성이나 DB commit을 `Promise.race`로 버리면 뒤에서 계속 발행되는 위험이 있으므로 하지 않았다.

RSS는 프로세스 전체 값이며 hard memory limit이 아니다. 한 작업의 순간 peak, 다른 Fluid invocation과의 메모리 공유, GC/인스턴스 재사용은 운영에서 별도 확인해야 한다. 임계값에서 계속 503이면 큐를 방치하지 말고 운영자가 조사한다. 프로세스별 mutex나 분산 lock을 추가하지 않았다.

기존 `finish_job` 후 Book+Account gate가 모두 켜질 때 referral/campaign reconciliation이 실행된다. 이 observer에는 현재 전체 wall deadline이 없고 candidate 수/DB 응답에 따라 지연될 수 있다. **정책·코드는 이번 범위에서 그대로 보존했다.** 느려지면 다음 claim을 받지 않지만 in-flight observer를 취소하지도 않는다. 공개 활성화/고부하 SLA 검증에는 이 지연을 포함해야 한다.

## Expiry SQL — 적용하지 않음

패치: `scripts/paid_worker_expiry_cost_guard_patch.sql`.

운영 RPC를 `pg_proc` SELECT로 확인한 원문 MD5는 `cdad423cdd0f822e665fd2d36c2eb21b`이며 repo의 `paid_report_one_call_delivery_patch.sql` 원문과 일치했다. SECURITY DEFINER, `search_path=public, pg_temp`, UTC, service_role만 EXECUTE도 확인했다. 고객 row는 읽지 않았다.

패치는 기존 함수 정의에서 **6개 predicate만 교체**한다. 전체 오래된 migration을 재적용하지 않는다. 알려진 source/prerequisite가 아니면 예외로 transaction 전체 중단. 재실행 시 함수도 재작성하지 않는다. ACL/owner/settings/테이블 제약은 그대로다.

| 대상 | 최초 필요한 변경 | 반복 실행 |
|---|---|---|
| 발행 후 90일 경과 job | EXPIRED + lease 정리 | 이미 같으면 UPDATE 0 |
| 발행 후 90일 경과 snapshot | EXPIRED + 원고 제거 | 이미 같으면 UPDATE 0 |
| unpublished + input 보존기간 종료 | INPUT_RETENTION_EXPIRED attention | 이미 같으면 UPDATE 0; EXPIRED로 오인하지 않음 |
| attempt validation_errors | 민감 validation 내용 `[]`로 정리 | 이미 `[]`이면 UPDATE 0 |
| input snapshot | 기존 기한대로 DELETE | 이미 삭제면 0 |
| 주문/금융/외부 호출 audit | 보존 | 변경 0 |

로컬 row trigger로 측정: 정상 만료 1건(시도 1개)의 최초 정리 = UPDATE 3 + DELETE 1. **기존 재호출은 UPDATE 3, 패치 후 100회 재호출 합계 UPDATE 0 / DELETE 0.** WAL 바이트를 측정한 것은 아니며 반복 UPDATE에 의한 쓰기 원인을 제거했다. PostgreSQL은 값이 같아도 matching UPDATE row를 업데이트 대상으로 센다([공식 문서](https://www.postgresql.org/docs/current/sql-update.html)).

현재 제약은 EXPIRED + 원고 잔존을 원래 거부한다. 해당 비정상 fixture만 disposable DB에서 제약을 잠시 해제해 정리 가능성을 검증한 뒤 같은 제약을 복원했다. 운영 제약 변경은 없다.

행 검색 비용까지 0이 되는 것은 아니다. 누적 대량 데이터에 대한 query plan / partial index / WAL·vacuum 검증은 별도 승인 범위다. 이 패치는 신규 index나 schema migration을 포함하지 않는다.

## 로컬 실측 — 실제 V4 생성

M5 Pro / Node 25.9.0. 6상품 + 종합/Career 반복 = 동일 8건. 두 측정은 독립 Node process, mock persistence, 실제 calculation → current V4 generation → publication validation → snapshot을 사용했다. 외부 호출 0. gate는 테스트 프로세스에서만 stub했다. 다른 로컬 검증도 실행 중인 소표본으로 운영 p95/비용을 보장하지 않는다.

| 측정 | 변경 전 8회 single worker | 변경 후 1회 bounded worker |
|---|---:|---:|
| 완료 | 8 | 8 |
| 생성 wall 합계 | 32.724초 | 31.417초 |
| CPU 합계 | 34.253초 | 32.823초 |
| peak process RSS | 1,091.5MiB | 1,009.9MiB |
| generation RPC 수(mock) | 25 | 25 |
| snapshot hash | 동일 8/8 | 동일 8/8 |

전후 차이는 측정 변동으로 본다. **생성 CPU 최적화나 원고 축약을 주장하지 않는다.** before는 cron 간 1분 대기를 실측 wall에 넣지 않았으며, 그 대기는 아래 모델에 반영했다. Finance-01의 권당 기술 한계비용/가격 결론을 바꿀 근거는 없다.

Cron은 계속 매분이므로 월 43,200회(30일) 스케줄 자체는 줄지 않는다. 줄어드는 것은 backlog를 처리하는 **non-empty invocation 수**와 이미 정리된 DB row의 반복 쓰기다. 낮은 유입에서는 작업 뒤 빈 큐를 확인하는 추가 claim 1회가 생겨 DB read/RPC가 늘 수 있다. 결제·생성·저장 단가는 그대로이며, 절감액을 임의 원화 금액으로 약속하지 않는다.

## 용량 모델

`tests/unit/payment/paidWorkerCapacity.test.ts`는 opt-in이다. 실제 최신 SQL에 predicate 패치를 적용한 PGlite를 쓴다. SQL의 시간 함수만 테스트용 STABLE clock으로 치환하고 도착/생성시간만 가상으로 진행한다. 상태 전이/lease/retry/finish는 실제 RPC다. 가짜 큐 상태 머신은 없다.

- Finance-01 대표 6상품 wall 평균(권별 1.397~6.870초)을 순환, DB 왕복 **가정** 0.4초/건, expire **가정** 0.2초/회.
- 첫 시도 1% 실패, 기존 30초 retry. CPU는 Finance-01 측정치로 합산한 **모델 값**. PGlite 자체 CPU/RSS는 별도 기록하며 운영 worker 비용으로 쓰지 않는다.
- burst/대기는 전체 drain, 하루 유입은 균등 도착을 **24시간 관측**한다. 마지막 분 이후 처리될 몇 건은 다음 cron 대기이며 유실이 아니다.
- 메모리 admission은 모델에서 우회한다(위 실제 8건 측정과 별도 boundary test). mock snapshot은 작은 SQL envelope이므로 Production 대용량 JSON 전송 성능 검증이 아니다.
- 한 번에 cron 1개, 중복 호출로 처리량을 부풀리지 않음. 실제 별도 PostgreSQL 세션 간 lock contention/네트워크/운영 cold start는 미검증.

### 시뮬레이션 결과 (평균/최대는 주문부터 완료까지)

| 조건 | 24시간 내 완료 전→후 | 평균 제공시간 전→후 | 최대 제공시간 전→후 | 추가 실패 시도 전→후 |
|---|---:|---:|---:|---:|
| 100건 집중 | 100→100 | 50.6분→6.2분 | 100.1분→12.4분 | 1→1 |
| 1,000건 대기 | 1,000→1,000 | 8.43시간→1.05시간 | 16.82시간→2.10시간 | 10→10 |
| 하루 1,000건 | 1,000→1,000 | 33.4초→33.4초 | 67.5초→67.5초 | 10→10 |
| 하루 10,000건 | 1,425→9,996 | 10.28시간→21.3초 | 22.89시간→100.5초 | 15→100 |

모든 모델에서 중복 발행 0. 하루 10,000건의 하루 끝 pending은 **8,575→4건**, 가장 오래 남은 주문의 나이는 **23.28시간→34.56초**다. 새 모델의 4건은 자정 직전 유입으로 다음 cron을 기다린다. 기존 모델은 하루만에 장기 backlog가 생기므로 이 유입이 지속되면 24시간 계약을 감당하지 못한다. 완료하지 못한 주문의 최종 제공시간을 위 평균/최대에 섞지 않았다.

CPU 모델(완료+실패 시도): 100건 366.5초, 1,000건 3,621.5초로 전후 동일. 10,000/day는 완료 수가 달라 5,152.0→36,156.2초로 늘며, 이는 비용 악화가 아니라 더 많은 주문을 생성한 결과다. 생성 1건의 CPU가 줄었다고 해석하면 안 된다.

PGlite 시뮬레이터 peak RSS 1,753.5MiB는 WASM DB·fixture·import 포함 값으로, real generation의 약 1GiB와 다른 측정이다. 원문 CPU/wall/RPC/hash는 [측정 JSON](paid-worker-cost-safety-measurements.json)에 보존했다. 이 시뮬레이션 PASS는 Production 10,000/day 인증이 아니다.

### 초기 운영과 확장 경계

권장 최초 관찰 구간: deterministic V4 중심 **하루 1,000건 이하** + 실제 큐 지연 모니터링. 보장 capacity가 아니라 위 모델에서 여유가 있는 출시 가정이다. 늦은 legacy writer, 몰린 주문, 장애·cron 누락·메모리 중단을 포함한 실제 관측으로 조정한다.

8건을 매분 처리할 때의 산술 상한은 11,520 **시도**/일이다. 실패·재시도·시간·메모리 제한을 빼야 하며 10,000 **성공**/일 보장이 아니다. 순차 한 작업이 120초에 가깝다면 이 상한을 적용할 수 없다. 24시간 제공 계약은 **기존 backlog + 유입 + 재시도 < 실제 관측 처리능력**이고 오래 멈춘 job/attention을 운영자가 처리할 때만 성립한다.

월 10만/30만 권: **CAPACITY_NOT_VERIFIED**. 실제 DB I/O·지연·전체 JSON·공유 인스턴스 메모리·observer 지연·cron overlap/누락·실상품 분포를 검증하기 전 확대 약속 금지.

## 운영 확인(읽기 전용)

`scripts/paid_worker_queue_diagnostics.sql`은 aggregate SELECT만 포함한다:

- QUEUED/RUNNING/RETRYING/COMPLETED/FAILED_REQUIRES_ATTENTION/EXPIRED 수
- 재시도 due, 만료 lease, oldest pending age, paid pending 24시간 초과
- 최근 1시간/24시간 최초 발행 수, 최근 attempt p50/p95, expiry 잔여 대상
- 결제 recovery attention/candidate 수

실행 결과는 PII/원고/결제 key를 포함하지 않는다. 운영 관찰 시 pending 1시간부터 조사, 12시간이면 제공 SLA 여유를 재평가, 24시간 초과/attention/lease 만료 지속은 즉시 조사한다(신규 자동 알림/대시보드 구현 없음). recovery candidate SELECT는 ready 결제의 보수적 진단이며 실제 claim 적격성 판단은 RPC가 담당한다.

## 검증 / 재현

```sh
pnpm exec vitest run tests/unit/payment tests/unit/api/paidReportProductionRuntime.test.ts tests/unit/app/releaseActivation.test.tsx tests/unit/sharing/paidDeliveryCompleteness.test.tsx tests/unit/interpretation-v4/sixProductSale.test.ts --maxWorkers=2
GYEOL_WORKER_CAPACITY=1 pnpm exec vitest run tests/unit/payment/paidWorkerCapacity.test.ts --maxWorkers=1
GYEOL_WORKER_MEASURE=before pnpm exec vitest run tests/unit/payment/paidWorkerMeasurement.test.ts --maxWorkers=1
GYEOL_WORKER_MEASURE=after pnpm exec vitest run tests/unit/payment/paidWorkerMeasurement.test.ts --maxWorkers=1
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 pnpm build
pnpm exec tsc --noEmit --incremental false
git diff --check
```

- 관련 회귀 **472 PASS**, 측정 전용 opt-in 2건은 기본 실행에서 skip. 별도 SQL 시뮬레이션 **1 PASS**, 실제 생성 실측 before/after 각각 **1 PASS**.
- sequential, empty, time/RSS 경계, slow writer, 일부 failure, DB response 유실, overlapping worker, lease 복구, 중복 finish 거부 통과.
- 실제 SQL + V4 6상품 + legacy V3 발행 및 Book projection, Major 14/14, Annual 12/12, snapshot 불변성 통과.
- 결제 mock 동시 confirm/provider deadline/callback idempotency, 기존 V3 six-product delivery/expiry/recovery 회귀 통과.
- `pnpm lint` PASS. `pnpm build` PASS (미수정 localDatabase 경로의 Turbopack trace 경고 12개). sandbox 빌드 대기 후 동일 명령을 권한 있는 로컬 실행으로 완료; deploy 아님.
- 전체 tsc는 기존 **390건**으로 실패, 전후 diagnostic 동일 / 신규 0. unrelated 수정 없음.

운영 RPC 변경/Production DB write/실제 결제/AI 호출/master 변경/배포/gate 활성화 **모두 NO**. SQL 적용과 코드 출시에는 별도 승인 필요.

## 참고한 공식 계약

- [Vercel cron 관리](https://vercel.com/docs/cron-jobs/manage-cron-jobs): cron 지연·중복 호출을 별개로 고려, idempotency는 기존 lease에 위임.
- [Supabase function 보안](https://supabase.com/docs/guides/database/functions): 기존 SECURITY DEFINER settings/execute 범위 보존.
- [PostgreSQL UPDATE](https://www.postgresql.org/docs/current/sql-update.html): 실제 값이 같은 matching row도 UPDATE count에 포함.
