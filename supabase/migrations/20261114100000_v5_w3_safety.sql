-- W3 P0 안전장치(비파괴). 새 함수 2개 + 트리거만 더한다. 기존 표·행·함수·제약은 바꾸지 않는다.
--  1) 4종 판매 중지 스위치: ops_settings 'sales_pause' = {"on":bool,"at","by","reason"}(행이 없으면 판매 중). 쓰기는 ops_sales만(service_role은 ops_settings SELECT만).
--     처리 봇 [4종 멈춤]·[다시 열기], 연결 오류 자동 멈춤(다시 여는 것은 버튼으로만), Anthropic 잔액/인증 경보(1시간 1번, OpenAI api_credit 경보와 쿨다운 따로).
--     켜고 끌 때마다 같은 트랜잭션에 감사 한 줄(sales_paused·sales_resumed·anthropic_alarm).
--  2) SQL 직접 조작 감사: 돈·책 표에 AFTER 행 트리거. 앱 경로(PostgREST = session_user authenticator, 인증 서버 = supabase_auth_admin,
--     service_role)는 기록하지 않고, CLI·SQL 편집기·MCP(session_user postgres 등)의 변경만 ops_audit_log에 sql_insert·sql_update·sql_delete로 남긴다.
--     current_user만 보면 안 되는 까닭: 결제 워커(paid_report_reliability 등 SECURITY DEFINER 21개)는 앱 경로인데도 함수 안 current_user가 postgres다.
--     감사 쓰기가 실패해도 원래 조작은 막지 않는다(WARNING만).
-- 되돌림: drop function public.ops_sales(text,jsonb); 각 표 drop trigger ops_audit_sql on <표>; drop function public.ops_audit_sql_change();
--   delete from public.ops_settings where key in ('sales_pause','anthropic_alarm') — 행이 없으면 판매 중(코드 기본값)이라 지우지 않아도 된다.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regclass('public.ops_settings') is null or to_regclass('public.ops_audit_log') is null then raise exception 'W3_SAFETY_PREREQUISITE_MISSING'; end if;
end $$;

-- ── 1) 판매 중지 스위치 ─────────────────────────────────────────────
-- status: 지금 상태. pause·resume {by,reason,actorUserId,detail}: 바뀔 때만 쓰고 감사 한 줄(changed). 이미 그 상태면 changed=false(자동 멈춤이 여러 워커에서 겹쳐도 경보 1번).
-- alarm {code}: Anthropic 잔액/인증 오류. 1시간 안에 같은 경보가 있었으면 alerted=false. 경보가 나면 판매도 멈춘다(paused = 이번에 멈췄는가).
create function public.ops_sales(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  v jsonb; v_on boolean; v_alarm jsonb; v_at timestamptz;
  v_by text := left(regexp_replace(coalesce(nullif(p_data->>'by',''),'ops'),'[^a-z0-9_-]','','g'),20);
  v_reason text := left(regexp_replace(coalesce(p_data->>'reason',''),'[^A-Za-z0-9_:.,/ -]','','g'),80);
  v_code text := left(regexp_replace(coalesce(p_data->>'code',''),'[^a-z0-9_]','','g'),40);
  v_user uuid := case when coalesce(p_data->>'actorUserId','') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then (p_data->>'actorUserId')::uuid end;
  v_detail jsonb := case when jsonb_typeof(p_data->'detail')='object' then p_data->'detail' else '{}'::jsonb end;
  v_pause boolean;
begin
  if p_action not in ('status','pause','resume','alarm') then return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION'); end if;
  if p_action <> 'status' then perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('ops_sales',25)); end if;
  select s.value into v from public.ops_settings s where s.key='sales_pause';
  v_on := coalesce((v->>'on')::boolean, false);
  if p_action='status' then
    return jsonb_build_object('ok',true,'on',v_on,'at',v->>'at','by',v->>'by','reason',v->>'reason');
  end if;
  if p_action='alarm' then
    if v_code = '' then return jsonb_build_object('ok',false,'code','INVALID'); end if;
    select s.value into v_alarm from public.ops_settings s where s.key='anthropic_alarm';
    v_at := nullif(v_alarm->>'at','')::timestamptz;
    if v_at is not null and v_at > now() - interval '1 hour' then
      return jsonb_build_object('ok',true,'alerted',false,'code','RECENT','on',v_on);
    end if;
    insert into public.ops_settings(key,value,updated_at) values('anthropic_alarm',jsonb_build_object('at',now(),'code',v_code),now())
      on conflict (key) do update set value=excluded.value,updated_at=now();
    insert into public.ops_audit_log(actor,action,target,detail) values('system','anthropic_alarm','anthropic',jsonb_build_object('code',v_code,'paused',not v_on));
    if not v_on then
      insert into public.ops_settings(key,value,updated_at) values('sales_pause',jsonb_build_object('on',true,'at',now(),'by','auto','reason',v_code),now())
        on conflict (key) do update set value=excluded.value,updated_at=now();
      insert into public.ops_audit_log(actor,action,target,detail) values('system','sales_paused','sales_pause',jsonb_build_object('by','auto','reason',v_code));
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
  return jsonb_build_object('ok',true,'on',v_pause,'changed',true,'at',now(),'by',v_by,'reason',v_reason);
end $$;
revoke all on function public.ops_sales(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_sales(text,jsonb) to service_role;

-- ── 2) SQL 직접 조작 감사 트리거 ───────────────────────────────────
-- SECURITY INVOKER: current_user가 부른 쪽 그대로 보인다. 기록하는 경우(CLI·편집기)의 역할은 postgres 등이라 ops_audit_log에 쓸 수 있다.
create function public.ops_audit_sql_change() returns trigger
language plpgsql security invoker set search_path='' as $$
declare r jsonb; o jsonb; v_pk text; v_cols text[];
begin
  if current_user = 'service_role' or session_user in ('authenticator','supabase_auth_admin') then return null; end if;
  begin
    r := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
    if tg_op = 'UPDATE' then
      o := to_jsonb(old);
      select array_agg(n.key order by n.key) into v_cols from jsonb_each(r) n where n.value is distinct from o->n.key;
    end if;
    v_pk := coalesce(r->>'order_code', r->>'report_id', r->>'job_id', r->>'key', r->>'id', r->>'payment_order_id', '?');
    insert into public.ops_audit_log(actor,action,target,detail)
      values('admin','sql_'||lower(tg_op),left(tg_table_name||':'||v_pk,120),
        jsonb_build_object('via','sql','table',tg_table_name,'session',session_user::text,'role',current_user::text,
          'app',left(coalesce(current_setting('application_name',true),''),40),'txid',txid_current(),'cols',coalesce(to_jsonb(v_cols),'[]'::jsonb)));
  exception when others then
    raise warning 'OPS_AUDIT_SQL_FAILED %', sqlstate;
  end;
  return null;
end $$;
revoke all on function public.ops_audit_sql_change() from public,anon,authenticated;

do $$
declare t text;
begin
  foreach t in array array['payment_orders','order_records','order_refunds','report_ticket_grants','report_ticket_ledger','report_ticket_redemptions',
    'gift_rewards','paid_report_snapshots','book_snapshot_versions','book_generation_state','report_generation_jobs','ops_settings','llm_provider_switch'] loop
    if to_regclass('public.'||t) is not null then
      execute format('create trigger ops_audit_sql after insert or update or delete on public.%I for each row execute function public.ops_audit_sql_change()', t);
    end if;
  end loop;
end $$;
commit;
