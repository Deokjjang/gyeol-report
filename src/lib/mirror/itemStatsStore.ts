import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import type { ItemStatsInput } from "./itemStats";

/**
 * 문항 점검 화면(/admin/mirror-items)용 읽기 전용 조회(service_role, 서버 전용). 쓰기 · RPC · 새 SQL 없음.
 * 표가 아직 없으면(운영 DB에 migration 적용 전) NO_TABLES. 표마다 1,000행씩 최대 PAGE_LIMIT쪽까지 읽고, 넘으면 capped.
 */
export type ItemStatsLoad = { ok: true; value: ItemStatsInput; capped: boolean } | { ok: false; code: "NO_CONFIG" | "NO_TABLES" | "READ_FAILED" };
const PAGE = 1000, PAGE_LIMIT = 200;
type Err = { code?: string; message?: string } | null;
const missingTable = (e: Err) => !!e && (e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message ?? ""));

export async function loadItemStatsInput(): Promise<ItemStatsLoad> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return { ok: false, code: "NO_CONFIG" };
  const db = createSupabaseServerClient();
  let capped = false;
  async function all<T>(table: string, columns: string, order: readonly string[]): Promise<T[]> {
    const out: T[] = [];
    for (let page = 0; page < PAGE_LIMIT; page++) {
      let q = db.from(table).select(columns);
      for (const c of order) q = q.order(c, { ascending: true });
      const { data, error } = await q.range(page * PAGE, page * PAGE + PAGE - 1);
      if (error) throw Object.assign(new Error("READ"), { db: error });
      const rows = (data ?? []) as unknown as T[];
      out.push(...rows);
      if (rows.length < PAGE) return out;
    }
    capped = true;
    return out;
  }
  try {
    const [self, sessions, answers, devices, voids] = await Promise.all([
      all<{ user_id: string; item_id: string; item_version: number; choice: number }>("mirror_self_answers", "user_id,item_id,item_version,choice", ["user_id", "item_id", "item_version"]),
      all<{ id: string; owner_id: string; device_hash: string; linked_user_id: string | null }>("mirror_friend_sessions", "id,owner_id,device_hash,linked_user_id", ["id"]),
      all<{ session_id: string; item_id: string; item_version: number; choice: number }>("mirror_friend_answers", "session_id,item_id,item_version,choice", ["session_id", "item_id"]),
      all<{ device_hash: string; user_id: string }>("mirror_devices", "device_hash,user_id", ["device_hash", "user_id"]),
      all<{ session_id: string }>("mirror_session_voids", "session_id", ["session_id"]),
    ]);
    return {
      ok: true, capped,
      value: {
        self: self.map(r => ({ userId: r.user_id, itemId: r.item_id, version: Number(r.item_version), choice: Number(r.choice) })),
        sessions: sessions.map(r => ({ id: r.id, ownerId: r.owner_id, deviceHash: r.device_hash, linkedUserId: r.linked_user_id ?? null })),
        answers: answers.map(r => ({ sessionId: r.session_id, itemId: r.item_id, version: Number(r.item_version), choice: Number(r.choice) })),
        devices: devices.map(r => ({ deviceHash: r.device_hash, userId: r.user_id })),
        voids: voids.map(r => r.session_id),
      },
    };
  } catch (e) {
    return { ok: false, code: missingTable((e as { db?: Err }).db ?? null) ? "NO_TABLES" : "READ_FAILED" };
  }
}
