-- Extend comprehensive report snapshot save/read RPCs to support narrative V2.
-- Existing migrations remain immutable; this migration replaces RPC bodies only.

create or replace function public.save_comprehensive_report_draft_snapshot(
  p_report_id text,
  p_provider_order_id text,
  p_report_snapshot jsonb,
  p_generation_model text default null,
  p_generation_version text default 'comprehensive_v2_draft'
)
returns table (
  report_id text,
  provider_order_id text,
  product_type text,
  snapshot_version text,
  generation_model text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report_id text := nullif(btrim(p_report_id), '');
  v_provider_order_id text := nullif(btrim(p_provider_order_id), '');
  v_generation_version text := nullif(btrim(p_generation_version), '');
  v_generation_model text := nullif(btrim(p_generation_model), '');
  v_snapshot_version text;
  v_order public.payment_orders%rowtype;
  v_report public.reports%rowtype;
  v_updated_at timestamptz := now();
begin
  if
    v_report_id is null or
    v_provider_order_id is null or
    p_report_snapshot is null or
    jsonb_typeof(p_report_snapshot) <> 'object'
  then
    raise exception 'REPORT_SNAPSHOT_INPUT_INVALID' using errcode = 'P0001';
  end if;

  v_snapshot_version := p_report_snapshot ->> 'version';

  if
    v_generation_version is null or
    v_snapshot_version not in ('comprehensive_v1_draft', 'comprehensive_v2_draft') or
    v_generation_version <> v_snapshot_version
  then
    raise exception 'REPORT_SNAPSHOT_VERSION_INVALID' using errcode = 'P0001';
  end if;

  if p_report_snapshot ->> 'productType' <> 'saju_mbti_full' then
    raise exception 'REPORT_SNAPSHOT_PRODUCT_INVALID' using errcode = 'P0001';
  end if;

  select *
  into v_order
  from public.payment_orders as payment_orders
  where payment_orders.provider_order_id = v_provider_order_id
  for update;

  if
    not found or
    v_order.deleted_at is not null or
    v_order.report_id <> v_report_id or
    v_order.status <> 'paid' or
    v_order.provider <> 'toss' or
    v_order.product_type <> 'saju_mbti_full' or
    v_order.amount <> 990 or
    v_order.currency <> 'KRW'
  then
    raise exception 'REPORT_PAYMENT_ORDER_NOT_FOUND' using errcode = 'P0001';
  end if;

  select *
  into v_report
  from public.reports as reports
  where reports.report_id = v_report_id
  for update;

  if
    not found or
    v_report.deleted_at is not null or
    v_report.status not in ('paid_unlocked', 'generated') or
    v_report.access_mode <> 'paid' or
    v_report.payment_status <> 'paid'
  then
    raise exception 'REPORT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if
    v_report.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft') and
    v_report.report_snapshot ->> 'productType' = 'saju_mbti_full'
  then
    if v_report.report_snapshot <> p_report_snapshot then
      raise exception 'REPORT_SNAPSHOT_ALREADY_EXISTS' using errcode = 'P0001';
    end if;

    return query
    select
      v_report.report_id,
      v_order.provider_order_id,
      v_order.product_type,
      v_report.report_snapshot ->> 'version',
      v_generation_model,
      'generated'::text,
      v_report.created_at,
      v_report.updated_at;
    return;
  end if;

  if
    v_report.report_snapshot ->> 'version' is not null or
    v_report.report_snapshot ->> 'productType' is not null
  then
    raise exception 'REPORT_SNAPSHOT_ALREADY_EXISTS' using errcode = 'P0001';
  end if;

  return query
  with updated_report as (
    update public.reports as reports
    set
      status = 'generated',
      report_snapshot = p_report_snapshot,
      report_version = v_snapshot_version,
      updated_at = v_updated_at
    where reports.report_id = v_report_id
    returning
      reports.report_id,
      reports.created_at,
      reports.updated_at
  )
  select
    updated_report.report_id,
    v_order.provider_order_id,
    v_order.product_type,
    v_snapshot_version,
    v_generation_model,
    'generated'::text,
    updated_report.created_at,
    updated_report.updated_at
  from updated_report;

  if not found then
    raise exception 'REPORT_SNAPSHOT_SAVE_FAILED' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public.save_comprehensive_report_draft_snapshot(
  text,
  text,
  jsonb,
  text,
  text
) from public;

grant execute on function public.save_comprehensive_report_draft_snapshot(
  text,
  text,
  jsonb,
  text,
  text
) to anon;

drop function if exists public.get_generated_comprehensive_report_result(text);

create or replace function public.get_generated_comprehensive_report_result(
  p_report_id text
)
returns table (
  report_id text,
  product_type text,
  status text,
  snapshot_status text,
  snapshot_version text,
  report_snapshot jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report_id text := nullif(btrim(p_report_id), '');
begin
  if v_report_id is null then
    raise exception 'REPORT_RESULT_INVALID_REPORT_ID' using errcode = 'P0001';
  end if;

  return query
  select
    reports.report_id,
    payment_orders.product_type,
    case
      when
        reports.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft') and
        reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        then 'generated'::text
      else 'ready'::text
    end as status,
    case
      when
        reports.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft') and
        reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        then 'generated'::text
      else 'missing'::text
    end as snapshot_status,
    case
      when
        reports.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft') and
        reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        then reports.report_snapshot ->> 'version'
      else null::text
    end as snapshot_version,
    case
      when
        reports.report_snapshot ->> 'version' in ('comprehensive_v1_draft', 'comprehensive_v2_draft') and
        reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        then reports.report_snapshot
      else null::jsonb
    end as report_snapshot,
    reports.created_at,
    reports.updated_at
  from public.reports as reports
  inner join public.payment_orders as payment_orders
    on payment_orders.report_id = reports.report_id
  where reports.report_id = v_report_id
    and reports.status in ('paid_unlocked', 'generated')
    and reports.access_mode = 'paid'
    and reports.payment_status = 'paid'
    and reports.deleted_at is null
    and payment_orders.status = 'paid'
    and payment_orders.provider = 'toss'
    and payment_orders.product_type = 'saju_mbti_full'
    and payment_orders.amount = 990
    and payment_orders.currency = 'KRW'
    and payment_orders.deleted_at is null
  limit 1;

  if not found then
    raise exception 'REPORT_RESULT_NOT_FOUND' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public.get_generated_comprehensive_report_result(text) from public;

grant execute on function public.get_generated_comprehensive_report_result(text) to anon;
