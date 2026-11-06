-- 최종판3 6: 운영 워커 호출 원문 저장소(주문 번호 키). 작가·검수·수리 응답을 받는 즉시 저장하고, 재시도는 저장본을 쓴다(같은 입력 재호출 0).
-- 현재 lease를 가진 쪽만 저장·조회한다: 결제 큐 작업(report_generation_jobs RUNNING), 교체 레인(book_generation_state.lane_token), 이용권 큐(report_ticket_redemptions RUNNING).
-- 추가만 하는 migration(기존 표·함수 변경 없음). 운영 적용은 배포 체크리스트 순서대로(덕짱님 승인 뒤).
create table if not exists public.ops_writer_raw(
  report_id text not null,
  raw_key text not null check (char_length(raw_key) between 8 and 64),
  kind text not null default '',
  entry jsonb not null check (jsonb_typeof(entry) = 'object'),
  created_at timestamptz not null default now(),
  primary key (report_id, raw_key)
);
alter table public.ops_writer_raw enable row level security;
revoke all on table public.ops_writer_raw from public, anon, authenticated;

create or replace function public.ops_writer_raw(p_action text, p_data jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; entries jsonb;
begin
  if p_action in ('raw_save', 'raw_load') then
    select exists(select 1 from public.report_generation_jobs x where x.report_id = p_data->>'reportId' and x.status = 'RUNNING' and x.lease_token = (p_data->>'token')::uuid and x.lease_until > now())
      or exists(select 1 from public.book_generation_state x where x.report_id = p_data->>'reportId' and x.lane_token = (p_data->>'token')::uuid and x.lane_until > now())
      or exists(select 1 from public.report_ticket_redemptions x where x.report_id = p_data->>'reportId' and x.state = 'RUNNING' and x.lease_token = (p_data->>'token')::uuid and x.lease_until > now())
      into ok;
    if not ok then return jsonb_build_object('ok', false, 'code', 'STALE_LEASE'); end if;
    if p_action = 'raw_save' then
      if jsonb_typeof(p_data->'entry') is distinct from 'object' or coalesce(p_data->'entry'->>'key', '') = '' then return jsonb_build_object('ok', false, 'code', 'INVALID_ENTRY'); end if;
      -- 같은 키는 처음 받은 원문을 지킨다(덮지 않는다).
      insert into public.ops_writer_raw(report_id, raw_key, kind, entry) values (p_data->>'reportId', p_data->'entry'->>'key', coalesce(p_data->'entry'->>'kind', ''), p_data->'entry')
        on conflict (report_id, raw_key) do nothing;
      return jsonb_build_object('ok', true);
    end if;
    select coalesce(jsonb_agg(entry order by created_at), '[]') into entries from public.ops_writer_raw where report_id = p_data->>'reportId';
    return jsonb_build_object('ok', true, 'entries', entries);
  elsif p_action = 'raw_clear' then
    delete from public.ops_writer_raw where report_id = p_data->>'reportId';
    return jsonb_build_object('ok', true);
  end if;
  return jsonb_build_object('ok', false, 'code', 'UNKNOWN_ACTION');
end $$;
revoke all on function public.ops_writer_raw(text, jsonb) from public, anon, authenticated;
grant execute on function public.ops_writer_raw(text, jsonb) to service_role;
