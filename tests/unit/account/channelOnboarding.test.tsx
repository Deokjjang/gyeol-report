import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { channelOnboarding } from "../../../src/lib/account/channelOnboarding";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity } from "../../../src/lib/account/policy";
import { channelPreferenceKey, channelPromptDismissed, rememberChannelPrompt, requestKakaoChannel } from "../../../src/lib/account/channelPromptBrowser";
import type { KakaoSdk } from "../../../src/lib/sharing/shareBrowser";

const user: AccountIdentity = { id: "server-verified-kakao-a", provider: "kakao", displayName: "회원" };
const records = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, required: true, is_agreed: true, recorded_at: "2026-10-11T00:00:00Z" }));
function configured() { vi.stubEnv("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY", "local-mock-only"); vi.stubEnv("NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID", "_LocalOnly"); }
function port(identity: AccountIdentity | null = user, agreed = true): AccountPort {
  return { currentUser: vi.fn(async () => identity), read: vi.fn(async () => ({ profile: agreed ? identity : null, consents: agreed ? records : [] })), start: vi.fn(), exchange: vi.fn(), logout: vi.fn(), consent: vi.fn(), authorizationOrigin: "https://gyeolreport.com", finish: r => r };
}
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("verified Kakao channel presentation", () => {
  it("verified member receives an opaque browser preference scope, not identity or token", async () => {
    configured(); const p = port();
    const response = await handleAccount(new NextRequest("https://gyeolreport.com/auth/session?provider=google"), "session", p);
    const body = await response.json();
    expect(body.channelPrompt).toEqual({ scope: expect.stringMatching(/^[a-f0-9]{64}$/), channelPublicId: "_LocalOnly" });
    expect(JSON.stringify(body)).not.toContain(user.id); expect(JSON.stringify(body)).not.toMatch(/token|email/);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(p.consent).not.toHaveBeenCalled(); expect(p.start).not.toHaveBeenCalled();
  });
  it.each([null, { ...user, provider: "google" as const }])("guest/Google cannot opt in via client provider hints", async identity => {
    configured(); const r = await handleAccount(new NextRequest("https://gyeolreport.com/auth/session?provider=kakao", { headers: { cookie: "provider=kakao" } }), "session", port(identity));
    expect((await r.json()).channelPrompt).toBeUndefined();
  });
  it("new Kakao account waits for required consent; existing member eligible", async () => {
    configured(); const r = await handleAccount(new NextRequest("https://gyeolreport.com/auth/session"), "session", port(user, false));
    expect(await r.json()).toEqual({ status: "needs_consent", displayName: "회원" });
    expect(channelOnboarding(user, { status: "member" })).toBeDefined();
  });
  it.each(["", "gyeolreport", "https://pf.kakao.com/_Unknown", "_x/evil", "_foo?x=1"])("invalid/unconfirmed public ID %s fails closed", value => {
    configured(); vi.stubEnv("NEXT_PUBLIC_KAKAO_CHANNEL_PUBLIC_ID", value);
    expect(channelOnboarding(user, { status: "member" })).toBeUndefined();
  });
  it("missing JS key fails closed without changing auth", () => {
    configured(); vi.stubEnv("NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY", "");
    expect(channelOnboarding(user, { status: "member" })).toBeUndefined();
  });
  it("stable scope distinguishes two Kakao accounts", () => {
    configured(); const a = channelOnboarding(user, { status: "member" })!;
    expect(a.scope).toBe(channelOnboarding(user, { status: "member" })!.scope);
    expect(a.scope).not.toBe(channelOnboarding({ ...user, id: "server-verified-kakao-b" }, { status: "member" })!.scope);
  });
});

