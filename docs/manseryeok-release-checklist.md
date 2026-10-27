# 만세력 v5 출시 순서와 수동 확인표

- 쓰는 사람: 운영자(병합·배포 승인자). 자동 테스트로 대신할 수 없는 확인만 담았다.
- 브랜치: Phase 0 = `v5/phase0-version-tolerant`, v5 = `v5/manseryeok-merge`(Phase 0 위에 v5 커밋). 근거: `docs/manseryeok-report-3.md`
- 순서: **1 → 2 → 3**. 4는 v5 배포 뒤 문제가 생겼을 때만.
- 표기: ☐ 미확인 / ☑ 확인 / ✕ 문제 있음(메모 필수)
- 이 문서의 SQL은 모두 읽기 전용 SELECT다. Supabase SQL 편집기에서 블록별로 선택해 실행한다.

---

## 0. 남은 결정

| # | 결정 | 상태 |
|---|---|---|
| D1 | 원문 락 18개 | 회귀 기준선만 갱신함(품질 승인 아님). 새 원고 품질 검토는 3단계 P7에서 한다 |
| D2 | 신살 수정(망신·고신·과숙) | 병합 후보 브랜치에 포함. 현침·십이신살 기준 혼재는 미수정 |
| D3 | 23시 규칙 `unified` / `split` | **2단계에서 확정** |
| D4 | 서머타임 종료 중복 시각(1987-10-11 02:30 등) | 앞 시각 유지 / 뒤 시각 / 시주 생략 중 선택 |
| D5 | 동결 출처 해시 2건, comprehensiveStability | 수정하지 않음. `docs/baseline-failures.txt`에 사유 기록 |

---

## 1. Phase 0 (읽기 허용 패치): Preview → 배포 → 기존 Book 열람

Phase 0는 새 리포트를 바꾸지 않는다. 계산 버전도 그대로(`saju-calendar-kst-v2`)다. 하는 일은 두 가지다.
- v5 계산 버전(`saju-calendar-v5-lmt`, `dayun-utc-sect2-v2`, `timeBasis.calcVersion` `v5-lmt-2`)을 읽기 검증에서 알려진 버전으로 받는다.
- 모르는 계산 버전을 만나면 quarantine하지 않는다. `snapshot_json`은 그대로 두고, 고객에게는 "확인 필요" 화면만 보이며, `REPORT_READ_UNKNOWN_CALCULATION_VERSION` 로그를 남긴다.

**v5보다 먼저 운영에 나가 있어야 한다.** 그래야 v5에서 문제가 생겼을 때 이 코드로 돌아올 수 있다.

### 1.1 Preview (Production 아님)
전제: Preview가 테스트 결제 모드 + 운영이 아닌 DB에 연결되어 있다. 운영 DB가 연결되어 있으면 멈춘다.

| # | 확인 | 기대 | 결과 |
|---|---|---|---|
| A1 | 6개 상품 각 1건 생성(종합·커리어·연애·궁합·대운·세운) | 모두 발행, Book 열림 | ☐ |
| A2 | A1 리포트의 만세력 표 | 보정 문구 없음, 근사 시간대 라벨 예전 그대로(예: `묘시 05:00~06:59`) | ☐ |
| A3 | Preview 로그 | `REPORT_READ_UNKNOWN_CALCULATION_VERSION`, `SAJU_CALENDAR_CURRENT_REQUIRED` 없음 | ☐ |

### 1.2 배포 후 (운영)
1. ☐ 기존 Book 5건 이상을 연다(가능하면 6개 상품, 서머타임·근사 시간대·시간 모름 고객 포함). `/reports/[id]`, `/r/[token]` 모두 열리고 "리포트를 준비하고 있습니다"가 없다.
2. ☐ 24시간 동안 아래 [S1]의 `READ_GATE_REJECTED`·`PUBLISHED_SNAPSHOT_VALIDATION_FAILED`가 늘지 않는다.
3. ☐ 24시간 동안 Vercel 로그에 `REPORT_READ_UNKNOWN_CALCULATION_VERSION`이 없다(있으면 운영에 모르는 버전이 이미 있다는 뜻이다. 멈추고 보고).
4. ☐ `docs/publish-failure-query.sql` [1]을 실행해 배포 전 발행 실패율을 기록해 둔다(3단계 비교 기준).

```sql
-- [S1] 최근 1일 발행 후 열람 차단 건수(읽기 검사 실패)
select j.last_error_code, count(*) as reports
from public.report_generation_jobs j
join public.paid_report_snapshots s on s.report_id = j.report_id
where s.status = 'FAILED_REQUIRES_ATTENTION'
  and j.last_error_code in ('READ_GATE_REJECTED', 'PUBLISHED_SNAPSHOT_VALIDATION_FAILED')
  and s.created_at >= now() - interval '1 day'
group by 1;
```

---

