-- Production reconciliation for a database whose migration history is empty
-- but whose public.payment_orders and public.reports tables already contain data.
--
-- This migration is intentionally forward-only and non-destructive:
-- - it never removes, renames, rewrites, or backfills an existing customer row;
-- - it refuses ambiguous base schemas and duplicate idempotency keys;
-- - it does not recreate legacy reports or payment_orders;
-- - it does not modify supabase_migrations.schema_migrations.

begin;

set local lock_timeout = '5s';
set local statement_timeout = '60s';

do $reconcile_prerequisites$
declare
  v_mismatches text;
begin
  if to_regclass('public.payment_orders') is null then
    raise exception 'RECONCILE_BLOCKED: public.payment_orders is missing';
  end if;

  if to_regclass('public.reports') is null then
    raise exception 'RECONCILE_BLOCKED: public.reports is missing';
  end if;

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
  select string_agg(format('%s.%s expected %s nullable=%s, found %s nullable=%s',
      e.table_name, e.column_name, e.udt_name, e.is_nullable,
      coalesce(c.udt_name, '<missing>'), coalesce(c.is_nullable, '<missing>')), '; ' order by e.table_name, e.column_name)
  into v_mismatches
  from expected e
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = e.table_name
   and c.column_name = e.column_name
  where c.column_name is null
     or c.udt_name <> e.udt_name
     or c.is_nullable <> e.is_nullable;

  if v_mismatches is not null then
    raise exception 'RECONCILE_BLOCKED: incompatible base columns: %', v_mismatches;
  end if;

  if exists (
    select 1 from public.payment_orders
    group by payment_order_id having count(*) > 1
  ) then
    raise exception 'RECONCILE_BLOCKED: duplicate payment_order_id values';
  end if;

  if exists (
    select 1 from public.payment_orders
    where provider_payment_id is not null
    group by provider_payment_id having count(*) > 1
  ) then
    raise exception 'RECONCILE_BLOCKED: duplicate provider_payment_id values';
  end if;

  if exists (
    select 1 from public.payment_orders
    where provider_order_id is not null
    group by provider_order_id having count(*) > 1
  ) then
    raise exception 'RECONCILE_BLOCKED: duplicate provider_order_id values';
  end if;

  if exists (
    select 1 from public.payment_orders
    where product_type not in (
      'saju_mbti_full','saju_basic','saju_full','daewoon','saewoon','compatibility',
      'career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'
    )
  ) then
    raise exception 'RECONCILE_BLOCKED: unknown existing payment product_type';
  end if;

  if exists (select 1 from public.payment_orders where provider not in ('toss','kakao_pay')) then
    raise exception 'RECONCILE_BLOCKED: unknown existing payment provider';
  end if;

  if exists (select 1 from public.payment_orders where amount <= 0 or currency <> 'KRW') then
    raise exception 'RECONCILE_BLOCKED: invalid existing payment amount or currency';
  end if;

  if exists (
    select 1 from public.payment_orders
    where status not in ('ready','paid','failed','canceled','refunded')
  ) then
    raise exception 'RECONCILE_BLOCKED: unknown existing payment status';
  end if;

  -- A CHECK cannot be widened in PostgreSQL without replacing it. This task
  -- forbids removing constraints, so an older restrictive product CHECK must
  -- be reviewed separately instead of being changed implicitly.
  if exists (
    select 1
    from pg_constraint con
    join pg_attribute att
      on att.attrelid = con.conrelid
     and att.attname = 'product_type'
     and att.attnum = any(con.conkey)
    where con.conrelid = 'public.payment_orders'::regclass
      and con.contype = 'c'
      and not (
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
        and pg_get_constraintdef(con.oid) like '%''annual_fortune''%'
      )
  ) then
    raise exception 'RECONCILE_BLOCKED: existing product_type CHECK is narrower than the current paid catalog';
  end if;
end
$reconcile_prerequisites$;

alter table public.payment_orders
  add column if not exists confirm_lease_until timestamptz;
alter table public.payment_orders
  add column if not exists confirm_token uuid;

