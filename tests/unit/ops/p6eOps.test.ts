// P6e-ops SQL(PGlite): 고객 요청 자동 처리 · 환불 경고 · 외부 환불 기록 · 환불된 책 판별 · 보상 이용권 A·B. 목업 토스, 외부 호출 0.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createHash, randomUUID } from "node:crypto";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { processRefunds } from "@/lib/ops/orders/refund";
import { afterPaidOrder, newGiftToken } from "@/lib/ops/gift/service";
import type { RefundProvider } from "@/lib/payment/tossRefundClient";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL } from "../../helpers/v5Scenarios";
import { TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";

type H = Awaited<ReturnType<typeof opsSql>>;
let h: H;
type Call = { call(a: string, d?: Record<string, unknown>): Promise<Record<string, unknown>> };
let order: Call, gift: Call, comp: Call, recon: Call;
const C = "33333333-3333-4333-8333-333333333333", D = "44444444-4444-4444-8444-444444444444", E = "55555555-5555-4555-8555-555555555555";
const HASH = createHash("sha256").update("p6e").digest("hex");
const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date("2026-10-27T03:00:00.000Z") }); if (!n.ok) throw new Error("payload"); return n.value; })();
const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); const r = (await h.db.query(sql, params)).rows[0] as T; await h.db.exec("set role service_role"); return r; };
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const rpcOf = (fn: string): Call => ({ call: (a, d = {}) => h.rpc(fn, a, d) });
const providerOf = (): RefundProvider => ({
  lookup: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: i.originalAmount, status: "DONE", method: "카드", isPartialCancelable: true, cancels: [] } }),
  cancel: async i => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: 0, status: "CANCELED", method: "카드", isPartialCancelable: true,
    cancels: [{ transactionKey: "tx", cancelAmount: i.amount, cancelReason: i.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString() }] } }),
});
const ops = () => ({ order, audit: async (e: { actor: "admin" | "system"; action: string; target: string; detail?: Record<string, unknown> }) => { await exec("insert into ops_audit_log(actor,action,target,detail) values($1,$2,$3,$4::jsonb)", [e.actor, e.action, e.target, JSON.stringify(e.detail ?? {})]); return true; } });
/** 결제 완료 주문 1건(회원). */
async function pay(id: string, user: string | null) {
  await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 1490, inputSnapshot: { reportInputPayload: payload } });
  await order.call("attach", { paymentOrderId: id, ...(user ? { userId: user } : {}), name: "회원", email: `${id}@example.com` });
  const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 1490 });
  await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token });
}
const codeOf = async (id: string) => (await one<{ order_code: string }>("select order_code from order_records where payment_order_id=$1", [id])).order_code;
const contact = (u: string, email = "c@example.com") => exec("insert into account_contacts(user_id,full_name,email,email_source) values($1,'회원',$2,'typed') on conflict do nothing", [u, email]);
const cfg = { enabled: true, aSelf: 1, aGift: 1, aDays: 60, bQty: 1, bDays: 30, products: ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] };
const sync = (userId: string, over: Record<string, unknown> = {}) => comp.call("sync", { userId, ...cfg, ...over });
const eventCfg = { active: true, start: "2026-01-01T00:00:00.000Z", end: "2027-01-01T00:00:00.000Z", maxPerAccount: 2, bonusMax: 2, products: ["saju_mbti_full"], validDays: 30 };

beforeAll(async () => {
  h = await opsSql();
  order = rpcOf("ops_order"); gift = rpcOf("ops_gift"); comp = rpcOf("ops_comp"); recon = rpcOf("ops_recon");
  await exec("insert into auth.users(id) values($1),($2),($3)", [C, D, E]);
}, 120_000);
afterAll(async () => { await h?.db.close(); });

