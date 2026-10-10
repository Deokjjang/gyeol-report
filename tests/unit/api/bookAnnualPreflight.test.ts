import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import { POST as preflight } from "../../../src/app/api/reports/validate-input/route";
import { POST as prepare } from "../../../src/app/api/payment-checkout/prepare/route";
import { DAYUN_UNCERTAIN_MESSAGE } from "../../../src/lib/saju/customerDayun";
import { enqueueTicketPublication } from "../../../src/lib/tickets/publication";
import { redeemReportTicket } from "../../../src/lib/tickets/service";
import { createCheckoutConsentEvidence } from "../../../src/lib/payment/checkoutConsent";
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { singleRuntimeInput } from "../interpretation-v4/runtimeFixtures";

const storage = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
const payload = { ...singleRuntimeInput("annual_fortune", "annual-fortune", {
  id: "uncertain", name: "출시검수6", date: "1998-08-29", gender: "MALE", mbti: "",
  context: { jobStatus: "", detailJob: "", relationshipStatus: "married" },
}), productOptions: { contentVersion: "v3", selectedYear: "2026" } };
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

it("uncertain Annual fails before order, local redeem or production queue; exact correction can retry", async () => {
  vi.useFakeTimers(); const now = new Date("2026-10-11T03:00:00Z"); vi.setSystemTime(now);
  const check = (p: unknown) => preflight(new Request("http://localhost/api/reports/validate-input", { method: "POST", body: JSON.stringify(p) }));
  const failed = await check(payload);
  expect(failed.status).toBe(400);
  expect(await failed.json()).toEqual({ ok: false, message: DAYUN_UNCERTAIN_MESSAGE });
  const order = await prepare(new Request("http://localhost/api/payment-checkout/prepare", { method: "POST", body: JSON.stringify({
    provider: "toss", productType: payload.productKey, consent: adultCheckoutConsent(),
    inputSnapshot: { displayName: payload.person.name, birthDate: payload.person.birthDate, reportInputPayload: payload },
  }) }));
  expect(order.status).toBe(400); expect(storage.create).not.toHaveBeenCalled();
  expect(await order.json()).not.toHaveProperty("checkoutSession");
  const store = { call: vi.fn() }, consent = createCheckoutConsentEvidence(adultCheckoutConsent(), payload.person.birthDate, now)!;
  expect(await enqueueTicketPublication(store, "local-user", randomUUID(), payload, consent, now)).toMatchObject({ ok: false, code: "INVALID_INPUT" });
  expect(await redeemReportTicket(store, "local-user", randomUUID(), payload, { now })).toMatchObject({ ok: false, code: "INVALID_INPUT" });
  expect(store.call).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  const corrected = { ...payload, person: { ...payload.person, birthTime: "18:20", birthTimeUnknown: false, birthTimePrecision: "exact" } };
  expect(await (await check(corrected)).json()).toEqual({ ok: true });
  // Unknown is not globally disallowed: this actual Dayun interval is stable.
  const stable = { ...payload, person: { ...payload.person, birthDate: "1979-04-17", gender: "FEMALE" } };
  expect(await (await check(stable)).json()).toEqual({ ok: true });
});

it("Book uses canonical message before receipt and shares one calculation-only Dayun precheck", () => {
  const ui = readFileSync("src/components/book/BookInput.tsx", "utf8");
  expect(ui).toContain('const localValidation = internal && !requiredGender');
  expect(ui).toContain('typeof result.message === "string" ? result.message');
  expect(ui.indexOf('if (!result.ok)')).toBeLessThan(ui.indexOf('const nextStep'));
  expect(ui).toContain('if (attempt !== validationId.current) return');
  const css = readFileSync("src/app/dev/book-preview/book.module.css", "utf8");
  expect(css).toContain('height: calc(100% - 54px - env(safe-area-inset-bottom, 0px))');
  expect(css).toContain('height: calc(54px + env(safe-area-inset-bottom, 0px))');
  expect(css).toContain('padding: 0 20px env(safe-area-inset-bottom, 0px)');
  expect(css).not.toContain('padding-bottom: 34px');
});
