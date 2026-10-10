# COMMERCE-01 — 회원 유료 이용권 구매 기반

기준: `v4/worker-cost-safety` / `7b3d43c013b04a3bac5f8a3ac4e1924f5989c967`.
작업: `v4/ticket-commerce-01`. 로컬 SQL + Mock provider만 사용. 운영 적용·실결제·환불·판매 UI 없음.

## 가격 / 구매 도메인

| 상품 | 수량 | 원화 금액 |
|---|---:|---:|
| 기존 6상품 단품 | 리포트 1권 | 1,490 |
| SINGLE_1 | 이용권 1장 | 1,490 |
| PACK_3 | 이용권 3장 | 4,290 |
| PACK_5 | 이용권 5장 | 6,890 |
| PACK_10 | 이용권 10장 | 13,400 |

- 단품 SSOT: `src/lib/payment/reportProductCatalog.ts`. 표시/receipt/신규 주문/Meta 상품 예상 금액이 이를 참조한다.
- 묶음 SSOT: `src/lib/tickets/bundleCatalog.ts`. 브라우저는 bundleId/requestId만 제출하고 가격·수량·할인을 지정하지 않는다. SINGLE_1은 단품 가격 상수를 재사용한다.
- 과거 1,290원 승인/복구/이행은 원래 주문 금액으로 처리한다. 기존 주문 UPDATE나 소급 재가격 책정 없음. Purchase의 실제 결제 금액은 저장된 결제 사실을 사용한다.
- 기존 쿠폰 계산 로직은 변경하지 않았다. 신규 1,490원에서 300원 할인은 1,190원, 20% 할인은 1,192원이다. 묶음에는 쿠폰을 적용하지 않는다.
- DIRECT_REPORT_PURCHASE는 기존 payment_orders → worker → report 경로. TICKET_BUNDLE_PURCHASE는 별도 ticket_bundle_orders → 기존 ticket GRANT 경로. 가짜 reportId/0원 결제/리포트 생성 없음.

## 기존 구현 감사 A–N

| 항목 | 확인한 source / 재사용 및 분리 |
|---|---|
| A 주문 | 기존 `payment_orders`는 특정 product/report와 연결되므로 별도 `ticket_bundle_orders` 사용 |
| B ready/paid | `paidReportReliability.ts`의 단품 상태 전환 보존; 묶음은 지급 대기 상태를 별도로 둠 |
| C 준비 | `api/payment-checkout/prepare`, catalog, `tossCheckoutRequestAdapter`의 서버 결정/redirect 검증 및 SDK payload 계약 재사용 |
| D confirm | `tossConfirmClient.ts`의 인증·deadline·idempotency·오류 정리 재사용; bundle wrapper만 paymentKey/currency/order/totalAmount 필수 검증 |
| E provider order | 서버 생성 `bundle_toss_…`, 단품 ID와 구분; unique |
| F payment key | 서버 내부에만 저장, 응답/내역에는 제외; 묶음 unique + 단품과 교차 중복 차단 trigger |
| G 금액 | prepare의 서버 catalog → 불변 주문 snapshot → claim의 exact amount → provider receipt exact amount |
| H 중복 | 계정 lock → 주문 row lock → 2분 confirm lease; 기존 grant source/key unique와 동일 트랜잭션 |
| I 응답 유실 | approval commit와 grant commit를 분리; 승인 기록이 없으면 저장된 key로 provider GET 후 재조정 |
| J 취소/환불 | 검증된 취소는 지급 금지; 원래 lot 조회/사용 보류 준비. 자동 환불/취소 API 미구현·OFF |
| K purchase origin | 직접 구매 origin은 그대로. 이용권 구매는 report를 만들지 않고 source_type=purchase로 식별 |
| L GRANT | `tickets/service.ts`, `report_tickets('grant',…)`, grants/ledger 그대로 재사용 |
| M 잔액/내역 | 기존 summary/history/FEFO 유지. 새 구매 내역은 별도 주문 조회 계약, 별도 balance 없음 |
| N V3 | 1,290원 저장본/승인/열람·공유 유지. 예전 anon ready RPC/구형 990원 migration은 비활성 legacy이므로 재활성화·재작성하지 않음 |

