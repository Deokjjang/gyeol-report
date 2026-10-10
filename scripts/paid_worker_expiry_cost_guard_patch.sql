-- GYEOL-V4-OPS-01. REVIEW ONLY: do not apply to Production without approval.
-- Apply AFTER paid_report_one_call_delivery_patch.sql. Do not replay old patches.
-- Replace predicates only; retain the deployed body, ACL, owner and settings.
begin;
set local lock_timeout = '5s';

do $cost_guard$
declare
  definition text := pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
  original text := definition;
  change record;
begin
  if position('delivery_audit=jsonb_strip_nulls' in definition)=0
    or position('consentEvidence' in definition)=0
    or position('v_publication+interval ''2160 hours''' in definition)=0 then
    raise exception 'PAID_WORKER_COST_GUARD_PREREQUISITE_MISSING';
  end if;
  for change in select * from (values
    ($old$where x.report_id=s.report_id and s.expires_at<=now();$old$,
     $new$where x.report_id=s.report_id and s.expires_at<=now()
        and (x.status is distinct from 'EXPIRED' or x.lease_token is not null or x.lease_until is not null);$new$),
    ($old$update public.paid_report_snapshots set status='EXPIRED',snapshot_json=null where expires_at<=now();$old$,
     $new$update public.paid_report_snapshots set status='EXPIRED',snapshot_json=null where expires_at<=now()
      and (status is distinct from 'EXPIRED' or snapshot_json is not null);$new$),
    ($old$where s.published_at is null
          and not exists (select 1 from public.report_input_snapshots i where i.order_id=x.order_id and i.expires_at>now())$old$,
     $new$where s.published_at is null
          and (x.status is distinct from 'FAILED_REQUIRES_ATTENTION' or x.lease_token is not null
            or x.lease_until is not null or x.last_error_code is distinct from 'INPUT_RETENTION_EXPIRED')
          and not exists (select 1 from public.report_input_snapshots i where i.order_id=x.order_id and i.expires_at>now())$new$),
    ($old$and x.last_error_code='INPUT_RETENTION_EXPIRED';$old$,
     $new$and x.last_error_code='INPUT_RETENTION_EXPIRED' and s.status is distinct from 'FAILED_REQUIRES_ATTENTION';$new$),
    ($old$where a.report_id=s.report_id and (s.expires_at<=now() or (s.published_at is null$old$,
     $new$where a.report_id=s.report_id and a.validation_errors is distinct from '[]'::jsonb
        and (s.expires_at<=now() or (s.published_at is null$new$),
    -- Multiple claims must not amplify the same no-op attention sync either.
    ($old$where s.report_id=x.report_id and x.status='FAILED_REQUIRES_ATTENTION' and s.status<>'EXPIRED';$old$,
     $new$where s.report_id=x.report_id and x.status='FAILED_REQUIRES_ATTENTION'
        and s.status not in ('EXPIRED','FAILED_REQUIRES_ATTENTION');$new$)
  ) as replacements(before_text, after_text)
  loop
    if position(change.after_text in definition)>0 then
      continue; -- Re-applying this patch changes neither rows nor the function.
    end if;
    if position(change.before_text in definition)=0
      or (length(definition)-length(replace(definition,change.before_text,'')))<>length(change.before_text) then
      raise exception 'PAID_WORKER_COST_GUARD_SOURCE_REVIEW_REQUIRED';
    end if;
    definition := replace(definition,change.before_text,change.after_text);
  end loop;
  if definition is distinct from original then execute definition; end if;
end
$cost_guard$;
commit;
