import { describe, expect, it } from "vitest";
import type { MbtiType } from "../../../src/data/knowledge-v5/schema";
import { loadKnowledge } from "../../../src/lib/brief";
import { bandOf, branchPair, CATEGORY_WEIGHTS, COMPAT_SCORE_VERSION, computeCompatScore, RAW_KNOTS, rawToScore, SCORE_POINTS, type CompatCategory, type ConventionalFit } from "../../../src/lib/compat/score";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { STEM_HAP_TABLE } from "../../../src/lib/saju/detections/tables";
import { CATEGORIES, randomPairs, stats, type RandPerson } from "../../../tools/p4-compat/pairs";

const k = loadKnowledge();
const conventional: ConventionalFit = (a, b) => k.mbti.get(a)?.conventionalCompat.find(c => c.type === b)?.fit ?? null;
const side = (p: RandPerson, name: string) => {
  try { return { saju: calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" }), name, mbti: (p.mbtiType || null) as MbtiType | null }; }
  catch { return null; } // 절기 경계일 + 시간 미상
};
const sides = randomPairs(320, 20261031).map(([a, b]) => [side(a, "A님"), side(b, "B님")] as const).filter((x): x is readonly [NonNullable<ReturnType<typeof side>>, NonNullable<ReturnType<typeof side>>] => Boolean(x[0] && x[1]));

describe("v5 궁합 점수(P4)", () => {
  it("대칭: A·B를 바꿔도 총점·원점수·구성요소 값이 같고, 방향 지표는 서로 맞바뀐다", () => {
    for (const [a, b] of sides.slice(0, 60)) for (const c of CATEGORIES) {
      const ab = computeCompatScore(c as CompatCategory, a, b, { conventional }), ba = computeCompatScore(c as CompatCategory, b, a, { conventional });
      expect(ba.total).toBe(ab.total);
      expect(ba.raw).toBe(ab.raw);
      expect(ba.components.map(x => [x.key, x.value])).toEqual(ab.components.map(x => [x.key, x.value]));
      expect(ba.direction.aToB.tenGod).toBe(ab.direction.bToA.tenGod);
      expect(ba.direction.bToA.tenGod).toBe(ab.direction.aToB.tenGod);
    }
  });

  it("결정론: 같은 입력은 같은 결과", () => {
    const [a, b] = sides[0];
    expect(computeCompatScore("love", a, b, { conventional })).toEqual(computeCompatScore("love", a, b, { conventional }));
    expect(computeCompatScore("love", a, b, { conventional }).version).toBe(COMPAT_SCORE_VERSION);
  });

  it("분포(보정 표본 밖 시드): 중앙값 65~70, 10·90 백분위 약 45·88, 범위 35~95, 유형마다 같은 모양", () => {
    const all: number[] = [];
    for (const c of CATEGORIES) {
      const xs = sides.map(([a, b]) => computeCompatScore(c as CompatCategory, a, b, { conventional }).total);
      const s = stats(xs); all.push(...xs);
      expect(s.median).toBeGreaterThanOrEqual(63); expect(s.median).toBeLessThanOrEqual(72);
      expect(s.min).toBeGreaterThanOrEqual(35); expect(s.max).toBeLessThanOrEqual(95);
    }
    const s = stats(all);
    expect(s.median).toBeGreaterThanOrEqual(65); expect(s.median).toBeLessThanOrEqual(70);
    expect(s.p10).toBeGreaterThanOrEqual(41); expect(s.p10).toBeLessThanOrEqual(49);
    expect(s.p90).toBeGreaterThanOrEqual(84); expect(s.p90).toBeLessThanOrEqual(91);
  });

  it("점수 구간과 구성요소 수준이 모순되지 않는다(75점 이상엔 좋음, 45점 미만엔 조율이 있다)", () => {
    for (const [a, b] of sides) for (const c of CATEGORIES) {
      const s = computeCompatScore(c as CompatCategory, a, b, { conventional });
      if (s.total >= 75) expect(s.components.some(x => x.level === "좋음")).toBe(true);
      if (s.total < 45) expect(s.components.some(x => x.level === "조율")).toBe(true);
      expect(s.band).toBe(bandOf(s.total));
    }
  });

  it("구성요소 경계: 지지 한 쌍(충·육합·해+원진 중복·육합+파·같은 글자·자형)", () => {
    expect(branchPair("子", "午").value).toBe(-1);
    expect(branchPair("子", "丑").value).toBe(1);
    expect(branchPair("子", "未").value).toBe(-0.5); // 해·원진이 같은 쌍 → 센 쪽 하나만
    expect(branchPair("寅", "亥").value).toBeCloseTo(0.7); // 육합 + 파
    expect(branchPair("子", "子").value).toBe(0.2);
    expect(branchPair("午", "午").value).toBe(-0.4); // 자형
    expect(branchPair("子", "辰").value).toBe(0.6); // 반합(왕지 포함)
  });

  it("구성요소 경계: 원점수 변환은 단조 증가, 매듭 밖은 35·95로 막힌다", () => {
    for (const c of CATEGORIES as CompatCategory[]) {
      const kn = RAW_KNOTS[c];
      expect(rawToScore(kn[0] - 0.5, c)).toBe(SCORE_POINTS[0]);
      expect(rawToScore(kn[4] + 0.5, c)).toBe(SCORE_POINTS[4]);
      expect(rawToScore(kn[2], c)).toBe(SCORE_POINTS[2]);
      let prev = 0;
      for (let r = -1; r <= 1; r += 0.01) { const s = rawToScore(r, c); expect(s).toBeGreaterThanOrEqual(prev); prev = s; }
    }
    expect([90, 89, 75, 74, 60, 59, 45, 44].map(x => bandOf(x).label)).toEqual(["타고난 짝", "잘 맞는 편", "잘 맞는 편", "맞춰 가면 좋아지는", "맞춰 가면 좋아지는", "노력이 필요한", "노력이 필요한", "서로 다른 세계"]);
  });

  it("천간합인 두 일간은 일간 관계가 가장 높다", () => {
    const hap = sides.find(([a, b]) => STEM_HAP_TABLE.some(r => r.pair.includes(a.saju.dayMaster) && r.pair.includes(b.saju.dayMaster) && a.saju.dayMaster !== b.saju.dayMaster));
    expect(hap).toBeTruthy();
    const s = computeCompatScore("love", hap![0], hap![1], { conventional });
    expect(s.components.find(x => x.key === "dayMaster")!.value).toBe(1);
  });

  it("7유형 가중치: 합 1, 유형마다 적용되고 MBTI가 없으면 나머지로 다시 나눈다", () => {
    for (const w of Object.values(CATEGORY_WEIGHTS)) expect(Object.values(w).reduce((n, x) => n + x, 0)).toBeCloseTo(1);
    const [a, b] = sides.find(([x, y]) => x.mbti && y.mbti)!;
    for (const c of CATEGORIES as CompatCategory[]) {
      const s = computeCompatScore(c, a, b, { conventional });
      for (const comp of s.components) expect(comp.weight).toBeCloseTo(CATEGORY_WEIGHTS[c][comp.key], 2);
      expect(s.raw).toBeCloseTo(s.components.reduce((n, x) => n + CATEGORY_WEIGHTS[c][x.key] * x.value, 0), 2);
    }
    const noMbti = computeCompatScore("coworker", a, { ...b, mbti: null }, { conventional });
    expect(noMbti.components.some(x => x.key === "mbti")).toBe(false);
    expect(noMbti.components.reduce((n, x) => n + x.weight, 0)).toBeCloseTo(1, 1);
    // 같은 쌍이라도 유형 가중치가 다르면 원점수가 달라진다
    const raws = new Set((CATEGORIES as CompatCategory[]).map(c => computeCompatScore(c, a, b, { conventional }).raw));
    expect(raws.size).toBeGreaterThan(1);
  });
});
