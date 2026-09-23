import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MajorFortuneReportView } from "../../../src/app/reports/[reportId]/MajorFortuneReportView";
import { buildMajorFortuneDecadeReading } from "../../../src/lib/report-knowledge/majorFortuneDecadeReading";
import { generateMajorFortuneProductDraft } from "../../../src/lib/report-generation/majorFortuneGenerationHandler";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const customers = [
  {name:"A",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"ENTJ",year:2026,ganji:"壬寅",start:2017,position:10,beforeChars:12324},
  {name:"B",birthDate:"1980-05-15",birthTime:"09:30",gender:"FEMALE",mbtiType:"ISFJ",year:2026,ganji:"丙子",start:2023,position:4,beforeChars:11654},
  {name:"C",birthDate:"2001-08-20",birthTime:"16:20",gender:"MALE",mbtiType:"ENFP",year:2026,ganji:"癸巳",start:2025,position:2,beforeChars:12817},
  {name:"D",birthDate:"1996-12-06",birthTime:"14:15",gender:"FEMALE",mbtiType:"",year:2026,ganji:"丙申",start:2026,position:1,beforeChars:11295},
  {name:"E",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"INTP",year:2035,ganji:"癸卯",start:2027,position:9,beforeChars:11916},
] as const;
function inputFor(c: (typeof customers)[number]): SinglePersonGenerationInput {
  return {kind:"majorFortune",productKey:"major_fortune",productSlug:"major-fortune",person:{name:c.name,birthDate:c.birthDate,birthTime:c.birthTime,gender:c.gender,mbtiType:c.mbtiType,birthTimeUnknown:false,approximateBirthTimeSlot:"",calendarType:"solar",timezone:"Asia/Seoul"},userContext:{relationshipStatus:"single",jobStatus:"employee",detailJob:"서비스 기획자",focusAreas:["직업","돈"]},productOptions:{}};
}
async function generate(input = inputFor(customers[0]), year = 2026) {
  const r = await generateMajorFortuneProductDraft(input,{now:()=>new Date(`${year}-09-21T03:00:00Z`)});
  expect(r.ok,JSON.stringify(r.ok ? null : r)).toBe(true);
  if(!r.ok) throw new Error("deterministic generation failed");
  return r;
}
function rendered(r: Awaited<ReturnType<typeof generate>>) {
  return renderToStaticMarkup(createElement(MajorFortuneReportView,{draft:r.draft,evidencePacket:r.evidencePacket})).replace(/<[^>]+>/gu," ").replace(/&[^;]+;/gu," ").replace(/\s+/gu," ");
}
function longSentences(s:string) {
  return s.split(/(?<=[.!?。！？])\s+|\n+/u).map(x=>x.replace(/[“”"']/gu,"").replace(/[.!?。！？]+$/u,"").trim()).filter(x=>x.length>=40);
}
const fetchSpy = vi.fn(async()=>{throw new Error("external calls forbidden");});
beforeEach(()=>{vi.stubGlobal("fetch",fetchSpy);fetchSpy.mockClear();});
afterEach(()=>{expect(fetchSpy).not.toHaveBeenCalled();vi.unstubAllGlobals();});

describe("ten-year major fortune evidence and density",()=>{
  it.each(customers)("$name: accurate cycle, differentiated years, publish and SSR without losing information",async c=>{
    const r=await generate(inputFor(c),c.year);const p=r.evidencePacket;const reading=p.decadeReading!;
    expect(p.currentCycle).toMatchObject({ganji:c.ganji,startYear:c.start,endYear:c.start+9});
    expect(reading.position).toContain(`${c.position}년차`);
    expect(reading.years.map(y=>y.year)).toEqual(Array.from({length:10},(_,i)=>c.start+i));
    expect(new Set(reading.years.map(y=>y.detail.coreFlow)).size).toBe(10);
    const deep=reading.years.filter(y=>y.importance==="important"), ordinary=reading.years.filter(y=>y.importance!=="important");
    expect(deep.length).toBeGreaterThanOrEqual(2);expect(deep.length).toBeLessThanOrEqual(4);
    expect(Math.min(...deep.map(y=>Object.values(y.detail).join("").length))).toBeGreaterThan(Math.max(...ordinary.map(y=>Object.values(y.detail).join("").length)));
    for(const y of reading.years){
      expect(y.detail.coreFlow).toContain(y.ganji);expect(y.detail.coreFlow).toContain(y.tenGod);
      expect(y.reasons.every(reason=>y.evidenceIds.includes(reason.evidenceId))).toBe(true);
      expect(y.cycleRelations.every(relation=>relation.affectedPillars===undefined)).toBe(true);
      if(y.importance==="important") {
        expect(y.reasons.some(reason=>reason.priority>=3)).toBe(true);
        expect(y.detail.realWorldScenes).toMatch(/일에서는[\s\S]+돈에서는[\s\S]+관계에서는/u);
      }
    }
    expect(reading.phases.map(p=>p.phase)).toEqual(["early","middle","late"]);
    expect(reading.phases.every(phase=>reading.years.some(y=>phase.body.includes(y.ganji)))).toBe(true);
    expect(reading.domains.map(d=>d.key)).toEqual(["work","money","relationship"]);
    expect(reading.factors.length).toBeGreaterThanOrEqual(2);expect(reading.factors.length).toBeLessThanOrEqual(4);
    expect(validateProductPublication("major_fortune",r.draft,p)).toEqual({ok:true,errors:[]});
    const html=rendered(r), sentences=longSentences(html);
    expect(html.length).toBeGreaterThanOrEqual(c.beforeChars);
    expect(sentences.length-new Set(sentences).size).toBeLessThanOrEqual(5);
    expect(html).not.toMatch(/반복\s*압박\s*\d+번째|\d+번째\s*점검|앞으로 10년|fallback|placeholder|writer|validator/u);
    for(const title of ["이 10년의 핵심 변화","현재 위치와 이전 대운의 차이","구간마다 달라지는 질문","이 10년의 일과 역할","돈의 흐름과 감당할 범위","관계에서 달라지는 요구","다음 흐름으로 가져갈 것"]) expect(html).toContain(title);
  });

  it("does not turn more weak element facts into an important year",async()=>{
    const r=await generate();const original=buildMajorFortuneDecadeReading({...r.evidencePacket,natalLabels:[]});
    const augmented=buildMajorFortuneDecadeReading(r.evidencePacket);
    expect(augmented.years.some((y,i)=>y.reasons.length>original.years[i].reasons.length)).toBe(true);
    expect(augmented.years.filter(y=>y.importance==="important").map(y=>y.year)).toEqual(original.years.filter(y=>y.importance==="important").map(y=>y.year));
    expect(original.years.find(y=>y.year===2025)?.importance).toBe("important");
    expect(original.years.find(y=>y.year===2019)?.importance).not.toBe("important");
  });

  it("changes only evaluation position within a cycle, not its facts or annual readings",async()=>{
    const a=await generate(undefined,2025),b=await generate(undefined,2026);
    expect(a.evidencePacket.currentCycle).toEqual(b.evidencePacket.currentCycle);
    const {position:pa,...ra}=a.evidencePacket.decadeReading!;const {position:pb,...rb}=b.evidencePacket.decadeReading!;
    expect(ra).toEqual(rb);expect(pa).not.toBe(pb);
    expect(a.draft.majorFortuneTimelineRows.find(y=>y.isCurrentYear)?.year).toBe(2025);
    expect(b.draft.majorFortuneTimelineRows.find(y=>y.isCurrentYear)?.year).toBe(2026);
  });

  it.each([false,true])("preserves transition uncertainty with unknown=%s",async unknown=>{
    const base=inputFor(customers[0]);const input: SinglePersonGenerationInput={...base,person:{...base.person,birthDate:"1999-07-31",birthTime:"",birthTimeUnknown:unknown,approximateBirthTimeSlot:unknown?"":"JINSI",birthTimePrecision:unknown?"unknown":"approximate"}};
    const r=await generate(input);const text=rendered(r);
    expect(r.evidencePacket.customerDayun?.startSolarKst).toBeNull();
    expect(text).toContain("가능 범위");
    expect(text).not.toContain("다음 교운 기준:");
    expect(validateProductPublication("major_fortune",r.draft,r.evidencePacket).ok).toBe(true);
  });

  it.each(["annualGanji","annualTenGodLabel","badges"])("rejects writer/snapshot %s mismatch without mutating the evidence",async key=>{
    const r=await generate();const draft=structuredClone(r.draft);
    const rows=draft.majorFortuneTimelineRows as unknown as Record<string,unknown>[];
    rows[0][key]=key==="badges"?[]:"wrong";
    const before=JSON.stringify(r.evidencePacket);
    expect(validateProductPublication("major_fortune",draft,r.evidencePacket).ok).toBe(false);
    expect(JSON.stringify(r.evidencePacket)).toBe(before);
  });

  it("rejects invented emphasis and broken evidence references",async()=>{
    const r=await generate();expect(validateProductPublication("major_fortune",{...r.draft,strongYears:[]},r.evidencePacket).ok).toBe(false);
    const packet=structuredClone(r.evidencePacket);
    const first=packet.decadeReading!.years[0] as unknown as {evidenceIds:string[]};first.evidenceIds=[];
    expect(validateProductPublication("major_fortune",r.draft,packet).ok).toBe(false);
  });

  it("keeps writer and fallback on identical validated timeline and Bridge evidence",async()=>{
    const fallback=await generate();let request="";
    const response=structuredClone(fallback.draft);
    const mock:typeof fetch=async(_url,init)=>{request=String(init?.body);return Response.json({output_text:JSON.stringify(response)});};
    const result=await generateMajorFortuneProductDraft(inputFor(customers[0]),{now:()=>new Date("2026-09-21T03:00:00Z"),writer:{enabled:true,config:{enabled:true,apiKey:"mock-only",model:"mock",fetchImpl:mock}}});
    expect(result.ok,JSON.stringify(result.ok?null:result)).toBe(true);if(!result.ok)return;
    const normalized = (rows: typeof result.draft.majorFortuneTimelineRows) => rows.map(row=>Object.fromEntries(Object.entries(row.yearDetail).map(([key,value])=>[key,value.replace(/\s+/gu," ").trim()])));
    expect(normalized(result.draft.majorFortuneTimelineRows)).toEqual(normalized(fallback.draft.majorFortuneTimelineRows));
    expect(result.evidencePacket.bridgeEvidence).toEqual(fallback.evidencePacket.bridgeEvidence);
    expect(request).toContain("major-decade-v2");expect(request).toContain("evidenceIds");
    expect(validateProductPublication("major_fortune",result.draft,result.evidencePacket).ok).toBe(true);
  });

  it("continues to read older snapshots without the optional editorial plan",async()=>{
    const r=await generate();const legacy={...r.evidencePacket};delete legacy.decadeReading;
    expect(validateProductPublication("major_fortune",r.draft,legacy).ok).toBe(true);
    expect(rendered({...r,evidencePacket:legacy})).toContain("대운 타임라인");
  });

  it.each(["broken", {version:"major-decade-v2"}])("rejects malformed new reading structures before render: %j",async plan=>{
    const r=await generate();
    expect(validateProductPublication("major_fortune",r.draft,{...r.evidencePacket,decadeReading:plan}).ok).toBe(false);
  });
});
