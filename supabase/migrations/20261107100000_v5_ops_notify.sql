-- 운영 Q(2026-11-06): 텔레그램 두 봇 알림 통로 · 문의 사유 3개 · 책 열람 기록. 운영 적용은 운영 Q 11부 승인(docs/v5/ops/report.md).
-- 전제: 20261107090000_v5_perf_event_tickets.sql까지 적용. 기존 행은 지우거나 바꾸지 않는다(문의 0건 확인 후 적용).
--  1) pg_net: DB가 서버의 「대기표 비우기」 주소를 깨운다(내용은 보내지 않는다). 없으면(로컬 시험 DB) 예비 크론만 돈다.
--  2) ops_notifications(알림 대기표) + 트리거: 결제 완료 → 매출 「결제」, 결제 완료에서 환불·취소로 → 매출 「환불」(경로 무관), 문의 접수 → 처리 「문의」.
--     트리거는 대기표에 넣기만 한다. 넣다가 실패해도 예외를 삼켜 결제·환불·문의는 그대로 진행된다(결제 표의 기존 동작 변화 없음).
--  3) 문의(order_requests): 두 번 결제(double_paid) 사유, 이용권 책 문의(report_id), 기기 정보(user agent 요약), 처리 방법(resolution),
--     주문·책마다 열린 요청 1개(고유 인덱스).
--  4) report_views: 책 열람 기록(첫 열람 시각·횟수). 개인정보 없음 — 기기는 user agent의 sha256 앞 16자(같은 기기 30분 안 재열람을 1번으로).
--  5) ops_notify(서버 전용 RPC): 대기표 비우기·재전송·처리 봇 상태·통계·미발행 감지·문의 접수·열람 기록.
--  6) 기존 함수 두 곳을 앵커로 고친다: ops_admin 'requests'(이용권 책 요청도 보이게 left join + 책·기기·처리 방법),
--     'request_done'(관리자 직접 처리 = 안내), ops_requests_autoclose(자동 처리 라벨 → 처리 방법).
-- 되돌리기: docs/v5/ops/report.md 「롤백」 — 트리거 끄기 SQL, 바뀐 두 함수의 앞 본문(docs/v5/ops/rollback/*.before-20261107100000.sql).
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regclass('public.order_requests') is null or to_regclass('public.gift_rewards') is null or to_regclass('public.ops_settings') is null
    or to_regprocedure('public.ops_admin(text,jsonb)') is null or to_regprocedure('public.ops_requests_autoclose(text,text)') is null then
    raise exception 'OPS_Q_PREREQUISITE_MISSING';
  end if;
end $$;

create function pg_temp.q_patch(p_sig regprocedure, p_old text, p_new text, p_expected integer default 1) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef(p_sig);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> p_expected then raise exception 'OPS_Q_PATCH_ANCHOR % [%] found % expected %', p_sig, left(p_old, 70), n, p_expected; end if;
  execute replace(def, p_old, p_new);
end $$;

-- ── 1. pg_net ─────────────────────────────────────────────────────
do $$ begin
  create extension if not exists pg_net with schema extensions;
exception when others then
  raise notice 'OPS_Q_PG_NET_UNAVAILABLE: % (깨우기 없이 1분 예비 크론만 돈다)', sqlerrm;
end $$;

-- ── 2. 문의 ───────────────────────────────────────────────────────
alter table public.order_requests drop constraint order_requests_reason_check;
alter table public.order_requests add constraint order_requests_reason_check
  check(reason in ('calc_error','not_open','delayed','refund','other','double_paid'));
alter table public.order_requests alter column payment_order_id drop not null;
alter table public.order_requests
  add column report_id text check(report_id is null or (length(report_id) between 8 and 120 and report_id ~ '^report_[A-Za-z0-9_-]+$')),
  add column device text check(device is null or length(device) between 1 and 40),
  add column resolution text check(resolution is null or resolution in ('refund','regenerate','ticket','guide'));
alter table public.order_requests add constraint order_requests_target_check check(payment_order_id is not null or report_id is not null);
create unique index order_requests_open_order_key on public.order_requests(payment_order_id) where status='open' and payment_order_id is not null;
create unique index order_requests_open_report_key on public.order_requests(report_id) where status='open' and payment_order_id is null;
create index order_requests_user_idx on public.order_requests(user_id,created_at desc) where user_id is not null;

-- ── 3. 책 열람 기록 ────────────────────────────────────────────────
create table public.report_views(
  report_id text primary key check(length(report_id) between 8 and 120),
  payment_order_id text references public.payment_orders(payment_order_id) on delete cascade,
  first_viewed_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  last_counted_at timestamptz not null default now(),
  view_count integer not null default 1 check(view_count >= 1),
  last_device text check(last_device is null or last_device ~ '^[a-f0-9]{16}$'));
create index report_views_order_idx on public.report_views(payment_order_id) where payment_order_id is not null;

-- ── 4. 알림 대기표 ─────────────────────────────────────────────────
-- 내용 데이터(payload)에는 id만 담는다(주문·문의·대기표 id). 보낼 때 서버가 그때의 값으로 메시지를 만든다.
create table public.ops_notifications(
  id bigint generated always as identity primary key,
  kind text not null check(kind in ('payment','refund','request','unpublished','notify_failed','reminder')),
  bot text not null check(bot in ('sales','ops')),
  dedupe_key text not null unique check(length(dedupe_key) between 3 and 160),
  payload jsonb not null default '{}'::jsonb check(jsonb_typeof(payload)='object'),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  attempts integer not null default 0 check(attempts >= 0),
  last_error text check(last_error is null or length(last_error) <= 300),
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  message_id bigint,
  closed_at timestamptz,
  closed_line text check(closed_line is null or length(closed_line) <= 400),
  state jsonb not null default '{}'::jsonb check(jsonb_typeof(state)='object'),
  reminded_at timestamptz);
-- 알림 시작 시각: 1분 크론의 「누락 보충」은 이 뒤의 결제·환불·문의만 본다(첫 배포 때 옛 주문 알림이 쏟아지지 않게).
insert into public.ops_settings(key,value) values('notify_since',jsonb_build_object('at',now())) on conflict (key) do nothing;
create index ops_notifications_due_idx on public.ops_notifications(next_attempt_at) where sent_at is null and attempts < 10;
create index ops_notifications_open_idx on public.ops_notifications(created_at) where bot='ops' and closed_at is null;
create index ops_notifications_order_idx on public.ops_notifications((payload->>'paymentOrderId')) where payload ? 'paymentOrderId';
-- 텔레그램이 같은 요청을 다시 보내도 한 번만 처리(update_id).
create table public.ops_bot_updates(bot text not null check(bot in ('sales','ops')), update_id bigint not null, created_at timestamptz not null default now(), primary key(bot,update_id));
-- 「대기표 비우기」 주소의 분당 호출 수.
create table public.ops_notify_wakes(minute timestamptz primary key, calls integer not null default 1);

alter table public.report_views enable row level security;
alter table public.ops_notifications enable row level security;
alter table public.ops_bot_updates enable row level security;
alter table public.ops_notify_wakes enable row level security;
revoke all on table public.report_views,public.ops_notifications,public.ops_bot_updates,public.ops_notify_wakes from public,anon,authenticated;
grant select,insert,update on table public.report_views,public.ops_notifications to service_role;
grant select,insert,delete on table public.ops_bot_updates to service_role;
grant select,insert,update,delete on table public.ops_notify_wakes to service_role;
grant delete on table public.ops_notifications to service_role;
grant usage,select on sequence public.ops_notifications_id_seq to service_role;

-- 대기표에 넣기(트리거·감지 공용). 같은 키는 한 번만. 실패해도 부른 쪽(결제·환불·문의)은 그대로 진행된다.
create function public.ops_notify_enqueue(p_kind text, p_bot text, p_key text, p_payload jsonb) returns void
language plpgsql security definer set search_path='' as $$
begin
  insert into public.ops_notifications(kind,bot,dedupe_key,payload) values(p_kind,p_bot,p_key,coalesce(p_payload,'{}'::jsonb)) on conflict (dedupe_key) do nothing;
exception when others then
  raise warning 'OPS_NOTIFY_ENQUEUE_FAILED % %', p_key, sqlstate;
end $$;

-- 결제 완료 / 환불·취소(결제 완료였던 주문만). 관리자·처리 봇·자동 환불·외부 환불 기록 등 어느 경로든 상태가 바뀌면 잡는다.
create function public.ops_notify_payment_status() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.status='paid' and (tg_op='INSERT' or old.status is distinct from 'paid') then
    perform public.ops_notify_enqueue('payment','sales','pay:'||new.payment_order_id, jsonb_build_object('paymentOrderId',new.payment_order_id));
  elsif tg_op='UPDATE' and old.status='paid' and new.status in ('refunded','canceled') then
    perform public.ops_notify_enqueue('refund','sales','refund:'||new.payment_order_id, jsonb_build_object('paymentOrderId',new.payment_order_id));
  end if;
  return null;
exception when others then
  raise warning 'OPS_NOTIFY_TRIGGER_FAILED %', sqlstate;
  return null;
end $$;
create trigger ops_notify_payment after insert or update of status on public.payment_orders
  for each row execute function public.ops_notify_payment_status();

create function public.ops_notify_request_created() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  perform public.ops_notify_enqueue('request','ops','req:'||new.id::text, jsonb_build_object('requestId',new.id,
    'paymentOrderId',new.payment_order_id,'reportId',new.report_id));
  return null;
exception when others then
  raise warning 'OPS_NOTIFY_TRIGGER_FAILED %', sqlstate;
  return null;
end $$;
create trigger ops_notify_request after insert on public.order_requests
  for each row execute function public.ops_notify_request_created();

-- 대기표에 새 줄이 들어오면 서버를 깨운다(pg_net, 비동기 — 커밋된 뒤 보낸다). 주소는 ops_settings 'notify_wake_url'
-- (운영 서버의 웹훅 설정 크론이 자기 주소로 채운다. 로컬은 비어 있어 깨우지 않는다). 실패해도 넣기는 그대로.
create function public.ops_notify_wake() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_url text;
begin
  select value->>'url' into v_url from public.ops_settings where key='notify_wake_url';
  if v_url is null or v_url !~ '^https://[a-z0-9.-]+/api/' or to_regnamespace('net') is null then return null; end if;
  execute 'select net.http_post(url := $1, body := ''{}''::jsonb, headers := ''{"Content-Type":"application/json"}''::jsonb, timeout_milliseconds := 5000)' using v_url;
  return null;
exception when others then
  return null;
end $$;
create trigger ops_notify_wake after insert on public.ops_notifications
  for each statement execute function public.ops_notify_wake();

-- 운영 설정 두 가지만 서버가 쓴다(service_role은 ops_settings 읽기만 가진다): 깨우기 주소(https + /api/ 경로), 텔레그램 웹훅을 맞춘 배포 id.
create function public.ops_notify_put_setting(p_key text, p_value jsonb) returns boolean
language plpgsql security definer set search_path='' as $$
begin
  if p_key='notify_wake_url' then
    if p_value->>'url' is null or p_value->>'url' !~ '^https://[a-z0-9.-]+/api/[a-z0-9/_-]+$' or length(p_value->>'url') > 200 then return false; end if;
  elsif p_key='telegram_webhook' then
    if jsonb_typeof(p_value)<>'object' or length(p_value::text) > 500 then return false; end if;
  else
    return false;
  end if;
  insert into public.ops_settings(key,value) values(p_key,p_value)
    on conflict (key) do update set value=excluded.value,updated_at=now() where public.ops_settings.value is distinct from excluded.value;
  return true;
end $$;

-- 주문의 계정(주문 기록 → 구매 연결 → 책 계정 연결 순).
create function public.ops_order_user(p_order text) returns uuid
language sql stable security invoker set search_path='' as $$
  select coalesce(
    (select x.user_id from public.order_records x where x.payment_order_id=p_order),
    (select b.buyer_id from public.report_purchase_bindings b where b.order_id=p_order and b.revoked_at is null limit 1),
    (select l.user_id from public.report_account_links l join public.payment_orders po on po.report_id=l.report_id where po.payment_order_id=p_order and l.revoked_at is null limit 1));
$$;

-- 같은 계정·같은 상품·같은 입력(정규화한 입력값 jsonb의 md5)·서로 24시간 안의 결제 완료 주문(자기 포함, 결제 시각 순).
create function public.ops_notify_duplicates(p_order text) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare v_po public.payment_orders%rowtype; v_user uuid; v_hash text;
begin
  select * into v_po from public.payment_orders where payment_order_id=p_order;
  if not found or v_po.status<>'paid' or v_po.paid_at is null then return '[]'::jsonb; end if;
  v_user := public.ops_order_user(p_order);
  select md5((i.payload_json->'reportInputPayload')::text) into v_hash from public.report_input_snapshots i where i.order_id=p_order and i.payload_json ? 'reportInputPayload';
  if v_user is null or v_hash is null then return '[]'::jsonb; end if;
  return (select coalesce(jsonb_agg(jsonb_build_object('paymentOrderId',d.payment_order_id,'orderCode',dx.order_code,'amount',d.amount,'paidAt',d.paid_at,'reportId',d.report_id,
      'views',coalesce((select rv.view_count from public.report_views rv where rv.report_id=d.report_id),0)) order by d.paid_at, d.payment_order_id),'[]'::jsonb)
    from public.payment_orders d left join public.order_records dx on dx.payment_order_id=d.payment_order_id
    where d.status='paid' and d.product_type=v_po.product_type and d.paid_at between v_po.paid_at - interval '24 hours' and v_po.paid_at + interval '24 hours'
      and public.ops_order_user(d.payment_order_id)=v_user
      and exists(select 1 from public.report_input_snapshots di where di.order_id=d.payment_order_id and md5((di.payload_json->'reportInputPayload')::text)=v_hash));
end $$;

-- 메시지에 쓰는 주문 사실(이름·이메일·생년월일·입력값 없음).
create function public.ops_notify_order(p_order text) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare v_po public.payment_orders%rowtype; v_code text; v_user uuid; v_paid integer := 0; v_refunded integer := 0; v_first boolean := true; v_src jsonb;
begin
  select * into v_po from public.payment_orders where payment_order_id=p_order;
  if not found then return null; end if;
  select order_code into v_code from public.order_records where payment_order_id=p_order;
  v_user := public.ops_order_user(p_order);
  if v_user is not null then
    select count(*), count(*) filter (where mine.status='refunded'),
        not bool_or(mine.paid_at < v_po.paid_at or (mine.paid_at = v_po.paid_at and mine.payment_order_id < v_po.payment_order_id))
      into v_paid, v_refunded, v_first
      from public.payment_orders mine where mine.status in ('paid','refunded') and mine.paid_at is not null and public.ops_order_user(mine.payment_order_id)=v_user;
    select ca.source_metadata into v_src from public.campaign_attributions ca where ca.user_id=v_user limit 1;
  end if;
  return jsonb_build_object('paymentOrderId',v_po.payment_order_id,'orderCode',v_code,'productType',v_po.product_type,'amount',v_po.amount,'status',v_po.status,
    'createdAt',v_po.created_at,'paidAt',v_po.paid_at,'refundedAt',v_po.refunded_at,'reportId',v_po.report_id,'paymentKey',v_po.provider_payment_id,'providerOrderId',v_po.provider_order_id,
    'hasAccount',v_user is not null,'firstPaid',coalesce(v_first,true),'accountPaid',coalesce(v_paid,0),'accountRefunded',coalesce(v_refunded,0),'source',coalesce(v_src,'{}'::jsonb),
    'book',(select jsonb_build_object('status',sn.status,'publishedAt',sn.published_at) from public.paid_report_snapshots sn where sn.report_id=v_po.report_id),
    'job',(select jsonb_build_object('status',j.status,'attempts',j.attempt_count,'nextRetryAt',j.next_retry_at,'lastError',j.last_error_code) from public.report_generation_jobs j where j.report_id=v_po.report_id),
    'gen',(select jsonb_build_object('phase',g.phase,'regenerateRequestedAt',g.regenerate_requested_at,'officialAt',g.official_at,'interimAt',g.interim_at,'gaveUpAt',g.gave_up_at,'updatedAt',g.updated_at)
      from public.book_generation_state g where g.report_id=v_po.report_id),
    'views',coalesce((select rv.view_count from public.report_views rv where rv.report_id=v_po.report_id),0),
    'gift',(select jsonb_build_object('status',gr.status,'kind',gr.kind) from public.gift_rewards gr where gr.source_order_id=v_po.payment_order_id),
    'refund',(select jsonb_build_object('state',rf.state,'source',rf.source,'completedAt',rf.completed_at,'lastError',rf.last_error) from public.order_refunds rf where rf.payment_order_id=v_po.payment_order_id));
end $$;

-- 이용권으로 만든 책의 사실(주문 없음).
create function public.ops_notify_ticket(p_report text) returns jsonb
language plpgsql stable security invoker set search_path='' as $$
declare v_rr public.report_ticket_redemptions%rowtype;
begin
  select * into v_rr from public.report_ticket_redemptions where report_id=p_report order by created_at desc limit 1;
  if not found then return null; end if;
  return jsonb_build_object('reportId',p_report,'productType',v_rr.product_type,'createdAt',v_rr.created_at,'state',v_rr.state,'userId',v_rr.user_id,
    'book',(select jsonb_build_object('status',sn.status,'publishedAt',sn.published_at) from public.paid_report_snapshots sn where sn.report_id=p_report),
    'gen',(select jsonb_build_object('phase',g.phase,'regenerateRequestedAt',g.regenerate_requested_at,'officialAt',g.official_at,'gaveUpAt',g.gave_up_at,'updatedAt',g.updated_at)
      from public.book_generation_state g where g.report_id=p_report),
    'views',coalesce((select rv.view_count from public.report_views rv where rv.report_id=p_report),0),
    'accountPaid',(select count(*) from public.payment_orders mine where mine.status in ('paid','refunded') and public.ops_order_user(mine.payment_order_id)=v_rr.user_id),
    'accountRefunded',(select count(*) from public.payment_orders mine where mine.status='refunded' and public.ops_order_user(mine.payment_order_id)=v_rr.user_id));
end $$;

-- 서버 전용 RPC(처리 봇·매출 봇·대기표 비우기·서재 문의·열람 기록). 접근 검사는 호출 쪽(service_role).
create function public.ops_notify(p_action text, p_data jsonb default '{}'::jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare
  v_now timestamptz := now();
  v_lim integer := least(greatest(coalesce((p_data->>'limit')::integer, 10), 1), 50);
  v_day_start timestamptz := ((v_now at time zone 'Asia/Seoul')::date)::timestamp at time zone 'Asia/Seoul';
  v_n integer; v_kind text; v_res jsonb; v_user uuid; v_order text; v_report text; v_reason text; v_dev text; v_id uuid; v_start timestamptz; v_end timestamptz; v_swept integer;
  v_po public.payment_orders%rowtype;
begin
  if p_action='claim' then
    -- 보낼 차례인 줄을 잠깐(90초) 잡는다. 같은 줄을 두 곳이 동시에 보내지 않는다.
    with c as (select q.id from public.ops_notifications q where q.sent_at is null and q.attempts<10 and q.next_attempt_at<=v_now
                 and (q.locked_until is null or q.locked_until<v_now) order by q.id limit v_lim for update skip locked),
         u as (update public.ops_notifications n set locked_until=v_now+interval '90 seconds' from c where n.id=c.id returning n.*)
    select coalesce(jsonb_agg(jsonb_build_object('id',u.id,'kind',u.kind,'bot',u.bot,'payload',u.payload,'attempts',u.attempts,'createdAt',u.created_at) order by u.id),'[]'::jsonb) into v_res from u;
    return jsonb_build_object('ok',true,'items',v_res);
  elsif p_action='sent' then
    update public.ops_notifications set sent_at=v_now,message_id=nullif(p_data->>'messageId','')::bigint,locked_until=null,last_error=null,
      closed_at=case when coalesce((p_data->>'closed')::boolean,false) then v_now else closed_at end
      where id=(p_data->>'id')::bigint and sent_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='failed' then
    -- 다시 보내기 간격: 1·2·4·8…분, 최대 60분. 10번 실패하면 남겨 두고 처리 봇 경고(경고 자체의 실패는 다시 경고하지 않는다).
    update public.ops_notifications set attempts=attempts+1,last_error=left(coalesce(nullif(p_data->>'error',''),'FAILED'),300),locked_until=null,
      next_attempt_at=v_now+least(interval '1 minute'*power(2,attempts),interval '60 minutes')
      where id=(p_data->>'id')::bigint and sent_at is null returning attempts,kind into v_n,v_kind;
    if found and v_n>=10 and v_kind<>'notify_failed' then
      perform public.ops_notify_enqueue('notify_failed','ops','nfail:'||(p_data->>'id'),jsonb_build_object('notificationId',(p_data->>'id')::bigint,'failedKind',v_kind));
    end if;
    return jsonb_build_object('ok',found,'attempts',coalesce(v_n,0));
  elsif p_action='scan_unpublished' then
    -- 결제 뒤 30분이 지나도 책이 완성(발행)되지 않은 주문 → 처리 봇 「미발행」, 주문당 1번. 첫 배포 때 옛 주문이 쏟아지지 않게 최근 3일만 본다.
    insert into public.ops_notifications(kind,bot,dedupe_key,payload)
      select 'unpublished','ops','unpub:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id)
      from public.payment_orders po left join public.paid_report_snapshots sn on sn.report_id=po.report_id
      where po.status='paid' and po.paid_at<v_now-interval '30 minutes' and po.paid_at>v_now-interval '3 days'
        and (sn.report_id is null or sn.status<>'COMPLETED' or sn.published_at is null)
        and not exists(select 1 from public.order_refunds rf where rf.payment_order_id=po.payment_order_id)
      on conflict (dedupe_key) do nothing;
    get diagnostics v_n = row_count;
    -- 누락 보충: 트리거가 대기표에 넣지 못한 결제·환불·문의(트리거는 예외를 삼켜 결제를 막지 않는다)를 다시 넣는다. 알림 시작 뒤·최근 3일, 같은 키는 한 번만.
    select (value->>'at')::timestamptz into v_start from public.ops_settings where key='notify_since';
    v_start := greatest(coalesce(v_start,v_now),v_now-interval '3 days');
    insert into public.ops_notifications(kind,bot,dedupe_key,payload)
      select 'payment','sales','pay:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id) from public.payment_orders po
        where po.paid_at>=v_start and po.status in ('paid','refunded','canceled')
      union all
      select 'refund','sales','refund:'||po.payment_order_id,jsonb_build_object('paymentOrderId',po.payment_order_id) from public.payment_orders po
        where po.status in ('refunded','canceled') and po.paid_at is not null and coalesce(po.refunded_at,po.updated_at)>=v_start
      union all
      select 'request','ops','req:'||q.id::text,jsonb_build_object('requestId',q.id,'paymentOrderId',q.payment_order_id,'reportId',q.report_id) from public.order_requests q
        where q.created_at>=v_start
      on conflict (dedupe_key) do nothing;
    get diagnostics v_swept = row_count;
    return jsonb_build_object('ok',true,'added',v_n,'swept',v_swept);
  elsif p_action='order' then
    return jsonb_build_object('ok',true,'order',public.ops_notify_order(p_data->>'paymentOrderId'));
  elsif p_action='item' then
    -- 대기표 한 줄과 그 대상(문의·주문·이용권 책)의 지금 사실.
    select coalesce(n.payload->>'paymentOrderId',q.payment_order_id),coalesce(n.payload->>'reportId',q.report_id) into v_order,v_report
      from public.ops_notifications n left join public.order_requests q on q.id=nullif(n.payload->>'requestId','')::uuid where n.id=(p_data->>'id')::bigint;
    return (select jsonb_build_object('ok',true,'item',jsonb_build_object('id',n.id,'kind',n.kind,'bot',n.bot,'payload',n.payload,'state',n.state,'messageId',n.message_id,
        'createdAt',n.created_at,'sentAt',n.sent_at,'closedAt',n.closed_at,'closedLine',n.closed_line,'attempts',n.attempts,'lastError',n.last_error),
      'request',(select jsonb_build_object('id',q.id,'reason',q.reason,'status',q.status,'resolution',q.resolution,'resolvedBy',q.resolved_by,'resolvedAt',q.resolved_at,
        'createdAt',q.created_at,'device',q.device,'paymentOrderId',q.payment_order_id,'reportId',q.report_id) from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid),
      'order',case when v_order is not null then public.ops_notify_order(v_order) end,
      'ticket',case when v_order is null and v_report is not null then public.ops_notify_ticket(v_report) end,
      'duplicates',case when v_order is not null then public.ops_notify_duplicates(v_order) else '[]'::jsonb end,
      'regenFailedBefore',exists(select 1 from public.ops_notifications o2 where o2.id<>n.id and o2.state->>'regenFailed'='true'
        and ((v_order is not null and coalesce(o2.payload->>'paymentOrderId',(select q2.payment_order_id from public.order_requests q2 where q2.id=nullif(o2.payload->>'requestId','')::uuid))=v_order)
          or (v_order is null and v_report is not null and o2.payload->>'reportId'=v_report))),
      'failed',(select jsonb_build_object('id',f.id,'kind',f.kind,'attempts',f.attempts,'lastError',f.last_error,'createdAt',f.created_at) from public.ops_notifications f where f.id=nullif(n.payload->>'notificationId','')::bigint))
      from public.ops_notifications n where n.id=(p_data->>'id')::bigint);
  elsif p_action='open_items' then
    -- 버튼이 남은 처리 봇 메시지(보낸 것, 아직 정리 안 됨).
    select coalesce(jsonb_agg(n.id order by n.id),'[]'::jsonb) into v_res from public.ops_notifications n
      where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.kind in ('request','unpublished');
    return jsonb_build_object('ok',true,'ids',v_res);
  elsif p_action='begin_action' then
    -- 버튼 동작 하나만(두 번 눌러도·텔레그램이 다시 보내도 한 번). 정리된 메시지는 거절.
    update public.ops_notifications set state=state||jsonb_build_object('working',p_data->>'action','workingAt',v_now,'touchedAt',v_now)
      where id=(p_data->>'id')::bigint and closed_at is null and not (state ? 'working');
    return jsonb_build_object('ok',found);
  elsif p_action='patch_state' then
    update public.ops_notifications set state=(state - coalesce(array(select jsonb_array_elements_text(coalesce(p_data->'remove','[]'::jsonb))),'{}'::text[]))
        || coalesce(p_data->'set','{}'::jsonb) || jsonb_build_object('touchedAt',v_now)
      where id=(p_data->>'id')::bigint and closed_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='close' then
    update public.ops_notifications set closed_at=v_now,closed_line=left(p_data->>'line',400),state=(state - 'working' - 'workingAt' - 'pin')||coalesce(p_data->'set','{}'::jsonb)
      where id=(p_data->>'id')::bigint and closed_at is null;
    return jsonb_build_object('ok',found);
  elsif p_action='pin_waiting' then
    select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'pin',n.state->'pin','messageId',n.message_id) order by n.id),'[]'::jsonb) into v_res
      from public.ops_notifications n where n.bot='ops' and n.closed_at is null and n.state ? 'pin';
    return jsonb_build_object('ok',true,'items',v_res);
  elsif p_action='pending' then
    select coalesce(jsonb_agg(jsonb_build_object('id',n.id,'kind',n.kind,'messageId',n.message_id,'createdAt',n.created_at,'payload',n.payload,
        'orderCode',(select x.order_code from public.order_records x where x.payment_order_id=coalesce(n.payload->>'paymentOrderId',(select q.payment_order_id from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid))),
        'reason',(select q.reason from public.order_requests q where q.id=nullif(n.payload->>'requestId','')::uuid)) order by n.id),'[]'::jsonb) into v_res
      from public.ops_notifications n where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.kind in ('request','unpublished');
    return jsonb_build_object('ok',true,'items',v_res,'failed',(select coalesce(jsonb_agg(jsonb_build_object('id',f.id,'kind',f.kind,'bot',f.bot,'attempts',f.attempts,'lastError',f.last_error,'createdAt',f.created_at) order by f.id),'[]'::jsonb)
      from public.ops_notifications f where f.sent_at is null and f.attempts>=10));
  elsif p_action='remind' then
    -- 12시간 동안 손대지 않은 처리 건은 1번만 「미처리 N건」으로 다시 알린다.
    with t as (update public.ops_notifications n set reminded_at=v_now where n.bot='ops' and n.sent_at is not null and n.closed_at is null and n.reminded_at is null
                 and n.kind in ('request','unpublished') and coalesce((n.state->>'touchedAt')::timestamptz,n.sent_at)<v_now-interval '12 hours' returning n.id)
    select count(*) into v_n from t;
    if v_n>0 then perform public.ops_notify_enqueue('reminder','ops','remind:'||to_char(v_now at time zone 'Asia/Seoul','YYYYMMDDHH24MISS'),jsonb_build_object('count',v_n)); end if;
    return jsonb_build_object('ok',true,'reminded',v_n);
  elsif p_action='seen' then
    insert into public.ops_bot_updates(bot,update_id) values(p_data->>'bot',(p_data->>'updateId')::bigint) on conflict do nothing;
    get diagnostics v_n = row_count;
    return jsonb_build_object('ok',true,'fresh',v_n=1);
  elsif p_action='wake' then
    insert into public.ops_notify_wakes(minute) values(date_trunc('minute',v_now)) on conflict (minute) do update set calls=public.ops_notify_wakes.calls+1 returning calls into v_n;
    return jsonb_build_object('ok',true,'allowed',v_n<=least(greatest(coalesce((p_data->>'max')::integer,30),1),120),'calls',v_n);
  elsif p_action='purge' then
    delete from public.ops_bot_updates where created_at<v_now-interval '3 days';
    delete from public.ops_notify_wakes where minute<v_now-interval '1 day';
    delete from public.ops_notifications where (closed_at is not null and closed_at<v_now-interval '90 days') or (sent_at is not null and closed_at is null and bot='sales' and sent_at<v_now-interval '90 days');
    return jsonb_build_object('ok',true);
  elsif p_action='stats' then
    -- 매출 봇 /today·/yesterday·/month. [start,end)는 서버가 한국 날짜로 넘긴다. 결제 = 그 기간에 결제 완료된 주문(뒤에 환불됐어도 결제로 센다).
    v_start := (p_data->>'start')::timestamptz; v_end := (p_data->>'end')::timestamptz;
    with pays as (select po.payment_order_id,po.product_type,po.amount,po.paid_at,public.ops_order_user(po.payment_order_id) uid from public.payment_orders po
                    where po.status in ('paid','refunded') and po.paid_at>=v_start and po.paid_at<v_end),
         firsts as (select p.*, not exists(select 1 from public.payment_orders p2 where p2.status in ('paid','refunded') and p2.paid_at<p.paid_at and p.uid is not null
                    and public.ops_order_user(p2.payment_order_id)=p.uid) is_first from pays p),
         refs as (select po.amount from public.payment_orders po where po.status in ('refunded','canceled') and po.refunded_at>=v_start and po.refunded_at<v_end)
    select jsonb_build_object('ok',true,'payCount',(select count(*) from pays),'paySum',(select coalesce(sum(amount),0) from pays),
      'refundCount',(select count(*) from refs),'refundSum',(select coalesce(sum(amount),0) from refs),
      'newCount',(select count(*) from firsts where is_first),'repeatCount',(select count(*) from firsts where not is_first),
      'byProduct',(select coalesce(jsonb_agg(jsonb_build_object('productType',t.product_type,'count',t.c,'sum',t.s) order by t.s desc),'[]'::jsonb)
        from (select product_type,count(*) c,sum(amount) s from pays group by product_type) t)) into v_res;
    return v_res;
  elsif p_action='event_stats' then
    -- 매출 봇 /event: 1+1 증정 이용권(kind=event).
    return (select jsonb_build_object('ok',true,'issued',count(*),'usedSelf',count(*) filter (where gr.status='used_self'),
      'gifted',count(*) filter (where gr.status='gifted'),'claimed',count(*) filter (where gr.status='claimed'),
      'available',count(*) filter (where gr.status='available' and gr.expires_at>v_now),'revoked',count(*) filter (where gr.status='revoked'),
      'expired',count(*) filter (where gr.status='expired' or (gr.status='available' and gr.expires_at<=v_now)),
      'nextExpiry',min(gr.expires_at) filter (where gr.status in ('available','gifted') and gr.expires_at>v_now))
      from public.gift_rewards gr where gr.kind='event');
  elsif p_action='submit' then
    -- 서재 문의 접수. 확인 없이 바로 처리할 수 있는 두 사유만. 계정당 하루(한국 날짜) 3건, 주문·책마다 열린 요청 1개.
    v_user := nullif(p_data->>'userId','')::uuid; v_reason := p_data->>'reason'; v_order := nullif(p_data->>'paymentOrderId',''); v_report := nullif(p_data->>'reportId','');
    v_dev := nullif(left(regexp_replace(coalesce(p_data->>'device',''),'[\u0000-\u001f\u007f]','','g'),40),'');
    if v_reason is null or v_reason not in ('not_open','double_paid') then return jsonb_build_object('ok',false,'code','REASON_INVALID'); end if;
    if v_user is not null then
      select count(*) into v_n from public.order_requests where user_id=v_user and created_at>=v_day_start;
      if v_n>=3 then return jsonb_build_object('ok',false,'code','DAILY_LIMIT'); end if;
    end if;
    if v_order is not null then
      select * into v_po from public.payment_orders where payment_order_id=v_order;
      if not found or v_po.status<>'paid' then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
      if exists(select 1 from public.order_requests where payment_order_id=v_order and status='open') then return jsonb_build_object('ok',false,'code','ALREADY_OPEN'); end if;
      if v_reason='not_open' and v_po.paid_at>v_now-interval '30 minutes'
        and not exists(select 1 from public.paid_report_snapshots sn where sn.report_id=v_po.report_id and (sn.status in ('COMPLETED','FAILED_REQUIRES_ATTENTION','EXPIRED'))) then
        return jsonb_build_object('ok',false,'code','MAKING');
      end if;
      if v_reason='double_paid' and jsonb_array_length(public.ops_notify_duplicates(v_order))<2 then return jsonb_build_object('ok',false,'code','NO_DOUBLE'); end if;
      v_report := null;
    else
      if v_report is null or v_user is null then return jsonb_build_object('ok',false,'code','TARGET_REQUIRED'); end if;
      if v_reason<>'not_open' then return jsonb_build_object('ok',false,'code','REASON_INVALID'); end if;
      if not exists(select 1 from public.report_ticket_redemptions rr where rr.report_id=v_report and rr.user_id=v_user) then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
      if exists(select 1 from public.order_requests where report_id=v_report and payment_order_id is null and status='open') then return jsonb_build_object('ok',false,'code','ALREADY_OPEN'); end if;
      if exists(select 1 from public.report_ticket_redemptions rr where rr.report_id=v_report and rr.state in ('QUEUED','RUNNING') and rr.created_at>v_now-interval '30 minutes') then
        return jsonb_build_object('ok',false,'code','MAKING');
      end if;
    end if;
    begin
      insert into public.order_requests(payment_order_id,report_id,user_id,reason,memo,device) values(v_order,v_report,v_user,v_reason,'',v_dev) returning id into v_id;
    exception when unique_violation then return jsonb_build_object('ok',false,'code','ALREADY_OPEN');
    end;
    return jsonb_build_object('ok',true,'id',v_id);
  elsif p_action='card_results' then
    -- 서재 책 카드 한 줄: 열린 요청 또는 7일 안에 처리된 요청(주문·책마다 가장 최근 1건).
    select coalesce(jsonb_agg(jsonb_build_object('paymentOrderId',t.payment_order_id,'orderCode',t.order_code,'reportId',t.report_ref,'reason',t.reason,'status',t.status,
        'resolution',t.resolution,'resolvedAt',t.resolved_at,'createdAt',t.created_at)),'[]'::jsonb) into v_res
      from (select distinct on (coalesce(q.payment_order_id,q.report_id)) q.*,x.order_code,coalesce(q.report_id,po.report_id) report_ref
              from public.order_requests q left join public.order_records x on x.payment_order_id=q.payment_order_id left join public.payment_orders po on po.payment_order_id=q.payment_order_id
              where q.user_id=(p_data->>'userId')::uuid and (q.status='open' or q.resolved_at>v_now-interval '7 days')
              order by coalesce(q.payment_order_id,q.report_id),q.created_at desc) t;
    return jsonb_build_object('ok',true,'results',v_res);
  elsif p_action='resolve_request' then
    -- 처리 봇이 처리한 요청: 처리 완료 + 시각 + 방법.
    update public.order_requests set status='done',resolved_at=v_now,resolved_by='admin',resolution=p_data->>'resolution',
        admin_note=left(coalesce(nullif(p_data->>'note',''),'처리 봇: '||(p_data->>'resolution'))||' · '||to_char(v_now at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' (KST)',1000)
      where id=(p_data->>'requestId')::uuid and status='open';
    return jsonb_build_object('ok',found);
  elsif p_action='record_view' then
    -- 책 열람(서버가 본문을 내줄 때). 같은 기기로 30분 안에 다시 연 것은 세지 않는다. 페이지 이동은 서버 열람이 아니라 세지 않는다.
    v_report := p_data->>'reportId';
    if v_report is null or length(v_report) not between 8 and 120 then return jsonb_build_object('ok',false,'code','REPORT_INVALID'); end if;
    v_dev := p_data->>'device'; if v_dev is null or v_dev !~ '^[a-f0-9]{16}$' then v_dev := null; end if;
    insert into public.report_views as rv(report_id,payment_order_id,last_device)
      values(v_report,(select sn.order_id from public.paid_report_snapshots sn where sn.report_id=v_report),v_dev)
      on conflict (report_id) do update set
        view_count=rv.view_count+case when v_dev is not null and rv.last_device=v_dev and rv.last_counted_at>v_now-interval '30 minutes' then 0 else 1 end,
        last_counted_at=case when v_dev is not null and rv.last_device=v_dev and rv.last_counted_at>v_now-interval '30 minutes' then rv.last_counted_at else v_now end,
        last_viewed_at=v_now,last_device=coalesce(v_dev,rv.last_device);
    return jsonb_build_object('ok',true);
  elsif p_action='hold_retry' then
    -- 미발행 건에서 환불을 고르면 그 주문의 자동 재시도를 멈춘다(환불이 끝나면 기존 환불 처리가 작업을 확인 필요로 바꾼다).
    update public.report_generation_jobs set next_retry_at=v_now+interval '30 days',last_error_code='REFUND_HOLD'
      where order_id=p_data->>'paymentOrderId' and status in ('QUEUED','RETRYING');
    get diagnostics v_n = row_count;
    return jsonb_build_object('ok',true,'held',v_n);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;

-- ── 5. 기존 함수 고치기(앵커) ────────────────────────────────────────
-- 관리자 요청함: 이용권 책 요청(주문 없음)도 보이게 + 책·기기·처리 방법.
select pg_temp.q_patch('public.ops_admin(text,jsonb)'::regprocedure,
  $p$from public.order_requests q0 join public.order_records r on r.payment_order_id=q0.payment_order_id join public.payment_orders o on o.payment_order_id=q0.payment_order_id$p$,
  $p$from public.order_requests q0 left join public.order_records r on r.payment_order_id=q0.payment_order_id left join public.payment_orders o on o.payment_order_id=q0.payment_order_id$p$);
select pg_temp.q_patch('public.ops_admin(text,jsonb)'::regprocedure,
  $p$'resolvedBy',q0.resolved_by) order by q0.created_at)$p$,
  $p$'resolvedBy',q0.resolved_by,'reportId',coalesce(q0.report_id,o.report_id),'device',q0.device,'resolution',q0.resolution) order by q0.created_at)$p$);
-- 관리자가 화면에서 직접 「처리 완료」 = 고객 카드에는 안내(처리 봇 [안내]와 같은 문구).
select pg_temp.q_patch('public.ops_admin(text,jsonb)'::regprocedure,
  $p$resolved_at=now(),resolved_by='admin' where$p$,
  $p$resolved_at=now(),resolved_by='admin',resolution=coalesce(resolution,'guide') where$p$);
-- 자동 처리(환불·외부 환불·재생성·이용권 지급) → 처리 방법.
select pg_temp.q_patch('public.ops_requests_autoclose(text,text)'::regprocedure,
  $p$update public.order_requests set status='done',resolved_at=now(),resolved_by='auto',$p$,
  $p$update public.order_requests set status='done',resolved_at=now(),resolved_by='auto',
    resolution=coalesce(resolution,case when p_label in ('환불 완료','외부 환불 기록') then 'refund' when p_label='재생성 요청' then 'regenerate' when p_label='이용권 지급' then 'ticket' else 'guide' end),$p$);

revoke all on function public.ops_notify_enqueue(text,text,text,jsonb),public.ops_notify_payment_status(),public.ops_notify_request_created(),public.ops_notify_wake(),
  public.ops_notify_put_setting(text,jsonb),public.ops_order_user(text),public.ops_notify_duplicates(text),public.ops_notify_order(text),public.ops_notify_ticket(text),
  public.ops_notify(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_notify_put_setting(text,jsonb),public.ops_order_user(text),public.ops_notify_duplicates(text),public.ops_notify_order(text),
  public.ops_notify_ticket(text),public.ops_notify(text,jsonb),public.ops_notify_enqueue(text,text,text,jsonb) to service_role;

commit;
