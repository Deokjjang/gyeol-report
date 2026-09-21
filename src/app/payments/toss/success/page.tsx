import { ReportStatusView } from "../../../../components/report/ReportStatusView";
import { confirmPaidReport } from "../../../../lib/payment/paidReportReliability";
import { createPaidReportReliabilityStore } from "../../../../lib/payment/paidReportReliabilityStore";
import { redirect } from "next/navigation";

import { confirmTossPayment } from "../../../../lib/payment/tossConfirmClient";

export const dynamic = "force-dynamic";

type TossSuccessPageProps = {
  readonly searchParams: Promise<{
    readonly paymentKey?: string | string[];
    readonly orderId?: string | string[];
    readonly amount?: string | string[];
  }>;
};

type InitialSuccessState =
  | "ready_to_confirm"
  | "confirm_disabled"
  | "missing"
  | "amount_mismatch"
  | "order_not_found"
  | "payment_failed"
  | "generation_failed";

const requiredPaymentAmount = 1290;
const tossConfirmApiEnabledEnv = "TOSS_CONFIRM_API_ENABLED";
const tossSecretKeyEnv = "TOSS_PAYMENTS_SECRET_KEY";
const paidGenerationFailureMessage =
  "결제 상태 확인이 더 필요합니다. 잠시 후 이 주소에서 다시 확인해 주세요. 확인이 어려우시면 고객센터로 문의해 주세요.";

function readQueryValue(value: string | string[] | undefined): string {
  const firstValue = Array.isArray(value) ? value[0] : value;

  return typeof firstValue === "string" ? firstValue.slice(0, 240) : "";
}

function parseInitialState(input: {
  readonly paymentKey: string;
  readonly orderId: string;
  readonly amount: string;
}): InitialSuccessState {
  if (
    input.paymentKey.trim().length === 0 ||
    input.orderId.trim().length === 0 ||
    input.amount.trim().length === 0
  ) {
    return "missing";
  }

  if (Number(input.amount) !== requiredPaymentAmount) {
    return "amount_mismatch";
  }

  if (process.env[tossConfirmApiEnabledEnv] !== "1") {
    return "confirm_disabled";
  }

  return "ready_to_confirm";
}

function createInitialCopy(state: InitialSuccessState): {
  readonly title: string;
  readonly message: string;
} {
  if (state === "missing") {
    return {
      title: "결제 정보가 부족합니다.",
      message: "결제 승인에 필요한 정보가 누락되었습니다.",
    };
  }

  if (state === "amount_mismatch") {
    return {
      title: "결제 금액이 올바르지 않습니다.",
      message: "결제 승인 요청 금액을 다시 확인해 주세요.",
    };
  }

  if (state === "order_not_found") {
    return {
      title: "주문 정보를 찾을 수 없습니다.",
      message: "결제 주문 정보를 확인할 수 없습니다. 고객센터로 문의해 주세요.",
    };
  }

  if (state === "payment_failed") {
    return {
      title: "결제 승인에 실패했습니다.",
      message: "결제가 정상 승인되지 않았습니다. 다시 시도해 주세요.",
    };
  }

  if (state === "generation_failed") {
    return {
      title: "결제 상태를 확인해 주세요.",
      message: paidGenerationFailureMessage,
    };
  }

  if (state === "confirm_disabled") {
    return {
      title: "결제 상태를 확인해 주세요.",
      message:
        "아직 결제 완료 여부를 확인하지 못했습니다. 고객센터로 문의해 주시면 확인해 드리겠습니다.",
    };
  }

  return {
    title: "결제 상태를 확인해 주세요.",
    message: "결제 확인에 시간이 조금 더 걸리고 있습니다. 잠시 후 이 주소에서 다시 확인해 주세요.",
  };
}

async function confirmAndGenerateReport(input: {
  readonly paymentKey: string;
  readonly orderId: string;
  readonly amount: number;
}): Promise<InitialSuccessState | { readonly redirectReportId: string }> {
  const result = await confirmPaidReport(input, createPaidReportReliabilityStore(),
    (payment) => confirmTossPayment({ ...payment, secretKey: process.env[tossSecretKeyEnv] ?? "" }));
  if (result.ok && typeof result.reportId === "string") return { redirectReportId: result.reportId };
  if (result.ok && result.pending) return "ready_to_confirm";
  return "generation_failed";
}

export default async function TossPaymentSuccessPage({
  searchParams,
}: TossSuccessPageProps) {
  const query = await searchParams;
  const orderId = readQueryValue(query.orderId);
  const amount = readQueryValue(query.amount);
  const paymentKey = readQueryValue(query.paymentKey);
  const initialState = parseInitialState({ paymentKey, orderId, amount });
  const finalState =
    initialState === "ready_to_confirm"
      ? await confirmAndGenerateReport({
          paymentKey,
          orderId,
          amount: Number(amount),
        })
      : initialState;

  if (typeof finalState === "object") {
    redirect(`/reports/${finalState.redirectReportId}`);
  }

  const initialCopy = createInitialCopy(finalState);

  return (
    <ReportStatusView
      state="payment-check"
      title={initialCopy.title}
      message={initialCopy.message}
      support
    />
  );
}
