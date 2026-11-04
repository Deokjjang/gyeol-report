/**
 * P6d J 모바일 390px 캡처: 최신 v5/main 읽기 서버(scripts/read-latest.sh)에서 궁합 점수 쪽(v2.1)·세운 달 카드("N번째 달")·대운 카드(해 볼 것·돌아보기)·새 책.
 *   bash scripts/read-latest.sh  → 포트 확인
 *   BASE=http://localhost:<포트> PLAYWRIGHT=<playwright 패키지 경로> node tools/p6d/capture.mjs [이름 필터]
 * 결과: docs/v5/ui-p6d/<이름>.png(+ 복사 텍스트 .txt). Book: P = P6c 최종본(대운·세운, 원고를 다시 만들지 않음), N = P6d 생성본(docs/v5/trial/p6d/final).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3100";
const [filter] = process.argv.slice(2);
const out = join(ROOT, "docs/v5/ui-p6d");
mkdirSync(out, { recursive: true });

const P = { major: "report_a3f66262d9994051aef2a8e5c1bc919c", annual: "report_ebef1f15cf884714806f354e4b611f56" };
const N = JSON.parse(readFileSync(join(ROOT, "docs/v5/trial/p6d/books.json"), "utf8"));
const book = (id, page, extra = {}) => ({ path: `/reports/${id}`, login: true, page, ...extra });
const openRows = async p => { await p.locator("[role=region][data-page] details").evaluateAll(els => els.forEach(el => { el.open = true; })); };
const toDetail = async p => { await openRows(p); await p.locator("[role=region][data-page] li details button").first().click(); await p.waitForTimeout(700); };
const SHOTS = [
  { name: "score-business", ...book(N["pair-business"], "score", { full: true }) },                 // 궁합 점수 쪽 v2.1
  { name: "annual-table", ...book(P.annual, "months", { full: true, prepare: openRows, copy: true }) }, // 세운 달 카드("N번째 달")
  { name: "annual-detail", ...book(P.annual, "months", { full: true, prepare: toDetail, copy: true }) },
  { name: "major-table", ...book(P.major, "timeline", { full: true, prepare: openRows, copy: true }) },  // 대운 카드(해 볼 것·돌아보기)
  { name: "major-detail", ...book(P.major, "timeline", { full: true, prepare: toDetail, copy: true }) },
  { name: "sodam-chapter1", ...book(N["sodam-full"], "narrative", { full: true }) },                  // 1장 기준 날짜 줄
  { name: "career-chapter1", ...book(N["taeo-career"], "narrative", { full: true }) },
  { name: "love-chapter1", ...book(N["chaerin-love"], "narrative", { full: true }) },
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
for (const shot of SHOTS.filter(s => !filter || s.name.includes(filter))) {
  try { const f = await shoot(shot.login ? member : guest, shot); if (f) console.log(f); } catch (e) { console.log(`${shot.name} 실패: ${String(e).slice(0, 200)}`); }
}
await browser.close();
