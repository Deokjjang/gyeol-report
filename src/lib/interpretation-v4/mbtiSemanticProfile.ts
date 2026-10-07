import { SEMANTIC_AXES, type SemanticSignature } from "./semanticCore";
import { buildMbtiDimensionPriors, parseSemanticMbtiType } from "./mbtiDimensionPriors";
import { inventoryMbtiSource, readMbtiSemanticSource } from "./mbtiSourceAdapter";
import { annotateMbtiSource, validateMbtiAnnotations } from "./mbtiSemanticAnnotations";
import { mbtiSemanticDiagnostics, type MbtiSemanticDiagnostics } from "./mbtiSemanticDiagnostics";
import { GENERAL_MBTI_DOMAINS, MBTI_SEMANTIC_ANNOTATION_VERSION, MBTI_WEIGHT_CLASSES, semanticOrder,
  type InterpretationContext, type MbtiContribution, type MbtiSemanticAnnotation, type MbtiSourceNode, type MbtiType, type SemanticAxis } from "./mbtiSemanticCore";

const CONTEXTS: readonly InterpretationContext[] = ["identity", "work", "money", "social", "love", "stress", "learning", "recovery"];
export type MbtiAxisSupport = {
  net: number; positiveMagnitude: number; negativeMagnitude: number;
  sourceNodeIds: string[]; sourceDomains: string[]; sourceTypes: string[]; sourceDomainDiversity: number;
};
export type MbtiAxisLedger = { axes: Record<SemanticAxis, number>; support: Record<SemanticAxis, MbtiAxisSupport> };
export type MbtiSemanticProfile = {
  version: typeof MBTI_SEMANTIC_ANNOTATION_VERSION; mbtiType: MbtiType | null; available: boolean;
  dimensionPriors: MbtiSemanticAnnotation[]; annotations: MbtiSemanticAnnotation[]; sourceNodes: MbtiSourceNode[]; sourceMetadata: Record<string, unknown>;
  priorAxes: SemanticSignature; sourceAxes: SemanticSignature; generalAxes: SemanticSignature;
  contextAxes: Partial<Record<InterpretationContext, SemanticSignature>>;
  priorSupport: Partial<Record<SemanticAxis, MbtiAxisSupport>>; sourceSupport: Partial<Record<SemanticAxis, MbtiAxisSupport>>;
  generalSupport: Partial<Record<SemanticAxis, MbtiAxisSupport>>;
  contextSupport: Partial<Record<InterpretationContext, Partial<Record<SemanticAxis, MbtiAxisSupport>>>>;
  contributions: MbtiContribution[]; diagnostics: MbtiSemanticDiagnostics;
};

/** No normalization, clipping or hidden weighting. Opposite signs remain visible. */
export function aggregateMbtiContributions(input: readonly MbtiContribution[]): MbtiAxisLedger {
  const support = Object.fromEntries(SEMANTIC_AXES.map(axis => {
    const rows = input.filter(c => c.axis === axis).sort((a, b) => semanticOrder(a.sourceNodeId, b.sourceNodeId));
    const positiveMagnitude = rows.reduce((n, c) => n + Math.max(0, c.effectiveValue), 0);
    const negativeMagnitude = rows.reduce((n, c) => n + Math.max(0, -c.effectiveValue), 0);
    const sourceDomains = [...new Set(rows.filter(c => c.sourceType !== "dimension_prior").map(c => c.sourceDomain))].sort(semanticOrder);
    return [axis, { net: positiveMagnitude - negativeMagnitude, positiveMagnitude, negativeMagnitude,
      sourceNodeIds: [...new Set(rows.map(c => c.sourceNodeId))].sort(semanticOrder), sourceDomains,
      sourceTypes: [...new Set(rows.map(c => c.sourceType))].sort(semanticOrder), sourceDomainDiversity: sourceDomains.length }];
  })) as Record<SemanticAxis, MbtiAxisSupport>;
  return { axes: Object.fromEntries(SEMANTIC_AXES.map(axis => [axis, support[axis].net])) as Record<SemanticAxis, number>, support };
}

export type MbtiProfileResult = { ok: true; value: MbtiSemanticProfile } | { ok: false; diagnostics: MbtiSemanticDiagnostics };
const unavailable = (): MbtiSemanticProfile => ({ version: MBTI_SEMANTIC_ANNOTATION_VERSION, mbtiType: null, available: false,
  dimensionPriors: [], annotations: [], sourceNodes: [], sourceMetadata: {}, priorAxes: {}, sourceAxes: {}, generalAxes: {}, contextAxes: {},
  priorSupport: {}, sourceSupport: {}, generalSupport: {}, contextSupport: {}, contributions: [], diagnostics: mbtiSemanticDiagnostics(null, [], [], false) });

