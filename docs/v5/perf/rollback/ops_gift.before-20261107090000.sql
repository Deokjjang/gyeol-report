-- 운영 xscosaueqpatcqzbgkbl 적용 전 본문(2026-11-06 보관, md5 419741bd6bc17d13a7bee77846660f89). 롤백: 이 파일을 그대로 실행.
CREATE OR REPLACE FUNCTION public.ops_gift(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare w public.gift_rewards%rowtype; o public.payment_orders%rowtype; x public.order_records%rowtype; n integer; t jsonb; v_user uuid:=nullif(p_data->>'userId','')::uuid;
begin
  if p_action='issue' then
    -- 결제 완료 주문 1건마다 1장(계정당 maxPerAccount). 회원 주문만. 같은 주문은 한 번만 따진다(gift_checked_at).
    select * into x from public.order_records where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or x.user_id is null then return jsonb_build_object('ok',true,'issued',false,'code','GUEST_ORDER'); end if;
    select * into o from public.payment_orders where payment_order_id=x.payment_order_id;
    update public.order_records set gift_checked_at=coalesce(gift_checked_at,now()) where payment_order_id=x.payment_order_id;
    if o.status<>'paid' or o.paid_at is null or o.paid_at<(p_data->>'start')::timestamptz or o.paid_at>=(p_data->>'end')::timestamptz
      or not (o.product_type = any(array(select jsonb_array_elements_text(p_data->'products')))) then return jsonb_build_object('ok',true,'issued',false,'code','NOT_ELIGIBLE'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(x.user_id::text,22));
    if exists(select 1 from public.gift_rewards where source_order_id=x.payment_order_id) then return jsonb_build_object('ok',true,'issued',false,'code','ALREADY_ISSUED'); end if;
    select count(*) into n from public.gift_rewards where owner_user_id=x.user_id and kind='event';
    if n>=(p_data->>'maxPerAccount')::integer then return jsonb_build_object('ok',true,'issued',false,'code','ACCOUNT_LIMIT'); end if;
    insert into public.gift_rewards(owner_user_id,source_order_id,product_scope,expires_at) values(x.user_id,x.payment_order_id,nullif(p_data->>'productScope',''),least((p_data->>'expiresAt')::timestamptz,now()+interval '30 days')) returning * into w;
    return jsonb_build_object('ok',true,'issued',true,'giftId',w.id);
  elsif p_action='pending_orders' then
    -- 크론: 이벤트 기간의 회원 결제 완료 주문 중 아직 따지지 않은 것(결제 완료 화면을 못 본 경우).
    return jsonb_build_object('ok',true,'orders',(select coalesce(jsonb_agg(q.payment_order_id),'[]') from (select r.payment_order_id from public.order_records r join public.payment_orders po on po.payment_order_id=r.payment_order_id
      where r.user_id is not null and r.gift_checked_at is null and po.status='paid' and po.paid_at>=(p_data->>'start')::timestamptz and po.paid_at<(p_data->>'end')::timestamptz
      order by po.paid_at limit 20) q));
  elsif p_action='list' then
    update public.gift_rewards set status='expired' where owner_user_id=v_user and status in ('available','gifted') and expires_at<=now();
    return jsonb_build_object('ok',true,'gifts',(select coalesce(jsonb_agg(jsonb_build_object('id',g.id,'status',g.status,'expiresAt',g.expires_at,'createdAt',g.created_at,
      'orderCode',r.order_code,'kind',g.kind,'giftOnly',g.gift_only,'bonus',g.bonus_granted_at is not null) order by g.created_at desc),'[]') from public.gift_rewards g left join public.order_records r on r.payment_order_id=g.source_order_id where g.owner_user_id=v_user));
  elsif p_action in ('use_self','link') then
    select * into w from public.gift_rewards where id=(p_data->>'giftId')::uuid and owner_user_id=v_user for update;
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    if w.expires_at<=now() then update public.gift_rewards set status='expired' where id=w.id; return jsonb_build_object('ok',false,'code','GIFT_EXPIRED'); end if;
    if p_action='use_self' then
      if w.gift_only then return jsonb_build_object('ok',false,'code','GIFT_LINK_ONLY'); end if;
      if w.status<>'available' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
      t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-self:'||w.id,'key','gift-self:'||w.id,'reason','EVENT_PAYMENT_GIFT',
        'expiresAt',w.expires_at,'productScope',w.product_scope,'productScopes',to_jsonb(w.product_scopes)));
      if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
      update public.gift_rewards set status='used_self',used_at=now() where id=w.id;
      return jsonb_build_object('ok',true,'status','used_self');
    end if;
    -- 링크는 다시 만들 수 있다(이전 링크는 무효). 받기 전까지만.
    if w.status not in ('available','gifted') then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
    update public.gift_rewards set status='gifted',token_hash=p_data->>'tokenHash',gifted_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'status','gifted');
  elsif p_action='peek' then
    select * into w from public.gift_rewards where token_hash=p_data->>'tokenHash';
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'status',case when w.status='gifted' and w.expires_at<=now() then 'expired' else w.status end,'expiresAt',w.expires_at,'mine',w.owner_user_id=v_user,'received',coalesce(w.recipient_user_id=v_user,false));
  elsif p_action='claim' then
    -- 받는 사람: 회원 + 정보 화면 완료. 보낸 사람 본인은 못 받는다.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    if not exists(select 1 from public.account_contacts where user_id=v_user) then return jsonb_build_object('ok',false,'code','PROFILE_REQUIRED'); end if;
    select * into w from public.gift_rewards where token_hash=p_data->>'tokenHash' for update;
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    if w.status='claimed' and w.recipient_user_id=v_user then return jsonb_build_object('ok',true,'status','claimed'); end if;
    if w.status<>'gifted' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
    if w.expires_at<=now() then update public.gift_rewards set status='expired' where id=w.id; return jsonb_build_object('ok',false,'code','GIFT_EXPIRED'); end if;
    if w.owner_user_id=v_user then return jsonb_build_object('ok',false,'code','GIFT_SELF'); end if;
    t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-claim:'||w.id,'key','gift-claim:'||w.id,'reason','EVENT_GIFT_RECEIVED',
      'expiresAt',w.expires_at,'productScope',w.product_scope,'productScopes',to_jsonb(w.product_scopes)));
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
    update public.gift_rewards set status='claimed',recipient_user_id=v_user,claimed_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'status','claimed');
  elsif p_action='bonus' then
    -- 선물 받은 친구의 첫 결제(결제 완료 주문 1건째)면 보낸 사람에게 1장 더(계정당 bonusMax).
    select * into x from public.order_records where payment_order_id=p_data->>'paymentOrderId';
    if not found or x.user_id is null then return jsonb_build_object('ok',true,'granted',false); end if;
    select count(*) into n from public.order_records r join public.payment_orders po on po.payment_order_id=r.payment_order_id where r.user_id=x.user_id and po.status in ('paid','refunded');
    if n<>1 then return jsonb_build_object('ok',true,'granted',false,'code','NOT_FIRST_PAYMENT'); end if;
    select * into w from public.gift_rewards where recipient_user_id=x.user_id and kind='event' and status='claimed' and bonus_granted_at is null order by claimed_at limit 1 for update;
    if not found then return jsonb_build_object('ok',true,'granted',false); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(w.owner_user_id::text,22));
    select count(*) into n from public.gift_rewards where owner_user_id=w.owner_user_id and bonus_granted_at is not null;
    if n>=(p_data->>'bonusMax')::integer then return jsonb_build_object('ok',true,'granted',false,'code','BONUS_LIMIT'); end if;
    t:=public.report_tickets('grant',w.owner_user_id,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-bonus:'||w.id,'key','gift-bonus:'||w.id,'reason','EVENT_GIFT_BONUS',
      'expiresAt',least((p_data->>'expiresAt')::timestamptz,now()+interval '30 days'),'productScope',w.product_scope,'productScopes',to_jsonb(w.product_scopes)));
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
    update public.gift_rewards set bonus_granted_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'granted',true,'ownerUserId',w.owner_user_id);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $function$;
