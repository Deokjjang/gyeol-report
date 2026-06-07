import { describe, expect, it } from "vitest";

import { createReportFromRawInput } from "@/lib/report/pipeline";
import type { ReportBlock, ReportSection } from "@/lib/report/types";
import type { ReportRequestRawInput } from "@/lib/validation/types";

const validRawInput: ReportRequestRawInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
  mbtiType: "ENTJ",
};

const mbtiSuggestionNotice =
  "입력한 MBTI는 사용자의 자기보고 정보로 존중하며, 사주 기반 제안은 보조 해석으로만 사용합니다.";

const expectedSectionIds = [
  "INTRO",
  "QUICK_SUMMARY",
  "SAJU_CORE",
  "DAY_MASTER",
  "ELEMENTS",
  "TEN_GODS",
  "ADVANCED_PATTERNS",
  "SHINSAL",
  "RELATIONS",
  "PRACTICAL_POINTS",
  "MBTI_PROFILE",
  "SAJU_MBTI_BRIDGE",
  "SAJU_MBTI_SUGGESTION",
  "ACTION_GUIDE",
  "DISCLAIMER",
] as const;

function getSuccessfulReport(raw: ReportRequestRawInput) {
  const result = createReportFromRawInput(raw);

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error("Expected pipeline to return a report.");
  }

  return result.report;
}

function findSection(
  sections: readonly ReportSection[],
  id: ReportSection["id"],
): ReportSection | undefined {
  return sections.find((section) => section.id === id);
}

function getFirstBlock(section: ReportSection | undefined): ReportBlock | undefined {
  return section?.blocks[0];
}

describe("createReportFromRawInput", () => {
  it("returns validation errors for invalid input", () => {
    const result = createReportFromRawInput({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toEqual([
        "BIRTH_DATE_REQUIRED",
        "BIRTH_TIME_UNKNOWN_INVALID",
        "CALENDAR_TYPE_REQUIRED",
        "GENDER_REQUIRED",
        "TIMEZONE_REQUIRED",
        "MBTI_TYPE_REQUIRED",
      ]);
    }
    expect("report" in result).toBe(false);
  });

  it("returns report for valid known-time input", () => {
    const result = createReportFromRawInput(validRawInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.report.version).toBe("v1");
      expect(result.report.titleKo).toBe("결리포트");
      expect(result.report.subtitleKo).toBe("사주와 MBTI로 읽는 나의 결");
      expect(result.report.sections).toHaveLength(expectedSectionIds.length);
      expect(result.report.sections.map((section) => section.id)).toEqual(
        expectedSectionIds,
      );
    }
  });

  it("returns report for fixture with day pillar profile lookup integrated", () => {
    const result = createReportFromRawInput(validRawInput);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected valid report");
    }
    expect(result.report.sections).toHaveLength(expectedSectionIds.length);
  });

  it("includes MBTI suggestion notice in report output", () => {
    const result = createReportFromRawInput(validRawInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.report.notices).toContain(mbtiSuggestionNotice);
    }
  });

  it("renders expected core pillars for valid known-time input", () => {
    const report = getSuccessfulReport(validRawInput);
    const section = findSection(report.sections, "SAJU_CORE");
    const block = getFirstBlock(section);

    expect(block?.kind).toBe("KEY_VALUE");
    expect(block?.keyValues).toEqual([
      { keyKo: "년주", valueKo: "甲辰 갑진 — 갑목 + 진토" },
      { keyKo: "월주", valueKo: "丙寅 병인 — 병화 + 인목" },
      { keyKo: "일주", valueKo: "丙申 병신 — 병화 + 신금" },
      { keyKo: "시주", valueKo: "丁酉 정유 — 정화 + 유금" },
    ]);
  });

  it("keeps fixture day pillar as Byeongsin", () => {
    const report = getSuccessfulReport(validRawInput);
    const section = findSection(report.sections, "SAJU_CORE");
    const block = getFirstBlock(section);
    const dayValue = block?.keyValues?.find((item) => item.keyKo === "일주");

    expect(dayValue?.valueKo).toBe("丙申 병신 — 병화 + 신금");
  });

  it("renders missing hour and notices for valid unknown-time input", () => {
    const report = getSuccessfulReport({
      ...validRawInput,
      birthTime: undefined,
      birthTimeUnknown: true,
    });
    const section = findSection(report.sections, "SAJU_CORE");
    const block = getFirstBlock(section);
    const hourValue = block?.keyValues?.find((item) => item.keyKo === "시주");

    expect(hourValue?.valueKo).toBe("모름");
    expect(report.notices).toContain(
      "출생시간을 모르면 년·월·일주 중심으로 분석됩니다.",
    );
    expect(report.notices).toContain(
      "출생정보와 해석 결과는 자기이해용 참고자료입니다.",
    );
  });

  it("does not throw for invalid mixed input", () => {
    const raw: ReportRequestRawInput = {
      birthDate: Symbol("bad"),
      birthTime: 123,
      birthTimeUnknown: false,
      calendarType: "LUNAR",
      gender: "OTHER",
      timezone: "UTC",
      mbtiType: "XXXX",
    };

    expect(() => createReportFromRawInput(raw)).not.toThrow();

    const result = createReportFromRawInput(raw);
    expect(result.ok).toBe(false);
  });

  it("rejects invalid MBTI without report", () => {
    const result = createReportFromRawInput({
      ...validRawInput,
      mbtiType: "ABCD",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain(
        "MBTI_TYPE_INVALID",
      );
    }
    expect("report" in result).toBe(false);
  });

  it("rejects lunar calendar without report", () => {
    const result = createReportFromRawInput({
      ...validRawInput,
      calendarType: "LUNAR",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain(
        "CALENDAR_TYPE_UNSUPPORTED",
      );
    }
    expect("report" in result).toBe(false);
  });

  it("includes MBTI section for selected type", () => {
    const report = getSuccessfulReport(validRawInput);
    const section = findSection(report.sections, "MBTI_PROFILE");
    const block = section?.blocks.find(
      (item) => item.kind === "KEY_VALUE" && item.titleKo === "입력 MBTI",
    );

    expect(block?.kind).toBe("KEY_VALUE");
    expect(block?.keyValues).toEqual(
      expect.arrayContaining([
        { keyKo: "입력 MBTI", valueKo: "ENTJ" },
        { keyKo: "스타일 이름", valueKo: "전략 추진형" },
      ]),
    );
  });

  it("includes bridge section", () => {
    const report = getSuccessfulReport(validRawInput);
    const section = findSection(report.sections, "SAJU_MBTI_BRIDGE");

    expect(section).toBeDefined();
    expect(section?.titleKo).toBeTruthy();
    expect(section?.blocks.length).toBeGreaterThan(0);
  });

  it("returns deterministic results", () => {
    expect(createReportFromRawInput(validRawInput)).toEqual(
      createReportFromRawInput(validRawInput),
    );
    expect(createReportFromRawInput({})).toEqual(createReportFromRawInput({}));
  });
});
