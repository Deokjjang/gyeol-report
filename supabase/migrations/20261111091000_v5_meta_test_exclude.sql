-- v5 F 추가 3(2026-11-10 덕짱님 지시): 시험 계정(public.ops_test_user)의 메타 전송을 막는다. 결제 승인 코드는 건드리지 않는다 — DB 트리거·전송 단계에서 거른다.
--  1) meta_purchase_on_paid(결제 완료 트리거): 구매 회원이 시험 계정이면 대기표에 넣지 않는다(예외는 지금처럼 삼키므로 결제는 막히지 않는다).
--  2) queue_meta_purchase(결제 완료 화면 경로): 구매 회원·대기표 주인이 시험 계정이면 넣지 않는다.
--  3) meta_delivery_batch(5분 크론 서버 전송): claim·전송 직전 재확인(allowed)에서 시험 계정 줄을 뺀다(이미 들어 있던 줄도 나가지 않는다).
--  4) claim_meta_browser_events(브라우저 픽셀 거울): 시험 계정 줄·시험 계정 브라우저에는 주지 않는다.
-- 브라우저 픽셀·직접 전송(PageView·ViewContent·InitiateCheckout)은 서버가 시험 계정 세션을 본 브라우저에 남긴 「시험」 표시로 거른다(코드).
-- 되돌리기: docs/v5/free-book/rollback/meta_test_exclude.before-20261111091000.sql(적용 전 운영 본문 네 개).
begin;
set local lock_timeout = '5s';

do $$ begin
  if to_regprocedure('public.ops_test_user(uuid)') is null or to_regprocedure('public.meta_purchase_on_paid()') is null
    or to_regprocedure('public.queue_meta_purchase(text,text,text,text,uuid)') is null or to_regprocedure('public.meta_delivery_batch(text,text,uuid)') is null
    or to_regprocedure('public.claim_meta_browser_events(text,uuid)') is null then
    raise exception 'META_TEST_EXCLUDE_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.m_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'META_TEST_EXCLUDE_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

select pg_temp.m_patch('public.meta_purchase_on_paid()'::regprocedure,
  $p$  v_choice := public.meta_user_choice(v_user);$p$,
  $p$  if public.ops_test_user(v_user) then return null; end if;
  v_choice := public.meta_user_choice(v_user);$p$);

select pg_temp.m_patch('public.queue_meta_purchase(text,text,text,text,uuid)'::regprocedure,
  $p$  event_key:='purchase_'||md5('gyeol:paid-order:'||o.payment_order_id);$p$,
  $p$  if public.ops_test_user(v_owner) or public.ops_test_user(p_user) or public.ops_test_user(public.meta_order_buyer(o.payment_order_id,o.report_id)) then return false; end if;
  event_key:='purchase_'||md5('gyeol:paid-order:'||o.payment_order_id);$p$);

select pg_temp.m_patch('public.meta_delivery_batch(text,text,uuid)'::regprocedure,
  $p$        and (o.lease_until is null or o.lease_until<clock_timestamp())$p$,
  $p$        and (o.lease_until is null or o.lease_until<clock_timestamp())
        and not public.ops_test_user(o.user_id)$p$);
select pg_temp.m_patch('public.meta_delivery_batch(text,text,uuid)'::regprocedure,
  $p$      and (o.order_id is null or exists(select 1 from public.payment_orders p where p.payment_order_id=o.order_id and p.status='paid' and p.refunded_at is null and p.canceled_at is null and p.deleted_at is null))));$p$,
  $p$      and not public.ops_test_user(o.user_id)
      and (o.order_id is null or exists(select 1 from public.payment_orders p where p.payment_order_id=o.order_id and p.status='paid' and p.refunded_at is null and p.canceled_at is null and p.deleted_at is null))));$p$);

select pg_temp.m_patch('public.claim_meta_browser_events(text,uuid)'::regprocedure,
  $p$      and o.browser_dispatched_at is null and o.state in ('PENDING','SENT')$p$,
  $p$      and o.browser_dispatched_at is null and o.state in ('PENDING','SENT')
      and not public.ops_test_user(o.user_id) and not public.ops_test_user(p_user)$p$);

commit;
