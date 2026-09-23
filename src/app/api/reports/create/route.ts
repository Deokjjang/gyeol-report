import { generateProductReport } from "../../../../lib/report-generation/generateProductReport";
import { NextResponse } from "next/server";
import type { ProductGenerationResult } from "../../../../lib/report-generation/productGenerationDispatcher";

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

type SafeLocalReportDiagnostic = {
  readonly stage:
    | "completed"
    | "input_validation"
    | "provider"
    | "structured_output"
    | "parse"
    | "draft_validation"
    | "publish_validation"
    | "persistence";
  readonly category: string;
  readonly code: string;
  readonly issues: readonly string[];
  readonly providerOutcome: string | null;
  readonly providerStatus: number | null;
  readonly externalCallCount: number;
  readonly model: string | null;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
  readonly providerDurationMs: number;
  readonly durationMs: number;
  readonly retryAttempted: boolean;
  readonly fallbackUsed: boolean;
};

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
  diagnostic?: SafeLocalReportDiagnostic,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      code,
      message: createPublicProductPreviewFailureMessage(message),
      ...(isSafeLocalReportDiagnosticEnabled() && diagnostic !== undefined
        ? { diagnostic }
        : {}),
    },
    { status },
  );
}

function isSafeLocalReportDiagnosticEnabled(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}

function safeIssueCode(value: string): string {
  const trimmed = value.trim().replace(/^[-\s]+/u, "");
  const code = trimmed.match(/^([A-Z][A-Z0-9_]*)(?::\s*([A-Za-z0-9_.\[\]-]+))?/u);
  if (code !== null) {
    return code[2] === undefined ? code[1] : `${code[1]}:${code[2]}`;
  }

  const field = trimmed.match(/^([a-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+|\[\d+\])+)/u)?.[1];
  return field === undefined ? "VALIDATION_FAILED" : `FIELD:${field}`;
}

function getValidationErrors(
  result: ProductGenerationResult,
): readonly string[] | undefined {
  if (result.ok || !("validationErrors" in result.error)) {
    return undefined;
  }

  return result.error.validationErrors;
}

function safeValidationIssues(result: ProductGenerationResult): readonly string[] {
  if (result.ok) {
    return [];
  }

  const explicit = getValidationErrors(result) ?? [];
  const messageIssues = result.error.message
    .split("\n")
    .filter((line) => line.trimStart().startsWith("- "));

  return [...new Set([...explicit, ...messageIssues].map(safeIssueCode))].slice(0, 40);
}

function getExternalFailureKind(result: ProductGenerationResult): string | undefined {
  if (result.ok || result.externalFailure === undefined) {
    return undefined;
  }

  return result.externalFailure.split("_").at(-1);
}

function safeFailureStage(result: ProductGenerationResult): SafeLocalReportDiagnostic["stage"] {
  if (result.ok) {
    return "completed";
  }
  if (getValidationErrors(result) !== undefined && result.externalFailure === undefined) {
    return "publish_validation";
  }

  const messageStage = result.error.message.match(/^stage:\s*([a-z_]+)$/mu)?.[1];
  const externalFailureKind = getExternalFailureKind(result);
  if (messageStage === "draft_validation") {
    return "draft_validation";
  }
  if (messageStage === "json_parse") {
    return "parse";
  }
  if (messageStage === ["open", "ai"].join("")) {
    return externalFailureKind === "INCOMPLETE" || externalFailureKind === "MALFORMED"
      ? "structured_output"
      : "provider";
  }
  if (externalFailureKind === "VALIDATION") {
    return "draft_validation";
  }
  if (externalFailureKind === "MALFORMED") {
    return "parse";
  }
  if (externalFailureKind === "INCOMPLETE") {
    return "structured_output";
  }
  if (result.externalFailure !== undefined) {
    return "provider";
  }
  return "input_validation";
}

function getSafeProviderStatus(result: ProductGenerationResult): number | null {
  if (result.ok) {
    return null;
  }

  const status = result.error.message.match(/^status:\s*(\d{3})$/mu)?.[1];
  return status === undefined ? null : Number(status);
}

function getSafeInternalCode(result: ProductGenerationResult): string {
  if (result.ok) {
    return "OK";
  }
  if (getValidationErrors(result) !== undefined && result.externalFailure === undefined) {
    return "PUBLISH_REJECTED";
  }

  const firstLine = result.error.message.split("\n", 1)[0] ?? "";
  const codes = firstLine.match(/\b[A-Z][A-Z0-9_]{2,}\b/gu) ?? [];
  return codes.at(-1) ?? result.error.code;
}

