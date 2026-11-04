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
    generation: none, gift: none,
    order: { call: async (action: string, data: Record<string, unknown> = {}) => action === "attach" ? (opsStub.attach.push(data), { ok: true, orderCode: `GR-T${String(opsStub.attach.length).padStart(3, "0")}` }) : { ok: false, code: "STORAGE_UNAVAILABLE" } },
    account: { call: async (action: string) => action === "read" ? { ok: true, contact: opsStub.contact } : { ok: false, code: "STORAGE_UNAVAILABLE" } },
    audit: async () => true,
    db: null,
  };
}
export const opsStoreModule = { createOpsStores, OPS_RPC_TIMEOUT_MS: 10_000 };
