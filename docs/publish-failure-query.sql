-- 결제 후 발행 실패 진단 (읽기 전용 SELECT만 있음. INSERT/UPDATE/DELETE 없음)
--
-- 실행: Supabase SQL 편집기(gyeol-report-prod)에서 아래 쿼리 블록을 하나씩 선택해 실행한다.
--       편집기는 마지막 문장 결과만 보여 주므로 블록을 나눠 실행해야 한다.
-- 스키마 근거(migration에 있는 열만 사용, 운영 패치 스크립트 적용 여부와 무관):
--   payment_orders            0004 + 20260920163924 (status, paid_at, product_type)
--   paid_report_snapshots     20260920163924 (status, published_at, expires_at) + 20261003114045 (ticket_redemption_id)
--   report_generation_jobs    20260920163924 (status, attempt_count, run_number, last_error_code)
--   report_generation_attempts 20260920163924 (failure_stage, error_code, validation_errors)
--   report_ticket_redemptions 20261003114045 (state, failure_code)
--
-- 분류(결제 주문 1건 = 1행, paid_at이 있는 주문만)
--   PUBLISHED                 발행됨(published_at 있음). 이후 만료돼도 발행으로 센다
--   FAILED_BEFORE_PUBLISH     발행 전 최종 실패(FAILED_REQUIRES_ATTENTION, published_at 없음)
--   QUARANTINED_AFTER_PUBLISH 발행 후 읽기 검사에서 막힘(READ_GATE_REJECTED / PUBLISHED_SNAPSHOT_VALIDATION_FAILED)
--   EXPIRED_UNPUBLISHED       발행 없이 보관 기간 만료
--   NO_REPORT_ROW             결제는 됐는데 리포트 행이 없음(결제 확정 후 연결 실패)
--   IN_PROGRESS               대기·생성·재시도 중
-- "원고 검증 실패" = 마지막 시도의 failure_stage = 'validation' (작성기 원고 또는 발행 검사 불합격).
-- 주의: 만료(90일) 후에는 attempts.validation_errors가 비워진다. error_code·failure_stage는 남는다.
-- 상태 값(migration CHECK 제약): paid_report_snapshots.status = QUEUED/GENERATING/RETRYING/COMPLETED/FAILED_REQUIRES_ATTENTION/EXPIRED,
--   report_generation_jobs.status = QUEUED/RUNNING/RETRYING/COMPLETED/FAILED_REQUIRES_ATTENTION/EXPIRED (리포트는 GENERATING, 작업은 RUNNING),
--   report_ticket_redemptions.state = RUNNING/COMPLETED/REVERSED.
-- 이용권 리포트는 order_id가 없고 ticket_redemption_id만 있다 → [1]~[4], [6]에는 안 들어가고 [5]에서만 센다.
--
-- 배포 전 기록할 것: [1]의 '최근 7일'·'최근 30일' 행, [6] 전체. 배포 24시간 뒤 같은 블록을 다시 돌려 비교한다.


