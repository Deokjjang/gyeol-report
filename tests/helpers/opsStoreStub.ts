import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
/**
 * 결제 준비 경로 시험용 운영 저장소 대역(P6d-ops). 기존 결제 시험은 운영 DB 없이 돈다:
 *   vi.mock("<상대경로>/src/lib/ops/store", async () => (await import("<상대경로>/tests/helpers/opsStoreStub")).opsStoreModule);
 * 주문 기록(attach)은 주문코드를 돌려주고, 회원 가입 정보(read)는 opsStub.contact를 돌려준다.
 */
export const opsStub = {
  attach: [] as Record<string, unknown>[],
  contact: { name: "검수 회원", email: "member@example.com", phone: null } as { name: string; email: string; phone: string | null } | null,
};
export const TEST_BUYER = { name: "검수 구매자", email: "buyer@example.com", emailConfirm: "buyer@example.com" } as const;
const none = { call: async () => ({ ok: false, code: "STORAGE_UNAVAILABLE" }) };
export function createOpsStores() {
  return {
    generation: none, gift: none, comp: none, recon: none, notify: none, raw: none,
    order: { call: async (action: string, data: Record<string, unknown> = {}) => action === "attach" ? (opsStub.attach.push(data), { ok: true, orderCode: `GR-T${String(opsStub.attach.length).padStart(3, "0")}` }) : { ok: false, code: "STORAGE_UNAVAILABLE" } },
    account: { call: async (action: string) => action === "read" ? { ok: true, contact: opsStub.contact } : { ok: false, code: "STORAGE_UNAVAILABLE" } },
    audit: async () => true,
    db: null,
  };
}
export const opsStoreModule = { createOpsStores, OPS_RPC_TIMEOUT_MS: 10_000 };

/**
 * P 추가 A(2026-11-06): 결제는 로그인한 회원만. 결제 준비 경로 시험의 계정 대역 — 약관 동의(지금 문서 버전)와 가입 정보를 마친 회원.
 *   vi.mock("<상대경로>/src/lib/account/supabase", async () => (await import("<상대경로>/tests/helpers/opsStoreStub")).memberAccountModule);
 * 가입 정보(구매자 이름·이메일)는 위 opsStub.contact(ops account read)에서 온다.
 */
export const TEST_MEMBER = { id: "00000000-0000-4000-8000-0000000000b1", provider: "google" as const, displayName: "검수 회원" };
const MEMBER_CONSENTS = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, required: true, is_agreed: true, recorded_at: "2026-11-06T00:00:00.000Z" }));
export const memberAccountPort = () => ({
  authorizationOrigin: "https://test.supabase.co",
  currentUser: async () => TEST_MEMBER,
  read: async () => ({ profile: TEST_MEMBER, consents: MEMBER_CONSENTS, contact: { name: "검수 회원", email: "member@example.com" } }),
  finish: (response: Response) => response,
});
export const memberAccountModule = { createAccountPort: memberAccountPort };
