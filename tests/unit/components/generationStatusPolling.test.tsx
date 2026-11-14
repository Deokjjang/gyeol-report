// v5 최종 2-1 #7 → W3 P2 30분 결론: 생성 대기 화면이 실제 상태(/api/reports/<id>/progress)를 묻고, 책이 되면 화면을 새로 그린다.
// refresh가 끝나지 않아도(모바일 백그라운드·망 전환) 다시 묻고, 두 번째로 멈추면 페이지를 다시 연다 — 화면이 멈추지 않는다.
// 확인 중·환불 중에도 계속 묻고, 결제 취소 끝·이용권 반환이면 멈춘다. 경과 시간은 서버 시각에서 센다.
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ refresh: vi.fn(), effects: [] as (() => void | (() => void))[], refreshing: false }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }) }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { mocks.effects.push(effect); },
  useTransition: () => [mocks.refreshing, (action: () => void) => action()],
}));
import { ReportGenerationStatus } from "../../../src/components/report/ReportGenerationStatus";
import type { GenerationProgress } from "../../../src/components/report/generationProgress";
import { AutoOpen, AUTO_OPEN_MS } from "../../../src/components/ops/OrderParts";

const ID = "report_0123456789abcdef0123456789abcdef";
const T = "2026-11-14T03:00:00.000Z", at = (min: number) => new Date(Date.parse(T) + min * 60_000).toISOString();
/** 서버 응답 한 개(기본: 결제 책 1차, 방금 시작). */
const P = (o: Partial<GenerationProgress> = {}): GenerationProgress => ({ state: "making", stage: "compute", origin: "paid", attempt: 1, chapters: null, serverNow: T, startedAt: T, ...o });
let doc: EventTarget & { visibilityState: string }, win: EventTarget, reload: ReturnType<typeof vi.fn>, fetchMock: ReturnType<typeof vi.fn>;
const answer = (body: unknown, ok = true) => fetchMock.mockResolvedValueOnce({ ok, json: async () => body });
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

