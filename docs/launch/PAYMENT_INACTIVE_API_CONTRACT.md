# 결리포트 Payment Inactive API Contract

## 1. 목적

- 현재 결제 비활성 API 동작을 문서화한다.
- 이 비활성 계약은 향후 실제 결제 구현과 분리해 관리한다.
- 실제 결제 연동 전에는 비활성 응답이 현재 기준으로 유지되는지 확인한다.

## 2. 현재 전제

- payment remains inactive.
- real payment provider is not implemented.
- production persistence is not connected.
- webhook route is skeleton only.
- paid unlock route is skeleton only.

## 3. Launch flag 기본값

- PAYMENT_ENABLED=false
- PAID_UNLOCK_ENABLED=false
- PUBLIC_PAID_LAUNCH_ENABLED=false
- INTERNAL_PREVIEW_ENABLED=true

## 4. Toss webhook route 현재 계약

- Route: POST /api/payments/toss/webhook
- HTTP status: HTTP 503
- Response:
  - ok: false
  - code: PAYMENT_DISABLED
  - messageKo: 현재 결제 기능은 활성화되어 있지 않습니다.

현재 skeleton 계약:

- no request body parsing.
- no provider verification.
- no persistence mutation.
- no report unlock.

## 5. Paid unlock route 현재 계약

- Route: POST /api/reports/unlock
- HTTP status: HTTP 503
- Response:
  - ok: false
  - code: PAID_UNLOCK_DISABLED
  - messageKo: 현재 유료 리포트 잠금 해제 기능은 활성화되어 있지 않습니다.

현재 skeleton 계약:

- no request body parsing.
- no payment verification.
- no persistence mutation.
- no access token issuance.

## 6. 현재 금지 동작

- no payment checkout.
- no provider API call.
- no webhook processing.
- no paid unlock execution.
- no production persistence write.
- no plaintext access token issuance.
- no raw card data storage.

## 7. 향후 활성화 전 변경 조건

- production persistence ready.
- payment provider test flow verified.
- webhook verification implemented.
- paid unlock verification implemented.
- policy/refund/support copy reviewed.
- release check pass.
- manual QA pass.
- launch flag switch reviewed.

## 8. 테스트 기준

- launch flag utility tests.
- source tests for webhook route.
- source tests for paid unlock route.
- runtime tests for disabled route responses.
- UI boundary tests for payment inactive notices.
- release check.

## 9. 다음 개발 Task 제안

1. 61L — payment inactive API contract source test
2. 62A — Supabase row mapper task spec
3. 62B — Supabase row mapper implementation
4. 62C — Supabase row mapper tests
5. 63A — production Supabase adapter implementation
