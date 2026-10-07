import type { FusionSidePair } from "./fusionContext";
import { BAND_ORDER, FUSION_RANK_POLICY as POLICY, fusionUnique, fusionOrder,
  type FusionCandidate, type FusionConditionSplit, type FusionStrength, type FusionType } from "./fusionCore";
import { broadTheme } from "./foundationRanking";

export function makeFusionCandidate(pair: FusionSidePair, type: FusionType, semanticTheme: string, sourceDescription: string,
  ruleId?: string, conditionSplit?: FusionConditionSplit): FusionCandidate {
  const m = pair.myeongli, b = pair.mbti, bothMain = Math.min(BAND_ORDER[m.band], BAND_ORDER[b.band]) >= BAND_ORDER.MAIN;
  let strength: FusionStrength = bothMain ? "MAIN" : "SUPPORT";
  const signatureSides = type === "COMPLEMENT" ? bothMain && (m.band === "STRONG" || b.band === "STRONG") : m.band === "STRONG" && b.band === "STRONG";
  if (signatureSides && pair.fit >= .85 && b.evidenceIds.length >= 2 && (type === "REINFORCE" || m.families.length >= 2)) strength = "SIGNATURE";
  if (m.amplifierOnly || (type === "TENSION" && !conditionSplit?.resolved)) strength = "SUPPORT";
  if (b.priorHeavy && strength === "SIGNATURE") strength = "MAIN";
  const diversity = Math.min(POLICY.diversityCap, (POLICY.myeongliDiversity[Math.min(m.families.length - 1, 3)] + POLICY.mbtiDiversity[Math.min(b.domains.length - 1, 2)]) / 2);
  const factors = { sideStrengthBase: POLICY.sideBase[m.band][BAND_ORDER[b.band]], contextFit: pair.fit,
    diversityFactor: diversity, sourceQualityFactor: POLICY.sourceQuality[Math.min(b.evidenceIds.length, 3)],
    specificityFactor: type === "TENSION" && !conditionSplit?.resolved ? 1 : POLICY.specificity[type], duplicationPenalty: 0,
    priorDependencyPenalty: b.priorHeavy ? POLICY.priorPenalty : 0, amplifierOnlyPenalty: m.amplifierOnly ? POLICY.amplifierPenalty : 0 };
  const c: FusionCandidate = {
    id: `fusion:${type}:${ruleId ?? m.axis}:${pair.context}:${m.axis}:${m.direction}:${b.axis}:${b.direction}`,
    type, semanticTheme, primaryAxes: fusionUnique([m.axis, b.axis]), contexts: [pair.context], primaryContext: pair.context, compatibleContexts: [pair.context],
    strength, sourceDescription, ...(ruleId ? { ruleId } : {}), ...(conditionSplit ? { conditionSplit: structuredClone(conditionSplit) } : {}),
    myeongli: { axisScores: { [m.axis]: m.score }, evidenceIds: [...m.evidenceIds], independentFamilies: [...m.families], candidateIds: [...m.candidateIds], side: structuredClone(m) },
    mbti: { axisScores: { [b.axis]: b.score }, sourceNodeIds: [...b.evidenceIds], sourceDomains: [...b.domains], actualSourceEvidenceIds: [...b.annotationIds],
      priorEvidenceIds: [...b.priorEvidenceIds], side: structuredClone(b) },
    contextFit: pair.fit, evidenceDiversity: diversity, priorHeavy: b.priorHeavy, amplifierOnly: m.amplifierOnly,
    relatedCandidateIds: [], semanticOverlapScore: 0, rankingScore: 0, rankingFactors: factors,
    metadata: { relationship: type === "REINFORCE" ? "CORRESPONDENCE" : type === "TENSION" ? "CONTRAST" : "SYNTHESIS", promotion: "CANDIDATE_ONLY", causation: false },
  };
  c.rankingScore = score(c); return c;
}
const score = (c: FusionCandidate) => {
  const f = c.rankingFactors;
  return f.sideStrengthBase * f.contextFit * f.diversityFactor * f.sourceQualityFactor * f.specificityFactor - f.duplicationPenalty - f.priorDependencyPenalty - f.amplifierOnlyPenalty;
};
const order = (a: FusionCandidate, b: FusionCandidate) => b.rankingScore - a.rankingScore || fusionOrder(a.id, b.id);
const jaccard = (a: string[], b: string[]) => { const union = new Set([...a, ...b]); return union.size ? a.filter(x => b.includes(x)).length / union.size : 0; };
export function fusionSemanticOverlap(a: FusionCandidate, b: FusionCandidate): number {
  // Opposite answers remain distinct, not duplicate conclusions.
  for (const side of ["myeongli", "mbti"] as const) if (a[side].side.axis === b[side].side.axis && a[side].side.direction !== b[side].side.direction) return 0;
  const theme = (c: FusionCandidate) => c.primaryAxes.every(x => ["DEPTH", "CURIOSITY", "PATTERN_SENSE"].includes(x)) ? "DEEP_UNDERSTANDING" : broadTheme(c.primaryAxes);
  const mShared = jaccard(a.myeongli.evidenceIds, b.myeongli.evidenceIds), bShared = jaccard(a.mbti.sourceNodeIds, b.mbti.sourceNodeIds);
  const overlap = .5 * jaccard(a.primaryAxes, b.primaryAxes) + .25 * Math.max(mShared, bShared) + (theme(a) === theme(b) ? .25 : 0);
  // Cross-context echoes must still be visible to the future scheduler. Only
  // near-identical proof sets get the full duplicate penalty across contexts.
  const contextFactor = a.primaryContext === b.primaryContext || (mShared >= .7 && bShared >= .7) ? 1 : .8;
  const value = a.type === "REINFORCE" && b.type === "REINFORCE" && theme(a) === theme(b) ? Math.max(.7, overlap)
    : a.semanticTheme === b.semanticTheme ? Math.max(.75, overlap) : overlap;
  return a.type === "TENSION" && b.type === "TENSION" && a.conditionSplit?.type !== b.conditionSplit?.type ? Math.min(.6, value * contextFactor) : value * contextFactor;
}

