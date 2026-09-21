import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/reports/create/route";
import { createReportPersistenceRuntime } from "@/lib/persistence/reportPersistenceRuntime";
import type { ReportRequestRawInput } from "@/lib/validation/types";
import * as generator from "../../../src/lib/report-generation/generateProductReport";
import * as writerRuntime from "../../../src/lib/report-generation/reportWriterRuntime";
import * as writer from "../../../src/lib/report-generation/openaiReportWriterClient";
import * as careerWriter from "../../../src/lib/report-generation/openaiCareerReportWriter";
import * as loveWriter from "../../../src/lib/report-generation/openaiLoveMarriageChildReportWriter";
import * as majorWriter from "../../../src/lib/report-generation/openaiMajorFortuneReportWriter";
import * as annualWriter from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import * as legacyGenerator from "../../../src/lib/api/createReport";
import * as persistence from "../../../src/lib/persistence/reportPersistenceRuntime";

const validRawInput: ReportRequestRawInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
  mbtiType: "ENTJ",
};

const productionBroadYearInput: ReportRequestRawInput = {
  birthDate: "1996-12-06",
  birthTime: "14:15",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "FEMALE",
  timezone: "Asia/Seoul",
  mbtiType: "ENTJ",
};

type ApiError = {
  field: string;
  code: string;
  messageKo: string;
};

type ApiErrorSummary = {
  code: "INVALID_REQUEST" | "REPORT_CREATE_FAILED";
  messageKo: string;
};

type ApiErrorBody = {
  ok: false;
  error: ApiErrorSummary;
  errors: ApiError[];
};

type ApiSuccessBody = {
  ok: true;
  reportId: string;
  report: {
    version: string;
    titleKo: string;
    sections: unknown[];
  };
};

type ProductApiErrorBody = {
  ok: false;
  code:
    | "INVALID_REPORT_INPUT"
    | "PRODUCT_GENERATION_NOT_IMPLEMENTED"
    | "PRODUCT_GENERATION_FAILED"
    | "COMPATIBILITY_GENERATION_FAILED"
    | "COMPATIBILITY_DRAFT_INVALID"
    | "PRODUCT_PREVIEW_SNAPSHOT_FAILED"
    | "REPORT_PERSISTENCE_PAYLOAD_FAILED"
    | "REPORT_PERSISTENCE_RUNTIME_FAILED"
    | "REPORT_PERSISTENCE_CREATE_FAILED";
  message: string;
};

type ProductApiSuccessBody = {
  ok: true;
  reportId: string;
  snapshotKind: "product_preview";
  productPreview: {
    productType: string;
    productKey: string;
    productSlug: string;
    draft: {
      productType: string;
      version?: string;
      productVersion?: string;
      relationshipType?: string;
    };
    access: {
      mode: string;
      isPaid: boolean;
      isUnlocked: boolean;
    };
  };
};

type ApiResponseBody =
  | ApiErrorBody
  | ApiSuccessBody
  | ProductApiErrorBody
  | ProductApiSuccessBody;

const apiErrorMessageKo =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";

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

const compatibilityPerson = {
  name: "A",
  birthDate: "1996-12-06",
  birthTime: "",
  birthTimeUnknown: true,
  approximateBirthTimeSlot: "",
  gender: "MALE",
  mbtiType: "ENTJ",
} as const;

const compatibilityPayload = {
  productKey: "saju_mbti_compatibility",
  productSlug: "compatibility",
  relationshipType: "love",
  personA: compatibilityPerson,
  personB: {
    ...compatibilityPerson,
    name: "B",
    birthDate: "1997-03-14",
    gender: "FEMALE",
    mbtiType: "INTP",
  },
} as const;

const singleProductPayload = {
  productKey: "annual_fortune",
  productSlug: "annual-fortune",
  person: compatibilityPerson,
  userContext: {
    relationshipStatus: "single",
    jobStatus: "employee",
    detailJob: "서비스 기획자",
    focusAreas: ["직업", "돈"],
  },
  productOptions: {
    selectedYear: "2026",
  },
} as const;

const loveMarriageChildPayload = {
  ...singleProductPayload,
  productKey: "love_marriage_child",
  productSlug: "love-marriage-child",
  productOptions: {},
} as const;

const careerMoneyStudyPayload = {
  ...singleProductPayload,
  productKey: "career_money_study",
  productSlug: "career-money-study",
  productOptions: {},
} as const;

