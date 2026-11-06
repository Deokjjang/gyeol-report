import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_POLICY_VERSIONS, ACCOUNT_PROVIDERS, accountSession, mayReadOwnedBooks, safeAccountNext, validConsentSubmission, type AccountIdentity, type AccountProvider, type AccountSnapshot } from "./policy";
import { publicRequestOrigin } from "./origin";
import { channelOnboarding } from "./channelOnboarding";

export type AccountPort = {
  currentUser(): Promise<AccountIdentity | null>;
  /** scope: 카카오 추가 동의(account_email)처럼 이번 인가에만 다른 동의 항목을 요청할 때. */
  start(provider: AccountProvider, callback: string, scope?: string): Promise<string | null>;
  /** 로그인 콜백 뒤(P6d-ops): 공급자 사실(이메일 확정·채널 관계)을 저장하고, 카카오 이메일 추가 동의가 필요하면 askEmail. */
  afterLogin?(user: AccountIdentity, opts: { emailRetry: boolean; contact: boolean }): Promise<{ askEmail: boolean }>;
  exchange(code: string): Promise<boolean>;
  logout(): Promise<boolean>;
  read(user: AccountIdentity): Promise<AccountSnapshot | null>;
  consent(user: AccountIdentity, requestId: string, source: "first_login" | "reconsent"): Promise<boolean>;
  authorizationOrigin: string;
  finish(response: NextResponse): NextResponse;
};
const COOKIE = "gyeol-auth-flow";
const RETURN_COOKIE = "gyeol-account-return";
const noStore = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie" };

