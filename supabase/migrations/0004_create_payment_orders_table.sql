-- Product-aware payment orders for one-report-per-payment flows.
-- Real provider checkout/approval routes are intentionally not implemented here.
-- RLS is enabled without anon table policies so future server-controlled routes
-- can mediate order creation and confirmation.

create table if not exists public.payment_orders (
  payment_order_id text primary key,
  product_type text not null,
  provider text not null,
  amount integer not null,
  currency text not null,
  status text not null,
  input_snapshot jsonb not null,
  provider_payment_id text,
  provider_order_id text,
  report_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  requested_at timestamptz,
  paid_at timestamptz,
  failed_at timestamptz,
  canceled_at timestamptz,
  refunded_at timestamptz,
  deleted_at timestamptz,

  constraint payment_orders_product_type_check
    check (
      product_type in (
        'saju_mbti_full',
        'saju_basic',
        'saju_full',
        'daewoon',
        'saewoon',
        'compatibility'
      )
    ),
  constraint payment_orders_provider_check
    check (provider in ('toss', 'kakao_pay')),
  constraint payment_orders_currency_check
    check (currency = 'KRW'),
  constraint payment_orders_amount_check
    check (amount > 0),
  constraint payment_orders_status_check
    check (status in ('ready', 'paid', 'failed', 'canceled', 'refunded'))
);

create unique index if not exists payment_orders_provider_payment_id_unique_idx
  on public.payment_orders (provider_payment_id)
  where provider_payment_id is not null;

create unique index if not exists payment_orders_provider_order_id_unique_idx
  on public.payment_orders (provider_order_id)
  where provider_order_id is not null;

create index if not exists payment_orders_status_idx
  on public.payment_orders (status);

create index if not exists payment_orders_provider_idx
  on public.payment_orders (provider);

create index if not exists payment_orders_product_type_idx
  on public.payment_orders (product_type);

create index if not exists payment_orders_created_at_idx
  on public.payment_orders (created_at);

create index if not exists payment_orders_report_id_idx
  on public.payment_orders (report_id);

alter table public.payment_orders enable row level security;
