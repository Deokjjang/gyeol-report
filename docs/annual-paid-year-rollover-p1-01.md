# Annual paid year rollover

## Contract and source of time

New checkout keeps the Seoul commerce policy: five past years plus the current year, six total. The prepare route captures one server `Date` before input validation. That same instant validates the annual input, sets the application's order draft timestamp, and creates `annualCommerceAcceptance`. Database `created_at` remains database-generated; it may be slightly later than acceptance. `paid_at`, job creation, retry time and admin retry time are not new purchase-policy timestamps.

The immutable JSON stored by the existing `create_order` RPC is:

```text
report_input_snapshots.payload_json
  reportInputPayload: existing customer input
  annualCommerceAcceptance:
    version: annual-commerce-v1
    acceptedAt: server ISO timestamp
    selectedYear: validated integer
```

`payment_orders.input_snapshot` remains the existing empty placeholder in the reliability RPC. `find_order` reads the durable `report_input_snapshots` JSON. No schema, RPC, SQL patch, retention or backfill change is required.

## Trust boundary and generation

Prepare discards client-supplied `annualCommerceAcceptance` and creates its own only after successful normalization. Nested metadata in the customer's report payload is never used as authorization. The six-year window is derived from the existing canonical policy, not from client `fromYear`, `toYear` or `acceptedCurrentYear` values.

For annual jobs only, the paid worker makes one additional `find_order` read and verifies PAID status, order/product/report linkage, version, ISO timestamp, and selected-year agreement between the acceptance context, durable input and claimed job payload. It supplies the context as a separate internal generator argument. Context shape validation alone is not authentication; only the worker's privileged durable read establishes provenance.

The generator uses the accepted date for both input normalization and annual handler/evidence policy. It does not rewrite the target year: 2021 still selects 2021's customer Dayun and annual evidence. Normal writer, writer regeneration and deterministic fallback share this path. Public/dev direct generation without this internal argument still uses runtime commerce policy. December domain `new_year_preview` remains separate and does not enlarge the purchase window.

Callbacks, automatic retries and admin retries never rewrite the stored acceptance. The existing input/report expiry and job lease remain authoritative. A missing, malformed or mismatching paid context fails before generator/writer invocation with `ANNUAL_PURCHASE_CONTEXT_INVALID` in the job audit. The existing three-attempt policy leads to `FAILED_REQUIRES_ATTENTION`; PAID and input are retained. Admin retry alone cannot repair missing context, and this change never invents legacy acceptance or asks the customer to repay.

## Verification

`tests/unit/payment/annualPurchaseYearPolicy.test.ts` runs real prepare, durable adapter, RPC SQL, worker, dispatcher, fallback and publish gate against local PGlite with mocked provider transport.

- KST 2026-12-31 23:59:59: 2021 allowed, 2020/2027 rejected.
- KST 2027-01-01 00:00:00: 2021 rejected, 2022/2027 allowed.
- Accepted 2021 survives January rollover and February delay, automatic retry and admin retry.
- Writer transport failure followed by successful mock writer output uses the same acceptance.
- Duplicate confirmation preserves the context, single provider invocation and single order/report/job.
- Client forged context cannot authorize an old year; missing/corrupt context and target-year tampering reach attention without generation.
- Other five products preserve payloads, catalog price and successful paid generation without annual metadata.

No production deployment or database operation is part of this task. Existing orders without authoritative metadata require separate evidence-based review; no automatic backfill is supplied.
