/**
 * P6b-ui 모바일 390px 캡처(로컬 dev 서버). 같은 목록으로 전후를 찍는다.
 *   PORT=3300 pnpm dev:v5
 *   PLAYWRIGHT=<playwright 패키지 경로> node tools/p6b-ui/capture.mjs before|after [이름 필터]
 * 결과: docs/v5/ui-p6b/<phase>/<이름>.png. 책 쪽은 다음 쪽 버튼으로 data-page가 나올 때까지 넘긴다.
 * region: 쪽 본문 영역만 찍는다(아래 쪽 번호 막대 제외) — 요청 외 화면 픽셀 비교용.
 */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3300";
const [phase = "before", filter] = process.argv.slice(2);
const out = join(ROOT, "docs/v5/ui-p6b", phase);
mkdirSync(out, { recursive: true });

// 로컬 DB의 P6b 최종본(가상 인물)과 로컬 v4 Book.
const R = {
  full: "report_400deb1a454a4d938a5131324cb4f20e", compat: "report_6260426984a748c9a9575c784e5d2853",
  major: "report_e65d7e4b9bef44c393dadc429c8e35d2", annual: "report_27068bca2f4544c1a0d150b93ba7c8f3",
};
// 과거 V4 Book은 dev 미리보기(V4 런타임 픽스처, 같은 BookReader)로 연다.
const v4 = (id, page, extra = {}) => ({ path: `/dev/book-preview?book=${id}&read=1`, page, ...extra });
const book = (id, page, extra = {}) => ({ path: `/reports/${id}`, login: true, page, ...extra });
const openNow = async p => { const row = p.locator("[data-now=true] summary").first(); if (await row.count()) { await row.click(); await p.waitForTimeout(200); await row.scrollIntoViewIfNeeded(); } };
const openFirst = async p => { const d = p.locator("[data-page] details").first(); if (await d.count()) { await d.locator("summary").click(); await p.waitForTimeout(200); } };
const SHOTS = [
  // 바뀐 화면
  { name: "full-cover", ...book(R.full, "cover") },
  { name: "full-contents", ...book(R.full, "contents") },
  { name: "full-person", ...book(R.full, "input"), full: true },
  { name: "full-person-mbti-open", ...book(R.full, "input"), full: true, prepare: openFirst },
  { name: "full-manse", ...book(R.full, "manse"), full: true },
  { name: "full-mbti", ...book(R.full, "mbti") },
  { name: "full-back", ...book(R.full, "back") },
  { name: "full-toc-sheet", ...book(R.full, "narrative"), prepare: async p => { await p.getByRole("button", { name: "목차", exact: true }).click(); await p.waitForTimeout(300); } },
  { name: "compat-first", ...book(R.compat, "pair"), full: true },
  { name: "compat-score", ...book(R.compat, "score"), full: true },
  { name: "major-table", ...book(R.major, "timeline"), full: true },
  { name: "major-table-open", ...book(R.major, "timeline"), full: true, prepare: openNow },
  { name: "annual-table", ...book(R.annual, "months"), full: true },
  { name: "annual-table-open", ...book(R.annual, "months"), full: true, prepare: openNow },
  { name: "v4full-cover", ...v4("full", "cover") },
  { name: "v4full-person", ...v4("full", "input"), full: true },
  { name: "v4full-back", ...v4("full", "back") },
  { name: "v4compat-first", ...v4("compatibility", "pair"), full: true },
  { name: "v4compat-score", ...v4("compatibility", "score"), full: true },
  { name: "v4major-table", ...v4("major", "timeline"), full: true },
  { name: "v4annual-table", ...v4("annual", "months"), full: true },
  { name: "input-2", path: "/report/new?product=saju-mbti-full", draft: true, prepare: async p => { await p.locator("form button[type=submit]").click(); await p.waitForTimeout(800); } },
  // 요청 외 화면(픽셀 비교)
  { name: "same-home", path: "/" },
  { name: "same-input-1", path: "/report/new?product=saju-mbti-full", draft: true },
  { name: "same-full-chapter", ...book(R.full, "narrative"), region: true },
  { name: "same-compat-chapter", ...book(R.compat, "narrative"), region: true },
  { name: "same-major-chapter", ...book(R.major, "narrative"), region: true },
  { name: "same-v4full-chapter", ...v4("full", "narrative"), region: true },
  { name: "same-v4full-appendix", ...v4("full", "appendix"), region: true },
  { name: "same-account", path: "/account", login: true },
];

const person = { name: "김수안무", birthDate: "1994-03-17", paidBirthTimeMode: "exact", birthTime: "08:27", timeBranch: "", birthTimeUnknown: false, gender: "FEMALE", mbtiType: "INFJ",
  jobStatus: "employee", detailedJob: "서비스 기획자", relationshipStatus: "single", focusAreas: [], selectedYear: "2026" };

async function toPage(p, kind) {
  for (let i = 0; i < 80; i++) {
    if (await p.locator(`[data-page="${kind}"]`).count()) return true;
    const next = p.locator('button[aria-label="다음 페이지"]');
    if (!(await next.count()) || await next.isDisabled()) return false;
    await next.click(); await p.waitForTimeout(60);
  }
  return false;
}

async function shoot(ctx, shot) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  if (shot.draft) await p.addInitScript(value => { try { sessionStorage.setItem("gyeol-book-input-v1:saju_mbti_full", value); sessionStorage.removeItem("gyeol-book-receipt-return-v1:saju_mbti_full"); } catch { /* capture only */ } },
    JSON.stringify({ version: 1, state: { category: "love", person, personB: person } }));
  await p.goto(BASE + shot.path, { waitUntil: "load", timeout: 120_000 });
  await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await p.waitForTimeout(1500);
  const close = p.locator('[class*="metaConsent"] button', { hasText: "닫기" });
  if (await close.count()) await close.first().click().catch(() => {});
  if (shot.page && !(await toPage(p, shot.page))) { console.log(`${shot.name}: data-page=${shot.page} 없음`); await p.close(); return null; }
  if (shot.prepare) await shot.prepare(p);
  await p.waitForTimeout(300);
  const file = join(out, `${shot.name}.png`);
  if (shot.region) await p.locator("[role=region][data-page]").screenshot({ path: file });
  else if (shot.full && shot.page) {
    // 책 쪽은 안쪽 스크롤 영역이라 fullPage가 늘지 않는다 → 영역 높이만큼 창을 늘려 한 장으로.
    const h = await p.locator("[role=region][data-page]").evaluate(el => el.scrollHeight);
    await p.setViewportSize({ width: 390, height: Math.min(12000, h + 64 + 54) });
    await p.waitForTimeout(300);
    await p.screenshot({ path: file });
  } else await p.screenshot({ path: file, fullPage: Boolean(shot.full) });
  await p.close();
  return file;
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const guest = await browser.newContext({ locale: "ko-KR", deviceScaleFactor: 1, timezoneId: "Asia/Seoul" });
const member = await browser.newContext({ locale: "ko-KR", deviceScaleFactor: 1, timezoneId: "Asia/Seoul" });
const login = await member.newPage(); await login.goto(`${BASE}/dev/v5-login?next=/account`, { waitUntil: "load", timeout: 120_000 }); await login.close();
for (const shot of SHOTS.filter(s => !filter || s.name.includes(filter))) {
  try { const f = await shoot(shot.login ? member : guest, shot); if (f) console.log(f); } catch (e) { console.log(`${shot.name} 실패: ${String(e).slice(0, 200)}`); }
}
await browser.close();
