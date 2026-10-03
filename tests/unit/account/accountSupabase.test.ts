import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { createAccountPort } from "../../../src/lib/account/supabase";

afterEach(() => vi.unstubAllEnvs());
const request = () => new NextRequest("https://gyeolreport.com/auth/start");
function config() {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test-project.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-test-anon-not-a-key");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "local-test-service-not-a-key");
}
describe("official Supabase SSR SDK contract, network forbidden", () => {
  it.each(["kakao", "google"] as const)("actual SDK %s supplies PKCE challenge and httpOnly verifier", async provider => {
    config(); const p = createAccountPort(request())!;
    const url = new URL((await p.start(provider, "https://gyeolreport.com/auth/callback?flow=test"))!);
    expect(url.origin).toBe("https://test-project.supabase.co"); expect(url.pathname).toBe("/auth/v1/authorize");
    expect(url.searchParams.get("provider")).toBe(provider); expect(url.searchParams.get("code_challenge_method")).toBe("s256");
    expect(url.searchParams.get("code_challenge")?.length).toBeGreaterThan(30);
    expect(url.searchParams.get("redirect_to")).toContain("/auth/callback");
    if (provider === "kakao") expect(url.searchParams.get("scopes")).toBe("profile_nickname");
    expect(url.href).not.toMatch(/friends|contacts|offline_access/);
    const cookies = p.finish(new NextResponse()).cookies.getAll();
    expect(cookies.some(c => c.name.endsWith("code-verifier") && c.httpOnly && c.secure && c.sameSite === "lax")).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
  it("missing configuration produces no client or provider calls", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ""); expect(createAccountPort(request())).toBeNull(); expect(global.fetch).not.toHaveBeenCalled();
  });
  it("no verified user means no service role persistence, even with caller-supplied identity", async () => {
    config(); const p = createAccountPort(request())!;
    expect(await p.currentUser()).toBeNull();
    const forged = { id: "forged", provider: "kakao" as const, displayName: "관리자" };
    expect(await p.consent(forged, "forged", "first_login")).toBe(false);
    expect(await p.read(forged)).toEqual({ profile: null, consents: [] });
    expect(global.fetch).not.toHaveBeenCalled();
  });
  it("expired access token refreshes, getUser overrides cookie identity, RPC binds verified id, logout clears cookies", async () => {
    config();
    const id = "11111111-1111-4111-8111-111111111111", expires = Math.floor(Date.now() / 1000);
    const verifiedUser = { id, aud: "authenticated", role: "authenticated", app_metadata: { provider: "google" }, user_metadata: {}, created_at: "2026-10-03T00:00:00Z" };
    const jwt = (exp: number) => `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp, role: "authenticated" })).toString("base64url")}.test-only-signature`;
    const oldSession = { access_token: jwt(expires - 120), refresh_token: "local-test-refresh", expires_at: expires - 120, token_type: "bearer", user: { ...verifiedUser, id: "cookie-forged", role: "service_role" } };
    const r = new NextRequest("https://gyeolreport.com/auth/session", { headers: { cookie: `sb-test-project-auth-token=base64-${Buffer.from(JSON.stringify(oldSession)).toString("base64url")}` } });
    let saved: Record<string, unknown> | undefined;
    const fetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/auth/v1/token?grant_type=refresh_token")) return Response.json({ access_token: jwt(expires + 3600), refresh_token: "local-test-rotated", expires_in: 3600, token_type: "bearer", user: verifiedUser });
      if (url.endsWith("/auth/v1/user")) return Response.json(verifiedUser);
      if (url.includes("/rest/v1/rpc/record_account_consent")) { saved = JSON.parse(String(init?.body)); return Response.json(true); }
      if (url.includes("/auth/v1/logout?scope=local")) return new Response(null, { status: 204 });
      return Response.json({ message: "Unexpected test request" }, { status: 500 });
    });
    vi.stubGlobal("fetch", fetch);
    const p = createAccountPort(r)!, u = (await p.currentUser())!;
    expect(u).toEqual({ id, provider: "google", displayName: "회원" });
    expect(await p.consent({ ...u, id: "forged-client-id" }, "x", "first_login")).toBe(false);
    expect(await p.consent(u, "22222222-2222-4222-8222-222222222222", "first_login")).toBe(true);
    expect(saved?.p_user_id).toBe(id); expect(saved?.p_records).toEqual(expect.arrayContaining([expect.objectContaining({ consent_type: "privacy", document_version: "2026-09-22.1", required: true })]));
    expect(fetch.mock.calls.some(([url]) => String(url).includes("grant_type=refresh_token"))).toBe(true);
    expect(p.finish(new NextResponse()).cookies.getAll().some(c => c.httpOnly && c.value)).toBe(true);
    expect(await p.logout()).toBe(true);
    expect(p.finish(new NextResponse()).cookies.getAll().some(c => c.maxAge === 0)).toBe(true);
    expect(await p.currentUser()).toBeNull();
  });
});
