import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import { auditReportDistinctiveness } from "../src/lib/report-knowledge/reportDistinctivenessAudit";
import {
  getReportSmokeFixture,
  type ReportQualityFixture,
  type ReportSmokeFixtureId,
} from "../src/lib/report-knowledge/reportQualityFixtureMatrix";

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function getFixtureValues(argv: readonly string[]): readonly string[] {
  const fixtureFlagIndex = argv.findIndex((value) => value === "--fixtures");
  const inlineFixtureArg = argv.find((value) => value.startsWith("--fixtures="));

  if (inlineFixtureArg !== undefined) {
    return inlineFixtureArg
      .split("=")[1]
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }
  if (fixtureFlagIndex === -1) {
    return ["deokmin", "sodam-intp"];
  }

  const values: string[] = [];

  for (const value of argv.slice(fixtureFlagIndex + 1)) {
    if (value.startsWith("--")) {
      break;
    }
    values.push(
      ...value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  }

  return values.length === 0 ? ["deokmin", "sodam-intp"] : values;
}

function normalizeFixtureId(value: string): ReportSmokeFixtureId {
  if (value === "deokmin" || value === "deokmin-external-manse") {
    return "deokmin";
  }
  if (value === "sodam-intp" || value === "default") {
    return value;
  }

  return "default";
}

function getFixtures(argv: readonly string[]): readonly ReportQualityFixture[] {
  const fixtureIds = getFixtureValues(argv).slice(0, 2);

  return fixtureIds.map((fixtureId) =>
    getReportSmokeFixture(normalizeFixtureId(fixtureId)),
  );
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function buildFixtureComparisonInput(fixture: ReportQualityFixture): {
  readonly reportId: string;
  readonly text: string;
  readonly evidenceFeatures: readonly string[];
} {
  const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
    mbtiType: fixture.mbti,
    sajuFacts: fixture.sajuFacts,
  });
  const selectedFeatures =
    packet.selectedSajuFeatureEvidence?.flatMap((chapter) => chapter.features) ?? [];
  const evidenceFeatures = unique([
    ...selectedFeatures.flatMap((feature) => [feature.id, feature.labelKo]),
    ...(packet.sajuSignatureScenes?.flatMap((scene) => [
      ...scene.featureIds,
      ...scene.featureLabels,
    ]) ?? []),
  ]);
  const text = [
    packet.sajuSymbolicNickname?.title,
    packet.sajuSymbolicNickname?.subtitle,
    ...(packet.sajuFeatureSpotlight?.groups.flatMap((group) =>
      group.items.flatMap((item) => [
        item.labelKo,
        item.badge,
        item.shortMeaning,
        item.vividLine,
        item.practicalLine,
      ]),
    ) ?? []),
    ...(packet.sajuSignatureScenes?.flatMap((scene) => [
      scene.title,
      ...(scene.sceneLines ?? [scene.sceneLine]),
      scene.interpretationLine,
      scene.practicalLine,
    ]) ?? []),
    ...(packet.reportDifferentiationModules?.flatMap((module) =>
      module.items.flatMap((item) => [
        module.title,
        item.title,
        item.body,
        item.practicalLine ?? "",
      ]),
    ) ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join("\n");

  return {
    reportId: fixture.id,
    text,
    evidenceFeatures,
  };
}

function main(): void {
  const fixtures = getFixtures(process.argv.slice(2));
  const reports = fixtures.map(buildFixtureComparisonInput);
  const audit = auditReportDistinctiveness({ reports });
  const [left, right] = fixtures;
  const leftCommon = new Set(audit.commonEvidenceFeatures);
  const distinctLeft = unique(reports[0]?.evidenceFeatures ?? []).filter(
    (feature) => !leftCommon.has(feature),
  );
  const distinctRight = unique(reports[1]?.evidenceFeatures ?? []).filter(
    (feature) => !leftCommon.has(feature),
  );

  writeStatus("cross-report distinctiveness");
  writeStatus(
    `fixtures: ${left?.id ?? "none"} vs ${right?.id ?? "none"}`,
  );
  writeStatus("common evidence features:");
  for (const feature of audit.commonEvidenceFeatures.slice(0, 12)) {
    writeStatus(`- ${feature}`);
  }
  writeStatus("distinct features:");
  writeStatus(`${left?.id ?? "left"}: ${distinctLeft.slice(0, 12).join(", ") || "none"}`);
  writeStatus(`${right?.id ?? "right"}: ${distinctRight.slice(0, 12).join(", ") || "none"}`);
  writeStatus("risk:");
  for (const phrase of audit.repeatedAdvicePhrases) {
    writeStatus(`- shared advice: ${phrase}`);
  }
  for (const phrase of audit.suspiciousGenericOverlap) {
    writeStatus(`- suspicious generic overlap: ${phrase}`);
  }
  writeStatus(`similarity score: ${audit.similarityScore}`);
  writeStatus(`verdict: ${audit.verdict}`);
}

main();
