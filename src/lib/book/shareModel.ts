import type { Metadata } from "next";
import { bookForProduct, readerTitle } from "./product";
import { sanitizeShareName, SHARE_ORIGIN, SHARE_TOKEN_PATTERN } from "../sharing/reportShareMetadata";
import { kakaoShareCard } from "../sharing/shareBrowser";

export type BookShareModel = {
  shareToken: string | null; shareUrl: string | null; productType: string;
  bookTitle: string; issueNumber: string; coverColor: string;
  displayName: string; displayTitle: string; reportVersion: "v4";
  publishedAt: string | null; expiresAt: string | null; isShareable: boolean;
  referral?: { token: string; url: string; mayJoin: boolean; launchEvent?: boolean };
};
// Allowlisted presentation only. Never contains a private report URL or input packet.
export function projectBookShare(input: { productType: string; names: string; selectedYear?: string; shareUrl?: string | null; publishedAt?: string; expiresAt?: string }): BookShareModel | null {
  const book = bookForProduct(input.productType);
  if (!book) return null;
  const bookTitle = readerTitle(book, input.selectedYear ?? ""), displayName = sanitizeShareName(input.names);
  let shareUrl: string | null = null, shareToken: string | null = null;
  try {
    const url = new URL(input.shareUrl ?? "");
    const token = url.pathname.slice(3);
    if (url.origin === SHARE_ORIGIN && url.pathname === `/r/${token}` && SHARE_TOKEN_PATTERN.test(token) && !url.search && !url.hash && !url.username && !url.password) {
      shareUrl = url.href; shareToken = token;
    }
  } catch { /* No usable credential, no share action. */ }
  const personalTitle = book.id === "love" ? "사랑 이야기" : book.id === "annual" ? bookTitle.replace(/^나의 /, "") : bookTitle;
  return { shareToken, shareUrl, productType: book.productKey, bookTitle, issueNumber: book.issue, coverColor: book.color,
    displayName, displayTitle: displayName ? `${displayName}의 ${personalTitle}` : bookTitle, reportVersion: "v4",
    publishedAt: input.publishedAt ?? null, expiresAt: input.expiresAt ?? null,
    isShareable: Boolean(shareUrl && input.publishedAt && input.expiresAt) };
}
export const bookOgUrl = (model: BookShareModel) => model.shareUrl ? `${model.shareUrl}/book-og` : null;
export function bookNativeData(model: BookShareModel) {
  return { title: model.displayTitle, description: "한 권 펼쳐보세요.", url: model.referral?.url ?? model.shareUrl ?? "", productSlug: bookForProduct(model.productType)!.slug };
}
export function bookKakaoCard(model: BookShareModel) {
  return kakaoShareCard({ ...bookNativeData(model), title: model.displayName ? `${model.displayName}님의 책이 도착했습니다.` : "한 권의 책이 도착했습니다." },
    { imageUrl: bookOgUrl(model) ?? "", width: 1200, height: 630, button: "책 펼쳐보기" });
}
export function bookShareMetadata(model: BookShareModel): Metadata {
  const title = `${model.displayTitle} | 결리포트`, description = model.displayName ? `${model.displayName}님의 책을 펼쳐보세요.` : "한 권 펼쳐보세요.";
  const images = [{ url: bookOgUrl(model)!, width: 1200, height: 630, alt: model.displayTitle }];
  return { title: { absolute: title }, description, referrer: "no-referrer", robots: { index: false, follow: false, nocache: true, noarchive: true },
    alternates: { canonical: model.shareUrl! }, openGraph: { title, description, url: model.shareUrl!, type: "website", siteName: "결리포트", locale: "ko_KR", images },
    twitter: { card: "summary_large_image", title, description, images } };
}
