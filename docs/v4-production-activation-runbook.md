# V4 Production Activation Runbook — 승인 대기

2026-10-11 catalog 기준. 연결 문서: [Final QA](v4-release-final-qa.md).

**이번 Phase에서는 아래 운영 작업을 실행하지 않는다.** 현재 master/Production은 `4e26f2ec97e00e10b0d70ebdfc30e5893b547458`, candidate branch는 `v4/release-final-qa-01`이다. 잔여 콘텐츠 P0와 정책/설정 미완료를 해소하기 전 gate를 켜지 않는다. Production은 검증 환경이 아니다.

## A. 책임과 비밀 취급

- 최종 승인: 사업자/운영 책임자. 코드·DB: 배포 담당자와 DB 담당자. 금융: 승인된 결제/환불 담당자. 법률 문구: 법률 검토자.
- migration, env, OAuth/Toss 설정, 배포/gate, 실결제/취소, 이벤트/광고 각각 별도 승인 기록을 남긴다.
- 키 **값**은 채팅·문서·로그·screenshot에 넣지 않는다. 허용된 secret manager에서 승인된 담당자가 확인한다. 이 runbook에 명령을 복사해 일괄 실행하지 않는다.
- 원고/이름/DOB/paymentKey를 운영 로그에 출력하지 않는다. 주문/작업의 불투명 ID와 집계만 남긴다.

## B. 적용 전 fingerprint와 의존 순서

현재 public에는 V3 테이블7개와 공유 테이블, 신뢰성 RPC가 이미 존재한다. migration history `[]`만 보고 전체 폴더를 `db push`하지 않는다.

승인 직전 다시 read-only catalog를 수집하고 이번 export의 signature/컬럼타입/default/nullability/FK/constraint/index/RLS/ACL/function definition과 비교한다. mismatch면 아래 순서 사용을 중단하고 원인을 검토한다. 고객 row 없이도 객체 계약은 비교할 수 있다.

### 이미 있는 계약 — 재적용하지 않음

- 기존 reports/payment/input/jobs/attempts/paid snapshots/report_share_links.
- paid reliability의 expiry2160h, 외부 호출 audit, consent evidence, one-call delivery.
- 과거 `paid_report_*` full-function patch를 날짜순으로 덮어쓰지 않는다.
- `20260920171500_production_test_data_cleanup.sql`은 삭제 작업이므로 출시 chain에서 제외한다.
- legacy `001_init.sql` 등 대체 bootstrap도 제외. 현재 실제 schema와 다른 과거 파일로 되돌리지 않는다.

### 격리 PG17에서 검증한 13단계

| 순서 | 파일 | 선행 의존 / 적용 후 확인 |
|---:|---|---|
| 1 | `scripts/paid_worker_expiry_cost_guard_patch.sql` | 기존 reliability 원문/90일 만료/one-call prerequisite. 새 predicate만 교체; 재실행 hash 불변, ACL/settings 보존 |
| 2 | `supabase/migrations/20261003094827_v4_account_foundation.sql` | 기존 Supabase auth.users → account profile/consent/RLS |
| 3 | `supabase/migrations/20261003104500_v4_report_library.sql` | account + legacy payment/snapshot 만료제약 → purchase binding/claim/library |
| 4 | `supabase/migrations/20261003114045_v4_report_tickets.sql` | account/기존 report → grant/ledger/redemption 및 service-only RPC |
| 5 | `supabase/migrations/20261003123157_v4_coupon_foundation.sql` | account/payment/ticket → coupon reserve/release/금액계약 |
| 6 | `supabase/migrations/20261003143822_v4_friend_referrals.sql` | account/library/ticket → attribution/qualification/idempotent reward |
| 7 | `supabase/migrations/20261003154955_v4_growth_campaign_acquisition.sql` | account/ticket/referral → campaign·신규 획득 중복 방지 |
| 8 | `supabase/migrations/20261003165059_v4_growth_measurement.sql` | campaign/attribution → measurement 기반 |
| 9 | `supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql` | ticket ledger/consent → bundle order/approved payment/purchase grant |
| 10 | `scripts/report_ticket_publication_queue_patch.sql` | 기존 ticket/library/paid snapshot → durable queue/claim/publish/reverse/owner share |
| 11 | `supabase/migrations/20261010132645_v4_launch_event.sql` | campaign/referral/ticket RPC → budget/계정별 무료2장 cap/공통 만료 |
| 12 | `supabase/migrations/20261010135755_v4_launch_event_schedule_fix.sql` | launch 함수·초기 schedule → earliest10/11, end11/1 exclusive |
| 13 | `supabase/migrations/20261010143147_v4_ticket_refunds.sql` | bundle/ticket/publication → hold/금융 확인/REFUND/audit/FEFO guard |

