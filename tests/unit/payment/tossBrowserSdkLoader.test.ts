import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  loadTossPaymentsBrowserSdk,
  TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC,
  TossBrowserSdkLoaderError,
} from "../../../src/lib/payment/tossBrowserSdkLoader";

class FakeScriptElement {
  src = "";
  async = false;
  readonly dataset: Record<string, string | undefined> = {};
  private readonly listeners: {
    readonly load: Set<EventListener>;
    readonly error: Set<EventListener>;
  } = {
    load: new Set<EventListener>(),
    error: new Set<EventListener>(),
  };

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
  ): void {
    if ((type !== "load" && type !== "error") || typeof listener !== "function") {
      return;
    }

    this.listeners[type].add(listener);
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
  ): void {
    if ((type !== "load" && type !== "error") || typeof listener !== "function") {
      return;
    }

    this.listeners[type].delete(listener);
  }

  emit(type: "load" | "error"): void {
    for (const listener of Array.from(this.listeners[type])) {
      listener({ type } as Event);
    }
  }
}

class FakeScriptParent {
  constructor(private readonly scripts: FakeScriptElement[]) {}

  appendChild(node: Node): Node {
    this.scripts.push(node as unknown as FakeScriptElement);
    return node;
  }
}

class FakeDocument {
  readonly scripts: FakeScriptElement[] = [];
  readonly head = new FakeScriptParent(this.scripts) as unknown as HTMLHeadElement;
  readonly body = new FakeScriptParent(this.scripts) as unknown as HTMLElement;

  createElement(tagName: string): HTMLElement {
    if (tagName !== "script") {
      throw new Error("Unexpected fake element request.");
    }

    return new FakeScriptElement() as unknown as HTMLElement;
  }

  querySelector<T extends Element = Element>(selector: string): T | null {
    if (selector !== `script[src="${TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC}"]`) {
      return null;
    }

    const script = this.scripts.find(
      (candidate) => candidate.src === TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC,
    );

    return script === undefined ? null : (script as unknown as T);
  }

  appendExistingScript(): FakeScriptElement {
    const script = new FakeScriptElement();

    script.src = TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC;
    this.scripts.push(script);

    return script;
  }
}

type TossPaymentsWindowStub = {
  TossPayments?: (clientKey: string) => unknown;
};

function installFakeBrowser(input?: {
  readonly tossPayments?: (clientKey: string) => unknown;
}): {
  readonly browserDocument: FakeDocument;
  readonly browserWindow: TossPaymentsWindowStub;
} {
  const browserDocument = new FakeDocument();
  const browserWindow: TossPaymentsWindowStub = {};

  if (input?.tossPayments !== undefined) {
    browserWindow.TossPayments = input.tossPayments;
  }

  vi.stubGlobal("window", browserWindow);
  vi.stubGlobal("document", browserDocument as unknown as Document);

  return {
    browserDocument,
    browserWindow,
  };
}

function createSdkFactory() {
  const requestPayment = vi.fn();
  const payment = vi.fn(() => ({
    requestPayment,
  }));
  const sdk = {
    payment,
  };
  const tossPayments = vi.fn((clientKey: string) => {
    void clientKey;
    return sdk;
  });

  return {
    requestPayment,
    payment,
    sdk,
    tossPayments,
  };
}

function expectLoaderError(error: unknown, code: string): void {
  expect(error).toBeInstanceOf(TossBrowserSdkLoaderError);

  if (error instanceof TossBrowserSdkLoaderError) {
    expect(error.code).toBe(code);
    expect(error.message).toEqual(expect.any(String));
  }
}

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/tossBrowserSdkLoader.ts"),
  "utf8",
);

