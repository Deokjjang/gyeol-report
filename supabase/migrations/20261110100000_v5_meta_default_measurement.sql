-- 광고 측정 기본 허용(덕짱님 결정 A, 2026-11-09). 데이터를 지우거나 바꾸지 않는다(열 하나 not null 풀기 + 함수 교체·추가).
-- - 개인 식별 정보 없는 행태정보 이벤트(PageView·ViewContent·InitiateCheckout·Purchase)는 기본으로 보내고, 「광고 설정」에서 거부한 사람에게는 보내지 않는다.
-- - 광고 설정 기록(meta_tracking_consents)의 뜻: agreed=true = 선택 동의(개인 식별 정보 포함), agreed=false = 거부, 기록 없음 = 기본(행태정보만).
--   회원의 설정 = 그 회원의 가장 최근 기록(meta_user_choice). 거부하면 record_meta_consent가 그 회원의 모든 기록을 거부로 바꾸므로 그대로 쓴다.
-- - 개인 식별 정보(이메일·휴대폰 번호 SHA-256, meta_user_match)는 로그인한 채 선택 동의한 회원(가장 최근 기록이 동의)에게만, 서버 전송에만 붙인다.
--   원문은 DB 밖으로 나가지 않는다. 브라우저 픽셀에는 붙이지 않는다(Advanced Matching 안 씀).
-- - CompleteRegistration(가입 완료)은 그대로 선택 동의한 회원만(queue_meta_registration 바꾸지 않음).
-- - 기본 허용 회원의 Purchase: 그 브라우저에는 광고 설정 기록이 없으므로 대기표 줄에 browser_key 없이 회원(user_id)으로만 묶는다.
--   IP·브라우저 정보는 결제 완료 화면 요청(queue_meta_purchase, 구매 회원 본인만)이 채운다 — 없으면 서버 전송은 건너뛰고 브라우저 픽셀만.
-- 배포 순서: 이 migration → 코드. 예전 코드도 그대로 돈다(queue_meta_purchase 4개 인자 호출 = p_user 기본값 null, 대기표 결과에 더한 em·ph는 예전 코드가 무시).
begin;
set local lock_timeout='5s';

alter table public.meta_conversion_outbox alter column browser_key drop not null;
alter table public.meta_conversion_outbox add constraint meta_outbox_owner
  check(browser_key is not null or (event_name='Purchase' and user_id is not null));

-- 회원의 광고 설정: true 선택 동의 · false 거부 · null 기록 없음(기본 허용).
create function public.meta_user_choice(p_user uuid) returns boolean
language plpgsql stable security invoker set search_path='' as $$
declare v boolean;
begin
  if p_user is null then return null; end if;
  select case when t.agreed and t.version='meta-20261020-v2' then true when not t.agreed then false end into v
    from public.meta_tracking_consents t where t.user_id=p_user order by t.recorded_at desc limit 1;
  return v;
end $$;

-- 선택 동의 회원의 일치 키(Meta 전환 API 정규화: 이메일 소문자·앞뒤 공백 제거, 휴대폰 국가번호 82 + 앞 0 뺀 숫자). 동의가 아니면 빈 값.
create function public.meta_user_match(p_user uuid) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare c record;
begin
  if public.meta_user_choice(p_user) is not true then return '{}'::jsonb; end if;
  select a.email,a.phone into c from public.account_contacts a where a.user_id=p_user;
  if not found then return '{}'::jsonb; end if;
  return jsonb_strip_nulls(jsonb_build_object(
    'em',jsonb_build_array(encode(pg_catalog.sha256(convert_to(lower(btrim(c.email)),'UTF8')),'hex')),
    'ph',case when c.phone ~ '^0[0-9]{9,10}$' then jsonb_build_array(encode(pg_catalog.sha256(convert_to('82'||substr(c.phone,2),'UTF8')),'hex')) end));
end $$;

