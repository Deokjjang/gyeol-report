import { buildAnnualFortuneEvidence } from "../src/lib/report-knowledge/annualFortuneEvidence";
import {
  ANNUAL_FORTUNE_FIXTURES,
  requireAnnualFortuneFixture,
} from "../src/lib/report-knowledge/annualFortuneFixtures";
import {
  annualFortuneReportDraftJsonSchema,
  getAnnualFortuneReportDraftSchemaTopLevelKeys,
} from "../src/lib/report-generation/annualFortuneReportDraftTypes";
import {
  summarizeAnnualFortuneDraftQuality,
  validateAnnualFortuneReportDraft,
} from "../src/lib/report-generation/annualFortuneReportDraftValidator";
import {
  AnnualFortuneReportWriterFailure,
  annualFortuneResponseFormatName,
  formatAnnualFortuneOpenAIRequestDiagnostics,
  generateAnnualFortuneReportDraft,
} from "../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import {
  buildOpenAIAnnualFortuneReportWriterMessages,
} from "../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import {
  getAnnualFortunePreviewSnapshotRelativePath,
  getAnnualFortunePreviewUrl,
  writeAnnualFortunePreviewSnapshot,
} from "../src/lib/report-generation/annualFortunePreviewSnapshot";

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const annualFortuneDefaultFixtureId = "deokmin-2026-current";
const annualFortuneMonthlyBasisFallback = "calendar_month_approximation";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    ANNUAL_FORTUNE_FIXTURES.find(
      (fixture) => fixture.id === annualFortuneDefaultFixtureId,
    )?.id ??
    ANNUAL_FORTUNE_FIXTURES[0].id;
}

function shouldWritePreview(argv: readonly string[]): boolean {
  return argv.includes("--write-preview");
}

function getEnvValue(name: string): string | undefined {
  const value = process.env[name];

  return value === undefined || value.trim().length === 0 ? undefined : value;
}

function isWriterEnabled(): boolean {
  return getEnvValue("OPENAI_REPORT_WRITER_ENABLED") === "1";
}

