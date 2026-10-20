import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate, bindingCoverage } from "../knowledge-binder/engine";
import { evidenceHash } from "../actual-evidence-graph/graph";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { BIPOLAR_AXES } from "../../../interpretation-v4/semanticCore";
import { isRecord } from "../normalization";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import { CompatibilityMarriageIndex } from "./candidateIndex";
import { observePairWitnesses,pairWitnessErrors } from "../compatibility-love-specialist-engine/pairWitness";
import { MARRIAGE_POLICY, marriageDomainReasons } from "./policy";
import {marriageMaterialContext} from "./householdContext";
import {marriageConflictRelations} from "./conflictGraph";
import {MARRIAGE_CONFLICT_TYPES} from "./policy";
export class CompatibilityMarriageSpecialistEngine {
  readonly index;
  readonly candidateQueryMs;
  lastTimings = { binderMs: 0, conflictMs: 0 };
  constructor(readonly foundation: ProductSpecialistFoundation) { const t = performance.now(); this.index = new CompatibilityMarriageIndex(foundation); this.candidateQueryMs = performance.now() - t; }
  diagnose(request: KnowledgeBindingRequest, prepared?: SpecialistFoundationResult) {
    const e = request.graphInput.evidence;
    if (request.product !== "saju_mbti_compatibility" || request.relationship !== "marriage" || e.input.kind !== "compatibility" || e.composition.product !== "saju_mbti_compatibility" || e.composition.result.evidence.category !== "marriage") throw Error("COMPATIBILITY_MARRIAGE_SCOPE_REQUIRED");
    const input=e.input;
    const pairEvidence = e.composition.result.evidence;
    const original = evidenceHash([request.graph, e]), base = prepared ?? this.foundation.run(request), actual = new ActualBindingIndex(request, this.foundation.catalog);
    const binderStart = performance.now();
    const receipts = this.index.candidates.map(c => {
      const row = this.index.materials.get(c.record.catalogKey), candidate = structuredClone(row?.candidate ?? this.foundation.overlays.get(c.record.catalogKey)!.candidate);
      for (const s of row?.sources ?? []) if (s.spec?.selector?.direction && isRecord(s.originalRaw)) {
        const direction = s.spec.selector.direction === "A_TO_B" ? pairEvidence.directions.aToB : pairEvidence.directions.bToA;
        const spec = candidate.requirement.sourceRequirements.find(r => r.id === s.spec!.id)!;
        spec.selector!.evidenceId = direction.receivedTenGod?.tenGodKo === s.originalRaw.label ? direction.relationId : "NO_MATCH_FOR_DECLARED_TEN_GOD";
      }
      return bindKnowledgeCandidate(candidate, actual, this.foundation.catalog);
    });
    const binderMs = performance.now() - binderStart;
    const byKey = new Map(receipts.map(r => [r.candidateCatalogKey, r]));
    const diagnostics = [...this.index.materials].map(([catalogKey, row]) => {
      const receipt = byKey.get(catalogKey)!, allNodes = [...new Map(receipt.selectedActualEvidence.flatMap(id => { const n = actual.graph.nodes.get(id); return n ? actual.ancestors(n).map(n => [n.id, n] as const) : []; })).values()];
      const sourceWitnesses = row.sources.map(s => {
        const match = s.spec ? actual.match(s.spec) : null, selected = match?.matchedActualEvidence ?? [];
        const expectedGod = isRecord(s.originalRaw) && typeof s.originalRaw.label === "string" ? s.originalRaw.label : null;
        const exactDirectionGod = s.source.sourceUse === "recipient_direction_definition" ? selected.filter(n => { const value = actual.graph.nodes.get(n.nodeId)?.value; return isRecord(value) && isRecord(value.receivedTenGod) && value.receivedTenGod.tenGodKo === expectedGod; }).map(n => n.nodeId) : null;
        const validNodes=(exactDirectionGod ? selected.filter(w=>exactDirectionGod.includes(w.nodeId)) : selected).filter(w=>{const n=actual.graph.nodes.get(w.nodeId);return n&&!pairWitnessErrors(actual,n).length;});
        const documentary=s.source.sourceUse==="context_guidance_not_person_fact",reference=s.source.sourceUse==="directed_reference_only",unsupported=s.source.sourceUse==="unsupported_comparison_only";
        return { sourceUseState: unsupported?"WITHHELD_UNSUPPORTED":documentary?"DOCUMENTARY_REVIEW_REQUIRED":validNodes.length?reference?"REFERENCE_ONLY":"ACTUAL_EXISTENCE_MATCHED_APPLICATION_REVIEW_REQUIRED":"WITHHELD_ACTUAL_WITNESS_MISSING",validActualWitnesses:validNodes.map(n=>n.nodeId),documentaryIsPersonalFact:false, source: s.source, originalLocator: s.originalLocator, verified: s.verified, match, exactDirectionGod, originalConditionsPreserved: true };
      });
      const household = marriageMaterialContext(row.material,{A:input.personA.mbtiType||null,B:input.personB.mbtiType||null});
      const sourceConjunction={declared:row.material.requirements.sourceUsesAreConjunctive,entries:sourceWitnesses.map(s=>({source:s.source,state:s.sourceUseState,witnesses:s.validActualWitnesses})),allPersonalWitnessesPresent:sourceWitnesses.filter(s=>!["context_guidance_not_person_fact","directed_reference_only"].includes(s.source.sourceUse)).every(s=>s.validActualWitnesses.length>0&&s.source.sourceUse!=="unsupported_comparison_only"),allTypesMatched:household.predicates.every(p=>p.state==="MATCH"),applicationState:"REVIEW_REQUIRED",originalGroupsUnchanged:true};
      return { household,sourceConjunction, catalogKey, originalId: row.material.id, address: row.material.address, mode: row.material.mode, originalLocator: row.candidate.record.locator, readerQuestion: row.material.readerQuestion, coreMeaning: row.material.coreMeaning, roleContributions: row.material.roleContributions, originalRequirements: row.material.requirements, precedingMeaningRefs: row.material.precedingMeaningRefs, receipt, sourceWitnesses, allAncestry: allNodes.map(n => ({ id: n.id, kind: n.kind, owner: n.owner, roots: n.ancestry.rootIds, domains: n.ancestry.domains, source: n.sources })), marriageDomainReasons: marriageDomainReasons(allNodes.flatMap(n => n.ancestry.domains)), informationRoots: receipt.selectedActualEvidence.flatMap(id => { const n = actual.graph.nodes.get(id); return n?.fact.independentFact && n.fact.rootId ? [n.fact.rootId] : []; }), supportingAncestryRoots: receipt.canonicalFactRoots, axes: allNodes.flatMap(n => isRecord(n.value) && typeof n.value.axis === "string" ? [{ owner: n.owner.fixtureOwnerId, axis: n.value.axis, value: n.value.value ?? n.value.score, signed: (BIPOLAR_AXES as readonly string[]).includes(n.value.axis), sourceNode: n.id }] : []), facets: row.material.semanticFacets, meaningIdentity: null, claimIdentity: null, meaningReviewRequired: true, customerRank: null, customerSelected: false, customerEligible: false, recall: { required: row.material.mode === "RECALL", state: row.material.mode === "RECALL" ? "ACTUAL_DISPLAY_REQUIRED" : "NOT_APPLICABLE", actualSpecialistDisplays: 0, precedingReferencesAreDisplay: false }, repair: { required: row.material.chapterId === "CH08", state: row.material.chapterId === "CH08" ? "PREVENTION_OR_VERIFIED_PRECEDING_HOUSEHOLD_CONDITION_REQUIRED" : "NOT_APPLICABLE", precedingMeaningRefs: row.material.precedingMeaningRefs }, blockers: [...new Set([...receipt.followupRequirements,...household.reasons,...marriageDomainReasons(allNodes.flatMap(n=>n.ancestry.domains)), "MEANING_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING", ...(sourceWitnesses.some(s => s.exactDirectionGod?.length === 0) ? ["EXACT_DIRECTION_GOD_NOT_MATCHED"] : [])])] };
    });
    const conflictStart = performance.now(), conflicts = [];
    for (let i = 0; i < diagnostics.length; i++) for (let j = i + 1; j < diagnostics.length; j++) {
      const a = diagnostics[i], b = diagnostics[j], shared = a.informationRoots.filter(r => b.informationRoots.includes(r));
      conflicts.push({ left: a.catalogKey, right: b.catalogKey, sharedInformationRoots: shared, structuralConflicts: [...new Set([...(a.address === b.address ? ["ALTERNATIVE_PARAGRAPH_CANDIDATES"] : []), ...[a, b].flatMap(d => [...d.receipt.matches.flatMap(m => [...m.reasons, ...m.rejectedReasons]).filter(r => ["WRONG_OWNER", "WRONG_DIRECTION", "MISSING_PARTICIPANT", "DISALLOWED_ANCESTOR_DOMAIN"].includes(r)), ...d.marriageDomainReasons])])], marriageRelations:marriageConflictRelations({mode:a.mode,topics:a.household.topics,phases:a.household.process.phases.map(p=>p.phase),roots:a.informationRoots,meaningIdentity:a.meaningIdentity,claimIdentity:a.claimIdentity,meaningReviewed:false,reasons:[...a.blockers,...a.marriageDomainReasons]},{mode:b.mode,topics:b.household.topics,phases:b.household.process.phases.map(p=>p.phase),roots:b.informationRoots,meaningIdentity:b.meaningIdentity,claimIdentity:b.claimIdentity,meaningReviewed:false,reasons:[...b.blockers,...b.marriageDomainReasons]}), semanticState: "MEANING_REVIEW_REQUIRED", confirmedSemanticConflict: false });
    }
    this.lastTimings = { binderMs, conflictMs: performance.now() - conflictStart };
    const factRootIndex=Object.fromEntries([...new Set(diagnostics.flatMap(d=>d.informationRoots))].sort().map(root=>[root,diagnostics.filter(d=>d.informationRoots.includes(root)).map(d=>d.catalogKey)]));
    const { contentDigest, ...body } = e, graphUnchanged = original === evidenceHash([request.graph, e]);
    const errors = [...base.errors, ...actual.errors, ...(!graphUnchanged ? ["ORIGINAL_GRAPH_OR_PACKET_MUTATED"] : []), ...(contentDigest !== v4Digest(body) ? ["PRODUCER_PACKET_SEAL_INVALID"] : []), ...(receipts.some(r => r.customerApproved || r.operatorApproved) ? ["ACTUAL_APPROVAL_MUST_REMAIN_ZERO"] : [])];
    return { version: "compatibility-marriage-specialist-v1", mode: "REAL_RESEARCH_DIAGNOSTICS", fixtureId: request.graph.context.fixtureId, policy: MARRIAGE_POLICY, conflictVocabulary:MARRIAGE_CONFLICT_TYPES,factRootIndex, before: bindingCoverage(base.after), after: bindingCoverage(receipts), baselineReceipts: base.after, receipts, diagnostics, witnesses: observePairWitnesses(actual), ownerObservations: ["A", "B"].map(owner => ({ owner, ownerId: actual.owner(owner as "A" | "B"), nodes: [...actual.graph.nodes.values()].filter(n => n.owner.fixtureOwnerId === actual.owner(owner as "A" | "B")).map(n => ({ id: n.id, kind: n.kind, originalEvidenceId: n.fact.producerEvidenceId, pointer: n.fact.observationPointer, sourceClassification: isRecord(n.value) ? n.value.classification ?? null : null, valueType: isRecord(n.value) ? n.value.type ?? null : null, domains: n.ancestry.domains, roots: n.ancestry.rootIds })) })), signedAxes: [...actual.graph.nodes.values()].flatMap(n => isRecord(n.value) && typeof n.value.axis === "string" && typeof n.value.score === "number" ? [{ owner: n.owner.fixtureOwnerId, axis: n.value.axis, score: n.value.score, pointer: n.fact.observationPointer, roots: n.ancestry.rootIds }] : []), questionCoverage: this.index.questions.map(q => ({ questionId: q.id, address: q.address, linkedMaterials: this.index.lookup("QuestionId",q.id).map(row=>row.candidate.record.catalogKey), eligible: 0 })), conflicts, graphUnchanged, actualCustomerEligible: 0, customerSelectionRun: false, actualSpecialistClaims: 0, newActualRoots: 0, bookChanges: 0, errors: [...new Set(errors)] };
  }
}
export type CompatibilityMarriageResult = ReturnType<CompatibilityMarriageSpecialistEngine["diagnose"]>;
