// 공유 회귀 고정(운영 Q 추가, 2026-11-07): 실제 WebKit(Playwright, iPhone 13 화면·터치)에서 책 공유 버튼 3개를 누른다.
// 지키는 것: 링크는 미리 받아 두고, 누른 순간 클립보드 쓰기·카카오·공유하기를 제스처 안에서 await 없이 부른다
// (옛 코드는 fetch를 기다린 뒤 써서 아이폰 사파리가 NotAllowedError로 막았다 — docs/v5/hotfix-share.md §1-5).
// 403·404·503·네트워크 실패에도 버튼 3개는 남고, 다시 누르면 다시 받는다. 클립보드는 WebKit 실제 writeText(가짜 없음).
// 새 책 형식(대운·세운 v5 등)을 열면 이 시험과 tests/unit/sharing/bookShareV5.test.tsx의 형식 표에 반드시 넣는다(CLAUDE.md 배포 체크리스트).
import { resolve } from "node:path";
import { build, type Plugin } from "esbuild";
import { devices, webkit, type Browser, type BrowserContext, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { projectBookShare, type BookShareModel } from "../../../src/lib/book/shareModel";
import { LAUNCH_V5_PRODUCTS } from "../../../src/lib/writer/flags";
import { SHARE_STATUS } from "../../../src/components/book/BookShareActions";

const ROOT = resolve(__dirname, "../../..");
const ORIGIN = "https://share.test";

// 형식 표: 책 버전 × 발행 경로. v5 결제는 출시 상품(LAUNCH_V5_PRODUCTS)마다 한 줄 — 아래 가드가 빠진 상품을 잡는다.
type Row = { version: "v4" | "v5"; source: "paid" | "ticket"; productType: string; names: string };
const ROWS: readonly Row[] = [
  { version: "v4", source: "paid", productType: "career_money_study", names: "김하람" },
  { version: "v4", source: "ticket", productType: "saju_mbti_full", names: "박서윤" },
  { version: "v5", source: "ticket", productType: "saju_mbti_full", names: "이도윤" },
  { version: "v5", source: "paid", productType: "saju_mbti_full", names: "김도윤" },
  { version: "v5", source: "paid", productType: "career_money_study", names: "최지우" },
  { version: "v5", source: "paid", productType: "love_marriage_child", names: "정하은" },
  { version: "v5", source: "paid", productType: "saju_mbti_compatibility", names: "윤서아·강민준" },
  // AM: 대운·세운 v5 결제 책(12/1 형식 추가).
  { version: "v5", source: "paid", productType: "major_fortune", names: "한서진" },
  { version: "v5", source: "paid", productType: "annual_fortune", names: "오하린" },
];
const label = (r: Row) => `${r.version} ${r.source === "paid" ? "결제" : "이용권"} ${r.productType}`;
const modelOf = (r: Row, i: number): BookShareModel => {
  const token = `gr_${`${r.version}${r.source}${i}`.padEnd(32, "x")}`;
  const model = projectBookShare({ productType: r.productType, names: r.names, shareUrl: `https://gyeolreport.com/r/${token}`, publishedAt: "2026-11-06T11:20:45.000Z", expiresAt: "2027-02-04T11:20:45.000Z" });
  if (!model?.isShareable || !model.shareUrl) throw new Error(`공유 모델을 못 만듦: ${label(r)}`);
  return model;
};

// 책 공유 칸만 묶는다. 페이지 밖 의존(next/script·next/image 쪽 표지 그림·출시 이벤트 조회·분석)만 가짜로 바꾸고,
// BookShareActions와 src/lib/sharing/shareBrowser.ts는 그대로 쓴다.
const STUBS: Record<string, string> = {
  "next-script": "export default function Script() { return null; }",
  "book-pages": "export function ShareIcon() { return null; }",
  "launch": "export function useLaunchEvent() { return { view: null, remaining: null }; }",
  "analytics": "export async function syncLocalFacts() {}",
  "css": "export default new Proxy({}, { get: (_, key) => String(key) });",
};
const stubPlugin: Plugin = {
  name: "share-stubs",
  setup(b) {
    b.onResolve({ filter: /^next\/script$/ }, () => ({ path: "next-script", namespace: "stub" }));
    b.onResolve({ filter: /book-preview\/BookPages$/ }, () => ({ path: "book-pages", namespace: "stub" }));
    b.onResolve({ filter: /growth\/LaunchCountdown$/ }, () => ({ path: "launch", namespace: "stub" }));
    b.onResolve({ filter: /analytics\/client$/ }, () => ({ path: "analytics", namespace: "stub" }));
    b.onResolve({ filter: /\.module\.css$/ }, () => ({ path: "css", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, a => ({ contents: STUBS[a.path], loader: "tsx", resolveDir: ROOT }));
  },
};
const ENTRY = `import { createRoot } from "react-dom/client";
import { BookShareActions } from "./src/components/book/BookShareActions";
const report = new URLSearchParams(location.search).get("report") ?? "";
createRoot(document.getElementById("root")!).render(<BookShareActions owner={{ reportId: report }} />);`;
const HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>share</title></head><body><div id="root"></div><script src="/app.js"></script></body></html>`;

// 페이지 안 기록: 클릭 안에서 불렸는지(window 캡처 → React 처리 → window 버블 사이), navigator.userActivation, 실제 writeText 결과.
// 카카오 SDK와 navigator.share만 가짜(외부 앱을 열 수 없다). 클립보드는 WebKit 실제 것을 감싸 기록만 한다.
function instrument() {
  type Entry = { kind: string; text?: string; inClick: boolean; active: boolean | null; result?: string };
  const w = window as unknown as { __log: Entry[]; __inClick: boolean; __shareMode: string; Kakao: unknown };
  w.__log = []; w.__inClick = false; w.__shareMode = "resolve";
  const active = () => (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive ?? null;
  window.addEventListener("click", () => { w.__inClick = true; }, true);
  window.addEventListener("click", () => { w.__inClick = false; });
  let initialized = false;
  w.Kakao = {
    init() { initialized = true; },
    isInitialized() { return initialized; },
    Share: { sendDefault(card: { buttons: { link: { mobileWebUrl: string; webUrl: string } }[]; content: { link: { webUrl: string } } }) {
      const link = card.buttons[0].link;
      w.__log.push({ kind: "kakao", text: link.mobileWebUrl === link.webUrl && card.content.link.webUrl === link.webUrl ? link.webUrl : "LINK_MISMATCH", inClick: w.__inClick, active: active() });
    } },
  };
  Object.defineProperty(navigator, "share", { configurable: true, value: (data: ShareData) => {
    w.__log.push({ kind: "share", text: data.url, inClick: w.__inClick, active: active() });
    return w.__shareMode === "abort" ? Promise.reject(new DOMException("사용자가 닫음", "AbortError")) : Promise.resolve();
  } });
  const clipboard = navigator.clipboard, real = clipboard?.writeText.bind(clipboard);
  if (clipboard && real) clipboard.writeText = (text: string) => {
    const entry: Entry = { kind: "clip", text, inClick: w.__inClick, active: active() };
    w.__log.push(entry);
    return real(text).then(() => { entry.result = "resolved"; }, (error: Error) => { entry.result = `rejected:${error.name}`; throw error; });
  };
}

type Api = { status: number; model?: BookShareModel; abort?: boolean };
let browser: Browser, bundle = "";
beforeAll(async () => {
  const out = await build({
    stdin: { contents: ENTRY, loader: "tsx", resolveDir: ROOT, sourcefile: "share-entry.tsx" },
    bundle: true, write: false, platform: "browser", format: "iife", jsx: "automatic", target: "safari16", logLevel: "silent",
    tsconfig: resolve(ROOT, "tsconfig.json"), plugins: [stubPlugin],
    define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY": '"webkit-test-kakao-key"' },
    banner: { js: "globalThis.process = globalThis.process || { env: {} };" },
  });
  bundle = out.outputFiles[0].text;
  try { browser = await webkit.launch(); }
  catch (error) { throw new Error(`Playwright WebKit을 띄우지 못했습니다(webkit-2215, ~/Library/Caches/ms-playwright). 이 시험은 건너뛰지 않습니다: ${String(error).slice(0, 300)}`); }
}, 180_000);
afterAll(async () => { await browser?.close(); });

/** iPhone 13 화면·터치, 안전한 출처(https://share.test). 공유 API는 queue 순서대로 답한다(마지막 답은 계속 쓴다). */
async function open(queue: Api[], report = "report_webkit_share_00000001"): Promise<{ page: Page; context: BrowserContext; requests: unknown[] }> {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const requests: unknown[] = [];
  await context.addInitScript(instrument);
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    if (url.pathname === "/") return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: HTML });
    if (url.pathname === "/app.js") return route.fulfill({ status: 200, contentType: "text/javascript; charset=utf-8", body: bundle });
    if (url.pathname === "/api/book-share" && route.request().method() === "POST") {
      requests.push(route.request().postDataJSON());
      const next = queue.length > 1 ? queue.shift()! : queue[0];
      if (next.abort) return route.abort("failed");
      return route.fulfill({ status: next.status, contentType: "application/json", body: next.model ? JSON.stringify({ model: next.model }) : "{}" });
    }
    return route.fulfill({ status: 404, body: "" });
  });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/?report=${report}`);
  return { page, context, requests };
}
const log = (page: Page) => page.evaluate(() => (window as unknown as { __log: { kind: string; text?: string; inClick: boolean; active: boolean | null; result?: string }[] }).__log);
const status = (page: Page) => page.locator("[role=status]");
const button = (page: Page, mode: "kakao" | "native" | "copy") => page.locator(`[data-share-mode=${mode}]`);
const state = (page: Page, value: string) => page.waitForSelector(`[data-share-state="${value}"]`);
const insideGesture = (e: { inClick: boolean; active: boolean | null }) => e.inClick && e.active !== false;

describe("책 공유 버튼 — 실제 WebKit(iPhone 13)", () => {
  it("형식 표가 출시 v5 상품을 모두 덮는다(대운·세운 v5를 출시 목록에 넣으면 여기서 실패 — 이 표와 bookShareV5 형식 표에 줄을 더할 것)", () => {
    for (const product of LAUNCH_V5_PRODUCTS) expect(ROWS.some(r => r.version === "v5" && r.source === "paid" && r.productType === product), product).toBe(true);
    for (const version of ["v4", "v5"] as const) for (const source of ["paid", "ticket"] as const) expect(ROWS.some(r => r.version === version && r.source === source), `${version} ${source}`).toBe(true);
  });

  it.each(ROWS.map((r, i) => [label(r), r, i] as const))("%s: 미리 받기 1번 → 링크 복사·카카오톡·공유하기가 모두 제스처 안에서 같은 링크, 공유 취소는 조용히", async (_name, row, i) => {
    const model = modelOf(row, i), url = model.shareUrl!;
    const { page, context, requests } = await open([{ status: 200, model }]);
    try {
      await state(page, "ready");
      // 링크 복사: 실제 WebKit writeText가 클릭 안에서 불리고 resolve.
      await button(page, "copy").tap();
      await expect.poll(async () => (await status(page).textContent())?.trim()).toBe(SHARE_STATUS.copied);
      const clip = (await log(page)).filter(e => e.kind === "clip");
      expect(clip).toHaveLength(1);
      expect(clip[0]).toMatchObject({ text: url, result: "resolved" });
      expect(insideGesture(clip[0]), JSON.stringify(clip[0])).toBe(true);
      expect(await page.locator("input[aria-label='복사할 공유 링크']").count()).toBe(0);
      // 카카오톡: SDK sendDefault가 클릭 안에서 같은 링크로.
      await button(page, "kakao").tap();
      await expect.poll(async () => (await status(page).textContent())?.trim()).toBe(SHARE_STATUS.kakao);
      const kakao = (await log(page)).filter(e => e.kind === "kakao");
      expect(kakao).toHaveLength(1);
      expect(kakao[0].text).toBe(url);
      expect(insideGesture(kakao[0]), JSON.stringify(kakao[0])).toBe(true);
      // 공유하기: navigator.share가 클릭 안에서 같은 링크로.
      await button(page, "native").tap();
      await expect.poll(async () => (await status(page).textContent())?.trim()).toBe(SHARE_STATUS.shared);
      // 공유 창을 닫으면(AbortError) 아무 말도 없고 복사로 넘어가지 않는다.
      await page.evaluate(() => { (window as unknown as { __shareMode: string }).__shareMode = "abort"; });
      await button(page, "native").tap();
      await expect.poll(async () => (await log(page)).filter(e => e.kind === "share").length).toBe(2);
      await page.waitForTimeout(300);
      expect((await status(page).textContent())?.trim()).toBe("");
      const shares = (await log(page)).filter(e => e.kind === "share");
      for (const s of shares) { expect(s.text).toBe(url); expect(insideGesture(s), JSON.stringify(s)).toBe(true); }
      expect((await log(page)).filter(e => e.kind === "clip")).toHaveLength(1);
      // 버튼 누름은 링크를 다시 받지 않는다(미리 받은 링크를 바로 쓴다).
      expect(requests).toEqual([{ reportId: "report_webkit_share_00000001" }]);
      expect(await page.locator("[data-share-mode]").count()).toBe(3);
    } finally { await context.close(); }
  }, 90_000);

  it.each([
    [403, SHARE_STATUS.owner],
    [404, SHARE_STATUS.failed],
    [503, SHARE_STATUS.failed],
    [0, SHARE_STATUS.failed],
  ] as const)("미리 받기 실패 %i: 버튼 3개가 남고 안내 문구, 다시 누르면 다시 받고 다음 누름에서 복사", async (code, text) => {
    const model = modelOf(ROWS[3], 3), url = model.shareUrl!;
    const { page, context, requests } = await open([code === 0 ? { status: 0, abort: true } : { status: code }, { status: 200, model }]);
    try {
      await state(page, "unavailable");
      expect((await status(page).textContent())?.trim()).toBe(text);
      expect(await page.locator("[data-share-mode]").count()).toBe(3);
      for (const mode of ["kakao", "native", "copy"] as const) expect(await button(page, mode).isEnabled(), mode).toBe(true);
      // 다시 누름: 공유하지 않고 링크만 다시 받는다(없는 링크를 복사하지 않음).
      await button(page, "copy").tap();
      await state(page, "ready");
      expect(requests).toHaveLength(2);
      expect((await log(page)).filter(e => e.kind === "clip")).toHaveLength(0);
      expect((await status(page).textContent())?.trim()).toBe("");
      // 다음 누름: 클릭 안에서 실제 복사.
      await button(page, "copy").tap();
      await expect.poll(async () => (await status(page).textContent())?.trim()).toBe(SHARE_STATUS.copied);
      const clip = (await log(page)).filter(e => e.kind === "clip");
      expect(clip).toHaveLength(1);
      expect(clip[0]).toMatchObject({ text: url, result: "resolved" });
      expect(insideGesture(clip[0]), JSON.stringify(clip[0])).toBe(true);
    } finally { await context.close(); }
  }, 90_000);
});
