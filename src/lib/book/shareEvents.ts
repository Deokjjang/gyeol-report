import { syncLocalFacts } from "../analytics/client";
export type BookShareEvent = "report_share_created" | "report_share_kakao" | "report_share_native" | "report_share_copy" | "shared_report_opened" | "shared_cta_clicked";
// Local/test contract only. No tokens, names, IDs, URLs or analytics transport.
export function bookShareEvent(event: BookShareEvent, productType: string, local = false) {
  if (local && event === "report_share_created") void syncLocalFacts();
  if (local && process.env.NODE_ENV !== "production" && typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("gyeol:book-share", { detail: { event, productType } }));
}
