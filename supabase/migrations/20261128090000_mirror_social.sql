-- 「남이 본 나」 D3~D6 테이블(명령 2/3, 2026-11-27, docs/mirror/SPEC.md 「친구 응답 흐름」 · 「공유」 · 「기록판과 결 보고서」 · 「이야기」).
--  CREATE만 한다: 기존 테이블 · 함수(20261127120000_mirror_core 포함)는 ALTER/DROP 하지 않는다.
--  브라우저는 이 테이블을 직접 읽거나 쓰지 않는다: RLS를 켜고 anon · authenticated 권한을 주지 않는다(서버 라우트의 service_role만).
--  담는 것: 공유 설정(한마디 · 친구 수 보이기) · 이야기 · 마음 · 신고 · 보고서 호 · 무효 세션 · 폭주 제한 · 사용된 아이디(탈퇴) + 함수 8개.
--  mirror_save_profile_v2는 v1과 같고 「탈퇴로 사용된 아이디」만 더 막는다(서버는 v2만 부른다. v1은 그대로 둔다).
-- 되돌리기(출시 전, 데이터 없음):
--   drop function if exists public.mirror_save_profile_v2(uuid,text,text,date,time,boolean), public.mirror_rate_hit(text,integer),
--     public.mirror_story_report(uuid,uuid), public.mirror_issue_report(uuid,integer,integer,jsonb), public.mirror_withdraw(uuid),
--     public.mirror_stories_view(uuid,uuid,text,integer,integer), public.mirror_space_top(uuid,timestamptz), public.mirror_item_counts(uuid);
--   drop table if exists public.mirror_story_hearts, public.mirror_story_reports, public.mirror_stories, public.mirror_report_issues,
--     public.mirror_session_voids, public.mirror_rate_hits, public.mirror_retired_handles, public.mirror_share_settings;
begin;
set local lock_timeout = '5s';

-- 공유 시트 설정: 카드 한마디(없으면 기본 문구) · 「답해 준 친구 수 보이기」(기본 꺼짐). 랜딩 · 링크 미리보기도 같은 값을 쓴다.
create table public.mirror_share_settings(
  user_id uuid primary key references auth.users(id) on delete cascade,
  line text check (line is null or char_length(line) between 1 and 20),
  show_count boolean not null default false,
  updated_at timestamptz not null default now()
);

