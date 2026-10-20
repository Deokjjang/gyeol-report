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
  const date = (v: string) => new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hourCycle: "h23" }).format(new Date(v));
  const eventActive = !unavailable && (state === "ACTIVE_ELIGIBLE" || state === "ACTIVE_INELIGIBLE" || (state === "BENEFIT_ALREADY_GRANTED" && current.active && remaining !== null && remaining > 0));
  return <main className={s.root} data-campaign-landing data-campaign-state={state}><header className={s.header}><a href={home}>결리포트<small>GYEOL REPORT</small></a><a href={local ? "/dev/account" : member ? "/account" : "/login"}>{member ? "내 서재" : "로그인"}</a></header>
    <article className={s.sheet}>{local ? <p className={s.note}>로컬 캠페인 검수 · 실제 고객 혜택 아님</p> : null}
      <p className={s.eyebrow}>A BOOK ABOUT YOU</p><h1>{current.headline}</h1>
      <p className={s.description}>{current.launchEvent && eligible ? "이벤트에 참여하고 처음 가입하면 리포트 1권 무료. 필수 동의를 마친 적격 신규 회원에게 이용권 1장을 드려요." : current.description}</p>
      <section className={s.offer} aria-label="캠페인 혜택"><p>{unavailable ? "이벤트 혜택을 확인하지 못했습니다. 책 선택과 유료 구매는 계속 이용할 수 있습니다." : eligible ? campaignOffer(current) : stateCopy[state]}</p>
        {eligible && current.offer !== "NONE" ? <small>이벤트 참여 기록과 신규 가입 자격을 확인해요. 광고·친구 초대 가입 혜택은 중복되지 않아요.</small> : null}
        {current.active && remaining !== null && remaining > 0 ? <p className={s.countdown} data-countdown><small>이벤트 종료까지</small><time dateTime={current.endsAt!}>{campaignCountdown(remaining)}</time></p> : null}
      </section>
      <button className={s.cta} disabled={busy} onClick={() => void begin()}>{eligible ? current.cta === "consent" ? "필수 동의 완료하기 →" : "이벤트 참여하고 가입하기 →" : "내 책 고르기 →"}</button>
      {state === "BENEFIT_ALREADY_GRANTED" ? <a className={s.secondary} href={local ? "/dev/account" : "/account"}>내 혜택 확인하기 ↗</a> : null}
      {current.launchEvent && eligible ? <p className={s.note}>가입과 필수 동의를 마친 뒤 내 서재에서 이용권을 확인해 주세요. 이용권으로 책을 고르고 정보를 입력해 발행할 수 있어요.</p> : null}
      <section className={s.books} aria-label="여섯 권의 책">{BOOKS.map(b => <div key={b.id}><span style={{ background: b.color, color: b.ink }}><small>GYEOL<br/>REPORT</small><strong>{b.title.replace("\n", " ")}</strong><small>ISSUE {b.issue}</small></span></div>)}</section>
      <p className={s.note}>나라는 사람부터 일, 사랑, 두 사람의 관계와 시간의 흐름까지.<br/>지금 궁금한 이야기를 골라보세요.</p>
      {current.launchEvent ? <section className={s.invite} aria-label="친구 초대 안내"><h2>내 책을 친구에게 공유해 보세요</h2><p>{eventActive ? "친구가 내 Book의 유효한 초대 링크로 처음 가입하고 필수 동의를 마친 뒤, 이벤트 기간 안에 첫 리포트까지 완성하면 나에게도 이용권 1장이 추가돼요." : "책 전체를 나누는 공유는 계속 이용할 수 있어요. 무료 이용권 혜택은 이벤트 참여 가능 상태에서만 적용돼요."}</p><p className={s.note}>일반 책 공유와 친구 초대 혜택은 달라요. 공유·클릭·친구 가입만으로 초대한 사람에게 이용권이 지급되지는 않아요.</p></section> : null}
      <details className={s.conditions}><summary>이벤트 참여 조건 자세히 보기</summary>
        {eligible || state === "BENEFIT_ALREADY_GRANTED" ? <p>{current.eligibility}</p> : null}
        {current.launchEvent ? <p>{LAUNCH_NOTICE}</p> : null}
        {current.startsAt ? <p>시작 · {date(current.startsAt)}</p> : null}{current.endsAt ? <p>종료 · {date(current.endsAt)}</p> : null}
        {(eligible || state === "BENEFIT_ALREADY_GRANTED") && current.coupon ? <p>쿠폰 사용기한 · {date(current.coupon.expiresAt)}<br/>최소 주문금액 {current.coupon.minOrder.toLocaleString("ko-KR")}원 · {current.coupon.products.length ? current.coupon.products.map(k => BOOKS.find(b => b.productKey === k)?.title.replace("\n", " ") ?? "").join(", ") : "6상품 적용"} · 이용권과 동시 사용 불가</p> : null}
      </details>
      {error ? <p role="alert">{error}</p> : null}
    </article></main>;
}
