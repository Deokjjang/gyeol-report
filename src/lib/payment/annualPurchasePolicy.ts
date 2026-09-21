import { isAnnualFortuneCommerceYearSelectable } from "../report-knowledge/annualFortuneYearRules";

// Stored beside reportInputPayload, never read from the browser's report payload.
export type AnnualCommerceAcceptance = {
  readonly version: "annual-commerce-v1";
  readonly acceptedAt: string;
  readonly selectedYear: number;
};

export function createAnnualCommerceAcceptance(selectedYear: number, acceptedAt: Date): AnnualCommerceAcceptance {
  return { version: "annual-commerce-v1", acceptedAt: acceptedAt.toISOString(), selectedYear };
}

// Only the paid worker supplies this context after reading the durable order.
// Shape validation alone is not authentication: public payload metadata is ignored.
export function getAnnualPurchasePolicyDate(context: unknown, payload: unknown): Date | null {
  if (!isObject(context) || !isObject(payload) || payload.productKey !== "annual_fortune" ||
    !isObject(payload.productOptions) || typeof payload.productOptions.selectedYear !== "string" ||
    context.version !== "annual-commerce-v1" || typeof context.acceptedAt !== "string" ||
    !Number.isInteger(context.selectedYear) || Number(payload.productOptions.selectedYear) !== context.selectedYear) return null;
  const acceptedAt = new Date(context.acceptedAt);
  if (!Number.isFinite(acceptedAt.getTime()) || acceptedAt.toISOString() !== context.acceptedAt ||
    !isAnnualFortuneCommerceYearSelectable(context.selectedYear as number, acceptedAt)) return null;
  return acceptedAt;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
