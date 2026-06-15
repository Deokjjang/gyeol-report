import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
  ComprehensiveReportEvidencePacket,
} from "./comprehensiveReportEvidenceTypes";
import { scoreSajuFeatures } from "./sajuFeatureScoring";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type { SajuFeatureChapterId } from "./sajuFeatureTypes";

const legacyFeatureIds = new Set([
  "day_pillar_gapsin",
  "element_earth_excess",
  "element_fire_missing",
  "element_water_missing",
  "ten_god_pian_cai",
  "ten_god_zheng_cai",
  "ten_god_qi_sha",
  "ten_god_zheng_guan",
  "structure_jaeda_sinyak",
  "structure_no_resource",
  "structure_no_output",
  "sinsal_hyeonchim",
  "sinsal_hongyeom",
  "sinsal_gwimun",
  "sinsal_wonjin",
  "gwiin_jaego",
]);

export type SafeSajuFeatureEvidenceDebugSummary = {
  readonly computedFeatureCount: number;
  readonly computedFeatureLabels: readonly string[];
  readonly selectedFeatureTotal: number;
  readonly selectedByChapter: readonly {
    readonly chapterId: SajuFeatureChapterId;
    readonly labels: readonly string[];
  }[];
  readonly excludedHighScoringFeatures: readonly {
    readonly labelKo: string;
    readonly reason: string;
  }[];
  readonly spotlightByGroup: readonly {
    readonly groupId: string;
    readonly title: string;
    readonly labels: readonly string[];
  }[];
  readonly signatureSceneTitles: readonly string[];
  readonly narrownessWarnings: readonly string[];
};

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getSelectedFeatures(
  selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined,
): readonly SelectedSajuFeatureEvidenceItem[] {
  return selectedEvidence?.flatMap((chapter) => chapter.features) ?? [];
}

function getComputedFeatureLabels(featureIds: readonly string[]): readonly string[] {
  return uniqueValues(
    featureIds.map((featureId) => requireSajuFeatureEntry(featureId).labelKo),
  );
}

function getExcludedHighScoringFeatures(input: {
  readonly computedFeatureIds: readonly string[];
  readonly selectedFeatureIds: ReadonlySet<string>;
}): SafeSajuFeatureEvidenceDebugSummary["excludedHighScoringFeatures"] {
  const excludedFeatureIds = input.computedFeatureIds.filter(
    (featureId) => !input.selectedFeatureIds.has(featureId),
  );

  return scoreSajuFeatures({
    featureIds: excludedFeatureIds,
    topic: "identity",
  })
    .slice(0, 8)
    .map((score) => ({
      labelKo: requireSajuFeatureEntry(score.featureId).labelKo,
      reason: "excluded by chapter cap or topic mismatch",
    }));
}

function getNarrownessWarnings(
  selectedFeatures: readonly SelectedSajuFeatureEvidenceItem[],
): readonly string[] {
  const warnings: string[] = [];
  const selectedFeatureIds = new Set(selectedFeatures.map((feature) => feature.id));

  if (!selectedFeatures.some((feature) => feature.category === "twelve_sinsal")) {
    warnings.push("selected evidence narrowness warning: no twelve_sinsal selected");
  }
  if (
    !selectedFeatures.some(
      (feature) => feature.category === "gwiin" && feature.id !== "gwiin_jaego",
    )
  ) {
    warnings.push(
      "selected evidence narrowness warning: no gwiin/gilshin beyond 재고귀인 selected",
    );
  }
  if ([...selectedFeatureIds].every((featureId) => legacyFeatureIds.has(featureId))) {
    warnings.push(
      "selected evidence narrowness warning: no newly extracted feature selected",
    );
  }

  return warnings;
}

export function buildSafeSajuFeatureEvidenceDebugSummary(input: {
  readonly computedFeatureIds: readonly string[];
  readonly selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
  readonly sajuFeatureSpotlight?: ComprehensiveReportEvidencePacket["sajuFeatureSpotlight"];
  readonly sajuSignatureScenes?: ComprehensiveReportEvidencePacket["sajuSignatureScenes"];
}): SafeSajuFeatureEvidenceDebugSummary {
  const selectedFeatures = getSelectedFeatures(input.selectedEvidence);
  const selectedFeatureIds = new Set(selectedFeatures.map((feature) => feature.id));

  return {
    computedFeatureCount: input.computedFeatureIds.length,
    computedFeatureLabels: getComputedFeatureLabels(input.computedFeatureIds),
    selectedFeatureTotal: selectedFeatures.length,
    selectedByChapter:
      input.selectedEvidence?.map((chapter) => ({
        chapterId: chapter.chapterId,
        labels: uniqueValues(chapter.features.map((feature) => feature.labelKo)),
      })) ?? [],
    excludedHighScoringFeatures: getExcludedHighScoringFeatures({
      computedFeatureIds: input.computedFeatureIds,
      selectedFeatureIds,
    }),
    spotlightByGroup:
      input.sajuFeatureSpotlight?.groups.map((group) => ({
        groupId: group.groupId,
        title: group.title,
        labels: group.items.map((item) => item.labelKo),
      })) ?? [],
    signatureSceneTitles:
      input.sajuSignatureScenes?.map((scene) => scene.title) ?? [],
    narrownessWarnings: getNarrownessWarnings(selectedFeatures),
  };
}

export function formatSafeSajuFeatureEvidenceDebugSummary(
  summary: SafeSajuFeatureEvidenceDebugSummary,
): readonly string[] {
  return [
    `computed saju feature ids: ${summary.computedFeatureCount}`,
    "computed saju feature labels:",
    ...summary.computedFeatureLabels.map((label) => `- ${label}`),
    `selected saju feature evidence total: ${summary.selectedFeatureTotal}`,
    "selected saju feature evidence by chapter:",
    ...summary.selectedByChapter.map(
      (chapter) => `${chapter.chapterId}: ${chapter.labels.join(", ")}`,
    ),
    "excluded high scoring features:",
    ...(summary.excludedHighScoringFeatures.length === 0
      ? ["- none"]
      : summary.excludedHighScoringFeatures.map(
          (feature) => `- ${feature.labelKo}: ${feature.reason}`,
        )),
    "saju feature spotlight:",
    ...(summary.spotlightByGroup.length === 0
      ? ["- none"]
      : summary.spotlightByGroup.map(
          (group) => `${group.groupId}: ${group.labels.join(", ")}`,
        )),
    "signature scenes:",
    ...(summary.signatureSceneTitles.length === 0
      ? ["- none"]
      : summary.signatureSceneTitles.map((title) => `- ${title}`)),
    ...summary.narrownessWarnings,
  ];
}
