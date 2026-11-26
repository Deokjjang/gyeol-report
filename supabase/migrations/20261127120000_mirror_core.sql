-- 「남이 본 나」 D1 핵심 테이블(명령 1/3, 2026-11-27, docs/mirror/SPEC.md).
--  새 테이블 · 함수만 만든다. 기존 테이블 · 함수는 ALTER/DROP 하지 않는다.
--  브라우저는 이 테이블을 직접 읽거나 쓰지 않는다: RLS를 켜고 anon · authenticated 권한을 주지 않는다(서버 라우트의 service_role만).
--  선택값: 0 = A쪽, 1 = B쪽, 2 = 건너뜀(「잘 모르겠어요」, 친구 답만). 문항 id는 src/data/mirror/items.ts(면-번호, 예 soc-1).
--  이야기 · 마음 · 신고 · 보고서 호 테이블은 명령 2에서 별도 migration으로 만든다.
-- 되돌리기(출시 전, 데이터 없음):
--   drop function if exists public.mirror_save_profile(uuid,text,text,date,time,boolean);
--   drop function if exists public.mirror_owner_board(uuid);
--   drop table if exists public.mirror_handoffs, public.mirror_devices, public.mirror_friend_answers, public.mirror_friend_sessions,
--     public.mirror_self_answers, public.mirror_handle_history, public.mirror_profiles;
begin;
set local lock_timeout = '5s';

-- 프로필: 기존 계정과 같은 user_id. handle은 영문 소문자 · 숫자 · . · _ 3~20자(대소문자 무시 unique — 소문자로만 저장).
-- handle_changed_at: 마지막으로 아이디를 바꾼 시각(처음 만들 때는 null — 그 뒤 30일에 한 번).
create table public.mirror_profiles(
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 10),
  handle text not null check (handle ~ '^[a-z0-9._]{3,20}$'),
  handle_changed_at timestamptz,
  birth_date date check (birth_date between date '1900-01-01' and date '2100-12-31'),
  birth_time time,
  is_public boolean not null default true,
  age14_confirmed_at timestamptz not null,
  self_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (birth_time is null or birth_date is not null)
);
create unique index mirror_profiles_handle_lower_key on public.mirror_profiles(lower(handle));

