-- Mark a Toss ready payment order as paid after server-side provider confirm.
-- This function stores provider linkage server-side only and does not create
-- reports, issue links, or return stored request snapshots.

create or replace function public.mark_toss_payment_order_paid(
  p_provider_order_id text,
  p_provider_payment_id text,
  p_amount integer,
  p_currency text,
  p_paid_at timestamptz default now()
)
returns table (
  payment_order_id text,
  provider_order_id text,
  product_type text,
  provider text,
  amount integer,
  currency text,
  status text,
  paid_at timestamptz,
  report_id text,
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
  v_provider_payment_id text := nullif(btrim(p_provider_payment_id), '');
  v_paid_at timestamptz := coalesce(p_paid_at, now());
  v_updated_at timestamptz := now();
begin
  if v_provider_order_id is null then
    raise exception 'PAYMENT_ORDER_INVALID_PROVIDER_ORDER_ID' using errcode = 'P0001';
  end if;

  if v_provider_payment_id is null then
    raise exception 'PAYMENT_ORDER_INVALID_PROVIDER_PAYMENT_ID' using errcode = 'P0001';
  end if;

  if p_amount <> 990 then
    raise exception 'PAYMENT_ORDER_INVALID_AMOUNT' using errcode = 'P0001';
  end if;

  if p_currency <> 'KRW' then
    raise exception 'PAYMENT_ORDER_INVALID_CURRENCY' using errcode = 'P0001';
  end if;

  select *
  into v_order
  from public.payment_orders as payment_orders
  where payment_orders.provider_order_id = v_provider_order_id
  for update;

  if not found or v_order.deleted_at is not null then
    raise exception 'PAYMENT_ORDER_NOT_FOUND' using errcode = 'P0001';
  end if;

  if
    v_order.provider <> 'toss' or
    v_order.product_type <> 'saju_mbti_full' or
    v_order.amount <> 990 or
    v_order.currency <> 'KRW'
  then
    raise exception 'PAYMENT_ORDER_INVALID_CONTEXT' using errcode = 'P0001';
  end if;

  if v_order.status = 'paid' then
    if v_order.provider_payment_id = v_provider_payment_id then
      return query
      select
        v_order.payment_order_id,
        v_order.provider_order_id,
        v_order.product_type,
        v_order.provider,
        v_order.amount,
        v_order.currency,
        v_order.status,
        v_order.paid_at,
        v_order.report_id,
        v_order.created_at,
        v_order.updated_at;
      return;
    end if;

    raise exception 'PAYMENT_ORDER_PAID_CONFLICT' using errcode = 'P0001';
  end if;

  if v_order.status <> 'ready' then
    raise exception 'PAYMENT_ORDER_NOT_READY' using errcode = 'P0001';
  end if;

  return query
  with updated_order as (
    update public.payment_orders as payment_orders
    set
      status = 'paid',
      provider_payment_id = v_provider_payment_id,
      paid_at = v_paid_at,
      updated_at = v_updated_at
    where payment_orders.payment_order_id = v_order.payment_order_id
    returning
      payment_orders.payment_order_id,
      payment_orders.provider_order_id,
      payment_orders.product_type,
      payment_orders.provider,
      payment_orders.amount,
      payment_orders.currency,
      payment_orders.status,
      payment_orders.paid_at,
      payment_orders.report_id,
      payment_orders.created_at,
      payment_orders.updated_at
  )
  select
    updated_order.payment_order_id,
    updated_order.provider_order_id,
    updated_order.product_type,
    updated_order.provider,
    updated_order.amount,
    updated_order.currency,
    updated_order.status,
    updated_order.paid_at,
    updated_order.report_id,
    updated_order.created_at,
    updated_order.updated_at
  from updated_order;
exception
  when unique_violation then
    raise exception 'PAYMENT_ORDER_PAID_CONFLICT' using errcode = '23505';
end;
$$;

revoke all on function public.mark_toss_payment_order_paid(
  text,
  text,
  integer,
  text,
  timestamptz
) from public;

grant execute on function public.mark_toss_payment_order_paid(
  text,
  text,
  integer,
  text,
  timestamptz
) to anon;
