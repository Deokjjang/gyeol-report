import {readFileSync,writeFileSync} from "node:fs";
import {expect,it} from "vitest";
import {afterAll} from "vitest";
import {generateV4ShadowReport} from "@/lib/interpretation-v4/runtimeShadow";
import {v4Digest,validateV4Publication,type V4RuntimeEvidence} from "@/lib/interpretation-v4/runtimeProjection";
import {projectBook} from "@/app/dev/book-preview/bookProjection";
import type {CompatibilityProduct} from "@/lib/interpretation-v4/compatibilityProductAdapter";
import type {CompatibilityReportInputPayload} from "@/lib/report-generation/reportInputTypes";
import {getCrossTenGodRelation} from "@/lib/report-knowledge/compatibilityRelationRules";
type CaseRow={letter:string;description:string;variants:readonly CompatibilityReportInputPayload[];requiredPredicate:string};
const actualCases=JSON.parse(readFileSync("docs/validation/v4-compatibility-marriage-product-knowledge-01/input-cases.json","utf8")) as CaseRow[];
const baseline=JSON.parse(readFileSync("docs/validation/v4-compatibility-marriage-product-knowledge-01/baseline-generation-digests.json","utf8")) as Observation[];
type Observation={letter:string;variant:number;ok:boolean;payload:CompatibilityReportInputPayload;error?:unknown;publishedEdition?:string;chapterCount?:number;paragraphCount?:number;bodyLength?:number;hardErrors?:readonly string[];qualityIssues?:readonly string[];shortages?:readonly string[];hashes?:Record<string,string>;paragraphs?:{id:string;text:string}[];pair?:unknown;relations?:unknown;directions?:unknown;individualDigests?:unknown;readerEditorial?:unknown;compatibilityIndex?:unknown};
const observations:Observation[]=[];
afterAll(()=>{if(process.env.COMPATIBILITY_RESEARCH_CAPTURE)writeFileSync(process.env.COMPATIBILITY_RESEARCH_CAPTURE,JSON.stringify(observations,null,2)+"\n");});
it.each(actualCases)("actual offline $letter: $description preserves source ownership and generation",async c=>{
 for(const [i,payload]of c.variants.entries()){
  const g=await generateV4ShadowReport(payload,{evaluatedAt:"2026-10-12T12:00:00+09:00"});
  if(!g.ok){observations.push({letter:c.letter,variant:i,ok:false,payload,error:g.error});expect(g.ok,JSON.stringify(g.error)).toBe(true);continue;}
  expect(g.externalCalls).toEqual([]);expect(Object.keys(payload).sort()).toEqual(["compatibilityRoleVersion","personA","personB","productKey","productSlug","relationshipType"].sort());const e=g.evidencePacket as V4RuntimeEvidence;expect(e.composition.product).toBe("saju_mbti_compatibility");
  const r=e.composition.result as CompatibilityProduct,ev=r.evidence,d=r.integration.readerEdition;
  expect(r.ok).toBe(true);expect(ev.category).toBe(payload.relationshipType);expect(ev.persons.personA.name).toBe(payload.personA.name);expect(ev.persons.personB.name).toBe(payload.personB.name);
  const normalized=e.input;expect(normalized.kind).toBe("compatibility");if(normalized.kind!=="compatibility")continue;
  const saju=e.calculations;expect("personA"in saju).toBe(true);if(!("personA"in saju))continue;
  for(const[subject,target,key]of [["personA","personB","aToB"],["personB","personA","bToA"]]as const){const direction=ev.directions[key];expect(direction.subjectPerson).toBe(ev.persons[subject].personId);expect(direction.targetPerson).toBe(ev.persons[target].personId);expect(direction.receivedTenGod).toEqual(getCrossTenGodRelation({viewerDayStem:saju[target].pillars.day.stem,targetDayStem:saju[subject].pillars.day.stem})??null);if(!payload[subject].mbtiType||!payload[target].mbtiType)expect(direction.mbtiPair).toBeNull();}
  for(const relation of ev.relations){expect(["six_harmony","three_harmony","half_harmony","clash","harm"]).toContain(relation.kind);expect(new Set(relation.refs.map(ref=>ref.person)).size).toBe(2);for(const ref of relation.refs){expect(saju[ref.person].pillars[ref.position]?.branch).toBe(ref.branch);if(payload[ref.person].birthTimeUnknown)expect(ref.position).not.toBe("hour");}}
  const kinds=ev.relations.map(r=>r.kind),harmony=kinds.some(k=>["six_harmony","three_harmony","half_harmony"].includes(k));
  switch(c.requiredPredicate){case"same_ten_god":expect(ev.directions.aToB.receivedTenGod?.tenGod).toBe(ev.directions.bToA.receivedTenGod?.tenGod);break;case"different_ten_god":expect(ev.directions.aToB.receivedTenGod?.tenGod).not.toBe(ev.directions.bToA.receivedTenGod?.tenGod);break;case"harmony":expect(harmony).toBe(true);break;case"clash":expect(kinds).toContain("clash");break;case"both_relations":expect(harmony).toBe(true);expect(kinds).toContain("clash");break;case"no_cross_branch":expect(ev.relations).toEqual([]);expect(ev.directions.aToB.receivedTenGod).not.toBeNull();break;case"unsupported_reference_only":expect(ev.unsupportedCrossRelations).toContain("wonjin");expect(ev.relations).toEqual([]);break;case"existing_fallback":expect(r.integration.publishedEdition).toBe("compatibility-product-13d-7b-v1");break;case"no_pair_repair":expect(ev.directions.aToB.mbtiPair).toBeNull();expect(ev.directions.bToA.mbtiPair).toBeNull();break;case"research_only_wonjin":case"withhold_mismatched_relation":expect(ev.relations.some(r=>r.kind==="harm"&&r.branches.includes("子")&&r.branches.includes("未"))).toBe(true);expect(ev.unsupportedCrossRelations).toContain("wonjin");break;case"rich_sources":expect(ev.relations.filter(r=>["six_harmony","three_harmony","half_harmony"].includes(r.kind)).length).toBeGreaterThan(1);expect(ev.persons.personA.materials.selected.length).toBeGreaterThan(0);expect(ev.persons.personB.materials.selected.length).toBeGreaterThan(0);break;}
  expect(validateV4Publication(e.productType,g.draft,e).ok).toBe(true);const book=projectBook(e);expect(book).toBeTruthy();expect(d.chapters).toHaveLength(9);
  observations.push({letter:c.letter,variant:i,ok:true,payload,publishedEdition:r.integration.publishedEdition,chapterCount:d.chapters.length,paragraphCount:d.chapters.reduce((n,ch)=>n+ch.paragraphs.length,0),bodyLength:d.bodyLength,hardErrors:r.integration.readerValidation.hardErrors,qualityIssues:r.integration.readerValidation.qualityIssues,shortages:d.shortages,hashes:{calculation:v4Digest(e.calculations),fullEvidence:v4Digest(e),narrative:v4Digest(r.narrative),integration:v4Digest(r.integration),personA:r.integration.individualDigests.personA,personB:r.integration.individualDigests.personB,book:v4Digest(book)},paragraphs:d.chapters.flatMap(ch=>ch.paragraphs.map(p=>({id:p.id,text:p.text}))),readerEditorial:r.integration.readerEditorial,compatibilityIndex:r.compatibilityIndex,pair:r.integration.pair,relations:ev.relations,directions:ev.directions,individualDigests:r.integration.individualDigests});
  expect(observations.at(-1)?.hashes).toEqual(baseline.find(r=>r.letter===c.letter&&r.variant===i)?.hashes);
  expect(r.integration.publishedEdition).toBe(baseline.find(r=>r.letter===c.letter&&r.variant===i)?.publishedEdition);
  if(c.requiredPredicate==="replay"&&i===1)expect(observations.at(-1)?.hashes).toEqual(observations.at(-2)?.hashes);
 }
},120000);
it("compares whole-role swap versus name-only swap using actual canonical evidence and independent profiles",()=>{
 const u=observations.filter(r=>r.letter==="R"),v=observations.filter(r=>r.letter==="Q");expect(u).toHaveLength(2);expect(v).toHaveLength(2);
 expect(u[0].hashes?.personA).toBe(u[1].hashes?.personA);expect(u[0].hashes?.personB).toBe(u[1].hashes?.personB);
 expect(v[0].hashes?.personA).toBe(v[1].hashes?.personB);expect(v[0].hashes?.personB).toBe(v[1].hashes?.personA);
 type D={aToB:{subjectPerson:string;targetPerson:string;receivedTenGod:unknown};bToA:{subjectPerson:string;targetPerson:string;receivedTenGod:unknown}};
 const ua=u[0].directions as D,ub=u[1].directions as D,va=v[0].directions as D,vb=v[1].directions as D;
 expect(ua.aToB.subjectPerson).not.toBe(ub.aToB.subjectPerson);expect(ua.aToB.receivedTenGod).toEqual(ub.aToB.receivedTenGod);
 expect(va.aToB).toEqual(vb.bToA);expect(va.bToA).toEqual(vb.aToB);
 expect(v[0].relations).toEqual((v[1].relations as {refs:{person:string}[]}[]).map(r=>({...r,refs:r.refs.map(ref=>({...ref,person:ref.person==="personA"?"personB":"personA"}))})));
});

it("MBTI-only change keeps natal calculations; category-only change keeps both individual profiles and canonical relations",()=>{
 const s=observations.filter(r=>r.letter==="S"),t=observations.filter(r=>r.letter==="T");
 expect(s).toHaveLength(2);expect(t).toHaveLength(2);
 expect(s[0].hashes?.calculation).toBe(s[1].hashes?.calculation);
 expect(s[0].hashes?.personA).not.toBe(s[1].hashes?.personA);
 expect(s[0].hashes?.personB).toBe(s[1].hashes?.personB);
 expect(t[0].hashes?.calculation).toBe(t[1].hashes?.calculation);
 expect(t[0].individualDigests).toEqual(t[1].individualDigests);
 expect(t[0].relations).toEqual(t[1].relations);
 expect(t[0].directions).toEqual(t[1].directions);
 expect(t[0].hashes?.narrative).not.toBe(t[1].hashes?.narrative);
});
