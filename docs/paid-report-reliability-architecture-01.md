# PAID-REPORT-RELIABILITY-ARCHITECTURE-01

## Incident audit (before modification)

The supplied screenshots show an incomplete paid comprehensive report. No incident reportId, production snapshot, deployment revision, or attempt log is available. Findings below distinguish code defects from unverified incident history.

- `comprehensiveReportDraftSchema.ts`: the actual OpenAI narrative schema and prompt required `chapters` but omitted `longformReadings`, with `additionalProperties: false`. `ComprehensiveReportV2View` rendered its long body exclusively from `longformReadings`. The legacy validator treated that field as optional. A schema-conforming writer result could therefore produce an empty body area.
- `comprehensiveV2GenerationHandler.ts`: an unknown/empty birth time omits the hour pillar in deterministic calculation. The legacy validator accepted missing pillar strings and grid. The view required all four pillars and rendered the screenshot's notice instead. This is a confirmed permitted failure path, not proof of the incident customer's original birth-time input.
- `scripts/smoke_generate_comprehensive_report_draft.ts`: the old preview generator separately supplemented pillar data from fixture expectations and produced its own longform fallback. That preview was not proof of paid fulfillment correctness. The comprehensive dev page and product preview API now call `generateProductReport`, also used by the job worker. The older script remains a legacy knowledge/fixture utility; its saved output is no longer the comprehensive dev page's source or release evidence.
- `ComprehensiveReportV2View`: quick interpretations called a label switch instead of displaying the persisted feature explanation. Unrecognized labels all received the exact same generic text. The view now renders each item's validated `plainMeaning` and `practicalUse`.
- The local handler normalized deterministic feature explanations, but the writer attachment did not apply that normalization. Both now use the same normalization before validation.
- Paid fulfillment already included `evidencePacket` when present, but it was optional and not passed into the comprehensive view. The view now receives it; publication and durable reads require it.
- Old fulfillment persisted `{ ...validation.value, productVersion: "v2" }` in a product snapshot with evidence. It did not intentionally trim longform after validation; its validation contract allowed the omissions before persistence.
- Offline reproduction before the fix: valid local draft had 15 top-level fields, 18 populated profile fields, four pillars, eight chapters, ten longforms, and evidence with 18 top-level fields. Deleting all four pillars/grid and longforms still returned validator PASS. These are fixture counts, **not incident persisted counts**.
- Dispatcher automatically tried local fallback after writer failure without durable attempt history. Whether that fallback ran for the incident cannot be established from the screenshots. New paid attempts explicitly select a strategy and disable implicit fallback.

## Persistence

Migration: `supabase/migrations/0013_paid_report_reliability.sql`.

| Table | Purpose |
| --- | --- |
| `payment_orders` | Existing durable payment record; unique provider order ID and payment key; PAID independent of generation; confirmation lease/token |
| `report_input_snapshots` | Full pre-checkout input; one row per order; expiry independent of financial retention |
| `paid_report_snapshots` | One immutable published snapshot per order, including exact draft and evidence; publication state and 90-day expiry |
| `report_generation_jobs` | One job per order/report, attempt count, retry time, run number, fenced lease |
| `report_generation_attempts` | Append-only attempts across admin retries, strategy/model, timestamps/duration, stage/code, validation errors |

The dedicated paid snapshot table avoids mixing new publish guarantees with legacy `reports` rows. Existing legacy rows are not silently upgraded to valid paid reports. New tables have RLS and no anon/authenticated access. Only the server service role can call the reliability RPC. Legacy anonymous payment/publish/read RPC privileges are revoked by the migration.

## State and recovery

Payment: `ready → paid`; generation failures never change payment status. Confirmation first durably reserves the payment key. Provider confirmation uses a stable per-order idempotency key. The commit after DONE atomically records PAID, reserves reportId, and queues the job. If the process or DB fails between provider approval and commit, the durable reservation is reconciled by the worker using the same key. Provider reconciliation must be verified in a Toss test environment before live launch; no provider calls were made in this task.

