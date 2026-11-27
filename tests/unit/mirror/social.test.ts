// 「남이 본 나」 명령 2 서버 처리(handleSocial via handleMirror): 친구 응답 · 남용 방지 · 이야기 거르기 · 신고 알림 · 공유 설정 · 탈퇴 연결. 가짜 저장소(외부 호출 0).
import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { MIRROR_ITEMS, MIRROR_ITEM_BY_ID } from "../../../src/data/mirror/items";
import type { AccountPort } from "../../../src/lib/account/handler";
import { handleProfile } from "../../../src/lib/account/profile";
import { ACCOUNT_POLICY_VERSIONS, type AccountIdentity, type AccountSnapshot } from "../../../src/lib/account/policy";
import { handleMirror, type MirrorProfile, type MirrorStore } from "../../../src/lib/mirror/api";
import type { Choice, FriendSession } from "../../../src/lib/mirror/engine";
import { hiddenAlert, TOO_FAST_MS, type FriendSessionRow, type SocialStore, type StoryView } from "../../../src/lib/mirror/social";
import { storyProblem } from "../../../src/lib/mirror/storyFilter";
import { cardText } from "../../../src/lib/mirror/card/model";

const ORIGIN = "http://localhost:3100";
const OWNER = "owner-1", FRIEND: AccountIdentity = { id: "friend-1", provider: "kakao", displayName: "친구" };
const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([t, v]) => ({ consent_type: t as "terms", document_version: v, is_agreed: true, required: true, recorded_at: "2026-11-01" }));
const self: Record<string, Choice> = Object.fromEntries(MIRROR_ITEMS.map((i, k) => [i.id, (k % 2) as Choice]));

function world(opts: { user?: AccountIdentity | null; isPublic?: boolean; ownerDevice?: boolean; rate?: number } = {}) {
  let t = Date.parse("2026-11-27T03:00:00Z");
  const sessions = new Map<string, FriendSessionRow & { device: string }>(), voids = new Set<string>(), stories: (StoryView & { ownerId: string })[] = [];
  const profiles = new Map<string, MirrorProfile>([[OWNER, { name: "서연", handle: "seo.yeon", handleChangedAt: null, birthDate: null, birthTime: null, isPublic: opts.isPublic ?? true, selfCompletedAt: "2026-11-01" }]]);
  if (opts.user) profiles.set(opts.user.id, { name: "하나", handle: "hana.k", handleChangedAt: null, birthDate: null, birthTime: null, isPublic: true, selfCompletedAt: null });
  const account: AccountPort = {
    authorizationOrigin: "http://127.0.0.1:54321", currentUser: async () => opts.user ?? null, read: async () => ({ profile: opts.user ? { id: opts.user.id, provider: "kakao", displayName: "x" } : null, consents, contact: null } as AccountSnapshot),
    consent: async () => true, start: async () => null, exchange: async () => false, logout: async () => true, finish: (r: NextResponse) => r,
  };
  const board = (): FriendSession[] => [...sessions.values()].filter(s => !voids.has(s.id)).map(s => ({ id: s.id, closeness: s.closeness, answers: s.answers.map(a => ({ itemId: a.itemId, choice: a.choice })) }));
  const store = { profile: async (id: string) => profiles.get(id) ?? null, selfAnswers: async () => self, board: async () => board(), touchDevice: async () => undefined } as unknown as MirrorStore;
  const notify = vi.fn(async () => undefined);
  const social: SocialStore = {
    ownerByHandle: async h => h === "seo.yeon" ? { userId: OWNER, name: "서연", handle: "seo.yeon", isPublic: profiles.get(OWNER)!.isPublic, selfCompletedAt: "2026-11-01" } : null,
    deviceOwnedBy: async () => opts.ownerDevice === true,
    shareSettings: async () => ({ line: null, showCount: false }), saveShareSettings: vi.fn(async () => true), setPublic: async (_u, v) => { profiles.get(OWNER)!.isPublic = v; return true; },
    friendSession: async (_o, d) => [...sessions.values()].reverse().find(s => s.device === d) ?? null,
    createFriendSession: async (_o, closeness, device) => { const id = `s-${sessions.size + 1}`; sessions.set(id, { id, closeness, device, endedAt: null, golden: false, answers: [], hasStory: false }); return id; },
    saveFriendAnswer: async (sid, itemId, _v, c) => { const s = sessions.get(sid)!; s.answers = s.answers.filter(a => a.itemId !== itemId).concat({ itemId, choice: c === 2 ? "skip" : c, at: t }); return true; },
    voidSession: vi.fn(async sid => { voids.add(sid); }), finishFriendSession: async (sid, g) => { sessions.get(sid)!.golden = g; return true; },
    itemCounts: async () => new Map(), rateHit: async () => opts.rate ?? 1, linkFriendSessions: async () => undefined,
    saveStory: vi.fn(async v => { stories.push({ id: "00000000-0000-4000-8000-000000000001", ownerId: v.ownerId, kind: v.kind, body: v.body, closeness: v.closeness, ownerDevice: v.ownerDevice, sharedAt: "2026-11-27", createdAt: "2026-11-27", hidden: false, handle: v.showHandle ? "hana.k" : null, hearts: 0, hearted: false, reported: false }); sessions.get(v.sessionId)!.hasStory = true; return "ok" as const; }),
    stories: async () => stories, spaceTop: async () => null,
    storyMeta: async id => { const s = stories.find(x => x.id === id); return s ? { ownerId: s.ownerId, sharedAt: s.sharedAt, hiddenAt: null, kind: s.kind, body: s.body } : null; },
    setStoryShared: async () => true, heart: async () => true, reportStory: async () => ({ count: 3, hiddenNow: true }), storyCount: async () => stories.length,
    issues: async () => [], issue: async () => null, publishIssue: async () => ({ ok: true }), withdraw: async () => true,
  };
  const call = async (action: string, body?: object, query = "") => {
    t += 1000;
    const r = await handleMirror(new NextRequest(`${ORIGIN}/api/mirror/${action}${query}`, { method: body ? "POST" : "GET", headers: { host: "localhost:3100", origin: ORIGIN, cookie: `gyeol-mirror-device=${"d".repeat(43)}` }, ...(body ? { body: JSON.stringify(body) } : {}) }),
      action, { enabled: true, account, store, social, notify, ip: "203.0.113.7", dev: true, now: () => new Date(t) });
    return { status: r.status, data: await r.json() };
  };
  return { call, sessions, voids, stories, social, notify, setTime: (ms: number) => { t = ms; }, now: () => t };
}
const H = "seo.yeon";

