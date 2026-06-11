export type GyeolBusinessInfo = {
  readonly serviceNameKo: string;
  readonly businessName: string;
  readonly representativeKo: string;
  readonly businessRegistrationNumber: string;
  readonly postalCode: string;
  readonly businessAddressKo: string;
  readonly officialContactEmail: string;
  readonly supportContactEmail: string;
  readonly domain: string;
  readonly mailOrderSalesRegistrationNumber: string;
  readonly customerServicePhone: string;
  readonly privacyOfficerName: string;
  readonly privacyOfficerEmail: string;
  readonly hostingProvider: string;
  readonly taxTypeKo: string;
};

export const GYEOL_BUSINESS_INFO = {
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
} as const satisfies GyeolBusinessInfo;
