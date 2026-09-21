-- READ ONLY: one result table, no customer input or full snapshots.
with checks(category,check_name,pass,detail) as (
  select 'RPC','single durable consent store',
    position('jsonb_strip_nulls(jsonb_build_object(''consentEvidence''' in prosrc)>0
      and position('(p_data->''inputSnapshot'')-''consentEvidence''' in prosrc)>0
      and position('''consentEvidence'',o.input_snapshot->''consentEvidence''' in prosrc)>0,
    'Consent in payment order; report input joins by order_id'
    from pg_proc where oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'RPC','cumulative recovery/expiry/cost guard retained',
    position('claim_payment_recovery' in prosrc)>0 and position('expectedSnapshot' in prosrc)>0
      and position('coalesce(r.published_at,clock_timestamp())' in prosrc)>0
      and position('external_calls=v_calls' in prosrc)>0,
    'Prior P1 patches retained'
    from pg_proc where oid='public.paid_report_reliability(text,jsonb)'::regprocedure
  union all select 'SECURITY','service-only RPC',
    has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE')
      and not has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE')
      and not has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE'),
    'Public clients cannot write consent evidence through the RPC'
), results as (
  select * from checks
  union all select 'SUMMARY','CONSENT_EVIDENCE_SUMMARY',bool_and(pass is true),
    format('failed=%s total=%s',count(*) filter(where pass is distinct from true),count(*)) from checks
)
select category,check_name,pass,detail from results order by pass asc nulls first,category,check_name;

-- For an individual dispute, run separately with a known order id:
-- select payment_order_id, input_snapshot->'consentEvidence' as consent_evidence
-- from public.payment_orders where payment_order_id = '<known order id>';
