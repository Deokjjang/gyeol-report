-- Delete only the ten production reports confirmed as test data.
-- No payment_orders row or non-allowlisted report is modified.
--
-- SQL Editor rollout order:
-- A. supabase/migrations/20260920171500_production_test_data_cleanup.sql
-- B. supabase/migrations/20260920170603_production_database_blockers.sql
-- C. scripts/paid_report_production_preflight_single_result.sql
-- D. supabase/migrations/20260920163924_production_reliability_reconcile.sql
-- E. scripts/paid_report_production_reconcile_verify.sql

begin;

set local lock_timeout='5s';
set local statement_timeout='60s';

do $cleanup_schema_preconditions$
begin
  if to_regclass('public.reports') is null then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: public.reports is missing';
  end if;

  if to_regclass('public.payment_orders') is null then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: public.payment_orders is missing';
  end if;

  if exists (
    select 1
    from (
      values
        ('reports','report_id','text'),
        ('reports','payment_order_id','text'),
        ('reports','payment_provider','text'),
        ('reports','payment_status','text'),
        ('reports','payment_amount','numeric'),
        ('reports','deleted_at','timestamptz'),
        ('payment_orders','payment_order_id','text')
    ) expected(table_name,column_name,udt_name)
    left join information_schema.columns actual
      on actual.table_schema='public'
     and actual.table_name=expected.table_name
     and actual.column_name=expected.column_name
     and actual.udt_name=expected.udt_name
    where actual.column_name is null
  ) then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: required schema contract mismatch';
  end if;
end
$cleanup_schema_preconditions$;

-- Freeze the two small legacy tables while assertions and deletion run so the
-- before/after counts describe one consistent state. Reads remain available.
lock table public.payment_orders in share row exclusive mode;
lock table public.reports in share row exclusive mode;

create temporary table production_test_report_cleanup_allowlist (
  report_id text primary key,
  payment_order_id text not null,
  payment_provider text not null
) on commit drop;

insert into pg_temp.production_test_report_cleanup_allowlist (
  report_id,
  payment_order_id,
  payment_provider
)
values
  ('report_b12iwpy7s23ne','smoke_order_share_lookup','smoke'),
  ('report_i2ktw0p6be77i','smoke_order_share_token_storage','smoke'),
  ('report_jd1lqbwcp0qiq','smoke_order_share_lookup_mq5uhfg5_3ks5cxjv','smoke'),
  ('report_mur46odg213h5','smoke_order_share_lookup_mq5tj85t_o6uc7cyw','smoke'),
  ('report_zs55p86hos9p3','smoke_order_paid_report_storage','smoke'),
  ('report_w8suvtp17higq','mock_order_2e5b35e4-59eb-4ebe-b44b-247656351632','mock_toss'),
  ('report_y45g50grdvbvg','mock_order_d58665de-2201-496d-98c3-7fd99b654187','mock_toss'),
  ('report_aeb9toph86oy6','mock_order_4e6c50e1-0d8e-403a-9b8e-22a12a24cf78','mock_kakao_pay'),
  ('report_b4k7l4omljn7l','mock_order_fdd68a0b-a71d-4a15-8550-b5ed9f68dc65','mock_toss'),
  ('report_no9kgoe8s9bgf','mock_order_60d2cf33-0e6d-423a-a196-53ab82671966','mock_kakao_pay');

do $cleanup_exact_allowlist$
declare
  v_allowlist_count bigint;
  v_target_count bigint;
  v_mismatch_count bigint;
  v_existing_order_count bigint;
  v_report_count_before bigint;
  v_payment_order_count_before bigint;
  v_deleted_count bigint;
  v_report_count_after bigint;
  v_payment_order_count_after bigint;
begin
  select count(*)
  into v_allowlist_count
  from pg_temp.production_test_report_cleanup_allowlist;

  if v_allowlist_count<>10 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: allowlist count is %, expected 10',v_allowlist_count;
  end if;

  select count(*),(
    select count(*)
    from public.payment_orders
  )
  into v_report_count_before,v_payment_order_count_before
  from public.reports;

  select count(*)
  into v_target_count
  from public.reports r
  join pg_temp.production_test_report_cleanup_allowlist expected
    on expected.report_id=r.report_id;

  if v_target_count<>10 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: matched report count is %, expected 10',v_target_count;
  end if;

  select count(*)
  into v_mismatch_count
  from public.reports r
  join pg_temp.production_test_report_cleanup_allowlist expected
    on expected.report_id=r.report_id
  where r.payment_order_id is distinct from expected.payment_order_id
     or r.payment_provider is distinct from expected.payment_provider
     or r.payment_status is distinct from 'paid'
     or r.payment_amount is distinct from 1290::numeric
     or r.deleted_at is not null;

  if v_mismatch_count<>0 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: % allowlisted reports fail exact field assertions',v_mismatch_count;
  end if;

  select count(*)
  into v_existing_order_count
  from pg_temp.production_test_report_cleanup_allowlist expected
  join public.payment_orders po
    on po.payment_order_id=expected.payment_order_id;

  if v_existing_order_count<>0 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: % allowlisted reports now have matching payment_orders rows',v_existing_order_count;
  end if;

  delete from public.reports r
  using pg_temp.production_test_report_cleanup_allowlist expected
  where r.report_id=expected.report_id
    and r.payment_order_id=expected.payment_order_id
    and r.payment_provider=expected.payment_provider
    and r.payment_status='paid'
    and r.payment_amount=1290::numeric
    and r.deleted_at is null;

  get diagnostics v_deleted_count=row_count;

  if v_deleted_count<>10 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: deleted report count is %, expected 10',v_deleted_count;
  end if;

  if exists (
    select 1
    from public.reports r
    join pg_temp.production_test_report_cleanup_allowlist expected
      on expected.report_id=r.report_id
  ) then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: an allowlisted report remains after deletion';
  end if;

  select count(*),(
    select count(*)
    from public.payment_orders
  )
  into v_report_count_after,v_payment_order_count_after
  from public.reports;

  if v_report_count_after<>v_report_count_before-10 then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: non-allowlisted report count changed';
  end if;

  if v_payment_order_count_after<>v_payment_order_count_before then
    raise exception 'TEST_DATA_CLEANUP_ABORTED: payment_orders count changed';
  end if;
end
$cleanup_exact_allowlist$;

commit;
