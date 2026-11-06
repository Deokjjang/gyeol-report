-- P 추가(2026-11-06) C·D·E·F·B — 운영 적용은 덕짱님 승인 후(docs/v5/perf/report.md "배포 순서").
-- 전제: 20261106200000_v5_deploy_gift_pending_alias.sql까지 적용.
--  C) 1+1: 이벤트 기간 회원 유료 결제 1건마다 1장, 계정당 상한 없음. 친구 첫 결제 보너스 없음('bonus'는 아무것도 주지 않는다).
--  D) 이번 이벤트 이용권(1+1·보상·수동 지급) 기한 = 2026-11-30 23:59:59 KST. 발급 기한은 서버 코드(src/lib/ops/config.ts ticketExpiresAt)가 넘긴다.
--     기존 행도 이 시각으로 당긴다(늦은 것만, 늘리지 않는다). 바꾼 행과 원래 기한은 ticket_expiry_adjustments에 남는다(되돌리기용).
--  E) 결제 화면: ops_gift('wallet')로 일반 이용권 + 남은 이벤트·보상 이용권을 함께 센다. ops_gift('spend')는 이 책에 쓸 1장을 기한이 가장 빠른 것부터 고른다.
--  F) 선물하기 창: 'link_next'(기한 가장 빠른 남은 1장에 링크), 'unlink'(공유 창을 그냥 닫으면 되돌림), wallet의 보낸 선물·받은 분 수.
--  P) 책 열기 소유 확인 book_share_owned(본문 없이 참·거짓).
--  B) 만료 작업: v5 이전 책의 기한이 지나면 주문의 옛 입력 칸(payment_orders.input_snapshot, 동의 기록 외)과 구매자 이름·이메일·전화(order_records)도 지운다.
--     남는 최소 기록: 주문번호·주문코드·상품·금액·일시·상태(내부 전용).
-- 되돌리기: docs/v5/perf/report.md "롤백" — 기한은 ticket_expiry_adjustments의 old_expires_at으로 되돌리고, 함수는 이 파일 앞 본문(pg_get_functiondef 보관본)으로.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ops_gift(text,jsonb)') is null or to_regprocedure('public.ops_comp(text,jsonb)') is null
    or to_regprocedure('public.ops_comp_campaign(text,jsonb)') is null or to_regprocedure('public.report_tickets(text,uuid,jsonb)') is null
    or to_regprocedure('public.paid_report_reliability(text,jsonb)') is null or to_regclass('public.comp_campaign_grants') is null then
    raise exception 'PERF_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.perf_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'PERF_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- ── C·D·E·F: ops_gift ─────────────────────────────────────────────
select pg_temp.perf_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$n integer; t jsonb;$p$,
  $p$n integer; t jsonb; g_avail integer; g_usable integer; g_sent integer; g_recv integer; g_exp timestamptz; l_exp timestamptz;$p$);
-- C: 계정당 상한 없음.
select pg_temp.perf_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$select count(*) into n from public.gift_rewards where owner_user_id=x.user_id and kind='event';$p$,
  $p$-- P 추가 C: 계정당 상한 없음(결제 1건마다 1장).$p$);
select pg_temp.perf_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$if n>=(p_data->>'maxPerAccount')::integer then return jsonb_build_object('ok',true,'issued',false,'code','ACCOUNT_LIMIT'); end if;$p$,
  $p$$p$);
-- D: 발급 기한은 코드가 넘긴 값(이번 이벤트 11-30 23:59:59 KST). 최종3의 「발급일로부터 30일을 넘지 않는다」 안전장치는 그대로 둔다(11-30은 그 안에 든다).
-- C: 친구 첫 결제 보너스 없음.
select pg_temp.perf_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$  elsif p_action='bonus' then$p$,
  $p$  elsif p_action='bonus' then
    -- P 추가 C: 친구 첫 결제 보너스는 없앴다. 배포 사이의 예전 호출에도 아무것도 주지 않는다.
    return jsonb_build_object('ok',true,'granted',false,'code','BONUS_REMOVED');$p$);
-- E·F: 새 동작(wallet·spend·link_next·unlink).
select pg_temp.perf_patch('public.ops_gift(text,jsonb)'::regprocedure,
  $p$  elsif p_action='peek' then$p$,
  $p$  elsif p_action='wallet' then
    -- P 추가 E·F: 이용권 지갑. ledger = 일반 이용권(원장, 받은 선물 포함) · giftable = 내가 선물할 수 있는 남은 이벤트·보상 이용권
    -- usable = 결제 화면에서 쓸 수 있는 장수(원장 + 남은 이벤트·보상, 선물 전용 제외) · total = 서재에 보이는 장수 · expiresAt = 가장 빠른 기한.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    update public.gift_rewards set status='expired' where owner_user_id=v_user and status in ('available','gifted') and expires_at<=now();
    t:=public.report_tickets('summary',v_user,'{}'::jsonb);
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','SUMMARY_FAILED'); end if;
    select count(*) filter (where status='available'), count(*) filter (where status='available' and not gift_only), min(expires_at) filter (where status='available'),
      count(*) filter (where status in ('gifted','claimed')), count(distinct recipient_user_id) filter (where status='claimed')
      into g_avail, g_usable, g_exp, g_sent, g_recv from public.gift_rewards where owner_user_id=v_user;
    select min((l->>'expiresAt')::timestamptz) into l_exp from jsonb_array_elements(coalesce(t->'lots','[]'::jsonb)) l where nullif(l->>'expiresAt','') is not null;
    n:=greatest(coalesce((t->>'quantity')::integer,0),0);
    return jsonb_build_object('ok',true,'ledger',n,'giftable',g_avail,'usable',n+g_usable,'total',n+g_avail,'expiresAt',least(l_exp,g_exp),'sent',g_sent,'recipients',g_recv);
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
  elsif p_action='peek' then$p$);

