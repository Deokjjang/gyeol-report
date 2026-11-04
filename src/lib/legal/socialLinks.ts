/**
 * 푸터 소셜 링크·고객 문의 주소(P6e-ops 9). 주소는 이 파일 한 곳에서 고친다.
 * X·스레드 주소가 빈 문자열이면 푸터에서 그 아이콘이 보이지 않는다(링크 없는 아이콘을 두지 않는다).
 */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gyeolreport/",
  /** 아직 계정 주소가 없으면 빈 문자열 — 아이콘이 숨겨진다. 예: "https://x.com/계정" */
  x: "",
  /** 예: "https://www.threads.com/@계정" */
  threads: "",
} as const;
export const SUPPORT_CHAT_URL = "http://pf.kakao.com/_sbHaX/chat";

/** https 주소만 허용(비어 있거나 다른 형식이면 null → 아이콘 숨김). */
export function safeSocialUrl(value: string): string | null {
  try { const u = new URL(value); return u.protocol === "https:" && u.hostname ? u.toString() : null; } catch { return null; }
}
