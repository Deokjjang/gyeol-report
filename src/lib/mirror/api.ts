/**
 * 「남이 본 나」 서버 라우트 본체(/api/mirror/*). 로그인 · 동의는 기존 계정 포트(createAccountPort)를 그대로 쓰고, 이 기능의 표는 MirrorStore(service_role)로만 읽고 쓴다.
 * 공개 관문이 닫혀 있으면 모든 주소가 404다. 브라우저 POST는 같은 출처만 받는다(CSRF).
 */
import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { MIRROR_ITEM_BY_ID } from "../../data/mirror/items";
import type { AccountPort } from "../account/handler";
import { publicRequestOrigin } from "../account/origin";
import { ACCOUNT_POLICY_VERSIONS, accountSession, validConsentSubmission } from "../account/policy";
import { selfComplete, type Choice, type FriendSession, type SelfAnswers } from "./engine";
import { hash32 } from "./hash";
import { homeView } from "./home";
import { birthProblem, handleChangeAllowedAt, handleProblem, HANDLE_MESSAGES, nameProblem, normalizeHandle, normalizeName } from "./profileRules";

export type MirrorProfile = { name: string; handle: string; handleChangedAt: string | null; birthDate: string | null; birthTime: string | null; isPublic: boolean; selfCompletedAt: string | null };
export type SaveProfileResult = { ok: true } | { ok: false; code: "HANDLE_TAKEN" | "HANDLE_COOLDOWN" | "AGE_REQUIRED" | "INPUT_INVALID" | "STORAGE_UNAVAILABLE"; until?: string };
export type MirrorStore = {
  profile(userId: string): Promise<MirrorProfile | null>;
  /** /@아이디 랜딩: 지금 아이디면 current, 예전 아이디면 지금 아이디로 moved, 없으면 null. */
  resolveHandle(handle: string): Promise<{ status: "current"; name: string; isPublic: boolean } | { status: "moved"; handle: string } | null>;
  /** 이 아이디가 다른 사람 것(지금 아이디 또는 예전 아이디)인가. */
  handleTaken(handle: string, userId: string | null): Promise<boolean>;
  saveProfile(userId: string, input: { name: string; handle: string; birthDate: string | null; birthTime: string | null; age14: boolean }): Promise<SaveProfileResult>;
  /** 지금 문항 버전의 자가 답만. */
  selfAnswers(userId: string): Promise<SelfAnswers>;
  saveSelfAnswer(userId: string, itemId: string, version: number, choice: Choice): Promise<boolean>;
  completeSelf(userId: string): Promise<boolean>;
  touchDevice(deviceHash: string, userId: string): Promise<void>;
  board(userId: string): Promise<FriendSession[]>;
  /** 기존 회원이 가입 정보에 넣은 이름(없으면 null). */
  contactName(userId: string): Promise<string | null>;
  mintHandoff(tokenHash: string, deviceToken: string, next: string, expiresAt: string): Promise<boolean>;
  redeemHandoff(tokenHash: string, nowIso: string): Promise<{ deviceToken: string | null; next: string } | null>;
};
export type MirrorDeps = { enabled: boolean; account: AccountPort | null; store: MirrorStore | null; now?: () => Date; dev?: boolean };

