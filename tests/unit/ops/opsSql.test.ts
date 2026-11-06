import { readFileSync } from "node:fs";
// P6d-ops SQL(PGlite): 결제·이용권 큐 보류/포기·자동 환불·정식본 교체·주문코드·가입 정보·탈퇴·이벤트. 목업 LLM·목업 토스, 외부 호출 0.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { runPaidReportJob, type PaidV5Builder } from "@/lib/payment/paidReportReliability";
import { WRITER_DISABLED_RUNTIME as runtime } from "@/lib/report-generation/writerDisabled";
import { runPaidV5Job, type PaidJobOps } from "@/lib/ops/generation/paidJob";
import { runLaneJob } from "@/lib/ops/generation/supervisor";
import { processRefunds } from "@/lib/ops/orders/refund";
import { afterPaidOrder, newGiftToken } from "@/lib/ops/gift/service";
import { runTicketPublicationJob } from "@/lib/tickets/publicationWorker";
import type { RefundProvider } from "@/lib/payment/tossRefundClient";
import { seedPaid } from "../../helpers/paidWorkerSql";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL, enqueue, mockTextFor } from "../../helpers/v5Scenarios";
import { TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { mockAnthropic } from "../../helpers/opsMocks";

type H = Awaited<ReturnType<typeof opsSql>>;
let h: H, ops: PaidJobOps & { gift: { call(a: string, d: Record<string, unknown>): Promise<Record<string, unknown>> } };
const policyAt = "2026-10-27T03:00:00.000Z";
const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
const { text } = mockTextFor(payload, policyAt);
const one = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); const r = (await h.db.query(sql, params)).rows[0] as T; await h.db.exec("set role service_role"); return r; };
const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
const envFor = (behaviors: Parameters<typeof mockAnthropic>[0]) => { const m = mockAnthropic(behaviors); return { m, env: { openAiKey: null, deps: { fetchImpl: m.fetch, sleep: async () => undefined, people: async () => [], apiKey: "test-key" } } }; };
const paidBuilder = (env: ReturnType<typeof envFor>["env"]): PaidV5Builder => async (job, finish) => { try { return { settled: await runPaidV5Job({ ...job, policyAt }, finish, { ops, env }) }; } catch (e) { console.log("BUILDER_ERR", e); throw e; } };
const providerOf = (status: "DONE" | "CANCELED" = "DONE"): RefundProvider & { cancels: number } => {
  const p = { cancels: 0, lookup: async (i: { paymentKey: string; providerOrderId: string; originalAmount: number }) => ({ ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: status === "CANCELED" ? 0 : i.originalAmount, status, method: "카드", isPartialCancelable: true, cancels: [] } }),
    cancel: async (i: { paymentKey: string; providerOrderId: string; originalAmount: number; amount: number; cancelReason: string }) => { p.cancels++; return { ok: true as const, payment: { paymentKey: i.paymentKey, orderId: i.providerOrderId, currency: "KRW" as const, totalAmount: i.originalAmount, balanceAmount: 0, status: "CANCELED", method: "카드", isPartialCancelable: true, cancels: [{ transactionKey: "tx", cancelAmount: i.amount, cancelReason: i.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString() }] } }; } };
  return p as never;
};

beforeAll(async () => {
  h = await opsSql();
  const call = (fn: string) => ({ call: (a: string, d: Record<string, unknown> = {}) => h.rpc(fn, a, d) });
  ops = { generation: call("ops_generation"), order: call("ops_order"), gift: call("ops_gift"),
    async audit(e) { await h.db.query("insert into ops_audit_log(actor,action,target,detail) values($1,$2,$3,$4::jsonb)", [e.actor, e.action, e.target, JSON.stringify(e.detail ?? {})]); return true; } };
  process.env.WRITER_V5_PRODUCTS = "saju_mbti_full";
}, 120_000);
afterAll(async () => { delete process.env.WRITER_V5_PRODUCTS; await h?.db.close(); });

