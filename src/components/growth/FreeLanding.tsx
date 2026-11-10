"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { eventEndDayLabel, type GiftEventPublicView, type SignupPublicView } from "../../lib/ops/config";
import { KAKAO_CHANNEL_URL, SOCIAL_LINKS } from "../../lib/legal/socialLinks";
import { AccountEntry, useAccountSession } from "../account/AccountSession";
import { FREE_COPY } from "../../lib/growth/model";
import type { FreeExample } from "../../lib/book/example";
import s from "./freeLanding.module.css";

/** 회원이면 가입 이용권이 남았는지(/auth/event-popup, 읽기 전용). */
function useMySignupTicket(member: boolean) {
  const [mine, setMine] = useState<{ status: string; expiresAt: string } | null>(null);
  useEffect(() => {
    if (!member) return;
    let live = true;
    void fetch("/auth/event-popup", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(b => {
      const m = b?.signup?.mine;
      if (live && m && typeof m.status === "string" && typeof m.expiresAt === "string") setMine(m);
    }).catch(() => undefined);
    return () => { live = false; };
  }, [member]);
  return mine;
}
const md = (iso: string) => { const d = new Date(Date.parse(iso) + 9 * 3_600_000); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`; };

export function FreeLanding({ signup, event, examples }: { signup: SignupPublicView; event: GiftEventPublicView; examples: FreeExample[] }) {
  const { session, loaded } = useAccountSession(false);
  const member = loaded && session.status === "member";
  const mine = useMySignupTicket(member);
  const eventOn = event.phase === "during" && Date.parse(event.endsAt) > Date.parse(event.serverNow);
  const until = eventEndDayLabel(event.endsAt);
  // 서버가 기한 지난 장을 expired로 바꿔 준다(signupState). 화면은 서버 시각으로 한 번 더 본다.
  const ticket = mine && mine.status === "available" && Date.parse(mine.expiresAt) > Date.parse(event.serverNow) ? mine : null;
  return <main className={s.root} data-free-landing={signup.active ? "on" : "off"}>
    <header className={s.header}><Link href="/" className={s.wordmark}><b>결리포트</b><span>GYEOL REPORT</span></Link><AccountEntry /></header>
    <section className={s.hero}>
      <p className={s.eyebrow}>SAJU × MBTI · ONE BOOK</p>
      <h1 className={s.question}>{FREE_COPY.question}</h1>
      <p className={s.lead}>{FREE_COPY.lead}</p>
    </section>
    <section className={s.examples} aria-label={FREE_COPY.examplesTitle}>
      <p className={s.sectionLabel}>{FREE_COPY.examplesTitle}</p>
      {examples.map((e, i) => <article key={i} className={s.page} style={{ animationDelay: `${120 + i * 90}ms` }} data-free-example>
        <p className={s.pageMeta}><span>예시 · 가상의 인물 서하은</span><span>{e.chapter}</span></p>
        {e.heading ? <h2 className={s.pageHeading}>{e.heading}</h2> : null}
        <p className={s.pageText}>{e.text}</p>
      </article>)}
      <Link className={s.more} href="/example">예시 리포트 앞 2장 펼쳐 보기 →</Link>
    </section>
    <section className={s.offer} aria-live="polite">
      {member ? ticket ? <>
        <p className={s.benefit} data-free-state="ticket">{FREE_COPY.ticketTitle}</p>
        <p className={s.benefitNote}>{md(ticket.expiresAt)}까지 쓸 수 있어요</p>
        <Link className={s.cta} href="/">{FREE_COPY.ticketCta}</Link>
      </> : <>
        <p className={s.benefit} data-free-state="member">{FREE_COPY.memberTitle}</p>
        <p className={s.benefitNote}>{FREE_COPY.memberBody}</p>
        <Link className={s.cta} href="/account">{FREE_COPY.memberCta}</Link>
      </> : signup.active ? <>
        <p className={s.benefit} data-free-state="guest">{FREE_COPY.benefit}</p>
        <p className={s.benefitNote}>{FREE_COPY.benefitNote(signup.days)}</p>
        <Link className={s.cta} href={loaded && session.status === "needs_consent" ? "/account" : "/login?next=/free"} data-free-cta>{FREE_COPY.cta}</Link>
      </> : <>
        <p className={s.benefit} data-free-state="general">나를 한 권의 책으로 만나 보세요</p>
        <Link className={s.cta} href="/" data-free-cta-general>{FREE_COPY.generalCta}</Link>
      </>}
      {eventOn ? <p className={s.eventLine} data-free-event-line>{FREE_COPY.eventLine(until)}</p> : null}
    </section>
    <section className={s.follow}>
      <p>{FREE_COPY.follow}</p>
      <ul>
        <li><a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">카카오톡 채널</a></li>
        <li><a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">인스타그램 @gyeolreport</a></li>
        <li><a href={SOCIAL_LINKS.threads} target="_blank" rel="noopener noreferrer">스레드 @gyeolreport</a></li>
        <li><a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer">X @gyeolreport</a></li>
      </ul>
    </section>
  </main>;
}
