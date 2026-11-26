/** 프로필 입력 규칙(브라우저 · 서버 공용, SPEC 「가입부터 홈까지」 3). 서버가 다시 확인하고, DB(mirror_save_profile)가 마지막으로 막는다. */

export const HANDLE_PATTERN = /^[a-z0-9._]{3,20}$/;
/** 서비스 주소 · 운영 이름과 겹치는 아이디(다른 사람이 운영자처럼 보이지 않게). */
const RESERVED = new Set(["admin", "administrator", "gyeol", "gyeolreport", "gyeol_report", "gyeol.report", "official", "support", "help", "root", "system", "staff",
  "api", "auth", "dev", "login", "logout", "account", "products", "report", "reports", "free", "gift", "legal", "privacy", "terms", "refund", "null", "undefined", "me", "mine"]);

export type HandleProblem = "length" | "chars" | "dots" | "letters" | "reserved";
export const HANDLE_MESSAGES: Readonly<Record<HandleProblem | "taken" | "cooldown", string>> = {
  length: "아이디는 3~20자로 써 주세요.",
  chars: "영문 소문자 · 숫자 · 마침표(.) · 밑줄(_)만 쓸 수 있어요.",
  dots: "마침표는 처음 · 끝에 두거나 두 번 이어 쓸 수 없어요.",
  letters: "영문이나 숫자를 하나 이상 넣어 주세요.",
  reserved: "쓸 수 없는 아이디예요.",
  taken: "이미 쓰고 있는 아이디예요.",
  cooldown: "아이디는 30일에 한 번 바꿀 수 있어요.",
};

/** 입력 그대로 받아 소문자로 맞춘다(대소문자 무시). 앞뒤 공백 · 맨 앞 @는 뺀다. */
export const normalizeHandle = (value: string): string => value.trim().replace(/^@/, "").toLowerCase();

export function handleProblem(handle: string): HandleProblem | null {
  if (handle.length < 3 || handle.length > 20) return "length";
  if (!HANDLE_PATTERN.test(handle)) return "chars";
  if (handle.startsWith(".") || handle.endsWith(".") || handle.includes("..")) return "dots";
  if (!/[a-z0-9]/.test(handle)) return "letters";
  if (RESERVED.has(handle)) return "reserved";
  return null;
}

/** 이름: 친구에게 보이는 이름 2~10자(제어 문자 · 꺾쇠 제외). */
export const normalizeName = (value: string): string => value.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
export function nameProblem(name: string): string | null {
  const n = [...name].length;
  return n < 2 || n > 10 ? "이름은 2~10자로 써 주세요." : null;
}

/** 생년월일(선택): YYYY-MM-DD, 1900~올해. 출생시간(선택): HH:MM, 생년월일이 있을 때만. */
export function birthProblem(date: string | null, time: string | null, now = new Date()): string | null {
  if (date === null) return time === null ? null : "출생시간은 생년월일과 함께 넣어 주세요.";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return "생년월일을 다시 확인해 주세요.";
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])], dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d || y < 1900 || dt.getTime() > now.getTime()) return "생년월일을 다시 확인해 주세요.";
  if (time !== null && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return "출생시간을 다시 확인해 주세요.";
  return null;
}

/** 30일 규칙: 마지막으로 바꾼 시각에서 30일 뒤(처음 만든 아이디는 바꾼 적이 없어 바로 바꿀 수 있다). */
export const HANDLE_COOLDOWN_DAYS = 30;
export function handleChangeAllowedAt(changedAt: string | null): string | null {
  return changedAt ? new Date(Date.parse(changedAt) + HANDLE_COOLDOWN_DAYS * 86_400_000).toISOString() : null;
}
