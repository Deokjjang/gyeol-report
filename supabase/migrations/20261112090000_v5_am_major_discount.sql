-- AM 3부(2026-11-11): 세운 → 대운 연결 할인. 결제 준비 쪽만 쓴다(승인 경로·쿠폰 칸·트리거는 건드리지 않는다).
-- 규칙: 세운 주문 1건당 1회 · 세운 결제 뒤 7일 안 · 같은 사람 입력(TS가 대조) · 금액은 서버가 정한다(저장 금액 = 결제 금액 검사 그대로).
-- 세운이 환불(요청·처리·완료)되면 쓰지 않은 할인은 쓸 수 없다(판정이 막는다). 이미 결제된 대운 할인은 그대로 둔다.
-- 예약: 세운 주문당 한 줄(유일 키). 대운 주문이 결제되지 않은 채 30분 지난 예약만 새 주문으로 바꿀 수 있다(결제 창을 닫고 다시 여는 경우).
begin;
set local lock_timeout = '5s';

create table public.major_discount_uses(
  annual_order_id text primary key references public.payment_orders(payment_order_id) on delete restrict,
  major_order_id text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  rate numeric(4,3) not null check(rate > 0 and rate < 1),
  amount integer not null check(amount >= 100),
  original_amount integer not null check(original_amount >= amount),
  reserved_at timestamptz not null default now()
);
alter table public.major_discount_uses enable row level security;
revoke all on table public.major_discount_uses from public, anon, authenticated;
grant select, insert, update on table public.major_discount_uses to service_role;

create or replace function public.am_major_discount(p_action text, p_data jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := nullif(p_data->>'userId', '')::uuid;
  v_report text := p_data->>'annualReportId';
  o record; u record; v_input jsonb;
begin
  if p_action = 'check' then
    if v_user is null or v_report is null or v_report !~ '^report_[a-z0-9]{13,64}$' then return jsonb_build_object('ok', false, 'code', 'INVALID'); end if;
    select po.payment_order_id, po.status, po.paid_at into o
      from public.paid_report_snapshots s join public.payment_orders po on po.payment_order_id = s.order_id
      join public.order_records r on r.payment_order_id = po.payment_order_id
      where s.report_id = v_report and s.product_type = 'annual_fortune' and r.user_id = v_user;
    if o.payment_order_id is null then return jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); end if;
    if o.status <> 'paid' or exists(select 1 from public.order_refunds f where f.payment_order_id = o.payment_order_id and f.state in ('requested', 'processing', 'done')) then
      return jsonb_build_object('ok', false, 'code', 'REFUNDED'); end if;
    if o.paid_at is null or o.paid_at < now() - interval '7 days' then return jsonb_build_object('ok', false, 'code', 'EXPIRED', 'paidAt', o.paid_at); end if;
    select * into u from public.major_discount_uses d where d.annual_order_id = o.payment_order_id;
    if u.annual_order_id is not null and (exists(select 1 from public.payment_orders m where m.payment_order_id = u.major_order_id and m.status = 'paid') or u.reserved_at > now() - interval '30 minutes') then
      return jsonb_build_object('ok', false, 'code', 'USED'); end if;
    select i.payload_json->'reportInputPayload' into v_input from public.report_input_snapshots i where i.order_id = o.payment_order_id and i.expires_at > now();
    if v_input is null then return jsonb_build_object('ok', false, 'code', 'INPUT_EXPIRED'); end if;
    return jsonb_build_object('ok', true, 'annualOrderId', o.payment_order_id, 'paidAt', o.paid_at, 'until', o.paid_at + interval '7 days', 'input', v_input);
  elsif p_action = 'reserve' then
    if v_user is null or (p_data->>'annualOrderId') is null or (p_data->>'majorOrderId') is null then return jsonb_build_object('ok', false, 'code', 'INVALID'); end if;
    insert into public.major_discount_uses(annual_order_id, major_order_id, user_id, rate, amount, original_amount)
      values(p_data->>'annualOrderId', p_data->>'majorOrderId', v_user, (p_data->>'rate')::numeric, (p_data->>'amount')::integer, (p_data->>'originalAmount')::integer)
      on conflict (annual_order_id) do update set major_order_id = excluded.major_order_id, rate = excluded.rate, amount = excluded.amount, original_amount = excluded.original_amount, reserved_at = now()
        where public.major_discount_uses.user_id = excluded.user_id and public.major_discount_uses.reserved_at <= now() - interval '30 minutes'
          and not exists(select 1 from public.payment_orders m where m.payment_order_id = public.major_discount_uses.major_order_id and m.status = 'paid');
    select * into u from public.major_discount_uses d where d.annual_order_id = p_data->>'annualOrderId';
    return case when u.major_order_id = p_data->>'majorOrderId' then jsonb_build_object('ok', true) else jsonb_build_object('ok', false, 'code', 'USED') end;
  end if;
  return jsonb_build_object('ok', false, 'code', 'UNKNOWN_ACTION');
end $$;
revoke all on function public.am_major_discount(text, jsonb) from public, anon, authenticated;
grant execute on function public.am_major_discount(text, jsonb) to service_role;
commit;
