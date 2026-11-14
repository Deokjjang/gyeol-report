/**
 * 생성 대기 화면의 진행 상태(W3 P2 30분 결론). 서버가 실제 상태(Book·주문·환불·이용권·감독·저장된 장 수)로 정한 값만 그린다.
 * - 시작 = 결제 확인(payment_orders.paid_at) 또는 이용권 접수(report_ticket_redemptions.policy_at). 그 뒤 30분 안에 결론이 난다:
 *   책이 나오거나(ready), 결제가 자동 전액 환불되거나(refunding → refunded), 이용권이 자동으로 돌아간다(returned).
 * - 경과 시간은 서버 시각(serverNow − startedAt)에서 화면이 자기 시계로 흐른 만큼만 더한다(브라우저 시계로 시작 시각을 정하지 않는다).
 * - 문구는 경과 시간(5분·15분·30분)과 시도 차수(1차·2차)로 고른다. 단계는 저장된 장 수로만 정한다(시간으로 꾸미지 않는다).
 * 이 파일은 순수 함수만 둔다(브라우저·서버 공용). 저장소 읽기는 generationProgressServer.ts.
 */
import { APOLOGY_NOTICE_MS, CONCLUSION_DEADLINE_MS, DELAY_NOTICE_MS } from "../../lib/ops/config";

/**
 * making = 쓰는 중 · concluding = 서버가 포기했거나(30분 결론 직전) 확인 중, 아직 환불 요청 전 · refunding = 자동 환불 요청·처리 중
 * refunded = 결제 취소 끝 · returned = 이용권을 돌려줌 · ready = 발행됨 · expired = 열람 기간 끝 · unknown = 읽지 못함(화면은 그대로, 계속 확인)
 */
export type GenerationState = "making" | "concluding" | "refunding" | "refunded" | "returned" | "ready" | "expired" | "unknown";
/** 그림과 1:1인 단계: 명식 계산(저장된 장 0) → 책 쓰기(n/전체 장) → 검수(모든 장 저장, 발행 전) → 제본(발행). */
export type GenerationStage = "compute" | "writing" | "review" | "binding";
export const GENERATION_STAGES: readonly { readonly key: GenerationStage; readonly label: string }[] = [
  { key: "compute", label: "명식 계산" }, { key: "writing", label: "책 쓰기" }, { key: "review", label: "검수" }, { key: "binding", label: "제본" },
];
export type GenerationChapters = { readonly done: number; readonly total: number | null; readonly firstReady: boolean };
/** 공개 진행 API(/api/reports/<id>/progress)의 응답 모양. 원고·사유·비용·주문 정보(금액·결제 키)는 담지 않는다. */
export type GenerationProgress = {
  readonly state: GenerationState;
  readonly stage: GenerationStage;
  /** 결제 책인지 이용권 책인지(문구: 「결제 후」·자동 취소 / 「접수 후」·이용권 반환). 모르면 null(결제 문구). */
  readonly origin: "paid" | "ticket" | null;
  /** 1 = 1차 쓰는 중, 2 = 앞선 시도가 실패해 2차로 처음부터 다시 쓰는 중(book_generation_state.failures ≥ 1). */
  readonly attempt: 1 | 2;
  /** 저장된 장 수 / 전체 장 수(am_writer_progress). 전체를 모르면 total null. 못 읽으면 null. */
  readonly chapters: GenerationChapters | null;
  /** 서버가 이 응답을 만든 시각(ISO). */
  readonly serverNow: string;
  /** 시작 시각(ISO). 모르면 null(경과 시간 문구 없이 첫 문구). */
  readonly startedAt: string | null;
};

/** 서버가 읽은 사실(읽기 전용 표 값). 화면으로는 GenerationProgress만 나간다. */
export type BookFacts = {
  readonly origin: "paid" | "ticket";
  /** paid_report_snapshots.status */
  readonly bookStatus: string | null;
  /** 열람 기한(expires_at)이 지났는지. */
  readonly expired: boolean;
  readonly startedAt: string | null;
  /** 결제 책: payment_orders.status(paid · refunded · canceled …) */
  readonly paymentStatus: string | null;
  /** 결제 책: order_refunds.state(requested · processing · failed · done) */
  readonly refundState: string | null;
  /** 이용권 책: report_ticket_redemptions.state(QUEUED · RUNNING · COMPLETED · REVERSED) */
  readonly ticketState: string | null;
  /** book_generation_state.failures(실패한 시도 수) · phase(gave_up = 서버가 포기). */
  readonly failures: number;
  readonly phase: string | null;
};

