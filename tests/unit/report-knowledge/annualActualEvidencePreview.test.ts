import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge, CatalogConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { SemanticInputs, SemanticConfig, SemanticDomainDecision } from "@/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-verification/types";
import type { VerificationConfig, VerificationReceipt } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
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

import { prepareFactualPreview, generateFactualPreview, validateFactualPreview, type FactualPreview } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-actual-evidence-preview/contract";
import { renderFactualPreviews, validateFactualPreviewHtml } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-actual-evidence-preview/adapter";
type Run = Extract<Awaited<ReturnType<typeof prepareFactualPreview>>, { ok: true }>;
let result: Run, unknown: Run;
beforeAll(async () => {
  await catalog.prepare(); const foundation = await ProductSpecialistFoundation.prepare(catalog);
  const services = { resolver, foundation };
  for (const id of ["A", "F"]) {
    const facts = await runActualCalculationFixture(process.cwd(), { product: "annual", id }, services); if (!facts.ok) throw Error(facts.reasons.join());
    const before = actualSemanticDigest(facts.request), run = await prepareFactualPreview(facts.request, facts, services);
    if (!run.ok) throw Error(run.reasons.join()); expect(actualSemanticDigest(facts.request)).toBe(before);
    if (id === "A") result = run; else unknown = run;
  }
}, 480000);
function change(value: FactualPreview, path: string, replacement: unknown) { const parts = path.split("."); let target = value as unknown as Record<string, unknown>; for (const p of parts.slice(0, -1)) target = target[p] as Record<string, unknown>; target[parts.at(-1)!] = replacement; return value; }
it("generates twelve populated actual months and authentic Korean facts, without customer claims", () => {
  const p = result.preview; expect(p.months.map(m => m.month)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
  expect(p.sentences.length).toBeGreaterThan(120); expect(p.months.every(m => m.paragraphs.length >= 2)).toBe(true);
  expect(p.sentences.every(s => s.originalGraphNodeIds.length && s.completeAncestry.length && s.textHash === actualSemanticDigest(s.text))).toBe(true);
  expect(p.sentences.some(s => s.function === "PILLAR" && s.text.includes("월주") && s.text.includes("실효 연주"))).toBe(true);
  expect(p.sentences.some(s => s.function === "BOUNDARY" && s.text.includes("절입"))).toBe(true);
  expect(p.sentences.some(s => s.function === "RELATION")).toBe(true);
  expect(p).toMatchObject({ newFactRoots:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,customerPlannerAllocations:0,customerEdition:false,wholeBookCompleted:false,customerReady:false,meaningApproved:false });
});
it("keeps June and November original applications withheld and separates role facts", () => {
  expect(result.preview.verifiedMonthContracts).toEqual([1,2,3,4,5,7,8,9,10,12]);
  expect(result.preview.months[5]).toMatchObject({ originalResearchApplication:"ROLE_SOURCE_DECISION_REQUIRED",technicalCandidateIds:[] });
  expect(result.preview.months[10]).toMatchObject({ originalResearchApplication:"ACTUAL_CONTEXT_TIMESTAMP_REQUIRED",technicalCandidateIds:[] });
  expect(result.preview.sentences.filter(s => s.function === "TEN_GOD_ROLE").every(s => s.text.includes("月") || s.text.includes("월간") && s.text.includes("월지 본기"))).toBe(true);
  for (const m of [6,11]) { const s=result.preview.sentences.find(s=>s.civilMonth===m&&s.function==="WITHHOLD")!; expect(s.sourceReviewWitness?.originalWitnessIds.length).toBeGreaterThan(0); expect(s.sourceReviewWitness?.sourceRecord.actualHash).toBe(s.sourceRecordIdentity.actualHash); expect(s.sourceReviewWitness?.contextTimestampSource).toBeNull(); }
  expect(result.preview.sentences.every(s => s.contextObservationTimestamp === null && s.meaningIdentity === null && s.claimIdentity === null && s.readerQuestionId === null && s.bookAllocation === null)).toBe(true);
});
it("preserves ancestry closure and deduplicates original roots without inventing independent facts", () => {
  const p = result.preview;
  expect(p.distinctOriginalRoots).toEqual([...new Set(p.sentences.flatMap(s => s.originalFactRoots))].sort());
  expect(p.repeatedRootReferences).toBe(p.sentences.reduce((n,s) => n+s.originalFactRoots.length,0)-p.distinctOriginalRoots.length);
  for (const s of p.sentences) { const ids = new Set(s.completeAncestry.map(n => n.nodeId)); expect(s.completeAncestry.every(n => n.parentIds.every(id => ids.has(id)))).toBe(true); }
});
it("keeps unknown birth-time and withheld calculation evidence visible", () => {
  expect(unknown.preview.sentences.some(s => s.text.includes("출생시간 미상"))).toBe(true);
  expect(unknown.preview.originalWithheldGraphNodes.length).toBeGreaterThan(0);
  expect(unknown.preview.sentences.every(s => !s.customerApproved)).toBe(true);
});
it("compares separate intervals and distinguishes representative focus from current activation", () => {
  expect(result.preview.sentences.filter(s => s.function === "COMPARISON").every(s => s.text.includes("서로 다른 기간") && s.originalGraphNodeIds.length === 8 && s.originalComparison?.comparisonApproved === false)).toBe(true);
  expect(result.preview.sentences.some(s => s.civilMonth === 10 && s.function === "READING_POSITION" && s.text.includes("현재 활성 여부는 별도"))).toBe(true);
});
it("renders the exact canonical HTML, sentence IDs and hashes without browser requests", () => {
  const html=renderFactualPreviews([result,unknown]); expect(validateFactualPreviewHtml([result.context,unknown.context],html)).toMatchObject({ok:true});
  expect((html.match(/data-sentence-id=/g)||[])).toHaveLength(result.preview.sentences.length+unknown.preview.sentences.length);
  expect(html).not.toMatch(/<script|<iframe|fetch\(|https?:\/\//); expect(validateFactualPreviewHtml([result.context,unknown.context],html.replace("월주", "재물운"))).toMatchObject({ok:false});
});
it("re-executes the bounded renderer deterministically and rejects cloned contexts or customer use", () => {
  expect(generateFactualPreview(result.context)).toEqual(generateFactualPreview(result.context));
  expect(validateFactualPreview(result.context,structuredClone(result.preview))).toMatchObject({ok:true});
  expect(validateFactualPreview(unknown.context,result.preview)).toMatchObject({ok:false});
  expect(validateFactualPreview(structuredClone(result.context),result.preview)).toMatchObject({ok:false});
  for(const usage of ["CUSTOMER_PUBLICATION","PLANNER_ASSIGNMENT"] as const) expect(validateFactualPreview(result.context,result.preview,usage)).toMatchObject({ok:false});
});
it.each([
  ["other fixture","fixtureId","fixture-annual-other"], ["other owner","sentences.0.owner","another-owner"],
  ["wrong segment","sentences.0.originalSegmentPointer","/other/segment"], ["wrong effective annual","sentences.1.text","실효 연주는 甲子입니다."],
  ["forged boundary","sentences.0.actualSegmentWindow.start","2026-01-06T00:00:00+09:00"],
  ["future focus current","sentences.0.function","READING_POSITION"], ["conditional dayun confirmed","sentences.0.calculationCertainty","conditional"],
  ["June role approved","months.5.originalResearchApplication","APPROVED"], ["November timestamp invented","sentences.0.contextObservationTimestamp","2026-11-01T00:00:00+09:00"],
  ["hypothetical history","sentences.0.text","지난달에 새 직장에 입사했습니다."], ["nonconcurrent facts","sentences.0.text","두 기간은 동시에 발생합니다."],
  ["double root count","newFactRoots",1], ["review witness forged","sentences.0.sourceReviewWitness",{state:"APPROVED"}], ["comparison witness forged","sentences.0.originalComparison",{comparisonApproved:true}], ["source hash mismatch","sentences.0.sourceRecordIdentity.actualHash","forged"],
  ["Graph node forged","sentences.0.originalGraphNodeIds",["invented-node"]], ["unsourced sentence","sentences.0.completeAncestry",[]],
  ["unauthorized meaning","sentences.0.meaningIdentity","meaning:invented"], ["synthetic promotion","sentences.0.claimIdentity","required-2"],
  ["fake reader question","sentences.0.readerQuestionId","reader:invented"], ["fake allocation","sentences.0.bookAllocation","P1/S1"],
  ["customer approval","sentences.0.customerApproved",true], ["Planner gate relaxed","customerPlannerAllocations",1],
  ["Writer gate bypass","customerClaims",1], ["private input text","sentences.0.text","이름과 출생일을 공개합니다"],
  ["duplicate roots","distinctOriginalRoots",["same-root","same-root"]]
])("rejects %s even with rehashed caller preview", (_label, path, replacement) => {
  const value=change(structuredClone(result.preview),path as string,replacement); const {previewHash:_old,...body}=value; void _old;
  value.previewHash=actualSemanticDigest(body); expect(validateFactualPreview(result.context,value)).toMatchObject({ok:false,customerUseAllowed:false});
  expect(()=>renderFactualPreviews([{context:result.context,preview:value}])).toThrow();
});
it("excludes raw person names and birth dates from generated HTML and Ledger", () => {
  const fixtures=json<{product:string;id:string;payload:{person:{name:string;birthDate:string}}}[]>("tests/fixtures/six-product-integration-01/source-locks.json");
  const output=JSON.stringify([result.preview,unknown.preview])+renderFactualPreviews([result,unknown]);
  for(const f of fixtures.filter(f=>f.product==="annual"&&["A","F"].includes(f.id))) for(const value of [f.payload.person.name,f.payload.person.birthDate]) if(value) expect(output).not.toContain(value);
});
