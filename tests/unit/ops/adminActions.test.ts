// P6d-ops 관리자 작업 route: 같은 출처 + 관리자 + 로그인 12시간 이내만, JSON 4KB 상한, no-store.
// 환불은 사유 + 주문코드 정확히 재입력 + PIN, 하루 상한. 이용권·내보내기도 PIN. 개인정보 보기는 감사 로그를 남긴 뒤에만.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));

const ADMIN = "11111111-1111-4111-8111-111111111111", MEMBER = "22222222-2222-4222-8222-222222222222", BUYER = "33333333-3333-4333-8333-333333333333";
const PIN = "4826-zz";
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
type Rec = Record<string, unknown>;
const h = vi.hoisted(() => ({
  user: null as null | { id: string; lastSignInAt?: string | null }, ports: 0,
  rpc: [] as { fn: string; args: Record<string, unknown> }[], order: [] as { action: string; data: Record<string, unknown> }[],
  generation: [] as { action: string; data: Record<string, unknown> }[], reliability: [] as { action: string; data: Record<string, unknown> }[],
  audit: [] as Record<string, unknown>[], auditOk: true, detail: {} as Record<string, unknown>, cancels: 0,
  from: [] as { table: string; calls: unknown[][] }[], pinFailures: [] as { created_at: string }[], todayRefunds: [] as { amount: number }[],
}));

