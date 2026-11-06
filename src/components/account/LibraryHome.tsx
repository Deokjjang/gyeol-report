"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cardResult, stillMaking, type ShelfBook } from "../../lib/library/shelf";
import { SUPPORT_CHAT_LABEL, SUPPORT_CHAT_URL } from "../../lib/legal/socialLinks";
import type { TicketWallet } from "../../lib/ops/gift/service";
import { OrderRequestForm } from "../ops/OrderParts";
import { GiftSheet } from "./GiftSheet";
import s from "./libraryHome.module.css";

export type LibraryHomeData = { ok: true; books: ShelfBook[]; wallet: TicketWallet | null; event: { during: boolean; endsAt: string | null } };
type Result = { status: number; data: LibraryHomeData | null };

// 서재 화면을 열자마자(로그인 상태 확인과 동시에) 한 번에 받는다. 같은 화면 안에서 10초 안의 결과는 다시 쓰고, 그 뒤는 새로 받는다.
let inflight: { at: number; promise: Promise<Result> } | null = null;
export function startLibraryHome(force = false): Promise<Result> {
  if (!force && inflight && Date.now() - inflight.at < 10_000) return inflight.promise;
  const promise = fetch("/auth/library-home", { cache: "no-store" })
    .then(async r => ({ status: r.status, data: r.ok ? await r.json() as LibraryHomeData : null }))
    .catch(() => ({ status: 0, data: null }));
  inflight = { at: Date.now(), promise };
  return promise;
}

