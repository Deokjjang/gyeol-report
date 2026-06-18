import { buildAnnualFortuneEvidence } from "../src/lib/report-knowledge/annualFortuneEvidence";
import {
  ANNUAL_FORTUNE_FIXTURES,
  requireAnnualFortuneFixture,
} from "../src/lib/report-knowledge/annualFortuneFixtures";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ??
    (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    ANNUAL_FORTUNE_FIXTURES[0].id;
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function writeList(
  label: string,
  values: readonly string[],
  fallback = "none",
): void {
  writeLine(`${label}:`);
  if (values.length === 0) {
    writeLine(`- ${fallback}`);
    return;
  }

  for (const value of values) {
    writeLine(`- ${value}`);
  }
}

function main(): void {
  const fixture = requireAnnualFortuneFixture(getFixtureId(process.argv.slice(2)));
  const packet = buildAnnualFortuneEvidence({
    targetYear: fixture.targetYear,
    currentDate: new Date(`${fixture.currentDate}T00:00:00+09:00`),
    person: fixture.person,
  });
  const overloadSuffix = packet.elementEffect.plain.includes("간접")
    ? " indirect"
    : "";

  writeLine(`annual fortune fixture: ${fixture.id}`);
  writeLine(`target year: ${packet.targetYear}`);
  writeLine(`mode: ${packet.mode}`);
  writeLine(`selectable: ${packet.yearAccess.isSelectable ? "yes" : "no"}`);
  writeLine(`ganji: ${packet.annualGanji.ganji}`);
  writeLine(
    `year element: ${packet.annualGanji.stemElement}/${packet.annualGanji.branchElement}`,
  );
  writeLine(`day master: ${packet.dayMaster}`);
  writeLine(`annual ten god: ${packet.annualTenGod.stemTenGod}`);
  writeLine(
    `fills missing: ${packet.elementEffect.fillsMissing.join(", ") || "none"}`,
  );
  writeLine(
    `overloads heavy: ${packet.elementEffect.overloadsHeavy.join(", ") || "none"}${overloadSuffix}`,
  );
  writeList(
    "branch interactions",
    packet.branchInteractions.map(
      (interaction) =>
        `${interaction.type} ${interaction.branches.join("")}: ${interaction.plain}`,
    ),
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
  writeList("warnings", packet.warnings);
}

main();
