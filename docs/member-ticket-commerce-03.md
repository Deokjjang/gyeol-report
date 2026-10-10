# COMMERCE-03 — Premium Member Editions

## 기준과 범위

- Base: `v4/ticket-commerce-02` / `37d13aee30b607e9624f3f17007c16a134343dd5`.
- 작업 브랜치: `v4/ticket-commerce-03`. master / Production / 운영 DB / 실제 과금 / 환경변수 변경 없음.
- COMMERCE-01의 주문·동의 JSON·idempotency·승인·지급·환불 hold 재사용. migration 추가/수정 없음.
- COMMERCE-02의 발행 queue·worker·ownership·서재·Book·공유 재사용. 6상품 문장/계산/evidence/golden 변경 없음.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 기존 변경 그대로 보존하고 commit 제외.

## 정보 구조와 디자인

`홈 → 내 서재 / 내 이용권 → 묶음 선택 → 구매 동의 → 결제 → 지급 확인 → 원래 Book 주문서`

내 서재는 이미 발행한 책, 내 이용권은 앞으로 발행할 수 있는 수량이다. 묶음 구매 자체는 리포트를 발행하지 않는다.

| 화면 | 구현 기준 |
| --- | --- |
| Account | 기존 서재 그대로, 작은 `내 서재 / 내 이용권` 내비게이션만 추가 |
| Shop | White/black, 기존 sans, 얇은 rule, 큰 수량/작은 edition label |
| 상품 선택 | radio 4개, 기본 선택 없음, 실제 BOOKS 색상의 작은 책등 accent |
| 주문 요약 | 정가/할인/총액 분리, 명시적 동의 후 구매 가능 |
| Mobile | 세로 흐름, safe-area 하단 여백, 44px 이상 주요 터치 영역 |
| 768px 이상 | 절제된 max-width 내 선택/요약 2열, 카드 장식/외부 폰트 없음 |
| 접근성 | semantic heading/fieldset, radio checked, focus-visible, aria-live, disabled 이유, 접기 버튼 focus 유지, 강제 animation 없음 |

위 항목은 **구현 기준**이다. 실제 390/430/768/1440 및 200% 확대의 시각·키보드 검수는 미완료다.

## 가격 SSOT

`bundleCatalog.ts`와 `reportProductCatalog.ts`만 재사용한다. UI의 정가/절약액/권당 가격은 이 값에서 계산한다.

| Bundle | 수량 | 총액 | 권당 | 절약 |
| --- | ---: | ---: | ---: | ---: |
| SINGLE_1 | 1 | 1,490원 | 1,490원 | 0원 |
| PACK_3 | 3 | 4,290원 | 1,430원 | 180원 |
| PACK_5 | 5 | 6,890원 | 1,378원 | 560원 |
| PACK_10 | 10 | 13,400원 | 1,340원 | 1,500원 |

과거 V3 1,290원 주문은 소급 변경하지 않는다.

## Routes / Gate / 인증

| Public 경로 | 역할 |
| --- | --- |
| `/account` | 기존 서재 + gated 이용권 링크 |
| `/account/tickets` | 잔액·상점·구매/사용 내역 |
| `/account/tickets/checkout/success` | 전용 승인/지급 확인 |
| `/account/tickets/checkout/fail` | 원래 주문 상태 확인; provider message 그대로 표시하지 않음 |
| `/api/ticket-bundles/[action]` | 기존 prepare/confirm/recover/history + verified state |

Book AND Account AND Bundle의 세 gate를 모두 검사한다. 공개 페이지/callback/API는 gate OFF에서 404이며, API는 gate 검사 이전에 Auth/DB/provider를 생성하지 않는다. 세 gate는 모두 OFF다. env/query/cookie 우회 없음.

현재 Supabase verified user 및 최신 회원 동의로 권한을 판단한다. 정확한 `/account/tickets`만 기존 safeAccountNext에 추가하며 callback/외부 URL/임의 query는 허용하지 않는다. 로컬은 기존 `/dev/account` adapter와 localhost + development 검사만 사용한다.

`scope = sha256(bundle-ui-v1:<verified user id>)`는 UI 계정 교체 감지용이지 소유권 token이 아니다. 서버는 매 요청에서 currentUser를 재확인한다. 동일 displayName의 다른 계정도 구분한다. 이전 scope의 prepare/history/recover/발행 retry는 거절한다.

## 주문·동의·SDK

