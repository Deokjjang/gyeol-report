"use client";
import Script from "next/script";
import { useRef, useState } from "react";
import { copyShareLink, nativeShare } from "../../lib/sharing/shareBrowser";
import { bookKakaoCard, bookNativeData, type BookShareModel } from "../../lib/book/shareModel";
import { bookShareEvent } from "../../lib/book/shareEvents";
import { ShareIcon } from "../../app/dev/book-preview/BookPages";
import s from "./bookShare.module.css";
import { LAUNCH_NOTICE } from "../../lib/growth/launchEvent";

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
export function BookShareActions({ owner, model, local = false }: { owner?: { reportId: string }; model?: BookShareModel; local?: boolean }) {
  const [prepared, setPrepared] = useState<BookShareModel | null>(null), [message, setMessage] = useState(""), [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false), pending = useRef(false);
  // Owner actions always re-authorize on the server; a stale supplied link is not permission.
  const ready = prepared ?? (!owner && model?.isShareable ? model : null);
  function initKakao() {
    try { if (!local && kakaoKey && window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey); } catch { /* Copy fallback. */ }
  }
  async function copy(value: BookShareModel) {
    const url = value.referral?.url ?? value.shareUrl!;
    if (await copyShareLink(url)) { setMessage("복사됨"); bookShareEvent("report_share_copy", value.productType, local); }
    else { setManual(url); setMessage("링크를 선택해서 복사해 주세요."); }
  }
  async function share(mode: "kakao" | "native" | "copy") {
    if (pending.current) return;
    pending.current = true; setBusy(true); setManual(""); setMessage("");
    try {
      let value = ready;
      if (!value) {
        if (!owner) { setMessage("책이 준비되면 공유할 수 있습니다."); return; }
        const response = await fetch(local ? "/dev/book-flow/share" : "/api/book-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId: owner.reportId }), cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.model?.isShareable) { setMessage("공유 권한 또는 책의 상태를 확인해 주세요."); return; }
        value = result.model as BookShareModel; setPrepared(value);
        bookShareEvent("report_share_created", value.productType, local);
        // Preserve user activation on Safari: prepare first, invoke on the next gesture.
        if ((mode === "native" && typeof navigator.share === "function") || (mode === "kakao" && (local ? window.Kakao?.isInitialized() : kakaoKey))) {
          setMessage(`준비되었습니다. ${mode === "kakao" ? "카카오톡" : "공유"}을 한 번 더 눌러 주세요.`); return;
        }
      }
      if (mode === "copy") { await copy(value); return; }
      if (mode === "native") {
        const outcome = await nativeShare(bookNativeData(value));
        if (outcome === "cancelled") return;
        if (outcome === "shared") { bookShareEvent("report_share_native", value.productType, local); setMessage("공유했습니다."); return; }
        await copy(value); return;
      }
      initKakao();
      if (window.Kakao?.isInitialized()) {
        try { window.Kakao.Share.sendDefault(bookKakaoCard(value)); bookShareEvent("report_share_kakao", value.productType, local); return; } catch { /* Same URL copy fallback. */ }
      }
      await copy(value);
    } catch { setMessage("공유하지 못했습니다. 다시 시도해 주세요."); }
    finally { pending.current = false; setBusy(false); }
  }
  return <section className={s.actions} aria-label="이 책 공유하기" aria-busy={busy}>
    {!local && kakaoKey ? <Script id="gyeol-kakao-sdk" src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js" integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy" crossOrigin="anonymous" strategy="afterInteractive" onReady={initKakao} /> : null}
    <h2>이 책 공유하기</h2><div className={s.buttons}>{(["kakao", "native", "copy"] as const).map((mode, i) => <button key={mode} type="button" disabled={busy} aria-label={["카카오톡으로 책 공유", "시스템 공유", "공유 링크 복사"][i]} onClick={() => void share(mode)}><ShareIcon kind={i} /><span>{["카카오톡", "공유", "링크 복사"][i]}</span></button>)}</div>
    <p className={s.notice}>링크를 받은 사람은 책 전체를 읽을 수 있습니다.</p>
    {owner && ready?.referral ? <p className={s.notice}>{ready.referral.launchEvent ? LAUNCH_NOTICE : "친구는 처음 가입·동의하면 1장, 나는 친구가 첫 책을 완성하면 1장을 받습니다."}</p> : null}
    <p className={s.status} role="status">{message}</p>
    {manual ? <input aria-label="복사할 공유 링크" readOnly value={manual} onFocus={e => e.target.select()} /> : null}
    {local && owner && ready?.shareToken ? <a className={s.review} href={`/dev/book-flow/r/${ready.shareToken}${ready.referral ? `?ref=${ready.referral.token}` : ""}`}>로컬 공유 화면 검수 ↗</a> : null}
  </section>;
}
