-- Phase 11B: prepared only. Requires 9B/9C/10A and report_share_links.
-- No new reward ledger: all credits use report_tickets('grant').
begin;
set local lock_timeout='5s';
create table public.referral_invites (
  id uuid primary key default gen_random_uuid(),
  inviter_user_id uuid not null references auth.users(id) on delete restrict,
  source_report_id text not null references public.paid_report_snapshots(report_id) on delete restrict,
  token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default clock_timestamp(), expires_at timestamptz, revoked_at timestamptz
);
create index referral_invites_owner on public.referral_invites(inviter_user_id);
create index referral_invites_report on public.referral_invites(source_report_id);
create table public.referral_contexts (
  id uuid primary key default gen_random_uuid(), invite_id uuid not null references public.referral_invites(id),
  secret_hash text not null unique check(secret_hash ~ '^[a-f0-9]{64}$'),
  acquired_at timestamptz not null default clock_timestamp(), expires_at timestamptz not null,
  bound_user_id uuid unique references auth.users(id) on delete restrict
);
create index referral_contexts_invite on public.referral_contexts(invite_id);
create table public.referral_attributions (
  id uuid primary key default gen_random_uuid(), invite_id uuid not null references public.referral_invites(id),
  context_id uuid not null unique references public.referral_contexts(id),
  referred_user_id uuid not null unique references auth.users(id) on delete restrict,
  status text not null default 'ATTRIBUTED' check(status in ('ATTRIBUTED','REFERRED_REWARD_GRANTED','QUALIFIED','INVITER_REWARD_GRANTED','REJECTED')),
  attributed_at timestamptz not null default clock_timestamp(), qualified_at timestamptz, inviter_rewarded_at timestamptz,
  qualified_report_id text unique references public.paid_report_snapshots(report_id) on delete restrict,
  referred_grant_id uuid unique references public.report_ticket_grants(id), inviter_grant_id uuid unique references public.report_ticket_grants(id),
  check((qualified_at is null)=(qualified_report_id is null)),
  check(status<>'REFERRED_REWARD_GRANTED' or referred_grant_id is not null),
  check(status<>'INVITER_REWARD_GRANTED' or (qualified_at is not null and referred_grant_id is not null and inviter_grant_id is not null and inviter_rewarded_at is not null))
);
create index referral_attributions_invite on public.referral_attributions(invite_id);
alter table public.referral_invites enable row level security;
alter table public.referral_contexts enable row level security;
alter table public.referral_attributions enable row level security;
revoke all on public.referral_invites,public.referral_contexts,public.referral_attributions from public,anon,authenticated,service_role;
grant select,insert,update on public.referral_invites,public.referral_contexts,public.referral_attributions to service_role;
grant select(created_at) on auth.users to service_role;

-- Only the server role can see this publication. TS reuses the completeness validator.
create function public.referral_publication(p_report text) returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('snapshot',s.snapshot_json,'expiresAt',s.expires_at,'publishedAt',s.published_at,'owner',l.user_id,'linkedAt',l.linked_at)
  from public.paid_report_snapshots s join public.report_account_links l using(report_id)
  where s.report_id=p_report and s.status='COMPLETED' and s.gate_version='paid-report-v1'
    and s.published_at is not null and s.expires_at>clock_timestamp() and l.revoked_at is null
    and s.snapshot_json->>'reportId'=s.report_id and s.snapshot_json->>'productType'=s.product_type
    and (exists(select 1 from public.payment_orders o join public.report_purchase_bindings b on b.order_id=o.payment_order_id
      where o.payment_order_id=s.order_id and o.report_id=s.report_id and o.status='paid' and o.deleted_at is null and b.revoked_at is null)
      or exists(select 1 from public.report_ticket_redemptions r where r.id=s.ticket_redemption_id and r.report_id=s.report_id and r.state='COMPLETED' and r.user_id=l.user_id))
$$;

