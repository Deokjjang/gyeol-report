// v5 최종 2-5: 공개 이용권 API(/auth/ticket-redeem·ticket-status, /api/ticket-bundles)의 출처 검사를 고정한다.
// 운영(NODE_ENV=production)은 운영 도메인 두 개의 정확한 출처만. localhost는 next dev(NODE_ENV=development) + 로컬 Supabase일 때만(로컬 E2E: 선물 받기 → 책 만들기).
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { handleTicketPublication } from "../../../src/lib/tickets/publicHandler";
import { isPublicSameOrigin, publicRequestOrigin } from "../../../src/lib/account/origin";
import type { AccountPort } from "../../../src/lib/account/handler";
import type { TicketPublicationStore } from "../../../src/lib/tickets/publication";

const LOCAL_SUPABASE = "http://127.0.0.1:54321";
// 로그인하지 않은 요청: 출처를 통과하면 401(MEMBER_REQUIRED), 막히면 403. 저장소는 부르지 않는다.
const auth = { currentUser: async () => null, finish: (r: NextResponse) => r } as unknown as AccountPort;
const store = { call: vi.fn() } as unknown as TicketPublicationStore;
const req = (base: string, action: "redeem" | "status", origin: string | null = base) => new NextRequest(`${base}/auth/ticket-${action}${action === "status" ? "?requestId=x" : ""}`, {
  method: action === "redeem" ? "POST" : "GET", headers: { ...(origin ? { origin } : {}), "content-type": "application/json" }, ...(action === "redeem" ? { body: "{}" } : {}) });
const status = async (base: string, action: "redeem" | "status", origin?: string | null) => (await handleTicketPublication(req(base, action, origin), action, auth, store)).status;
afterEach(() => { vi.unstubAllEnvs(); });

describe("공개 이용권 API 출처 — 운영은 그대로", () => {
  it("운영 빌드: 운영 도메인 두 개만 통과, localhost·다른 도메인·http·하위 도메인은 403(로컬 Supabase 설정이어도)", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", LOCAL_SUPABASE);
    for (const base of ["https://gyeolreport.com", "https://www.gyeolreport.com"]) {
      expect(await status(base, "redeem")).toBe(401);
      expect(await status(base, "status")).toBe(401);
      expect(await status(base, "redeem", "https://evil.example")).toBe(403); // 다른 출처의 POST
      expect(await status(base, "redeem", null)).toBe(403);
    }
    for (const base of ["http://localhost:3700", "http://127.0.0.1:3700", "http://gyeolreport.com", "https://preview.gyeolreport.com", "https://gyeolreport.com.evil.example"]) {
      expect(await status(base, "redeem")).toBe(403);
      expect(await status(base, "status")).toBe(403);
      expect(publicRequestOrigin(req(base, "status"))).toBeNull();
    }
    expect(store.call).not.toHaveBeenCalled();
  });

  it("시험(NODE_ENV=test)과 개발+운영 Supabase에서도 localhost는 403", async () => {
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", LOCAL_SUPABASE);
    expect(await status("http://localhost:3700", "redeem")).toBe(403);
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abcdefgh.supabase.co");
    expect(await status("http://localhost:3700", "redeem")).toBe(403);
    expect(await status("http://localhost:3700", "status")).toBe(403);
  });
});

describe("로컬 개발에서만 localhost", () => {
  it("next dev + 로컬 Supabase: 같은 localhost 출처만 통과(다른 포트·다른 출처의 POST는 403)", async () => {
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", LOCAL_SUPABASE);
    expect(await status("http://localhost:3700", "redeem")).toBe(401);
    expect(await status("http://localhost:3700", "status")).toBe(401);
    expect(await status("http://localhost:3700", "redeem", "http://localhost:3999")).toBe(403);
    expect(await status("http://localhost:3700", "redeem", "https://gyeolreport.com")).toBe(403);
    expect(isPublicSameOrigin(req("http://localhost:3700", "redeem"))).toBe(true);
    expect(await status("http://192.168.0.5:3700", "redeem")).toBe(403);
  });
});
