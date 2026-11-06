import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

// 운영 Q 4부 예비 크론(1분): 미발행 감지 → 알림 대기표 비우기(실패분 재전송) → 처리 봇 메시지 정리 → 12시간 재알림.
// 운영 배포에서는 두 봇의 웹훅·명령 메뉴와 깨우기 주소도 맞춘다(배포가 바뀌면 바로, 그 밖에는 10분마다 확인). 각 단계 실패는 다음 단계를 막지 않는다.
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  const [{ defaultBotDeps }, { runNotifyCycle }, { telegramConfig }] = await Promise.all([import("../../../../lib/ops/notify/deps"), import("../../../../lib/ops/notify/flush"), import("../../../../lib/ops/notify/telegram")]);
  const deps = defaultBotDeps(), minute = new Date().getUTCMinutes();
  const production = process.env.VERCEL_ENV === "production";
  const out = await runNotifyCycle(deps, {
    webhooks: production ? { config: telegramConfig(), deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown", full: minute % 10 === 0 } : null,
    purge: minute === 7,
  });
  return NextResponse.json({ ok: true, ...out }, { headers: { "Cache-Control": "no-store" } });
}
