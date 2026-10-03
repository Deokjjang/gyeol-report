# Phase 10B — 쿠폰 / 프로모션 기반

- Branch `v4/rebuild`, base `105367ad0cc0e67445a60b7e38cc107b00e8b373`.
- **쿠폰 = 실제 구매가격 할인 / 리포트 이용권 = 결제 없는 1권 생성 권리.** 0원 쿠폰·중복 적용·이용권 동시 소비 없음.
- 현재 6상품 정상가 **1,290원 그대로**. 공개 Book/Auth gate OFF. 이번 연결은 loopback development + 로컬 SQL + 필수 mock provider뿐이다.
- Production migration/지급/실제 Toss·OpenAI/광고/referral/자동 welcome/배포 없음.

## 1. 기존 계약 감사와 수정 경계

| 기존 source | 이번 연결 |
|---|---|
| `payment/reportProductCatalog.ts` | 6개 canonical ID/가격 재사용, 변경 없음 |
| `paymentCheckoutSessionBoundary.ts`, `tossCheckoutRequestAdapter.ts` | 별도 **서버 검증 주문금액 인자**만 추가. 생략한 기존 caller는 1,290원 계약 그대로 |
| `tossConfirmClient.ts` | 내부 `expectedAmount` 옵션. coupon confirm은 저장된 주문금액과 provider 반환금액까지 비교. 공개 request에서 이 옵션을 전달하지 않음 |
| `paid_report_reliability`, worker / validator / snapshot | 쿠폰 결제 확정과 redemption을 같은 transaction으로 저장한 뒤 기존 유료 생성·복구 경로 사용 |
| 9B auth / 9C library | 검증된 세션·현재 필수 동의·구매자 binding·guest proof 재사용 |
| 10A tickets | 원장/소비 로직 변경 없음. checkout에서 결제와 이용권 중 하나 선택 |
| `legal/refundPolicy.ts` | 기존 취소/환불 내용 변경 없음. 쿠폰 환불 재발급 자동화 없음 |
| Book receipt | 작은 쿠폰 영역·서버 금액 내역만 추가. 법적 동의 제거/자동 체크 없음 |

서버 가격 계산은 `lib/coupons/service.ts` → `report_coupons` SQL이다. 별도의 client 할인 계산기나 약한 report generator는 만들지 않았다. `localReview.runLocalBookJob`은 기존 generator/worker 연결을 재사용한다.

로컬 SQL 유료 생성기는 `report_...`, 기존 preview/ticket은 `book-local-...` ID를 사용한다. 로컬 서재/로그인 복귀 allowlist에서 둘 다 지원한다. 공개 ID/URL allowlist와 권한 검사는 그대로다.

## 2. Schema / 주문 snapshot

| Table | 계약 |
|---|---|
| `coupon_definitions` | nullable unique code, 이름, fixed/percentage, 값/최대 할인/최소 주문금액, canonical product ID 배열, 회원/첫 구매, 기간, total/per-user limit, 활성, campaign_ref |
| `coupon_grants` | definition FK, 필수 회원 FK, source_type/ref, 지급/개별 만료, idempotency. 다른 회원 transfer 불가 |
| `coupon_redemptions` | definition/grant/user/order FK, actor, 원가/할인/최종금액, 이름/campaign/definition snapshot, RESERVED/REDEEMED/RELEASED, 요청 key/input hash, 예약/확정/해제 시각 |
| `payment_orders` 추가 열 | `coupon_redemption_id`, `coupon_original_amount`, `coupon_discount_amount`; 기존 `amount`가 실제 최종 청구금액 |

- grant source: promotion / welcome / referral / manual / campaign. 자동 지급 hook 없음.
- source type/ref 및 user/key 각각 unique. 동일 campaign에서 여러 회원에게 지급하려면 source_ref에 해당 지급 원천/회원별 고유성이 있어야 한다.
- 1 order = 1 redemption. grant는 released가 아닌 사용 1개만 허용. monetary checks 및 immutable triggers로 주문·할인 당시 정보를 보호한다.
- 쿠폰 정의를 바꾸더라도 이미 예약/결제된 가격은 재계산하지 않는다. definition snapshot과 실제 청구액을 모두 남긴다.

