# 결리포트 Production Persistence Adapter Task Spec

## 1. 목적

이 문서는 future production persistence adapter 구현 범위를 정의한다.

- provider-specific code를 기존 adapter contract 뒤에 둔다.
- production DB 구현 전에 필요한 책임, 보안, 테스트 기준을 고정한다.
- payment, API, UI 구현과 persistence adapter 구현 범위를 분리한다.

## 2. 구현 전제

- final provider가 먼저 선택되어야 한다.
- production schema와 migration draft가 준비되어야 한다.
- access token hash utility가 존재한다.
- payment는 별도 task 전까지 비활성 상태다.
- implementation 전후로 release check가 통과해야 한다.

## 3. 구현 대상

- production adapter file candidate
- provider client initialization boundary
- `create`, `update`, `find`, `softDelete`, `list`
- report snapshot persistence
- payment linkage metadata persistence
- accessTokenHash persistence

## 4. 구현 제외 대상

- payment provider implementation
- paid unlock API
- policy page final copy
- admin console
- analytics
- raw card data storage

## 5. Adapter 계약

구현은 existing contract를 따라야 한다.

- `ReportPersistenceAdapter`
- `create`
- `update`
- `find`
- `softDelete`
- `list`
- `PublicReportResult`
- `PersistedReportRecord`

## 6. Access Token Hash 처리

- plaintext token은 creation 또는 lookup boundary에서만 입력값으로 받는다.
- 저장소에는 plaintext token이 아니라 `accessTokenHash`를 저장한다.
- hash 생성은 `hashReportAccessToken()`을 사용한다.
- lookup은 token hash를 검증한 뒤 private 또는 paid access를 반환한다.
- logs에는 token을 노출하지 않는다.

## 7. Report 저장/조회 흐름

- report record를 생성한다.
- `reportId`와 accessToken을 생성한다.
- access token을 hash 처리한다.
- report snapshot을 저장한다.
- client-safe result를 반환한다.
- `reportId`로 record를 찾는다.
- token hash를 검증한다.
- `status`, `accessMode`, payment linkage를 확인한다.
- public projection을 반환한다.

## 8. 삭제/보존 처리

- `softDelete`는 `status`와 `deletedAt`을 갱신한다.
- deleted report는 접근할 수 없어야 한다.
- hard delete policy는 이후 정의한다.
- retention period는 public paid launch 전 정의되어야 한다.

## 9. 에러 처리 기준

- typed result만 반환한다.
- raw provider error를 caller에 그대로 던지지 않는다.
- provider error는 가능한 범위에서 existing error code로 매핑한다.
- access denied와 not found는 노출 범위를 신중하게 정한다.
- Korean user-facing `messageKo`는 안전하고 generic하게 유지한다.

## 10. 테스트 요구사항

- create/find success
- invalid token rejected
- wrong token rejected
- deleted report blocked
- paid access boundary
- update payment linkage
- duplicate reportId handling
- provider failure mapping
- stored record 또는 log mock에 plaintext token 없음
- release check

## 11. 보안 요구사항

- server-side writes only
- no client direct write
- no raw card data
- token redaction
- env/secrets not hardcoded
- least-privilege provider credentials
- backup/export plan later

## 12. 완료 기준

- adapter가 existing interface를 구현한다.
- tests가 통과한다.
- lint/build가 통과한다.
- payment implementation을 포함하지 않는다.
- later task가 명시하기 전까지 UI/API behavior를 변경하지 않는다.
- provider-specific constraint가 발견되면 documentation을 갱신한다.

## 13. 다음 개발 Task 제안

1. 52B — production persistence adapter task spec source test
2. 52C — choose concrete persistence provider
3. 52D — provider schema/migration task
4. 52E — production adapter implementation
5. 54A — paid unlock API task spec
