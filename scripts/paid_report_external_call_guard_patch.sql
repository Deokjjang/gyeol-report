-- EXTERNAL-CALL-TIMEOUT-COST-GUARD-P1-01
-- Apply after quarantine -> payment recovery -> report publish expiry patches.
-- SQL Editor transaction only. No business-row backfill, db push or history repair.
begin;
set local lock_timeout = '5s';
do $prerequisite$
begin
  if not exists (select 1 from pg_constraint where conrelid='public.paid_report_snapshots'::regclass
    and conname='paid_report_snapshots_access_expiry_check' and convalidated)
    or position('claim_payment_recovery' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure))=0 then
    raise exception 'REPORT_EXPIRY_PATCH_REQUIRED';
  end if;
end
$prerequisite$;
alter table public.report_generation_attempts add column if not exists external_calls jsonb not null default '[]';
do $audit_constraint$
begin
  if not exists(select 1 from pg_constraint where conrelid='public.report_generation_attempts'::regclass
    and conname='report_generation_attempts_external_calls_check') then
    alter table public.report_generation_attempts add constraint report_generation_attempts_external_calls_check
      check (jsonb_typeof(external_calls)='array' and jsonb_array_length(external_calls)<=2);
  end if;
end
$audit_constraint$;

create or replace function public.paid_report_reliability(
  p_action text,
  p_data jsonb default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set timezone = 'UTC'
as $paid_report_reliability$
declare
  o public.payment_orders%rowtype;
  j public.report_generation_jobs%rowtype;
  r public.paid_report_snapshots%rowtype;
  t uuid;
  v_id text;
  v_input jsonb;
  v_status text;
  v_publication timestamptz;
  v_calls jsonb;
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
    -- Compatibility for an old worker during rollout; new workers use atomic claim.
    select x.* into o from public.payment_orders x where x.status='ready' and x.provider='toss'
      and x.deleted_at is null and nullif(btrim(x.provider_payment_id),'') is not null
      and nullif(btrim(x.provider_order_id),'') is not null and x.recovery_attention_at is null
      and x.recovery_next_retry_at<=now() and coalesce(x.confirm_lease_until,'epoch')<=now()
      and exists (select 1 from public.report_input_snapshots where order_id=x.payment_order_id and expires_at>now())
      order by x.recovery_next_retry_at,x.created_at,x.payment_order_id limit 1;
    return jsonb_build_object('ok',true,'order',case when found then to_jsonb(o) else null end);
  elsif p_action = 'claim_payment_recovery' then
    -- Claim is atomic with the same lease used by success callbacks.
    select x.* into o from public.payment_orders x
      where x.provider='toss' and x.deleted_at is null and x.status in ('ready','paid')
        and (x.provider_payment_id is not null or x.confirm_token is not null or x.status='paid')
        and not (x.status='paid' and exists (
          select 1 from public.paid_report_snapshots s join public.report_generation_jobs g on g.report_id=s.report_id
          where s.order_id=x.payment_order_id and s.report_id=x.report_id and g.order_id=x.payment_order_id))
        and x.recovery_attention_at is null and x.recovery_next_retry_at<=now()
        and coalesce(x.confirm_lease_until,'epoch')<=now()
      order by x.recovery_next_retry_at,x.created_at,x.payment_order_id
      for update of x skip locked limit 1;
    if not found then return jsonb_build_object('ok',true,'order',null); end if;
    v_status:=null;
    if o.recovery_attempt_count>=5 then v_status:='RECOVERY_ATTEMPTS_EXHAUSTED';
    elsif nullif(btrim(o.provider_order_id),'') is null or nullif(btrim(o.provider_payment_id),'') is null then v_status:='RECOVERY_IDENTITY_MISSING';
    elsif o.amount<>1290 or o.currency<>'KRW' then v_status:='RECOVERY_ORDER_MISMATCH';
    elsif not exists (select 1 from public.report_input_snapshots where order_id=o.payment_order_id and expires_at>now()) then v_status:='RECOVERY_INPUT_EXPIRED';
    elsif o.report_id is not null and not exists (select 1 from public.paid_report_snapshots where order_id=o.payment_order_id and report_id=o.report_id) then v_status:='RECOVERY_REPORT_LINK_CONFLICT';
    end if;
    if v_status is not null then
      update public.payment_orders set recovery_attention_at=now(),recovery_last_error_code=v_status,
        confirm_token=null,confirm_lease_until=null,updated_at=now() where payment_order_id=o.payment_order_id;
      return jsonb_build_object('ok',true,'attention',true,'order',null,'orderId',o.payment_order_id,'code',v_status);
    end if;
    t:=gen_random_uuid();
    update public.payment_orders set confirm_token=t,confirm_lease_until=now()+interval '2 minutes',
      recovery_attempt_count=recovery_attempt_count+1,
      recovery_next_retry_at=now()+interval '2 minutes',
      recovery_last_error_code='RECOVERY_IN_PROGRESS',updated_at=now()
      where payment_order_id=o.payment_order_id returning * into o;
    return jsonb_build_object('ok',true,'order',jsonb_build_object(
      'payment_order_id',o.payment_order_id,'provider_order_id',o.provider_order_id,
      'provider_payment_id',o.provider_payment_id,'amount',o.amount),
      'token',t,'alreadyPaid',o.status='paid');
  elsif p_action = 'payment_recovery_failed' then
    select * into o from public.payment_orders where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or o.status not in ('ready','paid') or o.confirm_token is null or o.confirm_lease_until is null
      or o.confirm_token is distinct from (p_data->>'token')::uuid or o.confirm_lease_until<=now() then
      return jsonb_build_object('ok',false,'code','STALE_CONFIRM');
    end if;
    v_status:=case when p_data->>'code' in ('RECOVERY_TIMEOUT','RECOVERY_PROVIDER_UNCERTAIN',
      'RECOVERY_PROVIDER_TERMINAL','RECOVERY_PROVIDER_MISMATCH','RECOVERY_CONFIG_MISSING',
      'RECOVERY_DB_FINISH_FAILED','RECOVERY_REPORT_LINK_CONFLICT','RECOVERY_INPUT_EXPIRED')
      then p_data->>'code' else 'RECOVERY_PROVIDER_UNCERTAIN' end;
    update public.payment_orders set confirm_token=null,confirm_lease_until=null,
      recovery_last_error_code=v_status,updated_at=now(),
      recovery_attention_at=case when p_data->>'attention'='true' or recovery_attempt_count>=5 then now() else null end,
      recovery_next_retry_at=now()+case recovery_attempt_count
        when 1 then interval '1 minute' when 2 then interval '5 minutes'
        when 3 then interval '15 minutes' else interval '1 hour' end
      where payment_order_id=o.payment_order_id;
    return jsonb_build_object('ok',true,'attention',p_data->>'attention'='true' or o.recovery_attempt_count>=5,
      'orderId',o.payment_order_id);
  elsif p_action = 'confirm_claim' then
    select * into o from public.payment_orders where provider_order_id=p_data->>'orderId' for update;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    if o.amount <> (p_data->>'amount')::integer or o.currency <> 'KRW' or o.provider <> 'toss' or
      (o.provider_payment_id is not null and o.provider_payment_id <> p_data->>'paymentKey') then
      return jsonb_build_object('ok',false,'code','PAYMENT_MISMATCH');
    end if;
    if o.status='paid' and exists (select 1 from public.paid_report_snapshots s
      join public.report_generation_jobs g on g.report_id=s.report_id
      where s.order_id=o.payment_order_id and s.report_id=o.report_id and g.order_id=o.payment_order_id)
      then return jsonb_build_object('ok',true,'reportId',o.report_id); end if;
    if o.status not in ('ready','paid') or o.recovery_attention_at is not null then return jsonb_build_object('ok',false,'code','INVALID_STATE'); end if;
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
    if o.status='paid' and exists (select 1 from public.paid_report_snapshots s
      join public.report_generation_jobs g on g.report_id=s.report_id
      where s.order_id=o.payment_order_id and s.report_id=o.report_id and g.order_id=o.payment_order_id)
      then return jsonb_build_object('ok',true,'reportId',o.report_id); end if;
    if o.status not in ('ready','paid') or o.confirm_token is null or o.confirm_lease_until is null
      or o.confirm_lease_until<=now() or o.confirm_token is distinct from (p_data->>'token')::uuid then
      return jsonb_build_object('ok',false,'code','STALE_CONFIRM');
    end if;
    if not exists (select 1 from public.report_input_snapshots where order_id=o.payment_order_id and expires_at>now()) then
      return jsonb_build_object('ok',false,'code','INPUT_EXPIRED');
    end if;
    select * into r from public.paid_report_snapshots where order_id=o.payment_order_id;
    if found then
      if r.product_type<>o.product_type or (o.report_id is not null and o.report_id<>r.report_id)
        or r.expires_at<=now() then return jsonb_build_object('ok',false,'code','FULFILLMENT_CONFLICT'); end if;
      v_id:=r.report_id;
      -- Missing jobs for already published/attention reports need manual investigation.
      if r.status not in ('QUEUED','GENERATING','RETRYING') and not exists (
        select 1 from public.report_generation_jobs where report_id=v_id and order_id=o.payment_order_id) then
        return jsonb_build_object('ok',false,'code','FULFILLMENT_CONFLICT');
      end if;
    else
      if o.report_id is not null then return jsonb_build_object('ok',false,'code','FULFILLMENT_CONFLICT'); end if;
      v_id:='report_'||replace(gen_random_uuid()::text,'-','');
      insert into public.paid_report_snapshots(report_id,order_id,product_type) values(v_id,o.payment_order_id,o.product_type);
    end if;
    insert into public.report_generation_jobs(order_id,report_id) values(o.payment_order_id,v_id)
      on conflict (order_id) do nothing;
    if not exists (select 1 from public.report_generation_jobs where order_id=o.payment_order_id and report_id=v_id) then
      -- Roll back all writes in this function using its existing exception handler.
      raise unique_violation;
    end if;
    update public.payment_orders set status='paid',paid_at=coalesce(paid_at,(p_data->>'paidAt')::timestamptz,now()),report_id=v_id,
      confirm_token=null,confirm_lease_until=null,recovery_attention_at=null,recovery_last_error_code=null,updated_at=now() where payment_order_id=o.payment_order_id;
    update public.report_input_snapshots set expires_at=now()+interval '90 days' where order_id=o.payment_order_id and o.status<>'paid';
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
      where po.status='paid' and (s.expires_at is null or s.expires_at>now()) and x.attempt_count<3 and
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
      -- No successful publication may resurrect input already past its retention.
      perform 1 from public.report_input_snapshots where order_id=j.order_id and expires_at>now() for update;
      if not found then
        return jsonb_build_object('ok',false,'code','INPUT_EXPIRED');
      end if;
      v_publication:=coalesce(r.published_at,clock_timestamp());
      -- 90 absolute days, independent of the session's DST/timezone setting.
      update public.paid_report_snapshots set status=v_status,
        snapshot_json=jsonb_set(p_data->'snapshot','{createdAtIso}',to_jsonb(v_publication)),
        gate_version=p_data->>'gateVersion',published_at=v_publication,
        expires_at=coalesce(r.expires_at,v_publication+interval '2160 hours') where report_id=j.report_id;
      if r.published_at is null then
        -- Privacy SSOT explicitly gives input AND result 90 days from generation.
        update public.report_input_snapshots set expires_at=v_publication+interval '2160 hours' where order_id=j.order_id;
      end if;
    else
      v_status:=case when j.attempt_count>=3 then 'FAILED_REQUIRES_ATTENTION' else 'RETRYING' end;
      -- Retain the last published snapshot for investigation throughout recovery.
      -- New failed drafts are never stored here; only successful publication replaces it.
      update public.paid_report_snapshots set status=v_status where report_id=j.report_id;
    end if;
    -- Only allowlisted scalar metadata can enter the audit. Never persist raw JSON
    -- from a provider, prompts, headers, error messages or arbitrary caller keys.
    select coalesce(jsonb_agg(jsonb_build_object(
      'sequence',n,
      'model',case when e->>'model' ~ '^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,99}$' and e->>'model' not like 'sk-%' then e->>'model' else 'unknown' end,
      'inputTokens',case when jsonb_typeof(e->'inputTokens')='number' and e->>'inputTokens' ~ '^[0-9]{1,9}$' then e->'inputTokens' else 'null'::jsonb end,
      'outputTokens',case when jsonb_typeof(e->'outputTokens')='number' and e->>'outputTokens' ~ '^[0-9]{1,9}$' then e->'outputTokens' else 'null'::jsonb end,
      'totalTokens',case when jsonb_typeof(e->'totalTokens')='number' and e->>'totalTokens' ~ '^[0-9]{1,9}$' then e->'totalTokens' else 'null'::jsonb end,
      'durationMs',case when jsonb_typeof(e->'durationMs')='number' and e->>'durationMs' ~ '^[0-9]{1,9}$' then e->'durationMs' else 'null'::jsonb end,
      'outcome',case when e->>'outcome' in ('completed','timeout','rate_limit','config','quota','malformed','incomplete','validation','provider') then e->>'outcome' else 'provider' end
    ) order by n),'[]') into v_calls
      from jsonb_array_elements(case when jsonb_typeof(p_data->'externalCalls')='array' then p_data->'externalCalls' else '[]'::jsonb end)
        with ordinality as calls(e,n) where n<=2;
    update public.report_generation_attempts set finished_at=now(),duration_ms=(p_data->>'durationMs')::integer,
      external_calls=v_calls,failure_stage=p_data->>'stage',error_code=p_data->>'code',validation_errors=coalesce(p_data->'errors','[]')
      where job_id=j.job_id and run_number=j.run_number and attempt=j.attempt_count;
    update public.report_generation_jobs set status=v_status,lease_token=null,lease_until=null,last_error_code=p_data->>'code',
      next_retry_at=now()+case when j.attempt_count=1 then interval '30 seconds' else interval '2 minutes' end where job_id=j.job_id;
    return jsonb_build_object('ok',true,'status',v_status);
  elsif p_action = 'read_report' then
    select s.* into r from public.paid_report_snapshots s join public.payment_orders po on po.payment_order_id=s.order_id
      where s.report_id=p_data->>'reportId' and po.status='paid';
    if not found then return jsonb_build_object('ok',false,'code','REPORT_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'status',case when r.expires_at<=now() then 'EXPIRED' else r.status end,
      'publishedAt',r.published_at,'expiresAt',r.expires_at,'snapshot',case when r.status='COMPLETED' and r.expires_at>now() then r.snapshot_json else null end);
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
      where x.report_id=p_data->>'reportId' and x.status='FAILED_REQUIRES_ATTENTION' and (s.expires_at is null or s.expires_at>now()) and po.status='paid'
      and exists (select 1 from public.report_input_snapshots i where i.order_id=x.order_id and i.expires_at>now()) for update of x;
    if not found then return jsonb_build_object('ok',false,'code','NOT_RETRYABLE'); end if;
    update public.report_generation_jobs set status='QUEUED',attempt_count=0,run_number=run_number+1,next_retry_at=now(),last_error_code=null where job_id=j.job_id;
    update public.paid_report_snapshots set status='QUEUED' where report_id=j.report_id;
    return jsonb_build_object('ok',true);
  elsif p_action = 'attention' then
    return jsonb_build_object('ok',true,'jobs',coalesce((select jsonb_agg(to_jsonb(x)) from
      (select job_id,report_id,order_id,attempt_count,last_error_code,created_at from public.report_generation_jobs
       where status='FAILED_REQUIRES_ATTENTION' order by created_at limit 100) x),'[]'),
      'paymentRecovery',coalesce((select jsonb_agg(to_jsonb(x)) from
        (select payment_order_id,status,recovery_attempt_count,recovery_last_error_code,recovery_attention_at,updated_at
         from public.payment_orders where recovery_attention_at is not null order by recovery_attention_at limit 100) x),'[]'));
  elsif p_action = 'expire' then
    update public.report_generation_jobs x set status='EXPIRED',lease_token=null,lease_until=null from public.paid_report_snapshots s
      where x.report_id=s.report_id and s.expires_at<=now();
    update public.paid_report_snapshots set status='EXPIRED',snapshot_json=null where expires_at<=now();
    -- An unpublished report has no access deadline. If its provisional input
    -- retention ends, keep the financial/report identity in attention, not EXPIRED.
    with abandoned as (
      select x.job_id from public.report_generation_jobs x join public.paid_report_snapshots s using(report_id)
        where s.published_at is null
          and not exists (select 1 from public.report_input_snapshots i where i.order_id=x.order_id and i.expires_at>now())
        for update of x skip locked
    )
    update public.report_generation_jobs x set status='FAILED_REQUIRES_ATTENTION',
      lease_token=null,lease_until=null,last_error_code='INPUT_RETENTION_EXPIRED'
      from abandoned a where x.job_id=a.job_id;
    update public.paid_report_snapshots s set status='FAILED_REQUIRES_ATTENTION'
      from public.report_generation_jobs x where x.report_id=s.report_id and s.published_at is null
        and x.last_error_code='INPUT_RETENTION_EXPIRED';
    -- Match publication's input-before-attempt lock order. A concurrent publish
    -- locks/extends its input before committing, so DELETE rechecks the new deadline.
    delete from public.report_input_snapshots where expires_at<=now();
    update public.report_generation_attempts a set validation_errors='[]' from public.paid_report_snapshots s
      where a.report_id=s.report_id and (s.expires_at<=now() or (s.published_at is null
        and not exists (select 1 from public.report_input_snapshots i where i.order_id=s.order_id and i.expires_at>now())));
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