## 3. 할인 규칙 / quote

| 규칙 | 결과 |
|---|---|
| 쿠폰 없음 | 1,290 / 0 / **1,290원** |
| fixed 300 | 1,290 / 300 / **990원** |
| percentage 20 | `floor(1290 × 20 / 100) = 258`, **1,032원** |
| percentage 33 | 할인 소수점 버림 425, **865원** |
| max_discount 200 | 계산된 할인과 200 중 작은 값 사용 |
| 최종금액 <100 / 할인 <=0 / 원가 초과 / 무료 | 거절. 최소금액으로 임의 보정하거나 ticket으로 전환하지 않음 |

현재 CARD/직접 간편결제 경계에 맞춰 최소 **100원**. 확인한 공식 자료: [Toss FAQ](https://docs.tosspayments.com/resources/faq), [결제수단 가이드](https://docs.tosspayments.com/guides/v2/get-started/payment-methods), [오류 코드](https://docs.tosspayments.com/reference/error-codes). 결제수단을 확대할 때 최소금액 계약도 재확인한다.

HTTP 입력은 `productType`, `selection: {code} 또는 {grantId}`뿐. identity는 검증된 서버 세션/서버 cookie에서 결정한다. 출력은 `originalAmount`, `discountAmount`, `finalAmount`, coupon display metadata, eligibility 결과. client의 금액/owner/만료/limit override 및 code+grant 동시 입력은 거절한다.

quote는 entitlement를 소모하지 않는다. 만료된 미확정 예약 정리는 할 수 있다. 결제 시작의 reserve에서 조건/한도를 다시 검사한다. quote 이후 금액이 달라졌으면 UI는 미확정 예약을 해제하고 새 금액 확인을 요청한다.

## 4. 적용 조건 / 회원 / public code

- 상품 전체 또는 지정 ID, 최소 주문금액, 활성 여부, 시작/만료, 회원 전용, 첫 유료 구매, 전체/개인 사용한도.
- 개인 grant는 해당 계정만 사용. code NULL인 비공개 지급도 지원한다.
- public code는 `member_only=false`일 때 guest 사용 가능. guest는 서버 발급 HttpOnly/SameSite cookie의 hash로 식별한다.
- **guest cookie 삭제/다른 브라우저까지 동일인인지 증명하지 못한다.** guest 1인 1회 보장은 하지 않으며 실제 campaign 전 별도 abuse/rate 정책이 필요하다.
- 첫 구매는 가입일/이용권이 아니라 성공한 `paid_at` 이력. 계정 구매와 이후 계정에 claim한 guest 유료 책을 포함한다. 취소되어 한 번도 paid가 아니면 첫 구매를 막지 않고, 결제 후 환불되면 과거 paid 이력이므로 다시 첫 구매로 취급하지 않는다.
- 계정과 연결되지 않은 과거 guest 결제는 회원 이력으로 추정하지 않는다. 첫 구매 조건은 회원 전용이다.

## 5. 예약 / 결제 / 만료 / 실패

`적용 가능 → RESERVED → REDEEMED` 또는 결제 전/확인된 실패에서 `RELEASED`.

| 상태/상황 | 처리 |
|---|---|
| 예약 | 서버가 가격·입력·동의·구매자 binding을 저장. 생성 권리 아님 |
| 유효기한 | definition / grant override 중 이른 시각. 예약 당시 유효하면 최대 10분 완료 창 유지 |
| 결제 전 취소 / checkout abandon | confirm 미시작일 때 release 가능. 10분 초과 미시작 예약은 다음 관련 조회/예약/confirm에서 해제 |
| 확실한 provider 실패 | 내부 검증 결과 + 현재 confirm token으로만 해제 |
| network timeout / amount mismatch / 결과 미확인 | 확인 시작 기록을 남겨 slot 유지. 시간이 지났다는 이유만으로 성공했을 수 있는 결제를 무료화하지 않음 |
| 실제 결제 확정 | 저장된 final amount로 기존 confirm_claim/confirm_finish 실행; paid order/report job + REDEEMED 원자 확정 |
| commit 후 응답 유실 | 같은 주문 재시도는 기존 REDEEMED 반환. provider 재호출·이중 사용 없음 |
| 결제 후 생성 실패 | REDEEMED 유지. 기존 paid delivery recovery가 담당; 쿠폰 자동 반환 없음 |
| 결제 후 환불 | 실제 환불 동작 미구현/미변경. coupon reissue = manual/future. 만료 쿠폰을 자동 연장하지 않음 |

원래 환불정책의 미제공/중복/회사 귀책 처리 등을 유지한다. 부분환불이나 자동 할인쿠폰 보상 정책을 새로 만들지 않았다. 재발급 여부·기간은 후속 운영/정책 검토 대상이다.

확인 시작 후 결과가 불명확한 예약은 자동 반환 대상이 아니다. 무기한 정상 checkout 창과 구분되는 reconciliation 상태이며, production 활성화 전에 provider 조회/worker 재조정·운영 알림 절차가 필요하다. 이번에는 실제 provider 조회나 scheduler를 만들지 않았다.

## 6. 가격 parity / ticket 분리 / UI

- `catalog → SQL quote/reserve → immutable order → checkout draft.amount → confirm.amount → provider response`가 동일. 6상품 990원 mock 승인 후 실제 V4 생성/저장/서재까지 검증한다.
- 서버 저장금액을 전달하는 추가 인자는 request body의 amount와 별개다. 기본 공개 prepare/confirm handler는 변경하지 않았다.
- receipt: 원가/할인/최종금액 작은 내역, code 입력/해제, 회원 보유 쿠폰 선택. 커다란 쿠폰함·할인 배너·취소선 없음.
- ticket 선택 시 쿠폰 UI disabled + 가격 영역은 이용권 1장. 결제로 돌아가면 보관한 quote 복원. 이미 예약된 주문에서는 방법 변경을 잠근다.
- coupon endpoint는 ticket 필드를, ticket endpoint는 coupon selection 필드를 거절한다. 실제 무료 발행은 10A 원장만 사용한다.
- guest coupon 구매도 기존 구매 proof cookie로 로그인 후 서재에 보관 가능. 구매/공유 token을 새로운 소유권 증거로 간주하지 않는다.

## 7. 동시성 / idempotency / RLS

- 모든 coupon 전환 lock 순서: **actor advisory transaction lock(namespace 11) → definition FOR UPDATE → redemption/order lock**. lock 획득 뒤 DB 현재 시각으로 판단한다.
- definition row lock이 회원/guest를 가로질러 마지막 전체 수량을 직렬화한다. actor lock은 개인 한도·요청 재사용·첫 구매 coupon 예약을 직렬화한다.
- unique(source), unique(actor/request), unique(order), grant active unique로 중복을 방어. 같은 요청의 다른 입력/product는 conflict. 단순 retry는 원래 주문/상태 반환.
- 3개 table RLS ON. anon/authenticated direct read/write/execute 모두 revoke, SECURITY INVOKER + 빈 search_path. service-only RPC 및 필요한 grants만 사용한다.
- HTTP: development/loopback, Origin 일치, 제한된 body/필드, 동의된 회원과 세션 재확인, private no-store/Vary Cookie. 공개 생성/관리 endpoint 없음.
- 로컬 PGlite에서 실제 PostgreSQL SQL/constraint/roles와 Promise 경쟁으로 마지막 1개 중 하나만 성공함을 검증. **실제 복수 DB connection/process 부하 시험은 아님.** 10A와 같은 staging 별도 gate를 유지한다.

## 8. Migration / 향후 연결 순서

1. 기존 paid reliability 및 quarantine / confirm recovery / first-publication expiry patch 전제 확인.
2. `20261003094827_v4_account_foundation.sql` → `20261003104500_v4_report_library.sql` → `20261003114045_v4_report_tickets.sql`.
3. 이번 `20261003123157_v4_coupon_foundation.sql`. **로컬 파일 준비 및 격리 PGlite 적용만; Production 적용 없음**.
4. 실제 staging 다중 연결 last-slot / same-user / confirm-vs-release 경쟁과 RLS/advisor 검증.
5. 공개 callback/recovery가 coupon order를 원장과 함께 처리하도록 dispatch 통합 후 승인. 기존 1,290원 전용 callback이나 일반 recovery가 coupon redemption을 건너뛰지 않아야 한다. 이번에는 공개 경로를 열지 않았다.
6. first-purchase를 실운영에 켜기 전 일반 결제/guest claim과의 cross-flow 동시성 및 악용 정책 검토. 이번 actor lock은 coupon RPC 범위다.
7. provider 미확정 조회/운영 대응, 환불 재발급, 데이터 보존/계정 삭제, legal/support 검토 후 별도 activation 승인.

향후 Share/Referral/Campaign은 검증된 원천 → 같은 grant RPC + 고유 source_ref + campaign_ref로 연결 가능하다. UTM/Meta API/광고 landing/가입 자동 지급/친구 보상은 구현하지 않았다.

## 9. 검증 기록 / 재현

- 신규 coupon test: 서버 quote / rounding/cap/min / scope/time / owner/private/public / 첫 paid·환불·guest claim / last-slot / retry / 만료 / provider 실패와 미확정 / ACK 유실 / RLS / 클라이언트 변조 / ticket 배타 / 6상품 실제 발행·원문/evidence parity.
- 브라우저: 390/430/768/1440의 미사용/fixed/percentage/member/ticket 전환, 오류/만료/타상품/회원전용, mock 발행→서재, guest 구매 proof, runtime/hydration/overflow.
- 실제 캡처 확인 위치: `/tmp/gyeol-v4-10b/` (`390-fixed-controls.png`, `390-ticket-exclusive-controls.png`, `768-percentage.png`, `1440-member-coupon.png`, `390-library.png`, `390-guest-claimed.png`, `browser-results.json`).
- 검수 중 수정: PL/pgSQL 목록 별칭 충돌, 실제 paid ID의 로컬 서재 projection/로그인 복귀, async confirm commit 응답 유실 처리. 본문·계산·정상가·public 활성화 변경 없음.

```sh
COUPON_REVIEW_EXPORT=/tmp/gyeol-v4-10b pnpm test tests/unit/account/coupons.test.ts
# Fresh loopback dev server at 127.0.0.1:3189; provider/writer disabled.
BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-coupons.mjs
```

최종 코드에서 실제 실행:

| 검증 | 결과 |
|---|---|
| auth/library/tickets/payments/checkout/paid delivery/report/sharing/V4/Book 관련 회귀 | **261 files / 4,266 PASS / 0 FAIL** (신규 coupon 35건 포함) |
| 실제 브라우저 | **101 PASS**, 390/430/768/1440 overflow/runtime/hydration 문제 0 |
| lint | PASS, warning 0 |
| build | PASS. 비차단 Turbopack NFT trace 경고 1건은 남음; 전체 타입 검사가 깨끗하다는 의미는 아님 |
| TypeScript | 기존 **390 → 390**, 위치 변화를 제외한 신규 진단 **0** |
| diff-check | PASS |

`.gitignore`, `AGENTS.md`, `supabase/.temp/`는 시작/종료 hash 동일·커밋 제외. master/origin/master 변경 없음. 실제 provider/Production DB는 호출하지 않았다.

이번 foundation의 검증 실패 blocker는 없다. **공개 활성화 blocker는 남아 있다:** 실제 다중 연결 PostgreSQL 경쟁 검수, coupon-aware callback/recovery dispatch, 결과 미확정 provider reconciliation, guest 악용/첫 구매 cross-flow 정책. 이 항목을 해결했다고 주장하지 않으며 이번 범위에서 activation하지 않는다.

STOP: 공유 SDK / referral / campaign / Production / master merge를 시작하지 않는다.
