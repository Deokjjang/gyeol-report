import { describe, expect, it } from "vitest";

import { buildComprehensiveReportV2ProfileTable } from "../../../src/lib/report-generation/comprehensiveReportProfileTableBuilder";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
import { getReportSmokeFixture } from "../../../src/lib/report-knowledge/reportQualityFixtureMatrix";
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
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  sinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

describe("comprehensive report profile table builder", () => {
  it("builds deterministic V2 profile table from evidence packet", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const profileTable = buildComprehensiveReportV2ProfileTable({
      evidencePacket: packet,
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });

    expect(profileTable).toMatchObject({
      dayMaster: "갑목",
      dayPillar: "갑신일주",
      mbti: "ENTJ",
    });
    expect(profileTable.dayPillarKeywords).toEqual(
      expect.arrayContaining([
        "바위 위 소나무",
        "갑목의 성장성과 신금의 절단력이 맞물립니다.",
      ]),
    );
    expect(profileTable.excessiveElements).toEqual(expect.arrayContaining(["토 과다"]));
    expect(profileTable.fiveElementSummary).toEqual([
      "목 2",
      "화 0",
      "토 4",
      "금 2",
      "수 0",
    ]);
    expect(profileTable.fiveElementBadges).toEqual([
      "목 2",
      "화 0",
      "토 4",
      "금 2",
      "수 0",
    ]);
    expect(profileTable.fiveElementBadges.join("\n")).not.toContain("초록");
    expect(profileTable.fiveElementBadges.join("\n")).not.toContain("빨강");
    expect(profileTable.fiveElementBadges.join("\n")).not.toContain("갈색");
    expect(profileTable.fiveElementBadges.join("\n")).not.toContain("금색");
    expect(profileTable.fiveElementBadges.join("\n")).not.toContain("파랑");
    expect(profileTable.missingElements).toEqual(
      expect.arrayContaining(["화 부족", "수 부족"]),
    );
    expect(profileTable.tenGodSummary).toEqual(
      expect.arrayContaining(["편재", "정재", "정관", "편관"]),
    );
    expect(profileTable.specialPatterns).toEqual(
      expect.arrayContaining(["재다신약", "무인성", "무식상"]),
    );
    expect(profileTable.sinsal).toEqual(
      expect.arrayContaining(["현침살", "홍염살", "귀문관살", "원진살"]),
    );
    expect(profileTable.gwiin).toEqual(expect.arrayContaining(["재고귀인"]));
    expect(profileTable).not.toHaveProperty("yearPillar");
    expect(profileTable).not.toHaveProperty("monthPillar");
    expect(profileTable).not.toHaveProperty("hourPillar");
    expect(profileTable.fourPillarGrid?.map((column) => column.labelKo)).toEqual([
      "시주",
      "일주",
      "월주",
      "연주",
    ]);
    expect(profileTable.fourPillarGrid?.find((column) => column.columnId === "day")).toMatchObject({
      heavenlyStem: "갑",
      earthlyBranch: "신",
    });
  });

  it("can fall back to evidence labels when computed facts are not provided", () => {
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: deokminSampleFacts,
    });
    const profileTable = buildComprehensiveReportV2ProfileTable({
      evidencePacket: packet,
      mbtiType: "ENTJ",
    });

    expect(profileTable).toMatchObject({
      dayMaster: "갑목",
      dayPillar: "갑신일주",
      mbti: "ENTJ",
    });
    expect(profileTable.dayPillarKeywords).toEqual(
      expect.arrayContaining(["바위 위 소나무"]),
    );
    expect(profileTable.excessiveElements).toEqual(expect.arrayContaining(["토 과다"]));
    expect(profileTable.missingElements).toEqual(
      expect.arrayContaining(["화 부족", "수 부족"]),
    );
  });

  it("surfaces computed feature groups in the deterministic V2 table", () => {
    const facts = {
      ...deokminSampleFacts,
      yearPillar: "병자",
      monthPillar: "기해",
      hourPillar: "정미",
      earthlyBranches: ["子", "亥", "申", "未"],
      heavenlyStems: ["丙", "己", "甲", "丁"],
    } as const satisfies ComputedSajuFacts;
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: "ENTJ",
      sajuFacts: facts,
    });
    const profileTable = buildComprehensiveReportV2ProfileTable({
      evidencePacket: packet,
      mbtiType: "ENTJ",
      sajuFacts: facts,
    });

    expect(profileTable.yearPillar).toBe("병자");
    expect(profileTable.monthPillar).toBe("기해");
    expect(profileTable.hourPillar).toBe("정미");
    expect(profileTable.fourPillarGrid).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          columnId: "hour",
          labelKo: "시주",
          heavenlyStem: "정",
          earthlyBranch: "미",
        }),
        expect.objectContaining({
          columnId: "day",
          labelKo: "일주",
          heavenlyStem: "갑",
          earthlyBranch: "신",
        }),
        expect.objectContaining({
          columnId: "month",
          labelKo: "월주",
          heavenlyStem: "기",
          earthlyBranch: "해",
        }),
        expect.objectContaining({
          columnId: "year",
          labelKo: "연주",
          heavenlyStem: "병",
          earthlyBranch: "자",
        }),
      ]),
    );
    expect(profileTable.twelveSinsal).toEqual(
      expect.arrayContaining(["장성살", "지살"]),
    );
    expect(profileTable.majorSinsal).toEqual(
      expect.arrayContaining(["현침살", "홍염살"]),
    );
    expect(profileTable.gwiinGilshin).toEqual(
      expect.arrayContaining(["천을귀인", "재고귀인"]),
    );
    expect(profileTable.sinsal).toEqual(
      expect.arrayContaining(["현침살", "홍염살", "장성살"]),
    );
    expect(profileTable.gwiin).toEqual(
      expect.arrayContaining(["천을귀인", "재고귀인"]),
    );
    expect(profileTable.twelveSinsal).not.toContain("반안살");
  });
  it("renders sodam-intp 丁丑 day pillar completeness in the deterministic grid", () => {
    const fixture = getReportSmokeFixture("sodam-intp");
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
    const profileTable = buildComprehensiveReportV2ProfileTable({
      evidencePacket: packet,
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
    const dayColumn = profileTable.fourPillarGrid?.find(
      (column) => column.columnId === "day",
    );

    expect(profileTable.dayPillar).toBe("정축일주");
    expect(dayColumn).toMatchObject({
      pillar: "정축",
      heavenlyStem: "정",
      earthlyBranch: "축",
    });
    expect(dayColumn?.tenGod).toEqual(
      expect.arrayContaining(["천간 비견", "지지 식신"]),
    );
    expect(dayColumn?.hiddenStems).toEqual(["癸", "辛", "己"]);
    expect(dayColumn?.twelveLifeStage).toBeDefined();
    expect(dayColumn?.twelveLifeStage).not.toEqual(["-"]);
    expect(dayColumn?.twelveSinsal).toEqual(expect.arrayContaining(["화개살"]));
    expect(dayColumn?.heavenlyStem).not.toBe("-");
    expect(dayColumn?.earthlyBranch).not.toBe("-");
  });

  it("keeps deokmin-entj 甲申 day pillar rendering intact", () => {
    const fixture = getReportSmokeFixture("deokmin");
    const { packet } = buildComprehensiveReportEvidencePacketFromComputedFacts({
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
    const profileTable = buildComprehensiveReportV2ProfileTable({
      evidencePacket: packet,
      mbtiType: fixture.mbti,
      sajuFacts: fixture.sajuFacts,
    });
    const dayColumn = profileTable.fourPillarGrid?.find(
      (column) => column.columnId === "day",
    );

    expect(profileTable.dayPillar).toBe("갑신일주");
    expect(dayColumn).toMatchObject({
      pillar: "갑신",
      heavenlyStem: "갑",
      earthlyBranch: "신",
    });
    expect(dayColumn?.heavenlyStem).not.toBe("-");
    expect(dayColumn?.earthlyBranch).not.toBe("-");
  });
});
