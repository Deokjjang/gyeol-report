/**
 * P5 UI 캡처(로컬 dev 서버, 모바일 390 · 데스크톱 1440). 같은 목록으로 전후를 찍는다.
 *   PORT=3300 pnpm dev:v5  →  pnpm exec tsx tools/p5/capture.ts before|after [이름 필터]
 * 결과: docs/v5/ui/<phase>/<이름>-<폭>.png. 책 쪽은 다음 쪽 버튼으로 data-page가 나올 때까지 넘긴다.
 * 입력·주문서는 입력 화면이 복원하는 sessionStorage 초안(gyeol-book-input-v1)으로 같은 사람을 채운다.
 */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright";

const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3300";
const [phase = "before", filter] = process.argv.slice(2);
const out = join(ROOT, "docs/v5/ui", phase);
mkdirSync(out, { recursive: true });

export const REPORTS = {
  full: "report_c92260bb4ae64470aeda5239a2464830", career: "report_cee4d27c579e44e7842e1a5bc7534586", love: "report_12aaf962df0849e7843a2aaa46f6b4cd",
  major: "report_63e78f08701c4152a4f9260a457a24b0", annual: "report_26ede23f7be2496eb22e983cd528bfb9", compat: "report_c92a09b9393a41efaaf27d6c883c1dee",
  v4full: "report_e52000519fb74c45aa21f266cdeaabf7", generating: "report_44f2bf2b70e842808b3c4e3b50c5548a",
} as const;

const person = { name: "김수안무", birthDate: "1994-03-17", paidBirthTimeMode: "exact", birthTime: "08:27", timeBranch: "", birthTimeUnknown: false, gender: "FEMALE", mbtiType: "INFJ",
  jobStatus: "employee", detailedJob: "서비스 기획자", relationshipStatus: "single", focusAreas: [], selectedYear: "2026" };
const draft = (productKey: string, toReceipt: boolean) => ({ productKey, toReceipt, value: JSON.stringify({ version: 1, state: { category: "love", person, personB: { ...person, name: "이도윤", birthDate: "1993-11-02", gender: "MALE", mbtiType: "ENTP" } } }) });

type Shot = { name: string; path: string; widths?: number[]; event?: boolean; dark?: boolean; login?: boolean; reduced?: boolean; full?: boolean; page?: string; nth?: number; prepare?: (p: Page) => Promise<void>; draft?: ReturnType<typeof draft> };
const SHOTS: Shot[] = [
  { name: "home", path: "/", full: true },
  // 이벤트 진행 중일 때의 홈(블록 위치 확인): /api/launch-event 응답만 ACTIVE로 바꿔 끼운다.
  { name: "home-event", path: "/", event: true },
  { name: "input-1", path: "/report/new?product=saju-mbti-full", draft: draft("saju_mbti_full", false) },
  { name: "input-2", path: "/report/new?product=saju-mbti-full", draft: draft("saju_mbti_full", false), prepare: async p => { await p.locator("form button[type=submit]").click(); await p.waitForTimeout(600); } },
  { name: "input-compat", path: "/report/new?product=compatibility", draft: draft("saju_mbti_compatibility", false) },
  { name: "order", path: "/dev/book-flow/input?product=saju-mbti-full", login: true, draft: draft("saju_mbti_full", true), full: true },
  { name: "order-guest", path: "/dev/book-flow/input?product=saju-mbti-full", draft: draft("saju_mbti_full", true), full: true },
  { name: "waiting", path: "/dev/ui-status?stage=2" },
  { name: "library", path: "/dev/account", login: true, full: true },
  { name: "library-books", path: "/dev/account/library-preview", login: true, full: true },
  { name: "book-cover", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "cover" },
  { name: "book-contents", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "contents" },
  { name: "book-person", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "input" },
  { name: "book-manse", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "manse", full: true },
  { name: "book-mbti", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "mbti", full: true },
  { name: "book-chapter", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "narrative" },
  { name: "book-back", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "back", full: true },
  { name: "book-major", path: `/reports/${REPORTS.major}`, login: true, reduced: true, page: "timeline", full: true },
  { name: "book-annual", path: `/reports/${REPORTS.annual}`, login: true, reduced: true, page: "months", full: true },
  { name: "book-score", path: "/dev/ui-fixtures?combo=compatibility-v5", reduced: true, page: "score", full: true },
  { name: "book-v4-manse", path: "/dev/ui-fixtures?combo=saju_mbti_full-v4", reduced: true, page: "manse", full: true },
  { name: "dark-home", path: "/", dark: true, widths: [390] },
  { name: "dark-book-chapter", path: `/reports/${REPORTS.full}`, login: true, reduced: true, page: "narrative", dark: true, widths: [390] },
  { name: "book-appendix", path: "/dev/ui-fixtures?combo=saju_mbti_full-v4", reduced: true, page: "appendix", full: true },
];