describe("고객 요청 자동 처리", () => {
  it("환불이 끝나면 처리 전 요청이 처리 완료로 바뀌고 자동 메모(동작·시각)와 감사 로그가 남는다", async () => {
    await pay("rq1", A);
    await order.call("request", { paymentOrderId: "rq1", userId: A, reason: "calc_error", memo: "계산이 이상해요" });
    await order.call("request", { paymentOrderId: "rq1", userId: A, reason: "other", memo: "문의" });
    expect(await one("select count(*)::int n from order_requests where payment_order_id='rq1' and status='open'")).toEqual({ n: 2 });
    await order.call("refund_request", { paymentOrderId: "rq1", source: "admin", reason: "계산 오류" });
    expect(await processRefunds(ops(), providerOf(), { paymentOrderId: "rq1" })).toEqual([{ paymentOrderId: "rq1", state: "done" }]);
    const rows = (await h.db.query<{ status: string; resolved_by: string; admin_note: string }>("select status,resolved_by,admin_note from order_requests where payment_order_id='rq1'")).rows;
    expect(rows).toHaveLength(2);
    for (const r of rows) { expect(r.status).toBe("done"); expect(r.resolved_by).toBe("auto"); expect(r.admin_note).toMatch(/^자동 처리: 환불 완료 · \d{4}-\d{2}-\d{2} \d{2}:\d{2} \(KST\)$/); }
    const audit = await one<{ detail: { count: number; by: string }; actor: string }>("select actor,detail from ops_audit_log where action='request_auto_done' and target=$1", [await codeOf("rq1")]);
    expect(audit).toMatchObject({ actor: "system", detail: { count: 2, by: "환불 완료" } });
  });

  it("재생성·이용권 지급 뒤에는 autoclose로 처리 전 요청만 처리 완료로(이미 처리한 요청은 그대로), 두 번 불러도 한 번만", async () => {
    await pay("rq2", A);
    await order.call("request", { paymentOrderId: "rq2", userId: A, reason: "delayed", memo: "" });
    await order.call("request", { paymentOrderId: "rq2", userId: A, reason: "not_open", memo: "" });
    await exec("update order_requests set status='done',resolved_by='admin',admin_note='직접 처리',resolved_at=now() where payment_order_id='rq2' and reason='delayed'");
    expect(await recon.call("autoclose", { paymentOrderId: "rq2", label: "재생성 요청" })).toMatchObject({ ok: true, closed: 1 });
    expect(await recon.call("autoclose", { paymentOrderId: "rq2", label: "이용권 지급" })).toMatchObject({ ok: true, closed: 0 });
    const rows = (await h.db.query<{ reason: string; resolved_by: string; admin_note: string }>("select reason,resolved_by,admin_note from order_requests where payment_order_id='rq2' order by reason")).rows;
    expect(rows).toEqual([{ reason: "delayed", resolved_by: "admin", admin_note: "직접 처리" }, { reason: "not_open", resolved_by: "auto", admin_note: expect.stringMatching(/^자동 처리: 재생성 요청 · /) }]);
  });
});

describe("환불 경고", () => {
  it("이 주문의 이벤트 이용권이 쓰였거나 친구가 받았으면 경고, 안 쓴 이용권은 회수 예정으로만 센다", async () => {
    for (const id of ["w1", "w2", "w3"]) await pay(id, A);
    await exec("delete from gift_rewards"); // 앞 시험의 이벤트 이용권 정리
    await exec("insert into gift_rewards(owner_user_id,source_order_id,status,used_at,expires_at) values($1,'w1','used_self',now(),now()+interval '30 days')", [A]);
    await exec("insert into gift_rewards(owner_user_id,source_order_id,status,recipient_user_id,claimed_at,token_hash,expires_at) values($1,'w2','claimed',$2,now(),repeat('a',64),now()+interval '30 days')", [A, C]);
    await exec("insert into gift_rewards(owner_user_id,source_order_id,status,expires_at) values($1,'w3','available',now()+interval '30 days')", [A]);
    expect(await recon.call("refund_warnings", { paymentOrderId: "w1" })).toMatchObject({ ok: true, giftUsed: [{ status: "used_self" }], bonusSent: false });
    expect(await recon.call("refund_warnings", { paymentOrderId: "w2" })).toMatchObject({ giftUsed: [{ status: "claimed" }] });
    expect(await recon.call("refund_warnings", { paymentOrderId: "w3" })).toMatchObject({ giftUsed: [], giftPendingRevoked: 1, bonusSent: false });
  });

  it("선물받은 친구의 첫 결제 주문이면 보낸 사람에게 보너스가 나갔다는 경고(두 번째 결제에는 없음)", async () => {
    await exec("delete from gift_rewards");
    await exec("delete from order_records where user_id=$1", [C]);
    await exec("insert into gift_rewards(owner_user_id,source_order_id,status,recipient_user_id,claimed_at,bonus_granted_at,token_hash,expires_at) values($1,'w1','claimed',$2,now()-interval '1 day',now(),repeat('b',64),now()+interval '30 days')", [A, C]);
    await pay("bf1", C); await pay("bf2", C);
    expect(await recon.call("refund_warnings", { paymentOrderId: "bf1" })).toMatchObject({ bonusSent: true });
    expect(await recon.call("refund_warnings", { paymentOrderId: "bf2" })).toMatchObject({ bonusSent: false });
  });
});

