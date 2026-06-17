import { buildCompatibilityMbtiBridge } from "./compatibilityMbtiBridge";
import type { CompatibilityMbtiBridgeResult } from "./compatibilityMbtiBridge";
import { buildCompatibilitySajuBridge } from "./compatibilitySajuBridge";
import type { CompatibilitySajuBridgeResult } from "./compatibilitySajuBridge";
import type { CompatibilityDeepSajuBridgeResult } from "./compatibilityDeepSajuBridge";
import { scoreCompatibility } from "./compatibilityScoreEngine";
import {
  requireCompatibilityFixture,
  type CompatibilityFixture,
} from "./compatibilityFixtureMatrix";
import type {
  CompatibilityEvidenceItem,
  CompatibilityEvidenceSection,
  CompatibilityInput,
  CompatibilityPersonChartSummary,
  CompatibilityPersonInput,
  CompatibilityPillars,
  CompatibilityScoreResult,
} from "./compatibilityTypes";
import { isMbtiTypeCode } from "./mbtiTypeKnowledgeBase";
import {
  getSajuFeatureDisplayPolicy,
  shouldShowFeatureInNarrative,
} from "./sajuFeatureDisplayPolicy";
import { mapComputedSajuFactsToFeatureIds } from "./sajuComputedFactsMapper";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";

export type BuildCompatibilityEvidenceInput = {
  readonly input: CompatibilityInput;
  readonly personASajuFacts: ComputedSajuFacts;
  readonly personBSajuFacts: ComputedSajuFacts;
  readonly expectedPillars?: {
    readonly personA: CompatibilityPillars;
    readonly personB: CompatibilityPillars;
  };
};

export type CompatibilityEvidencePacket = {
  readonly input: CompatibilityInput;
  readonly personAChartSummary: CompatibilityPersonChartSummary;
  readonly personBChartSummary: CompatibilityPersonChartSummary;
  readonly sajuBridge: CompatibilitySajuBridgeResult;
  readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult;
  readonly mbtiBridge: CompatibilityMbtiBridgeResult;
  readonly score: CompatibilityScoreResult;
  readonly evidenceBySection: Record<
    CompatibilityEvidenceSection,
    readonly CompatibilityEvidenceItem[]
  >;
  readonly warnings: readonly string[];
};

const compatibilitySections = [
  "overview",
  "two_charts",
  "attraction",
  "strengths",
  "frictions",
  "communication",
  "relationship_scenes",
  "long_term",
  "money_lifestyle",
  "conflict_recovery",
  "final_advice",
] as const satisfies readonly CompatibilityEvidenceSection[];

function toPillars(
  facts: ComputedSajuFacts,
  expected?: CompatibilityPillars,
): CompatibilityPillars {
  return {
    year: expected?.year ?? facts.yearPillar ?? "-",
    month: expected?.month ?? facts.monthPillar ?? "-",
    day: expected?.day ?? facts.dayPillar ?? "-",
    hour: expected?.hour ?? facts.hourPillar,
  };
}

function normalizeMbti(value: string | null | undefined): CompatibilityPersonChartSummary["mbti"] {
  if (value === undefined || value === null) {
    return undefined;
  }

  const upper = value.toUpperCase();
  return isMbtiTypeCode(upper) ? upper : undefined;
}

function buildChartSummary(input: {
  readonly person: CompatibilityPersonInput;
  readonly facts: ComputedSajuFacts;
  readonly expectedPillars?: CompatibilityPillars;
}): CompatibilityPersonChartSummary {
  const mapped = mapComputedSajuFactsToFeatureIds(input.facts);
  const visibleFeatures = mapped.featureIds
    .map((featureId) => ({
      featureId,
      entry: requireSajuFeatureEntry(featureId),
    }))
    .filter(({ featureId }) => shouldShowFeatureInNarrative(featureId));
  const diagnosticFeatureLabels = mapped.featureIds
    .map((featureId) => ({
      featureId,
      entry: requireSajuFeatureEntry(featureId),
    }))
    .filter(
      ({ featureId }) =>
        getSajuFeatureDisplayPolicy(featureId)?.visibility === "diagnostic",
    )
    .map(({ entry }) => entry.labelKo);

  return {
    role: input.person.role,
    displayName: input.person.displayName,
    mbti: normalizeMbti(input.person.mbti),
    birthTimeConfidence: input.person.birthTimeKnown ? "known" : "unknown",
    pillars: toPillars(input.facts, input.expectedPillars),
    dayMaster: input.facts.dayMaster,
    dayPillar: input.facts.dayPillar,
    featureIds: visibleFeatures.map(({ featureId }) => featureId),
    featureLabels: visibleFeatures.map(({ entry }) => entry.labelKo),
    diagnosticFeatureLabels,
    sajuFacts: input.facts,
  };
}

