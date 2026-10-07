import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import type { ClaimEvidenceView, ClaimProfile } from "./claimCore";
import { claimAtomsInContext, claimAxisSides, claimBestBand, evaluateClaimCondition } from "./claimEvidence";
import { BAND_ORDER, fusionUnique as unique, type FusionCandidate } from "./fusionCore";
import type { InterpretationContext } from "./semanticCore";
import type { ResonanceCondition, ResonanceEvidence, ResonanceGate, ResonanceRisk } from "./personalResonanceCore";

export type ResonanceScope = { myeongli: MyeongliSemanticProfile; mbti: MbtiSemanticProfile; claims: ClaimProfile; view: ClaimEvidenceView; context: InterpretationContext };
export const emptyResonanceEvidence = (): ResonanceEvidence => ({ myeongliEvidenceIds: [], mbtiSourceNodeIds: [], fusionCandidateIds: [], claimIds: [] });
export function mergeResonanceEvidence(...refs: readonly ResonanceEvidence[]): ResonanceEvidence {
  return { myeongliEvidenceIds: unique(refs.flatMap(r => r.myeongliEvidenceIds)), mbtiSourceNodeIds: unique(refs.flatMap(r => r.mbtiSourceNodeIds)),
    fusionCandidateIds: unique(refs.flatMap(r => r.fusionCandidateIds)), claimIds: unique(refs.flatMap(r => r.claimIds)) };
}
export const fusionResonanceEvidence = (f: FusionCandidate): ResonanceEvidence => ({ myeongliEvidenceIds: [...f.myeongli.evidenceIds], mbtiSourceNodeIds: [...f.mbti.sourceNodeIds], fusionCandidateIds: [f.id], claimIds: [] });
export const usableResonanceFusion = (f: FusionCandidate, context: InterpretationContext) => f.strength !== "SUPPORT" && !f.priorHeavy && !f.amplifierOnly &&
  (f.contexts.includes(context) || f.contexts.includes("identity")) && (f.type !== "TENSION" || f.conditionSplit?.resolved === true);
const gate = (key: string, passed: boolean, refs: Partial<ResonanceEvidence> = {}): ResonanceGate => ({ key, passed, ...emptyResonanceEvidence(), ...refs });

/** Reviewed primary IDs only. These do not add or change 2A axis annotations.
 * Unlisted behavioral details (notably money-over-meaning) remain unsupported. */
