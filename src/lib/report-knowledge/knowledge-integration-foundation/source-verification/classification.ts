import { isRecord } from "../normalization";
import { canonicalJson, hash } from "../sourceReader";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge } from "../types";
import type { ReferenceNamespace, VerificationConfig, VerificationOccurrence, VerificationReceipt } from "./types";
export function targetId(target: unknown): string | null {
  if (typeof target === "string") return target;
  if (!isRecord(target)) return null;
  return typeof target.sourceId === "string" ? target.sourceId : typeof target.referenceId === "string" ? target.referenceId : null;
}
export function namespace(target: unknown, field: string, config: VerificationConfig): ReferenceNamespace {
  if (isRecord(target)) {
    if (target.auditRef) return "AUDIT_REFERENCE";
    if (target.catalog && target.catalogKey) return "LOCATOR";
    if (target.file) return target.pointer ? "JSON_POINTER" : "LOCATOR";
  }
  const id = targetId(target);
  if (!id) return "UNKNOWN";
  if (id.startsWith("kc:v1:")) return "CATALOG_KEY";
  if (/^mbti:[^:]+:traits:/.test(id)) return "MBTI_STRUCTURED_ID";
  if (isRecord(target) && typeof target.passage === "string" && target.passage) return "TRADITIONAL_SOURCE_ID";
  if (id.includes("#")) return id.split("#")[0].endsWith(".json") ? "AUDIT_REFERENCE" : "FIELD_FRAGMENT";
  if (/\.json$/.test(id)) return "AUDIT_REFERENCE";
  if (/^sar:gate:/.test(id) || /QuestionRefs/.test(field)) return "FUTURE_BINDING_REQUIREMENT";
  if (config.futurePatterns.some(p => new RegExp(p).test(id))) return "CALCULATED_EVIDENCE_REQUIREMENT";
  if (/^(?:taxonomy|knowledge|dayPillars|sajuDayPillarKnowledge|shinsal|SHINSAL_RULES|STRUCTURE_RULES):/.test(id)) return "SAJU_KNOWLEDGE_ID";
  if (/^sar:/.test(id) || /relatedAxes|distinguishAxis/.test(field)) return "SEMANTIC_ID";
  if (/^fkr:/.test(id)) return "FUSION_ID";
  if (/^(?:ker|claim|scene|expression):/.test(id)) return "EDITORIAL_ID";
  if (/^(?:clr|cmpr|pcpr|cwpr|mrpr|bppr|frpr):/.test(id)) return "RELATIONSHIP_RESEARCH_ID";
  if (/^(?:ckr|lkr|cpr|mfpr|afpr):/.test(id)) return "PRODUCT_RESEARCH_ID";
  if (/^(?:foundation|completion|deep):/.test(id)) return "FOUNDATION_ID";
  if (/^(?:csr|rr|tr|mkr|mpr):/.test(id)) return "RESEARCH_ID";
  if (/^(?:src\/|[A-Z][A-Z_]+$|SajuCalcResult[.:])/.test(id)) return "LOCATOR";
  return "UNKNOWN";
}
export function occurrence(edge: KnowledgeReferenceEdge, record: KnowledgeCatalogRecord, ordinal: number, config: VerificationConfig): VerificationOccurrence {
  const ns = namespace(edge.target, edge.field, config);
  return { referenceKey: `sv:ref:${hash(canonicalJson([edge.from, edge.field, edge.kind, edge.target, edge.reason, ordinal]))}`,
    affectedCatalogKey: record.catalogKey, researchFamily: record.family, originalResearchId: record.originalId,
    referenceField: edge.field, referenceKind: edge.kind, originalTarget: edge.target, originalReason: edge.reason ?? "UNRESOLVED",
    targetNamespace: ns, requiredSourceKind: ns === "TRADITIONAL_SOURCE_ID" ? "DOCUMENTARY_SOURCE_REGISTRY" : ns === "MBTI_STRUCTURED_ID" ? "INDIVIDUAL_MBTI_TRAIT" : ns === "CALCULATED_EVIDENCE_REQUIREMENT" ? "ACTUAL_PERSONAL_EVIDENCE_NOT_RESEARCH" : ns === "SEMANTIC_ID" ? "DECLARED_SEMANTIC_DEFINITION" : "ORIGINAL_DECLARED_SOURCE",
    originalLocator: record.locator, originalEdgeOrdinal: ordinal, originalReferencePreserved: true };
}
export function risk(o: VerificationOccurrence, record: KnowledgeCatalogRecord, downstream: number): VerificationReceipt["risk"] {
  if (o.targetNamespace === "CALCULATED_EVIDENCE_REQUIREMENT" || (o.targetNamespace === "MBTI_STRUCTURED_ID" && ["FUSION_RESEARCH", "RELATIONSHIP_SPECIALIST", "CONDITIONAL_INTERPRETATION"].includes(record.kind))) return "CRITICAL";
  if (["PRODUCT_SPECIALIST", "RELATIONSHIP_SPECIALIST", "CONDITIONAL_INTERPRETATION", "FUSION_RESEARCH", "SOURCE_KNOWLEDGE", "CALCULATION_DEFINITION"].includes(record.kind) || downstream > 0) return "HIGH";
  if (["SEMANTIC_DEFINITION", "CROSSWALK", "EDITORIAL_MATERIAL"].includes(record.kind)) return "MEDIUM";
  return "LOW";
}
export const technicallyVerified = (r: Pick<VerificationReceipt, "resolutionState">): boolean => ["EXACT_SOURCE_VERIFIED", "UNIQUE_ALIAS_VERIFIED", "FRAGMENT_VERIFIED", "AUDIT_AND_ORIGINAL_VERIFIED"].includes(r.resolutionState);
