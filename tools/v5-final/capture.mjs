/**
 * v5 최종(2-1·2-2·2-3·2-5·1-17) 로컬 E2E + 390px 캡처. 로컬 dev 서버·로컬 Supabase·목업 작가(OPS_MOCK_WRITER=ok)만, 외부 호출 0.
 *   PLAYWRIGHT=<playwright index.mjs> BASE=http://localhost:3700 node tools/v5-final/capture.mjs <phase> [out]
 * phase:
 *   gift-flow          (이 브랜치) 보상 B 계정 서재 → 선물 링크 → 친구가 받기 → 홈 → 커리어 입력 → 이용권으로 발행 → 워커 → 서재
 *   wait-seed          결제 Book 생성 대기 화면용 주문 3건을 로컬 DB에 만든다(접수·감독 시작·보류) — state.json에 저장
 *   changed <dir>      요청한 화면(홈 회전·푸터·광고 동의 카드·생성 대기·책 2쪽·공유 메타) — 기준선(3710)·브랜치(3700)를 같은 목록으로
 *   unstuck            (이 브랜치) 대기 화면을 연 채로 워커를 돌려 화면이 스스로 완성 화면으로 넘어가는지
 *   freeze <dir>       요청 밖 화면(푸터 숨김·광고 동의 카드 본 것으로) — cmp로 바이트 동일 비교
 * 캡처: docs/v5/ui-final/<dir>/<이름>.png. 상태: docs/v5/ui-final/state.json(주문·Book 주소만, 비밀값 없음).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3700";
const [phase, dir = phase] = process.argv.slice(2);
const OUT = join(ROOT, "docs/v5/ui-final", dir);
mkdirSync(OUT, { recursive: true });
const STATE = join(ROOT, "docs/v5/ui-final/state.json");
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
const sql = q => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", q], { encoding: "utf8" }).trim();
const log = (...a) => console.log(`[${phase}]`, ...a);
const browser = await chromium.launch();
const SEEN = "gyeol-meta-card-seen:meta-20261020-v2";
async function context({ seen = true, reduced = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(reduced ? { reducedMotion: "reduce" } : {}) });
  await ctx.addInitScript(([seenKey, markSeen]) => {
    try { if (markSeen) localStorage.setItem(seenKey, "1"); } catch { /* ignore */ }
    document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); });
  }, [SEEN, seen]);
  const page = await ctx.newPage();
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource|hydrat/i.test(m.text())) log("console:", m.text().slice(0, 140)); });
  return { ctx, page };
}
const login = async (page, who, next) => { await page.goto(`${BASE}/dev/v5-login?${who === "dev" ? "" : `as=${who}&`}next=${encodeURIComponent(next)}`, { waitUntil: "load" }); };
const shot = async (page, name, full = false) => { await page.waitForTimeout(800); await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full }); log("shot", name); };
const part = async (page, selector, name) => { const el = page.locator(selector).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(700); await el.screenshot({ path: join(OUT, `${name}.png`) }); log("shot", name); };
const hideFooter = page => page.addStyleTag({ content: "footer{display:none!important}" });
// 로컬 전용 CRON_SECRET(이 worktree의 .env.development.local, 로컬 무작위 값)으로 워커를 부른다. 값은 출력하지 않는다.
const cron = () => { const line = readFileSync(join(ROOT, ".env.development.local"), "utf8").split("\n").find(l => l.startsWith("CRON_SECRET=")); return line ? line.slice(12).replace(/^"|"$/g, "") : ""; };
const worker = async (path, times = 4) => { const out = []; for (let i = 0; i < times; i++) { const r = await fetch(`${BASE}${path}`, { headers: { authorization: `Bearer ${cron()}` } }); out.push(r.status); await new Promise(r2 => setTimeout(r2, 1500)); } return out.join(","); };
/** 책 쪽으로 넘긴다: data-page가 원하는 종류가 될 때까지 다음 쪽. */
async function toPage(page, kind) {
  for (let i = 0; i < 20; i++) {
    const cur = await page.locator("[role=region][data-page]").first().getAttribute("data-page").catch(() => null);
    if (cur === kind) return true;
    const next = page.getByRole("button", { name: /다음 (쪽|페이지)/ }).last();
    if (!(await next.count())) return false;
    await next.click(); await page.waitForTimeout(500);
  }
  return false;
}

