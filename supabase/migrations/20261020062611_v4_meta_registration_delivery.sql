-- Prepared for review. No historic conversions, campaign/date/budget changes or provider calls.
begin;
set local lock_timeout='5s';
create table public.meta_tracking_consents (
  browser_key text primary key check(browser_key ~ '^[a-f0-9]{64}$'),
  user_id uuid references auth.users(id), agreed boolean not null,
  version text not null check(version='meta-20261020-v1'),
  recorded_at timestamptz not null default clock_timestamp(),
  ip text, agent text check(length(agent)<=512)
);
create index meta_consent_user on public.meta_tracking_consents(user_id);
create table public.meta_conversion_outbox (
  event_id text primary key default ('registration_'||replace(gen_random_uuid()::text,'-','')),
  event_name text not null check(event_name in ('CompleteRegistration','Purchase')),
  acquisition_id uuid unique references public.campaign_attributions(id),
  order_id text unique references public.payment_orders(payment_order_id),
  browser_key text not null references public.meta_tracking_consents(browser_key),
  user_id uuid references auth.users(id), occurred_at timestamptz not null,
  custom_data jsonb not null default '{}', ip text, agent text,
  state text not null default 'PENDING' check(state in ('PENDING','SENT','CANCELED','EXPIRED')),
  attempts integer not null default 0, next_at timestamptz not null default clock_timestamp(),
  lease uuid, lease_until timestamptz, first_attempt_at timestamptz, sent_at timestamptz,
  check((event_name='CompleteRegistration' and acquisition_id is not null and order_id is null and custom_data='{}') or
        (event_name='Purchase' and acquisition_id is null and order_id is not null)),
  check(event_id ~ '^(registration|purchase)_[a-f0-9]{32}$')
);
create index meta_outbox_pending on public.meta_conversion_outbox(next_at) where state='PENDING';
alter table public.meta_tracking_consents enable row level security;
alter table public.meta_conversion_outbox enable row level security;
revoke all on public.meta_tracking_consents,public.meta_conversion_outbox from public,anon,authenticated,service_role;
grant select,insert,update,delete on public.meta_tracking_consents,public.meta_conversion_outbox to service_role;

create function public.record_meta_consent(p_user uuid,p_browser text,p_agreed boolean,p_version text,p_ip text default null,p_agent text default null) returns boolean
language plpgsql security invoker set search_path='' as $$
begin
  if p_browser is null or p_browser !~ '^[a-f0-9]{64}$' or p_version<>'meta-20261020-v1' then return false; end if;
  -- Same user lock order as acquisition. Withdrawal cancels all this account's pending events.
  if p_user is not null then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,11)); end if;
  insert into public.meta_tracking_consents(browser_key,user_id,agreed,version,ip,agent)
    values(p_browser,p_user,p_agreed,p_version,case when p_agreed then p_ip end,case when p_agreed then left(p_agent,512) end)
    on conflict(browser_key) do update set user_id=coalesce(excluded.user_id,meta_tracking_consents.user_id),agreed=excluded.agreed,
      version=excluded.version,recorded_at=clock_timestamp(),ip=excluded.ip,agent=excluded.agent;
  if not p_agreed then
    update public.meta_tracking_consents set agreed=false,ip=null,agent=null where browser_key=p_browser or (p_user is not null and user_id=p_user);
    update public.meta_conversion_outbox set state='CANCELED',ip=null,agent=null,lease=null,lease_until=null
      where state='PENDING' and (browser_key=p_browser or (p_user is not null and user_id=p_user));
  end if;
  return true;
end $$;

create function public.queue_meta_registration() returns trigger
language plpgsql security invoker set search_path='' as $$
declare consent public.meta_tracking_consents%rowtype;
begin
  -- The successful grant update is inside growth_campaign's existing transaction.
  -- No browser click/callback can insert this fact, no historical backfill.
  if new.status<>'BENEFIT_GRANTED' or new.benefit_granted_at is null or old.benefit_granted_at is not null
    or new.ticket_grant_id is null or new.user_id is null then return new; end if;
  if not exists(select 1 from public.growth_campaigns c join public.launch_event_policy p on p.campaign_id=c.id
    where c.id=new.campaign_id and c.public_slug='gyeol-opening-2026' and c.offer_type='REPORT_TICKET' and c.ticket_quantity=1)
    or not exists(select 1 from public.new_user_acquisitions n where n.user_id=new.user_id and n.campaign_attribution_id=new.id)
    or not exists(select 1 from public.report_ticket_grants g where g.id=new.ticket_grant_id and g.user_id=new.user_id
      and g.quantity=1 and g.reward_family='ACQUISITION_REWARD' and g.reward_source='campaign') then return new; end if;
  select * into consent from public.meta_tracking_consents where user_id=new.user_id and agreed and version='meta-20261020-v1'
    and ip is not null and agent is not null and recorded_at>=new.acquired_at order by recorded_at desc limit 1;
  if not found then return new; end if;
  insert into public.meta_conversion_outbox(event_name,acquisition_id,browser_key,user_id,occurred_at,ip,agent)
    values('CompleteRegistration',new.id,consent.browser_key,new.user_id,new.benefit_granted_at,consent.ip,consent.agent)
    on conflict(acquisition_id) do nothing;
  return new;
end $$;
create trigger meta_registration_granted after update of benefit_granted_at on public.campaign_attributions
  for each row execute function public.queue_meta_registration();

