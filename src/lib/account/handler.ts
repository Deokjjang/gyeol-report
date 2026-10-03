import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_POLICY_VERSIONS, ACCOUNT_PROVIDERS, accountSession, safeAccountNext, validConsentSubmission, type AccountIdentity, type AccountProvider, type AccountSnapshot } from "./policy";

export type AccountPort = {
  currentUser(): Promise<AccountIdentity | null>;
  start(provider: AccountProvider, callback: string): Promise<string | null>;
  exchange(code: string): Promise<boolean>;
  logout(): Promise<boolean>;
  read(user: AccountIdentity): Promise<AccountSnapshot | null>;
  consent(user: AccountIdentity, requestId: string, source: "first_login" | "reconsent"): Promise<boolean>;
  authorizationOrigin: string;
  finish(response: NextResponse): NextResponse;
};
const COOKIE = "gyeol-auth-flow";
const noStore = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie" };

export async function handleAccount(request: NextRequest, action: string, port: AccountPort, local = false): Promise<NextResponse> {
  const url = new URL(request.url);
  if (local && request.headers.get("host")) url.host = request.headers.get("host")!;
  const origin = local ? url.origin : "https://gyeolreport.com";
  const api = local ? "/dev/account/api" : "/auth", home = local ? "/dev/account" : "/account", login = local ? "/dev/account?view=login" : "/login";
  const finish = (response: NextResponse) => { for (const [k, v] of Object.entries(noStore)) response.headers.set(k, v); return port.finish(response); };
  const json = (body: object, status = 200) => finish(NextResponse.json(body, { status }));
  const redirect = (path: string) => finish(NextResponse.redirect(new URL(path, origin), 303));
  const failure = () => redirect(`${login}${login.includes("?") ? "&" : "?"}error=login`);
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: !local, path: "/", maxAge: 600 };
  if (!["session", "start", "callback", "consent", "logout"].includes(action)) return json({}, 404);
  if (request.method !== (["session", "callback"].includes(action) ? "GET" : "POST")) return json({}, 405);
  // Browser POSTs must be same-origin; never permit missing Origin to bypass CSRF.
  if (request.method === "POST" && request.headers.get("origin") !== origin) return json({ error: "요청을 다시 확인해 주세요." }, 403);
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
      return clear(redirect(session.status === "member" ? safeAccountNext(flow?.next, local) : home));
    }
    if (action === "session") {
      const user = await port.currentUser();
      const snapshot = user ? await port.read(user) : undefined;
      if (snapshot === null) return json({ error: "로그인 상태를 확인하지 못했습니다." }, 503);
      return json(accountSession(user, snapshot));
    }
    if (action === "logout") {
      const ok = await port.logout();
      const response = json(ok ? { ok: true } : { error: "로그아웃을 완료하지 못했습니다. 다시 시도해 주세요." }, ok ? 200 : 503);
      response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    if (Number(request.headers.get("content-length") ?? 0) > 4096) return json({}, 413);
    const raw = await request.text();
    if (raw.length > 4096) return json({}, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return json({ error: "입력을 확인해 주세요." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({}, 400);
    if (action === "start") {
      if (!ACCOUNT_PROVIDERS.includes(body.provider as AccountProvider) || Object.keys(body).some(k => !["provider", "next"].includes(k))) return json({}, 400);
      const state = randomBytes(32).toString("hex"), next = safeAccountNext(body.next, local);
      const callback = `${origin}${api}/callback?flow=${state}`;
      const destination = await port.start(body.provider as AccountProvider, callback);
      if (!destination) return json({ error: "로그인을 시작하지 못했습니다. 다시 시도해 주세요." }, 503);
      const target = new URL(destination);
      if (target.origin !== port.authorizationOrigin || (!local && target.pathname !== "/auth/v1/authorize")) return json({}, 503);
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
    return json(ok ? { ok: true } : { error: "동의를 저장하지 못했습니다. 다시 시도해 주세요." }, ok ? 200 : 503);
  } catch {
    // No provider text, codes, tokens, email, or DB diagnostics in public responses.
    if (action === "callback") { const response = failure(); response.cookies.set(COOKIE, "", { ...cookieOptions, maxAge: 0 }); return response; }
    return json({ error: "요청을 완료하지 못했습니다. 다시 시도하거나 로그인 없이 계속해 주세요." }, 503);
  }
}
