import { describe, expect, it } from "vitest";
import { conclusionState, describeProgress, elapsedLabel, elapsedMs, isConcluded, pollDelay, POLL_STEPS_MS, progressNumbers, stageOf, waitingCopy, type BookFacts } from "../../../src/components/report/generationProgress";
import { APOLOGY_NOTICE_MS, CONCLUSION_DEADLINE_MS, DELAY_NOTICE_MS } from "../../../src/lib/ops/config";
import { chapterForStore, chapterFromStore } from "../../../src/lib/writer/runner";

const MIN = 60_000;
const paid = (o: Partial<BookFacts> = {}): BookFacts => ({ origin: "paid", bookStatus: "GENERATING", expired: false, startedAt: "2026-11-14T03:00:00Z", paymentStatus: "paid", refundState: null, ticketState: null, failures: 0, phase: null, ...o });
const ticket = (o: Partial<BookFacts> = {}): BookFacts => paid({ origin: "ticket", paymentStatus: null, ticketState: "RUNNING", ...o });

// W3 P2 30분 결론: 시작(결제 확인·이용권 접수) 뒤 30분 안에 책 / 자동 전액 환불 / 이용권 자동 반환. 화면 문구·단계는 서버의 실제 상태로만.
describe("30분 결론 설정값", () => {
  it("결론 30분 · 지연 안내 5분 · 사과 15분(설정값 하나)", () => {
    expect(CONCLUSION_DEADLINE_MS).toBe(30 * MIN);
    expect(DELAY_NOTICE_MS).toBe(5 * MIN);
    expect(APOLOGY_NOTICE_MS).toBe(15 * MIN);
  });
});

describe("대기 화면 문구(경과 시간 · 결제/이용권 · 1차/2차)", () => {
  const making = { state: "making", origin: "paid", attempt: 1 } as const;
  it("처음 5분: 「책을 쓰고 있어요」 — 시작 시각을 모를 때도 같다", () => {
    for (const elapsed of [0, DELAY_NOTICE_MS - 1, null]) expect(waitingCopy(making, elapsed)).toEqual({ tone: "start", title: "책을 쓰고 있어요", body: "보통 3분 안팎 걸려요. 창을 닫아도 계속 만들고, 다 되면 내 서재에 들어가요.", support: false });
    expect(waitingCopy({ ...making, origin: "ticket", attempt: 2 }, 4 * MIN).tone).toBe("start");
  });
  it("5분부터: 평소보다 조금 더 — 2차일 때만 「처음부터 한 번 더」, 결제 후 / 접수 후", () => {
    expect(waitingCopy(making, DELAY_NOTICE_MS)).toEqual({ tone: "delay", title: "평소보다 조금 더 걸리고 있어요", body: "AI 서버가 붐비면 이럴 때가 있어요. 늦어도 결제 후 30분 안에 결과를 알려 드릴게요.", support: false });
    expect(waitingCopy({ ...making, attempt: 2 }, 10 * MIN).body).toBe("AI 서버가 붐비면 이럴 때가 있어요. 처음부터 한 번 더 쓰고 있어요. 늦어도 결제 후 30분 안에 결과를 알려 드릴게요.");
    expect(waitingCopy({ ...making, origin: "ticket", attempt: 2 }, 10 * MIN).body).toBe("AI 서버가 붐비면 이럴 때가 있어요. 처음부터 한 번 더 쓰고 있어요. 늦어도 접수 후 30분 안에 결과를 알려 드릴게요.");
    expect(waitingCopy({ ...making, origin: "ticket" }, 10 * MIN).body).not.toContain("처음부터");
  });
  it("15분부터: 사과 + 자동 취소(결제) / 자동 반환(이용권) + 카카오톡 문의", () => {
    expect(waitingCopy(making, APOLOGY_NOTICE_MS)).toEqual({ tone: "apology", title: "기다리게 해서 죄송해요", body: "아직 쓰고 있어요. 30분 안에 책을 드리지 못하면 결제는 자동으로 취소돼요. 따로 신청하지 않아도 돼요.", support: true });
    expect(waitingCopy({ ...making, origin: "ticket" }, 20 * MIN).body).toBe("아직 쓰고 있어요. 30분 안에 책을 드리지 못하면 이용권은 자동으로 돌려드려요. 따로 신청하지 않아도 돼요.");
  });
  it("30분이 지났는데 아직이면(서버 결론 전) 「결과를 확인하고 있어요」 — 「30분 안에」 약속을 되풀이하지 않는다", () => {
    const c = waitingCopy(making, CONCLUSION_DEADLINE_MS);
    expect(c).toMatchObject({ tone: "concluding", title: "결과를 확인하고 있어요", support: true });
    expect(c.body).not.toContain("30분 안에");
  });
  it("결론 상태 문구: 확인 중 · 결제 취소 중 · 결제 취소 끝 · 이용권 반환", () => {
    expect(waitingCopy({ ...making, state: "concluding" }, 1 * MIN).title).toBe("결과를 확인하고 있어요");
    expect(waitingCopy({ ...making, state: "refunding" }, 26 * MIN)).toEqual({ tone: "refunding", title: "책을 끝까지 만들지 못했어요", body: "결제를 취소하고 있어요.", support: true });
    expect(waitingCopy({ ...making, state: "refunded" }, 40 * MIN)).toEqual({ tone: "refunded", title: "결제를 취소했어요", body: "결제수단에 따라 바로 또는 영업일 3~5일 안에 돌아가요.", support: false });
    expect(waitingCopy({ state: "returned", origin: "ticket", attempt: 1 }, 26 * MIN)).toMatchObject({ tone: "returned", title: "이용권을 돌려드렸어요" });
    for (const s of ["concluding", "refunding", "refunded", "returned"] as const) expect(waitingCopy({ ...making, state: s, origin: "ticket" }, null).body).not.toMatch(/24시간|6시간|임시본|최대/);
  });
});

