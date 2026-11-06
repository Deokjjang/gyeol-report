-- P 추가 배포: migration 20261107090000 적용 전·후에 운영에서 돌리는 확인 SELECT(읽기 전용, 개인정보 열 없음).
-- 적용 전 결과와 migration NOTICE(PERF_D_BEFORE / PERF_D_UPDATED)가 같아야 한다. 다르면 migration이 스스로 중단(PERF_D_COUNT_MISMATCH).
-- D 대상: 2026-11-30 23:59:59 KST보다 늦게 끝나는 이번 이벤트·보상·수동 지급 이용권.
select 'gift_rewards(이벤트·보상, 늦은 기한)' what, kind, status, count(*) n, min(expires_at) min_exp, max(expires_at) max_exp
  from public.gift_rewards where kind in ('event','comp') and expires_at > '2026-11-30 23:59:59+09' group by kind, status order by kind, status;
select 'report_ticket_grants(옮긴·받은·보너스·출시 뒤 수동)' what, source_type, count(*) n, sum(quantity) qty
  from public.report_ticket_grants g where (g.expires_at is null or g.expires_at > '2026-11-30 23:59:59+09')
    and (g.idempotency_key like 'gift-self:%' or g.idempotency_key like 'gift-claim:%' or g.idempotency_key like 'gift-bonus:%' or (g.source_type='manual' and g.granted_at >= '2026-11-05 15:00:00+00'))
  group by source_type;
select 'comp_campaign_grants' what, count(*) n from public.comp_campaign_grants where expires_at > '2026-11-30 23:59:59+09';
select 'comp_grants' what, count(*) n from public.comp_grants where expires_at > '2026-11-30 23:59:59+09';
-- 누나 계정 수동 지급(5장 기대).
select 'sister manual' what, count(*) grants, sum(quantity) qty, min(expires_at) exp from public.report_ticket_grants where user_id='d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55' and source_type='manual';
-- 적용 뒤: 바뀐 행 기록.
-- select target, count(*) n, min(old_expires_at), max(old_expires_at), min(new_expires_at) from public.ticket_expiry_adjustments group by target;
-- B: 만료 작업이 다음 실행 때 지울 옛 입력·연락처(이미 기한 지난 v5 이전 책).
select 'B 옛 주문 입력(동의 기록 외)' what, count(*) n from public.payment_orders o join public.paid_report_snapshots s on s.order_id=o.payment_order_id
  where s.expires_at<=now() and (o.input_snapshot-'consentEvidence')<>'{}'::jsonb;
select 'B 구매자 연락처' what, count(*) n from public.order_records r join public.paid_report_snapshots s on s.order_id=r.payment_order_id
  where s.expires_at<=now() and (r.buyer_name is not null or r.buyer_email is not null or r.buyer_phone is not null);
