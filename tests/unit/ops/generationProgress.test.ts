// v5 최종 2-1 #7: 생성 대기 화면은 ⑦ 생성 감독이 남긴 실제 상태(book_generation_state)로만 단계·지연을 정한다.
// 실제 SQL(PGlite) + 실제 감독(superviseQueueJob, 결제 경로) + 목업 LLM. 외부 호출 0.
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { runPaidReportJob, type PaidV5Builder } from "@/lib/payment/paidReportReliability";
import { WRITER_DISABLED_RUNTIME as runtime } from "@/lib/report-generation/writerDisabled";
import { runPaidV5Job, type PaidJobOps } from "@/lib/ops/generation/paidJob";
import { delayedMessage, describeGeneration } from "@/components/report/generationProgress";
import { readGenerationProgress } from "@/components/report/generationProgressServer";
import { GET } from "@/app/api/reports/[reportId]/progress/route";
import { seedPaid } from "../../helpers/paidWorkerSql";
import { opsSql } from "../../helpers/opsSql";
import { RAW_FULL, mockTextFor } from "../../helpers/v5Scenarios";
import { mockAnthropic } from "../../helpers/opsMocks";

describe("진행 상태 판정(순수)", () => {
  it("Book 상태 × 감독 상태 → 화면 상태·단계", () => {
    expect(describeGeneration("QUEUED", null)).toEqual({ state: "preparing", stage: 0, nextAt: null });
    expect(describeGeneration("GENERATING", { phase: "pending", failures: 0, next_at: null })).toEqual({ state: "preparing", stage: 2, nextAt: null });
    expect(describeGeneration("RETRYING", { phase: "pending", failures: 1, next_at: "2026-11-05T06:20:00Z" })).toEqual({ state: "delayed", stage: 2, nextAt: "2026-11-05T06:20:00.000Z" });
    // 앞선 시도가 실패한 뒤 다시 쓰는 중이면 "평소보다 조금 더".
    expect(describeGeneration("GENERATING", { phase: "pending", failures: 2, next_at: null }).state).toBe("delayed");
    expect(describeGeneration("FAILED_REQUIRES_ATTENTION", { phase: "gave_up", failures: 9 }).state).toBe("attention");
    expect(describeGeneration("GENERATING", { phase: "gave_up", failures: 9 }).state).toBe("attention");
    expect(describeGeneration("COMPLETED", null).state).toBe("ready");
    expect(describeGeneration("EXPIRED", null).state).toBe("expired");
    expect(describeGeneration(undefined, null).state).toBe("unknown");
  });
  it("다음 시도 시각은 한국 시각으로, 지난 시각이면 붙이지 않는다", () => {
    const at = "2026-11-05T06:20:00Z", now = Date.parse("2026-11-05T06:00:00Z");
    expect(delayedMessage(at, now)).toContain("오후 3:20쯤 이어서 다시 씁니다");
    expect(delayedMessage(at, now)).not.toMatch(/실패|재시도|오류/u);
    expect(delayedMessage(at, Date.parse(at) + 1)).toBeUndefined();
    expect(delayedMessage(null, now)).toBeUndefined();
  });
});

