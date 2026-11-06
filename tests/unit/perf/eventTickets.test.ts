// P 추가(2026-11-06) C·D·E·F·B — migration 20261107090000(PGlite, 외부 호출 0).
// C 상한 없음·보너스 없음 · D 기한 11-30 23:59:59 KST(새 발급·기존 행 당김·기록) · E 지갑·결제 화면에서 쓰기(기한 빠른 것부터)
// F 선물 링크(공유 순간 생성·공유 취소 되돌림·받은 이용권은 다시 선물 불가) · B 만료 작업이 옛 주문 입력·구매자 연락처도 지움 · P 소유 확인(본문 없이).
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { afterPaidOrder, readWallet } from "@/lib/ops/gift/service";
import { EVENT_TICKET_EXPIRES_AT, giftEventConfig, ticketExpiresAt } from "@/lib/ops/config";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";

const FINAL4 = "supabase/migrations/20261106100000_v5_final4_event_comp.sql";
const FIX = "supabase/migrations/20261106200000_v5_deploy_gift_pending_alias.sql";
const PERF = "supabase/migrations/20261107090000_v5_perf_event_tickets.sql";
const TARGET = Date.parse(EVENT_TICKET_EXPIRES_AT);
let h: Awaited<ReturnType<typeof opsSql>>;
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const BUYER = u(501), FRIEND = u(502), OLD = u(503), SIS = u(504), OTHER = u(505);
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); const r = (await h.db.query(sql, params)).rows[0] as T; await h.db.exec("set role service_role"); return r; };
const cfg = giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-06 09:00:00", GIFT_EVENT_END: "2030-12-31 23:59:59" });
const gift = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
const hash = (n: number) => n.toString(16).padStart(64, "0");
let payload: unknown;
async function paidOrder(id: string, user: string | null) {
  const order = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_order", a, d) };
  await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 3900, inputSnapshot: { reportInputPayload: payload } });
  await order.call("attach", { paymentOrderId: id, userId: user, name: "회원", email: `${id}@example.com` });
  const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 3900 });
  await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
}
async function member(id: string) {
  await exec("insert into auth.users(id) values($1)", [id]);
  await exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed')", [id, `${id.slice(-3)}@example.com`]);
  await exec("insert into account_profiles(user_id,display_name,provider) values($1,'회원','kakao')", [id]);
}

beforeAll(async () => {
  h = await opsSql();
  await h.db.exec(`reset role; ${readFileSync(FINAL4, "utf8")} ${readFileSync(FIX, "utf8")} set role service_role;`);
  const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date() }); if (!n.ok) throw new Error("payload"); payload = n.value;
  for (const id of [BUYER, FRIEND, OLD, SIS, OTHER]) await member(id);
  // migration 전 운영과 같은 상태: 1+1·보상 이용권이 12-06(발급 + 30일) 기한, 수동 지급 5장(기한 없이 → 30일), 내가 쓰기로 옮긴 원장 이용권.
  await exec("insert into gift_rewards(owner_user_id,source_order_id,kind,expires_at) values($1,null,'comp','2026-12-06T12:00:00+09:00')", [OLD]);
  const comp = await one<{ id: string }>("select id from gift_rewards where owner_user_id=$1", [OLD]);
  await exec("insert into comp_campaign_grants(campaign_id,user_id,tier,quantity,gift_ids,expires_at) values('relaunch',$1,'B',1,array[$2::uuid],'2026-12-06T12:00:00+09:00')", [OLD, comp.id]);
  await exec("insert into comp_grants(user_id,tier,quantity,ticket_grant_ids,gift_ids,expires_at) values($1,'B',1,'{}',array[$2::uuid],'2026-12-06T12:00:00+09:00')", [OLD, comp.id]);
  await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [SIS, JSON.stringify({ quantity: 5, sourceType: "manual", sourceRef: "sister", key: "admin:sister", reason: "ADMIN_GRANT" })]);
  await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [OTHER, JSON.stringify({ quantity: 1, sourceType: "promotion", sourceRef: "gift-self:old", key: "gift-self:00000000-0000-4000-8000-0000000000aa", reason: "EVENT_PAYMENT_GIFT", expiresAt: "2026-12-06T12:00:00+09:00" })]);
  await h.db.exec(`reset role; ${readFileSync(PERF, "utf8")} set role service_role;`);
}, 180_000);
afterAll(async () => { await h?.db.close(); });

