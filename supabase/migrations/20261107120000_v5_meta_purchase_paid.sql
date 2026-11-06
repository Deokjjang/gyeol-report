-- 운영 Q 추가(메타 전환 측정 복구, 덕짱님 결정 2026-11-07 「동의한 사람만 유지」): 결제 완료(payment_orders status→paid) 때
-- 광고 측정에 동의한 구매 회원의 Purchase를 기존 대기표(meta_conversion_outbox)에 넣는다. 결제 승인 코드는 바꾸지 않는다(4부와 같은 트리거 → 대기표).
-- - 구매 회원 = 결제 준비 때 남는 구매 연결(report_purchase_bindings.buyer_id) → 책 소유 연결(report_account_links) → 주문 기록(order_records.user_id)
--   순서로 처음 있는 값(운영 v5 결제는 셋이 같다 — 2026-11-07 읽기). 그 회원의 가장 최근 광고 측정 기록(meta_tracking_consents, 브라우저별)이 현재 판 동의일 때만.
--   가장 최근 기록이 거부면 넣지 않는다(다른 브라우저의 예전 동의로 보내지 않음). 동의 기록이 로그인 없이 남은 브라우저는 결제 완료 화면 경로
--   (queue_meta_purchase, 브라우저 쿠키)가 그대로 맡는다.
-- - 이벤트 id = 기존 식 'purchase_'||md5('gyeol:paid-order:'||주문 id) — 결제 완료 화면 경로·브라우저 픽셀(claim_meta_browser_events → 같은 id로
--   fbq trackSingle eventID)과 같아 Meta가 하나로 합친다(중복 제거). 주문당 1줄(order_id unique, 이미 있으면 그대로).
-- - IP·브라우저 정보는 그 동의 기록의 값(7일 뒤 지워지는 값). 없으면 서버 전송(5분 크론)은 건너뛰고 브라우저 픽셀만 남는다.
-- - 값 = 저장된 주문 금액(payment_orders.amount, 지금 3,900원), KRW. 이용권·보상·무료 경로는 토스 유료 결제가 아니라 넣지 않는다.
-- - 실패해도 결제 상태 변경은 그대로 진행된다(예외를 삼킨다).
create function public.meta_purchase_on_paid() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_user uuid; c public.meta_tracking_consents%rowtype; v_event text;
begin
  if not (new.status='paid' and (tg_op='INSERT' or old.status is distinct from 'paid')) then return null; end if;
  if new.paid_at is null or new.provider_payment_id is null or new.provider<>'toss' or new.currency<>'KRW' or new.amount<=0 or new.report_id is null
     or new.deleted_at is not null or new.refunded_at is not null or new.canceled_at is not null then return null; end if;
  select b.buyer_id into v_user from public.report_purchase_bindings b where b.order_id=new.payment_order_id and b.revoked_at is null;
  if v_user is null then select l.user_id into v_user from public.report_account_links l where l.report_id=new.report_id and l.revoked_at is null; end if;
  if v_user is null and to_regclass('public.order_records') is not null then
    execute 'select r.user_id from public.order_records r where r.payment_order_id=$1' into v_user using new.payment_order_id;
  end if;
  if v_user is null then return null; end if;
  select * into c from public.meta_tracking_consents t where t.user_id=v_user order by t.recorded_at desc limit 1;
  if not found or not c.agreed or c.version<>'meta-20261020-v2' then return null; end if;
  v_event := 'purchase_'||md5('gyeol:paid-order:'||new.payment_order_id);
  -- 예전 일괄 억제(meta_purchase_dispatches만 있고 대기표에 없는 주문)는 그대로 지킨다(queue_meta_purchase와 같은 규칙).
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
revoke all on function public.meta_purchase_on_paid() from public,anon,authenticated;
create trigger meta_purchase_paid after insert or update of status on public.payment_orders
  for each row execute function public.meta_purchase_on_paid();