## 서버 계약 / 공개 차단

`bundleHandler.ts` → `bundleService.ts` → `bundleSupabase.ts`/SQL, provider는 기존 Toss client wrapper.

| 동작 | 입력 | 결과 |
|---|---|---|
| prepare | bundleId, requestId | 안전한 주문 + 서버 Toss requestPayment payload |
| confirm | provider orderId, paymentKey, amount | GRANTED만 성공, 지급 대기는 성공으로 표시하지 않음 |
| recover | bundleOrderId | 동일 승인/지급 재조정; 새 결제를 요청하지 않음 |
| history | 없음 | 현재 verified user의 구매 시각/묶음/수량/금액/승인·지급·환불 상태 |

- AccountPort의 verified currentUser/read/current required consent 재사용. body userId 거절. 같은 이메일/이름으로 계정 합치기 없음.
- 허용된 정확한 서비스 Origin과 POST Origin 일치, 4KB 실제 stream 상한, 필드 allowlist, 쓰기 직전 세션 재확인.
- 키/confirm token/raw DB 오류는 고객 응답에 없음. private/no-store 및 no-referrer 적용.
- **현재 `/api/ticket-bundles/[action]`는 GET/POST 모두 무조건 404**. auth/DB/provider 인스턴스도 생성하지 않는다. 테스트는 handler를 직접 주입 호출한다.
- public Account/Book 및 기존 Production gates는 변경하지 않았다. 쿠키/query/env로 bundle 판매를 켤 수 없음.
- 이후 전용 success/fail URL과 승인된 구매 동의를 연결해야 한다. 단품 리포트 success URL에 묶음 주문을 보내면 안 된다.

## 승인 → 원장 / 복구

`READY → CONFIRMING → PAID_PENDING_GRANT → GRANTED`

1. claim이 owner/주문 금액/key를 검사하고 lease와 key를 먼저 저장한다.
2. 기존 Toss POST confirm의 인증/Idempotency-Key를 재사용한다. provider/orderId/paymentKey/amount/KRW/DONE/approvedAt을 검증한다.
3. approved RPC가 결제 사실을 별도 commit한다. 돈을 받은 주문을 FAILED로 낮추지 못한다.
4. grant RPC가 기존 report_tickets를 호출한다. GRANT 및 주문 GRANTED/grantId가 함께 commit/rollback된다.
5. 원장은 `source_type=purchase`, `source_ref=bundleOrderId`, `idempotency_key=bundle:orderId`, 실제 quantity, `reason=PAID_BUNDLE_…`를 쓴다.

| 실패 위치 | 보존 / 복구 |
|---|---|
| provider 거절/통신 불명 | 임의 실패 확정하지 않음. CONFIRMING lease 종료 후 원래 key로 조회 |
| 승인 성공, 승인 저장 실패 | durable key 유지 → provider GET. DONE이면 같은 승인 사실 기록. IN_PROGRESS만 같은 idempotency로 confirm |
| 승인 저장 성공, 지급 실패 | PAID_PENDING_GRANT 유지 → provider를 다시 호출하지 않고 grant 재시도 |
| 승인/지급 commit 후 응답 유실 | 같은 주문 recover가 저장 상태를 읽음; 중복 GRANT 없음 |
| 취소/부분 취소 확인 | REFUND_PENDING / PROVIDER_CANCELED, 지급 0. 수동 조정 대상으로 남김 |
| ABORTED/EXPIRED 확인 | 미승인 주문만 FAILED |

복구 handler/SQL 및 pending 조회 index까지 구현했다. 실제 예약 실행·운영 재조정 job·웹훅 연결은 판매 활성화 전 별도 검증 대상이다. 기존 paid worker를 묶음 복구용으로 변경하지 않았다.

