import "server-only";
import { Suspense } from "react";
import { BookHomePresentation, BookInputPresentation, BookFooterPresentation, BookLegalPresentation } from "./BookEntry";
import { getAnnualFortuneCurrentYear } from "../../lib/report-knowledge/annualFortuneYearRules";
import { accountPublicEnabled } from "../../lib/account/gate";

// The server gate selects these wrappers. Client dynamic boundaries keep the
// Book presentation implementation out of the default-OFF initial bundle.
export async function BookHomeRoute({ internal = false }: { internal?: boolean }) {
  return <BookHomePresentation inputPath={internal ? "/dev/book-flow/input" : "/report/new"} year={getAnnualFortuneCurrentYear()} authEnabled={internal || accountPublicEnabled()} />;
}
export async function BookInputRoute({ internal = false }: { internal?: boolean }) {
  return <Suspense fallback={<p>입력 준비 중</p>}><BookInputPresentation internal={internal} authEnabled={internal || accountPublicEnabled()} now={new Date().toISOString()} /></Suspense>;
}
export async function BookFooterRoute() {
  return <BookFooterPresentation />;
}
export async function BookLegalRoute({ index }: { index: number }) {
  return <BookLegalPresentation index={index} />;
}
