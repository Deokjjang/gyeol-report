import "server-only";
import { describeProgress, type BookFacts, type GenerationChapters, type GenerationProgress } from "./generationProgress";

/** 결제·이용권 Book 주소 형식(report_ + 영숫자). 다른 값은 저장소를 읽지 않는다. */
export const PROGRESS_REPORT_ID = /^report_[a-z0-9]{13,64}$/;

/** 표 한 행 읽기(service_role, 읽기 전용). 행이 없으면 null, 읽기 실패는 예외. 시험은 PGlite로 같은 표를 읽는다. */
export type RowReader = (table: string, columns: string, key: readonly [column: string, value: string]) => Promise<Record<string, unknown> | null>;
type Store = { call(action: string, data: Record<string, unknown>): Promise<Record<string, unknown>> };
/** 시험 주입용. 운영은 비워 두면 ops 저장소(service_role)로 읽는다. */
export type ProgressDeps = { readonly rows?: RowReader; readonly progress?: Store; readonly now?: () => number };
/** 서버만 쓰는 사실(주인 확인·장 진행률 조회). 화면으로 내보내지 않는다. */
export type ServerBookFacts = BookFacts & { readonly redemptionId: string | null; readonly ownerId: string | null };

const str = (v: unknown) => typeof v === "string" && v ? v : null;
const iso = (v: unknown) => { const t = v instanceof Date ? v.getTime() : typeof v === "string" ? Date.parse(v) : NaN; return Number.isFinite(t) ? new Date(t).toISOString() : null; };
const passed = (v: unknown, now: number) => { const t = v instanceof Date ? v.getTime() : typeof v === "string" ? Date.parse(v) : NaN; return Number.isFinite(t) && t <= now; };

/** 운영 읽기: 표마다 한 행(PostgREST, service_role). 시간 상한은 ops 저장소와 같다. */
async function serviceRows(): Promise<RowReader> {
  const [{ createOpsStores, OPS_RPC_TIMEOUT_MS }, { withDeadline }] = await Promise.all([import("../../lib/ops/store"), import("../../lib/network/withDeadline")]);
  const db = createOpsStores().db;
  if (!db) throw new Error("STORAGE_UNAVAILABLE");
  return async (table, columns, [column, value]) => {
    const r = await withDeadline(async signal => await db.from(table).select(columns).eq(column, value).limit(1).abortSignal(signal), OPS_RPC_TIMEOUT_MS);
    if (r.error) throw new Error("ROW_READ_FAILED");
    return (Array.isArray(r.data) ? r.data[0] as unknown as Record<string, unknown> | undefined : undefined) ?? null;
  };
}

type BookRow = { readonly status: string | null; readonly orderId: string | null; readonly redemptionId: string | null; readonly expired: boolean; readonly failures: number; readonly phase: string | null };
/** ① Book 행 + 감독 상태(book_generation_state). Book 행이 없으면 null. */
async function readBookRow(reportId: string, rows: RowReader, now: number): Promise<BookRow | null> {
  const [book, gen] = await Promise.all([
    rows("paid_report_snapshots", "status,order_id,ticket_redemption_id,expires_at", ["report_id", reportId]),
    rows("book_generation_state", "failures,phase", ["report_id", reportId]).catch(() => null), // 감독 시작 전이거나 못 읽으면 1차·포기 아님
  ]);
  return book ? { status: str(book.status), orderId: str(book.order_id), redemptionId: str(book.ticket_redemption_id), expired: passed(book.expires_at, now),
    failures: Number(gen?.failures) || 0, phase: str(gen?.phase) } : null;
}
/** ② 결제 책 = 주문(paid_at·status)·환불(state), 이용권 책 = 접수(policy_at·state·주인). */
async function readOrigin(book: BookRow, rows: RowReader): Promise<ServerBookFacts | null> {
  const base = { bookStatus: book.status, expired: book.expired, failures: book.failures, phase: book.phase };
  if (book.redemptionId) {
    const r = await rows("report_ticket_redemptions", "user_id,state,policy_at,created_at", ["id", book.redemptionId]);
    return { ...base, origin: "ticket", startedAt: iso(r?.policy_at) ?? iso(r?.created_at), paymentStatus: null, refundState: null, ticketState: str(r?.state),
      redemptionId: book.redemptionId, ownerId: str(r?.user_id) };
  }
  if (!book.orderId) return null;
  const [order, refund] = await Promise.all([rows("payment_orders", "status,paid_at", ["payment_order_id", book.orderId]), rows("order_refunds", "state", ["payment_order_id", book.orderId])]);
  return { ...base, origin: "paid", startedAt: iso(order?.paid_at), paymentStatus: str(order?.status), refundState: str(refund?.state), ticketState: null, redemptionId: null, ownerId: null };
}
/** 이 Book의 결론에 필요한 사실(W3 P2). Book 행이 없으면 null, 읽기 실패는 예외. */
export async function readBookFacts(reportId: string, rows: RowReader, now = Date.now()): Promise<ServerBookFacts | null> {
  const book = await readBookRow(reportId, rows, now);
  return book ? readOrigin(book, rows) : null;
}

