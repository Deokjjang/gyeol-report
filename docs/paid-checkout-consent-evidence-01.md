# Checkout consent evidence

This implements the existing product/UI contract, not new legal terms or a claim
of legally sufficient identity/guardian verification. No additional checkbox or
identity information is collected. All provider/production checks used mocks or
local PGlite; production SQL and deployment are separate operations.

## Before: browser-only confirmations

`DevTossCheckoutLauncher` enforced the following state. Previously **none** was
sent to `/api/payment-checkout/prepare`; direct POST could create an order without
these checks. The table records the existing meaning and the new assertion mapping.

| Existing UI state | Meaning | Required to enable checkout | Server assertion |
|---|---|---|---|
| inputAccuracy | Input accuracy and generation from submitted input | Always | inputAccuracy |
| digitalReportStart | Digital report generation starts after payment | Always | digitalReportStart |
| refundRestriction | Refund restrictions and the displayed exceptions acknowledged | Always | refundRestriction |
| policyAgreement | Terms, privacy and refund policy read and agreed together | Always | termsAccepted + privacyAccepted + refundAccepted |
| age14OrOlder | User confirms age 14+ | Always | age14OrOlder |
| minorLegalRepresentative | Guardian requirement and cancellation notice acknowledged | Age 14–18 | minorLegalRepresentative |

The three policy assertions come from **one existing grouped checkbox**; they are
not evidence of three independent clicks. The minor checkbox acknowledges the
existing notice, not proof of guardian identity or a separately verified consent.
Checkbox labels, service/refund notices, policy links and payment amount are unchanged.

## Canonical contract and policy revisions

`src/lib/payment/checkoutConsent.ts` shares the age rule, assertion mapping and
server evidence validation. `src/lib/legal/policyVersions.ts` identifies the current
canonical policy text:

- Terms: `2026-06-14.1`, matching the existing displayed effective date.
- Privacy: `2026-09-22.1`.
- Refund: `2026-09-22.1`.

Privacy/refund currently have no displayed effective date. Their identifiers mark
this evidence version, not a newly asserted effective date. Policy wording remains
in termsPolicy.ts / privacyPolicy.ts / refundPolicy.ts. Future text revisions must
bump the relevant identifier in this single version module and remain recoverable
through Git history. Existing business/legal text, registration number
`2026-인천연수구-2118` and phone `050-6664-8562` were not changed.

## Server trust boundary

The client sends `consent.policyVersions` and `consent.assertions` separately from
report input. Before creating an order, prepare requires each mandatory assertion
to be literal boolean true, matches all current policy versions, and checks age.
Truthy strings/numbers/objects, missing consent, old/future versions and missing
minor acknowledgement cannot write an order or input snapshot. Unknown assertion
keys are rejected. Extra top-level consent metadata is ignored and never copied.

Age uses the already-existing completed-birthday rule with Asia/Seoul date parts
from the existing date utility. The frontend and backend now share it; the old
UI used UTC dates. Below 14 is rejected even with a true checkbox. Ages 14–18 require
the minor assertion; adults do not. No new leap-birthday convention is introduced.
Invalid calendar dates/future birth dates cannot pass.

The authoritative DOB is normalized `person.birthDate`, or `personA.birthDate` for
compatibility, matching the existing checkout UI. A forged adult DOB in the outer
input snapshot cannot override it. Person B is not treated as the purchaser; a
parent/child report with an adult person A is still supported. This is input
consistency enforcement, not verification that the purchaser supplied their true DOB.

Prepare uses the existing single server `acceptedAt` clock also used by annual
purchase acceptance. It discards supplied `inputSnapshot.consentEvidence` and builds:

```text
consentEvidence:
  version: checkout-consent-v1
  acceptedAt: server ISO timestamp
  policyVersions: terms / privacy / refund
  ageBand: adult | minor
  assertions: validated booleans only
```

Client timestamps, policy evidence objects, IP, user agent, fingerprints and new
identity fields are not part of this evidence. Invalid consent returns only the
existing generic request error and “필수 항목을 확인해 주세요.”; internal mismatch
details are not exposed. The launcher displays that allowlisted message rather
than arbitrary server text. Checkout/Toss response contracts otherwise stay unchanged.

## Durable storage and preservation

No columns/tables are added. The new cumulative RPC patch stores only the minimal
consent evidence in `payment_orders.input_snapshot.consentEvidence`. It removes that
field from `report_input_snapshots.payload_json`, avoiding duplicate storage. The
two rows are atomically linked by order_id; service-only `find_order` returns their
joined input view. Only consent is merged from the financial JSON; legacy raw
input is never resurrected after input expiry. Existing annual acceptance remains
in the input snapshot.

This keeps contract evidence separate from report input's 90-day deletion. The
existing financial-record retention behavior is unchanged; no new legal retention
duration is invented. Existing legacy/test orders without evidence remain without
evidence, and the patch does not backfill them. Low-level service-only create_order
remains compatible with those internal fixtures; all new public checkout requests
must pass server consent validation.

Callback, payment recovery, generation/retry and admin retry do not create/update
consent. Policy upgrades affect only new checkouts. The existing prepare API creates
new random order/provider IDs per request; it is not a deduplication endpoint.
Duplicate inserts for the same identity fail atomically and cannot overwrite the
first snapshot. A second legitimate prepare creates a separate order/evidence.

Generation claims carry `reportInputPayload`, not the order's consent evidence.
Completed snapshots and their shared rendering receive no new consent metadata.
The safe prepare response also does not expose it. Operators can inspect only
`payment_order_id` plus the consent field using the example read-only query in the
verify script. No Admin UI is added.

## Later manual application

Prerequisite chain, in order:

1. `scripts/paid_report_quarantine_recovery_patch.sql`
2. `scripts/paid_payment_confirm_recovery_queue_patch.sql`
3. `scripts/paid_report_publish_expiry_patch.sql`
4. `scripts/paid_report_external_call_guard_patch.sql`
5. `scripts/paid_checkout_consent_evidence_patch.sql`
6. `scripts/paid_checkout_consent_evidence_verify.sql` — summary failed=0
7. Separately authorized application deployment.

Already-applied prerequisites need not be replayed. No db push, history repair,
production execution, backfill or deployment was performed. The patch changes only
create_order's two JSON destinations and find_order's merged view; the rest of the
cumulative reliability function stays identical, including grants and retry/expiry.

Deploy the patch before the app: an old RPC stores the whole input snapshot and
would leave consent under the input's 90-day retention instead of the financial row.

## Verification scope

Behavioral tests cover all six products, all required flags, policy versions,
literal booleans, server timestamp, Seoul 14/19 birthday boundaries, person-A age,
guardian acknowledgement, input DOB spoofing, zero writes for invalid requests,
SQL persistence, callback/recovery/retry/admin preservation, policy-v2 simulation,
duplicate identity, legacy absence, patch reapply, input expiry and safe report output.
Existing amount, Dayun, annual rollover and legal regressions remain in the full suite.

Local results: `pnpm test` passed 343 files / 2,988 tests; `pnpm lint`, `pnpm build`
and `git diff --check` passed. The final shared mock-runtime type annotation was
also verified with the component suite. `tsc --noEmit` remains nonzero on existing
repository diagnostics: baseline 394 -> 388, six existing checkout mock errors
resolved, zero new diagnostics, zero production `src/` diagnostics. No real
OpenAI/Toss calls, production DB writes or deployments occurred.
