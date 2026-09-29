"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import type { ReportShareData } from "../../lib/sharing/reportShareMetadata";

type ShareContext = { reportId?: string; share?: ReportShareData; shared?: boolean };
const Context = createContext<ShareContext>({});
export const useReportShare = () => useContext(Context);

export function trackReportShare(event: "share_kakao" | "share_native" | "share_copy" | "shared_report_open", productSlug: string) {
  // TODO: connect an analytics collector to this event. No names, URLs, tokens or report IDs.
  window.dispatchEvent(new CustomEvent("gyeol:share", { detail: { event, product: productSlug } }));
}

export function ReportShareProvider({ children, ...value }: ShareContext & { children: ReactNode }) {
  const parent = useReportShare();
  const opened = useRef(false);
  useEffect(() => {
    if (value.shared && value.share && !opened.current) {
      opened.current = true;
      trackReportShare("shared_report_open", value.share.productSlug);
    }
  }, [value.shared, value.share]);
  return <Context.Provider value={parent.shared ? parent : value}>{children}</Context.Provider>;
}
