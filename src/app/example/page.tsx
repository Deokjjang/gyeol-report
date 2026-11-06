import type { Metadata } from "next";
import { BookReadingPresentation } from "../../components/book/BookEntry";
import { EXAMPLE_BOOK, EXAMPLE_CTA, EXAMPLE_DESCRIPTION, EXAMPLE_TAG, EXAMPLE_TITLE } from "../../lib/book/example";
import { projectBookShare } from "../../lib/book/shareModel";
import { SHARE_ORIGIN } from "../../lib/sharing/reportShareMetadata";

/**
 * 최종 A 15: 공개 예시 리포트. 지어낸 인물 서하은의 v5 종합 책 저장본 앞 2장을 기존 책 화면 그대로 보여 준다(호출 0, DB 0).
 * 공유 미리보기(광고용): og 제목·설명 + 책 표지 이미지(/example/og, 기존 책 공유 이미지 렌더러).
 */
const OG_IMAGE = `${SHARE_ORIGIN}/example/og`;
export const metadata: Metadata = {
  title: { absolute: `${EXAMPLE_TITLE} | 결리포트` },
  description: EXAMPLE_DESCRIPTION,
  alternates: { canonical: `${SHARE_ORIGIN}/example` },
  openGraph: { title: `${EXAMPLE_TITLE} | 결리포트`, description: EXAMPLE_DESCRIPTION, url: `${SHARE_ORIGIN}/example`, type: "website", siteName: "결리포트", locale: "ko_KR",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "결리포트 예시 · 나라는 사람" }] },
  twitter: { card: "summary_large_image", title: `${EXAMPLE_TITLE} | 결리포트`, description: EXAMPLE_DESCRIPTION, images: [OG_IMAGE] },
};

export default function ExamplePage() {
  const share = projectBookShare({ productType: EXAMPLE_BOOK.source.productType, names: EXAMPLE_BOOK.data.names })!;
  return <BookReadingPresentation data={EXAMPLE_BOOK.data} today={EXAMPLE_BOOK.today} edition={EXAMPLE_BOOK.edition} share={share} home="/" example={{ tag: EXAMPLE_TAG, cta: EXAMPLE_CTA }} />;
}
