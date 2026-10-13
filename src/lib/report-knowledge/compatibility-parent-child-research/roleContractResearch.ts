/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { RoleReview } from "./researchTypes";
export const PC_ROLE_CONTRACTS: readonly RoleReview[] = [
  {
    "id": "pcpr:role-audit:0",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "layer": "legacy_normalizer",
    "actualContract": "역할 버전은 optional, 다른 문자열은 INVALID_COMPATIBILITY_ROLE_VERSION.",
    "sourceFiles": [
      "src/lib/report-generation/reportInputAdapter.ts"
    ],
    "risk": "버전 없는 legacy 입력은 정규화되지만 V4 승인 아님.",
    "followUp": "기존 호출 경로와 실제 역할·맥락·승인 조건을 후속 연결 때 재검증. 이번에는 변경하지 않음.",
    "runtimeChanged": false
  },
  {
    "id": "pcpr:role-audit:1",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "layer": "v4_evidence",
    "actualContract": "고정 버전 필수, A=부모/B=자녀.",
    "sourceFiles": [
      "src/lib/interpretation-v4/compatibilityEvidence.ts"
    ],
    "risk": "버전 없는 입력의 V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED와 shadow GENERATION_FAILED 구분.",
    "followUp": "기존 호출 경로와 실제 역할·맥락·승인 조건을 후속 연결 때 재검증. 이번에는 변경하지 않음.",
    "runtimeChanged": false
  },
  {
    "id": "pcpr:role-audit:2",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "layer": "legacy_direction",
    "actualContract": "categoryRole.assignments A/B=null, 입력 순서로 부모 지정 안 한다는 안내.",
    "sourceFiles": [
      "src/lib/report-knowledge/compatibilityDirectionEvidence.ts"
    ],
    "risk": "V4는 direction 계산만 projection하고 role-less assignment·prose를 복사하지 않음.",
    "followUp": "기존 호출 경로와 실제 역할·맥락·승인 조건을 후속 연결 때 재검증. 이번에는 변경하지 않음.",
    "runtimeChanged": false
  },
  {
    "id": "pcpr:role-audit:3",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "layer": "person_identity",
    "actualContract": "person ID는 실제 입력 정보의 attribution key, 역할/연령/MBTI 검증 아님.",
    "sourceFiles": [
      "src/lib/report-knowledge/compatibilityDirectionEvidence.ts"
    ],
    "risk": "전체 교환은 고정 슬롯 역할 선언도 바꾸므로 같은 부모·자녀로 연구 승인 금지.",
    "followUp": "기존 호출 경로와 실제 역할·맥락·승인 조건을 후속 연결 때 재검증. 이번에는 변경하지 않음.",
    "runtimeChanged": false
  },
  {
    "id": "pcpr:role-audit:4",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "layer": "existing_reader",
    "actualContract": "부모 우선 책임 문구는 있으나 실제 발달 단계 분기 없음.",
    "sourceFiles": [
      "src/lib/interpretation-v4/compatibilityReleaseRenderer.ts"
    ],
    "risk": "안전 최종 결정 같은 일반 문구를 모든 성인 자녀에게 자동 전용할 위험.",
    "followUp": "기존 호출 경로와 실제 역할·맥락·승인 조건을 후속 연결 때 재검증. 이번에는 변경하지 않음.",
    "runtimeChanged": false
  }
];
