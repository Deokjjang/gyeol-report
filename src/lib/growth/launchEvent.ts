// Presentation constants only. DB timestamps and eligibility remain authoritative.
export const LAUNCH_START = "2026-10-28T15:00:00Z";
export const LAUNCH_END = "2026-10-31T15:00:00Z";
export type LaunchEventView = {
  state: "SCHEDULED" | "ACTIVE" | "ENDED" | "PAUSED";
  serverNow: string; startsAt: string; endsAt: string;
  campaignAvailable: boolean; referralAvailable: boolean; inviterAvailable: boolean;
  budgetApproved: boolean; campaignSlug: string | null;
};
export const LAUNCH_NOTICE = "10월 29일~31일 · 이벤트 무료 이용권은 11월 1일 00:00 KST에 만료됩니다. 신규 가입 보상은 평생 최대 1장(광고·추천 중복 불가), 추천 성공 보상은 평생 최대 1장입니다. 추천 성공은 초대한 친구의 첫 정상 발행 기준이며, 마감 후 발행 완료 시 지급되지 않습니다. 마감 직전에는 처리 지연으로 보상을 받지 못할 수 있습니다. 유료 이용권은 이벤트 만료와 무관합니다.";
export function isLaunchEventView(value: unknown): value is LaunchEventView {
  if (!value || typeof value !== "object") return false;
  const v = value as LaunchEventView;
  return ["SCHEDULED", "ACTIVE", "ENDED", "PAUSED"].includes(v.state) && v.startsAt === LAUNCH_START && v.endsAt === LAUNCH_END
    && Number.isFinite(Date.parse(v.serverNow)) && [v.campaignAvailable, v.referralAvailable, v.inviterAvailable, v.budgetApproved].every(b => typeof b === "boolean")
    && (v.campaignSlug === null || /^[a-z0-9][a-z0-9-]{2,63}$/.test(v.campaignSlug));
}
export function launchRemaining(v: LaunchEventView, elapsed: number) {
  const target = v.state === "SCHEDULED" ? v.startsAt : v.state === "ACTIVE" ? v.endsAt : null;
  return target ? Math.max(0, Date.parse(target) - Date.parse(v.serverNow) - Math.max(0, elapsed)) : null;
}
export function launchCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, "0")).join(" : ");
}
