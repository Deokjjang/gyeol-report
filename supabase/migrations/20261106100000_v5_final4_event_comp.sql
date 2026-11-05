-- v5 최종 A(11·12·14): 로컬 개발 DB 전용 — 운영 적용은 배포 명령에서(docs/v5/deploy-checklist.md).
-- 전제: 20261104180000_v5_p6e_ops.sql · 20261105091000_v5_final_comp_choice.sql · 20261105120000_v5_final3_tickets_reading.sql 적용 후.
-- 기존 행은 바꾸지 않는다(함수 본문 한 곳 패치 + 새 표 + 새 함수). 다시 실행해도 된다(패치는 이미 들어가 있으면 건너뛴다).
--  1) 1+1 이벤트 계정 상한(maxPerAccount)은 이벤트 이용권(kind='event')만 센다. 보상 이용권(kind='comp')이 같은 표에 있어 상한을 먹던 결함.
--  2) 보상 이용권 캠페인: 캠페인 id + 계정 기준 멱등 지급(같은 캠페인을 다시 실행해도 두 번 주지 않는다).
--     등급 A(지정 계정)·B(기준 시각 전에 가입한 계정 − A − 제외 목록). 장마다 내가 쓰기/선물 링크(이벤트 이용권과 같은 gift_rewards 행, kind='comp').
--     roster(명단만, 지급 없음) → run(명단을 다시 계산해 B 인원이 기대값과 같을 때만 한 트랜잭션으로 지급).
--  3) 팝업 읽기(popup): 안 쓴 보상 이용권이 있는 회원의 등급·장수·만료일. 지급·만료 처리 같은 부수 효과 없음.
-- 되돌리기: drop function public.ops_comp_campaign(text,jsonb); (표 comp_campaign_grants는 지급 기록이라 남긴다)
--          1)은 ops_gift 본문의 " and kind='event';"를 ";"로 되돌리는 같은 방식의 좁은 치환.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ops_gift(text,jsonb)') is null or to_regprocedure('public.ops_comp(text,jsonb)') is null or to_regclass('public.comp_grants') is null
    or to_regprocedure('public.report_tickets_before_final3(text,uuid,jsonb)') is null
    or not exists(select 1 from information_schema.columns where table_schema='public' and table_name='gift_rewards' and column_name='kind') then
    raise exception 'FINAL4_PREREQUISITE_MISSING';
  end if;
end $$;

-- 함수 본문 한 곳 고치기(이 트랜잭션 안에서만). 고칠 자리가 정확히 1번 나와야 하고, 이미 고친 본문이면 건너뛴다.
create or replace function pg_temp.final4_patch(p_sig regprocedure, p_old text, p_new text) returns void
language plpgsql as $$
declare def text; n integer; m integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  m := (length(def) - length(replace(def, p_new, ''))) / length(p_new);
  if n = 0 and m = 1 then return; end if;
  if n <> 1 then raise exception 'FINAL4_PATCH_ANCHOR % [%] found % expected 1', p_sig, left(p_old, 70), n; end if;
  execute replace(def, p_old, p_new);
end $$;

-- 1) 1+1 계정 상한: 이벤트 이용권만 센다.
select pg_temp.final4_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$select count(*) into n from public.gift_rewards where owner_user_id=x.user_id;$p$,
  $p$select count(*) into n from public.gift_rewards where owner_user_id=x.user_id and kind='event';$p$);

