import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildComprehensiveFinal, buildComprehensiveV32, comprehensiveV3CustomerText, isComprehensiveV3Draft, type ComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { FINAL_COMPREHENSIVE_VERSION } from "../../../src/lib/interpretation-v3/comprehensiveExperience";
import { REALITY_VOICES, ALTERNATE_REALITY_VOICES, LOVE_VOICES, PRECISION_VOICES } from "../../../src/lib/interpretation-v3/comprehensiveExperienceCopy";
import { publicSignalRows } from "../../../src/lib/interpretation-v3/comprehensivePublicSignals";
import { compoundProminence, storySupport, validateStoryCopy } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { adaptMbti } from "../../../src/lib/interpretation-v3/evidence";
import { ComprehensiveReportV3View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV3View";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";
import type { Evidence } from "../../../src/lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../src/lib/saju/types";

const runtime = { enabled: false, reason: "flag_disabled" } as const;
// Frozen V3.2-final contract; comprehensiveDepth tests the current product path.
const generate = async (payload: unknown) => {
  const result = await generateProductReport(payload, runtime, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
  if (!result.ok || !isComprehensiveV3Draft(result.draft)) return result;
  const p = payload as ReturnType<typeof comprehensiveFixture>["payload"], packet = result.evidencePacket as Packet;
  return { ...result, draft: buildComprehensiveFinal({ name: p.person.name, facts: packet.comprehensiveV3.facts, calculation: packet.comprehensiveV3.calculation,
    context: normalizeContext({ lifeStatus: p.userContext.jobStatus, fieldLabel: p.userContext.detailJob, relationshipStatus: p.userContext.relationshipStatus }),
    relationshipStatus: p.userContext.relationshipStatus, profileTable: result.draft.profileTable }) };
};
const blocks = (d: ComprehensiveV3Draft) => [...d.opening, ...d.sections.flatMap(s => s.blocks)];
const sha = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
type Packet = { comprehensiveV3: { facts: Evidence[]; calculation: SajuCalcResult } };
const hashes = ["f93902ae717375927abab561606064cbe9a1ef3ca77638232f71ddcd9dad1330", "c389fddcfcfc99d4c8655d3ad6f90eef2020f4e71dba79fd68c657b43d25c6f3", "48b1889a6b647e0bd4f3093f17ce8066edc7ce886f4213a004010ef5e6f3a5cb", "bc17864b80cbecd775ea61e8bc7c6a1ce09f256d57fd99a34c3f6a3a49ddcb7b", "7db2cc2ffa63d5ed2a4a507a111497b55d7dd16c7e823c76b202d55895b31f45", "baf005f4821fac1a08f90f52db1c1ddf2bb4457bb28e538d6a7891b60cc7b562"];
const internals = /canonical-|SajuCalcResult:|v1:|ten_god_|day_pillar_|gwiin_|sinsal_|mbti:[A-Z]{4}:|comprehensiveStorytelling:/;
const endings: string[] = [], archetypes = new Set<string>();
afterEach(() => expect(fetch).not.toHaveBeenCalled());

it.each(COMPREHENSIVE_V3_FIXTURES)("%s final experience and stored V3.2 compatibility", async (...row) => {
  const { id, payload } = comprehensiveFixture(row), result = await generate(payload);
  expect(result.ok, JSON.stringify(result.ok ? null : result)).toBe(true); if (!result.ok || !isComprehensiveV3Draft(result.draft)) return;
  const draft = result.draft, { facts, calculation } = (result.evidencePacket as Packet).comprehensiveV3;
  const input = { name: payload.person.name, facts, calculation, profileTable: draft.profileTable, context: normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob, relationshipStatus: payload.userContext.relationshipStatus }), relationshipStatus: payload.userContext.relationshipStatus };
  const before = buildComprehensiveV32(input), text = comprehensiveV3CustomerText(draft), bs = blocks(draft);
  expect(sha(before)).toBe(hashes[id.charCodeAt(0) - 65]);
  expect(validateProductPublication("saju_mbti_full", JSON.parse(JSON.stringify(before)), result.evidencePacket).ok).toBe(true);
  expect(draft.version).toBe(FINAL_COMPREHENSIVE_VERSION);
  expect(validateProductPublication("saju_mbti_full", JSON.parse(JSON.stringify(draft)), result.evidencePacket).ok).toBe(true);
  expect(validateStoryCopy(text)).toEqual([]);
  const examples = bs.flatMap(b => b.relatable ? [b.relatable] : []);
  const q = (text.match(/\?/g) ?? []).length;
  expect(q, id).toBeGreaterThanOrEqual(3); expect(q, id).toBeLessThanOrEqual(6);
  expect(examples.length).toBeGreaterThanOrEqual(3); expect(examples.length).toBeLessThanOrEqual(6);
  expect(new Set(examples.map(e => e.id)).size).toBe(examples.length);
  expect(new Set(examples.map(e => e.text)).size).toBe(examples.length);
  const oldSelected = new Set(blocks(before).flatMap(b => b.evidenceRefs));
  for (const e of examples) for (const ref of e.evidenceRefs) {
    const f = facts.find(f => f.id === ref)!; expect(f, e.id).toBeDefined(); expect(f.certainty).toBe("confirmed");
    if (f.kind !== "mbti") { expect(oldSelected.has(f.id), e.id).toBe(true); expect(storySupport(f.featureId, facts, calculation).substantial, e.id).toBe(true); }
    expect(f.sourceRefs.length).toBeGreaterThan(0);
  }
  for (const b of bs.filter(b => b.kind === "compound" && b.prominence === "hero")) expect(compoundProminence(b, input).prominence, b.id).toBe("hero");
  expect(bs.some((b, i) => i > 0 && b.writingMode === bs[i - 1].writingMode)).toBe(false);
  const rows = publicSignalRows(facts, calculation, draft);
  expect(rows.length).toBeGreaterThanOrEqual(10); expect(JSON.stringify(rows)).not.toMatch(internals);
  expect(rows.map(r => r.power).join(" ")).not.toContain("확인된 위치와 함께 읽는 성향의 단서");
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: result.evidencePacket }));
  expect(html).not.toContain("리포트를 준비하고 있습니다"); expect(html).not.toMatch(internals); expect(html).not.toContain("위치·출처");
  expect(html).toContain("전체 기운 보기"); expect(html).toContain("data-all-signals");
  expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(draft.direction.split("\n\n")).toHaveLength(4);
  endings.push(draft.direction.split("\n\n").at(-1)!); archetypes.add(draft.directionArchetype!);
  if (id === "F") { expect(new Set(endings).size).toBe(6); expect(archetypes.size).toBeGreaterThanOrEqual(4); }
  if (id === "E") expect(examples.flatMap(e => e.evidenceRefs)).not.toContainEqual(expect.stringContaining("mbti:"));
  if (process.env.FINAL_REVIEW_OUTPUT === "1") { writeFileSync(`/tmp/gyeol-final-${id}.json`, JSON.stringify(result)); writeFileSync(`/tmp/gyeol-final-${id}.txt`, text); }
  process.stdout.write(JSON.stringify({ id, chars: text.length, examples: examples.map(e => e.id), questions: q, archetype: draft.directionArchetype, rows: rows.length, oldChars: comprehensiveV3CustomerText(before).length }) + "\n");
});

