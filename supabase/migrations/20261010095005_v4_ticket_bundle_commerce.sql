-- PREPARED ONLY: after account/library/tickets/coupon/referral/campaign migrations
-- and paid_worker_expiry_cost_guard_patch.sql. No Production application here.
begin;
set local lock_timeout = '5s';

-- Narrow function-body patch; retain current worker, expiry, consent and ACLs.
-- Never update an existing order amount. The server catalog prices new orders.
do $price$
declare body text;
begin
  body := pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
  if position('o.amount<>1290' in body)=0 or position('published_at' in body)=0 then
    raise exception 'REVIEW_PRICE_PATCH_BASE';
  end if;
  execute replace(body,'o.amount<>1290','o.amount not in (1290,1490)');
end $price$;

create table public.ticket_bundle_orders (
  id text primary key default 'bundle_'||replace(gen_random_uuid()::text,'-',''),
  user_id uuid not null references auth.users(id) on delete restrict,
  request_id text not null check(request_id ~ '^[a-zA-Z0-9_-]{16,100}$'),
  bundle_id text not null check(bundle_id in ('SINGLE_1','PACK_3','PACK_5','PACK_10')),
  quantity integer not null check(quantity in (1,3,5,10)),
  amount integer not null check(amount>=100), currency text not null check(currency='KRW'),
  provider text not null default 'toss' check(provider='toss'),
  provider_order_id text not null unique default 'bundle_toss_'||replace(gen_random_uuid()::text,'-',''),
  provider_payment_id text unique check(length(provider_payment_id) between 1 and 200),
  status text not null default 'READY' check(status in ('READY','CONFIRMING','PAID_PENDING_GRANT','GRANTED','REFUND_PENDING','REFUNDED','FAILED')),
  consent_evidence jsonb not null check(jsonb_typeof(consent_evidence)='object'),
  requested_at timestamptz not null default now(), paid_at timestamptz, granted_at timestamptz, refunded_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  grant_id uuid unique, foreign key(grant_id,user_id) references public.report_ticket_grants(id,user_id),
  confirm_token uuid, confirm_lease_until timestamptz, failure_code text,
  refund_state text not null default 'NONE' check(refund_state in ('NONE','REVIEW_REQUIRED','PROVIDER_CANCELED','VERIFIED_REFUNDED')),
  refund_request_id text, refund_requested_at timestamptz, provider_cancel_ref text,
  unique(user_id,request_id),
  check((bundle_id='SINGLE_1' and quantity=1) or (bundle_id='PACK_3' and quantity=3) or (bundle_id='PACK_5' and quantity=5) or (bundle_id='PACK_10' and quantity=10)),
  check(status not in ('PAID_PENDING_GRANT','GRANTED','REFUNDED') or paid_at is not null),
  check(status<>'GRANTED' or (grant_id is not null and granted_at is not null)),
  check(status<>'FAILED' or paid_at is null),
  check(status<>'REFUNDED' or (refunded_at is not null and provider_cancel_ref is not null and refund_state='VERIFIED_REFUNDED'))
);
create index ticket_bundle_orders_history on public.ticket_bundle_orders(user_id,created_at desc,id);
create index ticket_bundle_orders_recovery on public.ticket_bundle_orders(updated_at) where status in ('CONFIRMING','PAID_PENDING_GRANT');
alter table public.ticket_bundle_orders enable row level security;
revoke all on public.ticket_bundle_orders from public,anon,authenticated,service_role;
grant select,insert,update on public.ticket_bundle_orders to service_role;

