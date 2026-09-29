"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { prepareReportShare } from "../../app/reports/shareActions";
import { copyShareLink, kakaoShareCard, nativeShare, type KakaoSdk } from "../../lib/sharing/shareBrowser";
import type { ReportShareData } from "../../lib/sharing/reportShareMetadata";
import { trackReportShare, useReportShare } from "./ReportShareProvider";
import styles from "./reportReading.module.css";

declare global { interface Window { Kakao?: KakaoSdk } }
const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();

type ReportShareActionsProps = { readonly productSlug?: string; readonly className?: string };

export default function ReportShareActions({ productSlug = "saju-mbti-full", className = "" }: ReportShareActionsProps) {
  const context = useReportShare();
  const [prepared, setPrepared] = useState<ReportShareData | undefined>();
  const [statusMessage, setStatusMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const pending = useRef(false);
  const data = context.share ?? prepared;
  const productHref = `/report/new?product=${encodeURIComponent(productSlug)}`;

  function initKakao() {
    try {
      if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey);
    } catch { /* Missing/invalid SDK configuration falls back to copying the same share link. */ }
  }

  async function copy(value: ReportShareData, prefix = "") {
    if (await copyShareLink(value.url)) {
      trackReportShare("share_copy", value.productSlug);
      setStatusMessage(`${prefix}리포트 링크가 복사되었습니다.`);
    } else {
      setManualUrl(value.url);
      setStatusMessage("아래 공유 링크를 길게 누르거나 선택해서 복사해 주세요.");
    }
  }

  async function handleShare(mode: "kakao" | "native" | "copy") {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setManualUrl("");
    setStatusMessage("");
    try {
      let value = data;
      if (!value) {
        if (!context.reportId) { setStatusMessage("리포트가 준비되면 공유할 수 있습니다."); return; }
        const result = await prepareReportShare(context.reportId);
        if (!result.ok) { setStatusMessage("공유 링크를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요."); return; }
        value = result.data;
        setPrepared(value);
        // A network round-trip consumes Safari's user activation. The next click opens the sheet directly.
        if ((mode === "native" && typeof navigator.share === "function") || (mode === "kakao" && kakaoKey)) {
          setStatusMessage(`공유 링크가 준비되었습니다. ‘${mode === "kakao" ? "카카오톡" : "공유하기"}’ 버튼을 한 번 더 눌러 주세요.`);
          return;
        }
      }
      if (mode === "copy") { await copy(value); return; }
      if (mode === "native") {
        const result = await nativeShare(value);
        if (result === "cancelled") return;
        if (result === "shared") {
          trackReportShare("share_native", value.productSlug);
          setStatusMessage("공유 화면을 열었습니다.");
          return;
        }
        await copy(value);
        return;
      }
      initKakao();
      if (kakaoKey && window.Kakao?.isInitialized()) {
        try {
          window.Kakao.Share.sendDefault(kakaoShareCard(value));
          trackReportShare("share_kakao", value.productSlug);
          setStatusMessage("카카오톡 공유 화면을 열었습니다.");
          return;
        } catch { /* Copy fallback below. */ }
      }
      await copy(value, "카카오톡 공유를 사용할 수 없어 ");
    } catch {
      setStatusMessage("공유를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally { pending.current = false; setBusy(false); }
  }

  return (
    <div className={className}>
      {kakaoKey ? <Script id="gyeol-kakao-sdk" src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js"
        integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy"
        crossOrigin="anonymous" strategy="afterInteractive" onReady={initKakao} /> : null}
      <div className={styles.shareButtons} aria-label="리포트 공유하기" aria-busy={busy}>
        <button type="button" disabled={busy} onClick={() => void handleShare("kakao")} aria-label="카카오톡으로 공유"><span aria-hidden="true">◉</span> 카카오톡</button>
        <button type="button" disabled={busy} onClick={() => void handleShare("native")}><span aria-hidden="true">↗</span> 공유하기</button>
        <button type="button" disabled={busy} onClick={() => void handleShare("copy")}><span aria-hidden="true">⧉</span> 링크 복사</button>
      </div>
      <p className={styles.shareHint}>링크를 받은 사람은 이 리포트 전체를 볼 수 있어요.</p>
      {statusMessage ? <p className={styles.shareStatus} role="status">{statusMessage}</p> : null}
      {manualUrl ? <input className={styles.shareLink} aria-label="복사할 공유 링크" readOnly value={manualUrl} onFocus={event => event.target.select()} /> : null}
      <div className={`${styles.actions} ${styles.reentryLinks}`}>
        <Link href={productHref}>나도 내 리포트 보기 <span aria-hidden="true">↗</span></Link>
        <Link href="/">다른 리포트 보기</Link>
      </div>
    </div>
  );
}
