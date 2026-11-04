-- P6e-ops: 출시 전 운영 마무리. 로컬 개발 DB 전용 — 운영 적용은 승인 후(docs/v5/p6e-ops-report.md).
-- 전제: 20261104100000_v5_p6d_ops.sql 적용 후. 기존 행은 지우거나 바꾸지 않는다.
--  1) 고객 요청 자동 처리(환불·재생성·이용권 지급·외부 환불)  2) 환불 경고·토스 상태 대조·외부 환불 기록
--  3) 보상 이용권 A·B 두 등급(기본 꺼짐은 서버 설정)  4) 환불된 책 주소 판별
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regclass('public.ops_audit_log') is null or to_regprocedure('public.ops_gift(text,jsonb)') is null then raise exception 'P6E_PREREQUISITE_MISSING'; end if;
end $$;

-- 기존 함수 본문을 한 곳씩 고치는 도우미(이 트랜잭션 안에서만 존재). 고칠 자리가 정확히 expected번 나오지 않으면 중단한다.
create function pg_temp.p6e_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'P6E_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- 1. 고객 요청: 누가 처리했는지(관리자 직접 / 자동).
alter table public.order_requests add column resolved_by text check(resolved_by in ('admin','auto'));
update public.order_requests set resolved_by='admin' where status='done' and resolved_by is null;

create function public.ops_requests_autoclose(p_order text, p_label text) returns integer
language plpgsql security invoker set search_path='' as $$
declare n integer; c text;
begin
  update public.order_requests set status='done',resolved_at=now(),resolved_by='auto',
    admin_note=left('자동 처리: '||p_label||' · '||to_char(now() at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' (KST)',1000)
    where payment_order_id=p_order and status='open';
  get diagnostics n = row_count;
  if n>0 then
    select order_code into c from public.order_records where payment_order_id=p_order;
    insert into public.ops_audit_log(actor,action,target,detail) values('system','request_auto_done',coalesce(c,p_order),jsonb_build_object('count',n,'by',p_label));
  end if;
  return n;
end $$;

-- 관리자 직접 처리 표시 + 요청함에 처리 메모·시각 포함.
select pg_temp.p6e_patch('public.ops_admin(text,jsonb)'::regprocedure,
  $p$update public.order_requests set status='done',admin_note=left(p_data->>'note',1000),resolved_at=now() where$p$,
  $p$update public.order_requests set status='done',admin_note=left(p_data->>'note',1000),resolved_at=now(),resolved_by='admin' where$p$);
select pg_temp.p6e_patch('public.ops_admin(text,jsonb)'::regprocedure,
  $p$'paymentStatus',o.status,'buyerName',r.buyer_name) order by q0.created_at)$p$,
  $p$'paymentStatus',o.status,'buyerName',r.buyer_name,'adminNote',q0.admin_note,'resolvedAt',q0.resolved_at,'resolvedBy',q0.resolved_by) order by q0.created_at)$p$);
-- 환불이 끝나면 그 주문의 처리 전 요청을 자동으로 처리 완료로.
select pg_temp.p6e_patch('public.ops_order(text,jsonb)'::regprocedure,
  $p$get diagnostics n = row_count;$p$,
  $p$get diagnostics n = row_count;
      perform public.ops_requests_autoclose(f.payment_order_id,'환불 완료');$p$);

-- 2. 외부 환불(토스 상점관리자에서 직접 처리한 환불)을 기록할 수 있게.
alter table public.order_refunds drop constraint order_refunds_source_check;
alter table public.order_refunds add constraint order_refunds_source_check check(source in ('admin','auto','external'));

