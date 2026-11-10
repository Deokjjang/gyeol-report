-- F 후속(2026-11-10, 덕짱님 지시 「퍼널 유입 연결」): 처음 들어온 유입(utm_source·utm_campaign·utm_content)이 로그인 왕복·다음 방문 뒤에도
-- 가입·가입 이용권·무료 책·결제까지 같은 유입으로 집계되게 한다. 저장은 여전히 「날짜 × 단계 × 유입 × 횟수」뿐 — 사용자 id·IP·쿠키 식별자 없음.
--  1) funnel_daily에 유입 세부(content, utm_content) 칸을 더한다. 기존 행은 '-'.
--  2) ops_funnel: 단계 두 개 추가 — land(이 방문의 첫 화면) · free_book(가입 이용권으로 책 생성 시작, 서버가 셈). content를 받고 돌려준다.
--     report의 서버 기록에 가입 이용권 책(freeBooks)을 더한다(시험 계정 제외).
--  3) ops_gift('spend'): 원장으로 옮긴 이용권 종류(kind)를 응답에 더한다 → 서버가 「무료 책」을 셀 수 있다(옮기는 동작은 그대로).
-- 되돌리기: docs/v5/free-book/rollback/funnel_source.before-20261111101000.sql
begin;
set local lock_timeout = '5s';

do $$ begin
  if to_regclass('public.funnel_daily') is null or to_regprocedure('public.ops_funnel(text,jsonb)') is null or to_regprocedure('public.ops_gift(text,jsonb)') is null
    or to_regprocedure('public.ops_test_user(uuid)') is null then
    raise exception 'FUNNEL_SOURCE_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.s_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'FUNNEL_SOURCE_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- ── 1) 유입 세부 칸 ────────────────────────────────────────────────
alter table public.funnel_daily add column content text not null default '-';
alter table public.funnel_daily drop constraint funnel_daily_pkey;
alter table public.funnel_daily add primary key (day, step, source, campaign, content);

-- ── 2) ops_funnel ─────────────────────────────────────────────────
create or replace function public.ops_funnel(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare v_step text; v_src text; v_cmp text; v_cnt text; v_today date := (now() at time zone 'Asia/Seoul')::date; v_days integer; v_from date; v_from_ts timestamptz; v_today_ts timestamptz;
begin
  if p_action='hit' then
    v_step := coalesce(p_data->>'step','');
    if not v_step = any(array['land','free_view','home_view','product_view','input_start','input_done','pay_click','pay_open','ticket_click',
      'login_new','login_member','signup_grant','free_book','book_start','book_published','paid']) then return jsonb_build_object('ok',false,'code','STEP'); end if;
    v_src := lower(coalesce(p_data->>'source','')); if v_src !~ '^[a-z0-9_-]{1,40}$' then v_src := '-'; end if;
    v_cmp := lower(coalesce(p_data->>'campaign','')); if v_cmp !~ '^[a-z0-9_-]{1,64}$' then v_cmp := '-'; end if;
    v_cnt := lower(coalesce(p_data->>'content','')); if v_cnt !~ '^[a-z0-9_-]{1,64}$' then v_cnt := '-'; end if;
    -- 하루 3,000칸이 넘으면 새 유입 조합은 'other'로 모은다(아무 값이나 보내 표를 키우는 것을 막는다).
    if not exists(select 1 from public.funnel_daily f where f.day=v_today and f.step=v_step and f.source=v_src and f.campaign=v_cmp and f.content=v_cnt)
      and (select count(*) from public.funnel_daily f where f.day=v_today) >= 3000 then v_src := 'other'; v_cmp := 'other'; v_cnt := 'other'; end if;
    insert into public.funnel_daily(day,step,source,campaign,content,n) values(v_today,v_step,v_src,v_cmp,v_cnt,1)
      on conflict (day,step,source,campaign,content) do update set n=public.funnel_daily.n+1;
    return jsonb_build_object('ok',true);
  elsif p_action='report' then
    v_days := least(greatest(coalesce(nullif(p_data->>'days','')::integer,7),1),31);
    v_from := v_today - (v_days - 1);
    v_from_ts := v_from::timestamp at time zone 'Asia/Seoul'; v_today_ts := v_today::timestamp at time zone 'Asia/Seoul';
    return jsonb_build_object('ok',true,'today',v_today,'from',v_from,
      'rows',(select coalesce(jsonb_agg(jsonb_build_object('day',f.day,'step',f.step,'source',f.source,'campaign',f.campaign,'content',f.content,'n',f.n) order by f.day,f.step),'[]'::jsonb)
        from public.funnel_daily f where f.day>=v_from),
      'server',(select jsonb_build_object(
        'ordersToday',count(*) filter (where po.created_at>=v_today_ts),'orders',count(*),
        'paidToday',count(*) filter (where po.status in ('paid','refunded') and po.paid_at>=v_today_ts),'paid',count(*) filter (where po.status in ('paid','refunded') and po.paid_at>=v_from_ts))
        from public.payment_orders po where po.created_at>=v_from_ts and po.deleted_at is null and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))
        || (select jsonb_build_object('signupsToday',count(*) filter (where c0.completed_at>=v_today_ts),'signups',count(*))
          from public.account_contacts c0 join public.account_profiles p0 on p0.user_id=c0.user_id
          where c0.completed_at>=v_from_ts and p0.created_at>=v_from_ts and not public.ops_test_user(c0.user_id))
        || (select jsonb_build_object('grantsToday',count(*) filter (where g.created_at>=v_today_ts),'grants',count(*))
          from public.gift_rewards g where g.kind='signup' and g.created_at>=v_from_ts and not public.ops_test_user(g.owner_user_id))
        || (select jsonb_build_object('freeBooksToday',count(*) filter (where r1.created_at>=v_today_ts),'freeBooks',count(*))
          from public.report_ticket_redemptions r1
          join public.report_ticket_grants tg1 on tg1.id=r1.grant_id and tg1.source_type='promotion' and tg1.source_ref like 'gift-self:%'
          join public.gift_rewards g1 on g1.id::text=substr(tg1.source_ref,11) and g1.kind='signup'
          where r1.created_at>=v_from_ts and not public.ops_test_user(r1.user_id))
        || (select jsonb_build_object('publishedToday',count(*) filter (where s0.published_at>=v_today_ts),'published',count(*))
          from public.paid_report_snapshots s0 left join public.report_ticket_redemptions r0 on r0.id=s0.ticket_redemption_id
          where s0.published_at>=v_from_ts and not public.ops_test_user(coalesce(r0.user_id, public.ops_order_user(s0.order_id)))));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;
revoke all on function public.ops_funnel(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_funnel(text,jsonb) to service_role;

-- ── 3) ops_gift('spend'): 옮긴 이용권 종류를 응답에 ─────────────────
select pg_temp.s_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$return jsonb_build_object('ok',true,'moved',true);$p$,
  $p$return jsonb_build_object('ok',true,'moved',true,'kind',w.kind);$p$);

commit;
