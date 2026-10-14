import type { AxisSignalContract, KnowledgeCatalogRecord, KnowledgeSourcePointer } from "./types";
import { isRecord } from "./normalization";
/** Declaration validation only. Never binds an actual person to research. */
export function validateCatalogRecord(r: KnowledgeCatalogRecord): string[] {
  const reasons: string[] = [];
  if (!/^kc:v1:[a-f0-9]{64}$/.test(r.catalogKey)) reasons.push("INVALID_CATALOG_KEY");
  if (r.review.customerApproved !== false || r.connectedToRuntime !== false) reasons.push("UNAUTHORIZED_CUSTOMER_OR_RUNTIME_APPROVAL");
  if (!r.locator.recordSha256 || !/^[a-f0-9]{64}$/.test(r.locator.recordSha256)) reasons.push("INVALID_RECORD_HASH");
  if (!["PRESENT", "MISSING", "UNRESOLVED"].includes(r.review.sourceExistence)) reasons.push("INVALID_SOURCE_STATE");
  if (r.groupSemantics === "UNKNOWN_GROUP_SEMANTICS") reasons.push("UNKNOWN_GROUP_SEMANTICS");
  if (r.applicability.domainValidation === "UNRESOLVED") reasons.push("DOMAIN_REQUIRES_CROSSWALK_REVIEW");
  if (r.kind === "REJECTED_OR_HELD") reasons.push("HELD_NO_CUSTOMER_USE");
  return reasons;
}
export function validateTemporalDeclaration(start: string | null, end: string | null, requiredScope: string, declaredScope: string): string[] {
  const reasons = requiredScope !== declaredScope ? ["TEMPORAL_SCOPE_CONFLICT"] : [];
  if (!start || !end) reasons.push("ACTUAL_TIME_WINDOW_REQUIRED");
  else if (!Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(start) >= Date.parse(end)) reasons.push("INVALID_TEMPORAL_WINDOW");
  return reasons;
}
export function validateSignalDeclaration(signal: AxisSignalContract): string[] {
  return signal.negativeIsDefect !== false || signal.lowStrengthEstablishesOpposite !== false ? ["UNSUPPORTED_OPPOSITE_OR_DEFECT_INFERENCE"] : [];
}
export type BindingScenarioFixture = { mbti: string | null; birthTime: string | null; requiresMbti: boolean; requiresHour: boolean; requiredDirection: "A_TO_B" | "B_TO_A" | null; declaredDirection: "A_TO_B" | "B_TO_A" | null; allowedDomains: readonly string[]; ancestryDomains: readonly string[]; customerApproved: false };
/** Checks synthetic handoff fixtures only; returns gaps, never eligible candidates. */
export function validateBindingScenarioFixture(f: BindingScenarioFixture): string[] {
  const gaps: string[] = [];
  if (f.requiresMbti && f.mbti === null) gaps.push("ACTUAL_MBTI_SOURCE_REQUIRED");
  if (f.requiresHour && f.birthTime === null) gaps.push("ACTUAL_HOUR_EVIDENCE_REQUIRED");
  if (f.requiredDirection !== f.declaredDirection) gaps.push("DIRECTION_MISMATCH");
  if (!f.ancestryDomains.every(d => f.allowedDomains.includes(d))) gaps.push("ANCESTOR_DOMAIN_PROHIBITED");
  if (!f.customerApproved) gaps.push("CUSTOMER_APPROVAL_REQUIRED");
  return gaps;
}
export function asSourcePointer(value: unknown): KnowledgeSourcePointer | null { return isRecord(value) && typeof value.file === "string" ? value as KnowledgeSourcePointer : null; }
