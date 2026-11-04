/**
 * 가입 정보(P6d-ops 2)와 회원 탈퇴. 로그인 직후 정보 화면: 이름(필수)·이메일(필수, 두 번 입력·형식)·휴대폰(선택)·마케팅 수신(선택, 별도 동의).
 * 입력 전에는 결제·이용권 사용만 막는다(로그인·열람은 열려 있다). 카카오 확정 이메일(is_email_valid·is_email_verified 모두 참)은 미리 채우고 다시 묻지 않는다.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { AccountPort } from "./handler";
import { accountSession, safeAccountNext, safeDisplayName } from "./policy";
import { opsSameOrigin, opsOriginAllowed } from "../ops/origin";
import type { AccountOpsStore, AuditEntry } from "../ops/store";

export { MARKETING_CONSENT_VERSION, MARKETING_CONSENT_LABEL, PROFILE_REQUIRED_CODE, PROFILE_REQUIRED_MESSAGE, ORDER_RETENTION_YEARS, normalizePhone, normalizeEmail, validateContact } from "./contact";
export type { ContactValue, ProviderFacts } from "./contact";
import { MARKETING_CONSENT_VERSION, ORDER_RETENTION_YEARS, validateContact, type ContactValue, type ProviderFacts } from "./contact";
const RETURN_COOKIE = "gyeol-account-return";

export type ProfileDeps = {
  ops: AccountOpsStore;
  audit(e: AuditEntry): Promise<boolean>;
  /** 탈퇴: 카카오 연결 끊기(어드민 키). */
  unlinkKakao(kakaoId: string | null): Promise<"done" | "skipped" | "failed">;
  /** 탈퇴: Supabase auth 사용자 소프트 삭제(로그인 불가, 다시 가입하면 새 계정). */
  deleteUser(userId: string): Promise<boolean>;
  now?: () => Date;
};

export async function handleProfile(request: NextRequest, action: "profile" | "withdraw", port: AccountPort, deps: ProfileDeps): Promise<NextResponse> {
  const json = (body: object, status = 200) => port.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } }));
  if (!["GET", "POST"].includes(request.method)) return json({}, 405);
  if (request.method === "POST" ? !opsSameOrigin(request) : !opsOriginAllowed(request)) return json({ code: "ACCOUNT_ORIGIN_DENIED" }, 403);
  try {
    const user = await port.currentUser();
    if (!user) return json({ code: "MEMBER_REQUIRED", error: "로그인이 만료되었습니다. 다시 로그인해 주세요." }, 401);
    const snapshot = await port.read(user);
    if (!snapshot) return json({ code: "ACCOUNT_SESSION_UNAVAILABLE" }, 503);
    if (accountSession(user, snapshot).status !== "member") return json({ code: "MEMBER_CONSENT_REQUIRED", error: "약관 동의를 먼저 마쳐 주세요." }, 401);
    const factsResult = await deps.ops.call("facts_read", user.id);
    const facts = (factsResult.facts ?? null) as ProviderFacts;
    // 확정 이메일(화면 미리 채움과 저장이 같은 기준): 카카오는 is_email_valid·is_email_verified가 둘 다 참일 때만, Google은 Supabase가 확인한 이메일.
    const trusted = facts?.emailTrusted && facts.email ? facts.email : user.provider === "google" && user.emailVerified && user.email ? user.email.toLowerCase() : null;
    if (action === "profile" && request.method === "GET") {
      const read = await deps.ops.call("read", user.id);
      if (!read.ok) return json({ code: "STORAGE_UNAVAILABLE" }, 503);
      const contact = read.contact as (ContactValue & { upgradeState?: string }) | null;
      return json({ ok: true, contact, prefill: { name: contact?.name ?? safeDisplayName(user.displayName), email: contact?.email ?? trusted ?? facts?.email ?? "", emailLocked: Boolean(trusted) && !contact, emailFrom: trusted ? user.provider : null,
        emailNotice: !trusted && user.provider === "kakao" ? (facts?.emailDeclinedAt ? "카카오 이메일을 받지 못했어요. 직접 입력해 주세요." : "카카오 이메일이 확인되지 않았어요. 직접 입력해 주세요.") : null } });
    }
    if (action === "withdraw" && request.method === "GET") {
      const preview = await deps.ops.call("withdraw_preview", user.id);
      return preview.ok ? json({ ok: true, books: Number(preview.books ?? 0) }) : json({ code: "STORAGE_UNAVAILABLE" }, 503);
    }
    if (Number(request.headers.get("content-length") ?? 0) > 4096) return json({ code: "INPUT_TOO_LARGE" }, 413);
    const raw = await request.text();
    if (raw.length > 4096) return json({ code: "INPUT_TOO_LARGE" }, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return json({ code: "INPUT_INVALID" }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ code: "INPUT_INVALID" }, 400);
    if (action === "withdraw") {
      if (body.confirm !== "탈퇴") return json({ code: "CONFIRM_REQUIRED", error: "확인 칸에 '탈퇴'를 입력해 주세요." }, 400);
      const now = (deps.now ?? (() => new Date()))();
      const retainUntil = new Date(now); retainUntil.setFullYear(retainUntil.getFullYear() + ORDER_RETENTION_YEARS);
      const unlink = user.provider === "kakao" ? await deps.unlinkKakao(user.kakaoId ?? null) : "skipped";
      const done = await deps.ops.call("withdraw", user.id, { retainUntil: retainUntil.toISOString() });
      if (!done.ok) return json({ code: "WITHDRAW_FAILED", error: "탈퇴를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 503);
      const deleted = await deps.deleteUser(user.id);
      await deps.audit({ actor: "system", action: "account_withdrawn", target: user.id, detail: { provider: user.provider, kakaoUnlink: unlink, authDeleted: deleted, retainedOrders: done.retainedOrders ?? 0, closedBooks: done.closedBooks ?? 0 } });
      await port.logout();
      return json({ ok: true });
    }
    const checked = validateContact(body, trusted ? { ...(facts ?? {}), emailTrusted: true, email: trusted } as NonNullable<ProviderFacts> : facts);
    if (!checked.ok) return json({ code: "PROFILE_INVALID", field: checked.field, error: checked.message }, 400);
    if (typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId)) return json({ code: "PROFILE_INVALID", error: "다시 시도해 주세요." }, 400);
    const saved = await deps.ops.call("save", user.id, { requestId: body.requestId, ...checked.value, marketingVersion: MARKETING_CONSENT_VERSION });
    if (!saved.ok) return json({ code: "STORAGE_UNAVAILABLE", error: "저장하지 못했습니다. 다시 시도해 주세요." }, 503);
    const next = request.cookies.get(RETURN_COOKIE)?.value;
    const response = json({ ok: true, contact: saved.contact, ...(next ? { next: safeAccountNext(next) } : {}) });
    if (next) response.cookies.set(RETURN_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 });
    return response;
  } catch { return json({ code: "ACCOUNT_REQUEST_FAILED", error: "요청을 완료하지 못했습니다. 다시 시도해 주세요." }, 503); }
}
