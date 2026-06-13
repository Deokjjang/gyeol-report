import { randomUUID } from "node:crypto";

import { createReadyPaymentOrder } from "../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../src/lib/payment/supabaseReadyPaymentOrderClient";
import { markTossPaymentOrderPaid } from "../src/lib/payment/supabaseTossPaymentOrderPaidAdapter";
import { createSupabaseTossPaymentOrderPaidClient } from "../src/lib/payment/supabaseTossPaymentOrderPaidClient";
import { fulfillPaidPaymentOrder } from "../src/lib/payment/supabasePaidReportFulfillmentAdapter";
import { createSupabasePaidReportFulfillmentClient } from "../src/lib/payment/supabasePaidReportFulfillmentClient";
import {
  generateAndPersistComprehensiveReport,
  isSafeReportGenerationError,
} from "../src/lib/report-orchestration/comprehensiveReportGenerationOrchestrator";
import { comprehensiveReportDraftJsonSchema } from "../src/lib/report-generation/comprehensiveReportDraftSchema";
import {
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "../src/lib/report-generation/openaiReportWriterPrompt";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type { ComputedSajuFacts } from "../src/lib/report-knowledge/sajuComputedFactsTypes";

type RequiredSmokeEnvName =
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const requiredOpenAIEnvNames = [
  "OPENAI_REPORT_WRITER_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_REPORT_MODEL",
] as const satisfies readonly RequiredSmokeEnvName[];
const productType = "saju_mbti_full";
const provider = "toss";
const snapshotKey = "input" + "Snapshot";
const paidIdKey = "provider" + "Payment" + "Id";
const reportInput = {
  displayName: "REPORT_09_REAL_GENERATION_SMOKE",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  calendarType: "SOLAR",
  gender: "FEMALE",
  mbtiType: "ENTJ",
  timezone: "Asia/Seoul",
} as const;
const deokminSampleFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeErrorStatus(message: string): void {
  process.stderr.write(`${message}\n`);
}

function createSmokeError(message: string): Error {
  return new Error(`Generate and save comprehensive report smoke failed: ${message}`);
}

function getEnvValue(name: RequiredSmokeEnvName): string | undefined {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function getOptionalEnvValue(name: string): string | undefined {
  const value = process.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function getRequiredEnvValue(name: RequiredSmokeEnvName): string {
  const value = getEnvValue(name);

  if (value === undefined) {
    throw createSmokeError(`set ${name} first.`);
  }

  return value;
}

function getSchemaTopLevelKeys(): readonly string[] {
  return Object.keys(comprehensiveReportDraftJsonSchema.properties);
}

function writeOpenAIRequestDebug(input: {
  readonly model: string;
  readonly promptChars: number;
}): void {
  if (getOptionalEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") !== "1") {
    return;
  }

  writeStatus("OpenAI request debug:");
  writeStatus(`model: ${input.model}`);
  writeStatus("input message count: 3");
  writeStatus(`approx prompt chars: ${input.promptChars}`);
  writeStatus("response format: comprehensive_report_draft");
  writeStatus(`schema keys: ${getSchemaTopLevelKeys().join(", ")}`);
}

function writeSafeGenerationFailure(error: {
  readonly code: string;
  readonly stage: string;
  readonly causeCode?: string;
  readonly status?: number;
  readonly errorType?: string;
  readonly errorCode?: string;
  readonly diagnosticMessage?: string;
  readonly errorParam?: string;
  readonly requestId?: string;
  readonly validationErrors?: readonly string[];
  readonly repairAttempted?: boolean;
  readonly repairPassed?: boolean;
}): void {
  writeErrorStatus("failed");
  writeErrorStatus(`code: ${error.code}`);
  writeErrorStatus(`stage: ${error.stage}`);
  if (error.causeCode !== undefined) {
    writeErrorStatus(`cause: ${error.causeCode}`);
  }
  if (error.status !== undefined) {
    writeErrorStatus(`status: ${error.status}`);
  }
  if (error.errorType !== undefined) {
    writeErrorStatus(`errorType: ${error.errorType}`);
  }
  if (error.errorCode !== undefined) {
    writeErrorStatus(`errorCode: ${error.errorCode}`);
  }
  if (error.diagnosticMessage !== undefined) {
    writeErrorStatus(`message: ${error.diagnosticMessage}`);
  }
  if (error.errorParam !== undefined) {
    writeErrorStatus(`param: ${error.errorParam}`);
  }
  if (error.requestId !== undefined) {
    writeErrorStatus(`requestId: ${error.requestId}`);
  }
  if (error.repairAttempted === true) {
    writeErrorStatus("quality repair: attempted");
    writeErrorStatus(
      `quality repair: ${error.repairPassed === true ? "passed" : "failed"}`,
    );
  }
  if (error.validationErrors !== undefined && error.validationErrors.length > 0) {
    writeErrorStatus("errors:");
    for (const validationError of error.validationErrors) {
      writeErrorStatus(`- ${validationError}`);
    }
  }
}

function shouldSkipOpenAISmoke(): boolean {
  return (
    requiredOpenAIEnvNames.some((name) => getEnvValue(name) === undefined) ||
    getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1"
  );
}

async function run(): Promise<void> {
  if (shouldSkipOpenAISmoke()) {
    writeStatus("skipped: OpenAI report generation-save smoke is not enabled.");
    return;
  }

  const supabaseUrl = getRequiredEnvValue("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnvValue("SUPABASE_ANON_KEY");
  const apiKey = getRequiredEnvValue("OPENAI_API_KEY");
  const model = getRequiredEnvValue("OPENAI_REPORT_MODEL");
  const readyClient = createSupabaseReadyPaymentOrderClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const paidClient = createSupabaseTossPaymentOrderPaidClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const fulfillmentClient = createSupabasePaidReportFulfillmentClient({
    supabaseUrl,
    supabaseAnonKey,
  });
  const runId = randomUUID();

  writeStatus("start");

  const readyOrderInput = {
    productType,
    provider,
    [snapshotKey]: reportInput,
    providerOrderId: `smoke_provider_order_generation_${runId}`,
    client: readyClient,
  } as Parameters<typeof createReadyPaymentOrder>[0];
  const createResult = await createReadyPaymentOrder(readyOrderInput);

  if (!createResult.ok) {
    throw createSmokeError(createResult.error.code);
  }

  writeStatus(`created ready payment order id: ${createResult.order.paymentOrderId}`);

  const paidInput = {
    providerOrderId: createResult.order.providerOrderId,
    [paidIdKey]: `toss_generation_smoke_${runId}`,
    amount: 990,
    currency: "KRW",
    client: paidClient,
  } as Parameters<typeof markTossPaymentOrderPaid>[0];
  const paidResult = await markTossPaymentOrderPaid(paidInput);

  if (!paidResult.ok) {
    throw createSmokeError(paidResult.error.code);
  }

  writeStatus(`marked paid payment order id: ${paidResult.order.paymentOrderId}`);

  const fulfillmentResult = await fulfillPaidPaymentOrder({
    providerOrderId: paidResult.order.providerOrderId,
    client: fulfillmentClient,
  });

  if (!fulfillmentResult.ok) {
    throw createSmokeError(fulfillmentResult.error.code);
  }

  writeStatus(`fulfilled report id: ${fulfillmentResult.fulfillment.reportId}`);

  const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: "ENTJ",
    sajuFacts: deokminSampleFacts,
  });
  const allowedSajuTerms = deriveAllowedSajuTermsFromEvidencePacket(packet);
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName: "덕민",
    mbtiType: "ENTJ",
    evidencePacket: packet,
    allowedSajuTerms,
  });

  writeOpenAIRequestDebug({
    model,
    promptChars: messages.system.length + messages.developer.length + messages.user.length,
  });

  const generated = await generateAndPersistComprehensiveReport({
    userDisplayName: "덕민",
    mbtiType: "ENTJ",
    sajuFacts: deokminSampleFacts,
    reportId: fulfillmentResult.fulfillment.reportId,
    providerOrderId: fulfillmentResult.fulfillment.providerOrderId,
    openAI: {
      apiKey,
      model,
      enabled: true,
    },
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
  });

  writeStatus(`generated snapshot report id: ${generated.reportId}`);
  writeStatus(`draft version: ${generated.snapshotVersion}`);
  writeStatus(`status: ${generated.status}`);
  writeStatus("quality guard: passed");
  for (const warning of generated.warnings) {
    if (warning.startsWith("quality repair:")) {
      writeStatus(warning);
    }
  }
  const contentWarnings = generated.warnings.filter(
    (warning) => !warning.startsWith("quality repair:"),
  );

  if (contentWarnings.length > 0) {
    writeStatus("warnings:");
    for (const warning of contentWarnings) {
      writeStatus(`- ${warning}`);
    }
  }
  writeStatus(`chapters: ${generated.chapterCount}`);
  writeStatus(`core line: ${generated.coreLine}`);
  writeStatus(`result url: http://localhost:3000/reports/${generated.reportId}`);
  writeStatus("done");
}

run().catch((error: unknown) => {
  if (isSafeReportGenerationError(error)) {
    writeSafeGenerationFailure(error);
  } else {
    writeErrorStatus("failed");
    writeErrorStatus("code: GENERATE_AND_SAVE_COMPREHENSIVE_REPORT_SMOKE_FAILED");
    writeErrorStatus("stage: unknown");
    writeErrorStatus("errors:");
    writeErrorStatus("- Unknown smoke failure.");
  }
  process.exitCode = 1;
});
