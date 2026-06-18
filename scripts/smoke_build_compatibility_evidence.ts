import {
  buildCompatibilityEvidencePacketFromFixture,
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityScoreDisplayLabels,
  requireCompatibilityFixture,
} from "../src/lib/report-knowledge";

const compatibilitySmokeFixtureIds = [
  "deokmin-sodam-love",
  "deokmin-sodam-marriage",
  "unknown-time-some",
  "friendship-mbti-known",
  "family-unknown-mbti",
  "business-work-partner-sample",
] as const;

const expectedDeepLayerSmokeHints = {
  "business-work-partner-sample": {
    dayMaster: "무토 -> 경금",
    crossTenGod: "식신/편인",
  },
  "family-unknown-mbti": {
    dayMaster: "계수 -> 무토",
    crossTenGod: "정관/정재",
  },
} as const;

function getFixtureId(argv: readonly string[]): string {
  const flagIndex = argv.findIndex((arg) => arg === "--fixture");
  const inline = argv.find((arg) => arg.startsWith("--fixture="));

  return inline?.split("=")[1] ?? (flagIndex >= 0 ? argv[flagIndex + 1] : undefined) ??
    compatibilitySmokeFixtureIds[0];
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

function writeDeepSajuLayers(
  notes: NonNullable<
    ReturnType<typeof buildCompatibilityEvidencePacketFromFixture>["deepSajuBridge"]
  >["notes"],
): void {
  type DeepSajuNote = (typeof notes)[number];
  const layerOrder: readonly DeepSajuNote["layer"][] = [
    "day_master_relation",
    "cross_ten_god",
    "element_complement",
    "combined_element_climate",
    "branch_trine",
    "branch_clash",
    "branch_harm",
    "spouse_palace",
    "month_rhythm",
    "hour_life_rhythm",
  ] as const;
  const getLayerOrderIndex = (layer: DeepSajuNote["layer"]): number => {
    const index = layerOrder.indexOf(layer);
    return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
  };

  writeLine("deep saju layers:");
  if (notes.length === 0) {
    writeLine("- none");
    return;
  }

  for (const note of [...notes].sort(
    (left, right) =>
      getLayerOrderIndex(left.layer) - getLayerOrderIndex(right.layer),
  )) {
    writeLine(`- ${note.layer}: ${note.relationLabel}`);
    writeLine(`  plain: ${note.plainKoreanSummary}`);
  }
}

function writeScoreLabels(
  labels: ReturnType<typeof getCompatibilityScoreDisplayLabels>,
): void {
  writeLine("score labels:");
  writeLine(`- ${labels.attraction}`);
  writeLine(`- ${labels.communication}`);
  writeLine(`- ${labels.lifestyleRhythm}`);
  writeLine(`- ${labels.conflictRecovery}`);
  writeLine(`- ${labels.longTermStability}`);
  writeLine(`- ${labels.growthComplement}`);
}

function writeExpectedDeepLayerHints(fixtureId: string): void {
  const hints =
    expectedDeepLayerSmokeHints[
      fixtureId as keyof typeof expectedDeepLayerSmokeHints
    ];

  if (hints === undefined) {
    return;
  }

  writeLine("expected deep layer hints:");
  writeLine(`- day_master_relation: ${hints.dayMaster}`);
  writeLine(`- cross_ten_god: ${hints.crossTenGod}`);
}

function main(): void {
  const fixture = requireCompatibilityFixture(getFixtureId(process.argv.slice(2)));
  const packet = buildCompatibilityEvidencePacketFromFixture(fixture);
  const scoreLabels = getCompatibilityScoreDisplayLabels(
    fixture.input.relationshipType,
  );

  writeLine(`compatibility fixture: ${fixture.id}`);
  writeLine(`relationship type: ${fixture.input.relationshipType}`);
  writeLine(
    `relationship label: ${getCompatibilityRelationshipTypeLabel(fixture.input.relationshipType)}`,
  );
  writeScoreLabels(scoreLabels);
  writeExpectedDeepLayerHints(fixture.id);
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
  writeDeepSajuLayers(packet.deepSajuBridge?.notes ?? []);
  writeLine("warnings:");
  for (const warning of packet.warnings) {
    writeLine(`- ${warning}`);
  }
}

main();
