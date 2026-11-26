/** 「남이 본 나」 화면 ↔ 서버(/api/mirror/*) 주고받기. 화면은 표를 직접 읽지 않는다. */
import type { Choice } from "../../lib/mirror/engine";
import type { HomeView } from "../../lib/mirror/home";

export type ProfileView = { name: string; handle: string; isPublic: boolean; birthDate: string | null; birthTime: string | null; handleChangeAllowedAt: string | null };
export type SessionView =
  | { account: "guest" }
  | { account: "needs_consent" | "member"; provider: "kakao" | "google"; policy: { terms: string; privacy: string }; prefillName?: string; profile: ProfileView | null; self: { answers: Record<string, Choice>; completedAt: string | null; seed: string }; home: HomeView | null };
export type ApiError = { code?: string; error?: string };

export async function mirrorApi<T>(action: string, init: { method?: "GET" | "POST"; body?: unknown; query?: string } = {}): Promise<{ ok: true; data: T } | { ok: false; status: number; data: ApiError }> {
  try {
    const r = await fetch(`/api/mirror/${action}${init.query ?? ""}`, {
      method: init.method ?? "GET", cache: "no-store",
      ...(init.method === "POST" ? { headers: { "content-type": "application/json" }, body: JSON.stringify(init.body ?? {}) } : {}),
    });
    const data = await r.json().catch(() => ({}));
    return r.ok ? { ok: true, data: data as T } : { ok: false, status: r.status, data: data as ApiError };
  } catch { return { ok: false, status: 0, data: { error: "연결이 끊겼어요. 다시 시도해 주세요." } }; }
}

/** 클립보드: 보안 출처가 아니면(같은 Wi-Fi 개발 서버 등) 옛 방식으로. */
export async function copyText(text: string): Promise<boolean> {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch { /* 아래로 */ }
  try {
    const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok;
  } catch { return false; }
}

/** 내 링크 주소: 운영은 gyeolreport.com, 로컬은 지금 주소. */
export const myLink = (handle: string): string => `${location.hostname.endsWith("gyeolreport.com") ? "https://gyeolreport.com" : location.origin}/@${handle}`;
export const displayLink = (handle: string): string => `gyeolreport.com/@${handle}`;
