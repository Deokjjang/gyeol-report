import { describe, expect, it } from "vitest";

import { getTenGodForStemPair } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import {
  buildMajorFortuneElementEffect,
  buildMajorFortuneEvidence,
  getMajorFortuneBranchInteractions,
  summarizeMajorFortuneEvidenceMatrixQuality,
} from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import {
  MAJOR_FORTUNE_FIXTURES,
  requireMajorFortuneFixture,
} from "../../../src/lib/report-knowledge/majorFortuneFixtures";
import { hydrateMajorFortuneCycle } from "../../../src/lib/report-knowledge/majorFortuneRules";
import {
  USER_RELATIONSHIP_STATUS_LABELS,
} from "../../../src/lib/report-knowledge/userContextTypes";

describe("majorFortuneEvidence", () => {
  it("supports relationship status labels without interestArea", () => {
    expect(USER_RELATIONSHIP_STATUS_LABELS.single).toBe("솔로");
    expect(USER_RELATIONSHIP_STATUS_LABELS.dating).toBe("연애 중");
    expect(USER_RELATIONSHIP_STATUS_LABELS.married).toBe("기혼");
    expect(USER_RELATIONSHIP_STATUS_LABELS.unknown).toBe("미입력");
    expect(JSON.stringify(USER_RELATIONSHIP_STATUS_LABELS)).not.toContain(
      "interestArea",
    );
    expect(JSON.stringify(USER_RELATIONSHIP_STATUS_LABELS)).not.toContain(
      ["복잡한", "관계"].join(" "),
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
      "생활 반경",
    );
    expect(evidence.relationshipStatusTranslationHints.join("\n")).not.toContain(
      "미입력",
    );
    expect(evidence.lifeStageContext.label).toBe("20대 후반~30대 중반 전환기");
    expect(evidence.lifeStageContext.relevantThemes).toContain(
      "커리어 기준 확립",
    );
    expect(evidence.lifeStageContext.relevantThemes).toContain(
      "이직·직무 전환 검토",
    );
    expect(evidence.lifeStageContext.relevantThemes).toContain(
      "연봉·외부 프로젝트·수익화 접점",
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
    expect(evidence.myeongliLayers.auxiliaryStarsLayer.length).toBeLessThanOrEqual(5);
    expect(
      evidence.myeongliLayers.auxiliaryStarsLayer
        .map((star) => star.plain)
        .join("\n"),
    ).not.toContain("생활 장면으로만 조심스럽게 참고합니다");
    expect(evidence.majorFortuneTimelineRows).toHaveLength(10);
    expect(evidence.majorFortuneTimelineRows[0]).toMatchObject({
      year: 2026,
      isCurrentYear: true,
      isCycleStartYear: true,
      majorGanji: "戊辰",
      annualGanji: "丙午",
      ageBasisLabel: "대운표 기준 나이",
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
      evidence.majorFortuneTimelineRows
        .map((row) => row.oneLine)
        .join("\n"),
    ).not.toContain("대운의 장기 과제 위에");
    expect(
      evidence.majorFortuneTimelineRows
        .map((row) => row.oneLine)
        .join("\n"),
    ).not.toContain("역할, 돈, 관계의 우선순위를 다시 잡아야 하는 해");
    expect(new Set(evidence.majorFortuneTimelineRows.map((row) => row.oneLine)).size).toBeGreaterThanOrEqual(8);
    expect(new Set(evidence.majorFortuneTimelineRows.map((row) => row.strategy)).size).toBeGreaterThanOrEqual(8);
    expect(evidence.majorFortuneTimelineRows.find((row) => row.year === 2028)?.oneLine).toMatch(/편재|외부 프로젝트|계약|수익/u);
    expect(evidence.majorFortuneTimelineRows.find((row) => row.year === 2030)?.oneLine).toMatch(/辰戌 충|구조.*재배치/u);
    expect(
      evidence.strongYearsWithinCycle.every(
        (year) =>
          year.whyStrong.length > 0 &&
          (year.whyStrong.match(/\s\/\s/gu)?.length ?? 0) <= 1 &&
          year.pushStrategy.length > 0 &&
          year.reduceStrategy.length > 0,
      ),
    ).toBe(true);
    expect(new Set(evidence.strongYearsWithinCycle.map((year) => year.headline)).size)
      .toBe(evidence.strongYearsWithinCycle.length);
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2026)?.headline).toBe(
      "새 대운의 기준을 처음 까는 해",
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2027)?.headline).toBe(
      "결과물과 표현 압박이 빨라지는 해",
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2028)?.headline).toBe(
      "돈과 외부 프로젝트 접점이 커지는 해",
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2029)?.headline).toMatch(
      /숫자|정산|고정비|현금흐름/u,
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2030)?.headline).toMatch(
      /구조|부딪/u,
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2029)?.whyStrong).toMatch(
      /정재|숫자|고정비|정산/u,
    );
    expect(evidence.strongYearsWithinCycle.find((year) => year.year === 2030)?.whyStrong).toMatch(
      /辰戌 충|구조|재배치/u,
    );
    expect(
      evidence.strongYearsWithinCycle.find((year) => year.year === 2028)
        ?.likelyArea,
    ).toBe("돈·외부기회");
    expect(
      evidence.strongYearsWithinCycle.find((year) => year.year === 2030)
        ?.likelyArea,
    ).toMatch(/전환|일·성과/u);
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

  it("builds matrix evidence without Deokmin or diagnostic leakage", () => {
    const evidencePackets = MAJOR_FORTUNE_FIXTURES.map((fixture) =>
      buildMajorFortuneEvidence({
        fixtureId: fixture.id,
        currentYear: fixture.currentYear,
        person: fixture.person,
      }),
    );
    const summary = summarizeMajorFortuneEvidenceMatrixQuality(evidencePackets);

    expect(summary.matrixSimilarityWarnings).toBe(0);
    expect(summary.fixtureLeakageWarnings).toBe(0);
    expect(summary.relationshipHintWarnings).toBe(0);
    expect(summary.likelyAreaDiversityWarnings).toBe(0);
    expect(summary.technicalTermLeakageWarnings).toBe(0);
  });

  it("creates relationship-status-specific hints across matrix fixtures", () => {
    const byStatus = new Map(
      MAJOR_FORTUNE_FIXTURES.map((fixture) => {
        const evidence = buildMajorFortuneEvidence({
          fixtureId: fixture.id,
          currentYear: fixture.currentYear,
          person: fixture.person,
        });

        return [
          fixture.person.userContext.relationshipStatus ?? "unknown",
          evidence.relationshipStatusTranslationHints.join("\n"),
        ];
      }),
    );

    expect(byStatus.get("single")).toMatch(/소개|생활 반경|커뮤니티/u);
    expect(byStatus.get("dating")).toMatch(/연락|일정|생활 균형|생활 리듬/u);
    expect(byStatus.get("married")).toMatch(/가족|배우자|분담/u);
    expect(byStatus.get("unknown")).toMatch(/생활 반경|현실 접점/u);
    expect(byStatus.get("unknown")).not.toMatch(/미입력|입력되지/u);
  });

  it("creates ten-god-specific strategic themes across matrix fixtures", () => {
    const strategicTextByFixture = new Map(
      MAJOR_FORTUNE_FIXTURES.map((fixture) => {
        const evidence = buildMajorFortuneEvidence({
          fixtureId: fixture.id,
          currentYear: fixture.currentYear,
          person: fixture.person,
        });

        return [
          fixture.id,
          evidence.strategicThemes
            .map((theme) =>
              [
                theme.label,
                theme.metaphor,
                theme.plain,
                theme.strategy,
                ...theme.concreteImplications,
              ].join(" "),
            )
            .join("\n"),
        ];
      }),
    );

    expect(strategicTextByFixture.get("major-fortune-sample-wealth-single")).toMatch(
      /돈|자원|계약|외부 프로젝트/u,
    );
    expect(strategicTextByFixture.get("major-fortune-sample-officer-dating")).toMatch(
      /책임 검증|평가|규칙|직장 질서/u,
    );
    expect(
      strategicTextByFixture.get("major-fortune-sample-expression-married"),
    ).toMatch(/결과물|표현|포트폴리오|콘텐츠/u);
    expect(
      strategicTextByFixture.get("major-fortune-sample-resource-unknown"),
    ).toMatch(/공부|회복|문서|자격증/u);
    expect(strategicTextByFixture.get("major-fortune-sample-peer-single")).toMatch(
      /경쟁|자기 기준|동료|협업/u,
    );
  });

  it("detects matrix similarity, leakage, relationship hint, and diagnostic issues", () => {
    const fixture = requireMajorFortuneFixture("major-fortune-sample-wealth-single");
    const base = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    });
    const repeated = {
      ...base,
      personLabel: "샘플A",
      majorFortuneTimelineRows: base.majorFortuneTimelineRows.map((row) => ({
        ...row,
        oneLine: "반복되는 같은 타임라인 문장",
      })),
    };
    const leaked = {
      ...base,
      personLabel: "샘플B",
      strategicThemes: base.strategicThemes.map((theme, index) =>
        index === 0 ? { ...theme, plain: "덕민 전용 문장" } : theme,
      ),
    };
    const weakRelationship = {
      ...base,
      personLabel: "샘플C",
      userContext: {
        ...base.userContext,
        relationshipStatus: "single" as const,
      },
      relationshipStatusTranslationHints: ["솔로"],
    };
    const diagnosticLeak = {
      ...base,
      personLabel: "샘플D",
      strategicThemes: base.strategicThemes.map((theme, index) =>
        index === 0 ? { ...theme, plain: "백호대살 노출" } : theme,
      ),
    };
    const summary = summarizeMajorFortuneEvidenceMatrixQuality([
      repeated,
      leaked,
      weakRelationship,
      diagnosticLeak,
    ]);

    expect(summary.matrixSimilarityWarnings).toBeGreaterThan(0);
    expect(summary.fixtureLeakageWarnings).toBeGreaterThan(0);
    expect(summary.relationshipHintWarnings).toBeGreaterThan(0);
    expect(summary.technicalTermLeakageWarnings).toBeGreaterThan(0);
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
