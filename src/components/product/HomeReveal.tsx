"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Content is visible without JavaScript. Only cards entering the viewport animate.
export default function HomeReveal({ children }: { readonly children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const region = root.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!region || reducedMotion.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "true");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    region.querySelectorAll("[data-reveal]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <div ref={root}>{children}</div>;
}
