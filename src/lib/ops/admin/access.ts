import "server-only";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest, type NextResponse } from "next/server";
import { createAccountPort } from "../../account/supabase";
import { adminUserIds, isAdminUser } from "../config";
import { adminSessionFresh } from "./config";

/** none = 관리자 아님(비회원 포함), expired = 관리자지만 마지막 로그인이 유효 시간(기본 12시간)을 지남. */
export type AdminSession = { status: "admin" | "expired" | "none"; userId: string | null; finish(response: NextResponse): NextResponse };
const pass = (response: NextResponse) => response;
const NONE: AdminSession = { status: "none", userId: null, finish: pass };

/**
 * 관리자 확인: 로그인(getUser로 검증된 계정) + ADMIN_USER_IDS + 마지막 로그인 12시간 이내. 관리자가 설정되지 않았으면 인증 호출 없이 거절한다.
 * finish는 세션 갱신 쿠키를 응답에 붙인다(route handler용).
 */
export async function adminSession(request: NextRequest, now = Date.now()): Promise<AdminSession> {
  if (adminUserIds().length === 0) return NONE;
  const port = createAccountPort(request);
  if (!port) return NONE;
  const finish = (response: NextResponse) => port.finish(response);
  try {
    const user = await port.currentUser();
    if (!user || !isAdminUser(user.id)) return { status: "none", userId: null, finish };
    return { status: adminSessionFresh(user.lastSignInAt, process.env, now) ? "admin" : "expired", userId: user.id, finish };
  } catch { return { status: "none", userId: null, finish }; }
}

export type AdminPageGate = { kind: "ok"; userId: string } | { kind: "expired" };
/** 서버 컴포넌트용: 관리자가 아니면(비회원 포함) 404. 화면이 있다는 것도 드러내지 않는다. 시간이 지난 관리자는 "다시 로그인"만 본다. */
export async function adminPageGate(): Promise<AdminPageGate> {
  let session: AdminSession = NONE;
  try { session = await adminSession(new NextRequest("https://www.gyeolreport.com/admin/orders", { headers: await headers() })); }
  catch { session = NONE; }
  if (session.status === "none" || !session.userId) notFound();
  return session.status === "expired" ? { kind: "expired" } : { kind: "ok", userId: session.userId };
}
