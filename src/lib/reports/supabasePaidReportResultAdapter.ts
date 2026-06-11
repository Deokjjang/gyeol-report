import type {
  GetPaidReportResultInput,
  PaidReportResult,
} from "./paidReportResultTypes";
import type {
  SupabasePaidReportResultQueryErrorCode,
  SupabasePaidReportResultRpcClient,
} from "./supabasePaidReportResultClient";

export type GetPaidReportResultAdapterInput = {
  readonly reportId: unknown;
  readonly client: SupabasePaidReportResultRpcClient;
};

export type GetPaidReportResultAdapterErrorCode =
  | "REPORT_RESULT_INVALID_REQUEST"
  | SupabasePaidReportResultQueryErrorCode;

export type GetPaidReportResultAdapterResult =
  | {
      readonly ok: true;
      readonly result: PaidReportResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: GetPaidReportResultAdapterErrorCode;
        readonly messageKo: string;
      };
    };

function failure(
  code: GetPaidReportResultAdapterErrorCode,
  messageKo: string,
): GetPaidReportResultAdapterResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isValidReportId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^report_[A-Za-z0-9_-]+$/.test(value.trim())
  );
}

function parseInput(
  input: GetPaidReportResultAdapterInput,
):
  | {
      readonly ok: true;
      readonly value: GetPaidReportResultInput;
    }
  | {
      readonly ok: false;
      readonly result: GetPaidReportResultAdapterResult;
    } {
  if (!isValidReportId(input.reportId)) {
    return {
      ok: false,
      result: failure(
        "REPORT_RESULT_INVALID_REQUEST",
        "Paid report result request is invalid.",
      ),
    };
  }

  return {
    ok: true,
    value: {
      reportId: input.reportId.trim(),
    },
  };
}

export async function getPaidReportResult(
  input: GetPaidReportResultAdapterInput,
): Promise<GetPaidReportResultAdapterResult> {
  const parsed = parseInput(input);

  if (!parsed.ok) {
    return parsed.result;
  }

  const result = await input.client.getPaidReportResult(parsed.value);

  if (!result.ok) {
    return failure(result.code, result.messageKo);
  }

  return {
    ok: true,
    result: result.data,
  };
}
