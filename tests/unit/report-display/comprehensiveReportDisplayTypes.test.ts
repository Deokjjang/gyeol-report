import { describe, expect, it } from "vitest";

import type {
  ComprehensiveReportDisplayData,
  MbtiSummaryCard,
  SajuSummaryCard,
} from "../../../src/lib/report-display/comprehensiveReportDisplayTypes";

describe("comprehensive report display types", () => {
  it("represents safe Saju and MBTI display cards", () => {
    const sajuCard: SajuSummaryCard = {
      dayMaster: {
        label: "갑목",
        description: "큰 나무처럼 방향을 세우는 일간입니다.",
      },
      dayPillar: {
        label: "갑신일주",
        image: "바위 위 소나무",
      },
      fiveElements: {
        counts: {
          wood: 2,
          fire: 0,
          earth: 4,
          metal: 2,
          water: 0,
        },
        excessive: ["earth"],
        missing: ["fire", "water"],
        useful: ["water", "wood"],
      },
      tenGods: {
        primary: [
          {
            id: "pian_cai",
            labelKo: "편재",
            strength: "strong",
          },
        ],
      },
      specialPatterns: ["재다신약"],
      sinsal: ["현침살", "홍염살"],
      gwiin: ["재고귀인"],
    };
    const mbtiCard: MbtiSummaryCard = {
      type: "ENTJ",
      labelKo: "ENTJ",
      commonAliasKo: "지휘관",
      functionStack: ["Te", "Ni", "Se", "Fi"],
      coreTraits: ["성과 중심"],
      reportUsage: ["사주 해석 보조"],
    };
    const displayData: ComprehensiveReportDisplayData = {
      sajuCard,
      mbtiCard,
    };
    const serialized = JSON.stringify(displayData);

    expect(displayData.sajuCard.dayMaster.label).toBe("갑목");
    expect(displayData.mbtiCard.type).toBe("ENTJ");
    expect(serialized).not.toContain("paymentKey");
    expect(serialized).not.toContain("inputSnapshot");
  });
});
