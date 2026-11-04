import { createCheckoutConsentEvidence } from "../../../../lib/payment/checkoutConsent";
import { createAnnualCommerceAcceptance } from "../../../../lib/payment/annualPurchasePolicy";
import { normalizeReportInputPayload } from "../../../../lib/report-generation/reportInputAdapter";
import { birthTimeUncertaintyNotice } from "../../../../lib/saju/birthTimeUncertaintyNotice";
import { randomUUID } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { accountPublicEnabled } from "../../../../lib/account/gate";
import { isPublicSameOrigin } from "../../../../lib/account/origin";
import { bookExperiencePublicEnabled } from "../../../../lib/book/publicGate";
import { productOnSale, SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE } from "../../../../lib/ops/config";

import type { PaymentCheckoutSessionDraft } from "../../../../lib/payment/paymentCheckoutSessionTypes";
import { preparePaymentCheckoutSession } from "../../../../lib/payment/paymentCheckoutSessionBoundary";
import { createPaymentOrderDraft } from "../../../../lib/payment/paymentOrderBoundary";
import type { PaymentOrderRecord } from "../../../../lib/payment/paymentOrderPersistenceTypes";
import { createPaymentOrderPersistenceRuntime } from "../../../../lib/payment/paymentOrderRuntime";
import type { TossCheckoutRequestDraft } from "../../../../lib/payment/tossCheckoutRequestTypes";
import { prepareTossCheckoutRequest } from "../../../../lib/payment/tossCheckoutRequestAdapter";

type ReadyPaymentOrderView = {
  readonly paymentOrderId: PaymentOrderRecord["paymentOrderId"];
  readonly productType: PaymentOrderRecord["productType"];
  readonly provider: PaymentOrderRecord["provider"];
  readonly amount: PaymentOrderRecord["amount"];
  readonly currency: PaymentOrderRecord["currency"];
  readonly status: "ready";
  readonly providerOrderId: PaymentOrderRecord["providerOrderId"];
  readonly createdAt: PaymentOrderRecord["createdAt"];
  readonly updatedAt: PaymentOrderRecord["updatedAt"];
};

type CheckoutPrepareRouteErrorCode =
  | "PAYMENT_CHECKOUT_INVALID_REQUEST"
  | "PAYMENT_CHECKOUT_UNAVAILABLE"
  | typeof SALES_CLOSED_CODE
  | "PROFILE_REQUIRED"
  | "BUYER_INFO_INVALID";

const tossClientKeyEnv = "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY";
const tossSecretKeyEnv = "TOSS_PAYMENTS_SECRET_KEY";
const tossConfirmApiEnabledEnv = "TOSS_CONFIRM_API_ENABLED";
const tossAllowLocalhostRedirectsEnv = "TOSS_ALLOW_LOCALHOST_REDIRECTS";
const defaultProductType = "saju_mbti_full";
const invalidRequestMessage = "결제 요청 정보가 올바르지 않습니다.";
const createFailedMessage =
  "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const tossCheckoutConfigMissingMessage =
  "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const jsonResponseHeaders = {
  "content-type": "application/json; charset=utf-8",
} as const;

function createErrorResponse(
  code: CheckoutPrepareRouteErrorCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: jsonResponseHeaders,
    },
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isClientInputError(code: string): boolean {
  return (
    code === "PAYMENT_PRODUCT_UNSUPPORTED" ||
    code === "PAYMENT_PRODUCT_NOT_PURCHASABLE" ||
    code === "PAYMENT_ORDER_INVALID_PROVIDER" ||
    code === "PAYMENT_ORDER_INVALID_INPUT"
  );
}

function isProductionCheckoutAvailable(provider?: unknown): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const infrastructureReady =
    process.env.PAID_REPORT_RELIABILITY_ENABLED === "1" &&
    isNonEmptyString(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    isNonEmptyString(process.env.CRON_SECRET) &&
    isNonEmptyString(process.env.REPORT_ADMIN_SECRET);
  const providerReady =
    provider !== "toss" || process.env[tossConfirmApiEnabledEnv] === "1";

  return infrastructureReady && providerReady;
}

function createProviderOrderId(): string {
  return `provider_order_${randomUUID()}`;
}

