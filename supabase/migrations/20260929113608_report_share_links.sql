-- Additive only. Apply to production separately after review; no payment schema changes.
create table public.report_share_links (
  report_id text primary key references public.paid_report_snapshots(report_id) on delete cascade,
  token text not null unique check (token ~ '^gr_[A-Za-z0-9_-]{32}$'),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.report_share_links enable row level security;
revoke all on table public.report_share_links from public, anon, authenticated;
grant select, insert, update, delete on table public.report_share_links to service_role;

comment on table public.report_share_links is
  'Server-only opaque sharing capabilities. Every open also checks current paid status, publication and expiry.';
