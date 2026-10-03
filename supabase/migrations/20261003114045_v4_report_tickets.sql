-- Phase 10A: PREPARED ONLY. No Production apply or automatic grants.
-- Requires 9B, 9C and the existing first-publication/90-day expiry patch.
begin;
set local lock_timeout = '5s';
create table public.report_ticket_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  quantity integer not null check(quantity between 1 and 10000),
  source_type text not null check(source_type in ('purchase','promotion','referral','manual','welcome','refund_reversal')),
  source_ref text not null check(length(source_ref) between 1 and 200),
  idempotency_key text not null check(length(idempotency_key) between 1 and 200),
  reason text not null check(length(reason) between 1 and 200),
  product_scope text check(product_scope in ('saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune')),
  granted_at timestamptz not null default now(), expires_at timestamptz,
  unique(source_type,source_ref), unique(user_id,idempotency_key), unique(id,user_id)
);
create index report_ticket_grants_user_expiry on public.report_ticket_grants(user_id,expires_at,id);
create table public.report_ticket_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  grant_id uuid not null, foreign key(grant_id,user_id) references public.report_ticket_grants(id,user_id),
  request_id text not null check(length(request_id) between 16 and 100),
  origin_version text not null default 'ticket-fulfillment-v1' check(origin_version='ticket-fulfillment-v1'),
  consent_evidence jsonb,
  input_hash text not null check(input_hash ~ '^[a-f0-9]{64}$'),
  product_type text not null check(product_type in ('saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune')),
  report_id text not null unique,
  state text not null default 'RUNNING' check(state in ('RUNNING','COMPLETED','REVERSED')),
  lease_token uuid not null default gen_random_uuid(), lease_until timestamptz not null default now()+interval '10 minutes',
  input_json jsonb, display_name text not null default '' check(length(display_name)<=83), selected_year text check(selected_year ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now(), completed_at timestamptz, failure_code text,
  unique(user_id,request_id), unique(id,user_id), unique(id,report_id)
);
create index report_ticket_redemptions_user_state on public.report_ticket_redemptions(user_id,state,lease_until);
alter table public.paid_report_snapshots alter column order_id drop not null;
alter table public.paid_report_snapshots add column ticket_redemption_id uuid unique;
alter table public.paid_report_snapshots add constraint report_origin_exactly_one check(num_nonnulls(order_id,ticket_redemption_id)=1);
alter table public.paid_report_snapshots add constraint report_ticket_origin_fk foreign key(ticket_redemption_id,report_id) references public.report_ticket_redemptions(id,report_id);
alter table public.report_ticket_redemptions add constraint ticket_report_fk foreign key(report_id) references public.paid_report_snapshots(report_id) deferrable initially deferred;
alter table public.report_account_links drop constraint report_account_links_link_source_check;
alter table public.report_account_links add constraint report_account_links_link_source_check check(link_source in ('purchase','guest_claim','ticket'));
create table public.report_ticket_ledger (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
  grant_id uuid not null, foreign key(grant_id,user_id) references public.report_ticket_grants(id,user_id),
  event_type text not null check(event_type in ('GRANT','REDEEM','REVERSAL','EXPIRE')),
  quantity_delta integer not null,
  redemption_id uuid, foreign key(redemption_id,user_id) references public.report_ticket_redemptions(id,user_id),
  report_id text references public.paid_report_snapshots(report_id), product_type text,
  idempotency_key text not null unique, reason text not null, created_at timestamptz not null default now(),
  check((event_type='GRANT' and quantity_delta>0 and redemption_id is null) or
    (event_type='REDEEM' and quantity_delta=-1 and redemption_id is not null) or
    (event_type='REVERSAL' and quantity_delta=1 and redemption_id is not null) or
    (event_type='EXPIRE' and quantity_delta<0 and redemption_id is null))
);
create index report_ticket_ledger_user on public.report_ticket_ledger(user_id,created_at,id);
create index report_ticket_ledger_lot on public.report_ticket_ledger(grant_id);
create unique index report_ticket_once_per_use on public.report_ticket_ledger(redemption_id,event_type) where redemption_id is not null;
create unique index report_ticket_once_per_grant on public.report_ticket_ledger(grant_id) where event_type='GRANT';
alter table public.report_ticket_grants enable row level security;
alter table public.report_ticket_redemptions enable row level security;
alter table public.report_ticket_ledger enable row level security;
revoke all on public.report_ticket_grants,public.report_ticket_redemptions,public.report_ticket_ledger from public,anon,authenticated,service_role;
grant select,insert on public.report_ticket_grants,public.report_ticket_ledger to service_role;
grant select,insert,update on public.report_ticket_redemptions to service_role;
grant select(id) on auth.users to service_role;
grant select,insert,update on public.paid_report_snapshots to service_role;

