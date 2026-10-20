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

import { prepareInterpretationReview, generateInterpretationReview, validateInterpretationReview, type ReviewDraft } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-interpretation-review-pilot/contract";
import { renderInterpretationReviews, validateInterpretationReviewHtml } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-interpretation-review-pilot/adapter";
import { generateFactualPreview } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-actual-evidence-preview/contract";
type Run = Extract<Awaited<ReturnType<typeof prepareInterpretationReview>>, { ok: true }>;
let result: Run, unknown: Run;
beforeAll(async () => {
  await catalog.prepare(); const foundation = await ProductSpecialistFoundation.prepare(catalog), services = { resolver, foundation };
  for (const id of ["A", "F"]) {
    const facts = await runActualCalculationFixture(process.cwd(), { product: "annual", id }, services); if (!facts.ok) throw Error(facts.reasons.join());
    const before = actualSemanticDigest([facts.request,facts.handoff,facts.native]), run = await prepareInterpretationReview(facts.request,facts,services);
    if (!run.ok) throw Error(run.reasons.join()); expect(actualSemanticDigest([facts.request,facts.handoff,facts.native])).toBe(before);
    if (id === "A") result = run; else unknown = run;
  }
}, 480000);
function rehash(d: ReviewDraft) { const {draftHash:_old,...body}=d; void _old; d.draftHash=actualSemanticDigest(body); return d; }
function change(d: ReviewDraft,path:string,value:unknown) { const parts=path.split("."); let target=d as unknown as Record<string,unknown>; for(const p of parts.slice(0,-1))target=target[p] as Record<string,unknown>; target[parts.at(-1)!]=value; return rehash(d); }
it("re-executes real March/September contracts and produces readable review questions only for eligible A",()=>{
  expect(result.draft.cases.map(c=>[c.month,c.technicalState])).toEqual([[3,"TECHNICALLY_ELIGIBLE_FOR_REVIEW"],[9,"TECHNICALLY_ELIGIBLE_FOR_REVIEW"]]);
  for(const c of result.draft.cases) {
    expect(c.originalCandidateId).toMatch(/^annual-comparison-candidate:/);
    expect(c.paragraphs.map(p=>p.function)).toEqual(expect.arrayContaining(["A_ACTUAL_FACT_EXPLANATION","B_PERIOD_COMPARISON","B_INFERENCE_LIMIT","C_CONDITIONAL_QUESTIONS","D_COUNTEREXAMPLE_AND_LIMIT","E_MISSING_ACTUAL_CONTEXT"]));
    expect(c.sentences.filter(s=>s.sentenceFunction==="CONDITIONAL_QUESTION")).toHaveLength(2);
    expect(c.paragraphs.find(p=>p.function==="C_CONDITIONAL_QUESTIONS")!.text).toContain("있다면");
    expect(c.paragraphs.find(p=>p.function==="C_CONDITIONAL_QUESTIONS")!.text).toContain("확인해 볼까요?");
    expect(c.workbenchDecomposition).toMatchObject({actualUserFactsEstablished:0,futureEventsEstablished:0});
  }
});
it("preserves F unknown-input limitations and never drafts from withheld comparisons",()=>{
  expect(unknown.draft.cases.every(c=>c.technicalState==="TECHNICALLY_WITHHELD"&&c.sentences.length===0&&c.paragraphs.length===0&&c.originalBlockingReasons.length>0&&c.originalCandidateId===null)).toBe(true);
  expect(unknown.factual.preview.originalWithheldGraphNodes.length).toBeGreaterThan(0);
});
it("keeps original actions, positive/twist, requires, hypothetical scenes, counterexamples and prohibitions",()=>{
  for(const research of result.draft.research) {
    const c=result.draft.cases.find(c=>c.month===research.month)!;
    expect(research.proof.actualHash).toBe(research.month===3?"ec1daf02dd14578a4d6bd69fe8870144f81ebb0ad94ca1fd9de257ffe1fe9303":"81de9d7b2756401b029c4d8c2eabdabaffe097fc812ee86ec1a75125831aee82");
    expect(research.proof.locator.fileSha256).toBe("261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3");
    expect(research.original.scene).toMatchObject({hypothetical:true,isCustomerHistory:false}); expect(research.sourceReferences).toHaveLength(3);
    expect(c.sentences.every(s=>s.counterexamples[0]===research.original.counterexample&&actualSemanticDigest(s.prohibitedInferences)===actualSemanticDigest(research.original.disallowed))).toBe(true);
    expect(c.sentences.filter(s=>s.classification==="CONDITIONAL_INTERPRETATION_PROPOSAL").every(s=>s.requiredContext.length>0&&s.directSourceSupport.exactMeaning==="DIRECT_MEANING_SOURCE_UNVERIFIED"&&s.modelReviewState==="MODEL_PROPOSED_REVIEW")).toBe(true);
  }
});
it("anchors every displayed fact to original factual text, nodes, intervals, producers and complete ancestry",()=>{
  const facts=result.factual.preview.sentences;
  for(const s of result.draft.cases.flatMap(c=>c.sentences)) {
    expect(s.actualEvidenceNodeIds.length).toBeGreaterThan(0); expect(s.originalComparisonWitnessIds.length).toBeGreaterThan(0);
    const ids=new Set(s.completeAncestry.map(n=>n.nodeId)); expect(s.completeAncestry.every(n=>n.parentIds.every(p=>ids.has(p)))).toBe(true);
    expect(s.originalFactRoots).toEqual([...new Set(s.completeAncestry.flatMap(n=>n.rootIds))].sort());
    if(s.classification==="CALCULATED_FACT_EXPLANATION"&&s.originalFactualSentenceId) { const original=facts.find(f=>f.sentenceId===s.originalFactualSentenceId)!; expect(original.text).toBe(s.sentenceText); expect(original.completeAncestry).toEqual(s.completeAncestry); expect(s.modelReviewState).toBeNull(); }
  }
});
it("separates unsupported attempts from rendered manuscript and never issues meaning or publication authority",()=>{
  const html=renderInterpretationReviews([result,unknown]);
  for(const s of result.draft.cases.flatMap(c=>c.sentences).filter(s=>s.classification==="WITHHELD_UNSUPPORTED_INFERENCE")) { expect(s.sentenceText).toBeNull(); expect(s.withholdReasons.length).toBeGreaterThan(0); expect(html).not.toContain(s.attemptedInference); }
  expect(result.draft).toMatchObject({customerClaims:0,customerApprovals:0,customerReaderBridges:0,customerBookAllocations:0,newFactRoots:0,independentMeaningsAdded:0,humanReviewCompleted:false,meaningApproved:false,productApproved:false,customerApproved:false,customerEdition:false,wholeBookCompleted:false,customerReady:false});
  expect(result.draft.cases.flatMap(c=>c.sentences).every(s=>s.reviewer===null&&s.officialApprovalEnvelope===null&&s.meaningIdentity===null&&s.claimIdentity===null&&s.plannerAssignment===null&&s.readerQuestionId===null&&s.bookAllocation===null)).toBe(true);
});
it("renders all authentic prose with exact hashes, no scripts/network and visibly separate research/proposal states",()=>{
  const html=renderInterpretationReviews([result,unknown]); expect(validateInterpretationReviewHtml([result.context,unknown.context],html).ok).toBe(true);
  const rows=result.draft.cases.flatMap(c=>c.sentences).filter(s=>s.sentenceText!==null);
  expect((html.match(/data-draft-sentence-id=/g)||[]).length).toBe(rows.length);
  expect(html).toContain("이번 작업에서 작성한 조건부 질문"); expect(html).toContain("원본 연구가 제안한 방향"); expect(html).toContain("TECHNICALLY_WITHHELD");
  expect(html).not.toMatch(/<script|<iframe|fetch\(|https?:\/\//);
  expect(validateInterpretationReviewHtml([result.context,unknown.context],html.replace("조건부 질문","승인된 예언")).ok).toBe(false);
});
it("preserves the entire original twelve-month preview and its committed HTML/Ledger bytes",()=>{
  expect(generateFactualPreview(result.factual.context)).toEqual(result.factual.preview); expect(result.factual.preview.months.length).toBe(12);
  expect(hash(readFileSync("docs/validation/v4-annual-actual-evidence-korean-vertical-slice-01/twelve-month-factual-preview.html"))).toBe("d099ee0fbf00aebdd6a92c7e9e857b1215f59f55c1a88ecb20da6b871c5168f5");
  expect(hash(readFileSync("docs/validation/v4-annual-actual-evidence-korean-vertical-slice-01/actual-evidence-to-sentence-ledger.json"))).toBe("7b3525535cd959e0a995a9720d7f4cfedee374b4411461da98c9529ec7f1935b");
});
it("requires an opaque authentic session and directly rejects customer/Planner handoff",()=>{
  expect(generateInterpretationReview(result.context)).toEqual(generateInterpretationReview(result.context));
  expect(validateInterpretationReview(structuredClone(result.context),result.draft).ok).toBe(false); expect(validateInterpretationReview(unknown.context,result.draft).ok).toBe(false);
  for(const usage of ["CUSTOMER_PUBLICATION","PLANNER_ASSIGNMENT"] as const) expect(validateInterpretationReview(result.context,result.draft,usage)).toMatchObject({ok:false,customerUseAllowed:false,approvalsIssued:0});
});
it.each([
 ["nonexistent fact","cases.0.sentences.0.actualEvidenceNodeIds",["invented-node"]], ["other fixture","fixtureId","fixture-annual-other"], ["other owner","cases.0.sentences.0.owner","other-owner"],
 ["other segment","cases.0.sentences.0.exactTemporalWindows.0.temporal.start","2026-02-01T00:00:00+09:00"], ["concurrent periods","cases.0.sentences.0.periodSemantics","SIMULTANEOUS"],
 ["root creates meaning","independentMeaningsAdded",1], ["automatic stem role","cases.0.sentences.0.monthlyTenGodRole","MONTH_STEM"], ["conditional dayun confirmed","cases.0.sentences.0.sentenceText","두 대운이 동시에 확정 활성입니다."],
 ["unknown hour filled","cases.0.sentences.0.sentenceText","미상 시주를 임의로 채웠습니다."], ["future context invented","cases.0.sentences.0.requiredContext",[]],
 ["scene becomes experience","cases.0.sentences.0.sentenceText","연구의 장면을 이미 겪었습니다."], ["modern advice called traditional","cases.0.sentences.0.directSourceSupport.traditionalOrEmpiricalEffectProven",true],
 ["Source becomes Meaning approval","meaningApproved",true], ["unearned income prediction","cases.0.sentences.0.sentenceText","이번 달 수입이 늘어납니다."],
 ["condition removed","cases.0.sentences.0.requiredContext",[]], ["counterexample removed","cases.0.sentences.0.counterexamples",[]], ["prohibition removed","cases.0.sentences.0.prohibitedInferences",[]],
 ["source hash forged","cases.0.sentences.0.originalRecordHash","forged"], ["new Meaning","cases.0.sentences.0.meaningIdentity","new-meaning"], ["new Claim","cases.0.sentences.0.claimIdentity","new-claim"],
 ["fake reviewer","cases.0.sentences.0.reviewer","invented-reviewer"], ["fake approval envelope","cases.0.sentences.0.officialApprovalEnvelope",{approved:true}], ["Planner selection","cases.0.sentences.0.plannerAssignment","selected"],
 ["fake Reader address","cases.0.sentences.0.readerQuestionId","P1/S1"], ["new allocation","cases.0.sentences.0.bookAllocation","P1/S1"], ["Writer gate relaxed","customerClaims",1], ["Strict policy changed","policy","RELAXED"],
 ["original requires removed","research.0.original.requires",[]], ["original action replaced","research.0.original.action","수입을 보장한다."], ["source limitations deleted","cases.0.sentences.0.sourceSupportLimitations",[]], ["proposal called calculated fact","cases.0.sentences.0.classification","CONDITIONAL_INTERPRETATION_PROPOSAL"], ["human review fabricated","humanReviewCompleted",true], ["research scene altered","research.0.original.scene.hypothetical",false], ["same roots duplicated","newFactRoots",1]
])("rejects %s even after caller rehashes the draft",(_label,path,value)=>{
 const d=change(structuredClone(result.draft),path as string,value); expect(validateInterpretationReview(result.context,d)).toMatchObject({ok:false,customerUseAllowed:false}); expect(()=>renderInterpretationReviews([{context:result.context,draft:d}])).toThrow();
});
it("withheld F cannot be relabeled eligible or receive a newly fabricated paragraph",()=>{
 const d=change(structuredClone(unknown.draft),"cases.0.technicalState","TECHNICALLY_ELIGIBLE_FOR_REVIEW"); expect(validateInterpretationReview(unknown.context,d).ok).toBe(false);
});
it("does not duplicate raw names or birth dates into review data or HTML",()=>{
 const locks=json<{payload:{person?:{name?:string;birthDate?:string};personA?:{name?:string;birthDate?:string};personB?:{name?:string;birthDate?:string}}}[]>("tests/fixtures/six-product-integration-01/source-locks.json");
 const text=JSON.stringify([result.draft,unknown.draft])+renderInterpretationReviews([result,unknown]);
 for(const f of locks)for(const p of [f.payload.person,f.payload.personA,f.payload.personB])if(p)for(const v of [p.name,p.birthDate])if(v)expect(text).not.toContain(v);
});

it("explains actual continuity and only verified Signature differences with exact original witnesses",()=>{
 for(const c of result.draft.cases)for(const s of c.sentences.filter(s=>s.sentenceFunction==="VERIFIED_SIGNATURE_RESULT")){
  const witness=c.comparisonWitnesses.find(w=>s.originalComparisonWitnessIds.includes(w.comparisonId))!;
  expect(witness.result).not.toBe("WITHHELD"); expect(s.originalComparisonWitnessIds).toHaveLength(1);
  expect(s.sentenceText).toContain(`${witness.sharedRootSet.length}개`);
  expect(s.actualEvidenceNodeIds).toEqual([...new Set([...witness.beforeGraphEvidence,...witness.afterGraphEvidence])]);
  expect(s.modelReviewState).toBeNull(); expect(s.directSourceSupport.actualCalculation).toBe("CALCULATED_FACT_VERIFIED");
  if(witness.result==="VERIFIED_SIGNATURE_DIFFERENCE")expect(s.sentenceText).toContain("실제로 달라진 항목");else expect(s.sentenceText).toContain("이어집니다");
 }
});
it("rejects actual other-fixture and same-owner other-segment substitutions",()=>{
 const d=structuredClone(result.draft),other=unknown.factual.preview.sentences.find(s=>s.function==="PILLAR")!;
 Object.assign(d.cases[0].sentences[0],{owner:other.owner,actualEvidenceNodeIds:other.originalGraphNodeIds,completeAncestry:other.completeAncestry});
 expect(validateInterpretationReview(result.context,rehash(d)).ok).toBe(false);
 const d2=structuredClone(result.draft),otherSegment=result.factual.preview.sentences.find(s=>s.civilMonth===12&&s.function==="PILLAR")!;
 Object.assign(d2.cases[0].sentences[0],{actualEvidenceNodeIds:otherSegment.originalGraphNodeIds,completeAncestry:otherSegment.completeAncestry});
 expect(validateInterpretationReview(result.context,rehash(d2)).ok).toBe(false);
});
it("rechecks original Source bytes before every review read without changing any file",()=>{
 const original=reader.text.bind(reader),spy=vi.spyOn(reader,"text").mockImplementation(file=>file.endsWith("monthMatrix.ts")?original(file)+" ":original(file));
 try { expect(()=>generateInterpretationReview(result.context)).toThrow("REVIEW_SOURCE_HASH_MISMATCH"); }finally { spy.mockRestore(); }
 expect(validateInterpretationReview(result.context,result.draft).ok).toBe(true);
});

it("retains complete original comparison provenance and Native Receipt identity for eligible and withheld cases",()=>{
 for(const d of [result.draft,unknown.draft])for(const c of d.cases){
  expect(c.originalNativeReceiptId.length).toBeGreaterThan(0);expect(c.originalNativeReceiptHash).toMatch(/^[a-f0-9]{64}$/);
  const ids=new Set(c.comparisonEvidenceNodes.map(n=>n.nodeId));expect(c.comparisonEvidenceNodes.length).toBeGreaterThan(0);
  for(const w of c.comparisonWitnesses)for(const id of [...w.beforeGraphEvidence,...w.afterGraphEvidence])expect(ids.has(id)).toBe(true);
  expect(c.originalAncestryStates.length).toBe(c.comparisonEvidenceNodes.length);
  expect(c.comparisonEvidenceNodes.every(n=>n.parentIds.every(id=>ids.has(id)||c.missingOriginalAncestorIds.includes(id)))).toBe(true);
  if(c.technicalState==="TECHNICALLY_WITHHELD"){expect(c.typedNativeReceiptRefs).toEqual([]);expect(c.originalBlockingReasons.length).toBeGreaterThan(0);}
  else expect(c.typedNativeReceiptRefs.length).toBeGreaterThan(0);
 }
});

it("keeps action-derived and hypothetical-scene-derived questions attached to their corresponding original fields",()=>{
 const c=result.draft.cases.find(c=>c.month===3)!,claims=c.workbenchDecomposition!.claims;
 expect(claims.find(c=>c.field==="/action")!.explanation).toContain("2월 말과 경칩 뒤");
 expect(claims.find(c=>c.field==="/scene/text")!.explanation).toContain("학습 목표와 비교할 과제");
 expect(claims.find(c=>c.field==="/scene/text")!.originalText).toContain("가상으로");
});
it("does not label a technically withheld case as an existing model draft",()=>{
 const html=renderInterpretationReviews([result,unknown]),section=html.split('id="case-3-1"')[1].split('</section>')[0];
 expect(section).toContain("INTERPRETATION_DRAFT_WITHHELD");expect(section).not.toContain("MODEL_PROPOSED_REVIEW");
});
