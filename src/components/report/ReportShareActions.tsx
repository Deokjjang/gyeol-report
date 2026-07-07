"use client";

import Link from "next/link";
import { useState } from "react";

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
    const url = window.location.href;
    const shareData = {
      title: "결리포트",
      text: "사주와 MBTI를 함께 읽는 결리포트입니다.",
      url,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      setStatusMessage("공유 화면을 열었습니다.");
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setStatusMessage("리포트 링크가 복사되었습니다.");
      return;
    }

    setStatusMessage("주소창의 리포트 링크를 복사해 공유할 수 있습니다.");
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => {
            void handleShare();
          }}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#7f1d38] bg-[#7f1d38] px-4 py-3 text-sm font-extrabold text-[#fffdf8] transition duration-200 hover:bg-[#8f2543] active:scale-[0.98]"
        >
          리포트 공유하기
        </button>
        <Link
          href={productHref}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#c79a43]/60 bg-[#fff8ea] px-4 py-3 text-sm font-extrabold text-[#6f1d35] transition duration-200 hover:bg-[#fff1d3] active:scale-[0.98]"
        >
          나도 내 리포트 보기
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d8d1c4] bg-[#fffdf8] px-4 py-3 text-sm font-extrabold text-[#4c433c] transition duration-200 hover:border-[#c79a43]/60 hover:bg-white active:scale-[0.98]"
        >
          다른 리포트 보기
        </Link>
      </div>
      {statusMessage ? (
        <p className="text-sm font-semibold text-[#6f1d35]" role="status">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
