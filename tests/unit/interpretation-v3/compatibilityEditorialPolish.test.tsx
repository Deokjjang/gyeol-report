import { writeFileSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { createCompatibilityV3, validateCompatibilityV3 } from "../../../src/lib/report-generation/compatibilityV3Generation";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { COMPATIBILITY_RELATIONSHIP_TYPES, MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { compatibilityV3CustomerText, COMPATIBILITY_V3_VERSION, COMPATIBILITY_V3_POLISHED_VERSION } from "../../../src/lib/interpretation-v3/compatibilityEditorial";
import { buildCompatibilityV3Polished, compactCompatibilityLabels } from "../../../src/lib/interpretation-v3/compatibilityPolished";
import { CompatibilityReportV3View } from "../../../src/app/reports/[reportId]/CompatibilityReportV3View";
import { COMPATIBILITY_V3_FIXTURES, compatibilityFixture } from "./compatibilityFixtures";

const forbidden = /\d+\s*(?:점|\/\s*100|%)|[★☆⭐]|(?:궁합|관계)\s*(?:점수|등급|랭킹)|[SABCDF]\s*등급|원국 근거|이번 리포트|읽었습니다|A가 부모라면|B가 부모라면|A가 상사라면|B가 상사라면/;
const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|lineage|ten_god_|gwiin_|sinsal_|pair:received|compatibility-fixed-ab/;

for (const { id, payload } of COMPATIBILITY_V3_FIXTURES) it(`E2 ${id}: publish / stored E1 / SSR / provenance`, () => {
  const r = createCompatibilityV3(payload)!, old = createCompatibilityV3(payload, COMPATIBILITY_V3_VERSION)!;
  expect(r.draft.version).toBe(COMPATIBILITY_V3_POLISHED_VERSION);
  for (const result of [r, old]) {
    expect(validateCompatibilityV3(result.draft, result.evidencePacket), JSON.stringify(result.draft.editorialAudit)).toEqual([]);
    expect(validateProductPublication(payload.productKey, result.draft, result.evidencePacket, payload)).toEqual({ ok: true, errors: [] });
    const snapshot = createProductPreviewSnapshot({ reportId: id, createdAtIso: "2026-09-29T00:00:00Z", productKey: payload.productKey, productSlug: payload.productSlug, ...result });
    expect(snapshot.ok).toBe(true);
    if (snapshot.ok) expect(isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
    const html = renderToStaticMarkup(createElement(CompatibilityReportV3View, result));
    expect(html).toContain(result.draft.version); expect(html).not.toMatch(internals);
    expect(html).not.toMatch(/계산 기준|근거 더 보기|전문 근거|천간·지장간의 십성|원국 전체의 파생 근거/u);
    expect(compatibilityV3CustomerText(result.draft)).not.toMatch(forbidden);
    expect(result.draft.chapters).toHaveLength(7);
  }
  expect(r.evidencePacket).toEqual(old.evidencePacket);
  for (const scene of r.draft.chapters.flatMap(c => c.scenes)) {
    const previous = old.draft.chapters.flatMap(c => c.scenes).find(s => s.id === scene.id)!;
    expect(scene.evidenceRefs).toEqual(previous.evidenceRefs);
    expect(scene.sourceRefs).toEqual(expect.arrayContaining([...previous.sourceRefs]));
    expect(scene.subject).toBe(previous.subject); expect(scene.toward).toBe(previous.toward);
  }
  const html = renderToStaticMarkup(createElement(CompatibilityReportV3View, r));
  const before = renderToStaticMarkup(createElement(CompatibilityReportV3View, old));
  const chips = (text: string) => [...text.matchAll(/aria-label="해석 근거">(.*?)<\/p>/g)].map(m => m[1]);
  expect(chips(html).join("").length).toBeLessThan(chips(before).join("").length / 2);
  expect(chips(html).length).toBeLessThan(chips(before).length);
  expect(chips(html).join("")).not.toContain(payload.personA.name);
  expect(chips(html).join("")).not.toContain(payload.personB.name);
  writeFileSync(`/tmp/gyeol-compatibility-e2-${id}.json`, JSON.stringify({ payload, ...r }, null, 2));
  writeFileSync(`/tmp/gyeol-compatibility-e2-${id}.txt`, compatibilityV3CustomerText(r.draft));
});

it("the first 800 characters, both directions, good pair and final paragraphs differ in all seven categories", () => {
  const starts: string[] = [], directionsA = new Set(), directionsB = new Set(), good = new Set(), endings = new Set(), invariants = new Set();
  const expected = { love: /끌림|애정|관심/, friendship: /친구|우정|근황/, businessPartner: /고객|위험|결정/, marriage: /결혼|집|생활/, parentChild: /부모|자녀|독립/, coworker: /동료|결과물|협업/, managerReport: /상사|팀원|지시/ };
  for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const r = createCompatibilityV3(compatibilityFixture(category))!, chapters = r.draft.chapters;
    const first = chapters[0].scenes.flatMap(s => s.parts.map(p => p.text)).join(" ").slice(0, 800);
    expect(first).toMatch(expected[category]); starts.push(first);
    for (const scene of chapters[1].scenes) {
      const text = scene.parts.map(p => p.text).join(" "); expect(text).toMatch(expected[category]);
      (scene.subject === "personA" ? directionsA : directionsB).add(text);
    }
    good.add(chapters.find(c => c.id === "assets")!.scenes.find(s => s.angle === "connection")!.parts[0].text);
    endings.add(chapters.at(-1)!.scenes[0].parts.at(-1)!.text);
    invariants.add(JSON.stringify(r.evidencePacket.compatibilityV3.editorial.invariant));
  }
  expect(new Set(starts).size).toBe(7); expect(directionsA.size).toBe(7); expect(directionsB.size).toBe(7); expect(good.size).toBe(7); expect(endings.size).toBe(7); expect(invariants.size).toBe(1);
  // No identical long sentence concealed by category names / different titles.
  for (let i = 0; i < starts.length; i++) for (let j = i + 1; j < starts.length; j++) {
    const sentences = starts[i].split(/(?<=[.!?])\s+/).filter(s => s.length > 35);
    expect(sentences.filter(s => starts[j].includes(s))).toEqual([]);
  }
  writeFileSync("/tmp/gyeol-compatibility-e2-first-impressions.txt", starts.map((s, i) => `${COMPATIBILITY_RELATIONSHIP_TYPES[i]}\n${s}`).join("\n\n"));
});

it("A/B swap preserves calculated facts and symmetric direction text; roles stay fixed", () => {
  for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const p = compatibilityFixture(category), a = createCompatibilityV3(p)!, b = createCompatibilityV3({ ...p, personA: p.personB, personB: p.personA })!;
    expect(validateCompatibilityV3(b.draft, b.evidencePacket), JSON.stringify(b.draft.editorialAudit)).toEqual([]);
    const ea = a.evidencePacket.compatibilityV3.editorial, eb = b.evidencePacket.compatibilityV3.editorial;
    expect(ea.invariant).toEqual(eb.invariant); expect(ea.direction.aToB).toEqual(eb.direction.bToA);
    const dir = (r: typeof a, slot: string) => r.draft.chapters[1].scenes.find(s => s.subject === slot)!.parts;
    expect(dir(a, "personA")).not.toEqual(dir(a, "personB"));
    if (category === "parentChild" || category === "managerReport") {
      const role = category === "parentChild" ? "부모" : "상사";
      expect(compatibilityV3CustomerText(a.draft)).toContain(`${role} ${p.personA.name}님`);
      expect(compatibilityV3CustomerText(b.draft)).toContain(`${role} ${p.personB.name}님`);
    } else {
      expect(dir(a, "personA")).toEqual(dir(b, "personB"));
      expect(a.draft.chapters[0].scenes[0].parts).toEqual(b.draft.chapters[0].scenes[0].parts);
      expect(a.draft.chapters.at(-1)!.scenes[0].parts).toEqual(b.draft.chapters.at(-1)!.scenes[0].parts);
    }
  }
});

it("289 MBTI combinations and 84 natal/category variants remain publishable with distinct behavior", () => {
  const failures: unknown[] = [], behavior = new Set(), invariants = new Set();
  for (const a of MBTI_TYPES) for (const b of MBTI_TYPES) {
    const p = compatibilityFixture(), r = createCompatibilityV3({ ...p, personA: { ...p.personA, mbtiType: a }, personB: { ...p.personB, mbtiType: b } })!;
    const errors = validateCompatibilityV3(r.draft, r.evidencePacket);
    if (errors.length) failures.push({ a, b, errors, qa: r.draft.editorialAudit });
    if (b === "INFJ") behavior.add(JSON.stringify(r.draft.chapters[1].scenes[0].parts));
    invariants.add(JSON.stringify(r.evidencePacket.compatibilityV3.editorial.invariant));
    if (!a) expect(r.evidencePacket.compatibilityV3.editorial.facts.filter(f => f.subject === "personA" && f.kind === "mbti")).toEqual([]);
  }
  for (let i = 0; i < 12; i++) for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const r = createCompatibilityV3(compatibilityFixture(category, i, (i + 3) % 12))!;
    const errors = validateCompatibilityV3(r.draft, r.evidencePacket);
    if (errors.length) failures.push({ i, category, errors, qa: r.draft.editorialAudit });
  }
  expect(failures).toEqual([]); expect(behavior.size).toBe(MBTI_TYPES.length); expect(invariants.size).toBe(1);
}, 30_000);

