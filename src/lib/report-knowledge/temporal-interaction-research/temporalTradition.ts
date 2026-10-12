import type { HistoricalPrinciple } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_TRADITION = [
  {
    "id": "tr:tradition:root-before-period",
    "class": "A",
    "sourceRefs": [
      "sm-dayun"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "claim": "원국의 기반을 먼저 확인한 뒤 행운과 함께 살피는 전통 원칙.",
    "locator": "論大運 첫 문단",
    "limitation": "그 원칙이 특정 삶의 결과를 보장하지 않으며 현대 질문은 C/D로 별도 분류한다."
  },
  {
    "id": "tr:tradition:context-before-label",
    "class": "A",
    "sourceRefs": [
      "ziping-yun"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "claim": "행운의 간지를 원국 조건과 비교하며 천간·지지의 차이를 구별하는 전통 논의.",
    "locator": "二十五 論行運 본문; 현대 주석은 별도",
    "limitation": "전통 내부의 해석 차이는 남겨 두며 신규 희기·격국을 계산하지 않는다."
  },
  {
    "id": "tr:tradition:different-time-roles",
    "class": "A",
    "sourceRefs": [
      "ditian-suiyun"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "claim": "대운·세운을 다른 시간 역할로 구분하고 원국·계절과 함께 검토하는 전승 설명.",
    "locator": "歲運論 본문/해설 분리",
    "limitation": "온라인 해설 귀속은 미확정이며 현대의 실제 사람·사건을 예언하는 근거가 아니다."
  }
] as const satisfies readonly HistoricalPrinciple[];
