# 결리포트 Production Persistence Schema Draft

## 1. 목적

이 문서는 provider-specific DB 구현 전에 production report persistence schema 초안을 정의한다.

- production report 저장 구조를 미리 정리한다.
- provider-neutral adapter contract와 맞는 field boundary를 유지한다.
- 결제, access token hash, 삭제 요청이 같은 저장 경계를 따르도록 한다.

## 2. 현재 상태

- 현재 저장 구현은 in-memory adapter only 상태다.
- production DB는 구현되어 있지 않다.
- access token hash utility는 존재한다.
- payment는 비활성 상태다.
- persistence provider decision은 final 상태가 아니다.

## 3. 설계 원칙

- report metadata와 report snapshot을 저장한다.
- plaintext access token을 저장하지 않는다.
- card 또는 payment raw data를 저장하지 않는다.
- public projection과 internal record를 분리한다.
- soft delete를 지원한다.
- 가능한 범위에서 provider-neutral field name을 유지한다.

## 4. reports 테이블/컬렉션 후보

reports record 후보 field는 다음과 같다.

- `reportId`
- `status`
- `accessMode`
- `inputSnapshot`
- `reportSnapshot`
- `reportVersion`
- `calculationVersion`
- `locale`
- `createdAt`
- `updatedAt`
- `deletedAt`

## 5. payment_linkage 필드 후보

payment linkage 후보 field는 다음과 같다.

- `orderId`
- `provider`
- `providerPaymentId`
- `paymentStatus`
- `amount`
- `currency`
- `paidAt`
- `refundedAt`

위 field는 결제 metadata 용도이며 card data 저장을 의미하지 않는다.

## 6. access token hash 필드 후보

access token hash 후보 field는 다음과 같다.

- `accessTokenHash`
- `accessTokenCreatedAt`
- `accessTokenRotatedAt`
- `accessTokenVersion`

production에서는 plaintext token을 저장하지 않는다.

## 7. public result projection

- public result는 report access에 필요한 field만 포함해야 한다.
- payment provider 내부 field는 public result에 노출하지 않는다.
- token hash는 public result에 노출하지 않는다.
- deleted report는 access-denied 또는 not-found style result를 반환한다.
- paid access는 `status`, `accessMode`, payment linkage에 따라 결정된다.

## 8. 삭제/보존 필드

- soft delete는 `status`와 `deletedAt`을 사용한다.
- hard delete policy는 이후 정의한다.
- retention period는 final 상태가 아니다.
- public paid launch 전에는 support/delete request path가 있어야 한다.

## 9. 인덱스 후보

provider별 syntax는 다를 수 있으나 index 후보는 다음과 같다.

- `reportId`
- `status`
- `accessMode`
- `createdAt`
- `payment.orderId`
- `payment.providerPaymentId`

## 10. 보안/접근 제어

- write는 server-side access만 허용한다.
- public lookup은 `reportId`와 access token hash 검증을 거쳐야 한다.
- client direct write는 허용하지 않는다.
- raw card data를 저장하지 않는다.
- logs는 token을 redact해야 한다.
- admin access는 제한되어야 한다.

## 11. 마이그레이션 전 차단 조건

- final provider decision
- env/secrets separation
- access token hash storage decision
- backup/export plan
- deletion/retention policy
- release check pass
- manual QA pass

## 12. 보류 사항

- provider-specific schema syntax
- migration file
- admin tooling
- export format
- hard delete process
- paid unlock transaction boundary

## 13. 다음 개발 Task 제안

1. 49B — production persistence schema draft source test
2. 50A — paid unlock transaction design
3. 51A — final policy copy preparation
4. 52A — production persistence adapter task spec
5. 53A — payment provider implementation task spec
