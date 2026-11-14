import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  confirmPaidReport: vi.fn(),
  createStore: vi.fn(),
  runJob: vi.fn(),
  storeCall: vi.fn(),
  confirmProvider: vi.fn(),
}));

vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({
  createPaidReportReliabilityStore: mocks.createStore,
}));
vi.mock("../../../src/lib/payment/paidReportReliability", () => ({
  confirmPaidReport: mocks.confirmPaidReport,
  runPaidReportJob: mocks.runJob,
}));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({
  confirmTossPayment: mocks.confirmProvider,
}));

import { GET as runWorker } from "../../../src/app/api/internal/report-jobs/route";
import {
  GET as listAttentionJobs,
  POST as retryReport,
} from "../../../src/app/api/internal/report-retry/route";

function authorizedRequest(path: string, secret: string, method = "GET", body?: unknown) {
  return new Request(`http://localhost${path}`, {
    method,
    headers: { authorization: `Bearer ${secret}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "mock-cron-secret");
  vi.stubEnv("REPORT_ADMIN_SECRET", "mock-admin-secret");
  vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "0");
  mocks.storeCall.mockReset();
  mocks.createStore.mockReset().mockReturnValue({ call: mocks.storeCall });
  mocks.runJob.mockReset().mockResolvedValue({ ok: true });
  mocks.confirmPaidReport.mockReset();
  mocks.confirmProvider.mockReset();
});

afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("production paid report runtime boundaries", () => {
  it("fails closed when production reliability env is incomplete", async () => {
    const actual = await vi.importActual<typeof import("../../../src/lib/payment/paidReportReliabilityStore")>(
      "../../../src/lib/payment/paidReportReliabilityStore",
    );
    const missingFlag = actual.createPaidReportReliabilityStore({
      NODE_ENV: "production",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role",
    });
    const publicUrlOnly = actual.createPaidReportReliabilityStore({
      NODE_ENV: "production",
      PAID_REPORT_RELIABILITY_ENABLED: "1",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role",
    });

    await expect(missingFlag.call("expire")).resolves.toEqual({
      ok: false,
      code: "DURABLE_STORAGE_UNAVAILABLE",
    });
    await expect(publicUrlOnly.call("expire")).resolves.toEqual({
      ok: false,
      code: "DURABLE_STORAGE_UNAVAILABLE",
    });
  });

  it("rejects an invalid cron secret before touching storage or generation", async () => {
    const response = await runWorker(authorizedRequest("/api/internal/report-jobs", "wrong"));

    expect(response.status).toBe(401);
    expect(mocks.createStore).not.toHaveBeenCalled();
    expect(mocks.runJob).not.toHaveBeenCalled();
  });

  it("runs one leased worker batch unit for a valid cron secret", async () => {
    mocks.storeCall.mockResolvedValueOnce({ ok: true });

    const response = await runWorker(
      authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"),
    );

    expect(response.status).toBe(200);
    expect(mocks.storeCall).toHaveBeenCalledWith("expire");
    expect(mocks.runJob).toHaveBeenCalledTimes(1);
  });

  it("runs at most eight sequential completed jobs with one expiry and one recovery claim", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.storeCall.mockResolvedValue({ ok: true });
    mocks.runJob.mockResolvedValue({ ok: true, status: "COMPLETED" });
    const response = await runWorker(authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(mocks.runJob).toHaveBeenCalledTimes(8);
    expect(mocks.storeCall.mock.calls.map(c => c[0])).toEqual(["expire", "claim_payment_recovery"]);
    expect(mocks.confirmProvider).not.toHaveBeenCalled();
  });

  it("expiry storage failure prevents new work and preserves the 503 response", async () => {
    mocks.storeCall.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    expect((await runWorker(authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"))).status).toBe(503);
    expect(mocks.runJob).not.toHaveBeenCalled(); expect(mocks.confirmProvider).not.toHaveBeenCalled();
  });

  it("V4 query/cookie hints cannot replace the default generation or publication contract", async () => {
    mocks.storeCall.mockResolvedValue({ ok: true });
    expect((await runWorker(authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"))).status).toBe(200);
    const plain = mocks.runJob.mock.calls[0];
    mocks.runJob.mockClear();
    const request = new Request("http://localhost/api/internal/report-jobs?reportVersion=v4&mode=shadow", {
      headers: { authorization: "Bearer mock-cron-secret", cookie: "reportVersion=v4; contentVersion=v4", "x-report-version": "v4" },
    });
    expect((await runWorker(request)).status).toBe(200);
    const hinted = mocks.runJob.mock.calls[0];
    // 공개 Book 관문(bookExperiencePublicEnabled)은 늘 켜져 있어 runPublicPaidReportJob이 주문 확인 저장소 감싸개·작가 꺼짐 런타임·생성·발행 검사(·v5 훅)를 넘긴다.
    // 요청의 쿼리·쿠키·헤더 힌트는 이 계약을 바꾸지 못한다: 힌트 없는 호출과 같은 모양.
    expect(hinted.map((arg: unknown) => typeof arg)).toEqual(plain.map((arg: unknown) => typeof arg));
    expect(hinted[1]).toEqual({ enabled: false, reason: "flag_disabled" });
    expect(hinted[2]).toBeTypeOf("function");
    expect(hinted[3]).toBeTypeOf("function");
    mocks.storeCall.mockClear();
    await hinted[0].call("expire");
    expect(mocks.storeCall).toHaveBeenCalledWith("expire", undefined);
  });

  it("protects attention listing and admin retry with REPORT_ADMIN_SECRET", async () => {
    const unauthorized = await retryReport(
      authorizedRequest("/api/internal/report-retry", "wrong", "POST", {
        reportId: "report-test",
      }),
    );
    expect(unauthorized.status).toBe(401);
    expect(mocks.createStore).not.toHaveBeenCalled();

    mocks.storeCall
      .mockResolvedValueOnce({ ok: true, jobs: [] })
      .mockResolvedValueOnce({ ok: true });
    const listed = await listAttentionJobs(
      authorizedRequest("/api/internal/report-retry", "mock-admin-secret"),
    );
    const retried = await retryReport(
      authorizedRequest("/api/internal/report-retry", "mock-admin-secret", "POST", {
        reportId: "report-test",
      }),
    );

    expect(listed.status).toBe(200);
    expect(retried.status).toBe(202);
    expect(mocks.storeCall.mock.calls).toEqual([
      ["attention"],
      ["admin_retry", { reportId: "report-test" }],
    ]);
  });

  it("a hanging recovery provider does not delay generation and is aborted after ten seconds", async () => {
    vi.useFakeTimers();
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.storeCall.mockImplementation(async (action: string) => action === "claim_payment_recovery"
      ? { ok: true, token: "mock-token", order: { payment_order_id: "safe-order", provider_order_id: "provider-order", provider_payment_id: "mock-key", amount: 1290 } }
      : { ok: true });
    mocks.confirmProvider.mockImplementation(() => new Promise(() => {}));
    const running = runWorker(authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"));
    await vi.advanceTimersByTimeAsync(1);
    expect(mocks.runJob).toHaveBeenCalledTimes(1);
    expect(mocks.confirmProvider).toHaveBeenCalledTimes(1);
    const signal = mocks.confirmProvider.mock.calls[0][0].signal as AbortSignal;
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(10000);
    expect((await running).status).toBe(200);
    expect(signal.aborted).toBe(true);
    expect(mocks.storeCall).toHaveBeenCalledWith("payment_recovery_failed", expect.objectContaining({ code: "RECOVERY_TIMEOUT" }));
  });

  it("a recovery storage exception cannot stop an already queued generation job", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.storeCall.mockImplementation(async (action: string) => {
      if (action === "claim_payment_recovery") throw new Error("mock DB outage");
      return { ok: true };
    });
    expect((await runWorker(authorizedRequest("/api/internal/report-jobs", "mock-cron-secret"))).status).toBe(200);
    expect(mocks.runJob).toHaveBeenCalledTimes(1);
    expect(mocks.confirmProvider).not.toHaveBeenCalled();
  });

  it("keeps the cron contract and customer-safe status copy", () => {
    const cron = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8"));
    const statusSource = readFileSync(
      join(process.cwd(), "src/components/report/ReportGenerationStatus.tsx"),
      "utf8",
    );
    const resultSource = readFileSync(
      join(process.cwd(), "src/app/reports/[reportId]/page.tsx"),
      "utf8",
    );

    expect(cron.crons).toContainEqual({
      path: "/api/internal/report-jobs",
      schedule: "* * * * *",
    });
    expect(statusSource).toContain("ReportStatusView");
    expect(statusSource).toContain("if (attention || refreshing) return");
    expect(statusSource).not.toContain("FAILED_REQUIRES_ATTENTION");
    expect(resultSource).toContain('<ReportStatusView state="expired" />');
  });
});