export const RESONANCE_BEHAVIOR_SOURCES: Readonly<Record<ResonanceRisk, readonly string[]>> = {
  PRESSURE: ["mbti:INTJ:traits:strengths:rational_under_pressure:plainKo", "mbti:ISTP:traits:strengths:crisis_calm_action:plainKo", "mbti:ESTJ:traits:strengths:crisis_rationality:plainKo", "mbti:ENTJ:traits:workplace:crisis_momentum:plainKo", "mbti:ENFP:traits:strengths:crisis_big_picture:plainKo"],
  CALM_PRESSURE: ["mbti:INTJ:traits:strengths:rational_under_pressure:plainKo", "mbti:ISTP:traits:strengths:crisis_calm_action:plainKo", "mbti:ESTJ:traits:strengths:crisis_rationality:plainKo"],
  FINISH_DROP: ["mbti:ENTP:traits:risks:unfinished_projects:plainKo", "mbti:ENFP:traits:risks:unfinished_many_starts:plainKo"],
  OVER_EXPLAIN: ["mbti:INTP:traits:communication:topic_triggered_talk:plainKo"],
  UNSPOKEN_EXPECTATION: [],
  RUMINATION: [],
  OVERCONTROL: ["mbti:ENTJ:traits:workplace:delegation_pressure_control:plainKo"],
  REST_GUILT: ["mbti:ESTJ:traits:study:pace_and_rest_control:plainKo"],
  OVERLOAD: ["mbti:ENTJ:traits:risks:rest_and_family_neglect:plainKo"],
  MEANING_OVER_MONEY: ["mbti:INFJ:traits:career:mission_over_income:plainKo", "mbti:INFP:traits:money:low_material_drive:plainKo"],
  MONEY_OVER_MEANING: [],
  PUBLIC_PERSISTENCE: ["mbti:INTP:traits:workplace:low_reaction_meeting_drain:plainKo"],
};
function riskGate(risk: ResonanceRisk, s: ResonanceScope): ResonanceGate {
  const nodes = new Set(s.mbti.annotations.filter(a => a.sourceType !== "reference_only" && (a.contexts.includes(s.context) || a.contexts.includes("identity"))).map(a => a.sourceNodeId));
  const mb = s.mbti.sourceNodes.filter(n => RESONANCE_BEHAVIOR_SOURCES[risk].includes(n.id) && nodes.has(n.id) && n.classification === "SCORING_SEMANTIC").map(n => n.id);
  const atoms = claimAtomsInContext(s.myeongli.evidence, s.context);
  const my = atoms.filter(e => {
    if (risk === "PRESSURE") return (e.sourceType === "ten_god" && e.sourceKey === "偏官") || (e.tier !== "AMPLIFIER" && e.contexts.includes("stress") && [e.axes.STRATEGY, e.axes.DUTY, e.axes.DECISION_STYLE].some(v => (v ?? 0) > 0));
    if (risk === "RUMINATION") return e.sourceKey === "GWIMUN" && Array.isArray(e.metadata?.riskTags) && e.metadata.riskTags.includes("RUMINATION");
    if (risk === "UNSPOKEN_EXPECTATION") return e.sourceType === "relation" && e.dynamicTags?.includes("UNSPOKEN_MISMATCH");
    return false;
  }).map(e => e.id);
  const supporting = risk === "PRESSURE" ? s.view.fusionCandidates.filter(f => usableResonanceFusion(f, s.context) && f.conditionSplit?.type === "NORMAL_STRESS") : [];
  const refs = mergeResonanceEvidence({ ...emptyResonanceEvidence(), myeongliEvidenceIds: my, mbtiSourceNodeIds: mb }, ...supporting.map(fusionResonanceEvidence));
  return gate(`risk:${risk}`, my.length + mb.length + supporting.length > 0, refs);
}
export function evaluateResonanceCondition(c: ResonanceCondition, s: ResonanceScope): ResonanceGate {
  if (c.kind === "all" || c.kind === "any") {
    const children = c.conditions.map(x => evaluateResonanceCondition(x, s));
    return gate(`${c.kind}(${children.map(x => x.key).join(",")})`, c.kind === "all" ? children.every(x => x.passed) : children.some(x => x.passed), mergeResonanceEvidence(...children.filter(x => x.passed)));
  }
  if (c.kind === "existing") {
    const r = evaluateClaimCondition(c.condition, { view: s.view, myeongli: s.myeongli, context: s.context, myeongliOnly: false });
    return gate(r.gate, r.passed, { myeongliEvidenceIds: r.myeongliEvidenceIds, mbtiSourceNodeIds: r.mbtiSourceNodeIds, fusionCandidateIds: r.fusionCandidateIds });
  }
  if (c.kind === "claim") {
    const row = s.claims.candidates.find(x => x.id === c.id && x.level >= c.minLevel && x.confidenceBand !== "LOW" && (x.contexts.includes(s.context) || x.contexts.includes("identity")));
    return gate(`claim:${c.id}:${c.minLevel}`, !!row, row ? { myeongliEvidenceIds: row.evidence.myeongliEvidenceIds, mbtiSourceNodeIds: row.evidence.mbtiSourceNodeIds, fusionCandidateIds: row.evidence.fusionCandidateIds, claimIds: [row.id] } : {});
  }
  if (c.kind === "fusion") {
    const rows = s.view.fusionCandidates.filter(f => usableResonanceFusion(f, s.context) && (!c.ruleId || f.ruleId === c.ruleId) && (!c.theme || f.semanticTheme === c.theme) && (!c.split || (f.conditionSplit?.resolved && f.conditionSplit.type === c.split)));
    return gate(`fusion:${c.ruleId ?? c.theme ?? c.split}`, rows.length > 0, mergeResonanceEvidence(...rows.map(fusionResonanceEvidence)));
  }
  if (c.kind === "risk") return riskGate(c.risk, s);
  if (c.kind !== "limited") return gate("unsupported-condition", false);
  const requirement = { axis: c.axis, band: "SUPPORT" as const, direction: 1 as const };
  const my = claimAxisSides(s.view.myeongliAxisBands, requirement, s.context), mb = claimAxisSides(s.view.mbtiAxisBands, requirement, s.context);
  // Absence is NEVER weak/limited. Only the already classified SUPPORT band.
  const band = claimBestBand([...my, ...mb]);
  return gate(`limited:${c.axis}`, BAND_ORDER[band] === BAND_ORDER.SUPPORT, { myeongliEvidenceIds: unique(my.flatMap(x => x.evidenceIds)), mbtiSourceNodeIds: unique(mb.flatMap(x => x.evidenceIds)) });
}
