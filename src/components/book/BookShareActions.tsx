"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { copyShareLink, nativeShare } from "../../lib/sharing/shareBrowser";
import { bookKakaoCard, bookNativeData, type BookShareModel } from "../../lib/book/shareModel";
import { bookShareEvent } from "../../lib/book/shareEvents";
import { ShareIcon } from "../../app/dev/book-preview/BookPages";
import s from "./bookShare.module.css";
import { useLaunchEvent } from "../growth/LaunchCountdown";
import { BookEventNotice } from "./BookEventNotice";

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
type Mode = "kakao" | "native" | "copy";
const MODES: readonly Mode[] = ["kakao", "native", "copy"];
const LABELS = ["카카오톡", "공유", "링크 복사"], ARIA = ["카카오톡으로 책 공유", "시스템 공유", "공유 링크 복사"];
export const SHARE_STATUS = {
  preparing: "공유 링크를 준비하고 있어요.",
  copied: "링크를 복사했어요.",
  manual: "길게 눌러 복사해 주세요.",
  shared: "공유했어요.",
  kakao: "카카오톡을 여는 중이에요.",
  owner: "공유하려면 이 책을 산 계정으로 로그인하고 약관 동의를 마쳐 주세요.",
  failed: "공유 링크를 만들지 못했어요. 버튼을 다시 눌러 주세요.",
  unavailable: "이 책은 지금 공유할 수 없어요.",
} as const;

