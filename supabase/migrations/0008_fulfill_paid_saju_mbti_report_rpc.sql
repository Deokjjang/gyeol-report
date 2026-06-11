-- Fulfill a paid Toss saju_mbti_full payment order into a minimal report row.
-- This boundary links payment_orders.report_id only after paid status exists.
-- It does not issue share links or return stored private snapshots.

create or replace function public.fulfill_paid_saju_mbti_report(
  p_provider_order_id text
)
returns table (
  payment_order_id text,
  provider_order_id text,
  report_id text,
  product_type text,
  status text,
  amount integer,
  currency text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.payment_orders%rowtype;
  v_provider_order_id text := nullif(btrim(p_provider_order_id), '');
  v_report_id text;
  v_created_at timestamptz := now();
  v_updated_at timestamptz := now();
  v_access_token_hash text;
begin
  if v_provider_order_id is null then
    raise exception 'PAID_REPORT_FULFILLMENT_INVALID_PROVIDER_ORDER_ID' using errcode = 'P0001';
  end if;

  select *
  into v_order
  from public.payment_orders as payment_orders
  where payment_orders.provider_order_id = v_provider_order_id
  for update;

  if not found or v_order.deleted_at is not null then
    raise exception 'PAYMENT_ORDER_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_order.status <> 'paid' then
    raise exception 'PAYMENT_ORDER_NOT_PAID' using errcode = 'P0001';
  end if;

  if
    v_order.provider <> 'toss' or
    v_order.product_type <> 'saju_mbti_full' or
    v_order.amount <> 990 or
    v_order.currency <> 'KRW'
  then
    raise exception 'PAYMENT_ORDER_INVALID_CONTEXT' using errcode = 'P0001';
  end if;

  if v_order.report_id is not null then
    return query
    select
      v_order.payment_order_id,
      v_order.provider_order_id,
      v_order.report_id,
      v_order.product_type,
      v_order.status,
      v_order.amount,
      v_order.currency,
      v_order.created_at,
      v_order.updated_at;
    return;
  end if;

  v_report_id := 'report_' || md5(
    v_order.payment_order_id || clock_timestamp()::text || random()::text
  );
  v_access_token_hash := 'internal_' || md5(
    v_report_id || clock_timestamp()::text || random()::text
  );

  insert into public.reports (
    report_id,
    status,
    access_mode,
    input_snapshot,
    report_snapshot,
    report_version,
    calculation_version,
    locale,
    access_token_hash,
    access_token_created_at,
    access_token_version,
    payment_order_id,
    payment_provider,
    payment_status,
    payment_amount,
    payment_currency,
    payment_paid_at,
    created_at,
    updated_at
  )
  values (
    v_report_id,
    'paid_unlocked',
    'paid',
    v_order.input_snapshot,
    jsonb_build_object(
      'kind',
      'paid_saju_mbti_fulfillment_placeholder',
      'message',
      '결제가 완료되었습니다. 사주×MBTI 종합 리포트 생성 파이프라인이 연결되었습니다.'
    ),
    'paid-fulfillment-boundary-v1',
    'paid-fulfillment-boundary-v1',
    'ko-KR',
    v_access_token_hash,
    v_created_at,
    'internal-boundary-v1',
    v_order.payment_order_id,
    v_order.provider,
    'paid',
    v_order.amount,
    v_order.currency,
    v_order.paid_at,
    v_created_at,
    v_updated_at
  );

  return query
  with updated_order as (
    update public.payment_orders as payment_orders
    set
      report_id = v_report_id,
      updated_at = v_updated_at
    where payment_orders.payment_order_id = v_order.payment_order_id
    returning
      payment_orders.payment_order_id,
      payment_orders.provider_order_id,
      payment_orders.report_id,
      payment_orders.product_type,
      payment_orders.status,
      payment_orders.amount,
      payment_orders.currency,
      payment_orders.created_at,
      payment_orders.updated_at
  )
  select
    updated_order.payment_order_id,
    updated_order.provider_order_id,
    updated_order.report_id,
    updated_order.product_type,
    updated_order.status,
    updated_order.amount,
    updated_order.currency,
    updated_order.created_at,
    updated_order.updated_at
  from updated_order;
exception
  when unique_violation then
    raise exception 'PAID_REPORT_FULFILLMENT_CONFLICT' using errcode = '23505';
end;
$$;

revoke all on function public.fulfill_paid_saju_mbti_report(text) from public;

grant execute on function public.fulfill_paid_saju_mbti_report(text) to anon;
