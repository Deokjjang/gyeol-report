-- 결제수단 긴급 수정과 같은 배포(2026-11-10, 덕짱님 지시): 시험 계정(관리자 ADMIN_USER_IDS + 누나 계정)의 결제를 매출 봇 집계에서 뺀다.
-- 알림은 그대로 보내고 서버가 「시험」 표시를 붙인다(주문·이용권 책 사실에 test). 기존 행은 지우거나 바꾸지 않는다.
--  1) ops_settings 'test_accounts' = {"ids":[계정 id…]}. 서버가 1분 크론마다 ADMIN_USER_IDS + 누나 계정으로 맞춘다(관리자 id는 env에만 있다).
--     처음 값은 누나 계정 하나(서버가 첫 크론에서 관리자 id를 더한다).
--  2) ops_test_user(uuid): 시험 계정인가. 매출 봇 집계와 앞으로의 퍼널 집계는 모두 이 함수로 뺀다.
--  3) 기존 함수 네 곳을 앵커로 고친다: ops_notify 'stats'(결제·환불에서 시험 계정 제외), ops_notify_order·ops_notify_ticket(test 표시),
--     ops_notify_put_setting(서버가 'test_accounts'를 쓸 수 있게 — uuid 배열 20개까지만).
-- 되돌리기: 20261107100000_v5_ops_notify.sql의 네 함수 정의를 다시 실행(이 파일 앞 본문과 같다 — 그 뒤로 고친 migration 없음).
begin;
set local lock_timeout = '5s';

do $$ begin
  if to_regclass('public.ops_settings') is null or to_regprocedure('public.ops_notify(text,jsonb)') is null or to_regprocedure('public.ops_notify_order(text)') is null
    or to_regprocedure('public.ops_notify_ticket(text)') is null or to_regprocedure('public.ops_notify_put_setting(text,jsonb)') is null or to_regprocedure('public.ops_order_user(text)') is null then
    raise exception 'TEST_ACCOUNTS_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.t_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'TEST_ACCOUNTS_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

insert into public.ops_settings(key,value) values('test_accounts',jsonb_build_object('ids',jsonb_build_array('d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55'))) on conflict (key) do nothing;

-- 시험 계정인가(계정 없는 주문 = 아니다).
create function public.ops_test_user(p_user uuid) returns boolean
language sql stable security invoker set search_path='' as $$
  select p_user is not null and coalesce((select jsonb_typeof(s.value->'ids')='array' and s.value->'ids' ? p_user::text from public.ops_settings s where s.key='test_accounts'), false);
$$;

-- 매출 봇 /today·/yesterday·/month(결제 알림의 「오늘 N건」·환불 알림의 「오늘 순매출」 포함): 시험 계정 결제·환불을 뺀다.
select pg_temp.t_patch('public.ops_notify(text,jsonb)'::regprocedure,
  $p$where po.status in ('paid','refunded') and po.paid_at>=v_start and po.paid_at<v_end)$p$,
  $p$where po.status in ('paid','refunded') and po.paid_at>=v_start and po.paid_at<v_end and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))$p$);
select pg_temp.t_patch('public.ops_notify(text,jsonb)'::regprocedure,
  $p$and po.refunded_at>=v_start and po.refunded_at<v_end)$p$,
  $p$and po.refunded_at>=v_start and po.refunded_at<v_end and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))$p$);
-- 알림 메시지의 「시험」 표시.
select pg_temp.t_patch('public.ops_notify_order(text)'::regprocedure,
  $p$'hasAccount',v_user is not null,$p$,
  $p$'hasAccount',v_user is not null,'test',public.ops_test_user(v_user),$p$);
select pg_temp.t_patch('public.ops_notify_ticket(text)'::regprocedure,
  $p$'userId',v_rr.user_id,$p$,
  $p$'userId',v_rr.user_id,'test',public.ops_test_user(v_rr.user_id),$p$);
-- 서버가 쓰는 설정에 시험 계정 목록을 더한다(uuid 문자열 배열, 20개까지).
select pg_temp.t_patch('public.ops_notify_put_setting(text,jsonb)'::regprocedure,
  $p$  elsif p_key='telegram_webhook' then$p$,
  $p$  elsif p_key='test_accounts' then
    if jsonb_typeof(p_value)<>'object' or coalesce(jsonb_typeof(p_value->'ids'),'')<>'array' or jsonb_array_length(p_value->'ids')>20 or length(p_value::text) > 1000
      or exists(select 1 from jsonb_array_elements(p_value->'ids') e where jsonb_typeof(e)<>'string' or e#>>'{}' !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') then return false; end if;
  elsif p_key='telegram_webhook' then$p$);

revoke all on function public.ops_test_user(uuid) from public,anon,authenticated;
grant execute on function public.ops_test_user(uuid) to service_role;

commit;
