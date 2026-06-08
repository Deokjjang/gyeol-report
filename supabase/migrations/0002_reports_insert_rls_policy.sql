-- Allow local anon-key smoke inserts into reports without opening reads or writes.
-- RLS stays enabled; select/update/delete policies are intentionally absent.

alter table public.reports enable row level security;

grant usage on schema public to anon;
grant insert on table public.reports to anon;

drop policy if exists reports_insert_anon on public.reports;

create policy reports_insert_anon
on public.reports
for insert
to anon
with check (true);
