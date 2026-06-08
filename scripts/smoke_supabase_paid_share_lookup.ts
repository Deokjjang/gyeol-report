import { createReportApiEnvelopeFromJson } from "../src/lib/api/createReport";
import {
  findPaidReportByShareToken,
  type PaidReportLookupRecord,
  type PaidReportLookupStore,
} from "../src/lib/persistence/paidReportLookupBoundary";
import { persistPaidFullReport } from "../src/lib/persistence/paidReportStorageBoundary";
import { createReportPersistenceRuntimeFromEnv } from "../src/lib/persistence/reportPersistenceRuntime";
import { issueReportShareToken } from "../src/lib/persistence/reportShareTokenIssuer";
import type { SupabasePaidReportLookupRow } from "../src/lib/persistence/supabaseReportPersistenceClient";
import { createSupabaseReportPersistenceSdkClient } from "../src/lib/persistence/supabaseReportPersistenceSdkClient";
import { buildReportPersistencePayload } from "../src/lib/report/reportPersistencePayload";
import type { ReportRequestRawInput } from "../src/lib/validation/types";

const requiredMode = "supabase";
const defaultMode = "preview_memory";
const smokeCreatedAt = "2026-01-01T00:00:00.000Z";
const paymentPaidAt = "2026-01-01T00:01:00.000Z";
const paymentOrderIdPrefix = "smoke_order_share_lookup";
const paymentProvider = "smoke";
const paymentProviderPaymentIdPrefix = "smoke_payment_share_lookup";
const paymentStatus = "paid" as const;
const paymentAmount = 1290;
const paymentCurrency = "KRW";
type RequiredSupabaseEnvName = "SUPABASE_URL" | "SUPABASE_ANON_KEY";
const smokeFixtureName = "SUPABASE_LOOKUP_SMOKE";
const smokeDisplayName = smokeFixtureName.replace("_SMOKE", "");

const smokeInput = {
  displayName: smokeDisplayName,
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
  return new Error(`Supabase paid share lookup smoke failed: ${message}`);
}

function createSmokeRunId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getRequiredEnvValue(name: RequiredSupabaseEnvName): string {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw createSmokeError(`set ${name} first.`);
  }

  return value;
}

function mapLookupRowToRecord(
  row: SupabasePaidReportLookupRow,
  accessTokenHash: string,
): PaidReportLookupRecord {
  if (
    row.status !== "paid_unlocked" ||
    row.access_mode !== "paid" ||
    row.payment_status !== "paid" ||
    row.report_version === null ||
    row.calculation_version === null ||
    row.locale === null
  ) {
    throw createSmokeError("lookup RPC returned an unavailable report.");
  }

  return {
    reportId: row.report_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    reportVersion: row.report_version,
    calculationVersion: row.calculation_version,
    locale: row.locale,
    accessMode: row.access_mode,
    accessTokenHash,
    reportSnapshot: row.report_snapshot,
    paymentStatus: row.payment_status,
  };
}

function createLookupStore(): PaidReportLookupStore {
  const queryClient = createSupabaseReportPersistenceSdkClient({
    supabaseUrl: getRequiredEnvValue("SUPABASE_URL"),
    supabaseAnonKey: getRequiredEnvValue("SUPABASE_ANON_KEY"),
  });

  return {
    async findByAccessTokenHash(accessTokenHash) {
      const queryResult =
        await queryClient.findReportByAccessTokenHash(accessTokenHash);

      if (!queryResult.ok) {
        throw createSmokeError(queryResult.code);
      }

      if (queryResult.data === null) {
        return null;
      }

      return mapLookupRowToRecord(queryResult.data, accessTokenHash);
    },
  };
}

async function run(): Promise<void> {
  const mode = process.env.REPORT_PERSISTENCE_MODE ?? defaultMode;

  if (mode !== requiredMode) {
    throw createSmokeError(
      `set REPORT_PERSISTENCE_MODE to ${requiredMode}; current mode is ${defaultMode} unless explicitly configured.`,
    );
  }

  writeStatus("start");

  const issuedShare = issueReportShareToken({ nowIso: smokeCreatedAt });

  if (!issuedShare.ok) {
    throw createSmokeError(issuedShare.code);
  }

  if (issuedShare.issue.sharePath !== `/r/${issuedShare.issue.shareToken}`) {
    throw createSmokeError("share path format was invalid.");
  }

  writeStatus("issued share token: yes");

  const envelope = createReportApiEnvelopeFromJson(smokeInput);

  if (!envelope.body.ok) {
    throw createSmokeError(envelope.body.error.code);
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
    accessTokenIssue: {
      accessTokenHash: issuedShare.issue.accessTokenHash,
      accessTokenCreatedAt: issuedShare.issue.accessTokenCreatedAt,
      accessTokenVersion: issuedShare.issue.accessTokenVersion,
    },
  });

  if (!payloadResult.ok) {
    throw createSmokeError(payloadResult.code);
  }

  const runtime = createReportPersistenceRuntimeFromEnv();

  if (!runtime.ok) {
    throw createSmokeError(runtime.code);
  }

  const smokeRunId = createSmokeRunId();
  const paymentOrderId = `${paymentOrderIdPrefix}_${smokeRunId}`;
  const paymentProviderPaymentId = `${paymentProviderPaymentIdPrefix}_${smokeRunId}`;

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

  writeStatus(`stored paid report id: ${createResult.record.reportId}`);

  const lookupResult = await findPaidReportByShareToken({
    shareToken: issuedShare.issue.shareToken,
    store: createLookupStore(),
  });

  if (!lookupResult.ok) {
    throw createSmokeError(lookupResult.error.code);
  }

  if (lookupResult.view.reportId !== createResult.record.reportId) {
    throw createSmokeError("lookup report id did not match stored report id.");
  }

  if (
    lookupResult.view.accessMode !== "paid" ||
    lookupResult.view.status !== "paid_unlocked"
  ) {
    throw createSmokeError("lookup did not return paid unlocked view.");
  }

  const safeViewJson = JSON.stringify(lookupResult.view);

  if (
    safeViewJson.includes(issuedShare.issue.shareToken) ||
    safeViewJson.includes(issuedShare.issue.sharePath) ||
    safeViewJson.includes(issuedShare.issue.accessTokenHash) ||
    safeViewJson.includes(paymentProviderPaymentId)
  ) {
    throw createSmokeError("safe lookup view exposed restricted data.");
  }

  writeStatus(`lookup paid report id: ${lookupResult.view.reportId}`);
  writeStatus("safe view: ok");
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Supabase paid share lookup smoke failed."}\n`,
  );
  process.exitCode = 1;
});
