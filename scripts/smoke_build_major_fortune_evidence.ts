import {
  buildMajorFortuneEvidence,
  summarizeMajorFortuneEvidenceMatrixQuality,
} from "../src/lib/report-knowledge/majorFortuneEvidence";
import {
  MAJOR_FORTUNE_FIXTURES,
  requireMajorFortuneFixture,
} from "../src/lib/report-knowledge/majorFortuneFixtures";

const defaultFixtureId = "deokmin-current-major-fortune";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    MAJOR_FORTUNE_FIXTURES.find((fixture) => fixture.id === defaultFixtureId)
      ?.id ??
    MAJOR_FORTUNE_FIXTURES[0].id;
}

function shouldRunAll(argv: readonly string[]): boolean {
  return argv.includes("--all");
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

function buildEvidenceForFixture(fixtureId: string): ReturnType<typeof buildMajorFortuneEvidence> {
  const fixture = requireMajorFortuneFixture(fixtureId);

  return buildMajorFortuneEvidence({
    fixtureId: fixture.id,
    currentYear: fixture.currentYear,
    person: fixture.person,
  });
}

function writeMatrixSummary(): void {
  const evidencePackets = MAJOR_FORTUNE_FIXTURES.map((fixture) =>
    buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    }),
  );
  const matrixQuality =
    summarizeMajorFortuneEvidenceMatrixQuality(evidencePackets);

  writeLine(`major fortune fixture matrix: ${evidencePackets.length}`);
  for (const [index, evidence] of evidencePackets.entries()) {
    const fixture = MAJOR_FORTUNE_FIXTURES[index];

    writeLine(`fixture: ${fixture.id}`);
    writeLine(`person: ${evidence.personLabel}`);
    writeLine(
      `current cycle: ${evidence.currentCycle.ganji} ${evidence.currentCycle.startYear}~${evidence.currentCycle.endYear}`,
    );
    writeLine(`major ten-god: ${evidence.majorTenGod.stemTenGod}`);
    writeLine(`relationshipStatus: ${evidence.userContext.relationshipStatus ?? "unknown"}`);
    writeLine(`timeline rows: ${evidence.majorFortuneTimelineRows.length}`);
    writeLine(`strong years: ${evidence.strongYearsWithinCycle.length}`);
    writeLine(
      `likely areas: ${[
        ...new Set(evidence.strongYearsWithinCycle.map((year) => year.likelyArea)),
      ].join(", ")}`,
    );
    writeLine(`warnings: ${evidence.warnings.length}`);
  }
  writeLine(`matrix similarity warnings: ${matrixQuality.matrixSimilarityWarnings}`);
  writeLine(`fixture leakage warnings: ${matrixQuality.fixtureLeakageWarnings}`);
  writeLine(`relationship hint warnings: ${matrixQuality.relationshipHintWarnings}`);
  writeLine(
    `likely area diversity warnings: ${matrixQuality.likelyAreaDiversityWarnings}`,
  );
  writeLine(
    `technical term leakage warnings: ${matrixQuality.technicalTermLeakageWarnings}`,
  );
}

if (shouldRunAll(process.argv.slice(2))) {
  writeMatrixSummary();
  process.exit(0);
}

const fixture = requireMajorFortuneFixture(getFixtureId(process.argv.slice(2)));
const evidence = buildEvidenceForFixture(fixture.id);

writeLine(`major fortune fixture: ${fixture.id}`);
writeLine(`current year: ${evidence.currentYear}`);
writeLine(`current age: ${evidence.currentAge}`);
writeLine(
  `current cycle: ${evidence.currentCycle.startYear}-${evidence.currentCycle.endYear} age ${evidence.currentCycle.startAge}-${evidence.currentCycle.endAge}`,
);
writeLine(`ganji: ${evidence.currentCycle.ganji}`);
writeLine(`ten god: ${evidence.majorTenGod.stemTenGod}`);
writeLine(`cycle basis: ${evidence.majorCycleBasis.displayLabel}`);
writeLine(`cycle position: ${evidence.cyclePosition.positionLabel}`);
writeLine(`cycle progress: ${evidence.cyclePosition.progressLabel}`);
writeLine(
  `elements: ${evidence.currentCycle.stemElement}/${evidence.currentCycle.branchElement}`,
);
writeLine(`calculation basis: ${evidence.calculationBasis.displayLabel}`);
writeLine(`basis note: ${evidence.calculationBasis.note}`);
writeLine(`cycle year timeline: ${evidence.cycleYearTimeline.length}`);
writeLine(`major fortune timeline rows: ${evidence.majorFortuneTimelineRows.length}`);
writeLine(`decade archetype: ${evidence.decadeArchetype.label}`);
writeLine(`myeongli layers: ten-god/element/branch/hidden-stem/auxiliary-stars`);
writeLine(`hidden stems: ${evidence.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems.join(", ")}`);
writeList("fills missing", evidence.elementEffect.fillsMissing);
writeList("overloads heavy", evidence.elementEffect.overloadsHeavy);
writeList(
  "branch interactions",
  evidence.branchInteractions.map(
    (interaction) =>
      `${interaction.type} ${interaction.branches.join("")}: ${interaction.plain}`,
  ),
);
writeList(
  "life area signals",
  evidence.lifeAreaSignals.map(
    (signal) => `${signal.type} ${signal.strength}: ${signal.plain}`,
  ),
);
writeList(
  "difficulty signals",
  evidence.difficultySignals.map(
    (signal) => `${signal.type} ${signal.strength}: ${signal.plain}`,
  ),
);
writeList(
  "opportunity signals",
  evidence.opportunitySignals.map(
    (signal) => `${signal.type} ${signal.strength}: ${signal.plain}`,
  ),
);
writeList(
  "strong years within cycle",
  evidence.strongYearsWithinCycle.map(
    (year) =>
      `${year.year} ${year.ganji}: ${year.whyStrong} / push ${year.pushStrategy} / reduce ${year.reduceStrategy}`,
  ),
);
writeList(
  "compact daeun seun timeline",
  evidence.majorFortuneTimelineRows.map(
    (row) =>
      `${row.year} major ${row.majorGanji} annual ${row.annualGanji} ${row.badges.join(",")}: ${row.oneLine} / ${row.strategy}`,
  ),
);
writeList(
  "10-year timeline",
  evidence.cycleYearTimeline.map(
    (year) =>
      `${year.year} ${year.ganji} ${year.yearIndexInCycle}년차: ${year.strategicFocus} / ${year.whyItMatters}`,
  ),
);
writeList(
  "strategic themes",
  evidence.strategicThemes.map((theme) => `${theme.label}: ${theme.strategy}`),
);
writeList("long range risks", evidence.longRangeRisks.map((risk) => risk.prevention));
writeList(
  "long range opportunities",
  evidence.longRangeOpportunities.map((opportunity) => opportunity.action),
);
writeList("relationship hints", evidence.relationshipStatusTranslationHints);
writeList("warnings", evidence.warnings);
