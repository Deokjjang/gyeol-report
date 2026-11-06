/**
 * 서재 책장(P 추가 F): 만든 리포트와 구매 내역을 한 줄로 합친다. 브라우저에서도 쓰는 순수 함수(서버 전용 값 없음).
 * - 완성된 책: 카드 전체가 책 링크. v5 책은 기한 없음("언제든 다시 읽을 수 있어요"), v5 이전 책은 열람 기한까지.
 * - 기한이 지난 v5 이전 책·환불·회수된 책은 서재에 남기지 않는다(「만료됨」 카드 없음, P 추가 B).
 * - 만드는 중(결제 주문·이용권 접수) / 확인이 필요해요(생성 실패로 사람이 확인 중)만 상태를 붙인다.
 * - 운영 Q 2부: 문의 결과 한 줄(열린 요청 = 「접수됨」, 처리 결과는 7일 동안). 환불된 주문 카드는 7일 동안만 「환불됐어요」로 남는다.
 * 책 본문(snapshot)은 여기 없다 — 책을 열 때만 받는다.
 */
import { bookForProduct, readerTitle } from "../book/product";
import { isOpenEndedAccess, reportAccessOpen } from "../book/accessWindow";
import { REQUEST_RESULT_COPY } from "../legal/socialLinks";
import { validLibraryReportId, type LibraryRow } from "./model";

export type ShelfOrder = { orderCode: string; reportId: string | null; productType: string; paymentStatus: string; bookStatus: string | null; createdAt: string; paidAt: string | null; refundState?: string | null; refundedAt?: string | null };
/** 서재 문의 결과(ops_notify 'card_results'): 주문·책마다 가장 최근 요청 1건(열린 것 또는 7일 안에 처리된 것). */
export type ShelfRequest = { orderCode: string | null; reportId: string | null; reason: string; status: string; resolution: string | null; resolvedAt: string | null; createdAt: string };
export type ShelfPending = { reportId: string; productType: string; state: string; createdAt: string; displayName?: string };
export type ShelfBook = {
  reportId: string; title: string; displayName: string; coverColor: string; ink: string;
  state: "ready" | "making" | "attention" | "refunded";
  /** 카드 링크. 이용권으로 접수해 만드는 중인 책은 아직 열 화면이 없어 null. */
  href: string | null;
  publishedAt: string | null; openEnded: boolean; expiresAt: string | null;
  orderCode: string | null; viaTicket: boolean;
  /** 결제(또는 이용권 접수) 시각 — 「지금 만드는 중이에요」(결제 30분 안) 판단용. */
  madeAt: string | null;
  /** 처리 결과 한 줄을 고르는 데 쓰는 마지막 문의(열린 것 또는 7일 안 처리). */
  request: { status: "open" | "done"; reason: string; resolution: string | null; resolvedAt: string | null } | null;
  refundedAt: string | null;
};
export const RESULT_DAYS_MS = 7 * 86_400_000;

