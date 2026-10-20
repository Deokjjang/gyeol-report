import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, expect, it } from "vitest";
import { CAREER_READER_CHAPTERS } from "@/lib/interpretation-v4/careerReleaseContracts";
import { CAREER_RELEASE_MATERIALS } from "@/lib/interpretation-v4/careerReleaseMaterials";
import { CAREER_ROUTES } from "@/lib/interpretation-v4/careerRecommendations";
import type { CareerProduct } from "@/lib/interpretation-v4/careerProductAdapter";
import { careerWorkNarrative } from "@/lib/interpretation-v4/careerWorkNarrative";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { JOB_STATUSES, MBTI_TYPES } from "@/lib/report-generation/reportInputTypes";
import { SEMANTIC_FACETS } from "@/lib/report-knowledge/semantic-axis-research/semanticFacets";
import { CH01_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter01Materials";
import { CH02_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter02Materials";
import { CH03_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter03Materials";
import { CH04_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter04Materials";
import { CH05_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter05Materials";
import { CH06_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter06Materials";
import { CH07_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter07Materials";
import { CH08_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter08Materials";
import { CH09_MATERIALS } from "@/lib/report-knowledge/career-product-research/chapter09Materials";
import { CAREER_CHAPTER_RESEARCH } from "@/lib/report-knowledge/career-product-research/chapterResearch";
import { CAREER_PARAGRAPH_RESEARCH } from "@/lib/report-knowledge/career-product-research/paragraphResearch";
import { CAREER_SENTENCE_ROLE_RESEARCH } from "@/lib/report-knowledge/career-product-research/sentenceRoleResearch";
import { CAREER_SOURCE_REGISTRY } from "@/lib/report-knowledge/career-product-research/sourceRegistry";
import { CAREER_JOB_RESEARCH } from "@/lib/report-knowledge/career-product-research/jobFunctionResearch";
import { CAREER_FACET_AUDIT } from "@/lib/report-knowledge/career-product-research/capabilityResearch";
import { CAREER_EXISTING_FUNCTION_RESEARCH } from "@/lib/report-knowledge/career-product-research/existingFunctionResearch";
import { CAREER_ROUTE_RESEARCH } from "@/lib/report-knowledge/career-product-research/recommendationResearch";
import { CAREER_JOB_STATUS_RESEARCH } from "@/lib/report-knowledge/career-product-research/jobStatusResearch";
import { CAREER_DETAIL_JOB_APPLICATIONS } from "@/lib/report-knowledge/career-product-research/detailJobApplicability";
import { CAREER_INPUT_CASES } from "@/lib/report-knowledge/career-product-research/inputContextResearch";
import { CAREER_REUSE_RESEARCH } from "@/lib/report-knowledge/career-product-research/reuseResearch";
import { CAREER_REJECTED_RESEARCH } from "@/lib/report-knowledge/career-product-research/rejectedResearch";
import type { Material, ResearchId, CalculatedEvidenceId } from "@/lib/report-knowledge/career-product-research/researchTypes";
import { fixtureInput, NARRATIVE_FIXTURES } from "../interpretation-v4/narrativeFixtures";
const doc = "docs/validation/v4-career-product-knowledge-01/";
const json = <T>(f: string): T => JSON.parse(readFileSync(doc + f, "utf8")) as T;
const sha = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const materials: readonly Material[] = [...CH01_MATERIALS,...CH02_MATERIALS,...CH03_MATERIALS,...CH04_MATERIALS,...CH05_MATERIALS,...CH06_MATERIALS,...CH07_MATERIALS,...CH08_MATERIALS,...CH09_MATERIALS];
const byId = new Map(materials.map(m => [m.id,m]));
const sources = new Map(CAREER_SOURCE_REGISTRY.map(s => [s.key,s]));
const jobIds = new Set(CAREER_JOB_RESEARCH.map(j => j.id));
const facetIds = new Set(SEMANTIC_FACETS.map(f => f.id));
const assertOffline = (r: { connectedToRuntime: false; approvedForCustomer: false; existingScoreContribution: false; runtimeEvidenceIds: readonly [] }) => {
 expect([r.connectedToRuntime,r.approvedForCustomer,r.existingScoreContribution]).toEqual([false,false,false]); expect(r.runtimeEvidenceIds).toEqual([]);
};
type Check<T extends true> = T;
const researchCannotIssueEvidence: Check<ResearchId extends CalculatedEvidenceId ? false : true> = true;
function walk(d: string): string[] { return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(d,e.name)):[resolve(d,e.name)]); }
function pointer(v: unknown,p: string): unknown { return p.split("/").slice(1).reduce<unknown>((v,k)=>v&&typeof v==="object"?(v as Record<string,unknown>)[k.replace(/~1/g,"/").replace(/~0/g,"~")]:undefined,v); }

afterAll(()=>{if(process.env.CAREER_RESEARCH_CAPTURE)writeFileSync(process.env.CAREER_RESEARCH_CAPTURE,JSON.stringify(observations,null,2)+"\n");});
it("keeps research IDs separate from producer IDs and preserves 2275 existing source files",()=>{
 expect(researchCannotIssueEvidence).toBe(true); const locks=json<Record<string,string>>("existing-files-preservation.json");expect(Object.keys(locks)).toHaveLength(2275);for(const [f,h] of Object.entries(locks))expect(sha(readFileSync(f)),f).toBe(h);
});
it.each(CAREER_READER_CHAPTERS)("$id preserves the actual title, purpose and roles",c=>{
 const ch=CAREER_CHAPTER_RESEARCH.find(x=>x.chapterId===c.id)!;expect([ch.originalTitle,ch.domain]).toEqual([c.title,c.domain]);expect(ch.noOneToOneCareerQuestionMapping).toBe(true);assertOffline(ch);
 for(const p of c.paragraphs){const address=`${c.id}.${p.id}`,research=CAREER_PARAGRAPH_RESEARCH.find(x=>x.address===address)!;expect(research.originalPurpose).toBe(p.purpose);expect(research.materialIds.length).toBeGreaterThanOrEqual(5);
 expect(new Set(research.materialIds).size).toBe(research.materialIds.length);for(const [i,role]of p.sentences.entries()){const r=CAREER_SENTENCE_ROLE_RESEARCH.find(r=>r.address===`${address}.S${i+1}`)!;expect(r.originalRole).toBe(role);expect(r.materialIds).toEqual(research.materialIds);expect(r.absentEvidence).toBe("withhold_not_fill");} }
});
it("covers 9 chapters, 36 questions, 144 roles and 192 authored materials without counting role links as new facts",()=>{
 expect(CAREER_CHAPTER_RESEARCH).toHaveLength(9);expect(CAREER_PARAGRAPH_RESEARCH).toHaveLength(36);expect(CAREER_SENTENCE_ROLE_RESEARCH).toHaveLength(144);expect(materials).toHaveLength(192);expect(new Set(materials.map(m=>m.coreMeaning)).size).toBe(192);
 expect(materials.flatMap(m=>Object.values(m.roleContributions))).toHaveLength(768);expect(materials.filter(m=>m.review==="held_source_or_conditions")).toHaveLength(1);
});
it.each(materials)("$id has explicit professional meaning, conditions and separate source scope",m=>{
 assertOffline(m);expect(m.productKey).toBe("career_money_study");expect(m.id).toMatch(/^ckr:material:/);expect(m.newCalculatedFacts).toBe(0);expect(m.recommendationRankChange).toBe(false);
 expect(m.coreMeaning.length).toBeGreaterThan(12);for(const k of [m.positive,m.risk,m.factBomb,m.twist,m.workScene.text,m.economicScene,m.learningScene,m.action,m.counterexample,m.distinctFromOtherParagraphs])expect(k.length).toBeGreaterThan(7);
 expect(m.workScene.status).toBe("fictional_not_customer_history");expect(m.risk).not.toBe(m.factBomb);expect(m.positive).not.toBe(m.twist);
 expect(m.jobStatuses.length).toBeGreaterThan(0);for(const status of m.jobStatuses)expect(JOB_STATUSES).toContain(status);for(const id of m.detailJobRefs)expect(jobIds.has(id)).toBe(true);for(const f of m.semanticFacets){expect(facetIds.has(f.id)).toBe(true);expect(f.notIndependentEvidence).toBe(true);}
 for(const key of m.sourceKeys)expect(sources.has(key)).toBe(true);expect(m.missingMbti).toBe("withhold_mbti_and_fusion_no_invented_type");expect(m.unknownBirthTime).toBe("no_synthetic_hour_recheck_actual_support");expect(m.prerequisites.sourceOwner).toBe("same_person_natal_only");expect(m.disallowed).toHaveLength(4);
 for(const [role,c]of Object.entries(m.roleContributions)){const contract=CAREER_SENTENCE_ROLE_RESEARCH.find(r=>r.address===`${m.address}.${role}`)!;expect(c.originalRole).toBe(contract.originalRole);expect(c.knowledge.length).toBeGreaterThan(8);}
 if(m.address==="CH03.P2"||m.address==="CH03.P3")expect(m.prerequisites.requiresExistingRecommendation).toBe(true);if(m.address==="CH03.P4")expect(m.prerequisites.requiresExistingAvoidProof).toBe(true);
 if(m.review==="held_source_or_conditions")expect(m.holdReason).toContain("보류");
});
it.each(CH09_MATERIALS)("$id recalls only actual introduced compatible earlier meanings",m=>{
 expect(m.researchKind).toBe("recall");expect(m.sourceKeys).toEqual([]);expect(m.precedingMeaningRefs.length).toBeGreaterThan(0);expect(m.precedingMeaningPolicy).toBe("actual_introduced_compatible_subset_only");for(const id of m.precedingMeaningRefs){const before=byId.get(id)!;expect(before).toBeDefined();expect(before.address<m.address).toBe(true);}expect(m.newCalculatedFacts).toBe(0);
});
type Locator = {key:string;sourceId:string;file:string;pointer?:string;exportName?:string;index?:number;recordSha256:string;sourceFileSha256:string;raw:unknown;originalState:Record<string,unknown>};
it.each(json<Locator[]>("source-catalog.json"))("$sourceId resolves to the actual source pointer and hash",async s=>{
 const ref=sources.get(s.key)!;assertOffline(ref);expect(ref.auditRef).toBe("source-catalog.json#"+s.key);expect(ref.originalState).toEqual(s.originalState);expect(ref.sourceFileSha256).toBe(sha(readFileSync(s.file)));
 let actual:unknown;if(s.pointer)actual=pointer(JSON.parse(readFileSync(s.file,"utf8").replace(/^\uFEFF/,"")),s.pointer);else{const sourceModule:unknown=await import(resolve(s.file));const v=(sourceModule as Record<string,unknown>)[s.exportName!];actual=s.index===undefined?v:(v as readonly unknown[])[s.index];}expect(actual).toEqual(s.raw);expect(sha(JSON.stringify(actual))).toBe(s.recordSha256);
 expect(ref.sourceKind).not.toMatch(/pair|temporal/);
});
it.each(CAREER_FACET_AUDIT)("$facet preserves the existing signed definition and distinguishes tasks",a=>{
 assertOffline(a);const old=CAREER_RELEASE_MATERIALS[a.facet];expect(a.existingAxes).toEqual(old.axes);expect(a.actualLabel).toBe(old.label);expect(a.existingMaterialHash).toBe(sha(JSON.stringify(old)));expect(a.difference.length).toBeGreaterThan(15);for(const j of a.jobRefs)expect(jobIds.has(j)).toBe(true);
});
it.each(CAREER_ROUTE_RESEARCH)("$existingRouteId keeps existing ranking and task contract",r=>{
 assertOffline(r);const route=CAREER_ROUTES.find(x=>x.id===r.existingRouteId)!;expect(r.existingRouteHash).toBe(sha(JSON.stringify(route)));expect(r.taskMeaning).toBe(route.task);expect(r.rankingUnchanged).toBe(true);expect(r.researchIsRecommendation).toBe(false);expect(r.jobResearchRefs.length).toBeGreaterThan(0);
});
it.each(CAREER_JOB_RESEARCH)("$key separates job tasks, fictional scenes and actual classifier support",j=>{
 assertOffline(j);expect(j.occupationIsAbilityProof).toBe(false);expect(j.adapterImplemented).toBe(false);expect(j.workflow.length).toBeGreaterThanOrEqual(5);for(const t of [j.task,j.outputs,j.collaboration,j.difficulty,j.comfortable,j.uncomfortable,j.learn,j.validateResult,j.economic,j.smallExperiment,j.fictionalScene,j.restrictions])expect(t.length).toBeGreaterThan(10);
 for(const route of j.existingRouteRefs)expect(CAREER_ROUTES.some(r=>r.id===route)).toBe(true);
 for(const v of j.observedVariants){const input=fixtureInput({...NARRATIVE_FIXTURES[0],context:{...NARRATIVE_FIXTURES[0].context,jobStatus:v.jobStatus,detailJob:j.testedInputText}});const actual=careerWorkNarrative(input);expect(actual.career.function).toBe(v.baseFunction);expect(actual.workFunction).toBe(v.effectiveFunction);}
});
it("audits all 17 facets, 8 routes and 11 existing scene function groups without treating them as all parser outputs",()=>{
 expect(CAREER_FACET_AUDIT.map(x=>x.facet).sort()).toEqual(Object.keys(CAREER_RELEASE_MATERIALS).sort());expect(CAREER_ROUTE_RESEARCH.map(x=>x.existingRouteId)).toEqual(CAREER_ROUTES.map(x=>x.id));expect(CAREER_EXISTING_FUNCTION_RESEARCH).toHaveLength(11);expect(CAREER_EXISTING_FUNCTION_RESEARCH.filter(x=>x.actualStepsSupported)).toHaveLength(3);
 const language=CAREER_JOB_RESEARCH.find(j=>j.key==="translation")!;expect(language.baseClassifierFunction).toBe("unknown");expect(language.observedFunction).toBe("language_mediation");expect(CAREER_JOB_RESEARCH.find(j=>j.key==="photography")!.observedVariants.find(v=>v.jobStatus==="freelancer")!.effectiveFunction).toBe("unknown");
});
it.each(CAREER_JOB_STATUS_RESEARCH)("status $actualValue has its own questions and never contributes a score",s=>{
 assertOffline(s);expect(JOB_STATUSES).toContain(s.actualValue);expect(s.statusIsScore).toBe(false);expect(byId.get(s.sourceMaterial)?.jobStatuses).toContain(s.actualValue);for(const text of [s.currentTask,s.constraints,s.strengthUse,s.nextChoice,s.learning,s.moneyTime,s.environmentDifference,s.smallExperiment,s.disallowed])expect(text.length).toBeGreaterThan(8);
});
it("covers every actual jobStatus including empty and other, keeping unknown restrictions distinct",()=>{
 expect(CAREER_JOB_STATUS_RESEARCH.map(s=>s.actualValue).sort()).toEqual([...JOB_STATUSES].sort());expect(new Set(CAREER_JOB_STATUS_RESEARCH.map(s=>s.currentTask)).size).toBe(10);expect(CAREER_REJECTED_RESEARCH.some(r=>r.rejectedClaim.includes("MBTI 미상"))).toBe(true);expect(CAREER_REJECTED_RESEARCH.some(r=>r.rejectedClaim.includes("시간 미상"))).toBe(true);
});
it.each(CAREER_INPUT_CASES)("case $letter records actual classification and missing-input boundaries",c=>{
 assertOffline(c);expect(c.isFictional).toBe(true);expect(c.inputs).toHaveLength(c.observedFunctions.length);for(const [i,v]of c.inputs.entries()){expect(JOB_STATUSES).toContain(v.jobStatus);expect(MBTI_TYPES).toContain(v.mbtiType);const input=fixtureInput({...NARRATIVE_FIXTURES[0],context:{...NARRATIVE_FIXTURES[0].context,jobStatus:v.jobStatus,detailJob:v.detailJob}});expect(careerWorkNarrative(input).workFunction).toBe(c.observedFunctions[i]);}
});
const observations: {letter:string;variant:number;ok:boolean;error?:unknown;workFunction?:string;publishedEdition?:string;releaseChapters?:number;releaseParagraphs?:number;bodyLength?:number;hardErrors?:string[];qualityIssues?:string[];shortages?:string[];hashes?:Record<string,string>;sampleCurrent?:string[];sampleStudy?:string[];paragraphs?:{id:string;text:string}[];payload:unknown}[]=[];
it.each(CAREER_INPUT_CASES)("case $letter runs the unchanged offline paid generator and records actual edition diagnostics",async c=>{
 for(const [i,v]of c.inputs.entries()){
  const payload={productKey:"career_money_study",productSlug:"career-money-study",person:{name:"검수가상"+c.letter,birthDate:"1988-11-06",birthTime:v.birthTimePrecision==="unknown"?"":"16:45",gender:"MALE",mbtiType:v.mbtiType,birthTimeUnknown:v.birthTimePrecision==="unknown",birthTimePrecision:v.birthTimePrecision,approximateBirthTimeSlot:""},userContext:{jobStatus:v.jobStatus,detailJob:v.detailJob,relationshipStatus:"",focusAreas:[]},productOptions:{contentVersion:"v3"}};
  const generated=await generateV4ShadowReport(payload,{evaluatedAt:"2026-10-12T12:00:00+09:00"});
  if(!generated.ok){observations.push({letter:c.letter,variant:i,ok:false,error:generated.error,payload});expect(generated.ok).toBe(true);continue;}
  const e=generated.evidencePacket as V4RuntimeEvidence,result=e.composition.result;expect("integration" in result&&"selection" in result).toBe(true);if(!("integration" in result&&"selection" in result)||!("workFunction" in result.selection)||!("readerEdition" in result.integration))continue;
  expect(e.productType).toBe("career_money_study");
  const r=result as CareerProduct,edition=r.integration.readerEdition;
  observations.push({letter:c.letter,variant:i,ok:true,payload,workFunction:r.selection.workFunction,publishedEdition:r.integration.publishedEdition,releaseChapters:edition.chapters.length,releaseParagraphs:edition.chapters.reduce((n,ch)=>n+ch.paragraphs.length,0),bodyLength:edition.bodyLength,hardErrors:r.integration.readerValidation.hardErrors,qualityIssues:r.integration.readerValidation.qualityIssues,shortages:edition.shortages,paragraphs:edition.chapters.flatMap(ch=>ch.paragraphs.map(p=>({id:p.id,text:p.text}))),hashes:{calculations:v4Digest(e.calculations),fullEvidence:v4Digest(e),narrative:v4Digest(r.narrative),integration:v4Digest(r.integration)},sampleCurrent:r.narrative.sections.find(s=>s.id==="current")?.blocks.map(b=>b.text)??[],sampleStudy:r.narrative.sections.find(s=>s.id==="study")?.blocks.map(b=>b.text)??[]});
  expect(r.selection.workFunction).toBe(c.observedFunctions[i]);expect(edition.chapters).toHaveLength(9);
  if(v.mbtiType==="")expect(JSON.stringify(r.narrative)).not.toMatch(/\b[EI][SN][TF][JP]\b/);
 }
},120000);
it("requires distinct chapter questions and explicit reuse guards",()=>{
 expect(CAREER_REUSE_RESEARCH).toHaveLength(12);expect(CAREER_REJECTED_RESEARCH).toHaveLength(24);for(const r of CAREER_REUSE_RESEARCH){assertOffline(r);expect(r.independentFactsAdded).toBe(0);expect(r.distinctQuestions.length).toBeGreaterThanOrEqual(2);expect(new Set(r.distinctQuestions).size).toBe(r.distinctQuestions.length);}
});
it("keeps research off runtime imports, lookup code, barrels, scoring and binding",()=>{
 for(const f of walk("src").filter(f=>/\.(ts|tsx)$/.test(f))){const code=readFileSync(f,"utf8");if(f.includes("/career-product-research/")){expect(code).not.toMatch(/^import(?! type)[\s{]/m);expect(code).not.toMatch(/export (?:async )?function|\b(?:fetch|require|setTimeout|setInterval)\s*\(/);expect(f).not.toMatch(/\/index\.ts$/);}else expect(code,f).not.toContain("career-product-research/");}
});

it.each(CAREER_DETAIL_JOB_APPLICATIONS)("$id keeps task questions conditional and source limits explicit",d=>{
 assertOffline(d);expect(jobIds.has(d.jobRef)).toBe(true);for(const id of d.materialRefs)expect(byId.has(id)).toBe(true);expect(d.adapterImplemented).toBe(false);expect(d.sceneStatus).toBe("fictional_not_customer_history");expect(d.independentSourceFactsAdded).toBe(0);for(const t of [d.question,d.requiredEnteredFacts,d.contrast,d.fictionalScene,d.economicCondition,d.skillVerification,d.counterexample,d.additionalEvidenceNeed])expect(t.length).toBeGreaterThan(10);
});
it("keeps the same calculation under Q/R context changes and records unsupported S detail faithfully",()=>{
 const q=observations.filter(r=>r.letter==="Q"),r=observations.filter(r=>r.letter==="R"),s=observations.filter(r=>r.letter==="S");expect(q).toHaveLength(3);expect(r).toHaveLength(2);expect(new Set(q.map(x=>x.hashes?.calculations)).size).toBe(1);expect(new Set(r.map(x=>x.hashes?.calculations)).size).toBe(1);expect(new Set(q.map(x=>x.hashes?.narrative)).size).toBe(3);expect(r.map(x=>x.workFunction)).toEqual(["unknown","language_mediation"]);expect(s.map(x=>x.workFunction)).toEqual(["unknown","unknown"]);
 expect(CAREER_DETAIL_JOB_APPLICATIONS.filter(d=>d.review==="held_personal_source_link")).toHaveLength(1);
});
