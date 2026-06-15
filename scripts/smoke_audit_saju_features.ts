import {
  auditComputedSajuFeatures,
  calculateExternalManseParity,
  formatSajuFeatureAuditResult,
  getSajuAuditFixture,
} from "../src/lib/report-knowledge/sajuFeatureAudit";

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function getFixtureId(argv: readonly string[]): "default" | "deokmin" {
  const fixtureFlagIndex = argv.findIndex((value) => value === "--fixture");
  const fixtureValue =
    fixtureFlagIndex === -1 ? undefined : argv[fixtureFlagIndex + 1];

  if (fixtureValue === "deokmin") {
    return "deokmin";
  }

  return "default";
}

function main(): void {
  const fixture = getSajuAuditFixture(getFixtureId(process.argv.slice(2)));
  const audit = auditComputedSajuFeatures(fixture.input);
  const parity =
    fixture.fixtureId === "deokmin"
      ? calculateExternalManseParity(fixture)
      : undefined;

  for (const line of formatSajuFeatureAuditResult(audit, { fixture, parity })) {
    writeStatus(line);
  }
}

main();
