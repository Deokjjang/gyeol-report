import type { MbtiType } from "../mbti/types";
import type { SajuCalcInput } from "../saju/types";

export type ReportRequestRawInput = {
  birthDate?: unknown;
  birthTime?: unknown;
  birthTimeUnknown?: unknown;
  calendarType?: unknown;
  gender?: unknown;
  timezone?: unknown;
  mbtiType?: unknown;
};

export type ReportRequestValidationErrorCode =
  | "BIRTH_DATE_REQUIRED"
  | "BIRTH_DATE_INVALID"
  | "BIRTH_TIME_REQUIRED"
  | "BIRTH_TIME_INVALID"
  | "BIRTH_TIME_UNKNOWN_INVALID"
  | "CALENDAR_TYPE_REQUIRED"
  | "CALENDAR_TYPE_UNSUPPORTED"
  | "GENDER_REQUIRED"
  | "GENDER_INVALID"
  | "TIMEZONE_REQUIRED"
  | "TIMEZONE_UNSUPPORTED"
  | "MBTI_TYPE_REQUIRED"
  | "MBTI_TYPE_INVALID";

export type ReportRequestValidationError = {
  field:
    | "birthDate"
    | "birthTime"
    | "birthTimeUnknown"
    | "calendarType"
    | "gender"
    | "timezone"
    | "mbtiType";
  code: ReportRequestValidationErrorCode;
  messageKo: string;
};

export type ValidatedReportRequest = {
  sajuInput: SajuCalcInput;
  mbtiType: MbtiType;
};

export type ReportRequestValidationResult =
  | {
      ok: true;
      value: ValidatedReportRequest;
      errors: [];
    }
  | {
      ok: false;
      value?: undefined;
      errors: ReportRequestValidationError[];
    };
