import { mapPaymentOrderRecordToRow } from "./paymentOrderPersistenceMapper";
import type {
  AttachPaymentOrderReportInput,
  MarkPaymentOrderCanceledInput,
  MarkPaymentOrderFailedInput,
  MarkPaymentOrderPaidInput,
  MarkPaymentOrderRefundedInput,
  PaymentOrderPersistenceAdapter,
  PaymentOrderPersistenceErrorCode,
  PaymentOrderPersistenceResult,
  PaymentOrderRecord,
} from "./paymentOrderPersistenceTypes";
import type { PaymentOrderStatus } from "./paymentOrderTypes";

export function createInMemoryPaymentOrderPersistenceAdapter(
  initialOrders: readonly PaymentOrderRecord[] = [],
): PaymentOrderPersistenceAdapter {
  const orders = new Map<string, PaymentOrderRecord>();

  for (const order of initialOrders) {
    orders.set(order.paymentOrderId, copyPaymentOrderRecord(order));
  }

  return {
    async create(
      order: PaymentOrderRecord,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      const validation = mapPaymentOrderRecordToRow(order);

      if (!validation.ok) {
        return validation;
      }

      if (order.status !== "ready" || order.deletedAt !== null) {
        return failure(
          "PAYMENT_ORDER_STORAGE_VALIDATION_FAILED",
          "결제 주문은 준비 상태로만 생성할 수 있습니다.",
        );
      }

      if (orders.has(order.paymentOrderId)) {
        return failure(
          "PAYMENT_ORDER_ALREADY_EXISTS",
          "이미 존재하는 결제 주문입니다.",
        );
      }

      const storedOrder = copyPaymentOrderRecord(order);
      orders.set(order.paymentOrderId, storedOrder);

      return success(copyPaymentOrderRecord(storedOrder));
    },

    async findByPaymentOrderId(
      paymentOrderId: string,
    ): Promise<PaymentOrderRecord | null> {
      const order = orders.get(paymentOrderId);

      return order === undefined ? null : copyPaymentOrderRecord(order);
    },

    async markPaid(
      input: MarkPaymentOrderPaidInput,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      return updateOrder(input.paymentOrderId, (order) => {
        const transitionFailure = assertTransitionAllowed(order, ["ready"]);

        if (transitionFailure !== null) {
          return transitionFailure;
        }

        const updatedAt = input.updatedAt ?? nowIso();

        return success({
          ...order,
          status: "paid",
          providerPaymentId: input.providerPaymentId,
          providerOrderId: input.providerOrderId ?? order.providerOrderId,
          paidAt: input.paidAt ?? updatedAt,
          updatedAt,
        });
      });
    },

    async markFailed(
      input: MarkPaymentOrderFailedInput,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      return updateOrder(input.paymentOrderId, (order) => {
        const transitionFailure = assertTransitionAllowed(order, ["ready"]);

        if (transitionFailure !== null) {
          return transitionFailure;
        }

        const updatedAt = input.updatedAt ?? nowIso();

        return success({
          ...order,
          status: "failed",
          failedAt: input.failedAt ?? updatedAt,
          updatedAt,
        });
      });
    },

    async markCanceled(
      input: MarkPaymentOrderCanceledInput,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      return updateOrder(input.paymentOrderId, (order) => {
        const transitionFailure = assertTransitionAllowed(order, ["ready"]);

        if (transitionFailure !== null) {
          return transitionFailure;
        }

        const updatedAt = input.updatedAt ?? nowIso();

        return success({
          ...order,
          status: "canceled",
          canceledAt: input.canceledAt ?? updatedAt,
          updatedAt,
        });
      });
    },

    async markRefunded(
      input: MarkPaymentOrderRefundedInput,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      return updateOrder(input.paymentOrderId, (order) => {
        const transitionFailure = assertTransitionAllowed(order, ["paid"]);

        if (transitionFailure !== null) {
          return transitionFailure;
        }

        const updatedAt = input.updatedAt ?? nowIso();

        return success({
          ...order,
          status: "refunded",
          refundedAt: input.refundedAt ?? updatedAt,
          updatedAt,
        });
      });
    },

    async attachReport(
      input: AttachPaymentOrderReportInput,
    ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
      return updateOrder(input.paymentOrderId, (order) => {
        const transitionFailure = assertTransitionAllowed(order, ["paid"]);

        if (transitionFailure !== null) {
          return transitionFailure;
        }

        return success({
          ...order,
          reportId: input.reportId,
          updatedAt: input.updatedAt ?? nowIso(),
        });
      });
    },
  };

  async function updateOrder(
    paymentOrderId: string,
    createUpdatedOrder: (
      order: PaymentOrderRecord,
    ) => PaymentOrderPersistenceResult<PaymentOrderRecord>,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>> {
    const order = orders.get(paymentOrderId);

    if (order === undefined) {
      return failure("PAYMENT_ORDER_NOT_FOUND", "결제 주문을 찾을 수 없습니다.");
    }

    const updateResult = createUpdatedOrder(copyPaymentOrderRecord(order));

    if (!updateResult.ok) {
      return updateResult;
    }

    const validation = mapPaymentOrderRecordToRow(updateResult.value);

    if (!validation.ok) {
      return validation;
    }

    const storedOrder = copyPaymentOrderRecord(updateResult.value);
    orders.set(paymentOrderId, storedOrder);

    return success(copyPaymentOrderRecord(storedOrder));
  }
}

function success<T>(value: T): PaymentOrderPersistenceResult<T> {
  return { ok: true, value };
}

function failure<T>(
  code: PaymentOrderPersistenceErrorCode,
  messageKo: string,
): PaymentOrderPersistenceResult<T> {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function assertTransitionAllowed(
  order: PaymentOrderRecord,
  allowedStatuses: readonly PaymentOrderStatus[],
): PaymentOrderPersistenceResult<PaymentOrderRecord> | null {
  if (order.deletedAt !== null) {
    return failure(
      "PAYMENT_ORDER_INVALID_STATE",
      "삭제된 결제 주문은 변경할 수 없습니다.",
    );
  }

  if (!allowedStatuses.includes(order.status)) {
    return failure(
      "PAYMENT_ORDER_INVALID_STATE",
      "결제 주문 상태를 변경할 수 없습니다.",
    );
  }

  return null;
}

function copyPaymentOrderRecord(order: PaymentOrderRecord): PaymentOrderRecord {
  return {
    ...order,
    inputSnapshot: { ...order.inputSnapshot },
  };
}

function nowIso(): string {
  return new Date().toISOString();
}
