import { describe, expect, it } from "vitest";

import {
  buildCompatibilityEvidencePacket,
  buildCompatibilityEvidencePacketFromFixture,
  buildCompatibilityEvidencePacketFromFixtureId,
} from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import type { CompatibilityRelationshipCategoryInput } from "../../../src/lib/report-knowledge/compatibilityTypes";
import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";

describe("REPORT-18A compatibility evidence builder", () => {
  function buildPacketWithRelationshipType(
    relationshipType: CompatibilityRelationshipCategoryInput,
  ) {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");

    return buildCompatibilityEvidencePacket({
      input: {
        ...fixture.input,
        relationshipType,
      },
      personASajuFacts: fixture.personASajuFacts,
      personBSajuFacts: fixture.personBSajuFacts,
      expectedPillars: fixture.expectedPillars,
    });
  }

  it("builds deokmin sodam evidence packet with two chart summaries and score", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

    expect(packet.productType).toBe("saju_mbti_compatibility");
    expect(packet.relationshipType).toBe("love");
    expect(packet.input.productType).toBe("saju_mbti_compatibility");
    expect(packet.participants.a.name).toBe("덕민");
    expect(packet.participants.b.name).toBe("소담");
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

    expect(packet.input.relationshipType).toBe("love");
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

  it("normalizes legacy fixture relationship types to canonical categories", () => {
    expect(
      buildCompatibilityEvidencePacketFromFixtureId("family-unknown-mbti").input
        .relationshipType,
    ).toBe("parentChild");
    expect(
      buildCompatibilityEvidencePacketFromFixtureId("business-work-partner-sample").input
        .relationshipType,
    ).toBe("businessPartner");
  });

  it("builds categoryLens for all seven canonical relationship categories", () => {
    const categories = [
      "love",
      "marriage",
      "parentChild",
      "coworker",
      "managerReport",
      "businessPartner",
      "friendship",
    ] as const;

    for (const category of categories) {
      const packet = buildPacketWithRelationshipType(category);

      expect(packet.relationshipType).toBe(category);
      expect(packet.categoryLens.relationshipType).toBe(category);
      expect(packet.categoryLens.focus.length).toBeGreaterThan(0);
      expect(packet.categoryLens.repairFocus.length).toBeGreaterThan(0);
    }
  });

  it("falls back unknown relationship category to love", () => {
    const packet = buildPacketWithRelationshipType(
      "unknown" as CompatibilityRelationshipCategoryInput,
    );

    expect(packet.relationshipType).toBe("love");
    expect(packet.categoryLens.relationshipType).toBe("love");
  });

  it("separates launch evidence into saju, MBTI, bridge, and direct findings", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");

    expect(packet.sajuCompatibility.dayMasterRelation).toBeTruthy();
    expect(packet.sajuCompatibility.tenGodRelation).toBeTruthy();
    expect(packet.sajuCompatibility.branchInteractions.length).toBeGreaterThan(0);
    expect(
      [
        ...packet.sajuCompatibility.elementComplementSignals,
        ...packet.sajuCompatibility.sharedWeakElementSignals,
        ...packet.sajuCompatibility.overloadedElementSignals,
      ].join("\n"),
    ).toMatch(/오행|흐름|기운|보완|과해/u);
    expect(packet.mbtiCompatibility.source).toBe("notablePairs");
    expect(packet.mbtiCompatibility.sharedGround.length).toBeGreaterThan(0);
    expect(packet.mbtiCompatibility.reportLine).toContain("ENTJ");
    expect(packet.mbtiCompatibility.lovePattern).toContain("ENTJ");
    expect(packet.mbtiCompatibility.marriagePattern).toContain("생활");
    expect(packet.bridgeCompatibility.interpretationMode).toContain("명리");
    expect(packet.bridgeCompatibility.interpretationMode).toContain("MBTI");
    expect(packet.bridgeCompatibility.cautionSignals.join("\n")).toContain(
      "생활 기준",
    );
    expect(packet.bridgeCompatibility.cautionSignals.join("\n")).not.toContain(
      "丑未 충",
    );
    expect(packet.bridgeCompatibility.cautionSignals.join("\n")).not.toContain(
      "申亥 해",
    );
    expect(new Set(packet.directFindings.map((finding) => finding.type))).toEqual(
      new Set(["strength", "friction", "risk", "repair"]),
    );
    expect(packet.directFindings.map((finding) => finding.title).join("\n")).toContain(
      "A가 B에게 주는 압박",
    );
    expect(
      packet.directFindings.map((finding) => finding.interpretation).join("\n"),
    ).toContain("결론과 실행");
    expect(
      packet.directFindings.flatMap((finding) => finding.evidence).join("\n"),
    ).not.toContain("丑未 충");
    expect(packet.strengths.length).toBeGreaterThan(0);
    expect(packet.frictionPoints.length).toBeGreaterThan(0);
    expect(packet.repairStrategies.length).toBeGreaterThan(0);
  });

  it("uses neutral MBTI fallback without throwing when MBTI is unknown", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");
    const packet = buildCompatibilityEvidencePacket({
      input: {
        ...fixture.input,
        personA: {
          ...fixture.input.personA,
          mbti: "UNKNOWN",
        },
        personB: {
          ...fixture.input.personB,
          mbti: null,
        },
      },
      personASajuFacts: fixture.personASajuFacts,
      personBSajuFacts: fixture.personBSajuFacts,
      expectedPillars: fixture.expectedPillars,
    });

    expect(packet.participants.a.mbtiType).toBeNull();
    expect(packet.participants.b.mbtiType).toBeNull();
    expect(packet.mbtiCompatibility.source).toBe("unknown");
    expect(packet.mbtiCompatibility.pairLabel).toBeNull();
  });

  it("does not include forbidden deterministic expressions in direct findings or safety notes", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const text = JSON.stringify({
      directFindings: packet.directFindings,
      safetyNotes: packet.safetyNotes,
    });

    for (const forbidden of [
      "무조건 헤어짐",
      "반드시 결혼",
      "절대 안 맞음",
      "파국",
      "이혼한다",
      "상대가 돌아온다",
      "수익 보장",
      "사업 성공 보장",
      "질병",
      "사고 예언",
      "사망 예언",
    ]) {
      expect(text).not.toContain(forbidden);
    }
  });

  it("does not create branch interactions for branches outside the original charts", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const branches = new Set(
      [
        ...Object.values(packet.participants.a.pillars),
        ...Object.values(packet.participants.b.pillars),
      ].flatMap((pillar) => [...pillar]),
    );

    for (const interaction of packet.sajuCompatibility.branchInteractions) {
      for (const branch of ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]) {
        if (interaction.includes(branch)) {
          expect(branches.has(branch)).toBe(true);
        }
      }
    }
  });
});
