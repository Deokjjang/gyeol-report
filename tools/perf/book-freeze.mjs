/**
 * 회귀: 과거 Book 세 계열(v1·v2 레거시 화면, v4, v5) 열람 화면이 기준 트리와 같은가 — 같은 DB·같은 계정·같은 화면 크기로 찍어 바이트 비교.
 *   node tools/perf/book-freeze.mjs <기준 base> <브랜치 base> <outDir>
 * 책장 넘김 애니메이션·시계 영향을 없애려고 애니메이션을 끄고, 첫 화면과 몇 쪽 넘긴 화면을 찍는다.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const PW = process.env.PLAYWRIGHT ?? "/Users/Deokmin/Developer/gyeol-worktrees/v5-ui/node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);
const here = dirname(fileURLToPath(import.meta.url));
const [baseA, baseB, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const state = JSON.parse(readFileSync(join(here, ".state.json"), "utf8"));
const cookies = JSON.parse(readFileSync(join(here, ".cookies-a.json"), "utf8"));
const books = { v4: state.books.a[0], v2: state.books.a[1], v1: state.books.a[2], v5: state.books.a[3], v5b: state.books.a[6] };
const browser = await chromium.launch();
const sha = b => createHash("sha256").update(b).digest("hex").slice(0, 16);
let same = 0, diff = 0;
for (const [label, id] of Object.entries(books)) {
  for (const view of [{ name: "mobile", width: 390, height: 844, isMobile: true }, { name: "desktop", width: 1280, height: 900, isMobile: false }]) {
    const shots = [];
    for (const [tag, base] of [["base", baseA], ["branch", baseB]]) {
      const ctx = await browser.newContext({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: 1, isMobile: view.isMobile, hasTouch: view.isMobile, reducedMotion: "reduce" });
      await ctx.addCookies(cookies);
      await ctx.route(/^https:\/\/(www\.)?gyeolreport\.com\//, r => r.abort());
      await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen", "meta-20261020-v2"); } catch {} });
      const page = await ctx.newPage();
      await page.goto(`${base}/reports/${id}`, { waitUntil: "load" });
      await page.waitForFunction(() => !/책장을 펼치고 있습니다/.test(document.body.innerText) || !!document.querySelector("[data-book-report]"), null, { timeout: 30000 });
      await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
      await page.waitForTimeout(1200);
      const first = await page.screenshot({ fullPage: !view.isMobile && !(await page.$("[data-book-report]")) });
      // 책 리더면 세 쪽 넘긴 화면도.
      let later = Buffer.alloc(0);
      if (await page.$("[data-book-report]")) { for (let i = 0; i < 3; i++) { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(400); } later = await page.screenshot(); }
      shots.push({ tag, first, later });
      await ctx.close();
    }
    const [a, b] = shots;
    const ok = a.first.equals(b.first) && a.later.equals(b.later);
    if (ok) same++; else diff++;
    const { writeFileSync } = await import("node:fs");
    if (!ok) for (const s of shots) { writeFileSync(join(outDir, `${label}-${view.name}-${s.tag}-1.png`), s.first); if (s.later.length) writeFileSync(join(outDir, `${label}-${view.name}-${s.tag}-4.png`), s.later); }
    console.log(`${ok ? "SAME" : "DIFF"} ${label} ${view.name} first ${sha(a.first)}/${sha(b.first)}${a.later.length ? ` page4 ${sha(a.later)}/${sha(b.later)}` : ""}`);
  }
}
console.log(`same ${same} diff ${diff}`);
await browser.close();
