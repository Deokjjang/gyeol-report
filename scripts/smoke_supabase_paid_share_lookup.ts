import { createReportApiEnvelopeFromJson } from "../src/lib/api/createReport";
import {
  findPaidReportByShareToken,
  type PaidReportLookupStore,
} from "../src/lib/persistence/paidReportLookupBoundary";
import { persistPaidFullReport } from "../src/lib/persistence/paidReportStorageBoundary";
import { createReportPersistenceRuntimeFromEnv } from "../src/lib/persistence/reportPersistenceRuntime";
import { issueReportShareToken } from "../src/lib/persistence/reportShareTokenIssuer";
import { mapSupabaseRowToPersistedReportRecord } from "../src/lib/persistence/supabaseReportPersistenceMapper";
import { createSupabaseReportPersistenceSdkClient } from "../src/lib/persistence/supabaseReportPersistenceSdkClient";
import { buildReportPersistencePayload } from "../src/lib/report/reportPersistencePayload";
import type { ReportRequestRawInput } from "../src/lib/validation/types";

const requiredMode = "supabase";
const defaultMode = "preview_memory";
const smokeCreatedAt = "2026-01-01T00:00:00.000Z";
const paymentPaidAt = "2026-01-01T00:01:00.000Z";
const paymentOrderId = "smoke_order_share_lookup";
const paymentProvider = "smoke";
const providerPaymentIdValue = "smoke_payment_share_lookup";
const paymentStatus = "paid" as const;
const paymentAmount = 1290;
const paymentCurrency = "KRW";
type RequiredSupabaseEnvName = "SUPABASE_URL" | "SUPABASE_ANON_KEY";

const smokeInput = {
  displayName: "SUPABASE_LOOKUP_SMOKE",
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

function getRequiredEnvValue(name: RequiredSupabaseEnvName): string {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw createSmokeError(`set ${name} first.`);
  }

  return value;
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

      const recordResult = mapSupabaseRowToPersistedReportRecord(
        queryResult.data,
      );

      if (!recordResult.ok) {
        throw createSmokeError(recordResult.code);
      }

      return recordResult.value;
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

  const paidRecord = {
    ...payloadResult.input.record,
    status: "paid_unlocked" as const,
    accessMode: "paid" as const,
    payment: {
      orderId: paymentOrderId,
      provider: paymentProvider,
      ...{ providerPaymentId: providerPaymentIdValue },
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
    safeViewJson.includes(providerPaymentIdValue)
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