beforeEach(() => {
  vi.useFakeTimers(); mocks.effects = []; mocks.refresh.mockReset(); mocks.refreshing = false;
  doc = Object.assign(new EventTarget(), { visibilityState: "visible" }); win = new EventTarget(); reload = vi.fn(); fetchMock = vi.fn();
  vi.stubGlobal("document", doc); vi.stubGlobal("window", win); vi.stubGlobal("location", { reload, pathname: `/reports/${ID}` }); vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("감독 상태를 묻는 대기 화면", () => {
  it("첫 화면은 서버가 읽은 단계(책 쓰기 n/전체 장)와 서버 시각 경과로 그린다 — 브라우저 시계로 시작 시각을 정하지 않는다", () => {
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z")); // 브라우저 시계가 틀려도 첫 화면은 serverNow − startedAt
    const html = renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={P({ stage: "writing", chapters: { done: 5, total: 13, firstReady: false }, serverNow: at(3) })} />);
    expect(html).toMatch(/aria-current="step"[^>]*>책 쓰기</);
    expect(html).toContain("5/13장 · 3분 0초 지남");
    expect(html).toContain("책을 쓰고 있어요");
    expect(html).toMatch(/data-writing/); // 책 쓰기 그림(줄이 써지는 종이)
    // 광고 측정 카드는 대기 화면에서 숨긴다(html 표시를 걸고, 화면이 사라지면 푼다). 효과 순서: 묻기 · refresh 표시 · 경과 시계 · 카드 숨김.
    const root = { dataset: {} as Record<string, string> };
    vi.stubGlobal("document", Object.assign(doc, { documentElement: root })); vi.stubGlobal("window", Object.assign(win, { dispatchEvent: () => true }));
    const release = mocks.effects[3]?.();
    expect(root.dataset.metaCardHold).toBe("1"); release?.(); expect(root.dataset.metaCardHold).toBeUndefined();
    expect(renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={P({ serverNow: at(6) })} />)).toContain("평소보다 조금 더 걸리고 있어요");
  });

  it("10초마다 진행 상태만 묻고(화면 전체 새로 고침 없음), 완성되면 그때 새로 그린다", async () => {
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={P()} />);
    const stop = mocks.effects[0]();
    answer(P({ stage: "writing", chapters: { done: 2, total: 13, firstReady: true } }));
    vi.advanceTimersByTime(10_000); await flush();
    expect(fetchMock).toHaveBeenCalledWith(`/api/reports/${ID}/progress`, expect.objectContaining({ cache: "no-store" }));
    expect(mocks.refresh).not.toHaveBeenCalled();
    answer(P({ state: "ready", stage: "binding" }));
    vi.advanceTimersByTime(10_000); await flush();
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
    stop?.();
  });

  it("확인 중·환불 중에는 계속 묻고(새로 고침 없음), 결제 취소 끝·이용권 반환이면 묻지 않는다", async () => {
    for (const state of ["concluding", "refunding"] as const) {
      mocks.effects = []; fetchMock.mockReset();
      renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={P({ state })} />);
      const stop = mocks.effects[0]();
      answer(P({ state })); answer(P({ state }));
      vi.advanceTimersByTime(3_000); await flush(); vi.advanceTimersByTime(3_000); await flush();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(mocks.refresh).not.toHaveBeenCalled();
      stop?.();
    }
    for (const state of ["refunded", "returned"] as const) {
      mocks.effects = []; fetchMock.mockReset();
      const html = renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={P({ state, origin: state === "returned" ? "ticket" : "paid" })} />);
      expect(html).toContain(state === "refunded" ? "결제를 취소했어요" : "이용권을 돌려드렸어요");
      expect(html).toContain('href="/account"'); expect(html).not.toContain("data-publishing");
      mocks.effects[0](); mocks.effects[2]();
      expect(vi.getTimerCount()).toBe(0);
    }
  });

  it("탭이 숨으면 묻지 않고, 다시 보이거나(pageshow·online 포함) 돌아오면 바로 묻는다", async () => {
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} />);
    const stop = mocks.effects[0]();
    doc.visibilityState = "hidden"; vi.advanceTimersByTime(30_000); await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    doc.visibilityState = "visible";
    for (const [target, type] of [[doc, "visibilitychange"], [win, "pageshow"], [win, "online"]] as const) {
      answer(P({ stage: "writing" }));
      target.dispatchEvent(new Event(type)); await flush();
    }
    expect(fetchMock).toHaveBeenCalledTimes(3);
    stop?.();
    vi.advanceTimersByTime(60_000); win.dispatchEvent(new Event("online")); await flush();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("묻지 못하면 화면 새로 고침으로 확인하고, refresh가 두 번 멈추면 페이지를 다시 연다", async () => {
    mocks.refreshing = true; // refresh가 끝나지 않는 상황
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} />);
    const stop = mocks.effects[0]();
    fetchMock.mockRejectedValue(new Error("offline"));
    vi.advanceTimersByTime(10_000); await flush(); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(20_000); await flush(); expect(mocks.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(10_000); await flush(); expect(mocks.refresh).toHaveBeenCalledTimes(2); // 30초 넘게 멈춤 → 다시 요청
    expect(reload).not.toHaveBeenCalled();
    vi.advanceTimersByTime(30_000); await flush(); expect(reload).toHaveBeenCalledTimes(1);   // 또 멈춤 → 페이지 다시 열기
    stop?.();
  });

  it("응답이 오지 않는 요청은 8초에 끊는다(요청이 겹쳐 쌓이지 않는다)", async () => {
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} />);
    const stop = mocks.effects[0]();
    let aborted = false;
    fetchMock.mockImplementationOnce((_url: string, init: RequestInit) => new Promise((_, reject) => init.signal!.addEventListener("abort", () => { aborted = true; reject(new Error("aborted")); })));
    vi.advanceTimersByTime(10_000); await flush();
    vi.advanceTimersByTime(8_000); await flush();
    expect(aborted).toBe(true);
    stop?.();
  });
});

// W3 P2: 결제 완료 화면은 약 3초 뒤 같은 대기 화면(/reports/<id>)으로 넘어간다 — 누르면(문의 등) 머문다, 방문 기록은 바꿔 끼운다.
describe("결제 완료 → 책 화면 자동 이동", () => {
  it("3초 뒤 replace로 넘어가고, 화면을 누르면 넘어가지 않는다", () => {
    const replace = vi.fn();
    vi.stubGlobal("window", Object.assign(win, { location: { replace } }));
    expect(AUTO_OPEN_MS).toBe(3_000);
    expect(renderToStaticMarkup(<AutoOpen href={`/reports/${ID}`} />)).toBe("");
    const stop = mocks.effects[0]();
    vi.advanceTimersByTime(AUTO_OPEN_MS - 1); expect(replace).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(replace).toHaveBeenCalledWith(`/reports/${ID}`);
    stop?.();
    mocks.effects = []; replace.mockReset();
    renderToStaticMarkup(<AutoOpen href={`/reports/${ID}`} />);
    const stay = mocks.effects[0]();
    doc.dispatchEvent(new Event("pointerdown"));
    vi.advanceTimersByTime(10_000); expect(replace).not.toHaveBeenCalled();
    stay?.();
  });
});