function hasWriterConfig(): boolean {
  return (
    getEnvValue(openAIKeyEnvName) !== undefined &&
    getEnvValue("OPENAI_REPORT_MODEL") !== undefined
  );
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function writeList(label: string, values: readonly string[]): void {
  writeLine(`${label}:`);
  if (values.length === 0) {
    writeLine("- none");
    return;
  }
  for (const value of values) {
    writeLine(`- ${value}`);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const writePreview = shouldWritePreview(argv);
  const fixture = requireAnnualFortuneFixture(getFixtureId(argv));
  const packet = buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });

  writeLine(`annual fortune draft fixture: ${fixture.id}`);
  writeLine(`mode: ${packet.mode}`);
  writeLine(`year: ${packet.targetYear}`);
  writeLine(`ganji: ${packet.annualGanji.ganji}`);
  writeLine(`ten god: ${packet.annualTenGod.stemTenGod}`);
  writeLine(
    `year element: ${packet.annualGanji.stemElement}/${packet.annualGanji.branchElement}`,
  );
  writeLine("user context:");
  writeLine(`- life status: ${packet.userContext.lifeStatus}`);
  writeLine(`- field label: ${packet.userContext.fieldLabel ?? "none"}`);
  writeList(
    "context translation hints",
    packet.contextTranslationHints.map(
      (hint) =>
        `${hint.domain} nouns: ${hint.preferredSceneNouns.join(", ")} | ${hint.plain}`,
    ),
  );
  writeLine(
    `monthly basis: ${packet.monthlyFortuneSeeds[0]?.monthGanji.basis ?? annualFortuneMonthlyBasisFallback}`,
  );
  writeList(
    "life area signals",
    packet.lifeAreaSignals.map(
      (signal) => `${signal.area} ${signal.strength}: ${signal.plain}`,
    ),
  );
  writeList(
    "difficulty signals",
    packet.difficultySignals.map(
      (signal) => `${signal.type} ${signal.severity}: ${signal.plain}`,
    ),
  );
  writeList(
    "opportunity signals",
    packet.opportunitySignals.map(
      (signal) => `${signal.type} ${signal.strength}: ${signal.plain}`,
    ),
  );

  if (!isWriterEnabled()) {
    writeLine("SKIP draft generation, OpenAI writer disabled");
    return;
  }
  if (!hasWriterConfig()) {
    writeLine("SKIP draft generation, OpenAI writer env incomplete");
    return;
  }

  const messages = buildOpenAIAnnualFortuneReportWriterMessages({
    evidencePacket: packet,
  });

  if (getEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") === "1") {
    writeLine("OpenAI request debug:");
    writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
    writeLine(`response format: ${annualFortuneResponseFormatName}`);
    writeLine(
      `schema keys: ${getAnnualFortuneReportDraftSchemaTopLevelKeys().join(", ")}`,
    );
    writeLine(
      `schema approx chars: ${JSON.stringify(annualFortuneReportDraftJsonSchema).length}`,
    );
    writeLine(`system chars: ${messages.system.length}`);
    writeLine(`developer chars: ${messages.developer.length}`);
    writeLine(`user chars: ${messages.user.length}`);
  }

  const result = await generateAnnualFortuneReportDraft({
    evidencePacket: packet,
    config: {
      enabled: true,
      apiKey: getEnvValue(openAIKeyEnvName) ?? "",
      model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
    },
  });
  const validation = validateAnnualFortuneReportDraft(result.draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  writeLine(`draft version: ${validation.value.version}`);
  writeLine("flow cards:");
  for (const card of validation.value.flowCards) {
    writeLine(`- ${card.label}: ${card.score}`);
  }
  writeLine(`chapters: ${validation.value.chapters.length}`);
  writeLine(`monthly flow: ${validation.value.monthlyFlow.length}`);
  writeLine(`monthly flow count: ${validation.value.monthlyFlow.length}`);
  const quality = summarizeAnnualFortuneDraftQuality(validation.value);
  writeLine(`vague copy warnings: ${quality.vagueCopyWarnings}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`internal artifact warnings: ${quality.internalArtifactWarnings}`);
  writeLine(`raw English labels: ${quality.rawEnglishSignalLabelWarnings}`);
  writeLine(`repeated term warnings: ${quality.repeatedTermWarnings}`);
  writeLine(
    `generic final advice labels: ${quality.genericFinalAdviceLabelWarnings}`,
  );
  writeLine(
    `final advice domain mismatch warnings: ${quality.finalAdviceDomainMismatchWarnings}`,
  );
  writeLine(
    `repeated terminology warnings: ${quality.repeatedTermWarnings}`,
  );
  writeLine(
    `monthly evidence missing warnings: ${quality.monthlyEvidenceMissingWarnings}`,
  );
  writeLine(
    `domain context overreach warnings: ${quality.domainContextOverreachWarnings}`,
  );
  writeLine(
    `missing difficulty signal warnings: ${quality.missingDifficultySignalWarnings}`,
  );
  writeLine(
    `missing opportunity signal warnings: ${quality.missingOpportunitySignalWarnings}`,
  );
  writeLine(`hero duplication warnings: ${quality.heroDuplicationWarnings}`);
  writeLine(
    `future development wording warnings: ${quality.futureDevelopmentWordingWarnings}`,
  );
  writeLine(
    `final advice domain lock warnings: ${quality.finalAdviceDomainLockWarnings}`,
  );
  writeLine(`abnormal script warnings: ${quality.abnormalScriptWarnings}`);
  writeLine(
    `monthly basis repetition warnings: ${quality.monthlyBasisRepetitionWarnings}`,
  );
  writeLine(`grammar residue warnings: ${quality.grammarResidueWarnings}`);
  writeLine(`parenthetical term warnings: ${quality.parentheticalTermWarnings}`);
  writeLine(
    `monthly basis: ${packet.monthlyFortuneSeeds[0]?.monthGanji.basis ?? annualFortuneMonthlyBasisFallback}`,
  );

  if (writePreview) {
    await writeAnnualFortunePreviewSnapshot({
      fixtureId: fixture.id,
      evidencePacket: packet,
      draft: validation.value,
    });
    const snapshotPath = getAnnualFortunePreviewSnapshotRelativePath(fixture.id);
    const previewUrl = getAnnualFortunePreviewUrl(fixture.id);

    writeLine("preview snapshot written:");
    writeLine(snapshotPath);
    writeLine(`snapshot: ${snapshotPath}`);
    writeLine("Open in browser:");
    writeLine(previewUrl);
    writeLine(`url: ${previewUrl}`);
  }
  writeLine("done");
}

main().catch((error: unknown) => {
  process.stderr.write("FAIL\n");
  if (error instanceof AnnualFortuneReportWriterFailure) {
    process.stderr.write(`${error.code}\n`);
    if (error.diagnostics !== undefined) {
      for (const line of formatAnnualFortuneOpenAIRequestDiagnostics(
        error.diagnostics,
      )) {
        process.stderr.write(`${line}\n`);
      }
    } else {
      process.stderr.write(`${error.message}\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
