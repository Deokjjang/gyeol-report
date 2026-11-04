/**
 * P6d-ops 로컬 E2E + 390px 캡처(로컬 dev 서버, 로컬 Supabase, 토스 테스트 키, 목업 작가 OPS_MOCK_WRITER=ok).
 *   BASE=http://localhost:3300 PLAYWRIGHT=<playwright index.mjs> node tools/p6d/e2e.mjs <phase>
 * phase: profile | home | buy | library | request | admin | refund | design | design-auth
 * 순서: profile → home → buy(결제창 확인 후 successUrl로 이동 → 승인) → (워커: GET /api/internal/report-jobs, Bearer CRON_SECRET) → library → request → admin → refund(ADMIN_PIN).
 * dev 서버: 토스 테스트 키는 환경으로만 넘기고(파일 복사·출력 금지), 승인·취소는 tools/p6d/toss-mock.mjs(NODE_OPTIONS --import)가 받는다.
 * design / design-auth: 요청 밖 화면을 기준 트리(BASE=다른 포트)와 이 브랜치에서 SHOT_DIR만 바꿔 찍고 cmp로 비교한다.
 * 상태(주문 orderId 등)는 docs/v5/ui-p6d/state.json에 이어 쓴다. 캡처는 docs/v5/ui-p6d/<이름>.png.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3300";
const OUT = join(ROOT, "docs/v5/ui-p6d", process.env.SHOT_DIR ?? "");
mkdirSync(OUT, { recursive: true });
const STATE = join(ROOT, "docs/v5/ui-p6d/state.json");
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
const phase = process.argv[2];
const browser = await chromium.launch();
const storage = join(ROOT, "docs/v5/ui-p6d/.storage.json");
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(existsSync(storage) && phase !== "design" ? { storageState: storage } : {}) });
const page = await ctx.newPage();
const log = (...a) => console.log(`[${phase}]`, ...a);
page.on("console", m => { if (m.type() === "error") log("console:", m.text().slice(0, 200)); });
const shot = async (name, full = true) => { await page.waitForTimeout(600); await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full }); log("shot", name); };
/** 긴 서재 화면은 해당 구역만 390px 폭으로 찍는다. */
const part = async (selector, name) => { const el = page.locator(selector).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await el.screenshot({ path: join(OUT, `${name}.png`) }); log("shot", name); };
const login = async next => { await page.goto(`${BASE}/dev/v5-login?next=${encodeURIComponent(next)}`, { waitUntil: "load" }); await ctx.storageState({ path: storage }); };

