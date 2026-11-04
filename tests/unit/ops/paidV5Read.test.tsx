// P6d-ops: v5 작가 원고로 발행된 유료 Book이 /reports/[id]에서 Book 열람 화면으로 열린다(전에는 "저장된 리포트 형식을 확인할 수 없습니다").
// 실제 결제 SQL(PGlite) → v5 생성(결정론 작가, 외부 호출 0) → finish_job → 실제 리포트 페이지. 구매자 확인은 V4와 같은 경로.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
const ports = vi.hoisted(() => ({ store: null as null | { call(action: string, data?: Record<string, unknown>): Promise<unknown> }, canRead: true }));
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("404"); } }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => true }));
vi.mock("../../../src/lib/account/gate", () => ({ accountPublicEnabled: () => true, localAccountAllowed: () => false }));
vi.mock("../../../src/lib/book/ownerAccess", () => ({ loadOwnedTicketBook: async () => ({ kind: "absent" }), canReadPurchasedBook: async () => ports.canRead }));
vi.mock("../../../src/lib/sharing/reportShareStore", () => ({ existingReportShareUrl: async () => null }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", async original => ({ ...await original<object>(), createPaidReportReliabilityStore: () => ports.store }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);
vi.mock("../../../src/components/analytics/MetaPurchaseTracker", () => ({ default: () => <div data-meta-purchase /> }));
import { confirmPaidReport, runPaidReportJob, type PaidV5Builder } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { WRITER_DISABLED_RUNTIME as runtime } from "../../../src/lib/report-generation/writerDisabled";
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
import { BookReadingPresentation } from "../../../src/components/book/BookEntry";
import ReportPage from "../../../src/app/reports/[reportId]/page";

let db: PGlite, store: ReliabilityStore;
const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" };
beforeAll(async () => {
  db = new PGlite(); await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const name of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8").replace(/^\uFEFF/u, ""));
  for (const name of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql", "scripts/paid_checkout_consent_evidence_patch.sql", "scripts/paid_report_one_call_delivery_patch.sql"]) await db.exec(readFileSync(name, "utf8"));
  store = { async call(action, data = {}) { return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value; } };
  ports.store = store;
}, 60000);
afterAll(async () => { vi.unstubAllEnvs(); await db?.close(); });

describe("유료 v5 Book 열람", () => {
  it("결제 → v5 발행 → /reports/[id]가 Book 열람 화면, 구매자가 아니면 열지 않는다", async () => {
    const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: {} };
    expect(await store.call("create_order", { paymentOrderId: "po", providerOrderId: "provider", productType: "saju_mbti_full", provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
    const order = await confirmPaidReport({ orderId: "provider", paymentKey: "mock-key", amount: 1290 }, store, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: "provider", amount: 1290, status: "DONE" } }));
    const v5: PaidV5Builder = async job => ({ snapshot: (await buildV5Snapshot({ payload: job.payload as never, reportId: job.report_id, policyAt: new Date(job.created_at).toISOString(), sink: { save: async () => true, load: async () => [] }, recover: false, deps: { provider: "openai", model: "", people: async () => [] } })).snapshot as unknown as Record<string, unknown> });
    expect(await runPaidReportJob(store, runtime, vi.fn(), undefined, v5)).toMatchObject({ status: "COMPLETED" });
    await (BookReadingPresentation as unknown as { render: { preload: () => Promise<unknown> } }).render.preload();
    const reportId = String(order.reportId);
    vi.stubEnv("NODE_ENV", "development"); // 페이지는 test 모드에서 저장소 읽기를 건너뛴다(기존 bookPublicFlow와 같은 방식)
    const html = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("data-book-report");
    expect(html).not.toContain("저장된 리포트 형식을 확인할 수 없습니다");
    ports.canRead = false;
    expect(renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId }) }))).not.toContain("data-book-report");
  }, 120000);
});
