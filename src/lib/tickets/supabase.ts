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

/** onFreeBook(F 후속 퍼널): 접수 직전 spend가 가입 이용권을 원장으로 옮겼을 때(= 가입 이용권으로 책 시작). */
export function createTicketPublicationStore(opts: { onFreeBook?(user: string): void } = {}): TicketPublicationStore {
  const db = createSupabaseServerClient();
  return { async call(action, user, data = {}) {
    // P 추가 E: 결제 화면에서 이용권을 쓰면(「내가 쓰기」 없이) 남은 이벤트·보상 이용권도 함께 센다 → 접수 직전에 기한 가장 빠른 1장을 원장으로 옮긴다.
    // 옮길 것이 없거나 실패해도 접수는 그대로 진행한다(원장에 이용권이 없으면 기존처럼 NO_USABLE_TICKET).
    if (action === "enqueue" && user) await db.rpc("ops_gift", { p_action: "spend", p_data: { userId: user, requestId: data.requestId, productType: data.productType } }).abortSignal(AbortSignal.timeout(10_000)).then(r => {
      if (isRecord(r.data) && r.data.moved === true && r.data.kind === "signup") opts.onFreeBook?.(user);
    }, () => undefined);
    const result = await db.rpc("report_ticket_publication", { p_action: action, p_user: user, p_data: data }).abortSignal(AbortSignal.timeout(15_000));
    return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean" ? result.data as TicketResult : { ok: false, code: "STORAGE_UNAVAILABLE" };
  } };
}
