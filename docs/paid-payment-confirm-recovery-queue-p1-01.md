# Payment confirmation recovery queue

## Reproduced defect

At b59650d, `pending_payment` selected the oldest READY order with a provider
payment ID and an expired confirmation lease. It neither claimed the row nor
excluded expired input. `confirm_claim` returned INPUT_EXPIRED without changing
eligibility. A local PGlite regression reproduces three selections of expired A
while recoverable B/C stay READY. The worker also awaited unbounded provider
confirmation before starting generation.

## Queue contract

New workers use `claim_payment_recovery`, one order per request. Eligibility:

- Toss, not soft-deleted, local status READY or PAID.
- READY has a recorded provider payment ID or confirmation token, showing a
  prior attempt; unattempted checkout orders are excluded.
- A PAID order with its matching durable report and job is excluded.
- No recovery attention marker, retry time reached, confirmation lease expired.

The transaction orders by next retry, creation time and order ID, then uses
`FOR UPDATE SKIP LOCKED`. It sets the existing confirmation token/2-minute lease,
increments `recovery_attempt_count` and moves retry eligibility two minutes
forward. Success callbacks use the same row lock and lease. An old worker's
`pending_payment` remains a filtered read-only compatibility action; only the
new worker provides the bounded recovery policy.

Four columns are added to `payment_orders`: `recovery_attempt_count`,
`recovery_next_retry_at`, `recovery_last_error_code`, `recovery_attention_at`.
An index supports due-order selection. No new financial status is introduced.

Missing identity, wrong catalog amount/currency, unavailable/expired durable
input or a conflicting report link moves the selected order to attention
without a provider call. It no longer occupies the queue head. Terminal
failed/canceled/refunded orders and completed order/report/job tuples are skipped.

## Retry and provider behavior

Provider network exceptions, malformed/unknown responses and generic provider
errors schedule retry after 1, 5, 15, then 60 minutes. Five claimed attempts
exhaust automatic recovery. Claims consume attempts even if a process crashes;
after the fifth expired lease, the next selection records attention without
another provider call. Failure bookkeeping also requires the current live token.

Known structured CANCELED/PARTIAL_CANCELED/ABORTED/EXPIRED responses, mismatched
identity/amount and missing configuration go to attention immediately. Local
financial status is preserved: an ambiguous response never invents a refund,
cancellation or failed payment. The existing client collapses HTTP/provider
error codes into TOSS_CONFIRM_PROVIDER_ERROR; these are conservatively treated
as uncertain, bounded retries, not inferred terminal results from message text.

Recovery continues to POST `/v1/payments/confirm` with the existing
`Idempotency-Key: confirm-{providerOrderId}` and identical payment key/order/amount.
It does not implement a new status-lookup API. This is an idempotent replay of
the original approval request, not a new order or payment key. See the
[official Toss API reference](https://docs.tosspayments.com/reference).
Provider uncertainty that cannot be resolved by replay needs operator review;
this change does not claim a new reconciliation guarantee beyond that contract.

The worker-only provider deadline is **10,000 ms**, including response parsing.
It aborts the fetch and stops awaiting it. A late success cannot call
`confirm_finish`. Customer success-page timing is unchanged. Generation starts
in parallel with recovery, and recovery exceptions cannot abort generation.
Both tasks are awaited; no background fire-and-forget generation is introduced.

## Idempotency and partial fulfillment

`confirm_finish` rejects missing/expired/stale tokens and terminal order states.
A fully fulfilled PAID replay returns the existing report ID without mutation.
Atomic order/report/job creation and provider/payment/order uniqueness remain.
If a finish response is lost after commit, the next claim skips the complete
tuple and a callback returns the same report.

PAID orders missing fulfillment skip the provider call. Valid durable input is
required. An existing matching queued report is reused and a missing job is
created once; otherwise a new report/job is created atomically when no prior
report link exists. Existing PAID timestamps and input expiry are preserved.
Legacy/conflicting links, expired input or a published report missing its job
require operator review. No arbitrary replacement report is created for them.
An inconsistent existing job causes the transaction to roll back, not leave a
new orphan report. The generation retry policy and 90-day expiry are unchanged.

## Observation and operator recovery

The existing authenticated GET `/api/internal/report-retry` returns an additional
`paymentRecovery` list for attention orders: safe order ID, local status, attempt
count, internal reason and timestamps. It does not include provider keys or
customer inputs. Existing report-job attention listing/retry is unchanged.

For queue status, operators can use this read-only SQL:

```sql
select payment_order_id, status, recovery_attempt_count,
       recovery_next_retry_at, recovery_last_error_code, recovery_attention_at,
       updated_at
from public.payment_orders
where recovery_attempt_count > 0 or recovery_attention_at is not null
order by recovery_attention_at nulls last, recovery_next_retry_at;
```

Attention is deliberately not automatically reset. Verify the provider's real
payment state, identity, retained input and report linkage before any operator
repair/requeue. No payment-recovery reset endpoint or admin UI is added here.
`last_error_code`/attempt count record the latest outcome, not a full history of
every provider attempt. DB failures leave the lease recoverable; persistent DB
outage still requires operations intervention.

## Manual production application (not executed)

1. Production reliability reconciliation must already be applied.
2. Apply `scripts/paid_report_quarantine_recovery_patch.sql` if not applied yet.
3. Paste the entire `scripts/paid_payment_confirm_recovery_queue_patch.sql` into
   a new Supabase SQL Editor query for `gyeol-report-prod` and run it once.
4. Verify the read-only checks below, then deploy the matching worker separately.

To display the exact patch locally:

```sh
cat scripts/paid_payment_confirm_recovery_queue_patch.sql
```

No `db push` or migration-history repair is needed. The patch is transactional
and rejects missing quarantine prerequisites with `QUARANTINE_PATCH_REQUIRED`
before changing columns or the RPC. It is repeatable, uses
ADD COLUMN/CREATE INDEX IF NOT EXISTS and replaces the
existing RPC with service-role-only permissions. It does not run recovery or
backfill customer reports. A five-second lock timeout rolls back if DDL cannot
acquire locks. The new RPC includes the quarantine preservation fix. Do not
reapply the older quarantine/reconciliation RPC after this patch: that would
remove the recovery actions. Keep the latest RPC during app rollback.

All columns in this read-only check should be true:

```sql
select
  (select count(*)=4 from information_schema.columns where table_schema='public'
    and table_name='payment_orders' and column_name in ('recovery_attempt_count',
      'recovery_next_retry_at','recovery_last_error_code','recovery_attention_at')) as columns_present,
  to_regclass('public.payment_orders_recovery_due_idx') is not null as due_index,
  position('claim_payment_recovery' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure))>0 as atomic_claim,
  position('expectedSnapshot' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure))>0 as quarantine_retained,
  not has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE') as anon_denied,
  not has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE') as authenticated_denied,
  has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE') as service_allowed;
```

Tests use actual patch SQL on local PGlite and mock provider transports only.
Concurrent calls and controlled interleavings verify tokens and idempotency;
PGlite serializes SQL statements and is not an independent multi-session load
test. Production application, real Toss/OpenAI calls and DB writes are excluded.