/** supabase-js 질의 흉내: 어떤 체인이든 기록하고, await하면 표별 행을 준다. */
function query(table: string): unknown {
  const q = { table, calls: [] as unknown[][] };
  h.from.push(q);
  const data = table === "ops_audit_log" ? h.pinFailures : table === "order_refunds" ? h.todayRefunds
    : table === "order_records" ? [{ payment_order_id: "po_1", buyer_phone: "01012345678" }] : [];
  const self: unknown = new Proxy({}, { get: (_t, key) => key === "then"
    ? (ok: (v: unknown) => unknown, bad: (e: unknown) => unknown) => Promise.resolve({ data, error: null }).then(ok, bad)
    : (...args: unknown[]) => { q.calls.push([key, ...args]); return self; } });
  return self;
}
vi.mock("@/lib/account/supabase", () => ({ createAccountPort: () => { h.ports++; return { currentUser: async () => h.user, finish: (r: unknown) => r }; } }));
vi.mock("@/lib/ops/store", () => ({
  OPS_RPC_TIMEOUT_MS: 1000,
  createOpsStores: () => ({
    db: {
      rpc: (fn: string, args: Record<string, unknown>) => {
        h.rpc.push({ fn, args });
        const data = fn === "ops_admin" && args.p_action === "detail" ? h.detail
          : fn === "ops_admin" && args.p_action === "search" ? { ok: true, orders: [{ orderCode: "GR-ABCD", paymentOrderId: "po_1", providerOrderId: "provider_order_1", productType: "saju_mbti_full",
            amount: 1490, paymentStatus: "paid", createdAt: "2026-11-04T01:00:00Z", paidAt: "2026-11-04T01:01:00Z", buyerEmail: "hong@example.com", buyerName: "=HYPERLINK(1)" }] }
          : fn === "report_tickets" ? { ok: true, grantId: "g1" } : { ok: true };
        return { abortSignal: async () => ({ data, error: null }) };
      },
      from: (table: string) => query(table),
    },
    order: { call: async (action: string, data: Record<string, unknown>) => {
      h.order.push({ action, data });
      if (action === "refund_request") return { ok: true, state: "requested", fresh: true };
      if (action === "refund_claim") return h.order.filter(x => x.action === "refund_claim").length > 1 ? { ok: true, empty: true } : { ok: true, refund: {
        paymentOrderId: data.paymentOrderId, paymentKey: "pk_test_abcdef123456", providerOrderId: "provider_order_1", amount: 1490, originalAmount: 1490,
        idempotencyKey: "order-refund-44444444-4444-4444-8444-444444444444", reason: "고객 요청", firstAttemptAt: new Date().toISOString(), attempts: 1, source: "admin" } };
      return { ok: true };
    } },
    generation: { call: async (action: string, data: Record<string, unknown>) => { h.generation.push({ action, data }); return { ok: true }; } },
    gift: { call: async () => ({ ok: true }) }, account: { call: async () => ({ ok: true }) },
    audit: async (e: Record<string, unknown>) => { h.audit.push(e); return h.auditOk; },
  }),
}));
vi.mock("@/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: async (action: string, data: Record<string, unknown>) => { h.reliability.push({ action, data }); return { ok: true }; } }) }));
vi.mock("@/lib/payment/tossRefundClient", () => ({
  createTossRefundProvider: () => ({
    lookup: async () => ({ ok: false, code: "PROVIDER_UNKNOWN" }),
    cancel: async () => { h.cancels++; return { ok: true, payment: { status: "CANCELED", balanceAmount: 0 } }; },
  }),
}));

import { POST } from "@/app/api/admin/orders/[action]/route";
import { adminPinLockedUntil, kstDayRange } from "@/lib/ops/admin/config";
import { maskEmail, maskPhone } from "@/lib/ops/admin/format";
import { ordersCsv } from "@/lib/ops/admin/exportCsv";
import type { OrderRow } from "@/lib/ops/admin/data";

const SITE = "https://www.gyeolreport.com";
const order = (over: Rec = {}) => ({ orderCode: "GR-ABCD", paymentOrderId: "po_1", providerOrderId: "provider_order_1", paymentKey: "pk_test_abcdef123456", productType: "saju_mbti_full",
  amount: 1490, status: "paid", reportId: "report_1", buyerName: "홍길동", buyerEmail: "hong@example.com", buyerPhone: "01012345678", userId: BUYER, ...over });
function setDetail(o: Rec = {}, rest: Rec = {}) {
  h.detail = { ok: true, order: order(o), input: null, book: { status: "COMPLETED", publishedAt: "2026-11-01T00:00:00Z" }, job: { status: "COMPLETED" }, attempts: [], state: null, runs: [], versions: [], requests: [], refund: null, audit: [], ...rest };
}
function req(action: string, body: unknown, opts: { origin?: string | null; type?: string; raw?: string } = {}) {
  const headers: Record<string, string> = { "content-type": opts.type ?? "application/json" };
  if (opts.origin !== null) headers.origin = opts.origin ?? SITE;
  return new NextRequest(`${SITE}/api/admin/orders/${action}`, { method: "POST", headers, body: opts.raw ?? JSON.stringify(body) });
}
const send = (action: string, body: unknown, opts?: Parameters<typeof req>[2]) => POST(req(action, body, opts), { params: Promise.resolve({ action }) });
const call = async (action: string, body: unknown, opts?: Parameters<typeof req>[2]) => {
  const res = await send(action, body, opts);
  return { status: res.status, cache: res.headers.get("cache-control"), body: await res.json() as Rec };
};
const refundBody = (over: Rec = {}) => ({ orderCode: "GR-ABCD", reason: "고객 요청", confirmCode: "GR-ABCD", pin: PIN, ...over });
const touched = () => [...h.rpc, ...h.order, ...h.generation, ...h.reliability, ...h.audit, ...h.from];
const auditOf = (action: string) => h.audit.filter(a => a.action === action);

beforeEach(() => {
  Object.assign(h, { user: { id: ADMIN, lastSignInAt: ago(3_600_000) }, ports: 0, rpc: [], order: [], generation: [], reliability: [], audit: [], auditOk: true, cancels: 0, from: [], pinFailures: [], todayRefunds: [] });
  setDetail();
  vi.stubEnv("ADMIN_USER_IDS", ADMIN);
  vi.stubEnv("ADMIN_ACTION_PIN", PIN);
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_sk_dummy");
  vi.stubEnv("ADMIN_REFUND_DAILY_MAX_COUNT", "");
  vi.stubEnv("ADMIN_REFUND_DAILY_MAX_AMOUNT", "");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("관리자 작업 route: 출처·관리자·세션", () => {
  it("다른 출처·출처 없음은 403, 로그인 확인도 하지 않는다", async () => {
    for (const origin of ["https://evil.example", "https://gyeolreport.com", null]) {
      const r = await call("refund", refundBody(), { origin });
      expect(r.status).toBe(403);
      expect(r.cache).toBe("no-store");
    }
    expect(h.ports).toBe(0);
    expect(touched()).toEqual([]);
  });
  it("비회원·일반 회원은 403, 아무 것도 바꾸지 않는다", async () => {
    for (const user of [null, { id: MEMBER, lastSignInAt: ago(1000) }]) {
      h.user = user;
      for (const action of ["refund", "grant", "regenerate", "request-done", "provider-enable", "export", "reveal"]) {
        const r = await call(action, refundBody({ field: "email" }));
        expect(r.status).toBe(403);
        expect(r.body.code).toBe("FORBIDDEN");
      }
    }
    expect(touched()).toEqual([]);
  });
  it("관리자 로그인이 12시간을 넘었거나 시각이 없으면 401 ADMIN_SESSION_EXPIRED", async () => {
    for (const lastSignInAt of [ago(12 * 3_600_000 + 1000), null]) {
      h.user = { id: ADMIN, lastSignInAt };
      for (const action of ["refund", "reveal", "provider-enable"]) {
        const r = await call(action, refundBody({ field: "email" }));
        expect(r).toMatchObject({ status: 401, cache: "no-store", body: { code: "ADMIN_SESSION_EXPIRED" } });
      }
    }
    expect(touched()).toEqual([]);
  });
  it("없는 작업 404, JSON이 아니면 415, 4KB 초과 413, 깨진 JSON 400", async () => {
    expect((await call("delete-everything", {})).status).toBe(404);
    expect((await call("grant", {}, { type: "text/plain" })).status).toBe(415);
    expect((await call("grant", { pad: "x".repeat(5000) })).status).toBe(413);
    expect((await call("grant", null, { raw: "{bad" })).status).toBe(400);
    expect(touched()).toEqual([]);
  });
});

describe("관리자 PIN(환불·이용권·내보내기)", () => {
  it("PIN 설정이 없으면 세 작업 모두 꺼짐(503), 아무 것도 하지 않는다", async () => {
    vi.stubEnv("ADMIN_ACTION_PIN", "");
    for (const action of ["refund", "grant", "export"]) expect((await call(action, refundBody({ quantity: 1 }))).body.code).toBe("ADMIN_PIN_UNSET");
    expect([...h.order, ...h.rpc]).toEqual([]);
    // W3 P0: 관리자 세션이 확인된 뒤의 거절은 감사에 남긴다(admin_rejected) — 그 밖의 작업은 하지 않는다.
    expect(h.audit.map(e => [(e as { action: string }).action, ((e as { detail: { code: string } }).detail.code)])).toEqual([["admin_rejected", "ADMIN_PIN_UNSET"], ["admin_rejected", "ADMIN_PIN_UNSET"], ["admin_rejected", "ADMIN_PIN_UNSET"]]);
  });
  it("틀린 PIN은 403 + 감사 로그(admin_pin_failed), 작업은 하지 않는다", async () => {
    const r = await call("refund", refundBody({ pin: "0000" }));
    expect(r).toMatchObject({ status: 403, body: { code: "ADMIN_PIN_INVALID" } });
    expect(auditOf("admin_pin_failed")).toEqual([{ actor: "admin", actorUserId: ADMIN, action: "admin_pin_failed", target: "GR-ABCD", detail: { action: "refund" } }]);
    expect(h.order).toEqual([]);
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 1 })).body.code).toBe("PIN_REQUIRED");
    expect(h.rpc.some(x => x.fn === "report_tickets")).toBe(false);
  });
  it("15분 안 5번 틀리면 맞는 PIN도 15분 잠금(429), 실패 기록은 이 관리자 것만 센다", async () => {
    h.pinFailures = [9, 8, 7, 6, 5].map(m => ({ created_at: ago(m * 60_000) }));
    const r = await call("refund", refundBody());
    expect(r).toMatchObject({ status: 429, body: { code: "ADMIN_PIN_LOCKED" } });
    expect(h.order).toEqual([]);
    const q = h.from.find(x => x.table === "ops_audit_log")!;
    expect(q.calls).toEqual(expect.arrayContaining([["eq", "action", "admin_pin_failed"], ["eq", "actor_user_id", ADMIN]]));
    // 잠금 계산: 5번째 실패 + 15분까지, 그 뒤 풀린다.
    const t0 = 1_000_000_000_000, f = [0, 1, 2, 3, 4].map(m => t0 + m * 60_000);
    expect(adminPinLockedUntil(f, t0 + 5 * 60_000)).toBe(t0 + 19 * 60_000);
    expect(adminPinLockedUntil(f, t0 + 19 * 60_000)).toBeNull();
    expect(adminPinLockedUntil([0, 4, 8, 12, 16].map(m => t0 + m * 60_000), t0 + 17 * 60_000)).toBeNull(); // 16분에 걸친 5번
  });
  it("오래된 실패는 잠그지 않는다(맞는 PIN이면 진행)", async () => {
    h.pinFailures = [40, 39, 38, 37, 36].map(m => ({ created_at: ago(m * 60_000) }));
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 1, pin: PIN })).status).toBe(200);
  });
});

