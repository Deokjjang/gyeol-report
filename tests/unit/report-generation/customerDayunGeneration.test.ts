import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { generateMajorFortuneProductDraft } from "../../../src/lib/report-generation/majorFortuneGenerationHandler";
import { generateAnnualFortuneProductDraft } from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildOpenAIMajorFortuneReportWriterMessages } from "../../../src/lib/report-generation/openaiMajorFortuneReportWriterPrompt";
import { buildOpenAIAnnualFortuneReportWriterMessages } from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import { POST as validateInput } from "../../../src/app/api/reports/validate-input/route";
import { POST as prepareCheckout } from "../../../src/app/api/payment-checkout/prepare/route";

const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));

const clock = () => new Date("2026-09-21T12:00:00+09:00");
const person = { name: "지민", birthDate: "2001-06-22", birthTime: "13:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const payload = (productKey = "major_fortune", changes: object = {}, selectedYear = "2026") => ({
  productKey, productSlug: productKey === "saju_mbti_full" ? "saju-mbti-full" : productKey === "saju_mbti_compatibility" ? "compatibility" : productKey.replaceAll("_", "-"),
  person: { ...person, ...changes }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] },
  productOptions: productKey === "annual_fortune" ? { selectedYear } : {},
});
function input(productKey = "major_fortune", changes: object = {}, selectedYear = "2026") {
  const r = normalizeReportInputPayload(payload(productKey, changes, selectedYear), { now: clock });
  if (!r.ok || r.value.kind === "compatibility") throw new Error(JSON.stringify(r));
  return r.value;
}
const fetchSpy = vi.fn(() => { throw new Error("external calls forbidden"); });
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(clock()); vi.stubGlobal("fetch", fetchSpy); fetchSpy.mockClear(); });
afterEach(() => { expect(fetchSpy).not.toHaveBeenCalled(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("customer Dayun production boundaries", () => {
  it.each(["major_fortune", "annual_fortune"])("rejects %s bypass before order writes and allows stable input", async product => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PAID_REPORT_RELIABILITY_ENABLED", "1");
    for (const key of ["SUPABASE_SERVICE_ROLE_KEY", "CRON_SECRET", "REPORT_ADMIN_SECRET"]) vi.stubEnv(key, "mock-only");
    vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key");
    vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key");
    for (const changes of [{ gender: "" }, { gender: "invalid" }, { gender: undefined }, { birthTime: "", birthTimeUnknown: true }, {}]) {
      storage.create.mockClear();
      const p = payload(product, changes);
      const r = await prepareCheckout(new Request("https://example.test/api/payment-checkout/prepare", {
        method: "POST", body: JSON.stringify({ provider: "toss", productType: product, ready: true, inputSnapshot: {
          displayName: p.person.name, birthDate: p.person.birthDate, reportInputPayload: p,
        } }),
      }));
      const valid = Object.keys(changes).length === 0;
      expect(r.status, JSON.stringify(await r.clone().json())).toBe(valid ? 200 : 400);
      expect(storage.create).toHaveBeenCalledTimes(valid ? 1 : 0);
    }
  });
  it.each(["major_fortune", "annual_fortune"])("uses the same customer basis with the %s writer enabled", async product => {
    const handler = product === "major_fortune" ? generateMajorFortuneProductDraft : generateAnnualFortuneProductDraft;
    const normalized = input(product);
    const fallback = await handler(normalized, { now: clock });
    expect(fallback.ok).toBe(true); if (!fallback.ok) return;
    const responseDraft = structuredClone(fallback.draft) as unknown as Record<string, unknown>;
    delete responseDraft.dayunContext;
    let requestText = "";
    const mockTransport: typeof fetch = async (_url, init) => {
      requestText = String(init?.body);
      return Response.json({ output_text: JSON.stringify(responseDraft) });
    };
    const written = await handler(normalized, { now: clock, writer: { enabled: true, config: { enabled: true, apiKey: "mock-only", model: "mock", fetchImpl: mockTransport } } });
    expect(written.ok, JSON.stringify(written.ok ? null : written)).toBe(true); if (!written.ok) return;
    expect(written.evidencePacket.customerDayun).toEqual(fallback.evidencePacket.customerDayun);
    expect(requestText).toContain("dayun-kst-sect2-v1");
    expect(requestText).toContain("2026-12-30T15:30:00+09:00");
    expect(validateProductPublication(product, written.draft, written.evidencePacket, payload(product))).toEqual({ ok: true, errors: [] });
  });
  it.each([
    { birthDate: "1980-03-09", gender: "FEMALE", ganji: "甲戌", startYear: 2021, startAge: 42 },
    { birthDate: "2001-06-22", gender: "MALE", ganji: "辛卯", startYear: 2026, startAge: 26 },
  ])("rejects the old shared personal fixture: $birthDate $gender", async (g) => {
    const p = payload("major_fortune", { birthDate: g.birthDate, gender: g.gender });
    const r = await generateMajorFortuneProductDraft(input("major_fortune", { birthDate: g.birthDate, gender: g.gender }), { now: clock });
    expect(r.ok, JSON.stringify(r.ok ? null : r)).toBe(true); if (!r.ok) return;
    expect(r.evidencePacket.currentCycle).toMatchObject({ ganji: g.ganji, startYear: g.startYear, endYear: g.startYear + 9, startAge: g.startAge, endAge: g.startAge + 9 });
    expect(r.evidencePacket.currentCycle).not.toMatchObject({ ganji: "戊辰", startYear: 2026, startAge: 27 });
    expect(validateProductPublication("major_fortune", r.draft, r.evidencePacket, p)).toEqual({ ok: true, errors: [] });
    expect(r.evidencePacket.customerDayun?.cycles).toHaveLength(12);
    const wrong = structuredClone(r.draft) as unknown as { cycleSummary: { ganji: string } };
    wrong.cycleSummary.ganji = "戊辰";
    expect(validateProductPublication("major_fortune", wrong, r.evidencePacket).ok).toBe(false);
  });
  it("selects historical annual context and retains December transition in current annual fallback", async () => {
    for (const [year, ganji, startYear] of [[2021, "壬辰", 2016], [2026, "辛卯", 2026]] as const) {
      const p = payload("annual_fortune", {}, String(year));
      const r = await generateAnnualFortuneProductDraft(input("annual_fortune", {}, String(year)), { now: clock });
      expect(r.ok, JSON.stringify(r)).toBe(true); if (!r.ok) continue;
      expect(r.evidencePacket.currentMajorFortune).toMatchObject({ ganji, yearRange: `${startYear}년~${startYear+9}년` });
      expect(r.evidencePacket.dayunSelection?.transition !== null).toBe(year === 2026);
      expect(r.draft.dayunContext).toEqual(r.evidencePacket.dayunSelection);
      expect(validateProductPublication("annual_fortune", r.draft, r.evidencePacket, p)).toEqual({ ok: true, errors: [] });
      if (year === 2026) {
        expect(r.draft.majorAnnualCrossReading).toContain("전환 전후");
        expect(buildOpenAIAnnualFortuneReportWriterMessages({ evidencePacket: r.evidencePacket }).user).toContain("2026-12-30T15:30:00+09:00");
        expect(validateProductPublication("annual_fortune", { ...r.draft, dayunContext: { ...r.draft.dayunContext, transition: null } }, r.evidencePacket).ok).toBe(false);
      }
      expect(validateProductPublication("annual_fortune", { ...r.draft, targetYear: year+1 }, r.evidencePacket).ok).toBe(false);
      expect(validateProductPublication("annual_fortune", r.draft, { ...r.evidencePacket, majorAnnualCross: { ...r.evidencePacket.majorAnnualCross, majorGanji: "戊辰" } }).ok).toBe(false);
      expect(validateProductPublication("annual_fortune", r.draft, r.evidencePacket, payload("annual_fortune", { gender: "FEMALE" }, String(year))).ok).toBe(false);
    }
  });
  it("passes stable approximate/unknown through deterministic generation and keeps uncertain dates", async () => {
    for (const unknown of [false, true]) {
      const changes = { birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: unknown, approximateBirthTimeSlot: unknown ? "" : "JINSI" };
      for (const product of ["major_fortune", "annual_fortune"]) {
        const p = payload(product, changes);
        const r = await generateProductReport(p, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
        expect(r.ok, JSON.stringify(r.ok ? null : r)).toBe(true); if (!r.ok) continue;
        expect(r.evidencePacket).toMatchObject({ customerDayun: { startSolarKst: null, startOffset: null }, currentMajorFortune: { ganji: "己巳" } });
      }
    }
  });
  it("uses Seoul runtime year, preserves transition and sends full customer basis to writer", async () => {
    const r = await generateMajorFortuneProductDraft(input("major_fortune", { birthDate: "1999-07-31", birthTime: "07:30" }), { now: () => new Date("2026-12-31T15:00:00Z") });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.evidencePacket.currentYear).toBe(2027);
    expect(r.evidencePacket.dayunSelection).toMatchObject({ selectedCycle: { ganji: "戊辰", startYear: 2027 }, activeCycleAtEvaluation: 2, transition: { beforeCycle: { ganji: "己巳" } } });
    expect(r.draft.openingSummary).toContain("전환 전후");
    expect(buildOpenAIMajorFortuneReportWriterMessages({ evidencePacket: r.evidencePacket }).user).toContain("dayun-kst-sect2-v1");
    expect(validateProductPublication("major_fortune", r.draft, r.evidencePacket).ok).toBe(true);
  });
  it("rejects cross-customer data, timeline edits, lost transition and calculation version changes", async () => {
    const p = payload();
    const r = await generateMajorFortuneProductDraft(input(), { now: clock });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const changedRow = { ...r.draft, majorFortuneTimelineRows: r.draft.majorFortuneTimelineRows.map((row, i) => i ? row : { ...row, year: 2025 }) };
    expect(validateProductPublication("major_fortune", changedRow, r.evidencePacket).errors).toContain("DAYUN_TIMELINE_MISMATCH");
    const noTransition = { ...r.draft, dayunContext: { ...r.draft.dayunContext, transition: null } };
    expect(validateProductPublication("major_fortune", noTransition, r.evidencePacket).errors).toContain("DAYUN_SELECTION_MISMATCH");
    const noNotice = { ...r.draft, openingSummary: r.draft.openingSummary.replace(r.evidencePacket.dayunSelection!.notice, "") };
    expect(validateProductPublication("major_fortune", noNotice, r.evidencePacket).errors).toContain("DAYUN_UNCERTAINTY_NOTICE_REQUIRED");
    const changedVersion = { ...r.evidencePacket, customerDayun: { ...r.evidencePacket.customerDayun, calculationVersion: "old" } };
    expect(validateProductPublication("major_fortune", r.draft, changedVersion).errors).toContain("DAYUN_BASIS_INVALID");
    expect(validateProductPublication("major_fortune", r.draft, r.evidencePacket, { ...p, person: { ...p.person, birthDate: "1980-03-09" } }).errors).toContain("DAYUN_INPUT_MISMATCH");
    expect(validateProductPublication("major_fortune", r.draft, { ...r.evidencePacket, personContext: { ...r.evidencePacket.personContext, name: "다른 사람" } }).errors).toContain("DAYUN_CUSTOMER_MISMATCH");
  });
  it.each(["major_fortune", "annual_fortune"])("blocks direct payload bypass for %s", product => {
    for (const gender of [undefined, "", "UNKNOWN", "female", 0, 1]) {
      expect(normalizeReportInputPayload(payload(product, { gender }), { now: clock })).toMatchObject({ ok: false, error: "DAYUN_GENDER_REQUIRED" });
    }
    expect(normalizeReportInputPayload(payload(product, { birthTime: "", birthTimeUnknown: true }), { now: clock })).toMatchObject({ ok: false, error: "DAYUN_UNCERTAIN" });
    expect(normalizeReportInputPayload(payload(product, { birthDate: "1981-03-03", birthTime: "", gender: "FEMALE", approximateBirthTimeSlot: "MISI" }), { now: clock })).toMatchObject({ ok: false, error: "DAYUN_UNCERTAIN" });
  });
  it("rejects handler bypass even when callers fake normalized input", async () => {
    const i = input();
    for (const personOverride of [{ gender: "" as const }, { birthTime: "", birthTimeUnknown: true }]) {
      expect((await generateMajorFortuneProductDraft({ ...i, person: { ...i.person, ...personOverride } }, { now: clock })).ok).toBe(false);
      expect((await generateAnnualFortuneProductDraft({ ...i, kind: "annualFortune", productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { selectedYear: "2026" }, person: { ...i.person, ...personOverride } }, { now: clock })).ok).toBe(false);
    }
  });
  it("validates input through a calculation-only safe response", async () => {
    for (const [p, ok] of [[payload(), true], [payload("major_fortune", { gender: "" }), false], [payload("annual_fortune", { birthTime: "", birthTimeUnknown: true }), false]] as const) {
      const response = await validateInput(new Request("http://localhost/api/reports/validate-input", { method: "POST", body: JSON.stringify(p) }));
      const body = await response.json(); expect(body.ok).toBe(ok);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(JSON.stringify(body)).not.toMatch(/sect|Yun|Supabase|OpenAI|stack|calendarVersion/i);
    }
  });
  it.each(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"])("keeps gender optional and generates %s", async product => {
    const p = payload(product, { gender: "" });
    const candidate = product === "saju_mbti_compatibility" ? { productKey: product, productSlug: "compatibility", relationshipType: "love", personA: p.person, personB: { ...p.person, name: "상대", birthDate: "1996-12-06", birthTime: "14:15" }, productOptions: {} } : p;
    expect(normalizeReportInputPayload(candidate, { now: clock }).ok).toBe(true);
    const r = await generateProductReport(candidate, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
    expect(r.ok, JSON.stringify(r.ok ? null : r)).toBe(true);
  });
  it("removes personal fixture imports and fixed production evaluation year", () => {
    for (const file of ["majorFortuneGenerationHandler", "annualFortuneGenerationHandler"]) {
      const source = readFileSync(`src/lib/report-generation/${file}.ts`, "utf8");
      expect(source).not.toMatch(/majorFortuneFixtures|deokmin-current-major-fortune|majorFortunePreviewCurrentYear/);
    }
    const prepare = readFileSync("src/app/api/payment-checkout/prepare/route.ts", "utf8");
    expect(prepare.indexOf("normalizeReportInputPayload(json.inputSnapshot.reportInputPayload)")).toBeLessThan(prepare.indexOf("const readyOrderRecordResult"));
    const ui = readFileSync("src/app/report/new/page.tsx", "utf8");
    expect(ui).toContain('input.requiresGender ? "필수" : "선택"');
    expect(ui).toContain("dayunReadiness.key === readinessKey && dayunReadiness.ok");
    expect(ui).toContain('fetch("/api/reports/validate-input"');
    expect(ui).toContain("controller.abort()");
  });
});
