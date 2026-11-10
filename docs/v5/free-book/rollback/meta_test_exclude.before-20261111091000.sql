-- 운영 적용 전 본문(2026-11-10 19:16 KST, supabase db dump --linked --schema public, 읽기 전용). 되돌리기: 이 파일을 그대로 실행(CREATE OR REPLACE — 권한·소유자는 그대로 남는다).
-- 함수: meta_purchase_on_paid, queue_meta_purchase, meta_delivery_batch, claim_meta_browser_events
begin;

CREATE OR REPLACE FUNCTION "public"."meta_purchase_on_paid"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare v_user uuid; v_choice boolean; c public.meta_tracking_consents%rowtype; v_event text;
begin
  if not (new.status='paid' and (tg_op='INSERT' or old.status is distinct from 'paid')) then return null; end if;
  if new.paid_at is null or new.provider_payment_id is null or new.provider<>'toss' or new.currency<>'KRW' or new.amount<=0 or new.report_id is null
     or new.deleted_at is not null or new.refunded_at is not null or new.canceled_at is not null then return null; end if;
  v_user := public.meta_order_buyer(new.payment_order_id,new.report_id);
  if v_user is null then return null; end if;
  v_choice := public.meta_user_choice(v_user);
  if v_choice is false or (v_choice is null and not public.meta_optout_effective()) then return null; end if;
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

CREATE OR REPLACE FUNCTION "public"."queue_meta_purchase"("p_report" "text", "p_browser" "text", "p_ip" "text", "p_agent" "text", "p_user" "uuid" DEFAULT NULL::"uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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
    if not public.meta_optout_effective() or p_user is null or public.meta_order_buyer(o.payment_order_id,o.report_id) is distinct from p_user or public.meta_user_choice(p_user) is false then return false; end if;
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

CREATE OR REPLACE FUNCTION "public"."meta_delivery_batch"("p_action" "text", "p_event" "text" DEFAULT NULL::"text", "p_lease" "uuid" DEFAULT NULL::"uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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

CREATE OR REPLACE FUNCTION "public"."claim_meta_browser_events"("p_browser" "text", "p_user" "uuid" DEFAULT NULL::"uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
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

commit;