/** compWaiting: 재동의 화면 맨 위 한 줄(P 본문 3) — 안 쓴 보상 이용권이 있는지. 예전에 필수 동의를 마친 기존 회원(재동의 대상)에게만 묻는다(신규 가입자는 묻지도 않는다). */
export type AccountDeps = { compWaiting?: (userId: string) => Promise<boolean> };
export async function handleAccount(request: NextRequest, action: string, port: AccountPort, local = false, deps: AccountDeps = {}): Promise<NextResponse> {
  const url = new URL(request.url);
  if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  const origin = local ? url.origin : publicRequestOrigin(request);
  if (!origin) return NextResponse.json({ code: "ACCOUNT_ORIGIN_DENIED", error: "요청 주소를 확인해 주세요." }, { status: 403, headers: noStore });
  const api = local ? "/dev/account/api" : "/auth", home = local ? "/dev/account" : "/account", login = local ? "/dev/account?view=login" : "/login";
  const finish = (response: NextResponse) => { for (const [k, v] of Object.entries(noStore)) response.headers.set(k, v); return port.finish(response); };
  const json = (body: object, status = 200) => finish(NextResponse.json(body, { status }));
  const redirect = (path: string) => finish(NextResponse.redirect(new URL(path, origin), 303));
  const failure = () => redirect(`${login}${login.includes("?") ? "&" : "?"}error=login`);
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: !local, path: "/", maxAge: 600 };
  if (!["session", "start", "callback", "consent", "logout"].includes(action)) return json({ code: "ACCOUNT_ACTION_NOT_FOUND" }, 404);
  if (request.method !== (["session", "callback"].includes(action) ? "GET" : "POST")) return json({ code: "ACCOUNT_METHOD_NOT_ALLOWED" }, 405);
  // Browser POSTs must be same-origin; never permit missing Origin to bypass CSRF.
  if (request.method === "POST" && request.headers.get("origin") !== origin) return json({ code: "ACCOUNT_CSRF_DENIED", error: "요청을 다시 확인해 주세요." }, 403);
  try {
    if (action === "callback") {
      const cookie = request.cookies.get(COOKIE)?.value;
      let flow: { state: string; next: string; expires: number } | null = null;
      try { flow = cookie ? JSON.parse(cookie) : null; } catch { /* Invalid cookies are not identities. */ }
      const state = url.searchParams.get("flow") ?? "", code = url.searchParams.get("code");
      const valid = !!flow && typeof flow.state === "string" && flow.state.length === state.length && state.length === 64
        && timingSafeEqual(Buffer.from(flow.state), Buffer.from(state)) && flow.expires > Date.now() && !!code && !url.searchParams.has("error");
      const clear = (response: NextResponse) => { response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 }); return response; };
      if (!valid || !code || code.length > 2048 || !await port.exchange(code)) return clear(failure());
      const user = await port.currentUser();
      if (!user) return clear(failure());
      const snapshot = await port.read(user);
      if (!snapshot) return clear(failure());
      const session = accountSession(user, snapshot);
      const next = safeAccountNext(flow?.next, local);
      // P6d-ops 2: 카카오 identity에 이메일이 없으면 account_email만 한 번 더 인가(이미 동의한 항목은 생략). 거부·무효면 다시 묻지 않는다.
      const emailRetry = Boolean((flow as { emailRetry?: boolean } | null)?.emailRetry);
      let askEmail = false;
      try { askEmail = (await port.afterLogin?.(user, { emailRetry, contact: Boolean(snapshot.contact) }))?.askEmail === true; } catch { /* 사실 확인 실패는 로그인을 막지 않는다 */ }
      if (askEmail && !emailRetry && user.provider === "kakao") {
        const state2 = randomBytes(32).toString("hex");
        const destination = await port.start("kakao", `${origin}${api}/callback?flow=${state2}`, "account_email");
        if (destination && new URL(destination).origin === port.authorizationOrigin) {
          const response = finish(NextResponse.redirect(destination, 303));
          response.cookies.set(COOKIE, JSON.stringify({ state: state2, next, expires: Date.now() + 600_000, emailRetry: true }), cookieOptions);
          return response;
        }
      }
      // 회원이어도 가입 정보가 없으면 정보 화면(/account)으로 보낸다. 로그인·열람은 막지 않는다(결제·이용권만 서버에서 막는다).
      const ready = session.status === "member" && session.profile !== "required";
      const response = clear(redirect(ready ? next : home));
      response.cookies.set(RETURN_COOKIE, ready ? "" : next, { ...cookieOptions, maxAge: ready ? 0 : 600 });
      return response;
    }
    if (action === "session") {
      const user = await port.currentUser();
      const snapshot = user ? await port.read(user) : undefined;
      if (snapshot === null) return json({ code: "ACCOUNT_SESSION_UNAVAILABLE", error: "로그인 상태를 확인하지 못했습니다." }, 503);
      const session = accountSession(user, snapshot);
      const channelPrompt = channelOnboarding(user, session);
      const compWaiting = session.status === "needs_consent" && user && snapshot && mayReadOwnedBooks(user, snapshot) && deps.compWaiting
        ? await deps.compWaiting(user.id).catch(() => false) : false;
      return json({ ...session, ...(channelPrompt ? { channelPrompt } : {}), ...(compWaiting ? { compWaiting: true } : {}) });
    }
    if (action === "logout") {
      const ok = await port.logout();
      const response = json(ok ? { ok: true } : { error: "로그아웃을 완료하지 못했습니다. 다시 시도해 주세요." }, ok ? 200 : 503);
      response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
      response.cookies.set(RETURN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    if (Number(request.headers.get("content-length") ?? 0) > 4096) return json({ code: "ACCOUNT_INPUT_TOO_LARGE" }, 413);
    const raw = await request.text();
    if (raw.length > 4096) return json({ code: "ACCOUNT_INPUT_TOO_LARGE" }, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return json({ code: "ACCOUNT_INPUT_INVALID", error: "입력을 확인해 주세요." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ code: "ACCOUNT_INPUT_INVALID", error: "입력을 확인해 주세요." }, 400);
    if (action === "start") {
      if (!ACCOUNT_PROVIDERS.includes(body.provider as AccountProvider) || Object.keys(body).some(k => !["provider", "next"].includes(k))) return json({ code: "OAUTH_INPUT_INVALID", error: "로그인 요청을 확인해 주세요." }, 400);
      const state = randomBytes(32).toString("hex"), next = safeAccountNext(body.next, local);
      const callback = `${origin}${api}/callback?flow=${state}`;
      const destination = await port.start(body.provider as AccountProvider, callback);
      if (!destination) return json({ code: "OAUTH_START_UNAVAILABLE", error: "로그인을 시작하지 못했습니다. 다시 시도해 주세요." }, 503);
      const target = new URL(destination);
      if (target.origin !== port.authorizationOrigin || (!local && target.pathname !== "/auth/v1/authorize")) return json({ code: "OAUTH_DESTINATION_INVALID", error: "로그인 연결을 확인하지 못했습니다. 다시 시도해 주세요." }, 503);
      const response = json({ url: destination });
      response.cookies.set(COOKIE, JSON.stringify({ state, next, expires: Date.now() + 600_000 }), cookieOptions);
      return response;
    }
    if (!validConsentSubmission(body)) return json({ error: "현재 약관의 필수 항목에 동의해 주세요.", versions: ACCOUNT_POLICY_VERSIONS }, 400);
    const user = await port.currentUser();
    if (!user) return json({ error: "로그인이 만료되었습니다. 다시 로그인해 주세요." }, 401);
    const snapshot = await port.read(user);
    if (!snapshot) return json({ error: "동의를 저장하지 못했습니다. 다시 시도해 주세요." }, 503);
    const ok = await port.consent(user, body.requestId, snapshot.profile ? "reconsent" : "first_login");
    const next = request.cookies.get(RETURN_COOKIE)?.value;
    // P 추가 A·F: 가입 정보(이름·이메일)가 아직 없으면(신규 가입) 돌아갈 곳(결제 화면·선물 링크)을 쥐고 있다가 정보 저장 뒤 보낸다(profile.ts).
    const profilePending = snapshot.contact === null;
    const response = json(ok ? { ok: true, ...(next && !profilePending ? { next: safeAccountNext(next, local) } : {}) } : { error: "동의를 저장하지 못했습니다. 다시 시도해 주세요." }, ok ? 200 : 503);
    if (ok) response.cookies.set(RETURN_COOKIE, profilePending && next ? next : "", { ...cookieOptions, maxAge: profilePending && next ? 1800 : 0 });
    return response;
  } catch {
    // No provider text, codes, tokens, email, or DB diagnostics in public responses.
    if (action === "callback") { const response = failure(); response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 }); return response; }
    return json({ code: "ACCOUNT_REQUEST_FAILED", error: "요청을 완료하지 못했어요. 다시 시도해 주세요." }, 503);
  }
}
