/**
 * AM 검토 묶음: 책마다 휴대폰 HTML · PDF · 캡처(로컬 dev 서버 tools/annual-major/dev-local.ts + 로컬 DB, 외부 호출 0).
 *   PLAYWRIGHT=<playwright index.mjs> node tools/annual-major/review-capture.mjs [case ...]
 * 먼저: tools/annual-major/review-seed.ts가 7부 책을 로컬 테스트 계정 서재에 심어 둔다(review-state.json).
 * 방법: 실제 독자 화면(/reports/<id>, 390×844, 2배)을 쪽마다 넘기며 그 쪽의 DOM(접힌 칸은 모두 펼침)과 화면 CSS를 모아
 *   - <case>/book.html : 쪽을 위아래로 이어 붙인 한 파일(CSS·글꼴 내장, 오프라인으로 열림). 각 쪽 위에 「NN / TT · 쪽 종류」.
 *   - <case>/book.pdf  : 같은 HTML을 390×844 쪽으로 인쇄(글자 선택·검색 가능).
 *   - <case>/pages/NN-<종류>.png : 쪽마다 전체 높이 캡처(쪽 안 스크롤까지).
 *   - <case>/phone/NN-<종류>.png : 실제 휴대폰 첫 화면(표지 + 쪽 종류마다 첫 쪽).
 *   - 세운: <case>/keyword-card.png(공유 링크의 키워드 카드 이미지, 이름 끔).
 * 결과는 git 밖(~/Desktop/gyeol-review/annual-major). 가상 인물 책이다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(homedir(), "Desktop", "gyeol-review", "annual-major");
const dev = JSON.parse(readFileSync(join(ROOT, ".cache", "am-dev.json"), "utf8"));
const BASE = dev.base;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(BASE)) throw new Error("로컬 서버만");
const state = JSON.parse(readFileSync(join(OUT, "review-state.json"), "utf8"));
const want = process.argv.slice(2);
const list = Object.keys(state).filter(c => !want.length || want.includes(c)).sort();
// 광고 동의 카드는 본 것으로(src/lib/analytics/metaConsent.ts META_CARD_SEEN_KEY, 판이 바뀌면 같이 바꾼다).
const SEEN = "gyeol-meta-card-seen:notice-20261109-optout";

const browser = await chromium.launch();
const storage = join(ROOT, ".cache", "am-review-storage.json");
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(existsSync(storage) ? { storageState: storage } : {}) });
await ctx.addInitScript(key => {
  try { localStorage.setItem(key, "1"); sessionStorage.setItem("gyeol-meta-card-later", "1"); } catch { /* 캡처 전용 */ }
  document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); });
}, SEEN);
const page = await ctx.newPage();
page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|hydrat/i.test(m.text())) console.log("console:", m.text().slice(0, 160)); });
await page.goto(`${BASE}/dev/v5-login?next=/account`, { waitUntil: "load", timeout: 180_000 });
await ctx.storageState({ path: storage });

const label = () => page.evaluate(() => document.querySelector("main")?.innerText.match(/(\d\d) \/ (\d\d)/)?.[0] ?? "");
const b64 = async url => Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");

/** 화면 CSS 전부(글꼴은 data URI로). 개발 서버 CSS는 같은 출처라 cssRules를 읽을 수 있다. */
async function collectCss() {
  const sheets = await page.evaluate(() => [...document.styleSheets].map(s => { try { return { href: s.href ?? location.href, rules: [...s.cssRules].map(r => r.cssText) }; } catch { return { href: s.href, rules: [] }; } }));
  const out = [];
  for (const s of sheets) for (let rule of s.rules) {
    if (rule.startsWith("@font-face")) for (const m of [...rule.matchAll(/url\("?([^")]+)"?\)/g)]) {
      if (m[1].startsWith("data:")) continue;
      const abs = new URL(m[1], s.href).href, type = abs.endsWith(".woff2") ? "font/woff2" : "font/woff";
      try { rule = rule.replace(m[0], `url("data:${type};base64,${await b64(abs)}")`); } catch { /* 글꼴을 못 받으면 대체 글꼴 */ }
    }
    out.push(rule);
  }
  return out.join("\n");
}

