/**
 * P6c 모바일 390px 캡처(로컬 dev 서버). 같은 목록으로 전후를 찍는다(P6b-ui capture.mjs와 같은 방법).
 *   PORT=<포트> pnpm dev:v5   (before = 기준 트리 v5/main, after = 이 브랜치)
 *   BASE=http://localhost:<포트> PLAYWRIGHT=<playwright 패키지 경로> node tools/p6c-score/capture.mjs before|after [이름 필터]
 * 결과: docs/v5/ui-p6c/<phase>/<이름>.png. after만: 새 코드로 만든 Book(점수 v2·부록)은 기준 코드가 그리지 못한다.
 * region: 쪽 본문 영역만(아래 쪽 번호 막대 제외) — 요청 외 화면 픽셀 비교용.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3300";
const [phase = "before", filter] = process.argv.slice(2);
const out = join(ROOT, "docs/v5/ui-p6c", phase);
mkdirSync(out, { recursive: true });

// R: 로컬 DB의 P6b 최종본(점수 v5-1, 부록 없음). N: 이 브랜치 코드로 만든 Book(tools/p6c-score/books.p6c.ts, 결정론 원고).
const R = {
  full: "report_400deb1a454a4d938a5131324cb4f20e", compat: "report_6260426984a748c9a9575c784e5d2853",
  major: "report_e65d7e4b9bef44c393dadc429c8e35d2", annual: "report_27068bca2f4544c1a0d150b93ba7c8f3",
};
const N = JSON.parse(readFileSync(join(ROOT, "docs/v5/ui-p6c/books.json"), "utf8"));
const v4 = (id, page, extra = {}) => ({ path: `/dev/book-preview?book=${id}&read=1`, page, ...extra });
const book = (id, page, extra = {}) => ({ path: `/reports/${id}`, login: true, page, ...extra });
const after = extra => ({ ...extra, afterOnly: true });
const SHOTS = [
  // 요청 화면: 점수 쪽(v2), 표지, 만세력(주인공·관계 쪽에 합쳐진 표), 부록, 대운·세운 표
  { name: "score-love", ...book(N["pair-love"], "score", after({ full: true })) },
  { name: "score-parent", ...book(N["pair-parent"], "score", after({ full: true })) },
  { name: "score-boss", ...book(N["pair-boss"], "score", after({ full: true })) },
  { name: "cover-full", ...book(R.full, "cover") },
  { name: "cover-new", ...book(N["c1-full"], "cover", after({})) },
  { name: "v4full-cover", ...v4("full", "cover") },
  { name: "manse-full", ...book(R.full, "input"), full: true },
  { name: "manse-compat", ...book(R.compat, "pair"), full: true },
  // 보정 문구는 Book을 만들 때 사람 표에 저장된다 → 저장된 Book은 그대로, 새 Book에서 새 문구.
  { name: "manse-new", ...book(N["c1-full"], "input", after({ full: true })) },
  { name: "appendix-full", ...book(N["c1-full"], "appendix", after({ full: true })) },
  { name: "appendix-pair", ...book(N["pair-love"], "appendix", after({ full: true })) },
  { name: "major-table", ...book(R.major, "timeline"), full: true },
  { name: "major-table-new", ...book(N["x-major"], "timeline", after({ full: true })) },
  { name: "annual-table", ...book(R.annual, "months"), full: true },
  // 요청 외 화면(픽셀 비교)
  { name: "same-home", path: "/" },
  { name: "same-input-1", path: "/report/new?product=saju-mbti-full", draft: true },
  { name: "same-account", path: "/account", login: true },
  { name: "same-v51-score", ...book(R.compat, "score"), region: true },
  { name: "same-full-chapter", ...book(R.full, "narrative"), region: true },
  { name: "same-compat-chapter", ...book(R.compat, "narrative"), region: true },
  { name: "same-major-chapter", ...book(R.major, "narrative"), region: true },
  { name: "same-full-back", ...book(R.full, "back"), region: true },
  { name: "same-v4full-chapter", ...v4("full", "narrative"), region: true },
  { name: "same-v4full-appendix", ...v4("full", "appendix"), region: true },
  { name: "same-v4full-person", ...v4("full", "input"), region: true },
  { name: "same-v4compat-score", ...v4("compatibility", "score"), region: true },
  { name: "same-v4major-table", ...v4("major", "timeline"), region: true },
  { name: "same-v4annual-table", ...v4("annual", "months"), region: true },
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
for (const shot of SHOTS.filter(s => (!filter || s.name.includes(filter)) && !(phase === "before" && s.afterOnly))) {
  try { const f = await shoot(shot.login ? member : guest, shot); if (f) console.log(f); } catch (e) { console.log(`${shot.name} 실패: ${String(e).slice(0, 200)}`); }
}
await browser.close();
