// P3.5 B: 결제 워커 배선 — WRITER_V5_PRODUCTS가 비어 있으면 v5 훅을 넘기지 않는다(기존 호출과 같음).
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { run } = vi.hoisted(() => ({ run: vi.fn<(...args: unknown[]) => Promise<{ ok: boolean; status: string }>>(async () => ({ ok: true, status: "EMPTY" })) }));
vi.mock("../../../src/lib/payment/paidReportReliability", () => ({ runPaidReportJob: run }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => true }));
import { PAID_V5_WRITER_BUDGET_MS, runPublicPaidReportJob } from "../../../src/lib/book/paidRuntime";
import { PAID_LEASE_MS, PAID_SHORT_BUDGET_MS, extendPaidLease, paidWriterBudget } from "../../../src/lib/ops/generation/paidJob";
import { maxDuration } from "../../../src/app/api/internal/report-jobs/route";
import { PAID_WORKER_LIMITS } from "../../../src/lib/book/paidWorkerBatch";
import { WRITER_DISABLED_RUNTIME } from "../../../src/lib/report-generation/writerDisabled";

const store = { call: vi.fn(async () => ({ ok: true })) };
afterEach(() => { run.mockClear(); vi.unstubAllEnvs(); });

describe("결제 워커 v5 플래그", () => {
  it("플래그 비어 있음: 훅 없음(인자 4개 그대로)", async () => {
    vi.stubEnv("WRITER_V5_PRODUCTS", "");
    await runPublicPaidReportJob(store, WRITER_DISABLED_RUNTIME);
    expect(run).toHaveBeenCalledTimes(1);
    expect((run.mock.calls[0] as unknown[])[4]).toBeUndefined();
  });
  it("플래그 켬: 훅을 넘기고, 플래그 밖 상품에는 null을 돌려 기존 경로를 탄다", async () => {
    vi.stubEnv("WRITER_V5_PRODUCTS", "saju_mbti_full");
    await runPublicPaidReportJob(store, WRITER_DISABLED_RUNTIME);
    const hook = (run.mock.calls[0] as unknown[])[4] as (job: object) => Promise<unknown>;
    expect(typeof hook).toBe("function");
    expect(await hook({ payload: {}, product_type: "career_money_study", report_id: "r", created_at: "2026-10-29T00:00:00Z", attempt: 1 })).toBeNull();
  });
  it("HOTFIX-W1: 긴 예산은 늘린 lease·함수 시간 안, 짧은 예산은 claim lease 10분 안", () => {
    expect(PAID_SHORT_BUDGET_MS).toBeLessThan(10 * 60_000 - 60_000);
    expect(PAID_WORKER_LIMITS.claimWindowMs + PAID_V5_WRITER_BUDGET_MS + 60_000).toBeLessThanOrEqual(maxDuration * 1000);
    expect(PAID_WORKER_LIMITS.claimWindowMs + PAID_V5_WRITER_BUDGET_MS + 60_000).toBeLessThan(PAID_LEASE_MS);
    // 1단(연애 본문 25,183 + 36,000)이 시간으로 깎이지 않는다: (예산 − 검수 몫 90초) × 125토큰/초
    expect(((PAID_V5_WRITER_BUDGET_MS - 90_000) / 1000) * 125).toBeGreaterThanOrEqual(28_722 + 36_000);
  });
});

describe("HOTFIX-W1 결제 lease 연장(migration 없음)", () => {
  const fakeDb = (rows: unknown[] | null, error: unknown = null) => {
    const seen: { table?: string; patch?: Record<string, unknown>; eq: [string, unknown][] } = { eq: [] };
    const chain = { eq(k: string, v: unknown) { seen.eq.push([k, v]); return chain; }, select: async () => ({ data: rows, error }) };
    return { seen, db: { from(t: string) { seen.table = t; return { update(p: Record<string, unknown>) { seen.patch = p; return chain; } }; } } as never };
  };
  it("같은 토큰·RUNNING 행만 15분으로 늘린다", async () => {
    const f = fakeDb([{ job_id: "j" }]);
    expect(await extendPaidLease(f.db, "j", "t", PAID_LEASE_MS, Date.parse("2026-11-13T12:00:00Z"))).toBe(true);
    expect(f.seen.table).toBe("report_generation_jobs");
    expect(f.seen.patch).toEqual({ lease_until: "2026-11-13T12:15:00.000Z" });
    expect(f.seen.eq).toEqual([["job_id", "j"], ["lease_token", "t"], ["status", "RUNNING"]]);
  });
  it("못 늘리면(행 0개·오류·DB 없음) 옛 480초, 늘리면 요청한 예산", async () => {
    expect(await paidWriterBudget(fakeDb([{ job_id: "j" }]).db, { job_id: "j", lease_token: "t" }, PAID_V5_WRITER_BUDGET_MS)).toBe(PAID_V5_WRITER_BUDGET_MS);
    expect(await paidWriterBudget(fakeDb([]).db, { job_id: "j", lease_token: "t" }, PAID_V5_WRITER_BUDGET_MS)).toBe(PAID_SHORT_BUDGET_MS);
    expect(await paidWriterBudget(fakeDb(null, { message: "x" }).db, { job_id: "j", lease_token: "t" }, PAID_V5_WRITER_BUDGET_MS)).toBe(PAID_SHORT_BUDGET_MS);
    expect(await paidWriterBudget(null, { job_id: "j", lease_token: "t" }, PAID_V5_WRITER_BUDGET_MS)).toBe(PAID_SHORT_BUDGET_MS);
    expect(await paidWriterBudget(null, { job_id: "j", lease_token: "t" }, 300_000)).toBe(300_000);
  });
});
