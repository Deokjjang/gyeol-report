import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { LoveReportV3View } from "../../../src/app/reports/[reportId]/LoveReportV3View";
import { createLoveV3, validateLoveV3 } from "../../../src/lib/report-generation/loveV3Generation";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import { LOVE_V3_VERSION, LOVE_V3_POLISH_VERSION, loveV3CustomerText } from "../../../src/lib/interpretation-v3/loveEditorial";
import { buildLoveV3Polished } from "../../../src/lib/interpretation-v3/loveEditorialPolish";
import { LOVE_VOICES } from "../../../src/lib/interpretation-v3/loveEditorialContext";
import { storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { LOVE_V3_FIXTURES, loveFixture } from "./loveFixtures";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|ten_god_|day_pillar_|gwiin_|sinsal_|mbti:[A-Z]{4}:|loveEditorial(?:Polish)?:/;
const meta = /원국 안|원국 근거|이번 리포트|읽었습니다|읽습니다|읽는 대목|예측하는 숫자|실제 상대와의 궁합|자녀를 가질지 여부|(?:겁재|식신|화개|정관|편관|편인|정인|비견|상관|정재|편재)(?:의 힘)?(?:은|는) /;
const originals: Readonly<Record<string, string>> = {
  A: "133821ba44e09af82ed15f2f1c50bf8d6b87344b19a74ee278041af72dd0cca3", B: "e9c2673853da28e9d2e2ffd1311c1372d741b8a1fc8123feed59221f0119a074", C: "eef6a8b49f303076619445a81a5d6f5416ee51b3d9e8093840057240ce41bfda", D: "dc285bb1881256846eb158a401ea700e49f1c60e4f3902f2ba4b528a4e1b345b", E: "00eab56df695d56f0514e48f32a8b9856d1f4614a6cdfffe1e861661a8ddd842", F: "f6dddf17dac50738c2288fb3fbcb99b0a630e0406da601be17d525ba89e99444", G: "299bdbfcd053cab5565cb7ff6fb0021a38befa8d879e38bda8f772eb0065289d", H: "25e283803bb6a1f6b209d7be48e55f0739590e3146065edffd86038df05e9bb3", I: "de492659fb6bb59cf7e05eea4553c517c362c890c86a610dc839a0dab89d3d2c", J: "9749681b30a4832da05c4f1a65039f36ed1779c34da7c8d6c408103055e56d5d", K: "dcd5f0fa0a2c30aff9e187f85b350f53e97f4d897d02deb30a7e8630b4a2da6a", L: "0d0161843c8e762f123c557f3836e9d9286b6ed56ed1df2fd9bded5f35354ad2",
};
afterEach(() => expect(fetch).not.toHaveBeenCalled());

it.each(LOVE_V3_FIXTURES)("%s D2 publication/SSR retains facts and frozen D snapshot", (...row) => {
  const f = loveFixture(row), r = createLoveV3(f.payload)!, legacy = createLoveV3(f.payload, LOVE_V3_VERSION)!;
  expect(hash(legacy.draft)).toBe(originals[f.id]); expect(validateLoveV3(legacy.draft, legacy.evidencePacket)).toEqual([]);
  expect(r.evidencePacket).toEqual(legacy.evidencePacket); expect(r.draft.version).toBe(LOVE_V3_POLISH_VERSION);
  const { draft, evidencePacket } = r, { facts, calculation } = evidencePacket.loveV3;
  const scenes = draft.chapters.flatMap(c => c.scenes), text = loveV3CustomerText(draft);
  expect(draft.editorialAudit.errors).toEqual([]); expect(draft.editorialAudit.rejected).toEqual([]); expect(draft.editorialAudit.warnings).toEqual([]);
  expect(validateProductPublication("love_marriage_child", draft, evidencePacket, f.payload).errors).toEqual([]);
  expect(text).not.toMatch(meta); expect(text).not.toMatch(internals); expect(text).not.toMatch(/임신합니다|아들을|딸을|재회|이별 상태/);
  expect(draft.editorialAudit.audit.mix.character).toBeGreaterThan(0.75); expect(draft.editorialAudit.audit.mix.advice).toBeLessThan(0.25);
  expect(scenes.filter(s => s.parts.every(p => p.role === "character")).length / scenes.length).toBeGreaterThan(0.7);
  expect(new Set(scenes.map(s => s.parts.length)).size).toBeGreaterThanOrEqual(3); expect(new Set(scenes.map(s => s.form)).size).toBe(5);
  for (const scene of scenes) {
    const used = facts.filter(f => scene.evidenceRefs.includes(f.id));
    expect(used.length).toBe(scene.evidenceRefs.length);
    expect(used.every(f => f.certainty === "confirmed" && f.sourceRefs.length && f.lineage.length)).toBe(true);
    const natal = used.filter(f => !["mbti", "relation", "spouse_palace"].includes(f.kind));
    expect(natal.some(f => storySupport(f.featureId, facts, calculation).substantial)).toBe(true);
    for (const fact of natal.filter(f => !(scene.angle.endsWith("-supporting") && /dohwa|hongyeom/.test(f.featureId)))) expect(storySupport(fact.featureId, facts, calculation).substantial, `${scene.angle}/${fact.featureId}`).toBe(true);
  }
  expect(text.includes("도화")).toBe(f.dohwa); expect(text.includes("홍염")).toBe(f.hongyeom);
  expect(draft.chapters.at(-1)!.scenes[0].parts).toHaveLength(5);
  expect(draft.chapters.at(-1)!.scenes[0].parts.map(p => p.text).join(" ")).not.toMatch(/겁재|식신|정관|편관|편인(?:의|은|을|과)|정인|원국|읽었|기운|소통하세요|자기답게 사랑/);
  const snapshot = createProductPreviewSnapshot({ reportId: `love-d2-${f.id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "love_marriage_child", productSlug: "love-marriage-child", draft, evidencePacket });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const html = renderToStaticMarkup(createElement(LoveReportV3View, r)); expect(html).toContain(LOVE_V3_POLISH_VERSION); expect(html).not.toMatch(internals);
  const oldHtml = renderToStaticMarkup(createElement(LoveReportV3View, legacy)); expect(oldHtml).toContain(LOVE_V3_VERSION);
  expect(html.indexOf("data-love-input")).toBeLessThan(html.indexOf("리포트 목차")); expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(html.indexOf("data-story-signals")).toBeLessThan(html.indexOf('id="love-portrait"')); expect(html).toContain("data-all-signals");
  expect(draft.chapters.find(c => c.id === "parent")?.collapsed).toBe(!f.payload.userContext.focusAreas.includes("가족"));
  if (process.env.LOVE_D2_REVIEW_OUTPUT === "1") { writeFileSync(`/tmp/gyeol-love-d2-${f.id}.json`, JSON.stringify(r)); writeFileSync(`/tmp/gyeol-love-d2-${f.id}.txt`, text); }
});

it("Gaon redistributes actual heroes and preserves distinct, unadvised manifestations", () => {
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]), r = createLoveV3(payload)!, before = createLoveV3(payload, LOVE_V3_VERSION)!;
  const scenes = r.draft.chapters.flatMap(c => c.scenes), old = before.draft.chapters.flatMap(c => c.scenes);
  const jie = r.evidencePacket.loveV3.facts.find(f => f.featureId === "ten_god_jie_cai")!.id;
  expect(scenes.filter(s => s.evidenceRefs.includes(jie)).length).toBeLessThanOrEqual(4);
  expect(old.filter(s => s.evidenceRefs.includes(jie)).length).toBeGreaterThanOrEqual(13);
  const leads = scenes.map(s => s.evidenceRefs[0]);
  expect(new Set(leads).size).toBeGreaterThanOrEqual(9);
  expect(Math.max(...leads.map(id => leads.filter(ref => ref === id).length)) / scenes.length).toBeLessThan(0.35);
  for (const [angle, feature] of [["first-attraction", "ten_god_zheng_guan"], ["affection-method", "ten_god_shi_shen"], ["affection-method", "day_pillar_jeongchuk"], ["overuse", "ten_god_zheng_guan"], ["solitude-depth", "twelve_sinsal_hwagae"]]) expect(scenes.find(s => s.angle === angle)!.evidenceRefs).toContain(r.evidencePacket.loveV3.facts.find(f => f.featureId === feature)!.id);
  const text = loveV3CustomerText(r.draft);
  for (const phrase of ["유니폼", "친구는", "자막", "생활지도", "솔루션 센터", "달력", "작품 완성도", "사람복", "쉽게 꺼지지 않는 애정", "같은 편인 사람 앞에서는, 매번 이길 필요가 없습니다."]) expect(text).toContain(phrase);
  const html = renderToStaticMarkup(createElement(LoveReportV3View, r)); expect(html).toContain("子丑 육합"); expect(html).toContain("巳亥 충");
  expect(new Set(scenes.filter(s => s.parts.every(p => p.role === "character")).map(s => s.chapter)).size).toBe(9);
});

it("same chart selects six different state scenes and endings without new input states", () => {
  expect(RELATIONSHIP_STATUSES).toEqual(["", "single", "some", "dating", "marriage_preparing", "married"]);
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]), charts = new Set(), scenes = new Set(), bodies = new Set(), endings = new Set();
  for (const relationshipStatus of RELATIONSHIP_STATUSES) {
    const r = createLoveV3({ ...payload, userContext: { ...payload.userContext, relationshipStatus } })!;
    expect(validateLoveV3(r.draft, r.evidencePacket)).toEqual([]); charts.add(hash(r.evidencePacket.loveV3.calculation));
    const current = r.draft.chapters.find(c => c.id === "present")!;
    scenes.add(current.scenes.map(s => s.angle).join("/")); bodies.add(current.scenes.flatMap(s => s.parts.map(p => p.text)).join(" ")); endings.add(r.draft.chapters.at(-1)!.scenes[0].parts[2].text);
  }
  expect(charts.size).toBe(1); expect(scenes.size).toBe(6); expect(bodies.size).toBe(6); expect(endings.size).toBe(6);
});

it("12 charts × 16 MBTI plus unknown change actual behavior without changing facts", () => {
  const failures: unknown[] = [], endings = new Set();
  for (const row of LOVE_V3_FIXTURES) {
    const { payload, id } = loveFixture(row), voices = new Set(), charts = new Set();
    for (const mbtiType of [...Object.keys(LOVE_VOICES), ""]) {
      const r = createLoveV3({ ...payload, person: { ...payload.person, mbtiType } })!;
      const errors = validateLoveV3(r.draft, r.evidencePacket); if (errors.length) failures.push({ id, mbtiType, errors, audit: r.draft.editorialAudit });
      const fusion = r.draft.chapters[0].scenes.find(s => s.angle === "mbti-fusion");
      if (mbtiType) { expect(fusion).toBeTruthy(); voices.add(fusion!.parts[0].text); } else expect(fusion).toBeUndefined();
      charts.add(hash(r.evidencePacket.loveV3.calculation)); endings.add(r.draft.chapters.at(-1)!.scenes[0]?.parts.at(-1)?.text);
    }
    expect(voices.size).toBe(16); expect(charts.size).toBe(1);
  }
  expect(failures).toEqual([]); expect(endings.size).toBeGreaterThanOrEqual(6);
}, 30_000);

it("charm counterfactual distinguishes visible / intimate / both / neither and never promotes weak facts", () => {
  const make = (i: number, relationshipStatus: "single" | "dating") => { const { payload } = loveFixture(LOVE_V3_FIXTURES[i]); return createLoveV3({ ...payload, userContext: { ...payload.userContext, relationshipStatus } })!; };
  const dohwa = make(2, "single"), hong = make(3, "dating"), both = make(1, "single"), neither = make(0, "single");
  expect(loveV3CustomerText(dohwa.draft)).toContain("첫인상을 남기는 도화"); expect(loveV3CustomerText(dohwa.draft)).not.toContain("홍염");
  expect(loveV3CustomerText(hong.draft)).toContain("가까워질수록 매력이 커지는 홍염"); expect(loveV3CustomerText(hong.draft)).not.toContain("도화");
  expect(both.draft.chapters.find(c => c.id === "charm")!.scenes.map(s => s.angle)).toEqual(expect.arrayContaining(["dohwa-visible", "hongyeom-intimacy"]));
  expect(loveV3CustomerText(neither.draft)).not.toMatch(/도화|홍염/);
  for (const certainty of ["weak", "conditional"] as const) {
    const facts = both.evidencePacket.loveV3.facts.map(f => /dohwa|hongyeom/.test(f.featureId) ? { ...f, certainty } : f);
    const draft = buildLoveV3Polished({ name: "검수", mbti: "ENFP", relationshipStatus: "single", familyFocus: false, facts, calculation: both.evidencePacket.loveV3.calculation });
    expect(loveV3CustomerText(draft)).not.toMatch(/도화|홍염/);
  }
  expect(validateLoveV3({ ...both.draft, version: LOVE_V3_VERSION }, both.evidencePacket)).toContain("LOVE_V3_CONTENT_MISMATCH");
});
