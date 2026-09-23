import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildOpenAILoveMarriageChildReportWriterMessages } from "../../../src/lib/report-generation/openaiLoveMarriageChildReportWriterPrompt";
import { generateLoveMarriageChildReportDraft } from "../../../src/lib/report-generation/openaiLoveMarriageChildReportWriter";
import { validateLoveMarriageChildReportDraft } from "../../../src/lib/report-generation/loveMarriageChildReportDraftValidator";
import type { LoveMarriageChildReportDraft } from "../../../src/lib/report-generation/loveMarriageChildReportDraftTypes";
import type { LoveMarriageChildReportEvidencePacket } from "../../../src/lib/report-knowledge/loveMarriageChildReportTypes";
import { getMbtiRelationshipPair, getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { LoveMarriageChildReportView } from "../../../src/app/reports/[reportId]/LoveMarriageChildReportView";
import { LoveMarriageChildReportManseRyeokTable, LoveMarriageChildReportMbtiProfileTable } from "../../../src/components/report-tables";
import { productBridgeScenes } from "../../../src/lib/report-knowledge/bridge/interactionScenes";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";

const cases = [
  {name:"가람",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"INTP",status:"single",before:8299},
  {name:"나래",birthDate:"1980-03-09",birthTime:"13:30",gender:"FEMALE",mbtiType:"ENFP",status:"single",before:8605},
  {name:"지민",birthDate:"2001-06-22",birthTime:"13:30",gender:"MALE",mbtiType:"ISFJ",status:"some",before:8586},
  {name:"서진",birthDate:"1999-07-31",birthTime:"13:30",gender:"MALE",mbtiType:"ENTJ",status:"dating",before:9174},
  {name:"유진",birthDate:"1988-10-17",birthTime:"08:30",gender:"FEMALE",mbtiType:"INFJ",status:"marriage_preparing",before:8667},
  {name:"다온",birthDate:"1990-02-15",birthTime:"10:15",gender:"FEMALE",mbtiType:"ESFP",status:"married",before:8597},
  {name:"수연",birthDate:"1988-10-17",birthTime:"08:30",gender:"FEMALE",mbtiType:"",status:"single",before:6826},
  {name:"하늘",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"ISTJ",status:"",before:8476},
];
const disabled = {enabled:false as const,reason:"flag_disabled" as const};
function payload(p=cases[0]) {
  return {productKey:"love_marriage_child",productSlug:"love-marriage-child",person:{name:p.name,birthDate:p.birthDate,birthTime:p.birthTime,gender:p.gender,mbtiType:p.mbtiType,birthTimeUnknown:false,approximateBirthTimeSlot:""},userContext:{relationshipStatus:p.status,jobStatus:"employee",detailJob:"기획",focusAreas:[]},productOptions:{}};
}
function visible(html:string) {return html.replace(/<[^>]+>/g," ").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();}
async function sample(person=cases[0]) {
  const p=payload(person); const r=await generateProductReport(p,disabled,"deterministic_fallback");
  if(!r.ok) throw new Error(r.error.message);
  const draft=r.draft as LoveMarriageChildReportDraft,evidence=r.evidencePacket as LoveMarriageChildReportEvidencePacket;
  expect(validateProductPublication(p.productKey,draft,evidence,p)).toEqual({ok:true,errors:[]});
  expect(r.externalCalls).toEqual([]);
  const html=renderToStaticMarkup(createElement(LoveMarriageChildReportView,{draft,evidencePacket:evidence,manseRyeokTable:createElement(LoveMarriageChildReportManseRyeokTable,{evidence}),mbtiProfileTable:createElement(LoveMarriageChildReportMbtiProfileTable,{evidence})}));
  return {draft,evidence,html,text:visible(html)};
}
beforeEach(()=>{vi.useFakeTimers();vi.setSystemTime(new Date("2026-09-23T03:00:00Z"));});
afterEach(()=>{expect(fetch).not.toHaveBeenCalled();vi.useRealTimers();});

describe("love relationship quality v2",()=>{
  it.each(cases)("$name / $status: fallback → publish → real SSR, no content loss",async person=>{
    const r=await sample(person), selection=r.evidence.relationshipReading!;
    expect(r.text.length).toBeGreaterThanOrEqual(person.before);
    expect(r.text).toContain(selection.question);
    expect(selection.status).toBe(person.status || "unknown");
    expect(r.text).not.toMatch(/writer|fallback|placeholder|천생연분|INTJ·INTP·ENFP·ISFP/i);
    const present=new Set<string>(r.evidence.sajuBasis.loveTenGodSignals.map(s=>s.tenGod));
    for(const god of ["비견","겁재","식신","상관","편재","정재","편관","정관","편인","정인"])
      if(!present.has(god)) expect(JSON.stringify(r.draft)).not.toContain(god);
    for(const scene of selection.scenes){
      expect(productBridgeScenes(r.evidence.bridgeEvidence)).toContainEqual(scene);
      expect(JSON.stringify(r.draft).split(scene.scene).length-1).toBe(1);
    }
    if(!person.mbtiType){
      expect(selection.partnerExamples).toEqual([]);expect(selection.traitIds).toEqual([]);expect(selection.scenes).toEqual([]);
      expect(r.text).not.toMatch(/\b[IE][NS][TF][JP]\b/);
      expect(r.text).toContain("유형이나 말투를 추정하지 않습니다");
    }
  });
  it("every original input status has a distinct question; status changes do not change natal or MBTI facts",async()=>{
    const results=await Promise.all(RELATIONSHIP_STATUSES.map(status=>sample({...cases[0],status})));
    expect(new Set(results.map(r=>r.draft.headline)).size).toBe(6);
    for(const r of results){expect(r.evidence.sajuBasis).toEqual(results[0].evidence.sajuBasis);expect(r.evidence.mbtiBasis).toEqual(results[0].evidence.mbtiBasis);expect(r.evidence.bridgeEvidence).toEqual(results[0].evidence.bridgeEvidence);}
    expect(results[2].draft.loveStyle.body).toContain("아직 합의되지 않은 관계");
    expect(results[4].draft.marriageRhythm.body).toContain("예식을 잘 치르는 능력");
    expect(results[5].draft.marriageRhythm.body).toContain("이미 해 오던 방식");
    expect(results[3].evidence.relationshipReading!.partnerExamples).toEqual([]);
  });
  it("SOLO examples preserve source direction, explicit source lists and actual natal references",async()=>{
    for(const person of cases.slice(0,3)){
      const {evidence,draft}=await sample(person);const e=evidence.relationshipReading!,source=getMbtiSourceProfile(person.mbtiType)!;
      expect(e.partnerExamples.map(p=>p.tier)).toEqual(["comfort","attraction","adjustment"]);
      expect(new Set(e.partnerExamples.map(p=>p.exampleType)).size).toBe(3);
      for(const p of e.partnerExamples){
        expect(p.sourceType).toBe(person.mbtiType);
        expect(p.pair).toEqual(getMbtiRelationshipPair(person.mbtiType,p.exampleType));
        expect(p.tier==="adjustment"?source.relationshipHints!.challengingTypes:source.relationshipHints!.comfortableTypes).toContain(p.exampleType);
        expect(p.evidenceIds[0]).toSatisfy((id:string)=>e.factIds.includes(id));
        expect(draft.attractionPattern.body).toContain(p.sajuCriterion);
        expect(draft.attractionPattern.body).toContain(p.pair.marriagePattern);
      }
      for(const id of e.traitIds){const [,type,,area,traitId]=id.split(":");expect(type).toBe(person.mbtiType);expect(source.traits?.[area as keyof typeof source.traits]?.some(t=>t.id===traitId)).toBe(true);}
    }
  });
  it("MBTI-only changes preserve Saju and change expression/parenting/pair selection",async()=>{
    const a=await sample(cases[0]),b=await sample({...cases[0],mbtiType:"ISFJ"}),c=await sample({...cases[0],mbtiType:""});
    for(const r of [b,c])expect(r.evidence.sajuBasis).toEqual(a.evidence.sajuBasis);
    expect(a.draft.parentMode.body).not.toBe(b.draft.parentMode.body);
    expect(a.evidence.relationshipReading!.partnerExamples).not.toEqual(b.evidence.relationshipReading!.partnerExamples);
    expect(a.draft.parentMode.body).toContain("개방적 부모");expect(b.draft.parentMode.body).toContain("구조화된 가정");
  });
  it("uses both supported agreement and tension scenes without fabricating interactions",async()=>{
    const rs=await Promise.all([...cases, {...cases[0],mbtiType:"INTJ"}].map(p=>sample(p)));
    const types=rs.flatMap(r=>r.evidence.relationshipReading!.scenes.map(s=>s.interactionType));
    expect(types).toContain("agreement");expect(types).toContain("tension");
  });
  it("writer receives the same selected evidence, preserves a valid narrative and rejects invented type examples",async()=>{
    const {draft,evidence}=await sample();
    const messages=buildOpenAILoveMarriageChildReportWriterMessages({evidencePacket:evidence});
    const prompt=JSON.parse(messages.user.split("Evidence packet:\n\n")[1]);
    expect(prompt.relationshipReading).toEqual(evidence.relationshipReading);
    expect(prompt.mbtiBasis.growth).toEqual(evidence.relationshipReading!.recoveryTraits);
    expect(prompt.mbtiBasis.growth).toEqual([]); // INTP growth assets are not tagged for this relationship context.
    const fetchImpl=vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({output_text:JSON.stringify(draft)})));
    const result=await generateLoveMarriageChildReportDraft({evidencePacket:evidence,config:{enabled:true,apiKey:"test-only",model:"test-model",fetchImpl}});
    expect(result.draft).toEqual(draft);expect(fetchImpl).toHaveBeenCalledTimes(1);
    const allowed=new Set([evidence.personContext.mbtiType,...evidence.relationshipReading!.partnerExamples.map(p=>p.exampleType)]);
    const unselected=["ENTJ","ENFP","INFJ","ISTJ","ESTP"].find(t=>!allowed.has(t))!;
    const bad={...draft,attractionPattern:{...draft.attractionPattern,body:`${unselected}만 당신의 상대입니다.`}};
    expect(validateLoveMarriageChildReportDraft(bad,evidence).errors).toContain("LOVE_MARRIAGE_CHILD_UNSUPPORTED_PARTNER_TYPE");
    expect(validateProductPublication("love_marriage_child",bad,evidence,payload()).ok).toBe(false);
    const malformed=vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({output_text:"{}"})));
    await expect(generateLoveMarriageChildReportDraft({evidencePacket:evidence,config:{enabled:true,apiKey:"test-only",model:"test-model",fetchImpl:malformed}})).rejects.toMatchObject({code:"OPENAI_LOVE_MARRIAGE_CHILD_REPORT_WRITER_VALIDATION_FAILED"});
    expect((await sample()).draft).toEqual(draft);
  });
});