Generation: `QUEUED → RUNNING → COMPLETED`, or `RUNNING → RETRYING → RUNNING`, finally `FAILED_REQUIRES_ATTENTION`. Public snapshot state uses `GENERATING` while a job runs. No failed draft is persisted as public content.

1. Normal writer.
2. Writer regeneration after at least 30 seconds.
3. Full local deterministic generation after at least 2 minutes.

Every attempt uses the same publication gate. Comprehensive writer internal repair and dispatcher implicit fallback are disabled for this pipeline, so attempt selection is explicit. A missing writer configuration fails attempts 1/2; it does not silently masquerade as a successful writer call. Attempt 3 can still publish only if the deterministic result passes.

A worker takes one due job with `FOR UPDATE SKIP LOCKED`, creates the attempt audit before generation, and gets a 10-minute lease with a unique token. Every finish checks token, status, deadline, payment eligibility and report expiry. A crashed attempt is audited and consumes its attempt; after three crashes it becomes attention. Old workers cannot overwrite a newer result. Snapshot, completion state and attempt finish commit atomically.

Repeated or concurrent callbacks reuse the existing report. Page refresh only reads state. Completed callbacks never call the provider again. Admin retry changes the same job to QUEUED with a new run number, preserving old attempts and reportId.

## Publication and customer view

The gate validates the exact object being saved, and the result is checked again on read. Comprehensive requirements include all four distinct pillar columns with stems/branches, hidden stems, ten-god data and twelve life stages; all five element counts; valid MBTI; populated deterministic evidence and feature dictionary; at least three feature interpretations; all ten longform IDs; existing chapter/content rules; at least 6,000 longform characters; repetition and internal-marker checks. No missing content is filled with invented pillars.

Unknown birth time is rejected **before payment** for the comprehensive product. Other product inputs retain their own handlers and validators. Quick interpretations use persisted individual copy. Processing pages refresh without enqueuing work. Invalid completed snapshots are quarantined and can enter admin retry. Customers receive a generic waiting message, never raw model/validator errors.

## Retention

Report expiry is DB creation time + 90 days. Input expiry is extended to that same paid-report window during payment commit. Reads refuse expired reports immediately, independently of cleanup timing. The scheduled worker clears expired report JSON, deletes expired input rows, and clears validation error details. Payment/order records and minimal operational metadata remain. This migration intentionally does not guess a financial/dispute deletion period; the approved business retention policy must govern a separate deletion process.

## Operations and launch blockers

