# 결리포트 Paid Unlock API Skeleton Task Spec

## 1. 목적

이 문서는 paid unlock API skeleton을 실제 구현 전에 정의한다.

- task spec과 actual route code를 분리한다.
- paid unlock route가 결제 확인, persistence mutation, report unlock을 바로 수행하지 않도록 skeleton 경계를 둔다.
- 향후 구현이 launch flag와 provider-neutral adapter 경계를 따르도록 기준을 둔다.

## 2. 현재 전제

- paid unlock API implementation plan exists.
- paid unlock API is not implemented.
- payment remains inactive.
- production persistence is not connected.
- real payment provider is not implemented.
- access token hash utility exists.
- launch flags are not implemented yet.

## 3. 구현 대상 파일 후보

Candidate files:

- `src/app/api/reports/unlock/route.ts`
- `tests/unit/app/paidUnlockRouteSource.test.ts`

Optional future files:

- `src/lib/payments/paidUnlockService.ts`
- `tests/unit/payments/paidUnlockService.test.ts`
- `src/lib/payments/paidUnlockTypes.ts`

## 4. Route 계약 초안

Route candidate:

`POST /api/reports/unlock`

Candidate input fields:

- `reportId`
- `orderId`
- `paymentProvider`
- `providerPaymentId`
- `amount`
- `currency`

Candidate output fields:

- `ok`
- `reportId`
- `accessMode`
- `paymentStatus`
- `unlockStatus`
- `messageKo`

## 5. Skeleton 동작

- skeleton should return disabled/unavailable while `PAID_UNLOCK_ENABLED=false`.
- skeleton should not verify real provider payment yet.
- skeleton should not mutate report/payment state.
- skeleton should not unlock reports.
- skeleton should not issue plaintext access token.
- skeleton should not store raw provider payload.

## 6. 입력 검증 경계

- validate JSON request shape.
- validate required IDs.
- validate amount/currency format.
- reject unsupported provider.
- return typed safe error.
- avoid exposing sensitive implementation details.

## 7. 결제 검증 경계

- client callback alone is not trusted.
- future implementation requires provider confirmation or verified webhook.
- amount/currency/product consistency required.
- duplicate confirm should be safe.
- failed/cancelled/refunded payment should not unlock.

## 8. 상태 전이 경계

- preview -> paid
- generated -> paid_unlocked
- pending/ready -> paid
- failed/cancelled/refunded -> no unlock
- deleted -> no unlock

Already-unlocked idempotency can return safe success or stable response later.

## 9. 접근 토큰/hash 경계

- plaintext access token is not stored.
- access token hash utility should be used in real implementation.
- skeleton should not expose hash.
- token issuance can be separate task.
- token rotation can be separate task.

## 10. 저장/증적 경계

- no persistence writes in skeleton if persistence is not ready.
- future implementation stores access mode/status transition.
- future implementation stores payment linkage metadata.
- future implementation stores timestamps.
- store minimal external reference only.
- no raw card data.
- no raw sensitive provider payload.
- audit/event table can be added later.

## 11. 보안/오남용 방어

- server-side route only.
- no secrets in client bundle.
- predictable ID guessing should not unlock.
- rate limiting or abuse guard later.
- least privilege persistence access later.
- logs avoid sensitive payloads.
- safe error messages.

## 12. 테스트 전략

- route file contains POST handler
- route returns disabled/unavailable while unlock disabled
- invalid request rejected
- no provider SDK import in skeleton
- no raw card data markers
- no plaintext token response
- no unlock side effect in skeleton
- no client-side paid override
- source markers for server-only boundary

## 13. 구현하지 않는 범위

- real payment confirmation
- real persistence mutation
- report unlock execution
- access token issuance
- refund handling
- webhook processing
- payment provider implementation
- production deployment

## 14. 완료 기준

- route skeleton compiles.
- disabled response is deterministic.
- no secrets/env leakage to client.
- no report unlock side effect.
- no raw access token exposure.
- release check passes.

## 15. 다음 개발 Task 제안

1. 60H — paid unlock API skeleton task spec source test
2. 61A — Supabase migration file task
3. 61B — runtime launch flag implementation task
4. 61C — webhook route skeleton implementation
5. 61D — paid unlock API route skeleton implementation
