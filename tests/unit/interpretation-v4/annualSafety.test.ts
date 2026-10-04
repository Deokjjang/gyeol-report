import contentBaseline from "./contentRebuildBaseline.json";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { describe, it, expect, vi } from "vitest";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";
import { annualNarrativeEvidence, annualTransitMaterials } from "../../../src/lib/interpretation-v4/annualEvidence";
import { createAnnualV3 } from "../../../src/lib/report-generation/annualV3Generation";
import { extendAnnualMonthEvidence, annualSegmentAt } from "../../../src/lib/report-knowledge/annualMonthExtendedEvidence";
import { getAnnualJieBoundaries } from "../../../src/lib/report-knowledge/annualMonthJie";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { MBTI_TYPES, JOB_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES as fixtures, ANNUAL_CLOCK } from "./annualFixtures";

// Reviewed Phase 7A Major prose. Original Phase 6A hashes and immutable
// evidence/proof hashes remain in finalEditorialBaseline.json.
const MAJOR_HASHES = Object.entries(contentBaseline.rows).filter(([id]) => id.startsWith("major-")).sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => row.after);
const must = async (payload: unknown, clock = ANNUAL_CLOCK) => { const r = await composeAnnualFortuneNarrative(payload, clock); expect(r.ok, JSON.stringify(r.ok ? "ok" : r.errors)).toBe(true); if (!r.ok) return null!; return r; };
describe("Annual V4 canonical evidence, clock and regression boundaries", () => {
  it.each(MAJOR_NARRATIVE_FIXTURES.map((f, i) => ({ ...f, hash: MAJOR_HASHES[i] })))("$id: V4 Major byte hash unchanged", async ({ payload, hash }) => {
    const r = await composeMajorFortuneNarrative(payload, MAJOR_EVALUATED_AT); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex")).toBe(hash);
  });
  it.each(fixtures)("$id: same canonical generation, monthly extension, exact segments; V3 unchanged", async f => {
    const inputBefore = JSON.stringify(f.payload);
    // Only the test clock supplies the legacy adapter's ambient commerce date.
    // Production code and the V4 explicit clock are not patched.
    vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date(f.clock.policyDate ?? f.clock.currentDate));
    try {
      const old = await createAnnualV3(f.payload, { now: () => new Date(f.clock.currentDate), policyDate: new Date(f.clock.policyDate ?? f.clock.currentDate) });
      expect(old).not.toBeNull();
      const r = await must(f.payload, f.clock), again = await must(f.payload, f.clock);
      expect(r).toEqual(again); expect(JSON.stringify(f.payload)).toBe(inputBefore);
      expect(await createAnnualV3(f.payload, { now: () => new Date(f.clock.currentDate), policyDate: new Date(f.clock.policyDate ?? f.clock.currentDate) })).toEqual(old);
      expect(r.evidence.raw.calendarMonths).toEqual(old!.evidencePacket.calendarMonths);
      expect(r.evidence.raw.customerDayun).toEqual(old!.evidencePacket.customerDayun);
      expect(r.evidence.calculation).toEqual(old!.evidencePacket.annualV3.calculation);
      expect(r.evidence.monthly).toEqual(extendAnnualMonthEvidence(old!.evidencePacket));
      expect(r.evidence.raw.annualGanji).toEqual(getAnnualGanjiInfo(Number(f.payload.productOptions.selectedYear)));
      for (const m of r.months) {
        expect(r.evidence.raw.calendarMonths![m.month - 1].segments).toContainEqual(m.focus);
        expect([m.focus.stemTenGod, m.focus.branchTenGod]).toContain(m.god);
        expect(m.focus.stemTenGod).toBe(getTenGodForStemPair(r.evidence.raw.dayMaster, m.focus.monthPillar.stem));
        for (const block of m.blocks) expect(block.proof.sourceRefs.length).toBeGreaterThan(0);
        if (m.selectedTransit) expect(r.evidence.months[m.month - 1].transit.accepted).toContainEqual(m.selectedTransit);
      }
    } finally { vi.useRealTimers(); }
  });
  it("all twelve exact Jie instants switch focus at the boundary, not UTC day or month label", async () => {
    for (const boundary of getAnnualJieBoundaries(2026)) {
      const instant = Date.parse(boundary.instantKst);
      for (const delta of [-1, 0]) {
        const clock = { currentDate: new Date(instant + delta).toISOString() }, r = await must(fixtures[1].payload, clock);
        const month = r.evidence.months.find(m => m.time === "current")!;
        expect(month.focus).toEqual(annualSegmentAt(r.evidence.raw.calendarMonths!, clock.currentDate));
        expect(month.focus.monthPillar).toEqual(delta < 0 ? boundary.beforeMonth : boundary.afterMonth);
        if (delta < 0) expect(r.months[month.month - 1].blocks.some(b => b.id.endsWith("next-jie"))).toBe(true);
        expect(r.editorial).toEqual([]);
      }
    }
  });
  it("Lichun retains previous annual pillar in January; exact Dayun switch remains in April", async () => {
    const f = fixtures[2], r = await must(f.payload, f.clock);
    expect(r.evidence.months[0].focus.effectiveAnnualPillar).toMatchObject({ stem: "丁", branch: "未" });
    const transition = r.evidence.crossPeriods.find(p => p.segment.boundaryReason.includes("dayun_transition"))!;
    expect(transition.startKst).toBe("2028-04-23T21:42:00+09:00");
    expect(r.months[3].blocks.some(b => b.id.endsWith("transition"))).toBe(true);
    const instant = Date.parse(transition.startKst);
    for (const delta of [-1, 0]) {
      const near = await must(f.payload, { currentDate: new Date(instant + delta).toISOString() });
      expect(near.evidence.months[3].focus).toEqual(annualSegmentAt(near.evidence.raw.calendarMonths!, new Date(instant + delta).toISOString()));
      const copy = near.months[3].blocks.find(b => b.id.endsWith("transition"))!.text;
      expect(copy).toContain(delta < 0 ? "옮겨갈 전망" : "옮겨갔는지 돌아볼");
    }
  });
  it("past/current/future: explicit KST clock, no claimed past events, no future commerce override by default", async () => {
    for (const f of fixtures) {
      const r = await must(f.payload, f.clock), y = Number(f.payload.productOptions.selectedYear);
      expect(r.months.map(m => m.time)).toEqual(Array.from({ length: 12 }, (_, i) => y < 2026 || (y === 2026 && i < 9) ? "past" : y === 2026 && i === 9 ? "current" : "future"));
      if (y < 2026) expect(r.narrative.opening[1].text).toMatch(/과거에도 같았다고 정해두지는 않(?:습니다|아요)/);
    }
    expect((await annualNarrativeEvidence(fixtures[2].payload, ANNUAL_CLOCK)).ok).toBe(false);
    expect(normalizeReportInputPayload(fixtures[2].payload, { now: () => new Date(ANNUAL_CLOCK.currentDate) }).ok).toBe(false);
    expect((await annualNarrativeEvidence(fixtures[0].payload, { currentDate: "2026-10-01" })).ok).toBe(false);
    expect((await annualNarrativeEvidence(fixtures[0].payload, { currentDate: "not a date" })).ok).toBe(false);
    const a = await must(fixtures[0].payload);
    vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date("2039-01-01T00:00:00Z"));
    try { expect(await must(fixtures[0].payload)).toEqual(a); } finally { vi.useRealTimers(); }
    const utc = await must(fixtures[0].payload, { currentDate: "2026-09-30T15:00:00Z" });
    expect(utc.evidence.currentMonth).toBe(10); expect(utc.months[9].time).toBe("current");
  });
  it("conflicted/unsupported observations held, aliases merged without losing anchors; natal not copied", async () => {
    let held = 0;
    for (const f of fixtures) {
      const r = await must(f.payload, f.clock);
      for (const m of r.evidence.months) {
        held += m.transit.held.length;
        expect(m.extension.unsupported).toContainEqual({ code: "banghap", reason: "NO_VERIFIED_CANONICAL_RULE" });
        expect(m.transit.accepted.map(f => f.feature).join(" ")).not.toMatch(/mangsin|mungok|bokseong|cheoneui|banghap/i);
        expect(new Set(m.transit.accepted.map(f => f.feature)).size).toBe(m.transit.accepted.length);
        for (const f of m.transit.accepted) for (const o of f.observations) {
          expect(m.extension.features).toContainEqual(o);
          expect(o.basis.targetValue).toBe(o.basis.target === "month.stem" ? m.focus.monthPillar.stem : m.focus.monthPillar.branch);
          expect(f.sourceRefs).toEqual(expect.arrayContaining([...o.sourceRefs]));
        }
      }
      for (const m of r.months) for (const b of m.blocks) {
        if (!b.proof.fusionIds.length && b.proof.features.length) {
          expect(b.id).toMatch(/-why$/);
          expect(b.text).toContain("원래 가진");
          expect(b.proof.features.every(f => r.materials.selected.some(m => m.feature === f))).toBe(true);
        }
      }
    }
    expect(held).toBeGreaterThan(0);
    const e = await annualNarrativeEvidence(fixtures[0].payload, fixtures[0].clock); if (!e.ok) return;
    const f = e.months[0].extension.features[0];
    expect(annualTransitMaterials([{ ...f, sourceRefs: ["natal:marker"], basis: { ...f.basis, target: "natal.branch" } }]).accepted).toEqual([]);
  });
  it("same chart / different MBTI, same MBTI / different chart, same person / different year", async () => {
    const a = await must(fixtures[1].payload);
    const b = await must({ ...fixtures[1].payload, person: { ...fixtures[1].payload.person, mbtiType: "INTP" } });
    expect(a.evidence.months).toEqual(b.evidence.months);
    expect(a.behaviorBasis).not.toEqual(b.behaviorBasis); expect(a.months.map(m => m.blocks)).not.toEqual(b.months.map(m => m.blocks));
    const c = await must({ ...fixtures[0].payload, person: { ...fixtures[0].payload.person, mbtiType: "ENTJ" } });
    expect(c.evidence.raw.annualFortune.stemTenGod).not.toBe(a.evidence.raw.annualFortune.stemTenGod);
    expect(c.months.map(m => m.god)).not.toEqual(a.months.map(m => m.god));
    const d = await must({ ...fixtures[1].payload, productOptions: { ...fixtures[1].payload.productOptions, selectedYear: "2025" } });
    expect(d.evidence.raw.annualFortune.stemTenGod).not.toBe(a.evidence.raw.annualFortune.stemTenGod);
    expect(d.narrative.opening[0].text).not.toBe(a.narrative.opening[0].text);
    expect(d.months.map(m => [m.god, m.title])).not.toEqual(a.months.map(m => [m.god, m.title]));
    expect(d.narrative.finalLine).not.toBe(a.narrative.finalLine);
    if (process.env.V4_PHASE6B_EXPORT === "1") {
      mkdirSync("/tmp/gyeol-v4-phase6b", { recursive: true });
      writeFileSync("/tmp/gyeol-v4-phase6b/counterfactual.json", JSON.stringify([a, b, c, d].map(r => ({
        name: r.evidence.input.name, mbti: r.evidence.input.mbti, year: r.evidence.selectedYear, ganji: r.evidence.raw.annualGanji.ganji, god: r.evidence.raw.annualFortune.stemTenGod,
        opening: r.narrative.opening, behavior: r.months.flatMap(m => m.behavior ? [{ month: m.month, fusion: m.behavior.ruleId, text: m.blocks.find(b => b.id.endsWith("behavior"))?.text }] : []),
        monthTitles: r.months.map(m => m.title), final: r.narrative.finalLine,
      })), null, 2));
    }
  });
  it("all MBTI and job modes retain calendar; behavior requires actual Fusion and no unknown guess", async () => {
    const base = await must(fixtures[1].payload);
    for (const mbtiType of MBTI_TYPES) {
      const r = await must({ ...fixtures[1].payload, person: { ...fixtures[1].payload.person, mbtiType } });
      expect(r.evidence.months).toEqual(base.evidence.months);
      for (const f of r.behaviorBasis) expect(r.materials.fusions).toContainEqual(f);
      expect(r.behaviorBasis.length).toBeLessThanOrEqual(3);
      if (!mbtiType) expect(r.behaviorBasis).toEqual([]);
    }
    for (const jobStatus of JOB_STATUSES) {
      const r = await must({ ...fixtures[1].payload, userContext: { ...fixtures[1].payload.userContext, jobStatus, detailJob: "" } });
      expect(r.evidence.months).toEqual(base.evidence.months);
      expect(r.months).toHaveLength(12);
      if (jobStatus === "unemployed") expect(narrativeText(r.narrative)).not.toMatch(/상사|현재 회사|당신의 고객|연봉/);
    }
  });
  it("explicit precision uses canonical uncertainty contract; conditional transit never becomes a hero", async () => {
    for (const p of [
      { birthTime: "", birthTimeUnknown: false, birthTimePrecision: "approximate", approximateBirthTimeSlot: "MYOSI" },
      { birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" },
    ]) {
      const payload = { ...fixtures[0].payload, person: { ...fixtures[0].payload.person, ...p } };
      const canonical = normalizeReportInputPayload(payload, { now: () => new Date(ANNUAL_CLOCK.currentDate) });
      const e = await annualNarrativeEvidence(payload, ANNUAL_CLOCK);
      if (!canonical.ok) expect(e.ok).toBe(false);
      else { expect(e.ok).toBe(true); if (e.ok) expect(e.raw.customerDayun?.precision).toBe(p.birthTimePrecision); }
    }
  });
  it("offline composer never calls network providers", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("NETWORK_FORBIDDEN_IN_ANNUAL_TEST"));
    try { await must(fixtures[0].payload); expect(spy).not.toHaveBeenCalled(); } finally { spy.mockRestore(); }
  });
});
