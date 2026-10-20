import { beforeAll, expect, it, vi } from "vitest";
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

import { prepareInterpretationReview, generateInterpretationReview } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-interpretation-review-pilot/contract";
import { prepareEditorialRevision, generateEditorialRevision, validateEditorialRevision } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-editorial-quality-review/contract";
import { renderEditorialRevisions, validateEditorialHtml } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-editorial-quality-review/adapter";
type Original = Extract<Awaited<ReturnType<typeof prepareInterpretationReview>>, { ok: true }>;
type Revised = Extract<ReturnType<typeof prepareEditorialRevision>, { ok: true }>;
let original: Original, result: Revised, unknown: Revised;
beforeAll(async () => {
 await catalog.prepare(); const foundation = await ProductSpecialistFoundation.prepare(catalog), services = { resolver, foundation };
 for (const id of ["A", "F"]) {
  const facts = await runActualCalculationFixture(process.cwd(), { product: "annual", id }, services); if (!facts.ok) throw Error(facts.reasons.join());
  const run = await prepareInterpretationReview(facts.request, facts, services); if (!run.ok) throw Error(run.reasons.join());
  const revision = prepareEditorialRevision(run.context); if (!revision.ok) throw Error(revision.reasons.join());
  if(id === "A") { original = run; result = revision; } else unknown = revision;
 }
}, 480000);
function change(path: string, value: unknown) {
 const d = structuredClone(result.draft), parts = path.split("."); let target = d as unknown as Record<string, unknown>;
 for(const p of parts.slice(0,-1)) target = target[p] as Record<string, unknown>; target[parts.at(-1)!] = value;
 const { draftHash: _old, ...body } = d; void _old; d.draftHash = actualSemanticDigest(body); return d;
}
it("revises authentic A paragraphs with producer-read March and September values first", () => {
 expect(result.draft.cases).toHaveLength(2);
 for(const c of result.draft.cases) {
  expect(c.paragraphs).toHaveLength(5); expect(c.originalCase.paragraphs).toHaveLength(8);
  const w = c.originalCase.comparisonWitnesses.find(w=>w.comparisonType === "WITHIN_MONTH")!;
  const text = c.paragraphs[0].text;
  expect(text).toContain(w.afterInterval.start!.replace("T", " ").replace("+09:00", " KST"));
  expect(text).toContain(w.beforeSignature!.monthPillar.stem+w.beforeSignature!.monthPillar.branch);
  expect(text).toContain(w.afterSignature!.monthPillar.stem+w.afterSignature!.monthPillar.branch);
  expect(text).toContain(c.month === 3 ? "1일에 바뀌지 않습니다" : "8월 말과 같은");
  expect(c.paragraphs.some(p=>c.originalCase.paragraphs.some(o=>o.text===p.text))).toBe(false);
 }
});
it("covers every original sentence including withheld attempts without deleting or changing originals", () => {
 expect(result.draft.originalDraft).toEqual(generateInterpretationReview(original.context));
 for(const c of result.draft.cases) {
  for(const old of c.originalCase.sentences) expect(c.rows.some(r=>r.originalSentenceIds.includes(old.draftSentenceId))).toBe(true);
  for(const row of c.rows) expect(row.originalText).toEqual(row.originalSentenceIds.map(id=>c.originalCase.sentences.find(s=>s.draftSentenceId===id)!.sentenceText));
 }
});
it("retains three exact non-overlapping windows and their complete original provenance on merged rows", () => {
 for(const c of result.draft.cases) {
  const periods = c.paragraphs.find(p=>p.function === "EXACT_PERIODS")!; expect(periods.sentenceIds).toHaveLength(3);
  for(const row of c.rows) {
   const olds = row.originalSentenceIds.map(id=>c.originalCase.sentences.find(s=>s.draftSentenceId===id)!);
   expect(row.actualEvidenceNodeIds).toEqual([...new Set(olds.flatMap(s=>s.actualEvidenceNodeIds))]);
   expect(row.originalFactRoots).toEqual([...new Set(olds.flatMap(s=>s.originalFactRoots))].sort());
   const expected=[...new Map(olds.flatMap(s=>s.exactTemporalWindows).map(w=>[actualSemanticDigest(w),w])).values()]; expect(row.exactTemporalWindows).toEqual(expected);
   const ids=new Set(row.completeAncestry.map(n=>n.nodeId)); expect(row.completeAncestry.every(n=>n.parentIds.every(id=>ids.has(id)))).toBe(true);
   expect(row.periodSemantics).toBe("NON_SIMULTANEOUS_COMPARISON");
  }
 }
});
it("keeps original Source identity, conditions, counterexamples and prohibitions on every revision", () => {
 for(const c of result.draft.cases)for(const row of c.rows) {
  const old = c.originalCase.sentences.find(s=>s.draftSentenceId===row.originalSentenceIds[0])!;
  expect(row.sourceIdentity).toEqual(old.sourceProof); expect(row.requiredContext).toEqual(old.requiredContext);
  expect(row.counterexamples).toEqual(old.counterexamples); expect(row.prohibitedInferences).toEqual(old.prohibitedInferences);
  expect(row.revisedMeaningReviewState).toBe(row.originalMeaningReviewState); expect(row.originalMeaningIdentity).toBeNull();expect(row.originalClaimIdentity).toBeNull();
 }
});
it("reduces duplicate questions to one conditional question without inventing personal circumstances", () => {
 for(const c of result.draft.cases) {
  const q = c.rows.find(r=>r.diagnostic === "CONDITIONAL_QUESTION_REPETITION")!;
  expect(q.originalSentenceIds).toHaveLength(2); expect(q.revisedText).toContain("있다면"); expect(q.revisedText).toContain("볼까요?");
  expect(q.revisedText).toContain(c.month === 3 ? "학습 목표" : "작업 순서");
  expect(c.paragraphs.at(-1)!.text).toContain("적용할지는 보류"); expect(q.directMeaningSourceVerified).toBe(false);
 }
});
it("preserves correct counterexamples and exact relation targets in readable evidence detail", () => {
 for(const c of result.draft.cases) {
  for(const old of c.originalCase.sentences.filter(s=>s.sentenceFunction === "RELATION" || s.sentenceFunction === "BOUNDARY" || s.sentenceFunction === "COUNTEREXAMPLE")) {
   expect(c.rows.some(r=>r.disposition === "UNCHANGED" && r.originalSentenceIds[0] === old.draftSentenceId && r.revisedText === old.sentenceText)).toBe(true);
  }
 }
});
it("keeps F unknown/withheld cases empty and never creates a revision from a copied context", () => {
 for(const c of unknown.draft.cases) { expect(c.originalCase.technicalState).toBe("TECHNICALLY_WITHHELD"); expect(c.rows).toEqual([]); expect(c.paragraphs).toEqual([]);expect(c.humanDecisions).toEqual([]);expect(c.quality.calculationAccuracy).toBe("WITHHELD_REQUIRED_EVIDENCE"); }
 expect(prepareEditorialRevision(structuredClone(original.context))).toMatchObject({ok:false});
 expect(validateEditorialRevision(structuredClone(result.context),result.draft).ok).toBe(false);
 expect(validateEditorialRevision(unknown.context,result.draft).ok).toBe(false);
});
it("creates only unselected human decisions and keeps subjective quality awaiting human review", () => {
 for(const c of result.draft.cases) {
  expect(c.humanDecisions).toHaveLength(5);
  for(const h of c.humanDecisions) expect(h).toMatchObject({selected:"UNSELECTED",reviewer:null,humanReviewCompleted:false,meaningApproved:false,productApproved:false,customerApproved:false,officialApprovalEnvelope:null});
  expect(c.quality.koreanReadability).toBe("HUMAN_REVIEW_REQUIRED");expect(c.quality.repetition).toBe("HUMAN_REVIEW_REQUIRED");
 }
 expect(result.draft).toMatchObject({humanReviewCompleted:false,humanQualityApproved:false,meaningApproved:false,productApproved:false,customerApproved:false,customerClaims:0,customerReaderBridges:0,customerBookAllocations:0,plannerAllocations:0,newFactRoots:0,newUnverifiedMeanings:0,customerReady:false});
 for(const usage of ["CUSTOMER_PUBLICATION","PLANNER_ASSIGNMENT","OFFICIAL_APPROVAL"] as const) expect(validateEditorialRevision(result.context,result.draft,usage).ok).toBe(false);
});
it.each([
 ["changed fact", "cases.0.rows.0.revisedText", "월주는 1일에 바뀝니다."],
 ["changed node", "cases.0.rows.0.actualEvidenceNodeIds", ["fake"]], ["changed owner", "cases.0.rows.0.owner", "other"],
 ["changed root", "cases.0.rows.0.originalFactRoots", ["new-root"]], ["incomplete ancestry", "cases.0.rows.0.completeAncestry", []],
 ["changed window", "cases.0.rows.0.exactTemporalWindows.0.temporal.start", "2026-01-01T00:00:00+09:00"],
 ["concurrent periods", "cases.0.rows.0.periodSemantics", "SIMULTANEOUS"], ["source widened", "cases.0.rows.0.sourceIdentity.actualHash", "other"],
 ["conditions removed", "cases.0.rows.0.requiredContext", []], ["counterexample removed", "cases.0.rows.0.counterexamples", []], ["prohibition removed", "cases.0.rows.0.prohibitedInferences", []],
 ["new meaning", "cases.0.rows.0.originalMeaningIdentity", "meaning"], ["new claim", "cases.0.rows.0.originalClaimIdentity", "claim"],
 ["guaranteed effect", "cases.0.rows.0.directMeaningSourceVerified", true], ["source rewritten", "originalDraft.research.0.original.action", "수입 보장"],
 ["approved meaning", "meaningApproved", true], ["human approval fabricated", "humanQualityApproved", true], ["customer approved", "customerApproved", true],
 ["customer claim", "customerClaims", 1], ["reader bridge", "customerReaderBridges", 1], ["book allocation", "customerBookAllocations", 1], ["planner allocation", "plannerAllocations", 1],
 ["human selected", "cases.0.humanDecisions.0.selected", "KEEP"], ["reviewer invented", "cases.0.humanDecisions.0.reviewer", "AI"],
 ["approval envelope", "cases.0.humanDecisions.0.officialApprovalEnvelope", {approved:true}], ["subjective automatic PASS", "cases.0.quality.koreanReadability", "PASS"],
 ["new future event", "cases.0.rows.0.revisedText", "9월에는 수입이 늘어납니다."], ["past experience invented", "cases.0.rows.0.revisedText", "두 과제를 이미 끝냈습니다."],
 ["unknown hour invented", "cases.0.rows.0.revisedText", "미상 시주를 채웠습니다."], ["unverified meaning", "newUnverifiedMeanings", 1], ["new fact root", "newFactRoots", 1],
])("rejects %s even when the caller rehashes the output", (_name,path,value) => {
 const forged=change(path as string,value); expect(validateEditorialRevision(result.context,forged).ok).toBe(false);
 expect(()=>renderEditorialRevisions([{context:result.context,draft:forged}])).toThrow();
});
it("renders exact original/revised text, provenance hashes and withheld cases without controls or scripts", () => {
 const html=renderEditorialRevisions([result,unknown]); expect(validateEditorialHtml([result.context,unknown.context],html).ok).toBe(true);
 for(const c of result.draft.cases)for(const r of c.rows.filter(r=>r.placement!=="LEDGER_ONLY")) {expect(html).toContain(r.revisedSentenceId);expect(html).toContain(r.revisedTextHash!);}
 expect(html).toContain("기존 원고");expect(html).toContain("수정 원고");expect(html).toContain("UNSELECTED");expect(html).toContain("TECHNICALLY_WITHHELD");
 expect(html).not.toMatch(/<script|<iframe|<input|<button|fetch\(|https?:\/\//);
 expect(validateEditorialHtml([result.context,unknown.context],html+" ").ok).toBe(false);
});
it("does not export private fixture names/birth dates or unsupported event attempts into manuscript", () => {
 const html=renderEditorialRevisions([result,unknown]);
 for(const c of result.draft.cases)for(const s of c.originalCase.sentences.filter(s=>s.attemptedInference)) expect(html).not.toContain(s.attemptedInference);
 const locks=json<{payload:{person?:{name?:string;birthDate?:string};personA?:{name?:string;birthDate?:string};personB?:{name?:string;birthDate?:string}}}[]>("tests/fixtures/six-product-integration-01/source-locks.json");
 const text=html+JSON.stringify(result.draft); for(const f of locks)for(const p of [f.payload.person,f.payload.personA,f.payload.personB])if(p)for(const v of [p.name,p.birthDate])if(v)expect(text).not.toContain(v);
});
it("rehashes original Source on every read without writing source files", () => {
 const text=reader.text.bind(reader),spy=vi.spyOn(reader,"text").mockImplementation(f=>f.endsWith("monthMatrix.ts")?text(f)+" ":text(f));
 try { expect(()=>generateEditorialRevision(result.context)).toThrow("REVIEW_SOURCE_HASH_MISMATCH"); } finally {spy.mockRestore();}
 expect(validateEditorialRevision(result.context,result.draft).ok).toBe(true);
});

it("avoids fixed particles after dynamic Hanja and ten-god labels", () => {
 for(const c of result.draft.cases)for(const row of c.rows.filter(r=>r.placement === "MANUSCRIPT")) {
  expect(row.revisedText).not.toMatch(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]’(?:가|로|을)/);
  if(row.diagnostic === "ROLE_SEPARATION")expect(row.revisedText).toContain("’입니다.");
 }
});
