import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { OriginalSource, OriginalRelation } from "../compatibility-love-specialist-engine/researchCatalog";
export type ParentChildMaterial = {
  id: string; chapterId: string; address: string; mode: "JOINT" | "SELF_A" | "SELF_B" | "AB" | "BA" | "RECALL";
  roleVersion: string; roles: { personA: string; personB: string }; developmentalContexts: string[]; developmentNotAssessed: true;
  readerQuestion: string; coreMeaning: string; roleContributions: Record<string, unknown>;
  ownedSources: { owner: string; sourceKey: string; sourceUse: string }[];
  semanticFacets: { id: string; axis: string; condition: string }[]; topics: string[];
  parentResponsibleAction: string; childAvailableChoice: string; counterexample: string; disallowed: string[];
  positive: string; risk: string; factBomb: string; twist: string; fictionalScene: unknown; precedingMeaningRefs: string[];
  requirements: Record<string, unknown> & { enteredTypePredicates: { owner: string; type: string; sourceKey: string; domain: string }[]; actualNatalAndDirectionRoots: unknown[]; direction: { direction: string; subject: string; recipient: string; tenGodViewer: string; tenGodTarget: string } | null };
  repairPlan: { condition: string; parentChecksFirst: string; childExpression: string; adultChange: string; safetyNonNegotiable: string; choiceLeftToChild: string; revisit: string; improvementCheck: string; childMustRepairParent: false };
};
export type RoleSource = { id: string; type: string; area: string; owner: string; domain: string; file: string; pointer: string; recordSha256: string; sourceFileSha256: string; sourceCoverage: string; raw: Record<string, unknown> };
export type ContextReview = { id: string; context: string; actualVerificationRequired: string; parentResponsibility: string; childChoice: string; withhold: string; sourceKeys: string[]; materialRefs: string[]; newAgeCalculation: false };
export type PairReview = { id: string; sourceType: string; targetType: string; forward: { pointer: string; sha256: string; sourceCoverage: string }; reverse: unknown; genericReference: unknown; coverageClass: string; parentChildPatternExists: false; romanticPatternsWithheld: true };
export function readParentChildResearch(catalog: KnowledgeBinderCatalog) {
  const checkedFiles = new Set<string>();
  const records = catalog.input.records.filter(r => r.originalId.startsWith("pcpr:")).map(record => {
    const raw = catalog.raw.get(record.catalogKey);
    if (catalog.sourceChecks.get(record.catalogKey)?.state !== "PASS" || !isRecord(raw) || raw.id !== record.originalId || raw.productKey !== "saju_mbti_compatibility" || raw.relationshipCategory !== "parentChild" || !checkedFiles.has(record.locator.file) && (catalog.reader.text(record.locator.file), catalog.reader.files.get(record.locator.file)) !== catalog.input.frozen.get(record.locator.file)) throw Error("ORIGINAL_PARENT_CHILD_RECORD_REQUIRED");
    checkedFiles.add(record.locator.file); return { record, raw };
  });
  const byPrefix = <T,>(prefix: string) => records.filter(r => r.record.originalId.startsWith("pcpr:" + prefix + ":")).map(r => r.raw as unknown as T);
  const sources = byPrefix<OriginalSource>("source"), relations = byPrefix<OriginalRelation>("relation"), pairReviews = byPrefix<PairReview>("pair"), roleSources = byPrefix<RoleSource>("mbti-role"), contexts = byPrefix<ContextReview>("context");
  if (sources.length !== 71 || relations.length !== 64 || pairReviews.length !== 256 || roleSources.length !== 118 || contexts.length !== 5) throw Error("PARENT_CHILD_RESEARCH_INVENTORY_CHANGED");
  return { records, sources, relations, pairReviews, roleSources, contexts };
}