const kst = (iso: string | null, withYear = true) => {
  const ms = Date.parse(iso ?? ""); if (!Number.isFinite(ms)) return "";
  const d = new Date(ms + 9 * 3_600_000);
  return withYear ? `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일` : `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
};

export function LibraryHome() {
  const [result, setResult] = useState<Result | null>(null), [gift, setGift] = useState(false);
  const alive = useRef(true);
  // 미리 받은 결과가 회원 아님(401)이면 — 같은 화면에서 동의·로그인을 마친 뒤 — 새로 받는다.
  const load = useCallback((force = false) => { void startLibraryHome(force).then(r => r.status === 401 && !force ? startLibraryHome(true) : r).then(r => { if (alive.current) setResult(r); }); }, []);
  useEffect(() => {
    alive.current = true; load();
    // 다른 탭에서 결제·선물·가입 정보가 바뀌면(BroadcastChannel) 또는 화면으로 돌아오면 다시 받는다.
    const refresh = () => { if (!document.hidden) load(true); };
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("gyeol-account") : null;
    if (channel) channel.onmessage = refresh;
    document.addEventListener("visibilitychange", refresh);
    return () => { alive.current = false; channel?.close(); document.removeEventListener("visibilitychange", refresh); };
  }, [load]);
  if (!result) return <LibrarySkeleton />;
  if (!result.data) return <p role="alert" className={s.error}>서재를 불러오지 못했어요. 새로고침해 주세요.</p>;
  const { books, wallet, event } = result.data;
  return <>
    <TicketLine wallet={wallet} eventDuring={event.during} eventEndsAt={event.endsAt} onGift={() => setGift(true)} />
    <section className={s.shelfSection} aria-labelledby="shelf-title">
      <h2 id="shelf-title" className={s.shelfTitle}>만든 리포트</h2>
      {books.length ? <ul className={s.shelf} aria-label="내 책 목록">{books.map(b => <ShelfCard key={b.reportId} book={b} onChanged={() => load(true)} />)}</ul>
        : <div className={s.empty} data-library-empty><p>아직 만든 리포트가 없어요.</p><Link href="/">책 고르기 →</Link></div>}
    </section>
    {gift && wallet ? <GiftSheet wallet={wallet} onClose={() => setGift(false)} onChanged={() => load(true)} /> : null}
  </>;
}

function TicketLine({ wallet, eventDuring, eventEndsAt, onGift }: { wallet: TicketWallet | null; eventDuring: boolean; eventEndsAt: string | null; onGift: () => void }) {
  const total = wallet?.total ?? 0, until = kst(wallet?.expiresAt ?? null, false);
  return <div className={s.ticketWrap}>
    <div className={s.ticket} data-ticket-summary aria-live="polite">
      <p><b>리포트 이용권 {wallet ? `${total}장` : "확인하지 못했어요"}</b>{total > 0 && until ? <span className={s.until}> · {until}까지</span> : null}</p>
      {wallet && wallet.giftable > 0 ? <button type="button" onClick={onGift}>이용권 선물하기</button> : null}
    </div>
    {total > 0 && eventDuring ? <p className={s.ticketNote}>이벤트 기간({kst(eventEndsAt, false)}까지) 결제 1건마다 1장씩 드려요. 결제할 때 바로 쓰거나 친구에게 선물할 수 있어요.</p> : null}
  </div>;
}

function ShelfCard({ book, onChanged }: { book: ShelfBook; onChanged: () => void }) {
  const [ask, setAsk] = useState(false);
  const cover = <div className={s.cover} style={{ background: book.coverColor, color: book.ink }}><small>결리포트</small><strong>{book.title}</strong><span>{book.displayName}</span><small>PERSONAL EDITION</small></div>;
  const when = book.state === "making" ? "만드는 중" : book.state === "attention" ? "확인이 필요해요" : book.state === "refunded" ? "환불된 주문"
    : `${kst(book.publishedAt)} 발행 · ${book.openEnded ? "언제든 다시 읽을 수 있어요" : `${kst(book.expiresAt)}까지 열람`}`;
  const label = `${book.title.replace("\n", " ")}${book.displayName ? ` ${book.displayName}` : ""} ${book.state === "ready" ? "열기" : when}`;
  const body = <>{cover}<span className={s.meta}><b>{book.title.replace("\n", " ")}</b>{book.displayName ? <span>{book.displayName}</span> : null}<span data-state={book.state}>{when}</span></span></>;
  // 운영 Q 2부: 처리 결과 한 줄(7일). 열린 요청이 있으면 버튼이 「접수됨」. 환불된 주문은 문의 버튼 없이 결과만(7일 뒤 서재에서 사라진다).
  const result = cardResult(book), open = book.request?.status === "open";
  return <li data-state={book.state}>
    {book.href ? <Link href={book.href} className={s.card} aria-label={label}>{body}</Link> : <div className={s.card} aria-label={label}>{body}</div>}
    <div className={s.small}>
      {book.orderCode ? <span>주문코드 {book.orderCode}</span> : book.viaTicket ? <span>이용권으로 만든 책</span> : null}
      {book.state === "refunded" ? null : open ? <button type="button" className={s.textLink} disabled aria-disabled="true" data-request-submitted>접수됨</button>
        : !ask ? <button type="button" className={s.textLink} onClick={() => setAsk(true)}>문의·환불 요청</button> : null}
    </div>
    {result ? <p className={s.result} data-card-result={result.kind}>{result.text}{result.channel ? <a href={SUPPORT_CHAT_URL} target="_blank" rel="noopener noreferrer">{SUPPORT_CHAT_LABEL} ↗</a> : null}</p> : null}
    {ask && !open && book.state !== "refunded" ? <OrderRequestForm orderCode={book.orderCode ?? undefined} reportId={book.orderCode ? undefined : book.reportId} ticketBook={!book.orderCode}
      making={stillMaking(book)} startOpen onClose={() => setAsk(false)} onSubmitted={onChanged} /> : null}
  </li>;
}

export function LibrarySkeleton() {
  return <div aria-busy="true" aria-label="서재를 불러오는 중">
    <div className={`${s.ticket} ${s.bone}`} aria-hidden="true"><p>&nbsp;</p></div>
    <h2 className={s.shelfTitle}>만든 리포트</h2>
    <ul className={s.shelf} aria-hidden="true">{[0, 1, 2].map(i => <li key={i}><div className={`${s.cover} ${s.bone}`} /><span className={`${s.boneLine}`} /></li>)}</ul>
    <p role="status" className={s.srOnly}>책을 불러오는 중</p>
  </div>;
}
