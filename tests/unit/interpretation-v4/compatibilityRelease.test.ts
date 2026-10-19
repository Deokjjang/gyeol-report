import timeProductLocks from "../../fixtures/release-technical-01/time-product-locks.json";
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { buildV4CompatibilityProduct, type CompatibilityProduct } from "../../../src/lib/interpretation-v4/compatibilityProductAdapter";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { renderCompatibilityRelease } from "../../../src/lib/interpretation-v4/compatibilityReleaseRenderer";
import * as editorialGuard from "../../../src/lib/interpretation-v4/editorialGuard";
import * as releaseRenderer from "../../../src/lib/interpretation-v4/compatibilityReleaseRenderer";
import { COMPATIBILITY_PRODUCT_VERSION } from "../../../src/lib/interpretation-v4/compatibilityProductAdapter";
import { validateCompatibilityRelease } from "../../../src/lib/interpretation-v4/compatibilityReleaseValidator";
import { COMPATIBILITY_RELEASE_VERSION, type PairReleaseDraft } from "../../../src/lib/interpretation-v4/compatibilityReleaseContracts";
import { buildRelationshipProfiles, projectRelationshipView } from "../../../src/lib/interpretation-v4/relationshipProductView";
import { projectCompatibilityPairView } from "../../../src/lib/interpretation-v4/compatibilityProductView";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { calculateCompatibilitySaju } from "../../../src/lib/report-generation/compatibilityGenerationHandler";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import locks from "./compatibilityReleaseLocks.json";
import canonicalLocks from "./compatibilityCanonicalLocks.json";
import titleSafetyLocks from "./compatibilityTitleSafetyLocks.json";
const root = "/tmp/gyeol-compatibility-release", base = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;
const categories = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;
const readers: { id: string; draft: PairReleaseDraft }[] = [];
function exportJson(name: string, value: unknown) {
  if (process.env.PAIR_EXPORT !== "1") return;
  mkdirSync(root, { recursive: true }); writeFileSync(`${root}/${name}.json`, JSON.stringify(value, null, 2));
}
function build(payload: unknown) {
  const r = buildV4CompatibilityProduct(payload); if (!r.ok) return expect.unreachable(JSON.stringify(r));
  return r;
}
function text(d: PairReleaseDraft) { return d.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n"); }
function verifyTitleSafety(r: CompatibilityProduct, id: keyof typeof titleSafetyLocks) {
  const frozen = titleSafetyLocks[id];
  const titles = r.integration.readerEdition.chapters.flatMap(c => c.paragraphs.map(p => p.purpose));
  // The old unknown fixture also lost CH04.P1 and CH09.P1. Their restored
  // headings are checked by the complete 36-paragraph contract below.
  expect(id === "both-unknown" ? titles.filter(t => (frozen.titles as string[]).includes(t)) : titles).toEqual(frozen.titles);
  // This edition intentionally changes manuscript text. Keep the historical
  // title locks, canonical evidence locks and saved Book snapshot untouched.
  if (process.env.PAIR_TITLE_EXPORT === "1") {
    const d = r.integration.readerEdition;
    mkdirSync("/tmp/gyeol-title-safety", { recursive: true });
    writeFileSync(`/tmp/gyeol-title-safety/${id}.json`, JSON.stringify({ titles:d.chapters.map(c=>({id:c.id,title:c.title,paragraphs:c.paragraphs.map(p=>({id:p.id,title:p.purpose}))})), bodyLength:d.bodyLength, validation:r.integration.readerValidation }, null, 2));
  }
}

describe("Compatibility reader release", () => {
  it.each(COMPATIBILITY_NARRATIVE_FIXTURES)("$id actual manuscript, index and stored reader", async (f) => {
    const index = COMPATIBILITY_NARRATIVE_FIXTURES.indexOf(f), before = structuredClone(f.payload);
    const generated = await generateV4ShadowReport(f.payload, SHADOW_CLOCK); if (!generated.ok) return expect.unreachable(JSON.stringify(generated));
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_compatibility" || !("integration" in e.composition.result)) return expect.unreachable();
    const r = e.composition.result, d = r.integration.readerEdition, book = projectBook(e);
    verifyTitleSafety(r, f.id as keyof typeof titleSafetyLocks);
    expect(f.payload).toEqual(before); expect(generated.externalCalls).toEqual([]);
    expect(r.integration.publishedEdition, JSON.stringify(r.integration.readerEditorial)).toBe(COMPATIBILITY_RELEASE_VERSION);
    expect(r.integration.readerValidation).toEqual({hardErrors: [], qualityIssues: []});
    expect(d.chapters.map(c => c.paragraphs.length)).toEqual(Array(9).fill(4));
    expect(d.bodyLength).toBeGreaterThanOrEqual(8000); expect(d.bodyLength).toBeLessThanOrEqual(10000);
    expect(text(d)).not.toMatch(/undefined|\[object Object\]|SourceCandidate|personA:|natal:|notablePairs/);
    const frozen = canonicalLocks[String(index) as keyof typeof canonicalLocks];
    expect(r.compatibilityIndex).toEqual(frozen.index); expect(r.evidence.directions).toEqual(frozen.directions);
    expect(r.evidence.invariant).toEqual(frozen.invariant); expect(r.integration.individualDigests).toEqual(frozen.individuals);
    expect(r.integration.pair.canonicalRelationIds).toEqual(frozen.relations);
    for (const [chapter, slot] of [[4, "aToB"], [5, "bToA"]] as const) for (const p of d.chapters[chapter].paragraphs) for (const s of p.sentences) {
      expect(s.directionId).toBe(r.evidence.directions[slot].relationId);
      expect([s.subjectPersonId, s.targetPersonId]).toEqual([r.evidence.directions[slot].subjectPerson, r.evidence.directions[slot].targetPerson]);
    }
    expect(validateV4Publication("saju_mbti_compatibility", generated.draft, e)).toEqual({ ok: true, errors: [] });
    expect(book).not.toBeNull(); if (!book) return;
    const prose = book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs : []);
    expect(prose.map(p => p.text)).toEqual(d.chapters.flatMap(c => c.paragraphs.map(p => p.text)));
    expect(prose.map(p => p.heading)).toEqual(d.chapters.flatMap(c => c.paragraphs.map(p => p.purpose)));
    expect(prose.every(p => p.heading && p.anchorId)).toBe(true); expect(new Set(prose.map(p => p.anchorId)).size).toBe(36);
    const contents = book.pages.find(p => p.id === "contents"), again = book.pages.find(p => p.id === "read-again");
    expect(contents?.kind === "contents" && contents.entries).toHaveLength(9);
    expect(again?.kind === "contents" && again.entries.filter(e => e.targetId.startsWith("pair-ch"))).toHaveLength(36);
    expect(again?.kind === "contents" && again.entries.filter(e => e.targetId.startsWith("pair-ch")).map(e => e.title)).toEqual(prose.map(p => p.heading));
    const pair = book.pages.find(p => p.kind === "pair"); if (pair?.kind !== "pair") return expect.unreachable();
    expect(pair.directions.map(d => book.pages[d.page].id)).toEqual(["chapter-direction-ab", "chapter-direction-ba"]);
    const score = book.pages.find(p => p.kind === "score"); expect(score?.kind === "score" && score.total).toBe(r.compatibilityIndex.total);
    for (const p of book.pages) {
      const html = renderToStaticMarkup(createElement(BookReader, {data:book, page:p, onNote:()=>{}, onPage:()=>{}, onShare:()=>{}}));
      if (p.kind === "contents") for (const row of p.entries) expect(book.pages[row.page].id === row.targetId || book.pages[row.page].anchors?.includes(row.targetId)).toBe(true);
      if (p.kind === "narrative") for (const paragraph of p.paragraphs) { expect(html).toContain(`id="${paragraph.anchorId}"`); expect(html).toContain(renderToStaticMarkup(createElement("span",null,paragraph.text)).slice(6,-7)); }
    }
    const snapshot = createProductPreviewSnapshot({reportId:`synthetic-new-pair-${index}`, createdAtIso:e.generatedAt, productKey:e.input.productKey, productSlug:e.input.productSlug, draft:generated.draft as unknown as ProductPreviewSnapshotDraft,evidencePacket:e});
    if (!snapshot.ok) return expect.unreachable();
    const saved = JSON.parse(JSON.stringify(snapshot.value)); expect(storedBook(saved)?.data).toEqual(book); expect(storedBook(saved,"https://example.test/r/synthetic")?.data).toEqual(book);
    readers.push({ id: String.fromCharCode(65+index), draft:d });
    exportJson(`manuscript-${String.fromCharCode(65+index)}`, {draft:d, validation:r.integration.readerValidation, editorial:r.integration.readerEditorial, index:r.compatibilityIndex, directions:r.evidence.directions, selection:r.selection, oldIndexEqual:true, book:{pages:book.pages.length, paragraphs:prose.length, anchors:36, directSharedRoundtrip:true}});
  },120000);
  it("records common sentences and facts without counting them as personalization", () => {
    exportJson("common-copy", readers.flatMap((a,i)=>readers.slice(i+1).map(b=>{
      const ap=a.draft.chapters.flatMap(c=>c.paragraphs),bp=b.draft.chapters.flatMap(c=>c.paragraphs),bs=new Set(bp.flatMap(p=>p.sentences.map(s=>s.text)));
      return {left:a.id,right:b.id,sameParagraphs:ap.filter(p=>bp.some(q=>q.text===p.text)).map(p=>p.id),sharedSentences:[...new Set(ap.flatMap(p=>p.sentences.map(s=>s.text)).filter(s=>bs.has(s)))]};
    })));
  });
  it.each(categories)("same people, distinct %s editorial setting with canonical roles", relationshipType => {
    const r=build({...base,relationshipType}), canonical=composeCompatibilityNarrative({...base,relationshipType}); if(!canonical.ok) return expect.unreachable();
    expect(r.compatibilityIndex).toEqual(canonical.compatibilityIndex); expect(r.evidence.directions).toEqual(canonical.evidence.directions);
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    const first=build(base); expect(r.integration.individualDigests).toEqual(first.integration.individualDigests);
    if(relationshipType!=="love") for(const n of [0,3,4,6,7,8]) expect(r.integration.readerEdition.chapters[n].paragraphs.map(p=>p.text)).not.toEqual(first.integration.readerEdition.chapters[n].paragraphs.map(p=>p.text));
    if(!["love","marriage"].includes(relationshipType)) expect(text(r.integration.readerEdition)).not.toMatch(/연애|데이트|설렘|배우자|성적 매력/);
    if(relationshipType==="parentChild") expect(text(r.integration.readerEdition)).toContain("안전의 최종 책임은 부모");
    if(relationshipType==="managerReport") expect(text(r.integration.readerEdition)).toContain("상사의 판단 책임까지 떠안을 필요는 없습니다");
    exportJson(`category-${relationshipType}`, {draft:r.integration.readerEdition,roles:r.evidence.roles,index:r.compatibilityIndex,validation:r.integration.readerValidation,published:r.integration.publishedEdition});
  },120000);
  const variants = [
    ["A-mbti",{...base,personA:{...base.personA,mbtiType:"ENTJ" as const}}],
    ["B-mbti",{...base,personB:{...base.personB,mbtiType:"INFP" as const}}],
    ["A-natal",{...base,personA:{...base.personA,birthDate:"1984-03-18",birthTime:"05:30"}}],
    ["B-natal",{...base,personB:{...base.personB,birthDate:"1994-11-18",birthTime:"07:42"}}],
    ["swapped",{...base,personA:base.personB,personB:base.personA}],
    ["identical",{...base,personB:{...base.personA,name:"동일원국"}}],
    ["A-unknown",{...base,personA:{...base.personA,mbtiType:"" as const}}],
    ["B-unknown",{...base,personB:{...base.personB,mbtiType:"" as const}}],
    ["both-unknown",{...base,personA:{...base.personA,mbtiType:"" as const,birthTime:"",birthTimeUnknown:true,birthTimePrecision:"unknown" as const},personB:{...base.personB,mbtiType:"" as const,birthTime:"",birthTimeUnknown:true,birthTimePrecision:"unknown" as const}}],
    ["approximate",{...base,personA:{...base.personA,birthTime:"",birthTimeUnknown:false,birthTimePrecision:"approximate" as const,approximateBirthTimeSlot:"SASI" as const}}],
  ] as const;
  it.each(variants)("%s preserves sources and safe publication", (id,payload) => {
    const r=build(payload), original=build(base), canonical=composeCompatibilityNarrative(payload);if(!canonical.ok) return expect.unreachable();
    expect(r.compatibilityIndex).toEqual(canonical.compatibilityIndex);expect(r.evidence).toEqual(canonical.evidence);expect(r.directions).toEqual(canonical.directions);
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
    expect(r.integration.publishedEdition,JSON.stringify(r.integration.readerEditorial)).toBe(COMPATIBILITY_RELEASE_VERSION);
    if(id==="A-mbti"||id==="A-natal") { expect(r.integration.individualDigests.personB).toBe(original.integration.individualDigests.personB);expect(r.integration.readerEdition.chapters[1]).not.toEqual(original.integration.readerEdition.chapters[1]); }
    if(id==="B-mbti"||id==="B-natal") { expect(r.integration.individualDigests.personA).toBe(original.integration.individualDigests.personA);expect(r.integration.readerEdition.chapters[2]).not.toEqual(original.integration.readerEdition.chapters[2]); }
    if(id==="swapped") {expect(r.evidence.invariant).toEqual(original.evidence.invariant);expect(r.evidence.directions.aToB).toEqual(original.evidence.directions.bToA);expect(r.compatibilityIndex).toEqual(original.compatibilityIndex);expect(r.integration.individualDigests.personA).toBe(original.integration.individualDigests.personB);}
    if(id.includes("unknown")) expect(r.integration.readerEdition.chapters[0].paragraphs.find(p=>p.id==="CH01.P3")?.purpose).toBe("유형을 모를 때 확인할 두 사람의 반응");
    if(id==="both-unknown") {verifyTitleSafety(r, "both-unknown");expect(text(r.integration.readerEdition)).not.toMatch(/\b[EI][SN][TF][JP]\b/);expect(r.integration.readerEdition.chapters.flatMap(c=>c.paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.individualEvidenceIds)))).not.toContainEqual(expect.stringMatching(/hour/));}
    exportJson(`variant-${id}`,{draft:r.integration.readerEdition,validation:r.integration.readerValidation,editorial:r.integration.readerEditorial,published:r.integration.publishedEdition,digests:r.integration.individualDigests,index:r.compatibilityIndex,directions:r.evidence.directions});
  },120000);
  it("foreign names containing A/B stay literal in actual generated headings", () => {
    const r = build({...base, personA:{...base.personA, name:"A&B"}, personB:{...base.personB, name:"Bobby"}});
    verifyTitleSafety(r, "special-names");
    expect(r.integration.readerEdition.chapters[0].paragraphs[2].purpose).toBe("MBTI가 보여주는 우리");
    expect(r.integration.readerEdition.chapters[1].paragraphs[1].purpose).toBe("A&B님이 관계에서 중요하게 여기는 것");
    expect(r.integration.readerEdition.chapters[2].paragraphs[1].purpose).toBe("Bobby님이 관계에서 중요하게 여기는 것");
    expect(r.integration.readerValidation.hardErrors).toEqual([]);
  },120000);
  it.each(RUNTIME_FIXTURES.filter(f=>f.id!=="compatibility"))("$id text, evidence and Book stay at their frozen integrated edition", async f=>{
    // Major/Annual were released after these original boundary locks. Their
    // integrated output is frozen at 964e6b9; original historical locks remain.
    const timeLock = f.id === "major" || f.id === "annual" ? timeProductLocks[f.id] : null;
    if (timeLock) {
      expect(f.payload).toEqual(timeLock.payload);
      expect(SHADOW_CLOCK).toEqual(timeLock.clock);
    }
    const r=await generateV4ShadowReport(f.payload,SHADOW_CLOCK);if(!r.ok)return expect.unreachable();
    expect([v4Digest(r.draft),v4Digest(r.evidencePacket),v4Digest(projectBook(r.evidencePacket as V4RuntimeEvidence))]).toEqual(timeLock?.hashes ?? locks[f.id as keyof typeof locks]);
  },120000);
  it.each(["parentChild", "managerReport"] as const)("%s swapped people keep fixed A/B responsibilities", relationshipType=>{
    const payload={...base,relationshipType}, a=build(payload),b=build({...payload,personA:payload.personB,personB:payload.personA});
    expect(a.evidence.invariant).toEqual(b.evidence.invariant);expect(a.evidence.directions.aToB).toEqual(b.evidence.directions.bToA);
    expect(b.evidence.roles).toEqual(a.evidence.roles);expect(b.integration.readerValidation.hardErrors).toEqual([]);
    expect(text(a.integration.readerEdition)).not.toEqual(text(b.integration.readerEdition));
    exportJson(`role-swap-${relationshipType}`,{roles:b.evidence.roles,directions:b.evidence.directions,published:b.integration.publishedEdition,validation:b.integration.readerValidation});
  },120000);
  it("unsafe draft returns to the previous edition without a paid publication error",async()=>{
    const actual=releaseRenderer.renderCompatibilityRelease;
    const spy=vi.spyOn(releaseRenderer,"renderCompatibilityRelease").mockImplementationOnce((...args)=>{
      const out=actual(...args);out.draft.chapters[1].paragraphs[0].sentences[0].individualEvidenceIds=["invented"];return out;
    });
    try {
      const generated=await generateV4ShadowReport(base,SHADOW_CLOCK);if(!generated.ok)return expect.unreachable(JSON.stringify(generated));
      const e=generated.evidencePacket as V4RuntimeEvidence;if(e.composition.product!=="saju_mbti_compatibility"||!("integration" in e.composition.result))return expect.unreachable();
      expect(e.composition.result.integration.publishedEdition).toBe(COMPATIBILITY_PRODUCT_VERSION);
      expect(validateV4Publication("saju_mbti_compatibility",generated.draft,e)).toEqual({ok:true,errors:[]});
    }finally{spy.mockRestore();}
  },120000);
  it("density diagnostics do not block an otherwise supported edition",()=>{
    const actual=releaseRenderer.renderCompatibilityRelease;
    const spy=vi.spyOn(releaseRenderer,"renderCompatibilityRelease").mockImplementationOnce((...args)=>{const out=actual(...args);out.draft.shortages.push("DENSITY_DIAGNOSTIC");return out;});
    try{const r=build(base);expect(r.integration.readerValidation.qualityIssues).toContain("DENSITY_DIAGNOSTIC");expect(r.integration.publishedEdition).toBe(COMPATIBILITY_RELEASE_VERSION);}finally{spy.mockRestore();}
  },120000);
  it("old paid pair JSON is replayed without applying the new editor",()=>{
    const old=JSON.parse(readFileSync("tests/fixtures/completed-report/compatibility-editorial-base.json","utf8"));
    expect(storedBook(old.snapshot)?.data).toEqual(old.book);expect(storedBook(old.snapshot,"https://example.test/r/old")?.data).toEqual(old.book);
    expect(v4Digest(old.book)).toBe(locks.compatibility[2]);
  });
  it("rejects forged roots, swapped direction, false relation and wrong personal sources",()=>{
    const n=normalizeReportInputPayload(base);if(!n.ok||n.value.kind!=="compatibility")return expect.unreachable();
    const input = n.value;
    const canonical=composeCompatibilityNarrative(base);if(!canonical.ok)return expect.unreachable();
    const views = Object.fromEntries((["personA","personB"] as const).map(slot=>{
      const p=input[slot],v=buildRelationshipProfiles({name:p.name,mbti:p.mbtiType,calculation:calculateCompatibilitySaju(p),context:{jobStatus:"",detailJob:"",relationshipStatus:"dating"}});
      if(!v.ok)return expect.unreachable();return [slot,projectRelationshipView(v.profiles)];
    })) as {personA:ReturnType<typeof projectRelationshipView>;personB:ReturnType<typeof projectRelationshipView>};
    const out=renderCompatibilityRelease(canonical.evidence,canonical.persons,views,projectCompatibilityPairView(views.personA,views.personB,canonical),canonical.narrative);
    const broken=structuredClone(out.draft);broken.chapters[1].paragraphs[0].sentences[0].individualEvidenceIds=["invented"];
    expect(validateCompatibilityRelease(broken,canonical.evidence,views,out.registry).hardErrors).toContain("CH02.P1:UNKNOWN_PERSONAL_ROOT");
    const reversed=structuredClone(out.draft);reversed.chapters[4].paragraphs[0].sentences[0].targetPersonId=canonical.evidence.persons.personA.personId;
    expect(validateCompatibilityRelease(reversed,canonical.evidence,views,out.registry).hardErrors).toContain("CH05.P1:REVERSED_DIRECTION");
    const fake=structuredClone(out.draft);fake.chapters[0].paragraphs[1].sentences[0].relationIds=["wonjin:invented"];
    expect(validateCompatibilityRelease(fake,canonical.evidence,views,out.registry).hardErrors).toContain("CH01.P2:INVENTED_PAIR_RELATION");
  },120000);
});


