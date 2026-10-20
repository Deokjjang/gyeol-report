import type { Rejected } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_REJECTED: readonly Rejected[] = [
  {
    "id": "afpr:rejected:annual-before-ipchun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "selectedYear 연주·천간합을 입춘 전 모든 구간에 적용",
    "reason": "effectiveAnnualPillar와 참가 stem이 다를 수 있음",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:natal-as-transit",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "원국 신살·귀인을 월운에서 새로 발생한 사실로 승격",
    "reason": "canonical calendarMonths target provenance 필요",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:synthetic-hour",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "출생시간 미상에 대표 시주 삽입",
    "reason": "확정 원국만 사용",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:fixed-two-segments",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "모든 양력월은 항상 2segment",
    "reason": "절입·교운·불확실 범위의 실제 경계 개수 보존",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:new-year-policy",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "미래 오프라인 생성 성공을 판매 허용으로 표시",
    "reason": "최근6년 정책과 별도 policyDate 실험 구별",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:conditional-as-confirmed",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "uncertain 대운 후보 관계를 동시에 확정",
    "reason": "candidate별 조건·range 보존",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:pair-as-composite",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "single pair 몇 개로 삼층·사층 성립 판정",
    "reason": "dedicated composite producer verdict 없음",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:two-actor-trine",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "두 참가자만으로 완전 삼합",
    "reason": "binary pair에서는 미지원",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:reference-stem",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "cycle-stem 기준 flowGod를 일간 기준 annualGod로 표시",
    "reason": "참조 stem의 identity 보존",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:luck-score",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "관계 수·segment 수를 운세 강도·확률로 사용",
    "reason": "편집 중요도와 예측 결과는 별도",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:history",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "미입력 과거 성공·손실·이별을 사실로 서술",
    "reason": "가상 장면·가능성·회고 질문만",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:mbti-forecast",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "MBTI로 연월 사건·교운 시각 계산",
    "reason": "personal response와 time fact 분리",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:domain-transfer",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "현재 직업·관계 또는 타상품 장면을 과거·미래 월의 사실로 전파",
    "reason": "시점별 실제 상태 또는 조건형 응용",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  },
  {
    "id": "afpr:rejected:withheld-source",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "claim": "미검증·반려·미지원 자료를 고객 승인으로 자동 승격",
    "reason": "원래 E/F/G 및 gate 상태 보존",
    "review": "rejected_or_withheld",
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:editorial"
    ],
    "approved": false
  }
];
