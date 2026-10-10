"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BOOKS } from "../../lib/book/product";
import { bundleEditions, bundlePendingKey, bundleReturnKey, bundleStatusText, BUNDLE_PURCHASE_FIELDS, receiptMethodKey, ticketEventLabel } from "../../lib/tickets/shopContract";
import { captureBundleCallback, launchBundleCheckout, readBookReturn, readPendingBundle, safeBundleOrder, validBundleOrderId, type BundleCheckout, type PendingBundle } from "../../lib/tickets/shopClient";
import type { BundleOrder } from "../../lib/tickets/bundleTypes";
import type { TicketBundleId } from "../../lib/tickets/bundleCatalog";
import { announceAccountChange } from "./AccountSession";
import { checkoutReturnKey } from "../book/useTicketPublication";
import s from "./ticketShop.module.css";

type Balance = { scope: string; quantity: number };
type LedgerEntry = { event: string; quantity: number; at: string; reason: string };
const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const date = (v: string) => Number.isFinite(Date.parse(v)) ? new Date(v).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }) : "날짜 확인 중";

export function TicketShop({ local = false, callback = false, policyVersion = null }: { local?: boolean; callback?: boolean; policyVersion?: string | null }) {
  const base = local ? "/dev/account/tickets/api" : "/api/ticket-bundles", home = local ? "/dev/book-flow" : "/", path = local ? "/dev/account/tickets" : "/account/tickets";
  const login = local ? "/dev/account?next=%2Fdev%2Faccount%2Ftickets" : "/login?next=%2Faccount%2Ftickets";
  const [balance, setBalance] = useState<Balance | null>(null), [state, setState] = useState<"loading" | "ready" | "error" | "login">("loading");
  const [selection, setSelection] = useState<TicketBundleId | null>(null), [consent, setConsent] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<PendingBundle | null>(null), [order, setOrder] = useState<BundleOrder | null>(null), [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false), [history, setHistory] = useState<BundleOrder[] | null>(null), [ledger, setLedger] = useState<LedgerEntry[] | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false), [historyError, setHistoryError] = useState(false), [returnProduct, setReturnProduct] = useState<string | null>(null);
  const current = useRef<AbortController | null>(null), scope = useRef(""), lock = useRef(false), initialized = useRef(false), callbackStarted = useRef(false), recoveryId = useRef<string | null>(null);
  const editions = bundleEditions(), selected = editions.find(b => b.id === selection);
  const request = useCallback(async (action: string, body?: object, account = scope.current, signal?: AbortSignal) => {
    const r = await fetch(`${base}/${action}`, { method: body ? "POST" : "GET", cache: "no-store", signal: signal ?? AbortSignal.timeout(25_000), headers: { ...(body ? { "content-type": "application/json" } : {}), ...(account ? { "x-ticket-account": account } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const data = await r.json();
    if (r.status === 401 || data.code === "ACCOUNT_CHANGED") {
      current.current?.abort(); scope.current = ""; setBalance(null); setHistory(null); setLedger(null); setOrder(null); setReturnProduct(null); setConsent({}); setState(r.status === 401 ? "login" : "error");
    }
    return { r, data };
  }, [base]);
  const refresh = useCallback(async () => {
    current.current?.abort(); const controller = new AbortController(); current.current = controller;
    // Hide old-account data while revalidating, including same display-name users.
    setBalance(null); setHistory(null); setLedger(null); setReturnProduct(null); setHistoryOpen(false); setState("loading");
    try {
      const { r, data } = await request("state", undefined, "", controller.signal);
      if (controller.signal.aborted) return;
      if (!r.ok || !/^[a-f0-9]{64}$/.test(data.scope) || !Number.isInteger(data.quantity) || data.quantity < 0) { setState(r.status === 401 ? "login" : "error"); return; }
      if (scope.current && scope.current !== data.scope) { setConsent({}); setSelection(null); setOrder(null); }
      scope.current = data.scope; setBalance({ scope: data.scope, quantity: data.quantity }); setState("ready");
      const saved = readPendingBundle(sessionStorage);
      if (saved && saved.scope !== data.scope) {
        sessionStorage.removeItem(bundlePendingKey); sessionStorage.removeItem(bundleReturnKey); setPending(null);
        setMessage("계정이 변경되었습니다. 이전 구매는 원래 계정의 구매 내역에서 확인해 주세요.");
      } else setPending(saved);
      setReturnProduct(readBookReturn(sessionStorage, data.scope));
    } catch { if (!controller.signal.aborted) setState("error"); }
  }, [request]);
  useEffect(() => {
    let storageFailed = false;
    if (!initialized.current) {
      initialized.current = true;
      const url = new URL(window.location.href);
      recoveryId.current = validBundleOrderId(url.searchParams.get("orderId")) ? url.searchParams.get("orderId") : null;
      try {
        const captured = captureBundleCallback(url, readPendingBundle(sessionStorage));
        if (captured) sessionStorage.setItem(bundlePendingKey, JSON.stringify(captured));
      } catch { storageFailed = true; }
      // Keep only an opaque order ID, never paymentKey/code/provider message.
      if (callback) window.history.replaceState(window.history.state, "", `${window.location.pathname}${recoveryId.current ? `?orderId=${recoveryId.current}` : ""}`);
    }
    const start = setTimeout(() => { if (storageFailed) setMessage("브라우저 저장을 사용할 수 없습니다. 원래 계정의 구매 내역에서 결제 상태를 확인해 주세요."); void refresh(); }, 0);
    const update = () => { if (!document.hidden && !lock.current) void refresh(); };
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("gyeol-account");
    if (channel) channel.onmessage = update;
    window.addEventListener("focus", update); document.addEventListener("visibilitychange", update);
    const timer = setInterval(update, 60_000);
    return () => { clearTimeout(start); current.current?.abort(); channel?.close(); clearInterval(timer); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); };
  }, [callback, refresh]);

  async function recover(id?: string) {
    if (lock.current || !balance) return;
    const p = readPendingBundle(sessionStorage), owner = balance.scope;
    const target = id ?? p?.orderId ?? recoveryId.current;
    if (!target) { setMessage("구매 내역에서 기존 주문을 선택해 주세요. 새 결제를 요청하지 않습니다."); return; }
    lock.current = true; setBusy(true); setMessage("결제 상태를 확인하고 있습니다.");
    try {
      const payment = p?.scope === owner && p.orderId === target ? p.payment : undefined;
      const { data } = await request(payment ? "confirm" : "recover", payment ?? { orderId: target }, owner);
      if (scope.current !== owner) return;
      if (safeBundleOrder(data.order)) {
        const confirmed: BundleOrder = data.order;
        setOrder(confirmed); setMessage(data.code === "UNKNOWN_PAYMENT_STATE"
          ? "결제 여부를 아직 확인할 수 없습니다. 새로 결제하지 말고 같은 주문을 다시 확인해 주세요. 계속 확인되지 않으면 고객 문의를 이용해 주세요."
          : bundleStatusText[confirmed.status]);
        if (p?.orderId === confirmed.orderId && ["GRANTED", "FAILED", "REFUNDED"].includes(confirmed.status)) { sessionStorage.removeItem(bundlePendingKey); setPending(null); setSelection(null); setConsent({}); }
        if (data.order.status === "GRANTED") {
          const fresh = await request("state", undefined, owner);
          if (scope.current === owner && fresh.r.ok && fresh.data.scope === owner) setBalance({ scope: owner, quantity: fresh.data.quantity });
          announceAccountChange();
        }
      } else setMessage("결제 상태를 확인하지 못했습니다. 같은 주문을 다시 확인해 주세요. 새 결제는 하지 마세요.");
    } catch { setMessage("결제 확인이 지연되고 있습니다. 같은 주문으로 다시 확인해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  useEffect(() => {
    const timer = setTimeout(() => { if (callback && state === "ready" && !callbackStarted.current && (pending?.orderId || recoveryId.current)) { callbackStarted.current = true; void recover(); } }, 0);
    return () => clearTimeout(timer);
    // One automatic confirmation per mounted callback. Subsequent attempts explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, state, pending?.orderId]);

  async function purchase() {
    if (lock.current || !balance || !selection || !policyVersion || !BUNDLE_PURCHASE_FIELDS.every(k => consent[k])) return;
    lock.current = true; setBusy(true); setMessage("결제 준비 중");
    const owner = balance.scope;
    try {
      let p = readPendingBundle(sessionStorage);
      if (p && (p.scope !== owner || p.bundleId !== selection || p.launched)) { setMessage("기존 주문을 먼저 확인해 주세요."); return; }
      p ??= { requestId: crypto.randomUUID(), scope: owner, bundleId: selection };
      // Durable before prepare. Storage failure must not create an order.
      sessionStorage.setItem(bundlePendingKey, JSON.stringify(p)); setPending(p);
      const { r, data } = await request("prepare", { bundleId: selection, requestId: p.requestId, consent: { version: policyVersion, ...consent } }, owner);
      if (scope.current !== owner) return;
      if (!r.ok || !safeBundleOrder(data.order)) { setMessage("구매 준비를 완료하지 못했습니다. 같은 요청으로 다시 확인해 주세요."); return; }
      const o: BundleOrder = data.order;
      p = { ...p, orderId: o.orderId, providerOrderId: o.providerOrderId };
      sessionStorage.setItem(bundlePendingKey, JSON.stringify(p)); setPending(p); setOrder(o);
      if (o.status !== "READY") { setMessage(bundleStatusText[o.status]); return; }
      const checkout = data.tossCheckoutRequest as BundleCheckout | undefined;
      if (!checkout || checkout.customerKey !== `member_${owner}` || checkout.metadata.bundleOrderId !== o.orderId || checkout.requestPayment.orderId !== o.providerOrderId || checkout.requestPayment.amount.value !== o.amount) { setMessage("기존 주문의 결제 정보를 확인해 주세요."); return; }
      // Recheck the verified session immediately before opening PG.
      const check = await request("state", undefined, owner);
      if (!check.r.ok || check.data.scope !== owner || scope.current !== owner) return;
      p = { ...p, launched: true }; sessionStorage.setItem(bundlePendingKey, JSON.stringify(p)); setPending(p); setMessage(local ? "모의 결제창으로 이동 중" : "결제창으로 이동 중");
      if (local) window.location.assign(`${path}/mock?orderId=${o.orderId}`);
      else if (await launchBundleCheckout(checkout) === "not-started") {
        // requestPayment was never invoked. Retry this same prepared order only.
        if (scope.current !== owner) return;
        p = { ...p, launched: false }; sessionStorage.setItem(bundlePendingKey, JSON.stringify(p)); setPending(p);
        setMessage("결제창을 불러오지 못했습니다. 같은 주문으로 다시 시도해 주세요.");
      }
    } catch { setMessage("결제창 상태를 확인하지 못했습니다. 기존 주문을 확인해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  async function loadHistory() {
    if (!balance || busy) return;
    setHistoryOpen(true); setHistoryError(false); const owner = balance.scope;
    try {
      const [purchases, usage] = await Promise.all([request("history", undefined, owner), fetch(`${local ? "/dev/account/api" : "/auth"}/ticket-history`, { cache: "no-store", signal: AbortSignal.timeout(20_000) }).then(async r => ({ r, data: await r.json() }))]);
      // Revalidate after both owner-filtered reads to discard account switches.
      const check = await request("state", undefined, owner);
      if (scope.current !== owner || !check.r.ok) return;
      if (!purchases.r.ok || !usage.r.ok || !Array.isArray(purchases.data.orders) || !Array.isArray(usage.data.history)) { setHistoryError(true); return; }
      setHistory(purchases.data.orders.filter(safeBundleOrder)); setLedger(usage.data.history);
    } catch { setHistoryError(true); }
  }
  function returnToBook() {
    if (!returnProduct || order?.status !== "GRANTED") return;
    try {
      if (!sessionStorage.getItem(`gyeol-book-input-v1:${returnProduct}`)) { setMessage("이 브라우저에 입력한 내용이 없습니다. 이용권은 계정에 그대로 있으니 책을 골라 다시 입력해 주세요."); return; }
      sessionStorage.setItem(checkoutReturnKey(returnProduct), "1"); sessionStorage.removeItem(receiptMethodKey(returnProduct));
      window.location.assign(`${local ? "/dev/book-flow/input" : "/report/new"}?product=${returnProduct}`);
    } catch { setMessage("입력 내용을 복구하지 못했습니다. 구매한 이용권은 계정에 유지됩니다."); }
  }
  const blocked = busy || state !== "ready" || !selected || !policyVersion || !BUNDLE_PURCHASE_FIELDS.every(k => consent[k]) || !!pending?.launched;
  return <main className={s.root}><header className={s.header}><Link href={home}>결리포트</Link><Link href={local ? "/dev/account" : "/account"}>내 서재</Link></header>
    <div className={s.sheet}><nav className={s.nav} aria-label="내 계정"><Link href={local ? "/dev/account" : "/account"}>내 서재</Link><Link href={path} aria-current="page">내 이용권</Link></nav>
      <p className={s.eyebrow}>GYEOL REPORT / MEMBER EDITIONS</p><h1>{callback && order?.status === "GRANTED" ? "이용권이 준비되었습니다" : "나의 다음 이야기를 위한 이용권"}</h1>
      <p>여섯 권의 리포트 중 원하는 책을 이용권 한 장으로 발행할 수 있습니다.</p>
      <div className={s.spines} aria-hidden="true">{BOOKS.map(book => <i key={book.id} style={{ background: book.color }} />)}</div>
      {local ? <p className={s.note}>로컬 모의 구매 · 실제 과금 없음 · 아래 동의는 검수용이며 판매 정책 승인이 아닙니다.</p> : null}
      <section className={s.balance} aria-live="polite"><h2>사용 가능한 이용권</h2>{state === "ready" && balance ? <p><strong>{String(balance.quantity).padStart(2, "0")}</strong> 장</p> : <p>{state === "loading" ? "이용권 조회 중" : state === "login" ? "로그인과 필수 회원 동의를 확인해 주세요." : "이용권을 확인하지 못했습니다."}</p>}
        {state === "login" ? <Link href={login}>로그인하고 이어서 확인하기 →</Link> : state === "error" ? <button onClick={() => void refresh()}>다시 확인</button> : null}
      </section>
      {state === "ready" ? <>
        {callback || pending || order ? <section className={s.recovery}><h2>{order?.status === "GRANTED" ? `구매한 이용권 ${order.quantity}장` : "기존 구매 확인"}</h2><p>{order ? bundleStatusText[order.status] : "결제 결과를 확인하기 전에는 새로 결제하지 마세요."}</p>
          {order?.status === "GRANTED" ? <>{returnProduct ? <button className={s.primary} onClick={returnToBook}>계속해서 책 발행하기 →</button> : <Link className={s.primary} href={path}>내 이용권으로 돌아가기 →</Link>}<Link href={home}>책 고르기 →</Link></> : <button disabled={busy} onClick={() => void recover()}>같은 주문 다시 확인</button>}
        </section> : null}
        {!callback ? <div className={s.purchase}><fieldset className={s.editions} disabled={busy || !!pending?.launched}><legend>이용권 선택</legend>{editions.map(b => <label key={b.id} className={s.edition} data-selected={selection === b.id}><input type="radio" name="edition" value={b.id} checked={selection === b.id} onChange={() => { if (!pending || pending.bundleId === b.id) { setSelection(b.id); setConsent({}); } else setMessage("준비 중인 주문을 먼저 확인해 주세요."); }} /><span><strong>{String(b.quantity).padStart(2, "0")}</strong><small>{b.quantity === 1 ? "EDITION" : "EDITIONS"}</small></span><span><b>{won(b.amount)}</b><small>권당 {won(b.unit)}</small><small>{b.saving ? `${won(b.saving)} 절약` : "리포트 1권"}</small></span></label>)}</fieldset>
          <section className={s.summary}><h2>주문 요약</h2>{selected ? <dl><dt>선택한 이용권</dt><dd>{selected.quantity}장</dd><dt>정가</dt><dd>{won(selected.regular)}</dd><dt>할인</dt><dd>−{won(selected.saving)}</dd><dt>최종 결제</dt><dd><strong>{won(selected.amount)}</strong></dd></dl> : <p>구매할 이용권 수량을 선택해 주세요.</p>}
            <p className={s.note}>6상품 공통 · 리포트 발행 시 1장 차감<br />발행한 리포트는 생성일로부터 90일 동안 열람할 수 있습니다. 이용권 사용 유효기간과는 다릅니다.</p>
            <details><summary>구매·환불 안내</summary><p>디지털 이용권은 결제 승인과 지급 확인 후 계정에 제공됩니다.</p><p>이용권 유효기간, 미사용·부분 사용 환불 및 할인 공제 기준은 승인 대기 중입니다. 실제 판매는 열리지 않습니다.</p></details>
            {BUNDLE_PURCHASE_FIELDS.map((key, i) => <label className={s.consent} key={key}><input type="checkbox" checked={!!consent[key]} disabled={busy || !selected || !policyVersion} onChange={e => setConsent(c => ({ ...c, [key]: e.target.checked }))} />[필수] {["선택한 상품·수량·가격 확인", "디지털 이용권 제공 방식 확인", local ? "모의 구매·환불 안내 확인" : "구매·환불 안내 동의"][i]}</label>)}
            {!policyVersion ? <p className={s.note}>구매 정책 승인 전에는 결제할 수 없습니다.</p> : !BUNDLE_PURCHASE_FIELDS.every(k => consent[k]) ? <p className={s.note}>상품 선택과 필수 확인 후 진행할 수 있습니다.</p> : null}
            <button className={s.primary} disabled={blocked} onClick={() => void purchase()}>{busy ? "구매 상태 확인 중" : selected ? `이용권 ${selected.quantity}장 구매하기` : "이용권을 선택해 주세요"} →</button>
          </section></div> : null}
        <section className={s.history}><button aria-expanded={historyOpen} onClick={() => historyOpen ? setHistoryOpen(false) : void loadHistory()}>구매·사용 내역 {historyOpen ? "−" : "+"}</button>{historyOpen ? <>{historyError ? <p role="alert">내역을 확인하지 못했습니다. <button onClick={() => void loadHistory()}>다시 확인</button></p> : history === null || ledger === null ? <p>내역 조회 중</p> : <><h2>유료 구매 내역</h2>{!history.length ? <p>구매 내역이 없습니다.</p> : <ul>{history.map(o => <li key={o.orderId}><span>{date(o.requestedAt)} · 이용권 {o.quantity}장</span><b>{won(o.amount)}</b><span>{bundleStatusText[o.status]}</span><button disabled={busy} onClick={() => void recover(o.orderId)}>상태 확인</button></li>)}</ul>}<h2>이용권 사용·지급 내역</h2>{!ledger.length ? <p>사용·지급 내역이 없습니다.</p> : <ul>{ledger.map((e, i) => <li key={i}><span>{date(e.at)} · {ticketEventLabel(e.event, e.reason)}</span><b>{e.quantity > 0 ? "+" : ""}{e.quantity}장</b></li>)}</ul>}</>}</> : null}</section>
      </> : null}
      <p role="status" aria-live="polite" className={s.message}>{message}</p>
    </div></main>;
}
