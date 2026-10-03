"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { libraryDate, type LibraryItem } from "../../lib/library/model";
import s from "./library.module.css";

export function LibraryShelf({ items, local = false }: { items: LibraryItem[]; local?: boolean }) {
  return items.length ? <ul className={s.shelf} aria-label="내 책 목록">{items.map(item => {
    const contents = <><div className={s.cover} style={{ background: item.coverColor, color: item.ink }}><small>결리포트</small><strong>{item.title}</strong><span>{item.displayName}</span><small>PERSONAL EDITION</small></div>
      <div className={s.metadata}><b>{item.title}</b><span>{item.displayName}</span><span><time dateTime={item.publishedAt}>{libraryDate(item.publishedAt)}</time> 발행</span><span>{item.status === "available" ? <><time dateTime={item.expiresAt}>{libraryDate(item.expiresAt)}</time>까지 열람 가능</> : item.status === "expired" ? "열람기간이 끝난 책" : "현재 열람할 수 없는 책"}</span></div></>;
    return <li key={item.reportId} data-availability={item.status}>{item.accessURL ? <Link href={item.accessURL}>{contents}</Link> : <div aria-disabled="true">{contents}</div>}</li>;
  })}</ul> : <div className={s.empty}><p>아직 꽂힌 책이 없습니다.</p><Link href={local ? "/dev/book-flow" : "/"}>책 고르기 →</Link></div>;
}
export function Library({ local = false }: { local?: boolean }) {
  const [items, setItems] = useState<LibraryItem[] | null>(null), [error, setError] = useState(false);
  const endpoint = `${local ? "/dev/account/api" : "/auth"}/library-list`;
  useEffect(() => {
    let current: AbortController | null = null;
    const refresh = () => {
      current?.abort(); const abort = new AbortController(); current = abort;
      void fetch(endpoint, { cache: "no-store", signal: abort.signal }).then(async r => {
        const value = await r.json(); if (abort.signal.aborted) return;
        if (!r.ok || !Array.isArray(value.items)) { setItems(null); setError(true); } else { setItems(value.items); setError(false); }
      }).catch(() => { if (!abort.signal.aborted) { setItems(null); setError(true); } });
    };
    const invalidate = () => { setItems(null); refresh(); };
    const visible = () => { if (!document.hidden) invalidate(); };
    refresh(); window.addEventListener("focus", invalidate); document.addEventListener("visibilitychange", visible);
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("gyeol-account") : null;
    if (channel) channel.onmessage = invalidate;
    return () => { current?.abort(); window.removeEventListener("focus", invalidate); document.removeEventListener("visibilitychange", visible); channel?.close(); };
  }, [endpoint]);
  return error ? <p role="alert">서재를 확인하지 못했습니다. 새로고침해 주세요.</p> : items ? <LibraryShelf items={items} local={local} /> : <p role="status">책을 불러오는 중</p>;
}