-- [1] 기간별 건수와 비율 ------------------------------------------------------------
with orders as (
  select po.payment_order_id, po.product_type, po.paid_at,
         s.report_id, s.status as report_status, s.published_at,
         j.job_id, j.last_error_code
  from public.payment_orders po
  left join public.paid_report_snapshots s on s.order_id = po.payment_order_id
  left join public.report_generation_jobs j on j.order_id = po.payment_order_id
  where po.paid_at is not null
),
last_attempt as (
  select distinct on (a.job_id) a.job_id, a.failure_stage, a.error_code
  from public.report_generation_attempts a
  order by a.job_id, a.run_number desc, a.attempt desc
),
any_failure as (
  select a.job_id, bool_or(a.failure_stage is not null) as failed_once,
         bool_or(a.failure_stage = 'validation') as validation_failed_once
  from public.report_generation_attempts a group by a.job_id
),
classified as (
  select o.*, la.failure_stage as last_stage, la.error_code as last_error,
         coalesce(f.failed_once, false) as failed_once, coalesce(f.validation_failed_once, false) as validation_failed_once,
         case
           when o.report_id is null then 'NO_REPORT_ROW'
           when o.report_status = 'FAILED_REQUIRES_ATTENTION'
             and (o.published_at is not null or o.last_error_code in ('READ_GATE_REJECTED', 'PUBLISHED_SNAPSHOT_VALIDATION_FAILED'))
             then 'QUARANTINED_AFTER_PUBLISH'
           when o.report_status = 'FAILED_REQUIRES_ATTENTION' then 'FAILED_BEFORE_PUBLISH'
           when o.published_at is not null then 'PUBLISHED'
           when o.report_status = 'EXPIRED' then 'EXPIRED_UNPUBLISHED'
           else 'IN_PROGRESS'
         end as outcome
  from orders o
  left join last_attempt la on la.job_id = o.job_id
  left join any_failure f on f.job_id = o.job_id
),
periods(sort_key, period, since) as (
  values (1, '최근 24시간', now() - interval '1 day'), (2, '최근 7일', now() - interval '7 days'),
         (3, '최근 30일', now() - interval '30 days'), (4, '최근 90일', now() - interval '90 days'),
         (5, '전체', '-infinity'::timestamptz)
)
select p.period,
       count(c.*) as paid_orders,
       count(*) filter (where c.outcome = 'PUBLISHED') as published,
       count(*) filter (where c.outcome = 'PUBLISHED' and c.failed_once) as published_after_retry,
       count(*) filter (where c.outcome in ('FAILED_BEFORE_PUBLISH', 'EXPIRED_UNPUBLISHED')) as publish_failed,
       count(*) filter (where c.outcome in ('FAILED_BEFORE_PUBLISH', 'EXPIRED_UNPUBLISHED') and c.last_stage = 'validation') as publish_failed_by_manuscript_validation,
       count(*) filter (where c.outcome = 'QUARANTINED_AFTER_PUBLISH') as quarantined_after_publish,
       count(*) filter (where c.outcome = 'NO_REPORT_ROW') as no_report_row,
       count(*) filter (where c.outcome = 'IN_PROGRESS') as in_progress,
       round(100.0 * count(*) filter (where c.outcome in ('FAILED_BEFORE_PUBLISH', 'EXPIRED_UNPUBLISHED'))
             / nullif(count(*) filter (where c.outcome <> 'IN_PROGRESS'), 0), 2) as publish_failed_pct,
       round(100.0 * count(*) filter (where c.outcome in ('FAILED_BEFORE_PUBLISH', 'EXPIRED_UNPUBLISHED') and c.last_stage = 'validation')
             / nullif(count(*) filter (where c.outcome <> 'IN_PROGRESS'), 0), 2) as manuscript_validation_failed_pct,
       round(100.0 * count(*) filter (where c.validation_failed_once)
             / nullif(count(*) filter (where c.outcome <> 'IN_PROGRESS'), 0), 2) as validation_failed_any_attempt_pct
from periods p
left join classified c on c.paid_at >= p.since
group by p.sort_key, p.period
order by p.sort_key;