describe("optional local preference and gesture-only SDK", () => {
  it.each(["later", "add_clicked"] as const)("%s suppresses only this account and survives reload reads", choice => {
    const saved = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (k: string) => saved.get(k) ?? null, setItem: (k: string, v: string) => saved.set(k, v) });
    const a = `a-${choice}`, b = `b-${choice}`;
    expect(channelPromptDismissed(a)).toBe(false); rememberChannelPrompt(a, choice);
    expect(channelPromptDismissed(a)).toBe(true); expect(channelPromptDismissed(b)).toBe(false);
    expect(saved.get(channelPreferenceKey(a))).toBe(choice);
    saved.set(channelPreferenceKey("reload"), choice); expect(channelPromptDismissed("reload")).toBe(true);
  });
  it("blocked storage never blocks login, with per-tab fallback", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw Error("blocked"); }, setItem: () => { throw Error("blocked"); } });
    expect(channelPromptDismissed("storage-denied")).toBe(false);
    rememberChannelPrompt("storage-denied", "later"); expect(channelPromptDismissed("storage-denied")).toBe(true);
  });
  it.each(["requested", "blocked", "failed"])("SDK %s preserves window.open and never claims friendship", outcome => {
    const original = vi.fn(() => outcome === "blocked" ? null : {} as Window), browser = { open: original };
    const sdk = { isInitialized: () => true, init: vi.fn(), Share: { sendDefault: vi.fn() }, Channel: { addChannel: vi.fn(() => { if (outcome === "failed") throw Error("SDK error"); browser.open(); }) } } satisfies KakaoSdk;
    expect(sdk.Channel.addChannel).not.toHaveBeenCalled();
    expect(requestKakaoChannel(sdk, "_LocalOnly", browser)).toBe(outcome);
    expect(browser.open).toBe(original); expect(sdk.Channel.addChannel).toHaveBeenCalledExactlyOnceWith({ channelPublicId: "_LocalOnly" });
    expect(sdk.Share.sendDefault).not.toHaveBeenCalled();
  });
  it("missing/uninitialized SDK doesn't invoke Channel", () => {
    const browser = { open: vi.fn() };
    expect(requestKakaoChannel(undefined, "_LocalOnly", browser)).toBe("unavailable");
    const sdk = { init: vi.fn(), isInitialized: () => false, Share: { sendDefault: vi.fn() }, Channel: { addChannel: vi.fn() } };
    expect(requestKakaoChannel(sdk, "_LocalOnly", browser)).toBe("unavailable");
    expect(requestKakaoChannel({ ...sdk, isInitialized: () => { throw Error("broken init"); } }, "_LocalOnly", browser)).toBe("failed");
    expect(sdk.Channel.addChannel).not.toHaveBeenCalled();
    expect(browser.open).not.toHaveBeenCalled();
  });
  it("mobile void response is a request, never added/success", () => {
    const sdk = { init: vi.fn(), isInitialized: () => true, Share: { sendDefault: vi.fn() }, Channel: { addChannel: vi.fn() } };
    expect(requestKakaoChannel(sdk, "_LocalOnly", { open: vi.fn() })).toBe("requested");
  });
});

describe("integration and canonical book assets", () => {
  it("accessible optional dialog; same SDK identity as share; no token or reward calls", async () => {
    configured(); const { KakaoChannelPrompt } = await import("../../../src/components/account/KakaoChannelPrompt");
    const session = { status: "member" as const, channelPrompt: channelOnboarding(user, { status: "member" }) };
    const html = renderToStaticMarkup(<KakaoChannelPrompt session={session} local />);
    expect(html).toContain('role="dialog"'); expect(html).toContain('aria-modal="true"'); expect(html).toContain("나중에"); expect(html).not.toContain(" open=");
    expect(renderToStaticMarkup(<KakaoChannelPrompt session={session} enabled={false} />)).toBe("");
    expect(renderToStaticMarkup(<KakaoChannelPrompt session={{ ...session, status: "guest" }} />)).toBe("");
    const code = readFileSync("src/components/account/KakaoChannelPrompt.tsx", "utf8");
    for (const file of ["BookShareActions", "../report/ReportShareActions"]) {
      const share = readFileSync(`src/components/book/${file}.tsx`, "utf8");
      for (const pattern of [/id="(gyeol-kakao-sdk)"/, /src="(https:\/\/t1\.kakaocdn\.net[^\"]+)"/, /integrity="([^\"]+)"/]) expect(code.match(pattern)?.[1]).toBe(share.match(pattern)?.[1]);
    }
    expect(code).not.toMatch(/setAccessToken|followChannel|fetch\(|interaction\(|reward|채널 추가 완료/);
    expect(readFileSync("src/components/book/BookInput.tsx", "utf8")).toContain("ready && !receipt && !publishing && !checking");
    for (const file of ["src/components/book/BookCheckout.tsx", "src/components/book/useTicketPublication.ts"]) expect(readFileSync(file, "utf8")).not.toContain("ChannelPrompt");
  });
  it("ICO 16/32/48/64 and apple180 are exact derivatives of canonical SVG", async () => {
    const require = createRequire(resolve("package.json")); const sharp = createRequire(require.resolve("next/package.json"))("sharp");
    const svg = readFileSync("src/app/icon.svg"), ico = readFileSync("src/app/favicon.ico");
    expect(svg.toString()).not.toMatch(/ellipse|circle|gradient/i); expect(svg.toString()).toContain('viewBox="0 0 96 96"');
    expect(ico.readUInt16LE(2)).toBe(1); expect(ico.readUInt16LE(4)).toBe(4);
    for (const [i, size] of [16, 32, 48, 64].entries()) {
      const entry = 6 + i * 16, offset = ico.readUInt32LE(entry + 12), length = ico.readUInt32LE(entry + 8);
      expect(ico[entry]).toBe(size); expect(ico[entry + 1]).toBe(size);
      expect(ico.subarray(offset, offset + length)).toEqual(await sharp(svg).resize(size, size).png().toBuffer());
    }
    expect(readFileSync("src/app/apple-icon.png")).toEqual(await sharp(svg).resize(180, 180).png().toBuffer());
    expect(readFileSync("src/app/layout.tsx", "utf8")).not.toMatch(/icons\s*:/);
  });
});
