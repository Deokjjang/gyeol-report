/**
 * P 추가 J 화면 캡처: node tools/perf/capture.mjs <base> <outDir> [장면...]
 * 서버는 tools/perf/serve.sh(next start + 운영 출처 흉내). 계정 쿠키는 tools/perf/cookies.ts(a b re new ca).
 * 장면(이 순서로 — 선물 장면이 이용권을 쓰므로 마지막): library library-zero gift-sheet checkout-tickets checkout-zero checkout-guest inapp-login home popup-1 popup-2 popup-3 expired reconsent gift-new gift-member gift-gone
 * 다시 찍기 전에는 tools/perf/seed.ts로 시드를 되돌린다.
 * 휴대폰(390×844)과 데스크톱(1280×900) 두 장씩. 운영 사이트로 나가는 요청은 막는다.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
const PW = process.env.PLAYWRIGHT ?? "/Users/Deokmin/Developer/gyeol-worktrees/v5-ui/node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);
const here = dirname(fileURLToPath(import.meta.url));
const [base, outDir, ...wanted] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const state = JSON.parse(readFileSync(join(here, ".state.json"), "utf8"));
const cookies = n => JSON.parse(readFileSync(join(here, `.cookies-${n}.json`), "utf8"));
const token = () => randomBytes(24).toString("base64url");
const DRAFT = { version: 1, state: { person: { name: "하람", birthDate: "1996-12-06", paidBirthTimeMode: "exact", birthTime: "09:30", timeBranch: "", birthTimeUnknown: false, gender: "MALE", mbtiType: "ENTJ", jobStatus: "employee", detailedJob: "서비스 기획자", relationshipStatus: "single", focusAreas: [], selectedYear: "2026" }, personB: { name: "", birthDate: "", paidBirthTimeMode: "exact", birthTime: "", timeBranch: "", birthTimeUnknown: false, gender: "", mbtiType: "", jobStatus: "", detailedJob: "", relationshipStatus: "", focusAreas: [], selectedYear: "2026" }, category: "love" } };
const browser = await chromium.launch();
async function ctxFor(view, as, opts = {}) {
  const mobile = view === "mobile";
  const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, ...(opts.ua ? { userAgent: opts.ua } : {}) });
  if (as) await ctx.addCookies(cookies(as));
  await ctx.route(/^https:\/\/(www\.)?gyeolreport\.com\//, r => r.abort());
  await ctx.addInitScript(({ popups, draft }) => {
    try {
      localStorage.setItem("gyeol-meta-card-seen", "meta-20261020-v2");
      if (!popups) for (const id of ["event-1plus1", "comp-b", "comp-a"]) sessionStorage.setItem(`gyeol-popup:${id}-202611:closed`, "1");
      if (draft) { sessionStorage.setItem("gyeol-book-input-v1:saju_mbti_full", JSON.stringify(draft)); sessionStorage.setItem("gyeol-book-receipt-return-v1:saju_mbti_full", "1"); }
    } catch {}
  }, { popups: !!opts.popups, draft: opts.draft ? DRAFT : null });
  return ctx;
}
async function newGiftLink(as) {
  const ctx = await ctxFor("desktop", as); const page = await ctx.newPage();
  await page.goto(`${base}/account`, { waitUntil: "load" });
  const t = token();
  const r = await page.evaluate(async t => (await fetch("/auth/gift", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ op: "link_next", token: t }) })).json(), t);
  await ctx.close();
  if (!r.ok) throw new Error(`gift link: ${JSON.stringify(r)}`);
  return t;
}
const scenes = {
  library: { as: "a", path: "/account", wait: '[aria-label="내 책 목록"] li' },
  "library-zero": { as: "zero", path: "/account", wait: "[data-library-empty]" },
  "gift-sheet": { as: "a", path: "/account", wait: '[data-ticket-summary] button', act: async p => { await p.click('[data-ticket-summary] button'); await p.waitForSelector("[data-gift-sheet]"); } },
  "checkout-tickets": { as: "a", path: "/report/new?product=saju-mbti-full", draft: true, wait: "[data-ticket-method] label" },
  "checkout-zero": { as: "zero", path: "/report/new?product=saju-mbti-full", draft: true, wait: "[data-book-checkout] button" },
  "checkout-guest": { path: "/report/new?product=saju-mbti-full", draft: true, wait: "[data-login-first]" },
  "inapp-login": { path: "/login", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.8.5", wait: "text=Google로 계속하기", act: async p => { await p.click("text=Google로 계속하기"); await p.waitForSelector("[data-in-app-help]"); } },
  home: { path: "/", wait: "[data-book-home]" },
  "popup-1": { path: "/", popups: true, wait: "[data-event-popup]" },
  "popup-2": { as: "a", path: "/", popups: true, wait: "[data-event-popup]" },
  "popup-3": { as: "ca", path: "/", popups: true, wait: "[data-event-popup]" },
  expired: { as: "a", path: `/reports/${state.expired}`, wait: "#report-status-title" },
  reconsent: { as: "re", path: "/account", wait: "[data-comp-waiting]" },
  "gift-new": { prep: () => newGiftLink("a"), path: t => `/gift/${t}`, wait: "#gift-title" },
  "gift-member": { prep: () => newGiftLink("ca"), as: "b", path: t => `/gift/${t}`, wait: "text=서재에 들어왔어요" },
  "gift-gone": { path: () => `/gift/${token()}`, wait: "#gift-title" },
};
for (const name of wanted.length ? wanted : Object.keys(scenes)) {
  const sc = scenes[name]; if (!sc) continue;
  for (const view of ["mobile", "desktop"]) {
    const extra = sc.prep ? await sc.prep() : undefined;
    const ctx = await ctxFor(view, sc.as, sc); const page = await ctx.newPage();
    const path = typeof sc.path === "function" ? sc.path(extra) : sc.path;
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
    let ok = true;
    try { await page.waitForSelector(sc.wait, { timeout: 20000 }); if (sc.act) await sc.act(page); } catch { ok = false; }
    await page.waitForTimeout(700);
    const file = join(outDir, `${name}-${view}.png`);
    await page.screenshot({ path: file, fullPage: !name.startsWith("popup") && !name.startsWith("gift-sheet") && !name.startsWith("inapp") });
    console.log(`${ok ? "OK " : "?? "}${name}-${view}.png  ${(await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 150)}`);
    await ctx.close();
  }
}
await browser.close();
