import { describe, expect, it } from "vitest";
import type { MbtiType } from "../../../src/data/knowledge-v5/schema";
import { BASE_SCORE, BASE_TIERS, bandOf, branchTier, COMPAT_SCORE_VERSION, computeCompatScore, ITEM_MAX, TIERS, type CompatCategory, type CompatSide } from "../../../src/lib/compat/score";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { STEM_HAP_TABLE } from "../../../src/lib/saju/detections/tables";
import { splitSentences } from "../../../src/lib/writer/safety/patterns";
import { CATEGORIES, randomPairs, stats, type RandPerson } from "../../../tools/p4-compat/pairs";

const side = (p: RandPerson, name: string): CompatSide | null => {
  try { return { saju: calculateSaju({ birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: p.gender, timezone: "Asia/Seoul" }), name, mbti: (p.mbtiType || null) as MbtiType | null, gender: p.gender }; }
  catch { return null; } // 절기 경계일 + 시간 미상
};
const sides = randomPairs(400, 20261031).map(([a, b]) => [side(a, "가람님"), side(b, "나래님")] as const).filter((x): x is readonly [CompatSide, CompatSide] => Boolean(x[0] && x[1]));
const cats = CATEGORIES as CompatCategory[];

describe("v5 궁합 점수 v2(P6c)", () => {
  it("총점 = 기본 40 + 항목 합(MBTI가 없으면 사주 항목 합을 60점으로 환산), 결정론", () => {
    for (const [a, b] of sides.slice(0, 80)) for (const c of cats) {
      const s = computeCompatScore(c, a, b);
      const sum = s.items.reduce((n, i) => n + i.points, 0), full = s.items.reduce((n, i) => n + i.max, 0);
      expect(s.scaled).toBe(!(a.mbti && b.mbti));
      expect(s.total).toBe(BASE_SCORE + (s.scaled ? Math.round(sum * 60 / full) : sum));
      expect(s.band).toBe(bandOf(s.total));
      expect(s.items.every(i => i.points >= 0 && i.points <= i.max)).toBe(true);
    }
    const [a, b] = sides[0];
    expect(computeCompatScore("love", a, b)).toEqual(computeCompatScore("love", a, b));
    expect(computeCompatScore("love", a, b).version).toBe(COMPAT_SCORE_VERSION);
  });

  it("배점: 유형마다 합 60, 합의 배점 그대로", () => {
    for (const c of cats) expect(Object.values(ITEM_MAX[c]).reduce((n, x) => n + x, 0)).toBe(60);
    expect(ITEM_MAX.love).toEqual({ element: 12, dayMaster: 10, dayBranch: 10, yearMonth: 6, role: 4, yinYang: 3, mbti: 15 });
    expect(ITEM_MAX.marriage).toEqual(ITEM_MAX.love);
    for (const c of ["coworker", "businessPartner"] as const) expect([ITEM_MAX[c].dayBranch, ITEM_MAX[c].yearMonth]).toEqual([6, 10]);
    expect([ITEM_MAX.parentChild.dayBranch, ITEM_MAX.parentChild.yearMonth, ITEM_MAX.parentChild.role]).toEqual([5, 8, 7]);
    expect([ITEM_MAX.friendship.mbti, ITEM_MAX.friendship.dayBranch]).toEqual([18, 7]);
  });

  it("세부 점수: 보정 뒤에도 합의 순서를 지키고 가장 좋은 단계는 만점", () => {
    const desc = (xs: readonly number[]) => xs.every((x, i) => i === 0 || xs[i - 1] >= x);
    expect(desc([TIERS.element["filled+filled"], TIERS.element["filled+missed"], TIERS.element["missed+missed"]])).toBe(true);
    expect(desc([TIERS.dayMaster.hap, TIERS.dayMaster.generate, TIERS.dayMaster.same, TIERS.dayMaster.control])).toBe(true);
    expect(desc([TIERS.dayBranch.hap, TIERS.dayBranch.none, TIERS.dayBranch.friction, TIERS.dayBranch.clash])).toBe(true);
    expect(desc([TIERS.yearMonth.hap, TIERS.yearMonth.none, TIERS.yearMonth.clash])).toBe(true);
    for (const t of [TIERS.element["filled+filled"], TIERS.dayMaster.hap, TIERS.dayBranch.hap, TIERS.yearMonth.hap, TIERS.role.exact, TIERS.yinYang[0]]) expect(t).toBe(1);
    expect(BASE_TIERS.dayMaster).toEqual({ hap: 1, generate: 0.8, same: 0.6, control: 0.4 }); // 합의 10/8/6/4
  });

  it("지지 한 쌍의 단계: 합(육합·반합), 합+형·파, 충·원진, 형·파·해(자형 포함), 관계 없음(같은 글자·방합 두 글자)", () => {
    expect(branchTier("子", "丑").tier).toBe("hap");
    expect(branchTier("申", "辰").tier).toBe("hap");
    expect(branchTier("寅", "亥").tier).toBe("hapMixed");
    expect(branchTier("子", "午").tier).toBe("clash");
    expect(branchTier("子", "未").tier).toBe("clash"); // 해 + 원진 → 원진
    expect(branchTier("丑", "辰").tier).toBe("friction");
    expect(branchTier("午", "午").tier).toBe("friction");
    expect(branchTier("子", "子").tier).toBe("none");
    expect(branchTier("寅", "卯").tier).toBe("none");
  });

  it("천간합인 두 일간은 타고난 중심 관계 만점", () => {
    const hap = sides.find(([a, b]) => STEM_HAP_TABLE.some(r => r.pair.includes(a.saju.dayMaster) && r.pair.includes(b.saju.dayMaster) && a.saju.dayMaster !== b.saju.dayMaster));
    expect(hap).toBeTruthy();
    const item = computeCompatScore("love", hap![0], hap![1]).items.find(i => i.key === "dayMaster")!;
    expect(item.points).toBe(item.max);
  });

  it("역할: 연애는 남성에게 여성이 재성일 때 만점, 성별을 바꾸면 달라진다", () => {
    const pair = sides.find(([a, b]) => computeCompatScore("love", { ...a, gender: "MALE" }, { ...b, gender: "FEMALE" }).items.find(i => i.key === "role")!.points === 4);
    expect(pair).toBeTruthy();
    const [a, b] = pair!;
    expect(computeCompatScore("love", { ...a, gender: "FEMALE" }, { ...b, gender: "MALE" }).items.find(i => i.key === "role")!.points).toBeLessThan(4);
  });

  it("MBTI 없음: MBTI 항목을 빼고 안내 문장에 환산을 적는다", () => {
    const [a, b] = sides.find(([x, y]) => x.mbti && y.mbti)!;
    const s = computeCompatScore("coworker", a, { ...b, mbti: null });
    expect(s.items.some(i => i.key === "mbti")).toBe(false);
    expect(s.scaled).toBe(true);
    expect(s.notice).toContain("MBTI 항목은 빼고");
    expect(s.items.map(i => i.reason).join(" ")).not.toMatch(/MBTI|[EI][NS][TF][JP]/);
  });

  it("항목 이유: 2~3문장, 두 사람 이름이 들어가고 점수·규칙 같은 내부 문장이 없다", () => {
    for (const [a, b] of sides.slice(0, 120)) for (const c of cats) for (const i of computeCompatScore(c, a, b).items) {
      const n = splitSentences(i.reason).length;
      expect(n, i.reason).toBeGreaterThanOrEqual(2); expect(n, i.reason).toBeLessThanOrEqual(3);
      expect(i.reason).toMatch(/가람님|나래님|두 사람/);
      expect(i.reason).not.toMatch(/\d+ ?점|만점|규칙|가중|tier|undefined|null|NaN/);
    }
  });

  it("분포(보정 표본 밖 시드, 400쌍): 유형마다 중앙값 67~73, 50 미만 5% 이하", () => {
    for (const c of cats) {
      const xs = sides.map(([a, b]) => computeCompatScore(c, a, b).total), s = stats(xs);
      expect(s.median).toBeGreaterThanOrEqual(67); expect(s.median).toBeLessThanOrEqual(73);
      expect(xs.filter(x => x < 50).length / xs.length).toBeLessThanOrEqual(0.05);
      expect(s.min).toBeGreaterThanOrEqual(40); expect(s.max).toBeLessThanOrEqual(100);
    }
    expect([90, 89, 80, 79, 70, 69, 60, 59, 50, 49].map(x => bandOf(x).label)).toEqual(["천생연분", "잘 맞는 사이", "잘 맞는 사이", "끌림과 보완이 있는 사이", "끌림과 보완이 있는 사이", "맞춰 가면 좋아지는 사이", "맞춰 가면 좋아지는 사이", "노력이 필요한 사이", "노력이 필요한 사이", "서로 다른 세계"]);
  });
});
