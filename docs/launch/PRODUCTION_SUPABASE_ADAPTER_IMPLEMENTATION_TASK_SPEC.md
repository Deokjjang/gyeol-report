# 결리포트 Production Supabase Adapter Implementation Task Spec

## 1. 목적

- production Supabase adapter implementation task를 coding 전에 정의한다.
- 이 task spec은 실제 구현과 분리해 관리한다.
- 기존 provider-neutral persistence adapter 계약을 기준으로 구현 범위와 순서를 고정한다.

## 2. 현재 전제

- migration file exists.
- row mapper exists and is tested.
- Supabase adapter skeleton exists.
- persistence adapter interface is provider-neutral.
- production DB is not connected.
- payment remains inactive.

## 3. 구현 전 차단 조건

- Supabase project ready.
- migration reviewed.
- local/test database strategy decided.
- env/secrets strategy decided.
- RLS/access policy reviewed.
- backup/export plan available.
- release check pass.

## 4. 구현 대상 파일 후보

- src/lib/persistence/supabaseReportPersistenceAdapter.ts
- tests/unit/persistence/supabaseReportPersistenceAdapter.test.ts

Optional future files:

- src/lib/persistence/supabaseReportPersistenceClient.ts
- tests/unit/persistence/supabaseReportPersistenceClient.test.ts

## 5. Supabase client 경계

- client creation should be server-side only.
- service role key must not be exposed to client.
- prefer dependency injection for tests.
- no direct process.env access inside pure mapper.
- adapter may accept injected query client or config.
- no client-side imports.

## 6. Adapter method 구현 범위

- create: inserts mapped row and returns persisted record.
- update: applies controlled patch and maps updated row.
- find: supports lookup by reportId and access/payment boundaries according to current interface.
- softDelete: sets deleted status/timestamp instead of hard delete.
- list: returns bounded records and avoids unbounded scans.

## 7. Mapper 사용 규칙

- use mapPersistedReportRecordToSupabaseRow.
- use mapSupabaseRowToPersistedReportRecord.
- do not duplicate row mapping in adapter.
- mapper failure maps to typed adapter failure.
- snapshots pass through mapper boundary.

## 8. 오류 매핑 규칙

- duplicate report ID.
- not found.
- deleted record.
- permission/RLS failure.
- DB unavailable.
- mapper validation failure.
- unknown DB error.
- return typed failure result matching existing adapter result style.

## 9. 보안/비밀값 경계

- no raw card data.
- no plaintext access token storage.
- no secrets in logs.
- no secrets in client bundle.
- avoid raw provider payload.
- least privilege DB access.
- RLS/access policy must be reviewed before production.

## 10. 테스트 전략

- create success.
- duplicate create.
- update success.
- update not found.
- find success.
- find not found.
- soft delete.
- list bounded records.
- mapper failure.
- DB failure.
- no SDK/env/client marker in pure files.
- skeleton unavailable tests updated or split.

## 11. 구현하지 않는 범위

- actual paid unlock API.
- payment provider integration.
- webhook processing.
- admin console.
- analytics.
- accounting automation.
- production deployment.
- legal/support copy finalization.

## 12. 완료 기준

- adapter methods implemented.
- adapter tests pass.
- mapper tests remain pass.
- no skeleton unavailable behavior on production path.
- no secrets exposed.
- release check passes.
- migration application remains separately confirmed.

## 13. 다음 개발 Task 제안

1. 63B — production Supabase adapter implementation task spec source test
2. 63C — Supabase adapter query client boundary
3. 63D — Supabase adapter implementation
4. 63E — Supabase adapter tests
5. 64A — payment provider implementation preparation
