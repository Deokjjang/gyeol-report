// v5 최종3 9(PGlite): 이용권 30일·선물 기한 승계·관리자 지급 30일·이용권 묶음 표시, v5 Book 열람 기한 없음(버전 필드). 목업 LLM, 외부 호출 0.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { randomUUID } from "node:crypto";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { runPaidReportJob, type PaidV5Builder } from "@/lib/payment/paidReportReliability";
import { WRITER_DISABLED_RUNTIME as runtime } from "@/lib/report-generation/writerDisabled";
import { runPaidV5Job, type PaidJobOps } from "@/lib/ops/generation/paidJob";
import { afterPaidOrder, newGiftToken } from "@/lib/ops/gift/service";
import { processRefunds } from "@/lib/ops/orders/refund";
import type { RefundProvider } from "@/lib/payment/tossRefundClient";
import { compConfig, compSyncArgs, giftEventConfig, TICKET_VALID_DAYS } from "@/lib/ops/config";
import { libraryItem, reportAccessOpen } from "@/lib/library/model";
import { projectV5Book } from "@/lib/writer/book";
import { AI_WRITTEN_NOTICE_KO } from "@/lib/legal/aiNotice";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import { seedPaid } from "../../helpers/paidWorkerSql";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { mockAnthropic } from "../../helpers/opsMocks";

type H = Awaited<ReturnType<typeof opsSql>>;
type Call = { call(a: string, d?: Record<string, unknown>): Promise<Record<string, unknown>> };
let h: H, gift: Call, comp: Call, order: Call;
const C = "66666666-6666-4666-8666-666666666666", D = "77777777-7777-4777-8777-777777777777";
const policyAt = "2026-10-27T03:00:00.000Z";
const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(payload, policyAt);
const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); const r = (await h.db.query(sql, params)).rows[0] as T; await h.db.exec("set role service_role"); return r; };
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const rpcOf = (fn: string): Call => ({ call: (a, d = {}) => h.rpc(fn, a, d) });
const days = (sql: string, params: unknown[]) => one<{ d: number }>(`select round(extract(epoch from x)/86400)::int d from (${sql}) t(x)`, params).then(r => r.d);
async function pay(id: string, user: string | null) {
  await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 1490, inputSnapshot: { reportInputPayload: payload } });
  await order.call("attach", { paymentOrderId: id, ...(user ? { userId: user } : {}), name: "회원", email: `${id}@example.com` });
  const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 1490 });
  await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
}
const providerOf = (): RefundProvider => ({
  lookup: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: i.originalAmount, status: "DONE", method: "카드", isPartialCancelable: true, cancels: [] } }),
  cancel: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: 0, status: "CANCELED", method: "카드", isPartialCancelable: true,
    cancels: [{ transactionKey: "tx", cancelAmount: i.amount, cancelReason: i.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString() }] } }),
});
const refundOps = () => ({ order, audit: async () => true });
const contact = (u: string) => exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed') on conflict do nothing", [u, `${u.slice(0, 4)}@example.com`]);

