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
/**
 * 최종 A 16: 결제 동의 화면. 주문 확인 세 가지(입력 정보·디지털 리포트 생성 시작·청약철회 제한)를 체크박스 한 칸
 * 「주문 내용과 환불 안내를 확인했어요」로 합쳤다. 한 칸을 체크하면 세 확인이 함께 참이 된다(서버 검증은 그대로 세 값 모두 참).
 * 약관·개인정보 동의(개인정보 보호법: 다른 동의와 구분), 만 14세 이상, 미성년자 법정대리인 확인은 따로 둔다.
 * 증명용으로 이 화면 판(version)·각 칸 문구·덮는 확인 항목·체크 시각을 동의 기록(consentEvidence.ui)에 남긴다.
 * 문구는 서버 상수에서 채운다(브라우저가 보낸 문구를 그대로 믿지 않는다). ui가 없으면 그 이전(칸마다 따로) 화면이다.
 */
export const CHECKOUT_CONSENT_UI_VERSION = "final4-order-refund-v1";
export const ORDER_REFUND_CONSENT_TEXT = "주문 내용과 환불 안내를 확인했어요";
export const ORDER_REFUND_CONSENT_COVERS = ["inputAccuracy", "digitalReportStart", "refundRestriction"] as const satisfies readonly (keyof CheckoutLegalConfirmations)[];
/** 약관 칸 문구: 비회원은 세 문서, 회원은 가입 때 약관·개인정보에 동의했으므로 환불정책만(account/policy purchasePolicyLabel과 같다). */
export const POLICY_CONSENT_TEXTS = ["이용약관·개인정보·환불정책 동의", "환불정책 동의"] as const;
export type CheckoutConsentUiBox = { readonly text: string; readonly covers: readonly string[] };
export type CheckoutConsentUi = {
  readonly version: typeof CHECKOUT_CONSENT_UI_VERSION;
  readonly boxes: readonly CheckoutConsentUiBox[];
  /** 「주문 내용과 환불 안내를 확인했어요」 칸을 마지막으로 체크한 브라우저 시각(서버 수신 시각 앞 24시간 안일 때만). */
  readonly checkedAt: string | null;
};
export function checkoutConsentUiBoxes(policyText: string, minor: boolean): CheckoutConsentUiBox[] {
  return [
    { text: ORDER_REFUND_CONSENT_TEXT, covers: [...ORDER_REFUND_CONSENT_COVERS] },
    { text: policyText, covers: ["termsAccepted", "privacyAccepted", "refundAccepted"] },
    { text: "만 14세 이상", covers: ["age14OrOlder"] },
    ...(minor ? [{ text: "미성년자 법정대리인 동의", covers: ["minorLegalRepresentative"] }] : []),
  ];
}
export type CheckoutConsentEvidence = {
  readonly version: "checkout-consent-v1";
  readonly acceptedAt: string;
  readonly policyVersions: CheckoutPolicyVersions;
  readonly ageBand: "adult" | "minor";
  readonly assertions: CheckoutConsentAssertions;
  readonly ui?: CheckoutConsentUi;
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

/** 화면이 보내는 동의 화면 정보(문구는 보내지 않는다 — 서버가 판 번호로 채운다). */
export type CheckoutConsentUiClaim = { readonly version: typeof CHECKOUT_CONSENT_UI_VERSION; readonly policyText: string; readonly checkedAt?: string };
// The three policy assertions originate in ONE existing grouped checkbox.
export function createCheckoutConsentAssertion(confirmations: CheckoutLegalConfirmations, policyVersions: CheckoutPolicyVersions = CHECKOUT_POLICY_VERSIONS, ui?: CheckoutConsentUiClaim) {
  return { policyVersions: { ...policyVersions }, ...(ui ? { ui: { ...ui } } : {}), assertions: {
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
  const ui = consentUiOf(value.ui, ageBand === "minor", acceptedAt);
  return {
    version: "checkout-consent-v1", acceptedAt: acceptedAt.toISOString(), policyVersions: { ...versions }, ageBand,
    assertions: {
      inputAccuracy: true, digitalReportStart: true, refundRestriction: true,
      termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true,
      minorLegalRepresentative: assertions.minorLegalRepresentative === true,
    },
    ...(ui ? { ui } : {}),
  };
}

/** 알 수 없는 판·문구는 기록하지 않는다(동의 자체는 assertions로 이미 검증됨). 체크 시각은 서버 수신 24시간 전~5분 뒤만. */
function consentUiOf(value: unknown, minor: boolean, acceptedAt: Date): CheckoutConsentUi | null {
  if (!record(value) || value.version !== CHECKOUT_CONSENT_UI_VERSION) return null;
  const policyText = POLICY_CONSENT_TEXTS.find(t => t === value.policyText) ?? POLICY_CONSENT_TEXTS[0];
  const at = typeof value.checkedAt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(value.checkedAt) ? Date.parse(value.checkedAt) : NaN;
  const checkedAt = Number.isFinite(at) && at <= acceptedAt.getTime() + 5 * 60_000 && at >= acceptedAt.getTime() - 24 * 3_600_000 ? new Date(at).toISOString() : null;
  return { version: CHECKOUT_CONSENT_UI_VERSION, boxes: checkoutConsentUiBoxes(policyText, minor), checkedAt };
}
