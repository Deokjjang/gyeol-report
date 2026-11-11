-- AM 4부(2026-11-11): 생성 대기 화면의 진짜 진행률·남은 시간·「1장 먼저 읽기」. 읽기 전용(service_role), 저장 경로는 그대로다.
-- 장 저장 행(ops_writer_chapters·report_writer_chapters)의 chapter JSON 안에 작가 과정이 넣은 _total(전체 장 수)·_preview(결정론 검사 뒤 미리보기)를 읽는다.
-- 남은 시간: 같은 상품의 최근 30일 발행(outcome=published) 소요 시간 중앙값(book_generation_runs, 표본 3개 미만이면 없음).
-- AM 7부(로컬 실화면 확인): 1장 미리보기는 jsonb라 max()가 없다(함수가 매번 오류) → array_agg … filter 첫 값으로.
-- AM 7부: 결제 책 「1장 먼저 읽기」 주인 확인(owner, userId·claimHash를 받을 때) — 완성 전 책은 claim_report_account가 늘 unavailable이라 미리보기가 403이었다.
-- 미리보기 본문은 고객 원고라, 이 함수를 부르는 서버가 주인 확인을 한 뒤에만 화면에 보낸다(공개 진행 API는 수만 쓴다).
begin;
set local lock_timeout = '5s';
create or replace function public.am_writer_progress(p_data jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_report text := p_data->>'reportId'; v_red uuid := nullif(p_data->>'redemptionId', '')::uuid; v_product text; v_done int; v_total int; v_first jsonb; v_median numeric; v_samples int;
  v_order text; v_owner boolean := false; v_user uuid := nullif(p_data->>'userId', '')::uuid; v_hash text := nullif(p_data->>'claimHash', '');
begin
  if v_red is not null then
    select r.product_type, r.report_id into v_product, v_report from public.report_ticket_redemptions r where r.id = v_red;
    select count(*), max((c.chapter->>'_total')::int), (array_agg(c.chapter->'_preview') filter (where c.chapter_n = 1))[1] into v_done, v_total, v_first from public.report_writer_chapters c where c.redemption_id = v_red;
  elsif v_report ~ '^report_[a-z0-9]{13,64}$' then
    select s.product_type, s.order_id into v_product, v_order from public.paid_report_snapshots s where s.report_id = v_report;
    -- 생성 중인 결제 책의 주인: 구매한 회원(구매 묶음·계정 연결) 또는 구매 확인 쿠키(claim_hash). 완성 전에는 claim_report_account가 늘 unavailable이다.
    v_owner := (v_user is not null and (exists (select 1 from public.report_purchase_bindings b where b.order_id = v_order and b.revoked_at is null and b.buyer_id = v_user)
        or exists (select 1 from public.report_account_links l where l.report_id = v_report and l.user_id = v_user and l.revoked_at is null)))
      or (v_hash is not null and exists (select 1 from public.report_purchase_bindings b where b.order_id = v_order and b.revoked_at is null and b.claim_hash = v_hash and b.claim_expires_at > now()));
    select count(*), max((c.chapter->>'_total')::int), (array_agg(c.chapter->'_preview') filter (where c.chapter_n = 1))[1] into v_done, v_total, v_first from public.ops_writer_chapters c where c.report_id = v_report;
  else return jsonb_build_object('ok', false, 'code', 'INVALID'); end if;
  if v_product is null then return jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); end if;
  select percentile_cont(0.5) within group (order by r.duration_ms), count(*) into v_median, v_samples
    from public.book_generation_runs r join public.paid_report_snapshots s on s.report_id = r.report_id
    where s.product_type = v_product and r.outcome = 'published' and r.duration_ms > 0 and r.created_at > now() - interval '30 days';
  return jsonb_build_object('ok', true, 'product', v_product, 'owner', v_owner, 'done', coalesce(v_done, 0), 'total', v_total, 'first', v_first,
    'medianMs', case when v_samples >= 3 then round(v_median) else null end, 'samples', v_samples);
end $$;
revoke all on function public.am_writer_progress(jsonb) from public, anon, authenticated;
grant execute on function public.am_writer_progress(jsonb) to service_role;
commit;
