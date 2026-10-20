import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { Material } from "../../comprehensive-product-research/researchTypes";
import type { ComprehensiveSpecialistCandidate } from "./types";
import { adaptComprehensiveRequirements } from "./requirementAdapter";
import { isRecord } from "../normalization";
export class ComprehensiveSpecialistIndex {
    readonly candidates = new Map<string, ComprehensiveSpecialistCandidate>();
    readonly byQuestion = new Map<string, string[]>();
    readonly byAddress = new Map<string, string[]>();
    readonly byMaterial = new Map<string, string>();
    readonly byMeaning = new Map<string, string[]>();
    readonly byAxis = new Map<string, string[]>();
    readonly byFacet = new Map<string, string[]>();
    readonly byDomain = new Map<string, string[]>();
    readonly byContext = new Map<string, string[]>();
    readonly bySourceGroup = new Map<string, string[]>();
    readonly byApproval = new Map<string, string[]>();
    readonly questions;
    readonly applicableCandidates;
    constructor(readonly foundation: ProductSpecialistFoundation) {
        this.questions = foundation.registry.questions.filter(q => q.productKey === "saju_mbti_full");
        this.applicableCandidates = foundation.catalog.search("saju_mbti_full", null);
        const questionIds = new Set(this.questions.map(q => q.id)), materialLinks = new Map<string, typeof foundation.questions.links>();
        for (const l of foundation.questions.links)
            if (questionIds.has(l.questionId))
                materialLinks.set(l.catalogKey, [...(materialLinks.get(l.catalogKey) ?? []), l]);
        const add = (map: Map<string, string[]>, key: string, id: string) => map.set(key, [...(map.get(key) ?? []), id]);
        for (const c of this.applicableCandidates) {
            const raw = foundation.catalog.raw.get(c.record.catalogKey);
            if (c.record.family !== "comprehensive-product-research" || !isRecord(raw) || !c.record.locator.file.match(/\/chapter\d+Materials\.ts$/))
                continue;
            // SourceReader and Catalog already verified the exact original record; check
            // material shape before preserving it without rewriting any source fields.
            if (typeof raw.address !== "string" || typeof raw.coreMeaning !== "string" || !isRecord(raw.roleContributions) || !Array.isArray(raw.sourceRefs) || !Array.isArray(raw.semanticFacets))
                throw Error("ORIGINAL_MATERIAL_SHAPE_INVALID");
            const material = raw as unknown as Material, links = materialLinks.get(c.record.catalogKey) ?? [], q = foundation.questions.at("saju_mbti_full", null, material.address)[0];
            const row: ComprehensiveSpecialistCandidate = { catalogKey: c.record.catalogKey, originalResearchId: c.record.originalId, locator: c.record.locator, recordHash: c.record.locator.recordSha256 ?? "UNKNOWN", material, bindingCandidate: adaptComprehensiveRequirements(foundation.overlays.get(c.record.catalogKey)!.candidate, material, foundation.catalog).candidate, questionLinks: links, meaning: { originalMeaningId: c.requirement.meaningIdentity, originalClaimId: c.requirement.claimIdentity, originalClass: material.meaningClass, review: "MEANING_RELATION_REVIEW_REQUIRED" }, domain: q?.allowedDomains ?? [], context: q?.allowedContexts ?? [], facets: material.semanticFacets, actualFacetObservations: "UNSUPPORTED_PRODUCER", precedingMeaningRefs: material.precedingMeaningRefs, sourceReview: c.sourceCheck.state, originalReview: material.review, customerApproved: false };
            this.candidates.set(c.record.catalogKey, row);
            this.byMaterial.set(material.id, c.record.catalogKey);
            add(this.byAddress, material.address, c.record.catalogKey);
            for (const l of links)
                add(this.byQuestion, l.questionId, c.record.catalogKey);
            for (const f of material.semanticFacets) {
                add(this.byAxis, f.axis, c.record.catalogKey);
                add(this.byFacet, f.id, c.record.catalogKey);
            }
            for (const d of row.domain)
                add(this.byDomain, d, c.record.catalogKey);
            for (const x of row.context)
                add(this.byContext, x, c.record.catalogKey);
            if (row.meaning.originalMeaningId)
                add(this.byMeaning, row.meaning.originalMeaningId, c.record.catalogKey);
            for (const g of c.requirement.sourceGroups)
                add(this.bySourceGroup, g.originalId ?? String(g.originalIndex), c.record.catalogKey);
            add(this.byApproval, "UNAPPROVED", c.record.catalogKey);
        }
    }
}