const majorFortunePayload = {
  ...singleProductPayload,
  productKey: "major_fortune",
  productSlug: "major-fortune",
  productOptions: {},
} as const;

const comprehensiveV2Payload = {
  ...singleProductPayload,
  person: { ...singleProductPayload.person, birthTime: "09:30", birthTimeUnknown: false },
  productKey: "saju_mbti_full",
  productSlug: "saju-mbti-full",
  productOptions: {},
} as const;

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

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

function isApiErrorSummary(value: unknown): value is ApiErrorSummary {
  return (
    isRecord(value) &&
    (value.code === "INVALID_REQUEST" ||
      value.code === "REPORT_CREATE_FAILED") &&
    typeof value.messageKo === "string"
  );
}

function isApiResponseBody(value: unknown): value is ApiResponseBody {
  if (!isRecord(value) || typeof value.ok !== "boolean") {
    return false;
  }

  if (value.ok === false) {
    if (typeof value.code === "string" && typeof value.message === "string") {
      return true;
    }

    return (
      isApiErrorSummary(value.error) &&
      Array.isArray(value.errors) &&
      value.errors.every(isApiError)
    );
  }

  return (
    typeof value.reportId === "string" &&
    ((isRecord(value.report) &&
      typeof value.report.version === "string" &&
      typeof value.report.titleKo === "string" &&
      Array.isArray(value.report.sections)) ||
      (value.snapshotKind === "product_preview" &&
        isRecord(value.productPreview) &&
        typeof value.productPreview.productType === "string"))
  );
}

