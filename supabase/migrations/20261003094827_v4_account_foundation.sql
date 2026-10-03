-- Prepared locally only. Do not apply before the account activation review.
create table public.account_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 40),
  provider text not null check (provider in ('kakao', 'google')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.account_consent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'marketing')),
  document_version text not null check (length(document_version) between 1 and 80),
  is_agreed boolean not null,
  required boolean not null,
  source text not null check (source in ('first_login', 'reconsent', 'withdrawal')),
  recorded_at timestamptz not null default now(),
  unique(user_id, request_id, consent_type),
  check (required = (consent_type in ('terms', 'privacy'))),
  check (source <> 'withdrawal' or (consent_type = 'marketing' and not is_agreed))
);
create index account_consent_user_latest_idx on public.account_consent_events(user_id, id desc);
alter table public.account_profiles enable row level security;
alter table public.account_consent_events enable row level security;
revoke all on public.account_profiles, public.account_consent_events from public, anon, authenticated, service_role;
grant select on public.account_profiles, public.account_consent_events to authenticated;
grant select, insert, update on public.account_profiles to service_role;
-- Consent history is append-only, including marketing withdrawal events.
grant select, insert on public.account_consent_events to service_role;
revoke all on sequence public.account_consent_events_id_seq from public, anon, authenticated, service_role;
grant usage, select on sequence public.account_consent_events_id_seq to service_role;
create policy account_profile_self on public.account_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy account_consent_self on public.account_consent_events for select to authenticated using ((select auth.uid()) = user_id);

-- SECURITY INVOKER: only the already privileged server role may execute.
-- No arbitrary user identity is accepted from a browser endpoint.
create function public.record_account_consent(p_user_id uuid, p_request_id uuid, p_display_name text, p_provider text, p_source text, p_records jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare item jsonb; existing jsonb;
begin
  if p_provider not in ('kakao','google') or p_source not in ('first_login','reconsent','withdrawal')
    or p_user_id is null or p_request_id is null or p_display_name is null
    or length(p_display_name) not between 1 and 40 or jsonb_typeof(p_records) <> 'array'
    or jsonb_array_length(p_records) not between 1 and 3 then return false; end if;
  -- Serialize a user's writes; retries cannot race profile activation or history.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user_id::text, 9));
  if (select count(distinct r->>'consent_type') from jsonb_array_elements(p_records) r) <> jsonb_array_length(p_records) then return false; end if;
  for item in select value from jsonb_array_elements(p_records) loop
    if item->>'consent_type' not in ('terms','privacy','marketing')
      or coalesce(length(item->>'document_version'),0) not between 1 and 80
      or jsonb_typeof(item->'is_agreed') is distinct from 'boolean'
      or jsonb_typeof(item->'required') is distinct from 'boolean'
      or (item->>'required')::boolean <> (item->>'consent_type' in ('terms','privacy')) then return false; end if;
  end loop;
  if p_source = 'withdrawal' then
    if jsonb_array_length(p_records) <> 1 or p_records->0->>'consent_type' <> 'marketing' or (p_records->0->>'is_agreed')::boolean then return false; end if;
  elsif not (p_records @> '[{"consent_type":"terms","is_agreed":true,"required":true},{"consent_type":"privacy","is_agreed":true,"required":true}]'::jsonb) then return false;
  end if;
  select jsonb_agg(jsonb_build_object('consent_type',consent_type,'document_version',document_version,'is_agreed',is_agreed,'required',required) order by consent_type)
    into existing from public.account_consent_events where user_id=p_user_id and request_id=p_request_id;
  if existing is not null then
    return existing = (select jsonb_agg(value order by value->>'consent_type') from jsonb_array_elements(p_records));
  end if;
  if p_source <> 'withdrawal' then
    insert into public.account_profiles(user_id,display_name,provider) values(p_user_id,p_display_name,p_provider)
      on conflict(user_id) do update set display_name=excluded.display_name, provider=excluded.provider, updated_at=now();
  end if;
  insert into public.account_consent_events(user_id,request_id,consent_type,document_version,is_agreed,required,source)
    select p_user_id,p_request_id,r->>'consent_type',r->>'document_version',(r->>'is_agreed')::boolean,(r->>'required')::boolean,p_source from jsonb_array_elements(p_records) r;
  return true;
end;
$$;
revoke all on function public.record_account_consent(uuid,uuid,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.record_account_consent(uuid,uuid,text,text,text,jsonb) to service_role;
