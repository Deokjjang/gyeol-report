export type CampaignPresentation = {
  slug: string; message: string; active: boolean; status: string;
  offer: "NONE" | "REPORT_TICKET" | "COUPON"; quantity: number | null;
  startsAt: string | null; endsAt: string | null;
  coupon: null | { name: string; type: "fixed_amount" | "percentage"; value: number; maxDiscount: number | null; minOrder: number; products: string[]; expiresAt: string };
};
export const CAMPAIGN_SLUG = /^[a-z0-9][a-z0-9-]{2,63}$/;
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export function campaignUtm(query: Record<string, unknown>) {
  return Object.fromEntries(UTM_KEYS.flatMap(k => typeof query[k] === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(query[k]) && !/[0-9]{6}/.test(query[k]) ? [[k,query[k]]] : []));
}
export const CAMPAIGN_EVENTS = ["campaign_landing_opened", "campaign_cta_clicked", "campaign_signup_started", "campaign_attributed", "campaign_benefit_granted", "campaign_generation_started", "campaign_report_published", "campaign_share_created"] as const;
// Local transport only; public analytics/Meta and free-form metadata are absent.
export function campaignEvent(event: typeof CAMPAIGN_EVENTS[number], slug: string, local: boolean, eventId: string) {
  if (local && process.env.NODE_ENV !== "production" && typeof window !== "undefined" && CAMPAIGN_SLUG.test(slug))
    window.dispatchEvent(new CustomEvent("gyeol:campaign", {detail:{event,campaign:slug,eventId}}));
}
export function campaignOffer(c: CampaignPresentation) {
  if (c.offer === "REPORT_TICKET") return `처음 가입하고 필수 동의를 마치면 리포트 이용권 ${c.quantity}장을 받을 수 있어요.`;
  if (c.offer === "COUPON" && c.coupon) {
    const d=c.coupon;
    return `처음 가입하고 필수 동의를 마치면 ${d.type === "fixed_amount" ? `${d.value.toLocaleString("ko-KR")}원` : `${d.value}%`} 할인 쿠폰을 받을 수 있어요.${d.maxDiscount ? ` 최대 ${d.maxDiscount.toLocaleString("ko-KR")}원 할인.` : ""}`;
  }
  return "나에게 궁금한 이야기를 한 권의 책으로 만나보세요.";
}
