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

// These persisted legacy paid fixtures exercise the canonical reader after owner authorization.
vi.mock("../../../../src/lib/book/ownerAccess", () => ({ loadOwnedTicketBook: async () => ({ kind: "absent" }), canReadPurchasedBook: async () => true }));
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
      expect(html).not.toContain("<svg");
      if (["QUEUED", "GENERATING", "RETRYING"].includes(status)) expect(html).toContain('data-publishing="preparing"');
      else expect(html).not.toContain("data-publishing");
    }
    // Optional local-only visual fixture export. No app route or transport is added.
    const directory = process.env.POSTPAYMENT_QA_DIR;
    if (directory) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(`${directory}/${status}.html`, html);
      writeFileSync(`${directory}/footer.html`, renderToStaticMarkup(<BusinessFooter />));
    }
  });

  // W3 P2 30분 결론: 다시 쓰는 중도 같은 대기 화면(실패·재시도 말 없음), 생성이 멈춘 책은 「결과를 확인하고 있어요」 + 자동 취소 안내 + 카카오톡 문의.
  it("distinguishes automatic recovery from the concluding state honestly", async () => {
    const waiting = await renderState("RETRYING");
    expect(waiting).toContain("책을 쓰고 있어요");
    expect(waiting).toContain("창을 닫아도 계속 만들고, 다 되면 내 서재에 들어가요.");
    expect(visibleText(waiting)).not.toMatch(/실패|재시도|오류|24시간|임시본/u);
    const concluding = await renderState("FAILED_REQUIRES_ATTENTION");
    expect(concluding).not.toContain("결제가 정상적으로 완료되었습니다");
    expect(concluding).toContain("결과를 확인하고 있어요");
    expect(concluding).toContain("책을 드리지 못하면 결제는 자동으로 취소돼요.");
    // 운영 Q: 상담 창구는 카카오톡 채널 링크 하나(전화·메일 링크 없음).
    expect(concluding).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
    expect(concluding).toContain("카카오톡 채널로 문의하기");
    expect(concluding).not.toMatch(/href="(?:tel:|mailto:)|고객센터/);
    expect(concluding).toContain("문의할 때 이 페이지 주소를 함께 알려 주세요.");
  });

  it("explains expiry in one line without requiring another purchase (P 추가 B)", async () => {
    const html = await renderState("EXPIRED");
    expect(html).toContain("열람 기간이 끝난 리포트예요");
    expect(html).not.toContain("90일의 온라인 열람 기간");
    expect(html).not.toContain("결제가 정상적으로 완료되었습니다");
    expect(html).not.toContain("결제하기");
  });

  it("refresh reaches the existing completed report at the same canonical address", async () => {
    expect(await renderState("GENERATING")).toContain("책을 쓰고 있어요");
    const completed = await renderState("COMPLETED");
    expect(completed).toContain("리포트 공유하기");
    expect(completed).not.toContain("책을 쓰고 있어요");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("does not misrepresent a storage outage as a missing or unpaid report", async () => {
    mocks.call.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("리포트 상태를 확인하지 못했습니다");
    expect(html).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
    expect(html).not.toMatch(/href="tel:|고객센터/);
    expect(html).not.toContain("리포트를 찾을 수 없습니다");
    expect(html).not.toContain("결제가 완료된 리포트만");
    expect(html).not.toContain("DURABLE_STORAGE_FAILED");
    expect(html).not.toContain('href="/report/new');
  });

  // v5 최종3: 열람 검사에 걸려도 격리하지 않는다(저장본 그대로, 로그만). 손상 내용은 그리지 않고 같은 안내를 보인다.
  it("hides corrupted completed data without quarantining it", async () => {
    mocks.call.mockResolvedValueOnce({ ok: true, status: "COMPLETED", snapshot: { ...snapshot, evidencePacket: undefined } }).mockResolvedValue({ ok: true });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("확인이 필요합니다");
    expect(html).not.toContain("리포트 공유하기");
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }]]);
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

  it("hides invalid content and internal errors without any storage write", async () => {
    mocks.call.mockResolvedValueOnce({ ok: true, status: "COMPLETED", snapshot: null })
      .mockResolvedValueOnce({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId }) }));
    expect(html).toContain("추가 결제는 필요 없어요");
    expect(html).not.toContain("리포트 공유하기");
    expect(html).not.toContain("DURABLE_STORAGE_FAILED");
    expect(mocks.call.mock.calls).toEqual([["read_report", { reportId }]]);
  });

  it("redirects successful confirmation immediately without rendering provider data", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.call.mockResolvedValue({ ok: true, reportId });
    mocks.redirect.mockImplementation(() => { throw new Error("TEST_REDIRECT"); });
    await expect(TossPaymentSuccessPage({ searchParams: Promise.resolve({ paymentKey: "mock-key", orderId: "mock-order", amount: "1290" }) })).rejects.toThrow("TEST_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith(`/reports/${reportId}?purchase=1`);
    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it("does not claim payment success while confirmation is pending or repeat confirmation on a timer", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    mocks.call.mockResolvedValue({ ok: true, pending: true });
    const html = renderToStaticMarkup(await TossPaymentSuccessPage({ searchParams: Promise.resolve({ paymentKey: "mock-key", orderId: "mock-order", amount: "1290" }) }));
    for (const value of ["mock-key", "mock-order", "1290", "ready_to_confirm", "결제가 정상적으로 완료되었습니다"]) expect(html).not.toContain(value);
    expect(html).toContain("카카오톡 채널로 문의하기"); // 운영 Q: 예전 「고객센터」 전화·메일 링크 대신
    expect(mocks.effects).toHaveLength(0);
    const loading = renderToStaticMarkup(<TossPaymentSuccessLoading />);
    expect(loading).toContain("결제 상태를 확인하고 있습니다");
    expect(loading).not.toContain("결제가 정상적으로 완료되었습니다");
  });
});