const MAKING = new Set(["QUEUED", "GENERATING", "RETRYING", "RUNNING", "PENDING"]);
export function buildShelf(rows: LibraryRow[], orders: ShelfOrder[], pending: ShelfPending[], now = Date.now(), requests: ShelfRequest[] = []): ShelfBook[] {
  const codeByReport = new Map(orders.filter(o => o.reportId).map(o => [o.reportId!, o.orderCode]));
  const orderByCode = new Map(orders.map(o => [o.orderCode, o]));
  const recent = (iso: string | null | undefined) => { const t = Date.parse(iso ?? ""); return Number.isFinite(t) && now - t < RESULT_DAYS_MS; };
  const reqOf = (orderCode: string | null, reportId: string) => {
    const q = requests.find(x => (orderCode && x.orderCode === orderCode) || (!x.orderCode && x.reportId === reportId));
    if (!q || (q.status !== "open" && !recent(q.resolvedAt))) return null;
    return { status: q.status === "open" ? "open" as const : "done" as const, reason: q.reason, resolution: q.resolution, resolvedAt: q.resolvedAt };
  };
  const ready: (ShelfBook & { at: number })[] = [], seen = new Set<string>();
  for (const row of rows) {
    const book = bookForProduct(row.productType);
    if (!book || !validLibraryReportId(row.reportId) || seen.has(row.reportId)) continue;
    if (row.status !== "available" || !reportAccessOpen(row.expiresAt, now) || !Number.isFinite(Date.parse(row.publishedAt))) continue;
    seen.add(row.reportId);
    const orderCode = codeByReport.get(row.reportId) ?? null;
    ready.push({ reportId: row.reportId, title: readerTitle(book, row.selectedYear ?? ""), displayName: row.displayName, coverColor: book.color, ink: book.ink, state: "ready",
      href: `/reports/${row.reportId}`, publishedAt: row.publishedAt, openEnded: isOpenEndedAccess(row.expiresAt), expiresAt: isOpenEndedAccess(row.expiresAt) ? null : row.expiresAt,
      orderCode, viaTicket: row.source === "ticket", madeAt: (orderCode ? orderByCode.get(orderCode)?.paidAt : null) ?? row.publishedAt, request: reqOf(orderCode, row.reportId), refundedAt: null,
      at: Date.parse(row.publishedAt) });
  }
  const working: (ShelfBook & { at: number })[] = [];
  // 환불된 주문: 7일 동안 「환불됐어요」 카드로 남기고(열 수 없음), 그 뒤에는 서재에서 사라진다.
  for (const o of orders) {
    if (!o.reportId || seen.has(o.reportId) || (o.paymentStatus !== "refunded" && o.paymentStatus !== "canceled") || !recent(o.refundedAt)) continue;
    const book = bookForProduct(o.productType);
    if (!book) continue;
    seen.add(o.reportId);
    working.push({ reportId: o.reportId, title: readerTitle(book, ""), displayName: "", coverColor: book.color, ink: book.ink, state: "refunded",
      href: null, publishedAt: null, openEnded: false, expiresAt: null, orderCode: o.orderCode, viaTicket: false, madeAt: o.paidAt ?? o.createdAt, request: null, refundedAt: o.refundedAt ?? null,
      at: Date.parse(o.refundedAt ?? "") || 0 });
  }
  for (const o of orders) {
    if (!o.reportId || seen.has(o.reportId) || o.paymentStatus !== "paid" || o.bookStatus === "COMPLETED" || o.bookStatus === "EXPIRED") continue;
    if (o.refundState && o.refundState !== "none") continue;
    const book = bookForProduct(o.productType);
    if (!book) continue;
    const attention = o.bookStatus === "FAILED_REQUIRES_ATTENTION";
    if (!attention && o.bookStatus !== null && !MAKING.has(o.bookStatus)) continue;
    seen.add(o.reportId);
    working.push({ reportId: o.reportId, title: readerTitle(book, ""), displayName: "", coverColor: book.color, ink: book.ink, state: attention ? "attention" : "making",
      href: `/reports/${o.reportId}`, publishedAt: null, openEnded: false, expiresAt: null, orderCode: o.orderCode, viaTicket: false, madeAt: o.paidAt ?? o.createdAt,
      request: reqOf(o.orderCode, o.reportId), refundedAt: null, at: Date.parse(o.paidAt ?? o.createdAt) || 0 });
  }
  for (const p of pending) {
    const book = bookForProduct(p.productType);
    if (!book || seen.has(p.reportId)) continue;
    seen.add(p.reportId);
    working.push({ reportId: p.reportId, title: readerTitle(book, ""), displayName: p.displayName ?? "", coverColor: book.color, ink: book.ink, state: "making",
      href: null, publishedAt: null, openEnded: false, expiresAt: null, orderCode: null, viaTicket: true, madeAt: p.createdAt, request: reqOf(null, p.reportId), refundedAt: null,
      at: Date.parse(p.createdAt) || 0 });
  }
  const strip = ({ at: _at, ...b }: ShelfBook & { at: number }): ShelfBook => { void _at; return b; };
  return [...working.sort((a, b) => b.at - a.at), ...ready.sort((a, b) => b.at - a.at)].map(strip);
}

/** 책 카드 한 줄(운영 Q 2부). channel = 카카오톡 채널 버튼을 함께 보인다(안내). 7일이 지나면 없다. */
export type CardResult = { kind: "refund" | "regenerate" | "ticket" | "guide"; text: string; channel: boolean };
export function cardResult(b: ShelfBook, now = Date.now()): CardResult | null {
  const recent = (iso: string | null | undefined) => { const t = Date.parse(iso ?? ""); return Number.isFinite(t) && now - t < RESULT_DAYS_MS; };
  if (b.state === "refunded") return recent(b.refundedAt) ? { kind: "refund", text: REQUEST_RESULT_COPY.refund, channel: false } : null;
  const q = b.request;
  if (!q || q.status !== "done" || !recent(q.resolvedAt)) return null;
  if (q.resolution === "refund") return { kind: "refund", text: REQUEST_RESULT_COPY.refund, channel: false };
  if (q.resolution === "regenerate") return { kind: "regenerate", text: REQUEST_RESULT_COPY.regenerate, channel: false };
  if (q.resolution === "ticket") return { kind: "ticket", text: REQUEST_RESULT_COPY.ticket, channel: false };
  return { kind: "guide", text: q.reason === "not_open" ? REQUEST_RESULT_COPY.guideNotOpen : REQUEST_RESULT_COPY.guideOther, channel: true };
}
/** 결제(접수) 뒤 30분 안이고 아직 만드는 중이면 「안 나와요」를 접수하지 않고 기다려 달라고 한다. */
export const MAKING_GRACE_MS = 30 * 60_000;
export const stillMaking = (b: ShelfBook, now = Date.now()) => b.state === "making" && Number.isFinite(Date.parse(b.madeAt ?? "")) && now - Date.parse(b.madeAt!) < MAKING_GRACE_MS;
