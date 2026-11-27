// 「남이 본 나」 주소 · 관문: /@아이디(마침표 포함) → /u/아이디, 배포 빌드에서는 새 화면 · API · "/" 전환이 모두 닫혀 있다.
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, mirrorHandleFromPath, proxy } from "../../../src/proxy";
import { mirrorPublicEnabled } from "../../../src/lib/mirror/gate";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";

afterEach(() => { vi.unstubAllEnvs(); });

describe("공개 관문", () => {
  it("로컬 개발(next dev)에서만 열린다", () => {
    vi.stubEnv("NODE_ENV", "development"); expect(mirrorPublicEnabled()).toBe(true);
    vi.stubEnv("NODE_ENV", "production"); expect(mirrorPublicEnabled()).toBe(false);
    vi.stubEnv("NODE_ENV", "test"); expect(mirrorPublicEnabled()).toBe(false);
  });
  it("관문은 요청 값 · 환경 변수로 열 수 없다(소스에 NODE_ENV 비교 하나뿐)", () => {
    const src = readFileSync("src/lib/mirror/gate.ts", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(src.match(/process\.env\.[A-Z_]+/g)).toEqual(["process.env.NODE_ENV"]);
  });
  it("API · 랜딩 · 홈은 관문 뒤에 있다", () => {
    expect(readFileSync("src/app/api/mirror/[action]/route.ts", "utf8")).toMatch(/if \(!mirrorPublicEnabled\(\)\) return new NextResponse\(null, \{ status: 404 \}\)/);
    expect(readFileSync("src/app/u/[handle]/page.tsx", "utf8")).toMatch(/if \(!mirrorPublicEnabled\(\)\) notFound\(\)/);
    // 명령 2: 링크 미리보기 이미지 · 탈퇴 연결도 관문 뒤
    expect(readFileSync("src/app/api/mirror/og/[handle]/route.tsx", "utf8")).toMatch(/if \(!mirrorPublicEnabled\(\)\) return new NextResponse\(null, \{ status: 404 \}\)/);
    expect(readFileSync("src/app/auth/[action]/route.ts", "utf8")).toMatch(/if \(!mirrorPublicEnabled\(\)\) return \{\};/);
    const home = readFileSync("src/app/page.tsx", "utf8");
    expect(home.indexOf("mirrorPublicEnabled()")).toBeGreaterThan(-1);
    expect(home.indexOf("mirrorPublicEnabled()")).toBeLessThan(home.indexOf("bookExperiencePublicEnabled()"));
  });
});

describe("/@아이디 주소", () => {
  it("아이디 규칙의 글자(마침표 · 밑줄 포함)만 잡는다", () => {
    expect(["/@minji.k", "/@seo_a.lee", "/@Minji.K", "/@abc"].map(mirrorHandleFromPath)).toEqual(["minji.k", "seo_a.lee", "Minji.K", "abc"]);
    expect(["/@ab", "/@minji/x", "/minji.k", "/@minji.k.png/", "/@" + "a".repeat(21), "/@한글"].map(mirrorHandleFromPath)).toEqual([null, null, null, null, null, null]);
  });
  it("개발: /@minji.k는 정적 파일이 아니라 /u/minji.k로 넘긴다 · 배포 빌드: 넘기지 않는다(그대로 404)", () => {
    expect(config.matcher).toContain("/@:handle([A-Za-z0-9._]{3,20})");
    vi.stubEnv("NODE_ENV", "development");
    const dev = proxy(new NextRequest("http://localhost:3100/@minji.k"));
    expect(dev.headers.get("x-middleware-rewrite")).toBe("http://localhost:3100/u/minji.k");
    vi.stubEnv("NODE_ENV", "production");
    const prod = proxy(new NextRequest("https://www.gyeolreport.com/@minji.k"));
    expect(prod.headers.get("x-middleware-rewrite")).toBeNull();
    expect(prod.headers.get("x-middleware-next")).toBe("1");
  });
});

describe("proxy matcher", () => {
  it("모든 matcher가 Next의 path-to-regexp로 컴파일된다(하나라도 실패하면 proxy 전체가 빠진다) · /@아이디만 잡는다", async () => {
    const { pathToRegexp } = await import("next/dist/compiled/path-to-regexp") as { pathToRegexp: (p: string, k: unknown[], o: object) => RegExp };
    const res = config.matcher.map(m => pathToRegexp(m, [], {}));
    const hits = (path: string) => res.some(r => r.test(path));
    expect(["/@minji.k", "/@seo_a.lee", "/@abc", "/dev/v5-login", "/dev"].every(hits)).toBe(true);
    expect(["/@ab", "/@minji/x", "/minji.k", "/", "/reports/x", "/api/mirror/session", "/u/minji.k"].some(hits)).toBe(false);
  });
});

describe("로그인 콜백 → 이 서비스", () => {
  const port = (): AccountPort => ({
    authorizationOrigin: "http://127.0.0.1:54321",
    currentUser: async () => ({ id: "u", provider: "kakao", displayName: "민지" }),
    // 동의는 했지만 가입 정보(이름 · 이메일)가 없는 회원 = 지금은 /account로 보낸다.
    read: async () => ({ profile: { id: "u", provider: "kakao", displayName: "민지" }, consents: Object.entries(ACCOUNT_POLICY_VERSIONS).map(([t, v]) => ({ consent_type: t as "terms", document_version: v, is_agreed: true, required: true, recorded_at: "x" })), contact: null }),
    exchange: async () => true, start: async () => null, logout: async () => true, consent: async () => true, finish: (r: NextResponse) => r,
  });
  const callback = (mirrorFlow?: (next: string) => boolean) => {
    const state = "a".repeat(64);
    const request = new NextRequest(`http://localhost:3100/auth/callback?flow=${state}&code=c`, { headers: { cookie: `gyeol-auth-flow=${encodeURIComponent(JSON.stringify({ state, next: "/", expires: Date.now() + 60_000 }))}` } });
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    return handleAccount(request, "callback", port(), false, mirrorFlow ? { mirrorFlow } : {});
  };
  it("관문이 닫혀 있으면(mirrorFlow 없음) 지금처럼 /account, 열려 있으면 \"/\"로 바로 돌아간다", async () => {
    expect(new URL((await callback()).headers.get("location")!).pathname).toBe("/account");
    expect(new URL((await callback(next => next === "/")).headers.get("location")!).pathname).toBe("/");
  });
});
