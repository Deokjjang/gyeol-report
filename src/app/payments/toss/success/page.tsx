export const dynamic = "force-dynamic";

type TossSuccessPageProps = {
  readonly searchParams: Promise<{
    readonly paymentKey?: string | string[];
    readonly orderId?: string | string[];
    readonly amount?: string | string[];
  }>;
};

type InitialSuccessState = "loading" | "missing" | "amount-mismatch";

const requiredPaymentAmount = 990;

export const tossSuccessAutoConfirmScript = `
(function () {
  var requiredAmount = 990;
  var globalKeyName = "__gyeolTossSuccessConfirmRequestKey";
  var globalPromiseName = "__gyeolTossSuccessConfirmPromise";

  function readParam(params, name) {
    var value = params.get(name);
    return typeof value === "string" ? value.trim() : "";
  }

  function select(selector) {
    return document.querySelector(selector);
  }

  function setText(selector, value) {
    var element = select(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function setHidden(selector, hidden) {
    var element = select(selector);
    if (element) {
      element.hidden = hidden;
    }
  }

  function safeText(value) {
    return typeof value === "string" && value.trim().length > 0
      ? value.slice(0, 160)
      : "not provided";
  }

  function showInvalid(message) {
    setText("[data-confirm-title]", message);
    setText("[data-confirm-message]", "결제 승인에 필요한 정보가 누락되었습니다.");
    setHidden("[data-confirm-details]", true);
    setHidden("[data-confirm-error]", true);
  }

  function showAmountMismatch(orderId, amount) {
    setText("[data-confirm-title]", "결제 금액이 올바르지 않습니다.");
    setText("[data-confirm-message]", "결제 승인 요청 금액을 다시 확인해 주세요.");
    setText("[data-confirm-order-id]", safeText(orderId));
    setText("[data-confirm-amount]", safeText(amount));
    setHidden("[data-confirm-details]", false);
    setHidden("[data-confirm-error]", true);
  }

  function showFailure(error, orderId, amount) {
    setText("[data-confirm-title]", "결제 승인 실패");
    setText("[data-confirm-message]", "서버 승인 처리 중 문제가 발생했습니다.");
    setText("[data-confirm-order-id]", safeText(orderId));
    setText("[data-confirm-amount]", safeText(amount));
    setText("[data-confirm-status]", "failed");
    setText("[data-confirm-report-id]", "not ready");
    setText("[data-confirm-error-code]", safeText(error && error.code));
    setText("[data-confirm-error-message]", safeText(error && error.message));
    setHidden("[data-confirm-details]", false);
    setHidden("[data-confirm-error]", false);
  }

  function showSuccess(body) {
    setText("[data-confirm-title]", "결제 승인 완료");
    setText(
      "[data-confirm-message]",
      "결제가 정상 승인되었고 리포트 생성이 완료되었습니다.",
    );
    setText("[data-confirm-order-id]", safeText(body.confirm.orderId));
    setText("[data-confirm-amount]", "990원");
    setText("[data-confirm-status]", safeText(body.paymentOrder.status));
    setText("[data-confirm-report-id]", safeText(body.fulfillment.reportId));
    setHidden("[data-confirm-details]", false);
    setHidden("[data-confirm-error]", true);
  }

  function isSuccessBody(value) {
    return Boolean(
      value &&
        value.ok === true &&
        value.confirm &&
        value.confirm.status === "DONE" &&
        value.paymentOrder &&
        value.paymentOrder.status === "paid" &&
        value.fulfillment &&
        typeof value.fulfillment.reportId === "string" &&
        value.fulfillment.reportId.length > 0,
    );
  }

  async function run() {
    var params = new URLSearchParams(window.location.search);
    var paymentKey = readParam(params, "paymentKey");
    var orderId = readParam(params, "orderId");
    var amount = readParam(params, "amount");

    if (!paymentKey || !orderId || !amount) {
      showInvalid("결제 정보가 부족합니다.");
      return;
    }

    if (Number(amount) !== requiredAmount) {
      showAmountMismatch(orderId, amount);
      return;
    }

    var requestKey = orderId + ":" + amount + ":" + paymentKey;
    if (window[globalKeyName] === requestKey) {
      return;
    }
    window[globalKeyName] = requestKey;

    try {
      var response = await fetch("/api/payments/toss/confirm", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          paymentKey: paymentKey,
          orderId: orderId,
          amount: requiredAmount,
        }),
      });
      var body = await response.json();

      if (!response.ok || !isSuccessBody(body)) {
        showFailure(body && body.error, orderId, amount);
        return;
      }

      showSuccess(body);
    } catch (error) {
      showFailure({ code: "CONFIRM_REQUEST_FAILED", message: "Confirm request failed." }, orderId, amount);
    }
  }

  window[globalPromiseName] = run();
})();
`;

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

  return "loading";
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
    title: "결제 승인 처리 중",
    message: "Toss 결제 인증을 서버에서 승인하고 있습니다.",
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
  const shouldRunAutoConfirm = initialState === "loading";

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
                {initialState === "loading" ? "990원" : renderValue(amount)}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">상태</dt>
              <dd className="text-neutral-100" data-confirm-status>
                {initialState === "loading" ? "confirming" : "not ready"}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-neutral-500">리포트 ID</dt>
              <dd
                className="break-words text-neutral-100"
                data-confirm-report-id
              >
                not ready
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
        </div>
      </section>

      {shouldRunAutoConfirm ? (
        <script
          dangerouslySetInnerHTML={{ __html: tossSuccessAutoConfirmScript }}
        />
      ) : null}
    </main>
  );
}
