# Payment Provider Integration Runbook

## Purpose

This runbook freezes the official-provider requirements for Toss and KakaoPay integration while keeping provider confirmation, paid state transition, and paid fulfillment as separate boundaries.

## Current State

Current implementation includes a Toss confirm route that is disabled by default.
The Toss confirm route calls the real Toss confirm API only when explicitly enabled.
Real KakaoPay APIs are not called yet.
Mock payment API is disabled by default.
Mock payment UI is hidden by default.

The current checkout prepare flow is not a real provider checkout.
`POST /api/payment-checkout/prepare` creates a ready payment order and returns a provider draft only.
No real checkout URL exists yet.
No payment order is marked paid by the checkout prepare route.
No paid report or share link is created by the checkout prepare route.
The Toss confirm route does not mark a payment order paid yet.
The Toss confirm route does not create a paid report or share link yet.

## Current Payment Architecture

- One report per one payment.
- A ready payment_order is created before provider checkout.
- `payment_orders.status` starts as `ready`.
- Checkout prepare API currently returns provider draft only.
- No real checkout URL exists yet.
- Paid report is created only after server-side provider confirmation.
- Client must never be trusted to mark payment as paid.

## Payment Model

One report per one payment.
No wallet.
No recharge.
No points.
No credit balance.
No package products in the current scope.

## Supported Providers

The supported future real providers are exactly:

- `toss`
- `kakao_pay`

No other provider or stored-value model is supported in the current scope.

## Toss Requirements

Toss integration must use the official Toss Payments flow.
Client-side checkout starts from a ready payment_order.
Server must confirm or authorize the payment after redirect/callback.

Before changing an order to paid, the server must verify:

- `paymentOrderId` / `providerOrderId`
- amount = 990
- currency = KRW
- productType = `saju_mbti_full`
- provider = `toss`
- order status is `ready` before paid transition

Test and live keys must be separated.
Secret key must stay server-only.
Webhook support should be planned for asynchronous payment state changes.

Required Toss env placeholders:

```text
TOSS_CLIENT_KEY=<toss-client-key>
TOSS_SECRET_KEY=<toss-secret-key>
TOSS_SUCCESS_URL=<toss-success-url>
TOSS_FAIL_URL=<toss-fail-url>
TOSS_WEBHOOK_SECRET=<toss-webhook-secret>
```

Do not expose `TOSS_SECRET_KEY` to client-side code.

## Toss Confirm Route

`POST /api/payments/toss/confirm` is server-only and disabled by default.
It is enabled with `TOSS_CONFIRM_API_ENABLED=1`.
It requires `TOSS_SECRET_KEY`.
It confirms Toss payment using `paymentKey`, `orderId`, and `amount`.
It enforces amount = 990.
It does not mark `payment_order` as paid yet.
It does not create reports or share links yet.

## KakaoPay Requirements

KakaoPay integration must use the official KakaoPay online single-payment API.
KakaoPay app registration is required.
Client ID and Secret key are required.
CID is required after merchant review/approval.
Web domain registration is required.
Single payment flow should be modeled as ready → approve.
Secret key must stay server-only.

Before changing an order to paid, the server must verify:

- `paymentOrderId` / `providerOrderId`
- amount = 990
- currency = KRW
- productType = `saju_mbti_full`
- provider = `kakao_pay`
- order status is `ready` before paid transition

Required KakaoPay env placeholders:

```text
KAKAO_PAY_CLIENT_ID=<kakao-pay-client-id>
KAKAO_PAY_SECRET_KEY=<kakao-pay-secret-key>
KAKAO_PAY_CID=<kakao-pay-cid>
KAKAO_PAY_APPROVAL_URL=<kakao-pay-approval-url>
KAKAO_PAY_CANCEL_URL=<kakao-pay-cancel-url>
KAKAO_PAY_FAIL_URL=<kakao-pay-fail-url>
```

KakaoPay secret values must stay server-only and must not be exposed in browser bundles or responses.

## Required Environment Variables

Use placeholders only when documenting or configuring environments:

```text
TOSS_CLIENT_KEY=<toss-client-key>
TOSS_CONFIRM_API_ENABLED=1
TOSS_SECRET_KEY=<toss-secret-key>
TOSS_SUCCESS_URL=<toss-success-url>
TOSS_FAIL_URL=<toss-fail-url>
TOSS_WEBHOOK_SECRET=<toss-webhook-secret>
KAKAO_PAY_CLIENT_ID=<kakao-pay-client-id>
KAKAO_PAY_SECRET_KEY=<kakao-pay-secret-key>
KAKAO_PAY_CID=<kakao-pay-cid>
KAKAO_PAY_APPROVAL_URL=<kakao-pay-approval-url>
KAKAO_PAY_CANCEL_URL=<kakao-pay-cancel-url>
KAKAO_PAY_FAIL_URL=<kakao-pay-fail-url>
MOCK_PAID_REPORT_API_ENABLED=1
NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED=1
```

Do not enable mock payment flags in production.
Do not commit payment secrets.
Do not paste payment secrets into chat.

## Callback / Approval Route Plan

Future planned route boundaries:

