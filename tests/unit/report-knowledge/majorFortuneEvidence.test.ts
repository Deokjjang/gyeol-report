import { describe, expect, it } from "vitest";

import { getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import {
  buildMajorFortuneElementEffect,
  buildMajorFortuneEvidence,
  getMajorFortuneBranchInteractions,
} from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import { requireMajorFortuneFixture } from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import { hydrateMajorFortuneCycle } from "../../../src/lib/report-knowledge/majorFortuneRules";

describe("majorFortuneEvidence", () => {
  it("exports Deokmin major fortune fixture with context and cycles", () => {
    const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");

    expect(fixture.person.userContext).toMatchObject({
      lifeStatus: "employee",
      fieldLabel: "개발·서비스 기획",
    });
    expect(fixture.person.majorFortuneCycleBasis).toBe("fixture_precomputed");
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
    expect(evidence.currentCycle.ganji).toBe("甲戌");
    expect(evidence.previousCycle?.ganji).toBe("癸酉");
    expect(evidence.nextCycle?.ganji).toBe("乙亥");
    expect(evidence.dayMaster).toBe("甲");
    expect(evidence.majorTenGod.stemTenGod).toBe("비견");
    expect(evidence.lifeAreaSignals.length).toBeGreaterThan(0);
    expect(evidence.difficultySignals.length).toBeGreaterThan(0);
    expect(evidence.opportunitySignals.length).toBeGreaterThan(0);
    expect(evidence.strongYearsWithinCycle.length).toBeGreaterThan(0);
    expect(evidence.warnings.join("\n")).toContain("fixture_precomputed");
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
