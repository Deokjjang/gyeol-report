/**
 * 엔진 결과 → 지식 DB(knowledge-v5) 항목 id 매핑의 단위. collectFeatureHits(featureHits.ts)가 만들고 브리프 빌더가 점수를 매긴다.
 * id는 반드시 지식 DB에 있는 id다(예 "shinsal:DOHWASAL", "relation:CHUNG", "climate:丁:winter"). 시간 미상이면 hour 자리는 없다.
 */
import type { FeatureFamily } from "@/data/knowledge-v5/schema";
import type { ChartPosition } from "@/lib/saju/detections/types";

export type FeatureStrength = "strong" | "medium" | "weak";

export type FeatureHit = {
  readonly id: string;
  readonly family: FeatureFamily;
  /** 요소가 놓인 자리. 원국 전체에 걸친 판단(오행·음양·조후·구조·십성 균형)은 빈 배열. */
  readonly positions: readonly ChartPosition[];
  /** 지식 DB strengthRules.rule에 적힌 강약 규칙을 적용한 결과. */
  readonly strength: FeatureStrength;
  /** 합충형해의 짝(지식 DB variants.key), 예 "子午", "寅巳申". */
  readonly variantKey?: string;
  /** 같은 요소가 놓인 자리 수(없으면 1). */
  readonly count: number;
  /** 내부 근거 한 줄. 고객 본문 노출 금지. */
  readonly basis: string;
  /** 합충형해: 실제로 맞물린 자리 묶음(짝마다 하나, P3.6 A4). 합친 positions만으로는 어느 자리끼리인지 알 수 없다. */
  readonly pairs?: readonly (readonly ChartPosition[])[];
};
