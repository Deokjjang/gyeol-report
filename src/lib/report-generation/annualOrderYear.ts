import { annualProductYear } from "../ops/config";
import { isAnnualFortuneCommerceYearSelectable } from "../report-knowledge/annualFortuneYearRules";

/**
 * AM: 세운 주문 관문(입력 정규화·결제 정책)만 쓰는 연도 범위 = 달력 해 범위(annualFortuneYearRules, master 그대로) + 신년판 연도(annualProductYear).
 * 12월에 「나의 2027」을 살 수 있게 한다. 계산·근거(v3·v4 세운·대운) 정책 파일은 바꾸지 않는다(출력 고정값·원천 해시 보호).
 */
export function isAnnualOrderYearSelectable(targetYear: number, referenceDate = new Date()): boolean {
  return targetYear === annualProductYear() || isAnnualFortuneCommerceYearSelectable(targetYear, referenceDate);
}