const MAKING = new Set(["QUEUED", "GENERATING", "RETRYING", "RUNNING"]);
const REFUNDING = new Set(["requested", "processing", "failed"]);

/** 화면 상태. 환불·반환이 발행보다 먼저다(환불된 주문의 책은 열지 않는다). 사실을 못 읽으면 페이지가 이미 읽은 Book 상태로만. */
export function conclusionState(facts: BookFacts | null, knownStatus?: string): GenerationState {
  if (!facts) {
    if (knownStatus === "COMPLETED") return "ready";
    if (knownStatus === "EXPIRED") return "expired";
    if (knownStatus === "FAILED_REQUIRES_ATTENTION") return "concluding";
    return knownStatus && MAKING.has(knownStatus) ? "making" : "unknown";
  }
  if (facts.origin === "paid") {
    if (facts.paymentStatus === "refunded" || facts.paymentStatus === "canceled" || facts.refundState === "done") return "refunded";
    if (facts.refundState && REFUNDING.has(facts.refundState)) return "refunding";
  } else if (facts.ticketState === "REVERSED") return "returned";
  if (facts.expired || facts.bookStatus === "EXPIRED") return "expired";
  if (facts.bookStatus === "COMPLETED") return "ready";
  if (facts.bookStatus === "FAILED_REQUIRES_ATTENTION" || facts.phase === "gave_up") return "concluding";
  if ((facts.bookStatus && MAKING.has(facts.bookStatus)) || (facts.ticketState && MAKING.has(facts.ticketState))) return "making";
  return "unknown";
}

/** 단계는 저장된 장 수로만: 0장 = 명식 계산, 일부 = 책 쓰기, 전부 = 검수, 발행 = 제본. */
export function stageOf(state: GenerationState, chapters: GenerationChapters | null): GenerationStage {
  if (state === "ready") return "binding";
  const done = chapters?.done ?? 0, total = chapters?.total ?? null;
  if (done <= 0) return "compute";
  return total !== null && total > 0 && done >= total ? "review" : "writing";
}

const isoOrNull = (value: unknown) => {
  const t = value instanceof Date ? value.getTime() : typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
};

export function describeProgress({ facts, chapters = null, now, knownStatus }: { facts: BookFacts | null; chapters?: GenerationChapters | null; now: number; knownStatus?: string }): GenerationProgress {
  const state = conclusionState(facts, knownStatus);
  return { state, stage: stageOf(state, chapters), origin: facts?.origin ?? null, attempt: (facts?.failures ?? 0) > 0 ? 2 : 1, chapters,
    serverNow: new Date(now).toISOString(), startedAt: isoOrNull(facts?.startedAt) };
}

/** 더 묻지 않는 상태(책·결제 취소 끝·이용권 반환·열람 끝). 그 밖(쓰는 중·확인 중·환불 중·모름)은 계속 묻는다. */
export const isConcluded = (state: GenerationState) => state === "ready" || state === "refunded" || state === "returned" || state === "expired";