describe("D3 친구 응답", () => {
  it("랜딩: 주인 본인 · 비공개 · 없는 아이디 · 처음 온 친구", async () => {
    expect((await world({ user: { id: OWNER, provider: "kakao", displayName: "서연" } }).call("friend", undefined, `?handle=${H}`)).data.state).toBe("owner");
    expect((await world({ ownerDevice: true }).call("friend", undefined, `?handle=${H}`)).data.state).toBe("owner");
    expect((await world({ isPublic: false }).call("friend", undefined, `?handle=${H}`)).data.state).toBe("closed");
    expect((await world().call("friend", undefined, "?handle=no.one")).status).toBe(404);
    const open = await world().call("friend", undefined, `?handle=${H}`);
    expect(open.data).toEqual({ state: "open", owner: { name: "서연", handle: H, line: null }, viewer: { loggedIn: false, canShowHandle: false }, session: null });
    // 주인 본인 · 비공개에는 답을 받지 않는다
    expect((await world({ ownerDevice: true }).call("friend-start", { handle: H, closeness: 2 })).status).toBe(403);
    expect((await world({ isPublic: false }).call("friend-start", { handle: H, closeness: 2 })).status).toBe(403);
  });
  it("묶음: 친구 · 가까운 사이 12문항(면마다 1개), 아는 사이 10문항(확인 · 거리 없음) · 친구용 문장(이름 조사)", async () => {
    for (const [closeness, n] of [[1, 10], [2, 12], [3, 12]] as const) {
      const r = await world().call("friend-start", { handle: H, closeness });
      expect(r.data.bundle).toHaveLength(n);
      expect(new Set(r.data.bundle.map((b: { id: string }) => MIRROR_ITEM_BY_ID.get(b.id)!.facet)).size).toBe(n);
      if (closeness === 1) expect(r.data.bundle.some((b: { id: string }) => /^(check|dist)-/.test(b.id))).toBe(false);
      expect(r.data.bundle[0].situation).toMatch(/^서연은 /);
      expect(r.data.session).toMatchObject({ closeness, asked: 0, open: closeness === 1 ? 50 : 60, perBundle: n });
    }
    expect((await world().call("friend-start", { handle: H })).data.code).toBe("CLOSENESS_REQUIRED");
  });
  it("같은 기기로 다시 오면 같은 세션 · 남은 문항만 · 최대치 · 아는 사이에게 확인 · 거리 거부", async () => {
    const w = world();
    const first = await w.call("friend-start", { handle: H, closeness: 1 });
    for (const b of first.data.bundle) await w.call("friend-answer", { handle: H, itemId: b.id, version: b.version, choice: 0 });
    const again = await w.call("friend-start", { handle: H, closeness: 3 });
    expect(again.data.session).toMatchObject({ closeness: 1, asked: 10 });
    expect(again.data.bundle.some((b: { id: string }) => first.data.bundle.some((x: { id: string }) => x.id === b.id))).toBe(false);
    expect((await w.call("friend-answer", { handle: H, itemId: "check-1", version: 1, choice: 0 })).status).toBe(400);
    for (const item of MIRROR_ITEMS.filter(i => !/^(check|dist)-/.test(i.id))) await w.call("friend-answer", { handle: H, itemId: item.id, version: 1, choice: 1 });
    expect(w.sessions.get("s-1")!.answers).toHaveLength(50);
    const done = await w.call("friend-finish", { handle: H });
    expect(done.data).toMatchObject({ ok: true, golden: true, session: { asked: 50, open: 50 } });
    expect((await w.call("friend-bundle", { handle: H })).data.bundle).toHaveLength(0);
  });
  it("사람이 불가능한 속도(0.3초 미만이 연속) → 그 세션 무효 · 폭주 제한 → 429", async () => {
    const w = world();
    const s = await w.call("friend-start", { handle: H, closeness: 2 });
    for (const b of s.data.bundle.slice(0, 3)) { w.setTime(w.now() + TOO_FAST_MS - 1200); await w.call("friend-answer", { handle: H, itemId: b.id, version: b.version, choice: 0 }); }
    expect(w.voids.has("s-1")).toBe(true);
    expect((await world({ rate: 999 }).call("friend-start", { handle: H, closeness: 2 })).status).toBe(429);
  });
  it("결과: 아는 정도 % · 3명부터 순위 · 이야기 거르기(서버) · 로그인 안 한 친구는 아이디를 보일 수 없다", async () => {
    const w = world();
    const s = await w.call("friend-start", { handle: H, closeness: 2 });
    for (const b of s.data.bundle) await w.call("friend-answer", { handle: H, itemId: b.id, version: b.version, choice: self[b.id] });
    const blocked = await w.call("friend-finish", { handle: H, story: { kind: "funny", body: "번호는 010-1234-5678" } });
    expect(blocked).toMatchObject({ status: 400, data: { code: "STORY_FILTER" } });
    const ok = await w.call("friend-finish", { handle: H, story: { kind: "funny", body: "같이 웃었던 날", showHandle: true } });
    expect(ok.data).toMatchObject({ ok: true, storySaved: true, know: 100, rank: null, golden: false });
    expect(w.social.saveStory).toHaveBeenCalledWith(expect.objectContaining({ showHandle: false, writerUserId: null, kind: "funny", closeness: 2 }));
  });
});

