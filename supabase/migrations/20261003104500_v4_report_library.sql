-- Prepared only: do NOT apply to Production in Phase 9C.
-- Prerequisites: Phase 9B auth, existing paid publication/expiry patches.
begin;
set local lock_timeout = '5s';
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.paid_report_snapshots'::regclass
    and conname='paid_report_snapshots_access_expiry_check' and convalidated) then
    raise exception 'EXISTING_FIRST_PUBLISH_EXPIRY_CONTRACT_REQUIRED';
  end if;
end $$;

create table public.report_purchase_bindings (
  order_id text primary key references public.payment_orders(payment_order_id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete restrict,
  claim_hash text unique check (claim_hash ~ '^[a-f0-9]{64}$'),
  claim_expires_at timestamptz not null default now()+interval '7 days',
  display_name text not null default '' check (length(display_name)<=83),
  selected_year text check (selected_year ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  check (buyer_id is null or claim_hash is null)
);
create index report_purchase_bindings_buyer_idx on public.report_purchase_bindings(buyer_id) where buyer_id is not null;

create table public.report_account_links (
  report_id text primary key references public.paid_report_snapshots(report_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  link_source text not null check (link_source in ('purchase','guest_claim')),
  linked_at timestamptz not null default now(),
  report_version text not null,
  revoked_at timestamptz
);
create index report_account_links_user_idx on public.report_account_links(user_id, linked_at desc);
alter table public.report_purchase_bindings enable row level security;
alter table public.report_account_links enable row level security;
-- Deliberately NO browser/own-row policies: all reads require getUser on server.
revoke all on public.report_purchase_bindings, public.report_account_links from public, anon, authenticated, service_role;
grant select, insert, update on public.report_purchase_bindings, public.report_account_links to service_role;
-- Invoker RPC joins and row locks must work even without old default grants.
grant select on public.payment_orders, public.paid_report_snapshots to service_role;
grant update(payment_order_id) on public.payment_orders to service_role;
grant update(report_id) on public.paid_report_snapshots to service_role;

-- Runs in the already-validated first-publish transaction; no job/expiry rewrite.
-- An unbound legacy order is a no-op. No snapshot is regenerated or copied.
create function public.link_published_report_account() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare b public.report_purchase_bindings%rowtype;
begin
  if new.status='EXPIRED' then
    update public.report_purchase_bindings set display_name='',claim_hash=null where order_id=new.order_id;
    return new;
  end if;
  if new.status<>'COMPLETED' or new.gate_version is distinct from 'paid-report-v1'
    or new.published_at is null or new.expires_at is null or new.expires_at<=now()
    or new.snapshot_json->>'reportId' is distinct from new.report_id
    or new.snapshot_json->>'productType' is distinct from new.product_type
    or nullif(new.snapshot_json->>'productVersion','') is null then return new; end if;
  select * into b from public.report_purchase_bindings where order_id=new.order_id;
  if b.buyer_id is null or b.revoked_at is not null or not exists (
    select 1 from public.payment_orders o where o.payment_order_id=new.order_id
      and o.report_id=new.report_id and o.status='paid' and o.deleted_at is null
  ) then return new; end if;
  insert into public.report_account_links(report_id,user_id,link_source,report_version)
    values(new.report_id,b.buyer_id,'purchase',new.snapshot_json->>'productVersion') on conflict(report_id) do nothing;
  return new;
end $$;
revoke all on function public.link_published_report_account() from public, anon, authenticated;
grant execute on function public.link_published_report_account() to service_role;
create trigger report_library_first_publish after insert or update on public.paid_report_snapshots
  for each row execute function public.link_published_report_account();

-- Includes abandoned/unpublished purchases when the EXISTING input purge runs.
create function public.purge_report_binding_personal_data() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  update public.report_purchase_bindings set display_name='',claim_hash=null where order_id=old.order_id;
  return old;
end $$;
revoke all on function public.purge_report_binding_personal_data() from public,anon,authenticated;
grant execute on function public.purge_report_binding_personal_data() to service_role;
create trigger report_library_input_purge after delete on public.report_input_snapshots
  for each row execute function public.purge_report_binding_personal_data();

-- Server inputs only. The service caller MUST getUser; a client UUID is never accepted.
-- Binding happens while ready, before the checkout payload leaves the server.
create function public.bind_report_purchase(p_order text,p_user uuid,p_hash text,p_name text,p_year text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare o public.payment_orders%rowtype; b public.report_purchase_bindings%rowtype;
begin
  select * into o from public.payment_orders where payment_order_id=p_order for update;
  if not found or o.status<>'ready' or o.deleted_at is not null
    or (p_user is null and (p_hash is null or p_hash !~ '^[a-f0-9]{64}$'))
    or (p_user is not null and p_hash is not null) then return false; end if;
  insert into public.report_purchase_bindings(order_id,buyer_id,claim_hash,display_name,selected_year)
    values(p_order,p_user,p_hash,p_name,p_year) on conflict(order_id) do nothing;
  select * into b from public.report_purchase_bindings where order_id=p_order;
  return b.buyer_id is not distinct from p_user and b.claim_hash is not distinct from p_hash
    and b.display_name=p_name and b.selected_year is not distinct from p_year and b.revoked_at is null;
end $$;

-- Read-only availability and atomic claim share the SAME checks and lock order.
-- Hash cannot be a read/share token; NULL, revoked, expired and unpublished fail closed.
create function public.claim_report_account(p_report text,p_user uuid,p_hash text,p_commit boolean default false)
returns text language plpgsql security invoker set search_path = '' as $$
declare r public.paid_report_snapshots%rowtype; b public.report_purchase_bindings%rowtype;
  l public.report_account_links%rowtype;
begin
  select * into r from public.paid_report_snapshots where report_id=p_report for update;
  if not found or r.status<>'COMPLETED' or r.gate_version is distinct from 'paid-report-v1'
    or r.published_at is null or r.expires_at is null or r.expires_at<=now()
    or r.snapshot_json->>'reportId' is distinct from r.report_id
    or r.snapshot_json->>'productType' is distinct from r.product_type
    or nullif(r.snapshot_json->>'productVersion','') is null
    or not exists (select 1 from public.payment_orders o where o.payment_order_id=r.order_id
      and o.report_id=r.report_id and o.status='paid' and o.deleted_at is null) then return 'unavailable'; end if;
  select * into b from public.report_purchase_bindings where order_id=r.order_id for update;
  if not found or b.revoked_at is not null then return 'unavailable'; end if;
  select * into l from public.report_account_links where report_id=r.report_id;
  if found then
    if l.user_id=p_user and l.revoked_at is null then return 'owned'; end if;
    return 'unavailable';
  end if;
  if b.buyer_id is not null or b.claim_hash is null or p_hash is null or b.claim_expires_at<=now()
    or p_hash !~ '^[a-f0-9]{64}$' or b.claim_hash<>p_hash then return 'unavailable'; end if;
  if not p_commit then return 'claimable'; end if;
  if p_user is null then return 'unavailable'; end if;
  insert into public.report_account_links(report_id,user_id,link_source,report_version)
    values(r.report_id,p_user,'guest_claim',r.snapshot_json->>'productVersion') on conflict(report_id) do nothing;
  select * into l from public.report_account_links where report_id=r.report_id;
  return case when l.user_id=p_user and l.revoked_at is null then 'owned' else 'unavailable' end;
end $$;

create function public.list_account_reports(p_user uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'reportId',r.report_id,'productType',r.product_type,'reportVersion',l.report_version,
    'displayName',case when r.expires_at>now() and r.status='COMPLETED' then b.display_name else '' end,
    'selectedYear',b.selected_year,'publishedAt',r.published_at,'expiresAt',r.expires_at,
    'status',case when r.expires_at<=now() or r.status='EXPIRED' then 'expired'
      when l.revoked_at is not null or b.revoked_at is not null or o.deleted_at is not null or o.status<>'paid'
        or r.status<>'COMPLETED' then 'unavailable' else 'available' end
  ) order by r.published_at desc,r.report_id), '[]'::jsonb)
  from public.report_account_links l join public.paid_report_snapshots r using(report_id)
    join public.payment_orders o on o.payment_order_id=r.order_id
    join public.report_purchase_bindings b on b.order_id=r.order_id
  where l.user_id=p_user and r.published_at is not null and r.expires_at is not null;
$$;
revoke all on function public.bind_report_purchase(text,uuid,text,text,text), public.claim_report_account(text,uuid,text,boolean), public.list_account_reports(uuid) from public, anon, authenticated;
grant execute on function public.bind_report_purchase(text,uuid,text,text,text), public.claim_report_account(text,uuid,text,boolean), public.list_account_reports(uuid) to service_role;
comment on table public.report_account_links is 'Primary account ownership, NOT share/read permission. UUID identity only. No automatic legacy backfill.';
comment on table public.report_purchase_bindings is 'Server-bound checkout intent; random guest capability SHA256 only. Claim lifetime ends at existing report expiry. Expiry worker purges name and proof.';
commit;
