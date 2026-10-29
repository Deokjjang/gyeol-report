import { chromium, devices } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const [label, opts] of [["iphone", { ...devices["iPhone 13"] }], ["desktop", { viewport: { width: 1440, height: 900 } }]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  await p.goto("http://localhost:3300/", { waitUntil: "load" }); await p.waitForTimeout(1500);
  const cur = () => p.evaluate(() => document.querySelector('[data-center="true"]')?.getAttribute("aria-label"));
  const a = await cur(); await p.waitForTimeout(6000); const c = await cur();
  const mq = await p.evaluate(() => ({ reduce: matchMedia("(prefers-reduced-motion: reduce)").matches, hover: matchMedia("(hover: hover) and (pointer: fine)").matches }));
  console.log(label, JSON.stringify({ before: a, after6s: c, ...mq }));
  await ctx.close();
}
await b.close();
