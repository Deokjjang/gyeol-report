import { validateSignalDeclaration, validateTemporalDeclaration } from "../validation";
import { assessSourceUseFixture, type SourceUseFixture } from "../source-verification/safety";
import type { AxisSignalContract, MeaningRelation } from "../types";
export type SemanticUseContract = SourceUseFixture & {
  sourceClassification?: string; requestedClassification?: string; sourceCoverage?: string; claimsEmpiricalValidity?: boolean;
  signal?: AxisSignalContract; sourceSemanticKind?: "AXIS" | "FACET" | "TAG" | "DYNAMIC_TAG" | "FORTUNE_TAG";
  targetSemanticKind?: "AXIS" | "PERSONAL_TRAIT"; exactEquivalenceDeclared?: boolean;
  declaredRoles?: string[]; actualRolesVerified?: boolean; requiresRoleContext?: boolean;
  requiresRelationshipHistory?: boolean; actualHistorySupplied?: boolean;
  producerSupport?: "supported" | "unsupported" | "unknown";
  originScope?: string; targetScope?: string; start?: string | null; end?: string | null;
  fusionRootSystems?: string[]; samePersonFusionRoots?: boolean;
  groupSemantics?: "ALL_DIRECT_SOURCES" | "AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS" | "UNKNOWN_GROUP_SEMANTICS";
  requiredGroupKeys?: string[]; suppliedGroupKeys?: string[]; displayedCompatibleGroupVerified?: boolean; mergedAlternatives?: boolean;
};
/** Synthetic handoff validation; no actual facts, candidates, weights or customer approvals. */
export function verifySemanticUseContract(input: SemanticUseContract) {
  const original = assessSourceUseFixture(input), gates = new Set(original.requiredGates);
  if (input.sourceClassification === "REFERENCE_ONLY" && input.requestedClassification === "SCORING_SEMANTIC") gates.add("REFERENCE_ONLY_CANNOT_BECOME_SCORING");
  if (input.claimsEmpiricalValidity) gates.add("SOURCE_COVERAGE_IS_NOT_EMPIRICAL_VALIDITY");
  if (input.signal) for (const reason of validateSignalDeclaration(input.signal)) gates.add(reason);
  if (input.sourceSemanticKind === "FACET" && input.targetSemanticKind === "AXIS") gates.add("FACET_IS_NOT_WHOLE_PARENT_AXIS");
  if (input.sourceSemanticKind === "TAG" && input.targetSemanticKind === "AXIS") gates.add("TAG_RELATEDNESS_IS_NOT_AXIS_EQUIVALENCE");
  if (["DYNAMIC_TAG", "FORTUNE_TAG"].includes(input.sourceSemanticKind ?? "") && input.targetSemanticKind === "PERSONAL_TRAIT") gates.add("DYNAMIC_OR_FORTUNE_IS_NOT_PERMANENT_TRAIT");
  if ((input.requiresRoleContext || ["parentChild", "managerReport"].includes(input.category)) && !input.actualRolesVerified) gates.add("ACTUAL_ASYMMETRIC_ROLES_AND_AUTHORITY_REQUIRED");
  if (input.requiresRelationshipHistory && !input.actualHistorySupplied) gates.add("UNENTERED_RELATIONSHIP_HISTORY_IS_UNKNOWN");
  if (input.producerSupport === "unsupported") gates.add("UNSUPPORTED_PRODUCER");
  if (input.producerSupport === "unknown") gates.add("PRODUCER_SUPPORT_REVIEW_REQUIRED");
  if (input.originScope || input.targetScope) for (const reason of validateTemporalDeclaration(input.start ?? null, input.end ?? null, input.targetScope ?? "UNKNOWN", input.originScope ?? "UNKNOWN")) gates.add(reason);
  if (input.sourceKind === "FUSION_RESEARCH" && (!input.fusionRootSystems?.includes("myeongli") || !input.fusionRootSystems.includes("mbti") || !input.samePersonFusionRoots)) gates.add("BOTH_SAME_PERSON_FUSION_SOURCE_SYSTEMS_REQUIRED");
  if (input.requiredGroupKeys?.some(key => !input.suppliedGroupKeys?.includes(key))) gates.add("ALL_AND_GROUP_SOURCES_REQUIRED");
  if (input.groupSemantics === "UNKNOWN_GROUP_SEMANTICS") gates.add("UNKNOWN_GROUP_SEMANTICS");
  if (input.groupSemantics === "AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS" && !input.displayedCompatibleGroupVerified) gates.add("ACTUALLY_DISPLAYED_COMPATIBLE_GROUP_REQUIRED");
  if (input.mergedAlternatives) gates.add("CONDITIONAL_ALTERNATIVES_MUST_NOT_BE_MERGED");
  return { ...original, requiredGates: [...gates], sourceCoveragePreserved: input.sourceCoverage ?? "UNKNOWN", classificationPreserved: input.sourceClassification ?? "UNKNOWN", semanticScoresChanged: false as const, actualEvidenceIssued: 0 as const };
}
export type MeaningReuseInput = { sourceRootKeys: string[]; priorRootKeys: string[]; sourceClaimId: string | null; targetClaimId: string | null; sourceMeaningId: string | null; targetMeaningId: string | null; priorQuestion: string | null; targetQuestion: string | null; priorConditions: string[]; targetConditions: string[]; priorAction: string | null; targetAction: string | null; recallRequested: boolean; actuallyDisplayed: boolean };
export function classifyMeaningReuse(x: MeaningReuseInput): { relation: MeaningRelation | "INSUFFICIENT_VERIFICATION"; independentFactsAdded: 0; requiresActualRootGraph: true } {
  let relation: MeaningRelation | "INSUFFICIENT_VERIFICATION" = "INSUFFICIENT_VERIFICATION";
  const sameRoots = x.sourceRootKeys.length > 0 && new Set(x.sourceRootKeys).size === new Set(x.priorRootKeys).size && x.sourceRootKeys.every(k => x.priorRootKeys.includes(k));
  if (x.recallRequested) relation = x.actuallyDisplayed && sameRoots && x.sourceMeaningId !== null && x.sourceMeaningId === x.targetMeaningId ? "VALID_RECALL" : "INSUFFICIENT_VERIFICATION";
  else if (x.sourceMeaningId && x.targetMeaningId && x.sourceMeaningId !== x.targetMeaningId) relation = "DIFFERENT_MEANING";
  else if (x.sourceMeaningId && x.sourceMeaningId === x.targetMeaningId && x.priorQuestion && x.targetQuestion && x.priorQuestion !== x.targetQuestion && x.priorAction && x.targetAction && x.priorAction !== x.targetAction && x.priorConditions.length && x.targetConditions.length && JSON.stringify(x.priorConditions) !== JSON.stringify(x.targetConditions)) relation = "NEW_APPLICATION";
  else if (x.sourceClaimId && x.sourceClaimId === x.targetClaimId) relation = "SAME_CLAIM";
  else if (x.sourceMeaningId && x.sourceMeaningId === x.targetMeaningId) relation = "SAME_MEANING";
  else if (sameRoots) relation = "SAME_FACT";
  return { relation, independentFactsAdded: 0, requiresActualRootGraph: true };
}