create function public.book_referrals(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare i public.referral_invites%rowtype; c public.referral_contexts%rowtype; a public.referral_attributions%rowtype;
  pub jsonb; grant_result jsonb; created timestamptz; stamp timestamptz; rows jsonb;
begin
  -- Shared lock order across referral operations: account(11), context, attribution,
  -- then ONE ticket account(10). Never grant A while holding B's ticket lock.
  if p_user is not null then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,11)); end if;
  stamp:=clock_timestamp();
  if p_action='create' then
    pub:=public.referral_publication(p_data->>'reportId');
    if p_user is null or pub->>'owner' is distinct from p_user::text or pub->'snapshot' is distinct from p_data->'snapshot'
      or not exists(select 1 from public.report_share_links s where s.report_id=p_data->>'reportId' and s.token=p_data->>'shareToken' and s.revoked_at is null)
      then return jsonb_build_object('ok',false); end if;
    insert into public.referral_invites(inviter_user_id,source_report_id,token_hash)
      values(p_user,p_data->>'reportId',p_data->>'tokenHash');
    return jsonb_build_object('ok',true);
  elsif p_action in ('inspect','capture') then
    select * into i from public.referral_invites where token_hash=p_data->>'tokenHash';
    if not found or i.revoked_at is not null or i.expires_at<=stamp then return jsonb_build_object('ok',false); end if;
    pub:=public.referral_publication(i.source_report_id);
    if pub->>'owner' is distinct from i.inviter_user_id::text or not exists(select 1 from public.report_share_links s
      where s.report_id=i.source_report_id and s.token=p_data->>'shareToken' and s.revoked_at is null) then return jsonb_build_object('ok',false); end if;
    if p_action='inspect' then return jsonb_build_object('ok',true,'snapshot',pub->'snapshot'); end if;
    if p_user is not null then return jsonb_build_object('ok',false); end if;
    -- A transport context has the same ten-minute lifetime as the OAuth flow.
    -- Invite/campaign expiry remains nullable; no reward operating cap is invented.
    insert into public.referral_contexts(invite_id,secret_hash,expires_at) values(i.id,p_data->>'contextHash',stamp+interval '10 minutes');
    return jsonb_build_object('ok',true);
  elsif p_action in ('context','bind','attribute') then
    select * into c from public.referral_contexts where secret_hash=p_data->>'contextHash' for update;
    if not found or p_user is null or (c.bound_user_id is not null and c.bound_user_id<>p_user) then return jsonb_build_object('ok',false); end if;
    select * into a from public.referral_attributions where referred_user_id=p_user;
    if found then return jsonb_build_object('ok',a.context_id=c.id,'attributed',a.context_id=c.id); end if;
    if c.expires_at<=stamp then return jsonb_build_object('ok',false); end if;
    select * into i from public.referral_invites where id=c.invite_id;
    if i.inviter_user_id=p_user or i.revoked_at is not null or i.expires_at<=stamp then return jsonb_build_object('ok',false); end if;
    pub:=public.referral_publication(i.source_report_id);
    if pub->>'owner' is distinct from i.inviter_user_id::text or not exists(select 1 from public.report_share_links s where s.report_id=i.source_report_id and s.revoked_at is null) then return jsonb_build_object('ok',false); end if;
    -- Revalidate the source's complete stored packet immediately before B's grant.
    if p_action='context' then return jsonb_build_object('ok',true,'snapshot',pub->'snapshot'); end if;
    if p_action='attribute' and pub->'snapshot' is distinct from p_data->'sourceSnapshot' then return jsonb_build_object('ok',false); end if;
    select created_at into created from auth.users where id=p_user;
    if created is null or created<c.acquired_at or created>stamp
      or exists(select 1 from public.referral_contexts x where x.bound_user_id=p_user and x.id<>c.id)
      or exists(select 1 from public.account_profiles where user_id=p_user and created_at<c.acquired_at)
      or exists(select 1 from public.account_consent_events where user_id=p_user and recorded_at<c.acquired_at)
      or exists(select 1 from public.report_account_links where user_id=p_user)
      or exists(select 1 from public.report_ticket_grants where user_id=p_user)
      or exists(select 1 from public.report_ticket_redemptions where user_id=p_user)
      or exists(select 1 from public.report_purchase_bindings b join public.payment_orders o on o.payment_order_id=b.order_id where b.buyer_id=p_user and o.status='paid')
      then return jsonb_build_object('ok',false); end if;
    update public.referral_contexts set bound_user_id=p_user where id=c.id;
    if p_action='bind' then return jsonb_build_object('ok',true); end if;
    -- Required versions are server constants, not submitted client policy flags.
    if not exists(select 1 from public.account_profiles where user_id=p_user) or exists(
      select 1 from jsonb_each_text(p_data->'versions') v where not exists(
        select 1 from (select distinct on(consent_type) * from public.account_consent_events where user_id=p_user order by consent_type,id desc) e
        where e.consent_type=v.key and e.document_version=v.value and e.is_agreed and e.required))
      or not (p_data->'versions' ? 'terms' and p_data->'versions' ? 'privacy') then return jsonb_build_object('ok',false); end if;
    insert into public.referral_attributions(invite_id,context_id,referred_user_id) values(i.id,c.id,p_user) returning * into a;
    grant_result:=public.report_tickets('grant',p_user,jsonb_build_object('quantity',1,'sourceType','referral','sourceRef','referred:'||a.id,'key','referral:referred:'||a.id,'reason','REFERRAL_REFERRED'));
    if (grant_result->>'ok')::boolean is distinct from true then raise exception 'REFERRAL_GRANT_FAILED'; end if;
    update public.referral_attributions set status='REFERRED_REWARD_GRANTED',referred_grant_id=(grant_result->>'grantId')::uuid where id=a.id;
    return jsonb_build_object('ok',true,'attributed',true);
  elsif p_action='candidates' then
    -- Durable recovery needs no volatile callback: publication + account link are truth.
    select coalesce(jsonb_agg(x),'[]') into rows from (
      select s.report_id as "reportId",s.snapshot_json as snapshot
      from public.referral_attributions a0 join public.referral_invites i0 on i0.id=a0.invite_id
      join public.report_account_links l on l.user_id=a0.referred_user_id
      join public.paid_report_snapshots s using(report_id)
      where (p_user is null or a0.referred_user_id=p_user or i0.inviter_user_id=p_user)
        and a0.status='REFERRED_REWARD_GRANTED' and s.published_at>=a0.attributed_at and l.linked_at>=a0.attributed_at
        and public.referral_publication(s.report_id) is not null
      order by a0.id,s.published_at,s.report_id
    ) x;
    return jsonb_build_object('ok',true,'items',rows);
  elsif p_action='qualify' then
    pub:=public.referral_publication(p_data->>'reportId');
    if pub is null or pub->'snapshot' is distinct from p_data->'snapshot' then return jsonb_build_object('ok',false); end if;
    select * into a from public.referral_attributions where referred_user_id=(pub->>'owner')::uuid for update;
    if not found then return jsonb_build_object('ok',false); end if;
    if a.status='INVITER_REWARD_GRANTED' then return jsonb_build_object('ok',true); end if;
    if a.status<>'REFERRED_REWARD_GRANTED' or (pub->>'publishedAt')::timestamptz<a.attributed_at or (pub->>'linkedAt')::timestamptz<a.attributed_at then return jsonb_build_object('ok',false); end if;
    select * into i from public.referral_invites where id=a.invite_id;
    -- Source expiry/revocation AFTER attribution does not take away an earned referral.
    update public.referral_attributions set status='QUALIFIED',qualified_at=stamp,qualified_report_id=p_data->>'reportId' where id=a.id;
    grant_result:=public.report_tickets('grant',i.inviter_user_id,jsonb_build_object('quantity',1,'sourceType','referral','sourceRef','inviter:'||a.id,'key','referral:inviter:'||a.id,'reason','REFERRAL_INVITER'));
    if (grant_result->>'ok')::boolean is distinct from true then raise exception 'REFERRAL_GRANT_FAILED'; end if;
    update public.referral_attributions set status='INVITER_REWARD_GRANTED',inviter_rewarded_at=stamp,inviter_grant_id=(grant_result->>'grantId')::uuid where id=a.id;
    return jsonb_build_object('ok',true);
  elsif p_action='feedback' then
    return jsonb_build_object('ok',true,'referred',exists(select 1 from public.referral_attributions where referred_user_id=p_user and referred_grant_id is not null),
      'inviter',exists(select 1 from public.referral_attributions a0 join public.referral_invites i0 on i0.id=a0.invite_id where i0.inviter_user_id=p_user and a0.inviter_grant_id is not null));
  end if;
  return jsonb_build_object('ok',false);
end $$;
revoke all on function public.referral_publication(text),public.book_referrals(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.referral_publication(text),public.book_referrals(text,uuid,jsonb) to service_role;
comment on table public.referral_attributions is 'One new OAuth identity, one immutable attribution. Reward amounts live only in Phase10A ticket ledger.';
commit;
