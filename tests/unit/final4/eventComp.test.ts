// 최종 A 11·12·14(PGlite): 1+1 계정 상한은 이벤트 이용권만 센다 · 보상 캠페인 멱등 지급(dry-run·기대 인원·확인 플래그) · 팝업 읽기. 외부 호출 0.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { afterPaidOrder } from "@/lib/ops/gift/service";
import { giftEventConfig } from "@/lib/ops/config";
import { runCampaign, type CampaignOptions } from "../../../tools/final4/comp-campaign-core";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";

const MIGRATION = "supabase/migrations/20261106100000_v5_final4_event_comp.sql";
type H = Awaited<ReturnType<typeof opsSql>>;
let h: H;
/** 시험 바탕(PGlite 시드)에 이미 있는 가입자 — 기준 시각 전이면 B에 들어간다. */
let BASE: string[] = [];
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const A1 = u(1), A2 = u(2), A3 = u(3), ADMIN = u(9), TEST = u(8), LATE = u(7);
const B_USERS = [u(11), u(12), u(13), u(14)];
const CUTOFF = "2026-11-07 00:00"; // KST
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); const r = (await h.db.query(sql, params)).rows[0] as T; await h.db.exec("set role service_role"); return r; };
const call = (a: string, d: Record<string, unknown>) => h.rpc("ops_comp_campaign", a, d);
const opts = (o: Partial<CampaignOptions> = {}): CampaignOptions => ({
  campaignId: "test-relaunch", cutoff: CUTOFF, a: [A1, A2, A3], exclude: [{ userId: ADMIN, reason: "admin" }, { userId: TEST, reason: "test" }],
  expectB: B_USERS.length + BASE.length, execute: false, confirm: null, aQty: 2, bQty: 1, products: ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"], days: 30, ...o,
});
const compCount = () => one<{ n: number }>("select count(*)::int n from gift_rewards where kind='comp'").then(r => r.n);

