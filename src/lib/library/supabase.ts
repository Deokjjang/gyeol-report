import "server-only";
import { createSupabaseServerClient } from "../db/supabaseServer";
import type { LibraryPort } from "./server";
import type { LibraryRow } from "./model";

// Called only inside the closed account gate, after server getUser verification.
export function createLibraryPort(): LibraryPort {
  const db = createSupabaseServerClient();
  return {
    async bind(b) {
      const { data, error } = await db.rpc("bind_report_purchase", { p_order: b.orderId, p_user: b.buyerId, p_hash: b.claimHash, p_name: b.displayName, p_year: b.selectedYear });
      return !error && data === true;
    },
    async orderForReport(id) {
      const { data, error } = await db.from("paid_report_snapshots").select("order_id").eq("report_id", id).maybeSingle();
      return !error && data ? data.order_id : null;
    },
    async claim(id, user, hash, commit) {
      const { data, error } = await db.rpc("claim_report_account", { p_report: id, p_user: user, p_hash: hash, p_commit: commit });
      if (error) return "unavailable";
      return data === "owned" || data === "claimable" ? data : "unavailable";
    },
    async list(user) {
      // SQL selects metadata only; never selects snapshot_json / input payloads.
      // P 속도: 두 조회는 서로 기다릴 필요가 없어 동시에 부른다(예전에는 줄줄이).
      const [{ data, error }, tickets] = await Promise.all([
        db.rpc("list_account_reports", { p_user: user }),
        db.rpc("report_tickets", { p_action: "library", p_user: user, p_data: {} }),
      ]);
      return !error && Array.isArray(data) && !tickets.error && tickets.data?.ok && Array.isArray(tickets.data.items)
        ? [...(data as LibraryRow[]).map(r => ({ ...r, source: "paid" as const })), ...(tickets.data.items as LibraryRow[]).map(r => ({ ...r, source: "ticket" as const }))] : null;
    },
  };
}
