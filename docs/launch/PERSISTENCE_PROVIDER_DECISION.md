# 결리포트 Persistence Provider Decision

## 1. 목적

이 문서는 실제 DB 구현 전에 결리포트의 production persistence provider 선택 기준을 정리한다.

- report persistence provider를 선택하기 전 검토 기준을 고정한다.
- 현재의 provider-neutral adapter 경계를 유지한다.
- 저장소 구현이 결제, 리포트 조회, 삭제 요청 경계와 어긋나지 않도록 한다.

## 2. 현재 저장소 전제

- 현재 앱에는 in-memory adapter만 존재한다.
- production DB는 아직 선택되지 않았다.
- 리포트 생성 preview는 동작한다.
- 실제 결제는 비활성 상태다.
- in-memory adapter는 테스트와 개발용 기반이며 production storage로 간주하지 않는다.

## 3. 저장 대상

- `reportId`
- `status`
- `accessMode`
- input snapshot
- report snapshot
- payment linkage metadata
- `createdAt`, `updatedAt`, `deletedAt`
- locale, report version, calculation version 등 version metadata

## 4. 저장하지 않을 대상

- raw card data
- provider secret keys
- 필요하지 않은 raw logs
- 리포트 조회나 고객 지원에 필요하지 않은 민감 데이터
- 보존 규칙이 정해지지 않은 장기 데이터

## 5. 후보 Provider

- Supabase/Postgres: 관계형 schema, structured query, SQL 기반 운영에 적합할 수 있다.
- Firebase/Firestore: 문서형 저장과 빠른 초기 구현에 적합할 수 있다.
- hosted Postgres through another provider: 배포 환경과 운영 정책에 따라 선택지가 될 수 있다.
- file/object storage: export 또는 archive 용도에 한정해 검토할 수 있으며 primary report lookup DB로 바로 가정하지 않는다.

## 6. 평가 기준

- Next.js integration complexity
- 한국, 일본, global 확장 준비도
- structured query 필요성
- security rules와 access control 구성 난이도
- backup과 export 지원
- deletion과 retention 운영 방식
- small scale 비용
- 운영 단순성
- future payment linkage와의 정합성

## 7. 한국 V1 권장 방향

1. provider-neutral adapter interface를 유지한다.
2. production DB는 launch hosting과 payment 방향이 정해진 뒤 하나만 선택한다.
3. 단순한 report lookup 중심이라면 Supabase/Postgres와 Firestore 모두 후보가 될 수 있다.
4. V1에서는 필요성이 확인되기 전까지 dual-provider 구현을 피한다.

이 방향은 현재 단계의 권장 검토안이며 provider 선택 완료를 의미하지 않는다.

## 8. 결제 연동과의 관계

- payment success는 report `accessMode`와 `status`를 갱신해야 한다.
- payment failure는 report unlock으로 이어지면 안 된다.
- `providerPaymentId`와 `orderId`는 metadata로만 저장한다.
- 앱은 card data를 저장하지 않는다.
- paid launch 전에는 report persistence와 retrieval 경계가 준비되어야 한다.

## 9. 개인정보/보존/삭제 경계

- birth input은 personal data로 취급한다.
- deletion과 retention policy는 명시되어야 한다.
- adapter 개념에는 soft delete가 존재한다.
- production hard-delete와 export policy는 아직 정의가 필요하다.
- support path는 `official@dvem.ai`를 기본으로 둔다.

## 10. 구현 전 차단 조건

- final provider decision이 없다.
- production env separation이 없다.
- retention/deletion policy가 없다.
- access token 또는 hash strategy가 없다.
- backup/export plan이 없다.
- release check가 실패한다.

## 11. 최소 Adapter 요구사항

- `create`
- `update`
- `find`
- `softDelete`
- `list` 또는 admin support용 조회
- deterministic public result shape
- raw payment card storage 없음
- clear error result

## 12. 보류 사항

- final provider
- schema와 migration 방식
- access token storage/hash
- admin lookup
- backup/export
- retention period
- paid unlock transaction boundary

## 13. 다음 개발 Task 제안

1. 46B — persistence provider decision source test
2. 47A — launch readiness final audit
3. 48A — access token hash design
4. 49A — production persistence schema draft
5. 50A — paid unlock transaction design
