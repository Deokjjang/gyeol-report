import { describe, expect, it } from "vitest";

import {
  buildMbtiCommonProfileTableData,
  getMbtiSourceByType,
  hasMbtiSourceType,
  MBTI_SOURCE_TYPES,
} from "../../../src/lib/report-tables";

const expectedSourceTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

describe("MBTI source registry", () => {
  it("exposes all 16 MBTI source types", () => {
    expect(MBTI_SOURCE_TYPES).toEqual(expectedSourceTypes);
    expect(new Set(MBTI_SOURCE_TYPES).size).toBe(16);

    for (const type of expectedSourceTypes) {
      expect(getMbtiSourceByType(type)?.type).toBe(type);
    }
  });

  it("normalizes lowercase type input", () => {
    expect(getMbtiSourceByType("entj")?.type).toBe("ENTJ");
    expect(getMbtiSourceByType(" infp ")?.type).toBe("INFP");
  });

  it("returns null for unknown or missing type input", () => {
    expect(getMbtiSourceByType("ABCD")).toBeNull();
    expect(getMbtiSourceByType("")).toBeNull();
    expect(getMbtiSourceByType(null)).toBeNull();
    expect(getMbtiSourceByType(undefined)).toBeNull();
  });

  it("checks source type availability", () => {
    expect(hasMbtiSourceType("ENTJ")).toBe(true);
    expect(hasMbtiSourceType("entj")).toBe(true);
    expect(hasMbtiSourceType("ABCD")).toBe(false);
    expect(hasMbtiSourceType(null)).toBe(false);
  });

  it("returns source objects that can be passed to the table data builder", () => {
    const source = getMbtiSourceByType("ENTJ");

    expect(source).not.toBeNull();
    expect(source).toMatchObject({
      type: "ENTJ",
      titleKo: "대담한 통솔자",
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
    expect(source?.reportUseCases).toBeTypeOf("object");

    const tableData = buildMbtiCommonProfileTableData(source!);

    expect(tableData.type).toBe("ENTJ");
    expect(tableData.preferenceRows).toHaveLength(4);
    expect(tableData.functionRows).toHaveLength(4);
  });
});
