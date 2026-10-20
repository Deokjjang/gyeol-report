import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stableJson } from "../compiler";
import type { SemanticArtifacts, SemanticConfig } from "./types";
export function writeSemanticArtifacts(out: string, a: SemanticArtifacts, config: SemanticConfig): void {
  mkdirSync(out, { recursive: true });
  const write = (name: string, value: unknown) => writeFileSync(join(out, `${name}.json`), stableJson(value));
  write("semantic-domain-manifest", a.manifest);
  write("semantic-review-queue", a.decisions.map(d => ({ catalogKey: d.catalogKey, originalId: d.originalId, researchFamily: d.researchFamily, originalDomain: d.sourceDomain, sourceReference: d.sourceVerificationReferenceKeys, sourceMeaning: d.originalMeaning, semanticAxis: d.semanticAxis, semanticFacet: d.semanticFacet, targetContext: d.context, targetProduct: d.targetProduct, targetRelationship: d.targetRelationship, originalPolicy: d.originalPolicyRefs, requiredEvidence: d.requiredEvidence, sourceAncestry: d.ancestryRefs, sourceReviewState: d.originalSourceReviewState, counterexamples: d.counterexamples, prohibitions: d.prohibitedInference, decisionState: d.decisionState, reviewActorType: d.reviewActorType, customerApproved: false })));
  write("semantic-domain-decisions", a.decisions); write("source-meaning-review", a.reviews);
  write("domain-policy-matrix", a.policyProofs);
  write("product-domain-matrix", config.products.map(p => ({ ...p, declaredSpecialistQuestions: (a.inventory.specialistProductQuestions as Record<string, unknown[]>)[p.id] ?? [], sourceProofs: a.reviews.filter(r => p.originalIds.includes(r.sourceProof.originalId)).map(r => r.sourceProof), allowedSourceDomainExpansion: false, actualUserState: "UNKNOWN", customerApproved: false })));
  write("relationship-domain-matrix", config.relationships.map(p => ({ ...p, declaredSpecialistQuestions: (a.inventory.specialistRelationshipQuestions as Record<string, unknown[]>)[p.id] ?? [], sourceProofs: a.reviews.filter(r => p.originalIds.includes(r.sourceProof.originalId)).map(r => r.sourceProof), explicitProhibitionRules: a.policyProofs.filter(r => r.rule.relationship === p.id), allowedSourceDomainExpansion: false, actualRolesAndHistory: "UNKNOWN", customerApproved: false })));
  write("semantic-crosswalk-review", a.crosswalk); write("semantic-definition-inventory", a.inventory);
  write("facet-application-conditions", a.facets); write("legacy-tag-review", a.tags);
  write("fusion-semantic-review", a.fusion); write("saju-semantic-review", a.saju); write("mbti-semantic-review", a.mbti);
  write("ancestor-domain-audit", a.ancestry); write("source-group-semantic-review", a.groups);
  write("semantic-review-receipts", a.receipts);
  write("semantic-domain-overlay", a.decisions.map((d, i) => ({ catalogKey: d.catalogKey, originalId: d.originalId, originalRecordHash: d.originalRecordHash, decisionKey: d.decisionKey, decisionReference: `semantic-domain-decisions.json#/${i}`, receiptKey: d.receiptKey, receiptReference: `semantic-review-receipts.json#/${i}`, sourceVerificationReferenceKeys: d.sourceVerificationReferenceKeys, decisionState: d.decisionState, originalPreserved: true, bindingAllowed: false, customerApproved: false })));
  write("human-review-queue", a.decisions.map(d => ({ catalogKey: d.catalogKey, originalId: d.originalId, modelReading: d.reviewState, operatorApproved: false, priority: d.blockingReasons.some(b => b.code === "EXPLICITLY_PROHIBITED") ? "CRITICAL" : d.blockingReasons.some(b => b.code === "SOURCE_INCOMPLETE") ? "HIGH" : "MEDIUM", reviewRequired: ["ORIGINAL_MEANING", "DECLARED_SCOPE", "DOMAIN_AND_PRODUCT", "ACTUAL_EVIDENCE_OWNER_DIRECTION_TIME", "CUSTOMER_APPROVAL"], blockers: d.blockingReasons })));
  write("incomplete-source-references", a.decisions.filter(d => d.blockingReasons.some(b => b.code === "SOURCE_INCOMPLETE")).map(d => ({ catalogKey: d.catalogKey, originalId: d.originalId, sourceReferences: d.sourceVerificationReferenceKeys, blockers: d.blockingReasons.filter(b => b.code === "SOURCE_INCOMPLETE") })));
  write("evidence-graph-requirements", a.decisions.map(d => ({ catalogKey: d.catalogKey, sourceDomain: d.sourceDomain, targetProduct: d.targetProduct, targetRelationship: d.targetRelationship, requiredEvidence: d.requiredEvidence, requiredUserState: d.requiredUserState, prohibitedInference: d.prohibitedInference, ancestryRefs: d.ancestryRefs, allDeclaredConditionsRequired: true, researchIdIsNotEvidence: true, actualEvidenceIssued: 0, customerApproved: false })));
  write("semantic-duplication-review", a.duplication); write("verified-source-integrity", a.sourceIntegrity);
}
