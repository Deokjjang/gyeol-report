-- PREPARED ONLY. After 9B/9C/10A/10B/11B. No production seed or activation.
begin;
set local lock_timeout='5s';
create table public.growth_campaigns (
  id uuid primary key default gen_random_uuid(),
  public_slug text not null unique check(public_slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  name text not null check(length(name) between 1 and 120),
  message text not null check(length(message) between 1 and 160),
  status text not null default 'DRAFT' check(status in ('DRAFT','SCHEDULED','ACTIVE','PAUSED','ENDED')),
  starts_at timestamptz, ends_at timestamptz,
  channel text not null default 'campaign' check(channel ~ '^[a-z0-9_-]{1,40}$'),
  offer_type text not null check(offer_type in ('NONE','REPORT_TICKET','COUPON')),
  ticket_quantity integer check(ticket_quantity between 1 and 10000),
  coupon_id uuid references public.coupon_definitions(id) on delete restrict,
  new_user_only boolean not null default true check(new_user_only),
  context_seconds integer not null default 600 check(context_seconds between 60 and 600),
  utm_allowlist jsonb not null default '{}' check(jsonb_typeof(utm_allowlist)='object'),
  created_at timestamptz not null default clock_timestamp(), updated_at timestamptz not null default clock_timestamp(),
  check(ends_at is null or starts_at is null or ends_at>starts_at),
  check((offer_type='NONE' and ticket_quantity is null and coupon_id is null) or
    (offer_type='REPORT_TICKET' and ticket_quantity is not null and coupon_id is null) or
    (offer_type='COUPON' and ticket_quantity is null and coupon_id is not null))
);
create table public.campaign_attributions (
  id uuid primary key default gen_random_uuid(), campaign_id uuid not null references public.growth_campaigns(id),
  context_hash text not null unique check(context_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid unique references auth.users(id),
  status text not null default 'CONTEXT' check(status in ('CONTEXT','ATTRIBUTED','BENEFIT_GRANTED','INELIGIBLE')),
  acquired_at timestamptz not null default clock_timestamp(), context_expires_at timestamptz not null,
  attributed_at timestamptz, benefit_granted_at timestamptz,
  ticket_grant_id uuid unique references public.report_ticket_grants(id),
  coupon_grant_id uuid unique references public.coupon_grants(id),
  source_metadata jsonb not null default '{}' check(jsonb_typeof(source_metadata)='object' and
    source_metadata-array['utm_source','utm_medium','utm_campaign','utm_content','utm_term']='{}'::jsonb),
  generation_started_at timestamptz, published_at timestamptz,
  first_report_id text unique references public.paid_report_snapshots(report_id), share_created_at timestamptz,
  check(num_nonnulls(ticket_grant_id,coupon_grant_id)<=1),
  check(status<>'BENEFIT_GRANTED' or (user_id is not null and benefit_granted_at is not null and num_nonnulls(ticket_grant_id,coupon_grant_id)=1)),
  check((first_report_id is null)=(published_at is null))
);
create index campaign_attributions_campaign on public.campaign_attributions(campaign_id,status);
-- Authority junction, NOT a reward ledger: only one immutable attribution owner.
create table public.new_user_acquisitions (
  user_id uuid primary key references auth.users(id),
  referral_attribution_id uuid unique references public.referral_attributions(id) deferrable initially deferred,
  campaign_attribution_id uuid unique references public.campaign_attributions(id) deferrable initially deferred,
  check(num_nonnulls(referral_attribution_id,campaign_attribution_id)=1)
);
insert into public.new_user_acquisitions(user_id,referral_attribution_id)
  select referred_user_id,id from public.referral_attributions;
alter table public.growth_campaigns enable row level security;
alter table public.campaign_attributions enable row level security;
alter table public.new_user_acquisitions enable row level security;
revoke all on public.growth_campaigns,public.campaign_attributions,public.new_user_acquisitions from public,anon,authenticated,service_role;
grant select,insert,update on public.growth_campaigns,public.campaign_attributions to service_role;
grant select,insert on public.new_user_acquisitions to service_role;

create function public.guard_acquisition_attribution() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_table_name='new_user_acquisitions' then raise exception 'ACQUISITION_IMMUTABLE'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.referred_user_id::text,11));
  insert into public.new_user_acquisitions(user_id,referral_attribution_id) values(new.referred_user_id,new.id);
  return new;
