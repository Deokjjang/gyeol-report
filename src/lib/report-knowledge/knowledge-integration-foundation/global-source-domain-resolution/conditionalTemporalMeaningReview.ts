import { canonicalJson, hash, recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import { meaningDecomposition } from "../semantic-domain-review-workbench/applicability";
import type { OriginalReading, ReadingProposal } from "../semantic-domain-review-workbench/types";
import type { KnowledgeCatalogRecord, ProductKey } from "../types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { TemporalTenGodSourceResolver, type TemporalGod } from "./temporalTenGodSource";
import { verifyTemporalTenGodCalculation, type TenGodApplicationRequest } from "./temporalTenGodEvidence";
import { CONDITIONAL_TEMPORAL_READINGS, EXTERNAL_TEMPORAL_SOURCES, type MeaningField } from "./conditionalTemporalReviewMaterial";

const materialFile = "src/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/conditionalTemporalReviewMaterial.ts";
const majorFile = "src/lib/report-knowledge/major-fortune-product-research/tenGodResearch.ts";
const fields = ["dayun", "saeun", "wolun"] as const;
export const MEANING_TEMPORAL_SCOPES = { dayun: "dayun", saeun: "annual", wolun: "month" } as const;
export type TemporalMeaningReviewState = "SOURCE_VERIFIED" | "SOURCE_UNVERIFIED" | "CONDITIONAL_MEANING_PROPOSED" | "MEANING_REVIEW_REQUIRED" | "PRODUCT_REVIEW_REQUIRED" | "CUSTOMER_APPROVAL_PENDING";
export type TemporalMeaningContract = Awaited<ReturnType<typeof reviewTemporalMeaning>>;
export type TemporalReviewDemand = {
  packetHash: string; requestedScope: "dayun" | "annual" | "month";
  claimedMeaningApproval?: boolean; customerApproved?: boolean;
};
const digest = (value: unknown) => hash(canonicalJson(value));
/** One exact original field, never a replacement Source ID or an approval.
 * The existing Workbench decomposer separates the original from our proposal.
 * Its legacy content extractor omits temporal fields, so supply the verified
 * field explicitly; do not alter that extractor or its frozen review packets. */
export async function reviewTemporalMeaning(resolver: TemporalTenGodSourceResolver, record: KnowledgeCatalogRecord, field: MeaningField) {
  if (!fields.includes(field)) throw Error("EXACT_TEMPORAL_MEANING_FIELD_REQUIRED");
  const source = await resolver.temporalContract(record);
  if (!source.sourceResolved || !source.originalResearch || !source.originalRecordHash || !source.originalSourceVersion)
    throw Error("ORIGINAL_TEMPORAL_SOURCE_REQUIRED");
  const original = await resolver.record(record);
  if (!isRecord(original) || typeof original[field] !== "string") throw Error("ORIGINAL_MEANING_REQUIRED");
  const god = original.god as TemporalGod, reading = CONDITIONAL_TEMPORAL_READINGS.find(r => r.god === god);
  if (!reading || new Set(CONDITIONAL_TEMPORAL_READINGS.map(r => r.god)).size !== 10) throw Error("EXACT_REVIEW_MATERIAL_REQUIRED");
  const materialIndex = CONDITIONAL_TEMPORAL_READINGS.indexOf(reading);
  const reviewProof = await resolver.proof({ file: materialFile, exportName: "CONDITIONAL_TEMPORAL_READINGS", index: materialIndex,
    recordSha256: recordHash(reading), sourceVersion: resolver.frozen.get(materialFile) }, null, null, "AUDIT_RECORD");
  const external = await Promise.all([...reading.sources, "sm2", "zp25", "dt9"].filter((id, i, all) => all.indexOf(id) === i).map(async id => {
    const index = EXTERNAL_TEMPORAL_SOURCES.findIndex(s => s.id === id), s = EXTERNAL_TEMPORAL_SOURCES[index];
    if (!s || s.status !== 200 || !s.shortLocatorAnchor || !/^[a-f0-9]{64}$/.test(s.bodySha256)
      || !Number.isFinite(Date.parse(s.accessedAt)) || !s.finalUrl.startsWith("https://")) throw Error("ACCESSED_EXTERNAL_SOURCE_REQUIRED");
    const proof = await resolver.proof({ file: materialFile, exportName: "EXTERNAL_TEMPORAL_SOURCES", index, originalId: s.id,
      recordSha256: recordHash(s), sourceVersion: resolver.frozen.get(materialFile) }, s.id, null, "AUDIT_RECORD");
    return { source: s, proof, scope: "ACCESS_RECEIPT_AND_HISTORICAL_CONCEPT_NOT_EXACT_MODERN_MEANING" as const };
  }));
  const majors = resolver.records.filter(r => r.originalId === `mfpr:god:${god}` && r.locator.file === majorFile && r.locator.exportName === "MAJOR_TEN_GOD_RESEARCH");
  if (majors.length !== 1) throw Error("EXACT_MAJOR_RESEARCH_REQUIRED");
  const major = await resolver.record(majors[0]);
  if (!isRecord(major) || !isRecord(major.inheritedRole) || major.inheritedRole.originalId !== record.originalId
    || major.inheritedRole.file !== record.locator.file || major.inheritedRole.exportName !== record.locator.exportName
    || major.inheritedRole.recordSha256 !== source.originalRecordHash || typeof major.inheritedRole.sourceVersion !== "string") throw Error("EXACT_INHERITED_ROLE_REQUIRED");
  const inheritedProof = await resolver.proof({ file: String(major.inheritedRole.file), exportName: String(major.inheritedRole.exportName),
    index: Number(major.inheritedRole.index), originalId: record.originalId, recordSha256: String(major.inheritedRole.recordSha256),
    sourceVersion: major.inheritedRole.sourceVersion }, record.originalId, record.catalogKey);
  const majorProof = await resolver.proof(majors[0].locator, majors[0].originalId, majors[0].catalogKey);
  const detail = reading.fields[field];
  const requiredConditions = {
    calculated: ["같은 Owner의 실제 기준·대상 천간과 십성", "원국·대운·실효 연주·월간/월지 본기 출처 구별", "원래 cycle/입춘/절입/교운 경계 안의 확정 구간"],
    unresolvedNatal: String(major.natalRequired), unresolvedElement: String(major.elementRequired),
    modernActualContext: [String(original.extraEvidence), detail.requiredContext],
    formationNotProduced: ["강약·격국·용신·제살·도식·합화는 십성 하나로 성립시키지 않음"],
  };
  const prohibitions = [...(Array.isArray(major.forbidden) ? major.forbidden.map(String) : []), String(original.risk),
    "미입력 과거 사건·권한·계약·수입·지원자 생성 금지", "상징과 현대 질문을 실증적 미래 사건 근거로 승격 금지"];
  const proposal: ReadingProposal = {
    catalogKey: record.catalogKey, originalId: record.originalId, expectedRecordHash: source.originalRecordHash,
    engine: field === "dayun" ? "major-fortune" : "annual-fortune", primaryMeaning: detail.analysis,
    relatedButDifferentMeaning: reading.traditionalSupport, requiredConditions: [...requiredConditions.calculated, ...requiredConditions.modernActualContext],
    counterexamples: [reading.counterexample, detail.counterexample, String(original.reversal)], validConditionalApplication: detail.analysis,
    unusableInterpretation: prohibitions.join(" · "), reviewState: "MODEL_PROPOSED_REVIEW", operatorApproved: false, customerApproved: false,
    originalRecordActuallyRead: true, supportingExternalPagesFreshlyRead: false,
    sourceFields: ["/" + field], says: original[field], doesNotSay: prohibitions.join(" · "),
    missingUserFacts: detail.requiredContext, safeExample: "조건이 실제 확인될 때만 검토할 질문: " + original[field],
    unsafeFactExample: "이 십성이 있으므로 이미 소득·권한·지원자가 생겼다.", unsafeFutureExample: "이 운이므로 성공·실패가 확정된다.",
    claimLayers: [{ layer: "PRACTICAL_REFLECTION_QUESTION", field: "/" + field, explanation: detail.analysis }],
  };
  // The Workbench's legacy ModelReview flag is literally false. Fresh external
  // reads are evidenced separately above, never disguised as that old packet.
  const contentFields = [{ pointer: "/" + field, text: original[field] }];
  const originalReading: OriginalReading = { catalogKey: record.catalogKey, originalId: record.originalId, original,
    proof: source.originalResearch, contentFields, contentHash: digest(contentFields), sourceVersionVerified: true };
  const productScopes: ProductKey[] = ["major_fortune", "annual_fortune"];
  const states: TemporalMeaningReviewState[] = ["SOURCE_VERIFIED", "SOURCE_UNVERIFIED", "CONDITIONAL_MEANING_PROPOSED", "MEANING_REVIEW_REQUIRED", "PRODUCT_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"];
  const body = {
    version: "conditional-temporal-meaning-review-v1" as const, originalResearchId: record.originalId, originalMeaningField: field,
    originalMeaning: original[field], originalRecordHash: source.originalRecordHash, originalSourceVersion: source.originalSourceVersion,
    originalSourceIdentity: source.traditionalDefinition.exactSourceRecordIdentity,
    originalSourceProof: source.originalResearch, definitionProof: source.traditionalDefinition.exactDefinitionSource,
    inheritedSourceProof: inheritedProof, majorSourceProof: majorProof, reviewProof, externalSources: external,
    sourceState: "SOURCE_VERIFIED" as const, sourceVerificationScope: "EXACT_REPOSITORY_DEFINITION_AND_NEW_READ_RECEIPTS" as const,
    exactConditionalMeaningSource: "SOURCE_UNVERIFIED" as const,
    traditionalMeaning: { text: reading.traditionalSupport, layer: "TRADITIONAL_SYMBOLIC_MEANING" as const, historicalNotEmpirical: true },
    meaningClaim: { text: detail.analysis, classification: detail.classification, layer: "PRACTICAL_REFLECTION_QUESTION" as const,
      directTraditionalSupport: false, empiricallyValidated: false, state: "CONDITIONAL_MEANING_PROPOSED" as const },
    sourceDoesNotSupport: ["이 원문 생활 조언의 직접 인용·효과·실제 발생", "대운 취운 논의를 월별 행동 법칙으로 자동 전환", ...external.flatMap(s => s.source.doesNotSupport)],
    requiredConditions, counterexamples: proposal.counterexamples, prohibitedInferences: prohibitions,
    originalConditionReview: { natalRequired: major.natalRequired, elementRequired: major.elementRequired, extraEvidence: original.extraEvidence,
      positive: original.positive, risk: original.risk, reversal: original.reversal, forbidden: major.forbidden,
      assessment: "natal/element 조건은 연결 근거가 있을 때 별도 확인; 계산된 시간 십성만으로 충족되지 않음. positive/risk/reversal은 관측 사실이 아닌 조건부 제안·제한이다." },
    temporalScope: MEANING_TEMPORAL_SCOPES[field], commonMeaningId: reading.commonMeaningId,
    temporalIndependence: { independentKnowledgeCount: 0, assessment: reading.periodAssessment, separateApplicationQuestion: detail.analysis },
    productApplicability: { proposedScopes: productScopes, state: "PRODUCT_REVIEW_REQUIRED" as const, permissionGranted: false,
      limitation: field === "wolun" ? "Major의 14년 관찰에 월운 근거를 대체 적용하지 않음" : "기간·상품·Domain/ancestry 정책 검토 전 보류" },
    workbenchDecomposition: meaningDecomposition(originalReading, proposal), states,
    meaningReview: "MEANING_REVIEW_REQUIRED" as const, customerApproval: "CUSTOMER_APPROVAL_PENDING" as const,
    customerApproved: false as const, operatorApproved: false as const, customerClaims: 0 as const, readerBridge: 0 as const, newIndependentFacts: 0 as const,
  };
  return { ...body, packetHash: digest(body) };
}
/** Execute against actual Graph/packet, not caller-supplied verification flags.
 * This diagnostic path cannot issue approval or change a native Binder gate. */
export async function applyTemporalMeaningReview(resolver: TemporalTenGodSourceResolver, record: KnowledgeCatalogRecord, field: MeaningField,
  request: KnowledgeBindingRequest, spec: TenGodApplicationRequest, demand: TemporalReviewDemand) {
  const review = await reviewTemporalMeaning(resolver, record, field);
  const reasons: string[] = [];
  if (demand.packetHash !== review.packetHash) reasons.push("REVIEW_PACKET_HASH_MISMATCH");
  if (demand.claimedMeaningApproval || demand.customerApproved) reasons.push("REVIEW_PROPOSAL_IS_NOT_APPROVAL");
  if (demand.requestedScope !== review.temporalScope) reasons.push("WRONG_MEANING_PERIOD");
  const origins = { dayun: ["DAYUN_STEM"], saeun: ["ANNUAL_STEM"], wolun: ["MONTH_STEM", "MONTH_BRANCH_MAIN"] };
  if (!origins[field].includes(spec.origin)) reasons.push("WRONG_ORIGIN_OR_REFERENCE_BASIS");
  const god = (await resolver.record(record) as Record<string, unknown>).god;
  if (spec.god !== god) reasons.push("WRONG_RESEARCH_TEN_GOD");
  const calculation = verifyTemporalTenGodCalculation(resolver, request, spec);
  if (calculation.actualCalculation !== "ACTUAL_CALCULATION_VERIFIED" || !calculation.temporalScopeValid) reasons.push("ACTUAL_SCOPED_CALCULATION_REQUIRED");
  if (!review.productApplicability.proposedScopes.includes(request.product)) reasons.push("WRONG_PRODUCT_SCOPE");
  if (field === "wolun" && request.product !== "annual_fortune") reasons.push("ACTUAL_MONTH_PRODUCER_REQUIRED");
  return { originalResearchId: record.originalId, originalMeaningField: field, packetHash: review.packetHash,
    calculatedTenGod: calculation.calculatedTenGod, originLayer: calculation.origin, owner: calculation.owner,
    referenceStem: calculation.referenceStem, targetStem: calculation.targetStem, actualProducer: calculation.producer,
    actualEvidence: { nodeId: spec.nodeId, roots: calculation.canonicalFactRoots, sources: calculation.sourceAncestry, calculationSource: calculation.calculationSource },
    temporalScope: review.temporalScope, effectiveInterval: calculation.effectiveInterval, calculation,
    technicalLinkage: reasons.length ? "WITHHELD" as const : "SCOPED_CALCULATION_LINK_VERIFIED" as const,
    requiredConditions: review.requiredConditions, unfulfilledConditions: [review.requiredConditions.unresolvedNatal, review.requiredConditions.unresolvedElement,
      ...review.requiredConditions.modernActualContext, ...review.requiredConditions.formationNotProduced],
    reasons: [...reasons, "MEANING_REVIEW_REQUIRED", "PRODUCT_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"],
    status: "WITHHELD" as const, meaningApproved: false as const, customerApproved: false as const,
    customerClaims: 0 as const, readerBridge: 0 as const, newIndependentFacts: 0 as const };
}
export function temporalReviewDigest(value: unknown) { return digest(value); }
