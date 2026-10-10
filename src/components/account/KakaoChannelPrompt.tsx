"use client";
import Script from "next/script";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { AccountSession } from "../../lib/account/policy";
import { channelPreferenceKey, channelPromptDismissed, rememberChannelPrompt, requestKakaoChannel } from "../../lib/account/channelPromptBrowser";
import s from "./channelPrompt.module.css";

const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();

export function KakaoChannelPrompt({ session, local = false, enabled = true }: { session: AccountSession; local?: boolean; enabled?: boolean }) {
  const prompt = session.channelPrompt;
  if (!enabled || session.status !== "member" || !prompt || !kakaoKey
    || !/^[a-f0-9]{64}$/.test(prompt.scope) || !/^_[A-Za-z0-9]{2,64}$/.test(prompt.channelPublicId)) return null;
  return <ChannelDialog key={prompt.scope} scope={prompt.scope} channelPublicId={prompt.channelPublicId} local={local} />;
}

function ChannelDialog({ scope, channelPublicId, local }: { scope: string; channelPublicId: string; local: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null), title = useId(), description = useId();
  const [message, setMessage] = useState(""), [attempted, setAttempted] = useState(false);
  const attemptedRef = useRef(false);
  const closeAction = useRef<HTMLButtonElement>(null);
  function initSdk() {
    try { if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey!); }
    catch { setMessage("카카오톡 연결을 준비하지 못했습니다. 나중에 다시 이용해 주세요."); }
  }
  useEffect(() => {
    const node = dialog.current;
    if (!node || channelPromptDismissed(scope)) return;
    const previous = document.activeElement;
    node.showModal();
    const sync = (event: StorageEvent) => { if (event.key === channelPreferenceKey(scope) && event.newValue) node.close(); };
    window.addEventListener("storage", sync);
    return () => {
      node.close(); window.removeEventListener("storage", sync);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [scope]);
  function close() {
    rememberChannelPrompt(scope, attemptedRef.current ? "add_clicked" : "later");
    dialog.current?.close();
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]")];
    if (!controls.length) return;
    event.preventDefault();
    const current = controls.indexOf(document.activeElement as HTMLElement);
    controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
  }
  function add() {
    if (attemptedRef.current) return;
    attemptedRef.current = true; setAttempted(true);
    rememberChannelPrompt(scope, "add_clicked");
    initSdk();
    const result = requestKakaoChannel(window.Kakao, channelPublicId, window);
    setMessage(result === "requested" ? "카카오톡에서 채널 추가를 진행해 주세요. 창이 열리지 않았다면 팝업 허용을 확인하거나 아래 채널 링크를 이용해 주세요."
      : result === "blocked" ? "팝업이 차단되어 채널 화면을 열지 못했습니다. 브라우저의 팝업 허용을 확인하거나 아래 채널 링크를 이용해 주세요."
        : "카카오톡 연결을 준비하지 못했습니다. 아래 채널 링크를 이용하거나 나중에 다시 이용해 주세요.");
    closeAction.current?.focus({ preventScroll: true });
  }
  return <>
    {!local ? <Script id="gyeol-kakao-sdk" src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js" integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy" crossOrigin="anonymous" strategy="afterInteractive" onReady={initSdk} onError={() => setMessage("카카오톡 연결을 불러오지 못했습니다. 나중에 다시 이용해 주세요.")} /> : null}
    <dialog ref={dialog} className={s.dialog} role="dialog" aria-modal="true" aria-labelledby={title} aria-describedby={description} onKeyDown={trapFocus} onCancel={event => { event.preventDefault(); close(); }}>
      <p className={s.eyebrow}>GYEOL REPORT</p>
      <h2 id={title}>결리포트의 다음 이야기를<br />카카오톡에서 만나보세요.</h2>
      <p id={description} className={s.description}>새로운 리포트 소식과<br />서비스 안내를 확인할 수 있습니다.</p>
      <div className={s.actions}>
        <button type="button" className={s.primary} onClick={add} disabled={attempted}>카카오톡 채널 추가하기 <span aria-hidden="true">↗</span></button>
        <button ref={closeAction} type="button" onClick={close}>{attempted ? "닫기" : "나중에"}</button>
      </div>
      {message ? <p className={s.message} role="status">{message}</p> : null}
      {attempted ? <a className={s.fallback} href={`https://pf.kakao.com/${channelPublicId}`} target="_blank" rel="noopener noreferrer">채널 화면 직접 열기 ↗</a> : null}
    </dialog>
  </>;
}
