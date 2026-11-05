import "server-only";
import { Suspense } from "react";
import { BookHomePresentation, BookInputPresentation, BookFooterPresentation, BookLegalPresentation } from "./BookEntry";
import { getAnnualFortuneCurrentYear } from "../../lib/report-knowledge/annualFortuneYearRules";
import { accountPublicEnabled } from "../../lib/account/gate";
import { ticketShopEnabled } from "../../lib/tickets/shopGate";
import { closedSaleProducts, giftEventConfig } from "../../lib/ops/config";
import { writerV5Products } from "../../lib/writer/flags";

// The server gate selects these wrappers. Client dynamic boundaries keep the
// Book presentation implementation out of the default-OFF initial bundle.
export async function BookHomeRoute({ internal = false }: { internal?: boolean }) {
  return <BookHomePresentation inputPath={internal ? "/dev/book-flow/input" : "/report/new"} year={getAnnualFortuneCurrentYear()} authEnabled={internal || accountPublicEnabled()} closed={closedSaleProducts()} />;
}
export async function BookInputRoute({ internal = false }: { internal?: boolean }) {
  return <Suspense fallback={<p>입력 준비 중</p>}><BookInputPresentation internal={internal} authEnabled={internal || accountPublicEnabled()} ticketShopEnabled={internal || ticketShopEnabled()} now={new Date().toISOString()} closed={closedSaleProducts()} v5Products={writerV5Products()} giftEventProducts={giftEventProductsNow()} /></Suspense>;
}
/** 최종 A 16: 지금(서버 시각) 1+1 이벤트가 걸린 상품 — 영수증 한 줄에만 쓴다. 이벤트 기간 밖이면 빈 배열. */
function giftEventProductsNow(): readonly string[] { const cfg = giftEventConfig(); return cfg.active ? cfg.products : []; }
export async function BookFooterRoute() {
  return <BookFooterPresentation />;
}
export async function BookLegalRoute({ index }: { index: number }) {
  return <BookLegalPresentation index={index} />;
}