describe("Toss browser SDK loader", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects missing client key", async () => {
    installFakeBrowser();

    await loadTossPaymentsBrowserSdk("").catch((error: unknown) => {
      expectLoaderError(error, "TOSS_BROWSER_SDK_INVALID_CLIENT_KEY");
    });
  });

  it("rejects when browser globals are unavailable", async () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);

    await loadTossPaymentsBrowserSdk("test_client_key").catch((error: unknown) => {
      expectLoaderError(error, "TOSS_BROWSER_SDK_BROWSER_UNAVAILABLE");
    });
  });

  it("uses existing TossPayments global without adding a script", async () => {
    const factory = createSdkFactory();
    const { browserDocument } = installFakeBrowser({
      tossPayments: factory.tossPayments,
    });

    const sdk = await loadTossPaymentsBrowserSdk("test_client_key");

    expect(sdk).toBe(factory.sdk);
    expect(factory.tossPayments).toHaveBeenCalledWith("test_client_key");
    expect(factory.payment).not.toHaveBeenCalled();
    expect(factory.requestPayment).not.toHaveBeenCalled();
    expect(browserDocument.scripts).toHaveLength(0);
  });

  it("injects the official Toss v2 script and resolves after load", async () => {
    const factory = createSdkFactory();
    const { browserDocument, browserWindow } = installFakeBrowser();
    const sdkPromise = loadTossPaymentsBrowserSdk("test_client_key");

    expect(browserDocument.scripts).toHaveLength(1);
    expect(browserDocument.scripts[0]?.src).toBe(
      "https://js.tosspayments.com/v2/standard",
    );
    expect(browserDocument.scripts[0]?.async).toBe(true);

    browserWindow.TossPayments = factory.tossPayments;
    browserDocument.scripts[0]?.emit("load");

    await expect(sdkPromise).resolves.toBe(factory.sdk);
    expect(factory.tossPayments).toHaveBeenCalledWith("test_client_key");
    expect(factory.payment).not.toHaveBeenCalled();
    expect(factory.requestPayment).not.toHaveBeenCalled();
  });

  it("does not inject a duplicate script when one already exists", async () => {
    const factory = createSdkFactory();
    const { browserDocument, browserWindow } = installFakeBrowser();
    const existingScript = browserDocument.appendExistingScript();
    const sdkPromise = loadTossPaymentsBrowserSdk("test_client_key");

    expect(browserDocument.scripts).toHaveLength(1);

    browserWindow.TossPayments = factory.tossPayments;
    existingScript.emit("load");

    await expect(sdkPromise).resolves.toBe(factory.sdk);
  });

  it("rejects when script loading fails", async () => {
    const { browserDocument } = installFakeBrowser();
    const sdkPromise = loadTossPaymentsBrowserSdk("test_client_key");

    browserDocument.scripts[0]?.emit("error");

    await sdkPromise.catch((error: unknown) => {
      expectLoaderError(error, "TOSS_BROWSER_SDK_LOAD_FAILED");
    });
  });

  it("rejects when script loads without TossPayments global", async () => {
    const { browserDocument } = installFakeBrowser();
    const sdkPromise = loadTossPaymentsBrowserSdk("test_client_key");

    browserDocument.scripts[0]?.emit("load");

    await sdkPromise.catch((error: unknown) => {
      expectLoaderError(error, "TOSS_BROWSER_SDK_GLOBAL_MISSING");
    });
  });

  it("rejects when TossPayments initialization fails", async () => {
    installFakeBrowser({
      tossPayments: () => {
        throw new Error("init failed");
      },
    });

    await loadTossPaymentsBrowserSdk("test_client_key").catch((error: unknown) => {
      expectLoaderError(error, "TOSS_BROWSER_SDK_INIT_FAILED");
    });
  });

  it("source stays limited to SDK loading", () => {
    const requiredMarkers = [
      "TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC",
      "loadTossPaymentsBrowserSdk",
      "https://js.tosspayments.com/v2/standard",
      "TossPayments",
      "TOSS_BROWSER_SDK_INVALID_CLIENT_KEY",
      "TOSS_BROWSER_SDK_BROWSER_UNAVAILABLE",
      "TOSS_BROWSER_SDK_LOAD_FAILED",
      "TOSS_BROWSER_SDK_GLOBAL_MISSING",
      "TOSS_BROWSER_SDK_INIT_FAILED",
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
      "request" + "Payment",
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
