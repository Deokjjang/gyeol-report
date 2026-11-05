-- v5 최종3(9. 이용권·열람): 로컬 개발 DB 전용 — 운영 적용은 덕짱님 승인 후(docs/v5/final3/legal-ops-report.md).
-- 전제: 20261105091000_v5_final_comp_choice.sql 적용 후. 기존 발급 이용권·이벤트·보상 행은 바꾸지 않는다.
--  1) 이용권 유효기간: 앞으로 발급하는 보상·이벤트(1+1)·관리자 지급 이용권은 발급일로부터 30일. 선물은 처음 발급 기한을 그대로 넘긴다(기존 규칙 유지).
--  2) 열람 기간: v5부터 발행한 Book(스냅샷 productVersion='v5')은 기한 없음(expires_at='infinity') — 탈퇴·삭제 요청·서비스 종료 때만 닫힌다.
--     v5 이전 Book은 처음 발행 + 90일(2160시간) 그대로. 자동 삭제(만료 작업·원고 정리)는 expires_at<=now()로 도므로 v5 Book은 대상이 될 수 없다.
--     어느 Book이 기한 없음이 되는지는 버전 필드(productVersion)로만 정한다(날짜 경계 없음).
--  3) 서재 이용권 표시: summary에 남은 이용권 묶음(장수·만료일)을 붙인다.
-- 되돌리기: 이 파일 끝 주석(docs/v5/final3/legal-ops-report.md "되돌리기")을 따른다.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ops_comp(text,jsonb)') is null or to_regprocedure('public.ops_gift(text,jsonb)') is null
    or to_regprocedure('public.report_tickets(text,uuid,jsonb)') is null
    or not exists(select 1 from pg_constraint where conrelid='public.paid_report_snapshots'::regclass and conname='paid_report_snapshots_access_expiry_check') then
    raise exception 'FINAL3_PREREQUISITE_MISSING';
  end if;
end $$;

-- 기존 함수 본문을 한 곳씩 고치는 도우미(이 트랜잭션 안에서만 존재). 고칠 자리가 정확히 expected번 나오지 않으면 중단한다.
create function pg_temp.final3_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'FINAL3_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- 1-1. 이벤트 이용권(결제 1건마다 1장)·친구 보너스: 발급일로부터 30일을 넘지 않는다(서버 코드도 30일을 넘긴다: src/lib/ops/config.ts TICKET_VALID_DAYS).
select pg_temp.final3_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$(p_data->>'expiresAt')::timestamptz) returning * into w;$p$,
  $p$least((p_data->>'expiresAt')::timestamptz,now()+interval '30 days')) returning * into w;$p$);
select pg_temp.final3_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$'expiresAt',(p_data->>'expiresAt')::timestamptz,'productScope',w.product_scope$p$,
  $p$'expiresAt',least((p_data->>'expiresAt')::timestamptz,now()+interval '30 days'),'productScope',w.product_scope$p$);
-- 1-2. 보상 이용권(A·B): 유효일은 설정값이되 30일을 넘지 않는다(A 기본 60일 → 30일).
select pg_temp.final3_patch('public.ops_comp(text,jsonb)'::regprocedure,
  $p$exp:=now()+make_interval(days=>days);$p$,
  $p$exp:=now()+make_interval(days=>least(days,30));$p$);

