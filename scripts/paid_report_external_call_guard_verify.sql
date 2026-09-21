-- READ ONLY. Single result table; no prompts, responses or customer data.
with checks(category,check_name,pass,detail) as (
  select 'SCHEMA','external call audit column',exists (
    select 1 from information_schema.columns where table_schema='public'
      and table_name='report_generation_attempts' and column_name='external_calls'
      and data_type='jsonb' and is_nullable='NO' and column_default='''[]''::jsonb'
  ),'Unknown historic usage stays empty; no backfill'
  union all select 'SCHEMA','bounded audit array',exists (
    select 1 from pg_constraint where conrelid='public.report_generation_attempts'::regclass
      and conname='report_generation_attempts_external_calls_check' and convalidated
  ),'At most two HTTP audit entries per attempt'
  union all select 'RPC','audit metadata allowlist',
    position('external_calls=v_calls' in p.prosrc)>0 and position('''inputTokens''' in p.prosrc)>0
      and position('''outcome''' in p.prosrc)>0,
    'No raw provider payload stored by the audit writer'
    from pg_proc p where p.oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'RPC','cumulative recovery and expiry',
    position('claim_payment_recovery' in p.prosrc)>0 and position('expectedSnapshot' in p.prosrc)>0
      and position('coalesce(r.published_at,clock_timestamp())' in p.prosrc)>0,
    'Payment recovery, quarantine comparison and first-publication expiry retained'
    from pg_proc p where p.oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'SECURITY','service-only RPC',
    has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE')
      and not has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE')
      and not has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE'),
    'Existing service-role boundary retained'
), results as (
  select * from checks
  union all select 'SUMMARY','EXTERNAL_CALL_GUARD_SUMMARY',bool_and(pass is true),
    format('failed=%s total=%s',count(*) filter(where pass is distinct from true),count(*)) from checks
)
select category,check_name,pass,detail from results order by pass asc nulls first,category,check_name;
