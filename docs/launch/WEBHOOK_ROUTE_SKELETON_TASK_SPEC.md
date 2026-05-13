# 결리포트 Webhook Route Skeleton Task Spec

## 1. 목적

이 문서는 webhook route skeleton을 실제 구현 전에 정의한다.

- task spec과 actual route code를 분리한다.
- webhook route가 결제 상태 변경, 저장, paid unlock을 바로 수행하지 않도록 skeleton 경계를 둔다.
- 향후 Toss webhook 구현이 provider-neutral payment boundary를 따르도록 기준을 둔다.

## 2. 현재 전제

- payment webhook design draft exists.
- Toss is the first Korean V1 payment provider candidate.
- payment remains inactive.
- webhook route is not implemented.
- production persistence is not connected.
- paid unlock API is not implemented.

## 3. 구현 대상 파일 후보

Candidate files:

- `src/app/api/payments/toss/webhook/route.ts`
- `tests/unit/app/tossWebhookRouteSource.test.ts`

Optional future files:

- `src/lib/payments/tossWebhookTypes.ts`
- `src/lib/payments/tossWebhookMapper.ts`
- `tests/unit/payments/tossWebhookMapper.test.ts`

## 4. Route 계약 초안

Route candidate:

`POST /api/payments/toss/webhook`

- server-only handler.
- no client-side webhook handling.
- accepts provider event payload.
- returns safe JSON response.
- no secrets in response.

## 5. Skeleton 동작

- skeleton should parse request safely.
- skeleton should not verify real Toss signature yet unless secrets/config are ready.
- skeleton should return unavailable/disabled response while payment flags are disabled.
- skeleton should not mutate report/payment state.
- skeleton should not unlock reports.
- skeleton should not store raw provider payload.

## 6. 검증 경계

- future implementation verifies provider authenticity/signature.
- validate provider payment ID.
- validate internal order ID.
- validate amount/currency/product when available.
- reject or ignore inconsistent events safely.
- do not trust webhook alone for unlock.

## 7. 멱등성 경계

- idempotency by provider payment ID and internal order ID.
- duplicate events should not create duplicate unlock.
- duplicate fail/cancel/refund should not corrupt state.
- retries should be safe.
- processed event reference can be added after persistence is ready.

## 8. 상태 매핑 경계

Target statuses:

- ready
- pending
- paid
- failed
- cancelled
- refunded

Provider event should map into provider-neutral payment status.

## 9. 저장/증적 경계

- no persistence writes in skeleton if persistence is not ready.
- future implementation stores mapped status and minimal external reference.
- no raw card data.
- no raw sensitive provider payload by default.
- no plaintext access token.
- audit/event table can be added later.

## 10. 보안/로그 경계

- no secrets in client bundle.
- no secrets in logs.
- redact provider payloads.
- avoid logging sensitive payloads.
- server-side route only.
- least-privilege persistence access later.

## 11. 테스트 전략

- route file contains POST handler
- route returns disabled/unavailable while payment disabled
- no client-side imports
- no provider SDK import in skeleton
- no raw card data markers
- no unlock call in skeleton
- source markers for server-only boundary
- future mapper tests separated

## 12. 구현하지 않는 범위

- real Toss signature verification
- real provider API call
- real persistence mutation
- paid unlock execution
- refund automation
- admin console
- production deployment

## 13. 완료 기준

- route skeleton compiles.
- disabled response is deterministic.
- no secrets/env leakage to client.
- no report unlock side effect.
- no source/test/package/config files outside target task modified unless explicit implementation task allows it.
- release check passes.

## 14. 다음 개발 Task 제안

1. 60F — webhook route skeleton task spec source test
2. 60G — paid unlock API skeleton task spec
3. 61A — Supabase migration file task
4. 61B — runtime launch flag implementation task
5. 61C — webhook route skeleton implementation
