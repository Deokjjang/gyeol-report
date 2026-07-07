import {
  parseReportProductType,
  reportProductTypes,
} from "./reportProductTypes";
import type { ReportProductType } from "./reportProductTypes";

export type ReportProductCurrency = "KRW";

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
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
    isPurchasable: true,
  },
  {
    productType: "career_money_study",
    labelKo: "직업·커리어·돈·학업 리포트",
    descriptionKo: "직업, 커리어, 돈, 학업 흐름을 한 사람 기준으로 보는 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
    isPurchasable: true,
  },
  {
    productType: "love_marriage_child",
    labelKo: "연애·결혼·자녀 리포트",
    descriptionKo: "연애, 결혼, 부모 역할 성향을 한 사람 기준으로 보는 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
    isPurchasable: true,
  },
  {
    productType: "saju_mbti_compatibility",
    labelKo: "궁합 리포트",
    descriptionKo: "두 사람의 관계 카테고리별 궁합 흐름을 보는 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
    isPurchasable: true,
  },
  {
    productType: "major_fortune",
    labelKo: "대운 리포트",
    descriptionKo: "10년 단위의 큰 운 흐름을 보는 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
    isPurchasable: true,
  },
  {
    productType: "annual_fortune",
    labelKo: "세운 리포트",
    descriptionKo: "선택한 한 해의 세운 흐름을 보는 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    priceLabelKo: "1,290원",
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
