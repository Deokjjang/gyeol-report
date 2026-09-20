-- Read-only preflight/postflight for production reliability reconciliation.
-- Run this exact file before and after the reconciliation migration.
-- Save both outputs outside the repository and compare the two
-- legacy_data_fingerprint rows byte-for-byte.
-- This script returns only counts, hashes, and catalog metadata; it does not
-- return customer input/report JSON, payment identifiers, or access tokens.

begin read only;

set local statement_timeout = '30s';

select
  current_database() as database_name,
  current_user as audit_role,
  current_setting('server_version') as postgres_version,
  now() as audited_at;

-- The two digests cover only columns that existed before reconciliation.
-- Matching counts and digests prove that the migration did not rewrite those
-- values. Keep the before/after output as deployment evidence.
select
  'payment_orders' as table_name,
  count(*) as row_count,
  coalesce(
    md5(string_agg(md5(jsonb_build_object(
      'payment_order_id', payment_order_id,
      'product_type', product_type,
      'provider', provider,
      'amount', amount,
      'currency', currency,
      'status', status,
      'input_snapshot', input_snapshot,
      'provider_payment_id', provider_payment_id,
      'provider_order_id', provider_order_id,
      'report_id', report_id,
      'created_at', created_at,
      'updated_at', updated_at,
      'requested_at', requested_at,
      'paid_at', paid_at,
      'failed_at', failed_at,
      'canceled_at', canceled_at,
      'refunded_at', refunded_at,
      'deleted_at', deleted_at
    )::text), '' order by payment_order_id)),
    md5('')
  ) as legacy_data_fingerprint
from public.payment_orders
union all
select
  'reports',
  count(*),
  coalesce(
    md5(string_agg(md5(jsonb_build_object(
      'report_id', report_id,
      'status', status,
      'access_mode', access_mode,
      'input_snapshot', input_snapshot,
      'report_snapshot', report_snapshot,
      'report_version', report_version,
      'calculation_version', calculation_version,
      'locale', locale,
      'access_token_hash', access_token_hash,
      'access_token_created_at', access_token_created_at,
      'access_token_rotated_at', access_token_rotated_at,
      'access_token_version', access_token_version,
      'payment_order_id', payment_order_id,
      'payment_provider', payment_provider,
      'payment_provider_payment_id', payment_provider_payment_id,
      'payment_status', payment_status,
      'payment_amount', payment_amount,
      'payment_currency', payment_currency,
      'payment_paid_at', payment_paid_at,
      'payment_refunded_at', payment_refunded_at,
      'created_at', created_at,
      'updated_at', updated_at,
      'deleted_at', deleted_at
    )::text), '' order by report_id)),
    md5('')
  )
from public.reports
order by table_name;

-- Every base_column row must be true before migration.
with expected(table_name, column_name, udt_name, is_nullable) as (
  values
    ('payment_orders','payment_order_id','text','NO'),
    ('payment_orders','product_type','text','NO'),
    ('payment_orders','provider','text','NO'),
    ('payment_orders','amount','int4','NO'),
    ('payment_orders','currency','text','NO'),
    ('payment_orders','status','text','NO'),
    ('payment_orders','input_snapshot','jsonb','NO'),
    ('payment_orders','provider_payment_id','text','YES'),
    ('payment_orders','provider_order_id','text','YES'),
    ('payment_orders','report_id','text','YES'),
    ('payment_orders','created_at','timestamptz','NO'),
    ('payment_orders','updated_at','timestamptz','NO'),
    ('payment_orders','requested_at','timestamptz','YES'),
    ('payment_orders','paid_at','timestamptz','YES'),
    ('payment_orders','failed_at','timestamptz','YES'),
    ('payment_orders','canceled_at','timestamptz','YES'),
    ('payment_orders','refunded_at','timestamptz','YES'),
    ('payment_orders','deleted_at','timestamptz','YES'),
    ('reports','report_id','text','NO'),
    ('reports','status','text','NO'),
    ('reports','access_mode','text','NO'),
    ('reports','input_snapshot','jsonb','NO'),
    ('reports','report_snapshot','jsonb','NO'),
    ('reports','report_version','text','NO'),
    ('reports','calculation_version','text','NO'),
    ('reports','locale','text','NO'),
    ('reports','access_token_hash','text','NO'),
    ('reports','access_token_created_at','timestamptz','NO'),
    ('reports','access_token_rotated_at','timestamptz','YES'),
    ('reports','access_token_version','text','NO'),
    ('reports','payment_order_id','text','YES'),
    ('reports','payment_provider','text','YES'),
    ('reports','payment_provider_payment_id','text','YES'),
    ('reports','payment_status','text','YES'),
    ('reports','payment_amount','numeric','YES'),
    ('reports','payment_currency','text','YES'),
    ('reports','payment_paid_at','timestamptz','YES'),
    ('reports','payment_refunded_at','timestamptz','YES'),
    ('reports','created_at','timestamptz','NO'),
    ('reports','updated_at','timestamptz','NO'),
    ('reports','deleted_at','timestamptz','YES')
)
select
  'base_column' as check_group,
  e.table_name || '.' || e.column_name as check_name,
  c.column_name is not null
    and c.udt_name = e.udt_name
    and c.is_nullable = e.is_nullable as pass,
  format('expected %s nullable=%s; actual %s nullable=%s',
    e.udt_name, e.is_nullable, coalesce(c.udt_name,'<missing>'), coalesce(c.is_nullable,'<missing>')) as detail
