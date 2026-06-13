import { generateComprehensiveReportDraft } from "../src/lib/report-generation/openaiComprehensiveReportWriter";
import { isComprehensiveReportV2Draft } from "../src/lib/report-generation/comprehensiveReportDraftTypes";
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

function getEnvValue(name: RequiredOpenAIReportEnvName): string | undefined {
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
  writeStatus("done");
}

run().catch((error: unknown) => {
  process.stderr.write(
    `${
      error instanceof Error
        ? error.message
        : "OpenAI report writer smoke failed."
    }\n`,
  );
  process.exitCode = 1;
});
