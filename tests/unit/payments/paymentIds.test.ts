import { describe, expect, it } from "vitest";

import {
  createPaymentOrderId,
  isValidPaymentOrderId,
} from "@/lib/payments/paymentIds";

describe("payment ids", () => {
  it("creates valid payment order id", () => {
    const orderId = createPaymentOrderId();

    expect(orderId.startsWith("order_")).toBe(true);
    expect(orderId.length).toBeGreaterThanOrEqual(22);
    expect(isValidPaymentOrderId(orderId)).toBe(true);
    expect(orderId).toMatch(/^order_[a-z0-9]+$/);
  });

  it("creates different values across calls", () => {
    const orderIds = Array.from({ length: 20 }, () => createPaymentOrderId());

    expect(new Set(orderIds).size).toBe(orderIds.length);
  });

  it("rejects invalid payment order ids", () => {
    const invalidOrderIds = [
      "",
      "order_",
      "ORDER_abcdefghijklmnop",
      "order_abc",
      "order_abc-123456789012",
      "order_ABC1234567890123",
      "report_abcdefghijklmnop",
      "rpat_abcdefghijklmnop",
    ];

    for (const orderId of invalidOrderIds) {
      expect(isValidPaymentOrderId(orderId)).toBe(false);
    }
  });

  it("validator is deterministic", () => {
    const orderId = "order_abcdefghijklmnop";

    expect(isValidPaymentOrderId(orderId)).toBe(
      isValidPaymentOrderId(orderId),
    );
    expect(isValidPaymentOrderId("order_abc")).toBe(
      isValidPaymentOrderId("order_abc"),
    );
  });
});
