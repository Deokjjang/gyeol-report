// W3 P0 안전장치(외부 호출 0): 판매 중지가 막는 5곳(결제 준비·주문 생성·승인 직전·이용권·화면 상태), 읽기 실패 = 판매 계속,
// 자동 멈춤 판정(순수), Anthropic 잔액/인증 감지, 경보 받는 곳, 관리자 화면 거절 감사, Vercel 빌드 건너뛰기 스크립트.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const pause = vi.hoisted(() => ({ on: false, reads: 0 }));
vi.mock("../../../src/lib/ops/salesPause", async () => {
  const actual = await vi.importActual<typeof import("../../../src/lib/ops/salesPause")>("../../../src/lib/ops/salesPause");
  return { ...actual, salesPaused: async () => { pause.reads++; return pause.on; }, readSalesPause: async () => ({ on: pause.on, at: null, by: null, reason: null }) };
});
const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })), bind: vi.fn(async () => true) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
vi.mock("../../../src/lib/account/supabase", async () => (await import("../../helpers/opsStoreStub")).memberAccountModule);
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => ({ bind: storage.bind }) }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);
vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams("product=saju-mbti-full"), useRouter: () => ({ push: () => {}, replace: () => {} }) }));
vi.mock("../../../src/components/book/useSalesPaused", () => ({ useSalesPaused: () => pause.on }));
const confirmPort = vi.hoisted(() => ({ find: vi.fn(), call: vi.fn() }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: (a: string, d?: unknown) => a === "find_order" ? confirmPort.find(a, d) : confirmPort.call(a, d) }) }));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({ TOSS_CONFIRM_REQUIRED_AMOUNT: 3900, confirmTossPayment: vi.fn(async () => ({ ok: true })) }));
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { TEST_BUYER } from "../../helpers/opsStoreStub";
import { POST as prepareCheckout } from "../../../src/app/api/payment-checkout/prepare/route";
import { POST as createReady } from "../../../src/app/api/payment-orders/create-ready/route";
import { GET as salesStatus } from "../../../src/app/api/sales/route";
import { closedProductOrder, confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { enqueueTicketPublication } from "../../../src/lib/tickets/publication";
import { SALES_PAUSED_CODE, SALES_PAUSED_MESSAGE } from "../../../src/lib/ops/config";
import { AUTO_PAUSE, autoPauseCheck, connectionRun, creditAlerter, rateAlert, type RunLite } from "../../../src/lib/ops/generation/alerts";
import { watchFetch, type QuotaSeen } from "../../../src/lib/ops/generation/sinks";
import { handleAdminAction, type AdminActionDeps } from "../../../src/lib/ops/admin/actions";
import type { AuditEntry } from "../../../src/lib/ops/store";
import { NextRequest } from "next/server";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BookInput } from "../../../src/components/book/BookInput";
import { BookShelf } from "../../../src/components/book/BookShelf";
import { POST as tossConfirm } from "../../../src/app/api/payments/toss/confirm/route";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";

beforeEach(() => { pause.on = false; pause.reads = 0; storage.create.mockClear(); storage.bind.mockReset().mockResolvedValue(true); });
afterEach(() => { vi.unstubAllEnvs(); });

