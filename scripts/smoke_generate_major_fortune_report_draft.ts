import { buildMajorFortuneEvidence } from "../src/lib/report-knowledge/majorFortuneEvidence";
import {
  MAJOR_FORTUNE_FIXTURES,
  requireMajorFortuneFixture,
} from "../src/lib/report-knowledge/majorFortuneFixtures";
import {
  summarizeMajorFortuneDraftQuality,
  validateMajorFortuneReportDraft,
} from "../src/lib/report-generation/majorFortuneReportDraftValidator";
import {
  getMajorFortunePreviewSnapshotRelativePath,
  getMajorFortunePreviewUrl,
  writeMajorFortunePreviewSnapshot,
} from "../src/lib/report-generation/majorFortunePreviewSnapshot";

const openAIKeyEnvName = ["OPENAI", "API", "KEY"].join("_");
const majorFortuneDefaultFixtureId = "deokmin-current-major-fortune";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    MAJOR_FORTUNE_FIXTURES.find(
      (fixture) => fixture.id === majorFortuneDefaultFixtureId,
    )?.id ??
    MAJOR_FORTUNE_FIXTURES[0].id;
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
  const fixture = requireMajorFortuneFixture(getFixtureId(argv));
  const packet = buildMajorFortuneEvidence({
    fixtureId: fixture.id,
    currentYear: fixture.currentYear,
    person: fixture.person,
  });

  writeLine(`major fortune draft fixture: ${fixture.id}`);
  writeLine(`current year: ${packet.currentYear}`);
  writeLine(`current age: ${packet.currentAge}`);
  writeLine(
    `current cycle: ${packet.currentCycle.startYear}-${packet.currentCycle.endYear} age ${packet.currentCycle.startAge}-${packet.currentCycle.endAge}`,
  );
  writeLine(`ganji: ${packet.currentCycle.ganji}`);
  writeLine(`ten god: ${packet.majorTenGod.stemTenGod}`);
  writeLine(`cycle basis: ${packet.majorCycleBasis.displayLabel}`);
  writeLine(`cycle position: ${packet.cyclePosition.positionLabel}`);
  writeLine(
    `elements: ${packet.currentCycle.stemElement}/${packet.currentCycle.branchElement}`,
  );
  writeLine(`calculation basis: ${packet.calculationBasis.displayLabel}`);
  writeLine(`cycle year timeline: ${packet.cycleYearTimeline.length}`);
  writeLine(`major fortune timeline rows: ${packet.majorFortuneTimelineRows.length}`);
  writeLine(`myeongli layers: ten-god/element/branch/hidden-stem/auxiliary-stars`);
  writeList("life area signals", packet.lifeAreaSignals.map((signal) => signal.plain));
  writeList("difficulty signals", packet.difficultySignals.map((signal) => signal.plain));
  writeList("opportunity signals", packet.opportunitySignals.map((signal) => signal.plain));
  writeList(
    "strong years within cycle",
    packet.strongYearsWithinCycle.map(
      (year) =>
        `${year.year} ${year.ganji}: ${year.whyStrong} / push ${year.pushStrategy} / reduce ${year.reduceStrategy}`,
    ),
  );
  writeList(
    "compact daeun seun timeline",
    packet.majorFortuneTimelineRows.map(
      (row) =>
        `${row.year} major ${row.majorGanji} annual ${row.annualGanji} ${row.badges.join(",")}: ${row.oneLine}`,
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

  const [
    writerModule,
    promptModule,
    typesModule,
  ] = await Promise.all([
    import("../src/lib/report-generation/openaiMajorFortuneReportWriter"),
    import("../src/lib/report-generation/openaiMajorFortuneReportWriterPrompt"),
    import("../src/lib/report-generation/majorFortuneReportDraftTypes"),
  ]);
  const messages = promptModule.buildOpenAIMajorFortuneReportWriterMessages({
    evidencePacket: packet,
  });

  if (getEnvValue("OPENAI_REPORT_WRITER_DEBUG_SAFE") === "1") {
    writeLine("OpenAI request debug:");
    writeLine(`model: ${getEnvValue("OPENAI_REPORT_MODEL")}`);
    writeLine(`response format: ${writerModule.majorFortuneResponseFormatName}`);
    writeLine(
      `schema keys: ${typesModule.getMajorFortuneReportDraftSchemaTopLevelKeys().join(", ")}`,
    );
    writeLine(
      `schema approx chars: ${JSON.stringify(typesModule.majorFortuneReportDraftJsonSchema).length}`,
    );
    writeLine(`system chars: ${messages.system.length}`);
    writeLine(`developer chars: ${messages.developer.length}`);
    writeLine(`user chars: ${messages.user.length}`);
  }

  const result = await writerModule.generateMajorFortuneReportDraft({
    evidencePacket: packet,
    config: {
      enabled: true,
      apiKey: getEnvValue(openAIKeyEnvName) ?? "",
      model: getEnvValue("OPENAI_REPORT_MODEL") ?? "",
    },
  });
  const validation = validateMajorFortuneReportDraft(result.draft);

  if (!validation.ok || validation.value === undefined) {
    throw new Error(validation.errors.join("\n"));
  }

  const quality = summarizeMajorFortuneDraftQuality(validation.value);

  writeLine(`draft version: ${validation.value.version}`);
  writeLine(`decade cards: ${validation.value.decadeCards.length}`);
  writeLine(`chapters: ${validation.value.cycleChapters.length}`);
  writeLine(`phase timeline: ${validation.value.phaseTimeline.length}`);
  writeLine(`cycle year timeline: ${quality.cycleYearTimelineCount}`);
  writeLine(`strong years: ${validation.value.strongYears.length}`);
  writeLine(`final advice: ${validation.value.finalAdvice.length}`);
  writeLine(`missing cycle year warnings: ${quality.missingCycleYearWarnings}`);
  writeLine(`cycle index leak warnings: ${quality.cycleIndexLeakWarnings}`);
  writeLine(
    `technical term warnings: ${quality.technicalTermWithoutExplanationWarnings}`,
  );
  writeLine(
    `small event overfocus warnings: ${quality.smallEventOverfocusWarnings}`,
  );
  writeLine(`wrong cycle basis warnings: ${quality.wrongCycleBasisWarnings}`);
  writeLine(`generic timeline warnings: ${quality.genericTimelineWarnings}`);
  writeLine(`repeated summary warnings: ${quality.repeatedSummaryWarnings}`);
  writeLine(`weak strategy warnings: ${quality.weakStrategyWarnings}`);
  writeLine(
    `relationship status misuse warnings: ${quality.relationshipStatusMisuseWarnings}`,
  );
  writeLine(
    `strong year title repeat warnings: ${quality.strongYearTitleRepeatWarnings}`,
  );
  writeLine(`repeated strategy warnings: ${quality.repeatedStrategyWarnings}`);
  writeLine(`repeated theme warnings: ${quality.repeatedThemeWarnings}`);
  writeLine(`annual-tone warnings: ${quality.annualToneWarnings}`);
  writeLine(`decade-tone warnings: ${quality.decadeToneWarnings}`);
  writeLine(`strong year reason warnings: ${quality.strongYearReasonWarnings}`);
  writeLine(`hard claim warnings: ${quality.hardClaimWarnings}`);
  writeLine(`internal artifact warnings: ${quality.internalArtifactWarnings}`);
  writeLine(`repeated terminology warnings: ${quality.repeatedTerminologyWarnings}`);

  if (writePreview) {
    await writeMajorFortunePreviewSnapshot({
      fixtureId: fixture.id,
      evidencePacket: packet,
      draft: validation.value,
    });
    const snapshotPath = getMajorFortunePreviewSnapshotRelativePath(fixture.id);
    const previewUrl = getMajorFortunePreviewUrl(fixture.id);

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
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
