-- 운영 적용 전 본문(2026-11-10 19:16 KST, supabase db dump --linked --schema public, 읽기 전용). 되돌리기: 이 파일을 그대로 실행(CREATE OR REPLACE — 권한·소유자는 그대로 남는다).
-- 함수: ops_gift, ops_notify
begin;

CREATE OR REPLACE FUNCTION "public"."ops_gift"("p_action" "text", "p_data" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $_$
declare w public.gift_rewards%rowtype; o public.payment_orders%rowtype; x public.order_records%rowtype; n integer; t jsonb; g_avail integer; g_usable integer; g_sent integer; g_recv integer; g_exp timestamptz; g_uexp timestamptz; l_exp timestamptz; v_user uuid:=nullif(p_data->>'userId','')::uuid;
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
    -- P 추가 C: 계정당 상한 없음(결제 1건마다 1장).
    
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
  elsif p_action='wallet' then
    -- P 추가 E·F: 이용권 지갑. ledger = 일반 이용권(원장, 받은 선물 포함) · giftable = 내가 선물할 수 있는 남은 이벤트·보상 이용권
    -- usable = 결제 화면에서 쓸 수 있는 장수(원장 + 남은 이벤트·보상, 선물 전용 제외) · total = 서재에 보이는 장수 · expiresAt = 가장 빠른 기한(서재 한 줄)
    -- usableExpiresAt = 결제 화면에서 쓸 수 있는 이용권 중 가장 빠른 기한(spend가 먼저 쓰는 장의 기한).
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    update public.gift_rewards set status='expired' where owner_user_id=v_user and status in ('available','gifted') and expires_at<=now();
    t:=public.report_tickets('summary',v_user,'{}'::jsonb);
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','SUMMARY_FAILED'); end if;
    select count(*) filter (where status='available'), count(*) filter (where status='available' and not gift_only), min(expires_at) filter (where status='available'),
      min(expires_at) filter (where status='available' and not gift_only),
      count(*) filter (where status in ('gifted','claimed')), count(distinct recipient_user_id) filter (where status='claimed')
      into g_avail, g_usable, g_exp, g_uexp, g_sent, g_recv from public.gift_rewards where owner_user_id=v_user;
    select min((l->>'expiresAt')::timestamptz) into l_exp from jsonb_array_elements(coalesce(t->'lots','[]'::jsonb)) l where nullif(l->>'expiresAt','') is not null;
    n:=greatest(coalesce((t->>'quantity')::integer,0),0);
    return jsonb_build_object('ok',true,'ledger',n,'giftable',g_avail,'usable',n+g_usable,'total',n+g_avail,'expiresAt',least(l_exp,g_exp),'usableExpiresAt',least(l_exp,g_uexp),'sent',g_sent,'recipients',g_recv);
  elsif p_action='spend' then
    -- P 추가 E: 결제 화면에서 이용권 1장을 이 책에 쓴다(「내가 쓰기」 버튼 없음). 기한이 가장 빠른 것부터:
    -- 남은 이벤트·보상 이용권이 원장 이용권보다 먼저 끝나거나 원장 이용권이 없으면 그 1장을 원장으로 옮긴다(내가 쓰기와 같은 기록). 그다음 발행(redeem)은 원장에서 기한 이른 것부터 집는다.
    -- 같은 요청(requestId)이 이미 접수됐으면 아무것도 옮기지 않는다(다시 누르기·재시도).
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,22));
    if exists(select 1 from public.report_ticket_redemptions where user_id=v_user and request_id=p_data->>'requestId') then return jsonb_build_object('ok',true,'moved',false); end if;
    n:=0;
    select g.expires_at, 1 into l_exp, n from public.report_ticket_grants g where g.user_id=v_user and (g.expires_at is null or g.expires_at>clock_timestamp())
      and (g.product_scope is null or g.product_scope=p_data->>'productType') and (g.product_scopes is null or (p_data->>'productType')=any(g.product_scopes))
      and (select coalesce(sum(l.quantity_delta),0) from public.report_ticket_ledger l where l.grant_id=g.id)>0
      order by g.expires_at asc nulls last, g.granted_at, g.id limit 1;
    n:=coalesce(n,0);
    select * into w from public.gift_rewards where owner_user_id=v_user and status='available' and not gift_only and expires_at>now()
      and (product_scope is null or product_scope=p_data->>'productType') and (product_scopes is null or (p_data->>'productType')=any(product_scopes))
      order by expires_at, created_at, id limit 1 for update;
    if not found or (n>0 and l_exp is not null and l_exp<=w.expires_at) then return jsonb_build_object('ok',true,'moved',false); end if;
    t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-self:'||w.id,'key','gift-self:'||w.id,'reason','EVENT_PAYMENT_GIFT',
      'expiresAt',w.expires_at,'productScope',w.product_scope,'productScopes',to_jsonb(w.product_scopes)));
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
    update public.gift_rewards set status='used_self',used_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'moved',true);
  elsif p_action='link_next' then
    -- P 추가 F: 선물하기 창. 공유·복사하는 순간 기한 가장 빠른 남은 1장에 링크를 건다(토큰은 화면이 만들고 서버는 해시만 둔다).
    -- 받은 이용권은 원장(report_ticket_grants)에 있어 여기 대상이 아니다 = 다시 선물할 수 없다. 같은 토큰으로 다시 부르면 같은 결과.
    if v_user is null or coalesce(p_data->>'tokenHash','') !~ '^[a-f0-9]{64}$' then return jsonb_build_object('ok',false,'code','INVALID'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,22));
    select * into w from public.gift_rewards where token_hash=p_data->>'tokenHash';
    if found then
      if w.owner_user_id<>v_user then return jsonb_build_object('ok',false,'code','INVALID'); end if;
      return jsonb_build_object('ok',true,'status',w.status,'expiresAt',w.expires_at);
    end if;
    select * into w from public.gift_rewards where owner_user_id=v_user and status='available' and expires_at>now() order by expires_at, created_at, id limit 1 for update;
    if not found then return jsonb_build_object('ok',false,'code','NO_GIFTABLE'); end if;
    update public.gift_rewards set status='gifted',token_hash=p_data->>'tokenHash',gifted_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'status','gifted','expiresAt',w.expires_at);
  elsif p_action='unlink' then
    -- 공유 창을 그냥 닫으면(공유하지 않음) 그 링크의 이용권을 되돌린다. 받기 전까지만, 링크를 만든 본인만.
    update public.gift_rewards set status='available',token_hash=null,gifted_at=null
      where owner_user_id=v_user and token_hash=p_data->>'tokenHash' and status='gifted' and expires_at>now() returning * into w;
    return jsonb_build_object('ok',true,'reverted',found);
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
    -- P 추가 C: 친구 첫 결제 보너스는 없앴다. 배포 사이의 예전 호출에도 아무것도 주지 않는다.
    return jsonb_build_object('ok',true,'granted',false,'code','BONUS_REMOVED');
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
end $_$;

