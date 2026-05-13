# 결리포트 Supabase Schema Migration Draft

## 1. 목적

이 문서는 Supabase/Postgres 기반 production persistence 구현 전에 schema와 migration 방향을 초안으로 정리한다.

- 실제 적용된 migration과 분리된 draft 문서다.
- provider-neutral adapter contract를 유지하면서 Postgres 구현 후보를 검토한다.
- 이후 adapter 구현 task가 테이블, 인덱스, 접근 제어 범위를 혼동하지 않도록 기준을 둔다.

## 2. 현재 전제

- Supabase/Postgres는 1차 production persistence 후보로 기록되어 있다.
- production DB는 아직 연결되어 있지 않다.
- no migration applied 상태다.
- payment는 비활성 상태다.
- adapter interface는 provider-neutral 상태를 유지한다.

## 3. 테이블 후보

- primary table: `reports`
- 첫 draft에서는 별도 payments table을 만들지 않는다.
- payment linkage는 reports row에 flat columns 또는 JSON metadata로 포함할 수 있다.
- future table split은 결제 provider, 환불, audit 요구가 구체화된 뒤 검토한다.

## 4. reports 테이블 초안

후보 columns:

- `report_id`
- `status`
- `access_mode`
- `input_snapshot`
- `report_snapshot`
- `report_version`
- `calculation_version`
- `locale`
- `access_token_hash`
- `access_token_created_at`
- `access_token_rotated_at`
- `access_token_version`
- `payment_order_id`
- `payment_provider`
- `payment_provider_payment_id`
- `payment_status`
- `payment_amount`
- `payment_currency`
- `payment_paid_at`
- `payment_refunded_at`
- `created_at`
- `updated_at`
- `deleted_at`

Postgres를 사용할 경우 `input_snapshot`과 `report_snapshot`은 JSONB 후보로 둔다.

## 5. payment_linkage 표현 방식

- V1은 simpler querying을 위해 flat columns를 우선 후보로 둔다.
- payment raw provider payload는 기본 저장 대상에서 제외한다.
- no raw card data 원칙을 유지한다.
- `orderId`와 `providerPaymentId`는 linkage metadata로만 취급한다.

## 6. access token hash 필드

- `access_token_hash`를 저장한다.
- plaintext token은 production 저장 대상에서 제외한다.
- token version fields는 future rotation 대응을 위한 후보로 둔다.
- lookup은 server-side에서 derived hash를 계산해 저장된 hash와 비교한다.

## 7. 인덱스 초안

Candidate indexes:

- `reports(report_id)`
- `reports(status)`
- `reports(access_mode)`
- `reports(created_at)`
- `reports(payment_order_id)`
- `reports(payment_provider_payment_id)`

Unique constraints 후보:

- `report_id unique`
- `payment_order_id unique where not null`
- `payment_provider_payment_id`는 provider behavior에 따라 indexed 또는 unique 후보로 둔다.

## 8. RLS/접근 제어 초안

- no direct client writes 원칙을 둔다.
- server-side service role 또는 server-only route가 writes를 담당한다.
- public lookup은 server route를 통해 처리한다.
- RLS policy가 전체 reports를 노출하지 않도록 검토한다.
- admin access는 이후 별도 task에서 다룬다.
- `access_token_hash`는 client response에 노출하지 않는다.

## 9. 마이그레이션 SQL 초안

```sql
-- Draft only: this SQL is not applied.
-- Review Supabase project, RLS, retention, backup, and adapter contract before use.

create table if not exists reports (
  report_id text primary key,
  status text not null,
  access_mode text not null,
  input_snapshot jsonb not null,
  report_snapshot jsonb not null,
  report_version text not null,
  calculation_version text not null,
  locale text not null,
  access_token_hash text not null,
  access_token_created_at timestamptz not null,
  access_token_rotated_at timestamptz,
  access_token_version text not null,
  payment_order_id text,
  payment_provider text,
  payment_provider_payment_id text,
  payment_status text,
  payment_amount numeric,
  payment_currency text,
  payment_paid_at timestamptz,
  payment_refunded_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create unique index if not exists reports_report_id_uidx
  on reports (report_id);

create index if not exists reports_status_idx
  on reports (status);

create index if not exists reports_access_mode_idx
  on reports (access_mode);

create index if not exists reports_created_at_idx
  on reports (created_at);

create unique index if not exists reports_payment_order_id_uidx
  on reports (payment_order_id)
  where payment_order_id is not null;

create index if not exists reports_payment_provider_payment_id_idx
  on reports (payment_provider_payment_id);
```

## 10. 적용 전 차단 조건

- Supabase project created
- env/secrets separation
- retention/deletion policy
- access policy/RLS reviewed
- local migration strategy
- backup/export plan
- release check pass
- manual QA pass

## 11. 보류 사항

- exact migration file path
- generated types
- RLS final policy
- service-role usage boundary
- admin tooling
- separate payment table decision
- audit/event table

## 12. 다음 개발 Task 제안

1. 58D — Supabase schema migration draft source test
2. 58E — Supabase persistence adapter skeleton
3. 58F — Supabase persistence adapter tests
4. 59A — choose concrete payment provider
5. 60A — production persistence adapter implementation plan
