# COMMERCE-04A — 실제 브라우저·독립 PostgreSQL 검증

## 기준 / 실행 경계

- Base: `v4/ticket-commerce-03` / `151b38cd5e0558bdd0d97fdb30d3a76cc23f5956`.
- 작업: `v4/ticket-commerce-04a`. 기존 COMMERCE-01/02/03 구현을 재사용했다.
- 로컬 서버 `http://127.0.0.1:3112` 재사용. 설치된 Chrome 155.0.8059.39의 실제 headless renderer와 CDP 사용. native browser 연결은 `Sky Computer Use native pipe startup failed`로 실패하여 대체했다. 새 브라우저 패키지는 설치하지 않았다.
- 브라우저 네트워크는 localhost:3112 이외 차단. 서버는 기존 local Account/PGlite/Mock Toss 경로만 사용. 실제 OAuth, Toss 테스트 결제, Production DB, 외부 AI 호출 없음.
- PostgreSQL 이미지 다운로드/임시 컨테이너는 사용자에게 별도 승인받았다. 공식 `postgres:16-alpine`, network=none, 공개 port/host bind 없음, tmpfs 데이터만 사용했다.
- Book/Auth/Bundle public gate 모두 OFF, `BUNDLE_PURCHASE_POLICY_VERSION=null` 유지. 가격·계산·본문·golden·V3·SQL migration 변경 없음.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/` 기존 변경은 보존하고 stage/commit에서 제외한다.

## 해결한 결함

| 실제 결함 | 최소 수정 | 검증 |
| --- | --- | --- |
| callback/paymentKey가 도착하지 않은 READY 주문을 기존 recover가 그대로 반환 | 소유자 확인 후 immutable provider orderId로 read-only 조회. strict order/amount/KRW/key/status 확인 후 기존 claim/approved/grant 사용 | SQL-backed recovery test, 실제 브라우저 callback 유실 mock |
| SDK loader가 실패해 requestPayment를 호출하지 않았는데 재시도까지 잠김 | SDK 진입 전 실패만 `not-started`; 같은 prepared order/requestId로 재시도. requestPayment 호출 이후 오류는 계속 잠금 | SDK adapter + 실제 React callback tests |
| Next dev의 request.url=localhost와 브라우저 Host=127.0.0.1 차이로 정상 모의 구매가 403 | development/test의 명시적 local adapter에서만 loopback Host로 Origin 정합. public origin 정책 불변 | 실제 Chrome 구매 + 다른 Origin 거절 회귀 |

UI/CSS 재설계는 하지 않았다. 안내는 승인 미확정/승인 후 지급 대기/지급 완료를 구분한다. `UNKNOWN_PAYMENT_STATE`는 새 결제를 권하지 않고 같은 주문 확인/고객 문의를 안내한다.

## 브라우저 실제 관찰

`BROWSER_OBSERVED_PASS`와 `LOCAL_MOCK_PASS`는 실제 외부 Provider 통과가 아니다.

| 대상 | 관찰 결과 |
| --- | --- |
| Google / Kakao | 신규 동의, 로그인/로그아웃, 계정 교체. Google의 잔액/민서 책이 Kakao에 나타나지 않음 |
| 0장 주문서 | 1,490원 직접 결제 기본 선택, 묶음 CTA, 개인정보는 URL에 넣지 않음 |
| Career 0장 → 5장 구매 | 지급 지연 시 PAID_PENDING_GRANT/잔액 0; 동일 주문 확인 후 5장 |
| 원래 Career 복귀 | 민서/1993-04-17/08:25/ISTJ/직장인/제조업 재무기획 과장/기혼 복원. 자동 발행 없이 동의와 명시적 발행 재요구 |
| Career 발행 | 5→4장, 실제 V4 Book 14 page units, 서재, 90일 만료 표시, 공유 복사 및 local shared Book 열람 |
| 1장 fixture → 종합 발행 | 정상 입력 후 기존 manuscript 안전 gate가 거절. REDEEM -1 / REVERSAL +1, 잔액 1장 보존. 아래 blocker에 별도 기록 |
| 독립 계정 구매 | Kakao의 기존 1장에 PACK_10 정상 지급 → 11장, SINGLE_1 정상 지급 → 12장 |
| 결제 취소 | SINGLE_1 모의 ABORTED → FAILED, Google 잔액 4장 유지 |
| 승인 응답 지연 | PACK_3 → CONFIRMING, 잔액을 더하지 않음 |
| callback 유실 | PACK_3 mock DONE 결과의 key/callback을 버림 → READY 잔액 12 → 같은 주문 확인 → GRANTED 15장 |
| 독립 구매 후 발행 / 직접 결제 | Kakao가 명시적 발행 후 15→14장, 서재에 Book 저장. 이어 기존 1,490원 직접 모의 결제 발행 성공, 잔액 14장 유지 |
| 저장/계정 보안 | 새로고침·기존 주문 재확인·Google/Kakao 전환 실제 관찰. 동일 표시명/세션 만료/다른 탭 알림은 component/handler tests와 구분 |

### 가격 / 원장

| 상품 | 수량 | 총액 | 권당 | 할인 | 검증 |
| --- | ---: | ---: | ---: | ---: | --- |
| SINGLE_1 | 1 | 1,490 | 1,490 | 0 | 실제 화면/동의/진입/모의 정상 지급/취소 |
| PACK_3 | 3 | 4,290 | 1,430 | 180 | 실제 화면/동의/진입/지연/READY 복구 지급 |
| PACK_5 | 5 | 6,890 | 1,378 | 560 | 실제 화면/동의/진입/지급 지연/복구/Book 복귀 |
| PACK_10 | 10 | 13,400 | 1,340 | 1,500 | 실제 화면/동의/진입/정상 지급 |

무료/manual과 purchase lot 구분, FEFO, 서버 원장 SSOT 유지. 무료 최대 2장 정책을 구현/검증 완료로 주장하지 않는다.

### 시각 자료

실제 PNG: `/private/tmp/gyeol-v4-commerce-04a/`.

- `390-login.png`, `390-home.png`, `390-library-empty.png`, `390-library-final.png`
- `{320,390,430,768,1440}-ticket-shop.png`
- `{390,430,768,1440}-selected-consent.png`
- `390-book-receipt-zero.png`, `390-book-return-ticket.png`, `756-receipt-one-ticket.png`
- `390-mock-checkout.png`, `390-paid-pending-grant.png`, `390-granted-return.png`
- `390-payment-canceled.png`, `390-approval-unknown.png`
- `741-ten-granted.png`, `741-single-granted.png`, `741-ready-callback-lost.png`, `741-ready-recovered.png`
- `{390,430,768,1440}-published-book.png`, `390-book-share.png`, `390-share-copied.png`, `390-share-local.png`
- `{390,430,768,1440}-{home,library,shop}-final.png`, `390-direct-receipt.png`, `390-direct-published-book.png`, `390-ledger-history.png`
- `844-landscape-shop.png`, `390-keyboard-focus.png`, `390-pinch-200.png`

상점 선택·동의와 Book 390/430/768/1440에서 수평 넘침 0. 가격/버튼/동의 정렬, 긴 한글 안내는 캡처로 확인했다. 320px 상점, 844×390 가로 방향, Tab focus outline도 확인했다. 768 홈의 개별 옆 책 transform은 viewport를 벗어나지만 외곽 clipping으로 document 수평 스크롤을 만들지 않는다.

캡처 중 실제 viewport가 바뀐 일부 PNG는 실제 width(741/756)로 파일명을 정정했다. 해당 상태를 390 PASS로 세지 않는다. `screenshot-manifest.json`에 실제 PNG 크기를 기록한다. 200%는 CDP pinch scale=2 적용만 확인했으며 full-page 캡처는 layout viewport 기준이므로 **desktop 브라우저 200% 확대 조작성 완료로 세지 않는다**. 실기기 safe-area 및 모든 상태×모든 viewport도 미완료다.

브라우저 기록에는 resource 404 및 back-forward cache 진입 시 dev HMR websocket 종료가 남았다. hydration exception은 관찰하지 않았지만 콘솔 오류 0으로 보고하지 않는다. 404별 요청 attribution은 미완료다. `browser-events.json`은 controller 재시작 이후 기록이며 전 실행의 완전한 네트워크 trace는 아니다.

Journey A(직접 모의 결제), C(0→묶음→원래 입력→발행), D(계정 독립 구매→발행)는 관찰했다. B의 1장 종합 입력은 아래 안전 gate에서 거절돼 성공 완주로 표시하지 않는다. 동일 표시명·세션 만료·실제 다른 탭 지급은 단위 검증만 있고 실제 브라우저 전수 검수는 남아 있다.

## 새로 발견한 비상거래 blocker

- 실제 입력: 종합 / 준호 / 남성 / 1989-09-21 / exact 17:40 / INTP / 프리랜서 번역가 / 솔로.
- 기존 순수 local generation adapter로도 `INVALID_REPORT_INPUT: COMPREHENSIVE_MANUSCRIPT_UNSAFE` 재현.
- 상거래는 `PUBLISH_REJECTED`로 발행을 차단하고 이용권 1장을 정확히 돌려줬다. 원장 오류나 이중 차감이 아니다.
- 해당 content adapter/validator는 이번 diff에서 변경하지 않았다. 본문·안전 gate 수정은 이번 범위 금지이므로 우회하지 않는다. 안전 gate의 상세 원인 및 임의 입력 coverage는 별도 콘텐츠 작업에서 확인해야 한다.
- 기존 6상품 대표 fixture는 모두 통과하지만, 이를 임의 입력 전부의 성공으로 확대하지 않는다. 이 사례 때문에 전체 기술 출시 판정은 NO다.

## Toss 복구 표

[Toss 공식 API](https://docs.tosspayments.com/reference)의 `GET /v1/payments/orders/{orderId}`와 [인증/승인 흐름](https://docs.tosspayments.com/guides/v2/get-started/payment-flow)을 대조했다. 성공 URL은 인증 성공이지 지급 권한이 아니다.

| 상황 | 자동 신규 결제 | 기존 주문 처리 | 운영 경계 |
| --- | --- | --- | --- |
| A SDK 호출 전 loader/payment 객체 실패 | 없음 | 같은 준비 주문만 재시도 | 실제 SDK 미호출임이 확실한 구간만 unlock |
| B SDK 진입 후 창 닫기/취소 | 금지 | 조회로 ABORTED/EXPIRED 확인 시 FAILED | reject/창 닫힘만으로 FAILED 처리하지 않음 |
| C 요청 후 네트워크 단절 | 금지 | READY/orderId 또는 저장된 key 조회 | 조회 불가/404/READY/IN_PROGRESS는 UNKNOWN_PAYMENT_STATE |
| D 승인 완료 후 callback/key 유실 | 금지 | orderId GET의 검증된 DONE → 기존 claim/approved/grant | amount/currency/order/key/paidAt 검증. READY 조회 경로는 confirm 호출 0 |
| E confirm 응답 유실 | 금지 | 기존 lease/recover, provider 사실 재조회 | 동일 주문 idempotency. 신규 BundleOrder로 우회하지 않음 |
| F 승인 기록 후 GRANT 실패 | 금지 | PAID_PENDING_GRANT, 기존 주문 grant 재시도 | 지급 전에는 잔액 임의 증가 없음 |
| G GRANT 성공 후 화면 응답 유실 | 금지 | GRANTED 재조회, 지급 재실행 무효 | durable 원장/중복키로 1회 지급 |

검증된 CANCELED/PARTIAL_CANCELED는 REFUND_PENDING으로 유지하며 신규 grant하지 않는다. 환불 실행은 하지 않는다. 조회 불가 주문은 수동 운영 확인 대상으로 남기고 임의 FAILED/재결제를 허용하지 않는다.

paymentKey는 서버 복구용으로만 사용하고 handler 출력/본문/분석 이벤트에 전달하지 않는다. callback query 제거, no-store/noindex/no-referrer, owner/session/Origin/amount 변조 차단을 회귀 검증했다. 실제 Toss SDK redirect/cancel/은행·카드 처리와 Google/Kakao OAuth는 `PROVIDER_TEST_MODE_NOT_RUN`, `PRODUCTION_NOT_VERIFIED`다.

## 독립 PostgreSQL 결과

- PostgreSQL **16.15**, 실제 다른 backend PID **175개**, 최대 **10개 동시 연결**. 각 호출은 별도 `docker exec psql` 연결/transaction이다.
- 신규 `scripts/verify-ticket-commerce-postgres.mjs --isolated-local`은 network=none/tmpfs/no-bind를 확인한 지정 컨테이너만 사용한다. connection string/Production secret 없음. 기존 DB가 있으면 삭제하지 않고 실패한다.
- 기존 migration/patch chain 31개를 새 격리 DB에 적용. 실제 Supabase Auth 서버 대신 최소 auth schema만 local stub; RLS 검증을 OAuth 검증으로 주장하지 않는다.
- 원본 결과: `/private/tmp/gyeol-v4-commerce-04a/postgres-concurrency.json`.
- 검증 후 지정 임시 컨테이너만 제거했다. tmpfs 시험 데이터는 폐기됐으며 JSON/스크린샷/로그는 보존했다. 로컬 Next 서버는 종료하지 않았다.

| 시험 | 결과 |
| --- | --- |
| A 마지막 1장 동시 두 요청 | 성공 1/거절 1, REDEEM 1, 음수 잔액 0 |
| B 동일 requestId 100회, 10개 동시 | redemption/REDEEM/snapshot/owner link 각각 1, 완료 후 기존 결과 |
| C 동일 묶음 claim/approved/grant/recover 경쟁 | 유효 confirm lease 1, 승인 사실 1, GRANT 1, 5장 1회 지급, 타인 주문 거절 |
| D worker claim/publish/recovery | 유효 lease 1, stale lease 거절, snapshot 1, 완료 후 reversal 0, 만료 작업 compensation 1 |
| E refund_hold/redeem 경쟁 | account lock으로 직렬화, hold 이후 사용 거절, 직전 사용은 정확히 반영 |
| 권한 | anon/authenticated 임의 grant/redeem/타인 주문/원장 변경 불가, service_role 원장 UPDATE 불가, RLS 활성 |

deadlock **0**. 쿼리 전체 실행시간(프로세스 시작 포함) 평균 513ms / 최대 1690ms. 순수 DB lock wait와 Production 처리량으로 해석하지 않는다. SQL publish payload는 최소 snapshot이며 실제 6상품 writer/Book 검증은 별도 회귀에서 수행했다. Provider 승인 네트워크 중복 호출은 mock service tests에서 확인하며 PostgreSQL 자체가 외부 Toss 호출을 검증한 것은 아니다.

## Worker / 운영 활성화 요구사항

- `/api/internal/report-ticket-jobs`: CRON_SECRET 검사, gate OFF에서 privileged constructor 이전 종료, queue/lease/중복 publish fence.
- 기존 ticket worker: 최대 2개 순차 처리, admission window 30초, RSS 상한 1.25GiB, lease 10분, route maxDuration 300초. 시작한 작업을 timeout 추정으로 중복 발행하지 않는다.
- `vercel.json`에는 기존 paid `/api/internal/report-jobs`만 있으며 **ticket worker cron 미활성화**. 이번에 추가하지 않았다.
- 실패 code는 원장/queue에 기록되지만 Production alert/운영 dashboard는 검증하지 않았다. 활성화 전 ticket 전용 scheduling, 실패율·대기열·lease 만료·지급 지연 관측/알림이 필요하다.
- 로컬 생성/복구 시간은 개발 환경 값이며 운영 SLA로 사용하지 않는다.
- 최종 브라우저 Resource Timing 표본: 완료된 state 6–19ms, 구매 내역 13ms, 이용권 원장 21ms (`browser-local-timings.json`). 취소된 status=0 요청은 latency 성공 표본에서 제외. prepare/worker 전체 처리시간·순수 lock wait는 별도 계측하지 않았다.

## 정책 보류

| POLICY_PENDING | 확정 시 영향 |
| --- | --- |
| 이용권 유효기간 | purchase lot expires_at/FEFO/고객 고지; 현재 null을 무기한 보장으로 해석 금지 |
| 미사용·일부 사용 환불 | refund_review/hold 및 환불 산정, 사용자 승인 전 실행 금지 |
| 할인 묶음 공제 | 실제 사용분 금액 산식과 문구 확정 필요 |
| 환불 hold 안내 | hold 중에는 사용할 수 없는 lot이 summary 수량에 남는 현 계약; 사용가능 표시와 고객 안내 후속 결정 필요 |
| 구매 약관/고지 | 승인된 문구/version 없이는 판매 불가. 현재 version=null 유지 |

## 회귀 / 최종 검증

- 관련 **30파일 중 29 PASS / 1 optional SKIP**, **497 PASS / 0 FAIL / 1 SKIP**, 481.84초.
- account/library/tickets/coupon/referral/campaign, bundle/direct Toss, worker, Book checkout, share/paid delivery, 실제 6상품 deterministic generation 포함.
- V4 snapshot/evidence 동일 입력 재생성 equality, owner 분리, revoke/90일 만료, share 데이터 parity. Major 14/14+미래10, Annual 12/12, Compatibility 양방향.
- SDK/React 최종 소규모 재검증 결과는 위 suite와 중복이므로 합산하지 않는다.
- lint PASS / build PASS / diff-check PASS. 기존 PGlite/localDatabase NFT trace warning 8건은 그대로다.
- TypeScript baseline 390 / 현재 390 / 신규 0. 기존 진단 union 표시 순서 차이는 정규화 대조; 전체 tsc clean이라는 뜻은 아니다.
- 선택형 paidWorkerCapacity 실부하 simulation은 실행하지 않았으며 PASS에 포함하지 않는다.

## 변경 파일 / 근거

| 파일 | 이유 |
| --- | --- |
| `tickets/bundleService.ts`, `payment/tossConfirmClient.ts` | strict orderId recovery |
| `tickets/bundleHandler.ts`, `app/api/ticket-bundles/[action]/route.ts` | 기존 verified route에 lookup 주입 |
| `tickets/shopClient.ts`, `account/TicketShop.tsx` | SDK 진입 전/후 실패 분리 및 미확정 안내 |
| `tickets/bundleLocalReview.ts` | 기존 mock에 조회 사실 주입 및 loopback origin 정합 |
| `ticketBundleRecovery`, `ticketShop`, `ticketShopLocal`, `TicketShopInteractions` tests | 새로운 경계/회귀 |
| `scripts/verify-ticket-commerce-postgres.mjs` | 실 PostgreSQL 독립 connection 검증 |
| 이 문서 | 실제 검증/미검증/정책·운영 잔여 구분 |

## 판정

- BROWSER_VISUAL_QA_COMPLETE: **NO — 실제 주요 화면은 관찰했으나 전체 상태×viewport, desktop 200%, 세션/다중 탭 일부 미완료**
- POSTGRES_MULTICONNECTION_VERIFIED: **YES**
- BUNDLE_PAYMENT_RECOVERY_READY: **YES — local technical boundary**, 실제 Provider는 미검증.
- TICKET_PUBLICATION_TECH_READY: **NO — 임의 종합 입력의 기존 콘텐츠 gate 거절 사례 미해결**. queue/ledger/6상품 대표 회귀 자체는 PASS.
- COMMERCE_04A_TECH_READY: **NO**
- PUBLIC_SALES_READY: **NO**

정책 승인/실 Provider 검증/Production worker 활성화는 별도 승인 Phase다. master/Production/운영 DB/실결제 변경 없음. COMMERCE-04B를 시작하지 않는다.
