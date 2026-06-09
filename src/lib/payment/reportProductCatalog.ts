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
  readonly isPurchasable: boolean;
};

const reportProductCatalog = [
  {
    productType: "saju_mbti_full",
    labelKo: "사주×MBTI 전체 리포트",
    descriptionKo: "사주 구조와 MBTI 입력을 함께 보는 전체 리포트입니다.",
    amount: 1290,
    currency: "KRW",
    isPurchasable: true,
  },
  {
    productType: "saju_basic",
    labelKo: "사주 기본",
    descriptionKo: "기본 사주 리포트 예정 상품입니다.",
    amount: 0,
    currency: "KRW",
    isPurchasable: false,
  },
  {
    productType: "saju_full",
    labelKo: "사주 정밀",
    descriptionKo: "정밀 사주 리포트 예정 상품입니다.",
    amount: 0,
    currency: "KRW",
    isPurchasable: false,
  },
  {
    productType: "daewoon",
    labelKo: "대운",
    descriptionKo: "대운 리포트 예정 상품입니다.",
    amount: 0,
    currency: "KRW",
    isPurchasable: false,
  },
  {
    productType: "saewoon",
    labelKo: "세운",
    descriptionKo: "세운 리포트 예정 상품입니다.",
    amount: 0,
    currency: "KRW",
    isPurchasable: false,
  },
  {
    productType: "compatibility",
    labelKo: "궁합",
    descriptionKo: "궁합 리포트 예정 상품입니다.",
    amount: 0,
    currency: "KRW",
    isPurchasable: false,
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
