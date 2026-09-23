-- SELECT only. Run after paid_report_one_call_delivery_patch.sql.
with rpc as (
  select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) as body
), checks(check_name, pass) as (
  select 'delivery audit column', exists(select 1 from information_schema.columns
    where table_schema='public' and table_name='report_generation_attempts' and column_name='delivery_audit'
      and data_type='jsonb' and is_nullable='NO')
  union all select 'only first claim is writer opportunity',
    position('case when j.attempt_count=1 then ''normal_writer'' else ''deterministic_fallback'' end' in body)>0
    and position('writer_regeneration' in body)=0 from rpc
  union all select 'canonical failure requires attention',
    position('FALLBACK_INVARIANT_FAILED' in body)>0 and position('PREFLIGHT_CONTRACT_INVALID' in body)>0 from rpc
  union all select 'safe delivery metadata and explicit admin cycle',
    position('delivery_audit=jsonb_strip_nulls' in body)>0 and position('run_number=run_number+1' in body)>0 from rpc
  union all select 'cumulative consent and publish expiry retained',
    position('consentEvidence' in body)>0 and position('published_at' in body)>0
    and position('90 days' in body)>0 from rpc
)
select check_name, pass from checks order by check_name;
