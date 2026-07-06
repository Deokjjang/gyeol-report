import { describe, expect, it } from "vitest";

import {
  buildDaeunFortuneTableData,
  buildMajorFortuneReportManseRyeokTableData,
  buildMajorFortuneReportMbtiProfileTableData,
  type BuildDaeunFortuneTableDataInput,
} from "../../../src/lib/report-tables/daeunTableData";
import { buildMajorFortuneEvidence } from "../../../src/lib/report-knowledge/majorFortuneEvidence";
import { requireMajorFortuneFixture } from "../../../src/lib/report-knowledge/majorFortuneFixtures";

const sampleInput: BuildDaeunFortuneTableDataInput = {
  displayName: "정덕민",
  currentYear: 2026,
  selectedYear: 2026,
  currentAge: 27,
  currentDaeunCycle: {
    ganji: "戊辰",
    startYear: 2026,
    endYear: 2035,
    startAge: 27,
    endAge: 36,
    stemTenGod: "편재",
    branchTenGod: "편재",
    hiddenStems: ["乙", "癸", "戊"],
    twelveLifeStage: ["쇠"],
    twelveSinsal: ["반안살"],
    sinsal: ["귀문관살"],
    gwiin: ["천을귀인"],
    interactions: ["진술충"],
  },
  timelineYears: [
    {
      year: 2027,
      ageLabel: "28세",
      majorGanji: "戊辰",
      annualGanji: "丁未",
      annualTenGodLabel: "상관",
      keyInteractionLabel: "반합",
      oneLine: "역할이 구체화되는 해",
      strategy: "책임 범위를 먼저 정리한다.",
      yearDetail: {
        coreFlow: "2027년 丁未 연운은 상관 흐름으로 표현과 결과물을 자극하고, 대운의 장기 배경 안에서 초반 기준을 시험하는 해입니다.",
        realWorldScenes: "직업에서는 보고와 결과물 기준을 맞추고, 돈은 반복 지출을 확인하며, 관계에서는 말의 온도를 조절합니다. ENTJ는 기준을 먼저 세우려 하지만 회복 시간을 같이 잡아야 합니다.",
        cautionPoint: "주의할 패턴은 말과 일정이 앞서는 것입니다.",
        actionStandard: "실행 기준은 기록과 회고를 남기는 것입니다.",
      },
    },
    {
      year: 2026,
      ageLabel: "27세",
      isCycleStartYear: true,
      badges: ["강함"],
      majorGanji: "戊辰",
      annualGanji: "丙午",
      annualTenGodLabel: "식신",
      keyInteractionLabel: "충",
      oneLine: "대운이 시작되는 해",
      strategy: "속도를 내기 전에 기준을 고정한다.",
      yearDetail: {
        coreFlow: "2026년 丙午 연운은 식신 흐름으로 결과물을 압박합니다. 辰申 반합 수 흐름은 생각과 회복, 정보 흐름이 부분적으로 살아나는 장면입니다.",
        realWorldScenes: "직업에서는 책임 범위를 먼저 좁히고, 돈은 계약과 정산 기준을 숫자로 확인합니다. 관계와 생활 리듬에서는 거리 기준과 회복 시간이 중요하며, ENTJ는 빠른 결정과 실행 압력으로 드러나기 쉽습니다.",
        cautionPoint: "주의할 패턴은 권한 없는 책임을 떠안는 것입니다.",
        actionStandard: "실행 기준은 역할, 돈, 회복 루틴을 하나씩 고정하는 것입니다.",
      },
    },
  ],
  annualFortunes: [
    {
      year: 2026,
      ganji: "丙午",
      stemTenGod: "식신",
      branchTenGod: "상관",
      hiddenStems: ["丁", "己"],
      twelveLifeStage: ["사"],
      twelveSinsal: ["육해살"],
      sinsal: ["도화살"],
      gwiin: ["문창귀인"],
      interactions: ["오진 관계 없음"],
    },
    {
      year: 2027,
      ganji: "丁未",
      stemTenGod: "상관",
      branchTenGod: "정재",
    },
  ],
};