function expectNoRawInternalLeakage(body: ApiResponseBody): void {
  const text = JSON.stringify(body);

  expect(text).not.toContain("stack");
  expect(text).not.toContain("Error:");
  expect(text).not.toContain("SyntaxError");
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
      expect(body.report.sections).toHaveLength(expectedSectionIds.length);
      expect(
        body.report.sections.map((section) =>
          isRecord(section) && typeof section.id === "string"
            ? section.id
            : "",
        ),
      ).toEqual(expectedSectionIds);
      expect(body.report).toBeDefined();
      expect(body.reportId).toMatch(/^report_/);
      expect("error" in body).toBe(false);
    }
  });

  it("returns product preview response for compatibility payload", async () => {
    const response = await POST(createJsonRequest(compatibilityPayload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("saju_mbti_compatibility");
      expect(body.productPreview.productKey).toBe("saju_mbti_compatibility");
      expect(body.productPreview.productSlug).toBe("compatibility");
      expect(body.productPreview.draft.productType).toBe(
        "saju_mbti_compatibility",
      );
      expect(body.productPreview.draft.relationshipType).toBe("love");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("persists compatibility product preview responses into shared preview memory", async () => {
    const response = await POST(createJsonRequest(compatibilityPayload));
    const body = await readApiResponseBody(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);

    if (!(body.ok && "snapshotKind" in body)) {
      throw new Error("Compatibility product preview response fixture failed.");
    }

    const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });

    expect(runtime.ok).toBe(true);
    if (!runtime.ok) {
      throw new Error("Preview memory runtime fixture failed.");
    }

    const findResult = await runtime.adapter.find({ reportId: body.reportId });

    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.record.snapshotKind).toBe("product_preview");
      if (findResult.record.snapshotKind === "product_preview") {
        expect(findResult.record.productPreview.reportId).toBe(body.reportId);
        expect(findResult.record.productPreview.productType).toBe(
          "saju_mbti_compatibility",
        );
      }
    }
  });

  it("returns product preview response for love marriage child payload", async () => {
    const response = await POST(createJsonRequest(loveMarriageChildPayload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("love_marriage_child");
      expect(body.productPreview.productKey).toBe("love_marriage_child");
      expect(body.productPreview.productSlug).toBe("love-marriage-child");
      expect(body.productPreview.draft.productType).toBe("love_marriage_child");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("returns product preview response for career money study payload", async () => {
    const response = await POST(createJsonRequest(careerMoneyStudyPayload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("career_money_study");
      expect(body.productPreview.productKey).toBe("career_money_study");
      expect(body.productPreview.productSlug).toBe("career-money-study");
      expect(body.productPreview.draft.productType).toBe("career_money_study");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("returns product preview response for major fortune payload", async () => {
    const response = await POST(createJsonRequest(majorFortunePayload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("major_fortune");
      expect(body.productPreview.productKey).toBe("major_fortune");
      expect(body.productPreview.productSlug).toBe("major-fortune");
      expect(body.productPreview.draft.productType).toBe("major_fortune");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("returns product preview response for annual fortune payload", async () => {
    const response = await POST(createJsonRequest(singleProductPayload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("annual_fortune");
      expect(body.productPreview.productKey).toBe("annual_fortune");
      expect(body.productPreview.productSlug).toBe("annual-fortune");
      expect(body.productPreview.draft.productType).toBe("annual_fortune");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("returns product preview response for comprehensive V2 payload", async () => {
    const response = await POST(createJsonRequest(comprehensiveV2Payload));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok && "snapshotKind" in body) {
      expect(body.reportId).toMatch(/^report_/);
      expect(body.snapshotKind).toBe("product_preview");
      expect(body.productPreview.productType).toBe("saju_mbti_full");
      expect(body.productPreview.productKey).toBe("saju_mbti_full");
      expect(body.productPreview.productSlug).toBe("saju-mbti-full");
      expect(body.productPreview.draft.version).toBe("comprehensive_v2_draft");
      expect(body.productPreview.draft.productType).toBe("saju_mbti_full");
      expect(body.productPreview.draft.productVersion).toBe("v2");
      expect(body.productPreview.access).toEqual({
        mode: "preview",
        isPaid: false,
        isUnlocked: false,
      });
      expect(body).not.toHaveProperty("report");
    }
  });

  it("returns invalid input for malformed product payload", async () => {
    const response = await POST(
      createJsonRequest({
        ...compatibilityPayload,
        personB: {
          ...compatibilityPayload.personB,
          name: "",
        },
      }),
    );

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok && "code" in body) {
      expect(body.code).toBe("INVALID_REPORT_INPUT");
      expect(body.message).toBe(
        "리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
      expect(body.message).not.toContain("INVALID_PERSON_NAME");
    }
  });

  it("returns personalized report for display name", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRawInput,
        displayName: "송민",
      }),
    );

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok) {
      const responseText = JSON.stringify(body);

      expect(body.reportId).toMatch(/^report_/);
      expect(responseText).toContain("송민");
      expect(responseText).toContain("송민님은");
      expect(responseText).not.toContain("undefined님");
      expect(responseText).not.toContain("null님");
    }
  });

  it("keeps neutral report subject without display name", async () => {
    const response = await POST(createJsonRequest(validRawInput));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok) {
      const responseText = JSON.stringify(body.report);

      expect(responseText).toContain("당신");
      expect(responseText).not.toContain("undefined님");
      expect(responseText).not.toContain("null님");
    }
  });

  it("returns 200 for the 1996 production payload", async () => {
    const response = await POST(createJsonRequest(productionBroadYearInput));

    expect(response.status).toBe(200);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(true);
    if (body.ok) {
      const responseText = JSON.stringify(body);

      expect(body.report).toBeDefined();
      expect(body.reportId).toMatch(/^report_/);
      expect(responseText).not.toContain("SOLAR_TERM_YEAR_UNSUPPORTED");
      expect(responseText).not.toContain("BIRTH_DATE_REQUIRED");
      expect(responseText).not.toContain("MBTI_TYPE_REQUIRED");
      expect(responseText).not.toContain("MBTI_TYPE_INVALID");
    }
  });

  it("returns 400 for display name over twenty characters", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRawInput,
        displayName: "가나다라마바사아자차카타파하가나다라마바사",
      }),
    );

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.error.code).toBe("INVALID_REQUEST");
      expect(body.errors.map((error) => error.code)).toContain(
        "DISPLAY_NAME_TOO_LONG",
      );
    }
  });

  it("returns 400 for empty object", async () => {
    const response = await POST(createJsonRequest({}));

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.error.code).toBe("INVALID_REQUEST");
      expect(body.error.messageKo).toBe(apiErrorMessageKo);
      expect(body.errors).toEqual(expect.any(Array));
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

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.error).toEqual({
        code: "INVALID_REQUEST",
        messageKo: apiErrorMessageKo,
      });
      expect(body.errors).toEqual(expect.any(Array));
      expectNoRawInternalLeakage(body);
    }
  });

  it("returns 400 for array JSON", async () => {
    const response = await POST(createJsonRequest([]));

    expect(response.status).toBe(400);

    const body = await readApiResponseBody(response);

    expect(body.ok).toBe(false);
    if (!body.ok) {
      expect(body.error.code).toBe("INVALID_REQUEST");
      expect(body.error.messageKo).toBe(apiErrorMessageKo);
      expect(body.errors).toEqual(expect.any(Array));
    }
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
      expect(body.error.code).toBe("INVALID_REQUEST");
      expect(body.error.messageKo).toBe(apiErrorMessageKo);
      expect(body.errors).toEqual(expect.any(Array));
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

  it("keeps preview-memory persistence and avoids unsafe markers", () => {
    const source = readFile("src/app/api/reports/create/route.ts");
    const unsafeMarkers = [
      "production_supabase",
      "@supabase/supabase-js",
      "process.env",
      "NEXT_PUBLIC",
      "fetch(",
      "createClient",
      "service_role",
      "password",
    ];

    expect(source).toContain('mode: "preview_memory"');

    const boundarySource = source.replace(/\bprocess\.env\.NODE_ENV\b/g, "");
    for (const marker of unsafeMarkers) {
      expect(boundarySource).not.toContain(marker);
    }
  });
});

