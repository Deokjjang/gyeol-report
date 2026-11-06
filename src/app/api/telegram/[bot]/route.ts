import { NextResponse } from "next/server";

// 운영 Q 5·6부 텔레그램 웹훅(💳 매출 봇 /api/telegram/sales, 📮 처리 봇 /api/telegram/ops).
// 요청마다 비밀값(X-Telegram-Bot-Api-Secret-Token = 봇 토큰 HMAC)을 검증한다. 처리 중 오류여도 200을 돌려 텔레그램 재전송 폭주를 막는다(같은 update는 한 번만 처리).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const BODY_LIMIT = 64 * 1024;
export async function POST(request: Request, context: { params: Promise<{ bot: string }> }) {
  const bot = (await context.params).bot;
  if (bot !== "sales" && bot !== "ops") return NextResponse.json({ ok: false }, { status: 404 });
  const { telegramConfig, webhookSecretMatches } = await import("../../../../lib/ops/notify/telegram");
  if (!webhookSecretMatches(bot, request.headers.get("x-telegram-bot-api-secret-token"), telegramConfig())) return NextResponse.json({ ok: false }, { status: 401 });
  let update: unknown;
  try {
    const text = await request.text();
    if (text.length > BODY_LIMIT) return NextResponse.json({ ok: false }, { status: 413 });
    update = JSON.parse(text);
  } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  try {
    const [{ defaultBotDeps }, { handleUpdate }] = await Promise.all([import("../../../../lib/ops/notify/deps"), import("../../../../lib/ops/notify/bots")]);
    await handleUpdate(bot, update, defaultBotDeps());
  } catch { /* 기록은 감사 로그·대기표에 남는다 */ }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
