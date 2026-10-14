import type { CatalogKey, ProductKey, RelationshipCategory } from "../types";
import type { ProductQuestionContract, ProductQuestionId, QuestionMaterialLink } from "./types";
export class ProductQuestionIndex {
    readonly byId = new Map<ProductQuestionId, ProductQuestionContract>();
    readonly byProduct = new Map<ProductKey, ProductQuestionId[]>();
    readonly byAddress = new Map<string, ProductQuestionId[]>();
    readonly byMaterialId = new Map<string, ProductQuestionId[]>();
    readonly byCatalog = new Map<CatalogKey, ProductQuestionId[]>();
    readonly links: QuestionMaterialLink[] = [];
    readonly linksByQuestion = new Map<ProductQuestionId, QuestionMaterialLink[]>();
    private linkKeys = new Set<string>();
    constructor(questions: readonly ProductQuestionContract[]) { for (const q of questions) {
        this.byId.set(q.id, q);
        this.byProduct.set(q.productKey, [...(this.byProduct.get(q.productKey) ?? []), q.id]);
        const address = JSON.stringify([q.productKey, q.relationshipCategory, q.address.originalAddress]);
        this.byAddress.set(address, [...(this.byAddress.get(address) ?? []), q.id]);
        for (const id of q.declaredMaterialIds) {
            const key = JSON.stringify([q.specialistKnowledgeFamily, id]);
            this.byMaterialId.set(key, [...(this.byMaterialId.get(key) ?? []), q.id]);
        }
    } }
    at(product: ProductKey, relationship: RelationshipCategory | null, address: string) { return (this.byAddress.get(JSON.stringify([product, relationship, address])) ?? []).map(id => this.byId.get(id)!); }
    forCandidate(key: CatalogKey) { return (this.byCatalog.get(key) ?? []).map(id => this.byId.get(id)!); }
    add(link: QuestionMaterialLink) { const key = JSON.stringify([link.questionId, link.catalogKey, link.kind]); if (this.linkKeys.has(key))
        return; this.linkKeys.add(key); this.links.push(link); this.linksByQuestion.set(link.questionId, [...(this.linksByQuestion.get(link.questionId) ?? []), link]); this.byCatalog.set(link.catalogKey, [...new Set([...(this.byCatalog.get(link.catalogKey) ?? []), link.questionId])]); }
}