export const DEVICE_COOKIE = "gyeol-mirror-device";
const DEVICE_RE = /^[A-Za-z0-9_-]{43}$/;
const HANDOFF_MINUTES = 10;
const noStore = { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" };
export const deviceHash = (token: string): string => createHash("sha256").update(`mirror-device:${token}`).digest("hex");
export const handoffHash = (token: string): string => createHash("sha256").update(`mirror-handoff:${token}`).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");
/** 질문 순서 · 보기 순서 시드(계정 id를 그대로 보내지 않는다). */
export const personSeed = (userId: string): string => hash32(`mirror-seed:${userId}`).toString(36);
/** 다른 브라우저로 넘어간 뒤 돌아갈 곳: 이 서비스 화면만. */
export function safeMirrorNext(value: unknown): string {
  return typeof value === "string" && /^\/(?:@[A-Za-z0-9._]{3,20}|u\/[A-Za-z0-9._]{3,20})?$/.test(value) ? value : "/";
}

/** 같은 출처: 운영은 정해진 공개 주소, 로컬 개발은 요청 Host 그대로(같은 Wi-Fi 폰 확인용). */
function expectedOrigin(request: NextRequest, dev: boolean): string | null {
  if (dev) { const host = request.headers.get("host"); return host ? `${new URL(request.url).protocol}//${host}` : null; }
  return publicRequestOrigin(request);
}

export async function handleMirror(request: NextRequest, action: string, deps: MirrorDeps): Promise<NextResponse> {
  if (!deps.enabled) return new NextResponse(null, { status: 404 });
  const dev = deps.dev ?? process.env.NODE_ENV === "development", now = (deps.now ?? (() => new Date()))();
  const { account, store } = deps;
  const finish = (response: NextResponse) => { for (const [k, v] of Object.entries(noStore)) response.headers.set(k, v); return account ? account.finish(response) : response; };
  const json = (body: object, status = 200) => finish(NextResponse.json(body, { status }));
  if (!account || !store) return json({ code: "MIRROR_UNAVAILABLE", error: "준비 중이에요. 잠시 후 다시 시도해 주세요." }, 503);
  const routes: Record<string, "GET" | "POST"> = { session: "GET", handle: "GET", profile: "POST", answer: "POST", complete: "POST", handoff: request.method === "GET" ? "GET" : "POST" };
  if (!routes[action]) return json({ code: "NOT_FOUND" }, 404);
  if (request.method !== routes[action]) return json({ code: "METHOD_NOT_ALLOWED" }, 405);
  if (request.method === "POST") {
    const origin = expectedOrigin(request, dev);
    if (!origin || request.headers.get("origin") !== origin) return json({ code: "CSRF_DENIED", error: "요청을 다시 확인해 주세요." }, 403);
  }
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: !dev, path: "/", maxAge: 400 * 86_400 };
  const existingDevice = request.cookies.get(DEVICE_COOKIE)?.value;
  const device = existingDevice && DEVICE_RE.test(existingDevice) ? existingDevice : newToken();
  const withDevice = (response: NextResponse) => { if (device !== existingDevice) response.cookies.set(DEVICE_COOKIE, device, cookieOptions); return response; };

  try {
    if (action === "handoff" && request.method === "GET") {
      const token = request.nextUrl.searchParams.get("t") ?? "";
      const done = DEVICE_RE.test(token) ? await store.redeemHandoff(handoffHash(token), now.toISOString()) : null;
      const target = new URL(done ? safeMirrorNext(done.next) : "/", request.url);
      if (dev && request.headers.get("host")) target.host = request.headers.get("host")!;
      const response = finish(NextResponse.redirect(target, 303));
      if (done?.deviceToken && DEVICE_RE.test(done.deviceToken)) response.cookies.set(DEVICE_COOKIE, done.deviceToken, cookieOptions);
      return response;
    }
    let body: Record<string, unknown> = {};
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 4096) return json({ code: "INPUT_TOO_LARGE" }, 413);
      try { body = JSON.parse(raw || "{}"); } catch { return json({ code: "INPUT_INVALID", error: "입력을 확인해 주세요." }, 400); }
      if (!body || typeof body !== "object" || Array.isArray(body)) return json({ code: "INPUT_INVALID", error: "입력을 확인해 주세요." }, 400);
    }
    if (action === "handoff") {
      const token = newToken(), next = safeMirrorNext(body.next);
      const ok = await store.mintHandoff(handoffHash(token), device, next, new Date(now.getTime() + HANDOFF_MINUTES * 60_000).toISOString());
      return withDevice(ok ? json({ path: `/api/mirror/handoff?t=${token}` }) : json({ code: "STORAGE_UNAVAILABLE", error: "잠시 후 다시 시도해 주세요." }, 503));
    }
    if (action === "handle") {
      const handle = normalizeHandle(request.nextUrl.searchParams.get("value") ?? "");
      const problem = handleProblem(handle);
      if (problem) return json({ handle, available: false, message: HANDLE_MESSAGES[problem] });
      const user = await account.currentUser();
      const taken = await store.handleTaken(handle, user?.id ?? null);
      return json({ handle, available: !taken, ...(taken ? { message: HANDLE_MESSAGES.taken } : {}) });
    }

    const user = await account.currentUser();
    if (!user) return withDevice(action === "session" ? json({ account: "guest" }) : json({ code: "LOGIN_REQUIRED", error: "로그인이 만료됐어요. 다시 로그인해 주세요." }, 401));
    const snapshot = await account.read(user);
    if (!snapshot) return json({ code: "ACCOUNT_UNAVAILABLE", error: "로그인 상태를 확인하지 못했어요." }, 503);
    let status = accountSession(user, snapshot).status;

    const sessionView = async () => {
      const [profile, self] = await Promise.all([store.profile(user.id), store.selfAnswers(user.id)]);
      const prefill = profile ? null : (await store.contactName(user.id)) ?? snapshot.profile?.displayName ?? user.displayName;
      const home = profile?.selfCompletedAt ? homeView(self, await store.board(user.id)) : null;
      return {
        account: status, provider: user.provider, policy: ACCOUNT_POLICY_VERSIONS,
        ...(prefill ? { prefillName: normalizeName(prefill).slice(0, 10) } : {}),
        profile: profile ? { name: profile.name, handle: profile.handle, isPublic: profile.isPublic, birthDate: profile.birthDate, birthTime: profile.birthTime, handleChangeAllowedAt: handleChangeAllowedAt(profile.handleChangedAt) } : null,
        self: { answers: self, completedAt: profile?.selfCompletedAt ?? null, seed: personSeed(user.id) },
        home,
      };
    };

    if (action === "session") {
      await store.touchDevice(deviceHash(device), user.id).catch(() => undefined);
      return withDevice(json(await sessionView()));
    }

    if (action === "profile") {
      const name = normalizeName(typeof body.name === "string" ? body.name : ""), handle = normalizeHandle(typeof body.handle === "string" ? body.handle : "");
      const birthDate = typeof body.birthDate === "string" && body.birthDate ? body.birthDate : null, birthTime = typeof body.birthTime === "string" && body.birthTime ? body.birthTime : null;
      const problem = nameProblem(name) ?? (handleProblem(handle) ? HANDLE_MESSAGES[handleProblem(handle)!] : null) ?? birthProblem(birthDate, birthTime, now);
      if (problem) return json({ code: "PROFILE_INVALID", error: problem }, 400);
      const existing = await store.profile(user.id);
      if (!existing && body.age14 !== true) return json({ code: "AGE_REQUIRED", error: "만 14세 이상만 쓸 수 있어요." }, 400);
      if (status === "needs_consent") {
        // 기존 가입 처리(record_account_consent)를 그대로 쓴다. 이미 동의한 회원(member)에게는 다시 묻지 않는다.
        if (!validConsentSubmission(body.consent)) return json({ code: "CONSENT_REQUIRED", error: "이용약관과 개인정보처리방침에 동의해 주세요.", policy: ACCOUNT_POLICY_VERSIONS }, 400);
        if (!await account.consent(user, body.consent.requestId, snapshot.profile ? "reconsent" : "first_login")) return json({ code: "CONSENT_FAILED", error: "동의를 저장하지 못했어요. 다시 시도해 주세요." }, 503);
        status = "member";
      }
      const saved = await store.saveProfile(user.id, { name, handle, birthDate, birthTime, age14: body.age14 === true });
      if (!saved.ok) {
        if (saved.code === "HANDLE_TAKEN") return json({ code: saved.code, error: HANDLE_MESSAGES.taken }, 409);
        if (saved.code === "HANDLE_COOLDOWN") return json({ code: saved.code, error: HANDLE_MESSAGES.cooldown, until: saved.until }, 409);
        if (saved.code === "AGE_REQUIRED") return json({ code: saved.code, error: "만 14세 이상만 쓸 수 있어요." }, 400);
        return json({ code: saved.code, error: "저장하지 못했어요. 다시 시도해 주세요." }, saved.code === "INPUT_INVALID" ? 400 : 503);
      }
      return json({ ok: true, ...(await sessionView()) });
    }

    // 자가 질문지: 프로필이 있어야 하고, 완료한 뒤에는 답을 바꾸지 않는다(별자리가 고정된다).
    if (status !== "member") return json({ code: "CONSENT_REQUIRED", error: "약관 동의를 먼저 마쳐 주세요." }, 401);
    const profile = await store.profile(user.id);
    if (!profile) return json({ code: "PROFILE_REQUIRED", error: "프로필을 먼저 만들어 주세요." }, 409);
    if (action === "answer") {
      const item = typeof body.itemId === "string" ? MIRROR_ITEM_BY_ID.get(body.itemId) : undefined;
      if (!item || body.version !== item.version || (body.choice !== 0 && body.choice !== 1)) return json({ code: "ANSWER_INVALID", error: "문항이 바뀌었어요. 화면을 새로 고쳐 주세요." }, 400);
      if (profile.selfCompletedAt) return json({ code: "SELF_DONE", error: "이미 질문을 다 답했어요." }, 409);
      return await store.saveSelfAnswer(user.id, item.id, item.version, body.choice) ? json({ ok: true }) : json({ code: "STORAGE_UNAVAILABLE", error: "저장하지 못했어요. 다시 눌러 주세요." }, 503);
    }
    // complete
    if (!profile.selfCompletedAt) {
      if (!selfComplete(await store.selfAnswers(user.id))) return json({ code: "SELF_INCOMPLETE", error: "아직 답하지 않은 질문이 있어요." }, 409);
      if (!await store.completeSelf(user.id)) return json({ code: "STORAGE_UNAVAILABLE", error: "저장하지 못했어요. 다시 시도해 주세요." }, 503);
    }
    return json({ ok: true, ...(await sessionView()) });
  } catch {
    return json({ code: "REQUEST_FAILED", error: "요청을 완료하지 못했어요. 다시 시도해 주세요." }, 503);
  }
}
