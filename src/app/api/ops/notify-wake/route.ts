import { after, NextResponse } from "next/server";

// 운영 Q 4부 「대기표 비우기」 주소. DB 트리거(pg_net)가 새 알림을 넣을 때 깨운다. 내용은 받지 않고(본문 무시) 대기표만 처리한다.
// 같은 줄은 DB 잠금으로 한 번만 보낸다. 분당 호출 수를 DB에서 센다(넘으면 429, 1분 예비 크론이 이어서 보낸다).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const WAKE_MAX_PER_MINUTE = 30;
export async function POST() {
  const [{ defaultBotDeps }, { flushNotifications }] = await Promise.all([import("../../../../lib/ops/notify/deps"), import("../../../../lib/ops/notify/flush")]);
  const deps = defaultBotDeps();
  const gate = await deps.notify.call("wake", { max: WAKE_MAX_PER_MINUTE });
  if (gate.ok !== true) return NextResponse.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (gate.allowed !== true) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429, headers: { "Cache-Control": "no-store" } });
  after(async () => { try { await flushNotifications(deps, 10); } catch { /* 예비 크론이 다시 보낸다 */ } });
  return NextResponse.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
}
