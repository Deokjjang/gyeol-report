-- Update ready-order creation to the launch payment amount.
-- This function does not confirm provider results, create reports, or expose
-- stored request snapshots.

create or replace function public.create_ready_payment_order(
  p_payment_order_id text,
  p_product_type text,
  p_provider text,
  p_amount integer,
  p_currency text,
  p_input_snapshot jsonb,
  p_provider_order_id text default null
)
returns table (
  payment_order_id text,
  product_type text,
  provider text,
  amount integer,
  currency text,
  status text,
  provider_order_id text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_created_at timestamptz := now();
begin
  if p_payment_order_id is null or btrim(p_payment_order_id) = '' then
    raise exception 'PAYMENT_ORDER_INVALID_ID' using errcode = 'P0001';
  end if;

  if p_product_type <> 'saju_mbti_full' then
    raise exception 'PAYMENT_PRODUCT_NOT_PURCHASABLE' using errcode = 'P0001';
  end if;

  if p_provider not in ('toss', 'kakao_pay') then
    raise exception 'PAYMENT_ORDER_INVALID_PROVIDER' using errcode = 'P0001';
  end if;

  if p_amount <> 990 then
    raise exception 'PAYMENT_ORDER_INVALID_AMOUNT' using errcode = 'P0001';
  end if;

  if p_currency <> 'KRW' then
    raise exception 'PAYMENT_ORDER_INVALID_CURRENCY' using errcode = 'P0001';
  end if;

  if p_input_snapshot is null or jsonb_typeof(p_input_snapshot) <> 'object' then
    raise exception 'PAYMENT_ORDER_INVALID_INPUT' using errcode = 'P0001';
  end if;

  return query
  with inserted_order as (
    insert into public.payment_orders as payment_orders (
      payment_order_id,
      product_type,
      provider,
      amount,
      currency,
      status,
      input_snapshot,
      provider_order_id,
      created_at,
      updated_at,
      requested_at
    )
    values (
      p_payment_order_id,
      p_product_type,
      p_provider,
      990,
      'KRW',
      'ready',
      p_input_snapshot,
      nullif(btrim(p_provider_order_id), ''),
      v_created_at,
      v_created_at,
      v_created_at
    )
    returning
      payment_orders.payment_order_id,
      payment_orders.product_type,
      payment_orders.provider,
      payment_orders.amount,
      payment_orders.currency,
      payment_orders.status,
      payment_orders.provider_order_id,
      payment_orders.created_at,
      payment_orders.updated_at
  )
  select
    inserted_order.payment_order_id,
    inserted_order.product_type,
    inserted_order.provider,
    inserted_order.amount,
    inserted_order.currency,
    inserted_order.status,
    inserted_order.provider_order_id,
    inserted_order.created_at,
    inserted_order.updated_at
  from inserted_order;
exception
  when unique_violation then
    raise exception 'PAYMENT_ORDER_DUPLICATE' using errcode = '23505';
end;
$$;

revoke all on function public.create_ready_payment_order(
  text,
  text,
  text,
  integer,
  text,
  jsonb,
  text
) from public;

grant execute on function public.create_ready_payment_order(
  text,
  text,
  text,
  integer,
  text,
  jsonb,
  text
) to anon;
