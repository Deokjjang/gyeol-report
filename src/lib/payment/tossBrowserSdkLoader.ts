"use client";

import type { TossClientSdk } from "./tossClientCheckoutTypes";

export const TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC =
  "https://js.tosspayments.com/v2/standard";

export type TossBrowserSdkLoaderErrorCode =
  | "TOSS_BROWSER_SDK_INVALID_CLIENT_KEY"
  | "TOSS_BROWSER_SDK_BROWSER_UNAVAILABLE"
  | "TOSS_BROWSER_SDK_LOAD_FAILED"
  | "TOSS_BROWSER_SDK_GLOBAL_MISSING"
  | "TOSS_BROWSER_SDK_INIT_FAILED";

export class TossBrowserSdkLoaderError extends Error {
  readonly code: TossBrowserSdkLoaderErrorCode;

  constructor(code: TossBrowserSdkLoaderErrorCode, message: string) {
    super(message);
    this.name = "TossBrowserSdkLoaderError";
    this.code = code;
  }
}

type TossPaymentsFactory = (clientKey: string) => unknown;

type TossPaymentsWindow = Window & {
  readonly TossPayments?: TossPaymentsFactory;
};

function createError(
  code: TossBrowserSdkLoaderErrorCode,
  message: string,
): TossBrowserSdkLoaderError {
  return new TossBrowserSdkLoaderError(code, message);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTossClientSdk(value: unknown): value is TossClientSdk {
  return isRecord(value) && typeof value.payment === "function";
}

function getBrowserEnvironment(): {
  readonly browserWindow: TossPaymentsWindow;
  readonly browserDocument: Document;
} {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw createError(
      "TOSS_BROWSER_SDK_BROWSER_UNAVAILABLE",
      "Toss browser SDK can only be loaded in a browser.",
    );
  }

  return {
    browserWindow: window as TossPaymentsWindow,
    browserDocument: document,
  };
}

function findExistingSdkScript(
  browserDocument: Document,
): HTMLScriptElement | null {
  return browserDocument.querySelector<HTMLScriptElement>(
    `script[src="${TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC}"]`,
  );
}

function appendSdkScript(browserDocument: Document): HTMLScriptElement {
  const script = browserDocument.createElement("script");
  const parent = browserDocument.head ?? browserDocument.body;

  if (parent === null) {
    throw createError(
      "TOSS_BROWSER_SDK_LOAD_FAILED",
      "Toss browser SDK script could not be attached.",
    );
  }

  script.src = TOSS_PAYMENTS_SDK_V2_SCRIPT_SRC;
  script.async = true;
  parent.appendChild(script);

  return script;
}

function waitForScriptLoad(script: HTMLScriptElement): Promise<void> {
  if (script.dataset.tossPaymentsSdkLoaded === "true") {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
    const onLoad = (): void => {
      cleanup();
      script.dataset.tossPaymentsSdkLoaded = "true";
      resolve();
    };
    const onError = (): void => {
      cleanup();
      reject(
        createError(
          "TOSS_BROWSER_SDK_LOAD_FAILED",
          "Toss browser SDK script failed to load.",
        ),
      );
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
  });
}

function initializeTossPayments(
  browserWindow: TossPaymentsWindow,
  clientKey: string,
): TossClientSdk {
  if (typeof browserWindow.TossPayments !== "function") {
    throw createError(
      "TOSS_BROWSER_SDK_GLOBAL_MISSING",
      "Toss browser SDK global was not found.",
    );
  }

  let sdk: unknown;

  try {
    sdk = browserWindow.TossPayments(clientKey);
  } catch {
    throw createError(
      "TOSS_BROWSER_SDK_INIT_FAILED",
      "Toss browser SDK could not be initialized.",
    );
  }

  if (!isTossClientSdk(sdk)) {
    throw createError(
      "TOSS_BROWSER_SDK_INIT_FAILED",
      "Toss browser SDK returned an invalid client.",
    );
  }

  return sdk;
}

export async function loadTossPaymentsBrowserSdk(
  clientKey: string,
): Promise<TossClientSdk> {
  if (!isNonEmptyString(clientKey)) {
    throw createError(
      "TOSS_BROWSER_SDK_INVALID_CLIENT_KEY",
      "Toss client key is required.",
    );
  }

  const { browserWindow, browserDocument } = getBrowserEnvironment();

  if (typeof browserWindow.TossPayments === "function") {
    return initializeTossPayments(browserWindow, clientKey);
  }

  const script =
    findExistingSdkScript(browserDocument) ?? appendSdkScript(browserDocument);

  await waitForScriptLoad(script);

  return initializeTossPayments(browserWindow, clientKey);
}