function buildWarnings(input: {
  readonly compatibilityInput: CompatibilityInput;
  readonly personA: CompatibilityPersonChartSummary;
  readonly personB: CompatibilityPersonChartSummary;
}): readonly string[] {
  const warnings: string[] = [];

  if (!input.compatibilityInput.personA.birthTimeKnown) {
    warnings.push("personA birth time unknown");
  }
  if (!input.compatibilityInput.personB.birthTimeKnown) {
    warnings.push("personB birth time unknown");
  }
  if (input.personA.mbti === undefined) {
    warnings.push("personA MBTI missing");
  }
  if (input.personB.mbti === undefined) {
    warnings.push("personB MBTI missing");
  }
  if (
    input.personA.diagnosticFeatureLabels.length > 0 ||
    input.personB.diagnosticFeatureLabels.length > 0
  ) {
    warnings.push("diagnostic features excluded");
  }

  return warnings.length === 0 ? ["none"] : warnings;
}

function groupEvidenceBySection(
  items: readonly CompatibilityEvidenceItem[],
): Record<CompatibilityEvidenceSection, readonly CompatibilityEvidenceItem[]> {
  const grouped: Record<CompatibilityEvidenceSection, readonly CompatibilityEvidenceItem[]> = {
    overview: [],
    two_charts: [],
    attraction: [],
    strengths: [],
    frictions: [],
    communication: [],
    relationship_scenes: [],
    long_term: [],
    money_lifestyle: [],
    conflict_recovery: [],
    final_advice: [],
  };

  for (const section of compatibilitySections) {
    grouped[section] = items.filter((item) => item.section === section);
  }

  return grouped;
}

export function buildCompatibilityEvidencePacket(
  input: BuildCompatibilityEvidenceInput,
): CompatibilityEvidencePacket {
  const personAChartSummary = buildChartSummary({
    person: input.input.personA,
    facts: input.personASajuFacts,
    expectedPillars: input.expectedPillars?.personA,
  });
  const personBChartSummary = buildChartSummary({
    person: input.input.personB,
    facts: input.personBSajuFacts,
    expectedPillars: input.expectedPillars?.personB,
  });
  const sajuBridge = buildCompatibilitySajuBridge({
    personA: personAChartSummary,
    personB: personBChartSummary,
  });
  const mbtiBridge = buildCompatibilityMbtiBridge({
    personA: input.input.personA,
    personB: input.input.personB,
  });
  const deepSajuBridge = sajuBridge.deepSajuBridge;
  const score: CompatibilityScoreResult = scoreCompatibility({
    sajuBridge,
    deepSajuBridge,
    mbtiBridge,
    relationshipType: input.input.relationshipType,
    birthTimeConfidence: {
      personA: personAChartSummary.birthTimeConfidence,
      personB: personBChartSummary.birthTimeConfidence,
    },
  });
  const evidenceItems = [...sajuBridge.evidenceItems, ...mbtiBridge.evidenceItems];

  return {
    input: input.input,
    personAChartSummary,
    personBChartSummary,
    sajuBridge,
    deepSajuBridge,
    mbtiBridge,
    score,
    evidenceBySection: groupEvidenceBySection(evidenceItems),
    warnings: buildWarnings({
      compatibilityInput: input.input,
      personA: personAChartSummary,
      personB: personBChartSummary,
    }),
  };
}

export function buildCompatibilityEvidencePacketFromFixture(
  fixture: CompatibilityFixture,
): CompatibilityEvidencePacket {
  return buildCompatibilityEvidencePacket({
    input: fixture.input,
    personASajuFacts: fixture.personASajuFacts,
    personBSajuFacts: fixture.personBSajuFacts,
    expectedPillars: fixture.expectedPillars,
  });
}

export function buildCompatibilityEvidencePacketFromFixtureId(
  fixtureId: string,
): CompatibilityEvidencePacket {
  return buildCompatibilityEvidencePacketFromFixture(
    requireCompatibilityFixture(fixtureId),
  );
}
