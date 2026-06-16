import {
  buildCompatibilityEvidencePacketFromFixture,
  requireCompatibilityFixture,
} from "../src/lib/report-knowledge";

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ?? (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    "deokmin-sodam-love";
}

function formatPillars(pillars: {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly hour?: string;
}): string {
  return `${pillars.year} ${pillars.month} ${pillars.day} ${pillars.hour ?? "-"}`;
}

function writeLine(line: string): void {
  process.stdout.write(`${line}\n`);
}

function main(): void {
  const fixture = requireCompatibilityFixture(getFixtureId(process.argv.slice(2)));
  const packet = buildCompatibilityEvidencePacketFromFixture(fixture);

  writeLine(`compatibility fixture: ${fixture.id}`);
  writeLine(`relationship type: ${fixture.input.relationshipType}`);
  writeLine(
    `person A: ${fixture.input.personA.displayName} ${fixture.input.personA.mbti ?? "MBTI unknown"}`,
  );
  writeLine(
    `person B: ${fixture.input.personB.displayName} ${fixture.input.personB.mbti ?? "MBTI unknown"}`,
  );
  writeLine(`A pillars: ${formatPillars(packet.personAChartSummary.pillars)}`);
  writeLine(`B pillars: ${formatPillars(packet.personBChartSummary.pillars)}`);
  writeLine(`score total: ${packet.score.totalScore}`);
  writeLine("breakdown:");
  writeLine(`- attraction: ${packet.score.breakdown.attraction}`);
  writeLine(`- communication: ${packet.score.breakdown.communication}`);
  writeLine(`- lifestyleRhythm: ${packet.score.breakdown.lifestyleRhythm}`);
  writeLine(`- conflictRecovery: ${packet.score.breakdown.conflictRecovery}`);
  writeLine(`- longTermStability: ${packet.score.breakdown.longTermStability}`);
  writeLine(`- growthComplement: ${packet.score.breakdown.growthComplement}`);
  writeLine("shared features:");
  for (const label of packet.sajuBridge.sharedFeatureLabels) {
    writeLine(`- ${label}`);
  }
  writeLine("warnings:");
  for (const warning of packet.warnings) {
    writeLine(`- ${warning}`);
  }
}

main();
