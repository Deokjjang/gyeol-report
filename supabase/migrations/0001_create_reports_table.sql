-- Gyeol Report reports table migration draft.
-- Not applied by this repository task.
-- Production RLS/access policies must be reviewed before public use.
-- Do not store plaintext access tokens.
-- Do not store raw card data.
-- Do not store raw sensitive provider payloads by default.

create table if not exists public.reports (
  report_id text not null,
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint reports_pkey primary key (report_id),
  constraint reports_status_check
    check (status in ('draft', 'generated', 'paid_unlocked', 'deleted')),
  constraint reports_access_mode_check
    check (access_mode in ('preview', 'paid')),
  constraint reports_payment_status_check
    check (
      payment_status is null
      or payment_status in ('not_required', 'pending', 'paid', 'failed', 'refunded')
    ),
  constraint reports_payment_currency_check
    check (
      payment_currency is null
      or payment_currency in ('KRW', 'JPY', 'USD')
    )
);

create index if not exists reports_status_idx
  on public.reports (status);

create index if not exists reports_access_mode_idx
  on public.reports (access_mode);

create index if not exists reports_created_at_idx
  on public.reports (created_at);

create unique index if not exists reports_payment_order_id_unique_idx
  on public.reports (payment_order_id)
  where payment_order_id is not null;

create index if not exists reports_payment_provider_payment_id_idx
  on public.reports (payment_provider_payment_id);

-- RLS policy is intentionally not finalized in this draft migration.
-- Public client access must not be granted directly to all reports.
-- Server-side routes should mediate report lookup and paid unlock flows.