describe("환불 2단계 확인 + 하루 상한", () => {
  it("사유가 없거나 200자를 넘으면 거절", async () => {
    for (const reason of ["", "   ", "가".repeat(201)]) expect((await call("refund", refundBody({ reason }))).status).toBe(400);
    expect(h.order).toEqual([]);
  });
  it("주문코드를 정확히 다시 입력하지 않으면 거절(대소문자·다른 코드·빈 값)", async () => {
    for (const over of [{ confirmCode: "" }, { confirmCode: "GR-ABCE" }, { orderCode: "gr-abcd", confirmCode: "gr-abcd" }, { confirmCode: "GR-ABCD " }]) {
      const r = await call("refund", refundBody(over));
      expect(r.status).toBe(400);
      expect(r.body.code).toBe("CONFIRM_MISMATCH");
    }
    expect(h.order).toEqual([]);
  });
  it("결제 완료가 아니면 거절", async () => {
    setDetail({ status: "refunded" });
    expect((await call("refund", refundBody())).status).toBe(409);
    expect(h.order).toEqual([]);
  });
  it("확인되면 요청 저장 → 그 1건을 바로 처리, 감사 로그", async () => {
    const r = await call("refund", refundBody());
    expect(r).toMatchObject({ status: 200, cache: "no-store", body: { ok: true, state: "done" } });
    expect(h.order[0]).toMatchObject({ action: "refund_request", data: { paymentOrderId: "po_1", source: "admin", reason: "고객 요청", actorUserId: ADMIN, capCount: 5, capAmount: 50000 } });
    expect(h.order.map(x => x.action)).toEqual(["refund_request", "refund_claim", "refund_finish"]);
    expect(h.order[1].data).toEqual({ paymentOrderId: "po_1" });
    expect(h.cancels).toBe(1);
    expect(auditOf("refund_request")[0]).toMatchObject({ actor: "admin", actorUserId: ADMIN, target: "GR-ABCD" });
    // 오늘(한국 날짜) 관리자 환불만 센다.
    const day = kstDayRange();
    expect(h.from.find(x => x.table === "order_refunds")!.calls).toEqual(expect.arrayContaining([["eq", "source", "admin"], ["gte", "created_at", day.start], ["lt", "created_at", day.end]]));
  });
  it("오늘 5건이면(기본 상한) 막고 refund_blocked_cap 감사 로그", async () => {
    h.todayRefunds = Array.from({ length: 5 }, () => ({ amount: 1490 }));
    const r = await call("refund", refundBody());
    expect(r).toMatchObject({ status: 429, body: { code: "REFUND_DAILY_CAP" } });
    expect(h.order).toEqual([]);
    expect(auditOf("refund_blocked_cap")[0]).toMatchObject({ target: "GR-ABCD", detail: { todayCount: 5, maxCount: 5, maxAmount: 50000 } });
  });
  it("금액 상한(기본 50,000원)을 넘으면 막고, 환경값으로 올리면 통과", async () => {
    h.todayRefunds = [{ amount: 49_000 }];
    expect((await call("refund", refundBody())).body.code).toBe("REFUND_DAILY_CAP");
    vi.stubEnv("ADMIN_REFUND_DAILY_MAX_AMOUNT", "100000");
    expect((await call("refund", refundBody())).status).toBe(200);
  });
  it("토스 비밀키가 없으면 요청만 남기고(requested) 분명한 오류", async () => {
    vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "");
    const r = await call("refund", refundBody());
    expect(r.status).toBe(503);
    expect(r.body).toMatchObject({ ok: false, code: "TOSS_SECRET_MISSING", state: "requested" });
    expect(h.order.map(x => x.action)).toEqual(["refund_request"]);
  });
});

