import { describe, expect, it } from "vitest";

import {
  buildCompatibilityTableData,
  type BuildCompatibilityTableDataInput,
} from "../../../src/lib/report-tables/compatibilityTableData";
import { buildManseRyeokCommonTableData } from "../../../src/lib/report-tables/manseRyeokTableData";
import { buildMbtiCommonProfileTableData } from "../../../src/lib/report-tables/mbtiProfileTableData";

const personAManseRyeok = buildManseRyeokCommonTableData({
  displayName: "A",
  fourPillarGrid: [
    {
      columnId: "day",
      heavenlyStem: "甲",
      earthlyBranch: "子",
    },
  ],
});

const personBManseRyeok = buildManseRyeokCommonTableData({
  displayName: "B",
  fourPillarGrid: [
    {
      columnId: "day",
      heavenlyStem: "辛",
      earthlyBranch: "酉",
    },
  ],
});

const personAMbti = buildMbtiCommonProfileTableData({
  type: "ENTJ",
  titleKo: "대담한 통솔자",
  archetype: "목표를 현실화하는 전략 지휘관",
  oneLine: "목표를 구조화해 실행하는 사람",
  summary: {
    identity: "목표와 기준을 먼저 잡는다.",
    strength: "역할과 방향을 빠르게 정리한다.",
    risk: "감정 온도를 생략하기 쉽다.",
    growthStrategy: "속도와 확인 시간을 분리한다.",
  },
  preferenceAxes: {
    energy: "E",
    perception: "N",
    judgment: "T",
    lifestyle: "J",
  },
  functionStack: {
    dominant: "Te",
    auxiliary: "Ni",
    tertiary: "Se",
    inferior: "Fi",
  },
  closeKeywords: ["기준", "추진", "전략", "결정", "구조", "책임", "속도"],
  farKeywords: ["회피", "모호함", "무계획", "감정 과잉", "침묵", "지연", "방치"],
  traits: {
    relationships: [
      {
        label: "관계 기준",
        plainKo: "관계에서도 기준과 책임을 먼저 확인한다.",
        productDomains: ["compatibility"],
      },
    ],
    career: [
      {
        label: "직업 문장",
        plainKo: "careerReportUseCases raw marker",
        productDomains: ["career"],
      },
    ],
  },
});

const sampleInput: BuildCompatibilityTableDataInput = {
  title: "A와 B의 궁합표",
  relationCategory: "businessPartner",
  personA: {
    label: "A",
    displayName: "정A",
    manseRyeok: personAManseRyeok,
    mbti: personAMbti,
  },
  personB: {
    label: "B",
    displayName: "정B",
    manseRyeok: personBManseRyeok,
  },
  connectionSummary: {
    compatibilityHeadline: "속도와 구조가 만나는 관계",
    overallTone: "강한 실행형 조합",
    myeongliConnectionSummary: "일간 기준으로 역할이 선명하다.",
    mbtiConnectionSummary: "목표 설정과 실행 기준이 빠르게 맞는다.",
    dayMasterRelation: "갑목과 신금",
    dayBranchRelation: "자유 관계",
    elementBalance: "목과 금의 긴장",
    tenGodRelation: "관성 중심",
    interactionLabels: ["합", "충"],
    sharedStrengths: ["실행력", "판단 속도"],
    frictionPoints: ["통제감", "감정 생략"],
    repairStrategy: "역할과 결정권을 먼저 분리한다.",
    timingNotes: ["계약 전 조건 정리", "분기별 재합의"],
  },
};