-- 이야기: 친구가 응답 끝에 남긴 한 편(세션당 하나). 기본 익명 — 로그인한 친구가 고른 경우만 show_handle.
-- owner_device: 주인 본인 기기에서 쓴 이야기(「본인 작성」 표시). shared_at: 주인이 「모두에게 공유」를 켠 시각. hidden_at: 신고 3번으로 자동 숨김.
create table public.mirror_stories(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.mirror_friend_sessions(id) on delete set null,
  writer_user_id uuid references auth.users(id) on delete set null,
  show_handle boolean not null default false,
  owner_device boolean not null default false,
  kind text not null check (kind in ('funny', 'thanks', 'cool', 'better', 'surprise')),
  closeness smallint not null check (closeness between 1 and 3),
  body text not null check (char_length(body) between 1 and 500),
  shared_at timestamptz,
  hidden_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index mirror_stories_session_key on public.mirror_stories(session_id) where session_id is not null;
create index mirror_stories_owner_idx on public.mirror_stories(owner_id, created_at desc);
create index mirror_stories_shared_idx on public.mirror_stories(shared_at desc) where shared_at is not null and hidden_at is null;
create index mirror_stories_writer_idx on public.mirror_stories(writer_user_id) where writer_user_id is not null;

-- 마음(♥): 계정당 한 번. 신고: 계정당 한 번, 3번이면 숨김(mirror_story_report).
create table public.mirror_story_hearts(
  story_id uuid not null references public.mirror_stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);
create index mirror_story_hearts_at_idx on public.mirror_story_hearts(created_at);
create index mirror_story_hearts_user_idx on public.mirror_story_hearts(user_id);
create table public.mirror_story_reports(
  story_id uuid not null references public.mirror_stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);
create index mirror_story_reports_user_idx on public.mirror_story_reports(user_id);

-- 결 보고서 호: 발행할 때 숫자와 문장을 스냅샷으로 저장하고 다시 계산하지 않는다(src/lib/mirror/report/types.ts ReportSnapshot).
create table public.mirror_report_issues(
  owner_id uuid not null references auth.users(id) on delete cascade,
  issue_no integer not null check (issue_no between 1 and 100000),
  issued_at timestamptz not null default now(),
  answers integer not null check (answers >= 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  primary key (owner_id, issue_no)
);

-- 무효 세션: 사람이 불가능한 속도(문항당 0.3초 미만이 연속)로 들어온 답. 점수 · 순위 · 보고서 어디에도 넣지 않는다.
create table public.mirror_session_voids(
  session_id uuid primary key references public.mirror_friend_sessions(id) on delete cascade,
  reason text not null check (reason in ('too_fast')),
  voided_at timestamptz not null default now()
);

-- 폭주 제한: 같은 기기 토큰 · IP(해시만)의 짧은 시간 요청 수. 하루 지난 칸은 넣을 때 지운다.
create table public.mirror_rate_hits(
  key text not null check (key ~ '^[a-z]{2,10}:[a-z]{2,4}:[0-9a-f]{32}$'),
  window_start timestamptz not null,
  hits integer not null default 1 check (hits >= 1),
  primary key (key, window_start)
);
create index mirror_rate_hits_window_idx on public.mirror_rate_hits(window_start);

-- 탈퇴로 사용된 아이디: 계정 연결 없이 문자열만 남겨 다른 사람이 쓰지 못하게 한다. 옛 주소 이동도 하지 않는다(/@아이디 404).
create table public.mirror_retired_handles(
  handle text primary key check (handle ~ '^[a-z0-9._]{3,20}$'),
  retired_at timestamptz not null default now()
);

alter table public.mirror_share_settings enable row level security;
alter table public.mirror_stories enable row level security;
alter table public.mirror_story_hearts enable row level security;
alter table public.mirror_story_reports enable row level security;
alter table public.mirror_report_issues enable row level security;
alter table public.mirror_session_voids enable row level security;
alter table public.mirror_rate_hits enable row level security;
alter table public.mirror_retired_handles enable row level security;
revoke all on table public.mirror_share_settings, public.mirror_stories, public.mirror_story_hearts, public.mirror_story_reports, public.mirror_report_issues,
  public.mirror_session_voids, public.mirror_rate_hits, public.mirror_retired_handles from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.mirror_share_settings, public.mirror_stories, public.mirror_story_hearts, public.mirror_story_reports,
  public.mirror_session_voids, public.mirror_rate_hits to service_role;
grant select, insert on table public.mirror_report_issues to service_role;
grant select, insert on table public.mirror_retired_handles to service_role;

-- 프로필 저장 v2: v1(mirror_save_profile)과 같고, 탈퇴로 사용된 아이디(mirror_retired_handles)도 HANDLE_TAKEN으로 막는다.
create function public.mirror_save_profile_v2(p_user uuid, p_name text, p_handle text, p_birth_date date, p_birth_time time, p_age14 boolean)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare cur public.mirror_profiles%rowtype; h text := lower(p_handle);
begin
  if p_user is null or p_name is null or char_length(p_name) not between 2 and 10 or h is null or h !~ '^[a-z0-9._]{3,20}$'
    or (p_birth_time is not null and p_birth_date is null) then
    return jsonb_build_object('ok', false, 'code', 'INPUT_INVALID');
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_handle:' || h, 0));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_user:' || p_user::text, 0));
  if exists(select 1 from public.mirror_retired_handles x where x.handle = h)
    or exists(select 1 from public.mirror_handle_history x where x.handle = h and x.user_id <> p_user)
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

-- 폭주 제한 칸 하나 올리고 지금 칸의 수를 돌려준다(기준은 서버가 비교). 하루 지난 칸은 가끔 지운다.
create function public.mirror_rate_hit(p_key text, p_window_seconds integer)
returns integer language plpgsql security invoker set search_path = '' as $$
declare w timestamptz; n integer;
begin
  if p_window_seconds is null or p_window_seconds not between 10 and 86400 then raise exception 'MIRROR_RATE_WINDOW'; end if;
  w := pg_catalog.to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  if pg_catalog.random() < 0.02 then delete from public.mirror_rate_hits where window_start < now() - interval '1 day'; end if;
  insert into public.mirror_rate_hits(key, window_start) values (p_key, w)
    on conflict (key, window_start) do update set hits = public.mirror_rate_hits.hits + 1 returning hits into n;
  return n;
end;
$$;

-- 신고: 계정당 한 번. 3번째 신고에서 숨기고 hiddenNow를 돌려준다(서버가 운영 알림을 보낸다).
create function public.mirror_story_report(p_story uuid, p_user uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare s public.mirror_stories%rowtype; n integer;
begin
  select * into s from public.mirror_stories where id = p_story for update;
  if not found then return jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); end if;
  insert into public.mirror_story_reports(story_id, user_id) values (p_story, p_user) on conflict do nothing;
  select count(*)::integer into n from public.mirror_story_reports where story_id = p_story;
  if n >= 3 and s.hidden_at is null then
    update public.mirror_stories set hidden_at = now() where id = p_story;
    return jsonb_build_object('ok', true, 'count', n, 'hiddenNow', true);
  end if;
  return jsonb_build_object('ok', true, 'count', n, 'hiddenNow', false);
