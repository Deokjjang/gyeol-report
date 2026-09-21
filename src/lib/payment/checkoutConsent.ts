import { CHECKOUT_POLICY_VERSIONS, type CheckoutPolicyVersions } from "../legal/policyVersions";
import { getAnnualFortuneSeoulDateParts } from "../report-knowledge/annualFortuneYearRules";

export type CheckoutLegalConfirmations = {
  readonly inputAccuracy: boolean;
  readonly digitalReportStart: boolean;
  readonly refundRestriction: boolean;
  readonly policyAgreement: boolean;
  readonly age14OrOlder: boolean;
  readonly minorLegalRepresentative: boolean;
};
export type CheckoutAgeGateStatus = "adult" | "minor" | "under_14" | "invalid_birthdate";
const requiredAssertions = ["inputAccuracy", "digitalReportStart", "refundRestriction", "termsAccepted", "privacyAccepted", "refundAccepted", "age14OrOlder"] as const;
export type CheckoutConsentAssertions = Record<typeof requiredAssertions[number], boolean> & { readonly minorLegalRepresentative: boolean };
export type CheckoutConsentEvidence = {
  readonly version: "checkout-consent-v1";
  readonly acceptedAt: string;
  readonly policyVersions: CheckoutPolicyVersions;
  readonly ageBand: "adult" | "minor";
  readonly assertions: CheckoutConsentAssertions;
};
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

// Same completed-birthday rule as the existing UI; evaluate today's date in Seoul.
export function calculateCheckoutAge(birthDate: string, asOfDate: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match || !Number.isFinite(asOfDate.getTime())) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (birth.getUTCFullYear() !== year || birth.getUTCMonth() !== month - 1 || birth.getUTCDate() !== day) return null;
  const today = getAnnualFortuneSeoulDateParts(asOfDate);
  return today.year - year - (today.month < month || (today.month === month && today.day < day) ? 1 : 0);
}
export function getCheckoutAgeGateStatus(birthDate: string, asOfDate = new Date()): CheckoutAgeGateStatus {
  const age = calculateCheckoutAge(birthDate, asOfDate);
  return age === null ? "invalid_birthdate" : age < 14 ? "under_14" : age < 19 ? "minor" : "adult";
}

// The three policy assertions originate in ONE existing grouped checkbox.
export function createCheckoutConsentAssertion(confirmations: CheckoutLegalConfirmations, policyVersions: CheckoutPolicyVersions = CHECKOUT_POLICY_VERSIONS) {
  return { policyVersions: { ...policyVersions }, assertions: {
    inputAccuracy: confirmations.inputAccuracy,
    digitalReportStart: confirmations.digitalReportStart,
    refundRestriction: confirmations.refundRestriction,
    termsAccepted: confirmations.policyAgreement,
    privacyAccepted: confirmations.policyAgreement,
    refundAccepted: confirmations.policyAgreement,
    age14OrOlder: confirmations.age14OrOlder,
    minorLegalRepresentative: confirmations.minorLegalRepresentative,
  } };
}

export function createCheckoutConsentEvidence(value: unknown, birthDate: string, acceptedAt: Date, versions: CheckoutPolicyVersions = CHECKOUT_POLICY_VERSIONS): CheckoutConsentEvidence | null {
  if (!record(value) || !record(value.policyVersions) || !record(value.assertions)) return null;
  const submittedVersions = value.policyVersions;
  if (Object.entries(versions).some(([key, version]) => submittedVersions[key] !== version)) return null;
  const assertions = value.assertions;
  if (requiredAssertions.some(key => assertions[key] !== true)) return null;
  if (Object.keys(assertions).some(key => ![...requiredAssertions, "minorLegalRepresentative"].includes(key))) return null;
  if (assertions.minorLegalRepresentative !== undefined && typeof assertions.minorLegalRepresentative !== "boolean") return null;
  const ageBand = getCheckoutAgeGateStatus(birthDate, acceptedAt);
  if (ageBand === "under_14" || ageBand === "invalid_birthdate" || (ageBand === "minor" && assertions.minorLegalRepresentative !== true)) return null;
  return {
    version: "checkout-consent-v1", acceptedAt: acceptedAt.toISOString(), policyVersions: { ...versions }, ageBand,
    assertions: {
      inputAccuracy: true, digitalReportStart: true, refundRestriction: true,
      termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true,
      minorLegalRepresentative: assertions.minorLegalRepresentative === true,
    },
  };
}
