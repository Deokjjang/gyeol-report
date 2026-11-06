// P6d-ops 관리자 화면 접근: ADMIN_USER_IDS에 있는 로그인 계정만. 비회원·일반 회원·설정 없음은 404(notFound), DB 조회도 하지 않는다.
// 관리자라도 마지막 로그인이 12시간(ADMIN_SESSION_HOURS)을 넘으면 데이터 없이 "다시 로그인"만 보인다.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

const ADMIN = "11111111-1111-4111-8111-111111111111", MEMBER = "22222222-2222-4222-8222-222222222222";
const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();
const h = vi.hoisted(() => ({ user: null as null | { id: string; lastSignInAt?: string | null }, ports: 0, rpc: [] as { fn: string; args: Record<string, unknown> }[] }));

vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "sb=1" }) }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); }, useRouter: () => ({ refresh() {} }) }));
vi.mock("@/lib/account/supabase", () => ({
  createAccountPort: () => { h.ports++; return { currentUser: async () => h.user, finish: (r: unknown) => r }; },
}));
vi.mock("@/lib/ops/store", () => ({
  OPS_RPC_TIMEOUT_MS: 1000,
  createOpsStores: () => ({
    db: { rpc: (fn: string, args: Record<string, unknown>) => { h.rpc.push({ fn, args }); return { abortSignal: async () => ({ data: { ok: false, code: "ORDER_NOT_FOUND" }, error: null }) }; } },
    generation: { call: async () => ({ ok: true, providers: {} }) }, order: { call: async () => ({ ok: true }) }, audit: async () => true,
  }),
}));

import ListPage from "@/app/admin/orders/page";
import DetailPage from "@/app/admin/orders/[code]/page";
import { ExpiredView } from "@/app/admin/orders/ui";
import { adminSession } from "@/lib/ops/admin/access";
import { adminSessionFresh } from "@/lib/ops/admin/config";
import { NextRequest } from "next/server";

beforeEach(() => { h.user = null; h.ports = 0; h.rpc = []; vi.stubEnv("ADMIN_USER_IDS", ` ${ADMIN} , not-a-uuid`); vi.stubEnv("ADMIN_SESSION_HOURS", ""); });
afterEach(() => { vi.unstubAllEnvs(); });

const list = () => ListPage({ searchParams: Promise.resolve({ tab: "search", q: "GR-ABCD" }) });
const detail = () => DetailPage({ params: Promise.resolve({ code: "GR-ABCD" }) });

describe("관리자 화면 접근", () => {
  it("비회원은 404, DB를 읽지 않는다", async () => {
    await expect(list()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(detail()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(h.rpc).toEqual([]);
  });
  it("관리자 명단에 없는 회원은 404", async () => {
    h.user = { id: MEMBER, lastSignInAt: ago(1) };
    await expect(list()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(detail()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(h.rpc).toEqual([]);
  });
  it("ADMIN_USER_IDS가 비어 있으면 로그인 확인 없이 404", async () => {
    vi.stubEnv("ADMIN_USER_IDS", "");
    h.user = { id: ADMIN, lastSignInAt: ago(1) };
    await expect(list()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(h.ports).toBe(0);
  });
  it("관리자는 열린다(목록·상세), 상세는 주문코드로 ops_admin detail을 읽는다", async () => {
    h.user = { id: ADMIN, lastSignInAt: ago(1) };
    const page = await list();
    expect(page).toBeTruthy();
    expect((page as { type: unknown }).type).not.toBe(ExpiredView);
    await expect(detail()).resolves.toBeTruthy();
    expect(h.rpc).toEqual([{ fn: "ops_admin", args: { p_action: "detail", p_data: { orderCode: "GR-ABCD" } } }]);
  });
  it("마지막 로그인이 12시간을 넘었거나 없으면 '다시 로그인'만(데이터 없음)", async () => {
    for (const lastSignInAt of [ago(13), null, undefined]) {
      h.user = { id: ADMIN, lastSignInAt };
      expect(((await list()) as { type: unknown }).type).toBe(ExpiredView);
      expect(((await detail()) as { type: unknown }).type).toBe(ExpiredView);
    }
    expect(h.rpc).toEqual([]);
  });
  it("ADMIN_SESSION_HOURS로 유효 시간을 바꾼다", () => {
    expect(adminSessionFresh(ago(13))).toBe(false);
    vi.stubEnv("ADMIN_SESSION_HOURS", "24");
    expect(adminSessionFresh(ago(13))).toBe(true);
    expect(adminSessionFresh(ago(25))).toBe(false);
  });
  it("adminSession: 관리자만 admin, 시간이 지나면 expired", async () => {
    const req = new NextRequest("https://www.gyeolreport.com/admin/orders");
    h.user = { id: MEMBER, lastSignInAt: ago(1) }; expect(await adminSession(req)).toMatchObject({ status: "none", userId: null });
    h.user = { id: ADMIN, lastSignInAt: ago(1) }; expect(await adminSession(req)).toMatchObject({ status: "admin", userId: ADMIN });
    h.user = { id: ADMIN, lastSignInAt: ago(12.5) }; expect(await adminSession(req)).toMatchObject({ status: "expired", userId: ADMIN });
  });
});
