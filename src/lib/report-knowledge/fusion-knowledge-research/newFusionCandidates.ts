/** Static offline Fusion knowledge; source file/export paths stay in the audit catalog. */
import type { FusionMaterial } from "./fusionResearchTypes";
export const NEW_FUSION_CANDIDATES: readonly FusionMaterial[] = [
  {
    "id": "fkr:candidate:intj-official-process",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTJ",
          "area": "workplace",
          "traitId": "anti_politics_work_style",
          "file": "docs/product/mbti/source/INTJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
          "sha256": "c51c73b93437abd92c1ce601ccccb2c0901ccc340293c88eeb5135863c42f718",
          "plainKoSha256": "2cd4a099223cd20b305ce9054b48bdfb6b498f80b12c21d7984bbad52054a38d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "가십, 사내 정치, 눈치 보기, 비공식 줄서기를 업무 능력으로 보지 않는다. 이런 요소가 많을수록 조직에 대한 흥미가 급격히 떨어진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "공식 기준과 비공식 기대의 경계",
    "jointReason": "규칙을 지키는 역할과 줄서기를 거부하는 업무 선호를 분리",
    "positive": "평가 기준과 승인 통로를 공개하도록 요청",
    "risk": "비공식 관계를 모두 부정하며 필요한 협의도 닫음",
    "goodIntentionMistake": "정당한 절차를 만들려 타인의 생존 전략을 비난",
    "twist": "공식 설명을 요청하는 작은 행동이 기준을 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 업무 지시와 사적 부탁의 승인권을 나누는 장면"
    },
    "behaviorQuestion": "공식 기준과 비공식 기대의 경계을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "공식 평가·거절 안전·실제 권한 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "조직의 비공식 교류가 항상 부당한 것은 아님",
    "exclusions": [
      "유형으로 정직함·조직 갈등 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C027의 위임 책임과 다르게 비공식 기대의 정당성",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:intj-official-process",
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
    "id": "fkr:candidate:intj-expertise-price",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_pian_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:pian_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:pian_yin:8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "recordSha256": "8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "남이 넘긴 질문을 끝까지 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTJ",
          "area": "money",
          "traitId": "expertise_income_path",
          "file": "docs/product/mbti/source/INTJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "inferred",
          "sourceVersion": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
          "sha256": "4569fdbe0d5b6a99c0549d11711247006acae08b139954dd89ac15eb9502d63d",
          "plainKoSha256": "5d947010755f3c193bd910b8a9370317d026c329b971ec1e89333a8fff262b3e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "돈은 넓은 인기보다 희소한 전문성과 문제 해결 능력에서 만들어진다. 스스로의 지식과 전략이 시장에서 교환될 때 수입이 커진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "이해의 깊이와 제공할 서비스 범위",
    "jointReason": "깊게 파는 탐구 후보를 전문성 수입이라는 inferred 원천과 비교하되 실제 수요를 별도 검증",
    "positive": "어디까지 설명·수정할지 대가와 함께 정함",
    "risk": "지식의 깊이를 실제 가격·수요로 착각",
    "goodIntentionMistake": "도움을 주려 무제한 추가 설명을 제공",
    "twist": "설명을 줄여 적용 범위를 명확히 하는 것이 가치가 될 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 자문 범위와 후속 질문 한도를 계약 전에 정하는 장면"
    },
    "behaviorQuestion": "이해의 깊이와 제공할 서비스 범위을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "inferred 상태·실제 전문성·수요·가격 권한 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "깊이 있는 지식도 시장 수요가 없을 수 있음",
    "exclusions": [
      "편인·INTJ로 고수익 전문직 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "entj-made-value의 산출 판매와 자문 범위는 다른 대상",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:intj-expertise-price",
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
    "id": "fkr:candidate:intp-review-window",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_qi_sha"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:qi_sha",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:qi_sha:772e2f835195bbd7ae171796d6507aa2ec10a4efdb9dd0be7535729ef4a3b80d",
          "recordSha256": "772e2f835195bbd7ae171796d6507aa2ec10a4efdb9dd0be7535729ef4a3b80d",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "급한 순간 앞에 서서 결정하는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTP",
          "area": "workplace",
          "traitId": "needs_thinking_time",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
          "sha256": "c0baa7582e9c48cf7f3680769b4282242a46d2952bbc8832acd1811bd3a48ced",
          "plainKoSha256": "0744f9e46934b3bbe67347f67d651f543e9c3fff29270f033ae5b79e6da8aef8"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "회의 자리에서 즉답을 기대하면 장점이 덜 나온다. 주제를 미리 받고 혼자 정리할 시간이 있을 때 더 깊고 날카로운 답을 낸다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "ENERGY_DIRECTION",
        "direction": 1,
        "facetRef": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "즉답 요청과 필요한 숙고 시간의 협의",
    "jointReason": "압박 역할 후보와 사전 정리 선호를 보고 시점의 선택으로 비교",
    "positive": "지금 알릴 상태와 뒤에 답할 판단을 나눔",
    "risk": "정리 시간을 이유로 필요한 중간 보고까지 미룸",
    "goodIntentionMistake": "정확한 답을 주려 위기 알림을 늦춤",
    "twist": "아직 모른다는 즉시 보고가 숙고 시간을 보호할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 장애 상황을 먼저 공유하고 원인 답변 시점을 정하는 장면"
    },
    "behaviorQuestion": "즉답 요청과 필요한 숙고 시간의 협의을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 긴급성·정리 선호·보고 의무·권한 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "모든 과제가 즉답을 필요로 하지는 않음",
    "exclusions": [
      "INTP로 대응이 느리거나 편관으로 위기 역량 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "intp-pressure-learning은 원인 학습, 이 후보는 중간 보고·검토 시간",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:intp-review-window",
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
    "id": "fkr:candidate:entj-resource-learning",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_yin:7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "money",
          "traitId": "capitalist_resource_logic",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/money/1",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "2fd5cb824effc3af530eba2ef7c1972ae831311f61b97619e178718ecc903b51",
          "plainKoSha256": "c975c69eca24f1a3b2dd58ea6902108c6bc9b83ce8f4b7f1fcbd7341f83cd11d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "자본주의와 성과 구조에 대한 감각이 강하다. 돈을 단순 소비가 아니라 목표 달성에 필요한 자원, 사람을 움직이는 수단, 구조를 확장하는 레버리지로 본다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "자원을 늘리기 전 배울 필요와 사람의 선택권",
    "jointReason": "배움·지원 후보를 자원 운용 선호와 비교하되 타인을 수단으로 환원하지 않음",
    "positive": "교육 시간·도구·지원 예산을 실제 참여자와 조율",
    "risk": "교육 투자면 사람의 성과가 반드시 늘어난다고 기대",
    "goodIntentionMistake": "성장을 돕자며 원치 않는 교육·역할을 강요",
    "twist": "투자를 줄이고 필요한 도움을 묻는 것이 더 유효할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 팀 교육 예산에 참여자의 실제 학습 시간을 포함하는 장면"
    },
    "behaviorQuestion": "자원을 늘리기 전 배울 필요와 사람의 선택권을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 학습 필요·예산·고용 권한·자발성 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "학습 자료가 있어도 참여 여력이 없을 수 있음",
    "exclusions": [
      "정인·ENTJ로 인재 운영 능력·수익 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C047의 자원 순서보다 배우는 사람의 여건·선택권",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:entj-resource-learning",
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
    "id": "fkr:candidate:entj-score-question",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "study"
    ],
    "contexts": [
      "learning"
    ],
    "myeongli": {
      "features": [
        "ten_god_shang_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:shang_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:shang_guan:bc99009644343d85b0161b881f90ac0fc7e9954cfd65f69a4f187d4e08344c3b",
          "recordSha256": "bc99009644343d85b0161b881f90ac0fc7e9954cfd65f69a4f187d4e08344c3b",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "허점을 보고 새로운 답을 꺼내는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "study",
          "traitId": "high_achievement_study",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/study/0",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "defc9bb0e8d8708a67d624bc1aeaa9923d950ae0f5de20a552dc3cdea22fedb5",
          "plainKoSha256": "3aa6af125f50c78b37670cce2eece4965095c90d3daa2ca35534ac7107a972b3"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTJ는 학업을 실력 증명과 목표 달성의 장으로 받아들이기 쉽다. 목표 점수, 순위, 평가 기준이 분명할수록 집중력이 올라가고, 능력을 인정받는 환경에서 더 강하게 밀어붙인다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "COMPETITION",
        "direction": 1,
        "facetRef": "sar:facet:COMPETITION:reference-choice",
        "definition": "비교할 기준을 목적에 맞게 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "평가에 유리한 답과 근거를 묻는 질문",
    "jointReason": "상관의 기존 답 검토 후보를 평가 선호와 비교",
    "positive": "점수 기준을 이해하되 틀린 전제를 질문할 통로 확보",
    "risk": "높은 점수를 위해 확인하지 않은 답을 확정",
    "goodIntentionMistake": "좋은 성적을 돕자며 다른 질문을 방해로 취급",
    "twist": "평가와 무관한 질문도 다음 과제 이해를 도울 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 시험 답안 기준과 실제 개념의 예외를 따로 정리하는 장면"
    },
    "behaviorQuestion": "평가에 유리한 답과 근거를 묻는 질문을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 평가·자료·질문 안전·본인 선호 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "경쟁을 원하지 않아도 명확한 평가를 선호할 수 있음",
    "exclusions": [
      "상관+ENTJ로 합격·논쟁 능력 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C034는 경쟁 목표, 이 후보는 평가와 질문의 다른 목적",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:entj-score-question",
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
    "id": "fkr:candidate:entp-accountable-method",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTP",
          "area": "workplace",
          "traitId": "autonomy_required",
          "file": "docs/product/mbti/source/ENTP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
          "sha256": "7ecd06a09dcb82d85dc0371268f747e382c6dc1cd809e46c5075150631715b7e",
          "plainKoSha256": "3f3a7056b94a574fd3b2182b4ffb6bd1a73c3c4b8b840f93061bb269f47b0e5d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTP는 이유 없는 지시, 촘촘한 감시, 위계적인 명령 체계에서 능률이 떨어진다. 목표만 분명하다면 방식은 스스로 설계할 때 훨씬 강하다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "약속한 결과와 방법 재량의 구획",
    "jointReason": "정관의 의무와 실제 업무 재량 선호를 분리",
    "positive": "기한·결과를 지키되 방법 변경을 공유",
    "risk": "자기 방법을 지키려 공동 의존성을 무시",
    "goodIntentionMistake": "효율을 돕자며 승인 없이 절차를 바꿈",
    "twist": "합의한 제약이 있으면 재량을 더 안전하게 쓸 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 납기 고정과 도구 선택의 자유를 따로 합의하는 장면"
    },
    "behaviorQuestion": "약속한 결과와 방법 재량의 구획을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "직무 재량·기한·공유 의무·안전 절차 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "이유 있는 표준 절차가 더 적합할 수 있음",
    "exclusions": [
      "ENTP는 지시를 못 따른다고 단정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "기존 sar accountable-choice와 핵심 공유; 구체 업무 조건 확장",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:entp-accountable-method",
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
    "id": "fkr:candidate:infj-fair-role",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFJ",
          "area": "workplace",
          "traitId": "horizontal_structure_fit",
          "file": "docs/product/mbti/source/INFJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "394227f31f485014d3f8be75060d1f03b3b3afa13cd464c9b1716624bf3f6500",
          "sha256": "4d939ac685a6d57573fe725bbd12b75047e381dee843cda1c6c111cf70855a5d",
          "plainKoSha256": "7920656d5923663f214c95918124951f6ad41a598843fa163a57bcb474339669"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFJ는 조직적인 집단에서도 수평적인 구조가 편하다. 위계적이고 명령 중심적인 조직에서는 적응이 어렵고 능력 발휘가 막히기 쉽다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:renegotiation",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "위계의 존재와 책임을 말할 수 있는 권리",
    "jointReason": "정관의 역할 기준과 수평 협의 선호는 반대 사실이 아니라 권한의 적용 조건",
    "positive": "책임을 맡기 전 지원과 이견 통로를 협의",
    "risk": "공식 권한이 있다는 이유로 구성원의 의견을 닫음",
    "goodIntentionMistake": "평등하게 돕자며 실제 보호 책임까지 같은 양으로 배분",
    "twist": "역할 비대칭을 밝히는 것이 공정한 협의의 출발일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 책임자에게 필요한 자원과 반론 절차를 요청하는 장면"
    },
    "behaviorQuestion": "위계의 존재와 책임을 말할 수 있는 권리을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "공식 역할·거절 불이익·지원·실제 조직 조건 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "수평적 말투라도 권력 차이는 남을 수 있음",
    "exclusions": [
      "INFJ로 위계 적응 불능·정관으로 권위 정당화",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C027의 위임 수행보다 책임 협의의 안전",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:infj-fair-role",
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
    "id": "fkr:candidate:infj-value-budget",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_cai"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_cai",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_cai:7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFJ",
          "area": "money",
          "traitId": "meaning_first_income_risk",
          "file": "docs/product/mbti/source/INFJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "394227f31f485014d3f8be75060d1f03b3b3afa13cd464c9b1716624bf3f6500",
          "sha256": "d54edd48cfecad7db67483bf4045854efb59a433ae9eca6de6fca2c31d8ba9ce",
          "plainKoSha256": "60413848d9799e814ce856a65e9ff4d764cdea4080d9d3bfee7bbd494e537bac"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFJ는 이상과 사명감을 우선해 수입 최적화가 뒤로 밀릴 수 있다. 진로 선택에서 의미와 조건을 함께 보지 않으면 장기적인 생활 안정성이 약해진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "MEANING",
        "direction": 1,
        "facetRef": "sar:facet:MEANING:value-practice",
        "definition": "중요한 가치를 구체적 선택으로 옮김",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "뜻 있는 선택을 지속할 생계 여력",
    "jointReason": "정재의 유지 후보와 의미 우선 원천을 생활 한도라는 조건에서 비교",
    "positive": "가치 실천과 필수 생활비를 함께 계획",
    "risk": "의미를 지키려 생계 위험을 미화",
    "goodIntentionMistake": "좋은 일을 돕자며 보수 협의를 부끄럽게 여김",
    "twist": "보상을 분명히 요구하는 것이 가치 있는 일을 지속하게 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 사회 활동 시간과 최소 보수를 같이 적는 장면"
    },
    "behaviorQuestion": "뜻 있는 선택을 지속할 생계 여력을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "본인 가치·실제 여력·보상 조건·지원 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "의미를 우선해도 재무 여력이 충분할 수 있음",
    "exclusions": [
      "INFJ이므로 저소득·불안정 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C040의 가치 배분과 핵심 공유; 생계 지속 조건을 좁힘",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:infj-value-budget",
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
    "id": "fkr:candidate:infp-paid-output",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_shi_shen"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:shi_shen",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:shi_shen:1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
          "recordSha256": "1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "생각을 내 손으로 보여주는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFP",
          "area": "money",
          "traitId": "low_material_drive",
          "file": "docs/product/mbti/source/INFP.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
          "sha256": "08406615ad1ee236e78f7a2c4e1359668e46f6f3ec2b88aba29dfec4555014bb",
          "plainKoSha256": "ef67a563f6fe5b179c27d4901570680ecb8500be3c77edf77489b09c26967384"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFP는 돈·권력·명예 같은 물질적 욕구에 매달리기보다 의미와 진정성을 우선하기 쉽다. 그래서 수입을 키우려면 좋아하는 가치와 현실적인 보상 구조를 의식적으로 연결해야 한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "좋아하는 결과물과 유료 제공할 범위",
    "jointReason": "식신의 산출 후보와 의미 우선 원천은 실제 제작·보상 의사가 있을 때만 연결",
    "positive": "무료로 나눌 부분과 유료 수정 범위를 구분",
    "risk": "진정성 있는 작업이면 보상도 자연히 온다고 기대",
    "goodIntentionMistake": "뜻을 돕자며 제공 노동의 가격을 계속 낮춤",
    "twist": "돈을 받는 경계가 결과물의 의미를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 창작 의뢰의 완료·수정·사용 범위를 정하는 장면"
    },
    "behaviorQuestion": "좋아하는 결과물과 유료 제공할 범위을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 제작 활동·수요·본인 보상 의사·가격 권한 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "작업을 상업화할 의사가 없을 수 있음",
    "exclusions": [
      "식신·INFP로 예술 재능·수입 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "entj-made-value와 달리 무상/유상 범위와 가치 보전",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:infp-paid-output",
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
    "id": "fkr:candidate:infp-chosen-learning",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_yin:7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFP",
          "area": "workplace",
          "traitId": "autonomy_required",
          "file": "docs/product/mbti/source/INFP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
          "sha256": "8fdf31b355c616feb78bc871e91b6c2ddd7f11563eeb9b648d90d67ad26f9f96",
          "plainKoSha256": "74580027ae5ad27e773634ec2a08d5d721bdfcf9645f255fcbf4bc8eb869d876"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFP는 업무 재량이 없고 위에서 정한 절차만 따라야 하는 환경에서 힘을 잃는다. 자신이 의미를 느끼고 방법을 선택할 수 있을 때 근면성실함이 살아난다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "필요한 안내를 스스로 고를 수 있는 학습",
    "jointReason": "정인의 배움·지원 후보를 업무 방법 선택과 비교",
    "positive": "배울 도움을 받고 사용할 방법을 협의",
    "risk": "자율을 지키려 필요한 안내까지 거절",
    "goodIntentionMistake": "성장을 돕자며 모든 과정을 혼자 맡김",
    "twist": "도움을 선택하는 것이 재량을 넓힐 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 도구 교육 뒤 수행 순서를 스스로 고르는 장면"
    },
    "behaviorQuestion": "필요한 안내를 스스로 고를 수 있는 학습을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 과제·안내 접근·방법 재량·본인 선호 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "정해진 안전 교육은 선택 범위 밖일 수 있음",
    "exclusions": [
      "유형으로 독학·학습 능력 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C069와 핵심 공유; 업무 재량과 안내 접근이라는 조건 확장",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:infp-chosen-learning",
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
    "id": "fkr:candidate:enfj-care-budget",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_cai"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_cai",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_cai:7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFJ",
          "area": "money",
          "traitId": "generous_spending",
          "file": "docs/product/mbti/source/ENFJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
          "sha256": "a3a45a773d25b99dba2a1200ab9dd00190606201ad57b8d7bac6e23688baacbb",
          "plainKoSha256": "6dd02b6720d006de9ef834a8f5bea1fb730a37440e6dba3548539347b649e798"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFJ는 대가 없는 베풂을 좋아하고, 호감 있는 사람에게는 아낌없이 주려는 성향이 있다. 돈을 관계와 돌봄의 언어로 쓰기 쉽다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "돌봄 지출의 동의와 지속 가능한 한도",
    "jointReason": "정재 관리 후보와 베풂 원천을 같은 지원의 비용·요청에서 비교",
    "positive": "누구의 필요에 어떤 비용을 쓸지 여력과 함께 확인",
    "risk": "지출의 크기를 애정이나 선함으로 평가",
    "goodIntentionMistake": "좋은 마음을 보이려 공동 돈을 먼저 약속",
    "twist": "돈 대신 다른 지원을 제안하는 것도 돌봄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 가족 지원 금액과 다음 달 필수비를 나눠 보는 장면"
    },
    "behaviorQuestion": "돌봄 지출의 동의와 지속 가능한 한도을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 요청·소유·공동 동의·개인 한도 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "베푸는 선호가 있어도 현재 지출 여력은 없을 수 있음",
    "exclusions": [
      "ENFJ로 선함·보답·재물 운 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "help 규칙의 수혜/제공과 달리 지원 비용·소유가 핵심",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:enfj-care-budget",
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
    "id": "fkr:candidate:enfj-shared-choice",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_bijian"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:bijian",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:bijian:bdcbc44a5a262791cabcfd3165daad55831189de4069200af638a4dedf667e6e",
          "recordSha256": "bdcbc44a5a262791cabcfd3165daad55831189de4069200af638a4dedf667e6e",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "자기 기준이 분명합니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFJ",
          "area": "workplace",
          "traitId": "collaborative_environment",
          "file": "docs/product/mbti/source/ENFJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
          "sha256": "a122642407d729f4339eaecff56962c62fd39c0c0d5cc2a4060caf8880487a7c",
          "plainKoSha256": "8d219f175811e20225e227fec5e4e97d118bc8d5b0784575d0dc6a95a9b72c8e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFJ는 혼자 오래 버티는 일보다 사람들과 목표를 나누고 협력하는 환경에서 에너지가 살아난다. 관계의 의미가 보일수록 책임감도 강해진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "함께 목표를 나누되 방법의 재량을 남기기",
    "jointReason": "비견의 독립 후보와 협력 환경 선호를 공동 결과·개인 방법으로 분리",
    "positive": "공동 목표와 맡은 방법을 함께 합의",
    "risk": "협력을 모든 과정의 동행·즉답 의무로 확대",
    "goodIntentionMistake": "소속감을 돕자며 혼자 정리할 시간을 없앰",
    "twist": "개인 방법을 존중하면 협력의 정보가 늘 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 팀 목표는 공유하되 작업 방식을 각자 고르는 장면"
    },
    "behaviorQuestion": "함께 목표를 나누되 방법의 재량을 남기기을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 협업·재량·공동 의존·동의 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "혼자 하는 과제가 더 적합한 단계도 있음",
    "exclusions": [
      "비견과 협력 선호를 필연적 충돌로 단정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C059와 핵심 공유; 업무 결과·방법 재량 조건을 추가",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:enfj-shared-choice",
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
    "id": "fkr:candidate:enfp-renewable-routine",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFP",
          "area": "workplace",
          "traitId": "novelty_required_work",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "d8685fab29595435c32cde027da986ad4900e5734c7bad26d143b5c28057a482",
          "plainKoSha256": "3e6855d9cb854cbe5a02bfaa327200e5b63faa9f913e8754b8c498cb117ef0e8"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP는 세부 반복이나 단순노동에 쉽게 지루함을 느낀다. 새로운 사람, 새로운 문제, 새로운 표현 방식이 있을 때 업무 에너지가 살아난다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CHANGE_ORIENTATION",
        "direction": 1,
        "facetRef": "sar:facet:CHANGE_ORIENTATION:novelty-trial",
        "definition": "새 방식의 일부를 시험",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "반복해야 할 약속과 바꿀 수 있는 자극",
    "jointReason": "정관의 의무 후보와 새로움 선호를 유지 대상과 방법 탐색으로 분리",
    "positive": "약속한 결과를 유지하며 작은 변화의 구간을 둠",
    "risk": "지루함을 이유로 기한·역할까지 바꿈",
    "goodIntentionMistake": "참여를 돕자며 모든 반복 일을 타인에게 넘김",
    "twist": "반복의 최소 범위가 있으면 새 실험을 지속할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 정기 보고의 필수 항목은 두고 설명 방법만 시험하는 장면"
    },
    "behaviorQuestion": "반복해야 할 약속과 바꿀 수 있는 자극을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 반복 과제·변경권·기한·협업 영향 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "새로움 없이도 본인에게 중요한 반복은 유지할 수 있음",
    "exclusions": [
      "ENFP로 인내심 부족·정관과 불화 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "entp-rules는 가능성 탐색, 이 후보는 반복 자극·의무 비용",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:enfp-renewable-routine",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
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
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
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
    "id": "fkr:candidate:enfp-question-practice",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "study"
    ],
    "contexts": [
      "learning"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_yin:7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFP",
          "area": "study",
          "traitId": "interest_switch_learning",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/study/0",
          "sourceCoverage": "direct",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "31a0c3d2cdbe0337ed28d07ec72a476f42ba7ec2bd3f32666f5c44b3e8fea233",
          "plainKoSha256": "16a1c664ddeda9a85aa4a61b42fb2ae24be2709805953bf3a2e0288eec17c448"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP는 관심이 있으면 매우 열심히 하고 높은 성취도 가능하지만, 관심이 없으면 버티기 어렵다. 공부의 성패는 의지보다 의미와 흥미를 어떻게 붙이는지에 달려 있다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-parking",
        "definition": "당장 필요 없는 질문을 보관",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "관심 이동 속에서 다시 확인할 학습을 남기기",
    "jointReason": "정인의 배움 후보와 흥미 전환 원천을 복습·질문 보류의 조건으로 비교",
    "positive": "새 관심을 따르되 확인할 최소 개념을 적음",
    "risk": "재미없는 자료는 모두 필요 없다고 평가",
    "goodIntentionMistake": "몰입을 돕자며 과제의 기본 요건까지 바꿈",
    "twist": "흥미 없는 부분의 작은 이해가 다른 관심을 연결할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 주제로 넘어가기 전 핵심 질문 하나를 복습하는 장면"
    },
    "behaviorQuestion": "관심 이동 속에서 다시 확인할 학습을 남기기을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 학습 과제·본인 관심·필수 기준·피드백 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "흥미가 적어도 역할 때문에 꾸준히 학습할 수 있음",
    "exclusions": [
      "유형으로 성적·의지·지능 단정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "sar curious-method와 핵심 공유; 관심 이동과 복습의 조건 확장",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:enfp-question-practice",
    "legacyTagReview": {
      "relatedTags": [
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
    "id": "fkr:candidate:istj-safe-question",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_shang_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:shang_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:shang_guan:bc99009644343d85b0161b881f90ac0fc7e9954cfd65f69a4f187d4e08344c3b",
          "recordSha256": "bc99009644343d85b0161b881f90ac0fc7e9954cfd65f69a4f187d4e08344c3b",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "허점을 보고 새로운 답을 꺼내는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISTJ",
          "area": "workplace",
          "traitId": "rule_following_reliability",
          "file": "docs/product/mbti/source/ISTJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a",
          "sha256": "dc2a76ff9861115a8f5deec7caced0c891029bfdcdb3b3e72f48f7f84b4043fe",
          "plainKoSha256": "718254e25a4059b2ee415f8c20895622eb30fde5652862527de34c9fa2821cee"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "정해진 규칙과 약속을 지키는 데 강하다. 조직에서는 '맡기면 한다'는 인상을 주고, 기준을 흐리는 사람에게는 불편함을 느낀다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "STRUCTURE_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "definition": "반드시 지킬 최소 절차를 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "규칙을 지키면서 예외를 질문할 통로",
    "jointReason": "상관의 답 검토 후보와 규칙 이행 선호를 승인된 피드백 통로에서 비교",
    "positive": "운영 기준을 유지하고 실제 불편의 예외를 제안",
    "risk": "규칙을 고친다는 이유로 기존 책임을 축소",
    "goodIntentionMistake": "오류를 막으려 개선 의견을 불복종으로 막음",
    "twist": "규칙 안의 질문 통로가 기준의 일관성을 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 절차 준수 기록과 수정 제안을 다른 문서로 남기는 장면"
    },
    "behaviorQuestion": "규칙을 지키면서 예외를 질문할 통로을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 규칙·변경권·반론 안전·관찰 자료 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "규칙이 이미 문제를 잘 해결하는 경우도 있음",
    "exclusions": [
      "상관·ISTJ로 내적 모순·권위 갈등 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "entp-rules의 탐색 욕구와 기준 내 피드백의 차이",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:istj-safe-question",
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
    "id": "fkr:candidate:isfj-guided-depth",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_pian_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:pian_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:pian_yin:8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "recordSha256": "8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "남이 넘긴 질문을 끝까지 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISFJ",
          "area": "workplace",
          "traitId": "guideline_micro_manager",
          "file": "docs/product/mbti/source/ISFJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
          "sha256": "4cd49117c76236fde2a61e0bbc7f2fe289e1b99ba1ad3699443b644628f66352",
          "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "업무를 주거나 받을 때 대충 넘기기보다 구체적인 기준과 순서를 원한다. 중간에 계획이 흔들리는 것을 싫어하고, 일관된 진행을 안정으로 느낀다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "STRUCTURE_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:STRUCTURE_STYLE:change-log",
        "definition": "계획 변경을 서로 확인 가능한 기록으로 남김",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "자세한 절차와 그 절차의 이유를 연결",
    "jointReason": "편인의 이유 탐구 후보와 구체 순서 선호를 변경 설명에서 비교",
    "positive": "지킬 순서와 바뀐 이유를 함께 기록",
    "risk": "왜 그런지의 답이 완전해야만 일을 시작",
    "goodIntentionMistake": "안정감을 주려 예외가 많은 절차를 숨김",
    "twist": "조건부 예외를 공개하면 절차의 예측 가능성이 높아질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 업무 기준 변경 때 목적과 시행 범위를 적는 장면"
    },
    "behaviorQuestion": "자세한 절차와 그 절차의 이유를 연결을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 절차·자료·변경권·확인 기한이 있음",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "이유를 몰라도 안전 절차는 즉시 따라야 할 수 있음",
    "exclusions": [
      "ISFJ로 경직성·편인으로 통찰 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C090은 적응, 이 후보는 절차의 원인 설명·예외 기록",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:isfj-guided-depth",
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
          "tag": "consistency",
          "researchRef": "sar:tag:consistency",
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
    "id": "fkr:candidate:isfj-budgeted-making",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_shi_shen"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:shi_shen",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:shi_shen:1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
          "recordSha256": "1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "생각을 내 손으로 보여주는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISFJ",
          "area": "money",
          "traitId": "frugal_stable_money",
          "file": "docs/product/mbti/source/ISFJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
          "sha256": "d7de4e18454c3b221b1d336262189ed6caa5ee72d82231fe228d59797e5ccb86",
          "plainKoSha256": "7cb622594dff6a2b55db5f37e0d6148646a89bbce04de0d7b5f82293e4ece585"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "불필요한 소비를 줄이고 필요한 지출을 계획하는 성향이 강하다. 돈은 과감하게 불리는 대상보다 생활을 안정시키는 안전망으로 보는 쪽에 가깝다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "작은 제작 시험과 기본 생활비의 분리",
    "jointReason": "식신 산출 후보와 생활 안전망 선호를 가역 시험 예산으로 비교",
    "positive": "필수 비축을 남기고 제작을 작은 범위에서 시험",
    "risk": "완전한 안전을 기다려 유효한 시험까지 미룸",
    "goodIntentionMistake": "성장을 돕자며 비상금을 제작비로 전환",
    "twist": "돈을 쓰지 않는 시험으로도 제작 질문을 확인할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 도구 제작의 재료비와 생활비 한도를 따로 두는 장면"
    },
    "behaviorQuestion": "작은 제작 시험과 기본 생활비의 분리을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 제작 의사·비축·소유·가역성 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "제작물에 관심이 없으면 연결할 과제도 없음",
    "exclusions": [
      "식신·ISFJ로 자영업·저축 성공 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "INFP 유료 범위와 달리 제작 시험·생활 안전망 조건",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:isfj-budgeted-making",
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
    "id": "fkr:candidate:estj-learning-handoff",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_yin:7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTJ",
          "area": "workplace",
          "traitId": "clear_expectations",
          "file": "docs/product/mbti/source/ESTJ.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "8187be30ddd97adf87c1afedf15f179da1a25aa871dfa0ad9a6aadf6d4a25fc6",
          "sha256": "2640939c58d4d5990b690232e366f519cf2ea7b5ac01717cca9e808f9111b274",
          "plainKoSha256": "843cb5aa623a28a56fb9e8d5504b18e374a6511bdc96ea59aa9ca7e1a09128e8"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTJ는 구성원에게 무엇을 언제까지 어떤 기준으로 해야 하는지 분명히 알려주는 편이다. 애매한 지시나 책임 없는 협업을 싫어한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "분명한 지시 뒤 실제 익힐 기회가 있는가?",
    "jointReason": "정인의 지원·학습 후보와 기대 명시 원천을 인수인계 과정에 연결",
    "positive": "결과 기준과 연습·질문할 자원을 함께 제공",
    "risk": "분명히 말했으니 이미 이해했다고 판단",
    "goodIntentionMistake": "책임감을 돕자며 교육 없이 업무를 넘김",
    "twist": "상대가 다시 설명하게 두면 지시의 빈칸을 알 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 새 업무를 맡기며 완료 기준과 연습 시간을 함께 정하는 장면"
    },
    "behaviorQuestion": "분명한 지시 뒤 실제 익힐 기회가 있는가?을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 지휘권·교육 접근·질문 안전·역할 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "설명이 정확해도 수행 도구나 시간이 없을 수 있음",
    "exclusions": [
      "정인·ESTJ로 교육·관리 역량 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C036은 정확한 완료, 이 후보는 인수인계·학습 접근",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:estj-learning-handoff",
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
    "id": "fkr:candidate:esfj-shared-budget",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_cai"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_cai",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_cai:7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFJ",
          "area": "money",
          "traitId": "save_and_enjoy",
          "file": "docs/product/mbti/source/ESFJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "40e80ffb692c97690487293c0d59b87715fa6ab25ce6978ec3eefc890525bcf8",
          "sha256": "8f59c3cd894c88b237bf44fa5fe37eca8b8b0643202a3d1d5a5acc80b8118e60",
          "plainKoSha256": "13e5f1acbde258cdf66bc4e3f96ceae2b7017b53209c7c3c1f14b5cb338f9196"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "돈을 모으는 것을 좋아하면서도 좋은 음식이나 사람들과 함께하는 소비에는 만족을 느낀다. 절약 자체보다 생활의 안정과 관계의 즐거움이 함께 있어야 돈의 의미가 커진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "함께 즐길 비용과 각자의 사용권",
    "jointReason": "정재 축적 후보와 공동 즐거움 원천을 필수비·선택비로 분리",
    "positive": "비축을 유지하며 자발적 참여의 예산을 합의",
    "risk": "함께 소비하지 않는 사람을 관계에 무관심하다고 평가",
    "goodIntentionMistake": "즐겁게 해주려 타인의 비용을 먼저 결정",
    "twist": "돈을 쓰지 않는 만남도 원하는 즐거움을 줄 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 모임 장소를 정하며 각자의 지출 한도를 먼저 묻는 장면"
    },
    "behaviorQuestion": "함께 즐길 비용과 각자의 사용권을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 비용·소유·참여 동의·비축 목적 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "공동 소비보다 각자의 활동이 편할 수 있음",
    "exclusions": [
      "ESFJ로 소비 습관·우정의 크기 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C041의 개인 선택권 교환과 공동 참여 비용은 다름",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:esfj-shared-budget",
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
    "id": "fkr:candidate:istp-tool-understanding",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "money"
    ],
    "contexts": [
      "money"
    ],
    "myeongli": {
      "features": [
        "ten_god_pian_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:pian_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:pian_yin:8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "recordSha256": "8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "남이 넘긴 질문을 끝까지 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISTP",
          "area": "money",
          "traitId": "practical_spending",
          "file": "docs/product/mbti/source/ISTP.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
          "sha256": "1bfac198a56ea421abc1b83499b78c5f0069628275e36b57fc48ef7b889efcd2",
          "plainKoSha256": "84b89c64b12be8f6d6c99835b8e743440dfd2e68da8124270d65a17d9cc5aa03"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "돈은 감정적 과시보다 실제 쓸모와 품질에 쓰는 편이다. 고품질 장비나 필요한 물건에는 아끼지 않지만, 쓸데없는 소비는 줄이려 한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "도구의 작동 이해와 실제 구매 필요",
    "jointReason": "편인의 이유 탐구 후보와 품질·쓸모 지출 선호를 검증 가능한 사용 조건에서 비교",
    "positive": "작동 원리를 확인하고 필요한 기능에만 자원을 배분",
    "risk": "사양을 깊게 알면 비용도 정당하다고 착각",
    "goodIntentionMistake": "좋은 장비를 추천하려 사용자의 실제 수준을 무시",
    "twist": "이미 가진 도구를 이해하면 새 구매를 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 장비 고장의 원인과 교체 비용을 따로 점검하는 장면"
    },
    "behaviorQuestion": "도구의 작동 이해와 실제 구매 필요을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 사용·가격·안전·본인 여력 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "원리를 알아도 직접 수리할 권한·역량은 별도임",
    "exclusions": [
      "편인·ISTP로 기계 재능·현명한 소비 확정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "INTJ 자문 가격과 같은 축이어도 실제 구매 필요라는 다른 대상",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:istp-tool-understanding",
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
    "id": "fkr:candidate:isfp-exit-notice",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISFP",
          "area": "workplace",
          "traitId": "conflict_silent_exit",
          "file": "docs/product/mbti/source/ISFP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c29503d26796af4c3dbc8c9298f4bf8d0636570e63c0494169bcf95d722d38d8",
          "sha256": "3b2933a71c929755e951eee60da9b89acb5fd344f90cc1f8a5370158426fee2b",
          "plainKoSha256": "ad65d328a8cc03ad0072b3c4850876529e51edd57a958309cdd4875fb30a8378"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "갈등이 깊어지면 문제를 끝까지 토론하기보다 관계를 조용히 끊는 쪽으로 간다. 싫은 티를 크게 내지 않고 지나가다가 마음속에서 이미 정리해버린다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "거리를 둘 때 남기는 업무 약속",
    "jointReason": "정관의 의무 후보와 갈등 후 거리두기 원천을 안전한 종료·인수인계로 비교",
    "positive": "대화의 한계와 맡은 일의 다음 연락을 나눔",
    "risk": "조용히 끝내려 업무 책임까지 갑자기 끊음",
    "goodIntentionMistake": "상처를 줄이려 거절·중단 의사를 숨김",
    "twist": "안전한 짧은 공지가 오래 참는 것보다 관계 비용을 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 불편한 협업에서 인수인계와 사적 대화 중단을 분리하는 장면"
    },
    "behaviorQuestion": "거리를 둘 때 남기는 업무 약속을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 갈등·권력 차이·안전·업무 의무 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "위험·괴롭힘 상황에서는 직접 협의보다 보호 경로가 우선임",
    "exclusions": [
      "ISFP로 회피적 성격·정관으로 계속 참을 의무 단정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "WORK_PRIVATE와 달리 갈등 뒤 종료·인수인계라는 과제",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:isfp-exit-notice",
    "legacyTagReview": {
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
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
    "id": "fkr:candidate:estp-small-goal-base",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "study"
    ],
    "contexts": [
      "learning"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_cai"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_cai",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_cai:7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTP",
          "area": "study",
          "traitId": "short_goal_strategy",
          "file": "docs/product/mbti/source/ESTP.json",
          "pointer": "/traits/study/1",
          "sourceCoverage": "direct",
          "sourceVersion": "cbad165b46fa8b9af38e16c47a76a1113255ac3041ccdd765cc2a035834807ec",
          "sha256": "e157227a7a65402aad995c3e0c5b0a3fca0836265e6c194cc0bd96455f8b396b",
          "plainKoSha256": "fb19c5794274fb0d7f9e851476c7dee64ff437e5bbd2d37dbdec4398e2c18201"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTP에게는 긴 결심보다 장기 목표를 짧은 행동 단위로 쪼개는 전략이 맞다. 수학처럼 누적이 필요한 과목도 오늘 풀 문제와 이번 주 목표가 선명할 때 꾸준함이 살아난다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:minimum-security",
        "definition": "유지할 최소 생활 조건을 정함",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "짧은 학습 목표가 돌아갈 기본 리듬",
    "jointReason": "정재의 유지 후보와 짧은 행동 목표 원천을 반복할 최소 환경에서 비교",
    "positive": "오늘 과제와 쉬는 기반을 함께 남김",
    "risk": "작은 목표를 끝없이 늘려 학습 부하를 누적",
    "goodIntentionMistake": "동기를 높이려 모든 시간을 과제로 분할",
    "twist": "쉬는 구간이 있어야 짧은 목표를 다시 시작할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 오늘 문제 수와 내일 다시 펼칠 시간을 따로 정하는 장면"
    },
    "behaviorQuestion": "짧은 학습 목표가 돌아갈 기본 리듬을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 학습 과제·생활 제약·피드백·휴식 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "목표가 작아도 필요한 교육 지원이 없으면 어려울 수 있음",
    "exclusions": [
      "정재·ESTP로 성적·꾸준함 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "C068은 학습 습득, 이 후보는 짧은 목표가 돌아갈 기반",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:estp-small-goal-base",
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
    "id": "fkr:candidate:estp-check-act",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_yin",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_yin:7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTP",
          "area": "workplace",
          "traitId": "crisis_solver",
          "file": "docs/product/mbti/source/ESTP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "cbad165b46fa8b9af38e16c47a76a1113255ac3041ccdd765cc2a035834807ec",
          "sha256": "249425dac315323aad0301a098a9db041b6b0e33a7c16272fedcf115d4049a55",
          "plainKoSha256": "a920fe885ef9bdc8676d8393ec9222b8a1bed20c6a1599becad19041f8ae07b3"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTP는 예기치 않은 문제가 터졌을 때 빠르게 판단하고 움직인다. 복잡한 설명보다 현장을 보고 타협책을 찾는 데 강하다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "ACTION_TEMPO",
        "direction": 1,
        "facetRef": "sar:facet:ACTION_TEMPO:paced-handoff",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "급한 행동 앞뒤에 필요한 확인을 배치",
    "jointReason": "정인의 익힌 지원 후보와 빠른 현장 대응을 필수 확인·중간 공유로 비교",
    "positive": "이미 아는 안전 항목을 확인하고 행동 상태를 알림",
    "risk": "빠른 대처 경험을 모든 상황의 판단 능력으로 확대",
    "goodIntentionMistake": "문제를 빨리 돕고자 검토·권한을 생략",
    "twist": "조금 멈춘 확인이 전체 대응 시간을 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 현장 조치 전 필수 안전 점검과 보고를 나누는 장면"
    },
    "behaviorQuestion": "급한 행동 앞뒤에 필요한 확인을 배치을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 위기·교육·안전·기존 권한·가역 범위 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "위험한 상황에서는 전문가 대기가 우선일 수 있음",
    "exclusions": [
      "정인과 빠른 대응으로 사고 없는 해결 보장",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "estp-study는 학습 순서, 이 후보는 현장 인계·안전 확인",
    "novelty": "new_facet_interaction",
    "applicabilityRef": "fkr:app:candidate:estp-check-act",
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
    "id": "fkr:candidate:esfp-procedure-choice",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "authored:fusion-research",
      "repo:mbti-source",
      "repo:saju-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "new_candidate",
    "researchRelation": "task_complement",
    "originalDomains": [
      "work"
    ],
    "contexts": [
      "work"
    ],
    "myeongli": {
      "features": [
        "ten_god_zheng_guan"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:zheng_guan",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:zheng_guan:94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "약속을 지키며 신뢰와 자리를 얻는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFP",
          "area": "workplace",
          "traitId": "anti_bureaucracy_work",
          "file": "docs/product/mbti/source/ESFP.json",
          "pointer": "/traits/workplace/0",
          "sourceCoverage": "direct",
          "sourceVersion": "b22468fccc71563e5d256aa160d778fa3c61f582e1ead73caea369402a0f1248",
          "sha256": "d98fbc035ba01882f404c6e6afd2172039165ad9d98e66f3682212b421e71bd5",
          "plainKoSha256": "c100494a64248c4982419afa4b99705dae0e4b588d4f938ba55c7769de064f19"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "지나친 규율, 복잡한 승인 절차, 딱딱한 관료주의를 싫어한다. 사람과 현장보다 규칙 자체가 앞서는 조직에서는 답답함이 커진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "필수 안전 절차와 바꿀 수 있는 수행 방법",
    "jointReason": "정관의 역할 기준과 과도한 승인 거부를 규칙의 목적에 따라 분리",
    "positive": "지켜야 할 책임을 남기고 불필요한 절차 변경을 요청",
    "risk": "답답한 절차를 모두 무의미하다고 생략",
    "goodIntentionMistake": "현장을 돕자며 공동 승인 약속을 뒤늦게 알림",
    "twist": "지킬 최소 절차를 명시하면 방법 재량도 넓어질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 행사 운영에서 안전 승인과 표현 방식을 따로 정하는 장면"
    },
    "behaviorQuestion": "필수 안전 절차와 바꿀 수 있는 수행 방법을 실제 행동·조건에서 어떻게 구분할까?",
    "conditions": [
      "실제 업무·안전 의무·변경권·공동 영향 확인",
      "개인별 실제 성향과 명리 성립·적용 조건을 확인하기 전 사용하지 않는다."
    ],
    "counterexample": "복잡한 절차가 필요한 위험 과제도 있음",
    "exclusions": [
      "ESFP로 규칙 준수 불능·정관과 필연 갈등 단정",
      "새 규칙의 등록·가중치·annotation·실제 Evidence 연결을 만들지 않는다."
    ],
    "distinction": "ENTP 업무 재량과 핵심 공유; 안전 승인·현장 표현이라는 조건 확장",
    "novelty": "source_task_extension",
    "applicabilityRef": "fkr:app:candidate:esfp-procedure-choice",
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
