import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { runLocalPaidReportQa } from "../../../src/lib/payment/localPaidReportQa";
import { POST } from "../../../src/app/api/dev/paid-report-qa/route";
import ReportPage from "../../../src/app/reports/[reportId]/page";
import { createPaidReportReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { createSupabasePaidReportResultClient } from "../../../src/lib/reports/supabasePaidReportResultClient";
import { WRITER_DISABLED_RUNTIME } from "../../../src/lib/report-generation/writerDisabled";

vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: vi.fn(() => { throw new Error("DB_FORBIDDEN"); }) }));
vi.mock("../../../src/lib/reports/supabasePaidReportResultClient", () => ({ createSupabasePaidReportResultClient: vi.fn(() => { throw new Error("DB_FORBIDDEN"); }) }));
const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const payload = (key: string) => ({ productKey: key, productSlug: key === "saju_mbti_full" ? "saju-mbti-full" : key === "saju_mbti_compatibility" ? "compatibility" : key.replaceAll("_", "-"),
  ...(key === "saju_mbti_compatibility" ? { personA: person, personB: { ...person, name: "나래", mbtiType: "ISFJ" }, relationshipType: "love" } : { person }),
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: key === "annual_fortune" ? { selectedYear: "2026" } : {} });
beforeEach(() => {
  vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-24T12:00:00+09:00"));
  vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("REPORT_PERSISTENCE_MODE", "preview_memory"); vi.stubEnv("PAID_REPORT_RELIABILITY_ENABLED", "0");
});
afterEach(() => {
  expect(createPaidReportReliabilityStore).not.toHaveBeenCalled();
  expect(createSupabasePaidReportResultClient).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled(); vi.unstubAllEnvs(); vi.useRealTimers();
});
describe("local QA uses the actual paid worker and customer result page", () => {
  it.each(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"])("%s publishes and renders without DB/Toss", async product => {
    const result = await runLocalPaidReportQa(payload(product), WRITER_DISABLED_RUNTIME);
    expect(result).toMatchObject({ ok: true, diagnostic: { delivery: { fallbackUsed: true, publish: "pass" }, externalCalls: [] } });
    if (!result.reportId) throw new Error("local report missing");
    const html = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: result.reportId }) }));
    expect(html).toContain(person.name); expect(html).not.toContain("리포트를 불러오지 못했습니다");
    expect(html.length).toBeGreaterThan(10000);
    expect(JSON.stringify(result.diagnostic)).not.toContain(person.name);
    const secondRead = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: result.reportId }) }));
    expect(secondRead).toBe(html);
  });
  it.each(["production", "staging"])("%s cannot expose local generator even with preview flags", async mode => {
    vi.stubEnv("NODE_ENV", mode);
    const response = await POST(new Request("http://localhost/api/dev/paid-report-qa", { method: "POST", body: "invalid" }));
    expect(response.status).toBe(404); expect(await response.json()).toEqual({ ok: false, code: "UNAVAILABLE" });
  });
  it.each([["supabase", "0"], ["preview_memory", "1"]])("disallows persistence=%s reliability=%s", async (mode, reliability) => {
    vi.stubEnv("REPORT_PERSISTENCE_MODE", mode); vi.stubEnv("PAID_REPORT_RELIABILITY_ENABLED", reliability);
    expect((await POST(new Request("http://localhost/api/dev/paid-report-qa", { method: "POST", body: "{}" }))).status).toBe(404);
  });
  it("missing local report does not fall through to legacy production reads", async () => {
    const html = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: "missing-local-report" }) }));
    expect(html).toContain("리포트 상태를 확인하지 못했습니다");
  });
  it("route returns the real report URL with writer disabled", async () => {
    const response = await POST(new Request("http://localhost/api/dev/paid-report-qa", { method: "POST", body: JSON.stringify(payload("saju_mbti_full")) }));
    expect(response.status).toBe(200); const body = await response.json();
    expect(body.url).toBe(`/reports/${body.reportId}`);
    expect(body.diagnostic).toMatchObject({ delivery: { fallbackUsed: true, publish: "pass" }, externalCalls: [] });
  });
});
