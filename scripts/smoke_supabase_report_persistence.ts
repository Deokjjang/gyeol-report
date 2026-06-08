import { createReportApiEnvelopeFromJson } from "../src/lib/api/createReport";
import { createReportPersistenceRuntimeFromEnv } from "../src/lib/persistence/reportPersistenceRuntime";
import { buildReportPersistencePayload } from "../src/lib/report/reportPersistencePayload";
import type { ReportRequestRawInput } from "../src/lib/validation/types";

const requiredMode = "supabase";
const defaultMode = "preview_memory";
const smokeCreatedAt = "2026-01-01T00:00:00.000Z";
const requiredSupabaseEnvNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
] as const;

const smokeInput = {
  displayName: "SUPABASE_SMOKE",
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
  return new Error(`Supabase report persistence smoke failed: ${message}`);
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

  if (payloadResult.input.record.accessTokenHash.trim().length === 0) {
    throw createSmokeError("accessTokenHash was not created.");
  }

  const runtime = createReportPersistenceRuntimeFromEnv();

  if (!runtime.ok) {
    throw createSmokeError(runtime.code);
  }

  const createResult = await runtime.adapter.create(payloadResult.input);

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created report id: ${createResult.record.reportId}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Supabase report persistence smoke failed."}\n`,
  );
  process.exitCode = 1;
});
