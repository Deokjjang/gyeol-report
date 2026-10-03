"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { BookShareModel } from "../../lib/book/shareModel";
import type { BookData } from "../../app/dev/book-preview/bookTypes";
import { bookForProduct } from "../../lib/book/product";
import { bookShareEvent } from "../../lib/book/shareEvents";
import s from "./bookShare.module.css";
const Reader = dynamic(() => import("./BookReading").then(m => m.BookReading), { loading: () => <p role="status">책을 펼치고 있습니다.</p> });

export function SharedBookEntry({ model, local = false }: { model: BookShareModel; local?: boolean }) {
  const [opened, setOpened] = useState<{ data: BookData; share: BookShareModel } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const pending = useRef(false), book = bookForProduct(model.productType)!;
  const home = local ? "/dev/book-flow" : "/";
  async function open() {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      const response = await fetch(`${local ? "/dev/book-flow" : ""}/r/${model.shareToken}/book-data`, { cache: "no-store", credentials: "omit" });
      if (!response.ok) { setError("이 책을 열 수 없습니다. 공유 기간이 지났거나 공유가 해제되었을 수 있습니다."); return; }
      const result = await response.json(); setOpened(result); bookShareEvent("shared_report_opened", model.productType, local);
    } catch { setError("책을 불러오지 못했습니다. 다시 펼쳐 주세요."); }
    finally { pending.current = false; setBusy(false); }
  }
  if (opened) return <Reader data={opened.data} share={opened.share} shared local={local} home={home} />;
  return <main className={s.entry}><header><a href={home}>결리포트</a></header><section>
    <h1>{model.displayTitle}</h1><button className={s.open} type="button" disabled={busy} data-opening={busy} aria-label={`${model.displayTitle} 펼치기`} onClick={() => void open()}>
      <span className={s.cover} style={{ background: model.coverColor, color: book.ink }}><span className={s.coverTop}><span>GYEOL<br />REPORT</span><span>ISSUE<br />{model.issueNumber}</span></span><span className={s.coverTitle}>{book.id === "annual" ? model.bookTitle.replace(" ", "\n") : book.title}</span><span className={s.coverName}>{model.displayName || "PERSONAL EDITION"}</span></span>
    </button><p className={s.hint}>책 펼치기 ↗</p>{busy ? <p role="status">책을 펼치고 있습니다.</p> : null}{error ? <p role="alert">{error}</p> : null}
  </section></main>;
}