/**
 * 발행 전에 결제가 취소된 결제 책(30분 결론의 자동 환불)이면 그 진행 상태(state refunded), 아니면 null.
 * 결제가 환불되면 기존 읽기(read_report)는 이 책을 '없음'으로 돌려주므로 페이지가 따로 묻는다. 완성 뒤 환불된 책은 기존 「환불된 주문」 안내 그대로.
 */
export async function readRefundedBeforePublish(reportId: string, deps: ProgressDeps = {}): Promise<GenerationProgress | null> {
  if (!PROGRESS_REPORT_ID.test(reportId)) return null;
  try {
    const now = deps.now?.() ?? Date.now(), facts = await readBookFacts(reportId, deps.rows ?? await serviceRows(), now);
    if (!facts || facts.origin !== "paid" || facts.bookStatus === "COMPLETED") return null;
    const p = describeProgress({ facts, now });
    return p.state === "refunded" ? p : null;
  } catch { return null; }
}

/**
 * 생성 대기 화면용 진행 상태(읽기 전용, W3 P2). 예외를 밖으로 내지 않는다. 두 번 묻는다(① Book·감독 ② 주문·환불 또는 이용권 + 장 진행률을 함께).
 * - knownStatus: 페이지가 이미 읽은 Book 상태. 사실을 못 읽으면 이 값으로만 정한다(없으면 unknown — 화면은 그대로, 계속 확인).
 * - ticketOwner: 이용권 책은 주인만 본다. 페이지는 확인한 회원 id를, 공개 진행 API는 지금 로그인한 회원을 묻는 함수를 넘긴다.
 *   넘기지 않거나 주인이 아니면 이용권 책은 unknown(결제 책은 지금처럼 주소를 아는 사람이 대기 화면과 같은 정보를 본다).
 */
export async function readGenerationProgress(reportId: string, opts: { readonly knownStatus?: string; readonly ticketOwner?: string | (() => Promise<string | null>); readonly deps?: ProgressDeps } = {}): Promise<GenerationProgress> {
  const now = opts.deps?.now?.() ?? Date.now();
  const fallback = describeProgress({ facts: null, now, knownStatus: opts.knownStatus });
  if (!PROGRESS_REPORT_ID.test(reportId)) return fallback; // 저장소를 읽지 않는다(페이지가 읽은 상태만)
  let facts: ServerBookFacts | null, chapters: GenerationChapters | null = null;
  try {
    const rows = opts.deps?.rows ?? await serviceRows();
    const book = await readBookRow(reportId, rows, now);
    if (!book) return fallback;
    const finished = book.status === "COMPLETED" || book.status === "EXPIRED" || book.expired;
    // 진짜 진행률(am_writer_progress: 결제 책은 reportId, 이용권 책은 접수 id). 원고 본문은 내보내지 않는다(1장 미리보기는 있는지만).
    const readChapters = async (): Promise<GenerationChapters | null> => {
      if (finished) return null;
      try {
        const progress = opts.deps?.progress ?? (await import("../../lib/ops/store")).createOpsStores().progress;
        const p = await progress.call("read", book.redemptionId ? { redemptionId: book.redemptionId } : { reportId });
        return p.ok === true ? { done: Number(p.done) || 0, total: typeof p.total === "number" ? p.total : null, firstReady: Boolean(p.first) } : null;
      } catch { return null; }
    };
    [facts, chapters] = await Promise.all([readOrigin(book, rows), readChapters()]);
  } catch { return fallback; }
  if (!facts) return fallback;
  if (facts.origin === "ticket") {
    const viewer = typeof opts.ticketOwner === "function" ? await opts.ticketOwner().catch(() => null) : opts.ticketOwner ?? null;
    if (!viewer || viewer !== facts.ownerId) return describeProgress({ facts: null, now });
  }
  return describeProgress({ facts, chapters, now });
}
