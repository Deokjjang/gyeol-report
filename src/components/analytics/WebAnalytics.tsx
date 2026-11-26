"use client";
import { useEffect } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { sanitizeAnalyticsUrl, webEventOnce, type WebEventName } from "../../lib/analytics/web";

const beforeSend = (event: BeforeSendEvent): BeforeSendEvent | null => {
  const url = sanitizeAnalyticsUrl(event.url);
  return url ? { ...event, url } : null;
};

/** OPS-1: 루트 레이아웃에 1번. debug는 개발 서버에서만 켜진다(라이브러리 기본). */
export function WebAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}

/** 서버 화면(결제 완료 등)에서 이벤트 한 번. */
export function WebEventPing({ name, product, onceKey }: { name: WebEventName; product?: string; onceKey: string }) {
  useEffect(() => { webEventOnce(name, { product }, onceKey); }, [name, product, onceKey]);
  return null;
}
