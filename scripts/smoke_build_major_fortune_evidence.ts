import { buildMajorFortuneEvidence } from "../src/lib/report-knowledge/majorFortuneEvidence";
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

const fixture = requireMajorFortuneFixture(getFixtureId(process.argv.slice(2)));
const evidence = buildMajorFortuneEvidence({
  fixtureId: fixture.id,
  currentYear: fixture.currentYear,
  person: fixture.person,
});

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
