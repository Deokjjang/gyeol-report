import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { LOCAL_DEV_ACCOUNT, localDevAuthAllowed } from "../../../lib/account/localDevAccount";

// 로컬 개발 전용(P3 G): next dev + 로컬 Supabase일 때만 테스트 계정으로 로그인해 쿠키를 심고 next 경로로 보낸다. 그 밖에는 404.
// 사용: http://localhost:3100/dev/v5-login?next=/reports/<reportId>
export async function GET(request: NextRequest) {
  if (!localDevAuthAllowed()) return new NextResponse(null, { status: 404 });
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  const target = new URL(/^\/(?!\/)/.test(next) ? next : "/", request.url);
  const response = NextResponse.redirect(target);
  const auth = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: cs => { for (const c of cs) response.cookies.set(c.name, c.value, { ...c.options, secure: false }); } },
  });
  const { error } = await auth.auth.signInWithPassword(LOCAL_DEV_ACCOUNT);
  return error ? NextResponse.json({ ok: false, error: "LOCAL_DEV_LOGIN_FAILED" }, { status: 503 }) : response;
}
