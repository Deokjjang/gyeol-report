-- Forward only: remove launch-event aggregate/source budgets, not account caps.
-- No seed, approval, activation, grant, expiry or historical-row rewrite.
begin;
set local lock_timeout='5s';

-- Keep legacy limit columns for audit/rollback reference, but approval no longer
-- requires quantities. Individual column checks and all reward guards remain.
alter table public.launch_event_policy drop constraint launch_event_policy_check;

create or replace function public.launch_event_state() returns jsonb language plpgsql volatile security invoker set search_path='' as $$
declare p public.launch_event_policy%rowtype; c public.growth_campaigns%rowtype;
  stamp timestamptz:=clock_timestamp(); state text; approved boolean;
begin
  select * into p from public.launch_event_policy where id='launch-20261029';
  select * into c from public.growth_campaigns where id=p.campaign_id;
  approved:=p.approved_at is not null and p.approved_at<=stamp;
  state:=case when stamp>='2026-10-31T15:00:00Z'::timestamptz or c.status='ENDED' then 'ENDED'
    when c.status='PAUSED' then 'PAUSED'
    when stamp<'2026-10-10T15:00:00Z'::timestamptz then 'SCHEDULED'
    when c.status is distinct from 'ACTIVE' or not approved then 'SCHEDULED'
    else 'ACTIVE' end;
  -- budgetApproved is the existing wire contract; now means operator approval,
  -- not a numerical budget. Do not change the deployed countdown payload shape.
  return jsonb_build_object('state',state,'serverNow',stamp,'startsAt','2026-10-10T15:00:00Z','endsAt','2026-10-31T15:00:00Z',
    'campaignAvailable',state='ACTIVE','referralAvailable',state='ACTIVE',
    'inviterAvailable',state='ACTIVE','budgetApproved',approved,
    'campaignSlug',case when c.status<>'DRAFT' then c.public_slug else null end);
end $$;

-- CREATE OR REPLACE preserves the exact service-only ACL. Do not alter it.
-- launch_reward_guard, account locks, launch_reward_lifetime_once, acquisition
-- junction, ledger idempotency, RLS and all paid/Book contracts are unchanged.
comment on table public.launch_event_policy is 'Unlimited total/source issuance. Explicit approved_at plus ACTIVE campaign required. Fixed expiry 2026-11-01 00:00 KST. Lifetime acquisition 1 + inviter 1 per account. Legacy limit columns are ignored. No automatic activation.';
commit;
