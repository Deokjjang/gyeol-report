-- PAID-REPORT-QUARANTINE-RECOVERY-P1-01
-- Apply manually AFTER the production reliability reconciliation, BEFORE the
-- matching application release. No db push or migration-history repair required.
-- Idempotent constraint + function replacement: no backfill or row writes.
-- Old read clients cannot quarantine without expectedSnapshot, but still hide
-- invalid results. Do not roll back to the destructive historical RPC.
begin;
set local lock_timeout = '5s';

-- The historical CHECK required every non-COMPLETED snapshot to be NULL.
-- Recovery states now retain the forensic value; only EXPIRED must erase it.
-- The transaction keeps the constraint and RPC switch atomic for other sessions.
alter table public.paid_report_snapshots
  drop constraint if exists paid_report_snapshots_check,
  drop constraint if exists paid_report_snapshots_publication_check,
  add constraint paid_report_snapshots_publication_check check (
    (status = 'COMPLETED' and snapshot_json is not null and gate_version = 'paid-report-v1')
    or status in ('QUEUED','GENERATING','RETRYING','FAILED_REQUIRES_ATTENTION')
    or (status = 'EXPIRED' and snapshot_json is null)
  );

create or replace function public.paid_report_reliability(
  p_action text,
  p_data jsonb default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $paid_report_reliability$
declare
  o public.payment_orders%rowtype;
  j public.report_generation_jobs%rowtype;
  r public.paid_report_snapshots%rowtype;
  t uuid;
  v_id text;
  v_input jsonb;
  v_status text;
begin
  if p_action = 'create_order' then
    if jsonb_typeof(p_data->'inputSnapshot'->'reportInputPayload') is distinct from 'object' then
      return jsonb_build_object('ok',false,'code','INPUT_REQUIRED');
    end if;
    insert into public.payment_orders(payment_order_id,product_type,provider,amount,currency,status,input_snapshot,provider_order_id,created_at,updated_at,requested_at)
    values(p_data->>'paymentOrderId',p_data->>'productType',p_data->>'provider',(p_data->>'amount')::integer,'KRW','ready','{}',p_data->>'providerOrderId',now(),now(),now()) returning * into o;
    insert into public.report_input_snapshots(order_id,payload_json) values(o.payment_order_id,p_data->'inputSnapshot');
    return jsonb_build_object('ok',true);
  elsif p_action = 'find_order' then
    select * into o from public.payment_orders where
      (payment_order_id = p_data->>'paymentOrderId' or provider_order_id = p_data->>'orderId');
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select payload_json into v_input from public.report_input_snapshots where order_id=o.payment_order_id and expires_at>now();
    return jsonb_build_object('ok',true,'order',to_jsonb(o)||jsonb_build_object('input_snapshot',coalesce(v_input,'{}')));
  elsif p_action = 'pending_payment' then
    select * into o from public.payment_orders where status='ready' and provider_payment_id is not null
      and coalesce(confirm_lease_until,'epoch')<now() order by created_at limit 1;
    return jsonb_build_object('ok',true,'order',case when found then to_jsonb(o) else null end);
  elsif p_action = 'confirm_claim' then
    select * into o from public.payment_orders where provider_order_id=p_data->>'orderId' for update;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    if o.amount <> (p_data->>'amount')::integer or o.currency <> 'KRW' or o.provider <> 'toss' or
      (o.provider_payment_id is not null and o.provider_payment_id <> p_data->>'paymentKey') then
      return jsonb_build_object('ok',false,'code','PAYMENT_MISMATCH');
    end if;
    if o.status='paid' and o.report_id is not null then return jsonb_build_object('ok',true,'reportId',o.report_id); end if;
    if o.status not in ('ready','paid') then return jsonb_build_object('ok',false,'code','INVALID_STATE'); end if;
    if o.confirm_lease_until>now() then return jsonb_build_object('ok',true,'pending',true); end if;
    if not exists(select 1 from public.report_input_snapshots where order_id=o.payment_order_id and expires_at>now()) then
      return jsonb_build_object('ok',false,'code','INPUT_EXPIRED');
    end if;
    t:=gen_random_uuid();
    update public.payment_orders set provider_payment_id=p_data->>'paymentKey',confirm_token=t,confirm_lease_until=now()+interval '2 minutes' where payment_order_id=o.payment_order_id;
    return jsonb_build_object('ok',true,'token',t,'alreadyPaid',o.status='paid');
  elsif p_action = 'confirm_finish' then
    select * into o from public.payment_orders where provider_order_id=p_data->>'orderId' for update;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    if o.provider_payment_id is distinct from p_data->>'paymentKey' then return jsonb_build_object('ok',false,'code','PAYMENT_MISMATCH'); end if;
    if o.status='paid' and o.report_id is not null then return jsonb_build_object('ok',true,'reportId',o.report_id); end if;
    if o.confirm_token is distinct from (p_data->>'token')::uuid then return jsonb_build_object('ok',false,'code','STALE_CONFIRM'); end if;
    v_id:='report_'||replace(gen_random_uuid()::text,'-','');
    insert into public.paid_report_snapshots(report_id,order_id,product_type) values(v_id,o.payment_order_id,o.product_type);
    insert into public.report_generation_jobs(order_id,report_id) values(o.payment_order_id,v_id);
    update public.payment_orders set status='paid',paid_at=coalesce(paid_at,(p_data->>'paidAt')::timestamptz,now()),report_id=v_id,
      confirm_token=null,confirm_lease_until=null,updated_at=now() where payment_order_id=o.payment_order_id;
    update public.report_input_snapshots set expires_at=now()+interval '90 days' where order_id=o.payment_order_id;
    return jsonb_build_object('ok',true,'reportId',v_id);
  elsif p_action = 'claim_job' then
    update public.report_generation_attempts a set finished_at=now(),failure_stage='lease',error_code='LEASE_EXPIRED'
      from public.report_generation_jobs x where a.job_id=x.job_id and a.run_number=x.run_number and a.attempt=x.attempt_count
      and x.status='RUNNING' and x.lease_until<now() and a.finished_at is null;
    update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',last_error_code='LEASE_EXPIRED',lease_token=null
      where status='RUNNING' and lease_until<now() and attempt_count>=3;
    update public.paid_report_snapshots s set status='FAILED_REQUIRES_ATTENTION' from public.report_generation_jobs x
      where s.report_id=x.report_id and x.status='FAILED_REQUIRES_ATTENTION' and s.status<>'EXPIRED';
    select x.* into j from public.report_generation_jobs x join public.paid_report_snapshots s using(report_id)
      join public.payment_orders po on po.payment_order_id=x.order_id
      where po.status='paid' and s.expires_at>now() and x.attempt_count<3 and
      ((x.status in ('QUEUED','RETRYING') and x.next_retry_at<=now()) or (x.status='RUNNING' and x.lease_until<now()))
      order by x.next_retry_at for update of x skip locked limit 1;
    if not found then return jsonb_build_object('ok',true,'job',null); end if;
    t:=gen_random_uuid();
    update public.report_generation_jobs set status='RUNNING',attempt_count=attempt_count+1,lease_token=t,lease_until=now()+interval '10 minutes'
      where job_id=j.job_id returning * into j;
    update public.paid_report_snapshots set status='GENERATING' where report_id=j.report_id;
    insert into public.report_generation_attempts(job_id,report_id,run_number,attempt,strategy,writer_model)
      values(j.job_id,j.report_id,j.run_number,j.attempt_count,
        case j.attempt_count when 1 then 'normal_writer' when 2 then 'writer_regeneration' else 'deterministic_fallback' end,
        case when j.attempt_count=3 then null else p_data->>'model' end);
    select payload_json->'reportInputPayload' into v_input from public.report_input_snapshots where order_id=j.order_id and expires_at>now();
    select * into r from public.paid_report_snapshots where report_id=j.report_id;
    return jsonb_build_object('ok',true,'job',to_jsonb(j)||jsonb_build_object('payload',v_input,'created_at',r.created_at,'expires_at',r.expires_at,'product_type',r.product_type));
  elsif p_action = 'finish_job' then
    select * into j from public.report_generation_jobs where job_id=(p_data->>'jobId')::uuid for update;
    if not found or j.status<>'RUNNING' or j.lease_token is distinct from (p_data->>'token')::uuid or j.lease_until<=now() then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    select * into r from public.paid_report_snapshots where report_id=j.report_id for update;
    if r.expires_at<=now() or not exists(select 1 from public.payment_orders where payment_order_id=j.order_id and status='paid') then
      return jsonb_build_object('ok',false,'code','REPORT_UNAVAILABLE');
    end if;
    if p_data->>'success'='true' then
      if p_data->>'gateVersion' is distinct from 'paid-report-v1' or
        jsonb_typeof(p_data->'snapshot'->'draft') is distinct from 'object' or
        jsonb_typeof(p_data->'snapshot'->'evidencePacket') is distinct from 'object' or
        p_data->'snapshot'->>'reportId' is distinct from j.report_id or
        p_data->'snapshot'->>'productType' is distinct from r.product_type then
        return jsonb_build_object('ok',false,'code','PUBLISH_REJECTED');
      end if;
      v_status:='COMPLETED';
      update public.paid_report_snapshots set status=v_status,snapshot_json=p_data->'snapshot',gate_version=p_data->>'gateVersion',published_at=now() where report_id=j.report_id;
    else
      v_status:=case when j.attempt_count>=3 then 'FAILED_REQUIRES_ATTENTION' else 'RETRYING' end;
      -- Retain the last published snapshot for investigation throughout recovery.
      -- New failed drafts are never stored here; only successful publication replaces it.
      update public.paid_report_snapshots set status=v_status where report_id=j.report_id;
    end if;
    update public.report_generation_attempts set finished_at=now(),duration_ms=(p_data->>'durationMs')::integer,
      failure_stage=p_data->>'stage',error_code=p_data->>'code',validation_errors=coalesce(p_data->'errors','[]')
      where job_id=j.job_id and run_number=j.run_number and attempt=j.attempt_count;
    update public.report_generation_jobs set status=v_status,lease_token=null,lease_until=null,last_error_code=p_data->>'code',
      next_retry_at=now()+case when j.attempt_count=1 then interval '30 seconds' else interval '2 minutes' end where job_id=j.job_id;
    return jsonb_build_object('ok',true,'status',v_status);
  elsif p_action = 'read_report' then
    select s.* into r from public.paid_report_snapshots s join public.payment_orders po on po.payment_order_id=s.order_id
      where s.report_id=p_data->>'reportId' and po.status='paid';
    if not found then return jsonb_build_object('ok',false,'code','REPORT_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'status',case when r.expires_at<=now() then 'EXPIRED' else r.status end,
      'expiresAt',r.expires_at,'snapshot',case when r.status='COMPLETED' and r.expires_at>now() then r.snapshot_json else null end);
  elsif p_action = 'quarantine' then
    -- Match finish_job/admin_retry lock order: job first, then report.
    -- A delayed reader may outlive an entire recovery run. Never quarantine a
    -- replacement snapshot or disturb a queued/running recovery job.
    if not (p_data ? 'expectedSnapshot') then
      return jsonb_build_object('ok',false,'code','QUARANTINE_OBSERVATION_REQUIRED');
    end if;
    select * into j from public.report_generation_jobs where report_id=p_data->>'reportId' for update;
    if not found then return jsonb_build_object('ok',false,'code','REPORT_NOT_FOUND'); end if;
    select * into r from public.paid_report_snapshots where report_id=j.report_id for update;
    if not found then return jsonb_build_object('ok',false,'code','REPORT_NOT_FOUND'); end if;
    if j.status<>'COMPLETED' or r.status<>'COMPLETED' or r.expires_at<=now()
      or coalesce(r.snapshot_json,'null'::jsonb) is distinct from p_data->'expectedSnapshot' then
      return jsonb_build_object('ok',true,'quarantined',false);
    end if;
    update public.paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION' where report_id=r.report_id;
    update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',
      last_error_code='PUBLISHED_SNAPSHOT_VALIDATION_FAILED' where job_id=j.job_id;
    return jsonb_build_object('ok',true,'quarantined',true);
  elsif p_action = 'admin_retry' then
    select x.* into j from public.report_generation_jobs x join public.paid_report_snapshots s using(report_id)
      join public.payment_orders po on po.payment_order_id=x.order_id
      where x.report_id=p_data->>'reportId' and x.status='FAILED_REQUIRES_ATTENTION' and s.expires_at>now() and po.status='paid' for update of x;
    if not found then return jsonb_build_object('ok',false,'code','NOT_RETRYABLE'); end if;
    update public.report_generation_jobs set status='QUEUED',attempt_count=0,run_number=run_number+1,next_retry_at=now(),last_error_code=null where job_id=j.job_id;
    update public.paid_report_snapshots set status='QUEUED' where report_id=j.report_id;
    return jsonb_build_object('ok',true);
  elsif p_action = 'attention' then
    return jsonb_build_object('ok',true,'jobs',coalesce((select jsonb_agg(to_jsonb(x)) from
      (select job_id,report_id,order_id,attempt_count,last_error_code,created_at from public.report_generation_jobs
       where status='FAILED_REQUIRES_ATTENTION' order by created_at limit 100) x),'[]'));
  elsif p_action = 'expire' then
    update public.report_generation_jobs x set status='EXPIRED',lease_token=null,lease_until=null from public.paid_report_snapshots s
      where x.report_id=s.report_id and s.expires_at<=now();
    update public.paid_report_snapshots set status='EXPIRED',snapshot_json=null where expires_at<=now();
    delete from public.report_input_snapshots where expires_at<=now();
    update public.report_generation_attempts a set validation_errors='[]' from public.paid_report_snapshots s where a.report_id=s.report_id and s.expires_at<=now();
    return jsonb_build_object('ok',true);
  end if;
  return jsonb_build_object('ok',false,'code','INVALID_ACTION');
exception when unique_violation then
  return jsonb_build_object('ok',false,'code','DUPLICATE_ORDER_OR_PAYMENT');
end
$paid_report_reliability$;

revoke all on function public.paid_report_reliability(text,jsonb) from public, anon, authenticated;
grant execute on function public.paid_report_reliability(text,jsonb) to service_role;

commit;