describe("public direct report generation production boundary", () => {
  const person = {
    name: "보안 테스트", birthDate: "1996-12-06", birthTime: "09:30",
    birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ",
  };
  const products = [
    ["saju_mbti_full", "saju-mbti-full"],
    ["career_money_study", "career-money-study"],
    ["love_marriage_child", "love-marriage-child"],
    ["saju_mbti_compatibility", "compatibility"],
    ["major_fortune", "major-fortune"],
    ["annual_fortune", "annual-fortune"],
  ] as const;
  function payload(productKey = "saju_mbti_full", productSlug = "saju-mbti-full") {
    return {
      productKey, productSlug, person,
      userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] },
      productOptions: { selectedYear: "2026" },
      ...(productKey === "saju_mbti_compatibility"
        ? { relationshipType: "love", personA: person, personB: { ...person, name: "상대" } }
        : {}),
    };
  }
  function request(body: unknown = payload(), query = "", headers: HeadersInit = {}) {
    return new Request(`http://localhost/api/reports/create${query}`, {
      method: "POST", headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  }

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("OPENAI_REPORT_WRITER_ENABLED", "1");
    vi.stubEnv("OPENAI_API_KEY", "mock-key-not-a-credential");
    vi.stubEnv("OPENAI_REPORT_MODEL", "mock-model");
    vi.spyOn(generator, "generateProductReport").mockResolvedValue({
      ok: false, error: { code: "INVALID_REPORT_INPUT", message: "mock generation boundary" },
    });
    vi.spyOn(writerRuntime, "resolveReportWriterRuntime").mockReturnValue({
      enabled: true, config: { enabled: true, apiKey: "mock-key", model: "mock-model" },
    });
    vi.spyOn(writer, "callOpenAIReportWriter").mockRejectedValue(new Error("Unexpected writer invocation"));
    vi.spyOn(careerWriter, "generateCareerReportDraft").mockRejectedValue(new Error("Unexpected writer invocation"));
    vi.spyOn(loveWriter, "generateLoveMarriageChildReportDraft").mockRejectedValue(new Error("Unexpected writer invocation"));
    vi.spyOn(majorWriter, "generateMajorFortuneReportDraft").mockRejectedValue(new Error("Unexpected writer invocation"));
    vi.spyOn(annualWriter, "generateAnnualFortuneReportDraft").mockRejectedValue(new Error("Unexpected writer invocation"));
    vi.spyOn(legacyGenerator, "createReportApiEnvelopeFromJson").mockImplementation(() => {
      throw new Error("Unexpected legacy generation");
    });
    vi.spyOn(persistence, "createReportPersistenceRuntime").mockImplementation(() => {
      throw new Error("Unexpected persistence access");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function expectNoGeneration() {
    expect(generator.generateProductReport).not.toHaveBeenCalled();
    expect(writerRuntime.resolveReportWriterRuntime).not.toHaveBeenCalled();
    expect(writer.callOpenAIReportWriter).not.toHaveBeenCalled();
    expect(careerWriter.generateCareerReportDraft).not.toHaveBeenCalled();
    expect(loveWriter.generateLoveMarriageChildReportDraft).not.toHaveBeenCalled();
    expect(majorWriter.generateMajorFortuneReportDraft).not.toHaveBeenCalled();
    expect(annualWriter.generateAnnualFortuneReportDraft).not.toHaveBeenCalled();
    expect(legacyGenerator.createReportApiEnvelopeFromJson).not.toHaveBeenCalled();
    expect(persistence.createReportPersistenceRuntime).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  }

  async function expectBlocked(input: Request) {
    const parse = vi.spyOn(input, "json");
    const response = await POST(input);
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: false, message: "요청을 처리할 수 없습니다." });
    expect(parse).not.toHaveBeenCalled();
    expectNoGeneration();
  }

    it.each(products)("blocks anonymous %s before parsing or generation", async (key, slug) => {
      await expectBlocked(request(payload(key, slug)));
    });

    it("blocks malformed JSON before expensive work", async () => {
      await expectBlocked(new Request("http://localhost/api/reports/create", { method: "POST", body: "{" }));
    });

    it("blocks the legacy deterministic report path", async () => {
      await expectBlocked(request({ ...person, calendarType: "SOLAR", timezone: "Asia/Seoul" }));
    });

    it.each([
      { paymentKey: "fake-key", orderId: "fake-order", amount: 1290, status: "PAID", isPaid: true },
      { reportId: "report_fake", access: { mode: "paid", isUnlocked: true } },
      { productKey: "unknown", productType: "saju_mbti_full" },
    ])("rejects forged payment/report/product fields: %j", async (fields) => {
      await expectBlocked(request({ ...payload(), ...fields }));
    });

    it("does not trust preview query, cookies, environment headers, or fake internal authorization", async () => {
      await expectBlocked(request(payload(), "?preview=1&dev=1&NODE_ENV=test", {
        "x-preview": "1", "x-node-env": "development", cookie: "preview=1",
        authorization: "Bearer fake-internal-secret",
      }));
    });

    it("stays closed with every existing preview/mock flag enabled in production", async () => {
      for (const flag of [
        "COMPREHENSIVE_DEV_PREVIEW_ENABLED", "CAREER_REPORT_DEV_PREVIEW_ENABLED",
        "LOVE_MARRIAGE_CHILD_DEV_PREVIEW_ENABLED", "COMPATIBILITY_DEV_PREVIEW_ENABLED",
        "MAJOR_FORTUNE_DEV_PREVIEW_ENABLED", "ANNUAL_FORTUNE_DEV_PREVIEW_ENABLED",
        "MOCK_PAID_REPORT_API_ENABLED", "PAID_REPORT_RELIABILITY_ENABLED",
        "PAYMENT_ENABLED", "PAID_UNLOCK_ENABLED", "PUBLIC_PAID_LAUNCH_ENABLED", "INTERNAL_PREVIEW_ENABLED",
      ]) vi.stubEnv(flag, "1");
      vi.stubEnv("REPORT_PERSISTENCE_MODE", "preview_memory");
      await expectBlocked(request());
    });

    it("also blocks deterministic fallback when the writer is disabled", async () => {
      vi.stubEnv("OPENAI_REPORT_WRITER_ENABLED", "0");
      await expectBlocked(request());
    });

    it("keeps generator, all writer entry points, storage and network at zero for 100 concurrent POSTs", async () => {
      await Promise.all(Array.from({ length: 100 }, () => expectBlocked(request())));
      expectNoGeneration();
    });

    it.each([undefined, "", "staging"])("fails closed for an unspecified/unsupported environment: %s", async (environment) => {
      vi.stubEnv("NODE_ENV", environment);
      await expectBlocked(request());
    });

    it.each(["development", "test"])("preserves explicit %s direct-generation callers", async (environment) => {
      vi.stubEnv("NODE_ENV", environment);
      const input = request();
      const parse = vi.spyOn(input, "json");
      const response = await POST(input);
      expect(response.status).toBe(400); // The mock generator's existing invalid-input response.
      expect(parse).toHaveBeenCalledTimes(1);
      expect(generator.generateProductReport).toHaveBeenCalledExactlyOnceWith(
        payload(), expect.objectContaining({ enabled: true }), "normal_writer",
      );
      expect(fetch).not.toHaveBeenCalled();
    });
});
