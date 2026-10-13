/** Static offline Fusion knowledge; source file/export paths stay in the audit catalog. */
import type { FusionMaterial } from "./fusionResearchTypes";
export const COMPLEMENT_FUSION_RESEARCH: readonly FusionMaterial[] = [
  {
    "id": "fkr:complement:C001",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C001",
    "existingRuleSha256": "077eb8a69e2fb829414441de119f487c7b9c9f1542ec263da38bb6ded3625ca4",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "문제를 빨리 알아차리면서도 사람을 함부로 몰아붙이지 않는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRECISION",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "수정할 오류와 상대가 요청한 도움은 같은 대상인가?",
    "jointReason": "작은 오류를 기준에 비추어 발견 / 상대가 원하는 도움을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "오류의 영향을 설명하고 필요한 지원을 물어 부담을 줄임",
    "risk": "필요를 묻지 않은 정확한 지적은 평가로 들릴 수 있음",
    "goodIntentionMistake": "도와주려 오류를 대신 고치면 상대의 선택이 사라짐",
    "twist": "지적을 잠시 보류하고 필요를 물으면 수정도 빨라질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 초안 오류를 알리고 설명·직접 수정 중 원하는 지원을 묻는 장면"
    },
    "behaviorQuestion": "수정할 오류와 상대가 요청한 도움은 같은 대상인가?",
    "conditions": [
      "합의된 검수 기준·도움 요청·상대 동의가 함께 있음",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "오류는 맞아도 지금 상대는 조언을 원하지 않을 수 있음",
    "exclusions": [
      "두 축이 있으므로 비판은 항상 친절하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C081은 친밀 관계의 기억·해석이며 검수 지원과 다름",
    "applicabilityRef": "fkr:app:complement:C001",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C002",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C002",
    "existingRuleSha256": "23aa38084741d80069944be8c211b8df208a9d847e7c451d636ab90f35d40460",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "작은 오류를 찾는 데서 끝나지 않고 왜 그런 문제가 생겼는지까지 파고드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRECISION",
        "DEPTH"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "role": "axisA_role"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "잘못된 결과와 그 결과를 만든 원인을 분리했는가?",
    "jointReason": "작은 오류를 기준에 비추어 발견 / 표면 결과 뒤의 과정을 탐색의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "오류를 바로잡고 재발 원인을 별도로 조사",
    "risk": "원인 규명에 몰입해 당장 필요한 복구를 늦춤",
    "goodIntentionMistake": "완벽히 해결하려 사용자에게 필요한 임시 조치를 보류",
    "twist": "원인을 모른다고 말해도 유효한 복구는 먼저 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 잘못된 청구를 수정하고 생성 경로를 따로 점검하는 장면"
    },
    "behaviorQuestion": "잘못된 결과와 그 결과를 만든 원인을 분리했는가?",
    "conditions": [
      "오류 사실·추적 자료·복구 권한을 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "오류가 보여도 원인을 추적할 자료는 없을 수 있음",
    "exclusions": [
      "오류 발견만으로 원인 진실을 알고 있다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C003의 반복 패턴과 일회 원인의 차이",
    "applicabilityRef": "fkr:app:complement:C002",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C003",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C003",
    "existingRuleSha256": "9cb6e6c0267f501456163ce54d8e722ccc08cc7b681c2d234ee255c0c793256f",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "한 번의 실수만 보는 게 아니라 같은 문제가 왜 반복되는지도 알아차리는 쪽으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRECISION",
        "PATTERN_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "role": "axisA_role"
      },
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:recurrence",
        "definition": "같은 조건에서 반복된 현상을 비교",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "같은 오류가 같은 조건에서 반복되는가?",
    "jointReason": "상황 사이 기준 적용의 일관성을 확인 / 같은 조건에서 반복된 현상을 비교의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "여러 사례의 동일 조건을 모아 공통 수정 지점을 찾음",
    "risk": "표본 몇 개를 반복 법칙으로 확대",
    "goodIntentionMistake": "실수를 막으려 모든 예외를 같은 절차에 가둠",
    "twist": "반복되지 않는 사례가 수정 범위를 더 정확히 알려줌",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 서로 다른 주문 오류의 공통 입력을 비교하는 장면"
    },
    "behaviorQuestion": "같은 오류가 같은 조건에서 반복되는가?",
    "conditions": [
      "복수 사례·같은 기준·달라진 조건 기록이 있음",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "비슷한 오류가 서로 다른 원인일 수 있음",
    "exclusions": [
      "패턴으로 다음 실패를 예언",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C002의 원인 추적과 달리 표본·반복 조건 필요",
    "applicabilityRef": "fkr:app:complement:C003",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C004",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C004",
    "existingRuleSha256": "18f4a4e3e96dc32b111031d8322b3fe982ad8e623b21b9ddb11e1fe034868364",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "궁금한 점이 생기면 대충 넘기기보다 앞뒤가 맞는지 확인할 때까지 파고드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CURIOSITY",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "궁금한 이유와 설명의 모순이 같은 질문인가?",
    "jointReason": "모르는 지점을 질문으로 구체화 / 설명의 전제와 결론 사이 모순 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "질문을 명료한 전제로 나눠 확인 가능한 답을 얻음",
    "risk": "모든 관심 질문을 상대 설명의 결함으로 취급",
    "goodIntentionMistake": "납득하려 끝없이 반박해 대화를 닫음",
    "twist": "답하지 않아도 되는 질문을 정하면 필요한 검토가 깊어짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 제안서의 가정 한 개만 질문하고 별도 호기심은 보류하는 장면"
    },
    "behaviorQuestion": "궁금한 이유와 설명의 모순이 같은 질문인가?",
    "conditions": [
      "실제 주장·질문의 목적·답할 자료를 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "질문은 흥미 때문이고 오류는 없을 수 있음",
    "exclusions": [
      "호기심이 많으므로 논리적으로 정확하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C011은 다른 정보의 연결, 이 규칙은 주장 검토",
    "applicabilityRef": "fkr:app:complement:C004",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C005",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C005",
    "existingRuleSha256": "3b5c2b551830bb33367694ddb1fbf32aacc72d6a42c566e9aee36cf2c4761a1d",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "겉으로 떨어져 보이는 일들 사이에서 깊은 연결과 반복을 찾아내는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DEPTH",
        "PATTERN_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "role": "axisA_role"
      },
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:cross-link",
        "definition": "다른 영역의 관계를 가설로 연결",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "떨어진 사례가 같은 맥락을 공유하는가?",
    "jointReason": "같은 행동의 다른 조건을 검토 / 다른 영역의 관계를 가설로 연결의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "연결의 공통점과 차이를 함께 밝혀 설명 범위를 넓힘",
    "risk": "비슷한 서사를 같은 원인의 증거로 삼음",
    "goodIntentionMistake": "이해를 돕고자 관련 없는 자료까지 한 이야기로 묶음",
    "twist": "연결을 끊어두는 판단도 깊은 이해의 일부",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 두 고객의 불편이 같은 단계인지 먼저 비교하는 장면"
    },
    "behaviorQuestion": "떨어진 사례가 같은 맥락을 공유하는가?",
    "conditions": [
      "각 사례의 맥락·다른 원인·반례를 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "겉의 반복에도 원인은 다를 수 있음",
    "exclusions": [
      "연결 발견으로 인과관계 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C007의 행동 경로 계획과 원인 연결은 다름",
    "applicabilityRef": "fkr:app:complement:C005",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C006",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C006",
    "existingRuleSha256": "32997faf799d3b5ec1aac6a4f1c8931c49da6089e8c87d7ce40cada3cd9b7786",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "그냥 아는 데서 끝나지 않고 깊게 이해해 자기 전문성으로 만드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DEPTH",
        "LEARNING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "role": "axisA_role"
      },
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "깊게 이해한 것을 다시 설명하고 써볼 수 있는가?",
    "jointReason": "깊게 검토한 내용을 짧게 전달 / 익힌 내용을 다시 꺼내 사용의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "핵심 원리를 회상해 다른 문제에 적용",
    "risk": "복잡한 설명량을 전문성으로 착각",
    "goodIntentionMistake": "정확히 알려주려 상대 학습 수준을 넘는 내용을 줌",
    "twist": "짧게 설명할 수 없는 부분이 다시 배울 지점을 알려줌",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 연구 내용을 처음 배우는 사람에게 설명하고 막힌 부분을 적는 장면"
    },
    "behaviorQuestion": "깊게 이해한 것을 다시 설명하고 써볼 수 있는가?",
    "conditions": [
      "검증된 학습 자료·연습·이해 확인이 있음",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "깊이 읽었어도 실행 기술은 따로 필요",
    "exclusions": [
      "두 축으로 전문 자격·지능 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C065의 결과물 제작보다 이해의 재현",
    "applicabilityRef": "fkr:app:complement:C006",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C007",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C007",
    "existingRuleSha256": "ddd083db296ea4ec2086d22a727d95b210aa1f3006d6167df18684fd91f65125",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "지금 상황만 보기보다 반복되는 흐름을 보고 다음에 무슨 일이 생길지 미리 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRATEGY",
        "PATTERN_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:contingency",
        "definition": "조건이 바뀔 때의 대안을 준비",
        "role": "axisA_role"
      },
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:recurrence",
        "definition": "같은 조건에서 반복된 현상을 비교",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "관찰된 반복이 계획의 어느 가정을 바꾸는가?",
    "jointReason": "조건이 바뀔 때의 대안을 준비 / 같은 조건에서 반복된 현상을 비교의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "반복을 참고하되 다른 경우의 대안 경로를 준비",
    "risk": "과거 패턴이 미래에도 이어질 것이라 확정",
    "goodIntentionMistake": "불안을 줄이려 실제 필요 없는 대안을 과도하게 준비",
    "twist": "패턴이 깨질 신호를 정하면 계획의 수정이 쉬워짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 주문 증가가 멈출 경우의 인력 계획을 함께 적는 장면"
    },
    "behaviorQuestion": "관찰된 반복이 계획의 어느 가정을 바꾸는가?",
    "conditions": [
      "반복 자료·현재 제약·수정 신호 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "정책 변화로 기존 반복이 더 이상 유효하지 않을 수 있음",
    "exclusions": [
      "패턴으로 미래 사건·성과 예측 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C008은 빠진 조건, 이 규칙은 패턴과 분기",
    "applicabilityRef": "fkr:app:complement:C007",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C008",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C008",
    "existingRuleSha256": "222ac3ecaaf7795d0a8f6cce48a2d0a8d71073678f6b58414a47a7bb802a462e",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "큰 방향만 잡는 게 아니라 빠진 조건까지 확인하면서 계획을 세우는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRATEGY",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:sequence-design",
        "definition": "의존 관계에 맞게 순서를 배치",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "계획의 순서와 완료 조건이 맞물리는가?",
    "jointReason": "의존 관계에 맞게 순서를 배치 / 최종 결과물의 누락을 점검의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "빠진 의존 작업을 확인해 실행 가능한 순서를 정함",
    "risk": "세부 검수에 매여 전체 기한을 놓침",
    "goodIntentionMistake": "빈틈을 없애려 필요 없는 승인 단계를 추가",
    "twist": "완료 수준을 낮춰도 중요한 경로는 더 안전해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 출시 준비에서 필수 검수와 뒤로 미룰 개선을 나누는 장면"
    },
    "behaviorQuestion": "계획의 순서와 완료 조건이 맞물리는가?",
    "conditions": [
      "작업 의존·기한·허용 오차가 명시됨",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "정확한 체크리스트에도 실제 인력이 부족할 수 있음",
    "exclusions": [
      "계획과 정밀함이 있으므로 실패 없음",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C020의 결정 종료보다 실행 순서·검수",
    "applicabilityRef": "fkr:app:complement:C008",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C009",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C009",
    "existingRuleSha256": "6534ef190923030d2c292fa455571b1f60f7ce8f9d8a5fbf037137c13c0183a1",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "정확하기만 한 답보다 실제로 써먹을 수 있고 틀리지 않는 답을 찾는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRACTICALITY",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "기준상 정확한 답이 실제 사용에서도 맞는가?",
    "jointReason": "실제 사용 환경에서 작동 여부를 확인 / 작은 오류를 기준에 비추어 발견의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "작은 사용 시험으로 정확성과 적용성을 함께 확인",
    "risk": "작동했다는 이유로 검증 기준을 생략",
    "goodIntentionMistake": "빨리 도움이 되려 충분히 검증하지 않은 답을 전달",
    "twist": "쓸 수 없다는 관찰이 더 적절한 정확성 기준을 찾게 함",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 계산표 수치와 실제 청구 결과를 대조하는 장면"
    },
    "behaviorQuestion": "기준상 정확한 답이 실제 사용에서도 맞는가?",
    "conditions": [
      "실제 사용 대상·검증 기준·시험 동의가 있음",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "정확한 이론도 현재 도구에서는 사용할 수 없을 수 있음",
    "exclusions": [
      "실용적이면 과학적으로 옳다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C037의 자원 잔여 계산과 일반 사용 검증의 차이",
    "applicabilityRef": "fkr:app:complement:C009",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C010",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C010",
    "existingRuleSha256": "0e31b354d388d0d232affa9190089ba74a696999ba9f62d4c851f6f6efa37066",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "겉으로 좋아 보이는 것보다 왜 중요한지까지 이해해야 마음이 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "MEANING",
        "DEPTH"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "role": "axisA_role"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "중요하다는 이유와 사실의 원인을 구분하는가?",
    "jointReason": "목표와 중요한 이유의 연결을 확인 / 표면 결과 뒤의 과정을 탐색의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "개인 가치와 실제 작동 이유를 별도 검토",
    "risk": "자신에게 의미 있는 설명을 사실로 믿음",
    "goodIntentionMistake": "깊게 공감하려 상대의 삶에 없는 이유를 만들어냄",
    "twist": "모르는 원인을 남겨도 중요한 가치는 선택할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 직무를 고르는 가치와 업무의 실제 조건을 나누는 장면"
    },
    "behaviorQuestion": "중요하다는 이유와 사실의 원인을 구분하는가?",
    "conditions": [
      "본인 가치 진술·확인된 사실·모르는 범위 보존",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "의미가 큰 일도 원인은 단순할 수 있음",
    "exclusions": [
      "가치 추구로 도덕성·통찰 우월 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C045는 실행 가치, 이 규칙은 이유와 원인",
    "applicabilityRef": "fkr:app:complement:C010",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C011",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C011",
    "existingRuleSha256": "b40c3ddc9e0ddb51c9d23575c3f15dc5a62bfaa1e5a7b72f6f69c82ffbe00403",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "한 가지 궁금증에서 시작해 서로 다른 정보까지 연결하며 새로운 생각을 만드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CURIOSITY",
        "PATTERN_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:alternative-search",
        "definition": "기존 답 밖의 자료를 찾아봄",
        "role": "axisA_role"
      },
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:cross-link",
        "definition": "다른 영역의 관계를 가설로 연결",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "다른 정보의 연결이 질문을 새롭게 만드는가?",
    "jointReason": "기존 답 밖의 자료를 찾아봄 / 다른 영역의 관계를 가설로 연결의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기존 답의 전제를 다른 분야 사례로 시험",
    "risk": "연상이 많은 것을 해답이 많다고 착각",
    "goodIntentionMistake": "발상을 돕고자 현재 문제와 먼 자료를 계속 제시",
    "twist": "연결 하나를 버리면 남은 질문이 선명해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 서비스 불편을 다른 도구의 사용 사례와 비교하는 장면"
    },
    "behaviorQuestion": "다른 정보의 연결이 질문을 새롭게 만드는가?",
    "conditions": [
      "사례의 차이·시험 가능한 가설·질문 목적 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "흥미로운 연결이 실제 문제와 관련 없을 수 있음",
    "exclusions": [
      "아이디어 수로 창의적 성공 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C005의 깊은 맥락 검토보다 탐색 가설",
    "applicabilityRef": "fkr:app:complement:C011",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C012",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C012",
    "existingRuleSha256": "3ebde5a45d0b8fa188bbf5257a55c3c0e9afc288e8e91a2fd961b033f052fa0a",
    "group": "THINKING_ANALYSIS",
    "researchRelation": "task_complement",
    "originalMeaning": "무엇이 괜찮고 무엇이 아닌지 자기 기준을 꽤 정확하게 구분하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work",
      "learning"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "BOUNDARY",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:refusal",
        "definition": "받지 않을 요청을 명시",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "거절의 선과 정확성 기준을 혼동하지 않는가?",
    "jointReason": "받지 않을 요청을 명시 / 상황 사이 기준 적용의 일관성을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "허용 범위와 판단 기준을 따로 밝혀 협의를 명료화",
    "risk": "정확한 판단을 이유로 타인의 동의까지 대신함",
    "goodIntentionMistake": "기준을 지키려 본인에게 거절권 없는 역할까지 거부",
    "twist": "같은 기준을 지켜도 각자의 허용선은 다를 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 업무 수정은 수용하되 사적 연락은 거절하는 장면"
    },
    "behaviorQuestion": "거절의 선과 정확성 기준을 혼동하지 않는가?",
    "conditions": [
      "실제 권한·의무·거절 안전·합의 기준 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "기준이 정확해도 선택권은 다른 사람에게 있을 수 있음",
    "exclusions": [
      "내 기준이 옳으니 타인 경계도 결정 가능",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C028은 조율 권한, 이 규칙은 개인 허용선",
    "applicabilityRef": "fkr:app:complement:C012",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C013",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C013",
    "existingRuleSha256": "f7223b9682eef1faa243c6c5c61171ebd409d41aec0b66097c220b6ca411d450",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "목표가 생기면 남이 시작해주길 기다리기보다 직접 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "GOAL_DRIVE",
        "INITIATIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "role": "axisA_role"
      },
      {
        "axis": "INITIATIVE",
        "direction": 1,
        "facetRef": "sar:facet:INITIATIVE:small-first-step",
        "definition": "큰 승인 전 허용된 작은 단계를 수행",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "목표를 향한 첫 행동을 본인이 시작할 수 있는가?",
    "jointReason": "목적에 따라 우선 과제를 고름 / 큰 승인 전 허용된 작은 단계를 수행의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "큰 목표를 현재 권한 안의 작은 발의로 옮김",
    "risk": "시작한 만큼 목표를 달성했다고 착각",
    "goodIntentionMistake": "실행을 돕고자 동의 없는 업무를 먼저 배정",
    "twist": "시작하지 않을 목표를 고르는 것도 주도적 선택",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 큰 개선안 전에 관찰할 문제 한 개를 제안하는 장면"
    },
    "behaviorQuestion": "목표를 향한 첫 행동을 본인이 시작할 수 있는가?",
    "conditions": [
      "목표·실제 권한·작은 행동의 비용 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "목표가 있어도 승인이나 자원이 먼저 필요할 수 있음",
    "exclusions": [
      "주도성과 목표로 달성 확률 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C018은 시작 순서, 이 규칙은 목표와 발의",
    "applicabilityRef": "fkr:app:complement:C013",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C014",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C014",
    "existingRuleSha256": "4f89015e59fab2471fc3dccdaddaa68c391eb1b389e663de926122b404b7d705",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "목표를 잡은 뒤 쉽게 바꾸기보다 끝까지 붙드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "GOAL_DRIVE",
        "PERSISTENCE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "axisA_role"
      },
      {
        "axis": "PERSISTENCE",
        "direction": 1,
        "facetRef": "sar:facet:PERSISTENCE:stop-rule",
        "definition": "지속의 종료 조건을 정함",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "계속하는 행동이 여전히 목표에 기여하는가?",
    "jointReason": "진행 결과와 목적의 차이를 확인 / 지속의 종료 조건을 정함의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "중간 진척과 종료 조건을 함께 두어 노력 유지",
    "risk": "오래 했다는 이유로 손실을 계속 감수",
    "goodIntentionMistake": "책임 있게 끝내려 실패 신호를 축소",
    "twist": "목표를 바꾸는 것이 지속한 가치의 보전일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 학습 목표와 실제 연습 성과를 비교해 방법을 바꾸는 장면"
    },
    "behaviorQuestion": "계속하는 행동이 여전히 목표에 기여하는가?",
    "conditions": [
      "완료 기준·진척 정보·중단 선택권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "지속해도 목표와 다른 결과만 쌓일 수 있음",
    "exclusions": [
      "끈기와 목표가 있으면 성공 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C022의 빠른 시작과 지속보다 목표 유효성",
    "applicabilityRef": "fkr:app:complement:C014",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C015",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C015",
    "existingRuleSha256": "5e092aa8dbc362b9a54456744d1766dfa38f51a4ae2fa61dabe30b964455d2f3",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "목표를 세우는 데서 끝나지 않고 실제 결과가 남아야 만족하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "GOAL_DRIVE",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:outcome-check",
        "definition": "실행 뒤 남은 결과를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "목표와 실제 사용 가능한 결과가 같은가?",
    "jointReason": "목적에 따라 우선 과제를 고름 / 실행 뒤 남은 결과를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "성과를 보여줄 지표와 실제 효용을 함께 확인",
    "risk": "측정 가능한 결과만 가치 있다고 평가",
    "goodIntentionMistake": "확실한 성과를 주려 어려운 장기 과제를 회피",
    "twist": "작은 실용 결과가 큰 목표를 수정하게 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 학습 시간 목표와 풀 수 있는 문제를 따로 보는 장면"
    },
    "behaviorQuestion": "목표와 실제 사용 가능한 결과가 같은가?",
    "conditions": [
      "목표·사용자·평가 기준·현실 자원 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "보이지 않는 관계 노동도 중요한 결과일 수 있음",
    "exclusions": [
      "실용 목표로 금전 성과 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C042는 자원 목표, 이 규칙은 일반 결과의 유효성",
    "applicabilityRef": "fkr:app:complement:C015",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C016",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C016",
    "existingRuleSha256": "82fe73c0478207f3f9f9615bbd1a0770ec0d857de75b4e4479aeb832fc2ae727",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "하나를 해내면 거기서 멈추기보다 더 큰 목표를 잡고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "GOAL_DRIVE",
        "EXPANSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:goal-release",
        "definition": "목적을 위해 불필요한 과제를 내려놓음",
        "role": "axisA_role"
      },
      {
        "axis": "EXPANSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPANSION:capacity-check",
        "definition": "확대 전에 운영 여력을 점검",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "범위를 넓혀도 끝낼 목표와 유지 여력이 남는가?",
    "jointReason": "목적을 위해 불필요한 과제를 내려놓음 / 확대 전에 운영 여력을 점검의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "확대할 기회와 내려놓을 목표를 함께 고름",
    "risk": "새 목표가 계속 늘어 기존 약속을 밀어냄",
    "goodIntentionMistake": "성장을 돕고자 담당 인력 없이 범위만 추가",
    "twist": "범위를 줄여 한 목표를 완수하는 것도 확장 기반",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 고객층을 늘리기 전 기존 서비스 대응량을 적는 장면"
    },
    "behaviorQuestion": "범위를 넓혀도 끝낼 목표와 유지 여력이 남는가?",
    "conditions": [
      "기존 목표·유지비·신규 범위·중단권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "확대 대신 집중이 더 적절한 단계일 수 있음",
    "exclusions": [
      "큰 목표·확장 욕구로 성장 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C048은 실현 여력, 이 규칙은 목표의 선택·종료",
    "applicabilityRef": "fkr:app:complement:C016",
    "legacyTagReview": {
      "relatedTags": [],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C017",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C017",
    "existingRuleSha256": "80fa0a131b32bc87a887a63996259dcdefc8765a93d443ebc66429994a5d2f6f",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "일단 시작한 뒤 상황을 보면서 방법을 바꿔 답을 찾는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "INITIATIVE",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "INITIATIVE",
        "direction": 1,
        "facetRef": "sar:facet:INITIATIVE:opening-proposal",
        "definition": "멈춘 상황에 첫 선택지를 제시",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:feedback-uptake",
        "definition": "받은 정보의 유효 부분을 반영",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "먼저 제안한 방법을 실제 피드백에 맞춰 고치는가?",
    "jointReason": "멈춘 상황에 첫 선택지를 제시 / 받은 정보의 유효 부분을 반영의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "발의 뒤 관찰 자료로 계획을 갱신",
    "risk": "시작한 일을 지키려 피드백을 합리화",
    "goodIntentionMistake": "상대를 돕겠다고 일방적으로 방식을 바꿈",
    "twist": "수정을 상대에게 맡기는 것이 더 나은 주도성일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 초안 제안 뒤 사용자 반응을 받아 방법을 바꾸는 장면"
    },
    "behaviorQuestion": "먼저 제안한 방법을 실제 피드백에 맞춰 고치는가?",
    "conditions": [
      "수정 권한·실제 피드백·공동 약속 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "제안자는 있어도 고칠 권한은 없을 수 있음",
    "exclusions": [
      "시작과 적응으로 모든 변화에 강하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C019는 경로 유지·변경, 이 규칙은 발의와 수용",
    "applicabilityRef": "fkr:app:complement:C017",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C018",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C018",
    "existingRuleSha256": "266525a236e4784378bc03f8283cb5f6e255a907fc66df20de234704c059d75a",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "시작은 빠르지만 아무렇게나 뛰어들기보다 해야 할 순서를 정하고 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "INITIATIVE",
        "STRUCTURE_STYLE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "INITIATIVE",
        "direction": 1,
        "facetRef": "sar:facet:INITIATIVE:opening-proposal",
        "definition": "멈춘 상황에 첫 선택지를 제시",
        "role": "axisA_role"
      },
      {
        "axis": "STRUCTURE_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "definition": "반드시 지킬 최소 절차를 선택",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "첫 제안에 필요한 최소 절차가 정해졌는가?",
    "jointReason": "멈춘 상황에 첫 선택지를 제시 / 반드시 지킬 최소 절차를 선택의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "시작할 때 지킬 순서와 자유롭게 정할 방법을 분리",
    "risk": "절차를 세우는 일을 실제 실행으로 착각",
    "goodIntentionMistake": "혼란을 막으려 사전 승인만 늘림",
    "twist": "절차를 줄이는 제안도 계획적 시작일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 모임에 필수 예약과 선택 활동만 정하는 장면"
    },
    "behaviorQuestion": "첫 제안에 필요한 최소 절차가 정해졌는가?",
    "conditions": [
      "필수 기준·첫 결정권·기한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "자발적 제안도 주변 사람 준비가 먼저일 수 있음",
    "exclusions": [
      "INITIATIVE로 빠른 행동 속도 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "원문 시작은 빠르다는 표현과 별개로 속도 근거는 필요",
    "applicabilityRef": "fkr:app:complement:C018",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C019",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C019",
    "existingRuleSha256": "d56678b0069cb27c0e7aaf8f124492884ce112632eb156d6f94fa046144f0aee",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "목표는 유지하면서 상황이 바뀌면 방법은 유연하게 바꾸는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRATEGY",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:route-comparison",
        "definition": "목적에 이르는 여러 경로를 비교",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:method-revision",
        "definition": "목적 안에서 방법을 바꿈",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "목적을 유지하면서 바꿀 수 있는 경로는 무엇인가?",
    "jointReason": "목적에 이르는 여러 경로를 비교 / 목적 안에서 방법을 바꿈의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "조건 변화에 대안 경로의 비용을 비교",
    "risk": "방법 변경이 잦아 함께하는 사람의 예측을 깨뜨림",
    "goodIntentionMistake": "목표를 지키려 손실 큰 대안을 계속 추가",
    "twist": "목표 자체를 갱신할 필요도 함께 검토할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 도구가 바뀐 작업의 다른 수행 방법을 비교하는 장면"
    },
    "behaviorQuestion": "목적을 유지하면서 바꿀 수 있는 경로는 무엇인가?",
    "conditions": [
      "실제 변경 조건·유효 목표·방법 재량 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "바꿀 수 없는 안전 절차도 있음",
    "exclusions": [
      "유연한 전략이 항상 정답을 찾는다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C090은 기준과 방법, 이 규칙은 대안 경로 비용",
    "applicabilityRef": "fkr:app:complement:C019",
    "legacyTagReview": {
      "relatedTags": [],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C020",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C020",
    "existingRuleSha256": "575f3a6b863ab49dcf6396579a03176f864ac6281a112614c80f9249f14a82e8",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "결론을 오래 미루지는 않지만 중요한 조건을 확인한 뒤 답을 정하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DECISION_STYLE",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DECISION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:DECISION_STYLE:closure-criteria",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "결론을 닫기 전에 필요한 확인 수준은 무엇인가?",
    "jointReason": "어떤 정보면 결론을 닫을지 정의 / 최종 결과물의 누락을 점검의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "필수 조건을 점검하고 결정 시점을 알림",
    "risk": "모든 오차를 없애야 결정할 수 있다고 여김",
    "goodIntentionMistake": "확실히 해주려 결정권자의 범위까지 대신 확정",
    "twist": "중요하지 않은 오차를 남겨도 적절한 결정은 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 계약의 필수 조건과 향후 수정 항목을 나누는 장면"
    },
    "behaviorQuestion": "결론을 닫기 전에 필요한 확인 수준은 무엇인가?",
    "conditions": [
      "결정권·확인 기준·기한·되돌림 조건 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "조건을 알아도 선택은 미루는 것이 타당할 수 있음",
    "exclusions": [
      "결론 선호로 빠른 속도·정확성 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C008의 계획 순서와 달리 선택 종료 기준",
    "applicabilityRef": "fkr:app:complement:C020",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C021",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C021",
    "existingRuleSha256": "895f19454e3a67fa6fa6a3afd723c249db37086c4448150f48cab8fe5641eb03",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "움직이는 속도는 빠르지만 다음 순서를 생각하지 않고 덤비는 사람은 아닌 모습으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "ACTION_TEMPO",
        "STRATEGY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "ACTION_TEMPO",
        "direction": 1,
        "facetRef": "sar:facet:ACTION_TEMPO:paced-handoff",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "role": "axisA_role"
      },
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:sequence-design",
        "definition": "의존 관계에 맞게 순서를 배치",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "빠른 행동이 뒤 작업의 준비와 맞는가?",
    "jointReason": "자기 착수와 타인의 준비 속도를 조정 / 의존 관계에 맞게 순서를 배치의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "다음 단계 준비를 알리며 작은 행동을 먼저 실행",
    "risk": "내 속도가 상대의 검토를 압박",
    "goodIntentionMistake": "기다림을 줄이려 검토되지 않은 초안을 확정안처럼 전달",
    "twist": "일찍 진행 상태를 공유하면 실제 속도를 낮춰도 협업이 빨라짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 초안을 먼저 주고 승인 전 실행 범위를 표시하는 장면"
    },
    "behaviorQuestion": "빠른 행동이 뒤 작업의 준비와 맞는가?",
    "conditions": [
      "행동 속도 자료·의존 작업·가역 범위 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "빠르게 시작했어도 다음 단계 전략은 없을 수 있음",
    "exclusions": [
      "속도+전략으로 위험 없는 실행 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C013의 먼저 발의와 시간 간격을 구별",
    "applicabilityRef": "fkr:app:complement:C021",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C022",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C022",
    "existingRuleSha256": "688b1d7457da3c70f7983c999b400fe0fdaabb41aeba7d820814f3fe383d30d3",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "시작도 빠르고 한번 시작한 일도 쉽게 놓지 않는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "ACTION_TEMPO",
        "PERSISTENCE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "ACTION_TEMPO",
        "direction": 1,
        "facetRef": "sar:facet:ACTION_TEMPO:start-latency",
        "definition": "결론과 첫 행동 사이의 간격",
        "role": "axisA_role"
      },
      {
        "axis": "PERSISTENCE",
        "direction": 1,
        "facetRef": "sar:facet:PERSISTENCE:repeat-practice",
        "definition": "정한 연습을 반복",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "빨리 시작한 뒤에도 반복할 이유와 여력이 있는가?",
    "jointReason": "결론과 첫 행동 사이의 간격 / 정한 연습을 반복의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "첫 행동과 지속 루틴을 다른 계획으로 둠",
    "risk": "초기 속도를 유지하려 부담을 누적",
    "goodIntentionMistake": "의욕을 지키려 중단 신호를 무시",
    "twist": "나중에 속도를 낮추면 시작한 일을 오래 이어갈 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 첫날 학습량과 다음 주 반복량을 다르게 정하는 장면"
    },
    "behaviorQuestion": "빨리 시작한 뒤에도 반복할 이유와 여력이 있는가?",
    "conditions": [
      "착수 간격·반복 비용·휴식·중단권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "빠른 시작이 실제 지속으로 이어지지 않을 수 있음",
    "exclusions": [
      "빠르고 끈기 있으니 완수 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C014는 목표 유효성, 이 규칙은 속도와 반복의 분리",
    "applicabilityRef": "fkr:app:complement:C022",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C023",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C023",
    "existingRuleSha256": "8c86612be14b286adeba218ad572ef1575d2668b13a5e5f53b8ab95702cd30ce",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "새로운 것을 찾는 이유가 단순한 재미보다 더 나은 목표와 성장을 향하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CHANGE_ORIENTATION",
        "GOAL_DRIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CHANGE_ORIENTATION",
        "direction": 1,
        "facetRef": "sar:facet:CHANGE_ORIENTATION:chosen-change",
        "definition": "스스로 선택한 변화와 강제 변화를 구별",
        "role": "axisA_role"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "새 방법이 현재 목표에 실제로 도움이 되는가?",
    "jointReason": "스스로 선택한 변화와 강제 변화를 구별 / 목적에 따라 우선 과제를 고름의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "새로움의 이유와 개선할 지표를 함께 밝힘",
    "risk": "변화가 있다는 사실을 진척으로 착각",
    "goodIntentionMistake": "성장을 돕고자 기존 방법의 유효성까지 지움",
    "twist": "이번에는 유지하는 선택이 목표에 더 가까울 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 학습 도구를 고르기 전 필요한 과제를 적는 장면"
    },
    "behaviorQuestion": "새 방법이 현재 목표에 실제로 도움이 되는가?",
    "conditions": [
      "실제 목표·변경 이유·현재 방식의 반례 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "새로움의 즐거움이 목표와 무관할 수 있음",
    "exclusions": [
      "변화를 좋아하므로 반드시 성장 지향이라고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C083은 가능성 발견, 이 규칙은 목표 관련성",
    "applicabilityRef": "fkr:app:complement:C023",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C024",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C024",
    "existingRuleSha256": "d5ced3a28720716b585b87d3d8e35a6ec0d66a20945087bc197d57479f5a5428",
    "group": "EXECUTION_STRATEGY",
    "researchRelation": "task_complement",
    "originalMeaning": "기본 생활과 기준은 안정적으로 두면서 상황이 바뀌면 방법은 잘 바꾸는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STABILITY",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:protective-change",
        "definition": "지속을 위해 필요한 변경을 수용",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:constraint-response",
        "definition": "새 제약에 가능한 행동을 재배치",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "안정 기반을 지키기 위해 어떤 방법을 바꿀까?",
    "jointReason": "지속을 위해 필요한 변경을 수용 / 새 제약에 가능한 행동을 재배치의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "유지할 최소 기반과 바뀐 제약을 함께 확인",
    "risk": "안정을 핑계로 필요한 조정을 미룸",
    "goodIntentionMistake": "불안을 줄이려 모든 상황에 같은 대응을 요구",
    "twist": "일부를 바꾸는 것이 전체 연속성을 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 근무 변경 뒤 생활의 필수 시간만 유지하는 장면"
    },
    "behaviorQuestion": "안정 기반을 지키기 위해 어떤 방법을 바꿀까?",
    "conditions": [
      "현재 제약·유지 대상·조정 권한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "조정 비용이 기반보다 클 수도 있음",
    "exclusions": [
      "안정과 적응이 있어 손실 없이 변화한다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C090은 계획 기준, 이 규칙은 실제 유지 기반",
    "applicabilityRef": "fkr:app:complement:C024",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C025",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C025",
    "existingRuleSha256": "d58715c6bf9e4f735369065b5544aad74ee03517f5c63903b9c17f5b9463cec0",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 이끌면서도 결과만 보지 않고 구성원이 어떻게 버티는지도 살피는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "방향을 이끌면서 구성원의 감당 범위를 확인하는가?",
    "jointReason": "역할에 맞는 권한과 책임을 나눔 / 자기 한계를 포함해 도움을 설계의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "목표와 지원 자원을 함께 조율",
    "risk": "배려를 이유로 팀원의 결정을 대신함",
    "goodIntentionMistake": "보호하려 어려운 과제를 혼자 떠안음",
    "twist": "맡기고 지원을 기다리는 것이 더 필요한 돌봄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 역할을 나누고 도움이 필요한 시점을 묻는 장면"
    },
    "behaviorQuestion": "방향을 이끌면서 구성원의 감당 범위를 확인하는가?",
    "conditions": [
      "공식 조율권·요청·지원 여력 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "구성원이 자율 수행을 원하면 개입이 부담일 수 있음",
    "exclusions": [
      "리더십+CARE로 좋은 상사 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C027의 결과 책임과 구성원 지원의 차이",
    "applicabilityRef": "fkr:app:complement:C025",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C026",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C026",
    "existingRuleSha256": "3a777523b20fc1362ea20e3972f1bd079f1d784f7697d0646fd2dafba6f2857d",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "사람의 반응을 읽으면서 방향을 정하는 리더로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "SOCIAL_ATTUNEMENT"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:dissent-channel",
        "definition": "이견이 들어올 통로를 만듦",
        "role": "axisA_role"
      },
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "따르는 반응과 반대할 수 있는 안전을 구별하는가?",
    "jointReason": "이견이 들어올 통로를 만듦 / 관찰한 뜻을 당사자에게 묻기의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "침묵한 사람도 의견을 낼 통로를 마련",
    "risk": "표정 읽기를 구성원의 동의로 대체",
    "goodIntentionMistake": "분위기를 맞추려 반대 의견을 완곡하게 지움",
    "twist": "분위기가 불편해져도 필요한 반론을 듣는 것이 조율",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 회의 뒤 익명 의견과 공개 결정을 나누는 장면"
    },
    "behaviorQuestion": "따르는 반응과 반대할 수 있는 안전을 구별하는가?",
    "conditions": [
      "실제 권한·평가 불이익·의견 통로 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "분위기가 좋아도 불이익 때문에 동의할 수 있음",
    "exclusions": [
      "사회 신호로 타인 의도·동의 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C058의 주목 조절보다 권한 있는 의견 수렴",
    "applicabilityRef": "fkr:app:complement:C026",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C027",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C027",
    "existingRuleSha256": "b4a0e68b929eed565380f054a1b2f2449f7b0439e1b55c3688ab78b39e06168a",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "앞에 서는 것만 좋아하는 게 아니라 결과에 대한 책임까지 지려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "DUTY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "role": "axisA_role"
      },
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "위임한 결정과 최종 책임이 맞게 나뉘었는가?",
    "jointReason": "역할에 맞는 권한과 책임을 나눔 / 책임의 경계를 구분의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "권한·역할·보고 시점을 명확히 해 책임 편중을 줄임",
    "risk": "책임을 진다는 말로 모든 결정을 회수",
    "goodIntentionMistake": "실수를 막으려 팀원의 재량을 제거",
    "twist": "지원할 책임과 대신 할 책임은 다를 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 담당자의 결정 한도와 책임자의 지원을 적는 장면"
    },
    "behaviorQuestion": "위임한 결정과 최종 책임이 맞게 나뉘었는가?",
    "conditions": [
      "공식 권한·완료 의무·지원 자원 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "책임자가 있어도 각자의 의무는 남을 수 있음",
    "exclusions": [
      "모두 떠안는 것을 좋은 리더십으로 미화",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C025는 돌봄 여력, 이 규칙은 위임·책임 구조",
    "applicabilityRef": "fkr:app:complement:C027",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C028",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C028",
    "existingRuleSha256": "d85a2b7d798670b254efa06809cdf3953741d2548874ba8b44c13f4c186328f4",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 이끌 때 해야 할 것과 하면 안 되는 것의 기준을 분명하게 정하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "BOUNDARY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "role": "axisA_role"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "제시할 방향과 지시할 수 없는 범위는 어디인가?",
    "jointReason": "공동 목적을 제안하고 조율 / 자기 담당과 타인 담당을 구분의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "공동 방향을 설명하면서 각자 권한을 남김",
    "risk": "자기 기준을 팀 전체의 허용선으로 강요",
    "goodIntentionMistake": "혼란을 막으려 의견 없는 규칙을 정함",
    "twist": "못 하는 지시를 인정하면 지킬 기준이 선명해짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 일정 방향은 제안하되 방법은 담당자가 고르는 장면"
    },
    "behaviorQuestion": "제시할 방향과 지시할 수 없는 범위는 어디인가?",
    "conditions": [
      "정식 권한·공동 합의·거절 안전 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "대표라도 개인 사생활을 지시할 권한은 없음",
    "exclusions": [
      "이끄는 사람의 기준이 항상 정당하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C012의 개인 거절선보다 타인 권한 조율",
    "applicabilityRef": "fkr:app:complement:C028",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C029",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C029",
    "existingRuleSha256": "a67933b46f115470f55e17e825a7d110cb0f1a926a0d079afb11b097b27c3c52",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 움직이기 전에 어디로 가야 하는지 다음 수까지 생각하는 리더로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "STRATEGY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "role": "axisA_role"
      },
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:route-comparison",
        "definition": "목적에 이르는 여러 경로를 비교",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "사람을 움직일 목표와 경로의 비용을 함께 설명하는가?",
    "jointReason": "공동 목적을 제안하고 조율 / 목적에 이르는 여러 경로를 비교의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "대안을 비교한 이유를 공유해 공동 선택을 돕음",
    "risk": "전략이 있다는 이유로 반대 의견을 늦게 받음",
    "goodIntentionMistake": "팀을 안심시키려 불확실한 경로를 확정처럼 제시",
    "twist": "방향을 잠정안으로 제시해도 조율은 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 두 실행 경로의 부담을 팀과 비교하는 장면"
    },
    "behaviorQuestion": "사람을 움직일 목표와 경로의 비용을 함께 설명하는가?",
    "conditions": [
      "공동 목표·대안 비용·결정권·수정 조건 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "좋은 경로라도 팀 역량과 맞지 않을 수 있음",
    "exclusions": [
      "리더십과 전략으로 미래 성공 예측",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C030은 실행 여건, 이 규칙은 경로 설명",
    "applicabilityRef": "fkr:app:complement:C029",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C030",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C030",
    "existingRuleSha256": "8690650f68209e4d6e4f65c87c826122435a4c4bd148ea941ced8c8808e0c66e",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "말로 이끄는 데서 끝나지 않고 실제 결과가 나오게 만드는 리더로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEADERSHIP",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:feasible-step",
        "definition": "현재 자원으로 가능한 단계를 고름",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "지시한 일이 현재 도구와 자원으로 가능한가?",
    "jointReason": "역할에 맞는 권한과 책임을 나눔 / 현재 자원으로 가능한 단계를 고름의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "실제 제약을 듣고 실행 가능한 단위를 맡김",
    "risk": "현실성을 이유로 개선 의견을 일찍 차단",
    "goodIntentionMistake": "도움을 주려 어려운 일을 숙련자에게만 집중",
    "twist": "못 한다는 피드백을 받아 범위를 줄이는 것도 조율",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 작업 시간과 필요한 도구를 확인 후 역할을 나누는 장면"
    },
    "behaviorQuestion": "지시한 일이 현재 도구와 자원으로 가능한가?",
    "conditions": [
      "실제 인력·권한·도구·기한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "리더가 실용적이어도 실행 자원이 없을 수 있음",
    "exclusions": [
      "조율 능력으로 성과 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C029의 전략 선택보다 현재 수행 여건",
    "applicabilityRef": "fkr:app:complement:C030",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C031",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C031",
    "existingRuleSha256": "0bc65d94d756488f05f5327d47ee80986daae1ade2cdcbd7703079403ec51867",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "그냥 잘하는 데서 끝나기보다 높은 직책에서 직접 결정하고 인정받고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STATUS_DRIVE",
        "LEADERSHIP"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STATUS_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:STATUS_DRIVE:formal-role",
        "definition": "공식 위치의 책임과 기준을 검토",
        "role": "axisA_role"
      },
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:dissent-channel",
        "definition": "이견이 들어올 통로를 만듦",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "인정받고 싶은 역할과 타인의 발언권이 공존하는가?",
    "jointReason": "공식 위치의 책임과 기준을 검토 / 이견이 들어올 통로를 만듦의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "직책의 책임을 알고 의견 수렴을 남김",
    "risk": "인정 욕구가 결정권 독점으로 바뀜",
    "goodIntentionMistake": "팀을 대표하려 타인의 공로까지 자신의 이름으로 설명",
    "twist": "덜 드러나는 조율이 더 적절한 인정 방식일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 대표 발표에 공동 기여자의 이름을 남기는 장면"
    },
    "behaviorQuestion": "인정받고 싶은 역할과 타인의 발언권이 공존하는가?",
    "conditions": [
      "실제 역할·공로·권한·평가 기준 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "직책을 원해도 지휘보다 전문 역할을 선호할 수 있음",
    "exclusions": [
      "STATUS_DRIVE로 높은 지위 획득 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C032는 성과 인정, 이 규칙은 공식 역할과 발언권",
    "applicabilityRef": "fkr:app:complement:C031",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "status",
          "researchRef": "sar:tag:status",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C032",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C032",
    "existingRuleSha256": "5a5f18a612a32291428517d9426484349150d6ae982e8bdeec5a24376665144a",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "목표를 이루는 것뿐 아니라 그 성과를 제대로 인정받는 것도 중요하게 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STATUS_DRIVE",
        "GOAL_DRIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STATUS_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:STATUS_DRIVE:recognition-target",
        "definition": "무엇을 인정받고 싶은지 명시",
        "role": "axisA_role"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "성과 목표와 인정받는 기준이 같은가?",
    "jointReason": "무엇을 인정받고 싶은지 명시 / 진행 결과와 목적의 차이를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "본인이 원하는 인정과 실제 기여 지표를 비교",
    "risk": "보이는 지표만 올리고 중요한 일을 누락",
    "goodIntentionMistake": "기여를 알리려 공동 성과를 개인 성과로 제시",
    "twist": "인정 기준을 바꾸는 선택이 목표의 의미를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 평가 항목과 실제 고객 도움을 따로 적는 장면"
    },
    "behaviorQuestion": "성과 목표와 인정받는 기준이 같은가?",
    "conditions": [
      "공개된 평가 기준·목표·공로 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "목표를 이뤄도 외부 평가가 다를 수 있음",
    "exclusions": [
      "인정 욕구+목표로 승진·명예 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C033은 전문성 형성, 이 규칙은 성과의 평가",
    "applicabilityRef": "fkr:app:complement:C032",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "status",
          "researchRef": "sar:tag:status",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C033",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C033",
    "existingRuleSha256": "4eb0b20313673b65d1360cd4312755839459a1a91ddbfc06996073799dadf327",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "높은 자리를 원하더라도 실력과 전문성을 쌓아 인정받고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STATUS_DRIVE",
        "LEARNING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STATUS_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:STATUS_DRIVE:recognition-target",
        "definition": "무엇을 인정받고 싶은지 명시",
        "role": "axisA_role"
      },
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "원하는 인정에 어떤 학습과 실제 검증이 필요한가?",
    "jointReason": "무엇을 인정받고 싶은지 명시 / 새 내용을 이해하고 익힘의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "자격 이름보다 필요한 지식·연습을 확인",
    "risk": "학습 이력을 능력이나 높은 지위와 동일시",
    "goodIntentionMistake": "신뢰를 주려 모르는 분야까지 전문가로 답함",
    "twist": "모르는 범위를 밝히는 것이 신뢰를 높일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 직무 목표에 필요한 교육과 실제 작업 평가를 나누는 장면"
    },
    "behaviorQuestion": "원하는 인정에 어떤 학습과 실제 검증이 필요한가?",
    "conditions": [
      "실제 학습 기회·평가 요건·본인 목표 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "공부해도 직책·보상이 연결되지 않을 수 있음",
    "exclusions": [
      "학습+지위 욕구로 전문 자격·성공 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C006의 이해 깊이보다 인정 기준과 학습 경로",
    "applicabilityRef": "fkr:app:complement:C033",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "status",
          "researchRef": "sar:tag:status",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C034",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C034",
    "existingRuleSha256": "325145292af50cde9b79a33db5ca217af52cdc7d99d2c8379a2739cc5d19ab35",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "경쟁자가 생기면 위축되기보다 목표를 더 세게 붙드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "COMPETITION",
        "GOAL_DRIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "COMPETITION",
        "direction": 1,
        "facetRef": "sar:facet:COMPETITION:self-comparison",
        "definition": "지난 수행과 현재 수행을 비교",
        "role": "axisA_role"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "경쟁의 기준이 자기 목표의 진척에 도움이 되는가?",
    "jointReason": "지난 수행과 현재 수행을 비교 / 진행 결과와 목적의 차이를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "비교에서 얻은 정보를 실제 연습 목표로 옮김",
    "risk": "남의 성과를 보며 목표를 끝없이 높임",
    "goodIntentionMistake": "동기를 돕고자 불공정한 비교를 강요",
    "twist": "비교를 중단하면 자신의 진척이 더 잘 보일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 타인 순위와 본인 지난달 결과를 나눠 보는 장면"
    },
    "behaviorQuestion": "경쟁의 기준이 자기 목표의 진척에 도움이 되는가?",
    "conditions": [
      "동등한 조건·자기 목표·평가 공정성 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "경쟁이 오히려 목표 수행을 방해할 수 있음",
    "exclusions": [
      "경쟁 자극으로 성공·우월성 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C035의 주도권보다 목표의 비교 기준",
    "applicabilityRef": "fkr:app:complement:C034",
    "legacyTagReview": {
      "relatedTags": [],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C035",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C035",
    "existingRuleSha256": "4a8501c0b244599440bb9c644f75a0a6659f0d16666ee6f6988e88b8a7e790e0",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "경쟁이 있는 상황에서 뒤로 물러나기보다 직접 앞에 서려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "COMPETITION",
        "LEADERSHIP"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "COMPETITION",
        "direction": 1,
        "facetRef": "sar:facet:COMPETITION:cooperative-challenge",
        "definition": "공동 과제의 외부 기준에 도전",
        "role": "axisA_role"
      },
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "경쟁 중에도 공동 목표와 공로를 나눌 수 있는가?",
    "jointReason": "공동 과제의 외부 기준에 도전 / 역할에 맞는 권한과 책임을 나눔의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "도전 과제를 팀의 학습과 역할 배분으로 사용",
    "risk": "개인 승리를 위해 팀원의 정보와 기회를 제한",
    "goodIntentionMistake": "팀을 이기게 하려 다른 집단을 적대시",
    "twist": "남에게 주도권을 넘기는 것이 공동 도전에 유리할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 팀 대회에서 대표와 실무 공로를 나눠 적는 장면"
    },
    "behaviorQuestion": "경쟁 중에도 공동 목표와 공로를 나눌 수 있는가?",
    "conditions": [
      "공정한 경쟁·공동 목표·권한·자발적 참여 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "경쟁자가 없어도 조율은 필요할 수 있음",
    "exclusions": [
      "경쟁성이 강하면 타고난 지도자라고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C034는 자기 진척, 이 규칙은 경쟁 속 권한·공동 기여",
    "applicabilityRef": "fkr:app:complement:C035",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C036",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C036",
    "existingRuleSha256": "b0fcd61b74f1caa4a3442c4ee5fd206c6e9f47246c95efb67d52d39c596f7ce4",
    "group": "LEADERSHIP_STATUS",
    "researchRelation": "task_complement",
    "originalMeaning": "맡은 일을 끝내는 것뿐 아니라 틀리지 않게 제대로 끝내려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DUTY",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "맡은 일을 끝낼 정확한 수준과 기한은 무엇인가?",
    "jointReason": "합의한 담당을 이행 / 최종 결과물의 누락을 점검의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "합의된 품질로 마무리하고 인수인계를 남김",
    "risk": "완벽을 이유로 완료를 계속 연장",
    "goodIntentionMistake": "믿을 만하게 하려 요청 밖 수정까지 떠안음",
    "twist": "확인할 수준을 줄여도 책임은 더 명확해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 검수 범위와 완료 확인자를 정하는 장면"
    },
    "behaviorQuestion": "맡은 일을 끝낼 정확한 수준과 기한은 무엇인가?",
    "conditions": [
      "담당 범위·품질·마감·검수 권한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "책임을 다했어도 모든 오류를 없앨 수 없음",
    "exclusions": [
      "DUTY+PRECISION이면 실수 없다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C008은 계획 경로, 이 규칙은 맡은 산출물 완료",
    "applicabilityRef": "fkr:app:complement:C036",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C037",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C037",
    "existingRuleSha256": "9b38951caba60ab4a5f329348d24b3a21e8a4cfb624fe8111a6ee172d03ce514",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈이 들어오는지만 보지 않고 실제로 얼마나 남는지 계산하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:outcome-check",
        "definition": "실행 뒤 남은 결과를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "들어온 금액과 실제 남은 자원은 다른가?",
    "jointReason": "자원 유입과 소모를 구분 / 실행 뒤 남은 결과를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "총액에서 유지비·시간 비용을 나눠 현실 결과 확인",
    "risk": "측정 가능한 돈만 남는 가치로 계산",
    "goodIntentionMistake": "손실을 막으려 꼭 필요한 돌봄 지출까지 억제",
    "twist": "남지 않는 비용 중에도 유지에 필요한 항목이 있을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 매출과 재료비·노동 시간을 따로 기록하는 장면"
    },
    "behaviorQuestion": "들어온 금액과 실제 남은 자원은 다른가?",
    "conditions": [
      "실제 흐름 자료·비용 정의·소유권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "큰 수입이어도 남는 여력이 적을 수 있음",
    "exclusions": [
      "자원 감각으로 수익·부 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C038의 비축과 실제 잔여 흐름 구분",
    "applicabilityRef": "fkr:app:complement:C037",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C038",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C038",
    "existingRuleSha256": "198fca7f70ba18ded8e952318f09ceaf54b698e08503332496b895820b144070",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈을 버는 것만큼 지키고 쌓아두는 것도 중요하게 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "STABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "role": "axisA_role"
      },
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:minimum-security",
        "definition": "유지할 최소 생활 조건을 정함",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "보유 자원이 어떤 기본 안전을 위한 것인가?",
    "jointReason": "예비 여력을 남김 / 유지할 최소 생활 조건을 정함의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "비축의 목적과 사용할 조건을 정함",
    "risk": "모으는 것 자체가 목표가 되어 필요한 사용도 못함",
    "goodIntentionMistake": "안전하게 해주려 공동 자원을 한 사람이 통제",
    "twist": "비축을 쓰는 때를 정하는 것이 기반을 지키는 행동",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 비상금의 사용 조건과 개인 사용권을 합의하는 장면"
    },
    "behaviorQuestion": "보유 자원이 어떤 기본 안전을 위한 것인가?",
    "conditions": [
      "실제 여력·소유·필수 생활비·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "비축이 적어도 다른 지원 기반이 있을 수 있음",
    "exclusions": [
      "두 축으로 가난·재산 규모 판단",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C037은 흐름, 이 규칙은 비축 목적·안전 기반",
    "applicabilityRef": "fkr:app:complement:C038",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C039",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C039",
    "existingRuleSha256": "072ee534ecbcf0a3bcb984e082440b1b0f01ef16cbe457f222acecc1f88c48af",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "새로운 기회를 볼 때 재미뿐 아니라 실제 돈이 될 수 있는지도 함께 보는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "OPPORTUNITY_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "axisA_role"
      },
      {
        "axis": "OPPORTUNITY_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:OPPORTUNITY_SENSE:screening",
        "definition": "발견한 선택의 실행 조건을 검토",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "기회에 쓸 자원과 확인할 수요가 맞는가?",
    "jointReason": "중요한 목적에 자원을 배정 / 발견한 선택의 실행 조건을 검토의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "매력적인 제안의 실제 비용·수요를 분리 검토",
    "risk": "돈이 될 것 같다는 기대를 자원 확보로 착각",
    "goodIntentionMistake": "좋은 기회를 놓치지 않으려 공동 자원을 먼저 약속",
    "twist": "기회를 거절하는 것이 다음 선택의 여력을 남길 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 거래 제안의 예상 수익과 확정 비용을 구분하는 장면"
    },
    "behaviorQuestion": "기회에 쓸 자원과 확인할 수요가 맞는가?",
    "conditions": [
      "실제 제안·수요 자료·가용 자원·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "기회가 보여도 실행할 돈이나 시간이 없을 수 있음",
    "exclusions": [
      "기회 감각+자원 감각으로 재물 증가 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C043의 시장 확대보다 현재 자원 배분",
    "applicabilityRef": "fkr:app:complement:C039",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C040",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C040",
    "existingRuleSha256": "6d335273d980c371285304c0ff47254ee60fa0177f1beb0d7c3b02ca971e551e",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈도 중요하지만 의미 없는 일을 하면서 돈만 버는 것으로는 오래 만족하기 어려운 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "MEANING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "axisA_role"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "자원 배분의 이유가 본인 가치와 일치하는가?",
    "jointReason": "중요한 목적에 자원을 배정 / 자기에게 중요한 이유를 말함의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "보상과 중요하게 여기는 이유를 따로 비교",
    "risk": "의미를 이유로 실제 생계 제약을 무시",
    "goodIntentionMistake": "가치 있게 살도록 돕고자 다른 사람의 지출을 평가",
    "twist": "생활을 유지하는 평범한 선택도 중요한 가치일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 의미 있는 일의 보상과 필수 생활비를 나누는 장면"
    },
    "behaviorQuestion": "자원 배분의 이유가 본인 가치와 일치하는가?",
    "conditions": [
      "본인 가치 진술·실제 여력·선택권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "돈을 우선하는 시기도 가치 부재는 아님",
    "exclusions": [
      "의미 추구로 도덕적 우월·행복 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C045는 실행 가능성, 이 규칙은 자원 배분의 가치",
    "applicabilityRef": "fkr:app:complement:C040",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C041",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C041",
    "existingRuleSha256": "c4ca6996dfcee86de0e131a7561a5ace647452bd63ff9b32ee91fa45d0dbb157",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈을 많이 받아도 자기 시간과 선택권을 너무 많이 잃으면 좋은 거래라고 느끼지 않는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "AUTONOMY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "axisA_role"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "보상으로 얻는 것과 잃는 선택권을 구별하는가?",
    "jointReason": "중요한 목적에 자원을 배정 / 자신에게 속한 선택을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "금액·시간·재량을 다른 조건으로 협상",
    "risk": "선택권을 지키려 공동 책임도 모두 거절",
    "goodIntentionMistake": "유리한 계약을 주려 상대의 사생활까지 대가로 요구",
    "twist": "낮은 금액이라도 실제 선택권이 더 남을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 단가와 독점 조건·근무 재량을 비교하는 장면"
    },
    "behaviorQuestion": "보상으로 얻는 것과 잃는 선택권을 구별하는가?",
    "conditions": [
      "실제 계약·소유권·영향받는 당사자 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "높은 보상과 충분한 자율이 함께 가능할 수 있음",
    "exclusions": [
      "자율성이 높으면 돈보다 자유를 항상 택한다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C094는 실행 재량, 이 규칙은 자원과 선택권 교환",
    "applicabilityRef": "fkr:app:complement:C041",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C042",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C042",
    "existingRuleSha256": "e4c043723d431aebd2584670292de09315691adaae690f79045233926d4f940f",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "원하는 수입이나 재산 목표가 생기면 구체적인 목표처럼 관리하고 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RESOURCE_SENSE",
        "GOAL_DRIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "role": "axisA_role"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "원하는 수입 목표를 실제 흐름으로 확인하는가?",
    "jointReason": "자원 유입과 소모를 구분 / 진행 결과와 목적의 차이를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "목표 금액과 비용·기간을 함께 기록",
    "risk": "목표 달성만 보며 지속 비용을 숨김",
    "goodIntentionMistake": "동기를 높이려 불확실한 수익을 계획에 확정 반영",
    "twist": "목표를 낮춰도 남는 몫과 시간은 커질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 월 수입 목표와 실제 순수입 차이를 보는 장면"
    },
    "behaviorQuestion": "원하는 수입 목표를 실제 흐름으로 확인하는가?",
    "conditions": [
      "실제 기록·목표 기간·가정·생활 한도 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "목표 수입에 못 미쳐도 개인 실패는 아님",
    "exclusions": [
      "목표 지향으로 투자 성과 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C015의 일반 효용과 금전 흐름의 차이",
    "applicabilityRef": "fkr:app:complement:C042",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C043",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C043",
    "existingRuleSha256": "2b0d4e95dea75d2daa3df2ec41b9a7f3f604fa2c964ffbdefbd9e1a0212e79c2",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "새로운 사람과 시장을 만나면서 더 큰 기회를 찾고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "OPPORTUNITY_SENSE",
        "EXPANSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "OPPORTUNITY_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:OPPORTUNITY_SENSE:option-discovery",
        "definition": "새 연결에서 가능한 선택을 찾음",
        "role": "axisA_role"
      },
      {
        "axis": "EXPANSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPANSION:network-reach",
        "definition": "연결할 사람·영역을 확대",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "새 시장과 사람을 만날 준비·유지 여력이 있는가?",
    "jointReason": "새 연결에서 가능한 선택을 찾음 / 연결할 사람·영역을 확대의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기회를 넓히기 전 기존 약속과 대응량을 확인",
    "risk": "네트워크 수를 실제 수요로 착각",
    "goodIntentionMistake": "서로 돕자며 상대 인맥의 소개를 당연하게 요구",
    "twist": "확장을 멈추고 기존 관계를 지키는 것이 다음 기회를 남길 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 고객 제안과 기존 고객 대응량을 비교하는 장면"
    },
    "behaviorQuestion": "새 시장과 사람을 만날 준비·유지 여력이 있는가?",
    "conditions": [
      "실제 수요·소개 동의·유지비·담당 범위 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "새 사람을 많이 만나도 거래가 생기지 않을 수 있음",
    "exclusions": [
      "기회+확장으로 매출 성장 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C039는 단일 제안의 배분, 이 규칙은 접점 확대",
    "applicabilityRef": "fkr:app:complement:C043",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C044",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C044",
    "existingRuleSha256": "c5d125b5dbcbe413286d27610655bc534630f96b70b775d2b394d2fa075b7e34",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "기회가 보이면 처음 정한 방식에 묶이지 않고 방법을 바꿀 줄 아는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "OPPORTUNITY_SENSE",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "OPPORTUNITY_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:OPPORTUNITY_SENSE:decline-option",
        "definition": "지금 하지 않을 기회를 선택",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:method-revision",
        "definition": "목적 안에서 방법을 바꿈",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "기회를 살릴 조정과 거절할 조건은 무엇인가?",
    "jointReason": "지금 하지 않을 기회를 선택 / 목적 안에서 방법을 바꿈의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "방법 변경 비용까지 보고 제안을 선택",
    "risk": "모든 기회에 맞춰 계획을 계속 바꿈",
    "goodIntentionMistake": "유연하게 돕고자 기존 고객 약속을 일방 변경",
    "twist": "안 맞는 기회를 거절해도 적응 능력은 남음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 제안에 맞출 변경 범위와 포기 조건을 적는 장면"
    },
    "behaviorQuestion": "기회를 살릴 조정과 거절할 조건은 무엇인가?",
    "conditions": [
      "실제 제안·변경 재량·기존 약속·비용 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "바꾸지 않는 편이 더 적절한 기회도 있음",
    "exclusions": [
      "적응하면 모든 기회가 유리하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C019는 기존 목표 경로, 이 규칙은 새 선택 수용·거절",
    "applicabilityRef": "fkr:app:complement:C044",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C045",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C045",
    "existingRuleSha256": "170fb40ae9cef83f39b6664c6ab9ffd4238997c90a8b17e2a8ada40bdab5cfe6",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "의미만 있는 일도, 돈만 남는 일도 아닌 실제 가치가 있는 일을 하고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRACTICALITY",
        "MEANING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:feasible-step",
        "definition": "현재 자원으로 가능한 단계를 고름",
        "role": "axisA_role"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-practice",
        "definition": "중요한 가치를 구체적 선택으로 옮김",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "중요한 가치를 현재 가능한 행동으로 옮길 수 있는가?",
    "jointReason": "현재 자원으로 가능한 단계를 고름 / 중요한 가치를 구체적 선택으로 옮김의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "추상적 이유를 작은 실행과 실제 비용으로 확인",
    "risk": "실용성을 핑계로 다른 가치를 무시",
    "goodIntentionMistake": "뜻 있는 일을 돕고자 여력 밖 희생을 요구",
    "twist": "작고 평범한 실행이 큰 명분보다 가치를 잘 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 지역 활동 참여 시간을 실제 일정 안에 넣는 장면"
    },
    "behaviorQuestion": "중요한 가치를 현재 가능한 행동으로 옮길 수 있는가?",
    "conditions": [
      "본인 가치·실제 자원·자발적 선택 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "중요해도 지금 실천할 여력이 없을 수 있음",
    "exclusions": [
      "실행 못 하면 가치가 없다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C040의 자원 배분 이유보다 가치의 작은 실천",
    "applicabilityRef": "fkr:app:complement:C045",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C046",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C046",
    "existingRuleSha256": "7b2e015ac180565995330af624719decff7b40906e097b41ec6d9fe8d40a7313",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈 문제에서는 기회보다 손해와 위험을 먼저 확인한 뒤 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RISK_STYLE",
        "RESOURCE_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RISK_STYLE",
        "direction": -1,
        "facetRef": "sar:facet:RISK_STYLE:loss-limit",
        "definition": "감당 가능한 손실 범위를 정함",
        "role": "axisA_role"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "현재 감당할 손실과 실제 흐름을 아는가?",
    "jointReason": "감당 가능한 손실 범위를 정함 / 자원 유입과 소모를 구분의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기회를 보기 전 생계·공동 자산 한도를 확인",
    "risk": "모든 손실 가능성을 제거하려 필요한 선택도 미룸",
    "goodIntentionMistake": "안전을 지키려 다른 사람의 사용권까지 통제",
    "twist": "작게 되돌릴 시험이 전체 위험을 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 지출 실험의 최대 손실과 중단일을 정하는 장면"
    },
    "behaviorQuestion": "현재 감당할 손실과 실제 흐름을 아는가?",
    "conditions": [
      "실제 재무 자료·소유·위험 한도·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "신중한 사람이 위험한 결정을 할 수도 있음",
    "exclusions": [
      "신중함+자원 감각으로 손실 없음",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C092는 기회 발견, 이 규칙은 실제 흐름·손실 한도",
    "applicabilityRef": "fkr:app:complement:C046",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C047",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C047",
    "existingRuleSha256": "1e00baed44ee914f80f4ed6a4a427aee4aeb96bda3c73d8154867d08cf5236d7",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "돈과 시간을 그때그때 쓰기보다 앞으로 어디에 써야 더 남는지 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRATEGY",
        "RESOURCE_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:sequence-design",
        "definition": "의존 관계에 맞게 순서를 배치",
        "role": "axisA_role"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "언제 어떤 자원을 써야 의존 작업이 이어지는가?",
    "jointReason": "의존 관계에 맞게 순서를 배치 / 중요한 목적에 자원을 배정의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "지금 쓸 돈·시간과 나중에 필요한 몫을 나눔",
    "risk": "장기 효율을 이유로 현재 필요한 사용을 계속 미룸",
    "goodIntentionMistake": "최적 배분을 돕고자 타인의 시간을 자유 자원으로 계산",
    "twist": "일부 여유를 남기는 것이 계획의 효율을 높일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 장비 구매일과 학습 시간을 같은 일정에 배분하는 장면"
    },
    "behaviorQuestion": "언제 어떤 자원을 써야 의존 작업이 이어지는가?",
    "conditions": [
      "확정 자원·의존 작업·변경 조건·소유권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "최선의 계획도 외부 가격 변동에 달라질 수 있음",
    "exclusions": [
      "전략+자원으로 재산 증가 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C007의 패턴 분기보다 실제 사용 순서",
    "applicabilityRef": "fkr:app:complement:C047",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C048",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C048",
    "existingRuleSha256": "9652dbb6536f4a3c48d7de5db15dc7b390e7a9af60005c53cf18c7e8a9bbefc3",
    "group": "MONEY_REALITY",
    "researchRelation": "task_complement",
    "originalMeaning": "더 크게 성장하고 싶어 하면서도 실제로 감당 가능한지 계산하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "money",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "EXPANSION",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "EXPANSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPANSION:capacity-check",
        "definition": "확대 전에 운영 여력을 점검",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:feasible-step",
        "definition": "현재 자원으로 가능한 단계를 고름",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "확대할 범위가 실제 운영 가능한 단위인가?",
    "jointReason": "확대 전에 운영 여력을 점검 / 현재 자원으로 가능한 단계를 고름의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "새 범위를 시험할 최소 자원과 유지 비용을 확인",
    "risk": "현실성이 있다는 이유로 확장의 피해를 과소평가",
    "goodIntentionMistake": "성장을 돕고자 쉬운 부분부터 벌리고 어려운 유지 책임을 남김",
    "twist": "규모를 줄여도 서비스를 더 오래 제공할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 지점 대신 제한 운영으로 수요를 확인하는 장면"
    },
    "behaviorQuestion": "확대할 범위가 실제 운영 가능한 단위인가?",
    "conditions": [
      "실제 운영 자원·작은 시험·유지 책임 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "가능한 확장도 본인이 원하지 않을 수 있음",
    "exclusions": [
      "실용적인 확장이라 실패하지 않는다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C016의 목표 선택과 운영 단위의 차이",
    "applicabilityRef": "fkr:app:complement:C048",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C049",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C049",
    "existingRuleSha256": "b4a7220ad61e88eb8e8f7142585af35a2dfcbf9d89e7a878f67bc184593a5c51",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "사람의 기분 변화를 빨리 알아차리고 실제로 챙기려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "알아차린 신호와 상대가 원하는 도움을 확인했는가?",
    "jointReason": "관찰한 뜻을 당사자에게 묻기 / 상대가 원하는 도움을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "표정·말의 변화를 보고 도움 방식을 직접 물음",
    "risk": "신호를 읽었다는 확신으로 상대 요구를 대신 정함",
    "goodIntentionMistake": "불편을 없애주려 원치 않는 개입을 시작",
    "twist": "아무것도 하지 않고 기다리는 것이 맞는 지원일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 말수가 준 동료에게 도움과 혼자 있을 시간 중 필요한 것을 묻는 장면"
    },
    "behaviorQuestion": "알아차린 신호와 상대가 원하는 도움을 확인했는가?",
    "conditions": [
      "실제 관찰·요청·동의·추가 설명 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "불편해 보여도 도움을 원하지 않을 수 있음",
    "exclusions": [
      "눈치가 좋으므로 타인 마음을 안다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C001은 오류 검수, 이 규칙은 신호와 지원 요청",
    "applicabilityRef": "fkr:app:complement:C049",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C050",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C050",
    "existingRuleSha256": "10982a48c233da3b2bae876c2e627dd520274f367a9d987969ed89fbe8e401fd",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "혼자 말하기보다 상대 반응을 보면서 말과 분위기를 조절하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "EXPRESSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "role": "axisA_role"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "상대 반응을 보고 전달한 뜻을 확인하는가?",
    "jointReason": "상황에 맞게 전달·참여를 조절 / 표현이 어떻게 전달됐는지 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "말하는 방식과 이해 여부를 함께 조정",
    "risk": "분위기에 맞추느라 핵심 요청이 사라짐",
    "goodIntentionMistake": "공감대를 만들려 상대 의견까지 대신 말함",
    "twist": "질문을 기다리는 침묵이 전달을 더 명료하게 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 회의 설명 뒤 상대 말로 다음 행동을 확인하는 장면"
    },
    "behaviorQuestion": "상대 반응을 보고 전달한 뜻을 확인하는가?",
    "conditions": [
      "실제 청자·의견 통로·내용·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "좋은 분위기여도 이해하지 못했을 수 있음",
    "exclusions": [
      "반응이 좋으니 설득·동의 성공이라고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C058의 존재감보다 전달·수신의 맞춤",
    "applicabilityRef": "fkr:app:complement:C050",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C051",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C051",
    "existingRuleSha256": "8efee0eb5c80008c9bac842cfe5fd75abbcbacd797165d8b5a7dddcda985b33a",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "말의 내용뿐 아니라 작은 표정이나 말투 변화까지 빨리 알아차리는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "definition": "말·표정·참여의 변화를 관찰",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "작은 반응 차이에 같은 판단 기준을 적용할 수 있는가?",
    "jointReason": "말·표정·참여의 변화를 관찰 / 상황 사이 기준 적용의 일관성을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "관찰한 말·행동의 차이만 확인 질문으로 제시",
    "risk": "미세한 신호를 거짓이나 숨은 의도의 증거로 삼음",
    "goodIntentionMistake": "정확히 이해하려 표정과 감정을 과도하게 분석",
    "twist": "뜻을 모른다고 인정하는 것이 더 정확한 판단일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 말과 행동이 다른 요청의 실제 조건을 묻는 장면"
    },
    "behaviorQuestion": "작은 반응 차이에 같은 판단 기준을 적용할 수 있는가?",
    "conditions": [
      "관찰 사실·맥락·대안 설명·확인 가능성 보존",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "같은 표정도 피로·환경 때문에 다르게 나타날 수 있음",
    "exclusions": [
      "PRECISION과 신호 관찰로 진심 탐지 승인",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C003은 사건 반복, 이 규칙은 사회적 관찰의 판단 한계",
    "applicabilityRef": "fkr:app:complement:C051",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C052",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C052",
    "existingRuleSha256": "2503299148ec993264b4f68b1a18ad342a476a4cab5457e35654e8717b44e96a",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "사람 기분은 잘 알아차리지만 중요한 기준까지 상대에게 맞추지는 않는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "BOUNDARY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "role": "axisA_role"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:refusal",
        "definition": "받지 않을 요청을 명시",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "상대의 기분을 고려해도 거절권이 남는가?",
    "jointReason": "상황에 맞게 전달·참여를 조절 / 받지 않을 요청을 명시의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "불편을 알아차리면서 가능한 요청 범위를 설명",
    "risk": "기분을 맞추려 경계를 계속 바꿈",
    "goodIntentionMistake": "상처를 피하려 분명한 거절 대신 모호한 약속을 남김",
    "twist": "상대가 실망해도 명확한 한계가 관계의 예측을 돕는 경우가 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 추가 부탁에 가능한 부분과 불가능한 부분을 나누는 장면"
    },
    "behaviorQuestion": "상대의 기분을 고려해도 거절권이 남는가?",
    "conditions": [
      "실제 의무·거절 안전·권력 차이 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "상대 반응이 불편해도 요청은 정당하게 거절 가능",
    "exclusions": [
      "거절하지 않으면 배려 깊다고 평가",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C053은 지원 지속, 이 규칙은 반응 조정과 거절",
    "applicabilityRef": "fkr:app:complement:C052",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C053",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C053",
    "existingRuleSha256": "dfe49da251c4460a535873dbbde110ab0394cafc2e015ad4569f0a9ed962fda5",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 잘 챙기면서도 어디까지가 자기 책임인지는 구분하려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CARE",
        "BOUNDARY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "role": "axisA_role"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "제공할 도움과 실제 맡은 책임을 구분하는가?",
    "jointReason": "자기 한계를 포함해 도움을 설계 / 자기 담당과 타인 담당을 구분의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "원하는 지원과 감당 한도를 함께 알림",
    "risk": "도움을 준 뒤 타인의 선택과 결과까지 책임지려 함",
    "goodIntentionMistake": "잘 챙기려 자기 휴식과 공동 역할을 계속 희생",
    "twist": "한계를 먼저 말하면 도움의 지속 가능성이 높아질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 주간 도움 시간과 상대가 맡을 일을 합의하는 장면"
    },
    "behaviorQuestion": "제공할 도움과 실제 맡은 책임을 구분하는가?",
    "conditions": [
      "실제 요청·역할·여력·보호 의무 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "명확한 경계가 있어도 도움을 지속할 여력은 없을 수 있음",
    "exclusions": [
      "경계를 말하는 사람을 무정하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C077의 선택권보다 제공 노동의 한도",
    "applicabilityRef": "fkr:app:complement:C053",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C054",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C054",
    "existingRuleSha256": "a7ae70d058ca45a61f931fdb176ac262bd39257d56448e0a0af4abb9faca5b8a",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "솔직하게 말하면서도 상대를 상처 주는 게 목적은 아닌 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CARE",
        "COMMUNICATION_STYLE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:practical-support",
        "definition": "동의한 구체적 부담을 덜어줌",
        "role": "axisA_role"
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "필요한 지원을 솔직히 말하되 선택권을 남기는가?",
    "jointReason": "동의한 구체적 부담을 덜어줌 / 원하는 행동을 명시의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "도움의 목적과 구체적 요청을 명료하게 전달",
    "risk": "좋은 의도가 직설의 상처를 면책한다고 여김",
    "goodIntentionMistake": "도와주려 상대 동의 전에 해결책을 강하게 권함",
    "twist": "분명한 말 뒤 선택을 기다리는 것이 더 유용할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 오류 수정 방법을 제안하고 상대가 고르게 하는 장면"
    },
    "behaviorQuestion": "필요한 지원을 솔직히 말하되 선택권을 남기는가?",
    "conditions": [
      "실제 지원 필요·동의·말의 영향·권한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "솔직한 제안도 상대에게 필요 없을 수 있음",
    "exclusions": [
      "CARE가 있으니 직설은 항상 좋은 조언이라고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C055는 완곡 전달의 모호성, 이 규칙은 분명한 요청",
    "applicabilityRef": "fkr:app:complement:C054",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C055",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C055",
    "existingRuleSha256": "9c24b58b6cbe92ab5bd5ed2c3305f30fdf34a0cb17142b61be72584c0554e153",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "하고 싶은 말이 있어도 상대가 받아들이기 쉬운 방식으로 부드럽게 말하려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CARE",
        "COMMUNICATION_STYLE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:respectful-nonintervention",
        "definition": "돕지 않을 선택을 존중",
        "role": "axisA_role"
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "direction": -1,
        "facetRef": "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "definition": "맥락과 관계를 고려해 전달",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "부드럽게 전하는 말에도 필요한 요청이 남는가?",
    "jointReason": "돕지 않을 선택을 존중 / 맥락과 관계를 고려해 전달의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "민감한 주제를 선택 가능한 말로 알림",
    "risk": "배려 때문에 핵심 요청·거절이 알아듣기 어렵게 됨",
    "goodIntentionMistake": "상처를 피하려 실제 동의하지 않은 부탁을 수락",
    "twist": "말을 줄이기보다 핵심을 부드럽게 명시하는 선택이 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 조용한 대화에서 도움을 사양하는 이유와 한도를 알리는 장면"
    },
    "behaviorQuestion": "부드럽게 전하는 말에도 필요한 요청이 남는가?",
    "conditions": [
      "요청 내용·안전한 대화 환경·실제 동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "완곡 표현이 편한 관계에서도 긴급 요청은 명료해야 함",
    "exclusions": [
      "음의 의사소통 방향을 소극·무능으로 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C054와 방향이 다르며 배려의 크기 차이는 아님",
    "applicabilityRef": "fkr:app:complement:C055",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C056",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C056",
    "existingRuleSha256": "30ad499f203274717625b4eaee60d27db132b07d704dba927fe8091eb0bdd236",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "말하고 표현할 때 사람 눈에 잘 들어오고 존재감이 살아나는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "EXPRESSION",
        "CHARISMA"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "role": "axisA_role"
      },
      {
        "axis": "CHARISMA",
        "direction": 1,
        "facetRef": "sar:facet:CHARISMA:memorable-signal",
        "definition": "기억에 남는 표현·행동을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "표현으로 주목받을 때 어떤 내용이 기억되는가?",
    "jointReason": "드러낼 범위와 대상을 고름 / 기억에 남는 표현·행동을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "핵심 신호와 공개 범위를 골라 전달",
    "risk": "주목을 지속하려 과장·과다 공개로 기울음",
    "goodIntentionMistake": "분위기를 돕고자 공동 기여를 자신의 이야기로 압축",
    "twist": "덜 말하고 하나를 분명히 보여주는 것도 존재감을 만들 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 시연에서 핵심 결과 하나와 팀 기여를 소개하는 장면"
    },
    "behaviorQuestion": "표현으로 주목받을 때 어떤 내용이 기억되는가?",
    "conditions": [
      "실제 청자·공개 동의·전달 내용 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "표현이 많아도 기억이나 호감은 생기지 않을 수 있음",
    "exclusions": [
      "존재감으로 인기·설득 성공 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C058은 청자의 반응 조율, 이 규칙은 기억될 표현",
    "applicabilityRef": "fkr:app:complement:C056",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C057",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C057",
    "existingRuleSha256": "f706854c91f3d4ace6bb045fdadb0dd1c9cacee4e30d63f9e7d0a8ee64df1490",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "그냥 많이 말하기보다 자기에게 중요한 생각을 사람들에게 제대로 전하고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "EXPRESSION",
        "MEANING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "role": "axisA_role"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "중요한 이유를 청자가 이해할 통로로 전하는가?",
    "jointReason": "뜻에 맞는 말·글·행동을 선택 / 자기에게 중요한 이유를 말함의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "개인 가치를 강요하지 않고 설명할 매체를 선택",
    "risk": "의미 있는 말이라는 이유로 청자 부담을 무시",
    "goodIntentionMistake": "진심을 알려주려 긴 설명을 반복",
    "twist": "짧게 전하고 다른 가치를 듣는 것이 의미를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 지원 활동의 이유를 짧은 글로 알리고 참여는 선택하게 하는 장면"
    },
    "behaviorQuestion": "중요한 이유를 청자가 이해할 통로로 전하는가?",
    "conditions": [
      "본인 가치·청자의 관심·공개·참여 동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "중요한 가치도 지금 청자에게 무관할 수 있음",
    "exclusions": [
      "표현된 가치로 도덕적 우월 판단",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C063은 결과물 제작, 이 규칙은 가치 전달",
    "applicabilityRef": "fkr:app:complement:C057",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C058",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C058",
    "existingRuleSha256": "977dd4721cf0fce7b0e2947f2f0bb36fb4ee7e7730ddf2c5fb7915d6e8ea28b4",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "사람 눈에 잘 들어오면서도 그 자리 분위기와 반응을 같이 읽는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CHARISMA",
        "SOCIAL_ATTUNEMENT"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CHARISMA",
        "direction": 1,
        "facetRef": "sar:facet:CHARISMA:situated-attention",
        "definition": "특정 장면에서 타인이 주목한 현상",
        "role": "axisA_role"
      },
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "주목받는 사람에게 보인 반응이 실제 동의인가?",
    "jointReason": "특정 장면에서 타인이 주목한 현상 / 관찰한 뜻을 당사자에게 묻기의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "존재감을 활용하되 다른 사람이 말할 공간을 남김",
    "risk": "긍정 반응을 찬성으로 읽고 이견을 건너뜀",
    "goodIntentionMistake": "분위기를 이끌려 조용한 사람의 의사를 대신 표현",
    "twist": "주목을 나눠 주면 대화의 정보가 늘 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 발표자가 질문 시간을 주고 익명 의견도 받는 장면"
    },
    "behaviorQuestion": "주목받는 사람에게 보인 반응이 실제 동의인가?",
    "conditions": [
      "실제 청자·권력 차이·발언 안전·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "유명한 사람 앞에서는 불편해도 웃을 수 있음",
    "exclusions": [
      "CHARISMA로 상대 마음·동의 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C026은 공식 조율권, 이 규칙은 상황적 주목",
    "applicabilityRef": "fkr:app:complement:C058",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C059",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C059",
    "existingRuleSha256": "a181c0f8cd5fd407fdbf8d40dcb421ad50d8b907acf1a4498a4679f107a9d2d7",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "사람과 함께하는 걸 좋아해도 중요한 선택은 자기 기준으로 하고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RELATION_STYLE",
        "AUTONOMY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "role": "axisA_role"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "함께하기로 한 활동 안에서 각자의 선택이 남는가?",
    "jointReason": "함께할 활동의 참여 방식을 선택 / 자신에게 속한 선택을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "공동 참여와 개인 방법을 따로 합의",
    "risk": "함께할 마음을 모든 일정 공유 의무로 확대",
    "goodIntentionMistake": "소속감을 주려 다른 선택을 배신으로 읽음",
    "twist": "개인 선택을 보장하면 공동 참여도 편해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 여행 중 함께할 시간과 각자 갈 곳을 정하는 장면"
    },
    "behaviorQuestion": "함께하기로 한 활동 안에서 각자의 선택이 남는가?",
    "conditions": [
      "자발적 참여·공동 영향·개인 권한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "친하게 지내도 모든 활동을 함께 원하지 않을 수 있음",
    "exclusions": [
      "함께 연결 방향이면 의존적이라고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C077은 돌봄과 자율, 이 규칙은 참여와 선택",
    "applicabilityRef": "fkr:app:complement:C059",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C060",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C060",
    "existingRuleSha256": "662ccda8ae65ff0f75a3b0974979b937c17c60b38a971495d262841f7c608f00",
    "group": "SOCIAL_COMMUNICATION",
    "researchRelation": "task_complement",
    "originalMeaning": "틀린 부분이나 핵심이 보이면 돌려 말하기보다 정확하게 짚는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "social",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "COMMUNICATION_STYLE",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "COMMUNICATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "분명한 지적이 사실·해석·요청을 구분하는가?",
    "jointReason": "원하는 행동을 명시 / 설명의 전제와 결론 사이 모순 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "모순의 위치와 수정할 기준을 짧게 설명",
    "risk": "표현의 명료함을 판단의 정확성으로 착각",
    "goodIntentionMistake": "오해를 줄이려 상대 설명을 끝까지 듣지 않음",
    "twist": "먼저 확인 질문을 하는 것이 더 정확한 직설일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 제안의 모순을 묻고 빠진 전제를 확인하는 장면"
    },
    "behaviorQuestion": "분명한 지적이 사실·해석·요청을 구분하는가?",
    "conditions": [
      "실제 주장·검증 기준·반론 안전 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "말은 분명해도 전제가 틀릴 수 있음",
    "exclusions": [
      "직설적인 사람의 지적이 항상 맞다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C054의 도움 제공보다 주장 검증·요청의 분리",
    "applicabilityRef": "fkr:app:complement:C060",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C061",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C061",
    "existingRuleSha256": "acb0850d373a2f80ffd76f30f23447338ce20b3a0bca0fb4e75f30578dd8818c",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "생각만 하는 데서 끝나지 않고 직접 만들어 다른 사람에게 보여주고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CREATION",
        "EXPRESSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "role": "axisA_role"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "완성한 것이 실제 청자에게 전달되었는가?",
    "jointReason": "산출물을 전달 가능한 상태로 정리 / 표현이 어떻게 전달됐는지 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "결과물의 용도와 수신 확인을 연결",
    "risk": "많이 만들고 공개한 것을 실제 활용으로 착각",
    "goodIntentionMistake": "좋은 것을 나누려 동의 없는 공개를 늘림",
    "twist": "공개를 미루고 사용자를 확인하는 것이 제작을 살릴 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 안내문을 만든 뒤 실제 이용자가 이해했는지 묻는 장면"
    },
    "behaviorQuestion": "완성한 것이 실제 청자에게 전달되었는가?",
    "conditions": [
      "산출물·청자·공개 동의·사용 목적 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "좋은 결과물도 전달 대상이 없을 수 있음",
    "exclusions": [
      "제작과 표현으로 대중적 성공 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C066은 배운 내용 설명, 이 규칙은 산출물 전달",
    "applicabilityRef": "fkr:app:complement:C061",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C062",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C062",
    "existingRuleSha256": "84b20029687ae94d6de409efb5b98dc250b88636d7696cbd12c4d3d7fe059eeb",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "무언가를 만드는 것뿐 아니라 작은 부분까지 다듬어 완성도를 높이고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CREATION",
        "PRECISION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "role": "axisA_role"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "결과물을 마무리할 수준과 더 고칠 부분을 구분하는가?",
    "jointReason": "산출물을 전달 가능한 상태로 정리 / 최종 결과물의 누락을 점검의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "필요한 품질과 마감을 합의해 제작 완성",
    "risk": "작은 차이 수정 때문에 실제 사용을 계속 늦춤",
    "goodIntentionMistake": "좋은 결과를 주려 요청 밖 세부까지 완벽하게 다듬음",
    "twist": "고치지 않을 부분을 정하면 중요한 완성도를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 시제품의 필수 기능과 장식 수정을 나누는 장면"
    },
    "behaviorQuestion": "결과물을 마무리할 수준과 더 고칠 부분을 구분하는가?",
    "conditions": [
      "용도·품질 기준·마감·수정 권한 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "완성도가 높아도 요구 목적에 안 맞을 수 있음",
    "exclusions": [
      "정밀한 창작이 항상 우수하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C036의 맡은 의무보다 새 결과물의 제작 완료",
    "applicabilityRef": "fkr:app:complement:C062",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C063",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C063",
    "existingRuleSha256": "ac091f24166f8c7c436f521423198b7146f65fef00b67cfc3f1ee743726d2b70",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "그냥 결과물을 많이 만들기보다 자기에게 의미 있는 것을 만들고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CREATION",
        "MEANING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "role": "axisA_role"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-practice",
        "definition": "중요한 가치를 구체적 선택으로 옮김",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "새 결과물이 본인이 중요하게 여기는 이유와 맞는가?",
    "jointReason": "아이디어를 시험 가능한 형태로 만듦 / 중요한 가치를 구체적 선택으로 옮김의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "가치를 작은 제작물로 시험하고 사용 반응을 봄",
    "risk": "의미를 담았다는 이유로 타인의 평가를 배제",
    "goodIntentionMistake": "진심을 전달하려 작품에 없는 고객 경험을 넣음",
    "twist": "의미가 달라도 사용자가 새 용도를 찾을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 지역 이야기를 담은 안내 도구를 실제 방문자에게 시험하는 장면"
    },
    "behaviorQuestion": "새 결과물이 본인이 중요하게 여기는 이유와 맞는가?",
    "conditions": [
      "본인 가치·제작 가능성·타인 자료 동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "중요한 의미가 있어도 제작물 수요는 없을 수 있음",
    "exclusions": [
      "의미 있는 창작으로 성공·감동 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C057은 말의 전달, 이 규칙은 실제 제작과 가치",
    "applicabilityRef": "fkr:app:complement:C063",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C064",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C064",
    "existingRuleSha256": "b805d1e00f9927ec4e41f6cbe64cff740019211f85cedd2b0a316b40a255c91d",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "배운 것을 머릿속에만 두기보다 실제 결과로 만들어봐야 자기 것이 되는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CREATION",
        "LEARNING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "role": "axisA_role"
      },
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "배운 것을 만들며 실제로 이해한 조건을 확인하는가?",
    "jointReason": "아이디어를 시험 가능한 형태로 만듦 / 다른 문제에 배운 구조를 시험의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "작은 제작으로 지식의 적용과 한계를 시험",
    "risk": "만들어졌다는 사실을 원리 이해로 착각",
    "goodIntentionMistake": "배움을 돕고자 정답 절차를 그대로 따라하게 함",
    "twist": "작동하지 않는 부분이 다시 배울 대상을 알려줌",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 배운 코드를 작은 도구에 적용하고 실패 조건을 기록하는 장면"
    },
    "behaviorQuestion": "배운 것을 만들며 실제로 이해한 조건을 확인하는가?",
    "conditions": [
      "검증된 자료·실습·안전·피드백 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "제작 성공이 다른 환경의 적용 능력은 아닐 수 있음",
    "exclusions": [
      "산출물로 지능·숙련을 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C067은 기존 지식의 사용성, 이 규칙은 제작 피드백",
    "applicabilityRef": "fkr:app:complement:C064",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C065",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C065",
    "existingRuleSha256": "3f9d4895165ef24dbdbfc3fca303ddc2b30701d92cc3f797e03aed2bad608a63",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "깊게 이해한 내용을 결국 글, 기술, 제품 같은 결과로 꺼내고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CREATION",
        "DEPTH"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "role": "axisA_role"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "깊이 이해한 내용을 어떤 결과로 꺼낼 수 있는가?",
    "jointReason": "산출물을 전달 가능한 상태로 정리 / 깊게 검토한 내용을 짧게 전달의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "이해 범위를 설명·도구·작품에 맞춰 좁힘",
    "risk": "복잡한 결과물을 깊은 이해의 증거로 삼음",
    "goodIntentionMistake": "빠짐없이 담으려 청자가 쓸 수 없는 산출물을 만듦",
    "twist": "일부를 생략한 결과가 핵심 원리를 더 잘 전할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 긴 연구를 한 장의 사용 안내로 바꾸되 한계를 남기는 장면"
    },
    "behaviorQuestion": "깊이 이해한 내용을 어떤 결과로 꺼낼 수 있는가?",
    "conditions": [
      "실제 자료·산출물 목적·대상 수준 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "깊이 생각해도 제작 기술은 별도 필요",
    "exclusions": [
      "깊이+창작으로 전문 능력 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C006은 이해의 재현, 이 규칙은 실제 결과 형태",
    "applicabilityRef": "fkr:app:complement:C065",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C066",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C066",
    "existingRuleSha256": "ea348d3052fb13eab6b59a0409797d2bcfec140507631eb51850367fa3e65a78",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "배운 것을 자기만 아는 데서 끝내지 않고 다른 사람이 이해할 수 있게 설명하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEARNING",
        "EXPRESSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "role": "axisA_role"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "배운 내용을 설명한 뒤 청자의 이해를 확인하는가?",
    "jointReason": "익힌 내용을 다시 꺼내 사용 / 표현이 어떻게 전달됐는지 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기억한 원리를 청자의 질문에 맞게 다시 설명",
    "risk": "잘 설명한 느낌을 실제 이해로 착각",
    "goodIntentionMistake": "도움을 주려 상대가 해볼 기회를 설명으로 채움",
    "twist": "상대가 설명하게 두면 자신의 빈틈도 보일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 배운 도구를 소개한 뒤 상대가 한 번 사용해 보게 하는 장면"
    },
    "behaviorQuestion": "배운 내용을 설명한 뒤 청자의 이해를 확인하는가?",
    "conditions": [
      "정확한 자료·청자 수준·설명 동의·피드백 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "설명을 좋아해도 전달 내용이 부정확할 수 있음",
    "exclusions": [
      "표현+학습으로 교사 적성·성적 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C061의 결과물 전달과 지식 회상·이해 확인의 차이",
    "applicabilityRef": "fkr:app:complement:C066",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C067",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C067",
    "existingRuleSha256": "73f9caca0932eb76d1dabde9ee62636802f2d846833f94935fc0a38e52d1015e",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "배우는 것 자체보다 실제로 어디에 써먹을 수 있는지까지 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEARNING",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "배운 개념을 어디에 쓸 수 있고 어디에는 안 맞는가?",
    "jointReason": "다른 문제에 배운 구조를 시험 / 실제 사용 환경에서 작동 여부를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "사용 사례와 적용 한계를 함께 시험",
    "risk": "즉시 쓸모 없는 배움은 가치 없다고 평가",
    "goodIntentionMistake": "효율적으로 돕겠다고 기초 원리를 생략",
    "twist": "당장 못 쓰는 원리가 나중에 응용의 경계를 줄 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 학습한 방법을 두 과제에 적용하고 차이를 기록하는 장면"
    },
    "behaviorQuestion": "배운 개념을 어디에 쓸 수 있고 어디에는 안 맞는가?",
    "conditions": [
      "학습 자료·과제·전이 조건·검증 기준 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "직접 적용하지 않아도 이해의 가치가 있을 수 있음",
    "exclusions": [
      "실용 학습으로 직무 성과 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C064의 제작과 달리 기존 문제의 적용 범위",
    "applicabilityRef": "fkr:app:complement:C067",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C068",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C068",
    "existingRuleSha256": "358f109685ecd4367262f785944f1ab191ba29a58dfce8151b07dedb3bc7104b",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "목표가 생기면 필요한 지식과 기술을 스스로 찾아 배우는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEARNING",
        "GOAL_DRIVE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "role": "axisA_role"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "목표에 필요한 학습과 평가 기준을 구별하는가?",
    "jointReason": "새 내용을 이해하고 익힘 / 목적에 따라 우선 과제를 고름의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "목표에서 필요한 지식·연습을 구체화",
    "risk": "배운 시간만 늘리고 실제 수행 확인을 놓침",
    "goodIntentionMistake": "합격을 돕고자 목표 밖 지식은 모두 배제",
    "twist": "목표를 수정할 때 이미 배운 것을 다른 곳에 쓸 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 원하는 과제와 연습 목록을 연결하는 장면"
    },
    "behaviorQuestion": "목표에 필요한 학습과 평가 기준을 구별하는가?",
    "conditions": [
      "실제 목표·학습 기회·피드백·평가 조건 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "목표가 분명해도 교육 접근이 어려울 수 있음",
    "exclusions": [
      "목표 학습으로 합격·성공 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C033의 사회적 인정보다 수행 목표에 필요한 배움",
    "applicabilityRef": "fkr:app:complement:C068",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C069",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C069",
    "existingRuleSha256": "f19a504879ce677bfa9753ee7a9708b13fff0274a812f5d28dd9da784d8731db",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "남에게 배워도 마지막에는 자기 방식으로 이해해야 제대로 알았다고 느끼는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "LEARNING",
        "AUTONOMY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "role": "axisA_role"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "남에게 배운 기준과 본인 방법의 재량은 어디인가?",
    "jointReason": "새 내용을 이해하고 익힘 / 합의된 결과 안에서 방법을 고름의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "핵심 원리를 확인한 뒤 자신에게 맞는 연습법을 고름",
    "risk": "자기 방식이라는 이유로 검증 기준까지 무시",
    "goodIntentionMistake": "자율 학습을 돕겠다고 필요한 안내를 제공하지 않음",
    "twist": "도움을 선택해 받는 것도 스스로 배우는 방식",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 공통 평가 기준은 유지하고 연습 순서를 선택하는 장면"
    },
    "behaviorQuestion": "남에게 배운 기준과 본인 방법의 재량은 어디인가?",
    "conditions": [
      "정확한 자료·발달 단계·학습 재량·도움 접근 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "자율적 방식보다 자세한 안내가 필요한 때도 있음",
    "exclusions": [
      "자율 학습 선호로 독학 능력 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C077의 관계 자율과 학습 방법 선택은 다름",
    "applicabilityRef": "fkr:app:complement:C069",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C070",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C070",
    "existingRuleSha256": "27a2d8b1ceddf7048d6c573d1c26fb543a0d2007b899573f3096a73b2ab8a2b5",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "궁금한 것을 알아보는 데서 끝나지 않고 새로운 아이디어나 결과로 이어가는 사람으로 발전할 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CURIOSITY",
        "CREATION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "role": "axisA_role"
      },
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "궁금한 것을 확인할 작은 시험은 무엇인가?",
    "jointReason": "모르는 지점을 질문으로 구체화 / 아이디어를 시험 가능한 형태로 만듦의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "질문을 실제 제작과 관찰 가능한 결과로 옮김",
    "risk": "만드는 재미 때문에 처음 질문을 잊음",
    "goodIntentionMistake": "호기심을 돕자며 안전하지 않은 실험을 권함",
    "twist": "만들지 않아도 기존 자료로 질문을 해결할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 불편한 도구의 작은 모형을 만들어 사용 차이를 보는 장면"
    },
    "behaviorQuestion": "궁금한 것을 확인할 작은 시험은 무엇인가?",
    "conditions": [
      "실제 질문·가역 시험·안전·결과 기준 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "새 질문이 제작으로 확인 가능한 것은 아닐 수 있음",
    "exclusions": [
      "호기심과 제작으로 발명 성공 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C071은 이미 관찰한 연결, 이 규칙은 질문의 시험",
    "applicabilityRef": "fkr:app:complement:C070",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C071",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C071",
    "existingRuleSha256": "559dd0c1fa65e9fa0035bfd74b099f743affe6d1052d4cd00f09ce8add1ea6c9",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "남들이 따로 보는 것들을 연결해서 새로운 아이디어나 결과를 만드는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PATTERN_SENSE",
        "CREATION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:counterpattern",
        "definition": "맞지 않는 사례를 적극 확인",
        "role": "axisA_role"
      },
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:recombination",
        "definition": "알고 있는 재료를 다른 방식으로 결합",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "서로 다른 것을 조합한 결과의 차이를 검증했는가?",
    "jointReason": "맞지 않는 사례를 적극 확인 / 알고 있는 재료를 다른 방식으로 결합의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "공통 기능과 예외를 비교해 새로운 조합을 시험",
    "risk": "닮은 구조를 같은 작동 원리로 확정",
    "goodIntentionMistake": "발상을 살리려 맞지 않는 사례를 무시",
    "twist": "안 맞는 조합을 버리는 것이 창작의 범위를 선명히 함",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 두 도구의 기능을 합친 뒤 서로 다른 사용 조건을 적는 장면"
    },
    "behaviorQuestion": "서로 다른 것을 조합한 결과의 차이를 검증했는가?",
    "conditions": [
      "두 원천의 실제 차이·조합 목적·시험·반례 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "연결이 재미있어도 새 결과에 이점이 없을 수 있음",
    "exclusions": [
      "패턴 연결로 독창성·성공 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C070의 질문 시험보다 관찰된 연결의 반례 검토",
    "applicabilityRef": "fkr:app:complement:C071",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C072",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C072",
    "existingRuleSha256": "9057c231614101aee1375b0f29f9b11e126c1e6a106ec7ea9bd7d19718fac919",
    "group": "CREATION_LEARNING",
    "researchRelation": "task_complement",
    "originalMeaning": "아이디어만 떠올리는 게 아니라 어떻게 만들고 완성할지까지 계획하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "learning",
      "work",
      "identity"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRATEGY",
        "CREATION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:sequence-design",
        "definition": "의존 관계에 맞게 순서를 배치",
        "role": "axisA_role"
      },
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "제작 경로에서 먼저 검증할 의존 조건은 무엇인가?",
    "jointReason": "의존 관계에 맞게 순서를 배치 / 산출물을 전달 가능한 상태로 정리의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "제작의 순서·필요 자원·완료 기준을 연결",
    "risk": "계획을 정리하며 실제 제작을 미룸",
    "goodIntentionMistake": "완성도를 돕고자 탐색 여지 없는 순서를 강요",
    "twist": "작은 미완성 결과가 계획의 중요한 전제를 바꿀 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 제작 전 위험한 기능 한 개만 먼저 시험하는 장면"
    },
    "behaviorQuestion": "제작 경로에서 먼저 검증할 의존 조건은 무엇인가?",
    "conditions": [
      "실제 제작 목표·자원·의존 작업·가역성 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "좋은 계획도 제작 역량이 없으면 실행할 수 없음",
    "exclusions": [
      "전략과 제작으로 완성·판매 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C008의 정밀 검수보다 새 제작 경로",
    "applicabilityRef": "fkr:app:complement:C072",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C073",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C073",
    "existingRuleSha256": "55e6b68d051486050d1b6ffd008dbf822b53beda539c7a9f8fe2277b9d571171",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "말 한 번보다 오래 챙기고 지켜주는 방식으로 마음을 보여주는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CARE",
        "STABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "role": "axisA_role"
      },
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "오래 제공할 돌봄의 역할과 여력이 합의됐는가?",
    "jointReason": "자기 한계를 포함해 도움을 설계 / 유지·인수인계 체계를 갖춤의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "반복 지원을 가능한 양과 시점으로 나눔",
    "risk": "오래 챙겼다는 이유로 돌봄을 철회할 수 없다고 여김",
    "goodIntentionMistake": "안심을 주려 자신의 한계보다 큰 약속을 함",
    "twist": "지원 방식을 바꾸는 것이 오래 관계를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 정기 도움의 분량과 다시 의논할 시점을 정하는 장면"
    },
    "behaviorQuestion": "오래 제공할 돌봄의 역할과 여력이 합의됐는가?",
    "conditions": [
      "실제 관계·요청·지원 여력·보호 의무 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "꾸준한 돌봄도 원하지 않으면 부담일 수 있음",
    "exclusions": [
      "돌봄과 안정으로 사랑·관계 유지 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C095는 맡은 책임, 이 규칙은 반복 지원의 지속 조건",
    "applicabilityRef": "fkr:app:complement:C073",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C074",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C074",
    "existingRuleSha256": "7b34e90442823c827e0818886b7f8d4ecf00da32a645f26a522c80d2e9a47857",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "좋아하는 마음을 속으로만 가지고 있기보다 말이나 행동으로 보여주려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CARE",
        "EXPRESSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:practical-support",
        "definition": "동의한 구체적 부담을 덜어줌",
        "role": "axisA_role"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "도움과 애정 표현의 통로가 상대에게도 적합한가?",
    "jointReason": "동의한 구체적 부담을 덜어줌 / 뜻에 맞는 말·글·행동을 선택의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "말·행동 중 상대가 원하는 방식으로 마음을 전달",
    "risk": "제공한 도움을 상대가 반드시 애정으로 받아야 한다고 기대",
    "goodIntentionMistake": "표현을 잘 하려 필요 없는 선물·지원까지 늘림",
    "twist": "아무것도 대신하지 않고 경청하는 표현도 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 힘든 날의 지원을 조언·식사·경청 중 상대가 고르게 하는 장면"
    },
    "behaviorQuestion": "도움과 애정 표현의 통로가 상대에게도 적합한가?",
    "conditions": [
      "실제 필요·관계 단계·표현 동의·여력 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "선물보다 개인 시간이 필요한 날도 있음",
    "exclusions": [
      "CARE+표현으로 상대의 호감 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C054의 직설 지원과 달리 여러 애정 통로",
    "applicabilityRef": "fkr:app:complement:C074",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C075",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C075",
    "existingRuleSha256": "d2793b6f382cb1a3da7976420c80c2cded133e9e8fe24ff5d785a4955ff452a0",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "가까운 사람의 마음과 말을 오래 생각하고 이해하려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DEPTH",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:respectful-nonintervention",
        "definition": "돕지 않을 선택을 존중",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "상대 이야기를 이해하되 해석과 결정권을 남기는가?",
    "jointReason": "같은 행동의 다른 조건을 검토 / 돕지 않을 선택을 존중의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "말한 경험을 깊게 듣고 대신 결정하지 않음",
    "risk": "이해하려는 해석이 상대의 의도를 확정",
    "goodIntentionMistake": "도우려 실제로 말하지 않은 과거 원인을 꾸밈",
    "twist": "모르는 부분을 남겨두는 것이 존중일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 친구의 고민을 들은 뒤 원하는 도움인지 먼저 묻는 장면"
    },
    "behaviorQuestion": "상대 이야기를 이해하되 해석과 결정권을 남기는가?",
    "conditions": [
      "실제 진술·질문 동의·해석 반례 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "긴 대화로도 상대의 마음 전체를 알 수 없음",
    "exclusions": [
      "깊이와 배려로 타인 심리·과거 경험 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C049는 현재 신호, 이 규칙은 맥락 경청과 비개입",
    "applicabilityRef": "fkr:app:complement:C075",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C076",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C076",
    "existingRuleSha256": "ca084fdb5d4d41e389245b846bf12e2589594294b7afc1c77fbc097c6f276104",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "상대 반응을 살피면서 관계를 오래 안정적으로 이어가고 싶어 하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "STABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "role": "axisA_role"
      },
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "평소와 다른 반응을 관계 불안정으로 해석하는가?",
    "jointReason": "관찰한 뜻을 당사자에게 묻기 / 유지·인수인계 체계를 갖춤의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "변화의 이유를 묻고 유지할 약속을 다시 확인",
    "risk": "관계를 지키려 작은 반응을 계속 감시",
    "goodIntentionMistake": "안심시키려 상대에게 늘 같은 감정을 요구",
    "twist": "달라질 수 있음을 인정하면 관계의 기본 합의가 선명해짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 연락량 변화가 업무 때문인지 관계 요청인지 묻는 장면"
    },
    "behaviorQuestion": "평소와 다른 반응을 관계 불안정으로 해석하는가?",
    "conditions": [
      "실제 관계·약속·상황 변화·확인 동의가 있음",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "답장이 늦어도 신뢰는 유지될 수 있음",
    "exclusions": [
      "반응 신호로 이별·관계 안정 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C082는 표현의 지속, 이 규칙은 반응 해석의 확인",
    "applicabilityRef": "fkr:app:complement:C076",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C077",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C077",
    "existingRuleSha256": "3bc7e3de891acd57081d9af56486b2867fe25fc27d3eb8296176d886446c9b62",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 아끼고 챙기면서도 자기 시간과 선택권은 필요한 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "AUTONOMY",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:respectful-nonintervention",
        "definition": "돕지 않을 선택을 존중",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "아끼는 마음과 상대가 고를 권리를 함께 남기는가?",
    "jointReason": "받을 도움의 방식을 선택 / 돕지 않을 선택을 존중의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "도움을 제안하되 거절과 다른 선택도 인정",
    "risk": "자율을 핑계로 필요한 공동 책임을 외면",
    "goodIntentionMistake": "돕기 위해 상대의 선택까지 대신 결정",
    "twist": "도움받는 선택과 자율성은 공존 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 진로 고민에 자료를 주고 결정은 맡기는 장면"
    },
    "behaviorQuestion": "아끼는 마음과 상대가 고를 권리를 함께 남기는가?",
    "conditions": [
      "실제 관계·보호 의무·선택권·요청 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "도움을 거절해도 관계의 가치가 사라지지 않음",
    "exclusions": [
      "돌봄을 받지 않으면 독립적이지 못하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C053의 지원 한도보다 양측의 선택권",
    "applicabilityRef": "fkr:app:complement:C077",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C078",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C078",
    "existingRuleSha256": "0a620d4286d8456a1128e7f7183df8e8aa4f5c0a48dfe682a989ee85fd92f6d9",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "가까운 관계를 좋아해도 넘지 말아야 할 선은 분명히 두고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RELATION_STYLE",
        "BOUNDARY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "role": "axisA_role"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:privacy",
        "definition": "정보·시간의 사적 범위를 정함",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "가까워져도 공개·연락·접촉의 경계가 남는가?",
    "jointReason": "연락·만남의 참여 범위를 정함 / 정보·시간의 사적 범위를 정함의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "관계를 넓히되 허락이 필요한 범위를 확인",
    "risk": "친밀함을 이유로 타인의 정보를 공유",
    "goodIntentionMistake": "관계를 돕자며 연락·위치 확인을 기본 의무로 만듦",
    "twist": "공개하지 않는 경계를 지켜 더 편하게 가까워질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 함께 찍은 사진의 공개 범위를 묻는 장면"
    },
    "behaviorQuestion": "가까워져도 공개·연락·접촉의 경계가 남는가?",
    "conditions": [
      "실제 관계·접촉 동의·정보 소유·거절 안전 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "함께하는 것을 좋아해도 공개는 원하지 않을 수 있음",
    "exclusions": [
      "가까운 관계이면 사생활 동의가 불필요하다고 주장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C059는 참여 선택, 이 규칙은 접촉·공개 경계",
    "applicabilityRef": "fkr:app:complement:C078",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C079",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C079",
    "existingRuleSha256": "f358a61172a8aca4e729dd2a6deb5051458f61ecb2ed015be8341d8934cdcd19",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "관계를 유지하는 것보다 서로에게 어떤 의미가 있는지를 중요하게 보는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "MEANING",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "이 관계의 의미와 상대가 원하는 지원이 같은가?",
    "jointReason": "자기에게 중요한 이유를 말함 / 상대가 원하는 도움을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "각자가 중요하게 여기는 이유와 실제 필요를 함께 듣음",
    "risk": "관계의 의미를 한쪽의 가치로 정의",
    "goodIntentionMistake": "소중해서 돕는다며 원치 않는 개입을 정당화",
    "twist": "의미가 달라도 필요한 지원은 합의할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 우정을 표현하는 방식과 지금 필요한 도움을 나누는 장면"
    },
    "behaviorQuestion": "이 관계의 의미와 상대가 원하는 지원이 같은가?",
    "conditions": [
      "양측 가치 진술·요청·관계 역할·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "오래된 관계도 현재 지원을 제공할 수 없는 경우가 있음",
    "exclusions": [
      "깊은 의미가 있으니 관계 지속 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C040의 자원 가치와 관계의 상호 의미는 다름",
    "applicabilityRef": "fkr:app:complement:C079",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C080",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C080",
    "existingRuleSha256": "0f79cc81da6eeb1f05a3735526d51ec4ce1db90dc3488e89fbecadf2abfeadc8",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "사람의 반응을 많이 읽는 만큼 사람을 많이 만난 뒤에는 혼자 회복할 시간이 더 필요한 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "SOCIAL_ATTUNEMENT",
        "RECOVERY_NEED"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "definition": "말·표정·참여의 변화를 관찰",
        "role": "axisA_role"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:load-recognition",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "반응을 읽는 활동과 현재 부하를 따로 확인하는가?",
    "jointReason": "말·표정·참여의 변화를 관찰 / 현재 부담과 쉬는 필요를 알아봄의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "상호작용의 역할을 줄이거나 쉬는 시간을 요청",
    "risk": "눈치가 좋다는 이유로 늘 감정 조율을 맡음",
    "goodIntentionMistake": "상대를 불편하지 않게 하려 피로를 말하지 않음",
    "twist": "반응을 덜 읽는 시간이 다음 교류를 도울 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 모임 후 메시지 답변 가능 시간을 알리는 장면"
    },
    "behaviorQuestion": "반응을 읽는 활동과 현재 부하를 따로 확인하는가?",
    "conditions": [
      "실제 활동 부하·휴식 선호·공동 책임 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "사람과의 만남 자체가 회복이 될 수 있음",
    "exclusions": [
      "사회 감각이 좋아 반드시 피곤하다고 인과 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C049의 도움 필요보다 본인의 부하·회복 조건",
    "applicabilityRef": "fkr:app:complement:C080",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C081",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C081",
    "existingRuleSha256": "aa49413dad469184e2e5ca95f9949ddc49b593210bb67dc509bb9e8e79200b50",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "좋아하는 사람의 작은 말과 행동까지 잘 기억하고 알아차리는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love",
      "social"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "PRECISION",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "작은 말의 차이를 기억한 이유와 필요한 돌봄은 무엇인가?",
    "jointReason": "상황 사이 기준 적용의 일관성을 확인 / 상대가 원하는 도움을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "변한 약속이나 선호를 다시 물어 실제 지원에 반영",
    "risk": "세밀하게 기억한 내용을 상대의 고정 성격으로 묶음",
    "goodIntentionMistake": "더 잘 챙기려 과거 말을 근거로 현재 선택을 제한",
    "twist": "이전에 한 말도 바뀔 수 있음을 인정하는 것이 세심함",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 좋아하던 선물을 지금도 원하는지 다시 묻는 장면"
    },
    "behaviorQuestion": "작은 말의 차이를 기억한 이유와 필요한 돌봄은 무엇인가?",
    "conditions": [
      "실제 발언 기록·현재 선호·질문·지원 동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "잘 기억해도 지금 필요는 다를 수 있음",
    "exclusions": [
      "PRECISION+CARE로 기억력·상대 마음 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C001과 같은 축이지만 친밀한 선호 갱신이라는 다른 조건",
    "applicabilityRef": "fkr:app:complement:C081",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "precision",
          "researchRef": "sar:tag:precision",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C082",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C082",
    "existingRuleSha256": "bc10c4bdf9e1ea0bbd5f134a9bcedb692c6aa3fe443f5670f8a32dad26a7998f",
    "group": "RELATIONSHIP",
    "researchRelation": "task_complement",
    "originalMeaning": "한 번의 큰 표현보다 꾸준히 연락하고 행동으로 보여주는 사랑을 중요하게 생각하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "love"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STABILITY",
        "EXPRESSION"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "role": "axisA_role"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "꾸준한 표현이 상대에게도 합의된 방식인가?",
    "jointReason": "유지·인수인계 체계를 갖춤 / 표현이 어떻게 전달됐는지 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "연락·행동의 반복과 상대의 이해를 함께 확인",
    "risk": "같은 연락량을 애정의 의무로 강요",
    "goodIntentionMistake": "안심시키려 감정과 다른 반응을 계속 연출",
    "twist": "표현 방식이 바뀌어도 기본 신뢰는 이어질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 근무 변화 뒤 연락 방식과 다시 이야기할 때를 정하는 장면"
    },
    "behaviorQuestion": "꾸준한 표현이 상대에게도 합의된 방식인가?",
    "conditions": [
      "실제 교제·연락 합의·표현 통로·생활 여력 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "꾸준히 연락해도 상대가 원하지 않을 수 있음",
    "exclusions": [
      "연락의 지속으로 사랑·충실함 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C073은 돌봄 제공, 이 규칙은 표현의 수신·지속",
    "applicabilityRef": "fkr:app:complement:C082",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C083",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C083",
    "existingRuleSha256": "bc30cb89b38bfe1c93d906392064392e7643c2623587a1ded584c1825bc67ed5",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "새로운 환경을 두려워하기보다 그 안에서 새로운 기회를 찾는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CHANGE_ORIENTATION",
        "OPPORTUNITY_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CHANGE_ORIENTATION",
        "direction": 1,
        "facetRef": "sar:facet:CHANGE_ORIENTATION:novelty-trial",
        "definition": "새 방식의 일부를 시험",
        "role": "axisA_role"
      },
      {
        "axis": "OPPORTUNITY_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:OPPORTUNITY_SENSE:option-discovery",
        "definition": "새 연결에서 가능한 선택을 찾음",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "새 환경의 무엇이 실제 선택지인가?",
    "jointReason": "새 방식의 일부를 시험 / 새 연결에서 가능한 선택을 찾음의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "낯선 조건에서 작게 확인할 가능성을 찾음",
    "risk": "새롭다는 느낌을 유리한 기회로 확정",
    "goodIntentionMistake": "용기를 주려 위험·기존 기반 비용을 축소",
    "twist": "새로움을 선택하지 않아도 열린 기회는 조사 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 직무 제안의 실제 역할을 체험 전 확인하는 장면"
    },
    "behaviorQuestion": "새 환경의 무엇이 실제 선택지인가?",
    "conditions": [
      "실제 환경 변화·제안·가역 시험·선택권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "낯선 환경이 기회를 제공하지 않을 수 있음",
    "exclusions": [
      "변화 선호로 두려움 없음·행운 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C023의 목표 관련성보다 새 선택지의 존재 확인",
    "applicabilityRef": "fkr:app:complement:C083",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C084",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C084",
    "existingRuleSha256": "e9ff90bf2a426d45de356cfc7d7adc2c37b9680c9207c0481c83381d1b9dc1da",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "상황이 달라져도 기존 방식만 고집하지 않고 빠르게 새 방법을 찾는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "CHANGE_ORIENTATION",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "CHANGE_ORIENTATION",
        "direction": 1,
        "facetRef": "sar:facet:CHANGE_ORIENTATION:chosen-change",
        "definition": "스스로 선택한 변화와 강제 변화를 구별",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:feedback-uptake",
        "definition": "받은 정보의 유효 부분을 반영",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "선택한 변화와 강제로 바뀐 조건을 구별하는가?",
    "jointReason": "스스로 선택한 변화와 강제 변화를 구별 / 받은 정보의 유효 부분을 반영의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "원하는 변화에도 실제 피드백에 맞춰 방법을 조정",
    "risk": "새 방식을 좋아하므로 잘 적응한다고 확정",
    "goodIntentionMistake": "변화를 돕자며 준비 시간 없이 새 역할을 강요",
    "twist": "변화를 싫어해도 잘 조정하는 사람은 있을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 도구를 고른 뒤 실제 사용 불편을 받아 방법을 고치는 장면"
    },
    "behaviorQuestion": "선택한 변화와 강제로 바뀐 조건을 구별하는가?",
    "conditions": [
      "실제 선택·변경 조건·준비 여력·피드백 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "새로움을 좋아해도 특정 변화에는 적응이 어려울 수 있음",
    "exclusions": [
      "선호와 대응 능력을 동일시",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C024는 기반 유지, 이 규칙은 변화 선택·수용 차이",
    "applicabilityRef": "fkr:app:complement:C084",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C085",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C085",
    "existingRuleSha256": "686ebd44055422944ccd8228fa6675604bc2af287ac68124f6b96833e4218ec1",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "회복할 때는 자극적인 변화보다 익숙하고 안정적인 환경이 필요한 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STABILITY",
        "RECOVERY_NEED"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:minimum-security",
        "definition": "유지할 최소 생활 조건을 정함",
        "role": "axisA_role"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:rest-access",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "회복에 필요한 익숙함과 실제 접근 가능한 휴식은 무엇인가?",
    "jointReason": "유지할 최소 생활 조건을 정함 / 쉬는 방식과 가능한 공간을 확보의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "안전한 기본 환경과 쉬는 방식을 직접 확인",
    "risk": "익숙한 것만 회복에 좋다고 단정",
    "goodIntentionMistake": "안정시키려 상대가 원하는 활동까지 차단",
    "twist": "짧은 새 활동이 익숙한 부담에서 벗어나게 할 수도 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 쉬는 날 집·산책·친구 만남 중 원하는 방식을 고르는 장면"
    },
    "behaviorQuestion": "회복에 필요한 익숙함과 실제 접근 가능한 휴식은 무엇인가?",
    "conditions": [
      "실제 부하·휴식 선호·돌봄·경제 제약 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "익숙한 집이 오히려 부담의 장소일 수 있음",
    "exclusions": [
      "두 축으로 휴식 처방·회복 기간 진단",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C086은 생각 정리, 이 규칙은 안전 기반과 휴식 접근",
    "applicabilityRef": "fkr:app:complement:C085",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C086",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C086",
    "existingRuleSha256": "4cd4975a2c478c18c73f06b4f5e1a2002e0d51d2a0d9b5c210a2c24a426ec19a",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "쉬는 것만으로는 부족하고 혼자 생각을 정리해야 제대로 회복되는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DEPTH",
        "RECOVERY_NEED"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "role": "axisA_role"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:rest-access",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "생각 정리가 회복을 돕는지 반복 부담을 늘리는지 확인하는가?",
    "jointReason": "깊게 검토한 내용을 짧게 전달 / 쉬는 방식과 가능한 공간을 확보의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "쉬는 구간과 정리할 질문의 끝을 나눔",
    "risk": "오래 생각하면 반드시 회복된다고 가정",
    "goodIntentionMistake": "납득시켜 주려 휴식 중에도 설명과 분석을 요구",
    "twist": "답을 찾지 않는 시간이 다음 정리를 도울 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 고민 메모를 남긴 뒤 오늘 답하지 않을 질문을 정하는 장면"
    },
    "behaviorQuestion": "생각 정리가 회복을 돕는지 반복 부담을 늘리는지 확인하는가?",
    "conditions": [
      "실제 부하·정리 선호·중단 가능성 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "생각을 멈추는 활동이 더 편한 사람도 있음",
    "exclusions": [
      "깊은 사람은 혼자 생각해야 회복된다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C006의 이해 형성보다 휴식과 분석 종료 조건",
    "applicabilityRef": "fkr:app:complement:C086",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C087",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C087",
    "existingRuleSha256": "e822f55e90f82cef53ae3209c3676778e18893e873edf923f72c2f9df0649ccf",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "밖에서는 말하고 표현하는 에너지가 크지만 끝난 뒤에는 혼자 쉬어야 다시 힘이 나는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "EXPRESSION",
        "RECOVERY_NEED"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "role": "axisA_role"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:return-agreement",
        "definition": "회복 뒤 다시 응답할 시점을 합의",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "표현 활동 뒤 쉬는 구간과 공동 책임을 합의했는가?",
    "jointReason": "드러낼 범위와 대상을 고름 / 회복 뒤 다시 응답할 시점을 합의의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "공개 활동량과 이후 응답 여력을 따로 알림",
    "risk": "말을 잘하니 계속 참여할 수 있다고 기대",
    "goodIntentionMistake": "분위기를 지키려 쉬는 요청을 계속 미룸",
    "twist": "표현을 줄이는 선택이 다음 발표를 유지할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 발표 뒤 연락 가능 시간과 인수인계를 정하는 장면"
    },
    "behaviorQuestion": "표현 활동 뒤 쉬는 구간과 공동 책임을 합의했는가?",
    "conditions": [
      "실제 활동 부하·휴식 선호·인수인계·동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "표현 활동이 오히려 회복이 되는 경우도 있음",
    "exclusions": [
      "표현력이 크므로 반드시 소진된다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C080의 신호 읽기 노동과 표현 활동의 부하는 다름",
    "applicabilityRef": "fkr:app:complement:C087",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "first-attraction",
          "researchRef": "sar:tag:first-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression",
          "researchRef": "sar:tag:expression",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "expression-gap",
          "researchRef": "sar:tag:expression-gap",
          "relation": "NO_TRAIT_INFERENCE",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "reserved-affection",
          "researchRef": "sar:tag:reserved-affection",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C088",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C088",
    "existingRuleSha256": "3874a4d22761a02be026bb3d6eef396c5c3eb7f7bc49b73a0c99111679688339",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "사람들과 이야기하면서 생각을 넓히고 혼자 있을 때 그 생각을 더 깊게 정리하는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "ENERGY_DIRECTION",
        "DEPTH"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "ENERGY_DIRECTION",
        "direction": 1,
        "facetRef": "sar:facet:ENERGY_DIRECTION:dialogic-processing",
        "definition": "대화 속에서 생각을 발전",
        "role": "axisA_role"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "대화에서 넓힌 생각을 사적으로 다시 확인하는가?",
    "jointReason": "대화 속에서 생각을 발전 / 같은 행동의 다른 조건을 검토의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "교환 중 나온 가정과 확인된 사실을 나눠 숙고",
    "risk": "대화량을 깊은 이해로 착각",
    "goodIntentionMistake": "발상을 돕고자 정리 전 생각을 확정안으로 전달",
    "twist": "말하지 않고 적는 시간도 외부 교환을 살릴 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 토론 후 자신의 가정과 상대가 실제 말한 내용을 따로 적는 장면"
    },
    "behaviorQuestion": "대화에서 넓힌 생각을 사적으로 다시 확인하는가?",
    "conditions": [
      "실제 대화 자료·정리 시간·모르는 범위 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "대화보다 혼자 읽기가 더 적합한 과제도 있음",
    "exclusions": [
      "외부 에너지+깊이로 모든 토론에 능숙하다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C005의 정보 연결보다 대화와 사적 정리의 통로",
    "applicabilityRef": "fkr:app:complement:C088",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "inquiry",
          "researchRef": "sar:tag:inquiry",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "learning",
          "researchRef": "sar:tag:learning",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C089",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C089",
    "existingRuleSha256": "0a450467b227bbb9560933585d760a1c911b0341f093f4f4f5e27ba573c69600",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "평소에는 앞에 나서지 않아도 결정이 필요한 순간에는 방향을 잡을 수 있는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "ENERGY_DIRECTION",
        "LEADERSHIP"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "ENERGY_DIRECTION",
        "direction": -1,
        "facetRef": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "role": "axisA_role"
      },
      {
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "혼자 정리한 판단을 필요한 때 방향으로 제안할 수 있는가?",
    "jointReason": "생각을 먼저 사적으로 정리 / 공동 목적을 제안하고 조율의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "사전 숙고를 문서·작은 회의로 공유해 조율",
    "risk": "조용함을 무조건 숨은 리더십으로 포장",
    "goodIntentionMistake": "충분히 준비하려 팀에 필요한 중간 정보를 주지 않음",
    "twist": "항상 앞에 서지 않아도 방향 제안은 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 회의 전 검토 메모를 보내고 결정할 질문을 제시하는 장면"
    },
    "behaviorQuestion": "혼자 정리한 판단을 필요한 때 방향으로 제안할 수 있는가?",
    "conditions": [
      "실제 조율 필요·권한·숙고 선호·공유 통로 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "내향 방향이어도 방향 제안을 원하지 않을 수 있음",
    "exclusions": [
      "음의 에너지 방향을 소극·무능으로 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C031의 직책 욕구와 사적 처리 선호는 다름",
    "applicabilityRef": "fkr:app:complement:C089",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "solitude",
          "researchRef": "sar:tag:solitude",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "sociability",
          "researchRef": "sar:tag:sociability",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C090",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C090",
    "existingRuleSha256": "205f96b1292408000046f76c589b040e3f4f47ab7a951b6226313fa5f7e6874e",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "기준과 계획은 분명하지만 상황이 달라지면 방법까지 고집하지는 않는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "STRUCTURE_STYLE",
        "ADAPTABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "STRUCTURE_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:STRUCTURE_STYLE:change-log",
        "definition": "계획 변경을 서로 확인 가능한 기록으로 남김",
        "role": "axisA_role"
      },
      {
        "axis": "ADAPTABILITY",
        "direction": 1,
        "facetRef": "sar:facet:ADAPTABILITY:method-revision",
        "definition": "목적 안에서 방법을 바꿈",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "유지할 기준과 갱신할 절차를 구분하는가?",
    "jointReason": "계획 변경을 서로 확인 가능한 기록으로 남김 / 목적 안에서 방법을 바꿈의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기준의 목적을 남기면서 바뀐 조건에 절차를 고침",
    "risk": "계획을 바꿨는데도 공유하지 않아 협업 혼란",
    "goodIntentionMistake": "일관성을 지키려 낡은 절차를 계속 요구",
    "twist": "변경 이력을 공개하면 유연함도 예측 가능해짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 업무 절차의 변경 이유와 시행일을 알리는 장면"
    },
    "behaviorQuestion": "유지할 기준과 갱신할 절차를 구분하는가?",
    "conditions": [
      "기준 목적·실제 조건 변화·변경권·공유 대상 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "일부 기준은 바꿀 권한이 없을 수 있음",
    "exclusions": [
      "계획+적응으로 모든 예외를 해결한다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C024는 생활 기반, 이 규칙은 기준·절차 갱신",
    "applicabilityRef": "fkr:app:complement:C090",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C091",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C091",
    "existingRuleSha256": "4cc12e8bce6543a5c9cf7247b7b3195f51e34f16f9f6e23f826494317b680a23",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "도전은 좋아하지만 아무 생각 없이 뛰어들기보다 다음 수를 계산하고 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RISK_STYLE",
        "STRATEGY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RISK_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RISK_STYLE:reversible-probe",
        "definition": "되돌릴 수 있는 시험을 선택",
        "role": "axisA_role"
      },
      {
        "axis": "STRATEGY",
        "direction": 1,
        "facetRef": "sar:facet:STRATEGY:contingency",
        "definition": "조건이 바뀔 때의 대안을 준비",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "감수할 위험과 되돌릴 대안이 실제로 있는가?",
    "jointReason": "되돌릴 수 있는 시험을 선택 / 조건이 바뀔 때의 대안을 준비의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "도전 전에 한도·중단·다음 경로를 남김",
    "risk": "대안 계획을 세웠으니 위험이 사라졌다고 믿음",
    "goodIntentionMistake": "용기를 주려 타인의 손실까지 감수 가능하다고 계산",
    "twist": "시도하지 않을 선택도 전략의 일부",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 작은 시장 시험의 손실 한도와 철수 조건을 적는 장면"
    },
    "behaviorQuestion": "감수할 위험과 되돌릴 대안이 실제로 있는가?",
    "conditions": [
      "실제 위험·가역성·본인 여력·공동 동의 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "계획이 있어도 회복 불가능한 위험은 남을 수 있음",
    "exclusions": [
      "도전+전략으로 투자·사업 성공 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C046의 안전 우선 방향과 달리 감수의 조건",
    "applicabilityRef": "fkr:app:complement:C091",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C092",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C092",
    "existingRuleSha256": "936722550774b9065d9ce953e5038026ec0bb178d24e3a2e55ef19276583e577",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "기회를 잘 보면서도 실제 손해와 위험을 확인한 뒤 움직이는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "RISK_STYLE",
        "OPPORTUNITY_SENSE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "RISK_STYLE",
        "direction": -1,
        "facetRef": "sar:facet:RISK_STYLE:hazard-check",
        "definition": "위험의 종류와 정보 부족을 구별",
        "role": "axisA_role"
      },
      {
        "axis": "OPPORTUNITY_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:OPPORTUNITY_SENSE:decline-option",
        "definition": "지금 하지 않을 기회를 선택",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "보이는 기회에서 확인하지 못한 위험은 무엇인가?",
    "jointReason": "위험의 종류와 정보 부족을 구별 / 지금 하지 않을 기회를 선택의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "기회의 실제 조건과 위험 자료를 요청",
    "risk": "신중함이 끝없는 확인 요구로 바뀜",
    "goodIntentionMistake": "안전하게 돕겠다고 상대 선택을 무조건 막음",
    "twist": "거절할 선택지가 있으면 작은 검증도 편해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 제안서의 빠진 비용 자료를 받은 뒤 수락 여부를 정하는 장면"
    },
    "behaviorQuestion": "보이는 기회에서 확인하지 못한 위험은 무엇인가?",
    "conditions": [
      "실제 제안·위험 자료·검토 기한·거절권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "기회가 유효해도 본인의 여력과 안 맞을 수 있음",
    "exclusions": [
      "신중하니 기회를 놓치지 않거나 손실 없다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C039는 자원 배분, 이 규칙은 위험 확인·거절 가능성",
    "applicabilityRef": "fkr:app:complement:C092",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "mobility",
          "researchRef": "sar:tag:mobility",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experimentation",
          "researchRef": "sar:tag:experimentation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C093",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C093",
    "existingRuleSha256": "f8be309de1cc8a9dc0bcd6814a2c4fae9489f43932bfca5d6eaac3cc455e24e0",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "남들이 좋다고 하는 답보다 자기에게 왜 중요한지 납득되는 선택을 하고 싶은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "AUTONOMY",
        "MEANING"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "role": "axisA_role"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "남이 권한 답과 자신이 납득한 이유를 나누는가?",
    "jointReason": "자신에게 속한 선택을 확인 / 목표와 중요한 이유의 연결을 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "개인 가치를 설명하고 공동 영향도 검토",
    "risk": "내게 의미 있다는 이유로 타인의 비용을 무시",
    "goodIntentionMistake": "스스로 선택하게 하려 필요한 정보·지원을 제공하지 않음",
    "twist": "도움을 받아 결정해도 선택의 주인은 본인",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 진로 추천의 조건과 본인 가치가 다른 부분을 적는 장면"
    },
    "behaviorQuestion": "남이 권한 답과 자신이 납득한 이유를 나누는가?",
    "conditions": [
      "본인 가치 진술·실제 선택권·공동 책임 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "선택권이 제한된 상황에서는 보호·지원이 우선임",
    "exclusions": [
      "자율·의미로 자기 결정이 항상 옳다고 단정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C040의 자원 가치보다 선택의 이유·주체",
    "applicabilityRef": "fkr:app:complement:C093",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "experience-spending",
          "researchRef": "sar:tag:experience-spending",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C094",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C094",
    "existingRuleSha256": "7894b6240d8d9c5daf98363974a6ac2cc1530564af07e64e5bd55fb36b6675b8",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "자기 방식대로 하고 싶어 하면서도 실제로 되는지 계산하지 않고 움직이는 사람은 아닌 모습으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "AUTONOMY",
        "PRACTICALITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "role": "axisA_role"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "자기 방식이 합의한 결과와 실제 제약을 충족하는가?",
    "jointReason": "합의된 결과 안에서 방법을 고름 / 실제 사용 환경에서 작동 여부를 확인의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "방법 재량을 갖되 사용 결과를 확인",
    "risk": "자기 방식의 성공을 모든 상황의 정답으로 확정",
    "goodIntentionMistake": "효율을 돕겠다며 공동 규칙을 통보 없이 바꿈",
    "twist": "도움을 선택하는 것이 가장 실용적인 자율일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 같은 결과 기준 아래 도구 선택과 사용 시험을 분리하는 장면"
    },
    "behaviorQuestion": "자기 방식이 합의한 결과와 실제 제약을 충족하는가?",
    "conditions": [
      "실제 재량·공동 목표·사용 기준·변경 영향 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "검증된 공통 절차를 따르는 것이 유리할 수 있음",
    "exclusions": [
      "자율성과 실용성으로 업무 능력 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C041은 보상 교환, 이 규칙은 방법 재량·사용 검증",
    "applicabilityRef": "fkr:app:complement:C094",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "autonomy",
          "researchRef": "sar:tag:autonomy",
          "relation": "RELATED_CONDITIONAL",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "practical-learning",
          "researchRef": "sar:tag:practical-learning",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C095",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C095",
    "existingRuleSha256": "83bba3294a3a8c6b4c940f810f750765c64de1b1335c4c360cace58ed785203e",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "사람을 챙기는 마음을 말로만 두지 않고 맡은 책임까지 실제로 지키려는 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "DUTY",
        "CARE"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "role": "axisA_role"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:practical-support",
        "definition": "동의한 구체적 부담을 덜어줌",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "합의한 의무와 자발적 도움을 구분하는가?",
    "jointReason": "못 지킬 가능성을 미리 알림 / 동의한 구체적 부담을 덜어줌의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "맡은 역할을 수행하면서 추가 지원의 한도를 알림",
    "risk": "타인을 챙긴다는 이유로 자신의 의무를 남에게 넘김",
    "goodIntentionMistake": "책임 있게 하려 도움을 무기한 의무로 바꿈",
    "twist": "지원 요청을 거절해도 맡은 약속은 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 가사 분담과 추가 돌봄 요청을 별도로 의논하는 장면"
    },
    "behaviorQuestion": "합의한 의무와 자발적 도움을 구분하는가?",
    "conditions": [
      "실제 역할·보호 의무·추가 요청·동의·여력 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "의무를 다해도 모든 사람에게 도움을 줄 수 없음",
    "exclusions": [
      "돌봄·책임으로 좋은 가족·도덕성 확정",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C073의 지속 지원보다 의무·호의의 분리",
    "applicabilityRef": "fkr:app:complement:C095",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "help",
          "researchRef": "sar:tag:help",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "intimate-attraction",
          "researchRef": "sar:tag:intimate-attraction",
          "relation": "NOT_EQUIVALENT",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:complement:C096",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:semantic-fusion",
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "complement_rule",
    "existingRuleId": "C096",
    "existingRuleSha256": "93c5660ecfef525093ef11bf5ce7753593946f25ba3327651b0c9571175e268d",
    "group": "CHANGE_RECOVERY",
    "researchRelation": "task_complement",
    "originalMeaning": "더 크게 성장하고 싶어 하면서도 생활과 기반까지 무너뜨리고 싶지는 않은 사람으로 이어질 수 있습니다.",
    "originalDomains": [],
    "contexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "myeongli": {
      "features": [],
      "researchRefs": [],
      "meaning": "실제 명리 profile에서 선택한 방향의 유효한 축 근거가 필요; 연구 facet은 계산 사실이 아님",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [],
      "requiredSourceAxes": [
        "EXPANSION",
        "STABILITY"
      ],
      "meaning": "명리 쪽과 다른 축 역할을 지원하는 실제 primary trait node가 필요; prior·pair·bridge hint 제외",
      "sourceStatus": "specific_source_not_yet_bound"
    },
    "facets": [
      {
        "axis": "EXPANSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPANSION:scope-extension",
        "definition": "같은 기능의 적용 범위를 넓힘",
        "role": "axisA_role"
      },
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:protective-change",
        "definition": "지속을 위해 필요한 변경을 수용",
        "role": "axisB_role"
      }
    ],
    "orientationPolicy": "both_source_assignments_require_independent_review",
    "coreMeaning": "범위를 넓힐 때 지켜야 할 기반은 무엇인가?",
    "jointReason": "같은 기능의 적용 범위를 넓힘 / 지속을 위해 필요한 변경을 수용의 서로 다른 기여가 같은 과제에서 필요한지 확인한다.",
    "positive": "확장 시험과 최소 유지 자원을 따로 둠",
    "risk": "안정도 성장도 모두 지키려 부담을 누적",
    "goodIntentionMistake": "기반을 보호한다며 필요한 축소를 계속 미룸",
    "twist": "일부 확장을 접는 것이 다음 변화의 기반을 남길 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 업무를 맡기 전 기존 생활의 필수 시간을 남기는 장면"
    },
    "behaviorQuestion": "범위를 넓힐 때 지켜야 할 기반은 무엇인가?",
    "conditions": [
      "실제 기반·확대 비용·유지 책임·중단 선택권 확인",
      "두 축이 같은 과제·owner·허용 Context에 실제로 적용돼야 한다.",
      "명리/MBTI 역할을 바꾼 반대 배정도 독립 검토하며 자동 대칭 승인하지 않는다."
    ],
    "counterexample": "확장하지 않는 것이 현재 더 적합할 수 있음",
    "exclusions": [
      "두 축이 있으므로 기반 손실 없이 성장 보장",
      "축의 점수만으로 facet의 세부 행동을 관찰한 것으로 처리하지 않는다."
    ],
    "distinction": "C048은 운영 가능성, 이 규칙은 확장과 최소 기반의 긴장",
    "applicabilityRef": "fkr:app:complement:C096",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "accumulation",
          "researchRef": "sar:tag:accumulation",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        },
        {
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
          "relation": "ONE_TO_MANY",
          "exactEquivalenceApproved": false
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  }
];
