import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import TossPaymentSuccessPage, {
  tossSuccessAutoConfirmScript,
} from "../../../src/app/payments/toss/success/page";

const successPageSource = readFileSync(
  join(process.cwd(), "src/app/payments/toss/success/page.tsx"),
  "utf8",
);

type FakeElement = {
  hidden: boolean;
  textContent: string;
  attributes: Record<string, string>;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
};

type ScriptWindow = {
  location: {
    search: string;
  };
  __gyeolTossSuccessConfirmRequestKey?: string;
  __gyeolTossSuccessConfirmPromise?: Promise<void>;
};

function createFakeElement(textContent = ""): FakeElement {
  const element: FakeElement = {
    hidden: false,
    textContent,
    attributes: {},
    setAttribute(name, value) {
      element.attributes[name] = value;
    },
    removeAttribute(name) {
      delete element.attributes[name];
    },
  };

  return element;
}

function createFakeElements(): Record<string, FakeElement> {
  return {
    "[data-confirm-title]": createFakeElement(),
    "[data-confirm-message]": createFakeElement(),
    "[data-confirm-details]": { ...createFakeElement(), hidden: true },
    "[data-confirm-order-id]": createFakeElement(),
    "[data-confirm-amount]": createFakeElement(),
    "[data-confirm-status]": createFakeElement(),
    "[data-confirm-report-id]": createFakeElement(),
    "[data-confirm-error]": { ...createFakeElement(), hidden: true },
    "[data-confirm-error-code]": createFakeElement(),
    "[data-confirm-error-message]": createFakeElement(),
    "[data-report-link]": { ...createFakeElement("리포트 보기"), hidden: true },
  };
}

function createScriptHarness(input: {
  readonly search: string;
  readonly fetchImpl: typeof fetch;
}): {
  readonly elements: Record<string, FakeElement>;
  readonly fetchMock: ReturnType<typeof vi.fn>;
  readonly run: () => Promise<void>;
} {
  const elements = createFakeElements();
  const fetchMock = vi.fn(input.fetchImpl);
  const windowValue: ScriptWindow = {
    location: {
      search: input.search,
    },
  };
  const context = {
    URLSearchParams,
    document: {
      querySelector(selector: string): FakeElement | null {
        return elements[selector] ?? null;
      },
    },
    fetch: fetchMock,
    window: windowValue,
  };

  return {
    elements,
    fetchMock,
    async run() {
      runInNewContext(tossSuccessAutoConfirmScript, context);
      await windowValue.__gyeolTossSuccessConfirmPromise;
    },
  };
}

async function renderSuccessPage(query: {
  readonly paymentKey?: string;
  readonly orderId?: string;
  readonly amount?: string;
}): Promise<string> {
  const element = await TossPaymentSuccessPage({
    searchParams: Promise.resolve(query),
  });

  return renderToStaticMarkup(element);
}