describe("Final assembly preserves complete compatibility Books", () => {
  // This actual pair produced a valid 36-paragraph reader edition, but five
  // non-romantic categories silently selected the older 23-paragraph edition.
  const payload = { ...base,
    personA: { ...base.personA, name: "강현우", birthDate: "1990-04-26", birthTime: "11:10", gender: "MALE", mbtiType: "INTP" },
    personB: { ...base.personB, name: "오지안", birthDate: "1994-12-05", birthTime: "06:50", gender: "FEMALE", mbtiType: "ESTJ" },
  };
  it.each(categories)("%s retains every supported paragraph despite phrase repetition", async relationshipType => {
    const generated = await generateV4ShadowReport({ ...payload, relationshipType }, SHADOW_CLOCK);
    if (!generated.ok) return expect.unreachable(JSON.stringify(generated));
    const e = generated.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "saju_mbti_compatibility" || !("integration" in e.composition.result)) return expect.unreachable();
    const result = e.composition.result, edition = result.integration.readerEdition;
    expect(result.integration.readerValidation.hardErrors).toEqual([]);
    expect(result.integration.publishedEdition).toBe(COMPATIBILITY_RELEASE_VERSION);
    expect(edition.chapters.map(c => c.paragraphs.length)).toEqual(Array(9).fill(4));
    if (!["love", "marriage"].includes(relationshipType)) expect(result.integration.readerEditorial)
      .toContainEqual({ severity: "Major", code: "REPEATED_LONG_PHRASE", location: "CH03.P1 / CH06.P3" });
    const book = projectBook(e); if (!book) return expect.unreachable("Book missing");
    expect(book.pages.flatMap(p => p.kind === "narrative" ? p.paragraphs.map(p => p.text) : []))
      .toEqual(edition.chapters.flatMap(c => c.paragraphs.map(p => p.text)));
    expect(book.pages.find(p => p.kind === "pair")?.directions).toHaveLength(2);
    expect(validateV4Publication("saju_mbti_compatibility", generated.draft, e)).toEqual({ ok: true, errors: [] });
  }, 120000);
  it.each([
    { severity: "Blocker" as const, code: "INTERNAL_SOURCE_EXPOSED" },
    { severity: "Blocker" as const, code: "UNSUPPORTED_GUARANTEE" },
    { severity: "Major" as const, code: "TECHNICAL_OR_META_COPY" },
  ])("still rejects $code in the new edition", issue => {
    const actual = editorialGuard.reviewNarrative;
    const spy = vi.spyOn(editorialGuard, "reviewNarrative").mockImplementation(report => {
      const issues = actual(report);
      return report.opening.some(b => b.id === "CH01.P1") ? [...issues, { ...issue, location: "text" }] : issues;
    });
    try { expect(build(payload).integration.publishedEdition).toBe(COMPATIBILITY_PRODUCT_VERSION); }
    finally { spy.mockRestore(); }
  }, 120000);
});
