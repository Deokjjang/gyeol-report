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
import type {
  ComprehensiveReportEvidencePacket,
  SelectedSajuFeatureEvidence,
} from "../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";
import {
  getReportQualitySmokeSampleFixtures,
  getReportSmokeFixture,
  getReportSmokeFixtureIdFromArgs,
  getReportSmokeFixtureMatrixModeFromArgs,
  type ReportQualityFixture,
} from "../src/lib/report-knowledge/reportQualityFixtureMatrix";
import {
  buildSafeSajuFeatureEvidenceDebugSummary,
  formatSafeSajuFeatureEvidenceDebugSummary,
} from "../src/lib/report-knowledge/sajuFeatureEvidenceDebug";

type RequiredOpenAIReportEnvName =
  | "OPENAI_REPORT_WRITER_ENABLED"
  | "OPENAI_API_KEY"
  | "OPENAI_REPORT_MODEL";

const requiredOpenAIReportEnvNames = [
  "OPENAI_REPORT_WRITER_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_REPORT_MODEL",
] as const satisfies readonly RequiredOpenAIReportEnvName[];

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

function formatFixturePillars(fixture: ReportQualityFixture): string {
  return [
    fixture.expectedPillars.hour,
    fixture.expectedPillars.day,
    fixture.expectedPillars.month,
    fixture.expectedPillars.year,
  ].join(" ");
}

function buildFixtureQualitySummary(fixture: ReportQualityFixture): {
  readonly computedFeatureCount: number;
  readonly spotlightGroups: readonly string[];
  readonly differentiationModulesCount: number;
} {
  const { packet, mappedFeatures } =
    buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });

  return {
    computedFeatureCount: mappedFeatures.featureIds.length,
    spotlightGroups:
      packet.sajuFeatureSpotlight?.groups
        .filter((group) => group.items.length > 0)
        .map((group) => group.groupId) ?? [],
    differentiationModulesCount: packet.reportDifferentiationModules?.length ?? 0,
  };
}

function writeFixtureQualitySummary(input: {
  readonly fixture: ReportQualityFixture;
  readonly status: "PASS" | "SKIPPED" | "FAIL";
  readonly warningsCount?: number;
}): void {
  const summary = buildFixtureQualitySummary(input.fixture);

  writeStatus(
    [
      `- fixture id: ${input.fixture.id}`,
      `MBTI: ${input.fixture.mbti}`,
      `pillars: ${formatFixturePillars(input.fixture)}`,
      `computed feature count: ${summary.computedFeatureCount}`,
      `spotlight groups: ${summary.spotlightGroups.join(", ") || "none"}`,
      `differentiation modules count: ${summary.differentiationModulesCount}`,
      `draft status: ${input.status}`,
      `validator warnings count: ${input.warningsCount ?? 0}`,
    ].join(" | "),
  );
}

