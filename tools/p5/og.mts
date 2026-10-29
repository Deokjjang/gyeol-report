/**
 * P5 공유 이미지·아이콘 확인용 캡처: 개발 서버의 /dev/ui-og를 1200×630으로 찍어 public/brand/og-v5.jpg로 저장(파일명에 버전).
 *   PORT=3300 pnpm dev:v5 → pnpm exec tsx tools/p5/og.mts
 */
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const ROOT = resolve(import.meta.dirname, "../..");
const sharp = createRequire(createRequire(import.meta.url).resolve("next/package.json"))("sharp");
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: "light", deviceScaleFactor: 1 });
await page.goto(`${process.env.BASE ?? "http://localhost:3300"}/dev/ui-og`, { waitUntil: "load" });
await page.addStyleTag({ content: "nextjs-portal{display:none!important} [class*=metaConsent]{display:none!important}" });
await page.waitForTimeout(2500);
const png = await page.locator("#og").screenshot();
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(ROOT, "public/brand/og-v5.jpg"));
await browser.close();
console.log("public/brand/og-v5.jpg");
