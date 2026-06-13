import { describe, expect, it } from "vitest";

import { buildComprehensiveReportDisplayData } from "../../../src/lib/report-display/comprehensiveReportDisplayBuilder";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const deokminSampleFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

describe("comprehensive report display builder", () => {
  it("builds deterministic display cards from computed facts and MBTI knowledge", () => {
    const displayData = buildComprehensiveReportDisplayData({
      sajuFacts: deokminSampleFacts,
      mbtiType: "ENTJ",
    });

    expect(displayData.sajuCard.dayMaster.label).toBe("갑목");
    expect(displayData.sajuCard.dayPillar.label).toBe("갑신일주");
    expect(displayData.sajuCard.dayPillar.image).toContain("바위");
    expect(displayData.sajuCard.fiveElements.counts).toEqual({
      wood: 2,
      fire: 0,
      earth: 4,
      metal: 2,
      water: 0,
    });
    expect(displayData.sajuCard.fiveElements.excessive).toEqual(["earth"]);
    expect(displayData.sajuCard.fiveElements.missing).toEqual(["fire", "water"]);
    expect(displayData.sajuCard.fiveElements.useful).toEqual(["water", "wood"]);
    expect(displayData.sajuCard.tenGods.primary.map((item) => item.labelKo)).toEqual([
      "편재",
      "정재",
      "정관",
      "편관",
    ]);
    expect(displayData.sajuCard.specialPatterns).toEqual([
      "재다신약",
      "무인성",
      "무식상",
    ]);
    expect(displayData.sajuCard.sinsal).toEqual([
      "현침살",
      "홍염살",
      "귀문관살",
      "원진살",
    ]);
    expect(displayData.sajuCard.gwiin).toEqual(["재고귀인"]);
    expect(displayData.mbtiCard.type).toBe("ENTJ");
    expect(displayData.mbtiCard.functionStack).toEqual(["Te", "Ni", "Se", "Fi"]);
    expect(displayData.mbtiCard.coreTraits.join(" ")).toContain("성과");
    expect(displayData.mbtiCard.reportUsage.join(" ")).toContain("사주");
  });
});
