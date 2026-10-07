import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import { BAND_ORDER, fusionOrder, fusionUnique as unique } from "./fusionCore";
import type { InterpretationContext } from "./semanticCore";
import { axis, axisGate, type ClaimCandidate, type ClaimDefinition, type ClaimEvidenceView, type ClaimGateResult, type ClaimLevel, type ClaimSuppression } from "./claimCore";
import { claimAtomsInContext, claimAxisSides, claimBestBand, claimConditionAxes, evaluateClaimCondition } from "./claimEvidence";

export type ClaimLevelSupport = {
  credibleSupport: boolean; main: boolean; strong: boolean; independentSupportCount: number;
  independentMyeongliFamilies: number; nonAmplifierMyeongli: boolean; myeongliMain: boolean;
  actualMbtiMain: boolean; validFusionMain: boolean; structuralComposite: boolean;
  unresolvedContradiction: boolean; allowLevel4: boolean;
};
/** Editorial directness, never a probability or a new natal strength score. */
export function assessClaimLevel(s: ClaimLevelSupport): ClaimLevel {
  if (!s.credibleSupport) return 0;
  let level: ClaimLevel = s.main || s.independentSupportCount >= 2 ? 2 : 1;
  if (level === 2 && s.nonAmplifierMyeongli && (s.strong || (s.main && s.independentSupportCount >= 2)) &&
    (s.independentMyeongliFamilies >= 2 || (s.myeongliMain && s.actualMbtiMain && s.validFusionMain))) level = 3;
  if (level === 3 && s.allowLevel4 && s.independentMyeongliFamilies >= 2 && s.structuralComposite && !s.unresolvedContradiction) level = 4;
  return level;
}

