export const GYEOL_PRODUCTS = [
  {
    productType: "saju_mbti_full",
    slug: "saju-mbti-full",
    nameKo: "사주×MBTI 전체 리포트",
    priceKo: "1,290원",
    priceAmount: 1290,
    currency: "KRW",
    deliveryTypeKo: "결제 승인 후 온라인 열람",
    formatKo: "디지털 리포트",
    summaryKo:
      "생년월일시와 MBTI 자기보고 정보를 바탕으로 사주 구조, 성향, 일·관계 활용 포인트를 정리한 자기이해용 디지털 리포트입니다.",
    cautionKo:
      "사주·MBTI 해석은 자기이해용 참고 콘텐츠이며 의학, 법률, 투자, 심리진단, 미래 사건 예측을 보장하지 않습니다.",
  },
] as const;

export type GyeolProduct = (typeof GYEOL_PRODUCTS)[number];
