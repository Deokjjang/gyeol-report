import { describe, expect, it } from "vitest";

import {
  buildMbtiCommonProfileTableData,
  type MbtiCommonProfileSourceInput,
} from "../../../src/lib/report-tables/mbtiProfileTableData";

const sourceInput: MbtiCommonProfileSourceInput = {
  type: "ENTJ",
  titleKo: "대담한 통솔자",
  archetype: "목표를 현실화하는 전략 지휘관",
  oneLine:
    "비효율을 발견하면 구조를 새로 짜고 목표를 현실로 밀어붙이는 사람",
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
  closeKeywords: ["결과 중시", "리더십"],
  farKeywords: ["갈등 회피", "시간 낭비"],
  summary: {
    identity: "ENTJ는 목표, 구조, 효율을 중심으로 움직인다.",
    strength: "강점은 장기 계획, 실행력, 리더십이다.",
    risk: "위험은 관계의 미세한 균형을 무시하는 것이다.",
    growthStrategy: "성장은 추진력에 경청 절차를 붙이는 데 있다.",
  },
  traits: {
    identity: [
      {
        id: "commanding_goal_builder",
        label: "목표 지휘관",
        plainKo: "공통 목표를 세우고 사람을 끌어모아 추진한다.",
        strongLine: "사람과 자원과 시간을 하나의 작전처럼 재배치한다.",
        positiveUse: "조직 운영과 프로젝트 리드에서 방향과 속도를 만든다.",
        risk: "사람을 자원처럼 다루는 인상을 줄 수 있다.",
        productDomains: ["general", "career"],
      },
    ],
    career: [
      {
        id: "performance_leadership",
        label: "성과 리더십",
        plainKo: "성과 기준이 분명한 환경에서 강하다.",
        productDomains: ["career"],
      },
    ],
  },
};

describe("buildMbtiCommonProfileTableData", () => {
  it("builds four preference rows", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);

    expect(data.preferenceRows.map((row) => row.axisKey)).toEqual([
      "energy",
      "perception",
      "judgment",
      "lifestyle",
    ]);
    expect(data.preferenceRows).toHaveLength(4);
  });

  it("marks the selected preference side", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);
    const energy = data.preferenceRows[0];
    const perception = data.preferenceRows[1];

    expect(energy.selectedCode).toBe("E");
    expect(energy.left).toMatchObject({
      code: "E",
      nameKo: "외향",
      nameEn: "Extravert",
      selected: true,
    });
    expect(energy.right).toMatchObject({
      code: "I",
      selected: false,
    });
    expect(perception.selectedCode).toBe("N");
    expect(perception.left.selected).toBe(false);
    expect(perception.right).toMatchObject({
      code: "N",
      nameKo: "직관",
      selected: true,
    });
  });

  it("builds four function stack rows", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);

    expect(data.functionRows.map((row) => row.position)).toEqual([
      "dominant",
      "auxiliary",
      "tertiary",
      "inferior",
    ]);
    expect(data.functionRows.map((row) => row.label)).toEqual([
      "주 기능",
      "부 기능",
      "3차 기능",
      "열등 기능",
    ]);
    expect(data.functionRows).toHaveLength(4);
  });

  it("connects function code display data", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);

    expect(data.functionRows[0]).toMatchObject({
      code: "Te",
      nameKo: "외향 사고",
      attitude: "외향",
      domain: "사고",
    });
    expect(data.functionRows[1]).toMatchObject({
      code: "Ni",
      nameKo: "내향 직관",
      attitude: "내향",
      domain: "직관",
    });
  });

  it("preserves close and far keywords", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);

    expect(data.closeKeywords).toEqual(["결과 중시", "리더십"]);
    expect(data.farKeywords).toEqual(["갈등 회피", "시간 낭비"]);
  });

  it("structures summary and trait notes without generating new sentences", () => {
    const data = buildMbtiCommonProfileTableData(sourceInput);

    expect(data.coreSummary).toEqual([
      {
        key: "identity",
        label: "정체성",
        text: "ENTJ는 목표, 구조, 효율을 중심으로 움직인다.",
      },
      {
        key: "strength",
        label: "강점",
        text: "강점은 장기 계획, 실행력, 리더십이다.",
      },
      {
        key: "risk",
        label: "주의점",
        text: "위험은 관계의 미세한 균형을 무시하는 것이다.",
      },
      {
        key: "growthStrategy",
        label: "성장 전략",
        text: "성장은 추진력에 경청 절차를 붙이는 데 있다.",
      },
    ]);
    expect(data.reportUsageNotes[0]).toEqual({
      categoryKey: "identity",
      id: "commanding_goal_builder",
      label: "목표 지휘관",
      plainKo: "공통 목표를 세우고 사람을 끌어모아 추진한다.",
      strongLine: "사람과 자원과 시간을 하나의 작전처럼 재배치한다.",
      positiveUse: "조직 운영과 프로젝트 리드에서 방향과 속도를 만든다.",
      risk: "사람을 자원처럼 다루는 인상을 줄 수 있다.",
      productDomains: ["general", "career"],
    });
  });

  it("throws when a preference axis is missing", () => {
    expect(() =>
      buildMbtiCommonProfileTableData({
        ...sourceInput,
        preferenceAxes: {
          energy: "E",
          perception: "N",
          judgment: "T",
        },
      }),
    ).toThrow("Missing MBTI preference axis: lifestyle");
  });

  it("throws when a function code is missing or unsupported", () => {
    expect(() =>
      buildMbtiCommonProfileTableData({
        ...sourceInput,
        functionStack: {
          dominant: "Te",
          auxiliary: "Ni",
          tertiary: "Se",
        },
      }),
    ).toThrow("Missing MBTI function code: inferior");

    expect(() =>
      buildMbtiCommonProfileTableData({
        ...sourceInput,
        functionStack: {
          dominant: "Tx",
          auxiliary: "Ni",
          tertiary: "Se",
          inferior: "Fi",
        },
      }),
    ).toThrow("Unsupported MBTI function code: Tx");
  });
});