create function public.ticket_bundle_order_guard() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if row(new.id,new.user_id,new.request_id,new.bundle_id,new.quantity,new.amount,new.currency,new.provider,new.provider_order_id,new.consent_evidence,new.requested_at,new.created_at)
    is distinct from row(old.id,old.user_id,old.request_id,old.bundle_id,old.quantity,old.amount,old.currency,old.provider,old.provider_order_id,old.consent_evidence,old.requested_at,old.created_at)
    or (old.provider_payment_id is not null and new.provider_payment_id is distinct from old.provider_payment_id)
    or (old.paid_at is not null and new.paid_at is distinct from old.paid_at)
    or (old.grant_id is not null and new.grant_id is distinct from old.grant_id) then
    raise exception 'BUNDLE_ORDER_FACT_IMMUTABLE';
  end if;
  if new.status<>old.status and not (
    (old.status='READY' and new.status='CONFIRMING') or
    (old.status='CONFIRMING' and new.status in ('PAID_PENDING_GRANT','FAILED','REFUND_PENDING')) or
    (old.status='PAID_PENDING_GRANT' and new.status in ('GRANTED','REFUND_PENDING')) or
    (old.status='GRANTED' and new.status='REFUND_PENDING') or
    (old.status='REFUND_PENDING' and new.status='REFUNDED')
  ) then raise exception 'BUNDLE_ORDER_STATE_INVALID'; end if;
  return new;
end $$;
create trigger ticket_bundle_order_guard before update on public.ticket_bundle_orders for each row execute function public.ticket_bundle_order_guard();

-- Cross-domain provider identity: one key cannot fund a direct order AND a bundle.
-- Existing same-domain unique indexes remain authoritative.
create function public.ticket_bundle_payment_identity() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.provider_payment_id is null then return new; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.provider_payment_id,47));
  if tg_table_name='ticket_bundle_orders' then
    if exists(select 1 from public.payment_orders where provider='toss' and provider_payment_id=new.provider_payment_id) then raise unique_violation; end if;
  else
    if new.provider='toss' and exists(select 1 from public.ticket_bundle_orders where provider_payment_id=new.provider_payment_id) then raise unique_violation; end if;
  end if;
  return new;
end $$;
create trigger ticket_bundle_payment_identity before insert or update of provider_payment_id on public.ticket_bundle_orders for each row execute function public.ticket_bundle_payment_identity();
create trigger direct_bundle_payment_identity before insert or update of provider_payment_id on public.payment_orders for each row execute function public.ticket_bundle_payment_identity();

-- A refund hold freezes only its original lot, under the existing account lock.
-- FEFO is unchanged. A racing redemption either commits before the hold (and is
-- included in the review) or rolls back in full; no arbitrary balance subtraction.
create function public.ticket_bundle_refund_hold() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if new.event_type='REDEEM' then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,10));
    if exists(select 1 from public.ticket_bundle_orders where grant_id=new.grant_id and status in ('REFUND_PENDING','REFUNDED')) then
      raise exception 'TICKET_LOT_REFUND_HOLD';
    end if;
  end if;
  return new;
end $$;
create trigger ticket_bundle_refund_hold before insert on public.report_ticket_ledger for each row execute function public.ticket_bundle_refund_hold();

create function public.ticket_bundle_view(o public.ticket_bundle_orders) returns jsonb
language sql immutable security invoker set search_path='' as $$
  select jsonb_build_object('orderId',o.id,'bundleId',o.bundle_id,'quantity',o.quantity,'amount',o.amount,'currency',o.currency,
    'provider',o.provider,'providerOrderId',o.provider_order_id,'status',o.status,'requestedAt',o.requested_at,
    'paidAt',o.paid_at,'grantedAt',o.granted_at,'refundedAt',o.refunded_at,'grantId',o.grant_id,'refundState',o.refund_state)
$$;