end;
$$;

-- 보고서 호 발행: 친구 답 60개부터, 마지막 발행 + 7일. 호 번호는 하나씩(동시에 두 번 눌러도 한 호만).
create function public.mirror_issue_report(p_owner uuid, p_issue_no integer, p_answers integer, p_snapshot jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare last public.mirror_report_issues%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_issue:' || p_owner::text, 0));
  if p_answers is null or p_answers < 60 then return jsonb_build_object('ok', false, 'code', 'NOT_READY'); end if;
  select * into last from public.mirror_report_issues where owner_id = p_owner order by issue_no desc limit 1;
  if found and last.issued_at > now() - interval '7 days' then
    return jsonb_build_object('ok', false, 'code', 'TOO_SOON', 'nextAt', last.issued_at + interval '7 days');
  end if;
  if p_issue_no <> coalesce(last.issue_no, 0) + 1 then return jsonb_build_object('ok', false, 'code', 'CONFLICT'); end if;
  insert into public.mirror_report_issues(owner_id, issue_no, answers, snapshot) values (p_owner, p_issue_no, p_answers, p_snapshot);
  return jsonb_build_object('ok', true, 'issueNo', p_issue_no);
end;
$$;

-- 이야기 목록(서버만): 받은 이야기(p_owner) 또는 모두의 이야기(p_owner null · 공유 · 안 숨김).
--  p_sort 'latest' | 'popular'. 쓴 사람 아이디는 show_handle이고 쓴 사람 프로필이 있을 때만. 받은 사람 · 쓴 사람 id는 돌려주지 않는다.
create function public.mirror_stories_view(p_viewer uuid, p_owner uuid, p_sort text, p_limit integer, p_offset integer)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.rank_key desc, x.created_at desc, x.id), '[]'::jsonb) from (
    select s.id, s.kind, s.body, s.closeness, (s.owner_device or exists(select 1 from public.mirror_friend_sessions fs where fs.id = s.session_id and (fs.linked_user_id = s.owner_id
        or exists(select 1 from public.mirror_devices d where d.device_hash = fs.device_hash and d.user_id = s.owner_id)))) as "ownerDevice", s.shared_at as "sharedAt", s.created_at,
      (s.hidden_at is not null) as hidden,
      case when s.show_handle then (select p.handle from public.mirror_profiles p where p.user_id = s.writer_user_id) end as handle,
      (select count(*) from public.mirror_story_hearts h where h.story_id = s.id)::integer as hearts,
      exists(select 1 from public.mirror_story_hearts h where h.story_id = s.id and h.user_id = p_viewer) as hearted,
      exists(select 1 from public.mirror_story_reports r where r.story_id = s.id and r.user_id = p_viewer) as reported,
      case when p_sort = 'popular' then (select count(*) from public.mirror_story_hearts h where h.story_id = s.id) else 0 end as rank_key
    from public.mirror_stories s
    where (p_owner is not null and s.owner_id = p_owner) or (p_owner is null and s.shared_at is not null and s.hidden_at is null)
    order by rank_key desc, s.created_at desc, s.id
    limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0)
  ) x;
$$;

-- 「이번 주 가장 많은 마음」: p_since 뒤에 받은 마음이 가장 많은 공유 이야기 하나(같으면 최근 공유).
create function public.mirror_space_top(p_viewer uuid, p_since timestamptz)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select row_to_json(x)::jsonb from (
    select s.id, s.kind, s.body, s.closeness, (s.owner_device or exists(select 1 from public.mirror_friend_sessions fs where fs.id = s.session_id and (fs.linked_user_id = s.owner_id
        or exists(select 1 from public.mirror_devices d where d.device_hash = fs.device_hash and d.user_id = s.owner_id)))) as "ownerDevice", s.shared_at as "sharedAt", s.created_at, false as hidden,
      case when s.show_handle then (select p.handle from public.mirror_profiles p where p.user_id = s.writer_user_id) end as handle,
      (select count(*) from public.mirror_story_hearts h where h.story_id = s.id)::integer as hearts,
      exists(select 1 from public.mirror_story_hearts h where h.story_id = s.id and h.user_id = p_viewer) as hearted,
      exists(select 1 from public.mirror_story_reports r where r.story_id = s.id and r.user_id = p_viewer) as reported,
      w.n as week
    from (select h.story_id, count(*) n from public.mirror_story_hearts h where h.created_at >= p_since group by h.story_id) w
    join public.mirror_stories s on s.id = w.story_id
    where s.shared_at is not null and s.hidden_at is null
    order by w.n desc, s.shared_at desc, s.id limit 1
  ) x;
