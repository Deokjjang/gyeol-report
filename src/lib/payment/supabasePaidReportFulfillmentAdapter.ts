import type {
  FulfillPaidPaymentOrderInput,
  FulfillPaidPaymentOrderResult,
} from "./paidReportFulfillmentTypes";
import type {
  SupabasePaidReportFulfillmentQueryErrorCode,
  SupabasePaidReportFulfillmentRpcClient,
} from "./supabasePaidReportFulfillmentClient";

export type FulfillPaidPaymentOrderAdapterInput = {
  readonly providerOrderId: unknown;
  readonly client: SupabasePaidReportFulfillmentRpcClient;
};

export type FulfillPaidPaymentOrderAdapterErrorCode =
  | "PAID_REPORT_FULFILLMENT_INVALID_REQUEST"
  | SupabasePaidReportFulfillmentQueryErrorCode;

export type FulfillPaidPaymentOrderAdapterResult =
  | {
      readonly ok: true;
      readonly fulfillment: FulfillPaidPaymentOrderResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: FulfillPaidPaymentOrderAdapterErrorCode;
        readonly messageKo: string;
      };
    };

function failure(
  code: FulfillPaidPaymentOrderAdapterErrorCode,
  messageKo: string,
): FulfillPaidPaymentOrderAdapterResult {
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

function parseInput(
  input: FulfillPaidPaymentOrderAdapterInput,
):
  | {
      readonly ok: true;
      readonly value: FulfillPaidPaymentOrderInput;
    }
  | {
      readonly ok: false;
      readonly result: FulfillPaidPaymentOrderAdapterResult;
    } {
  if (!isNonEmptyString(input.providerOrderId)) {
    return {
      ok: false,
      result: failure(
        "PAID_REPORT_FULFILLMENT_INVALID_REQUEST",
        "Paid report fulfillment request is invalid.",
      ),
    };
  }

  return {
    ok: true,
    value: {
      providerOrderId: input.providerOrderId.trim(),
    },
  };
}

export async function fulfillPaidPaymentOrder(
  input: FulfillPaidPaymentOrderAdapterInput,
): Promise<FulfillPaidPaymentOrderAdapterResult> {
  const parsed = parseInput(input);

  if (!parsed.ok) {
    return parsed.result;
  }

  const result = await input.client.fulfillPaidPaymentOrder(parsed.value);

  if (!result.ok) {
    return failure(result.code, result.messageKo);
  }

  return {
    ok: true,
    fulfillment: result.data,
  };
}
