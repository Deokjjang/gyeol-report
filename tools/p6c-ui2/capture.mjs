/**
 * P6c-ui2 모바일 390px 캡처(로컬 dev 서버). P6c capture.mjs와 같은 방법: 같은 목록으로 전후를 찍고 요청 외 화면은 cmp로 바이트 비교.
 *   PORT=<포트> pnpm dev:v5   (before = 기준 트리 v5/main e43267b5, after = 이 브랜치)
 *   BASE=http://localhost:<포트> PLAYWRIGHT=<playwright 패키지 경로> node tools/p6c-ui2/capture.mjs before|after [이름 필터]
 * 결과: docs/v5/ui-p6c2/<phase>/<이름>.png, 복사 텍스트는 <이름>.txt(쪽 영역 전체를 선택해 getSelection으로 읽은 글자 = 사용자가 복사하는 글자).
 * Book: R = 로컬 DB의 P6b 최종본, P = P6c가 만든 Book(점수 v2·부록), U = 이 브랜치 코드로 만든 Book(tools/p6c-ui2/books.ui2.ts, 결정론 원고).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3400";
const [phase = "before", filter] = process.argv.slice(2);
const out = join(ROOT, "docs/v5/ui-p6c2", phase);
mkdirSync(out, { recursive: true });

const R = {
  full: "report_400deb1a454a4d938a5131324cb4f20e", compat: "report_6260426984a748c9a9575c784e5d2853",
  major: "report_e65d7e4b9bef44c393dadc429c8e35d2", annual: "report_27068bca2f4544c1a0d150b93ba7c8f3",
};
const P = JSON.parse(readFileSync(join(ROOT, "docs/v5/ui-p6c/books.json"), "utf8"));
const U = JSON.parse(readFileSync(join(ROOT, "docs/v5/ui-p6c2/books.json"), "utf8"));
const v4 = (id, page, extra = {}) => ({ path: `/dev/book-preview?book=${id}&read=1`, page, ...extra });
const book = (id, page, extra = {}) => ({ path: `/reports/${id}`, login: true, page, ...extra });
const after = extra => ({ ...extra, afterOnly: true });
// 표의 줄을 모두 펼친다(상세 줄·관계 문장까지 한 장에).
const openRows = async p => { await p.locator("[role=region][data-page] details").evaluateAll(els => els.forEach(el => { el.open = true; })); };
// 표 첫 줄의 본문 링크로 상세 쪽.
const toDetail = async p => { await openRows(p); await p.locator("[role=region][data-page] li details button").first().click(); await p.waitForTimeout(700); };
const clickTerm = async p => { const t = p.locator("[role=region][data-page] button[data-term]").first(); if (await t.count()) { await t.scrollIntoViewIfNeeded(); await t.click(); } };
const SHOTS = [
  // 요청 화면
  { name: "cover-full", ...book(R.full, "cover") },                                   // b 표지 keep-all(P6b Book: 핵심 이미지 줄)
  { name: "cover-new", ...book(U["c1-full"], "cover", after({})) },                  // c 핵심 이미지
  { name: "cover-key", ...book(U["c1-full-key"], "cover", after({})) },              // c coverLine 픽스처
  { name: "person-p6c", ...book(P["c1-full"], "input"), full: true },                // f 부록이 있는 Book(P6c)
  { name: "person-new", ...book(U["c1-full"], "input", after({ full: true })) },
  { name: "person-pair", ...book(P["pair-love"], "pair"), full: true },              // f 궁합: 사람마다
  { name: "person-v4", ...v4("full", "input"), full: true },                         // f V4(부록 있음)
  { name: "body-key", ...book(U["c1-full-key"], "narrative", after({ full: true })) },              // g 핵심 구절 + 용어
  { name: "body-term", ...book(U["c1-full-key"], "narrative", after({ prepare: clickTerm })) },    // g 용어 팝오버
  { name: "annual-table", ...book(R.annual, "months", { full: true, prepare: openRows, copy: true }) }, // h·i 세운 표(줄 펼침)
  { name: "annual-detail", ...book(R.annual, "months", { full: true, prepare: toDetail, copy: true }) }, // h 세운 상세 쪽
  { name: "annual-table-new", ...book(U["c2-annual"], "months", after({ full: true, prepare: openRows, copy: true })) },
  { name: "major-table", ...book(R.major, "timeline", { full: true, prepare: openRows }) },         // i 대운 표(줄 펼침)
  { name: "v4annual-table", ...v4("annual", "months", { full: true, prepare: openRows, copy: true }) }, // j·h V4 세운
  { name: "v4annual-detail", ...v4("annual", "months", { full: true, prepare: toDetail, copy: true }) },
  { name: "score-love", ...book(U["pair-love"], "score", after({ full: true })) },  // 점수 v2.1
  { name: "score-parent", ...book(U["pair-parent"], "score", after({ full: true })) },
  { name: "score-boss", ...book(U["pair-boss"], "score", after({ full: true })) },
  // 요청 외 화면(픽셀 비교). 본문 쪽은 쪽 번호 막대를 뺀 영역.
  { name: "same-home", path: "/" },
  { name: "same-input-1", path: "/report/new?product=saju-mbti-full", draft: true },
  { name: "same-account", path: "/account", login: true },
  { name: "same-v2-score", ...book(P["pair-love"], "score"), region: true },        // v2 Book은 v2 그대로
  { name: "same-v51-score", ...book(R.compat, "score"), region: true },
  { name: "same-full-chapter", ...book(R.full, "narrative"), region: true },
  { name: "same-compat-chapter", ...book(R.compat, "narrative"), region: true },
  { name: "same-major-chapter", ...book(R.major, "narrative"), region: true },
  { name: "same-full-back", ...book(R.full, "back"), region: true },
  { name: "same-p6c-appendix", ...book(P["c1-full"], "appendix"), region: true },
  { name: "same-v4full-chapter", ...v4("full", "narrative"), region: true },
  { name: "same-v4full-appendix", ...v4("full", "appendix"), region: true },
  { name: "same-v4compat-score", ...v4("compatibility", "score"), region: true },
  { name: "same-v4major-table", ...v4("major", "timeline"), region: true },
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
  if (shot.copy) {
    // 사용자가 쪽을 길게 눌러 전체 선택해 복사하는 글자.
    const copied = await p.locator("[role=region][data-page]").evaluate(el => { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); const t = s.toString(); s.removeAllRanges(); return t; });
    writeFileSync(join(out, `${shot.name}.txt`), copied);
  }
  if (shot.region) await p.locator("[role=region][data-page]").screenshot({ path: file });
  else if (shot.full && shot.page) {
    // 책 쪽은 안쪽 스크롤 영역이라 fullPage가 늘지 않는다 → 영역 높이만큼 창을 늘려 한 장으로.
    const h = await p.locator("[role=region][data-page]").evaluate(el => el.scrollHeight);
    await p.setViewportSize({ width: 390, height: Math.min(16000, h + 64 + 54) });
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
