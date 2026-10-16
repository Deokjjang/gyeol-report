import { SPECIALIST_FOUNDATION_VERSION, type SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
export function assertFoundationScope(request: KnowledgeBindingRequest, prepared: SpecialistFoundationResult): void {
  if (prepared.version !== SPECIALIST_FOUNDATION_VERSION || prepared.fixtureId !== request.graph.context.fixtureId || !prepared.graphUnchanged || !prepared.catalogUnchanged || prepared.errors.length || prepared.customerEligible || prepared.customerClaimsEmitted || prepared.bookChanges || prepared.rankingEnabled) throw Error("PREPARED_FOUNDATION_SCOPE_OR_STATE_MISMATCH");
  for (const receipt of [...prepared.before, ...prepared.after, ...prepared.periodAttempts.map(a => a.receipt)]) {
    if (receipt.fixtureId !== prepared.fixtureId || receipt.product !== request.product || receipt.relationship !== request.relationship || receipt.operatorApproved || receipt.customerApproved) throw Error("PREPARED_RECEIPT_FIXTURE_PRODUCT_RELATIONSHIP_MISMATCH");
  }
}
export function auditFoundationCacheIsolation(request: KnowledgeBindingRequest, prepared: SpecialistFoundationResult) {
  assertFoundationScope(request, prepared);
  return [
    {condition: "foreign fixture", value: {...prepared, fixtureId: "foreign-fixture"}},
    {condition: "foreign product receipt", value: {...prepared, after: prepared.after.map((r, i) => i ? r : {...r, product: request.product === "major_fortune" ? "annual_fortune" as const : "major_fortune" as const})}},
    {condition: "foreign relationship receipt", value: {...prepared, after: prepared.after.map((r, i) => i ? r : {...r, relationship: request.relationship === "friendship" ? "marriage" as const : "friendship" as const})}}
  ].map(test => {let error: string | null = null; try {assertFoundationScope(request, test.value);} catch (e) {error = e instanceof Error ? e.message : String(e);} if (!error) throw Error("FOREIGN_FOUNDATION_CACHE_ACCEPTED"); return {condition: test.condition, blocked: true, error};});
}
