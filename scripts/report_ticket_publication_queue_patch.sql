-- COMMERCE-02. PREPARED ONLY: apply once after COMMERCE-01 in a reviewed release.
-- Existing inline/dev redemption, ledger, bundle refund hold and paid jobs stay intact.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.report_tickets(text,uuid,jsonb)') is null
    or to_regprocedure('public.ticket_bundle_commerce(text,uuid,jsonb)') is null
    or to_regprocedure('public.book_share_publication(text,uuid)') is null then
    raise exception 'TICKET_QUEUE_PREREQUISITES_MISSING';
  end if;
end $$;
alter table public.report_ticket_redemptions drop constraint report_ticket_redemptions_state_check;
alter table public.report_ticket_redemptions add constraint report_ticket_redemptions_state_check check(state in ('QUEUED','RUNNING','COMPLETED','REVERSED'));
alter table public.report_ticket_redemptions add column publication_mode text not null default 'inline-v1' check(publication_mode in ('inline-v1','queue-v1'));
alter table public.report_ticket_redemptions add column policy_at timestamptz;
alter table public.report_ticket_redemptions add constraint ticket_queue_policy_required check(publication_mode<>'queue-v1' or policy_at is not null);
create index report_ticket_queue_pending on public.report_ticket_redemptions(created_at,id) where publication_mode='queue-v1' and state in ('QUEUED','RUNNING');

create function public.report_ticket_publication(p_action text,p_user uuid default null,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare candidate record; r public.report_ticket_redemptions%rowtype; result jsonb; stamp timestamptz;
begin
  if p_action='claim' then
    -- Never lock a queue row before its account. A competing summary/grant/redeem
    -- holds this same account lock first. SKIP LOCKED + try-lock avoids deadlocks.
    for candidate in select id,user_id from public.report_ticket_redemptions
      where publication_mode='queue-v1' and (state='QUEUED' or (state='RUNNING' and lease_until<=clock_timestamp()))
      order by created_at,id limit 32 loop
      if not pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended(candidate.user_id::text,10)) then continue; end if;
      select * into r from public.report_ticket_redemptions where id=candidate.id
        and (state='QUEUED' or (state='RUNNING' and lease_until<=clock_timestamp())) for update skip locked;
      if not found then continue; end if;
      if r.state='RUNNING' then
        -- Existing reconciliation reverses only unpublished expired leases.
        perform public.report_tickets('reconcile',r.user_id,'{}');
        continue;
      end if;
      update public.report_ticket_redemptions set state='RUNNING',lease_token=gen_random_uuid(),lease_until=clock_timestamp()+interval '10 minutes'
        where id=r.id returning * into r;
      return jsonb_build_object('ok',true,'state','RUNNING','redemptionId',r.id,'userId',r.user_id,'token',r.lease_token,
        'reportId',r.report_id,'productType',r.product_type,'input',r.input_json,'policyAt',r.policy_at,'createdAt',r.policy_at);
    end loop;
    return jsonb_build_object('ok',true,'empty',true);
  end if;
  if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  if p_action='enqueue' then
    if jsonb_typeof(p_data->'consentEvidence') is distinct from 'object' or (p_data->'consentEvidence'->>'version') is distinct from 'checkout-consent-v1'
      or nullif(p_data->>'policyAt','') is null then return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED'); end if;
    -- Reuse canonical FEFO + immutable REDEEM, with no alternate-lot bypass.
    -- A failure (including COMMERCE-01 refund hold) rolls the entire reservation back.
    result:=public.report_tickets('redeem',p_user,p_data);
    if not coalesce((result->>'ok')::boolean,false) then return result; end if;
    if (result->>'fresh')::boolean then
      update public.report_ticket_redemptions set state='QUEUED',publication_mode='queue-v1',policy_at=(p_data->>'policyAt')::timestamptz
        where id=(result->>'redemptionId')::uuid;
    end if;
    return public.report_ticket_publication('status',p_user,jsonb_build_object('requestId',p_data->>'requestId'));
  elsif p_action in ('status','publish','reverse') then
    select * into r from public.report_ticket_redemptions where user_id=p_user and publication_mode='queue-v1'
      and (case when p_data ? 'redemptionId' then id=(p_data->>'redemptionId')::uuid else request_id=p_data->>'requestId' end) for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    if r.state='RUNNING' and r.lease_until<=clock_timestamp() then
      perform public.report_tickets('reconcile',p_user,'{}');
      select * into r from public.report_ticket_redemptions where id=r.id;
    end if;
    if p_action='status' then
      return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id,'redemptionId',r.id);
    end if;
    -- Idempotent terminal responses never write a second ledger event.
    if r.state in ('COMPLETED','REVERSED') then return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id); end if;
    stamp:=clock_timestamp();
    if r.state<>'RUNNING' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    if p_action='publish' and (p_data->'snapshot'->>'productVersion') is distinct from 'v4' then
      return jsonb_build_object('ok',false,'code','PUBLISH_REJECTED');
    end if;
    -- Existing publish atomically seals the snapshot, owner link, 90-day window
    -- and COMPLETED. Existing reverse returns +1 to precisely the original lot.
    return public.report_tickets(p_action,p_user,p_data);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
exception when raise_exception then
  if sqlerrm='TICKET_LOT_REFUND_HOLD' then return jsonb_build_object('ok',false,'code','REFUND_HOLD'); end if;
  raise;
end $$;
revoke all on function public.report_ticket_publication(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.report_ticket_publication(text,uuid,jsonb) to service_role;
commit;