it("preserves actual first-impression dohwa vs intimate hongyeom; weak charms never become heroes", () => {
  for (const [i, dohwa, hongyeom] of [[0, false, false], [1, true, true], [2, true, false], [3, false, true]] as const) {
    const r = createCompatibilityV3(compatibilityFixture("love", i, 4))!, text = compatibilityV3CustomerText(r.draft);
    expect(text.includes("도화")).toBe(dohwa); expect(text.includes("홍염")).toBe(hongyeom);
    if (dohwa) expect(text).toContain("첫인상에서 시선을 끄는"); if (hongyeom) expect(text).toContain("가까워질수록 매력이 짙어지는");
    const e = r.evidencePacket.compatibilityV3.editorial, excluded = e.facts.filter(f => /dohwa|hongyeom/.test(f.featureId)).map(f => f.id);
    const weak = buildCompatibilityV3Polished({ ...e, substantial: e.substantial.filter(id => !excluded.includes(id)) }, "love");
    expect(compatibilityV3CustomerText(weak)).not.toMatch(/도화|홍염/);
  }
});

it("compacts public chips without extra relations, unknown types or hidden internal labels", () => {
  const r = createCompatibilityV3(compatibilityFixture())!, e = r.evidencePacket.compatibilityV3.editorial;
  const opening = compactCompatibilityLabels(r.draft.chapters[0].scenes[0], e.facts, r.draft.people);
  expect(opening).toEqual(["ENTJ × INFJ", "편관↔편재"]);
  const connection = r.draft.chapters.find(c => c.id === "assets")!.scenes.find(s => s.angle === "connection")!;
  expect(compactCompatibilityLabels(connection, e.facts, r.draft.people)).toEqual(expect.arrayContaining(["반합"]));
  const p = compatibilityFixture();
  for (const personA of [{ ...p.personA, birthTime: "", birthTimeUnknown: true, mbtiType: "" }, { ...p.personA, name: p.personB.name }]) {
    const result = createCompatibilityV3({ ...p, personA })!;
    expect(validateCompatibilityV3(result.draft, result.evidencePacket)).toEqual([]);
    expect(renderToStaticMarkup(createElement(CompatibilityReportV3View, result))).not.toMatch(internals);
  }
});

it("new generation selects E2 without provider calls and rejects version substitution", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("NO_EXTERNAL_CALLS"));
  try {
    const p = compatibilityFixture(), result = await generateProductReport(p, { enabled: false, reason: "flag_disabled" }, "normal_writer");
    expect(result.ok).toBe(true); expect(result.externalCalls).toEqual([]);
    if (result.ok) expect(result.draft).toHaveProperty("version", COMPATIBILITY_V3_POLISHED_VERSION);
    const r = createCompatibilityV3(p)!;
    expect(validateCompatibilityV3({ ...r.draft, version: COMPATIBILITY_V3_VERSION }, r.evidencePacket)).toContain("COMPATIBILITY_V3_CONTENT_MISMATCH");
    expect(fetchMock).not.toHaveBeenCalled();
  } finally { fetchMock.mockRestore(); }
  // The frozen E1 composer and copy are still the snapshot replay boundary.
  expect(readFileSync("src/lib/report-generation/compatibilityV3Generation.ts", "utf8")).toContain("draft.version === COMPATIBILITY_V3_VERSION ? buildCompatibilityV3 : buildCompatibilityV3Polished");
});
