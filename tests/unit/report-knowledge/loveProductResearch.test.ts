import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { LOVE_READER_CHAPTERS } from "@/lib/interpretation-v4/loveReleaseContracts";
import { LOVE_RELEASE_MATERIALS } from "@/lib/interpretation-v4/loveReleaseMaterials";
import { LOVE_RELEASE_CONTEXT } from "@/lib/interpretation-v4/loveReleaseContext";
import { LOVE_PARENTING_STRENGTHS, LOVE_PARENTING_RISK, LOVE_PARENTING_RISK_TRAITS } from "@/lib/interpretation-v4/loveReleaseParenting";
import { RELATIONSHIP_STATUSES, MBTI_TYPES } from "@/lib/report-generation/reportInputTypes";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import type { LoveProduct } from "@/lib/interpretation-v4/loveProductAdapter";
import { projectBook } from "@/app/dev/book-preview/bookProjection";
import { SEMANTIC_FACETS } from "@/lib/report-knowledge/semantic-axis-research/semanticFacets";
import type { Material, ResearchId, CalculatedEvidenceId } from "@/lib/report-knowledge/love-product-research/researchTypes";
import { LOVE_CHAPTER_RESEARCH } from "@/lib/report-knowledge/love-product-research/chapterResearch";
import { LOVE_PARAGRAPH_RESEARCH } from "@/lib/report-knowledge/love-product-research/paragraphResearch";
import { LOVE_SENTENCE_ROLE_RESEARCH } from "@/lib/report-knowledge/love-product-research/sentenceRoleResearch";
import { LOVE_SOURCE_REGISTRY } from "@/lib/report-knowledge/love-product-research/sourceRegistry";
import { LOVE_FACET_AUDIT } from "@/lib/report-knowledge/love-product-research/facetAudit";
import { LOVE_PARENTING_SOURCE_AUDIT } from "@/lib/report-knowledge/love-product-research/parentingSourceAudit";
import { LOVE_RELATIONSHIP_STATUS_RESEARCH } from "@/lib/report-knowledge/love-product-research/relationshipStatusResearch";
import { LOVE_CONFLICT_REPAIR_RESEARCH } from "@/lib/report-knowledge/love-product-research/conflictRepairResearch";
import { LOVE_SEMANTIC_REUSE_RESEARCH } from "@/lib/report-knowledge/love-product-research/semanticReuseResearch";
import { LOVE_REJECTED_RESEARCH } from "@/lib/report-knowledge/love-product-research/rejectedResearch";
import { LOVE_INPUT_CASES } from "@/lib/report-knowledge/love-product-research/inputContextResearch";
import { LOVE_KNOWLEDGE_INDEX } from "@/lib/report-knowledge/love-product-research/knowledgeIndex";
import { CH01_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter01Materials";
import { CH02_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter02Materials";
import { CH03_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter03Materials";
import { CH04_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter04Materials";
import { CH05_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter05Materials";
import { CH06_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter06Materials";
import { CH07_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter07Materials";
import { CH08_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter08Materials";
import { CH09_MATERIALS } from "@/lib/report-knowledge/love-product-research/chapter09Materials";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { afterAll, expect, it } from "vitest";
import { buildRelationshipProfiles, projectRelationshipView } from "@/lib/interpretation-v4/relationshipProductView";
import { fixtureInput, NARRATIVE_FIXTURES } from "../interpretation-v4/narrativeFixtures";
it("surveys actual natal and relationship Fusion evidence without inventing predicates",()=>{
 const rows=NARRATIVE_FIXTURES.map(f=>{const b=buildRelationshipProfiles(fixtureInput(f));expect(b.ok).toBe(true);if(!b.ok)return {id:f.id,ok:false};const view=projectRelationshipView(b.profiles);return {id:f.id,fixture:f,natalAtoms:b.profiles.myeongli.evidence.filter(a=>a.sourceType==="shinsal"||a.sourceType==="gwiin"||a.sourceType==="ten_god").map(a=>({id:a.id,key:a.sourceKey,tier:a.tier,metadata:a.metadata})),reinforce:b.profiles.fusion.reinforce.filter(x=>x.contexts.includes("love")).map(x=>({id:x.id,type:x.type,myeongli:x.myeongli,mbti:x.mbti})),tension:b.profiles.fusion.tensions.filter(x=>x.contexts.includes("love")).map(x=>({id:x.id,type:x.type,myeongli:x.myeongli,mbti:x.mbti})),fortunes:view.candidates.filter(c=>c.fortune).map(c=>({id:c.id,evidence:c.myeongliEvidenceIds,level:c.claimLevel}))};});
 if(process.env.LOVE_RESEARCH_SURVEY)writeFileSync(process.env.LOVE_RESEARCH_SURVEY,JSON.stringify(rows,null,2)+"\n");
},120000);
const doc="docs/validation/v4-love-marriage-child-product-knowledge-01/";
const json=<T>(f:string):T=>JSON.parse(readFileSync(doc+f,"utf8")) as T;
const sha=(v:string|Buffer)=>createHash("sha256").update(v).digest("hex");
const materials: readonly Material[]=[...CH01_MATERIALS,...CH02_MATERIALS,...CH03_MATERIALS,...CH04_MATERIALS,...CH05_MATERIALS,...CH06_MATERIALS,...CH07_MATERIALS,...CH08_MATERIALS,...CH09_MATERIALS];
const byId=new Map(materials.map(m=>[m.id,m])),sources=new Map(LOVE_SOURCE_REGISTRY.map(s=>[s.key,s])),facetIds=new Set(SEMANTIC_FACETS.map(f=>f.id));
const offline=(r:{connectedToRuntime:false;approvedForCustomer:false;existingScoreContribution:false;runtimeEvidenceIds:readonly[]})=>{expect([r.connectedToRuntime,r.approvedForCustomer,r.existingScoreContribution]).toEqual([false,false,false]);expect(r.runtimeEvidenceIds).toEqual([]);};
type Check<T extends true>=T;
const noIssuedEvidence:Check<ResearchId extends CalculatedEvidenceId?false:true>=true;
function walk(d:string):string[]{return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(d,e.name)):[resolve(d,e.name)]);}
function pointer(v:unknown,p:string):unknown{return p.split("/").slice(1).reduce<unknown>((v,k)=>v&&typeof v==="object"?(v as Record<string,unknown>)[k.replace(/~1/g,"/").replace(/~0/g,"~")]:undefined,v);}
it("preserves all 2354 tracked source, original research and fixture hashes",()=>{
 expect(noIssuedEvidence).toBe(true);const locks=json<Record<string,string>>("existing-files-preservation.json");expect(Object.keys(locks)).toHaveLength(2354);for(const[f,h]of Object.entries(locks))expect(sha(readFileSync(f)),f).toBe(h);
});
it.each(LOVE_READER_CHAPTERS)("$id preserves exact reader questions and four sentence role texts",c=>{
 const ch=LOVE_CHAPTER_RESEARCH.find(x=>x.chapterId===c.id)!;offline(ch);expect([ch.originalTitle,ch.domain]).toEqual([c.title,c.domain]);expect(ch.noOneToOneLoveQuestionMapping).toBe(true);
 for(const p of c.paragraphs){const address=`${c.id}.${p.id}`,pr=LOVE_PARAGRAPH_RESEARCH.find(x=>x.address===address)!;offline(pr);expect(pr.originalPurpose).toBe(p.purpose);expect(pr.materialIds.length).toBeGreaterThanOrEqual(4);expect(pr.loveQuestionRefs.length).toBeGreaterThan(0);for(const[i,role]of p.sentences.entries()){const r=LOVE_SENTENCE_ROLE_RESEARCH.find(x=>x.address===`${address}.S${i+1}`)!;offline(r);expect(r.originalRole).toBe(role);expect(r.materialIds).toEqual(pr.materialIds);expect(r.absentEvidence).toBe("withhold_not_fill");}}
});
it("covers 9 chapters, 36 paragraphs and 144 roles without counting contribution links as independent facts",()=>{
 expect(LOVE_CHAPTER_RESEARCH).toHaveLength(9);expect(LOVE_PARAGRAPH_RESEARCH).toHaveLength(36);expect(LOVE_SENTENCE_ROLE_RESEARCH).toHaveLength(144);expect(materials).toHaveLength(164);expect(new Set(materials.map(m=>m.coreMeaning)).size).toBe(164);expect(materials.flatMap(m=>Object.values(m.roleContributions))).toHaveLength(656);expect(materials.filter(m=>m.review==="held_source_or_conditions")).toHaveLength(1);expect(LOVE_KNOWLEDGE_INDEX).toHaveLength(164);
});
it.each(materials)("$id has distinct meaning, conditional scenes, source restrictions and substantive role contributions",m=>{
 offline(m);expect(m.productKey).toBe("love_marriage_child");expect(m.newCalculatedFacts).toBe(0);expect(m.inferenceOfPartnerOrChild).toBe(false);for(const t of [m.coreMeaning,m.positive,m.risk,m.factBomb,m.twist,m.repairAction,m.counterexample,m.distinctFromOtherParagraphs])expect(t.length).toBeGreaterThan(10);expect(m.risk).not.toBe(m.factBomb);expect(m.positive).not.toBe(m.twist);
 expect(m.scenes.length).toBeGreaterThan(0);for(const scene of m.scenes){expect(scene.status).toBe("fictional_not_customer_history");expect(scene.text).toMatch(/^가상/);}
 for(const[role,c]of Object.entries(m.roleContributions)){expect(c.originalRole).toBe(LOVE_SENTENCE_ROLE_RESEARCH.find(r=>r.address===`${m.address}.${role}`)!.originalRole);expect(c.knowledge.length).toBeGreaterThan(10);expect(c.roleKind).toBe("research_not_final_customer_sentence");}
 for(const f of m.semanticFacets){expect(facetIds.has(f.id)).toBe(true);expect(f.notIndependentEvidence).toBe(true);}for(const k of m.sourceKeys)expect(sources.has(k)).toBe(true);for(const status of m.relationshipStatuses)expect(RELATIONSHIP_STATUSES).toContain(status);
 expect(m.prerequisites.sourceOwner).toBe("same_person_only");expect(m.prerequisites.partnerFactsRequiredForCoupleClaims).toBe(true);expect(m.prerequisites.childFactsRequiredForChildClaims).toBe(true);expect(m.missingMbti).toBe("withhold_mbti_and_fusion_no_invented_type");expect(m.unknownBirthTime).toBe("no_synthetic_hour_recheck_actual_support");expect(m.disallowed).toHaveLength(4);
});
it.each(CH09_MATERIALS.filter(m=>m.paragraphId==="P3"||m.paragraphId==="P4"))("$id requires actual introduced compatible meanings in final recall",m=>{
 expect(m.researchKind).toBe("recall");expect(m.sourceKeys).toEqual([]);expect(m.precedingMeaningRefs.length).toBeGreaterThan(0);expect(m.precedingMeaningPolicy).toBe("actual_introduced_compatible_subset_only");for(const id of m.precedingMeaningRefs){const earlier=byId.get(id)!;expect(earlier).toBeDefined();expect(earlier.address<m.address).toBe(true);}
});
it("keeps CH09 P1/P2 eligible for separately verified positive sources, rather than incorrectly making all CH09 recall",()=>{
 expect(CH09_MATERIALS.filter(m=>["P1","P2"].includes(m.paragraphId)).every(m=>m.researchKind!=="recall"&&m.sourceKeys.length>0)).toBe(true);expect(CH09_MATERIALS.find(m=>m.id.endsWith(":held-hongyeom-expansion"))!.holdReason).toContain("보류");
});
type Locator={key:string;sourceId:string;file:string;pointer?:string;exportName?:string;index?:number;recordSha256:string;sourceFileSha256:string;raw:unknown;originalState:Record<string,unknown>};
it.each(json<Locator[]>("source-catalog.json"))("$sourceId resolves exactly to its original pointer, record and file hash",async s=>{
 const ref=sources.get(s.key)!;offline(ref);expect(ref.sourceFileSha256).toBe(sha(readFileSync(s.file)));expect(ref.originalState).toEqual(s.originalState);expect(ref.auditRef).toBe("source-catalog.json#"+s.key);let actual:unknown;
 if(s.pointer)actual=pointer(JSON.parse(readFileSync(s.file,"utf8").replace(/^\uFEFF/,"")),s.pointer);else{const sourceModule:unknown=await import(resolve(s.file));const exp=s.exportName!.split(".").reduce<unknown>((v,k)=>(v as Record<string,unknown>)[k],sourceModule);actual=s.index===undefined?exp:(exp as readonly unknown[])[s.index];}expect(actual).toEqual(s.raw);expect(sha(JSON.stringify(actual))).toBe(s.recordSha256);expect(ref.sourceKind).not.toMatch(/pair|temporal/);
});
it.each(LOVE_FACET_AUDIT)("$facet preserves the 15 original signed facets with expression, receipt and domain differences",a=>{
 offline(a);const old=LOVE_RELEASE_MATERIALS[a.facet];expect(a.originalHash).toBe(sha(JSON.stringify(old)));expect(a.existingAxes).toEqual(old.axes);expect(a.actualLabel).toBe(old.label);for(const t of [a.firstAndIntimateDifference,a.expressionAndReceipt,a.comfortableCondition,a.overuse,a.intentionAndImpact,a.repair,a.marriage,a.parenting,a.difference])expect(t.length).toBeGreaterThan(15);
});
it.each(LOVE_PARENTING_SOURCE_AUDIT)("$mbtiType preserves actual own-parenting strengths and risk traits without child transfer",a=>{
 offline(a);expect(a.sourceOwner).toBe("adult_own_parenting_only");expect(a.childDomainTransferAllowed).toBe(false);expect(a.childFactsProvided).toBe(false);expect(a.originalStrengthsHash).toBe(sha(JSON.stringify(LOVE_PARENTING_STRENGTHS[a.mbtiType])));expect(a.originalRiskHash).toBe(sha(JSON.stringify(LOVE_PARENTING_RISK[a.mbtiType])));expect(a.riskSource.traitId).toBe(LOVE_PARENTING_RISK_TRAITS[a.mbtiType]);
 for(const s of [...a.strengthSources,a.riskSource]){expect(a.allParentingTraits).toContain(s.traitId);expect(sources.get(s.sourceKey)!.sourceId).toBe(`mbti:${a.mbtiType}:traits:parenting:${s.traitId}`);}expect(a.materialRefs.length).toBeGreaterThan(0);for(const id of a.materialRefs)expect(byId.get(id)!.chapterId).toBe("CH08");
});
it("audits all sixteen own-parenting types and every actual status enum",()=>{
 expect(LOVE_PARENTING_SOURCE_AUDIT.map(x=>x.mbtiType).sort()).toEqual(MBTI_TYPES.filter(t=>t!=="").sort());expect(LOVE_FACET_AUDIT.map(x=>x.facet).sort()).toEqual(Object.keys(LOVE_RELEASE_MATERIALS).sort());expect(LOVE_RELATIONSHIP_STATUS_RESEARCH.map(x=>x.actualValue).sort()).toEqual([...RELATIONSHIP_STATUSES].sort());
});
it.each(LOVE_RELATIONSHIP_STATUS_RESEARCH)("status '$actualValue' changes questions and scenes without scoring",s=>{
 offline(s);expect(s.statusIsScore).toBe(false);expect(s.originalContextHash).toBe(sha(JSON.stringify(LOVE_RELEASE_CONTEXT[s.actualValue])));expect(s.materialRefs).toHaveLength(4);for(const id of s.materialRefs)expect(byId.get(id)!.relationshipStatuses).toContain(s.actualValue);for(const t of [s.currentQuestion,s.observation,s.expression,s.pace,s.practicalAction,s.familyMoneyTime,s.prohibited])expect(t.length).toBeGreaterThan(10);
});
it.each(LOVE_CONFLICT_REPAIR_RESEARCH)("$id separates intention, action, possible interpretation, escalation and practical repair limits",r=>{
 offline(r);expect(byId.has(r.materialRef)).toBe(true);expect(r.interpretationStatus).toBe("conditional_not_known_partner_fact");for(const t of [r.intention,r.possibleOwnAction,r.possibleRecipientInterpretation,r.escalationCondition,r.repeatedBurden,r.firstClarification,r.adjustedAction,r.whenRepairDoesNotWork,r.safetyBoundary])expect(t.length).toBeGreaterThan(8);
});
it("retains explicit reuse, safety, deferred sources and source-scope policies",()=>{
 expect(LOVE_SEMANTIC_REUSE_RESEARCH).toHaveLength(14);expect(LOVE_REJECTED_RESEARCH).toHaveLength(24);for(const r of LOVE_SEMANTIC_REUSE_RESEARCH){offline(r);expect(r.independentFactsAdded).toBe(0);expect(new Set(r.distinctQuestions).size).toBe(r.distinctQuestions.length);}for(const r of LOVE_REJECTED_RESEARCH)offline(r);expect(LOVE_REJECTED_RESEARCH.filter(r=>r.status==="held")).toHaveLength(4);
});
const observations:{letter:string;variant:number;ok:boolean;payload:unknown;error?:unknown;publishedEdition?:string;chapterCount?:number;paragraphCount?:number;bodyLength?:number;hardErrors?:string[];qualityIssues?:string[];shortages?:string[];hashes?:Record<string,string>;paragraphs?:{id:string;text:string}[];sourceAtoms?:unknown;fusions?:unknown}[]=[];
afterAll(()=>{if(process.env.LOVE_RESEARCH_CAPTURE)writeFileSync(process.env.LOVE_RESEARCH_CAPTURE,JSON.stringify(observations,null,2)+"\n");});
it.each(LOVE_INPUT_CASES)("case $letter executes the unchanged actual paid offline generator and checks its stated predicate",async c=>{
 offline(c);for(const[i,v]of c.variants.entries()){
  const f=NARRATIVE_FIXTURES[v.fixtureIndex],unknown=v.unknownTime;const payload={productKey:"love_marriage_child",productSlug:"love-marriage-child",person:{name:"검수가상"+c.letter,birthDate:f.date,birthTime:unknown?"":f.time??"",gender:f.gender,mbtiType:v.mbtiType,birthTimeUnknown:unknown,birthTimePrecision:unknown?"unknown":"exact",approximateBirthTimeSlot:""},userContext:{...f.context,relationshipStatus:v.relationshipStatus,focusAreas:[]},productOptions:{contentVersion:"v3"}};
  const generated=await generateV4ShadowReport(payload,{evaluatedAt:"2026-10-12T12:00:00+09:00"});
  if(!generated.ok){observations.push({letter:c.letter,variant:i,ok:false,payload,error:generated.error});expect(generated.ok,JSON.stringify(generated.error)).toBe(true);continue;}
  expect(generated.externalCalls).toEqual([]);const e=generated.evidencePacket as V4RuntimeEvidence;expect(e.composition.product).toBe("love_marriage_child");const r=e.composition.result as LoveProduct,d=r.integration.readerEdition;
  expect(validateV4Publication("love_marriage_child",generated.draft,e)).toEqual({ok:true,errors:[]});const book=projectBook(e);expect(book).not.toBeNull();expect(d.chapters.map(ch=>ch.id)).toEqual(LOVE_READER_CHAPTERS.map(ch=>ch.id));expect(r.integration.readerValidation.hardErrors).toEqual([]);
  if(!v.mbtiType){expect(d.chapters.flatMap(ch=>ch.paragraphs.flatMap(p=>p.sentences)).every(s=>s.mbtiSourceNodeIds.length===0)).toBe(true);expect(JSON.stringify(r.narrative)).not.toMatch(/\b[EI][SN][TF][JP]\b/);}
  if(unknown)expect(d.chapters.flatMap(ch=>ch.paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.evidenceIds)))).not.toContainEqual(expect.stringMatching(/(?:natal:hour:|ten-god:hour:)/));
  let sourceAtoms:unknown=undefined,fusions:unknown=undefined;
  if(c.requiredPredicate!=="none"){
   const b=buildRelationshipProfiles(fixtureInput({...f,time:unknown?undefined:f.time,mbti:v.mbtiType||null,context:{...f.context,relationshipStatus:v.relationshipStatus}}));expect(b.ok).toBe(true);if(b.ok){sourceAtoms=b.profiles.myeongli.evidence.filter(a=>["shinsal","gwiin","ten_god"].includes(a.sourceType));fusions={reinforce:b.profiles.fusion.reinforce.filter(x=>x.contexts.includes("love")),tension:b.profiles.fusion.tensions.filter(x=>x.contexts.includes("love"))};
    if(c.requiredPredicate==="actual_natal")expect(b.profiles.myeongli.evidence.some(a=>a.sourceType==="ten_god"&&a.id.startsWith("natal:"))).toBe(true);
    if(c.requiredPredicate==="unknown_hour")expect(b.profiles.myeongli.evidence.some(a=>/(?:natal:hour:|ten-god:hour:)/.test(a.id))).toBe(false);
    if(c.requiredPredicate==="reinforce_love")expect(b.profiles.fusion.reinforce.some(x=>x.contexts.includes("love"))).toBe(true);
    if(c.requiredPredicate==="tension_love")expect(b.profiles.fusion.tensions.some(x=>x.contexts.includes("love"))).toBe(true);
    if(c.requiredPredicate==="missing_mbti"){expect(b.profiles.mbti.sourceNodes).toEqual([]);expect(b.profiles.fusion.reinforce).toEqual([]);expect(b.profiles.fusion.tensions).toEqual([]);}
    if(c.requiredPredicate==="parenting_own")expect(b.profiles.mbti.sourceNodes.some(n=>n.sourceDomain==="PARENTS")).toBe(true);
    if(c.requiredPredicate==="no_romantic_marker")expect(b.profiles.myeongli.evidence.some(a=>["DOHWA","HONGYEOM"].includes(a.sourceKey))).toBe(false);
    if(c.requiredPredicate==="actual_dohwa")expect(b.profiles.myeongli.evidence.some(a=>a.sourceKey==="DOHWA"&&a.id==="supplement:marker:DOHWA")).toBe(true);
   }
  }
  observations.push({letter:c.letter,variant:i,ok:true,payload,publishedEdition:r.integration.publishedEdition,chapterCount:d.chapters.length,paragraphCount:d.chapters.reduce((n,ch)=>n+ch.paragraphs.length,0),bodyLength:d.bodyLength,hardErrors:r.integration.readerValidation.hardErrors,qualityIssues:r.integration.readerValidation.qualityIssues,shortages:d.shortages,hashes:{calculation:v4Digest(e.calculations),fullEvidence:v4Digest(e),narrative:v4Digest(r.narrative),integration:v4Digest(r.integration),personal:r.integration.personalDigest,book:v4Digest(book)},paragraphs:d.chapters.flatMap(ch=>ch.paragraphs.map(p=>({id:p.id,text:p.text}))),sourceAtoms,fusions});
 }
},120000);
it("status-only S variants preserve natal, MBTI and Fusion profile while changing context; T uses real different inputs",()=>{
 const s=observations.filter(x=>x.letter==="S"),t=observations.filter(x=>x.letter==="T");expect(s).toHaveLength(6);expect(new Set(s.map(x=>x.hashes?.calculation)).size).toBe(1);expect(new Set(s.map(x=>x.hashes?.personal)).size).toBe(1);expect(new Set(s.map(x=>x.hashes?.narrative)).size).toBe(6);expect(t).toHaveLength(2);expect(new Set(t.map(x=>x.hashes?.calculation)).size).toBe(2);expect(new Set(t.map(x=>x.hashes?.narrative)).size).toBe(2);
});
it("keeps research outside runtime imports, selectors, barrels and executable producers",()=>{
 for(const f of walk("src").filter(f=>/\.(ts|tsx)$/.test(f))){const code=readFileSync(f,"utf8");if(f.includes("/love-product-research/")){expect(code).not.toMatch(/^import(?! type)[\s{]/m);expect(code).not.toMatch(/export (?:async )?function|\b(?:fetch|require|setTimeout|setInterval)\s*\(/);expect(f).not.toMatch(/\/index\.ts$/);}else expect(code,f).not.toContain("love-product-research/");}
});
