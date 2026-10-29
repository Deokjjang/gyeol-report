import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const css = []; p.on("request", r => { if (r.url().endsWith(".css")) css.push(r.url().split("/").pop()); });
await p.goto(process.argv[2], { waitUntil: "load" }); await p.waitForTimeout(2500);
await p.screenshot({ path: process.argv[3], fullPage: true });
console.log(css.join(" "));
await b.close();
