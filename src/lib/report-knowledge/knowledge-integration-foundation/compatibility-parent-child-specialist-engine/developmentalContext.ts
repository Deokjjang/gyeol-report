export const DEVELOPMENTAL_CONTEXTS = ["YOUNG", "SCHOOL", "TEEN", "ADULT", "UNKNOWN"] as const;
export type DevelopmentalContext = typeof DEVELOPMENTAL_CONTEXTS[number];
export type ContextDeclaration = { context: string; verified: boolean; supportStateVerified: boolean; source: string };
export function evaluateContext(allowed: readonly string[], declaration?: ContextDeclaration) {
  const context = declaration?.context ?? "UNKNOWN";
  const state = !declaration ? "CONTEXT_NOT_ENTERED" : !DEVELOPMENTAL_CONTEXTS.includes(context as DevelopmentalContext) ? "CONTEXT_UNSUPPORTED" : !declaration.verified || !declaration.supportStateVerified || !declaration.source ? "CONTEXT_REVIEW_REQUIRED" : !allowed.includes(context) ? "CONTEXT_MISMATCH" : context === "UNKNOWN" ? "CONTEXT_REVIEW_REQUIRED" : "CONTEXT_VERIFIED";
  return { context, state, declared: !!declaration, actualAge: "UNKNOWN", actualAbility: "UNKNOWN", actualSupportNeed: state === "CONTEXT_VERIFIED" ? "SYNTHETIC_EXPLICIT_CONTEXT_ONLY" : "UNKNOWN", ageCalculated: false, hypotheticalResearchContextIsActualInput: false, applicable: state === "CONTEXT_VERIFIED", reasons: state === "CONTEXT_VERIFIED" ? [] : [state, "DEVELOPMENTAL_STAGE_UNVERIFIED"] };
}