from expected e
left join information_schema.columns c
  on c.table_schema='public'
 and c.table_name=e.table_name
 and c.column_name=e.column_name
order by e.table_name,e.column_name;

-- Every base_data row must be zero before migration.
select 'base_data' as check_group, 'duplicate payment_order_id groups' as check_name, count(*) as violation_count
from (select payment_order_id from public.payment_orders group by payment_order_id having count(*)>1) x
union all
select 'base_data','duplicate provider_payment_id groups',count(*)
from (select provider_payment_id from public.payment_orders where provider_payment_id is not null group by provider_payment_id having count(*)>1) x
union all
select 'base_data','duplicate provider_order_id groups',count(*)
from (select provider_order_id from public.payment_orders where provider_order_id is not null group by provider_order_id having count(*)>1) x
union all
select 'base_data','unknown product_type rows',count(*)
from public.payment_orders where product_type not in (
  'saju_mbti_full','saju_basic','saju_full','daewoon','saewoon','compatibility',
  'career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'
)
union all
select 'base_data','unknown provider rows',count(*)
from public.payment_orders where provider not in ('toss','kakao_pay')
union all
select 'base_data','invalid amount or currency rows',count(*)
from public.payment_orders where amount<=0 or currency<>'KRW'
union all
select 'base_data','unknown payment status rows',count(*)
from public.payment_orders where status not in ('ready','paid','failed','canceled','refunded')
order by check_name;

-- Existing product CHECKs are shown verbatim. Any row with catalog_compatible
-- false blocks the migration because widening it requires a separately reviewed
-- constraint replacement.
select
  con.conname as constraint_name,
  pg_get_constraintdef(con.oid) as definition,
  pg_get_constraintdef(con.oid) like '%''saju_mbti_full''%'
    and pg_get_constraintdef(con.oid) like '%''saju_basic''%'
    and pg_get_constraintdef(con.oid) like '%''saju_full''%'
    and pg_get_constraintdef(con.oid) like '%''daewoon''%'
    and pg_get_constraintdef(con.oid) like '%''saewoon''%'
    and pg_get_constraintdef(con.oid) like '%''compatibility''%'
    and pg_get_constraintdef(con.oid) like '%''career_money_study''%'
    and pg_get_constraintdef(con.oid) like '%''love_marriage_child''%'
    and pg_get_constraintdef(con.oid) like '%''saju_mbti_compatibility''%'
    and pg_get_constraintdef(con.oid) like '%''major_fortune''%'
    and pg_get_constraintdef(con.oid) like '%''annual_fortune''%' as catalog_compatible
from pg_constraint con
join pg_attribute att
  on att.attrelid=con.conrelid
 and att.attname='product_type'
 and att.attnum=any(con.conkey)
where con.conrelid='public.payment_orders'::regclass
  and con.contype='c'
order by con.conname;

-- Catalog inventory is safe both before and after migration.
with expected(name) as (values
  ('payment_orders'),('reports'),('report_input_snapshots'),
  ('paid_report_snapshots'),('report_generation_jobs'),('report_generation_attempts')
)
select
  e.name as table_name,
  c.oid is not null as exists,
  coalesce(c.relrowsecurity,false) as rls_enabled
from expected e
left join pg_class c on c.oid=to_regclass('public.'||e.name)
order by e.name;

select table_name,column_name,udt_name,is_nullable,column_default
from information_schema.columns
where table_schema='public'
  and table_name in (
    'payment_orders','reports','report_input_snapshots','paid_report_snapshots',
    'report_generation_jobs','report_generation_attempts'
  )
order by table_name,ordinal_position;

select
  c.relname as table_name,
  con.conname as constraint_name,
  con.contype,
  con.convalidated,
  pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid=con.conrelid
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in (
    'payment_orders','reports','report_input_snapshots','paid_report_snapshots',
    'report_generation_jobs','report_generation_attempts'
  )
order by c.relname,con.conname;

