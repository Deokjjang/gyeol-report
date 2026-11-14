/**
 * AM2-3 7부 화면 확인(로컬 dev 서버 tools/annual-major/dev-local.ts + review-seed.ts로 심은 책, 외부 호출 0).
 *   PLAYWRIGHT=<playwright index.mjs> [ENGINE=webkit] node tools/annual-major/am2-screens.mjs <out-dir> <case> [case ...]
 * ENGINE=webkit: WebKit(사파리 엔진) + iPhone 13 기기 값(390×664 · 3배 · 터치)으로 찍는다 — 파일 이름 끝에 -webkit. 실기기 확인을 대신하지는 않는다.
 * 실제 독자 화면(/reports/<id>, 390×844, 2배)을 넘기며 새 쪽(흐름표 · 달 카드 · 평생 대운 지도 · 10년표 · 해 카드)을 밝은 화면·다크 화면으로 한 장씩 찍고,
 * 글자와 바탕의 대비(WCAG, 4.5:1 이상)를 쪽 안 모든 글자 요소에서 잰다(가로 넘침도). 결과: <out-dir>/<case>-<쪽>-<light|dark>.png + contrast-<cases>.json.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const pw = await import(process.env.PLAYWRIGHT ?? "playwright"), ENGINE = process.env.ENGINE === "webkit" ? "webkit" : "chromium";
const ROOT = resolve(import.meta.dirname, "../..");
const dev = JSON.parse(readFileSync(join(ROOT, ".cache", "am-dev.json"), "utf8"));
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(dev.base)) throw new Error("로컬 서버만");
const state = JSON.parse(readFileSync(join(homedir(), "Desktop", "gyeol-review", "annual-major", "review-state.json"), "utf8"));
const [outDir, ...cases] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const WANT = { flowTable: "flow-table", periodCard: "card", decadeTable: "decade-table", lifetime: "lifetime" };
const browser = await pw[ENGINE].launch();
const device = ENGINE === "webkit" ? pw.devices["iPhone 13"] : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };
const storage = join(ROOT, ".cache", "am-review-storage.json");
const report = {};
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ ...device, locale: "ko-KR", timezoneId: "Asia/Seoul", colorScheme: scheme, ...(existsSync(storage) ? { storageState: storage } : {}) });
  await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:notice-20261109-optout", "1"); sessionStorage.setItem("gyeol-meta-card-later", "1"); } catch { /* 캡처 전용 */ }
    document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); }); });
  const page = await ctx.newPage();
  await page.goto(`${dev.base}/dev/v5-login?next=/account`, { waitUntil: "load", timeout: 180_000 });
  await ctx.storageState({ path: storage });
  for (const c of cases) {
    const { reportId } = state[c];
    await page.goto(`${dev.base}/reports/${reportId}`, { waitUntil: "load", timeout: 180_000 });
    await page.waitForSelector("[role=region][data-page]", { timeout: 120_000 });
    await page.waitForTimeout(800);
    const done = new Set(); let cardShots = 0;
    for (let guard = 0; guard < 140; guard++) {
      const kind = await page.locator("[role=region][data-page]").first().getAttribute("data-page");
      const am = await page.locator("[data-am]").first().getAttribute("data-am").catch(() => null);
      const isCard = kind === "periodCard", key = isCard ? `card${cardShots}` : kind;
      if (WANT[kind] && am && !done.has(key) && (!isCard || cardShots < 2)) {
        done.add(key); if (isCard) cardShots++;
        const later = page.getByRole("button", { name: "닫기(나중에 정하기)" });
        if (await later.count() && await later.first().isVisible()) { await later.first().click(); await page.waitForTimeout(300); }
        await page.evaluate(() => document.querySelectorAll("[data-am] details").forEach(d => d.setAttribute("open", "")));
        await page.waitForTimeout(400);
        const name = `${c}-${WANT[kind]}${isCard ? cardShots : ""}-${scheme}${ENGINE === "webkit" ? "-webkit" : ""}`;
        await page.screenshot({ path: join(outDir, `${name}.png`), fullPage: false });
        // 쪽 안 전체 높이(스크롤 영역)도 한 장.
        const region = page.locator("[role=region][data-page]").first();
        await region.screenshot({ path: join(outDir, `${name}-full.png`) }).catch(() => {});
        report[name] = await page.evaluate(() => {
          // 불투명도(opacity)는 글자색을 바탕과 섞어 실제로 보이는 색으로 잰다(흐리게 한 줄도 4.5:1 대상).
          const rgb = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return a < 0.2 ? null : [r, g, b]; };
          const L = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
          const bgRgb = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c) return c; } return [255, 255, 255]; };
          const out = []; let worst = 99;
          for (const el of document.querySelectorAll("[data-am] *")) {
            if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
            const st = getComputedStyle(el); if (st.visibility === "hidden" || st.display === "none") continue;
            const fc = rgb(st.color); if (!fc) continue;
            let op = 1; for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
            const bc = bgRgb(el), seen = fc.map((v, i) => v * op + bc[i] * (1 - op)), fg = L(seen), bg = L(bc);
            const eff = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
            worst = Math.min(worst, eff); if (eff < 4.5) out.push({ text: el.textContent.trim().slice(0, 30), ratio: Number(eff.toFixed(2)) });
          }
          const over = document.documentElement.scrollWidth > window.innerWidth + 1;
          // AM2-4 6부: 흐름표·10년표 「뜻」 한 줄이 390px에서 두 줄을 넘지 않는지(줄 수 = 높이 ÷ 줄 높이).
          const rowLines = [...document.querySelectorAll("[data-row-line]")].map(el => ({ text: el.textContent.trim(), lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)) }));
          return { worst: Number(worst.toFixed(2)), below: out.slice(0, 10), horizontalOverflow: over, ...(rowLines.length ? { maxRowLines: Math.max(...rowLines.map(r => r.lines)), overTwo: rowLines.filter(r => r.lines > 2) } : {}) };
        });
      }
      const next = page.locator('button[aria-label="다음 페이지"]');
      if (!(await next.count()) || await next.isDisabled()) break;
      const before = await page.locator("main").innerText().then(t => t.match(/(\d\d) \/ (\d\d)/)?.[0] ?? "");
      for (let t = 0; t < 4; t++) { await next.click(); await page.waitForTimeout(500); const now = await page.locator("main").innerText().then(t2 => t2.match(/(\d\d) \/ (\d\d)/)?.[0] ?? ""); if (now !== before) break; }
    }
  }
  await ctx.close();
}
await browser.close();
// 여러 프로세스가 같은 폴더에 찍어도 겹치지 않게 사례·엔진별 파일.
writeFileSync(join(outDir, `contrast-${cases.join("+")}${ENGINE === "webkit" ? "-webkit" : ""}.json`), JSON.stringify(report, null, 1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, v]) => [k, `${v.worst}${v.below.length ? ` 낮음 ${v.below.length}` : ""}${v.horizontalOverflow ? " 가로넘침" : ""}${v.maxRowLines ? ` · 표 한 줄 최대 ${v.maxRowLines}줄` : ""}`])), null, 1));
