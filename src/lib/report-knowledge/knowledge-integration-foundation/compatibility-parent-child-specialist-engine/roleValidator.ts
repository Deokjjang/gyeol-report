import { normalizeReportInputPayload } from "../../../report-generation/reportInputAdapter";
import type { ReportInputPayload } from "../../../report-generation/reportInputTypes";

export const ROLE_VERSION = "compatibility-fixed-ab-v1" as const;
export function validateRole(input: { compatibilityRoleVersion?: unknown; relationshipType?: unknown }) {
  const version = input.compatibilityRoleVersion;
  return {
    state: version === ROLE_VERSION ? "V4_FIXED_ROLE_ACCEPTED" : version === undefined ? "V4_FIXED_ROLE_REQUIRED" : "INVALID_ROLE_VERSION",
    roles: version === ROLE_VERSION ? { A: "부모", B: "자녀" } : null,
    actualParentage: "UNVERIFIED_ROLE_ASSIGNMENT",
    legalAuthority: "UNKNOWN",
    originalError: version === undefined ? "V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED" : version === ROLE_VERSION ? null : "INVALID_COMPATIBILITY_ROLE_VERSION",
  } as const;
}
export function legacyRoleBoundary(payload: ReportInputPayload) {
  const normalized = normalizeReportInputPayload(payload);
  return { normalization: normalized.ok ? "LEGACY_NORMALIZATION_ACCEPTED" : normalized.error, v4: validateRole(payload as { compatibilityRoleVersion?: unknown }), legacyBooksReinterpreted: false };
}
export function swapRoleDeclaration(wholeSwap: boolean) {
  return wholeSwap ? "WHOLE_SWAP_ROLE_DECLARATION_CHANGED" : "NAME_ONLY_SWAP_NO_ROLE_CHANGE";
}
