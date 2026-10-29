-- P3 v5 작가 작업(장 단위 저장 + 회수). 로컬 개발 DB 전용 — 운영 적용은 승인 후.
-- 전제: scripts/report_ticket_publication_queue_patch.sql(COMMERCE-02) 적용 후.
-- 플래그(WRITER_V5_PRODUCTS)가 비어 있으면 claim이 v5Products를 보내지 않아 기존 동작과 같다(lease 10분, v4 발행만).
-- v5 작업: state는 그대로 RUNNING(기존 정산·환불 집계가 그대로 본다).
--   writer_lease_until = claim + 15분(작가 lease, 워커 maxDuration 800초보다 김)
--   lease_until        = claim + 25분(정산 기한: 이 시각이 지나면 기존 reconcile이 환불)
--   작가 lease가 끝나면 'recover'가 토큰을 바꿔 이어받는다(저장된 장 + 결정론 작가). 이전 토큰의 저장·발행은 STALE_LEASE.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.report_ticket_publication(text,uuid,jsonb)') is null then raise exception 'TICKET_QUEUE_PREREQUISITE_MISSING'; end if;
end $$;

alter table public.report_ticket_redemptions add column writer_version text check(writer_version in ('v5'));
alter table public.report_ticket_redemptions add column writer_lease_until timestamptz;
alter table public.report_ticket_redemptions add column recovery_count integer not null default 0 check(recovery_count between 0 and 10);
alter table public.report_ticket_redemptions add constraint ticket_writer_lease_required check(writer_version is null or writer_lease_until is not null);
create index report_writer_recovery_pending on public.report_ticket_redemptions(writer_lease_until,id)
  where publication_mode='queue-v1' and state='RUNNING' and writer_version='v5';

create table public.report_writer_chapters(
  redemption_id uuid not null references public.report_ticket_redemptions(id) on delete cascade,
  chapter_n integer not null check(chapter_n between 1 and 64),
  source text not null check(source in ('writer','continuation')),
  chapter jsonb not null check(jsonb_typeof(chapter)='object'),
  created_at timestamptz not null default now(),
  primary key(redemption_id,chapter_n)
);
alter table public.report_writer_chapters enable row level security;
revoke all on table public.report_writer_chapters from public,anon,authenticated;
grant select,insert,delete on table public.report_writer_chapters to service_role;

