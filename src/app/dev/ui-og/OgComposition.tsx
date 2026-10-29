"use client";
import type { CSSProperties } from "react";
import { Cover } from "../../dev/book-preview/BookPages";
import { BOOKS } from "../../../lib/book/product";
import s from "../../dev/book-preview/book.module.css";

export function OgComposition() {
  return <main className={s.root} style={{ minHeight: 0 }}>
    <div id="og" style={{ width: 1200, height: 630, display: "grid", gridTemplateColumns: "400px 1fr", alignItems: "center", padding: "0 72px", background: "var(--paper)", colorScheme: "light", overflow: "hidden" }}>
      <div>
        <p style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.2 }}>결리포트</p>
        <p style={{ fontSize: 15, letterSpacing: ".3em", color: "var(--ink-2)", marginTop: 8 }}>GYEOL REPORT</p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 26, marginTop: 48, lineHeight: 1.6 }}>사주와 MBTI로 쓰는<br />나에 관한 한 권</p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink-2)", marginTop: 24 }}>한 사람, 한 권.</p>
      </div>
      <div style={{ position: "relative", height: 460 }}>
        {BOOKS.map((book, i) => <div key={book.id} style={{ position: "absolute", width: 196, height: 284, left: 18 + i * 92, top: 64 + Math.abs(i - 2.5) * 18, transform: `rotate(${(i - 2.5) * 3}deg)`, zIndex: 10 - Math.round(Math.abs(i - 2.5) * 2), boxShadow: "0 12px 28px rgb(40 30 18 / .16)" } as CSSProperties}><Cover book={book} title={book.id === "annual" ? "나의\n2026" : undefined} /></div>)}
      </div>
    </div>
  </main>;
}
