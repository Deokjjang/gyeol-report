import { createCheckoutConsentAssertion } from "../../src/lib/payment/checkoutConsent";

export const adultCheckoutConsent = () => createCheckoutConsentAssertion({
  inputAccuracy: true, digitalReportStart: true, refundRestriction: true,
  policyAgreement: true, age14OrOlder: true, minorLegalRepresentative: false,
});