## 2. 골든 CSV 우선 케이스 확인 → 23시 규칙 확정

`docs/manseryeok-golden-cases.csv`의 `priority` 1~8번만 먼저 본다.

1. ☐ 기준 만세력 앱 1~2개를 고르고 설정을 적는다: 경도 보정(−30분/127.5°E인지), 야자시 사용 여부, 서머타임 반영 여부.
2. ☐ priority 1~8 행의 기준 앱 결과를 `expected` 칸에 적는다.

| priority | 행 | 입력 | 보는 것 |
|---|---|---|---|
| 1 | T02 | 2000-05-11 23:40 여 | 23시 규칙: `new_unified`(庚午 일주) / `new_split`(己巳 일주) 중 어느 쪽인가 |
| 2 | Z08 | 1961-08-09 23:50 남 (UTC+8:30 마지막 날) | 23시 규칙 두 번째 판별 |
| 3 | T03 | 2000-05-12 00:20 여 | 자정 직후. 태양시로는 전날 23:50 |
| 4 | C01 | 1999-07-31 07:30 남 | 홀수 시 경계 +30분. −30분이면 07:00 辰, −32분이면 06:58 卯 |
| 5 | Z05 | 1987-07-15 12:00 남 | 서머타임(UTC+10), 보정 −90분 → 시주 辛巳 |
| 6 | Z03 | 1955-01-15 12:00 남 | 표준시 UTC+8:30, 보정 0분 |
| 7 | J04 | 1960-02-05 04:03 남 | 입춘(UTC+8:30 시기) 10분 후. 현재 엔진과 v5의 년·월주가 다르다 |
| 8 | J06 | 2024-05-05 09:20 여 | 월 절입(입하 09:10) 10분 후 → 월주 己巳 |

3. ☐ **23시 규칙(D3) 확정.** 1·2번이 둘 다 `new_unified`와 같으면 `unified` 유지. 둘 다 `new_split`과 같으면 `split`으로 바꾸는 별도 작업을 연다(이 경우 3단계 보류). 서로 다르면 기준 앱 설정을 다시 확인한다.
4. ☐ `pnpm vitest run tests/unit/saju/manseryeokGoldenCases.test.ts` PASS(`expected`·`priority`는 보존된다).
5. ☐ `expected`와 `new_unified`가 다른 행은 행 번호·기준 앱 이름을 보고서에 적는다. 3~8번에서 다르면 3단계 보류.

---

## 3. v5: Preview → 신규 리포트 생성 → 배포

전제: 1단계 배포 완료, 2단계에서 23시 규칙 확정.

### 3.1 Preview

| # | 입력 | 확인할 화면 | 기대 | 결과 |
|---|---|---|---|---|
| P1 | 2000-05-11 17:05 여, 정확 시각 | 만세력 표 + 아래 한 줄 | 庚辰 辛巳 己巳 壬申 / `기준 경도 동경 127.5°로 시간 보정 -30분 적용` | ☐ |
| P2 | 1987-07-15 12:00 남 | 보정 문구 | `… -90분 적용 (당시 서머타임 반영)`, 시주 辛巳 | ☐ |
| P3 | 1955-01-15 12:00 남 | 보정 문구 | `… 시간 보정 없음 (당시 표준시 UTC+8:30 반영)` | ☐ |
| P4 | 시간 모름 | 표·문구 | 시주 칸 없음, 보정 문구 없음 | ☐ |
| P5 | 근사 시간대 입력 화면 | 시간대 라벨 | `유시 17:30~19:29`, `자시 전날 23:30~당일 01:29` | ☐ |
| P6 | 2000-05-11 23:40 | 일주 | 2단계 결정과 같은 일주(`unified`면 庚午) | ☐ |
| P7 | 6개 상품 각 1건 | 생성·발행·Book 열람, 원고 읽기 | 모두 발행. 빈 페이지·"준비 중" 없음. **원고 품질은 여기서 사람이 본다**(락 재기준화는 품질 승인이 아니다) | ☐ |
| P8 | 공유 링크 `/r/[token]` | 열람 | 본문·표 동일 | ☐ |
| P9 | 1단계 전에 만든 기존 Book(Preview DB에 있다면) | 열람 | 보정 문구 없음, 라벨·신살 칸 예전 그대로 | ☐ |

- ☐ Preview 로그에 `SAJU_CALENDAR_CURRENT_REQUIRED`, `NATAL_TABLE_EVIDENCE_MISMATCH`, `REPORT_READ_UNKNOWN_CALCULATION_VERSION`이 없다.

