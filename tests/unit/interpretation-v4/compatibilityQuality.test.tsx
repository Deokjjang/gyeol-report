import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { COMPATIBILITY_RELEASE_VERSION } from "../../../src/lib/interpretation-v4/compatibilityReleaseContracts";
import { buildRelationshipProfiles, projectRelationshipView } from "../../../src/lib/interpretation-v4/relationshipProductView";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import fixtures from "./compatibilityQualityFixtures.json";

const clock = { evaluatedAt: "2026-10-12T12:00:00+09:00" };
const manuscripts = new Map<string, { paragraphs: string[]; directions: string[] }>();
const forbidden = /내게 익숙한 방식으로|각자의 장점을 나눠 쓸 여지|내 방식도 존중받는 대화|생깁니다라는|겁재이라도|방식’가|검증된 오행 보완|옮겨 붙인 설명|SourceCandidate|undefined|\[object Object\]/;

describe("Compatibility actual quality edition at c048218 base", () => {
  it.each(fixtures.cases)("$id paid generator, evidence and entire Book", async f => {
    const input = structuredClone(f.payload);
    const g = await generateV4ShadowReport(f.payload, clock);
    if (!g.ok) return expect.unreachable(JSON.stringify(g));
    expect(g.externalCalls).toEqual([]); expect(f.payload).toEqual(input);
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_compatibility" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, d = r.integration.readerEdition;
    const frozen = fixtures.before[f.id as keyof typeof fixtures.before];
    for (const [key, value] of Object.entries({ calculations:e.calculations, natalTables:e.natalTableEvidence, mbtiTables:e.mbtiTables,
      index:r.compatibilityIndex, directions:r.evidence.directions, invariant:r.evidence.invariant, individuals:r.integration.individualDigests }))
      expect(v4Digest(value), `${f.id}:${key}`).toBe(frozen[key as keyof typeof frozen]);
    expect(r.integration.publishedEdition).toBe(COMPATIBILITY_RELEASE_VERSION);
    expect(r.integration.readerValidation).toEqual({ hardErrors:[], qualityIssues:[] });
    expect(r.integration.readerEditorial).toEqual([]);
    expect(d.chapters.map(c=>c.paragraphs.length)).toEqual(Array(9).fill(4));
    expect(d.chapters[8].paragraphs[0].id).toBe("CH09.P1");
    const paragraphs=d.chapters.flatMap(c=>c.paragraphs), text=paragraphs.map(p=>p.text).join("\n");
    expect(text).not.toMatch(forbidden);
    for (const [chapter, direction] of [[4,"aToB"],[5,"bToA"]] as const) {
      const expected=r.evidence.directions[direction];
      for(const s of d.chapters[chapter].paragraphs.flatMap(p=>p.sentences)) {
        expect(s.directionId).toBe(expected.relationId);
        expect([s.subjectPersonId,s.targetPersonId]).toEqual([expected.subjectPerson,expected.targetPerson]);
      }
    }
    const relations=paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.relationIds));
    expect(relations.every(id=>r.evidence.relations.some(actual=>actual.identity===id))).toBe(true);
    const romantic=["love","marriage"].includes(f.payload.relationshipType);
    const views=(["personA","personB"] as const).map(slot=>{
      const person=f.payload[slot];
      const profiles=buildRelationshipProfiles({calculation:e.calculations[slot],name:person.name,mbti:person.mbtiType,
        context:{jobStatus:"",detailJob:"",relationshipStatus:f.payload.relationshipType==="marriage"?"married":romantic?"dating":""}});
      if(!profiles.ok)return expect.unreachable();
      return projectRelationshipView(profiles.profiles,romantic);
    });
    const atomIds=new Set(views.flatMap(v=>v.profiles.myeongli.evidence.map(a=>a.id)));
    // Pair comparisons retain the full canonical profile's contributing nodes;
    // the display-only view filters domains for newly selected personal copy.
    const nodeIds=new Set(views.flatMap(v=>v.profiles.mbti.sourceNodes.map(n=>n.id)));
    const fusionIds=new Set(views.flatMap(v=>[...v.profiles.fusion.complements,...v.profiles.fusion.reinforce,...v.profiles.fusion.tensions].map(f=>f.id)));
    for(const s of paragraphs.flatMap(p=>p.sentences)) {
      expect(s.individualEvidenceIds.every(id=>atomIds.has(id))).toBe(true);
      expect(s.mbtiSourceNodeIds.every(id=>nodeIds.has(id))).toBe(true);
      if(s.sourceCandidateId)expect(s.fusionIds.every(id=>fusionIds.has(id))).toBe(true);
    }
    for (const s of paragraphs.flatMap(p=>p.sentences)) if(s.sourceCandidateId && s.fusionIds.length) {
      expect(s.individualEvidenceIds.length).toBeGreaterThan(0);
      expect(s.mbtiSourceNodeIds.length).toBeGreaterThan(0);
    }
    if(f.id==="E"||f.id==="F") {
      expect(d.chapters[0].paragraphs[2].purpose).toBe("유형을 모를 때 확인할 두 사람의 반응");
      expect(paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.mbtiSourceNodeIds))).toEqual([]);
      expect(text).not.toMatch(/\b[EI][SN][TF][JP]\b/);
    }
    if(f.id==="D"||f.id==="F") expect(paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.individualEvidenceIds))).not.toContainEqual(expect.stringMatching(/hour/));
    if(!["love","marriage"].includes(f.payload.relationshipType)) expect(text).not.toMatch(/데이트|스킨십|연애|배우자|애정 표현/);
    const book=projectBook(e); if(!book)return expect.unreachable("Book missing");
    expect(book.pages.flatMap(p=>p.kind==="narrative"?p.paragraphs.map(p=>p.text):[])).toEqual(paragraphs.map(p=>p.text));
    manuscripts.set(f.id,{paragraphs:paragraphs.map(p=>p.text),directions:[4,5].map(c=>d.chapters[c].paragraphs.map(p=>p.text).join("\n"))});
    if(f.id==="A") {
      expect(r.compatibilityIndex.total).toBe(54); expect(r.compatibilityIndex.scores.map(s=>s.value)).toEqual([15,19,13,7]);
      const score=book.pages.find(p=>p.kind==="score"); expect(score?.kind==="score"&&score.total).toBe(54);
      const appendix=book.pages.filter(p=>p.kind==="appendix");
      expect(appendix.map(p=>p.items.length)).toEqual([43,34]);
      expect(appendix.flatMap(p=>p.items).map(i=>i.person)).toEqual([...Array(43).fill("이준혁"),...Array(34).fill("정유진")]);
      const notePages=book.pages.filter(p=>p.kind==="narrative"&&p.notes?.length);
      expect(notePages.length).toBeGreaterThan(0);
      for(const page of notePages) {
        if(page.kind!=="narrative")return expect.unreachable();
        const html=renderToStaticMarkup(createElement(BookReader,{data:book,page,onNote:()=>{},onPage:()=>{},onShare:()=>{}}));
        for(const p of page.paragraphs) for(const n of p.notes??[]) {
          expect(page.notes?.[n-1]).toBeDefined();
          const note=page.notes![n-1]; expect(html).toContain(`각주 ${n} ${note.name}`);
        }
      }
      const again=await generateV4ShadowReport(f.payload,clock);expect(again).toEqual(g);
    }
  },120000);
  it("different roots, swapped people and categories change relevant content",()=>{
    const a=manuscripts.get("A")!,b=manuscripts.get("B")!,c=manuscripts.get("C")!;
    const normalize=(id:string,text:string)=>{
      const people=fixtures.cases.find(f=>f.id===id)!.payload;
      return text.replaceAll(people.personA.name,"PERSON_A").replaceAll(people.personB.name,"PERSON_B");
    };
    // Compare the claims after removing names, not merely different strings
    // caused by displaying different customers. Shared supported needs may match.
    for(const index of [4,6,7,8,10,11])expect(normalize("A",a.paragraphs[index])).not.toBe(normalize("B",b.paragraphs[index]));
    for(const index of [0,1])expect(normalize("A",a.directions[index])).not.toBe(normalize("B",b.directions[index]));
    expect(a.directions[0]).not.toBe(a.directions[1].replaceAll("정유진","TEMP").replaceAll("이준혁","정유진").replaceAll("TEMP","이준혁"));
    expect(a.directions[0]).toContain("甲");expect(c.directions[1]).toContain("甲");
    for(const id of ["marriage","parentChild","coworker","managerReport","businessPartner","friendship"])
      for(const chapter of [0,3,4,5,6,7,8]) expect(manuscripts.get(id)!.paragraphs.slice(chapter*4,chapter*4+4)).not.toEqual(a.paragraphs.slice(chapter*4,chapter*4+4));
  });
  it.each(fixtures.otherProducts)("$id actual full manuscript, evidence and Book unchanged",async f=>{
    const g=await generateV4ShadowReport(f.input,clock);if(!g.ok)return expect.unreachable();
    expect([g.draft,g.evidencePacket,projectBook(g.evidencePacket as V4RuntimeEvidence)].map(v4Digest)).toEqual(f.digests);
  },120000);
});
