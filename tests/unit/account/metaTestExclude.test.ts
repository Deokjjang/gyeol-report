// F 추가 3(2026-11-10): 시험 계정(ops_test_user)의 메타 서버 전송·브라우저 거울을 DB 트리거·전송 단계에서 막는다(결제 승인 코드 무변경).
// migration 20261111091000. PGlite 격리(외부 호출 0) — 메타 시험(metaRegistration)과 같은 준비 + 운영과 같은 ops_test_user.
import { readFileSync } from "node:fs";
import { createHash, randomUUID, randomBytes } from "node:crypto";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import type { PGlite } from "@electric-sql/pglite";
import { sqlCouponReliability } from "../../../src/lib/coupons/localDatabase";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { launchSql, launchHelpers, START } from "../../helpers/launchEventSql";

const AFTER = "2026-12-09T15:00:00Z";
let db: PGlite, h: ReturnType<typeof launchHelpers>;
const browser = () => randomBytes(32).toString("hex");
const read = (f: string) => readFileSync(`supabase/migrations/${f}`, "utf8").replaceAll("clock_timestamp()", "public.launch_test_now()");
async function consent(id: string | null, agreed = true, key = browser()) {
  await db.query("select record_meta_consent($1,$2,$3,'meta-20261020-v2','192.0.2.1','isolated-test')", [id, key, agreed]); return key;
}
const batch = async (action = "claim", event: string | null = null, lease: string | null = null) => (await db.query<{ r: unknown }>("select meta_delivery_batch($1,$2,$3) r", [action, event, lease])).rows[0].r;
const markTest = (ids: string[]) => db.query("insert into public.ops_settings(key,value) values('test_accounts',$1::jsonb) on conflict (key) do update set value=excluded.value", [JSON.stringify({ ids })]);
async function paidOrder(user: string | null) {
  const paid = sqlCouponReliability(db), order = `meta-${randomUUID()}`, payload = RUNTIME_FIXTURES[0].payload;
  expect((await paid.call("create_order", { paymentOrderId: order, providerOrderId: order, productType: payload.productKey, provider: "toss", amount: 3900, inputSnapshot: { reportInputPayload: payload } })).ok).toBe(true);
  if (user) await db.query("insert into report_purchase_bindings(order_id,buyer_id) values($1,$2)", [order, user]);
  const done = await confirmPaidReport({ orderId: order, paymentKey: `MOCK_${order}`, amount: 3900 }, paid, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: order, amount: 3900, status: "DONE" } }));
  expect(done.ok).toBe(true);
  return { order, report: String(done.reportId ?? "") };
}
const rows = async (order: string) => (await db.query<{ event_id: string; user_id: string }>("select event_id,user_id from meta_conversion_outbox where order_id=$1", [order])).rows;

beforeAll(async () => {
  ({ db, h } = await launchSql());
  await db.exec(read("20261020062611_v4_meta_registration_delivery.sql")); await db.exec(read("20261107120000_v5_meta_purchase_paid.sql"));
  await db.exec("create table if not exists public.account_contacts(user_id uuid primary key references auth.users(id), email text not null, phone text)");
  await db.exec(read("20261110100000_v5_meta_default_measurement.sql"));
  // 운영 ops_test_user(20261110200000)와 같은 정의(표·함수만).
  await db.exec(`create table if not exists public.ops_settings(key text primary key, value jsonb not null, updated_at timestamptz not null default now());
    create or replace function public.ops_test_user(p_user uuid) returns boolean language sql stable set search_path='' as $$
      select p_user is not null and coalesce((select jsonb_typeof(s.value->'ids')='array' and s.value->'ids' ? p_user::text from public.ops_settings s where s.key='test_accounts'), false); $$;`);
  // 같은 migration을 두 번 올리면 앵커가 없어 실패한다(이중 적용 방지) — 한 번만.
  await db.exec(read("20261111091000_v5_meta_test_exclude.sql"));
  // F 후속: 시험 계정 표(ops_test_accounts) — 운영 순서대로 그 뒤에 올린다(ops_test_user가 표도 본다).
  await db.exec(read("20261111100000_v5_test_account_table.sql"));
}, 30000);
beforeEach(async () => {
  await db.exec("truncate meta_conversion_outbox,meta_tracking_consents,account_contacts,launch_event_policy,growth_campaigns,report_ticket_grants,referral_invites,campaign_attributions,new_user_acquisitions cascade");
  await db.exec("delete from public.ops_settings where key='test_accounts'"); await db.exec("delete from public.ops_test_accounts");
  await h.clock(START); await h.policy(); await db.exec("update growth_campaigns set public_slug='gyeol-opening-2026'");
});
afterAll(async () => { await db?.close(); });

