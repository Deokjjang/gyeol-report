-- 운영 xscosaueqpatcqzbgkbl 적용 전 본문(2026-11-06 보관, md5 a309becb508516452a80833511946147). 롤백: 이 파일을 그대로 실행.
CREATE OR REPLACE FUNCTION public.ops_comp_campaign(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
    -- 명단만(지급 없음). A: 지정 계정. B: 기준 시각 전에 로그인한 계정(auth.users.created_at, 익명·삭제 계정 제외) − A − 제외 목록.
    -- signedUp: 가입 동의를 마쳤는지(account_profiles) — 표시만, 대상 판단에는 쓰지 않는다.
    return jsonb_build_object('ok', true, 'campaignId', v_campaign, 'cutoff', v_cutoff,
      'a', coalesce((select jsonb_agg(jsonb_build_object('userId', a.id, 'exists', u.id is not null, 'joinedAt', u.created_at, 'signedUp', p.user_id is not null,
          'email', coalesce(c.email, to_jsonb(u)->>'email'), 'granted', exists(select 1 from public.comp_campaign_grants g where g.campaign_id=v_campaign and g.user_id=a.id)) order by a.ord)
        from unnest(v_a) with ordinality a(id, ord) left join auth.users u on u.id=a.id left join public.account_profiles p on p.user_id=a.id left join public.account_contacts c on c.user_id=a.id), '[]'),
      'b', coalesce((select jsonb_agg(jsonb_build_object('userId', u.id, 'joinedAt', u.created_at, 'signedUp', p.user_id is not null, 'email', coalesce(c.email, to_jsonb(u)->>'email'),
          'granted', exists(select 1 from public.comp_campaign_grants g where g.campaign_id=v_campaign and g.user_id=u.id)) order by u.created_at, u.id)
        from auth.users u left join public.account_profiles p on p.user_id=u.id left join public.account_contacts c on c.user_id=u.id
        where u.created_at < v_cutoff and coalesce((to_jsonb(u)->>'is_anonymous')::boolean, false) = false and (to_jsonb(u)->>'deleted_at') is null
          and not (u.id = any(v_a)) and not (u.id = any(v_ex))), '[]'),
      'excluded', coalesce((select jsonb_agg(jsonb_build_object('userId', u.id, 'joinedAt', u.created_at, 'signedUp', p.user_id is not null, 'email', coalesce(c.email, to_jsonb(u)->>'email')) order by u.created_at)
        from auth.users u left join public.account_profiles p on p.user_id=u.id left join public.account_contacts c on c.user_id=u.id
        where u.created_at < v_cutoff and u.id = any(v_ex) and not (u.id = any(v_a))), '[]'),
      'skipped', (select count(*) from auth.users u where u.created_at < v_cutoff and not (u.id = any(v_a)) and not (u.id = any(v_ex))
          and (coalesce((to_jsonb(u)->>'is_anonymous')::boolean, false) or (to_jsonb(u)->>'deleted_at') is not null)),
      'joinedAfterCutoff', (select count(*) from auth.users u where u.created_at >= v_cutoff));

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
    select count(*) into n_b from auth.users u where u.created_at < v_cutoff and coalesce((to_jsonb(u)->>'is_anonymous')::boolean, false) = false and (to_jsonb(u)->>'deleted_at') is null
      and not (u.id = any(v_a)) and not (u.id = any(v_ex));
    if not (p_data ? 'expectB') then return jsonb_build_object('ok',false,'code','EXPECT_REQUIRED','actual',n_b); end if;
    if n_b <> (p_data->>'expectB')::integer then
      return jsonb_build_object('ok',false,'code','B_COUNT_MISMATCH','expected',(p_data->>'expectB')::integer,'actual',n_b);
    end if;
    exp := now() + make_interval(days => days);
    for r in
      select a.id user_id, 'A'::text tier, a_qty qty from unnest(v_a) a(id)
      union all
      select u.id, 'B', b_qty from auth.users u where u.created_at < v_cutoff and coalesce((to_jsonb(u)->>'is_anonymous')::boolean, false) = false and (to_jsonb(u)->>'deleted_at') is null
        and not (u.id = any(v_a)) and not (u.id = any(v_ex))
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
end $function$;
