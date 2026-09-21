// Version identifiers for the current text, not new effective dates.
// Terms retain their existing 2026-06-14 effective date; privacy/refund are undated.
// Increment the relevant identifier whenever its canonical policy text changes.
export const CHECKOUT_POLICY_VERSIONS = {
  terms: "2026-06-14.1",
  privacy: "2026-09-22.1",
  refund: "2026-09-22.1",
} as const;
export type CheckoutPolicyVersions = { readonly terms: string; readonly privacy: string; readonly refund: string };
