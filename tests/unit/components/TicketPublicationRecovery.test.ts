import { webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Hook callback unit tests, NOT a browser/hydration substitute. Explicit state
// slots let us invoke the real persistence/fetch/poll callbacks without a DOM.
const hooks = vi.hoisted(() => ({ slots: [] as unknown[], index: 0, effects: [] as (() => void | (() => void))[] }));
vi.mock("react", () => ({
  useState: (initial: unknown) => {
    const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = initial;
    return [hooks.slots[i], (v: unknown) => { hooks.slots[i] = typeof v === "function" ? v(hooks.slots[i]) : v; }];
  },
  useRef: (initial: unknown) => { const i = hooks.index++; if (!(i in hooks.slots)) hooks.slots[i] = { current: initial }; return hooks.slots[i]; },
  useCallback: (fn: unknown) => fn,
  useEffect: (fn: () => void | (() => void)) => { hooks.effects.push(fn); },
}));
import { useTicketPublication, ticketPendingKey } from "../../../src/components/book/useTicketPublication";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { confirmedAdultDevTossCheckoutLegalConfirmations as consent } from "../../../src/components/payment/DevTossCheckoutLauncher";

const payload = RUNTIME_FIXTURES[0].payload as ReportInputPayload, product = payload.productKey;
// eslint-disable-next-line react-hooks/rules-of-hooks -- explicit hook callback unit runner, not a React render
const readHook = (enabled = true) => { hooks.index = 0; hooks.effects = []; return useTicketPublication(product, enabled); };
const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const response = (body: object) => ({ json: async () => body }) as Response;
const values = new Map<string, string>();
let mountCleanup: (() => void) | void;
beforeEach(() => {
  hooks.slots = []; hooks.index = 0; hooks.effects = []; values.clear(); vi.useFakeTimers();
  vi.stubGlobal("crypto", webcrypto);
  vi.stubGlobal("sessionStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v), removeItem: (k: string) => values.delete(k) });
  vi.stubGlobal("document", Object.assign(new EventTarget(), { hidden: false }));
  vi.stubGlobal("window", Object.assign(new EventTarget(), { location: { assign: vi.fn() } }));
  vi.stubGlobal("fetch", vi.fn(async () => response({ ok: true, state: "QUEUED", message: "책 발행을 준비하고 있습니다." })));
});
afterEach(() => { mountCleanup?.(); mountCleanup = undefined; vi.useRealTimers(); vi.unstubAllGlobals(); });
async function mount(enabled = true) { readHook(enabled); mountCleanup = hooks.effects[0](); await vi.advanceTimersByTimeAsync(0); return readHook(enabled); }

describe("ticket publication client recovery callbacks", () => {
  it("owner-scoped receipt retry cannot move an old reservation to another member", async () => {
    const hook = await mount();
    await hook.submit(payload, consent, "a".repeat(64));
    expect(vi.mocked(fetch).mock.calls[0][1]?.headers).toMatchObject({"x-ticket-account":"a".repeat(64)});
    const count=vi.mocked(fetch).mock.calls.length;
    await readHook().submit(payload,consent,"b".repeat(64));
    expect(fetch).toHaveBeenCalledTimes(count);expect(readHook().message).toContain("원래 계정");
  });
  it("approval persists request before network, rapid clicks reserve once, sends no authority fields", async () => {
    const hook = await mount();
    let release!: (r: Response) => void;
    vi.mocked(fetch).mockImplementation(async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      expect(Object.keys(body).sort()).toEqual(["consent", "payload", "requestId"]);
      expect(JSON.parse(values.get(ticketPendingKey(product))!).requestId).toBe(body.requestId);
      return new Promise(r => { release = r; });
    });
    const first = hook.submit(payload, consent), second = hook.submit(payload, consent);
    await second;
    // SHA-256 uses real async crypto, so yield an actual I/O turn, not timers.
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(readHook().submitting).toBe(true);
    release(response({ ok: true, state: "QUEUED" })); await first;
    expect(readHook().pending).toBe(true); expect(readHook().submitting).toBe(false);
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/auth/ticket-redeem");
  });
  it("lost response survives remount, GET-only poll; hidden tab pauses, focus resumes, cleanup stops", async () => {
    const hook = await mount(); vi.mocked(fetch).mockRejectedValueOnce(Error("ACK_LOST"));
    await hook.submit(payload, consent); const persisted = values.get(ticketPendingKey(product)); expect(persisted).toBeTruthy();
    mountCleanup?.(); hooks.slots = []; await mount();
    expect(readHook().pending).toBe(true);
    vi.mocked(fetch).mockClear(); const stopPoll = hooks.effects[1](); await flush();
    expect(fetch).toHaveBeenCalledTimes(1); expect(vi.mocked(fetch).mock.calls[0][0]).toContain("/auth/ticket-status?requestId=");
    expect(vi.mocked(fetch).mock.calls[0][1]?.method).toBeUndefined();
    Object.assign(document, { hidden: true }); await vi.advanceTimersByTimeAsync(15000); expect(fetch).toHaveBeenCalledTimes(1);
    Object.assign(document, { hidden: false }); window.dispatchEvent(new Event("focus")); await flush(); expect(fetch).toHaveBeenCalledTimes(2);
    stopPoll?.(); await vi.advanceTimersByTimeAsync(15000); expect(fetch).toHaveBeenCalledTimes(2);
    expect(values.get(ticketPendingKey(product))).toBe(persisted);
  });
  it("NOT_FOUND allows only explicit same-key retry; changed input cannot be reserved", async () => {
    const hook = await mount(); await hook.submit(payload, consent);
    const key = JSON.parse(values.get(ticketPendingKey(product))!).requestId;
    vi.mocked(fetch).mockResolvedValue(response({ ok: false, code: "NOT_FOUND" }));
    readHook(); const cleanup = hooks.effects[1](); await flush(); cleanup?.();
    expect(readHook().retryable).toBe(true);
    const count = vi.mocked(fetch).mock.calls.length;
    await readHook().submit({ ...payload, person: { ...(payload as Extract<ReportInputPayload, { person: unknown }>).person, name: "변경된 이름" } } as ReportInputPayload, consent);
    expect(fetch).toHaveBeenCalledTimes(count);
    await readHook().submit(payload, consent);
    expect(JSON.parse(String(vi.mocked(fetch).mock.calls.at(-1)?.[1]?.body)).requestId).toBe(key);
  });
  it.each(["REVERSED", "COMPLETED"])("%s terminal acknowledgement clears recovery; never generates automatically", async state => {
    const hook = await mount(), reportUrl = `/reports/report_${"a".repeat(32)}`;
    vi.mocked(fetch).mockResolvedValue(response({ ok: true, state, reportUrl })); await hook.submit(payload, consent);
    expect(values.has(ticketPendingKey(product))).toBe(false);
    if (state === "COMPLETED") { expect(window.location.assign).toHaveBeenCalledWith(reportUrl); expect(readHook().pending).toBe(true); }
    else { expect(window.location.assign).not.toHaveBeenCalled(); expect(readHook().pending).toBe(false); }
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it.each(["NO_USABLE_TICKET", "REFUND_HOLD"])("%s releases method lock, requests balance refresh, never starts PG", async code => {
    const hook = await mount(); vi.mocked(fetch).mockResolvedValue(response({ ok: false, code })); await hook.submit(payload, consent);
    expect(readHook()).toMatchObject({ pending: false, revision: 1 });
    expect(fetch).toHaveBeenCalledTimes(1); expect(window.location.assign).not.toHaveBeenCalled();
  });
  it("guest/dev disabled cannot reserve; storage failure never sends an unrecoverable POST", async () => {
    await (await mount(false)).submit(payload, consent); expect(fetch).not.toHaveBeenCalled();
    vi.stubGlobal("sessionStorage", { ...sessionStorage, setItem: () => { throw Error("STORAGE_DISABLED"); } });
    await readHook().submit(payload, consent); expect(fetch).not.toHaveBeenCalled();
  });
});