-- 3. 보상 이용권. 상품 범위(여러 상품 중 선택)를 담는 열 + 선물 링크 전용 보상.
alter table public.report_ticket_grants add column product_scopes text[]
  check(product_scopes is null or (cardinality(product_scopes) between 1 and 6
    and product_scopes <@ array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility','major_fortune','annual_fortune']));
-- 지급(grant)이 productScopes 배열을 저장하고, 사용(redeem)이 그 배열 안의 상품만 허용한다.
-- 원본 본문은 launch_event migration이 report_tickets_before_launch로 이름을 바꿔 감싼 뒤에는 그쪽에, 감싸기 전(시험 DB 등)에는 report_tickets에 있다.
do $$
declare target regprocedure:=coalesce(to_regprocedure('public.report_tickets_before_launch(text,uuid,jsonb)'),'public.report_tickets(text,uuid,jsonb)'::regprocedure);
begin
  perform pg_temp.p6e_patch(target,
    $p$and g.product_scope is not distinct from p_data->>'productScope','grantId',g.id);$p$,
    $p$and g.product_scope is not distinct from p_data->>'productScope'
        and g.product_scopes is not distinct from case when jsonb_typeof(p_data->'productScopes')='array' then array(select jsonb_array_elements_text(p_data->'productScopes')) end,'grantId',g.id);$p$);
  perform pg_temp.p6e_patch(target, $p$reason,expires_at,product_scope)$p$, $p$reason,expires_at,product_scope,product_scopes)$p$);
  perform pg_temp.p6e_patch(target,
    $p$p_data->>'productScope') returning * into g;$p$,
    $p$p_data->>'productScope',case when jsonb_typeof(p_data->'productScopes')='array' then array(select jsonb_array_elements_text(p_data->'productScopes')) end) returning * into g;$p$);
  perform pg_temp.p6e_patch(target,
    $p$and (x.product_scope is null or x.product_scope=p_data->>'productType')$p$,
    $p$and (x.product_scope is null or x.product_scope=p_data->>'productType')
      and (x.product_scopes is null or (p_data->>'productType')=any(x.product_scopes))$p$);
end $$;

alter table public.gift_rewards alter column source_order_id drop not null;
alter table public.gift_rewards add column kind text not null default 'event' check(kind in ('event','comp'));
alter table public.gift_rewards add column gift_only boolean not null default false;
alter table public.gift_rewards add column product_scopes text[];
alter table public.gift_rewards add constraint gift_rewards_source_kind_check check(kind='comp' or source_order_id is not null);

-- 이벤트 이용권 목록에 보상(주문 없음)도 보이게, 선물 링크 전용은 내가 쓸 수 없게, 범위를 이용권에 그대로 넘기게, 보상은 친구 보너스를 만들지 않게.
select pg_temp.p6e_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$'orderCode',r.order_code,'bonus',g.bonus_granted_at is not null) order by g.created_at desc),'[]') from public.gift_rewards g join public.order_records r on r.payment_order_id=g.source_order_id where g.owner_user_id=v_user));$p$,
  $p$'orderCode',r.order_code,'kind',g.kind,'giftOnly',g.gift_only,'bonus',g.bonus_granted_at is not null) order by g.created_at desc),'[]') from public.gift_rewards g left join public.order_records r on r.payment_order_id=g.source_order_id where g.owner_user_id=v_user));$p$);
select pg_temp.p6e_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$if w.status<>'available' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;$p$,
  $p$if w.gift_only then return jsonb_build_object('ok',false,'code','GIFT_LINK_ONLY'); end if;
      if w.status<>'available' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;$p$);
select pg_temp.p6e_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$'productScope',w.product_scope$p$, $p$'productScope',w.product_scope,'productScopes',to_jsonb(w.product_scopes)$p$, 3);
select pg_temp.p6e_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$where recipient_user_id=x.user_id and status='claimed' and bonus_granted_at is null$p$,
  $p$where recipient_user_id=x.user_id and kind='event' and status='claimed' and bonus_granted_at is null$p$);

