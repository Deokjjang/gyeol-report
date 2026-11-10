// P 추가(2026-11-06) C·D·E·F·B — migration 20261107090000(PGlite, 외부 호출 0).
// C 상한 없음·보너스 없음 · D 보상 기한 11-30 23:59:59 KST(2026-11-10 정정: 결제 증정 이용권은 받은 날부터 30일 — eventTicket30d.test.ts)(새 발급, 기존 행은 보상 캠페인 이용권·기록 두 표만 당김, 누나 5장·관리자 지급 그대로) · E 지갑·결제 화면에서 쓰기(기한 빠른 것부터)
// F 선물 링크(공유 순간 생성·공유 취소 되돌림·받은 이용권은 다시 선물 불가) · B 만료 작업이 옛 주문 입력·구매자 연락처도 지움 · P 소유 확인(본문 없이).
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { afterPaidOrder, readWallet } from "@/lib/ops/gift/service";
import { COMP_TICKET_EXPIRES_AT, giftEventConfig } from "@/lib/ops/config";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";

const FINAL4 = "supabase/migrations/20261106100000_v5_final4_event_comp.sql";
const FIX = "supabase/migrations/20261106200000_v5_deploy_gift_pending_alias.sql";
const PERF = "supabase/migrations/20261107090000_v5_perf_event_tickets.sql";
const TARGET = Date.parse(COMP_TICKET_EXPIRES_AT);
let h: Awaited<ReturnType<typeof opsSql>>;
const u = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
// SIS = 운영 누나 계정 id(migration이 이름으로도 뺀다). OTHER = 관리자 수동 지급·원장 이용권을 가진 계정.
const BUYER = u(501), FRIEND = u(502), OLD = u(503), SIS = "d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55", OTHER = u(505);
const REF = u(506);
const SIS_EXP = Date.parse("2026-12-06T11:06:46+09:00");
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
  for (const id of [BUYER, FRIEND, OLD, SIS, OTHER, REF]) await member(id);
  // migration 전 운영과 같은 상태(11-06 확인): 보상 캠페인 이용권이 12-06(발급 + 30일) 기한 + 캠페인 기록 두 표,
  // 누나 계정은 캠페인 밖 보상 이용권 5장(12-06 11:06 KST), 관리자 수동 지급(기한 없이 → 30일)과 옮긴 원장 이용권은 다른 계정.
  await exec("insert into gift_rewards(owner_user_id,source_order_id,kind,expires_at) values($1,null,'comp','2026-12-06T12:00:00+09:00')", [OLD]);
  const comp = await one<{ id: string }>("select id from gift_rewards where owner_user_id=$1", [OLD]);
  await exec("insert into comp_campaign_grants(campaign_id,user_id,tier,quantity,gift_ids,expires_at) values('relaunch',$1,'B',1,array[$2::uuid],'2026-12-06T12:00:00+09:00')", [OLD, comp.id]);
  await exec("insert into comp_grants(user_id,tier,quantity,ticket_grant_ids,gift_ids,expires_at) values($1,'B',1,'{}',array[$2::uuid],'2026-12-06T12:00:00+09:00')", [OLD, comp.id]);
  for (let i = 0; i < 5; i++) await exec("insert into gift_rewards(owner_user_id,source_order_id,kind,expires_at,product_scopes) values($1,null,'comp','2026-12-06T11:06:46+09:00',array['saju_mbti_full','career_money_study','love_marriage_child','saju_mbti_compatibility'])", [SIS]);
  await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [OTHER, JSON.stringify({ quantity: 1, sourceType: "manual", sourceRef: "admin-before", key: "admin:before", reason: "ADMIN_GRANT" })]);
  await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [OTHER, JSON.stringify({ quantity: 1, sourceType: "promotion", sourceRef: "gift-self:old", key: "gift-self:00000000-0000-4000-8000-0000000000aa", reason: "EVENT_PAYMENT_GIFT", expiresAt: "2026-12-06T12:00:00+09:00" })]);
  await h.db.exec(`reset role; ${readFileSync(PERF, "utf8")} set role service_role;`);
}, 180_000);
afterAll(async () => { await h?.db.close(); });

