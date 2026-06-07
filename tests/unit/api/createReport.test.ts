import { describe, expect, it } from "vitest";

import { createReportApiEnvelopeFromJson } from "@/lib/api/createReport";
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

const malformedRequestError = [
  {
    field: "birthDate",
    code: "BIRTH_DATE_REQUIRED",
    messageKo: "요청 형식이 올바르지 않습니다.",
  },
];

const apiErrorMessageKo =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";

const invalidRequestError = {
  code: "INVALID_REQUEST",
  messageKo: apiErrorMessageKo,
} as const;

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

function expectMalformedRequestEnvelope(json: unknown): void {
  const envelope = createReportApiEnvelopeFromJson(json);

  expect(envelope.status).toBe(400);
  expect(envelope.body.ok).toBe(false);
  if (!envelope.body.ok) {
    expect(envelope.body.error).toEqual(invalidRequestError);
    expect(envelope.body.errors).toEqual(expect.any(Array));
    expect(envelope.body.errors).toEqual(malformedRequestError);
  }
}

function expectNoRawInternalLeakage(body: unknown): void {
  const text = JSON.stringify(body);

  expect(text).not.toContain("stack");
  expect(text).not.toContain("Error:");
  expect(text).not.toContain("SyntaxError");
}

describe("createReportApiEnvelopeFromJson", () => {
  it("returns 400 for null JSON", () => {
    expectMalformedRequestEnvelope(null);
  });

  it("returns 400 for primitive JSON", () => {
    const primitiveValues: readonly unknown[] = ["text", 123, true];

    for (const value of primitiveValues) {
      expectMalformedRequestEnvelope(value);
    }
  });

  it("returns 400 for array JSON", () => {
    const envelope = createReportApiEnvelopeFromJson([]);

    expect(envelope.status).toBe(400);
    expect(envelope.body.ok).toBe(false);
  });

  it("returns 400 for invalid object request", () => {
    const envelope = createReportApiEnvelopeFromJson({});

    expect(envelope.status).toBe(400);
    expect(envelope.body.ok).toBe(false);
    if (!envelope.body.ok) {
      expect(envelope.body.error).toEqual(invalidRequestError);
      expect(envelope.body.errors).toEqual(expect.any(Array));
      expect(envelope.body.errors.map((error) => error.code)).toEqual([
        "BIRTH_DATE_REQUIRED",
        "BIRTH_TIME_UNKNOWN_INVALID",
        "CALENDAR_TYPE_REQUIRED",
        "GENDER_REQUIRED",
        "TIMEZONE_REQUIRED",
        "MBTI_TYPE_REQUIRED",
      ]);
    }
  });

  it("returns 200 for valid request", () => {
    const envelope = createReportApiEnvelopeFromJson(validRawInput);

    expect(envelope.status).toBe(200);
    expect(envelope.body.ok).toBe(true);
    if (envelope.body.ok) {
      expect(envelope.body.report.version).toBe("v1");
      expect(envelope.body.report.titleKo).toBe("결리포트");
      expect(envelope.body.report.sections).toHaveLength(
        expectedSectionIds.length,
      );
      expect(envelope.body.report.sections.map((section) => section.id)).toEqual(
        expectedSectionIds,
      );
      expect(envelope.body.report).toBeDefined();
      expect("error" in envelope.body).toBe(false);
    }
  });

  it("returns 400 for unsupported lunar calendar", () => {
    const envelope = createReportApiEnvelopeFromJson({
      ...validRawInput,
      calendarType: "LUNAR",
    });

    expect(envelope.status).toBe(400);
    expect(envelope.body.ok).toBe(false);
    if (!envelope.body.ok) {
      expect(envelope.body.error).toEqual(invalidRequestError);
      expect(envelope.body.errors).toEqual(expect.any(Array));
      expect(envelope.body.errors.map((error) => error.code)).toContain(
        "CALENDAR_TYPE_UNSUPPORTED",
      );
    }
  });

  it("returns 400 for invalid MBTI", () => {
    const envelope = createReportApiEnvelopeFromJson({
      ...validRawInput,
      mbtiType: "ABCD",
    });

    expect(envelope.status).toBe(400);
    expect(envelope.body.ok).toBe(false);
    if (!envelope.body.ok) {
      expect(envelope.body.error).toEqual(invalidRequestError);
      expect(envelope.body.errors).toEqual(expect.any(Array));
      expect(envelope.body.errors.map((error) => error.code)).toContain(
        "MBTI_TYPE_INVALID",
      );
    }
  });

  it("returns clean 500 envelope for unexpected create failure", () => {
    const throwingInput = Object.defineProperty({}, "birthDate", {
      get() {
        throw new Error("internal failure");
      },
    });

    const envelope = createReportApiEnvelopeFromJson(throwingInput);

    expect(envelope.status).toBe(500);
    expect(envelope.body.ok).toBe(false);
    if (!envelope.body.ok) {
      expect(envelope.body.error).toEqual({
        code: "REPORT_CREATE_FAILED",
        messageKo: apiErrorMessageKo,
      });
      expect(envelope.body.errors).toEqual(expect.any(Array));
      expectNoRawInternalLeakage(envelope.body);
    }
  });

  it("does not throw for malformed input", () => {
    expect(() => createReportApiEnvelopeFromJson(Symbol("bad"))).not.toThrow();
    expect(() => createReportApiEnvelopeFromJson([])).not.toThrow();
    expect(() => createReportApiEnvelopeFromJson({})).not.toThrow();
  });

  it("returns deterministic envelopes", () => {
    expect(createReportApiEnvelopeFromJson(validRawInput)).toEqual(
      createReportApiEnvelopeFromJson(validRawInput),
    );
    expect(createReportApiEnvelopeFromJson({})).toEqual(
      createReportApiEnvelopeFromJson({}),
    );
  });
});
