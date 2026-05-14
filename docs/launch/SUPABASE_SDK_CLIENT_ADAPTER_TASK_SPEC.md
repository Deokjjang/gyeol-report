# 결리포트 Supabase SDK Client Adapter Task Spec

## 1. 목적

이 문서는 향후 Supabase SDK-backed query client adapter task 범위를 코딩 전에 정의한다.

SDK client는 순수 mapper와 persistence adapter에서 분리해 둔다. `SupabaseReportPersistenceQueryClient` 인터페이스를 구현하는 서버 전용 어댑터로 다루며, 이 문서는 실제 구현이나 DB 연결을 포함하지 않는다.

## 2. 현재 전제

- `SupabaseReportPersistenceQueryClient` exists.
- `createSupabaseReportPersistenceAdapter` accepts injected query client.
- row mapper exists and is tested.
- migration exists.
- no production DB connection yet.
- payment remains inactive.

## 3. 구현 전 차단 조건

- Supabase project created.
- reports table migration reviewed.
- migration application procedure confirmed.
- service role usage reviewed.
- server-only runtime boundary confirmed.
- env var naming decided.
- local/test DB or fake SDK strategy decided.
- RLS/access policy reviewed.
- backup/export plan available.
- release check pass.

## 4. 구현 대상 파일 후보

구현 대상 후보:

- `src/lib/persistence/supabaseReportPersistenceSdkClient.ts`
- `tests/unit/persistence/supabaseReportPersistenceSdkClient.test.ts`

향후 통합 테스트 후보:

- `tests/integration/persistence/supabaseReportPersistenceSdkClient.integration.test.ts`

## 5. 서버 전용 경계

- SDK client must be server-side only.
- no import from client components.
- no import from browser-executed code.
- avoid exposing service role key.
- route handlers/server actions may compose it later.
- pure mapper must remain SDK-free.

## 6. 환경변수/비밀값 경계

- env vars should be read in one server-only boundary.
- no env read in mapper.
- no env read in report generation logic.
- no secrets in logs.
- no secrets in client bundle.
- no hardcoded keys.
- recommended env names:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- do not use `NEXT_PUBLIC_` for service role key.

## 7. Query Client 구현 범위

구현 범위는 기존 `SupabaseReportPersistenceQueryClient` 메서드에 맞춘다.

- `insertReport`
  - insertReport maps Supabase insert result to `SupabaseReportQueryResult<SupabaseReportRow>`.
- `updateReport`
  - updateReport updates by `report_id`, returns updated row.
- `findReportById`
  - findReportById returns row or null.
- `listReports`
  - listReports uses bounded limit and stable ordering.

모든 메서드는 typed `SupabaseReportQueryResult`를 반환한다.

## 8. DB 오류 매핑 규칙

SDK/DB 오류는 query client 경계에서 다음 코드로 매핑한다.

- `DB_UNAVAILABLE`
- `DUPLICATE_REPORT_ID`
- `NOT_FOUND`
- `PERMISSION_DENIED`
- `UNKNOWN_DB_ERROR`

세부 규칙:

- duplicate key / unique violation → `DUPLICATE_REPORT_ID`
- no row → `NOT_FOUND` or null depending on method
- RLS/permission failure → `PERMISSION_DENIED`
- connection/config failure → `DB_UNAVAILABLE`
- unknown provider error → `UNKNOWN_DB_ERROR`

## 9. RLS/권한 검토

- service role bypass risk must be reviewed.
- least privilege should be preferred where possible.
- report access should remain app-controlled.
- no broad public table access.
- production policy must be reviewed before launch.
- raw sensitive payload should not be stored.

## 10. 테스트 전략

테스트는 SDK client adapter 경계를 중심으로 작성한다.

- insert success.
- duplicate insert mapping.
- update success.
- update not found.
- find success.
- find null.
- list bounded limit.
- permission failure.
- unavailable/config failure.
- unknown DB error.
- no `NEXT_PUBLIC_` service role usage.
- no client-side import markers.
- no mapper SDK import.

## 11. 구현하지 않는 범위

- actual paid unlock API.
- Toss payment integration.
- webhook processing.
- production deployment.
- admin console.
- analytics.
- legal/support copy finalization.
- applying migration to production DB.

## 12. 완료 기준

- SDK-backed query client file exists.
- query client implements existing interface.
- no SDK import in mapper.
- no secrets exposed.
- env boundary is server-only.
- adapter tests remain pass.
- query client tests pass.
- release check passes.
- actual production DB migration/application confirmed separately.

## 13. 다음 개발 Task 제안

1. 64B — Supabase SDK client adapter task spec source test
2. 64C — Supabase SDK client adapter implementation
3. 64D — Supabase SDK client adapter tests
4. 65A — production persistence wiring plan
5. 65B — payment provider implementation preparation
