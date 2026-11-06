-- 운영 Q 추가(공유 재발 방지, 2026-11-07): 공유 API(/api/book-share) 실패 경보.
-- 10분 안에 4xx·5xx가 3번 이상이면 처리 봇에 「🚨 공유 실패 N건」(상태 코드·책 버전만) 1건. 같은 원인(상태 코드 + 책 버전)은 1시간에 1번만.
-- 기록에는 상태 코드와 책 버전(v4·v5·unknown)만 남긴다(주문·책 id·회원·기기 없음). 하루 지난 기록은 넣을 때 지운다.
-- 더하기만 한다: 새 표 1개·새 함수 1개, 대기표 kind 허용 값에 'share_failed' 추가(기존 값 그대로). 기존 데이터·함수는 바꾸지 않는다.

alter table public.ops_notifications drop constraint ops_notifications_kind_check;
alter table public.ops_notifications add constraint ops_notifications_kind_check
  check(kind in ('payment','refund','request','unpublished','notify_failed','reminder','share_failed'));

create table public.ops_share_failures(
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  status smallint not null check(status between 400 and 599),
  version text not null check(version in ('v4','v5','unknown')));
create index ops_share_failures_at on public.ops_share_failures(at);
alter table public.ops_share_failures enable row level security;
revoke all on table public.ops_share_failures from public,anon,authenticated;
grant select,insert,delete on table public.ops_share_failures to service_role;
grant usage,select on sequence public.ops_share_failures_id_seq to service_role;

-- 공유 API가 실패 응답을 낸 뒤(응답을 보낸 다음) 서버가 부른다. 책 버전은 report_id로 DB에서 읽고(본문은 안 읽음), report_id는 남기지 않는다.
-- 경보는 대기표(ops_notifications)에 넣고, 넣으면 깨우기 트리거(ops_notify_wake)가 서버를 불러 바로 보낸다(실패하면 1분 크론).
-- 실패해도 공유 응답과 무관하다(이미 보낸 뒤). 동시에 여러 실패가 와도 경보가 겹치지 않게 잠근다.
create function public.ops_share_failure(p_status integer, p_report text default null) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare
  v_now timestamptz := now(); v_ver text; v_n integer; v_causes jsonb; v_keys text[]; v_fresh text[];
begin
  if p_status is null or p_status<400 or p_status>599 then return jsonb_build_object('ok',false,'code','STATUS'); end if;
  if p_report is not null and length(p_report) between 8 and 120 then
    select case when sn.snapshot_json->>'productVersion' in ('v4','v5') then sn.snapshot_json->>'productVersion' end into v_ver
      from public.paid_report_snapshots sn where sn.report_id=p_report;
  end if;
  perform pg_advisory_xact_lock(hashtext('ops_share_failures'));
  delete from public.ops_share_failures where at<v_now-interval '1 day';
  insert into public.ops_share_failures(status,version) values(p_status,coalesce(v_ver,'unknown'));
  select sum(c)::integer,
         jsonb_agg(jsonb_build_object('status',status,'version',version,'count',c) order by c desc,status,version),
         array_agg(status::text||':'||version order by status,version)
    into v_n,v_causes,v_keys
    from (select f.status,f.version,count(*)::integer c from public.ops_share_failures f where f.at>v_now-interval '10 minutes' group by f.status,f.version) w;
  if v_n<3 then return jsonb_build_object('ok',true,'alerted',false,'count',v_n); end if;
  -- 같은 원인은 1시간에 1번: 지난 1시간 경보에 없던 원인이 하나라도 있을 때만 보낸다.
  select coalesce(array_agg(k),'{}') into v_fresh from unnest(v_keys) k
    where not exists(select 1 from public.ops_notifications n where n.kind='share_failed' and n.created_at>v_now-interval '1 hour' and n.payload->'keys' ? k);
  if cardinality(v_fresh)=0 then return jsonb_build_object('ok',true,'alerted',false,'count',v_n); end if;
  insert into public.ops_notifications(kind,bot,dedupe_key,payload)
    values('share_failed','ops','sharefail:'||to_char(v_now at time zone 'UTC','YYYYMMDDHH24MISSUS'),
           jsonb_build_object('count',v_n,'causes',v_causes,'keys',to_jsonb(v_keys),'windowMinutes',10))
    on conflict (dedupe_key) do nothing;
  return jsonb_build_object('ok',true,'alerted',true,'count',v_n);
end $$;
revoke all on function public.ops_share_failure(integer,text) from public,anon,authenticated;
grant execute on function public.ops_share_failure(integer,text) to service_role;