describe("status refresh lifecycle", () => {
  it.each(["making", "concluding"] as const)("polls every 10s only while visible without a report address (%s)", (state) => {
    vi.useFakeTimers();
    const document = { visibilityState: "visible" };
    vi.stubGlobal("document", document);
    renderToStaticMarkup(<ReportGenerationStatus progress={{ state, stage: "compute", origin: "paid", attempt: 1, chapters: null, serverNow: "2026-11-14T03:00:00Z", startedAt: null }} />);
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

  // W3 P2: 결제 취소 끝·이용권 반환이면 더 묻지 않는다(확인 중·환불 중은 계속 묻는다 — generationStatusPolling).
  it("stops scheduling at refund-done, ticket return, expiry and completion/unmount", () => {
    vi.useFakeTimers();
    for (const state of ["refunded", "returned"] as const) {
      mocks.effects = [];
      renderToStaticMarkup(<ReportGenerationStatus reportId="report_0123456789abcdef0123456789abcdef" progress={{ state, stage: "compute", origin: "paid", attempt: 1, chapters: null, serverNow: "2026-11-14T03:00:00Z", startedAt: null }} />);
      mocks.effects[0](); mocks.effects[2]();
      expect(vi.getTimerCount()).toBe(0);
    }
    mocks.effects = [];
    renderToStaticMarkup(<ReportStatusView state="expired" />);
    expect(mocks.effects).toHaveLength(0);
  });

  // 고정 화면 버그(Q2): 끝나지 않는 refresh가 타이머를 영영 없애던 동작을 고쳤다. 진행 중에도 타이머는 하나 유지되고,
  // 30초 안에는 중복 요청하지 않으며, 그 뒤에는 멈춘 것으로 보고 다시 요청한다.
  it("keeps one poller during an in-flight refresh and re-requests only after it is stuck", () => {
    vi.useFakeTimers();
    vi.stubGlobal("document", { visibilityState: "visible" });
    mocks.effects = []; mocks.refreshing = true;
    renderToStaticMarkup(<ReportGenerationStatus />);
    const cleanup = mocks.effects[0]();
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(10000); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(20000); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(10000); expect(mocks.refresh).toHaveBeenCalledTimes(2);
    cleanup?.(); expect(vi.getTimerCount()).toBe(0);
  });

  it("shows the four real stages (그림과 1:1) without percentages, and a storage outage keeps retrying", () => {
    const html = renderToStaticMarkup(<ReportStatusView state="waiting" waiting={{ tone: "start", stage: "writing", numbers: "5/13장 · 1분 0초 지남" }} />);
    for (const label of ["명식 계산", "책 쓰기", "검수", "제본"]) expect(html).toContain(label);
    expect(html).toMatch(/aria-current="step"[^>]*>책 쓰기</);
    expect(html).toContain("5/13장 · 1분 0초 지남");
    expect(html).not.toMatch(/\d+%/u);
    mocks.effects = [];
    const retry = renderToStaticMarkup(<ReportGenerationStatus retry />);
    expect(retry).toContain("자동으로 다시 확인");
    expect(retry).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
    expect(retry).not.toMatch(/href="tel:|고객센터/);
  });

  // W3 P2: 동작 줄이기 설정이면 그림은 멈추고(줄이 다 그려진 종이 — 빈 종이 없음) 바뀌는 숫자(n/전체 장·경과)로 진행을 보인다.
  it("stops the book-making motion under reduced motion with the line fully drawn, visible focus and existing paper press without fake progress", () => {
    const css = readFileSync("src/components/report/reportStatus.module.css", "utf8");
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{ \.writing i \{ animation: none !important; transform: scaleX\(1\); \} \}/);
    expect(readFileSync("src/components/report/BookPublishingVisual.tsx", "utf8")).toContain("matchMedia(REDUCED_MOTION_QUERY)");
    expect(css).toContain(":focus-visible");
    const html = renderToStaticMarkup(<ReportStatusView state="waiting" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("progressbar");
    expect(html).not.toMatch(/\d+%/u);
  });
});
