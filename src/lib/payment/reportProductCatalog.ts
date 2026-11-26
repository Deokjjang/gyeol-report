import {
  parseReportProductType,
  reportProductTypes,
} from "./reportProductTypes";
import type { ReportProductType } from "./reportProductTypes";
import { annualProductYear } from "../ops/config";
/** ZW-2: 「나의 열두 서가」(덕짱님 0부 답 2026-11-26) — book/product.ts ZIWEI_BOOK과 같은 이름. */
export const ZIWEI_BOOK_NAME = "나의 열두 서가";

export type ReportProductCurrency = "KRW";

// New-order pricing SSOT. Persisted orders remain authoritative for past payments.
// 가격은 이 상품별 표 한 곳에서만 정한다(새 주문부터 적용). 화면·주문 생성·결제 금액 검증·이벤트·영수증이 모두 이 표를 읽는다.
// 바꾸기 전에 만든 주문은 서버에 저장된 금액(payment_orders.amount) == 토스 금액이면 그대로 승인된다(아래 isDirectReportPaymentAmount 설명).
/**
 * AM2-14 5부(덕짱님 결정 2026-11-23 · 11-24): 대운 · 세운 가격도 4종처럼 이 표의 상수다(운영 env에 기대지 않는다 — FORTUNE_PRICE_* · NEXT_PUBLIC_FORTUNE_PRICE_*는 읽지 않는다).
 * 세운 「나의 2027」 3,900원 · 대운 「앞으로의 나」 4,900원(세운 구매자 반값은 아래 majorHalfPriceKrw).
 */
export const REPORT_PRICE_TABLE_KRW = {
  saju_mbti_full: 3900,
  career_money_study: 3900,
  love_marriage_child: 3900,
  saju_mbti_compatibility: 3900,
  major_fortune: 4900,
  annual_fortune: 3900,
  /** ZW-2 자리표시 값 — 「나의 열두 서가」 가격은 측정 뒤 덕짱님이 정한다. 판매 닫힘(늘 닫힘 목록 · isPurchasable false · priceLabelKo 없음)이라 화면 · 주문에 쓰이지 않는다. */
  ziwei_full: 3900,
} as const satisfies Record<ReportProductType, number>;
export const formatKrw = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
/**
 * AM2-14 4부(덕짱님 결정 2026-11-23): 세운 「나의 2027」을 결제한 회원의 대운 반값 = 대운 정가 × 0.5(10원 내림, 토스 최소 100원) — 4,900원이면 2,450원.
 * 결제 준비(서버 금액) · 승인 직전 대조 · 화면 표시가 모두 이 값을 쓴다.
 */
export const MAJOR_HALF_RATE = 0.5;
export const discountedAmount = (price: number, rate: number) => Math.max(MIN_PAYMENT_AMOUNT_KRW, Math.floor((price * (1 - rate)) / 10) * 10);
export function majorHalfPriceKrw(): number { return discountedAmount(REPORT_PRICE_TABLE_KRW.major_fortune, MAJOR_HALF_RATE); }
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
  {
    // ZW-2 1부: 판매 닫힘 — 가격 표시 말(priceLabelKo)을 두지 않고 살 수 없다(결제 준비는 ops/config productOnSale이 먼저 409).
    productType: "ziwei_full",
    labelKo: "자미두수 리포트",
    descriptionKo: "태어난 순간의 명반 열두 칸과 별로 한 사람을 읽는 리포트입니다.",
    amount: REPORT_PRICE_TABLE_KRW.ziwei_full,
    currency: "KRW",
    isPurchasable: false,
  },
] as const satisfies readonly ReportProductCatalogItem[];

/**
 * AM2-14 1부: 고객이 보는 결제 이름(토스 주문 이름 · 카카오 상품 이름 · 결제 완료 「상품」 줄). 세운은 책 이름 「나의 {신년판 연도}」,
 * 그 밖(4종 · 대운)은 카탈로그 labelKo 그대로. 관리자 화면 · 매출 봇은 labelKo를 쓴다.
 */
export function customerProductLabelKo(productType: unknown): string {
  const product = getReportProduct(productType);
  if (!product) return "결리포트";
  return product.productType === "annual_fortune" ? `나의 ${annualProductYear()}` : product.productType === "ziwei_full" ? ZIWEI_BOOK_NAME : product.labelKo;
}

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
