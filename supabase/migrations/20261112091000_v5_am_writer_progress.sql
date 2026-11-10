-- AM 4부(2026-11-11): 생성 대기 화면의 진짜 진행률·남은 시간·「1장 먼저 읽기」. 읽기 전용(service_role), 저장 경로는 그대로다.
-- 장 저장 행(ops_writer_chapters·report_writer_chapters)의 chapter JSON 안에 작가 과정이 넣은 _total(전체 장 수)·_preview(결정론 검사 뒤 미리보기)를 읽는다.
-- 남은 시간: 같은 상품의 최근 30일 발행(outcome=published) 소요 시간 중앙값(book_generation_runs, 표본 3개 미만이면 없음).
-- 미리보기 본문은 고객 원고라, 이 함수를 부르는 서버가 주인 확인을 한 뒤에만 화면에 보낸다(공개 진행 API는 수만 쓴다).
begin;
set local lock_timeout = '5s';
create or replace function public.am_writer_progress(p_data jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_report text := p_data->>'reportId'; v_red uuid := nullif(p_data->>'redemptionId', '')::uuid; v_product text; v_done int; v_total int; v_first jsonb; v_median numeric; v_samples int;
begin
  if v_red is not null then
    select r.product_type, r.report_id into v_product, v_report from public.report_ticket_redemptions r where r.id = v_red;
    select count(*), max((c.chapter->>'_total')::int), max(case when c.chapter_n = 1 then c.chapter->'_preview' end) into v_done, v_total, v_first from public.report_writer_chapters c where c.redemption_id = v_red;
  elsif v_report ~ '^report_[a-z0-9]{13,64}$' then
    select s.product_type into v_product from public.paid_report_snapshots s where s.report_id = v_report;
    select count(*), max((c.chapter->>'_total')::int), max(case when c.chapter_n = 1 then c.chapter->'_preview' end) into v_done, v_total, v_first from public.ops_writer_chapters c where c.report_id = v_report;
  else return jsonb_build_object('ok', false, 'code', 'INVALID'); end if;
  if v_product is null then return jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); end if;
  select percentile_cont(0.5) within group (order by r.duration_ms), count(*) into v_median, v_samples
    from public.book_generation_runs r join public.paid_report_snapshots s on s.report_id = r.report_id
    where s.product_type = v_product and r.outcome = 'published' and r.duration_ms > 0 and r.created_at > now() - interval '30 days';
  return jsonb_build_object('ok', true, 'product', v_product, 'done', coalesce(v_done, 0), 'total', v_total, 'first', v_first,
    'medianMs', case when v_samples >= 3 then round(v_median) else null end, 'samples', v_samples);
end $$;
revoke all on function public.am_writer_progress(jsonb) from public, anon, authenticated;
grant execute on function public.am_writer_progress(jsonb) to service_role;
commit;
