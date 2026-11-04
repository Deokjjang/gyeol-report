/**
 * 결제 구매자(P6d-ops 2·3). 회원은 가입 정보(정보 화면)가 있어야 결제할 수 있고, 비회원은 결제 화면에서 이름·이메일(두 번)·휴대폰(선택)을 입력한다.
 * 결제 전 고지(디지털 콘텐츠 청약철회 제한 + 계산 오류 재생성·환불) 버전을 주문에 남긴다.
 */
import { NextRequest } from "next/server";
import { accountSession } from "../../account/policy";
import { PROFILE_REQUIRED_CODE, PROFILE_REQUIRED_MESSAGE, validateContact } from "../../account/profile";
import type { AccountPort } from "../../account/handler";
import type { AccountOpsStore } from "../store";

export const CHECKOUT_NOTICE_VERSION = "p6d-2026-11-04";
export type Buyer = { userId: string | null; name: string; email: string; phone: string | null };
export type BuyerResult = { ok: true; buyer: Buyer } | { ok: false; code: string; message: string; status: number };

export async function resolveBuyer(request: Request, raw: unknown, deps: { port: AccountPort | null; account: AccountOpsStore }): Promise<BuyerResult> {
  const user = deps.port ? await deps.port.currentUser() : null;
  const snapshot = user ? await deps.port!.read(user) : null;
  if (user && snapshot && accountSession(user, snapshot).status === "member") {
    if (snapshot.contact === null) return { ok: false, code: PROFILE_REQUIRED_CODE, message: PROFILE_REQUIRED_MESSAGE, status: 403 };
    const read = await deps.account.call("read", user.id);
    const c = read.ok ? read.contact as { name: string; email: string; phone: string | null } | null : null;
    if (!c) return { ok: false, code: PROFILE_REQUIRED_CODE, message: PROFILE_REQUIRED_MESSAGE, status: 403 };
    return { ok: true, buyer: { userId: user.id, name: c.name, email: c.email, phone: c.phone ?? null } };
  }
  // 비회원(또는 약관 동의 전): 결제 화면에서 받은 구매자 정보.
  const b = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const checked = validateContact({ ...b, emailSource: "typed" });
  if (!checked.ok) return { ok: false, code: "BUYER_INFO_INVALID", message: checked.message, status: 400 };
  return { ok: true, buyer: { userId: null, name: checked.value.name, email: checked.value.email, phone: checked.value.phone } };
}

export function accountPortFor(request: Request, create: (r: NextRequest) => AccountPort | null): AccountPort | null {
  return create(new NextRequest(request.url, { headers: request.headers }));
}
