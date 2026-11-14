// W3 P2 환불 규칙(D9) — migration 20261114120000(PGlite, 외부 호출 0): 결제가 환불되면 그 주문의 증정 이용권 중
// 「내가 쓰기」로 원장에 옮겨 아직 안 쓴 장만 거둔다(EXPIRE · REFUND_REVOKE · 증정 revoked). 이미 책을 만든 장은 그대로. 자동·관리자(refund_finish)·외부 환불 모두.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { processRefunds } from "@/lib/ops/orders/refund";
import type { RefundProvider } from "@/lib/payment/tossRefundClient";
import { opsNotifySql } from "../../helpers/opsNotify";
import { TICKET_A as A } from "../../helpers/ticketPublicationSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";

const MIGRATIONS = ["supabase/migrations/20261114100000_v5_w3_safety.sql", "supabase/migrations/20261114120000_v5_w3_refund_revoke_self.sql"];
const C = "66666666-6666-4666-8666-666666666666";
let h: Awaited<ReturnType<typeof opsNotifySql>>;
const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
const provider: RefundProvider = {
  lookup: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: i.originalAmount, status: "DONE", method: "카드", isPartialCancelable: true, cancels: [] } }),
  cancel: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: 0, status: "CANCELED", method: "카드", isPartialCancelable: true,
    cancels: [{ transactionKey: "tx", cancelAmount: i.amount, cancelReason: i.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString() }] } }),
};
/** 결제 주문 하나 + 그 주문의 증정 이용권 1장을 「내가 쓰기」로 원장에 옮긴다. 돌려준다: 증정 id·원장 묶음 id. */
async function paidWithSelfTicket(id: string, user: string) {
  await h.pay(id, user);
  const g = await h.one<{ id: string }>("insert into gift_rewards(owner_user_id,source_order_id,status,expires_at) values($1,$2,'available',now()+interval '30 days') returning id", [user, id]);
  expect(await gift.call("use_self", { userId: user, giftId: g.id })).toMatchObject({ ok: true, status: "used_self" });
  const lot = await h.one<{ id: string }>("select id from report_ticket_grants where source_ref=$1", [`gift-self:${g.id}`]);
  return { giftId: g.id, lotId: lot.id };
}
const left = async (lotId: string) => (await h.one<{ n: number }>("select coalesce(sum(quantity_delta),0)::int n from report_ticket_ledger where grant_id=$1", [lotId])).n;
const revokes = async (lotId: string) => h.all<{ quantity_delta: number; reason: string }>("select quantity_delta,reason from report_ticket_ledger where grant_id=$1 and event_type='EXPIRE'", [lotId]);
const statusOf = async (giftId: string) => (await h.one<{ status: string }>("select status from gift_rewards where id=$1", [giftId])).status;
const ops = () => ({ order: h.order, audit: (e: { actor: "admin" | "system"; action: string; target: string; detail?: Record<string, unknown> }) => h.audit(e) });

beforeAll(async () => {
  h = await opsNotifySql({ freeBook: true });
  await h.asOwner(async () => { for (const f of MIGRATIONS) await h.db.exec(readFileSync(f, "utf8")); });
  await h.exec("insert into auth.users(id) values($1) on conflict do nothing", [C]);
}, 240_000);
afterAll(async () => { await h?.db.close(); });

describe("환불 → 안 쓴 「내가 쓰기」 이용권 회수(D9)", () => {
  it("자동 환불(refund_finish): 원장에 옮겨 안 쓴 1장은 EXPIRE −1(REFUND_REVOKE)·증정 revoked, 다시 불러도 한 번만", async () => {
    const { giftId, lotId } = await paidWithSelfTicket("rv1", A);
    expect(await left(lotId)).toBe(1);
    expect(await h.order.call("refund_request", { paymentOrderId: "rv1", source: "auto", reason: "30분 안에 책을 완성하지 못해 자동 환불" })).toMatchObject({ ok: true });
    expect(await processRefunds(ops(), provider, { paymentOrderId: "rv1" })).toEqual([{ paymentOrderId: "rv1", state: "done" }]);
    expect(await left(lotId)).toBe(0);
    expect(await revokes(lotId)).toEqual([{ quantity_delta: -1, reason: "REFUND_REVOKE" }]);
    expect(await statusOf(giftId)).toBe("revoked");
    // 같은 주문의 상태를 다시 건드려도(이미 refunded) 두 번 거두지 않는다.
    await h.exec("update payment_orders set status='refunded' where payment_order_id='rv1'");
    expect(await revokes(lotId)).toHaveLength(1);
  });

  it("이미 그 이용권으로 책을 만들었으면(REDEEM) 그대로 둔다 — 증정은 used_self, 회수 기록 없음", async () => {
    const { giftId, lotId } = await paidWithSelfTicket("rv2", C);
    const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date("2026-10-27T03:00:00.000Z") });
    if (!n.ok) throw new Error("payload");
    const r = await h.queue.call("enqueue", C, { requestId: randomUUID(), input: n.value, productType: n.value.productKey, inputHash: createHash("sha256").update(JSON.stringify(n.value)).digest("hex"),
      reportId: `report_${randomUUID().replaceAll("-", "")}`, policyAt: "2026-10-27T03:00:00.000Z", consentEvidence: { version: "checkout-consent-v1" }, displayName: "검수" });
    expect(r.ok).toBe(true);
    expect(await left(lotId)).toBe(0); // 이 사람의 원장 이용권은 이 1장뿐 → 접수가 이 장을 썼다
    expect(await h.order.call("refund_request", { paymentOrderId: "rv2", source: "admin", reason: "시험" })).toMatchObject({ ok: true });
    expect(await processRefunds(ops(), provider, { paymentOrderId: "rv2" })).toEqual([{ paymentOrderId: "rv2", state: "done" }]);
    expect(await statusOf(giftId)).toBe("used_self");
    expect(await revokes(lotId)).toEqual([]);
  });

  it("외부 환불 기록(external_refund)도 같은 규칙: 안 쓴 「내가 쓰기」 장을 거둔다", async () => {
    const { giftId, lotId } = await paidWithSelfTicket("rv3", A);
    expect(await h.recon.call("external_refund", { paymentOrderId: "rv3", amount: 3900, adminUserId: A })).toMatchObject({ ok: true });
    expect(await left(lotId)).toBe(0);
    expect(await statusOf(giftId)).toBe("revoked");
  });

  it("다른 주문의 이용권·환불 아닌 상태 변화는 건드리지 않는다", async () => {
    const { giftId, lotId } = await paidWithSelfTicket("rv4", A);
    await h.exec("update payment_orders set updated_at=now() where payment_order_id='rv4'");
    expect(await left(lotId)).toBe(1); expect(await statusOf(giftId)).toBe("used_self");
  });
});
