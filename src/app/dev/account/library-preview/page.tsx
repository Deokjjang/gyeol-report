import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../lib/account/gate";
import { BOOKS } from "../../../../lib/book/product";
import { libraryItem, type LibraryItem } from "../../../../lib/library/model";
import { LibraryShelf } from "../../../../components/account/Library";
import s from "../../../../components/account/account.module.css";

export const metadata = { robots: { index: false, follow: false } };
// Visual boundary fixtures only. The actual ownership flow is /dev/account.
// Fixed stored timestamps, no alternate retention calculator or auth bypass.
export default async function Page() {
  if (!localAccountAllowed(new Request("http://localhost/dev/account/library-preview", { headers: await headers() }))) notFound();
  const items = BOOKS.map((book, i) => libraryItem({ reportId: `book-local-11111111-1111-4111-8111-${String(i).padStart(12,"0")}`, productType: book.productKey,
    displayName: i === 0 ? "긴 이름을 사용하는 고객과 또 한 사람의 이름" : "검수 고객", selectedYear: book.id === "annual" ? "2027" : null,
    publishedAt: "2026-10-02T00:00:00Z", expiresAt: "2026-12-31T00:00:00Z", reportVersion: "v4", status: i === 4 ? "expired" : "available" }, true, Date.parse("2026-10-03T00:00:00Z"))) as LibraryItem[];
  // Preview links disabled: these metadata-only entries are not real purchases.
  return <main className={s.root}><header className={s.header}><a href="/dev/account">결리포트</a><a href="/dev/account">실제 검수 서재</a></header><section className={`${s.sheet} ${s.librarySheet}`}><p className={s.note}>로컬 표지 경계 검수 · 실제 주문 아님 · 긴 이름 / 만료</p><h1>내 서재</h1><LibraryShelf items={items.map(item => ({ ...item, accessURL: null }))} local /></section></main>;
}
