import { NextRequest, NextResponse } from "next/server";
import { mirrorRoutesEnabled } from "../../../../lib/mirror/gate";

// 「남이 본 나」 API(명령 1~2/3): 공개 관문(로컬 개발에서만 열림) 뒤. 닫혀 있으면 저장소 · 계정 모듈을 읽지도 않고 404.
async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!mirrorRoutesEnabled()) return new NextResponse(null, { status: 404 });
  const action = (await context.params).action;
  const [{ handleMirror }, { createAccountPort }, { createMirrorStore }] = await Promise.all([
    import("../../../../lib/mirror/api"), import("../../../../lib/account/supabase"), import("../../../../lib/mirror/store"),
  ]);
  const store = createMirrorStore();
  // 신고 3번 자동 숨김 알림: 기존 운영 알림 경로(처리 봇, src/lib/ops/notify/telegram). 토큰이 없으면(로컬) 보내지 않는다.
  const notify = async (text: string) => {
    const { createTelegram, telegramConfig } = await import("../../../../lib/ops/notify/telegram");
    const tg = createTelegram(telegramConfig());
    if (tg.configured("ops")) await tg.call("ops", "sendMessage", { chat_id: tg.ownerId, text, parse_mode: "HTML", disable_web_page_preview: true });
  };
  return handleMirror(request, action, { enabled: true, account: createAccountPort(request), store, social: store, notify });
}
export const GET = handle;
export const POST = handle;
