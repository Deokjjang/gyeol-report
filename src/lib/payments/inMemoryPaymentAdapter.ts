import type {
  CancelPaymentInput,
  ConfirmPaymentInput,
  CreatePaymentSessionInput,
  FindPaymentInput,
  ListPaymentOrdersInput,
  PaymentAdapter,
  PaymentFindResult,
  PaymentSessionResult,
  RefundPaymentInput,
} from "./paymentAdapter";
import { createPaymentOrderId } from "./paymentIds";
import type {
  PaymentOperationResult,
  PaymentOrder,
  PaymentStatus,
  PublicPaymentSummary,
} from "./paymentTypes";

type PaymentOperationFailure = Extract<PaymentOperationResult, { ok: false }>;

export function createInMemoryPaymentAdapter(
  initialOrders: readonly PaymentOrder[] = [],
): PaymentAdapter {
  const orders = new Map<string, PaymentOrder>();

  for (const order of initialOrders) {
    orders.set(order.orderId, order);
  }

  return {
    async createSession(
      input: CreatePaymentSessionInput,
    ): Promise<PaymentSessionResult> {
      const now = nowIso();
      const order: PaymentOrder = {
        orderId: createPaymentOrderId(),
        reportId: input.reportId,
        productCode: input.productCode,
        provider: input.provider,
        amount: input.amount,
        status: "ready",
        createdAt: now,
        updatedAt: now,
      };

      orders.set(order.orderId, order);

      return {
        ok: true,
        order,
      };
    },

    async confirm(
      input: ConfirmPaymentInput,
    ): Promise<PaymentOperationResult> {
      const order = orders.get(input.orderId);

      if (!order) {
        return createPaymentFailure(
          "PAYMENT_REPORT_NOT_FOUND",
          "결제 정보를 찾을 수 없습니다.",
        );
      }

      if (order.status === "paid") {
        return createPaymentFailure(
          "PAYMENT_ALREADY_PROCESSED",
          "이미 처리된 결제입니다.",
        );
      }

      if (
        input.amountValue !== undefined &&
        input.amountValue !== order.amount.value
      ) {
        return createPaymentFailure(
          "PAYMENT_AMOUNT_MISMATCH",
          "결제 금액을 확인할 수 없습니다.",
        );
      }

      const now = nowIso();
      const updated: PaymentOrder = {
        ...order,
        status: "paid",
        providerPaymentId: input.providerPaymentId ?? order.providerPaymentId,
        paidAt: now,
        updatedAt: now,
      };

      orders.set(input.orderId, updated);

      return {
        ok: true,
        order: updated,
      };
    },

    async cancel(
      input: CancelPaymentInput,
    ): Promise<PaymentOperationResult> {
      const order = orders.get(input.orderId);

      if (!order) {
        return createPaymentFailure(
          "PAYMENT_REPORT_NOT_FOUND",
          "결제 정보를 찾을 수 없습니다.",
        );
      }

      if (order.status === "paid") {
        return createPaymentFailure(
          "PAYMENT_ALREADY_PROCESSED",
          "이미 완료된 결제는 취소할 수 없습니다.",
        );
      }

      const now = nowIso();
      const updated: PaymentOrder = {
        ...order,
        status: "cancelled",
        cancelledAt: now,
        failureCode: "PAYMENT_CANCELLED_BY_USER",
        failureMessageKo: input.reasonKo,
        updatedAt: now,
      };

      orders.set(input.orderId, updated);

      return {
        ok: true,
        order: updated,
      };
    },

    async refund(
      input: RefundPaymentInput,
    ): Promise<PaymentOperationResult> {
      const order = orders.get(input.orderId);

      if (!order) {
        return createPaymentFailure(
          "PAYMENT_REPORT_NOT_FOUND",
          "결제 정보를 찾을 수 없습니다.",
        );
      }

      if (order.status !== "paid") {
        return createPaymentFailure(
          "PAYMENT_AUTH_FAILED",
          "환불 가능한 결제 상태가 아닙니다.",
        );
      }

      if (
        input.amountValue !== undefined &&
        input.amountValue !== order.amount.value
      ) {
        return createPaymentFailure(
          "PAYMENT_AMOUNT_MISMATCH",
          "환불 금액을 확인할 수 없습니다.",
        );
      }

      const now = nowIso();
      const updated: PaymentOrder = {
        ...order,
        status: "refunded",
        refundedAt: now,
        failureMessageKo: input.reasonKo,
        updatedAt: now,
      };

      orders.set(input.orderId, updated);

      return {
        ok: true,
        order: updated,
      };
    },

    async find(input: FindPaymentInput): Promise<PaymentFindResult> {
      const order = orders.get(input.orderId);

      if (!order) {
        return {
          ok: false,
          error: {
            code: "PAYMENT_ORDER_NOT_FOUND",
            messageKo: "결제 주문을 찾을 수 없습니다.",
          },
        };
      }

      if (input.provider && input.provider !== order.provider) {
        return {
          ok: false,
          error: {
            code: "PAYMENT_LOOKUP_FAILED",
            messageKo: "결제 제공자 정보를 확인할 수 없습니다.",
          },
        };
      }

      return {
        ok: true,
        order,
      };
    },

    async list(
      input: ListPaymentOrdersInput,
    ): Promise<readonly PublicPaymentSummary[]> {
      const filteredOrders = Array.from(orders.values()).filter((order) => {
        const matchesReportId =
          input.reportId === undefined || order.reportId === input.reportId;
        const matchesStatus = matchesPaymentStatus(order.status, input.status);
        const matchesProvider =
          input.provider === undefined || order.provider === input.provider;

        return matchesReportId && matchesStatus && matchesProvider;
      });
      const limitedOrders =
        input.limit === undefined
          ? filteredOrders
          : filteredOrders.slice(0, input.limit);

      return limitedOrders.map(toPublicPaymentSummary);
    },
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function toPublicPaymentSummary(order: PaymentOrder): PublicPaymentSummary {
  return {
    orderId: order.orderId,
    reportId: order.reportId,
    productCode: order.productCode,
    provider: order.provider,
    amount: order.amount,
    status: order.status,
    paidAt: order.paidAt,
    refundedAt: order.refundedAt,
  };
}

function matchesPaymentStatus(
  orderStatus: PaymentStatus,
  inputStatus: PaymentStatus | undefined,
): boolean {
  return inputStatus === undefined || orderStatus === inputStatus;
}

function createPaymentFailure(
  code: PaymentOperationFailure["error"]["code"],
  messageKo: string,
): PaymentOperationResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}
