import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { ACCOUNT_POLICY_VERSIONS, safeDisplayName, type AccountIdentity, type AccountProvider, type ConsentRecord } from "./policy";
import type { AccountPort } from "./handler";

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
  return {
    authorizationOrigin: new URL(url).origin,
    async currentUser() {
      const { data, error } = await auth.auth.getUser();
      if (error || !data.user) { verified = null; return null; }
      const provider = data.user.app_metadata.provider;
      if (provider !== "kakao" && provider !== "google") { verified = null; return null; }
      verified = { id: data.user.id, provider: provider as AccountProvider, displayName: safeDisplayName(data.user.user_metadata.name ?? data.user.user_metadata.full_name ?? data.user.user_metadata.preferred_username) };
      return verified;
    },
    async start(provider, callback) {
      const { data, error } = await auth.auth.signInWithOAuth({ provider, options: { redirectTo: callback, skipBrowserRedirect: true, ...(provider === "kakao" ? { scopes: "profile_nickname" } : {}) } });
      return error ? null : data.url;
    },
    async exchange(code) { const { error } = await auth.auth.exchangeCodeForSession(code); return !error; },
    async logout() { const { error } = await auth.auth.signOut({ scope: "local" }); verified = null; return !error; },
    async read(user) {
      if (!verified || verified.id !== user.id) return { profile: null, consents: [] };
      const db = createSupabaseServerClient();
      const [profile, events] = await Promise.all([
        db.from("account_profiles").select("user_id,display_name,provider").eq("user_id", verified.id).maybeSingle(),
        db.from("account_consent_events").select("consent_type,document_version,is_agreed,required,recorded_at").eq("user_id", verified.id).order("id", { ascending: false }),
      ]);
      if (profile.error || events.error) return null;
      return { profile: profile.data ? { id: profile.data.user_id, displayName: profile.data.display_name, provider: profile.data.provider } : null, consents: (events.data ?? []) as ConsentRecord[] };
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
