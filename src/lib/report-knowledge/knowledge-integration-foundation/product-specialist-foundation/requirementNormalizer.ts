import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import type { KnowledgeCandidate, EvidenceSelector } from "../knowledge-binder/types";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { CandidateWithOverlay, NormalizationReceipt, SelectorKind } from "./types";
export const selectorKind = (s: EvidenceSelector): SelectorKind => s.kinds.includes("TEMPORAL_BOUNDARY") ? "TEMPORAL_BOUNDARY_SELECTOR" : s.temporalScope === "dayun" ? "DAYUN_SELECTOR" : s.temporalScope === "annual" ? "ANNUAL_SELECTOR" : s.temporalScope === "month" ? "MONTH_SEGMENT_SELECTOR" : s.kinds.includes("MBTI_SOURCE_NODE") ? "MBTI_SOURCE_SELECTOR" : s.kinds.includes("FUSION_DERIVATION") ? "FUSION_SELECTOR" : s.kinds.includes("SEMANTIC_DERIVATION") ? "SEMANTIC_DERIVATION_SELECTOR" : s.kinds.includes("DIRECTIONAL_RELATION_FACT") ? "DIRECTIONAL_SELECTOR" : s.kinds.includes("CANONICAL_PAIR_FACT") ? "CANONICAL_PAIR_SELECTOR" : s.kinds.includes("TEMPORAL_BOUNDARY") ? "TEMPORAL_BOUNDARY_SELECTOR" : "NATAL_FACT_SELECTOR";
export function normalizeSpecialistRequirement(original: KnowledgeCandidate, catalog: KnowledgeBinderCatalog): CandidateWithOverlay {
    const candidate = structuredClone(original), q = candidate.requirement, raw = catalog.raw.get(original.record.catalogKey) ?? {}, receipts: NormalizationReceipt[] = [];
    const receipt = (field: string, declaration: unknown, normalized: unknown, status: NormalizationReceipt["verificationStatus"], method: string, evidence: EvidenceSelector[] = [], unknown: string[] = [], proposalOnly = false) => receipts.push({ originalDeclaration: declaration, originalField: field, normalizedContract: normalized, normalizationMethod: method, sourceLocator: original.record.locator, sourceHash: original.record.locator.recordSha256 ?? "UNKNOWN", requiredEvidence: evidence, verificationStatus: status, remainingUnknown: unknown, proposalOnly });
    for (const spec of q.sourceRequirements) {
        const declaration = isRecord(spec.originalDeclaration) ? spec.originalDeclaration : {};
        if (spec.selector?.source && typeof declaration.file === "string" && typeof declaration.pointer === "string" && spec.selector.source.file === declaration.file) {
            const exact = catalog.byLocator.get(JSON.stringify([declaration.file, declaration.pointer])) ?? [];
            if (exact.length === 1 && catalog.sourceChecks.get(exact[0].catalogKey)?.state === "PASS") {
                spec.selector.source = { ...spec.selector.source, pointer: declaration.pointer, fileSha256: catalog.input.frozen.get(declaration.file) };
                receipt(spec.originalField, spec.originalDeclaration, spec.selector, "EXACT_TYPED_CONTRACT", "EXACT_ORIGINAL_POINTER_NARROWING", [spec.selector]);
                continue;
            }
        }
        receipt(spec.originalField, spec.originalDeclaration, spec.selector, spec.selector ? "EXACT_TYPED_CONTRACT" : spec.use === "DOCUMENTARY" ? "SOURCE_DECLARATION_VERIFIED" : "CONTRACT_NOT_MACHINE_CHECKABLE", spec.selector ? "EXISTING_BINDER_TYPED_CONTRACT" : "ORIGINAL_REFERENCE_IS_NOT_PERSONAL_OBSERVATION", spec.selector ? [spec.selector] : [], spec.gaps);
    }
    if (raw.scope === "civil_month" || raw.scope === "segment_time") {
        q.requiredTemporalScope = "month";
        receipt("/scope", raw.scope, { scope: "month", producerVersion: "annual-month-jie-kst-v2" }, "STRUCTURALLY_PARTIAL", "EXPLICIT_CALENDAR_SCOPE_WITH_REQUIRED_ORIGINAL_SEGMENT_LEDGER", [], ["EXACT_SEGMENT_WINDOW_REQUIRED", "ORIGINAL_MEANING_AND_CONTEXT_STILL_REQUIRED"]);
    }
    if (typeof raw.god === "string" && raw.scope === "monthly_segment")
        receipt("/god", raw.god, { role: null, god: raw.god }, "CONTRACT_NOT_MACHINE_CHECKABLE", "MONTHLY_GOD_ROLE_NOT_DECLARED", [], ["AMBIGUOUS_MONTHLY_GOD_ROLE"]);
    for (const [field, value] of [["requiredOwner", q.requiredOwner], ["requiredDirection", q.requiredDirection], ["requiredParticipants", q.requiredParticipants], ["requiredTemporalScope", q.requiredTemporalScope], ["prohibitions", q.prohibitions]] as const)
        receipt("/" + field, value, value, "SOURCE_DECLARATION_VERIFIED", "EXISTING_BINDER_DECLARATION_UNCHANGED", [], []);
    for (const requirement of q.producerRequirements)
        receipt("/producerRequirements", requirement, requirement, "PRODUCER_SUPPORT_REQUIRED", "EXISTING_UNSUPPORTED_PRODUCER_CONTRACT_UNCHANGED", [], [requirement]);
    if (q.compositeLayers > 2)
        receipt("/compositeLayers", q.compositeLayers, q.compositeLayers, "PRODUCER_SUPPORT_REQUIRED", "NO_NEW_MULTILAYER_CALCULATION", [], ["UNSUPPORTED_COMPOSITE"]);
    for (const c of q.unresolvedConditions)
        receipt(c.field, c.original, null, "SEMANTIC_REVIEW_REQUIRED", "ORIGINAL_NATURAL_LANGUAGE_PRESERVED", [], ["CONTRACT_NOT_MACHINE_CHECKABLE"]);
    for (const state of q.requiredUserState)
        receipt(state.originalField, state, state.allowed, state.allowed ? "EXACT_TYPED_CONTRACT" : "ACTUAL_USER_STATE_REQUIRED", state.allowed ? "ORIGINAL_INPUT_ENUM" : "MISSING_ENTERED_USER_STATE", [], state.allowed ? [] : ["ACTUAL_USER_STATE_REQUIRED"]);
    for (const group of q.sourceGroups)
        receipt("/sourceGroups/" + group.originalIndex, group.originalDeclaration, group, "STRUCTURALLY_PARTIAL", "ORIGINAL_AND_ALTERNATIVE_AND_DISPLAYED_LEDGER_UNCHANGED", [], group.originalTechnicalState === "DECLARED_SOURCES_VERIFIED" ? [] : ["INHERITED_SOURCE_GROUP_HELD"]);
    receipt("/counterexamples", q.counterexamples, q.counterexamples, "SEMANTIC_REVIEW_REQUIRED", "NO_NATURAL_LANGUAGE_BOOLEAN_INFERENCE", [], ["ORIGINAL_COUNTEREXAMPLE_REVIEW_REQUIRED"]);
    receipt("/approval", original.record.review, { operatorApproved: false, customerApproved: false }, "APPROVAL_REQUIRED", "NO_APPROVALS_PROVIDER_UNCHANGED", [], ["OPERATOR_APPROVAL_PENDING", "CUSTOMER_APPROVAL_PENDING"]);
    if (canonicalJson(q.unresolvedConditions) !== canonicalJson(original.requirement.unresolvedConditions) || canonicalJson(q.sourceGroups) !== canonicalJson(original.requirement.sourceGroups) || canonicalJson(q.prohibitions) !== canonicalJson(original.requirement.prohibitions))
        throw Error("ORIGINAL_CONDITIONS_RELAXED");
    q.applicabilityState = q.sourceRequirements.some(s => s.selector) ? q.unresolvedConditions.length || q.sourceRequirements.some(s => s.gaps.length) ? "PARTIALLY_CHECKABLE" : "MACHINE_CHECKABLE" : "CONTRACT_NOT_MACHINE_CHECKABLE";
    return { original, candidate, overlay: { catalogKey: original.record.catalogKey, originalRequirementHash: hash(canonicalJson(original.requirement)), originalRecordHash: original.record.locator.recordSha256 ?? "UNKNOWN", normalizedRequirement: q, normalization: receipts, originalConditionsPreserved: true, customerApprovalAdded: false } };
}
