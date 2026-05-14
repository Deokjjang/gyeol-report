import { NextResponse } from "next/server";

import { createReportApiEnvelopeFromJson } from "../../../../lib/api/createReport";
import type { CreatePersistedReportInput } from "../../../../lib/persistence/reportPersistenceAdapter";
import { createReportPersistenceRuntime } from "../../../../lib/persistence/reportPersistenceRuntime";
import { buildReportPersistencePayload } from "../../../../lib/report/reportPersistencePayload";

const REPORT_CREATE_ERROR_MESSAGE =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";
const REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE =
  "리포트 저장 준비에 실패했습니다.";
const REPORT_PERSISTENCE_RUNTIME_FAILED_MESSAGE =
  "리포트 저장 환경을 준비하지 못했습니다.";
const REPORT_PERSISTENCE_CREATE_FAILED_MESSAGE =
  "리포트를 저장하지 못했습니다.";
const previewReportIdByRequestKey = new Map<string, string>();

type ReportPersistenceRouteErrorCode =
  | "REPORT_PERSISTENCE_PAYLOAD_FAILED"
  | "REPORT_PERSISTENCE_RUNTIME_FAILED"
  | "REPORT_PERSISTENCE_CREATE_FAILED";

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringField(
  value: Record<string, unknown>,
  field: string,
): string | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function getBooleanField(
  value: Record<string, unknown>,
  field: string,
): boolean | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "boolean" ? fieldValue : undefined;
}

function getCalendarTypeField(
  value: Record<string, unknown>,
): "SOLAR" | "LUNAR" | undefined {
  const calendarType = value.calendarType;

  return calendarType === "SOLAR" || calendarType === "LUNAR"
    ? calendarType
    : undefined;
}

function createPersistenceFailureResponse(
  code: ReportPersistenceRouteErrorCode,
  messageKo: string,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        messageKo,
      },
      errors: [],
    },
    { status: 500 },
  );
}

function createPreviewReportIdRequestKey(json: Record<string, unknown>): string {
  return JSON.stringify(json);
}

function withReportId(
  input: CreatePersistedReportInput,
  reportId: string,
): CreatePersistedReportInput {
  return {
    record: {
      ...input.record,
      reportId,
    },
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_REQUEST",
          messageKo: REPORT_CREATE_ERROR_MESSAGE,
        },
        errors: [
          {
            field: "birthDate",
            code: "BIRTH_DATE_REQUIRED",
            messageKo: REPORT_CREATE_ERROR_MESSAGE,
          },
        ],
      },
      { status: 400 },
    );
  }

  const envelope = createReportApiEnvelopeFromJson(json);

  if (!envelope.body.ok) {
    return NextResponse.json(envelope.body, {
      status: envelope.status,
    });
  }

  if (!isJsonObject(json)) {
    return createPersistenceFailureResponse(
      "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE,
    );
  }

  const calendarType = getCalendarTypeField(json);

  if (calendarType === undefined) {
    return createPersistenceFailureResponse(
      "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE,
    );
  }

  const payloadResult = buildReportPersistencePayload({
    birthDate: getStringField(json, "birthDate") ?? "",
    birthTime: getStringField(json, "birthTime") ?? null,
    birthTimeUnknown: getBooleanField(json, "birthTimeUnknown"),
    calendarType,
    timezone: getStringField(json, "timezone"),
    gender: getStringField(json, "gender"),
    mbti: getStringField(json, "mbtiType"),
    report: envelope.body.report,
  });

  if (!payloadResult.ok) {
    return createPersistenceFailureResponse(
      "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE,
    );
  }

  const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });

  if (!runtime.ok) {
    return createPersistenceFailureResponse(
      "REPORT_PERSISTENCE_RUNTIME_FAILED",
      REPORT_PERSISTENCE_RUNTIME_FAILED_MESSAGE,
    );
  }

  const requestKey = createPreviewReportIdRequestKey(json);
  const cachedReportId = previewReportIdByRequestKey.get(requestKey);
  const createInput =
    cachedReportId === undefined
      ? payloadResult.input
      : withReportId(payloadResult.input, cachedReportId);
  const createResult = await runtime.adapter.create(createInput);

  if (!createResult.ok) {
    return createPersistenceFailureResponse(
      "REPORT_PERSISTENCE_CREATE_FAILED",
      REPORT_PERSISTENCE_CREATE_FAILED_MESSAGE,
    );
  }

  previewReportIdByRequestKey.set(requestKey, createResult.record.reportId);

  return NextResponse.json(
    {
      ...envelope.body,
      reportId: createResult.record.reportId,
    },
    {
      status: envelope.status,
    },
  );
}