select tablename,indexname,indexdef
from pg_indexes
where schemaname='public'
  and tablename in (
    'payment_orders','reports','report_input_snapshots','paid_report_snapshots',
    'report_generation_jobs','report_generation_attempts'
  )
order by tablename,indexname;

select tablename,policyname,roles,cmd,qual,with_check
from pg_policies
where schemaname='public'
  and tablename in (
    'payment_orders','reports','report_input_snapshots','paid_report_snapshots',
    'report_generation_jobs','report_generation_attempts'
  )
order by tablename,policyname;

select
  c.relname as table_name,
  r.rolname,
  has_table_privilege(r.oid,c.oid,'SELECT') as can_select,
  has_table_privilege(r.oid,c.oid,'INSERT') as can_insert,
  has_table_privilege(r.oid,c.oid,'UPDATE') as can_update,
  has_table_privilege(r.oid,c.oid,'DELETE') as can_delete
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
cross join pg_roles r
where n.nspname='public'
  and c.relname in (
    'payment_orders','report_input_snapshots','paid_report_snapshots',
    'report_generation_jobs','report_generation_attempts'
  )
  and r.rolname in ('anon','authenticated','service_role')
order by c.relname,r.rolname;

select
  p.oid::regprocedure::text as function_signature,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  md5(pg_get_functiondef(p.oid)) as definition_hash,
  r.rolname,
  has_function_privilege(r.oid,p.oid,'EXECUTE') as can_execute
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
cross join pg_roles r
where n.nspname='public'
  and p.proname in (
    'paid_report_reliability','create_ready_payment_order','mark_toss_payment_order_paid',
    'fulfill_paid_saju_mbti_report','save_comprehensive_report_draft_snapshot',
    'get_generated_comprehensive_report_result','get_paid_saju_mbti_report_result',
    'find_paid_report_by_access_token_hash'
  )
  and r.rolname in ('anon','authenticated','service_role')
order by function_signature,r.rolname;

