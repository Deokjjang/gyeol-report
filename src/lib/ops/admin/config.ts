import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * 관리자 보안 설정(P6d-ops). 서버에서만 읽는다.
 * - ADMIN_SESSION_HOURS: 관리자 화면을 여는 로그인 유효 시간(기본 12시간, 마지막 로그인 시각 기준).
 * - ADMIN_ACTION_PIN: 환불·이용권 지급·내보내기 확인 PIN. 없으면 그 작업들은 꺼진다.
 * - ADMIN_REFUND_DAILY_MAX_COUNT / _AMOUNT: 관리자 환불 하루(한국 날짜) 상한(기본 5건·50,000원). 자동 환불은 세지 않는다.
 */
type Env = Readonly<Record<string, string | undefined>>;

export const ADMIN_SESSION_HOURS_DEFAULT = 12;
export const ADMIN_PIN_MAX_FAILURES = 5;
export const ADMIN_PIN_WINDOW_MS = 15 * 60_000;
export const ADMIN_PIN_LOCK_MS = 15 * 60_000;
export const ADMIN_REFUND_DAILY_MAX_COUNT_DEFAULT = 5;
export const ADMIN_REFUND_DAILY_MAX_AMOUNT_DEFAULT = 50_000;

const int = (v: string | undefined, d: number, min: number, max: number) => { const n = Number(v); return v !== undefined && v.trim() !== "" && Number.isInteger(n) && n >= min && n <= max ? n : d; };

export function adminSessionHours(env: Env = process.env): number { return int(env.ADMIN_SESSION_HOURS, ADMIN_SESSION_HOURS_DEFAULT, 1, 168); }
/** 마지막 로그인 시각이 없거나 유효 시간이 지났으면 false(다시 로그인). */
export function adminSessionFresh(lastSignInAt: string | null | undefined, env: Env = process.env, now = Date.now()): boolean {
  const t = typeof lastSignInAt === "string" ? Date.parse(lastSignInAt) : NaN;
  return Number.isFinite(t) && t <= now + 60_000 && now - t < adminSessionHours(env) * 3_600_000;
}

export function adminPinConfigured(env: Env = process.env): boolean { return typeof env.ADMIN_ACTION_PIN === "string" && env.ADMIN_ACTION_PIN.length > 0; }
const digest = (v: string) => createHash("sha256").update(v, "utf8").digest();
/** sha256 digest끼리 timingSafeEqual(길이가 달라도 같은 시간). */
export function adminPinMatches(input: unknown, env: Env = process.env): boolean {
  if (!adminPinConfigured(env) || typeof input !== "string" || !input || input.length > 128) return false;
  return timingSafeEqual(digest(input), digest(env.ADMIN_ACTION_PIN!));
}
/** 실패 시각(오름차순)에서 15분 안 5번이면 5번째 실패부터 15분 잠금. 잠금 끝 시각(ms) 또는 null. */
export function adminPinLockedUntil(failures: readonly number[], now: number): number | null {
  const t = [...failures].filter(Number.isFinite).sort((a, b) => a - b);
  let until = 0;
  for (let i = 0; i + ADMIN_PIN_MAX_FAILURES - 1 < t.length; i++) {
    const fifth = t[i + ADMIN_PIN_MAX_FAILURES - 1];
    if (fifth - t[i] <= ADMIN_PIN_WINDOW_MS) until = Math.max(until, fifth + ADMIN_PIN_LOCK_MS);
  }
  return until > now ? until : null;
}

export function adminRefundCaps(env: Env = process.env): { count: number; amount: number } {
  return { count: int(env.ADMIN_REFUND_DAILY_MAX_COUNT, ADMIN_REFUND_DAILY_MAX_COUNT_DEFAULT, 0, 1000), amount: int(env.ADMIN_REFUND_DAILY_MAX_AMOUNT, ADMIN_REFUND_DAILY_MAX_AMOUNT_DEFAULT, 0, 100_000_000) };
}
const kstDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });
/** 오늘(한국 날짜) [시작, 끝) ISO. */
export function kstDayRange(now = Date.now()): { start: string; end: string } {
  const start = Date.parse(`${kstDate.format(new Date(now))}T00:00:00+09:00`);
  return { start: new Date(start).toISOString(), end: new Date(start + 86_400_000).toISOString() };
}
