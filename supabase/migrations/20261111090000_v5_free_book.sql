-- v5 F(2026-11-11, 덕짱님 지시·운영 적용 승인): 가입하면 내 책 한 권 무료 — 신규 가입 이용권 + 멈춤 장치 + 퍼널 익명 집계.
--  1) 새 이용권 종류 gift_rewards.kind='signup'(계정당 1장, 선물·양도 불가, 받은 시각 + 7일, 출시 4종). 기존 행은 바꾸지 않는다.
--  2) 가입 이용권 지급 기록 signup_grant_hashes: 로그인 제공자 + 제공자 사용자 id의 HMAC(서버가 만든 64자 hex)만. 원문 id·이메일·계정 id 없음.
--     탈퇴 후 다시 가입해도(새 계정 id) 같은 해시면 주지 않는다.
--  3) 운영 설정값 ops_settings 'signup_grant' = {"on":true}(기본 켜짐). 꺼짐이면 지급·팝업 없음(처리 봇 [지급 멈춤]·[다시 켜기]).
--  4) 퍼널 익명 집계 funnel_daily: 날짜(KST) × 단계 × 유입(utm_source, utm_campaign) × 횟수만. 사용자 id·IP·쿠키 식별자 없음.
--  5) 처리 봇 경보 두 종류(ops_notifications.kind): signup_surge(최근 60분 신규 가입 20건 이상), api_credit(작가 호출 잔액·결제 문제). 둘 다 1시간 1번.
--  6) ops_gift 앵커 패치(운영 본문에서 앵커 수 확인 후): 선물 링크(link_next·link)에서 가입 이용권 제외·거절, 지갑의 선물 가능 장수·기한에서 제외,
--     원장으로 옮길 때 이유 SIGNUP_FREE(기존 1+1·보상은 EVENT_PAYMENT_GIFT 그대로).
--  7) ops_notify('event_stats')(매출 봇 /event): 시험 계정(ops_test_user) 이용권을 뺀다.
-- 기간(시작·끝)은 SQL에 없다 — 서버(src/lib/ops/config.ts signupCampaignConfig: 시작 = 이번 배포 시각, 끝 = 1+1 끝)가 넘긴다.
-- 되돌리기: docs/v5/free-book/rollback/ (적용 전 운영 본문 + 되돌리기 SQL).
begin;
set local lock_timeout = '5s';

do $$ begin
  if to_regclass('public.gift_rewards') is null or to_regclass('public.ops_settings') is null or to_regclass('public.ops_notifications') is null
    or to_regclass('public.account_contacts') is null or to_regclass('public.account_profiles') is null or to_regclass('public.book_generation_runs') is null
    or to_regprocedure('public.ops_gift(text,jsonb)') is null or to_regprocedure('public.ops_notify(text,jsonb)') is null
    or to_regprocedure('public.ops_notify_enqueue(text,text,text,jsonb)') is null or to_regprocedure('public.ops_test_user(uuid)') is null
    or to_regprocedure('public.ops_order_user(text)') is null then
    raise exception 'FREE_BOOK_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.f_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'FREE_BOOK_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- ── 1) 새 이용권 종류 ─────────────────────────────────────────────
alter table public.gift_rewards drop constraint gift_rewards_kind_check;
alter table public.gift_rewards add constraint gift_rewards_kind_check check(kind in ('event','comp','signup'));
alter table public.gift_rewards drop constraint gift_rewards_source_kind_check;
alter table public.gift_rewards add constraint gift_rewards_source_kind_check check(kind in ('comp','signup') or source_order_id is not null);
-- 가입 이용권은 선물 링크·받은 사람이 생길 수 없다(서버 함수가 막고, 표가 한 번 더 막는다).
alter table public.gift_rewards add constraint gift_rewards_signup_not_giftable check(kind<>'signup' or (not gift_only and token_hash is null and recipient_user_id is null and status not in ('gifted','claimed')));
create unique index gift_rewards_signup_owner_key on public.gift_rewards(owner_user_id) where kind='signup';

-- ── 2) 가입 이용권 지급 기록(해시만) ─────────────────────────────
create table public.signup_grant_hashes(
  hash text primary key check(hash ~ '^[a-f0-9]{64}$'),
  granted_at timestamptz not null default now()
);
alter table public.signup_grant_hashes enable row level security;
revoke all on table public.signup_grant_hashes from public,anon,authenticated;
grant select,insert on table public.signup_grant_hashes to service_role;

