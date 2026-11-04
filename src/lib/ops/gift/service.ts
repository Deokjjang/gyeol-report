/**
 * 이벤트(P6d-ops 6, 설정값으로 켜고 끔): 결제 1건마다 이용권 1장(계정당 상한). 본인이 쓰거나 선물 링크로 보낸다.
 * 받은 친구는 정보 화면을 마쳐야 받을 수 있고, 그 친구가 첫 결제를 하면 보낸 사람에게 1장을 더 준다.
 */
import { createHash, randomBytes } from "node:crypto";
import type { GiftEventConfig } from "../config";
import type { OpsStore } from "../generation/sinks";

const DAY = 86_400_000;
export const giftTokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function newGiftToken() { const token = randomBytes(24).toString("base64url"); return { token, hash: giftTokenHash(token) }; }
export const validGiftToken = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{32}$/.test(v);

/** 결제 완료 주문 1건 → 이벤트 이용권(조건이 안 맞으면 issued:false). 같은 주문은 한 번만. */
export async function issueGiftForOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  if (!cfg.active) return { ok: true, issued: false, code: "EVENT_OFF" };
  return gift.call("issue", { paymentOrderId, start: cfg.start, end: cfg.end, products: cfg.products, maxPerAccount: cfg.maxPerAccount, expiresAt: new Date(now + cfg.validDays * DAY).toISOString() });
}

/** 선물 받은 친구의 첫 결제 → 보낸 사람 +1장(계정당 bonusMax). */
export async function grantGiftBonus(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  if (!cfg.active) return { ok: true, granted: false, code: "EVENT_OFF" };
  return gift.call("bonus", { paymentOrderId, bonusMax: cfg.bonusMax, expiresAt: new Date(now + cfg.validDays * DAY).toISOString() });
}

/** 결제 완료 직후(결제 완료 화면·크론 공통): 보상 발급과 보너스 판정. 실패해도 결제·발행은 그대로다. */
export async function afterPaidOrder(gift: OpsStore, paymentOrderId: string, cfg: GiftEventConfig, now = Date.now()) {
  try { const issued = await issueGiftForOrder(gift, paymentOrderId, cfg, now); const bonus = await grantGiftBonus(gift, paymentOrderId, cfg, now); return { issued, bonus }; }
  catch { return null; }
}
