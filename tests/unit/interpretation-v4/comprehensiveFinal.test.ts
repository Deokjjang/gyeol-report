import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { fixtureInput, NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { comprehensiveReadingAllowed, planComprehensive, comprehensiveGoodPair } from "../../../src/lib/interpretation-v4/comprehensivePlan";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { COMPREHENSIVE_STAGE_MEANINGS } from "../../../src/app/dev/book-preview/comprehensiveBook";
import type { V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { selectSignature } from "../../../src/lib/interpretation-v4/narrativeSignatures";

export const COMPREHENSIVE_GOLDENS = [
  { id: "dakyeong", name: "다경", date: "1987-09-24", time: "11:36", gender: "FEMALE" as const, mbti: "ENFJ", context: { jobStatus: "freelancer" as const, detailJob: "행사 진행자·문화 프로그램 기획자", relationshipStatus: "single" as const } },
  ...[0, 1, 3, 6, 11].map(i => NARRATIVE_FIXTURES[i]),
];

describe("Comprehensive final pass — actual calculated goldens", () => {
  it.each(COMPREHENSIVE_GOLDENS)("$id generates and exports the whole person", f => {
    const result = composeComprehensiveNarrative(fixtureInput(f));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const text = narrativeText(result.narrative);
    expect(result.editorial).toEqual([]);
    expect(result.contentPlan.coreGyeol.tensionReviewed).toBe(true);
    expect(result.contentPlan.coreGyeol.features.length).toBeGreaterThan(1);
    const chapters = [{ id: "core", blocks: result.narrative.opening }, ...result.narrative.sections];
    const domains = {
      identity: ["core", "portrait"], thinking: ["private"], action: ["work"], strength: ["strengths"],
      goodFortune: ["fortune"], weakness: ["shadow"], people: ["relationships"], work: ["work"],
      money: ["money"], love: ["love"], recovery: ["environment"], lifeStrategy: ["direction"],
    };
    for (const [domain, ids] of Object.entries(domains)) {
      expect(chapters.some(s => ids.includes(s.id) && s.blocks.length > 0), domain).toBe(true);
    }
    expect(text).toMatch(/음.*양|여덟 글자/);
    expect(result.contentAudit.evidenceDiversity).toBeGreaterThan(8);
    expect(result.contentAudit.endingRuns).toEqual([]);
    expect(result.narrative.sections.at(-1)?.blocks.length).toBeGreaterThanOrEqual(3);
    expect(result.narrative.sections.at(-1)?.blocks.length).toBeLessThanOrEqual(5);
    expect(text).not.toMatch(/사주도 .*같은 말을|정인의 현실적인 결|흙을 만지는 원예|토.*재물복/);
    if (["04-daeun", "07-nayeong"].includes(f.id)) expect(result.contentPlan.coreGyeol.tension).toBe("inner-outer-rhythm");
    if (!f.mbti) expect(result.contentAudit.mbtiTraitDiversity).toBe(0);
    const phase = process.env.V4_COMPREHENSIVE_REVIEW;
    if (phase === "before" || phase === "after") {
      const dir = `/tmp/gyeol-phase13c1/${phase}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/${f.id}.json`, JSON.stringify(result, null, 2));
      writeFileSync(`${dir}/${f.id}.md`, narrativeText(result.narrative));
    }
  });
  it("Dakyeong: a person, two precise lenses, money relation and one substantial people-luck chapter", () => {
    const r = composeComprehensiveNarrative(fixtureInput(COMPREHENSIVE_GOLDENS[0]));
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.contentPlan.wealthElements).toEqual(["METAL"]);
    expect(r.contentPlan.yinYang).toMatchObject({ yin: 4, yang: 4 });
    expect(r.contentPlan.coreGyeol.tension).toBe("precision-and-delivery");
    expect(r.contentPlan.coreGyeol.goodForce).toEqual(["gwiin_cheoneul", "sinsal_dohwa", "twelve_sinsal_jangseong"]);
    const all = [{ id: "core", blocks: r.narrative.opening }, ...r.narrative.sections];
    expect(all.filter(s => s.blocks.some(b => /사람복|조언과 소개|사람을 통해.*길/.test(b.text))).map(s => s.id)).toEqual(["fortune"]);
    const money = r.narrative.sections.find(s => s.id === "money")!;
    const fusion = money.blocks.find(b => b.id.includes("synthesis"))!;
    expect(fusion.proof.features).toEqual(["ten_god_zheng_cai"]);
    expect(fusion.proof.sourceRefs).toContain("mbti:ENFJ:traits:money:generous_spending");
    expect(fusion.text).toContain("두 이유가 다른");
    expect(r.narrative.sections.find(s => s.id === "work")?.blocks.map(b => b.text).join(" ")).toContain("행사 진행자·문화 프로그램 기획자");
    expect(r.narrative.sections.find(s => s.id === "environment")?.blocks.map(b => b.text).join(" ")).toMatch(/화의 비중이 강.*토의 비중은 약/);
    expect(r.narrative.finalLine).toMatch(/다경.*반응.*시간의 값.*내 자리/);
    expect(r.narrative.finalProof.features).toEqual(expect.arrayContaining(["sinsal_hyeonchim", "ten_god_zheng_cai", "twelve_sinsal_jangseong"]));
    expect(r.contentAudit.mbtiTraitDiversity).toBeGreaterThanOrEqual(4);
    const strengths = r.narrative.sections.find(s => s.id === "strengths")!;
    expect(strengths.blocks.some(b => b.proof.features.includes("gwiin_taegeuk"))).toBe(true);
    expect(narrativeText(r.narrative).match(/커튼을 열자 방 안까지 들어오는 햇빛/g)).toHaveLength(1);
  });
  it("rejects forced domain links rather than attaching every named MBTI trait", () => {
    expect(comprehensiveReadingAllowed("money", "money", "ten_god_zheng_yin")).toBe(false);
    expect(comprehensiveReadingAllowed("money", "study", "ten_god_zheng_cai")).toBe(false);
    expect(comprehensiveReadingAllowed("identity", "money", "ten_god_zheng_cai")).toBe(false);
    expect(comprehensiveReadingAllowed("money", "money", "ten_god_zheng_cai")).toBe(true);
    expect(comprehensiveReadingAllowed("study", "study", "ten_god_zheng_yin")).toBe(true);
  });
  it("a missing or held helper cannot manufacture the three-force good combination", () => {
    const input = fixtureInput(COMPREHENSIVE_GOLDENS[0]), r = composeComprehensiveNarrative(input);
    if (!r.ok) throw Error("golden generation");
    for (const missing of ["gwiin_cheoneul", "sinsal_dohwa", "twelve_sinsal_jangseong"]) {
      const packet = { ...r.materials, selected: r.materials.selected.filter(m => m.feature !== missing) };
      const state = { input, packet, pillar: packet.selected.find(m => m.material.category === "dayPillar")!, master: packet.selected.find(m => m.material.category === "dayMaster")!, usedSeeds: new Set<string>(), featureUses: new Map<string, number>() };
      expect(comprehensiveGoodPair(planComprehensive(input, packet, selectSignature(state)))).toEqual([]);
      const held = { ...r.materials, selected: r.materials.selected.map(m => m.feature === missing
        ? { ...m, evidence: m.evidence.map(d => ({ ...d, usable: false })) } : m) };
      expect(comprehensiveGoodPair(planComprehensive(input, held, selectSignature({ ...state, packet: held })))).toEqual([]);
    }
  });
  it.each(COMPREHENSIVE_GOLDENS)("$id actual packet/book: whole prose, compact glossary, distinct stable indexes", async f => {
    const r = await generateV4ShadowReport(singleRuntimeInput("saju_mbti_full", "saju-mbti-full", f), SHADOW_CLOCK);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.externalCalls).toEqual([]);
    const book = projectBook(r.evidencePacket as V4RuntimeEvidence)!;
    const front = book.pages[1], end = book.pages.at(-2)!;
    if (front.kind !== "contents" || end.kind !== "contents") throw Error("indexes missing");
    expect(front.entries).toHaveLength(6);
    expect(end.entries.length).toBeGreaterThan(12);
    for (const entry of [...front.entries, ...end.entries]) expect(book.pages[entry.page].anchors).toContain(entry.targetId);
    const appendix = book.pages.filter(p => p.kind === "appendix");
    expect(appendix).toHaveLength(1);
    expect(appendix[0].title).toBe("내 모든 기운");
    expect(new Set(appendix[0].items.map(i => i.name)).size).toBe(appendix[0].items.length);
    for (const item of appendix[0].items.filter(i => i.group === "십이운성")) expect(item.meaning).toBe(COMPREHENSIVE_STAGE_MEANINGS[item.name]);
    const definitions = book.pages.flatMap(p => p.kind === "narrative" ? p.notes.map(n => n.name) : []);
    expect(new Set(definitions).size).toBe(definitions.length);
    expect(book.pages.filter(p => p.kind === "narrative").every(p => p.paragraphs.length > 1)).toBe(true);
    const serialized = JSON.stringify(book);
    expect(serialized).not.toMatch(/sourceRefs|provenance|v4_structure:|ten_god_|undefined/);
    if (process.env.V4_COMPREHENSIVE_REVIEW === "after") writeFileSync(`/tmp/gyeol-phase13c1/after/${f.id}.book.json`, JSON.stringify(book, null, 2));
  });
  it("all twelve stages have different plain meanings; no name-only appendix entry", () => {
    expect(Object.keys(COMPREHENSIVE_STAGE_MEANINGS)).toHaveLength(12);
    expect(new Set(Object.values(COMPREHENSIVE_STAGE_MEANINGS)).size).toBe(12);
    for (const value of Object.values(COMPREHENSIVE_STAGE_MEANINGS)) expect(value.length).toBeGreaterThan(25);
  });
});