const person = { name: "지민", birthDate: "2001-06-22", birthTime: "13:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: {} };
const prepareReq = () => new Request("https://gyeolreport.com/api/payment-checkout/prepare", {
  method: "POST", headers: { origin: "https://gyeolreport.com", "content-type": "application/json" },
  body: JSON.stringify({ consent: adultCheckoutConsent(), buyer: TEST_BUYER, provider: "toss", productType: "saju_mbti_full", inputSnapshot: { displayName: person.name, birthDate: person.birthDate, reportInputPayload: payload } }),
});

describe("판매 중지가 막는 곳", () => {
  it("① 결제 준비: 멈춤이면 주문 쓰기 전에 409 PRODUCT_SALES_PAUSED + 고객 문구", async () => {
    vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key"); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key");
    pause.on = true;
    const r = await prepareCheckout(prepareReq());
    expect(r.status).toBe(409);
    expect(await r.json()).toMatchObject({ ok: false, error: { code: SALES_PAUSED_CODE, message: SALES_PAUSED_MESSAGE } });
    expect(storage.create).not.toHaveBeenCalled();
    expect(SALES_PAUSED_MESSAGE).toBe("지금은 책 만들기를 잠시 멈췄어요. 곧 다시 열게요. 이미 결제한 책은 그대로 만들어져요.");
  });
  it("② 주문 생성(create-ready): 멈춤이면 409", async () => {
    vi.stubEnv("PAYMENT_READY_ORDER_API_ENABLED", "1");
    pause.on = true;
    const r = await createReady(new Request("https://gyeolreport.com/api/payment-orders/create-ready", { method: "POST", body: JSON.stringify({ provider: "toss", productType: "saju_mbti_full", inputSnapshot: {} }) }));
    expect(r.status).toBe(409);
    expect(await r.json()).toMatchObject({ ok: false, error: { code: SALES_PAUSED_CODE } });
  });
  describe("③ 승인 직전 ready 주문", () => {
    const storeWith = (status: string, product = "saju_mbti_full") => ({ call: vi.fn(async (a: string) => a === "find_order" ? { ok: true, order: { provider_order_id: "o-1", status, product_type: product } } : a === "confirm_claim" ? { ok: true, token: "t" } : { ok: true, reportId: "r-1" }) }) as unknown as ReliabilityStore & { call: ReturnType<typeof vi.fn> };
    const confirm = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: "o-1", amount: 3900, status: "DONE" } }));
    it("멈춤 중 ready 주문 → 토스 승인·주문 선점 없이 PRODUCT_SALES_PAUSED(결제되지 않음)", async () => {
      const store = storeWith("ready");
      expect(await closedProductOrder(store, "o-1", async () => true)).toBe(SALES_PAUSED_CODE);
      confirm.mockClear(); store.call.mockClear();
      expect(await confirmPaidReport({ orderId: "o-1", paymentKey: "k", amount: 3900 }, store, confirm, id => closedProductOrder(store, id, async () => true))).toEqual({ ok: false, code: SALES_PAUSED_CODE });
      expect(confirm).not.toHaveBeenCalled();
      expect(store.call.mock.calls.map(([a]) => a)).toEqual(["find_order"]);
    });
    it("이미 결제한 주문(status≠ready)은 멈춤이어도 그대로, 스위치를 못 읽으면(예외) 막지 않는다", async () => {
      expect(await closedProductOrder(storeWith("paid"), "o-1", async () => true)).toBeNull();
      expect(await closedProductOrder(storeWith("ready"), "o-1", async () => { throw new Error("db down"); })).toBeNull();
      expect(await closedProductOrder(storeWith("ready"), "o-1", async () => false)).toBeNull();
    });
  });
  it("④ 이용권 사용: 멈춤이면 접수하지 않는다(저장소 호출 0), 아니면 그대로 접수", async () => {
    const store = { call: vi.fn(async () => ({ ok: true, state: "QUEUED" })) };
    const consent = {} as Parameters<typeof enqueueTicketPublication>[4];
    const id = "11111111-2222-4333-8444-555555555555", now = new Date("2026-11-14T10:00:00+09:00");
    expect(await enqueueTicketPublication(store, "u", id, payload, consent, now, async () => true)).toEqual({ ok: false, code: SALES_PAUSED_CODE });
    expect(store.call).not.toHaveBeenCalled();
    expect(await enqueueTicketPublication(store, "u", id, payload, consent, now, async () => false)).toMatchObject({ ok: true });
  });
  it("③' 승인 경로(/api/payments/toss/confirm): 멈춤 중 ready 주문은 토스 승인 없이 409 + 「결제되지 않았어요」", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1"); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "mock-secret");
    confirmPort.find.mockResolvedValue({ ok: true, order: { provider_order_id: "po-1", status: "ready", product_type: "saju_mbti_full" } }); confirmPort.call.mockReset();
    pause.on = true;
    const r = await tossConfirm(new Request("http://localhost/api/payments/toss/confirm", { method: "POST", body: JSON.stringify({ paymentKey: "k", orderId: "po-1", amount: 3900 }) }));
    expect(r.status).toBe(409);
    expect(await r.json()).toEqual({ ok: false, error: { code: SALES_PAUSED_CODE, message: `${SALES_PAUSED_MESSAGE} 이 주문은 결제되지 않았어요.` } });
    expect(confirmPort.call).not.toHaveBeenCalled();
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("⑤ 화면: 멈춤이면 입력 화면 대신 잠시 멈춤 안내, 책장 맨 위 한 줄 + 4종 표지 「잠시 쉬는 중」(대운·세운은 원래 안내)", () => {
    pause.on = true;
    const input = renderToStaticMarkup(createElement(BookInput, { internal: false, now: "2026-11-14T01:00:00.000Z" }));
    expect(input).toContain("data-sales-paused");
    expect(input).toContain("지금은 책 만들기를 잠시 멈췄어요");
    expect(input).toContain(SALES_PAUSED_MESSAGE);
    const shelf = renderToStaticMarkup(createElement(BookShelf, { inputPath: "/report/new", year: 2026, closed: ["major_fortune", "annual_fortune"] }));
    expect(shelf).toContain("data-sales-paused");
    expect(shelf.match(/잠시 쉬는 중/g)?.length).toBeGreaterThanOrEqual(4);
    expect(shelf).toContain("12월 1일 · 2027 신년판 공개");
    pause.on = false;
    expect(renderToStaticMarkup(createElement(BookInput, { internal: false, now: "2026-11-14T01:00:00.000Z" }))).not.toContain("data-sales-paused");
    expect(renderToStaticMarkup(createElement(BookShelf, { inputPath: "/report/new", year: 2026, closed: [] }))).not.toContain("잠시 쉬는 중");
  });
  it("⑤ 화면 상태 /api/sales: 멈춤이면 paused + 문구, 아니면 paused=false", async () => {
    pause.on = true;
    expect(await (await salesStatus()).json()).toEqual({ paused: true, message: SALES_PAUSED_MESSAGE });
    pause.on = false;
    expect(await (await salesStatus()).json()).toEqual({ paused: false });
  });
  it("읽기 실패·시간 초과면 판매 계속(null), 캐시는 maxAgeMs 안에서만", async () => {
    const { readSalesPause: readActual, resetSalesPauseCache } = await vi.importActual<typeof import("../../../src/lib/ops/salesPause")>("../../../src/lib/ops/salesPause");
    resetSalesPauseCache();
    expect(await readActual({ store: { call: async () => { throw new Error("x"); } } })).toBeNull();
    vi.useFakeTimers();
    try {
      const slow = readActual({ store: { call: () => new Promise(() => {}) } });
      await vi.advanceTimersByTimeAsync(3_000);
      expect(await slow).toBeNull();
    } finally { vi.useRealTimers(); }
    let n = 0;
    const store = { call: async () => { n++; return { ok: true, on: true, at: "2026-11-14T00:00:00Z", by: "auto", reason: "connection" }; } };
    expect(await readActual({ store, now: 1_000 })).toMatchObject({ on: true, by: "auto" });
    expect(await readActual({ store, now: 5_000, maxAgeMs: 10_000 })).toMatchObject({ on: true });
    expect(n).toBe(1);
    await readActual({ store, now: 20_000, maxAgeMs: 10_000 });
    expect(n).toBe(2);
  });
});

