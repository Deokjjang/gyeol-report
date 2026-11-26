import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { MIRROR_ITEM_BY_ID } from "../../data/mirror/items";
import type { Choice, Closeness, FriendChoice, FriendSession, SelfAnswers } from "./engine";
import type { MirrorProfile, MirrorStore, SaveProfileResult } from "./api";

/** 「남이 본 나」 저장소(service_role, 서버 전용). 표는 supabase/migrations/20261127120000_mirror_core.sql. */
export function createMirrorStore(): MirrorStore | null {
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
      const [p, h] = await Promise.all([
        db.from("mirror_profiles").select("user_id").eq("handle", handle).maybeSingle(),
        db.from("mirror_handle_history").select("user_id").eq("handle", handle).maybeSingle(),
      ]);
      if (p.error || h.error) throw new Error("MIRROR_HANDLE_READ");
      return [p.data, h.data].some(r => r && r.user_id !== userId);
    },
    async saveProfile(userId, input): Promise<SaveProfileResult> {
      const { data, error } = await db.rpc("mirror_save_profile", { p_user: userId, p_name: input.name, p_handle: input.handle, p_birth_date: input.birthDate, p_birth_time: input.birthTime, p_age14: input.age14 });
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
      const { data, error } = await db.rpc("mirror_owner_board", { p_owner: userId });
      if (error || !Array.isArray(data)) throw new Error("MIRROR_BOARD_READ");
      return (data as Array<{ id: string; closeness: Closeness; ownerDevice: boolean; answers: [string, number, number][] }>).map((s): FriendSession => ({
        id: s.id, closeness: s.closeness, ownerDevice: s.ownerDevice === true,
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
  };
}
