# 결리포트 Report Lookup Persistence Plan

## 1. 목적

- persisted reportId를 사용해 future report lookup/read flow를 정의한다.
- lookup plan과 실제 구현 task를 분리해, API 구현 전 공개 응답과 접근 경계를 먼저 고정한다.

## 2. 현재 전제

- report creation returns reportId.
- persistence runtime exists.
- adapter find exists.
- preview-memory persistence is currently used.
- production DB is not connected.
- paid unlock remains inactive.
- access token flow is not implemented.

## 3. Lookup 구현 전 차단 조건

- persisted report response shape reviewed.
- public preview response shape reviewed.
- deleted/not-found behavior reviewed.
- access token strategy reviewed.
- paid/full access boundary reviewed.
- API error envelope reviewed.
- release check pass.

## 4. 대상 파일 후보

- `src/app/api/reports/[reportId]/route.ts`
- `src/lib/report/reportLookupResponse.ts`
- `tests/unit/app/reportLookupApi*.test.ts`
- `tests/unit/report/reportLookupResponse.test.ts`

Optional future file:

- `src/lib/persistence/reportAccessBoundary.ts`
- `tests/unit/persistence/reportAccessBoundary.test.ts`

## 5. Lookup 요청 흐름

- receive reportId.
- validate reportId.
- create persistence runtime.
- adapter.find.
- map persisted record to public response.
- return preview-safe report response.

응답 구성 시 다음 경계를 둔다.

- no DB row exposure.
- no raw persisted snapshot exposure.
- no payment provider raw exposure.

## 6. Adapter 조회 규칙

- use adapter.find.
- lookup by reportId.
- do not scan list for single lookup.
- deleted records must not be returned as normal success.
- production mode remains inactive until configured.

## 7. Public Response 경계

응답 후보:

```ts
{ ok: true, reportId, report, accessMode }
{ ok: false, error: { code, messageKo } }
```

- report is public-safe report structure.
- do not expose inputSnapshot.
- do not expose reportSnapshot directly if it contains internal wrapper.
- do not expose payment object.
- do not expose access token or token hash.
- do not expose adapter result object.

## 8. Preview/Paid Access 경계

- preview lookup returns preview-safe report.
- paid/full access requires future unlock/token/payment validation.
- current paid unlock remains inactive.
- lookup must not upgrade access mode.
- report creation does not imply paid access.

## 9. Deleted/Not Found 처리

- invalid reportId returns typed validation error.
- not found returns typed not-found error.
- deleted record returns not-found or deleted-safe error without report body.
- 민감한 내부 상태가 응답에서 드러날 수 있는 경우, 필요하면 구분을 줄인 오류 응답을 사용한다.

## 10. Access Token 경계

- access token verification is not implemented yet.
- token hash utility exists but is not wired to lookup.
- lookup route must not issue tokens.
- lookup route must not expose token hash.
- future paid/full lookup should verify token/payment boundary separately.

## 11. 실패 처리 규칙

- runtime unavailable.
- adapter find failure.
- mapper/persistence validation failure.
- invalid reportId.
- deleted/not found.
- unknown failure.
- use typed API error envelope.
- do not expose raw DB/provider errors.

## 12. 테스트 전략

- invalid reportId.
- found preview record returns public-safe response.
- not found returns typed error.
- deleted record is not exposed.
- adapter failure maps to typed API error.
- response does not expose snapshots.
- response does not expose payment object.
- response does not expose access token/hash.
- paid unlock remains inactive.
- no Supabase SDK import in route.

## 13. 구현하지 않는 범위

- actual lookup API implementation.
- access token verification.
- paid unlock API.
- Toss payment integration.
- webhook processing.
- production DB connection.
- admin console.
- analytics.
- production deployment.

## 14. 완료 기준

- lookup plan exists.
- target files are identified.
- request flow is defined.
- adapter lookup rules are defined.
- public response boundary is defined.
- preview/paid boundary is defined.
- deleted/not-found behavior is defined.
- access token boundary is defined.
- failure handling is defined.
- test strategy is defined.
- no source changes.
- release check passes.

## 15. 다음 개발 Task 제안

1. 67B — report lookup persistence plan source test
2. 67C — report lookup public response mapper
3. 67D — report lookup public response mapper tests
4. 67E — report lookup API skeleton
5. 68A — access token lookup boundary plan