### 3.2 배포 후 (운영)
1. ☐ **배포 시각을 적는다**(4단계 SQL에 쓴다): ________
2. ☐ 신규 리포트 1건 이상이 발행되고 열린다.
3. ☐ 기존 Book 5건을 다시 연다(1.2-1과 같은 기준).
4. ☐ 24시간 뒤 `docs/publish-failure-query.sql` [1]·[3]을 실행해 1.2-4 기록과 비교한다. 발행 실패율이 늘었으면 [3]의 사유를 보고한다.
5. ☐ [R2]를 실행해 v5-lmt 리포트 수를 기록한다(롤백 판단 기준).

---

## 4. 롤백 절차 (v5 → Phase 0 코드)

**롤백 대상은 Phase 0 배포다.** 84826020(Phase 0 이전)으로 돌아가면 v5 V3 리포트가 읽는 순간 quarantine된다(아래 근거). 그 경우 [R1]이 false이면 `snapshot_json`까지 지워진다.

근거(테스트로 확인한 것)
- v5 스냅샷 33건(V3 16, V4 17): 84826020 코드에서 V4 17건은 열리고 V3 16건은 모두 quarantine. Phase 0 코드에서는 33건 모두 열림.
- `tests/unit/payment/readVersionTolerance.test.ts`: 실제 SQL(quarantine 패치 없음)에서 모르는 버전 4종은 `snapshot_json`이 그대로 남고, 알려진 버전의 진짜 검증 실패는 예전처럼 quarantine된다.

### 4.1 롤백 전
1. ☐ [R1] 실행. `true`면 운영 quarantine이 내용을 지우지 않는 패치 상태, `false`면 지우는 상태다(Phase 0는 어느 쪽이든 v5 리포트를 quarantine하지 않는다).
2. ☐ [R2]·[R3]을 실행해 결과를 저장한다(`<v5 배포 시각>`을 3.2-1 값으로 바꾼다).
3. ☐ 롤백 대신 forward-fix가 가능한지 먼저 검토한다.

### 4.2 롤백
4. ☐ Vercel에서 **Phase 0 배포**를 다시 Production으로 올린다(Instant Rollback / Promote). DB는 건드리지 않는다.
5. ☐ v5 리포트에 `admin_retry`를 하지 않는다. Phase 0 엔진(kst-v2)으로 다시 만들어져 같은 고객의 원국이 바뀔 수 있다.

### 4.3 롤백 후 보존 확인
6. ☐ [R2]를 다시 실행한다. v5-lmt 행의 `COMPLETED` 수가 4.1-2와 같고, `(내용 없음)`이 늘지 않았다.
7. ☐ [R3]을 다시 실행한다. `READ_GATE_REJECTED`·`PUBLISHED_SNAPSHOT_VALIDATION_FAILED`가 늘지 않았다.
8. ☐ v5 리포트 2~3건(가능하면 V4 Book과 근사 시간대 고객)을 `/reports/[id]`, `/r/[token]`으로 연다. 열려야 한다.
9. ☐ Vercel 로그 `REPORT_READ_UNKNOWN_CALCULATION_VERSION`이 0건이다. 있으면 Phase 0가 모르는 새 버전(예: `v5-lmt-3`)이 운영에 있다는 뜻이다. 그 리포트는 보존되지만 열리지 않는다 → forward-fix.

롤백 중 화면 차이(데이터는 그대로)
- v5 리포트의 근사 시간대 라벨이 예전 표기로 보인다(예: v5 `유시 17:30~19:29` → `유시 17:00~18:59`).
- 만세력 표 아래 보정 문구가 보이지 않는다.

**주의.** Phase 0가 아는 v5 버전은 `saju-calendar-v5-lmt`, `dayun-utc-sect2-v2`, `v5-lmt-2`뿐이다. v5에서 계산 버전을 다시 올리면(예: 출생지 경도 입력 연결) 그 전에 Phase 0 쪽 목록도 갱신해 배포해야 롤백 시 열린다.

```sql
-- [R1] 운영 quarantine이 snapshot_json을 보존하는 패치 상태인가
select position('''quarantined''' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure)) > 0
  as quarantine_keeps_snapshot;

-- [R2] v5 배포 이후 발행된 리포트: 계산 버전·상태별 수
select case when s.snapshot_json is null then '(내용 없음)'
            when s.snapshot_json::text like '%"saju-calendar-v5-lmt"%' then 'v5-lmt'
            when s.snapshot_json::text like '%"saju-calendar-kst-v2"%' then 'kst-v2'
            else '기타' end as calendar,
       s.status, count(*) as reports
from public.paid_report_snapshots s
where s.published_at >= '<v5 배포 시각>'::timestamptz
group by 1, 2 order by 1, 2;

-- [R3] v5 배포 이후 발행됐다가 열람 차단된 리포트
select j.last_error_code, count(*) as reports
from public.report_generation_jobs j
join public.paid_report_snapshots s on s.report_id = j.report_id
where s.published_at >= '<v5 배포 시각>'::timestamptz and s.status = 'FAILED_REQUIRES_ATTENTION'
group by 1 order by 2 desc;
```
