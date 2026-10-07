import { SEMANTIC_AXES, BIPOLAR_AXES, type SemanticAxis, type EvidenceAtom } from "./semanticCore";
import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import { isMeaningfulEvidence } from "./foundationRanking";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { MBTI_WEIGHT_CLASSES } from "./mbtiSemanticCore";
import { validateMbtiAnnotations } from "./mbtiSemanticAnnotations";
import { FUSION_CONTEXTS } from "./fusionContext";
import { fusionUnique, fusionOrder, type FusionSide, type FusionScope, type FusionIssue, type FusionProof } from "./fusionCore";

const SCOPES: readonly FusionScope[] = ["general", ...FUSION_CONTEXTS.filter(c => c !== "identity")];
const matches = (contexts: readonly string[], scope: FusionScope) => contexts.includes(scope === "general" ? "identity" : scope);
const directions = (axis: SemanticAxis): readonly (1 | -1)[] => (BIPOLAR_AXES as readonly string[]).includes(axis) ? [1, -1] : [1];
const emptySide = (system: FusionSide["system"], axis: SemanticAxis, direction: 1 | -1, scope: FusionScope): FusionSide => ({
  system, axis, direction, scope, band: "NONE", axisRank: 0, score: 0, priorScore: 0, evidenceIds: [], candidateIds: [], annotationIds: [],
  priorEvidenceIds: [], families: [], domains: [], proofs: [], exactEvidenceIds: [], amplifierOnly: false, priorHeavy: false,
});

/** Consume 1D's support/ranking, never reclassify element or ten-god strength. */
export function adaptMyeongliFusionSide(profile: MyeongliSemanticProfile): FusionSide[] {
  const result: FusionSide[] = [], ranked = [...profile.dominantAxes, ...profile.supportingAxes];
  for (const axis of SEMANTIC_AXES) for (const direction of directions(axis)) {
    const meaningful = profile.evidence.filter(e => isMeaningfulEvidence(e) && Math.sign(e.axes[axis] ?? 0) === direction);
    for (const scope of SCOPES) {
      const exact = meaningful.filter(e => matches(e.contexts, scope));
      if (!exact.length) continue;
      const rows = meaningful.filter(e => matches(e.contexts, scope) || matches(e.contexts, "general")).sort((a, b) => fusionOrder(a.id, b.id));
      const side = emptySide("myeongli", axis, direction, scope);
      side.evidenceIds = rows.map(e => e.id); side.exactEvidenceIds = exact.map(e => e.id).sort(fusionOrder);
      side.families = fusionUnique(rows.map(e => e.family));
      side.amplifierOnly = rows.every(e => e.tier === "AMPLIFIER");
      side.score = rows.reduce((sum, e) => sum + e.axes[axis]! * e.weight, 0);
      side.proofs = rows.map(e => ({ id: e.id, axis, value: e.axes[axis]! * e.weight, contexts: fusionUnique(e.contexts), family: e.family,
        quality: `${e.tier}:${e.strength}`, ...(typeof e.metadata?.canonicalConfidence === "number" ? { confidence: e.metadata.canonicalConfidence } : {}) }));
      // A globally strong candidate must not lend its rank to unrelated local evidence.
      const candidates = profile.rankedCandidates.filter(c => !c.supportOnly && c.primaryAxes.includes(axis) && c.evidenceIds.every(id => side.evidenceIds.includes(id)));
      side.candidateIds = fusionUnique(candidates.map(c => c.id));
      side.axisRank = ranked.findIndex(a => a.axis === axis) + 1;
      const dominant = profile.dominantAxes.some(a => a.axis === axis);
      side.band = side.amplifierOnly ? "SUPPORT" : candidates.some(c => c.rank === "SIGNATURE" || c.synthesisDepth >= 4) || (dominant && side.families.length >= 2)
        ? "STRONG" : dominant || candidates.some(c => c.rank === "MAIN" || c.synthesisDepth >= 3) ? "MAIN" : "SUPPORT";
      result.push(side);
    }
  }
  return result;
}

/** Read only real scoring contributions. Priors are a separate supplemental
 * ledger and cannot create a side, a direction, a context or a strength band.
 * 2A's general sum also contains social/stress domains: those keep their actual
 * contexts here, rather than being relabelled identity for every product. */