describe("주문 기록", () => {
  it("주문마다 GR-XXXX 코드, 기존 주문에도 코드(legacy), 결제 준비 때 구매자를 붙인다", async () => {
    await h.paid.call("create_order", { paymentOrderId: "po_ready_1", providerOrderId: "provider_order_ready_1", productType: "saju_mbti_full", provider: "toss", amount: 1490, inputSnapshot: { reportInputPayload: payload } });
    const att = await ops.order.call("attach", { paymentOrderId: "po_ready_1", userId: A, name: "하람", email: "Haram@Example.com", phone: "01012345678", noticeVersion: "p6d-2026-11-04" });
    expect(att.orderCode).toMatch(/^GR-[2-9A-HJKMNP-Z]{4}$/);
    const row = await one<{ buyer_email: string; user_id: string }>("select * from order_records where payment_order_id='po_ready_1'");
    expect(row).toMatchObject({ buyer_email: "haram@example.com", user_id: A });
    expect((await ops.order.call("attach", { paymentOrderId: "nope", name: "x", email: "a@b.cd" })).code).toBe("ORDER_NOT_READY");
  });
});

describe("결제 경로 생성 감독", () => {
  it("출력 전 실패 → 보류(RETRYING, 1분 뒤), 다음 시도 성공 → 정식본 발행·기록", async () => {
    const reportId = await seedPaid(h.paid, "po_paid_1", payload);
    const fail = envFor([{ status: 401 }]);
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, paidBuilder(fail.env))).toMatchObject({ ok: true, status: "RETRYING" });
    const job = await one<{ status: string; attempt_count: number; run_number: number; wait: number }>("select status,attempt_count,run_number,extract(epoch from next_retry_at-now())::float8 wait from report_generation_jobs where report_id=$1", [reportId]);
    expect(job).toMatchObject({ status: "RETRYING", attempt_count: 0, run_number: 2 }); expect(job.wait).toBeGreaterThan(50); expect(job.wait).toBeLessThanOrEqual(61);
    expect((await one<{ status: string }>("select status from paid_report_snapshots where report_id=$1", [reportId])).status).toBe("RETRYING");
    await exec("update report_generation_jobs set next_retry_at=now() where report_id=$1", [reportId]);
    const ok = envFor([{ text }]);
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, paidBuilder(ok.env))).toMatchObject({ ok: true, status: "COMPLETED" });
    const snap = await one<{ status: string; v: string; w: string }>("select status,snapshot_json->>'productVersion' v,snapshot_json->'evidencePacket'->'meta'->'writer'->>'provider' w from paid_report_snapshots where report_id=$1", [reportId]);
    expect(snap).toEqual({ status: "COMPLETED", v: "v5", w: "anthropic" });
    const st = await h.rpc("ops_generation", "state", { reportId });
    expect((st.state as { phase: string; failures: number }).phase).toBe("official"); expect((st.state as { failures: number }).failures).toBe(1);
    expect((st.runs as { outcome: string }[]).map(r => r.outcome)).toEqual(["deferred", "published"]);
    expect((await one<{ n: number }>("select count(*)::int n from ops_writer_chapters where report_id=$1", [reportId])).n).toBe(0);

    // 관리자 재생성: 공개된 Book을 새 정식본으로 바꾸고 이전 Book을 보관한다(발행 시각·열람 기한 유지).
    const before = await one<{ p: string; e: string }>("select published_at::text p, expires_at::text e from paid_report_snapshots where report_id=$1", [reportId]);
    expect((await h.rpc("ops_generation", "regenerate", { reportId })).ok).toBe(true);
    const again = envFor([{ text }]);
    expect(await runLaneJob({ store: ops.generation, ...again.env })).toMatchObject({ ok: true, outcome: "replaced" });
    expect(await one("select published_at::text p, expires_at::text e from paid_report_snapshots where report_id=$1", [reportId])).toEqual(before);
    expect((await one<{ n: number; e: string }>("select count(*)::int n, max(edition) e from book_snapshot_versions where report_id=$1", [reportId]))).toEqual({ n: 1, e: "previous" });
  }, 180_000);

  it("24시간 포기 → 확인 필요 + 자동 환불 요청 → 토스 취소(목업) → 환불 완료, Book은 열리지 않는다", async () => {
    const reportId = await seedPaid(h.paid, "po_paid_2", payload);
    await h.rpc("ops_generation", "begin", { reportId, origin: "paid", originRef: "po_paid_2" });
    await exec("update book_generation_state set first_failure_at=now()-interval '24 hours',failures=9 where report_id=$1", [reportId]);
    const fail = envFor([{ status: 401 }]);
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, paidBuilder(fail.env))).toMatchObject({ ok: true, status: "FAILED_REQUIRES_ATTENTION" });
    expect(await one("select state,source from order_refunds where payment_order_id='po_paid_2'")).toEqual({ state: "requested", source: "auto" });
    const toss = providerOf();
    expect(await processRefunds(ops, toss)).toEqual([{ paymentOrderId: "po_paid_2", state: "done" }]);
    expect(toss.cancels).toBe(1);
    expect((await one<{ status: string }>("select status from payment_orders where payment_order_id='po_paid_2'")).status).toBe("refunded");
    expect((await h.paid.call("read_report", { reportId })).code).toBe("REPORT_NOT_FOUND");
    expect((await one<{ n: number }>("select count(*)::int n from ops_audit_log where target='po_paid_2'")).n).toBe(2);
    // 같은 키로 다시 돌려도 두 번 취소하지 않는다.
    expect(await processRefunds(ops, toss)).toEqual([]);
    // 관리자 환불 하루 상한은 DB가 잠금 안에서 센다(건수 0 상한 → 바로 차단).
    const reportId3 = await seedPaid(h.paid, "po_paid_3", payload);
    expect(reportId3).toMatch(/^report_/);
    const capped = await ops.order.call("refund_request", { paymentOrderId: "po_paid_3", source: "admin", reason: "시험", capCount: 0, capAmount: 50000, dayStart: "2026-01-01T00:00:00Z", dayEnd: "2027-01-01T00:00:00Z" });
    expect(capped).toMatchObject({ ok: false, code: "REFUND_DAILY_CAP" });
  }, 180_000);
});

