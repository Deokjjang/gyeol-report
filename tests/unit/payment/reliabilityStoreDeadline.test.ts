import { afterEach, describe, expect, it, vi } from "vitest";
import { createPaidReportReliabilityStore, RELIABILITY_RPC_TIMEOUT_MS } from "../../../src/lib/payment/paidReportReliabilityStore";

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); vi.unstubAllGlobals(); });

describe("durable RPC transport deadline", () => {
  const env = { NODE_ENV: "production" as const, PAID_REPORT_RELIABILITY_ENABLED: "1", SUPABASE_URL: "https://mock.invalid", SUPABASE_SERVICE_ROLE_KEY: "mock-only" };
  it("bounds a hanging RPC without replaying an uncertain mutation", async () => {
    vi.useFakeTimers();
    const abortSignal = vi.fn<(signal: AbortSignal) => Promise<unknown>>(() => new Promise(() => {}));
    mocks.rpc.mockReturnValue({ abortSignal });
    mocks.createClient.mockReturnValue({ rpc: mocks.rpc });
    const store = createPaidReportReliabilityStore(env);
    const running = store.call("finish_job", { jobId: "mock" });
    await vi.advanceTimersByTimeAsync(RELIABILITY_RPC_TIMEOUT_MS);
    expect(await running).toEqual({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(abortSignal.mock.calls[0][0].aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("keeps the result contract and cancels the deadline after a normal response", async () => {
    vi.useFakeTimers();
    mocks.rpc.mockReturnValue({ abortSignal: vi.fn(async () => ({ data: { ok: true, status: "COMPLETED" }, error: null })) });
    mocks.createClient.mockReturnValue({ rpc: mocks.rpc });
    expect(await createPaidReportReliabilityStore(env).call("read_report")).toEqual({ ok: true, status: "COMPLETED" });
    expect(vi.getTimerCount()).toBe(0);
    expect(RELIABILITY_RPC_TIMEOUT_MS * 4 + 120_000 * 2).toBe(280_000);
  });
  it("installed supabase-js sends one POST RPC on provider failure with an abort signal", async () => {
    const actual = await vi.importActual<typeof import("@supabase/supabase-js")>("@supabase/supabase-js");
    mocks.createClient.mockImplementation(actual.createClient);
    const transport = vi.fn<typeof fetch>(async () => Response.json({ message: "mock unavailable" }, { status: 503 }));
    vi.stubGlobal("fetch", transport);
    expect(await createPaidReportReliabilityStore(env).call("finish_job")).toEqual({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport.mock.calls[0][1]).toMatchObject({ method: "POST", signal: expect.any(AbortSignal) });
  });
});
