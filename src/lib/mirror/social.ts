/**
 * 「남이 본 나」 명령 2 서버 처리(/api/mirror/*): D3 친구 응답 · D4 공유 설정 · D5 기록판 · 보고서 호 · D6 이야기 · 마음 · 신고.
 * handleMirror(api.ts)가 관문 · 출처(CSRF) · 기기 토큰 · 본문 읽기를 마친 뒤 넘긴다. 표는 SocialStore(service_role)로만.
 * 익명: 친구 이름 · 세션 id · 답 원본은 화면에 보내지 않는다. 받은 사람 · 쓴 사람 계정 id도 보내지 않는다.
 * 남에게 피해가 가는 것만 막는다(주인 기기 · 계정 답 제외, 기기 · IP 폭주 제한, 사람이 불가능한 속도 무효). 본인 자랑용 부풀리기는 막지 않는다.
 */
import { createHash } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { CLOSE_ONLY_FACETS, MIRROR_ITEM_BY_ID, type MirrorItem } from "../../data/mirror/items";
import { isStoryKind, STORY_KIND_LABEL, STORY_MAX, type StoryKind } from "../../data/mirror/stories";
import type { AccountPort } from "../account/handler";
import { boardView, issueState, ISSUE_GAP_DAYS } from "./boardView";
import { friendRank, isGolden, knowRate, openItemCount, type Closeness, type FriendChoice, type FriendSession } from "./engine";
import { optionOrder, pickBundle } from "./order";
import { handleProblem, normalizeHandle } from "./profileRules";
import { buildReport } from "./report/engine";
import type { ReportSnapshot, ReportStory } from "./report/types";
import { charCount, normalizeLine, normalizeStory, storyProblem } from "./storyFilter";
import { friendSentence } from "./text";
import type { MirrorStore } from "./api";

export type FriendAnswerRow = { itemId: string; choice: FriendChoice; at: number };
export type FriendSessionRow = { id: string; closeness: Closeness; endedAt: string | null; golden: boolean; answers: FriendAnswerRow[]; hasStory: boolean };
export type StoryView = { id: string; kind: StoryKind; body: string; closeness: Closeness; ownerDevice: boolean; sharedAt: string | null; createdAt: string; hidden: boolean; handle: string | null; hearts: number; hearted: boolean; reported: boolean };
export type IssueRow = { issueNo: number; issuedAt: string; answers: number; title: string };
export type ShareSettings = { line: string | null; showCount: boolean };
export type OwnerRow = { userId: string; name: string; handle: string; isPublic: boolean; selfCompletedAt: string | null };