beforeAll(async () => {
  h = await opsSql();
  for (let i = 0; i < 2; i++) await h.db.exec(`reset role; ${readFileSync(MIGRATION, "utf8")} set role service_role;`); // 두 번째: 다시 실행해도 된다(패치 건너뜀·표·함수 그대로)
  BASE = (await h.db.query<{ user_id: string }>("select user_id from account_profiles where created_at < '2026-11-06T15:00:00Z'")).rows.map(r => r.user_id);
  const joined: [string, string][] = [[A1, "2026-10-12T00:00:00+09:00"], [A2, "2026-10-13T00:00:00+09:00"], [A3, "2026-11-08T00:00:00+09:00"], [ADMIN, "2026-10-01T00:00:00+09:00"], [TEST, "2026-10-02T00:00:00+09:00"],
    [LATE, "2026-11-07T00:00:00+09:00"], ...B_USERS.map((id, i) => [id, `2026-10-2${i}T09:00:00+09:00`] as [string, string])];
  for (const [id, at] of joined) {
    await exec("insert into auth.users(id) values($1)", [id]);
    await exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed')", [id, `${id.slice(-4)}@example.com`]);
    await exec("insert into account_profiles(user_id,display_name,provider,created_at) values($1,'회원','kakao',$2)", [id, at]);
  }
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("보상 캠페인 지급 도구", () => {
  it("dry-run: A 3명, B = 기준 시각 전 가입 − A − 관리자 − 시험 계정, 지급 0", async () => {
    const r = await runCampaign(call, opts());
    const n = B_USERS.length + BASE.length;
    expect(r).toMatchObject({ ok: true, code: "DRY_RUN", bCount: n });
    expect(r.lines.join("\n")).toContain(`B ${n}명(기대 ${n}명)`);
    expect(r.lines.join("\n")).toMatch(/관리자\(ADMIN_USER_IDS\)[\s\S]*시험 계정/);
    expect(r.lines.join("\n")).toContain("기준 시각 뒤 가입 2명"); // A3·LATE(정각 = 기준 시각 뒤)
    expect(r.lines.join("\n")).not.toMatch(/\d{4}@example\.com/); // 이메일은 가려서
    expect(await compCount()).toBe(0);
  });
  it("B 인원이 기대값과 다르면 지급하지 않고 차이 명단을 보여 준다", async () => {
    const r = await runCampaign(call, opts({ expectB: 36, execute: true, confirm: "test-relaunch", expectList: [...BASE, ...B_USERS.slice(0, 3), u(99)] }));
    expect(r).toMatchObject({ ok: false, code: "B_COUNT_MISMATCH", bCount: B_USERS.length + BASE.length });
    expect(r.lines.join("\n")).toContain(`명단에서 빠짐): ${u(99)}`);
    expect(r.lines.join("\n")).toContain(`기대 목록 밖): ${B_USERS[3]}`);
    // SQL도 스스로 막는다(도구를 거치지 않은 호출).
    expect(await call("run", { campaignId: "test-relaunch", cutoff: "2026-11-06T15:00:00Z", a: [A1, A2, A3], exclude: [ADMIN, TEST], expectB: 99, confirm: true, products: ["saju_mbti_full"], days: 30 })).toMatchObject({ ok: false, code: "B_COUNT_MISMATCH", actual: B_USERS.length + BASE.length });
    expect(await call("run", { campaignId: "test-relaunch", cutoff: "2026-11-06T15:00:00Z", a: [A1], exclude: [], confirm: true, products: ["saju_mbti_full"], days: 30 })).toMatchObject({ ok: false, code: "EXPECT_REQUIRED" });
    expect(await compCount()).toBe(0);
  });
  it("실행은 --confirm이 캠페인 id와 같을 때만, 없는 A 계정이 있으면 멈춘다", async () => {
    expect(await runCampaign(call, opts({ execute: true, confirm: "other" }))).toMatchObject({ ok: false, code: "CONFIRM_MISMATCH" });
    expect(await runCampaign(call, opts({ execute: true, confirm: "test-relaunch", a: [A1, u(55)] }))).toMatchObject({ ok: false, code: "A_ACCOUNT_MISSING" });
    expect(await compCount()).toBe(0);
  });
  it("지급: A 2장·B 1장, 받은 날부터 30일, 선물 가능(gift_only 아님), 4종 상품. 다시 실행하면 0명", async () => {
    const r = await runCampaign(call, opts({ execute: true, confirm: "test-relaunch" }));
    const total = 3 + B_USERS.length + BASE.length;
    expect(r).toMatchObject({ ok: true, code: "GRANTED", granted: total, already: 0 });
    expect(await one("select count(*)::int n, bool_and(not gift_only) choosable, bool_and(product_scopes = array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility']) scopes, min(round(extract(epoch from expires_at-created_at)/86400))::int d from gift_rewards where kind='comp'"))
      .toEqual({ n: 3 * 2 + B_USERS.length + BASE.length, choosable: true, scopes: true, d: 30 });
    expect(await one("select count(*)::int n from gift_rewards where kind='comp' and owner_user_id in ($1,$2)", [ADMIN, TEST])).toEqual({ n: 0 });
    expect(await one("select tier, quantity from comp_campaign_grants where user_id=$1", [A1])).toEqual({ tier: "A", quantity: 2 });
    expect(await one("select tier, quantity from comp_grants where user_id=$1", [B_USERS[0]])).toEqual({ tier: "B", quantity: 1 }); // 서재 지연 지급이 또 주지 않게
    const again = await runCampaign(call, opts({ execute: true, confirm: "test-relaunch" }));
    expect(again).toMatchObject({ ok: true, granted: 0, already: total });
    expect(await compCount()).toBe(3 * 2 + B_USERS.length + BASE.length);
    // 서재 지연 지급(ops_comp sync, 켜졌을 때)도 B에게 두 번 주지 않는다.
    await exec("insert into upgrade_roster(user_id,joined_at,cutoff) values($1,now(),now()) on conflict do nothing", [B_USERS[0]]);
    await exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원','b0@example.com','typed') on conflict do nothing", [B_USERS[0]]);
    expect(await h.rpc("ops_comp", "sync", { userId: B_USERS[0], enabled: true, aQty: 2, aDays: 30, bQty: 1, bDays: 30, products: ["saju_mbti_full"] })).toMatchObject({ state: "granted", fresh: false });
    expect(await compCount()).toBe(3 * 2 + B_USERS.length + BASE.length);
  });
  it("팝업 읽기: 안 쓴 이용권이 있을 때만 등급·장수·만료일, 쓰거나 만료되면 없음(부수 효과 없음)", async () => {
    expect(await call("popup", { userId: A1 })).toMatchObject({ ok: true, tier: "A", quantity: 2, unused: 2 });
    expect(await call("popup", { userId: B_USERS[1] })).toMatchObject({ ok: true, tier: "B", quantity: 1, unused: 1 });
    expect(await call("popup", { userId: LATE })).toEqual({ ok: true, tier: null });
    const [g1, g2] = (await h.db.query<{ id: string }>("select id from gift_rewards where owner_user_id=$1 and kind='comp' order by id", [A1])).rows;
    expect(await h.rpc("ops_gift", "use_self", { userId: A1, giftId: g1.id })).toMatchObject({ ok: true });
    expect(await call("popup", { userId: A1 })).toMatchObject({ tier: "A", unused: 1 });
    expect(await h.rpc("ops_gift", "link", { userId: A1, giftId: g2.id, tokenHash: "a".repeat(64) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await call("popup", { userId: A1 })).toEqual({ ok: true, tier: null });
    await exec("update gift_rewards set expires_at=now()-interval '1 second' where owner_user_id=$1 and kind='comp'", [B_USERS[2]]);
    expect(await call("popup", { userId: B_USERS[2] })).toEqual({ ok: true, tier: null });
    expect(await one("select status from gift_rewards where owner_user_id=$1 and kind='comp'", [B_USERS[2]])).toEqual({ status: "available" }); // 읽기만(만료 처리 안 함)
  });
});

describe("1+1 계정 상한은 이벤트 이용권만 센다(보상 이용권은 상한에 안 들어감)", () => {
  it("보상 2장을 가진 A 계정도 결제 2건이면 1+1 이용권 2장", async () => {
    const policyAt = "2026-11-08T03:00:00.000Z";
    const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
    const order = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_order", a, d) };
    const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
    const cfg = giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-01", GIFT_EVENT_END: "2030-12-31 23:59:59" });
    expect(cfg.active).toBe(true);
    const issued: unknown[] = [];
    for (const id of ["f4-pay-1", "f4-pay-2", "f4-pay-3"]) {
      await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 3900, inputSnapshot: { reportInputPayload: payload } });
      await order.call("attach", { paymentOrderId: id, userId: A2, name: "회원", email: `${id}@example.com` });
      const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 3900 });
      await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
      issued.push((await afterPaidOrder(gift, id, cfg))?.issued);
    }
    expect(issued).toEqual([expect.objectContaining({ issued: true }), expect.objectContaining({ issued: true }), expect.objectContaining({ issued: false, code: "ACCOUNT_LIMIT" })]);
    expect(await one("select count(*) filter (where kind='event')::int e, count(*) filter (where kind='comp')::int c from gift_rewards where owner_user_id=$1", [A2])).toEqual({ e: 2, c: 2 });
  });
});
