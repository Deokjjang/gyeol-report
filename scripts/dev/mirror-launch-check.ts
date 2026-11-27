/**
 * 「남이 본 나」 명령 3 로컬 확인(실제 브라우저 · 로컬 DB · 개발 서버 http://localhost:3300, 두 관문 모두 열린 next dev). 운영 · 외부 호출 없음.
 * 결제는 tools/p6d/toss-mock.mjs 대역(개발 서버를 NODE_OPTIONS="--import …/toss-mock.mjs" TOSS_MOCK_DIR=… OPS_MOCK_WRITER=ok 로 띄운다), 작가는 목업.
 *   pnpm exec tsx scripts/dev/mirror-launch-check.ts existing     # 아이디 · 질문지 없는 기존 회원(p6e-cust, 책 보유): (a) 책 주소 (b) 공유 링크 (c) 내 계정 → 심층 리포트 (d) 결제 → 발행 → 책 열기 (e) 이용권으로 책 시작
 *   pnpm exec tsx scripts/dev/mirror-launch-check.ts root         # 같은 처지의 회원(p6e-oldmember, 또는 MIRROR_ROOT_AS)이 "/"로 들어갈 때만 프로필 → 질문지 → 홈, 끝난 뒤 서재 책 그대로
 *   pnpm exec tsx scripts/dev/mirror-launch-check.ts me           # 서재 기능 대조표의 기능 하나하나를 새 내 계정(/me)에서 실행
 *   pnpm exec tsx scripts/dev/mirror-launch-check.ts viewports    # 390×844 · 360×780 · 430×932 전체 흐름(가로 넘침 0)
 *   pnpm exec tsx scripts/dev/mirror-launch-check.ts ua           # 인스타 · 카톡 인앱, iOS 사파리, 안드로이드 크롬 UA로 로그인 분기
 * 화면은 ~/Desktop/gyeol-review/mirror-01/launch/ 아래에 남긴다.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { MIRROR_ITEMS } from "../../src/data/mirror/items";
import { assertEnvFileLocal, assertLocal, psql, readEnvFile, ROOT } from "./local";

const BASE = process.env.MIRROR_BASE ?? "http://localhost:3300";
assertLocal(BASE, "개발 서버"); assertEnvFileLocal();
const OUT = join(homedir(), "Desktop/gyeol-review/mirror-01/launch");
const VIEW = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "ko-KR", timezoneId: "Asia/Seoul" };
const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const log = (...a: unknown[]) => console.log(...a);
let failures = 0;
const check = (ok: boolean, what: string) => { log(ok ? "  ✓" : "  ✗", what); if (!ok) failures++; };
const shot = async (page: Page, name: string, full = false) => { await page.waitForTimeout(600); mkdirSync(OUT, { recursive: true }); await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full }); log("  📸", `launch/${name}.png`); };
const uid = (as: string) => psql(`select id from auth.users where email=${q(`p6e-${as}@gyeol.local`)};`);
const launch = (): Promise<Browser> => chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
async function login(ctx: BrowserContext, as: string, next: string) { const p = await ctx.newPage(); await p.goto(`${BASE}/dev/v5-login?as=${as}&next=${encodeURIComponent(next)}`, { waitUntil: "load" }); return p; }
/** 아이디 · 질문지 화면(프로필 설정 · 자가 질문지 시작 · 질문)이 지금 화면에 있는가. */
const mirrorGate = (page: Page) => page.locator("[data-mirror-screen=profile],[data-mirror-screen=intro],[data-mirror-screen=quiz]").count();
/** 책이 열렸는가(책 화면 본문). 「제본 중」 상태 화면도 책 주소 그대로면 연 것으로 보지 않는다. */
/** 상품 · 입력 화면의 이벤트 · 보상 팝업(기존 기능)이 떠 있으면 닫는다. */
async function closePopup(page: Page) { await page.waitForTimeout(1500); if (await page.locator("dialog[data-event-popup][open]").count()) { await page.keyboard.press("Escape"); await page.waitForTimeout(500); } }
async function bookOpened(page: Page, timeout = 30_000) {
  try {
    // 공유 링크는 표지(「책 펼치기」 — 표지 버튼 data-opening)부터 — 눌러서 본문까지 연다.
    await page.waitForSelector("[data-book-report], button[data-opening]", { timeout });
    const open = page.locator("button[data-opening]").first();
    if (!await page.locator("[data-book-report]").count() && await open.count()) { await open.click(); await page.waitForSelector("[data-book-report]", { timeout }); }
    return true;
  } catch { return false; }
}
const booksOf = (as: string) => psql(`select report_id from public.report_account_links where user_id=${q(uid(as))} and revoked_at is null order by linked_at;`).split("\n").filter(Boolean);
const mirrorProfile = (as: string) => Number(psql(`select count(*) from public.mirror_profiles where user_id=${q(uid(as))};`));
const envFile = readEnvFile();
async function worker(path: "report-jobs" | "report-ticket-jobs") {
  const out: number[] = [];
  for (let i = 0; i < 8; i++) { const r = await fetch(`${BASE}/api/internal/${path}`, { headers: { authorization: `Bearer ${envFile.CRON_SECRET}` } }); out.push(r.status); await new Promise(r2 => setTimeout(r2, 1500)); }
  return out.join(",");
}

