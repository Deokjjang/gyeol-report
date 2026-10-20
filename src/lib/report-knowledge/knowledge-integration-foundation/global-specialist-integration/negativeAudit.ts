import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import type { CandidateEnvelope, EngineRegistration } from "./types";
import { GlobalSpecialistRegistry } from "./engineRegistry";
import { GlobalCandidateIdentityIndex } from "./identityIndex";
import { digest, validateEnvelope } from "./candidateEnvelope";
import { compilePlannerHandoff } from "./plannerHandoff";

export function runNegativeAudit(registry: GlobalSpecialistRegistry, entry: EngineRegistration, request: KnowledgeBindingRequest, envelope: CandidateEnvelope, receipt: KnowledgeBindingReceipt) {
  const original = digest([envelope, receipt, request.graph]);
  const tests: readonly [string, string, () => void][] = [
    ["A", "Duplicate engine registration", () => {new GlobalSpecialistRegistry([entry, entry]);}],
    ["B", "Wrong product", () => {registry.assertRequest(entry, {...request, product: request.product === "major_fortune" ? "annual_fortune" : "major_fortune"});}],
    ["C", "Wrong relationship", () => {registry.assertRequest(entry, {...request, relationship: request.relationship === "friendship" ? "marriage" : "friendship"});}],
    ["D", "Source hash tampering", () => changed(e => {e.originalMaterial.recordHash = "tampered";})],
    ["E", "Source encoding changed", () => changed(e => {e.sourceHashes = [{hash: "original", encoding: "OTHER_ENCODING"}];})],
    ["F", "Catalog/address collision", () => {const index = new GlobalCandidateIdentityIndex(); index.register(envelope); index.register(envelope);}],
    ["G", "Fixture owner collision", () => changed(e => {e.fixtureScope.ownerIds = ["foreign-fixture-owner"];})],
    ["H", "Whole swap mislabeled as name-only", () => changed(e => {e.fixtureScope = {...e.fixtureScope, ownerIds: ["B_AS_A_WITHOUT_PRODUCER_REPLAY"]};})],
    ["I", "Reverse directional evidence reuse", () => changed(e => {e.directionRequirements = envelope.directionRequirements[0] === "A_TO_B" ? ["B_TO_A"] : ["A_TO_B"];})],
    ["J", "Nonoverlapping time evidence", () => changed(e => {e.temporalRequirements = {start: "1990-01-01", endExclusive: "1991-01-01", scope: "month"};})],
    ["K", "Conditional transition made exact", () => changed(e => {e.temporalRequirements = {certainty: "confirmed", forgedFrom: "conditional"};})],
    ["L", "Month stem and branch main mixed", () => changed(e => {e.temporalRequirements = {role: "MONTH_STEM_AS_MONTH_BRANCH_MAIN"};})],
    ["M", "Required gate bypass by not-applicable", () => {const r = structuredClone(receipt); r.allTwelveGateResults[1].state = "NOT_APPLICABLE"; validateEnvelope(envelope, envelope, r);}],
    ["N", "Partial source group passed", () => changed(e => {e.sourceGroups = []; e.sourceRequirements = [{id: "partial-group-forgery", originalField: "/forged", originalDeclaration: null, sourceKey: null, sourceCatalogKeys: [], owner: "UNKNOWN", use: "UNKNOWN", selector: null, required: false, gaps: []}];})],
    ["O", "Mix alternative source group pieces", () => changed(e => {e.sourceGroups = [{originalIndex: 99, originalId: "mixed", semantics: "ALL_DIRECT_SOURCES", sourceRequirementIds: ["foreign-piece"], typePredicates: [], originalDeclaration: null, originalTechnicalState: "PASS", requiresDisplayedLedger: false}];})],
    ["P", "Forged recall display", () => changed(e => {e.displayRequirements = {actuallyDisplayed: true, source: "caller"};})],
    ["Q", "Forged repair predecessor", () => changed(e => {e.displayRequirements = {precedingMaterial: "forged", conflictVerified: true};})],
    ["R", "Synthetic approval applied to actual research", () => {const r = structuredClone(receipt); r.operatorApproved = true; r.customerApproved = true; validateEnvelope(envelope, envelope, r);}],
    ["S", "Other-product reuse budget copied", () => changed(e => {e.specialistPolicies.registryRef = "foreign-product-budget";})],
    ["T", "Forbidden domain bypass", () => changed(e => {e.prohibitions = "ALLOW_ALL_DOMAINS";})],
    ["U", "Children ancestry relabeled as relationships", () => changed(e => {e.supportingAncestryRoots = ["CHILDREN_RENAMED_RELATIONSHIPS"];})],
    ["V", "Unknown context asserted as fact", () => changed(e => {e.actualContextRequirements = {married: true, parentageConfirmed: true, authorityConfirmed: true};})],
    ["W", "Pending meaning made verified", () => changed(e => {e.semanticIdentity = "VERIFIED_WITHOUT_REVIEW";})],
    ["X", "Legacy published edition mislabeled", () => changed(e => {e.displayRequirements = {publishedEdition: "NEW_READER_WITHOUT_RUNTIME_PROOF"};})],
    ["Y", "Source match counted as independent fact", () => changed(e => {e.informationRoots = ["SOURCE_REFERENCE_AS_NEW_FACT"];})],
    ["Z", "Planner assignment without approval", () => {const broken = structuredClone(envelope); Object.assign(broken.plannerReadiness, {plannerAssignable: true}); compilePlannerHandoff(broken);}]
  ];
  function changed(mutate: (e: CandidateEnvelope) => void) {const copy = structuredClone(envelope); mutate(copy); validateEnvelope(copy, envelope, receipt);}
  const results = tests.map(([id, condition, execute]) => {let error: string | null = null; try {execute();} catch (e) {error = e instanceof Error ? e.message : String(e);} if (!error) throw Error("NEGATIVE_INTEGRATION_ACCEPTED:" + id); return {id, condition, blocked: true, error};});
  if (original !== digest([envelope, receipt, request.graph])) throw Error("NEGATIVE_AUDIT_MUTATED_ORIGINAL");
  return {engineId: entry.engineId, fixtureId: request.graph.context.fixtureId, candidate: envelope.identity.globalId, positiveEnvelopeValidation: (() => {validateEnvelope(envelope, envelope, receipt); return true;})(), results, originalUnchanged: true};
}