-- ── D: 보상 지급 기한(코드가 넘긴 expiresAt 우선) ─────────────────────
-- 넘긴 기한이 있어도 발급일로부터 30일(최종3 안전장치)을 넘지 않는다.
select pg_temp.perf_patch('public.ops_comp(text,jsonb)'::regprocedure,
  $p$exp:=now()+make_interval(days=>least(days,30));$p$,
  $p$exp:=least(coalesce(nullif(p_data->>'expiresAt','')::timestamptz,'infinity'::timestamptz),now()+make_interval(days=>least(days,30)));$p$);
select pg_temp.perf_patch('public.ops_comp_campaign(text,jsonb)'::regprocedure,
  $p$exp := now() + make_interval(days => days);$p$,
  $p$exp := least(coalesce(nullif(p_data->>'expiresAt','')::timestamptz, 'infinity'::timestamptz), now() + make_interval(days => days));$p$);
-- D: 기한 없이 들어온 지급(관리자 수동 지급 등)은 이번 이벤트 기한(11-30 23:59:59 KST), 그 뒤로는 발급일로부터 30일.
select pg_temp.perf_patch('public.report_tickets(text,uuid,jsonb)'::regprocedure,
  $p$jsonb_build_object('expiresAt',clock_timestamp()+interval '30 days'));$p$,
  $p$jsonb_build_object('expiresAt',case when clock_timestamp()<'2026-11-30 23:59:59+09'::timestamptz then '2026-11-30 23:59:59+09'::timestamptz else clock_timestamp()+interval '30 days' end));$p$);

-- ── B: 만료 작업에 옛 주문 입력·구매자 연락처 지우기 보탬 ──────────────────
select pg_temp.perf_patch('public.paid_report_reliability(text,jsonb)'::regprocedure,
  $p$delete from public.report_input_snapshots where expires_at<=now();$p$,
  $p$delete from public.report_input_snapshots where expires_at<=now();
    -- P 추가 B: v5 이전 책의 열람 기한이 지나면 주문 쪽 옛 입력 칸(이름·생년월일 등, 결제 전 동의 기록만 남김)과 구매자 연락처도 지운다.
    -- 남는 최소 기록(5년, 내부 전용): 주문번호·주문코드·상품·금액·일시·상태.
    -- 별칭은 이 함수의 행 변수 이름(o·r·s 등)과 겹치지 않게(겹치면 is ambiguous로 만료 작업 전체가 실패한다 — 20261106200000 교훈).
    update public.payment_orders pexp set input_snapshot=case when pexp.input_snapshot ? 'consentEvidence' then jsonb_build_object('consentEvidence',pexp.input_snapshot->'consentEvidence') else '{}'::jsonb end
      from public.paid_report_snapshots sexp where sexp.order_id=pexp.payment_order_id and sexp.expires_at<=now()
        and (pexp.input_snapshot-'consentEvidence')<>'{}'::jsonb;
    update public.order_records rexp set buyer_name=null,buyer_email=null,buyer_phone=null
      from public.paid_report_snapshots sexp where sexp.order_id=rexp.payment_order_id and sexp.expires_at<=now()
        and (rexp.buyer_name is not null or rexp.buyer_email is not null or rexp.buyer_phone is not null);$p$);

-- ── P 속도: 책 열기 소유 확인을 본문 없이 ─────────────────────────────
-- 예전 소유 확인(book_share_publication p_user)은 맞으면 책 본문(최대 1MB) 전체를 돌려줘서 책을 열 때 본문을 DB에서 두 번 받았다.
-- 판단은 같은 함수(referral_publication의 owner)로 하되 참·거짓만 돌려준다.
create or replace function public.book_share_owned(p_report text, p_user uuid) returns boolean
language sql volatile security invoker set search_path='' as $$
  select coalesce((select (p->>'owner')=p_user::text from (select public.referral_publication(p_report) p) v where p is not null), false)
$$;
revoke all on function public.book_share_owned(text,uuid) from public, anon, authenticated;
grant execute on function public.book_share_owned(text,uuid) to service_role;