async function toPage(p: Page, kind: string, nth = 1) {
  let seen = 0;
  for (let i = 0; i < 80; i++) {
    if (await p.locator(`[data-page="${kind}"]`).count()) { if (++seen >= nth) return true; }
    const next = p.locator('button[aria-label="다음 페이지"]');
    if (!(await next.count()) || await next.isDisabled()) return false;
    await next.click(); await p.waitForTimeout(80);
  }
  return false;
}

async function shoot(ctx: BrowserContext, shot: Shot, width: number) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width, height: width < 800 ? 844 : 900 });
  await p.emulateMedia({ reducedMotion: shot.reduced ? "reduce" : "no-preference", colorScheme: shot.dark ? "dark" : "light" });
  if (shot.draft) {
    const d = shot.draft;
    await p.addInitScript(({ productKey, value, toReceipt }) => {
      try {
        sessionStorage.setItem(`gyeol-book-input-v1:${productKey}`, value);
        if (toReceipt) sessionStorage.setItem(`gyeol-book-receipt-return-v1:${productKey}`, "1"); else sessionStorage.removeItem(`gyeol-book-receipt-return-v1:${productKey}`);
      } catch { /* capture only */ }
    }, d);
  }
  if (shot.event) await p.route("**/api/launch-event", r => r.fulfill({ json: { state: "ACTIVE", serverNow: "2026-10-30T15:00:00Z", startsAt: "2026-10-10T15:00:00Z", endsAt: "2026-10-31T15:00:00Z", campaignAvailable: true, referralAvailable: true, inviterAvailable: true, budgetApproved: true, campaignSlug: "gyeol-opening-2026" } }));
  await p.goto(BASE + shot.path, { waitUntil: "load", timeout: 120_000 });
  await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await p.waitForTimeout(2500);
  // Meta 동의 카드는 첫 방문 1회 — 홈 캡처에만 남기고 나머지 쪽에서는 닫는다.
  if (shot.name !== "home") { const close = p.locator('[class*="metaConsent"] button', { hasText: "닫기" }); if (await close.count()) await close.first().click().catch(() => {}); }
  if (shot.page && !(await toPage(p, shot.page, shot.nth))) console.log(`${shot.name}: data-page=${shot.page} 없음`);
  if (shot.prepare) await shot.prepare(p);
  await p.waitForTimeout(400);
  const file = join(out, `${shot.name}-${width}.png`);
  await p.screenshot({ path: file, fullPage: shot.full ?? false });
  await p.close();
  return file;
}

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const guest = await browser.newContext({ locale: "ko-KR", deviceScaleFactor: 1 });
  const member = await browser.newContext({ locale: "ko-KR", deviceScaleFactor: 1 });
  const login = await member.newPage(); await login.goto(`${BASE}/dev/v5-login?next=/account`, { waitUntil: "load", timeout: 120_000 }); await login.close();
  for (const shot of SHOTS.filter(s => !filter || s.name.includes(filter))) {
    for (const w of shot.widths ?? [390, 1440]) {
      try { console.log(await shoot(shot.login ? member : guest, shot, w)); } catch (e) { console.log(`${shot.name}-${w} 실패: ${String(e).slice(0, 200)}`); }
    }
  }
  await browser.close();
}
main();
