# 결리포트 Paid Unlock API Task Spec

## 1. 목적

이 문서는 future paid report unlock API boundary를 정의한다.

- payment confirmation과 report persistence update를 안전하게 조율한다.
- paid unlock transaction을 API 레벨에서 어떻게 실행할지 기준을 잡는다.
- payment adapter와 report persistence adapter 연계를 명확히 한다.

## 2. 구현 전제

- payment provider가 선택되었거나 staged implementation 상태여야 한다.
- production persistence adapter가 선택되었거나 staged implementation 상태여야 한다.
- paid unlock transaction design이 존재한다.
- public paid launch 전에는 policy, refund, support copy가 준비되어야 한다.
- release check가 통과해야 한다.

## 3. 구현 대상

- API route candidate
- request validation
- payment confirmation lookup
- report lookup
- paid unlock update
- typed success/failure response
- later task가 명시하기 전 direct UI purchase behavior 제외

## 4. 구현 제외 대상

- payment provider SDK implementation
- production persistence provider implementation
- final policy page replacement
- admin recovery console
- analytics
- email/receipt sending
- raw card data handling

## 5. API 입력/출력 경계

candidate request fields는 다음과 같다.

- `orderId`
- `reportId`
- `provider`
- `providerPaymentId`
- `amount`
- `currency`

candidate success response는 다음 field를 포함할 수 있다.

- `ok`
- `reportId`
- `accessMode`
- `status`
- `paymentStatus`

failure response는 다음 형태를 따른다.

- `ok: false`
- `error.code`
- `error.messageKo`

## 6. 정상 처리 흐름

1. request를 validate한다.
2. `PaymentAdapter` 또는 trusted stored payment order로 payment를 confirm한다.
3. amount, currency, provider, `reportId`를 검증한다.
4. `ReportPersistenceAdapter`로 report를 load한다.
5. deleted 또는 missing report를 reject한다.
6. payment linkage를 update한다.
7. `accessMode`를 `paid`로 설정한다.
8. `status`를 `paid_unlocked`로 설정한다.
9. safe public result를 반환한다.

## 7. 실패 처리 흐름

- invalid request
- payment not found
- payment not paid
- amount/currency mismatch
- provider mismatch
- report not found
- deleted report
- persistence update failure
- duplicate 또는 already unlocked request

## 8. 멱등성/중복 처리

- `orderId`를 primary idempotency key로 사용한다.
- `providerPaymentId`는 external reference로 사용한다.
- repeated successful request는 stable success 또는 already-processed typed response를 반환한다.
- duplicate failure는 report state를 mutate하지 않는다.
- double-unlock side effects가 없어야 한다.

## 9. Payment Adapter 연계

- provider flow에 따라 `confirm` 또는 `find`를 사용한다.
- client가 전달한 paid status를 신뢰하지 않는다.
- `PaymentFailureCode`를 API error로 매핑한다.
- provider raw payload는 내부 경계에 둔다.
- `PaymentAdapter`는 report persistence를 직접 update하지 않는다.

## 10. Report Persistence Adapter 연계

- `reportId`로 report를 find한다.
- `accessMode`, `status`, payment linkage를 update한다.
- report snapshot을 보존한다.
- deleted report를 block한다.
- `accessTokenHash`를 노출하지 않는다.
- `PublicReportResult` 또는 safe API result를 반환한다.

## 11. 보안/검증 요구사항

- server-side only
- no raw card data
- no plaintext access token logs
- amount, currency, provider validation
- server-side payment result verification
- sanitized provider errors
- rate limiting later
- HTTPS in production

## 12. 테스트 요구사항

- success unlock
- invalid request
- payment not found
- amount mismatch
- provider mismatch
- report not found
- deleted report blocked
- duplicate unlock
- persistence update failure mapping
- raw card 또는 access token exposure 없음
- release check

## 13. 완료 기준

- API contract가 later task에서 구현된다.
- tests가 통과한다.
- lint/build가 통과한다.
- provider task가 요구하기 전 provider SDK를 추가하지 않는다.
- policy copy replacement를 포함하지 않는다.
- full paid flow 준비 전까지 payment inactive UI를 유지한다.
- 실제 route가 구현되면 docs를 갱신한다.

## 14. 다음 개발 Task 제안

1. 54B — paid unlock API task spec source test
2. 54C — paid unlock API contract types
3. 54D — paid unlock service skeleton
4. 54E — paid unlock service tests
5. 55A — final public policy page replacement
