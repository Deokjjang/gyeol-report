-- READ ONLY, one result table. Run after paid_report_publish_expiry_patch.sql.
-- The older reconciliation postflight intentionally describes the old default expiry.
with checks(category,check_name,pass,detail) as (
  select 'SCHEMA','report expiry nullable without default',exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='paid_report_snapshots'
      and column_name='expires_at' and is_nullable='YES' and column_default is null
  ),'Unpublished reports have no access deadline'
  union all select 'SCHEMA','validated publication expiry invariant',exists (
    select 1 from pg_constraint where conrelid='public.paid_report_snapshots'::regclass
      and conname='paid_report_snapshots_access_expiry_check' and convalidated
  ),'COMPLETED requires publication; published reports expire exactly 2160 hours later'
  union all select 'SCHEMA','input provisional retention unchanged',exists (
    select 1 from information_schema.columns where table_schema='public' and table_name='report_input_snapshots'
      and column_name='expires_at' and is_nullable='NO' and column_default like '%90 days%'
  ),'Unpaid/unpublished input remains bounded; first publish sets its generation-based deadline'
  union all select 'DATA','publication deadline consistency',not exists (
    select 1 from public.paid_report_snapshots where not (
      (published_at is null and expires_at is null and status<>'COMPLETED' and snapshot_json is null)
      or (published_at is not null and expires_at is not null and expires_at=published_at+interval '2160 hours')
    )
  ),'No conflicting report rows; no personal data returned'
  union all select 'DATA','published input retention consistency',not exists (
    select 1 from public.paid_report_snapshots s join public.report_input_snapshots i using(order_id)
      where s.published_at is not null and i.expires_at is distinct from s.expires_at
  ),'Existing input deadlines match the original publication deadline'
  union all select 'RPC','first publish and input retention transaction',
    position('coalesce(r.published_at,clock_timestamp())' in p.prosrc)>0
    and position('2160 hours' in p.prosrc)>0
    and position('if r.published_at is null then' in p.prosrc)>0,
    'RPC preserves first publication on republish'
    from pg_proc p where p.oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'RPC','expiry patch keeps recovery queue',position('claim_payment_recovery' in p.prosrc)>0,
    'Cumulative RPC includes payment recovery fairness'
    from pg_proc p where p.oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'SECURITY','service-only RPC',
    has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE')
    and not has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE')
    and not has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE'),
    'No public/anonymous/authenticated execution'
), results as (
  select * from checks
  union all select 'SUMMARY','PUBLISH_EXPIRY_SUMMARY',bool_and(pass is true),
    format('failed=%s total=%s',count(*) filter (where pass is distinct from true),count(*)) from checks
)
select category,check_name,pass,detail from results order by pass asc nulls first,category,check_name;