계획은 운영 적용 승인과 다르다. migration 적용은 각 파일 transaction/guard를 유지하고 단계별 stop-on-error로 수행한다. 적용 목록·파일 hash·시각·검증 결과를 운영 변경 기록에 남긴다. Supabase migration history의 reconciliation은 실제 적용 사실을 확인한 담당자가 별도로 결정하며 무작정 mark-as-applied 하지 않는다.

### 격리 리허설 재현

- 공식 `postgres:17-alpine`(이번 실행17.11), network none, `/var/lib/postgresql/data` tmpfs, host ports/binds 없음.
- `scripts/verify-release-schema-postgres.mjs --isolated-local`이 고정 container `gyeol-release-final-pg17` 및 catalog-only `/private/tmp/gyeol-release-production-schema.json`을 요구한다.
- 이미 존재하는 rehearsal DB를 reset/drop하지 않고 실패시킨다. 재실행은 승인된 새 임시 컨테이너에서만.
- 함수 MD5/ACL, RLS, 주요 service-only RPC 검사. auth.users/uid stub, 실제 Auth/platform backfill 미포함.
- 독립 환불 PG17 결과: 100 request/10 concurrent, backend290, deadlock0, 금융 재시작멱등성 PASS(mock provider). 실제 Toss 성공 증거가 아니다.

## C. 운영 실행 19단계

모든 단계는 직전 단계의 증빙이 있어야 진행한다. 일부 기능만 출시할 경우 그 기능의 gate/의존성을 별도로 승인하고, 미완료 기능은 OFF로 유지한다.

