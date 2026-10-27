import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { confirmPaidReport, readPublishedReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { storedBook, validateBookPublication } from "../../../src/lib/book/storedReport";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import {
  DAYUN_CALCULATION_VERSION, SAJU_CALC_VERSION_ID, SAJU_CALENDAR_VERSION, isReadableDayunCalculationVersion, isReadableSajuCalendarVersion, unknownCalculationVersions,
} from "../../../src/lib/saju/calendarVersion";
import { SHINSAL_RULES, shinsalRulesFor } from "../../../src/lib/saju/shinsalConstants";

// Paid snapshots written by the v5-lmt engine (v5/manseryeok-lmt df60d562: generateReportSnapshot with the
// deterministic V3 generator or generateV4ShadowReport, inputs from BOOK_FIXTURES). Phase 0 (463c4f8e) generated
// kst-v2 and only read these; with v5 current they are native. Unknown versions are never cleared either way.
const FIXTURES = ["v3-annual-exact", "v3-major-approximate", "v3-love-unknown", "v4-comprehensive-approximate"] as const;
const load = (name: string): Record<string, unknown> =>
  JSON.parse(gunzipSync(readFileSync(`tests/fixtures/v5-lmt-snapshots/${name}.json.gz`)).toString("utf8"));
const replaced = (name: string, from: string, to: string) => JSON.parse(JSON.stringify(load(name)).replaceAll(from, to)) as Record<string, unknown>;
const readOnlyStore = (snapshot: unknown) => {
  const call = vi.fn(async (action: string) => action === "read_report" ? { ok: true, status: "COMPLETED", snapshot } : { ok: true });
  return { store: { call } as ReliabilityStore, call };
};

describe("v5-lmt and kst-v2 calculation versions are known on read", () => {
  it("publishes v5-lmt and keeps kst-v2 readable", () => {
    expect([SAJU_CALENDAR_VERSION, DAYUN_CALCULATION_VERSION, SAJU_CALC_VERSION_ID]).toEqual(["saju-calendar-v5-lmt", "dayun-utc-sect2-v2", "v5-lmt-2"]);
    expect(shinsalRulesFor(SAJU_CALENDAR_VERSION)).toBe(SHINSAL_RULES);
    expect(isReadableSajuCalendarVersion("saju-calendar-kst-v2")).toBe(true);
    expect(isReadableDayunCalculationVersion("dayun-kst-sect2-v1")).toBe(true);
    expect(isReadableSajuCalendarVersion("saju-calendar-v5-lmt-x")).toBe(false);
    expect(unknownCalculationVersions({ a: [{ calendarVersion: "saju-calendar-v6" }], timeBasis: { calcVersion: "v5-lmt-3" }, b: { calculationVersion: "dayun-x" } }))
      .toEqual(["saju-calendar-v6", "v5-lmt-3", "dayun-x"]);
  });

  it.each(FIXTURES)("%s is read and published without quarantine", async (name) => {
    const snapshot = load(name);
    expect(unknownCalculationVersions(snapshot)).toEqual([]);
    expect(JSON.stringify(snapshot)).toContain('"calendarVersion":"saju-calendar-v5-lmt"');
    const { store, call } = readOnlyStore(snapshot);
    const read = await readPublishedReport(store, String(snapshot.reportId), validateBookPublication);
    expect(read).toMatchObject({ ok: true, status: "COMPLETED" });
    expect(read.snapshot).toEqual(snapshot);
    expect(call.mock.calls.map(([action]) => action)).toEqual(["read_report"]);
    if (snapshot.productVersion === "v4") expect(storedBook(snapshot)).not.toBeNull();
  });

  it("lets new generation publish the current v5-lmt version (legacy rejection: legacyBookProtection)", () => {
    const snapshot = load("v3-love-unknown");
    expect(validateNewProductPublication(String(snapshot.productType), snapshot.draft, snapshot.evidencePacket)).toEqual({ ok: true, errors: [] });
  });
});

// Actual SQL without scripts/paid_report_quarantine_recovery_patch.sql: there, quarantine clears snapshot_json.
describe("unknown calculation version: kept, hidden and logged (actual SQL)", () => {
  let db: PGlite;
  let store: ReliabilityStore;
  let sequence = 0;
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  beforeAll(async () => {
    db = new PGlite();
    await db.exec("create role anon; create role authenticated; create role service_role;");
    for (const file of readdirSync("supabase/migrations").filter((name) => /^\d{4}_.*\.sql$/u.test(name)).sort()) {
      await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^﻿/u, ""));
    }
    await db.exec(readFileSync("supabase/migrations/20260920163924_production_reliability_reconcile.sql", "utf8"));
    store = { async call(action, data = {}) {
      const result = await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)]);
      return result.rows[0].value;
    } };
  }, 30000);
  afterAll(async () => { log.mockRestore(); await db?.close(); });
  afterEach(() => log.mockClear());
  async function published(snapshot: Record<string, unknown>) {
    const orderId = `order-${++sequence}`;
    expect(await store.call("create_order", { paymentOrderId: `po-${sequence}`, providerOrderId: orderId, productType: snapshot.productType, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: { productKey: snapshot.productType } } })).toMatchObject({ ok: true });
    const confirmed = await confirmPaidReport({ orderId, paymentKey: `key-${sequence}`, amount: 1290 }, store, async () =>
      ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId, amount: 1290, status: "DONE" } }));
    const reportId = String(confirmed.reportId);
    const stored = { ...snapshot, reportId };
    await db.query("update paid_report_snapshots set status='COMPLETED', snapshot_json=$2::jsonb, gate_version='paid-report-v1', published_at=now() where report_id=$1", [reportId, JSON.stringify(stored)]);
    return { reportId, stored };
  }
  const row = async (reportId: string) => (await db.query<{ status: string; snapshot_json: unknown }>("select status, snapshot_json from paid_report_snapshots where report_id=$1", [reportId])).rows[0];

  it.each([
    ["calendar", "v3-annual-exact", "saju-calendar-v5-lmt", "saju-calendar-v9-test"],
    ["Dayun", "v3-major-approximate", "dayun-utc-sect2-v2", "dayun-utc-sect2-v9"],
    ["timeBasis", "v3-love-unknown", '"calcVersion":"v5-lmt-2"', '"calcVersion":"v5-lmt-9"'],
    ["V4 calendar", "v4-comprehensive-approximate", "saju-calendar-v5-lmt", "saju-calendar-v9-test"],
  ])("unknown %s version: snapshot_json stays, reader sees attention", async (_kind, name, from, to) => {
    const { reportId, stored } = await published(replaced(name, from, to));
    const read = await readPublishedReport(store, reportId, validateBookPublication);
    const unknown = to.replace(/^"calcVersion":"|"$/gu, "");
    expect(read).toEqual({ ok: true, status: "FAILED_REQUIRES_ATTENTION", code: "UNKNOWN_CALCULATION_VERSION", snapshot: null });
    expect(log).toHaveBeenCalledWith(JSON.stringify({ event: "REPORT_READ_UNKNOWN_CALCULATION_VERSION", reportId, versions: [unknown] }));
    expect(await row(reportId)).toEqual({ status: "COMPLETED", snapshot_json: stored });
  });

  it("a known version that fails the read gate is quarantined as before", async () => {
    const snapshot = load("v3-love-unknown");
    const { reportId } = await published({ ...snapshot, draft: { ...(snapshot.draft as object), productType: "career_money_study" } });
    expect(await readPublishedReport(store, reportId, validateBookPublication)).toEqual({ ok: true, status: "FAILED_REQUIRES_ATTENTION", snapshot: null });
    expect(await row(reportId)).toEqual({ status: "FAILED_REQUIRES_ATTENTION", snapshot_json: null });
    expect(log).not.toHaveBeenCalled();
  });
});