try {
  if (phase === "profile") {
    await login("/account");
    await page.waitForSelector("[data-profile-form]", { timeout: 30_000 });
    await page.getByRole("button", { name: /저장하고 계속하기/ }).waitFor({ timeout: 30_000 });
    await part("[data-profile-form]", "profile-form");
    await page.getByLabel("이름(필수)").fill("검수 회원");
    if (await page.getByLabel("이메일(필수)").count()) { // 확인된 계정 이메일이 없을 때만 직접 입력(두 번)
      await page.getByLabel("이메일(필수)").fill("qa@example.com");
      await page.getByLabel("이메일 확인(필수)").fill("qa@example.com");
    } else log("email: provider-confirmed (locked)");
    await page.getByLabel("휴대폰(선택)").fill("010-1234-5678");
    await page.getByRole("button", { name: /저장하고 계속하기/ }).click();
    await page.waitForSelector("[data-profile-form]", { state: "detached", timeout: 20_000 });
    await shot("profile-saved", false);
  }
  if (phase === "home") {
    await page.goto(BASE, { waitUntil: "load" });
    await shot("home", false);
    await page.locator("section[aria-label='여섯 권의 책 고르기']").focus();
    for (let i = 0; i < 2; i++) { await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(800); }
    await shot("home-annual-center", false);
    await page.goto(`${BASE}/report/new?product=major-fortune`, { waitUntil: "load" }); await page.getByText("12월 1일 · 2027 신년판 공개").first().waitFor();
    await shot("notice-major");
  }
  if (phase === "buy") {
    // 시험 전용: 운영 결제창은 토스페이 간편결제(실제 앱 로그인 필요)라 자동화가 안 된다. 테스트 브라우저 안에서만 SDK 요청을
    // 일반 카드 결제창(flowMode DEFAULT, 샌드박스 "실제 결제가 안되는 테스트")으로 바꾼다. 결제 준비·승인·주문 기록은 실제 경로 그대로.
    await page.addInitScript(() => {
      let real; Object.defineProperty(window, "TossPayments", { configurable: true, get() { return real; }, set(v) {
        real = (...a) => { const tp = v(...a); const orig = tp.payment.bind(tp); tp.payment = (...b) => { const pm = orig(...b); const rq = pm.requestPayment.bind(pm);
          pm.requestPayment = req => { const r = { ...req, card: { ...(req.card ?? {}), flowMode: "DEFAULT" } }; delete r.card.easyPay; return rq(r); }; return pm; }; return tp; }; } });
    });
    await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
    await page.locator("#a-name").fill("검수");
    await page.locator("#a-birthDate").fill("1995-03-14");
    await page.locator("#a-gender").selectOption("FEMALE");
    await page.getByLabel("정확").check();
    await page.locator("#a-birthTime").fill("08:30");
    await page.getByRole("button", { name: /다음 페이지/ }).click();
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: /다음 페이지/ }).click();
    await page.waitForSelector("[data-book-checkout]", { timeout: 30_000 });
    const pay = page.getByLabel(/원 직접 결제/);
    await pay.waitFor({ timeout: 30_000 }); await pay.check();
    await page.getByLabel("전체 동의").check();
    await shot("checkout");
    await page.setViewportSize({ width: 1280, height: 900 }); // 토스 PC 결제창은 넓은 화면에서만 다 보인다(캡처 대상 아님)
    const prepared = page.waitForResponse(r => r.url().includes("/api/payment-checkout/prepare"));
    await page.getByRole("button", { name: /결제하기/ }).click();
    const body = await (await prepared).json();
    state.orderCode = body.orderCode; state.providerOrderId = body.tossCheckoutRequest?.requestPayment?.orderId ?? body.checkoutSession?.providerOrderId;
    log("prepared", state.orderCode, state.providerOrderId, "orderName:", body.tossCheckoutRequest?.requestPayment?.orderName, "customer:", Boolean(body.tossCheckoutRequest?.requestPayment?.customerEmail));
    save();
    const frame = async () => { for (let i = 0; i < 40; i++) { const f = page.frames().find(x => /payment-gateway-sandbox/.test(x.url())); if (f && await f.getByText("신한", { exact: true }).count().catch(() => 0)) return f; await page.waitForTimeout(500); } throw new Error("toss frame not found"); };
    const f = await frame();
    const btn = (name) => f.locator("button, a, [role=button], label").filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) }).first();
    await btn("신한").click();
    const terms = f.getByRole("checkbox", { name: /서비스 이용 약관/ }).first();
    if (await terms.count()) await terms.check({ force: true }); else await f.getByText(/\[필수\] 서비스 이용 약관/).first().click({ force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(OUT, "toss-sandbox-card.png") }); log("shot toss-sandbox-card");
    // 여기서 "다음"을 누르면 카드사 실제 인증 페이지(앱 인증)로 넘어간다 → 자동화하지 않는다.
    // 대신 토스가 결제 성공 뒤 하는 일(successUrl로 paymentKey·orderId·amount를 붙여 이동)을 그대로 한다.
    // 이때 dev 서버의 토스 API 호출(승인·조회·취소)은 NODE_OPTIONS로 넣은 로컬 대역(scratchpad toss-mock.mjs)이 받는다.
    const rp = body.tossCheckoutRequest?.requestPayment ?? {};
    const success = new URL(rp.successUrl); success.searchParams.set("paymentKey", `tmock_${crypto.randomUUID().replace(/-/g, "")}`);
    success.searchParams.set("orderId", rp.orderId); success.searchParams.set("amount", String(typeof rp.amount === "object" ? rp.amount.value : rp.amount)); success.searchParams.set("paymentType", "NORMAL");
    state.successPath = success.pathname; save();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(success.href, { waitUntil: "load" });
    log("url after pay:", page.url());
    await page.waitForLoadState("load").catch(() => undefined);
    await page.waitForTimeout(4000);
    await shot("payment-complete", false);
    state.afterPayUrl = page.url(); save();
  }
  if (phase === "library") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" });
    await page.waitForSelector("[data-purchase-history] [data-order-code]", { timeout: 30_000 });
    await part("[data-purchase-history]", "library-history");
    if (await page.locator("[data-gift-panel]").count()) await part("[data-gift-panel]", "library-gift");
  }
  if (phase === "request") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" });
    await page.waitForSelector("[data-purchase-history]");
    const card = page.locator(`[data-order-code='${state.orderCode}']`);
    await card.getByRole("button", { name: "문의·환불 요청" }).click();
    await card.getByLabel("사유").selectOption("calc_error");
    await card.getByLabel("메모(선택)").fill("E2E: 생년월일 계산 확인 요청");
    await card.getByRole("button", { name: "요청 보내기" }).click();
    await page.waitForTimeout(1500);
    await part(`[data-order-code='${state.orderCode}']`, "library-request");
  }
  if (phase === "admin") {
    await page.goto(`${BASE}/admin/orders`, { waitUntil: "load" });
    await shot("admin-list");
    await page.goto(`${BASE}/admin/orders?tab=requests`, { waitUntil: "load" });
    await shot("admin-requests");
    await page.goto(`${BASE}/admin/orders?tab=members`, { waitUntil: "load" });
    await shot("admin-members");
    await page.goto(`${BASE}/admin/orders?q=gyeol2026`, { waitUntil: "load" });
    await shot("admin-search-legacy");
    await page.goto(`${BASE}/admin/orders/${state.orderCode}`, { waitUntil: "load" });
    await shot("admin-detail");
  }
  if (phase === "refund") {
    await page.goto(`${BASE}/admin/orders/${state.orderCode}`, { waitUntil: "load" });
    await page.getByRole("button", { name: "환불 진행…" }).click();
    await page.locator("#refund-reason").fill("E2E 시험 환불(계산 오류 요청 처리)");
    await page.locator("#refund-confirm").fill(state.orderCode);
    await page.locator("#refund-pin").fill(process.env.ADMIN_PIN ?? "");
    await page.getByRole("button", { name: "환불 확정" }).click();
    await page.waitForTimeout(8000);
    await shot("admin-refunded");
    log("status text:", (await page.locator("[role=status]").allTextContents()).join(" | ").slice(0, 300));
  }
  if (phase === "design-auth") {
    // 로그인 상태의 요청 밖 화면: 이미 있는 이용권 Book(열람 화면). 임시본이 아니면 안내 줄이 없어야 하고 기준 트리와 같아야 한다.
    for (const [name, path] of [["d-book-v5", process.env.BOOK_PATH ?? "/reports/report_5cb4c1bb7f7c405cacc2624dff94e76f"]]) {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" }); await page.waitForSelector("[data-book-report]", { timeout: 30_000 });
      await shot(name, false);
      await page.keyboard.press("ArrowRight"); await page.waitForTimeout(900); await shot(`${name}-p2`, false);
    }
  }
  if (phase === "design") {
    // 요청 밖 화면(디자인 동결): 같은 목록을 기준 트리와 이 브랜치에서 찍어 cmp로 비교한다.
    for (const [name, path] of [["d-input-full", "/report/new?product=saju-mbti-full"], ["d-input-career", "/report/new?product=career-money-study"], ["d-privacy", "/privacy"], ["d-terms", "/terms"], ["d-login", "/login"]]) {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" }); await page.waitForTimeout(1500);
      await shot(name);
    }
  }
} catch (e) { log("ERROR", String(e).slice(0, 400)); await shot(`error-${phase}`, false).catch(() => undefined); process.exitCode = 1; }
finally { save(); await browser.close(); }