| # | 작업 / 승인 | 성공 기준 | 중단 기준 / 복구 |
|---:|---|---|---|
| 1 | **백업·복구** / DB 운영 승인 필수 | 현재 데이터·schema·functions·grants 백업과 별도 DB 복원 성공, 보관 접근권한/복구 담당 확정 | Free plan의 백업 가능성을 가정하지 않음. 복원이 검증되지 않으면 STOP. 고객 데이터 export는 별도 승인된 보안 경로만 |
| 2 | **Migration 준비·적용** / DB write 별도 승인 | 위 fingerprint 재확인, 13개 chain 승인, 단계별 hash/시간/결과 기록 | 기존 객체 drift/guard failure/lock timeout → 그 단계 중단, 후속 실행 금지. 이미 commit된 단계는 검토 후 forward fix; 금융 데이터에 destructive down 금지 |
| 3 | **Schema/RLS/RPC** / read-only 확인, 기능시험 별도 승인 | owner/service-only ACL, FK/index/check 검증, 일반 anon/authenticated 금융 RPC 거절, legacy V3 read 보존 | 누락/과권한/기존 read 파손 시 gates OFF. 승인된 forward patch 또는 백업 복원 계획 |
| 4 | **Vercel env** / 설정 변경 별도 승인 | Auth public URL/anon, service URL/role, Toss pair, Cron/Admin secret, 런타임 flag가 승인 target에 존재·일치 | 값이 없거나 live/test 불일치면 STOP. 키 로그 금지. 변경 전 metadata 기록, 이전 승인 config 복구 |
| 5 | **Google/Kakao OAuth** / provider 설정·실로그인 승인 | provider 활성·scope·앱승인, Supabase callback와 앱 `/auth/callback` allowlist, PKCE/state/다른 계정 isolation | wildcard redirect/동의루프/계정 병합 오류 시 account OFF. provider config 이전 승인본 복귀 |
| 6 | **Toss 준비** / merchant·테스트 승인 | 단품/묶음 merchant 품목, callbackdomain, 키 조합, GET/confirm/cancel/부분취소·기한·오류복구 검증 | 실제 호출 없이 READY 확정 금지. 불명확한 결제는 기존 주문 GET 재확인; 새 주문/키로 재청구 금지 |
| 7 | **Worker/Cron** / 배포·스케줄 승인 | paid/ticket 매분 각1, CRON_SECRET, maxDuration300, plan/memory/실region 확인,401비인가/정상실행로그/빈큐 확인 | 무스케줄·RSS연속중단·timeout·큐증가면 판매 확대 중단. 기존 lease 보존, worker 강제 금융완료 금지 |
| 8 | **유료 이용권 정책** / 사업자+법률 승인 | 분류/사용기한/탈퇴·종료/부분사용/법정기간 이후/수단별 환불/SLA/최종문구 승인, 정책 version UI와 저장 동일 | version=null 또는 검토 미완료면 bundle gate OFF. 기존 정책 임의 소급 금지 |
| 9 | **이벤트 예산** / 사업자 금액·한도 승인 | 실제 총예산·보상총량·승인자·소진시 중단 절차 기록; 신규1/추천1 그대로 | 임의 예산 기입 금지. 승인 없으면 비활성. 종료시각 연장으로 부족분 처리 금지 |
| 10 | **RC Preview** / preview 연결 승인 | content sparse P0 해결, 관련회귀, Chrome safe-area/200%, schema+provider sandbox+큐 E2E. Book/Auth/결제 경계 확인 | 과거 테스트나 local mock만으로 productionprovider PASS 금지. 기능이 실패하면 해당 gate OFF |
| 11 | **공개 gate·master 배포** / 별도 명시적 승인 | 승인된 SHA, 최신 origin/master ancestry/drift 확인, 승인 기능만 활성화, preview diff 일치 | 이번 branch를 자동 merge하지 않음. rollback SHA/config 확보 전 STOP. DB forward compat를 먼저 검토 |
| 12 | **통제 실로그인** / 실제 Google/Kakao 사용자 승인 | 두 provider 신규/재로그인/필수동의/동명이인·다중탭·logout/만료 확인 | 사용자 동의나 소유권 이상 → 신규 Auth/구매 유입 차단, 기존 고객 읽기 보존 |
| 13 | **통제 실결제·발행** / 금액·수단·취소계획 승인 | 승인한 단품1건, 중복 callback에도1회결제/1회발행, 실제 server queue·snapshot·Book·90일계약 | 지연/불명확 응답은 동일 주문 재확인. 즉시 재결제 금지. 실패 시 계약에 따른 복구·고객 안내 |
| 14 | **이용권·서재·공유** / 통제 bundle구매·redeem 승인 | 1회 grant, 계정별잔액,입력복귀 후 최종동의,1회redeem,서재/공유전체본문,오소유권403/404 | 임의 grant/manual balance수정 금지. publish 불확실하면 lease/state부터 대조, 완료원고에는 reversal 금지 |
| 15 | **환불 준비/통제 검증** / 금융실행 별도 승인 | 권한 있는 운영자·기한·휴일대응, 원금기준 견적,hold→PG확인→REFUND1회,지급대조 증빙 | coordinator 모듈만으로 완료 아님. GET불확실/15일경과시 무조건 POST하지 않음. 수동재대조,hold유지와 고객기한 관리 |
| 16 | **이벤트 활성화** / 총예산+시각 승인 | earliest10/11 00:00 KST 이후 실제 서비스 공개+운영 활성; 서버ACTIVE 후 남은시간표시; end11/1 00:00 exclusive | 일정만 지났다고 ACTIVE 금지. 종료 후 지급0, 유료권/기존Book유지. 이상시 PAUSED,기지급원장보존 |
| 17 | **모니터링** / 담당·on-call 승인 | queue due/oldest/attention/만료lease,grantpending,refundpending,DBCPU/IO/connection/memory/지급예산·오류 추적 | pending1시간 조사,12시간 SLA재평가,24시간 초과즉시고객대응. 무한재시도/새금융key 금지 |
| 18 | **광고 시작** / 예산·측정 승인 | 초기 통제거래/환불·운영 안정, 실제 법적동의·Meta event dedup·지급예산 승인 | 유입이 처리능력 초과/보상경합/과금누락이면 광고와신규획득 중단. 클릭수만으로 scale금지 |
| 19 | **장애 대응** / 담당자 사전 권한 | 광고/캠페인·신규구매 차단, 기존읽기·주문복구 유지,PG↔DB원장대조,고객공지,복구후별도재개승인 | 무조건 worker도죽여 이미 결제된 고객을 방치하지 않음. 신규claim 중지 필요시 lease만료·금융결과 확인. DB통째복원으로 PG 사실 삭제 금지 |