describe("단계(저장된 장 수로만)", () => {
  it("0장 = 명식 계산 · 일부 = 책 쓰기 · 전부 저장(발행 전) = 검수 · 발행 = 제본", () => {
    expect(stageOf("making", null)).toBe("compute");
    expect(stageOf("making", { done: 0, total: 13, firstReady: false })).toBe("compute");
    expect(stageOf("making", { done: 5, total: 13, firstReady: true })).toBe("writing");
    expect(stageOf("making", { done: 3, total: null, firstReady: false })).toBe("writing");
    expect(stageOf("making", { done: 13, total: 13, firstReady: true })).toBe("review");
    expect(stageOf("ready", { done: 0, total: null, firstReady: false })).toBe("binding");
  });
  it("숫자 줄: 「5/13장 · 3분 12초 지남」, 장 수를 모르면 경과만", () => {
    expect(progressNumbers({ done: 5, total: 13, firstReady: false }, 192_000)).toBe("5/13장 · 3분 12초 지남");
    expect(progressNumbers({ done: 14, total: 13, firstReady: false }, 0)).toBe("13/13장 · 0초 지남");
    expect(progressNumbers(null, 45_000)).toBe("45초 지남");
    expect(progressNumbers({ done: 0, total: null, firstReady: false }, null)).toBeNull();
    expect(elapsedLabel(3_700_000)).toBe("1시간 넘게");
  });
});

