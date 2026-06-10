import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { launchTossCheckout } from "../../../src/lib/payment/tossClientCheckoutLauncher";
import type { TossClientCheckoutLaunchResult } from "../../../src/lib/payment/tossClientCheckoutTypes";
import type { TossCheckoutRequestDraft } from "../../../src/lib/payment/tossCheckoutRequestTypes";

const source = [
  readFileSync(
    join(process.cwd(), "src/lib/payment/tossClientCheckoutTypes.ts"),
    "utf8",
  ),
  readFileSync(
    join(process.cwd(), "src/lib/payment/tossClientCheckoutLauncher.ts"),
    "utf8",
  ),
].join("\n");

const requestDraft = {
  provider: "toss",
  clientKey: "test_client_key",
  requestPayment: {
    method: "CARD",
    orderId: "provider_order_toss_client_launcher_test",
    orderName: "사주×MBTI 전체 리포트",
    amount: {
      currency: "KRW",
      value: 1290,
    },
    successUrl: "https://gyeol.example/payments/toss/success",
    failUrl: "https://gyeol.example/payments/toss/fail",
    customerName: "결리포트 고객",
  },
  metadata: {
    paymentOrderId: "payment_order_toss_client_launcher_test",
    productType: "saju_mbti_full",
  },
} as const satisfies TossCheckoutRequestDraft;

function createLaunchHarness(input?: {
  readonly requestPaymentError?: Error;
  readonly sdkLoadError?: Error;
}) {
  const requestPayment = vi.fn(async () => {
    if (input?.requestPaymentError !== undefined) {
      throw input.requestPaymentError;
    }
  });
  const payment = vi.fn(() => ({
    requestPayment,
  }));
  const loadTossPayments = vi.fn(async () => {
    if (input?.sdkLoadError !== undefined) {
      throw input.sdkLoadError;
    }

    return {
      payment,
    };
  });

  return {
    requestPayment,
    payment,
    loadTossPayments,
  };
}

function createLaunchInput(
  harness = createLaunchHarness(),
): {
  readonly tossCheckoutRequest: TossCheckoutRequestDraft;
  readonly customerKey: string;
  readonly loadTossPayments: typeof harness.loadTossPayments;
} {
  return {
    tossCheckoutRequest: requestDraft,
    customerKey: "customer_key_launcher_test",
    loadTossPayments: harness.loadTossPayments,
  };
}

function expectError(
  result: TossClientCheckoutLaunchResult,
  code: string,
): void {
  expect(result).toEqual({
    ok: false,
    status: "failed_to_launch",
    error: {
      code,
      messageKo: expect.any(String),
    },
  });
}

describe("Toss client checkout launcher", () => {
  it("loads the Toss SDK with client key and requests redirect checkout", async () => {
    const harness = createLaunchHarness();
    const result = await launchTossCheckout(createLaunchInput(harness));

    expect(result).toEqual({
      ok: true,
      status: "redirect_requested",
    });
    expect(harness.loadTossPayments).toHaveBeenCalledWith("test_client_key");
    expect(harness.payment).toHaveBeenCalledWith({
      customerKey: "customer_key_launcher_test",
    });
    expect(harness.requestPayment).toHaveBeenCalledWith(
      requestDraft.requestPayment,
    );
    expect(JSON.stringify(harness.requestPayment.mock.calls[0]?.[0])).not.toContain(
      "flow" + "Mode",
    );
  });

  it("rejects a missing request", async () => {
    expectError(
      await launchTossCheckout({
        customerKey: "customer_key_launcher_test",
        loadTossPayments: createLaunchHarness().loadTossPayments,
      }),
      "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
    );
  });

  it("rejects a non-Toss request", async () => {
    expectError(
      await launchTossCheckout({
        ...createLaunchInput(),
        tossCheckoutRequest: {
          ...requestDraft,
          provider: "kakao_pay",
        },
      }),
      "TOSS_CLIENT_CHECKOUT_INVALID_PROVIDER",
    );
  });

  it("rejects missing client key", async () => {
    expectError(
      await launchTossCheckout({
        ...createLaunchInput(),
        tossCheckoutRequest: {
          ...requestDraft,
          clientKey: "",
        },
      }),
      "TOSS_CLIENT_CHECKOUT_INVALID_CLIENT_KEY",
    );
  });

  it("rejects missing customer key", async () => {
    expectError(
      await launchTossCheckout({
        ...createLaunchInput(),
        customerKey: "",
      }),
      "TOSS_CLIENT_CHECKOUT_INVALID_CUSTOMER_KEY",
    );
  });

  it("rejects missing request payment draft", async () => {
    expectError(
      await launchTossCheckout({
        ...createLaunchInput(),
        tossCheckoutRequest: {
          ...requestDraft,
          requestPayment: undefined,
        },
      }),
      "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
    );
  });

  it("handles SDK loader failure safely", async () => {
    const harness = createLaunchHarness({
      sdkLoadError: new Error("loader failed"),
    });
    const result = await launchTossCheckout(createLaunchInput(harness));

    expectError(result, "TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED");
    expect(harness.payment).not.toHaveBeenCalled();
    expect(harness.requestPayment).not.toHaveBeenCalled();
  });

  it("handles request failure safely", async () => {
    const harness = createLaunchHarness({
      requestPaymentError: new Error("request failed"),
    });
    const result = await launchTossCheckout(createLaunchInput(harness));

    expectError(result, "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED");
    expect(harness.loadTossPayments).toHaveBeenCalledWith("test_client_key");
    expect(harness.payment).toHaveBeenCalledWith({
      customerKey: "customer_key_launcher_test",
    });
  });

  it("does not mutate input", async () => {
    const launchInput = createLaunchInput();
    const before = JSON.stringify(launchInput.tossCheckoutRequest);

    await launchTossCheckout(launchInput);

    expect(JSON.stringify(launchInput.tossCheckoutRequest)).toBe(before);
  });

  it("returns no confirm-stage identifiers provider ids urls or report data", async () => {
    const result = await launchTossCheckout(createLaunchInput());
    const serialized = JSON.stringify(result);
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
    ];

    for (const marker of blockedMarkers) {
      expect(serialized).not.toContain(marker);
    }
  });

  it("source stays client-side and launcher-only", () => {
    const requiredMarkers = [
      "launchTossCheckout",
      "loadTossPayments",
      "requestPayment",
      "customerKey",
      "redirect_requested",
      "failed_to_launch",
      "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
      "TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED",
      "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED",
    ];
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "secret" + "Key",
      "client" + "Secret",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "/v1/" + "payments/confirm",
      "fe" + "tch(",
      "ax" + "ios",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
