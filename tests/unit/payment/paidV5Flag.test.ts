// P3.5 B 결제 워커 배선 → AM2-14 5부: v5 작가 상품은 코드 상수 6상품(운영 env를 읽지 않는다).
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
  it("AM2-14 5부: v5 훅은 운영 env 없이 늘 넘긴다(6상품 상수 — WRITER_V5_PRODUCTS를 비우거나 4종만 넣어도 같다)", async () => {
    for (const v of ["", "saju_mbti_full"]) {
      vi.stubEnv("WRITER_V5_PRODUCTS", v); run.mockClear();
      await runPublicPaidReportJob(store, WRITER_DISABLED_RUNTIME);
      expect(run).toHaveBeenCalledTimes(1);
      expect(typeof (run.mock.calls[0] as unknown[])[4]).toBe("function");
    }
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
