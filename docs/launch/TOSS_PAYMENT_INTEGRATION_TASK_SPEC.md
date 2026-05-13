# 결리포트 Toss Payment Integration Task Spec

## 1. 목적

이 문서는 향후 Toss payment integration 구현 범위를 정의한다.

- 실제 integration과 task spec을 분리한다.
- provider-specific code가 기존 payment adapter contract 뒤에 머물도록 기준을 둔다.
- 결제 생성, 승인, webhook, paid unlock 연계의 경계를 구현 전에 정리한다.

## 2. 현재 전제

- Toss Payments는 한국 V1 payment provider 1차 후보로 기록되어 있다.
- payment adapter interface가 존재한다.
- in-memory payment adapter는 tests/dev only 용도다.
- payment UI는 비활성 상태를 유지한다.
- paid unlock API는 구현되어 있지 않다.
- production persistence는 아직 연결되어 있지 않다.

## 3. 구현 전 차단 조건

- Toss account/project ready
- test keys/secrets ready
- redirect/callback URL decided
- webhook endpoint path decided
- persistence linkage ready 또는 adapter 뒤 mocked path 준비
- refund/support policy copy가 test flow에 충분한 수준으로 준비
- manual QA template available
- release check pass

## 4. 구현 대상 범위

- Toss adapter skeleton or implementation
- create payment session
- confirm payment
- payment order persistence linkage
- webhook verification design
- paid unlock transition boundary
- typed error mapping
- tests

## 5. 구현하지 않는 범위

- raw card data storage
- enabling paid public launch immediately
- KakaoPay PG
- Paddle
- admin console automation
- accounting automation
- final legal review claim
- full refund automation if not ready

## 6. 결제 생성 흐름

1. validate report/order request.
2. create internal payment order ID.
3. persist order in pending/ready state.
4. create Toss payment session/request data.
5. return client-safe checkout data.
6. keep payment inactive flag until explicit launch switch.

## 7. 결제 승인 흐름

1. receive paymentKey/orderId/amount from callback or server route.
2. verify order exists.
3. verify amount/currency/product.
4. call provider confirmation in future implementation.
5. mark payment paid only after verified confirmation.
6. do not unlock report before confirmation.

## 8. Webhook 처리 흐름

- verify signature or provider authenticity.
- idempotency by payment/order ID.
- ignore duplicate events safely.
- map provider status to internal status.
- record external reference without raw sensitive payload by default.
- do not trust webhook alone without consistency checks.

## 9. paid unlock 연계 흐름

- paid unlock depends on confirmed payment.
- report status/access mode transitions.
- payment linkage stored.
- access token/hash boundary respected.
- receipt or unlock response can be issued later.
- failed payment does not unlock.

## 10. 오류/취소/환불 처리

- user cancel
- provider failure
- amount mismatch
- order not found
- duplicate confirmation
- refund requested
- retry guidance
- typed error codes

## 11. 보안/비밀값 관리

- secrets only server-side.
- no secrets in client bundle.
- no raw card data.
- no plaintext access token storage.
- env separation.
- webhook secret handling.
- logs should avoid sensitive payloads.

## 12. 테스트 전략

- create session success
- create session validation failure
- confirm success
- confirm amount mismatch
- duplicate confirm idempotency
- webhook duplicate
- cancel/failure mapping
- paid unlock blocked before confirmation
- paid unlock after confirmation
- no sensitive markers in client/source

## 13. 완료 기준

- adapter/API tests pass.
- source marker tests pass.
- release check pass.
- manual QA pass.
- payment inactive flag intentionally changed only when paid launch is approved.
- no implementation claim before end-to-end verification.

## 14. 다음 개발 Task 제안

1. 59D — Toss payment integration task spec source test
2. 59E — payment webhook design draft
3. 59F — paid unlock API implementation plan
4. 60A — production persistence adapter implementation plan
5. 60B — launch switch/payment inactive flag design
