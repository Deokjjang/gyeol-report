/**
 * 최종판3 1-7 확인(호출 0): 약관 재동의 전 회원(예전 문서 버전 동의)으로 로그인해 이미 산 책을 연다.
 *   PLAYWRIGHT=<playwright index.mjs> BASE=http://localhost:3800 AS=final node tools/final3/prior-consent-read.mjs <reportId>...
 * 출력: 계정 화면 상태(재동의 안내인지) + 책마다 열림 여부·보이는 글자 수·sha256 앞 16자.
 */
import { createHash } from "node:crypto";
const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const BASE = process.env.BASE ?? "http://localhost:3800", AS = process.env.AS ?? "final";
const ids = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "ko-KR", timezoneId: "Asia/Seoul" });
await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* */ } });
const page = await ctx.newPage();
const rows = [];
try {
  await page.goto(`${BASE}/dev/v5-login?as=${AS}&next=${encodeURIComponent("/account")}`, { waitUntil: "load" });
  await page.goto(`${BASE}/account`, { waitUntil: "load" }); await page.waitForTimeout(1500);
  const account = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  rows.push({ page: "/account", needsConsent: account.includes("시작하기 전에"), text: account.slice(0, 80) });
  for (const id of ids) {
    await page.goto(`${BASE}/reports/${id}`, { waitUntil: "load" }); await page.waitForTimeout(2500);
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
    const blocked = /리포트 상태를 확인하지 못했습니다|고객센터/.test(text) && text.length < 2000;
    rows.push({ page: `/reports/${id}`, opened: !blocked, chars: text.length, sha16: createHash("sha256").update(text).digest("hex").slice(0, 16), head: text.slice(0, 60) });
  }
} finally { await browser.close(); }
console.log(JSON.stringify(rows, null, 1));
