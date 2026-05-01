import type { ReportOutput } from "../report/types";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
} from "../validation/types";

export type CreateReportApiRequest = ReportRequestRawInput;

export type CreateReportApiSuccessResponse = {
  ok: true;
  report: ReportOutput;
};

export type CreateReportApiErrorResponse = {
  ok: false;
  errors: ReportRequestValidationError[];
};

export type CreateReportApiResponse =
  | CreateReportApiSuccessResponse
  | CreateReportApiErrorResponse;

export type CreateReportApiErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

export type CreateReportApiHttpStatus = 200 | 400 | 500;

export type CreateReportApiEnvelope = {
  status: CreateReportApiHttpStatus;
  body: CreateReportApiResponse;
};
