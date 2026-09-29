"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState, type ReactNode } from "react";
import { prepareReportShare } from "../../app/reports/shareActions";
import { copyShareLink, kakaoShareCard, nativeShare, type KakaoSdk } from "../../lib/sharing/shareBrowser";
import type { ReportShareData } from "../../lib/sharing/reportShareMetadata";
import { trackReportShare, useReportShare } from "./ReportShareProvider";
import styles from "./reportReading.module.css";

declare global { interface Window { Kakao?: KakaoSdk } }
const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();

type ReportShareActionsProps = { readonly productSlug?: string; readonly className?: string };

function KakaoTalkIcon() {
  return (
    <span className={styles.kakaoIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 4C6.8 4 2.6 7.28 2.6 11.32c0 2.6 1.74 4.88 4.36 6.18l-.9 3.3c-.08.3.26.54.52.36l3.92-2.6c.5.06 1 .1 1.5.1 5.2 0 9.4-3.28 9.4-7.34S17.2 4 12 4Z" />
      </svg>
    </span>
  );
}

function ShareIcon() {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="8" y="8" width="10" height="10" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function SharePanel({ busy, statusMessage, manualUrl, children }: {
  readonly busy: boolean;
  readonly statusMessage: string;
  readonly manualUrl: string;
  readonly children: ReactNode;
}) {
  return (
    <section className={styles.sharePanel} aria-labelledby="report-share-title" aria-label="리포트 공유하기" aria-busy={busy}>
      <div className={styles.shareIntro}>
        <p className={styles.shareEyebrow}>SHARE YOUR GYEOL</p>
        <h2 id="report-share-title">이 리포트를 공유해보세요</h2>
        <p>함께 보고 싶은 사람에게 나의 리포트를 보내보세요.</p>
      </div>
      {children}
      <p className={styles.shareHint}>공유 링크를 받은 사람은 이 리포트 전체를 열람할 수 있습니다.</p>
      {statusMessage ? <p className={styles.shareStatus} role="status">{statusMessage}</p> : null}
      {manualUrl ? <input className={styles.shareLink} aria-label="복사할 공유 링크" readOnly value={manualUrl} onFocus={event => event.target.select()} /> : null}
    </section>
  );
}

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
      <SharePanel busy={busy} statusMessage={statusMessage} manualUrl={manualUrl}>
        <button className={styles.kakaoShareButton} type="button" disabled={busy} onClick={() => void handleShare("kakao")}>
          <KakaoTalkIcon />
          <span>카카오톡으로 공유</span>
        </button>
        <button className={styles.nativeShareButton} type="button" disabled={busy} onClick={() => void handleShare("native")}><ShareIcon />공유하기</button>
        <button className={styles.copyShareButton} type="button" disabled={busy} onClick={() => void handleShare("copy")}><CopyIcon />링크 복사</button>
      </SharePanel>
      <aside className={styles.reentryCard} aria-label="내 리포트 시작하기">
        <div>
          <p className={styles.reentryEyebrow}>DISCOVER YOUR GYEOL</p>
          <h2>나만의 결이 궁금해졌다면</h2>
          <p>나의 타고난 성향과 삶의 흐름을 리포트로 만나보세요.</p>
        </div>
        <div className={styles.reentryActions}>
          <Link className={styles.reentryPrimary} href={productHref}>나도 내 리포트 보기 <ArrowIcon /></Link>
          <Link className={styles.reentrySecondary} href="/">다른 리포트 보기</Link>
        </div>
      </aside>
    </div>
  );
}