$$;

-- 친구 묶음 고르기: 그 주인에게 쌓인 친구 답 수(문항별, 건너뜀 · 무효 세션 제외). {"soc-1": 3, …}
create function public.mirror_item_counts(p_owner uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_object_agg(x.item_id, x.n), '{}'::jsonb) from (
    select a.item_id, count(*)::integer n from public.mirror_friend_answers a join public.mirror_friend_sessions s on s.id = a.session_id
    where s.owner_id = p_owner and a.choice <> 2 and not exists(select 1 from public.mirror_session_voids v where v.session_id = s.id)
    group by a.item_id) x;
$$;

-- 탈퇴(기존 소프트 삭제 흐름에서 부른다 — src/lib/account/profile.ts). 한 트랜잭션:
--  지움: 프로필 · 자가 답 · 받은 친구 세션과 답 · 받은 이야기(모두의 이야기에 올린 것 포함, 마음 · 신고 같이) · 보고서 호 · 공유 설정 · 기기 · 내가 누른 마음 · 신고
--  익명으로 남김: 내가 남의 별자리에 남긴 답(세션 계정 연결만 끊음) · 내가 쓴 이야기(아이디 표시 끔)
--  아이디: 지금 아이디와 예전 아이디 모두 「사용됨」 문자열만 남긴다(계정 연결 없음, 옛 주소 이동 중단).
--  security definer: 기존 표(mirror_profiles 등)의 service_role 권한을 넓히지 않고(GRANT 변경 없음) 이 함수 안에서만 지운다. 실행은 service_role만.
create function public.mirror_withdraw(p_user uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_handles integer; v_received integer; v_stories integer; v_issues integer; v_anon_sessions integer; v_anon_stories integer;
begin
  if p_user is null then return jsonb_build_object('ok', false, 'code', 'INPUT_INVALID'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_user:' || p_user::text, 0));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('mirror_issue:' || p_user::text, 0));
  insert into public.mirror_retired_handles(handle)
    select handle from public.mirror_profiles where user_id = p_user
    union select handle from public.mirror_handle_history where user_id = p_user
    on conflict (handle) do nothing;
  get diagnostics v_handles = row_count;
  delete from public.mirror_handle_history where user_id = p_user;
  delete from public.mirror_stories where owner_id = p_user;
  get diagnostics v_stories = row_count;
  delete from public.mirror_report_issues where owner_id = p_user;
  get diagnostics v_issues = row_count;
  delete from public.mirror_friend_sessions where owner_id = p_user;
  get diagnostics v_received = row_count;
  delete from public.mirror_self_answers where user_id = p_user;
  delete from public.mirror_share_settings where user_id = p_user;
  update public.mirror_friend_sessions set linked_user_id = null where linked_user_id = p_user;
  get diagnostics v_anon_sessions = row_count;
  update public.mirror_stories set writer_user_id = null, show_handle = false where writer_user_id = p_user;
  get diagnostics v_anon_stories = row_count;
  delete from public.mirror_story_hearts where user_id = p_user;
  delete from public.mirror_story_reports where user_id = p_user;
  delete from public.mirror_devices where user_id = p_user;
  delete from public.mirror_profiles where user_id = p_user;
  return jsonb_build_object('ok', true, 'retiredHandles', v_handles, 'receivedSessions', v_received, 'receivedStories', v_stories, 'issues', v_issues,
    'anonymizedSessions', v_anon_sessions, 'anonymizedStories', v_anon_stories);
end;
$$;

revoke all on function public.mirror_save_profile_v2(uuid,text,text,date,time,boolean), public.mirror_rate_hit(text,integer), public.mirror_story_report(uuid,uuid),
  public.mirror_issue_report(uuid,integer,integer,jsonb), public.mirror_stories_view(uuid,uuid,text,integer,integer), public.mirror_space_top(uuid,timestamptz),
  public.mirror_item_counts(uuid), public.mirror_withdraw(uuid) from public, anon, authenticated;
grant execute on function public.mirror_save_profile_v2(uuid,text,text,date,time,boolean), public.mirror_rate_hit(text,integer), public.mirror_story_report(uuid,uuid),
  public.mirror_issue_report(uuid,integer,integer,jsonb), public.mirror_stories_view(uuid,uuid,text,integer,integer), public.mirror_space_top(uuid,timestamptz),
  public.mirror_item_counts(uuid), public.mirror_withdraw(uuid) to service_role;

commit;
