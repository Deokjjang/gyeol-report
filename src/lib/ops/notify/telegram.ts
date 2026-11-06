import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 텔레그램 봇 두 개(운영 Q 5·6부). 서버에서만 쓴다 — 토큰은 이 파일 밖(화면·로그·DB)으로 나가지 않는다.
 * - 💳 매출 봇(TELEGRAM_SALES_BOT_TOKEN): 결제·환불만.  - 📮 처리 봇(TELEGRAM_OPS_BOT_TOKEN): 판단이 필요한 것만.
 * - TELEGRAM_OWNER_ID: 덕짱님 텔레그램 id. 이 id에서 온 메시지·버튼만 처리하고, 알림도 이 id로만 보낸다.
 * - 웹훅 비밀값(secret_token)은 따로 두지 않고 봇 토큰에서 HMAC으로 만든다(요청마다 검증).
 */
type Env = Readonly<Record<string, string | undefined>>;
export type BotName = "sales" | "ops";
export const BOTS: readonly BotName[] = ["sales", "ops"];
export type TelegramConfig = { tokens: Record<BotName, string | null>; ownerId: string | null };
export type TelegramResult = { ok: true; result: unknown } | { ok: false; code: string };
export type Telegram = { configured(bot: BotName): boolean; ownerId: string | null; call(bot: BotName, method: string, body: Record<string, unknown>): Promise<TelegramResult> };

const TOKEN_RE = /^\d{5,20}:[A-Za-z0-9_-]{30,80}$/;
const OWNER_RE = /^\d{3,20}$/;
export const TELEGRAM_TIMEOUT_MS = 8_000;
/** 운영 주소(웹훅·깨우기). 다른 배포(Preview·로컬)는 웹훅을 바꾸지 않는다. */
export const OPS_PUBLIC_ORIGIN = "https://www.gyeolreport.com";
export const webhookPath = (bot: BotName) => `/api/telegram/${bot}`;
export const WAKE_PATH = "/api/ops/notify-wake";

export function telegramConfig(env: Env = process.env): TelegramConfig {
  const t = (v: string | undefined) => (v && TOKEN_RE.test(v.trim()) ? v.trim() : null);
  const owner = env.TELEGRAM_OWNER_ID?.trim();
  return { tokens: { sales: t(env.TELEGRAM_SALES_BOT_TOKEN), ops: t(env.TELEGRAM_OPS_BOT_TOKEN) }, ownerId: owner && OWNER_RE.test(owner) ? owner : null };
}

/** 웹훅 비밀값: HMAC-SHA256(봇 토큰, 고정 문구) 16진수 64자(텔레그램 허용 문자 A-Za-z0-9_-). */
export function webhookSecret(token: string): string { return createHmac("sha256", token).update("gyeol-telegram-webhook-v1").digest("hex"); }
export function webhookSecretMatches(bot: BotName, header: string | null, config: TelegramConfig): boolean {
  const token = config.tokens[bot];
  if (!token || !header || header.length !== 64) return false;
  return timingSafeEqual(Buffer.from(header), Buffer.from(webhookSecret(token)));
}

/** 봇 API 호출. 실패는 코드만 돌려준다(토큰이 든 주소·응답 원문은 남기지 않는다). */
export function createTelegram(config: TelegramConfig = telegramConfig(), fetchImpl: typeof fetch = fetch, timeoutMs = TELEGRAM_TIMEOUT_MS): Telegram {
  return {
    ownerId: config.ownerId,
    configured: bot => Boolean(config.tokens[bot] && config.ownerId),
    async call(bot, method, body) {
      const token = config.tokens[bot];
      if (!token) return { ok: false, code: "TELEGRAM_UNSET" };
      if (!/^[A-Za-z]{3,40}$/.test(method)) return { ok: false, code: "TELEGRAM_METHOD" };
      const abort = new AbortController(), timer = setTimeout(() => abort.abort(), timeoutMs);
      try {
        const r = await fetchImpl(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: abort.signal, cache: "no-store" });
        const j = await r.json().catch(() => null) as { ok?: boolean; result?: unknown; description?: unknown; parameters?: { retry_after?: number } } | null;
        if (r.ok && j?.ok === true) return { ok: true, result: j.result };
        const why = typeof j?.description === "string" ? j.description.replace(/[^\p{L}\p{N} :_.,'()-]/gu, "").slice(0, 120) : "";
        return { ok: false, code: `TG_${r.status}${why ? `:${why}` : ""}` };
      } catch (e) {
        return { ok: false, code: (e as Error)?.name === "AbortError" ? "TG_TIMEOUT" : "TG_NETWORK" };
      } finally { clearTimeout(timer); }
    },
  };
}

export const messageIdOf = (r: TelegramResult): number | null => {
  if (!r.ok || !r.result || typeof r.result !== "object") return null;
  const id = (r.result as { message_id?: unknown }).message_id;
  return typeof id === "number" && Number.isSafeInteger(id) ? id : null;
};