export function adaptMbtiFusionSide(profile: MbtiSemanticProfile): { sides: FusionSide[]; priorOnly: FusionIssue[] } {
  const sides: FusionSide[] = [], priorOnly: FusionIssue[] = [];
  const annotations = new Map(profile.annotations.filter(a => a.sourceType !== "reference_only").map(a => [a.sourceNodeId, a]));
  const rank = SEMANTIC_AXES.map(axis => ({ axis, value: Math.abs(profile.sourceAxes[axis] ?? 0) })).sort((a, b) => b.value - a.value || fusionOrder(a.axis, b.axis));
  for (const axis of SEMANTIC_AXES) for (const direction of directions(axis)) {
    const actual = profile.contributions.filter(c => c.axis === axis && c.sourceType !== "dimension_prior" && c.sourceType !== "reference_only" && Math.sign(c.effectiveValue) === direction);
    const priors = profile.contributions.filter(c => c.axis === axis && c.sourceType === "dimension_prior" && Math.sign(c.effectiveValue) === direction);
    if (!actual.length && priors.length) priorOnly.push({ code: "PRIOR_ONLY_SUPPRESSED", refs: fusionUnique(priors.map(c => c.sourceNodeId)), detail: `${axis}:${direction}` });
    for (const scope of SCOPES) {
      const exact = actual.filter(c => matches(c.contexts, scope));
      if (!exact.length) continue;
      const rows = actual.filter(c => matches(c.contexts, scope) || matches(c.contexts, "general")).sort((a, b) => fusionOrder(a.sourceNodeId, b.sourceNodeId));
      const side = emptySide("mbti", axis, direction, scope);
      side.evidenceIds = fusionUnique(rows.map(c => c.sourceNodeId)); side.exactEvidenceIds = fusionUnique(exact.map(c => c.sourceNodeId));
      side.domains = fusionUnique(rows.map(c => c.sourceDomain)); side.families = [...side.evidenceIds];
      side.annotationIds = fusionUnique(rows.map(c => annotations.get(c.sourceNodeId)!.id));
      side.score = rows.reduce((sum, c) => sum + c.effectiveValue, 0);
      side.priorScore = priors.reduce((sum, c) => sum + c.effectiveValue, 0);
      side.priorEvidenceIds = fusionUnique(priors.map(c => c.sourceNodeId));
      side.priorHeavy = Math.abs(side.priorScore) > Math.abs(side.score);
      side.axisRank = rank.findIndex(r => r.axis === axis) + 1;
      side.proofs = rows.map(c => ({ id: c.sourceNodeId, axis, value: c.effectiveValue, contexts: fusionUnique(c.contexts),
        family: c.sourceNodeId, domain: c.sourceDomain, quality: c.weightClass }));
      side.band = side.evidenceIds.length >= 3 && rows.some(c => ["SPECIFIC_TRAIT", "DIRECT_BEHAVIOR"].includes(c.weightClass))
        ? "STRONG" : side.evidenceIds.length >= 2 ? "MAIN" : "SUPPORT";
      sides.push(side);
    }
  }
  return { sides, priorOnly };
}

export function fusionProofsForAxis(sides: readonly FusionSide[], system: FusionSide["system"], axis: SemanticAxis, direction: number, scope: FusionScope): FusionProof[] {
  const proof = sides.filter(s => s.system === system && s.axis === axis && s.direction === direction && (s.scope === scope || s.scope === "general")).flatMap(s => s.proofs);
  return [...new Map(proof.map(p => [p.id, p])).values()].sort((a, b) => fusionOrder(a.id, b.id));
}

