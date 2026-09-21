import { describe, expect, it } from "vitest";

import { GYEOL_BUSINESS_INFO } from "../../../src/lib/legal/businessInfo";

describe("Gyeol business info", () => {
  it("contains the review-ready business details", () => {
    expect(GYEOL_BUSINESS_INFO).toMatchObject({
      serviceNameKo: "결리포트",
      businessName: "DVEM",
      representativeKo: "장덕민",
      businessRegistrationNumber: "184-27-02002",
      postalCode: "22009",
      businessAddressKo:
        "인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      officialContactEmail: "support@dvem.ai",
      supportContactEmail: "support@dvem.ai",
      domain: "https://www.gyeolreport.com",
      mailOrderSalesRegistrationNumber: "2026-인천연수구-2118",
      customerServicePhone: "050-6664-8562",
      privacyOfficerName: "장덕민",
      privacyOfficerEmail: "support@dvem.ai",
      hostingProvider: "Vercel Inc.",
    });
    expect("taxTypeKo" in GYEOL_BUSINESS_INFO).toBe(false);
  });

  it("publishes the confirmed registration and business phone", () => {
    const oldPhonePlaceholder = "준비 " + "중";

    expect(GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber).toBe(
      "2026-인천연수구-2118",
    );
    expect(GYEOL_BUSINESS_INFO.customerServicePhone).toBe("050-6664-8562");
    expect(GYEOL_BUSINESS_INFO).not.toMatchObject({
      customerServicePhone: oldPhonePlaceholder,
    });
  });
});
