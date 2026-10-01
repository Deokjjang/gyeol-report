import { bookForProduct, readerTitle } from "./product";
export type BookShareModel = { title: string; displayTitle: string; coverColor: string; issue: string; reportUrl: string; shareUrl: string | null; token: string | null };
// Metadata projection only. No token issuance, SDK, fetch or URL mutation.
export function projectBookShare(input: { productType: string; names: string; selectedYear?: string; reportId: string; shareUrl?: string | null }): BookShareModel | null {
  const book = bookForProduct(input.productType);
  if (!book) return null;
  const title = readerTitle(book, input.selectedYear ?? "");
  let shareUrl: string | null = null, token: string | null = null;
  if (input.shareUrl) {
    try {
      const url = new URL(input.shareUrl, "https://gyeolreport.com");
      if (url.origin === "https://gyeolreport.com" && /^\/r\/[A-Za-z0-9_-]+$/.test(url.pathname) && !url.search && !url.hash) { shareUrl = url.href; token = url.pathname.slice(3); }
    } catch { /* Invalid metadata is omitted, never turned into a link. */ }
  }
  return { title, displayTitle: `${input.names}님의 ${title}`, coverColor: book.color, issue: book.issue, reportUrl: `/reports/${encodeURIComponent(input.reportId)}`, shareUrl, token };
}
