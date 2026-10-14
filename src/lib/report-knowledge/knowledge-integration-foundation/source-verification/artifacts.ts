import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stableJson } from "../compiler";
import { technicallyVerified } from "./classification";
import type { VerificationArtifacts } from "./types";
export function writeVerificationArtifacts(out: string, a: VerificationArtifacts): void {
  mkdirSync(out, { recursive: true });
  const write = (name: string, value: unknown) => writeFileSync(join(out, name + ".json"), stableJson(value));
  write("source-verification-manifest", a.manifest);
  write("reference-classification", a.receipts.map(r => ({ referenceKey: r.referenceKey, affectedCatalogKey: r.affectedCatalogKey, originalResearchId: r.originalResearchId, researchFamily: r.researchFamily, referenceField: r.referenceField, referenceKind: r.referenceKind, originalTarget: r.originalTarget, originalReason: r.originalReason, originalLocator: r.originalLocator, originalEdgeOrdinal: r.originalEdgeOrdinal, targetNamespace: r.targetNamespace, requiredSourceKind: r.requiredSourceKind, resolutionState: r.resolutionState, risk: r.risk })));
  write("source-verification-receipts", a.receipts);
  write("source-verification-overlay", a.receipts.map((r, i) => ({ referenceKey: r.referenceKey, originalCatalogKey: r.affectedCatalogKey, originalField: r.referenceField, originalEdgeOrdinal: r.originalEdgeOrdinal, receiptReference: `source-verification-receipts.json#/${i}`, resolutionState: r.resolutionState, matchedLocator: r.matchedLocator, bindingBlocked: true, customerApproved: false, originalReferencePreserved: true })));
  write("verified-source-resolutions", a.receipts.filter(technicallyVerified).map(r => ({ referenceKey: r.referenceKey, resolutionState: r.resolutionState, method: r.verificationMethod, locator: r.matchedLocator, originalId: r.matchedOriginalId, proofs: r.verificationEvidence })));
  write("verified-aliases", a.receipts.filter(r => r.resolutionState === "UNIQUE_ALIAS_VERIFIED").map(r => ({ referenceKey: r.referenceKey, originalTarget: r.originalTarget, candidates: r.candidateTargets, proofs: r.verificationEvidence, method: r.verificationMethod })));
  write("verified-fragments", a.receipts.filter(r => r.resolutionState === "FRAGMENT_VERIFIED" || r.resolutionState === "PARTIAL_FRAGMENT").map(r => ({ referenceKey: r.referenceKey, originalTarget: r.originalTarget, state: r.resolutionState, proofs: r.verificationEvidence, blockers: r.blockingReasons })));
  write("audit-reference-results", a.receipts.filter(r => r.targetNamespace === "AUDIT_REFERENCE" || r.verificationMethod.includes("ALIAS_REGISTRY")).map(r => ({ referenceKey: r.referenceKey, originalTarget: r.originalTarget, state: r.resolutionState, method: r.verificationMethod, proofs: r.verificationEvidence, originalSourceVerified: technicallyVerified(r) })));
  write("mbti-source-verification", a.receipts.filter(r => r.targetNamespace === "MBTI_STRUCTURED_ID").map(r => ({ referenceKey: r.referenceKey, originalTarget: r.originalTarget, state: r.resolutionState, proofs: r.verificationEvidence, sourceCoverage: r.sourceReviewState.MBTI_SOURCE_COVERAGE, customerApproved: false })));
  write("saju-source-verification", a.receipts.filter(r => ["SAJU_KNOWLEDGE_ID", "FOUNDATION_ID", "TRADITIONAL_SOURCE_ID", "LOCATOR", "FIELD_FRAGMENT"].includes(r.targetNamespace)).map(r => ({ referenceKey: r.referenceKey, state: r.resolutionState, proofs: r.verificationEvidence, actualCalculatedEvidenceRequired: true })));
  write("fusion-source-prerequisites", a.receipts.filter(r => r.impact.originalRecordKind === "FUSION_RESEARCH").map(r => ({ referenceKey: r.referenceKey, state: r.resolutionState, originalTarget: r.originalTarget, rootsMustShareActualOwner: true, individualAndPairScopesDistinct: true, sourceIsNotNewThirdFact: true, blockingReasons: r.blockingReasons })));
  write("source-group-review", a.groups); write("domain-review-queue", a.domainQueue);
  write("binding-blockers", a.receipts.map(r => ({ referenceKey: r.referenceKey, catalogKey: r.affectedCatalogKey, risk: r.risk, sourceState: r.resolutionState, requiredGates: r.blockingReasons, bindingAllowed: false })));
  write("reference-impact", a.receipts.map(r => ({ referenceKey: r.referenceKey, risk: r.risk, impact: r.impact, originalFamily: r.researchFamily, originalId: r.originalResearchId })));
  write("source-status-matrix", a.receipts.map(r => ({ referenceKey: r.referenceKey, ...r.sourceReviewState })));
  write("unresolved-after-verification", a.receipts.filter(r => !technicallyVerified(r)).map(r => ({ referenceKey: r.referenceKey, affectedCatalogKey: r.affectedCatalogKey, originalTarget: r.originalTarget, state: r.resolutionState, reasons: r.blockingReasons, followupAction: r.followupAction })));
  write("verified-alias-declarations", a.aliasDeclarations); write("verified-file-integrity", a.sourceIntegrity); write("binding-safety-contract", a.safetyContract);
}