-- ── 3) 운영 설정값(기본 켜짐) ─────────────────────────────────────
insert into public.ops_settings(key,value) values('signup_grant',jsonb_build_object('on',true)) on conflict (key) do nothing;

-- ── 4) 퍼널 익명 집계 ─────────────────────────────────────────────
create table public.funnel_daily(
  day date not null,
  step text not null check(step ~ '^[a-z_]{2,24}$'),
  source text not null check(source ~ '^[a-z0-9_-]{1,40}$'),
  campaign text not null check(campaign ~ '^[a-z0-9_-]{1,64}$'),
  n integer not null default 0 check(n >= 0),
  primary key(day,step,source,campaign)
);
alter table public.funnel_daily enable row level security;
revoke all on table public.funnel_daily from public,anon,authenticated;
grant select,insert,update on table public.funnel_daily to service_role;

-- ── 5) 경보 종류 ─────────────────────────────────────────────────
alter table public.ops_notifications drop constraint ops_notifications_kind_check;
alter table public.ops_notifications add constraint ops_notifications_kind_check
  check(kind in ('payment','refund','request','unpublished','notify_failed','reminder','share_failed','signup_surge','api_credit'));

-- ── 가입 이용권 지급 켜짐/꺼짐(운영 설정값 쓰기는 이 키 하나만, ops_notify_put_setting과 같은 방식) ──
create function public.ops_signup_switch(p_on boolean, p_by text default null) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
  if p_on is null then return jsonb_build_object('ok',false,'code','INVALID'); end if;
  insert into public.ops_settings(key,value,updated_at) values('signup_grant',jsonb_build_object('on',p_on,'at',now(),'by',left(coalesce(nullif(p_by,''),'ops'),20)),now())
    on conflict (key) do update set value=excluded.value,updated_at=now();
  return jsonb_build_object('ok',true,'on',p_on,'at',now());
end $$;
revoke all on function public.ops_signup_switch(boolean,text) from public,anon,authenticated;
grant execute on function public.ops_signup_switch(boolean,text) to service_role;

