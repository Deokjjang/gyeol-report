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
export const CAMPAIGN_EVENTS = ["campaign_landing_opened", "campaign_cta_clicked", "signup_started", "campaign_attributed", "campaign_benefit_granted", "publishing_started", "report_published", "share_created"] as const;
export type CampaignState = "SCHEDULED" | "ACTIVE_ELIGIBLE" | "ACTIVE_INELIGIBLE" | "BENEFIT_ALREADY_GRANTED" | "PAUSED" | "ENDED";
export type CampaignView = CampaignPresentation & { state: CampaignState; serverNow: string; headline: string; description: string; eligibility: string; cta: "capture" | "consent" | "product" };
// Elapsed time is monotonic (performance.now), not the customer's calendar clock.
export function campaignRemaining(c: CampaignView, elapsed: number) {
  return c.active && c.endsAt ? Math.max(0, Date.parse(c.endsAt) - Date.parse(c.serverNow) - Math.max(0, elapsed)) : null;
}
export function campaignCountdown(ms: number) {
  const s = Math.floor(ms / 1000), days = Math.floor(s / 86400);
  return `${days ? `${days}일 ` : ""}${[Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, "0")).join(":")}`;
}
export function campaignOffer(c: CampaignPresentation) {
  if (c.offer === "REPORT_TICKET") return `처음 가입하고 필수 동의를 마치면 리포트 이용권 ${c.quantity}장을 받을 수 있어요.`;
  if (c.offer === "COUPON" && c.coupon) {
    const d=c.coupon;
    return `처음 가입하고 필수 동의를 마치면 ${d.type === "fixed_amount" ? `${d.value.toLocaleString("ko-KR")}원` : `${d.value}%`} 할인 쿠폰을 받을 수 있어요.${d.maxDiscount ? ` 최대 ${d.maxDiscount.toLocaleString("ko-KR")}원 할인.` : ""}`;
  }
  return "나에게 궁금한 이야기를 한 권의 책으로 만나보세요.";
}
