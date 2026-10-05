import contentBaseline from "./productNarrativeBaseline.json";
import { createHash } from "node:crypto";
import { describe, it, expect, vi } from "vitest";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { majorNarrativeEvidence } from "../../../src/lib/interpretation-v4/majorEvidence";
import { createMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { calculateCustomerDayun } from "../../../src/lib/saju/customerDayun";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { MAJOR_NARRATIVE_FIXTURES as fixtures, MAJOR_EVALUATED_AT as at } from "./majorFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES as pairs } from "./compatibilityFixtures";

// Reviewed Phase 7A pair prose. Original Phase 5C and immutable evidence/proof
// hashes are preserved in finalEditorialBaseline.json, alongside the other products.
const PAIR_HASHES = Object.entries(contentBaseline.rows).filter(([id]) => id.startsWith("compatibility-")).sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => row.after);
const must = async (payload: unknown, time = at) => { const r = await composeMajorFortuneNarrative(payload, time); expect(r.ok).toBe(true); if (!r.ok) return null!; return r; };
describe("Major canonical calculation, isolation and evidence", () => {
  it.each(pairs.map((f, i) => ({ ...f, hash: PAIR_HASHES[i] })))("$id: Compatibility V4 hash unchanged", ({ payload, hash }) => {
    const r = composeCompatibilityNarrative(payload); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex")).toBe(hash);
  });
  it.each(fixtures)("$id: reuse V3 horizon, exact boundaries, annual facts and input without mutation", async ({ payload }) => {
    const frozen = JSON.stringify(payload), original = await createMajorFortuneV3(payload, { now: () => new Date(at) });
    const r = await must(payload), again = await must(payload);
    expect(r).toEqual(again); expect(JSON.stringify(payload)).toBe(frozen);
    expect(await createMajorFortuneV3(payload, { now: () => new Date(at) })).toEqual(original);
    expect(r.evidence.horizon.rows).toEqual(original!.draft.horizon!.rows);
    expect(r.evidence.horizon.activeCycle).toEqual(original!.draft.horizon!.activeCycle);
    for (const t of r.transitions) {
      const old = original!.draft.horizon!.transitions.find(x => x.year === t.year)!;
      expect(t.startSolarKst).toBe(old.startSolarKst); expect(t.startSolarRange).toEqual(old.startSolarRange);
      expect(t.before).toEqual(old.before); expect(t.after).toEqual(old.after);
      expect(t.blocks.length).toBeGreaterThanOrEqual(4);
      expect(r.narrative.sections.find(s => s.id === `year-${t.year}`)?.title).toContain(`${t.before.ganji} → ${t.after.ganji}`);
      expect(t.blocks[0].proof.sourceRefs).toContain(`dayun-cycle:${t.after.index}:${t.after.ganji}`);
    }
    const stem = r.evidence.calculation.pillars.day!.stem;
    for (const y of r.years) {
      const annual = getAnnualGanjiInfo(y.year);
      expect(y.annual.ganji).toBe(annual.ganji);
      expect(y.annual.tenGod).toBe(getTenGodForStemPair(stem, annual.stem));
      expect(y.age).toBe(y.year - Number(payload.person.birthDate.slice(0, 4)) + 1);
      expect(y.timePosition).toBe(y.year < 2026 ? "past" : y.year === 2026 ? "current" : "future");
      expect(y.proof.sourceRefs).toEqual(expect.arrayContaining([...y.annual.evidenceIds]));
      const relations = [...y.annual.cycleRelations, ...y.annual.natalRelations];
      if (y.selectedRelation.harmony) expect(relations).toContainEqual(y.selectedRelation.harmony);
      if (y.selectedRelation.tension) expect(relations).toContainEqual(y.selectedRelation.tension);
      if (y.timePosition === "past") expect(y.blocks.map(b => b.text).join(" ")).not.toMatch(/앞으로 이 해에는|내년에는/);
    }
  });
  it("current cycle changes at the canonical instant, not January 1 or the year label", async () => {
    const base = await must(fixtures[2].payload), t = base.transitions[0];
    const instant = Date.parse(t.startSolarKst!);
    const before = await must(fixtures[2].payload, new Date(instant - 1).toISOString());
    const after = await must(fixtures[2].payload, new Date(instant).toISOString());
    expect(before.evidence.horizon.activeCycle?.index).toBe(t.before.index);
    expect(after.evidence.horizon.activeCycle?.index).toBe(t.after.index);
    expect(before.narrative.opening[0].text).toContain(t.before.ganji);
    expect(after.narrative.opening[0].text).toContain(t.after.ganji);
    expect(before.years.find(y => y.year === t.year)?.beforeCycle?.index).toBe(t.before.index);
  });
  it("all MBTI types keep the very same calendar; behavior requires actual reviewed Fusion", async () => {
    const base = await must(fixtures[0].payload);
    for (const mbtiType of MBTI_TYPES) {
      const r = await must({ ...fixtures[0].payload, person: { ...fixtures[0].payload.person, mbtiType } });
      expect(r.evidence.years).toEqual(base.evidence.years);
      for (const basis of r.behaviorBasis) expect(r.materials.fusions.some(f => f.ruleId === basis!.rule)).toBe(true);
      expect(r.editorial.filter(i => i.severity === "Blocker")).toEqual([]);
      if (!mbtiType) { expect(r.behaviorBasis).toEqual([]); expect(r.materials.fusions).toEqual([]); }
    }
    const changed = await must({ ...fixtures[0].payload, person: { ...fixtures[0].payload.person, mbtiType: "ENTJ" } });
    expect(changed.narrative.opening).not.toEqual(base.narrative.opening);
  });
  it("same MBTI different birth charts changes periods, positive themes and ending", async () => {
    const a = await must(fixtures[0].payload);
    const b = await must({ ...fixtures[2].payload, person: { ...fixtures[2].payload.person, mbtiType: "INFJ" } });
    expect(a.years.map(y => [y.cycle.ganji, y.annual.tenGod])).not.toEqual(b.years.map(y => [y.cycle.ganji, y.annual.tenGod]));
    expect(a.narrative.finalLine).not.toBe(b.narrative.finalLine);
  });
  it("unknown MBTI has full natal material and no guessed type or reduced horizon", async () => {
    const r = await must(fixtures[4].payload), text = narrativeText(r.narrative);
    expect(r.materials.fusions).toEqual([]); expect(r.behaviorBasis).toEqual([]);
    expect(r.years).toHaveLength(14); expect(r.narrative.sections.some(s => s.id === "natal-gifts")).toBe(true);
    expect(text).not.toMatch(/MBTI를 모르|정보가 부족|현재 회사|당신의 상사|당신의 고객/);
  });
  it("natal markers stay natal, unsupported/conflicted material never becomes period luck", async () => {
    for (const { payload } of fixtures) {
      const r = await must(payload);
      const all = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)];
      const selected = new Set(r.materials.selected.map(m => m.feature));
      for (const b of all) {
        expect(b.proof.sourceRefs.length).toBeGreaterThan(0);
        for (const f of b.proof.features) expect(selected.has(f)).toBe(true);
        expect(b.proof.features.join(" ")).not.toMatch(/mangsin|mungok|bokseong|cheoneuiseong/);
      }
      for (const b of r.years.flatMap(y => y.blocks).filter(b => b.proof.features.length)) {
        expect(b.id).toMatch(/-why$/);
        expect(b.text).toContain("원래 가진");
        expect(b.proof.sourceRefs.some(ref => ref.startsWith("content-period:"))).toBe(true);
      }
      expect(narrativeText(r.narrative)).not.toMatch(/career_shift|previous_to_current|metal|water|\d+점|연결으로|겁재은|결과이|정재은|undefined|NaN/);
    }
  });
  it("unknown/approximate time follows canonical stable/ranged or rejection policy", async () => {
    for (const person of [
      { ...fixtures[0].payload.person, birthTime: "", birthTimeUnknown: false, birthTimePrecision: "approximate", approximateBirthTimeSlot: "MYOSI" },
      { ...fixtures[0].payload.person, birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" },
    ]) {
      const canonical = calculateCustomerDayun(person), r = await majorNarrativeEvidence({ ...fixtures[0].payload, person }, at);
      if (!canonical.ok) expect(r.ok).toBe(false);
      else {
        expect(r.ok).toBe(true); if (!r.ok) continue;
        expect(r.precision).toBe(person.birthTimePrecision);
        for (const t of r.horizon.transitions) expect(t.startSolarRange).toEqual(canonical.value.cycles.find(c => c.index === t.after.index)!.startSolarRange);
      }
    }
  });
  it("invalid input/instant fails closed and no network/OpenAI/payment path is called", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try {
      expect((await composeMajorFortuneNarrative({}, at)).ok).toBe(false);
      expect((await composeMajorFortuneNarrative(fixtures[0].payload, "not-a-date")).ok).toBe(false);
      expect((await composeMajorFortuneNarrative(fixtures[0].payload, "2026-10-01")).ok).toBe(false);
      await must(fixtures[0].payload); expect(fetch).not.toHaveBeenCalled();
    } finally { fetch.mockRestore(); }
  });
  it("a ranged current boundary never claims the after-cycle is already active", async () => {
    const person = { ...fixtures[0].payload.person, birthTime: "", birthTimeUnknown: false, birthTimePrecision: "approximate", approximateBirthTimeSlot: "MYOSI" };
    const p = { ...fixtures[0].payload, person }, base = await majorNarrativeEvidence(p, at);
    expect(base.ok).toBe(true); if (!base.ok) return;
    const t = base.horizon.transitions.at(-1)!;
    const low = Date.parse(t.startSolarRange.earliestKst), high = Date.parse(t.startSolarRange.latestKst);
    expect(high).toBeGreaterThan(low);
    const r = await composeMajorFortuneNarrative(p, new Date(Math.floor((low + high) / 2)).toISOString());
    expect(r).toEqual({ ok: false, errors: ["CURRENT_DAYUN_BOUNDARY_UNCERTAIN"] });
  });
  it("job-seeking examples are not borrowed from student classrooms or an assumed employer", async () => {
    const p = { ...fixtures[3].payload, userContext: { ...fixtures[3].payload.userContext, jobStatus: "job_seeker", detailJob: "IT 서비스 기획 직무 준비" } };
    const r = await must(p), text = r.years.flatMap(y => y.blocks).map(b => b.text).join(" ");
    expect(text).toMatch(/면접|지원서|공고/); expect(text).not.toMatch(/교재|수업 뒤|공동 과제|당신의 상사/);
    expect(r.years).toHaveLength(14);
    expect(r.editorial.filter(i => i.severity !== "Minor")).toEqual([]);
  });
  it("six current relationship states select distinct present-life scenes without future marriage claims", async () => {
    const scenes: string[] = [];
    for (const relationshipStatus of ["", "single", "some", "dating", "marriage_preparing", "married"]) {
      const r = await must({ ...fixtures[0].payload, userContext: { ...fixtures[0].payload.userContext, relationshipStatus } });
      scenes.push(r.narrative.sections.find(s => s.id === "relationships")!.blocks[0].text);
    }
    expect(new Set(scenes).size).toBe(6);
    expect(scenes[1]).not.toMatch(/배우자|부부|결혼하게/);
    expect(scenes[5]).toContain("배우자");
  });
});