/** 서버 시각 기준 경과(밀리초) = serverNow − startedAt + 응답을 받은 뒤 화면에서 흐른 시간. 시작 시각을 모르면 null. */
export function elapsedMs(p: Pick<GenerationProgress, "serverNow" | "startedAt">, sinceReceivedMs = 0): number | null {
  const start = Date.parse(p.startedAt ?? ""), server = Date.parse(p.serverNow);
  if (!Number.isFinite(start) || !Number.isFinite(server)) return null;
  return Math.max(0, server - start + Math.max(0, sinceReceivedMs));
}
/** 경과 시간 표시(「3분 12초」, 1분 전은 「12초」). 60분부터는 「1시간 넘게」. */
export function elapsedLabel(ms: number | null): string | null {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return null;
  const s = Math.floor(ms / 1000);
  return s >= 3600 ? "1시간 넘게" : s >= 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s}초`;
}
/** 대기 화면의 바뀌는 숫자 한 줄: 「5/13장 · 3분 12초 지남」(장 수를 모르면 경과만, 둘 다 모르면 null). */
export function progressNumbers(chapters: GenerationChapters | null, elapsed: number | null): string | null {
  const parts = [chapters && chapters.total ? `${Math.min(chapters.done, chapters.total)}/${chapters.total}장` : chapters && chapters.done > 0 ? `${chapters.done}장` : null,
    elapsedLabel(elapsed) ? `${elapsedLabel(elapsed)} 지남` : null].filter((x): x is string => x !== null);
  return parts.length ? parts.join(" · ") : null;
}

export type WaitingTone = "start" | "delay" | "apology" | "concluding" | "refunding" | "refunded" | "returned" | "ready" | "expired";
export type WaitingCopy = { readonly tone: WaitingTone; readonly title: string; readonly body: string; /** 카카오톡 채널 문의 버튼. */ readonly support: boolean };
const DEADLINE_MIN = Math.round(CONCLUSION_DEADLINE_MS / 60_000);

/** 대기 화면 문구. 결제 책은 「결제 후」·결제 자동 취소, 이용권 책은 「접수 후」·이용권 자동 반환. 2차일 때만 「처음부터 한 번 더」. */
export function waitingCopy(p: Pick<GenerationProgress, "state" | "origin" | "attempt">, elapsed: number | null): WaitingCopy {
  const ticket = p.origin === "ticket";
  const fallback = ticket ? "이용권은 자동으로 돌려드려요" : "결제는 자동으로 취소돼요";
  const concluding: WaitingCopy = { tone: "concluding", title: "결과를 확인하고 있어요", body: `잠시만 기다려 주세요. 책을 드리지 못하면 ${fallback}.`, support: true };
  switch (p.state) {
    case "ready": return { tone: "ready", title: "책이 다 됐어요", body: "책을 펼치고 있어요.", support: false };
    case "expired": return { tone: "expired", title: "열람 기간이 끝난 리포트예요", body: "", support: false };
    case "refunded": return { tone: "refunded", title: "결제를 취소했어요", body: "결제수단에 따라 바로 또는 영업일 3~5일 안에 돌아가요.", support: false };
    case "returned": return { tone: "returned", title: "이용권을 돌려드렸어요", body: "쓰신 이용권은 내 서재로 돌아갔어요.", support: false };
    case "refunding": return { tone: "refunding", title: "책을 끝까지 만들지 못했어요", body: "결제를 취소하고 있어요.", support: true };
    case "concluding": return concluding;
    default: break;
  }
  if (elapsed !== null && elapsed >= CONCLUSION_DEADLINE_MS) return concluding;
  if (elapsed !== null && elapsed >= APOLOGY_NOTICE_MS) return { tone: "apology", title: "기다리게 해서 죄송해요", body: `아직 쓰고 있어요. ${DEADLINE_MIN}분 안에 책을 드리지 못하면 ${fallback}. 따로 신청하지 않아도 돼요.`, support: true };
  if (elapsed !== null && elapsed >= DELAY_NOTICE_MS) return { tone: "delay", title: "평소보다 조금 더 걸리고 있어요",
    body: `AI 서버가 붐비면 이럴 때가 있어요. ${p.attempt === 2 ? "처음부터 한 번 더 쓰고 있어요. " : ""}늦어도 ${ticket ? "접수 후" : "결제 후"} ${DEADLINE_MIN}분 안에 결과를 알려 드릴게요.`, support: false };
  return { tone: "start", title: "책을 쓰고 있어요", body: "보통 3분 안팎 걸려요. 창을 닫아도 계속 만들고, 다 되면 내 서재에 들어가요.", support: false };
}

/** AM 4부 조회 주기: 3초에서 시작해 점점 길게(최대 20초). 탭이 다시 보이면 처음부터. */
export const POLL_STEPS_MS = [3_000, 3_000, 4_000, 5_000, 7_000, 10_000, 15_000, 20_000] as const;
export const pollDelay = (n: number) => POLL_STEPS_MS[Math.min(n, POLL_STEPS_MS.length - 1)];
