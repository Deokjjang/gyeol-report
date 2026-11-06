/**
 * 결제 구매자(P6d-ops 2·3). 회원은 가입 정보(정보 화면)가 있어야 결제할 수 있다.
 * P 추가 A(2026-11-06): 비회원 결제는 없앴다 — 로그인한 회원(약관 동의 마침)이 아니면 결제 준비를 받지 않는다(주문을 쓰기 전에 거절).
 * 결제 전 고지(디지털 콘텐츠 청약철회 제한 + 계산 오류 재생성·환불) 버전을 주문에 남긴다.
 */
import { NextRequest } from "next/server";
import { accountSession } from "../../account/policy";
import { PROFILE_REQUIRED_CODE, PROFILE_REQUIRED_MESSAGE } from "../../account/profile";
import type { AccountPort } from "../../account/handler";
import type { AccountOpsStore } from "../store";

export const CHECKOUT_NOTICE_VERSION = "p6d-2026-11-04";
export type Buyer = { userId: string | null; name: string; email: string; phone: string | null };
export type BuyerResult = { ok: true; buyer: Buyer } | { ok: false; code: string; message: string; status: number };

export const LOGIN_REQUIRED_CODE = "LOGIN_REQUIRED";
export const LOGIN_REQUIRED_MESSAGE = "로그인한 뒤 결제할 수 있어요.";
export async function resolveBuyer(request: Request, raw: unknown, deps: { port: AccountPort | null; account: AccountOpsStore }): Promise<BuyerResult> {
  const user = deps.port ? await deps.port.currentUser() : null;
  const snapshot = user ? await deps.port!.read(user) : null;
  if (user && snapshot && accountSession(user, snapshot).status === "member") {
    if (snapshot.contact === null) return { ok: false, code: PROFILE_REQUIRED_CODE, message: PROFILE_REQUIRED_MESSAGE, status: 403 };
    const read = await deps.account.call("read", user.id);
    if (!read.ok) return { ok: false, code: "PAYMENT_CHECKOUT_UNAVAILABLE", message: "결제 준비가 잠시 어려워요. 잠시 후 다시 시도해 주세요.", status: 503 };
    const c = read.contact as { name: string; email: string; phone: string | null } | null;
    if (!c) return { ok: false, code: PROFILE_REQUIRED_CODE, message: PROFILE_REQUIRED_MESSAGE, status: 403 };
    return { ok: true, buyer: { userId: user.id, name: c.name, email: c.email, phone: c.phone ?? null } };
  }
  // 비회원·약관 동의 전: 결제하지 않는다(화면은 결제하기에서 로그인으로 보낸다). 화면이 보낸 구매자 정보(raw)는 쓰지 않는다.
  void request; void raw;
  return { ok: false, code: LOGIN_REQUIRED_CODE, message: LOGIN_REQUIRED_MESSAGE, status: 401 };
}

export function accountPortFor(request: Request, create: (r: NextRequest) => AccountPort | null): AccountPort | null {
  return create(new NextRequest(request.url, { headers: request.headers }));
}
