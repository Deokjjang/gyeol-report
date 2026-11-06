-- v5 배포 명령(2026-11-06) 직후 확인에서 찾은 결함: ops_gift('pending_orders')가 늘 실패한다.
--   ERROR: column reference "o.payment_order_id" is ambiguous
-- 원인: 함수에 PL/pgSQL 변수 o(payment_orders 행)·x(order_records 행)가 선언돼 있는데, 이 조회가 같은 이름을 표 별칭(o)·하위 조회 별칭(x)으로 쓴다.
-- 영향: 1+1 이벤트 이용권의 보조 발급(결제 완료 화면을 못 본 주문, 크론 /api/internal/ops-jobs 5분마다)만 멈춘다. 기본 발급(결제 완료 화면 → issue)은 별칭이 없어 정상.
--       고친 뒤 크론이 이벤트 기간 안의 아직 따지지 않은 주문(gift_checked_at is null)을 다시 찾으므로 그사이 빠진 주문도 채워진다.
-- 고침: 이 조회 한 곳에서만 별칭을 o → po, x → q로 바꾼다(함수 본문 좁은 치환, 고칠 자리가 정확히 1번이어야 함, 이미 고쳤으면 건너뜀). 기존 행 변경 없음.
-- 되돌리기: 같은 방식으로 반대 치환(새 문장 → 옛 문장).
begin;
set local lock_timeout = '5s';
create or replace function pg_temp.deploy_patch(p_sig regprocedure, p_old text, p_new text) returns void
language plpgsql as $$
declare def text; n integer; m integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  m := (length(def) - length(replace(def, p_new, ''))) / length(p_new);
  if n = 0 and m = 1 then return; end if;
  if n <> 1 then raise exception 'DEPLOY_PATCH_ANCHOR % [%] found % expected 1', p_sig, left(p_old, 70), n; end if;
  execute replace(def, p_old, p_new);
end $$;
select pg_temp.deploy_patch('public.ops_gift(text,jsonb)'::regprocedure,
$p$(select coalesce(jsonb_agg(x.payment_order_id),'[]') from (select r.payment_order_id from public.order_records r join public.payment_orders o on o.payment_order_id=r.payment_order_id
      where r.user_id is not null and r.gift_checked_at is null and o.status='paid' and o.paid_at>=(p_data->>'start')::timestamptz and o.paid_at<(p_data->>'end')::timestamptz
      order by o.paid_at limit 20) x)$p$,
$p$(select coalesce(jsonb_agg(q.payment_order_id),'[]') from (select r.payment_order_id from public.order_records r join public.payment_orders po on po.payment_order_id=r.payment_order_id
      where r.user_id is not null and r.gift_checked_at is null and po.status='paid' and po.paid_at>=(p_data->>'start')::timestamptz and po.paid_at<(p_data->>'end')::timestamptz
      order by po.paid_at limit 20) q)$p$);
commit;