do $payment_order_identity$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_attribute a
      on a.attrelid = i.indrelid
     and a.attnum = any(i.indkey)
    where i.indrelid = 'public.payment_orders'::regclass
      and i.indisunique
      and i.indisvalid
      and i.indpred is null
      and i.indnkeyatts = 1
      and a.attname = 'payment_order_id'
  ) then
    execute 'create unique index payment_orders_payment_order_id_reliability_uidx on public.payment_orders(payment_order_id)';
  end if;
end
$payment_order_identity$;

create unique index if not exists payment_orders_provider_payment_id_unique_idx
  on public.payment_orders(provider_payment_id)
  where provider_payment_id is not null;
create unique index if not exists payment_orders_provider_order_id_unique_idx
  on public.payment_orders(provider_order_id)
  where provider_order_id is not null;
create index if not exists payment_orders_status_idx on public.payment_orders(status);
create index if not exists payment_orders_provider_idx on public.payment_orders(provider);
create index if not exists payment_orders_product_type_idx on public.payment_orders(product_type);
create index if not exists payment_orders_created_at_idx on public.payment_orders(created_at);
create index if not exists payment_orders_report_id_idx on public.payment_orders(report_id);

do $payment_product_check$
begin
  if not exists (
    select 1
    from pg_constraint con
    join pg_attribute att
      on att.attrelid = con.conrelid
     and att.attname = 'product_type'
     and att.attnum = any(con.conkey)
    where con.conrelid = 'public.payment_orders'::regclass
      and con.contype = 'c'
  ) then
    alter table public.payment_orders
      add constraint payment_orders_product_type_reliability_check
      check (product_type in (
        'saju_mbti_full','saju_basic','saju_full','daewoon','saewoon','compatibility',
        'career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'
      )) not valid;
    alter table public.payment_orders
      validate constraint payment_orders_product_type_reliability_check;
  end if;
end
$payment_product_check$;

alter table public.payment_orders enable row level security;
revoke all on table public.payment_orders from public, anon, authenticated;

create table if not exists public.report_input_snapshots (
  order_id text primary key references public.payment_orders(payment_order_id),
  payload_json jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);

create table if not exists public.paid_report_snapshots (
  report_id text primary key,
  order_id text not null unique references public.payment_orders(payment_order_id),
  product_type text not null,
  status text not null default 'QUEUED'
    check (status in ('QUEUED','GENERATING','RETRYING','COMPLETED','FAILED_REQUIRES_ATTENTION','EXPIRED')),
  snapshot_json jsonb,
  gate_version text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days',
  published_at timestamptz,
  check (
    (status = 'COMPLETED' and snapshot_json is not null and gate_version = 'paid-report-v1')
    or (status <> 'COMPLETED' and snapshot_json is null)
  )
);

create table if not exists public.report_generation_jobs (
  job_id uuid primary key default gen_random_uuid(),
  order_id text not null unique references public.payment_orders(payment_order_id),
  report_id text not null unique references public.paid_report_snapshots(report_id),
  status text not null default 'QUEUED'
    check (status in ('QUEUED','RUNNING','RETRYING','COMPLETED','FAILED_REQUIRES_ATTENTION','EXPIRED')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 3),
  run_number integer not null default 1,
  lease_token uuid,
  lease_until timestamptz,
  next_retry_at timestamptz not null default now(),
  last_error_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.report_generation_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.report_generation_jobs(job_id),
  report_id text not null references public.paid_report_snapshots(report_id),
  run_number integer not null,
  attempt integer not null,
  strategy text not null,
  writer_model text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  failure_stage text,
  error_code text,
  validation_errors jsonb not null default '[]',
  unique(job_id, run_number, attempt)
);

create index if not exists report_input_snapshots_expires_at_idx
  on public.report_input_snapshots(expires_at);
create index if not exists paid_report_snapshots_expires_at_idx
  on public.paid_report_snapshots(expires_at);
create index if not exists report_generation_jobs_due
  on public.report_generation_jobs(next_retry_at)
  where status in ('QUEUED','RETRYING','RUNNING');
create index if not exists report_generation_attempts_report_id_idx
  on public.report_generation_attempts(report_id);

alter table public.report_input_snapshots enable row level security;
alter table public.paid_report_snapshots enable row level security;
alter table public.report_generation_jobs enable row level security;
alter table public.report_generation_attempts enable row level security;

