import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { compatibilityNarrativeEvidence, type PairEvidence } from "../../../src/lib/interpretation-v4/compatibilityEvidence";
import { buildCompatibilityIndex, COMPATIBILITY_INDEX_VERSION } from "../../../src/lib/interpretation-v4/compatibilityIndex";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
const evidence = (payload: unknown): PairEvidence => {
  const e = compatibilityNarrativeEvidence(payload);
  expect(e.ok).toBe(true); if (!e.ok) return expect.unreachable();
  return e;
};
const base = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;

describe("versioned source-based compatibility index", () => {
  it.each(COMPATIBILITY_NARRATIVE_FIXTURES)("$id keeps actual evidence immutable and explains all four domains", ({ payload }) => {
    const e = evidence(payload), before = structuredClone(e), index = buildCompatibilityIndex(e);
    expect(e).toEqual(before);
    expect(index.version).toBe(COMPATIBILITY_INDEX_VERSION);
    expect(index.total).toBe(index.scores.reduce((n, s) => n + s.value, 0));
    expect(Number.isInteger(index.total)).toBe(true);
    expect(index.total).toBeGreaterThanOrEqual(0); expect(index.total).toBeLessThanOrEqual(100);
    expect(index.explanations).toHaveLength(4);
    expect(index.notice).toContain("성공 확률");
    for (const s of index.scores) {
      expect(s.value).toBeGreaterThanOrEqual(0); expect(s.value).toBeLessThanOrEqual(s.max);
      for (const f of s.factors) { expect(Number.isFinite(f.value)).toBe(true); expect(f.sources.length).toBeGreaterThan(0); }
    }
    expect(buildCompatibilityIndex(e)).toEqual(index);
  });
  it("repeating canonical placements cannot farm rewards or penalties", () => {
    const e = evidence(base), expected = buildCompatibilityIndex(e);
    expect(buildCompatibilityIndex({ ...e, relations: [...e.relations, ...e.relations, ...e.relations] })).toEqual(expected);
    expect(expected.scores[3].factors.some(f => f.factor === "여러 충돌을 따로 조율할 필요")).toBe(false);
  });
  it("A/B swap preserves the symmetric interpretation index and actual directional identities", () => {
    const e = evidence(base), reversed = evidence({ ...base, personA: base.personB, personB: base.personA });
    expect(buildCompatibilityIndex(e).scores.map(s => s.value)).toEqual(buildCompatibilityIndex(reversed).scores.map(s => s.value));
    expect(e.directions.aToB.receivedTenGod).toEqual(reversed.directions.bToA.receivedTenGod);
  });
  it("unknown MBTI and hour keep missing knowledge neutral, without inventing full-chart balance", () => {
    const unknown = (p: typeof base.personA) => ({ ...p, mbtiType: "", birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" });
    const e = evidence({ ...base, personA: unknown(base.personA), personB: unknown(base.personB) });
    const index = buildCompatibilityIndex(e);
    expect(index.scores[2].value).toBe(13);
    expect(index.scores[2].factors).toEqual([]);
    expect(index.scores[0].factors.some(f => /부족한 오행|같은 오행으로 치우침|음양/.test(f.factor))).toBe(false);
    expect(index.limitations.join(" ")).toContain("출생시간");
  });
  it("different verified MBTI source rhythms discriminate the same two charts", () => {
    const types = ["INTP", "ISFJ", "ENTJ", "ESFP", "INFJ", "ISTJ", "ENFP", "ISTP"];
    const totals = types.map(mbtiType => buildCompatibilityIndex(evidence({ ...base, personB: { ...base.personB, mbtiType } })).total);
    expect(new Set(totals).size).toBeGreaterThanOrEqual(4);
    // No target score band, MBTI label grade, or forced upward adjustment.
    expect(totals.every(n => n >= 0 && n <= 100)).toBe(true);
  });
});