describe("buildDaeunFortuneTableData", () => {
  it("builds timeline rows in ascending year order", () => {
    const data = buildDaeunFortuneTableData(sampleInput);

    expect(data.title).toBe("정덕민님의 대운표");
    expect(data.timelineRows.map((row) => row.year)).toEqual([2026, 2027]);
    expect(data.timelineRows.map((row) => row.age)).toEqual([27, 28]);
  });

  it("adds current year and transition badges", () => {
    const data = buildDaeunFortuneTableData(sampleInput);
    const currentYearRow = data.timelineRows[0];

    expect(currentYearRow.isCurrentYear).toBe(true);
    expect(currentYearRow.isTransitionYear).toBe(true);
    expect(currentYearRow.badges).toEqual(["강함", "올해", "전환"]);
  });

  it("fills daeun and annual stem branch display data", () => {
    const data = buildDaeunFortuneTableData(sampleInput);

    expect(data.currentDaeun).toMatchObject({
      ganji: "戊辰",
      startYear: 2026,
      endYear: 2035,
      startAge: 27,
      endAge: 36,
    });
    expect(data.currentDaeun.stem).toMatchObject({
      hanja: "戊",
      ko: "무",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    });
    expect(data.currentDaeun.branch).toMatchObject({
      hanja: "辰",
      ko: "진",
      tenGod: "편재",
      element: "earth",
      yinYang: "yang",
      colorToken: "earth-soil",
    });
    expect(data.annualCompareTable.annualStem).toMatchObject({
      hanja: "丙",
      ko: "병",
      tenGod: "식신",
      element: "fire",
      colorToken: "fire-red",
    });
    expect(data.annualCompareTable.annualBranch).toMatchObject({
      hanja: "午",
      ko: "오",
      tenGod: "상관",
      element: "fire",
      colorToken: "fire-red",
    });
  });

  it("builds common manse ryeok and MBTI compact data from major fortune evidence", () => {
    const fixture = requireMajorFortuneFixture("deokmin-current-major-fortune");
    const evidence = buildMajorFortuneEvidence({
      fixtureId: fixture.id,
      currentYear: fixture.currentYear,
      person: fixture.person,
    });
    const manseRyeok = buildMajorFortuneReportManseRyeokTableData(evidence);
    const mbti = buildMajorFortuneReportMbtiProfileTableData(evidence);

    expect(manseRyeok.title).toBe("덕민님의 만세력");
    expect(manseRyeok.stemRow.year?.hanja).toBe("己");
    expect(manseRyeok.branchRow.hour?.hanja).toBe("辰");
    expect(
      manseRyeok.detailRows.find((row) => row.key === "hiddenStems")?.cells.hour,
    ).toEqual(["戊", "乙", "癸"]);
    expect(mbti?.type).toBe("ENTJ");
    expect(mbti?.reportUsageNotes.map((note) => note.label)).toContain(
      "10년 흐름",
    );
  });

  it("adds element color tokens to timeline daeun and annual pillars", () => {
    const data = buildDaeunFortuneTableData(sampleInput);
    const currentYearRow = data.timelineRows[0];

    expect(currentYearRow.daeunPillar.stem?.colorToken).toBe("earth-soil");
    expect(currentYearRow.daeunPillar.branch?.colorToken).toBe("earth-soil");
    expect(currentYearRow.annualPillar.stem?.colorToken).toBe("fire-red");
    expect(currentYearRow.annualPillar.branch?.colorToken).toBe("fire-red");
  });

  it("preserves yearly detail data for the timeline accordion", () => {
    const data = buildDaeunFortuneTableData(sampleInput);
    const currentYearRow = data.timelineRows[0];

    expect(currentYearRow.yearDetail).toMatchObject({
      coreFlow:
        "2026년 丙午 연운은 식신 흐름으로 결과물을 압박합니다. 辰申 반합 수 흐름은 생각과 회복, 정보 흐름이 부분적으로 살아나는 장면입니다.",
      realWorldScenes:
        "직업에서는 책임 범위를 먼저 좁히고, 돈은 계약과 정산 기준을 숫자로 확인합니다. 관계와 생활 리듬에서는 거리 기준과 회복 시간이 중요하며, ENTJ는 빠른 결정과 실행 압력으로 드러나기 쉽습니다.",
      cautionPoint: "주의할 패턴은 권한 없는 책임을 떠안는 것입니다.",
      actionStandard: "실행 기준은 역할, 돈, 회복 루틴을 하나씩 고정하는 것입니다.",
    });
  });

  it("builds daeun and annual comparison detail rows from input lists", () => {
    const data = buildDaeunFortuneTableData(sampleInput);

    expect(data.annualCompareTable.hiddenStems).toEqual({
      daeun: ["乙", "癸", "戊"],
      annual: ["丁", "己"],
    });
    expect(data.annualCompareTable.twelveLifeStage).toEqual({
      daeun: ["쇠"],
      annual: ["사"],
    });
    expect(data.annualCompareTable.twelveSinsal).toEqual({
      daeun: ["반안살"],
      annual: ["육해살"],
    });
    expect(data.annualCompareTable.sinsalAndGwiin).toEqual({
      daeun: ["귀문관살", "천을귀인"],
      annual: ["도화살", "문창귀인"],
    });
    expect(data.annualCompareTable.interactions).toEqual({
      daeun: ["진술충"],
      annual: ["오진 관계 없음"],
    });
  });

  it("fills hidden stems from branch lookup and keeps unavailable rows empty", () => {
    const data = buildDaeunFortuneTableData({
      currentYear: 2026,
      selectedYear: 2026,
      currentAge: 28,
      currentDaeunCycle: {
        ganji: "戊辰",
      },
      timelineYears: [
        {
          year: 2026,
          majorGanji: "戊辰",
          annualGanji: "丙午",
        },
      ],
      annualFortunes: [
        {
          year: 2026,
          ganji: "丙午",
        },
      ],
    });

    expect(data.annualCompareTable.hiddenStems).toEqual({
      daeun: ["戊", "乙", "癸"],
      annual: ["丁", "己"],
    });
    expect(data.annualCompareTable.twelveLifeStage).toEqual({
      daeun: [],
      annual: [],
    });
    expect(data.annualCompareTable.sinsalAndGwiin).toEqual({
      daeun: [],
      annual: [],
    });
  });

  it("throws for unsupported heavenly stems and earthly branches", () => {
    expect(() =>
      buildDaeunFortuneTableData({
        ...sampleInput,
        currentDaeunCycle: {
          ganji: "A辰",
        },
      }),
    ).toThrow("Unsupported heavenly stem: A");

    expect(() =>
      buildDaeunFortuneTableData({
        ...sampleInput,
        annualFortunes: [
          {
            year: 2026,
            ganji: "丙X",
          },
        ],
      }),
    ).toThrow("Unsupported earthly branch: X");
  });
});
