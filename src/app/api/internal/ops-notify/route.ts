import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

// 운영 Q 4부 예비 크론(1분): 미발행 감지 → 알림 대기표 비우기(실패분 재전송) → 처리 봇 메시지 정리 → 12시간 재알림. W4 Q0: + AI 상태 확인(운영만).
// 운영 배포에서는 두 봇의 웹훅·명령 메뉴와 깨우기 주소도 맞춘다(배포가 바뀌면 바로, 그 밖에는 10분마다 확인). 각 단계 실패는 다음 단계를 막지 않는다.
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET, actual = request.headers.get("authorization") ?? "", expected = `Bearer ${secret ?? ""}`;
  if (!secret || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({ ok: false }, { status: 401 });
  const [{ defaultBotDeps }, { runNotifyCycle }, { telegramConfig }, { cronAiHealth }] = await Promise.all([import("../../../../lib/ops/notify/deps"), import("../../../../lib/ops/notify/flush"), import("../../../../lib/ops/notify/telegram"), import("../../../../lib/ops/aiHealth")]);
  const deps = defaultBotDeps(), minute = new Date().getUTCMinutes();
  const production = process.env.VERCEL_ENV === "production";
  // W4 Q0: AI 상태 확인(작가 모델에 1토큰 요청 → 판매 자동 멈춤·재개). 운영 배포에서만 돈다(미리보기·로컬은 부르지 않음 — 비용·판매 상태 보호). 알림 일과 나란히.
  const [out, health] = await Promise.all([
    runNotifyCycle(deps, {
      webhooks: production ? { config: telegramConfig(), deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown", full: minute % 10 === 0 } : null,
      purge: minute === 7,
    }),
    production ? cronAiHealth(deps) : Promise.resolve(null),
  ]);
  return NextResponse.json({ ok: true, ...out, health: health ? { result: health.result, changed: health.changed } : null }, { headers: { "Cache-Control": "no-store" } });
}
