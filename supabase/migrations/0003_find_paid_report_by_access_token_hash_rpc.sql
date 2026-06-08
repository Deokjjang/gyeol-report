-- Narrow paid report lookup RPC.
-- This intentionally does not grant table SELECT to anon.

create or replace function public.find_paid_report_by_access_token_hash(
  p_access_token_hash text
)
returns table (
  report_id text,
  status text,
  access_mode text,
  input_snapshot jsonb,
  report_snapshot jsonb,
  report_version text,
  calculation_version text,
  locale text,
  payment_status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    reports.report_id,
    reports.status,
    reports.access_mode,
    reports.input_snapshot,
    reports.report_snapshot,
    reports.report_version,
    reports.calculation_version,
    reports.locale,
    reports.payment_status,
    reports.created_at,
    reports.updated_at
  from public.reports
  where reports.access_token_hash = p_access_token_hash
    and reports.status = 'paid_unlocked'
    and reports.access_mode = 'paid'
    and reports.payment_status = 'paid'
    and reports.deleted_at is null
  limit 1;
$$;

revoke all on function public.find_paid_report_by_access_token_hash(text) from public;
grant execute on function public.find_paid_report_by_access_token_hash(text) to anon;