describe("자동 멈춤 판정(순수)", () => {
  const T = Date.parse("2026-11-14T05:00:00Z");
  const r = (id: string, minAgo: number, cls = "connection", outcome = "deferred", product = "saju_mbti_full"): RunLite => ({ report_id: id, outcome, created_at: new Date(T - minAgo * 60_000).toISOString(), calls: [{ kind: "first", cls }], product });
  it("선: 10분 안 연결 실패 주문 3건(책 단위 — 한 주문 여러 번은 1건). 생각 소진·발행·창 밖은 세지 않는다", () => {
    expect(AUTO_PAUSE).toEqual({ connectionOrders: 3, windowMs: 600_000 });
    expect(autoPauseCheck([r("a", 1), r("a", 2), r("b", 3), r("t", 1, "thinking_exhausted"), r("p", 1, "connection", "published"), r("old", 11)], T)).toMatchObject({ pause: false, count: 2 });
    expect(autoPauseCheck([r("a", 1), r("b", 3), r("c", 9, "connection", "gave_up", "love_marriage_child")], T)).toEqual({ pause: true, count: 3, products: ["종합", "연애·결혼·자녀"] });
  });
  it("다시 연 시각 이전 실패는 세지 않는다", () => {
    expect(autoPauseCheck([r("a", 1), r("b", 3), r("c", 9)], T, T - 5 * 60_000)).toMatchObject({ pause: false, count: 2 });
  });
  it("connectionRun: 실패이고 작가 호출 중 하나가 연결 분류일 때만", () => {
    expect(connectionRun(r("a", 1))).toBe(true);
    expect(connectionRun({ ...r("a", 1), calls: [] })).toBe(false);
    expect(connectionRun(r("a", 1, "other"))).toBe(false);
  });
  it("실패율 경보 문구: 이 경보로는 안 멈추고 [4종 멈춤]을 안내한다", () => {
    const day = Date.parse("2026-11-13T15:00:00Z");
    const runs = [r("x", 30, "other", "deferred"), r("y", 20, "other", "deferred"), r("z", 1, "other", "deferred")];
    expect(rateAlert(runs, runs[2], T, day)).toContain("이 경보로는 판매가 멈추지 않아요(연결 오류 연속만 자동 멈춤). 멈추려면 [4종 멈춤].");
  });
});