- `/api/payment-checkout/prepare`
- `/api/payments/toss/confirm`
- `/api/payments/kakao-pay/ready`
- `/api/payments/kakao-pay/approve`
- `/api/payments/kakao-pay/cancel`
- `/api/payments/kakao-pay/fail`
- `/api/payments/webhooks/toss`

`/api/payment-checkout/prepare` creates a ready order and provider draft.
Provider-specific routes are added one boundary at a time.
Confirm/approve routes must perform server-side provider verification.
Only after verification can `payment_order` become paid.
Only after paid can paid report/share be created.

## Payment Creation Flow

The future flow should create one provider payment attempt for one report purchase.
The server creates a ready payment_order, stores the server-side `input_snapshot`, and returns only the provider checkout handoff data required by the browser.
Client-supplied amount, currency, status, or payment status must not be trusted.

## Payment Approval Flow

The server must verify the provider response through server-side provider confirmation.
Do not trust client-provided payment status.
Do not create paid reports before provider confirmation.

Only a provider-confirmed `paid` result may continue to paid report completion.

## Webhook/Notification Flow

Provider webhook or notification handling must be server-side.
Webhook requests must be verified with provider signatures or the configured provider webhook secret before changing payment state.
Webhook processing must be idempotent and must not create duplicate paid reports for one payment attempt.

## Payment Status Mapping

Provider-specific statuses must map into these internal statuses:

| Internal status | Meaning |
| --- | --- |
| `ready` | Payment attempt exists but is not completed. |
| `paid` | Provider confirmed successful payment. |
| `failed` | Provider reported a failed payment. |
| `canceled` | User or provider canceled the payment. |
| `refunded` | Provider confirmed refund after payment. |

Only `paid` may create a paid report and share token.

## State Transition Rules

Allowed transitions:

- ready → paid
- ready → failed
- ready → canceled
- paid → refunded

Forbidden transitions:

- client → paid
- failed → paid without new provider verification
- canceled → paid without new provider verification
- refunded → paid

Paid report fulfillment is idempotent.
Same provider payment id must not create multiple paid reports.
Same payment_order_id must not create multiple paid reports.

## Paid Report Completion

After provider payment is confirmed as paid:

- issue share token
- store only access token hash
- persist paid report through `persistPaidFullReport`
- return `sharePath`

Do not return raw input snapshots, raw report snapshots, provider secret values, token hashes, or provider payment identifiers in public views.

## Fulfillment Rules

Paid report creation happens only after provider confirmation.

Fulfillment steps:

1. Load payment_order by `paymentOrderId` / `providerOrderId`.
2. Verify provider result.
3. Verify amount/currency/product/provider.
4. Mark order paid.
5. Generate paid report from stored input_snapshot.
6. Issue share token.
7. Persist paid report.
8. Attach `report_id` to payment_order.
9. Return or redirect to `/r/<shareToken>`.

Never generate paid report directly from client-supplied input after payment confirmation.
Use stored payment_order.input_snapshot.

## Security Rules

- Never trust client payment success claims.
- Never expose provider secret keys.
- Never expose input_snapshot in checkout responses.
- Never expose provider_payment_id unless explicitly needed server-side.
- Never expose access token hashes.
- Never expose Supabase keys in responses.
- Never use service role in client code.
- No wallet/recharge/point/balance concepts.

## Required Future Implementation Order

1. PAYMENT-16B Toss checkout request adapter.
2. PAYMENT-17 Toss confirm route.
3. PAYMENT-18 payment order mark-paid RPC.
4. PAYMENT-19 paid fulfillment from payment_order.
5. PAYMENT-20 KakaoPay ready adapter.
6. PAYMENT-21 KakaoPay approve route.
7. PAYMENT-22 payment webhook handling.
8. PAYMENT-23 production env and Vercel checklist.

## Required Test and Smoke Checklist

- Unit tests prove client amount/currency/status are ignored.
- Unit tests prove provider secrets are never returned.
- Unit tests prove ready orders cannot become paid without provider confirmation.
- Route source tests prove no real provider API is called before the implementation task.
- Smoke tests must run separately for Toss test keys and live keys.
- Smoke tests must run separately for KakaoPay sandbox/test configuration and production configuration.
- Webhook smoke must prove duplicate events are idempotent.

## Production Launch Checklist

- Confirm provider env placeholders are configured with real values only in the deployment environment.
- Confirm mock flags are disabled in production.
- Confirm provider callback URLs are registered with each provider.
- Confirm server-side confirmation maps only provider-confirmed payments to `paid`.
- Confirm `persistPaidFullReport` is called only after provider confirmation.
- Confirm `sharePath` is returned only after paid report storage succeeds.
- Confirm logs do not include provider secrets, plaintext share tokens, token hashes, or raw report body.

## Rollback Plan

Disable real payment routes.
Disable provider env vars.
Keep preview route available.
Keep mock flags disabled in production.

## Non-Goals

No automatic Toss confirm call from the success page in this task.
No real KakaoPay API call in this task.
No checkout page in this task.
No real checkout URL in this task.
No paid state transition in the Toss confirm route yet.
No webhook route implementation in this task.
No wallet/recharge/point system.
No package products.
