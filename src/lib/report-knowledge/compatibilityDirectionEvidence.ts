import { createHash } from "node:crypto";
import { getMbtiRelationshipPair, getMbtiSourceProfile, type MbtiTraitArea } from "./mbti/sourceRuntimeAdapter";
import { getCrossTenGodRelation, getDayMasterElementRelation } from "./compatibilityRelationRules";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type { CompatibilityCanonicalRelationshipType, CompatibilityInput, CompatibilityPersonChartSummary, CompatibilityPersonInput } from "./compatibilityTypes";

// Identity excludes slot, partner, category and MBTI. It is an internal attribution key, not an access token.
function personProfile(person: CompatibilityPersonInput, chart: CompatibilityPersonChartSummary) {
  const personId = createHash("sha256").update(JSON.stringify([
    person.displayName, person.birthDate, person.birthTime ?? null, person.birthTimeKnown,
    person.calendarType, person.timezone, person.gender ?? null,
  ])).digest("hex").slice(0, 24);
  const source = getMbtiSourceProfile(chart.mbti);
  const areas = ["communication", "relationships", "thinkingStyle", "love", "marriage", "workplace", "money", "growth"] as const;
  const traits = areas.flatMap((area) => (source?.traits?.[area] ?? []).slice(0, 1).map((trait) => ({
    evidenceId: `${personId}:mbti:${source!.type}:${area}:${trait.id ?? "primary"}`,
    area, label: trait.label ?? "", reading: trait.plainKo ?? "",
    positive: trait.positiveUse ?? "", risk: trait.risk ?? "",
  }))).filter((trait) => trait.reading.length > 0);
  const natal = chart.featureIds.map(requireSajuFeatureEntry)
    .filter((entry) => entry.topics.some((topic) => ["relationship", "love", "personality", "family"].includes(topic)))
    .map((entry) => ({ evidenceId: `${personId}:saju:${entry.id}`, featureId: entry.id,
      label: entry.labelKo, reading: entry.summary, positive: entry.positiveReading,
      risk: entry.cautionReading, practical: entry.practicalUse }));
  return { personId, name: person.displayName, mbti: chart.mbti ?? null,
    dayMaster: chart.dayMaster, dayPillar: chart.dayPillar, pillars: chart.pillars,
    elementCounts: chart.sajuFacts.fiveElementCounts, natal, traits,
    preferenceAxes: source?.preferenceAxes ?? null, functionStack: source?.functionStack ?? null,
    reportUseCases: source?.reportUseCases?.compatibilityReport ?? null };
}
export type CompatibilityPersonProfile = ReturnType<typeof personProfile>;

function direction(subject: CompatibilityPersonProfile, target: CompatibilityPersonProfile) {
  const pair = getMbtiRelationshipPair(subject.mbti, target.mbti);
  // "Influence from subject to target" uses TARGET as the ten-god viewer.
  const receivedTenGod = getCrossTenGodRelation({ viewerDayStem: target.dayMaster, targetDayStem: subject.dayMaster }) ?? null;
  const element = getDayMasterElementRelation(subject.dayMaster, target.dayMaster) ?? null;
  const subjectTrait = subject.traits.find((trait) => trait.area === "communication");
  const targetTrait = target.traits.find((trait) => trait.area === "relationships");
  const sourceRisk = subjectTrait?.risk || subject.natal[0]?.risk;
  const targetNeed = targetTrait?.reading || target.natal[0]?.positive;
  const sourceBasis = subjectTrait ? `${subject.mbti}의 ${subjectTrait.label}` : `${subject.dayPillar}와 ${subject.natal[0]?.label ?? "일간"}`;
  const targetBasis = targetTrait ? `${target.mbti}의 ${targetTrait.label}` : `${target.dayPillar}의 관계 해석`;
  const evidenceIds = [subjectTrait?.evidenceId ?? subject.natal[0]?.evidenceId,
    targetTrait?.evidenceId ?? target.natal[0]?.evidenceId].filter((id): id is string => Boolean(id));
  const relationId = `${subject.personId}:to:${target.personId}`;
  return {
    subjectPerson: subject.personId, targetPerson: target.personId, claimType: "fatigue" as const,
    evidenceIds, relationId, element, receivedTenGod,
    // A notablePairs entry is a SOURCE-TYPE viewpoint, not a list of claims all about its owner.
    // Keep type names and both viewpoints; never reinterpret "one side" as the source slot.
    mbtiPair: pair === null ? null : { sourceType: subject.mbti, targetType: target.mbti, evidenceId: `${relationId}:mbti-pair`, ...pair },
    fatigue: `${subject.name}님의 ${sourceBasis}에서 살펴볼 주의점은 “${sourceRisk ?? "자기 기준을 상대도 당연히 알 것이라 여기지 않는 것"}”입니다. ${target.name}님의 ${targetBasis}는 “${targetNeed ?? "자기 기준을 존중받을 때 관계를 조율하는 것"}”을 참고할 수 있습니다. 이 두 조건이 부딪히는 대화에서는 ${subject.name}님의 의도와 ${target.name}님이 받은 부담을 따로 확인해야 합니다. 성향 설명을 실제 행동의 단정으로 삼지는 않습니다.`,
  };
}