beforeAll(async () => {
  h = await opsSql();
  gift = rpcOf("ops_gift"); comp = rpcOf("ops_comp"); order = rpcOf("ops_order");
  await exec("insert into auth.users(id) values($1),($2)", [C, D]);
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("이용권 유효기간 30일(최종3)", () => {
  it("서버 설정: 이벤트·보상 A·B 모두 30일 고정(예전 유효일 설정값은 무시)", () => {
    expect(TICKET_VALID_DAYS).toBe(30);
    const now = Date.parse("2026-11-10T00:00:00Z");
    expect(giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-01T00:00:00Z", GIFT_EVENT_END: "2026-12-01T00:00:00Z", GIFT_EVENT_VALID_DAYS: "90" }, now).validDays).toBe(30);
    expect(compSyncArgs(compConfig({ COMP_A_VALID_DAYS: "60", COMP_B_VALID_DAYS: "45" }))).toMatchObject({ aDays: 30, bDays: 30 });
  });

  it("이벤트 이용권(1+1): 서버가 30일을 넘겨 보내도 30일, 선물하면 받은 친구 이용권은 처음 발급 기한 그대로", async () => {
    const cfg = { active: true, start: "2026-01-01T00:00:00.000Z", end: "2027-01-01T00:00:00.000Z", maxPerAccount: 2, bonusMax: 2, products: ["saju_mbti_full"], validDays: 90 };
    await pay("f3g1", A);
    expect((await afterPaidOrder(gift as never, "f3g1", cfg))?.issued).toMatchObject({ issued: true });
    expect(await days("select expires_at-created_at from gift_rewards where source_order_id=$1", ["f3g1"])).toBe(30);
    // 선물 링크를 늦게 받아도(남은 기한 5일로 당김) 받은 이용권 기한 = 선물의 처음 기한.
    await exec("update gift_rewards set expires_at=now()+interval '5 days' where source_order_id='f3g1'");
    const w = await one<{ id: string; e: string }>("select id,expires_at::text e from gift_rewards where source_order_id='f3g1'");
    const link = newGiftToken();
    expect(await gift.call("link", { userId: A, giftId: w.id, tokenHash: link.hash })).toMatchObject({ ok: true, status: "gifted" });
    expect(await gift.call("peek", { userId: B, tokenHash: link.hash })).toMatchObject({ ok: true, status: "gifted", expiresAt: expect.any(String) });
    await contact(B);
    expect(await gift.call("claim", { userId: B, tokenHash: link.hash })).toMatchObject({ ok: true, status: "claimed" });
    expect(await one("select expires_at::text e from report_ticket_grants where user_id=$1 and reason='EVENT_GIFT_RECEIVED'", [B])).toEqual({ e: w.e });
    // 선물 받은 친구(B)의 첫 결제 → 보낸 사람 보너스 1장도 발급일로부터 30일.
    await pay("f3g2", B);
    expect((await afterPaidOrder(gift as never, "f3g2", cfg))?.bonus).toMatchObject({ granted: true });
    expect(await days("select expires_at-granted_at from report_ticket_grants where user_id=$1 and reason='EVENT_GIFT_BONUS'", [A])).toBe(30);
  });

  it("보상 이용권 A: 설정 유효일이 60일이어도 30일", async () => {
    await pay("f3c1", C);
    await order.call("refund_request", { paymentOrderId: "f3c1", source: "admin", reason: "시험" });
    expect(await processRefunds(refundOps() as never, providerOf(), { paymentOrderId: "f3c1" })).toEqual([{ paymentOrderId: "f3c1", state: "done" }]);
    expect(await comp.call("designate", { providerOrderId: "f3c1" })).toMatchObject({ ok: true, userId: C });
    await contact(C);
    expect(await comp.call("sync", { userId: C, enabled: true, aQty: 2, aDays: 60, bQty: 1, bDays: 30, products: ["saju_mbti_full"] })).toMatchObject({ ok: true, tier: "A", state: "granted", quantity: 2 });
    const rows = (await h.db.query<{ d: number }>("select round(extract(epoch from expires_at-created_at)/86400)::int d from gift_rewards where owner_user_id=$1 and kind='comp'", [C])).rows;
    expect(rows.map(r => r.d)).toEqual([30, 30]);
  });

  it("관리자 지급(기한 없이 요청)은 30일, 같은 요청을 다시 보내도 한 번만(멱등) · 서재 표시용 묶음(장수·만료일)", async () => {
    const data = { quantity: 2, sourceType: "manual", sourceRef: "admin:GR-TEST:1", key: `admin:${randomUUID()}`, reason: "ADMIN_GRANT" };
    const first = await h.rpc("report_tickets", "grant", D, data);
    expect(first).toMatchObject({ ok: true, grantId: expect.any(String) });
    expect(await h.rpc("report_tickets", "grant", D, data)).toMatchObject({ ok: true, grantId: first.grantId });
    expect(await days("select expires_at-granted_at from report_ticket_grants where id=$1", [first.grantId])).toBe(30);
    const summary = await h.rpc("report_tickets", "summary", D, {});
    expect(summary).toMatchObject({ ok: true, quantity: 2, lots: [{ quantity: 2, expiresAt: expect.any(String) }] });
    // 구매 이용권은 그대로(기한 없음).
    expect(await h.rpc("report_tickets", "grant", D, { quantity: 1, sourceType: "purchase", sourceRef: "bundle:t", key: "bundle:t", reason: "PAID_BUNDLE_TEST" })).toMatchObject({ ok: true });
    expect(await one("select expires_at from report_ticket_grants where user_id=$1 and source_type='purchase'", [D])).toEqual({ expires_at: null });
  });
});

describe("열람 기간(최종3): v5 Book은 기한 없음, v5 이전은 90일", () => {
  it("결제 경로 v5 정식본 발행 → expires_at='infinity'(입력도 같이), 만료 작업이 건드리지 않는다", async () => {
    process.env.WRITER_V5_PRODUCTS = "saju_mbti_full";
    try {
      const ops: PaidJobOps = { generation: rpcOf("ops_generation"), order, audit: async () => true } as never;
      const m = mockAnthropic([{ text }]);
      const builder: PaidV5Builder = async (job, finish) => ({ settled: await runPaidV5Job({ ...job, policyAt }, finish, { ops, env: { openAiKey: null, deps: { fetchImpl: m.fetch, sleep: async () => undefined, people: async () => [], apiKey: "test-key" } } as never }) });
      const reportId = await seedPaid(h.paid, "f3p1", payload);
      // 앞 시험의 결제 주문(이벤트 확인용) 작업은 뒤로 미뤄 이 Book만 만든다.
      await exec("update report_generation_jobs set next_retry_at=now()+interval '1 day' where report_id<>$1 and status in ('QUEUED','RETRYING')", [reportId]);
      expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, builder)).toMatchObject({ ok: true, status: "COMPLETED" });
      expect(await one("select status,snapshot_json->>'productVersion' v,expires_at::text e from paid_report_snapshots where report_id=$1", [reportId])).toEqual({ status: "COMPLETED", v: "v5", e: "infinity" });
      expect(await one("select expires_at::text e from report_input_snapshots where order_id='f3p1'")).toEqual({ e: "infinity" });
      await h.paid.call("expire", {});
      expect(await one("select status from paid_report_snapshots where report_id=$1", [reportId])).toEqual({ status: "COMPLETED" });
      expect(await one("select count(*)::int n from report_input_snapshots where order_id='f3p1'")).toEqual({ n: 1 });
      // 책 끝 AI 작성 고지(읽을 때만 붙고 저장본은 그대로).
      const stored = await one<{ s: ProductPreviewSnapshot }>("select snapshot_json s from paid_report_snapshots where report_id=$1", [reportId]);
      expect(JSON.stringify(stored.s)).not.toContain(AI_WRITTEN_NOTICE_KO);
      expect(projectV5Book(stored.s)?.pages.at(-1)).toMatchObject({ kind: "back", aiNotice: AI_WRITTEN_NOTICE_KO });
      // 서재 표시: 기한 없음 = 열린 책.
      expect(reportAccessOpen("infinity")).toBe(true);
      expect(libraryItem({ reportId, productType: "saju_mbti_full", displayName: "하람", selectedYear: null, publishedAt: new Date().toISOString(), expiresAt: "infinity", reportVersion: "v5", status: "available" })?.status).toBe("available");
    } finally { delete process.env.WRITER_V5_PRODUCTS; }
  }, 180_000);

  it("v5 이전 Book은 처음 발행 + 2160시간 그대로, 기한 없음으로 바꿀 수 없다", async () => {
    const reportId = await seedPaid(h.paid, "f3p2", payload);
    await exec("update paid_report_snapshots set status='COMPLETED',snapshot_json=$2::jsonb,published_at=now(),expires_at=now()+interval '2160 hours',gate_version='paid-report-v1' where report_id=$1",
      [reportId, JSON.stringify({ reportId, productVersion: "v4" })]);
    expect(await one("select expires_at=published_at+interval '2160 hours' ok from paid_report_snapshots where report_id=$1", [reportId])).toEqual({ ok: true });
    await expect(exec("update paid_report_snapshots set expires_at='infinity' where report_id=$1", [reportId])).rejects.toThrow(/REPORT_ACCESS_VERSION_REQUIRED/);
    // 탈퇴(열람 종료)는 v5 Book에도 그대로: 상태 EXPIRED·원고 비움(기한 값은 남아도 열리지 않는다).
    const v5 = await seedPaid(h.paid, "f3p3", payload);
    await exec("update paid_report_snapshots set status='COMPLETED',snapshot_json=$2::jsonb,published_at=now(),expires_at=now()+interval '2160 hours',gate_version='paid-report-v1' where report_id=$1",
      [v5, JSON.stringify({ reportId: v5, productVersion: "v5" })]);
    expect(await one("select expires_at::text e from paid_report_snapshots where report_id=$1", [v5])).toEqual({ e: "infinity" });
    await exec("update paid_report_snapshots set status='EXPIRED',snapshot_json=null where report_id=$1", [v5]);
    expect(await one("select status,snapshot_json from paid_report_snapshots where report_id=$1", [v5])).toEqual({ status: "EXPIRED", snapshot_json: null });
  });
});
