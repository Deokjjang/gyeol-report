-- 최종 A-18: ops_writer_raw(운영 워커 호출 원문 작업용 사본) 자동 정리 — raw_purge 동작 추가(운영 크론 /api/internal/ops-jobs 5분마다).
-- 규칙: 발행 완료(paid_report_snapshots COMPLETED·published_at) 30일 뒤 삭제. 발행 실패(작업 FAILED_REQUIRES_ATTENTION·EXPIRED, 교체 레인 포기,
-- 이용권 되돌림, 주문 환불·취소)는 처리 완료 30일 뒤 삭제. 함수 본문은 최종판3 7번(20261105160000)과 같고 raw_purge 분기만 더했다.
-- 기존 행·표 변경 없음(함수 교체만). 되돌리기: 20261105160000 파일의 함수 정의를 다시 실행.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regclass('public.ops_writer_raw') is null then raise exception 'FINAL4_RAW_PURGE_PREREQ: ops_writer_raw 없음(20261105160000 먼저)'; end if;
end $$;
create or replace function public.ops_writer_raw(p_action text, p_data jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ok boolean; entries jsonb; n integer;
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
  elsif p_action = 'raw_purge' then
    -- 최종 A-18: 발행 완료 30일 뒤, 발행 실패는 처리 완료(포기·환불·취소·이용권 되돌림·마지막 원문 저장 중 가장 늦은 때) 30일 뒤 지운다.
    -- 지우는 것은 이 작업용 사본뿐(Book 스냅샷 안 meta.raw는 고객 Book이라 그대로).
    with r as (select report_id, max(created_at) as last_at from public.ops_writer_raw group by report_id),
    done as (
      select r.report_id from r
      left join public.paid_report_snapshots s on s.report_id = r.report_id
      left join public.report_generation_jobs j on j.report_id = r.report_id
      left join public.book_generation_state g on g.report_id = r.report_id
      left join public.payment_orders o on o.payment_order_id = s.order_id
      left join public.report_ticket_redemptions t on t.report_id = r.report_id
      where (s.status = 'COMPLETED' and s.published_at is not null and s.published_at <= now() - interval '30 days')
         or ((j.status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED') or s.status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED') or g.phase = 'gave_up'
              or t.state = 'REVERSED' or o.status in ('refunded', 'canceled'))
             and coalesce(s.status, '') <> 'COMPLETED'
             and greatest(r.last_at, g.gave_up_at, o.refunded_at, o.canceled_at, t.completed_at) <= now() - interval '30 days')
    )
    delete from public.ops_writer_raw w using done d where w.report_id = d.report_id;
    get diagnostics n = row_count;
    return jsonb_build_object('ok', true, 'deleted', n);
  end if;
  return jsonb_build_object('ok', false, 'code', 'UNKNOWN_ACTION');
end $$;
revoke all on function public.ops_writer_raw(text, jsonb) from public, anon, authenticated;
grant execute on function public.ops_writer_raw(text, jsonb) to service_role;
commit;
