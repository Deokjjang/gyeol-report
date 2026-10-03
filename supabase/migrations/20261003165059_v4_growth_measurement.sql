-- PREPARED ONLY. After 12A. No campaign seed, provider call or activation.
begin;
set local lock_timeout='5s';
-- Dispatch receipt only: financial truth remains payment_orders. At-most-once
-- browser handoff (not an assertion that an ad vendor received the event).
create table public.meta_purchase_dispatches (
  order_id text primary key references public.payment_orders(payment_order_id),
  event_id text not null unique,
  issued_at timestamptz not null default clock_timestamp()
);
alter table public.meta_purchase_dispatches enable row level security;
revoke all on public.meta_purchase_dispatches from public,anon,authenticated,service_role;
grant select,insert on public.meta_purchase_dispatches to service_role;
grant select(report_id,started_at) on public.report_generation_attempts to service_role;
-- Never replay historical V3 purchases just because an old report is reopened.
-- This is a cutover suppression receipt, NOT proof of historical Meta delivery.
insert into public.meta_purchase_dispatches(order_id,event_id)
  select payment_order_id,'purchase_'||md5('gyeol:paid-order:'||payment_order_id)
  from public.payment_orders where paid_at is not null;

create function public.claim_meta_purchase(p_report text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.payment_orders%rowtype; event_key text;
begin
  select * into o from public.payment_orders where report_id=p_report and status='paid'
    and paid_at is not null and provider_payment_id is not null and provider='toss'
    and currency='KRW' and amount>0 and deleted_at is null and refunded_at is null and canceled_at is null;
  if not found then return jsonb_build_object('ok',false); end if;
  event_key:='purchase_'||md5('gyeol:paid-order:'||o.payment_order_id);
  insert into public.meta_purchase_dispatches(order_id,event_id) values(o.payment_order_id,event_key) on conflict do nothing;
  if not found then return jsonb_build_object('ok',true,'duplicate',true); end if;
  return jsonb_build_object('ok',true,'purchase',jsonb_build_object('eventId',event_key,'productType',o.product_type,'value',o.amount,'currency',o.currency));
end $$;

-- Reuse 12A offer/window truth. Presentation does not grant or establish eligibility.
create function public.campaign_presentation_v2(p_slug text,p_user uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare result jsonb; c jsonb; granted boolean; state text; stamp timestamptz:=clock_timestamp();
begin
  result:=public.growth_campaign('presentation',null,jsonb_build_object('slug',p_slug));
  if result->>'ok' is distinct from 'true' then return result; end if;
  c:=result->'presentation';
  select exists(select 1 from public.campaign_attributions a join public.growth_campaigns g on g.id=a.campaign_id
    where a.user_id=p_user and g.public_slug=p_slug and a.benefit_granted_at is not null) into granted;
  state:=case when granted then 'BENEFIT_ALREADY_GRANTED'
    when c->>'status'='ENDED' then 'ENDED' when c->>'status'='PAUSED' then 'PAUSED'
    when c->>'status'='SCHEDULED' and not(c->>'active')::boolean then 'SCHEDULED'
    when not(c->>'active')::boolean then 'PAUSED'
    when p_user is not null and not exists(select 1 from public.campaign_attributions a join public.growth_campaigns g on g.id=a.campaign_id
      where a.user_id=p_user and g.public_slug=p_slug and a.status='CONTEXT' and a.context_expires_at>stamp)
      then 'ACTIVE_INELIGIBLE' else 'ACTIVE_ELIGIBLE' end;
  return jsonb_build_object('ok',true,'presentation',c||jsonb_build_object('state',state,'serverNow',stamp,
    'headline',c->>'message','description','사주와 MBTI로 읽는 나의 성격, 일, 사랑과 시간. 지금 궁금한 이야기를 골라보세요.',
    'eligibility',case when granted then '이미 받은 혜택은 내 서재와 결제 화면에서 확인할 수 있습니다.'
      when state='ACTIVE_ELIGIBLE' and p_user is not null then '필수 동의를 마치면 서버에서 신규가입 혜택을 확인합니다.'
      when p_user is not null then '신규가입 혜택은 기존 회원에게 지급되지 않습니다.'
      else '가입 이력과 필수 동의 후 서버에서 혜택 대상 여부를 확인합니다.' end,
    'cta',case when state='ACTIVE_ELIGIBLE' and p_user is not null then 'consent' when state='ACTIVE_ELIGIBLE' then 'capture' else 'product' end));
end $$;

-- Read-only source projection. Snapshot is INTERNAL ONLY and must pass the
-- existing full publication validator before report_published/share is emitted.
create function public.growth_measurement_facts(p_user uuid) returns jsonb
language sql stable security invoker set search_path='' as $$
with acquisition as (
  select a.user_id,g.public_slug campaign from public.new_user_acquisitions n
  join public.campaign_attributions a on a.id=n.campaign_attribution_id join public.growth_campaigns g on g.id=a.campaign_id
), facts as (
  select 'account_created' event,'account:'||u.id id,u.id actor,u.created_at stamp,null::text product,null::int value,null::jsonb snapshot
    from auth.users u where p_user is null or u.id=p_user
  union all
  select 'required_consent_completed','consent:'||e.user_id,e.user_id,min(e.recorded_at),null,null,null
    from public.account_consent_events e where e.is_agreed and e.required and e.consent_type in ('terms','privacy') and (p_user is null or e.user_id=p_user)
    group by e.user_id having count(distinct e.consent_type)=2
  union all
  select v.event,a.id::text||v.event,a.user_id,v.stamp,null,null,null from public.campaign_attributions a
    cross join lateral(values('campaign_attributed',a.attributed_at),('campaign_benefit_granted',a.benefit_granted_at)) v(event,stamp)
    where v.stamp is not null and (p_user is null or a.user_id=p_user)
  union all
  select 'payment_succeeded','gyeol:paid-order:'||o.payment_order_id,b.buyer_id,o.paid_at,o.product_type,o.amount,null
    from public.payment_orders o left join public.report_purchase_bindings b on b.order_id=o.payment_order_id
    where o.paid_at is not null and o.provider_payment_id is not null and o.currency='KRW' and o.amount>0 and (p_user is null or b.buyer_id=p_user)
  union all
  select 'ticket_redeemed','redeem:'||r.id,r.user_id,r.created_at,r.product_type,null,null
    from public.report_ticket_redemptions r where r.state<>'REVERSED' and (p_user is null or r.user_id=p_user)
  union all
  select 'publishing_started','generation:'||s.report_id,coalesce(t.user_id,b.buyer_id),coalesce(t.created_at,attempt.started),s.product_type,null,null
    from public.paid_report_snapshots s left join public.report_ticket_redemptions t on t.id=s.ticket_redemption_id
    left join public.report_purchase_bindings b on b.order_id=s.order_id
    left join lateral(select min(a.started_at) started from public.report_generation_attempts a where a.report_id=s.report_id) attempt on true
    where coalesce(t.created_at,attempt.started) is not null and (p_user is null or coalesce(t.user_id,b.buyer_id)=p_user)
  union all
  select 'report_published','publish:'||s.report_id,coalesce(t.user_id,b.buyer_id),s.published_at,s.product_type,null,s.snapshot_json
    from public.paid_report_snapshots s left join public.report_ticket_redemptions t on t.id=s.ticket_redemption_id
    left join public.report_purchase_bindings b on b.order_id=s.order_id
    where s.published_at is not null and s.gate_version='paid-report-v1' and s.status='COMPLETED'
      and (p_user is null or coalesce(t.user_id,b.buyer_id)=p_user)
  union all
  select 'share_created','share:'||s.report_id,l.user_id,min(s.created_at),p.product_type,null,p.snapshot_json
    from public.report_share_links s join public.paid_report_snapshots p using(report_id) left join public.report_account_links l using(report_id)
    where s.revoked_at is null and p.status='COMPLETED' and (p_user is null or l.user_id=p_user)
    group by s.report_id,l.user_id,p.product_type,p.snapshot_json
  union all
  select 'referral_link_created','invite:'||i.source_report_id,i.inviter_user_id,min(i.created_at),null,null,null
    from public.referral_invites i where p_user is null or i.inviter_user_id=p_user group by i.source_report_id,i.inviter_user_id
  union all
  select v.event,a.id::text||v.event,a.referred_user_id,v.stamp,null,null,null
    from public.referral_attributions a join public.referral_invites i on i.id=a.invite_id
    left join public.report_ticket_grants g on g.id=a.referred_grant_id
    cross join lateral(values('referral_attributed',a.attributed_at),('referral_referred_ticket_granted',g.granted_at),
      ('referral_qualified',a.qualified_at),('referral_inviter_ticket_granted',a.inviter_rewarded_at)) v(event,stamp)
    where v.stamp is not null and (p_user is null or a.referred_user_id=p_user or i.inviter_user_id=p_user)
)
select coalesce(jsonb_agg(jsonb_build_object('event',f.event,'eventId',case when f.event='payment_succeeded' then 'purchase_' else 'fact_' end||md5(f.id),
  'occurredAt',f.stamp,'productType',f.product,'value',f.value,'currency',case when f.value is not null then 'KRW' end,
  'campaign',a.campaign,'snapshot',f.snapshot,
  'downstreamCampaign',case when f.event like 'referral_%' then (select ac.campaign from public.referral_attributions ra join public.referral_invites ri on ri.id=ra.invite_id join acquisition ac on ac.user_id=ri.inviter_user_id where ra.referred_user_id=f.actor) end) order by f.stamp,f.event),'[]')
from facts f left join acquisition a on a.user_id=f.actor
$$;
revoke all on function public.claim_meta_purchase(text),public.campaign_presentation_v2(text,uuid),public.growth_measurement_facts(uuid) from public,anon,authenticated;
grant execute on function public.claim_meta_purchase(text),public.campaign_presentation_v2(text,uuid),public.growth_measurement_facts(uuid) to service_role;
commit;