-- ── 가입 이용권 함수 ─────────────────────────────────────────────
-- grant: 가입 완료 직후(서버 /auth/profile 첫 저장). 같은 요청이 두 번 와도 1장(계정 잠금 + 계정당 유일 색인 + 해시 잠금).
--   대상: 캠페인 기간 [start, end) 안에 가입을 마친 계정(필수 동의 account_profiles.created_at과 가입 정보 account_contacts.completed_at 모두 start 이후).
--   기존 회원(시작 전에 동의했거나 정보를 마친 계정)·이미 받은 해시·꺼짐·기간 밖이면 주지 않는다.
-- state: 그 회원의 가입 이용권(팝업·/free). pause·resume·status: 운영 설정값. stats: 처리 봇 /campaign.
-- surge_check: 1분 크론. 최근 60분 신규 가입(시험 계정 제외)이 기준 이상이고 지난 1시간에 같은 경보가 없으면 처리 봇 경보 1건.
-- credit_alert: 작가 호출이 잔액·결제 문제로 실패하면 처리 봇 경보(1시간 1번). book_kind: 이 책이 가입 이용권으로 만든 책인가(책 끝 한 줄).
create function public.ops_signup(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare
  v_user uuid := nullif(p_data->>'userId','')::uuid; w public.gift_rewards%rowtype; c public.account_contacts%rowtype;
  v_set jsonb; v_on boolean; v_start timestamptz; v_end timestamptz; v_hash text; v_profile timestamptz; v_days integer; v_products text[];
  v_day timestamptz := (date_trunc('day', now() at time zone 'Asia/Seoul')) at time zone 'Asia/Seoul'; v_n integer; v_granted integer;
begin
  select s.value into v_set from public.ops_settings s where s.key='signup_grant';
  v_on := coalesce((v_set->>'on')::boolean, true);
  if p_action='grant' then
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    v_start := nullif(p_data->>'start','')::timestamptz; v_end := nullif(p_data->>'end','')::timestamptz; v_hash := coalesce(p_data->>'providerHash','');
    v_days := coalesce(nullif(p_data->>'days','')::integer, 7);
    v_products := case when jsonb_typeof(p_data->'products')='array' then array(select jsonb_array_elements_text(p_data->'products')) end;
    if v_start is null or v_end is null or v_start>=v_end or v_hash !~ '^[a-f0-9]{64}$' or v_days not between 1 and 30
      or v_products is null or cardinality(v_products) not between 1 and 6
      or not v_products <@ array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune'] then
      return jsonb_build_object('ok',false,'code','INVALID');
    end if;
    -- 같은 계정 잠금(ops_gift와 같은 키 22) + 같은 해시 잠금.
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,22));
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_hash,24));
    select * into w from public.gift_rewards g where g.owner_user_id=v_user and g.kind='signup';
    if found then return jsonb_build_object('ok',true,'issued',false,'code','ALREADY_ISSUED','status',w.status,'expiresAt',w.expires_at); end if;
    if not v_on then return jsonb_build_object('ok',true,'issued',false,'code','PAUSED'); end if;
    if now()<v_start or now()>=v_end then return jsonb_build_object('ok',true,'issued',false,'code','NOT_IN_PERIOD'); end if;
    select * into c from public.account_contacts where user_id=v_user;
    if not found then return jsonb_build_object('ok',true,'issued',false,'code','PROFILE_REQUIRED'); end if;
    select p.created_at into v_profile from public.account_profiles p where p.user_id=v_user;
    if v_profile is null or v_profile<v_start or c.completed_at<v_start or c.completed_at>=v_end then
      return jsonb_build_object('ok',true,'issued',false,'code','EXISTING_MEMBER');
    end if;
    if exists(select 1 from public.signup_grant_hashes h where h.hash=v_hash) then return jsonb_build_object('ok',true,'issued',false,'code','ALREADY_RECEIVED'); end if;
    insert into public.signup_grant_hashes(hash) values(v_hash);
    insert into public.gift_rewards(owner_user_id,kind,gift_only,product_scopes,expires_at)
      values(v_user,'signup',false,v_products,now()+make_interval(days=>v_days)) returning * into w;
    return jsonb_build_object('ok',true,'issued',true,'status',w.status,'expiresAt',w.expires_at);
  elsif p_action='state' then
    if v_user is null then return jsonb_build_object('ok',true,'on',v_on,'mine',null); end if;
    select * into w from public.gift_rewards g where g.owner_user_id=v_user and g.kind='signup';
    return jsonb_build_object('ok',true,'on',v_on,'mine',case when found then jsonb_build_object(
      'status',case when w.status='available' and w.expires_at<=now() then 'expired' else w.status end,'expiresAt',w.expires_at) end);
  elsif p_action='status' then
    return jsonb_build_object('ok',true,'on',v_on,'at',v_set->>'at');
  elsif p_action in ('pause','resume') then
    return public.ops_signup_switch(p_action='resume', p_data->>'by');
  elsif p_action='stats' then
    v_start := nullif(p_data->>'start','')::timestamptz;
    if v_start is null then return jsonb_build_object('ok',false,'code','INVALID'); end if;
    return (with signups as (
        select c0.completed_at from public.account_contacts c0 join public.account_profiles p0 on p0.user_id=c0.user_id
        where c0.completed_at>=v_start and p0.created_at>=v_start and not public.ops_test_user(c0.user_id)
      ), gifts as (
        select g.id, g.status, g.expires_at, g.created_at from public.gift_rewards g where g.kind='signup' and not public.ops_test_user(g.owner_user_id)
      ), books as (
        select r.report_id, s.published_at from gifts g
          join public.report_ticket_grants tg on tg.source_type='promotion' and tg.source_ref='gift-self:'||g.id::text
          join public.report_ticket_redemptions r on r.grant_id=tg.id
          left join public.paid_report_snapshots s on s.report_id=r.report_id
      ), cost as (
        -- 권당 실측 생성비: 최근 30일 v5 작가 실행 비용을 책마다 더한 평균(비용 기록이 있는 책만).
        select avg(t.c) avg_usd, count(*) n from (select r0.report_id, sum(r0.cost_usd) c from public.book_generation_runs r0
          where r0.created_at>now()-interval '30 days' and r0.cost_usd>0 group by r0.report_id) t
      )
      select jsonb_build_object('ok',true,'on',v_on,'at',v_set->>'at',
        'signupsToday',(select count(*) from signups where completed_at>=v_day),'signups',(select count(*) from signups),
        'grantedToday',(select count(*) from gifts where created_at>=v_day),'granted',(select count(*) from gifts),
        'used',(select count(*) from gifts where status='used_self'),
        'available',(select count(*) from gifts where status='available' and expires_at>now()),
        'expired',(select count(*) from gifts where status='expired' or (status='available' and expires_at<=now())),
        'booksStarted',(select count(*) from books),'booksPublished',(select count(*) from books where published_at is not null),
        'avgCostUsd',(select round(avg_usd::numeric,4) from cost),'costSample',(select n from cost)));
  elsif p_action='surge_check' then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signup_surge',25));
    select count(*) into v_n from public.account_contacts c0 where c0.completed_at>now()-interval '60 minutes' and not public.ops_test_user(c0.user_id);
    if v_n < greatest(coalesce(nullif(p_data->>'threshold','')::integer,20),1) then return jsonb_build_object('ok',true,'count',v_n,'alerted',false); end if;
    if exists(select 1 from public.ops_notifications n where n.kind='signup_surge' and n.created_at>now()-interval '1 hour') then
      return jsonb_build_object('ok',true,'count',v_n,'alerted',false,'code','RECENT');
    end if;
    select count(*) into v_granted from public.gift_rewards g where g.kind='signup' and g.created_at>=v_day and not public.ops_test_user(g.owner_user_id);
    perform public.ops_notify_enqueue('signup_surge','ops','surge:'||to_char(now() at time zone 'Asia/Seoul','YYYYMMDDHH24MISS'),
      jsonb_build_object('count',v_n,'grantedToday',v_granted,'on',v_on));
    return jsonb_build_object('ok',true,'count',v_n,'alerted',true);
  elsif p_action='credit_alert' then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('api_credit',25));
    if exists(select 1 from public.ops_notifications n where n.kind='api_credit' and n.created_at>now()-interval '1 hour') then
      return jsonb_build_object('ok',true,'alerted',false,'code','RECENT');
    end if;
    perform public.ops_notify_enqueue('api_credit','ops','credit:'||to_char(now() at time zone 'Asia/Seoul','YYYYMMDDHH24MISS'),
      jsonb_build_object('code',left(regexp_replace(coalesce(p_data->>'code',''),'[^A-Za-z0-9_:-]','','g'),40)));
    return jsonb_build_object('ok',true,'alerted',true);
  elsif p_action='book_kind' then
    return jsonb_build_object('ok',true,'signup',exists(select 1 from public.paid_report_snapshots s
      join public.report_ticket_redemptions r on r.id=s.ticket_redemption_id
      join public.report_ticket_grants tg on tg.id=r.grant_id and tg.source_type='promotion' and tg.source_ref like 'gift-self:%'
      join public.gift_rewards g on g.id::text=substr(tg.source_ref,11) and g.kind='signup'
      where s.report_id=p_data->>'reportId'));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- ── 퍼널 집계 함수 ───────────────────────────────────────────────
