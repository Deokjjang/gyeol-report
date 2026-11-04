// v5 최종 2-1 #7: 생성 대기 화면이 감독 상태(/api/reports/<id>/progress)를 묻고, 완성되면 화면을 새로 그린다.
// refresh가 끝나지 않아도(모바일 백그라운드·망 전환) 다시 묻고, 두 번째로 멈추면 페이지를 다시 연다 — 화면이 멈추지 않는다.
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

const ID = "report_0123456789abcdef0123456789abcdef";
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
  it("첫 화면은 서버가 읽은 감독 단계(책 집필)로 그린다 — 경과 시간으로 꾸미지 않는다", () => {
    const html = renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={{ state: "preparing", stage: 2, nextAt: null }} />);
    expect(html).toMatch(/aria-current="step"[^>]*>책 집필</);
    expect(renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={{ state: "delayed", stage: 2, nextAt: null }} />)).toContain("평소보다 조금 더 걸리고 있습니다");
  });

  it("10초마다 진행 상태만 묻고(화면 전체 새로 고침 없음), 완성되면 그때 새로 그린다", async () => {
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} progress={{ state: "preparing", stage: 0, nextAt: null }} />);
    const stop = mocks.effects[0]();
    answer({ state: "preparing", stage: 2, nextAt: null });
    vi.advanceTimersByTime(10_000); await flush();
    expect(fetchMock).toHaveBeenCalledWith(`/api/reports/${ID}/progress`, expect.objectContaining({ cache: "no-store" }));
    expect(mocks.refresh).not.toHaveBeenCalled();
    answer({ state: "ready", stage: 2, nextAt: null });
    vi.advanceTimersByTime(10_000); await flush();
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
    stop?.();
  });

  it("탭이 숨으면 묻지 않고, 다시 보이거나(pageshow·online 포함) 돌아오면 바로 묻는다", async () => {
    renderToStaticMarkup(<ReportGenerationStatus reportId={ID} />);
    const stop = mocks.effects[0]();
    doc.visibilityState = "hidden"; vi.advanceTimersByTime(30_000); await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    doc.visibilityState = "visible";
    for (const [target, type] of [[doc, "visibilitychange"], [win, "pageshow"], [win, "online"]] as const) {
      answer({ state: "preparing", stage: 2, nextAt: null });
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
