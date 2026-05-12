# 결리포트 Paid Unlock Transaction Design

## 1. 목적

이 문서는 결제 성공 후 전체 리포트 접근 권한을 열기 위한 transaction 기준을 정의한다.

- successful payment가 full report access로 이어지는 흐름을 정리한다.
- payment success와 failure가 report state를 불일치하게 만들지 않도록 한다.
- payment adapter와 report persistence adapter의 책임을 분리한다.

## 2. 현재 상태

- payment는 비활성 상태다.
- in-memory payment adapter는 tests/dev only 용도다.
- in-memory persistence adapter는 tests/dev only 용도다.
- real provider는 구현되어 있지 않다.
- production DB는 구현되어 있지 않다.
- report preview와 gating UI는 존재한다.

## 3. 핵심 원칙

- payment success가 확인되어야 paid unlock을 진행한다.
- payment failure는 unlock으로 이어지면 안 된다.
- unlock은 report `status`, `accessMode`, payment linkage를 함께 갱신해야 한다.
- operation은 `orderId`와 `providerPaymentId` 기준으로 idempotent해야 한다.
- raw card data를 저장하지 않는다.
- access token은 payment proof가 아니다.

## 4. 정상 흐름

1. payment order 또는 session을 생성한다.
2. provider가 payment를 confirm한다.
3. server가 provider result와 amount를 검증한다.
4. server가 `reportId`로 report를 찾는다.
5. server가 payment linkage를 갱신한다.
6. server가 `accessMode`를 `paid`로 설정한다.
7. server가 `status`를 `paid_unlocked`로 설정한다.
8. server가 public paid access result를 반환한다.

## 5. 실패 흐름

- payment cancelled
- amount mismatch
- provider confirmation failed
- report not found
- already processed order
- payment success 이후 persistence update failed
- transaction이 완료되지 않으면 paid unlock은 closed 상태로 유지한다.

## 6. 멱등성 기준

- `orderId`를 primary idempotency key로 사용한다.
- `providerPaymentId`는 secondary external reference로 사용할 수 있다.
- repeated confirm은 double-unlock을 만들지 않아야 한다.
- repeated refund 또는 cancel은 stable state 또는 typed error를 반환해야 한다.
- 이후 audit/log event model이 필요할 수 있다.

## 7. 저장소 업데이트 기준

unlock patch 후보 field는 다음과 같다.

- `payment.orderId`
- `payment.provider`
- `payment.providerPaymentId`
- `payment.paymentStatus`
- `payment.amount`
- `payment.currency`
- `payment.paidAt`
- `accessMode`
- `status`
- `updatedAt`

status transition은 현재 type 기준으로 `generated` 또는 preview 상태에서 `paid_unlocked`로 이동하는 흐름을 검토한다.

## 8. 결제 Adapter 책임

- create session
- confirm
- cancel
- refund
- typed errors 반환
- report persistence를 직접 mutate하지 않음
- card data 저장하지 않음

## 9. Report Persistence Adapter 책임

- report record create, find, update 수행
- unlock patch 적용
- public projection을 안전하게 유지
- deleted report 접근 차단
- `accessTokenHash` 노출 방지

## 10. 보안/검증 기준

- amount와 currency가 일치해야 한다.
- provider가 일치해야 한다.
- `reportId`가 일치해야 한다.
- client가 전달한 paid status를 신뢰하지 않는다.
- server-side verification을 거친다.
- token hash는 report retrieval에 사용하며 payment proof로 사용하지 않는다.
- logs에는 card data 또는 plaintext access token을 남기지 않는다.

## 11. 구현 전 차단 조건

- provider decision
- production persistence provider
- schema/migration
- access token hash storage
- refund/support policy
- failure recovery plan
- release check pass
- manual QA pass

## 12. 보류 사항

- exact DB transaction mechanism
- webhook vs redirect confirmation
- partial refund policy
- admin recovery tooling
- audit event model
- customer receipt format

## 13. 다음 개발 Task 제안

1. 50B — paid unlock transaction design source test
2. 51A — final policy copy preparation
3. 52A — production persistence adapter task spec
4. 53A — payment provider implementation task spec
5. 54A — paid unlock API task spec