end $$;
create trigger referral_acquisition_once before insert on public.referral_attributions for each row execute function public.guard_acquisition_attribution();
create trigger acquisition_immutable before update or delete on public.new_user_acquisitions for each row execute function public.guard_acquisition_attribution();

create function public.campaign_available(p_id uuid) returns boolean
language sql volatile security invoker set search_path='' as $$
  select coalesce((select c.status in ('ACTIVE','SCHEDULED') and (c.starts_at is null or c.starts_at<=clock_timestamp())
    and (c.status<>'SCHEDULED' or c.starts_at is not null) and (c.ends_at is null or c.ends_at>clock_timestamp())
    and (c.offer_type<>'COUPON' or exists(select 1 from public.coupon_definitions d where d.id=c.coupon_id
      and d.code is null and d.member_only and d.is_active and d.starts_at<=clock_timestamp() and d.expires_at>clock_timestamp()))
    from public.growth_campaigns c where c.id=p_id),false)
$$;

create function public.growth_campaign(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare c public.growth_campaigns%rowtype; a public.campaign_attributions%rowtype; d public.coupon_definitions%rowtype;
  q public.new_user_acquisitions%rowtype; stamp timestamptz; born timestamptz; result jsonb; pub jsonb; meta jsonb; rows jsonb; product jsonb; usable boolean;
begin
  -- Shared with 11B: user(11) -> campaign -> attribution -> ONE benefit ledger lock.
  if p_user is not null then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,11)); end if;
  if p_user is not null then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('user:'||p_user::text,11)); end if;
  stamp:=clock_timestamp();
  if p_action in ('presentation','capture') then
    select * into c from public.growth_campaigns where public_slug=p_data->>'slug' for update;
    if not found or c.status='DRAFT' then return jsonb_build_object('ok',false); end if;
    if p_action='presentation' then
      select * into d from public.coupon_definitions where id=c.coupon_id;
      return jsonb_build_object('ok',true,'presentation',jsonb_build_object('slug',c.public_slug,'message',c.message,
        'active',public.campaign_available(c.id),'status',case when c.ends_at<=stamp then 'ENDED' when c.starts_at>stamp then 'SCHEDULED' else c.status end,
        'offer',c.offer_type,'quantity',c.ticket_quantity,'endsAt',c.ends_at,'startsAt',c.starts_at,
        'coupon',case when d.id is null then null else jsonb_build_object('name',d.name,'type',d.discount_type,'value',d.discount_value,
          'maxDiscount',d.max_discount,'minOrder',d.min_order_amount,'products',d.product_ids,'expiresAt',d.expires_at) end));
    end if;
    if p_user is not null or not public.campaign_available(c.id) then return jsonb_build_object('ok',false); end if;
    -- Only operator-approved non-PII UTM tokens. Raw query/unknown fields never persist.
    select coalesce(jsonb_object_agg(v.key,v.value),'{}') into meta from jsonb_each_text(coalesce(p_data->'utm','{}')) v
      where v.key=any(array['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])
        and v.value ~ '^[a-zA-Z0-9_-]{1,64}$' and not(v.value ~ '[0-9]{6}')
        and jsonb_typeof(c.utm_allowlist->v.key)='array' and c.utm_allowlist->v.key ? v.value;
    insert into public.campaign_attributions(campaign_id,context_hash,context_expires_at,source_metadata)
      values(c.id,p_data->>'contextHash',stamp+make_interval(secs=>c.context_seconds),meta);
    return jsonb_build_object('ok',true,'maxAge',c.context_seconds);
  elsif p_action='context_valid' then
    return jsonb_build_object('ok',exists(select 1 from public.campaign_attributions where context_hash=p_data->>'contextHash'
      and user_id is null and context_expires_at>clock_timestamp() and public.campaign_available(campaign_id)));
  elsif p_action='contexts' then
    select * into q from public.new_user_acquisitions where user_id=p_user;
    if found then return jsonb_build_object('ok',true,'settled',true); end if;
    select coalesce(jsonb_agg(x order by x."acquiredAt",x.kind),'[]') into rows from (
      select 'campaign' as kind,a0.context_hash as hash,a0.acquired_at as "acquiredAt" from public.campaign_attributions a0
        where a0.context_hash=p_data->>'campaignHash' and a0.context_expires_at>stamp and (a0.user_id is null or a0.user_id=p_user)
          and public.campaign_available(a0.campaign_id)
      union all
      select 'referral',r.secret_hash,r.acquired_at from public.referral_contexts r join public.referral_invites i on i.id=r.invite_id
        where r.secret_hash=p_data->>'referralHash' and r.expires_at>stamp and (r.bound_user_id is null or r.bound_user_id=p_user)
          and i.inviter_user_id<>p_user and i.revoked_at is null and (i.expires_at is null or i.expires_at>stamp)
    ) x;
    return jsonb_build_object('ok',true,'contexts',rows);
  elsif p_action in ('bind','attribute') then
    select * into q from public.new_user_acquisitions where user_id=p_user;
    if found then return jsonb_build_object('ok',exists(select 1 from public.campaign_attributions where id=q.campaign_attribution_id and context_hash=p_data->>'contextHash'),'settled',true); end if;
    select * into a from public.campaign_attributions where context_hash=p_data->>'contextHash';
    if not found or p_user is null or (a.user_id is not null and a.user_id<>p_user) or a.context_expires_at<=stamp then return jsonb_build_object('ok',false); end if;
    select * into c from public.growth_campaigns where id=a.campaign_id for update;
    select * into a from public.campaign_attributions where id=a.id for update;
    stamp:=clock_timestamp();
    if not public.campaign_available(c.id) or a.context_expires_at<=stamp or (a.user_id is not null and a.user_id<>p_user) then return jsonb_build_object('ok',false); end if;
    select created_at into born from auth.users where id=p_user;
    if born is null or born<a.acquired_at or born>stamp
      or exists(select 1 from public.campaign_attributions where user_id=p_user and id<>a.id)
      or exists(select 1 from public.account_profiles where user_id=p_user and created_at<a.acquired_at)
      or exists(select 1 from public.account_consent_events where user_id=p_user and recorded_at<a.acquired_at)
      or exists(select 1 from public.report_account_links where user_id=p_user)
      or exists(select 1 from public.report_ticket_grants where user_id=p_user)
      or exists(select 1 from public.report_ticket_redemptions where user_id=p_user)
      or exists(select 1 from public.coupon_grants where user_id=p_user)
      or exists(select 1 from public.coupon_redemptions where user_id=p_user)
      or exists(select 1 from public.report_purchase_bindings b join public.payment_orders o on o.payment_order_id=b.order_id where b.buyer_id=p_user and o.paid_at is not null)
      then return jsonb_build_object('ok',false); end if;
    update public.campaign_attributions set user_id=p_user where id=a.id;
    if p_action='bind' then return jsonb_build_object('ok',true); end if;
    if not exists(select 1 from public.account_profiles where user_id=p_user) or not coalesce(p_data->'versions' ? 'terms' and p_data->'versions' ? 'privacy',false)
      or exists(select 1 from jsonb_each_text(p_data->'versions') v where not exists(
        select 1 from (select distinct on(consent_type) * from public.account_consent_events where user_id=p_user order by consent_type,id desc) e
          where e.consent_type=v.key and e.document_version=v.value and e.is_agreed and e.required)) then return jsonb_build_object('ok',false); end if;
    insert into public.new_user_acquisitions(user_id,campaign_attribution_id) values(p_user,a.id);
    update public.campaign_attributions set status='ATTRIBUTED',attributed_at=stamp where id=a.id;
    if c.offer_type='REPORT_TICKET' then
      result:=public.report_tickets('grant',p_user,jsonb_build_object('quantity',c.ticket_quantity,'sourceType','promotion','sourceRef','campaign:'||a.id,'key','campaign:'||a.id,'reason','CAMPAIGN_ACQUISITION'));
      if result->>'ok' is distinct from 'true' then raise exception 'CAMPAIGN_GRANT_FAILED'; end if;
      update public.campaign_attributions set status='BENEFIT_GRANTED',benefit_granted_at=stamp,ticket_grant_id=(result->>'grantId')::uuid where id=a.id;
    elsif c.offer_type='COUPON' then
      select * into d from public.coupon_definitions where id=c.coupon_id for update;
      if not public.campaign_available(c.id) then raise exception 'CAMPAIGN_OFFER_CHANGED'; end if;
      result:=public.report_coupons('grant',p_user,'user:'||p_user::text,jsonb_build_object('couponId',d.id,'sourceType','campaign','sourceRef','acquisition:'||a.id,'key','campaign:'||a.id));
      if result->>'ok' is distinct from 'true' then raise exception 'CAMPAIGN_GRANT_FAILED'; end if;
      -- Reuse the authoritative 10B quote for expiry, caps, product and minimum
      -- payment rules. The catalog is supplied by server code, never the URL.
      usable:=false;
      for product in select value from jsonb_array_elements(coalesce(p_data->'products','[]')) loop
        if public.report_coupons('quote',p_user,'user:'||p_user::text,product||jsonb_build_object('grantId',result->>'grantId'))->>'ok'='true' then usable:=true; exit; end if;
      end loop;
      if not usable then raise exception using errcode='PCA01',message='CAMPAIGN_OFFER_UNUSABLE'; end if;
      update public.campaign_attributions set status='BENEFIT_GRANTED',benefit_granted_at=stamp,coupon_grant_id=(result->>'grantId')::uuid where id=a.id;
    end if;
    return jsonb_build_object('ok',true,'settled',true);
  elsif p_action='candidates' then
    -- A started job is not a conversion. Only the service's full validator may publish.
    update public.campaign_attributions a0 set generation_started_at=coalesce(a0.generation_started_at,x.started) from (
      select a1.id,min(s.created_at) started from public.campaign_attributions a1 join public.new_user_acquisitions n on n.campaign_attribution_id=a1.id
      join public.paid_report_snapshots s on s.created_at>=a1.attributed_at
      left join public.report_ticket_redemptions t on t.id=s.ticket_redemption_id
      left join public.report_purchase_bindings b on b.order_id=s.order_id
      where (p_user is null or a1.user_id=p_user) and (t.user_id=a1.user_id or b.buyer_id=a1.user_id) group by a1.id
    ) x where a0.id=x.id;
    select coalesce(jsonb_agg(x),'[]') into rows from (
      select s.report_id as "reportId",s.snapshot_json as snapshot from public.campaign_attributions a0
      join public.new_user_acquisitions n on n.campaign_attribution_id=a0.id join public.report_account_links l on l.user_id=a0.user_id
      join public.paid_report_snapshots s using(report_id)
      where (p_user is null or a0.user_id=p_user) and a0.first_report_id is null and s.published_at>=a0.attributed_at
        and l.linked_at>=a0.attributed_at and public.referral_publication(s.report_id) is not null
      order by a0.id,s.published_at,s.report_id
    ) x;
    return jsonb_build_object('ok',true,'items',rows);
  elsif p_action='publish' then
    pub:=public.referral_publication(p_data->>'reportId');
    if pub is null or pub->'snapshot' is distinct from p_data->'snapshot' then return jsonb_build_object('ok',false); end if;
    select * into a from public.campaign_attributions where user_id=(pub->>'owner')::uuid for update;
    if not found or a.attributed_at is null or (pub->>'publishedAt')::timestamptz<a.attributed_at or (pub->>'linkedAt')::timestamptz<a.attributed_at then return jsonb_build_object('ok',false); end if;
    if a.first_report_id is null then update public.campaign_attributions set published_at=(pub->>'publishedAt')::timestamptz,first_report_id=p_data->>'reportId' where id=a.id; end if;
    return jsonb_build_object('ok',true);
  elsif p_action='funnel' then
    select coalesce(jsonb_agg(jsonb_build_object('event',v.event,'eventId',md5(a0.id::text||v.event),'campaign',c0.public_slug,'occurredAt',v.stamp)),'[]') into rows
      from public.campaign_attributions a0 join public.growth_campaigns c0 on c0.id=a0.campaign_id
      cross join lateral (values ('campaign_attributed',a0.attributed_at),('campaign_benefit_granted',a0.benefit_granted_at),
        ('campaign_generation_started',a0.generation_started_at),('campaign_report_published',a0.published_at),('campaign_share_created',a0.share_created_at)) v(event,stamp)
      where v.stamp is not null and (p_user is null or a0.user_id=p_user);
    return jsonb_build_object('ok',true,'events',rows);
  elsif p_action='feedback' then
    select * into a from public.campaign_attributions where user_id=p_user;
    return jsonb_build_object('ok',true,'notice',case when a.ticket_grant_id is not null then
      '캠페인 참여로 리포트 이용권 '||(select quantity from public.report_ticket_grants where id=a.ticket_grant_id)||'장을 받았습니다.'
      when a.coupon_grant_id is not null then '캠페인 쿠폰을 받았습니다. 결제 화면의 보유 쿠폰에서 선택하세요.' else null end);
  end if;
  return jsonb_build_object('ok',false);
exception when sqlstate 'PCA01' then
  -- Includes attribution/junction/grant rollback: an unusable coupon cannot
  -- consume the acquisition family or leave a partially granted benefit.
  return jsonb_build_object('ok',false);
end $$;

-- Share adapter restores paid/ticket parity without changing read-token authority.
create function public.book_share_publication(p_report text,p_user uuid default null) returns jsonb
language sql volatile security invoker set search_path='' as $$
  select case when p is not null and (p_user is null or p->>'owner'=p_user::text)
    then jsonb_build_object('ok',true,'status','COMPLETED','snapshot',p->'snapshot','expiresAt',p->'expiresAt')
    else jsonb_build_object('ok',false) end from (select public.referral_publication(p_report) p) v
$$;
create function public.record_campaign_share() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  update public.campaign_attributions a set share_created_at=coalesce(a.share_created_at,clock_timestamp())
    from public.report_account_links l where l.report_id=new.report_id and l.user_id=a.user_id and l.revoked_at is null and a.attributed_at is not null;
  return new;
end $$;
create trigger campaign_share_conversion after insert on public.report_share_links for each row execute function public.record_campaign_share();
revoke all on function public.guard_acquisition_attribution(),public.campaign_available(uuid),public.growth_campaign(text,uuid,jsonb),public.book_share_publication(text,uuid),public.record_campaign_share() from public,anon,authenticated;
grant execute on function public.guard_acquisition_attribution(),public.campaign_available(uuid),public.growth_campaign(text,uuid,jsonb),public.book_share_publication(text,uuid),public.record_campaign_share() to service_role;
comment on table public.new_user_acquisitions is 'One immutable new-user attribution across referral and campaign; amounts/balances remain solely in ticket and coupon ledgers.';
commit;
