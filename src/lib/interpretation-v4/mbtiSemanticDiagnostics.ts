import { MBTI_DOMAIN_CONTEXTS, semanticOrder, type MbtiDiagnostic, type MbtiSourceNode, type MbtiSourceDomain, type MbtiType } from "./mbtiSemanticCore";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";

export function mbtiAnnotationCoverage(nodes: readonly MbtiSourceNode[]) {
  const count = (group: readonly MbtiSourceNode[]) => {
    const metadataNodes = group.filter(n => n.classification === "METADATA").length;
    const unclassifiedNodes = group.filter(n => n.classification === "UNCLASSIFIED").length;
    const totalSemanticNodes = group.length - metadataNodes;
    return { totalNodes: group.length, totalSemanticNodes,
      scoringAnnotatedNodes: group.filter(n => n.classification === "SCORING_SEMANTIC").length,
      referenceOnlyNodes: group.filter(n => n.classification === "REFERENCE_ONLY").length, metadataNodes, unclassifiedNodes,
      classifiedPercentage: totalSemanticNodes ? 100 * (totalSemanticNodes - unclassifiedNodes) / totalSemanticNodes : 100 };
  };
  return { ...count(nodes), domainCoverage: Object.fromEntries(Object.keys(MBTI_DOMAIN_CONTEXTS).sort(semanticOrder).map(domain => [domain, count(nodes.filter(n => n.sourceDomain === domain))])) as Record<MbtiSourceDomain, ReturnType<typeof count>> };
}
export type MbtiAnnotationCoverage = ReturnType<typeof mbtiAnnotationCoverage>;
export function mbtiSemanticDiagnostics(type: MbtiType | null, nodes: readonly MbtiSourceNode[], hardErrors: MbtiDiagnostic[], sourceFileFound: boolean) {
  const coverage = { mbtiType: type, ...mbtiAnnotationCoverage(nodes),
    invalidAnnotations: hardErrors.filter(e => /ANNOTATION|AXIS|WEIGHT|CONTEXT|SCORING|SOURCE_TYPE/.test(e.code)) };
  const warnings: MbtiDiagnostic[] = [];
  for (const [code, predicate] of [
    ["METADATA_NOT_SCORED", (n: MbtiSourceNode) => n.classification === "METADATA"],
    ["REFERENCE_ONLY_NOT_SCORED", (n: MbtiSourceNode) => n.classification === "REFERENCE_ONLY"],
    ["DOMAIN_CONTEXT_ONLY", (n: MbtiSourceNode) => n.classification === "SCORING_SEMANTIC" && ["CAREER", "WORK", "MONEY", "INVESTMENT", "STUDY", "LOVE", "MARRIAGE", "PARENTS", "CHILDREN"].includes(n.sourceDomain ?? "")],
  ] as const) {
    const ids = nodes.filter(predicate).map(n => n.id).sort(semanticOrder);
    if (ids.length) warnings.push({ code, sourceNodeIds: ids });
  }
  if (!type && !hardErrors.length) warnings.push({ code: "MBTI_UNAVAILABLE", sourceNodeIds: [] });
  for (const [domain, c] of Object.entries(coverage.domainCoverage)) {
    if (c.totalSemanticNodes && !c.scoringAnnotatedNodes) warnings.push({ code: "DOMAIN_REFERENCE_ONLY", sourceNodeIds: [], detail: domain });
  }
  return { mbtiType: type, sourceFileFound, coverage, domainCoverage: coverage.domainCoverage,
    unclassifiedSemanticNodes: nodes.filter(n => n.classification === "UNCLASSIFIED").map(n => n.id),
    invalidAxisAnnotations: hardErrors.filter(e => ["INVALID_SEMANTIC_AXIS", "INVALID_AXIS_MAGNITUDE", "NEGATIVE_STRENGTH_AXIS"].includes(e.code)).flatMap(e => e.sourceNodeIds),
    duplicateSourceNodeIds: hardErrors.filter(e => e.code === "DUPLICATE_SOURCE_NODE_ID").flatMap(e => e.sourceNodeIds),
    referenceOnlyCount: coverage.referenceOnlyNodes, scoringAnnotationCount: coverage.scoringAnnotatedNodes,
    warnings, hardErrors: [...hardErrors].sort((a, b) => semanticOrder(`${a.code}:${a.sourceNodeIds}`, `${b.code}:${b.sourceNodeIds}`)) };
}
export type MbtiSemanticDiagnostics = ReturnType<typeof mbtiSemanticDiagnostics>;

/** Internal, plain serializable data; not a Book/customer projection. */
export function buildMbtiSemanticDebugView(profile: MbtiSemanticProfile) {
  return structuredClone({ version: profile.version, mbtiType: profile.mbtiType, dimensionPriors: profile.dimensionPriors,
    topGeneralAxes: Object.entries(profile.generalAxes).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || semanticOrder(a[0], b[0])),
    priorAxes: profile.priorAxes, sourceAxes: profile.sourceAxes, contextAxes: profile.contextAxes,
    topContributors: [...profile.contributions].sort((a, b) => Math.abs(b.effectiveValue) - Math.abs(a.effectiveValue) || semanticOrder(`${a.sourceNodeId}:${a.axis}`, `${b.sourceNodeId}:${b.axis}`)),
    domainCoverage: profile.diagnostics.domainCoverage, referenceOnlySources: profile.sourceNodes.filter(n => n.classification === "REFERENCE_ONLY"), diagnostics: profile.diagnostics });
}
