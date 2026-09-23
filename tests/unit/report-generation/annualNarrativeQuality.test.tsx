import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";
import { generateAnnualFortuneProductDraft } from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import { buildAnnualFortuneReading } from "../../../src/lib/report-knowledge/annualFortuneReading";
import { buildAnnualMonthlyPublication } from "../../../src/lib/report-generation/annualMonthlyPublication";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { productBridgeScenes } from "../../../src/lib/report-knowledge/bridge/interactionScenes";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const customers = [
  {name:"고객A",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"ENTJ",year:2026,beforeChars:17213,beforeDuplicates:57},
  {name:"고객B",birthDate:"1980-05-15",birthTime:"09:30",gender:"FEMALE",mbtiType:"ISFJ",year:2026,beforeChars:15363,beforeDuplicates:45},
  {name:"고객C",birthDate:"2001-08-20",birthTime:"16:20",gender:"MALE",mbtiType:"ENFP",year:2025,beforeChars:16917,beforeDuplicates:54},
  {name:"고객D",birthDate:"1996-12-06",birthTime:"14:15",gender:"MALE",mbtiType:"",year:2027,beforeChars:17114,beforeDuplicates:57},
  {name:"고객E",birthDate:"1999-07-31",birthTime:"",gender:"MALE",mbtiType:"INTP",year:2027,beforeChars:16688,beforeDuplicates:60},
] as const;
function inputFor(c = customers[0] as (typeof customers)[number]): SinglePersonGenerationInput {
  return {kind:"annualFortune",productKey:"annual_fortune",productSlug:"annual-fortune",person:{name:c.name,birthDate:c.birthDate,birthTime:c.birthTime,gender:c.gender,mbtiType:c.mbtiType,birthTimeUnknown:false,approximateBirthTimeSlot:c.name==="고객E"?"JINSI":"",calendarType:"solar",timezone:"Asia/Seoul"},userContext:{relationshipStatus:"single",jobStatus:"employee",detailJob:"서비스 기획자",focusAreas:["직업","돈"]},productOptions:{selectedYear:String(c.year)}};
}
async function generate(input = inputFor()) {
  const r=await generateAnnualFortuneProductDraft(input,{now:()=>new Date(`${input.productOptions.selectedYear}-09-23T00:00:00+09:00`),writer:{enabled:false}});
  expect(r.ok,JSON.stringify(r.ok?null:r)).toBe(true);
  if(!r.ok) throw new Error("deterministic annual generation failed");
  return r;
}
function render(r: Awaited<ReturnType<typeof generate>>) {
  return renderToStaticMarkup(createElement(AnnualFortuneReportView,{draft:r.draft,evidencePacket:r.evidencePacket}));
}
function plain(html:string){return html.replace(/<[^>]+>/gu," ").replace(/&[^;]+;/gu," ").replace(/\s+/gu," ").trim();}
function longSentences(s:string){return s.split(/(?<=[.!?。！？])\s+|\n+/u).map(s=>s.replace(/[“”"']/gu,"").trim()).filter(s=>s.length>=40);}

describe("annual narrative V2 evidence and density",()=>{
  it.each(customers)("$name: complete year, differentiated months and publish/SSR",async c=>{
    const r=await generate(inputFor(c)),p=r.evidencePacket,reading=p.annualReading!,months=p.calendarMonths!;
    expect(validateProductPublication("annual_fortune",r.draft,p)).toEqual({ok:true,errors:[]});
    expect(reading.selectedYear).toBe(c.year);
    expect(reading.factors.length).toBeGreaterThanOrEqual(2);expect(reading.factors.length).toBeLessThanOrEqual(4);
    expect(reading.domains.map(d=>d.key)).toEqual(["work","money","relationship","growth"]);
    expect(new Set(reading.domains.map(d=>d.body)).size).toBe(4);
    expect(reading.domains[0].scenes[0]).toContain(`연지 본기의 ${p.annualFortune.branchTenGod}`);
    expect(reading.months.map(m=>m.month)).toEqual(Array.from({length:12},(_,i)=>i+1));
    expect(reading.months.filter(m=>m.tier==="focus")).toHaveLength(3);
    expect(reading.months[1].tier).toBe("transition");
    expect(reading.months.filter(m=>m.tier==="basic").length).toBeGreaterThan(0);
    expect(new Set(reading.months.map(m=>m.segments.map(s=>s.core).join(""))).size).toBe(12);
    for(const [i,m] of reading.months.entries()){
      const calculated=months[i];
      expect(m.segments.map(s=>[s.startKst,s.endKstExclusive,s.evidenceIds])).toEqual(calculated.segments.map(s=>[s.startKst,s.endKstExclusive,s.evidenceIds]));
      const ids=new Set(calculated.segments.flatMap(s=>s.evidenceIds));
      expect(m.reasons.every(r=>r.evidenceIds.length>0&&r.evidenceIds.every(id=>ids.has(id)))).toBe(true);
      if(m.tier!=="basic") expect(m.reasons.length).toBeGreaterThan(0);
      else expect(m.segments.every(s=>s.scenes.length<=1)).toBe(true); // At most one grounded current-context scene; no focus-month expansion.
      if(m.tier==="focus") expect(m.segments.some(s=>s.scenes.length>=2)).toBe(true);
      m.segments.forEach((s,j)=>{
        const fact=calculated.segments[j];
        expect(s.core).toContain(fact.monthPillar.stem+fact.monthPillar.branch);
        if(fact.uncertainty.length) expect([s.core,s.balance,...s.scenes].join(" ")).toMatch(/후보|확정할 수|조건이 다릅니다/);
      });
    }
    expect(reading.crossPeriods[0].startKst).toBe(months[0].startKst);
    expect(reading.crossPeriods.at(-1)!.endKstExclusive).toBe(months.at(-1)!.endKstExclusive);
    reading.crossPeriods.forEach((p,i)=>{if(i)expect(p.startKst).toBe(reading.crossPeriods[i-1].endKstExclusive);});
    for(const scene of reading.bridge) expect(productBridgeScenes(p.bridgeEvidence)).toContainEqual(scene);
    if(!c.mbtiType)expect(reading.bridge).toEqual([]);
    const html=render(r),visible=plain(html),long=longSentences(visible);
    expect(visible.length).toBeGreaterThanOrEqual(c.beforeChars);
    expect(long.length-new Set(long).size).toBeLessThan(c.beforeDuplicates/2);
    expect(visible).not.toMatch(/fallback|placeholder|writer|validator|calendar_month_approximation|주의하세요|균형이 중요|반복 압박|번째 점검/iu);
    expect((html.match(/기간별 관계 근거/g)||[]).length).toBe(months.flatMap(m=>m.segments).length);
    expect(html.indexOf('id="report-year"')).toBeLessThan(html.indexOf('id="report-months"'));
    expect(html.indexOf('id="report-readings"')).toBeLessThan(html.indexOf('id="report-important"'));
    expect(html).toContain("focus-visible");
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("does not promote every Jie or a pile of weak facts to focus months",async()=>{
    const r=await generate();const p=structuredClone(r.evidencePacket);
    const weak=p.calendarMonths!.flatMap(m=>m.segments.flatMap(s=>s.relationFacts)).find(f=>f.source==="month_natal_element")!;
    for(const m of p.calendarMonths!)for(const s of m.segments)(s.relationFacts as unknown[]).push(...Array.from({length:30},()=>weak));
    expect(buildAnnualFortuneReading(p).months.map(m=>[m.month,m.tier])).toEqual(r.evidencePacket.annualReading!.months.map(m=>[m.month,m.tier]));
    for(const m of p.calendarMonths!)for(const s of m.segments)s.relationFacts=[];
    const neutral=buildAnnualFortuneReading(p);
    expect(neutral.months.filter(m=>m.tier==="focus")).toEqual([]);
    expect(neutral.months.filter(m=>m.tier==="transition").map(m=>m.month)).toEqual([2]);
    expect(neutral.months.flatMap(m=>m.segments).every(s=>s.balance.includes("없는 구간"))).toBe(true);
  });

  it("preserves mixed facts and reads carry-over as continuity, not a new event",async()=>{
    const r=await generate(),m=r.evidencePacket.annualReading!.months;
    expect(m[4].segments[1].balance).toContain("상쇄된 것으로 보지 않습니다");
    expect(m[2].segments[0].core).toContain("앞선 2월 절입 이후");
    expect(m[2].segments[0].scenes).toHaveLength(1);
    expect(m[2].segments[0].scenes).not.toEqual(m[1].segments.at(-1)!.scenes);
    expect(m[2].segments[0].action).not.toEqual(m[1].segments.at(-1)!.action);
    expect(m[0].segments[0].core).toContain("연간 편인"); // 乙巳 before 2026 LiChun, 丁 day master
    expect(m[1].segments[1].core).toContain("연간 겁재"); // 丙午 from the exact boundary
  });

  it.each([false,true])("preserves approximate/unknown transition scope: unknown=%s",async unknown=>{
    const base=inputFor(customers[4]);const r=await generate({...base,person:{...base.person,birthTimeUnknown:unknown,approximateBirthTimeSlot:unknown?"":"JINSI"}});
    const p=r.evidencePacket,reading=p.annualReading!;
    for(const m of p.calendarMonths!)if(m.segments.some(s=>s.uncertainty.length))expect(reading.months[m.month-1].tier).toBe("transition");
    expect(reading.crossPeriods.some(p=>p.text.includes("후보"))).toBe(true);
    expect(p.customerDayun!.startSolarKst).toBeNull();
    expect(validateProductPublication("annual_fortune",r.draft,p).ok).toBe(true);
  });

  it("changes only Bridge for an MBTI counterfactual, not month facts or tiers",async()=>{
    const a=await generate(),input=inputFor();const b=await generate({...input,person:{...input.person,mbtiType:"ISFJ"}});
    expect(a.evidencePacket.calendarMonths).toEqual(b.evidencePacket.calendarMonths);
    const {bridge:ba,...pa}=a.evidencePacket.annualReading!;const {bridge:bb,...pb}=b.evidencePacket.annualReading!;
    expect(pa).toEqual(pb);expect(ba).not.toEqual(bb);
  });

  it("does not assert conditional Dayun support and friction simultaneously",async()=>{
    const r=await generate(inputFor(customers[4])),p=structuredClone(r.evidencePacket);
    const s=p.calendarMonths![4].segments.find(s=>s.uncertainty.length)!;
    // Isolate the narrative boundary: two mutually conditional candidate facts.
    // Astronomy remains covered independently by the canonical month matrix.
    s.relationFacts=[
      {id:"conditional-support",source:"month_dayun_branch",type:"육합",participants:["巳","申"],monthBranch:"巳",counterpart:{scope:"dayun",cycleIndex:2,pillar:"庚申"},certainty:"conditional"},
      {id:"conditional-friction",source:"month_dayun_branch",type:"충",participants:["巳","亥"],monthBranch:"巳",counterpart:{scope:"dayun",cycleIndex:3,pillar:"辛亥"},certainty:"conditional"},
    ];
    const text=buildAnnualFortuneReading(p).months[4].segments.find(x=>x.startKst===s.startKst)!.balance;
    expect(text).toContain("해당 대운이 적용될 때만");
    expect(text).not.toContain("겹칩니다");
  });

  it.each(["tier","reason","segment","bridge","domain","version"])("rejects invented %s without mutating evidence",async kind=>{
    const r=await generate();const p=structuredClone(r.evidencePacket),plan=p.annualReading!;
    if(kind==="tier")plan.months[0].tier="transition";
    if(kind==="reason")(plan.months[1].reasons[0].evidenceIds as string[]).push("invented");
    if(kind==="segment")plan.months[0].segments[0].startKst="2026-01-02T00:00:00+09:00";
    if(kind==="bridge")(plan.bridge as unknown[]).push({...plan.bridge[0],mbtiType:"INFP"});
    if(kind==="domain")plan.domains[0].body="승진이 확정됩니다.";
    if(kind==="version")(plan as {version:string}).version="unknown";
    const frozen=JSON.stringify(p);expect(validateProductPublication("annual_fortune",r.draft,p).ok).toBe(false);expect(JSON.stringify(p)).toBe(frozen);
  });

  it("keeps the same narrative in fallback/writer and rejects writer changes",async()=>{
    const fallback=await generate();let prompt="";
    const run=(draft:unknown)=>generateAnnualFortuneProductDraft(inputFor(),{
      now:()=>new Date("2026-09-23T00:00:00+09:00"),
      writer:{enabled:true,config:{enabled:true,apiKey:"mock-only",model:"mock",fetchImpl:async(_url,init)=>{
        prompt=String(init?.body);return Response.json({output_text:JSON.stringify(draft)});
      }}},
    });
    const writer=await run(fallback.draft);expect(writer.ok,JSON.stringify(writer)).toBe(true);
    if(writer.ok){expect(writer.evidencePacket.annualReading).toEqual(fallback.evidencePacket.annualReading);expect(validateProductPublication("annual_fortune",writer.draft,writer.evidencePacket).ok).toBe(true);}
    expect(prompt).toContain("annual-reading-v2");expect(prompt).toContain("annualReadingPublication");
    const wrong={...fallback.draft,headline:"승진과 수익이 확정된 해"};expect((await run(wrong)).ok).toBe(false);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("continues reading the previous precise-month snapshot without a narrative plan",async()=>{
    const r=await generate(),p={...r.evidencePacket};delete p.annualReading;
    const draft={...r.draft,...buildAnnualMonthlyPublication(p)};
    expect(validateProductPublication("annual_fortune",draft,p).ok).toBe(true);
    expect(render({...r,draft,evidencePacket:p})).toContain("절입 전후의 월별 흐름");
  });
});
