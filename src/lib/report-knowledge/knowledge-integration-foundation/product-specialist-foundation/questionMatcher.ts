import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate } from "../knowledge-binder/types";
import { ProductQuestionIndex } from "./questionIndex";
import type { MaterialLinkKind } from "./types";
export function connectQuestionMaterials(index: ProductQuestionIndex, catalog: KnowledgeBinderCatalog) {
    for (const c of catalog.candidates.values()) {
        const declared = index.byMaterialId.get(JSON.stringify([c.record.family, c.record.originalId])) ?? [], raw = catalog.raw.get(c.record.catalogKey) ?? {};
        for (const id of declared) {
            const q = index.byId.get(id)!;
            if (!c.requirement.products.includes(q.productKey) || q.relationshipCategory && !c.requirement.relationships.includes(q.relationshipCategory))
                continue;
            const kind: MaterialLinkKind = c.requirement.requiresIntroducedLedger ? "RECALL_ONLY" : c.record.kind === "EDITORIAL_MATERIAL" ? "EXPRESSION_ONLY" : raw.kind === "conditional_application" || raw.mode === "CONDITIONAL_APPLICATION" ? "CONDITIONAL_APPLICATION" : "DIRECT_QUESTION_MATERIAL";
            index.add({ questionId: id, catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, kind, originalLink: q.originalContractLocator, originalLinkHash: q.originalContractHash, reason: "EXPLICIT_ORIGINAL_MATERIAL_ID_IN_QUESTION_OR_ROLE", createsPersonalFact: false });
        }
        // Exact research address is a conditional link, not an inferred question match.
        if (typeof raw.address === "string")
            for (const p of c.requirement.products)
                for (const rel of p === "saju_mbti_compatibility" ? c.requirement.relationships : [null])
                    for (const q of index.at(p, rel, raw.address))
                        if (q.sourceCatalogKey !== c.record.catalogKey && c.classification === "INTERPRETATION_CANDIDATE")
                            index.add({ questionId: q.id, catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, kind: c.requirement.requiresIntroducedLedger ? "RECALL_ONLY" : "CONDITIONAL_APPLICATION", originalLink: c.record.locator, originalLinkHash: c.record.locator.recordSha256 ?? "UNKNOWN", reason: "EXACT_ORIGINAL_READER_ADDRESS_REQUIRES_ALL_APPLICATION_CONDITIONS", createsPersonalFact: false });
    }
    for (const q of index.byId.values())
        if (q.sourceCatalogKey) {
            const c = catalog.candidates.get(q.sourceCatalogKey);
            if (c) {
                index.add({ questionId: q.id, catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, kind: typeof catalog.raw.get(c.record.catalogKey)?.coreMeaning === "string" && typeof catalog.raw.get(c.record.catalogKey)?.address === "string" ? "DIRECT_QUESTION_MATERIAL" : catalog.raw.get(c.record.catalogKey)?.verification === "conditional_editorial_not_calculated_fact" ? "CONDITIONAL_APPLICATION" : "REFERENCE_ONLY", originalLink: q.originalContractLocator, originalLinkHash: q.originalContractHash, reason: "QUESTION_DEFINITION_IS_NOT_AN_ADDITIONAL_INTERPRETATION", createsPersonalFact: false });
            }
        }
    const foundations = new Map<string, Set<import("../types").CatalogKey>>();
    for (const link of [...index.links])
        if (["DIRECT_QUESTION_MATERIAL", "CONDITIONAL_APPLICATION", "RECALL_ONLY"].includes(link.kind)) {
            const candidate = catalog.candidates.get(link.catalogKey);
            if (!candidate)
                continue;
            if (!foundations.has(link.catalogKey))
                foundations.set(link.catalogKey, new Set(candidate.requirement.sourceRequirements.flatMap(s => s.sourceCatalogKeys.flatMap(k => catalog.sourceAncestors(k))).filter(k => catalog.semantic.graph.byKey.get(k)?.namespace === "FOUNDATION")));
            for (const key of foundations.get(link.catalogKey)!) {
                const record = catalog.semantic.graph.byKey.get(key)!;
                index.add({ questionId: link.questionId, catalogKey: key, originalResearchId: record.originalId, kind: "SHARED_FOUNDATION_MATERIAL", originalLink: record.locator, originalLinkHash: record.locator.recordSha256 ?? "UNKNOWN", reason: "ORIGINAL_REQUIRED_SOURCE_ANCESTRY_REFERENCE_NOT_PERSONAL_FACT", createsPersonalFact: false });
            }
        }
    index.links.sort((a, b) => JSON.stringify([a.questionId, a.catalogKey, a.kind]).localeCompare(JSON.stringify([b.questionId, b.catalogKey, b.kind]), "en"));
    return index;
}
export function unscopedCommonResearch(catalog: KnowledgeBinderCatalog, index: ProductQuestionIndex) { return [...catalog.candidates.values()].filter(c => c.classification === "INTERPRETATION_CANDIDATE" && !c.requirement.products.length).map((c: KnowledgeCandidate) => ({ catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, family: c.record.family, originalProductScope: c.requirement.products, originalMeaning: c.requirement.coreMeaning, requiredEvidence: c.requirement.sourceRequirements, sourceStatus: c.sourceCheck, potentialQuestions: index.forCandidate(c.record.catalogKey).map(q => q.id), additionalProductPolicyRequired: true, state: "POTENTIAL_SPECIALIST_APPLICATION", customerApproved: false, proposalActivated: false })); }
export function declaredScalar(v: unknown, key: string): string | null { return isRecord(v) && typeof v[key] === "string" ? v[key] as string : null; }
