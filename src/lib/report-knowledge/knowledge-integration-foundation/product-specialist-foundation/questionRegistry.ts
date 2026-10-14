import { isRecord } from "../normalization";
import { hash, recordHash } from "../sourceReader";
import type { JsonRecord, KnowledgeSourcePointer, ProductKey, RelationshipCategory } from "../types";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate } from "../knowledge-binder/types";
import { READER_MODULES } from "./productContracts";
import { type ProductQuestionContract, type ProductContract, type ProductReaderAddress } from "./types";
const str = (v: unknown) => typeof v === "string" ? v : null;
const strings = (v: unknown): string[] => typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((v): v is string => typeof v === "string") : [];
const materialIds = (r: JsonRecord) => [...new Set([...strings(r.materialIds), ...strings(r.materialId), ...strings(r.materialRef), ...(Array.isArray(r.materialRefs) ? r.materialRefs.filter(isRecord).flatMap(x => strings(x.materialId)) : [])])];
const locator = (file: string, exportName: string, pointer: string, value: unknown, fileHash: string): KnowledgeSourcePointer => ({ file, exportName, pointer, fileSha256: fileHash, recordSha256: recordHash(value) });
export class ProductQuestionRegistry {
    readonly questions: ProductQuestionContract[] = [];
    readonly products: ProductContract[] = [];
    readonly errors: string[] = [];
    constructor(readonly catalog: KnowledgeBinderCatalog) { }
    async compile() {
        const rows = [...this.catalog.candidates.values()], paragraphs = new Map<string, KnowledgeCandidate[]>(), roles = new Map<string, KnowledgeCandidate[]>();
        const key = (product: ProductKey, relationship: RelationshipCategory | null, address: string) => JSON.stringify([product, relationship, address]);
        for (const c of rows) {
            const raw = this.catalog.raw.get(c.record.catalogKey)!;
            const address = str(raw.address) ?? (str(raw.chapterId) && str(raw.paragraphId) ? `${raw.chapterId}.${raw.paragraphId}` : null);
            if (!address)
                continue;
            const map = c.record.locator.file.endsWith("/paragraphResearch.ts") ? paragraphs : c.record.locator.file.endsWith("/sentenceRoleResearch.ts") ? roles : null;
            if (!map)
                continue;
            for (const p of c.requirement.products)
                for (const rel of p === "saju_mbti_compatibility" ? c.requirement.relationships : [null]) {
                    const k = key(p, rel, address);
                    map.set(k, [...(map.get(k) ?? []), c]);
                }
        }
        for (const descriptor of READER_MODULES) {
            const bytes = this.catalog.reader.text(descriptor.file), fileHash = hash(bytes);
            if (fileHash !== this.catalog.input.frozen.get(descriptor.file))
                throw Error("READER_CONTRACT_HASH_MISMATCH");
            const ex = await this.catalog.reader.exports(descriptor.file), chapters = ex[descriptor.exportName];
            if (!Array.isArray(chapters))
                throw Error("READER_CONTRACT_EXPORT_MISSING");
            const relationships: (RelationshipCategory | null)[] = descriptor.product === "saju_mbti_compatibility" ? ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] : [null];
            for (const rel of relationships) {
                let paragraphCount = 0, roleCount = 0;
                for (const [ci, cv] of chapters.entries()) {
                    if (!isRecord(cv) || !Array.isArray(cv.paragraphs))
                        throw Error("READER_CHAPTER_SHAPE");
                    for (const [pi, pv] of cv.paragraphs.entries()) {
                        if (!isRecord(pv) || !Array.isArray(pv.sentences))
                            throw Error("READER_PARAGRAPH_SHAPE");
                        paragraphCount++;
                        const address = `${cv.id}.${pv.id}`, found = paragraphs.get(key(descriptor.product, rel, address)) ?? [];
                        if (found.length > 1)
                            this.errors.push("AMBIGUOUS_RESEARCH_PARAGRAPH:" + key(descriptor.product, rel, address));
                        const research = found.length === 1 ? found[0] : null;
                        const raw = research ? this.catalog.raw.get(research.record.catalogKey)! : {};
                        this.add(descriptor.product, rel, { chapterId: String(cv.id), periodId: null, paragraphId: String(pv.id), sentenceRole: null, originalAddress: address, level: "PARAGRAPH" }, research, raw, locator(descriptor.file, descriptor.exportName, `/${ci}/paragraphs/${pi}`, pv, fileHash), str(pv.purpose), null, str(cv.domain));
                        for (const [si, sv] of pv.sentences.entries()) {
                            roleCount++;
                            const roleAddress = `${address}.S${si + 1}`, rr = roles.get(key(descriptor.product, rel, roleAddress)) ?? [];
                            const role = rr.length === 1 ? rr[0] : null;
                            let roleRaw = role ? this.catalog.raw.get(role.record.catalogKey)! : {}, nestedPointer = "";
                            if (!role && Array.isArray(raw.roleContributions)) {
                                const nested = raw.roleContributions.filter(isRecord).find(v => v.address === roleAddress);
                                if (nested) {
                                    roleRaw = nested;
                                    nestedPointer = `/roleContributions/${raw.roleContributions.indexOf(nested)}`;
                                }
                            }
                            this.add(descriptor.product, rel, { chapterId: String(cv.id), periodId: null, paragraphId: String(pv.id), sentenceRole: `S${si + 1}`, originalAddress: roleAddress, level: "SENTENCE_ROLE" }, role ?? (nestedPointer ? research : null), roleRaw, locator(descriptor.file, descriptor.exportName, `/${ci}/paragraphs/${pi}/sentences/${si}`, sv, fileHash), str(pv.purpose), str(sv), str(cv.domain), research ?? undefined, nestedPointer);
                        }
                    }
                }
                this.products.push({ productKey: descriptor.product, relationship: rel, chapters: chapters.length, paragraphs: paragraphCount, roles: roleCount, periodSlots: null, originalReaderVersion: str(ex[descriptor.versionExport]), originalReaderFile: descriptor.file, originalReaderHash: fileHash, policy: "ORIGINAL_STRUCTURE_ONLY" });
            }
        }
        for (const product of ["annual_fortune", "major_fortune"] as const) {
            const file = product === "annual_fortune" ? "/monthMatrix.ts" : "/yearMatrix.ts", periodRows = rows.filter(c => c.record.locator.file.endsWith(file) && c.requirement.products.includes(product));
            for (const c of periodRows) {
                const raw = this.catalog.raw.get(c.record.catalogKey)!, periodId = product === "annual_fortune" ? `month-${raw.month}` : String(raw.yearExpression);
                if (product === "annual_fortune")
                    this.add(product, null, { chapterId: null, periodId, paragraphId: null, sentenceRole: null, originalAddress: c.record.originalId, level: "PERIOD" }, c, raw, null, str(raw.primaryMeaning ?? raw.meaning), null, null);
                else if (Array.isArray(raw.questions))
                    for (const [i, item] of raw.questions.entries())
                        if (isRecord(item))
                            this.add(product, null, { chapterId: null, periodId, paragraphId: null, sentenceRole: String(item.key), originalAddress: `${c.record.originalId}#questions/${i}`, level: "PERIOD_ROLE" }, c, item, null, str(raw.purpose), null, null, undefined, `/questions/${i}`);
            }
            this.products.push({ productKey: product, relationship: null, chapters: null, paragraphs: null, roles: null, periodSlots: periodRows.length, originalReaderVersion: null, originalReaderFile: periodRows[0]?.record.locator.file ?? null, originalReaderHash: periodRows[0] ? this.catalog.input.frozen.get(periodRows[0].record.locator.file) ?? null : null, policy: "ORIGINAL_STRUCTURE_ONLY" });
        }
        this.questions.sort((a, b) => a.id.localeCompare(b.id, "en"));
        if (new Set(this.questions.map(q => q.id)).size !== this.questions.length)
            throw Error("DUPLICATE_PRODUCT_QUESTION_ID");
        return this;
    }
    private add(product: ProductKey, rel: RelationshipCategory | null, address: ProductReaderAddress, c: KnowledgeCandidate | null, raw: JsonRecord, reader: KnowledgeSourcePointer | null, purpose: string | null, role: string | null, domain: string | null, parent?: KnowledgeCandidate, nestedPointer = "") {
        const originalLocator = c ? { ...c.record.locator, ...(nestedPointer ? { pointer: (c.record.locator.pointer ?? (c.record.locator.index !== undefined ? `/${c.record.locator.index}` : "")) + nestedPointer, originalId: undefined, recordSha256: recordHash(raw) } : {}) } : reader!;
        const base = parent ? this.catalog.raw.get(parent.record.catalogKey)! : raw, source = c?.requirement;
        const originalQuestion = str(raw.readerQuestion ?? raw.question), requiredEvidenceKinds = [...new Set(source?.sourceRequirements.flatMap(s => s.selector?.kinds ?? []) ?? [])];
        this.questions.push({ id: `psq:v1:${product}:${rel ?? "single"}:${address.originalAddress}`, productKey: product, relationshipCategory: rel, address, originalQuestion, readerPurpose: originalQuestion ?? str(raw.primaryMeaning ?? raw.originalPurpose ?? raw.purpose) ?? purpose, originalRole: str(raw.originalRole) ?? role, primaryMeaningRequirement: raw.primaryMeaning ?? raw.mustConvey ?? raw.requiredProfessionalKnowledge ?? raw.coreMeaning ?? raw.meaning ?? null, secondaryMeaningRequirement: raw.secondaryMeaning ?? raw.additionalMeaning ?? null, allowedContexts: strings(raw.context ?? base.context), allowedDomains: strings(raw.domain ?? base.domain ?? domain), requirement: { original: raw.needs ?? raw.requires ?? raw.requiredFacts ?? raw.prerequisites ?? null, requiredEvidenceKinds, sourceRequirements: source?.sourceRequirements ?? [], sourceGroupRequirements: source?.sourceGroups ?? [], requiredPairEvidence: source?.sourceRequirements.filter(s => s.selector?.kinds.some(k => k === "CANONICAL_PAIR_FACT" || k === "DIRECTIONAL_RELATION_FACT")) ?? [], requiredRole: raw.requiredRole ?? raw.roleRequirement ?? null, requiredOwner: source?.requiredOwner ?? [], requiredDirection: source?.requiredDirection ?? [], requiredTemporalScope: product === "annual_fortune" ? "month" : product === "major_fortune" ? "annual" : source?.requiredTemporalScope ?? null, remainingUnknown: [...(!originalQuestion ? ["ORIGINAL_QUESTION_TEXT_UNKNOWN"] : []), ...(!c ? ["RESEARCH_QUESTION_CONTRACT_MISSING"] : [])] }, specialistKnowledgeFamily: c?.record.family ?? "UNKNOWN", sourceContractVersion: originalLocator.sourceVersion ?? originalLocator.fileSha256 ?? "UNKNOWN", originalContractLocator: originalLocator, originalContractHash: c ? recordHash(raw) : reader?.recordSha256 ?? "UNKNOWN", readerContractLocator: reader, readerContractHash: reader?.recordSha256 ?? null, readerAgreement: reader ? (str(raw.originalPurpose) && raw.originalPurpose !== purpose || str(raw.originalRole) && raw.originalRole !== role ? "REVIEW_REQUIRED" : "VERIFIED") : "PERIOD_CONTRACT", declaredMaterialIds: materialIds(raw), sourceCatalogKey: c?.record.catalogKey ?? null, roleContract: raw.requirements ?? raw.binding ?? null, sourcePolicy: raw.forbidden ?? raw.sourcePolicy ?? raw.missingEvidence ?? raw.disallowed ?? null });
    }
}