function mapRecordToReadyOrderView(record: PaymentOrderRecord): ReadyPaymentOrderView {
  return {
    paymentOrderId: record.paymentOrderId,
    productType: record.productType,
    provider: record.provider,
    amount: record.amount,
    currency: record.currency,
    status: "ready",
    providerOrderId: record.providerOrderId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function createReadyPaymentOrderRecord(input: {
  readonly productType: unknown;
  readonly provider: unknown;
  readonly inputSnapshot: unknown;
  readonly providerOrderId: string;
  readonly acceptedAt: Date;
}):
  | {
      readonly ok: true;
      readonly record: PaymentOrderRecord;
    }
  | {
      readonly ok: false;
      readonly code: string;
    } {
  const draftResult = createPaymentOrderDraft({
    productType: input.productType,
    provider: input.provider,
    inputSnapshot: input.inputSnapshot,
    nowIso: input.acceptedAt.toISOString(),
  });

  if (!draftResult.ok) {
    return {
      ok: false,
      code: draftResult.error.code,
    };
  }

  const createdAt = draftResult.order.createdAt;

  return {
    ok: true,
    record: {
      ...draftResult.order,
      providerPaymentId: null,
      providerOrderId: input.providerOrderId,
      reportId: null,
      reportGenerationStatus: "not_started",
      updatedAt: createdAt,
      requestedAt: createdAt,
      paidAt: null,
      failedAt: null,
      canceledAt: null,
      refundedAt: null,
      deletedAt: null,
    },
  };
}

function mapReadyOrderForResponse(order: ReadyPaymentOrderView): ReadyPaymentOrderView {
  return {
    paymentOrderId: order.paymentOrderId,
    productType: order.productType,
    provider: order.provider,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    providerOrderId: order.providerOrderId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function mapProviderPayloadForResponse(
  payload: PaymentCheckoutSessionDraft["providerPayload"],
): PaymentCheckoutSessionDraft["providerPayload"] {
  if (payload.provider === "toss") {
    return {
      provider: payload.provider,
      orderId: payload.orderId,
      orderName: payload.orderName,
      amount: payload.amount,
      currency: payload.currency,
      customerNameLabel: payload.customerNameLabel,
    };
  }

  return {
    provider: payload.provider,
    partnerOrderId: payload.partnerOrderId,
    itemName: payload.itemName,
    quantity: payload.quantity,
    totalAmount: payload.totalAmount,
    currency: payload.currency,
  };
}

function mapCheckoutSessionForResponse(
  session: PaymentCheckoutSessionDraft,
): PaymentCheckoutSessionDraft {
  return {
    paymentOrderId: session.paymentOrderId,
    providerOrderId: session.providerOrderId,
    productType: session.productType,
    productLabelKo: session.productLabelKo,
    provider: session.provider,
    amount: session.amount,
    currency: session.currency,
    status: session.status,
    checkoutMode: session.checkoutMode,
    providerPayload: mapProviderPayloadForResponse(session.providerPayload),
  };
}

function createSuccessBody(
  order: ReadyPaymentOrderView,
  session: PaymentCheckoutSessionDraft,
  tossCheckoutRequest?: TossCheckoutRequestDraft,
): {
  readonly ok: true;
  readonly paymentOrder: ReadyPaymentOrderView;
  readonly checkoutSession: PaymentCheckoutSessionDraft;
  readonly tossCheckoutRequest?: TossCheckoutRequestDraft;
} {
  const body: {
    readonly ok: true;
    readonly paymentOrder: ReadyPaymentOrderView;
    readonly checkoutSession: PaymentCheckoutSessionDraft;
  } = {
    ok: true,
    paymentOrder: mapReadyOrderForResponse(order),
    checkoutSession: mapCheckoutSessionForResponse(session),
  };

  if (tossCheckoutRequest === undefined) {
    return body;
  }

  return {
    ...body,
    tossCheckoutRequest,
  };
}

function createOptionalTossCheckoutRequest(
  session: PaymentCheckoutSessionDraft,
  requestUrl: string,
):
  | {
      readonly ok: true;
      readonly draft?: TossCheckoutRequestDraft;
    }
  | {
      readonly ok: false;
      readonly response: NextResponse;
    } {
  if (session.provider !== "toss") {
    return { ok: true };
  }

  const clientKey = process.env[tossClientKeyEnv];
  const secretKey = process.env[tossSecretKeyEnv];
  const requestOrigin = new URL(requestUrl).origin;
  const successUrl = new URL("/payments/toss/success", requestOrigin).toString();
  const failUrl = new URL("/payments/toss/fail", requestOrigin).toString();
  const requestHostname = new URL(requestOrigin).hostname;
  const isLocalhostRedirect =
    requestHostname === "localhost" || requestHostname === "127.0.0.1";

  if (
    !isNonEmptyString(clientKey) ||
    !isNonEmptyString(secretKey)
  ) {
    return {
      ok: false,
      response: createErrorResponse(
        "PAYMENT_CHECKOUT_UNAVAILABLE",
        tossCheckoutConfigMissingMessage,
        500,
      ),
    };
  }

  const tossResult = prepareTossCheckoutRequest({
    checkoutSession: session,
    clientKey,
    successUrl,
    failUrl,
    allowLocalhostRedirects:
      isLocalhostRedirect || process.env[tossAllowLocalhostRedirectsEnv] === "1",
  });

  if (!tossResult.ok) {
    return {
      ok: false,
      response: createErrorResponse(
        "PAYMENT_CHECKOUT_UNAVAILABLE",
        tossCheckoutConfigMissingMessage,
        500,
      ),
    };
  }

  return {
    ok: true,
    draft: tossResult.draft,
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  if (accountPublicEnabled() && !isPublicSameOrigin(request)) return new NextResponse(null, { status: 403 });
  if (!isProductionCheckoutAvailable()) {
    return createErrorResponse("PAYMENT_CHECKOUT_UNAVAILABLE", "현재 결제를 준비 중입니다. 잠시 후 다시 확인해 주세요.", 503);
  }
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (typeof json.provider !== "string") {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isProductionCheckoutAvailable(json.provider)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      "현재 결제를 준비 중입니다. 잠시 후 다시 확인해 주세요.",
      503,
    );
  }

  // P6d-ops 1: 판매를 닫은 상품(대운·세운)은 결제를 시작하지 않는다(FORTUNE_SALES_OPEN=1이면 다시 연다).
  if (!productOnSale(json.productType ?? defaultProductType)) {
    return createErrorResponse(SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, 409);
  }

  if (!isJsonObject(json.inputSnapshot)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  // P6d-ops 2·3: 구매자. 회원은 가입 정보가 있어야 하고(없으면 정보 화면), 비회원은 결제 화면 입력값.
  const opsModule = await import("../../../../lib/ops/store");
  const ops = opsModule.createOpsStores();
  let buyer: import("../../../../lib/ops/orders/buyer").Buyer;
  {
    const { resolveBuyer, accountPortFor } = await import("../../../../lib/ops/orders/buyer");
    const { createAccountPort } = await import("../../../../lib/account/supabase");
    const resolved = await resolveBuyer(request, json.buyer, { port: accountPublicEnabled() ? accountPortFor(request, createAccountPort) : null, account: ops.account });
    if (!resolved.ok) return createErrorResponse(resolved.code as CheckoutPrepareRouteErrorCode, resolved.message, resolved.status);
    buyer = resolved.buyer;
  }

  // One server clock for validation and durable acceptance, even across midnight.
  const acceptedAt = new Date();
  const inputSnapshot = { ...json.inputSnapshot };
  delete inputSnapshot.annualCommerceAcceptance;
  delete inputSnapshot.consentEvidence;
  // Fulfillment version is server-owned, frozen with the purchase, and cannot
  // be selected by a query, cookie or caller-provided snapshot field.
  delete inputSnapshot.bookGeneration;
  if (bookExperiencePublicEnabled()) inputSnapshot.bookGeneration = { version: "v4", evaluatedAt: acceptedAt.toISOString() };
  // Production must reject unfulfillable inputs before any payment is launched.
  {
    const normalized = normalizeReportInputPayload(inputSnapshot.reportInputPayload, { now: () => acceptedAt });
    if (!normalized.ok || normalized.value.productKey !== (json.productType ?? defaultProductType)) {
      const message = !normalized.ok && normalized.birthTimeContext
        ? birthTimeUncertaintyNotice(normalized.birthTimeContext)?.message ?? "출생시간 범위에 따라 원국이 달라집니다. 시간을 더 구체적으로 확인해 주세요."
        : "출생시간을 포함한 리포트 입력 정보를 확인해 주세요.";
      return createErrorResponse("PAYMENT_CHECKOUT_INVALID_REQUEST", message, 400);
    }
    // Age follows the existing UI's purchaser basis: person / compatibility person A.
    const birthDate = normalized.value.kind === "compatibility" ? normalized.value.personA.birthDate : normalized.value.person.birthDate;
    const consentEvidence = createCheckoutConsentEvidence(json.consent, birthDate, acceptedAt);
    if (!consentEvidence) return createErrorResponse("PAYMENT_CHECKOUT_INVALID_REQUEST", "필수 항목을 확인해 주세요.", 400);
    inputSnapshot.consentEvidence = consentEvidence;
    if (normalized.value.kind === "annualFortune") {
      inputSnapshot.annualCommerceAcceptance = createAnnualCommerceAcceptance(
        Number(normalized.value.productOptions.selectedYear), acceptedAt,
      );
    }
  }

  const readyOrderRecordResult = createReadyPaymentOrderRecord({
    productType: json.productType ?? defaultProductType,
    provider: json.provider,
    inputSnapshot,
    acceptedAt,
    providerOrderId: createProviderOrderId(),
  });

  if (!readyOrderRecordResult.ok) {
    const isInvalidRequest = isClientInputError(readyOrderRecordResult.code);

    return createErrorResponse(
      isInvalidRequest
        ? "PAYMENT_CHECKOUT_INVALID_REQUEST"
        : "PAYMENT_CHECKOUT_UNAVAILABLE",
      isInvalidRequest ? invalidRequestMessage : createFailedMessage,
      isInvalidRequest ? 400 : 500,
    );
  }

  const orderRuntime = createPaymentOrderPersistenceRuntime();
  const createOrderResult = await orderRuntime.create(
    readyOrderRecordResult.record,
  );

  if (!createOrderResult.ok) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      createFailedMessage,
      500,
    );
  }

  const readyOrder = mapRecordToReadyOrderView(createOrderResult.value);
  const checkoutResult = preparePaymentCheckoutSession(readyOrder);

  if (!checkoutResult.ok) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      createFailedMessage,
      500,
    );
  }

  const tossCheckoutRequestResult = createOptionalTossCheckoutRequest(
    checkoutResult.session,
    request.url,
  );

  if (!tossCheckoutRequestResult.ok) {
    return tossCheckoutRequestResult.response;
  }

  // P6d-ops 3: 주문 기록(계정·구매자·결제 전 고지 버전)과 짧은 주문코드. 토스 요청에 구매자·주문코드를 싣는다.
  const { CHECKOUT_NOTICE_VERSION } = await import("../../../../lib/ops/orders/buyer");
  const attached = await ops.order.call("attach", { paymentOrderId: readyOrder.paymentOrderId, userId: buyer.userId, name: buyer.name, email: buyer.email, phone: buyer.phone, noticeVersion: CHECKOUT_NOTICE_VERSION });
  if (!attached.ok || typeof attached.orderCode !== "string") {
    return createErrorResponse("PAYMENT_CHECKOUT_UNAVAILABLE", createFailedMessage, 503);
  }
  const orderCode = attached.orderCode;
  const draft = tossCheckoutRequestResult.draft ? { ...tossCheckoutRequestResult.draft, requestPayment: { ...tossCheckoutRequestResult.draft.requestPayment,
    orderName: `${tossCheckoutRequestResult.draft.requestPayment.orderName} ${orderCode}`, customerName: buyer.name, customerEmail: buyer.email,
    ...(buyer.phone ? { customerMobilePhone: buyer.phone } : {}) } } : undefined;

  const response = NextResponse.json(
    { ...createSuccessBody(
      readyOrder,
      checkoutResult.session,
      draft,
    ), orderCode },
    {
      status: 200,
      headers: jsonResponseHeaders,
    },
  );
  // Default OFF. No auth/ownership DB calls or checkout behavior changes until
  // separately approved activation + reviewed migration prerequisites.
  if (accountPublicEnabled()) {
    try {
      const { createAccountPort } = await import("../../../../lib/account/supabase");
      const { createLibraryPort } = await import("../../../../lib/library/supabase");
      const { bindCheckout } = await import("../../../../lib/library/server");
      const req = new NextRequest(request.url, { headers: request.headers }), auth = createAccountPort(req);
      const bound = auth ? await bindCheckout(req, response, readyOrder.paymentOrderId, inputSnapshot.reportInputPayload, auth, createLibraryPort()) : null;
      return bound ?? createErrorResponse("PAYMENT_CHECKOUT_UNAVAILABLE", createFailedMessage, 503);
    } catch { return createErrorResponse("PAYMENT_CHECKOUT_UNAVAILABLE", createFailedMessage, 503); }
  }
  return response;
}