export const validFusionAxis = (axis: string) => (SEMANTIC_AXES as readonly string[]).includes(axis);
export const validFusionContexts = (values: readonly string[]) => values.length > 0 && values.every(c => (FUSION_CONTEXTS as readonly string[]).includes(c));
const forbiddenDomains = new Set(["MYEONGLI_BRIDGE_HINT", "RELATIONSHIP_PAIR", "RECOMMENDED_JOBS", "AVOID_JOBS_OR_ENVIRONMENTS"]);
/** An internal typed boundary still fails closed on forged/stale references. */
export function inspectFusionInputs(m: MyeongliSemanticProfile, b: MbtiSemanticProfile): FusionIssue[] {
  const errors: FusionIssue[] = [], fail = (code: string, refs: string[]) => errors.push({ code, refs });
  if (m.diagnostics.hardErrors.length || b.diagnostics.hardErrors.length) fail("INVALID_SOURCE_PROFILE", []);
  if (b.available && !b.mbtiType) fail("MISSING_MBTI_TYPE", []);
  if (!b.available && (b.mbtiType || b.contributions.length || b.annotations.length || b.dimensionPriors.length)) fail("INVALID_UNAVAILABLE_MBTI", []);
  if (b.mbtiType) errors.push(...validateMbtiAnnotations(b.mbtiType, b.sourceNodes, b.annotations).map(e => ({ code: e.code, refs: e.sourceNodeIds })));
  const atoms = new Map<string, EvidenceAtom>();
  for (const e of m.evidence) {
    if (atoms.has(e.id)) fail("DUPLICATE_MYEONGLI_EVIDENCE", [e.id]); atoms.set(e.id, e);
    if (!validFusionContexts(e.contexts)) fail("INVALID_CONTEXT", [e.id]);
    for (const [axis, v] of Object.entries(e.axes)) if (!validFusionAxis(axis) || !Number.isFinite(v) || (!(BIPOLAR_AXES as readonly string[]).includes(axis) && v < 0)) fail("INVALID_AXIS", [e.id, axis]);
  }
  for (const [axis, value] of Object.entries(m.axes)) if (!validFusionAxis(axis) || !Number.isFinite(value)) fail("INVALID_AXIS", [axis]);
  for (const c of m.rankedCandidates) {
    if (c.evidenceIds.some(id => !atoms.has(id))) fail("MISSING_MYEONGLI_EVIDENCE", [c.id]);
    if (c.primaryAxes.some(a => !validFusionAxis(a))) fail("INVALID_AXIS", [c.id]);
  }
  const nodes = new Map(b.sourceNodes.map(n => [n.id, n])), annotations = new Map(b.annotations.map(a => [a.sourceNodeId, a]));
  const prior = new Map(b.dimensionPriors.map(a => [a.sourceNodeId, a])), seen = new Set<string>();
  for (const c of b.contributions) {
    const key = `${c.sourceNodeId}:${c.axis}`;
    if (seen.has(key)) fail("DUPLICATE_MBTI_CONTRIBUTION", [key]); seen.add(key);
    if (!validFusionAxis(c.axis) || !Number.isFinite(c.effectiveValue) || !Number.isFinite(c.rawValue) || (!(BIPOLAR_AXES as readonly string[]).includes(c.axis) && c.rawValue < 0)) fail("INVALID_AXIS", [key]);
    if (!validFusionContexts(c.contexts)) fail("INVALID_CONTEXT", [key]);
    const p = c.sourceType === "dimension_prior", a = (p ? prior : annotations).get(c.sourceNodeId), n = nodes.get(c.sourceNodeId);
    if (!p && (!n || n.classification !== "SCORING_SEMANTIC" || forbiddenDomains.has(c.sourceDomain) || forbiddenDomains.has(n.sourceDomain ?? ""))) fail("NON_SCORING_MBTI_SOURCE", [key]);
    // 2A scores reviewed primary trait statements only. A reference cannot be
    // laundered by changing its domain/classification while retaining its path.
    if (!p && n && (!n.sourcePath.startsWith("/traits/") || !n.sourcePath.endsWith("/plainKo"))) fail("NON_PRIMARY_MBTI_SOURCE", [key]);
    if (!a || a.axes[c.axis] !== c.rawValue || a.sourceType !== c.sourceType || a.weightClass !== c.weightClass ||
      a.sourceDomain !== c.sourceDomain || c.mbtiType !== b.mbtiType || a.mbtiType !== b.mbtiType ||
      a.annotationConfidence !== c.annotationConfidence || JSON.stringify(fusionUnique(a.contexts)) !== JSON.stringify(fusionUnique(c.contexts)) ||
      c.effectiveValue !== c.rawValue * MBTI_WEIGHT_CLASSES[c.weightClass] || (!p && (n?.sourceDomain !== c.sourceDomain || c.sourceType === "reference_only"))) fail("INVALID_MBTI_CONTRIBUTION", [key]);
  }
  for (const a of [...b.annotations, ...b.dimensionPriors]) for (const axis of Object.keys(a.axes)) if (!seen.has(`${a.sourceNodeId}:${axis}`)) fail("MISSING_MBTI_CONTRIBUTION", [a.id, axis]);
  return errors;
}