describe("토스 상태 대조 · 외부 환불 기록", () => {
  it("대상 목록: 결제 완료로 남은 토스 주문만, 기존 주문(legacy)만/전체, 커서로 이어서", async () => {
    await pay("tg1", A);
    await exec("update order_records set legacy=true where payment_order_id='tg1'");
    const legacy = await recon.call("toss_targets", { scope: "legacy", limit: 25 });
    expect((legacy.targets as { orderCode: string; paymentKey: string }[]).map(t => t.paymentKey)).toEqual(["k-tg1"]);
    const all = await recon.call("toss_targets", { scope: "all", limit: 2 });
    expect(all).toMatchObject({ more: true }); expect((all.targets as unknown[]).length).toBe(2);
    const last = (all.targets as { createdAt: string; paymentOrderId: string }[]).at(-1)!;
    const next = await recon.call("toss_targets", { scope: "all", limit: 50, afterAt: last.createdAt, afterId: last.paymentOrderId });
    expect((next.targets as { paymentOrderId: string }[]).some(t => t.paymentOrderId === last.paymentOrderId)).toBe(false);
  });

  it("외부 환불 기록: 주문은 환불로, 환불 기록은 external, 안 쓴 이용권 회수, 요청 자동 처리, 책은 환불로 판별. 중복·금액 불일치는 거절", async () => {
    await pay("ex1", A);
    await order.call("request", { paymentOrderId: "ex1", userId: A, reason: "refund", memo: "토스에서 환불했어요" });
    await exec("insert into gift_rewards(owner_user_id,source_order_id,status,expires_at) values($1,'ex1','available',now()+interval '30 days')", [A]);
    const reportId = (await one<{ report_id: string }>("select report_id from payment_orders where payment_order_id='ex1'")).report_id;
    expect(await recon.call("report_refunded", { reportId })).toEqual({ ok: true, refunded: false });
    expect(await recon.call("external_refund", { paymentOrderId: "ex1", amount: 1000, adminUserId: A })).toMatchObject({ ok: false, code: "AMOUNT_MISMATCH" });
    const done = await recon.call("external_refund", { paymentOrderId: "ex1", amount: 1490, adminUserId: A, canceledAt: "2026-10-01T05:00:00.000Z" });
    expect(done).toMatchObject({ ok: true, giftRevoked: true });
    expect(await one("select status,refunded_at from payment_orders where payment_order_id='ex1'")).toMatchObject({ status: "refunded" });
    expect(await one("select state,source,provider_status,amount from order_refunds where payment_order_id='ex1'")).toEqual({ state: "done", source: "external", provider_status: "CANCELED", amount: 1490 });
    expect(await one("select status from gift_rewards where source_order_id='ex1'")).toEqual({ status: "revoked" });
    expect(await one("select status,resolved_by,admin_note from order_requests where payment_order_id='ex1'")).toMatchObject({ status: "done", resolved_by: "auto", admin_note: expect.stringContaining("자동 처리: 외부 환불 기록") });
    expect(await recon.call("report_refunded", { reportId })).toEqual({ ok: true, refunded: true });
    expect(await recon.call("external_refund", { paymentOrderId: "ex1", amount: 1490 })).toMatchObject({ ok: false, code: "ALREADY_REFUNDED" });
    // 관리자 환불 하루 상한은 외부 환불을 세지 않는다(source='admin'만).
    expect((await one<{ n: number }>("select count(*)::int n from order_refunds where source='admin' and payment_order_id='ex1'")).n).toBe(0);
    // 이미 환불 기록(요청됨)이 있는 주문은 외부 환불로 덮지 않는다.
    await pay("ex2", A);
    await order.call("refund_request", { paymentOrderId: "ex2", source: "admin", reason: "시험" });
    expect(await recon.call("external_refund", { paymentOrderId: "ex2", amount: 1490 })).toMatchObject({ ok: false, code: "REFUND_RECORD_EXISTS" });
    expect(await recon.call("external_refund", { paymentOrderId: "nope", amount: 1490 })).toMatchObject({ ok: false, code: "ORDER_NOT_FOUND" });
  });
});

