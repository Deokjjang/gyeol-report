import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type ProductSlug =
  | "saju-mbti-full"
  | "career-money-study"
  | "love-marriage-child"
  | "major-fortune"
  | "annual-fortune"
  | "compatibility";

type E2eProductCase = {
  readonly productSlug: ProductSlug;
  readonly urlPath: string;
  readonly ctaLabel: string;
  readonly resultMarkers: readonly string[];
  readonly fillForm: (client: CdpClient) => Promise<void>;
};

type CdpResponse<T> = {
  readonly id: number;
  readonly result?: T;
  readonly error?: {
    readonly message: string;
    readonly data?: string;
  };
};

type RuntimeEvaluateResult = {
  readonly result: {
    readonly type: string;
    readonly value?: unknown;
  };
  readonly exceptionDetails?: {
    readonly text?: string;
    readonly exception?: {
      readonly description?: string;
      readonly value?: unknown;
    };
  };
};

type ChromeTarget = {
  readonly webSocketDebuggerUrl: string;
};

const baseUrl =
  process.env.LAUNCH_E2E_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
const cdpPort = Number(process.env.LAUNCH_E2E_CDP_PORT ?? "9337");
const generationTimeoutMs = Number(
  process.env.LAUNCH_E2E_GENERATION_TIMEOUT_MS ?? "180000",
);
const ctaText = "나도 내 리포트 보기";
const shareCtaText = "리포트 공유하기";
const secondaryCtaText = "다른 리포트 보기";
const reportPathPrefix = "/reports/";
const productCases: readonly E2eProductCase[] = [
  {
    productSlug: "saju-mbti-full",
    urlPath: "/report/new?product=saju-mbti-full",
    ctaLabel: "1,290원 결제하고 종합 리포트 생성하기",
    resultMarkers: [
      "종합 리포트",
      "오행 분포",
      "내 사주의 주요 표식 해석",
      "명리×MBTI",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: fillSinglePersonProductForm,
  },
  {
    productSlug: "career-money-study",
    urlPath: "/report/new?product=career-money-study",
    ctaLabel: "1,290원 결제하고 직업 리포트 생성하기",
    resultMarkers: [
      "직업·커리어·돈·학업 리포트",
      "만세력",
      "오행 분포",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: fillSinglePersonProductForm,
  },
  {
    productSlug: "love-marriage-child",
    urlPath: "/report/new?product=love-marriage-child",
    ctaLabel: "1,290원 결제하고 연애 리포트 생성하기",
    resultMarkers: [
      "연애·결혼·자녀 리포트",
      "만세력",
      "오행 분포",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: fillSinglePersonProductForm,
  },
  {
    productSlug: "major-fortune",
    urlPath: "/report/new?product=major-fortune",
    ctaLabel: "1,290원 결제하고 대운 리포트 생성하기",
    resultMarkers: [
      "대운 리포트",
      "만세력",
      "오행 분포",
      "대운",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: fillSinglePersonProductForm,
  },
  {
    productSlug: "annual-fortune",
    urlPath: "/report/new?product=annual-fortune",
    ctaLabel: "1,290원 결제하고 세운 리포트 생성하기",
    resultMarkers: [
      "세운 리포트",
      "만세력",
      "오행 분포",
      "세운",
      "월운",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: async (client) => {
      await fillSinglePersonProductForm(client);
      await setInputValue(client, "#selectedYear", "2026");
    },
  },
  {
    productSlug: "compatibility",
    urlPath: "/report/new?product=compatibility",
    ctaLabel: "1,290원 결제하고 궁합 리포트 생성하기",
    resultMarkers: [
      "궁합 리포트",
      "두 사람 기초표",
      "관계 카테고리",
      shareCtaText,
      ctaText,
      secondaryCtaText,
    ],
    fillForm: fillCompatibilityProductForm,
  },
];

const forbiddenResultMarkers = [
  "리포트를 찾을 수 없습니다",
  "placeholder",
  "fallback",
  "source registry",
  "구매하기",
  "결제하기",
] as const;

class CdpClient {
  private nextId = 1;
  private readonly pending = new Map<
    number,
    {
      readonly resolve: (value: unknown) => void;
      readonly reject: (error: Error) => void;
    }
  >();

  private constructor(private readonly socket: WebSocket) {
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data)) as Partial<CdpResponse<unknown>>;
      if (typeof message.id !== "number") {
        return;
      }

      const request = this.pending.get(message.id);
      if (request === undefined) {
        return;
      }

      this.pending.delete(message.id);
      if (message.error !== undefined) {
        request.reject(
          new Error(
            `${message.error.message}${
              message.error.data === undefined ? "" : `: ${message.error.data}`
            }`,
          ),
        );
        return;
      }

      request.resolve(message.result);
    });
  }

  static connect(webSocketDebuggerUrl: string): Promise<CdpClient> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(webSocketDebuggerUrl);
      socket.addEventListener("open", () => resolve(new CdpClient(socket)), {
        once: true,
      });
      socket.addEventListener(
        "error",
        () => reject(new Error("failed to connect to Chrome DevTools Protocol")),
        { once: true },
      );
    });
  }

  send<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = this.nextId;
    this.nextId += 1;

    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        resolve: (value) => resolve(value as T),
        reject,
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close(): void {
    this.socket.close();
  }
}

