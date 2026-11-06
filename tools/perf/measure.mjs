/**
 * P 측정: node tools/perf/measure.mjs <base> <runs> <out.json> [장면...]
 * 장면: home products nav library library-b reconsent book-v5 book-v4 book-v2 book-v1 book-expired gift
 * - TTFB(문서 응답 시작), FCP, LCP, 첫 내용(장면별 표시 선택자가 보인 시각), 상호작용 가능(load와 마지막 롱태스크 끝 중 늦은 것),
 *   JS 개수·KB, 요청 순서(fetch/document, 시작·끝 ms), 서버 Server-Timing(sim.mjs가 붙인 Supabase 호출 수·순차 단계).
 * - 로그인 장면은 tools/perf/.cookies-<계정>.json(cookies.ts)을 쓴다. 따뜻한 상태: 같은 장면을 한 번 먼저 열고 버린다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const PW = process.env.PLAYWRIGHT ?? "/Users/Deokmin/Developer/gyeol-worktrees/v5-ui/node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);
const here = dirname(fileURLToPath(import.meta.url));
const [base, runsArg, outFile, ...wanted] = process.argv.slice(2);
const runs = Number(runsArg || 3);
const state = JSON.parse(readFileSync(join(here, ".state.json"), "utf8"));
const cookies = name => JSON.parse(readFileSync(join(here, `.cookies-${name}.json`), "utf8"));
// 첫 내용 = 장면의 실제 내용이 DOM에 들어온 시각(로딩 뼈대·「확인 중」 문구는 제외).
const SHELF = `() => !!document.querySelector('[aria-label="내 책 목록"] li') || /아직 꽂힌 책이 없습니다|아직 만든 리포트가 없어요/.test(document.body.innerText)`;
const BOOK = `() => { if (document.querySelector("[data-book-report], [data-book-preview]")) return true; const t = document.body.innerText; if (/책장을 펼치고 있습니다/.test(t)) return false; return /PERSONAL EDITION|발행|열람 기간|제본|열람이 끝난|확인하지 못했습니다/.test(t); }`;
const scenes = {
  home: { path: "/", ready: `() => !!document.querySelector("[data-book-home] h1")` },
  products: { path: "/products", ready: `() => !!document.querySelector("[data-book-home] h1")` },
  nav: { path: "/", click: '[data-center="true"]', ready: `() => !!document.querySelector("[data-book-input] h1")`, navTo: "/report/new" },
  input: { path: "/report/new?product=saju-mbti-full", ready: `() => !!document.querySelector("[data-book-input] h1")` },
  library: { path: "/account", as: "a", ready: SHELF, tickets: true },
  "library-b": { path: "/account", as: "b", ready: SHELF, tickets: true },
  reconsent: { path: "/account", as: "re", ready: `() => document.body.innerText.includes("시작하기 전에")` },
  "book-v5": { path: `/reports/${state.books.a[3]}`, as: "a", ready: BOOK },
  "book-v4": { path: `/reports/${state.books.a[0]}`, as: "a", ready: BOOK },
  "book-v2": { path: `/reports/${state.books.a[1]}`, as: "a", ready: BOOK },
  "book-v1": { path: `/reports/${state.books.a[2]}`, as: "a", ready: BOOK },
  "book-expired": { path: `/reports/${state.expired}`, as: "a", ready: BOOK },
  waiting: { path: `/reports/${state.waiting}`, as: "a", ready: BOOK },
};
const browser = await chromium.launch();
const out = {};
async function once(scene, keep) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  if (scene.as) await ctx.addCookies(cookies(scene.as));
  // 운영 사이트로 나가는 요청은 막는다(측정은 로컬만).
  await ctx.route(/^https:\/\/(www\.)?gyeolreport\.com\//, r => r.abort());
  await ctx.addInitScript(() => {
    try { localStorage.setItem("gyeol-meta-card-seen", "meta-20261020-v2"); for (const id of ["event-1plus1", "comp-b", "comp-a"]) sessionStorage.setItem(`gyeol-popup:${id}-202611:closed`, "1"); } catch {}
    window.__lcp = 0; window.__lt = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt = Math.max(window.__lt, e.startTime + e.duration); }).observe({ type: "longtask", buffered: true }); } catch {}
  });
  const page = await ctx.newPage();
  // PERF_CPU_THROTTLE=4: 휴대폰 정도로 CPU를 느리게(CDP Emulation.setCPUThrottlingRate).
  if (process.env.PERF_CPU_THROTTLE) { const cdp = await ctx.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.PERF_CPU_THROTTLE) }); }
  const reqs = [], t0 = Date.now();
  page.on("requestfinished", async req => {
    if (!["fetch", "document", "xhr"].includes(req.resourceType())) return;
    const t = req.timing(); const r = await req.response();
    let st = ""; try { st = (await r.allHeaders())["server-timing"] ?? ""; } catch {}
    reqs.push({ url: req.url().replace(base, ""), type: req.resourceType(), status: r?.status(), start: Math.round(t.startTime - t0), end: Math.round(t.startTime - t0 + t.responseEnd), sb: (st.match(/calls (\d+) stages (\d+)/) ?? []).slice(1).map(Number) });
  });
  let js = 0, jsKB = 0;
  page.on("response", async r => { if (r.request().resourceType() === "script") { js++; try { jsKB += (await r.request().sizes()).responseBodySize / 1024; } catch {} } });
  await page.goto(base + scene.path, { waitUntil: "commit", timeout: 60000 });
  let readyAt = null;
  if (scene.click) {
    await page.waitForLoadState("load"); await page.waitForTimeout(800);
    // 전체 새로 고침이면 performance.now가 0부터 다시 시작한다 → 벽시계(Date.now)로 잰다.
    const c0 = Date.now();
    await page.click(scene.click);
    await page.waitForURL(u => u.pathname === scene.navTo, { timeout: 30000, waitUntil: "commit" });
    await page.waitForFunction(`(${scene.ready})()`, null, { timeout: 30000 });
    readyAt = Date.now() - c0;
  } else {
    if (scene.ready.startsWith("()")) await page.waitForFunction(`(${scene.ready})()`, null, { timeout: 30000 }).catch(() => null);
    else await page.waitForSelector(scene.ready, { timeout: 30000 }).catch(() => null);
    readyAt = Math.round(await page.evaluate(() => performance.now()));
  }
  let ticketsAt = null;
  if (scene.tickets) { await page.waitForFunction(() => /\d+장/.test(document.querySelector("[data-ticket-summary]")?.textContent ?? ""), null, { timeout: 30000 }).catch(() => null); ticketsAt = Math.round(await page.evaluate(() => performance.now())); }
  await page.waitForLoadState("load"); await page.waitForTimeout(1500);
  const m = await page.evaluate(() => { const nav = performance.getEntriesByType("navigation")[0]; const fcp = performance.getEntriesByName("first-contentful-paint")[0]; return { ttfb: Math.round(nav.responseStart), fcp: fcp ? Math.round(fcp.startTime) : null, lcp: Math.round(window.__lcp), load: Math.round(nav.loadEventEnd), lastLongTask: Math.round(window.__lt) }; });
  const text = (await page.locator("main").first().innerText().catch(() => "")).slice(0, 160).replace(/\s+/g, " ");
  await ctx.close();
  return { ...m, ready: readyAt, tickets: ticketsAt, tti: Math.max(m.load, m.lastLongTask, readyAt ?? 0), js, jsKB: Math.round(jsKB), reqs: keep ? reqs.sort((a, b) => a.start - b.start) : undefined, text };
}
const med = (xs) => { const v = xs.filter(x => x != null).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
for (const name of wanted.length ? wanted : Object.keys(scenes)) {
  const scene = scenes[name]; if (!scene) continue;
  await once(scene, false).catch(() => null); // 따뜻하게
  const samples = [];
  for (let i = 0; i < runs; i++) samples.push(await once(scene, i === 0));
  const row = Object.fromEntries(["ttfb", "fcp", "lcp", "ready", "tickets", "tti"].map(k => [k, med(samples.map(s => s[k]))]));
  out[name] = { median: row, samples };
  const api = samples[0].reqs.filter(r => r.type !== "document" && !/_rsc=/.test(r.url));
  console.log(`${name}\tTTFB ${row.ttfb}\tFCP ${row.fcp}\tLCP ${row.lcp}\t첫내용 ${row.ready}${row.tickets != null ? `\t이용권 ${row.tickets}` : ""}\tTTI ${row.tti}\tJS ${samples[0].js}/${samples[0].jsKB}KB\tAPI ${api.length}개: ${api.map(r => `${r.url.split("?")[0]}[${r.start}-${r.end}${r.sb.length ? ` sb${r.sb[0]}/${r.sb[1]}` : ""}]`).join(" ")}`);
  console.log(`  text: ${samples[0].text}`);
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
