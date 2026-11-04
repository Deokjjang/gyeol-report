/**
 * 카카오 로그인 뒤 사실 확인(P6d-ops 2). 로그인 콜백에서 Supabase가 준 provider_token으로만 부른다(토큰은 저장하지 않는다).
 * - 이메일: kakao_account.email, is_email_valid·is_email_verified가 모두 참일 때만 확정(trusted).
 * - 채널: 결리포트 채널(@gyeolreport) 관계 ADDED·BLOCKED·NONE. 토큰 없음 → undefined(이전 값 유지), plusfriends 동의 거부·조회 실패 → null(미확인).
 */
export const KAKAO_LOGIN_SCOPE = "account_email,profile_nickname,plusfriends";
export const KAKAO_EMAIL_SCOPE = "account_email";
export type KakaoFacts = { email: string | null; trusted: boolean; needsAgreement: boolean; channel: "added" | "blocked" | "none" | null | undefined };
const TIMEOUT_MS = 3_000;

async function get(url: string, token: string, fetchImpl: typeof fetch): Promise<{ status: number; body: Record<string, unknown> | null }> {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  try {
    const r = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", redirect: "error", signal: abort.signal });
    let body: Record<string, unknown> | null = null; try { body = await r.json() as Record<string, unknown>; } catch { /* 본문 없음 */ }
    return { status: r.status, body };
  } catch { return { status: 0, body: null }; }
  finally { clearTimeout(timer); }
}

export async function kakaoFacts(token: string | null, channelPublicId: string | undefined, fetchImpl: typeof fetch = fetch): Promise<KakaoFacts> {
  if (!token) return { email: null, trusted: false, needsAgreement: false, channel: undefined };
  const [me, ch] = await Promise.all([
    get("https://kapi.kakao.com/v2/user/me?property_keys=%5B%22kakao_account.email%22%5D", token, fetchImpl),
    channelPublicId ? get("https://kapi.kakao.com/v2/api/talk/channels", token, fetchImpl) : Promise.resolve(null),
  ]);
  const account = (me.status === 200 && me.body && typeof me.body.kakao_account === "object" ? me.body.kakao_account : null) as Record<string, unknown> | null;
  const raw = typeof account?.email === "string" ? account.email.trim().toLowerCase() : "";
  const email = raw && raw.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(raw) ? raw : null;
  const trusted = Boolean(email && account?.is_email_valid === true && account?.is_email_verified === true);
  let channel: KakaoFacts["channel"] = undefined;
  if (ch) {
    const list = ch.status === 200 && Array.isArray(ch.body?.channels) ? ch.body!.channels as { channel_public_id?: string; relation?: string }[] : null;
    const rel = list?.find(c => c.channel_public_id === channelPublicId)?.relation;
    channel = list === null ? null : rel === "ADDED" ? "added" : rel === "BLOCKED" ? "blocked" : "none";
  }
  return { email, trusted, needsAgreement: !email && account?.email_needs_agreement === true, channel };
}

/** 탈퇴: 앱 연결 끊기(어드민 키). 키가 없으면 하지 않고 skipped(수동 처리 목록). */
export async function kakaoUnlink(kakaoUserId: string | null, adminKey: string | undefined, fetchImpl: typeof fetch = fetch): Promise<"done" | "skipped" | "failed"> {
  if (!kakaoUserId || !/^\d{1,20}$/.test(kakaoUserId) || !adminKey) return "skipped";
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  try {
    const r = await fetchImpl("https://kapi.kakao.com/v1/user/unlink", { method: "POST", redirect: "error", signal: abort.signal,
      headers: { Authorization: `KakaoAK ${adminKey}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }, body: `target_id_type=user_id&target_id=${kakaoUserId}` });
    return r.ok ? "done" : "failed";
  } catch { return "failed"; }
  finally { clearTimeout(timer); }
}