-- 1-3. 기한 없이 들어온 지급(관리자 지급·캠페인 등)은 발급일로부터 30일. 구매 이용권(purchase)·환불 되돌림은 그대로.
-- 같은 key로 다시 부르면 처음 발급 기한을 그대로 넘겨 기존 멱등 비교(expires_at 포함)가 맞는다. 계정 잠금은 기존과 같은 키(10, 같은 트랜잭션에서 다시 잡아도 된다).
-- 3. summary: 남은 이용권 묶음(장수·만료일, 만료 이른 순)을 붙인다.
alter function public.report_tickets(text,uuid,jsonb) rename to report_tickets_before_final3;
create function public.report_tickets(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare r jsonb;
begin
  if p_action='grant' and p_data->>'sourceType' in ('manual','promotion','referral','welcome') and nullif(p_data->>'expiresAt','') is null then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
    p_data:=p_data||coalesce((select case when g.expires_at is null then '{}'::jsonb else jsonb_build_object('expiresAt',g.expires_at) end
        from public.report_ticket_grants g where g.user_id=p_user and g.idempotency_key=p_data->>'key'),
      jsonb_build_object('expiresAt',clock_timestamp()+interval '30 days'));
  end if;
  r:=public.report_tickets_before_final3(p_action,p_user,p_data);
  if p_action='summary' and r->>'ok'='true' then
    r:=r||jsonb_build_object('lots',(select coalesce(jsonb_agg(jsonb_build_object('quantity',x.q,'expiresAt',x.expires_at) order by x.expires_at nulls last,x.granted_at),'[]')
      from (select g.id,g.expires_at,g.granted_at,sum(l.quantity_delta)::integer q from public.report_ticket_grants g join public.report_ticket_ledger l on l.grant_id=g.id
        where g.user_id=p_user and (g.expires_at is null or g.expires_at>clock_timestamp()) group by g.id,g.expires_at,g.granted_at having sum(l.quantity_delta)>0) x));
  end if;
  return r;
end $$;
revoke all on function public.report_tickets(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.report_tickets(text,uuid,jsonb) to service_role;

-- 2-1. 열람 기한 제약: 처음 발행 + 2160시간(v5 이전) 또는 기한 없음('infinity', v5). 미발행 조건은 그대로.
alter table public.paid_report_snapshots drop constraint paid_report_snapshots_access_expiry_check;
alter table public.paid_report_snapshots add constraint paid_report_snapshots_access_expiry_check check (
  (published_at is null and expires_at is null and status<>'COMPLETED' and snapshot_json is null)
  or (published_at is not null and expires_at is not null
    and (expires_at=published_at+interval '2160 hours' or expires_at='infinity'::timestamptz))
);

-- 2-2. 이미 v5로 발행되어 열려 있는 Book(버전 필드 기준). v5 이전 판(보관본)이 있는 Book은 v5 이전 Book이라 그대로 둔다.
update public.paid_report_snapshots s set expires_at='infinity'
  where s.status='COMPLETED' and s.published_at is not null and s.expires_at>now() and s.snapshot_json->>'productVersion'='v5'
    and not exists(select 1 from public.book_snapshot_versions v where v.report_id=s.report_id and coalesce(v.snapshot_json->>'productVersion','')<>'v5');
update public.report_input_snapshots i set expires_at='infinity' from public.paid_report_snapshots s
  where s.order_id=i.order_id and s.expires_at='infinity' and i.expires_at<>'infinity';

-- 2-3. 앞으로: 처음 발행 때 스냅샷이 v5면 기한 없음. 기한 없음은 처음부터 v5로 발행된 Book만 가진다(이전 Book을 늘리지 않는다).
create function public.report_access_by_version() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.published_at is not null and new.snapshot_json->>'productVersion'='v5' and (tg_op='INSERT' or old.published_at is null) then
    new.expires_at:='infinity';
  elsif new.expires_at='infinity'::timestamptz and (tg_op='INSERT' or old.expires_at is distinct from 'infinity'::timestamptz) then
    raise exception using errcode='23514', message='REPORT_ACCESS_VERSION_REQUIRED';
  end if;
  return new;
end $$;
create trigger report_access_by_version before insert or update on public.paid_report_snapshots
  for each row execute function public.report_access_by_version();

-- 2-4. 결제 Book의 입력(출생 정보)도 Book과 같은 기한. 발행 함수가 입력 기한을 나중에 다시 쓰더라도 기한 없음을 지킨다.
create function public.report_access_sync_input() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.expires_at='infinity'::timestamptz and new.order_id is not null and (tg_op='INSERT' or old.expires_at is distinct from 'infinity'::timestamptz) then
    update public.report_input_snapshots set expires_at='infinity' where order_id=new.order_id and expires_at<>'infinity'::timestamptz;
  end if;
  return null;
end $$;
create trigger report_access_sync_input after insert or update on public.paid_report_snapshots
  for each row execute function public.report_access_sync_input();
create function public.report_input_access_by_version() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.expires_at is distinct from 'infinity'::timestamptz
    and exists(select 1 from public.paid_report_snapshots s where s.order_id=new.order_id and s.expires_at='infinity'::timestamptz) then
    new.expires_at:='infinity';
  end if;
  return new;
end $$;
create trigger report_input_access_by_version before insert or update of expires_at on public.report_input_snapshots
  for each row execute function public.report_input_access_by_version();
revoke all on function public.report_access_by_version(),public.report_access_sync_input(),public.report_input_access_by_version() from public,anon,authenticated;

notify pgrst, 'reload schema';
commit;

-- 되돌리기(운영 적용 뒤 문제가 있을 때만, 순서대로):
--  drop trigger report_input_access_by_version on public.report_input_snapshots; drop trigger report_access_sync_input on public.paid_report_snapshots;
--  drop trigger report_access_by_version on public.paid_report_snapshots; drop function public.report_input_access_by_version(), public.report_access_sync_input(), public.report_access_by_version();
--  (기한 없음이 된 v5 Book의 기한을 되돌리려면 고객 Book 변경이라 승인 필요 — published_at+2160h로 되돌린 뒤 제약을 이전 식으로 다시 건다.)
--  drop function public.report_tickets(text,uuid,jsonb); alter function public.report_tickets_before_final3(text,uuid,jsonb) rename to report_tickets; (권한 revoke/grant 다시)
--  ops_gift·ops_comp: 위 final3_patch 세 줄을 새 → 옛 문자열로 바꿔 다시 실행.
