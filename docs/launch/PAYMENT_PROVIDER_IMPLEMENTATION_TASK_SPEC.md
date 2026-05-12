# 결리포트 Payment Provider Implementation Task Spec

## 1. 목적

이 문서는 future real payment provider implementation 범위를 정의한다.

- provider-specific code를 기존 payment adapter contract 뒤에 둔다.
- session, confirm, cancel, refund 구현 책임을 명확히 한다.
- paid unlock transaction과 payment adapter 책임을 분리한다.

## 2. 구현 전제

- final payment provider가 먼저 선택되어야 한다.
- production persistence path는 준비되었거나 staged 상태여야 한다.
- paid unlock transaction design이 존재한다.
- paid public launch 전에는 policy, refund, support copy가 준비되어야 한다.
- implementation 전후로 release check가 통과해야 한다.

## 3. 구현 대상

- provider-specific adapter file candidate
- provider client initialization boundary
- `createSession`
- `confirm`
- `cancel`
- `refund`
- provider가 lookup을 지원하거나 internal record를 쓰는 경우 `find`/`list`
- `providerPaymentId`/`orderId` mapping
- typed result mapping

## 4. 구현 제외 대상

- report persistence adapter implementation
- paid unlock API transaction
- final policy page replacement
- admin console
- analytics
- raw card data storage
- later task가 추가하기 전 direct UI purchase flow

## 5. Payment Adapter 계약

구현은 existing contract를 따라야 한다.

- `PaymentAdapter`
- `createSession`
- `confirm`
- `cancel`
- `refund`
- `find`
- `list`
- `PaymentOperationResult`
- `PaymentSessionResult`
- `PaymentFindResult`
- `PublicPaymentSummary`

## 6. 결제 세션 생성 흐름

- `reportId`, `productCode`, amount, currency를 검증한다.
- provider session 또는 order를 생성한다.
- `orderId`를 저장하거나 반환한다.
- 필요하면 `redirectUrl` 또는 `providerPayload`를 반환한다.
- session creation 단계에서는 paid unlock을 수행하지 않는다.
- 앱은 card data를 저장하지 않는다.

## 7. 결제 승인/확인 흐름

- provider result는 server에서 검증해야 한다.
- amount와 currency가 expected order와 일치해야 한다.
- `providerPaymentId`를 기록한다.
- duplicate confirmation은 idempotent하게 처리한다.
- success는 payment order state만 갱신한다.
- report unlock은 paid unlock transaction task의 책임이다.

## 8. 취소/환불 흐름

- provider가 지원하는 경우 paid state 전 cancel을 처리한다.
- provider가 지원하는 경우 paid state 이후 refund를 처리한다.
- repeated refund 또는 cancel은 stable state 또는 typed error를 반환해야 한다.
- early V1에서는 manual refund path가 허용될 수 있다.
- customer support path가 필요하다.

## 9. Paid Unlock 연계 경계

- `PaymentAdapter`는 report persistence를 직접 mutate하지 않는다.
- paid unlock transaction이 payment result와 report update를 조율한다.
- payment failure는 unlock으로 이어지면 안 된다.
- access token은 payment proof가 아니다.
- `orderId`와 `providerPaymentId`는 linkage metadata다.

## 10. 에러 처리 기준

- typed errors만 반환한다.
- provider error는 `PaymentFailureCode`로 매핑한다.
- user-facing Korean `messageKo`는 generic하게 유지한다.
- provider raw error detail을 client에 노출하지 않는다.
- sanitized diagnostic data만 log에 남긴다.

## 11. 보안 요구사항

- provider secrets는 platform env에만 둔다.
- source에 secrets를 넣지 않는다.
- raw card data를 저장하지 않는다.
- production에서는 HTTPS를 사용한다.
- webhook 또는 redirect를 쓰는 경우 verification이 필요하다.
- provider payload는 boundary에서 `unknown`으로 받고 내부에서 좁힌다.
- provider token과 payment identifier는 필요한 범위에서 redact한다.

## 12. 테스트 요구사항

- createSession success/failure
- confirm success
- amount mismatch
- duplicate confirm
- cancel success/failure
- refund success/failure
- provider error mapping
- raw card data storage 없음
- env hardcoding 없음
- release check

## 13. 완료 기준

- adapter가 existing interface를 구현한다.
- tests가 통과한다.
- lint/build가 통과한다.
- payment adapter 내부에서 report persistence를 mutate하지 않는다.
- 별도 task 전에는 paid unlock API를 포함하지 않는다.
- full flow 준비 전까지 payment inactive UI를 유지한다.
- provider-specific constraint가 발견되면 docs를 갱신한다.

## 14. 다음 개발 Task 제안

1. 53B — payment provider implementation task spec source test
2. 53C — choose concrete payment provider
3. 53D — provider adapter skeleton
4. 54A — paid unlock API task spec
5. 55A — final public policy page replacement
