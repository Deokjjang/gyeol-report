-- PREPARED ONLY. No campaign seed, budget approval, activation or historic updates.
-- Requires 12B and the existing ticket ledger. Schedule is immutable for this event.
begin;
set local lock_timeout='5s';
do $$ begin
  if to_regprocedure('public.campaign_presentation_v2(text,uuid)') is null
    or to_regprocedure('public.report_tickets(text,uuid,jsonb)') is null then
    raise exception 'LAUNCH_EVENT_PREREQUISITES_REQUIRED';
  end if;
end $$;

create table public.launch_event_policy (
  id text primary key check(id='launch-20261029'),
  campaign_id uuid not null unique references public.growth_campaigns(id),
  total_limit integer check(total_limit>0),
  campaign_limit integer check(campaign_limit>=0),
  referral_limit integer check(referral_limit>=0),
  inviter_limit integer check(inviter_limit>=0),
  approved_at timestamptz,
  check(approved_at is null or (total_limit is not null and campaign_limit is not null and referral_limit is not null and inviter_limit is not null))
);
alter table public.launch_event_policy enable row level security;
revoke all on public.launch_event_policy from public,anon,authenticated,service_role;
-- Row locks require UPDATE privilege; no client role can read or mutate policy.
grant select,update on public.launch_event_policy to service_role;
alter table public.report_ticket_grants add column launch_event_id text references public.launch_event_policy(id);
alter table public.report_ticket_grants add column reward_family text check(reward_family in ('ACQUISITION_REWARD','INVITER_REWARD'));
alter table public.report_ticket_grants add column reward_source text check(reward_source in ('campaign','referral','inviter'));
alter table public.report_ticket_grants add constraint launch_reward_contract check (
  (launch_event_id is null and reward_family is null and reward_source is null) or
  (launch_event_id is not null and reward_family is not null and reward_source is not null and quantity=1
    and expires_at is not null and expires_at='2026-10-31T15:00:00Z'::timestamptz
    and ((reward_family='ACQUISITION_REWARD' and reward_source in ('campaign','referral')) or (reward_family='INVITER_REWARD' and reward_source='inviter')))
);
-- Lifetime, NOT event/link/report specific. Historic rows are never rewritten.
create unique index launch_reward_lifetime_once on public.report_ticket_grants(user_id,reward_family) where reward_family is not null;
create index launch_reward_budget on public.report_ticket_grants(launch_event_id,reward_source);

create function public.launch_campaign_guard() returns trigger language plpgsql security invoker set search_path='' as $$
declare c public.growth_campaigns%rowtype;
begin
  if tg_table_name='launch_event_policy' then
    if tg_op='UPDATE' and (new.id<>old.id or new.campaign_id<>old.campaign_id) then raise exception 'LAUNCH_SCOPE_IMMUTABLE'; end if;
    select * into c from public.growth_campaigns where id=new.campaign_id;
  else
    if not exists(select 1 from public.launch_event_policy where campaign_id=new.id) then return new; end if;
    c:=new;
  end if;
  if c.offer_type is distinct from 'REPORT_TICKET' or c.ticket_quantity is distinct from 1
    or c.starts_at is distinct from '2026-10-28T15:00:00Z'::timestamptz
    or c.ends_at is distinct from '2026-10-31T15:00:00Z'::timestamptz then raise exception 'LAUNCH_CAMPAIGN_CONTRACT'; end if;
  return new;
end $$;
create trigger launch_policy_contract before insert or update on public.launch_event_policy for each row execute function public.launch_campaign_guard();
create trigger launch_campaign_contract before update on public.growth_campaigns for each row execute function public.launch_campaign_guard();

create function public.launch_event_state() returns jsonb language plpgsql volatile security invoker set search_path='' as $$
declare p public.launch_event_policy%rowtype; c public.growth_campaigns%rowtype; stamp timestamptz:=clock_timestamp();
  state text; approved boolean; total bigint; campaigns bigint; referrals bigint; inviters bigint;
begin
  select * into p from public.launch_event_policy where id='launch-20261029';
  select * into c from public.growth_campaigns where id=p.campaign_id;
  approved:=p.approved_at is not null and p.approved_at<=stamp and p.total_limit is not null
    and p.campaign_limit is not null and p.referral_limit is not null and p.inviter_limit is not null;
  select count(*),count(*) filter(where reward_source='campaign'),count(*) filter(where reward_source='referral'),count(*) filter(where reward_source='inviter')
    into total,campaigns,referrals,inviters from public.report_ticket_grants where launch_event_id=p.id;
  state:=case when c.status in ('PAUSED','DRAFT') then 'PAUSED'
    when stamp>='2026-10-31T15:00:00Z'::timestamptz or c.status='ENDED' then 'ENDED'
    when stamp<'2026-10-28T15:00:00Z'::timestamptz then 'SCHEDULED'
    when not approved or total>=p.total_limit or c.status is null then 'PAUSED' else 'ACTIVE' end;
  return jsonb_build_object('state',state,'serverNow',stamp,'startsAt','2026-10-28T15:00:00Z','endsAt','2026-10-31T15:00:00Z',
    'campaignAvailable',state='ACTIVE' and campaigns<p.campaign_limit,'referralAvailable',state='ACTIVE' and referrals<p.referral_limit,
    'inviterAvailable',state='ACTIVE' and inviters<p.inviter_limit,'budgetApproved',approved,
    'campaignSlug',case when c.status<>'DRAFT' then c.public_slug else null end);