/* ───────── (a)~(e) 기존 회원이 바로 책을 연다 ───────── */
async function existing() {
  const AS = "cust";
  check(mirrorProfile(AS) === 0, `p6e-${AS}: 아이디(남이 본 나 프로필) 없음`);
  const books = booksOf(AS);
  check(books.length > 0, `p6e-${AS}: 서재 책 ${books.length}권`);
  const b = await launch(), ctx = await b.newContext(VIEW);
  const page = await login(ctx, AS, "/products");
  // (a) 책 주소: 서재 책 중 열 수 있는 책(환불 시험으로 닫힌 책은 「환불된 주문」 화면이 맞다).
  let book = "";
  for (const id of books) { await page.goto(`${BASE}/reports/${id}`, { waitUntil: "load" }); if (await bookOpened(page, 15_000)) { book = id; break; } log(`  (${id}: 열 수 없는 책 — ${(await page.textContent("h1").catch(() => "")) ?? ""})`); }
  check(!!book && page.url().endsWith(`/reports/${book}`) && await mirrorGate(page) === 0, `(a) 책 주소 /reports/${book} — 로그인만으로 바로 열림(아이디 · 질문지 화면 없음)`);
  await shot(page, "a-book-url");
  // (b) 공유 링크(로그인한 회원 · 로그인 안 한 사람 모두)
  // 책 공유 링크: 책 화면의 공유 칸과 같은 요청(/api/book-share, 주인 세션으로 서버가 다시 확인).
  const shared = await page.evaluate(async id => { const r = await fetch("/api/book-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId: id }), cache: "no-store" }); return { status: r.status, body: await r.json().catch(() => null) as { model?: { shareUrl?: string } } | null }; }, book);
  const shareUrl = shared.body?.model?.shareUrl ? new URL(shared.body.model.shareUrl, BASE).pathname : "";
  if (!shareUrl) log("  공유 발급 응답:", shared.status);
  check(/^\/r\/[A-Za-z0-9_-]+$/.test(shareUrl), `(b) 공유 링크 발급 ${shareUrl.slice(0, 8)}…`);
  await page.goto(`${BASE}${shareUrl}`, { waitUntil: "load" });
  check(await bookOpened(page) && await mirrorGate(page) === 0, "(b) 공유 링크 /r/<token> — 회원 브라우저에서 바로 열림");
  const guest = await b.newContext(VIEW), gp = await guest.newPage();
  await gp.goto(`${BASE}${shareUrl}`, { waitUntil: "load" });
  check(await bookOpened(gp) && await mirrorGate(gp) === 0, "(b) 공유 링크 — 로그인 안 한 브라우저에서도 바로 열림");
  await shot(gp, "b-share-link"); await guest.close();
  // (c) 내 계정 → 내 리포트 → 심층 리포트 → 읽기
  await page.goto(`${BASE}/me`, { waitUntil: "load" });
  await page.waitForSelector("[data-me-profile], [data-me-consent]", { timeout: 30_000 });
  if (await page.locator("[data-me-consent]").count()) {
    // 기존 회원의 약관 재동의(새 판) — 기존 /account와 같은 동의. 「남이 본 나」 관문이 아니다.
    await shot(page, "c-me-reconsent"); await page.check("input[name=terms]"); await page.check("input[name=privacy]"); await page.getByRole("button", { name: "동의하고 계속하기" }).click();
    await page.waitForSelector("[data-me-profile]", { timeout: 30_000 }); check(true, "(c) 약관 새 판 재동의(기존 /account와 같은 동의) 뒤 내 계정");
  }
  await page.waitForSelector("[data-me-login]", { timeout: 20_000 }).catch(() => undefined);
  check(await page.getAttribute("[data-me-profile]", "data-me-profile") === "account" && await page.locator("[data-me-make-star]").count() === 1, "(c) 아이디 없는 회원: 내 계정 첫 화면 = 계정 정보 + 「내 별 만들기」 카드 하나(강제 없음)");
  check(/카카오 로그인|Google 로그인/.test(await page.textContent("[data-me-login]").catch(() => "") ?? ""), `(c) 프로필 칸 로그인 줄: ${await page.textContent("[data-me-login]").catch(() => "")}`);
  await shot(page, "c-me-main");
  await page.click("[data-me-row=reports]"); await page.waitForSelector("[data-me-library] [data-book-card], [data-me-library] ul[aria-label='내 책 목록'] a", { timeout: 30_000 }).catch(() => undefined);
  await shot(page, "c-me-reports", true);
  const link = page.locator("[data-me-library] a[href^='/reports/']").first();
  check(await link.count() === 1, "(c) 심층 리포트 칸 = 기존 서재 책 목록(LibraryHome)");
  if (await link.count()) { await link.click(); check(await bookOpened(page) && await mirrorGate(page) === 0, `(c) 심층 리포트 → 읽기 → 책 ${page.url().replace(BASE, "")}`); }
  // (d) 결제 완료 → 발행 → 책 열기(서버의 토스 승인은 tools/p6d/toss-mock.mjs 대역, 작가는 목업). 브라우저의 토스 결제창 스크립트는 막는다(외부 호출 0) —
  // 결제 준비(prepare) 응답의 successUrl로 토스가 성공 뒤 하는 이동을 그대로 한다(기존 tools/p6e/e2e.mjs buy 단계와 같은 방식).
  await page.route(/tosspayments\.com/, r => r.abort());
  await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
  await page.waitForSelector("#a-name", { timeout: 30_000 }); await closePopup(page);
  check(await mirrorGate(page) === 0, "(d) 결제 대상 정보 입력 화면 — 프로필 · 질문지 관문 없음");
  await page.locator("#a-name").fill("검수cust"); await page.locator("#a-birthDate").fill("1995-03-14"); await page.locator("#a-gender").selectOption("FEMALE");
  await page.getByLabel("정확").check(); await page.locator("#a-birthTime").fill("08:30");
  await page.getByRole("button", { name: /다음 페이지/ }).click(); await page.waitForTimeout(800);
  await page.getByRole("button", { name: /다음 페이지/ }).click();
  await page.waitForSelector("[data-book-checkout]", { timeout: 30_000 });
  await shot(page, "d-checkout");
  const pay = page.getByLabel(/원 결제하기/);
  if (await pay.count()) {
    await pay.check(); await page.getByLabel("전체 동의").check();
    await page.getByRole("button", { name: /결제하기/ }).first().click();
    await page.waitForSelector("[data-pay-methods] [data-easy-pay=TOSSPAY]", { timeout: 15_000 });
    await shot(page, "d-pay-methods");
    const prepared = page.waitForResponse(r => r.url().includes("/api/payment-checkout/prepare"));
    await page.click("[data-pay-methods] [data-easy-pay=TOSSPAY]");
    const body = await (await prepared).json() as { orderCode?: string; tossCheckoutRequest?: { requestPayment?: { orderId: string; amount: number | { value: number }; successUrl: string } } };
    const rp = body.tossCheckoutRequest?.requestPayment;
    check(!!rp, `(d) 결제 준비 ${body.orderCode ?? "-"}`);
    if (!rp) log("  prepare 응답:", JSON.stringify(body).slice(0, 400));
    if (rp) {
      const success = new URL(rp.successUrl); success.searchParams.set("paymentKey", `tmock_${crypto.randomUUID().replace(/-/g, "")}`);
      success.searchParams.set("orderId", rp.orderId); success.searchParams.set("amount", String(typeof rp.amount === "object" ? rp.amount.value : rp.amount)); success.searchParams.set("paymentType", "NORMAL");
      await page.goto(success.href, { waitUntil: "load" }); await page.waitForTimeout(3000);
      check(await mirrorGate(page) === 0, `(d) 결제 완료 화면 ${new URL(page.url()).pathname} — 프로필 · 질문지 없음`);
      await shot(page, "d-payment-complete");
      log("  워커:", await worker("report-jobs"));
      const reportId = psql(`select report_id from public.payment_orders where provider_order_id=${q(rp.orderId)};`);
      check(/^report_/.test(reportId), `(d) 발행된 책 ${reportId}`);
      await page.waitForTimeout(2500);
      // 결제 완료 화면이 스스로 책으로 넘어가거나(자동 열기), 「책 열기」를 누른다.
      const open = page.locator(`a[href*='/reports/${reportId}']`).first();
      if (!page.url().includes(`/reports/${reportId}`) && await open.count()) await open.click();
      if (!page.url().includes(`/reports/${reportId}`)) await page.goto(`${BASE}/reports/${reportId}`, { waitUntil: "load" });
      check(await bookOpened(page, 60_000) && await mirrorGate(page) === 0, "(d) 결제 완료 → 발행 → 책 열기 — 아이디 · 질문지 없이 열림");
      await shot(page, "d-book");
    }
  } else check(false, "(d) 직접 결제 선택지가 없음");
  // (e) 이용권으로 책 시작: 화면은 같은 입력 · 영수증 화면(관문 없음 확인) → 접수는 tools/p6e/redeem.ts(공개 API는 운영 출처만 받는다 — 같은 RPC) → 워커 → 책 열기
  // 로컬 시험 이용권 1장(scripts/dev/v5-db.ts와 같은 report_tickets('grant') — 로컬 DB만).
  const wallet = () => Number(psql(`select coalesce(sum(quantity_delta),0) from public.report_ticket_ledger where user_id=${q(uid(AS))};`) || "0");
  if (wallet() < 1) psql(`select public.report_tickets('grant', ${q(uid(AS))}, '{"quantity":1,"sourceType":"manual","sourceRef":"mirror-launch-${Date.now()}","key":"mirror-launch-${Date.now()}","reason":"LOCAL_DEV"}'::jsonb);`, { quiet: true });
  log("  이용권(장부 합):", wallet());
  await page.goto(`${BASE}/report/new?product=career-money-study`, { waitUntil: "load" });
  await page.waitForSelector("#a-name", { timeout: 30_000 }); await closePopup(page);
  check(await mirrorGate(page) === 0, "(e) 이용권으로 시작하는 입력 화면 — 프로필 · 질문지 관문 없음");
  const before = new Set(booksOf(AS));
  const out = execFileSync("pnpm", ["exec", "tsx", "tools/p6e/redeem.ts", AS, "career_money_study", "--base", BASE], { cwd: ROOT, encoding: "utf8", timeout: 300_000 });
  log("  redeem:", out.trim().split("\n").slice(-2).join(" | ").slice(0, 200));
  const added = booksOf(AS).filter(id => !before.has(id));
  check(added.length === 1, `(e) 이용권 책 접수 → 서재에 ${added[0] ?? "-"}`);
  if (added[0]) { await page.goto(`${BASE}/reports/${added[0]}`, { waitUntil: "load" }); check(await bookOpened(page, 60_000) && await mirrorGate(page) === 0, "(e) 이용권 책 — 아이디 · 질문지 없이 열림"); await shot(page, "e-ticket-book"); }
  check(mirrorProfile(AS) === 0, "(a)~(e) 뒤에도 이 회원에게 아이디(남이 본 나 프로필)가 생기지 않았다");
  await b.close();
}

/* ───────── "/"로 들어갈 때만 프로필 → 질문지, 끝나도 서재 그대로 ───────── */
async function root() {
  // 한 번 돌면 그 회원에게 아이디가 생긴다 — 다시 돌릴 때는 책 있고 아이디 없는 다른 로컬 회원을 MIRROR_ROOT_AS로 준다(예: friend).
  const AS = process.env.MIRROR_ROOT_AS ?? "oldmember";
  check(mirrorProfile(AS) === 0, `p6e-${AS}: 아이디 없음`);
  const before = booksOf(AS);
  const b = await launch(), ctx = await b.newContext(VIEW);
  const page = await login(ctx, AS, "/products");
  check(await mirrorGate(page) === 0 && new URL(page.url()).pathname === "/products", "상품 목록(/products)에서는 프로필 · 질문지가 끼지 않는다");
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector("[data-mirror-screen=profile]", { timeout: 30_000 });
  check(true, "\"/\"로 들어가면 그때 프로필 설정");
  await shot(page, "root-1-profile");
  await page.fill("input[name=name]", "옛회원");
  const handle = `old.m${Date.now() % 100000}`;
  await page.fill("input[name=handle]", handle); await page.waitForSelector("small:has-text('쓸 수 있어요')", { timeout: 10_000 });
  await page.check("input[name=age14]");
  // 약관 새 판 재동의가 필요한 회원이면 같은 화면에서 받는다(기존 가입 처리 record_account_consent).
  if (await page.locator("input[name=terms]").count()) { await page.check("input[name=terms]"); await page.check("input[name=privacy]"); }
  await page.getByRole("button", { name: "다음" }).click();
  await page.waitForSelector("[data-mirror-screen=intro]", { timeout: 20_000 });
  check(true, "프로필 → 질문지 시작"); await shot(page, "root-2-intro");
  // 질문 60개: 화면으로 3개, 나머지는 같은 API(answer)로 채운 뒤 complete.
  await page.getByRole("button", { name: /시작하기|이어서 하기/ }).click();
  for (let i = 0; i < 3; i++) { await page.waitForSelector("[data-item]"); const it = await page.getAttribute("[data-item]", "data-item"); await page.click("[data-choice='0']"); await page.waitForFunction(prev => document.querySelector("[data-item]")?.getAttribute("data-item") !== prev, it, { timeout: 10_000 }); }
  await page.evaluate(async items => { for (const it of items) await fetch("/api/mirror/answer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId: it.id, version: it.version, choice: it.id.length % 2 }) }); }, MIRROR_ITEMS.map(i => ({ id: i.id, version: i.version })));
  const done = await page.evaluate(async () => (await fetch("/api/mirror/complete", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" })).status);
  check(done === 200, `질문지 60개 완료(${done})`);
  await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForSelector("[data-mirror-screen=home]", { timeout: 30_000 });
  await shot(page, "root-3-home");
  await page.goto(`${BASE}/me#reports`, { waitUntil: "load" }); await page.waitForSelector("[data-me-library]", { timeout: 30_000 }); await page.waitForTimeout(2500);
  const after = booksOf(AS), shelf = await page.locator("[data-me-library] a[href^='/reports/']").count();
  check(after.length === before.length && before.every(x => after.includes(x)) && shelf >= Math.min(1, before.length), `끝난 뒤 서재 책 그대로(DB ${before.length} → ${after.length}권, 화면 ${shelf}개 링크)`);
  await shot(page, "root-4-me-reports", true);
  await b.close();
}

/* ───────── 서재 기능 대조: 새 내 계정에서 하나씩 ───────── */
async function me() {
  const b = await launch();
  // 로그인 전: 로그인 화면(카카오 · Google) + 채널 안내 + 둘러보기
  const g = await b.newContext(VIEW), gp = await g.newPage();
  await gp.goto(`${BASE}/me`, { waitUntil: "load" }); await gp.waitForSelector("[data-mirror-screen=login]", { timeout: 30_000 });
  check(await gp.getByRole("button", { name: "카카오로 시작하기" }).count() === 1 && await gp.getByRole("button", { name: "Google로 시작하기" }).count() === 1, "로그인 전 /me: 카카오 · Google 로그인");
  check(await gp.locator("[data-login-channel-note]").count() === 1 && await gp.locator("[data-me-browse]").getAttribute("href") === "/products", "로그인 전 /me: 카카오 채널 안내 한 줄 · 로그인 없이 둘러보기(/products)");
  const start = await gp.evaluate(async () => { const r = await fetch("/auth/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ provider: "kakao", next: "/me" }) }); return { status: r.status, url: ((await r.json()) as { url?: string }).url ?? "" }; });
  check(start.status === 200 && /kauth\.kakao\.com|kakao|authorize/.test(start.url), `로그인 시작(next=/me) → 카카오 인증 주소(${start.status})`);
  await shot(gp, "me-0-login"); await g.close();
  // 동의가 필요한 회원(새 계정): /me가 약관 동의를 받는다.
  const fresh = `me${Date.now() % 100000}`;
  execFileSync("pnpm", ["exec", "tsx", "scripts/dev/mirror-seed.ts", "--new-owner", fresh], { cwd: ROOT, stdio: "ignore" });
  const nc = await b.newContext(VIEW), np = await login(nc, fresh, "/me");
  await np.waitForSelector("[data-me-consent]", { timeout: 30_000 });
  check(true, "동의 전 회원: /me가 약관 동의를 받는다(기존 /account 동의와 같은 /auth/consent)"); await shot(np, "me-1-consent");
  await np.check("input[name=terms]"); await np.check("input[name=privacy]"); await np.getByRole("button", { name: "동의하고 계속하기" }).click();
  await np.waitForSelector("[data-me-contact-required] [data-profile-form]", { timeout: 30_000 });
  check(true, "동의 뒤 가입 정보(이름 · 이메일) 카드 — 기존 ProfileForm"); await shot(np, "me-2-contact-required", true);
  await np.getByLabel("이름(필수)").fill("검수 새회원");
  if (await np.getByLabel("이메일(필수)").count()) { await np.getByLabel("이메일(필수)").fill(`${fresh}@example.com`); await np.getByLabel("이메일 확인(필수)").fill(`${fresh}@example.com`); }
  await np.getByRole("button", { name: /저장하고 계속하기/ }).click();
  await np.waitForFunction(() => !document.querySelector("[data-me-contact-required]") || !!document.querySelector("[data-event-popup]"), null, { timeout: 30_000 });
  const popup = await np.locator("[data-event-popup]").count();
  check(true, `가입 정보 저장 → ${popup ? "가입 이용권 팝업" : "카드 사라짐(가입 이용권 캠페인 꺼짐)"}`); if (popup) await shot(np, "me-3-signup-popup");
  await nc.close();
  // 책 가진 기존 회원(아이디 없음)
  const c = await b.newContext(VIEW), cp = await login(c, "cust", "/me");
  await cp.waitForSelector("[data-me-profile]", { timeout: 30_000 });
  check(await cp.locator("[data-me-row=reports]").count() === 1 && await cp.locator("[data-me-row=settings]").count() === 1, "첫 화면 = 프로필 한 덩어리 + 「내 리포트 ›」 · 「설정 ›」");
  await cp.click("[data-me-row=reports]"); await cp.waitForSelector("[data-me-library]"); await cp.waitForTimeout(2500);
  check(await cp.locator("[data-me-library] a[href^='/reports/']").count() > 0, "내 리포트 > 심층 리포트: 구매한 책 목록 · 읽기");
  check(await cp.locator("[data-me-library] .ticketWrap, [data-me-library] [class*=ticket]").count() > 0 || (await cp.textContent("[data-me-library]") ?? "").includes("이용권"), "내 리포트 > 심층 리포트: 이용권 보유 · 기한 줄(기존 TicketLine)");
  const giftBtn = cp.locator("[data-me-library] button", { hasText: /선물/ }).first();
  if (await giftBtn.count()) { await giftBtn.click(); await cp.waitForTimeout(800); check(await cp.locator("dialog, [role=dialog], [data-gift-sheet]").count() > 0, "선물 보내기: 기존 선물 시트가 열림(발송은 하지 않음)"); await shot(cp, "me-4-gift-sheet"); await cp.keyboard.press("Escape"); }
  else check(true, "선물 보내기: 이 계정은 선물할 이용권이 없어 버튼이 숨음(기존과 같음)");
  const askBtn = cp.locator("[data-me-library] button", { hasText: "문의·환불 요청" }).first();
  if (await askBtn.count()) { await askBtn.click(); await cp.waitForTimeout(600); check(await cp.locator("[data-me-library] li[data-asking] input[type=radio]").count() > 0, "주문 문의 · 환불 요청: 기존 요청 칸(사유 고르기)이 열림(보내지는 않음)"); await shot(cp, "me-4b-order-request"); }
  else check(true, "주문 문의 · 환불 요청: 이 계정 책에는 요청 버튼 조건이 없음(기존과 같음)");
  await shot(cp, "me-5-reports", true);
  check(await cp.locator("[data-me-more]").getAttribute("href") === "/products", "더 깊이 알아보기 → /products");
  check(await cp.locator("[data-me-mirror-reports] a").first().getAttribute("href").then(h => h === "/" || h === "/start"), "결 보고서 칸: 아이디가 없으면 「내 별 만들기」(강제 없음)");
  await cp.goBack(); await cp.click("[data-me-row=settings]"); await cp.waitForSelector("[data-me-legal]");
  const legal = await cp.locator("[data-me-legal]").evaluateAll(els => els.map(e => e.getAttribute("href")));
  check(["/terms", "/privacy", "/refund", "/business"].every(h => legal.includes(h)), `설정: 약관 · 개인정보 · 환불 · 사업자정보 ${legal.join(",")}`);
  for (const h of legal) { const r = await fetch(`${BASE}${h}`); check(r.status === 200, `  ${h} ${r.status}`); }
  const mk = cp.locator("[data-me-marketing] input[type=checkbox]");
  if (await mk.count()) {
    const was = await mk.isChecked(); await mk.click(); await cp.waitForTimeout(1500); const now = await mk.isChecked(); await mk.click(); await cp.waitForTimeout(1500);
    check(now !== was && await mk.isChecked() === was, "설정 > 혜택 알림: 켜고 끄기(기존 MarketingPanel, 원래대로 되돌림)");
  } else check(false, "설정 > 혜택 알림이 보이지 않음");
  await cp.click("[data-me-withdraw]"); await cp.waitForSelector("[data-me-withdraw-panel]");
  check(await cp.locator("[data-me-withdraw-panel] button, [data-me-withdraw-panel] input").count() > 0, "설정 > 탈퇴: 기존 탈퇴 절차 칸(「탈퇴」 입력 확인 — 실행은 하지 않음)");
  await shot(cp, "me-6-settings", true);
  await cp.click("[data-me-logout]"); await cp.waitForURL(u => new URL(u).pathname === "/", { timeout: 20_000 });
  const sess = await cp.evaluate(async () => (await (await fetch("/auth/session")).json()).status);
  check(sess === "guest", `설정 > 로그아웃 → "/" · 세션 ${sess}`);
  await c.close();
  // 아이디가 있는 회원(서연): @아이디 · 프로필 편집 · 내 페이지 공개 · 결 보고서 호 목록
  const o = await b.newContext(VIEW), op = await login(o, "seoyeon", "/me");
  await op.waitForSelector("[data-me-profile=mirror]", { timeout: 30_000 });
  check(/@seo\.yeon/.test(await op.textContent("[data-me-profile]") ?? ""), "아이디가 있으면 이니셜 · 이름 · @아이디 · 로그인 줄 · 「프로필 편집」");
  await shot(op, "me-7-mirror-main");
  await op.click("[data-me-edit]"); await op.waitForSelector("[data-me-edit-form]");
  check(await op.locator("[data-me-login-view]").count() === 1, "프로필 편집: 이름 · 아이디(30일에 한 번) · 생년월일 · 출생시간 · 로그인 계정(보기만)");
  await op.fill("input[name=birthDate]", "1996-12-06"); await op.fill("input[name=birthTime]", "09:30");
  await op.getByRole("button", { name: "저장" }).click(); await op.waitForSelector("[data-me-profile=mirror]", { timeout: 20_000 });
  const saved = psql(`select birth_date||' '||birth_time from public.mirror_profiles where user_id=${q(uid("seoyeon"))};`);
  check(/1996-12-06 09:30/.test(saved), `프로필 편집 저장(생년월일 · 출생시간) → ${saved}`);
  await shot(op, "me-8-edit");
  // 유료 대상 정보 입력: 프로필의 생년월일 · 출생시간이 빈 칸에 미리 채워진다(폼 값만).
  await op.evaluate(() => { for (const k of Object.keys(sessionStorage)) sessionStorage.removeItem(k); });
  await op.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" }); await op.waitForSelector("#a-birthDate"); await closePopup(op); await op.waitForTimeout(1500);
  check(await op.inputValue("#a-birthDate") === "1996-12-06" && await op.inputValue("#a-birthTime").catch(() => "") === "09:30", `결제 대상 정보 입력: 생년월일 · 출생시간 미리 채움(${await op.inputValue("#a-birthDate")} ${await op.inputValue("#a-birthTime").catch(() => "-")})`);
  await shot(op, "me-9-prefill");
  await op.goto(`${BASE}/me#settings`, { waitUntil: "load" }); await op.waitForSelector("[data-public]");
  const pub = await op.getAttribute("[data-public]", "aria-checked"); await op.click("[data-public]"); await op.waitForTimeout(1200);
  const flipped = psql(`select is_public from public.mirror_profiles where user_id=${q(uid("seoyeon"))};`); await op.click("[data-public]"); await op.waitForTimeout(1200);
  check((pub === "true") !== (flipped === "t"), `설정 > 내 페이지 공개 켜고 끄기(${pub} → ${flipped}, 되돌림)`);
  await op.goto(`${BASE}/me#reports`, { waitUntil: "load" }); await op.waitForSelector("[data-me-mirror-reports]"); await op.waitForTimeout(2000);
  const issues = await op.locator("[data-me-issue]").count();
  check(issues > 0 || await op.locator("[data-me-issue-ready],[data-me-issue-wait]").count() > 0, `내 리포트 > 결 보고서: 호 목록 ${issues}개(또는 받기 · 60개부터 안내)`);
  if (issues) { await op.locator("[data-me-issue]").first().click(); await op.waitForSelector("[data-report-issue]", { timeout: 20_000 }); check(await op.locator("[data-closing]").count() > 0, "결 보고서 한 호: 꼭지마다 마지막 한 줄"); await shot(op, "me-10-report", true); }
  await o.close(); await b.close();
}

/* ───────── 화면 폭 3가지 전체 흐름 ───────── */
async function viewports() {
  const b = await launch();
  for (const [w, h] of [[390, 844], [360, 780], [430, 932]] as const) {
    const name = `vp${w}x${Date.now() % 10000}`;
    execFileSync("pnpm", ["exec", "tsx", "scripts/dev/mirror-seed.ts", "--new-owner", name], { cwd: ROOT, stdio: "ignore" });
    const ctx = await b.newContext({ ...VIEW, viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const over = async (what: string) => { const x = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth })); check(x.sw <= x.iw, `${w}×${h} ${what}: 가로 넘침 없음(${x.sw} ≤ ${x.iw})`); };
    await p.goto(`${BASE}/`, { waitUntil: "load" }); await p.waitForSelector("[data-mirror-screen=login]"); await over("로그인"); await shot(p, `vp-${w}-1-login`);
    await p.goto(`${BASE}/dev/v5-login?as=${name}&next=/`, { waitUntil: "load" }); await p.waitForSelector("[data-mirror-screen=profile]", { timeout: 30_000 });
    await p.fill("input[name=name]", "폭시험"); await p.fill("input[name=handle]", `w${w}.${Date.now() % 100000}`); await p.waitForSelector("small:has-text('쓸 수 있어요')");
    await p.check("input[name=age14]"); await p.check("input[name=terms]").catch(() => undefined); await p.check("input[name=privacy]").catch(() => undefined);
    await over("프로필"); await shot(p, `vp-${w}-2-profile`);
    await p.getByRole("button", { name: "다음" }).click(); await p.waitForSelector("[data-mirror-screen=intro]", { timeout: 20_000 }); await over("질문지 시작");
    await p.getByRole("button", { name: /시작하기/ }).click();
    for (let i = 0; i < 60; i++) {
      await p.waitForSelector("[data-item]", { timeout: 15_000 }).catch(() => undefined);
      if (!await p.locator("[data-item]").count()) break;
      const it = await p.getAttribute("[data-item]", "data-item"); await p.click(`[data-choice='${i % 2}']`);
      if (i === 5) { await over("질문"); await shot(p, `vp-${w}-3-quiz`); }
      await p.waitForFunction(prev => document.querySelector("[data-item]")?.getAttribute("data-item") !== prev, it, { timeout: 15_000 }).catch(() => undefined);
    }
    await p.waitForSelector("[data-mirror-screen=home]", { timeout: 60_000 }); await p.waitForTimeout(1500); await over("홈"); await shot(p, `vp-${w}-4-home`);
    await p.getByRole("button", { name: "친구에게 물어보기" }).click(); await p.waitForSelector("[data-share-sheet], [role=dialog]", { timeout: 15_000 }); await over("공유 시트"); await shot(p, `vp-${w}-5-share`);
    const handle = psql(`select handle from public.mirror_profiles where user_id=${q(uid(name))};`);
    const f = await b.newContext({ ...VIEW, viewport: { width: w, height: h } }), fp = await f.newPage();
    await fp.goto(`${BASE}/@${handle}`, { waitUntil: "load" }); await fp.waitForSelector("[data-mirror-friend=landing]");
    const fo = async (what: string) => { const x = await fp.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth })); check(x.sw <= x.iw, `${w}×${h} ${what}: 가로 넘침 없음`); };
    await fo("친구 랜딩"); await fp.getByRole("button", { name: /에 대해 답하기/ }).click(); await fp.click('[data-closeness="2"]');
    for (let i = 0; i < 12; i++) { await fp.waitForSelector("[data-item]"); const it = await fp.getAttribute("[data-item]", "data-item"); await fp.click("[data-choice='0']"); await fp.waitForFunction(prev => document.querySelector("[data-item]")?.getAttribute("data-item") !== prev || !!document.querySelector("[data-friend-step=checkpoint]"), it, { timeout: 15_000 }); }
    await fo("친구 질문"); await fp.getByRole("button", { name: "질문 끝내기" }).click(); await fp.waitForSelector("[data-friend-step=story]");
    await fp.getByRole("button", { name: "건너뛰고 보내기" }).click(); await fp.waitForSelector("[data-mirror-friend=result]", { timeout: 30_000 }); await fp.waitForTimeout(2500); await fo("친구 결과"); await shot(fp, `vp-${w}-6-friend-result`);
    await f.close();
    await p.goto(`${BASE}/me`, { waitUntil: "load" }); await p.waitForSelector("[data-me-profile]"); await over("내 계정"); await shot(p, `vp-${w}-7-me`);
    await ctx.close();
  }
  await b.close();
}

/* ───────── 인앱 · 브라우저 UA별 로그인 분기 ───────── */
async function ua() {
  const UA = {
    "instagram-ios": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 357.0.0.25.101 (iPhone15,3; iOS 18_1; ko_KR; ko; scale=3.00; 1290x2796; 654321)",
    "instagram-android": "Mozilla/5.0 (Linux; Android 14; SM-S918N Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.102 Mobile Safari/537.36 Instagram 357.0.0.25.101 Android (34/14; 480dpi; 1080x2340; samsung; SM-S918N; dm3q; qcom; ko_KR; 654321)",
    "kakaotalk-ios": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.9.0",
    "kakaotalk-android": "Mozilla/5.0 (Linux; Android 14; SM-S918N Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.102 Mobile Safari/537.36 KAKAOTALK 10.9.0",
    "safari-ios": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
    "chrome-android": "Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  } as const;
  const b = await launch();
  for (const [name, userAgent] of Object.entries(UA)) {
    const ctx = await b.newContext({ ...VIEW, userAgent }), p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "load" }); await p.waitForSelector("[data-mirror-screen=login]", { timeout: 30_000 }); await p.waitForTimeout(1200);
    const kakao = await p.getByRole("button", { name: "카카오로 시작하기" }).count(), google = await p.getByRole("button", { name: "Google로 시작하기" }).count(), inApp = await p.getAttribute("[data-in-app]", "data-in-app").catch(() => null);
    const inAppExpected = name.startsWith("instagram") || name.startsWith("kakaotalk");
    check(kakao === 1 && (inAppExpected ? google === 0 && !!inApp : google === 1 && !inApp), `${name}: 카카오 버튼 ${kakao} · Google ${google ? "버튼" : `자리 → 「Google은 기본 브라우저에서 열려요」(${inApp})`}`);
    if (inAppExpected) {
      // 「브라우저로 열기」: 안드로이드는 크롬 intent, 카톡은 외부 브라우저 주소, 아이폰 인스타는 「⋯ → 외부 브라우저로 열기」 안내 + 링크 복사(주소에 일회용 토큰).
      let navigated = "";
      p.on("framenavigated", fr => { if (fr === p.mainFrame()) navigated = fr.url(); });
      await p.route(/^(intent|kakaotalk):/, r => r.abort()).catch(() => undefined);
      const nav = p.waitForEvent("request", { timeout: 4000, predicate: r => /^(intent|kakaotalk|googlechrome|x-safari)/.test(r.url()) }).then(r => r.url()).catch(() => "");
      await p.getByRole("button", { name: "브라우저로 열기" }).click(); await p.waitForTimeout(1500);
      const ext = await nav, help = await p.locator("[data-in-app] button", { hasText: "링크 복사" }).count(), token = new URL(p.url()).searchParams.get("h");
      // 데스크톱 크로미움은 intent:// 이동을 요청으로 내보내지 않는다 — 같은 함수로 만든 주소를 확인하고, 화면이 「링크 복사」 대체 안내로 빠지지 않았는지 본다.
      const { externalBrowserUrl, inAppBrowser } = await import("../../src/lib/account/inAppBrowser");
      // 안드로이드 크롬 intent 주소는 https 주소에서만 만든다(로컬은 http라 「링크 복사」 대체 안내가 맞다) — 운영 주소로 같은 함수를 확인한다.
      const computed = externalBrowserUrl(inAppBrowser(userAgent)!, userAgent, "https://gyeolreport.com/start") ?? "";
      const androidLocal = name === "instagram-android" && BASE.startsWith("http://") && help === 1 && /^intent:\/\/gyeolreport\.com\/start#Intent;scheme=https;package=com\.android\.chrome;end$/.test(computed);
      const target = ext || navigated || (androidLocal ? `${computed} (로컬 http는 링크 복사 안내)` : "");
      const ok = name === "instagram-ios" ? help === 1 && !!token : /^(intent:|kakaotalk:)/.test(target);
      check(ok, `${name}: 브라우저로 열기 → ${name === "instagram-ios" ? `안내 + 링크 복사${token ? " · 일회용 토큰" : ""}` : target.slice(0, 56)}`);
    }
    await shot(p, `ua-${name}`); await ctx.close();
  }
  await b.close();
}

/**
 * 홈 초기 번들(배포 빌드 · next start에서): 로그인 전 첫 화면이 받는 JS(전송 크기)를 three 묶음과 나눠 잰다 · WebGL 불가 → 2D · ?sky=2d.
 *   MIRROR_BASE=http://localhost:3400 pnpm exec tsx scripts/dev/mirror-launch-check.ts bundle [시작 주소]
 */
async function bundle() {
  const path = process.argv[3] ?? "/";
  const measure = async (args: string[], url: string) => {
    const b = await chromium.launch({ args }), ctx = await b.newContext(VIEW), p = await ctx.newPage();
    const js: { url: string; bytes: number; three: boolean }[] = [];
    p.on("response", async r => {
      if (!/\.js(\?|$)/.test(r.url()) || r.status() !== 200) return;
      try { const body = await r.text(), sizes = await r.request().sizes(); js.push({ url: r.url(), bytes: sizes.responseBodySize, three: /WebGLRenderer|THREE\.|three\.module/.test(body) }); } catch { /* 이미 닫힘 */ }
    });
    await p.goto(`${BASE}${url}`, { waitUntil: "load" }); await p.waitForSelector("[data-mirror-screen=login]", { timeout: 30_000 }); await p.waitForTimeout(3500);
    const mode = await p.getAttribute("canvas[data-sky-mode]", "data-sky-mode").catch(() => null);
    await b.close();
    const kb = (n: number) => Math.round(n / 102.4) / 10;
    if (process.env.BUNDLE_DEBUG) for (const j of js.filter(x => x.three)) log("   three?", j.url.replace(BASE, ""), j.bytes);
    return { mode, all: kb(js.reduce((x, j) => x + j.bytes, 0)), withoutThree: kb(js.filter(j => !j.three).reduce((x, j) => x + j.bytes, 0)), three: kb(js.filter(j => j.three).reduce((x, j) => x + j.bytes, 0)), files: js.length };
  };
  const gl = await measure(["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"], path);
  log(`  첫 화면 JS(전송): 전체 ${gl.all}KB · three 제외 ${gl.withoutThree}KB · three ${gl.three}KB · 파일 ${gl.files}개 · 하늘 ${gl.mode}`);
  check(gl.mode === "3d", `WebGL 되는 기기: 3D(${gl.mode})`);
  const noGl = await measure(["--disable-webgl", "--disable-3d-apis", "--disable-gpu"], path);
  check(noGl.mode === "2d" && noGl.three === 0, `WebGL 불가: 2D로 · three를 받지 않는다(${noGl.mode}, three ${noGl.three}KB, 전체 ${noGl.all}KB)`);
  const forced = await measure(["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"], `${path}${path.includes("?") ? "&" : "?"}sky=2d`);
  check(forced.mode === "2d" && forced.three === 0, `저사양 선택(?sky=2d): 2D · three 안 받음(${forced.mode}, three ${forced.three}KB)`);
}

/** 살펴보기: pnpm exec tsx scripts/dev/mirror-launch-check.ts peek <계정|guest> <주소> <파일 이름> — 화면 · 콘솔 오류만 남긴다. */
async function peek() {
  const [as, path, name] = process.argv.slice(3);
  const b = await launch(), ctx = await b.newContext(name.endsWith("-desktop") ? { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: "ko-KR" } : VIEW);
  const p = as === "guest" ? await ctx.newPage() : as === "dev" ? await (async () => { const pg = await ctx.newPage(); await pg.goto(`${BASE}/dev/v5-login?next=${encodeURIComponent(path)}`, { waitUntil: "load" }); return pg; })() : await login(ctx, as, path);
  const errs: string[] = [];
  p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 300)); }); p.on("pageerror", e => errs.push(`PAGEERROR ${String(e).slice(0, 400)}`));
  if (as === "guest") await p.goto(`${BASE}${path}`, { waitUntil: "load" }); else await p.reload({ waitUntil: "load" });
  await p.waitForTimeout(5000); await shot(p, name, !name.endsWith("-desktop")); log(p.url()); log(errs.join("\n")); await b.close();
}

const cmd = process.argv[2];
const run: Record<string, () => Promise<void>> = { existing, root, me, viewports, ua, peek, bundle };
if (!run[cmd]) { console.error(`사용: ${Object.keys(run).join(" | ")}`); process.exit(2); }
run[cmd]().then(() => { log(failures ? `실패 ${failures}` : "모두 통과"); process.exit(failures ? 1 : 0); }).catch(e => { console.error(e); process.exit(1); });
