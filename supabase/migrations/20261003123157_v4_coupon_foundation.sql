-- PREPARED ONLY. After 9B / 9C / 10A and existing paid reliability patches.
begin;
set local lock_timeout = '5s';
create table public.coupon_definitions (
  id uuid primary key default gen_random_uuid(),
  code text unique check (code ~ '^[A-Z0-9_-]{3,40}$'),
  name text not null check (length(name) between 1 and 80),
  discount_type text not null check (discount_type in ('fixed_amount','percentage')),
  discount_value integer not null check (discount_value>0),
  max_discount integer check (max_discount>0),
  min_order_amount integer not null default 0 check (min_order_amount>=0),
  product_ids text[] not null default '{}',
  member_only boolean not null default true,
  first_purchase_only boolean not null default false,
  starts_at timestamptz not null, expires_at timestamptz not null,
  total_usage_limit integer check (total_usage_limit>0),
  per_user_limit integer not null default 1 check (per_user_limit>0),
  is_active boolean not null default true,
  campaign_ref text, created_at timestamptz not null default now(),
  check (expires_at>starts_at),
  check (discount_type<>'percentage' or discount_value<=100),
  check (not first_purchase_only or member_only),
  check (product_ids <@ array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune']::text[])
);
create table public.coupon_grants (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupon_definitions(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  source_type text not null check (source_type in ('promotion','welcome','referral','manual','campaign')),
  source_ref text not null check (length(source_ref) between 1 and 200),
  granted_at timestamptz not null default now(), expires_at timestamptz,
  idempotency_key text not null,
  unique(source_type,source_ref), unique(user_id,idempotency_key),
  unique(id,coupon_id,user_id)
);
create index coupon_grants_user_idx on public.coupon_grants(user_id,coupon_id);
create table public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupon_definitions(id) on delete restrict,
  grant_id uuid, user_id uuid references auth.users(id) on delete restrict,
  actor_key text not null,
  payment_order_id text not null unique references public.payment_orders(payment_order_id) on delete restrict,
  original_amount integer not null check(original_amount>=100),
  discount_amount integer not null check(discount_amount>0),
  final_amount integer not null check(final_amount>=100),
  display_name text not null, campaign_ref text,
  definition_snapshot jsonb not null,
  state text not null default 'RESERVED' check(state in ('RESERVED','REDEEMED','RELEASED')),
  idempotency_key text not null, input_hash text not null check(input_hash ~ '^[a-f0-9]{64}$'),
  reserved_at timestamptz not null default now(), reserve_until timestamptz not null,
  confirm_started_at timestamptz, redeemed_at timestamptz, released_at timestamptz, release_reason text,
  unique(actor_key,idempotency_key),
  foreign key(grant_id,coupon_id,user_id) references public.coupon_grants(id,coupon_id,user_id) on delete restrict,
  check(grant_id is null or user_id is not null),
  check(original_amount-discount_amount=final_amount),
  check((user_id is not null and actor_key='user:'||user_id::text) or (user_id is null and actor_key ~ '^guest:[a-f0-9]{64}$')),
  check(reserve_until>reserved_at and reserve_until<=reserved_at+interval '10 minutes'),
  check((state='RESERVED' and redeemed_at is null and released_at is null) or
    (state='REDEEMED' and redeemed_at is not null and released_at is null) or
    (state='RELEASED' and redeemed_at is null and released_at is not null))
);
create index coupon_redemptions_usage_idx on public.coupon_redemptions(coupon_id,state,reserve_until);
create index coupon_redemptions_actor_idx on public.coupon_redemptions(actor_key,coupon_id,state);
create unique index coupon_grant_active_idx on public.coupon_redemptions(grant_id) where grant_id is not null and state<>'RELEASED';
alter table public.payment_orders add column coupon_redemption_id uuid unique references public.coupon_redemptions(id) on delete restrict;
alter table public.payment_orders add column coupon_original_amount integer;
alter table public.payment_orders add column coupon_discount_amount integer;
alter table public.payment_orders add constraint coupon_order_amount_check check (
  (coupon_redemption_id is null and coupon_original_amount is null and coupon_discount_amount is null) or
  (coupon_redemption_id is not null and coupon_original_amount>=100 and coupon_discount_amount>0 and amount>=100 and coupon_original_amount-coupon_discount_amount=amount)
);
alter table public.coupon_definitions enable row level security;
alter table public.coupon_grants enable row level security;
alter table public.coupon_redemptions enable row level security;
revoke all on public.coupon_definitions,public.coupon_grants,public.coupon_redemptions from public,anon,authenticated,service_role;
grant select,insert,update on public.coupon_definitions,public.coupon_redemptions to service_role;
grant select,insert on public.coupon_grants to service_role;
grant select,update on public.payment_orders to service_role;

-- No financial snapshot or terminal redemption may be rewritten.
create function public.guard_coupon_audit() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_table_name='coupon_grants' then raise exception 'COUPON_GRANT_IMMUTABLE'; end if;
  if (to_jsonb(new)-array['state','confirm_started_at','redeemed_at','released_at','release_reason'])
    is distinct from (to_jsonb(old)-array['state','confirm_started_at','redeemed_at','released_at','release_reason'])
    or (old.state<>'RESERVED' and new is distinct from old)
    or (old.confirm_started_at is not null and new.confirm_started_at is distinct from old.confirm_started_at)
    then raise exception 'COUPON_AUDIT_IMMUTABLE'; end if;
  return new;
end $$;
create trigger coupon_grant_immutable before update or delete on public.coupon_grants for each row execute function public.guard_coupon_audit();
create trigger coupon_redemption_audit before update on public.coupon_redemptions for each row execute function public.guard_coupon_audit();

-- All transitions use actor advisory lock -> definition row -> order row.
-- Browser roles cannot call this RPC. p_user/p_actor/originalAmount are SERVER inputs.
create function public.report_coupons(p_action text,p_user uuid,p_actor text,p_data jsonb default '{}')
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  d public.coupon_definitions%rowtype; g public.coupon_grants%rowtype;
  r public.coupon_redemptions%rowtype; o public.payment_orders%rowtype;
  v_now timestamptz; v_expiry timestamptz; v_discount integer; v_original integer;
  v_id uuid; v_result jsonb; v_claim jsonb; v_order text; v_key text; v_product text;
begin
  if (p_user is not null and (p_actor is distinct from 'user:'||p_user::text or not exists(select 1 from auth.users where id=p_user)))
    or (p_user is null and (p_actor is null or p_actor !~ '^guest:[a-f0-9]{64}$')) then return jsonb_build_object('ok',false,'code','IDENTITY_INVALID'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_actor,11));
  if p_action='list' then
    return jsonb_build_object('ok',true,'items',coalesce((select jsonb_agg(jsonb_build_object('grantId',cg.id,'name',cd.name))
      from public.coupon_grants cg join public.coupon_definitions cd on cd.id=cg.coupon_id where cg.user_id=p_user
        and cd.is_active and cd.starts_at<=clock_timestamp() and least(cd.expires_at,cg.expires_at)>clock_timestamp()
        and not exists(select 1 from public.coupon_redemptions cr where cr.grant_id=cg.id and (cr.state='REDEEMED' or (cr.state='RESERVED' and (cr.reserve_until>clock_timestamp() or cr.confirm_started_at is not null))))),'[]'::jsonb));
  end if;
  if p_action in ('begin_confirm','finish_confirm','release','verified_failure','status') then
    select * into r from public.coupon_redemptions where payment_order_id=p_data->>'orderId' and actor_key=p_actor;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into d from public.coupon_definitions where id=r.coupon_id for update;
    select * into r from public.coupon_redemptions where id=r.id for update;
    select * into o from public.payment_orders where payment_order_id=r.payment_order_id for update;
    v_now:=clock_timestamp();
    if o.coupon_redemption_id is distinct from r.id or o.amount<>r.final_amount or o.coupon_original_amount<>r.original_amount
      or o.coupon_discount_amount<>r.discount_amount or o.deleted_at is not null then return jsonb_build_object('ok',false,'code','ORDER_BINDING_INVALID'); end if;
    if r.state='REDEEMED' then return jsonb_build_object('ok',true,'state',r.state,'reportId',o.report_id,'finalAmount',r.final_amount); end if;
    if r.state='RELEASED' then return jsonb_build_object('ok',p_action in ('release','verified_failure','status'),'state',r.state,'code','RESERVATION_RELEASED'); end if;
    if p_action='release' and r.confirm_started_at is not null then return jsonb_build_object('ok',false,'code','PAYMENT_RECONCILIATION_REQUIRED'); end if;
    if p_action='verified_failure' and (o.confirm_token is null or o.confirm_token is distinct from (p_data->>'token')::uuid) then return jsonb_build_object('ok',false,'code','STALE_CONFIRM'); end if;
    if p_action in ('release','verified_failure') or (r.reserve_until<=v_now and r.confirm_started_at is null) then
      if o.status<>'ready' then return jsonb_build_object('ok',false,'code','PAYMENT_ALREADY_COMPLETED'); end if;
      update public.coupon_redemptions set state='RELEASED',released_at=v_now,release_reason=case when p_action='verified_failure' then 'PROVIDER_TERMINAL_FAILURE' else 'CANCELED_OR_EXPIRED' end where id=r.id;
      update public.payment_orders set status='canceled',canceled_at=v_now,confirm_token=null,confirm_lease_until=null where payment_order_id=o.payment_order_id;
      return jsonb_build_object('ok',p_action in ('release','verified_failure','status'),'state','RELEASED','code','RESERVATION_EXPIRED');
    end if;
    if p_action='begin_confirm' then
      -- Reserved terms are frozen for ten minutes; later edits/expiry cannot reprice.
      if (r.definition_snapshot->>'first_purchase_only')::boolean and r.confirm_started_at is null and exists(select 1 from public.payment_orders po left join public.report_purchase_bindings b on b.order_id=po.payment_order_id where po.paid_at is not null and (b.buyer_id=p_user or exists(select 1 from public.report_account_links al where al.report_id=po.report_id and al.user_id=p_user))) then
        return jsonb_build_object('ok',false,'code','FIRST_PURCHASE_ONLY');
      end if;
      v_result:=public.paid_report_reliability('confirm_claim',jsonb_build_object('orderId',o.provider_order_id,'paymentKey',p_data->>'paymentKey','amount',r.final_amount));
      if v_result->>'ok'='true' and v_result->>'token' is not null then update public.coupon_redemptions set confirm_started_at=coalesce(confirm_started_at,v_now) where id=r.id; end if;
      return v_result||jsonb_build_object('finalAmount',r.final_amount,'providerOrderId',o.provider_order_id);
    elsif p_action='finish_confirm' then
      if r.confirm_started_at is null or (p_data->>'amount')::integer is distinct from r.final_amount then return jsonb_build_object('ok',false,'code','PAYMENT_MISMATCH'); end if;
      v_result:=public.paid_report_reliability('confirm_finish',jsonb_build_object('orderId',o.provider_order_id,'paymentKey',p_data->>'paymentKey','token',p_data->>'token','paidAt',p_data->>'paidAt','amount',r.final_amount));
      if v_result->>'ok'='true' and v_result->>'reportId' is not null then
        update public.coupon_redemptions set state='REDEEMED',redeemed_at=v_now where id=r.id;
        return v_result||jsonb_build_object('state','REDEEMED');
      end if;
      return v_result;
    end if;
    return jsonb_build_object('ok',true,'state',r.state,'finalAmount',r.final_amount);
  end if;
  if p_action='grant' then
    if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    select * into d from public.coupon_definitions where id=(p_data->>'couponId')::uuid for update;
    if not found then return jsonb_build_object('ok',false,'code','COUPON_NOT_FOUND'); end if;
    select * into g from public.coupon_grants where (source_type=p_data->>'sourceType' and source_ref=p_data->>'sourceRef') or (user_id=p_user and idempotency_key=p_data->>'key');
    if found then return jsonb_build_object('ok',g.user_id=p_user and g.coupon_id=d.id and g.source_type=p_data->>'sourceType' and g.source_ref=p_data->>'sourceRef' and g.expires_at is not distinct from (p_data->>'expiresAt')::timestamptz,'grantId',g.id); end if;
    insert into public.coupon_grants(coupon_id,user_id,source_type,source_ref,expires_at,idempotency_key) values(d.id,p_user,p_data->>'sourceType',p_data->>'sourceRef',(p_data->>'expiresAt')::timestamptz,p_data->>'key') returning * into g;
    return jsonb_build_object('ok',true,'grantId',g.id);
  end if;
  if p_action not in ('quote','reserve','claim') then return jsonb_build_object('ok',false,'code','ACTION_INVALID'); end if;
  if p_data ? 'grantId' and p_data ? 'code' then return jsonb_build_object('ok',false,'code','ONE_COUPON_ONLY'); end if;
  if p_data ? 'grantId' then
    select * into g from public.coupon_grants where id=(p_data->>'grantId')::uuid and user_id=p_user;
    if not found then return jsonb_build_object('ok',false,'code','COUPON_NOT_FOUND'); end if;
    select * into d from public.coupon_definitions where id=g.coupon_id for update;
  else
    select * into d from public.coupon_definitions where code=upper(btrim(p_data->>'code')) for update;
  end if;
  if d.id is null then return jsonb_build_object('ok',false,'code','COUPON_NOT_FOUND'); end if;
  v_now:=clock_timestamp(); v_expiry:=least(d.expires_at,g.expires_at);
  if p_action='reserve' then
    select * into r from public.coupon_redemptions where actor_key=p_actor and idempotency_key=p_data->>'requestId';
    if found then
      if r.coupon_id<>d.id or r.grant_id is distinct from g.id or r.input_hash is distinct from p_data->>'inputHash'
        or not exists(select 1 from public.payment_orders where payment_order_id=r.payment_order_id and product_type=p_data->>'productType') then return jsonb_build_object('ok',false,'code','REQUEST_CONFLICT'); end if;
      return jsonb_build_object('ok',true,'orderId',r.payment_order_id,'state',r.state,'originalAmount',r.original_amount,'discountAmount',r.discount_amount,'finalAmount',r.final_amount);
    end if;
  end if;
  if not d.is_active then return jsonb_build_object('ok',false,'code','COUPON_INACTIVE'); end if;
  if d.starts_at>v_now then return jsonb_build_object('ok',false,'code','COUPON_NOT_STARTED'); end if;
  if v_expiry<=v_now then return jsonb_build_object('ok',false,'code','COUPON_EXPIRED'); end if;
  if d.member_only and p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  if p_action='claim' then
    if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    -- One deterministic claim source per member/code; no automatic welcome hook.
    return public.report_coupons('grant',p_user,p_actor,jsonb_build_object('couponId',d.id,'sourceType','campaign','sourceRef','claim:'||d.id::text||':'||p_user::text,'key','claim:'||d.id::text));
  end if;
  v_original:=(p_data->>'originalAmount')::integer; v_product:=p_data->>'productType';
  if v_original is null or v_original<100 or v_product is null or v_product<>all(array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune']) then return jsonb_build_object('ok',false,'code','PRODUCT_INVALID'); end if;
  if cardinality(d.product_ids)>0 and not(v_product=any(d.product_ids)) then return jsonb_build_object('ok',false,'code','PRODUCT_INELIGIBLE'); end if;
  if v_original<d.min_order_amount then return jsonb_build_object('ok',false,'code','MIN_ORDER_AMOUNT'); end if;
  if d.first_purchase_only and (exists(select 1 from public.payment_orders po left join public.report_purchase_bindings b on b.order_id=po.payment_order_id where po.paid_at is not null and (b.buyer_id=p_user or exists(select 1 from public.report_account_links al where al.report_id=po.report_id and al.user_id=p_user)))
    or exists(select 1 from public.coupon_redemptions cr join public.coupon_definitions cd on cd.id=cr.coupon_id where cr.user_id=p_user and cd.first_purchase_only and cr.state='RESERVED' and (cr.reserve_until>v_now or cr.confirm_started_at is not null))) then return jsonb_build_object('ok',false,'code','FIRST_PURCHASE_ONLY'); end if;
  -- Never free a slot once provider confirmation might have succeeded.
  update public.coupon_redemptions set state='RELEASED',released_at=v_now,release_reason='ABANDONED'
    where coupon_id=d.id and state='RESERVED' and reserve_until<=v_now and confirm_started_at is null;
  if (d.total_usage_limit is not null and (select count(*) from public.coupon_redemptions where coupon_id=d.id and state<>'RELEASED')>=d.total_usage_limit)
    or (select count(*) from public.coupon_redemptions where coupon_id=d.id and actor_key=p_actor and state<>'RELEASED')>=d.per_user_limit
    or (g.id is not null and exists(select 1 from public.coupon_redemptions where grant_id=g.id and state<>'RELEASED')) then return jsonb_build_object('ok',false,'code','USAGE_LIMIT'); end if;
  v_discount:=case when d.discount_type='fixed_amount' then d.discount_value else floor(v_original::numeric*d.discount_value/100)::integer end;
  if d.max_discount is not null then v_discount:=least(v_discount,d.max_discount); end if;
  if v_discount<=0 or v_original-v_discount<100 then return jsonb_build_object('ok',false,'code','MINIMUM_PAYMENT'); end if;
  v_result:=jsonb_build_object('ok',true,'originalAmount',v_original,'discountAmount',v_discount,'finalAmount',v_original-v_discount,'coupon',jsonb_build_object('name',d.name,'expiresAt',v_expiry));
  if p_action='quote' then return v_result; end if;
  v_key:=p_data->>'requestId'; v_order:=p_data->>'orderId';
  if v_key is null or v_key !~ '^[A-Za-z0-9_-]{16,100}$' or v_order is null or p_data->>'inputHash' is null then return jsonb_build_object('ok',false,'code','REQUEST_INVALID'); end if;
  v_claim:=public.paid_report_reliability('create_order',jsonb_build_object('paymentOrderId',v_order,'providerOrderId',v_order,'provider','toss','productType',v_product,'amount',v_original-v_discount,'inputSnapshot',p_data->'inputSnapshot'));
  if v_claim->>'ok'<>'true' then return v_claim; end if;
  if not public.bind_report_purchase(v_order,p_user,p_data->>'claimHash',coalesce(p_data->>'displayName',''),p_data->>'selectedYear') then raise exception 'COUPON_BINDING_FAILED'; end if;
  insert into public.coupon_redemptions(coupon_id,grant_id,user_id,actor_key,payment_order_id,original_amount,discount_amount,final_amount,display_name,campaign_ref,definition_snapshot,idempotency_key,input_hash,reserved_at,reserve_until)
    values(d.id,g.id,p_user,p_actor,v_order,v_original,v_discount,v_original-v_discount,d.name,d.campaign_ref,to_jsonb(d),v_key,p_data->>'inputHash',v_now,v_now+interval '10 minutes') returning id into v_id;
  update public.payment_orders set coupon_redemption_id=v_id,coupon_original_amount=v_original,coupon_discount_amount=v_discount where payment_order_id=v_order;
  return v_result||jsonb_build_object('orderId',v_order,'state','RESERVED','fresh',true);
end $$;

create function public.guard_coupon_order() returns trigger language plpgsql security invoker set search_path='' as $$
declare r public.coupon_redemptions%rowtype;
begin
  if old.coupon_redemption_id is null and new.coupon_redemption_id is null then return new; end if;
  if old.coupon_redemption_id is not null and (new.coupon_redemption_id is distinct from old.coupon_redemption_id or new.amount<>old.amount or new.coupon_original_amount is distinct from old.coupon_original_amount or new.coupon_discount_amount is distinct from old.coupon_discount_amount or new.product_type<>old.product_type or new.provider_order_id is distinct from old.provider_order_id) then raise exception 'COUPON_PRICE_IMMUTABLE'; end if;
  select * into r from public.coupon_redemptions where id=new.coupon_redemption_id;
  if not found or r.payment_order_id<>new.payment_order_id or r.final_amount<>new.amount or r.original_amount<>new.coupon_original_amount or r.discount_amount<>new.coupon_discount_amount then raise exception 'COUPON_ORDER_BINDING'; end if;
  if new.status='paid' and old.status<>'paid' and (r.state<>'RESERVED' or r.confirm_started_at is null) then raise exception 'COUPON_CONFIRM_REQUIRED'; end if;
  return new;
end $$;
create trigger coupon_order_guard before update on public.payment_orders for each row execute function public.guard_coupon_order();
revoke all on function public.report_coupons(text,uuid,text,jsonb),public.guard_coupon_audit(),public.guard_coupon_order() from public,anon,authenticated;
grant execute on function public.report_coupons(text,uuid,text,jsonb),public.guard_coupon_audit(),public.guard_coupon_order() to service_role;
comment on table public.coupon_redemptions is 'Immutable discount snapshot. Unknown provider outcome holds reservation until verified reconciliation. Refund reissue is manual/future; report failure never releases paid coupons.';
commit;
