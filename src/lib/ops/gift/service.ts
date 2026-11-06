/**
 * 이벤트(P6d-ops 6, 설정값으로 켜고 끔): 결제 1건마다 이용권 1장(P 추가 C: 계정당 상한 없음, 친구 첫 결제 보너스 없음).
 * 결제 화면에서 바로 쓰거나(ops_gift 'spend') 선물 링크로 보낸다. 받은 친구는 정보 화면을 마쳐야 받을 수 있다.
 * 기한(P 추가 D): cfg.ticketExpiresAt — 이번 이벤트는 2026-11-30 23:59:59 KST.
 */
import { createHash, randomBytes } from "node:crypto";
import type { GiftEventConfig } from "../config";
import type { OpsStore } from "../generation/sinks";

export const giftTokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function newGiftToken() { const token = randomBytes(24).toString("base64url"); return { token, hash: giftTokenHash(token) }; }
export const validGiftToken = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{32}$/.test(v);

/** 결제 완료 주문 1건 → 이벤트 이용권(조건이 안 맞으면 issued:false). 같은 주문은 한 번만. */
export async function issueGiftForOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  if (!cfg.active) return { ok: true, issued: false, code: "EVENT_OFF" };
  void now;
  return gift.call("issue", { paymentOrderId, start: cfg.start, end: cfg.end, products: cfg.products, expiresAt: cfg.ticketExpiresAt });
}

/** 결제 완료 직후(결제 완료 화면·크론 공통): 이벤트 이용권 발급. 실패해도 결제·발행은 그대로다. */
export async function afterPaidOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  try { return { issued: await issueGiftForOrder(gift, paymentOrderId, cfg, now) }; }
  catch { return null; }
}

/** 이용권 지갑(서재 이용권 줄·결제 화면). SQL ops_gift('wallet'). */
export type TicketWallet = { ledger: number; giftable: number; usable: number; total: number; expiresAt: string | null; sent: number; recipients: number };
export async function readWallet(gift: OpsStore, userId: string): Promise<TicketWallet | null> {
  const r = await gift.call("wallet", { userId });
  if (!r.ok) return null;
  const n = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 ? (v as number) : 0);
  return { ledger: n(r.ledger), giftable: n(r.giftable), usable: n(r.usable), total: n(r.total), expiresAt: typeof r.expiresAt === "string" ? r.expiresAt : null, sent: n(r.sent), recipients: n(r.recipients) };
}
