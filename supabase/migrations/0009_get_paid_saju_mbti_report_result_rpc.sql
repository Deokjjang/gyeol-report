-- Read a paid Toss saju_mbti_full report result by report id.
-- This returns only a minimal report-ready view for the direct result entry page.
-- It does not issue share links or expose private stored request/payment fields.

create or replace function public.get_paid_saju_mbti_report_result(
  p_report_id text
)
returns table (
  report_id text,
  product_type text,
  status text,
  title text,
  placeholder_text text,
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
    raise exception 'PAID_REPORT_RESULT_INVALID_REPORT_ID' using errcode = 'P0001';
  end if;

  return query
  select
    reports.report_id,
    payment_orders.product_type,
    'ready'::text as status,
    '사주×MBTI 종합 리포트'::text as title,
    case
      when reports.report_snapshot ->> 'kind' = 'paid_saju_mbti_fulfillment_placeholder'
        then reports.report_snapshot ->> 'message'
      else '결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.'
    end as placeholder_text,
    reports.created_at,
    reports.updated_at
  from public.reports as reports
  inner join public.payment_orders as payment_orders
    on payment_orders.report_id = reports.report_id
  where reports.report_id = v_report_id
    and reports.status = 'paid_unlocked'
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
    raise exception 'PAID_REPORT_RESULT_NOT_FOUND' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public.get_paid_saju_mbti_report_result(text) from public;

grant execute on function public.get_paid_saju_mbti_report_result(text) to anon;