/** All candidates survive; only editorial ordering/links/caps change. */
export function rankFusionCandidates(input: readonly FusionCandidate[]) {
  const candidates = structuredClone([...input]).sort(order), related = new Map(candidates.map(c => [c.id, new Set<string>()]));
  const duplicates = new Map(candidates.map(c => [c.id, new Set<string>()]));
  for (let i = 0; i < candidates.length; i++) for (let j = i + 1; j < candidates.length; j++) {
    const a = candidates[i], b = candidates[j], overlap = fusionSemanticOverlap(a, b);
    if (!overlap) continue;
    // A shared axis/primary evidence is useful to the future scheduler even below near-duplicate threshold.
    if (overlap >= .25) { related.get(a.id)!.add(b.id); related.get(b.id)!.add(a.id); }
    a.semanticOverlapScore = Math.max(a.semanticOverlapScore, overlap); b.semanticOverlapScore = Math.max(b.semanticOverlapScore, overlap);
    if (overlap >= POLICY.duplicateThreshold) { duplicates.get(a.id)!.add(b.id); duplicates.get(b.id)!.add(a.id); }
  }
  const seen = new Set<string>(), duplicateGroups: { id: string; candidateIds: string[] }[] = [];
  for (const c of candidates) {
    c.relatedCandidateIds = fusionUnique([...related.get(c.id)!]);
    if (seen.has(c.id) || !duplicates.get(c.id)!.size) continue;
    const queue = [c.id], members = new Set<string>();
    while (queue.length) { const id = queue.pop()!; if (members.has(id)) continue; members.add(id); seen.add(id); queue.push(...duplicates.get(id)!); }
    const ids = fusionUnique([...members]), groupId = `fusion-duplicate:${ids[0]}`;
    const group = candidates.filter(v => members.has(v.id));
    for (const [i, v] of group.entries()) {
      v.duplicateGroupId = groupId;
      // Only a DIRECT stronger near-duplicate suppresses a reinforce signature.
      if (v.type === "REINFORCE" && v.strength === "SIGNATURE" && group.slice(0, i).some(other => duplicates.get(v.id)!.has(other.id))) v.strength = "MAIN";
      v.rankingFactors.duplicationPenalty = i ? POLICY.duplicatePenalty : 0; v.rankingScore = score(v);
    }
    duplicateGroups.push({ id: groupId, candidateIds: ids });
  }
  return { candidates: candidates.sort(order), duplicateGroups: duplicateGroups.sort((a, b) => fusionOrder(a.id, b.id)) };
}
