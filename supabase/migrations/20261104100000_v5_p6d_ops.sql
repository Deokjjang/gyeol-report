-- P6d-ops: 판매·환불·공지 운영 기반 + 생성 신뢰성. 로컬 개발 DB 전용 — 운영 적용은 승인 후(docs/v5/p6d-ops-report.md).
-- 전제: 20261029130000_v5_writer_jobs.sql(이용권 v5 큐) 적용 후.
-- 기존 행은 지우거나 바꾸지 않는다. 기존 주문에 주문코드만 새로 붙인다(order_records, legacy=true).
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.report_ticket_publication(text,uuid,jsonb)') is null or to_regclass('public.report_writer_chapters') is null then raise exception 'P6D_PREREQUISITE_MISSING'; end if;
end $$;

-- 0. 운영 설정. profile_launch_at = 이 migration이 적용된 시각(정보 화면 공개 시각, 업그레이드 이용권 자격의 기준).
create table public.ops_settings(key text primary key check(key ~ '^[a-z_]{1,40}$'), value jsonb not null, updated_at timestamptz not null default now());
insert into public.ops_settings(key,value) values('profile_launch_at',to_jsonb(now()));

-- 1. 가입 정보(정보 화면). 계정당 1행.
create table public.account_contacts(
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check(length(full_name) between 1 and 40),
  email text not null check(length(email) between 6 and 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  email_source text not null check(email_source in ('provider','typed')),
  phone text check(phone ~ '^01[016789][0-9]{7,8}$'),
  marketing_opt_in boolean not null default false,
  -- 업그레이드 이용권(P6c 지급): none · eligible(기존 가입자 명단 + 가입 정보 완료) · granted
  upgrade_state text not null default 'none' check(upgrade_state in ('none','eligible','granted')),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 로그인 공급자가 준 사실(로그인 콜백마다 갱신). 이메일은 카카오 is_email_valid·is_email_verified가 모두 참일 때만 trusted.
-- kakao_channel: 결리포트 채널(@gyeolreport) 관계. null = 미확인(토큰 없음·plusfriends 동의 거부·조회 실패).
-- channel_reward: 이벤트 보상 연결용 상태만(기본 none = 보상 없음).
create table public.account_provider_facts(
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null check(provider in ('kakao','google')),
  email text check(email is null or (length(email) between 6 and 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$')),
  email_trusted boolean not null default false,
  kakao_channel text check(kakao_channel in ('added','blocked','none')),
  channel_checked_at timestamptz,
  channel_reward text not null default 'none' check(channel_reward in ('none','eligible','granted')),
  -- 카카오 이메일 추가 동의: 한 번만 묻는다(asked), 거부·유효하지 않으면 declined를 남기고 다시 묻지 않는다.
  email_consent_asked_at timestamptz,
  email_declined_at timestamptz,
  last_login_at timestamptz,
  updated_at timestamptz not null default now()
);
-- 기존 가입자 명단(오픈 이벤트 종료 시점 저장본, 2026-11-01 00:00 KST 전 가입). 업그레이드 이용권 자격의 기준.
create table public.upgrade_roster(
  user_id uuid primary key references auth.users(id) on delete cascade,
  joined_at timestamptz not null,
  captured_at timestamptz not null default now(),
  cutoff timestamptz not null
);
insert into public.upgrade_roster(user_id,joined_at,cutoff)
  select user_id,created_at,'2026-10-31T15:00:00Z'::timestamptz from public.account_profiles where created_at<'2026-10-31T15:00:00Z'::timestamptz on conflict do nothing;

-- 2. 주문 기록. 결제 주문(payment_orders)마다 1행: 짧은 주문코드 + 계정 + 구매자.
create table public.order_records(
  payment_order_id text primary key references public.payment_orders(payment_order_id) on delete cascade,
  order_code text not null unique check(order_code ~ '^GR-[2-9A-HJKMNP-Z]{4,6}$'),
  user_id uuid references auth.users(id) on delete set null,
  buyer_name text check(buyer_name is null or length(buyer_name) between 1 and 40),
  buyer_email text check(buyer_email is null or (length(buyer_email) between 6 and 254 and buyer_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$')),
  buyer_phone text check(buyer_phone is null or buyer_phone ~ '^01[016789][0-9]{7,8}$'),
  notice_version text check(notice_version is null or notice_version ~ '^[a-z0-9.-]{1,40}$'),
  receipt_url text check(receipt_url is null or (receipt_url ~ '^https://' and length(receipt_url)<=500)),
  legacy boolean not null default false,
  gift_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index order_records_user_idx on public.order_records(user_id,created_at desc) where user_id is not null;
create index order_records_email_idx on public.order_records(lower(buyer_email)) where buyer_email is not null;

-- GR- + 헷갈리는 글자(0·1·I·L·O)를 뺀 31자 중 4자. 겹치면 다시 뽑고, 20번 겹치면 한 자 늘린다(최대 6자).
create function public.ops_new_order_code() returns text language plpgsql volatile security invoker set search_path='' as $$
declare a constant text:='23456789ABCDEFGHJKMNPQRSTUVWXYZ'; c text; n integer:=4; i integer:=0;
begin
  loop
    select 'GR-'||string_agg(substr(a,1+floor(random()*31)::integer,1),'') into c from generate_series(1,n);
    if not exists(select 1 from public.order_records where order_code=c) then return c; end if;
    i:=i+1; if i>=20 then n:=least(n+1,6); i:=0; end if;
  end loop;
end $$;
-- 기존 주문(provider_order_… 등 모든 형식)에도 주문코드를 붙인다. 계정은 기존 구매 묶음(report_purchase_bindings)에서.
do $$ declare o record; begin
  for o in select po.payment_order_id,b.buyer_id from public.payment_orders po left join public.report_purchase_bindings b on b.order_id=po.payment_order_id order by po.created_at,po.payment_order_id loop
    insert into public.order_records(payment_order_id,order_code,user_id,legacy) values(o.payment_order_id,public.ops_new_order_code(),o.buyer_id,true) on conflict do nothing;
  end loop;
end $$;
-- 새 주문은 만들어질 때 주문코드를 받는다(쿠폰·옛 경로 포함). 구매자 정보는 결제 준비에서 'attach'로 채운다.
create function public.ops_order_record_on_insert() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  insert into public.order_records(payment_order_id,order_code) values(new.payment_order_id,public.ops_new_order_code()) on conflict do nothing;
  return new;
end $$;
create trigger ops_order_record after insert on public.payment_orders for each row execute function public.ops_order_record_on_insert();

-- 3. 문의·환불 요청(고객). 주문이 자동으로 붙는다.
create table public.order_requests(
  id uuid primary key default gen_random_uuid(),
  payment_order_id text not null references public.payment_orders(payment_order_id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text not null check(reason in ('calc_error','not_open','delayed','refund','other')),
  memo text not null default '' check(length(memo)<=1000),
  status text not null default 'open' check(status in ('open','done')),
  admin_note text check(admin_note is null or length(admin_note)<=1000),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index order_requests_open_idx on public.order_requests(created_at) where status='open';
create index order_requests_order_idx on public.order_requests(payment_order_id,created_at desc);

-- 4. 환불(관리자 2단계 확인 또는 24시간 자동). 토스 취소는 Idempotency-Key 하나로 한 번만.
create table public.order_refunds(
  payment_order_id text primary key references public.payment_orders(payment_order_id) on delete restrict,
  state text not null check(state in ('requested','processing','done','failed')),
  source text not null check(source in ('admin','auto')),
  reason text not null check(length(reason) between 1 and 200),
  actor_user_id uuid,
  amount integer not null check(amount>0),
  idempotency_key text not null unique check(idempotency_key ~ '^order-refund-[a-f0-9-]{36}$'),
  attempts integer not null default 0 check(attempts between 0 and 50),
  lease_until timestamptz,
  first_attempt_at timestamptz,
  provider_status text check(provider_status is null or provider_status ~ '^[A-Z_]{1,40}$'),
  last_error text check(last_error is null or last_error ~ '^[A-Z0-9_]{1,80}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create index order_refunds_pending_idx on public.order_refunds(updated_at) where state in ('requested','processing','failed');

-- 5. 감사 로그: 추가만 된다.
create table public.ops_audit_log(
  id bigint generated always as identity primary key,
  actor text not null check(actor in ('admin','system')),
  actor_user_id uuid,
  action text not null check(action ~ '^[a-z_]{1,40}$'),
  target text not null check(length(target) between 1 and 120),
  detail jsonb not null default '{}' check(jsonb_typeof(detail)='object'),
  created_at timestamptz not null default now()
);
create index ops_audit_target_idx on public.ops_audit_log(target,id desc);
create function public.ops_audit_append_only() returns trigger language plpgsql security invoker set search_path='' as $$
begin raise exception 'OPS_AUDIT_APPEND_ONLY'; end $$;
create trigger ops_audit_immutable before update or delete on public.ops_audit_log for each row execute function public.ops_audit_append_only();

-- 6. 생성 신뢰성. Book(report_id)마다 상태 1행 + 시도 기록 n행.
--   phase: pending(정식본 대기) · interim(임시본 공개, 정식본 교체 대기) · official(정식본) · gave_up(24시간 실패)
--   next_at: 다음 시도 시각(교체 레인). rejected_chapters: 다음 시도에서 다시 쓸 장(짧거나 빈 장).
create table public.book_generation_state(
  report_id text primary key references public.paid_report_snapshots(report_id) on delete cascade,
  origin text not null check(origin in ('paid','ticket')),
  origin_ref text not null check(length(origin_ref) between 1 and 120),
  phase text not null default 'pending' check(phase in ('pending','interim','official','gave_up')),
  first_attempt_at timestamptz not null default now(),
  first_failure_at timestamptz,
  failures integer not null default 0 check(failures between 0 and 1000),
  next_at timestamptz,
  rejected_chapters integer[] not null default '{}',
  lane_token uuid,
  lane_until timestamptz,
  regenerate_requested_at timestamptz,
  interim_at timestamptz, official_at timestamptz, gave_up_at timestamptz,
  last_reason text check(last_reason is null or length(last_reason)<=200),
  updated_at timestamptz not null default now()
);
create index book_generation_lane_idx on public.book_generation_state(next_at) where phase='interim' or regenerate_requested_at is not null;
create table public.book_generation_runs(
  id bigint generated always as identity primary key,
  report_id text not null references public.paid_report_snapshots(report_id) on delete cascade,
  lane text not null check(lane in ('queue','interim','upgrade','regenerate')),
  provider text check(provider is null or provider in ('anthropic','openai')),
  model text check(model is null or model ~ '^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,99}$'),
  edition text check(edition in ('official','interim')),
  outcome text not null check(outcome in ('published','replaced','deferred','gave_up','stale','error')),
  reason text check(reason is null or length(reason)<=200),
  cost_usd numeric(12,6) not null default 0 check(cost_usd>=0),
  calls jsonb not null default '[]' check(jsonb_typeof(calls)='array'),
  chapters jsonb not null default '[]' check(jsonb_typeof(chapters)='array'),
  duration_ms integer check(duration_ms is null or duration_ms>=0),
  created_at timestamptz not null default now()
);
create index book_generation_runs_report_idx on public.book_generation_runs(report_id,id);
-- 결제 경로·교체 레인의 장 원고(이용권 큐는 report_writer_chapters). 현재 lease 토큰만 저장·조회한다.
create table public.ops_writer_chapters(
  report_id text not null references public.paid_report_snapshots(report_id) on delete cascade,
  chapter_n integer not null check(chapter_n between 1 and 64),
  source text not null check(source in ('writer','continuation')),
  chapter jsonb not null check(jsonb_typeof(chapter)='object'),
  created_at timestamptz not null default now(),
  primary key(report_id,chapter_n)
);
-- 교체 전 Book(임시본·이전 정식본) 보관. 원래 Book의 열람 기한이 지나면 함께 지운다('purge').
create table public.book_snapshot_versions(
  id bigint generated always as identity primary key,
  report_id text not null references public.paid_report_snapshots(report_id) on delete cascade,
  edition text not null check(edition in ('interim','previous')),
  snapshot_json jsonb not null check(jsonb_typeof(snapshot_json)='object'),
  reason text not null check(length(reason) between 1 and 200),
  archived_at timestamptz not null default now()
);
create index book_snapshot_versions_report_idx on public.book_snapshot_versions(report_id,id);
create table public.llm_provider_switch(
  provider text primary key check(provider in ('anthropic','openai')),
  disabled_at timestamptz,
  reason text check(reason is null or length(reason)<=200),
  updated_at timestamptz not null default now()
);
insert into public.llm_provider_switch(provider) values('anthropic'),('openai');

-- 7. 이벤트: 결제 1건마다 이용권 1장(본인 사용 또는 선물 링크).
create table public.gift_rewards(
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  source_order_id text not null unique references public.payment_orders(payment_order_id) on delete cascade,
  status text not null default 'available' check(status in ('available','used_self','gifted','claimed','expired','revoked')),
  product_scope text,
  token_hash text unique check(token_hash is null or token_hash ~ '^[a-f0-9]{64}$'),
  recipient_user_id uuid references auth.users(id) on delete set null,
  used_at timestamptz, gifted_at timestamptz, claimed_at timestamptz, bonus_granted_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check(status<>'gifted' or token_hash is not null),
  check(status<>'claimed' or recipient_user_id is not null)
);
create index gift_rewards_owner_idx on public.gift_rewards(owner_user_id,created_at desc);
create index gift_rewards_recipient_idx on public.gift_rewards(recipient_user_id) where recipient_user_id is not null;

-- 9. 탈퇴: 주문·결제 기록은 법정 보관 기간(전자상거래법: 계약·결제 5년) 동안 이 표에 분리 보관하고, 계정·연락처·출생 입력은 지운다.
create table public.retained_order_records(
  payment_order_id text primary key,
  order_code text not null,
  provider_order_id text,
  product_type text not null,
  amount integer not null,
  payment_status text not null,
  paid_at timestamptz, refunded_at timestamptz,
  buyer_name text, buyer_email text, buyer_phone text,
  withdrawn_at timestamptz not null default now(),
  retain_until timestamptz not null
);
create index retained_order_records_until_idx on public.retained_order_records(retain_until);

-- 8. 이용권 큐 보류(not_before): 정식본이 아니면 보류했다가 시간표대로 다시 집는다.
alter table public.report_ticket_redemptions add column not_before timestamptz;

-- 권한: 서버(service_role)만.
alter table public.ops_settings enable row level security;
alter table public.account_contacts enable row level security;
alter table public.account_provider_facts enable row level security;
alter table public.order_records enable row level security;
alter table public.order_requests enable row level security;
alter table public.order_refunds enable row level security;
alter table public.ops_audit_log enable row level security;
alter table public.book_generation_state enable row level security;
alter table public.book_generation_runs enable row level security;
alter table public.ops_writer_chapters enable row level security;
alter table public.book_snapshot_versions enable row level security;
alter table public.llm_provider_switch enable row level security;
alter table public.gift_rewards enable row level security;
alter table public.retained_order_records enable row level security;
alter table public.upgrade_roster enable row level security;
revoke all on table public.upgrade_roster from public,anon,authenticated;
grant select on table public.upgrade_roster to service_role;
grant delete on table public.account_contacts,public.account_provider_facts to service_role;
-- 다시 쓴 장(짧은 장 재요청)이 이전 원고를 덮는다.
grant update on table public.report_writer_chapters to service_role;
revoke all on table public.retained_order_records from public,anon,authenticated;
grant select,insert,delete on table public.retained_order_records to service_role;
-- 탈퇴 처리가 프로필을 지운다(동의 이력은 추가만 되는 기록이라 남긴다).
grant delete on table public.account_profiles to service_role;
-- 감독·탈퇴 함수(security invoker)가 쓰는 기존 표. 운영 Supabase는 기본 권한으로 이미 가진 권한이라 변화 없음.
grant select,delete on table public.report_input_snapshots to service_role;
grant select,update on table public.report_generation_jobs,public.report_generation_attempts to service_role;
grant select,update on table public.report_ticket_redemptions,public.report_purchase_bindings,public.report_account_links to service_role;
revoke all on table public.ops_settings,public.account_contacts,public.account_provider_facts,public.order_records,public.order_requests,public.order_refunds,public.ops_audit_log,
  public.book_generation_state,public.book_generation_runs,public.ops_writer_chapters,public.book_snapshot_versions,public.llm_provider_switch,public.gift_rewards from public,anon,authenticated;
grant select on table public.ops_settings to service_role;
grant select,insert,update on table public.account_contacts,public.account_provider_facts,public.order_records,public.order_requests,public.order_refunds,public.book_generation_state,public.llm_provider_switch,public.gift_rewards to service_role;
grant select,insert on table public.ops_audit_log,public.book_generation_runs to service_role;
grant select,insert,update,delete on table public.ops_writer_chapters to service_role;
grant select,insert,delete on table public.book_snapshot_versions to service_role;
grant usage,select on sequence public.ops_audit_log_id_seq,public.book_generation_runs_id_seq,public.book_snapshot_versions_id_seq to service_role;

-- 가입 정보 저장. 회원(동의 마친 account_profiles)만. 마케팅 동의는 기존 동의 이력(account_consent_events)에 추가만 한다.
create function public.ops_account(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare c public.account_contacts%rowtype; p public.account_profiles%rowtype; launch timestamptz; latest boolean; eligible boolean;
begin
  if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  select (value#>>'{}')::timestamptz into launch from public.ops_settings where key='profile_launch_at';
  if p_action='read' then
    select * into c from public.account_contacts where user_id=p_user;
    if not found then return jsonb_build_object('ok',true,'contact',null); end if;
    return jsonb_build_object('ok',true,'contact',jsonb_build_object('name',c.full_name,'email',c.email,'emailSource',c.email_source,'phone',c.phone,
      'marketing',c.marketing_opt_in,'upgradeState',c.upgrade_state,'completedAt',c.completed_at));
  elsif p_action='save' then
    select * into p from public.account_profiles where user_id=p_user;
    if not found then return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED'); end if;
    if nullif(p_data->>'requestId','') is null then return jsonb_build_object('ok',false,'code','REQUEST_INVALID'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,21));
    select * into c from public.account_contacts where user_id=p_user;
    eligible:=exists(select 1 from public.upgrade_roster where user_id=p_user);
    insert into public.account_contacts(user_id,full_name,email,email_source,phone,marketing_opt_in,upgrade_state)
      values(p_user,p_data->>'name',lower(p_data->>'email'),p_data->>'emailSource',nullif(p_data->>'phone',''),coalesce((p_data->>'marketing')::boolean,false),case when eligible then 'eligible' else 'none' end)
      on conflict(user_id) do update set full_name=excluded.full_name,email=excluded.email,email_source=excluded.email_source,phone=excluded.phone,
        marketing_opt_in=excluded.marketing_opt_in,upgrade_state=case when public.account_contacts.upgrade_state='granted' then 'granted' else excluded.upgrade_state end,updated_at=now();
    select is_agreed into latest from public.account_consent_events where user_id=p_user and consent_type='marketing' order by id desc limit 1;
    if coalesce((p_data->>'marketing')::boolean,false) and latest is distinct from true then
      insert into public.account_consent_events(user_id,request_id,consent_type,document_version,is_agreed,required,source)
        values(p_user,(p_data->>'requestId')::uuid,'marketing',p_data->>'marketingVersion',true,false,case when latest is null then 'first_login' else 'reconsent' end) on conflict do nothing;
    elsif not coalesce((p_data->>'marketing')::boolean,false) and latest is true then
      insert into public.account_consent_events(user_id,request_id,consent_type,document_version,is_agreed,required,source)
        values(p_user,(p_data->>'requestId')::uuid,'marketing',p_data->>'marketingVersion',false,false,'withdrawal') on conflict do nothing;
    end if;
    return public.ops_account('read',p_user,'{}');
  elsif p_action='withdraw' then
    -- 탈퇴(P6d-ops): 같은 계정 잠금(이용권과 같은 키)으로. 순서: 주문 분리 보관 → Book 열람 종료(EXPIRED, 원고 비움) → 출생 입력·연락처·프로필 삭제.
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
    create temporary table if not exists pg_temp.withdraw_orders(payment_order_id text primary key, report_id text) on commit drop;
    create temporary table if not exists pg_temp.withdraw_reports(report_id text primary key) on commit drop;
    insert into pg_temp.withdraw_orders select po.payment_order_id,po.report_id from public.payment_orders po left join public.order_records x on x.payment_order_id=po.payment_order_id
      where x.user_id=p_user or exists(select 1 from public.report_purchase_bindings b where b.order_id=po.payment_order_id and b.buyer_id=p_user)
        or exists(select 1 from public.report_account_links l where l.report_id=po.report_id and l.user_id=p_user) on conflict do nothing;
    insert into pg_temp.withdraw_reports select report_id from pg_temp.withdraw_orders where report_id is not null on conflict do nothing;
    insert into pg_temp.withdraw_reports select report_id from public.report_account_links where user_id=p_user on conflict do nothing;
    insert into pg_temp.withdraw_reports select report_id from public.report_ticket_redemptions where user_id=p_user and report_id is not null on conflict do nothing;
    insert into public.retained_order_records(payment_order_id,order_code,provider_order_id,product_type,amount,payment_status,paid_at,refunded_at,buyer_name,buyer_email,buyer_phone,retain_until)
      select po.payment_order_id,x.order_code,po.provider_order_id,po.product_type,po.amount,po.status,po.paid_at,po.refunded_at,x.buyer_name,x.buyer_email,x.buyer_phone,(p_data->>'retainUntil')::timestamptz
      from pg_temp.withdraw_orders w join public.payment_orders po on po.payment_order_id=w.payment_order_id join public.order_records x on x.payment_order_id=po.payment_order_id
      where po.status in ('paid','refunded','canceled') on conflict(payment_order_id) do nothing;
    update public.order_records set user_id=null,buyer_name=null,buyer_email=null,buyer_phone=null,updated_at=now() where payment_order_id in (select payment_order_id from pg_temp.withdraw_orders);
    update public.paid_report_snapshots set status='EXPIRED',snapshot_json=null where report_id in (select report_id from pg_temp.withdraw_reports) and published_at is not null;
    delete from public.book_snapshot_versions where report_id in (select report_id from pg_temp.withdraw_reports);
    delete from public.ops_writer_chapters where report_id in (select report_id from pg_temp.withdraw_reports);
    delete from public.report_input_snapshots where order_id in (select payment_order_id from pg_temp.withdraw_orders);
    update public.report_ticket_redemptions set input_json=null,display_name='' where user_id=p_user;
    update public.report_purchase_bindings set revoked_at=coalesce(revoked_at,now()),display_name='',claim_hash=null where buyer_id=p_user;
    update public.report_account_links set revoked_at=coalesce(revoked_at,now()) where user_id=p_user;
    update public.gift_rewards set status='expired' where owner_user_id=p_user and status in ('available','gifted');
    delete from public.account_contacts where user_id=p_user;
    delete from public.account_provider_facts where user_id=p_user;
    delete from public.account_profiles where user_id=p_user;
    return jsonb_build_object('ok',true,'retainedOrders',(select count(*) from public.retained_order_records r join pg_temp.withdraw_orders w using(payment_order_id)),
      'closedBooks',(select count(*) from pg_temp.withdraw_reports));
  elsif p_action='withdraw_preview' then
    -- 탈퇴 전 안내: 열람이 끝나는 Book 수, 남은 이용권 수.
    return jsonb_build_object('ok',true,'books',(select count(distinct l.report_id) from public.report_account_links l join public.paid_report_snapshots s0 on s0.report_id=l.report_id
      where l.user_id=p_user and l.revoked_at is null and s0.status='COMPLETED' and s0.expires_at>now()));
  elsif p_action='facts' then
    -- 로그인 콜백: 공급자 이메일(확정 여부)·채널 관계·이메일 추가 동의 기록·최근 로그인. Supabase auth의 email은 건드리지 않는다.
    -- 채널 값이 이번에 없으면(토큰 없음) 이전 값을 둔다. 동의 거부(조회 403)는 null(미확인)로 덮는다. 이메일이 이번에 없으면 이전 값을 둔다.
    insert into public.account_provider_facts(user_id,provider,email,email_trusted,kakao_channel,channel_checked_at,email_consent_asked_at,email_declined_at,last_login_at)
      values(p_user,p_data->>'provider',lower(nullif(p_data->>'email','')),coalesce((p_data->>'emailTrusted')::boolean,false),
        case when p_data->>'channel' in ('added','blocked','none') then p_data->>'channel' else null end,case when p_data ? 'channel' then now() else null end,
        case when (p_data->>'emailAsked')::boolean then now() else null end,case when (p_data->>'emailDeclined')::boolean then now() else null end,now())
      on conflict(user_id) do update set provider=excluded.provider,
        email=coalesce(excluded.email,public.account_provider_facts.email),
        email_trusted=case when excluded.email is null then public.account_provider_facts.email_trusted else excluded.email_trusted end,
        kakao_channel=case when p_data ? 'channel' then excluded.kakao_channel else public.account_provider_facts.kakao_channel end,
        channel_checked_at=case when p_data ? 'channel' then now() else public.account_provider_facts.channel_checked_at end,
        email_consent_asked_at=coalesce(public.account_provider_facts.email_consent_asked_at,excluded.email_consent_asked_at),
        email_declined_at=coalesce(public.account_provider_facts.email_declined_at,excluded.email_declined_at),
        last_login_at=now(),updated_at=now();
    return jsonb_build_object('ok',true);
  elsif p_action='facts_read' then
    return jsonb_build_object('ok',true,'facts',(select jsonb_build_object('provider',f.provider,'email',f.email,'emailTrusted',f.email_trusted,'kakaoChannel',f.kakao_channel,
      'channelCheckedAt',f.channel_checked_at,'channelReward',f.channel_reward,'emailAskedAt',f.email_consent_asked_at,'emailDeclinedAt',f.email_declined_at) from public.account_provider_facts f where f.user_id=p_user));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- 주문·요청·환불.
create function public.ops_order(p_action text,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.payment_orders%rowtype; r public.order_records%rowtype; f public.order_refunds%rowtype; n integer; v_amount bigint; result jsonb; v_user uuid;
begin
  if p_action='attach' then
    -- 결제 준비 직후(ready)만. 회원이면 계정을, 비회원이면 결제 화면에서 받은 구매자 정보를 붙인다.
    select * into o from public.payment_orders where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or o.status<>'ready' then return jsonb_build_object('ok',false,'code','ORDER_NOT_READY'); end if;
    insert into public.order_records(payment_order_id,order_code) values(o.payment_order_id,public.ops_new_order_code()) on conflict do nothing;
    update public.order_records set user_id=nullif(p_data->>'userId','')::uuid,buyer_name=p_data->>'name',buyer_email=lower(p_data->>'email'),
      buyer_phone=nullif(p_data->>'phone',''),notice_version=p_data->>'noticeVersion',updated_at=now() where payment_order_id=o.payment_order_id returning * into r;
    return jsonb_build_object('ok',true,'orderCode',r.order_code);
  elsif p_action='receipt' then
    update public.order_records x set receipt_url=p_data->>'receiptUrl',updated_at=now() from public.payment_orders po
      where po.payment_order_id=x.payment_order_id and po.provider_order_id=p_data->>'providerOrderId' and x.receipt_url is null;
    return jsonb_build_object('ok',true);
  elsif p_action='summary' then
    -- 결제 완료 화면·서재·관리자 공통 요약(입력값·스냅숏 제외).
    select coalesce(jsonb_agg(row_to_json(t)::jsonb order by t."createdAt" desc),'[]') into result from (
      select x.order_code "orderCode",po.payment_order_id "paymentOrderId",po.provider_order_id "providerOrderId",po.product_type "productType",po.amount,
        po.status "paymentStatus",po.created_at "createdAt",po.paid_at "paidAt",po.refunded_at "refundedAt",po.report_id "reportId",x.receipt_url "receiptUrl",
        s.status "bookStatus",g.phase "edition",rf.state "refundState",x.buyer_name "buyerName",x.buyer_email "buyerEmail",x.user_id "userId",
        (select count(*) from public.order_requests q where q.payment_order_id=po.payment_order_id and q.status='open') "openRequests"
      from public.payment_orders po join public.order_records x on x.payment_order_id=po.payment_order_id
        left join public.paid_report_snapshots s on s.report_id=po.report_id
        left join public.book_generation_state g on g.report_id=po.report_id
        left join public.order_refunds rf on rf.payment_order_id=po.payment_order_id
      where po.status in ('paid','refunded','canceled') and (
        (p_data ? 'providerOrderId' and po.provider_order_id=p_data->>'providerOrderId')
        or (p_data ? 'orderCode' and x.order_code=p_data->>'orderCode')
        or (p_data ? 'userId' and (x.user_id=(p_data->>'userId')::uuid
          or exists(select 1 from public.report_purchase_bindings b where b.order_id=po.payment_order_id and b.buyer_id=(p_data->>'userId')::uuid)
          or exists(select 1 from public.report_account_links l where l.report_id=po.report_id and l.user_id=(p_data->>'userId')::uuid and l.revoked_at is null))))
      limit 100) t;
    return jsonb_build_object('ok',true,'orders',result);
  elsif p_action='find_paid' then
    -- 비회원 결제 완료 화면: 토스 orderId + paymentKey가 맞아야 그 주문을 본다(둘 다 결제한 사람만 안다).
    select * into o from public.payment_orders where provider_order_id=p_data->>'providerOrderId' and provider_payment_id=p_data->>'paymentKey' and status in ('paid','refunded','canceled');
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'paymentOrderId',o.payment_order_id);
  elsif p_action='pending_books' then
    -- 서재 "제본 중": 회원의 이용권 Book 중 아직 발행 전인 것.
    return jsonb_build_object('ok',true,'books',(select coalesce(jsonb_agg(jsonb_build_object('reportId',r0.report_id,'productType',r0.product_type,'state',r0.state,
      'createdAt',r0.created_at,'notBefore',r0.not_before,'displayName',r0.display_name) order by r0.created_at desc),'[]')
      from public.report_ticket_redemptions r0 where r0.user_id=(p_data->>'userId')::uuid and r0.state in ('QUEUED','RUNNING') and r0.publication_mode='queue-v1'));
  elsif p_action='request' then
    select * into o from public.payment_orders where payment_order_id=p_data->>'paymentOrderId';
    if not found or o.status not in ('paid','refunded') then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select count(*) into n from public.order_requests where payment_order_id=o.payment_order_id and status='open';
    if n>=5 then return jsonb_build_object('ok',false,'code','TOO_MANY_REQUESTS'); end if;
    insert into public.order_requests(payment_order_id,user_id,reason,memo) values(o.payment_order_id,nullif(p_data->>'userId','')::uuid,p_data->>'reason',coalesce(p_data->>'memo',''));
    return jsonb_build_object('ok',true);
  elsif p_action='refund_request' then
    select * into o from public.payment_orders where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or o.status<>'paid' or o.provider_payment_id is null or o.provider<>'toss' then return jsonb_build_object('ok',false,'code','NOT_REFUNDABLE'); end if;
    -- 관리자 환불 하루 상한(건수·금액): 전역 잠금 안에서 세어 동시 요청도 함께 막는다. 이미 있는 환불(재시도)은 새로 세지 않는다.
    if p_data ? 'capCount' and not exists(select 1 from public.order_refunds where payment_order_id=o.payment_order_id) then
      perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('ops_admin_refund_cap',0));
      select count(*),coalesce(sum(amount),0) into n,v_amount from public.order_refunds where source='admin'
        and created_at>=(p_data->>'dayStart')::timestamptz and created_at<(p_data->>'dayEnd')::timestamptz;
      if n+1>(p_data->>'capCount')::integer or v_amount+o.amount>(p_data->>'capAmount')::integer then
        return jsonb_build_object('ok',false,'code','REFUND_DAILY_CAP','todayCount',n,'todayAmount',v_amount);
      end if;
    end if;
    insert into public.order_refunds(payment_order_id,state,source,reason,actor_user_id,amount,idempotency_key)
      values(o.payment_order_id,'requested',p_data->>'source',p_data->>'reason',nullif(p_data->>'actorUserId','')::uuid,o.amount,'order-refund-'||gen_random_uuid())
      on conflict(payment_order_id) do nothing;
    select * into f from public.order_refunds where payment_order_id=o.payment_order_id;
    return jsonb_build_object('ok',true,'state',f.state,'fresh',f.source=p_data->>'source' and f.created_at>=now()-interval '5 seconds');
  elsif p_action='refund_claim' then
    -- 요청됨, 또는 실패(5분 뒤 재시도, 최대 10회), 또는 처리 중 lease가 끝난 것. 같은 키로만 다시 보낸다(토스가 중복 취소를 막는다).
    select * into f from public.order_refunds x where (not (p_data ? 'paymentOrderId') or x.payment_order_id=p_data->>'paymentOrderId')
      and (x.state='requested' or (x.state='processing' and x.lease_until<now()) or (x.state='failed' and x.attempts<10 and x.updated_at<now()-interval '5 minutes'))
      order by x.created_at for update skip locked limit 1;
    if not found then return jsonb_build_object('ok',true,'empty',true); end if;
    select * into o from public.payment_orders where payment_order_id=f.payment_order_id;
    update public.order_refunds set state='processing',attempts=attempts+1,lease_until=now()+interval '2 minutes',first_attempt_at=coalesce(first_attempt_at,now()),updated_at=now()
      where payment_order_id=f.payment_order_id returning * into f;
    return jsonb_build_object('ok',true,'refund',jsonb_build_object('paymentOrderId',f.payment_order_id,'paymentKey',o.provider_payment_id,'providerOrderId',o.provider_order_id,
      'amount',f.amount,'originalAmount',o.amount,'idempotencyKey',f.idempotency_key,'reason',f.reason,'firstAttemptAt',f.first_attempt_at,'attempts',f.attempts,'source',f.source,'paymentStatus',o.status));
  elsif p_action='refund_finish' then
    select * into f from public.order_refunds where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or f.state<>'processing' then return jsonb_build_object('ok',false,'code','REFUND_NOT_PROCESSING'); end if;
    if (p_data->>'ok')::boolean then
      update public.order_refunds set state='done',provider_status=p_data->>'providerStatus',last_error=null,lease_until=null,completed_at=now(),updated_at=now() where payment_order_id=f.payment_order_id;
      -- 환불된 주문의 Book은 기존 읽기 경로(결제 완료 주문만)가 막는다. 스냅숏은 그대로 둔다.
      update public.payment_orders set status='refunded',refunded_at=coalesce(refunded_at,now()),updated_at=now() where payment_order_id=f.payment_order_id and status='paid';
      update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',last_error_code='ORDER_REFUNDED',lease_token=null,lease_until=null
        where order_id=f.payment_order_id and status in ('QUEUED','RETRYING');
      -- 이벤트 이용권: 환불된 주문에서 나온 아직 안 쓴 이용권(보유·선물 링크 대기)은 회수한다. 이미 쓴 것은 그대로 두고 결과만 알린다.
      update public.gift_rewards set status='revoked',token_hash=null where source_order_id=f.payment_order_id and status in ('available','gifted');
      get diagnostics n = row_count;
      return jsonb_build_object('ok',true,'state','done','giftRevoked',n>0,
        'giftKept',(select status from public.gift_rewards where source_order_id=f.payment_order_id and status in ('used_self','claimed')));
    end if;
    update public.order_refunds set state='failed',provider_status=p_data->>'providerStatus',last_error=p_data->>'error',lease_until=null,updated_at=now() where payment_order_id=f.payment_order_id;
    return jsonb_build_object('ok',true,'state','failed');
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- 생성 상태·시도 기록·장 원고·정식본 교체·공급자 스위치.
create function public.ops_generation(p_action text,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare g public.book_generation_state%rowtype; j public.report_generation_jobs%rowtype; s public.paid_report_snapshots%rowtype; ok boolean; chapters jsonb; st jsonb; payload jsonb;
begin
  if p_action='begin' then
    insert into public.book_generation_state(report_id,origin,origin_ref) values(p_data->>'reportId',p_data->>'origin',p_data->>'originRef') on conflict(report_id) do nothing;
    select * into g from public.book_generation_state where report_id=p_data->>'reportId';
    return jsonb_build_object('ok',true,'state',to_jsonb(g));
  elsif p_action='state' then
    select * into g from public.book_generation_state where report_id=p_data->>'reportId';
    if not found then return jsonb_build_object('ok',true,'state',null); end if;
    return jsonb_build_object('ok',true,'state',to_jsonb(g),'runs',(select coalesce(jsonb_agg(to_jsonb(x) order by x.id),'[]') from public.book_generation_runs x where x.report_id=g.report_id));
  elsif p_action in ('chapters_save','chapters_load') then
    -- 현재 lease를 가진 쪽만: 결제 큐 작업(RUNNING, lease 유효) 또는 교체 레인 토큰.
    select exists(select 1 from public.report_generation_jobs x where x.report_id=p_data->>'reportId' and x.status='RUNNING' and x.lease_token=(p_data->>'token')::uuid and x.lease_until>now())
      or exists(select 1 from public.book_generation_state x where x.report_id=p_data->>'reportId' and x.lane_token=(p_data->>'token')::uuid and x.lane_until>now()) into ok;
    if not ok then return jsonb_build_object('ok',false,'code','STALE_LEASE'); end if;
    if p_action='chapters_save' then
      if jsonb_typeof(p_data->'chapter') is distinct from 'object' or (p_data->>'source') not in ('writer','continuation') then return jsonb_build_object('ok',false,'code','INVALID_CHAPTER'); end if;
      -- 다시 쓴 장(짧은 장 재요청)은 이전 원고를 덮는다.
      insert into public.ops_writer_chapters(report_id,chapter_n,source,chapter) values(p_data->>'reportId',(p_data->>'n')::integer,p_data->>'source',p_data->'chapter')
        on conflict(report_id,chapter_n) do update set source=excluded.source,chapter=excluded.chapter,created_at=now();
      return jsonb_build_object('ok',true);
    end if;
    select coalesce(jsonb_agg(jsonb_build_object('n',chapter_n,'source',source,'chapter',chapter) order by chapter_n),'[]') into chapters from public.ops_writer_chapters where report_id=p_data->>'reportId';
    return jsonb_build_object('ok',true,'chapters',chapters);
  elsif p_action='chapters_clear' then
    delete from public.ops_writer_chapters where report_id=p_data->>'reportId';
    return jsonb_build_object('ok',true);
  elsif p_action='record' then
    -- 시도 1건 기록 + 상태 갱신(상태 전이 판단은 서버 코드의 정책 함수가 한다).
    select * into g from public.book_generation_state where report_id=p_data->>'reportId' for update;
    if not found then return jsonb_build_object('ok',false,'code','STATE_NOT_FOUND'); end if;
    insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,calls,chapters,duration_ms)
      values(g.report_id,p_data->'run'->>'lane',p_data->'run'->>'provider',p_data->'run'->>'model',p_data->'run'->>'edition',p_data->'run'->>'outcome',left(p_data->'run'->>'reason',200),
        coalesce((p_data->'run'->>'costUsd')::numeric,0),coalesce(p_data->'run'->'calls','[]'),coalesce(p_data->'run'->'chapters','[]'),(p_data->'run'->>'durationMs')::integer);
    st:=coalesce(p_data->'state','{}');
    update public.book_generation_state set
      phase=coalesce(st->>'phase',phase),
      first_failure_at=case when st ? 'firstFailureAt' then (st->>'firstFailureAt')::timestamptz else first_failure_at end,
      failures=failures+coalesce((st->>'failuresInc')::integer,0),
      next_at=case when st ? 'nextAt' then (st->>'nextAt')::timestamptz else next_at end,
      rejected_chapters=case when st ? 'rejected' then array(select jsonb_array_elements_text(st->'rejected')::integer) else rejected_chapters end,
      interim_at=case when st ? 'interimAt' then (st->>'interimAt')::timestamptz else interim_at end,
      official_at=case when st ? 'officialAt' then (st->>'officialAt')::timestamptz else official_at end,
      gave_up_at=case when st ? 'gaveUpAt' then (st->>'gaveUpAt')::timestamptz else gave_up_at end,
      regenerate_requested_at=case when (st->>'clearRegenerate')::boolean then null else regenerate_requested_at end,
      last_reason=left(coalesce(p_data->'run'->>'reason',last_reason),200),updated_at=now()
      where report_id=g.report_id returning * into g;
    return jsonb_build_object('ok',true,'state',to_jsonb(g));
  elsif p_action='paid_defer' or p_action='paid_give_up' then
    -- 결제 큐 작업을 보류(시간표대로 다시)하거나 포기(24시간)한다. 시도 번호는 run_number를 올려 새로 센다(attempt 상한 3과 무관).
    select * into j from public.report_generation_jobs where job_id=(p_data->>'jobId')::uuid for update;
    if not found or j.status<>'RUNNING' or j.lease_token is distinct from (p_data->>'token')::uuid or j.lease_until<=now() then return jsonb_build_object('ok',false,'code','STALE_LEASE'); end if;
    update public.report_generation_attempts set finished_at=now(),failure_stage='generation',error_code=left(p_data->>'code',80)
      where job_id=j.job_id and run_number=j.run_number and attempt=j.attempt_count;
    if p_action='paid_defer' then
      update public.report_generation_jobs set status='RETRYING',attempt_count=0,run_number=run_number+1,lease_token=null,lease_until=null,
        next_retry_at=(p_data->>'until')::timestamptz,last_error_code=left(p_data->>'code',80) where job_id=j.job_id;
      update public.paid_report_snapshots set status='RETRYING' where report_id=j.report_id and status<>'COMPLETED';
      return jsonb_build_object('ok',true,'status','RETRYING');
    end if;
    update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION',lease_token=null,lease_until=null,last_error_code=left(p_data->>'code',80) where job_id=j.job_id;
    update public.paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION' where report_id=j.report_id and status<>'COMPLETED';
    return jsonb_build_object('ok',true,'status','FAILED_REQUIRES_ATTENTION');
  elsif p_action='lane_claim' then
    -- 교체 레인: 임시본(정식본 대기) 또는 관리자 재생성 요청. 공개된 Book만, 결제 경로는 결제 완료 주문만.
    select x.* into g from public.book_generation_state x join public.paid_report_snapshots s0 on s0.report_id=x.report_id
      where s0.status='COMPLETED' and s0.expires_at>now() and (x.lane_until is null or x.lane_until<now())
        and ((x.phase='interim' and x.next_at is not null and x.next_at<=now()) or (x.regenerate_requested_at is not null and x.phase in ('official','interim','gave_up') and (x.next_at is null or x.next_at<=now())))
        and (x.origin='ticket' or exists(select 1 from public.payment_orders po where po.payment_order_id=s0.order_id and po.status='paid'))
      order by x.next_at nulls first for update of x skip locked limit 1;
    if not found then return jsonb_build_object('ok',true,'empty',true); end if;
    update public.book_generation_state set lane_token=gen_random_uuid(),lane_until=now()+interval '15 minutes',updated_at=now() where report_id=g.report_id returning * into g;
    select * into s from public.paid_report_snapshots where report_id=g.report_id;
    return jsonb_build_object('ok',true,'job',jsonb_build_object('reportId',g.report_id,'origin',g.origin,'originRef',g.origin_ref,'token',g.lane_token,'phase',g.phase,
      'regenerate',g.regenerate_requested_at is not null,'firstFailureAt',g.first_failure_at,'firstAttemptAt',g.first_attempt_at,'failures',g.failures,'rejected',to_jsonb(g.rejected_chapters),
      'regenRequestedAt',g.regenerate_requested_at,'regenFailures',(select count(*) from public.book_generation_runs x where x.report_id=g.report_id and x.lane='regenerate'
        and x.outcome in ('deferred','error') and x.created_at>=coalesce(g.regenerate_requested_at,now())),
      'snapshot',s.snapshot_json,'productType',s.product_type,'orderId',s.order_id));
  elsif p_action='lane_replace' then
    select * into g from public.book_generation_state where report_id=p_data->>'reportId' for update;
    if not found or g.lane_token is distinct from (p_data->>'token')::uuid or g.lane_until<=now() then return jsonb_build_object('ok',false,'code','STALE_LEASE'); end if;
    select * into s from public.paid_report_snapshots where report_id=g.report_id for update;
    if s.status<>'COMPLETED' or s.expires_at<=now() or jsonb_typeof(p_data->'snapshot'->'draft') is distinct from 'object' or p_data->'snapshot'->>'reportId' is distinct from s.report_id
      or p_data->'snapshot'->>'productType' is distinct from s.product_type then return jsonb_build_object('ok',false,'code','REPLACE_REJECTED'); end if;
    insert into public.book_snapshot_versions(report_id,edition,snapshot_json,reason) values(s.report_id,case when g.phase='interim' then 'interim' else 'previous' end,s.snapshot_json,left(coalesce(p_data->>'reason','replace'),200));
    -- 발행 시각·열람 기한은 그대로(처음 발행 기준 90일). createdAtIso도 처음 발행 시각을 유지한다.
    update public.paid_report_snapshots set snapshot_json=jsonb_set(p_data->'snapshot','{createdAtIso}',coalesce(s.snapshot_json->'createdAtIso',to_jsonb(s.published_at))) where report_id=s.report_id;
    update public.report_account_links set report_version=coalesce(p_data->'snapshot'->>'productVersion',report_version) where report_id=s.report_id;
    update public.book_generation_state set phase='official',official_at=now(),regenerate_requested_at=null,next_at=null,lane_token=null,lane_until=null,rejected_chapters='{}',updated_at=now() where report_id=g.report_id;
    delete from public.ops_writer_chapters where report_id=g.report_id;
    return jsonb_build_object('ok',true);
  elsif p_action='lane_release' then
    update public.book_generation_state set lane_token=null,lane_until=null,next_at=case when p_data ? 'nextAt' then (p_data->>'nextAt')::timestamptz else next_at end,
      regenerate_requested_at=case when (p_data->>'clearRegenerate')::boolean then null else regenerate_requested_at end,updated_at=now()
      where report_id=p_data->>'reportId' and lane_token=(p_data->>'token')::uuid;
    return jsonb_build_object('ok',found);
  elsif p_action='regenerate' then
    -- 관리자 재생성. 공개된 Book이면 교체 레인, 공개 전 실패(확인 필요)면 기존 admin_retry 경로를 쓴다(호출 쪽).
    update public.book_generation_state set regenerate_requested_at=now(),next_at=null,updated_at=now() where report_id=p_data->>'reportId' returning * into g;
    if not found then
      select * into s from public.paid_report_snapshots where report_id=p_data->>'reportId';
      if not found or s.status<>'COMPLETED' then return jsonb_build_object('ok',false,'code','NOT_PUBLISHED'); end if;
      insert into public.book_generation_state(report_id,origin,origin_ref,phase,regenerate_requested_at,official_at)
        values(s.report_id,case when s.ticket_redemption_id is null then 'paid' else 'ticket' end,coalesce(s.order_id,s.ticket_redemption_id::text),'official',now(),s.published_at);
    end if;
    return jsonb_build_object('ok',true);
  elsif p_action='provider' then
    return jsonb_build_object('ok',true,'providers',(select coalesce(jsonb_object_agg(provider,jsonb_build_object('disabledAt',disabled_at,'reason',reason)),'{}') from public.llm_provider_switch));
  elsif p_action='provider_set' then
    update public.llm_provider_switch set disabled_at=case when (p_data->>'disabled')::boolean then coalesce(disabled_at,now()) else null end,
      reason=case when (p_data->>'disabled')::boolean then left(p_data->>'reason',200) else null end,updated_at=now() where provider=p_data->>'provider';
    return jsonb_build_object('ok',found);
  elsif p_action='purge' then
    -- 열람 기한이 지난 Book의 보관본·장 원고를 지운다(개인정보 보관 기간 90일과 같게).
    delete from public.book_snapshot_versions v using public.paid_report_snapshots s0 where s0.report_id=v.report_id and s0.expires_at<=now();
    delete from public.ops_writer_chapters c using public.paid_report_snapshots s0 where s0.report_id=c.report_id and (s0.expires_at<=now() or s0.status='EXPIRED');
    return jsonb_build_object('ok',true);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- 이벤트 이용권. 설정값(기간·상한·대상 상품)은 서버 코드가 넘긴다.
create function public.ops_gift(p_action text,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare w public.gift_rewards%rowtype; o public.payment_orders%rowtype; x public.order_records%rowtype; n integer; t jsonb; v_user uuid:=nullif(p_data->>'userId','')::uuid;
begin
  if p_action='issue' then
    -- 결제 완료 주문 1건마다 1장(계정당 maxPerAccount). 회원 주문만. 같은 주문은 한 번만 따진다(gift_checked_at).
    select * into x from public.order_records where payment_order_id=p_data->>'paymentOrderId' for update;
    if not found or x.user_id is null then return jsonb_build_object('ok',true,'issued',false,'code','GUEST_ORDER'); end if;
    select * into o from public.payment_orders where payment_order_id=x.payment_order_id;
    update public.order_records set gift_checked_at=coalesce(gift_checked_at,now()) where payment_order_id=x.payment_order_id;
    if o.status<>'paid' or o.paid_at is null or o.paid_at<(p_data->>'start')::timestamptz or o.paid_at>=(p_data->>'end')::timestamptz
      or not (o.product_type = any(array(select jsonb_array_elements_text(p_data->'products')))) then return jsonb_build_object('ok',true,'issued',false,'code','NOT_ELIGIBLE'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(x.user_id::text,22));
    if exists(select 1 from public.gift_rewards where source_order_id=x.payment_order_id) then return jsonb_build_object('ok',true,'issued',false,'code','ALREADY_ISSUED'); end if;
    select count(*) into n from public.gift_rewards where owner_user_id=x.user_id;
    if n>=(p_data->>'maxPerAccount')::integer then return jsonb_build_object('ok',true,'issued',false,'code','ACCOUNT_LIMIT'); end if;
    insert into public.gift_rewards(owner_user_id,source_order_id,product_scope,expires_at) values(x.user_id,x.payment_order_id,nullif(p_data->>'productScope',''),(p_data->>'expiresAt')::timestamptz) returning * into w;
    return jsonb_build_object('ok',true,'issued',true,'giftId',w.id);
  elsif p_action='pending_orders' then
    -- 크론: 이벤트 기간의 회원 결제 완료 주문 중 아직 따지지 않은 것(결제 완료 화면을 못 본 경우).
    return jsonb_build_object('ok',true,'orders',(select coalesce(jsonb_agg(x.payment_order_id),'[]') from (select r.payment_order_id from public.order_records r join public.payment_orders o on o.payment_order_id=r.payment_order_id
      where r.user_id is not null and r.gift_checked_at is null and o.status='paid' and o.paid_at>=(p_data->>'start')::timestamptz and o.paid_at<(p_data->>'end')::timestamptz
      order by o.paid_at limit 20) x));
  elsif p_action='list' then
    update public.gift_rewards set status='expired' where owner_user_id=v_user and status in ('available','gifted') and expires_at<=now();
    return jsonb_build_object('ok',true,'gifts',(select coalesce(jsonb_agg(jsonb_build_object('id',g.id,'status',g.status,'expiresAt',g.expires_at,'createdAt',g.created_at,
      'orderCode',r.order_code,'bonus',g.bonus_granted_at is not null) order by g.created_at desc),'[]') from public.gift_rewards g join public.order_records r on r.payment_order_id=g.source_order_id where g.owner_user_id=v_user));
  elsif p_action in ('use_self','link') then
    select * into w from public.gift_rewards where id=(p_data->>'giftId')::uuid and owner_user_id=v_user for update;
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    if w.expires_at<=now() then update public.gift_rewards set status='expired' where id=w.id; return jsonb_build_object('ok',false,'code','GIFT_EXPIRED'); end if;
    if p_action='use_self' then
      if w.status<>'available' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
      t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-self:'||w.id,'key','gift-self:'||w.id,'reason','EVENT_PAYMENT_GIFT',
        'expiresAt',w.expires_at,'productScope',w.product_scope));
      if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
      update public.gift_rewards set status='used_self',used_at=now() where id=w.id;
      return jsonb_build_object('ok',true,'status','used_self');
    end if;
    -- 링크는 다시 만들 수 있다(이전 링크는 무효). 받기 전까지만.
    if w.status not in ('available','gifted') then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
    update public.gift_rewards set status='gifted',token_hash=p_data->>'tokenHash',gifted_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'status','gifted');
  elsif p_action='peek' then
    select * into w from public.gift_rewards where token_hash=p_data->>'tokenHash';
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    return jsonb_build_object('ok',true,'status',case when w.status='gifted' and w.expires_at<=now() then 'expired' else w.status end,'expiresAt',w.expires_at,'mine',w.owner_user_id=v_user);
  elsif p_action='claim' then
    -- 받는 사람: 회원 + 정보 화면 완료. 보낸 사람 본인은 못 받는다.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    if not exists(select 1 from public.account_contacts where user_id=v_user) then return jsonb_build_object('ok',false,'code','PROFILE_REQUIRED'); end if;
    select * into w from public.gift_rewards where token_hash=p_data->>'tokenHash' for update;
    if not found then return jsonb_build_object('ok',false,'code','GIFT_NOT_FOUND'); end if;
    if w.status='claimed' and w.recipient_user_id=v_user then return jsonb_build_object('ok',true,'status','claimed'); end if;
    if w.status<>'gifted' then return jsonb_build_object('ok',false,'code','GIFT_USED'); end if;
    if w.expires_at<=now() then update public.gift_rewards set status='expired' where id=w.id; return jsonb_build_object('ok',false,'code','GIFT_EXPIRED'); end if;
    if w.owner_user_id=v_user then return jsonb_build_object('ok',false,'code','GIFT_SELF'); end if;
    t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-claim:'||w.id,'key','gift-claim:'||w.id,'reason','EVENT_GIFT_RECEIVED',
      'expiresAt',w.expires_at,'productScope',w.product_scope));
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
    update public.gift_rewards set status='claimed',recipient_user_id=v_user,claimed_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'status','claimed');
  elsif p_action='bonus' then
    -- 선물 받은 친구의 첫 결제(결제 완료 주문 1건째)면 보낸 사람에게 1장 더(계정당 bonusMax).
    select * into x from public.order_records where payment_order_id=p_data->>'paymentOrderId';
    if not found or x.user_id is null then return jsonb_build_object('ok',true,'granted',false); end if;
    select count(*) into n from public.order_records r join public.payment_orders po on po.payment_order_id=r.payment_order_id where r.user_id=x.user_id and po.status in ('paid','refunded');
    if n<>1 then return jsonb_build_object('ok',true,'granted',false,'code','NOT_FIRST_PAYMENT'); end if;
    select * into w from public.gift_rewards where recipient_user_id=x.user_id and status='claimed' and bonus_granted_at is null order by claimed_at limit 1 for update;
    if not found then return jsonb_build_object('ok',true,'granted',false); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(w.owner_user_id::text,22));
    select count(*) into n from public.gift_rewards where owner_user_id=w.owner_user_id and bonus_granted_at is not null;
    if n>=(p_data->>'bonusMax')::integer then return jsonb_build_object('ok',true,'granted',false,'code','BONUS_LIMIT'); end if;
    t:=public.report_tickets('grant',w.owner_user_id,jsonb_build_object('quantity',1,'sourceType','promotion','sourceRef','gift-bonus:'||w.id,'key','gift-bonus:'||w.id,'reason','EVENT_GIFT_BONUS',
      'expiresAt',(p_data->>'expiresAt')::timestamptz,'productScope',w.product_scope));
    if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
    update public.gift_rewards set bonus_granted_at=now() where id=w.id;
    return jsonb_build_object('ok',true,'granted',true,'ownerUserId',w.owner_user_id);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- 관리자 화면 읽기(접근 검사는 서버 코드: ADMIN_USER_IDS). 검색·지연·요청함·상세·기존 가입자 현황.
create function public.ops_admin(p_action text,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare q text:=nullif(trim(coalesce(p_data->>'q','')),''); lim integer:=least(coalesce((p_data->>'limit')::integer,50),200); x public.order_records%rowtype; po public.payment_orders%rowtype; result jsonb;
begin
  if p_action in ('search','delayed') then
    select coalesce(jsonb_agg(row_to_json(t)::jsonb),'[]') into result from (
      select r.order_code "orderCode",o.payment_order_id "paymentOrderId",o.provider_order_id "providerOrderId",o.product_type "productType",o.amount,o.status "paymentStatus",
        o.created_at "createdAt",o.paid_at "paidAt",o.report_id "reportId",r.buyer_name "buyerName",r.buyer_email "buyerEmail",r.user_id "userId",r.legacy,
        s.status "bookStatus",g.phase "edition",g.failures,g.last_reason "lastReason",j.status "jobStatus",rf.state "refundState",
        (select count(*) from public.order_requests q0 where q0.payment_order_id=o.payment_order_id and q0.status='open') "openRequests"
      from public.payment_orders o join public.order_records r on r.payment_order_id=o.payment_order_id
        left join public.paid_report_snapshots s on s.report_id=o.report_id left join public.book_generation_state g on g.report_id=o.report_id
        left join public.report_generation_jobs j on j.report_id=o.report_id left join public.order_refunds rf on rf.payment_order_id=o.payment_order_id
      where (p_action<>'delayed' or (o.status='paid' and o.paid_at<now()-interval '30 minutes' and coalesce(s.status,'') not in ('COMPLETED','EXPIRED')))
        and (q is null or r.order_code ilike '%'||q||'%' or o.provider_order_id ilike '%'||q||'%' or o.payment_order_id ilike '%'||q||'%'
          or r.buyer_email ilike '%'||q||'%' or r.buyer_name ilike '%'||q||'%' or o.report_id ilike '%'||q||'%')
        and (nullif(p_data->>'product','') is null or o.product_type=p_data->>'product')
        and (nullif(p_data->>'from','') is null or o.created_at>=(p_data->>'from')::timestamptz)
        and (nullif(p_data->>'to','') is null or o.created_at<(p_data->>'to')::timestamptz)
        and (p_action='delayed' or coalesce((p_data->>'includeReady')::boolean,false) or o.status<>'ready')
      order by o.created_at desc limit lim) t;
    if p_action='delayed' then
      -- 이용권 Book도 지연 목록에 함께 보인다(주문 없음).
      return jsonb_build_object('ok',true,'orders',result,'tickets',(select coalesce(jsonb_agg(jsonb_build_object('redemptionId',r0.id,'reportId',r0.report_id,'productType',r0.product_type,
        'state',r0.state,'createdAt',r0.created_at,'notBefore',r0.not_before,'failures',g.failures,'lastReason',g.last_reason) order by r0.created_at),'[]')
        from public.report_ticket_redemptions r0 left join public.book_generation_state g on g.report_id=r0.report_id
        where r0.state in ('QUEUED','RUNNING') and r0.created_at<now()-interval '30 minutes'));
    end if;
    return jsonb_build_object('ok',true,'orders',result);
  elsif p_action='requests' then
    return jsonb_build_object('ok',true,'requests',(select coalesce(jsonb_agg(jsonb_build_object('id',q0.id,'orderCode',r.order_code,'reason',q0.reason,'memo',q0.memo,'status',q0.status,
      'createdAt',q0.created_at,'productType',o.product_type,'paymentStatus',o.status,'buyerName',r.buyer_name) order by q0.created_at),'[]')
      from public.order_requests q0 join public.order_records r on r.payment_order_id=q0.payment_order_id join public.payment_orders o on o.payment_order_id=q0.payment_order_id
      where q0.status=coalesce(nullif(p_data->>'status',''),'open')));
  elsif p_action='request_done' then
    update public.order_requests set status='done',admin_note=left(p_data->>'note',1000),resolved_at=now() where id=(p_data->>'id')::uuid and status='open';
    return jsonb_build_object('ok',found);
  elsif p_action='detail' then
    select * into x from public.order_records where order_code=upper(p_data->>'orderCode');
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into po from public.payment_orders where payment_order_id=x.payment_order_id;
    return jsonb_build_object('ok',true,'order',jsonb_build_object('orderCode',x.order_code,'paymentOrderId',po.payment_order_id,'providerOrderId',po.provider_order_id,
        'paymentKey',po.provider_payment_id,'productType',po.product_type,'amount',po.amount,'status',po.status,'createdAt',po.created_at,'paidAt',po.paid_at,'refundedAt',po.refunded_at,
        'reportId',po.report_id,'buyerName',x.buyer_name,'buyerEmail',x.buyer_email,'buyerPhone',x.buyer_phone,'userId',x.user_id,'legacy',x.legacy,'receiptUrl',x.receipt_url,'noticeVersion',x.notice_version),
      'input',(select i.payload_json->'reportInputPayload' from public.report_input_snapshots i where i.order_id=po.payment_order_id),
      'book',(select jsonb_build_object('status',s.status,'publishedAt',s.published_at,'expiresAt',s.expires_at,'productVersion',s.snapshot_json->>'productVersion',
        'meta',s.snapshot_json->'evidencePacket'->'meta'->'writer','costUsd',s.snapshot_json->'evidencePacket'->'meta'->'costUsd') from public.paid_report_snapshots s where s.report_id=po.report_id),
      'job',(select to_jsonb(j) - 'lease_token' from public.report_generation_jobs j where j.report_id=po.report_id),
      'attempts',(select coalesce(jsonb_agg(jsonb_build_object('run',a.run_number,'attempt',a.attempt,'startedAt',a.started_at,'finishedAt',a.finished_at,'errorCode',a.error_code,'stage',a.failure_stage) order by a.run_number,a.attempt),'[]')
        from public.report_generation_attempts a where a.report_id=po.report_id),
      'state',(select to_jsonb(g) - 'lane_token' from public.book_generation_state g where g.report_id=po.report_id),
      'runs',(select coalesce(jsonb_agg(to_jsonb(b) order by b.id),'[]') from public.book_generation_runs b where b.report_id=po.report_id),
      'versions',(select coalesce(jsonb_agg(jsonb_build_object('edition',v.edition,'reason',v.reason,'archivedAt',v.archived_at) order by v.id),'[]') from public.book_snapshot_versions v where v.report_id=po.report_id),
      'requests',(select coalesce(jsonb_agg(to_jsonb(q0) order by q0.created_at),'[]') from public.order_requests q0 where q0.payment_order_id=po.payment_order_id),
      'refund',(select to_jsonb(f) from public.order_refunds f where f.payment_order_id=po.payment_order_id),
      'audit',(select coalesce(jsonb_agg(to_jsonb(l) order by l.id),'[]') from public.ops_audit_log l where l.target in (po.payment_order_id,x.order_code,coalesce(po.report_id,''))));
  elsif p_action='legacy_members' then
    -- 기존 가입자(명단) 현황: 이메일 확보(가입 정보 이메일 또는 공급자 확정 이메일)·최근 로그인·주문 유무.
    with m as (
      select u.user_id,u.joined_at,f.last_login_at,c.completed_at,(c.email is not null or coalesce(f.email_trusted,false)) secured,c.upgrade_state,
        (select count(*) from public.order_records r join public.payment_orders o on o.payment_order_id=r.payment_order_id where r.user_id=u.user_id and o.status in ('paid','refunded'))
        +(select count(*) from public.report_purchase_bindings b join public.payment_orders o on o.payment_order_id=b.order_id
            where b.buyer_id=u.user_id and o.status in ('paid','refunded') and not exists(select 1 from public.order_records r where r.payment_order_id=b.order_id and r.user_id=u.user_id)) orders
      from public.upgrade_roster u left join public.account_contacts c on c.user_id=u.user_id left join public.account_provider_facts f on f.user_id=u.user_id)
    select jsonb_build_object('ok',true,'total',count(*),'emailSecured',count(*) filter (where secured),'emailMissing',count(*) filter (where not secured),
      'withOrders',count(*) filter (where orders>0),'profileDone',count(*) filter (where completed_at is not null),'eligible',count(*) filter (where upgrade_state='eligible'),
      'members',coalesce((select jsonb_agg(jsonb_build_object('userId',m2.user_id,'joinedAt',m2.joined_at,'lastLoginAt',m2.last_login_at,'emailSecured',m2.secured,'orders',m2.orders,'upgradeState',m2.upgrade_state)
        order by m2.last_login_at desc nulls last) from (select * from m order by last_login_at desc nulls last limit lim) m2),'[]')) into result from m;
    return result;
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

revoke all on function public.ops_new_order_code(),public.ops_order_record_on_insert(),public.ops_audit_append_only(),public.ops_account(text,uuid,jsonb),
  public.ops_order(text,jsonb),public.ops_generation(text,jsonb),public.ops_gift(text,jsonb),public.ops_admin(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_new_order_code(),public.ops_order_record_on_insert(),public.ops_audit_append_only(),public.ops_account(text,uuid,jsonb),
  public.ops_order(text,jsonb),public.ops_generation(text,jsonb),public.ops_gift(text,jsonb),public.ops_admin(text,jsonb) to service_role;

-- 이용권 큐: 20261029130000 함수 + (1) claim이 not_before를 지킨다 (2) 'defer'(보류) (3) 'recover'는 결정론 완성 대신 큐로 되돌린다.
create or replace function public.report_ticket_publication(p_action text,p_user uuid default null,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare candidate record; r public.report_ticket_redemptions%rowtype; result jsonb; stamp timestamptz; v5 boolean; chapters jsonb; n integer:=0;
begin
  if p_action='claim' then
    for candidate in select id,user_id from public.report_ticket_redemptions
      where publication_mode='queue-v1' and ((state='QUEUED' and (not_before is null or not_before<=clock_timestamp())) or (state='RUNNING' and lease_until<=clock_timestamp()))
      order by created_at,id limit 32 loop
      if not pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended(candidate.user_id::text,10)) then continue; end if;
      select * into r from public.report_ticket_redemptions where id=candidate.id
        and ((state='QUEUED' and (not_before is null or not_before<=clock_timestamp())) or (state='RUNNING' and lease_until<=clock_timestamp())) for update skip locked;
      if not found then continue; end if;
      if r.state='RUNNING' then
        perform public.report_tickets('reconcile',r.user_id,'{}');
        continue;
      end if;
      v5 := coalesce(jsonb_typeof(p_data->'v5Products')='array' and (p_data->'v5Products') ? r.product_type, false);
      if v5 then
        update public.report_ticket_redemptions set state='RUNNING',lease_token=gen_random_uuid(),writer_version='v5',not_before=null,
          writer_lease_until=clock_timestamp()+interval '15 minutes',lease_until=clock_timestamp()+interval '25 minutes'
          where id=r.id returning * into r;
      else
        update public.report_ticket_redemptions set state='RUNNING',lease_token=gen_random_uuid(),not_before=null,lease_until=clock_timestamp()+interval '10 minutes'
          where id=r.id returning * into r;
      end if;
      return jsonb_build_object('ok',true,'state','RUNNING','redemptionId',r.id,'userId',r.user_id,'token',r.lease_token,
        'reportId',r.report_id,'productType',r.product_type,'input',r.input_json,'policyAt',r.policy_at,'createdAt',r.policy_at,
        'writerVersion',r.writer_version,'writerLeaseUntil',r.writer_lease_until);
    end loop;
    return jsonb_build_object('ok',true,'empty',true);
  end if;
  if p_action='recover' then
    -- 작가 lease가 끝났고 정산 기한 전인 v5 작업(워커가 죽음): 결정론으로 완성하지 않고 큐로 되돌린다. 저장된 장은 남아 다음 시도가 빠진 장만 쓴다.
    for candidate in select id,user_id from public.report_ticket_redemptions
      where publication_mode='queue-v1' and state='RUNNING' and writer_version='v5' and writer_lease_until<=clock_timestamp()
        and lease_until>clock_timestamp()+interval '1 minute' and recovery_count<10
      order by writer_lease_until,id limit 32 loop
      if not pg_catalog.pg_try_advisory_xact_lock(pg_catalog.hashtextextended(candidate.user_id::text,10)) then continue; end if;
      update public.report_ticket_redemptions set state='QUEUED',lease_token=gen_random_uuid(),not_before=clock_timestamp(),recovery_count=recovery_count+1,
        writer_lease_until=clock_timestamp() where id=candidate.id and state='RUNNING' and writer_lease_until<=clock_timestamp();
      if found then n:=n+1; end if;
    end loop;
    return jsonb_build_object('ok',true,'empty',true,'requeued',n);
  end if;
  if p_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  if p_action='enqueue' then
    if jsonb_typeof(p_data->'consentEvidence') is distinct from 'object' or (p_data->'consentEvidence'->>'version') is distinct from 'checkout-consent-v1'
      or nullif(p_data->>'policyAt','') is null then return jsonb_build_object('ok',false,'code','CONSENT_REQUIRED'); end if;
    result:=public.report_tickets('redeem',p_user,p_data);
    if not coalesce((result->>'ok')::boolean,false) then return result; end if;
    if (result->>'fresh')::boolean then
      update public.report_ticket_redemptions set state='QUEUED',publication_mode='queue-v1',policy_at=(p_data->>'policyAt')::timestamptz
        where id=(result->>'redemptionId')::uuid;
    end if;
    return public.report_ticket_publication('status',p_user,jsonb_build_object('requestId',p_data->>'requestId'));
  elsif p_action in ('save-chapter','chapters') then
    select * into r from public.report_ticket_redemptions where user_id=p_user and publication_mode='queue-v1' and id=(p_data->>'redemptionId')::uuid for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    stamp:=clock_timestamp();
    if r.state<>'RUNNING' or r.writer_version is distinct from 'v5' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp
      or (p_action='save-chapter' and r.writer_lease_until<=stamp) then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    if p_action='save-chapter' then
      if jsonb_typeof(p_data->'chapter') is distinct from 'object' or (p_data->>'source') not in ('writer','continuation') then return jsonb_build_object('ok',false,'code','INVALID_CHAPTER'); end if;
      -- 다시 쓴 장(짧은 장 재요청)은 이전 원고를 덮는다.
      insert into public.report_writer_chapters(redemption_id,chapter_n,source,chapter) values(r.id,(p_data->>'n')::integer,p_data->>'source',p_data->'chapter')
        on conflict(redemption_id,chapter_n) do update set source=excluded.source,chapter=excluded.chapter,created_at=now();
      return jsonb_build_object('ok',true);
    end if;
    select coalesce(jsonb_agg(jsonb_build_object('n',chapter_n,'source',source,'chapter',chapter) order by chapter_n),'[]') into chapters
      from public.report_writer_chapters where redemption_id=r.id;
    return jsonb_build_object('ok',true,'chapters',chapters);
  elsif p_action='defer' then
    -- 정식본이 아니면 보류: 큐로 되돌리고 not_before까지 집지 않는다(이용권은 그대로 사용 중, 환급 없음).
    select * into r from public.report_ticket_redemptions where user_id=p_user and publication_mode='queue-v1' and id=(p_data->>'redemptionId')::uuid for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    if r.state<>'RUNNING' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=clock_timestamp() then return jsonb_build_object('ok',false,'code','STALE_LEASE'); end if;
    update public.report_ticket_redemptions set state='QUEUED',lease_token=gen_random_uuid(),not_before=(p_data->>'until')::timestamptz,writer_lease_until=coalesce(writer_lease_until,clock_timestamp()),
      failure_code=left(p_data->>'code',100) where id=r.id;
    return jsonb_build_object('ok',true,'state','QUEUED','notBefore',p_data->>'until');
  elsif p_action in ('status','publish','reverse') then
    select * into r from public.report_ticket_redemptions where user_id=p_user and publication_mode='queue-v1'
      and (case when p_data ? 'redemptionId' then id=(p_data->>'redemptionId')::uuid else request_id=p_data->>'requestId' end) for update;
    if not found then return jsonb_build_object('ok',false,'code','NOT_FOUND'); end if;
    if r.state='RUNNING' and r.lease_until<=clock_timestamp() then
      perform public.report_tickets('reconcile',p_user,'{}');
      select * into r from public.report_ticket_redemptions where id=r.id;
    end if;
    if p_action='status' then
      return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id,'redemptionId',r.id);
    end if;
    if r.state in ('COMPLETED','REVERSED') then return jsonb_build_object('ok',true,'state',r.state,'reportId',r.report_id); end if;
    stamp:=clock_timestamp();
    if r.state<>'RUNNING' or r.lease_token is distinct from (p_data->>'token')::uuid or r.lease_until<=stamp then
      return jsonb_build_object('ok',false,'code','STALE_LEASE');
    end if;
    if p_action='publish' and not (coalesce(p_data->'snapshot'->>'productVersion','')='v4'
      or (coalesce(p_data->'snapshot'->>'productVersion','')='v5' and r.writer_version is not distinct from 'v5')) then
      return jsonb_build_object('ok',false,'code','PUBLISH_REJECTED');
    end if;
    result:=public.report_tickets(p_action,p_user,p_data);
    if p_action='publish' and coalesce((result->>'ok')::boolean,false) then delete from public.report_writer_chapters where redemption_id=r.id; end if;
    return result;
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
exception when raise_exception then
  if sqlerrm='TICKET_LOT_REFUND_HOLD' then return jsonb_build_object('ok',false,'code','REFUND_HOLD'); end if;
  raise;
end $$;
revoke all on function public.report_ticket_publication(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.report_ticket_publication(text,uuid,jsonb) to service_role;
commit;
