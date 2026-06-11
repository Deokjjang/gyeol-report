-- Read a paid Toss saju_mbti_full report result by report id.
-- This returns a validated snapshot candidate only after a paid order is linked.
-- It does not expose stored input, provider payment ids, tokens, or secrets.

create or replace function public.get_generated_comprehensive_report_result(
  p_report_id text
)
returns table (
  report_id text,
  product_type text,
  status text,
  snapshot_status text,
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
        reports.status = 'generated' or
        (
          reports.report_snapshot ->> 'version' = 'comprehensive_v1_draft' and
          reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        )
        then 'generated'::text
      else 'ready'::text
    end as status,
    case
      when
        reports.status = 'generated' or
        (
          reports.report_snapshot ->> 'version' = 'comprehensive_v1_draft' and
          reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        )
        then 'generated'::text
      else 'missing'::text
    end as snapshot_status,
    case
      when
        reports.status = 'generated' or
        (
          reports.report_snapshot ->> 'version' = 'comprehensive_v1_draft' and
          reports.report_snapshot ->> 'productType' = 'saju_mbti_full'
        )
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
