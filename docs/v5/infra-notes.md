# 인프라 노트 (읽기 전용 조사, 2026-10-28)

조사 대상: v5/main (origin/master 0dde75a8 + P0-2 변경). 운영 DB·Vercel 설정은 조회하지 않았다. 코드 사실은 서브에이전트 조사 후 핵심 값을 직접 grep으로 재확인했다. 재확인하지 않은 항목은 "조사 보고"로 표시한다.

## 1. 리포트 생성이 실행되는 경로

결제 확인 라우트는 **생성하지 않는다.** 주문을 paid로 바꾸고 작업 행만 만든다. 생성은 크론 워커가 한다.

```
Toss confirm  src/app/api/payments/toss/confirm/route.ts → confirmPaidReport (paidReportReliability.ts)
   └ RPC confirm_claim → Toss confirm → confirm_finish  (SQL: paid_report_snapshots + report_generation_jobs 행 생성)
크론 GET /api/internal/report-jobs (매분)        src/app/api/internal/report-jobs/route.ts
   ├ RPC expire, (TOSS_CONFIRM_API_ENABLED=1이면) 결제 복구 1건
   └ runPaidReportBatch (src/lib/book/paidWorkerBatch.ts) → runPublicPaidReportJob (paidRuntime.ts)
        └ claim_job → generateReportSnapshot → [generateProductReport | v4: generateV4ShadowReport + validateV4Publication] → finish_job
이용권 경로: 크론 /api/internal/report-ticket-jobs (매분) → runTicketPublicationBatch (src/lib/tickets/publicationWorker.ts)
   └ RPC report_ticket_publication(claim|publish|reverse), 실패 시 reverse(이용권 환급)
```
- 현재 생성은 전부 결정론이다(`writerDisabled.ts`, 외부 호출 0). v5 작가(LLM)가 들어오면 이 `generateReportSnapshot` 안이 길어진다.
- `src/app/api/reports/create/route.ts`는 개발·테스트 전용(그 외 NODE_ENV는 404). 관리자 재시도: `/api/internal/report-retry`(REPORT_ADMIN_SECRET).

## 2. maxDuration과 한도

| 대상 | 값 | 확인 |
|---|---|---|
| `/api/internal/report-jobs` | maxDuration **300초**, nodejs | grep 확인 (route.ts:10) |
| `/api/internal/report-ticket-jobs` | 300초 | grep 확인 |
| `/api/internal/meta-events` | 60초 | grep 확인 |
| `vercel.json` | `functions` 블록 없음(crons만) | grep 확인 |
| 1틱 배치 한도(결제) | maxJobs 8, 새 작업 claim 창 45초, RSS 1.25GiB. **진행 중인 작업은 끊지 않음** | grep 확인 (paidWorkerBatch.ts:7) |
| 1틱 배치 한도(이용권) | maxJobs 2, claim 창 30초 | grep 확인 |
| 작업 단위 생성 타임아웃 | **코드에 없음.** 300초 maxDuration과 10분 lease만이 상한 | 조사 보고 |

## 3. 큐·회수 구조 (조사 보고, SQL 0013·scripts/*patch.sql 기준)
- 모든 DB 접근은 RPC `paid_report_reliability(p_action, p_data)` 한 곳. 작업 행: `report_generation_jobs`.
- `claim_job`: RUNNING, attempt_count+1, **lease 10분**. attempt_count 상한 3(check 제약). lease가 끝난 RUNNING은 재claim 가능(시도 < 3), 시도 3회 소진 시 FAILED_REQUIRES_ATTENTION(LEASE_EXPIRED).
- `finish_job`: RUNNING + lease_token 일치 + lease 미만료여야 함, 아니면 STALE_LEASE. 실패 시 RETRYING(+30초, 이후 +2분), 3회 후 FAILED_REQUIRES_ATTENTION. `admin_retry`는 QUEUED로 되돌림(attempt 0).
- 결제 확인 lease 2분. 결제 복구 백오프 1분→5분→15분→1시간(scripts 패치).
- 이용권 발행 lease 10분. 실패 시 reverse.
- 공개 만료 90일(`expire`).
- 회수 크론은 별도로 없고, **매분 도는 워커가 lease 만료 작업을 다시 집는 방식**이다. SPEC §4의 "장 단위 부분 저장 + 회수 크론"은 아직 없는 기능이다(P3 이후 설계 대상).