## D. 구체적인 실행 전 점검

### Worker

- 배포 대상 `vercel.json`: `/api/internal/report-jobs`, `/api/internal/report-ticket-jobs` 각각 `* * * * *` 1개.
- paid는 최대8 sequential/45s admission/RSS1.25GiB, ticket은2/30s/RSS1.25GiB. admission이 hard timeout 보장은 아니다.
- 두 route의 maxDuration300/lease10분, 중복Cron은 DB claim/멱등성으로 제어한다. Cron20개/병렬20개로 임의 늘리지 않는다.
- Vercel plan/Fluid실행환경/메모리 실제값과 iad1↔서울 latency 확인. 매분 지원은 [Vercel 공식 Cron 제한](https://vercel.com/docs/cron-jobs/usage-and-pricing)을 재확인한다.
- `scripts/paid_worker_queue_diagnostics.sql`는 향후 승인된 집계 점검에 사용 가능. 이번에는 고객 row 기반 운영진단을 실행하지 않았다.

### Auth / 구매 / 금융

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 누락 해소. 서버 service role로 브라우저 auth를 대신하지 않는다.
- Google/Kakao provider callback은 Supabase `/auth/v1/callback`, 앱 최종 callback은 허용 origin의 `/auth/callback?flow=…`. 허용된 origin/nonce/state 검증을 느슨하게 하지 않는다.
- Kakao channel public ID 미설정은 선택안내 숨김으로 유지 가능. OAuth/Share/채널추가는 서로 다른 준비항목이다.
- `BUNDLE_PURCHASE_POLICY_VERSION=null`, `ticketBundleCommerceEnabled=false`, `AUTOMATIC_BUNDLE_REFUND_ENABLED=false`를 단순히 한꺼번에 뒤집지 않는다.
- 환불 담당자는 APPROVED → PG_CANCEL_PENDING → PG_CANCEL_CONFIRMED → LEDGER_SETTLED → COMPLETED 증빙을 확인한다. PG 확인 전 REFUND 작성 금지. provider 오류를 DB상태 직접수정으로 숨기지 않는다.

### 무료 이벤트

- 최초 가능 `2026-10-10T15:00:00Z`, 종료 `2026-10-31T15:00:00Z` exclusive.
- 공개가 늦어져도 end는 그대로. 10/29 재시작/리셋 없음. 총예산 승인 없으면 grant/활성 금지.
- 계정별 신규획득1/추천인평생1/합계2, 광고·추천 중복방지, A→B→C, account lock/원장idempotency 유지.
- 무료권 공통만료만 적용. 유료권/이미 발행된 Book90일은 변경하지 않는다.

## E. 현재 결론

**PRODUCTION_MIGRATION_PLAN_READY=YES, PRODUCTION_SCHEMA_READY=NO, PUBLIC_SALES_READY=NO.**

코드 branch push까지만 승인된 상태다. 위 실행 19단계는 수행하지 않았으며 Production migration/설정/배포/실결제/환불/보상지급/광고 실행은 각각 사용자 승인 후 진행한다.