export type SocialStore = {
  ownerByHandle(handle: string): Promise<OwnerRow | null>;
  /** 이 기기가 그 사람이 로그인한 채 쓴 기기인가(주인 본인 기기). */
  deviceOwnedBy(deviceHash: string, userId: string): Promise<boolean>;
  shareSettings(userId: string): Promise<ShareSettings>;
  saveShareSettings(userId: string, s: ShareSettings): Promise<boolean>;
  setPublic(userId: string, isPublic: boolean): Promise<boolean>;
  /** 이 기기로 이 주인에게 답한 세션(가장 최근). */
  friendSession(ownerId: string, deviceHash: string): Promise<FriendSessionRow | null>;
  createFriendSession(ownerId: string, closeness: Closeness, deviceHash: string, linkedUserId: string | null): Promise<string | null>;
  /** 같은 문항은 한 번(다시 오면 고친다 — 「이전」). */
  saveFriendAnswer(sessionId: string, itemId: string, version: number, choice: 0 | 1 | 2): Promise<boolean>;
  voidSession(sessionId: string): Promise<void>;
  finishFriendSession(sessionId: string, golden: boolean): Promise<boolean>;
  itemCounts(ownerId: string): Promise<Map<string, number>>;
  rateHit(key: string, windowSeconds: number): Promise<number>;
  /** 친구로 답한 세션을 가입한 계정에 잇는다(같은 기기 · 아직 안 이은 세션만). */
  linkFriendSessions(deviceHash: string, userId: string): Promise<void>;
  saveStory(s: { ownerId: string; sessionId: string; writerUserId: string | null; showHandle: boolean; ownerDevice: boolean; kind: StoryKind; closeness: Closeness; body: string }): Promise<"ok" | "exists" | "failed">;
  stories(viewer: string | null, ownerId: string | null, sort: "latest" | "popular", limit: number, offset: number): Promise<StoryView[]>;
  spaceTop(viewer: string | null, since: string): Promise<StoryView | null>;
  storyMeta(id: string): Promise<{ ownerId: string; sharedAt: string | null; hiddenAt: string | null; kind: StoryKind; body: string } | null>;
  setStoryShared(ownerId: string, id: string, shared: boolean): Promise<boolean>;
  heart(id: string, userId: string, on: boolean): Promise<boolean>;
  reportStory(id: string, userId: string): Promise<{ count: number; hiddenNow: boolean } | null>;
  storyCount(ownerId: string): Promise<number>;
  issues(ownerId: string): Promise<IssueRow[]>;
  issue(ownerId: string, issueNo: number): Promise<ReportSnapshot | null>;
  publishIssue(ownerId: string, issueNo: number, answers: number, snapshot: ReportSnapshot): Promise<{ ok: true } | { ok: false; code: string; nextAt?: string }>;
  /** 탈퇴(mirror_withdraw): 받은 것은 지우고, 남긴 것은 익명으로, 아이디는 「사용됨」만. */
  withdraw(userId: string): Promise<boolean>;
};

export const SOCIAL_ROUTES: Readonly<Record<string, "GET" | "POST">> = {
  friend: "GET", "friend-start": "POST", "friend-answer": "POST", "friend-bundle": "POST", "friend-finish": "POST",
  share: "POST", settings: "POST", board: "GET", "report-issue": "POST", reports: "GET",
  stories: "GET", "story-share": "POST", space: "GET", heart: "POST", "report-story": "POST",
};

export type SocialCtx = {
  request: NextRequest; now: Date; account: AccountPort; store: MirrorStore; social: SocialStore;
  body: Record<string, unknown>; deviceHash: string;
  json(body: object, status?: number): NextResponse; withDevice(r: NextResponse): NextResponse;
  /** 운영 알림(처리 봇). 없으면 보내지 않는다. */
  notify?: (text: string) => Promise<void>;
  /** 요청 IP(배포에서는 x-vercel-forwarded-for만 믿는다). 없으면 기기 기준만. */
  ip: string | null;
  seedOf(userId: string): string;
};

/** 폭주 제한(10분 칸): 기기 · IP별 상한. 학교 · 회사처럼 IP 하나에 여럿이 있어도 걸리지 않게 IP는 넉넉히. */
export const RATE = { start: { dev: 20, ip: 300 }, answer: { dev: 240, ip: 2400 }, story: { dev: 10, ip: 120 }, act: { dev: 120, ip: 1200 } } as const;
const RATE_WINDOW = 600;
/** 사람이 불가능한 속도: 직전 두 간격이 모두 0.3초 미만이면 그 세션을 무효로 한다. */
export const TOO_FAST_MS = 300;
const hex32 = (v: string) => createHash("sha256").update(`mirror-rate:${v}`).digest("hex").slice(0, 32);
const PAGE = 20;

const perBundle = (c: Closeness) => (c === 1 ? 10 : 12);
function summary(s: FriendSessionRow) {
  const open = openItemCount(s.closeness);
  return { closeness: s.closeness, asked: s.answers.length, open, perBundle: perBundle(s.closeness), ended: !!s.endedAt, golden: s.golden, hasStory: s.hasStory };
}
export type FriendItem = { id: string; version: number; situation: string; a: string; b: string; order: readonly [0 | 1, 0 | 1] };
const friendItem = (item: MirrorItem, name: string, seed: string): FriendItem => ({ id: item.id, version: item.version, ...friendSentence(item, name), order: optionOrder(seed, item.id) });

