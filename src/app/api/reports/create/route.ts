import { NextResponse } from "next/server";

import { createReportApiEnvelopeFromJson } from "../../../../lib/api/createReport";
import type { CreatePersistedReportInput } from "../../../../lib/persistence/reportPersistenceAdapter";
import { createReportPersistenceRuntime } from "../../../../lib/persistence/reportPersistenceRuntime";
import type { PersistedReportRecord } from "../../../../lib/persistence/reportPersistenceTypes";
import {
  createProductPreviewSnapshot,
  type ProductPreviewProductType,
  type ProductPreviewSnapshot,
  type ProductPreviewSnapshotDraft,
  type ReportProductSlug,
} from "../../../../lib/report-generation/productPreviewSnapshot";
import {
  createProductGenerationDispatcherOptionsFromWriterRuntime,
  prepareProductGenerationFromPayload,
} from "../../../../lib/report-generation/productGenerationDispatcher";
import { buildReportPersistencePayload } from "../../../../lib/report/reportPersistencePayload";
import type { ReportOutput } from "../../../../lib/report/types";
import { resolveReportWriterRuntime } from "../../../../lib/report-generation/reportWriterRuntime";

const REPORT_CREATE_ERROR_MESSAGE =
  "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.";
const REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE =
  "리포트 저장 준비에 실패했습니다.";
const REPORT_PERSISTENCE_RUNTIME_FAILED_MESSAGE =
  "리포트 저장 환경을 준비하지 못했습니다.";
const REPORT_PERSISTENCE_CREATE_FAILED_MESSAGE =
  "리포트를 저장하지 못했습니다.";
const PRODUCT_PREVIEW_SNAPSHOT_FAILED_MESSAGE =
  "리포트 저장 형식을 준비하지 못했습니다.";
const PRODUCT_PREVIEW_CREATE_FAILED_MESSAGE =
  "리포트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
const previewReportIdByRequestKey = new Map<string, string>();

type ReportPersistenceRouteErrorCode =
  | "REPORT_PERSISTENCE_PAYLOAD_FAILED"
  | "REPORT_PERSISTENCE_RUNTIME_FAILED"
  | "REPORT_PERSISTENCE_CREATE_FAILED"
  | "PRODUCT_PREVIEW_SNAPSHOT_FAILED";

type ProductPreviewFailureCode =
  | "INVALID_REPORT_INPUT"
  | "PRODUCT_GENERATION_NOT_IMPLEMENTED"
  | "PRODUCT_GENERATION_FAILED"
  | "COMPATIBILITY_GENERATION_FAILED"
  | "COMPATIBILITY_DRAFT_INVALID"
  | "PRODUCT_PREVIEW_SNAPSHOT_FAILED"
  | "REPORT_PERSISTENCE_PAYLOAD_FAILED"
  | "REPORT_PERSISTENCE_RUNTIME_FAILED"
  | "REPORT_PERSISTENCE_CREATE_FAILED";

const productPreviewLegacyReport: ReportOutput = {
  version: "v1",
  titleKo: "상품 리포트",
  subtitleKo: "상품 리포트",
  sections: [],
  notices: [],
};

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

function getRecordField(
  value: Record<string, unknown>,
  field: string,
): Record<string, unknown> | undefined {
  const fieldValue = value[field];

  return isJsonObject(fieldValue) ? fieldValue : undefined;
}

function isProductReportInputPayload(value: unknown): value is Record<string, unknown> {
  if (!isJsonObject(value)) {
    return false;
  }

  return (
    typeof value.productKey === "string" &&
    typeof value.productSlug === "string"
  );
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

function createProductPreviewFailureResponse(
  code: ProductPreviewFailureCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      code,
      message: createPublicProductPreviewFailureMessage(message),
    },
    { status },
  );
}

function createPublicProductPreviewFailureMessage(message: string): string {
  if (message === PRODUCT_GENERATION_NOT_IMPLEMENTED_MESSAGE) {
    return PRODUCT_GENERATION_NOT_IMPLEMENTED_MESSAGE;
  }

  return PRODUCT_PREVIEW_CREATE_FAILED_MESSAGE;
}

const PRODUCT_GENERATION_NOT_IMPLEMENTED_MESSAGE =
  "현재 제공되지 않는 리포트입니다.";

function getProductPersistenceSeedPerson(
  json: Record<string, unknown>,
): Record<string, unknown> | undefined {
  return getRecordField(json, "personA") ?? getRecordField(json, "person");
}