describe("실제 감독 상태 읽기(PGlite)", () => {
  type H = Awaited<ReturnType<typeof opsSql>>;
  let h: H, ops: PaidJobOps;
  const policyAt = "2026-10-27T03:00:00.000Z";
  const payload = (() => { const n = normalizeReportInputPayload(RAW_FULL, { now: () => new Date(policyAt) }); if (!n.ok) throw new Error("payload"); return n.value; })();
  const { text } = mockTextFor(payload, policyAt);
  const envFor = (behaviors: Parameters<typeof mockAnthropic>[0]) => ({ openAiKey: null, deps: { fetchImpl: mockAnthropic(behaviors).fetch, sleep: async () => undefined, people: async () => [], apiKey: "test-key" } });
  const builder = (env: ReturnType<typeof envFor>): PaidV5Builder => async (job, finish) => ({ settled: await runPaidV5Job({ ...job, policyAt }, finish, { ops, env }) });
  const exec = async (sql: string, params: unknown[] = []) => { await h.db.exec("reset role"); await h.db.query(sql, params); await h.db.exec("set role service_role"); };
  const read = (reportId: string) => readGenerationProgress(reportId, undefined, { reliability: h.paid, generation: ops.generation });

  beforeAll(async () => {
    h = await opsSql();
    const call = (fn: string) => ({ call: (a: string, d: Record<string, unknown> = {}) => h.rpc(fn, a, d) });
    ops = { generation: call("ops_generation"), order: call("ops_order"), async audit() { return true; } };
    process.env.WRITER_V5_PRODUCTS = "saju_mbti_full";
  }, 120_000);
  afterAll(async () => { delete process.env.WRITER_V5_PRODUCTS; await h?.db.close(); });

  it("접수 → (감독 시작·출력 전 실패) 보류 → 다시 써서 완성: 화면 상태가 감독 기록을 그대로 따른다", async () => {
    const reportId = await seedPaid(h.paid, "po_progress_1", payload);
    expect(await read(reportId)).toEqual({ state: "preparing", stage: 0, nextAt: null });
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, builder(envFor([{ status: 401 }])))).toMatchObject({ ok: true, status: "RETRYING" });
    const deferred = await read(reportId);
    const state = (await h.rpc("ops_generation", "state", { reportId })).state as { next_at: string; failures: number };
    expect(state.failures).toBe(1);
    expect(deferred).toEqual({ state: "delayed", stage: 2, nextAt: new Date(state.next_at).toISOString() });
    expect(Date.parse(deferred.nextAt!) - Date.now()).toBeGreaterThan(50_000);
    await exec("update report_generation_jobs set next_retry_at=now() where report_id=$1", [reportId]);
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, builder(envFor([{ text }])))).toMatchObject({ ok: true, status: "COMPLETED" });
    expect((await read(reportId)).state).toBe("ready");
  }, 180_000);

  it("24시간 포기(gave_up) → 확인 필요", async () => {
    const reportId = await seedPaid(h.paid, "po_progress_2", payload);
    await h.rpc("ops_generation", "begin", { reportId, origin: "paid", originRef: "po_progress_2" });
    await exec("update book_generation_state set first_failure_at=now()-interval '24 hours',failures=9 where report_id=$1", [reportId]);
    expect(await runPaidReportJob(h.paid, runtime, undefined, undefined, builder(envFor([{ status: 401 }])))).toMatchObject({ ok: true, status: "FAILED_REQUIRES_ATTENTION" });
    expect((await read(reportId)).state).toBe("attention");
  }, 180_000);

  it("주소 형식이 아니면 저장소를 읽지 않고 unknown, 읽기 실패도 unknown", async () => {
    const reliability = { call: vi.fn() }, generation = { call: vi.fn() };
    expect(await readGenerationProgress("../etc", undefined, { reliability, generation })).toEqual({ state: "unknown", stage: 0, nextAt: null });
    expect(reliability.call).not.toHaveBeenCalled(); expect(generation.call).not.toHaveBeenCalled();
    reliability.call.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    expect((await readGenerationProgress("report_0123456789abcdef", undefined, { reliability, generation })).state).toBe("unknown");
    // 감독 상태만 못 읽으면 Book 상태로만(시작 전 단계) 판정한다.
    reliability.call.mockResolvedValue({ ok: true, status: "GENERATING" }); generation.call.mockRejectedValue(new Error("down"));
    expect(await readGenerationProgress("report_0123456789abcdef", undefined, { reliability, generation })).toEqual({ state: "preparing", stage: 0, nextAt: null });
  });

  it("공개 읽기 주소는 상태·단계·시각만, 캐시 없이 돌려준다", async () => {
    const res = await GET(new Request("http://localhost/api/reports/x/progress"), { params: Promise.resolve({ reportId: "not-a-report" }) });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ state: "unknown", stage: 0, nextAt: null });
  });
});