## 4. Vercel Pro 최대 실행 시간 (공식 문서)
출처: https://vercel.com/docs/functions/configuring-functions/duration (페이지 last_updated 2026-08-24, 2026-10-28 조회)

| 플랜 | 기본 | 최대 | 확장 최대 |
|---|---|---|---|
| Pro (Fluid compute, 기본 활성) | 300초 | **800초** (GA) | 1800초(30분) **Beta**, 함수별 코드/vercel.json 설정, nodejs22.x/24.x |

- App Router는 `export const maxDuration = N`. 800초 초과는 프로젝트 기본값으로 못 두고 함수별로만 가능(Beta).
- 이 프로젝트가 Fluid compute 사용 중인지, 팀 플랜이 Pro인지는 **UNVERIFIED**(대시보드·API 미조회; 지시에 "Vercel Pro" 전제).
- 시사점(추론): 책 1권 스트리밍은 현재 300초 상한에 빠듯할 수 있어 report-jobs의 maxDuration을 800까지 올릴 여지가 있다. 단 **lease가 10분(600초)이라 maxDuration을 800으로 올리면 lease보다 함수 수명이 길어져** 같은 작업을 다른 워커가 다시 집을 수 있다 → 올릴 때 lease(SQL RPC 변경 = migration)와 함께 설계해야 한다. 이번 P0-2에서는 변경하지 않았다.

## 5. 최종 로컬 검사(P6)용 개발 DB 선택지 (현 장비 기준)

| 항목 | 상태 |
|---|---|
| supabase CLI | **미설치**(`supabase: not found`). npm에는 2.122.0 존재(`npx`로 실행 가능, 미실행) |
| Docker | `/usr/local/bin/docker` 29.8.2 + Docker Desktop 설치됨, **데몬 꺼져 있음**(소켓 없음). psql·pg_ctl 없음 |
| `supabase/config.toml`, `seed.sql` | **없음**(supabase/에는 migrations/만). `supabase init` 필요 |
| migrations | 31개, 이름 체계 혼재(`0001_`~`0013_`, `001_init`, 타임스탬프 `2026092…`~`2026102…`) |
| migration 밖 RPC 패치 | `scripts/*.sql` 다수(예: paid_payment_confirm_recovery_queue_patch, report_ticket_publication_queue_patch, paid_worker_expiry_cost_guard_patch, paid_report_one_call_delivery_patch). **migrations만 적용한 새 DB에는 이 패치가 없다** |
| 원본 저장소 `supabase/.temp/` (미추적) | `linked-project.json` 등 존재 → CLI가 원격 프로젝트에 link된 흔적. 어느 프로젝트인지는 확인하지 않음(운영일 가능성, UNVERIFIED) |
| 별도 개발/스테이징 Supabase 프로젝트 | 문서상 **확인되지 않음**. `docs/paid-report-production-deploy-01.md`: 별도 staging 대상은 미확인, "staging은 staging DB 사용" 권고 |
| 테스트의 DB | 실DB 접속 없음. PGlite(`@electric-sql/pglite`)가 migrations + 일부 scripts 패치를 인메모리로 적용해 RPC를 검증(예: tests/unit/payment/paidReportReliability.test.ts). `tests/networkGuard.ts`가 fetch를 막음 |

선택지
1. **PGlite(인프로세스)**: 설치·Docker 불필요, 이미 테스트가 쓰는 방식. 작업 claim/finish·부분 저장 배관 검증에 충분. 실제 Supabase 동작(RLS·PostgREST)은 검증 못 함.
2. **로컬 Supabase 스택**: `supabase init` → Docker Desktop 기동 → migrations + 누락된 scripts 패치 적용. 가장 운영에 가까운 로컬 검증. 먼저 패치 적용 순서를 정리해야 한다.
3. **별도 Supabase 개발 프로젝트(클라우드)**: 사용자가 새로 만들어야 하며 비용·키 관리가 생김. 크론은 Production 배포에서만 돌므로(문서) 워커는 로컬에서 수동 호출해야 한다.

**운영 DB를 로컬 서버에 연결하는 안은 권하지 않는다.** 로컬 코드가 실고객 주문·Book 스냅샷·이용권을 읽고 쓰게 되며, 기존 Book 변경 금지·운영 DB 쓰기 금지 규칙과 정면으로 충돌한다.
