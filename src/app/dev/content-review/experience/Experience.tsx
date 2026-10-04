"use client";
import { useState } from "react";
import s from "../review.module.css";
const links = [
  ["로그인 → 가입 동의 → 내 서재 → 로그아웃", "/dev/account", "카카오/Google 버튼은 로컬 모의 계정입니다. 실제 소셜 인증은 하지 않습니다."],
  ["책장 → 상품 선택 → 입력 → 영수증 → 모의 구매 → 책", "/dev/book-flow", "비회원/회원 구매, 약관 상세, 책 읽기와 공유 화면을 기존 개발 UI 그대로 확인합니다."],
  ["서재 다양한 상태", "/dev/account/library-preview", "6상품·긴 이름·만료 표시를 확인하는 기존 시각 fixture입니다."],
  ["로그인 오류 화면", "/dev/account?error=review", "오류 안내와 비회원 계속하기 확인."],
  ["이용약관", "/dev/book-flow/legal/terms", "실제 문서의 개발 Book 표현."],
  ["개인정보처리방침", "/dev/book-flow/legal/privacy", "내용 변경 없음."],
  ["환불정책", "/dev/book-flow/legal/refund", "내용 변경 없음."],
  ["사업자 정보 / Footer", "/dev/book-flow/legal/business", "문의·소셜 링크는 표시만 검수하세요. 실제 외부 문의를 보내지 마세요."],
] as const;
export function Experience() {
  const [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const silent = process.env.NEXT_PUBLIC_LOCAL_REVIEW_SILENT === "1";
  async function fixture(url: string, body: string) {
    if (busy || !silent) return;
    setBusy(true); setMessage("");
    try { const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body }); setMessage(r.ok ? "로컬 fixture 준비 완료. 해당 화면을 새로고침하세요." : `준비 실패 HTTP_${r.status}. 이용권은 모의 로그인과 가입 동의 후 사용할 수 있습니다.`); }
    catch { setMessage("로컬 서버 연결을 확인하세요."); }
    finally { setBusy(false); }
  }
  return <main className={s.root}><a href="/dev/content-review">← 6권 본문 검수</a><h1>전체 기능 · 사용자 흐름 검수</h1>
    <p>본문 검수와 분리된 기존 로컬 모의 시스템입니다. 여기서는 검수용 주문·서재·이용권·쿠폰·보상 기록이 로컬 메모리에 생길 수 있습니다. 실제 돈/계정/운영 DB에는 반영되지 않습니다.</p>
    <p>실제 OAuth, 결제 승인, Kakao SDK 전송, 운영 Meta 측정은 이 검수 범위가 아닙니다. 버튼의 외형과 로컬 상태 전이는 확인할 수 있지만 실제 외부 연동 성공을 의미하지 않습니다.</p>
    {!silent ? <p role="alert">먼저 <code>node scripts/start-v4-manual-review.mjs</code>로 전용 서버를 실행하세요. 전체 흐름 분석 이벤트 차단이 확인되기 전에는 아래 진입을 제공하지 않습니다.</p> : <p>전용 검수 서버: 분석 이벤트 차단 ON · public Book/Auth gate OFF</p>}
    {links.map(([title, href, note]) => <section className={s.case} key={href}><h2>{silent ? <a href={href} target="_blank" rel="noopener noreferrer">{title} ↗</a> : title}</h2><p>{note}</p></section>)}
    <section className={s.case}><h2>이용권 / 쿠폰 / 결제 경계</h2><p>먼저 모의 로그인·가입 동의를 마칩니다. 아래 버튼은 기존 개발용 고정 fixture만 준비합니다. 본문 검수 Case에는 영향을 주지 않습니다.</p><div className={s.actions}>
      <button disabled={busy || !silent} onClick={() => void fixture("/dev/account/api/ticket-fixture", "one")}>이용권 1장 준비</button>
      <button disabled={busy || !silent} onClick={() => void fixture("/dev/account/api/ticket-fixture", "several")}>복수 이용권 준비</button>
      <button disabled={busy || !silent} onClick={() => void fixture("/dev/account/api/ticket-fixture", "failure")}>다음 이용권 발행 실패 검수</button>
      <button disabled={busy || !silent} onClick={() => void fixture("/dev/account/api/coupon-fixture", "{}")}>쿠폰 fixture 준비</button>
    </div><p>쿠폰 입력 예: GYEOL300 / 20PERCENT / CAREER_ONLY / EXPIRED / MEMBER_ONLY. 서재와 영수증에서 보유·조건·만료·적용/해제를 확인하세요.</p></section>
    <section className={s.case}><h2>캠페인 / 친구 초대 / 공유</h2><button disabled={busy || !silent} onClick={() => void fixture("/dev/campaign/setup", "{}")}>캠페인 fixture 준비</button>
      {silent && <ul>{["book-ticket", "book-coupon", "book-none", "book-other", "book-paused", "book-draft", "book-ended", "book-future"].map(slug => <li key={slug}><a href={`/dev/campaign/${slug}`} target="_blank" rel="noopener noreferrer">{slug}</a></li>)}</ul>}
      <p>새 가입 혜택은 기존 가입자에게 다시 생기지 않습니다. 새 가입 검수는 서버 재시작 후 진행하세요. 카카오와 Google은 서로 다른 모의 회원입니다.</p>
      <p>책을 모의 발행한 뒤 실제 뒤표지의 공유/초대 UI를 사용하세요. 받은 초대 링크는 별도 브라우저 프로필에서 열고 다른 모의 회원으로 이어가면 초대·보상·중복 방지를 확인할 수 있습니다. 전송 없이 링크 복사/미리보기로 검수하세요.</p>
    </section>
    <p role="status">{message}</p><section className={s.case}><h2>직접 확인 순서</h2><ol>{["비회원 책장·입력·필수 동의·영수증", "모의 로그인·가입 동의·로그아웃·재로그인", "모의 구매 → 발행 → 서재 소유권 → 책 다시 읽기", "이용권 잔액·사용·실패 복구 / 쿠폰 적용·해제·조건", "공유 뒤표지·수신 화면 / 친구 초대 / 캠페인 상태와 혜택", "6권 본문 검수에서 각자 다른 입력으로 끝까지 읽기", "390/430/768/1440 화면에서 페이지 넘김·스크롤·표·각주·부록"].map(label => <li key={label}><label><input type="checkbox" /> {label}</label></li>)}</ol>
      <p>종료: 서버 Ctrl+C. 재시작하면 기존 모의 서버 저장소가 초기화됩니다. 여섯 본문 입력/책은 브라우저에 남으며 본문 검수의 전체 Reset으로 지웁니다. 다른 브라우저에는 자동 공유되지 않습니다.</p>
    </section></main>;
}
