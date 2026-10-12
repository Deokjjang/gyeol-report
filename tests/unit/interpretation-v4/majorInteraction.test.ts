import { beforeAll, describe, expect, it } from "vitest";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { createMajorFortuneV3 } from "../../../src/lib/report-generation/majorFortuneV3Generation";
import { majorInteractionReading, withMajorInteractions } from "../../../src/lib/interpretation-v4/majorInteractionReading";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
import locks from "./majorInteractionLocks.json";
import editions from "../../fixtures/common-editorial-01/edition-locks.json";

type Result = Extract<V4RuntimeEvidence["composition"], { product: "major_fortune" }>["result"];
const results = new Map<string, Result>();
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const g = await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK);
    expect(g.ok).toBe(true);
    if (!g.ok) continue;
    expect(validateV4Publication("major_fortune", g.draft, g.evidencePacket)).toEqual({ ok: true, errors: [] });
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product === "major_fortune") results.set(f.id, e.composition.result);
  }
}, 120000);

describe("Major verified annual interaction explanations", () => {
  it.each(MAJOR_SAFETY_CASES)("$id: immutable calculations, reviewed copy, IDs, MBTI/Fusion and selection", ({ id }) => {
    const r = results.get(id)!;
    const evidence = Object.fromEntries(Object.entries(r.evidence).filter(([key]) => key !== "majorNatal"));
    const frozen = { ...Object.fromEntries(["materials", "yearPlan", "transitions", "behaviorBasis", "completeness", "contentPlan", "integration"].map(k => [k, r[k as keyof Result]])), evidence,
      narrative: { ...r.narrative, sections: r.narrative.sections.filter(s => !s.id.startsWith("year-")) },
      years: r.years.map(year => Object.fromEntries(Object.entries(year).filter(([key]) => key !== "blocks"))) };
    const old = locks.rows[id as keyof typeof locks.rows];
    expect(v4Digest(frozen)).toBe(old.invariant);
    const key = "ABCDEF"[MAJOR_SAFETY_CASES.findIndex(f => f.id === id)];
    expect(v4Digest(r.narrative)).toBe(editions.find(f => f.product === "major" && f.id === key)!.hashes.narrative);
    expect(v4Digest(r.years.flatMap(y => y.blocks.map(b => ({ id: b.id, proof: b.id === `${y.year}-character` ? y.proof : b.proof }))))).toBe(old.proofs);
    expect(r.editorial).toEqual([]);
    expect(r.years.flatMap(y => y.blocks.map(b => b.text)).join(" ")).not.toContain("목소리’이라는");
    for (const y of r.years) {
      const reading = majorInteractionReading(r.evidence, y);
      for (const ref of [...reading.tensionIds, ...reading.harmonyIds]) {
        expect(y.annual.evidenceIds).toContain(ref);
        expect(y.annual.reasons.some(reason => reason.evidenceId === ref)).toBe(true);
      }
      const character = y.blocks.find(b => b.id === `${y.year}-character`)!;
      expect(character.proof.sourceRefs).toEqual([...new Set([...y.proof.sourceRefs, ...reading.backgroundIds, ...reading.majorNatal.map(r => r.id)])]);
      if (y.timePosition !== "current" || y.beforeCycle) expect(reading.majorNatal).toEqual([]);
    }
  });

  it("A 2028: 寅申 clash, 申寅 punishment and 申子 natal half-harmony keep distinct actors and reasons", () => {
    const r = results.get("01-business")!, y = r.years.find(y => y.year === 2028)!;
    const reading = majorInteractionReading(r.evidence, y);
    expect(reading.tensionIds).toEqual([
      "major:4:戊寅:year:2028:戊申:cycle:충:寅申:cycle",
      "major:4:戊寅:year:2028:戊申:cycle:형:申寅:cycle",
    ]);
    expect(reading.harmonyIds).toEqual(["major:4:戊寅:year:2028:戊申:natal:반합:申子:day"]);
    const text = y.blocks.map(b => b.text).join(" ");
    for (const part of ["戊寅 대운의 편인", "戊申 세운의 편인", "寅·申 충", "申·寅 형", "원국 일지 子", "申·子 반합", "기존 배치와 새 요구", "되풀이되는 부담", "매출 뒤의 이유"]) expect(text).toContain(part);
  });

  it.each([["02-employee", 2025], ["03-freelance", 2024]] as const)("%s %s: additional genuine relationship years", (id, year) => {
    const r = results.get(id)!, y = r.years.find(y => y.year === year)!;
    const reading = majorInteractionReading(r.evidence, y);
    expect(reading.harmonyIds).toEqual([id === "02-employee"
      ? "major:4:己卯:year:2025:乙巳:natal:육합:巳申:day"
      : "major:3:壬申:year:2024:甲辰:cycle:반합:辰申:cycle"]);
    expect(reading.tensionIds).toEqual([id === "02-employee"
      ? "major:4:己卯:year:2025:乙巳:natal:형:巳申:day"
      : "major:3:壬申:year:2024:甲辰:natal:충:辰戌:year"]);
    const text = y.blocks.map(b => b.text).join(" ");
    for (const ref of [...reading.harmonyIds, ...reading.tensionIds]) {
      expect(text).toContain(`${ref.split(":")[8].split("").join("·")} ${ref.split(":")[7]}`);
    }
  });

  it("B 2028: absence of relations does not invent a connection", () => {
    const r = results.get("02-employee")!, y = r.years.find(y => y.year === 2028)!;
    expect(y.annual.cycleRelations).toEqual([]); expect(y.annual.natalRelations).toEqual([]);
    const reading = majorInteractionReading(r.evidence, y);
    expect(reading).toMatchObject({ harmony: "", tension: "", harmonyIds: [], tensionIds: [], majorNatal: [] });
    expect(y.blocks.map(b => b.text).join(" ")).not.toMatch(/충은|형은|반합은|육합은|삼합은/);
  });

  it("C 2028: exact boundary qualifies the post-transition cycle, not the entire year", () => {
    const r = results.get("03-freelance")!, y = r.years.find(y => y.year === 2028)!;
    const reading = majorInteractionReading(r.evidence, y);
    expect(reading.background).toContain("2028-04-23 21:42:00 KST 직전까지는 壬申(편재)");
    expect(reading.background).toContain("같은 시각부터 辛未(상관)");
    expect(reading.background).toContain("전환이 완료된 뒤");
    expect(reading.harmony).toContain("원국 일지 申·원국 시지 辰");
    expect(reading.tension).toContain("원국 월지 亥");
    expect(reading.majorNatal).toEqual([]);
    expect(reading.tensionIds.every(id => id.startsWith("major:4:辛未:"))).toBe(true);
  });

  it.each(["04-time-unknown", "06-both-unknown"])("%s: uncertain transition range never becomes a guessed instant", id => {
    const r = results.get(id)!;
    for (const t of r.evidence.horizon.transitions) {
      const y = r.years.find(y => y.year === t.year)!;
      expect(t.startSolarKst).toBeNull();
      expect(t.startSolarRange).toBeDefined();
      const reading = majorInteractionReading(r.evidence, y);
      for (const at of [t.startSolarRange!.earliestKst, t.startSolarRange!.latestKst]) expect(reading.background).toContain(at.replace("T", " ").replace("+09:00", " KST"));
      expect(reading.background).toContain("전환이 완료된 뒤");
      expect(reading.majorNatal).toEqual([]);
    }
  });

  it.each(MAJOR_SAFETY_CASES)("$id: current major/natal facts are copied from the original engine packet only", async ({ id, payload }) => {
    const r = results.get(id)!, e = r.evidence;
    const canonical = await createMajorFortuneV3(payload, { now: () => new Date(MAJOR_SAFETY_CLOCK.evaluatedAt) });
    expect(canonical).not.toBeNull();
    const packet = canonical!.evidencePacket;
    expect(e.majorNatal.ganji).toBe(packet.currentCycle.ganji);
    for (const f of e.majorNatal.relations) {
      expect(packet.branchInteractions).toContainEqual(f.relation);
      expect(packet.decadeReading!.factors).toContainEqual({ evidenceId: f.evidenceId, text: f.text });
    }
    const y = e.years.find(y => y.timePosition === "current")!;
    const unsupported = { ...y, annual: { ...y.annual, reasons: [] } };
    expect(majorInteractionReading(e, unsupported)).toMatchObject({ harmony: "", tension: "", harmonyIds: [], tensionIds: [] });
    const missing = { ...y, annual: { ...y.annual, reasons: [], evidenceIds: [] } };
    expect(majorInteractionReading(e, missing)).toMatchObject({ background: "", harmony: "", tension: "", majorNatal: [] });
    const blocks = r.years.find(v => v.year === y.year)!.blocks;
    expect(withMajorInteractions(e, missing, blocks)).toEqual(blocks);
  });
});
