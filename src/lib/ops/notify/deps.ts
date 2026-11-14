import "server-only";
import { defaultAdminDeps } from "../admin/actions";
import { adminUserIds } from "../config";
import { withDeadline } from "../../network/withDeadline";
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
/**
 * F 후속 「시험 계정 표」(DB public.ops_test_accounts — 관리자 권한과 별개, 집계·메타 전송에서만 뺌)까지 더한 목록.
 * 세션의 「시험」 브라우저 표시와 /api/funnel 회원 단계가 쓴다(SQL 집계는 ops_test_user()가 같은 표를 본다). 60초 캐시, 못 읽으면 직전 값(처음이면 env 목록만).
 */
export const TEST_TABLE_TTL_MS = 60_000;
let testTable: { at: number; ids: readonly string[] } | null = null;
/** DB 표 읽기(service_role, 3초). 못 읽으면 null. */
async function readTestTable(env: Env): Promise<string[] | null> {
  const db = createOpsStores(env).db;
  if (!db) return null;
  try {
    const { data, error } = await withDeadline(async signal => await db.from("ops_test_accounts").select("user_id").limit(200).abortSignal(signal), 3_000);
    return !error && Array.isArray(data) ? data.map(r => String((r as { user_id: unknown }).user_id).toLowerCase()) : null;
  } catch { return null; }
}
export async function liveTestAccountIds(env: Env = process.env, now = Date.now(), read: () => Promise<string[] | null> = () => readTestTable(env)): Promise<Set<string>> {
  if (!testTable || now - testTable.at >= TEST_TABLE_TTL_MS || now < testTable.at) testTable = { at: now, ids: (await read()) ?? testTable?.ids ?? [] };
  return new Set([...testAccountIds(env), ...testTable.ids]);
}
/** 시험용: 캐시 비우기. */
export function resetLiveTestAccounts() { testTable = null; }
/** 운영 기본 의존성(service_role 저장소 + 텔레그램 + 토스 결제 조회). 시험은 각 함수에 대역을 넘긴다. */
export function defaultBotDeps(env: Env = process.env): BotDeps {
  const stores = createOpsStores(env), db = stores.db;
  const notify: NotifyDeps = {
    notify: stores.notify,
    generation: stores.generation,
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
    signup: stores.signup, funnel: stores.funnel, sales: stores.sales,
  };
  return { ...notify, admin: defaultAdminDeps(env), adminId: adminUserIds(env)[0] ?? null, audit: e => stores.audit(e), db, env };
}
