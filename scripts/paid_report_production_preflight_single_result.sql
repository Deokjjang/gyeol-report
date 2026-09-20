-- Single-result production preflight report.
-- This statement only reads catalog metadata and aggregate counts.
-- BLOCKER categories decide whether reconciliation may proceed.
-- INVENTORY categories describe the current state and may be false before reconciliation.

with
expected_columns(table_name,column_name,udt_name,is_nullable) as (
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
),
base_column_checks as (
  select
    'BLOCKER_BASE_COLUMN'::text as category,
    e.table_name||'.'||e.column_name as check_name,
    c.column_name is not null
      and c.udt_name=e.udt_name
      and c.is_nullable=e.is_nullable as pass,
    format(
      'expected type=%s nullable=%s; actual type=%s nullable=%s',
      e.udt_name,e.is_nullable,coalesce(c.udt_name,'<missing>'),coalesce(c.is_nullable,'<missing>')
    ) as detail
  from expected_columns e
  left join information_schema.columns c
    on c.table_schema='public'
   and c.table_name=e.table_name
   and c.column_name=e.column_name
),
data_violations(check_name,violation_count) as (
  select 'payment_orders duplicate payment_order_id groups',count(*)
  from (select payment_order_id from public.payment_orders group by payment_order_id having count(*)>1) x
  union all
  select 'payment_orders duplicate provider_payment_id groups',count(*)
  from (select provider_payment_id from public.payment_orders where provider_payment_id is not null group by provider_payment_id having count(*)>1) x
  union all
  select 'payment_orders duplicate provider_order_id groups',count(*)
  from (select provider_order_id from public.payment_orders where provider_order_id is not null group by provider_order_id having count(*)>1) x
  union all
  select 'payment_orders duplicate report_id groups',count(*)
  from (select report_id from public.payment_orders where report_id is not null group by report_id having count(*)>1) x
  union all
  select 'reports duplicate report_id groups',count(*)
  from (select report_id from public.reports group by report_id having count(*)>1) x
  union all
  select 'reports duplicate payment_order_id groups',count(*)
  from (select payment_order_id from public.reports where payment_order_id is not null group by payment_order_id having count(*)>1) x
  union all
  select 'reports duplicate payment_provider_payment_id groups',count(*)
  from (select payment_provider_payment_id from public.reports where payment_provider_payment_id is not null group by payment_provider_payment_id having count(*)>1) x
  union all
  select 'payment_orders report_id without matching reports row',count(*)
  from public.payment_orders po
  where po.report_id is not null
    and not exists(select 1 from public.reports r where r.report_id=po.report_id)
  union all
  select 'reports payment_order_id without matching payment_orders row',count(*)
  from public.reports r
  where r.payment_order_id is not null
    and not exists(select 1 from public.payment_orders po where po.payment_order_id=r.payment_order_id)
  union all
  select 'payment_orders unknown product_type rows',count(*)
  from public.payment_orders
  where product_type not in (
    'saju_mbti_full','saju_basic','saju_full','daewoon','saewoon','compatibility',
    'career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'
  )
  union all
  select 'payment_orders unknown provider rows',count(*)
  from public.payment_orders where provider not in ('toss','kakao_pay')
  union all
  select 'payment_orders invalid amount rows',count(*)
  from public.payment_orders where amount<=0
  union all
  select 'payment_orders invalid currency rows',count(*)
  from public.payment_orders where currency<>'KRW'
  union all
  select 'payment_orders unknown status rows',count(*)
  from public.payment_orders where status not in ('ready','paid','failed','canceled','refunded')
),
data_checks as (
  select
    'BLOCKER_DATA'::text as category,
    check_name,
    violation_count=0 as pass,
    format('violation_count=%s',violation_count) as detail
  from data_violations
),
product_check_rows as (
  select
    con.conname,
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
),
product_check_summary as (
  select
    'BLOCKER_PRODUCT_CHECK'::text as category,
    'payment_orders.product_type CHECK compatibility'::text as check_name,
    coalesce(bool_and(catalog_compatible),true) as pass,
    coalesce(
      string_agg(
        format('%s: %s; catalog_compatible=%s',conname,definition,catalog_compatible),
        ' | ' order by conname
      ),
      'none; reconciliation can add the catalog CHECK'
    ) as detail
  from product_check_rows
),
blocker_checks as (
  select * from base_column_checks
  union all select * from data_checks
  union all select * from product_check_summary
),
blocker_summary as (
  select
    'BLOCKER_00_SUMMARY'::text as category,
    'reconciliation preflight'::text as check_name,
    bool_and(pass) as pass,
    format(
      'failed=%s; total=%s',
      count(*) filter(where not pass),
      count(*)
    ) as detail
  from blocker_checks
),
constraint_inventory as (
  select
    'INVENTORY_CONSTRAINT'::text as category,
    c.relname||'.'||con.conname as check_name,
    con.convalidated as pass,
    format(
      'type=%s; definition=%s',
      case con.contype when 'p' then 'PRIMARY KEY' when 'u' then 'UNIQUE' when 'f' then 'FOREIGN KEY' when 'c' then 'CHECK' else con.contype::text end,
      pg_get_constraintdef(con.oid)
    ) as detail
  from pg_constraint con
  join pg_class c on c.oid=con.conrelid
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public'
    and c.relname in ('payment_orders','reports')
    and con.contype in ('p','u','f','c')
  union all
  select
    'INVENTORY_CONSTRAINT',
    t.table_name||'.<none>',
    false,
    'no PRIMARY KEY, UNIQUE, FOREIGN KEY, or CHECK constraint found'
  from (values ('payment_orders'),('reports')) t(table_name)
  where not exists (
    select 1
    from pg_constraint con
    join pg_class c on c.oid=con.conrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relname=t.table_name
      and con.contype in ('p','u','f','c')
  )
),
unique_index_inventory as (
  select
    'INVENTORY_UNIQUE_INDEX'::text as category,
    table_class.relname||'.'||index_class.relname as check_name,
    true as pass,
    pg_get_indexdef(i.indexrelid) as detail
  from pg_index i
  join pg_class table_class on table_class.oid=i.indrelid
  join pg_class index_class on index_class.oid=i.indexrelid
  join pg_namespace n on n.oid=table_class.relnamespace
  where n.nspname='public'
    and table_class.relname in ('payment_orders','reports')
    and i.indisunique
  union all
  select
    'INVENTORY_UNIQUE_INDEX',
    t.table_name||'.<none>',
    false,
    'no unique index found'
  from (values ('payment_orders'),('reports')) t(table_name)
  where not exists (
    select 1
    from pg_index i
    join pg_class table_class on table_class.oid=i.indrelid
    join pg_namespace n on n.oid=table_class.relnamespace
    where n.nspname='public'
      and table_class.relname=t.table_name
      and i.indisunique
  )
),
expected_tables(table_name) as (
  values
    ('payment_orders'),('reports'),('report_input_snapshots'),
    ('paid_report_snapshots'),('report_generation_jobs'),('report_generation_attempts')
),
rls_inventory as (
  select
    'INVENTORY_RLS'::text as category,
    'public.'||e.table_name as check_name,
    c.oid is not null and c.relrowsecurity as pass,
    case
      when c.oid is null then 'table absent'
      else format('table_exists=true; rls_enabled=%s',c.relrowsecurity)
    end as detail
  from expected_tables e
  left join pg_class c on c.oid=to_regclass('public.'||e.table_name)
),
expected_functions(function_name,function_signature,function_kind) as (
  values
    ('paid_report_reliability','public.paid_report_reliability(text,jsonb)','target'),
    ('create_ready_payment_order',null,'legacy'),
    ('mark_toss_payment_order_paid',null,'legacy'),
    ('fulfill_paid_saju_mbti_report',null,'legacy'),
    ('save_comprehensive_report_draft_snapshot',null,'legacy'),
    ('get_generated_comprehensive_report_result',null,'legacy'),
    ('get_paid_saju_mbti_report_result',null,'legacy'),
    ('find_paid_report_by_access_token_hash',null,'legacy')
),
function_inventory as (
  select
    'INVENTORY_FUNCTION'::text as category,
    e.function_name as check_name,
    case
      when e.function_kind='target' then
        to_regprocedure(e.function_signature) is not null
        and coalesce(has_function_privilege('service_role',to_regprocedure(e.function_signature),'EXECUTE'),false)
        and not coalesce(has_function_privilege('anon',to_regprocedure(e.function_signature),'EXECUTE'),false)
        and not coalesce(has_function_privilege('authenticated',to_regprocedure(e.function_signature),'EXECUTE'),false)
      else coalesce(f.function_count,0)=0
        or (not coalesce(f.anon_execute,false) and not coalesce(f.authenticated_execute,false))
    end as pass,
    case
      when coalesce(f.function_count,0)=0 then 'absent'
      else format(
        'signatures=%s; security_definer=%s; settings=%s; anon_execute=%s; authenticated_execute=%s; service_role_execute=%s',
        f.signatures,f.security_definer,f.function_settings,f.anon_execute,f.authenticated_execute,f.service_role_execute
      )
    end as detail
  from expected_functions e
  left join lateral (
    select
      count(*) as function_count,
      string_agg(p.oid::regprocedure::text,', ' order by p.oid::regprocedure::text) as signatures,
      bool_and(p.prosecdef) as security_definer,
      string_agg(coalesce(array_to_string(p.proconfig,','),'<none>'),' | ' order by p.oid::regprocedure::text) as function_settings,
      bool_or(has_function_privilege('anon',p.oid,'EXECUTE')) as anon_execute,
      bool_or(has_function_privilege('authenticated',p.oid,'EXECUTE')) as authenticated_execute,
      bool_or(has_function_privilege('service_role',p.oid,'EXECUTE')) as service_role_execute
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname=e.function_name
  ) f on true
),
expected_reliability_objects(object_type,object_name) as (
  values
    ('table','report_input_snapshots'),
    ('table','paid_report_snapshots'),
    ('table','report_generation_jobs'),
    ('table','report_generation_attempts'),
    ('column','payment_orders.confirm_lease_until'),
    ('column','payment_orders.confirm_token'),
    ('index','report_input_snapshots_expires_at_idx'),
    ('index','paid_report_snapshots_expires_at_idx'),
    ('index','report_generation_jobs_due'),
    ('index','report_generation_attempts_report_id_idx'),
    ('function','paid_report_reliability(text,jsonb)')
),
reliability_object_inventory as (
  select
    'INVENTORY_RELIABILITY_OBJECT'::text as category,
    e.object_type||':'||e.object_name as check_name,
    case e.object_type
      when 'table' then to_regclass('public.'||e.object_name) is not null
      when 'index' then to_regclass('public.'||e.object_name) is not null
      when 'function' then to_regprocedure('public.'||e.object_name) is not null
      when 'column' then exists(
        select 1
        from information_schema.columns c
        where c.table_schema='public'
          and c.table_name=split_part(e.object_name,'.',1)
          and c.column_name=split_part(e.object_name,'.',2)
      )
      else false
    end as pass,
    'current production presence; false is expected before reconciliation'::text as detail
  from expected_reliability_objects e
),
migration_history_inventory as (
  select
    'INVENTORY_MIGRATION_HISTORY'::text as category,
    'supabase_migrations.schema_migrations'::text as check_name,
    to_regclass('supabase_migrations.schema_migrations') is not null as pass,
    format('history_table_exists=%s',to_regclass('supabase_migrations.schema_migrations') is not null) as detail
),
all_checks as (
  select * from blocker_summary
  union all select * from blocker_checks
  union all select * from constraint_inventory
  union all select * from unique_index_inventory
  union all select * from rls_inventory
  union all select * from function_inventory
  union all select * from reliability_object_inventory
  union all select * from migration_history_inventory
)
select category,check_name,pass,detail
from all_checks
order by
  case when pass then 1 else 0 end,
  case when category like 'BLOCKER_%' then 0 else 1 end,
  category,
  check_name;
