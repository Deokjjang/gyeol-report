-- F 후속(2026-11-10, 덕짱님 지시): 「시험 계정 표」 — 관리자 권한(ADMIN_USER_IDS)과 따로, 집계·메타 전송에서만 빼는 계정 목록.
--  1) public.ops_test_accounts(user_id, note, added_at): 계정 id만 둔다(이메일은 넣을 때 auth.users에서 찾기만 하고 저장하지 않음).
--     넣고 빼는 것은 운영 SQL로만(서버·화면은 읽기만). 재배포 없이 바로 반영된다(SQL 집계는 즉시, 서버의 「시험」 브라우저 표시는 60초 안).
--  2) public.ops_test_user(uuid): 기존 설정값(ops_settings 'test_accounts' — 1분 크론이 ADMIN_USER_IDS + 누나 계정으로 맞춤) 또는 이 표에 있으면 시험 계정.
--     매출 봇 집계·/event·/campaign·/funnel 서버 기록·메타 전송(트리거·서버 전송·브라우저 거울)은 모두 이 함수를 쓰므로 함께 바뀐다.
--  3) 배포 뒤 확인값 정리: funnel_daily의 확인용 1행(source 'deploycheck', campaign 'f_deploy_check')을 지운다.
-- 되돌리기: 아래 「되돌리기」 주석의 함수 본문(20261110200000과 같은 본문)을 실행한 뒤 표를 지운다.
--   create or replace function public.ops_test_user(p_user uuid) returns boolean language sql stable security invoker set search_path='' as $$
--     select p_user is not null and coalesce((select jsonb_typeof(s.value->'ids')='array' and s.value->'ids' ? p_user::text from public.ops_settings s where s.key='test_accounts'), false);
--   $$;
--   drop table if exists public.ops_test_accounts;
begin;
set local lock_timeout = '5s';

do $$ begin
  if to_regprocedure('public.ops_test_user(uuid)') is null or to_regclass('public.ops_settings') is null then
    raise exception 'TEST_ACCOUNT_TABLE_PREREQUISITE_MISSING';
  end if;
end $$;

create table public.ops_test_accounts(
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text not null default '' check (length(note) <= 100),
  added_at timestamptz not null default now()
);
alter table public.ops_test_accounts enable row level security;
revoke all on table public.ops_test_accounts from public,anon,authenticated;
grant select on table public.ops_test_accounts to service_role;

create or replace function public.ops_test_user(p_user uuid) returns boolean
language sql stable security invoker set search_path='' as $$
  select p_user is not null and (
    coalesce((select jsonb_typeof(s.value->'ids')='array' and s.value->'ids' ? p_user::text from public.ops_settings s where s.key='test_accounts'), false)
    or exists(select 1 from public.ops_test_accounts t where t.user_id = p_user));
$$;
revoke all on function public.ops_test_user(uuid) from public,anon,authenticated;
grant execute on function public.ops_test_user(uuid) to service_role;

do $$ begin
  if to_regclass('public.funnel_daily') is not null then
    delete from public.funnel_daily where source = 'deploycheck' and campaign = 'f_deploy_check';
  end if;
end $$;

commit;
