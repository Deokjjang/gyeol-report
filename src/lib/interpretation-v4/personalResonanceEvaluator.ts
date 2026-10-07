import { BAND_ORDER, fusionUnique as unique, fusionOrder } from "./fusionCore";
import { claimAxisSides } from "./claimEvidence";
import { HUMAN_GOLDEN_LANGUAGE, descriptionGenericness, humanLanguageErrors, genericnessPenalty } from "./humanDescription";
import { CLAIM_REGISTRY } from "./claimRegistry";
import type { PersonalResonanceCandidate, ResonanceDefinition, ResonanceCondition } from "./personalResonanceCore";
import { evaluateResonanceCondition, fusionResonanceEvidence, mergeResonanceEvidence, usableResonanceFusion, type ResonanceScope } from "./personalResonanceEvidence";
import { resonanceOrder, resonanceScore } from "./personalResonanceRanking";

/** Diagnostic only: would the base trait pass if its missing detail were known?
 * This NEVER supplies evidence to the evaluator or activates a candidate. */
export function rejectedResonanceSpecificity(d: ResonanceDefinition, input: Omit<ResonanceScope, "context">): boolean {
  const hasRisk = (c: ResonanceCondition): boolean => c.kind === "risk" || ((c.kind === "all" || c.kind === "any") && c.conditions.some(hasRisk));
  if (!hasRisk(d.required)) return false;
  return d.contexts.some(context => {
    const s = { ...input, context };
    function base(c: ResonanceCondition): boolean {
      if (c.kind === "risk") return true;
      if (c.kind === "all") return c.conditions.every(base);
      if (c.kind === "any") return c.conditions.some(base);
      return evaluateResonanceCondition(c, s).passed;
    }
    return base(d.required) && !evaluateResonanceCondition(d.required, s).passed;
  });
}

