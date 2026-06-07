import { createReportFromRawInput } from "../report/pipeline";
import { UnsupportedSolarTermYearError } from "../saju/solarTerms";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
} from "../validation/types";
import type { CreateReportApiEnvelope } from "./reportTypes";

const REPORT_CREATE_ERROR_MESSAGE =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";
const UNSUPPORTED_SOLAR_TERM_YEAR_ERROR_MESSAGE =
  "현재 이 생년월일의 리포트를 생성할 수 없습니다.";
const UNSUPPORTED_SOLAR_TERM_YEAR_FIELD_MESSAGE =
  "현재 이 생년월일의 절기 계산 데이터가 준비되어 있지 않습니다.";

type CreateReportApiErrorSummary = {
  code: "INVALID_REQUEST" | "REPORT_CREATE_FAILED";
  messageKo: string;
};

type CreateReportApiFieldError = Omit<
  ReportRequestValidationError,
  "code"
> & {
  code: ReportRequestValidationError["code"] | "SOLAR_TERM_YEAR_UNSUPPORTED";
};

type CreateReportApiFailureBody = {
  ok: false;
  error: CreateReportApiErrorSummary;
  errors: CreateReportApiFieldError[];
};

type CreateReportApiSuccessBody = Extract<
  CreateReportApiEnvelope["body"],
  { ok: true }
>;

type UnsupportedSolarTermYearResult = {
  readonly ok: false;
  readonly unsupportedSolarTermYear: true;
};

type CreateReportPipelineResult =
  | ReturnType<typeof createReportFromRawInput>
  | UnsupportedSolarTermYearResult
  | null;

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
  messageKo: string = REPORT_CREATE_ERROR_MESSAGE,
): CreateReportApiErrorSummary {
  return {
    code,
    messageKo,
  };
}

function createFallbackValidationError(
  messageKo: string,
): CreateReportApiFieldError {
  return {
    field: "birthDate",
    code: "BIRTH_DATE_REQUIRED",
    messageKo,
  };
}

function createUnsupportedSolarTermYearError(): CreateReportApiFieldError {
  return {
    field: "birthDate",
    code: "SOLAR_TERM_YEAR_UNSUPPORTED",
    messageKo: UNSUPPORTED_SOLAR_TERM_YEAR_FIELD_MESSAGE,
  };
}

function isUnsupportedSolarTermYearResult(
  result: CreateReportPipelineResult,
): result is UnsupportedSolarTermYearResult {
  return (
    result !== null &&
    result.ok === false &&
    "unsupportedSolarTermYear" in result
  );
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
  const result: CreateReportPipelineResult = (() => {
    try {
      return createReportFromRawInput(raw);
    } catch (error) {
      if (error instanceof UnsupportedSolarTermYearError) {
        return {
          ok: false,
          unsupportedSolarTermYear: true,
        } as const;
      }

      return null;
    }
  })();

  if (isUnsupportedSolarTermYearResult(result)) {
    return {
      status: 500,
      body: {
        ok: false,
        error: createErrorSummary(
          "REPORT_CREATE_FAILED",
          UNSUPPORTED_SOLAR_TERM_YEAR_ERROR_MESSAGE,
        ),
        errors: [createUnsupportedSolarTermYearError()],
      },
    };
  }

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