-- Every target_summary row must be true after migration.
with target_summary(check_name,pass) as (
  values
    ('confirmation lease columns',
      exists(select 1 from information_schema.columns where table_schema='public' and table_name='payment_orders' and column_name='confirm_lease_until' and udt_name='timestamptz')
      and exists(select 1 from information_schema.columns where table_schema='public' and table_name='payment_orders' and column_name='confirm_token' and udt_name='uuid')),
    ('payment order id unique',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders') and i.indisunique and i.indisvalid
        and i.indpred is null and i.indnkeyatts=1 and a.attname='payment_order_id'
    )),
    ('provider payment id unique',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders') and i.indisunique and i.indisvalid
        and i.indnkeyatts=1 and a.attname='provider_payment_id'
    )),
    ('provider order id unique',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders') and i.indisunique and i.indisvalid
        and i.indnkeyatts=1 and a.attname='provider_order_id'
    )),
    ('paid catalog CHECK compatible',exists(
      select 1 from pg_constraint con join pg_attribute att
        on att.attrelid=con.conrelid and att.attname='product_type' and att.attnum=any(con.conkey)
      where con.conrelid=to_regclass('public.payment_orders') and con.contype='c'
        and pg_get_constraintdef(con.oid) like '%''saju_mbti_full''%'
        and pg_get_constraintdef(con.oid) like '%''saju_basic''%'
        and pg_get_constraintdef(con.oid) like '%''saju_full''%'
        and pg_get_constraintdef(con.oid) like '%''daewoon''%'
        and pg_get_constraintdef(con.oid) like '%''saewoon''%'
        and pg_get_constraintdef(con.oid) like '%''compatibility''%'
        and pg_get_constraintdef(con.oid) like '%''career_money_study''%'
        and pg_get_constraintdef(con.oid) like '%''love_marriage_child''%'
        and pg_get_constraintdef(con.oid) like '%''saju_mbti_compatibility''%'
        and pg_get_constraintdef(con.oid) like '%''major_fortune''%'
        and pg_get_constraintdef(con.oid) like '%''annual_fortune''%'
    )),
    ('input snapshot table',to_regclass('public.report_input_snapshots') is not null),
    ('paid report table',to_regclass('public.paid_report_snapshots') is not null),
    ('generation job table',to_regclass('public.report_generation_jobs') is not null),
    ('generation attempt table',to_regclass('public.report_generation_attempts') is not null),
    ('all reliability tables use RLS',not exists(
      select 1 from (values ('report_input_snapshots'),('paid_report_snapshots'),('report_generation_jobs'),('report_generation_attempts')) v(name)
      left join pg_class c on c.oid=to_regclass('public.'||v.name)
      where c.oid is null or not c.relrowsecurity
    )),
    ('90 day input expiry default',exists(
      select 1 from information_schema.columns where table_schema='public' and table_name='report_input_snapshots'
        and column_name='expires_at' and column_default like '%90 days%'
    )),
    ('90 day report expiry default',exists(
      select 1 from information_schema.columns where table_schema='public' and table_name='paid_report_snapshots'
        and column_name='expires_at' and column_default like '%90 days%'
    )),
    ('expiry indexes',
      to_regclass('public.report_input_snapshots_expires_at_idx') is not null
      and to_regclass('public.paid_report_snapshots_expires_at_idx') is not null),
    ('due job index',to_regclass('public.report_generation_jobs_due') is not null),
    ('attempt report index',to_regclass('public.report_generation_attempts_report_id_idx') is not null),
    ('one report per paid order',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.paid_report_snapshots') and i.indisunique and i.indisvalid
        and i.indnkeyatts=1 and a.attname='order_id'
    )),
    ('one generation job per order',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.report_generation_jobs') and i.indisunique and i.indisvalid
        and i.indnkeyatts=1 and a.attname='order_id'
    )),
    ('one generation job per report',exists(
      select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.report_generation_jobs') and i.indisunique and i.indisvalid
        and i.indnkeyatts=1 and a.attname='report_id'
    )),
    ('attempt run uniqueness',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.report_generation_attempts') and con.contype='u'
        and pg_get_constraintdef(con.oid) like '%job_id%'
        and pg_get_constraintdef(con.oid) like '%run_number%'
        and pg_get_constraintdef(con.oid) like '%attempt%'
    )),
    ('required foreign keys',(
      select count(*)=6 from pg_constraint con
      where con.contype='f' and con.conrelid in (
        to_regclass('public.report_input_snapshots'),to_regclass('public.paid_report_snapshots'),
        to_regclass('public.report_generation_jobs'),to_regclass('public.report_generation_attempts')
      )
    )),
    ('publish gate database invariant',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.paid_report_snapshots') and con.contype='c'
        and pg_get_constraintdef(con.oid) like '%COMPLETED%'
        and pg_get_constraintdef(con.oid) like '%snapshot_json IS NOT NULL%'
        and pg_get_constraintdef(con.oid) like '%paid-report-v1%'
    )),
    ('attention and expiry states',
      exists(select 1 from pg_constraint con where con.conrelid=to_regclass('public.paid_report_snapshots') and con.contype='c'
        and pg_get_constraintdef(con.oid) like '%FAILED_REQUIRES_ATTENTION%' and pg_get_constraintdef(con.oid) like '%EXPIRED%')
      and exists(select 1 from pg_constraint con where con.conrelid=to_regclass('public.report_generation_jobs') and con.contype='c'
        and pg_get_constraintdef(con.oid) like '%FAILED_REQUIRES_ATTENTION%' and pg_get_constraintdef(con.oid) like '%EXPIRED%')),
    ('service role reliability RPC only',
      to_regprocedure('public.paid_report_reliability(text,jsonb)') is not null
      and coalesce(has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE'),false)
      and not coalesce(has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE'),false)
      and not coalesce(has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE'),false)),
    ('legacy paid RPCs inaccessible to public clients',not exists(
      select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public'
        and p.proname in (
          'create_ready_payment_order','mark_toss_payment_order_paid','fulfill_paid_saju_mbti_report',
          'save_comprehensive_report_draft_snapshot','get_generated_comprehensive_report_result',
          'get_paid_saju_mbti_report_result','find_paid_report_by_access_token_hash'
        )
        and (has_function_privilege('anon',p.oid,'EXECUTE') or has_function_privilege('authenticated',p.oid,'EXECUTE'))
    )),
    ('retry attention admin and concurrent claim present',exists(
      select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='paid_report_reliability'
        and position('FAILED_REQUIRES_ATTENTION' in p.prosrc)>0
        and position('admin_retry' in p.prosrc)>0
        and position('skip locked' in lower(p.prosrc))>0
        and position('90 days' in p.prosrc)>0
    )),
    ('paid storage hidden from public clients',not exists(
      select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public'
        and c.relname in ('payment_orders','report_input_snapshots','paid_report_snapshots','report_generation_jobs','report_generation_attempts')
        and (
          has_table_privilege('anon',c.oid,'SELECT') or has_table_privilege('anon',c.oid,'INSERT')
          or has_table_privilege('anon',c.oid,'UPDATE') or has_table_privilege('anon',c.oid,'DELETE')
          or has_table_privilege('authenticated',c.oid,'SELECT') or has_table_privilege('authenticated',c.oid,'INSERT')
          or has_table_privilege('authenticated',c.oid,'UPDATE') or has_table_privilege('authenticated',c.oid,'DELETE')
        )
    ))
)
select 'target_summary' as check_group,check_name,pass
from target_summary
order by check_name;

select to_regclass('supabase_migrations.schema_migrations') is not null as has_migration_history_table;

commit;
