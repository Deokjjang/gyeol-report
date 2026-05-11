import { describe, expect, it } from "vitest";
import {
  createDayPillarCode,
  getDayPillarProfile,
} from "@/lib/saju/dayPillarProfile";
import { DAY_PILLAR_PROFILES } from "@/lib/saju/dayPillarProfiles";

const supportedCodes = [
  "甲子",
  "甲午",
  "乙卯",
  "乙酉",
  "丙寅",
  "丙申",
  "丁卯",
  "戊辰",
  "己未",
  "庚申",
] as const;

describe("day pillar profile lookup", () => {
  it("creates day pillar code", () => {
    expect(createDayPillarCode({ stem: "丙", branch: "申" })).toBe("丙申");
    expect(createDayPillarCode({ stem: "己", branch: "亥" })).toBe("己亥");
  });

  it("looks up existing Byeongsin profile", () => {
    const result = getDayPillarProfile("丙申");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected profile lookup success");
    }
    expect(result.profile.code).toBe("丙申");
    expect(result.profile.nameKo).toBe("병신일주");
    expect(result.profile.stem).toBe("丙");
    expect(result.profile.branch).toBe("申");
  });

  it("contains high-quality user-facing text", () => {
    const result = getDayPillarProfile("丙申");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected profile lookup success");
    }
    expect(result.profile.imageKo).toContain(
      "밝은 태양이 날카로운 금속 위에 비치는 이미지입니다.",
    );
    expect(result.profile.coreSummaryKo).toContain(
      "밝게 드러나는 표현성과 빠른 판단력이 함께 작동하는 구조입니다.",
    );
    expect(result.profile.structureKo).toContain(
      "丙 화 일간이 申 금 위에 앉은 구조",
    );
  });

  it("has structured profile items", () => {
    const result = getDayPillarProfile("丙申");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected profile lookup success");
    }
    expect(result.profile.strengthItems.length).toBeGreaterThanOrEqual(3);
    expect(result.profile.cautionItems.length).toBeGreaterThanOrEqual(2);
    expect(result.profile.developmentItems.length).toBeGreaterThanOrEqual(2);
    expect(result.profile.tones).toContain("SHARP");
    expect(result.profile.themes).toContain("SELF_EXPRESSION");
    expect(result.profile.mbtiHints.length).toBeGreaterThanOrEqual(2);
  });

  it("returns PROFILE_NOT_FOUND for missing profile", () => {
    const result = getDayPillarProfile("癸亥");

    expect(result).toEqual({
      ok: false,
      code: "癸亥",
      reason: "PROFILE_NOT_FOUND",
    });
  });

  it("looks up all supported profile codes", () => {
    for (const code of supportedCodes) {
      const result = getDayPillarProfile(code);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        throw new Error(`expected profile lookup success: ${code}`);
      }
      expect(result.profile.code).toBe(code);
      expect(result.profile.nameKo).toBeTruthy();
      expect(result.profile.imageKo).toBeTruthy();
      expect(result.profile.coreSummaryKo).toBeTruthy();
      expect(result.profile.structureKo).toBeTruthy();
      expect(result.profile.strengthItems).toHaveLength(3);
      expect(result.profile.cautionItems).toHaveLength(2);
      expect(result.profile.developmentItems).toHaveLength(2);
      expect(result.profile.mbtiHints.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has unique profile codes", () => {
    const codes = DAY_PILLAR_PROFILES.map((profile) => profile.code);

    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toHaveLength(10);
  });

  it("uses safe wording", () => {
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
      "\uD2C0\uB838\uB2E4",
    ];
    const result = getDayPillarProfile("丙申");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected profile lookup success");
    }
    const text = JSON.stringify(result.profile);

    for (const word of forbiddenWords) {
      expect(text).not.toContain(word);
    }
  });

  it("is deterministic", () => {
    expect(getDayPillarProfile("丙申")).toEqual(getDayPillarProfile("丙申"));
  });
});
