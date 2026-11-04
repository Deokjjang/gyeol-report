import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { withDeadline } from "../network/withDeadline";
import type { OpsStore } from "./generation/sinks";

export type AccountOpsStore = { call(action: string, user: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> };
export type AuditEntry = { actor: "admin" | "system"; actorUserId?: string | null; action: string; target: string; detail?: Record<string, unknown> };
export type OpsStores = { generation: OpsStore; order: OpsStore; gift: OpsStore; comp: OpsStore; recon: OpsStore; account: AccountOpsStore; audit(entry: AuditEntry): Promise<boolean>; db: SupabaseClient | null };
export const OPS_RPC_TIMEOUT_MS = 10_000;

/** 운영 기반 저장소(서버 전용, service_role). 환경이 없으면 모든 호출이 STORAGE_UNAVAILABLE. */
export function createOpsStores(env: Readonly<Record<string, string | undefined>> = process.env): OpsStores {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL, key = env.SUPABASE_SERVICE_ROLE_KEY;
  const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  const rpc = async (fn: string, args: Record<string, unknown>): Promise<Record<string, unknown>> => {
    if (!db) return { ok: false, code: "STORAGE_UNAVAILABLE" };
    try {
      const r = await withDeadline(async signal => await db.rpc(fn, args).abortSignal(signal), OPS_RPC_TIMEOUT_MS);
      return !r.error && r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data as Record<string, unknown> : { ok: false, code: "STORAGE_FAILED" };
    } catch { return { ok: false, code: "STORAGE_FAILED" }; }
  };
  const store = (fn: string): OpsStore => ({ call: (action, data = {}) => rpc(fn, { p_action: action, p_data: data }) });
  return {
    generation: store("ops_generation"), order: store("ops_order"), gift: store("ops_gift"), comp: store("ops_comp"), recon: store("ops_recon"),
    account: { call: (action, user, data = {}) => rpc("ops_account", { p_action: action, p_user: user, p_data: data }) },
    async audit(e) {
      if (!db) return false;
      const { error } = await db.from("ops_audit_log").insert({ actor: e.actor, actor_user_id: e.actorUserId ?? null, action: e.action, target: e.target.slice(0, 120), detail: e.detail ?? {} });
      return !error;
    },
    db,
  };
}
