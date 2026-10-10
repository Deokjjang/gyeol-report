-- READ ONLY, aggregate metadata only: no names, payloads, keys or manuscripts.
-- RUNNING includes overdue leases; claim_job recovers them, this query does not.
select status, count(*) as jobs from public.report_generation_jobs group by status order by status;

select
  count(*) filter (where j.status in ('QUEUED','RETRYING') and j.next_retry_at<=now()) as retry_or_queue_due,
  count(*) filter (where j.status='RUNNING' and j.lease_until<now()) as expired_running_leases,
  min(j.created_at) filter (where j.status in ('QUEUED','RETRYING','RUNNING')) as oldest_pending_created_at,
  max(now()-j.created_at) filter (where j.status in ('QUEUED','RETRYING','RUNNING')) as oldest_pending_age,
  count(*) filter (where j.status in ('QUEUED','RETRYING','RUNNING') and po.paid_at<=now()-interval '24 hours') as paid_pending_over_24h
from public.report_generation_jobs j join public.payment_orders po on po.payment_order_id=j.order_id
where po.status='paid';

select
  count(*) filter (where published_at>now()-interval '1 hour') as first_publications_last_hour,
  count(*) filter (where published_at>now()-interval '24 hours') as first_publications_last_day,
  count(*) filter (where expires_at<=now() and (status is distinct from 'EXPIRED' or snapshot_json is not null)) as expiry_cleanup_due
from public.paid_report_snapshots;

select count(*) as attempts_last_hour,
  count(*) filter (where error_code is not null) as failed_attempts,
  percentile_cont(0.5) within group (order by duration_ms) as p50_duration_ms,
  percentile_cont(0.95) within group (order by duration_ms) as p95_duration_ms
from public.report_generation_attempts where finished_at>now()-interval '1 hour';

select count(*) filter (where recovery_attention_at is not null) as payment_recovery_attention,
  count(*) filter (where recovery_attention_at is null and recovery_next_retry_at<=now()
    and coalesce(confirm_lease_until,'epoch')<=now()) as payment_recovery_candidates
from public.payment_orders where status='ready' and provider='toss' and deleted_at is null
  and provider_payment_id is not null;
