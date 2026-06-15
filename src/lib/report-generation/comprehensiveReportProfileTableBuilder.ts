import type { ComprehensiveReportEvidencePacket } from "../report-knowledge/comprehensiveReportEvidenceTypes";
import type { ComputedSajuFacts } from "../report-knowledge/sajuComputedFactsTypes";
import { buildSajuPillarGridColumns } from "../report-knowledge/sajuPillarFeaturePlacement";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import type { SajuFeatureCategory } from "../report-knowledge/sajuFeatureTypes";
import type { FiveElement, SajuKnowledgeEntry } from "../report-knowledge/sajuKnowledgeTypes";
import type {
  ComprehensiveReportV2PillarGridColumn,
  ComprehensiveReportV2ProfileTable,
} from "./comprehensiveReportDraftTypes";

const fiveElementOrder = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
] as const satisfies readonly FiveElement[];

const fiveElementLabelKo = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
} as const satisfies Record<FiveElement, string>;

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getSelectedSajuEntries(
  packet: ComprehensiveReportEvidencePacket,
): readonly SajuKnowledgeEntry[] {
  const selectedIds = new Set(packet.sajuEntryIds);

  return SAJU_KNOWLEDGE_BASE.filter((entry) => selectedIds.has(entry.id));
}

function labelsForCategory(
  entries: readonly SajuKnowledgeEntry[],
  category: SajuKnowledgeEntry["category"],
): readonly string[] {
  return uniqueValues(
    entries
      .filter((entry) => entry.category === category)
      .map((entry) => entry.labelKo),
  );
}

function labelsForFeatureCategory(input: {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly category: SajuFeatureCategory;
}): readonly string[] {
  return uniqueValues(
    input.packet.selectedSajuFeatureEvidence?.flatMap((chapter) =>
      chapter.features
        .filter((feature) => feature.category === input.category)
        .map((feature) => feature.labelKo),
    ) ?? [],
  );
}

function formatFiveElementCounts(
  facts: ComputedSajuFacts | undefined,
): readonly string[] | undefined {
  if (facts === undefined) {
    return undefined;
  }

  return fiveElementOrder.map(
    (element) => `${fiveElementLabelKo[element]} ${facts.fiveElementCounts[element]}`,
  );
}

function formatElementBalanceLabels(input: {
  readonly elements: readonly FiveElement[];
  readonly suffix: "과다" | "부족";
}): readonly string[] {
  return input.elements.map(
    (element) => `${fiveElementLabelKo[element]} ${input.suffix}`,
  );
}

function buildDayPillarKeywords(
  entries: readonly SajuKnowledgeEntry[],
): readonly string[] {
  const dayPillarEntry = entries.find((entry) => entry.category === "day_pillar");

  if (dayPillarEntry === undefined) {
    return [];
  }

  return uniqueValues([
    ...(dayPillarEntry.coreImageKo === undefined ? [] : [dayPillarEntry.coreImageKo]),
    ...(dayPillarEntry.dayPillarHints?.coreTension ?? []),
    ...(dayPillarEntry.dayPillarHints?.strength ?? []),
  ]).slice(0, 5);
}

function buildPillarGrid(input: {
  readonly yearPillar?: string;
  readonly monthPillar?: string;
  readonly dayPillar?: string;
  readonly hourPillar?: string;
  readonly dayMaster?: string;
  readonly featurePlacements?: ComprehensiveReportEvidencePacket["sajuPillarFeaturePlacements"];
}): readonly ComprehensiveReportV2PillarGridColumn[] {
  return buildSajuPillarGridColumns({
    yearPillar: input.yearPillar,
    monthPillar: input.monthPillar,
    dayPillar: input.dayPillar,
    hourPillar: input.hourPillar,
    dayMaster: input.dayMaster,
    featurePlacements: input.featurePlacements,
  });
}

export function buildComprehensiveReportV2ProfileTable(input: {
  readonly evidencePacket: ComprehensiveReportEvidencePacket;
  readonly mbtiType: string;
  readonly sajuFacts?: ComputedSajuFacts;
}): ComprehensiveReportV2ProfileTable {
  const entries = getSelectedSajuEntries(input.evidencePacket);
  const dayMaster = labelsForCategory(entries, "day_master")[0];
  const dayPillar = labelsForCategory(entries, "day_pillar")[0];
  const dayPillarKeywords = buildDayPillarKeywords(entries);
  const elementBalanceLabels = labelsForCategory(entries, "element_balance");
  const fiveElementSummary = formatFiveElementCounts(input.sajuFacts);
  const twelveSinsal = labelsForFeatureCategory({
    packet: input.evidencePacket,
    category: "twelve_sinsal",
  });
  const majorSinsal = labelsForFeatureCategory({
    packet: input.evidencePacket,
    category: "sinsal",
  });
  const gwiinGilshin = labelsForFeatureCategory({
    packet: input.evidencePacket,
    category: "gwiin",
  });
  const legacySinsal = labelsForCategory(entries, "sinsal");
  const legacyGwiin = labelsForCategory(entries, "nobleman");
  const yearPillar = input.sajuFacts?.yearPillar;
  const monthPillar = input.sajuFacts?.monthPillar;
  const hourPillar = input.sajuFacts?.hourPillar;
  const fourPillarGrid = buildPillarGrid({
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: input.sajuFacts?.dayMaster,
    featurePlacements: input.evidencePacket.sajuPillarFeaturePlacements,
  });

  return {
    ...(yearPillar === undefined ? {} : { yearPillar }),
    ...(monthPillar === undefined ? {} : { monthPillar }),
    ...(hourPillar === undefined ? {} : { hourPillar }),
    ...(dayPillar === undefined ? {} : { dayPillar }),
    fourPillarGrid,
    ...(dayMaster === undefined ? {} : { dayMaster }),
    ...(dayPillarKeywords.length === 0 ? {} : { dayPillarKeywords }),
    fiveElementSummary:
      fiveElementSummary ??
      uniqueValues([
        ...labelsForCategory(entries, "five_element"),
        ...elementBalanceLabels,
      ]),
    excessiveElements:
      input.sajuFacts === undefined
        ? elementBalanceLabels.filter(
            (label) => label.includes("과다") || label.includes("강"),
          )
        : formatElementBalanceLabels({
            elements: input.sajuFacts.excessiveElements,
            suffix: "과다",
          }),
    missingElements:
      input.sajuFacts === undefined
        ? elementBalanceLabels.filter((label) => label.includes("부족"))
        : formatElementBalanceLabels({
            elements: input.sajuFacts.missingElements,
            suffix: "부족",
          }),
    tenGodSummary: labelsForCategory(entries, "ten_god"),
    specialPatterns: labelsForCategory(entries, "special_pattern"),
    sinsal: uniqueValues([...legacySinsal, ...majorSinsal, ...twelveSinsal]),
    gwiin: uniqueValues([...legacyGwiin, ...gwiinGilshin]),
    ...(twelveSinsal.length === 0 ? {} : { twelveSinsal }),
    ...(majorSinsal.length === 0 ? {} : { majorSinsal }),
    ...(gwiinGilshin.length === 0 ? {} : { gwiinGilshin }),
    mbti: input.mbtiType,
  };
}