-- 구매 회원 = 결제 준비 때 구매 연결 → 책 소유 연결 → 주문 기록 순서로 처음 있는 값(20261107120000 트리거와 같은 순서).
create function public.meta_order_buyer(p_order text,p_report text) returns uuid
language plpgsql stable security invoker set search_path='' as $$
declare v_user uuid;
begin
  select b.buyer_id into v_user from public.report_purchase_bindings b where b.order_id=p_order and b.revoked_at is null;
  if v_user is null then select l.user_id into v_user from public.report_account_links l where l.report_id=p_report and l.revoked_at is null; end if;
  if v_user is null and to_regclass('public.order_records') is not null then
    execute 'select r.user_id from public.order_records r where r.payment_order_id=$1' into v_user using p_order;
  end if;
  return v_user;
end $$;

-- 결제 완료 트리거: 거부한 회원만 뺀다. 선택 동의 회원은 예전과 같이 그 동의 기록의 브라우저·IP·브라우저 정보, 기본 허용 회원은 회원으로만(IP는 결제 완료 화면이 채움).
create or replace function public.meta_purchase_on_paid() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_user uuid; v_choice boolean; c public.meta_tracking_consents%rowtype; v_event text;
begin
  if not (new.status='paid' and (tg_op='INSERT' or old.status is distinct from 'paid')) then return null; end if;
  if new.paid_at is null or new.provider_payment_id is null or new.provider<>'toss' or new.currency<>'KRW' or new.amount<=0 or new.report_id is null
     or new.deleted_at is not null or new.refunded_at is not null or new.canceled_at is not null then return null; end if;
  v_user := public.meta_order_buyer(new.payment_order_id,new.report_id);
  if v_user is null then return null; end if;
  v_choice := public.meta_user_choice(v_user);
  if v_choice is false then return null; end if;
  if v_choice then select * into c from public.meta_tracking_consents t where t.user_id=v_user order by t.recorded_at desc limit 1; end if;
  v_event := 'purchase_'||md5('gyeol:paid-order:'||new.payment_order_id);
  if exists(select 1 from public.meta_purchase_dispatches where order_id=new.payment_order_id)
     and not exists(select 1 from public.meta_conversion_outbox where order_id=new.payment_order_id) then return null; end if;
  insert into public.meta_purchase_dispatches(order_id,event_id) values(new.payment_order_id,v_event) on conflict do nothing;
  insert into public.meta_conversion_outbox(event_id,event_name,order_id,browser_key,user_id,occurred_at,custom_data,ip,agent)
    values(v_event,'Purchase',new.payment_order_id,c.browser_key,v_user,new.paid_at,
      jsonb_build_object('value',new.amount,'currency','KRW','content_ids',jsonb_build_array(new.product_type),'content_type','product','num_items',1),c.ip,c.agent)
    on conflict do nothing;
  return null;
exception when others then
  raise warning 'META_PURCHASE_TRIGGER_FAILED %', sqlstate;
  return null;
end $$;

