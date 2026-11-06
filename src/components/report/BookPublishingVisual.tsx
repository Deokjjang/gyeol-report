"use client";
import { useEffect, useState } from "react";
import { Publishing } from "../../app/dev/book-preview/BookPages";
import { PUBLISHING_STATES } from "../../app/dev/book-preview/model";
import styles from "./reportStatus.module.css";

export function BookPublishingVisual({ animate }: { readonly animate: boolean }) {
  return animate ? <AnimatedPublishing /> : <div className={styles.visual} aria-hidden="true"><Publishing state="preparing" notice="" visualOnly /></div>;
}

function AnimatedPublishing() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    // The book-making motion is the progress indicator itself, so it is not gated on prefers-reduced-motion.
    const sync = () => {
      clearInterval(timer); timer = undefined;
      if (!document.hidden) {
        // Decorative only: complete is deliberately excluded. The server owns completion.
        timer = setInterval(() => setStep(value => (value + 1) % (PUBLISHING_STATES.length - 1)), 1400);
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <div className={styles.visual} aria-hidden="true"><Publishing state={PUBLISHING_STATES[step]} notice="" visualOnly /></div>;
}
