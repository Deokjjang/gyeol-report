import { describe, expect, it, vi } from "vitest";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
vi.mock("server-only",()=>({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { COMPREHENSIVE_READER_CHAPTERS } from "../../../src/lib/interpretation-v4/comprehensiveReleaseContracts";

import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { validateComprehensiveRelease, compareComprehensiveReaders } from "../../../src/lib/interpretation-v4/comprehensiveReleaseValidator";
import type { ReleaseDraft } from "../../../src/lib/interpretation-v4/comprehensiveReleaseRenderer";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { fixtureInput } from "./narrativeFixtures";
import { collectReleaseSources, freshReleaseAllocation, selectReleaseSource, commitReleaseSource } from "../../../src/lib/interpretation-v4/comprehensiveReleaseSources";
import { stabilityFixtures } from "./stabilityFixtures";
const root="/tmp/gyeol-editorial-release";
let example:ReleaseDraft;
const summaries:unknown[]=[];
const readers:{id:string;draft:ReleaseDraft}[]=[];
const A=NARRATIVE_FIXTURES[0];
const fixtures=[A,NARRATIVE_FIXTURES[1],{...A,id:"C-same-chart-INFP",mbti:"INFP"},{...NARRATIVE_FIXTURES[3],id:"D-same-MBTI-other-chart"},
  {...A,id:"E-unknown-MBTI",mbti:null},{...A,id:"F-unknown-hour",time:undefined},{...A,id:"G-student",context:{...A.context,jobStatus:"student" as const,detailJob:"미디어학"}},
  {...A,id:"H-married",context:{...A.context,relationshipStatus:"married" as const}}];

describe("reader edition uses canonical evidence and actual customer publication",()=>{
  it.each(fixtures)("$id actual complete manuscript",async f=>{
    const payload=singleRuntimeInput("saju_mbti_full","saju-mbti-full",f), before=structuredClone(payload);
    const generated=await generateV4ShadowReport(payload,SHADOW_CLOCK);
    expect(payload).toEqual(before);
    expect(generated.ok,JSON.stringify(generated.ok?null:generated.error)).toBe(true);
    if(!generated.ok)return;
    const e=generated.evidencePacket as V4RuntimeEvidence;
    if(e.composition.product!=="saju_mbti_full"||!("integration" in e.composition.result))return expect.unreachable();
    const r=e.composition.result, draft=r.integration.readerEdition;
    const book=projectBook(e)!;
    example=draft;
    if([A.id,NARRATIVE_FIXTURES[1].id,"C-same-chart-INFP","D-same-MBTI-other-chart"].includes(f.id))readers.push({id:f.id,draft});
    if(process.env.COMPREHENSIVE_EDITORIAL_EXPORT==="1") {
    mkdirSync(root+"/manuscripts",{recursive:true});
    writeFileSync(`${root}/manuscripts/${f.id}.txt`,draft.chapters.map(c=>`${c.id} ${c.title}\n\n${c.paragraphs.map(p=>`${p.purpose}\n${p.text}`).join("\n\n")}`).join("\n\n"));
    writeFileSync(`${root}/manuscripts/${f.id}.json`,JSON.stringify({draft,validation:r.integration.readerValidation,book},null,2));
    summaries.push({id:f.id,length:draft.bodyLength,chapters:draft.chapters.length,paragraphs:draft.chapters.reduce((n,c)=>n+c.paragraphs.length,0),quality:r.integration.readerValidation.qualityIssues,explicitMbti:draft.explicitMbtiUsage});
    writeFileSync(root+"/summary.json",JSON.stringify(summaries,null,2));
    }
    expect(generated.externalCalls).toEqual([]);
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(draft.chapters.map(c=>c.id)).toEqual(COMPREHENSIVE_READER_CHAPTERS.map(c=>c.id));
    expect(draft.chapters.every(c=>c.paragraphs.length>0)).toBe(true);
    if(f.mbti&&f.time) {
      expect(draft.chapters.every(c=>c.paragraphs.length===4),JSON.stringify(r.integration.readerValidation)).toBe(true);
      expect(draft.bodyLength).toBeGreaterThanOrEqual(9000);
      expect(draft.bodyLength).toBeLessThanOrEqual(11000);
    }
    expect(draft.bodyLength).toBe(draft.chapters.flatMap(c=>c.paragraphs.map(p=>p.text)).join("\n\n").length);
    expect(draft.explicitMbtiUsage).toBeLessThanOrEqual(7);
    for(const chapter of draft.chapters)for(const paragraph of chapter.paragraphs) {
      const count=(paragraph.text.match(/[.!?](?=\s|$)/g)??[]).length;
      expect(count,paragraph.id).toBeGreaterThanOrEqual(3);
      expect(count,paragraph.id).toBeLessThanOrEqual(5);
    }
    expect(r.integration.readerValidation.qualityIssues.filter(i=>/REUSE|DUPLICATE|CLOSING_NEW/.test(i))).toEqual([]);
    const contents=book.pages.find(p=>p.id==="contents");
    expect(contents?.kind==="contents"&&contents.entries.map(e=>e.title)).toEqual(COMPREHENSIVE_READER_CHAPTERS.map(c=>c.title));
    for(const p of book.pages)if(p.kind==="contents")for(const entry of p.entries)expect(book.pages[entry.page].id===entry.targetId||book.pages[entry.page].anchors?.includes(entry.targetId)).toBe(true);
    const snapshot=createProductPreviewSnapshot({reportId:"editorial-synthetic",createdAtIso:e.generatedAt,productKey:e.input.productKey,productSlug:e.input.productSlug,draft:generated.draft as unknown as ProductPreviewSnapshotDraft,evidencePacket:e});
    expect(snapshot.ok).toBe(true);
    if(snapshot.ok){const saved=JSON.parse(JSON.stringify(snapshot.value));expect(storedBook(saved)?.data).toEqual(book);expect(storedBook(saved,"https://example.test/r/local-synthetic")?.data).toEqual(book);}
    expect(validateV4Publication("saju_mbti_full",generated.draft,e)).toEqual({ok:true,errors:[]});
    expect(JSON.parse(JSON.stringify(e))).toEqual(e);
    if(!f.mbti)expect(draft.chapters.flatMap(c=>c.paragraphs.flatMap(p=>p.sentences)).every(s=>!s.mbtiSourceNodeIds.length)).toBe(true);
  },120000);
  it("reader comparison records shared copy instead of mistaking length for personalization",()=>{
    expect(readers).toHaveLength(4);
    const comparisons=compareComprehensiveReaders(readers);
    if(process.env.COMPREHENSIVE_EDITORIAL_EXPORT==="1")writeFileSync(root+"/cross-reader.json",JSON.stringify(comparisons,null,2));
    const ab=comparisons.find(r=>r.left===A.id&&r.right===NARRATIVE_FIXTURES[1].id)!;
    expect(ab.chapters.find(c=>c.id==="CH01")?.firstSentenceEqual).toBe(false);
    expect(ab.chapters.find(c=>c.id==="CH06")?.firstSentenceEqual).toBe(false);
    expect(ab.sameParagraphs.filter(id=>id.startsWith("CH07")||id.startsWith("CH09")||id.startsWith("CH12"))).toEqual([]);
    const a=readers[0].draft.chapters.find(c=>c.id==="CH07")!.paragraphs[3], b=readers[1].draft.chapters.find(c=>c.id==="CH07")!.paragraphs[3];
    expect(a.text).not.toBe(b.text);
    // Same chart A/C legitimately retains canonical day/element/fortune facts.
    expect(comparisons.find(r=>r.left===A.id&&r.right==="C-same-chart-INFP")!.sameParagraphs).toContain("CH01.P2");
    const clone=structuredClone(readers[0].draft);clone.chapters[0].paragraphs[0].sentences[0].evidenceIds=["different-proof"];
    expect(compareComprehensiveReaders([readers[0],{id:"mutated",draft:clone}])[0].qualityIssues).toContain("CH01.P1:DIFFERENT_PROOF_SAME_COPY");
  });
  it.runIf(!!process.env.EDITORIAL_LEGACY_SNAPSHOT)("former 13D-6B edition reopens without a reader upgrade",()=>{
    const old=JSON.parse(readFileSync(process.env.EDITORIAL_LEGACY_SNAPSHOT!,"utf8"));
    const before=JSON.stringify(old.snapshot);
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);
    expect(storedBook(JSON.parse(before),"https://example.test/r/old-synthetic")?.data).toEqual(old.book);
    expect(JSON.stringify(old.snapshot)).toBe(before);
  });
  it("unknown roots and reversed signed axes remain safety errors",()=>{
    const m=buildIntegratedMyeongliProfile(fixtureInput({...A,context:{...A.context,relationshipStatus:"married"}}).calculation);
    if(!m.ok)return expect.unreachable();
    const profiles=schedulerInputs(m.value,A.mbti,{...A.context,relationshipStatus:"married"}), plan=schedulerPlan(profiles);
    const pool=collectReleaseSources(plan,profiles), memory=freshReleaseAllocation();
    const proposed=selectReleaseSource(pool,"money",memory,plan);
    expect(proposed).toBeDefined();expect(memory).toEqual(freshReleaseAllocation());
    expect(selectReleaseSource(pool,"money",memory,plan)).toEqual(proposed);
    commitReleaseSource(proposed!,"money",memory);
    expect(memory.rootUses.get(proposed!.atom.id)).toBe(1);expect(memory.meanings.has(`${proposed!.facet}:money`)).toBe(true);
    const broken=structuredClone(example);broken.chapters[0].paragraphs[0].sentences[0].evidenceIds=["invented-proof"];
    expect(validateComprehensiveRelease(broken,profiles,plan).hardErrors).toContain("CH01.P1:UNKNOWN_MYEONGLI_PROOF");
    const premature=structuredClone(example);premature.chapters[0].paragraphs[0].sentences[0].provenance.application="RECALL";
    expect(validateComprehensiveRelease(premature,profiles,plan).qualityIssues).toContain("CH01.P1:RECALL_UNINTRODUCED_PROOF");
    const reversed=structuredClone(example), s=reversed.chapters.flatMap(c=>c.paragraphs.flatMap(p=>p.sentences)).find(s=>s.provenance.axis)!;
    s.provenance.direction=s.provenance.direction===1?-1:1;
    expect(validateComprehensiveRelease(reversed,profiles,plan).hardErrors.some(e=>e.endsWith(":UNSUPPORTED_SIGNED_AXIS"))).toBe(true);
  },60000);
  it.each(stabilityFixtures("holdout").filter(f=>["S097","S098","S099","S102","S111"].includes(f.id)))("$id closing recalls introduced proof after primary allocation",async f=>{
    const result=await generateV4ShadowReport(f.payload,SHADOW_CLOCK);
    expect(result.ok).toBe(true);if(!result.ok)return;
    const e=result.evidencePacket as V4RuntimeEvidence;
    if(e.composition.product!=="saju_mbti_full"||!("integration" in e.composition.result))return expect.unreachable();
    const {readerEdition:draft,readerValidation:validation}=e.composition.result.integration;
    expect(validation.hardErrors).toEqual([]);
    expect(validation.qualityIssues.filter(i=>i.includes("CLOSING_NEW_EVIDENCE"))).toEqual([]);
    expect(draft.chapters.at(-1)?.paragraphs).toHaveLength(4);
    expect(draft.chapters.at(-1)?.paragraphs.flatMap(p=>p.sentences).every(s=>s.provenance.application==="RECALL")).toBe(true);
    if(f.precision!=="unknown")expect(draft.chapters.reduce((n,c)=>n+c.paragraphs.length,0)).toBe(52);
    if(process.env.COMPREHENSIVE_EDITORIAL_EXPORT==="1") {
      mkdirSync(root+"/edges",{recursive:true});
      writeFileSync(`${root}/edges/${f.id}.json`,JSON.stringify({draft,validation},null,2));
    }
  },120000);
  it.each(stabilityFixtures("training").filter(f=>["S002","S005","S017","S019","S038","S062","S088","S089"].includes(f.id)))("$id retains safe publication and completes sparse normal questions",async f=>{
    const result=await generateV4ShadowReport(f.payload,SHADOW_CLOCK);
    expect(result.ok).toBe(true);if(!result.ok)return;
    const e=result.evidencePacket as V4RuntimeEvidence;
    if(e.composition.product!=="saju_mbti_full"||!("integration" in e.composition.result))return expect.unreachable();
    const {readerEdition:draft,readerValidation:validation}=e.composition.result.integration;
    expect(validation.hardErrors).toEqual([]);
    expect(validation.qualityIssues.filter(i=>/CLOSING_NEW_EVIDENCE|LONG_PHRASE_REUSE/.test(i)),JSON.stringify(validation.longPhrases)).toEqual([]);
    expect(validateV4Publication("saju_mbti_full",result.draft,e)).toEqual({ok:true,errors:[]});
    if(["S002","S005","S017","S038","S088"].includes(f.id)) {
      expect(draft.chapters.map(c=>c.paragraphs.length),JSON.stringify({issues:validation.qualityIssues,allocation:draft.allocation})).toEqual(Array(13).fill(4));
      expect(draft.bodyLength).toBeGreaterThanOrEqual(9000);expect(draft.bodyLength).toBeLessThanOrEqual(11000);
      expect(validation.qualityIssues).toEqual([]);
      expect(draft.allocation?.complete,JSON.stringify(draft.allocation)).toBe(true);
    }
    if(process.env.COMPREHENSIVE_EDITORIAL_EXPORT==="1") {
      mkdirSync(root+"/edges",{recursive:true});writeFileSync(`${root}/edges/${f.id}.json`,JSON.stringify({draft,validation},null,2));
    }
  },120000);
});
