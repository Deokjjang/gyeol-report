# 결리포트 Supabase Row Mapper Task Spec

## 1. 목적

- Supabase adapter를 구현하기 전에 mapper 경계를 정의한다.
- row mapping은 DB access와 분리해 관리한다.
- mapper는 provider-neutral persistence adapter 구현을 돕는 순수 변환 계층으로 둔다.

## 2. 현재 전제

- reports migration exists.
- Supabase adapter is still skeleton.
- production DB is not connected.
- persistence adapter interface is provider-neutral.
- access token plaintext must not be stored.
- payment remains inactive.

## 3. 구현 대상 파일 후보

- src/lib/persistence/supabaseReportPersistenceMapper.ts
- tests/unit/persistence/supabaseReportPersistenceMapper.test.ts

이 mapper는 pure 해야 하며 Supabase SDK를 import하지 않는다.

## 4. Row 타입 경계

후보 row fields:

- report_id
- status
- access_mode
- input_snapshot
- report_snapshot
- report_version
- calculation_version
- locale
- access_token_hash
- access_token_created_at
- access_token_rotated_at
- access_token_version
- payment_order_id
- payment_provider
- payment_provider_payment_id
- payment_status
- payment_amount
- payment_currency
- payment_paid_at
- payment_refunded_at
- created_at
- updated_at
- deleted_at

경계 기준:

- row type can be local TypeScript type before generated Supabase types.
- snapshots are JSON-compatible values.
- timestamps cross boundary as ISO strings or Date conversion should be explicit.

## 5. PersistedReportRecord -> Row 매핑

- id/reportId -> report_id
- status -> status
- accessMode -> access_mode
- inputSnapshot -> input_snapshot
- reportSnapshot -> report_snapshot
- reportVersion -> report_version
- calculationVersion -> calculation_version
- locale -> locale
- accessTokenHash -> access_token_hash
- paymentLinkage.orderId -> payment_order_id
- paymentLinkage.provider -> payment_provider
- paymentLinkage.providerPaymentId -> payment_provider_payment_id
- paymentLinkage.status -> payment_status
- paymentLinkage.amount.value -> payment_amount
- paymentLinkage.amount.currency -> payment_currency
- paymentLinkage.paidAt -> payment_paid_at
- paymentLinkage.refundedAt -> payment_refunded_at
- createdAt/updatedAt/deletedAt -> timestamps

## 6. Row -> PersistedReportRecord 매핑

- rebuild record shape from row.
- validate required fields.
- tolerate nullable payment fields.
- preserve deletedAt if present.
- avoid exposing internal DB-only fields if not part of record type.
- return typed failure or throw only programmer errors depending current project style.

## 7. JSONB snapshot 처리

- input_snapshot maps to inputSnapshot.
- report_snapshot maps to reportSnapshot.
- mapper should not mutate snapshots.
- invalid snapshot shape should fail safely.
- no raw provider payload in snapshots by mapper design.

## 8. Payment linkage 처리

- payment linkage may be null/absent before purchase.
- payment fields should reconstruct linkage only when relevant identifiers/status exist.
- amount/currency should be handled carefully.
- no raw card data.
- provider raw payload is not mapped by default.

## 9. Access token hash 처리

- store hash only.
- do not store plaintext token.
- mapper should not generate tokens.
- mapper should not expose hash through public preview records.
- token rotation fields can remain nullable until used.

## 10. 오류/검증 경계

- missing report_id.
- invalid status.
- invalid access_mode.
- invalid payment_status.
- invalid currency.
- invalid snapshot.
- invalid timestamp.
- unknown nullable fields.
- mapping error should be deterministic.

## 11. 테스트 전략

- full record to row.
- row to full record.
- record without payment linkage.
- record with paid linkage.
- deleted record mapping.
- snapshot preservation.
- invalid status rejection.
- invalid currency rejection.
- no plaintext token field.
- no Supabase SDK import.

## 12. 구현하지 않는 범위

- DB queries.
- Supabase client creation.
- env/secrets reads.
- migration application.
- paid unlock API.
- payment provider integration.
- webhook processing.
- admin/export tooling.

## 13. 완료 기준

- mapper is pure.
- mapper tests pass.
- no Supabase SDK import.
- no DB/network call.
- no raw access token storage.
- no raw card data mapping.
- release check passes.

## 14. 다음 개발 Task 제안

1. 62B — Supabase row mapper task spec source test
2. 62C — Supabase row mapper implementation
3. 62D — Supabase row mapper tests
4. 63A — production Supabase adapter implementation task spec
5. 63B — production Supabase adapter implementation
