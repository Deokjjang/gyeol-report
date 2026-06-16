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

function includesTag(traits: readonly MbtiTraitSeed[], tag: string): boolean {
  return traits.some((trait) => trait.tags.includes(tag));
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

  if (
    (personAMbti === "ENTJ" && personBMbti === "INTP") ||
    (personAMbti === "INTP" && personBMbti === "ENTJ")
  ) {
    complementaryTraits.push("빠른 구조화와 깊은 원리 검토가 서로 보완될 수 있습니다.");
    frictionRisks.push(
      "한쪽은 결론과 실행을 빨리 보고, 다른 한쪽은 조건과 원리 검증이 끝나야 움직이므로 대화 속도 차이가 생길 수 있습니다.",
    );
    communicationNotes.push(
      "ENTJ 쪽은 역할과 기준을 빨리 잡고 싶고, INTP 쪽은 원리와 예외가 납득되어야 말이 편해집니다.",
    );
    conflictRecoveryNotes.push(
      "갈등이 생기면 결론을 밀기보다 조건을 정리할 시간과 다시 말할 시간을 분리해야 회복이 빨라집니다.",
    );
    evidenceItems.push(
      evidenceItem({
        title: "속도와 분석의 차이",
        summary:
          "ENTJ의 빠른 실행 감각과 INTP의 원리 검토 감각은 잘 쓰면 보완이지만, 대화 속도 규칙이 없으면 답답함이 커질 수 있습니다.",
        traits: [...personATraits, ...personBTraits],
        sceneSeeds: [
          "한 사람은 바로 정리하려 하고, 다른 사람은 조건과 예외를 더 확인한 뒤 움직이려는 장면",
        ],
        practicalSwitches: ["중요한 결정은 바로 결론, 하루 뒤 재검토처럼 두 단계로 나누세요."],
        scoreImpact: 2,
      }),
    );
  }

  if (includesTag(personATraits, "emotional_temperature") || includesTag(personBTraits, "emotional_temperature")) {
    frictionRisks.push("감정 표현 속도와 해결책 제안 타이밍이 다르면 위로가 평가처럼 들릴 수 있습니다.");
  }
  if (includesTag(personATraits, "relationship_boundary") || includesTag(personBTraits, "relationship_boundary")) {
    sharedTraits.push("관계에서도 각자의 경계와 혼자 정리할 시간을 존중해야 안정됩니다.");
  }

  if (evidenceItems.length === 0) {
    evidenceItems.push(
      evidenceItem({
        title: "입력 MBTI의 대화 리듬",
        summary:
          "두 사람의 MBTI는 공식 진단이 아니라 대화 속도와 갈등 회복 방식을 보는 보조 언어로만 사용합니다.",
        traits: [...personATraits.slice(0, 2), ...personBTraits.slice(0, 2)],
        sceneSeeds: [
          personATraits[0]?.sceneSeeds[0],
          personBTraits[0]?.sceneSeeds[0],
        ].filter((scene): scene is string => scene !== undefined),
        practicalSwitches: [
          personATraits[0]?.practicalSwitches[0],
          personBTraits[0]?.practicalSwitches[0],
        ].filter((item): item is string => item !== undefined),
        scoreImpact: 1,
      }),
    );
  }

  return {
    pairLabel: `${personAMbti} + ${personBMbti}`,
    sharedTraits,
    complementaryTraits,
    frictionRisks,
    communicationNotes,
    conflictRecoveryNotes,
    evidenceItems,
  };
}
