export const GYEOL_PRODUCTS = [
  {
    id: "comprehensive",
    productType: "saju_mbti_full",
    paymentProductType: "saju_mbti_full",
    slug: "saju-mbti-full",
    nameKo: "종합 리포트",
    fullNameKo: "사주×MBTI 전체 리포트",
    priceKo: "990원",
    priceLabelKo: "990원",
    listPriceKo: "1,290원",
    listPriceLabelKo: "1,290원",
    salePriceKo: "런칭가 990원",
    priceAmount: 990,
    listPriceAmount: 1290,
    salePriceAmount: 990,
    paymentAmount: 990,
    currency: "KRW",
    status: "available",
    isPurchasable: true,
    href: "/report/new",
    ctaHref: "/report/new",
    badgeKo: "런칭가",
    visualKey: "comprehensive",
    deliveryTypeKo: "결제 승인 후 온라인 열람",
    formatKo: "디지털 리포트",
    summaryKo:
      "생년월일시와 MBTI 자기보고 정보를 바탕으로 사주 구조, 성향, 일·관계 활용 방향을 정리한 자기이해용 디지털 리포트입니다.",
    cautionKo:
      "사주·MBTI 해석은 자기이해용 참고 콘텐츠이며 의학, 법률, 투자, 심리진단, 미래 사건 예측을 보장하지 않습니다.",
  },
] as const;

export const GYEOL_COMING_SOON_PRODUCTS = [
  {
    id: "second_half",
    nameKo: "하반기 운세",
    shortDescriptionKo: "하반기 흐름을 세운 기준으로 가볍게 정리하는 리포트",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "half_year",
  },
  {
    id: "compatibility_report",
    nameKo: "궁합 리포트",
    shortDescriptionKo: "두 사람의 성향과 관계 흐름을 참고용으로 비교하는 리포트",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "compatibility",
  },
  {
    id: "daewoon_report",
    nameKo: "대운 리포트",
    shortDescriptionKo: "큰 흐름을 자기관리 관점에서 살펴보는 리포트",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "daewoon",
  },
  {
    id: "saewoon_report",
    nameKo: "세운 리포트",
    shortDescriptionKo: "연간 흐름을 일과 관계 활용 관점에서 정리하는 리포트",
    status: "coming_soon",
    isPurchasable: false,
    href: null,
    badgeKo: "출시 준비 중",
    visualKey: "saewoon",
  },
] as const;

export const GYEOL_HOME_PRODUCT_GRID = [
  GYEOL_COMING_SOON_PRODUCTS[0],
  GYEOL_PRODUCTS[0],
  GYEOL_COMING_SOON_PRODUCTS[2],
  GYEOL_COMING_SOON_PRODUCTS[3],
  GYEOL_COMING_SOON_PRODUCTS[1],
] as const;

export type GyeolProduct = (typeof GYEOL_PRODUCTS)[number];
export type GyeolComingSoonProduct =
  (typeof GYEOL_COMING_SOON_PRODUCTS)[number];
export type GyeolProductGridItem = (typeof GYEOL_HOME_PRODUCT_GRID)[number];
