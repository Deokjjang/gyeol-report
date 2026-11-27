// 「남이 본 나」 주소 · 관문(명령 3: routes · root 두 개): /@아이디(마침표 포함) → /u/아이디, 배포 빌드에서는 상수로만 연다(지금은 둘 다 닫힘 — 배포 전 정지).
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, mirrorHandleFromPath, proxy } from "../../../src/proxy";
import { ACCOUNT_MOVED_TO_ME, MIRROR_ROOT_LIVE, MIRROR_ROUTES_LIVE, accountMovedToMe, mirrorAppPath, mirrorRootEnabled, mirrorRoutesEnabled } from "../../../src/lib/mirror/gate";
import { safeAccountNext } from "../../../src/lib/account/policy";
import { maskEmail, safeMirrorNext } from "../../../src/lib/mirror/api";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";

afterEach(() => { vi.unstubAllEnvs(); });

describe("공개 관문 두 개(routes · root)", () => {
  it("배포 전 정지: 두 배포 상수는 꺼져 있다(숨은 공개 · 정식 공개는 덕짱님 지시 뒤 상수 커밋으로만)", () => {
    expect(MIRROR_ROUTES_LIVE).toBe(false);
    expect(MIRROR_ROOT_LIVE).toBe(false);
  });
  it("로컬 개발(next dev)에서는 둘 다 열리고, 배포 빌드 · 시험에서는 상수(꺼짐)를 따른다", () => {
    vi.stubEnv("NODE_ENV", "development"); expect([mirrorRoutesEnabled(), mirrorRootEnabled(), mirrorAppPath()]).toEqual([true, true, "/"]);
    vi.stubEnv("NODE_ENV", "production"); expect([mirrorRoutesEnabled(), mirrorRootEnabled(), mirrorAppPath()]).toEqual([false, false, "/start"]);
    vi.stubEnv("NODE_ENV", "test"); expect([mirrorRoutesEnabled(), mirrorRootEnabled()]).toEqual([false, false]);
  });
  it("root는 routes가 열려 있을 때만 · /account → /me는 대조 완료 + root가 열려 있을 때만", () => {
    const src = readFileSync("src/lib/mirror/gate.ts", "utf8");
    expect(src).toMatch(/return dev\(\) \|\| \(MIRROR_ROUTES_LIVE && MIRROR_ROOT_LIVE\);/);
    expect(src).toMatch(/ACCOUNT_MOVED_TO_ME && mirrorRootEnabled\(\)/);
    expect(ACCOUNT_MOVED_TO_ME).toBe(true);
    vi.stubEnv("NODE_ENV", "production"); expect(accountMovedToMe()).toBe(false);
    vi.stubEnv("NODE_ENV", "development"); expect(accountMovedToMe()).toBe(true);
  });
  it("관문은 요청 값 · 환경 변수로 열 수 없다(소스에 NODE_ENV 비교 하나뿐)", () => {
    const src = readFileSync("src/lib/mirror/gate.ts", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(src.match(/process\.env\.[A-Z_]+/g)).toEqual(["process.env.NODE_ENV"]);
  });
  it("새 주소(API · 랜딩 · 미리보기 · /start · /me · 탈퇴 연결 · 문항 통계)는 routes 관문 뒤, \"/\" 전환은 root 관문 뒤", () => {
    const read = (p: string) => readFileSync(p, "utf8");
    expect(read("src/app/api/mirror/[action]/route.ts")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) return new NextResponse\(null, \{ status: 404 \}\)/);
    expect(read("src/app/u/[handle]/page.tsx")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) notFound\(\)/);
    expect(read("src/app/api/mirror/og/[handle]/route.tsx")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) return new NextResponse\(null, \{ status: 404 \}\)/);
    expect(read("src/app/start/page.tsx")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) notFound\(\);\s+if \(mirrorRootEnabled\(\)\)/);
    expect(read("src/app/me/page.tsx")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) notFound\(\)/);
    expect(read("src/app/admin/mirror-items/page.tsx")).toMatch(/mirrorRoutesEnabled\(\)/);
    expect(read("src/app/auth/[action]/route.ts")).toMatch(/if \(!mirrorRoutesEnabled\(\)\) return \{\};/);
    const home = read("src/app/page.tsx");
    expect(home.indexOf("mirrorRootEnabled()")).toBeGreaterThan(-1);
    expect(home.indexOf("mirrorRootEnabled()")).toBeLessThan(home.indexOf("bookExperiencePublicEnabled()"));
    expect(read("src/app/account/page.tsx")).toMatch(/if \(accountMovedToMe\(\)\) redirect\("\/me"\)/);
  });
  it("로그인 콜백: 이 서비스 시작 주소로 시작한 로그인만 동의 · 프로필을 그 화면이 받는다(\"/\"는 root, /start는 routes) — 상품 · 결제 · 책 · /me는 지금처럼", () => {
    expect(readFileSync("src/app/auth/[action]/route.ts", "utf8")).toMatch(/const mirrorFlow = \(next: string\) => \(next === "\/" && mirrorRootEnabled\(\)\) \|\| \(next === "\/start" && mirrorRoutesEnabled\(\)\);/);
  });
  it("돌아갈 곳: /start · /me · /products 허용(관문이 닫히면 그 주소가 404), 이 서비스 넘김은 /start · /me · /@아이디만", () => {
    expect(["/start", "/me", "/products", "/report/new?product=saju-mbti-full", "/reports/report_abcdefghijklm"].map(v => safeAccountNext(v))).toEqual(["/start", "/me", "/products", "/report/new?product=saju-mbti-full", "/reports/report_abcdefghijklm"]);
    expect(["/start", "/me", "/@minji.k", "/u/minji.k", "/", "/products", "https://x.com", "/me/x"].map(safeMirrorNext)).toEqual(["/start", "/me", "/@minji.k", "/u/minji.k", "/", "/", "/", "/"]);
  });
  it("가린 이메일: 앞 세 글자(짧으면 한 글자)만", () => {
    expect([maskEmail("minji99@kakao.com"), maskEmail("ab@x.com"), maskEmail(null), maskEmail("not-an-email")]).toEqual(["min***@kakao.com", "a***@x.com", null, null]);
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
    // @ts-expect-error -- Next가 안에 넣은 path-to-regexp는 타입 선언이 없다(typecheck:all만 tests를 본다).
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
