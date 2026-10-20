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
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer); timer = undefined;
      if (!document.hidden && !motion.matches) {
        // Decorative only: complete is deliberately excluded. The server owns completion.
        timer = setInterval(() => setStep(value => (value + 1) % (PUBLISHING_STATES.length - 1)), 1400);
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync); motion.addEventListener("change", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync); };
  }, []);
  return <div className={styles.visual} aria-hidden="true"><Publishing state={PUBLISHING_STATES[step]} notice="" visualOnly /></div>;
}
