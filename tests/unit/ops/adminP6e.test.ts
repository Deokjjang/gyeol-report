// P6e-ops 관리자 작업: 환불 경고(확인 전엔 환불 안 됨) · 토스 상태 확인(조회만) · 일괄 확인 · 외부 환불 기록(PIN·토스 재조회) · 보상 A 지정(PIN) · 요청 자동 처리.
// 토스는 대역: lookup만 돌려주고, cancel이 불리면 시험이 실패한다(취소 호출 0).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));

const ADMIN = "11111111-1111-4111-8111-111111111111", BUYER = "33333333-3333-4333-8333-333333333333", PIN = "4826-zz", SITE = "https://www.gyeolreport.com";
type Rec = Record<string, unknown>;
const h = vi.hoisted(() => ({
  user: null as null | { id: string; lastSignInAt?: string | null },
  rpc: [] as { fn: string; action: string; data: Rec }[], audit: [] as Rec[], order: [] as { action: string; data: Rec }[], generation: [] as { action: string; data: Rec }[],
  detail: {} as Rec, recon: {} as Record<string, Rec>, comp: {} as Record<string, Rec>, toss: { lookups: 0, cancels: 0, result: { ok: true, payment: { status: "DONE", balanceAmount: 1490, cancels: [] } } as Rec, byKey: {} as Record<string, Rec> },
  reliability: [] as { action: string }[],
}));

