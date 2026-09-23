import type { LoveMarriageChildMbtiTraitEvidence, LoveMarriageChildReportEvidencePacket } from "./loveMarriageChildReportTypes";
import { getMbtiRelationshipPair, getMbtiSourceProfile, type MbtiRelationshipPair } from "./mbti/sourceRuntimeAdapter";
import { productBridgeScenes } from "./bridge/interactionScenes";

export const LOVE_RELATIONSHIP_QUESTIONS = {
  single: { label: "솔로", question: "나는 누구에게 끌리고, 누구와 오래 편할까?", scene: "첫 만남에서 생긴 호감과 반복해서 만날 때의 편안함을 따로 살핍니다.", action: "다음 만남에서는 설렌 순간과 편안했던 순간을 각각 하나씩 적어 보세요." },
  some: { label: "썸", question: "가까워지는 중, 나는 어떤 신호를 주고 놓칠까?", scene: "아직 합의되지 않은 관계에서 내 기대가 상대와의 약속보다 앞서가는지 확인합니다.", action: "추측한 마음 대신 다시 만나고 싶은 의사를 한 문장으로 전해 보세요." },
  dating: { label: "연애 중", question: "지금 관계에서 내가 반복하는 표현과 갈등은 무엇일까?", scene: "연락, 혼자 있는 시간, 서운함을 말하는 순서에서 내가 가져오는 습관을 읽습니다.", action: "최근 연락이나 약속에서 생긴 오해 한 장면을 골라 내 의도와 실제 표현을 비교해 보세요." },
  marriage_preparing: { label: "결혼 준비", question: "좋아하는 마음을 어떤 공동생활의 합의로 옮길까?", scene: "예식 준비와 함께 돈, 가사, 양가 일정, 개인 시간의 결정권을 미리 맞추는 단계입니다.", action: "결혼 준비 비용과 결혼 후 반복 지출을 별도 목록으로 나누어 이야기해 보세요." },
  married: { label: "기혼", question: "함께 사는 동안 무엇이 편안함과 피로를 쌓을까?", scene: "이미 굳어진 역할을 당연하게 두지 않고 돈, 집안일, 가족과의 거리, 회복 시간을 다시 살핍니다.", action: "이번 주에 보이지 않게 맡은 집안일과 결정 업무를 서로 적고 한 가지를 다시 나눠 보세요." },
  unknown: { label: "관계 상태 미입력", question: "나는 가까운 관계에 어떤 기준과 표현을 가져갈까?", scene: "현재 상대의 존재나 결혼 여부를 가정하지 않고 만남, 공동생활, 돌봄의 상황별 기준을 제시합니다.", action: "지금 내게 가까운 장면을 먼저 고르고, 실제로 겪은 반응과 다른 부분은 구분해 읽어 보세요." },
} as const;

export type LovePartnerExample = {
  readonly tier: "comfort" | "attraction" | "adjustment";
  readonly sourceType: string;
  readonly exampleType: string;
  readonly evidenceIds: readonly string[];
  readonly pair: MbtiRelationshipPair;
  readonly sajuCriterion: string;
};

/** Explicit source lists choose examples, never a compatibility score or an inferred partner. */
export function selectLoveRelationshipEvidence(packet: LoveMarriageChildReportEvidencePacket) {
  const status = packet.personContext.relationshipStatus ?? "unknown";
  const saju = packet.sajuBasis;
  const day = saju.fullPillars.find(p => p.key === "day");
  const month = saju.fullPillars.find(p => p.key === "month");
  const signals = [...saju.loveTenGodSignals].sort((a, b) => {
    const priority = (god: string) => god === day?.branchTenGod ? 0 : god === month?.branchTenGod ? 1 : 2;
    return priority(a.tenGod) - priority(b.tenGod);
  });
  const source = getMbtiSourceProfile(packet.personContext.mbtiType);
  const criterion = signals[0];
  const recoveryTraits = packet.mbtiBasis.growth.filter(trait =>
    source?.traits?.growth?.some(t => t.id === trait.id && t.productDomains?.some(domain => ["love", "marriage", "parenting", "compatibility"].includes(domain))));
  const partnerExamples: LovePartnerExample[] = [];
  const used = new Set<string>();
  const add = (tier: LovePartnerExample["tier"], candidates: readonly string[]) => {
    if (!source || !criterion) return;
    for (const type of candidates) {
      if (used.has(type)) continue;
      const pair = getMbtiRelationshipPair(source.type, type);
      if (!pair?.lovePattern || !pair.marriagePattern || !pair.friction.length || !pair.repairStrategy.length) continue;
      used.add(type);
      partnerExamples.push({ tier, sourceType: source.type, exampleType: pair.withType, pair,
        sajuCriterion: `${criterion.label}: ${criterion.plain}`,
        evidenceIds: [`saju:tenGod:${criterion.tenGod}`, `mbti:${source.type}:relationshipHints:${tier === "adjustment" ? "challengingTypes" : "comfortableTypes"}`, `mbti:${source.type}:notablePairs:${pair.withType}`] });
      return;
    }
  };
  add("comfort", source?.relationshipHints?.comfortableTypes ?? []);
  add("attraction", source?.relationshipHints?.comfortableTypes ?? []);
  add("adjustment", source?.relationshipHints?.challengingTypes ?? []);
  return {
    status, ...LOVE_RELATIONSHIP_QUESTIONS[status],
    // Presence is not strength. Order only prioritizes the known day/month branch context.
    tenGods: signals,
    recoveryTraits,
    factIds: [...new Set([
      `saju:dayPillar:${saju.dayPillar}`, `saju:spousePalace:${saju.dayBranch}`,
      ...signals.map(s => `saju:tenGod:${s.tenGod}`),
      ...[...saju.attractionSignals, ...saju.conflictSignals, ...saju.supportSignals, ...saju.relationInteractionSignals].map(s => `saju:signal:${s.label}`),
    ])],
    traitIds: Object.entries(packet.mbtiBasis).flatMap(([key, items]) => {
      const areas: Record<string, string> = { loveTraits: "love", marriageTraits: "marriage", parentingTraits: "parenting", childRoleTraits: "child", relationshipTraits: "relationships", communicationTraits: "communication", risks: "risks", growth: "growth" };
      const usedCounts: Record<string, number> = { loveTraits: 4, marriageTraits: 3, parentingTraits: 4, relationshipTraits: 4, communicationTraits: 3, growth: 3 };
      if (!usedCounts[key] || !source) return [];
      return (key === "growth" ? recoveryTraits : items as readonly LoveMarriageChildMbtiTraitEvidence[]).slice(0, usedCounts[key]).flatMap(item => item.id ? [`mbti:${source.type}:traits:${areas[key]}:${item.id}`] : []);
    }),
    partnerExamples: status === "single" || status === "some" ? partnerExamples : [],
    scenes: productBridgeScenes(packet.bridgeEvidence),
  };
}
export type LoveRelationshipSelection = ReturnType<typeof selectLoveRelationshipEvidence>;
