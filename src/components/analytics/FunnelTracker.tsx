"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtm, consumeLoginSignal, funnel, viewStep } from "../../lib/analytics/funnel";
import type { FunnelStep } from "../../lib/analytics/funnelModel";

/** F 퍼널: 주소마다 유입 기억·조회 단계(/free·메인·상품 화면)·기존 회원 로그인 신호. 루트 레이아웃에 1번. */
export function FunnelTracker() {
  const pathname = usePathname();
  useEffect(() => {
    captureUtm();
    const step = viewStep(pathname ?? "/");
    if (step) funnel(step);
    consumeLoginSignal();
  }, [pathname]);
  return null;
}
/** 서버 화면(결제 완료·책 화면)에서 단계 1번. */
export function FunnelPing({ steps }: { steps: readonly FunnelStep[] }) {
  useEffect(() => { for (const s of steps) funnel(s); }, [steps]);
  return null;
}