end $$;

-- Defense at the ledger boundary, including direct service-role grant attempts.
-- Lock order: account(11) -> context/attribution -> ticket account(10) -> policy.
-- Never acquire an account lock after the budget row lock.
create function public.launch_reward_guard() returns trigger language plpgsql security invoker set search_path='' as $$
declare a public.referral_attributions%rowtype; ca public.campaign_attributions%rowtype;
  p public.launch_event_policy%rowtype; source text; family text; status jsonb;
begin
  if new.source_type='referral' then
    source:=case when new.source_ref like 'referred:%' then 'referral' when new.source_ref like 'inviter:%' then 'inviter' end;
    if source is null then raise exception using errcode='PLE01',message='LAUNCH_REWARD_SOURCE_INVALID'; end if;
    select * into a from public.referral_attributions where id::text=split_part(new.source_ref,':',2);
    if a.id is null or (source='referral' and (a.referred_user_id<>new.user_id or a.status<>'ATTRIBUTED'))
      or (source='inviter' and (a.status<>'QUALIFIED' or a.qualified_report_id is null or not exists(
        select 1 from public.referral_invites i where i.id=a.invite_id and i.inviter_user_id=new.user_id))) then
      raise exception using errcode='PLE01',message='LAUNCH_REWARD_EVIDENCE_REQUIRED';
    end if;
  elsif new.source_type='promotion' and new.source_ref like 'campaign:%' then
    select * into ca from public.campaign_attributions where id::text=split_part(new.source_ref,':',2);
    if not exists(select 1 from public.launch_event_policy where campaign_id=ca.campaign_id) then
      if new.launch_event_id is not null or new.reward_family is not null then raise exception using errcode='PLE01',message='LAUNCH_SCOPE_INVALID'; end if;
      return new;
    end if;
    source:='campaign';
    if ca.user_id is distinct from new.user_id or ca.status<>'ATTRIBUTED' or not exists(
      select 1 from public.new_user_acquisitions where user_id=new.user_id and campaign_attribution_id=ca.id) then
      raise exception using errcode='PLE01',message='LAUNCH_REWARD_EVIDENCE_REQUIRED';
    end if;
  else
    if new.launch_event_id is not null or new.reward_family is not null or new.reward_source is not null then raise exception using errcode='PLE01',message='LAUNCH_SCOPE_INVALID'; end if;
    return new; -- Purchases, manual compensation and non-event lots stay unchanged.
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.user_id::text,10));
  family:=case when source='inviter' then 'INVITER_REWARD' else 'ACQUISITION_REWARD' end;
  -- Count historic rewards too, but never change their expiry or audit rows.
  if exists(select 1 from public.report_ticket_grants g where g.user_id=new.user_id and
    (g.reward_family=family or (family='INVITER_REWARD' and g.source_type='referral' and g.source_ref like 'inviter:%')
      or (family='ACQUISITION_REWARD' and ((g.source_type='referral' and g.source_ref like 'referred:%') or (g.source_type='promotion' and g.source_ref like 'campaign:%'))))) then
    raise exception using errcode='PLE01',message='LAUNCH_LIFETIME_CAP';
  end if;
  select * into p from public.launch_event_policy where id='launch-20261029' for update;
  status:=public.launch_event_state(); -- fresh clock and counts AFTER lock wait
  if status->>'state'<>'ACTIVE' or status->>(source||'Available') is distinct from 'true' or new.quantity<>1 then
    raise exception using errcode='PLE01',message='LAUNCH_REWARD_UNAVAILABLE';
  end if;
  new.launch_event_id:=p.id; new.reward_family:=family; new.reward_source:=source;
  new.expires_at:='2026-10-31T15:00:00Z'::timestamptz;
  return new;
end $$;
create trigger launch_reward_validate before insert on public.report_ticket_grants for each row execute function public.launch_reward_guard();

