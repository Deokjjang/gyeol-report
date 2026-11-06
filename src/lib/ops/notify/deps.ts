import "server-only";
import { defaultAdminDeps } from "../admin/actions";
import { adminUserIds } from "../config";
import { createOpsStores } from "../store";
import type { BotDeps } from "./bots";
import { tossPaymentMethodReader, type NotifyDeps } from "./flush";
import { createTelegram, telegramConfig } from "./telegram";

type Env = Readonly<Record<string, string | undefined>>;
/** 운영 기본 의존성(service_role 저장소 + 텔레그램 + 토스 결제 조회). 시험은 각 함수에 대역을 넘긴다. */
export function defaultBotDeps(env: Env = process.env): BotDeps {
  const stores = createOpsStores(env), db = stores.db;
  const notify: NotifyDeps = {
    notify: stores.notify,
    tg: createTelegram(telegramConfig(env)),
    now: () => Date.now(),
    paymentMethod: tossPaymentMethodReader(env),
    async setting(key) {
      if (!db) return null;
      try { const { data } = await db.from("ops_settings").select("value").eq("key", key).maybeSingle(); return data?.value && typeof data.value === "object" ? data.value as Record<string, unknown> : null; } catch { return null; }
    },
    async putSetting(key, value) {
      if (!db) return false;
      try { const { data, error } = await db.rpc("ops_notify_put_setting", { p_key: key, p_value: value }); return !error && data === true; } catch { return false; }
    },
  };
  return { ...notify, admin: defaultAdminDeps(env), adminId: adminUserIds(env)[0] ?? null, audit: e => stores.audit(e), db, env };
}
