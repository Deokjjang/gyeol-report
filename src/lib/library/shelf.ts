/**
 * 서재 책장(P 추가 F): 만든 리포트와 구매 내역을 한 줄로 합친다. 브라우저에서도 쓰는 순수 함수(서버 전용 값 없음).
 * - 완성된 책: 카드 전체가 책 링크. v5 책은 기한 없음("언제든 다시 읽을 수 있어요"), v5 이전 책은 열람 기한까지.
 * - 기한이 지난 v5 이전 책·환불·회수된 책은 서재에 남기지 않는다(「만료됨」 카드 없음, P 추가 B).
 * - 만드는 중(결제 주문·이용권 접수) / 확인이 필요해요(생성 실패로 사람이 확인 중)만 상태를 붙인다.
 * 책 본문(snapshot)은 여기 없다 — 책을 열 때만 받는다.
 */
import { bookForProduct, readerTitle } from "../book/product";
import { isOpenEndedAccess, reportAccessOpen } from "../book/accessWindow";
import { validLibraryReportId, type LibraryRow } from "./model";

export type ShelfOrder = { orderCode: string; reportId: string | null; productType: string; paymentStatus: string; bookStatus: string | null; createdAt: string; paidAt: string | null; refundState?: string | null };
export type ShelfPending = { reportId: string; productType: string; state: string; createdAt: string; displayName?: string };
export type ShelfBook = {
  reportId: string; title: string; displayName: string; coverColor: string; ink: string;
  state: "ready" | "making" | "attention";
  /** 카드 링크. 이용권으로 접수해 만드는 중인 책은 아직 열 화면이 없어 null. */
  href: string | null;
  publishedAt: string | null; openEnded: boolean; expiresAt: string | null;
  orderCode: string | null; viaTicket: boolean;
};

const MAKING = new Set(["QUEUED", "GENERATING", "RETRYING", "RUNNING", "PENDING"]);
export function buildShelf(rows: LibraryRow[], orders: ShelfOrder[], pending: ShelfPending[], now = Date.now()): ShelfBook[] {
  const codeByReport = new Map(orders.filter(o => o.reportId).map(o => [o.reportId!, o.orderCode]));
  const ready: (ShelfBook & { at: number })[] = [], seen = new Set<string>();
  for (const row of rows) {
    const book = bookForProduct(row.productType);
    if (!book || !validLibraryReportId(row.reportId) || seen.has(row.reportId)) continue;
    if (row.status !== "available" || !reportAccessOpen(row.expiresAt, now) || !Number.isFinite(Date.parse(row.publishedAt))) continue;
    seen.add(row.reportId);
    const orderCode = codeByReport.get(row.reportId) ?? null;
    ready.push({ reportId: row.reportId, title: readerTitle(book, row.selectedYear ?? ""), displayName: row.displayName, coverColor: book.color, ink: book.ink, state: "ready",
      href: `/reports/${row.reportId}`, publishedAt: row.publishedAt, openEnded: isOpenEndedAccess(row.expiresAt), expiresAt: isOpenEndedAccess(row.expiresAt) ? null : row.expiresAt,
      orderCode, viaTicket: row.source === "ticket", at: Date.parse(row.publishedAt) });
  }
  const working: (ShelfBook & { at: number })[] = [];
  for (const o of orders) {
    if (!o.reportId || seen.has(o.reportId) || o.paymentStatus !== "paid" || o.bookStatus === "COMPLETED" || o.bookStatus === "EXPIRED") continue;
    if (o.refundState && o.refundState !== "none") continue;
    const book = bookForProduct(o.productType);
    if (!book) continue;
    const attention = o.bookStatus === "FAILED_REQUIRES_ATTENTION";
    if (!attention && o.bookStatus !== null && !MAKING.has(o.bookStatus)) continue;
    seen.add(o.reportId);
    working.push({ reportId: o.reportId, title: readerTitle(book, ""), displayName: "", coverColor: book.color, ink: book.ink, state: attention ? "attention" : "making",
      href: `/reports/${o.reportId}`, publishedAt: null, openEnded: false, expiresAt: null, orderCode: o.orderCode, viaTicket: false, at: Date.parse(o.paidAt ?? o.createdAt) || 0 });
  }
  for (const p of pending) {
    const book = bookForProduct(p.productType);
    if (!book || seen.has(p.reportId)) continue;
    seen.add(p.reportId);
    working.push({ reportId: p.reportId, title: readerTitle(book, ""), displayName: p.displayName ?? "", coverColor: book.color, ink: book.ink, state: "making",
      href: null, publishedAt: null, openEnded: false, expiresAt: null, orderCode: null, viaTicket: true, at: Date.parse(p.createdAt) || 0 });
  }
  const strip = ({ at: _at, ...b }: ShelfBook & { at: number }): ShelfBook => { void _at; return b; };
  return [...working.sort((a, b) => b.at - a.at), ...ready.sort((a, b) => b.at - a.at)].map(strip);
}