export async function handleSocial(ctx: SocialCtx, action: string): Promise<NextResponse> {
  const { json, withDevice, social, store, account, now } = ctx;
  const bad = (code: string, error: string, status = 400) => withDevice(json({ code, error }, status));
  const limited = async (kind: keyof typeof RATE) => {
    const r = RATE[kind];
    const [d, i] = await Promise.all([social.rateHit(`${kind}:dev:${hex32(ctx.deviceHash)}`, RATE_WINDOW), ctx.ip ? social.rateHit(`${kind}:ip:${hex32(ctx.ip)}`, RATE_WINDOW) : Promise.resolve(0)]);
    return d > r.dev || i > r.ip;
  };

  // ---------- D3 친구 응답(로그인 없이) ----------
  if (action.startsWith("friend")) {
    const raw = action === "friend" ? ctx.request.nextUrl.searchParams.get("handle") : ctx.body.handle;
    const handle = normalizeHandle(typeof raw === "string" ? raw : "");
    if (handleProblem(handle) && handleProblem(handle) !== "reserved") return bad("NOT_FOUND", "없는 링크예요.", 404);
    const owner = await social.ownerByHandle(handle);
    if (!owner) return bad("NOT_FOUND", "없는 링크예요.", 404);
    const user = await account.currentUser();
    const isOwner = user?.id === owner.userId || await social.deviceOwnedBy(ctx.deviceHash, owner.userId);
    const share = await social.shareSettings(owner.userId);
    const base = { owner: { name: owner.name, handle: owner.handle, line: share.line } };
    const closed = !owner.isPublic || !owner.selfCompletedAt;
    if (action === "friend") {
      if (isOwner) return withDevice(json({ state: "owner", ...base }));
      if (closed) return withDevice(json({ state: "closed", ...base }));
      const s = await social.friendSession(owner.userId, ctx.deviceHash);
      const profile = user ? await store.profile(user.id) : null;
      return withDevice(json({ state: "open", ...base, viewer: { loggedIn: !!user, canShowHandle: !!profile }, session: s ? summary(s) : null }));
    }
    if (isOwner) return bad("OWNER", "내 페이지예요. 친구에게 링크를 보내 보세요.", 403);
    if (closed) return bad("CLOSED", "지금은 답을 받지 않고 있어요.", 403);
    const nextBundle = async (s: FriendSessionRow) => {
      const items = pickBundle({ closeness: s.closeness, asked: new Set(s.answers.map(a => a.itemId)), ownerCounts: await social.itemCounts(owner.userId), seed: s.id });
      return items.map(i => friendItem(i, owner.name, s.id));
    };

    if (action === "friend-start") {
      const closeness = ctx.body.closeness;
      let s = await social.friendSession(owner.userId, ctx.deviceHash);
      if (!s) {
        if (closeness !== 1 && closeness !== 2 && closeness !== 3) return bad("CLOSENESS_REQUIRED", "어떤 사이인지 골라 주세요.");
        if (await limited("start")) return bad("RATE_LIMITED", "잠시 후 다시 시도해 주세요.", 429);
        const id = await social.createFriendSession(owner.userId, closeness, ctx.deviceHash, user?.id ?? null);
        if (!id) return bad("STORAGE_UNAVAILABLE", "잠시 후 다시 시도해 주세요.", 503);
        s = { id, closeness, endedAt: null, golden: false, answers: [], hasStory: false };
      }
      return withDevice(json({ session: summary(s), bundle: await nextBundle(s) }));
    }
    const s = await social.friendSession(owner.userId, ctx.deviceHash);
    if (!s) return bad("NO_SESSION", "처음부터 다시 시작해 주세요.", 409);

    if (action === "friend-bundle") return withDevice(json({ session: summary(s), bundle: await nextBundle(s) }));

    if (action === "friend-answer") {
      const item = typeof ctx.body.itemId === "string" ? MIRROR_ITEM_BY_ID.get(ctx.body.itemId) : undefined, choice = ctx.body.choice;
      if (!item || ctx.body.version !== item.version || (choice !== 0 && choice !== 1 && choice !== 2)) return bad("ANSWER_INVALID", "문항이 바뀌었어요. 화면을 새로 고쳐 주세요.");
      if (s.closeness === 1 && CLOSE_ONLY_FACETS.includes(item.facet)) return bad("ANSWER_INVALID", "이 질문은 받지 않아요.");
      const already = s.answers.some(a => a.itemId === item.id);
      if (!already && s.answers.length >= openItemCount(s.closeness)) return bad("FULL", "이미 모든 질문에 답했어요.", 409);
      if (await limited("answer")) return bad("RATE_LIMITED", "잠시 후 다시 시도해 주세요.", 429);
      const times = s.answers.map(a => a.at).sort((x, y) => y - x), t = now.getTime();
      if (times.length >= 2 && t - times[0] < TOO_FAST_MS && times[0] - times[1] < TOO_FAST_MS) await social.voidSession(s.id);
      if (!await social.saveFriendAnswer(s.id, item.id, item.version, choice)) return bad("STORAGE_UNAVAILABLE", "저장하지 못했어요. 다시 눌러 주세요.", 503);
      return withDevice(json({ ok: true, asked: s.answers.length + (already ? 0 : 1) }));
    }

    // friend-finish: (선택) 이야기 → 결과(아는 정도 % · 순위 · 황금별)
    const story = ctx.body.story;
    let storySaved = false;
    if (story && typeof story === "object" && !Array.isArray(story) && !s.hasStory) {
      const st = story as Record<string, unknown>, body = normalizeStory(typeof st.body === "string" ? st.body : "");
      if (!isStoryKind(st.kind)) return bad("STORY_INVALID", "이야기 종류를 골라 주세요.");
      if (!body) return bad("STORY_INVALID", "이야기를 적어 주세요.");
      if (charCount(body) > STORY_MAX) return bad("STORY_INVALID", `${STORY_MAX}자까지 쓸 수 있어요.`);
      const problem = storyProblem(body);
      if (problem) return withDevice(json({ code: "STORY_FILTER", error: problem.message, filter: problem.code }, 400));
      if (await limited("story")) return bad("RATE_LIMITED", "잠시 후 다시 시도해 주세요.", 429);
      const canShow = st.showHandle === true && !!user && !!await store.profile(user.id);
      const saved = await social.saveStory({ ownerId: owner.userId, sessionId: s.id, writerUserId: user?.id ?? null, showHandle: canShow, ownerDevice: false, kind: st.kind, closeness: s.closeness, body });
      if (saved === "failed") return bad("STORAGE_UNAVAILABLE", "이야기를 보내지 못했어요. 다시 시도해 주세요.", 503);
      storySaved = saved === "ok";
    }
    const asFriend: FriendSession = { id: s.id, closeness: s.closeness, answers: s.answers.map(a => ({ itemId: a.itemId, choice: a.choice })) };
    const golden = isGolden(asFriend);
    await social.finishFriendSession(s.id, golden);
    const [self, board] = await Promise.all([store.selfAnswers(owner.userId), store.board(owner.userId)]);
    const know = knowRate(asFriend, self);
    return withDevice(json({ ok: true, storySaved, know: know?.percent ?? null, rank: friendRank(board, self, s.id), golden, session: summary({ ...s, golden, endedAt: now.toISOString(), hasStory: s.hasStory || storySaved }) }));
  }

  // ---------- 아래는 주인(로그인 · 프로필) ----------
  const user = await account.currentUser();
  if (!user) {
    // 모두의 이야기는 로그인 없이도 읽을 수 있다(마음 · 신고는 로그인 필요).
    if (action === "space") return space(ctx, null);
    return bad("LOGIN_REQUIRED", "로그인이 만료됐어요. 다시 로그인해 주세요.", 401);
  }
  const profile = await store.profile(user.id);
  if (!profile) return bad("PROFILE_REQUIRED", "프로필을 먼저 만들어 주세요.", 409);

  if (action === "space") return space(ctx, user.id);
  if (action === "heart" || action === "report-story") {
    const id = typeof ctx.body.id === "string" && /^[0-9a-f-]{36}$/.test(ctx.body.id) ? ctx.body.id : null;
    const meta = id ? await social.storyMeta(id) : null;
    if (!id || !meta || !meta.sharedAt || meta.hiddenAt) return bad("NOT_FOUND", "이야기를 찾지 못했어요.", 404);
    if (await limited("act")) return bad("RATE_LIMITED", "잠시 후 다시 시도해 주세요.", 429);
    if (action === "heart") return json({ ok: await social.heart(id, user.id, ctx.body.on !== false) });
    const r = await social.reportStory(id, user.id);
    if (!r) return bad("STORAGE_UNAVAILABLE", "신고하지 못했어요. 다시 시도해 주세요.", 503);
    if (r.hiddenNow && ctx.notify) await ctx.notify(hiddenAlert(meta.kind, meta.body, id, r.count)).catch(() => undefined);
    return json({ ok: true, hidden: r.hiddenNow });
  }
  if (action === "share") {
    const line = normalizeLine(typeof ctx.body.line === "string" ? ctx.body.line : "");
    if (charCount(line) > 20) return bad("LINE_TOO_LONG", "한마디는 20자까지 쓸 수 있어요.");
    const problem = line ? storyProblem(line) : null;
    if (problem) return bad("LINE_FILTER", problem.message);
    const ok = await social.saveShareSettings(user.id, { line: line || null, showCount: ctx.body.showCount === true });
    return ok ? json({ ok: true, share: { line: line || null, showCount: ctx.body.showCount === true } }) : bad("STORAGE_UNAVAILABLE", "저장하지 못했어요.", 503);
  }
  if (action === "settings") {
    if (typeof ctx.body.isPublic !== "boolean") return bad("INPUT_INVALID", "다시 시도해 주세요.");
    return await social.setPublic(user.id, ctx.body.isPublic) ? json({ ok: true, isPublic: ctx.body.isPublic }) : bad("STORAGE_UNAVAILABLE", "저장하지 못했어요.", 503);
  }
  if (action === "stories") {
    const offset = Math.max(0, Number(ctx.request.nextUrl.searchParams.get("offset")) || 0);
    return json({ items: (await social.stories(user.id, user.id, "latest", PAGE, offset)).map(publicStory), total: await social.storyCount(user.id) });
  }
  if (action === "story-share") {
    const id = typeof ctx.body.id === "string" && /^[0-9a-f-]{36}$/.test(ctx.body.id) ? ctx.body.id : null;
    const meta = id ? await social.storyMeta(id) : null;
    if (!id || !meta || meta.ownerId !== user.id) return bad("NOT_FOUND", "이야기를 찾지 못했어요.", 404);
    if (meta.hiddenAt && ctx.body.shared === true) return bad("HIDDEN", "신고가 쌓여 숨겨진 이야기는 올릴 수 없어요.", 409);
    return await social.setStoryShared(user.id, id, ctx.body.shared === true) ? json({ ok: true, shared: ctx.body.shared === true }) : bad("STORAGE_UNAVAILABLE", "저장하지 못했어요.", 503);
  }

  // 기록판 · 보고서: 자가 질문지를 마친 주인만
  if (!profile.selfCompletedAt) return bad("SELF_REQUIRED", "나에 대한 질문을 먼저 마쳐 주세요.", 409);
  const [self, board, issues] = await Promise.all([store.selfAnswers(user.id), store.board(user.id), social.issues(user.id)]);
  if (action === "board") return json({ board: boardView(self, board, issues, now), issues });
  if (action === "reports") {
    const no = Number(ctx.request.nextUrl.searchParams.get("no"));
    if (Number.isInteger(no) && no > 0) { const snap = await social.issue(user.id, no); return snap ? json({ snapshot: snap }) : bad("NOT_FOUND", "보고서를 찾지 못했어요.", 404); }
    return json({ issues });
  }
  // report-issue
  const answers = boardView(self, board, issues, now).answers, state = issueState(answers, issues, now);
  if (!state.canIssue) return bad(state.remaining > 0 ? "NOT_READY" : "TOO_SOON", state.remaining > 0 ? `친구 답 60개부터 받을 수 있어요 · ${state.remaining}개 남음` : "다음 호는 일주일 뒤에 받을 수 있어요.", 409);
  const issueNo = (state.latest ?? 0) + 1;
  const previous = state.latest ? await social.issue(user.id, state.latest) : null;
  const stories: ReportStory[] = (await social.stories(user.id, user.id, "latest", 50, 0)).filter(s => !s.hidden && !s.ownerDevice)
    .map(s => ({ id: s.id, kind: s.kind, body: s.body, closeness: s.closeness, hearts: s.hearts, createdAt: s.createdAt }));
  const snapshot = buildReport({ ownerName: profile.name, self, sessions: board, stories, issueNo, seedKey: ctx.seedOf(user.id), issuedAt: now.toISOString(),
    nextIssueAt: new Date(now.getTime() + ISSUE_GAP_DAYS * 86_400_000).toISOString(), previous });
  const done = await social.publishIssue(user.id, issueNo, answers, snapshot);
  if (!done.ok) return bad(done.code, done.code === "TOO_SOON" ? "다음 호는 일주일 뒤에 받을 수 있어요." : "보고서를 만들지 못했어요. 다시 시도해 주세요.", 409);
  return json({ ok: true, issueNo, snapshot });
}

