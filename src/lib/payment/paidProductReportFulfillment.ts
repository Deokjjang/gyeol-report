import type { ReportPersistenceAdapter } from "../persistence/reportPersistenceAdapter";
import type { PersistedReportRecord } from "../persistence/reportPersistenceTypes";
import {
  createProductGenerationDispatcherOptionsFromWriterRuntime,
  prepareProductGenerationFromPayload,
} from "../report-generation/productGenerationDispatcher";
import {
  createProductPreviewSnapshot,
  type ProductPreviewProductType,
  type ProductPreviewSnapshot,
  type ProductPreviewSnapshotDraft,
  type ReportProductSlug,
} from "../report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "../report-generation/reportInputTypes";
import type { ReportWriterRuntime } from "../report-generation/reportWriterRuntime";
import { buildReportPersistencePayload } from "../report/reportPersistencePayload";
import type { ReportOutput } from "../report/types";
import { getReportProduct } from "./reportProductCatalog";
import type { PaymentOrderRecord } from "./paymentOrderPersistenceTypes";

export type PaidProductReportFulfillmentErrorCode =
  | "PAID_REPORT_GENERATION_ORDER_NOT_PAID"
  | "PAID_REPORT_GENERATION_PAYMENT_INVALID"
  | "PAID_REPORT_GENERATION_INPUT_MISSING"
  | "PAID_REPORT_GENERATION_PRODUCT_MISMATCH"
  | "PAID_REPORT_GENERATION_FAILED"
  | "PAID_REPORT_GENERATION_SNAPSHOT_FAILED"
  | "PAID_REPORT_GENERATION_PERSISTENCE_FAILED";

export type PaidProductReportFulfillmentResult =
  | {
      readonly ok: true;
      readonly reportId: string;
      readonly expiresAt: string;
      readonly productPreview: ProductPreviewSnapshot;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaidProductReportFulfillmentErrorCode;
        readonly messageKo: string;
      };
    };

export type FulfillPaidProductReportInput = {
  readonly order: PaymentOrderRecord;
  readonly reportAdapter: Pick<ReportPersistenceAdapter, "create">;
  readonly writerRuntime: ReportWriterRuntime;
  readonly nowIso?: string;
};

const productPreviewLegacyReport: ReportOutput = {
  version: "v1",
  titleKo: "상품 리포트",
  subtitleKo: "상품 리포트",
  sections: [],
  notices: [],
};

function failure(
  code: PaidProductReportFulfillmentErrorCode,
  messageKo: string,
): PaidProductReportFulfillmentResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
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

function getRecordField(
  value: Record<string, unknown>,
  field: string,
): Record<string, unknown> | undefined {
  const fieldValue = value[field];

  return isRecord(fieldValue) ? fieldValue : undefined;
}

function getReportInputPayload(
  order: PaymentOrderRecord,
): ReportInputPayload | null {
  const payload = order.inputSnapshot.reportInputPayload;

  return isRecord(payload) ? (payload as ReportInputPayload) : null;
}

function getProductPersistenceSeedPerson(
  payload: Record<string, unknown>,
): Record<string, unknown> | undefined {
  return getRecordField(payload, "personA") ?? getRecordField(payload, "person");
}

function addDaysIso(baseIso: string, days: number): string {
  const baseTime = Date.parse(baseIso);
  const safeTime = Number.isNaN(baseTime) ? Date.now() : baseTime;

  return new Date(safeTime + days * 24 * 60 * 60 * 1000).toISOString();
}

function createProductPreviewPersistenceRecord(input: {
  readonly baseRecord: PersistedReportRecord;
  readonly order: PaymentOrderRecord;
  readonly productPreview: ProductPreviewSnapshot;
  readonly expiresAt: string;
}): PersistedReportRecord {
  return {
    ...input.baseRecord,
    status: "paid_unlocked",
    accessMode: "paid",
    expiresAt: input.expiresAt,
    reportVersion: input.productPreview.productVersion,
    reportSnapshot: {
      snapshotKind: "product_preview",
      productPreview: input.productPreview,
      report: productPreviewLegacyReport,
      reportVersion: input.productPreview.productVersion,
      renderVersion: input.productPreview.productVersion,
      createdAt: input.baseRecord.createdAt,
    },
    payment: {
      orderId: input.order.providerOrderId ?? input.order.paymentOrderId,
      provider: input.order.provider,
      providerPaymentId: input.order.providerPaymentId ?? "",
      paymentStatus: "paid",
      amount: input.order.amount,
      currency: input.order.currency,
      ...(input.order.paidAt === null ? {} : { paidAt: input.order.paidAt }),
    },
  };
}