-- 보상 지정(A)과 지급 기록.
create table public.comp_designations(
  user_id uuid primary key references auth.users(id) on delete cascade,
  order_code text not null check(order_code ~ '^GR-[2-9A-HJKMNP-Z]{4,6}$'),
  designated_by uuid,
  designated_at timestamptz not null default now()
);
create table public.comp_grants(
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null check(tier in ('A','B')),
  quantity integer not null check(quantity between 1 and 40),
  ticket_grant_ids uuid[] not null default '{}',
  gift_ids uuid[] not null default '{}',
  expires_at timestamptz not null,
  granted_at timestamptz not null default now()
);
alter table public.comp_designations enable row level security;
alter table public.comp_grants enable row level security;
revoke all on table public.comp_designations,public.comp_grants from public,anon,authenticated;
grant select,insert on table public.comp_designations to service_role;
grant select,insert,update on table public.comp_grants to service_role;

-- 보상 이용권. 등급: A(관리자가 지정한 결제 후 환불 고객) > B(기존 무료 이벤트 가입자 명단). 설정값(장수·유효일·상품)은 서버 코드가 넘긴다.
create function public.ops_comp(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare v_user uuid:=nullif(p_data->>'userId','')::uuid; d public.comp_designations%rowtype; g public.comp_grants%rowtype; po public.payment_orders%rowtype; o public.order_records%rowtype;
  v_tier text; has_d boolean; has_g boolean; self_qty integer; gift_qty integer; days integer; exp timestamptz; t jsonb; w public.gift_rewards%rowtype; gids uuid[]:='{}'; tids uuid[]:='{}';
  i integer; n integer; products jsonb:=coalesce(p_data->'products','[]'); lim integer:=least(coalesce((p_data->>'limit')::integer,100),500);
begin
  if p_action='sync' then
    -- 서재를 열 때마다(멱등): 등급 판정 → 가입 정보를 마친 계정만 지급. 이미 지급했으면 그 상태만 돌려준다.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,23));
    select * into d from public.comp_designations where user_id=v_user; has_d:=found;
    v_tier:=case when has_d then 'A' when exists(select 1 from public.upgrade_roster where user_id=v_user) then 'B' else null end;
    if v_tier is null then return jsonb_build_object('ok',true,'tier',null,'state','none'); end if;
    if not coalesce((p_data->>'enabled')::boolean,false) then return jsonb_build_object('ok',true,'tier',v_tier,'state','off'); end if;
    select * into g from public.comp_grants where user_id=v_user; has_g:=found;
    if has_g and (g.tier=v_tier or v_tier='B') then
      return jsonb_build_object('ok',true,'tier',g.tier,'state','granted','quantity',g.quantity,'expiresAt',g.expires_at,'fresh',false);
    end if;
    if not exists(select 1 from public.account_contacts where user_id=v_user) then return jsonb_build_object('ok',true,'tier',v_tier,'state','waiting_profile'); end if;
    if v_tier='B' then self_qty:=(p_data->>'bQty')::integer; gift_qty:=0; days:=(p_data->>'bDays')::integer;
    else self_qty:=greatest((p_data->>'aSelf')::integer-case when has_g then g.quantity else 0 end,0); gift_qty:=(p_data->>'aGift')::integer; days:=(p_data->>'aDays')::integer; end if;
    if jsonb_typeof(products)<>'array' or jsonb_array_length(products)=0 or coalesce(days,0)<1 or coalesce(self_qty,0)+coalesce(gift_qty,0)<1 then return jsonb_build_object('ok',false,'code','COMP_CONFIG_INVALID'); end if;
    exp:=now()+make_interval(days=>days);
    if self_qty>0 then
      t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',self_qty,'sourceType','promotion','sourceRef','comp:'||v_tier||':'||v_user,'key','comp:'||v_tier||':'||v_user,
        'reason','COMP_'||v_tier,'expiresAt',exp,'productScopes',products));
      if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
      tids:=array[(t->>'grantId')::uuid];
    end if;
    for i in 1..coalesce(gift_qty,0) loop
      insert into public.gift_rewards(owner_user_id,kind,gift_only,product_scopes,expires_at) values(v_user,'comp',true,array(select jsonb_array_elements_text(products)),exp) returning * into w;
      gids:=gids||w.id;
    end loop;
    insert into public.comp_grants(user_id,tier,quantity,ticket_grant_ids,gift_ids,expires_at) values(v_user,v_tier,self_qty+gift_qty,tids,gids,exp)
      on conflict(user_id) do update set tier=excluded.tier,quantity=public.comp_grants.quantity+excluded.quantity,
        ticket_grant_ids=public.comp_grants.ticket_grant_ids||excluded.ticket_grant_ids,gift_ids=public.comp_grants.gift_ids||excluded.gift_ids,
        expires_at=greatest(public.comp_grants.expires_at,excluded.expires_at);
    select * into g from public.comp_grants where user_id=v_user;
    return jsonb_build_object('ok',true,'tier',v_tier,'state','granted','quantity',g.quantity,'expiresAt',g.expires_at,'fresh',true);
  elsif p_action='designate' then
    -- 보상 A 지정: 주문코드 또는 토스 주문번호로 환불 완료 주문을 찾아 그 계정을 지정한다.
    select p.* into po from public.payment_orders p join public.order_records r on r.payment_order_id=p.payment_order_id
      where (nullif(p_data->>'orderCode','') is not null and r.order_code=upper(p_data->>'orderCode'))
         or (nullif(p_data->>'providerOrderId','') is not null and p.provider_order_id=p_data->>'providerOrderId') limit 1;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into o from public.order_records where payment_order_id=po.payment_order_id;
    if po.status<>'refunded' then return jsonb_build_object('ok',false,'code','NOT_REFUNDED','status',po.status,'orderCode',o.order_code); end if;
    v_user:=o.user_id;
    if v_user is null then select b.buyer_id into v_user from public.report_purchase_bindings b where b.order_id=po.payment_order_id and b.buyer_id is not null limit 1; end if;
    if v_user is null and o.buyer_email is not null then
      select count(*) into n from public.account_contacts where email=lower(o.buyer_email);
      if n=1 then select user_id into v_user from public.account_contacts where email=lower(o.buyer_email); end if;
    end if;
    if v_user is null then return jsonb_build_object('ok',false,'code','NO_ACCOUNT','orderCode',o.order_code); end if;
    insert into public.comp_designations(user_id,order_code,designated_by) values(v_user,o.order_code,nullif(p_data->>'adminUserId','')::uuid) on conflict do nothing;
    get diagnostics n = row_count;
    return jsonb_build_object('ok',true,'userId',v_user,'orderCode',o.order_code,'already',n=0);
  elsif p_action='admin' then
    -- 관리자 "기존 가입자" 탭: 등급·지급 상태·사용 여부와 등급별 인원. 가입 정보 입력 전이면 waiting_profile, 입력했는데 아직 안 넣었으면 ready.
    return (with base as (
        select dd.user_id,'A'::text tier,dd.order_code,dd.designated_at from public.comp_designations dd
        union all select u.user_id,'B',null,null from public.upgrade_roster u where not exists(select 1 from public.comp_designations dd where dd.user_id=u.user_id)),
      m as (
        select b.user_id,b.tier,b.order_code,c.email,f.last_login_at,gr.granted_at,gr.expires_at,coalesce(gr.quantity,0) quantity,
          case when gr.user_id is not null then 'granted' when c.user_id is not null then 'ready' else 'waiting_profile' end state,
          coalesce((select -sum(l.quantity_delta) from public.report_ticket_ledger l where l.grant_id=any(gr.ticket_grant_ids) and l.event_type not in ('GRANT','EXPIRE')),0)::integer used_tickets,
          coalesce(cardinality(gr.ticket_grant_ids),0) ticket_lots,
          (select count(*) from public.gift_rewards gw where gw.id=any(gr.gift_ids) and gw.status in ('used_self','gifted','claimed'))::integer used_gifts,
          coalesce(cardinality(gr.gift_ids),0) gift_lots
        from base b left join public.account_contacts c on c.user_id=b.user_id left join public.account_provider_facts f on f.user_id=b.user_id left join public.comp_grants gr on gr.user_id=b.user_id)
      select jsonb_build_object('ok',true,
        'counts',jsonb_build_object(
          'A',jsonb_build_object('total',count(*) filter (where tier='A'),'granted',count(*) filter (where tier='A' and state='granted'),'ready',count(*) filter (where tier='A' and state='ready'),
            'waitingProfile',count(*) filter (where tier='A' and state='waiting_profile'),'used',count(*) filter (where tier='A' and (used_tickets>0 or used_gifts>0))),
          'B',jsonb_build_object('total',count(*) filter (where tier='B'),'granted',count(*) filter (where tier='B' and state='granted'),'ready',count(*) filter (where tier='B' and state='ready'),
            'waitingProfile',count(*) filter (where tier='B' and state='waiting_profile'),'used',count(*) filter (where tier='B' and (used_tickets>0 or used_gifts>0)))),
        'members',coalesce((select jsonb_agg(jsonb_build_object('userId',x.user_id,'tier',x.tier,'orderCode',x.order_code,'email',x.email,'lastLoginAt',x.last_login_at,'state',x.state,'grantedAt',x.granted_at,
            'expiresAt',x.expires_at,'quantity',x.quantity,'usedTickets',x.used_tickets,'ticketLots',x.ticket_lots,'usedGifts',x.used_gifts,'giftLots',x.gift_lots)
          order by x.tier,x.last_login_at desc nulls last) from (select * from m order by tier,last_login_at desc nulls last limit lim) x),'[]')) from m);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- 4. 환불 경고 · 토스 상태 대조(외부 환불 기록) · 환불된 책 주소 판별 · 처리 전 요청 자동 처리.