describe("buildCompatibilityTableData", () => {
  it("preserves A and B person table data", () => {
    const data = buildCompatibilityTableData(sampleInput);

    expect(data.title).toBe("A와 B의 궁합표");
    expect(data.personA).toMatchObject({
      label: "A",
      displayName: "정A",
    });
    expect(data.personA.manseRyeok).toStrictEqual(personAManseRyeok);
    expect(data.personA.mbti).toMatchObject({
      type: "ENTJ",
      titleKo: "대담한 통솔자",
    });
    expect(data.personB).toMatchObject({
      label: "B",
      displayName: "정B",
      mbti: null,
    });
    expect(data.personB.manseRyeok).toStrictEqual(personBManseRyeok);
  });

  it("preserves relationCategory", () => {
    const data = buildCompatibilityTableData(sampleInput);

    expect(data.relationCategory).toBe("businessPartner");
  });

  it("uses full pillar input before fallback manseRyeok table data", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      personA: {
        ...sampleInput.personA,
        manseRyeok: personAManseRyeok,
        manseRyeokInput: {
          title: "A 기초 만세력",
          fourPillarGrid: [
            {
              columnId: "hour",
              pillar: "戊辰",
              tenGod: ["천간 편재", "지지 정재"],
              hiddenStems: ["乙", "癸", "戊"],
              twelveLifeStage: ["관대"],
              twelveSinsal: ["반안"],
              sinsal: ["화개"],
              gwiin: ["천을귀인"],
              interactions: ["辰酉 합", "申亥 해", "궁합 교차 압박"],
            },
            {
              columnId: "day",
              pillar: "甲酉",
              tenGod: ["천간 비견", "지지 정관"],
              interactions: ["辰酉 합"],
            },
          ],
        },
      },
    });

    expect(data.personA.manseRyeok.title).toBe("A 기초 만세력");
    expect(data.personA.manseRyeok.stemRow.hour?.hanja).toBe("戊");
    expect(data.personA.manseRyeok.branchRow.hour?.hanja).toBe("辰");
    expect(data.personA.manseRyeok.branchRow.day?.hanja).toBe("酉");
    expect(
      data.personA.manseRyeok.detailRows.find((row) => row.key === "hiddenStems")
        ?.cells.hour,
    ).toEqual(["乙", "癸", "戊"]);
  });

  it("removes compatibility-specific and out-of-chart relation values from personal manseRyeok tables", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      personA: {
        ...sampleInput.personA,
        manseRyeokInput: {
          title: "A 기초 만세력",
          fourPillarGrid: [
            {
              columnId: "hour",
              pillar: "戊辰",
              interactions: ["辰酉 합", "申亥 해", "궁합 교차 압박"],
            },
            {
              columnId: "day",
              pillar: "甲酉",
              interactions: ["辰酉 합"],
            },
          ],
        },
      },
    });
    const interactionRow = data.personA.manseRyeok.detailRows.find(
      (row) => row.key === "interactions",
    );

    expect(interactionRow?.cells.hour).toEqual(["辰酉 합"]);
    expect(interactionRow?.cells.day).toEqual(["辰酉 합"]);
  });

  it("normalizes legacy relationCategory values", () => {
    expect(
      buildCompatibilityTableData({
        ...sampleInput,
        relationCategory: "family",
      }).relationCategory,
    ).toBe("parentChild");
    expect(
      buildCompatibilityTableData({
        ...sampleInput,
        relationCategory: "business_work_partner",
      }).relationCategory,
    ).toBe("businessPartner");
    expect(
      buildCompatibilityTableData({
        ...sampleInput,
        relationCategory: "boss_subordinate",
      }).relationCategory,
    ).toBe("managerReport");
  });

  it("builds connectionSummary", () => {
    const data = buildCompatibilityTableData(sampleInput);

    expect(data.connectionSummary).toEqual({
      compatibilityHeadline: "속도와 구조가 만나는 관계",
      overallTone: "강한 실행형 조합",
      myeongliConnectionSummary: "일간 기준으로 역할이 선명하다.",
      mbtiConnectionSummary: "목표 설정과 실행 기준이 빠르게 맞는다.",
      dayMasterRelation: "갑목과 신금",
      dayBranchRelation: "자유 관계",
      elementBalance: "목과 금의 긴장",
      tenGodRelation: "관성 중심",
      interactionLabels: ["합", "충"],
      sharedStrengths: ["실행력", "판단 속도"],
      frictionPoints: ["통제감", "감정 생략"],
      repairStrategy: "역할과 결정권을 먼저 분리한다.",
      timingNotes: ["계약 전 조건 정리", "분기별 재합의"],
    });
  });

  it("keeps compatibility MBTI table data compact and relationship-focused", () => {
    const data = buildCompatibilityTableData(sampleInput);

    expect(data.personA.mbti?.coreSummary).toHaveLength(3);
    expect(data.personA.mbti?.closeKeywords).toHaveLength(6);
    expect(data.personA.mbti?.farKeywords).toHaveLength(6);
    expect(data.personA.mbti?.reportUsageNotes).toHaveLength(1);
    expect(data.personA.mbti?.reportUsageNotes[0]?.plainKo).toContain("관계");
    expect(JSON.stringify(data.personA.mbti)).not.toContain("careerReportUseCases");
  });

  it("removes raw or internal markers from connection summary", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      connectionSummary: {
        compatibilityHeadline: "profile tables",
        overallTone: "사용자 문장",
        sharedStrengths: ["관계 기준", "operator_planner"],
        frictionPoints: ["raw"],
      },
    });

    expect(data.connectionSummary.compatibilityHeadline).toBeNull();
    expect(data.connectionSummary.overallTone).toBe("사용자 문장");
    expect(data.connectionSummary.sharedStrengths).toEqual(["관계 기준"]);
    expect(data.connectionSummary.frictionPoints).toEqual([]);
  });

  it("normalizes missing list values to empty arrays", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      connectionSummary: {},
    });

    expect(data.connectionSummary.interactionLabels).toEqual([]);
    expect(data.connectionSummary.sharedStrengths).toEqual([]);
    expect(data.connectionSummary.frictionPoints).toEqual([]);
    expect(data.connectionSummary.timingNotes).toEqual([]);
  });

  it("normalizes missing single values to null", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      connectionSummary: {},
    });

    expect(data.connectionSummary.compatibilityHeadline).toBeNull();
    expect(data.connectionSummary.overallTone).toBeNull();
    expect(data.connectionSummary.myeongliConnectionSummary).toBeNull();
    expect(data.connectionSummary.mbtiConnectionSummary).toBeNull();
    expect(data.connectionSummary.dayMasterRelation).toBeNull();
    expect(data.connectionSummary.dayBranchRelation).toBeNull();
    expect(data.connectionSummary.elementBalance).toBeNull();
    expect(data.connectionSummary.tenGodRelation).toBeNull();
    expect(data.connectionSummary.repairStrategy).toBeNull();
  });

  it("falls back unsupported external relationCategory to love", () => {
    const data = buildCompatibilityTableData({
      ...sampleInput,
      relationCategory: "enemy",
    });

    expect(data.relationCategory).toBe("love");
  });
});
