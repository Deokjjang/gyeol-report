import { describe, expect, it } from "vitest";

import { validateReportRequest } from "@/lib/validation/reportRequest";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
} from "@/lib/validation/types";

const validRawInput: ReportRequestRawInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
  mbtiType: "ENTJ",
};

function getSingleError(raw: ReportRequestRawInput): ReportRequestValidationError {
  const result = validateReportRequest(raw);

  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("Expected validation to fail.");
  }

  expect(result.errors).toHaveLength(1);

  const error = result.errors[0];
  if (!error) {
    throw new Error("Expected one validation error.");
  }

  return error;
}

describe("validateReportRequest", () => {
  it("validates a known-time request", () => {
    const result = validateReportRequest(validRawInput);

    expect(result).toEqual({
      ok: true,
      value: {
        sajuInput: {
          birthDate: "2024-02-04",
          birthTime: "17:27",
          birthTimeUnknown: false,
          calendarType: "SOLAR",
          gender: "MALE",
          timezone: "Asia/Seoul",
        },
        mbtiType: "ENTJ",
      },
      errors: [],
    });
  });

  it("validates an unknown-time request and omits birth time", () => {
    const raw: ReportRequestRawInput = {
      ...validRawInput,
      birthTime: undefined,
      birthTimeUnknown: true,
    };
    const result = validateReportRequest(raw);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sajuInput.birthTime).toBeUndefined();
      expect(result.value.sajuInput.birthTimeUnknown).toBe(true);
    }
  });

  it("collects all required errors in field order", () => {
    const result = validateReportRequest({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.field)).toEqual([
        "birthDate",
        "birthTimeUnknown",
        "calendarType",
        "gender",
        "timezone",
        "mbtiType",
      ]);
      expect(result.errors.map((error) => error.code)).toEqual([
        "BIRTH_DATE_REQUIRED",
        "BIRTH_TIME_UNKNOWN_INVALID",
        "CALENDAR_TYPE_REQUIRED",
        "GENDER_REQUIRED",
        "TIMEZONE_REQUIRED",
        "MBTI_TYPE_REQUIRED",
      ]);
    }
  });

  it("rejects invalid date format", () => {
    const error = getSingleError({
      ...validRawInput,
      birthDate: "2024/02/04",
    });

    expect(error.code).toBe("BIRTH_DATE_INVALID");
  });

  it("rejects invalid calendar dates", () => {
    const invalidDates = [
      "2024-02-30",
      "2023-02-29",
      "2024-13-01",
      "2024-00-01",
      "2024-01-00",
    ];

    for (const birthDate of invalidDates) {
      const error = getSingleError({
        ...validRawInput,
        birthDate,
      });

      expect(error.code).toBe("BIRTH_DATE_INVALID");
    }
  });

  it("accepts a valid leap date", () => {
    const result = validateReportRequest({
      ...validRawInput,
      birthDate: "2024-02-29",
    });

    expect(result.ok).toBe(true);
  });

  it("requires birth time when birth time is known", () => {
    const error = getSingleError({
      ...validRawInput,
      birthTime: undefined,
      birthTimeUnknown: false,
    });

    expect(error.code).toBe("BIRTH_TIME_REQUIRED");
  });

  it("rejects invalid birth times", () => {
    const invalidTimes = ["24:00", "7:00", "07:0", "12:60", "ab:cd"];

    for (const birthTime of invalidTimes) {
      const error = getSingleError({
        ...validRawInput,
        birthTime,
      });

      expect(error.code).toBe("BIRTH_TIME_INVALID");
    }
  });

  it("ignores birth time when birth time is unknown", () => {
    const result = validateReportRequest({
      ...validRawInput,
      birthTime: "not-time",
      birthTimeUnknown: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sajuInput.birthTime).toBeUndefined();
    }
  });

  it("rejects lunar calendar", () => {
    const error = getSingleError({
      ...validRawInput,
      calendarType: "LUNAR",
    });

    expect(error.code).toBe("CALENDAR_TYPE_UNSUPPORTED");
  });

  it("rejects invalid gender", () => {
    const error = getSingleError({
      ...validRawInput,
      gender: "OTHER",
    });

    expect(error.code).toBe("GENDER_INVALID");
  });

  it("rejects unsupported timezone", () => {
    const error = getSingleError({
      ...validRawInput,
      timezone: "UTC",
    });

    expect(error.code).toBe("TIMEZONE_UNSUPPORTED");
  });

  it("rejects invalid MBTI type", () => {
    const error = getSingleError({
      ...validRawInput,
      mbtiType: "ABCD",
    });

    expect(error.code).toBe("MBTI_TYPE_INVALID");
  });

  it("returns at most one error per field", () => {
    const raw: ReportRequestRawInput = {
      birthDate: 123,
      birthTime: 123,
      birthTimeUnknown: false,
      calendarType: 123,
      gender: 123,
      timezone: 123,
      mbtiType: 123,
    };
    const result = validateReportRequest(raw);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      const fields = result.errors.map((error) => error.field);

      expect(new Set(fields).size).toBe(fields.length);
    }
  });

  it("returns nonempty Korean messages for validation errors", () => {
    const result = validateReportRequest({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      for (const error of result.errors) {
        expect(error.messageKo).toBeTruthy();
      }
    }
  });

  it("does not throw for invalid mixed input", () => {
    expect(() =>
      validateReportRequest({ birthDate: Symbol("x") }),
    ).not.toThrow();
  });

  it("returns deterministic validation results", () => {
    expect(validateReportRequest(validRawInput)).toEqual(
      validateReportRequest(validRawInput),
    );
  });
});
