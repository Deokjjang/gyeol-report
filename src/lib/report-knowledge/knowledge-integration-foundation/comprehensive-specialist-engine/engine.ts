import { evidenceHash } from "../actual-evidence-graph/graph";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { BIPOLAR_AXES } from "../../../interpretation-v4/semanticCore";
import { isRecord } from "../normalization";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { KnowledgeBindingReceipt, KnowledgeBindingRequest } from "../knowledge-binder/types";
import { ComprehensiveSpecialistIndex } from "./candidateIndex";
import { materialConflictGraph } from "./conflictGraph";
import { VERSION, type MaterialDiagnostic, type CandidateState, type ComprehensiveSpecialistResult } from "./types";
export const gatePass = (r: KnowledgeBindingReceipt, id: string) => r.allTwelveGateResults.some(g => g.gate === id && (g.state === "PASS" || g.state === "NOT_APPLICABLE"));
export const structurallyMatched = (r: KnowledgeBindingReceipt) => ["SOURCE_INTEGRITY", "PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ACTUAL_DIRECTION", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"].every(g => gatePass(r, g));
export class ComprehensiveSpecialistEngine {
    readonly index: ComprehensiveSpecialistIndex;
    constructor(readonly foundation: ProductSpecialistFoundation) { this.index = new ComprehensiveSpecialistIndex(foundation); }
    diagnose(request: KnowledgeBindingRequest, prepared?: SpecialistFoundationResult): ComprehensiveSpecialistResult {
        if (request.product !== "saju_mbti_full" || request.relationship !== null)
            throw Error("COMPREHENSIVE_SCOPE_ONLY");
        const before = evidenceHash([request.graph, request.graphInput.evidence]), research = evidenceHash([...this.index.candidates.values()].map(c => [c.material, c.bindingCandidate.requirement]));
        const bound = prepared ?? this.foundation.run(request), actual = new ActualBindingIndex(request, this.foundation.catalog), after = this.index.applicableCandidates.map(c => bindKnowledgeCandidate(this.index.candidates.get(c.record.catalogKey)?.bindingCandidate ?? this.foundation.overlays.get(c.record.catalogKey)!.candidate, actual, this.foundation.catalog)), receipts = new Map(after.map(r => [r.candidateCatalogKey, r]));
        const diagnostics: MaterialDiagnostic[] = [];
        for (const c of this.index.candidates.values()) {
            const r = receipts.get(c.catalogKey);
            if (!r)
                throw Error("ORIGINAL_APPLICABLE_MATERIAL_RECEIPT_MISSING");
            const nodes = r.selectedActualEvidence.map(id => actual.graph.nodes.get(id)!).filter(Boolean), ancestors = [...new Map(nodes.flatMap(n => actual.ancestors(n)).map(n => [n.id, n])).values()];
            const states: CandidateState[] = ["DISCOVERED"];
            if (c.questionLinks.length)
                states.push("QUESTION_LINKED");
            if (gatePass(r, "SOURCE_INTEGRITY"))
                states.push("SOURCE_TRACEABLE");
            if (r.matches.some(m => m.matchedActualEvidence.length))
                states.push("ACTUAL_EVIDENCE_MATCHED");
            if (!gatePass(r, "ACTUAL_USER_STATE"))
                states.push("REQUIRED_CONDITIONS_PARTIAL");
            if (structurallyMatched(r))
                states.push("STRUCTURALLY_MATCHED");
            if (!gatePass(r, "INTERPRETATION_REVIEW"))
                states.push("SEMANTIC_REVIEW_PENDING");
            if (r.finalDisposition === "POLICY_HELD")
                states.push("POLICY_WITHHELD");
            states.push("OPERATOR_APPROVAL_PENDING", "CUSTOMER_APPROVAL_PENDING");
            if (r.finalDisposition === "NOT_APPLICABLE")
                states.push("NOT_APPLICABLE");
            if (r.finalDisposition === "INVALID_BINDING")
                states.push("INVALID_CANDIDATE");
            const signals: MaterialDiagnostic["semanticSignals"] = [];
            for (const n of ancestors) {
                if (!isRecord(n.value))
                    continue;
                const values: [
                    string,
                    unknown
                ][] = isRecord(n.value.axes) ? Object.entries(n.value.axes) : typeof n.value.axis === "string" ? [[n.value.axis, n.value.value ?? n.value.score]] : [];
                for (const [axis, v] of values)
                    if (typeof v === "number" && Number.isFinite(v))
                        signals.push({ axis, value: v, kind: (BIPOLAR_AXES as readonly string[]).includes(axis) ? "SIGNED_BIPOLAR" : "STRENGTH", sourceNode: n.id, context: n.value.contexts ?? n.value.context ?? null });
            }
            const inputContext = request.graphInput.evidence.input.kind === "compatibility" ? null : request.graphInput.evidence.input.userContext;
            const recall = c.material.kind === "recall" || c.material.chapterId === "CH13", displayed = (request.introducedLedger ?? []).length > 0;
            diagnostics.push({ catalogKey: c.catalogKey, researchId: c.originalResearchId, states, binderReceipt: r, questionFits: c.questionLinks.map(l => { const q = this.foundation.questions.byId.get(l.questionId)!; const role = q.address.sentenceRole as keyof typeof c.material.roleContributions | null; return { questionId: q.id, link: l.kind, originalRoleContribution: role ? c.material.roleContributions[role]?.knowledge ?? null : null, declaredMeaning: c.material.coreMeaning, requiredMeaning: q.primaryMeaningRequirement, fit: recall ? "RECALL_REQUIRES_DISPLAY" : l.kind === "REFERENCE_ONLY" || l.kind === "EXPRESSION_ONLY" ? "REFERENCE_ONLY" : "DECLARED_LINK_ONLY", verifiedMeaningFulfillment: false }; }), roots: r.canonicalFactRoots, actualNodes: r.selectedActualEvidence, semanticSignals: signals, sourceCoverage: ancestors.filter(n => n.kind === "MBTI_SOURCE_NODE").map(n => ({ nodeId: n.id, classification: isRecord(n.value) ? n.value.classification : null, coverage: isRecord(n.value) ? n.value.sourceCoverage : null, empiricalValidityEstablished: false })), fusion: ancestors.filter(n => n.kind === "FUSION_DERIVATION").map(n => { const a = actual.ancestors(n).filter(a => a.owner.fixtureOwnerId === n.owner.fixtureOwnerId); return { nodeId: n.id, type: isRecord(n.value) ? n.value.type : null, ruleId: isRecord(n.value) ? n.value.ruleId : null, split: isRecord(n.value) ? n.value.conditionSplit : null, sameOwnerBothRoots: a.some(a => a.kind === "CALCULATED_NATAL_FACT") && a.some(a => a.kind === "MBTI_SOURCE_NODE") }; }), enteredContext: { jobStatus: inputContext?.jobStatus || null, relationshipStatus: inputContext?.relationshipStatus || null }, unenteredFacts: [...(!inputContext?.jobStatus ? ["currentJob"] : []), ...(!inputContext?.relationshipStatus ? ["currentRelationship"] : []), "pastRelationshipExperience", "income", "investmentHistory", "partnerIntent", "familyComposition", "friendConflict", "pastSuccessOrFailure"], recall: { required: recall, actualLedgerPresent: displayed, eligible: false, reasons: recall ? ["ACTUAL_DISPLAY_NOT_INFERRED_FROM_PRECEDING_REFS", "SAME_OWNER_TYPE_ROOT_MEANING_CONTEXT_CLAIM_REQUIRED"] : [] }, meaningReviewRequired: true, customerEligible: false, customerRank: null, selectedForCustomer: false });
        }
        const conflicts = materialConflictGraph(this.index, diagnostics), byQuestion = new Map<string, MaterialDiagnostic[]>();
        for (const d of diagnostics)
            for (const fit of d.questionFits)
                if (!(byQuestion.get(fit.questionId) ?? []).some(x => x.catalogKey === d.catalogKey))
                    byQuestion.set(fit.questionId, [...(byQuestion.get(fit.questionId) ?? []), d]);
        const graphUnchanged = before === evidenceHash([request.graph, request.graphInput.evidence]), researchUnchanged = research === evidenceHash([...this.index.candidates.values()].map(c => [c.material, c.bindingCandidate.requirement])), errors = [...bound.errors, ...actual.errors, ...(!graphUnchanged ? ["GRAPH_OR_EVIDENCE_MUTATION"] : []), ...(!researchUnchanged ? ["RESEARCH_REQUIREMENT_MUTATION"] : []), ...(after.some(r => r.customerApproved) ? ["REAL_RESEARCH_APPROVAL_MUST_REMAIN_ZERO"] : [])];
        return { version: VERSION, mode: "REAL_RESEARCH_DIAGNOSTICS", fixtureId: request.graph.context.fixtureId, product: "saju_mbti_full", diagnostics, allProductReceipts: after, baselineProductReceipts: bound.after, meaningRelations: conflicts.relations, conflicts: conflicts.edges, duplicateFactGroups: conflicts.duplicateFactGroups, coverage: this.index.questions.map(q => { const ds = byQuestion.get(q.id) ?? []; return { questionId: q.id, address: q.address, linkedMaterials: ds.length, actualWitnessMaterials: ds.filter(d => d.binderReceipt.matches.some(m => m.matchedActualEvidence.length)).length, structuralMaterials: ds.filter(d => structurallyMatched(d.binderReceipt)).length, customerEligible: 0, unknown: [...q.requirement.remainingUnknown, ...(!ds.length ? ["NO_EXACT_ORIGINAL_MATERIAL_LINK"] : []), "MEANING_REVIEW_AND_APPROVAL_REQUIRED"] }; }), graphUnchanged, researchUnchanged, errors, actualCustomerEligible: 0, actualClaimsEmitted: 0, customerSelectionRun: false, bookChanges: 0 };
    }
}
