# Payment Provider Integration Runbook

## Purpose

This runbook fixes the operating contract for a future real payment integration before any external provider API is called.

## Current State

Current implementation is mock-only.
Real Toss and KakaoPay APIs are not called yet.
Mock payment API is disabled by default.
Mock payment UI is hidden by default.

The current dev-only mock route is `/api/reports/mock-paid-complete`.
It must stay gated by `MOCK_PAID_REPORT_API_ENABLED=1`.
The current dev-only mock UI must stay gated by `NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED=1`.

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

## Required Environment Variables

Use placeholders only when documenting or configuring environments:

```text
TOSS_CLIENT_KEY=<toss-client-key>
TOSS_SECRET_KEY=<toss-secret-key>
KAKAO_PAY_ADMIN_KEY=<kakao-pay-admin-key>
KAKAO_PAY_CID=<kakao-pay-cid>
PAYMENT_SUCCESS_URL=<success-url>
PAYMENT_FAIL_URL=<fail-url>
PAYMENT_CANCEL_URL=<cancel-url>
PAYMENT_WEBHOOK_SECRET=<webhook-secret>
MOCK_PAID_REPORT_API_ENABLED=1
NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED=1
```

Do not enable mock payment flags in production.
Do not commit payment secrets.
Do not paste payment secrets into chat.

## Provider Callback URLs

Future planned provider callback paths:

- `/api/payments/toss/confirm`
- `/api/payments/kakao-pay/approve`
- `/api/payments/webhook`

These routes are planned and not implemented in this task.

## Payment Creation Flow

The future flow should create one provider payment attempt for one report purchase.
The server creates the payment attempt, stores only non-secret provider references needed for later confirmation, and returns only the provider checkout handoff data required by the browser.

## Payment Approval Flow

The server must verify the provider response through server-side provider confirmation.
Do not trust client-provided payment status.
Do not create paid reports before provider confirmation.

Only a provider-confirmed `paid` result may continue to paid report completion.

## Webhook/Notification Flow

Provider webhook or notification handling must be server-side.
Webhook requests must be verified with provider signatures or the configured `PAYMENT_WEBHOOK_SECRET` before changing payment state.
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

## Paid Report Completion

After provider payment is confirmed as paid:

- issue share token
- store only access token hash
- persist paid report through `persistPaidFullReport`
- return `sharePath`

Do not return raw input snapshots, raw report snapshots, provider secret values, token hashes, or provider payment identifiers in public views.

## Security Rules

Do not trust client-provided payment status.
Do not create paid reports before provider confirmation.
Do not expose provider secret keys to client code.
Do not expose access_token_hash.
Do not expose payment_provider_payment_id in public views.
Do not store plaintext share token.
Use server-side provider confirmation only.

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

No real Toss API call in this task.
No real KakaoPay API call in this task.
No checkout page in this task.
No wallet/recharge/point system.
No package products.