describe("보상 이용권 A·B", () => {
  it("B(기존 무료 이벤트 가입자): 꺼짐이면 지급 없음 → 켜짐+정보 입력 전이면 대기 → 정보 입력 뒤 1장·30일·4종, 두 번 불러도 한 번만", async () => {
    await exec("insert into upgrade_roster(user_id,joined_at,cutoff) values($1,now()-interval '60 days','2026-10-31T15:00:00Z')", [D]);
    expect(await sync(D, { enabled: false })).toMatchObject({ ok: true, tier: "B", state: "off" });
    expect(await sync(D)).toMatchObject({ ok: true, tier: "B", state: "waiting_profile" });
    expect(await one("select count(*)::int n from report_ticket_grants where user_id=$1", [D])).toEqual({ n: 0 });
    await contact(D);
    const first = await sync(D);
    expect(first).toMatchObject({ ok: true, tier: "B", state: "granted", quantity: 1, fresh: true });
    expect(await sync(D)).toMatchObject({ state: "granted", fresh: false });
    const grant = await one<{ quantity: number; days: number; scopes: string[]; reason: string }>("select quantity,round(extract(epoch from expires_at-granted_at)/86400)::int days,product_scopes scopes,reason from report_ticket_grants where user_id=$1", [D]);
    expect(grant).toEqual({ quantity: 1, days: 30, scopes: cfg.products, reason: "COMP_B" });
    expect(await one("select count(*)::int n from gift_rewards where owner_user_id=$1", [D])).toEqual({ n: 0 });
  });

  it("보상 이용권은 설정한 4종 상품만 만들 수 있다(대운·세운은 거절) — 사용하면 1+1 이벤트 이용권은 생기지 않는다", async () => {
    const redeem = (productType: string) => h.rpc("report_tickets", "redeem", D, { requestId: randomUUID(), inputHash: HASH, productType, reportId: `report_${randomUUID().replaceAll("-", "")}`, input: { a: 1 }, displayName: "검수" });
    expect(await redeem("major_fortune")).toMatchObject({ ok: false, code: "NO_USABLE_TICKET" });
    expect(await redeem("annual_fortune")).toMatchObject({ ok: false, code: "NO_USABLE_TICKET" });
    expect(await redeem("career_money_study")).toMatchObject({ ok: true, fresh: true });
    expect(await redeem("saju_mbti_full")).toMatchObject({ ok: false, code: "NO_USABLE_TICKET" }); // 1장뿐
    expect(await one("select count(*)::int n from gift_rewards where owner_user_id=$1", [D])).toEqual({ n: 0 }); // 사용해도 이벤트 이용권 없음
    expect(await afterPaidOrder(gift as never, "nonexistent", eventCfg)).toMatchObject({ issued: { issued: false } });
  });

  it("A: 환불 완료 주문만(주문코드·토스 주문번호), 계정 연결 필요. 지정하면 정보 입력 뒤 본인용 1장+선물 링크 1장(60일), 선물은 링크 전용", async () => {
    await pay("ca1", B);
    expect(await comp.call("designate", { orderCode: await codeOf("ca1"), adminUserId: A })).toMatchObject({ ok: false, code: "NOT_REFUNDED", status: "paid" });
    await order.call("refund_request", { paymentOrderId: "ca1", source: "admin", reason: "계산 오류" });
    await processRefunds(ops(), providerOf(), { paymentOrderId: "ca1" });
    expect(await comp.call("designate", { orderCode: "GR-ZZZZ" })).toMatchObject({ ok: false, code: "ORDER_NOT_FOUND" });
    expect(await comp.call("designate", { providerOrderId: "ca1", adminUserId: A })).toMatchObject({ ok: true, userId: B, already: false });
    expect(await comp.call("designate", { orderCode: (await codeOf("ca1")).toLowerCase(), adminUserId: A })).toMatchObject({ ok: true, already: true });
    // 비회원 주문은 계정이 없어 지정할 수 없다.
    await pay("ca2", null);
    await order.call("refund_request", { paymentOrderId: "ca2", source: "admin", reason: "시험" });
    await processRefunds(ops(), providerOf(), { paymentOrderId: "ca2" });
    expect(await comp.call("designate", { providerOrderId: "ca2" })).toMatchObject({ ok: false, code: "NO_ACCOUNT" });

    expect(await sync(B)).toMatchObject({ tier: "A", state: "waiting_profile" });
    await contact(B, "b@example.com");
    expect(await sync(B)).toMatchObject({ tier: "A", state: "granted", quantity: 2, fresh: true });
    expect(await sync(B)).toMatchObject({ fresh: false });
    expect(await one("select quantity,round(extract(epoch from expires_at-granted_at)/86400)::int days,reason from report_ticket_grants where user_id=$1 and reason='COMP_A'", [B])).toEqual({ quantity: 1, days: 60, reason: "COMP_A" });
    const giftRow = await one<{ id: string; kind: string; gift_only: boolean; source_order_id: string | null; days: number; scopes: string[] }>("select id,kind,gift_only,source_order_id,round(extract(epoch from expires_at-created_at)/86400)::int days,product_scopes scopes from gift_rewards where owner_user_id=$1", [B]);
    expect(giftRow).toMatchObject({ kind: "comp", gift_only: true, source_order_id: null, days: 60, scopes: cfg.products });
    // 선물은 링크 전용: 내가 쓰기는 거절, 링크 → 친구(C)가 받으면 친구에게도 같은 4종 범위 이용권.
    expect(await gift.call("use_self", { userId: B, giftId: giftRow.id })).toMatchObject({ ok: false, code: "GIFT_LINK_ONLY" });
    const link = newGiftToken();
    expect(await gift.call("link", { userId: B, giftId: giftRow.id, tokenHash: link.hash })).toMatchObject({ ok: true, status: "gifted" });
    expect(await gift.call("claim", { userId: C, tokenHash: link.hash })).toMatchObject({ ok: false, code: "PROFILE_REQUIRED" });
    await contact(C, "friend@example.com");
    expect(await gift.call("claim", { userId: C, tokenHash: link.hash })).toMatchObject({ ok: true, status: "claimed" });
    expect(await one("select product_scopes scopes from report_ticket_grants where user_id=$1 and reason='EVENT_GIFT_RECEIVED'", [C])).toEqual({ scopes: cfg.products });
    // 링크 확인(peek): 받은 사람에게만 received=true, 보낸 사람은 mine, 제3자는 둘 다 아님(이전엔 제3자에게도 "받았어요"가 나가던 결함).
    expect(await gift.call("peek", { tokenHash: link.hash, userId: C })).toMatchObject({ status: "claimed", mine: false, received: true });
    expect(await gift.call("peek", { tokenHash: link.hash, userId: B })).toMatchObject({ status: "claimed", mine: true, received: false });
    expect(await gift.call("peek", { tokenHash: link.hash, userId: D })).toMatchObject({ status: "claimed", mine: false, received: false });
    expect(await gift.call("peek", { tokenHash: link.hash, userId: "" })).toMatchObject({ received: false });
    // 목록: 주문 없는 보상도 보이고 kind·giftOnly가 내려간다.
    const list = await gift.call("list", { userId: B });
    expect((list.gifts as { kind: string; giftOnly: boolean; orderCode: string | null }[])[0]).toMatchObject({ kind: "comp", giftOnly: true, orderCode: null });
    // 친구가 첫 결제를 해도 보상 선물에는 1+1 보너스가 없다.
    await pay("cf1", C);
    expect(await afterPaidOrder(gift as never, "cf1", eventCfg)).toMatchObject({ bonus: { granted: false } });
    expect(await one("select bonus_granted_at from gift_rewards where id=$1", [giftRow.id])).toEqual({ bonus_granted_at: null });
  });

  it("B로 받은 뒤 A로 지정되면 본인용은 B로 받은 1장으로 갈음하고 선물 링크 1장만 더 받는다(총 2장)", async () => {
    await exec("insert into upgrade_roster(user_id,joined_at,cutoff) values($1,now()-interval '60 days','2026-10-31T15:00:00Z')", [E]);
    await contact(E, "e@example.com");
    expect(await sync(E)).toMatchObject({ tier: "B", state: "granted", quantity: 1 });
    await pay("cu1", E);
    await order.call("refund_request", { paymentOrderId: "cu1", source: "admin", reason: "계산 오류" });
    await processRefunds(ops(), providerOf(), { paymentOrderId: "cu1" });
    await comp.call("designate", { orderCode: await codeOf("cu1") });
    expect(await sync(E)).toMatchObject({ tier: "A", state: "granted", quantity: 2, fresh: true });
    expect(await one("select count(*)::int n from report_ticket_grants where user_id=$1", [E])).toEqual({ n: 1 }); // 본인용 추가 지급 없음
    expect(await one("select count(*)::int n from gift_rewards where owner_user_id=$1 and kind='comp'", [E])).toEqual({ n: 1 });
  });

  it("설정이 잘못되면(상품 없음·유효일 0·장수 0) 지급하지 않는다", async () => {
    await contact(A);
    await exec("insert into upgrade_roster(user_id,joined_at,cutoff) values($1,now()-interval '60 days','2026-10-31T15:00:00Z') on conflict do nothing", [A]);
    await exec("delete from comp_grants where user_id=$1", [A]);
    expect(await sync(A, { products: [] })).toMatchObject({ ok: false, code: "COMP_CONFIG_INVALID" });
    expect(await sync(A, { bDays: 0 })).toMatchObject({ ok: false, code: "COMP_CONFIG_INVALID" });
    expect(await sync(A, { bQty: 0 })).toMatchObject({ ok: false, code: "COMP_CONFIG_INVALID" });
    expect(await one("select count(*)::int n from comp_grants where user_id=$1", [A])).toEqual({ n: 0 });
  });

  it("관리자 현황: 등급별 인원·지급·사용·입력 전, 구성원별 상태", async () => {
    const r = await comp.call("admin", { limit: 50 });
    const counts = r.counts as Record<"A" | "B", { total: number; granted: number; used: number; waitingProfile: number; ready: number }>;
    // A등급: 사용자 B(환불 ca1)·E(환불 cu1) 둘 다 지급. B등급: 명단 중 A가 아닌 D·A. D는 지급·사용 1, 사용자 A는 설정 오류로 지급 대기(ready).
    expect(counts.A).toMatchObject({ total: 2, granted: 2, waitingProfile: 0 });
    expect(counts.B.total).toBe(2);
    expect(counts.B).toMatchObject({ granted: 1, used: 1, ready: 1 });
    const members = r.members as { userId: string; tier: string; state: string; usedTickets: number; usedGifts: number; orderCode: string | null }[];
    expect(members.find(m => m.userId === D)).toMatchObject({ tier: "B", state: "granted", usedTickets: 1 });
    expect(members.find(m => m.userId === B)).toMatchObject({ tier: "A", state: "granted", usedGifts: 1 });
    expect(members.find(m => m.userId === E)).toMatchObject({ tier: "A", state: "granted", usedGifts: 0 });
    expect(members.find(m => m.userId === B)?.orderCode).toMatch(/^GR-/);
  });
});