describe("Anthropic 잔액/인증 감지(watchFetch)·경보 받는 곳", () => {
  const res = (status: number, body: unknown) => async () => new Response(JSON.stringify(body), { status });
  const hit = async (url: string, status: number, body: unknown) => { const seen: QuotaSeen = {}; const r = await watchFetch(res(status, body) as unknown as typeof fetch, seen)(url); return { seen, status: r.status }; };
  const A = "https://api.anthropic.com/v1/messages", O = "https://api.openai.com/v1/responses";
  it("402 billing_error · 400 「credit balance is too low」·지출 한도 → 잔액, 401·403 → 인증, 529는 둘 다 아님", async () => {
    expect((await hit(A, 402, { type: "error", error: { type: "billing_error", message: "x" } })).seen).toEqual({ anthropicCredit: true });
    expect((await hit(A, 400, { type: "error", error: { type: "invalid_request_error", message: "Your credit balance is too low to access the Anthropic API." } })).seen).toEqual({ anthropicCredit: true });
    expect((await hit(A, 400, { type: "error", error: { type: "invalid_request_error", message: "You have reached your specified workspace spend limit." } })).seen).toEqual({ anthropicCredit: true });
    expect((await hit(A, 401, { type: "error", error: { type: "authentication_error", message: "invalid x-api-key" } })).seen).toEqual({ anthropicAuth: true });
    expect((await hit(A, 403, { type: "error", error: { type: "permission_error", message: "no" } })).seen).toEqual({ anthropicAuth: true });
    expect((await hit(A, 400, { type: "error", error: { type: "invalid_request_error", message: "max_tokens too large" } })).seen).toEqual({});
    expect((await hit(A, 529, { type: "error", error: { type: "overloaded_error" } })).seen).toEqual({});
  });
  it("OpenAI 새 잔액 코드(credit_balance_exhausted 등)도 429 → 402로 바꿔 재시도하지 않는다", async () => {
    for (const code of ["credit_balance_exhausted", "monthly_spend_limit_exceeded", "organization_usage_limit_exceeded", "insufficient_quota"]) {
      const r = await hit(O, 429, { error: { code, type: "insufficient_quota" } });
      expect(r).toEqual({ seen: { openaiQuota: true }, status: 402 });
    }
  });
  it("creditAlerter: Anthropic 코드는 판매 멈춤 경보(ops_sales alarm), OpenAI는 예전 대기표(signup credit_alert)", async () => {
    const rpc = vi.fn(async (fn: string, args: { p_action: string; p_data: Record<string, unknown> }) => ({ data: fn === "ops_sales" && args.p_action === "alarm" ? { ok: true, alerted: true, paused: true } : null, error: null }));
    const db = { rpc } as unknown as Parameters<typeof creditAlerter>[0];
    const sent: string[] = [], signup = { call: vi.fn(async () => ({ ok: true })) };
    const alert = creditAlerter(db, async t => { sent.push(t); }, signup);
    await alert("anthropic_auth");
    expect(rpc).toHaveBeenCalledWith("ops_sales", { p_action: "alarm", p_data: { code: "anthropic_auth" } });
    expect(sent[0]).toContain("인증·권한 오류(키 확인)");
    expect(signup.call).not.toHaveBeenCalled();
    await alert("openai_quota");
    expect(signup.call).toHaveBeenCalledWith("credit_alert", { code: "openai_quota" });
    expect(sent).toHaveLength(1);
  });
});