create or replace function public.report_ticket_publication(p_action text,p_user uuid default null,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare candidate record; r public.report_ticket_redemptions%rowtype; result jsonb; stamp timestamptz; v5 boolean; chapters jsonb;
begin
  if p_action='claim' then
    for candidate in select id,user_id from public.report_ticket_redemptions
      where publication_mode='queue-v1' and (state='QUEUED' or (state='RUNNING' and lease_until<=clock_timestamp()))
      order by created_at,id limit 32 loop
      if not pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended(candidate.user_id::text,10)) then continue; end if;
      select * into r from public.report_ticket_redemptions where id=candidate.id
        and (state='QUEUED' or (state='RUNNING' and lease_until<=clock_timestamp())) for update skip locked;
      if not found then continue; end if;
      if r.state='RUNNING' then
        perform public.report_tickets('reconcile',r.user_id,'{}');
        continue;
      end if;
      v5 := coalesce(jsonb_typeof(p_data->'v5Products')='array' and (p_data->'v5Products') ? r.product_type, false);
      if v5 then
        update public.report_ticket_redemptions set state='RUNNING',lease_token=gen_random_uuid(),writer_version='v5',
          writer_lease_until=clock_timestamp()+interval '15 minutes',lease_until=clock_timestamp()+interval '25 minutes'
          where id=r.id returning * into r;
      else
        update public.report_ticket_redemptions set state='RUNNING',lease_token=gen_random_uuid(),lease_until=clock_timestamp()+interval '10 minutes'
          where id=r.id returning * into r;
      end if;
      return jsonb_build_object('ok',true,'state','RUNNING','redemptionId',r.id,'userId',r.user_id,'token',r.lease_token,
        'reportId',r.report_id,'productType',r.product_type,'input',r.input_json,'policyAt',r.policy_at,'createdAt',r.policy_at,
        'writerVersion',r.writer_version,'writerLeaseUntil',r.writer_lease_until);
    end loop;
    return jsonb_build_object('ok',true,'empty',true);
  end if;
  if p_action='recover' then
    -- 작가 lease가 끝났고 정산 기한 전인 v5 작업만. 같은 작업을 두 회수자가 잡지 못한다(SKIP LOCKED + 토큰 교체).
    for candidate in select id,user_id from public.report_ticket_redemptions
      where publication_mode='queue-v1' and state='RUNNING' and writer_version='v5' and writer_lease_until<=clock_timestamp()
        and lease_until>clock_timestamp()+interval '1 minute' and recovery_count<3
      order by writer_lease_until,id limit 32 loop
      if not pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended(candidate.user_id::text,10)) then continue; end if;
      select * into r from public.report_ticket_redemptions where id=candidate.id and state='RUNNING' and writer_version='v5'
        and writer_lease_until<=clock_timestamp() for update skip locked;
      if not found then continue; end if;
      update public.report_ticket_redemptions set lease_token=gen_random_uuid(),recovery_count=recovery_count+1,
        writer_lease_until=clock_timestamp()+interval '5 minutes',lease_until=greatest(lease_until,clock_timestamp()+interval '10 minutes')
        where id=r.id returning * into r;
      return jsonb_build_object('ok',true,'state','RUNNING','recover',true,'redemptionId',r.id,'userId',r.user_id,'token',r.lease_token,
        'reportId',r.report_id,'productType',r.product_type,'input',r.input_json,'policyAt',r.policy_at,'createdAt',r.policy_at,
        'writerVersion',r.writer_version,'writerLeaseUntil',r.writer_lease_until,'recoveryCount',r.recovery_count);
    end loop;
    return jsonb_build_object('ok',true,'empty',true);
  end if;
  if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  if p_action='enqueue' then
    if jsonb_typeof(p_data->'consentEvidence') is distinct from 'object' or (p_data->'consentEvidence'->>'version') is distinct from 'checkout-consent-v1'
      or nullif(p_data->>'policyAt','') is null then return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED'); end if;
    result:=public.report_tickets('redeem',p_user,p_data);
    if not coalesce((result->>'ok')::boolean,false) then return result; end if;
    if (result->>'fresh')::boolean then
      update public.report_ticket_redemptions set state='QUEUED',publication_mode='queue-v1',policy_at=(p_data->>'policyAt')::timestamptz
        where id=(result->>'redemptionId')::uuid;
    end if;
    return public.report_ticket_publication('status',p_user,jsonb_build_object('requestId',p_data->>'requestId'));
  elsif p_action in ('save-chapter','chapters') then
    -- 현재 토큰을 가진 v5 작업만 장을 저장·조회한다. 저장은 작가 lease 안에서만.
    select * into r from public.report_ticket_redemptions where user_id=p_user and publication_mode='queue-v1' and id=(p_data->>'redemptionId')::uuid for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    stamp:=clock_timestamp();
    if r.state<>'RUNNING' or r.writer_version is distinct from 'v5' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp
      or (p_action='save-chapter' and r.writer_lease_until<=stamp) then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    if p_action='save-chapter' then
      if jsonb_typeof(p_data->'chapter') is distinct from 'object' or (p_data->>'source') not in ('writer','continuation') then return jsonb_build_object('ok',false,'code','INVALID_CHAPTER'); end if;
      insert into public.report_writer_chapters(redemption_id,chapter_n,source,chapter) values(r.id,(p_data->>'n')::integer,p_data->>'source',p_data->'chapter')
        on conflict(redemption_id,chapter_n) do nothing;
      return jsonb_build_object('ok',true);
    end if;
    select coalesce(jsonb_agg(jsonb_build_object('n',chapter_n,'source',source,'chapter',chapter) order by chapter_n),'[]') into chapters
      from public.report_writer_chapters where redemption_id=r.id;
    return jsonb_build_object('ok',true,'chapters',chapters);
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
    if r.state in ('COMPLETED','REVERSED') then return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id); end if;
    stamp:=clock_timestamp();
    if r.state<>'RUNNING' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    if p_action='publish' and not (coalesce(p_data->'snapshot'->>'productVersion','')='v4'
      or (coalesce(p_data->'snapshot'->>'productVersion','')='v5' and r.writer_version is not distinct from 'v5')) then
      return jsonb_build_object('ok',false,'code','PUBLISH_REJECTED');
    end if;
    result:=public.report_tickets(p_action,p_user,p_data);
    -- 발행이 끝난 작업의 장 원고는 Book 스냅샷에 들어갔으니 지운다(실패면 회수를 위해 남긴다).
    if p_action='publish' and coalesce((result->>'ok')::boolean,false) then delete from public.report_writer_chapters where redemption_id=r.id; end if;
    return result;
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
exception when raise_exception then
  if sqlerrm='TICKET_LOT_REFUND_HOLD' then return jsonb_build_object('ok',false,'code','REFUND_HOLD'); end if;
  raise;
end $$;
revoke all on function public.report_ticket_publication(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.report_ticket_publication(text,uuid,jsonb) to service_role;
commit;
