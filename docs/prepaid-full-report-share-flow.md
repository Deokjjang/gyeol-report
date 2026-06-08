# Prepaid Full Report + Share Link Flow

## Decision

V1 paid flow uses prepayment before personalized full report generation.

The product direction is input first, payment second, and full report generation only after verified payment. The public prepayment surface may explain the product and show static sample content, but it should not generate a personalized full report before payment.

Full report generation happens only after payment success is confirmed.

## Current State

- The current public page uses a free personalized preview with `FREE_PREVIEW` sections and locked `PAID_FULL` sections.
- Payment remains inactive.
- Production Supabase persistence is not live.
- `/api/reports/create` currently creates a report preview response and stores through preview-memory persistence.
- The polished full report content is ready for a low-price MVP quality check, but the product flow still needs payment, storage, and sharing.

## Target User Flow

1. User opens the report purchase page.
2. User reads a static sample, product intro, and section preview.
3. User enters report input.
4. User starts checkout.
5. Payment provider confirms payment.
6. Server generates the full personalized report.
7. Server persists the report and payment state.
8. User lands on the paid report result page.
9. User receives a share link.
10. Shared recipients can open the same paid report from the link.

Before payment, the user may see static sample content and section previews, but not a generated personalized full report.

## State Model

Recommended report lifecycle:

- `PENDING_PAYMENT`: input snapshot or checkout intent exists, but payment is not confirmed.
- `PAID`: payment confirmation is verified, but report generation may not be complete yet.
- `GENERATED`: full report JSON has been generated and persisted.
- `FAILED`: payment or report generation failed.
- `REFUNDED`: payment was refunded or reversed.

Recommended visibility lifecycle:

- `PRIVATE`: only owner/private access path should be considered valid.
- `LINK_SHARED`: share link access is intentionally enabled.
- `DISABLED`: report should not be viewable from owner or shared routes.

## Data Model

Proposed `reports` fields:

- `id`
- `share_token`
- `display_name`
- `input_snapshot`
- `report_json`
- `payment_status`
- `visibility`
- `created_at`
- `paid_at`

`input_snapshot` stores the normalized request values used to generate the report. It should not be encoded into URLs. The persisted `report_json` is the rendered deterministic report output for repeatable viewing.

## API Boundaries

Future API candidates:

- `POST /api/checkout/create`
- `POST /api/payments/toss/confirm`
- `POST /api/payments/toss/webhook`
- `POST /api/reports/generate-paid`
- `GET /api/reports/[shareToken]`

Exact naming can be refined later. The key boundary is that checkout creation, payment confirmation, report generation, and report lookup are separate responsibilities.

## Payment Boundary

Payment code must only move a report or checkout record into a paid state after provider verification. It must not trust client-only status. Payment provider secrets remain server-only and must not be placed in URL parameters or client bundles.

Payment confirmation should be idempotent by provider payment ID and internal checkout/order ID.

## Report Generation Boundary

Full report generation happens after paid state is confirmed. Report generation reads the persisted input snapshot, calls the existing deterministic report pipeline, and writes the full `report_json`.

No personalized free report generation before payment is part of the final paid flow. A static sample can be built from fixed demo content and does not need to create a user-specific report.

## Share Link Policy

A paid report can be shared by link.

Anyone with the share link can view the same paid report.

Recommended public link shape:

`/r/[shareToken]`

Reason:

- `reportId` can stay internal.
- `shareToken` can be random and unguessable.
- `shareToken` can be rotated or revoked later.
- It separates owner/private access from public shared access.

The read API may be shaped as `GET /api/reports/[shareToken]` even if the page route is `/r/[shareToken]`.

## Security and Abuse Notes

- Do not expose payment secrets.
- Do not put personal birth data in URL.
- Share token should be random and unguessable.
- Report page should not expose raw internal traces.
- Refund/disabled reports should not remain publicly visible if policy requires hiding.
- `DISABLED` visibility should take precedence over `LINK_SHARED`.
- Shared report pages should avoid exposing internal payment IDs, provider payloads, server logs, or calculation traces.
- Link sharing is allowed intentionally, so the product should treat the share URL as bearer access to the rendered report.

## Migration Plan

1. Keep the current preview product flow until the paid path is built.
2. Add production report storage with payment and visibility state.
3. Add read-only shared result route.
4. Change public copy from generated free preview to static sample and prepayment-first purchase.
5. Add Toss sandbox checkout and confirmation.
6. Generate full report only after confirmed payment.
7. Return or display `/r/[shareToken]` after generation.

## Non-Goals

- No AI/LLM integration in this design.
- No payment implementation in this task.
- No Supabase implementation in this task.
- No current UI removal in this task.
- No checkout implementation in this task.
- No migration SQL in this task.
- No change to existing report calculation in this task.

## Open Questions

- Should owner-private access use `/report/[reportId]`, account-bound access, or only the share route in V1?
- Should share links default to `LINK_SHARED` immediately after generation or require an explicit user action?
- What is the retention policy for `input_snapshot` after refund or deletion requests?
- Should refunded reports become `DISABLED` immediately, or remain visible with a receipt policy?
- Should `/r/[shareToken]` include a lightweight upsell for the recipient to buy their own report?

## Implementation Task Order

1. SUPABASE-01 create real report storage.
2. RESULT-SHARE-01 read-only share route.
3. PRODUCT-FLOW-02 adapt UI to prepayment-first copy.
4. PAYMENT-01 Toss test checkout.
5. PAYMENT-02 payment success triggers report generation.
6. QA-PAYMENT-01 end-to-end paid report test.
