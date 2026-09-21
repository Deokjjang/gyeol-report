"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReportStatusView } from "./ReportStatusView";

export function ReportGenerationStatus({ attention = false, delayed = false }: { readonly attention?: boolean; readonly delayed?: boolean }) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  useEffect(() => {
    if (attention || refreshing) return;
    // Only refresh the canonical report route. The worker runs independently.
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") startTransition(() => router.refresh());
    }, 10000);
    return () => clearInterval(timer);
  }, [router, attention, refreshing]);
  return <ReportStatusView state={attention ? "attention" : delayed ? "delayed" : "preparing"} />;
}
