/**
 * P6d-ops 로컬 E2E + 390px 캡처(로컬 dev 서버, 로컬 Supabase, 토스 테스트 키, 목업 작가 OPS_MOCK_WRITER=ok).
 *   BASE=http://localhost:3300 PLAYWRIGHT=<playwright index.mjs> node tools/p6d/e2e.mjs <phase>
 * phase: profile | home | buy | complete | worker | library | request | admin | refund | design
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
const login = async next => { await page.goto(`${BASE}/dev/v5-login?next=${encodeURIComponent(next)}`, { waitUntil: "networkidle" }); await ctx.storageState({ path: storage }); };

try {
  if (phase === "profile") {
    await login("/account");
    await page.waitForSelector("[data-profile-form]", { timeout: 30_000 });
    await shot("profile-form");
    await page.getByLabel("이름(필수)").fill("검수 회원");
    await page.getByLabel("이메일(필수)").fill("qa@example.com");
    await page.getByLabel("이메일 확인(필수)").fill("qa@example.com");
    await page.getByLabel("휴대폰(선택)").fill("010-1234-5678");
    await page.getByRole("button", { name: /저장하고 계속하기/ }).click();
    await page.waitForSelector("[data-profile-form]", { state: "detached", timeout: 20_000 });
    await shot("profile-saved");
  }
  if (phase === "home") {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await shot("home", false);
    await page.locator("section[aria-label='여섯 권의 책 고르기']").focus();
    for (let i = 0; i < 2; i++) { await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(800); }
    await shot("home-annual-center", false);
    await page.goto(`${BASE}/report/new?product=major-fortune`, { waitUntil: "networkidle" });
    await shot("notice-major");
  }
  if (phase === "buy") {
    await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "networkidle" });
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
    await page.getByRole("button", { name: /결제하기/ }).click();
    await page.waitForTimeout(6000);
    log("url after pay:", page.url());
    await shot("toss-1", false);
    for (const f of page.frames()) log("frame:", f.url().slice(0, 120));
  }
  if (phase === "library") {
    await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-purchase-history]", { timeout: 30_000 });
    await shot("library-history");
  }
  if (phase === "request") {
    await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-purchase-history]");
    const card = page.locator(`[data-order-code='${state.orderCode}']`);
    await card.getByRole("button", { name: "문의·환불 요청" }).click();
    await card.getByLabel("사유").selectOption("calc_error");
    await card.getByLabel("메모(선택)").fill("E2E: 생년월일 계산 확인 요청");
    await card.getByRole("button", { name: "요청 보내기" }).click();
    await page.waitForTimeout(1500);
    await shot("library-request");
  }
  if (phase === "admin") {
    await page.goto(`${BASE}/admin/orders`, { waitUntil: "networkidle" });
    await shot("admin-list");
    await page.goto(`${BASE}/admin/orders?tab=requests`, { waitUntil: "networkidle" });
    await shot("admin-requests");
    await page.goto(`${BASE}/admin/orders?tab=members`, { waitUntil: "networkidle" });
    await shot("admin-members");
    await page.goto(`${BASE}/admin/orders?q=gyeol2026`, { waitUntil: "networkidle" });
    await shot("admin-search-legacy");
    await page.goto(`${BASE}/admin/orders/${state.orderCode}`, { waitUntil: "networkidle" });
    await shot("admin-detail");
  }
  if (phase === "refund") {
    await page.goto(`${BASE}/admin/orders/${state.orderCode}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "환불 진행…" }).click();
    await page.locator("#refund-reason").fill("E2E 시험 환불(계산 오류 요청 처리)");
    await page.locator("#refund-confirm").fill(state.orderCode);
    await page.locator("#refund-pin").fill(process.env.ADMIN_PIN ?? "");
    await page.getByRole("button", { name: "환불 확정" }).click();
    await page.waitForTimeout(8000);
    await shot("admin-refunded");
    log("status text:", (await page.locator("[role=status]").allTextContents()).join(" | ").slice(0, 300));
  }
  if (phase === "design") {
    // 요청 밖 화면(디자인 동결): 같은 목록을 기준 트리와 이 브랜치에서 찍어 cmp로 비교한다.
    for (const [name, path] of [["d-input-full", "/report/new?product=saju-mbti-full"], ["d-input-career", "/report/new?product=career-money-study"], ["d-privacy", "/privacy"], ["d-terms", "/terms"], ["d-login", "/login"]]) {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      await shot(name);
    }
  }
} catch (e) { log("ERROR", String(e).slice(0, 400)); await shot(`error-${phase}`, false).catch(() => undefined); process.exitCode = 1; }
finally { save(); await browser.close(); }
