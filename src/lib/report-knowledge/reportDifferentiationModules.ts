import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import type {
  SajuFeatureSpotlightItem,
  SajuFeatureSpotlightSection,
} from "./sajuFeatureSpotlight";
import type { SajuSignatureScene } from "./sajuSignatureSceneRules";

export type ReportDifferentiationModuleId =
  | "saju_weapon"
  | "saju_trap"
  | "daily_scene"
  | "switch_action"
  | "relationship_needs";

export type ReportDifferentiationModuleItem = {
  readonly title: string;
  readonly body: string;
  readonly practicalLine?: string;
  readonly sourceFeatureIds: readonly string[];
};

export type ReportDifferentiationModule = {
  readonly moduleId: ReportDifferentiationModuleId;
  readonly title:
    | "내 사주의 무기"
    | "반복되는 함정"
    | "찔리는 일상 장면"
    | "바꾸는 스위치"
    | "관계에서 봐야 할 조건";
  readonly items: readonly ReportDifferentiationModuleItem[];
};

const maxModules = 5;
const maxItemsPerModule = 3;

function uniqueById<T extends { readonly sourceFeatureIds: readonly string[] }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  const output: T[] = [];

  for (const item of items) {
    const key = item.sourceFeatureIds.join("|");

    if (key.length > 0 && !seen.has(key)) {
      output.push(item);
      seen.add(key);
    }
  }

  return output;
}

export function normalizeKoreanSentenceSpacing(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/([.!?。])\1+/g, "$1")
    .replace(/\s+([,.!?。])/g, "$1")
    .trim();
}

