"use client";
import { useEffect } from "react";
import { dispatchPurchase, localMeasurement, syncLocalFacts } from "../../lib/analytics/client";
export default function MetaPurchaseTracker({ reportId, local = false }: { reportId: string; local?: boolean }) {
  useEffect(() => {
    let attempts = 0;
    const check = () => {
      if (++attempts > 50) { clearInterval(timer); return; }
      if ((local && localMeasurement()) || typeof window.fbq === "function") {
        clearInterval(timer);
        void dispatchPurchase(reportId, local);
        void syncLocalFacts();
        const url = new URL(window.location.href);
        if (url.searchParams.has("purchase")) {
          url.searchParams.delete("purchase");
          window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
        }
      }
    };
    const timer = setInterval(check, 100); check();
    return () => clearInterval(timer);
  }, [reportId, local]);
  return null;
}
