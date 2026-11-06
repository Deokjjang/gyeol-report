import { describe, expect, it } from "vitest";
import type { MbtiType } from "../../../src/data/knowledge-v5/schema";
import { MBTI_TYPES } from "../../../src/data/knowledge-v5/schema";
import { BASE_SCORE, BASE_TIERS, bandOf, branchTier, COMPAT_SCORE_VERSION, computeCompatScore, ITEM_MAX, itemMax, MBTI_PARTS, TIERS, type CompatCategory, type CompatSide } from "../../../src/lib/compat/score";
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

describe("v5 궁합 점수 v2.2(P6e; v2.1 P6c-ui2)", () => {
  it("총점 = 기본 40 + 항목 합(MBTI가 없어도 화면 항목 합 = 총점 − 40, 만점 합 60), 결정론", () => {
    for (const [a, b] of sides.slice(0, 80)) for (const c of cats) {
      const s = computeCompatScore(c, a, b);
      const sum = s.items.reduce((n, i) => n + i.points, 0), full = s.items.reduce((n, i) => n + i.max, 0);
      expect(s.scaled).toBe(!(a.mbti && b.mbti));
      expect(full).toBe(60);
      expect(s.total).toBe(BASE_SCORE + sum);
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

  it("세부 점수(v2.2): 합의 순서를 지키고 가장 좋은 단계는 만점, 가장 낮은 단계(충·원진·상극 등)는 0", () => {
    const desc = (xs: readonly number[]) => xs.every((x, i) => i === 0 || xs[i - 1] >= x);
    const E = TIERS.element, M = TIERS.mbti;
    expect(desc([E["filled+filled"], E["filled+free"], E["filled+missed"], E["free+missed"], E["missed+missed"]])).toBe(true);
    expect(E["free+free"]).toBe(E["filled+missed"]); // 합의 기준에서 같은 단계
    expect(desc([TIERS.dayMaster.hap, TIERS.dayMaster.generate, TIERS.dayMaster.same, TIERS.dayMaster.control])).toBe(true);
    for (const t of [TIERS.dayBranch, TIERS.yearMonth]) expect(desc([t.hap, t.hapMixed, t.none, t.friction, t.clash])).toBe(true);
    expect(desc([TIERS.role.exact, TIERS.role.near, TIERS.role.generate, TIERS.role.other])).toBe(true);
    expect(desc(TIERS.yinYang)).toBe(true); expect(desc([M.talkSame, M.talkDiff])).toBe(true); expect(desc([M.golden, M.shared, M.plain, M.mirror])).toBe(true); expect(desc(M.rhythm)).toBe(true);
    for (const t of [E["filled+filled"], TIERS.dayMaster.hap, TIERS.dayBranch.hap, TIERS.yearMonth.hap, TIERS.role.exact, TIERS.yinYang[0], M.talkSame, M.golden, M.rhythm[0]]) expect(t).toBe(1);
    for (const t of [E["missed+missed"], TIERS.dayMaster.control, TIERS.dayBranch.clash, TIERS.yearMonth.clash, TIERS.role.other, TIERS.yinYang[3], M.talkDiff, M.mirror, M.rhythm[3]]) expect(t).toBe(0);
    expect(COMPAT_SCORE_VERSION).toBe("v2.2");
    // v2.2: MBTI '무난'(기능이 겹치지도 부딪치지도 않음)과 'E/I만 같음'에 부분 점수 — 열등 맞닿음·둘 다 다름(0)보다 뚜렷이 위, 한 단계 위보다는 아래.
    expect(M.golden).toBeGreaterThanOrEqual(M.shared); expect(M.shared - M.plain).toBeGreaterThanOrEqual(0.2); expect(M.plain).toBeGreaterThanOrEqual(0.3);
    expect(M.rhythm[0]).toBeGreaterThanOrEqual(M.rhythm[1]); expect(M.rhythm[1] - M.rhythm[2]).toBeGreaterThanOrEqual(0.2); expect(M.rhythm[2]).toBeGreaterThanOrEqual(0.3);
    expect(M.talkDiff).toBe(0); // 결정(문서 §9): N/S 다름은 무난한 중간 단계가 아니라 '먼저 맞춰 갈 부분'
    for (const c of cats) expect(ITEM_MAX[c].mbti % 3).toBe(0); // 세 부분 만점이 정수(15 → 5, 친구 18 → 6)
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
    // MBTI 몫 15점을 사주 항목 만점 비율대로 나눔(동료 12·10·6·10·4·3 × 60/45 → 내림 16·13·8·13·5·4, 남은 1점은 나머지가 같아 앞 항목에, 합 60).
    expect(Object.fromEntries(s.items.map(i => [i.key, i.max]))).toEqual({ element: 16, dayMaster: 14, dayBranch: 8, yearMonth: 13, role: 5, yinYang: 4 });
    for (const c of cats) expect(Object.values(itemMax(c, false)).reduce((n, x) => n + x!, 0)).toBe(60);
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

  it("MBTI 세 부분(v2.2): ESTJ×ENFP 사업 파트너도 MBTI 점수가 0이 아니고, 이유에 부분 점수가 보이며 합이 항목 점수", () => {
    const [a, b] = sides[0];
    const s = computeCompatScore("businessPartner", { ...a, name: "남궁현님", mbti: "ESTJ" }, { ...b, name: "백은솔님", mbti: "ENFP" });
    const m = s.items.find(i => i.key === "mbti")!;
    expect(m.max).toBe(15);
    expect(m.points).toBeGreaterThan(0);
    expect(m.reason).toContain("대화의 결 0/5 · 마음의 기능 2/5 · 에너지·생활 리듬 2/5"); // v2.1은 0/15
    expect(m.points).toBe(4);
    expect(m.reason).toContain("ESTJ인 남궁현님과 ENFP인 백은솔님은 마음의 기능이 겹치지도 부딪치지도 않아 큰 걸림 없이 어울리고, 둘 다 E라 에너지를 쓰는 방향이 같아 계획과 즉흥의 차이만 맞추면 함께 지내기 편해요.");
    expect(m.reason).toMatch(/다만 대화의 결이 달라 백은솔님은 큰 그림부터, 남궁현님은 구체적인 사실부터 말하니, 말의 순서가 가장 먼저 맞춰 갈 부분이에요\.$/);
    expect(s.total).toBe(BASE_SCORE + s.items.reduce((n, i) => n + i.points, 0));
  });

  it("MBTI 세 부분(v2.2): 16×16 유형 쌍 모두 부분 점수 합 = 항목 점수, 0점·낮은 부분은 강점으로 쓰지 않고 높은 부분은 맞춰 갈 거리로 쓰지 않는다", () => {
    const [a, b] = sides[0];
    // 부분마다 자기 문장에만 나오는 낱말(대화의 결 = 대화, 마음의 기능 = 기능, 에너지·생활 리듬 = 에너지).
    const KEY = { talk: /대화/, fn: /기능/, rhythm: /에너지/ } as const;
    for (const c of ["love", "friendship"] as const) for (const x of MBTI_TYPES) for (const y of MBTI_TYPES) {
      const m = computeCompatScore(c, { ...a, mbti: x }, { ...b, mbti: y }).items.find(i => i.key === "mbti")!;
      const part = m.max / 3, ss = splitSentences(m.reason);
      const got = (Object.keys(MBTI_PARTS) as (keyof typeof MBTI_PARTS)[]).map(k => {
        const hit = ss[0].match(new RegExp(`${MBTI_PARTS[k]} (\\d+)/(\\d+)`));
        expect(hit, m.reason).toBeTruthy(); expect(Number(hit![2])).toBe(part);
        return { k, p: Number(hit![1]) };
      });
      expect(got.reduce((n, g) => n + g.p, 0), `${x}×${y}`).toBe(m.points);
      expect(ss.length).toBeGreaterThanOrEqual(2); expect(ss.length).toBeLessThanOrEqual(3);
      const work = ss.slice(1).find(t => /먼저 맞춰 갈 부분이에요\.$/.test(t)) ?? "", strong = ss.slice(1).find(t => t !== work) ?? "";
      for (const { k, p } of got) {
        if (p / part < 0.3) { expect(strong, `${x}×${y} ${k} ${p}/${part}: ${m.reason}`).not.toMatch(KEY[k]); expect(work, `${x}×${y} ${k}`).toMatch(KEY[k]); }
        if (p / part >= 0.7) { expect(work, `${x}×${y} ${k} ${p}/${part}: ${m.reason}`).not.toMatch(KEY[k]); expect(strong, `${x}×${y} ${k}`).toMatch(KEY[k]); }
      }
      if (got.some(g => g.p === 0)) expect(m.reason).toMatch(/먼저 맞춰 갈 부분이에요\.$/);
      if (got.every(g => g.p / part >= 0.3)) expect(m.reason).not.toContain("맞춰 갈 부분");
    }
  });

  it("분포(보정 표본 밖 시드, 400쌍): 유형마다 중앙값 67~73, 50 미만·90 이상 둘 다 있음(1만 쌍 분포는 문서 §9.4)", () => {
    for (const c of cats) {
      const xs = sides.map(([a, b]) => computeCompatScore(c, a, b).total), s = stats(xs);
      expect(s.median).toBeGreaterThanOrEqual(67); expect(s.median).toBeLessThanOrEqual(73);
      for (const tail of [xs.filter(x => x < 50).length / xs.length, xs.filter(x => x >= 90).length / xs.length]) { expect(tail).toBeGreaterThanOrEqual(0.01); expect(tail).toBeLessThanOrEqual(0.08); }
      expect(s.min).toBeGreaterThanOrEqual(40); expect(s.max).toBeLessThanOrEqual(100);
    }
    expect([90, 89, 80, 79, 70, 69, 60, 59, 50, 49].map(x => bandOf(x).label)).toEqual(["천생연분", "잘 맞는 사이", "잘 맞는 사이", "끌림과 보완이 있는 사이", "끌림과 보완이 있는 사이", "맞춰 가면 좋아지는 사이", "맞춰 가면 좋아지는 사이", "노력이 필요한 사이", "노력이 필요한 사이", "서로 다른 세계"]);
  });
});