async function space(ctx: SocialCtx, viewer: string | null): Promise<NextResponse> {
  const tab = ctx.request.nextUrl.searchParams.get("tab") === "popular" ? "popular" : "latest";
  const offset = Math.max(0, Number(ctx.request.nextUrl.searchParams.get("offset")) || 0);
  const [items, top] = await Promise.all([
    ctx.social.stories(viewer, null, tab, PAGE, offset),
    offset === 0 ? ctx.social.spaceTop(viewer, new Date(ctx.now.getTime() - 7 * 86_400_000).toISOString()) : Promise.resolve(null),
  ]);
  return ctx.json({ tab, top: top ? publicStory(top) : null, items: items.map(publicStory), more: items.length === PAGE });
}

/** 화면에 보내는 이야기: 받은 사람 · 쓴 사람 계정 id 없이. */
export const publicStory = (s: StoryView) => ({
  id: s.id, kind: s.kind, kindLabel: STORY_KIND_LABEL[s.kind], body: s.body, closeness: s.closeness, handle: s.handle, hearts: s.hearts, hearted: s.hearted, reported: s.reported,
  shared: !!s.sharedAt, hidden: s.hidden, mine: s.ownerDevice, createdAt: s.createdAt,
});
export type PublicStory = ReturnType<typeof publicStory>;

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** 처리 봇 한 줄: 「🚩 모두의 이야기 자동 숨김 · 신고 3건」 + 종류 · 앞 60자 · 이야기 id 앞 8자리. */
export function hiddenAlert(kind: StoryKind, body: string, id: string, count: number): string {
  const head = [...body.replace(/\s+/g, " ")].slice(0, 60).join("");
  return [`🚩 <b>모두의 이야기 자동 숨김</b> · 신고 ${count}건`, `${esc(STORY_KIND_LABEL[kind])} · ${esc(head)}${[...body].length > 60 ? "…" : ""}`, `이야기 ${id.slice(0, 8)} · 확인 후 그대로 두거나 지워 주세요`].join("\n");
}

