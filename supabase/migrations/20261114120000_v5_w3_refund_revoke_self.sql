-- W3 P2(D9, 덕짱님 결정 「used_self는 원장에서 안 쓴 것만 회수」): 결제가 환불되면(어느 경로든 — 자동·관리자·봇 refund_finish, 외부 환불 external_refund)
-- 그 주문으로 받은 증정 이용권을 「내가 쓰기」로 원장에 옮겨 둔 장(gift_rewards.status='used_self', 원장 grant source_ref='gift-self:<id>')이
-- 아직 쓰이지 않았으면 그 장만 거둔다(원장 EXPIRE −남은 수, 사유 REFUND_REVOKE, 증정 상태 revoked). 이미 책을 만든 장은 그대로 둔다(약관 13·환불정책 「아직 쓰지 않은 이용권」).
-- 큰 함수(ops_order·ops_recon)를 바꾸지 않으려 payment_orders 상태가 refunded로 바뀌는 때에 붙는 행 트리거로 한다. 비파괴(새 함수 1 + 트리거 1).
-- 이용권 사용(REDEEM)과 겹치지 않게 같은 사용자 잠금(report_ticket_publication과 같은 키)을 잡는다.
-- 되돌림: drop trigger ops_refund_revoke_self on public.payment_orders; drop function public.ops_refund_revoke_self();
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regclass('public.gift_rewards') is null or to_regclass('public.report_ticket_ledger') is null then raise exception 'W3_REFUND_REVOKE_PREREQUISITE_MISSING'; end if;
end $$;

create function public.ops_refund_revoke_self() returns trigger
language plpgsql security definer set search_path='' as $$
declare g record; lot record; v_left integer;
begin
  for g in select w.id, w.owner_user_id from public.gift_rewards w where w.source_order_id = new.payment_order_id and w.status = 'used_self' for update loop
    select x.id, x.user_id into lot from public.report_ticket_grants x where x.source_ref = 'gift-self:' || g.id and x.user_id = g.owner_user_id order by x.granted_at limit 1;
    if not found then continue; end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(lot.user_id::text, 10));
    select coalesce(sum(l.quantity_delta), 0)::integer into v_left from public.report_ticket_ledger l where l.grant_id = lot.id;
    if v_left > 0 then
      insert into public.report_ticket_ledger(user_id, grant_id, event_type, quantity_delta, idempotency_key, reason)
        values(lot.user_id, lot.id, 'EXPIRE', -v_left, 'refund-revoke:' || lot.id, 'REFUND_REVOKE')
        on conflict (idempotency_key) do nothing;
      update public.gift_rewards set status = 'revoked', token_hash = null where id = g.id;
    end if;
  end loop;
  return null;
end $$;
revoke all on function public.ops_refund_revoke_self() from public, anon, authenticated;

create trigger ops_refund_revoke_self after update of status on public.payment_orders
  for each row when (new.status = 'refunded' and old.status is distinct from 'refunded')
  execute function public.ops_refund_revoke_self();
commit;