function createProductPreviewPersistenceInput(
  baseInput: CreatePersistedReportInput,
  productPreview: ProductPreviewSnapshot,
): CreatePersistedReportInput {
  const record: PersistedReportRecord = {
    ...baseInput.record,
    reportVersion: productPreview.productVersion,
    reportSnapshot: {
      snapshotKind: "product_preview",
      productPreview,
      report: productPreviewLegacyReport,
      reportVersion: productPreview.productVersion,
      renderVersion: productPreview.productVersion,
      createdAt: baseInput.record.createdAt,
    },
  };

  return {
    record,
  };
}

async function createProductPreviewResponse(
  json: Record<string, unknown>,
): Promise<NextResponse> {
  const generationOptions =
    createProductGenerationDispatcherOptionsFromWriterRuntime(
      resolveReportWriterRuntime(),
    );
  const generationResult = await prepareProductGenerationFromPayload(
    json,
    generationOptions,
  );

  if (!generationResult.ok) {
    const code = generationResult.error.code;

    if (code === "PRODUCT_GENERATION_NOT_IMPLEMENTED") {
      return createProductPreviewFailureResponse(
        code,
        PRODUCT_GENERATION_NOT_IMPLEMENTED_MESSAGE,
        501,
      );
    }

    if (code === "INVALID_REPORT_INPUT") {
      return createProductPreviewFailureResponse(
        code,
        generationResult.error.message,
        400,
      );
    }

    return createProductPreviewFailureResponse(
      "PRODUCT_GENERATION_FAILED",
      generationResult.error.message,
      500,
    );
  }

  const seedPerson = getProductPersistenceSeedPerson(json);

  if (seedPerson === undefined) {
    return createProductPreviewFailureResponse(
      "INVALID_REPORT_INPUT",
      "Invalid report input: missing product person payload.",
      400,
    );
  }

  const payloadResult = buildReportPersistencePayload({
    birthDate: getStringField(seedPerson, "birthDate") ?? "",
    birthTime: getStringField(seedPerson, "birthTime") ?? null,
    birthTimeUnknown: getBooleanField(seedPerson, "birthTimeUnknown"),
    calendarType: "SOLAR",
    timezone: "Asia/Seoul",
    gender: getStringField(seedPerson, "gender"),
    mbti: getStringField(seedPerson, "mbtiType"),
    report: productPreviewLegacyReport,
  });

  if (!payloadResult.ok) {
    return createProductPreviewFailureResponse(
      "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      REPORT_PERSISTENCE_PAYLOAD_FAILED_MESSAGE,
      500,
    );
  }

  const requestKey = createPreviewReportIdRequestKey(json);
  const cachedReportId = previewReportIdByRequestKey.get(requestKey);
  const reportId = cachedReportId ?? payloadResult.input.record.reportId;
  const productPreviewResult = createProductPreviewSnapshot({
    reportId,
    createdAtIso: payloadResult.input.record.createdAt,
    productKey: json.productKey as ProductPreviewProductType,
    productSlug: json.productSlug as ReportProductSlug,
    draft: generationResult.draft as ProductPreviewSnapshotDraft,
    ...(generationResult.evidencePacket === undefined
      ? {}
      : { evidencePacket: generationResult.evidencePacket }),
  });

  if (!productPreviewResult.ok) {
    return createProductPreviewFailureResponse(
      "PRODUCT_PREVIEW_SNAPSHOT_FAILED",
      PRODUCT_PREVIEW_SNAPSHOT_FAILED_MESSAGE,
      500,
    );
  }

  const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });

  if (!runtime.ok) {
    return createProductPreviewFailureResponse(
      "REPORT_PERSISTENCE_RUNTIME_FAILED",
      REPORT_PERSISTENCE_RUNTIME_FAILED_MESSAGE,
      500,
    );
  }

  const createInput = createProductPreviewPersistenceInput(
    withReportId(payloadResult.input, reportId),
    productPreviewResult.value,
  );
  const createResult = await runtime.adapter.create(createInput);

  if (!createResult.ok) {
    return createProductPreviewFailureResponse(
      "REPORT_PERSISTENCE_CREATE_FAILED",
      REPORT_PERSISTENCE_CREATE_FAILED_MESSAGE,
      500,
    );
  }

  previewReportIdByRequestKey.set(requestKey, createResult.record.reportId);

  return NextResponse.json(
    {
      ok: true,
      reportId: createResult.record.reportId,
      snapshotKind: "product_preview",
      productPreview: productPreviewResult.value,
    },
    { status: 200 },
  );
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

  if (isProductReportInputPayload(json)) {
    return createProductPreviewResponse(json);
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
