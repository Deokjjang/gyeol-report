import type { BindingStage } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_BINDING_DESIGN: readonly BindingStage[] = [
  {
    "id": "mfpr:binding:natal",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "natal",
    "requirement": "확정 원국 사실과 미상 자리를 읽는다",
    "fields": [
      "natal ID",
      "source ID/version",
      "position",
      "certainty"
    ],
    "rejected": "미상 시주·자료만 존재하는 구조를 추가하지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:dayun",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "dayun",
    "requirement": "기존 customerDayun의 cycle과 precision을 읽는다",
    "fields": [
      "cycle index/ganji",
      "calendar version",
      "startSolarKst/range"
    ],
    "rejected": "새 연구의 십성 설명을 계산된 cycle로 변환하지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:active",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "active",
    "requirement": "평가 instant에서 활성 주기를 확인한다",
    "fields": [
      "evaluation time",
      "activeCycleAtEvaluation",
      "boundary"
    ],
    "rejected": "calendar selected cycle로 active null을 채우지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:annual",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "annual",
    "requirement": "14개 실제 연주의 계산 사실을 읽는다",
    "fields": [
      "year",
      "ganji",
      "tenGod",
      "year evidence ID",
      "year contract"
    ],
    "rejected": "연도 이름만 바꿔 가상 annual ID를 만들지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:relations",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "relations",
    "requirement": "검출된 관계의 참가자와 성립을 확인한다",
    "fields": [
      "owner",
      "position",
      "stem/branch",
      "formation",
      "reason ID",
      "counterconditions"
    ],
    "rejected": "연구 관계 조합을 실제 검출로 승격하지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:validity",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "validity",
    "requirement": "모든 근거가 함께 유효한 시간 구간을 확인한다",
    "fields": [
      "exact/range",
      "before/uncertain/after",
      "interval intersection"
    ],
    "rejected": "기간 다른 근거를 같은 fact로 병합하지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:research",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "research",
    "requirement": "검토된 의미와 적용 가능성만 대조한다",
    "fields": [
      "research locator/status",
      "source version",
      "supported/unsupported reason"
    ],
    "rejected": "연구 ID를 실제 Evidence ID로 만들거나 미검증 자동 승인 금지",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:allocation",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "allocation",
    "requirement": "14년 전체에서 root 재사용과 새 정보를 확인한다",
    "fields": [
      "fact root ledger",
      "represented meaning",
      "year function",
      "missing reason"
    ],
    "rejected": "새 점수·가중치·선택 알고리즘은 이번에 구현하지 않음",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  },
  {
    "id": "mfpr:binding:prose",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "stage": "prose",
    "requirement": "사실·개인 반응·조건부 예시의 출처를 분리한다",
    "fields": [
      "displayed claim",
      "actual IDs",
      "source/version",
      "period",
      "counterexample"
    ],
    "rejected": "가짜 경험·성공 예언·MBTI 운세 예측 금지",
    "implemented": false,
    "missingPolicy": "withhold_unsupported_claim_keep_valid_independent_facts",
    "sourceRefs": [
      "mfpr:source:evidence",
      "mfpr:source:editorial"
    ]
  }
];