## 원장 / 사용 순서 / 유효기간

- 잔액은 report_ticket_grants + report_ticket_ledger 하나뿐이다. 무료 보상 한도를 유료 구매에 적용하지 않는다.
- 6상품 모두 product_scope=NULL, 기존 1장 REDEEM. 양도/선물 없음.
- FEFO(가장 빠른 만료, 그 다음 기존 안정 순서) 유지. 무료 우선으로 바꾸면 기존 만료·환불 lot 계약이 바뀌므로 이번에는 변경하지 않는다.
- 구매 lot expires_at=NULL. 30/90일 임의 만료를 넣지 않았다. NULL을 고객에게 영구 유효 보장으로 표시하지 않는다. 리포트 열람 90일과 이용권 사용 기한은 별개다.

## 환불 A–G — 데이터 계약, 금전 정책은 미확정

원래 grantId의 ledger 잔량과 COMPLETED/RUNNING redemption을 조회한다. 단순 계정 잔액 차감으로 환불하지 않는다.

| 경우 | 이번 기반 / 활성화 전 결정 |
|---|---|
| A 미사용 | refund_review로 원래 수량/잔량/진행 중 사용 확인 → refund_hold. 법적 정책 승인 후 provider 취소/원장 조정을 별도 구현 |
| B 일부 사용 | 원래 lot 소비 내역 보존. 사용 단위 금액 배분·묶음 할인 공제·환불 금액은 법적 검토 전 계산/자동 실행하지 않음 |
| C 전부 사용 | remaining=0 및 소비 내역 확인. 기계적인 환불 허용/거절을 새로 정하지 않고 검토 대상으로 표시 |
| D 요청 중 다른 기기 사용 | 기존 계정 lock 아래 hold와 REDEEM을 직렬화. 먼저 확정된 사용은 review에 포함, hold 이후 새 사용은 원장 insert 전체 rollback |
| E PG 취소 뒤 이미 지급됨 | 원래 lot을 refund_hold로 동결한 뒤 소비/진행 중 사용 대조. 외부 취소 수신·조회 후 hold 호출 연결은 후속 운영 작업; 자동 잔액 제거 금지 |
| F PG 환불 응답 유실 | REFUND_PENDING/원래 order/key/refund request를 유지. 취소 조회로 provider 취소 reference·금액 확인 전 REFUNDED로 확정 금지. 환불 API는 아직 호출하지 않음 |
| G 관리자 재시도 | 동일 주문/원래 lot/안정 refund request ID로 대조. 새 지급·새 취소를 무조건 만들지 않음. 관리자 실행 UI/환불 finalizer 없음 |

`refund_hold`는 내부 service-only RPC이며 public handler에 노출하지 않는다. REFUNDED는 검증 시각/provider cancel reference/검증 상태 없이는 저장 불가. 자동 부분/전체 환불은 모두 OFF.

현재 hold는 FEFO 선택 lot이 보류 중이면 해당 redemption을 실패시킨다. 다른 lot으로 조용히 우회하지 않는다. 보류 안내/다른 이용권 선택 UX 및 안전한 hold 해제/환불 완료 원장 정책은 활성화 전 작업이다.

## DB / 권한 / 적용 순서

신규 파일: `supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql`.

