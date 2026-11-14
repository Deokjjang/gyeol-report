-- W4 Q0 AI 상태 확인 + 4종 판매 자동 멈춤·재개(비파괴). ops_sales 함수 본문만 바꾼다(create or replace — 이름·인자·반환·권한 같음).
-- 표·열·제약·트리거·기존 행은 바꾸지 않는다. 새 행은 ops_settings 'ai_health' 하나(1분마다 같은 행을 덮어씀 — 표가 커지지 않음).
--
--  health {result, status}: 1분 크론이 작가 모델에 보낸 아주 작은 요청의 결과(result = ok|billing|auth|outage|other).
--    · 'ai_health' = {at, result, status, okStreak, outStreak}. 지난 확인이 3분보다 오래됐으면 연속 횟수를 0부터 다시 센다.
--      지난 확인이 40초 안이면(크론 중복 호출) 세지 않는다(RECENT).
--    · billing|auth → 바로 멈춤(by auto, reason billing|auth). 다시 여는 것은 버튼으로만.
--    · outage(529·5xx·429·과부하·시간 초과·끊김) 3번 연속 → 멈춤(reason outage).
--    · ok 5번 연속 + 지금 자동 멈춤(reason outage|connection) → 다시 연다(by auto, reason recovered).
--      손으로 멈춘 것(by telegram 등)과 billing·auth는 절대 자동으로 열지 않는다.
--    · 자동 멈춤(outage·connection) 중에 billing·auth가 나오면 reason을 billing|auth로 올린다(escalated — 자동 재개 막음).
--    · 돌려주는 changed = paused | resumed | escalated | null. 바뀔 때만 값이 있어 알림은 한 번(여러 워커가 겹쳐도 잠금 안에서 정함).
--  alarm(작가 호출 잔액·인증 경보, W3 P0): 멈춤 reason을 anthropic_credit|anthropic_auth → billing|auth로(같은 뜻, 이름 하나로).
--    자동 멈춤(outage·connection) 중이면 billing|auth로 올린다.
--  pause·alarm·health로 멈출 때마다 ai_health의 연속 정상 횟수를 0으로 — 재개는 멈춘 뒤 5번 연속 정상이어야 한다.
--
-- 되돌림: 20261114100000_v5_w3_safety.sql의 ops_sales 정의를 create or replace로 다시 넣는다(권한 그대로).
--   delete from public.ops_settings where key='ai_health' — 남아 있어도 해가 없다(옛 함수는 읽지 않음).
--   옛 함수는 reason billing|auth|outage를 몰라도 status·resume은 그대로 동작한다.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ops_sales(text,jsonb)') is null then raise exception 'W4_AI_HEALTH_PREREQUISITE_MISSING'; end if;
end $$;

