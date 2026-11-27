import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { MIRROR_ITEM_BY_ID } from "../../data/mirror/items";
import type { Choice, Closeness, FriendChoice, FriendSession, SelfAnswers } from "./engine";
import type { MirrorProfile, MirrorStore, SaveProfileResult } from "./api";
import type { ReportSnapshot } from "./report/types";
import type { FriendSessionRow, IssueRow, SocialStore, StoryView } from "./social";
import type { StoryKind } from "../../data/mirror/stories";

/** 「남이 본 나」 저장소(service_role, 서버 전용). 표는 supabase/migrations/20261127120000_mirror_core.sql · 20261128090000_mirror_social.sql. */
export function createMirrorStore(): (MirrorStore & SocialStore) | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const db = createSupabaseServerClient();
  const toProfile = (r: Record<string, unknown>): MirrorProfile => ({
    name: String(r.display_name), handle: String(r.handle), handleChangedAt: (r.handle_changed_at as string | null) ?? null,
    birthDate: (r.birth_date as string | null) ?? null, birthTime: r.birth_time ? String(r.birth_time).slice(0, 5) : null,
    isPublic: r.is_public !== false, selfCompletedAt: (r.self_completed_at as string | null) ?? null,
  });
  return {
    async profile(userId) {
      const { data, error } = await db.from("mirror_profiles").select("display_name,handle,handle_changed_at,birth_date,birth_time,is_public,self_completed_at").eq("user_id", userId).maybeSingle();
      if (error) throw new Error("MIRROR_PROFILE_READ");
      return data ? toProfile(data) : null;
    },
    async resolveHandle(handle) {
      const cur = await db.from("mirror_profiles").select("display_name,is_public").eq("handle", handle).maybeSingle();
      if (cur.error) throw new Error("MIRROR_HANDLE_READ");
      if (cur.data) return { status: "current", name: String(cur.data.display_name), isPublic: cur.data.is_public !== false };
      const old = await db.from("mirror_handle_history").select("user_id").eq("handle", handle).maybeSingle();
      if (old.error) throw new Error("MIRROR_HANDLE_READ");
      if (!old.data) return null;
      const now = await db.from("mirror_profiles").select("handle").eq("user_id", old.data.user_id).maybeSingle();
      return now.data ? { status: "moved", handle: String(now.data.handle) } : null;
    },
    async handleTaken(handle, userId) {
      const [p, h, r] = await Promise.all([
        db.from("mirror_profiles").select("user_id").eq("handle", handle).maybeSingle(),
        db.from("mirror_handle_history").select("user_id").eq("handle", handle).maybeSingle(),
        db.from("mirror_retired_handles").select("handle").eq("handle", handle).maybeSingle(),
      ]);
      if (p.error || h.error || r.error) throw new Error("MIRROR_HANDLE_READ");
      return !!r.data || [p.data, h.data].some(x => x && x.user_id !== userId);
    },
    async saveProfile(userId, input): Promise<SaveProfileResult> {
      const { data, error } = await db.rpc("mirror_save_profile_v2", { p_user: userId, p_name: input.name, p_handle: input.handle, p_birth_date: input.birthDate, p_birth_time: input.birthTime, p_age14: input.age14 });
      if (error || !data || typeof data !== "object") return { ok: false, code: "STORAGE_UNAVAILABLE" };
      return data as SaveProfileResult;
    },
    async selfAnswers(userId) {
      const { data, error } = await db.from("mirror_self_answers").select("item_id,item_version,choice").eq("user_id", userId);
      if (error) throw new Error("MIRROR_SELF_READ");
      const out: Record<string, Choice> = {};
      for (const r of data ?? []) if (MIRROR_ITEM_BY_ID.get(r.item_id)?.version === r.item_version && (r.choice === 0 || r.choice === 1)) out[r.item_id] = r.choice;
      return out as SelfAnswers;
    },
    async saveSelfAnswer(userId, itemId, version, choice) {
      const { error } = await db.from("mirror_self_answers").upsert({ user_id: userId, item_id: itemId, item_version: version, choice, answered_at: new Date().toISOString() }, { onConflict: "user_id,item_id,item_version" });
      return !error;
    },
    async completeSelf(userId) {
      const { error } = await db.from("mirror_profiles").update({ self_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", userId).is("self_completed_at", null);
      return !error;
    },
    async touchDevice(deviceHash, userId) {
      await db.from("mirror_devices").upsert({ device_hash: deviceHash, user_id: userId, last_seen_at: new Date().toISOString() }, { onConflict: "device_hash,user_id" });
    },
    async board(userId) {
      // 무효 세션(사람이 불가능한 속도)은 점수 · 순위 · 보고서 어디에도 넣지 않는다.
      const [{ data, error }, voids] = await Promise.all([
        db.rpc("mirror_owner_board", { p_owner: userId }),
        db.from("mirror_session_voids").select("session_id, mirror_friend_sessions!inner(owner_id)").eq("mirror_friend_sessions.owner_id", userId),
      ]);
      if (error || !Array.isArray(data) || voids.error) throw new Error("MIRROR_BOARD_READ");
      const voided = new Set((voids.data ?? []).map(v => String((v as { session_id: string }).session_id)));
      return (data as Array<{ id: string; closeness: Closeness; ownerDevice: boolean; golden: boolean; answers: [string, number, number][] }>).filter(s => !voided.has(s.id)).map((s): FriendSession => ({
        id: s.id, closeness: s.closeness, ownerDevice: s.ownerDevice === true, golden: s.golden === true,
        answers: s.answers.filter(([id, v]) => MIRROR_ITEM_BY_ID.get(id)?.version === v).map(([itemId, , c]) => ({ itemId, choice: (c === 2 ? "skip" : c) as FriendChoice })),
      }));
    },
    async contactName(userId) {
      const { data, error } = await db.from("account_contacts").select("full_name").eq("user_id", userId).maybeSingle();
      return error || !data?.full_name ? null : String(data.full_name);
    },
    async mintHandoff(tokenHash, deviceToken, next, expiresAt) {
      await db.from("mirror_handoffs").delete().lt("expires_at", new Date().toISOString());
      const { error } = await db.from("mirror_handoffs").insert({ token_hash: tokenHash, device_token: deviceToken, next_path: next, expires_at: expiresAt });
      return !error;
    },
    async redeemHandoff(tokenHash, nowIso) {
      // 한 번만: 아직 안 쓴 · 안 지난 행만 used_at을 채우며 기기 토큰을 지운다(같은 토큰으로 두 번 오면 두 번째는 null).
      const { data: row, error } = await db.from("mirror_handoffs").select("device_token,next_path").eq("token_hash", tokenHash).is("used_at", null).gt("expires_at", nowIso).maybeSingle();
      if (error || !row) return null;
      const { data: claimed } = await db.from("mirror_handoffs").update({ used_at: nowIso, device_token: null }).eq("token_hash", tokenHash).is("used_at", null).select("token_hash");
      return claimed?.length ? { deviceToken: row.device_token ?? null, next: row.next_path } : null;
    },

    // ---------- 명령 2: 친구 응답 · 공유 · 이야기 · 보고서 호 ----------
    async ownerByHandle(handle) {
      const { data, error } = await db.from("mirror_profiles").select("user_id,display_name,handle,is_public,self_completed_at").eq("handle", handle).maybeSingle();
      if (error) throw new Error("MIRROR_OWNER_READ");
      return data ? { userId: String(data.user_id), name: String(data.display_name), handle: String(data.handle), isPublic: data.is_public !== false, selfCompletedAt: (data.self_completed_at as string | null) ?? null } : null;
    },
    async deviceOwnedBy(deviceHash, userId) {
      const { data, error } = await db.from("mirror_devices").select("user_id").eq("device_hash", deviceHash).eq("user_id", userId).maybeSingle();
      if (error) throw new Error("MIRROR_DEVICE_READ");
      return !!data;
    },
    async shareSettings(userId) {
      const { data, error } = await db.from("mirror_share_settings").select("line,show_count").eq("user_id", userId).maybeSingle();
      if (error) throw new Error("MIRROR_SHARE_READ");
      return { line: (data?.line as string | null) ?? null, showCount: data?.show_count === true };
    },
    async saveShareSettings(userId, v) {
      const { error } = await db.from("mirror_share_settings").upsert({ user_id: userId, line: v.line, show_count: v.showCount, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      return !error;
    },
    async setPublic(userId, isPublic) {
      const { error } = await db.from("mirror_profiles").update({ is_public: isPublic, updated_at: new Date().toISOString() }).eq("user_id", userId);
      return !error;
    },
    async friendSession(ownerId, deviceHash): Promise<FriendSessionRow | null> {
      const { data, error } = await db.from("mirror_friend_sessions").select("id,closeness,ended_at,golden").eq("owner_id", ownerId).eq("device_hash", deviceHash).order("started_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw new Error("MIRROR_FRIEND_READ");
      if (!data) return null;
      const [answers, story] = await Promise.all([
        db.from("mirror_friend_answers").select("item_id,item_version,choice,answered_at").eq("session_id", data.id),
        db.from("mirror_stories").select("id").eq("session_id", data.id).maybeSingle(),
      ]);
      if (answers.error || story.error) throw new Error("MIRROR_FRIEND_READ");
      return {
        id: String(data.id), closeness: data.closeness as Closeness, endedAt: (data.ended_at as string | null) ?? null, golden: data.golden === true, hasStory: !!story.data,
        answers: (answers.data ?? []).filter(a => MIRROR_ITEM_BY_ID.get(a.item_id)?.version === a.item_version)
          .map(a => ({ itemId: String(a.item_id), choice: (a.choice === 2 ? "skip" : a.choice) as FriendChoice, at: Date.parse(String(a.answered_at)) })),
      };
    },
    async createFriendSession(ownerId, closeness, deviceHash, linkedUserId) {
      const { data, error } = await db.from("mirror_friend_sessions").insert({ owner_id: ownerId, closeness, device_hash: deviceHash, linked_user_id: linkedUserId }).select("id").single();
      return error || !data ? null : String(data.id);
    },
    async saveFriendAnswer(sessionId, itemId, version, choice) {
      const { error } = await db.from("mirror_friend_answers").upsert({ session_id: sessionId, item_id: itemId, item_version: version, choice, answered_at: new Date().toISOString() }, { onConflict: "session_id,item_id" });
      return !error;
    },
    async voidSession(sessionId) {
      await db.from("mirror_session_voids").upsert({ session_id: sessionId, reason: "too_fast" }, { onConflict: "session_id", ignoreDuplicates: true });
    },
    async finishFriendSession(sessionId, golden) {
      const { error } = await db.from("mirror_friend_sessions").update({ ended_at: new Date().toISOString(), golden }).eq("id", sessionId);
      return !error;
    },
    async itemCounts(ownerId) {
      const { data, error } = await db.rpc("mirror_item_counts", { p_owner: ownerId });
      if (error || !data || typeof data !== "object") throw new Error("MIRROR_COUNTS_READ");
      return new Map(Object.entries(data as Record<string, number>).map(([k, v]) => [k, Number(v) || 0]));
    },
    async rateHit(key, windowSeconds) {
      const { data, error } = await db.rpc("mirror_rate_hit", { p_key: key, p_window_seconds: windowSeconds });
      return error ? 0 : Number(data) || 0;
    },
    async linkFriendSessions(deviceHash, userId) {
      await db.from("mirror_friend_sessions").update({ linked_user_id: userId }).eq("device_hash", deviceHash).is("linked_user_id", null);
    },
    async saveStory(v) {
      const { error } = await db.from("mirror_stories").insert({ owner_id: v.ownerId, session_id: v.sessionId, writer_user_id: v.writerUserId, show_handle: v.showHandle, owner_device: v.ownerDevice, kind: v.kind, closeness: v.closeness, body: v.body });
      if (!error) return "ok";
      return error.code === "23505" ? "exists" : "failed";
    },
    async stories(viewer, ownerId, sort, limit, offset) {
      const { data, error } = await db.rpc("mirror_stories_view", { p_viewer: viewer, p_owner: ownerId, p_sort: sort, p_limit: limit, p_offset: offset });
      if (error || !Array.isArray(data)) throw new Error("MIRROR_STORIES_READ");
      return (data as Record<string, unknown>[]).map(toStory);
    },
    async spaceTop(viewer, since) {
      const { data, error } = await db.rpc("mirror_space_top", { p_viewer: viewer, p_since: since });
      if (error) throw new Error("MIRROR_SPACE_READ");
      return data && typeof data === "object" ? toStory(data as Record<string, unknown>) : null;
    },
    async storyMeta(id) {
      const { data, error } = await db.from("mirror_stories").select("owner_id,shared_at,hidden_at,kind,body").eq("id", id).maybeSingle();
      if (error) throw new Error("MIRROR_STORY_READ");
      return data ? { ownerId: String(data.owner_id), sharedAt: (data.shared_at as string | null) ?? null, hiddenAt: (data.hidden_at as string | null) ?? null, kind: data.kind as StoryKind, body: String(data.body) } : null;
    },
    async setStoryShared(ownerId, id, shared) {
      const { error } = await db.from("mirror_stories").update({ shared_at: shared ? new Date().toISOString() : null }).eq("id", id).eq("owner_id", ownerId);
      return !error;
    },
    async heart(id, userId, on) {
      const { error } = on ? await db.from("mirror_story_hearts").upsert({ story_id: id, user_id: userId }, { onConflict: "story_id,user_id", ignoreDuplicates: true })
        : await db.from("mirror_story_hearts").delete().eq("story_id", id).eq("user_id", userId);
      return !error;
    },
    async reportStory(id, userId) {
      const { data, error } = await db.rpc("mirror_story_report", { p_story: id, p_user: userId });
      if (error || !data || (data as { ok?: boolean }).ok !== true) return null;
      const r = data as { count: number; hiddenNow: boolean };
      return { count: Number(r.count) || 0, hiddenNow: r.hiddenNow === true };
    },
    async storyCount(ownerId) {
      const { count, error } = await db.from("mirror_stories").select("id", { count: "exact", head: true }).eq("owner_id", ownerId);
      if (error) throw new Error("MIRROR_STORIES_READ");
      return count ?? 0;
    },
    async issues(ownerId): Promise<IssueRow[]> {
      const { data, error } = await db.from("mirror_report_issues").select("issue_no,issued_at,answers,title:snapshot->verdict->>title").eq("owner_id", ownerId).order("issue_no", { ascending: false });
      if (error) throw new Error("MIRROR_ISSUES_READ");
      return (data ?? []).map(r => ({ issueNo: Number(r.issue_no), issuedAt: String(r.issued_at), answers: Number(r.answers), title: String((r as { title?: unknown }).title ?? "") }));
    },
    async issue(ownerId, issueNo) {
      const { data, error } = await db.from("mirror_report_issues").select("snapshot").eq("owner_id", ownerId).eq("issue_no", issueNo).maybeSingle();
      if (error) throw new Error("MIRROR_ISSUE_READ");
      return data ? data.snapshot as ReportSnapshot : null;
    },
    async publishIssue(ownerId, issueNo, answers, snapshot) {
      const { data, error } = await db.rpc("mirror_issue_report", { p_owner: ownerId, p_issue_no: issueNo, p_answers: answers, p_snapshot: snapshot });
      if (error || !data) return { ok: false, code: "STORAGE_UNAVAILABLE" };
      const r = data as { ok: boolean; code?: string; nextAt?: string };
      return r.ok ? { ok: true } : { ok: false, code: r.code ?? "FAILED", nextAt: r.nextAt };
    },
    async withdraw(userId) {
      const { data, error } = await db.rpc("mirror_withdraw", { p_user: userId });
      return !error && (data as { ok?: boolean } | null)?.ok === true;
    },
  };
}

function toStory(r: Record<string, unknown>): StoryView {
  return {
    id: String(r.id), kind: r.kind as StoryKind, body: String(r.body), closeness: Number(r.closeness) as Closeness, ownerDevice: r.ownerDevice === true,
    sharedAt: (r.sharedAt as string | null) ?? null, createdAt: String(r.created_at), hidden: r.hidden === true, handle: (r.handle as string | null) ?? null,
    hearts: Number(r.hearts) || 0, hearted: r.hearted === true, reported: r.reported === true,
  };
}
