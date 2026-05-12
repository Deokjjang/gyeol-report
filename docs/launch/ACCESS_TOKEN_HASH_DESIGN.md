# 결리포트 Access Token Hash Design

## 1. 목적

이 문서는 production persistence 구현 전에 report access token을 어떻게 저장하고 확인할지 정리한다.

- 저장된 리포트 링크 접근에 쓰이는 access token 처리 기준을 정의한다.
- production 환경에서 plaintext token 저장을 피한다.
- 조회 API, 저장소 schema, logging 정책이 같은 보안 경계를 따르도록 한다.

## 2. 현재 상태

- `createReportAccessToken()` 유틸이 존재한다.
- 현재 token은 `rpat_...` 형식으로 생성된다.
- persistence types에는 아직 token hash 저장 필드가 없다.
- in-memory adapter는 아직 token 검증을 수행하지 않는다.
- production DB는 구현되어 있지 않다.

## 3. Access Token 역할

- 저장된 report link에 접근하거나 조회할 때 possession을 확인하는 값이다.
- 사용자가 report link 또는 token을 가지고 있음을 서버가 확인하는 데 사용한다.
- payment status를 대체하지 않는다.
- `accessMode`와 `status`가 허용하지 않으면 access token만으로 paid report를 열 수 없다.

## 4. 저장 원칙

- production에서는 plaintext access token을 저장하지 않는다.
- 저장소에는 hash만 저장한다.
- plaintext token은 생성 시 client에 한 번만 보여주는 흐름을 기본으로 한다.
- logs에는 plaintext token을 남기지 않는다.
- support 또는 admin view에서도 plaintext token을 노출하지 않는다.

## 5. Hash 전략

- server-side cryptographic hash를 사용한다.
- production에서 app-level secret 또는 pepper를 사용할 수 있다면 함께 고려한다.
- lookup 시 전달된 token에서 derived hash를 만들고 저장된 hash와 비교한다.
- algorithm과 provider 세부 사항은 utility 뒤에 감춘다.
- trust boundary 때문에 browser 또는 client-side hashing에 의존하지 않는다.

최종 algorithm은 구현 단계에서 별도로 확정한다.

## 6. 조회 흐름

1. client가 `reportId`와 access token으로 report 조회를 요청한다.
2. server가 `reportId`와 token format을 검증한다.
3. server가 token hash를 derived value로 만든다.
4. server가 `reportId`로 record를 찾는다.
5. server가 stored hash와 derived hash를 비교한다.
6. server가 `status`, `accessMode`, payment linkage를 확인한다.
7. server가 public preview, paid result, 또는 access denied result를 반환한다.

## 7. 만료/회전/재발급

- V1에서는 삭제 전까지 token을 stable하게 유지하는 방식을 검토할 수 있다.
- future token rotation은 old hash를 invalid 처리하는 방식으로 설계할 수 있다.
- regeneration은 이후 audit 또는 support record와 함께 남기는 방식을 검토한다.
- deleted report는 token이 있어도 접근할 수 없어야 한다.

## 8. 보안 주의사항

- plaintext token을 logs에 남기지 않는다.
- analytics payload에 token을 포함하지 않는다.
- 공유 화면이나 screenshot에 token이 노출되지 않도록 안내가 필요할 수 있다.
- production에서는 HTTPS를 사용한다.
- rate limiting은 이후 lookup API 단계에서 검토한다.
- access token은 payment proof가 아니다.

## 9. Persistence Schema 반영 후보

다음 필드는 현재 구현된 필드가 아니라 production schema 후보이다.

- `accessTokenHash`
- `accessTokenCreatedAt`
- `accessTokenRotatedAt`
- `accessTokenVersion`

## 10. 구현 전 차단 조건

- production env secret 또는 pepper 사용 여부 결정
- persistence schema 결정
- lookup API boundary 결정
- logging redaction 정책
- test vectors 또는 deterministic utility tests 준비
- release check pass

## 11. 다음 개발 Task 제안

1. 48B — access token hash design source test
2. 48C — access token hash utility
3. 48D — access token hash utility tests
4. 49A — production persistence schema draft
5. 50A — paid unlock transaction design
