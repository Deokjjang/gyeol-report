import {
  auditComputedSajuFeatures,
  calculateExternalManseParity,
  formatSajuFeatureAuditResult,
  getSajuAuditFixture,
} from "../src/lib/report-knowledge/sajuFeatureAudit";

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function getFixtureId(
  argv: readonly string[],
): "default" | "deokmin" | "sodam-intp" {
  const fixtureFlagIndex = argv.findIndex((value) => value === "--fixture");
  const inlineFixtureArg = argv.find((value) => value.startsWith("--fixture="));
  const fixtureValue =
    inlineFixtureArg?.split("=")[1] ??
    (fixtureFlagIndex === -1 ? undefined : argv[fixtureFlagIndex + 1]);

  if (fixtureValue === "deokmin") {
    return "deokmin";
  }
  if (fixtureValue === "sodam-intp") {
    return "sodam-intp";
  }

  return "default";
}

function main(): void {
  const fixture = getSajuAuditFixture(getFixtureId(process.argv.slice(2)));
  const audit = auditComputedSajuFeatures(fixture.input);
  const parity =
    fixture.birthDate !== undefined
      ? calculateExternalManseParity(fixture)
      : undefined;

  for (const line of formatSajuFeatureAuditResult(audit, { fixture, parity })) {
    writeStatus(line);
  }
}

main();