- Supabase CLI `migration new`로 생성, **Production 미적용**. 이전 migration 수정 없음.
- 의존: 기존 순번형 migrations → reliability reconcile와 기존 paid recovery/expiry/consent/one-call/worker-cost patch → share links → 20261003 account/library/tickets/coupon/share/referral/campaign/measurement → 새 bundle migration.
- 기존 worker의 `o.amount<>1290` 검증 한 곳만 1290/1490 허용으로 교체하는 guarded function patch 포함. 예상 기준 함수가 아니면 적용 실패. historical rows 변경 없음.
- 신규 table RLS ON. public/anon/authenticated의 table/RPC 권한 없음. service_role은 필요한 SELECT/INSERT/UPDATE만, DELETE 없음. 함수는 기본 SECURITY INVOKER + 빈 search_path.
- cross-domain payment identity trigger만 SECURITY DEFINER/빈 search_path를 사용하여 양쪽 주문을 확인한다. payment key lock과 두 테이블 unique 제약으로 재사용을 차단한다.
- owner/상품/수량/금액/통화/provider order/동의/생성 시각 및 확정된 key/승인/원장 연결은 불변. 허용되지 않은 상태 역행 거절.
- 원격 DB 상태는 이번에 조회/적용하지 않았다. 출시 전 기존 V4 migration 의존성과 worker patch 적용 여부 확인 필요. 새 코드 가격과 SQL 허용 금액은 함께 준비되어야 한다.
- rollback은 판매 gate 닫기/입구 차단이 우선이다. 이미 생긴 금융 주문·원장은 삭제/되돌리지 않고 이전 금액 snapshot으로 복구한다.

## 검증

- PGlite 격리 DB에 실제 기존 SQL chain + 신규 migration, mock Toss provider만 사용.
- catalog, +1/+3/+5/+10, 무료/유료 누적, 100회 중복 callback, 다른 계정/금액/key/provider mismatch, key의 단품↔묶음 재사용 양방향, immutable 주문, grant rollback, commit 응답 유실, provider 조회 복구, 취소 재확인, FEFO/reversal, refund hold, RLS/권한, body 조작/Origin/크기, public gate 404 검증.
- 100회 Promise 동시 호출 검증은 PGlite 단일 연결에서 실행된다. 실제 다중 Postgres connection/실 PG callback 부하 시험을 했다는 뜻은 아니다. 운영 전 별도 동시성 검증 필요.
- 최종 결제/계정/6상품/Book/paid delivery/공유 관련 회귀: **68 files / 833 PASS / 0 FAIL**, 선택 실행형 worker capacity/measurement 2건 skip. 묶음 전용 31건 포함. `/tmp/gyeol-commerce-final-targeted.log`.
- 생성 포함 계정 회귀는 기존 5초 제한 초과가 있어 CLI testTimeout=60초로 재실행한다. 런타임 코드/전역 테스트 시간제한을 바꾸지 않는다.
- lint/build/diff-check PASS. 빌드는 외부 writer/Toss 비활성 프로세스에서 실행했으며 기존 localDatabase tracing warning 11건이 남는다. TypeScript **390 → 390**, 신규 진단 위치 0. 기존 TypeScript 부채/본문 golden은 변경하지 않았다.
- 보호 경로는 stage/commit에서 제외한다. 단 Supabase CLI 실행 시 `supabase/.temp/cli-latest` 자동 갱신이 확인됐다. 기존 값이 확인되지 않아 임의 복원·삭제하지 않았으며 해당 metadata는 결과물에 포함하지 않는다. `.gitignore`와 `AGENTS.md`는 편집하지 않았다.

## 활성화 전 blocker

1. V4 DB 순서/배포 승인, 원격 migration 적용 검증.
2. 선불 이용권 구매 고지·별도 구매 동의·유효기간·부분 사용 환불 금액/공제 정책 승인. 현재 계정 terms/privacy 동의만으로 판매 승인되었다고 간주하지 않는다.
3. 전용 Toss return 경로/verified auth·provider·DB handler wiring, 운영 reconciliation 및 취소 수신 연결. 현재 route는 404.
4. COMMERCE-02 실제 사용 경로, COMMERCE-03 판매 UI, COMMERCE-04 실결제 출시 검증. 이번에는 시작하지 않는다.

참고한 provider/DB 계약: [Toss API](https://docs.tosspayments.com/reference), [Toss 결제 연동](https://docs.tosspayments.com/guides/v2/payment-widget/integration), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Database functions](https://supabase.com/docs/guides/database/functions).
