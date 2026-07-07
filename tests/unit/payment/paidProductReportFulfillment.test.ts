import { describe, expect, it } from "vitest";

import { createInMemoryReportPersistenceAdapter } from "../../../src/lib/persistence/inMemoryReportPersistenceAdapter";
import { fulfillPaidProductReport } from "../../../src/lib/payment/paidProductReportFulfillment";
import type { PaymentOrderRecord } from "../../../src/lib/payment/paymentOrderPersistenceTypes";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import type { ReportWriterRuntime } from "../../../src/lib/report-generation/reportWriterRuntime";

const createdAt = "2099-01-01T00:00:00.000Z";
const paidAt = "2099-01-01T00:10:00.000Z";
const writerRuntimeDisabled: ReportWriterRuntime = {
  enabled: false,
  reason: "flag_disabled",
};

const careerPayload: ReportInputPayload = {
  productKey: "career_money_study",
  productSlug: "career-money-study",
  person: {
    name: "결제테스트",
    birthDate: "1996-12-06",
    birthTime: "08:30",
    birthTimeUnknown: false,
    approximateBirthTimeSlot: "JINSI",
    gender: "MALE",
    mbtiType: "ENTJ",
  },
  userContext: {
    relationshipStatus: "",
    jobStatus: "employee",
    detailJob: "제품 기획자",
    focusAreas: [],
  },
  productOptions: {},
};

function createPaidOrder(
  overrides: Partial<PaymentOrderRecord> = {},
): PaymentOrderRecord {
  return {
    paymentOrderId: "payment_order_paid_fulfillment_test",
    productType: "career_money_study",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    status: "paid",
    inputSnapshot: {
      displayName: careerPayload.person.name,
      birthDate: careerPayload.person.birthDate,
      reportInputPayload: careerPayload,
    },
    providerPaymentId: "payment_key_paid_fulfillment_test",
    providerOrderId: "provider_order_paid_fulfillment_test",
    reportId: null,
    reportGenerationStatus: "not_started",
    createdAt,
    updatedAt: paidAt,
    requestedAt: createdAt,
    paidAt,
    failedAt: null,
    canceledAt: null,
    refundedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

describe("paid product report fulfillment", () => {
  it("generates and stores a paid product preview report with 90 day expiry", async () => {
    const reportAdapter = createInMemoryReportPersistenceAdapter();
    const result = await fulfillPaidProductReport({
      order: createPaidOrder(),
      reportAdapter,
      writerRuntime: writerRuntimeDisabled,
      nowIso: createdAt,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.messageKo);
    }

    expect(result.productPreview.productType).toBe("career_money_study");
    expect(result.expiresAt).toBe("2099-04-01T00:00:00.000Z");

    const stored = await reportAdapter.find({ reportId: result.reportId });

    expect(stored.ok).toBe(true);

    if (!stored.ok) {
      throw new Error(stored.error.messageKo);
    }

    expect(stored.record.snapshotKind).toBe("product_preview");
    expect(stored.record.productPreview.productType).toBe("career_money_study");
    expect(stored.record.status).toBe("paid_unlocked");
    expect(stored.record.accessMode).toBe("paid");
  });

  it("rejects generation before payment is completed", async () => {
    const reportAdapter = createInMemoryReportPersistenceAdapter();
    const result = await fulfillPaidProductReport({
      order: createPaidOrder({
        status: "ready",
        providerPaymentId: null,
        paidAt: null,
      }),
      reportAdapter,
      writerRuntime: writerRuntimeDisabled,
      nowIso: createdAt,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "PAID_REPORT_GENERATION_ORDER_NOT_PAID",
      },
    });
  });

  it("rejects mismatched payment product and input payload", async () => {
    const reportAdapter = createInMemoryReportPersistenceAdapter();
    const result = await fulfillPaidProductReport({
      order: createPaidOrder({
        productType: "saju_mbti_full",
      }),
      reportAdapter,
      writerRuntime: writerRuntimeDisabled,
      nowIso: createdAt,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "PAID_REPORT_GENERATION_PRODUCT_MISMATCH",
      },
    });
  });
});
