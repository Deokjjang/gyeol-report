/**
 * 결제 경로의 같은 고객 이전 Book(최종판2 1-1): 이용권 레인만 이전 책(PriorBooks)을 읽어, 결제 책은 같은 고객의 다른 상품 책 이미지·각도를 피하지 못했다.
 * 주문의 구매자(report_purchase_bindings.buyer_id)가 가진 발행된 v5 Book(결제 + 이용권)을 최근 순으로 읽어 같은 priorBooks 규칙(같은 사람만)에 넘긴다.
 * 읽기만 한다. 실패하면 빈 값(발행은 막지 않는다).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { NO_PRIOR, PRIOR_LIMIT, priorBooks, type PriorBooks } from "../../writer/prior";

type Row = { report_id: string; snapshot_json: unknown; published_at: string | null };

export async function paidPriorBooks(db: SupabaseClient, orderId: string, reportId: string, payload: unknown): Promise<PriorBooks> {
  try {
    const b = await db.from("report_purchase_bindings").select("buyer_id").eq("order_id", orderId).maybeSingle();
    const buyer = (b.data as { buyer_id?: string | null } | null)?.buyer_id;
    if (b.error || !buyer) return NO_PRIOR;
    const orders = await db.from("report_purchase_bindings").select("order_id").eq("buyer_id", buyer).is("revoked_at", null);
    const tickets = await db.from("report_ticket_redemptions").select("id").eq("user_id", buyer);
    const orderIds = ((orders.data ?? []) as { order_id: string }[]).map(x => x.order_id), ticketIds = ((tickets.data ?? []) as { id: string }[]).map(x => x.id);
    const cols = "report_id,snapshot_json,published_at";
    const paid = orderIds.length ? await db.from("paid_report_snapshots").select(cols).in("order_id", orderIds).eq("status", "COMPLETED").not("published_at", "is", null).order("published_at", { ascending: false }).limit(PRIOR_LIMIT) : { data: [] };
    const tick = ticketIds.length ? await db.from("paid_report_snapshots").select(cols).in("ticket_redemption_id", ticketIds).eq("status", "COMPLETED").not("published_at", "is", null).order("published_at", { ascending: false }).limit(PRIOR_LIMIT) : { data: [] };
    const rows = [...((paid.data ?? []) as Row[]), ...((tick.data ?? []) as Row[])].filter(r => r.report_id !== reportId)
      .sort((x, y) => String(y.published_at).localeCompare(String(x.published_at))).slice(0, PRIOR_LIMIT);
    const by = new Map(rows.map(r => [r.report_id, r.snapshot_json]));
    // priorBooks가 쓰는 두 동작(library·read)만 흉내 낸다.
    const reader = { call: async (action: string, _user: unknown, data?: { reportId?: string }) => action === "library"
      ? { ok: true, items: rows.map(r => ({ reportId: r.report_id, status: "available" })) }
      : { ok: by.has(data?.reportId ?? ""), snapshot: by.get(data?.reportId ?? "") ?? null } };
    return await priorBooks(reader as never, buyer, payload);
  } catch { return NO_PRIOR; }
}
