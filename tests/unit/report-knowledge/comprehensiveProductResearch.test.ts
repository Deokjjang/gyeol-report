import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { COMPREHENSIVE_READER_CHAPTERS } from "@/lib/interpretation-v4/comprehensiveReleaseContracts";
import { RELEASE_FACETS } from "@/lib/interpretation-v4/comprehensiveReleaseMaterials";
import { JOB_STATUSES, RELATIONSHIP_STATUSES } from "@/lib/report-generation/reportInputTypes";
import { SEMANTIC_FACETS } from "@/lib/report-knowledge/semantic-axis-research/semanticFacets";
import { COMPREHENSIVE_CHAPTER_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/chapterResearch";
import { COMPREHENSIVE_PARAGRAPH_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/paragraphResearch";
import { COMPREHENSIVE_SENTENCE_ROLE_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/sentenceRoleResearch";
import { COMPREHENSIVE_INPUT_CONTEXT_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/inputContextResearch";
import { COMPREHENSIVE_REUSE_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/reuseResearch";
import { COMPREHENSIVE_REJECTED_RESEARCH } from "@/lib/report-knowledge/comprehensive-product-research/rejectedResearch";
import { CH01_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter01Materials";
import { CH02_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter02Materials";
import { CH03_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter03Materials";
import { CH04_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter04Materials";
import { CH05_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter05Materials";
import { CH06_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter06Materials";
import { CH07_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter07Materials";
import { CH08_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter08Materials";
import { CH09_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter09Materials";
import { CH10_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter10Materials";
import { CH11_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter11Materials";
import { CH12_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter12Materials";
import { CH13_MATERIALS } from "@/lib/report-knowledge/comprehensive-product-research/chapter13Materials";
import type { Material, ProductResearchId, CalculatedEvidenceId } from "@/lib/report-knowledge/comprehensive-product-research/researchTypes";

const doc="docs/validation/v4-comprehensive-product-knowledge-01/";
const json=<T>(file:string):T=>JSON.parse(readFileSync(doc+file,"utf8")) as T;
const sha=(v:string|Buffer)=>createHash("sha256").update(v).digest("hex");
const materials:readonly Material[]=[...CH01_MATERIALS,...CH02_MATERIALS,...CH03_MATERIALS,...CH04_MATERIALS,...CH05_MATERIALS,...CH06_MATERIALS,...CH07_MATERIALS,...CH08_MATERIALS,...CH09_MATERIALS,...CH10_MATERIALS,...CH11_MATERIALS,...CH12_MATERIALS,...CH13_MATERIALS];
const byId=new Map(materials.map(m=>[m.id,m]));
type Locator={key:string;sourceId:string;sourceKind:string;file:string;pointer?:string;exportName?:string;index?:number;recordSha256:string;sourceFileSha256:string;originalState:Record<string,unknown>};
const sources=json<Locator[]>("source-catalog.json");
const facets=new Map(SEMANTIC_FACETS.map(f=>[f.id,f]));
function pointer(v:unknown,p:string):unknown{return p.split("/").slice(1).reduce<unknown>((v,k)=>v&&typeof v==="object"?(v as Record<string,unknown>)[k.replace(/~1/g,"/").replace(/~0/g,"~")]:undefined,v);}
function walk(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(resolve(dir,x.name)):[resolve(dir,x.name)]);}
type Assert<T extends true>=T;
type CannotInventEvidence=Assert<ProductResearchId extends CalculatedEvidenceId?false:true>;
const typeProof:CannotInventEvidence=true;

it("preserves all 2201 pre-existing source, research, fixture and report files",()=>{const locks=json<Record<string,string>>("existing-files-preservation.json");expect(Object.keys(locks)).toHaveLength(2201);for(const [f,h]of Object.entries(locks))expect(sha(readFileSync(f)),f).toBe(h);});
it.each(COMPREHENSIVE_READER_CHAPTERS)("$id retains the actual reader title, Domain, Context and four paragraphs",c=>{
 const r=COMPREHENSIVE_CHAPTER_RESEARCH.find(r=>r.chapterId===c.id)!;expect(r).toBeDefined();expect([r.originalTitle,r.domain,r.context]).toEqual([c.title,c.domain,c.context]);expect(r.paragraphs).toEqual(c.paragraphs.map(p=>c.id+"."+p.id));
});
it.each(COMPREHENSIVE_PARAGRAPH_RESEARCH)("$address has different authored candidates and its original purpose",p=>{
 const c=COMPREHENSIVE_READER_CHAPTERS.find(c=>c.id===p.chapterId)!,original=c.paragraphs.find(x=>x.id===p.paragraphId)!;
 expect([p.originalPurpose,p.domain,p.context]).toEqual([original.purpose,c.domain,c.context]);expect(p.materialIds.length).toBeGreaterThanOrEqual(3);
 const rows=p.materialIds.map(id=>byId.get(id)!);expect(rows.every(r=>r.address===p.address)).toBe(true);expect(new Set(rows.map(r=>r.coreMeaning)).size).toBe(rows.length);
 expect(p.question).not.toBe(p.originalPurpose);for(const k of ["mustConvey","distinctFrom","previousUse","nextInformation","positiveRole","riskRole","twistRole","sceneRole","reuseRule"] as const)expect(p[k].length).toBeGreaterThan(5);
});
it.each(COMPREHENSIVE_SENTENCE_ROLE_RESEARCH)("$address resolves its unchanged role and multiple actual contributions",r=>{
 const c=COMPREHENSIVE_READER_CHAPTERS.find(c=>c.id===r.chapterId)!,p=c.paragraphs.find(p=>p.id===r.paragraphId)!;
 expect(r.originalRole).toBe(p.sentences[Number(r.sentenceRole.slice(1))-1]);expect(r.address).toBe(`${r.chapterId}.${r.paragraphId}.${r.sentenceRole}`);expect(r.materialRefs.length).toBeGreaterThanOrEqual(3);
 for(const link of r.materialRefs){const m=byId.get(link.materialId)!;expect(m).toBeDefined();expect(link.contribution).toBe(r.address);expect(m.roleContributions[r.sentenceRole]).toMatchObject({address:r.address,originalRole:r.originalRole,roleKind:"interpretation_material_not_final_copy"});expect(m.roleContributions[r.sentenceRole].knowledge.length).toBeGreaterThan(5);}
 expect(r.isNewMaterial).toBe(false);expect(r.absentEvidence).toBe("withhold_role_no_invented_filler");
});
it.each(materials)("$id preserves conditional sources, distinct roles and safe scope",m=>{
 expect(m.positive).not.toBe(m.shadow);expect(m.factBomb).not.toBe(m.twist);expect(m.fictionalScene.status).toBe("fictional_not_customer_history");expect(m.fictionalScene.text).toContain("가상");expect(m.prerequisites.length).toBeGreaterThan(1);expect(m.counterexample.length).toBeGreaterThan(8);
 expect(m.sourcePolicy).toMatchObject({unknownBirthTime:"no_synthetic_hour_recheck_prerequisites",futurePrediction:false,pairAsIndividual:false,independentDerivedFacts:0,currentUserFactsKnown:false});
 for(const f of m.semanticFacets){const original=facets.get(f.id)!;expect(original).toBeDefined();expect([f.axis,f.definition,f.condition]).toEqual([original.axis,original.definition,original.condition]);expect(f.notIndependentEvidence).toBe(true);}
 for(const f of m.legacyFacetRelation.facets)expect(Object.hasOwn(RELEASE_FACETS,f),f).toBe(true);expect(m.legacyFacetRelation.runtimeFacetChange).toBe(false);
 for(const s of m.sourceRefs){const source=sources.find(x=>s.auditRef==="source-catalog.json#"+x.key)!;expect(source).toBeDefined();expect([s.sourceId,s.recordSha256,s.sourceFileSha256,s.originalState]).toEqual([source.sourceId,source.recordSha256,source.sourceFileSha256,source.originalState]);expect(s.sourceKind).not.toMatch(/period|pair/);}
 if(m.kind==="natal"){expect(m.sourceRefs.length).toBeGreaterThan(0);expect(m.sourceRefs.every(s=>s.sourceKind==="natal_research")).toBe(true);expect(m.sourcePolicy.unknownMbti).toBe("natal_only_if_actual_evidence");}
 if(m.kind==="fusion"){expect(m.sourceRefs.some(s=>s.sourceKind==="natal_research")).toBe(true);expect(m.sourceRefs.some(s=>s.sourceKind==="mbti_trait")).toBe(true);expect(m.sourcePolicy.unknownMbti).toBe("withhold_mbti_and_fusion");}
 if(m.kind==="recall"){expect(m.sourceRefs).toEqual([]);expect(m.precedingMeaningRefs.length).toBeGreaterThan(0);expect(m.sourcePolicy.unknownMbti).toBe("follow_antecedent_availability");}
 for(const id of m.precedingMeaningRefs){const before=byId.get(id)!;expect(before).toBeDefined();expect(before.chapterId<m.chapterId||before.chapterId===m.chapterId&&before.paragraphId<m.paragraphId).toBe(true);}expect(m.precedingMeaningPolicy).toBe("actual_introduced_compatible_subset_only");
});
it.each(sources)("$sourceId resolves the real export/pointer and source hashes",async s=>{
 expect(sha(readFileSync(s.file))).toBe(s.sourceFileSha256);let actual:unknown;
 if(s.pointer)actual=pointer(JSON.parse(readFileSync(s.file,"utf8").replace(/^\uFEFF/,"")) as unknown,s.pointer);
 else{const sourceModule:unknown=await import(resolve(s.file));const rows=(sourceModule as Record<string,unknown>)[s.exportName!] as readonly unknown[];actual=rows[s.index!];}
 expect(actual).toBeDefined();expect(sha(JSON.stringify(actual))).toBe(s.recordSha256);
 if(s.sourceKind==="mbti_trait"){const trait=actual as {id:string;sourceCoverage:string};expect(s.sourceId.endsWith(":"+trait.id)).toBe(true);expect(s.originalState.sourceCoverage).toBe(trait.sourceCoverage);}
 else expect((actual as {id:string}).id).toBe(s.sourceId);
});
it("retains original repository-only flags alongside separate deep definitions",()=>{
 const preserved=materials.flatMap(m=>m.sourceRefs.filter(s=>s.originalState.definitionReview==="repository_only"));expect(preserved.length).toBeGreaterThan(3);
 expect(materials.filter(m=>m.review==="source_or_condition_insufficient")).toHaveLength(4);
 for(const m of materials.filter(m=>m.sourceRefs.some(s=>s.originalState.definitionReview==="repository_only")))expect(m.sourceReviewNotes.length).toBeGreaterThan(0);
 expect(CH07_MATERIALS.filter(m=>m.review==="source_or_condition_insufficient").map(m=>m.id)).toEqual(expect.arrayContaining(["cpr:material:CH07.P1:munchang-held-study-symbol","cpr:material:CH07.P2:jaego-held-storehouse","cpr:material:CH07.P3:banan-held-status"]));
});
it("keeps exact coverage and unique IDs without counting role links as materials",()=>{
 expect(COMPREHENSIVE_CHAPTER_RESEARCH).toHaveLength(13);expect(COMPREHENSIVE_PARAGRAPH_RESEARCH).toHaveLength(52);expect(COMPREHENSIVE_SENTENCE_ROLE_RESEARCH).toHaveLength(208);expect(materials).toHaveLength(179);expect(byId.size).toBe(179);
 const all=[...materials,...COMPREHENSIVE_CHAPTER_RESEARCH,...COMPREHENSIVE_PARAGRAPH_RESEARCH,...COMPREHENSIVE_SENTENCE_ROLE_RESEARCH,...COMPREHENSIVE_INPUT_CONTEXT_RESEARCH,...COMPREHENSIVE_REUSE_RESEARCH,...COMPREHENSIVE_REJECTED_RESEARCH];expect(new Set(all.map(r=>r.id)).size).toBe(all.length);
 for(const r of all){expect(r).toMatchObject({product:"saju_mbti_full",connectedToRuntime:false,approvedForCustomer:false,existingScoreContribution:false,runtimeEvidenceIds:[],empiricalVerification:"not_established"});expect(r.id).toMatch(/^cpr:/);}expect(typeProof).toBe(true);
});
it("checks actual input enums and preserves unknown-input withholding",()=>{
 const cases=COMPREHENSIVE_INPUT_CONTEXT_RESEARCH;expect(cases.filter(c=>c.inputKind==="job").map(c=>c.actualValue)).toEqual([...JOB_STATUSES]);expect(cases.filter(c=>c.inputKind==="relationship").map(c=>c.actualValue)).toEqual([...RELATIONSHIP_STATUSES]);expect(cases.filter(c=>c.inputKind==="birth_time").map(c=>c.actualValue)).toEqual(["exact","approximate","unknown"]);
 expect(cases.find(c=>c.inputKind==="mbti"&&c.actualValue==="provided")?.supportedEnum).toBe(false);expect(cases.find(c=>c.inputKind==="mbti"&&c.actualValue==="")?.supportedEnum).toBe(true);
 expect(CH03_MATERIALS.every(m=>m.sourcePolicy.unknownMbti==="withhold_mbti_and_fusion")).toBe(true);expect(CH02_MATERIALS.every(m=>m.sourcePolicy.unknownMbti==="natal_only_if_actual_evidence")).toBe(true);
});
it("withholds temporal and Pair facts rather than turning them into natal claims",()=>{const rows=json<{family:string;productScope:string;relatedReaderChapters:string[];newEvidenceFacts:number}[]>("source-applicability.json");expect(rows).toHaveLength(2991);for(const r of rows){expect(r.newEvidenceFacts).toBe(0);if(r.family==="temporal")expect([r.productScope,r.relatedReaderChapters]).toEqual(["excluded_from_natal_claim",[]]);if(r.family==="mbtiPair")expect([r.productScope,r.relatedReaderChapters]).toEqual(["excluded_without_counterpart",[]]);}});
it("audits all 109 facets while distinguishing selected from possible questions",()=>{const rows=json<{id:string;selectedMaterialIds:string[];connectedToRuntime:boolean;approvedForCustomer:boolean}[]>("semantic-facet-applicability.json");expect(rows.map(r=>r.id)).toEqual(SEMANTIC_FACETS.map(f=>f.id));expect(rows.filter(r=>r.selectedMaterialIds.length)).toHaveLength(83);expect(rows.every(r=>!r.connectedToRuntime&&!r.approvedForCustomer)).toBe(true);});
it("keeps CH13 entirely on introduced-compatible meaning references",()=>{for(const m of CH13_MATERIALS){expect(m.kind).toBe("recall");expect(m.sourceRefs).toEqual([]);expect(m.meaningClass).toBe("introduced_meaning_recall");for(const id of m.precedingMeaningRefs)expect(byId.get(id)!.chapterId<"CH13").toBe(true);}expect(COMPREHENSIVE_REJECTED_RESEARCH.some(r=>r.id==="cpr:rejected:closing-cross-type")).toBe(true);});
it("records the nine required chapter distinctions and prohibits independent-fact inflation",()=>{const keys=new Set(COMPREHENSIVE_REUSE_RESEARCH.map(r=>r.from+":"+r.to));for(const k of ["CH01:CH04","CH03:CH05","CH05:CH07","CH05:CH06","CH06:CH12","CH08:CH09","CH10:CH11","CH11:CH12","CH01:CH13"])expect(keys.has(k)).toBe(true);expect(COMPREHENSIVE_REUSE_RESEARCH.every(r=>r.independentFactsAdded===0&&r.necessaryChange.length>8)).toBe(true);expect(COMPREHENSIVE_REJECTED_RESEARCH).toHaveLength(24);});
it("has no duplicate authored core, positive, shadow, fact-bomb, twist or application strings",()=>{for(const k of ["coreMeaning","positive","shadow","factBomb","twist","application"] as const)expect(new Set(materials.map(m=>m[k])).size,k).toBe(materials.length);});
it("preserves C1-C10 as a separate many-to-many reference system",()=>{const rows=json<{legacySectionId:string;readerChapterReferences:string[];mapping:string}[]>("legacy-section-reference-matrix.json");expect(rows.map(r=>r.legacySectionId)).toEqual(Array.from({length:10},(_,i)=>"C"+(i+1)));expect(rows.every(r=>r.mapping==="many_to_many_research_reference_not_actual_placement")).toBe(true);expect(rows.find(r=>r.legacySectionId==="C7")!.readerChapterReferences).toEqual(["CH04","CH10","CH11","CH12"]);});
it("keeps static research off runtime imports, lookups, barrels and execution",()=>{const own="/report-knowledge/comprehensive-product-research/";for(const file of walk("src").filter(f=>/\.(ts|tsx)$/.test(f))){const code=readFileSync(file,"utf8");if(file.includes(own)){expect(code).not.toMatch(/^import(?! type)[\s{]/m);expect(code).not.toMatch(/export (?:async )?function|\b(?:fetch|require|setTimeout|setInterval)\s*\(/);expect(file).not.toMatch(/\/index\.ts$/);}else expect(code,file).not.toContain("comprehensive-product-research/");}});
