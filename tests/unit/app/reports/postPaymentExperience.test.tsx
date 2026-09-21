import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductPreviewSnapshot } from "../../../../src/lib/report-generation/productPreviewSnapshot";

const mocks = vi.hoisted(() => ({
  call: vi.fn(), refresh: vi.fn(), confirm: vi.fn(), redirect: vi.fn(),
  effects: [] as (() => void | (() => void))[],
  refreshing: false,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }), redirect: mocks.redirect }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { mocks.effects.push(effect); },
  useTransition: () => [mocks.refreshing, (action: () => void) => action()],
}));
vi.mock("../../../../src/lib/payment/paidReportReliabilityStore", () => ({
  createPaidReportReliabilityStore: () => ({ call: mocks.call }),
}));
vi.mock("../../../../src/lib/payment/tossConfirmClient", () => ({ confirmTossPayment: mocks.confirm }));

import ReportResultPage from "../../../../src/app/reports/[reportId]/page";
import TossPaymentSuccessPage from "../../../../src/app/payments/toss/success/page";
import TossPaymentSuccessLoading from "../../../../src/app/payments/toss/success/loading";
import { ReportGenerationStatus } from "../../../../src/components/report/ReportGenerationStatus";
import { ReportStatusView } from "../../../../src/components/report/ReportStatusView";
import BusinessFooter from "../../../../src/components/legal/BusinessFooter";
import { generateProductReport } from "../../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot } from "../../../../src/lib/report-generation/productPreviewSnapshot";

const reportId = "report_postpayment_fixture";
const states = ["QUEUED", "GENERATING", "RETRYING", "FAILED_REQUIRES_ATTENTION", "EXPIRED", "COMPLETED"] as const;
let snapshot: ProductPreviewSnapshot;

beforeAll(async () => {
  const result = await generateProductReport({ productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "테스트", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획자", focusAreas: [] }, productOptions: {} }, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
  if (!result.ok) throw new Error("Deterministic fixture failed");
  const built = createProductPreviewSnapshot({ reportId, createdAtIso: "2026-09-21T00:00:00Z", productKey: "saju_mbti_full", productSlug: "saju-mbti-full", draft: result.draft as ProductPreviewSnapshot["draft"], evidencePacket: result.evidencePacket });
  if (!built.ok) throw new Error("Fixture snapshot failed");
  snapshot = built.value;
});

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  mocks.call.mockReset(); mocks.refresh.mockReset(); mocks.confirm.mockReset(); mocks.redirect.mockReset();
  mocks.effects = []; mocks.refreshing = false;
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });

async function renderState(status: string) {
  mocks.call.mockResolvedValue({ ok: true, status, snapshot: status === "COMPLETED" ? snapshot : null });
  return renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
}

const internalCopy = /\b(?:QUEUED|GENERATING|RETRYING|FAILED_REQUIRES_ATTENTION|job|attempt|fallback|validator|snapshot|OpenAI|model|provider|paymentKey|confirm_token|lease|RPC)\b/iu;
const visibleText = (html: string) => html.replace(/<[^>]*>/gu, " ");

