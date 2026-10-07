import type { InterpretationContext, SemanticAxis } from "./semanticCore";
import { fusionUnique, type FusionConditionSplit, type FusionSide, type FusionSplitType, type FusionProof } from "./fusionCore";
import { fusionAxisMeaning } from "./fusionMeanings";
import { fusionProofsForAxis } from "./fusionProfileAdapter";

export type ResolvedFusionTension = { split: FusionConditionSplit; description: string };
/** Only typed contextual/axis evidence is inspected. No source-text keywords,
 * type stereotypes or invented public/private history. Defaults are hypotheses. */
export function resolveFusionTension(m: FusionSide, b: FusionSide, all: readonly FusionSide[]): ResolvedFusionTension {
  const axis = m.axis, positive = m.direction > 0 ? m : b, negative = m.direction < 0 ? m : b;
  const meaning = (s: FusionSide) => fusionAxisMeaning(axis, s.direction);
  const refs = (side: FusionSide, target: SemanticAxis, direction = 1) => fusionProofsForAxis(all, side.system, target, direction, side.scope);
  function resolved(type: FusionSplitType, description: string, mWhen: string, bWhen: string, extra: { system: FusionSide["system"]; proof: FusionProof[] }[] = []): ResolvedFusionTension {
    return { description, split: { resolved: true, type, status: "CONDITIONAL_HYPOTHESIS", rationale: `${axis}:${type}:actual-source`,
      myeongliEvidenceIds: fusionUnique([...m.evidenceIds, ...extra.filter(e => e.system === "myeongli").flatMap(e => e.proof.map(p => p.id))]),
      mbtiSourceNodeIds: fusionUnique([...b.evidenceIds, ...extra.filter(e => e.system === "mbti").flatMap(e => e.proof.map(p => p.id))]),
      sides: { myeongli: mWhen, mbti: bWhen } } };
  }
  const hasSpecific = (s: FusionSide, context: InterpretationContext) => s.scope === context && s.proofs.some(p => s.exactEvidenceIds.includes(p.id) && p.contexts.includes(context) && !p.contexts.includes("identity"));
  const splitByContext = (type: FusionSplitType, specific: FusionSide, label: string, ordinary: string) => {
    const other = specific === m ? b : m;
    return resolved(type, `${ordinary}에는 ${meaning(other)}이지만, ${label}에는 ${meaning(specific)}으로 달라질 수 있는 조합입니다.`,
      specific === m ? label : ordinary, specific === b ? label : ordinary);
  };
  for (const [s, other] of [[m, b], [b, m]]) if (hasSpecific(s, "stress") && other.scope === "general") return splitByContext("NORMAL_STRESS", s, "압박을 받는 상황", "평소");
  for (const [s, other] of [[m, b], [b, m]]) if (hasSpecific(s, "work") && ["general", "recovery"].includes(other.scope)) return splitByContext("WORK_PRIVATE", s, "일을 맡은 상황", "개인적인 시간");
  for (const [s, other] of [[m, b], [b, m]]) {
    const close = s.proofs.some(p => s.exactEvidenceIds.includes(p.id) && (p.domain === "LOVE" || p.domain === "MARRIAGE" || (p.contexts.includes("love") && !p.contexts.includes("identity"))));
    if (close && ["love", "social"].includes(s.scope) && ["general", "social"].includes(other.scope)) return splitByContext("STRANGER_CLOSE", s, "가까운 관계", "아직 거리가 있는 관계");
  }
  const positiveNegative = (type: FusionSplitType, description: string, positiveWhen: string, negativeWhen: string, extra: { side: FusionSide; axis: SemanticAxis }[] = []) =>
    resolved(type, description, m.direction > 0 ? positiveWhen : negativeWhen, b.direction > 0 ? positiveWhen : negativeWhen,
      extra.map(({ side, axis }) => ({ system: side.system, proof: refs(side, axis) })));
  if (axis === "ACTION_TEMPO") {
    if (refs(positive, "INITIATIVE").length && refs(negative, "PERSISTENCE").length) return positiveNegative("START_MAINTAIN",
      "새로운 일을 시작할 때는 빠르게 움직이지만, 이어갈 때는 속도를 낮춰 오래 붙들 수 있는 조합입니다.", "시작할 때", "유지할 때", [{ side: positive, axis: "INITIATIVE" }, { side: negative, axis: "PERSISTENCE" }]);
    return positiveNegative("BEFORE_AFTER_DECISION", "결정을 내리기 전에는 충분히 생각하지만, 답이 정해진 뒤에는 빠르게 움직일 수 있는 조합입니다.", "답이 정해진 뒤", "결정하기 전");
  }
  if (axis === "ENERGY_DIRECTION" && refs(negative, "RECOVERY_NEED").length) return positiveNegative("OUTER_INNER",
    "밖에서는 사람들과 에너지를 잘 쓰지만, 혼자 있을 때 생각을 정리하고 회복할 시간이 필요한 조합입니다.", "밖에서 사람들과 있을 때", "혼자 회복할 때", [{ side: negative, axis: "RECOVERY_NEED" }]);
  if (axis === "STRUCTURE_STYLE" && refs(negative, "CREATION").length && refs(positive, "DUTY").length) return positiveNegative("IDEA_EXECUTION",
    "아이디어를 생각할 때는 유연하지만 실제로 움직일 때는 기준과 계획을 세우고 싶은 조합입니다.", "실행할 때", "아이디어를 떠올릴 때", [{ side: negative, axis: "CREATION" }, { side: positive, axis: "DUTY" }]);
  if (axis === "CHANGE_ORIENTATION" && refs(negative, "STABILITY").length) return positiveNegative("START_MAINTAIN",
    "새로운 일을 좋아하면서도 생활과 운영은 안정적으로 유지하고 싶은 조합입니다.", "새 일을 시작할 때", "생활을 유지할 때", [{ side: negative, axis: "STABILITY" }]);
  if (axis === "DECISION_STYLE") {
    if (refs(negative, "CARE").length && refs(positive, "STRATEGY").length) return positiveNegative("HEAD_HEART",
      "머리로는 답을 정해도 사람의 마음이 걸리면 가능성을 조금 더 열어둘 수 있는 조합입니다.", "판단의 순서를 정할 때", "사람의 마음이 걸릴 때", [{ side: negative, axis: "CARE" }, { side: positive, axis: "STRATEGY" }]);
    if (refs(negative, "DEPTH").length) return positiveNegative("BEFORE_AFTER_DECISION",
      "답을 고르기 전에는 여러 가능성을 깊이 살피지만, 결정이 끝나면 선택을 분명히 할 수 있는 조합입니다.", "결정을 마친 뒤", "답을 고르기 전", [{ side: negative, axis: "DEPTH" }]);
  }
  if (axis === "RELATION_STYLE" && refs(negative, "RECOVERY_NEED").length) return positiveNegative("OUTER_INNER",
    "사람들과 함께하는 마음과 혼자 쉬며 자기 공간을 지키려는 마음이 함께 있는 조합입니다.", "사람들과 함께할 때", "혼자 회복할 때", [{ side: negative, axis: "RECOVERY_NEED" }]);
  if (axis === "RISK_STYLE" && refs(negative, "STRATEGY").length && refs(positive, "OPPORTUNITY_SENSE").length) return positiveNegative("SHORT_LONG_TERM",
    "눈앞의 기회에는 도전하고 싶어도 오래 가져갈 선택에서는 손해와 위험을 따져볼 수 있는 조합입니다.", "눈앞의 기회를 볼 때", "오래 가져갈 선택을 할 때", [{ side: positive, axis: "OPPORTUNITY_SENSE" }, { side: negative, axis: "STRATEGY" }]);
  // Desire/behavior is not a universal escape hatch: it needs an expressed
  // direction (EXPRESSION) AND a considered boundary on the other side.
  if (["COMMUNICATION_STYLE", "CHANGE_ORIENTATION", "RISK_STYLE"].includes(axis) && refs(positive, "EXPRESSION").length && refs(negative, "BOUNDARY").length)
    return positiveNegative("DESIRE_BEHAVIOR", `마음은 ${meaning(positive)}을 향해도, 실제 행동에서는 ${meaning(negative)}을 지킬 수 있는 조합입니다.`,
      "마음을 밖으로 드러내고 싶을 때", "행동의 선을 정할 때", [{ side: positive, axis: "EXPRESSION" }, { side: negative, axis: "BOUNDARY" }]);
  return { description: `${meaning(m)}과 ${meaning(b)}이 함께 보이지만, 어느 상황에서 달라지는지는 아직 근거가 충분하지 않습니다.`,
    split: { resolved: false, status: "UNRESOLVED", rationale: "NO_SUPPORTED_CONDITION", myeongliEvidenceIds: [...m.evidenceIds], mbtiSourceNodeIds: [...b.evidenceIds] } };
}
