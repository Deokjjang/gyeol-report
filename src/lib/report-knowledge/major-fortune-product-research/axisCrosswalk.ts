import type { Crosswalk } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_AXIS_CROSSWALK: readonly Crosswalk[] = [
  {
    "id": "mfpr:semantic-ref:sar:axis:ACTION_TEMPO",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 0,
      "originalId": "sar:axis:ACTION_TEMPO",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "59b665e8bafc5125783e09bc785219e5b63e5cc72059f1faf97c74b80cf2ae8e"
    },
    "originalState": {
      "id": "sar:axis:ACTION_TEMPO",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "ACTION_TEMPO",
      "kind": "bipolar",
      "definition": "판단 뒤 행동을 시작하기까지의 상대적 속도",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:ACTION_TEMPO:start-latency",
        "sar:facet:ACTION_TEMPO:review-window",
        "sar:facet:ACTION_TEMPO:paced-handoff"
      ],
      "relatedAxes": [
        "INITIATIVE",
        "PRECISION",
        "DUTY"
      ],
      "distinguishAxis": "INITIATIVE",
      "distinction": "누가 먼저 제안하는지와 얼마나 빨리 착수하는지는 다르다",
      "behavior": "결론 뒤 첫 단계를 언제 할지 알림",
      "positive": "빠른 시험으로 피드백을 얻거나 검토 시간으로 재작업을 줄임",
      "risk": "상대의 준비를 생략하거나 검토 종료를 알리지 않음",
      "weakSignalLimit": "느림은 능력 부족이 아니며 시급한 역할 때문에 빨라질 수도 있음",
      "twist": "일찍 정한 검토 시간이 오히려 실제 착수를 앞당길 수 있음",
      "environment": "안전 검토가 필요한 일과 되돌릴 수 있는 실험을 구분",
      "coexist": {
        "axis": "PRECISION",
        "condition": "검토 항목을 정한 뒤 신속히 움직일 수 있음"
      },
      "tension": {
        "axis": "DUTY",
        "condition": "기한과 검토 요구가 충돌하면 중간 공유가 필요"
      },
      "counterexample": "위기 때의 빠름을 평소 속도로 일반화하지 않음",
      "fictionalScene": "가상으로 회의 후 오늘 할 시험과 내일 검토를 나누는 상황",
      "prohibitedClaim": "느린 사람은 실행력이 없다",
      "applicabilityRef": "sar:app:ACTION_TEMPO",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"결론이 나면 빠르게 움직이는 쪽\",\"negative\":\"충분히 보고 생각한 뒤 움직이는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:ENERGY_DIRECTION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 1,
      "originalId": "sar:axis:ENERGY_DIRECTION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "1186325ed2dd1aea9f96d9f5f4a2941dc9a50b520d4b885ea9d27ccd293f3ded"
    },
    "originalState": {
      "id": "sar:axis:ENERGY_DIRECTION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "ENERGY_DIRECTION",
      "kind": "bipolar",
      "definition": "생각과 에너지를 안에서 정리하거나 밖으로 드러내는 상대적 방향",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:ENERGY_DIRECTION:private-processing",
        "sar:facet:ENERGY_DIRECTION:dialogic-processing",
        "sar:facet:ENERGY_DIRECTION:channel-switch"
      ],
      "relatedAxes": [
        "RELATION_STYLE",
        "EXPRESSION",
        "SOCIAL_ATTUNEMENT"
      ],
      "distinguishAxis": "RELATION_STYLE",
      "distinction": "표현 방향과 사람에게 얼마나 가까이 다가가는지는 같지 않다",
      "behavior": "혼자 초안을 쓰거나 대화 중 생각을 정리",
      "positive": "사적 숙고와 공개 교환의 통로를 선택",
      "risk": "침묵을 거절로 읽거나 모든 생각을 즉시 공개",
      "weakSignalLimit": "내향 방향은 외로움·사회성 부족의 증거가 아님",
      "twist": "밖에서 활발히 말해도 중요한 결정은 혼자 검토할 수 있음",
      "environment": "공개 발표와 친한 사람과의 대화에서 다르게 나타남",
      "coexist": {
        "axis": "EXPRESSION",
        "condition": "안에서 정리한 내용을 작품으로 활발히 표현할 수 있음"
      },
      "tension": {
        "axis": "SOCIAL_ATTUNEMENT",
        "condition": "응답을 기대하는 사람과 정리 시간이 어긋날 수 있음"
      },
      "counterexample": "직업상 발표량만으로 사적 에너지 방향을 정하지 않음",
      "fictionalScene": "가상으로 발표 전 혼자 쓴 메모를 소규모 모임에서 공유",
      "prohibitedClaim": "말수가 적으면 타인에게 관심이 없다",
      "applicabilityRef": "sar:app:ENERGY_DIRECTION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"생각과 에너지를 밖으로 표현하는 쪽\",\"negative\":\"생각과 에너지를 안에서 정리하는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:STRUCTURE_STYLE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 2,
      "originalId": "sar:axis:STRUCTURE_STYLE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "e5bb903500d1f182a091ce37b493aa34dfe9e9d04ac12e75ab183d6d03355ee3"
    },
    "originalState": {
      "id": "sar:axis:STRUCTURE_STYLE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "STRUCTURE_STYLE",
      "kind": "bipolar",
      "definition": "기준·계획을 먼저 정하거나 상황에 맞춰 방식을 여는 상대적 선호",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "sar:facet:STRUCTURE_STYLE:flexible-method",
        "sar:facet:STRUCTURE_STYLE:change-log"
      ],
      "relatedAxes": [
        "STABILITY",
        "ADAPTABILITY",
        "CREATION"
      ],
      "distinguishAxis": "STABILITY",
      "distinction": "계획의 형식과 안정된 결과를 원하는 이유는 다르다",
      "behavior": "필수 절차와 바꿔도 되는 방법을 표시",
      "positive": "예측 가능한 협업과 상황 적응의 범위를 함께 확보",
      "risk": "계획을 목적처럼 지키거나 변경 영향을 남기지 않음",
      "weakSignalLimit": "유연함은 무책임이 아니며 절차를 못 세운다는 뜻도 아님",
      "twist": "유연하게 운영하려고 최소 규칙을 먼저 정할 수 있음",
      "environment": "표준 작업과 탐색 과제의 요구가 다름",
      "coexist": {
        "axis": "ADAPTABILITY",
        "condition": "핵심 기준은 유지하며 수행 방법을 바꿀 수 있음"
      },
      "tension": {
        "axis": "CREATION",
        "condition": "새 결과물 탐색에 기존 양식이 과도하게 적용될 수 있음"
      },
      "counterexample": "법적 필수 절차는 취향으로 선택할 수 없음",
      "fictionalScene": "가상으로 팀 일정의 마감은 고정하고 실험 순서는 바꿈",
      "prohibitedClaim": "계획이 적으면 성실하지 않다",
      "applicabilityRef": "sar:app:STRUCTURE_STYLE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"기준과 계획을 정해놓고 움직이는 쪽\",\"negative\":\"상황을 보며 방법을 바꾸는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:COMMUNICATION_STYLE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 3,
      "originalId": "sar:axis:COMMUNICATION_STYLE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "18f51ca079a07eca24a78d399c22a2a1e4fd67d2c4002dd301a328c174e71efb"
    },
    "originalState": {
      "id": "sar:axis:COMMUNICATION_STYLE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "COMMUNICATION_STYLE",
      "kind": "bipolar",
      "definition": "핵심을 바로 말하거나 맥락과 관계를 거쳐 전달하는 상대적 방식",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:COMMUNICATION_STYLE:direct-request",
        "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "sar:facet:COMMUNICATION_STYLE:intent-check"
      ],
      "relatedAxes": [
        "CARE",
        "BOUNDARY",
        "SOCIAL_ATTUNEMENT"
      ],
      "distinguishAxis": "CARE",
      "distinction": "직설성과 배려의 유무는 별개다",
      "behavior": "요청·사실·해석을 구분해 표현",
      "positive": "명료한 합의 또는 관계에 맞춘 전달",
      "risk": "명료함을 무례의 허가로 삼거나 완곡함에 요청을 숨김",
      "weakSignalLimit": "간접 표현은 거짓말이나 판단 능력 부족이 아님",
      "twist": "부드럽게 말해도 거절은 분명할 수 있음",
      "environment": "공개 피드백과 사적 위로에 필요한 전달 방식이 다름",
      "coexist": {
        "axis": "BOUNDARY",
        "condition": "표현은 완곡해도 거절할 항목은 명확할 수 있음"
      },
      "tension": {
        "axis": "SOCIAL_ATTUNEMENT",
        "condition": "즉시 고칠 오류와 상대가 받아들일 맥락을 함께 봄"
      },
      "counterexample": "언어 숙련·권력 차이 때문에 말하기가 달라질 수 있음",
      "fictionalScene": "가상으로 동료에게 관찰한 오류와 요청을 따로 말함",
      "prohibitedClaim": "직설적인 사람은 공감하지 못한다",
      "applicabilityRef": "sar:app:COMMUNICATION_STYLE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"핵심을 비교적 바로 말하는 쪽\",\"negative\":\"상대와 상황을 보며 부드럽게 말하는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:CHANGE_ORIENTATION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 4,
      "originalId": "sar:axis:CHANGE_ORIENTATION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "10fad6dd37a07087e31bf071d2da1de814d5621ced057945b0c6083da3ab4c0b"
    },
    "originalState": {
      "id": "sar:axis:CHANGE_ORIENTATION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "CHANGE_ORIENTATION",
      "kind": "bipolar",
      "definition": "익숙한 방식을 유지하거나 새로운 경험을 찾는 상대적 방향",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:CHANGE_ORIENTATION:preserve-value",
        "sar:facet:CHANGE_ORIENTATION:novelty-trial",
        "sar:facet:CHANGE_ORIENTATION:chosen-change"
      ],
      "relatedAxes": [
        "ADAPTABILITY",
        "PERSISTENCE",
        "DUTY"
      ],
      "distinguishAxis": "ADAPTABILITY",
      "distinction": "변화를 원함과 주어진 변화에 적응함은 다르다",
      "behavior": "유지할 가치와 바꾸려는 이유를 밝힘",
      "positive": "축적을 보호하거나 새로운 선택지를 확보",
      "risk": "전례만으로 대안을 막거나 새로움만으로 교체",
      "weakSignalLimit": "익숙함 선호는 발전 가능성의 부재가 아님",
      "twist": "안정된 기반을 지키면 작은 변화를 더 쉽게 시험할 수 있음",
      "environment": "강제 변화와 스스로 선택한 변화는 구분",
      "coexist": {
        "axis": "PERSISTENCE",
        "condition": "목표는 오래 유지하며 도구는 새로 바꿀 수 있음"
      },
      "tension": {
        "axis": "DUTY",
        "condition": "변경의 이득과 기존 약속의 비용이 충돌할 수 있음"
      },
      "counterexample": "이사·이직 같은 실제 사건을 이 축에서 예측하지 않음",
      "fictionalScene": "가상으로 쓰던 도구를 남겨두고 새 도구 하나만 시험",
      "prohibitedClaim": "변화 선호가 높으면 반드시 이직한다",
      "applicabilityRef": "sar:app:CHANGE_ORIENTATION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"새로운 변화와 경험을 찾는 쪽\",\"negative\":\"익숙하고 안정적인 방식을 지키는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:DECISION_STYLE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 5,
      "originalId": "sar:axis:DECISION_STYLE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3321fff1f2570123b9b11e400fb312b71f319de41cc73eeb2aa0ab1cc58b790f"
    },
    "originalState": {
      "id": "sar:axis:DECISION_STYLE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "DECISION_STYLE",
      "kind": "bipolar",
      "definition": "가능성을 더 열어두거나 현재의 답을 닫으려는 상대적 방식",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:DECISION_STYLE:closure-criteria",
        "sar:facet:DECISION_STYLE:option-hold",
        "sar:facet:DECISION_STYLE:reopen-trigger"
      ],
      "relatedAxes": [
        "ACTION_TEMPO",
        "STRATEGY",
        "OPPORTUNITY_SENSE"
      ],
      "distinguishAxis": "ACTION_TEMPO",
      "distinction": "결론을 정하는 것과 실행 착수는 별도 단계다",
      "behavior": "결정에 필요한 정보와 재검토 조건을 알림",
      "positive": "결론으로 공동 자원을 움직이거나 성급한 확정을 피함",
      "risk": "닫은 답을 새 정보에도 고수하거나 유보 비용을 공유하지 않음",
      "weakSignalLimit": "유보는 결단 능력이 없다는 뜻이 아님",
      "twist": "재논의 조건을 적으면 결정을 더 안전하게 닫을 수 있음",
      "environment": "답을 바꿀 수 있는 선택과 장기 약속은 다름",
      "coexist": {
        "axis": "STRATEGY",
        "condition": "여러 경로를 검토한 뒤 단계별로 결정할 수 있음"
      },
      "tension": {
        "axis": "OPPORTUNITY_SENSE",
        "condition": "기회 검토와 선택 마감이 어긋날 수 있음"
      },
      "counterexample": "정보가 부족한 상황의 유보를 고정 성격으로 보지 않음",
      "fictionalScene": "가상으로 계약 초안의 확인 항목과 답변 기한을 정함",
      "prohibitedClaim": "결론이 빠르면 판단이 정확하다",
      "applicabilityRef": "sar:app:DECISION_STYLE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"답을 정하고 결론을 내리려는 쪽\",\"negative\":\"가능성을 조금 더 열어두는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:RELATION_STYLE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 6,
      "originalId": "sar:axis:RELATION_STYLE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "3161a44ce66a85049c4822a320005c9cb250173fdc5975753cf9314bfcb6507a"
    },
    "originalState": {
      "id": "sar:axis:RELATION_STYLE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "RELATION_STYLE",
      "kind": "bipolar",
      "definition": "자기 영역을 지키거나 함께 연결되려는 상대적 방식",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:RELATION_STYLE:contact-range",
        "sar:facet:RELATION_STYLE:shared-participation",
        "sar:facet:RELATION_STYLE:private-space"
      ],
      "relatedAxes": [
        "AUTONOMY",
        "CARE",
        "SOCIAL_ATTUNEMENT"
      ],
      "distinguishAxis": "AUTONOMY",
      "distinction": "연결의 거리와 결정 권한의 소유는 다르다",
      "behavior": "연락·만남·공동 활동의 범위를 합의",
      "positive": "집중할 공간 또는 상호 도움의 통로를 확보",
      "risk": "거리를 상대 동의 없이 정하거나 참여를 강요",
      "weakSignalLimit": "자기 영역 선호는 사랑·관심의 부족을 뜻하지 않음",
      "twist": "가까운 관계에서도 혼자 있는 시간이 신뢰를 지킬 수 있음",
      "environment": "가족·직장·친구의 접촉 의무와 선택권이 다름",
      "coexist": {
        "axis": "CARE",
        "condition": "거리를 유지하면서 필요한 도움을 줄 수 있음"
      },
      "tension": {
        "axis": "SOCIAL_ATTUNEMENT",
        "condition": "상대의 접촉 기대를 이해해도 모두 수용할 필요는 없음"
      },
      "counterexample": "연락 빈도는 실제 생활 제약의 영향을 받음",
      "fictionalScene": "가상으로 친구와 답장 가능한 시간대를 미리 나눔",
      "prohibitedClaim": "혼자 있기를 원하면 관계를 원하지 않는다",
      "applicabilityRef": "sar:app:RELATION_STYLE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"사람과 연결되고 함께 움직이는 쪽\",\"negative\":\"자기 공간과 독립성을 지키는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:RISK_STYLE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 7,
      "originalId": "sar:axis:RISK_STYLE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7a92d9f4e0d7612c9ef54e88ca647b4fe86045c69dc38585c241e08c74fea747"
    },
    "originalState": {
      "id": "sar:axis:RISK_STYLE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "RISK_STYLE",
      "kind": "bipolar",
      "definition": "손실과 안전을 먼저 확인하거나 불확실성을 감수하는 상대적 방식",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:RISK_STYLE:loss-limit",
        "sar:facet:RISK_STYLE:reversible-probe",
        "sar:facet:RISK_STYLE:hazard-check"
      ],
      "relatedAxes": [
        "OPPORTUNITY_SENSE",
        "RESOURCE_SENSE",
        "GOAL_DRIVE"
      ],
      "distinguishAxis": "OPPORTUNITY_SENSE",
      "distinction": "기회를 발견하는 것과 손실을 감당할 의사는 다르다",
      "behavior": "실험의 중단 기준과 감당 가능한 비용을 표시",
      "positive": "안전 장치로 지속하거나 제한된 시험으로 가능성을 확인",
      "risk": "경고만 반복해 선택을 막거나 타인 비용까지 감수",
      "weakSignalLimit": "안전 방향은 소심함·능력 부족이 아님",
      "twist": "손실 한도를 정하면 조심스러운 사람도 실험할 수 있음",
      "environment": "되돌릴 수 있는 선택과 건강·법적 위험은 구분",
      "coexist": {
        "axis": "RESOURCE_SENSE",
        "condition": "감수할 비용을 계산하며 새 시도를 할 수 있음"
      },
      "tension": {
        "axis": "GOAL_DRIVE",
        "condition": "목표 몰입이 위험 중단 기준을 가릴 수 있음"
      },
      "counterexample": "실제 위험 감내와 자원은 별도 입력으로 확인",
      "fictionalScene": "가상으로 소규모 유료 도구 시험의 지출 한도를 정함",
      "prohibitedClaim": "위험 감수가 높으면 투자 수익이 높다",
      "applicabilityRef": "sar:app:RISK_STYLE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "{\"positive\":\"기회를 보면 어느 정도 위험도 감수하는 쪽\",\"negative\":\"손해와 위험을 먼저 확인하는 쪽\"}",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:INITIATIVE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 8,
      "originalId": "sar:axis:INITIATIVE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "d72ccb2137991b9c428e285dcbc4719c7bc1520966c68739bcfacbce5416833f"
    },
    "originalState": {
      "id": "sar:axis:INITIATIVE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "INITIATIVE",
      "kind": "strength",
      "definition": "외부 지시 전에 시작점을 만드는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:INITIATIVE:opening-proposal",
        "sar:facet:INITIATIVE:help-initiation",
        "sar:facet:INITIATIVE:small-first-step"
      ],
      "relatedAxes": [
        "LEADERSHIP",
        "GOAL_DRIVE",
        "BOUNDARY"
      ],
      "distinguishAxis": "LEADERSHIP",
      "distinction": "먼저 시작해도 타인을 지휘할 권한은 없다",
      "behavior": "작은 제안과 첫 단계를 자발적으로 제시",
      "positive": "정체된 일을 시작하고 도움 요청을 구체화",
      "risk": "상대의 동의 없이 공동 일을 시작",
      "weakSignalLimit": "신호가 작으면 주어진 역할을 잘 수행하는지 별도 확인",
      "twist": "도움을 먼저 요청하는 것도 시작점을 만드는 행동",
      "environment": "재량이 허용된 일에서만 자발적 시작을 평가",
      "coexist": {
        "axis": "GOAL_DRIVE",
        "condition": "시작 제안을 합의된 목표에 연결할 수 있음"
      },
      "tension": {
        "axis": "BOUNDARY",
        "condition": "타인의 담당 영역에 선제 개입할 수 있음"
      },
      "counterexample": "권한이 없어 기다린 행동을 소극성으로 보지 않음",
      "fictionalScene": "가상으로 팀에 작은 시험안을 먼저 내되 참여를 묻는 상황",
      "prohibitedClaim": "먼저 나서지 않으면 책임감이 없다",
      "applicabilityRef": "sar:app:INITIATIVE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "남이 시작해주길 기다리기보다 먼저 움직이는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:GOAL_DRIVE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 9,
      "originalId": "sar:axis:GOAL_DRIVE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "59d6dc468f877067a9179b6b390904189b25127dc8c79fc94be500f491383cef"
    },
    "originalState": {
      "id": "sar:axis:GOAL_DRIVE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "GOAL_DRIVE",
      "kind": "strength",
      "definition": "목표를 향해 자원과 행동을 모으려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:GOAL_DRIVE:priority-focus",
        "sar:facet:GOAL_DRIVE:progress-feedback",
        "sar:facet:GOAL_DRIVE:goal-release"
      ],
      "relatedAxes": [
        "PERSISTENCE",
        "STRATEGY",
        "RECOVERY_NEED"
      ],
      "distinguishAxis": "PERSISTENCE",
      "distinction": "목적 달성의 추동과 같은 행동을 오래 반복하는 것은 다르다",
      "behavior": "중간 결과를 목표와 비교해 우선순위를 조정",
      "positive": "중요한 일에 집중하고 진행을 구체화",
      "risk": "목표 밖 필요나 중단 신호를 무시",
      "weakSignalLimit": "신호 부족은 삶의 목표나 의지가 없다는 뜻이 아님",
      "twist": "목표를 지키려면 덜 중요한 일을 포기해야 할 수 있음",
      "environment": "자기 목표와 조직이 부과한 목표를 구분",
      "coexist": {
        "axis": "STRATEGY",
        "condition": "경로를 바꾸어도 목적은 유지할 수 있음"
      },
      "tension": {
        "axis": "RECOVERY_NEED",
        "condition": "쉬어야 할 때까지 목표 압박이 이어질 수 있음"
      },
      "counterexample": "성과 결과를 의지의 크기로만 설명하지 않음",
      "fictionalScene": "가상으로 마감 전 필수 작업과 미룰 작업을 나눔",
      "prohibitedClaim": "목표 의지가 강하면 성공이 보장된다",
      "applicabilityRef": "sar:app:GOAL_DRIVE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "목표가 생기면 끝까지 가고 싶어 하는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:EXPANSION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 10,
      "originalId": "sar:axis:EXPANSION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "f6a329fecdb31a0cf45a39bfb16d089ca430ed84d186a09fa3231a7eeeb5b10f"
    },
    "originalState": {
      "id": "sar:axis:EXPANSION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "EXPANSION",
      "kind": "strength",
      "definition": "범위·규모·연결을 넓히려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:EXPANSION:scope-extension",
        "sar:facet:EXPANSION:network-reach",
        "sar:facet:EXPANSION:capacity-check"
      ],
      "relatedAxes": [
        "CHANGE_ORIENTATION",
        "DEPTH",
        "RESOURCE_SENSE"
      ],
      "distinguishAxis": "CHANGE_ORIENTATION",
      "distinction": "새로움이 항상 규모 확대는 아니며 작게 바꾸기도 한다",
      "behavior": "한 과제를 다른 대상이나 영역으로 확장할 조건을 묻기",
      "positive": "새로운 활용처와 협력 범위를 찾음",
      "risk": "확장 속도가 관리 자원보다 앞섬",
      "weakSignalLimit": "신호가 약해도 현재 범위를 깊게 운영할 수 있음",
      "twist": "범위를 줄이는 선택이 다음 확장의 기반일 수 있음",
      "environment": "유지 비용과 인수인계 여력이 확인될 때 검토",
      "coexist": {
        "axis": "DEPTH",
        "condition": "핵심 분야는 깊게 파며 적용 범위를 넓힐 수 있음"
      },
      "tension": {
        "axis": "RESOURCE_SENSE",
        "condition": "관심 영역의 증가가 자원 분산을 만들 수 있음"
      },
      "counterexample": "사업 규모나 재산 증가를 예측하지 않음",
      "fictionalScene": "가상으로 한 서비스의 다른 사용처를 검토하며 운영비를 계산",
      "prohibitedClaim": "확장 신호가 있으면 사업이 커진다",
      "applicabilityRef": "sar:app:EXPANSION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "지금보다 더 키우고 넓히고 싶어 하는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:PERSISTENCE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 11,
      "originalId": "sar:axis:PERSISTENCE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "85ecb6f16339b65f419fa08e251abefd9400cf2037f09ca9db204f546b076166"
    },
    "originalState": {
      "id": "sar:axis:PERSISTENCE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "PERSISTENCE",
      "kind": "strength",
      "definition": "선택한 과제나 관계를 일정 기간 유지하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:PERSISTENCE:repeat-practice",
        "sar:facet:PERSISTENCE:maintenance-effort",
        "sar:facet:PERSISTENCE:stop-rule"
      ],
      "relatedAxes": [
        "STABILITY",
        "LEARNING",
        "ADAPTABILITY"
      ],
      "distinguishAxis": "STABILITY",
      "distinction": "유지하는 노력과 안정 상태를 원하는 선호는 다르다",
      "behavior": "진행이 느려도 반복 기준을 정해 이어감",
      "positive": "축적이 필요한 과제에서 중단 없는 개선",
      "risk": "효과가 없는 경로를 투입 비용 때문에 계속함",
      "weakSignalLimit": "신호 부족을 끈기 부족으로 바꾸지 않음",
      "twist": "그만둘 조건을 정하면 필요한 일은 더 오래 지속 가능",
      "environment": "지연 보상이 있지만 피드백을 확인할 수 있는 상황",
      "coexist": {
        "axis": "LEARNING",
        "condition": "반복 연습에 피드백을 반영할 수 있음"
      },
      "tension": {
        "axis": "ADAPTABILITY",
        "condition": "지속할 목적과 바꿀 방법을 혼동할 수 있음"
      },
      "counterexample": "중단에는 자원·건강·권한 등 정당한 이유가 있음",
      "fictionalScene": "가상으로 연습 기록을 남기며 한 달 뒤 방법을 재검토",
      "prohibitedClaim": "오래 버티면 어떤 일도 해결된다",
      "applicabilityRef": "sar:app:PERSISTENCE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "한번 시작한 것을 오래 붙드는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:ADAPTABILITY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 12,
      "originalId": "sar:axis:ADAPTABILITY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bfde08e4b11cf4025ec294e381ce8a82887fea078403eb965627d218b28a7fbd"
    },
    "originalState": {
      "id": "sar:axis:ADAPTABILITY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "ADAPTABILITY",
      "kind": "strength",
      "definition": "새 제약이나 피드백에 맞춰 방법을 조정하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:ADAPTABILITY:method-revision",
        "sar:facet:ADAPTABILITY:feedback-uptake",
        "sar:facet:ADAPTABILITY:constraint-response"
      ],
      "relatedAxes": [
        "CHANGE_ORIENTATION",
        "STRUCTURE_STYLE",
        "DUTY"
      ],
      "distinguishAxis": "CHANGE_ORIENTATION",
      "distinction": "변화를 즐기지 않아도 요구된 상황에 잘 조정할 수 있다",
      "behavior": "막힌 원인을 확인하고 다른 수행 방식을 시험",
      "positive": "목적을 유지하며 새로운 조건을 수용",
      "risk": "상대에게 알리지 않고 기준까지 계속 바꿈",
      "weakSignalLimit": "근거가 적으면 적응 실패라고 말할 수 없음",
      "twist": "일관된 기준이 있어야 방법의 변경을 평가할 수 있음",
      "environment": "외부 조건이 바뀌고 변경 재량이 있는 상황",
      "coexist": {
        "axis": "STRUCTURE_STYLE",
        "condition": "고정 절차 안에서도 대체 방법을 찾을 수 있음"
      },
      "tension": {
        "axis": "DUTY",
        "condition": "새 방식이 기존 책임의 누락을 만들 수 있음"
      },
      "counterexample": "강요에 순응하는 것을 건강한 적응으로 부르지 않음",
      "fictionalScene": "가상으로 담당자 부재에 인수인계 방식을 바꿔 공지",
      "prohibitedClaim": "잘 적응하면 모든 요구를 받아들여야 한다",
      "applicabilityRef": "sar:app:ADAPTABILITY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "막히면 다른 방법을 찾아 바꾸는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:DEPTH",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 13,
      "originalId": "sar:axis:DEPTH",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "7df6537404e725cb011a871010cc5450220dcbeffb369fb9184e9238ceb284e8"
    },
    "originalState": {
      "id": "sar:axis:DEPTH",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "DEPTH",
      "kind": "strength",
      "definition": "한 문제의 맥락과 원인을 층위 있게 탐색하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:DEPTH:cause-tracing",
        "sar:facet:DEPTH:context-layer",
        "sar:facet:DEPTH:compact-explanation"
      ],
      "relatedAxes": [
        "CURIOSITY",
        "PRECISION",
        "DECISION_STYLE"
      ],
      "distinguishAxis": "CURIOSITY",
      "distinction": "질문을 넓히는 것과 한 질문을 깊게 검토하는 것은 다르다",
      "behavior": "표면 결과 뒤의 과정과 예외를 추적",
      "positive": "복잡한 문제를 성급히 축약하지 않음",
      "risk": "설명이 계속 깊어지며 전달·결정 시점을 놓침",
      "weakSignalLimit": "신호가 적다고 사고가 얕거나 지능이 낮은 것은 아님",
      "twist": "짧은 답을 만들기 위해 먼저 깊게 검토할 수 있음",
      "environment": "추가 탐색이 실제 판단을 바꾸는 상황",
      "coexist": {
        "axis": "PRECISION",
        "condition": "원인의 범위와 자료 오류를 함께 점검"
      },
      "tension": {
        "axis": "DECISION_STYLE",
        "condition": "더 볼 맥락과 닫아야 할 선택의 비용이 다름"
      },
      "counterexample": "깊은 생각과 반추·고통은 자동 동치가 아님",
      "fictionalScene": "가상으로 반복 오류의 표면 수정과 원인 조사를 나눔",
      "prohibitedClaim": "깊이 축이 높으면 지능이 높다",
      "applicabilityRef": "sar:app:DEPTH",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "겉만 보고 넘기지 않고 깊게 생각하는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:CURIOSITY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 14,
      "originalId": "sar:axis:CURIOSITY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "9257d98f2f78274aa16a170688d9108e2b1eab6bdb84c60f70a84dbf671022bc"
    },
    "originalState": {
      "id": "sar:axis:CURIOSITY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "CURIOSITY",
      "kind": "strength",
      "definition": "모르는 점을 질문하고 새 정보를 탐색하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:CURIOSITY:question-making",
        "sar:facet:CURIOSITY:alternative-search",
        "sar:facet:CURIOSITY:question-parking"
      ],
      "relatedAxes": [
        "LEARNING",
        "PATTERN_SENSE",
        "GOAL_DRIVE"
      ],
      "distinguishAxis": "LEARNING",
      "distinction": "알아보는 흥미와 내용을 익혀 활용하는 것은 다르다",
      "behavior": "질문을 세우고 필요한 정보를 찾음",
      "positive": "익숙한 설명의 빈칸을 발견",
      "risk": "새 질문을 따라가며 원래 과제를 잊음",
      "weakSignalLimit": "신호가 작아도 필요한 학습을 성실히 할 수 있음",
      "twist": "질문을 적어두고 나중에 보는 것도 탐색을 지키는 방식",
      "environment": "탐색 시간과 접근 가능한 정보가 있을 때",
      "coexist": {
        "axis": "PATTERN_SENSE",
        "condition": "질문이 서로 떨어진 자료의 연결을 시험하게 함"
      },
      "tension": {
        "axis": "GOAL_DRIVE",
        "condition": "흥미가 목표와 무관한 가지로 흐를 수 있음"
      },
      "counterexample": "질문의 수로 학업 능력이나 성적을 예측하지 않음",
      "fictionalScene": "가상으로 업무 중 생긴 질문을 별도 조사 목록에 넣음",
      "prohibitedClaim": "호기심이 있으면 공부를 잘한다",
      "applicabilityRef": "sar:app:CURIOSITY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "왜 그런지 궁금해하고 계속 알아보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:PATTERN_SENSE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 15,
      "originalId": "sar:axis:PATTERN_SENSE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a060cdf7a950077d4e70c46b91fb21cbe59c72a537f3c4f48533c0568ed115bf"
    },
    "originalState": {
      "id": "sar:axis:PATTERN_SENSE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "PATTERN_SENSE",
      "kind": "strength",
      "definition": "떨어진 정보의 반복·연결을 찾아 비교하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:PATTERN_SENSE:recurrence",
        "sar:facet:PATTERN_SENSE:cross-link",
        "sar:facet:PATTERN_SENSE:counterpattern"
      ],
      "relatedAxes": [
        "PRECISION",
        "DEPTH",
        "RISK_STYLE"
      ],
      "distinguishAxis": "PRECISION",
      "distinction": "연결 가설과 각각 자료의 정확성은 다른 검증이다",
      "behavior": "반복 조건과 예외를 나란히 표시",
      "positive": "개별 사건에서 놓친 공통 구조를 탐색",
      "risk": "우연한 반복에 인과·예측 의미를 붙임",
      "weakSignalLimit": "신호 부족은 패턴을 이해할 능력이 없다는 뜻이 아님",
      "twist": "패턴을 잘 쓰려면 맞지 않는 사례도 적극 찾아야 함",
      "environment": "여러 비교 가능한 관찰과 반증 자료가 필요",
      "coexist": {
        "axis": "DEPTH",
        "condition": "연결의 이유를 맥락까지 검토할 수 있음"
      },
      "tension": {
        "axis": "RISK_STYLE",
        "condition": "발견한 규칙을 곧바로 미래 선택에 적용할 수 있음"
      },
      "counterexample": "통계·인과·미래 예측을 이 축만으로 승인하지 않음",
      "fictionalScene": "가상으로 고객 요청의 반복과 예외를 함께 기록",
      "prohibitedClaim": "반복을 보면 미래를 맞힐 수 있다",
      "applicabilityRef": "sar:app:PATTERN_SENSE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "서로 떨어진 정보에서 연결과 반복을 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:PRECISION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 16,
      "originalId": "sar:axis:PRECISION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "bd15c18ba18408d2c0ab4c328a0e80e801b3f0c1dc2b48bcfafa57e08cb13370"
    },
    "originalState": {
      "id": "sar:axis:PRECISION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "PRECISION",
      "kind": "strength",
      "definition": "기준에 비추어 오류·누락·불일치를 구별하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:PRECISION:error-detection",
        "sar:facet:PRECISION:standard-consistency",
        "sar:facet:PRECISION:completion-quality",
        "sar:facet:PRECISION:argument-coherence"
      ],
      "relatedAxes": [
        "BOUNDARY",
        "CARE",
        "ACTION_TEMPO"
      ],
      "distinguishAxis": "BOUNDARY",
      "distinction": "결과의 정확성과 개인이 허용할 선은 다르다",
      "behavior": "오류 항목과 영향 범위를 구분해 수정",
      "positive": "재작업을 줄이고 설명의 검증 가능성을 높임",
      "risk": "사소한 차이까지 같은 심각도로 지적",
      "weakSignalLimit": "신호가 약해도 정확한 수행 능력은 별도 확인",
      "twist": "고칠 필요 없는 차이를 구분하는 것도 정밀한 판단",
      "environment": "오류 비용과 허용 오차가 명시된 환경",
      "coexist": {
        "axis": "CARE",
        "condition": "오류 지적과 상대의 존엄을 함께 지킬 수 있음"
      },
      "tension": {
        "axis": "ACTION_TEMPO",
        "condition": "추가 점검의 이익과 착수 지연 비용이 충돌"
      },
      "counterexample": "비판의 빈도로 정확성이나 도덕성을 평가하지 않음",
      "fictionalScene": "가상으로 문서 오탈자와 결론을 바꾸는 오류를 나눔",
      "prohibitedClaim": "오류를 많이 지적하면 항상 옳다",
      "applicabilityRef": "sar:app:PRECISION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "작은 오류와 부족한 점을 먼저 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:LEARNING",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 17,
      "originalId": "sar:axis:LEARNING",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "011994850a615b451280fed5cc9933067d7a20bfd1df1f71399839492f058d14"
    },
    "originalState": {
      "id": "sar:axis:LEARNING",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "LEARNING",
      "kind": "strength",
      "definition": "정보를 익히고 자신의 활용 체계로 쌓는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:LEARNING:acquisition",
        "sar:facet:LEARNING:retrieval",
        "sar:facet:LEARNING:transfer"
      ],
      "relatedAxes": [
        "CURIOSITY",
        "CREATION",
        "EXPRESSION"
      ],
      "distinguishAxis": "CURIOSITY",
      "distinction": "새 정보를 찾는 흥미가 실제 습득을 보장하지 않는다",
      "behavior": "배운 내용을 적용하고 이해를 다시 확인",
      "positive": "반복 경험을 다음 문제의 자원으로 남김",
      "risk": "수강·자료 수집을 실력 축적으로 착각",
      "weakSignalLimit": "신호 부족으로 학습 능력·학력을 판단하지 않음",
      "twist": "이미 배운 것을 설명해 보는 과정이 추가 학습이 될 수 있음",
      "environment": "피드백과 연습 기회가 제공된 상황",
      "coexist": {
        "axis": "CREATION",
        "condition": "익힌 재료를 실제 결과물로 바꿀 수 있음"
      },
      "tension": {
        "axis": "EXPRESSION",
        "condition": "충분히 배우고 보여주려다 공유를 늦출 수 있음"
      },
      "counterexample": "시험 점수와 합격 여부는 별도 실제 자료가 필요",
      "fictionalScene": "가상으로 강의 뒤 작은 과제에 적용해 이해를 점검",
      "prohibitedClaim": "배움 신호가 강하면 시험에 합격한다",
      "applicabilityRef": "sar:app:LEARNING",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "배우고 자기 것으로 쌓으려는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:STRATEGY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 18,
      "originalId": "sar:axis:STRATEGY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "66e25961bd5cf6362c7ef6c5a775b2de17d82adad7ff8ea541d532eec2ca1c98"
    },
    "originalState": {
      "id": "sar:axis:STRATEGY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "STRATEGY",
      "kind": "strength",
      "definition": "목적·경로·제약·다음 선택을 함께 배치하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:STRATEGY:route-comparison",
        "sar:facet:STRATEGY:sequence-design",
        "sar:facet:STRATEGY:contingency"
      ],
      "relatedAxes": [
        "STRUCTURE_STYLE",
        "PRACTICALITY",
        "CARE"
      ],
      "distinguishAxis": "STRUCTURE_STYLE",
      "distinction": "계획을 선호하는 방식과 경로를 비교하는 내용은 다르다",
      "behavior": "여러 경로와 실패 시 대안을 검토",
      "positive": "자원을 중요한 순서에 배치",
      "risk": "사람과 휴식을 수단처럼 다루거나 계획만 늘림",
      "weakSignalLimit": "근거가 없으면 즉흥적·비전이 없다고 단정 불가",
      "twist": "예비 경로가 있으면 현재 선택에 더 집중 가능",
      "environment": "목적과 제한 자원이 명시된 상황",
      "coexist": {
        "axis": "PRACTICALITY",
        "condition": "실행 가능성을 확인하며 장기 경로를 세움"
      },
      "tension": {
        "axis": "CARE",
        "condition": "효율의 명분이 상대 선택을 지울 수 있음"
      },
      "counterexample": "계획이 있다는 사실은 미래 결과의 증거가 아님",
      "fictionalScene": "가상으로 프로젝트의 주 경로와 중단 시 대안을 작성",
      "prohibitedClaim": "전략적이면 타인을 조종한다",
      "applicabilityRef": "sar:app:STRATEGY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "지금뿐 아니라 다음 수까지 생각하는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:CREATION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 19,
      "originalId": "sar:axis:CREATION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "adcc60b04852167aa1c611df156e715a05ed6b46f154d02c9f4109adb9dca8f9"
    },
    "originalState": {
      "id": "sar:axis:CREATION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "CREATION",
      "kind": "strength",
      "definition": "생각을 외부에서 확인 가능한 새 결과물로 만드는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:CREATION:prototype",
        "sar:facet:CREATION:recombination",
        "sar:facet:CREATION:finish-output"
      ],
      "relatedAxes": [
        "EXPRESSION",
        "LEARNING",
        "PRECISION"
      ],
      "distinguishAxis": "EXPRESSION",
      "distinction": "새 산출의 생성과 기존 생각을 전달하는 것은 다르다",
      "behavior": "초안·시제품·작업물을 실제로 만들기",
      "positive": "머릿속 가능성을 시험 가능한 형태로 전환",
      "risk": "만드는 재미가 목적·사용자의 필요를 덮음",
      "weakSignalLimit": "신호가 작아도 창작 능력이나 예술성이 없다는 뜻은 아님",
      "twist": "제약이 분명할 때 결과물이 더 독창적일 수 있음",
      "environment": "만들 재량·도구·검토 대상이 있을 때",
      "coexist": {
        "axis": "LEARNING",
        "condition": "배운 내용을 결과물로 시험하고 피드백을 얻음"
      },
      "tension": {
        "axis": "PRECISION",
        "condition": "초기 초안에 완성본 수준 검증을 요구할 수 있음"
      },
      "counterexample": "예술 직업·재능·저작 성과를 자동 판정하지 않음",
      "fictionalScene": "가상으로 아이디어를 한 장짜리 시제품으로 만들어 확인",
      "prohibitedClaim": "창작 신호가 있으면 예술가가 적성이다",
      "applicabilityRef": "sar:app:CREATION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "생각을 실제 결과물로 만들고 싶어 하는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:EXPRESSION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 20,
      "originalId": "sar:axis:EXPRESSION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "5474976197220f4b46aa67a2d3d045453e79920304258d1f9b5d015bb1176a24"
    },
    "originalState": {
      "id": "sar:axis:EXPRESSION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "EXPRESSION",
      "kind": "strength",
      "definition": "생각·감정·의도를 타인이 접할 형태로 드러내는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:EXPRESSION:channel-choice",
        "sar:facet:EXPRESSION:visibility-control",
        "sar:facet:EXPRESSION:receipt-check"
      ],
      "relatedAxes": [
        "ENERGY_DIRECTION",
        "BOUNDARY",
        "CARE"
      ],
      "distinguishAxis": "ENERGY_DIRECTION",
      "distinction": "내부에서 정리하는 사람도 적극적으로 표현할 수 있다",
      "behavior": "말·글·행동 중 전달 통로를 선택",
      "positive": "뜻을 확인 가능하게 하여 오해를 줄임",
      "risk": "표현량이 상대의 수용 공간을 넘거나 노출을 강요",
      "weakSignalLimit": "신호가 작으면 다른 표현 통로를 확인해야 함",
      "twist": "적은 말과 구체적인 행동이 더 선명한 표현일 수 있음",
      "environment": "매체·상대·공개 동의에 따라 유효한 통로가 다름",
      "coexist": {
        "axis": "BOUNDARY",
        "condition": "공개할 내용과 사적으로 남길 내용을 구분"
      },
      "tension": {
        "axis": "CARE",
        "condition": "도움의 뜻이 드러나지 않으면 상대가 알아차리지 못함"
      },
      "counterexample": "표현 신호를 언어·창작 능력의 측정치로 보지 않음",
      "fictionalScene": "가상으로 말하기 어려운 요청을 짧은 글로 전달",
      "prohibitedClaim": "표현 신호가 작으면 애정이 없다",
      "applicabilityRef": "sar:app:EXPRESSION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "생각과 감정을 밖으로 보여주려는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:SOCIAL_ATTUNEMENT",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 21,
      "originalId": "sar:axis:SOCIAL_ATTUNEMENT",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "087845e52aaea3571031b94f816dc80f36c943af7ce8f1713c196ad53a35de0d"
    },
    "originalState": {
      "id": "sar:axis:SOCIAL_ATTUNEMENT",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "SOCIAL_ATTUNEMENT",
      "kind": "strength",
      "definition": "타인의 반응과 사회적 맥락을 살피는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check"
      ],
      "relatedAxes": [
        "CARE",
        "BOUNDARY",
        "AUTONOMY"
      ],
      "distinguishAxis": "CARE",
      "distinction": "반응을 알아차림과 도움을 제공할 의사는 별개다",
      "behavior": "관찰한 신호를 질문으로 확인",
      "positive": "전달 방식과 참여 조건을 상황에 맞춤",
      "risk": "타인의 마음을 추측하고 자기 요구를 계속 지움",
      "weakSignalLimit": "신호가 약하면 공감 결여라고 말할 수 없음",
      "twist": "상대 반응을 잘 살필수록 추측을 확인하는 질문이 중요",
      "environment": "표정·말의 정보가 제한된 온라인에서는 추가 확인",
      "coexist": {
        "axis": "BOUNDARY",
        "condition": "상대의 반응을 이해해도 자신의 한계를 말할 수 있음"
      },
      "tension": {
        "axis": "AUTONOMY",
        "condition": "평가를 지나치게 따라 선택 기준을 잃을 수 있음"
      },
      "counterexample": "표정 하나에서 감정·동의를 확정하지 않음",
      "fictionalScene": "가상으로 회의에서 침묵한 사람에게 의견을 선택적으로 묻기",
      "prohibitedClaim": "상대 마음을 정확히 읽는다",
      "applicabilityRef": "sar:app:SOCIAL_ATTUNEMENT",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "사람의 표정과 반응을 빨리 알아차리는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:CARE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 22,
      "originalId": "sar:axis:CARE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "73db055b1ebf489b9a89b5316f103c58a1eefd373f0c602c26e95c1868a0de10"
    },
    "originalState": {
      "id": "sar:axis:CARE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "CARE",
      "kind": "strength",
      "definition": "사람의 필요를 고려하고 도움을 제안하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:CARE:need-check",
        "sar:facet:CARE:practical-support",
        "sar:facet:CARE:sustainable-care",
        "sar:facet:CARE:respectful-nonintervention"
      ],
      "relatedAxes": [
        "DUTY",
        "PRECISION",
        "RESOURCE_SENSE"
      ],
      "distinguishAxis": "DUTY",
      "distinction": "돌봄의 관심과 부과된 의무의 이행은 다르다",
      "behavior": "원하는 도움과 감당 가능한 범위를 물음",
      "positive": "실질적 필요를 덜고 관계의 안전감을 높일 가능성",
      "risk": "동의 없는 도움과 일방적 희생이 누적",
      "weakSignalLimit": "작은 신호는 배려심 부재의 증거가 아님",
      "twist": "돕지 않는 선택이 상대의 자율성을 존중할 수 있음",
      "environment": "도움 요청·거절 가능성·자원과 역할이 확인될 때",
      "coexist": {
        "axis": "PRECISION",
        "condition": "필요한 오류를 안전하게 알려줄 수 있음"
      },
      "tension": {
        "axis": "RESOURCE_SENSE",
        "condition": "남을 돕는 비용과 자신의 지속 가능성이 충돌"
      },
      "counterexample": "성별·유형에 돌봄 책임을 자동 부여하지 않음",
      "fictionalScene": "가상으로 지친 동료에게 조언과 실무 도움 중 원하는 것을 묻기",
      "prohibitedClaim": "배려 신호가 강하면 모두를 돌봐야 한다",
      "applicabilityRef": "sar:app:CARE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "사람을 챙기고 도우려는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:CHARISMA",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 23,
      "originalId": "sar:axis:CHARISMA",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "38f6fe6f10b763c55f76a0612d35d782d80ec68a5618e06a9a56b274ffac0e74"
    },
    "originalState": {
      "id": "sar:axis:CHARISMA",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "CHARISMA",
      "kind": "strength",
      "definition": "타인의 시선과 기억에 남는 존재감이라는 해석 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:CHARISMA:situated-attention",
        "sar:facet:CHARISMA:memorable-signal"
      ],
      "relatedAxes": [
        "STATUS_DRIVE",
        "EXPRESSION",
        "BOUNDARY"
      ],
      "distinguishAxis": "STATUS_DRIVE",
      "distinction": "눈에 띄는 현상과 인정받고 싶은 동기는 다르다",
      "behavior": "상대가 실제로 주목한 표현·상황을 확인",
      "positive": "전달에 관심을 모아 참여 통로를 만들 수 있음",
      "risk": "관심을 유지하려 과도한 노출이나 역할 수행",
      "weakSignalLimit": "신호 부족은 매력이나 인간적 가치가 낮다는 뜻 아님",
      "twist": "조용하고 일관된 태도도 특정 상황에서 기억에 남을 수 있음",
      "environment": "실제 관찰자·매체·문화와 장면이 필요",
      "coexist": {
        "axis": "EXPRESSION",
        "condition": "표현이 구체적일 때 관심이 전달 내용으로 이어짐"
      },
      "tension": {
        "axis": "BOUNDARY",
        "condition": "주목을 기대하는 환경이 사적 경계를 침범"
      },
      "counterexample": "타인의 호감·연애 성공을 존재감으로 예측하지 않음",
      "fictionalScene": "가상으로 발표의 특정 사례가 청중에게 기억되는 상황",
      "prohibitedClaim": "매력 신호가 있으면 누구나 좋아한다",
      "applicabilityRef": "sar:app:CHARISMA",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "사람 눈에 들어오고 기억되는 존재감",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:DUTY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 24,
      "originalId": "sar:axis:DUTY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "6578cce246a47791d4e218497a62c6a8665e4bba3d5895b57187f3493a1fb5a7"
    },
    "originalState": {
      "id": "sar:axis:DUTY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "DUTY",
      "kind": "strength",
      "definition": "맡은 역할과 합의한 약속을 이행하려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:DUTY:role-fulfilment",
        "sar:facet:DUTY:promise-update",
        "sar:facet:DUTY:scope-responsibility"
      ],
      "relatedAxes": [
        "PERSISTENCE",
        "BOUNDARY",
        "RECOVERY_NEED"
      ],
      "distinguishAxis": "PERSISTENCE",
      "distinction": "책임의 대상과 단순한 지속 행동은 다르다",
      "behavior": "담당·기한·못 할 범위를 명확히 알림",
      "positive": "협업의 예측 가능성과 신뢰를 유지",
      "risk": "동의하지 않은 일까지 자기 책임으로 떠안음",
      "weakSignalLimit": "신호가 작아도 실제 약속 이행은 확인해야 함",
      "twist": "책임의 범위를 줄여 말하는 것이 더 책임 있는 행동일 수 있음",
      "environment": "역할·권한·인수인계가 확인된 상황",
      "coexist": {
        "axis": "BOUNDARY",
        "condition": "자기 담당과 타인 담당을 구분하며 이행"
      },
      "tension": {
        "axis": "RECOVERY_NEED",
        "condition": "끝없는 의무감이 쉬는 조건을 지울 수 있음"
      },
      "counterexample": "권한 없는 일의 실패를 개인 책임으로 환원하지 않음",
      "fictionalScene": "가상으로 휴가 전 담당 업무와 대체 담당을 명시",
      "prohibitedClaim": "책임감이 강하면 모든 일을 맡아야 한다",
      "applicabilityRef": "sar:app:DUTY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "맡은 일과 약속을 책임지려는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:LEADERSHIP",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 25,
      "originalId": "sar:axis:LEADERSHIP",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "4ca60e995c30a2af390df374efebe74a1580d5a528fe82da013c0b848bf9435d"
    },
    "originalState": {
      "id": "sar:axis:LEADERSHIP",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "LEADERSHIP",
      "kind": "strength",
      "definition": "공동 방향과 조율을 이끌려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:LEADERSHIP:direction-proposal",
        "sar:facet:LEADERSHIP:delegation",
        "sar:facet:LEADERSHIP:dissent-channel"
      ],
      "relatedAxes": [
        "INITIATIVE",
        "CARE",
        "AUTONOMY"
      ],
      "distinguishAxis": "INITIATIVE",
      "distinction": "혼자 먼저 시작함과 공동 의사결정을 이끄는 것은 다르다",
      "behavior": "목적·역할을 제안하고 이견을 들을 통로 확보",
      "positive": "분산된 행동을 공동 목표에 연결",
      "risk": "합의를 대신해 상대 결정을 일방적으로 정함",
      "weakSignalLimit": "신호 부족은 지도 능력이나 가치의 부족이 아님",
      "twist": "스스로 물러나 다른 사람의 판단 공간을 여는 것도 조율",
      "environment": "실제 권한과 참여자의 동의가 필요한 환경",
      "coexist": {
        "axis": "CARE",
        "condition": "부담을 확인하며 방향을 조율할 수 있음"
      },
      "tension": {
        "axis": "AUTONOMY",
        "condition": "공동 방향과 개인 재량의 경계가 충돌"
      },
      "counterexample": "관계명·십성으로 상사나 부모 역할을 배정하지 않음",
      "fictionalScene": "가상으로 모임 계획의 결정권과 반대 의견을 먼저 확인",
      "prohibitedClaim": "리더십 신호가 있으면 지휘할 권리가 있다",
      "applicabilityRef": "sar:app:LEADERSHIP",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "방향을 정하고 사람을 이끄려는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:AUTONOMY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 26,
      "originalId": "sar:axis:AUTONOMY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "b7808bb66e258e7b63171215855aea8dda673cd0a1477578b4dfd628beade469"
    },
    "originalState": {
      "id": "sar:axis:AUTONOMY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "AUTONOMY",
      "kind": "strength",
      "definition": "중요한 선택을 자신의 기준과 권한으로 정하려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:AUTONOMY:choice-ownership",
        "sar:facet:AUTONOMY:method-discretion",
        "sar:facet:AUTONOMY:chosen-support"
      ],
      "relatedAxes": [
        "RELATION_STYLE",
        "CARE",
        "DUTY"
      ],
      "distinguishAxis": "RELATION_STYLE",
      "distinction": "사람과 가까이 지내도 선택권은 독립적으로 원할 수 있다",
      "behavior": "선택 가능한 범위와 협의할 범위를 구분",
      "positive": "자기 판단을 세우며 공동 책임에 동의",
      "risk": "공동 영향이 있는 선택까지 단독으로 정함",
      "weakSignalLimit": "약한 신호로 의존적·판단력이 없다고 말할 수 없음",
      "twist": "도움받을 방법을 직접 고르는 것도 자율성",
      "environment": "선택권과 실제 제약을 분리해 확인할 때",
      "coexist": {
        "axis": "CARE",
        "condition": "도움의 수용·거절을 자기 기준으로 선택"
      },
      "tension": {
        "axis": "DUTY",
        "condition": "개인 선택이 공동 약속과 충돌할 수 있음"
      },
      "counterexample": "권력에 막힌 선택을 성향의 문제로 보지 않음",
      "fictionalScene": "가상으로 협업 결과는 합의하되 수행 방법은 맡기는 상황",
      "prohibitedClaim": "독립적이면 타인의 도움이 필요 없다",
      "applicabilityRef": "sar:app:AUTONOMY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "중요한 것은 직접 고르고 결정하고 싶은 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:COMPETITION",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 27,
      "originalId": "sar:axis:COMPETITION",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "a8c3b98f7347a6707e012663363b2d1952ad3578aef603af8a6c02e22ef5d832"
    },
    "originalState": {
      "id": "sar:axis:COMPETITION",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "COMPETITION",
      "kind": "strength",
      "definition": "타인·기준과 비교하며 자극을 받는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:COMPETITION:reference-choice",
        "sar:facet:COMPETITION:self-comparison",
        "sar:facet:COMPETITION:cooperative-challenge"
      ],
      "relatedAxes": [
        "GOAL_DRIVE",
        "LEARNING",
        "CARE"
      ],
      "distinguishAxis": "GOAL_DRIVE",
      "distinction": "목표 자체의 추동과 비교 대상에서 오는 자극은 다르다",
      "behavior": "비교 지표가 자기 목표에 유효한지 확인",
      "positive": "구체적인 피드백으로 연습과 개선을 촉진",
      "risk": "순위가 관계 가치·자기 가치를 대체",
      "weakSignalLimit": "신호 부족으로 의욕·성취 욕구가 없다고 해석 불가",
      "twist": "협력 과제에서도 함께 이길 외부 기준을 선택 가능",
      "environment": "공정한 비교와 자발적 참여가 확인된 상황",
      "coexist": {
        "axis": "LEARNING",
        "condition": "비교 결과를 구체적 연습 과제로 바꿀 수 있음"
      },
      "tension": {
        "axis": "CARE",
        "condition": "승패 중심 피드백이 상대의 부담을 키울 수 있음"
      },
      "counterexample": "경쟁 신호를 공격성·타인 실패 희망으로 번역하지 않음",
      "fictionalScene": "가상으로 지난 자기 기록과 현재 수행을 비교",
      "prohibitedClaim": "경쟁적이면 타인을 이겨야만 만족한다",
      "applicabilityRef": "sar:app:COMPETITION",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "경쟁과 비교에서 자극을 받는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:BOUNDARY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 28,
      "originalId": "sar:axis:BOUNDARY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "724974492a8daf814487ccca48b2cdf5a00b5224bd5e9dd63ad0e9a052e79211"
    },
    "originalState": {
      "id": "sar:axis:BOUNDARY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "BOUNDARY",
      "kind": "strength",
      "definition": "허용·거절·책임의 선을 구분하고 유지하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:BOUNDARY:refusal",
        "sar:facet:BOUNDARY:role-border",
        "sar:facet:BOUNDARY:privacy",
        "sar:facet:BOUNDARY:renegotiation"
      ],
      "relatedAxes": [
        "PRECISION",
        "CARE",
        "RELATION_STYLE"
      ],
      "distinguishAxis": "PRECISION",
      "distinction": "정확한 규격 검토와 개인의 동의·경계는 다르다",
      "behavior": "가능한 요청과 거절할 요청을 구체적으로 알림",
      "positive": "역할 침범과 누적 부담을 줄임",
      "risk": "경계를 설명 없이 처벌이나 단절로 사용",
      "weakSignalLimit": "신호 부족은 거절 능력·권리가 없다는 뜻 아님",
      "twist": "명확한 선이 있어야 편하게 도울 수 있음",
      "environment": "거절의 불이익과 안전을 먼저 확인",
      "coexist": {
        "axis": "CARE",
        "condition": "도움의 범위를 정해 지속할 수 있음"
      },
      "tension": {
        "axis": "RELATION_STYLE",
        "condition": "연결 기대와 사적 영역의 합의가 다를 수 있음"
      },
      "counterexample": "폭력·강압 상황에서 단순 소통 조언으로 축소하지 않음",
      "fictionalScene": "가상으로 근무 시간 밖 연락의 예외 조건을 합의",
      "prohibitedClaim": "경계를 세우면 이기적이다",
      "applicabilityRef": "sar:app:BOUNDARY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "내 기준과 선을 분명히 지키는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:PRACTICALITY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 29,
      "originalId": "sar:axis:PRACTICALITY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "df0e1f66b74833e0adcce473444a3a0f17902764b74a17bc3c147060ad7be773"
    },
    "originalState": {
      "id": "sar:axis:PRACTICALITY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "PRACTICALITY",
      "kind": "strength",
      "definition": "아이디어가 실제 조건에서 작동하는지 확인하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:PRACTICALITY:use-test",
        "sar:facet:PRACTICALITY:feasible-step",
        "sar:facet:PRACTICALITY:outcome-check"
      ],
      "relatedAxes": [
        "RESOURCE_SENSE",
        "STRATEGY",
        "MEANING"
      ],
      "distinguishAxis": "RESOURCE_SENSE",
      "distinction": "작동 가능성과 남는 자원의 계산은 다르다",
      "behavior": "사용 환경과 실행 조건을 작게 시험",
      "positive": "실현 가능한 단계와 도구를 선택",
      "risk": "당장 쓸모가 없다는 이유로 탐색·의미를 배제",
      "weakSignalLimit": "신호 부족으로 현실 감각·직무 능력이 없다고 단정 불가",
      "twist": "이론 검토가 실제 낭비를 줄일 수 있음",
      "environment": "실행 대상과 평가 기준이 있는 상황",
      "coexist": {
        "axis": "STRATEGY",
        "condition": "장기 목적을 실현 가능한 단계로 나눔"
      },
      "tension": {
        "axis": "MEANING",
        "condition": "당장 효용과 중요하게 여기는 이유가 어긋날 수 있음"
      },
      "counterexample": "현실성으로 삶의 가치나 취향을 평가하지 않음",
      "fictionalScene": "가상으로 새 절차를 실제 사용자가 해보도록 시험",
      "prohibitedClaim": "실용적이면 돈 되는 일만 좋아한다",
      "applicabilityRef": "sar:app:PRACTICALITY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "실제로 되는지와 결과가 남는지를 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:RESOURCE_SENSE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 30,
      "originalId": "sar:axis:RESOURCE_SENSE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8b5da293b02536414fc9de6eb6167dfd3e7652499c8e873508242b901b13bccc"
    },
    "originalState": {
      "id": "sar:axis:RESOURCE_SENSE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "RESOURCE_SENSE",
      "kind": "strength",
      "definition": "돈·시간·도구 등 자원의 유입·소모·잔여를 살피는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:RESOURCE_SENSE:flow-account",
        "sar:facet:RESOURCE_SENSE:reserve",
        "sar:facet:RESOURCE_SENSE:allocation"
      ],
      "relatedAxes": [
        "OPPORTUNITY_SENSE",
        "CARE",
        "EXPANSION"
      ],
      "distinguishAxis": "OPPORTUNITY_SENSE",
      "distinction": "자원을 관리함과 새로운 기회를 발견함은 별개다",
      "behavior": "비용과 남길 여력을 함께 계산",
      "positive": "과도한 소모를 막고 지속할 기반 확보",
      "risk": "작은 손실 회피가 필요한 투자·휴식을 막음",
      "weakSignalLimit": "신호 부족을 경제관념 부재·가난으로 바꾸지 않음",
      "twist": "쓸 곳을 정하는 것이 모으는 것만큼 자원 관리",
      "environment": "실제 소득·시간·부양·계약 정보가 필요",
      "coexist": {
        "axis": "CARE",
        "condition": "도움의 자원 한도를 정해 지속 가능하게 함"
      },
      "tension": {
        "axis": "EXPANSION",
        "condition": "범위 확대가 운영 여력을 앞설 수 있음"
      },
      "counterexample": "재물운·수익·잔고는 이 축의 사실이 아님",
      "fictionalScene": "가상으로 프로젝트 예산에서 예비 비용과 휴식 시간을 남김",
      "prohibitedClaim": "자원 감각이 좋으면 부자가 된다",
      "applicabilityRef": "sar:app:RESOURCE_SENSE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "돈과 시간, 자원이 실제로 얼마나 남는지 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:OPPORTUNITY_SENSE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 31,
      "originalId": "sar:axis:OPPORTUNITY_SENSE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "8f7ec424b5ad089adfcd0b2f9fb1d42761471dec020fb8254b59f7990d7aaaa8"
    },
    "originalState": {
      "id": "sar:axis:OPPORTUNITY_SENSE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "OPPORTUNITY_SENSE",
      "kind": "strength",
      "definition": "새 상황·연결에서 가능한 선택을 알아보는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:OPPORTUNITY_SENSE:option-discovery",
        "sar:facet:OPPORTUNITY_SENSE:screening",
        "sar:facet:OPPORTUNITY_SENSE:decline-option"
      ],
      "relatedAxes": [
        "RISK_STYLE",
        "PATTERN_SENSE",
        "RESOURCE_SENSE"
      ],
      "distinguishAxis": "RISK_STYLE",
      "distinction": "발견한 선택을 실제로 감수할지는 다른 판단이다",
      "behavior": "선택의 조건과 필요한 자원을 확인",
      "positive": "놓쳤던 활용처나 협력 후보를 찾음",
      "risk": "모든 새 제안을 기회로 보고 검증을 생략",
      "weakSignalLimit": "신호 부족은 행운이나 기회가 없다는 뜻 아님",
      "twist": "지금 하지 않을 선택을 잘 구분해야 좋은 기회를 남김",
      "environment": "실제 접근 가능성과 검증 정보가 있어야 함",
      "coexist": {
        "axis": "PATTERN_SENSE",
        "condition": "반복 요구에서 새로운 활용 가설을 찾음"
      },
      "tension": {
        "axis": "RESOURCE_SENSE",
        "condition": "가능한 선택이 많아도 자원은 제한될 수 있음"
      },
      "counterexample": "미래 인맥·투자·취업의 성사를 예측하지 않음",
      "fictionalScene": "가상으로 협업 제안의 접근 조건과 비용을 확인",
      "prohibitedClaim": "기회 신호가 있으면 귀인이 나타난다",
      "applicabilityRef": "sar:app:OPPORTUNITY_SENSE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "새로운 사람과 상황에서 기회를 알아보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:STABILITY",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 32,
      "originalId": "sar:axis:STABILITY",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ae372608b40d26c0269e8538d1dc7cf3ec4fa61a8cba8cfe6483056c7fd62489"
    },
    "originalState": {
      "id": "sar:axis:STABILITY",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "STABILITY",
      "kind": "strength",
      "definition": "예측 가능하고 오래 유지되는 상태를 중시하는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:STABILITY:minimum-security",
        "sar:facet:STABILITY:continuity",
        "sar:facet:STABILITY:protective-change"
      ],
      "relatedAxes": [
        "STRUCTURE_STYLE",
        "ADAPTABILITY",
        "EXPANSION"
      ],
      "distinguishAxis": "STRUCTURE_STYLE",
      "distinction": "안정된 결과를 바라면서 방법은 유연할 수 있다",
      "behavior": "안정에 필요한 최소 조건을 명시",
      "positive": "생활·협업의 불필요한 변동을 줄임",
      "risk": "손상된 상태를 익숙하다는 이유로 계속 유지",
      "weakSignalLimit": "약한 신호는 불안정한 인격의 증거가 아님",
      "twist": "일부 변화를 받아들여야 장기 안정이 가능할 수 있음",
      "environment": "유지할 가치와 실제 안전이 구분된 상황",
      "coexist": {
        "axis": "ADAPTABILITY",
        "condition": "핵심 안정 조건을 지키기 위해 방법을 변경"
      },
      "tension": {
        "axis": "EXPANSION",
        "condition": "범위 증가가 유지 가능성을 흔들 수 있음"
      },
      "counterexample": "결혼 지속·직장 보장·건강 안전을 예언하지 않음",
      "fictionalScene": "가상으로 변경 전 반드시 유지할 생활 조건을 적음",
      "prohibitedClaim": "안정 신호가 크면 관계가 오래간다",
      "applicabilityRef": "sar:app:STABILITY",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "오래 유지되고 안정적인 상태를 중요하게 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:STATUS_DRIVE",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 33,
      "originalId": "sar:axis:STATUS_DRIVE",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "ee3c68fee78ff2a7fdcd61370d2719bb441b6584416d41326be51a7bb61fcab9"
    },
    "originalState": {
      "id": "sar:axis:STATUS_DRIVE",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "STATUS_DRIVE",
      "kind": "strength",
      "definition": "인정·명예·공식 위치를 중요하게 여기는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:STATUS_DRIVE:recognition-target",
        "sar:facet:STATUS_DRIVE:formal-role"
      ],
      "relatedAxes": [
        "CHARISMA",
        "DUTY",
        "AUTONOMY"
      ],
      "distinguishAxis": "CHARISMA",
      "distinction": "주목받는 현상과 인정받으려는 동기는 다르다",
      "behavior": "인정받고 싶은 기여와 평가 기준을 확인",
      "positive": "성과를 설명하고 역할에 필요한 책임을 배움",
      "risk": "외부 평가가 자기 가치의 유일한 기준이 됨",
      "weakSignalLimit": "신호 부족은 야망·성취 동기가 없다는 뜻 아님",
      "twist": "공식 직함보다 구체적 기여의 인정이 더 중요할 수 있음",
      "environment": "평가 권한·공정성·경력 맥락이 필요",
      "coexist": {
        "axis": "DUTY",
        "condition": "공식 역할에 따른 책임을 구체화할 수 있음"
      },
      "tension": {
        "axis": "AUTONOMY",
        "condition": "인정의 기준을 따르다 자기 선택을 잃을 수 있음"
      },
      "counterexample": "직급·승진·명예의 실제 획득을 예측하지 않음",
      "fictionalScene": "가상으로 평가 면담에서 맡은 기여와 원하는 역할을 설명",
      "prohibitedClaim": "인정 욕구가 강하면 높은 자리에 오른다",
      "applicabilityRef": "sar:app:STATUS_DRIVE",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "인정, 명예, 높은 직책을 중요하게 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:MEANING",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 34,
      "originalId": "sar:axis:MEANING",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "aa8b1438434db90d2f3cebe91ec3d24fde20420e3cbb2f09dff3d7302e420d8e"
    },
    "originalState": {
      "id": "sar:axis:MEANING",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "MEANING",
      "kind": "strength",
      "definition": "행동과 선택의 이유·가치를 확인하려는 성향 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:MEANING:value-articulation",
        "sar:facet:MEANING:purpose-check",
        "sar:facet:MEANING:value-practice"
      ],
      "relatedAxes": [
        "GOAL_DRIVE",
        "PRACTICALITY",
        "STATUS_DRIVE"
      ],
      "distinguishAxis": "GOAL_DRIVE",
      "distinction": "목표 달성과 왜 그 목표를 원하는지는 다른 질문이다",
      "behavior": "중요하게 여기는 이유와 현실 조건을 함께 밝힘",
      "positive": "외부 목표를 자기 기준으로 검토",
      "risk": "모든 작은 일에 완전한 이유를 요구해 시작을 막음",
      "weakSignalLimit": "신호 부족을 가치관·삶의 의미 부재로 해석하지 않음",
      "twist": "작은 일상의 유지도 중요한 가치의 실천일 수 있음",
      "environment": "개인이 말한 가치와 실제 선택 맥락이 필요",
      "coexist": {
        "axis": "PRACTICALITY",
        "condition": "가치를 실행 가능한 행동으로 옮길 수 있음"
      },
      "tension": {
        "axis": "STATUS_DRIVE",
        "condition": "남의 평가와 스스로 중요하게 여기는 이유가 다를 수 있음"
      },
      "counterexample": "가치관·종교·도덕 수준을 원천 신호로 추정하지 않음",
      "fictionalScene": "가상으로 제안받은 일의 보상과 하고 싶은 이유를 따로 적음",
      "prohibitedClaim": "의미를 찾는 사람이 도덕적으로 우월하다",
      "applicabilityRef": "sar:app:MEANING",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "돈이나 결과뿐 아니라 왜 하는지도 중요하게 보는 성향",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  },
  {
    "id": "mfpr:semantic-ref:sar:axis:RECOVERY_NEED",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "locator": {
      "file": "src/lib/report-knowledge/semantic-axis-research/axisProfiles.ts",
      "exportName": "AXIS_RESEARCH",
      "index": 35,
      "originalId": "sar:axis:RECOVERY_NEED",
      "sourceVersion": "565c4613d4e01d65510380e0f597c535f81396c0",
      "recordSha256": "61b421ad982e6dc473305f5a1c5a0c97e32389e72fb59e2b2ab168f008737ed8"
    },
    "originalState": {
      "id": "sar:axis:RECOVERY_NEED",
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "runtimeEvidenceIds": [],
      "review": "conditional_semantic_candidate",
      "sourceRefs": [
        "repo:semanticCore",
        "repo:fusionMeanings"
      ],
      "sourceStatus": "repository_checked_not_empirical",
      "axis": "RECOVERY_NEED",
      "kind": "strength",
      "definition": "부담 뒤 쉬거나 생각을 정리할 여백을 필요로 하는 정도의 해석 후보",
      "parent": "existing_semantic_axis",
      "facets": [
        "sar:facet:RECOVERY_NEED:load-recognition",
        "sar:facet:RECOVERY_NEED:rest-access",
        "sar:facet:RECOVERY_NEED:return-agreement"
      ],
      "relatedAxes": [
        "ENERGY_DIRECTION",
        "BOUNDARY",
        "DUTY"
      ],
      "distinguishAxis": "ENERGY_DIRECTION",
      "distinction": "회복 필요와 평소 에너지 표현 방향은 같지 않다",
      "behavior": "쉬는 방식과 다시 응답할 시점을 알림",
      "positive": "과부하를 인식하고 다음 참여를 준비",
      "risk": "회복을 미루거나 설명 없는 거리두기로 책임을 남김",
      "weakSignalLimit": "신호 부족은 휴식이 필요 없다는 뜻이 아님",
      "twist": "짧은 상태 공유가 혼자 쉬는 시간을 보호할 수 있음",
      "environment": "실제 피로·생활 제약·휴식 접근성을 먼저 확인",
      "coexist": {
        "axis": "BOUNDARY",
        "condition": "회복을 위해 가능한 연락과 쉬는 구간을 구분"
      },
      "tension": {
        "axis": "DUTY",
        "condition": "쉬는 필요와 인수인계가 필요한 책임을 함께 조율"
      },
      "counterexample": "질환·번아웃·회복 기간을 진단하지 않음",
      "fictionalScene": "가상으로 쉬는 날의 연락 범위와 다음 답변 시점을 합의",
      "prohibitedClaim": "회복 신호가 크면 정신적으로 약하다",
      "applicabilityRef": "sar:app:RECOVERY_NEED",
      "limits": [
        "편집적 의미 분해이며 관찰된 고객 사실이나 실증적 심리 특성이 아니다.",
        "원천 출처·적용 맥락·반례를 확인하기 전 고객 문장에 사용하지 않는다."
      ],
      "existingDefinition": "혼자 쉬고 생각을 정리할 시간이 필요한 정도",
      "definitionRelation": "conditional_decomposition_not_replacement"
    },
    "referenceOnly": true,
    "majorUse": "personal_response_question_only_if_actual_personal_and_period_evidence_intersect",
    "temporalFactSource": false,
    "newAxisOrFacet": false,
    "unsupported": "facet를 실제 운세 변화·강화 계산의 근거로 사용 금지",
    "bindingImplemented": false
  }
];