describe("결론 상태(실제 표 값)", () => {
  it("결제 책: 만드는 중 → (포기·확인 필요) 확인 중 → 환불 요청·처리·재시도 = 취소 중 → 환불 끝 = 취소 끝. 환불이 발행보다 먼저", () => {
    expect(conclusionState(paid())).toBe("making");
    expect(conclusionState(paid({ bookStatus: "QUEUED" }))).toBe("making");
    expect(conclusionState(paid({ phase: "gave_up" }))).toBe("concluding");
    expect(conclusionState(paid({ bookStatus: "FAILED_REQUIRES_ATTENTION" }))).toBe("concluding");
    for (const s of ["requested", "processing", "failed"]) expect(conclusionState(paid({ bookStatus: "FAILED_REQUIRES_ATTENTION", refundState: s }))).toBe("refunding");
    expect(conclusionState(paid({ refundState: "done" }))).toBe("refunded");
    expect(conclusionState(paid({ paymentStatus: "refunded", bookStatus: "COMPLETED" }))).toBe("refunded");
    expect(conclusionState(paid({ bookStatus: "COMPLETED" }))).toBe("ready");
    expect(conclusionState(paid({ bookStatus: "COMPLETED", expired: true }))).toBe("expired");
  });
  it("이용권 책: 접수·쓰는 중 = 만드는 중, 반환(REVERSED) = 이용권 돌려줌", () => {
    expect(conclusionState(ticket({ ticketState: "QUEUED" }))).toBe("making");
    expect(conclusionState(ticket({ ticketState: "REVERSED", bookStatus: "FAILED_REQUIRES_ATTENTION" }))).toBe("returned");
    expect(conclusionState(ticket({ ticketState: "COMPLETED", bookStatus: "COMPLETED" }))).toBe("ready");
  });
  it("사실을 못 읽으면 페이지가 읽은 Book 상태로만(없으면 unknown)", () => {
    expect(conclusionState(null, "RETRYING")).toBe("making");
    expect(conclusionState(null, "FAILED_REQUIRES_ATTENTION")).toBe("concluding");
    expect(conclusionState(null, "COMPLETED")).toBe("ready");
    expect(conclusionState(null)).toBe("unknown");
  });
  it("응답 모양: 1차/2차(failures) · 서버 시각 · 시작 시각, 주문 정보 없음", () => {
    const p = describeProgress({ facts: paid({ failures: 1 }), chapters: { done: 2, total: 13, firstReady: true }, now: Date.parse("2026-11-14T03:07:00Z") });
    expect(p).toEqual({ state: "making", stage: "writing", origin: "paid", attempt: 2, chapters: { done: 2, total: 13, firstReady: true }, serverNow: "2026-11-14T03:07:00.000Z", startedAt: "2026-11-14T03:00:00.000Z" });
    expect(describeProgress({ facts: paid(), now: 0 }).attempt).toBe(1);
    expect(elapsedMs(p)).toBe(7 * MIN);
    expect(elapsedMs(p, 30_000)).toBe(7 * MIN + 30_000); // 받은 뒤 화면에서 흐른 시간만 더한다
    expect(elapsedMs({ ...p, startedAt: null })).toBeNull();
  });
  it("더 묻지 않는 상태는 책·결제 취소 끝·이용권 반환·열람 끝뿐", () => {
    expect((["ready", "refunded", "returned", "expired"] as const).every(isConcluded)).toBe(true);
    expect((["making", "concluding", "refunding", "unknown"] as const).some(isConcluded)).toBe(false);
  });
});

// AM 4부 대기 화면: 조회 주기 3초에서 점점 길게 · 먼저 읽기 저장 형식.
describe("대기 화면 진행", () => {
  it("조회 주기 3초에서 점점 길게(최대 20초)", () => {
    expect(pollDelay(0)).toBe(3_000);
    expect(pollDelay(3)).toBe(5_000);
    expect(pollDelay(99)).toBe(20_000);
    expect([...POLL_STEPS_MS].every((v, i, a) => i === 0 || v >= a[i - 1])).toBe(true);
  });
  it("장 저장 행에 전체 장 수·미리보기를 담고, 읽을 때는 뗀다(작가 원고는 그대로)", () => {
    const chapter = { n: 1, title: "2027 큰 그림", sections: [{ heading: "a", paragraphs: ["본문"] }] };
    const stored = chapterForStore({ n: 1, chapter, source: "writer", total: 10, preview: { n: 1, title: "2027 큰 그림", sections: [{ heading: "a", paragraphs: ["본문"] }], hidden: 0 } });
    expect(stored).toMatchObject({ _total: 10, _preview: { hidden: 0 } });
    expect(chapterFromStore(stored)).toEqual(chapter);
  });
});
