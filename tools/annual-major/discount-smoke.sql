\set ON_ERROR_STOP on
begin;
-- 가상 회원(로컬 검수 계정)·세운 주문(결제됨, 2일 전)·세운 Book·입력 스냅숏·주문 기록
select id as uid from auth.users where email='v5-dev@gyeol.local' \gset
insert into public.payment_orders(payment_order_id, product_type, provider, amount, currency, status, input_snapshot, paid_at)
  values ('po_am_test_annual', 'annual_fortune', 'toss', 3900, 'KRW', 'paid', '{}'::jsonb, now() - interval '2 days');
update public.order_records set user_id = :'uid' where payment_order_id = 'po_am_test_annual';
insert into public.report_input_snapshots(order_id, payload_json) values ('po_am_test_annual', '{"reportInputPayload":{"productKey":"annual_fortune","person":{"name":"가상하나","birthDate":"1998-03-14","birthTime":"09:30","birthTimeUnknown":false,"gender":"FEMALE"}}}');
set session_replication_role = replica; -- 시험용: Book 무결성 제약(스냅숏 JSON) 대신 상태만 본다
insert into public.paid_report_snapshots(report_id, order_id, product_type, status) values ('report_amtestannual0001', 'po_am_test_annual', 'annual_fortune', 'QUEUED');
set session_replication_role = origin;
select '1 check(정상)', public.am_major_discount('check', jsonb_build_object('userId', :'uid', 'annualReportId', 'report_amtestannual0001'))->>'ok';
select '2 check(남의 계정)', public.am_major_discount('check', jsonb_build_object('userId', gen_random_uuid(), 'annualReportId', 'report_amtestannual0001'))->>'code';
select '3 reserve(첫 대운 주문)', public.am_major_discount('reserve', jsonb_build_object('userId', :'uid', 'annualOrderId', 'po_am_test_annual', 'majorOrderId', 'po_major_1', 'rate', 0.5, 'amount', 3450, 'originalAmount', 6900))->>'ok';
select '4 reserve(30분 안 둘째 주문)', public.am_major_discount('reserve', jsonb_build_object('userId', :'uid', 'annualOrderId', 'po_am_test_annual', 'majorOrderId', 'po_major_2', 'rate', 0.5, 'amount', 3450, 'originalAmount', 6900))->>'code';
select '5 check(예약 30분 안)', public.am_major_discount('check', jsonb_build_object('userId', :'uid', 'annualReportId', 'report_amtestannual0001'))->>'code';
update public.major_discount_uses set reserved_at = now() - interval '31 minutes' where annual_order_id = 'po_am_test_annual';
select '6 reserve(미결제 30분 지남 → 교체)', public.am_major_discount('reserve', jsonb_build_object('userId', :'uid', 'annualOrderId', 'po_am_test_annual', 'majorOrderId', 'po_major_3', 'rate', 0.5, 'amount', 3450, 'originalAmount', 6900))->>'ok';
insert into public.payment_orders(payment_order_id, product_type, provider, amount, currency, status, input_snapshot, paid_at) values ('po_major_3', 'major_fortune', 'toss', 3450, 'KRW', 'paid', '{}'::jsonb, now());
update public.major_discount_uses set reserved_at = now() - interval '2 hours' where annual_order_id = 'po_am_test_annual';
select '7 check(대운 결제됨 → 사용됨)', public.am_major_discount('check', jsonb_build_object('userId', :'uid', 'annualReportId', 'report_amtestannual0001'))->>'code';
select '8 reserve(결제된 뒤 교체 시도)', public.am_major_discount('reserve', jsonb_build_object('userId', :'uid', 'annualOrderId', 'po_am_test_annual', 'majorOrderId', 'po_major_4', 'rate', 0.5, 'amount', 3450, 'originalAmount', 6900))->>'code';
delete from public.major_discount_uses where annual_order_id = 'po_am_test_annual';
update public.payment_orders set status = 'refunded' where payment_order_id = 'po_am_test_annual';
select '9 check(세운 환불 → 회수)', public.am_major_discount('check', jsonb_build_object('userId', :'uid', 'annualReportId', 'report_amtestannual0001'))->>'code';
update public.payment_orders set status = 'paid', paid_at = now() - interval '8 days' where payment_order_id = 'po_am_test_annual';
select '10 check(7일 지남)', public.am_major_discount('check', jsonb_build_object('userId', :'uid', 'annualReportId', 'report_amtestannual0001'))->>'code';
rollback;
