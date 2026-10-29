/** 감지기별 규칙표 단위 테스트. */
import { describe, expect, it } from "vitest";
import {
  analyzeChartDetections,
  analyzeClimate,
  analyzeIncoming,
  detectRelations,
  detectStructureFlows,
  getAnnualPillar,
  getMonthlyPillars,
  getStageBranch,
  getTwelveStage,
  membersAdjacent,
  TWELVE_STAGES,
} from "@/lib/saju/detections";
import { CLIMATE_TABLE } from "@/lib/saju/detections/tables";
import type { HeavenlyStem, TenGod } from "@/lib/saju/types";
import { chartOf, natalOf, P } from "./chartFixture";

const STEMS = "甲乙丙丁戊己庚辛壬癸".split("") as HeavenlyStem[];

describe("relations", () => {
  it("인접 = 년-월·월-일·일-시 연속, 유입 자리는 늘 false", () => {
    expect(membersAdjacent(["year", "month"])).toBe(true);
    expect(membersAdjacent(["year", "day"])).toBe(false);
    expect(membersAdjacent(["year", "hour"])).toBe(false);
    expect(membersAdjacent(["month", "day", "hour"])).toBe(true);
    expect(membersAdjacent(["year", "month", "hour"])).toBe(false);
    expect(membersAdjacent(["day", "annual"])).toBe(false);
  });

  it("쟁합·중복충은 자리 조합마다 한 건", () => {
    const hits = detectRelations(natalOf("甲子 己午 甲子 庚午"));
    expect(hits.filter((h) => h.kind === "STEM_HAP")).toHaveLength(2);
    expect(hits.filter((h) => h.kind === "CHUNG").map((h) => h.members.map((m) => m.position).join("-"))).toEqual([
      "year-month", "year-hour", "month-day", "day-hour",
    ]);
  });

  it("variant key는 지식 DB 표기 순서를 따른다(구성원 순서와 무관)", () => {
    expect(detectRelations(natalOf("甲午 丙子 戊寅")).find((h) => h.kind === "CHUNG")?.key).toBe("子午");
    const pa = detectRelations(natalOf("甲未 丙戌 戊寅")).find((h) => h.kind === "PA");
    expect(pa?.key).toBe("戌未");
  });

  it("삼합 full이 있으면 같은 국의 반합은 내지 않는다", () => {
    const hits = detectRelations(natalOf("甲申 丙子 戊辰 庚子")).filter((h) => h.kind === "SAMHAP");
    expect(hits.map((h) => h.completeness)).toEqual(["full", "full"]);
  });

  it("삼형 full이 있으면 같은 삼형의 partial은 내지 않는다", () => {
    const hits = detectRelations(natalOf("甲寅 己巳 庚申 丙寅")).filter((h) => h.kind === "HYEONG");
    expect(hits.every((h) => h.completeness === "full")).toBe(true);
    expect(hits).toHaveLength(2);
  });

  it("유입 기둥이 원국 2자와 삼합을 완성하면 full, 유입 관계만 남는다", () => {
    const saju = chartOf("甲申 丙子 戊午 庚午");
    const inc = analyzeIncoming(saju, "annual", P("壬辰"));
    const samhap = inc.relations.filter((r) => r.kind === "SAMHAP");
    expect(samhap).toHaveLength(1);
    expect(samhap[0]).toMatchObject({ completeness: "full", adjacent: false });
    expect(inc.relations.every((r) => r.members.some((m) => m.position === "annual"))).toBe(true);
  });
});

describe("twelve stages", () => {
  it("각 일간마다 12운성이 12지지에 한 번씩", () => {
    for (const stem of STEMS) {
      for (const stage of TWELVE_STAGES) expect(getTwelveStage(stem, getStageBranch(stem, stage))).toBe(stage);
    }
  });
  it("원국 감지는 일간 기준 각 자리 운성", () => {
    const det = analyzeChartDetections(chartOf("甲子 丙寅 甲午 丙寅"));
    expect(det.twelveStages.map((t) => `${t.position}:${t.stage}`)).toEqual(["year:沐浴", "month:建祿", "day:死", "hour:建祿"]);
  });
});

