import { CHECKOUT_POLICY_VERSIONS } from "../legal/policyVersions";

export const ACCOUNT_POLICY_VERSIONS = { terms: CHECKOUT_POLICY_VERSIONS.terms, privacy: CHECKOUT_POLICY_VERSIONS.privacy } as const;
export const ACCOUNT_PROVIDERS = ["kakao", "google"] as const;
export type AccountProvider = typeof ACCOUNT_PROVIDERS[number];
export type ConsentRecord = { consent_type: "terms" | "privacy" | "marketing"; document_version: string; is_agreed: boolean; required: boolean; recorded_at: string };
export type AccountIdentity = { id: string; displayName: string; provider: AccountProvider; createdAt?: string };
export type AccountSnapshot = { profile: AccountIdentity | null; consents: ConsentRecord[] };
export type AccountSession = { status: "guest" | "needs_consent" | "member"; displayName?: string };
export const GUEST_SESSION: AccountSession = { status: "guest" };

// Records arrive newest first (DB monotonic id, not a client timestamp).
export function needsRequiredReconsent(records: readonly ConsentRecord[]): boolean {
  return (Object.keys(ACCOUNT_POLICY_VERSIONS) as Array<keyof typeof ACCOUNT_POLICY_VERSIONS>).some(type => {
    const latest = records.find(r => r.consent_type === type);
    return !latest?.is_agreed || !latest.required || latest.document_version !== ACCOUNT_POLICY_VERSIONS[type];
  });
}
export function accountSession(identity: AccountIdentity | null, snapshot?: AccountSnapshot): AccountSession {
  if (!identity) return GUEST_SESSION;
  return { status: !snapshot?.profile || needsRequiredReconsent(snapshot.consents) ? "needs_consent" : "member", displayName: snapshot?.profile?.displayName ?? identity.displayName };
}
export function safeAccountNext(value: unknown, local = false): string {
  const fallback = local ? "/dev/account" : "/account";
  if (typeof value !== "string") return fallback;
  const allowed = local ? ["/dev/account", "/dev/book-flow", "/dev/book-flow/input"] : ["/account", "/", "/report/new"];
  const report = local ? /^\/dev\/book-flow\/report\/(?:book-local-[a-f0-9-]{36}|report_[a-z0-9_-]{13,80})$/i : /^\/reports\/report_[a-z0-9_-]{13,80}$/i;
  if (report.test(value)) return value;
  return allowed.includes(value) ? value : fallback;
}
export function safeDisplayName(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, 40) || "회원" : "회원";
}
export function validConsentSubmission(body: unknown): body is { requestId: string; terms: true; privacy: true; versions: typeof ACCOUNT_POLICY_VERSIONS } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const b = body as Record<string, unknown>, v = b.versions as Record<string, unknown> | undefined;
  return Object.keys(b).every(k => ["requestId", "terms", "privacy", "versions"].includes(k))
    && typeof b.requestId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.requestId)
    && b.terms === true && b.privacy === true && !!v && Object.keys(v).length === 2
    && v.terms === ACCOUNT_POLICY_VERSIONS.terms && v.privacy === ACCOUNT_POLICY_VERSIONS.privacy;
}

// Presentation only: purchase assertions and their server validator stay intact.
// This never approves a checkbox. A member must still accept purchase/refund terms.
export function purchasePolicyLabel(session: AccountSession): string {
  return session.status === "member" ? "환불정책 동의" : "이용약관·개인정보·환불정책 동의";
}
