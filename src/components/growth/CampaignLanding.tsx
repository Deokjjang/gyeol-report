"use client";
import { useEffect, useRef, useState } from "react";
import { BOOKS } from "../../lib/book/product";
import { campaignOffer, campaignRemaining, campaignCountdown, type CampaignView, type CampaignState } from "../../lib/growth/model";
import { interaction } from "../../lib/analytics/client";
import { LAUNCH_NOTICE } from "../../lib/growth/launchEvent";
import s from "./campaign.module.css";

const stateCopy: Record<CampaignState, string> = {
  SCHEDULED: "아직 시작 전입니다. 먼저 나에게 궁금한 책을 골라보세요.",
  ACTIVE_ELIGIBLE: "",
  ACTIVE_INELIGIBLE: "책을 고르고 나의 이야기를 이어가세요. 신규가입 혜택은 기존 회원에게 지급되지 않습니다.",
  BENEFIT_ALREADY_GRANTED: "이미 받은 혜택으로 나의 이야기를 이어가세요. 다시 가입하거나 혜택을 받을 필요는 없습니다.",
  PAUSED: "지금은 혜택 참여가 잠시 멈춰 있습니다. 책은 평소처럼 만들 수 있어요.",
  ENDED: "이 캠페인의 신규 혜택은 종료되었습니다. 나의 책은 계속 만들 수 있어요.",
};
export function CampaignLanding({ campaign, utm, member = false, local = false }: { campaign: CampaignView; utm: Record<string,string>; member?: boolean; local?: boolean }) {
  const home = local ? "/dev/book-flow" : "/", busyRef = useRef(false);
  const [current, setCurrent] = useState(campaign), [remaining, setRemaining] = useState(campaignRemaining(campaign, 0));
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    interaction("campaign_landing_opened", undefined, campaign.slug);
    let cancelled = false, inFlight = false, anchor = performance.now(), snapshot = campaign;
    const abort = new AbortController();
    const refresh = async () => {
      if (document.hidden || inFlight) return;
      inFlight = true;
      const requested = performance.now();
      try {
        const r = await fetch(`${local ? "/dev" : ""}/campaign/${campaign.slug}/state`, { cache: "no-store", signal: abort.signal });
        if (r.ok && !cancelled) {
          const c = await r.json() as CampaignView;
          snapshot = c; anchor = requested; // Conservative RTT: never extend by network latency.
          setUnavailable(false);
          setCurrent(c); setRemaining(campaignRemaining(c, performance.now() - anchor));
        } else if (!cancelled) setUnavailable(true);
      } catch { if (!cancelled) setUnavailable(true); }
      finally { inFlight = false; }
    };
    const tick = () => setRemaining(campaignRemaining(snapshot, performance.now() - anchor));
    const visible = () => { if (!document.hidden) void refresh(); };
    void refresh();
    const clock = setInterval(tick, 1000), poll = setInterval(() => void refresh(), 20_000);
    window.addEventListener("focus", visible); document.addEventListener("visibilitychange", visible);
    return () => { cancelled = true; abort.abort(); clearInterval(clock); clearInterval(poll); window.removeEventListener("focus", visible); document.removeEventListener("visibilitychange", visible); };
  }, [campaign, local]);
  const state = remaining === 0 && current.state !== "BENEFIT_ALREADY_GRANTED" ? "ENDED" : current.state;
  const eligible = !unavailable && state === "ACTIVE_ELIGIBLE";
  async function begin() {
    if (busyRef.current) return;
    interaction("campaign_cta_clicked", undefined, current.slug);
    if (!eligible) { window.location.assign(home); return; }
    if (current.cta === "consent") { window.location.assign(local ? "/dev/account" : "/account"); return; }
    busyRef.current = true; setBusy(true); setError("");
    try {
      const r = await fetch(local ? "/dev/campaign/entry" : "/api/campaign-entry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: current.slug, utm }) });
      if (!r.ok) { setError("참여 상태를 확인하지 못했습니다. 다시 시도해 주세요."); return; }
      const result = await r.json();
      if (result.unavailable) { setCurrent(c => ({ ...c, active: false, state: "ENDED" })); return; }
      const login = local ? "/dev/account?view=login" : "/login";
      window.location.assign([login, home].includes(result.next) ? result.next : home);
    } catch { setError("연결을 확인한 뒤 다시 시도해 주세요."); }
    finally { busyRef.current = false; setBusy(false); }
  }
  const date = (v: string) => new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(v));
  return <main className={s.root} data-campaign-landing data-campaign-state={state}><header className={s.header}><a href={home}>결리포트<small>GYEOL REPORT</small></a><a href={local ? "/dev/account" : member ? "/account" : "/login"}>{member ? "내 서재" : "로그인"}</a></header>
    <article className={s.sheet}>{local ? <p className={s.note}>로컬 캠페인 검수 · 실제 고객 혜택 아님</p> : null}
      <p className={s.eyebrow}>A BOOK ABOUT YOU</p><h1>{current.headline}</h1><p className={s.description}>{current.description}</p>
      <section className={s.books} aria-label="여섯 권의 책">{BOOKS.map(b => <div key={b.id}><span style={{ background: b.color, color: b.ink }}><small>GYEOL<br/>REPORT</small><strong>{b.title.replace("\n", " ")}</strong><small>ISSUE {b.issue}</small></span></div>)}</section>
      <p className={s.note}>나라는 사람부터 일, 사랑, 두 사람의 관계와 시간의 흐름까지.<br/>지금 궁금한 이야기를 골라보세요.</p>
      <section className={s.offer} aria-label="캠페인 혜택"><p>{unavailable ? "이벤트 혜택을 확인하지 못했습니다. 책 선택과 유료 구매는 계속 이용할 수 있습니다." : eligible ? campaignOffer(current) : stateCopy[state]}</p>
        {current.launchEvent ? <small>{LAUNCH_NOTICE}</small> : null}
        {eligible && current.offer !== "NONE" ? <small>신규 계정에 한해 지급됩니다. 친구 초대·다른 캠페인의 신규가입 혜택과 중복되지 않습니다.</small> : null}
        {eligible || state === "BENEFIT_ALREADY_GRANTED" ? <small>{current.eligibility}</small> : null}
        {current.startsAt ? <small>시작 · {date(current.startsAt)} KST</small> : null}{current.endsAt ? <small>종료 · {date(current.endsAt)} KST</small> : null}
        {current.active && remaining !== null && remaining > 0 ? <p className={s.countdown} data-countdown><small>종료까지</small><time dateTime={current.endsAt!}>{campaignCountdown(remaining)}</time></p> : null}
        {(eligible || state === "BENEFIT_ALREADY_GRANTED") && current.coupon ? <small>쿠폰 사용기한 · {date(current.coupon.expiresAt)} KST<br/>최소 주문금액 {current.coupon.minOrder.toLocaleString("ko-KR")}원 · {current.coupon.products.length ? current.coupon.products.map(k => BOOKS.find(b => b.productKey === k)?.title.replace("\n", " ") ?? "").join(", ") : "6상품 적용"} · 이용권과 동시 사용 불가</small> : null}
      </section>
      <button className={s.cta} disabled={busy} onClick={() => void begin()}>내 책 만들기 →</button>
      {state === "BENEFIT_ALREADY_GRANTED" ? <a className={s.secondary} href={local ? "/dev/account" : "/account"}>내 혜택 확인하기 ↗</a> : null}
      {error ? <p role="alert">{error}</p> : null}
    </article></main>;
}