try {
  if (phase === "gift-flow") {
    // 1) 보상 B 계정: 서재 맨 위 안내 + 보상 이용권(장마다 내가 쓰기 / 선물 링크 만들기)
    const a = await context();
    await login(a.page, "fin-old", "/account");
    await a.page.waitForSelector("[data-gift-panel]", { timeout: 60_000 });
    await a.page.waitForTimeout(1500);
    await part(a.page, "[data-comp-notice]", "comp-notice-B");
    await part(a.page, "[data-gift-panel]", "comp-panel-B");
    const link = a.page.waitForResponse(r => r.url().includes("/auth/gift") && r.request().method() === "POST");
    await a.page.getByRole("button", { name: "선물 링크 만들기" }).first().click();
    const body = await (await link).json();
    state.giftUrl = body.url; save();
    await part(a.page, "[data-gift-panel]", "comp-panel-B-linked");
    // 2) 친구: 선물 링크 → 받기
    const b = await context();
    await login(b.page, "fin-friend", state.giftUrl);
    await b.page.waitForSelector("[data-gift-page]", { timeout: 60_000 });
    await b.page.waitForTimeout(1500);
    await shot(b.page, "gift-received-before-claim");
    await b.page.getByRole("button", { name: /받기/ }).first().click();
    await b.page.getByText("이용권 1장을 받았어요").waitFor({ timeout: 30_000 });
    await shot(b.page, "gift-claimed");
    // 3) 책 고르러 가기 → 커리어 입력 → 이용권 1장으로 발행
    await b.page.getByRole("link", { name: /책 고르러 가기/ }).click();
    await b.page.waitForURL(u => new URL(u).pathname === "/", { timeout: 30_000 });
    await b.page.goto(`${BASE}/report/new?product=career-money-study`, { waitUntil: "load" });
    await b.page.locator("#a-name").fill("검수친구");
    await b.page.locator("#a-birthDate").fill("1995-03-14");
    await b.page.locator("#a-gender").selectOption("FEMALE");
    await b.page.getByLabel("정확").check();
    await b.page.locator("#a-birthTime").fill("08:30");
    await b.page.getByRole("button", { name: /다음 페이지/ }).click(); await b.page.waitForTimeout(800);
    await b.page.getByRole("button", { name: /다음 페이지/ }).click();
    await b.page.waitForSelector("[data-book-checkout]", { timeout: 30_000 });
    const ticket = b.page.getByLabel(/리포트 이용권 1장 사용/); await ticket.waitFor({ timeout: 30_000 }); await ticket.check();
    await b.page.getByLabel("전체 동의").check();
    await shot(b.page, "gift-checkout-ticket", true);
    const redeemed = b.page.waitForResponse(r => r.url().includes("/auth/ticket-redeem"), { timeout: 60_000 });
    await b.page.getByRole("button", { name: /이용권 1장으로 책 발행하기/ }).click();
    const rr = await redeemed; const rb = await rr.json().catch(() => ({}));
    log("ticket-redeem", rr.status(), rb.state ?? rb.code);
    state.redeem = { status: rr.status(), state: rb.state ?? rb.code ?? null, redemptionId: rb.redemptionId ?? null }; save();
    await b.page.waitForTimeout(1500);
    await shot(b.page, "gift-redeem-pending");
    log("ticket worker", await worker("/api/internal/report-ticket-jobs", 3));
    state.friendBook = sql("select report_id from public.report_ticket_redemptions r join auth.users u on u.id=r.user_id where u.email='p6e-fin-friend@gyeol.local' order by r.created_at desc limit 1");
    log("friend book", state.friendBook, sql(`select state from public.report_ticket_redemptions where report_id='${state.friendBook}'`)); save();
    await b.page.goto(`${BASE}/account`, { waitUntil: "load" });
    await b.page.waitForTimeout(2500);
    await shot(b.page, "gift-library-friend");
  }

  if (phase === "wait-seed") {
    const devId = sql("select id from auth.users where email='v5-dev@gyeol.local'");
    const payload = JSON.stringify({ reportInputPayload: { productKey: "career_money_study", productSlug: "career-money-study", person: { name: "대기검수", birthDate: "1995-03-14", birthTime: "08:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "ENFP" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] }, productOptions: {} } }).replaceAll("'", "''");
    const make = id => {
      sql(`select public.paid_report_reliability('create_order', jsonb_build_object('paymentOrderId','${id}','providerOrderId','${id}','productType','career_money_study','provider','toss','amount',1490,'inputSnapshot','${payload}'::jsonb))`);
      sql(`with c as (select public.paid_report_reliability('confirm_claim', '{"orderId":"${id}","paymentKey":"k-${id}","amount":1490}'::jsonb) r) select public.paid_report_reliability('confirm_finish', jsonb_build_object('orderId','${id}','paymentKey','k-${id}','token',(select r->>'token' from c)))`);
      // 회원 구매로 묶어 둔다(완성 뒤 같은 주소에서 책이 열리게).
      sql(`insert into public.report_purchase_bindings(order_id,buyer_id,display_name) values('${id}','${devId}','대기검수') on conflict do nothing`);
      // 결제 워커 크론이 로컬에 없으므로 일부러 부르기 전까지 그대로(접수 상태).
      sql(`update public.report_generation_jobs set next_retry_at=now()+interval '6 hours' where order_id='${id}'`);
      return sql(`select report_id from public.payment_orders where payment_order_id='${id}'`);
    };
    const stamp = Date.now().toString(36);
    const queued = make(`fin_wait_q_${stamp}`), begun = make(`fin_wait_b_${stamp}`), deferred = make(`fin_wait_d_${stamp}`);
    // 감독 상태는 supervisor.ts가 쓰는 같은 RPC(ops_generation begin·record)로 심는다.
    sql(`select public.ops_generation('begin', jsonb_build_object('reportId','${begun}','origin','paid','originRef','fin_wait_b_${stamp}'))`);
    sql(`update public.paid_report_snapshots set status='GENERATING' where report_id='${begun}'`);
    sql(`select public.ops_generation('begin', jsonb_build_object('reportId','${deferred}','origin','paid','originRef','fin_wait_d_${stamp}'))`);
    sql(`select public.ops_generation('record', jsonb_build_object('reportId','${deferred}','run',jsonb_build_object('lane','queue','provider','anthropic','model','claude-sonnet-5-5','outcome','deferred','reason','official:pre_output:http_529'),
      'state',jsonb_build_object('firstFailureAt',now(),'failuresInc',1,'nextAt',now()+interval '15 minutes','rejected','[]'::jsonb)))`);
    sql(`update public.paid_report_snapshots set status='RETRYING' where report_id='${deferred}'; update public.report_generation_jobs set status='RETRYING' where report_id='${deferred}'`);
    state.wait = { queued, begun, deferred, nextAt: sql(`select next_at from public.book_generation_state where report_id='${deferred}'`) }; save();
    log(state.wait);
  }

  if (phase === "changed") {
    // #5 홈 회전 진열: 동작 줄이기 설정에서 7초 간격 두 장(기준선은 멈춰 같은 표지, 브랜치는 다음 책으로)
    { const { page, ctx } = await context({ reduced: true });
      await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForTimeout(2500);
      await page.locator("[data-book-home]").first().screenshot({ path: join(OUT, "home-reduced-motion-t0.png") });
      const t0 = await page.locator("[aria-current=true]").first().getAttribute("aria-label");
      await page.waitForTimeout(7500);
      await page.locator("[data-book-home]").first().screenshot({ path: join(OUT, "home-reduced-motion-t7.png") });
      const t7 = await page.locator("[aria-current=true]").first().getAttribute("aria-label");
      log("shelf reduced-motion center", JSON.stringify({ t0, t7, rotated: t0 !== t7 }));
      state[`${dir}-shelf`] = { t0, t7, rotated: t0 !== t7 }; save();
      await ctx.close(); }
    // #4·2-2 푸터 + #6 첫 방문 광고 동의 카드(본 기록 없음)
    { const { page, ctx } = await context({ seen: false });
      await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForTimeout(3000);
      await shot(page, "home-first-visit-consent");
      await page.goto(`${BASE}/terms`, { waitUntil: "load" }); await page.waitForTimeout(2500);
      await shot(page, "terms-first-visit-consent");
      await ctx.close(); }
    { const { page, ctx } = await context();
      await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForTimeout(2500);
      await part(page, "footer", "footer-home");
      const nav = await page.locator("footer nav[aria-label='소셜과 고객 문의'] a, footer [aria-label='소셜과 고객 문의'] a").evaluateAll(as => as.map(a => `${a.getAttribute("aria-label") ?? a.textContent?.trim()}|${a.getAttribute("href")}|${a.getAttribute("target")}|${a.getAttribute("rel")}`));
      log("footer links", JSON.stringify(nav)); state[`${dir}-footer`] = nav; save();
      await page.goto(`${BASE}/terms`, { waitUntil: "load" }); await page.waitForTimeout(2000);
      await part(page, "footer", "footer-terms");
      // #8 공유 이미지 메타
      const og = await page.locator("meta[property='og:image'], meta[property='og:image:width'], meta[property='og:image:height'], meta[name='twitter:image']").evaluateAll(ms => ms.map(m => `${m.getAttribute("property") ?? m.getAttribute("name")}=${m.getAttribute("content")}`));
      log("og", JSON.stringify(og)); state[`${dir}-og`] = og; save();
      await ctx.close(); }
    // #7 생성 대기(접수 · 감독 시작 · 보류)
    if (state.wait) { const { page, ctx } = await context();
      for (const [name, id] of [["wait-queued", state.wait.queued], ["wait-begun", state.wait.begun], ["wait-deferred", state.wait.deferred]]) {
        await page.goto(`${BASE}/reports/${id}`, { waitUntil: "load" }); await page.waitForTimeout(2500);
        await shot(page, name, true);
      }
      await ctx.close(); }
    // 1-17 고객 열람 화면 2쪽(친구가 이용권으로 만든 커리어 책)
    if (state.friendBook) { const { page, ctx } = await context();
      await login(page, "fin-friend", `/reports/${state.friendBook}`); await page.waitForTimeout(3000);
      await page.getByRole("button", { name: /펼치|읽기|시작/ }).first().click().catch(() => {});
      await page.waitForTimeout(1200);
      const ok = await toPage(page, "input");
      log("book page input reached", ok, await page.locator("[role=region][data-page]").first().getAttribute("aria-label").catch(() => null));
      await page.screenshot({ path: join(OUT, "book-career-page02.png") });
      await part(page, "[role=region][data-page]", "book-career-page02-region");
      // 쪽 안 스크롤을 끝까지 내려 만세력 아래(바로가기가 있던 자리)를 보이게 찍는다.
      await page.evaluate(() => { const el = document.querySelector("[role=region][data-page]"); for (let n = el; n; n = n.parentElement) if (n.scrollHeight > n.clientHeight + 4) { n.scrollTop = n.scrollHeight; break; } for (const c of el.querySelectorAll("*")) if (c.scrollHeight > c.clientHeight + 4 && getComputedStyle(c).overflowY !== "visible") c.scrollTop = c.scrollHeight; window.scrollTo(0, document.body.scrollHeight); });
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(OUT, "book-career-page02-bottom.png") });
      const text = await page.locator("[role=region][data-page]").first().innerText();
      state[`${dir}-page02-link`] = /다른 기운들? 보기/.test(text); save();
      log("page02 has link", state[`${dir}-page02-link`]);
      await ctx.close(); }
  }

  if (phase === "unstuck") {
    const { page, ctx } = await context();
    await login(page, "dev", `/reports/${state.wait.queued}`);
    await page.waitForTimeout(2500);
    await shot(page, "unstuck-0-waiting", true);
    sql(`update public.report_generation_jobs set next_retry_at=now() where report_id='${state.wait.queued}'`);
    const started = Date.now();
    log("paid worker", await worker("/api/internal/report-jobs", 2));
    // 화면을 건드리지 않고 기다린다: 10초마다 진행 상태를 묻고, 완성되면 스스로 새로 그린다.
    const done = await page.waitForFunction(() => !document.querySelector("[role=status] #report-status-title"), null, { timeout: 120_000, polling: 1000 }).then(() => true).catch(() => false);
    log("left waiting screen by itself", done, `${Math.round((Date.now() - started) / 1000)}s`, sql(`select status from public.paid_report_snapshots where report_id='${state.wait.queued}'`));
    state.unstuck = { done, seconds: Math.round((Date.now() - started) / 1000) }; save();
    await page.waitForTimeout(2500);
    await shot(page, "unstuck-1-after");
    await ctx.close();
  }

  if (phase === "freeze") {
    const { page, ctx } = await context();
    const shots = [["terms", "/terms"], ["privacy", "/privacy"], ["refund", "/refund"], ["business", "/business"], ["login", "/login"], ["input-career", "/report/new?product=career-money-study"], ["input-full", "/report/new?product=saju-mbti-full"]];
    for (const [name, path] of shots) { await page.goto(`${BASE}${path}`, { waitUntil: "load" }); await page.waitForTimeout(2500); await hideFooter(page); await shot(page, name, true); }
    if (state.friendBook) {
      await login(page, "fin-friend", `/reports/${state.friendBook}`); await page.waitForTimeout(3000);
      await page.getByRole("button", { name: /펼치|읽기|시작/ }).first().click().catch(() => {});
      await page.waitForTimeout(1200);
      for (const kind of ["cover", "narrative", "appendix", "back"]) {
        if (await toPage(page, kind)) {
          await hideFooter(page); await part(page, "[role=region][data-page]", `book-${kind}`);
          // 리드 커밋(76b59784)이 바꾼 판 표기 줄("제n판 · … 개정/기준")만 가린 사본도 찍는다(내 변경과 무관한 차이를 빼고 비교).
          await page.evaluate(() => { for (const el of document.querySelectorAll("[role=region][data-page] *")) if (el.children.length === 0 && /^제\d+판 · /.test(el.textContent ?? "")) el.style.visibility = "hidden"; });
          await part(page, "[role=region][data-page]", `book-${kind}-edition-masked`);
        }
        else log("page not reached", kind);
      }
    }
    await ctx.close();
  }
} finally { await browser.close(); }
