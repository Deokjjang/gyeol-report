/**
 * 최종판 4: 실제 결제 경로로 책 만들기(정보 입력 → 결제 준비 → 토스 대역 승인 → 결제 워커(감독) → 발행 → 서재).
 *   BASE=http://localhost:3800 PLAYWRIGHT=<playwright index.mjs> AS=final node tools/final/paid.mjs template|pay <사례>|work|ops|status
 * - template: 실제 화면(/report/new)에서 종합 입력을 채우고 결제하기를 눌러 결제 준비 요청 본문을 잡는다(요청은 보내지 않음 — 주문을 만들지 않는다).
 * - pay <사례>: 그 본문에 사례 입력(tools/final/cases.ts의 payload, 같은 꼴)을 넣어 같은 로그인으로 결제 준비 → 토스 성공 주소로 이동(승인은 dev 서버의 토스 대역).
 * - work: 로컬 CRON_SECRET으로 결제 워커(/api/internal/report-jobs)를 돌린다(감독 → 발행). status: 사례별 주문·Book 상태.
 * 상태: docs/v5/final/paid-state.json(주문 코드·reportId). LLM 호출은 dev 서버 안에서 예산 관문(LLM_BUDGET_*)을 지난다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const { chromium } = await import(process.env.PLAYWRIGHT ?? "playwright");
const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.env.BASE ?? "http://localhost:3800";
const AS = process.env.AS ?? "final";
const OUT = join(ROOT, "docs/v5/final");
mkdirSync(OUT, { recursive: true });
const STATE = join(OUT, "paid-state.json");
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
// 사례마다 결제 준비 본문의 inputSnapshot을 화면과 같은 함수(bookCheckoutSnapshot)로 만든다(템플릿의 임시 인물 값을 쓰지 않는다).
const CASES = JSON.parse(execFileSync("pnpm", ["exec", "tsx", "-e", "import { FINAL_CASES } from './tools/final/cases'; import { bookCheckoutSnapshot } from './src/lib/book/form'; console.log(JSON.stringify(FINAL_CASES.filter(c => c.generate).map(c => ({ ...c, snapshot: bookCheckoutSnapshot(c.payload as never) }))))"], { cwd: ROOT, encoding: "utf8" }).trim().split("\n").at(-1));
const envFile = () => Object.fromEntries(readFileSync(join(ROOT, ".env.development.local"), "utf8").split("\n").filter(l => /^[A-Z_]+=/.test(l)).map(l => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const sql = q => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", q], { encoding: "utf8" }).trim();
const phase = process.argv[2], arg = process.argv[3];
const log = (...a) => console.log(`[${phase}]`, ...a);

if (phase === "work" || phase === "ops") {
  // 책 한 권이 수 분 걸린다: Node fetch(머리글 300초 제한) 대신 curl(최대 900초). 비밀값은 표준 입력 설정 파일로 넘긴다(명령줄·로그에 남기지 않음).
  // work = 결제 워커(/api/internal/report-jobs), ops = 운영 크론(/api/internal/ops-jobs: 교체 레인·환불·정리).
  const secret = envFile().CRON_SECRET; const out = [];
  const path = phase === "work" ? "/api/internal/report-jobs" : "/api/internal/ops-jobs";
  for (let i = 0; i < Number(process.env.ROUNDS ?? (phase === "work" ? 3 : 1)); i++) {
    const t0 = Date.now();
    let body = "";
    try { body = execFileSync("curl", ["-s", "-w", "\n%{http_code}", "--max-time", "900", "-K", "-", `${BASE}${path}`], { input: `header = "authorization: Bearer ${secret}"\n`, encoding: "utf8", maxBuffer: 1 << 20 }); }
    catch (e) { body = `curl 실패: ${String(e).slice(0, 160)}`; }
    out.push(`${i + 1}회 ${Math.round((Date.now() - t0) / 1000)}초 · ${body.trim().split("\n").reverse().join(" · ").slice(0, 300)}`);
  }
  log(out.join("\n")); process.exit(0);
}
if (phase === "status") {
  for (const [id, s] of Object.entries(state.orders ?? {})) {
    const row = s.reportId ? sql(`select coalesce(s.status,'-')||' '||coalesce(g.phase,'-')||' '||coalesce(g.last_reason,'') from public.paid_report_snapshots s left join public.book_generation_state g on g.report_id=s.report_id where s.report_id='${s.reportId}'`) : "(reportId 없음)";
    log(id, s.orderCode, s.reportId, row);
  }
  process.exit(0);
}

const browser = await chromium.launch();
const storage = join(OUT, `.storage-${AS}.json`);
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "ko-KR", timezoneId: "Asia/Seoul", ...(existsSync(storage) ? { storageState: storage } : {}) });
await ctx.addInitScript(() => { try { localStorage.setItem("gyeol-meta-card-seen:meta-20261020-v2", "1"); } catch { /* */ } });
const page = await ctx.newPage();
const login = async next => { await page.goto(`${BASE}/dev/v5-login?as=${AS}&next=${encodeURIComponent(next)}`, { waitUntil: "load" }); await ctx.storageState({ path: storage }); };
try {
  if (!existsSync(storage)) await login("/account");
  // 결제 전 가입 정보(이름·이메일)가 필요하다(BookCheckout profileRequired). 실제 계정 화면에서 한 번 채운다.
  await page.goto(`${BASE}/account`, { waitUntil: "load" }); await page.waitForTimeout(1500);
  const saveProfile = page.getByRole("button", { name: /저장하고 계속하기/ });
  if (await saveProfile.count()) {
    await page.getByLabel(/이름\(필수\)/).fill("최종 검수"); await saveProfile.click(); await page.waitForTimeout(2500);
    log("가입 정보 저장:", (await saveProfile.count()) ? "다시 확인 필요" : "완료");
  }
  if (phase === "template") {
    await page.route("**/api/payment-checkout/prepare", async route => { state.template = route.request().postDataJSON(); save(); log("잡음: 결제 준비 본문 키", Object.keys(state.template).join(","), "· inputSnapshot 키", Object.keys(state.template.inputSnapshot ?? {}).join(",")); await route.abort(); });
    await page.goto(`${BASE}/report/new?product=saju-mbti-full`, { waitUntil: "load" });
    await page.locator("#a-name").fill("검수"); await page.locator("#a-birthDate").fill("1995-03-14"); await page.locator("#a-gender").selectOption("FEMALE");
    await page.getByLabel("정확").check(); await page.locator("#a-birthTime").fill("08:30");
    await page.getByRole("button", { name: /다음 페이지/ }).click(); await page.waitForTimeout(800);
    await page.getByRole("button", { name: /다음 페이지/ }).click();
    await page.waitForSelector("[data-book-checkout]", { timeout: 60_000 });
    const pay = page.getByLabel(/원 직접 결제/); await pay.waitFor({ timeout: 30_000 }); await pay.check();
    await page.getByLabel("전체 동의").check();
    await page.getByRole("button", { name: /결제하기/ }).click();
    for (let i = 0; i < 40 && !state.template; i++) await page.waitForTimeout(500);
    if (!state.template) throw new Error("결제 준비 요청을 잡지 못했다");
  }
  if (phase === "pay") {
    const c = CASES.find(x => x.id === arg); if (!c) throw new Error(`사례 없음: ${arg}`);
    const t = state.template; if (!t) throw new Error("template 먼저");
    const p = c.payload, inputSnapshot = c.snapshot;
    const tk = Object.keys(t.inputSnapshot).sort().join(","), ck = Object.keys(inputSnapshot).sort().join(",");
    if (tk !== ck) throw new Error(`inputSnapshot 키가 화면과 다르다: 화면 ${tk} · 사례 ${ck}`);
    const body = { ...t, productType: p.productKey, inputSnapshot };
    const r = await page.request.post(`${BASE}/api/payment-checkout/prepare`, { data: body });
    const prepared = await r.json();
    if (!r.ok()) throw new Error(`결제 준비 실패 ${r.status()}: ${JSON.stringify(prepared).slice(0, 300)}`);
    const rp = prepared.tossCheckoutRequest?.requestPayment ?? {};
    const success = new URL(rp.successUrl); success.searchParams.set("paymentKey", `tmock_${crypto.randomUUID().replace(/-/g, "")}`);
    success.searchParams.set("orderId", rp.orderId); success.searchParams.set("amount", String(typeof rp.amount === "object" ? rp.amount.value : rp.amount)); success.searchParams.set("paymentType", "NORMAL");
    await page.goto(success.href, { waitUntil: "load" }); await page.waitForTimeout(4000);
    const reportId = sql(`select report_id from public.payment_orders where provider_order_id='${rp.orderId}'`);
    (state.orders ??= {})[c.id] = { orderCode: prepared.orderCode, providerOrderId: rp.orderId, reportId, amount: rp.amount, afterPayUrl: page.url(), at: new Date().toISOString() }; save();
    log(c.id, "주문", prepared.orderCode, "reportId", reportId, "결제 상태", sql(`select status from public.payment_orders where provider_order_id='${rp.orderId}'`), "→", page.url());
  }
} catch (e) { log("ERROR", String(e).slice(0, 500)); process.exitCode = 1; }
await browser.close();
