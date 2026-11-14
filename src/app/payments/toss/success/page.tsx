import { isDirectReportPaymentAmount } from "../../../../lib/payment/reportProductCatalog";
import { ReportStatusView } from "../../../../components/report/ReportStatusView";
import { closedProductOrder, confirmPaidReport } from "../../../../lib/payment/paidReportReliability";
import { SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, SALES_PAUSED_AI_MESSAGE, SALES_PAUSED_CODE, salesPausedMessage } from "../../../../lib/ops/config";
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
  | "generation_failed"
  | "sales_closed"
  | "sales_paused"
  | "sales_paused_ai";

const tossConfirmApiEnabledEnv = "TOSS_CONFIRM_API_ENABLED";
const tossSecretKeyEnv = "TOSS_PAYMENTS_SECRET_KEY";
const paidGenerationFailureMessage =
  "결제 상태 확인이 더 필요합니다. 잠시 후 이 주소에서 다시 확인해 주세요.";

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

  if (!isDirectReportPaymentAmount(Number(input.amount))) {
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
      message: "결제 주문 정보를 확인할 수 없습니다.",
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

  // v5 최종3: 판매 중지 상품(대운·세운)의 승인 전 주문 — 토스 승인을 부르지 않아 결제되지 않는다.
  if (state === "sales_closed") {
    return {
      title: "지금은 판매하지 않는 상품이에요.",
      message: `${SALES_CLOSED_MESSAGE} 이 주문은 결제를 승인하지 않았어요.`,
    };
  }

  // W3 P0: 4종 판매 중지 중인 승인 전 주문 — 토스 승인을 부르지 않아 결제되지 않는다.
  // W4 Q0: AI 서버 장애·연결 오류로 자동 멈춘 동안(이유 outage·connection).
  if (state === "sales_paused_ai") {
    return {
      title: "AI 서버 점검으로 잠시 멈췄어요.",
      message: "곧 다시 열게요. 이 주문은 결제를 승인하지 않아 결제되지 않았어요. 이미 결제한 책은 그대로 만들어져요.",
    };
  }

  if (state === "sales_paused") {
    return {
      title: "지금은 책 만들기를 잠시 멈췄어요.",
      message: "곧 다시 열게요. 이 주문은 결제를 승인하지 않아 결제되지 않았어요. 이미 결제한 책은 그대로 만들어져요.",
    };
  }

  if (state === "confirm_disabled") {
    return {
      title: "결제 상태를 확인해 주세요.",
      message:
        "아직 결제 완료 여부를 확인하지 못했습니다.",
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
}): Promise<InitialSuccessState | { readonly redirectReportId: string; readonly receiptUrl?: string }> {
  const store = createPaidReportReliabilityStore();
  const result = await confirmPaidReport(input, store,
    (payment) => confirmTossPayment({ ...payment, secretKey: process.env[tossSecretKeyEnv] ?? "" }), orderId => closedProductOrder(store, orderId));
  if (!result.ok && result.code === SALES_CLOSED_CODE) return "sales_closed";
  if (!result.ok && result.code === SALES_PAUSED_CODE) {
    const { readSalesPause, SALES_PAUSE_CACHE_MS } = await import("../../../../lib/ops/salesPause");
    return salesPausedMessage((await readSalesPause({ maxAgeMs: SALES_PAUSE_CACHE_MS }))?.reason) === SALES_PAUSED_AI_MESSAGE ? "sales_paused_ai" : "sales_paused";
  }
  if (result.ok && typeof result.reportId === "string") return { redirectReportId: result.reportId, ...(typeof result.receiptUrl === "string" ? { receiptUrl: result.receiptUrl } : {}) };
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
    // P6d-ops 4: 결제 완료 화면(주문코드·상품·일시·금액·상태·영수증·문의). 주문 기록을 못 읽으면 기존처럼 책 화면으로 보낸다.
    const { PaymentCompleteView } = await import("../../../../components/ops/PaymentComplete");
    const view = await PaymentCompleteView({ providerOrderId: orderId, paymentKey, reportId: finalState.redirectReportId, receiptUrl: finalState.receiptUrl });
    if (view) return view;
    redirect(`/reports/${finalState.redirectReportId}?purchase=1`);
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