-- [2] 최근 30일 상품별 -------------------------------------------------------------
with orders as (
  select po.payment_order_id, po.product_type, s.status as report_status, s.published_at, j.job_id, j.last_error_code
  from public.payment_orders po
  left join public.paid_report_snapshots s on s.order_id = po.payment_order_id
  left join public.report_generation_jobs j on j.order_id = po.payment_order_id
  where po.paid_at >= now() - interval '30 days'
),
last_attempt as (
  select distinct on (a.job_id) a.job_id, a.failure_stage
  from public.report_generation_attempts a
  order by a.job_id, a.run_number desc, a.attempt desc
)
select o.product_type,
       count(*) as paid_orders,
       count(*) filter (where o.published_at is not null and o.report_status <> 'FAILED_REQUIRES_ATTENTION') as published,
       count(*) filter (where o.published_at is null and o.report_status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED')) as publish_failed,
       count(*) filter (where o.published_at is null and o.report_status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED') and la.failure_stage = 'validation') as by_manuscript_validation,
       count(*) filter (where o.report_status = 'FAILED_REQUIRES_ATTENTION'
         and (o.published_at is not null or o.last_error_code in ('READ_GATE_REJECTED', 'PUBLISHED_SNAPSHOT_VALIDATION_FAILED'))) as quarantined_after_publish,
       count(*) filter (where o.report_status in ('QUEUED', 'GENERATING', 'RETRYING')) as in_progress,
       round(100.0 * count(*) filter (where o.published_at is null and o.report_status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED'))
             / nullif(count(*) filter (where o.report_status is null or o.report_status not in ('QUEUED', 'GENERATING', 'RETRYING')), 0), 2) as publish_failed_pct
from orders o
left join last_attempt la on la.job_id = o.job_id
group by o.product_type
order by paid_orders desc;


-- [3] 최근 90일 최종 실패 사유 (마지막 시도 기준) ----------------------------------------
with failed as (
  select j.job_id, j.last_error_code, s.product_type
  from public.report_generation_jobs j
  join public.paid_report_snapshots s on s.report_id = j.report_id
  join public.payment_orders po on po.payment_order_id = j.order_id
  where po.paid_at >= now() - interval '90 days' and s.status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED') and s.published_at is null
),
last_attempt as (
  select distinct on (a.job_id) a.job_id, a.failure_stage, a.error_code, a.validation_errors
  from public.report_generation_attempts a
  where a.job_id in (select job_id from failed)
  order by a.job_id, a.run_number desc, a.attempt desc
)
select f.product_type, coalesce(la.failure_stage, '(시도 기록 없음)') as failure_stage,
       coalesce(la.error_code, f.last_error_code) as error_code,
       count(*) as reports,
       (array_agg(distinct v.code) filter (where v.code is not null))[1:8] as sample_validation_errors
from failed f
left join last_attempt la on la.job_id = f.job_id
left join lateral jsonb_array_elements_text(coalesce(la.validation_errors, '[]'::jsonb)) as v(code) on true
group by f.product_type, la.failure_stage, coalesce(la.error_code, f.last_error_code)
order by reports desc;


-- [4] 주별 추이 (최근 12주) ------------------------------------------------------------
select to_char(date_trunc('week', po.paid_at at time zone 'Asia/Seoul'), 'YYYY-MM-DD') as week_start_kst,
       count(*) as paid_orders,
       count(*) filter (where s.published_at is null and s.status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED')) as publish_failed,
       count(*) filter (where s.status = 'FAILED_REQUIRES_ATTENTION'
         and (s.published_at is not null or j.last_error_code in ('READ_GATE_REJECTED', 'PUBLISHED_SNAPSHOT_VALIDATION_FAILED'))) as quarantined_after_publish,
       round(100.0 * count(*) filter (where s.published_at is null and s.status in ('FAILED_REQUIRES_ATTENTION', 'EXPIRED'))
             / nullif(count(*) filter (where s.status is null or s.status not in ('QUEUED', 'GENERATING', 'RETRYING')), 0), 2) as publish_failed_pct
from public.payment_orders po
left join public.paid_report_snapshots s on s.order_id = po.payment_order_id
left join public.report_generation_jobs j on j.order_id = po.payment_order_id
where po.paid_at >= now() - interval '12 weeks'
group by 1
order by 1 desc;


-- [5] 이용권(티켓) 발행 — 결제 주문과 별도 경로. 실패하면 이용권이 되돌려진다(REVERSED) ---------
with periods(sort_key, period, since) as (
  values (1, '최근 24시간', now() - interval '1 day'), (2, '최근 7일', now() - interval '7 days'),
         (3, '최근 30일', now() - interval '30 days'), (4, '최근 90일', now() - interval '90 days'),
         (5, '전체', '-infinity'::timestamptz)
)
select p.period,
       count(r.*) as redemptions,
       count(*) filter (where r.state = 'COMPLETED') as published,
       count(*) filter (where r.state = 'REVERSED') as failed_and_reversed,
       count(*) filter (where r.state = 'RUNNING') as running,
       round(100.0 * count(*) filter (where r.state = 'REVERSED') / nullif(count(*) filter (where r.state <> 'RUNNING'), 0), 2) as failed_pct,
       (array_agg(distinct r.failure_code) filter (where r.failure_code is not null))[1:8] as failure_codes
from periods p
left join public.report_ticket_redemptions r on r.created_at >= p.since
group by p.sort_key, p.period
order by p.sort_key;


-- [6] 최근 7일·30일 결제 주문의 상태별 건수 (리포트 상태 × 작업 상태 × 마지막 오류 코드) ---------
--     실패가 어느 상태·코드에 몰려 있는지 본다. 이용권 리포트는 [5]에서 본다.
with periods(sort_key, period, since) as (
  values (1, '최근 7일', now() - interval '7 days'), (2, '최근 30일', now() - interval '30 days')
)
select p.period,
       coalesce(s.status, '(리포트 행 없음)') as report_status,
       coalesce(j.status, '(작업 없음)') as job_status,
       coalesce(j.last_error_code, '-') as last_error_code,
       count(*) as paid_orders
from periods p
join public.payment_orders po on po.paid_at >= p.since
left join public.paid_report_snapshots s on s.order_id = po.payment_order_id
left join public.report_generation_jobs j on j.order_id = po.payment_order_id
group by p.sort_key, p.period, 2, 3, 4
order by p.sort_key, paid_orders desc, report_status, job_status;
