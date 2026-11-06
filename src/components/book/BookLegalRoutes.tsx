"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PreviewFooter } from "../../app/dev/book-preview/BookPages";
import { LEGAL_TITLES, LegalDocument } from "../../app/dev/book-preview/BookLegal";
import s from "../../app/dev/book-preview/book.module.css";
import f from "./flow.module.css";

export function BookFooter() {
  const path = usePathname();
  if (/^\/(?:reports|r)\//.test(path)) return null;
  // 관리자 화면에는 고객용 푸터를 붙이지 않는다(P6e-ops 9).
  if (/^\/admin(?:\/|$)/.test(path)) return null;
  return <div className={s.root} style={{ minHeight: 0 }} data-book-footer><PreviewFooter publicPresentation /></div>;
}
export function BookLegalPage({ index }: { index: number }) {
  const [active, setActive] = useState<number | null>(index);
  return <main className={s.root} data-book-legal><header className={s.header}><Link href="/" className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></Link></header>
    <div className={`${s.legalAccordion} ${f.legalPage}`}><h1>{LEGAL_TITLES[index]}</h1>
      {/* 운영 Q: 문의 안내는 푸터 한 줄과 환불정책 맨 위 3줄에만 둔다(이 머리말 줄은 뺐다). */}
      {LEGAL_TITLES.map((title, i) => <details key={title} open={active === i} onToggle={e => { const open = e.currentTarget.open; setActive(current => open ? i : current === i ? null : current); }}><summary>{title}<span aria-hidden="true">+</span></summary><LegalDocument index={i} onNavigate={setActive} /></details>)}
    </div></main>;
}