async function capture(c) {
  const { reportId, productType } = state[c], dir = join(OUT, c);
  mkdirSync(join(dir, "pages"), { recursive: true }); mkdirSync(join(dir, "phone"), { recursive: true });
  await page.goto(`${BASE}/reports/${reportId}`, { waitUntil: "load", timeout: 180_000 });
  await page.waitForSelector("[role=region][data-page]", { timeout: 120_000 });
  await page.waitForTimeout(800);
  const shell = await page.evaluate(() => { const r = document.querySelector("[role=region][data-page]"); const chain = []; let e = r.parentElement;
    while (e && e.tagName !== "BODY") { chain.unshift({ tag: e.tagName.toLowerCase(), cls: e.getAttribute("class") ?? "", style: e.getAttribute("style") ?? "" }); e = e.parentElement; }
    return { chain, body: document.body.getAttribute("class") ?? "", html: document.documentElement.getAttribute("class") ?? "" }; });
  const pages = [], kindsSeen = new Set(), seen = new Set();
  for (let guard = 0; guard < 120; guard++) {
    const lab = await label(), kind = await page.locator("[role=region][data-page]").first().getAttribute("data-page");
    const n = lab.slice(0, 2) || String(pages.length + 1).padStart(2, "0");
    if (!seen.has(lab)) {
      seen.add(lab);
      // 휴대폰 첫 화면: 넘김 애니메이션이 끝난 뒤(0.9초) 찍는다.
      if (!kindsSeen.has(kind) || n === "01") {
        kindsSeen.add(kind); await page.waitForTimeout(900);
        const later = page.getByRole("button", { name: "닫기(나중에 정하기)" });
        if (await later.count() && await later.first().isVisible()) { await later.first().click(); await page.waitForTimeout(300); }
        await page.screenshot({ path: join(dir, "phone", `${n}-${kind}.png`) });
      }
      const html = await page.evaluate(() => { const r = document.querySelector("[role=region][data-page]"); const clone = r.cloneNode(true);
        clone.querySelectorAll("details").forEach(d => d.setAttribute("open", "")); clone.querySelectorAll("script").forEach(s => s.remove()); return clone.outerHTML; });
      pages.push({ n, label: lab, kind, html });
    }
    const next = page.locator('button[aria-label="다음 페이지"]');
    if (!(await next.count()) || await next.isDisabled()) break;
    // 쪽 넘김: 첫 누름이 넘김 애니메이션·쪽 안 스크롤에 먹히는 때가 있어, 쪽 번호가 1.5초 안에 안 바뀌면 다시 누른다(최대 4번).
    for (let t = 0; t < 4 && (await label()) === lab; t++) {
      await next.click();
      for (let i = 0; i < 15 && (await label()) === lab; i++) await page.waitForTimeout(100);
    }
    if ((await label()) === lab) break;
    await page.waitForTimeout(150);
  }
  const css = await collectCss();
  const open = shell.chain.map((w, i) => `<${w.tag} class="${w.cls} am-w${i}"${w.style ? ` style="${w.style.replace(/"/g, "&quot;")}"` : ""}>`).join("");
  const close = [...shell.chain].reverse().map(w => `</${w.tag}>`).join("");
  const fix = `html,body{height:auto!important;min-height:0!important;overflow:visible!important;background:#e7e2da!important}
body{display:block!important;margin:0;padding:12px 0}
.am-page{width:390px;margin:0 auto 18px;background:#fff;break-after:page;page-break-after:always;position:relative;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.am-label{font:600 11px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#6b6259;padding:5px 12px;background:#f4f0ea;border-bottom:1px solid #e3ddd4}
.am-w0,.am-w1,.am-w2,.am-w3{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;position:relative!important;inset:auto!important;transform:none!important}
.am-page [role=region][data-page]{height:auto!important;max-height:none!important;overflow:visible!important;position:relative!important;inset:auto!important;transform:none!important;opacity:1!important}
@page{size:390px 844px;margin:0}`;
  const doc = `<!doctype html><html lang="ko" class="${shell.html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c} · AM 검토</title><style>${css}</style><style>${fix}</style></head>
<body class="${shell.body}">${pages.map(p => `<article class="am-page" id="p${p.n}"><div class="am-label">${p.label} · ${p.kind}</div>${open}${p.html}${close}</article>`).join("\n")}</body></html>`;
  writeFileSync(join(dir, "book.html"), doc);
  // 같은 HTML로 쪽 캡처·PDF
  const v = await ctx.newPage();
  await v.goto(pathToFileURL(join(dir, "book.html")).href, { waitUntil: "load" });
  await v.waitForTimeout(500);
  const arts = v.locator("article.am-page");
  for (let i = 0; i < pages.length; i++) await arts.nth(i).screenshot({ path: join(dir, "pages", `${pages[i].n}-${pages[i].kind}.png`) });
  await v.emulateMedia({ media: "screen" });
  await v.pdf({ path: join(dir, "book.pdf"), width: "390px", height: "844px", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } });
  await v.close();
  // 세운 키워드 카드(공유 링크 → /keyword-card, 이름 끔)
  if (productType === "annual_fortune") {
    const share = await page.evaluate(async rid => { const r = await fetch("/api/book-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId: rid }) }); return r.ok ? (await r.json())?.model?.shareUrl ?? null : `HTTP ${r.status}`; }, reportId);
    if (share && share.startsWith("http")) {
      const res = await page.request.get(`${BASE}${new URL(share).pathname}/keyword-card`);
      if (res.ok()) writeFileSync(join(dir, "keyword-card.png"), await res.body()); else console.log(c, "키워드 카드", res.status());
      state[c].shareUrl = new URL(share).pathname;
    } else console.log(c, "공유 링크", share);
  }
  console.log(`${c}: 쪽 ${pages.length} (${[...new Set(pages.map(p => p.kind))].join(",")})`);
  return pages.length;
}

/** 생성 대기 화면(review-seed.ts --wait가 심은 GENERATING 주문): 진행률·남은 시간 → 「1장 먼저 읽기」를 누른 뒤. 결과는 screens/. */
async function captureWaiting(c) {
  const { reportId } = state[c], dir = join(OUT, "screens");
  mkdirSync(dir, { recursive: true });
  await page.goto(`${BASE}/reports/${reportId}`, { waitUntil: "load", timeout: 180_000 });
  await page.waitForTimeout(4000);
  const later = page.getByRole("button", { name: "닫기(나중에 정하기)" });
  if (await later.count() && await later.first().isVisible()) { await later.first().click(); await page.waitForTimeout(300); }
  await page.screenshot({ path: join(dir, `${c}-progress.png`), fullPage: true });
  const text = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
  const first = page.locator("[data-first-chapter]");
  if (await first.count()) { await first.first().click(); await page.waitForSelector("[data-first-chapter-preview]", { timeout: 30_000 }).catch(() => null); await page.waitForTimeout(800); await page.screenshot({ path: join(dir, `${c}-first-chapter.png`), fullPage: true }); }
  writeFileSync(join(dir, `${c}.txt`), text);
  console.log(`${c}: 대기 화면 ${text.replace(/\s+/g, " ").slice(0, 160)}`);
}

for (const c of list) await (c.startsWith("wait-") ? captureWaiting(c) : capture(c));
writeFileSync(join(OUT, "review-state.json"), JSON.stringify(state, null, 1) + "\n");
await browser.close();
