import { NextRequest, NextResponse } from "next/server";
import { mirrorPublicEnabled } from "../../../../lib/mirror/gate";

// 「남이 본 나」 API(명령 1/3): 공개 관문(로컬 개발에서만 열림) 뒤. 닫혀 있으면 저장소 · 계정 모듈을 읽지도 않고 404.
async function handle(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  if (!mirrorPublicEnabled()) return new NextResponse(null, { status: 404 });
  const action = (await context.params).action;
  const [{ handleMirror }, { createAccountPort }, { createMirrorStore }] = await Promise.all([
    import("../../../../lib/mirror/api"), import("../../../../lib/account/supabase"), import("../../../../lib/mirror/store"),
  ]);
  return handleMirror(request, action, { enabled: true, account: createAccountPort(request), store: createMirrorStore() });
}
export const GET = handle;
export const POST = handle;
