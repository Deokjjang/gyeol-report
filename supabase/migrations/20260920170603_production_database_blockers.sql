-- Replace only the obsolete payment product CHECK.
--
-- Canonical purchasable product types are copied from
-- src/lib/payment/reportProductTypes.ts and reportProductCatalog.ts:
--   saju_mbti_full, career_money_study, love_marriage_child,
--   saju_mbti_compatibility, major_fortune, annual_fortune.
--
-- Legacy values accepted by the existing production CHECK remain readable:
--   saju_basic, saju_full, daewoon, saewoon, compatibility.
-- scripts/paid_report_production_preflight_single_result.sql already checks
-- this exact union and remains the read-only post-change verifier.
--
-- Orphan report strategy (no orphan row is changed by this migration):
-- 1. Preserve the audit output with deployment evidence.
-- 2. For an actual paid report, reconstruct a payment row only from an
--    authoritative provider/financial record in a separately reviewed change.
-- 3. For a confirmed test/legacy row, retain it as legacy data until a specific
--    retention decision authorizes soft retirement or reference cleanup.
-- 4. For a stale reference, clear or remap it only after the intended order is
--    proven; never infer payment state from the report row alone.
-- 5. Do not add a reports.payment_order_id foreign key while any orphan remains.

begin;

set local lock_timeout='5s';
set local statement_timeout='60s';

do $product_check_preconditions$
declare
  v_unexpected_values text;
begin
  if to_regclass('public.payment_orders') is null then
    raise exception 'BLOCKER_FIX_ABORTED: public.payment_orders is missing';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema='public'
      and table_name='payment_orders'
      and column_name='product_type'
      and udt_name='text'
      and is_nullable='NO'
  ) then
    raise exception 'BLOCKER_FIX_ABORTED: payment_orders.product_type contract mismatch';
  end if;

  select string_agg(product_type,', ' order by product_type)
  into v_unexpected_values
  from (
    select distinct product_type
    from public.payment_orders
    where product_type not in (
      'saju_mbti_full','career_money_study','love_marriage_child',
      'saju_mbti_compatibility','major_fortune','annual_fortune',
      'saju_basic','saju_full','daewoon','saewoon','compatibility'
    )
  ) unexpected;

  if v_unexpected_values is not null then
    raise exception 'BLOCKER_FIX_ABORTED: unexpected stored product_type values: %',v_unexpected_values;
  end if;

  if exists (
    select 1
    from pg_constraint con
    join pg_attribute att
      on att.attrelid=con.conrelid
     and att.attname='product_type'
     and att.attnum=any(con.conkey)
    where con.conrelid='public.payment_orders'::regclass
      and con.contype='c'
      and con.conname<>'payment_orders_product_type_check'
  ) then
    raise exception 'BLOCKER_FIX_ABORTED: an additional product_type CHECK requires review';
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid='public.payment_orders'::regclass
      and conname='payment_orders_product_type_check'
      and contype<>'c'
  ) then
    raise exception 'BLOCKER_FIX_ABORTED: payment_orders_product_type_check is not a CHECK';
  end if;
end
$product_check_preconditions$;

alter table public.payment_orders
  add constraint payment_orders_product_type_catalog_check
  check (product_type in (
    'saju_mbti_full','career_money_study','love_marriage_child',
    'saju_mbti_compatibility','major_fortune','annual_fortune',
    'saju_basic','saju_full','daewoon','saewoon','compatibility'
  )) not valid;

alter table public.payment_orders
  validate constraint payment_orders_product_type_catalog_check;

alter table public.payment_orders
  drop constraint if exists payment_orders_product_type_check;

alter table public.payment_orders
  rename constraint payment_orders_product_type_catalog_check
  to payment_orders_product_type_check;

do $product_check_postconditions$
declare
  v_definition text;
begin
  select pg_get_constraintdef(con.oid)
  into v_definition
  from pg_constraint con
  where con.conrelid='public.payment_orders'::regclass
    and con.conname='payment_orders_product_type_check'
    and con.contype='c'
    and con.convalidated;

  if v_definition is null
    or v_definition not like '%''saju_mbti_full''%'
    or v_definition not like '%''career_money_study''%'
    or v_definition not like '%''love_marriage_child''%'
    or v_definition not like '%''saju_mbti_compatibility''%'
    or v_definition not like '%''major_fortune''%'
    or v_definition not like '%''annual_fortune''%'
    or v_definition not like '%''saju_basic''%'
    or v_definition not like '%''saju_full''%'
    or v_definition not like '%''daewoon''%'
    or v_definition not like '%''saewoon''%'
    or v_definition not like '%''compatibility''%'
  then
    raise exception 'BLOCKER_FIX_INCOMPLETE: product catalog CHECK mismatch';
  end if;

  if exists (
    select 1
    from public.payment_orders
    where product_type not in (
      'saju_mbti_full','career_money_study','love_marriage_child',
      'saju_mbti_compatibility','major_fortune','annual_fortune',
      'saju_basic','saju_full','daewoon','saewoon','compatibility'
    )
  ) then
    raise exception 'BLOCKER_FIX_INCOMPLETE: stored product_type violates catalog CHECK';
  end if;
end
$product_check_postconditions$;

commit;
