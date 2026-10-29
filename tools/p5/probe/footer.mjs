import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 412, height: 823 } });
await p.goto(process.argv[2] ?? "http://localhost:3400/", { waitUntil: "load" }); await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('footer a[aria-label]')].map(a => { const r = a.getBoundingClientRect(); return [a.getAttribute("aria-label"), Math.round(r.width), Math.round(r.height), getComputedStyle(a).display, a.parentElement.className]; }))));
await b.close();
