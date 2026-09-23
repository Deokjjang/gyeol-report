import { buildBridgeInteractionScenes } from "./bridge/interactionScenes";
import { requireMbtiTypeKnowledge } from "./mbtiTypeKnowledgeBase";
import type { BridgeInteractionTrace } from "./bridge/factConditions";
import type {
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import type { MbtiProductType, SelectedMbtiKnowledge } from "./mbtiKnowledgeSelector";
import type { MbtiKnowledgeContext, MbtiTypeCode } from "./mbtiKnowledgeTypes";

export type SajuMbtiBridgeNeed =
  | "speed_control"
  | "emotional_temperature"
  | "support_request"
  | "structure_building"
  | "routine_recovery"
  | "expression_training"
  | "money_structure"
  | "relationship_boundary"
  | "analysis_to_action"
  | "execution_to_reflection"
  | "contextual_action";

export type SajuMbtiBridgeEvidence = {
  readonly interaction?: BridgeInteractionTrace;
  readonly strength?: string;
  readonly fatiguePoint?: string;
  readonly traitTopic?: MbtiKnowledgeContext;
  readonly chapterId:
    | "opening"
    | "saju_identity"
    | "personality_pattern"
    | "work_money_study"
    | "love_relationships"
    | "people_family_environment"
    | "risk_and_growth"
    | "final_message";
  readonly mbti: MbtiTypeCode;
  readonly traitId: string;
  readonly relatedSajuFeatureIds: readonly string[];
  readonly bridgeNeed: SajuMbtiBridgeNeed;
  readonly sentenceSeed: string;
  readonly sceneSeed: string;
  readonly practicalSwitch: string;
  readonly score: number;
};

type BridgeRule = {
  readonly requiredTraitId: string;
  readonly interactionType: BridgeInteractionTrace["interactionType"];
  readonly mbti: MbtiTypeCode;
  readonly requiredFeatureIds: readonly string[];
  readonly optionalFeatureIds?: readonly string[];
  readonly chapterId: SajuMbtiBridgeEvidence["chapterId"];
  readonly preferredContexts: readonly MbtiKnowledgeContext[];
  readonly preferredTags: readonly string[];
  readonly bridgeNeed: SajuMbtiBridgeNeed;
  readonly sentenceSeed: string;
  readonly sceneSeed: string;
  readonly practicalSwitch: string;
  readonly baseScore: number;
};

export type ScoreSajuMbtiBridgeInput = {
  readonly selectedMbtiKnowledge?: SelectedMbtiKnowledge;
  readonly selectedSajuFeatureEvidence?: readonly SelectedSajuFeatureEvidence[];
  readonly computedFeatureIds?: readonly string[];
  readonly computedFactIds?: readonly string[];
  readonly productType: MbtiProductType;
  readonly limit?: number;
};

const bridgeRules: readonly BridgeRule[] = [
  {
    mbti: "INTP",
    requiredFeatureIds: ["structure_no_resource"],
    requiredTraitId: "mbti_intp_core_identity_2",
    interactionType: "amplification",
    chapterId: "risk_and_growth",
    preferredContexts: ["core_identity", "stress", "growth"],
    preferredTags: ["support_request", "analysis_to_action"],
    bridgeNeed: "support_request",
    sentenceSeed:
      "무인성의 늦은 요청 감각과 INTP의 혼자 검토하는 습관이 겹치면, 도움받을 통로가 있어도 질문이 늦어질 수 있습니다.",
    sceneSeed:
      "질문하기 전에 혼자 자료를 찾아보고 한참 뒤에야 막힌 지점을 짧게 묻는 장면이 생길 수 있습니다.",
    practicalSwitch:
      "막힌 지점, 시도한 방법, 필요한 답을 세 줄로 적어 먼저 보내세요.",
    baseScore: 94,
  },
  {
    mbti: "INTP",
    requiredFeatureIds: ["gwiin_jaego"],
    requiredTraitId: "mbti_intp_money_1",
    interactionType: "agreement",
    chapterId: "work_money_study",
    preferredContexts: ["money", "study", "work"],
    preferredTags: ["money_structure", "analysis_to_action"],
    bridgeNeed: "money_structure",
    sentenceSeed:
      "재고귀인의 저장 감각과 INTP의 분류 성향이 만나면, 돈이나 자료를 감으로 굴리기보다 기록하고 나눌 때 안정감이 생깁니다.",
    sceneSeed:
      "돈이나 자료가 들어오면 크게 확장하기보다 먼저 기록하고 분류하고 새는 곳을 막고 싶어질 수 있습니다.",
    practicalSwitch:
      "예산, 저축, 자기계발비를 분리하고 자동 규칙을 먼저 걸어 두세요.",
    baseScore: 92,
  },
  {
    mbti: "INTP",
    requiredFeatureIds: ["day_pillar_jeongchuk"],
    optionalFeatureIds: ["ten_god_shi_shen", "gwiin_amrok", "sinsal_cheonmun"],
    requiredTraitId: "mbti_intp_core_identity_1",
    interactionType: "agreement",
    chapterId: "saju_identity",
    preferredContexts: ["core_identity", "communication", "study"],
    preferredTags: ["conditions", "logic", "analysis_to_action"],
    bridgeNeed: "analysis_to_action",
    sentenceSeed:
      "정축일주의 저장성과 INTP의 원리 검증 성향이 겹치면 밖으로 바로 밀어붙이기보다 안에서 구조를 먼저 완성하려는 흐름이 강해집니다.",
    sceneSeed:
      "설명은 아직 밖으로 하지 않았지만 머릿속에는 이미 구조도와 조건표가 생겨 있을 수 있습니다.",
    practicalSwitch:
      "생각을 끝까지 닫아 두기보다, 막힌 지점과 다음 질문을 한 문장으로 밖에 꺼내세요.",
    baseScore: 90,
  },
  {
    mbti: "ENTJ",
    requiredFeatureIds: ["sinsal_hyeonchim"],
    requiredTraitId: "mbti_entj_communication_2",
    interactionType: "amplification",
    chapterId: "personality_pattern",
    preferredContexts: ["communication", "decision", "growth"],
    preferredTags: ["speed_control", "communication"],
    bridgeNeed: "speed_control",
    sentenceSeed:
      "현침살의 예리함과 ENTJ의 빠른 결론 성향이 겹치면 핵심은 빨리 보이지만, 말이 평가처럼 들릴 수 있습니다.",
    sceneSeed:
      "사람들이 설명을 이어 갈 때 이미 다음 행동과 우선순위가 정리되는 장면이 생길 수 있습니다.",
    practicalSwitch:
      "지적할 자료와 요청할 다음 행동을 분리해서 말하고, 상대가 설명을 마칠 시간을 남겨 두세요.",
    baseScore: 94,
  },
  {
    mbti: "ENTJ",
    requiredFeatureIds: ["gwiin_jaego"],
    optionalFeatureIds: ["ten_god_pian_cai", "ten_god_zheng_cai", "gwiin_geumyeorok"],
    requiredTraitId: "mbti_entj_money_2",
    interactionType: "agreement",
    chapterId: "work_money_study",
    preferredContexts: ["money", "work", "decision"],
    preferredTags: ["money_structure", "structure_building"],
    bridgeNeed: "money_structure",
    sentenceSeed:
      "재고귀인의 자원 저장 감각과 ENTJ의 구조화 성향이 만나면, 기회가 보일 때 바로 확장하기보다 수익 구조와 방어 규칙을 먼저 정해야 힘이 납니다.",
    sceneSeed:
      "사업 아이디어를 들으면 가능성보다 실행 순서와 수익 모델을 먼저 보는 장면이 생깁니다.",
    practicalSwitch:
      "새 기회마다 수익 구조, 비용 구조, 손실 제한선을 같이 보세요.",
    baseScore: 92,
  },
  {
    mbti: "ENTJ",
    requiredFeatureIds: ["ten_god_qi_sha"],
    optionalFeatureIds: ["day_pillar_gapsin", "ten_god_zheng_guan"],
    requiredTraitId: "mbti_entj_work_1",
    interactionType: "expression",
    chapterId: "people_family_environment",
    preferredContexts: ["work", "family", "growth"],
    preferredTags: ["structure_building", "relationship_boundary"],
    bridgeNeed: "structure_building",
    sentenceSeed:
      "편관의 압박감과 ENTJ의 운영 감각이 만나면 흐린 역할을 오래 두기보다 기준과 책임선을 빨리 세우려는 쪽으로 드러납니다.",
    sceneSeed:
      "가족이나 팀 안에서 누가 무엇을 맡는지 흐리면 기준과 분담표를 만들고 싶어질 수 있습니다.",
    practicalSwitch:
      "가능한 도움과 불가능한 도움을 처음부터 나누세요.",
    baseScore: 88,
  },
];

function collectSelectedFeatureIds(
  selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined,
): readonly string[] {
  return (
    selectedEvidence?.flatMap((chapter) =>
      chapter.features.map((feature) => feature.id),
    ) ?? []
  );
}

function getFeatureScore(
  selectedEvidence: readonly SelectedSajuFeatureEvidence[] | undefined,
  featureId: string,
): number {
  const features =
    selectedEvidence?.flatMap((chapter) => chapter.features) ??
    ([] as SelectedSajuFeatureEvidenceItem[]);
  const feature = features.find((item) => item.id === featureId);

  return feature?.score ?? 0;
}

function selectTrait(input: {
  readonly knowledge: SelectedMbtiKnowledge;
  readonly rule: BridgeRule;
}): SelectedMbtiKnowledge["selectedTraits"][number] | undefined {
  if (!input.knowledge.selectedTraits.some((trait) => trait.id === input.rule.requiredTraitId)) return undefined;
  return requireMbtiTypeKnowledge(input.knowledge.mbti).traitSeeds.find((trait) => trait.id === input.rule.requiredTraitId);
}

export function scoreSajuMbtiBridgeEvidence(
  input: ScoreSajuMbtiBridgeInput,
): readonly SajuMbtiBridgeEvidence[] {
  if (
    input.selectedMbtiKnowledge === undefined ||
    input.productType === "yearly_flow" ||
    input.productType === "major_luck" ||
    input.productType === "date_selection"
  ) {
    return [];
  }

  const selectedFeatureIds = new Set(input.computedFeatureIds ?? collectSelectedFeatureIds(input.selectedSajuFeatureEvidence));
  const evidence: SajuMbtiBridgeEvidence[] = [];

  for (const rule of bridgeRules) {
    if (rule.mbti !== input.selectedMbtiKnowledge.mbti) {
      continue;
    }
    if (!rule.requiredFeatureIds.every((featureId) => selectedFeatureIds.has(featureId))) {
      continue;
    }

    const trait = selectTrait({
      knowledge: input.selectedMbtiKnowledge,
      rule,
    });

    if (trait === undefined) {
      continue;
    }

    const relatedFeatureIds = [
      ...rule.requiredFeatureIds,
      ...(rule.optionalFeatureIds?.filter((featureId) =>
        selectedFeatureIds.has(featureId),
      ) ?? []),
    ];
    const featureScore = relatedFeatureIds.reduce(
      (sum, featureId) =>
        sum + getFeatureScore(input.selectedSajuFeatureEvidence, featureId),
      0,
    );

    const ruleId = `scene:${rule.mbti}:${rule.requiredTraitId}:${rule.requiredFeatureIds.join("+")}`;
    evidence.push({
      interaction: {
        interactionId: ruleId, ruleId, interactionType: rule.interactionType,
        myeongliEvidenceIds: rule.requiredFeatureIds,
        mbtiEvidenceIds: [trait.id], contexts: [rule.chapterId], confidence: "inferred", intensity: "low",
      },
      chapterId: rule.chapterId,
      mbti: rule.mbti,
      traitId: trait.id,
      relatedSajuFeatureIds: relatedFeatureIds,
      bridgeNeed: rule.bridgeNeed,
      sentenceSeed: rule.sentenceSeed,
      sceneSeed: rule.sceneSeed,
      practicalSwitch: rule.practicalSwitch,
      score: Number((rule.baseScore + featureScore / 10).toFixed(2)),
    });
  }

  if (input.computedFactIds) {
    const scenes = buildBridgeInteractionScenes({ mbtiType: input.selectedMbtiKnowledge.mbti,
      factIds: new Set(input.computedFactIds), productContext: "general" });
    for (const scene of scenes) {
      const context = scene.contexts[0];
      const chapterId: SajuMbtiBridgeEvidence["chapterId"] = context === "identity" ? "personality_pattern"
        : ["career", "money", "study"].includes(context) ? "work_money_study"
        : ["love", "marriage"].includes(context) ? "love_relationships"
        : context === "family" ? "people_family_environment" : "risk_and_growth";
      const { interactionId, ruleId, interactionType, myeongliEvidenceIds, mbtiEvidenceIds, contexts, confidence, intensity } = scene;
      const sourceTopics: Readonly<Record<string, MbtiKnowledgeContext>> = {
        identity: "core_identity", thinkingStyle: "decision", career: "work", workplace: "work", money: "money", investment: "money",
        study: "study", love: "love", marriage: "family", parenting: "family", child: "family", relationships: "friendship",
        communication: "communication", strengths: "core_identity", risks: "stress", growth: "growth",
      };
      evidence.push({ traitTopic: sourceTopics[scene.mbtiBasis[0].area], interaction: { interactionId, ruleId, interactionType, myeongliEvidenceIds, mbtiEvidenceIds, contexts, confidence, intensity },
        chapterId, mbti: scene.mbtiType, traitId: scene.mbtiEvidenceIds[0], relatedSajuFeatureIds: scene.myeongliEvidenceIds,
        bridgeNeed: "contextual_action", sentenceSeed: scene.meaning, sceneSeed: scene.scene,
        practicalSwitch: scene.practice, strength: scene.strength, fatiguePoint: scene.risk,
        score: context === "identity" ? 95 : 87 });
    }
  }
  return evidence
    .sort((left, right) => right.score - left.score)
    .slice(0, input.limit ?? 8);
}