vi.mock("@/lib/account/supabase", () => ({ createAccountPort: () => ({ currentUser: async () => h.user, finish: (r: unknown) => r }) }));
vi.mock("@/lib/ops/store", () => ({
  OPS_RPC_TIMEOUT_MS: 1000,
  createOpsStores: () => ({
    db: {
      rpc: (fn: string, args: { p_action: string; p_data: Rec }) => {
        h.rpc.push({ fn, action: args.p_action, data: args.p_data });
        const data = fn === "ops_admin" && args.p_action === "detail" ? h.detail
          : fn === "ops_recon" ? (h.recon[args.p_action] ?? { ok: true })
          : fn === "ops_comp" ? (h.comp[args.p_action] ?? { ok: true })
          : fn === "report_tickets" ? { ok: true, grantId: "g1" } : { ok: true };
        return { abortSignal: async () => ({ data, error: null }) };
      },
      from: () => { const self: unknown = new Proxy({}, { get: (_t, k) => k === "then" ? (ok: (v: unknown) => unknown, bad: (e: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(ok, bad) : () => self }); return self; },
    },
    order: { call: async (action: string, data: Rec) => { h.order.push({ action, data }); return action === "refund_request" ? { ok: true, state: "requested", fresh: true } : action === "refund_claim" ? { ok: true, empty: true } : { ok: true }; } },
    generation: { call: async (action: string, data: Rec) => { h.generation.push({ action, data }); return { ok: true }; } },
    gift: { call: async () => ({ ok: true }) }, account: { call: async () => ({ ok: true }) },
    audit: async (e: Rec) => { h.audit.push(e); return true; },
  }),
}));
vi.mock("@/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: async (action: string) => { h.reliability.push({ action }); return { ok: true }; } }) }));
vi.mock("@/lib/payment/tossRefundClient", () => ({
  createTossRefundProvider: () => ({
    lookup: async (i: { paymentKey: string }) => { h.toss.lookups++; return h.toss.byKey[i.paymentKey] ?? h.toss.result; },
    cancel: async () => { h.toss.cancels++; return { ok: true, payment: { status: "CANCELED", balanceAmount: 0 } }; },
  }),
}));

import { POST } from "@/app/api/admin/orders/[action]/route";
import { refundWarningLines } from "@/lib/ops/admin/format";

const order = (over: Rec = {}) => ({ orderCode: "GR-ABCD", paymentOrderId: "po_1", providerOrderId: "provider_order_1", paymentKey: "pk_test_abcdef123456", productType: "saju_mbti_full",
  amount: 1490, status: "paid", reportId: "report_1", buyerName: "홍길동", buyerEmail: "hong@example.com", buyerPhone: null, userId: BUYER, ...over });
const setDetail = (o: Rec = {}, rest: Rec = {}) => { h.detail = { ok: true, order: order(o), input: null, book: { status: "COMPLETED", publishedAt: "2026-11-01T00:00:00Z" }, job: { status: "COMPLETED" }, attempts: [], state: null, runs: [], versions: [], requests: [], refund: null, audit: [], ...rest }; };
const call = async (action: string, body: unknown) => {
  const res = await POST(new NextRequest(`${SITE}/api/admin/orders/${action}`, { method: "POST", headers: { "content-type": "application/json", origin: SITE }, body: JSON.stringify(body) }), { params: Promise.resolve({ action }) });
  return { status: res.status, body: await res.json() as Rec };
};
const canceled = (extra: Rec = {}) => ({ ok: true, payment: { status: "CANCELED", balanceAmount: 0, cancels: [{ canceledAt: "2026-10-02T03:04:05.000Z" }], ...extra } });
const auditOf = (a: string) => h.audit.filter(x => x.action === a);
const reconCalls = (a: string) => h.rpc.filter(x => x.fn === "ops_recon" && x.action === a);

beforeEach(() => {
  Object.assign(h, { user: { id: ADMIN, lastSignInAt: new Date(Date.now() - 3_600_000).toISOString() }, rpc: [], audit: [], order: [], generation: [], reliability: [], recon: {}, comp: {} });
  Object.assign(h.toss, { lookups: 0, cancels: 0, result: { ok: true, payment: { status: "DONE", balanceAmount: 1490, cancels: [] } }, byKey: {} });
  setDetail();
  vi.stubEnv("ADMIN_USER_IDS", ADMIN); vi.stubEnv("ADMIN_ACTION_PIN", PIN); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_sk_dummy");
  vi.stubEnv("ADMIN_REFUND_DAILY_MAX_COUNT", ""); vi.stubEnv("ADMIN_REFUND_DAILY_MAX_AMOUNT", ""); vi.stubEnv("COMP_ENABLED", "");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("환불 경고(이미 쓴 이벤트 이용권·나간 친구 보너스)", () => {
  const refundBody = (over: Rec = {}) => ({ orderCode: "GR-ABCD", reason: "계산 오류", confirmCode: "GR-ABCD", pin: PIN, ...over });
  it("경고가 있으면 확인(ackWarnings) 없이는 환불 요청을 저장하지 않는다(409 + 경고 내용)", async () => {
    h.recon.refund_warnings = { ok: true, giftUsed: [{ status: "used_self", at: "2026-11-02T00:00:00Z" }], giftPendingRevoked: 0, bonusSent: true };
    const r = await call("refund", refundBody());
    expect(r.status).toBe(409);
    expect(r.body).toMatchObject({ code: "REFUND_WARNINGS", warnings: { giftUsed: [{ status: "used_self" }], bonusSent: true } });
    expect(h.order.some(x => x.action === "refund_request")).toBe(false);
    expect(h.toss.cancels).toBe(0);
  });
  it("확인하면(ackWarnings) 진행된다 — 회수하지 않는 정책 그대로(환불 요청만 저장, 이용권을 되돌리는 호출 없음)", async () => {
    h.recon.refund_warnings = { ok: true, giftUsed: [{ status: "claimed", at: null }], giftPendingRevoked: 0, bonusSent: false };
    const r = await call("refund", refundBody({ ackWarnings: true }));
    expect(r.status).toBe(200);
    expect(h.order.filter(x => x.action === "refund_request")).toHaveLength(1);
    expect(h.rpc.filter(x => x.fn === "report_tickets")).toEqual([]);
  });
  it("경고가 없으면 확인 없이 진행, 경고 조회가 실패하면 막는다(503)", async () => {
    h.recon.refund_warnings = { ok: true, giftUsed: [], giftPendingRevoked: 2, bonusSent: false };
    expect((await call("refund", refundBody())).status).toBe(200);
    h.order.length = 0; h.recon.refund_warnings = { ok: false, code: "STORAGE_FAILED" };
    expect(await call("refund", refundBody())).toMatchObject({ status: 503, body: { code: "WARNINGS_CHECK_FAILED" } });
    expect(h.order.some(x => x.action === "refund_request")).toBe(false);
  });
  it("refund-warnings: 화면이 환불 단계를 열 때 경고를 읽는다(PIN 없이, 주문 정보는 서버가 다시 읽음)", async () => {
    h.recon.refund_warnings = { ok: true, giftUsed: [{ status: "used_self", at: null }], giftPendingRevoked: 0, bonusSent: false };
    const r = await call("refund-warnings", { orderCode: "GR-ABCD" });
    expect(r).toMatchObject({ status: 200, body: { ok: true, hasWarnings: true } });
    expect(reconCalls("refund_warnings")[0].data).toEqual({ paymentOrderId: "po_1" });
  });
  it("경고 문구: 본인이 씀·친구가 받음·보너스 나감 + 회수하지 않는다는 안내", () => {
    const lines = refundWarningLines({ giftUsed: [{ status: "used_self" }, { status: "claimed" }], bonusSent: true });
    expect(lines).toHaveLength(4);
    expect(lines[0]).toContain("본인이 이미 사용"); expect(lines[1]).toContain("친구가 이미 받았"); expect(lines[2]).toContain("보너스"); expect(lines[3]).toContain("회수하지 않아요");
    expect(refundWarningLines({ giftUsed: [], bonusSent: false })).toEqual([]);
  });
});

describe("토스 상태 확인(조회 API만)", () => {
  it("한 건: 토스가 DONE이면 일치, 취소 호출 0, 감사 로그(toss_check)", async () => {
    const r = await call("toss-check", { orderCode: "GR-ABCD" });
    expect(r).toMatchObject({ status: 200, body: { ok: true, mismatch: false, toss: { kind: "done" } } });
    expect(h.toss.lookups).toBe(1); expect(h.toss.cancels).toBe(0);
    expect(auditOf("toss_check")).toHaveLength(1); expect(auditOf("toss_check")[0]).toMatchObject({ actor: "admin", target: "GR-ABCD", detail: { result: "done", dbStatus: "paid" } });
  });
  it("토스는 CANCELED인데 우리는 결제 완료 → mismatch, 마지막 취소 시각을 알려 준다", async () => {
    h.toss.result = canceled();
    const r = await call("toss-check", { orderCode: "GR-ABCD" });
    expect(r.body).toMatchObject({ ok: true, mismatch: true, toss: { kind: "canceled", canceledAt: "2026-10-02T03:04:05.000Z", balanceAmount: 0 } });
    expect(String(r.body.message)).toContain("외부 환불로 기록");
    expect(h.toss.cancels).toBe(0);
  });
  it("일부 취소는 자동 기록하지 않고 수동 확인 안내, 조회 실패는 이유를 보여 준다, 비밀키 없으면 503", async () => {
    h.toss.result = { ok: true, payment: { status: "PARTIAL_CANCELED", balanceAmount: 500, cancels: [{ canceledAt: "2026-10-02T00:00:00Z" }] } };
    expect((await call("toss-check", { orderCode: "GR-ABCD" })).body).toMatchObject({ mismatch: false, toss: { kind: "partial", balanceAmount: 500 } });
    h.toss.result = { ok: false, code: "PROVIDER_MISMATCH" };
    expect((await call("toss-check", { orderCode: "GR-ABCD" })).body).toMatchObject({ toss: { kind: "error", code: "PROVIDER_MISMATCH" } });
    vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "");
    expect(await call("toss-check", { orderCode: "GR-ABCD" })).toMatchObject({ status: 503, body: { code: "TOSS_SECRET_MISSING" } });
    expect(h.toss.cancels).toBe(0);
  });
  it("일괄: 대상 20건씩 조회, 결과 요약·커서·감사 로그. 취소 호출 0", async () => {
    const t = (n: number) => ({ orderCode: `GR-AA${n}A`, paymentOrderId: `po_${n}`, paymentKey: `pk_${n}`, providerOrderId: `o_${n}`, amount: 1490, createdAt: `2026-09-0${n}T00:00:00Z` });
    h.recon.toss_targets = { ok: true, targets: [t(1), t(2), t(3)], more: true, total: 7 };
    h.toss.byKey = { pk_2: canceled(), pk_3: { ok: false, code: "PROVIDER_UNKNOWN" } };
    const r = await call("toss-check-batch", { scope: "legacy" });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ ok: true, checked: 3, total: 7, next: { afterAt: "2026-09-03T00:00:00Z", afterId: "po_3" } });
    expect((r.body.rows as { orderCode: string; result: string }[]).map(x => [x.orderCode, x.result])).toEqual([["GR-AA1A", "done"], ["GR-AA2A", "canceled"], ["GR-AA3A", "error"]]);
    expect(reconCalls("toss_targets")[0].data).toMatchObject({ scope: "legacy", limit: 20 });
    expect(auditOf("toss_check_batch")[0]).toMatchObject({ detail: { checked: 3, done: 1, canceled: 1, errors: 1, scope: "legacy" } });
    expect(h.toss.cancels).toBe(0);
    // 커서로 이어서
    h.recon.toss_targets = { ok: true, targets: [], more: false, total: 7 };
    await call("toss-check-batch", { scope: "all", afterAt: "2026-09-03T00:00:00Z", afterId: "po_3" });
    expect(reconCalls("toss_targets")[1].data).toMatchObject({ scope: "all", afterAt: "2026-09-03T00:00:00Z", afterId: "po_3" });
    expect(await call("toss-check-batch", { afterAt: "not-a-date" })).toMatchObject({ status: 400, body: { code: "CURSOR_INVALID" } });
  });
});

describe("외부 환불 기록(PIN)", () => {
  const body = (over: Rec = {}) => ({ orderCode: "GR-ABCD", confirmCode: "GR-ABCD", pin: PIN, ...over });
  it("PIN 없이는 아무 것도 하지 않고(토스 조회도 0), 틀린 PIN은 403 + 감사", async () => {
    expect((await call("external-refund", { orderCode: "GR-ABCD", confirmCode: "GR-ABCD" })).status).toBe(400);
    expect((await call("external-refund", body({ pin: "wrong" }))).status).toBe(403);
    expect(h.toss.lookups).toBe(0); expect(reconCalls("external_refund")).toEqual([]);
    expect(auditOf("admin_pin_failed")).toHaveLength(1);
  });
  it("확인용 주문코드가 다르면 400, 결제 완료가 아니면 409", async () => {
    expect(await call("external-refund", body({ confirmCode: "GR-ZZZZ" }))).toMatchObject({ status: 400, body: { code: "CONFIRM_MISMATCH" } });
    setDetail({ status: "refunded" });
    expect(await call("external-refund", body())).toMatchObject({ status: 409, body: { code: "NOT_PAID" } });
    expect(reconCalls("external_refund")).toEqual([]);
  });
  it("서버가 토스를 다시 조회해 전액 취소일 때만 기록한다. DONE이면 거절하고 감사 로그(external_refund_blocked)", async () => {
    const r = await call("external-refund", body());
    expect(r).toMatchObject({ status: 409, body: { code: "TOSS_NOT_CANCELED" } });
    expect(reconCalls("external_refund")).toEqual([]);
    expect(auditOf("external_refund_blocked")[0]).toMatchObject({ detail: { toss: "done" } });
  });
  it("전액 취소(CANCELED, 잔액 0)면 외부 환불로 기록 — 금액·취소 시각·관리자 id를 DB에 넘기고 감사 로그를 남긴다. 취소 호출 0", async () => {
    h.toss.result = canceled();
    h.recon.external_refund = { ok: true, giftRevoked: true };
    const r = await call("external-refund", body());
    expect(r).toMatchObject({ status: 200, body: { ok: true } });
    expect(reconCalls("external_refund")[0].data).toEqual({ paymentOrderId: "po_1", adminUserId: ADMIN, amount: 1490, canceledAt: "2026-10-02T03:04:05.000Z" });
    expect(auditOf("external_refund")[0]).toMatchObject({ actor: "admin", target: "GR-ABCD", detail: { ok: true, amount: 1490, tossCanceledAt: "2026-10-02T03:04:05.000Z", giftRevoked: true } });
    expect(h.toss.cancels).toBe(0);
  });
  it("토스에 잔액이 남은 취소(일부 취소)는 기록하지 않는다", async () => {
    h.toss.result = { ok: true, payment: { status: "CANCELED", balanceAmount: 0, cancels: [{ canceledAt: "2026-10-02T00:00:00Z" }] } };
    h.toss.result = { ok: true, payment: { status: "PARTIAL_CANCELED", balanceAmount: 490, cancels: [{ canceledAt: "2026-10-02T00:00:00Z" }] } };
    expect(await call("external-refund", body())).toMatchObject({ status: 409, body: { code: "TOSS_NOT_CANCELED" } });
    expect(reconCalls("external_refund")).toEqual([]);
  });
  it("DB가 거절하면(금액 불일치 등) 409로 알리고 기록 실패를 감사 로그에 남긴다", async () => {
    h.toss.result = canceled(); h.recon.external_refund = { ok: false, code: "AMOUNT_MISMATCH" };
    expect(await call("external-refund", body())).toMatchObject({ status: 409, body: { code: "AMOUNT_MISMATCH" } });
    expect(auditOf("external_refund")[0]).toMatchObject({ detail: { ok: false, code: "AMOUNT_MISMATCH" } });
  });
});

describe("고객 요청 자동 처리 연결", () => {
  it("이용권 지급 성공 → 그 주문의 처리 전 요청을 자동 처리(autoclose, 라벨 '이용권 지급'), 메시지에 건수", async () => {
    h.recon.autoclose = { ok: true, closed: 2 };
    const r = await call("grant", { orderCode: "GR-ABCD", quantity: 1, pin: PIN, requestId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
    expect(r.status).toBe(200);
    expect(reconCalls("autoclose")[0].data).toEqual({ paymentOrderId: "po_1", label: "이용권 지급" });
    expect(r.body).toMatchObject({ closedRequests: 2 }); expect(String(r.body.message)).toContain("2건");
  });
  it("재생성 성공 → 자동 처리(라벨 '재생성 요청')", async () => {
    h.recon.autoclose = { ok: true, closed: 1 };
    const r = await call("regenerate", { orderCode: "GR-ABCD" });
    expect(r.status).toBe(200);
    expect(reconCalls("autoclose")[0].data).toEqual({ paymentOrderId: "po_1", label: "재생성 요청" });
  });
  it("작업이 실패하면 요청은 그대로 둔다(autoclose 호출 없음)", async () => {
    h.generation.length = 0;
    setDetail({}, { book: { status: "GENERATING", publishedAt: null }, job: { status: "RUNNING" } });
    expect((await call("regenerate", { orderCode: "GR-ABCD" })).status).toBe(409);
    expect(reconCalls("autoclose")).toEqual([]);
    setDetail({ userId: null });
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 1, pin: PIN })).status).toBe(409);
    expect(reconCalls("autoclose")).toEqual([]);
  });
});

