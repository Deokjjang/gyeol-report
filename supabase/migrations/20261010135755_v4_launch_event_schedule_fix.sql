-- PREPARED ONLY. Supersedes the LAUNCH-EVENT-01 schedule, not its reward policy.
-- No campaign seed, budget approval, status change, or historical grant rewrite.
begin;
set local lock_timeout='5s';

create or replace function public.launch_campaign_guard() returns trigger language plpgsql security invoker set search_path='' as $$
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
    or c.starts_at is distinct from '2026-10-10T15:00:00Z'::timestamptz
    or c.ends_at is distinct from '2026-10-31T15:00:00Z'::timestamptz then raise exception 'LAUNCH_CAMPAIGN_CONTRACT'; end if;
  return new;
end $$;

-- Keep the existing event ID and references: they are identity, not a date rule.
-- If an operator has already prepared a campaign, only correct its start floor.
update public.growth_campaigns c set starts_at='2026-10-10T15:00:00Z'::timestamptz
where exists(select 1 from public.launch_event_policy p where p.campaign_id=c.id)
  and c.starts_at='2026-10-28T15:00:00Z'::timestamptz;

create or replace function public.launch_event_state() returns jsonb language plpgsql volatile security invoker set search_path='' as $$
declare p public.launch_event_policy%rowtype; c public.growth_campaigns%rowtype; stamp timestamptz:=clock_timestamp();
  state text; approved boolean; total bigint; campaigns bigint; referrals bigint; inviters bigint;
begin
  select * into p from public.launch_event_policy where id='launch-20261029';
  select * into c from public.growth_campaigns where id=p.campaign_id;
  approved:=p.approved_at is not null and p.approved_at<=stamp and p.total_limit is not null
    and p.campaign_limit is not null and p.referral_limit is not null and p.inviter_limit is not null;
  select count(*),count(*) filter(where reward_source='campaign'),count(*) filter(where reward_source='referral'),count(*) filter(where reward_source='inviter')
    into total,campaigns,referrals,inviters from public.report_ticket_grants where launch_event_id=p.id;
  -- Public service gates remain a prerequisite at the application boundary.
  -- Operators must explicitly activate AFTER release; SCHEDULED never auto-opens.
  state:=case when stamp>='2026-10-31T15:00:00Z'::timestamptz or c.status='ENDED' then 'ENDED'
    when c.status='PAUSED' then 'PAUSED'
    when stamp<'2026-10-10T15:00:00Z'::timestamptz then 'SCHEDULED'
    when c.status is distinct from 'ACTIVE' or not approved then 'SCHEDULED'
    when total>=p.total_limit then 'PAUSED' else 'ACTIVE' end;
  return jsonb_build_object('state',state,'serverNow',stamp,'startsAt','2026-10-10T15:00:00Z','endsAt','2026-10-31T15:00:00Z',
    'campaignAvailable',state='ACTIVE' and campaigns<p.campaign_limit,'referralAvailable',state='ACTIVE' and referrals<p.referral_limit,
    'inviterAvailable',state='ACTIVE' and inviters<p.inviter_limit,'budgetApproved',approved,
    'campaignSlug',case when c.status<>'DRAFT' then c.public_slug else null end);
end $$;
-- CREATE OR REPLACE preserves existing ACLs; explicitly keep the service boundary.
revoke all on function public.launch_campaign_guard(),public.launch_event_state() from public,anon,authenticated;
grant execute on function public.launch_campaign_guard(),public.launch_event_state() to service_role;
commit;
