import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_TRANSITION_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:transition:exact",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "exact",
    "scope": "transition",
    "meaning": "확정 교운 시각",
    "window": "[previousStart,T) / [T,nextStart)",
    "rule": "정각 T부터 새 주기; 연초부터 새 주기로 간주 금지",
    "positive": "직전·정각·직후를 구분해 같은 연도의 서로 다른 배경을 설명",
    "risk": "시각 정밀도가 사건의 정확한 날짜를 뜻한다고 주장",
    "twist": "유효한 동일 instant를 다른 문자열로 표시해도 같은 경계",
    "requires": [
      "startSolarKst와 equal range 및 producer version"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:range",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "range",
    "scope": "transition",
    "meaning": "교운 가능한 시각 범위",
    "window": "[previousStart,earliest) / [earliest,latest) uncertain / [latest,nextStart)",
    "rule": "earliest부터 latest 직전까지 활성 cycle null; latest부터 새 주기",
    "positive": "확정 가능한 구간과 판단 유보 구간을 분리",
    "risk": "중앙값·대표시각으로 범위를 삭제",
    "twist": "범위가 넓어도 밖의 확정 사실은 버리지 않음",
    "requires": [
      "startSolarKst=null, earliestKst/latestKst 원문"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:before",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "before",
    "scope": "transition",
    "meaning": "전환 이전 확정 구간",
    "window": "evaluation < earliest or exact T",
    "rule": "달력 연도 selectedCycle이 새 주기여도 active는 이전",
    "positive": "남길 기존 과제와 이후 검토할 새 과제를 구별",
    "risk": "새 주기의 cycleRelations를 전환 이전에 소급",
    "twist": "새 질문을 준비하는 것과 새 대운 활성은 별도",
    "requires": [
      "실제 이전 cycle와 evaluation instant"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:after",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "after",
    "scope": "transition",
    "meaning": "전환 이후 확정 구간",
    "window": "evaluation >= latest or exact T",
    "rule": "해당 시점의 새 cycle만 활성; 연도 전체에 확대 금지",
    "positive": "새 조건과 원국의 연결을 이후 구간에서 확인",
    "risk": "전환이 이미 완료되면 과거 전체도 새 주기라고 서술",
    "twist": "동일 연주의 배경이 경계 뒤 달라질 수 있음",
    "requires": [
      "새 cycle 및 정확/범위 종료 시각"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:uncertain",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "uncertain",
    "scope": "transition",
    "meaning": "범위 내부 활성 미확정",
    "window": "earliest <= evaluation < latest",
    "rule": "원고 생성은 CURRENT_DAYUN_BOUNDARY_UNCERTAIN 거절 경로 보존",
    "positive": "두 가능한 주기를 확정 사실로 합치지 않아 오해 방지",
    "risk": "새 주기 단정 또는 두 주기의 관계를 합산",
    "twist": "생성 유보와 계산 실패 원인을 구분",
    "requires": [
      "null active와 불확실한 교운 범위"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:pre-first",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "pre-first",
    "scope": "transition",
    "meaning": "첫 대운 시작 이전",
    "window": "evaluation < first earliest",
    "rule": "0번 가상 대운 생성 금지; 활성 cycle null",
    "positive": "계산 가능한 원국은 남기고 대운 상품 발행 가능성은 별도 판단",
    "risk": "빈 주기를 원국·첫 대운으로 대체",
    "twist": "향후 시작 시각과 현재 적용 시각을 분리",
    "requires": [
      "첫 cycle 경계와 covered horizon 여부"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  },
  {
    "id": "mfpr:transition:unjudgeable",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "state": "unjudgeable",
    "scope": "transition",
    "meaning": "기존 계산에서 판정 불가능",
    "window": "no stable basis / invalid input / out of supported cycles",
    "rule": "기존 DAYUN_* 오류 유지; 새 연구로 보정 금지",
    "positive": "부족한 입력·안정성 원인을 설명할 수 있음",
    "risk": "성별 추정·시주 대체·첫 대운 근사 생성",
    "twist": "실패 입력에서도 확인된 원국 사실까지 변조하지 않음",
    "requires": [
      "producer error와 가능한 입력 조건"
    ],
    "missingProducerPolicy": "전환 전 상세 관계가 현재 연도 row에 없으면 미지원으로 남김; 연구로 계산하지 않음",
    "futureCalculationRequest": "기존 확정 참가자와 각 유효 구간을 갖춘 before/after별 관계 packet 및 ID가 후속 단계에서 필요",
    "sourceRefs": [
      "mfpr:source:calendar",
      "mfpr:source:composer",
      "mfpr:source:interaction"
    ],
    "verification": "repository_contract_with_conditional_application"
  }
];