create function public.ticket_immutable() returns trigger language plpgsql security invoker set search_path='' as $$
begin raise exception 'TICKET_AUDIT_IMMUTABLE'; end $$;
create trigger ticket_events_immutable before update or delete on public.report_ticket_ledger for each row execute function public.ticket_immutable();
create trigger ticket_grants_immutable before update or delete on public.report_ticket_grants for each row execute function public.ticket_immutable();

create function public.ticket_event_guard() returns trigger language plpgsql security invoker set search_path='' as $$
declare q integer; original integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,10));
  select quantity into original from public.report_ticket_grants where id=new.grant_id and user_id=new.user_id;
  select coalesce(sum(quantity_delta),0)::integer into q from public.report_ticket_ledger where grant_id=new.grant_id;
  if q+new.quantity_delta<0 or q+new.quantity_delta>original then raise exception 'TICKET_BALANCE_INVALID'; end if;
  if new.event_type='GRANT' and new.quantity_delta<>original then raise exception 'TICKET_GRANT_INVALID'; end if;
  if new.redemption_id is not null and not exists(select 1 from public.report_ticket_redemptions r where r.id=new.redemption_id
    and r.user_id=new.user_id and r.grant_id=new.grant_id and r.report_id=new.report_id and r.product_type=new.product_type) then raise exception 'TICKET_ORIGIN_INVALID'; end if;
  return new;
end $$;
create trigger ticket_event_validate before insert on public.report_ticket_ledger for each row execute function public.ticket_event_guard();
create function public.ticket_report_expired() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.ticket_redemption_id is not null and new.status='EXPIRED' then
    update public.report_ticket_redemptions set display_name='',input_json=null where id=new.ticket_redemption_id;
  end if;
  return new;
end $$;
create trigger ticket_report_retention after update on public.paid_report_snapshots for each row execute function public.ticket_report_expired();

