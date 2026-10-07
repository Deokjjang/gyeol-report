import { NT_ANNOTATIONS } from "./mbtiAnnotationsNT";
import { NF_ANNOTATIONS } from "./mbtiAnnotationsNF";
import { SJ_ANNOTATIONS } from "./mbtiAnnotationsSJ";
import { SP_ANNOTATIONS } from "./mbtiAnnotationsSP";
import { BIPOLAR_AXES, SEMANTIC_AXES, type SemanticSignature } from "./semanticCore";
import { GENERAL_MBTI_DOMAINS, MBTI_DOMAIN_CONTEXTS, MBTI_WEIGHT_CLASSES, semanticOrder,
  type MbtiDiagnostic, type MbtiSemanticAnnotation, type MbtiSourceNode, type MbtiType, type TypeAnnotationManifest } from "./mbtiSemanticCore";

export const MBTI_SOURCE_ANNOTATIONS = { ...NT_ANNOTATIONS, ...NF_ANNOTATIONS, ...SJ_ANNOTATIONS, ...SP_ANNOTATIONS } as const satisfies Record<MbtiType, TypeAnnotationManifest>;
// Only reviewed, directly described recurring actions receive the exceptional 2.0 weight.
const DIRECT_BEHAVIORS = new Set([
  "mbti:ENTP:traits:communication:direct_speech:plainKo",
  "mbti:ESTJ:traits:communication:direct_speech:plainKo",
  "mbti:ISTP:traits:communication:few_words_direct:plainKo",
  "mbti:INFJ:traits:communication:indirect_expression:plainKo",
]);

/** Materialize explicit IDs, not words or type-name stereotypes. Each plainKo
 * contains the primary statement; alternative realization/application leaves
 * remain independently inventoried references rather than duplicate votes. */
export function annotateMbtiSource(type: MbtiType, input: readonly MbtiSourceNode[]) {
  const nodes = input.map(n => ({ ...n })), annotations: MbtiSemanticAnnotation[] = [], hardErrors: MbtiDiagnostic[] = [];
  const manifest: TypeAnnotationManifest = MBTI_SOURCE_ANNOTATIONS[type];
  const entries = new Map(Object.entries(manifest).map(([key, entry]) => [`mbti:${type}:traits:${key}:plainKo`, entry]));
  const present = new Set(nodes.map(n => n.id));
  for (const id of entries.keys()) if (!present.has(id)) hardErrors.push({ code: "ANNOTATION_SOURCE_MISSING", sourceNodeIds: [id] });
  for (const node of nodes) {
    const entry = entries.get(node.id);
    if (entry && typeof entry !== "string" && node.classification === "UNCLASSIFIED" && node.sourceDomain) {
      const axes: SemanticSignature = {};
      for (let i = 0; i < entry.length; i += 2) {
        const axis = entry[i] as keyof SemanticSignature;
        if (Object.hasOwn(axes, axis)) hardErrors.push({ code: "DUPLICATE_NODE_AXIS", sourceNodeIds: [node.id] });
        axes[axis] = entry[i + 1] as number;
      }
      const general = GENERAL_MBTI_DOMAINS.includes(node.sourceDomain);
      node.classification = "SCORING_SEMANTIC"; node.reason = "REVIEWED_PRIMARY_STATEMENT";
      annotations.push({ id: `${node.id}:annotation`, mbtiType: type, sourceNodeId: node.id, sourceDomain: node.sourceDomain,
        sourceType: general ? "source_trait" : "domain_trait", axes, contexts: [...MBTI_DOMAIN_CONTEXTS[node.sourceDomain]],
        weightClass: !general ? "DOMAIN_SPECIFIC" : DIRECT_BEHAVIORS.has(node.id) ? "DIRECT_BEHAVIOR" : node.sourceDomain === "IDENTITY" || node.sourceDomain === "STRENGTHS" ? "GENERAL_TRAIT" : "SPECIFIC_TRAIT",
        annotationConfidence: node.sourceCoverage === "direct" ? "DIRECT" : "SUPPORTED",
        metadata: { sourceCoverage: node.sourceCoverage ?? "unspecified", annotationBasis: "MANUAL_SOURCE_REVIEW" },
      });
    } else if (typeof entry === "string") {
      node.classification = "REFERENCE_ONLY"; node.reason = entry === "ADVICE" ? "PURE_ADVICE_NOT_CURRENT_TRAIT" : "NO_PRECISE_SUPPORTED_AXIS";
    }
    if (node.classification === "REFERENCE_ONLY" && node.sourceDomain) annotations.push({
      id: `${node.id}:reference`, mbtiType: type, sourceNodeId: node.id, sourceDomain: node.sourceDomain, sourceType: "reference_only",
      axes: {}, contexts: [], weightClass: "REFERENCE_ONLY", annotationConfidence: "REFERENCE_ONLY", metadata: { reason: node.reason },
    });
  }
  return { nodes, annotations: annotations.sort((a, b) => semanticOrder(a.id, b.id)), hardErrors };
}