function writeSafeSajuFeatureDebug(input: {
  readonly computedFeatureIds: readonly string[];
  readonly selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
  readonly sajuFeatureSpotlight?: ComprehensiveReportEvidencePacket["sajuFeatureSpotlight"];
  readonly sajuSignatureScenes?: ComprehensiveReportEvidencePacket["sajuSignatureScenes"];
}): void {
  if (getOptionalEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") !== "1") {
    return;
  }

  const summary = buildSafeSajuFeatureEvidenceDebugSummary(input);

  for (const line of formatSafeSajuFeatureEvidenceDebugSummary(summary)) {
    writeStatus(line);
  }
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

async function generateFixtureDraft(input: {
  readonly fixture: ReportQualityFixture;
  readonly apiKey: string;
  readonly model: string;
}): Promise<{
  readonly draftVersion: string;
  readonly productType: string;
  readonly chapterCount: number;
  readonly coreLine: string;
  readonly firstChapterTitle: string;
  readonly warnings: readonly string[];
}> {
  const fixture = input.fixture;
  const { packet, mappedFeatures } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: fixture.mbti,
    sajuFacts: fixture.sajuFacts,
  });
  writeSafeSajuFeatureDebug({
    computedFeatureIds: mappedFeatures.featureIds,
    selectedEvidence: packet.selectedSajuFeatureEvidence,
    sajuFeatureSpotlight: packet.sajuFeatureSpotlight,
    sajuSignatureScenes: packet.sajuSignatureScenes,
  });
  const allowedSajuTerms = deriveAllowedSajuTermsFromEvidencePacket(packet);
  const messages = buildOpenAIComprehensiveReportWriterMessages({
    userDisplayName: fixture.label,
    mbtiType: fixture.mbti,
    evidencePacket: packet,
    allowedSajuTerms,
  });

  writeOpenAIRequestDebug({
    model: input.model,
    promptChars: messages.system.length + messages.developer.length + messages.user.length,
  });

  const result = await generateComprehensiveReportDraft({
    userDisplayName: fixture.label,
    mbtiType: fixture.mbti,
    evidencePacket: packet,
    config: {
      apiKey: input.apiKey,
      model: input.model,
      enabled: true,
    },
  });
  const firstChapter = isComprehensiveReportV2Draft(result.draft)
    ? result.draft.chapters[0]
    : result.draft.sections[0];

  return {
    draftVersion: result.draft.version,
    productType: result.draft.productType,
    chapterCount:
      isComprehensiveReportV2Draft(result.draft)
        ? result.draft.chapters.length
        : result.draft.sections.length,
    coreLine: result.draft.coreLine,
    firstChapterTitle: firstChapter?.titleKo ?? "none",
    warnings: result.warnings,
  };
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const fixtureMatrixMode = getReportSmokeFixtureMatrixModeFromArgs(args);

  if (fixtureMatrixMode === "sample") {
    const fixtures = getReportQualitySmokeSampleFixtures();
    writeStatus("quality matrix smoke: sample");
    writeStatus(`fixtures: ${fixtures.length}`);

    if (shouldSkipSmoke() || getEnvValue("OPENAI_REPORT_WRITER_ENABLED") !== "1") {
      for (const fixture of fixtures) {
        writeFixtureQualitySummary({ fixture, status: "SKIPPED" });
      }
      writeStatus("skipped: OpenAI report writer smoke is not enabled.");
      return;
    }

    const apiKey = getEnvValue("OPENAI_API_KEY");
    const model = getEnvValue("OPENAI_REPORT_MODEL");

    if (apiKey === undefined || model === undefined) {
      for (const fixture of fixtures) {
        writeFixtureQualitySummary({ fixture, status: "SKIPPED" });
      }
      writeStatus("skipped: OpenAI report writer env is incomplete.");
      return;
    }

    for (const fixture of fixtures) {
      const result = await generateFixtureDraft({ fixture, apiKey, model });
      writeFixtureQualitySummary({
        fixture,
        status: "PASS",
        warningsCount: result.warnings.length,
      });
    }
    writeStatus("done");
    return;
  }

  const fixture = getReportSmokeFixture(getReportSmokeFixtureIdFromArgs(args));

  writeStatus(`report fixture: ${fixture.id}`);

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
  const result = await generateFixtureDraft({ fixture, apiKey, model });

  writeStatus(`draft version: ${result.draftVersion}`);
  writeStatus(`product type: ${result.productType}`);
  writeStatus(`chapters: ${result.chapterCount}`);
  writeStatus(`core line: ${result.coreLine}`);
  writeStatus(`first chapter: ${result.firstChapterTitle}`);
  for (const warning of result.warnings) {
    if (warning.startsWith("quality repair:")) {
      writeStatus(warning);
    }
  }
  const contentWarnings = result.warnings.filter(
    (warning) => !warning.startsWith("quality repair:"),
  );

  if (contentWarnings.length > 0) {
    writeStatus("warnings:");
    for (const warning of contentWarnings) {
      writeStatus(`- ${warning}`);
    }
  }
  writeStatus("done");
}

run().catch((error: unknown) => {
  writeSafeFailure(error);
  process.exitCode = 1;
});