function evaluateContext(d: ClaimDefinition, v: ClaimEvidenceView, m: MyeongliSemanticProfile, context: InterpretationContext): ClaimCandidate | ClaimSuppression {
  const scope = { view: v, myeongli: m, context, myeongliOnly: d.fortuneClaim };
  const gates = [...d.requiredAxes.map(requirement => evaluateClaimCondition({ kind: "axis", requirement }, scope)), ...d.requiredConditions.map(c => evaluateClaimCondition(c, scope))];
  // The leadership behind 장성/반안 must be natal, not borrowed from MBTI.
  if (d.id === "S09_JANGSEONG_BANAN_COMPOSITE") gates.push(evaluateClaimCondition({ kind: "any", conditions: [{ kind: "family", family: "OFFICER", band: "MAIN" }, axisGate("LEADERSHIP")] }, { ...scope, myeongliOnly: true }));
  const selectedAxes = unique([...d.requiredAxes.map(a => a.axis), ...d.requiredConditions.flatMap(claimConditionAxes),
    ...(d.id === "P01_PEOPLE_LUCK" ? ["CARE" as const, "SOCIAL_ATTUNEMENT" as const] : [])]);
  const primaryIds = unique(gates.filter(g => g.passed).flatMap(g => g.myeongliEvidenceIds));
  const localAtoms = claimAtomsInContext(m.evidence, context);
  const composites = m.synthesisCandidates.filter(c => c.strength !== "SUPPORT" &&
    ["TEN_GOD_FAMILY_PAIR", "TEN_GOD_CHAIN", "DAY_MASTER_TEN_GOD", "ELEMENT_PAIR"].includes(c.source) &&
    (c.contexts.includes(context) || c.contexts.includes("identity")) && c.primaryAxes.some(a => selectedAxes.includes(a)) &&
    c.evidenceIds.some(id => primaryIds.includes(id)) && c.evidenceIds.every(id => localAtoms.some(e => e.id === id)) &&
    unique(c.evidenceIds.map(id => localAtoms.find(e => e.id === id)!.family)).length >= 2);
  // Composites explain their existing atoms; they never add a third source or vote.
  const myIds = unique([...primaryIds, ...composites.flatMap(c => c.evidenceIds)]);
  const atoms = localAtoms.filter(e => myIds.includes(e.id)), families = unique(atoms.map(e => e.family));
  gates.push({ gate: `independent-myeongli-families:${d.minimumIndependentMyeongliFamilies}`, passed: families.length >= d.minimumIndependentMyeongliFamilies,
    myeongliEvidenceIds: myIds, mbtiSourceNodeIds: [], fusionCandidateIds: [] });
  const requirements = [...d.requiredAxes, ...selectedAxes.filter(a => !d.requiredAxes.some(r => r.axis === a)).map(a => axis(a, "SUPPORT"))];
  const relevantMy = requirements.flatMap(a => claimAxisSides(v.myeongliAxisBands, a, context)).filter(s => s.evidenceIds.every(id => myIds.includes(id)));
  const myBand = claimBestBand(relevantMy);
  const mbSides = requirements.flatMap(a => claimAxisSides(v.mbtiAxisBands, a, context));
  // Fortune MBTI is annotation/ranking only: no MBTI contribution in eligibility.
  const mbIds = unique([...gates.filter(g => g.passed).flatMap(g => g.mbtiSourceNodeIds), ...mbSides.flatMap(s => s.evidenceIds)]);
  const relevantFusion = v.fusionCandidates.filter(f => f.contexts.includes(context) &&
    (f.primaryAxes.some(a => selectedAxes.includes(a)) || d.preferredFusionIds.includes(f.ruleId ?? "")) &&
    f.myeongli.evidenceIds.every(id => myIds.includes(id)) && f.mbti.sourceNodeIds.every(id => mbIds.includes(id)));
  const unresolved = relevantFusion.some(f => f.type === "TENSION" && !f.conditionSplit?.resolved) || m.tensionCandidates.some(t =>
    t.quality === "MAIN" && t.metadata.relationship === "OPPOSITE_DIRECTION" && selectedAxes.includes(t.axis) &&
    [...t.positiveSideEvidenceIds, ...t.negativeSideEvidenceIds].every(id => localAtoms.some(e => e.id === id)));
  const rankMain = m.rankedCandidates.some(c => c.rank !== "SUPPORT" && !c.supportOnly && c.evidenceIds.length > 0 && c.evidenceIds.every(id => myIds.includes(id)));
  const familyMain = Object.values(v.tenGodFamilies).some(f => BAND_ORDER[f.band] >= BAND_ORDER.MAIN && f.evidenceIds.length > 0 && f.evidenceIds.every(id => myIds.includes(id)));
  const myMain = BAND_ORDER[myBand] >= BAND_ORDER.MAIN || rankMain || familyMain;
  const mbMain = BAND_ORDER[claimBestBand(mbSides)] >= BAND_ORDER.MAIN;
  const independentCount = families.length + (d.fortuneClaim ? 0 : unique(mbSides.flatMap(s => s.domains)).length);
  let level = assessClaimLevel({ credibleSupport: atoms.length > 0 || (!d.fortuneClaim && mbIds.length > 0), main: myMain || (!d.fortuneClaim && mbMain),
    strong: myBand === "STRONG" || (!d.fortuneClaim && claimBestBand(mbSides) === "STRONG"), independentSupportCount: independentCount,
    independentMyeongliFamilies: families.length, nonAmplifierMyeongli: atoms.some(e => e.tier !== "AMPLIFIER"), myeongliMain: myMain,
    actualMbtiMain: !d.fortuneClaim && mbMain, validFusionMain: !d.fortuneClaim && relevantFusion.some(f => f.strength !== "SUPPORT" && !f.priorHeavy && !f.amplifierOnly),
    structuralComposite: composites.length > 0, unresolvedContradiction: unresolved, allowLevel4: d.maxLevel === 4 });
  const warnings: string[] = [];
  if (unresolved) warnings.push("UNRESOLVED_CONTRADICTION_LEVEL4_BLOCKED");
  if (atoms.some(e => e.metadata?.canonicalConfidence === undefined)) warnings.push("SOURCE_CONFIDENCE_UNAVAILABLE");
  // The unqualified over-care copy must not escape a valid limit by choosing
  // another allowed context. This cross-context evidence can only lower it.
  const bounds = (d.id === "F07_OVERCARE" ? d.contexts : [context]).map(context => evaluateClaimCondition(axisGate("BOUNDARY", "STRONG"), { ...scope, context }));
  const bound = bounds.find(g => g.passed) ?? bounds[0];
  const careLimits = v.fusionCandidates.filter(f => f.ruleId === "C053" && f.contexts.some(c => d.contexts.includes(c)) && f.strength !== "SUPPORT" && !f.priorHeavy);
  if (d.id === "F07_OVERCARE" && (bound.passed || careLimits.length > 0) && level > 2) { level = 2; warnings.push("CARE_WITH_LIMITS_CAP_LEVEL2"); }
  level = Math.min(level, d.maxLevel) as ClaimLevel;
  const failed = gates.filter(g => !g.passed);
  if (failed.length || level < d.minLevel || !d.claimsByLevel[level]) {
    const reasons = [...(failed.length ? [d.fortuneClaim ? "MISSING_MYEONGLI_GATE" : "INSUFFICIENT_EVIDENCE"] : []),
      ...(level < d.minLevel || !d.claimsByLevel[level] ? ["INSUFFICIENT_LEVEL"] : []),
      ...(atoms.length > 0 && atoms.every(e => e.tier === "AMPLIFIER") ? ["AMPLIFIER_ONLY"] : [])];
    return { id: d.id, context, level: 0, reasons, gates };
  }
  let customerClaim = d.claimsByLevel[level]!;
  if (d.id === "F03_PERFECTIONISM" && level === 3) {
    const delay = evaluateClaimCondition(axisGate("ACTION_TEMPO", "SUPPORT", -1), scope);
    const splits = v.fusionCandidates.filter(f => f.contexts.includes(context) && f.type === "TENSION" && f.strength !== "SUPPORT" && !f.priorHeavy && f.conditionSplit?.resolved && f.conditionSplit.type === "BEFORE_AFTER_DECISION");
    if (delay.passed || splits.length > 0) {
      customerClaim = d.alternativeLevel3!;
      gates.push({ gate: "wording:actual-delay", passed: true, myeongliEvidenceIds: unique([...delay.myeongliEvidenceIds, ...splits.flatMap(f => f.conditionSplit!.myeongliEvidenceIds)]),
        mbtiSourceNodeIds: unique([...delay.mbtiSourceNodeIds, ...splits.flatMap(f => f.conditionSplit!.mbtiSourceNodeIds)]), fusionCandidateIds: splits.map(f => f.id) });
    }
  }
  // Include wording/cap provenance after level assessment so it cannot inflate it.
  const extraGates: ClaimGateResult[] = gates.filter(g => g.gate === "wording:actual-delay");
  if (d.id === "F07_OVERCARE" && warnings.includes("CARE_WITH_LIMITS_CAP_LEVEL2")) extraGates.push(bound,
    ...careLimits.map(f => ({ gate: "cap:C053", passed: true, myeongliEvidenceIds: f.myeongli.evidenceIds, mbtiSourceNodeIds: f.mbti.sourceNodeIds, fusionCandidateIds: [f.id] })));
  const allMyIds = unique([...myIds, ...extraGates.flatMap(g => g.myeongliEvidenceIds)]);
  const allMbIds = unique([...mbIds, ...extraGates.flatMap(g => g.mbtiSourceNodeIds)]);
  const fusionIds = unique([...relevantFusion.map(f => f.id), ...gates.flatMap(g => g.fusionCandidateIds), ...extraGates.flatMap(g => g.fusionCandidateIds)]);
  const evidenceFamilies = unique(m.evidence.filter(e => allMyIds.includes(e.id)).map(e => e.family));
  if (level === 2) warnings.push("CAPPED_LEVEL2");
  if (!allMbIds.length) warnings.push("NO_ACTUAL_MBTI_SUPPORT");
  if (!fusionIds.length) warnings.push("NO_FUSION_SUPPORT");
  return { id: d.id, category: d.category, level: level as 1 | 2 | 3 | 4, maxAllowedLevel: d.maxLevel, semanticTheme: d.semanticTheme, customerClaim,
    contexts: [context], allowedContexts: [...d.contexts], evidence: { myeongliEvidenceIds: allMyIds, mbtiSourceNodeIds: allMbIds, fusionCandidateIds: fusionIds,
      independentMyeongliFamilies: evidenceFamilies, myeongliSourceTypes: unique(m.evidence.filter(e => allMyIds.includes(e.id)).map(e => e.sourceType)),
      mbtiDomains: unique(v.mbtiAxisBands.flatMap(s => s.proofs).filter(p => allMbIds.includes(p.id)).flatMap(p => p.domain ? [p.domain] : [])) },
    evidenceDiversity: evidenceFamilies.length, confidenceBand: level >= 3 ? "HIGH" : level === 2 ? "MEDIUM" : "LOW", fortuneClaim: d.fortuneClaim, factBomb: d.factBomb,
    exclusivityGroup: d.exclusivityGroup, priority: d.priority,
    rankingSupport: { actualMbtiMain: mbMain, validFusionMain: relevantFusion.some(f => f.strength !== "SUPPORT" && !f.priorHeavy && !f.amplifierOnly),
      preferredFusionMain: relevantFusion.some(f => d.preferredFusionIds.includes(f.ruleId ?? "") && f.strength !== "SUPPORT" && !f.priorHeavy && !f.amplifierOnly) },
    relatedClaimIds: [], relatedFusionIds: fusionIds, overlapScore: 0,
    diagnostics: { gates, warnings: unique(warnings), structuralCompositeIds: unique(composites.map(c => c.id)), primaryMyeongliGatePassed: d.fortuneClaim && failed.length === 0 } };
}

export function evaluateClaim(d: ClaimDefinition, v: ClaimEvidenceView, m: MyeongliSemanticProfile) {
  const evaluated = d.contexts.map(context => evaluateContext(d, v, m, context));
  const candidates = evaluated.filter((c): c is ClaimCandidate => c.level !== 0).sort((a, b) => b.level - a.level || b.evidenceDiversity - a.evidenceDiversity || fusionOrder(a.contexts[0], b.contexts[0]));
  if (candidates.length) candidates[0].contexts = unique(candidates.filter(c => c.level === candidates[0].level && c.customerClaim === candidates[0].customerClaim).flatMap(c => c.contexts));
  return { candidate: candidates[0], suppressed: evaluated.filter((c): c is ClaimSuppression => c.level === 0) };
}