describe("post-payment canonical route, mock transport only", () => {
  it.each(states)("renders %s on repeat visits without triggering generation", async (status) => {
    const html = await renderState(status);
    expect(await renderState(status)).toBe(html);
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }], ["read_report", { reportId }]]);
    expect(visibleText(html)).not.toMatch(internalCopy);
    expect(html.match(/<h1[\s>]/gu)).toHaveLength(1);
    if (status === "COMPLETED") {
      expect(html).toContain("리포트 공유하기");
      expect(html).toContain("나도 내 리포트 보기");
      expect(html).toContain("기초 정보");
    } else {
      expect(html).not.toContain("리포트 공유하기");
      expect(html).not.toContain('href="/report/new');
      expect(html).not.toContain("리포트를 찾을 수 없습니다");
      expect(html).toContain('role="status"');
      expect(html).toContain('focusable="false"');
    }
    // Optional local-only visual fixture export. No app route or transport is added.
    const directory = process.env.POSTPAYMENT_QA_DIR;
    if (directory) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(`${directory}/${status}.html`, html);
      writeFileSync(`${directory}/footer.html`, renderToStaticMarkup(<BusinessFooter />));
    }
  });

  it("distinguishes automatic recovery from manual attention honestly", async () => {
    const waiting = await renderState("RETRYING");
    expect(waiting).toContain("평소보다 시간이 조금 더 걸리고 있습니다");
    expect(waiting).toContain("페이지를 닫아도 준비는 계속됩니다");
    expect(visibleText(waiting)).not.toMatch(/실패|재시도|오류/u);
    const attention = await renderState("FAILED_REQUIRES_ATTENTION");
    expect(attention).toContain("결제가 정상적으로 완료되었습니다");
    expect(attention).toContain("확인이 필요합니다");
    expect(attention).not.toContain("준비는 계속됩니다");
    expect(attention).toContain('href="tel:050-6664-8562"');
    expect(attention).toContain('href="mailto:support@dvem.ai"');
    expect(attention).toContain("추가 결제는 필요하지 않습니다");
  });

  it("explains expiry without requiring another purchase", async () => {
    const html = await renderState("EXPIRED");
    expect(html).toContain("90일의 온라인 열람 기간");
    expect(html).toContain("홈으로 돌아가기");
    expect(html).not.toContain("결제가 정상적으로 완료되었습니다");
    expect(html).not.toContain("결제하기");
  });

  it("refresh reaches the existing completed report at the same canonical address", async () => {
    expect(await renderState("GENERATING")).toContain("리포트를 준비하고 있습니다");
    const completed = await renderState("COMPLETED");
    expect(completed).toContain("리포트 공유하기");
    expect(completed).not.toContain("리포트를 준비하고 있습니다");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("does not misrepresent a storage outage as a missing or unpaid report", async () => {
    mocks.call.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("리포트 상태를 확인하지 못했습니다");
    expect(html).toContain('href="tel:050-6664-8562"');
    expect(html).not.toContain("리포트를 찾을 수 없습니다");
    expect(html).not.toContain("결제가 완료된 리포트만");
    expect(html).not.toContain("DURABLE_STORAGE_FAILED");
    expect(html).not.toContain('href="/report/new');
  });

  it("retains the existing quarantine gate for corrupted completed data", async () => {
    mocks.call.mockResolvedValueOnce({ ok: true, status: "COMPLETED", snapshot: { ...snapshot, evidencePacket: undefined } }).mockResolvedValue({ ok: true });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("확인이 필요합니다");
    expect(html).not.toContain("리포트 공유하기");
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }], ["quarantine", { reportId, expectedSnapshot: { ...snapshot, evidencePacket: undefined } }]]);
  });

  it.each(["FAILED_REQUIRES_ATTENTION", "QUEUED", "GENERATING", "RETRYING", "EXPIRED"])("never shares or renders retained forensic content in %s", async status => {
    // Even an adapter returning the retained value must not make it public.
    mocks.call.mockResolvedValue({ ok: true, status, snapshot, code: "PUBLISHED_SNAPSHOT_VALIDATION_FAILED" });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).not.toContain("리포트 공유하기");
    expect(html).not.toContain("기초 정보");
    expect(html).not.toContain("PUBLISHED_SNAPSHOT_VALIDATION_FAILED");
    expect(html).not.toContain('href="/report/new');
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }]]);
  });

  it("hides invalid content and internal errors when quarantine storage is unavailable", async () => {
    mocks.call.mockResolvedValueOnce({ ok: true, status: "COMPLETED", snapshot: null })
      .mockResolvedValueOnce({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("추가 결제는 필요하지 않습니다");
    expect(html).not.toContain("리포트 공유하기");
    expect(html).not.toContain("DURABLE_STORAGE_FAILED");
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }], ["quarantine", { reportId, expectedSnapshot: null }]]);
  });

  it("redirects successful confirmation immediately without rendering provider data", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.call.mockResolvedValue({ ok: true, reportId });
    mocks.redirect.mockImplementation(() => { throw new Error("TEST_REDIRECT"); });
    await expect(TossPaymentSuccessPage({ searchParams: Promise.resolve({ paymentKey: "mock-key", orderId: "mock-order", amount: "1290" }) })).rejects.toThrow("TEST_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith(`/reports/${reportId}`);
    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it("does not claim payment success while confirmation is pending or repeat confirmation on a timer", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.call.mockResolvedValue({ ok: true, pending: true });
    const html = renderToStaticMarkup(await TossPaymentSuccessPage({ searchParams: Promise.resolve({ paymentKey: "mock-key", orderId: "mock-order", amount: "1290" }) }));
    for (const value of ["mock-key", "mock-order", "1290", "ready_to_confirm", "결제가 정상적으로 완료되었습니다"]) expect(html).not.toContain(value);
    expect(html).toContain("고객센터");
    expect(mocks.effects).toHaveLength(0);
    const loading = renderToStaticMarkup(<TossPaymentSuccessLoading />);
    expect(loading).toContain("결제 상태를 확인하고 있습니다");
    expect(loading).not.toContain("결제가 정상적으로 완료되었습니다");
  });
});

describe("status refresh lifecycle", () => {
  it.each([false, true])("polls every 10s only while visible, delayed=%s", (delayed) => {
    vi.useFakeTimers();
    const document = { visibilityState: "visible" };
    vi.stubGlobal("document", document);
    renderToStaticMarkup(<ReportGenerationStatus delayed={delayed} />);
    const cleanup = mocks.effects[0]();
    vi.advanceTimersByTime(9999); expect(mocks.refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    document.visibilityState = "hidden";
    vi.advanceTimersByTime(30000); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    document.visibilityState = "visible";
    vi.advanceTimersByTime(10000); expect(mocks.refresh).toHaveBeenCalledTimes(2);
    cleanup?.();
    vi.advanceTimersByTime(30000); expect(mocks.refresh).toHaveBeenCalledTimes(2);
    expect(mocks.call).not.toHaveBeenCalled();
    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it("stops scheduling at attention, expiry, completion/unmount and in-flight refresh", () => {
    vi.useFakeTimers();
    renderToStaticMarkup(<ReportGenerationStatus attention />);
    mocks.effects[0]();
    expect(vi.getTimerCount()).toBe(0);
    mocks.effects = []; mocks.refreshing = true;
    renderToStaticMarkup(<ReportGenerationStatus />); mocks.effects[0]();
    expect(vi.getTimerCount()).toBe(0);
    mocks.effects = [];
    renderToStaticMarkup(<ReportStatusView state="expired" />);
    expect(mocks.effects).toHaveLength(0);
  });

  it("uses reduced motion, visible focus and a small decorative orbit without fake progress", () => {
    const css = readFileSync("src/components/report/reportStatus.module.css", "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("animation: none; transform: none");
    expect(css).toContain(":focus-visible");
    const html = renderToStaticMarkup(<ReportStatusView state="preparing" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("progressbar");
    expect(html).not.toMatch(/\d+%/u);
  });
});