- prepare 이전 동기식 lock 및 sessionStorage request ID 저장. 저장 실패면 주문을 만들지 않는다.
- prepare는 bundleId/requestId/동의만 받고 amount/quantity/userId/returnUrl 주입을 거절한다.
- 구매 동의는 회원 약관과 별개다. 상품·수량·가격 / 디지털 제공 / 구매·환불 안내의 세 필수 assertion + 서버 policy version + 서버 기록 시점을 기존 주문 `consent_evidence.purchase`에 저장한다.
- 공개 구매 정책 version은 `null`. UI 구매 불가 + 서버 `PURCHASE_POLICY_PENDING` fail-closed. 로컬 mock version은 판매 정책 승인으로 취급하지 않는다.
- 서버 prepared request와 별도 bundle metadata를 기존 Toss SDK loader에 연결한다. reportId/sessionId를 위조하지 않고 direct-report launcher와 분리한다.
- 회원 SDK customerKey는 서버가 만든 opaque scope에 member prefix를 붙인 값이며, UI에서 계정과 일치함을 재확인한다. 원시 회원 ID/이메일을 SDK 식별자로 사용하지 않는다.
- 기존 `payment().requestPayment()` 계약을 유지한다. SDK actual invocation은 이번에 실행하지 않았다. [Toss 공식 SDK 안내](https://docs.tosspayments.com/guides/v2/get-started/llms-quick-reference)의 기존 결제창 entry 및 customerKey 제약과 대조했다.

## 성공 / 취소 / 복구

| 서버 상태 | 고객 표시와 행동 |
| --- | --- |
| READY | 결제 준비, 이미 만든 주문 확인; 실패로 단정하지 않음 |
| CONFIRMING | 결제 확인 중, 새 주문/자동 재결제 없음 |
| PAID_PENDING_GRANT | 결제 완료·지급 확인 중; 잔액을 임의로 더하지 않음 |
| GRANTED | 서버 원장 재조회 후 지급 완료, Book 복귀 선택 가능 |
| REFUND_PENDING | 환불 처리 확인 중 |
| REFUNDED | 검증된 환불 완료 |
| FAILED | provider로 확인된 결제 미완료 |

성공 query의 paymentKey는 동일 브라우저의 prepared providerOrderId/금액과 맞을 때만 복구용 sessionStorage에 보관하고 즉시 URL에서 제거한다. UI/로그/분석 event에 출력하지 않는다. 완료 시 해당 주문 hint를 제거한다. 다른 과거 완료 주문을 확인해도 현재 진행 중인 주문 hint를 지우지 않는다.

callback은 no-store/noindex/no-referrer. MetaPixel 변경은 이 callback의 SDK/페이지 이벤트 억제와 로컬 티켓 경로 제외에 국한한다. 기존 Meta Purchase 및 사업 보상 시스템은 변경하지 않는다.

callback 자동 확인은 mount당 한 번이며 이후 동일 주문 확인은 명시적 버튼이다. 로그인 만료 시 잔액을 0장으로 표시하지 않는다. 재로그인 후 원래 pending 주문을 복구한다. callback이 유실되어 paymentKey가 서버에 도달하지 않은 READY 주문은 현재 기존 recover만으로 provider 상태를 알아낼 수 없다. 확정 실패/새 결제로 우회하지 않으며, **출시 전 미승인 취소/SDK 진입 실패 후 READY 해소 정책 및 실제 Toss fail 경로 검수가 필요하다.**

## Book 복귀 / 원장 / 여러 탭

- 기존 `gyeol-book-input-v1:<product>` draft를 재사용한다. URL에는 product만, return hint에는 product + scope만 저장한다.
- GRANTED 이후 버튼으로만 Book에 복귀한다. 현재 계정을 다시 확인한 뒤 같은 product draft를 복원하고 주문서로 이동한다.
- 이전 직접 결제 선택 hint를 해제하여 재조회한 보유권을 기본으로 선택한다. 새 구매 동의와 명시적 발행 클릭은 다시 필요하다.
- 0장이면 기존 1,490원 직접 결제와 gated 묶음 구매 선택을 함께 제공한다. gate OFF에서 404 CTA를 노출하지 않는다.
- 사용자가 직접 고른 결제 방법은 잔액 refresh로 덮지 않는다. 계정 교체 시 과거 동의/발행 정보가 자동으로 새 계정에 사용되지 않는다.
- 입력을 잃은 경우 이용권은 계정에 유지되며 다시 입력하라고 안내한다. 다른 기기에서 draft까지 복구된다고 주장하지 않는다.
- 복귀 계정이 다르거나 조회가 실패하면 원래 draft를 빈 입력으로 덮지 않는다. 검증 전 자동 복원은 차단하되 사용자가 명시적으로 새 입력을 작성할 때만 교체한다.
- 총 잔액은 기존 원장 summary로만 표시한다. 무료/유료 source lot은 보존한다. 구매 내역과 사용/지급 내역은 열 때만 조회하고 허용된 고객 label로 투영한다.
- 지급 완료 시 기존 BroadcastChannel을 알린다. 서재/상점/주문서는 focus·계정 알림으로 서버를 재조회하며 클라이언트 `+5` 연산을 하지 않는다.

## Local 검수 실행 / fixture

```sh
pnpm dev --hostname 127.0.0.1 --port 3112
```

기존 3112 서버가 있으면 재사용한다. Production 환경변수/공개 gate를 켜지 않는다.

1. `http://127.0.0.1:3112/dev/account?next=%2Fdev%2Faccount%2Ftickets`
2. Google 모의 계정: `local-google` / 표시명 `회원`. Kakao 모의 계정: `local-kakao` / 표시명 `검수 회원`. 실제 OAuth/비밀번호 입력 없음.
3. 현재 회원 필수 동의 완료 → `/dev/account/tickets`.
4. 원하는 묶음과 검수용 구매 확인 3개 선택 → `/dev/account/tickets/mock?orderId=<prepared opaque id>`.
5. 모의 승인 / 모의 취소 / 승인 응답 지연 / 승인 후 지급 지연 중 선택. 실제 Toss 호출 없음. 기존 SQL은 격리된 메모리 PGlite에서만 실행한다.
6. 승인 지연은 기존 lease가 끝난 뒤 같은 주문 recover. 지급 지연은 PAID_PENDING_GRANT 확인 후 같은 주문 재확인.
7. Book 복귀는 `/dev/book-flow/input?product=career_money_study`에서 입력→주문서→묶음 구매로 진입해 확인한다.
8. 예시 입력: 다온 / 1996-06-12 / 여성 / 09:20 exact / ISTJ / 직장인 / 제조업 재무기획 / 기혼. 실제 현재 input contract를 사용하고 개인정보는 URL에 넣지 않는다.
9. 모의 로그인 자체는 자동 grant가 아니다. 잔액 0/1/10은 새 로컬 세션·원장 또는 격리 SQL fixture에서 구성한다. API에 임의 잔액을 지정하는 우회 기능을 추가하지 않았다.

로컬 mock 서버를 종료하면 메모리 상태가 소멸할 수 있다. 이는 실제 운영 원장의 지속성과 별개다. 기존 공개 API를 localhost에서 임의 활성화하지 않는다.

## 브라우저 검수: BLOCKED

실제 브라우저 연결 시 `Sky Computer Use native pipe startup failed`, IAB 탭 생성 시 `Browser is not available: iab`. 화면을 관찰하지 못했으므로 screenshot, hydration, overflow, 200% 확대, 실제 다중 탭 검수는 **미완료**다. 로컬 GET 200, SSR 및 컴포넌트 callback 단위 검증은 browser PASS가 아니다.

다음 체크리스트를 **390 / 430 / 768 / 1440** 각각에서 실행해야 한다.

| # | 화면/행동 | 실제 관찰 |
| --- | --- | --- |
| 1–3 | 보유권 0 / 1 / 10장, 조회 실패와 0장 구분 | 미완료 |
| 4–7 | SINGLE_1 / PACK_3 / PACK_5 / PACK_10 선택·금액·키보드 | 미완료 |
| 8–10 | 결제 준비 / 승인 확인 / GRANTED | 미완료 |
| 11–12 | 지급 지연 / 모의 취소·실제 fail presentation | 미완료 |
| 13 | 세션 만료·다른 계정 전환·같은 이름 계정 | 미완료 |
| 14–15 | 이력 존재 / 빈 이력·lazy load | 미완료 |
| 16–17 | Book 입력→상점→지급→원래 주문서 복귀 | 미완료 |
| 전체 | 홈→계정→상점→모의 결제→원장→발행→서재→공유, 다른 탭 갱신 | 미완료 |

## 검증 기록

- SQL/API: 네 묶음 catalog/동의 JSON/중복 prepare·confirm·grant/owner/Origin/변조/지급 지연 복구 확인.
- 실제 컴포넌트 callback tests: 중복 클릭, 저장 실패, 계정 교체, 과거 주문 조회, query 제거, 서버 잔액 재조회, 다른 탭 알림. 브라우저 시뮬레이션/시각 검증이 아님.
- 실제 route tests: 세 gate 조합 OFF→404, privileged constructor 미호출, origin 및 계정 scope 경계.
- 기존 COMMERCE-01/02, OPS-01, account/library/coupon/referral/campaign/measurement, 기존 direct Toss, V3 delivery, 실제 6상품 생성·Book·서재·공유 회귀 포함.
- 최초 병렬 실행에서 12 test 및 Book hook timeout. 낮은 병렬성으로 재실행. Book runtime의 실제 전체 fixture 준비 hook만 60→180초로 늘렸으며 assertion/fixture는 그대로다.
- 관련 회귀 29파일: **28 passed / 1 skipped**, **469 passed / 0 failed / 1 skipped** (484.33초). 선택 실행형 `paidWorkerCapacity.test.ts`의 실부하 simulation은 미실행이며 통과로 세지 않음.
- 마지막 Book draft 보존 변경 후 `TicketShopInteractions`, `ticketCheckout`, `bookPublicFlow` 재검증: **3파일 / 50 passed / 0 failed** (76.52초). 앞 회귀와 겹치는 테스트이므로 수를 합산하지 않는다.
- SDK adapter/상점 callback 최종 소규모 확인: **30 passed / 0 failed**. 실제 Toss 호출 없이 SDK 대역으로 server-prepared request 전달 검증.
- `pnpm lint` PASS, `pnpm build` PASS, `git diff --check` PASS. 빌드에는 기존 `localDatabase.ts` 계열 NFT tracing 원인의 warning 8건이 남음. 범위 밖 tracing 구조를 리팩터링하지 않음.
- TypeScript baseline 390 / 현재 390 / 신규 0. 행 이동과 진단의 union 표시 순서 차이를 정규화해 대조했다. 전체 tsc가 clean이라는 뜻은 아니다.
- 물리적으로 독립된 PostgreSQL 연결의 concurrency 검증은 없음. PGlite serialized 경쟁/idempotency 검증과 구분한다.

## 변경 모듈

| 구분 | 파일/모듈 | 이유 |
| --- | --- | --- |
| 신규 UI | account/TicketShop, BundleMockCheckout, ticketShop.module.css | 회원 상점·상태·전용 로컬 PG 대역 |
| 신규 route | account/tickets 및 dev/account/tickets page/callback/API/mock | 실제 판매 경로와 격리 검수 경로 분리 |
| 신규 계약 | tickets/shopContract, shopClient, shopGate, bundleLocalReview | SSOT projection·storage·세 gate·기존 SQL adapter |
| 최소 기존 통합 | account page/AccountScreen/TicketSummary, account/policy | 내비게이션·안전한 로그인 복귀·서버 잔액 갱신 |
| 최소 기존 통합 | BookRoutes/BookInput/BookCheckout/useTicketPublication | 동일 draft 복귀·방법 선택·계정 scope 보호 |
| 최소 기존 서버 | bundleHandler/API, ticket handler/publicHandler | 구매 assertion·state·dedicated callback·scope 검증 |
| 개인정보 | next.config, MetaPixel | callback no-store/no-referrer 및 analytics 유출 방지 |
| 테스트 | ticketShop*, TicketShopInteractions, 기존 bundle/recovery/Book runtime | 신규 경계 및 기존 계약 회귀 |

## LAUNCH_BLOCKER / COMMERCE-04 인계

1. 유료 이용권 고객 고지용 유효기간, 미사용 환불, 일부 사용 후 산정, 할인 사용분 공제, 환불 hold 중 사용 안내 **미승인**. expires_at=NULL을 무기한 약속으로 바꾸지 않음.
2. 구매 동의 저장 구조는 준비했지만 실제 승인 문구/version이 있어야 공개 판매 가능.
3. 위 실제 브라우저 viewport·반환 동선·다중 탭·취소/SDK 실패 복구 검수 미완료.
4. 독립 PostgreSQL connections 경쟁 검증 미완료.
5. 실제 Toss 테스트 환경의 SDK 리다이렉트/취소 및 paymentKey 전달 유실 시 READY 해소 검증 필요. 이번에 실제 PG 호출/과금은 하지 않음.

기능 구현과 판매 준비 판정을 분리한다. 위 blocker가 남아 있는 동안 판매 준비 READY는 NO이며 Production activation은 NO다. 이번 작업에서 COMMERCE-04를 시작하지 않는다.
