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
    expect(data.personA.manseRyeok).toBe(personAManseRyeok);
    expect(data.personA.mbti).toBe(personAMbti);
    expect(data.personB).toMatchObject({
      label: "B",
      displayName: "정B",
      mbti: null,
    });
    expect(data.personB.manseRyeok).toBe(personBManseRyeok);
  });

  it("preserves relationCategory", () => {
    const data = buildCompatibilityTableData(sampleInput);

    expect(data.relationCategory).toBe("businessPartner");
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