-- 결제 완료 화면 경로. 이 브라우저가 거부했으면 안 넣는다. 선택 동의 브라우저는 예전 그대로.
-- 기본 허용은 로그인한 구매 회원 본인만(p_user = 구매 회원, 그 회원이 거부하지 않음): 줄이 없으면 만들고, 트리거가 만든 기본 줄에 IP·브라우저 정보가 없으면 채운다.
drop function public.queue_meta_purchase(text,text,text,text);
create function public.queue_meta_purchase(p_report text,p_browser text,p_ip text,p_agent text,p_user uuid default null) returns boolean
language plpgsql security invoker set search_path='' as $$
declare o public.payment_orders%rowtype; event_key text; consent public.meta_tracking_consents%rowtype; v_explicit boolean := false; v_owner uuid;
begin
  if p_browser is not null then
    select * into consent from public.meta_tracking_consents where browser_key=p_browser;
    if found and not consent.agreed then return false; end if;
    v_explicit := found and consent.agreed and consent.version='meta-20261020-v2';
  end if;
  select * into o from public.payment_orders where report_id=p_report and status='paid'
    and paid_at is not null and provider_payment_id is not null and provider='toss' and currency='KRW' and amount>0
    and deleted_at is null and refunded_at is null and canceled_at is null and paid_at>clock_timestamp()-interval '6 days' for update;
  if not found then return false; end if;
  if v_explicit then v_owner := consent.user_id;
  else
    if p_user is null or public.meta_order_buyer(o.payment_order_id,o.report_id) is distinct from p_user or public.meta_user_choice(p_user) is false then return false; end if;
    v_owner := p_user;
  end if;
  event_key:='purchase_'||md5('gyeol:paid-order:'||o.payment_order_id);
  if exists(select 1 from public.meta_purchase_dispatches where order_id=o.payment_order_id)
    and not exists(select 1 from public.meta_conversion_outbox where order_id=o.payment_order_id) then return false; end if;
  insert into public.meta_purchase_dispatches(order_id,event_id) values(o.payment_order_id,event_key) on conflict do nothing;
  insert into public.meta_conversion_outbox as x(event_id,event_name,order_id,browser_key,user_id,occurred_at,custom_data,ip,agent)
    values(event_key,'Purchase',o.payment_order_id,case when v_explicit then p_browser end,v_owner,o.paid_at,
      jsonb_build_object('value',o.amount,'currency','KRW','content_ids',jsonb_build_array(o.product_type),'content_type','product','num_items',1),p_ip,left(p_agent,512))
    on conflict(order_id) do update set ip=excluded.ip,agent=excluded.agent
      where not v_explicit and x.browser_key is null and x.user_id=p_user and x.state='PENDING' and x.ip is null and x.sent_at is null;
  return true;
end $$;

-- 서버 전송 대기표: 기본 줄(browser_key 없음)은 회원이 거부하지 않았을 때만, 선택 동의 줄은 예전 그대로. 일치 키는 선택 동의 줄에만.
create or replace function public.meta_delivery_batch(p_action text,p_event text default null,p_lease uuid default null) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
  update public.meta_conversion_outbox set ip=null,agent=null,state=case when state='PENDING' then 'EXPIRED' else state end
    where occurred_at<clock_timestamp()-interval '7 days' and (ip is not null or agent is not null or state='PENDING');
  update public.meta_tracking_consents set ip=null,agent=null where recorded_at<clock_timestamp()-interval '7 days' and (ip is not null or agent is not null);
  delete from public.meta_conversion_outbox where occurred_at<clock_timestamp()-interval '180 days';
  delete from public.meta_tracking_consents c where recorded_at<clock_timestamp()-interval '180 days' and not exists(select 1 from public.meta_conversion_outbox o where o.browser_key=c.browser_key);
  update public.meta_conversion_outbox set state='EXPIRED',ip=null,agent=null where state='PENDING' and first_attempt_at<clock_timestamp()-interval '24 hours';
  if p_action='cleanup' then return 'true'::jsonb; end if;
  if p_action='claim' then
    with ready as (
      select o.event_id from public.meta_conversion_outbox o left join public.meta_tracking_consents c using(browser_key)
      where o.state='PENDING' and o.ip is not null and o.agent is not null
        and case when o.browser_key is null then public.meta_user_choice(o.user_id) is distinct from false else coalesce(c.agreed and c.version='meta-20261020-v2',false) end
        and (o.first_attempt_at is null or o.first_attempt_at>clock_timestamp()-interval '24 hours')
        and o.occurred_at>clock_timestamp()-interval '6 days' and o.next_at<=clock_timestamp()
        and (o.lease_until is null or o.lease_until<clock_timestamp())
      order by o.occurred_at limit 5 for update of o skip locked
    ), claimed as (
      update public.meta_conversion_outbox o set lease=gen_random_uuid(),lease_until=clock_timestamp()+interval '2 minutes',first_attempt_at=coalesce(first_attempt_at,clock_timestamp()),attempts=attempts+1
        from ready where o.event_id=ready.event_id returning o.*
    ) select coalesce(jsonb_agg(jsonb_build_object('event_name',event_name,'event_id',event_id,'event_time',floor(extract(epoch from occurred_at)),
      'custom_data',custom_data,'user_data',jsonb_build_object('client_ip_address',ip,'client_user_agent',agent)
        ||case when browser_key is not null then public.meta_user_match(user_id) else '{}'::jsonb end,'lease',lease)),'[]') into result from claimed;
    return result;
  elsif p_action='allowed' then
    return to_jsonb(exists(select 1 from public.meta_conversion_outbox o left join public.meta_tracking_consents c using(browser_key)
      where o.event_id=p_event and o.lease=p_lease and o.state='PENDING' and o.lease_until>clock_timestamp()
      and case when o.browser_key is null then public.meta_user_choice(o.user_id) is distinct from false else coalesce(c.agreed,false) end
      and (o.order_id is null or exists(select 1 from public.payment_orders p where p.payment_order_id=o.order_id and p.status='paid' and p.refunded_at is null and p.canceled_at is null and p.deleted_at is null))));
  elsif p_action in ('sent','retry') then
    update public.meta_conversion_outbox set state=case when p_action='sent' then 'SENT' else 'PENDING' end,
      sent_at=case when p_action='sent' then clock_timestamp() end,
      ip=case when p_action='sent' then null else ip end,agent=case when p_action='sent' then null else agent end,
      next_at=clock_timestamp()+make_interval(secs=>least(3600,60*power(2,least(attempts,6)))::int),lease=null,lease_until=null
      where event_id=p_event and lease=p_lease and state='PENDING';
    return to_jsonb(found);
  end if;
  return 'false'::jsonb;