- Apply migration 0013 to the intended Supabase project after the active 0001–0012 migration sequence. No remote migration was applied in this task. The repository also contains legacy `001_init.sql`, which defines an incompatible `reports` schema; do not blindly apply both sequences. Inspect the deployed schema/history first. The local integration test covers the active four-digit migration sequence 0001–0013.
- Configure server-only `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `REPORT_ADMIN_SECRET`, and the existing writer/Toss configuration. Keep `PAID_REPORT_RELIABILITY_ENABLED` unset until readiness is verified.
- Deploy `/api/internal/report-jobs` with the every-minute schedule in `vercel.json`; confirm that the hosting plan supports this frequency and the 300-second function budget. The worker processes one job per invocation; monitor queue age and tune execution capacity before scaling sales.
- The worker uses a bearer `CRON_SECRET`. `GET /api/internal/report-retry` lists up to 100 attention jobs; authenticated `POST` with `{ "reportId": "..." }` queues an admin retry. A full admin UI is outside this task.
- Verify Supabase permissions, scheduler execution, timeout recovery, and provider reconciliation in staging using test credentials. Local PostgreSQL tests cannot prove deployed scheduler or provider behavior. No actual OpenAI or Toss calls were made.
- Legacy paid memory records cannot survive a server restart; no migration can recover already-lost memory. Existing legacy durable reports require explicit audit/migration; revoked legacy RPCs intentionally stop unvalidated publication.
- Confirm the separate financial/dispute retention policy and operational alerting/response ownership. This implementation provides the attention queue; it does not configure an external alert destination.
- There is no refund automation or verified Toss webhook in this scope. Existing webhook remains disabled. Refund/dispute reconciliation needs its operational policy and integration before unrestricted sales.

## Validation

`tests/unit/payment/paidReportReliability.test.ts` runs the real migration/RPC on local PGlite PostgreSQL with mock payment and writer. It covers all ten requested scenarios plus concurrent workers, stale leases, payment recovery, read quarantine, atomic rollback, anonymous permission denial, completed HTML, repetition/marker rejection, actual deterministic fallback, and three crashed workers. The Vitest network guard rejects all unstubbed fetch calls.

No commits, pushes, deployment, remote DB changes, or live sales activation are part of this change.

## Files changed for this task

Existing unrelated brand/legal/failure-page working changes were preserved and are excluded below. The success page had existing work; its header/layout changes were retained while replacing fulfillment.

```text
docs/paid-report-reliability-architecture-01.md
package.json
pnpm-lock.yaml
src/app/api/internal/report-jobs/route.ts
src/app/api/internal/report-retry/route.ts
src/app/api/payment-checkout/prepare/route.ts
src/app/api/payments/toss/confirm/route.ts
src/app/api/reports/create/route.ts
src/app/api/reports/mock-paid-complete/route.ts
src/app/dev/comprehensive-preview/page.tsx
src/app/payments/toss/success/page.tsx
src/app/reports/[reportId]/ComprehensiveReportV2View.tsx
src/app/reports/[reportId]/page.tsx
src/components/report/ReportGenerationStatus.tsx
src/lib/payment/paidProductReportFulfillment.ts
src/lib/payment/paidReportReliability.ts
src/lib/payment/paidReportReliabilityStore.ts
src/lib/payment/paymentOrderRuntime.ts
src/lib/payment/tossConfirmClient.ts
src/lib/report-generation/comprehensiveReportDraftSchema.ts
src/lib/report-generation/comprehensiveV2GenerationHandler.ts
src/lib/report-generation/generateProductReport.ts
src/lib/report-generation/openaiComprehensiveReportWriter.ts
src/lib/report-generation/openaiReportWriterClient.ts
src/lib/report-generation/openaiReportWriterPrompt.ts
src/lib/report-generation/productGenerationDispatcher.ts
src/lib/report-generation/productPreviewSnapshot.ts
src/lib/report-generation/productPublishGate.ts
supabase/migrations/0013_paid_report_reliability.sql
tests/networkGuard.ts
tests/unit/api/createReportRoute.test.ts
tests/unit/api/paymentCheckoutPrepareRoute.test.ts
tests/unit/api/tossConfirmRoute.test.ts
tests/unit/app/api/reports/createRouteSource.test.ts
tests/unit/app/dev/comprehensiveReportPreviewPageSource.test.ts
tests/unit/app/reports/comprehensiveReportV2ViewSource.test.ts
tests/unit/app/tossPaymentSuccessPage.test.tsx
tests/unit/app/tossPaymentSuccessPageSource.test.ts
tests/unit/app/tossPgReviewCheckoutPathSource.test.ts
tests/unit/payment/paidReportReliability.test.ts
tests/unit/report-generation/comprehensiveReportDraftSchema.test.ts
vercel.json
vitest.config.ts
```

## Final local verification

- Required reliability scenarios: 10/10 PASS; expanded reliability suite: 22/22 PASS.
- `pnpm test`: 321 files, 2,359 tests PASS, with unstubbed fetch blocked.
- `pnpm lint`: PASS.
- `pnpm build`: PASS, including Next.js TypeScript checking and page build. Google Fonts downloads required a network-enabled rerun; no OpenAI/Toss calls were used.
- `git diff --check`: PASS.
- No operational environment flags were changed. No commit/push was made.
