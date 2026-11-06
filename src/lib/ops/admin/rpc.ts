import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { withDeadline } from "../../network/withDeadline";
import { OPS_RPC_TIMEOUT_MS } from "../store";

export type Json = Record<string, unknown>;
export type AdminRpcAction = "search" | "delayed" | "requests" | "request_done" | "detail" | "legacy_members";

const call = async (db: SupabaseClient | null, fn: string, args: Json): Promise<Json> => {
  if (!db) return { ok: false, code: "STORAGE_UNAVAILABLE" };
  try {
    const r = await withDeadline(async signal => await db.rpc(fn, args).abortSignal(signal), OPS_RPC_TIMEOUT_MS);
    return !r.error && r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data as Json : { ok: false, code: "STORAGE_FAILED" };
  } catch { return { ok: false, code: "STORAGE_FAILED" }; }
};

/** ops_admin(관리자 읽기·요청 처리). 접근 검사는 호출 쪽(ADMIN_USER_IDS). */
export function adminRpc(db: SupabaseClient | null, action: AdminRpcAction, data: Json = {}): Promise<Json> {
  return call(db, "ops_admin", { p_action: action, p_data: data });
}

/** ops_recon(환불 경고·토스 상태 대조·외부 환불·요청 자동 처리)·ops_comp(보상 이용권). 접근 검사는 호출 쪽. */
export function reconRpc(db: SupabaseClient | null, action: string, data: Json = {}): Promise<Json> { return call(db, "ops_recon", { p_action: action, p_data: data }); }
export function compRpc(db: SupabaseClient | null, action: string, data: Json = {}): Promise<Json> { return call(db, "ops_comp", { p_action: action, p_data: data }); }

/** 기존 이용권 지급 RPC(report_tickets 'grant'). 같은 key·sourceRef면 한 번만 지급된다. */
export function grantTickets(db: SupabaseClient | null, userId: string, data: { quantity: number; sourceRef: string; key: string }): Promise<Json> {
  return call(db, "report_tickets", { p_action: "grant", p_user: userId, p_data: { quantity: data.quantity, sourceType: "manual", sourceRef: data.sourceRef, key: data.key, reason: "ADMIN_GRANT" } });
}
