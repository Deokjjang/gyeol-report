# 결리포트 Launch Switch and Payment Inactive Flag Design

## 1. 목적

이 문서는 launch/payment switch behavior를 구현 전에 정의한다.

- design과 actual runtime flag implementation을 분리한다.
- paid flow가 준비되기 전 UI, API, paid unlock이 열리지 않도록 기준을 둔다.
- 내부 preview와 public paid launch 경계를 명확히 한다.

## 2. 현재 전제

- payment UI is inactive.
- home no-payment preview copy exists.
- /report/new payment inactive notice exists.
- real payment provider is not implemented.
- production persistence is not connected.
- paid unlock API is not implemented.
- public paid launch is blocked.

## 3. Flag 후보

Candidate flags:

- `PAYMENT_ENABLED`
- `PAID_UNLOCK_ENABLED`
- `PUBLIC_PAID_LAUNCH_ENABLED`
- `INTERNAL_PREVIEW_ENABLED`

이 flags는 이후 env-based 또는 config-based 방식으로 구현할 수 있다.

## 4. 기본 상태

Default values:

- `PAYMENT_ENABLED=false`
- `PAID_UNLOCK_ENABLED=false`
- `PUBLIC_PAID_LAUNCH_ENABLED=false`
- `INTERNAL_PREVIEW_ENABLED=true`

Paid flows는 default-deny로 둔다.

## 5. UI 노출 규칙

- when payment disabled, home shows no-payment preview copy.
- when payment disabled, /report/new shows payment inactive notice.
- purchase CTA must not start active checkout.
- full report unlock copy must not imply purchase is available.
- internal preview can show report structure.

## 6. API 차단 규칙

- payment session API blocked if `PAYMENT_ENABLED=false`.
- paid unlock API blocked if `PAID_UNLOCK_ENABLED=false`.
- public paid launch features blocked if `PUBLIC_PAID_LAUNCH_ENABLED=false`.
- blocked APIs return typed safe error.
- client cannot override flags.

## 7. Paid unlock 차단 규칙

- no unlock before confirmed payment.
- no unlock if paid unlock flag disabled.
- no unlock on failed/cancelled/refunded status.
- no unlock from client-only request.
- idempotent already-unlocked handling can be allowed later.

## 8. 전환 조건

Paid launch enablement 전에 아래 조건이 모두 충족되어야 한다.

- production persistence connected and verified.
- payment provider test flow verified.
- webhook route verified.
- paid unlock API verified.
- policy/refund/support copy reviewed.
- release check pass.
- manual QA pass.
- rollback plan exists.

## 9. Rollback 조건

- payment confirmation failure.
- webhook inconsistency.
- persistence failure.
- paid unlock mismatch.
- sensitive data exposure concern.
- policy/support blocker.
- manual QA blocker.

Rollback 시에는 paid flags를 먼저 disabled 상태로 되돌린다.

## 10. 테스트 전략

- default flags disabled
- home disabled copy visible
- /report/new inactive notice visible
- payment API blocked when disabled
- unlock API blocked when disabled
- client cannot enable paid flow
- enabling payment without unlock still blocks unlock
- rollback flag state restores disabled UI

## 11. 구현하지 않는 범위

- actual flag implementation
- payment provider implementation
- paid unlock API implementation
- webhook route implementation
- production deployment
- legal approval
- accounting automation

## 12. 다음 개발 Task 제안

1. 60D — launch switch/payment inactive flag design source test
2. 60E — webhook route skeleton task spec
3. 60F — paid unlock API skeleton task spec
4. 61A — Supabase migration file task
5. 61B — runtime launch flag implementation task