describe("개인정보 가림·보기·내보내기", () => {
  it("가림 형식", () => {
    expect(maskEmail("hong@example.com")).toBe("ho***@ex***.com");
    expect(maskPhone("01012345678")).toBe("010-****-5678");
  });
  it("보기는 PIN 없이, 감사 로그(pii_view)를 남긴 뒤에만 값을 준다", async () => {
    expect((await call("reveal", { orderCode: "GR-ABCD", field: "email" })).body).toMatchObject({ ok: true, value: "hong@example.com" });
    expect((await call("reveal", { orderCode: "GR-ABCD", field: "phone" })).body).toMatchObject({ ok: true, value: "01012345678" });
    expect(auditOf("pii_view").map(a => [a.target, a.detail])).toEqual([["GR-ABCD", { field: "email" }], ["GR-ABCD", { field: "phone" }]]);
    expect((await call("reveal", { orderCode: "GR-ABCD", field: "name" })).status).toBe(400);
    h.auditOk = false;
    const r = await call("reveal", { orderCode: "GR-ABCD", field: "email" });
    expect(r.status).toBe(503);
    expect(r.body.value).toBeUndefined();
  });
  it("CSV 내보내기: PIN 필요, 이메일·전화는 가린 값만, 수식 주입 방지, 감사 로그", async () => {
    expect((await call("export", { q: "GR", pin: "nope" })).status).toBe(403);
    const res = await send("export", { q: "GR", pin: PIN });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("cache-control")).toBe("no-store");
    const csv = await res.text();
    expect(csv).toContain("ho***@ex***.com");
    expect(csv).toContain("010-****-5678");
    expect(csv).not.toContain("hong@example.com");
    expect(csv).not.toContain("01012345678");
    expect(h.rpc.find(x => x.fn === "ops_admin" && x.args.p_action === "search")?.args.p_data).toMatchObject({ q: "GR", limit: 200 });
    expect(auditOf("orders_export")[0]).toMatchObject({ target: "orders:export", detail: { count: 1 } });
    const row = { orderCode: "GR-ABCD", paymentOrderId: "po_1", providerOrderId: "=cmd|' /C calc'!A0", productType: "saju_mbti_full", amount: 1490, paymentStatus: "paid", createdAt: "2026-11-04T01:00:00Z", paidAt: null } as unknown as OrderRow;
    expect(ordersCsv([row])).toContain(`"'=cmd|' /C calc'!A0"`);
  });
});

