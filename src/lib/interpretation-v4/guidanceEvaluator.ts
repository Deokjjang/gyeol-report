import type { GuidanceCandidate, GuidanceDiagnostics, GuidanceProblemCandidate, GuidanceUserContext } from "./guidanceCore";
import { APPLICABILITY_VALUE, guidanceStrategy, strategyApplicability } from "./guidanceStrategies";
import { matchingGuidanceVariants, safeStrategyAdvice } from "./guidanceContextVariants";

/** Receives established problems only. Context can select wording, never traits. */
export function selectGuidance(p: GuidanceProblemCandidate, c: GuidanceUserContext, diagnostics: GuidanceDiagnostics): GuidanceCandidate | undefined {
  if (p.confidence === "LOW") { diagnostics.suppressedLowConfidenceAdvice.push(p.id); return undefined; }
  for (const id of p.candidateStrategies) {
    if (strategyApplicability(id, c.workModes) === "FORBIDDEN") diagnostics.suppressedUnsafeStrategies.push({ problemId: p.id, strategy: id,
      modes: c.workModes.filter(m => guidanceStrategy(id).forbiddenModes.includes(m.mode)).map(m => m.mode) });
  }
  const variants = matchingGuidanceVariants(p.problem, c);
  const chosen = variants.find(v => v.strategies.every(id => p.candidateStrategies.includes(id) && !p.forbiddenStrategies.includes(id) && strategyApplicability(id, c.workModes) !== "FORBIDDEN" &&
    // Caution needs specifically safe wording, never the release-small variant.
    (strategyApplicability(id, c.workModes) !== "CAUTION" || id !== "ITERATE_WHEN_SAFE")));
  for (const rejected of variants.filter(v => v !== chosen && v.strategies.some(id => strategyApplicability(id, c.workModes) === "FORBIDDEN"))) diagnostics.suppressedContextMismatch.push(`${p.id}:${rejected.id}`);
  const ranked = p.candidateStrategies.filter(id => !p.forbiddenStrategies.includes(id) && ["PREFERRED", "ALLOWED"].includes(strategyApplicability(id, c.workModes)))
    .sort((a, b) => APPLICABILITY_VALUE[strategyApplicability(b, c.workModes)] - APPLICABILITY_VALUE[strategyApplicability(a, c.workModes)] || p.candidateStrategies.indexOf(a) - p.candidateStrategies.indexOf(b));
  const ids = chosen?.strategies ?? ranked.slice(0, 1);
  if (!ids.length) { diagnostics.suppressedContextMismatch.push(`${p.id}:no-safe-strategy`); return undefined; }
  const text = chosen ? { customerAdvice: chosen.advice, contextVariantId: chosen.id } : safeStrategyAdvice(ids[0], c);
  const applicability = ids.map(id => strategyApplicability(id, c.workModes)).sort((a, b) => APPLICABILITY_VALUE[a] - APPLICABILITY_VALUE[b])[0];
  const evidence = p.evidenceStrength === "STRONG" ? 1 : p.evidenceStrength === "MAIN" ? .8 : .4;
  const specific = !!chosen && (!!chosen.modes || !!chosen.life || !!chosen.relationship);
  const fit = Math.min(1, .4 * evidence + .25 * c.contextConfidence + .25 * APPLICABILITY_VALUE[applicability] + .1 * (specific ? 1 : .5));
  return { id: `guidance:${p.id}`, problemId: p.id, problem: p.problem, problemDescription: p.humanProblemDescription, selectedStrategyIds: [...ids],
    customerAdvice: text.customerAdvice, ...(chosen?.why ? { whyThisFits: chosen.why } : {}),
    context: { lifeStatus: c.lifeStatus, workModes: structuredClone(c.workModes), relationshipStatus: c.relationshipStatus },
    sourceTraitArcIds: [...p.sourceTraitArcIds], sourceResonanceIds: [...p.sourceResonanceIds], sourceClaimIds: [...p.sourceClaimIds], sourceFusionIds: [...p.sourceFusionIds], evidenceIds: [...p.evidenceIds],
    confidence: p.confidence === "HIGH" && c.contextConfidence >= .75 && fit >= .8 && applicability !== "CAUTION" ? "HIGH" : "MEDIUM", contextFit: fit, applicability,
    diagnostics: { contextVariantId: text.contextVariantId, action: ids.map(id => guidanceStrategy(id).action).join(" / "), rankingScore: 0,
      problemEvidenceStrength: evidence, personalSpecificity: specific ? 1 : .7, genericAdvicePenalty: specific ? 0 : 5, conflictPenalty: 0, unsafeContextPenalty: 0 } };
}
