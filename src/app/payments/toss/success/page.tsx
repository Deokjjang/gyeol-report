import { redirect } from "next/navigation";

import { createReportPersistenceRuntime } from "../../../../lib/persistence/reportPersistenceRuntime";
import { fulfillPaidProductReport } from "../../../../lib/payment/paidProductReportFulfillment";
import { createPaymentOrderPersistenceRuntime } from "../../../../lib/payment/paymentOrderRuntime";
import { confirmTossPayment } from "../../../../lib/payment/tossConfirmClient";
import { resolveReportWriterRuntime } from "../../../../lib/report-generation/reportWriterRuntime";

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
  "결제는 완료되었고 리포트 생성 처리 중 문제가 발생했습니다. 고객센터로 문의해 주세요.";

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
      title: "리포트 생성 처리 중 문제가 발생했습니다.",
      message: paidGenerationFailureMessage,
    };
  }

  if (state === "confirm_disabled") {
    return {
      title: "결제 정보 확인 완료",
      message:
        "결제창에서 결제 인증 정보를 받았습니다. 결제 승인과 리포트 생성 처리는 서버 설정이 켜진 뒤 진행됩니다.",
    };
  }

  return {
    title: "결제 승인 처리 중",
    message: "결제 승인 확인 후 리포트를 생성하고 있습니다.",
  };
}

function renderValue(value: string): string {
  return value.trim().length > 0 ? value : "not provided";
}

async function confirmAndGenerateReport(input: {
  readonly paymentKey: string;
  readonly orderId: string;
  readonly amount: number;
}): Promise<InitialSuccessState | { readonly redirectReportId: string }> {
  const orderRuntime = createPaymentOrderPersistenceRuntime();
  const storedOrder = await orderRuntime.findByProviderOrderId(input.orderId);

  if (storedOrder === null) {
    return "order_not_found";
  }

  if (storedOrder.amount !== input.amount || storedOrder.currency !== "KRW") {
    await orderRuntime.markFailed({
      paymentOrderId: storedOrder.paymentOrderId,
    });

    return "amount_mismatch";
  }

  if (storedOrder.status === "paid" && storedOrder.reportId !== null) {
    return { redirectReportId: storedOrder.reportId };
  }

  const secretKey = process.env[tossSecretKeyEnv];

  if (secretKey === undefined || secretKey.trim().length === 0) {
    return "payment_failed";
  }

  const confirmResult = await confirmTossPayment({
    secretKey,
    paymentKey: input.paymentKey,
    orderId: input.orderId,
    amount: input.amount,
  });

  if (!confirmResult.ok || confirmResult.confirm.status !== "DONE") {
    await orderRuntime.markFailed({
      paymentOrderId: storedOrder.paymentOrderId,
    });

    return "payment_failed";
  }

  const paidResult =
    storedOrder.status === "paid"
      ? { ok: true as const, value: storedOrder }
      : await orderRuntime.markPaid({
          paymentOrderId: storedOrder.paymentOrderId,
          providerOrderId: confirmResult.confirm.orderId,
          providerPaymentId: input.paymentKey,
          ...(confirmResult.confirm.approvedAt === undefined
            ? {}
            : { paidAt: confirmResult.confirm.approvedAt }),
        });

  if (!paidResult.ok) {
    return "payment_failed";
  }

  const reportRuntime = createReportPersistenceRuntime({ mode: "preview_memory" });

  if (!reportRuntime.ok) {
    await orderRuntime.markReportGenerationFailed({
      paymentOrderId: paidResult.value.paymentOrderId,
      code: "REPORT_PERSISTENCE_RUNTIME_FAILED",
      messageKo: paidGenerationFailureMessage,
    });

    return "generation_failed";
  }

  const generationResult = await fulfillPaidProductReport({
    order: paidResult.value,
    reportAdapter: reportRuntime.adapter,
    writerRuntime: resolveReportWriterRuntime(),
  });

  if (!generationResult.ok) {
    await orderRuntime.markReportGenerationFailed({
      paymentOrderId: paidResult.value.paymentOrderId,
      code: generationResult.error.code,
      messageKo: paidGenerationFailureMessage,
    });

    return "generation_failed";
  }

  const attachResult = await orderRuntime.attachReport({
    paymentOrderId: paidResult.value.paymentOrderId,
    reportId: generationResult.reportId,
    reportExpiresAt: generationResult.expiresAt,
  });

  if (!attachResult.ok) {
    await orderRuntime.markReportGenerationFailed({
      paymentOrderId: paidResult.value.paymentOrderId,
      code: "PAYMENT_ORDER_REPORT_LINK_FAILED",
      messageKo: paidGenerationFailureMessage,
    });

    return "generation_failed";
  }

  return { redirectReportId: generationResult.reportId };
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
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">
            Gyeol Report / 결리포트
          </p>
          <h1
            className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl"
            data-confirm-title
          >
            {initialCopy.title}
          </h1>
        </div>

        <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
          <p className="text-base leading-7 text-neutral-300" data-confirm-message>
            {initialCopy.message}
          </p>

          <dl
            className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm"
            data-confirm-details
            hidden={finalState === "missing"}
          >
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">주문번호</dt>
              <dd
                className="break-words text-neutral-100"
                data-confirm-order-id
              >
                {renderValue(orderId)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">결제금액</dt>
              <dd className="break-words text-neutral-100" data-confirm-amount>
                {finalState === "confirm_disabled" ? "1,290원" : renderValue(amount)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">상태</dt>
              <dd className="text-neutral-100" data-confirm-status>
                {finalState}
              </dd>
            </div>
          </dl>

          <a
            className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white sm:w-auto"
            data-report-link
            href="/report/new"
          >
            다른 리포트 보기
          </a>
        </div>
      </section>
    </main>
  );
}