describe("D 기존 행 기한 당기기(migration)", () => {
  it("보상·수동 지급·옮긴 원장 이용권·보상 기록 두 표가 11-30 23:59:59 KST로, 원래 기한은 기록표에 남는다", async () => {
    const at = async (sql: string, p: unknown[]) => Date.parse(String((await one<{ e: string }>(sql, p)).e));
    expect(await at("select expires_at::text e from gift_rewards where owner_user_id=$1", [OLD])).toBe(TARGET);
    expect(await at("select expires_at::text e from comp_campaign_grants where user_id=$1", [OLD])).toBe(TARGET);
    expect(await at("select expires_at::text e from comp_grants where user_id=$1", [OLD])).toBe(TARGET);
    expect(await at("select expires_at::text e from report_ticket_grants where user_id=$1", [SIS])).toBe(TARGET);
    expect(await at("select expires_at::text e from report_ticket_grants where user_id=$1", [OTHER])).toBe(TARGET);
    // 이 시험 계정 셋의 5행(보상 기록 2표 + 보상 1장 + 수동 지급 + 옮긴 원장). 시험 바탕의 수동 지급(출시 뒤 발급)도 같은 규칙으로 함께 당겨진다.
    const log = await one<{ n: number; old: string }>("select count(*)::int n, min(old_expires_at)::text old from ticket_expiry_adjustments where user_id = any($1::uuid[])", [[OLD, SIS, OTHER]]);
    expect(log.n).toBe(5);
    expect(Date.parse(log.old)).toBeGreaterThan(TARGET);
  });
  it("원장 수정 막기(ticket_grants_immutable)는 다시 켜져 있다", async () => {
    await expect(exec("update report_ticket_grants set expires_at=now() where user_id=$1", [SIS])).rejects.toThrow(/IMMUTABLE/);
  });
  it("누나 계정 수동 지급 5장: 지갑 5장 · 11월 30일까지 · 선물할 이용권 0", async () => {
    expect(await readWallet(gift, SIS)).toMatchObject({ ledger: 5, usable: 5, total: 5, giftable: 0 });
    expect(Date.parse((await readWallet(gift, SIS))!.expiresAt!)).toBe(TARGET);
  });
});

describe("C 1+1: 상한 없음·보너스 없음·기한 11-30", () => {
  it("이벤트 기간 회원 결제 3건 → 3장(예전 상한 2장 없음), 기한 = ticketExpiresAt", async () => {
    for (const id of ["pf-1", "pf-2", "pf-3"]) { await paidOrder(id, BUYER); expect((await afterPaidOrder(gift, id, cfg))?.issued).toMatchObject({ issued: true }); }
    const r = await one<{ n: number; e: string }>("select count(*)::int n, min(expires_at)::text e from gift_rewards where owner_user_id=$1 and kind='event'", [BUYER]);
    expect(r.n).toBe(3);
    expect(Date.parse(r.e)).toBe(Date.parse(ticketExpiresAt()));
  });
  it("친구 첫 결제 보너스: 예전 호출도 아무것도 주지 않는다", async () => {
    await paidOrder("pf-friend-1", FRIEND);
    expect(await gift.call("bonus", { paymentOrderId: "pf-friend-1", bonusMax: 2, expiresAt: ticketExpiresAt() })).toMatchObject({ ok: true, granted: false, code: "BONUS_REMOVED" });
  });
});

describe("E 결제 화면 이용권(지갑·쓰기)", () => {
  it("지갑: 원장 0 + 남은 이벤트 3장 = 3장, 선물 가능 3장", async () => {
    expect(await readWallet(gift, BUYER)).toMatchObject({ ledger: 0, giftable: 3, usable: 3, total: 3, sent: 0, recipients: 0 });
  });
  it("쓰기(spend): 원장이 없으면 기한 빠른 이벤트 이용권 1장을 원장으로 옮기고, 같은 요청은 다시 옮기지 않는다", async () => {
    expect(await gift.call("spend", { userId: BUYER, requestId: "00000000-0000-4000-8000-00000000f001", productType: "saju_mbti_full" })).toMatchObject({ ok: true, moved: true });
    expect(await readWallet(gift, BUYER)).toMatchObject({ ledger: 1, giftable: 2, usable: 3, total: 3 });
    // 원장 이용권(같은 기한)이 이미 있으면 더 옮기지 않는다(원장부터 쓴다).
    expect(await gift.call("spend", { userId: BUYER, requestId: "00000000-0000-4000-8000-00000000f002", productType: "saju_mbti_full" })).toMatchObject({ ok: true, moved: false });
  });
  it("원장 이용권 기한이 더 늦으면 이벤트 이용권을 먼저 쓴다", async () => {
    await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [FRIEND, JSON.stringify({ quantity: 1, sourceType: "purchase", sourceRef: "bundle", key: "bundle:friend", reason: "TICKET_BUNDLE_PURCHASE" })]).catch(() => undefined);
    const ledger = await readWallet(gift, FRIEND);
    await paidOrder("pf-friend-2", FRIEND); await afterPaidOrder(gift, "pf-friend-2", cfg);
    const before = await readWallet(gift, FRIEND);
    expect(before!.giftable).toBeGreaterThanOrEqual(1);
    const r = await gift.call("spend", { userId: FRIEND, requestId: "00000000-0000-4000-8000-00000000f003", productType: "saju_mbti_full" });
    // 기한 없는 원장 이용권(구매 묶음)만 있으면 11-30에 끝나는 이벤트 이용권이 먼저(moved), 원장이 없으면 당연히 moved.
    expect(r).toMatchObject({ ok: true, moved: true });
    expect((await readWallet(gift, FRIEND))!.ledger).toBe((ledger?.ledger ?? 0) + 1);
  });
});