describe("climate table", () => {
  it("40칸 모두 규칙이 있고 primary 필요 기운이 1개 이상", () => {
    expect(Object.keys(CLIMATE_TABLE)).toHaveLength(40);
    for (const rule of Object.values(CLIMATE_TABLE)) expect(rule.needs.some((n) => n.role === "primary")).toBe(true);
  });
  it("지지로만 세는 기운(visible=false)은 천간으로 세지 않는다", () => {
    // 乙:winter: 丙(巳·寅) primary, 午 속 丁 primary(지지만), 丁 투간은 support.
    const onlyStem = analyzeClimate(natalOf("丁亥 戊子 乙丑 丁亥"));
    expect(onlyStem.needs.find((n) => n.role === "primary" && n.stem === "丁")?.foundAt).toEqual([]);
    expect(onlyStem.level).toBe("medium");
    expect(analyzeClimate(natalOf("壬午 壬子 乙丑 丁亥")).level).toBe("strong");
  });
  it("戌월 화고 1단계 완화(丙 가을: 壬·甲 없음 → medium)", () => {
    expect(analyzeClimate(natalOf("庚戌 丙戌 丙辰 戊戌")).level).toBe("medium");
    expect(analyzeClimate(natalOf("庚戌 乙酉 丙辰 戊戌")).level).toBe("weak");
  });
  it("시주가 없으면 foundAt에 hour가 없다", () => {
    const c = analyzeClimate(natalOf("壬子 壬子 丁丑"));
    expect(c.needs.flatMap((n) => n.foundAt)).not.toContain("hour");
  });
});

describe("gongmang options", () => {
  it("day+year면 년주 기준이 추가되고 년 자리 자신은 빠진다", () => {
    const det = analyzeChartDetections(chartOf("甲子 丙寅 庚午 丁亥"), { gongmangBasis: "day+year" });
    expect(det.gongmang.map((g) => g.basis)).toEqual(["day", "year"]);
    expect(det.gongmang[1]).toMatchObject({ xun: "甲子", branches: ["戌", "亥"], positions: ["hour"] });
  });
});

describe("structure flows", () => {
  const base = chartOf("甲子 丙寅 戊午 庚申");
  const withScores = (dist: Partial<Record<TenGod, number>>, level: "WEAK" | "BALANCED") => ({
    tenGods: { ...base.tenGods, distribution: { ...base.tenGods.distribution, 比肩: 0, 劫財: 0, 食神: 0, 傷官: 0, 偏財: 0, 正財: 0, 偏官: 0, 正官: 0, 偏印: 0, 正印: 0, ...dist } },
    structureAnalysis: { ...base.structureAnalysis, dayMasterStrength: { ...base.structureAnalysis.dayMasterStrength, level, score: level === "WEAK" ? -1 : 0 } },
  });
  it("임계 1.5: 식상생재·재생관은 일간 WEAK 아님, 살인상생은 WEAK 이하", () => {
    expect(detectStructureFlows(withScores({ 食神: 1, 傷官: 0.5, 偏財: 1.5 }, "BALANCED")).map((f) => f.code)).toEqual(["OUTPUT_GENERATES_WEALTH"]);
    expect(detectStructureFlows(withScores({ 食神: 1, 傷官: 0.5, 偏財: 1.5 }, "WEAK"))).toEqual([]);
    expect(detectStructureFlows(withScores({ 偏財: 1.5, 正官: 1.5 }, "BALANCED")).map((f) => f.code)).toEqual(["WEALTH_GENERATES_OFFICER"]);
    expect(detectStructureFlows(withScores({ 偏官: 1.5, 正印: 1.5 }, "WEAK")).map((f) => f.code)).toEqual(["RESOURCE_SUPPORTS_DAYMASTER"]);
    expect(detectStructureFlows(withScores({ 偏官: 1.4, 正印: 1.5 }, "WEAK"))).toEqual([]);
  });
});

describe("timeline pillars", () => {
  it("세운은 立春 기준 해 간지", () => {
    expect(getAnnualPillar(1984)).toEqual(P("甲子"));
    expect(getAnnualPillar(2026)).toEqual(P("丙午"));
  });
  it("월운 12절월 寅~丑, 五虎遁 월간, 절입 시각 증가", () => {
    const months = getMonthlyPillars(2026);
    expect(months.map((m) => m.branch).join("")).toBe("寅卯辰巳午未申酉戌亥子丑");
    expect(months[0].pillar).toEqual(P("庚寅"));
    expect(months[11].pillar).toEqual(P("辛丑"));
    expect(months[0].startKst.startsWith("2026-02-04")).toBe(true);
    expect(months[11].startKst.startsWith("2027-01-")).toBe(true);
    for (let i = 1; i < 12; i += 1) expect(Date.parse(months[i].startKst)).toBeGreaterThan(Date.parse(months[i - 1].startKst));
  });
});