type ShareLinkResult = { model?: BookShareModel; status: number };
/** 책 주인의 공유 링크를 받는다(상태 없음). 실패는 status로만 돌려준다(0 = 네트워크). */
async function requestShareLink(reportId: string, local: boolean): Promise<ShareLinkResult> {
  try {
    const response = await fetch(local ? "/dev/book-flow/share" : "/api/book-share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId }), cache: "no-store" });
    const result = await response.json().catch(() => null) as { model?: BookShareModel } | null;
    return response.ok && result?.model?.isShareable && result.model.shareUrl ? { model: result.model, status: response.status } : { status: response.ok ? 502 : response.status };
  } catch { return { status: 0 }; }
}

/**
 * hotfix-share(2026-11-06): 링크는 이 공유 칸이 열릴 때(책 마지막 쪽) 미리 받아 둔다. 버튼을 누른 순간의 복사·카카오·공유하기는
 * 사용자 제스처 안에서 await 없이 바로 부른다 — 아이폰 사파리는 fetch를 기다린 뒤의 클립보드 쓰기·공유를 막는다.
 * 어떤 실패에도 버튼은 그대로 있고(예전에는 403·404면 버튼을 지웠다), 실제로 된 경우에만 된 것처럼 말한다.
 */
export function BookShareActions({ owner, model, local = false }: { owner?: { reportId: string }; model?: BookShareModel; local?: boolean }) {
  const reportId = owner?.reportId;
  // Owner actions always re-authorize on the server; a stale supplied link is not permission.
  const supplied = !owner && model?.isShareable ? model : null;
  const [prepared, setPrepared] = useState<BookShareModel | null>(null);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [message, setMessage] = useState(""), [manual, setManual] = useState("");
  const pending = useRef(false), manualField = useRef<HTMLInputElement>(null), turn = useRef(0);
  const { view, remaining } = useLaunchEvent(local, Boolean(owner));
  const ready = prepared ?? supplied;

  const apply = useCallback((result: ShareLinkResult) => {
    pending.current = false; setLoading(false);
    if (result.model) { setPrepared(result.model); setMessage(""); bookShareEvent("report_share_created", result.model.productType, local); }
    else setMessage(result.status === 403 ? SHARE_STATUS.owner : SHARE_STATUS.failed);
  }, [local]);
  useEffect(() => {
    if (!reportId) return;
    let live = true; pending.current = true;
    void requestShareLink(reportId, local).then(result => { if (live) apply(result); });
    return () => { live = false; pending.current = false; };
  }, [reportId, local, apply]);
  useEffect(() => { if (manual) { manualField.current?.focus({ preventScroll: true }); manualField.current?.select(); } }, [manual]);

  function initKakao() {
    try { if (!local && kakaoKey && window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey); } catch { /* Share/copy fallback. */ }
  }
  // 아래 세 함수는 클릭 처리 안에서 동기로 불린다. 앞에 await를 두지 않는다. mine: 마지막으로 누른 동작만 문구를 바꾼다.
  function copyNow(value: BookShareModel, url: string, mine: number) {
    void copyShareLink(url).then(copied => {
      if (copied) bookShareEvent("report_share_copy", value.productType, local);
      if (turn.current !== mine) return;
      if (copied) { setManual(""); setMessage(SHARE_STATUS.copied); }
      else { setManual(url); setMessage(SHARE_STATUS.manual); }
    });
  }
  function shareNow(value: BookShareModel, url: string, mine: number) {
    if (typeof navigator.share !== "function") { copyNow(value, url, mine); return; }
    void nativeShare(bookNativeData(value)).then(outcome => {
      if (outcome === "shared") bookShareEvent("report_share_native", value.productType, local);
      if (turn.current !== mine) return;
      if (outcome === "shared") setMessage(SHARE_STATUS.shared);
      else if (outcome === "fallback") copyNow(value, url, mine);
      // cancelled(AbortError): 사용자가 닫았다 — 아무 말도 하지 않는다.
    });
  }
  function kakaoNow(value: BookShareModel, url: string, mine: number) {
    initKakao();
    const kakao = typeof window === "undefined" ? undefined : window.Kakao;
    try {
      if (kakao?.isInitialized() && typeof kakao.Share?.sendDefault === "function") {
        kakao.Share.sendDefault(bookKakaoCard(value));
        bookShareEvent("report_share_kakao", value.productType, local); setMessage(SHARE_STATUS.kakao); return;
      }
    } catch { /* SDK 실패: 공유하기 → 링크 복사 */ }
    shareNow(value, url, mine);
  }
  function act(mode: Mode) {
    const mine = ++turn.current;
    setManual("");
    const url = ready?.shareUrl;
    if (!ready || !url) {
      // 미리 받기가 실패했을 때만 여기 온다(받는 중에는 버튼이 잠겨 있다). 다시 받고, 다음 누름에서 공유한다.
      if (reportId && !pending.current) { pending.current = true; setLoading(true); setMessage(""); void requestShareLink(reportId, local).then(apply); }
      return;
    }
    setMessage("");
    if (mode === "copy") copyNow(ready, url, mine);
    else if (mode === "native") shareNow(ready, url, mine);
    else kakaoNow(ready, url, mine);
  }
  const status = loading ? SHARE_STATUS.preparing : message || (!ready && !reportId ? SHARE_STATUS.unavailable : "");
  return <section className={s.actions} aria-label="이 책 공유하기" aria-busy={loading} data-share-state={loading ? "preparing" : ready ? "ready" : "unavailable"}>
    {!local && kakaoKey ? <Script id="gyeol-kakao-sdk" src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js" integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy" crossOrigin="anonymous" strategy="afterInteractive" onReady={initKakao} /> : null}
    <h2>이 책 공유하기</h2>
    <div className={s.buttons}>{MODES.map((mode, i) => <button key={mode} type="button" data-share-mode={mode} disabled={loading || (!ready && !reportId)} aria-label={ARIA[i]} onClick={() => act(mode)}><ShareIcon kind={i} /><span>{LABELS[i]}</span></button>)}</div>
    <p className={s.notice}>링크를 받은 사람은 책 전체를 읽을 수 있습니다.</p>
    {owner ? <BookEventNotice view={view} remaining={remaining} invitation={ready ? Boolean(ready.referral) : undefined} /> : null}
    <p className={s.status} role="status">{status}</p>
    {manual ? <input ref={manualField} className={s.manual} aria-label="복사할 공유 링크" readOnly value={manual} onFocus={e => e.currentTarget.select()} onClick={e => e.currentTarget.select()} /> : null}
    {local && owner && ready?.shareToken ? <a className={s.review} href={`/dev/book-flow/r/${ready.shareToken}`}>로컬 공유 화면 검수 ↗</a> : null}
  </section>;
}
