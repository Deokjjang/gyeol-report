import "server-only";
import { createHash } from "node:crypto";
import { after } from "next/server";
import type { ShareFailureAlarm } from "../../book/shareServer";

/**
 * 책 열람 기록(운영 Q 3부). 서버가 책 본문을 내줄 때 1번. 개인정보 없음 — 기기는 user agent sha256 앞 16자만(같은 기기 30분 안 재열람을 1번으로).
 * 응답을 보낸 뒤(after) 기록해 책 열기 속도에 영향이 없고, 기록 실패(저장소 없음·요청 범위 밖)는 조용히 넘어간다.
 */
export const deviceKey = (ua: string | null | undefined) => (ua ? createHash("sha256").update(ua.slice(0, 600)).digest("hex").slice(0, 16) : null);

export async function recordBookView(reportId: string, ua: string | null): Promise<void> {
  try {
    const { createOpsStores } = await import("../store");
    const stores = createOpsStores();
    if (!stores.db) return;
    await stores.notify.call("record_view", { reportId, device: deviceKey(ua) });
  } catch { /* 기록 실패가 열람을 막지 않는다 */ }
}

/**
 * 공유 실패 기록(운영 Q 추가 경보). 공유 API가 4xx·5xx를 내면 응답을 보낸 뒤 1줄 — DB에는 상태 코드와 책 버전만 남는다
 * (책 id는 DB 함수가 버전을 읽는 데만 쓰고 저장하지 않는다). 10분 3번이면 처리 봇 경보(supabase/migrations/20261107110000_v5_ops_share_alert.sql).
 */
export async function recordShareFailure(status: number, reportId: string | null): Promise<void> {
  try {
    const { createOpsStores } = await import("../store");
    const db = createOpsStores().db;
    if (!db) return;
    await db.rpc("ops_share_failure", { p_status: status, p_report: reportId }).abortSignal(AbortSignal.timeout(10_000));
  } catch { /* 기록 실패가 공유 응답을 바꾸지 않는다(이미 보낸 뒤) */ }
}
/** /api/book-share가 prepareBookShare에 넘기는 경보 함수. 요청 범위 밖(시험 등)이면 기록하지 않는다. */
export const shareFailureAlarm: ShareFailureAlarm = (status, reportId) => {
  try { after(() => recordShareFailure(status, reportId)); } catch { /* 요청 범위 밖 */ }
};

/** 책 화면(Server Component)에서 부른다. 요청 헤더는 after 밖에서 먼저 읽는다. */
export async function scheduleBookView(reportId: string): Promise<void> {
  try {
    const [{ after }, { headers }] = await Promise.all([import("next/server"), import("next/headers")]);
    const ua = (await headers()).get("user-agent");
    after(() => recordBookView(reportId, ua));
  } catch { /* 요청 범위 밖(시험 등) — 기록하지 않는다 */ }
}