create function public.ops_recon(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare po public.payment_orders%rowtype; r public.order_records%rowtype; n integer; v_used jsonb; v_pending integer; v_bonus boolean; v_after timestamptz; v_rows jsonb; lim integer:=least(coalesce((p_data->>'limit')::integer,25),50);
begin
  if p_action='refund_warnings' then
    -- 환불 확인 단계의 경고: (a) 이 주문으로 받은 이벤트 이용권이 이미 쓰였거나 친구가 받음 (b) 이 주문이 친구의 첫 결제라 보낸 사람에게 보너스가 나감.
    -- 회수하지 않는 정책(이미 나간 것)은 그대로이고, 안 쓴 이용권만 환불 때 회수된다.
    select * into po from public.payment_orders where payment_order_id=p_data->>'paymentOrderId';
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into r from public.order_records where payment_order_id=po.payment_order_id;
    select coalesce(jsonb_agg(jsonb_build_object('status',w.status,'at',coalesce(w.used_at,w.claimed_at)) order by coalesce(w.used_at,w.claimed_at)),'[]') into v_used
      from public.gift_rewards w where w.source_order_id=po.payment_order_id and w.status in ('used_self','claimed');
    select count(*) into v_pending from public.gift_rewards w where w.source_order_id=po.payment_order_id and w.status in ('available','gifted');
    v_bonus:=r.user_id is not null
      and exists(select 1 from public.gift_rewards w where w.recipient_user_id=r.user_id and w.kind='event' and w.bonus_granted_at is not null)
      and not exists(select 1 from public.order_records r2 join public.payment_orders p2 on p2.payment_order_id=r2.payment_order_id
        where r2.user_id=r.user_id and p2.status in ('paid','refunded') and p2.payment_order_id<>po.payment_order_id
          and (p2.paid_at<po.paid_at or (p2.paid_at=po.paid_at and p2.payment_order_id<po.payment_order_id)));
    return jsonb_build_object('ok',true,'giftUsed',v_used,'giftPendingRevoked',v_pending,'bonusSent',v_bonus);
  elsif p_action='toss_targets' then
    -- 토스 상태 확인 대상(결제 완료로 남아 있는 토스 주문). scope=legacy: 주문코드 도입 전 주문만. 커서 페이지.
    v_after:=nullif(p_data->>'afterAt','')::timestamptz;
    select coalesce(jsonb_agg(to_jsonb(t) order by t."createdAt",t."paymentOrderId"),'[]') into v_rows from (
      select x.order_code "orderCode",p0.payment_order_id "paymentOrderId",p0.provider_payment_id "paymentKey",p0.provider_order_id "providerOrderId",p0.amount,p0.created_at "createdAt",p0.paid_at "paidAt",x.legacy
      from public.payment_orders p0 join public.order_records x on x.payment_order_id=p0.payment_order_id
      where p0.status='paid' and p0.provider='toss' and p0.provider_payment_id is not null and (coalesce(p_data->>'scope','legacy')='all' or x.legacy)
        and (v_after is null or (p0.created_at,p0.payment_order_id)>(v_after,coalesce(p_data->>'afterId','')))
      order by p0.created_at,p0.payment_order_id limit lim+1) t;
    return jsonb_build_object('ok',true,'targets',(select coalesce(jsonb_agg(e),'[]') from (select e from jsonb_array_elements(v_rows) with ordinality a(e,i) where i<=lim) q),'more',jsonb_array_length(v_rows)>lim,
      'total',(select count(*) from public.payment_orders p0 join public.order_records x on x.payment_order_id=p0.payment_order_id
        where p0.status='paid' and p0.provider='toss' and p0.provider_payment_id is not null and (coalesce(p_data->>'scope','legacy')='all' or x.legacy)));
  elsif p_action='external_refund' then
    -- 토스가 CANCELED라고 알려 준 결제를 관리자 확인 뒤 '외부 환불'로 기록한다(서버가 토스를 다시 조회해 확인한 값만 들어온다).
    select * into po from public.payment_orders where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    if po.status='refunded' then return jsonb_build_object('ok',false,'code','ALREADY_REFUNDED'); end if;
    if po.status<>'paid' then return jsonb_build_object('ok',false,'code','NOT_PAID'); end if;
    if exists(select 1 from public.order_refunds where payment_order_id=po.payment_order_id) then return jsonb_build_object('ok',false,'code','REFUND_RECORD_EXISTS'); end if;
    if (p_data->>'amount')::integer is distinct from po.amount then return jsonb_build_object('ok',false,'code','AMOUNT_MISMATCH'); end if;
    insert into public.order_refunds(payment_order_id,state,source,reason,actor_user_id,amount,idempotency_key,attempts,provider_status,completed_at)
      values(po.payment_order_id,'done','external','토스 상점관리자에서 직접 환불(관리자 확인)',nullif(p_data->>'adminUserId','')::uuid,po.amount,'order-refund-'||gen_random_uuid(),0,'CANCELED',coalesce(nullif(p_data->>'canceledAt','')::timestamptz,now()));
    update public.payment_orders set status='refunded',refunded_at=coalesce(nullif(p_data->>'canceledAt','')::timestamptz,now()),updated_at=now() where payment_order_id=po.payment_order_id and status='paid';
    update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',last_error_code='ORDER_REFUNDED',lease_token=null,lease_until=null where order_id=po.payment_order_id and status in ('QUEUED','RETRYING');
    update public.gift_rewards set status='revoked',token_hash=null where source_order_id=po.payment_order_id and status in ('available','gifted');
    get diagnostics n = row_count;
    perform public.ops_requests_autoclose(po.payment_order_id,'외부 환불 기록');
    return jsonb_build_object('ok',true,'giftRevoked',n>0,'giftKept',(select status from public.gift_rewards where source_order_id=po.payment_order_id and status in ('used_self','claimed')));
  elsif p_action='report_refunded' then
    -- /reports/[id]: 이 Book의 주문이 환불됐는지(환불된 책 안내용). 책 내용은 돌려주지 않는다.
    return jsonb_build_object('ok',true,'refunded',exists(select 1 from public.payment_orders where report_id=p_data->>'reportId' and status='refunded'));
  elsif p_action='autoclose' then
    return jsonb_build_object('ok',true,'closed',public.ops_requests_autoclose(p_data->>'paymentOrderId',p_data->>'label'));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

revoke all on function public.ops_requests_autoclose(text,text),public.ops_comp(text,jsonb),public.ops_recon(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_requests_autoclose(text,text),public.ops_comp(text,jsonb),public.ops_recon(text,jsonb) to service_role;
commit;
