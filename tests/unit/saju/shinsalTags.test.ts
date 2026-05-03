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

describe("shinsal tag extraction", () => {
  it("extracts shinsal tags", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const shinsalTags = tags.filter((tag) => tag.category === "SHINSAL");

    expect(shinsalTags.length).toBeGreaterThan(0);
  });

  it("contains expected shinsal tag codes", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const codes = tags.map((tag) => tag.code);

    expect(codes).toContain("SHINSAL_HYEONCHIMSAL");
    expect(codes).toContain("SHINSAL_HONGYEOMSAL");
    expect(codes).toContain("SHINSAL_BAEKHODAESAL");
    expect(codes).toContain("SHINSAL_YEOKMASAL");
    expect(codes).toContain("SHINSAL_DOHWASAL");
    expect(codes).toContain("SHINSAL_CHEON_EUL_GWIIN");
    expect(codes).toContain("SHINSAL_WOL_DEOK_GWIIN");
    expect(codes).toContain("SHINSAL_CHEON_DEOK_GWIIN");
  });

  it("emits Twelve Shinsal tag codes in the Shinsal category", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const twelveShinsalTags = tags.filter((tag) =>
      tag.code.startsWith("SHINSAL_TWELVE_"),
    );

    expect(twelveShinsalTags.length).toBeGreaterThan(0);
    expect(twelveShinsalTags.every((tag) => tag.category === "SHINSAL")).toBe(
      true,
    );
  });

  it("preserves detection labels and descriptions", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const tag = tags.find((item) => item.code === "SHINSAL_HYEONCHIMSAL");

    expect(tag?.labelKo).toBe("현침살");
    expect(tag?.descriptionKo).toBeTruthy();
    expect(tag?.severity).toBeTruthy();
    expect(tag?.confidence).toBeTruthy();
    expect(tag?.evidence.length).toBeGreaterThan(0);
  });

  it("places shinsal tags after advanced pattern tags", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const firstAdvancedIndex = tags.findIndex(
      (tag) => tag.category === "ADVANCED_PATTERN",
    );
    const firstShinsalIndex = tags.findIndex(
      (tag) => tag.category === "SHINSAL",
    );

    expect(firstShinsalIndex).toBeGreaterThanOrEqual(0);
    if (firstAdvancedIndex >= 0) {
      expect(firstShinsalIndex).toBeGreaterThan(firstAdvancedIndex);
    }
  });

  it("places shinsal tags before relation tags", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const firstShinsalIndex = tags.findIndex(
      (tag) => tag.category === "SHINSAL",
    );
    const firstRelationIndex = tags.findIndex(
      (tag) => tag.category === "RELATION",
    );

    expect(firstShinsalIndex).toBeGreaterThanOrEqual(0);
    if (firstRelationIndex >= 0) {
      expect(firstShinsalIndex).toBeLessThan(firstRelationIndex);
    }
  });

  it("preserves shinsal detection order", () => {
    const result = calculateSaju(knownTimeInput);
    const tags = extractSajuTags(result);
    const expectedCodes = result.shinsal.map((item) => `SHINSAL_${item.code}`);
    const actualCodes = tags
      .filter((tag) => tag.category === "SHINSAL")
      .map((tag) => tag.code);

    expect(actualCodes).toEqual(expectedCodes);
  });

  it("does not break legacy-like results without shinsal", () => {
    const result = calculateSaju(knownTimeInput);
    const legacyLikeResult = Object.fromEntries(
      Object.entries(result).filter(([key]) => key !== "shinsal"),
    ) as unknown as Parameters<typeof extractSajuTags>[0];
    const tags = extractSajuTags(legacyLikeResult);

    expect(tags.some((tag) => tag.category === "SHINSAL")).toBe(false);
  });

  it("uses safe shinsal tag text", () => {
    const forbiddenWords = [
      "\uBB34\uC870\uAC74",
      "\uBC18\uB4DC\uC2DC",
      "\uC6B4\uBA85",
      "\uC8FD\uC74C",
      "\uC0AC\uACE0\uAC00 \uB09C\uB2E4",
      "\uBC14\uB78C\uAE30\uAC00 \uC788\uB2E4",
      "\uB3C8\uBCF5\uC774 \uC788\uB2E4",
      "\uACB0\uD63C\uD55C\uB2E4",
      "\uB9DD\uD55C\uB2E4",
      "\uC808\uB300",
      "\uD56D\uC0C1",
    ];
    const result = calculateSaju(knownTimeInput);
    const shinsalTags = extractSajuTags(result).filter(
      (tag) => tag.category === "SHINSAL",
    );

    for (const tag of shinsalTags) {
      for (const word of forbiddenWords) {
        expect(tag.labelKo).not.toContain(word);
        expect(tag.descriptionKo).not.toContain(word);
      }
    }
  });

  it("is deterministic", () => {
    const result = calculateSaju(knownTimeInput);

    expect(extractSajuTags(result)).toEqual(extractSajuTags(result));
  });
});
