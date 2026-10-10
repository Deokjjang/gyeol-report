import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { isRecord } from "../report-generation/productPublishGate";
import type { TicketStore, TicketResult } from "./service";
import type { TicketPublicationStore } from "./publication";
// Constructors are called only after the route's gates/authentication checks.
export function createTicketStore(): TicketStore {
  const db = createSupabaseServerClient();
  return { async call(action, user, data = {}) {
    const result = await db.rpc("report_tickets", { p_action: action, p_user: user, p_data: data });
    return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean" ? result.data as TicketResult : { ok: false, code: "STORAGE_UNAVAILABLE" };
  } };
}

export function createTicketPublicationStore(): TicketPublicationStore {
  const db = createSupabaseServerClient();
  return { async call(action, user, data = {}) {
    const result = await db.rpc("report_ticket_publication", { p_action: action, p_user: user, p_data: data }).abortSignal(AbortSignal.timeout(15_000));
    return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean" ? result.data as TicketResult : { ok: false, code: "STORAGE_UNAVAILABLE" };
  } };
}
