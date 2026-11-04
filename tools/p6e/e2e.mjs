/**
 * P6e-ops 로컬 E2E + 390px 캡처(로컬 dev 서버, 로컬 Supabase, 토스 테스트 키, 목업 작가 OPS_MOCK_WRITER=ok, 승인·취소는 tools/p6d/toss-mock.mjs 대역).
 *   BASE=http://localhost:3500 PLAYWRIGHT=<playwright index.mjs> AS=<계정> ADMIN_PIN=<PIN> TOSS_MOCK_DIR=<대역 폴더/> node tools/p6e/e2e.mjs <phase>
 * AS: dev(기본, 관리자) | sender | friend | friend2 | cust | oldmember — tools/p6e/accounts.ts로 만든 로컬 검수 계정.
 * phase:
 *   profile          정보 화면 저장(보상 안내 문구 전·후)       buy        결제(토스 샌드박스 대신 successUrl 이동) → 승인(대역)
 *   work             생성 워커 돌리기                            library    서재(구매 내역·이벤트 이용권·보상 안내)
 *   gift-use|gift-link  이벤트 이용권 내가 쓰기 / 선물 링크 만들기(링크는 state에 저장)
 *   request          문의 요청("계산 오류")                       admin-refund ORDER_OF=<계정>  경고 확인 후 환불
 *   toss-cancel ORDER_OF=<계정>  토스 상점관리자 직접 환불을 대역 상태에 흉내      admin-toss ORDER_OF=<계정>  토스 상태 확인 → 외부 환불 기록
 *   admin-comp ORDER_OF=<계정>   보상 A 지정 + 현황 탭           admin-lists  요청함·목록·일괄 확인
 *   refunded-book ORDER_OF=<계정>  환불된 책 주소              gift-screens  선물 링크 화면 전부
 *   footer           푸터(X·스레드는 임시 주소를 넣었을 때만 보임)
 * 상태(주문코드·링크 등)는 docs/v5/ui-p6e/state.json. 캡처는 docs/v5/ui-p6e/<이름>.png. 비밀값은 기록하지 않는다.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3500";
const AS = process.env.AS ?? "dev";
const OUT = join(ROOT, "docs/v5/ui-p6e", process.env.SHOT_DIR ?? "");
mkdirSync(OUT, { recursive: true });
const STATE = join(ROOT, "docs/v5/ui-p6e/state.json");
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
const mine = () => (state[AS] ??= {});
const target = () => state[process.env.ORDER_OF ?? AS] ?? {};
const phase = process.argv[2];
const browser = await chromium.launch();
const storageOf = name => join(ROOT, `docs/v5/ui-p6e/.storage-${name}.json`);
const useStorage = existsSync(storageOf(AS)) && !["gift-screens", "gift-screens2", "footer", "design"].includes(phase);
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(useStorage ? { storageState: storageOf(AS) } : {}) });
// 캡처를 깨끗하게: 광고 동의 카드는 본 것으로 두고(포트마다 localStorage가 달라 값을 고정), Next 개발 표시기는 숨긴다.
await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* ignore */ } document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); }); });
const page = await ctx.newPage();
const log = (...a) => console.log(`[${phase}/${AS}]`, ...a);
page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) log("console:", m.text().slice(0, 160)); });
const shot = async (name, full = true) => { await page.waitForTimeout(700); await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full }); log("shot", name); };
const part = async (selector, name) => { const el = page.locator(selector).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await el.screenshot({ path: join(OUT, `${name}.png`) }); log("shot", name); };
const loginAs = async (name, next, c = ctx, p = page) => { await p.goto(`${BASE}/dev/v5-login?${name === "dev" ? "" : `as=${name}&`}next=${encodeURIComponent(next)}`, { waitUntil: "load" }); await c.storageState({ path: storageOf(name) }); };
const login = next => loginAs(AS, next);
const envFile = () => Object.fromEntries(readFileSync(join(ROOT, ".env.development.local"), "utf8").split("\n").filter(l => /^[A-Z_]+=/.test(l)).map(l => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const sql = q => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", q], { encoding: "utf8" }).trim();
const worker = async () => { // 로컬 CRON_SECRET(무작위, 로컬 전용 파일)으로 결제 워커를 돌린다.
  const secret = envFile().CRON_SECRET; const out = [];
  for (let i = 0; i < 6; i++) { const r = await fetch(`${BASE}/api/internal/report-jobs`, { headers: { authorization: `Bearer ${secret}` } }); out.push(`${r.status}`); await new Promise(r2 => setTimeout(r2, 1500)); }
  return out.join(",");
};
const pin = () => process.env.ADMIN_PIN ?? "";
if (!useStorage && !["gift-screens", "gift-screens2", "footer", "design"].includes(phase)) await login("/account");

try {
  if (phase === "profile") {
    await login("/account");
    await page.waitForSelector("[data-profile-form]", { timeout: 30_000 });
    await page.getByRole("button", { name: /저장하고 계속하기/ }).waitFor({ timeout: 30_000 });
    await page.waitForTimeout(1200);
    await shot("profile-form-top", false);                       // 보상 안내(정보 입력 전) + 가입 정보 화면
    log("notice before:", (await page.locator("[data-comp-notice]").allTextContents()).join("|").slice(0, 200) || "(none)", "| upgrade line:", await page.locator("[data-upgrade-eligible]").count());
    await page.getByLabel("이름(필수)").fill(`검수 ${AS}`);
    if (await page.getByLabel("이메일(필수)").count()) { await page.getByLabel("이메일(필수)").fill(`${AS}@example.com`); await page.getByLabel("이메일 확인(필수)").fill(`${AS}@example.com`); }
    await page.getByLabel("휴대폰(선택)").fill("010-1234-5678");
    await page.getByRole("button", { name: /저장하고 계속하기/ }).click();
    await page.waitForSelector("[data-profile-form]", { state: "detached", timeout: 20_000 });
    await page.waitForTimeout(1500);
    log("notice after:", (await page.locator("[data-comp-notice]").allTextContents()).join("|").slice(0, 260) || "(none)");
    await shot(`profile-saved-${AS}`, false);
  }
  if (phase === "buy") {
    // 시험 전용: 토스 SDK 요청을 일반 카드 결제창(샌드박스)으로 바꾸고, 결제 준비 응답을 받은 뒤 토스가 성공 뒤 하는 일(successUrl 이동)을 그대로 한다.
    await page.addInitScript(() => {
      let real; Object.defineProperty(window, "TossPayments", { configurable: true, get() { return real; }, set(v) {
        real = (...a) => { const tp = v(...a); const orig = tp.payment.bind(tp); tp.payment = (...b) => { const pm = orig(...b); const rq = pm.requestPayment.bind(pm);
          pm.requestPayment = req => { const r = { ...req, card: { ...(req.card ?? {}), flowMode: "DEFAULT" } }; delete r.card.easyPay; return rq(r); }; return pm; }; return tp; }; } });
    });
    await page.goto(`${BASE}/report/new?product=${process.env.PRODUCT ?? "saju-mbti-full"}`, { waitUntil: "load" });
    await page.locator("#a-name").fill(`검수${AS}`);
    await page.locator("#a-birthDate").fill("1995-03-14");
    await page.locator("#a-gender").selectOption("FEMALE");
    await page.getByLabel("정확").check();
    await page.locator("#a-birthTime").fill("08:30");
    await page.getByRole("button", { name: /다음 페이지/ }).click(); await page.waitForTimeout(800);
    await page.getByRole("button", { name: /다음 페이지/ }).click();
    await page.waitForSelector("[data-book-checkout]", { timeout: 30_000 });
    const pay = page.getByLabel(/원 직접 결제/); await pay.waitFor({ timeout: 30_000 }); await pay.check();
    await page.getByLabel("전체 동의").check();
    if (process.env.SHOT === "1") await shot("checkout");
    await page.setViewportSize({ width: 1280, height: 900 });
    const prepared = page.waitForResponse(r => r.url().includes("/api/payment-checkout/prepare"));
    await page.getByRole("button", { name: /결제하기/ }).click();
    const body = await (await prepared).json();
    const rp = body.tossCheckoutRequest?.requestPayment ?? {};
    const m = mine(); const list = (m.orders ??= []);
    const rec = { orderCode: body.orderCode, providerOrderId: rp.orderId ?? body.checkoutSession?.providerOrderId };
    list.push(rec); m.orderCode = rec.orderCode; m.providerOrderId = rec.providerOrderId; save();
    log("prepared", rec.orderCode, rec.providerOrderId);
    const success = new URL(rp.successUrl); success.searchParams.set("paymentKey", `tmock_${crypto.randomUUID().replace(/-/g, "")}`);
    success.searchParams.set("orderId", rp.orderId); success.searchParams.set("amount", String(typeof rp.amount === "object" ? rp.amount.value : rp.amount)); success.searchParams.set("paymentType", "NORMAL");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(success.href, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    log("url after pay:", page.url().replace(/paymentKey=[^&]+/, "paymentKey=…"));
    if (process.env.SHOT === "1") await shot("payment-complete", false);
    rec.reportId = sql(`select report_id from payment_orders where provider_order_id='${rec.providerOrderId}'`); save();
    log("order status:", sql(`select status from payment_orders where provider_order_id='${rec.providerOrderId}'`), "reportId", rec.reportId);
  }
  if (phase === "work") log("worker:", await worker());
  if (phase === "library") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" });
    await page.waitForSelector("[data-purchase-history]", { timeout: 30_000 });
    await page.waitForTimeout(1500);
    await shot(`library-top-${AS}`, false);
    if (await page.locator("[data-purchase-history] [data-order-code]").count()) await part("[data-purchase-history]", `library-history-${AS}`);
    if (await page.locator("[data-gift-panel]").count()) await part("[data-gift-panel]", `library-gift-${AS}`);
  }
  if (phase === "gift-use") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" }); await page.waitForSelector("[data-gift-panel]", { timeout: 30_000 });
    await page.locator("[data-gift-panel]").getByRole("button", { name: "내가 쓰기" }).first().click();
    await page.waitForTimeout(1500); await part("[data-gift-panel]", `library-gift-used-${AS}`);
  }
  if (phase === "gift-link") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" }); await page.waitForSelector("[data-gift-panel]", { timeout: 30_000 });
    await page.locator("[data-gift-panel]").getByRole("button", { name: /선물 링크 만들기/ }).first().click();
    await page.waitForTimeout(1500);
    const text = (await page.locator("[data-gift-panel] p").allTextContents()).find(t => t.includes("/gift/")) ?? "";
    const token = /\/gift\/([A-Za-z0-9_-]{32})/.exec(text)?.[1];
    if (!token) throw new Error("선물 링크를 찾지 못함");
    (mine().giftLinks ??= []).push(token); save(); log("gift link saved", token.slice(0, 4) + "…");
    await part("[data-gift-panel]", `library-gift-link-${AS}`);
  }
  if (phase === "request") {
    await page.goto(`${BASE}/account`, { waitUntil: "load" }); await page.waitForSelector("[data-purchase-history]", { timeout: 30_000 });
    const code = mine().orderCode; const card = page.locator(`[data-order-code='${code}']`);
    await card.getByRole("button", { name: "문의·환불 요청" }).click();
    await card.getByLabel("사유").selectOption("calc_error");
    await card.getByLabel("메모(선택)").fill("E2E: 계산 결과가 이상해요");
    await card.getByRole("button", { name: "요청 보내기" }).click();
    await page.waitForTimeout(1500); await part(`[data-order-code='${code}']`, `library-request-${AS}`);
    log("open requests:", sql(`select count(*) from order_requests q join order_records r using(payment_order_id) where r.order_code='${code}' and q.status='open'`));
  }
  if (phase === "admin-refund") {
    await loginAs("dev", `/admin/orders/${target().orderCode}`);
    log("requests before:", sql(`select status||':'||coalesce(resolved_by,'-') from order_requests q join order_records r using(payment_order_id) where r.order_code='${target().orderCode}'`));
    await page.getByRole("button", { name: "환불 진행…" }).click();
    await page.waitForTimeout(2500);
    const warned = await page.locator("[data-refund-warning]").count();
    log("refund warning shown:", warned);
    if (warned) { await part("[data-refund-warning]", `admin-refund-warning-${process.env.ORDER_OF ?? AS}`); }
    await page.locator("#refund-reason").fill("E2E 시험 환불(계산 오류 요청 처리)");
    await page.locator("#refund-confirm").fill(target().orderCode);
    await page.locator("#refund-pin").fill(pin());
    if (warned) await page.getByLabel("위 내용을 확인했어요").check();
    await page.screenshot({ path: join(OUT, `admin-refund-form-${process.env.ORDER_OF ?? AS}.png`), fullPage: true }); log("shot admin-refund-form");
    await page.getByRole("button", { name: "환불 확정" }).click();
    await page.waitForTimeout(8000);
    log("status:", (await page.locator("[role=status]").allTextContents()).join(" | ").slice(0, 300));
    await page.goto(`${BASE}/admin/orders/${target().orderCode}`, { waitUntil: "load" });
    await shot(`admin-refunded-${process.env.ORDER_OF ?? AS}`);
    log("requests after:", sql(`select status||':'||coalesce(resolved_by,'-')||':'||coalesce(admin_note,'') from order_requests q join order_records r using(payment_order_id) where r.order_code='${target().orderCode}'`));
  }
  if (phase === "toss-cancel") {
    // 토스 상점관리자에서 직접 환불한 상황을 대역 상태에 만든다(우리 DB는 모른다).
    const f = join(process.env.TOSS_MOCK_DIR, "toss-mock-state.json"); const s = JSON.parse(readFileSync(f, "utf8"));
    const p = Object.values(s.payments).find(x => x.orderId === target().providerOrderId); if (!p) throw new Error("대역에 결제가 없음");
    p.cancels = [{ transactionKey: "shopadmin" + Date.now(), cancelAmount: p.balanceAmount, cancelReason: "상점관리자 직접 환불", cancelStatus: "DONE", canceledAt: new Date().toISOString() }];
    p.balanceAmount = 0; p.status = "CANCELED"; writeFileSync(f, JSON.stringify(s, null, 1)); log("mock payment set CANCELED for", target().orderCode);
  }
  if (phase === "admin-toss") {
    await loginAs("dev", `/admin/orders/${target().orderCode}`);
    await page.locator("[data-toss-check]").getByRole("button", { name: "토스 상태 확인" }).click();
    await page.waitForTimeout(2500);
    await part("[data-toss-check]", `admin-toss-mismatch-${process.env.ORDER_OF ?? AS}`);
    await page.getByRole("button", { name: "외부 환불로 기록…" }).click();
    await page.locator("#ext-confirm").fill(target().orderCode);
    await page.locator("#ext-pin").fill(pin());
    await part("[data-toss-check]", `admin-toss-external-form-${process.env.ORDER_OF ?? AS}`);
    await page.getByRole("button", { name: "외부 환불로 기록 확정" }).click();
    await page.waitForTimeout(3000);
    log("status:", (await page.locator("[role=status]").allTextContents()).join(" | ").slice(0, 300));
    await page.goto(`${BASE}/admin/orders/${target().orderCode}`, { waitUntil: "load" });
    await shot(`admin-external-refunded-${process.env.ORDER_OF ?? AS}`);
    log("db:", sql(`select po.status||' '||f.source||' '||f.state||' '||coalesce(f.provider_status,'') from payment_orders po join order_refunds f using(payment_order_id) join order_records r using(payment_order_id) where r.order_code='${target().orderCode}'`));
  }
  if (phase === "admin-comp") {
    await loginAs("dev", "/admin/orders?tab=members");
    await page.waitForSelector("[data-comp-designate]", { timeout: 30_000 });
    await shot("admin-members-before", false);
    await page.locator("#comp-q").fill(target().orderCode);
    await page.locator("#comp-pin").fill(pin());
    await page.getByRole("button", { name: "보상 A 지정" }).click();
    await page.waitForTimeout(3000);
    log("status:", (await page.locator("[role=status]").allTextContents()).join(" | ").slice(0, 300));
    await page.goto(`${BASE}/admin/orders?tab=members`, { waitUntil: "load" });
    await part("[data-comp-summary]", "admin-members-comp");
  }
  if (phase === "admin-lists") {
    await loginAs("dev", "/admin/orders?tab=requests&status=done");
    await shot("admin-requests-done");
    await page.goto(`${BASE}/admin/orders`, { waitUntil: "load" });
    await page.locator("[data-toss-batch]").getByRole("button", { name: "토스 상태 확인" }).click();
    await page.waitForTimeout(6000);
    log("batch:", (await page.locator("[data-toss-batch]").innerText()).replace(/\n+/g, " / ").slice(0, 520));
    await part("[data-toss-batch]", "admin-toss-batch");
    await page.goto(`${BASE}/admin/orders?tab=members`, { waitUntil: "load" });
    await shot("admin-members-final");
  }
  if (phase === "refunded-book") {
    await login(`/reports/${(target().orders ?? []).find(o => o.orderCode === target().orderCode)?.reportId}`);
    await page.waitForTimeout(2500);
    log("title:", (await page.locator("h1").first().textContent())?.slice(0, 60), "| links:", (await page.locator("nav[aria-label='안내'] a").allTextContents()).join(", "));
    await shot("refunded-book", false);
  }
  if (phase === "gift-screens") {
    const links = state.sender?.giftLinks ?? []; const own = links[0], revoked = links[1], expired = state.expiredLink;
    const open = async (c, p, token, name) => { await p.goto(`${BASE}/gift/${token}`, { waitUntil: "load" }); await p.waitForSelector("[data-gift-page]"); await p.waitForTimeout(1500); await p.screenshot({ path: join(OUT, `${name}.png`), fullPage: true }); log("shot", name, "|", (await p.locator("[data-gift-page] section").innerText()).replace(/\n+/g, " / ").slice(0, 160)); };
    const fresh = async name => { const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" }); await c.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* ignore */ } document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); }); }); const p = await c.newPage(); if (name) await loginAs(name, "/", c, p); return [c, p]; };
    let [c, p] = await fresh(null);  await open(c, p, own, "gift-1-guest"); await c.close();                 // 비로그인 진입
    [c, p] = await fresh("friend");  await open(c, p, own, "gift-2-profile-required");                      // 로그인했지만 정보 화면 전
    await p.getByRole("link", { name: /가입 정보 입력하기/ }).click(); await p.waitForSelector("[data-profile-form]", { timeout: 30_000 });
    await p.getByLabel("이름(필수)").fill("검수 friend");
    if (await p.getByLabel("이메일(필수)").count()) { await p.getByLabel("이메일(필수)").fill("friend@example.com"); await p.getByLabel("이메일 확인(필수)").fill("friend@example.com"); }
    await p.screenshot({ path: join(OUT, "gift-3-profile-form.png"), fullPage: true }); log("shot gift-3-profile-form");
    await p.getByRole("button", { name: /저장하고 계속하기/ }).click(); await p.waitForSelector("[data-profile-form]", { state: "detached", timeout: 20_000 });
    await open(c, p, own, "gift-4-ready");                                                                  // 받기 전
    await p.getByRole("button", { name: "이용권 받기" }).click(); await p.waitForTimeout(2000);
    await p.screenshot({ path: join(OUT, "gift-5-claimed.png"), fullPage: true }); log("shot gift-5-claimed");
    await c.close();
    [c, p] = await fresh("sender");  await open(c, p, own, "gift-6-own-link"); await c.close();             // 자기 링크
    [c, p] = await fresh("friend2"); await open(c, p, own, "gift-7-already-claimed");                       // 이미 받은 링크
    await open(c, p, expired, "gift-8-expired");                                                            // 만료된 링크
    await open(c, p, revoked, "gift-9-revoked"); await c.close();                                           // 환불로 회수된 링크
  }
  if (phase === "gift-screens2") {
    // gift-screens 뒤에 이어서: 아직 안 받은 링크(보상 선물)로 "자기 링크", 이미 받은 링크의 세 시점, 보상 선물 받기.
    const claimed = state.sender?.giftLinks?.[0], comp = state.cust?.giftLinks?.[0];
    const fresh = async name => { const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "ko-KR", timezoneId: "Asia/Seoul" }); await c.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* ignore */ } document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "nextjs-portal{display:none!important}"; document.head.appendChild(st); }); }); const p = await c.newPage(); await loginAs(name, "/", c, p); return [c, p]; };
    const open = async (p, token, name) => { await p.goto(`${BASE}/gift/${token}`, { waitUntil: "load" }); await p.waitForSelector("[data-gift-page]"); await p.waitForTimeout(1500); await p.screenshot({ path: join(OUT, `${name}.png`), fullPage: true }); log("shot", name, "|", (await p.locator("[data-gift-page] section").innerText()).replace(/\n+/g, " / ").slice(0, 200)); };
    let [c, p] = await fresh("cust"); await open(p, comp, "gift-6-own-link"); await c.close();               // 자기 링크(안 받은 상태)
    [c, p] = await fresh("sender"); await open(p, claimed, "gift-6b-sender-after-claim"); await c.close();    // 보낸 사람이 받은 뒤에 열면
    [c, p] = await fresh("friend2"); await open(p, claimed, "gift-7-already-claimed");                        // 제3자가 이미 받은 링크를 열면(이전엔 "받았어요"로 잘못 나왔다)
    await p.goto(`${BASE}/account`, { waitUntil: "load" }); await p.waitForSelector("[data-profile-form]", { timeout: 30_000 });
    await p.getByLabel("이름(필수)").fill("검수 friend2");
    if (await p.getByLabel("이메일(필수)").count()) { await p.getByLabel("이메일(필수)").fill("friend2@example.com"); await p.getByLabel("이메일 확인(필수)").fill("friend2@example.com"); }
    await p.getByRole("button", { name: /저장하고 계속하기/ }).click(); await p.waitForSelector("[data-profile-form]", { state: "detached", timeout: 20_000 });
    await open(p, comp, "gift-10-comp-ready");
    await p.getByRole("button", { name: "이용권 받기" }).click(); await p.waitForTimeout(2000);
    await p.screenshot({ path: join(OUT, "gift-11-comp-claimed.png"), fullPage: true }); log("shot gift-11-comp-claimed");
    await c.close();
    [c, p] = await fresh("friend"); await open(p, claimed, "gift-7b-recipient-again"); await c.close();     // 받은 사람이 다시 열면
  }
  if (phase === "design" || phase === "design-auth") {
    // 요청 밖 화면(디자인 동결): 푸터(이번에 바꾼 요청 화면)만 가리고 같은 목록을 기준 트리와 이 브랜치에서 찍어 cmp로 비교한다.
    await ctx.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "footer,[data-book-footer]{display:none!important}"; document.head.appendChild(st); }); });
    const list = phase === "design" ? [["d-home", "/"], ["d-input-full", "/report/new?product=saju-mbti-full"], ["d-input-career", "/report/new?product=career-money-study"], ["d-privacy", "/privacy"], ["d-terms", "/terms"], ["d-login", "/login"]]
      : [["d-book", process.env.BOOK_PATH]];
    if (phase === "design-auth") await login("/account");
    for (const [name, path] of list) {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" }); await page.waitForTimeout(1800);
      if (phase === "design-auth") { await page.waitForSelector("[data-book-report]", { timeout: 30_000 }); await shot(name, false); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(900); await shot(`${name}-p2`, false); }
      else await shot(name);
    }
  }
  if (phase === "interim-book") {
    // 실호출 임시본(OpenAI) Book: 임시본 안내 한 줄 + 책 표지, 그리고 관리자 상세의 시도 기록(공급자·모델·비용·장 출처).
    await login(`/reports/${process.env.REPORT}`); await page.waitForSelector("[data-book-report]", { timeout: 30_000 });
    log("edition notice:", (await page.locator("[data-edition='interim']").allTextContents()).join("|"));
    await shot("interim-book", false);
    await loginAs("dev", `/admin/orders/${process.env.ORDER_CODE}`); await page.waitForTimeout(1500);
    await shot("admin-detail-interim");
  }
  if (phase === "footer") {
    await page.goto(`${BASE}/`, { waitUntil: "load" }); await page.waitForTimeout(1500);
    const f = page.locator("footer").first(); await f.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    await f.screenshot({ path: join(OUT, `footer${process.env.SHOT_SUFFIX ?? ""}.png`) }); log("shot footer",
      "| 채널 보기:", await page.getByText("채널 보기").count(), "| X:", await page.locator("[data-social=x], footer a[aria-label*='X']").count(), "| threads:", await page.locator("footer a[aria-label*='스레드']").count(),
      "| 광고 설정:", await page.getByRole("button", { name: "광고 설정" }).count());
    await loginAs("dev", "/admin/orders"); await page.waitForTimeout(1500);
    log("admin page footer count:", await page.locator("footer").count());
  }
} catch (e) { log("ERROR", String(e).slice(0, 500)); await shot(`error-${phase}-${AS}`, false).catch(() => undefined); process.exitCode = 1; }
finally { save(); await browser.close(); }