it("all 16 MBTI voices use real source traits, not a type-only fallback", () => {
  for (const v of [...REALITY_VOICES, ...ALTERNATE_REALITY_VOICES, ...LOVE_VOICES, ...PRECISION_VOICES]) {
    const facts = adaptMbti(v.trait.split(":")[0]); expect(facts.some(f => f.featureId === `mbti:${v.trait.replace(":", ":traits:")}`), v.trait).toBe(true);
    expect(v.text.split(/(?<=[.?])\s+/).length).toBeLessThanOrEqual(2);
  }
  expect(new Set(REALITY_VOICES.map(v => v.trait.split(":")[0])).size).toBe(16);
});

it("same natal chart changes lived behavior across 16 types; unknown never receives a type", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const texts: string[] = [], customerTexts: string[] = [], natal: unknown[] = [];
  for (const mbtiType of [...REALITY_VOICES.map(v => v.trait.split(":")[0]), ""]) {
    const r = await generate({ ...payload, person: { ...payload.person, mbtiType } }); expect(r.ok, mbtiType + JSON.stringify(r.ok ? "" : r)).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) continue;
    const examples = blocks(r.draft).flatMap(b => b.relatable ? [b.relatable] : []);
    texts.push(examples.map(e => e.text).join("\n")); natal.push((r.evidencePacket as Packet).comprehensiveV3.calculation);
    customerTexts.push(comprehensiveV3CustomerText(r.draft));
    if (process.env.FINAL_REVIEW_OUTPUT === "1") process.stdout.write(JSON.stringify({ type: mbtiType || "unknown", body: sha(customerTexts.at(-1)), examples: examples.map(e => e.id) }) + "\n");
    if (!mbtiType) expect(examples.flatMap(e => e.evidenceRefs).some(id => id.includes("mbti:"))).toBe(false);
  }
  expect(new Set(natal.map(sha)).size).toBe(1);
  // No forced scene where the chart has no substantial matching signal.
  expect(new Set(texts).size).toBeGreaterThanOrEqual(16);
  expect(new Set(customerTexts).size).toBe(17);
});