-- 예전 아이디: 다른 사람이 다시 쓸 수 없고, 옛 주소(/@옛아이디)는 지금 아이디로 연결한다.
create table public.mirror_handle_history(
  handle text primary key check (handle ~ '^[a-z0-9._]{3,20}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  retired_at timestamptz not null default now()
);
create index mirror_handle_history_user_idx on public.mirror_handle_history(user_id);

-- 자가 답(사용자 × 문항 × 버전). 문항 문장을 바꾸면 버전이 올라가고, 옛 버전 답은 계산에서 빠진다. 완료 시각은 mirror_profiles.self_completed_at.
create table public.mirror_self_answers(
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null check (item_id ~ '^[a-z]{2,6}-[1-9]$'),
  item_version smallint not null check (item_version between 1 and 999),
  choice smallint not null check (choice in (0, 1)),
  answered_at timestamptz not null default now(),
  primary key (user_id, item_id, item_version)
);

-- 친구 세션: 로그인 없이 링크로 답하는 한 번의 방문. 기기 토큰은 해시(sha256 hex)만 둔다. 가입하면 linked_user_id로 이어 붙는다.
create table public.mirror_friend_sessions(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  closeness smallint not null check (closeness between 1 and 3),
  device_hash text not null check (device_hash ~ '^[0-9a-f]{64}$'),
  linked_user_id uuid references auth.users(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  golden boolean not null default false
);
create index mirror_friend_sessions_owner_idx on public.mirror_friend_sessions(owner_id, started_at);
create index mirror_friend_sessions_device_idx on public.mirror_friend_sessions(device_hash);
create index mirror_friend_sessions_linked_idx on public.mirror_friend_sessions(linked_user_id) where linked_user_id is not null;

-- 친구 답: 한 세션에서 같은 문항은 한 번.
create table public.mirror_friend_answers(
  session_id uuid not null references public.mirror_friend_sessions(id) on delete cascade,
  item_id text not null check (item_id ~ '^[a-z]{2,6}-[1-9]$'),
  item_version smallint not null check (item_version between 1 and 999),
  choice smallint not null check (choice in (0, 1, 2)),
  answered_at timestamptz not null default now(),
  primary key (session_id, item_id)
);

-- 로그인한 채 쓴 기기(주인 기기 답 제외용): 같은 기기 해시로 들어온 친구 세션은 그 주인의 친구 답에 넣지 않는다.
create table public.mirror_devices(
  device_hash text not null check (device_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (device_hash, user_id)
);
create index mirror_devices_user_idx on public.mirror_devices(user_id);

-- 다른 브라우저로 넘어갈 때(인앱 → 기본 브라우저) 쓰는 일회용 토큰: 10분, 한 번 쓰면 기기 토큰을 지운다. 토큰 자체는 해시만 둔다.
create table public.mirror_handoffs(
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  device_token text check (device_token ~ '^[A-Za-z0-9_-]{43}$'),
  next_path text not null check (char_length(next_path) between 1 and 200 and (next_path = '/' or next_path ~ '^/[^/]')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index mirror_handoffs_expires_idx on public.mirror_handoffs(expires_at);

alter table public.mirror_profiles enable row level security;
alter table public.mirror_handle_history enable row level security;
alter table public.mirror_self_answers enable row level security;
alter table public.mirror_friend_sessions enable row level security;
alter table public.mirror_friend_answers enable row level security;
alter table public.mirror_devices enable row level security;
alter table public.mirror_handoffs enable row level security;
revoke all on table public.mirror_profiles, public.mirror_handle_history, public.mirror_self_answers, public.mirror_friend_sessions,
  public.mirror_friend_answers, public.mirror_devices, public.mirror_handoffs from public, anon, authenticated, service_role;
grant select, insert, update on table public.mirror_profiles to service_role;
grant select, insert, delete on table public.mirror_handle_history to service_role;
grant select, insert, update, delete on table public.mirror_self_answers, public.mirror_friend_sessions, public.mirror_friend_answers,
  public.mirror_devices, public.mirror_handoffs to service_role;

-- 프로필 저장(처음 만들기 · 고치기). 아이디 중복 · 예전 아이디 · 30일 규칙을 한 트랜잭션에서 본다.
-- 반환: {"ok":true} 또는 {"ok":false,"code":"HANDLE_TAKEN"|"HANDLE_COOLDOWN"|"AGE_REQUIRED"|"INPUT_INVALID","until":…}.
create function public.mirror_save_profile(p_user uuid, p_name text, p_handle text, p_birth_date date, p_birth_time time, p_age14 boolean)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare cur public.mirror_profiles%rowtype; h text := lower(p_handle);
begin
  if p_user is null or p_name is null or char_length(p_name) not between 2 and 10 or h is null or h !~ '^[a-z0-9._]{3,20}$'
    or (p_birth_time is not null and p_birth_date is null) then
    return jsonb_build_object('ok', false, 'code', 'INPUT_INVALID');
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_handle:' || h, 0));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_user:' || p_user::text, 0));
  if exists(select 1 from public.mirror_handle_history x where x.handle = h and x.user_id <> p_user)
    or exists(select 1 from public.mirror_profiles x where lower(x.handle) = h and x.user_id <> p_user) then
    return jsonb_build_object('ok', false, 'code', 'HANDLE_TAKEN');
  end if;
  select * into cur from public.mirror_profiles where user_id = p_user for update;
  if not found then
    if p_age14 is distinct from true then return jsonb_build_object('ok', false, 'code', 'AGE_REQUIRED'); end if;
    insert into public.mirror_profiles(user_id, display_name, handle, birth_date, birth_time, age14_confirmed_at)
      values (p_user, p_name, h, p_birth_date, p_birth_time, now());
    return jsonb_build_object('ok', true);
  end if;
  if cur.handle <> h then
    if cur.handle_changed_at is not null and cur.handle_changed_at > now() - interval '30 days' then
      return jsonb_build_object('ok', false, 'code', 'HANDLE_COOLDOWN', 'until', cur.handle_changed_at + interval '30 days');
    end if;
    insert into public.mirror_handle_history(handle, user_id) values (cur.handle, p_user) on conflict (handle) do nothing;
    delete from public.mirror_handle_history where handle = h and user_id = p_user;
  end if;
  update public.mirror_profiles set display_name = p_name, handle = h, birth_date = p_birth_date, birth_time = p_birth_time,
    handle_changed_at = case when cur.handle <> h then now() else cur.handle_changed_at end, updated_at = now()
    where user_id = p_user;
  return jsonb_build_object('ok', true);
exception when unique_violation then
  return jsonb_build_object('ok', false, 'code', 'HANDLE_TAKEN');
end;
$$;
revoke all on function public.mirror_save_profile(uuid,text,text,date,time,boolean) from public, anon, authenticated;
grant execute on function public.mirror_save_profile(uuid,text,text,date,time,boolean) to service_role;

-- 주인 기록 한 번에 읽기: 친구 세션과 답(주인 기기 여부 포함). 서버만 부르고, 화면에는 계산한 숫자만 보낸다(익명).
create function public.mirror_owner_board(p_owner uuid) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id, 'closeness', s.closeness, 'golden', s.golden, 'startedAt', s.started_at,
      'ownerDevice', s.linked_user_id is not distinct from p_owner
        or exists(select 1 from public.mirror_devices d where d.device_hash = s.device_hash and d.user_id = p_owner),
      'answers', coalesce((select jsonb_agg(jsonb_build_array(a.item_id, a.item_version, a.choice) order by a.answered_at, a.item_id)
        from public.mirror_friend_answers a where a.session_id = s.id), '[]'::jsonb))
    order by s.started_at, s.id), '[]'::jsonb)
  from public.mirror_friend_sessions s where s.owner_id = p_owner;
$$;
revoke all on function public.mirror_owner_board(uuid) from public, anon, authenticated;
grant execute on function public.mirror_owner_board(uuid) to service_role;

commit;
