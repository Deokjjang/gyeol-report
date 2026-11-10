-- F 후속 정정(2026-11-10 덕짱님 결정·배포 승인): 결제 증정 이용권(gift_rewards.kind='event') 기한 = 받은 날부터 30일.
-- 새로 나가는 이용권: 서버 코드(src/lib/ops/config.ts eventTicketExpiresAt = 지금 + 30일)가 정하고 ops_gift('issue')는 그대로
--   (받은 값과 now() + 30일 중 이른 쪽) — 함수 변경 없음.
-- 이 파일: 이미 나간 event 이용권을 발급 시각(created_at) + 30일로 늘린다. 늘리기만 하고 줄이지 않는다.
--   대상 = expires_at이 created_at + 30일보다 1분 넘게 이른 event 행(옛 코드가 11-30 23:59:59로 낸 것. 새 코드가 낸 것은 몇 ms 차이라 빠진다).
--   보상(comp, 11-30)·가입(signup, 7일)·관리자 지급·원장 이용권은 건드리지 않는다. 바꾼 행과 원래 기한은 ticket_expiry_adjustments에 남는다
--   (reason 'F_EVENT_TICKET_30D', 되돌리기 = old_expires_at으로 되돌림).
--   이미 원장(report_ticket_grants)으로 옮겨진 장(내가 쓰기·결제 화면 사용 'gift-self:<id>', 선물 받기 'gift-claim:<id>')은
--   원장이 바꿀 수 없는 기록(ticket_grants_immutable)이라 그대로 둔다. 그런 장 중 아직 안 쓰고 남은 것이 있으면 늘릴 방법이 없으므로
--   아무것도 바꾸지 않고 멈춘다(F_EVENT_30D_STOP). 기한이 지나 'expired'가 된 event 행이 있어도 멈춘다(되살리기는 따로 정한다).
--   운영 확인(2026-11-10 23:20 KST): event 2장(선물 받음 1 · 내가 씀 1), 두 장 모두 원장에서 이미 사용(남은 장 0), expired 0.
-- 순서: 코드 배포(READY) 뒤 적용 — 배포 전 옛 코드가 11-30으로 낸 이용권까지 늘린다. 다시 적용해도 대상 0.
begin;
do $$
declare b_rows integer; b_avail integer; b_gifted integer; b_expired integer; b_ledger_left integer; n integer;
begin
  perform 1 from public.gift_rewards where kind='event' for update;
  select count(*), count(*) filter (where status='available'), count(*) filter (where status='gifted'), count(*) filter (where status='expired')
    into b_rows, b_avail, b_gifted, b_expired
    from public.gift_rewards where kind='event' and expires_at < created_at + interval '30 days' - interval '1 minute';
  select count(*) into b_ledger_left
    from public.gift_rewards w join public.report_ticket_grants g on g.source_ref in ('gift-self:'||w.id::text, 'gift-claim:'||w.id::text)
    where w.kind='event' and g.expires_at < w.created_at + interval '30 days' - interval '1 minute' and g.expires_at > now()
      and (select coalesce(sum(l.quantity_delta),0) from public.report_ticket_ledger l where l.grant_id=g.id) > 0;
  raise notice 'F_EVENT_30D_BEFORE targets=% available=% gifted=% expired=% ledger_left=%', b_rows, b_avail, b_gifted, b_expired, b_ledger_left;
  if b_expired > 0 or b_ledger_left > 0 then raise exception 'F_EVENT_30D_STOP expired=% ledger_left=%', b_expired, b_ledger_left; end if;

  insert into public.ticket_expiry_adjustments(target,row_key,user_id,old_expires_at,new_expires_at,reason)
    select 'gift_rewards', g.id::text, g.owner_user_id, g.expires_at, g.created_at + interval '30 days', 'F_EVENT_TICKET_30D'
    from public.gift_rewards g where g.kind='event' and g.expires_at < g.created_at + interval '30 days' - interval '1 minute';
  update public.gift_rewards set expires_at = created_at + interval '30 days'
    where kind='event' and expires_at < created_at + interval '30 days' - interval '1 minute';
  get diagnostics n = row_count;
  raise notice 'F_EVENT_30D_UPDATED gift_rewards=%', n;
  if n <> b_rows then raise exception 'F_EVENT_30D_COUNT_MISMATCH'; end if;
end $$;
commit;
