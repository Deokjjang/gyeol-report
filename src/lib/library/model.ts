import { bookForProduct, readerTitle } from "../book/product";
import { safeDisplayName } from "../account/policy";

export type LibraryRow = { reportId: string; productType: string; displayName: string; selectedYear: string | null; publishedAt: string; expiresAt: string; reportVersion: string; status: "available" | "expired" | "unavailable" };
export type LibraryItem = LibraryRow & { title: string; coverColor: string; ink: string; accessURL: string | null };
export type ClaimState = "owned" | "claimable" | "unavailable";
export function validLibraryReportId(value: unknown, local = false): value is string {
  // Local review includes both preview IDs and real paid-worker IDs from coupon SQL.
  return typeof value === "string" && (/^report_[a-z0-9_-]{13,80}$/i.test(value) || (local && /^book-local-[a-f0-9-]{36}$/i.test(value)));
}
export function libraryItem(row: LibraryRow, local = false, now = Date.now()): LibraryItem | null {
  const book = bookForProduct(row.productType);
  if (!book || !validLibraryReportId(row.reportId, local) || !Number.isFinite(Date.parse(row.publishedAt)) || !Number.isFinite(Date.parse(row.expiresAt))) return null;
  const status = Date.parse(row.expiresAt) <= now ? "expired" : row.status;
  return { ...row, status, displayName: status === "available" ? row.displayName : "", title: readerTitle(book, row.selectedYear ?? ""), coverColor: book.color, ink: book.ink,
    // Version-aware existing route, NEVER a generation endpoint.
    accessURL: status === "available" ? `${local ? "/dev/book-flow/report" : "/reports"}/${row.reportId}` : null };
}
export function purchaseMetadata(payload: unknown): { displayName: string; selectedYear: string | null } {
  const p = payload as { person?: { name?: string }; personA?: { name?: string }; personB?: { name?: string }; productOptions?: { selectedYear?: string } } | null;
  const names = p?.personA && p.personB ? [p.personA.name, p.personB.name] : [p?.person?.name];
  const year = p?.productOptions?.selectedYear;
  return { displayName: names.map(safeDisplayName).join(" · "), selectedYear: typeof year === "string" && /^\d{4}$/.test(year) ? year : null };
}
export function libraryDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}
