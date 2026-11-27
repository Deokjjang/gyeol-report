// 「남이 본 나」 문항 통계(/admin/mirror-items): 공개 관문이 닫혀 있으면 404(로그인 확인 · DB 읽기 없음), 열려 있어도 관리자만. 본문은 빈 상태 · 데이터 상태를 그린다.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));

const ADMIN = "11111111-1111-4111-8111-111111111111", MEMBER = "22222222-2222-4222-8222-222222222222";
const h = vi.hoisted(() => ({ user: null as null | { id: string; lastSignInAt?: string | null }, ports: 0, loads: 0 }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "sb=1" }) }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); }, useRouter: () => ({ refresh() {} }) }));
vi.mock("@/lib/account/supabase", () => ({ createAccountPort: () => { h.ports++; return { currentUser: async () => h.user, finish: (r: unknown) => r }; } }));
vi.mock("@/lib/ops/store", () => ({ OPS_RPC_TIMEOUT_MS: 1000, createOpsStores: () => ({ db: null }) }));
vi.mock("@/lib/mirror/itemStatsStore", () => ({ loadItemStatsInput: async () => { h.loads++; return { ok: false, code: "NO_TABLES" }; } }));

import Page from "@/app/admin/mirror-items/page";
import { ItemStatsView } from "@/app/admin/mirror-items/ui";
import { MIRROR_ITEMS } from "@/data/mirror/items";

beforeEach(() => { h.user = null; h.ports = 0; h.loads = 0; vi.stubEnv("ADMIN_USER_IDS", ADMIN); });
afterEach(() => { vi.unstubAllEnvs(); });

describe("문항 통계 화면 접근", () => {
  it("공개 관문이 닫혀 있으면(배포 빌드) 관리자여도 404 — 로그인 확인 · DB 읽기 없음", async () => {
    vi.stubEnv("NODE_ENV", "production");
    h.user = { id: ADMIN, lastSignInAt: new Date().toISOString() };
    await expect(Page()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(h.ports).toBe(0);
    expect(h.loads).toBe(0);
  });
  it("관문이 열려도 관리자가 아니면 404, DB를 읽지 않는다", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await expect(Page()).rejects.toThrow("NEXT_NOT_FOUND");
    h.user = { id: MEMBER, lastSignInAt: new Date().toISOString() };
    await expect(Page()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(h.loads).toBe(0);
  });
  it("관리자는 열리고 읽기 한 번", async () => {
    vi.stubEnv("NODE_ENV", "development");
    h.user = { id: ADMIN, lastSignInAt: new Date().toISOString() };
    await expect(Page()).resolves.toBeTruthy();
    expect(h.loads).toBe(1);
  });
});

describe("문항 통계 본문", () => {
  it("데이터가 없으면 「아직 데이터 없음」", () => {
    const html = renderToStaticMarkup(<ItemStatsView input={{ self: [], sessions: [], answers: [], devices: [], voids: [] }} capped={false} />);
    expect(html).toContain("아직 데이터 없음");
  });
  it("데이터가 있으면 세 점검 · 우선 점검 2쌍 · 60문항 전체를 그린다", () => {
    // 40명이 모든 문항에 A — ① 자가 답 100%로 60문항 모두 점검, ② 모두 같은 답이라 상관은 계산하지 않음.
    const self = Array.from({ length: 40 }, (_, u) => MIRROR_ITEMS.map(i => ({ userId: `u${u}`, itemId: i.id, version: i.version, choice: 0 }))).flat();
    const html = renderToStaticMarkup(<ItemStatsView input={{ self, sessions: [], answers: [], devices: [], voids: [] }} capped />);
    for (const t of ["① 한쪽 답이 85%를 넘는 문항", "② 같은 면의 다른 문항과 따로 노는 문항", "③ 친구의 「잘 모르겠어요」가 30%를 넘는 문항", "우선 점검 2쌍", "60문항 전체", "2번 사교 ↔ 56번 거리", "46번 걱정 ↔ 26번 추진", "앞부분(표마다 20만 행)만"]) expect(html).toContain(t);
    expect(html.match(/data-flag-item=/g)?.length).toBe(60);
    expect(html.match(/data-item=/g)?.length).toBe(60);
    expect(html).toContain("모두 같은 답");
  });
});
