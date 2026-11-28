// 「남이 본 나」 로컬 시험 모드(pnpm mirror:trial): 세 조건(시험 변수 · 로컬 Supabase · Vercel 아님)이 모두 맞을 때만 켜지고, 운영 · Vercel · 하나라도 빠지면 꺼진다.
// 켜졌을 때 더 받는 것은 터널 주소 한 개뿐이고, 꺼져 있으면 기존 출처 검사 결과가 그대로다.
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mirrorTrialMode, mirrorTrialOrigin, onTrialHost } from "../../../src/lib/mirror/trial";
import { mirrorRootEnabled, mirrorRoutesEnabled } from "../../../src/lib/mirror/gate";
import { isPublicSameOrigin, publicRequestOrigin } from "../../../src/lib/account/origin";
import { opsOriginAllowed, opsSameOrigin } from "../../../src/lib/ops/origin";
import { proxy } from "../../../src/proxy";

const LOCAL = "http://127.0.0.1:54321", PROD = "https://abcdefgh.supabase.co", TUNNEL = "https://quiet-river-1234.trycloudflare.com";
const ON = { MIRROR_LOCAL_TRIAL: "1", NEXT_PUBLIC_SUPABASE_URL: LOCAL, MIRROR_TRIAL_ORIGIN: TUNNEL, NODE_ENV: "production" };
afterEach(() => { vi.unstubAllEnvs(); });
const stub = (env: Record<string, string | undefined>) => { for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v); };
// next start 뒤(Caddy → next): request.url은 묶인 주소, Host는 터널 주소.
const tunnelReq = (origin: string | null = TUNNEL, host = new URL(TUNNEL).host, method = "POST") =>
  new NextRequest("http://localhost:3460/api/account/x", { method, headers: { host, ...(origin ? { origin } : {}) }, ...(method === "POST" ? { body: "{}" } : {}) });

describe("시험 모드는 세 조건이 모두 맞을 때만", () => {
  it("셋 다 맞으면 켜진다(로컬 next start · next dev 모두)", () => {
    expect(mirrorTrialMode(ON)).toBe(true);
    expect(mirrorTrialMode({ ...ON, NODE_ENV: "development", NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321/" })).toBe(true);
  });
  it("하나라도 빠지면 꺼진다", () => {
    for (const env of [
      { ...ON, MIRROR_LOCAL_TRIAL: undefined }, { ...ON, MIRROR_LOCAL_TRIAL: "true" }, { ...ON, MIRROR_LOCAL_TRIAL: "0" }, { ...ON, MIRROR_LOCAL_TRIAL: "" },
      { ...ON, NEXT_PUBLIC_SUPABASE_URL: undefined }, { ...ON, NEXT_PUBLIC_SUPABASE_URL: PROD }, { ...ON, NEXT_PUBLIC_SUPABASE_URL: "http://192.168.0.5:54321" },
      { ...ON, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1.evil.example:54321" }, { ...ON, NEXT_PUBLIC_SUPABASE_URL: "https://localhost:54321" },
      { ...ON, VERCEL: "1" }, { ...ON, VERCEL: "" }, { ...ON, VERCEL_ENV: "preview" },
    ]) expect(mirrorTrialMode(env)).toBe(false);
  });
  it("운영(Vercel Production · Preview)은 어떤 값을 넣어도 꺼진다 — 관문 · 출처 · 검수 로그인 모두", async () => {
    for (const vercel of [{ VERCEL: "1", VERCEL_ENV: "production" }, { VERCEL: "1", VERCEL_ENV: "preview" }]) for (const supabase of [PROD, LOCAL]) {
      stub({ ...ON, ...vercel, NEXT_PUBLIC_SUPABASE_URL: supabase });
      expect(mirrorTrialMode()).toBe(false); expect(mirrorTrialOrigin()).toBeNull();
      expect([mirrorRoutesEnabled(), mirrorRootEnabled()]).toEqual([false, false]);
      expect(publicRequestOrigin(tunnelReq())).toBeNull(); expect(isPublicSameOrigin(tunnelReq())).toBe(false);
      expect(opsSameOrigin(tunnelReq())).toBe(false); expect(opsOriginAllowed(tunnelReq(null, undefined, "GET"))).toBe(false);
      expect(proxy(new NextRequest("https://gyeolreport.com/dev/v5-login")).status).toBe(404);
      vi.unstubAllEnvs();
    }
  });
  it("터널 주소는 trycloudflare 빠른 터널 꼴 하나만", () => {
    expect(mirrorTrialOrigin(ON)).toBe(TUNNEL);
    for (const o of ["http://quiet-river-1234.trycloudflare.com", "https://a.b.trycloudflare.com", "https://evil.example", `${TUNNEL}/`, "https://trycloudflare.com", ""]) expect(mirrorTrialOrigin({ ...ON, MIRROR_TRIAL_ORIGIN: o })).toBeNull();
    expect([onTrialHost("quiet-river-1234.trycloudflare.com"), onTrialHost("gyeolreport.com"), onTrialHost("localhost")]).toEqual([true, false, false]);
  });
});

describe("켜졌을 때 더 받는 것: 터널 주소 한 개", () => {
  it("관문 둘이 열리고, /dev 아래는 검수 로그인만 열린다", () => {
    stub(ON);
    expect([mirrorRoutesEnabled(), mirrorRootEnabled()]).toEqual([true, true]);
    expect(proxy(new NextRequest(`${TUNNEL}/dev/v5-login?as=new`)).status).toBe(200);
    for (const p of ["/dev/book-preview", "/dev/account/api/x", "/dev", "/dev/v5-login/x"]) expect(proxy(new NextRequest(`${TUNNEL}${p}`)).status).toBe(404);
  });
  it("터널 Host + 같은 Origin만 통과 — 다른 Origin · 다른 Host · Origin 없음은 막힌다", () => {
    stub(ON);
    expect(publicRequestOrigin(tunnelReq())).toBe(TUNNEL);
    expect([isPublicSameOrigin(tunnelReq()), opsSameOrigin(tunnelReq()), opsOriginAllowed(tunnelReq(null, undefined, "GET"))]).toEqual([true, true, true]);
    for (const r of [tunnelReq("https://evil.example"), tunnelReq(null), tunnelReq(TUNNEL, "other-1.trycloudflare.com"), tunnelReq(TUNNEL, "localhost:3460")]) {
      expect(isPublicSameOrigin(r)).toBe(false); expect(opsSameOrigin(r)).toBe(false);
    }
    expect(opsOriginAllowed(tunnelReq(null, "other-1.trycloudflare.com", "GET"))).toBe(false);
  });
});

describe("꺼져 있으면 기존 출처 검사 결과 그대로", () => {
  it("운영 도메인 · localhost 판정이 바뀌지 않는다", () => {
    stub({ NODE_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: LOCAL, MIRROR_TRIAL_ORIGIN: TUNNEL });
    const req = (base: string, origin: string | null = base) => new NextRequest(`${base}/api/x`, { method: "POST", headers: origin ? { origin } : {}, body: "{}" });
    expect([isPublicSameOrigin(req("https://gyeolreport.com")), isPublicSameOrigin(req("https://www.gyeolreport.com"))]).toEqual([true, true]);
    for (const r of [req("http://localhost:3460"), req("https://gyeolreport.com", "https://evil.example"), tunnelReq()]) expect(isPublicSameOrigin(r)).toBe(false);
    expect(publicRequestOrigin(tunnelReq())).toBeNull();
    expect(proxy(new NextRequest("http://localhost:3460/dev/v5-login")).status).toBe(404);
  });
});
