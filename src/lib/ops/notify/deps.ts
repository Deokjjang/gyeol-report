import "server-only";
import { defaultAdminDeps } from "../admin/actions";
import { adminUserIds } from "../config";
import { createOpsStores } from "../store";
import type { BotDeps } from "./bots";
import { tossPaymentMethodReader, type NotifyDeps } from "./flush";
import { createTelegram, telegramConfig } from "./telegram";

type Env = Readonly<Record<string, string | undefined>>;
/** 누나 계정(시험 결제·이벤트 확인용, 2026-11-10 덕짱님 지시). 서버 전용 파일에 둔다(화면 묶음에 계정 id가 실리지 않게). */
export const SISTER_TEST_USER_ID = "d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55";
/**
 * 시험 계정 = 관리자(ADMIN_USER_IDS) + 누나 계정. 매출 봇 /today·/month 집계와 앞으로의 퍼널 집계에서 뺀다(알림은 보내되 「시험」 표시).
 * 1분 크론이 DB(ops_settings 'test_accounts')에 맞추고, SQL 집계는 public.ops_test_user(uuid)로 뺀다(migration 20261110200000).
 */
export function testAccountIds(env: Env = process.env): string[] { return [...new Set([...adminUserIds(env), SISTER_TEST_USER_ID].map(s => s.toLowerCase()))].sort(); }
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
    testAccounts: testAccountIds(env),
    signup: stores.signup, funnel: stores.funnel,
  };
  return { ...notify, admin: defaultAdminDeps(env), adminId: adminUserIds(env)[0] ?? null, audit: e => stores.audit(e), db, env };
}