export async function fulfillPaidProductReport(
  input: FulfillPaidProductReportInput,
): Promise<PaidProductReportFulfillmentResult> {
  const product = getReportProduct(input.order.productType);

  if (input.order.status !== "paid") {
    return failure(
      "PAID_REPORT_GENERATION_ORDER_NOT_PAID",
      "결제가 완료된 주문만 리포트를 생성할 수 있습니다.",
    );
  }

  if (
    product === null ||
    input.order.amount !== product.amount ||
    input.order.currency !== product.currency ||
    input.order.providerPaymentId === null
  ) {
    return failure(
      "PAID_REPORT_GENERATION_PAYMENT_INVALID",
      "결제 정보가 리포트 상품 정보와 일치하지 않습니다.",
    );
  }

  const payload = getReportInputPayload(input.order);

  if (payload === null || !isRecord(payload)) {
    return failure(
      "PAID_REPORT_GENERATION_INPUT_MISSING",
      "리포트 생성 입력값을 찾을 수 없습니다.",
    );
  }

  if (payload.productKey !== input.order.productType) {
    return failure(
      "PAID_REPORT_GENERATION_PRODUCT_MISMATCH",
      "결제 상품과 리포트 입력 상품이 일치하지 않습니다.",
    );
  }

  const generationOptions =
    createProductGenerationDispatcherOptionsFromWriterRuntime(
      input.writerRuntime,
    );
  const generationResult = await prepareProductGenerationFromPayload(
    payload,
    generationOptions,
  );

  if (!generationResult.ok) {
    return failure(
      "PAID_REPORT_GENERATION_FAILED",
      "리포트 생성 중 문제가 발생했습니다.",
    );
  }

  const seedPerson = getProductPersistenceSeedPerson(payload);

  if (seedPerson === undefined) {
    return failure(
      "PAID_REPORT_GENERATION_INPUT_MISSING",
      "리포트 생성 기준 인물 정보를 찾을 수 없습니다.",
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
    return failure(
      "PAID_REPORT_GENERATION_INPUT_MISSING",
      "리포트 저장 입력값을 준비하지 못했습니다.",
    );
  }

  const createdAt = input.nowIso ?? payloadResult.input.record.createdAt;
  const expiresAt = addDaysIso(createdAt, 90);
  const productPreviewResult = createProductPreviewSnapshot({
    reportId: payloadResult.input.record.reportId,
    createdAtIso: createdAt,
    productKey: payload.productKey as ProductPreviewProductType,
    productSlug: payload.productSlug as ReportProductSlug,
    draft: generationResult.draft as ProductPreviewSnapshotDraft,
    ...(generationResult.evidencePacket === undefined
      ? {}
      : { evidencePacket: generationResult.evidencePacket }),
  });

  if (!productPreviewResult.ok) {
    return failure(
      "PAID_REPORT_GENERATION_SNAPSHOT_FAILED",
      "리포트 저장 형식을 준비하지 못했습니다.",
    );
  }

  const record = createProductPreviewPersistenceRecord({
    baseRecord: {
      ...payloadResult.input.record,
      createdAt,
      updatedAt: createdAt,
    },
    order: input.order,
    productPreview: productPreviewResult.value,
    expiresAt,
  });
  const createResult = await input.reportAdapter.create({ record });

  if (!createResult.ok) {
    return failure(
      "PAID_REPORT_GENERATION_PERSISTENCE_FAILED",
      "리포트를 저장하지 못했습니다.",
    );
  }

  return {
    ok: true,
    reportId: createResult.record.reportId,
    expiresAt,
    productPreview: productPreviewResult.value,
  };
}
