-- Single-result, read-only production postflight report.
-- POSTFLIGHT_00_SUMMARY must pass with failed=0 before launch proceeds.

with
expected_base_columns(table_name,column_name,udt_name,is_nullable) as (
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
    'POSTFLIGHT_BASE_COLUMN'::text as category,
    e.table_name||'.'||e.column_name as check_name,
    c.column_name is not null
      and c.udt_name=e.udt_name
      and c.is_nullable=e.is_nullable as pass,
    format(
      'expected type=%s nullable=%s; actual type=%s nullable=%s',
      e.udt_name,e.is_nullable,
      coalesce(c.udt_name,'<missing>'),coalesce(c.is_nullable,'<missing>')
    ) as detail
  from expected_base_columns e
  left join information_schema.columns c
    on c.table_schema='public'
   and c.table_name=e.table_name
   and c.column_name=e.column_name
),
expected_reliability_columns(table_name,column_name,udt_name,is_nullable) as (
  values
    ('payment_orders','confirm_lease_until','timestamptz','YES'),
    ('payment_orders','confirm_token','uuid','YES'),
    ('report_input_snapshots','order_id','text','NO'),
    ('report_input_snapshots','payload_json','jsonb','NO'),
    ('report_input_snapshots','created_at','timestamptz','NO'),
    ('report_input_snapshots','expires_at','timestamptz','NO'),
    ('paid_report_snapshots','report_id','text','NO'),
    ('paid_report_snapshots','order_id','text','NO'),
    ('paid_report_snapshots','product_type','text','NO'),
    ('paid_report_snapshots','status','text','NO'),
    ('paid_report_snapshots','snapshot_json','jsonb','YES'),
    ('paid_report_snapshots','gate_version','text','YES'),
    ('paid_report_snapshots','created_at','timestamptz','NO'),
    ('paid_report_snapshots','expires_at','timestamptz','NO'),
    ('paid_report_snapshots','published_at','timestamptz','YES'),
    ('report_generation_jobs','job_id','uuid','NO'),
    ('report_generation_jobs','order_id','text','NO'),
    ('report_generation_jobs','report_id','text','NO'),
    ('report_generation_jobs','status','text','NO'),
    ('report_generation_jobs','attempt_count','int4','NO'),
    ('report_generation_jobs','run_number','int4','NO'),
    ('report_generation_jobs','lease_token','uuid','YES'),
    ('report_generation_jobs','lease_until','timestamptz','YES'),
    ('report_generation_jobs','next_retry_at','timestamptz','NO'),
    ('report_generation_jobs','last_error_code','text','YES'),
    ('report_generation_jobs','created_at','timestamptz','NO'),
    ('report_generation_attempts','attempt_id','uuid','NO'),
    ('report_generation_attempts','job_id','uuid','NO'),
    ('report_generation_attempts','report_id','text','NO'),
    ('report_generation_attempts','run_number','int4','NO'),
    ('report_generation_attempts','attempt','int4','NO'),
    ('report_generation_attempts','strategy','text','NO'),
    ('report_generation_attempts','writer_model','text','YES'),
    ('report_generation_attempts','started_at','timestamptz','NO'),
    ('report_generation_attempts','finished_at','timestamptz','YES'),
    ('report_generation_attempts','duration_ms','int4','YES'),
    ('report_generation_attempts','failure_stage','text','YES'),
    ('report_generation_attempts','error_code','text','YES'),
    ('report_generation_attempts','validation_errors','jsonb','NO')
),
reliability_column_checks as (
  select
    'POSTFLIGHT_RELIABILITY_COLUMN'::text as category,
    e.table_name||'.'||e.column_name as check_name,
    c.column_name is not null
      and c.udt_name=e.udt_name
      and c.is_nullable=e.is_nullable as pass,
    format(
      'expected type=%s nullable=%s; actual type=%s nullable=%s; default=%s',
      e.udt_name,e.is_nullable,
      coalesce(c.udt_name,'<missing>'),coalesce(c.is_nullable,'<missing>'),
      coalesce(c.column_default,'<none>')
    ) as detail
  from expected_reliability_columns e
  left join information_schema.columns c
    on c.table_schema='public'
   and c.table_name=e.table_name
   and c.column_name=e.column_name
),
expected_tables(table_name) as (
  values
    ('report_input_snapshots'),
    ('paid_report_snapshots'),
    ('report_generation_jobs'),
    ('report_generation_attempts')
),
table_checks as (
  select
    'POSTFLIGHT_TABLE'::text as category,
    'public.'||e.table_name as check_name,
    c.oid is not null and c.relkind='r' as pass,
    case
      when c.oid is null then 'missing'
      else format('oid=%s; relkind=%s',c.oid,c.relkind)
    end as detail
  from expected_tables e
  left join pg_class c on c.oid=to_regclass('public.'||e.table_name)
),
primary_key_checks as (
  select
    'POSTFLIGHT_CONSTRAINT'::text as category,
    e.table_name||' primary key ('||e.column_name||')' as check_name,
    exists(
      select 1
      from pg_constraint con
      join pg_attribute att
        on att.attrelid=con.conrelid
       and att.attnum=any(con.conkey)
       and att.attname=e.column_name
      where con.conrelid=to_regclass('public.'||e.table_name)
        and con.contype='p'
        and con.convalidated
        and cardinality(con.conkey)=1
    ) as pass,
    'required validated single-column primary key'::text as detail
  from (values
    ('report_input_snapshots','order_id'),
    ('paid_report_snapshots','report_id'),
    ('report_generation_jobs','job_id'),
    ('report_generation_attempts','attempt_id')
  ) e(table_name,column_name)
),
expected_foreign_keys(table_name,column_name,referenced_table,referenced_column) as (
  values
    ('report_input_snapshots','order_id','payment_orders','payment_order_id'),
    ('paid_report_snapshots','order_id','payment_orders','payment_order_id'),
    ('report_generation_jobs','order_id','payment_orders','payment_order_id'),
    ('report_generation_jobs','report_id','paid_report_snapshots','report_id'),
    ('report_generation_attempts','job_id','report_generation_jobs','job_id'),
    ('report_generation_attempts','report_id','paid_report_snapshots','report_id')
),
foreign_key_checks as (
  select
    'POSTFLIGHT_CONSTRAINT'::text as category,
    format('%s.%s -> %s.%s',e.table_name,e.column_name,e.referenced_table,e.referenced_column) as check_name,
    exists(
      select 1
      from pg_constraint con
      join pg_attribute source_att
        on source_att.attrelid=con.conrelid
       and source_att.attnum=any(con.conkey)
       and source_att.attname=e.column_name
      join pg_attribute target_att
        on target_att.attrelid=con.confrelid
       and target_att.attnum=any(con.confkey)
       and target_att.attname=e.referenced_column
      where con.conrelid=to_regclass('public.'||e.table_name)
        and con.confrelid=to_regclass('public.'||e.referenced_table)
        and con.contype='f'
        and con.convalidated
        and cardinality(con.conkey)=1
        and cardinality(con.confkey)=1
    ) as pass,
    'required validated foreign key'::text as detail
  from expected_foreign_keys e
),
unique_checks(check_name,pass,detail) as (
  values
    ('payment_orders.payment_order_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders')
        and i.indisunique and i.indisvalid and i.indpred is null
        and i.indnkeyatts=1 and a.attname='payment_order_id'
    ),'unconditional single-column unique index'),
    ('payment_orders.provider_payment_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders')
        and i.indisunique and i.indisvalid and i.indnkeyatts=1
        and a.attname='provider_payment_id'
    ),'single-column unique index'),
    ('payment_orders.provider_order_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.payment_orders')
        and i.indisunique and i.indisvalid and i.indnkeyatts=1
        and a.attname='provider_order_id'
    ),'single-column unique index'),
    ('paid_report_snapshots.order_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.paid_report_snapshots')
        and i.indisunique and i.indisvalid and i.indnkeyatts=1
        and a.attname='order_id'
    ),'one report per paid order'),
    ('report_generation_jobs.order_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.report_generation_jobs')
        and i.indisunique and i.indisvalid and i.indnkeyatts=1
        and a.attname='order_id'
    ),'one generation job per order'),
    ('report_generation_jobs.report_id unique',exists(
      select 1 from pg_index i join pg_attribute a
        on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
      where i.indrelid=to_regclass('public.report_generation_jobs')
        and i.indisunique and i.indisvalid and i.indnkeyatts=1
        and a.attname='report_id'
    ),'one generation job per report'),
    ('report_generation_attempts job/run/attempt unique',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.report_generation_attempts')
        and con.contype='u' and con.convalidated
        and pg_get_constraintdef(con.oid) like '%job_id%'
        and pg_get_constraintdef(con.oid) like '%run_number%'
        and pg_get_constraintdef(con.oid) like '%attempt%'
    ),'one audit row per job run attempt')
),
unique_check_rows as (
  select 'POSTFLIGHT_UNIQUE'::text as category,check_name,pass,detail
  from unique_checks
),
expected_named_indexes(table_name,index_name) as (
  values
    ('payment_orders','payment_orders_provider_payment_id_unique_idx'),
    ('payment_orders','payment_orders_provider_order_id_unique_idx'),
    ('payment_orders','payment_orders_status_idx'),
    ('payment_orders','payment_orders_provider_idx'),
    ('payment_orders','payment_orders_product_type_idx'),
    ('payment_orders','payment_orders_created_at_idx'),
    ('payment_orders','payment_orders_report_id_idx'),
    ('report_input_snapshots','report_input_snapshots_expires_at_idx'),
    ('paid_report_snapshots','paid_report_snapshots_expires_at_idx'),
    ('report_generation_jobs','report_generation_jobs_due'),
    ('report_generation_attempts','report_generation_attempts_report_id_idx')
),
named_index_checks as (
  select
    'POSTFLIGHT_INDEX'::text as category,
    e.table_name||'.'||e.index_name as check_name,
    i.indexrelid is not null and i.indisvalid and i.indisready as pass,
    coalesce(pg_get_indexdef(i.indexrelid),'missing') as detail
  from expected_named_indexes e
  left join pg_class table_class
    on table_class.oid=to_regclass('public.'||e.table_name)
  left join pg_class index_class
    on index_class.oid=to_regclass('public.'||e.index_name)
  left join pg_index i
    on i.indrelid=table_class.oid
   and i.indexrelid=index_class.oid
),
invariant_checks(check_name,pass,detail) as (
  values
    ('paid report publish gate',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.paid_report_snapshots')
        and con.contype='c' and con.convalidated
        and pg_get_constraintdef(con.oid) like '%COMPLETED%'
        and pg_get_constraintdef(con.oid) like '%snapshot_json IS NOT NULL%'
        and pg_get_constraintdef(con.oid) like '%paid-report-v1%'
    ),'COMPLETED requires snapshot_json and paid-report-v1 gate'),
    ('paid report lifecycle states',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.paid_report_snapshots')
        and con.contype='c' and con.convalidated
        and pg_get_constraintdef(con.oid) like '%QUEUED%'
        and pg_get_constraintdef(con.oid) like '%GENERATING%'
        and pg_get_constraintdef(con.oid) like '%RETRYING%'
        and pg_get_constraintdef(con.oid) like '%COMPLETED%'
        and pg_get_constraintdef(con.oid) like '%FAILED_REQUIRES_ATTENTION%'
        and pg_get_constraintdef(con.oid) like '%EXPIRED%'
    ),'all report lifecycle states required'),
    ('generation job lifecycle states',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.report_generation_jobs')
        and con.contype='c' and con.convalidated
        and pg_get_constraintdef(con.oid) like '%QUEUED%'
        and pg_get_constraintdef(con.oid) like '%RUNNING%'
        and pg_get_constraintdef(con.oid) like '%RETRYING%'
        and pg_get_constraintdef(con.oid) like '%COMPLETED%'
        and pg_get_constraintdef(con.oid) like '%FAILED_REQUIRES_ATTENTION%'
        and pg_get_constraintdef(con.oid) like '%EXPIRED%'
    ),'all job lifecycle states required'),
    ('generation job attempt limit',exists(
      select 1 from pg_constraint con
      where con.conrelid=to_regclass('public.report_generation_jobs')
        and con.contype='c' and con.convalidated
        and pg_get_constraintdef(con.oid) like '%attempt_count%'
        and pg_get_constraintdef(con.oid) like '%0%'
        and pg_get_constraintdef(con.oid) like '%3%'
    ),'attempt_count constrained from 0 through 3')
),
invariant_check_rows as (
  select 'POSTFLIGHT_INVARIANT'::text as category,check_name,pass,detail
  from invariant_checks
),
expiry_checks(check_name,pass,detail) as (
  values
    ('report_input_snapshots expires_at +90 days',exists(
      select 1 from information_schema.columns
      where table_schema='public' and table_name='report_input_snapshots'
        and column_name='expires_at' and is_nullable='NO'
        and column_default like '%90 days%'
    ),'non-null expires_at default must contain 90 days'),
    ('paid_report_snapshots expires_at +90 days',exists(
      select 1 from information_schema.columns
      where table_schema='public' and table_name='paid_report_snapshots'
        and column_name='expires_at' and is_nullable='NO'
        and column_default like '%90 days%'
    ),'non-null expires_at default must contain 90 days'),
    ('expiry indexes',
      to_regclass('public.report_input_snapshots_expires_at_idx') is not null
      and to_regclass('public.paid_report_snapshots_expires_at_idx') is not null,
      'both expires_at indexes required')
),
expiry_check_rows as (
  select 'POSTFLIGHT_EXPIRY'::text as category,check_name,pass,detail
  from expiry_checks
),
rls_checks as (
  select
    'POSTFLIGHT_RLS'::text as category,
    'public.'||e.table_name as check_name,
    c.oid is not null and c.relrowsecurity as pass,
    case
      when c.oid is null then 'table missing'
      else format('rls_enabled=%s',c.relrowsecurity)
    end as detail
  from expected_tables e
  left join pg_class c on c.oid=to_regclass('public.'||e.table_name)
),
protected_tables(table_name) as (
  values
    ('payment_orders'),
    ('report_input_snapshots'),
    ('paid_report_snapshots'),
    ('report_generation_jobs'),
    ('report_generation_attempts')
),
client_roles(role_name) as (
  values ('anon'),('authenticated')
),
table_privilege_checks as (
  select
    'POSTFLIGHT_PRIVILEGE'::text as category,
    r.role_name||' no direct access to public.'||t.table_name as check_name,
    c.oid is not null
      and not coalesce(has_table_privilege(r.role_name,c.oid,'SELECT'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'INSERT'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'UPDATE'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'DELETE'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'TRUNCATE'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'REFERENCES'),false)
      and not coalesce(has_table_privilege(r.role_name,c.oid,'TRIGGER'),false) as pass,
    case
      when c.oid is null then 'table missing'
      else format(
        'select=%s insert=%s update=%s delete=%s truncate=%s references=%s trigger=%s',
        has_table_privilege(r.role_name,c.oid,'SELECT'),
        has_table_privilege(r.role_name,c.oid,'INSERT'),
        has_table_privilege(r.role_name,c.oid,'UPDATE'),
        has_table_privilege(r.role_name,c.oid,'DELETE'),
        has_table_privilege(r.role_name,c.oid,'TRUNCATE'),
        has_table_privilege(r.role_name,c.oid,'REFERENCES'),
        has_table_privilege(r.role_name,c.oid,'TRIGGER')
      )
    end as detail
  from protected_tables t
  cross join client_roles r
  left join pg_class c on c.oid=to_regclass('public.'||t.table_name)
),
rpc_catalog as (
  select p.oid,p.prosecdef,p.proconfig,p.prosrc
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.oid=to_regprocedure('public.paid_report_reliability(text,jsonb)')
),
rpc_checks(check_name,pass,detail) as (
  values
    ('paid_report_reliability(text,jsonb) exists',
      to_regprocedure('public.paid_report_reliability(text,jsonb)') is not null,
      coalesce(to_regprocedure('public.paid_report_reliability(text,jsonb)')::text,'missing')),
    ('reliability RPC security configuration',coalesce((
      select prosecdef
        and coalesce(array_to_string(proconfig,','),'') like '%search_path=public, pg_temp%'
      from rpc_catalog
    ),false),'security definer with fixed search_path=public, pg_temp'),
    ('service_role can execute reliability RPC',coalesce(
      has_function_privilege(
        'service_role',to_regprocedure('public.paid_report_reliability(text,jsonb)'),'EXECUTE'
      ),false
    ),'service_role execute required'),
    ('anon cannot execute reliability RPC',not coalesce(
      has_function_privilege(
        'anon',to_regprocedure('public.paid_report_reliability(text,jsonb)'),'EXECUTE'
      ),false
    ),'anon execute must be revoked'),
    ('authenticated cannot execute reliability RPC',not coalesce(
      has_function_privilege(
        'authenticated',to_regprocedure('public.paid_report_reliability(text,jsonb)'),'EXECUTE'
      ),false
    ),'authenticated execute must be revoked'),
    ('retry admin concurrency and expiry actions present',coalesce((
      select position('FAILED_REQUIRES_ATTENTION' in prosrc)>0
        and position('admin_retry' in prosrc)>0
        and position('skip locked' in lower(prosrc))>0
        and position('normal_writer' in prosrc)>0
        and position('writer_regeneration' in prosrc)>0
        and position('deterministic_fallback' in prosrc)>0
        and position('90 days' in prosrc)>0
      from rpc_catalog
    ),false),'RPC contains retry, admin, claim and expiry paths')
),
rpc_check_rows as (
  select 'POSTFLIGHT_RPC'::text as category,check_name,pass,detail
  from rpc_checks
),
legacy_rpc_check as (
  select
    'POSTFLIGHT_PRIVILEGE'::text as category,
    'legacy paid RPCs unavailable to public clients'::text as check_name,
    not exists(
      select 1
      from pg_proc p
      join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public'
        and p.proname in (
          'create_ready_payment_order','mark_toss_payment_order_paid',
          'fulfill_paid_saju_mbti_report','save_comprehensive_report_draft_snapshot',
          'get_generated_comprehensive_report_result',
          'get_paid_saju_mbti_report_result','find_paid_report_by_access_token_hash'
        )
        and (
          has_function_privilege('anon',p.oid,'EXECUTE')
          or has_function_privilege('authenticated',p.oid,'EXECUTE')
        )
    ) as pass,
    'anon/authenticated execute must be absent for all legacy paid RPCs'::text as detail
),
product_check_rows as (
  select
    con.conname,
    pg_get_constraintdef(con.oid) as definition,
    con.convalidated
      and pg_get_constraintdef(con.oid) like '%''saju_mbti_full''%'
      and pg_get_constraintdef(con.oid) like '%''career_money_study''%'
      and pg_get_constraintdef(con.oid) like '%''love_marriage_child''%'
      and pg_get_constraintdef(con.oid) like '%''saju_mbti_compatibility''%'
      and pg_get_constraintdef(con.oid) like '%''major_fortune''%'
      and pg_get_constraintdef(con.oid) like '%''annual_fortune''%'
      and pg_get_constraintdef(con.oid) like '%''saju_basic''%'
      and pg_get_constraintdef(con.oid) like '%''saju_full''%'
      and pg_get_constraintdef(con.oid) like '%''daewoon''%'
      and pg_get_constraintdef(con.oid) like '%''saewoon''%'
      and pg_get_constraintdef(con.oid) like '%''compatibility''%' as compatible
  from pg_constraint con
  join pg_attribute att
    on att.attrelid=con.conrelid
   and att.attname='product_type'
   and att.attnum=any(con.conkey)
  where con.conrelid=to_regclass('public.payment_orders')
    and con.contype='c'
),
product_check as (
  select
    'POSTFLIGHT_PRODUCT_CHECK'::text as category,
    'payment_orders.product_type canonical and legacy compatibility'::text as check_name,
    count(*)>0 and coalesce(bool_and(compatible),false) as pass,
    coalesce(
      string_agg(
        format('%s: %s; compatible=%s',conname,definition,compatible),
        ' | ' order by conname
      ),
      'no product_type CHECK found'
    ) as detail
  from product_check_rows
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
  select 'reports payment_order_id without payment_orders row',count(*)
  from public.reports r
  where r.payment_order_id is not null
    and not exists(
      select 1 from public.payment_orders po
      where po.payment_order_id=r.payment_order_id
    )
  union all
  select 'payment_orders report_id without report snapshot row',count(*)
  from public.payment_orders po
  where po.report_id is not null
    and not exists(select 1 from public.reports r where r.report_id=po.report_id)
    and not exists(
      select 1 from public.paid_report_snapshots prs
      where prs.report_id=po.report_id
    )
  union all
  select 'payment_orders unknown product_type rows',count(*)
  from public.payment_orders
  where product_type not in (
    'saju_mbti_full','career_money_study','love_marriage_child',
    'saju_mbti_compatibility','major_fortune','annual_fortune',
    'saju_basic','saju_full','daewoon','saewoon','compatibility'
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
  from public.payment_orders
  where status not in ('ready','paid','failed','canceled','refunded')
),
data_checks as (
  select
    'POSTFLIGHT_DATA'::text as category,
    check_name,
    violation_count=0 as pass,
    format('violation_count=%s',violation_count) as detail
  from data_violations
),
all_checks as (
  select * from table_checks
  union all select * from base_column_checks
  union all select * from reliability_column_checks
  union all select * from primary_key_checks
  union all select * from foreign_key_checks
  union all select * from unique_check_rows
  union all select * from named_index_checks
  union all select * from invariant_check_rows
  union all select * from expiry_check_rows
  union all select * from rls_checks
  union all select * from table_privilege_checks
  union all select * from rpc_check_rows
  union all select * from legacy_rpc_check
  union all select * from product_check
  union all select * from data_checks
),
postflight_summary as (
  select
    'POSTFLIGHT_00_SUMMARY'::text as category,
    'production reliability reconciliation'::text as check_name,
    count(*) filter(where not pass)=0 as pass,
    format(
      'failed=%s; total=%s',
      count(*) filter(where not pass),count(*)
    ) as detail
  from all_checks
),
final_result as (
  select * from postflight_summary
  union all
  select * from all_checks
)
select category,check_name,pass,detail
from final_result
order by
  case when category='POSTFLIGHT_00_SUMMARY' then 0 when not pass then 1 else 2 end,
  category,
  check_name;
