import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/reports/create/route";
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

type ApiError = {
  field: string;
  code: string;
  messageKo: string;
};

type ApiErrorBody = {
  ok: false;
  errors: ApiError[];
};

type ApiSuccessBody = {
  ok: true;
  report: {
    version: string;
    titleKo: string;
    sections: unknown[];
  };
};

type ApiResponseBody = ApiErrorBody | ApiSuccessBody;

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/reports/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/reports/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{invalid-json",
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isApiError(value: unknown): value is ApiError {
  return (
    isRecord(value) &&
    typeof value.field === "string" &&
    typeof value.code === "string" &&
    typeof value.messageKo === "string"
  );
}

function isApiResponseBody(value: unknown): value is ApiResponseBody {
  if (!isRecord(value) || typeof value.ok !== "boolean") {
    return false;
  }

  if (value.ok === false) {
    return Array.isArray(value.errors) && value.errors.every(isApiError);
  }

  return (
    isRecord(value.report) &&
    typeof value.report.version === "string" &&
    typeof value.report.titleKo === "string" &&
    Array.isArray(value.report.sections)
  );
}

async function readApiResponseBody(response: Response): Promise<ApiResponseBody> {
  const body: unknown = await response.json();

  if (!isApiResponseBody(body)) {
    throw new Error("Unexpected API response body.");
  }

  return body;
}

describe("create report route", () => {
  it("exports POST function", () => {
    expect(typeof POST).toBe("function");
  });

  it("returns 200 for valid request", async () => {
    const response = await POST(createJsonRequest(validRawInput));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok) {
      expect(body.report.version).toBe("v1");
      expect(body.report.titleKo).toBe("결리포트");
      expect(body.report.sections).toHaveLength(11);
    }
  });

  it("returns 400 for empty object", async () => {
    const response = await POST(createJsonRequest({}));

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.errors.map((error) => error.code)).toEqual([
        "BIRTH_DATE_REQUIRED",
        "BIRTH_TIME_UNKNOWN_INVALID",
        "CALENDAR_TYPE_REQUIRED",
        "GENDER_REQUIRED",
        "TIMEZONE_REQUIRED",
        "MBTI_TYPE_REQUIRED",
      ]);
    }
  });

  it("returns 400 for invalid JSON", async () => {
    const response = await POST(createInvalidJsonRequest());

    expect(response.status).toBe(400);

    const body: unknown = await response.json();

    expect(body).toEqual({
      ok: false,
      errors: [
        {
          field: "birthDate",
          code: "BIRTH_DATE_REQUIRED",
          messageKo: "요청 JSON을 읽을 수 없습니다.",
        },
      ],
    });
  });

  it("returns 400 for array JSON", async () => {
    const response = await POST(createJsonRequest([]));

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
  });

  it("returns 400 for invalid MBTI", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRawInput,
        mbtiType: "ABCD",
      }),
    );

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.errors.map((error) => error.code)).toContain(
        "MBTI_TYPE_INVALID",
      );
    }
  });

  it("returns deterministic responses", async () => {
    const first = await POST(createJsonRequest(validRawInput));
    const second = await POST(createJsonRequest(validRawInput));

    expect(first.status).toBe(second.status);
    expect(await first.json()).toEqual(await second.json());
  });
});
