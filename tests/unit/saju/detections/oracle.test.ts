/**
 * 독립 오라클 교차검증(P0-1 방식). 아래 표는 detections/tables.ts를 import하지 않고 손으로 옮긴 통용표다.
 * 엔진 전 칸(십이운성 120칸, 60일주 공망, 지지 78쌍 관계)을 표와 대조한다.
 */
import { describe, expect, it } from "vitest";
import { detectRelations, getGongmang, getTwelveStage } from "@/lib/saju/detections";
import type { EarthlyBranch, HeavenlyStem } from "@/lib/saju/types";

const STEMS = "甲乙丙丁戊己庚辛壬癸".split("") as HeavenlyStem[];
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥".split("") as EarthlyBranch[];

// 십이운성 통용표(양순음역, 戊=丙·己=丁). 열 순서 子丑寅卯辰巳午未申酉戌亥.
const STAGE_GRID: Record<HeavenlyStem, string> = {
  甲: "沐浴 冠帶 建祿 帝旺 衰 病 死 墓 絶 胎 養 長生",
  乙: "病 衰 帝旺 建祿 冠帶 沐浴 長生 養 胎 絶 墓 死",
  丙: "胎 養 長生 沐浴 冠帶 建祿 帝旺 衰 病 死 墓 絶",
  丁: "絶 墓 死 病 衰 帝旺 建祿 冠帶 沐浴 長生 養 胎",
  戊: "胎 養 長生 沐浴 冠帶 建祿 帝旺 衰 病 死 墓 絶",
  己: "絶 墓 死 病 衰 帝旺 建祿 冠帶 沐浴 長生 養 胎",
  庚: "死 墓 絶 胎 養 長生 沐浴 冠帶 建祿 帝旺 衰 病",
  辛: "長生 養 胎 絶 墓 死 病 衰 帝旺 建祿 冠帶 沐浴",
  壬: "帝旺 衰 病 死 墓 絶 胎 養 長生 沐浴 冠帶 建祿",
  癸: "建祿 冠帶 沐浴 長生 養 胎 絶 墓 死 病 衰 帝旺",
};

// 육십갑자 순공 통용표: 순 → 빈 두 지지, 그 순의 10일주.
const XUN_TABLE: readonly [string, string, string][] = [
  ["甲子", "戌亥", "甲子 乙丑 丙寅 丁卯 戊辰 己巳 庚午 辛未 壬申 癸酉"],
  ["甲戌", "申酉", "甲戌 乙亥 丙子 丁丑 戊寅 己卯 庚辰 辛巳 壬午 癸未"],
  ["甲申", "午未", "甲申 乙酉 丙戌 丁亥 戊子 己丑 庚寅 辛卯 壬辰 癸巳"],
  ["甲午", "辰巳", "甲午 乙未 丙申 丁酉 戊戌 己亥 庚子 辛丑 壬寅 癸卯"],
  ["甲辰", "寅卯", "甲辰 乙巳 丙午 丁未 戊申 己酉 庚戌 辛亥 壬子 癸丑"],
  ["甲寅", "子丑", "甲寅 乙卯 丙辰 丁巳 戊午 己未 庚申 辛酉 壬戌 癸亥"],
];

// 지지 두 글자 관계 통용표(무순서 쌍). 육합·충·형(상형·자형·삼형 2자)·파·해·원진.
const PAIR_RELATIONS: Record<string, string> = {
  子丑: "YUKHAP", 寅亥: "YUKHAP PA", 卯戌: "YUKHAP", 辰酉: "YUKHAP", 巳申: "YUKHAP PA HYEONG", 午未: "YUKHAP",
  子午: "CHUNG", 丑未: "CHUNG HYEONG", 寅申: "CHUNG HYEONG", 卯酉: "CHUNG", 辰戌: "CHUNG", 巳亥: "CHUNG",
  子卯: "HYEONG", 寅巳: "HYEONG HAE", 丑戌: "HYEONG", 戌未: "HYEONG PA",
  辰辰: "HYEONG", 午午: "HYEONG", 酉酉: "HYEONG", 亥亥: "HYEONG",
  子酉: "PA", 丑辰: "PA", 卯午: "PA",
  子未: "HAE WONJIN", 丑午: "HAE WONJIN", 卯辰: "HAE", 申亥: "HAE", 酉戌: "HAE",
  寅酉: "WONJIN", 卯申: "WONJIN", 辰亥: "WONJIN", 巳戌: "WONJIN",
};
const PAIR_KINDS = ["YUKHAP", "CHUNG", "HYEONG", "PA", "HAE", "WONJIN"];

describe("oracle: 십이운성 10×12", () => {
  it("엔진이 120칸 모두 통용표와 같다", () => {
    let compared = 0;
    for (const stem of STEMS) {
      const row = STAGE_GRID[stem].split(" ");
      BRANCHES.forEach((branch, i) => {
        expect(getTwelveStage(stem, branch), `${stem}${branch}`).toBe(row[i]);
        compared += 1;
      });
    }
    expect(compared).toBe(120);
  });
});

describe("oracle: 60일주 공망", () => {
  it("60간지 모두 통용 순공표와 같다", () => {
    let compared = 0;
    for (const [xun, empty, members] of XUN_TABLE) {
      for (const ganji of members.split(" ")) {
        const result = getGongmang({ stem: ganji[0] as HeavenlyStem, branch: ganji[1] as EarthlyBranch });
        expect(result.xun, ganji).toBe(xun);
        expect(result.branches.join(""), ganji).toBe(empty);
        compared += 1;
      }
    }
    expect(compared).toBe(60);
  });
});

describe("oracle: 지지 78쌍(같은 지지 포함) 관계", () => {
  it("육합·충·형·파·해·원진이 통용표와 같다", () => {
    let compared = 0;
    for (let i = 0; i < 12; i += 1) {
      for (let j = i; j < 12; j += 1) {
        const a = BRANCHES[i];
        const b = BRANCHES[j];
        const expected = (PAIR_RELATIONS[a + b] ?? PAIR_RELATIONS[b + a] ?? "").split(" ").filter(Boolean).sort();
        // 년-월(인접) 두 자리만: 삼합 반합·방합은 이 표 밖이라 제외.
        const hits = detectRelations([
          { position: "year", pillar: { stem: "甲", branch: a } },
          { position: "month", pillar: { stem: "甲", branch: b } },
        ]);
        const kinds = [...new Set(hits.map((h) => h.kind))].filter((k) => PAIR_KINDS.includes(k)).sort();
        expect(kinds, `${a}${b}`).toEqual(expected);
        compared += 1;
      }
    }
    expect(compared).toBe(78);
  });
});
