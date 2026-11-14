// W3 P2 30분 결론: 생성 대기 화면의 진행 상태는 실제 표(Book·결제 주문·환불·이용권 접수·감독)에서만 정한다.
// 실제 SQL(PGlite, 같은 migration)로 표·칸 이름까지 확인한다. 외부 호출 0, 쓰기는 시험 준비(seed)만.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { readBookFacts, readGenerationProgress, readRefundedBeforePublish, type RowReader } from "@/components/report/generationProgressServer";
import { GET } from "@/app/api/reports/[reportId]/progress/route";
import { seedPaid } from "../../helpers/paidWorkerSql";
import { opsSql } from "../../helpers/opsSql";
import { enqueue, RAW_FULL } from "../../helpers/v5Scenarios";
import { TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";

describe("실제 표 읽기(PGlite)", () => {
  type H = Awaited<ReturnType<typeof opsSql>>;
  let h: H;
  const policyAt = "2026-10-27T03:00:00.000Z";
  const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
  const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
  /** 운영 PostgREST 한 행 읽기와 같은 모양(표·칸 이름이 틀리면 여기서 실패한다). */
  const rows: RowReader = async (table, columns, [column, value]) => {
    await h.db.exec("reset role");
    try { return (await h.db.query<Record<string, unknown>>(`select ${columns} from public.${table} where ${column}=$1 limit 1`, [value])).rows[0] ?? null; }
    finally { await h.db.exec("set role service_role"); }
  };
  const progressCalls: Record<string, unknown>[] = [];
  const progress = { call: async (_a: string, data: Record<string, unknown>) => { progressCalls.push(data); return { ok: true, done: 3, total: 13, first: { title: "1장" } }; } };
  const NOW = Date.parse("2026-11-14T03:00:00Z");
  const deps = { rows, progress, now: () => NOW };

  beforeAll(async () => { h = await opsSql(); }, 120_000);
  afterAll(async () => { await h?.db.close(); });

  it("결제 책: 결제 확인 시각부터 · 1차 → 2차 → 포기(확인 중) → 자동 환불 요청(취소 중) → 환불 끝(취소 끝)", async () => {
    const reportId = await seedPaid(h.paid, "po_conclusion_1", payload);
    const facts = await readBookFacts(reportId, rows, NOW);
    expect(facts).toMatchObject({ origin: "paid", paymentStatus: "paid", refundState: null, failures: 0, redemptionId: null });
    const paidAt = (await h.db.query<{ paid_at: Date }>("select paid_at from payment_orders where payment_order_id='po_conclusion_1'")).rows[0].paid_at;
    expect(facts?.startedAt).toBe(new Date(paidAt).toISOString());
    const first = await readGenerationProgress(reportId, { deps });
    expect(first).toEqual({ state: "making", stage: "writing", origin: "paid", attempt: 1, chapters: { done: 3, total: 13, firstReady: true }, serverNow: new Date(NOW).toISOString(), startedAt: facts?.startedAt });
    expect(progressCalls.at(-1)).toEqual({ reportId }); // 결제 책은 주소로 장 진행률을 읽는다
    expect(JSON.stringify(first)).not.toMatch(/po_conclusion|1290|amount|paymentKey|title/);

    await h.rpc("ops_generation", "begin", { reportId, origin: "paid", originRef: "po_conclusion_1" });
    await exec("update book_generation_state set failures=1 where report_id=$1", [reportId]);
    expect((await readGenerationProgress(reportId, { deps })).attempt).toBe(2);
    await exec("update book_generation_state set phase='gave_up' where report_id=$1", [reportId]);
    expect((await readGenerationProgress(reportId, { deps })).state).toBe("concluding");

    await exec("insert into order_refunds(payment_order_id,state,source,reason,amount,idempotency_key) values('po_conclusion_1','requested','auto','30분 안에 책을 완성하지 못해 자동 환불',1290,'order-refund-'||gen_random_uuid())");
    expect((await readGenerationProgress(reportId, { deps })).state).toBe("refunding");
    await exec("update order_refunds set state='processing' where payment_order_id='po_conclusion_1'");
    expect((await readGenerationProgress(reportId, { deps })).state).toBe("refunding");
    expect(await readRefundedBeforePublish(reportId, deps)).toBeNull();
    await exec("update order_refunds set state='done',completed_at=now() where payment_order_id='po_conclusion_1'");
    await exec("update payment_orders set status='refunded',refunded_at=now() where payment_order_id='po_conclusion_1'");
    expect((await readGenerationProgress(reportId, { deps })).state).toBe("refunded");
    // 결제가 취소되면 기존 읽기(read_report)는 이 책을 '없음'으로 본다 → 페이지가 따로 읽어 같은 대기 화면의 「결제를 취소했어요」를 그린다.
    expect((await h.paid.call("read_report", { reportId })).ok).toBe(false);
    expect(await readRefundedBeforePublish(reportId, deps)).toMatchObject({ state: "refunded", origin: "paid" });
  }, 120_000);

  it("이용권 책: 접수 시각부터 · 주인에게만 · 반환되면 「이용권을 돌려드렸어요」", async () => {
    const { reportId, redemptionId } = await enqueue(h, RAW_FULL, policyAt);
    const mine = await readGenerationProgress(reportId, { ticketOwner: A, deps });
    expect(mine).toMatchObject({ state: "making", origin: "ticket", attempt: 1, startedAt: policyAt, stage: "writing" });
    expect(progressCalls.at(-1)).toEqual({ redemptionId }); // 이용권 책은 접수 id로 장 진행률을 읽는다
    // 주인이 아니거나 로그인 확인을 하지 않으면 아무것도 알려 주지 않는다.
    for (const ticketOwner of [B, undefined, async () => null, async () => { throw new Error("auth down"); }]) {
      expect(await readGenerationProgress(reportId, { ticketOwner, deps })).toMatchObject({ state: "unknown", origin: null, startedAt: null, chapters: null });
    }
    expect((await readGenerationProgress(reportId, { ticketOwner: async () => A, deps })).state).toBe("making");
    await exec("update report_ticket_redemptions set state='REVERSED' where id=$1", [redemptionId]);
    expect(await readGenerationProgress(reportId, { ticketOwner: A, deps })).toMatchObject({ state: "returned", origin: "ticket" });
    expect(await readRefundedBeforePublish(reportId, deps)).toBeNull();
  }, 120_000);

  it("주소 형식이 아니면 저장소를 읽지 않고, 읽기 실패는 페이지가 읽은 상태로(없으면 unknown)", async () => {
    const rowsSpy = vi.fn(rows), progressSpy = { call: vi.fn() };
    expect((await readGenerationProgress("../etc", { deps: { rows: rowsSpy, progress: progressSpy } })).state).toBe("unknown");
    expect((await readGenerationProgress("../etc", { knownStatus: "RETRYING", deps: { rows: rowsSpy, progress: progressSpy } })).state).toBe("making");
    expect(rowsSpy).not.toHaveBeenCalled(); expect(progressSpy.call).not.toHaveBeenCalled();
    const down: RowReader = async () => { throw new Error("down"); };
    expect((await readGenerationProgress("report_0123456789abcdef", { deps: { rows: down } })).state).toBe("unknown");
    expect((await readGenerationProgress("report_0123456789abcdef", { knownStatus: "FAILED_REQUIRES_ATTENTION", deps: { rows: down } })).state).toBe("concluding");
    // 장 진행률만 못 읽으면 단계는 명식 계산(장 0)으로, 상태는 그대로.
    const reportId = await seedPaid(h.paid, "po_conclusion_2", payload);
    expect(await readGenerationProgress(reportId, { deps: { rows, progress: { call: async () => { throw new Error("rpc down"); } } } })).toMatchObject({ state: "making", stage: "compute", chapters: null });
  }, 120_000);

  it("공개 진행 주소는 상태·단계·시각만, 캐시 없이 돌려준다", async () => {
    const res = await GET(new Request("http://localhost/api/reports/x/progress") as never, { params: Promise.resolve({ reportId: "not-a-report" }) });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(Object.keys(await res.json()).sort()).toEqual(["attempt", "chapters", "origin", "serverNow", "stage", "startedAt", "state"]);
  });
});
