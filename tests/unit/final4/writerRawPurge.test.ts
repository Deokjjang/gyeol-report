// 최종 A-18(PGlite): ops_writer_raw 작업용 원문 사본 정리 — 발행 완료 30일 뒤, 발행 실패는 처리 완료 30일 뒤. 외부 호출 0.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";

type H = Awaited<ReturnType<typeof opsSql>>;
let h: H;
const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date("2026-10-27T03:00:00.000Z") }); if (!n.ok) throw new Error("payload"); return n.value; })();
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const count = async (id: string) => { await h.db.exec("reset role"); const r = (await h.db.query<{ n: number }>("select count(*)::int n from public.ops_writer_raw where report_id=$1", [id])).rows[0].n; await h.db.exec("set role service_role"); return r; };
async function order(id: string) {
  await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 3900, inputSnapshot: { reportInputPayload: payload } });
  const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 3900 });
  await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
  await h.db.exec("reset role");
  const r = (await h.db.query<{ report_id: string }>("select report_id from public.paid_report_snapshots where order_id=$1", [id])).rows[0].report_id;
  await h.db.exec("set role service_role");
  return r;
}
const raw = (reportId: string, ageDays: number) => exec(`insert into public.ops_writer_raw(report_id, raw_key, kind, entry, created_at) values ($1, $2, 'writer', '{"key":"k"}'::jsonb, now() - make_interval(days => $3))`, [reportId, `key-${reportId.slice(-8)}-${ageDays}`, ageDays]);
const publish = (reportId: string, ageDays: number) => exec(`update public.paid_report_snapshots set status='COMPLETED', snapshot_json='{"productVersion":"v5"}'::jsonb, gate_version='paid-report-v1', published_at=now() - make_interval(days => $2), expires_at='infinity' where report_id=$1`, [reportId, ageDays]);

beforeAll(async () => {
  h = await opsSql();
  await h.db.exec(`reset role; ${readFileSync("supabase/migrations/20261105160000_v5_final3_writer_raw.sql", "utf8")} ${readFileSync("supabase/migrations/20261106180000_v5_final4_writer_raw_purge.sql", "utf8")} set role service_role;`);
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("A-18 raw_purge", () => {
  it("발행 31일 전 → 지움, 발행 29일 전 → 둠, 진행 중 → 둠, 실패 처리 31일 전 → 지움, 실패 처리 10일 전 → 둠", async () => {
    const oldPub = await order("po_raw_old_pub"), newPub = await order("po_raw_new_pub"), running = await order("po_raw_running"), oldFail = await order("po_raw_old_fail"), newFail = await order("po_raw_new_fail");
    await publish(oldPub, 31); await raw(oldPub, 40);
    await publish(newPub, 29); await raw(newPub, 40);
    await raw(running, 60);
    await exec("update public.report_generation_jobs set status='FAILED_REQUIRES_ATTENTION' where report_id = any($1)", [[oldFail, newFail]]);
    await raw(oldFail, 31); await raw(newFail, 10);
    const r = await h.rpc("ops_writer_raw", "raw_purge", {});
    expect(r).toMatchObject({ ok: true, deleted: 2 });
    expect(await Promise.all([oldPub, newPub, running, oldFail, newFail].map(count))).toEqual([0, 1, 1, 0, 1]);
    // 다시 돌려도 더 지우지 않는다.
    expect(await h.rpc("ops_writer_raw", "raw_purge", {})).toMatchObject({ ok: true, deleted: 0 });
  });
  it("환불된 주문(발행 전)은 환불 시각 30일 뒤", async () => {
    const id = await order("po_raw_refund");
    await raw(id, 45);
    await exec("update public.payment_orders set status='refunded', refunded_at=now() - interval '5 days' where payment_order_id='po_raw_refund'");
    expect(await h.rpc("ops_writer_raw", "raw_purge", {})).toMatchObject({ deleted: 0 });
    await exec("update public.payment_orders set refunded_at=now() - interval '31 days' where payment_order_id='po_raw_refund'");
    expect(await h.rpc("ops_writer_raw", "raw_purge", {})).toMatchObject({ deleted: 1 });
  });
  it("anon·authenticated는 부를 수 없다(service_role만)", async () => {
    await h.db.exec("reset role");
    const r = (await h.db.query<{ a: boolean; u: boolean }>("select has_function_privilege('anon','public.ops_writer_raw(text,jsonb)','execute') a, has_function_privilege('authenticated','public.ops_writer_raw(text,jsonb)','execute') u")).rows[0];
    await h.db.exec("set role service_role");
    expect(r).toEqual({ a: false, u: false });
  });
});
