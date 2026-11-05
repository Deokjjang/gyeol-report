// 최종 A 13·14 화면 캡처(로컬 dev 서버 전용, 호출 0): 메인 타이머(시작 전·중), 팝업 ①②③ 데스크톱(1280)·모바일(390).
//   PLAYWRIGHT=<playwright index.mjs> node tools/final4/capture-event.mjs <base> <phase:before|during> [out=docs/v5/final4/captures]
// 로그인은 /dev/v5-login?as=<이름>(로컬 검수 계정 p6e-<이름>@gyeol.local). ②=f4b1(B), ③=f4a1(A).
import { mkdirSync } from "node:fs";
const { chromium } = await import(process.env.PLAYWRIGHT);
const [base = "http://localhost:3900", phase = "during", out = "docs/v5/final4/captures"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const sizes = { desktop: { width: 1280, height: 860 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch();
const seenMeta = () => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* */ } };
async function shot(name, size, { as = null, path = "/", popup = null, clip = false } = {}) {
  const ctx = await browser.newContext({ viewport: sizes[size], deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" });
  // 광고 동의 카드는 이미 본 것으로(화면 맨 위 흐름 카드가 캡처를 가리지 않게).
  await ctx.addCookies([{ name: "gyeol_meta_card_seen", value: "1", url: base }]);
  await ctx.addInitScript(seenMeta);
  const page = await ctx.newPage();
  if (as) { await page.goto(`${base}/dev/v5-login?as=${as}&next=${encodeURIComponent(path)}`, { waitUntil: "load" }); }
  else await page.goto(`${base}${path}`, { waitUntil: "load" });
  if (popup) await page.waitForSelector(`dialog[data-event-popup="${popup}"][open]`, { timeout: 20_000 });
  else await page.waitForSelector("[data-gift-event]", { timeout: 20_000 });
  await page.waitForTimeout(2500);
  const file = `${out}/${name}-${size}.png`;
  await page.screenshot({ path: file, fullPage: false });
  const text = popup ? await page.locator(`dialog[data-event-popup="${popup}"]`).innerText() : await page.locator("[data-gift-event]").innerText();
  console.log(JSON.stringify({ file, text: text.replace(/\s+/g, " ").slice(0, 300) }));
  await ctx.close();
}
if (phase === "before") {
  for (const size of ["desktop", "mobile"]) await shot("main-timer-before", size, {});
} else {
  for (const size of ["desktop", "mobile"]) {
    await shot("popup-1-event", size, { popup: "event-1plus1" });
    await shot("popup-2-comp-b", size, { as: "f4b1", popup: "comp-b" });
    await shot("popup-3-comp-a", size, { as: "f4a1", popup: "comp-a" });
  }
  // 타이머(진행 중): 팝업을 오늘 하루 숨긴 상태로 메인만.
  for (const size of ["desktop", "mobile"]) {
    const ctx = await browser.newContext({ viewport: sizes[size], deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" });
    await ctx.addCookies([{ name: "gyeol_meta_card_seen", value: "1", url: base }]);
    await ctx.addInitScript(seenMeta);
    await ctx.addInitScript(() => { try { sessionStorage.setItem("gyeol-popup:event-1plus1-202611:closed", "1"); } catch { /* */ } });
    const page = await ctx.newPage();
    await page.goto(`${base}/`, { waitUntil: "load" });
    await page.waitForSelector("[data-gift-event=during]", { timeout: 20_000 });
    await page.waitForTimeout(1200);
    const file = `${out}/main-timer-during-${size}.png`;
    await page.screenshot({ path: file });
    console.log(JSON.stringify({ file, text: (await page.locator("[data-gift-event]").innerText()).replace(/\s+/g, " "), popupOpen: await page.locator("dialog[open]").count() }));
    await ctx.close();
  }
  // 상품 화면(모바일): 팝업이 아래 쪽 넘김 줄을 가리지 않는지 — 카드 아래 끝과 쪽 넘김 줄 위 끝.
  const ctx = await browser.newContext({ viewport: sizes.mobile, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" });
  await ctx.addCookies([{ name: "gyeol_meta_card_seen", value: "1", url: base }]);
  await ctx.addInitScript(seenMeta);
  const page = await ctx.newPage();
  await page.goto(`${base}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
  await page.waitForSelector('dialog[data-event-popup="event-1plus1"][open]', { timeout: 20_000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/popup-1-event-product-mobile.png` });
  const card = await page.locator("dialog[open]").boundingBox();
  const nav = await page.evaluate(() => { const els = [...document.querySelectorAll("nav, [class*=pageNav]")].map(e => e.getBoundingClientRect()).filter(r => r.height > 0); return els.length ? Math.min(...els.map(r => r.top)) : null; });
  console.log(JSON.stringify({ productPopupBottom: card ? card.y + card.height : null, pageNavTop: nav, viewport: sizes.mobile.height }));
  // 읽는 화면에는 없다.
  await page.goto(`${base}/reports/report_00000000000000000000000000000000`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  console.log(JSON.stringify({ readerPopups: await page.locator("dialog[data-event-popup]").count() }));
  await ctx.close();
}
await browser.close();