describe("다른 작업", () => {
  it("재생성: 공개 전 확인 필요 → admin_retry, 공개된 Book → 교체 레인", async () => {
    setDetail({}, { book: { status: "FAILED_REQUIRES_ATTENTION", publishedAt: null }, job: { status: "FAILED_REQUIRES_ATTENTION" } });
    expect((await call("regenerate", { orderCode: "GR-ABCD" })).body).toMatchObject({ ok: true, mode: "retry" });
    expect(h.reliability).toEqual([{ action: "admin_retry", data: { reportId: "report_1" } }]);
    setDetail();
    expect((await call("regenerate", { orderCode: "GR-ABCD" })).body).toMatchObject({ ok: true, mode: "replace" });
    expect(h.generation).toEqual([{ action: "regenerate", data: { reportId: "report_1" } }]);
    expect(h.audit.map(a => a.action)).toEqual(["admin_retry", "admin_regenerate"]);
  });
  it("이용권: 비회원 주문 거절, 회원은 1~3장 manual 지급(같은 requestId면 같은 key)", async () => {
    setDetail({ userId: null });
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 1, pin: PIN })).status).toBe(409);
    setDetail();
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 4, pin: PIN })).status).toBe(400);
    const id = "55555555-5555-4555-8555-555555555555";
    expect((await call("grant", { orderCode: "GR-ABCD", quantity: 2, requestId: id, pin: PIN })).status).toBe(200);
    expect(h.rpc.find(x => x.fn === "report_tickets")?.args).toEqual({ p_action: "grant", p_user: BUYER,
      p_data: { quantity: 2, sourceType: "manual", sourceRef: `admin:GR-ABCD:${id}`, key: `admin:${id}`, reason: "ADMIN_GRANT" } });
  });
  it("OpenAI 다시 켜기", async () => {
    expect((await call("provider-enable", {})).status).toBe(200);
    expect(h.generation).toEqual([{ action: "provider_set", data: { provider: "openai", disabled: false } }]);
    expect(h.audit[0]).toMatchObject({ action: "provider_enable" });
  });
});