function asKoreanSentence(input: string): string {
  const normalized = normalizeKoreanSentenceSpacing(input);

  if (/[.!?。]$/.test(normalized)) {
    return normalized;
  }
  if (/(기운|구조|감각|흐름|패턴|장치)$/.test(normalized)) {
    return `${normalized}입니다.`;
  }

  return `${normalized}.`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function joinKoreanSentences(
  ...sentences: readonly (string | undefined)[]
): string {
  return normalizeKoreanSentenceSpacing(
    sentences
      .filter((sentence): sentence is string => sentence !== undefined)
      .map(asKoreanSentence)
      .join(" "),
  );
}

function removeRepeatedLabelPrefix(input: {
  readonly label: string;
  readonly text: string;
}): string {
  return input.text
    .replace(new RegExp(`^${escapeRegExp(input.label)}\\s*[은는:]\\s*`), "")
    .trim();
}

function collectSelectedFeatures(
  selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined,
): readonly SelectedSajuFeatureEvidenceItem[] {
  const byId = new Map<string, SelectedSajuFeatureEvidenceItem>();

  for (const chapter of selectedEvidence ?? []) {
    for (const feature of chapter.features) {
      const existing = byId.get(feature.id);

      if (existing === undefined || feature.score > existing.score) {
        byId.set(feature.id, feature);
      }
    }
  }

  return [...byId.values()].sort((left, right) => right.score - left.score);
}

function getSpotlightItems(
  spotlight: SajuFeatureSpotlightSection | undefined,
  groupIds: readonly string[],
): readonly SajuFeatureSpotlightItem[] {
  return (
    spotlight?.groups
      .filter((group) => groupIds.includes(group.groupId))
      .flatMap((group) => group.items) ?? []
  );
}

function toSpotlightModuleItem(
  item: SajuFeatureSpotlightItem,
): ReportDifferentiationModuleItem {
  return {
    title: item.labelKo,
    body: joinKoreanSentences(item.badge, item.shortMeaning),
    practicalLine: item.practicalLine,
    sourceFeatureIds: [item.featureId],
  };
}

function buildWeaponItems(input: {
  readonly selectedFeatures: readonly SelectedSajuFeatureEvidenceItem[];
  readonly spotlight?: SajuFeatureSpotlightSection;
}): readonly ReportDifferentiationModuleItem[] {
  const spotlightItems = getSpotlightItems(input.spotlight, [
    "good_fortune",
    "talent",
  ]).map(toSpotlightModuleItem);
  const fallbackItems = input.selectedFeatures
    .filter(
      (feature) =>
        feature.polarity === "positive" ||
        feature.topics.includes("work") ||
        feature.topics.includes("identity"),
    )
    .map((feature) => ({
      title: feature.labelKo,
      body: asKoreanSentence(
        removeRepeatedLabelPrefix({
          label: feature.labelKo,
          text: feature.summary,
        }),
      ),
      practicalLine: feature.practicalUse,
      sourceFeatureIds: [feature.id],
    }));

  return uniqueById([...spotlightItems, ...fallbackItems]).slice(0, maxItemsPerModule);
}

function buildTrapItems(input: {
  readonly selectedFeatures: readonly SelectedSajuFeatureEvidenceItem[];
  readonly spotlight?: SajuFeatureSpotlightSection;
}): readonly ReportDifferentiationModuleItem[] {
  const spotlightItems = getSpotlightItems(input.spotlight, [
    "caution",
    "balance",
  ]).map(toSpotlightModuleItem);
  const fallbackItems = input.selectedFeatures
    .filter(
      (feature) =>
        feature.polarity === "warning" ||
        feature.polarity === "mixed" ||
        feature.topics.includes("growth"),
    )
    .map((feature) => ({
      title: feature.labelKo,
      body: asKoreanSentence(
        removeRepeatedLabelPrefix({
          label: feature.labelKo,
          text: feature.cautionReading,
        }),
      ),
      practicalLine: feature.practicalUse,
      sourceFeatureIds: [feature.id],
    }));

  return uniqueById([...spotlightItems, ...fallbackItems]).slice(0, maxItemsPerModule);
}

function buildDailySceneItems(
  scenes: readonly SajuSignatureScene[] | undefined,
): readonly ReportDifferentiationModuleItem[] {
  return (scenes ?? [])
    .slice(0, maxItemsPerModule)
    .map((scene) => ({
      title: scene.title,
      body: asKoreanSentence(scene.sceneLines?.[0] ?? scene.sceneLine),
      practicalLine: scene.interpretationLine,
      sourceFeatureIds: scene.featureIds,
    }));
}

function buildSwitchActionItems(input: {
  readonly scenes?: readonly SajuSignatureScene[];
  readonly spotlight?: SajuFeatureSpotlightSection;
}): readonly ReportDifferentiationModuleItem[] {
  const sceneItems = (input.scenes ?? []).map((scene) => ({
    title: scene.title,
    body: asKoreanSentence(scene.practicalLine),
    sourceFeatureIds: scene.featureIds,
  }));
  const spotlightItems =
    input.spotlight?.groups.flatMap((group) =>
      group.items.map((item) => ({
        title: item.labelKo,
        body: asKoreanSentence(item.practicalLine),
        sourceFeatureIds: [item.featureId],
      })),
    ) ?? [];

  return uniqueById([...sceneItems, ...spotlightItems]).slice(0, maxItemsPerModule);
}

function buildRelationshipNeedItems(input: {
  readonly selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
  readonly mbtiType: MbtiType;
}): readonly ReportDifferentiationModuleItem[] {
  const loveFeatures =
    input.selectedEvidence
      ?.find((chapter) => chapter.chapterId === "love_relationships")
      ?.features.filter(
        (feature) =>
          feature.topics.includes("love") ||
          feature.topics.includes("relationship") ||
          feature.category === "element",
      ) ?? [];

  if (loveFeatures.length === 0) {
    return [];
  }

  return [
    {
      title: "관계 조건",
      body:
        `${input.mbtiType} 유형명 자체보다 감정 표현 속도, 약속 습관, 생활 리듬, 책임감이 중요합니다.`,
      practicalLine:
        "상대를 유형 목록으로 고르지 말고, 실제 대화 속도와 약속을 지키는 방식을 확인해야 합니다.",
      sourceFeatureIds: loveFeatures.slice(0, 3).map((feature) => feature.id),
    },
  ];
}

function createModule(
  moduleId: ReportDifferentiationModuleId,
  title: ReportDifferentiationModule["title"],
  items: readonly ReportDifferentiationModuleItem[],
): ReportDifferentiationModule | undefined {
  const cappedItems = items.slice(0, maxItemsPerModule);

  if (cappedItems.length === 0) {
    return undefined;
  }

  return {
    moduleId,
    title,
    items: cappedItems,
  };
}

export function buildReportDifferentiationModules(input: {
  readonly selectedSajuFeatureEvidence: readonly SelectedSajuFeatureEvidence[] | undefined;
  readonly sajuFeatureSpotlight?: SajuFeatureSpotlightSection;
  readonly sajuSignatureScenes?: readonly SajuSignatureScene[];
  readonly mbtiType: MbtiType;
}): readonly ReportDifferentiationModule[] {
  const selectedFeatures = collectSelectedFeatures(input.selectedSajuFeatureEvidence);
  const modules = [
    createModule(
      "saju_weapon",
      "내 사주의 무기",
      buildWeaponItems({
        selectedFeatures,
        spotlight: input.sajuFeatureSpotlight,
      }),
    ),
    createModule(
      "saju_trap",
      "반복되는 함정",
      buildTrapItems({
        selectedFeatures,
        spotlight: input.sajuFeatureSpotlight,
      }),
    ),
    createModule(
      "daily_scene",
      "찔리는 일상 장면",
      buildDailySceneItems(input.sajuSignatureScenes),
    ),
    createModule(
      "switch_action",
      "바꾸는 스위치",
      buildSwitchActionItems({
        scenes: input.sajuSignatureScenes,
        spotlight: input.sajuFeatureSpotlight,
      }),
    ),
    createModule(
      "relationship_needs",
      "관계에서 봐야 할 조건",
      buildRelationshipNeedItems({
        selectedEvidence: input.selectedSajuFeatureEvidence,
        mbtiType: input.mbtiType,
      }),
    ),
  ].filter((module): module is ReportDifferentiationModule => module !== undefined);

  return modules.slice(0, maxModules);
}