describe("시험 계정 메타 전송 차단(DB 트리거·전송 단계)", () => {
  it("동의한 시험 계정의 결제: 결제는 그대로 끝나고, 결제 완료 트리거·결제 완료 화면 경로 모두 대기표에 넣지 않는다", async () => {
    const tester = await h.user(); const key = await consent(tester); await markTest([tester]);
    const { order, report } = await paidOrder(tester);
    expect((await db.query<{ status: string }>("select status from payment_orders where payment_order_id=$1", [order])).rows[0].status).toBe("paid");
    expect(await rows(order)).toEqual([]);
    expect((await db.query<{ r: boolean }>("select queue_meta_purchase($1,$2,'192.0.2.9','ua',$3) r", [report, key, tester])).rows[0].r).toBe(false);
    expect(await rows(order)).toEqual([]);
  });
  it("같은 조건의 일반 회원은 예전 그대로 1줄(대조군)", async () => {
    const user = await h.user(); await consent(user); await markTest([]);
    const { order } = await paidOrder(user);
    expect(await rows(order)).toHaveLength(1);
  });
  it("이미 대기표에 들어 있던 줄도 시험 계정이 되면 서버 전송(claim)·전송 직전 재확인(allowed)·브라우저 거울에서 빠진다", async () => {
    const user = await h.user(); const key = await consent(user);
    const { order } = await paidOrder(user);
    const [row] = await rows(order); expect(row.user_id).toBe(user);
    const leases = await batch() as Array<{ event_id: string; lease: string }>;
    const item = leases.find(e => e.event_id === row.event_id)!; expect(item).toBeTruthy();
    await markTest([user]);
    expect(await batch("allowed", item.event_id, item.lease)).toBe(false);
    await db.query("update meta_conversion_outbox set lease=null,lease_until=null where event_id=$1", [row.event_id]);
    expect((await batch() as Array<{ event_id: string }>).some(e => e.event_id === row.event_id)).toBe(false);
    expect((await db.query<{ r: unknown[] }>("select claim_meta_browser_events($1,$2) r", [key, user])).rows[0].r).toEqual([]);
    await markTest([]);
    expect((await batch() as Array<{ event_id: string }>).some(e => e.event_id === row.event_id)).toBe(true);
  });
  it("기본 허용(시행일 뒤) 기본 줄도 시험 계정이면 넣지 않는다", async () => {
    await h.clock(AFTER);
    const tester = await h.user(); await markTest([tester]);
    const { order, report } = await paidOrder(tester);
    expect(await rows(order)).toEqual([]);
    expect((await db.query<{ r: boolean }>("select queue_meta_purchase($1,null,'192.0.2.7','ua',$2) r", [report, tester])).rows[0].r).toBe(false);
    const event = `purchase_${createHash("md5").update(`gyeol:paid-order:${order}`).digest("hex")}`;
    expect((await db.query<{ n: number }>("select count(*)::int n from meta_conversion_outbox where event_id=$1", [event])).rows[0].n).toBe(0);
  });
  it("F 후속 「시험 계정 표」(ops_test_accounts)에 넣은 계정도 같은 자리에서 빠진다 — 설정값(관리자·누나 목록)과 별개, 재배포 없이", async () => {
    const tester = await h.user(); const key = await consent(tester);
    await db.query("insert into public.ops_test_accounts(user_id,note) values($1,'시험')", [tester]);
    expect((await db.query<{ r: boolean }>("select public.ops_test_user($1) r", [tester])).rows[0].r).toBe(true);
    const { order, report } = await paidOrder(tester);
    expect(await rows(order)).toEqual([]);
    expect((await db.query<{ r: boolean }>("select queue_meta_purchase($1,$2,'192.0.2.9','ua',$3) r", [report, key, tester])).rows[0].r).toBe(false);
    // 표에서 빼면 바로 예전 그대로(다음 결제는 1줄).
    await db.query("delete from public.ops_test_accounts where user_id=$1", [tester]);
    expect((await db.query<{ r: boolean }>("select public.ops_test_user($1) r", [tester])).rows[0].r).toBe(false);
    expect(await rows((await paidOrder(tester)).order)).toHaveLength(1);
  });
});
