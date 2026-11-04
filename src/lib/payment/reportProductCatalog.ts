import {
  parseReportProductType,
  reportProductTypes,
} from "./reportProductTypes";
import type { ReportProductType } from "./reportProductTypes";

export type ReportProductCurrency = "KRW";

// New-order pricing SSOT. Persisted orders remain authoritative for past payments.
// 가격을 바꿀 때는 이 한 줄만 바꾼다(새 주문부터 적용). 바꾸기 전에 만든 주문은 저장된 금액으로 승인된다.
export const REPORT_PRICE_KRW = 1490;
export const REPORT_PRICE_LABEL_KO = `${REPORT_PRICE_KRW.toLocaleString("ko-KR")}원`;
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
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
    isPurchasable: true,
  },
  {
    productType: "career_money_study",
    labelKo: "직업·커리어·돈·학업 리포트",
    descriptionKo: "직업, 커리어, 돈, 학업 흐름을 한 사람 기준으로 보는 리포트입니다.",
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
    isPurchasable: true,
  },
  {
    productType: "love_marriage_child",
    labelKo: "연애·결혼·자녀 리포트",
    descriptionKo: "연애, 결혼, 부모 역할 성향을 한 사람 기준으로 보는 리포트입니다.",
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
    isPurchasable: true,
  },
  {
    productType: "saju_mbti_compatibility",
    labelKo: "궁합 리포트",
    descriptionKo: "두 사람의 관계 카테고리별 궁합 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
    isPurchasable: true,
  },
  {
    productType: "major_fortune",
    labelKo: "대운 리포트",
    descriptionKo: "10년 단위의 큰 운 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
    isPurchasable: true,
  },
  {
    productType: "annual_fortune",
    labelKo: "세운 리포트",
    descriptionKo: "선택한 한 해의 세운 흐름을 보는 리포트입니다.",
    amount: REPORT_PRICE_KRW,
    currency: "KRW",
    priceLabelKo: REPORT_PRICE_LABEL_KO,
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
