import { afterEach, beforeEach, expect, it, vi } from "vitest";
beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal("window", { location: { hostname: "127.0.0.1", pathname: "/dev/content-review/book" }, fbq: vi.fn(), dispatchEvent: vi.fn() });
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("sessionStorage", { getItem: vi.fn(), setItem: vi.fn() });
  vi.stubGlobal("localStorage", { getItem: vi.fn(), setItem: vi.fn() });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
async function dispatchAll() {
  const client = await import("../../../src/lib/analytics/client");
  client.pageView("/dev/content-review"); client.interaction("report_opened", "saju_mbti_full");
  client.sendMeta({ event: "Purchase", params: { value: 1290, currency: "KRW" } }, "purchase");
  await client.syncLocalFacts(); await client.dispatchPurchase("review", true); client.flushMeta();
}
it("manual route has no analytics/Meta/facts fetch or storage even without launch flag", async () => {
  await dispatchAll();
  expect(fetch).not.toHaveBeenCalled(); expect(window.fbq).not.toHaveBeenCalled();
  expect(window.dispatchEvent).not.toHaveBeenCalled(); expect(sessionStorage.setItem).not.toHaveBeenCalled(); expect(localStorage.setItem).not.toHaveBeenCalled();
});
it("dedicated local review process also silences existing full experience routes", async () => {
  vi.stubEnv("NEXT_PUBLIC_LOCAL_REVIEW_SILENT", "1");
  Object.assign(window.location, { pathname: "/dev/account" });
  await dispatchAll(); expect(fetch).not.toHaveBeenCalled(); expect(window.fbq).not.toHaveBeenCalled();
});
it("suppression flag cannot change production Meta behavior or enable anything", async () => {
  vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_LOCAL_REVIEW_SILENT", "1");
  Object.assign(window.location, { hostname: "gyeolreport.com", pathname: "/" });
  const client = await import("../../../src/lib/analytics/client");
  expect(client.manualReviewSilent()).toBe(false);
  client.pageView("/"); expect(window.fbq).toHaveBeenCalledTimes(1);
});