-- hit: 서버 /api/funnel이 부른다(브라우저 세션 저장소로 단계마다 1번만 보낸다). 단계는 아래 목록만, 유입 값은 소문자·숫자·_·-만(아니면 '-').
--   하루 행이 3,000개를 넘으면 새 유입 조합은 'other'로 모은다(아무 값이나 보내 표를 키우는 것을 막는다).
-- report: 매출 봇 /funnel. 최근 N일(KST) 행 + 서버 기록(주문 생성·결제 완료·신규 가입·가입 이용권 지급·책 발행, 시험 계정 제외).
create function public.ops_funnel(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare v_step text; v_src text; v_cmp text; v_today date := (now() at time zone 'Asia/Seoul')::date; v_days integer; v_from date; v_from_ts timestamptz; v_today_ts timestamptz;
begin
  if p_action='hit' then
    v_step := coalesce(p_data->>'step','');
    if not v_step = any(array['free_view','home_view','product_view','input_start','input_done','pay_click','pay_open','ticket_click',
      'login_new','login_member','signup_grant','book_start','book_published','paid']) then return jsonb_build_object('ok',false,'code','STEP'); end if;
    v_src := lower(coalesce(p_data->>'source','')); if v_src !~ '^[a-z0-9_-]{1,40}$' then v_src := '-'; end if;
    v_cmp := lower(coalesce(p_data->>'campaign','')); if v_cmp !~ '^[a-z0-9_-]{1,64}$' then v_cmp := '-'; end if;
    if not exists(select 1 from public.funnel_daily f where f.day=v_today and f.step=v_step and f.source=v_src and f.campaign=v_cmp)
      and (select count(*) from public.funnel_daily f where f.day=v_today) >= 3000 then v_src := 'other'; v_cmp := 'other'; end if;
    insert into public.funnel_daily(day,step,source,campaign,n) values(v_today,v_step,v_src,v_cmp,1)
      on conflict (day,step,source,campaign) do update set n=public.funnel_daily.n+1;
    return jsonb_build_object('ok',true);
  elsif p_action='report' then
    v_days := least(greatest(coalesce(nullif(p_data->>'days','')::integer,7),1),31);
    v_from := v_today - (v_days - 1);
    v_from_ts := v_from::timestamp at time zone 'Asia/Seoul'; v_today_ts := v_today::timestamp at time zone 'Asia/Seoul';
    return jsonb_build_object('ok',true,'today',v_today,'from',v_from,
      'rows',(select coalesce(jsonb_agg(jsonb_build_object('day',f.day,'step',f.step,'source',f.source,'campaign',f.campaign,'n',f.n) order by f.day,f.step),'[]'::jsonb)
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
        || (select jsonb_build_object('publishedToday',count(*) filter (where s0.published_at>=v_today_ts),'published',count(*))
          from public.paid_report_snapshots s0 left join public.report_ticket_redemptions r0 on r0.id=s0.ticket_redemption_id
          where s0.published_at>=v_from_ts and not public.ops_test_user(coalesce(r0.user_id, public.ops_order_user(s0.order_id)))));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

revoke all on function public.ops_signup(text,jsonb), public.ops_funnel(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_signup(text,jsonb), public.ops_funnel(text,jsonb) to service_role;

-- ── 6) ops_gift: 가입 이용권은 선물·양도 불가 ────────────────────────
-- 선물하기 창(link_next): 남은 이용권 중 가입 이용권은 고르지 않는다(가입 이용권만 있으면 NO_GIFTABLE).
select pg_temp.f_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$select * into w from public.gift_rewards where owner_user_id=v_user and status='available' and expires_at>now() order by expires_at, created_at, id limit 1 for update;$p$,
  $p$select * into w from public.gift_rewards where owner_user_id=v_user and status='available' and kind<>'signup' and expires_at>now() order by expires_at, created_at, id limit 1 for update;$p$);
-- 예전 선물 링크(link, 장 지정): 가입 이용권이면 거절.
select pg_temp.f_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$    -- 링크는 다시 만들 수 있다(이전 링크는 무효). 받기 전까지만.$p$,
  $p$    -- F: 가입 이용권은 선물·양도할 수 없다.
    if w.kind='signup' then return jsonb_build_object('ok',false,'code','GIFT_NOT_GIFTABLE'); end if;
    -- 링크는 다시 만들 수 있다(이전 링크는 무효). 받기 전까지만.$p$);