revoke all on table public.report_input_snapshots from public, anon, authenticated;
revoke all on table public.paid_report_snapshots from public, anon, authenticated;
revoke all on table public.report_generation_jobs from public, anon, authenticated;
revoke all on table public.report_generation_attempts from public, anon, authenticated;

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
      update public.paid_report_snapshots set status=v_status,snapshot_json=null where report_id=j.report_id;
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
    update public.paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION',snapshot_json=null where report_id=p_data->>'reportId' and status='COMPLETED';
    update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',last_error_code='READ_GATE_REJECTED' where report_id=p_data->>'reportId' and status='COMPLETED';
    return jsonb_build_object('ok',true);
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

do $retire_legacy_paid_rpcs$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname in (
        'create_ready_payment_order','mark_toss_payment_order_paid','fulfill_paid_saju_mbti_report',
        'save_comprehensive_report_draft_snapshot','get_generated_comprehensive_report_result',
        'get_paid_saju_mbti_report_result','find_paid_report_by_access_token_hash'
      )
  loop
    execute format('revoke all on function %s from public, anon, authenticated',f.signature);
  end loop;
end
$retire_legacy_paid_rpcs$;

do $reconcile_postconditions$
declare
  v_missing text;
begin
  with expected(table_name,column_name,udt_name) as (
    values
      ('payment_orders','confirm_lease_until','timestamptz'),
      ('payment_orders','confirm_token','uuid'),
      ('report_input_snapshots','order_id','text'),
      ('report_input_snapshots','payload_json','jsonb'),
      ('report_input_snapshots','created_at','timestamptz'),
      ('report_input_snapshots','expires_at','timestamptz'),
      ('paid_report_snapshots','report_id','text'),
      ('paid_report_snapshots','order_id','text'),
      ('paid_report_snapshots','product_type','text'),
      ('paid_report_snapshots','status','text'),
      ('paid_report_snapshots','snapshot_json','jsonb'),
      ('paid_report_snapshots','gate_version','text'),
      ('paid_report_snapshots','created_at','timestamptz'),
      ('paid_report_snapshots','expires_at','timestamptz'),
      ('paid_report_snapshots','published_at','timestamptz'),
      ('report_generation_jobs','job_id','uuid'),
      ('report_generation_jobs','order_id','text'),
      ('report_generation_jobs','report_id','text'),
      ('report_generation_jobs','status','text'),
      ('report_generation_jobs','attempt_count','int4'),
      ('report_generation_jobs','run_number','int4'),
      ('report_generation_jobs','lease_token','uuid'),
      ('report_generation_jobs','lease_until','timestamptz'),
      ('report_generation_jobs','next_retry_at','timestamptz'),
      ('report_generation_jobs','last_error_code','text'),
      ('report_generation_jobs','created_at','timestamptz'),
      ('report_generation_attempts','attempt_id','uuid'),
      ('report_generation_attempts','job_id','uuid'),
      ('report_generation_attempts','report_id','text'),
      ('report_generation_attempts','run_number','int4'),
      ('report_generation_attempts','attempt','int4'),
      ('report_generation_attempts','strategy','text'),
      ('report_generation_attempts','writer_model','text'),
      ('report_generation_attempts','started_at','timestamptz'),
      ('report_generation_attempts','finished_at','timestamptz'),
      ('report_generation_attempts','duration_ms','int4'),
      ('report_generation_attempts','failure_stage','text'),
      ('report_generation_attempts','error_code','text'),
      ('report_generation_attempts','validation_errors','jsonb')
  )
  select string_agg(e.table_name||'.'||e.column_name,', ' order by e.table_name,e.column_name)
  into v_missing
  from expected e
  left join information_schema.columns c
    on c.table_schema='public' and c.table_name=e.table_name and c.column_name=e.column_name
  where c.column_name is null or c.udt_name<>e.udt_name;

  if v_missing is not null then
    raise exception 'RECONCILE_INCOMPLETE: missing or incompatible target columns: %',v_missing;
  end if;

  if exists (
    select 1
    from (values
      ('payment_orders'),('report_input_snapshots'),('paid_report_snapshots'),
      ('report_generation_jobs'),('report_generation_attempts')
    ) v(name)
    left join pg_class c on c.oid=to_regclass('public.'||v.name)
    where c.oid is null or not c.relrowsecurity
  ) then
    raise exception 'RECONCILE_INCOMPLETE: paid storage table missing or RLS disabled';
  end if;

  if not exists (
    select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
    where i.indrelid='public.payment_orders'::regclass and i.indisunique and i.indisvalid
      and i.indpred is null and i.indnkeyatts=1 and a.attname='payment_order_id'
  ) or not exists (
    select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
    where i.indrelid='public.payment_orders'::regclass and i.indisunique and i.indisvalid
      and i.indnkeyatts=1 and a.attname='provider_payment_id'
  ) or not exists (
    select 1 from pg_index i join pg_attribute a on a.attrelid=i.indrelid and a.attnum=any(i.indkey)
    where i.indrelid='public.payment_orders'::regclass and i.indisunique and i.indisvalid
      and i.indnkeyatts=1 and a.attname='provider_order_id'
  ) then
    raise exception 'RECONCILE_INCOMPLETE: payment idempotency index missing';
  end if;

  if (
    select count(*)
    from pg_constraint con
    where con.contype='f'
      and con.conrelid in (
        'public.report_input_snapshots'::regclass,'public.paid_report_snapshots'::regclass,
        'public.report_generation_jobs'::regclass,'public.report_generation_attempts'::regclass
      )
  ) <> 6 then
    raise exception 'RECONCILE_INCOMPLETE: reliability foreign keys do not match target';
  end if;

  if not exists (
    select 1 from pg_constraint con
    where con.conrelid='public.paid_report_snapshots'::regclass and con.contype='c'
      and pg_get_constraintdef(con.oid) like '%COMPLETED%'
      and pg_get_constraintdef(con.oid) like '%snapshot_json IS NOT NULL%'
      and pg_get_constraintdef(con.oid) like '%paid-report-v1%'
  ) then
    raise exception 'RECONCILE_INCOMPLETE: publish invariant missing';
  end if;

  if to_regclass('public.report_input_snapshots_expires_at_idx') is null
    or to_regclass('public.paid_report_snapshots_expires_at_idx') is null
    or to_regclass('public.report_generation_jobs_due') is null
    or to_regclass('public.report_generation_attempts_report_id_idx') is null then
    raise exception 'RECONCILE_INCOMPLETE: reliability index missing';
  end if;

  if not coalesce(has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE'),false)
    or coalesce(has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE'),false)
    or coalesce(has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE'),false) then
    raise exception 'RECONCILE_INCOMPLETE: reliability RPC privilege mismatch';
  end if;

  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname in (
        'create_ready_payment_order','mark_toss_payment_order_paid','fulfill_paid_saju_mbti_report',
        'save_comprehensive_report_draft_snapshot','get_generated_comprehensive_report_result',
        'get_paid_saju_mbti_report_result','find_paid_report_by_access_token_hash'
      )
      and (has_function_privilege('anon',p.oid,'EXECUTE') or has_function_privilege('authenticated',p.oid,'EXECUTE'))
  ) then
    raise exception 'RECONCILE_INCOMPLETE: legacy paid RPC remains public';
  end if;

  if exists (
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public'
      and c.relname in (
        'payment_orders','report_input_snapshots','paid_report_snapshots',
        'report_generation_jobs','report_generation_attempts'
      )
      and (
        has_table_privilege('anon',c.oid,'SELECT') or has_table_privilege('anon',c.oid,'INSERT')
        or has_table_privilege('anon',c.oid,'UPDATE') or has_table_privilege('anon',c.oid,'DELETE')
        or has_table_privilege('authenticated',c.oid,'SELECT') or has_table_privilege('authenticated',c.oid,'INSERT')
        or has_table_privilege('authenticated',c.oid,'UPDATE') or has_table_privilege('authenticated',c.oid,'DELETE')
      )
  ) then
    raise exception 'RECONCILE_INCOMPLETE: paid table remains public';
  end if;
end
$reconcile_postconditions$;

commit;
