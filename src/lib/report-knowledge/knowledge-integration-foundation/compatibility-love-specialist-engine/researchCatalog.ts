import { isRecord } from "../normalization";
import { hash } from "../sourceReader";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
// Narrow read views of original Catalog records, not copied research data.
// Full original objects remain intact, including fields not interpreted here.
export type OriginalSource = { id: string; key: string; sourceId: string; sourceKind: string; recordSha256: string; sourceFileSha256: string; originalState: Readonly<Record<string, unknown>> };
export type OriginalMaterial = { id: string; chapterId: string; address: string; mode: "JOINT" | "SELF_A" | "SELF_B" | "AB" | "BA" | "RECALL"; readerQuestion: string; coreMeaning: string; roleContributions: Readonly<Record<string, unknown>>; ownedSources: readonly { owner: string; sourceKey: string; sourceUse: string }[]; semanticFacets: readonly unknown[]; positive: string; risk: string; factBomb: string; twist: string; senderAdjustment: string; recipientQuestion: string; fictionalScene: unknown; counterexample: string; disallowed: readonly string[]; precedingMeaningRefs: readonly string[]; requirements: Readonly<Record<string, unknown>> };
export type OriginalRelation = { sourceId: string; members: readonly string[]; crossSupport: string; actualCrossProducerKind: string | null };
export type OriginalPairReview = { id: string; sourceType: string; targetType: string; forward: { pointer: string; sha256: string; sourceCoverage: string }; reverse: { pointer: string; sha256: string; sourceCoverage: string }; sourceTraitRefs: readonly unknown[]; targetTraitRefs: readonly unknown[] };
export function readOriginalPairResearch(catalog: KnowledgeBinderCatalog) {
  const records = catalog.input.records.filter(r => r.originalId.startsWith("clr:"));
  const checkedFiles = new Set<string>();
  const values = records.map(r => {
    const raw = catalog.raw.get(r.catalogKey);
    if (catalog.sourceChecks.get(r.catalogKey)?.state !== "PASS" || !isRecord(raw) || raw.id !== r.originalId || raw.productKey !== "saju_mbti_compatibility" || raw.relationshipCategory !== "love" || !checkedFiles.has(r.locator.file) && hash(catalog.reader.text(r.locator.file)) !== catalog.input.frozen.get(r.locator.file)) throw Error("ORIGINAL_PAIR_CATALOG_RECORD_REQUIRED");
    checkedFiles.add(r.locator.file);
    return { record: r, raw };
  });
  const sources = values.filter(r => r.record.originalId.startsWith("clr:source:")).map(r => r.raw as unknown as OriginalSource);
  const relations = values.filter(r => r.record.originalId.startsWith("clr:relation:")).map(r => r.raw as unknown as OriginalRelation);
  const pairReviews = values.filter(r => r.record.originalId.startsWith("clr:mbti-pair:")).map(r => r.raw as unknown as OriginalPairReview);
  if (sources.length !== 79 || relations.length !== 64 || pairReviews.length !== 256) throw Error("ORIGINAL_PAIR_RESEARCH_INVENTORY_CHANGED");
  return { sources, relations, pairReviews, records: values };
}
