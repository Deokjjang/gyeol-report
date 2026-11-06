// 배포 명령 직후 결함(2026-11-06): ops_gift('pending_orders')가 변수·별칭 충돌로 늘 실패하던 것 → 별칭 고침 migration. PGlite, 외부 호출 0.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { afterPaidOrder } from "@/lib/ops/gift/service";
import { giftEventConfig } from "@/lib/ops/config";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";

const FINAL4 = "supabase/migrations/20261106100000_v5_final4_event_comp.sql";
const FIX = "supabase/migrations/20261106200000_v5_deploy_gift_pending_alias.sql";
let h: Awaited<ReturnType<typeof opsSql>>;
const MEMBER = "00000000-0000-4000-8000-000000000301";
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const cfg = giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-06 09:00:00", GIFT_EVENT_END: "2030-12-31 23:59:59" });
const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };

beforeAll(async () => {
  h = await opsSql();
  await h.db.exec(`reset role; ${readFileSync(FINAL4, "utf8")} set role service_role;`);
  await exec("insert into auth.users(id) values($1)", [MEMBER]);
  await exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원','m301@example.com','typed')", [MEMBER]);
  await exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원','kakao')", [MEMBER]);
  const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date() }); if (!n.ok) throw new Error("payload"); return n.value; })();
  const order = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_order", a, d) };
  for (const [id, member] of [["dp-member-1", true], ["dp-guest-1", false]] as const) {
    await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 3900, inputSnapshot: { reportInputPayload: payload } });
    await order.call("attach", { paymentOrderId: id, userId: member ? MEMBER : null, name: "회원", email: `${id}@example.com` });
    const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 3900 });
    await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
  }
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("ops_gift pending_orders(이벤트 이용권 보조 발급 크론)", () => {
  it("고치기 전: 변수 o·x와 별칭이 부딪혀 실패(운영에서 본 오류 그대로)", async () => {
    await expect(gift.call("pending_orders", { start: cfg.start, end: cfg.end })).rejects.toThrow(/is ambiguous/);
  });
  it("고친 뒤: 기간 안 회원 결제 주문만 돌려주고, 발급하면(gift_checked_at) 다시 나오지 않는다. 다시 실행해도 된다", async () => {
    for (let i = 0; i < 2; i++) await h.db.exec(`reset role; ${readFileSync(FIX, "utf8")} set role service_role;`);
    expect(await gift.call("pending_orders", { start: cfg.start, end: cfg.end })).toEqual({ ok: true, orders: ["dp-member-1"] }); // 비회원 주문은 대상 아님
    expect(await gift.call("pending_orders", { start: "2030-01-01T00:00:00Z", end: "2031-01-01T00:00:00Z" })).toEqual({ ok: true, orders: [] }); // 기간 밖
    expect((await afterPaidOrder(gift, "dp-member-1", cfg))?.issued).toMatchObject({ issued: true });
    expect(await gift.call("pending_orders", { start: cfg.start, end: cfg.end })).toEqual({ ok: true, orders: [] });
  });
});
