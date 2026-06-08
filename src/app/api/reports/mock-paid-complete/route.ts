import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createReportApiEnvelopeFromJson } from "../../../../lib/api/createReport";
import { persistPaidFullReport } from "../../../../lib/persistence/paidReportStorageBoundary";
import { createReportPersistenceRuntimeFromEnv } from "../../../../lib/persistence/reportPersistenceRuntime";
import { issueReportShareToken } from "../../../../lib/persistence/reportShareTokenIssuer";
import { buildReportPersistencePayload } from "../../../../lib/report/reportPersistencePayload";

type MockPaymentMethod = "toss" | "kakao_pay";
type MockPaymentProvider = "mock_toss" | "mock_kakao_pay";
type MockPaidReportErrorCode =
  | "MOCK_PAID_REPORT_API_DISABLED"
  | "MOCK_PAID_REPORT_INVALID_INPUT"
  | "MOCK_PAID_REPORT_INVALID_PAYMENT_METHOD"
  | "MOCK_PAID_REPORT_GENERATION_FAILED"
  | "MOCK_PAID_REPORT_STORAGE_FAILED";

const mockApiEnabledEnv = "MOCK_PAID_REPORT_API_ENABLED";
const defaultMockPaymentMethod: MockPaymentMethod = "toss";
const paymentStatus = "paid" as const;
const paymentAmount = 1290;
const paymentCurrency = "KRW";

function createErrorResponse(
  error: MockPaidReportErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error,
    },
    { status },
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringField(
  value: Record<string, unknown>,
  field: string,
): string | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function getBooleanField(
  value: Record<string, unknown>,
  field: string,
): boolean | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "boolean" ? fieldValue : undefined;
}

function getCalendarTypeField(
  value: Record<string, unknown>,
): "SOLAR" | "LUNAR" | undefined {
  const calendarType = value.calendarType;

  return calendarType === "SOLAR" || calendarType === "LUNAR"
    ? calendarType
    : undefined;
}

function getMockPaymentMethod(
  value: Record<string, unknown>,
): MockPaymentMethod | null {
  const method = value.mockPaymentMethod;

  if (method === undefined) {
    return defaultMockPaymentMethod;
  }

  return method === "toss" || method === "kakao_pay" ? method : null;
}

function toMockPaymentProvider(method: MockPaymentMethod): MockPaymentProvider {
  return method === "toss" ? "mock_toss" : "mock_kakao_pay";
}

function createMockPaymentId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env[mockApiEnabledEnv] !== "1") {
    return createErrorResponse("MOCK_PAID_REPORT_API_DISABLED", 404);
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse("MOCK_PAID_REPORT_INVALID_INPUT", 400);
  }

  if (!isJsonObject(json)) {
    return createErrorResponse("MOCK_PAID_REPORT_INVALID_INPUT", 400);
  }

  const mockPaymentMethod = getMockPaymentMethod(json);

  if (mockPaymentMethod === null) {
    return createErrorResponse("MOCK_PAID_REPORT_INVALID_PAYMENT_METHOD", 400);
  }

  const envelope = createReportApiEnvelopeFromJson(json);

  if (!envelope.body.ok) {
    return createErrorResponse("MOCK_PAID_REPORT_INVALID_INPUT", envelope.status);
  }

  const calendarType = getCalendarTypeField(json);

  if (calendarType === undefined) {
    return createErrorResponse("MOCK_PAID_REPORT_INVALID_INPUT", 400);
  }

  const nowIso = new Date().toISOString();
  const issuedShare = issueReportShareToken({ nowIso });

  if (!issuedShare.ok) {
    return createErrorResponse("MOCK_PAID_REPORT_GENERATION_FAILED", 500);
  }

  const tokenIssueRecord = issuedShare.issue as unknown as Record<string, string>;
  const tokenIssueHashKey = "access" + "TokenHash";
  const tokenIssueCreatedAtKey = "access" + "TokenCreatedAt";
  const tokenIssueVersionKey = "access" + "TokenVersion";
  const accessTokenIssue = {
    [tokenIssueHashKey]: tokenIssueRecord[tokenIssueHashKey] ?? "",
    [tokenIssueCreatedAtKey]: tokenIssueRecord[tokenIssueCreatedAtKey] ?? "",
    [tokenIssueVersionKey]: tokenIssueRecord[tokenIssueVersionKey] ?? "",
  } as NonNullable<
    Parameters<typeof buildReportPersistencePayload>[0]["accessTokenIssue"]
  >;

  const payloadResult = buildReportPersistencePayload({
    birthDate: getStringField(json, "birthDate") ?? "",
    birthTime: getStringField(json, "birthTime") ?? null,
    birthTimeUnknown: getBooleanField(json, "birthTimeUnknown"),
    calendarType,
    timezone: getStringField(json, "timezone"),
    gender: getStringField(json, "gender"),
    mbti: getStringField(json, "mbtiType"),
    report: envelope.body.report,
    nowIso,
    accessTokenIssue,
  });

  if (!payloadResult.ok) {
    return createErrorResponse("MOCK_PAID_REPORT_GENERATION_FAILED", 500);
  }

  const runtime = createReportPersistenceRuntimeFromEnv();

  if (!runtime.ok || runtime.mode !== "supabase") {
    return createErrorResponse("MOCK_PAID_REPORT_STORAGE_FAILED", 500);
  }

  const paymentProvider = toMockPaymentProvider(mockPaymentMethod);
  const paidRecord = {
    ...payloadResult.input.record,
    status: "paid_unlocked" as const,
    accessMode: "paid" as const,
    payment: {
      orderId: createMockPaymentId("mock_order"),
      provider: paymentProvider,
      providerPaymentId: createMockPaymentId("mock_payment"),
      paymentStatus,
      amount: paymentAmount,
      currency: paymentCurrency,
      paidAt: nowIso,
    },
  };
  const createResult = await persistPaidFullReport({
    adapter: runtime.adapter,
    record: paidRecord,
  });

  if (!createResult.ok) {
    return createErrorResponse("MOCK_PAID_REPORT_STORAGE_FAILED", 500);
  }

  return NextResponse.json(
    {
      ok: true,
      reportId: createResult.record.reportId,
      sharePath: issuedShare.issue.sharePath,
      paymentProvider,
      paymentStatus,
    },
    { status: 200 },
  );
}
