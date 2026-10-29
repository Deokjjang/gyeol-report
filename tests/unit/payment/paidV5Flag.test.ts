// P3.5 B: 결제 워커 배선 — WRITER_V5_PRODUCTS가 비어 있으면 v5 훅을 넘기지 않는다(기존 호출과 같음).
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { run } = vi.hoisted(() => ({ run: vi.fn(async (..._args: unknown[]) => ({ ok: true, status: "EMPTY" })) }));
vi.mock("../../../src/lib/payment/paidReportReliability", () => ({ runPaidReportJob: run }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => true }));
import { PAID_V5_WRITER_BUDGET_MS, runPublicPaidReportJob } from "../../../src/lib/book/paidRuntime";
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
  it("결제 경로 작가 예산은 claim lease 10분보다 짧다", () => { expect(PAID_V5_WRITER_BUDGET_MS).toBeLessThan(10 * 60_000 - 60_000); });
});
