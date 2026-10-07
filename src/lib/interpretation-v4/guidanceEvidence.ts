import { buildClaimEvidenceView } from "./claimEvidence";
import { evaluateResonanceCondition, type ResonanceScope } from "./personalResonanceEvidence";
import { fusionUnique as unique } from "./fusionCore";
import type { InterpretationContext } from "./semanticCore";
import type { GuidanceCondition, GuidanceInputs, GuidanceProblemCandidate, GuidanceProblemDefinition, GuidanceRefs } from "./guidanceCore";

/** Reviewed primary source IDs only; no matching prose or unannotated priors.
 * Empty lists intentionally keep unsupported risks registered but inactive. */
export const GUIDANCE_BEHAVIOR_SOURCES: Readonly<Record<string, readonly string[]>> = {
  IMPULSIVE_ACTION: ["mbti:ESFP:traits:risks:impulsive_emotion:plainKo", "mbti:ISTP:traits:risks:risk_seeking_impulse:plainKo"],
  ROUTINE_DROP: ["mbti:ENTP:traits:risks:low_routine_tolerance:plainKo"],
  CHANGE_CHASING: [],
  CHANGE_RESISTANCE: ["mbti:ISTJ:traits:risks:rigidity_under_change:plainKo", "mbti:ESTJ:traits:risks:rigid_traditionalism:plainKo"],
  PROCESS_CONTROL: ["mbti:ENTJ:traits:workplace:delegation_pressure_control:plainKo", "mbti:ISTJ:traits:workplace:controlled_authority_risk:plainKo", "mbti:ESTJ:traits:risks:controlling_tendency:plainKo"],
  OTHERS_STANDARD: ["mbti:ISTJ:traits:workplace:controlled_authority_risk:plainKo", "mbti:ENTJ:traits:workplace:delegation_pressure_control:plainKo"],
  URGENCY_PRESSURE: ["mbti:ENTJ:traits:workplace:delegation_pressure_control:plainKo", "mbti:ESTP:traits:communication:emotion_impatience:plainKo"],
  CONFLICT_AVOIDANCE: ["mbti:ISFJ:traits:workplace:conflict_avoidance_at_work:plainKo", "mbti:INFP:traits:workplace:soft_conflict_style:plainKo", "mbti:INFP:traits:marriage:conflict_avoidance_marriage:plainKo"],
  PEOPLE_PLEASING: ["mbti:ENFP:traits:growth:practice_boundaries:plainKo", "mbti:ISFJ:traits:workplace:recognition_and_boundary:plainKo"],
  WITHDRAWAL: ["mbti:INFP:traits:identity:sensitive_withdrawal:plainKo", "mbti:ISTJ:traits:relationships:self_withdrawal_when_unready:plainKo"],
  RESTRICTIVE_SAVING: [], // Being frugal is not evidence of denying necessary experience.
  IMPULSE_SPENDING: ["mbti:ENFP:traits:money:possibility_spending_spread:plainKo", "mbti:INFP:traits:money:emotional_spending_shelter:plainKo"],
  MONEY_OVER_MEANING: [], // 3B also has no primary money-dominant risk source.
  UNDERPRICING: ["mbti:ISFJ:traits:money:care_labor_underpricing:plainKo"],
  STATUS_SPENDING: ["mbti:ESTJ:traits:money:performance_status_spending:plainKo", "mbti:ENFJ:traits:money:status_and_care_spending:plainKo", "mbti:ESFP:traits:money:beauty_social_spending:plainKo"],
};
export const emptyGuidanceRefs = (): GuidanceRefs => ({ sourceResonanceIds: [], sourceClaimIds: [], sourceTraitArcIds: [], sourceFusionIds: [], evidenceIds: [] });
export function mergeGuidanceRefs(...rows: readonly GuidanceRefs[]): GuidanceRefs {
  return Object.fromEntries(Object.keys(emptyGuidanceRefs()).map(key => [key, unique(rows.flatMap(r => r[key as keyof GuidanceRefs]))])) as GuidanceRefs;
}
type Gate = GuidanceRefs & { passed: boolean; low: boolean };
const gate = (passed = false, refs: GuidanceRefs = emptyGuidanceRefs(), low = false): Gate => ({ passed, ...refs, low });
export function guidanceScope(i: GuidanceInputs, context: InterpretationContext): ResonanceScope {
  return { myeongli: i.myeongli, mbti: i.mbti, claims: i.claims, view: buildClaimEvidenceView(i.myeongli, i.mbti, i.fusion), context };
}
/** Does not receive UserContext: life/job/relationship cannot activate a problem. */
export function evaluateGuidanceCondition(c: GuidanceCondition, i: GuidanceInputs, s: ResonanceScope): Gate {
  if (c.kind === "all" || c.kind === "any") {
    const children = c.conditions.map(x => evaluateGuidanceCondition(x, i, s));
    const passing = children.filter(x => x.passed);
    return gate(c.kind === "all" ? children.length > 0 && children.every(x => x.passed) : passing.length > 0,
      mergeGuidanceRefs(...passing), c.kind === "all" ? passing.some(x => x.low) : passing.every(x => x.low));
  }
  if (c.kind === "existing") {
    const g = evaluateResonanceCondition(c.condition, s);
    return gate(g.passed, { ...emptyGuidanceRefs(), sourceClaimIds: g.claimIds, sourceFusionIds: g.fusionCandidateIds, evidenceIds: unique([...g.myeongliEvidenceIds, ...g.mbtiSourceNodeIds]) });
  }
  if (c.kind === "delayQualifiedClaim") {
    const claim = i.claims.candidates.find(c => c.id === "F03_PERFECTIONISM" && c.level >= 3 && c.confidenceBand !== "LOW" &&
      c.diagnostics.gates.some(g => g.gate === "wording:actual-delay" && g.passed) && (c.contexts.includes(s.context) || c.contexts.includes("identity")));
    return gate(!!claim, claim ? { ...emptyGuidanceRefs(), sourceClaimIds: [claim.id], sourceFusionIds: [...claim.evidence.fusionCandidateIds], evidenceIds: unique([...claim.evidence.myeongliEvidenceIds, ...claim.evidence.mbtiSourceNodeIds]) } : undefined);
  }
  if (c.kind === "resonance") {
    const rows = i.resonance.candidates.filter(r => c.ids.includes(r.ruleId) && !r.diagnostics.amplifierOnly && !r.diagnostics.unsupportedSpecificity && (r.contexts.includes(s.context) || r.contexts.includes("identity")));
    return gate(rows.length > 0, mergeGuidanceRefs(...rows.map(r => ({ sourceResonanceIds: [r.id], sourceTraitArcIds: [], sourceClaimIds: r.evidence.claimIds,
      sourceFusionIds: r.evidence.fusionCandidateIds, evidenceIds: unique([...r.evidence.myeongliEvidenceIds, ...r.evidence.mbtiSourceNodeIds]) }))), rows.every(r => r.rank === "SUPPORT" || r.diagnostics.unresolvedContradiction));
  }
  if (c.kind !== "behavior") return gate();
  const annotated = new Set(i.mbti.annotations.filter(a => a.sourceType !== "reference_only" && (a.contexts.includes(s.context) || a.contexts.includes("identity"))).map(a => a.sourceNodeId));
  const mb = i.mbti.sourceNodes.filter(n => GUIDANCE_BEHAVIOR_SOURCES[c.key]?.includes(n.id) && n.classification === "SCORING_SEMANTIC" && annotated.has(n.id)).map(n => n.id);
  const composite = c.key === "ROUTINE_DROP" ? i.myeongli.synthesisCandidates.filter(x => ["GROWTH_BEFORE_MAINTENANCE", "EXPRESSION_BEFORE_ROUTINE"].includes(x.semanticTheme) &&
    (x.contexts.includes(s.context) || x.contexts.includes("identity")) && x.evidenceIds.some(id => i.myeongli.evidence.some(e => e.id === id && e.strength !== "WEAK" && e.weight > 0 && e.tier !== "AMPLIFIER"))) : [];
  return gate(mb.length + composite.length > 0, { ...emptyGuidanceRefs(), evidenceIds: unique([...mb, ...composite.flatMap(x => x.evidenceIds)]) },
    mb.length === 0 && composite.every(x => x.strength === "SUPPORT"));
}
export function evaluateGuidanceProblem(d: GuidanceProblemDefinition, i: GuidanceInputs, view: ResonanceScope["view"]): GuidanceProblemCandidate | undefined {
  const rows = d.contexts.flatMap(context => {
    const s = { myeongli: i.myeongli, mbti: i.mbti, claims: i.claims, view, context };
    const g = evaluateGuidanceCondition(d.required, i, s);
    if (!g.passed || (d.forbidden && evaluateGuidanceCondition(d.forbidden, i, s).passed)) return [];
    return [{ context, g }];
  }).sort((a, b) => Number(a.g.low) - Number(b.g.low) || b.g.evidenceIds.length - a.g.evidenceIds.length || a.context.localeCompare(b.context));
  if (!rows.length) return undefined;
  const { g, context } = rows[0];
  // Attach only genuinely used shadow arcs, not every arc with a similar title.
  const arcs = i.resonance.traitArcs.filter(a => a.shadowDescription && a.provenance.shadow && (a.contexts.includes(context) || a.contexts.includes("identity")) &&
    (a.provenance.shadow.claimIds.some(id => g.sourceClaimIds.includes(id)) || a.sourceResonanceIds.some(id => g.sourceResonanceIds.includes(id))) &&
    [...a.provenance.shadow.myeongliEvidenceIds, ...a.provenance.shadow.mbtiSourceNodeIds].every(id => g.evidenceIds.includes(id)));
  const families = unique(i.myeongli.evidence.filter(e => g.evidenceIds.includes(e.id) && e.tier !== "AMPLIFIER").map(e => e.family));
  const independent = families.length + Number(g.evidenceIds.some(id => i.mbti.sourceNodes.some(n => n.id === id)));
  const confidence = g.low ? "LOW" : independent >= 2 ? "HIGH" : "MEDIUM";
  return { id: d.id, problem: d.problem, humanProblemDescription: d.humanProblemDescription, semanticTheme: d.problem,
    ...mergeGuidanceRefs(g, { ...emptyGuidanceRefs(), sourceTraitArcIds: arcs.map(a => a.id) }), contexts: [context],
    evidenceStrength: g.low ? "SUPPORT" : independent >= 2 ? "STRONG" : "MAIN", confidence,
    candidateStrategies: [...d.candidateStrategies], forbiddenStrategies: [], relatedProblemIds: [] };
}