async function main(): Promise<void> {
  await assertDevServerReady();

  const chromeExecutable = resolveChromeExecutable();
  const userDataDir = mkdtempSync(join(tmpdir(), "gyeol-launch-e2e-"));
  const chrome = spawnChrome(chromeExecutable, userDataDir);
  let client: CdpClient | undefined;

  try {
    const target = await createChromeTarget();
    client = await CdpClient.connect(target.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    let passed = 0;
    let failed = 0;

    for (const productCase of productCases) {
      try {
        await runProductCase(client, productCase);
        passed += 1;
      } catch (error) {
        failed += 1;
        process.stderr.write(
          `FAIL product=${productCase.productSlug} reason=${
            error instanceof Error ? error.message : String(error)
          }\n`,
        );
      }
    }

    if (failed > 0) {
      process.exitCode = 1;
    }

    process.stdout.write(
      `browser E2E launch product flows complete: passed=${passed} failed=${failed} total=${productCases.length}\n`,
    );
  } finally {
    client?.close();
    chrome.kill("SIGTERM");
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // Chrome can release profile files shortly after SIGTERM.
    }
  }
}

async function runProductCase(
  client: CdpClient,
  productCase: E2eProductCase,
): Promise<void> {
  await navigate(client, `${baseUrl}${productCase.urlPath}`);
  await waitForBrowserCondition(
    client,
    "document.querySelector('#singleProductName') instanceof HTMLInputElement || document.querySelector('#personAName') instanceof HTMLInputElement",
    "product form ready",
  );
  await delay(750);
  await productCase.fillForm(client);
  await waitForButton(client, productCase.ctaLabel);
  await clickButtonByText(client, productCase.ctaLabel);
  await waitForLocationPath(client, reportPathPrefix, generationTimeoutMs);

  const resultUrl = await getLocationHref(client);
  const resultText = await getVisibleText(client);
  assertResultText(resultText, productCase);

  await navigate(client, resultUrl);
  const sharedResultText = await getVisibleText(client);
  assertResultText(sharedResultText, productCase);

  await clickLinkByText(client, ctaText);
  await waitForLocationPath(client, "/report/new");

  process.stdout.write(
    `PASS product=${productCase.productSlug} reportUrl=${resultUrl} cta=${ctaText}\n`,
  );
}

async function fillSinglePersonProductForm(client: CdpClient): Promise<void> {
  await setInputValue(client, "#singleProductName", "도윤");
  await setInputValue(client, "#singleProductBirthDate", "1996-12-06");
  await setInputValue(client, "#singleProductBirthTime", "09:30");
  await setSelectValue(client, "#singleProductGender", "MALE");
  await setSelectValue(client, "#singleProductMbtiType", "ENTJ");
  await setSelectValue(client, "#singleProductRelationshipStatus", "married");
  await setSelectValue(client, "#singleProductJobStatus", "other");
  await setInputValue(client, "#singleProductDetailedJob", "서비스 기획자");
}

async function fillCompatibilityProductForm(client: CdpClient): Promise<void> {
  await setInputValue(client, "#personAName", "도윤");
  await setInputValue(client, "#personABirthDate", "1996-12-06");
  await setInputValue(client, "#personABirthTime", "09:30");
  await setSelectValue(client, "#personAGender", "MALE");
  await setSelectValue(client, "#personAMbtiType", "ENTJ");
  await setInputValue(client, "#personBName", "서윤");
  await setInputValue(client, "#personBBirthDate", "1988-01-08");
  await setInputValue(client, "#personBBirthTime", "05:40");
  await setSelectValue(client, "#personBGender", "FEMALE");
  await setSelectValue(client, "#personBMbtiType", "ISFP");
  await setSelectValue(client, "#relationshipType", "businessPartner");
}

async function navigate(client: CdpClient, url: string): Promise<void> {
  await client.send("Page.navigate", { url });
  await waitForBrowserCondition(
    client,
    "document.readyState === 'complete' || document.readyState === 'interactive'",
    "page ready",
  );
}

async function setInputValue(
  client: CdpClient,
  selector: string,
  value: string,
): Promise<void> {
  await evaluate(
    client,
    `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!(element instanceof HTMLInputElement)) {
        throw new Error("input not found: ${selector}");
      }
      const previousValue = element.value;
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (descriptor?.set) {
        descriptor.set.call(element, ${JSON.stringify(value)});
      } else {
        element.value = ${JSON.stringify(value)};
      }
      element._valueTracker?.setValue(previousValue);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    })()`,
  );
  await delay(50);
}

