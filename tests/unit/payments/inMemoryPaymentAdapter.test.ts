import { describe, expect, it } from "vitest";

import { createInMemoryPaymentAdapter } from "@/lib/payments/inMemoryPaymentAdapter";
import type { PaymentOrder } from "@/lib/payments/paymentTypes";

const createdAt = "2026-01-01T00:00:00.000Z";
const laterAt = "2026-01-02T00:00:00.000Z";

function createOrder(overrides: Partial<PaymentOrder> = {}): PaymentOrder {
  return {
    orderId: "order_abcdefghijklmnop",
    reportId: "report_abcdefghijklmn",
    productCode: "gyeol_report_full_v1",
    provider: "manual",
    amount: {
      value: 990,
      currency: "KRW",
    },
    status: "ready",
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

describe("createInMemoryPaymentAdapter", () => {
  it("creates a payment session", async () => {
    const adapter = createInMemoryPaymentAdapter();
    const result = await adapter.createSession({
      reportId: "report_abcdefghijklmn",
      productCode: "gyeol_report_full_v1",
      provider: "manual",
      amount: {
        value: 990,
        currency: "KRW",
      },
      successUrl: "https://example.com/success",
      failureUrl: "https://example.com/failure",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.orderId.startsWith("order_")).toBe(true);
      expect(result.order.reportId).toBe("report_abcdefghijklmn");
      expect(result.order.productCode).toBe("gyeol_report_full_v1");
      expect(result.order.provider).toBe("manual");
      expect(result.order.amount).toEqual({
        value: 990,
        currency: "KRW",
      });
      expect(result.order.status).toBe("ready");
    }
  });

  it("confirms payment successfully", async () => {
    const order = createOrder();
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.confirm({
      orderId: order.orderId,
      provider: order.provider,
      providerPaymentId: "provider_payment_1",
      amountValue: order.amount.value,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.status).toBe("paid");
      expect(result.order.providerPaymentId).toBe("provider_payment_1");
      expect(result.order.paidAt).toBeTruthy();
    }
  });

  it("rejects confirm for missing order", async () => {
    const adapter = createInMemoryPaymentAdapter();
    const result = await adapter.confirm({
      orderId: "order_missingmissing",
      provider: "manual",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_REPORT_NOT_FOUND");
    }
  });

  it("rejects confirm for already paid order", async () => {
    const order = createOrder({
      status: "paid",
      paidAt: laterAt,
    });
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.confirm({
      orderId: order.orderId,
      provider: order.provider,
      amountValue: order.amount.value,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_ALREADY_PROCESSED");
    }
  });

  it("rejects confirm amount mismatch", async () => {
    const order = createOrder();
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.confirm({
      orderId: order.orderId,
      provider: order.provider,
      amountValue: 1290,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_AMOUNT_MISMATCH");
    }
  });

  it("cancels ready payment", async () => {
    const order = createOrder();
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.cancel({
      orderId: order.orderId,
      provider: order.provider,
      reasonKo: "사용자 요청",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.status).toBe("cancelled");
      expect(result.order.cancelledAt).toBeTruthy();
      expect(result.order.failureCode).toBe("PAYMENT_CANCELLED_BY_USER");
      expect(result.order.failureMessageKo).toBe("사용자 요청");
    }
  });

  it("rejects cancel for paid order", async () => {
    const order = createOrder({
      status: "paid",
      paidAt: laterAt,
    });
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.cancel({
      orderId: order.orderId,
      provider: order.provider,
      reasonKo: "사용자 요청",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_ALREADY_PROCESSED");
    }
  });

  it("refunds paid payment", async () => {
    const order = createOrder({
      status: "paid",
      paidAt: laterAt,
    });
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.refund({
      orderId: order.orderId,
      provider: order.provider,
      reasonKo: "고객지원 처리",
      amountValue: order.amount.value,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.status).toBe("refunded");
      expect(result.order.refundedAt).toBeTruthy();
      expect(result.order.failureMessageKo).toBe("고객지원 처리");
    }
  });

  it("rejects refund for non-paid order", async () => {
    const order = createOrder();
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.refund({
      orderId: order.orderId,
      provider: order.provider,
      reasonKo: "고객지원 처리",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_AUTH_FAILED");
    }
  });

  it("rejects refund amount mismatch", async () => {
    const order = createOrder({
      status: "paid",
      paidAt: laterAt,
    });
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.refund({
      orderId: order.orderId,
      provider: order.provider,
      reasonKo: "고객지원 처리",
      amountValue: 1290,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_AMOUNT_MISMATCH");
    }
  });

  it("finds payment order", async () => {
    const order = createOrder();
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.find({ orderId: order.orderId });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.orderId).toBe(order.orderId);
    }
  });

  it("rejects provider mismatch in find", async () => {
    const order = createOrder({
      provider: "manual",
    });
    const adapter = createInMemoryPaymentAdapter([order]);
    const result = await adapter.find({
      orderId: order.orderId,
      provider: "paddle",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("PAYMENT_LOOKUP_FAILED");
    }
  });

  it("lists public summaries with filters and limit", async () => {
    const first = createOrder({
      orderId: "order_aaaaaaaaaaaaaaaa",
      reportId: "report_aaaaaaaaaaaaaa",
      status: "ready",
      provider: "manual",
    });
    const second = createOrder({
      orderId: "order_bbbbbbbbbbbbbbbb",
      reportId: "report_aaaaaaaaaaaaaa",
      status: "paid",
      provider: "paddle",
      failureMessageKo: "internal note",
    });
    const third = createOrder({
      orderId: "order_cccccccccccccccc",
      reportId: "report_bbbbbbbbbbbbbb",
      status: "paid",
      provider: "manual",
    });
    const fourth = createOrder({
      orderId: "order_dddddddddddddddd",
      reportId: "report_bbbbbbbbbbbbbb",
      status: "failed",
      provider: "paddle",
    });
    const adapter = createInMemoryPaymentAdapter([
      first,
      second,
      third,
      fourth,
    ]);

    const all = await adapter.list({});
    const byReportId = await adapter.list({ reportId: first.reportId });
    const byStatus = await adapter.list({ status: "paid" });
    const byProvider = await adapter.list({ provider: "paddle" });
    const limited = await adapter.list({ limit: 2 });

    expect(all.map((summary) => summary.orderId)).toEqual([
      first.orderId,
      second.orderId,
      third.orderId,
      fourth.orderId,
    ]);
    expect(byReportId.map((summary) => summary.orderId)).toEqual([
      first.orderId,
      second.orderId,
    ]);
    expect(byStatus.map((summary) => summary.orderId)).toEqual([
      second.orderId,
      third.orderId,
    ]);
    expect(byProvider.map((summary) => summary.orderId)).toEqual([
      second.orderId,
      fourth.orderId,
    ]);
    expect(limited.map((summary) => summary.orderId)).toEqual([
      first.orderId,
      second.orderId,
    ]);
    expect("failureMessageKo" in all[1]).toBe(false);
  });

  it("uses last duplicate initial order", async () => {
    const first = createOrder({
      status: "ready",
      updatedAt: createdAt,
    });
    const second = createOrder({
      status: "paid",
      updatedAt: laterAt,
      paidAt: laterAt,
    });
    const adapter = createInMemoryPaymentAdapter([first, second]);

    const findResult = await adapter.find({ orderId: first.orderId });

    expect(findResult.ok).toBe(true);
    if (findResult.ok) {
      expect(findResult.order.status).toBe("paid");
      expect(findResult.order.updatedAt).toBe(laterAt);
    }
  });
});