/** Fail closed before aggregation, including caller-supplied review annotations. */
export function validateMbtiAnnotations(type: MbtiType, nodes: readonly MbtiSourceNode[], annotations: readonly MbtiSemanticAnnotation[]): MbtiDiagnostic[] {
  const errors: MbtiDiagnostic[] = [], byId = new Map(nodes.map(n => [n.id, n])), ids = new Set<string>(), nodeAxes = new Set<string>();
  const annotated = new Set<string>();
  const fail = (code: string, id: string) => errors.push({ code, sourceNodeIds: [id] });
  for (const a of annotations) {
    if (ids.has(a.id)) fail("DUPLICATE_ANNOTATION_ID", a.sourceNodeId); ids.add(a.id);
    const n = byId.get(a.sourceNodeId);
    if (!n) { fail("ANNOTATION_SOURCE_MISSING", a.sourceNodeId); continue; }
    if (a.mbtiType !== type || n.mbtiType !== type) fail("ANNOTATION_TYPE_MISMATCH", n.id);
    if (a.sourceDomain !== n.sourceDomain) fail("ANNOTATION_DOMAIN_MISMATCH", n.id);
    if (!Object.hasOwn(MBTI_WEIGHT_CLASSES, a.weightClass)) fail("INVALID_WEIGHT_CLASS", n.id);
    const reference = n.classification === "REFERENCE_ONLY";
    if (reference && (Object.keys(a.axes).length || a.weightClass !== "REFERENCE_ONLY" || a.sourceType !== "reference_only" || a.annotationConfidence !== "REFERENCE_ONLY" || a.contexts.length)) fail("REFERENCE_ONLY_SCORING", n.id);
    if (n.classification === "METADATA" || n.classification === "UNCLASSIFIED") fail("NON_SCORING_NODE_ANNOTATION", n.id);
    if (!reference) {
      annotated.add(n.id);
      if (typeof n.value !== "string" || !n.value.trim()) fail("NON_TEXT_SEMANTIC_NODE", n.id);
      if (!Object.keys(a.axes).length || Object.keys(a.axes).length > 4) fail("INVALID_AXIS_COUNT", n.id);
      const general = GENERAL_MBTI_DOMAINS.includes(a.sourceDomain);
      if (a.sourceType !== (general ? "source_trait" : "domain_trait")) fail("INVALID_SOURCE_TYPE", n.id);
      if (general ? !["GENERAL_TRAIT", "SPECIFIC_TRAIT", "DIRECT_BEHAVIOR"].includes(a.weightClass) : a.weightClass !== "DOMAIN_SPECIFIC") fail("INVALID_DOMAIN_WEIGHT", n.id);
      if (!["DIRECT", "SUPPORTED"].includes(a.annotationConfidence)) fail("INVALID_ANNOTATION_CONFIDENCE", n.id);
      if (!a.contexts.length || new Set(a.contexts).size !== a.contexts.length || a.contexts.some(c => !(MBTI_DOMAIN_CONTEXTS[a.sourceDomain] as readonly string[] | undefined)?.includes(c))) fail("INVALID_CONTEXT", n.id);
    }
    for (const [axis, value] of Object.entries(a.axes)) {
      if (!(SEMANTIC_AXES as readonly string[]).includes(axis)) fail("INVALID_SEMANTIC_AXIS", n.id);
      if (!Number.isFinite(value) || ![0.5, 1, 2].includes(Math.abs(value))) fail("INVALID_AXIS_MAGNITUDE", n.id);
      if (value < 0 && !(BIPOLAR_AXES as readonly string[]).includes(axis)) fail("NEGATIVE_STRENGTH_AXIS", n.id);
      const key = `${n.id}:${axis}`;
      if (nodeAxes.has(key)) fail("DUPLICATE_NODE_AXIS", n.id); nodeAxes.add(key);
    }
  }
  for (const n of nodes) {
    if (n.classification === "UNCLASSIFIED") fail("UNCLASSIFIED_SEMANTIC_NODE", n.id);
    if (n.classification === "SCORING_SEMANTIC" && !annotated.has(n.id)) fail("SCORING_NODE_WITHOUT_ANNOTATION", n.id);
  }
  return errors.sort((a, b) => semanticOrder(`${a.code}:${a.sourceNodeIds}`, `${b.code}:${b.sourceNodeIds}`));
}