describe("D 기존 행 기한 당기기(migration)", () => {
  const at = async (sql: string, p: unknown[]) => Date.parse(String((await one<{ e: string }>(sql, p)).e));
  it("보상 캠페인 이용권과 캠페인 기록 두 표만 11-30 23:59:59 KST로, 원래 기한은 기록표에 남는다", async () => {
    expect(await at("select expires_at::text e from gift_rewards where owner_user_id=$1", [OLD])).toBe(TARGET);
    expect(await at("select expires_at::text e from comp_campaign_grants where user_id=$1", [OLD])).toBe(TARGET);
    expect(await at("select expires_at::text e from comp_grants where user_id=$1", [OLD])).toBe(TARGET);
    const log = await one<{ n: number; old: string; targets: string }>("select count(*)::int n, min(old_expires_at)::text old, string_agg(distinct target, ',' order by target) targets from ticket_expiry_adjustments");
    expect(log).toMatchObject({ n: 3, targets: "comp_campaign_grants,comp_grants,gift_rewards" });
    expect(Date.parse(log.old)).toBeGreaterThan(TARGET);
  });
  it("누나 계정 5장은 그대로(12-06 11:06 KST) — 지갑 5장·결제 화면 5장·기한 12월 6일", async () => {
    const r = await one<{ n: number; mn: string; mx: string }>("select count(*)::int n, min(expires_at)::text mn, max(expires_at)::text mx from gift_rewards where owner_user_id=$1", [SIS]);
    expect(r.n).toBe(5);
    expect(Date.parse(r.mn)).toBe(SIS_EXP);
    expect(Date.parse(r.mx)).toBe(SIS_EXP);
    const w = (await readWallet(gift, SIS))!;
    expect(w).toMatchObject({ ledger: 0, usable: 5, total: 5, giftable: 5 });
    expect(Date.parse(w.expiresAt!)).toBe(SIS_EXP);
    expect(Date.parse(w.usableExpiresAt!)).toBe(SIS_EXP);
  });
  it("관리자 수동 지급·원장 이용권은 건드리지 않고, 원장 수정 막기(ticket_grants_immutable)는 켜진 그대로", async () => {
    const r = await one<{ n: number; mx: string }>("select count(*)::int n, max(expires_at)::text mx from report_ticket_grants where user_id=$1", [OTHER]);
    expect(r.n).toBe(2);
    expect(Date.parse(r.mx)).toBeGreaterThan(TARGET);
    expect(await at("select expires_at::text e from report_ticket_grants where user_id=$1 and source_type='manual'", [OTHER])).toBeGreaterThan(TARGET);
    await expect(exec("update report_ticket_grants set expires_at=now() where user_id=$1", [OTHER])).rejects.toThrow(/IMMUTABLE/);
  });
  it("배포 뒤 관리자 수동 지급(오류 보상)은 예전처럼 발급일 + 30일(11-30로 당기지 않는다)", async () => {
    const before = Date.now();
    await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [OTHER, JSON.stringify({ quantity: 1, sourceType: "manual", sourceRef: "admin-after", key: "admin:after", reason: "ADMIN_GRANT" })]);
    const e = await at("select expires_at::text e from report_ticket_grants where user_id=$1 and idempotency_key='admin:after'", [OTHER]);
    expect(Math.abs(e - (before + 30 * 86_400_000))).toBeLessThan(5 * 60_000);
  });
  it("대상 중 하나라도 쓰였거나 선물 링크가 생겼으면 아무것도 바꾸지 않고 멈춘다(PERF_D_TARGET_CHANGED)", async () => {
    // migration의 D 블록만 다시 돌린다(이미 당긴 행은 대상이 아니므로, 새 캠페인 이용권 2장 중 1장에 링크를 걸어 둔다).
    const file = readFileSync(PERF, "utf8"), start = file.indexOf("do $$\ndeclare target timestamptz"), end = file.indexOf("end $$;", start) + "end $$;".length;
    expect(start).toBeGreaterThan(0);
    await exec("insert into gift_rewards(owner_user_id,source_order_id,kind,expires_at) values($1,null,'comp','2026-12-06T12:00:00+09:00'),($1,null,'comp','2026-12-06T12:00:00+09:00')", [OLD]);
    await exec("update gift_rewards set status='gifted', token_hash=$2, gifted_at=now() where id=(select id from gift_rewards where owner_user_id=$1 and expires_at>$3::timestamptz order by id limit 1)", [OLD, hash(77), new Date(TARGET).toISOString()]);
    await expect(exec(file.slice(start, end))).rejects.toThrow(/PERF_D_TARGET_CHANGED/);
    const r = await one<{ n: number }>("select count(*)::int n from gift_rewards where owner_user_id=$1 and expires_at>$2::timestamptz", [OLD, new Date(TARGET).toISOString()]);
    expect(r.n).toBe(2);
    expect((await one<{ n: number }>("select count(*)::int n from ticket_expiry_adjustments")).n).toBe(3);
    await exec("delete from gift_rewards where owner_user_id=$1 and expires_at>$2::timestamptz", [OLD, new Date(TARGET).toISOString()]);
  });
});

