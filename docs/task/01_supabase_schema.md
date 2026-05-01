Task 01 — Supabase Schema

# Task 01 — Supabase Schema
## Context
We are building **결리포트 / Gyeol Report**, a mobile-first Saju × MBTI self-narrative report service.
Task 00 created the initial Next.js project structure.
This task creates the initial Supabase/Postgres schema only.
Do not implement frontend pages, Saju calculation, MBTI analysis, LLM generation, or Toss Payments integration in this task.
Relevant SSOT:
- `docs/ssot/04_TECH_SPEC.md`
- `docs/ssot/05_DEVELOPMENT_PLAN.md`
## Goal
Create the V1 database migration and minimal server-side Supabase client placeholder structure.
## Target Files
Create or modify:
```txt
supabase/migrations/001_init.sql
src/lib/db/supabaseServer.ts
src/lib/db/supabaseClient.ts
src/lib/db/types.ts
.env.local.example

Requirements

1. Create Initial Migration

Create:

supabase/migrations/001_init.sql

The migration must create these tables:

reports
payments
interpretation_blocks
mbti_profiles
report_events

⸻

2. Required Extensions

At the top of the migration, enable UUID support:

create extension if not exists "pgcrypto";

Use gen_random_uuid() for UUID primary keys.

⸻

3. reports Table

Create:

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

⸻

4. payments Table

Create:

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

⸻

5. interpretation_blocks Table

Create:

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

⸻

6. mbti_profiles Table

Create:

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

⸻

7. report_events Table

Create:

create table if not exists report_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid null references reports(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

⸻

8. Indexes

Add indexes:

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

⸻

9. updated_at Trigger

Add a generic set_updated_at() function and triggers for tables with updated_at.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

Triggers:

reports
interpretation_blocks
mbti_profiles

Use drop trigger if exists ... before creating triggers so migration is rerunnable in local dev.

⸻

10. Row Level Security Policy

For V1, enable RLS on all tables but do not expose direct client writes.

alter table reports enable row level security;
alter table payments enable row level security;
alter table interpretation_blocks enable row level security;
alter table mbti_profiles enable row level security;
alter table report_events enable row level security;

Do not create permissive public policies in this task.

All writes are intended to go through server-side route handlers using service role credentials.

⸻

11. DB Type File

Create:

src/lib/db/types.ts

Add minimal shared DB literal types:

export type CalendarType = "SOLAR" | "LUNAR";
export type Gender = "MALE" | "FEMALE" | "OTHER_OR_UNSPECIFIED";
export type GenerationStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";
export type PaymentProvider = "TOSS";
export type ProviderPaymentStatus =
  | "READY"
  | "PAID"
  | "FAILED"
  | "CANCELED"
  | "REFUNDED";
export type BlockTone = "SOFT" | "DIRECT" | "BALANCED";

⸻

12. Server Supabase Client

Create:

src/lib/db/supabaseServer.ts

Use @supabase/supabase-js.

Requirements:

* Export createSupabaseServerClient().
* It must use:
    * NEXT_PUBLIC_SUPABASE_URL
    * SUPABASE_SERVICE_ROLE_KEY
* It must throw a clear error if required env vars are missing.
* It must be server-only.

Implementation shape:

import "server-only";
import { createClient } from "@supabase/supabase-js";
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

⸻

13. Browser Supabase Client Placeholder

Create:

src/lib/db/supabaseClient.ts

For now, create a minimal placeholder or anon client.

Rules:

* It may use NEXT_PUBLIC_SUPABASE_URL.
* It may use NEXT_PUBLIC_SUPABASE_ANON_KEY.
* It must not use service role key.
* No direct DB writes should be implemented in this task.

Acceptable:

import { createClient } from "@supabase/supabase-js";
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, anonKey);
}

⸻

14. Environment Example

Update or create:

.env.local.example

Required placeholders:

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
LLM_API_KEY=
LLM_MODEL=
REPORT_RESULT_TOKEN_SECRET=

⸻

Constraints

* Do not create frontend UI in this task.
* Do not create API routes in this task.
* Do not implement report generation.
* Do not implement payment logic.
* Do not implement Saju calculation.
* Do not seed interpretation blocks yet.
* Do not create permissive RLS policies.
* Do not commit real secrets.
* Do not expose service role key to the browser.
* Do not use Firebase.

Security

* Service role key must only be used in server-only code.
* Browser client must only use anon key.
* RLS must be enabled.
* No public insert/update/delete policy should be added.
* Payment amount must not be trusted from client, but actual payment logic is not implemented in this task.

Done Criteria

This task is complete only if:

supabase/migrations/001_init.sql exists
all 5 tables are defined
indexes are created
updated_at trigger exists
RLS is enabled on all tables
src/lib/db/types.ts exists
src/lib/db/supabaseServer.ts exists and is server-only
src/lib/db/supabaseClient.ts exists and does not use service role key
.env.local.example exists with placeholders only
pnpm lint passes
pnpm build passes
no business logic is added
no secrets are committed

Commands to Run

pnpm add @supabase/supabase-js
pnpm lint
pnpm build

If Supabase CLI is configured locally, also run:

supabase db reset

or apply the migration through the Supabase dashboard SQL editor.

Expected Output

After this task:

* The schema is ready for V1 report/payment/content data.
* Server-side code can later use createSupabaseServerClient().
* Client-side code cannot access service role credentials.
* No user-facing feature is implemented yet.

Report Back

After completion, report:

Created/modified files
Commands run
Migration apply result
Lint/build result
Any failures
Next recommended task

Next recommended task:

Task 02 — Saju Types and Constants