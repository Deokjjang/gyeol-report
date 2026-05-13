# 결리포트 Production Persistence Adapter Implementation Plan

## 1. 목적

이 문서는 production persistence adapter 구현 전에 implementation plan을 정의한다.

- plan과 actual adapter implementation을 분리한다.
- Supabase/Postgres adapter가 기존 provider-neutral contract를 따르도록 기준을 둔다.
- migration, env, mapping, testing 순서를 구현 전에 정리한다.

## 2. 현재 전제

- Supabase/Postgres is first production persistence candidate.
- schema migration draft exists.
- Supabase adapter skeleton exists.
- report persistence adapter interface exists.
- access token hash utility exists.
- production DB is not connected.
- payment remains inactive.

## 3. 구현 전 차단 조건

- Supabase project ready.
- migration path decided.
- env/secrets strategy ready.
- RLS/access policy reviewed.
- backup/export plan ready.
- retention/deletion policy ready.
- local/dev test strategy ready.
- release check pass.

## 4. 구현 대상 파일 후보

Candidate files:

- `src/lib/persistence/supabaseReportPersistenceAdapter.ts`
- `tests/unit/persistence/supabaseReportPersistenceAdapter.test.ts`

Optional future files:

- `supabase/migrations/*`
- `src/lib/persistence/supabaseReportPersistenceMapper.ts`
- `tests/unit/persistence/supabaseReportPersistenceMapper.test.ts`

## 5. 환경 변수/비밀값 경계

- server-side only Supabase URL/key.
- service role key is not exposed to client.
- no env reads in client components.
- config injection preferred for tests.
- logs should not expose secrets.
- no plaintext access tokens in env/logs/storage.

## 6. 데이터 매핑 계획

Mapping from `PersistedReportRecord` to reports table fields:

- `id/reportId -> report_id`
- `status -> status`
- `accessMode -> access_mode`
- `inputSnapshot -> input_snapshot`
- `reportSnapshot -> report_snapshot`
- `reportVersion -> report_version`
- `calculationVersion -> calculation_version`
- `locale -> locale`
- `accessTokenHash -> access_token_hash`
- `paymentLinkage -> payment_* columns`
- `createdAt/updatedAt/deletedAt -> timestamps`

Snapshots는 Postgres JSONB serialization 대상으로 둔다.

## 7. Adapter method 구현 계획

- `create`: inserts a report record.
- `update`: applies controlled patch.
- `find`: looks up by reportId/access mode/payment status as supported by interface.
- `softDelete`: sets deleted status/timestamp.
- `list`: returns bounded results and avoids unbounded scans.

## 8. 오류 매핑 계획

- duplicate report ID
- not found
- deleted record
- DB unavailable
- validation/mapping error
- permission/RLS error
- unknown provider error
- map to typed public report error codes where possible

## 9. 접근 토큰/hash 처리 계획

- plaintext access token is not stored.
- access token hash utility used before persistence.
- adapter stores hash only.
- find should not expose hash publicly.
- token rotation fields handled later if needed.

## 10. 테스트 전략

- create success
- duplicate create
- update success
- update not found
- find preview/paid boundary
- soft delete
- list bounded records
- DB failure mapping
- no raw access token storage
- no client-side env markers
- skeleton unavailable tests replaced or split when real adapter lands

## 11. 마이그레이션/배포 순서

1. create migration file.
2. apply to local/test project.
3. generate or define typed row mapping.
4. implement mapper.
5. implement adapter.
6. update tests.
7. run release check.
8. run manual QA.
9. keep payment inactive until end-to-end checks pass.

## 12. 구현하지 않는 범위

- payment provider implementation
- paid unlock API implementation
- webhook route implementation
- admin console
- analytics
- accounting automation
- final legal/support copy replacement
- raw card data storage

## 13. 완료 기준

- adapter methods implemented and tested.
- no skeleton unavailable behavior remains for production path.
- release check passes.
- manual QA plan ready or passed depending phase.
- no secrets exposed.
- no raw access token storage.
- no production persistence claim before deployed verification.

## 14. 다음 개발 Task 제안

1. 60B — production persistence adapter implementation plan source test
2. 60C — launch switch/payment inactive flag design
3. 60D — webhook route skeleton task spec
4. 60E — paid unlock API skeleton task spec
5. 61A — Supabase migration file task
