import {
  generateComprehensiveReportDraft,
  isSafeReportGenerationError,
} from "../src/lib/report-generation/openaiComprehensiveReportWriter";
import { isComprehensiveReportV2Draft } from "../src/lib/report-generation/comprehensiveReportDraftTypes";
import { comprehensiveReportDraftJsonSchema } from "../src/lib/report-generation/comprehensiveReportDraftSchema";
import {
  buildOpenAIComprehensiveReportWriterMessages,
  deriveAllowedSajuTermsFromEvidencePacket,
} from "../src/lib/report-generation/openaiReportWriterPrompt";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import type { ComputedSajuFacts } from "../src/lib/report-knowledge/sajuComputedFactsTypes";

type RequiredOpenAIReportEnvName =
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const requiredOpenAIReportEnvNames = [
  "OPENAI_REPORT_WRITER_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_REPORT_MODEL",
] as const satisfies readonly RequiredOpenAIReportEnvName[];

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

function getEnvValue(name: RequiredOpenAIReportEnvName): string | undefined {
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

function shouldSkipSmoke(): boolean {
  return requiredOpenAIReportEnvNames.some(
    (name) => getEnvValue(name) === undefined,
  );
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

function writeSafeFailure(error: unknown): void {
  if (isSafeReportGenerationError(error)) {
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
    return;
  }

  writeErrorStatus("failed");
  writeErrorStatus("code: OPENAI_REPORT_WRITER_SMOKE_FAILED");
  writeErrorStatus("stage: unknown");
}

async function run(): Promise<void> {
  if (shouldSkipSmoke() || getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1") {
    writeStatus("skipped: OpenAI report writer smoke is not enabled.");
    return;
  }

  const apiKey = getEnvValue("OPENAI_API_KEY");
  const model = getEnvValue("OPENAI_REPORT_MODEL");

  if (apiKey === undefined || model === undefined) {
    writeStatus("skipped: OpenAI report writer env is incomplete.");
    return;
  }

  writeStatus("start");

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

  const result = await generateComprehensiveReportDraft({
    userDisplayName: "덕민",
    mbtiType: "ENTJ",
    evidencePacket: packet,
    config: {
      apiKey,
      model,
      enabled: true,
    },
  });
  const firstChapter = isComprehensiveReportV2Draft(result.draft)
    ? result.draft.chapters[0]
    : result.draft.sections[0];

  writeStatus(`draft version: ${result.draft.version}`);
  writeStatus(`product type: ${result.draft.productType}`);
  writeStatus(
    `chapters: ${
      isComprehensiveReportV2Draft(result.draft)
        ? result.draft.chapters.length
        : result.draft.sections.length
    }`,
  );
  writeStatus(`core line: ${result.draft.coreLine}`);
  writeStatus(
    `first chapter: ${firstChapter?.titleKo ?? "none"}`,
  );
  for (const warning of result.warnings) {
    if (warning.startsWith("quality repair:")) {
      writeStatus(warning);
    }
  }
  writeStatus("done");
}

run().catch((error: unknown) => {
  writeSafeFailure(error);
  process.exitCode = 1;
});
