import { describe, expect, it } from "vitest";

import { calculateSaju } from "@/lib/saju/calculateSaju";
import { extractSajuTags } from "@/lib/saju/extractTags";
import type { SajuCalcInput } from "@/lib/saju/types";

const knownTimeInput: SajuCalcInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
};

const unknownTimeInput: SajuCalcInput = {
  birthDate: "2024-02-04",
  birthTimeUnknown: true,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
};

function getTagCodes(input: SajuCalcInput): string[] {
  return extractSajuTags(calculateSaju(input)).map((tag) => tag.code);
}

describe("extractSajuTags", () => {
  it("extracts deterministic tags for known birth time", () => {
    const result = calculateSaju(knownTimeInput);
    const first = extractSajuTags(result);
    const second = extractSajuTags(result);

    expect(second).toEqual(first);
  });

  it("includes day master tag first", () => {
    const tags = extractSajuTags(calculateSaju(knownTimeInput));

    expect(tags[0]?.code).toBe("DAY_MASTER_BYEONG_FIRE");
    expect(tags[0]?.category).toBe("DAY_MASTER");
    expect(tags[0]?.confidence).toBe("HIGH");
    expect(tags[0]?.evidence).toContain("dayMaster:丙");
  });

  it("includes birth time known tag", () => {
    const codes = getTagCodes(knownTimeInput);

    expect(codes).toContain("BIRTH_TIME_KNOWN");
    expect(codes).not.toContain("BIRTH_TIME_UNKNOWN");
    expect(codes).not.toContain("BIRTH_TIME_UNKNOWN_NOTICE");
  });

  it("includes birth time unknown tag and notice", () => {
    const tags = extractSajuTags(calculateSaju(unknownTimeInput));
    const codes = tags.map((tag) => tag.code);
    const tag = tags.find((item) => item.code === "BIRTH_TIME_UNKNOWN");

    expect(codes).toContain("BIRTH_TIME_UNKNOWN");
    expect(codes).toContain("BIRTH_TIME_UNKNOWN_NOTICE");
    expect(codes).not.toContain("BIRTH_TIME_KNOWN");
    expect(tag?.category).toBe("BIRTH_TIME");
    expect(tag?.severity).toBe("MEDIUM");
    expect(tag?.confidence).toBe("HIGH");
    expect(tag?.evidence).toContain("birthTime:unknown");
  });

  it("includes yin yang tag", () => {
    const codes = getTagCodes(knownTimeInput);

    expect(
      codes.some((code) =>
        ["YIN_HEAVY", "YANG_HEAVY", "BALANCED"].includes(code),
      ),
    ).toBe(true);
  });

  it("includes element tags when element labels exist", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const codes = tags.map((tag) => tag.code);

    for (const label of result.elements.labels) {
      expect(codes).toContain(label);
    }
  });

  it("includes Ten God group tags", () => {
    const tags = extractSajuTags(calculateSaju(knownTimeInput));
    const tenGodTags = tags.filter((tag) => tag.code.startsWith("TEN_GOD_"));

    expect(tenGodTags.length).toBeGreaterThan(0);
    for (const tag of tenGodTags) {
      expect(tag.category).toBe("TEN_GOD");
      expect(tag.confidence).toBe("MEDIUM");
      expect(
        tag.evidence.some((value) => value.startsWith("tenGodGroup:")),
      ).toBe(true);
    }
  });

  it("includes exactly one day master strength balance tag", () => {
    const codes = getTagCodes(knownTimeInput);
    const strengthBalanceCodes = [
      "DAY_MASTER_RELATIVELY_STRONG",
      "DAY_MASTER_RELATIVELY_WEAK",
      "DAY_MASTER_BALANCED",
    ];

    expect(
      codes.filter((code) => strengthBalanceCodes.includes(code)),
    ).toHaveLength(1);
  });

  it("includes relation tags if relations exist", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const codes = tags.map((tag) => tag.code);

    if (result.relations.stemCombinations.length > 0) {
      expect(codes).toContain("STEM_COMBINATION_PRESENT");
    }
    if (result.relations.branchCombinations.length > 0) {
      expect(codes).toContain("BRANCH_COMBINATION_PRESENT");
    }
    if (result.relations.branchClashes.length > 0) {
      expect(codes).toContain("BRANCH_CLASH_PRESENT");
    }
  });

  it("keeps tag order stable by category blocks", () => {
    const knownTags = extractSajuTags(calculateSaju(knownTimeInput));
    const knownCategories = knownTags.map((tag) => tag.category);
    const unknownTags = extractSajuTags(calculateSaju(unknownTimeInput));
    const unknownCategories = unknownTags.map((tag) => tag.category);

    expect(knownCategories.indexOf("DAY_MASTER")).toBe(0);
    expect(knownCategories.indexOf("BIRTH_TIME")).toBeGreaterThan(
      knownCategories.indexOf("DAY_MASTER"),
    );
    expect(unknownCategories.indexOf("NOTICE")).toBeGreaterThan(
      unknownCategories.indexOf("BIRTH_TIME"),
    );
  });

  it("returns required metadata for all tags", () => {
    const allTags = [
      ...extractSajuTags(calculateSaju(knownTimeInput)),
      ...extractSajuTags(calculateSaju(unknownTimeInput)),
    ];

    for (const tag of allTags) {
      expect(tag.code).toBeTruthy();
      expect(tag.category).toBeTruthy();
      expect(tag.severity).toBeTruthy();
      expect(tag.confidence).toBeTruthy();
      expect(tag.labelKo).toBeTruthy();
      expect(tag.descriptionKo).toBeTruthy();
      expect(Array.isArray(tag.evidence)).toBe(true);
      expect(tag.evidence.length).toBeGreaterThan(0);
    }
  });

  it("does not include forbidden deterministic or fear wording", () => {
    const forbiddenWords = [
      "무조건",
      "반드시",
      "운명",
      "죽음",
      "사고가 난다",
      "바람기가 있다",
      "돈복이 있다",
      "결혼한다",
      "망한다",
    ];
    const allTags = [
      ...extractSajuTags(calculateSaju(knownTimeInput)),
      ...extractSajuTags(calculateSaju(unknownTimeInput)),
    ];

    for (const tag of allTags) {
      for (const word of forbiddenWords) {
        expect(tag.descriptionKo).not.toContain(word);
      }
    }
  });
});