function createConfirmSuccessResponse(): Response {
  return new Response(
    JSON.stringify({
      ok: true,
      confirm: {
        provider: "toss",
        paymentKeyReceived: true,
        orderId: "provider_order_toss_success_test",
        amount: 1290,
        status: "DONE",
        method: "카드",
        approvedAt: "2026-06-11T12:00:00+09:00",
        rawPaymentStatus: "DONE",
      },
      paymentOrder: {
        paymentOrderId: "payment_order_toss_success_test",
        providerOrderId: "provider_order_toss_success_test",
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 1290,
        currency: "KRW",
        status: "paid",
        paidAt: "2026-06-11T12:00:00+09:00",
        reportId: "report_toss_success_test",
        createdAt: "2026-06-11T11:59:00+09:00",
        updatedAt: "2026-06-11T12:00:01+09:00",
      },
      fulfillment: {
        paymentOrderId: "payment_order_toss_success_test",
        providerOrderId: "provider_order_toss_success_test",
        reportId: "report_toss_success_test",
        productType: "saju_mbti_full",
        status: "paid",
        amount: 1290,
        currency: "KRW",
        createdAt: "2026-06-11T11:59:00+09:00",
        updatedAt: "2026-06-11T12:00:01+09:00",
      },
      ["provider" + "PaymentId"]: "must_not_render_provider_payment_id",
      ["input" + "Snapshot"]: {
        birthDate: "1996-12-06",
      },
      ["share" + "Token"]: "must_not_render_share_token",
      ["access" + "TokenHash"]: "must_not_render_access_token_hash",
      reportSnapshot: {
        body: "must_not_render_report_body",
      },
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
}

describe("Toss payment success auto confirm page", () => {
  it("renders loading state before confirm response without exposing full payment key", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_must_not_render";
    const html = await renderSuccessPage({
      paymentKey: fullPaymentKey,
      orderId: "provider_order_toss_success_test",
      amount: "1290",
    });

    expect(html).toContain("결제 승인 처리 중");
    expect(html).toContain("Toss 결제 인증을 서버에서 승인하고 있습니다.");
    expect(html).toContain("provider_order_toss_success_test");
    expect(html).toContain("1,290원");
    expect(html).toContain("/api/payments/toss/confirm");
    expect(html).toContain("리포트 보기");
    expect(html).not.toContain(fullPaymentKey);
  });

  it("calls server confirm API with paymentKey orderId and amount 1290", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_for_request";
    const harness = createScriptHarness({
      search: `?paymentKey=${encodeURIComponent(fullPaymentKey)}&orderId=provider_order_toss_success_test&amount=1290`,
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.fetchMock).toHaveBeenCalledTimes(1);
    expect(harness.fetchMock.mock.calls[0]?.[0]).toBe(
      "/api/payments/toss/confirm",
    );

    const request = harness.fetchMock.mock.calls[0]?.[1];

    expect(request).toMatchObject({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    expect(JSON.parse(String(request?.body))).toEqual({
      paymentKey: fullPaymentKey,
      orderId: "provider_order_toss_success_test",
      amount: 1290,
    });
  });

  it("shows paid report-ready state after successful confirm", async () => {
    const fullPaymentKey = "pay_full_payment_key_value_must_not_render";
    const harness = createScriptHarness({
      search: `?paymentKey=${encodeURIComponent(fullPaymentKey)}&orderId=provider_order_toss_success_test&amount=1290`,
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 승인 완료",
    );
    expect(harness.elements["[data-confirm-message]"].textContent).toBe(
      "결제가 정상 승인되었고 리포트 생성이 완료되었습니다.",
    );
    expect(harness.elements["[data-confirm-status]"].textContent).toBe("paid");
    expect(harness.elements["[data-confirm-report-id]"].textContent).toBe(
      "report_toss_success_test",
    );
    expect(harness.elements["[data-report-link]"].hidden).toBe(false);
    expect(harness.elements["[data-report-link]"].attributes.href).toBe(
      "/reports/report_toss_success_test",
    );
    expect(harness.elements["[data-report-link]"].attributes.href).not.toContain(
      fullPaymentKey,
    );

    const renderedState = JSON.stringify(harness.elements);

    expect(renderedState).not.toContain(fullPaymentKey);
    expect(renderedState).not.toContain("must_not_render_provider_payment_id");
    expect(renderedState).not.toContain("must_not_render_share_token");
    expect(renderedState).not.toContain("must_not_render_access_token_hash");
    expect(renderedState).not.toContain("must_not_render_report_body");
    expect(renderedState).not.toContain("input" + "Snapshot");
  });

  it("does not call confirm API when paymentKey is missing", async () => {
    const harness = createScriptHarness({
      search: "?orderId=provider_order_toss_success_test&amount=1290",
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.fetchMock).not.toHaveBeenCalled();
    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 정보가 부족합니다.",
    );
  });

  it("does not call confirm API when orderId is missing", async () => {
    const harness = createScriptHarness({
      search: "?paymentKey=pay_missing_order&amount=1290",
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.fetchMock).not.toHaveBeenCalled();
    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 정보가 부족합니다.",
    );
  });

  it("does not call confirm API when amount is missing", async () => {
    const harness = createScriptHarness({
      search: "?paymentKey=pay_missing_amount&orderId=provider_order",
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.fetchMock).not.toHaveBeenCalled();
    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 정보가 부족합니다.",
    );
  });

  it("does not call confirm API when amount is not 1290", async () => {
    const harness = createScriptHarness({
      search: "?paymentKey=pay_wrong_amount&orderId=provider_order&amount=990",
      fetchImpl: async () => createConfirmSuccessResponse(),
    });

    await harness.run();

    expect(harness.fetchMock).not.toHaveBeenCalled();
    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 금액이 올바르지 않습니다.",
    );
  });

  it("shows safe failure state when confirm API fails", async () => {
    const fullPaymentKey = "pay_full_payment_key_failure_must_not_render";
    const harness = createScriptHarness({
      search: `?paymentKey=${encodeURIComponent(fullPaymentKey)}&orderId=provider_order_toss_failure_test&amount=1290`,
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            ok: false,
            error: {
              code: "PAYMENT_FULFILLMENT_FAILED",
              message: "safe failure message",
              ["provider" + "PaymentId"]: "must_not_render_provider_payment_id",
              ["input" + "Snapshot"]: {
                birthDate: "1996-12-06",
              },
              ["share" + "Token"]: "must_not_render_share_token",
              ["access" + "TokenHash"]: "must_not_render_access_token_hash",
            },
          }),
          {
            status: 500,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
    });

    await harness.run();

    expect(harness.elements["[data-confirm-title]"].textContent).toBe(
      "결제 승인 실패",
    );
    expect(harness.elements["[data-confirm-error-code]"].textContent).toBe(
      "PAYMENT_FULFILLMENT_FAILED",
    );

    const renderedState = JSON.stringify(harness.elements);

    expect(renderedState).not.toContain(fullPaymentKey);
    expect(renderedState).not.toContain("must_not_render_provider_payment_id");
    expect(renderedState).not.toContain("input" + "Snapshot");
    expect(renderedState).not.toContain("must_not_render_share_token");
    expect(renderedState).not.toContain("must_not_render_access_token_hash");
  });

  it("does not intentionally repeat confirm for the same page params", async () => {
    const elements = createFakeElements();
    const fetchMock = vi.fn(async () => createConfirmSuccessResponse());
    const windowValue: ScriptWindow = {
      location: {
        search:
          "?paymentKey=pay_duplicate_guard&orderId=provider_order&amount=1290",
      },
    };
    const context = {
      URLSearchParams,
      document: {
        querySelector(selector: string): FakeElement | null {
          return elements[selector] ?? null;
        },
      },
      fetch: fetchMock,
      window: windowValue,
    };

    runInNewContext(tossSuccessAutoConfirmScript, context);
    const firstPromise = windowValue.__gyeolTossSuccessConfirmPromise;
    runInNewContext(tossSuccessAutoConfirmScript, context);
    await firstPromise;
    await windowValue.__gyeolTossSuccessConfirmPromise;

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("source contains auto confirm behavior without final report content or unsafe rendering", () => {
    const requiredMarkers = [
      "/api/payments/toss/confirm",
      "결제 승인 처리 중",
      "결제 승인 완료",
      "결제 승인 실패",
      "리포트 ID",
      "리포트 보기",
      "/reports/",
      "fulfillment",
      "reportId",
      "paymentKey",
      "orderId",
      "amount",
    ];
    const blockedMarkers = [
      "서버 승인 단계는 아직 " + "연결되지 않았습니다",
      "create" + "Report",
      "generate" + "Report",
      "share" + "Token",
      "access" + "TokenHash",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "report" + "_snapshot",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
      "바" + "넘",
      "Bar" + "num",
    ];

    for (const marker of requiredMarkers) {
      expect(successPageSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(successPageSource).not.toContain(marker);
    }
  });
});
