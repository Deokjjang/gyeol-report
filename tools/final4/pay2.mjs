/**
 * 최종 A-1 로컬 결제 2건(호출 0): ① 새 주문 3,900원 — 실제 주문서 화면(새 동의 한 칸)에서 결제 준비 → 토스 대역 승인.
 * ② 배포 전 주문 1,490원 — 같은 경로로 만든 주문의 저장 금액을 배포 전 가격(1,490)으로 바꿔(배포 전에 결제창을 연 주문 재현) 1,490원으로 승인.
 *   BASE=http://localhost:3800 PLAYWRIGHT=<playwright index.mjs> node tools/final4/pay2.mjs
 * 서버: NODE_OPTIONS=--import <절대경로>/tools/p6d/toss-mock.mjs TOSS_MOCK_DIR=<폴더>/ OPS_MOCK_WRITER=ok ANTHROPIC_API_KEY= OPENAI_API_KEY= PORT=3800 pnpm dev:v5
 * 결과: docs/v5/final4/pay2.json(주문·금액·상태·동의 기록), 주문서 화면 docs/v5/final4/captures/pay2-receipt.png.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../.."), BASE = process.env.BASE ?? "http://localhost:3800";
const OUT = join(ROOT, "docs/v5/final4"); mkdirSync(join(OUT, "captures"), { recursive: true });
const sql = q => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", q], { encoding: "utf8" }).trim();
const storage = join(ROOT, "docs/v5/final/.storage-final.json");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(existsSync(storage) ? { storageState: storage } : {}) });
await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); localStorage.setItem("gyeol-event-popup-hide:event", "9999-12-31"); } catch { /* */ } });
const page = await ctx.newPage();
const result = { at: new Date().toISOString(), base: BASE, orders: [] };
async function login() { await page.goto(`${BASE}/dev/v5-login?as=final&next=${encodeURIComponent("/account")}`, { waitUntil: "load" }); await ctx.storageState({ path: storage }); }
async function prepareViaUi(name, shot) {
  let prepared = null;
  await page.route("**/api/payment-checkout/prepare", async route => { const r = await route.fetch(); prepared = { request: route.request().postDataJSON(), status: r.status(), body: await r.json() }; await route.fulfill({ response: r }); });
  // 결제창(토스 SDK)은 띄우지 않는다: 준비 응답만 받고 결제창 열기 단계는 대역 승인 주소로 대신 간다.
  await page.route("https://js.tosspayments.com/**", route => route.abort());
  await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
  await page.locator("#a-name").fill(name); await page.locator("#a-birthDate").fill("1995-03-14"); await page.locator("#a-gender").selectOption("FEMALE");
  await page.getByLabel("정확").check(); await page.locator("#a-birthTime").fill("08:30");
  await page.getByRole("button", { name: /다음 페이지/ }).click(); await page.waitForTimeout(800);
  await page.getByRole("button", { name: /다음 페이지/ }).click();
  await page.waitForSelector("[data-book-checkout]", { timeout: 60_000 });
  const pay = page.getByLabel(/원 직접 결제/); await pay.waitFor({ timeout: 30_000 }); await pay.check();
  const receipt = await page.locator("[data-book-checkout]").innerText();
  await page.getByLabel("전체 동의").check();
  if (shot) await page.locator("[data-book-checkout]").screenshot({ path: join(OUT, "captures", shot) });
  await page.getByRole("button", { name: /결제하기/ }).click();
  for (let i = 0; i < 60 && !prepared; i++) await page.waitForTimeout(500);
  await page.unroute("**/api/payment-checkout/prepare");
  if (!prepared || prepared.status !== 200) throw new Error(`결제 준비 실패 ${prepared?.status}: ${JSON.stringify(prepared?.body).slice(0, 300)}`);
  return { prepared, receipt };
}
async function confirm(rp, amount) {
  const success = new URL(rp.successUrl);
  success.searchParams.set("paymentKey", `tmock_${crypto.randomUUID().replace(/-/g, "")}`); success.searchParams.set("orderId", rp.orderId);
  success.searchParams.set("amount", String(amount)); success.searchParams.set("paymentType", "NORMAL");
  await page.goto(success.href, { waitUntil: "load" }); await page.waitForTimeout(4000);
  return page.url();
}
const row = id => sql(`select o.amount||'|'||o.status||'|'||coalesce(o.paid_at::text,'')||'|'||coalesce(s.report_id,'')||'|'||coalesce(s.status,'') from public.payment_orders o left join public.paid_report_snapshots s on s.order_id=o.payment_order_id where o.provider_order_id='${id}'`);
try {
  if (!existsSync(storage) || process.env.RELOGIN) await login();
  // ① 새 주문 3,900원
  const a = await prepareViaUi("새주문", "pay2-receipt.png"), rpA = a.prepared.body.tossCheckoutRequest.requestPayment;
  const amountA = typeof rpA.amount === "object" ? rpA.amount.value : rpA.amount;
  const afterA = await confirm(rpA, amountA);
  const consent = sql(`select input_snapshot->'consentEvidence' from public.payment_orders where provider_order_id='${rpA.orderId}'`);
  result.orders.push({ case: "new-3900", receiptHasPrice: a.receipt.includes("3,900원"), receiptLines: a.receipt.split("\n").filter(l => /원|1\+1|환불|AI|주문 내용/.test(l)).slice(0, 12), prepareAmount: amountA, orderCode: a.prepared.body.orderCode, providerOrderId: rpA.orderId, after: afterA, db: row(rpA.orderId), consentEvidence: JSON.parse(consent || "null") });
  // ② 배포 전 주문 1,490원(저장 금액을 배포 전 가격으로 — 배포 직전에 결제창을 연 주문)
  const b = await prepareViaUi("기존주문", null), rpB = b.prepared.body.tossCheckoutRequest.requestPayment;
  sql(`update public.payment_orders set amount=1490 where provider_order_id='${rpB.orderId}' and status='ready'`);
  const afterB = await confirm(rpB, 1490);
  result.orders.push({ case: "legacy-1490", storedAmountBeforeConfirm: 1490, providerOrderId: rpB.orderId, after: afterB, db: row(rpB.orderId) });
  // ③ 저장 금액과 다른 금액(위조)은 거절되는지: 1,490원 주문을 하나 더 만들고 3,900원으로 승인 시도
  const c = await prepareViaUi("위조검사", null), rpC = c.prepared.body.tossCheckoutRequest.requestPayment;
  sql(`update public.payment_orders set amount=1490 where provider_order_id='${rpC.orderId}' and status='ready'`);
  const afterC = await confirm(rpC, 3900);
  result.orders.push({ case: "mismatch-1490-vs-3900", providerOrderId: rpC.orderId, after: afterC, db: row(rpC.orderId) });
} catch (e) { result.error = String(e).slice(0, 600); process.exitCode = 1; }
writeFileSync(join(OUT, "pay2.json"), JSON.stringify(result, null, 1) + "\n");
console.log(JSON.stringify(result, null, 1).slice(0, 4000));
await browser.close();