/** Source-only boundary for explicit source-review fixtures. It does not accept
 * a MyeongliSemanticProfile, birth input, calculation result or writer packet. */
export function projectMbtiSemanticProfile(typeInput: unknown, source: unknown, reviewedAnnotations?: readonly MbtiSemanticAnnotation[]): MbtiProfileResult {
  const parsed = parseSemanticMbtiType(typeInput);
  if (!parsed.ok) return { ok: false, diagnostics: mbtiSemanticDiagnostics(null, [], [{ code: parsed.error, sourceNodeIds: [] }], false) };
  if (!parsed.type) return { ok: true, value: unavailable() };
  const type = parsed.type, inventory = inventoryMbtiSource(type, source), reviewed = annotateMbtiSource(type, inventory.nodes);
  const annotations = structuredClone(reviewedAnnotations ? [...reviewedAnnotations] : reviewed.annotations).sort((a, b) => semanticOrder(a.id, b.id));
  const hardErrors = [...inventory.hardErrors, ...reviewed.hardErrors, ...validateMbtiAnnotations(type, reviewed.nodes, annotations)];
  const diagnostics = mbtiSemanticDiagnostics(type, reviewed.nodes, hardErrors, source !== null && source !== undefined);
  if (hardErrors.length) return { ok: false, diagnostics };
  const dimensionPriors = buildMbtiDimensionPriors(type), nodes = new Map(reviewed.nodes.map(n => [n.id, n]));
  const contributions: MbtiContribution[] = [...dimensionPriors, ...annotations].flatMap(a => Object.entries(a.axes).map(([axis, rawValue]) => {
    const n = nodes.get(a.sourceNodeId);
    return { axis: axis as SemanticAxis, sourceNodeId: a.sourceNodeId, mbtiType: type, sourceDomain: a.sourceDomain, sourceType: a.sourceType,
      weightClass: a.weightClass, rawValue, effectiveValue: rawValue * MBTI_WEIGHT_CLASSES[a.weightClass], annotationConfidence: a.annotationConfidence,
      contexts: [...a.contexts], ...(n ? { sourcePath: n.sourcePath, ...(n.sourceCoverage ? { sourceCoverage: n.sourceCoverage } : {}) } : {}) };
  })).sort((a, b) => semanticOrder(`${a.sourceNodeId}:${a.axis}`, `${b.sourceNodeId}:${b.axis}`));
  const prior = aggregateMbtiContributions(contributions.filter(c => c.sourceType === "dimension_prior"));
  // sourceAxes means general SOURCE ONLY, not an all-domain personality sum.
  const generalSource = contributions.filter(c => c.sourceType !== "dimension_prior" && GENERAL_MBTI_DOMAINS.includes(c.sourceDomain));
  const sourceLedger = aggregateMbtiContributions(generalSource);
  const general = aggregateMbtiContributions([...generalSource, ...contributions.filter(c => c.sourceType === "dimension_prior")]);
  const contextLedgers = CONTEXTS.map(context => [context, aggregateMbtiContributions(contributions.filter(c => c.sourceType !== "dimension_prior" && c.contexts.includes(context)))] as const);
  return { ok: true, value: { version: MBTI_SEMANTIC_ANNOTATION_VERSION, mbtiType: type, available: true,
    dimensionPriors, annotations, sourceNodes: reviewed.nodes, sourceMetadata: inventory.sourceMetadata,
    priorAxes: prior.axes, sourceAxes: sourceLedger.axes, generalAxes: general.axes, priorSupport: prior.support, sourceSupport: sourceLedger.support, generalSupport: general.support,
    contextAxes: Object.fromEntries(contextLedgers.map(([c, l]) => [c, l.axes])), contextSupport: Object.fromEntries(contextLedgers.map(([c, l]) => [c, l.support])),
    contributions, diagnostics } };
}

export function buildMbtiSemanticProfile(typeInput: unknown): MbtiProfileResult {
  const parsed = parseSemanticMbtiType(typeInput);
  if (!parsed.ok) return { ok: false, diagnostics: mbtiSemanticDiagnostics(null, [], [{ code: parsed.error, sourceNodeIds: [] }], false) };
  if (!parsed.type) return { ok: true, value: unavailable() };
  const read = readMbtiSemanticSource(parsed.type);
  if (!read.ok) return { ok: false, diagnostics: mbtiSemanticDiagnostics(parsed.type, [], [{ code: read.error, sourceNodeIds: [] }], read.error === "MBTI_SOURCE_PARSE_FAILED") };
  return projectMbtiSemanticProfile(parsed.type, read.source);
}
