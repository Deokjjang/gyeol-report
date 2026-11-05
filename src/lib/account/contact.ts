/** 가입 정보·결제 구매자 입력 검사(화면·서버 공통, 브라우저에서도 쓴다). P6d-ops 2·3. */
/** 혜택 알림(마케팅) 수신 동의(선택). 문구를 바꾸면 버전을 올린다 — 동의·철회 기록(account_consent_events)에 그때 버전과 일시가 남는다. 2026-11-05.1: "혜택 알림 받기"(최종3). */
export const MARKETING_CONSENT_VERSION = "2026-11-05.1";
export const MARKETING_CONSENT_LABEL = "[선택] 혜택 알림 받기 — 새 책·이벤트·할인 소식을 이메일·문자·카카오톡으로 보내 드려요. 언제든 끌 수 있어요.";
export const PROFILE_REQUIRED_CODE = "PROFILE_REQUIRED";
export const PROFILE_REQUIRED_MESSAGE = "결제와 이용권 사용 전에 가입 정보(이름·이메일)를 입력해 주세요.";
/** 법정 보관 기간: 전자상거래법(계약·청약철회, 대금 결제·재화 공급 기록 5년). */
export const ORDER_RETENTION_YEARS = 5;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export type ContactValue = { name: string; email: string; emailSource: "provider" | "typed"; phone: string | null; marketing: boolean };
export type ProviderFacts = { provider?: string; email?: string | null; emailTrusted?: boolean; kakaoChannel?: string | null; emailDeclinedAt?: string | null } | null;

export function normalizePhone(v: unknown): string | null | undefined {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") return undefined;
  const d = v.replace(/[\s-]/g, "");
  return /^01[016789]\d{7,8}$/.test(d) ? d : undefined;
}
export const normalizeEmail = (v: unknown) => typeof v === "string" ? v.trim().toLowerCase() : "";

/** 화면과 서버가 같이 쓰는 검사. 공급자 이메일(provider)은 서버의 확정 이메일과 같을 때만 받는다. */
export function validateContact(body: Record<string, unknown>, facts?: ProviderFacts): { ok: true; value: ContactValue } | { ok: false; field: string; message: string } {
  const name = typeof body.name === "string" ? body.name.replace(/[\u0000-\u001f\u007f<>]/g, "").trim() : "";
  if (!name || name.length > 40) return { ok: false, field: "name", message: "이름을 1~40자로 입력해 주세요." };
  const email = normalizeEmail(body.email);
  if (!email || email.length > 254 || !EMAIL.test(email)) return { ok: false, field: "email", message: "이메일 형식을 확인해 주세요." };
  const provider = body.emailSource === "provider";
  if (provider && !(facts?.emailTrusted && facts.email === email)) return { ok: false, field: "email", message: "이메일을 직접 입력해 주세요." };
  if (!provider && normalizeEmail(body.emailConfirm) !== email) return { ok: false, field: "emailConfirm", message: "두 번 입력한 이메일이 같지 않아요." };
  const phone = normalizePhone(body.phone);
  if (phone === undefined) return { ok: false, field: "phone", message: "휴대폰 번호는 010-1234-5678 형식으로 입력해 주세요(선택)." };
  return { ok: true, value: { name, email, emailSource: provider ? "provider" : "typed", phone, marketing: body.marketing === true } };
}