-- ── D: 기존 행 기한 당기기(늦은 것만) + 기록 ─────────────────────────────
create table if not exists public.ticket_expiry_adjustments(
  id bigserial primary key,
  target text not null check(target in ('gift_rewards','report_ticket_grants','comp_campaign_grants','comp_grants')),
  row_key text not null,
  user_id uuid,
  old_expires_at timestamptz,
  new_expires_at timestamptz not null,
  reason text not null,
  adjusted_at timestamptz not null default now()
);
alter table public.ticket_expiry_adjustments enable row level security;
revoke all on public.ticket_expiry_adjustments from anon, authenticated;

do $$
declare target timestamptz := '2026-11-30 23:59:59+09'; launch timestamptz := '2026-11-05 15:00:00+00';
  n_gift integer; n_grant integer; n_camp integer; n_comp integer; b_gift integer; b_grant integer; b_camp integer; b_comp integer;
begin
  -- 대상(적용 전): 1+1·보상 gift_rewards 전부(상태 무관 — 기록 일치), 그것에서 나온 원장 이용권(gift-self·gift-claim·gift-bonus),
  -- v5 출시(2026-11-06 KST) 이후 수동 지급, 보상 기록 두 표. 이미 target 이전에 끝나는 행은 건드리지 않는다.
  select count(*) into b_gift from public.gift_rewards where kind in ('event','comp') and expires_at>target;
  select count(*) into b_grant from public.report_ticket_grants g where (g.expires_at is null or g.expires_at>target)
    and (g.idempotency_key like 'gift-self:%' or g.idempotency_key like 'gift-claim:%' or g.idempotency_key like 'gift-bonus:%' or (g.source_type='manual' and g.granted_at>=launch));
  select count(*) into b_camp from public.comp_campaign_grants where expires_at>target;
  select count(*) into b_comp from public.comp_grants where expires_at>target;
  raise notice 'PERF_D_BEFORE gift_rewards=% report_ticket_grants=% comp_campaign_grants=% comp_grants=%', b_gift, b_grant, b_camp, b_comp;

  insert into public.ticket_expiry_adjustments(target,row_key,user_id,old_expires_at,new_expires_at,reason)
    select 'gift_rewards', id::text, owner_user_id, expires_at, target, 'P_D_EVENT_EXPIRY_20261130' from public.gift_rewards where kind in ('event','comp') and expires_at>target;
  update public.gift_rewards set expires_at=target where kind in ('event','comp') and expires_at>target;
  get diagnostics n_gift = row_count;

  insert into public.ticket_expiry_adjustments(target,row_key,user_id,old_expires_at,new_expires_at,reason)
    select 'report_ticket_grants', g.id::text, g.user_id, g.expires_at, target, 'P_D_EVENT_EXPIRY_20261130' from public.report_ticket_grants g
    where (g.expires_at is null or g.expires_at>target)
      and (g.idempotency_key like 'gift-self:%' or g.idempotency_key like 'gift-claim:%' or g.idempotency_key like 'gift-bonus:%' or (g.source_type='manual' and g.granted_at>=launch));
  -- 이용권 원장은 감사용으로 수정이 막혀 있다(ticket_grants_immutable). 이 기한 당김만 같은 트랜잭션 안에서 잠시 풀고, 바꾼 행은 위 기록표에 남긴다.
  alter table public.report_ticket_grants disable trigger ticket_grants_immutable;
  update public.report_ticket_grants g set expires_at=target
    where (g.expires_at is null or g.expires_at>target)
      and (g.idempotency_key like 'gift-self:%' or g.idempotency_key like 'gift-claim:%' or g.idempotency_key like 'gift-bonus:%' or (g.source_type='manual' and g.granted_at>=launch));
  get diagnostics n_grant = row_count;
  alter table public.report_ticket_grants enable trigger ticket_grants_immutable;

  insert into public.ticket_expiry_adjustments(target,row_key,user_id,old_expires_at,new_expires_at,reason)
    select 'comp_campaign_grants', campaign_id::text||':'||user_id::text, user_id, expires_at, target, 'P_D_EVENT_EXPIRY_20261130' from public.comp_campaign_grants where expires_at>target;
  update public.comp_campaign_grants set expires_at=target where expires_at>target;
  get diagnostics n_camp = row_count;
  insert into public.ticket_expiry_adjustments(target,row_key,user_id,old_expires_at,new_expires_at,reason)
    select 'comp_grants', user_id::text, user_id, expires_at, target, 'P_D_EVENT_EXPIRY_20261130' from public.comp_grants where expires_at>target;
  update public.comp_grants set expires_at=target where expires_at>target;
  get diagnostics n_comp = row_count;
  raise notice 'PERF_D_UPDATED gift_rewards=% report_ticket_grants=% comp_campaign_grants=% comp_grants=%', n_gift, n_grant, n_camp, n_comp;
  if n_gift<>b_gift or n_grant<>b_grant or n_camp<>b_camp or n_comp<>b_comp then raise exception 'PERF_D_COUNT_MISMATCH'; end if;
end $$;
commit;