create function public.queue_meta_purchase(p_report text,p_browser text,p_ip text,p_agent text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare o public.payment_orders%rowtype; event_key text; consent public.meta_tracking_consents%rowtype;
begin
  select * into consent from public.meta_tracking_consents where browser_key=p_browser and agreed and version='meta-20261020-v1';
  if not found then return false; end if;
  select * into o from public.payment_orders where report_id=p_report and status='paid'
    and paid_at is not null and provider_payment_id is not null and provider='toss' and currency='KRW' and amount>0
    and deleted_at is null and refunded_at is null and canceled_at is null and paid_at>clock_timestamp()-interval '6 days' for update;
  if not found then return false; end if;
  event_key:='purchase_'||md5('gyeol:paid-order:'||o.payment_order_id);
  -- Preserve the earlier historical suppression / already handed-off receipt.
  if exists(select 1 from public.meta_purchase_dispatches where order_id=o.payment_order_id)
    and not exists(select 1 from public.meta_conversion_outbox where order_id=o.payment_order_id) then return false; end if;
  insert into public.meta_purchase_dispatches(order_id,event_id) values(o.payment_order_id,event_key) on conflict do nothing;
  insert into public.meta_conversion_outbox(event_id,event_name,order_id,browser_key,user_id,occurred_at,custom_data,ip,agent)
    values(event_key,'Purchase',o.payment_order_id,p_browser,consent.user_id,o.paid_at,
      jsonb_build_object('value',o.amount,'currency','KRW','content_ids',jsonb_build_array(o.product_type),'content_type','product','num_items',1),p_ip,left(p_agent,512))
    on conflict(order_id) do nothing;
  return true;
end $$;

create function public.meta_delivery_batch(p_action text,p_event text default null,p_lease uuid default null) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
  -- Purge network identifiers after 7 days even if the provider is unavailable.
  update public.meta_conversion_outbox set ip=null,agent=null,state=case when state='PENDING' then 'EXPIRED' else state end
    where occurred_at<clock_timestamp()-interval '7 days' and (ip is not null or agent is not null or state='PENDING');
  update public.meta_tracking_consents set ip=null,agent=null where recorded_at<clock_timestamp()-interval '7 days' and (ip is not null or agent is not null);
  update public.meta_conversion_outbox set state='EXPIRED',ip=null,agent=null where state='PENDING' and first_attempt_at<clock_timestamp()-interval '24 hours';
  if p_action='cleanup' then return 'true'::jsonb; end if;
  if p_action='claim' then
    with ready as (
      select o.event_id from public.meta_conversion_outbox o join public.meta_tracking_consents c using(browser_key)
      where o.state='PENDING' and c.agreed and c.version='meta-20261020-v1' and o.ip is not null and o.agent is not null
        and (o.first_attempt_at is null or o.first_attempt_at>clock_timestamp()-interval '24 hours')
        and o.occurred_at>clock_timestamp()-interval '6 days' and o.next_at<=clock_timestamp()
        and (o.lease_until is null or o.lease_until<clock_timestamp())
      order by o.occurred_at limit 5 for update of o skip locked
    ), claimed as (
      update public.meta_conversion_outbox o set lease=gen_random_uuid(),lease_until=clock_timestamp()+interval '2 minutes',first_attempt_at=coalesce(first_attempt_at,clock_timestamp()),attempts=attempts+1
        from ready where o.event_id=ready.event_id returning o.*
    ) select coalesce(jsonb_agg(jsonb_build_object('event_name',event_name,'event_id',event_id,'event_time',floor(extract(epoch from occurred_at)),
      'custom_data',custom_data,'user_data',jsonb_build_object('client_ip_address',ip,'client_user_agent',agent),'lease',lease)),'[]') into result from claimed;
    return result;
  elsif p_action='allowed' then
    return to_jsonb(exists(select 1 from public.meta_conversion_outbox o join public.meta_tracking_consents c using(browser_key)
      where o.event_id=p_event and o.lease=p_lease and o.state='PENDING' and c.agreed and o.lease_until>clock_timestamp()
      and (o.order_id is null or exists(select 1 from public.payment_orders p where p.payment_order_id=o.order_id and p.status='paid' and p.refunded_at is null and p.canceled_at is null and p.deleted_at is null))));
  elsif p_action in ('sent','retry') then
    update public.meta_conversion_outbox set state=case when p_action='sent' then 'SENT' else 'PENDING' end,
      sent_at=case when p_action='sent' then clock_timestamp() end,
      ip=case when p_action='sent' then null else ip end,agent=case when p_action='sent' then null else agent end,
      next_at=clock_timestamp()+make_interval(secs=>least(3600,60*power(2,least(attempts,6)))::int),lease=null,lease_until=null
      where event_id=p_event and lease=p_lease and state='PENDING';
    return to_jsonb(found);
  end if;
  return 'false'::jsonb;
end $$;
revoke all on function public.record_meta_consent(uuid,text,boolean,text,text,text),public.queue_meta_registration(),public.queue_meta_purchase(text,text,text,text),public.meta_delivery_batch(text,text,uuid) from public,anon,authenticated;
grant execute on function public.record_meta_consent(uuid,text,boolean,text,text,text),public.queue_meta_registration(),public.queue_meta_purchase(text,text,text,text),public.meta_delivery_batch(text,text,uuid) to service_role;
commit;