CREATE OR REPLACE FUNCTION "public"."ops_notify"("p_action" "text", "p_data" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $_$
declare
  v_now timestamptz := now();
  v_lim integer := least(greatest(coalesce((p_data->>'limit')::integer, 10), 1), 50);
  v_day_start timestamptz := ((v_now at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
  v_n integer; v_kind text; v_res jsonb; v_user uuid; v_order text; v_report text; v_reason text; v_dev text; v_id uuid; v_start timestamptz; v_end timestamptz; v_swept integer;
  v_po public.payment_orders%rowtype;
begin
  if p_action='claim' then
    -- 보낼 차례인 줄을 잠깐(90초) 잡는다. 같은 줄을 두 곳이 동시에 보내지 않는다.
    with c as (select q.id from public.ops_notifications q where q.sent_at is null and q.attempts<10 and q.next_attempt_at<=v_now
                 and (q.locked_until is null or q.locked_until<v_now) order by q.id limit v_lim for update skip locked),
         u as (update public.ops_notifications n set locked_until=v_now+interval '90 seconds' from c where n.id=c.id returning n.*)
    select coalesce(jsonb_agg(jsonb_build_object('id',u.id,'kind',u.kind,'bot',u.bot,'payload',u.payload,'attempts',u.attempts,'createdAt',u.created_at) order by u.id),'[]'::jsonb) into v_res from u;
    return jsonb_build_object('ok',true,'items',v_res);
  elsif p_action='sent' then
    update public.ops_notifications set sent_at=v_now,message_id=nullif(p_data->>'messageId','')::bigint,locked_until=null,last_error=null,
      closed_at=case when coalesce((p_data->>'closed')::boolean,false) then v_now else closed_at end
      where id=(p_data->>'id')::bigint and sent_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='failed' then
    -- 다시 보내기 간격: 1·2·4·8…분, 최대 60분. 10번 실패하면 남겨 두고 처리 봇 경고(경고 자체의 실패는 다시 경고하지 않는다).
    update public.ops_notifications set attempts=attempts+1,last_error=left(coalesce(nullif(p_data->>'error',''),'FAILED'),300),locked_until=null,
      next_attempt_at=v_now+least(interval '1 minute'*power(2,attempts),interval '60 minutes')
      where id=(p_data->>'id')::bigint and sent_at is null returning attempts,kind into v_n,v_kind;
    if found and v_n>=10 and v_kind<>'notify_failed' then
      perform public.ops_notify_enqueue('notify_failed','ops','nfail:'||(p_data->>'id'),jsonb_build_object('notificationId',(p_data->>'id')::bigint,'failedKind',v_kind));
    end if;
    return jsonb_build_object('ok',found,'attempts',coalesce(v_n,0));
  elsif p_action='scan_unpublished' then
    -- 결제 뒤 30분이 지나도 책이 완성(발행)되지 않은 주문 → 처리 봇 「미발행」, 주문당 1번. 첫 배포 때 옛 주문이 쏟아지지 않게 최근 3일만 본다.
    insert into public.ops_notifications(kind,bot,dedupe_key,payload)
      select 'unpublished','ops','unpub:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id)
      from public.payment_orders po left join public.paid_report_snapshots sn on sn.report_id=po.report_id
      where po.status='paid' and po.paid_at<v_now-interval '30 minutes' and po.paid_at>v_now-interval '3 days'
        and (sn.report_id is null or sn.status<>'COMPLETED' or sn.published_at is null)
        and not exists(select 1 from public.order_refunds rf where rf.payment_order_id=po.payment_order_id)
      on conflict (dedupe_key) do nothing;
    get diagnostics v_n = row_count;
    -- 누락 보충: 트리거가 대기표에 넣지 못한 결제·환불·문의(트리거는 예외를 삼켜 결제를 막지 않는다)를 다시 넣는다. 알림 시작 뒤·최근 3일, 같은 키는 한 번만.
    select (value->>'at')::timestamptz into v_start from public.ops_settings where key='notify_since';
    v_start := greatest(coalesce(v_start,v_now),v_now-interval '3 days');
    insert into public.ops_notifications(kind,bot,dedupe_key,payload)
      select 'payment','sales','pay:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id) from public.payment_orders po
        where po.paid_at>=v_start and po.status in ('paid','refunded','canceled')
      union all
      select 'refund','sales','refund:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id) from public.payment_orders po
        where po.status in ('refunded','canceled') and po.paid_at is not null and coalesce(po.refunded_at,po.updated_at)>=v_start
      union all
      select 'request','ops','req:'||q.id::text,jsonb_build_object('requestId',q.id,'paymentOrderId',q.payment_order_id,'reportId',q.report_id) from public.order_requests q
        where q.created_at>=v_start
      on conflict (dedupe_key) do nothing;
    get diagnostics v_swept = row_count;
    return jsonb_build_object('ok',true,'added',v_n,'swept',v_swept);
  elsif p_action='order' then
    return jsonb_build_object('ok',true,'order',public.ops_notify_order(p_data->>'paymentOrderId'));
  elsif p_action='item' then
    -- 대기표 한 줄과 그 대상(문의·주문·이용권 책)의 지금 사실.
    select coalesce(n.payload->>'paymentOrderId',q.payment_order_id),coalesce(n.payload->>'reportId',q.report_id) into v_order,v_report
      from public.ops_notifications n left join public.order_requests q on q.id=nullif(n.payload->>'requestId','')::uuid where n.id=(p_data->>'id')::bigint;
    return (select jsonb_build_object('ok',true,'item',jsonb_build_object('id',n.id,'kind',n.kind,'bot',n.bot,'payload',n.payload,'state',n.state,'messageId',n.message_id,
        'createdAt',n.created_at,'sentAt',n.sent_at,'closedAt',n.closed_at,'closedLine',n.closed_line,'attempts',n.attempts,'lastError',n.last_error),
      'request',(select jsonb_build_object('id',q.id,'reason',q.reason,'status',q.status,'resolution',q.resolution,'resolvedBy',q.resolved_by,'resolvedAt',q.resolved_at,
        'createdAt',q.created_at,'device',q.device,'paymentOrderId',q.payment_order_id,'reportId',q.report_id) from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid),
      'order',case when v_order is not null then public.ops_notify_order(v_order) end,
      'ticket',case when v_order is null and v_report is not null then public.ops_notify_ticket(v_report) end,
      'duplicates',case when v_order is not null then public.ops_notify_duplicates(v_order) else '[]'::jsonb end,
      'regenFailedBefore',exists(select 1 from public.ops_notifications o2 where o2.id<>n.id and o2.state->>'regenFailed'='true'
        and ((v_order is not null and coalesce(o2.payload->>'paymentOrderId',(select q2.payment_order_id from public.order_requests q2 where q2.id=nullif(o2.payload->>'requestId','')::uuid))=v_order)
          or (v_order is null and v_report is not null and o2.payload->>'reportId'=v_report))),
      'failed',(select jsonb_build_object('id',f.id,'kind',f.kind,'attempts',f.attempts,'lastError',f.last_error,'createdAt',f.created_at) from public.ops_notifications f where f.id=nullif(n.payload->>'notificationId','')::bigint))
      from public.ops_notifications n where n.id=(p_data->>'id')::bigint);
  elsif p_action='open_items' then
    -- 버튼이 남은 처리 봇 메시지(보낸 것, 아직 정리 안 됨).
    select coalesce(jsonb_agg(n.id order by n.id),'[]'::jsonb) into v_res from public.ops_notifications n
      where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.kind in ('request','unpublished');
    return jsonb_build_object('ok',true,'ids',v_res);
  elsif p_action='begin_action' then
    -- 버튼 동작 하나만(두 번 눌러도·텔레그램이 다시 보내도 한 번). 정리된 메시지는 거절.
    update public.ops_notifications set state=state||jsonb_build_object('working',p_data->>'action','workingAt',v_now,'touchedAt',v_now)
      where id=(p_data->>'id')::bigint and closed_at is null and not (state ? 'working');
    return jsonb_build_object('ok',found);
  elsif p_action='patch_state' then
    update public.ops_notifications set state=(state - coalesce(array(select jsonb_array_elements_text(coalesce(p_data->'remove','[]'::jsonb))),'{}'::text[]))
        || coalesce(p_data->'set','{}'::jsonb) || jsonb_build_object('touchedAt',v_now)
      where id=(p_data->>'id')::bigint and closed_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='close' then
    update public.ops_notifications set closed_at=v_now,closed_line=left(p_data->>'line',400),state=(state - 'working' - 'workingAt' - 'pin')||coalesce(p_data->'set','{}'::jsonb)
      where id=(p_data->>'id')::bigint and closed_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='pin_waiting' then
    select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'pin',n.state->'pin','messageId',n.message_id) order by n.id),'[]'::jsonb) into v_res
      from public.ops_notifications n where n.bot='ops' and n.closed_at is null and n.state ? 'pin';
    return jsonb_build_object('ok',true,'items',v_res);
  elsif p_action='pending' then
    select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'kind',n.kind,'messageId',n.message_id,'createdAt',n.created_at,'payload',n.payload,
        'orderCode',(select x.order_code from public.order_records x where x.payment_order_id=coalesce(n.payload->>'paymentOrderId',(select q.payment_order_id from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid))),
        'reason',(select q.reason from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid)) order by n.id),'[]'::jsonb) into v_res
      from public.ops_notifications n where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.kind in ('request','unpublished');
    return jsonb_build_object('ok',true,'items',v_res,'failed',(select coalesce(jsonb_agg(jsonb_build_object('id',f.id,'kind',f.kind,'bot',f.bot,'attempts',f.attempts,'lastError',f.last_error,'createdAt',f.created_at) order by f.id),'[]'::jsonb)
      from public.ops_notifications f where f.sent_at is null and f.attempts>=10));
  elsif p_action='remind' then
    -- 12시간 동안 손대지 않은 처리 건은 1번만 「미처리 N건」으로 다시 알린다.
    with t as (update public.ops_notifications n set reminded_at=v_now where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.reminded_at is null
                 and n.kind in ('request','unpublished') and coalesce((n.state->>'touchedAt')::timestamptz,n.sent_at)<v_now-interval '12 hours' returning n.id)
    select count(*) into v_n from t;
    if v_n>0 then perform public.ops_notify_enqueue('reminder','ops','remind:'||to_char(v_now at time zone 'Asia/Seoul','YYYYMMDDHH24MISS'),jsonb_build_object('count',v_n)); end if;
    return jsonb_build_object('ok',true,'reminded',v_n);
  elsif p_action='seen' then
    insert into public.ops_bot_updates(bot,update_id) values(p_data->>'bot',(p_data->>'updateId')::bigint) on conflict do nothing;
    get diagnostics v_n = row_count;
    return jsonb_build_object('ok',true,'fresh',v_n=1);
  elsif p_action='wake' then
    insert into public.ops_notify_wakes(minute) values(date_trunc('minute',v_now)) on conflict (minute) do update set calls=public.ops_notify_wakes.calls+1 returning calls into v_n;
    return jsonb_build_object('ok',true,'allowed',v_n<=least(greatest(coalesce((p_data->>'max')::integer,30),1),120),'calls',v_n);
  elsif p_action='purge' then
    delete from public.ops_bot_updates where created_at<v_now-interval '3 days';
    delete from public.ops_notify_wakes where minute<v_now-interval '1 day';
    delete from public.ops_notifications where (closed_at is not null and closed_at<v_now-interval '90 days') or (sent_at is not null and closed_at is null and bot='sales' and sent_at<v_now-interval '90 days');
    return jsonb_build_object('ok',true);
  elsif p_action='stats' then
    -- 매출 봇 /today·/yesterday·/month. [start,end)는 서버가 한국 날짜로 넘긴다. 결제 = 그 기간에 결제 완료된 주문(뒤에 환불됐어도 결제로 센다).
    v_start := (p_data->>'start')::timestamptz; v_end := (p_data->>'end')::timestamptz;
    with pays as (select po.payment_order_id,po.product_type,po.amount,po.paid_at,public.ops_order_user(po.payment_order_id) uid from public.payment_orders po
                    where po.status in ('paid','refunded') and po.paid_at>=v_start and po.paid_at<v_end and not public.ops_test_user(public.ops_order_user(po.payment_order_id))),
         firsts as (select p.*, not exists(select 1 from public.payment_orders p2 where p2.status in ('paid','refunded') and p2.paid_at<p.paid_at and p.uid is not null
                    and public.ops_order_user(p2.payment_order_id)=p.uid) is_first from pays p),
         refs as (select po.amount from public.payment_orders po where po.status in ('refunded','canceled') and po.refunded_at>=v_start and po.refunded_at<v_end and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))
    select jsonb_build_object('ok',true,'payCount',(select count(*) from pays),'paySum',(select coalesce(sum(amount),0) from pays),
      'refundCount',(select count(*) from refs),'refundSum',(select coalesce(sum(amount),0) from refs),
      'newCount',(select count(*) from firsts where is_first),'repeatCount',(select count(*) from firsts where not is_first),
      'byProduct',(select coalesce(jsonb_agg(jsonb_build_object('productType',t.product_type,'count',t.c,'sum',t.s) order by t.s desc),'[]'::jsonb)
        from (select product_type,count(*) c,sum(amount) s from pays group by product_type) t)) into v_res;
    return v_res;
  elsif p_action='event_stats' then
    -- 매출 봇 /event: 1+1 증정 이용권(kind=event).
    return (select jsonb_build_object('ok',true,'issued',count(*),'usedSelf',count(*) filter (where gr.status='used_self'),
      'gifted',count(*) filter (where gr.status='gifted'),'claimed',count(*) filter (where gr.status='claimed'),
      'available',count(*) filter (where gr.status='available' and gr.expires_at>v_now),'revoked',count(*) filter (where gr.status='revoked'),
      'expired',count(*) filter (where gr.status='expired' or (gr.status='available' and gr.expires_at<=v_now)),
      'nextExpiry',min(gr.expires_at) filter (where gr.status in ('available','gifted') and gr.expires_at>v_now))
      from public.gift_rewards gr where gr.kind='event');
  elsif p_action='submit' then
    -- 서재 문의 접수. 확인 없이 바로 처리할 수 있는 두 사유만. 계정당 하루(한국 날짜) 3건, 주문·책마다 열린 요청 1개.
    v_user := nullif(p_data->>'userId','')::uuid; v_reason := p_data->>'reason'; v_order := nullif(p_data->>'paymentOrderId',''); v_report := nullif(p_data->>'reportId','');
    v_dev := nullif(left(regexp_replace(coalesce(p_data->>'device',''),'[\u0000-\u001f\u007f]','','g'),40),'');
    if v_reason is null or v_reason not in ('not_open','double_paid') then return jsonb_build_object('ok',false,'code','REASON_INVALID'); end if;
    if v_user is not null then
      select count(*) into v_n from public.order_requests where user_id=v_user and created_at>=v_day_start;
      if v_n>=3 then return jsonb_build_object('ok',false,'code','DAILY_LIMIT'); end if;
    end if;
    if v_order is not null then
      select * into v_po from public.payment_orders where payment_order_id=v_order;
      if not found or v_po.status<>'paid' then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
      if exists(select 1 from public.order_requests where payment_order_id=v_order and status='open') then return jsonb_build_object('ok',false,'code','ALREADY_OPEN'); end if;
      if v_reason='not_open' and v_po.paid_at>v_now-interval '30 minutes'
        and not exists(select 1 from public.paid_report_snapshots sn where sn.report_id=v_po.report_id and (sn.status in ('COMPLETED','FAILED_REQUIRES_ATTENTION','EXPIRED'))) then
        return jsonb_build_object('ok',false,'code','MAKING');
      end if;
      if v_reason='double_paid' and jsonb_array_length(public.ops_notify_duplicates(v_order))<2 then return jsonb_build_object('ok',false,'code','NO_DOUBLE'); end if;
      v_report := null;
    else
      if v_report is null or v_user is null then return jsonb_build_object('ok',false,'code','TARGET_REQUIRED'); end if;
      if v_reason<>'not_open' then return jsonb_build_object('ok',false,'code','REASON_INVALID'); end if;
      if not exists(select 1 from public.report_ticket_redemptions rr where rr.report_id=v_report and rr.user_id=v_user) then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
      if exists(select 1 from public.order_requests where report_id=v_report and payment_order_id is null and status='open') then return jsonb_build_object('ok',false,'code','ALREADY_OPEN'); end if;
      if exists(select 1 from public.report_ticket_redemptions rr where rr.report_id=v_report and rr.state in ('QUEUED','RUNNING') and rr.created_at>v_now-interval '30 minutes') then
        return jsonb_build_object('ok',false,'code','MAKING');
      end if;
    end if;
    begin
      insert into public.order_requests(payment_order_id,report_id,user_id,reason,memo,device) values(v_order,v_report,v_user,v_reason,'',v_dev) returning id into v_id;
    exception when unique_violation then return jsonb_build_object('ok',false,'code','ALREADY_OPEN');
    end;
    return jsonb_build_object('ok',true,'id',v_id);
  elsif p_action='card_results' then
    -- 서재 책 카드 한 줄: 열린 요청 또는 7일 안에 처리된 요청(주문·책마다 가장 최근 1건).
    select coalesce(jsonb_agg(jsonb_build_object('paymentOrderId',t.payment_order_id,'orderCode',t.order_code,'reportId',t.report_ref,'reason',t.reason,'status',t.status,
        'resolution',t.resolution,'resolvedAt',t.resolved_at,'createdAt',t.created_at)),'[]'::jsonb) into v_res
      from (select distinct on (coalesce(q.payment_order_id,q.report_id)) q.*,x.order_code,coalesce(q.report_id,po.report_id) report_ref
              from public.order_requests q left join public.order_records x on x.payment_order_id=q.payment_order_id left join public.payment_orders po on po.payment_order_id=q.payment_order_id
              where q.user_id=(p_data->>'userId')::uuid and (q.status='open' or q.resolved_at>v_now-interval '7 days')
              order by coalesce(q.payment_order_id,q.report_id),q.created_at desc) t;
    return jsonb_build_object('ok',true,'results',v_res);
  elsif p_action='resolve_request' then
    -- 처리 봇이 처리한 요청: 처리 완료 + 시각 + 방법.
    update public.order_requests set status='done',resolved_at=v_now,resolved_by='admin',resolution=p_data->>'resolution',
        admin_note=left(coalesce(nullif(p_data->>'note',''),'처리 봇: '||(p_data->>'resolution'))||' · '||to_char(v_now at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' (KST)',1000)
      where id=(p_data->>'requestId')::uuid and status='open';
    return jsonb_build_object('ok',found);
  elsif p_action='record_view' then
    -- 책 열람(서버가 본문을 내줄 때). 같은 기기로 30분 안에 다시 연 것은 세지 않는다. 페이지 이동은 서버 열람이 아니라 세지 않는다.
    v_report := p_data->>'reportId';
    if v_report is null or length(v_report) not between 8 and 120 then return jsonb_build_object('ok',false,'code','REPORT_INVALID'); end if;
    v_dev := p_data->>'device'; if v_dev is null or v_dev !~ '^[a-f0-9]{16}$' then v_dev := null; end if;
    insert into public.report_views as rv(report_id,payment_order_id,last_device)
      values(v_report,(select sn.order_id from public.paid_report_snapshots sn where sn.report_id=v_report),v_dev)
      on conflict (report_id) do update set
        view_count=rv.view_count+case when v_dev is not null and rv.last_device=v_dev and rv.last_counted_at>v_now-interval '30 minutes' then 0 else 1 end,
        last_counted_at=case when v_dev is not null and rv.last_device=v_dev and rv.last_counted_at>v_now-interval '30 minutes' then rv.last_counted_at else v_now end,
        last_viewed_at=v_now,last_device=coalesce(v_dev,rv.last_device);
    return jsonb_build_object('ok',true);
  elsif p_action='hold_retry' then
    -- 미발행 건에서 환불을 고르면 그 주문의 자동 재시도를 멈춘다(환불이 끝나면 기존 환불 처리가 작업을 확인 필요로 바꾼다).
    update public.report_generation_jobs set next_retry_at=v_now+interval '30 days',last_error_code='REFUND_HOLD'
      where order_id=p_data->>'paymentOrderId' and status in ('QUEUED','RETRYING');
    get diagnostics v_n = row_count;
    return jsonb_build_object('ok',true,'held',v_n);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $_$;

commit;

-- ── (선택) 새 객체까지 걷어내기 — 위 본문 복원만으로 지급·선물 거절·/event 집계는 예전 동작으로 돌아간다(새 함수는 부르는 코드가 없으면 쓰이지 않음).
-- 코드를 이전 배포로 되돌린 뒤에만 실행한다. 이미 지급된 가입 이용권(kind='signup')이 있으면 kind 제약을 좁히지 않는다(행이 남아 있음).
-- begin;
-- drop function if exists public.ops_signup(text, jsonb);
-- drop function if exists public.ops_funnel(text, jsonb);
-- drop function if exists public.ops_signup_switch(boolean, text);
-- drop table if exists public.funnel_daily;
-- drop table if exists public.signup_grant_hashes;
-- delete from public.ops_settings where key='signup_grant';
-- commit;
-- 지급만 멈추기(코드는 그대로): 처리 봇 [지급 멈춤] 또는  select public.ops_signup_switch(false,'rollback');
