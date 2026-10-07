import { expect } from "vitest";
import { integrateMyeongliFoundation, type MyeongliSemanticProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { aggregateMbtiContributions, buildMbtiSemanticProfile, type MbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { buildMbtiDimensionPriors } from "../../../src/lib/interpretation-v4/mbtiDimensionPriors";
import { MBTI_DOMAIN_CONTEXTS, MBTI_WEIGHT_CLASSES, type MbtiSourceDomain, type MbtiType, type MbtiSemanticAnnotation, type MbtiWeightClass } from "../../../src/lib/interpretation-v4/mbtiSemanticCore";
import type { SemanticSignature, EvidenceAtom } from "../../../src/lib/interpretation-v4/semanticCore";
import { buildMyeongliMbtiFusion } from "../../../src/lib/interpretation-v4/fusionSemanticProfile";
import type { FusionResult } from "../../../src/lib/interpretation-v4/fusionCore";

export const myAtom = (id: string, axes: SemanticSignature, extra: Partial<EvidenceAtom> = {}): EvidenceAtom => ({
  id, sourceType: "ten_god", sourceKey: id, tier: "CORE", kind: "TRAIT", strength: "STRONG", weight: 1,
  family: id, axes, contexts: ["identity"], easyMeaning: "검토한 명리 근거", metadata: { provenance: [`explicit-normalized-fixture:${id}`] }, ...extra,
});
export function myProfile(evidence: EvidenceAtom[]): MyeongliSemanticProfile {
  const result = integrateMyeongliFoundation({ evidence, synthesisCandidates: [] });
  if (!result.ok) return expect.unreachable(JSON.stringify(result.diagnostics.hardErrors));
  return result.value;
}
export type MbtiSpec = { axes: SemanticSignature; domain?: MbtiSourceDomain; weight?: MbtiWeightClass };
/** Explicit normalized scoring fixtures; real 16-type sanity tests are separate. */
export function mbtiProfile(specs: MbtiSpec[], type: MbtiType = "ENTJ", withPrior = false): MbtiSemanticProfile {
  const empty = buildMbtiSemanticProfile(undefined); if (!empty.ok) return expect.unreachable();
  const p = empty.value; p.available = true; p.mbtiType = type;
  p.dimensionPriors = withPrior ? buildMbtiDimensionPriors(type) : [];
  p.annotations = specs.map((s, i): MbtiSemanticAnnotation => {
    const domain = s.domain ?? "IDENTITY", id = `explicit:${type}:trait:${i}`;
    const specific = ["WORK", "CAREER", "MONEY", "LOVE", "MARRIAGE", "STUDY", "INVESTMENT", "PARENTS", "CHILDREN"].includes(domain);
    return { id: `${id}:annotation`, mbtiType: type, sourceNodeId: id, sourceDomain: domain,
      sourceType: specific ? "domain_trait" : "source_trait",
      weightClass: s.weight ?? (specific ? "DOMAIN_SPECIFIC" : "SPECIFIC_TRAIT"), contexts: [...MBTI_DOMAIN_CONTEXTS[domain]], axes: { ...s.axes }, annotationConfidence: "DIRECT" };
  });
  p.sourceNodes = p.annotations.map(a => ({ id: a.sourceNodeId, mbtiType: type, sourceDomain: a.sourceDomain,
    sourcePath: `/traits/${a.sourceDomain}/${a.sourceNodeId}/plainKo`, stablePath: a.sourceNodeId, value: "명시적 행동 근거", classification: "SCORING_SEMANTIC", reason: "EXPLICIT_NORMALIZED_FIXTURE" }));
  p.contributions = [...p.annotations, ...p.dimensionPriors].flatMap(a => Object.entries(a.axes).map(([axis, rawValue]) => ({
    axis: axis as keyof SemanticSignature, rawValue, effectiveValue: rawValue * MBTI_WEIGHT_CLASSES[a.weightClass], sourceNodeId: a.sourceNodeId,
    mbtiType: type, sourceDomain: a.sourceDomain, sourceType: a.sourceType, weightClass: a.weightClass, contexts: [...a.contexts], annotationConfidence: a.annotationConfidence,
  })));
  const source = aggregateMbtiContributions(p.contributions.filter(c => c.sourceType !== "dimension_prior")), prior = aggregateMbtiContributions(p.contributions.filter(c => c.sourceType === "dimension_prior"));
  p.sourceAxes = source.axes; p.sourceSupport = source.support; p.priorAxes = prior.axes; p.priorSupport = prior.support;
  return p;
}
export function realMbti(type: unknown): MbtiSemanticProfile {
  const result = buildMbtiSemanticProfile(type); if (!result.ok) return expect.unreachable(JSON.stringify(result.diagnostics.hardErrors)); return result.value;
}
export const fusionValue = (result: FusionResult) => { if (!result.ok) return expect.unreachable(JSON.stringify(result.diagnostics.hardErrors)); return result.value; };
export const fuse = (m: MyeongliSemanticProfile, b: MbtiSemanticProfile) => fusionValue(buildMyeongliMbtiFusion(m, b));
export const repeated = (axes: SemanticSignature, count = 3, domain: MbtiSourceDomain = "THINKING"): MbtiSpec[] => Array.from({ length: count }, () => ({ axes, domain }));
