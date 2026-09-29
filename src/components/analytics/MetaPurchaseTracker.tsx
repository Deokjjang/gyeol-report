"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaPurchaseTrackerProps = {
  readonly reportId: string;
  readonly productType: string;
  readonly productName: string;
  readonly value: number;
  readonly currency: string;
};

export default function MetaPurchaseTracker({
  reportId,
  productType,
  productName,
  value,
  currency,
}: MetaPurchaseTrackerProps) {
  useEffect(() => {
    const url = new URL(window.location.href);

    // 실제 결제 성공 직후 리다이렉트된 경우에만 Purchase 전송
    if (url.searchParams.get("purchase") !== "1") {
      return;
    }

    const storageKey = `gyeol:meta:purchase:${reportId}`;

    try {
      if (window.localStorage.getItem(storageKey) === "1") {
        cleanPurchaseMarker();
        return;
      }
    } catch {
      // localStorage 사용 불가 환경에서도 추적은 계속 시도
    }

    let attempts = 0;

    const timer = window.setInterval(() => {
      attempts += 1;

      if (typeof window.fbq === "function") {
        window.clearInterval(timer);

        window.fbq("track", "Purchase", {
  content_ids: [productType],
  content_name: productName,
  content_type: "product",
  value,
  currency,
  num_items: 1,
});

        try {
          window.localStorage.setItem(storageKey, "1");
        } catch {
          // 저장 실패가 Purchase 전송 자체를 막지는 않음
        }

        cleanPurchaseMarker();
        return;
      }

      if (attempts >= 50) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [currency, productName, productType, reportId, value]);

  return null;
}

function cleanPurchaseMarker() {
  const url = new URL(window.location.href);

  if (!url.searchParams.has("purchase")) {
    return;
  }

  url.searchParams.delete("purchase");

  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}