async function setSelectValue(
  client: CdpClient,
  selector: string,
  value: string,
): Promise<void> {
  await evaluate(
    client,
    `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!(element instanceof HTMLSelectElement)) {
        throw new Error("select not found: ${selector}");
      }
      const previousValue = element.value;
      const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
      if (descriptor?.set) {
        descriptor.set.call(element, ${JSON.stringify(value)});
      } else {
        element.value = ${JSON.stringify(value)};
      }
      element._valueTracker?.setValue(previousValue);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    })()`,
  );
  await delay(50);
}

async function waitForButton(client: CdpClient, text: string): Promise<void> {
  await waitForBrowserCondition(
    client,
    `[...document.querySelectorAll("button")].some((button) => button.textContent?.includes(${JSON.stringify(text)}) && !button.disabled)`,
    `button ready: ${text}`,
  );
}

async function clickButtonByText(client: CdpClient, text: string): Promise<void> {
  await evaluate(
    client,
    `(() => {
      const button = [...document.querySelectorAll("button")].find((candidate) =>
        candidate.textContent?.includes(${JSON.stringify(text)})
      );
      if (!(button instanceof HTMLButtonElement)) {
        throw new Error("button not found: ${text}");
      }
      if (button.disabled) {
        throw new Error("button disabled: ${text}");
      }
      button.click();
    })()`,
  );
}

async function clickLinkByText(client: CdpClient, text: string): Promise<void> {
  await evaluate(
    client,
    `(() => {
      const link = [...document.querySelectorAll("a")].find((candidate) =>
        candidate.textContent?.includes(${JSON.stringify(text)})
      );
      if (!(link instanceof HTMLAnchorElement)) {
        throw new Error("link not found: ${text}");
      }
      link.click();
    })()`,
  );
}

async function waitForLocationPath(
  client: CdpClient,
  pathnamePrefix: string,
  timeoutMs = 60_000,
): Promise<void> {
  await waitForBrowserCondition(
    client,
    `location.pathname.startsWith(${JSON.stringify(pathnamePrefix)})`,
    `/reports/ redirect check`,
    timeoutMs,
  );
}

async function getLocationHref(client: CdpClient): Promise<string> {
  return evaluate<string>(client, "location.href");
}

async function getVisibleText(client: CdpClient): Promise<string> {
  return evaluate<string>(
    client,
    `document.body?.innerText?.replace(/\\s+/g, " ").trim() ?? ""`,
  );
}

async function evaluate<T>(client: CdpClient, expression: string): Promise<T> {
  const result = await client.send<RuntimeEvaluateResult>("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails !== undefined) {
    throw new Error(
      result.exceptionDetails.exception?.description ??
        result.exceptionDetails.text ??
        "browser evaluation failed",
    );
  }

  return result.result.value as T;
}

async function waitForBrowserCondition(
  client: CdpClient,
  expression: string,
  label: string,
  timeoutMs = 60_000,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const ok = await evaluate<boolean>(client, `Boolean(${expression})`);
    if (ok) {
      return;
    }

    await delay(250);
  }

  throw new Error(`${label} timed out`);
}

function assertResultText(text: string, productCase: E2eProductCase): void {
  for (const marker of productCase.resultMarkers) {
    if (!text.includes(marker)) {
      throw new Error(`result marker missing: ${marker}`);
    }
  }

  for (const marker of forbiddenResultMarkers) {
    if (text.includes(marker)) {
      throw new Error(`result contains forbidden marker: ${marker}`);
    }
  }
}

async function assertDevServerReady(): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/report/new`);
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `dev server is not ready at ${baseUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function resolveChromeExecutable(): string {
  const candidates = [
    process.env.LAUNCH_E2E_CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome",
    "chromium",
  ].filter((candidate): candidate is string => Boolean(candidate));

  const executable = candidates.find((candidate) =>
    candidate.startsWith("/") ? existsSync(candidate) : true,
  );

  if (executable === undefined) {
    throw new Error("Chrome executable was not found");
  }

  return executable;
}

function spawnChrome(
  executable: string,
  userDataDir: string,
): ChildProcessWithoutNullStreams {
  const chrome = spawn(executable, [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-component-update",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=1280,1600",
    "about:blank",
  ]);

  chrome.on("error", (error) => {
    process.stderr.write(`FAIL chrome launch ${error.message}\n`);
  });

  return chrome;
}

async function createChromeTarget(): Promise<ChromeTarget> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 20_000) {
    try {
      const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new`, {
        method: "PUT",
      });
      if (response.ok) {
        const target = (await response.json()) as Partial<ChromeTarget>;
        if (typeof target.webSocketDebuggerUrl === "string") {
          return { webSocketDebuggerUrl: target.webSocketDebuggerUrl };
        }
      }
    } catch {
      // Chrome is still starting.
    }

    await delay(250);
  }

  throw new Error("Chrome DevTools target was not ready");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  process.stderr.write(
    `FAIL browser E2E launch product flows ${
      error instanceof Error ? error.message : String(error)
    }\n`,
  );
});