describe("이용권 경로 생성 감독", () => {
  it("보류는 큐로 되돌리고 not_before 전에는 다시 집지 않는다 → 성공하면 정식본", async () => {
    const job = await enqueue(h);
    const fail = envFor([{ status: 401 }]);
    expect(await runTicketPublicationJob(h.queue, undefined, { ...fail.env.deps, ops: ops.generation, openAiKey: null })).toMatchObject({ state: "QUEUED", code: "DEFERRED" });
    expect((await h.queue.call("claim", null, { v5Products: ["saju_mbti_full"] })).empty).toBe(true);
    await exec("update report_ticket_redemptions set not_before=now() where id=$1", [job.redemptionId]);
    const ok = envFor([{ text }]);
    expect(await runTicketPublicationJob(h.queue, undefined, { ...ok.env.deps, ops: ops.generation, openAiKey: null })).toMatchObject({ state: "COMPLETED", edition: "official" });
  }, 180_000);

  it("워커가 죽으면(작가 lease 만료) 회수는 결정론 완성 없이 큐로 되돌리고, 이전 토큰은 막힌다", async () => {
    const job = await enqueue(h);
    const c = await h.queue.call("claim", null, { v5Products: ["saju_mbti_full"] });
    expect(c.redemptionId).toBe(job.redemptionId);
    await exec("update report_ticket_redemptions set writer_lease_until=now()-interval '1 second' where id=$1", [job.redemptionId]);
    expect(await h.queue.call("recover", null, {})).toMatchObject({ empty: true, requeued: 1 });
    expect((await h.queue.call("save-chapter", A, { redemptionId: job.redemptionId, token: c.token, n: 1, source: "writer", chapter: { n: 1 } })).code).toBe("STALE_LEASE");
    expect((await one<{ state: string }>("select state from report_ticket_redemptions where id=$1", [job.redemptionId])).state).toBe("QUEUED");
    const again = await h.queue.call("claim", null, { v5Products: ["saju_mbti_full"] });
    expect(again.redemptionId).toBe(job.redemptionId); expect(again.token).not.toBe(c.token);
    await h.queue.call("reverse", A, { redemptionId: job.redemptionId, token: again.token, reason: "TEST" });
  }, 60_000);
});

