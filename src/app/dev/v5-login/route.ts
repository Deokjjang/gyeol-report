import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { LOCAL_DEV_ACCOUNT, localDevAuthAllowed } from "../../../lib/account/localDevAccount";
import { mirrorTrialMode } from "../../../lib/mirror/trial";

// 로컬 개발 전용(P3 G): next dev + 로컬 Supabase일 때만 테스트 계정으로 로그인해 쿠키를 심고 next 경로로 보낸다. 그 밖에는 404.
// 사용: http://localhost:3100/dev/v5-login?next=/reports/<reportId>
// P6e-ops: ?as=<이름>이면 로컬 검수 계정 p6e-<이름>@gyeol.local(tools/p6e/accounts.ts가 만든다)로 로그인한다(선물 링크 등 여러 사람 화면 시험용).
// 「남이 본 나」 로컬 시험 모드(src/lib/mirror/trial.ts — 로컬 next start, Vercel에서는 꺼짐)에서도 열린다. ?as=new는 매번 새 로컬 계정(동의 · 프로필 없음, 카카오 가입처럼)을 만들어 첫 경험을 다시 본다.
export async function GET(request: NextRequest) {
  if (!localDevAuthAllowed() && !mirrorTrialMode()) return new NextResponse(null, { status: 404 });
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  const target = new URL(/^\/(?!\/)/.test(next) ? next : "/", request.url);
  const response = NextResponse.redirect(target);
  const auth = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: cs => { for (const c of cs) response.cookies.set(c.name, c.value, { ...c.options, secure: false }); } },
  });
  const as = request.nextUrl.searchParams.get("as");
  const fresh = as === "new" ? await freshAccount() : null;
  if (as === "new" && !fresh) return NextResponse.json({ ok: false, error: "LOCAL_DEV_SIGNUP_FAILED" }, { status: 503 });
  const account = fresh ?? (as && /^[a-z0-9-]{2,20}$/.test(as) ? { email: `p6e-${as}@gyeol.local`, password: LOCAL_DEV_ACCOUNT.password } : LOCAL_DEV_ACCOUNT);
  const { error } = await auth.auth.signInWithPassword(account);
  return error ? NextResponse.json({ ok: false, error: "LOCAL_DEV_LOGIN_FAILED" }, { status: 503 }) : response;
}

/** 새 로컬 계정(scripts/dev/mirror-seed.ts --new-owner와 같은 꼴): 로컬 Supabase 관리 API로만 만든다. */
async function freshAccount(): Promise<{ email: string; password: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(url) || !key) return null;
  const name = `new-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`, email = `p6e-${name}@gyeol.local`;
  const headers = { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" };
  const created = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/users`, { method: "POST", headers, body: JSON.stringify({
    email, password: LOCAL_DEV_ACCOUNT.password, email_confirm: true, user_metadata: { full_name: "새 회원" }, app_metadata: { provider: "kakao", providers: ["kakao"] } }) });
  return created.ok ? { email, password: LOCAL_DEV_ACCOUNT.password } : null;
}