/** Scope by scope: evidence from unrelated domains cannot be pooled to pass. */
export function evaluatePersonalResonance(d: ResonanceDefinition, input: Omit<ResonanceScope, "context">): PersonalResonanceCandidate | undefined {
  const eligible: PersonalResonanceCandidate[] = [];
  for (const context of d.contexts) {
    const s = { ...input, context }, required = evaluateResonanceCondition(d.required, s);
    if (!required.passed || d.forbiddenConditions.some(c => evaluateResonanceCondition(c, s).passed)) continue;
    const optional = d.optionalSupport.map(c => evaluateResonanceCondition(c, s)).filter(g => g.passed);
    const matched = d.alternatives.map(v => ({ ...v, gate: evaluateResonanceCondition(v.when, s) })).find(v => v.gate.passed);
    const gates = [required, ...optional, ...(matched ? [matched.gate] : [])];
    let refs = mergeResonanceEvidence(...gates);
    // A fusion must use this interpretation's natal atoms AND its semantic axes.
    const relatedFusion = input.view.fusionCandidates.filter(f => usableResonanceFusion(f, context) && f.primaryAxes.every(a => d.primaryAxes.includes(a)) && f.myeongli.evidenceIds.some(id => refs.myeongliEvidenceIds.includes(id)))
      .sort((a, b) => Number(!!b.conditionSplit?.resolved) - Number(!!a.conditionSplit?.resolved) || b.rankingScore - a.rankingScore || fusionOrder(a.id, b.id)).slice(0, 2);
    refs = mergeResonanceEvidence(refs, ...relatedFusion.map(fusionResonanceEvidence));
    const atoms = input.myeongli.evidence.filter(e => refs.myeongliEvidenceIds.includes(e.id));
    if (!atoms.length) continue; // No type-only human description / MBTI stereotype.
    const families = unique(atoms.filter(e => e.tier !== "AMPLIFIER").map(e => e.family));
    const domains = unique(input.mbti.annotations.filter(a => refs.mbtiSourceNodeIds.includes(a.sourceNodeId)).map(a => a.sourceDomain));
    const independentCount = families.length + (refs.mbtiSourceNodeIds.length ? 1 : 0); // Fusion wrappers never a third source.
    const supportingFusion = input.view.fusionCandidates.filter(f => refs.fusionCandidateIds.includes(f.id));
    const resolved = supportingFusion.filter(f => f.conditionSplit?.resolved).sort((a, b) => b.rankingScore - a.rankingScore || fusionOrder(a.id, b.id))[0];
    const directions = d.primaryAxes.flatMap(axis => [1, -1].map(direction => ({ axis, band: "MAIN" as const, direction: direction as 1 | -1 })));
    const bands = directions.flatMap(a => [...claimAxisSides(input.view.myeongliAxisBands, a, context), ...claimAxisSides(input.view.mbtiAxisBands, a, context)])
      .filter(side => side.evidenceIds.some(id => refs.myeongliEvidenceIds.includes(id) || refs.mbtiSourceNodeIds.includes(id)));
    const primaryAxes = d.primaryAxes.filter(axis => bands.some(s => s.axis === axis && BAND_ORDER[s.band] >= BAND_ORDER.MAIN));
    // Opposing general sources also apply in local contexts. An unrelated
    // resolved split cannot excuse a different unresolved axis contradiction.
    const unresolved = primaryAxes.some(axis => {
      const both = [1, -1].every(direction => bands.some(side => side.axis === axis && side.direction === direction && BAND_ORDER[side.band] >= BAND_ORDER.MAIN));
      return both && !supportingFusion.some(f => f.conditionSplit?.resolved && f.primaryAxes.includes(axis));
    });
    let humanDescription = matched?.text ?? d.humanDescription;
    // A distinct delayed-precision variant, never inferred from precision alone.
    const perfectionism = input.claims.candidates.find(c => c.id === "F03_PERFECTIONISM" && c.contexts.includes(context));
    if (d.id === "PR003" && perfectionism && perfectionism.customerClaim === CLAIM_REGISTRY.find(c => c.id === "F03_PERFECTIONISM")?.alternativeLevel3) {
      humanDescription = HUMAN_GOLDEN_LANGUAGE.delayedPrecision;
      refs = mergeResonanceEvidence(refs, { ...perfectionism.evidence, claimIds: [perfectionism.id] });
    }
    if (humanLanguageErrors(humanDescription).length) continue;
    const strengthBands = bands.filter(s => BAND_ORDER[s.band] >= BAND_ORDER.MAIN);
    const evidenceStrength = strengthBands.length ? (strengthBands.every(s => s.band === "STRONG") ? 1 : .85) : .6;
    const fusionValue = supportingFusion.some(f => f.strength === "SIGNATURE") ? 1 : supportingFusion.length ? .7 : 0;
    const specificity = Math.min(1, d.specificityBase + (resolved ? .05 : supportingFusion.some(f => f.type === "COMPLEMENT") ? .03 : 0));
    const genericness = descriptionGenericness(d.quality, specificity, primaryAxes.length);
    const c: PersonalResonanceCandidate = {
      id: `resonance:${d.id}`, ruleId: d.id, descriptionType: d.descriptionType, semanticTheme: d.semanticTheme, semanticGroup: d.semanticGroup,
      contexts: [context], humanDescription, ...(d.positiveMeaning ? { positiveMeaning: d.positiveMeaning } : {}), ...(d.shadowMeaning ? { shadowMeaning: d.shadowMeaning } : {}),
      source: refs.fusionCandidateIds.length ? (refs.claimIds.length ? "MIXED" : "FUSION") : refs.claimIds.length ? "CLAIM" : refs.mbtiSourceNodeIds.length ? "MIXED" : "MYEONGLI",
      evidence: refs, primaryAxes, ...(resolved?.conditionSplit ? { conditionSplit: structuredClone(resolved.conditionSplit) } : {}),
      evidenceStrength, familyDiversity: Math.min(1, independentCount / 3), specificity,
      contradictionValue: resolved ? (resolved.strength === "SIGNATURE" ? 1 : .85) : ["DUAL_DESIRE", "OUTER_INNER"].includes(d.descriptionType) ? .55 : .15,
      fusionValue, humanRelevance: context === "identity" ? 1 : .85, emotionalImpact: d.emotionalImpactBase, genericness,
      rankingScore: 0, rank: "SUPPORT", relatedCandidateIds: [],
      diagnostics: { independentFamilies: families, mbtiDomains: domains, independentCount, amplifierOnly: atoms.every(e => e.tier === "AMPLIFIER"),
        unresolvedContradiction: unresolved, unsupportedSpecificity: false, quality: d.quality, duplicatePenalty: 0, genericnessPenalty: genericnessPenalty(genericness), conflictPenalty: unresolved ? 12 : 0, gates },
    };
    c.rankingScore = resonanceScore(c, 0, false, c.diagnostics.conflictPenalty); eligible.push(c);
  }
  eligible.sort(resonanceOrder);
  const best = eligible[0];
  if (!best) return undefined;
  // Only contexts supported independently by the same copy survive. Do not pool
  // their atoms to inflate strength, diversity, or provenance of the best row.
  best.contexts = unique(eligible.filter(c => c.humanDescription === best.humanDescription && c.rankingScore >= best.rankingScore - 5 &&
    JSON.stringify(c.evidence) === JSON.stringify(best.evidence) && c.diagnostics.unresolvedContradiction === best.diagnostics.unresolvedContradiction).flatMap(c => c.contexts));
  return best;
}
