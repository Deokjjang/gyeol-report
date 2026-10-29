import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const login = await ctx.newPage(); await login.goto("http://localhost:3300/dev/v5-login?next=/account"); await login.close();
const p = await ctx.newPage();
await p.goto("http://localhost:3300/reports/report_c92260bb4ae64470aeda5239a2464830", { waitUntil: "load" }); await p.waitForTimeout(3000);
const r = await p.evaluate(() => { const b = document.querySelector('button[aria-label="다음 페이지"]'); const rc = b.getBoundingClientRect(); const top = document.elementFromPoint(rc.x + rc.width / 2, rc.y + rc.height / 2); return { rc: [rc.x, rc.y, rc.width, rc.height], top: top?.outerHTML.slice(0, 200), vh: innerHeight }; });
console.log(JSON.stringify(r));
await b.close();