end $$;

-- 브라우저 픽셀 거울: 선택 동의 줄은 그 브라우저, 기본 줄은 로그인한 그 회원(거부 안 함)의 브라우저만. 요청 브라우저가 거부했으면 없음.
create or replace function public.claim_meta_browser_events(p_browser text,p_user uuid default null) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare result jsonb;
begin
  if exists(select 1 from public.meta_tracking_consents x where x.browser_key=p_browser and not x.agreed) then return '[]'::jsonb; end if;
  with ready as (
    select o.event_id from public.meta_conversion_outbox o left join public.meta_tracking_consents c using(browser_key)
    where ((o.browser_key=p_browser and c.agreed and c.version='meta-20261020-v2')
        or (o.browser_key is null and p_user is not null and o.user_id=p_user and public.meta_user_choice(p_user) is distinct from false))
      and o.browser_dispatched_at is null and o.state in ('PENDING','SENT')
      and o.occurred_at>clock_timestamp()-interval '10 minutes'
      and (o.user_id=p_user or (o.event_name='Purchase' and o.user_id is null))
      and (o.order_id is null or exists(select 1 from public.payment_orders p where p.payment_order_id=o.order_id and p.status='paid' and p.refunded_at is null and p.canceled_at is null and p.deleted_at is null))
    order by o.occurred_at limit 5 for update of o skip locked
  ), claimed as (
    update public.meta_conversion_outbox o set browser_dispatched_at=clock_timestamp()
      from ready where o.event_id=ready.event_id returning o.*
  ) select coalesce(jsonb_agg(jsonb_build_object('event',event_name,'eventId',event_id,'params',custom_data)),'[]') into result from claimed;
  return result;
end $$;

revoke all on function public.meta_user_choice(uuid),public.meta_user_match(uuid),public.meta_order_buyer(text,text),public.queue_meta_purchase(text,text,text,text,uuid) from public,anon,authenticated;
grant execute on function public.meta_user_choice(uuid),public.meta_user_match(uuid),public.meta_order_buyer(text,text),public.queue_meta_purchase(text,text,text,text,uuid) to service_role;
commit;