create function public.ticket_bundle_commerce(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.ticket_bundle_orders%rowtype; result jsonb; stamp timestamptz; t uuid;
  remaining integer; consumed integer; running integer; key text; recovering boolean;
begin
  -- Same lock order as all existing ticket operations: account before order/lot.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  if not exists(select 1 from auth.users where id=p_user) then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  stamp:=clock_timestamp();
  if p_action='prepare' then
    if jsonb_typeof(p_data->'consent') is distinct from 'object' or not exists(select 1 from public.account_profiles where user_id=p_user) then
      return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED');
    end if;
    -- Versions come from current server policy; no browser assertion or user metadata.
    for key in select unnest(array['terms','privacy']) loop
      if not exists(select 1 from (select * from public.account_consent_events where user_id=p_user and consent_type=key order by id desc limit 1) c
        where c.is_agreed and c.required and c.document_version=p_data->'consent'->>key) then
        return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED');
      end if;
    end loop;
    select * into o from public.ticket_bundle_orders where user_id=p_user and request_id=p_data->>'requestId';
    if found then
      if o.bundle_id is distinct from p_data->>'bundleId' then return jsonb_build_object('ok',false,'code','REQUEST_CONFLICT'); end if;
      return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o));
    end if;
    insert into public.ticket_bundle_orders(user_id,request_id,bundle_id,quantity,amount,currency,consent_evidence)
      values(p_user,p_data->>'requestId',p_data->>'bundleId',(p_data->>'quantity')::integer,(p_data->>'amount')::integer,p_data->>'currency',p_data->'consent') returning * into o;
    return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o));
  elsif p_action='history' then
    select coalesce(jsonb_agg(public.ticket_bundle_view(x) order by x.created_at desc,x.id),'[]') into result
      from public.ticket_bundle_orders x where user_id=p_user;
    return jsonb_build_object('ok',true,'orders',result);
  end if;
  select * into o from public.ticket_bundle_orders where user_id=p_user and (id=p_data->>'orderId' or provider_order_id=p_data->>'orderId') for update;
  if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
  if p_action='read' then return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o)); end if;
  if p_action in ('claim','recover') then
    key:=case when p_action='recover' then o.provider_payment_id else p_data->>'paymentKey' end;
    if key is null or length(key) not between 1 and 200 or (p_action='claim' and o.amount is distinct from (p_data->>'amount')::integer)
      or (o.provider_payment_id is not null and o.provider_payment_id<>key) then return jsonb_build_object('ok',false,'code','PAYMENT_MISMATCH'); end if;
    if o.status='GRANTED' then return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o)); end if;
    if o.status not in ('READY','CONFIRMING','PAID_PENDING_GRANT') then return jsonb_build_object('ok',false,'code','INVALID_STATE'); end if;
    if o.status='PAID_PENDING_GRANT' then return jsonb_build_object('ok',true,'alreadyPaid',true,'order',public.ticket_bundle_view(o)); end if;
    if o.confirm_lease_until>stamp then return jsonb_build_object('ok',true,'pending',true,'order',public.ticket_bundle_view(o)); end if;
    recovering:=o.provider_payment_id is not null;
    t:=gen_random_uuid();
    update public.ticket_bundle_orders set provider_payment_id=key,status='CONFIRMING',confirm_token=t,confirm_lease_until=stamp+interval '2 minutes',updated_at=stamp where id=o.id returning * into o;
    return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o),'token',t,'recovery',recovering,'paymentKey',key);
  elsif p_action='approved' then
    if o.provider_payment_id is distinct from p_data->>'paymentKey' or o.provider is distinct from p_data->>'provider'
      or o.provider_order_id is distinct from p_data->>'providerOrderId' or o.amount is distinct from (p_data->>'amount')::integer
      or o.currency is distinct from p_data->>'currency' or p_data->>'status' is distinct from 'DONE' or nullif(p_data->>'paidAt','') is null then
      return jsonb_build_object('ok',false,'code','PROVIDER_MISMATCH');
    end if;
    if o.status in ('PAID_PENDING_GRANT','GRANTED') then return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o)); end if;
    if o.status<>'CONFIRMING' or o.confirm_token is distinct from (p_data->>'token')::uuid or o.confirm_lease_until<=stamp then return jsonb_build_object('ok',false,'code','STALE_CONFIRM'); end if;
    update public.ticket_bundle_orders set status='PAID_PENDING_GRANT',paid_at=(p_data->>'paidAt')::timestamptz,confirm_token=null,confirm_lease_until=null,updated_at=stamp where id=o.id returning * into o;
  elsif p_action='grant' then
    if o.status='GRANTED' then return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o)); end if;
    if o.status<>'PAID_PENDING_GRANT' or o.paid_at is null then return jsonb_build_object('ok',false,'code','NOT_PAID'); end if;
    result:=public.report_tickets('grant',p_user,jsonb_build_object('quantity',o.quantity,'sourceType','purchase','sourceRef',o.id,'key','bundle:'||o.id,'reason','PAID_BUNDLE_'||o.bundle_id));
    if result->>'ok' is distinct from 'true' then return jsonb_build_object('ok',false,'code','GRANT_CONFLICT'); end if;
    update public.ticket_bundle_orders set status='GRANTED',grant_id=(result->>'grantId')::uuid,granted_at=stamp,updated_at=stamp where id=o.id returning * into o;
  elsif p_action='terminal' then
    if o.status<>'CONFIRMING' or o.confirm_token is distinct from (p_data->>'token')::uuid or o.confirm_lease_until<=stamp
      or p_data->>'status' not in ('CANCELED','PARTIAL_CANCELED','ABORTED','EXPIRED') then return jsonb_build_object('ok',false,'code','INVALID_STATE'); end if;
    update public.ticket_bundle_orders set status=case when p_data->>'status' like '%CANCELED' then 'REFUND_PENDING' else 'FAILED' end,
      refund_state=case when p_data->>'status' like '%CANCELED' then 'PROVIDER_CANCELED' else 'NONE' end,
      failure_code=p_data->>'status',confirm_token=null,confirm_lease_until=null,updated_at=stamp where id=o.id returning * into o;
  elsif p_action in ('refund_review','refund_hold') then
    select coalesce(sum(quantity_delta),0)::integer into remaining from public.report_ticket_ledger where grant_id=o.grant_id;
    select count(*) filter(where state='COMPLETED'),count(*) filter(where state='RUNNING') into consumed,running from public.report_ticket_redemptions where grant_id=o.grant_id;
    if p_action='refund_hold' then
      if o.status not in ('GRANTED','REFUND_PENDING') or coalesce(p_data->>'requestId','') !~ '^[a-zA-Z0-9_-]{16,100}$' then return jsonb_build_object('ok',false,'code','INVALID_STATE'); end if;
      update public.ticket_bundle_orders set status='REFUND_PENDING',refund_state='REVIEW_REQUIRED',refund_request_id=coalesce(refund_request_id,p_data->>'requestId'),refund_requested_at=coalesce(refund_requested_at,stamp),updated_at=stamp where id=o.id returning * into o;
    end if;
    -- No financial amount allocation, cancellation API or refund-finalize action.
    return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o),'remaining',remaining,'consumed',consumed,'running',running);
  else return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
  end if;
  return jsonb_build_object('ok',true,'order',public.ticket_bundle_view(o));
exception when unique_violation then return jsonb_build_object('ok',false,'code','DUPLICATE_ORDER_OR_PAYMENT');
end $$;
revoke all on function public.ticket_bundle_order_guard(),public.ticket_bundle_payment_identity(),public.ticket_bundle_refund_hold(),public.ticket_bundle_view(public.ticket_bundle_orders),public.ticket_bundle_commerce(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.ticket_bundle_order_guard(),public.ticket_bundle_payment_identity(),public.ticket_bundle_refund_hold(),public.ticket_bundle_view(public.ticket_bundle_orders),public.ticket_bundle_commerce(text,uuid,jsonb) to service_role;
comment on table public.ticket_bundle_orders is 'Member paid-ticket purchase, separate from direct report orders. Refund/expiry policy pending; no automatic refund, no public activation.';
commit;