describe("C 1+1: 상한 없음·보너스 없음·기한 받은 날부터 30일(2026-11-10 정정)", () => {
  it("이벤트 기간 회원 결제 3건 → 3장(예전 상한 2장 없음), 기한 = 설정값(받은 시각 + 30일)", async () => {
    for (const id of ["pf-1", "pf-2", "pf-3"]) { await paidOrder(id, BUYER); expect((await afterPaidOrder(gift, id, cfg))?.issued).toMatchObject({ issued: true }); }
    const r = await one<{ n: number; e: string }>("select count(*)::int n, min(expires_at)::text e from gift_rewards where owner_user_id=$1 and kind='event'", [BUYER]);
    expect(r.n).toBe(3);
    expect(Date.parse(r.e)).toBe(Date.parse(cfg.ticketExpiresAt));
    expect(Math.abs(Date.parse(cfg.ticketExpiresAt) - (Date.now() + 30 * 86_400_000))).toBeLessThan(10 * 60_000);
  });
  it("친구 첫 결제 보너스: 예전 호출도 아무것도 주지 않는다", async () => {
    await paidOrder("pf-friend-1", FRIEND);
    expect(await gift.call("bonus", { paymentOrderId: "pf-friend-1", bonusMax: 2, expiresAt: cfg.ticketExpiresAt })).toMatchObject({ ok: true, granted: false, code: "BONUS_REMOVED" });
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
    // 기한 없는 원장 이용권(구매 묶음)만 있으면 30일 뒤 끝나는 이벤트 이용권이 먼저(moved), 원장이 없으면 당연히 moved.
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

describe("2 환불 때 이용권 회수: 안 쓴 것·받지 않은 선물 링크는 회수, 받은(쓴) 것은 기록만", () => {
  const order = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_order", a, d) };
  const recon = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_recon", a, d) };
  const ticketOf = (id: string) => one<{ status: string; token_hash: string | null }>("select status, token_hash from gift_rewards where source_order_id=$1", [id]);
  async function adminRefund(id: string) {
    expect(await order.call("refund_request", { paymentOrderId: id, source: "admin", reason: "시험" })).toMatchObject({ ok: true });
    expect(await order.call("refund_claim", { paymentOrderId: id })).toMatchObject({ ok: true });
    return order.call("refund_finish", { paymentOrderId: id, ok: true, providerStatus: "CANCELED" });
  }
  it("관리자 환불: 링크를 만들었지만 안 받은 선물은 회수·링크 무효(받는 화면은 「기한이 지났거나 이미 받은 선물이에요」)", async () => {
    await paidOrder("rf-1", REF);
    expect((await afterPaidOrder(gift, "rf-1", cfg))?.issued).toMatchObject({ issued: true });
    expect(await gift.call("link_next", { userId: REF, tokenHash: hash(90) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await ticketOf("rf-1")).toEqual({ status: "gifted", token_hash: hash(90) });
    expect(await adminRefund("rf-1")).toMatchObject({ ok: true, state: "done", giftRevoked: true, giftKept: null });
    expect(await ticketOf("rf-1")).toEqual({ status: "revoked", token_hash: null });
    // 받는 화면: 링크 확인(peek)·받기(claim) 모두 「없음」 → GiftClaim이 GONE 한 줄을 보인다.
    expect(await gift.call("peek", { tokenHash: hash(90), userId: FRIEND })).toMatchObject({ ok: false, code: "GIFT_NOT_FOUND" });
    expect(await gift.call("claim", { userId: FRIEND, tokenHash: hash(90) })).toMatchObject({ ok: false, code: "GIFT_NOT_FOUND" });
    expect(await readWallet(gift, REF)).toMatchObject({ giftable: 0, total: 0 });
  });
  it("관리자 환불: 이미 받은 선물(받은 사람 원장)은 회수·차감하지 않고 결과로만 남긴다", async () => {
    await paidOrder("rf-2", REF);
    await afterPaidOrder(gift, "rf-2", cfg);
    expect(await gift.call("link_next", { userId: REF, tokenHash: hash(91) })).toMatchObject({ ok: true });
    expect(await gift.call("claim", { userId: FRIEND, tokenHash: hash(91) })).toMatchObject({ ok: true, status: "claimed" });
    const before = (await readWallet(gift, FRIEND))!.ledger;
    expect(await adminRefund("rf-2")).toMatchObject({ ok: true, state: "done", giftRevoked: false, giftKept: "claimed" });
    expect((await ticketOf("rf-2")).status).toBe("claimed");
    expect((await readWallet(gift, FRIEND))!.ledger).toBe(before);
  });
  it("외부 환불 기록(토스 상점관리자): 안 받은 선물 링크도 같은 규칙으로 회수", async () => {
    await paidOrder("rf-3", REF);
    await afterPaidOrder(gift, "rf-3", cfg);
    expect(await gift.call("link_next", { userId: REF, tokenHash: hash(92) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await recon.call("external_refund", { paymentOrderId: "rf-3", amount: 3900 })).toMatchObject({ ok: true, giftRevoked: true });
    expect(await ticketOf("rf-3")).toEqual({ status: "revoked", token_hash: null });
    expect(await gift.call("peek", { tokenHash: hash(92), userId: FRIEND })).toMatchObject({ ok: false, code: "GIFT_NOT_FOUND" });
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

// 운영 Q 10부: 시계를 옮겨(vi.setSystemTime — PGlite의 now()·clock_timestamp()도 같이 움직인다) 기한이 지나면 저절로 끝나는지 본다.
// 결제 증정 이용권(1+1·받은 선물)은 받은 날부터 30일(2026-11-10 정정 — 11-20 12:00 KST에 받으면 12-20 12:00 KST까지), 누나 계정 보상 5장은 2026-12-06 11:06:46 KST까지.
describe("운영 Q 10부: 이용권 기한이 지나면(시간 이동)", () => {
  const EV = u(601), RCV = u(602);
  const ticketStore = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_gift", a, d) };
  const at = (iso: string) => vi.setSystemTime(new Date(iso));
  const statuses = async (user: string) => ((await ticketStore.call("list", { userId: user })).gifts as { status: string }[]).map(g => g.status).sort();
  const EV_EXP = Date.parse("2026-12-20T12:00:00+09:00");
  beforeAll(async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    at("2026-11-20T12:00:00+09:00");
    for (const id of [EV, RCV]) await member(id);
    const live = giftEventConfig({ GIFT_EVENT_ENABLED: "1", GIFT_EVENT_START: "2026-11-06 09:00:00", GIFT_EVENT_END: "2030-12-31 23:59:59" }, Date.now());
    expect(live.ticketExpiresAt).toBe(new Date(EV_EXP).toISOString());
    for (const id of ["q10-1", "q10-2"]) { await paidOrder(id, EV); expect((await afterPaidOrder(gift, id, live))?.issued).toMatchObject({ issued: true }); }
    // 1장은 선물 링크 → 받은 사람 원장으로(기한 그대로 12-20 12:00), 1장은 링크만 만들고 안 받음 → 다른 1장은 그대로.
    expect(await gift.call("link_next", { userId: EV, tokenHash: hash(200) })).toMatchObject({ ok: true, status: "gifted" });
    expect(await gift.call("claim", { userId: RCV, tokenHash: hash(200) })).toMatchObject({ ok: true, status: "claimed" });
  }, 120_000);
  afterAll(() => { vi.useRealTimers(); });

  it("11-30 23:59:58 KST·12-01 00:00:00 KST: 결제 증정 이용권·받은 선물·누나 보상 5장 모두 쓸 수 있다(11-30에 끝나지 않는다)", async () => {
    for (const t of ["2026-11-30T23:59:58+09:00", "2026-12-01T00:00:00+09:00"]) {
      at(t);
      expect(await readWallet(gift, EV)).toMatchObject({ usable: 1, giftable: 1, total: 1 });
      expect(Date.parse((await readWallet(gift, EV))!.expiresAt!)).toBe(EV_EXP);
      expect(await readWallet(gift, RCV)).toMatchObject({ ledger: 1, usable: 1 });
      expect(await readWallet(gift, SIS)).toMatchObject({ usable: 5, giftable: 5 });
    }
  });
  it("12-01 00:00:00 KST: 누나 계정 보상 5장(12-06 11:06 KST)은 그대로 쓸 수 있다", async () => {
    at("2026-12-01T00:00:00+09:00");
    expect(await readWallet(gift, SIS)).toMatchObject({ usable: 5, giftable: 5 });
    expect(Date.parse((await readWallet(gift, SIS))!.usableExpiresAt!)).toBe(SIS_EXP);
    expect(await gift.call("spend", { userId: SIS, requestId: "00000000-0000-4000-8000-00000000f602", productType: "saju_mbti_full" })).toMatchObject({ ok: true, moved: true });
    expect(await readWallet(gift, SIS)).toMatchObject({ ledger: 1, giftable: 4, usable: 5 });
  });
  it("12-06 11:06:45 KST까지는 5장, 11:06:47 KST에는 누나 계정 보상도 끝난다(원장으로 옮긴 1장 포함). 결제 증정 이용권은 남는다", async () => {
    at("2026-12-06T11:06:45+09:00");
    expect(await readWallet(gift, SIS)).toMatchObject({ usable: 5 });
    at("2026-12-06T11:06:47+09:00");
    expect(await readWallet(gift, SIS)).toMatchObject({ ledger: 0, usable: 0, giftable: 0, total: 0 });
    expect(await readWallet(gift, EV)).toMatchObject({ usable: 1, giftable: 1 });
  });
  it("12-20 11:59:59 KST까지 쓸 수 있고, 12:00:00 KST(받은 시각 + 30일)에 결제 증정 이용권·받은 선물이 끝난다 — 쓰기·선물·받기 모두 안 된다", async () => {
    at("2026-12-20T11:59:59+09:00");
    expect(await readWallet(gift, EV)).toMatchObject({ usable: 1 });
    expect(await readWallet(gift, RCV)).toMatchObject({ ledger: 1, usable: 1 });
    at("2026-12-20T12:00:00+09:00");
    expect(await readWallet(gift, EV)).toMatchObject({ ledger: 0, usable: 0, giftable: 0, total: 0, expiresAt: null, usableExpiresAt: null });
    expect(await statuses(EV)).toEqual(["claimed", "expired"]);
    expect(await gift.call("spend", { userId: EV, requestId: "00000000-0000-4000-8000-00000000f601", productType: "saju_mbti_full" })).toMatchObject({ ok: true, moved: false });
    expect(await gift.call("link_next", { userId: EV, tokenHash: hash(201) })).toMatchObject({ ok: false, code: "NO_GIFTABLE" });
    // 받은 선물(원장, 기한 12-20 12:00)도 끝: 지갑 0장, 원장 묶음 없음.
    expect(await readWallet(gift, RCV)).toMatchObject({ ledger: 0, usable: 0, total: 0 });
    const summary = (await h.db.query<{ r: { quantity: number; lots: unknown[] } }>("select report_tickets('summary',$1,'{}'::jsonb) r", [RCV])).rows[0].r;
    expect(summary).toMatchObject({ quantity: 0, lots: [] });
  });
});
