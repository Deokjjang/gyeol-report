import { describe, expect, it } from "vitest";

import { buildComprehensiveReportV2ProfileTable } from "../../../src/lib/report-generation/comprehensiveReportProfileTableBuilder";
import { buildComprehensiveReportEvidencePacketFromComputedFacts } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceInputBuilder";
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
    expect(profileTable.excessiveElements).toEqual(expect.arrayContaining(["토 과다"]));
    expect(profileTable.fiveElementSummary).toEqual([
      "목 2",
      "화 0",
      "토 4",
      "금 2",
      "수 0",
    ]);
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
    expect(profileTable.excessiveElements).toEqual(expect.arrayContaining(["토 과다"]));
    expect(profileTable.missingElements).toEqual(
      expect.arrayContaining(["화 부족", "수 부족"]),
    );
  });
});
