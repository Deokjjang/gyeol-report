import type { ComprehensivePlanInputs, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { FusionCandidate } from "./fusionCore";
import type { MbtiSourceDomain } from "./mbtiSemanticCore";
import type { NarrativeMemory } from "./narrativeCore";
import { mbtiHumanBehavior } from "./narrativeHumanOutcome";

export const MBTI_REASON_FAMILIES = ["MR01", "MR02", "MR03", "MR04", "MR05", "MR06"] as const;
const general: MbtiSourceDomain[] = ["IDENTITY", "STRENGTHS", "THINKING", "COMMUNICATION", "RELATIONSHIPS"];
export function visibleMbtiDomainRank(domain: MbtiSourceDomain | null, section: ComprehensiveSectionId, context: string): number {
  if (!domain || ["PARENTS", "CHILDREN", "RELATIONSHIP_PAIR", "MYEONGLI_BRIDGE_HINT", "RECOMMENDED_JOBS", "AVOID_JOBS_OR_ENVIRONMENTS"].includes(domain)) return -1;
  const exact: MbtiSourceDomain[] = section === "C8" ? ["WORK", "CAREER", "MONEY", "INVESTMENT"]
    : section === "C7" ? ["RELATIONSHIPS", "COMMUNICATION", "LOVE", "MARRIAGE"]
    : section === "C9" ? ["RISKS", "GROWTH", "IDENTITY"]
    : context === "work" ? ["WORK", "CAREER"] : context === "learning" ? ["STUDY", "THINKING"]
    : context === "love" ? ["LOVE", "MARRIAGE"] : context === "social" ? ["RELATIONSHIPS", "COMMUNICATION"] : general;
  return exact.includes(domain) ? 30 : general.includes(domain) ? 20 : domain === "STUDY" ? 1 : 5;
}
/** Only actual nodes already supporting this Fusion are eligible. No type stereotype lookup. */
export function humanMbtiReason(i: ComprehensivePlanInputs, fusion: FusionCandidate, section: ComprehensiveSectionId, memory: NarrativeMemory) {
  const side = fusion.mbti.side;
  const nodes = i.mbti.sourceNodes.filter(n => fusion.mbti.sourceNodeIds.includes(n.id) && n.classification === "SCORING_SEMANTIC"
    && visibleMbtiDomainRank(n.sourceDomain, section, fusion.primaryContext) >= 0
    && i.mbti.annotations.some(a => a.sourceNodeId === n.id && a.annotationConfidence !== "REFERENCE_ONLY"
      && (a.axes[side.axis] ?? 0) * side.direction > 0));
  nodes.sort((a, b) => visibleMbtiDomainRank(b.sourceDomain, section, fusion.primaryContext) - visibleMbtiDomainRank(a.sourceDomain, section, fusion.primaryContext) || a.id.localeCompare(b.id));
  const node = nodes[0], action = mbtiHumanBehavior(side.axis, side.direction);
  if (!node || !action) return undefined;
  const type = i.mbti.mbtiType;
  const forms = fusion.type==="TENSION" ? [
    `${type} 쪽에서는 ${action}`,
    `${type}에서 보이는 다른 면은 이렇죠: ${action}`,
    `반면 ${type}의 행동을 보면 ${action}`,
    `${type}의 선택 방식에는 또 다른 모습이 있어요: ${action}`,
    `명리의 모습과 달리 ${type} 쪽에서는 ${action}`,
    `MBTI 쪽에서는 ${action}`,
  ] : fusion.type==="COMPLEMENT" ? [
    `${type}에서는 여기에 더해 ${action}`,
    `${type}의 행동이 이어지는 곳은 이쪽이죠: ${action}`,
    `이때 ${type} 쪽에서는 ${action}`,
    `${type}에서 함께 보이는 모습은 이렇습니다: ${action}`,
    `${type}의 선택 방식에서는 ${action}`,
    `MBTI에서 더해지는 모습도 있어요: ${action}`,
  ] : [
    `${type}에서도 ${action}`,
    `${type} 역시 ${action}`,
    `${type}의 행동에서도 비슷하게, ${action}`,
    `${type} 쪽에서 보이는 것도 이런 모습이죠: ${action}`,
    `${type}가 선택하는 방식도 닮아 있어요: ${action}`,
    `MBTI 쪽을 봐도 ${action}`,
  ];
  // One family per successive explicit reason; raw DB prose remains debug-only.
  const index = memory.usedExplicitMbtiMentions % forms.length;
  return { text: forms[index], nodeId: node.id, domain: node.sourceDomain, family: MBTI_REASON_FAMILIES[index], axis: side.axis, direction: side.direction };
}
