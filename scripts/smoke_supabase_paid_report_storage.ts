import { createReportApiEnvelopeFromJson } from "../src/lib/api/createReport";
import { persistPaidFullReport } from "../src/lib/persistence/paidReportStorageBoundary";
import { createReportPersistenceRuntimeFromEnv } from "../src/lib/persistence/reportPersistenceRuntime";
import { buildReportPersistencePayload } from "../src/lib/report/reportPersistencePayload";
import type { ReportRequestRawInput } from "../src/lib/validation/types";

const requiredMode = "supabase";
const defaultMode = "preview_memory";
const smokeCreatedAt = "2026-01-01T00:00:00.000Z";
const paymentPaidAt = "2026-01-01T00:01:00.000Z";
const paymentOrderId = "smoke_order_paid_report_storage";
const paymentProvider = "smoke";
const paymentProviderPaymentId = "smoke_payment_paid_report_storage";
const paymentStatus = "paid" as const;
const paymentAmount = 1290;
const paymentCurrency = "KRW";
const requiredSupabaseEnvNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const;

const smokeInput = {
  displayName: "SUPABASE_PAID_SMOKE",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "FEMALE",
  mbtiType: "ENTJ",
  timezone: "Asia/Seoul",
} as const satisfies ReportRequestRawInput;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function createSmokeError(message: string): Error {
  return new Error(`Supabase paid report storage smoke failed: ${message}`);
}

function hasRequiredSupabaseEnv(): boolean {
  return requiredSupabaseEnvNames.every((name) => {
    const value = process.env[name];

    return typeof value === "string" && value.trim().length > 0;
  });
}

async function run(): Promise<void> {
  const mode = process.env.REPORT_PERSISTENCE_MODE ?? defaultMode;

  if (mode !== requiredMode) {
    throw createSmokeError(
      `set REPORT_PERSISTENCE_MODE to ${requiredMode}; current mode is ${defaultMode} unless explicitly configured.`,
    );
  }

  if (!hasRequiredSupabaseEnv()) {
    throw createSmokeError("set SUPABASE_URL and SUPABASE_ANON_KEY first.");
  }

  writeStatus("start");

  const envelope = createReportApiEnvelopeFromJson(smokeInput);

  if (!envelope.body.ok) {
    throw createSmokeError("report generation did not return ok true.");
  }

  const payloadResult = buildReportPersistencePayload({
    birthDate: smokeInput.birthDate,
    birthTime: smokeInput.birthTime,
    birthTimeUnknown: smokeInput.birthTimeUnknown,
    calendarType: smokeInput.calendarType,
    timezone: smokeInput.timezone,
    gender: smokeInput.gender,
    mbti: smokeInput.mbtiType,
    report: envelope.body.report,
    nowIso: smokeCreatedAt,
  });

  if (!payloadResult.ok) {
    throw createSmokeError(payloadResult.code);
  }

  const runtime = createReportPersistenceRuntimeFromEnv();

  if (!runtime.ok) {
    throw createSmokeError(runtime.code);
  }

  const paidRecord = {
    ...payloadResult.input.record,
    status: "paid_unlocked" as const,
    accessMode: "paid" as const,
    payment: {
      orderId: paymentOrderId,
      provider: paymentProvider,
      providerPaymentId: paymentProviderPaymentId,
      paymentStatus,
      amount: paymentAmount,
      currency: paymentCurrency,
      paidAt: paymentPaidAt,
    },
  };

  const createResult = await persistPaidFullReport({
    adapter: runtime.adapter,
    record: paidRecord,
  });

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created paid report id: ${createResult.record.reportId}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Supabase paid report storage smoke failed."}\n`,
  );
  process.exitCode = 1;
});
