/**
 * 최종 A 16·15: 결제 화면(발행 주문서)·예시 페이지 캡처(데스크톱 1280 · 모바일 390). 호출 0 — 결제 버튼은 누르지 않는다.
 *   PLAYWRIGHT=<playwright index.mjs> BASE=http://localhost:4000 node tools/final4/checkout-capture.mjs <checkout|example> <prefix>
 *   예) … checkout checkout-before   → docs/v5/final4/captures/checkout-before-{desktop,mobile}.png
 * EVENT=1이면 이벤트 줄이 보이는 서버(GIFT_EVENT_* env)라고 보고 그 줄이 있는지 확인만 한다.
 */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:4000";
const [phase = "checkout", prefix = phase] = process.argv.slice(2);
const OUT = join(ROOT, "docs/v5/final4/captures");
mkdirSync(OUT, { recursive: true });
const SEEN = "gyeol-meta-card-seen:meta-20261020-v2";
const VIEWPORTS = { desktop: { width: 1280, height: 900 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch();
const log = (...a) => console.log(`[${phase}]`, ...a);

async function open(kind) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS[kind], deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" });
  await ctx.addInitScript(seenKey => {
    try { localStorage.setItem(seenKey, "1"); } catch { /* ignore */ }
    document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); });
  }, SEEN);
  const page = await ctx.newPage();
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|hydrat/i.test(m.text())) log("console:", m.text().slice(0, 160)); });
  return { ctx, page };
}

async function toReceipt(page) {
  await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
  await page.locator("#a-name").waitFor({ timeout: 60_000 });
  await page.locator("#a-name").fill("서하은");
  await page.locator("#a-birthDate").fill("2004-12-23");
  await page.locator("#a-gender").selectOption("FEMALE");
  await page.getByLabel("정확").check();
  await page.locator("#a-birthTime").fill("13:05");
  for (let i = 0; i < 4 && !(await page.locator("[data-book-checkout]").count()); i++) {
    const mbti = page.locator("select").filter({ hasText: "INFJ" }).first();
    if (await mbti.count()) await mbti.selectOption("INFJ").catch(() => {});
    await page.getByRole("button", { name: /다음 페이지/ }).last().click(); await page.waitForTimeout(900);
  }
  await page.waitForSelector("[data-book-checkout]", { timeout: 30_000 });
  await page.waitForTimeout(1200);
}

/** 주문서는 책 틀(.bookShell) 안에서 스크롤된다 — 틀 높이를 풀어 주문서 전체가 한 장에 들어오게 찍는다. */
async function shootReceipt(page, name) {
  await page.evaluate(() => {
    for (let el = document.querySelector("[data-book-checkout]"); el && el !== document.body; el = el.parentElement) {
      el.style.setProperty("height", "auto", "important"); el.style.setProperty("max-height", "none", "important");
      el.style.setProperty("overflow", "visible", "important");
      if (getComputedStyle(el).position === "absolute") el.style.setProperty("position", "relative", "important");
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  log("shot", name);
}

try {
  if (phase === "checkout") {
    for (const kind of ["desktop", "mobile"]) {
      const { ctx, page } = await open(kind);
      await toReceipt(page);
      const text = await page.locator("[data-book-checkout]").innerText();
      log(kind, "PRICE", /3,900원/.test(text) ? "3,900원" : "?", "event-line", text.includes("1+1 · 결제 후 무료 이용권 1장"), "example-link", await page.locator("[data-book-checkout] a[href='/example']").count());
      await shootReceipt(page, `${prefix}-${kind}`);
      await ctx.close();
    }
  } else if (phase === "example") {
    for (const kind of ["desktop", "mobile"]) {
      const { ctx, page } = await open(kind);
      await page.goto(`${BASE}/example`, { waitUntil: "load" });
      await page.waitForSelector("[data-example-page]", { timeout: 60_000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: join(OUT, `${prefix}-${kind}.png`), fullPage: false });
      log("shot", `${prefix}-${kind}`);
      // 끝 쪽(내 리포트 만들기)까지 넘겨서 한 장 더.
      for (let i = 0; i < 40; i++) {
        if (await page.locator("[data-example-end]").isVisible().catch(() => false)) break;
        const next = page.getByRole("button", { name: /다음 (쪽|페이지)/ }).last();
        if (!(await next.count()) || !(await next.isEnabled().catch(() => false))) break;
        await next.click(); await page.waitForTimeout(250);
      }
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(OUT, `${prefix}-${kind}-end.png`), fullPage: false });
      log("shot", `${prefix}-${kind}-end`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