-- 지갑: 선물 가능 장수·기한은 가입 이용권을 뺀다(서재 [이용권 선물하기] 버튼·선물하기 창 기한). 전체 장수·가장 빠른 기한은 그대로 센다.
select pg_temp.f_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$'ok',true,'ledger',n,'giftable',g_avail,$p$,
  $p$'ok',true,'ledger',n,'giftable',(select count(*)::integer from public.gift_rewards s0 where s0.owner_user_id=v_user and s0.status='available' and s0.kind<>'signup'),
    'giftExpiresAt',(select min(s0.expires_at) from public.gift_rewards s0 where s0.owner_user_id=v_user and s0.status='available' and s0.kind<>'signup'),$p$);
-- 원장으로 옮길 때 이유: 가입 이용권은 SIGNUP_FREE(use_self·spend 두 곳).
select pg_temp.f_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$'reason','EVENT_PAYMENT_GIFT',$p$,
  $p$'reason',case when w.kind='signup' then 'SIGNUP_FREE' else 'EVENT_PAYMENT_GIFT' end,$p$, 2);

-- ── 7) 매출 봇 /event: 시험 계정 제외 ─────────────────────────────
select pg_temp.f_patch('public.ops_notify(text,jsonb)'::regprocedure,
  $p$from public.gift_rewards gr where gr.kind='event')$p$,
  $p$from public.gift_rewards gr where gr.kind='event' and not public.ops_test_user(gr.owner_user_id))$p$);

commit;