describe("D6 이야기 · 신고", () => {
  it("신고 3번째로 숨겨지면 운영 알림(처리 봇)을 한 번 보낸다", async () => {
    const w = world({ user: FRIEND });
    w.stories.push({ id: "00000000-0000-4000-8000-0000000000aa", ownerId: OWNER, kind: "thanks", body: "고마웠어", closeness: 2, ownerDevice: false, sharedAt: "2026-11-27", createdAt: "2026-11-27", hidden: false, handle: null, hearts: 0, hearted: false, reported: false });
    const r = await w.call("report-story", { id: "00000000-0000-4000-8000-0000000000aa" });
    expect(r.data).toEqual({ ok: true, hidden: true });
    expect(w.notify).toHaveBeenCalledTimes(1);
    expect(w.notify.mock.calls[0]).toEqual([expect.stringContaining("모두의 이야기 자동 숨김")]);
  });
  it("알림 문구: 본문은 앞 60자만 · HTML 이스케이프", () => {
    const text = hiddenAlert("funny", "<b>" + "가".repeat(80), "12345678-aaaa", 3);
    expect(text).toContain("신고 3건"); expect(text).toContain("&lt;b&gt;"); expect(text).toContain("…"); expect(text).toContain("이야기 12345678");
  });
  it("주인 전용 동작은 로그인 · 프로필이 필요하다 · 모두의 이야기는 읽기만 열려 있다", async () => {
    const w = world();
    expect((await w.call("stories")).status).toBe(401);
    expect((await w.call("heart", { id: "00000000-0000-4000-8000-000000000001", on: true })).status).toBe(401);
    expect((await w.call("space")).status).toBe(200);
  });
});