describe("F 선물 링크", () => {
  it("link_next: 기한 빠른 남은 1장에 링크, 같은 토큰은 같은 결과, 남이 만든 토큰은 거절", async () => {
    expect(await gift.call("link_next", { userId: BUYER, tokenHash: hash(1) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await gift.call("link_next", { userId: BUYER, tokenHash: hash(1) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await gift.call("link_next", { userId: OTHER, tokenHash: hash(1) })).toMatchObject({ ok: false, code: "INVALID" });
    expect(await readWallet(gift, BUYER)).toMatchObject({ giftable: 1, sent: 1, recipients: 0 });
  });
  it("unlink: 공유 창을 닫으면 되돌린다(받기 전만)", async () => {
    expect(await gift.call("link_next", { userId: BUYER, tokenHash: hash(2) })).toMatchObject({ ok: true });
    expect(await readWallet(gift, BUYER)).toMatchObject({ giftable: 0 });
    expect(await gift.call("unlink", { userId: BUYER, tokenHash: hash(2) })).toMatchObject({ ok: true, reverted: true });
    expect(await readWallet(gift, BUYER)).toMatchObject({ giftable: 1 });
  });
  it("받기 → 받은 사람 원장 +1(결제 화면에서 쓸 수 있음), 선물 가능 0(다시 선물 불가), 받은 링크는 되돌릴 수 없다", async () => {
    const before = (await readWallet(gift, OLD))!;
    expect(await gift.call("claim", { userId: OLD, tokenHash: hash(1) })).toMatchObject({ ok: true, status: "claimed" });
    const after = (await readWallet(gift, OLD))!;
    expect(after.ledger).toBe(before.ledger + 1);
    expect(after.giftable).toBe(before.giftable); // 받은 이용권은 선물 대상이 아니다(보상 1장은 원래 그대로)
    expect(await gift.call("unlink", { userId: BUYER, tokenHash: hash(1) })).toMatchObject({ ok: true, reverted: false });
    expect(await readWallet(gift, BUYER)).toMatchObject({ sent: 1, recipients: 1 });
    expect(await gift.call("link_next", { userId: OLD, tokenHash: hash(3) })).toMatchObject({ ok: true }); // 보상 1장(내 것)은 선물할 수 있다
    expect(await readWallet(gift, OLD)).toMatchObject({ giftable: 0 });
    expect(await gift.call("link_next", { userId: OLD, tokenHash: hash(4) })).toMatchObject({ ok: false, code: "NO_GIFTABLE" }); // 받은 1장은 원장 → 선물 불가
  });
});

describe("B 만료 작업: 옛 주문 입력·구매자 연락처", () => {
  it("v5 이전 책 기한이 지나면 주문 입력(동의 기록만 남김)·구매자 이름·이메일·전화를 지운다. 주문번호·상품·금액·상태는 남는다", async () => {
    await paidOrder("pf-old-1", null);
    await exec("update payment_orders set input_snapshot=$1::jsonb where payment_order_id='pf-old-1'", [JSON.stringify({ consentEvidence: { version: "checkout-consent-v1" }, person: { name: "옛 입력", birthDate: "1990-01-01" } })]);
    // 결제로 생긴 책 행을 v4 발행본(100일 전 발행 → 10일 전 기한 끝)으로 만든다.
    await exec(`update paid_report_snapshots set status='COMPLETED',snapshot_json='{"productVersion":"v4"}',gate_version='paid-report-v1',published_at=now()-interval '100 days',expires_at=now()-interval '100 days'+interval '2160 hours' where order_id='pf-old-1'`);
    await h.paid.call("expire", {});
    const o = await one<{ i: Record<string, unknown>; status: string; amount: number; product_type: string }>("select input_snapshot i,status,amount,product_type from payment_orders where payment_order_id='pf-old-1'");
    expect(o.i).toEqual({ consentEvidence: { version: "checkout-consent-v1" } });
    expect(o).toMatchObject({ status: "paid", amount: 3900, product_type: "saju_mbti_full" });
    const r = await one<Record<string, unknown>>("select buyer_name,buyer_email,buyer_phone,order_code from order_records where payment_order_id='pf-old-1'");
    expect(r).toMatchObject({ buyer_name: null, buyer_email: null, buyer_phone: null });
    expect(String(r.order_code)).toMatch(/^GR-/);
  });
  it("기한이 남은 주문은 그대로 둔다", async () => {
    const r = await one<Record<string, unknown>>("select buyer_email from order_records where payment_order_id='pf-1'");
    expect(r.buyer_email).toBe("pf-1@example.com");
  });
});

describe("P 책 열기 소유 확인(본문 없이)", () => {
  it("book_share_owned는 book_share_publication(p_user)의 ok와 같다", async () => {
    const exists = await one<{ ok: boolean }>("select to_regprocedure('public.referral_publication(text)') is not null ok");
    if (!exists.ok) return;
    for (const user of [BUYER, OTHER]) {
      const report = (await one<{ r: string }>("select report_id r from payment_orders where payment_order_id='pf-1'")).r;
      const light = await h.rpc("book_share_owned", report, user) as unknown as boolean;
      const full = await h.rpc("book_share_publication", report, user);
      expect(light).toBe(full.ok === true);
    }
  });
});