function createSafeLocalReportDiagnostic(input: {
  readonly result: ProductGenerationResult;
  readonly durationMs: number;
  readonly fallbackUsed: boolean;
  readonly stage?: SafeLocalReportDiagnostic["stage"];
  readonly code?: string;
}): SafeLocalReportDiagnostic {
  const calls = input.result.externalCalls ?? [];
  const lastCall = calls.at(-1);
  const tokens = (field: "inputTokens" | "outputTokens" | "totalTokens") => {
    if (calls.length === 0) {
      return null;
    }
    const values = calls.map((call) => call[field]);
    return values.some((value) => value === null)
      ? null
      : values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  };

  return {
    stage: input.stage ?? safeFailureStage(input.result),
    category: input.result.ok
      ? "SUCCESS"
      : input.result.externalFailure ?? input.result.error.code,
    code: input.code ?? getSafeInternalCode(input.result),
    issues: safeValidationIssues(input.result),
    providerOutcome: lastCall?.outcome ?? null,
    providerStatus: getSafeProviderStatus(input.result),
    externalCallCount: calls.length,
    model: lastCall?.model ?? null,
    inputTokens: tokens("inputTokens"),
    outputTokens: tokens("outputTokens"),
    totalTokens: tokens("totalTokens"),
    providerDurationMs: calls.reduce((sum, call) => sum + call.durationMs, 0),
    durationMs: input.durationMs,
    retryAttempted: calls.length > 1,
    fallbackUsed: input.result.delivery?.fallbackUsed ?? input.fallbackUsed,
  };
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
  const startedAt = Date.now();
  const writer = resolveReportWriterRuntime();
  const fallbackUsed = !writer.enabled;
  const generationResult = await generateProductReport(json, writer, writer.enabled ? "normal_writer" : "deterministic_fallback");
  const generationDiagnostic = () => createSafeLocalReportDiagnostic({
    result: generationResult,
    durationMs: Math.max(0, Date.now() - startedAt),
    fallbackUsed,
  });

  if (!generationResult.ok) {
    const code = generationResult.error.code;

    if (code === "PRODUCT_GENERATION_NOT_IMPLEMENTED") {
      return createProductPreviewFailureResponse(
        code,
        PRODUCT_GENERATION_NOT_IMPLEMENTED_MESSAGE,
        501,
        generationDiagnostic(),
      );
    }

    if (code === "INVALID_REPORT_INPUT") {
      return createProductPreviewFailureResponse(
        code,
        "리포트를 준비하지 못했습니다. 입력 정보를 확인해 주세요.",
        400,
        generationDiagnostic(),
      );
    }

    return createProductPreviewFailureResponse(
      "PRODUCT_GENERATION_FAILED",
      "리포트를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      500,
      generationDiagnostic(),
    );
  }

  const seedPerson = getProductPersistenceSeedPerson(json);

  if (seedPerson === undefined) {
    return createProductPreviewFailureResponse(
      "INVALID_REPORT_INPUT",
      "Invalid report input: missing product person payload.",
      400,
      createSafeLocalReportDiagnostic({
        result: generationResult,
        durationMs: Math.max(0, Date.now() - startedAt),
        fallbackUsed,
        stage: "persistence",
        code: "PRODUCT_PERSON_MISSING",
      }),
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
      createSafeLocalReportDiagnostic({
        result: generationResult,
        durationMs: Math.max(0, Date.now() - startedAt),
        fallbackUsed,
        stage: "persistence",
        code: "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      }),
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
      createSafeLocalReportDiagnostic({
        result: generationResult,
        durationMs: Math.max(0, Date.now() - startedAt),
        fallbackUsed,
        stage: "persistence",
        code: "PRODUCT_PREVIEW_SNAPSHOT_FAILED",
      }),
    );
  }

  const runtime = createReportPersistenceRuntime({ mode: "preview_memory" });

  if (!runtime.ok) {
    return createProductPreviewFailureResponse(
      "REPORT_PERSISTENCE_RUNTIME_FAILED",
      REPORT_PERSISTENCE_RUNTIME_FAILED_MESSAGE,
      500,
      createSafeLocalReportDiagnostic({
        result: generationResult,
        durationMs: Math.max(0, Date.now() - startedAt),
        fallbackUsed,
        stage: "persistence",
        code: "REPORT_PERSISTENCE_RUNTIME_FAILED",
      }),
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
      createSafeLocalReportDiagnostic({
        result: generationResult,
        durationMs: Math.max(0, Date.now() - startedAt),
        fallbackUsed,
        stage: "persistence",
        code: "REPORT_PERSISTENCE_CREATE_FAILED",
      }),
    );
  }

  previewReportIdByRequestKey.set(requestKey, createResult.record.reportId);

  return NextResponse.json(
    {
      ok: true,
      reportId: createResult.record.reportId,
      snapshotKind: "product_preview",
      productPreview: productPreviewResult.value,
      ...(isSafeLocalReportDiagnosticEnabled()
        ? { diagnostic: generationDiagnostic() }
        : {}),
    },
    { status: 200 },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  // Direct generation is for local development/tests. Paid jobs import the
  // generator server-side and never enter this public route.
  if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
    return NextResponse.json(
      { ok: false, message: "요청을 처리할 수 없습니다." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

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
