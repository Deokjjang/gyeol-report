import { hashReportAccessTokenSync } from "../persistence/reportAccessTokenHash";
import {
  createReportAccessToken,
  createReportId,
} from "../persistence/reportPersistenceIds";
import type { CreatePersistedReportInput } from "../persistence/reportPersistenceAdapter";
import type {
  PersistedReportInputSnapshot,
  PersistedReportRecord,
  PersistedReportSnapshot,
  ReportAccessMode,
  ReportPersistenceStatus,
} from "../persistence/reportPersistenceTypes";
import type { ReportOutput } from "./types";

export const REPORT_PERSISTENCE_PAYLOAD_VERSION = "v1" as const;
export const REPORT_CALCULATION_VERSION = "saju-mbti-v1" as const;
export const DEFAULT_REPORT_LOCALE = "ko-KR" as const;
export const REPORT_ACCESS_TOKEN_VERSION = "v1" as const;

export type BuildReportPersistencePayloadInput = {
  readonly birthDate: string;
  readonly birthTime?: string | null;
  readonly birthTimeUnknown?: boolean;
  readonly calendarType: "SOLAR" | "LUNAR";
  readonly timezone?: string;
  readonly gender?: string;
  readonly mbti?: string;
  readonly report: ReportOutput;
  readonly nowIso?: string;
};

export type BuildReportPersistencePayloadResult =
  | {
      readonly ok: true;
      readonly input: CreatePersistedReportInput;
      readonly inputSnapshot: PersistedReportInputSnapshot;
      readonly reportSnapshot: PersistedReportSnapshot;
    }
  | {
      readonly ok: false;
      readonly code:
        | "INVALID_BIRTH_DATE"
        | "INVALID_CALENDAR_TYPE"
        | "INVALID_REPORT"
        | "ACCESS_TOKEN_HASH_UNAVAILABLE";
      readonly messageKo: string;
    };

function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

function isValidCalendarType(
  value: BuildReportPersistencePayloadInput["calendarType"],
): boolean {
  return value === "SOLAR" || value === "LUNAR";
}

function isObjectLike(value: unknown): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function buildReportPersistencePayload(
  input: BuildReportPersistencePayloadInput,
): BuildReportPersistencePayloadResult {
  if (!isNonEmptyString(input.birthDate)) {
    return {
      ok: false,
      code: "INVALID_BIRTH_DATE",
      messageKo: "생년월일을 확인해 주세요.",
    };
  }

  if (!isValidCalendarType(input.calendarType)) {
    return {
      ok: false,
      code: "INVALID_CALENDAR_TYPE",
      messageKo: "달력 구분을 확인해 주세요.",
    };
  }

  if (!isObjectLike(input.report)) {
    return {
      ok: false,
      code: "INVALID_REPORT",
      messageKo: "리포트 생성 결과를 확인해 주세요.",
    };
  }

  const nowIso = input.nowIso ?? new Date().toISOString();
  const accessTokenHashResult = hashReportAccessTokenSync(
    createReportAccessToken(),
  );

  if (!accessTokenHashResult.ok) {
    return {
      ok: false,
      code: "ACCESS_TOKEN_HASH_UNAVAILABLE",
      messageKo: "리포트 접근 정보를 준비하지 못했습니다.",
    };
  }

  const inputSnapshot: PersistedReportInputSnapshot = {
    birthDate: input.birthDate,
    birthTime: input.birthTime ?? null,
    birthTimeUnknown: input.birthTimeUnknown ?? false,
    calendarType: input.calendarType,
    timezone: input.timezone ?? "Asia/Seoul",
    ...(input.gender !== undefined ? { gender: input.gender } : {}),
    ...(input.mbti !== undefined ? { mbti: input.mbti } : {}),
  };
  const reportSnapshot: PersistedReportSnapshot = {
    report: input.report,
    reportVersion: REPORT_PERSISTENCE_PAYLOAD_VERSION,
    renderVersion: REPORT_PERSISTENCE_PAYLOAD_VERSION,
    createdAt: nowIso,
  };
  const status: ReportPersistenceStatus = "generated";
  const accessMode: ReportAccessMode = "preview";
  const record: PersistedReportRecord = {
    reportId: createReportId(),
    createdAt: nowIso,
    updatedAt: nowIso,
    status,
    reportVersion: REPORT_PERSISTENCE_PAYLOAD_VERSION,
    calculationVersion: REPORT_CALCULATION_VERSION,
    locale: DEFAULT_REPORT_LOCALE,
    accessMode,
    accessTokenHash: accessTokenHashResult.hash,
    accessTokenCreatedAt: nowIso,
    accessTokenVersion: REPORT_ACCESS_TOKEN_VERSION,
    inputSnapshot,
    reportSnapshot,
  };

  return {
    ok: true,
    input: {
      record,
    },
    inputSnapshot,
    reportSnapshot,
  };
}