describe("가입 정보·탈퇴", () => {
  it("저장: 기존 가입자 명단에 있으면 업그레이드 자격, 마케팅 동의·철회는 동의 이력에 추가", async () => {
    await exec("insert into upgrade_roster(user_id,joined_at,cutoff) values($1,now()-interval '30 days','2026-10-31T15:00:00Z')", [A]);
    const saved = await h.rpc("ops_account", "save", A, { requestId: crypto.randomUUID(), name: "하람", email: "haram@example.com", emailSource: "typed", phone: "", marketing: true, marketingVersion: "2026-11-04.1" });
    expect(saved.contact).toMatchObject({ name: "하람", upgradeState: "eligible", marketing: true });
    await h.rpc("ops_account", "save", A, { requestId: crypto.randomUUID(), name: "하람", email: "haram@example.com", emailSource: "typed", marketing: false, marketingVersion: "2026-11-04.1" });
    const events = await h.db.query<{ is_agreed: boolean; source: string }>("select is_agreed,source from account_consent_events where user_id=$1 and consent_type='marketing' order by id", [A]);
    expect(events.rows).toEqual([{ is_agreed: true, source: "first_login" }, { is_agreed: false, source: "withdrawal" }]);
    // 공급자 사실: 채널 값이 없으면(토큰 없음) 이전 값을 둔다. 보상 기본값은 none.
    await h.rpc("ops_account", "facts", A, { provider: "kakao", email: "haram@example.com", emailTrusted: true, channel: "added" });
    await h.rpc("ops_account", "facts", A, { provider: "kakao", email: "haram@example.com", emailTrusted: true });
    expect((await h.rpc("ops_account", "facts_read", A, {})).facts).toMatchObject({ kakaoChannel: "added", channelReward: "none", emailTrusted: true });
  });

  it("이벤트(P 추가 C 이후): 결제 1건 → 1장(상한 없음), 본인 사용·선물 링크·받는 사람은 정보 화면 필요·첫 결제 보너스 없음", async () => {
    // 운영과 같은 최신 SQL(최종 A 이벤트·배포 직후 고침·P 추가)까지 올린다.
    await h.db.exec(`reset role; ${["20261106100000_v5_final4_event_comp.sql", "20261106200000_v5_deploy_gift_pending_alias.sql", "20261107090000_v5_perf_event_tickets.sql"].map(f => readFileSync(`supabase/migrations/${f}`, "utf8")).join("\n")} set role service_role;`);
    const cfg = { active: true, start: "2026-01-01T00:00:00.000Z", end: "2027-01-01T00:00:00.000Z", products: ["saju_mbti_full"], ticketExpiresAt: new Date(Date.now() + 20 * 86_400_000).toISOString() };
    const pay = async (id: string, user: string) => { await h.paid.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: "saju_mbti_full", provider: "toss", amount: 1490, inputSnapshot: { reportInputPayload: payload } });
      await ops.order.call("attach", { paymentOrderId: id, userId: user, name: "회원", email: "m@example.com" });
      const claim = await h.paid.call("confirm_claim", { orderId: id, paymentKey: `k-${id}`, amount: 1490 }); await h.paid.call("confirm_finish", { orderId: id, paymentKey: `k-${id}`, token: claim.token }); };
    for (const id of ["g1", "g2", "g3"]) await pay(id, A);
    const issued = await Promise.all(["g1", "g2", "g3"].map(id => afterPaidOrder(ops.gift, id, cfg)));
    expect(issued.map(r => r?.issued.issued)).toEqual([true, true, true]); // P 추가 C: 계정당 상한 없음
    const gifts = ((await ops.gift.call("list", { userId: A })).gifts as { id: string }[]);
    expect((await ops.gift.call("use_self", { userId: A, giftId: gifts[0].id })).status).toBe("used_self");
    const link = newGiftToken();
    expect((await ops.gift.call("link", { userId: A, giftId: gifts[1].id, tokenHash: link.hash })).status).toBe("gifted");
    expect((await ops.gift.call("claim", { userId: B, tokenHash: link.hash })).code).toBe("PROFILE_REQUIRED");
    expect(((await h.rpc("ops_account", "save", B, { requestId: crypto.randomUUID(), name: "서윤", email: "seoyun@example.com", emailSource: "typed", marketing: false, marketingVersion: "2026-11-04.1" })).contact as { upgradeState: string }).upgradeState).toBe("none");
    expect((await ops.gift.call("claim", { userId: A, tokenHash: link.hash })).code).toBe("GIFT_SELF");
    expect((await ops.gift.call("claim", { userId: B, tokenHash: link.hash })).status).toBe("claimed");
    const before = Number((await h.tickets.call("summary", A, {})).quantity);
    await pay("g4", B);
    const g4 = await afterPaidOrder(ops.gift, "g4", cfg);
    expect(g4).not.toHaveProperty("bonus"); expect(g4?.issued.issued).toBe(true);
    expect(Number((await h.tickets.call("summary", A, {})).quantity)).toBe(before); // 친구 첫 결제 보너스 없음
    // 환불: 그 주문에서 나온 아직 안 쓴 이용권은 회수(revoked), 다른 주문의 쓴 이용권(본인 사용·친구가 받음)은 그대로.
    expect(await ops.order.call("refund_request", { paymentOrderId: "g4", source: "admin", reason: "시험" })).toMatchObject({ ok: true });
    expect(await processRefunds(ops, providerOf(), { paymentOrderId: "g4" })).toEqual([{ paymentOrderId: "g4", state: "done" }]);
    expect(await one("select status,token_hash from gift_rewards where source_order_id='g4'")).toEqual({ status: "revoked", token_hash: null });
    expect((await h.db.query<{ status: string }>("select status from gift_rewards where source_order_id in ('g1','g2','g3') order by status")).rows.map(r => r.status)).toEqual(["available", "claimed", "used_self"]);
  }, 120_000);

  it("탈퇴: 주문은 분리 보관, 연락처·프로필·출생 입력 삭제, Book은 열람 종료", async () => {
    const reportId = await seedPaid(h.paid, "po_withdraw", payload);
    await exec("update order_records set user_id=$1,buyer_name='하람',buyer_email='haram@example.com' where payment_order_id='po_withdraw'", [A]);
    await exec("update paid_report_snapshots set status='COMPLETED',snapshot_json='{\"reportId\":\"x\"}'::jsonb,published_at=now(),expires_at=now()+interval '2160 hours',gate_version='paid-report-v1' where report_id=$1", [reportId]);
    const r = await h.rpc("ops_account", "withdraw", A, { retainUntil: "2031-11-04T00:00:00.000Z" });
    expect(r.ok).toBe(true);
    expect(await one("select buyer_email,retain_until::date::text d from retained_order_records where payment_order_id='po_withdraw'")).toEqual({ buyer_email: "haram@example.com", d: "2031-11-04" });
    expect(await one("select user_id,buyer_name,buyer_email from order_records where payment_order_id='po_withdraw'")).toEqual({ user_id: null, buyer_name: null, buyer_email: null });
    expect(await one("select status,snapshot_json from paid_report_snapshots where report_id=$1", [reportId])).toEqual({ status: "EXPIRED", snapshot_json: null });
    expect((await one<{ n: number }>("select count(*)::int n from report_input_snapshots where order_id='po_withdraw'")).n).toBe(0);
    for (const t of ["account_profiles", "account_contacts", "account_provider_facts"]) expect((await one<{ n: number }>(`select count(*)::int n from ${t} where user_id=$1`, [A])).n).toBe(0);
  }, 120_000);
});
