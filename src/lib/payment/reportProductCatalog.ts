import {
  parseReportProductType,
  reportProductTypes,
} from "./reportProductTypes";
import type { ReportProductType } from "./reportProductTypes";

export type ReportProductCurrency = "KRW";

// New-order pricing SSOT. Persisted orders remain authoritative for past payments.
// 가격은 이 상품별 표 한 곳에서만 정한다(새 주문부터 적용). 화면·주문 생성·결제 금액 검증·이벤트·영수증이 모두 이 표를 읽는다.
// 바꾸기 전에 만든 주문은 서버에 저장된 금액(payment_orders.amount) == 토스 금액이면 그대로 승인된다(아래 isDirectReportPaymentAmount 설명).
/**
 * AM 6부(덕짱님 결정 대기): 대운·세운 가격은 코드 상수가 아니라 설정값이다(비워 두면 판매하지 않는다 — ops/config closedSaleProducts).
 * 서버 FORTUNE_PRICE_MAJOR_KRW·FORTUNE_PRICE_ANNUAL_KRW, 화면 표시는 NEXT_PUBLIC_ 같은 이름(빌드 때 새겨짐). 비어 있으면 표의 자리표시 값(판매 안 됨)이 타입만 채운다.
 */
const fortunePrice = (server: string | undefined, client: string | undefined) => { const v = Number(server ?? client); return Number.isSafeInteger(v) && v >= 100 ? v : null; };
export const FORTUNE_PRICE_KRW = {
  major_fortune: fortunePrice(process.env.FORTUNE_PRICE_MAJOR_KRW, process.env.NEXT_PUBLIC_FORTUNE_PRICE_MAJOR_KRW),
  annual_fortune: fortunePrice(process.env.FORTUNE_PRICE_ANNUAL_KRW, process.env.NEXT_PUBLIC_FORTUNE_PRICE_ANNUAL_KRW),
} as const;
const FORTUNE_PLACEHOLDER_KRW = 4900;
export const REPORT_PRICE_TABLE_KRW = {
  saju_mbti_full: 3900,
  career_money_study: 3900,
  love_marriage_child: 3900,
  saju_mbti_compatibility: 3900,
  // 대운·세운: 설정값(FORTUNE_PRICE_*_KRW). 비어 있으면 자리표시(판매 안 됨).
  major_fortune: FORTUNE_PRICE_KRW.major_fortune ?? FORTUNE_PLACEHOLDER_KRW,
  annual_fortune: FORTUNE_PRICE_KRW.annual_fortune ?? FORTUNE_PLACEHOLDER_KRW,
} as const satisfies Record<ReportProductType, number>;
export const formatKrw = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
/** 상품 하나의 새 주문 가격(원). */
export function reportPriceKrw(productType: ReportProductType): number { return REPORT_PRICE_TABLE_KRW[productType]; }
/** 출시 4종(종합·커리어·연애·궁합) 공통 가격 — 표의 종합 값을 읽는다. 상품을 아는 곳은 reportPriceKrw(productType)를 쓴다. */
export const REPORT_PRICE_KRW: number = REPORT_PRICE_TABLE_KRW.saju_mbti_full;
export const REPORT_PRICE_LABEL_KO = formatKrw(REPORT_PRICE_KRW);
/** 토스 결제 최소 금액(원). 금액 모양 검사의 하한일 뿐 가격이 아니다. */
export const MIN_PAYMENT_AMOUNT_KRW = 100;
/**
 * 결제 금액의 모양만 본다(안전한 정수, 토스 최소 금액 이상). 가격 숫자와는 비교하지 않는다.
 * 승인 때 금액 대조는 하나뿐이다: 주문을 만들 때 서버가 카탈로그 가격으로 저장한 금액(payment_orders.amount)
 * == 토스 금액. SQL `paid_report_reliability('confirm_claim')`이 저장 금액과 요청 금액을, `confirmPaidReport`가
 * 토스 승인 응답 금액과 요청 금액을 대조한다. 그래서 가격을 바꿔도 바꾸기 전에 만든 주문은 그대로 승인되고,
 * 저장 금액과 다른 금액(위조)은 거절된다.
 */
export function isDirectReportPaymentAmount(amount: unknown): amount is number {
  return typeof amount === "number" && Number.isSafeInteger(amount) && amount >= MIN_PAYMENT_AMOUNT_KRW;
}

export type ReportProductCatalogItem = {
  readonly productType: ReportProductType;
  readonly labelKo: string;
  readonly descriptionKo: string;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly listPriceAmount?: number;
  readonly salePriceAmount?: number;
  readonly priceLabelKo?: string;
  readonly listPriceLabelKo?: string;
  readonly salePriceLabelKo?: string;
  readonly isPurchasable: boolean;
};

const reportProductCatalog = [
  {
    productType: "saju_mbti_full",
    labelKo: "사주×MBTI 종합 리포트",
    descriptionKo: "명리 구조와 MBTI 행동 패턴을 함께 읽는 종합 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.saju_mbti_full,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.saju_mbti_full),
    isPurchasable: true,
  },
  {
    productType: "career_money_study",
    labelKo: "직업·커리어·돈·학업 리포트",
    descriptionKo: "직업, 커리어, 돈, 학업 흐름을 한 사람 기준으로 보는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.career_money_study,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.career_money_study),
    isPurchasable: true,
  },
  {
    productType: "love_marriage_child",
    labelKo: "연애·결혼·자녀 리포트",
    descriptionKo: "연애, 결혼, 부모 역할 성향을 한 사람 기준으로 보는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.love_marriage_child,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.love_marriage_child),
    isPurchasable: true,
  },
  {
    productType: "saju_mbti_compatibility",
    labelKo: "궁합 리포트",
    descriptionKo: "두 사람의 관계 카테고리별 궁합 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.saju_mbti_compatibility,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.saju_mbti_compatibility),
    isPurchasable: true,
  },
  {
    productType: "major_fortune",
    labelKo: "대운 리포트",
    descriptionKo: "10년 단위의 큰 운 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.major_fortune,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.major_fortune),
    isPurchasable: true,
  },
  {
    productType: "annual_fortune",
    labelKo: "세운 리포트",
    descriptionKo: "선택한 한 해의 세운 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.annual_fortune,
    currency: "KRW",
    priceLabelKo: formatKrw(REPORT_PRICE_TABLE_KRW.annual_fortune),
    isPurchasable: true,
  },
] as const satisfies readonly ReportProductCatalogItem[];

export function getReportProductCatalog(): readonly ReportProductCatalogItem[] {
  return reportProductCatalog;
}

export function getReportProduct(
  productType: unknown,
): ReportProductCatalogItem | null {
  const parsedProductType = parseReportProductType(productType);

  if (parsedProductType === null) {
    return null;
  }

  return (
    reportProductCatalog.find(
      (product) => product.productType === parsedProductType,
    ) ?? null
  );
}

export function isPurchasableReportProduct(productType: unknown): boolean {
  return getReportProduct(productType)?.isPurchasable === true;
}

export function getInactiveReportProductTypes(): readonly ReportProductType[] {
  return reportProductTypes.filter(
    (productType) => !isPurchasableReportProduct(productType),
  );
}