describe("보상 A 지정(PIN)", () => {
  it("주문코드로 지정 → 켜져 있으면 바로 지급까지(sync), 감사 로그(comp_designate)", async () => {
    vi.stubEnv("COMP_ENABLED", "1");
    h.comp.designate = { ok: true, userId: BUYER, orderCode: "GR-ABCD", already: false };
    h.comp.sync = { ok: true, tier: "A", state: "granted", quantity: 2 };
    const r = await call("comp-designate", { query: "gr-abcd", pin: PIN });
    expect(r).toMatchObject({ status: 200, body: { ok: true, state: "granted" } });
    expect(String(r.body.message)).toContain("보상 A로 지정했어요"); expect(String(r.body.message)).toContain("지급했어요");
    const designate = h.rpc.find(x => x.fn === "ops_comp" && x.action === "designate")!;
    expect(designate.data).toEqual({ orderCode: "GR-ABCD", adminUserId: ADMIN });
    const sync = h.rpc.find(x => x.fn === "ops_comp" && x.action === "sync")!;
    expect(sync.data).toMatchObject({ userId: BUYER, enabled: true, aQty: 2, aDays: 60, bQty: 1, bDays: 30, products: ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] });
    expect(auditOf("comp_designate")[0]).toMatchObject({ actor: "admin", target: "GR-ABCD", detail: { ok: true, userId: BUYER, state: "granted" } });
  });
  it("토스 주문번호로도 지정, 꺼져 있으면 지급하지 않고(sync 호출 없음) 그렇게 안내", async () => {
    h.comp.designate = { ok: true, userId: BUYER, orderCode: "GR-ABCD", already: false };
    const r = await call("comp-designate", { query: "provider_order_1", pin: PIN });
    expect(h.rpc.find(x => x.action === "designate")!.data).toEqual({ providerOrderId: "provider_order_1", adminUserId: ADMIN });
    expect(h.rpc.some(x => x.fn === "ops_comp" && x.action === "sync")).toBe(false);
    expect(r.body).toMatchObject({ ok: true, state: "off" }); expect(String(r.body.message)).toContain("COMP_ENABLED");
  });
  it("PIN이 없거나 틀리면 아무 것도 하지 않는다. 형식이 틀린 입력은 400", async () => {
    expect((await call("comp-designate", { query: "GR-ABCD" })).status).toBe(400);
    expect((await call("comp-designate", { query: "GR-ABCD", pin: "nope" })).status).toBe(403);
    expect(await call("comp-designate", { query: "   ", pin: PIN })).toMatchObject({ status: 400, body: { code: "QUERY_REQUIRED" } });
    expect(await call("comp-designate", { query: "bad id!", pin: PIN })).toMatchObject({ status: 400, body: { code: "QUERY_INVALID" } });
    expect(h.rpc.some(x => x.fn === "ops_comp")).toBe(false);
  });
  it("환불되지 않은 주문·계정 없는 주문은 이유와 함께 거절하고 감사 로그에 실패를 남긴다", async () => {
    h.comp.designate = { ok: false, code: "NOT_REFUNDED", status: "paid", orderCode: "GR-ABCD" };
    expect(await call("comp-designate", { query: "GR-ABCD", pin: PIN })).toMatchObject({ status: 409, body: { code: "NOT_REFUNDED" } });
    h.comp.designate = { ok: false, code: "NO_ACCOUNT", orderCode: "GR-ABCD" };
    expect(await call("comp-designate", { query: "GR-ABCD", pin: PIN })).toMatchObject({ status: 409, body: { code: "NO_ACCOUNT" } });
    h.comp.designate = { ok: false, code: "ORDER_NOT_FOUND" };
    expect((await call("comp-designate", { query: "GR-QQQQ", pin: PIN })).status).toBe(404);
    expect(auditOf("comp_designate").map(a => (a.detail as Rec).code)).toEqual(["NOT_REFUNDED", "NO_ACCOUNT", "ORDER_NOT_FOUND"]);
  });
  it("관리자가 아니면 403(새 작업 모두)", async () => {
    h.user = { id: BUYER, lastSignInAt: new Date().toISOString() };
    for (const a of ["refund-warnings", "toss-check", "toss-check-batch", "external-refund", "comp-designate"]) expect((await call(a, { orderCode: "GR-ABCD", pin: PIN, query: "GR-ABCD" })).status).toBe(403);
    expect(h.rpc).toEqual([]); expect(h.toss.lookups).toBe(0);
  });
});
