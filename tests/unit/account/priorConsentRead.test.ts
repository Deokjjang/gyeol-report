// 최종판3 1-7: 약관 문서 버전이 바뀐 뒤(재동의 전)에도 기존 회원은 이미 산 책을 읽는다. 새 결제·이용권 사용·공유 발급은 재동의 뒤.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ACCOUNT_POLICY_VERSIONS, accountSession, mayReadOwnedBooks, validConsentSubmission, type AccountSnapshot, type ConsentRecord } from "@/lib/account/policy";
import { resolveBuyer } from "@/lib/ops/orders/buyer";
import { readOwnedTicketReport } from "@/lib/tickets/ownerRead";
import type { AccountPort } from "@/lib/account/handler";
import type { TicketStore } from "@/lib/tickets/service";

const identity = { id: "11111111-1111-4111-8111-111111111111", displayName: "검수", provider: "google" as const };
const rec = (consent_type: "terms" | "privacy", document_version: string, is_agreed = true): ConsentRecord => ({ consent_type, document_version, is_agreed, required: true, recorded_at: "2026-10-01T00:00:00.000Z" });
// 운영 기존 회원 모양: 이전 문서 버전에 동의(로컬 검수 계정 기록과 같은 버전).
const OLD: AccountSnapshot = { profile: identity, consents: [rec("terms", "2026-06-14.1"), rec("privacy", "2026-09-22.1")] };
const CURRENT: AccountSnapshot = { profile: identity, consents: Object.entries(ACCOUNT_POLICY_VERSIONS).map(([t, v]) => rec(t as "terms" | "privacy", v)) };
const authOf = (snapshot: AccountSnapshot | null): AccountPort => ({ currentUser: async () => identity, read: async () => snapshot, start: async () => null, exchange: async () => false, logout: async () => true, consent: async () => true, authorizationOrigin: "https://example.invalid", finish: r => r });

describe("산 책 열람은 예전 동의로도 된다(최종판3 1-7)", () => {
  it("문서 버전이 달라 재동의가 필요한 회원: 세션은 needs_consent(새 결제 막힘) · 산 책 열람은 허용", () => {
    expect(ACCOUNT_POLICY_VERSIONS.terms).not.toBe("2026-06-14.1");
    expect(accountSession(identity, OLD).status).toBe("needs_consent");
    expect(mayReadOwnedBooks(identity, OLD)).toBe(true);
    expect(mayReadOwnedBooks(identity, CURRENT)).toBe(true);
  });
  it("동의를 거둔 회원·동의 기록 없는 회원·프로필 없는 회원·비로그인은 읽지 못한다", () => {
    expect(mayReadOwnedBooks(identity, { profile: identity, consents: [rec("terms", "2026-06-14.1", false), rec("terms", "2026-06-14.1"), rec("privacy", "2026-09-22.1")] })).toBe(false);
    expect(mayReadOwnedBooks(identity, { profile: identity, consents: [rec("terms", "2026-06-14.1")] })).toBe(false);
    expect(mayReadOwnedBooks(identity, { profile: null, consents: OLD.consents })).toBe(false);
    expect(mayReadOwnedBooks(null, OLD)).toBe(false);
  });
  it("이용권 책: 예전 동의 회원도 자기 책을 연다(다른 판정은 그대로)", async () => {
    const snapshot = { reportId: "report_prior_consent_0001" };
    const store: TicketStore = { call: async () => ({ ok: true, status: "EXPIRED", snapshot }) } as unknown as TicketStore;
    // 소유 확인을 통과해 저장소까지 간다(만료 책이면 expired) — 막혔다면 absent.
    expect(await readOwnedTicketReport("report_prior_consent_0001", authOf(OLD), store)).toEqual({ kind: "expired" });
    expect(await readOwnedTicketReport("report_prior_consent_0001", authOf({ profile: identity, consents: [] }), store)).toEqual({ kind: "absent" });
  });
});

// 운영 Q 정정(9부): 개인정보처리방침은 문서만 개정하고 동의 버전(2026-11-06.1)은 올리지 않는다(문서 개정 공지만).
// 어제(11-06.1 판)에 동의한 운영 회원은 배포 뒤에도 그대로 회원 — 결제·이용권을 쓰고, 다시 동의하라는 화면이 나오지 않는다.
// 예전 판(11-05.1 이하)에 동의한 회원만 지금처럼 다시 동의한다(규칙 그대로). 버전 값은 운영 회원 기록과 같은 글자로 고정해 둔다.
describe("운영 Q 정정: 개인정보처리방침 문서 개정 — 재동의 없음", () => {
  const YESTERDAY: AccountSnapshot = { profile: identity, consents: [rec("terms", "2026-11-06.1"), rec("privacy", "2026-11-06.1")], contact: { name: "검수", email: "a@example.com" } };
  const BEFORE_P: AccountSnapshot = { ...YESTERDAY, consents: [rec("terms", "2026-11-05.1"), rec("privacy", "2026-11-05.1")] };
  const account = { call: async () => ({ ok: true, contact: { name: "검수", email: "a@example.com", phone: null } }) };
  it("동의 버전은 어제 판 그대로(약관·방침 모두 2026-11-06.1) — 11-06.1 판 회원은 member, 11-05.1 판 회원은 지금처럼 needs_consent", () => {
    expect(ACCOUNT_POLICY_VERSIONS).toEqual({ terms: "2026-11-06.1", privacy: "2026-11-06.1" });
    expect(accountSession(identity, YESTERDAY).status).toBe("member");
    expect(accountSession(identity, BEFORE_P).status).toBe("needs_consent");
    expect(mayReadOwnedBooks(identity, BEFORE_P)).toBe(true);
    // 동의 화면이 보내는 버전도 어제 판 그대로(새 판 이름으로 보낸 동의는 받지 않는다).
    const body = { requestId: "11111111-1111-4111-8111-111111111111", terms: true, privacy: true };
    expect(validConsentSubmission({ ...body, versions: { terms: "2026-11-06.1", privacy: "2026-11-06.1" } })).toBe(true);
    expect(validConsentSubmission({ ...body, versions: { terms: "2026-11-06.1", privacy: "2026-11-07.1" } })).toBe(false);
  });
  it("결제 준비(서버 resolveBuyer): 어제 동의한 회원은 다시 동의하지 않고 구매자로 통과, 예전 판 회원은 LOGIN_REQUIRED(401)", async () => {
    const yesterday = await resolveBuyer(new Request("https://www.gyeolreport.com/api/payments/checkout"), {}, { port: authOf(YESTERDAY), account });
    expect(yesterday).toMatchObject({ ok: true, buyer: { userId: identity.id } });
    const old = await resolveBuyer(new Request("https://www.gyeolreport.com/api/payments/checkout"), {}, { port: authOf(BEFORE_P), account });
    expect(old).toMatchObject({ ok: false, code: "LOGIN_REQUIRED", status: 401 });
  });
  it("주문서 화면도 needs_consent면 결제 버튼을 막는다(BookCheckout blocked 조건)", () => {
    expect(readFileSync("src/components/book/BookCheckout.tsx", "utf8")).toMatch(/const blocked = [^\n]*session\.status === "needs_consent"/);
  });
  it("이용권 책: 재동의 전에도 자기 책을 연다", async () => {
    const store: TicketStore = { call: async () => ({ ok: true, status: "EXPIRED", snapshot: { reportId: "report_prior_consent_0002" } }) } as unknown as TicketStore;
    expect(await readOwnedTicketReport("report_prior_consent_0002", authOf(BEFORE_P), store)).toEqual({ kind: "expired" });
  });
});
