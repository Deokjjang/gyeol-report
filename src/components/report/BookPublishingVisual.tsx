"use client";
import { useEffect, useState } from "react";
import { Publishing } from "../../app/dev/book-preview/BookPages";
import type { PublishingState } from "../../app/dev/book-preview/model";
import styles from "./reportStatus.module.css";

/**
 * 책 만드는 그림(W3 P2). 그림의 걸음은 실제 단계와 1:1이다 — 단계가 바뀔 때만 다른 그림으로 넘어간다(시간으로 꾸미지 않는다).
 * - 명식 계산: 빈 종이에 줄이 생겼다 사라진다(preparing ↔ composing) · 검수: 다 쓴 종이 묶음(composing) · 제본: 묶고 표지를 덮는다(binding ↔ covering).
 * - 책 쓰기 단계는 ReportStatusView의 WritingPage(종이에 줄이 한 줄씩 써지는 모습)가 대신한다.
 * - 동작 줄이기 설정이면 움직이지 않고 그 단계의 마지막 그림(줄이 다 그려진 모습)에 멈춘다. 숨은 탭에서도 멈춘다. 진행은 숫자(n/전체 장·경과 시간)가 보인다.
 * stage가 없으면(결제 확인·책 펼치는 중) 움직이지 않는 빈 종이 한 장.
 */
export type PublishingStage = "compute" | "review" | "binding";
const FRAMES: Record<PublishingStage, readonly PublishingState[]> = { compute: ["preparing", "composing"], review: ["composing"], binding: ["binding", "covering"] };
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function BookPublishingVisual({ stage }: { readonly stage?: PublishingStage }) {
  return stage ? <AnimatedPublishing frames={FRAMES[stage] ?? FRAMES.compute} /> : <div className={styles.visual} aria-hidden="true"><Publishing state="preparing" notice="" visualOnly /></div>;
}

function AnimatedPublishing({ frames }: { readonly frames: readonly PublishingState[] }) {
  const [step, setStep] = useState(0), [still, setStill] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const motion = typeof matchMedia === "function" ? matchMedia(REDUCED_MOTION_QUERY) : null;
    const sync = () => {
      clearInterval(timer); timer = undefined;
      const reduced = motion?.matches === true;
      setStill(reduced);
      // Decorative only: complete is deliberately excluded. The server owns completion.
      if (!reduced && !document.hidden && frames.length > 1) timer = setInterval(() => setStep(value => (value + 1) % frames.length), 1400);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion?.addEventListener?.("change", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); motion?.removeEventListener?.("change", sync); };
  }, [frames]);
  const state = still ? frames[frames.length - 1] : frames[step % frames.length];
  return <div className={styles.visual} aria-hidden="true"><Publishing state={state} notice="" visualOnly /></div>;
}
