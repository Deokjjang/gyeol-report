"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PreviewFooter } from "../../app/dev/book-preview/BookPages";
import { LEGAL_TITLES, LegalDocument, SUPPORT_COPY } from "../../app/dev/book-preview/BookLegal";
import s from "../../app/dev/book-preview/book.module.css";
import f from "./flow.module.css";

export function BookFooter() {
  const path = usePathname();
  if (/^\/(?:reports|r)\//.test(path)) return null;
  return <div className={s.root} style={{ minHeight: 0 }} data-book-footer><PreviewFooter publicPresentation /></div>;
}
export function BookLegalPage({ index }: { index: number }) {
  const [active, setActive] = useState<number | null>(index);
  return <main className={s.root} data-book-legal><header className={s.header}><Link href="/" className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></Link></header>
    <div className={`${s.legalAccordion} ${f.legalPage}`}><h1>{LEGAL_TITLES[index]}</h1><p>{SUPPORT_COPY} <a href="http://pf.kakao.com/_sbHaX/chat" target="_blank" rel="noopener noreferrer">카카오톡 문의 ↗</a></p>
      {LEGAL_TITLES.map((title, i) => <details key={title} open={active === i} onToggle={e => { const open = e.currentTarget.open; setActive(current => open ? i : current === i ? null : current); }}><summary>{title}<span aria-hidden="true">+</span></summary><LegalDocument index={i} onNavigate={setActive} /></details>)}
    </div></main>;
}
