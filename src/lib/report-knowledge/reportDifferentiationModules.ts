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
import {
  joinKoreanSentences,
  removeRepeatedLeadingLabel,
} from "./koreanCopyUtils";
import { shouldShowFeatureInNarrative } from "./sajuFeatureDisplayPolicy";

export { joinKoreanSentences, normalizeKoreanSentenceSpacing } from "./koreanCopyUtils";

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

function asKoreanSentence(input: string): string {
  return joinKoreanSentences(input);
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

  return [...byId.values()]
    .filter((feature) => shouldShowFeatureInNarrative(feature.id))
    .sort((left, right) => right.score - left.score);
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
    body: joinKoreanSentences(
      removeRepeatedLeadingLabel(item.badge, item.labelKo),
    ),
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
        removeRepeatedLeadingLabel(feature.summary, feature.labelKo),
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
        removeRepeatedLeadingLabel(feature.cautionReading, feature.labelKo),
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
    .filter((scene) => scene.featureIds.every(shouldShowFeatureInNarrative))
    .slice(0, maxItemsPerModule)
    .map((scene) => ({
      title: scene.title,
      body: asKoreanSentence(scene.sceneLines?.[0] ?? scene.sceneLine),
      practicalLine: scene.interpretationLine,
      sourceFeatureIds: scene.featureIds,
    }));
}

function hasSelectedFeature(
  features: readonly SelectedSajuFeatureEvidenceItem[],
  featureId: string,
): boolean {
  return features.some((feature) => feature.id === featureId);
}

function buildContextualAdviceItems(input: {
  readonly selectedFeatures: readonly SelectedSajuFeatureEvidenceItem[];
  readonly mbtiType: MbtiType;
}): readonly ReportDifferentiationModuleItem[] {
  const items: ReportDifferentiationModuleItem[] = [];
  const hasJaego = hasSelectedFeature(input.selectedFeatures, "gwiin_jaego");
  const hasCheoneulNoResource =
    hasSelectedFeature(input.selectedFeatures, "gwiin_cheoneul") &&
    hasSelectedFeature(input.selectedFeatures, "structure_no_resource");
  const hasHyeonchim = hasSelectedFeature(input.selectedFeatures, "sinsal_hyeonchim");

  if (input.mbtiType === "ENTJ" && hasJaego) {
    items.push({
      title: "재고귀인",
      body: "사업, 프로젝트, 고객 기반, 반복 수익처럼 남는 구조를 먼저 보세요.",
      sourceFeatureIds: ["gwiin_jaego"],
    });
  }
  if (input.mbtiType === "INTP" && hasJaego) {
    items.push({
      title: "재고귀인",
      body: "기록, 예산 분류, 자동저축, 자료 정리처럼 조용히 쌓이는 구조가 잘 맞습니다.",
      sourceFeatureIds: ["gwiin_jaego"],
    });
  }

  if (input.mbtiType === "ENTJ" && hasCheoneulNoResource) {
    items.push({
      title: "천을귀인 + 무인성",
      body: "도움을 역할 단위로 요청하면 판이 빨리 풀립니다.",
      sourceFeatureIds: ["gwiin_cheoneul", "structure_no_resource"],
    });
  }
  if (input.mbtiType === "INTP" && hasCheoneulNoResource) {
    items.push({
      title: "천을귀인 + 무인성",
      body: "질문하기 전 혼자 너무 오래 검토하지 말고, 막힌 지점을 짧게 정리해 묻는 편이 좋습니다.",
      sourceFeatureIds: ["gwiin_cheoneul", "structure_no_resource"],
    });
  }

  if (input.mbtiType === "ENTJ" && hasHyeonchim) {
    items.push({
      title: "현침살",
      body: "바로 지적하기보다 역할과 기준을 먼저 확인하세요.",
      sourceFeatureIds: ["sinsal_hyeonchim"],
    });
  }
  if (input.mbtiType === "INTP" && hasHyeonchim) {
    items.push({
      title: "현침살",
      body: "논리 오류가 보여도 바로 말하기보다, 조건과 예외를 정리한 뒤 질문으로 꺼내세요.",
      sourceFeatureIds: ["sinsal_hyeonchim"],
    });
  }

  return items;
}

function buildSwitchActionItems(input: {
  readonly selectedFeatures: readonly SelectedSajuFeatureEvidenceItem[];
  readonly mbtiType: MbtiType;
  readonly scenes?: readonly SajuSignatureScene[];
  readonly spotlight?: SajuFeatureSpotlightSection;
}): readonly ReportDifferentiationModuleItem[] {
  const contextualItems = buildContextualAdviceItems({
    selectedFeatures: input.selectedFeatures,
    mbtiType: input.mbtiType,
  });
  const sceneItems = (input.scenes ?? [])
    .filter((scene) => scene.featureIds.every(shouldShowFeatureInNarrative))
    .map((scene) => ({
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

  return uniqueById([...contextualItems, ...sceneItems, ...spotlightItems]).slice(
    0,
    maxItemsPerModule,
  );
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
          shouldShowFeatureInNarrative(feature.id) &&
          (feature.topics.includes("love") ||
            feature.topics.includes("relationship") ||
            feature.category === "element"),
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
        selectedFeatures,
        mbtiType: input.mbtiType,
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
