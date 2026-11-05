// 최종판3 1-7: 약관 문서 버전이 바뀐 뒤(재동의 전)에도 기존 회원은 이미 산 책을 읽는다. 새 결제·이용권 사용·공유 발급은 재동의 뒤.
import { describe, expect, it } from "vitest";
import { ACCOUNT_POLICY_VERSIONS, accountSession, mayReadOwnedBooks, type AccountSnapshot, type ConsentRecord } from "@/lib/account/policy";
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
