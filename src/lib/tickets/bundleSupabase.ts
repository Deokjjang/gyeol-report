import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { isRecord } from "../report-generation/productPublishGate";
import type { BundleStore, BundleResult } from "./bundleTypes";
export function createBundleStore(): BundleStore {
  const db = createSupabaseServerClient();
  return { async call(action, userId, data = {}) {
    const result = await db.rpc("ticket_bundle_commerce", { p_action: action, p_user: userId, p_data: data }).abortSignal(AbortSignal.timeout(10_000));
    return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean" ? result.data as BundleResult : { ok: false, code: "STORAGE_UNAVAILABLE" };
  } };
}
