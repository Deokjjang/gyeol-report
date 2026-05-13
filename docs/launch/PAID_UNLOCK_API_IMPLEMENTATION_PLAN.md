# 결리포트 Paid Unlock API Implementation Plan

## 1. 목적

이 문서는 paid unlock API implementation boundary를 coding 전에 정의한다.

- implementation plan과 actual API implementation을 분리한다.
- 결제 확인, 리포트 상태 변경, 접근 토큰 경계가 섞이지 않도록 기준을 둔다.
- paid launch 전에 필요한 검증과 차단 조건을 명확히 둔다.

## 2. 현재 전제

- payment provider integration is not implemented.
- production persistence is not connected.
- paid unlock API is not implemented.
- report persistence adapter exists.
- payment adapter interface exists.
- access token hash utility exists.
- payment UI remains inactive.

## 3. API 후보

Candidate routes:

- `POST /api/reports/unlock`
- `POST /api/payments/confirm`

Notes:

- unlock may be triggered by payment confirmation route or webhook.
- route naming should avoid exposing provider secrets.
- client should not directly mark a report as paid.

## 4. 입력/출력 계약 초안

Candidate input fields:

- `reportId`
- `orderId`
- `paymentProvider`
- `providerPaymentId`
- `amount`
- `currency`

Candidate output:

- `ok`
- `reportId`
- `accessMode`
- `paymentStatus`
- `unlockStatus`
- `messageKo`

Final schema는 payment adapter와 persistence implementation에 따라 조정될 수 있다.

## 5. 성공 처리 흐름

1. validate request shape.
2. load report record.
3. load payment/order record.
4. verify confirmed payment status.
5. verify amount/currency/product.
6. update report access mode/status.
7. store payment linkage.
8. return unlock response.
9. do not expose sensitive fields.

## 6. 실패 처리 흐름

- invalid request
- report not found
- order not found
- payment not confirmed
- amount/currency mismatch
- providerPaymentId mismatch
- already unlocked
- persistence failure
- provider verification failure

## 7. 상태 전이 규칙

- preview -> paid
- generated -> paid_unlocked
- pending/ready -> paid
- failed/cancelled/refunded -> no unlock
- deleted -> no unlock

already unlocked state는 idempotent handling 대상으로 둔다.

## 8. 결제 검증 경계

- client callback alone is not trusted.
- provider confirmation or verified webhook required.
- amount/currency/product consistency required.
- duplicate confirm should be safe.
- refund after unlock requires separate policy decision.

## 9. 리포트 접근 토큰 경계

- access token plaintext is not stored.
- access token hash utility is used.
- token rotation may be separate later.
- unlock response should avoid exposing hash.
- access token issuance/receipt can be separate task if needed.

## 10. 저장/증적 경계

- persist access mode/status transition.
- persist payment linkage metadata.
- persist timestamps.
- store minimal external reference.
- no raw card data.
- no raw sensitive provider payload by default.
- audit/event table can be added later.

## 11. 보안/오남용 방어

- server-side validation.
- rate limiting or abuse guard.
- no secrets in client bundle.
- least privilege persistence access.
- predictable ID guessing should not unlock.
- logs avoid sensitive payloads.
- return safe error messages.

## 12. 테스트 전략

- unlock success after confirmed payment
- unlock blocked before confirmation
- amount mismatch
- report not found
- order not found
- already unlocked idempotency
- failed/cancelled/refunded payment
- deleted report
- no sensitive fields in response
- no client-side paid override

## 13. 구현 전 차단 조건

- persistence provider ready or mocked behind adapter
- payment confirmation path ready
- webhook design accepted
- access token hash utility available
- env/secrets strategy ready
- release check pass
- manual QA plan ready
- payment inactive flag remains until end-to-end verification

## 14. 다음 개발 Task 제안

1. 59H — paid unlock API implementation plan source test
2. 60A — production persistence adapter implementation plan
3. 60B — launch switch/payment inactive flag design
4. 60C — webhook route skeleton task spec
5. 60D — paid unlock API skeleton task spec
