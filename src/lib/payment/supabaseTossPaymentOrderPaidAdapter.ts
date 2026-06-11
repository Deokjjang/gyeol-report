import type {
  MarkTossPaymentOrderPaidInput,
  MarkTossPaymentOrderPaidResult,
} from "./tossPaymentOrderPaidTypes";
import type {
  SupabaseTossPaymentOrderPaidQueryErrorCode,
  SupabaseTossPaymentOrderPaidRpcClient,
} from "./supabaseTossPaymentOrderPaidClient";

export type MarkTossPaymentOrderPaidAdapterInput = {
  readonly providerOrderId: unknown;
  readonly providerPaymentId: unknown;
  readonly amount: unknown;
  readonly currency: unknown;
  readonly paidAt?: unknown;
  readonly client: SupabaseTossPaymentOrderPaidRpcClient;
};

export type MarkTossPaymentOrderPaidAdapterErrorCode =
  | "TOSS_PAYMENT_ORDER_PAID_INVALID_REQUEST"
  | "TOSS_PAYMENT_ORDER_PAID_AMOUNT_MISMATCH"
  | "TOSS_PAYMENT_ORDER_PAID_CURRENCY_MISMATCH"
  | SupabaseTossPaymentOrderPaidQueryErrorCode;

export type MarkTossPaymentOrderPaidAdapterResult =
  | {
      readonly ok: true;
      readonly order: MarkTossPaymentOrderPaidResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: MarkTossPaymentOrderPaidAdapterErrorCode;
        readonly messageKo: string;
      };
    };

function failure(
  code: MarkTossPaymentOrderPaidAdapterErrorCode,
  messageKo: string,
): MarkTossPaymentOrderPaidAdapterResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function parseInput(
  input: MarkTossPaymentOrderPaidAdapterInput,
):
  | {
      readonly ok: true;
      readonly value: MarkTossPaymentOrderPaidInput;
    }
  | {
      readonly ok: false;
      readonly result: MarkTossPaymentOrderPaidAdapterResult;
    } {
  if (
    !isNonEmptyString(input.providerOrderId) ||
    !isNonEmptyString(input.providerPaymentId)
  ) {
    return {
      ok: false,
      result: failure(
        "TOSS_PAYMENT_ORDER_PAID_INVALID_REQUEST",
        "Toss 결제 주문 paid 전환 요청이 올바르지 않습니다.",
      ),
    };
  }

  if (input.amount !== 990) {
    return {
      ok: false,
      result: failure(
        "TOSS_PAYMENT_ORDER_PAID_AMOUNT_MISMATCH",
        "Toss 결제 주문 금액이 일치하지 않습니다.",
      ),
    };
  }

  if (input.currency !== "KRW") {
    return {
      ok: false,
      result: failure(
        "TOSS_PAYMENT_ORDER_PAID_CURRENCY_MISMATCH",
        "Toss 결제 주문 통화가 일치하지 않습니다.",
      ),
    };
  }

  if (
    input.paidAt !== undefined &&
    (!isNonEmptyString(input.paidAt) || !isTimestamp(input.paidAt))
  ) {
    return {
      ok: false,
      result: failure(
        "TOSS_PAYMENT_ORDER_PAID_INVALID_REQUEST",
        "Toss 결제 승인 시간이 올바르지 않습니다.",
      ),
    };
  }

  return {
    ok: true,
    value: {
      providerOrderId: input.providerOrderId.trim(),
      providerPaymentId: input.providerPaymentId.trim(),
      amount: 990,
      currency: "KRW",
      ...(input.paidAt === undefined ? {} : { paidAt: input.paidAt }),
    },
  };
}

export async function markTossPaymentOrderPaid(
  input: MarkTossPaymentOrderPaidAdapterInput,
): Promise<MarkTossPaymentOrderPaidAdapterResult> {
  const parsed = parseInput(input);

  if (!parsed.ok) {
    return parsed.result;
  }

  const result = await input.client.markTossPaymentOrderPaid(parsed.value);

  if (!result.ok) {
    return failure(result.code, result.messageKo);
  }

  return {
    ok: true,
    order: result.data,
  };
}
