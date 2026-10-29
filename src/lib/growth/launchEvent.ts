// Presentation constants only. DB timestamps and eligibility remain authoritative.
export const LAUNCH_START = "2026-10-10T15:00:00Z";
export const LAUNCH_END = "2026-10-31T15:00:00Z";
export type LaunchEventView = {
  state: "SCHEDULED" | "ACTIVE" | "ENDED" | "PAUSED";
  serverNow: string; startsAt: string; endsAt: string;
  campaignAvailable: boolean; referralAvailable: boolean; inviterAvailable: boolean;
  budgetApproved: boolean; campaignSlug: string | null;
};
export const LAUNCH_NOTICE = "이벤트 페이지에서 참여한 뒤 처음 가입하고 필수 동의를 마친 적격 신규 회원에게 이용권 1장을 드립니다. 광고 클릭만으로 지급되지 않으며, 광고 없이 공식 이벤트 링크로도 참여할 수 있습니다. 유입 기록 없이 일반 메인에서 가입한 경우에는 혜택이 보장되지 않습니다. 신규 가입 혜택은 평생 최대 1장(광고·친구 초대 중복 불가), 친구 초대 추가 혜택은 평생 최대 1장으로 계정당 전체 최대 2장입니다. 공유 가능한 내 Book의 유효한 초대 링크로 친구가 처음 가입하고 필수 동의를 마친 뒤, 이벤트 기간 안에 첫 리포트를 정상 발행 완료해야 초대한 사람에게 이용권 1장이 추가됩니다. 일반 책 공유, 링크 클릭이나 친구 가입만으로 초대한 사람에게 지급되지는 않습니다. 이벤트는 10월 11일 0시 이후 운영 활성화 시 시작하며 11월 1일 0시에 종료됩니다. 이벤트 무료 이용권도 지급일과 관계없이 11월 1일 0시에 만료됩니다. 마감 후 발행 완료 시에는 초대 추가 혜택이 지급되지 않으며, 마감 직전에는 처리 지연으로 혜택을 받지 못할 수 있습니다. 유료 이용권은 이벤트 만료와 무관합니다.";
export function isLaunchEventView(value: unknown): value is LaunchEventView {
  if (!value || typeof value !== "object") return false;
  const v = value as LaunchEventView;
  return ["SCHEDULED", "ACTIVE", "ENDED", "PAUSED"].includes(v.state) && v.startsAt === LAUNCH_START && v.endsAt === LAUNCH_END
    && Number.isFinite(Date.parse(v.serverNow)) && [v.campaignAvailable, v.referralAvailable, v.inviterAvailable, v.budgetApproved].every(b => typeof b === "boolean")
    && (v.state !== "ACTIVE" || (v.budgetApproved && Date.parse(v.serverNow) >= Date.parse(LAUNCH_START) && Date.parse(v.serverNow) < Date.parse(LAUNCH_END)))
    && (v.campaignSlug === null || /^[a-z0-9][a-z0-9-]{2,63}$/.test(v.campaignSlug));
}
export function launchRemaining(v: LaunchEventView, elapsed: number) {
  const target = v.state === "SCHEDULED" ? v.startsAt : v.state === "ACTIVE" ? v.endsAt : null;
  const remaining = target ? Math.max(0, Date.parse(target) - Date.parse(v.serverNow) - Math.max(0, elapsed)) : null;
  // Reaching the earliest start is not operator activation. Await the next server state.
  return v.state === "SCHEDULED" && remaining === 0 ? null : remaining;
}
/** Event copy shows only while the server says ACTIVE and time remains. Ended, paused, loading or unavailable → nothing. */
export function launchActive(v: LaunchEventView | null, remaining: number | null): v is LaunchEventView {
  return v?.state === "ACTIVE" && remaining !== null && remaining > 0;
}
export function launchCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const [days, ...time] = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, "0"));
  return `${days}일 ${time.join(" : ")}`;
}
