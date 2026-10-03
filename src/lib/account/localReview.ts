import "server-only";
import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import type { AccountPort } from "./handler";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity, type AccountSnapshot } from "./policy";

// Dev-only opaque sessions. These never reach or impersonate Supabase users.
type State = { sessions: Map<string, { user: AccountIdentity; expires: number }>; codes: Map<string, { user: AccountIdentity; expires: number }>; accounts: Map<string, AccountSnapshot>; requests: Set<string> };
const root = globalThis as typeof globalThis & { __gyeolAccountReview?: State };
function state() { return root.__gyeolAccountReview ??= { sessions: new Map(), codes: new Map(), accounts: new Map(), requests: new Set() }; }
const COOKIE = "gyeol-local-account";
export function createLocalAccountPort(request: NextRequest): AccountPort | null {
  if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") return null;
  const db = state(), now = Date.now(), url = new URL(request.url);
  if (request.headers.get("host")) url.host = request.headers.get("host")!;
  for (const map of [db.codes, db.sessions]) for (const [key, value] of map) if (value.expires <= now) map.delete(key);
  if (db.accounts.size > 128) { db.accounts.clear(); db.requests.clear(); }
  let token = request.cookies.get(COOKIE)?.value ?? "", changed = false;
  let verified: AccountIdentity | null = null;
  return {
    authorizationOrigin: url.origin,
    async currentUser() { const found = db.sessions.get(token); verified = found && found.expires > Date.now() ? found.user : null; return verified; },
    async start(provider, callback) {
      if (db.codes.size >= 128) return null;
      // Stable provider fixtures test repeat login without merging by email.
      const user = { id: `local-${provider}`, provider, displayName: provider === "kakao" ? "검수 회원" : "회원" };
      const code = randomBytes(32).toString("hex"); db.codes.set(code, { user, expires: now + 600_000 });
      const target = new URL(callback); target.searchParams.set("code", code); return target.href;
    },
    async exchange(code) {
      const pending = db.codes.get(code); db.codes.delete(code);
      if (!pending || pending.expires <= Date.now() || db.sessions.size >= 128) return false;
      if (token) db.sessions.delete(token);
      token = randomBytes(32).toString("hex"); changed = true;
      db.sessions.set(token, { user: pending.user, expires: now + 3_600_000 }); return true;
    },
    async logout() { db.sessions.delete(token); token = ""; verified = null; changed = true; return true; },
    async read(user) { return verified?.id === user.id ? structuredClone(db.accounts.get(user.id) ?? { profile: null, consents: [] }) : { profile: null, consents: [] }; },
    async consent(user, requestId) {
      if (verified?.id !== user.id) return false;
      const key = `${user.id}:${requestId}`; if (db.requests.has(key)) return true;
      if (db.requests.size >= 1024) return false;
      db.requests.add(key);
      const previous = db.accounts.get(user.id);
      db.accounts.set(user.id, { profile: user, consents: [...Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: new Date().toISOString() })), ...(previous?.consents ?? [])] });
      return true;
    },
    finish(response) { if (changed) response.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: token ? 3600 : 0 }); return response; },
  };
}
