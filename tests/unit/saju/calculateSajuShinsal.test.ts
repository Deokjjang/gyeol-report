import { describe, expect, it } from "vitest";
import { calculateSaju } from "@/lib/saju/calculateSaju";
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

describe("calculateSaju shinsal integration", () => {
  it("includes shinsal array for known-time calculation", () => {
    const result = calculateSaju(knownTimeInput);

    expect(Array.isArray(result.shinsal)).toBe(true);
    expect(result.shinsal.length).toBeGreaterThan(0);
  });

  it("uses existing known-time pillars for shinsal detections", () => {
    const result = calculateSaju(knownTimeInput);
    const codes = result.shinsal.map((item) => item.code);

    expect(codes).toContain("HYEONCHIMSAL");
    expect(codes).toContain("HONGYEOMSAL");
    expect(codes).toContain("BAEKHODAESAL");
    expect(codes).toContain("YEOKMASAL");
    expect(codes).toContain("DOHWASAL");
    expect(codes).toContain("CHEON_EUL_GWIIN");
    expect(codes).toContain("WOL_DEOK_GWIIN");
    expect(codes).toContain("CHEON_DEOK_GWIIN");
  });

  it("includes Twelve Shinsal detections for known-time calculation", () => {
    const result = calculateSaju(knownTimeInput);
    const codes = result.shinsal.map((item) => item.code);
    const expectedTwelveCodes = [
      "TWELVE_BANANSAL",
      "TWELVE_JAESAL",
      "TWELVE_JANGSEONGSAL",
      "TWELVE_YEOKMASAL",
      "TWELVE_HWAGAE",
    ] as const;

    expect(codes.some((code) => code.startsWith("TWELVE_"))).toBe(true);
    expect(expectedTwelveCodes.some((code) => codes.includes(code))).toBe(
      true,
    );
  });

  it("includes hour-based detection for known-time calculation", () => {
    const result = calculateSaju(knownTimeInput);

    expect(
      result.shinsal.some(
        (item) =>
          item.code === "HYEONCHIMSAL" && item.positions.includes("hour"),
      ),
    ).toBe(true);
  });

  it("includes shinsal array for unknown-time calculation", () => {
    const result = calculateSaju(unknownTimeInput);

    expect(Array.isArray(result.shinsal)).toBe(true);
    expect(result.shinsal.length).toBeGreaterThan(0);
  });

  it("does not include hour detections for unknown-time calculation", () => {
    const result = calculateSaju(unknownTimeInput);

    expect(
      result.shinsal.some((item) => item.positions.includes("hour")),
    ).toBe(false);
  });

  it("includes shinsal metadata", () => {
    const result = calculateSaju(knownTimeInput);

    for (const item of result.shinsal) {
      expect(item.labelKo).toBeTruthy();
      expect(item.descriptionKo).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.severity).toBeTruthy();
      expect(item.confidence).toBe("MEDIUM");
    }
  });

  it("uses deterministic short evidence", () => {
    const result = calculateSaju(knownTimeInput);

    for (const item of result.shinsal) {
      expect(item.evidence.length).toBeGreaterThan(0);
      expect(item.evidence.every((entry) => entry.length < 80)).toBe(true);
    }
  });

  it("uses safe shinsal descriptions", () => {
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

    for (const item of result.shinsal) {
      for (const word of forbiddenWords) {
        expect(item.descriptionKo).not.toContain(word);
      }
    }
  });

  it("is deterministic", () => {
    expect(calculateSaju(knownTimeInput).shinsal).toEqual(
      calculateSaju(knownTimeInput).shinsal,
    );
    expect(calculateSaju(unknownTimeInput).shinsal).toEqual(
      calculateSaju(unknownTimeInput).shinsal,
    );
  });
});