-- 2) 보상 캠페인 지급 기록(캠페인 id + 계정 = 한 번).
create table if not exists public.comp_campaign_grants(
  campaign_id text not null check(campaign_id ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null check(tier in ('A','B')),
  quantity integer not null check(quantity between 1 and 5),
  gift_ids uuid[] not null,
  expires_at timestamptz not null,
  granted_at timestamptz not null default now(),
  primary key(campaign_id, user_id)
);
create index if not exists comp_campaign_grants_user_idx on public.comp_campaign_grants(user_id, granted_at desc);
alter table public.comp_campaign_grants enable row level security;
revoke all on table public.comp_campaign_grants from public, anon, authenticated;
grant select, insert on table public.comp_campaign_grants to service_role;

-- 계정이 있는지(auth.users)는 service_role로도 직접 못 읽어 security definer로 둔다. 실행 권한은 service_role만.
create or replace function public.ops_comp_campaign(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  v_campaign text := p_data->>'campaignId';
  v_cutoff timestamptz;
  v_a uuid[]; v_ex uuid[];
  v_user uuid := nullif(p_data->>'userId','')::uuid;
  products jsonb := coalesce(p_data->'products','[]');
  days integer := least(coalesce((p_data->>'days')::integer, 30), 30);
  a_qty integer := coalesce((p_data->>'aQty')::integer, 2);
  b_qty integer := coalesce((p_data->>'bQty')::integer, 1);
  r record; w public.gift_rewards%rowtype; gids uuid[]; exp timestamptz; n_b integer; n_new integer := 0; n_old integer := 0; q integer; out jsonb;
begin
  if p_action in ('roster','run') then
    if v_campaign is null or v_campaign !~ '^[a-z0-9][a-z0-9-]{2,63}$' then return jsonb_build_object('ok',false,'code','CAMPAIGN_INVALID'); end if;
    begin v_cutoff := (p_data->>'cutoff')::timestamptz; exception when others then v_cutoff := null; end;
    if v_cutoff is null then return jsonb_build_object('ok',false,'code','CUTOFF_INVALID'); end if;
    v_a := array(select x::uuid from jsonb_array_elements_text(coalesce(p_data->'a','[]')) x);
    v_ex := array(select distinct x::uuid from jsonb_array_elements_text(coalesce(p_data->'exclude','[]')) x);
  end if;

  if p_action = 'roster' then
    -- 명단만(지급 없음). A: 지정 계정. B: 기준 시각 전에 가입(가입 동의 완료 = account_profiles)한 계정 − A − 제외 목록.
    return jsonb_build_object('ok', true, 'campaignId', v_campaign, 'cutoff', v_cutoff,
      'a', coalesce((select jsonb_agg(jsonb_build_object('userId', a.id, 'exists', u.id is not null, 'joinedAt', p.created_at,
          'email', coalesce(c.email, to_jsonb(u)->>'email'), 'granted', exists(select 1 from public.comp_campaign_grants g where g.campaign_id=v_campaign and g.user_id=a.id)) order by a.ord)
        from unnest(v_a) with ordinality a(id, ord) left join auth.users u on u.id=a.id left join public.account_profiles p on p.user_id=a.id left join public.account_contacts c on c.user_id=a.id), '[]'),
      'b', coalesce((select jsonb_agg(jsonb_build_object('userId', p.user_id, 'joinedAt', p.created_at, 'email', coalesce(c.email, to_jsonb(u)->>'email'),
          'granted', exists(select 1 from public.comp_campaign_grants g where g.campaign_id=v_campaign and g.user_id=p.user_id)) order by p.created_at, p.user_id)
        from public.account_profiles p join auth.users u on u.id=p.user_id left join public.account_contacts c on c.user_id=p.user_id
        where p.created_at < v_cutoff and not (p.user_id = any(v_a)) and not (p.user_id = any(v_ex))), '[]'),
      'excluded', coalesce((select jsonb_agg(jsonb_build_object('userId', p.user_id, 'joinedAt', p.created_at, 'email', coalesce(c.email, to_jsonb(u)->>'email')) order by p.created_at)
        from public.account_profiles p join auth.users u on u.id=p.user_id left join public.account_contacts c on c.user_id=p.user_id
        where p.created_at < v_cutoff and p.user_id = any(v_ex) and not (p.user_id = any(v_a))), '[]'),
      'joinedAfterCutoff', (select count(*) from public.account_profiles p where p.created_at >= v_cutoff));

  elsif p_action = 'run' then
    -- 지급: 명단을 이 트랜잭션에서 다시 계산한다. A 계정이 모두 있고 B 인원이 기대값(expectB)과 같을 때만, 한 번에 지급한다.
    if not coalesce((p_data->>'confirm')::boolean, false) then return jsonb_build_object('ok',false,'code','CONFIRM_REQUIRED'); end if;
    if jsonb_typeof(products) <> 'array' or jsonb_array_length(products) = 0 or days < 1 or a_qty not between 1 and 5 or b_qty not between 1 and 5 then
      return jsonb_build_object('ok',false,'code','CONFIG_INVALID');
    end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('comp-campaign:' || v_campaign, 24));
    if exists(select 1 from unnest(v_a) a(id) where not exists(select 1 from auth.users u where u.id=a.id)) then
      return jsonb_build_object('ok',false,'code','A_ACCOUNT_MISSING','missing',(select jsonb_agg(a.id) from unnest(v_a) a(id) where not exists(select 1 from auth.users u where u.id=a.id)));
    end if;
    select count(*) into n_b from public.account_profiles p where p.created_at < v_cutoff and not (p.user_id = any(v_a)) and not (p.user_id = any(v_ex));
    if not (p_data ? 'expectB') then return jsonb_build_object('ok',false,'code','EXPECT_REQUIRED','actual',n_b); end if;
    if n_b <> (p_data->>'expectB')::integer then
      return jsonb_build_object('ok',false,'code','B_COUNT_MISMATCH','expected',(p_data->>'expectB')::integer,'actual',n_b);
    end if;
    exp := now() + make_interval(days => days);
    for r in
      select a.id user_id, 'A'::text tier, a_qty qty from unnest(v_a) a(id)
      union all
      select p.user_id, 'B', b_qty from public.account_profiles p where p.created_at < v_cutoff and not (p.user_id = any(v_a)) and not (p.user_id = any(v_ex))
    loop
      if exists(select 1 from public.comp_campaign_grants g where g.campaign_id=v_campaign and g.user_id=r.user_id) then n_old := n_old + 1; continue; end if;
      gids := '{}';
      for q in 1..r.qty loop
        insert into public.gift_rewards(owner_user_id, kind, gift_only, product_scopes, expires_at)
          values(r.user_id, 'comp', false, array(select jsonb_array_elements_text(products)), exp) returning * into w;
        gids := gids || w.id;
      end loop;
      insert into public.comp_campaign_grants(campaign_id, user_id, tier, quantity, gift_ids, expires_at) values(v_campaign, r.user_id, r.tier, r.qty, gids, exp);
      -- 서재 지연 지급(ops_comp 'sync', COMP_ENABLED=1일 때만)이 같은 계정에 또 주지 않게 지급 기록을 남긴다(이미 있으면 그대로).
      insert into public.comp_grants(user_id, tier, quantity, ticket_grant_ids, gift_ids, expires_at) values(r.user_id, r.tier, r.qty, '{}', gids, exp) on conflict (user_id) do nothing;
      n_new := n_new + 1;
    end loop;
    return jsonb_build_object('ok', true, 'campaignId', v_campaign, 'granted', n_new, 'already', n_old, 'bCount', n_b, 'aCount', cardinality(v_a), 'expiresAt', exp);

  elsif p_action = 'popup' then
    -- 팝업: 안 쓴(사용 가능·기한 안) 보상 이용권이 있는 지급 한 건(A 먼저, 최근 지급 먼저). 읽기만 한다.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    select x.tier, x.quantity, x.unused, x.expires_at into r from (
      select g.tier, g.quantity, g.granted_at,
        (select count(*) from public.gift_rewards w2 where w2.id = any(g.gift_ids) and w2.owner_user_id=v_user and w2.kind='comp' and w2.status='available' and w2.expires_at > now())::integer unused,
        (select min(w2.expires_at) from public.gift_rewards w2 where w2.id = any(g.gift_ids) and w2.owner_user_id=v_user and w2.kind='comp' and w2.status='available' and w2.expires_at > now()) expires_at
      from (select cg.tier, cg.quantity, cg.gift_ids, cg.granted_at from public.comp_campaign_grants cg where cg.user_id=v_user
            union all
            select g0.tier, g0.quantity, g0.gift_ids, g0.granted_at from public.comp_grants g0 where g0.user_id=v_user
              and not exists(select 1 from public.comp_campaign_grants cg2 where cg2.user_id=v_user)) g
    ) x where x.unused > 0 order by (x.tier='A') desc, x.granted_at desc limit 1;
    if not found then return jsonb_build_object('ok', true, 'tier', null); end if;
    return jsonb_build_object('ok', true, 'tier', r.tier, 'quantity', r.quantity, 'unused', r.unused, 'expiresAt', r.expires_at);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;
revoke all on function public.ops_comp_campaign(text,jsonb) from public, anon, authenticated;
grant execute on function public.ops_comp_campaign(text,jsonb) to service_role;
commit;
