import type { ResearchBoundary } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_REJECTED = [
  {
    "id": "tr:rejected:clash-doom",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "충이 있으니 반드시 실패한다",
    "rule": "관계 존재와 결과는 다른 주장이다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "충이 있으니 반드시 실패한다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:harmony-money",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "합이 있으니 수익이 늘어난다",
    "rule": "결합은 소득 자료가 아니다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "합이 있으니 수익이 늘어난다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:same-double",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "같은 십성이 두 번이니 효과가 두 배다",
    "rule": "명칭 반복에 가산 모델이 없다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "같은 십성이 두 번이니 효과가 두 배다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:invent-experience",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "과거 연도에 그 일을 겪었다",
    "rule": "입력에 사건 이력이 없다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "과거 연도에 그 일을 겪었다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:midpoint",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "미상 교운 범위 중앙값을 실제 시각으로 표시",
    "rule": "불확실성을 임의 제거한다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "미상 교운 범위 중앙값을 실제 시각으로 표시",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:jan1",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운은 시작연도 1월1일부터 적용된다",
    "rule": "실제 전환 시각이 다르다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "대운은 시작연도 1월1일부터 적용된다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:whole-month",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월 focus를 월초부터 말일까지 적용",
    "rule": "절입·교운 이전 ledger가 사라진다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "월 focus를 월초부터 말일까지 적용",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:fake-third",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반합에 빠진 지지를 추가해 삼합으로 해석",
    "rule": "실제 참가자가 없다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "반합에 빠진 지지를 추가해 삼합으로 해석",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:double-wonjin",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원진 관계와 원진살을 두 위험으로 가산",
    "rule": "동일 관찰 재투영일 수 있다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "원진 관계와 원진살을 두 위험으로 가산",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:owner-swap",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원국·세운 관계를 대운·세운 관계로 표시",
    "rule": "참가자의 소유자가 바뀐다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "원국·세운 관계를 대운·세운 관계로 표시",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:flow-swap",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "flowGod를 natal annualGod로 표시",
    "rule": "십성 기준이 다르다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "flowGod를 natal annualGod로 표시",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:sick",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "오행·형·해로 질병과 사고를 예언",
    "rule": "의학·실제 사건 근거가 아니다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "오행·형·해로 질병과 사고를 예언",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:change-natal",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "새 운으로 타고난 성격이 교체된다",
    "rule": "출생 기둥은 바뀌지 않는다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "새 운으로 타고난 성격이 교체된다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  },
  {
    "id": "tr:rejected:high-luck",
    "class": "F",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "planner HIGH는 좋은 운 점수다",
    "rule": "편집 강조와 길흉은 별개다.",
    "required": "기존 계산·실제 입력과 일치하는 제한적 설명",
    "prohibited": "planner HIGH는 좋은 운 점수다",
    "nextEvidence": "고객 사용 승인 불가; 대체 설명은 별도 근거 검토"
  }
] as const satisfies readonly ResearchBoundary[];
