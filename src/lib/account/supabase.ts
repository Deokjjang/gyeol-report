import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { ACCOUNT_POLICY_VERSIONS, safeDisplayName, type AccountIdentity, type AccountProvider, type ConsentRecord } from "./policy";
import type { AccountPort } from "./handler";
import { KAKAO_LOGIN_SCOPE, kakaoFacts } from "./kakaoLogin";

export function createAccountPort(request: NextRequest): AccountPort | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const pending: Array<{ name: string; value: string; options: CookieOptions }> = [];
  const auth = createServerClient(url, key, {
    cookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    cookies: { getAll: () => request.cookies.getAll(), setAll: values => { for (const cookie of values) { request.cookies.set(cookie.name, cookie.value); pending.push(cookie); } } },
  });
  // Constructed per request. Service-role access never goes into the browser.
  // Only a getUser-verified identity can reach this port's persistence methods.
  let verified: AccountIdentity | null = null;
  let providerToken: string | null = null;
  return {
    authorizationOrigin: new URL(url).origin,
    async currentUser() {
      const { data, error } = await auth.auth.getUser();
      if (error || !data.user) { verified = null; return null; }
      const provider = data.user.app_metadata.provider;
      if (provider !== "kakao" && provider !== "google") { verified = null; return null; }
      const kakao = data.user.identities?.find(i => i.provider === "kakao");
      // F: 지금 로그인한 제공자의 사용자 id(가입 이용권 지급 기록 해시용, 서버 메모리에만).
      const own = data.user.identities?.find(i => i.provider === provider);
      const providerUserId = own ? String(own.identity_data?.provider_id ?? own.identity_data?.sub ?? own.id ?? "") || null : null;
      verified = { id: data.user.id, provider: provider as AccountProvider, displayName: safeDisplayName(data.user.user_metadata.name ?? data.user.user_metadata.full_name ?? data.user.user_metadata.preferred_username),
        email: data.user.email ?? null, emailVerified: data.user.user_metadata.email_verified === true || Boolean(data.user.email_confirmed_at),
        kakaoId: kakao ? String(kakao.identity_data?.provider_id ?? kakao.identity_data?.sub ?? kakao.id ?? "") || null : null, lastSignInAt: data.user.last_sign_in_at ?? null, providerUserId };
      return verified;
    },
    async start(provider, callback, scope) {
      // `scopes` appends to GoTrue's Kakao defaults; provider `scope` replaces them.
      // 카카오 콘솔 동의 항목과 같은 셋만(없는 항목을 요청하면 로그인 오류): account_email(필수)·profile_nickname·plusfriends(선택).
      const { data, error } = await auth.auth.signInWithOAuth({ provider, options: { redirectTo: callback, skipBrowserRedirect: true, ...(provider === "kakao" ? { queryParams: { scope: scope ?? KAKAO_LOGIN_SCOPE } } : {}) } });
      return error ? null : data.url;
    },
    async exchange(code) { const { data, error } = await auth.auth.exchangeCodeForSession(code); providerToken = data.session?.provider_token ?? null; return !error; },
    async afterLogin(user, opts) {
      if (!verified || verified.id !== user.id) return { askEmail: false };
      const rpc = (p_action: string, p_data: Record<string, unknown>) => createSupabaseServerClient().rpc("ops_account", { p_action, p_user: verified!.id, p_data });
      if (user.provider === "google") { await rpc("facts", { provider: "google", email: user.email ?? null, emailTrusted: Boolean(user.email && user.emailVerified) }); return { askEmail: false }; }
      const prior = await rpc("facts_read", {});
      const before = (prior.data as { facts?: { emailAskedAt?: string | null; emailDeclinedAt?: string | null } } | null)?.facts ?? null;
      const facts = await kakaoFacts(providerToken, process.env.KAKAO_CHANNEL_PUBLIC_ID ?? process.env.NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID);
      const askEmail = !opts.emailRetry && !opts.contact && !facts.email && facts.needsAgreement && !before?.emailAskedAt && !before?.emailDeclinedAt;
      // 거부(추가 동의 뒤에도 없음)거나 유효·인증되지 않은 이메일이면 거부 시각을 남기고 다시 묻지 않는다.
      const declined = opts.emailRetry ? !facts.trusted : Boolean(facts.email && !facts.trusted);
      await rpc("facts", { provider: "kakao", email: facts.email, emailTrusted: facts.trusted, ...(facts.channel !== undefined ? { channel: facts.channel } : {}), emailAsked: askEmail, emailDeclined: declined });
      return { askEmail };
    },
    async logout() { const { error } = await auth.auth.signOut({ scope: "local" }); verified = null; return !error; },
    async read(user) {
      if (!verified || verified.id !== user.id) return { profile: null, consents: [] };
      const db = createSupabaseServerClient();
      const [profile, events, contact] = await Promise.all([
        db.from("account_profiles").select("user_id,display_name,provider").eq("user_id", verified.id).maybeSingle(),
        db.from("account_consent_events").select("consent_type,document_version,is_agreed,required,recorded_at").eq("user_id", verified.id).order("id", { ascending: false }),
        db.from("account_contacts").select("full_name,email,upgrade_state").eq("user_id", verified.id).maybeSingle(),
      ]);
      if (profile.error || events.error) return null;
      // 가입 정보 표가 아직 없는 DB(migration 전)면 contact를 모른다(undefined) → 막지 않는다.
      const known = !contact.error;
      return { profile: profile.data ? { id: profile.data.user_id, displayName: profile.data.display_name, provider: profile.data.provider } : null, consents: (events.data ?? []) as ConsentRecord[],
        ...(known ? { contact: contact.data ? { name: contact.data.full_name, email: contact.data.email, upgradeState: contact.data.upgrade_state } : null } : {}) };
    },
    async consent(user, requestId, source) {
      if (!verified || verified.id !== user.id) return false;
      const { data, error } = await createSupabaseServerClient().rpc("record_account_consent", {
        p_user_id: verified.id, p_request_id: requestId, p_display_name: verified.displayName, p_provider: verified.provider, p_source: source,
        p_records: Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })),
      });
      return !error && data === true;
    },
    finish(response) { for (const c of pending) response.cookies.set(c.name, c.value, c.options); return response; },
  };
}
