create extension if not exists "pgcrypto";

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),

  result_token text unique not null,

  birth_date date not null,
  birth_time time null,
  birth_time_unknown boolean not null default false,

  calendar_type text not null check (calendar_type in ('SOLAR', 'LUNAR')),
  is_leap_month boolean null,

  gender text not null check (gender in ('MALE', 'FEMALE', 'OTHER_OR_UNSPECIFIED')),
  mbti text not null,

  calc_spec_version text not null,
  report_spec_version text not null,

  saju_result jsonb null,
  analysis_tags jsonb null,
  selected_blocks jsonb null,

  preview_text text null,
  full_report jsonb null,

  generation_status text not null default 'PENDING'
    check (generation_status in ('PENDING', 'GENERATING', 'READY', 'FAILED')),

  payment_status text not null default 'UNPAID'
    check (payment_status in ('UNPAID', 'PAID', 'REFUNDED')),

  error_message text null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz null
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),

  report_id uuid not null references reports(id) on delete restrict,

  provider text not null check (provider in ('TOSS')),
  order_id text unique not null,
  payment_key text unique null,

  amount integer not null check (amount > 0),
  currency text not null default 'KRW',

  status text not null default 'READY'
    check (status in ('READY', 'PAID', 'FAILED', 'CANCELED', 'REFUNDED')),

  raw_request jsonb null,
  raw_response jsonb null,

  created_at timestamptz not null default now(),
  paid_at timestamptz null,
  failed_at timestamptz null,
  refunded_at timestamptz null
);

create table if not exists interpretation_blocks (
  id uuid primary key default gen_random_uuid(),

  category text not null,
  block_key text not null,

  conditions jsonb not null default '[]'::jsonb,

  title text null,
  body text not null,

  tone text not null default 'BALANCED'
    check (tone in ('SOFT', 'DIRECT', 'BALANCED')),

  weight integer not null default 100,
  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(category, block_key)
);

create table if not exists mbti_profiles (
  type text primary key,

  ei text not null,
  sn text not null,
  tf text not null,
  jp text not null,

  traits jsonb not null default '[]'::jsonb,
  description text not null,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_events (
  id uuid primary key default gen_random_uuid(),

  report_id uuid null references reports(id) on delete set null,

  event_type text not null,
  payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists idx_reports_result_token on reports(result_token);
create index if not exists idx_reports_payment_status on reports(payment_status);
create index if not exists idx_reports_generation_status on reports(generation_status);
create index if not exists idx_reports_created_at on reports(created_at);

create index if not exists idx_payments_report_id on payments(report_id);
create index if not exists idx_payments_order_id on payments(order_id);
create index if not exists idx_payments_status on payments(status);

create index if not exists idx_interpretation_blocks_category on interpretation_blocks(category);
create index if not exists idx_interpretation_blocks_active on interpretation_blocks(active);

create index if not exists idx_report_events_report_id on report_events(report_id);
create index if not exists idx_report_events_event_type on report_events(event_type);
create index if not exists idx_report_events_created_at on report_events(created_at);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_reports_set_updated_at on reports;
create trigger trg_reports_set_updated_at
before update on reports
for each row
execute function set_updated_at();

drop trigger if exists trg_interpretation_blocks_set_updated_at on interpretation_blocks;
create trigger trg_interpretation_blocks_set_updated_at
before update on interpretation_blocks
for each row
execute function set_updated_at();

drop trigger if exists trg_mbti_profiles_set_updated_at on mbti_profiles;
create trigger trg_mbti_profiles_set_updated_at
before update on mbti_profiles
for each row
execute function set_updated_at();

alter table reports enable row level security;
alter table payments enable row level security;
alter table interpretation_blocks enable row level security;
alter table mbti_profiles enable row level security;
alter table report_events enable row level security;
