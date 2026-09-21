# Paid report quarantine recovery

## Contract

Only `COMPLETED` + publish gate PASS may return a snapshot to the customer.
On gate failure, the read path returns attention UX with `snapshot: null`, no
share control and no request for another payment. It calls `quarantine` with
the exact observed snapshot as `expectedSnapshot` (SQL/JSON null is supported).

The RPC locks the job, then the report, matching `finish_job` and `admin_retry`.
It changes both COMPLETED states to `FAILED_REQUIRES_ATTENTION` only when the
stored snapshot still equals the observation and has not expired. It records
`PUBLISHED_SNAPSHOT_VALIDATION_FAILED` in `job.last_error_code`. Repeated or
stale observations are no-ops; they do not append generation attempts.

Neither quarantine nor failed generation attempts assign `snapshot_json`.
The stored JSONB value, evidence, longform and calculation version are retained
unchanged. PAID, order/report identifiers, durable input and attempts remain.
The existing CHECK must also be replaced: its former non-COMPLETED branch
required NULL, which prevented forensic preservation. The replacement keeps
the COMPLETED publication condition and requires NULL for EXPIRED, while
allowing retained content in attention/queued/generating/retrying states.

## Recovery and expiry

The existing authenticated `/api/internal/report-retry` entry point queues a
new run. `claim_job` loads only `report_input_snapshots.payload_json` as input;
the invalid snapshot is never a generation input. Each recovery attempt uses
the existing writer/retry/fallback and publish gate. A successful publication
replaces the retained snapshot; failed attempts leave it intact. Three failed
attempts or exhausted crash leases return to attention. Retry timing is unchanged.

The existing authenticated worker calls `expire` before claiming jobs. After
`expires_at`, reads return EXPIRED immediately. Cleanup subsequently clears
snapshot content and input, clears attempt validation details and retains
financial records. Quarantine does not extend any expiry. If the worker is
unavailable, reads stay blocked but physical cleanup waits for the scheduler.

There is no revision archive: the quarantined value is retained until successful
replacement or expiry, not forever. The job's diagnostic code can be replaced
by later recovery errors; generation attempts preserve those later failures.
If the attention RPC fails, the customer response still hides the snapshot;
the next read retries isolation. A delayed reader may show attention once even
after successful recovery; its next read sees the new validated snapshot.

## Manual production application (not performed in this task)

Prerequisite: `20260920163924_production_reliability_reconcile.sql` was applied.
Use a new Supabase SQL Editor query for `gyeol-report-prod` and paste the entire
file `scripts/paid_report_quarantine_recovery_patch.sql`. To display the file:

```sh
cat scripts/paid_report_quarantine_recovery_patch.sql
```

Apply the SQL patch before the matching application release. It atomically
replaces one CHECK and the existing RPC, preserving the RPC signature, pinned
search path and service-role-only execute permission. It does not update,
delete or backfill rows. It is repeatable and independent of migration history;
do not use `db push` or `migration repair` to apply it. A five-second lock timeout
aborts the transaction safely if the table is busy; retry later in a new query.

Old application readers lack `expectedSnapshot`, so the patched RPC declines
their quarantine mutation. They still hide invalid content. New readers on
the old RPC would still delete snapshots: SQL-first ordering is required.
Do not restore the historical destructive RPC as an application rollback.
Fresh databases built from 0001–0013 also need this patch after reconciliation.

After applying, run this READ-ONLY verification; all columns must be true:

```sql
select
  exists (select 1 from pg_constraint
    where conrelid='public.paid_report_snapshots'::regclass
      and conname='paid_report_snapshots_publication_check' and convalidated) as preservation_check,
  not exists (select 1 from pg_constraint
    where conrelid='public.paid_report_snapshots'::regclass
      and conname='paid_report_snapshots_check') as old_check_removed,
  position('expectedSnapshot' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure)) > 0 as observed_snapshot_guard,
  position('PUBLISHED_SNAPSHOT_VALIDATION_FAILED' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure)) > 0 as audit_reason,
  not has_function_privilege('anon','public.paid_report_reliability(text,jsonb)','EXECUTE') as anon_denied,
  not has_function_privilege('authenticated','public.paid_report_reliability(text,jsonb)','EXECUTE') as authenticated_denied,
  has_function_privilege('service_role','public.paid_report_reliability(text,jsonb)','EXECUTE') as service_role_allowed;
```

## Verification boundaries

PGlite runs the historical migrations, production reconciliation and exact SQL
patch. Tests compare stored `snapshot_json::text` before/after, exercise full
recovery success/failure/expiry, repeated calls, delayed-reader interleavings,
idempotent patch application and permissions. PGlite serializes SQL calls;
these tests do not claim independent multi-session production load coverage.
Page rendering tests check hidden forensic content/share links/internal codes.
No production DB, Toss or OpenAI calls are used.