describe("Vercel 빌드 건너뛰기(scripts/ops/vercel-ignore-build.sh)", () => {
  const SCRIPT = join(process.cwd(), "scripts/ops/vercel-ignore-build.sh");
  const repo = () => {
    const d = mkdtempSync(join(tmpdir(), "w3ign-"));
    const git = (...a: string[]) => execFileSync("git", a, { cwd: d, encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@example.com" } }).trim();
    git("init", "-q"); writeFileSync(join(d, "a.ts"), "1"); git("add", "."); git("commit", "-qm", "base");
    return { d, git, base: git("rev-parse", "HEAD") };
  };
  const commit = (r: ReturnType<typeof repo>, files: Record<string, string>) => { for (const [f, c] of Object.entries(files)) { mkdirSync(join(r.d, f, ".."), { recursive: true }); writeFileSync(join(r.d, f), c); } r.git("add", "."); r.git("commit", "-qm", "c"); };
  const run = (cwd: string, env: Record<string, string>) => { try { execFileSync("bash", [SCRIPT], { cwd, env: { PATH: process.env.PATH ?? "", ...env } as unknown as NodeJS.ProcessEnv, stdio: "pipe" }); return 0; } catch (e) { return (e as { status: number }).status; } };
  it.each([
    ["문서만(*.md·docs 그림)", { "docs/v5/w3.md": "x", "README.md": "y", "docs/v5/cap/a.png": "z" }, "v5/main", 0],
    ["코드 포함", { "docs/v5/w3.md": "x", "src/x.ts": "1" }, "v5/main", 1],
    ["docs/validation(실행 중에 읽음)", { "docs/validation/x.json": "1" }, "v5/main", 1],
    ["docs/product(MBTI 원천 JSON)", { "docs/product/mbti/source/INTJ.json": "1" }, "v5/main", 1],
    ["docs 아래 json", { "docs/v5/data.json": "1" }, "v5/main", 1],
    ["master는 문서만이어도 빌드", { "docs/v5/w3.md": "x" }, "master", 1],
  ] as const)("%s → exit %s", (_n, files, ref, want) => {
    const r = repo(); commit(r, files);
    expect(run(r.d, { VERCEL_GIT_COMMIT_REF: ref, VERCEL_GIT_PREVIOUS_SHA: r.base })).toBe(want);
  });
  it("지난 배포 없음·clone에 없는 커밋·바뀐 파일 없음이면 빌드", () => {
    const r = repo(); commit(r, { "docs/a.md": "x" });
    expect(run(r.d, { VERCEL_GIT_COMMIT_REF: "v5/main" })).toBe(1);
    expect(run(r.d, { VERCEL_GIT_COMMIT_REF: "v5/main", VERCEL_GIT_PREVIOUS_SHA: "0123456789abcdef0123456789abcdef01234567" })).toBe(1);
    expect(run(r.d, { VERCEL_GIT_COMMIT_REF: "v5/main", VERCEL_GIT_PREVIOUS_SHA: r.git("rev-parse", "HEAD") })).toBe(1);
  });
  it("vercel.json: master·v5/main만 자동 배포(둘 중 하나라도 true면 배포 — Vercel 문서), 건너뛰기 명령 연결", async () => {
    const cfg = JSON.parse((await import("node:fs")).readFileSync("vercel.json", "utf8"));
    expect(cfg.git).toEqual({ deploymentEnabled: { "**": false, master: true, "v5/main": true } });
    expect(cfg.ignoreCommand).toBe("bash scripts/ops/vercel-ignore-build.sh");
    expect(cfg.crons).toHaveLength(6);
  });
});

describe("관리자 화면 거절도 감사에 남긴다", () => {
  const ADMIN = "00000000-0000-4000-8000-0000000000a1";
  const make = () => {
    const audits: AuditEntry[] = [];
    const deps = { env: {}, now: () => Date.now(), sameOrigin: () => true, uuid: () => "u", refundProvider: () => null, reliability: () => ({ call: async () => ({ ok: false }) }),
      session: async () => ({ status: "admin" as const, userId: ADMIN, finish: (r: Response) => r }),
      stores: () => ({ db: {}, audit: async (e: AuditEntry) => { audits.push(e); return true; } }) } as unknown as AdminActionDeps;
    return { deps, audits };
  };
  const req = (body: unknown) => new NextRequest("https://www.gyeolreport.com/api/admin/orders/regenerate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  it("세션 확인 뒤 400·409 거절 → admin_rejected(작업·상태·코드), 세션 없는 요청은 남기지 않는다", async () => {
    const { deps, audits } = make();
    const r = await handleAdminAction(req({ orderCode: "nope" }), "regenerate", deps);
    expect(r.status).toBe(400);
    expect(audits).toEqual([{ actor: "admin", actorUserId: ADMIN, action: "admin_rejected", target: "admin:regenerate", detail: { action: "regenerate", status: 400, code: "ORDER_CODE_INVALID" } }]);
    const none = make();
    (none.deps as { session: unknown }).session = async () => ({ status: "none", userId: null, finish: (x: Response) => x });
    expect((await handleAdminAction(req({}), "regenerate", none.deps)).status).toBe(403);
    expect(none.audits).toEqual([]);
  });
});
