import { createReportFromRawInput } from "../report/pipeline";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
} from "../validation/types";
import type { CreateReportApiEnvelope } from "./reportTypes";

const REPORT_CREATE_ERROR_MESSAGE =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";

type CreateReportApiErrorSummary = {
  code: "INVALID_REQUEST" | "REPORT_CREATE_FAILED";
  messageKo: string;
};

type CreateReportApiFailureBody = Extract<
  CreateReportApiEnvelope["body"],
  { ok: false }
> & {
  error: CreateReportApiErrorSummary;
};

type CreateReportApiSuccessBody = Extract<
  CreateReportApiEnvelope["body"],
  { ok: true }
>;

type CreateReportApiEnvelopeWithError = Omit<
  CreateReportApiEnvelope,
  "body"
> & {
  body: CreateReportApiSuccessBody | CreateReportApiFailureBody;
};

function isJsonObject(json: unknown): json is Record<string, unknown> {
  return typeof json === "object" && json !== null && !Array.isArray(json);
}

function createErrorSummary(
  code: CreateReportApiErrorSummary["code"],
): CreateReportApiErrorSummary {
  return {
    code,
    messageKo: REPORT_CREATE_ERROR_MESSAGE,
  };
}

function createFallbackValidationError(
  messageKo: string,
): ReportRequestValidationError {
  return {
    field: "birthDate",
    code: "BIRTH_DATE_REQUIRED",
    messageKo,
  };
}

export function createReportApiEnvelopeFromJson(
  json: unknown,
): CreateReportApiEnvelopeWithError {
  if (!isJsonObject(json)) {
    return {
      status: 400,
      body: {
        ok: false,
        error: createErrorSummary("INVALID_REQUEST"),
        errors: [
          {
            field: "birthDate",
            code: "BIRTH_DATE_REQUIRED",
            messageKo: "요청 형식이 올바르지 않습니다.",
          },
        ],
      },
    };
  }

  const raw = json as ReportRequestRawInput;
  const result = (() => {
    try {
      return createReportFromRawInput(raw);
    } catch {
      return null;
    }
  })();

  if (!result) {
    return {
      status: 500,
      body: {
        ok: false,
        error: createErrorSummary("REPORT_CREATE_FAILED"),
        errors: [createFallbackValidationError(REPORT_CREATE_ERROR_MESSAGE)],
      },
    };
  }

  if (!result.ok) {
    return {
      status: 400,
      body: {
        ok: false,
        error: createErrorSummary("INVALID_REQUEST"),
        errors: result.errors,
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      report: result.report,
    },
  };
}
