import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualAprilRelations } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-april-relation/adapter";
import { evaluateApril, validateAprilCandidate, prepareAprilContext, validateRelationWitness, APRIL_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-april-relation/contract";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import { ActualBindingIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import { bindKnowledgeCandidate } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/engine";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge, CatalogConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { SemanticInputs, SemanticConfig, SemanticDomainDecision } from "@/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-verification/types";
import type { VerificationConfig, VerificationReceipt } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
import type { KnowledgeBindingRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
import type { ActualCalculationRun } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-specialist-claim-contract/contract";
const json = <T,>(f: string): T => JSON.parse(readFileSync(f, "utf8"));
const cr = "docs/validation/v4-knowledge-unified-catalog-01", sr = "docs/validation/v4-knowledge-source-verification-01", sd = "docs/validation/v4-knowledge-semantic-domain-verification-01";
const cc = json<CatalogConfig>(cr + "/compiler-config.json"), sv = json<VerificationConfig>(sr + "/verification-config.json"), config = json<SemanticConfig>(sd + "/verification-config.json");
const records = [...new Set(json<{shard:string}[]>(cr + "/knowledge-catalog.json").map(r => r.shard))].flatMap(f => json<KnowledgeCatalogRecord[]>(cr + "/" + f));
const edges = json<{shard:string}[]>(cr + "/knowledge-edges.json").flatMap(r => json<KnowledgeReferenceEdge[]>(cr + "/" + r.shard));
const frozen = new Map(Object.entries(json<Record<string,string>>("docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json")));
const receipts = json<VerificationReceipt[]>(sr + "/source-verification-receipts.json"), unresolved = json<KnowledgeReferenceEdge[]>(cr + "/unresolved-references.json");
const materialFile="src/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/conditionalTemporalReviewMaterial.ts";
frozen.set(materialFile,hash(readFileSync(materialFile)));
const reader = new SourceReader(process.cwd(), async f => import(/* @vite-ignore */pathToFileURL(f).href), [...cc.knownSourceVersions, sv.baseSha, config.baseSha]);
const native = new SourceVerificationEngine(reader, records, edges, sv, cc, frozen);
const resolver = new TemporalTenGodSourceResolver(reader, records, frozen, native, unresolved);
const input: SemanticInputs = { records, edges, sourceReceipts: receipts, domainQueue:json(sr+"/domain-review-queue.json"), sourceGroups:json(sr+"/source-group-review.json"), directReviews:json(sd+"/direct-meaning-reviews.json"), config, frozen };
const decisions = json<SemanticDomainDecision[]>(sd+"/semantic-domain-decisions.json");
const catalog = new KnowledgeBinderCatalog(reader,input,{ records,sourceReceipts:receipts,decisions,policyRules:config.rules,staticAncestry:json(sd+"/ancestor-domain-audit.json"),readFile:f=>readFileSync(f,"utf8"),frozen },decisions);

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualAprilRelations>>, { ok: true }>;
let result: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, { resolver, foundation }); if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualAprilRelations(f.request, f, { resolver, foundation }); if (!r.ok) throw Error(r.reasons.join()); result = r;
  if (r.withheld.length) throw Error(JSON.stringify(r.withheld));
}, 240000);
const candidate = () => result.handoff.aprilCandidates[0];
it("binds every original April segment and every original relation with exact identity", async () => {
  const c = candidate(); expect(c).toBeDefined(); expect(c.originalResearchId).toBe(APRIL_CONTRACT.originalId); expect(c.originalSourceProof.actualHash).toBe(APRIL_CONTRACT.recordSha256);
  expect(c.segmentResults).toHaveLength(2); expect(c.typedBindings).toHaveLength(2); expect(c.relationWitnesses).toHaveLength(7);
  for (const s of c.segmentResults) {
    expect(s.witnesses.map(w => w.originalRelationEvidenceId)).toEqual(s.originalSegment.relationFacts.map(f => f.id));
    expect(s.binding!.typedNativeReceipt.selectedActualEvidence).toHaveLength(3 + s.witnesses.length);
    expect(s.binding!.witnessIds).toEqual(s.witnesses.map(w => w.witnessId));
    for (const w of s.witnesses) {
      expect(w.verificationState).toBe("VERIFIED"); expect(w.withholdReasons).toEqual([]); expect(w.completeAncestry.complete).toBe(true);
      expect(w.effectiveInterval.start).toBe(s.originalSegment.startKst); expect(w.effectiveInterval.endExclusive).toBe(s.originalSegment.endKstExclusive);
      expect(w.requiredParentNodes.map(n => n.id).sort()).toEqual([...w.completeAncestry.parentIds].sort());
      expect(w.completeAncestry.rootIds).toContain(w.originalFactRoot); expect(w.originalFactIdentity.rootId).toBe(w.originalFactRoot);
      expect(w.actualParticipants.every(p => p.owner === w.owner.fixtureOwnerId)).toBe(true);
      if (w.originalRelationFact.source === "month_natal_branch") expect(w.originalAffectedPillars).toEqual(w.originalRelationFact.affectedPillars);
      expect((await validateRelationWitness(result.context!, structuredClone(w)))).toMatchObject({ ok: true, eligibleForTechnicalBinding: true });
    }
  }
  expect(c.relationWitnesses.some(w => w.requiredParentNodes.some(p => p.status === "PARTIAL" && p.fact.addressability === "PRODUCER_OBSERVATION_ONLY"))).toBe(true);
  expect((await validateAprilCandidate(result.context!, structuredClone(c))).ok).toBe(true);
}, 120000);
it("keeps original source conditions, roots, Native Receipt and all twelve gates intact", () => {
  const c = candidate();
  expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(c.originalNativeReceipt)); expect(c.originalNativeReceipt.selectedActualEvidence).toEqual([]);
  for (const b of c.typedBindings) {
    for (const key of ["unresolvedConditions", "sourceGroups", "requiredContext", "products", "relationships", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity", "requiredUserState"] as const) expect(b.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
    expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12); expect(b.typedNativeReceipt.temporalWitnesses.every(w => w.start === b.effectiveInterval.start && w.endExclusive === b.effectiveInterval.endExclusive)).toBe(true);
    expect(b.typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")?.state).toBe("PASS");
    expect(b.typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")?.state).toBe("REVIEW_REQUIRED");
  }
  expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull(); expect(c.verifiedActualUnitIds).toEqual([]); expect(c.newFactRoots).toBe(0); expect(c.independentFactsAdded).toBe(0);
});
it("a combined request cannot borrow relations from non-overlapping April segments", () => {
  const c = candidate(), typed = structuredClone(c.originalCandidate), ws = c.segmentResults.map(s => s.witnesses[0]);
  ws.forEach((w, i) => typed.requirement.sourceRequirements.push({ id: "negative-cross-segment-" + i, originalField: "/requires/2", originalDeclaration: c.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", temporalScope: "month", evidenceId: w.originalRelationEvidenceId, fields: [{ path: "value.type", equals: w.relationType }] }, required: true, gaps: [] }));
  typed.requirement.requiredOwner = ["person"];
  const index = new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: ws.map(w => w.originalGraphNodeId) }, catalog), receipt = bindKnowledgeCandidate(typed, index, catalog);
  expect(receipt.selectedActualEvidence).toHaveLength(2); expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
it.each(["fixture", "owner", "position", "affected-pillars", "participant", "relation-type", "evidence-id", "other-segment", "source-hash", "producer-version", "effective-annual", "conditional-dayun", "unknown-hour", "unsupported-composite", "two-member-samhap", "parent-missing", "root-forged", "root-count", "relation-omitted", "source-group", "counterexample", "prohibition", "native-receipt", "gate-pass", "meaning-claim", "customer-approval"])("rejects forged April binding: %s", async variant => {
  const c = structuredClone(candidate()), w = c.relationWitnesses.find(w => w.relationSource === "month_natal_branch")!;
  if (variant === "fixture") w.fixtureId = "foreign";
  if (variant === "owner") w.owner.fixtureOwnerId = "foreign";
  if (variant === "position") w.actualParticipants[1].position = "foreign-position";
  if (variant === "affected-pillars") w.originalAffectedPillars = [];
  if (variant === "participant") w.actualParticipants[0].value = "forged";
  if (variant === "relation-type") w.relationType = w.relationType === "충" ? "육합" : "충";
  if (variant === "evidence-id") w.originalRelationEvidenceId = "forged";
  if (variant === "other-segment") w.originalMonthSegment.pointer = c.segmentResults[1].segmentPointer;
  if (variant === "source-hash") c.originalSourceProof.actualHash = "forged";
  if (variant === "producer-version") w.originalProducer.version = "forged";
  if (variant === "effective-annual") w.originalMonthSegment.effectiveAnnualPillar.branch = "子";
  if (variant === "conditional-dayun") Object.assign(w, { calculationCertainty: "conditional", verificationState: "VERIFIED" });
  if (variant === "unknown-hour") w.actualParticipants.push({ owner: w.owner.fixtureOwnerId, position: "hour", slot: "natal_branch", value: "invented" });
  if (variant === "unsupported-composite") Object.assign(w, { relationScope: "natal_dayun_saeun_wolun", relationType: "합화" });
  if (variant === "two-member-samhap") { Object.assign(w, { relationType: "삼합" }); w.actualParticipants = w.actualParticipants.slice(0, 2); }
  if (variant === "parent-missing") w.requiredParentNodes.pop();
  if (variant === "root-forged") w.completeAncestry.rootIds.push("invented-root");
  if (variant === "root-count") Object.assign(w, { independentInformationAdded: 1, newFactRoots: 1 });
  if (variant === "relation-omitted") { c.relationWitnesses.pop(); c.typedBindings[0].witnessIds.pop(); }
  if (variant === "source-group") Reflect.deleteProperty(c.typedBindings[0].typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedBindings[0].typedCandidate.requirement.counterexamples = [];
  if (variant === "prohibition") c.typedBindings[0].typedCandidate.requirement.prohibitions = [];
  if (variant === "native-receipt") c.originalNativeReceipt.selectedActualEvidence.push("forged");
  if (variant === "gate-pass") c.typedBindings[0].typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")!.state = "PASS";
  if (variant === "meaning-claim") Object.assign(c, { originalMeaningIdentity: "invented", originalClaimIdentity: "invented" });
  if (variant === "customer-approval") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  expect((await validateAprilCandidate(result.context!, c)).ok).toBe(false);
}, 120000);
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never authorizes %s", async usage => {
  expect((await validateAprilCandidate(result.context!, candidate(), usage)).ok).toBe(false);
});
it("recomputes the exact original evidence and refuses cloned contexts and changed Source proof", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native]);
  expect(await evaluateApril(result.context!)).toMatchObject({ ok: true, candidate: candidate() });
  expect((await evaluateApril(structuredClone(result.context!))).ok).toBe(false);
  const original = resolver.proof.bind(resolver); resolver.proof = async (...args) => ({ ...await original(...args), actualHash: "forged" });
  try { expect((await evaluateApril(result.context!)).ok).toBe(false); } finally { resolver.proof = original; }
  expect(actualSemanticDigest([facts.request, facts.handoff, facts.native])).toBe(before);
}, 120000);
it("rejects a tampered actual Graph before constructing a trusted April context", async () => {
  const request = structuredClone(facts.request); request.graph.context.owners.person = "foreign";
  expect((await prepareAprilContext(request, facts, { resolver, foundation })).ok).toBe(false);
}, 120000);
it("preserves all actual F relations but withholds the month when even one segment is incomplete", async () => {
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "F" }, { resolver, foundation }); if (!f.ok) throw Error(f.reasons.join());
  const r = await adaptAnnualAprilRelations(f.request, f, { resolver, foundation }); if (!r.ok) throw Error(r.reasons.join());
  expect(r.handoff.aprilCandidates).toHaveLength(0); expect(r.observation!.segmentResults).toHaveLength(2); expect(r.observation!.relationWitnesses).toHaveLength(7);
  expect(r.observation!.typedBindings).toHaveLength(1); expect(r.withheld).toHaveLength(1);
  const held = r.observation!.relationWitnesses.filter(w => w.verificationState === "WITHHELD"); expect(held).toHaveLength(2);
  for (const w of held) {
    expect(w.withholdReasons).toContain("UNKNOWN_BIRTH_TIME_ELEMENT_LIMIT");
    expect(await validateRelationWitness(r.context!, structuredClone(w))).toMatchObject({ ok: true, verificationState: "WITHHELD", eligibleForTechnicalBinding: false });
    const forged = structuredClone(w); forged.verificationState = "VERIFIED";
    expect((await validateRelationWitness(r.context!, forged)).ok).toBe(false);
  }
}, 240000);
