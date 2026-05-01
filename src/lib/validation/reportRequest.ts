import { MBTI_TYPES, type MbtiType } from "../mbti/types";
import type { SajuCalcInput } from "../saju/types";
import type {
  ReportRequestRawInput,
  ReportRequestValidationError,
  ReportRequestValidationResult,
} from "./types";

function createError(
  field: ReportRequestValidationError["field"],
  code: ReportRequestValidationError["code"],
  messageKo: string,
): ReportRequestValidationError {
  return {
    field,
    code,
    messageKo,
  };
}

function isLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function isStrictDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) {
    return false;
  }

  const daysByMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ] as const;
  const maxDay = daysByMonth[month - 1];

  return day >= 1 && day <= maxDay;
}

function isStrictTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function isMbtiType(value: string): value is MbtiType {
  return MBTI_TYPES.some((type) => type === value);
}

function isSupportedGender(value: string): value is "MALE" | "FEMALE" {
  return value === "MALE" || value === "FEMALE";
}

export function validateReportRequest(
  raw: ReportRequestRawInput,
): ReportRequestValidationResult {
  const errors: ReportRequestValidationError[] = [];

  let birthDate: string | undefined;
  let birthTimeUnknown: boolean | undefined;
  let birthTime: string | undefined;
  let gender: "MALE" | "FEMALE" | undefined;
  let mbtiType: MbtiType | undefined;

  if (typeof raw.birthDate !== "string") {
    errors.push(
      createError(
        "birthDate",
        "BIRTH_DATE_REQUIRED",
        "생년월일을 입력해 주세요.",
      ),
    );
  } else if (!isStrictDate(raw.birthDate)) {
    errors.push(
      createError(
        "birthDate",
        "BIRTH_DATE_INVALID",
        "생년월일 형식이 올바르지 않습니다.",
      ),
    );
  } else {
    birthDate = raw.birthDate;
  }

  if (typeof raw.birthTimeUnknown !== "boolean") {
    errors.push(
      createError(
        "birthTimeUnknown",
        "BIRTH_TIME_UNKNOWN_INVALID",
        "출생시간 확인 여부가 올바르지 않습니다.",
      ),
    );
  } else {
    birthTimeUnknown = raw.birthTimeUnknown;
  }

  if (raw.birthTimeUnknown === false) {
    if (typeof raw.birthTime !== "string") {
      errors.push(
        createError(
          "birthTime",
          "BIRTH_TIME_REQUIRED",
          "출생시간을 입력해 주세요.",
        ),
      );
    } else if (!isStrictTime(raw.birthTime)) {
      errors.push(
        createError(
          "birthTime",
          "BIRTH_TIME_INVALID",
          "출생시간 형식이 올바르지 않습니다.",
        ),
      );
    } else {
      birthTime = raw.birthTime;
    }
  }

  if (typeof raw.calendarType !== "string") {
    errors.push(
      createError(
        "calendarType",
        "CALENDAR_TYPE_REQUIRED",
        "양력/음력 선택이 필요합니다.",
      ),
    );
  } else if (raw.calendarType !== "SOLAR") {
    errors.push(
      createError(
        "calendarType",
        "CALENDAR_TYPE_UNSUPPORTED",
        "V1에서는 양력만 지원합니다.",
      ),
    );
  }

  if (typeof raw.gender !== "string") {
    errors.push(
      createError("gender", "GENDER_REQUIRED", "성별 선택이 필요합니다."),
    );
  } else if (!isSupportedGender(raw.gender)) {
    errors.push(
      createError("gender", "GENDER_INVALID", "성별 값이 올바르지 않습니다."),
    );
  } else {
    gender = raw.gender;
  }

  if (typeof raw.timezone !== "string") {
    errors.push(
      createError("timezone", "TIMEZONE_REQUIRED", "시간대 정보가 필요합니다."),
    );
  } else if (raw.timezone !== "Asia/Seoul") {
    errors.push(
      createError(
        "timezone",
        "TIMEZONE_UNSUPPORTED",
        "현재는 Asia/Seoul 시간대만 지원합니다.",
      ),
    );
  }

  if (typeof raw.mbtiType !== "string") {
    errors.push(
      createError(
        "mbtiType",
        "MBTI_TYPE_REQUIRED",
        "MBTI 유형을 선택해 주세요.",
      ),
    );
  } else if (!isMbtiType(raw.mbtiType)) {
    errors.push(
      createError(
        "mbtiType",
        "MBTI_TYPE_INVALID",
        "MBTI 유형이 올바르지 않습니다.",
      ),
    );
  } else {
    mbtiType = raw.mbtiType;
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  if (
    birthDate === undefined ||
    birthTimeUnknown === undefined ||
    gender === undefined ||
    mbtiType === undefined
  ) {
    return {
      ok: false,
      errors,
    };
  }

  const sajuInput: SajuCalcInput = birthTimeUnknown
    ? {
        birthDate,
        birthTimeUnknown,
        calendarType: "SOLAR",
        gender,
        timezone: "Asia/Seoul",
      }
    : {
        birthDate,
        birthTime,
        birthTimeUnknown,
        calendarType: "SOLAR",
        gender,
        timezone: "Asia/Seoul",
      };

  return {
    ok: true,
    value: {
      sajuInput,
      mbtiType,
    },
    errors: [],
  };
}