alter function public.report_tickets(text,uuid,jsonb) rename to report_tickets_before_launch;
create function public.report_tickets(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
  -- Normalize expiry before the existing idempotency comparison too.
  if p_action='grant' and (p_data->>'sourceType'='referral' or (p_data->>'sourceType'='promotion' and exists(
    select 1 from public.campaign_attributions a join public.launch_event_policy e on e.campaign_id=a.campaign_id
      where 'campaign:'||a.id=p_data->>'sourceRef'))) then
    p_data:=p_data||jsonb_build_object('expiresAt','2026-10-31T15:00:00Z');
  end if;
  return public.report_tickets_before_launch(p_action,p_user,p_data);
end $$;

alter function public.campaign_available(uuid) rename to campaign_available_before_launch;
create function public.campaign_available(p_id uuid) returns boolean language sql volatile security invoker set search_path='' as $$
  select public.campaign_available_before_launch(p_id) and (not exists(select 1 from public.launch_event_policy where campaign_id=p_id)
    or public.launch_event_state()->>'campaignAvailable'='true')
$$;
alter function public.growth_campaign(text,uuid,jsonb) rename to growth_campaign_before_launch;
create function public.growth_campaign(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare r jsonb; e jsonb;
begin
  r:=public.growth_campaign_before_launch(p_action,p_user,p_data);
  if p_action='presentation' and exists(select 1 from public.launch_event_policy e0 join public.growth_campaigns c on c.id=e0.campaign_id where c.public_slug=p_data->>'slug') and r->>'ok'='true' then
    e:=public.launch_event_state();
    r:=jsonb_build_object('ok',true,'presentation',(r->'presentation')||jsonb_build_object('status',e->>'state','launchEvent',true,'active',e->'campaignAvailable'));
  end if;
  return r;
exception when sqlstate 'PLE01' then return jsonb_build_object('ok',false,'code','EVENT_UNAVAILABLE');
end $$;

alter function public.book_referrals(text,uuid,jsonb) rename to book_referrals_before_launch;
create function public.book_referrals(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare r jsonb; e jsonb; pub jsonb; a public.referral_attributions%rowtype; inviter uuid; stamp timestamptz;
begin
  e:=public.launch_event_state();
  if p_action='inspect' then
    r:=public.book_referrals_before_launch(p_action,p_user,p_data);
    return r||jsonb_build_object('rewardAvailable',e->'referralAvailable','launchEvent',true,'eventState',e->>'state');
  elsif p_action in ('capture','context','bind','attribute') then
    if e->>'referralAvailable' is distinct from 'true' then return jsonb_build_object('ok',false,'code','EVENT_UNAVAILABLE'); end if;
  elsif p_action='qualify' then
    -- Stored publication, ownership, snapshot equality and original attribution
    -- remain the qualification authority. A reservation/client event is insufficient.
    pub:=public.referral_publication(p_data->>'reportId');
    if pub is null or pub->'snapshot' is distinct from p_data->'snapshot' then return jsonb_build_object('ok',false); end if;
    select * into a from public.referral_attributions where referred_user_id=(pub->>'owner')::uuid for update;
    if not found then return jsonb_build_object('ok',false); end if;
    if a.status in ('INVITER_REWARD_GRANTED','QUALIFIED') then return jsonb_build_object('ok',true); end if;
    if a.status<>'REFERRED_REWARD_GRANTED' or (pub->>'publishedAt')::timestamptz<a.attributed_at or (pub->>'linkedAt')::timestamptz<a.attributed_at then return jsonb_build_object('ok',false); end if;
    select inviter_user_id into inviter from public.referral_invites where id=a.invite_id;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(inviter::text,10));
    stamp:=clock_timestamp();
    update public.referral_attributions set status='QUALIFIED',qualified_at=stamp,qualified_report_id=p_data->>'reportId' where id=a.id;
    e:=public.launch_event_state();
    if e->>'inviterAvailable' is distinct from 'true' or exists(select 1 from public.report_ticket_grants where user_id=inviter
      and (reward_family='INVITER_REWARD' or (source_type='referral' and source_ref like 'inviter:%'))) then
      return jsonb_build_object('ok',true,'rewarded',false);
    end if;
    begin
      r:=public.report_tickets('grant',inviter,jsonb_build_object('quantity',1,'sourceType','referral','sourceRef','inviter:'||a.id,'key','referral:inviter:'||a.id,'reason','REFERRAL_INVITER'));
    exception when sqlstate 'PLE01' then return jsonb_build_object('ok',true,'rewarded',false);
    end;
    if r->>'ok' is distinct from 'true' then return jsonb_build_object('ok',true,'rewarded',false); end if;
    update public.referral_attributions set status='INVITER_REWARD_GRANTED',inviter_rewarded_at=clock_timestamp(),inviter_grant_id=(r->>'grantId')::uuid where id=a.id;
    return jsonb_build_object('ok',true,'rewarded',true);
  end if;
  r:=public.book_referrals_before_launch(p_action,p_user,p_data);
  return case when p_action='create' then r||jsonb_build_object('launchEvent',true) else r end;
exception when sqlstate 'PLE01' then return jsonb_build_object('ok',false,'code','EVENT_UNAVAILABLE');
end $$;

revoke all on function public.launch_campaign_guard(),public.launch_event_state(),public.launch_reward_guard(),public.report_tickets(text,uuid,jsonb),public.campaign_available(uuid),public.growth_campaign(text,uuid,jsonb),public.book_referrals(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.launch_campaign_guard(),public.launch_event_state(),public.launch_reward_guard(),public.report_tickets(text,uuid,jsonb),public.campaign_available(uuid),public.growth_campaign(text,uuid,jsonb),public.book_referrals(text,uuid,jsonb) to service_role;
comment on table public.launch_event_policy is 'No seed. Operator-approved budget and existing campaign window govern exactly 72 hours. Missing policy/budget fails closed. No automatic extension.';
commit;
