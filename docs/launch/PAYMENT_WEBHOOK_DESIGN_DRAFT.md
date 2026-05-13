# 결리포트 Payment Webhook Design Draft

## 1. 목적

이 문서는 webhook processing boundary를 실제 구현 전에 정의한다.

- design draft와 actual route implementation을 분리한다.
- provider-specific webhook을 provider-neutral payment status로 옮기는 기준을 둔다.
- 결제 상태 변경과 paid unlock 연계가 섞이지 않도록 처리 경계를 정리한다.

## 2. 현재 전제

- Toss Payments is first Korean V1 candidate.
- payment adapter is provider-neutral.
- production persistence is not connected.
- paid unlock API is not implemented.
- payment UI remains inactive.
- webhook route is not implemented.

## 3. Webhook 대상 이벤트

- payment approved/paid
- payment cancelled
- payment failed
- refund/partial refund
- duplicate or repeated delivery
- unknown provider event

## 4. 수신 엔드포인트 초안

Candidate route:

`/api/payments/toss/webhook`

- server-only route로 둔다.
- no client-side webhook handling 원칙을 둔다.
- signature verification을 위해 raw body handling이 필요할 수 있다.
- provider-specific handler는 provider-neutral payment status로 mapping한다.

## 5. 검증 절차

- verify provider authenticity/signature if available.
- validate provider/order IDs.
- validate amount/currency/product when relevant.
- load internal payment order.
- compare expected state before state transition.
- reject or ignore inconsistent events safely.
- do not trust webhook alone for unlock without consistency checks.

## 6. 멱등성 처리

- idempotency by provider payment ID and internal order ID.
- duplicate paid event should not unlock twice.
- duplicate cancel/fail/refund event should not corrupt state.
- event processing should be safe on retry.
- persistence가 준비되면 processed event reference 또는 status transition marker를 저장한다.

## 7. 상태 매핑

Provider-neutral target statuses:

- ready
- pending
- paid
- failed
- cancelled
- refunded

위 status는 existing payment status model로 mapping한다.

## 8. 저장 범위

- store provider payment ID.
- store order ID.
- store mapped status.
- store amount/currency.
- store timestamps.
- store minimal external reference.
- do not store raw card data.
- do not store raw sensitive payload by default.
- avoid storing secrets/signatures in records.

## 9. paid unlock 연계

- only confirmed paid state can trigger unlock.
- amount/currency/product consistency required.
- report access mode/status update happens after payment confirmation.
- failed/cancelled/refunded status does not unlock.
- refund after unlock requires separate product decision.
- access token hash boundary remains unchanged.

## 10. 오류/재시도 처리

- invalid signature
- order not found
- amount mismatch
- unsupported event
- duplicate event
- persistence failure
- provider retry
- internal retry/backoff
- return safe HTTP status strategy

## 11. 보안/로그 정책

- server-side secrets only.
- no secrets in client bundle.
- no raw card data.
- no plaintext access token.
- logs avoid sensitive payloads.
- redact provider payloads.
- audit/event record can be added later.
- least-privilege route handling.

## 12. 테스트 전략

- valid paid webhook
- invalid signature/authenticity
- unknown order
- amount mismatch
- duplicate paid webhook
- failed/cancelled mapping
- refund mapping
- unsupported event
- persistence failure behavior
- no sensitive markers in source

## 13. 적용 전 차단 조건

- Toss webhook documentation checked during implementation.
- webhook secret/key ready.
- endpoint URL decided.
- persistence linkage ready.
- paid unlock transition ready.
- manual QA plan ready.
- release check pass.
- payment inactive flag remains until full end-to-end verification.

## 14. 다음 개발 Task 제안

1. 59F — payment webhook design draft source test
2. 59G — paid unlock API implementation plan
3. 60A — production persistence adapter implementation plan
4. 60B — launch switch/payment inactive flag design
5. 60C — webhook route skeleton task spec