it("same strong hyeonchim becomes correction planning for ENTJ and value boundaries for INFP", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[3]);
  const texts: string[] = [];
  for (const mbtiType of ["ENTJ", "INFP"]) {
    const r = await generate({ ...payload, person: { ...payload.person, mbtiType } }); expect(r.ok).toBe(true); if (r.ok && isComprehensiveV3Draft(r.draft)) texts.push(comprehensiveV3CustomerText(r.draft));
  }
  expect(texts[0]).toContain("고치는 순서까지"); expect(texts[1]).toContain("내 가치를 건드리면");
});

it("student/unknown contexts do not inherit adult work scenes, and examples are deterministic", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[3]);
  for (const [birthDate, jobStatus] of [["2010-03-22", "student"], ["1984-06-15", "other"]]) {
    const p = { ...payload, person: { ...payload.person, birthDate }, userContext: { ...payload.userContext, jobStatus, detailJob: "", relationshipStatus: "single" } };
    const a = await generate(p), b = await generate(p); expect(a.ok).toBe(true); if (a.ok && b.ok) expect(a.draft).toEqual(b.draft);
    if (!a.ok || !isComprehensiveV3Draft(a.draft)) continue;
    const t = comprehensiveV3CustomerText(a.draft); expect(t).not.toMatch(/승진|직장 상사|퇴근|연봉|결혼 생활|배우자와|납품|견적|계약 규모/);
  }
});

it("96 natal/type combinations publish and render distinct evidence-led reports without changing the calculation", async () => {
  const rows: { fixture: string; type: string; body: string; examples: number; questions: number; archetype: string | undefined }[] = [];
  const byType = new Map<string, Set<string>>();
  for (const row of COMPREHENSIVE_V3_FIXTURES) {
    const { id, payload } = comprehensiveFixture(row), natal = new Set<string>(), bodies = new Set<string>();
    for (const mbtiType of REALITY_VOICES.map(v => v.trait.split(":")[0])) {
      const r = await generate({ ...payload, person: { ...payload.person, mbtiType } });
      expect(r.ok, `${id}/${mbtiType}`).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) continue;
      const d = r.draft, packet = (r.evidencePacket as Packet).comprehensiveV3, text = comprehensiveV3CustomerText(d);
      expect(validateProductPublication("saju_mbti_full", JSON.parse(JSON.stringify(d)), r.evidencePacket).ok, `${id}/${mbtiType}`).toBe(true);
      const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft: d, evidencePacket: r.evidencePacket }));
      expect(html).not.toMatch(internals); expect(validateStoryCopy(text)).toEqual([]);
      const scenes = blocks(d).flatMap(b => b.relatable ? [b.relatable] : []);
      expect(new Set(scenes.map(e => e.text)).size).toBe(scenes.length);
      for (const e of scenes) for (const ref of e.evidenceRefs) {
        const f = packet.facts.find(f => f.id === ref)!;
        expect(f?.certainty, `${id}/${mbtiType}/${e.id}`).toBe("confirmed");
        if (f.kind !== "mbti") expect(storySupport(f.featureId, packet.facts, packet.calculation).substantial).toBe(true);
      }
      for (const b of d.sections.flatMap(s => s.blocks)) expect((b.paragraphs ?? []).join("").length + b.action.length + (b.ideas?.join("").length ?? 0), `${id}/${mbtiType}/${b.id}`).toBeGreaterThan(0);
      const questions = (text.match(/\?/g) ?? []).length;
      expect(questions, `${id}/${mbtiType}`).toBeGreaterThanOrEqual(3); expect(questions).toBeLessThanOrEqual(6);
      natal.add(sha(packet.calculation)); bodies.add(sha(text));
      const normalized = text.replaceAll(payload.person.name, "이름");
      if (!byType.has(mbtiType)) byType.set(mbtiType, new Set());
      byType.get(mbtiType)!.add(sha(normalized));
      rows.push({ fixture: id, type: mbtiType, body: sha(normalized), examples: scenes.length, questions, archetype: d.directionArchetype });
    }
    if (process.env.FINAL_REVIEW_OUTPUT === "1") writeFileSync("/tmp/gyeol-final-matrix.json", JSON.stringify(rows, null, 2));
    expect(natal.size, id).toBe(1); expect(bodies.size, id).toBe(16);
  }
  for (const [type, bodies] of byType) expect(bodies.size, type).toBe(6);
  if (process.env.FINAL_REVIEW_OUTPUT === "1") writeFileSync("/tmp/gyeol-final-matrix.json", JSON.stringify(rows, null, 2));
}, 30000);