describe("D4 공유 설정", () => {
  it("한마디 20자 · 거르기 · 저장", async () => {
    const w = world({ user: FRIEND });
    expect((await w.call("share", { line: "가".repeat(21), showCount: true })).data.code).toBe("LINE_TOO_LONG");
    expect((await w.call("share", { line: "존나 궁금하지?", showCount: true })).data.code).toBe("LINE_FILTER");
    expect((await w.call("share", { line: "  나 어때?  ", showCount: true })).data).toEqual({ ok: true, share: { line: "나 어때?", showCount: true } });
  });
  it("카드 글자: 친구 답 전 ?% · 토글 끄면 친구 수 없음 · 기본 한마디", () => {
    expect(cardText({ handle: "minji.k", sync: null, friends: 12, showCount: false, line: null })).toEqual({ handle: "@minji.k", sync: "?%", syncLabel: "싱크로율", count: null, line: "나는 어떤 사람이야?", link: "gyeolreport.com/@minji.k" });
    expect(cardText({ handle: "minji.k", sync: 71, friends: 12, showCount: true, line: "나 어때?" })).toMatchObject({ sync: "71%", count: "친구 12명이 답해 줬어요", line: "나 어때?" });
  });
});

describe("거르기", () => {
  it("친구 이야기에 흔한 말은 통과, 욕설 · 개인정보는 잡는다", () => {
    for (const ok of ["수학여행 때 미친 듯이 웃었던 거 기억나?", "우리의 시발점은 고1 때였지", "한남동 카페에서 3시간 수다", "2026.11.27 12시에 만났잖아", "학교로 2번 갔다가 집으로 3시에 왔지", "101번 버스 타고 15분", "ㅋㅋㅋㅋ 진짜 웃겼다"]) expect(storyProblem(ok)).toBeNull();
    const cases: [string, string][] = [["시1발 웃겼다", "abuse"], ["병 신", "abuse"], ["010-1234-5678", "phone"], ["국민 123456-01-123456", "account"], ["110-123-456789", "account"], ["a.b@naver.com", "email"], ["테헤란로 123", "address"], ["101동 1203호", "address"], ["900101-1234567", "rrn"]];
    for (const [t, code] of cases) expect(storyProblem(t)?.code).toBe(code);
  });
});

describe("탈퇴 연결(기존 소프트 삭제 흐름)", () => {
  it("계정 · 주문 · 책 처리 뒤 「남이 본 나」 정리를 부르고 감사 기록에 남긴다 · 정리가 실패해도 탈퇴는 끝난다", async () => {
    const user = { id: "11111111-1111-4111-8111-111111111111", displayName: "하람", provider: "kakao" as const, kakaoId: "1" };
    const port: AccountPort = { authorizationOrigin: "x", currentUser: async () => user, read: async () => ({ profile: user, consents, contact: null }), start: async () => null, exchange: async () => true, logout: async () => true, consent: async () => true, finish: r => r };
    for (const [result, label] of [[true, "done"], [false, "failed"]] as const) {
      const order: string[] = [], audits: unknown[] = [];
      const deps = {
        ops: { call: async (action: string) => { order.push(action); return action === "facts_read" ? { ok: true, facts: null } : { ok: true, retainedOrders: 1, closedBooks: 1 }; } },
        audit: async (e: unknown) => { audits.push(e); return true; }, unlinkKakao: async () => "skipped" as const,
        deleteUser: async () => { order.push("deleteUser"); return true; }, mirrorWithdraw: async () => { order.push("mirror"); return result; },
      };
      const r = await handleProfile(new NextRequest("https://www.gyeolreport.com/auth/withdraw", { method: "POST", body: JSON.stringify({ confirm: "탈퇴" }), headers: { origin: "https://www.gyeolreport.com" } }), "withdraw", port, deps as never);
      expect(r.status).toBe(200);
      expect(order).toEqual(["facts_read", "withdraw", "mirror", "deleteUser"]);
      expect(audits).toEqual([expect.objectContaining({ action: "account_withdrawn", detail: expect.objectContaining({ mirror: label, retainedOrders: 1, closedBooks: 1 }) })]);
    }
  });
});

