import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { isRecord } from "../report-generation/productPublishGate";
import type { TicketStore, TicketResult } from "./service";
// No caller in an active public flow. Only summary/history are wired behind the
// closed account gate; grants/redemption/worker activation require later review.
export function createTicketStore(): TicketStore {
  const db = createSupabaseServerClient();
  return { async call(action, user, data = {}) {
    const result = await db.rpc("report_tickets", { p_action: action, p_user: user, p_data: data });
    return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean" ? result.data as TicketResult : { ok: false, code: "STORAGE_UNAVAILABLE" };
  } };
}