export function buildCompatibilityDirectionEvidence(input: CompatibilityInput, a: CompatibilityPersonChartSummary, b: CompatibilityPersonChartSummary, category: CompatibilityCanonicalRelationshipType) {
  const personA = personProfile(input.personA, a);
  const personB = personProfile(input.personB, b);
  return {
    persons: { personA, personB },
    aToB: direction(personA, personB), bToA: direction(personB, personA),
    categoryRole: {
      category,
      kind: category === "parentChild" || category === "managerReport" ? "role-asymmetric" as const : "symmetric" as const,
      // Current input collects two people but no parent/manager ownership. Do not infer it.
      assignments: { personA: null, personB: null },
    },
  };
}
export type CompatibilityDirectionEvidence = ReturnType<typeof buildCompatibilityDirectionEvidence>;

export function describeCompatibilityPerson(profile: CompatibilityPersonProfile, area: MbtiTraitArea, natalIndex = 0): string {
  const trait = profile.traits.find((item) => item.area === area);
  const natal = profile.natal[natalIndex] ?? profile.natal[0];
  return [
    trait ? `${profile.name}님의 ${profile.mbti} ${trait.label}: ${trait.reading}` : `${profile.name}님은 MBTI를 입력하지 않아 대화 성향을 유형으로 추정하지 않습니다.`,
    natal ? `${profile.name}님의 원국에서 확인한 ${natal.label}: ${natal.positive}` : `${profile.name}님의 ${profile.dayPillar}를 중심으로 실제 대화에서 반복되는 반응을 확인합니다.`,
  ].join(" ");
}

export const compatibilityCategoryScenes: Record<CompatibilityCanonicalRelationshipType, { scene: string; rule: string }> = {
  love: { scene: "만날 날짜를 정하거나 연락이 뜸해진 이유를 묻는 장면", rule: "친밀감을 확인하고 싶은 요청과 당장 가능한 연락 방식을 따로 이야기하세요." },
  marriage: { scene: "생활비와 가족 일정을 함께 조정하는 장면", rule: "공동 지출, 각자의 휴식, 가족 책임을 나누되 어느 한 사람의 성격만으로 담당을 정하지 마세요." },
  parentChild: { scene: "가족의 규칙과 개인의 선택 범위를 이야기하는 장면", rule: "부모 역할에서는 규칙의 이유와 선택권을 설명하고, 자녀 역할에서는 도움받고 싶은 범위와 혼자 해볼 일을 말하세요. 입력 순서만으로 누가 부모인지는 지정하지 않습니다." },
  coworker: { scene: "마감 전에 작업을 나누고 수정 의견을 주고받는 장면", rule: "분업 기준과 완료 조건을 합의하고 피드백은 동료의 성격이 아니라 작업물에 한정하세요." },
  managerReport: { scene: "업무 지시와 진행 보고의 기대치가 엇갈리는 장면", rule: "상사 역할에서는 평가 기준과 자율권을 먼저 설명하고, 부하 역할에서는 진행 상황과 막힌 조건을 보고하세요. 입력 순서로 직책을 판단하지 않습니다." },
  businessPartner: { scene: "추가 비용을 쓰거나 프로젝트를 멈출지 결정하는 장면", rule: "결정권, 손실 한도, 철수 조건을 먼저 합의하고 공격형과 안정형을 고정 배분하지 마세요." },
  friendship: { scene: "약속을 바꾸거나 한동안 연락 없이 지내는 장면", rule: "연락의 빈도와 신뢰를 동일시하지 말고 지키기 어려운 약속은 다시 합의하세요." },
};
