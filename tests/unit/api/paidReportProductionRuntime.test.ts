import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  confirmPaidReport: vi.fn(),
  createStore: vi.fn(),
  resolveWriter: vi.fn(),
  runJob: vi.fn(),
  storeCall: vi.fn(),
}));

vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({
  createPaidReportReliabilityStore: mocks.createStore,
}));
vi.mock("../../../src/lib/payment/paidReportReliability", () => ({
  confirmPaidReport: mocks.confirmPaidReport,
  runPaidReportJob: mocks.runJob,
}));
vi.mock("../../../src/lib/report-generation/reportWriterRuntime", () => ({
  resolveReportWriterRuntime: mocks.resolveWriter,
}));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({
  confirmTossPayment: vi.fn(),
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
  mocks.resolveWriter.mockReset().mockReturnValue({ enabled: false, reason: "flag_disabled" });
  mocks.runJob.mockReset().mockResolvedValue({ ok: true });
  mocks.confirmPaidReport.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

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
    expect(statusSource).toContain("결제가 완료되었습니다");
    expect(statusSource).toContain("리포트를 생성하고 있습니다");
    expect(statusSource).not.toContain("FAILED_REQUIRES_ATTENTION");
    expect(resultSource).toContain("리포트 열람 기간이 만료되었습니다.");
  });
});
