import { describe, expect, it } from "vitest";

import {
  buildCompatibilityEvidencePacketFromFixture,
  buildCompatibilityEvidencePacketFromFixtureId,
} from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";

describe("REPORT-18A compatibility evidence builder", () => {
  it("builds deokmin sodam evidence packet with two chart summaries and score", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

    expect(packet.input.productType).toBe("saju_mbti_compatibility");
    expect(packet.personAChartSummary.displayName).toBe("덕민");
    expect(packet.personAChartSummary.pillars).toEqual({
      year: "己卯",
      month: "辛未",
      day: "甲申",
      hour: "戊辰",
    });
    expect(packet.personBChartSummary.displayName).toBe("소담");
    expect(packet.personBChartSummary.pillars.day).toBe("丁丑");
    expect(packet.score.totalScore).toBeGreaterThan(0);
    expect(packet.evidenceBySection.strengths.length).toBeGreaterThan(0);
    expect(packet.evidenceBySection.money_lifestyle.length).toBeGreaterThan(0);
    expect(packet.deepSajuBridge?.notes.length).toBeGreaterThanOrEqual(5);
    expect(
      new Set(
        Object.values(packet.evidenceBySection)
          .flat()
          .flatMap((item) =>
            item.deepSajuLayer === undefined ? [] : [item.deepSajuLayer],
          ),
      ).size,
    ).toBeGreaterThan(4);
    expect(JSON.stringify(packet.deepSajuBridge)).not.toContain("백호대살");
  });

  it("adds warnings for missing time and missing MBTI", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("unknown-time-some");

    expect(packet.warnings).toContain("personB birth time unknown");
    expect(packet.warnings).toContain("personB MBTI missing");
  });

  it("can build from fixture object directly", () => {
    const fixture = requireCompatibilityFixture("friendship-mbti-known");
    const packet = buildCompatibilityEvidencePacketFromFixture(fixture);

    expect(packet.input.relationshipType).toBe("friendship");
    expect(packet.personAChartSummary.mbti).toBe("ISTJ");
    expect(packet.personBChartSummary.mbti).toBe("ESTP");
  });
});
