# 결리포트 Report Creation Persistence Integration Plan

## 1. 목적

이 문서는 future integration of persistence into report creation API를 정의한다.

이 계획은 implementation과 분리한다. `/api/reports/create`에 persistence 저장 흐름을 붙이기 전, 저장 record 생성 규칙, API response 경계, 오류 처리 경계, preview/paid 경계를 먼저 문서화한다.

## 2. 현재 전제

- `/api/reports/create` exists.
- `calculateSaju` and `buildReport` exist.
- `ReportPersistenceAdapter` exists.
- `createReportPersistenceRuntime` exists.
- production DB is not connected.
- payment remains inactive.

## 3. 통합 전 차단 조건

- persistence runtime factory tested.
- API error envelope reviewed.
- persisted input snapshot shape confirmed.
- persisted report snapshot shape confirmed.
- access token strategy reviewed.
- preview/paid boundary reviewed.
- release check pass.

## 4. 대상 파일 후보

대상 파일 후보:

- `src/app/api/reports/create/route.ts`
- `src/lib/persistence/reportPersistenceRuntime.ts`
- `tests/unit/app/createReportApi*.test.ts`
- `tests/unit/persistence/*.test.ts`

향후 분리 후보:

- `src/lib/report/reportPersistencePayload.ts`
- `tests/unit/report/reportPersistencePayload.test.ts`

## 5. 현재 Report Creation 흐름

현재 흐름:

1. parse request body.
2. validate input.
3. calculate saju.
4. build report.
5. return report response.

현재 경계:

- no persisted report ID yet.
- no DB write yet.
- current UI remains preview-oriented.

## 6. 통합 후 Report Creation 흐름

통합 후 흐름 초안:

1. parse request body.
2. validate input.
3. calculate saju.
4. build report.
5. create persisted input snapshot.
6. create persisted report snapshot.
7. call persistence runtime.
8. adapter.create.
9. return public report response with reportId.

응답 경계:

- internal persistence record must not be exposed directly.
- DB row must not be exposed.
- payment remains inactive.

## 7. Persisted Record 생성 규칙

- status starts as generated or current equivalent.
- access mode starts as preview.
- report version set.
- calculation version set.
- locale set.
- input snapshot excludes unnecessary raw data.
- report snapshot stores generated report structure.
- payment state remains not required/not started according to current type.
- access token/hash handling remains separate until lookup/unlock flow.

## 8. API Response 경계

- response keeps `{ ok: true, report }` compatibility if needed.
- reportId may be added only through public-safe field.
- no internal DB row.
- no access token unless separate token flow exists.
- no raw payment/provider payload.
- no secrets.
- failure uses existing typed error envelope.

## 9. 실패 처리 규칙

- validation failure remains current behavior.
- calculation failure maps to report creation failure.
- persistence unavailable maps to typed API error.
- duplicate report id maps to typed API error.
- mapper validation failure maps to typed API error.
- do not expose provider/raw DB errors.
- no partial paid unlock.

## 10. Preview/Paid 경계

- current preview UI remains unchanged.
- paid unlock remains inactive.
- report creation does not imply payment.
- preview access can be persisted.
- full paid access requires later unlock/token/payment verification.

## 11. 테스트 전략

테스트 후보:

- successful report creation calls persistence adapter.
- API response includes public-safe report id when enabled.
- persistence unavailable returns typed API error.
- validation failure does not call persistence.
- calculation/report build failure does not write persistence.
- response does not expose DB row.
- response does not expose access token.
- payment remains inactive.
- source marker test for no Supabase SDK import in API route.

## 12. 구현하지 않는 범위

- actual Supabase SDK client implementation.
- actual production DB connection.
- report lookup route.
- paid unlock API.
- Toss payment integration.
- webhook processing.
- admin console.
- analytics.
- production deployment.

## 13. 완료 기준

- integration plan exists.
- target files are identified.
- creation flow is defined.
- persisted record rules are defined.
- API response boundary is defined.
- failure handling is defined.
- preview/paid boundary is defined.
- test strategy is defined.
- no source changes.
- release check passes.

## 14. 다음 개발 Task 제안

1. 66B — report creation persistence integration plan source test
2. 66C — report persistence payload builder
3. 66D — report persistence payload builder tests
4. 66E — report creation API persistence integration skeleton
5. 67A — report lookup persistence plan
