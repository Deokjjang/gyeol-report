import { describe, expect, it } from "vitest";

import { getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import {
  buildMajorFortuneElementEffect,
  buildMajorFortuneEvidence,
  getMajorFortuneBranchInteractions,
} from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import { requireMajorFortuneFixture } from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import { hydrateMajorFortuneCycle } from "../../../src/lib/report-knowledge/majorFortuneRules";
import {
  USER_RELATIONSHIP_STATUS_LABELS,
} from "../../../src/lib/report-knowledge/userContextTypes";

describe("majorFortuneEvidence", () => {
  it("supports relationship status labels without interestArea", () => {
    expect(USER_RELATIONSHIP_STATUS_LABELS.single).toBe("솔로");
    expect(USER_RELATIONSHIP_STATUS_LABELS.dating).toBe("연애 중");
    expect(USER_RELATIONSHIP_STATUS_LABELS.married).toBe("기혼");
    expect(USER_RELATIONSHIP_STATUS_LABELS.complicated).toBe("복잡한 관계");
    expect(USER_RELATIONSHIP_STATUS_LABELS.unknown).toBe("미입력");
    expect(JSON.stringify(USER_RELATIONSHIP_STATUS_LABELS)).not.toContain(
      "interestArea",
    );
  });

  it("exports Deokmin major fortune fixture with context and cycles", () => {
    const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");

    expect(fixture.person.userContext).toMatchObject({
      lifeStatus: "employee",
      fieldLabel: "개발·서비스 기획",
      relationshipStatus: "unknown",
    });
    expect(fixture.person.majorFortuneCycleBasis).toBe(
      "user_supplied_major_fortune_table",
    );
    expect(fixture.person.majorFortuneCycles.length).toBeGreaterThan(0);
  });

  it("computes major ten-god through annual stem-pair rule", () => {
    expect(getTenGodForStemPair("甲", "丙")).toBe("식신");
    expect(getTenGodForStemPair("甲", "辛")).toBe("정관");
    expect(getTenGodForStemPair("甲", "戊")).toBe("편재");
  });

  it("builds current major fortune evidence packet", () => {
    const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");
    const evidence = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    });

    expect(evidence.productType).toBe("major_fortune");
    expect(evidence.productVersion).toBe("v1");
    expect(evidence.currentCycle.ganji).toBe("戊辰");
    expect(evidence.currentCycle.startYear).toBe(2026);
    expect(evidence.currentCycle.endYear).toBe(2035);
    expect(evidence.previousCycle?.ganji).toBe("丁卯");
    expect(evidence.nextCycle?.ganji).toBe("己巳");
    expect(evidence.dayMaster).toBe("甲");
    expect(evidence.majorTenGod.stemTenGod).toBe("편재");
    expect(evidence.majorCycleBasis.basisType).toBe(
      "user_supplied_major_fortune_table",
    );
    expect(evidence.cyclePosition.positionLabel).toBe("2026년 기준 1년차");
    expect(evidence.previousToCurrentShift.currentGanji).toBe("戊辰");
    expect(evidence.decadeArchetype.label).toBe("현실 구조 재편형");
    expect(evidence.strategicThemes.length).toBeGreaterThan(0);
    expect(evidence.longRangeRisks.length).toBeGreaterThan(0);
    expect(evidence.longRangeOpportunities.length).toBeGreaterThan(0);
    expect(evidence.relationshipStatusTranslationHints.join("\n")).toContain(
      "미입력",
    );
    expect(evidence.calculationBasis.displayLabel).toBe(
      "입력된 대운표 기준",
    );
    expect(evidence.calculationBasis.note).toContain("2026년");
    expect(evidence.cycleYearTimeline).toHaveLength(10);
    expect(evidence.cycleYearTimeline[0]?.year).toBe(
      evidence.currentCycle.startYear,
    );
    expect(evidence.cycleYearTimeline[9]?.year).toBe(
      evidence.currentCycle.endYear,
    );
    expect(evidence.cycleYearTimeline[0]?.yearIndexInCycle).toBe(1);
    expect(evidence.cycleYearTimeline[9]?.yearIndexInCycle).toBe(10);
    expect(evidence.lifeAreaSignals.length).toBeGreaterThan(0);
    expect(evidence.difficultySignals.length).toBeGreaterThan(0);
    expect(evidence.opportunitySignals.length).toBeGreaterThan(0);
    expect(evidence.strongYearsWithinCycle.length).toBeGreaterThan(0);
    expect(evidence.myeongliLayers.tenGodLayer.majorStemTenGod).toBe("편재");
    expect(evidence.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle).toHaveLength(10);
    expect(evidence.myeongliLayers.branchInteractionLayer.interactions.length).toBeGreaterThan(0);
    expect(evidence.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems.length).toBeGreaterThan(0);
    expect(
      evidence.myeongliLayers.auxiliaryStarsLayer.some((star) =>
        star.label.includes("백호대살"),
      ),
    ).toBe(false);
    expect(evidence.majorFortuneTimelineRows).toHaveLength(10);
    expect(evidence.majorFortuneTimelineRows[0]).toMatchObject({
      year: 2026,
      isCurrentYear: true,
      isCycleStartYear: true,
      majorGanji: "戊辰",
      annualGanji: "丙午",
    });
    expect(evidence.majorFortuneTimelineRows[0]?.badges).toContain("올해");
    expect(evidence.majorFortuneTimelineRows[0]?.badges).toContain("전환");
    expect(
      evidence.majorFortuneTimelineRows.every(
        (row) =>
          row.oneLine.length > 0 &&
          row.strategy.length > 0 &&
          row.annualTenGodLabel.length > 0,
      ),
    ).toBe(true);
    expect(
      evidence.majorFortuneTimelineRows
        .map((row) => row.oneLine)
        .join("\n"),
    ).not.toContain("대운 지지 또는 원국 지지와 강한 작용");
    expect(
      evidence.strongYearsWithinCycle.every(
        (year) =>
          year.whyStrong.length > 0 &&
          year.pushStrategy.length > 0 &&
          year.reduceStrategy.length > 0,
      ),
    ).toBe(true);
    expect(evidence.warnings.join("\n")).not.toContain("fixture_precomputed");
  });

  it("creates different relationship hints by relationship status", () => {
    const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");
    const singleEvidence = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: {
        ...fixture.person,
        userContext: {
          ...fixture.person.userContext,
          relationshipStatus: "single",
        },
      },
    });
    const marriedEvidence = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: {
        ...fixture.person,
        userContext: {
          ...fixture.person.userContext,
          relationshipStatus: "married",
        },
      },
    });

    expect(singleEvidence.relationshipStatusTranslationHints.join("\n")).toContain(
      "솔로",
    );
    expect(marriedEvidence.relationshipStatusTranslationHints.join("\n")).toContain(
      "기혼",
    );
  });

  it("computes element fill and overload effects", () => {
    const fireCycle = hydrateMajorFortuneCycle({
      index: 1,
      startAge: 1,
      endAge: 10,
      startYear: 2020,
      endYear: 2029,
      ganji: "丙午",
    });
    const earthCycle = hydrateMajorFortuneCycle({
      index: 2,
      startAge: 11,
      endAge: 20,
      startYear: 2030,
      endYear: 2039,
      ganji: "戊辰",
    });
    const waterCycle = hydrateMajorFortuneCycle({
      index: 3,
      startAge: 21,
      endAge: 30,
      startYear: 2040,
      endYear: 2049,
      ganji: "壬子",
    });
    const labels = ["토 과다", "화 부족", "수 부족"];

    expect(
      buildMajorFortuneElementEffect({
        currentCycle: fireCycle,
        natalLabels: labels,
        dayMaster: "甲",
      }).fillsMissing,
    ).toContain("fire");
    expect(
      buildMajorFortuneElementEffect({
        currentCycle: fireCycle,
        natalLabels: labels,
        dayMaster: "甲",
      }).overloadsHeavy,
    ).toContain("earth");
    expect(
      buildMajorFortuneElementEffect({
        currentCycle: earthCycle,
        natalLabels: labels,
        dayMaster: "甲",
      }).overloadsHeavy,
    ).toContain("earth");
    expect(
      buildMajorFortuneElementEffect({
        currentCycle: waterCycle,
        natalLabels: labels,
        dayMaster: "甲",
      }).fillsMissing,
    ).toContain("water");
  });

  it("detects major branch interactions with affected pillars", () => {
    const interactions = getMajorFortuneBranchInteractions({
      majorBranch: "戌",
      natalBranches: ["卯", "未", "申", "辰"],
    });

    expect(interactions.some((interaction) => interaction.type === "육합")).toBe(
      true,
    );
    expect(interactions.some((interaction) => interaction.type === "충")).toBe(
      true,
    );
    expect(
      interactions.some((interaction) =>
        interaction.affectedPillars?.includes("year"),
      ),
    ).toBe(true);
  });
});
