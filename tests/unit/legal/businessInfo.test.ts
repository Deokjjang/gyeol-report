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
      officialContactEmail: "official@dvem.ai",
      supportContactEmail: "support@dvem.ai",
      domain: "https://www.gyeolreport.com",
      mailOrderSalesRegistrationNumber: "신고 진행 중",
      customerServicePhone: "준비 중",
    });
  });

  it("does not invent pending review identifiers", () => {
    expect(GYEOL_BUSINESS_INFO.mailOrderSalesRegistrationNumber).toBe(
      "신고 진행 중",
    );
    expect(GYEOL_BUSINESS_INFO.customerServicePhone).toBe("준비 중");
  });
});
