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
      mailOrderSalesRegistrationNumber: "신고 진행 중",
      customerServicePhone: "010-3156-8568",
      privacyOfficerName: "장덕민",
      privacyOfficerEmail: "support@dvem.ai",
      hostingProvider: "Vercel Inc.",
      taxTypeKo: "일반과세자",
    });
  });

  it("keeps only the mail-order registration as pending", () => {
    const oldPhonePlaceholder = "준비 " + "중";

    expect(GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber).toBe(
      "신고 진행 중",
    );
    expect(GYEOL_BUSINESS_INFO.customerServicePhone).toBe("010-3156-8568");
    expect(GYEOL_BUSINESS_INFO).not.toMatchObject({
      customerServicePhone: oldPhonePlaceholder,
    });
  });
});