create or replace function public.ops_sales(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  v jsonb; v_on boolean; v_alarm jsonb; v_at timestamptz;
  v_by text := left(regexp_replace(coalesce(nullif(p_data->>'by',''),'ops'),'[^a-z0-9_-]','','g'),20);
  v_reason text := left(regexp_replace(coalesce(p_data->>'reason',''),'[^A-Za-z0-9_:.,/ -]','','g'),80);
  v_code text := left(regexp_replace(coalesce(p_data->>'code',''),'[^a-z0-9_]','','g'),40);
  v_user uuid := case when coalesce(p_data->>'actorUserId','') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then (p_data->>'actorUserId')::uuid end;
  v_detail jsonb := case when jsonb_typeof(p_data->'detail')='object' then p_data->'detail' else '{}'::jsonb end;
  v_pause boolean;
  -- W4 Q0
  v_cur_by text; v_cur_reason text; v_auto_soft boolean;
  v_result text := left(regexp_replace(coalesce(p_data->>'result',''),'[^a-z]','','g'),12);
  v_status int := case when coalesce(p_data->>'status','') ~ '^[0-9]{1,3}$' then (p_data->>'status')::int end;
  v_h jsonb; v_prev timestamptz; v_ok int; v_out int; v_change text; v_hard text;
begin
  if p_action not in ('status','pause','resume','alarm','health') then return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION'); end if;
  if p_action <> 'status' then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('ops_sales',25)); end if;
  select s.value into v from public.ops_settings s where s.key='sales_pause';
  v_on := coalesce((v->>'on')::boolean, false);
  v_cur_by := v->>'by'; v_cur_reason := v->>'reason';
  -- 자동으로 다시 열 수 있는 멈춤: 자동(by auto) + 장애·연결 오류.
  v_auto_soft := v_on and v_cur_by = 'auto' and v_cur_reason in ('outage','connection');
  if p_action='status' then
    return jsonb_build_object('ok',true,'on',v_on,'at',v->>'at','by',v->>'by','reason',v->>'reason');
  end if;

  if p_action='health' then
    if v_result not in ('ok','billing','auth','outage','other') then return jsonb_build_object('ok',false,'code','INVALID'); end if;
    select s.value into v_h from public.ops_settings s where s.key='ai_health';
    v_prev := nullif(v_h->>'at','')::timestamptz;
    -- 같은 분에 크론이 두 번 불려도(드문 중복 호출) 한 번만 센다.
    if v_prev is not null and v_prev > now() - interval '40 seconds' then
      return jsonb_build_object('ok',true,'result',v_result,'changed',null,'code','RECENT','on',v_on);
    end if;
    if v_prev is null or v_prev < now() - interval '3 minutes' then v_ok := 0; v_out := 0;
    else v_ok := coalesce((v_h->>'okStreak')::int,0); v_out := coalesce((v_h->>'outStreak')::int,0); end if;
    v_ok := case when v_result='ok' then v_ok+1 else 0 end;
    v_out := case when v_result='outage' then v_out+1 else 0 end;
    if v_result in ('billing','auth') then
      if not v_on then
        insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',true,'at',now(),'by','auto','reason',v_result),now())
          on conflict (key) do update set value=excluded.value,updated_at=now();
        insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_paused','sales_pause',
          jsonb_build_object('by','auto','reason',v_result,'detail',jsonb_build_object('source','health','status',v_status)));
        v_change := 'paused';
      elsif v_auto_soft then
        update public.ops_settings set value=value||jsonb_build_object('reason',v_result,'at',now()),updated_at=now() where key='sales_pause';
        insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_pause_escalated','sales_pause',
          jsonb_build_object('from',v_cur_reason,'reason',v_result,'detail',jsonb_build_object('source','health','status',v_status)));
        v_change := 'escalated';
      end if;
    elsif v_result='outage' and v_out >= 3 and not v_on then
      insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',true,'at',now(),'by','auto','reason','outage'),now())
        on conflict (key) do update set value=excluded.value,updated_at=now();
      insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_paused','sales_pause',
        jsonb_build_object('by','auto','reason','outage','detail',jsonb_build_object('source','health','status',v_status,'outStreak',v_out)));
      v_change := 'paused';
    elsif v_result='ok' and v_ok >= 5 and v_auto_soft then
      insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',false,'at',now(),'by','auto','reason','recovered'),now())
        on conflict (key) do update set value=excluded.value,updated_at=now();
      insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_resumed','sales_pause',
        jsonb_build_object('by','auto','reason','recovered','detail',jsonb_build_object('source','health','from',v_cur_reason,'okStreak',v_ok)));
      v_change := 'resumed';
    end if;
    insert into public.ops_settings(key,value,updated_at) values('ai_health',
      jsonb_build_object('at',now(),'result',v_result,'status',v_status,'okStreak',case when v_change='paused' then 0 else v_ok end,'outStreak',v_out),now())
      on conflict (key) do update set value=excluded.value,updated_at=now();
    select s.value into v from public.ops_settings s where s.key='sales_pause';
    return jsonb_build_object('ok',true,'result',v_result,'okStreak',v_ok,'outStreak',v_out,'changed',v_change,
      'on',coalesce((v->>'on')::boolean,false),'by',v->>'by','reason',v->>'reason','from',v_cur_reason);
  end if;

  if p_action='alarm' then
    if v_code = '' then return jsonb_build_object('ok',false,'code','INVALID'); end if;
    v_hard := case when v_code like '%auth%' then 'auth' else 'billing' end;
    select s.value into v_alarm from public.ops_settings s where s.key='anthropic_alarm';
    v_at := nullif(v_alarm->>'at','')::timestamptz;
    if v_at is not null and v_at > now() - interval '1 hour' then
      -- 경보 쿨다운 중이어도 자동 멈춤(장애·연결)은 잔액·인증으로 올린다 — 자동으로 다시 열리지 않게.
      if v_auto_soft then
        update public.ops_settings set value=value||jsonb_build_object('reason',v_hard,'at',now()),updated_at=now() where key='sales_pause';
        insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_pause_escalated','sales_pause',
          jsonb_build_object('from',v_cur_reason,'reason',v_hard,'detail',jsonb_build_object('source','alarm','code',v_code)));
      end if;
      return jsonb_build_object('ok',true,'alerted',false,'code','RECENT','on',v_on);
    end if;
    insert into public.ops_settings(key,value,updated_at) values('anthropic_alarm',jsonb_build_object('at',now(),'code',v_code),now())
      on conflict (key) do update set value=excluded.value,updated_at=now();
    insert into public.ops_audit_log(actor,action,target,detail) values('system','anthropic_alarm','anthropic',jsonb_build_object('code',v_code,'paused',not v_on));
    if not v_on then
      insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',true,'at',now(),'by','auto','reason',v_hard),now())
        on conflict (key) do update set value=excluded.value,updated_at=now();
      insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_paused','sales_pause',jsonb_build_object('by','auto','reason',v_hard));
      update public.ops_settings set value=value||'{"okStreak":0}'::jsonb,updated_at=now() where key='ai_health';
    elsif v_auto_soft then
      update public.ops_settings set value=value||jsonb_build_object('reason',v_hard,'at',now()),updated_at=now() where key='sales_pause';
      insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_pause_escalated','sales_pause',
        jsonb_build_object('from',v_cur_reason,'reason',v_hard,'detail',jsonb_build_object('source','alarm','code',v_code)));
    end if;
    return jsonb_build_object('ok',true,'alerted',true,'paused',not v_on,'on',true);
  end if;

  v_pause := p_action='pause';
  if v_pause = v_on then
    return jsonb_build_object('ok',true,'on',v_on,'changed',false,'at',v->>'at','by',v->>'by','reason',v->>'reason');
  end if;
  insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',v_pause,'at',now(),'by',v_by,'reason',v_reason),now())
    on conflict (key) do update set value=excluded.value,updated_at=now();
  insert into public.ops_audit_log(actor,actor_user_id,action,target,detail)
    values(case when v_by='auto' then 'system' else 'admin' end, v_user, case when v_pause then 'sales_paused' else 'sales_resumed' end, 'sales_pause',
      jsonb_build_object('by',v_by,'reason',v_reason,'detail',v_detail));
  if v_pause then update public.ops_settings set value=value||'{"okStreak":0}'::jsonb,updated_at=now() where key='ai_health'; end if;
  return jsonb_build_object('ok',true,'on',v_pause,'changed',true,'at',now(),'by',v_by,'reason',v_reason);
end $$;
revoke all on function public.ops_sales(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_sales(text,jsonb) to service_role;
commit;
