import { getMbtiRelationshipPair } from "./mbti/sourceRuntimeAdapter";
import type {
  CompatibilityEvidenceItem,
  CompatibilityPersonInput,
} from "./compatibilityTypes";
import { selectMbtiKnowledge } from "./mbtiKnowledgeSelector";
import { isMbtiTypeCode } from "./mbtiTypeKnowledgeBase";
import type { MbtiTraitSeed, MbtiTypeCode } from "./mbtiKnowledgeTypes";

export type CompatibilityMbtiBridgeResult = {
  readonly pairLabel: string;
  readonly sharedTraits: readonly string[];
  readonly complementaryTraits: readonly string[];
  readonly frictionRisks: readonly string[];
  readonly communicationNotes: readonly string[];
  readonly conflictRecoveryNotes: readonly string[];
  readonly evidenceItems: readonly CompatibilityEvidenceItem[];
};

type BuildCompatibilityMbtiBridgeInput = {
  readonly personA: CompatibilityPersonInput;
  readonly personB: CompatibilityPersonInput;
};

const compatibilityContexts = [
  "communication",
  "decision",
  "love",
  "friendship",
  "family",
  "conflict",
  "stress",
  "recovery",
  "growth",
  "compatibility",
] as const;

function normalizeMbti(value: string | null | undefined): MbtiTypeCode | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const upper = value.toUpperCase();
  return isMbtiTypeCode(upper) ? upper : undefined;
}

function selectTraits(mbti: MbtiTypeCode | undefined): readonly MbtiTraitSeed[] {
  if (mbti === undefined) {
    return [];
  }

  return (
    selectMbtiKnowledge({
      mbti,
      contexts: compatibilityContexts,
      maxTraitsPerContext: 1,
      productType: "compatibility",
    })?.selectedTraits ?? []
  );
}

function evidenceItem(input: {
  readonly title: string;
  readonly summary: string;
  readonly traits: readonly MbtiTraitSeed[];
  readonly sceneSeeds?: readonly string[];
  readonly practicalSwitches?: readonly string[];
  readonly scoreImpact: number;
}): CompatibilityEvidenceItem {
  return {
    section: "communication",
    title: input.title,
    summary: input.summary,
    personAFeatureIds: [],
    personBFeatureIds: [],
    mbtiTraitIds: input.traits.map((trait) => trait.id),
    sceneSeeds: input.sceneSeeds ?? [],
    practicalSwitches: input.practicalSwitches ?? [],
    scoreImpact: input.scoreImpact,
  };
}

export function buildCompatibilityMbtiBridge(
  input: BuildCompatibilityMbtiBridgeInput,
): CompatibilityMbtiBridgeResult {
  const personAMbti = normalizeMbti(input.personA.mbti);
  const personBMbti = normalizeMbti(input.personB.mbti);

  if (personAMbti === undefined && personBMbti === undefined) {
    return {
      pairLabel: "MBTI 미입력",
      sharedTraits: [],
      complementaryTraits: [],
      frictionRisks: [],
      communicationNotes: [],
      conflictRecoveryNotes: [],
      evidenceItems: [],
    };
  }

  const personATraits = selectTraits(personAMbti);
  const personBTraits = selectTraits(personBMbti);
  const evidenceItems: CompatibilityEvidenceItem[] = [];
  const sharedTraits: string[] = [];
  const complementaryTraits: string[] = [];
  const frictionRisks: string[] = [];
  const communicationNotes: string[] = [];
  const conflictRecoveryNotes: string[] = [];

  if (personAMbti === undefined || personBMbti === undefined) {
    communicationNotes.push(
      "한쪽 MBTI가 없어서 대화 속도와 표현 방식은 입력된 한 사람의 성향만 보조 참고로 봅니다.",
    );
    evidenceItems.push(
      evidenceItem({
        title: "MBTI 한쪽 미입력",
        summary:
          "궁합 v1.0은 MBTI가 없어도 사주 비교는 가능하지만, 대화 방식 해석의 확신도는 낮춥니다.",
        traits: [...personATraits, ...personBTraits],
        practicalSwitches: ["MBTI가 없는 쪽은 실제 대화 습관과 생활 리듬을 더 우선해서 보세요."],
        scoreImpact: -2,
      }),
    );

    return {
      pairLabel: `${personAMbti ?? "MBTI 미입력"} + ${personBMbti ?? "MBTI 미입력"}`,
      sharedTraits,
      complementaryTraits,
      frictionRisks,
      communicationNotes,
      conflictRecoveryNotes,
      evidenceItems,
    };
  }

  // Two views share the existing one-point evidence budget; source prose does not quantify pair quality.
  // Preserve both source-type viewpoints. A notablePairs paragraph may describe
  // either person: keep its type names rather than relabeling it as an A/B trait.
  for (const [sourceType, targetType, traits] of [
    [personAMbti, personBMbti, personATraits], [personBMbti, personAMbti, personBTraits],
  ] as const) {
    const pair = getMbtiRelationshipPair(sourceType, targetType);
    if (!pair) continue;
    const summary = pair.reportLine ?? pair.sharedGround[0] ?? "";
    sharedTraits.push(...pair.sharedGround.slice(0, 1));
    complementaryTraits.push(...pair.positiveInfluence.slice(0, 1));
    frictionRisks.push(...pair.friction.slice(0, 1));
    communicationNotes.push(`${sourceType}에서 ${targetType}를 바라보는 관계 자료: ${summary}`);
    conflictRecoveryNotes.push(...pair.repairStrategy.slice(0, 1));
    evidenceItems.push(evidenceItem({ title: `${sourceType} → ${targetType} 관계 관점`,
      summary, traits, sceneSeeds: pair.friction.slice(0, 1),
      practicalSwitches: pair.repairStrategy.slice(0, 2), scoreImpact: 0.5 }));
  }

  return {
    pairLabel: `${personAMbti} + ${personBMbti}`,
    sharedTraits: [...new Set(sharedTraits)].sort(),
    complementaryTraits: [...new Set(complementaryTraits)].sort(),
    frictionRisks: [...new Set(frictionRisks)].sort(),
    communicationNotes,
    conflictRecoveryNotes,
    evidenceItems,
  };
}
