export const dynamic = "force-dynamic";

type TossSuccessPageProps = {
  readonly searchParams: Promise<{
    readonly paymentKey?: string | string[];
    readonly orderId?: string | string[];
    readonly amount?: string | string[];
  }>;
};

type InitialSuccessState = "received" | "missing" | "amount-mismatch";

const requiredPaymentAmount = 1290;

export const tossSuccessConfirmDeferredMarker =
  "TOSS_CONFIRM_DEFERRED_UNTIL_REPORT_FULFILLMENT";

function readQueryValue(value: string | string[] | undefined): string {
  const firstValue = Array.isArray(value) ? value[0] : value;

  return typeof firstValue === "string" ? firstValue.slice(0, 160) : "";
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
    return "amount-mismatch";
  }

  return "received";
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

  if (state === "amount-mismatch") {
    return {
      title: "결제 금액이 올바르지 않습니다.",
      message: "결제 승인 요청 금액을 다시 확인해 주세요.",
    };
  }

  return {
    title: "결제 정보 확인 완료",
    message:
      "결제창에서 결제 인증 정보를 받았습니다. 리포트 생성과 최종 승인 처리는 다음 단계에서 연결됩니다.",
  };
}

function renderValue(value: string): string {
  return value.trim().length > 0 ? value : "not provided";
}

export default async function TossPaymentSuccessPage({
  searchParams,
}: TossSuccessPageProps) {
  const query = await searchParams;
  const orderId = readQueryValue(query.orderId);
  const amount = readQueryValue(query.amount);
  const paymentKey = readQueryValue(query.paymentKey);
  const initialState = parseInitialState({ paymentKey, orderId, amount });
  const initialCopy = createInitialCopy(initialState);

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
            hidden={initialState === "missing"}
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
                {initialState === "received" ? "1,290원" : renderValue(amount)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">상태</dt>
              <dd className="text-neutral-100" data-confirm-status>
                {initialState === "received" ? "confirm deferred" : "not ready"}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">다음 단계</dt>
              <dd
                className="break-words text-neutral-100"
                data-confirm-report-id
              >
                결제 승인 확인 후 리포트 생성 연결 예정
              </dd>
            </div>
          </dl>

          <div
            className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-100"
            data-confirm-error
            hidden
          >
            <p>
              코드: <span data-confirm-error-code>not provided</span>
            </p>
            <p>
              메시지: <span data-confirm-error-message>not provided</span>
            </p>
          </div>

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
