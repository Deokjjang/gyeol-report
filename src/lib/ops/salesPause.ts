import "server-only";
import type { OpsStore } from "./generation/sinks";
import { salesPausedMessage } from "./config";

/**
 * W3 P0 4종 판매 중지 스위치 읽기(ops_sales 'status' → ops_settings 'sales_pause'). 쓰기는 처리 봇·자동 멈춤만(SQL 함수 안에서 감사 한 줄).
 * - 못 읽으면(DB 없음·시간 초과·오류) 판매를 계속한다(null → 멈춤 아님).
 * - 결제 준비·주문 생성·승인 직전·이용권 사용은 매번 새로 읽고(fresh), 화면 상태(/api/sales)는 10초 동안 같은 값을 쓴다.
 */
export type SalesPause = { readonly on: boolean; readonly at: string | null; readonly by: string | null; readonly reason: string | null };
export const SALES_PAUSE_READ_MS = 2_500;
export const SALES_PAUSE_CACHE_MS = 10_000;

let defaultStore: OpsStore | null = null;
async function storeOf(store?: OpsStore): Promise<OpsStore> {
  if (store) return store;
  if (!defaultStore) defaultStore = (await import("./store")).createOpsStores().sales;
  return defaultStore;
}
let cache: { at: number; value: SalesPause } | null = null;

const str = (v: unknown) => (typeof v === "string" && v ? v : null);
/** 지금 상태. 못 읽으면 null. maxAgeMs > 0이면 그 안의 캐시를 쓴다. */
export async function readSalesPause(opts: { store?: OpsStore; maxAgeMs?: number; now?: number } = {}): Promise<SalesPause | null> {
  const now = opts.now ?? Date.now();
  if (opts.maxAgeMs && cache && now - cache.at >= 0 && now - cache.at < opts.maxAgeMs) return cache.value;
  try {
    const store = await storeOf(opts.store);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), SALES_PAUSE_READ_MS); });
    const r = await Promise.race([store.call("status", {}), timeout]).finally(() => clearTimeout(timer));
    if (!r || r.ok !== true || typeof r.on !== "boolean") return null;
    const value: SalesPause = { on: r.on, at: str(r.at), by: str(r.by), reason: str(r.reason) };
    cache = { at: now, value };
    return value;
  } catch { return null; }
}
/** 판매 진입점용: 멈춤이면 true. 못 읽으면 false(판매 계속). */
export async function salesPaused(opts: { store?: OpsStore; maxAgeMs?: number; now?: number } = {}): Promise<boolean> {
  return (await readSalesPause(opts))?.on === true;
}
/** W4 Q0: 멈춤이면 이유에 맞는 고객 문구, 아니면(또는 못 읽으면) null. 판매 진입점이 막을 때 쓴다(매번 새로 읽음 — 막기 판단과 같은 읽기 1번). */
export async function salesPauseNotice(opts: { store?: OpsStore; maxAgeMs?: number; now?: number } = {}): Promise<string | null> {
  const p = await readSalesPause(opts);
  return p?.on === true ? salesPausedMessage(p.reason) : null;
}
/** 시험용: 캐시·기본 저장소 비우기. */
export function resetSalesPauseCache() { cache = null; defaultStore = null; }
