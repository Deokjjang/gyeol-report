"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./reportReading.module.css";

type ReportShareActionsProps = {
  readonly productSlug?: string;
  readonly className?: string;
};

export default function ReportShareActions({
  productSlug = "saju-mbti-full",
  className = "",
}: ReportShareActionsProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const productHref = `/report/new?product=${productSlug}`;

  async function handleShare() {
    // Keep the report path; exclude section anchors and unrelated query data.
    const url = window.location.origin + window.location.pathname;
    const shareData = {
      title: "결리포트",
      text: "사주와 MBTI를 함께 읽는 결리포트입니다.",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setStatusMessage("공유 화면을 열었습니다.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setStatusMessage("리포트 링크가 복사되었습니다.");
        return;
      } catch {
        setStatusMessage("자동 복사가 되지 않았습니다. 주소창의 리포트 주소를 복사해 주세요.");
        return;
      }
    }

    setStatusMessage("주소창의 리포트 링크를 복사해 공유할 수 있습니다.");
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => {
            void handleShare();
          }}
        >
          리포트 공유하기
        </button>
        <Link href={productHref}>
          나도 내 리포트 보기
        </Link>
        <Link href="/">
          다른 리포트 보기
        </Link>
      </div>
      {statusMessage ? (
        <p className={styles.shareStatus} role="status">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