-- One account lock orders ALL grant/expiry/redeem/publish/reversal transactions.
-- Never reverse from a client timeout. Durable state + the lease fences late publishers.
create function public.report_tickets(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare g public.report_ticket_grants%rowtype; r public.report_ticket_redemptions%rowtype;
  s public.paid_report_snapshots%rowtype; remaining integer; total integer; stamp timestamptz:=clock_timestamp();
  rid uuid; result jsonb; key text; snap jsonb;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  perform 1 from auth.users where id=p_user;
  if not found then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  stamp:=clock_timestamp(); -- expiry is evaluated AFTER any concurrent lock wait
  -- Recover crashed workers when the account is next read/used (also callable by
  -- an internal reconciler). No new grant, no reset of the original lot expiry.
  for r in select * from public.report_ticket_redemptions where user_id=p_user and state='RUNNING' and lease_until<=stamp for update loop
    select * into s from public.paid_report_snapshots where report_id=r.report_id for update;
    if s.published_at is null then
      insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,redemption_id,report_id,product_type,idempotency_key,reason)
        values(p_user,r.grant_id,'REVERSAL',1,r.id,r.report_id,r.product_type,'reverse:'||r.id,'LEASE_EXPIRED') on conflict do nothing;
      update public.report_ticket_redemptions set state='REVERSED',input_json=null,failure_code='LEASE_EXPIRED' where id=r.id;
      update public.paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION' where report_id=r.report_id;
    end if;
  end loop;
  for g in select * from public.report_ticket_grants where user_id=p_user and expires_at<=stamp loop
    select coalesce(sum(quantity_delta),0)::integer into remaining from public.report_ticket_ledger where grant_id=g.id;
    if remaining>0 then
      insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,idempotency_key,reason)
        values(p_user,g.id,'EXPIRE',-remaining,'expire:'||g.id||':'||gen_random_uuid(),'LOT_EXPIRED');
    end if;
  end loop;
  if p_action='grant' then
    select * into g from public.report_ticket_grants where user_id=p_user and
      ((source_type=p_data->>'sourceType' and source_ref=p_data->>'sourceRef') or idempotency_key=p_data->>'key');
    if found then
      return jsonb_build_object('ok',g.quantity=(p_data->>'quantity')::integer and g.source_type=p_data->>'sourceType' and g.source_ref=p_data->>'sourceRef'
        and g.expires_at is not distinct from (p_data->>'expiresAt')::timestamptz and g.product_scope is not distinct from p_data->>'productScope','grantId',g.id);
    end if;
    if (p_data->>'expiresAt')::timestamptz<=stamp then return jsonb_build_object('ok',false,'code','GRANT_ALREADY_EXPIRED'); end if;
    insert into public.report_ticket_grants(user_id,quantity,source_type,source_ref,idempotency_key,reason,expires_at,product_scope)
      values(p_user,(p_data->>'quantity')::integer,p_data->>'sourceType',p_data->>'sourceRef',p_data->>'key',p_data->>'reason',(p_data->>'expiresAt')::timestamptz,p_data->>'productScope') returning * into g;
    insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,idempotency_key,reason)
      values(p_user,g.id,'GRANT',g.quantity,'grant:'||g.id,g.reason);
    return jsonb_build_object('ok',true,'grantId',g.id);
  elsif p_action='redeem' then
    select * into r from public.report_ticket_redemptions where user_id=p_user and request_id=p_data->>'requestId';
    if found then
      if r.input_hash is distinct from p_data->>'inputHash' or r.product_type is distinct from p_data->>'productType' then return jsonb_build_object('ok',false,'code','REQUEST_CONFLICT'); end if;
      return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id,'redemptionId',r.id,'fresh',false);
    end if;
    select x.* into g from public.report_ticket_grants x where x.user_id=p_user and (x.expires_at is null or x.expires_at>stamp)
      and (x.product_scope is null or x.product_scope=p_data->>'productType')
      and (select coalesce(sum(l.quantity_delta),0) from public.report_ticket_ledger l where l.grant_id=x.id)>0
      order by x.expires_at asc nulls last,x.granted_at,x.id limit 1;
    if not found then return jsonb_build_object('ok',false,'code','NO_USABLE_TICKET'); end if;
    if jsonb_typeof(p_data->'input') is distinct from 'object' then return jsonb_build_object('ok',false,'code','INPUT_REQUIRED'); end if;
    insert into public.report_ticket_redemptions(user_id,grant_id,request_id,input_hash,product_type,report_id,input_json,display_name,selected_year,consent_evidence)
      values(p_user,g.id,p_data->>'requestId',p_data->>'inputHash',p_data->>'productType',p_data->>'reportId',p_data->'input',p_data->>'displayName',p_data->>'selectedYear',p_data->'consentEvidence') returning * into r;
    insert into public.paid_report_snapshots(report_id,ticket_redemption_id,product_type,status) values(r.report_id,r.id,r.product_type,'GENERATING');
    insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,redemption_id,report_id,product_type,idempotency_key,reason)
      values(p_user,g.id,'REDEEM',-1,r.id,r.report_id,r.product_type,'redeem:'||r.id,'REPORT_GENERATION');
    return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id,'redemptionId',r.id,'token',r.lease_token,'createdAt',r.created_at,'fresh',true);
  elsif p_action in ('publish','reverse','status') then
    select * into r from public.report_ticket_redemptions where user_id=p_user and id=(p_data->>'redemptionId')::uuid for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    select * into s from public.paid_report_snapshots where report_id=r.report_id for update;
    if p_action='status' then return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id); end if;
    if r.state<>'RUNNING' then return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id); end if;
    if r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp then return jsonb_build_object('ok',false,'code','STALE_LEASE'); end if;
    if p_action='publish' then
      snap:=p_data->'snapshot';
      if s.published_at is not null or s.ticket_redemption_id<>r.id or p_data->>'gateVersion' is distinct from 'paid-report-v1'
        or snap->>'reportId' is distinct from r.report_id or snap->>'productType' is distinct from r.product_type
        or jsonb_typeof(snap->'draft') is distinct from 'object' or jsonb_typeof(snap->'evidencePacket') is distinct from 'object'
        or nullif(snap->>'productVersion','') is null then return jsonb_build_object('ok',false,'code','PUBLISH_REJECTED'); end if;
      -- Existing paid_report_snapshots_access_expiry_check is the 90-day SSOT.
      update public.paid_report_snapshots set status='COMPLETED',snapshot_json=jsonb_set(snap,'{createdAtIso}',to_jsonb(stamp)),
        gate_version=p_data->>'gateVersion',published_at=stamp,expires_at=stamp+interval '2160 hours' where report_id=r.report_id;
      insert into public.report_account_links(report_id,user_id,link_source,report_version) values(r.report_id,p_user,'ticket',snap->>'productVersion');
      update public.report_ticket_redemptions set state='COMPLETED',completed_at=stamp,input_json=null where id=r.id;
      return jsonb_build_object('ok',true,'state','COMPLETED','reportId',r.report_id);
    end if;
    -- A completed publication can never be refunded by timeout/deletion/expiry.
    if s.published_at is not null then return jsonb_build_object('ok',false,'code','ALREADY_PUBLISHED'); end if;
    insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,redemption_id,report_id,product_type,idempotency_key,reason)
      values(p_user,r.grant_id,'REVERSAL',1,r.id,r.report_id,r.product_type,'reverse:'||r.id,left(coalesce(p_data->>'reason','GENERATION_FAILED'),100));
    update public.report_ticket_redemptions set state='REVERSED',input_json=null,failure_code=left(p_data->>'reason',100) where id=r.id;
    update public.paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION' where report_id=r.report_id;
    -- Reverse into the original lot, then expire it if its explicit deadline passed.
    perform public.report_tickets('reconcile',p_user,'{}');
    return jsonb_build_object('ok',true,'state','REVERSED','reportId',r.report_id);
  elsif p_action='read' then
    select s0.* into s from public.paid_report_snapshots s0 join public.report_ticket_redemptions r0 on r0.id=s0.ticket_redemption_id
      join public.report_account_links l on l.report_id=s0.report_id
      where r0.user_id=p_user and l.user_id=p_user and l.revoked_at is null and r0.state='COMPLETED' and s0.report_id=p_data->>'reportId';
    if not found then return jsonb_build_object('ok',false,'code','REPORT_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'status',case when s.expires_at<=stamp then 'EXPIRED' else s.status end,
      'snapshot',case when s.expires_at>stamp and s.status='COMPLETED' then s.snapshot_json else null end);
  elsif p_action='library' then
    select coalesce(jsonb_agg(jsonb_build_object('reportId',s0.report_id,'productType',r0.product_type,'reportVersion',l.report_version,
      'displayName',case when s0.expires_at>stamp and s0.status='COMPLETED' then r0.display_name else '' end,'selectedYear',r0.selected_year,
      'publishedAt',s0.published_at,'expiresAt',s0.expires_at,'status',case when s0.expires_at<=stamp then 'expired'
        when l.revoked_at is not null or s0.status<>'COMPLETED' then 'unavailable' else 'available' end) order by s0.published_at desc),'[]') into result
      from public.report_ticket_redemptions r0 join public.paid_report_snapshots s0 on s0.ticket_redemption_id=r0.id
      join public.report_account_links l on l.report_id=s0.report_id where r0.user_id=p_user and l.user_id=p_user and r0.state='COMPLETED';
    return jsonb_build_object('ok',true,'items',result);
  elsif p_action not in ('summary','history','reconcile') then return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
  end if;
  -- Privacy cleanup reuses the stored report expiry, never the ticket lot expiry.
  update public.report_ticket_redemptions r0 set display_name='' from public.paid_report_snapshots s0
    where s0.ticket_redemption_id=r0.id and r0.user_id=p_user and s0.expires_at<=stamp;
  select coalesce(sum(l.quantity_delta),0)::integer into total from public.report_ticket_ledger l join public.report_ticket_grants g0 on g0.id=l.grant_id
    where l.user_id=p_user and (g0.expires_at is null or g0.expires_at>stamp);
  if p_action='history' then
    select coalesce(jsonb_agg(jsonb_build_object('event',event_type,'quantity',quantity_delta,'at',created_at,'reason',reason,'reportId',report_id,'productType',product_type) order by created_at,id),'[]') into result
      from public.report_ticket_ledger where user_id=p_user;
  end if;
  return jsonb_build_object('ok',true,'quantity',total,'history',result);
end $$;
revoke all on function public.ticket_immutable(),public.ticket_event_guard(),public.ticket_report_expired(),public.report_tickets(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.ticket_immutable(),public.ticket_event_guard(),public.ticket_report_expired(),public.report_tickets(text,uuid,jsonb) to service_role;
comment on table public.report_ticket_ledger is 'Append-only ticket events. No financial payment, profile balance, automatic grants or Production activation.';
commit;
