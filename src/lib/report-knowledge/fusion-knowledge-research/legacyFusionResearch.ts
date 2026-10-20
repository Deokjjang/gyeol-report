/** Static offline Fusion knowledge; source file/export paths stay in the audit catalog. */
import type { FusionMaterial } from "./fusionResearchTypes";
export const LEGACY_FUSION_RESEARCH: readonly FusionMaterial[] = [
  {
    "id": "fkr:legacy:entj-wealth-pressure-structure",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-wealth-pressure-structure",
    "existingRuleSha256": "7904c44e19b98d7518d366a638d416868d0ef63e043946b739ff5219b3112cca",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "작게 해놓고 만족하기보다 제대로 남기고 싶습니다. 다만 하고 싶은 일의 크기만큼 혼자 맡는 일도 커지면, 쉬는 날까지 다음 일을 생각하게 됩니다.",
    "originalDomains": [
      "money",
      "work"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "v4_structure:wealthHeavyWeakDaymaster"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:jaeda_sinyak",
          "auditRef": "source-ref-catalog.json#csr:profile:jaeda_sinyak:15d7e48a153974db45c1571ea95cd900f0e3af28ab6f387a24629cd051ce82fb",
          "recordSha256": "15d7e48a153974db45c1571ea95cd900f0e3af28ab6f387a24629cd051ce82fb",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "돈과 현실을 보는 눈이 빠릅니다. 작은 기회보다 실제로 남는 결과를 중요하게 생각합니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "money",
          "traitId": "high_earning_orientation",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "8d25e8024b2b4a93eb5117d5f62a609e45e8188aef99eea80e1386d8ca85b4bf",
          "plainKoSha256": "30d0d50f3d11e4597f36b79d39545f13efdc0e843f741d3c5bea43d9652c4372"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTJ의 돈은 고액 연봉, 높은 매출, 자영업 성과처럼 결과가 분명한 구조에서 힘을 받는다. 야망, 추진력, 조직화 능력이 수익 확장과 맞물린다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
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
    "coreMeaning": "큰 성과 목표와 감당할 자원의 간격",
    "jointReason": "재성 편중·신약 후보의 부담 조건을 성과 선호와 함께 점검",
    "positive": "목표별 지원 인력과 현금을 먼저 확보할 수 있음",
    "risk": "큰 목표를 능력의 증거로 삼아 혼자 부담을 늘림",
    "goodIntentionMistake": "잘 해내려다 필요한 지원 요청을 늦춤",
    "twist": "목표를 줄이는 것이 야망을 지키는 선택일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 신규 계약 전 맡을 인력과 유지비를 적는 장면"
    },
    "behaviorQuestion": "성과 목표와 감당 한도를 다른 칸에 적기",
    "conditions": [
      "구조 성립·일간 여력·실제 자원 모두 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "높은 목표가 있어도 지원 구조가 충분하면 부담은 다름",
    "exclusions": [
      "재다신약으로 가난·과로·실패 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "entj-wealth와 달리 실제 부담 구조의 전제가 핵심",
    "applicabilityRef": "fkr:app:legacy:entj-wealth-pressure-structure",
    "legacyTagReview": {
      "originalMyeongliTag": "wealth",
      "originalMbtiTag": "wealth",
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
    "id": "fkr:legacy:entj-made-value-structure",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-made-value-structure",
    "existingRuleSha256": "de61bb5381ab533637adb5c835b4c3560186b0ef4befd89a39710146adb4ae92",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "잘 만들었다는 칭찬 다음에는 누가 이걸 원하는지가 궁금합니다. 생각을 결과로 만들고, 그 결과에 맞는 값을 받고 싶은 사람입니다.",
    "originalDomains": [
      "work",
      "money"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "v4_structure:outputCreatesWealth"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:siksang_saengjae",
          "auditRef": "source-ref-catalog.json#csr:profile:siksang_saengjae:db31bcd17d9ffa13b894a36c61b85fe807a91c339d1cc18c24a925730826a9e4",
          "recordSha256": "db31bcd17d9ffa13b894a36c61b85fe807a91c339d1cc18c24a925730826a9e4",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "잘하는 것을 남이 원하는 결과로 바꾸는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "money",
          "traitId": "high_earning_orientation",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "8d25e8024b2b4a93eb5117d5f62a609e45e8188aef99eea80e1386d8ca85b4bf",
          "plainKoSha256": "30d0d50f3d11e4597f36b79d39545f13efdc0e843f741d3c5bea43d9652c4372"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTJ의 돈은 고액 연봉, 높은 매출, 자영업 성과처럼 결과가 분명한 구조에서 힘을 받는다. 야망, 추진력, 조직화 능력이 수익 확장과 맞물린다.",
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
    "coreMeaning": "만든 결과가 실제 수요와 만나는 경로",
    "jointReason": "식상생재 후보의 산출 연결과 성과 선호 사이에 고객·가격 조건을 보존",
    "positive": "잘 만든 것의 사용자를 확인하고 유지 비용을 계산",
    "risk": "제작물 수와 매출을 같은 성과로 계산",
    "goodIntentionMistake": "가치를 증명하려 무료 수정까지 계속 제공",
    "twist": "만드는 양을 줄여 판매 이후의 책임을 명확히 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 시제품 반응과 유료 계약 조건을 나눠 보는 장면"
    },
    "behaviorQuestion": "제작 완료와 구매 이유를 각각 검증",
    "conditions": [
      "식상생재 연결·실제 수요·가격 결정권 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "작품 만족도가 높아도 판매 의사가 없을 수 있음",
    "exclusions": [
      "식상생재이므로 매출 증가 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "entj-wealth-pressure-structure는 여력, 이 규칙은 산출→수요 경로",
    "applicabilityRef": "fkr:app:legacy:entj-made-value-structure",
    "legacyTagReview": {
      "originalMyeongliTag": "wealth",
      "originalMbtiTag": "wealth",
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
    "id": "fkr:legacy:intp-pressure-learning-structure",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intp-pressure-learning-structure",
    "existingRuleSha256": "eb96b6cc6c589477f03b201502de19e8fabdf0d0a589f9dae0d927be44a0491e",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "막히는 일이 생기면 왜 그런지 끝까지 파고듭니다. 처음에는 버거웠던 문제가 어느새 남들이 물으러 오는 내 전문 분야가 되기도 합니다.",
    "originalDomains": [
      "study",
      "work"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "v4_structure:killingResourceFlow"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:salin_sangsaeng",
          "auditRef": "source-ref-catalog.json#csr:profile:salin_sangsaeng:9e8d17765c83a731a9b2d940f31b815d2ee4fadf7a5a0e197e3bb747c1be52aa",
          "recordSha256": "9e8d17765c83a731a9b2d940f31b815d2ee4fadf7a5a0e197e3bb747c1be52aa",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "압박을 그냥 참는 데서 끝내지 않고 배움으로 바꾸는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTP",
          "area": "thinkingStyle",
          "traitId": "why_question_loop",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/2",
          "sourceCoverage": "direct",
          "sourceVersion": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
          "sha256": "47d9a3968e95fec9bc328ed27f3cd38f057c65d86d473fc05f2480cb92d1faad",
          "plainKoSha256": "739dc638b462814fed1ee27da1ffc47cb7fb2a3999e74896cddb17632f5b5b4e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "왜라는 질문을 자주 품고, 근본 원인을 알고 싶어 한다. 모르는 부분이 남아 있으면 찝찝해하고, 관심 대상의 구조를 끝까지 탐구한다.",
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
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "어려운 과제를 이해 가능한 문제로 나누기",
    "jointReason": "살인상생 후보의 압박·지원 연결을 왜라는 질문의 탐구 방식과 비교",
    "positive": "막힌 원인을 자료·학습·작은 검증으로 나눔",
    "risk": "이해가 충분해야 한다며 복구 결정을 미룸",
    "goodIntentionMistake": "정확히 돕고 싶어 설명을 끝없이 늘림",
    "twist": "모르는 범위를 인정하면 필요한 도움을 더 빨리 찾을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 장애 원인 조사와 임시 복구를 병행하는 장면"
    },
    "behaviorQuestion": "지금 복구할 일과 더 배울 일을 분리",
    "conditions": [
      "살인상생 성립·지원 경로·실제 과제 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "압박이 지나치면 탐구보다 보호와 지원이 먼저임",
    "exclusions": [
      "압박이 있으면 반드시 전문가가 된다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "intp-inquiry와 달리 실제 구조의 압박·지원 조건 필요",
    "applicabilityRef": "fkr:app:legacy:intp-pressure-learning-structure",
    "legacyTagReview": {
      "originalMyeongliTag": "inquiry",
      "originalMbtiTag": "inquiry",
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
    "id": "fkr:legacy:entp-question-authority-structure",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entp-question-authority-structure",
    "existingRuleSha256": "f0a75d0d723fd2b3bdf08606352c23b1115c2a489d1702fedc2bbf787fadeb25",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "누가 말했는지보다 말이 맞는지가 먼저입니다. 다들 조용히 넘어가는 순간에도 질문 하나가 남아서, 결국 내가 꺼내는 편입니다.",
    "originalDomains": [
      "work",
      "relationships"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "v4_structure:hurtingOfficerMeetsOfficer"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:sanggwan_gyeongwan",
          "auditRef": "source-ref-catalog.json#csr:profile:sanggwan_gyeongwan:6d6468e0184917932513807b1deb39f4ed577a6998b9d182525cfa6cdaf32f92",
          "recordSha256": "6d6468e0184917932513807b1deb39f4ed577a6998b9d182525cfa6cdaf32f92",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "문제의 빈틈을 보고 고치는 능력이 좋습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTP",
          "area": "thinkingStyle",
          "traitId": "flaw_detection",
          "file": "docs/product/mbti/source/ENTP.json",
          "pointer": "/traits/thinkingStyle/4",
          "sourceCoverage": "direct",
          "sourceVersion": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
          "sha256": "1dba8b2921149e0ba4f92f0bb267fdaf15b3bb7d96a159e11da85b900132a42b",
          "plainKoSha256": "28cb06912c33644c7843a196656c55ea751c554948499212ef09e2d7a07eda6d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTP는 논리적 모순, 시스템 결함, 말과 행동의 불일치를 잘 찾아낸다. 전통적인 가치나 다수가 따르는 방식도 다른 각도에서 해체해 본다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "규칙의 목적과 허점을 구분하는 반론",
    "jointReason": "상관견관 후보의 규칙 긴장을 논리 결함 검토와 함께 보되 제재 사건으로 바꾸지 않음",
    "positive": "권한을 인정하면서 적용 전제의 오류를 질문",
    "risk": "논리 반론이 사람의 지위 공격으로 전달",
    "goodIntentionMistake": "잘못을 막으려 공개 석상에서 상대를 몰아붙임",
    "twist": "규칙의 유효 범위를 정하면 전면 거부 없이 고칠 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 절차 목적과 예외 조건을 별도로 제안하는 장면"
    },
    "behaviorQuestion": "반대 근거와 대체 절차를 함께 제시",
    "conditions": [
      "구조 성립·공식 권한·반론의 안전 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "규칙이 실제 위험을 막는 경우 유지가 타당할 수 있음",
    "exclusions": [
      "상관견관이면 징계·소송·상사 갈등 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "entp-needle과 달리 권한·제도 맥락이 필수",
    "applicabilityRef": "fkr:app:legacy:entp-question-authority-structure",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:entj-wealth",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-wealth",
    "existingRuleSha256": "2b38c27cd43fdfb63a1c0ad81ff7dfdb651c2f4c7c04208b92abb3edaaa33c20",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "잘했다는 말도 좋지만, 그래서 내 몫이 얼마나 커졌는지가 궁금합니다. 돈 이야기를 피하기보다 실력에 맞는 값을 받고 싶은 사람입니다.",
    "originalDomains": [
      "money",
      "success/fortune"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "ten_god_pian_cai",
        "ten_god_zheng_cai"
      ],
      "researchRefs": [
        {
          "id": "foundation:ten_god:pian_cai",
          "auditRef": "source-ref-catalog.json#foundation:ten_god:pian_cai:b2ced2072ff8bd848e6ff31903bbcde59b742102f5f3893e8b72bf8ea21dd966",
          "recordSha256": "b2ced2072ff8bd848e6ff31903bbcde59b742102f5f3893e8b72bf8ea21dd966",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        },
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
      "meaning": "사람과 기회 사이에서 돈의 길을 잘 찾습니다. / 작게 들어오는 것도 내 것으로 쌓는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "money",
          "traitId": "high_earning_orientation",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "8d25e8024b2b4a93eb5117d5f62a609e45e8188aef99eea80e1386d8ca85b4bf",
          "plainKoSha256": "30d0d50f3d11e4597f36b79d39545f13efdc0e843f741d3c5bea43d9652c4372"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTJ의 돈은 고액 연봉, 높은 매출, 자영업 성과처럼 결과가 분명한 구조에서 힘을 받는다. 야망, 추진력, 조직화 능력이 수익 확장과 맞물린다.",
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
        "axis": "GOAL_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "원하는 보상과 남는 자원을 구별",
    "jointReason": "재성의 자원 상징과 고성과 선호는 실제 소득이 아니라 목표 설정의 비교 대상",
    "positive": "수입 목표와 순수하게 남는 몫을 나눠 관리",
    "risk": "수입 총액만 키우며 시간·유지비 손실을 놓침",
    "goodIntentionMistake": "성과를 보여주려 수익성 낮은 일을 맡음",
    "twist": "덜 벌어도 선택권과 순수익이 남는 제안이 나을 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 높은 매출 제안과 실제 비용을 비교하는 장면"
    },
    "behaviorQuestion": "총액·비용·개인 여력을 각각 기록",
    "conditions": [
      "재성의 유효 근거와 실제 보상 조건 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "돈보다 다른 가치를 우선하는 실제 선택도 가능",
    "exclusions": [
      "재성이 있으므로 고소득 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "구조2규칙과 달리 구체 구조 성립을 주장하지 않음",
    "applicabilityRef": "fkr:app:legacy:entj-wealth",
    "legacyTagReview": {
      "originalMyeongliTag": "wealth",
      "originalMbtiTag": "wealth",
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
    "id": "fkr:legacy:entj-pressure",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-pressure",
    "existingRuleSha256": "e92b22d25d8f5a603a2e6acc3a3e6a476f65074eba015ffd0e0d0d349cc9e419",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "다들 우물쭈물하면 결국 내가 순서를 정하고 있습니다. 급한 순간에 더 또렷해지는 힘이 있지만, 쉬는 날까지 지휘할 필요는 없습니다.",
    "originalDomains": [
      "work",
      "strengths",
      "identity"
    ],
    "contexts": [],
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
          "type": "ENTJ",
          "area": "identity",
          "traitId": "commanding_goal_builder",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/identity/0",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "8a331415bd007f180e6e2b9a20a3f32dfa1a5279d868b58073e91b4304626543",
          "plainKoSha256": "333bf6b7d9175641fe0898d7f47025c7bed026b74e01eb3d201d8fb694329ad5"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTJ는 공통 목표를 세우고 사람을 끌어모아 추진하는 데 강하다. 문제 해결 과정을 체계화하고 자신이 관리자나 지도자 역할을 맡는 것을 자연스럽게 받아들인다.",
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
        "axis": "LEADERSHIP",
        "direction": 1,
        "facetRef": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "급한 결정에서도 책임과 권한을 맞추기",
    "jointReason": "편관의 압박 대응 해석과 공동 목표 조율 선호를 실제 결정권 범위에서 비교",
    "positive": "결정할 사람과 지원할 사람을 빠르게 나눔",
    "risk": "압박이 사라져도 모든 판단을 계속 지휘",
    "goodIntentionMistake": "팀을 보호하려 결과 책임을 전부 혼자 짐",
    "twist": "도움을 요청하는 조율이 직접 해결보다 책임 있는 행동일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 긴급 대응 역할과 다음 보고 시점을 정하는 장면"
    },
    "behaviorQuestion": "현재 권한과 실제 맡을 범위를 명시",
    "conditions": [
      "편관 근거·긴급 과제·위임권 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "위기에도 결정권이 없으면 보고와 지원이 우선임",
    "exclusions": [
      "편관+ENTJ이면 위기 해결 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "estj-status의 의무 이행과 긴급 조율 권한은 다름",
    "applicabilityRef": "fkr:app:legacy:entj-pressure",
    "legacyTagReview": {
      "originalMyeongliTag": "leadership",
      "originalMbtiTag": "leadership",
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
    "id": "fkr:legacy:entj-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-needle",
    "existingRuleSha256": "44b396d709c78da2364d0875d36555e0f3f9a077585aed00e1e29fb3d96303e1",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "오류를 보는 순간 수정안까지 머릿속에 떠오릅니다. 본인은 빨리 해결한 것뿐인데, 상대에게는 말이 꽤 날카롭게 들릴 때가 있습니다.",
    "originalDomains": [
      "work",
      "strengths",
      "weaknesses"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "thinkingStyle",
          "traitId": "fast_decisive_filter",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/thinkingStyle/2",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "ec60da6592e87ba0bba8fadc332b6defbd4d93ec155f8548c05142a52f5f2e75",
          "plainKoSha256": "1308d13c7177a0cd7b29e46a4abfb6241ab958bb27ea474c914e17c81d47c411"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "많은 선택지와 아이디어를 검토하지만 결론이 서면 잘 굽히지 않는다. 빠른 생각과 확고한 신념이 결정을 강하게 밀어준다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DECISION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:DECISION_STYLE:reopen-trigger",
        "definition": "결정을 다시 볼 새 근거를 정함",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "판단의 속도와 수정 가능성을 함께 점검",
    "jointReason": "현침→정밀함의 현대 연결은 미검증이며 해당 trait는 오류 탐지보다 결론 확고함을 설명",
    "positive": "독립 오류 자료가 있을 때 결론 수정 조건을 미리 둠",
    "risk": "빠른 결론을 정확한 결론으로 오인",
    "goodIntentionMistake": "문제를 빨리 끝내려 반대 자료를 차단",
    "twist": "결론을 되돌리는 기준이 있으면 확고함도 유연해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 결정 회의에서 수정할 수치 조건을 남기는 장면"
    },
    "behaviorQuestion": "오류 관찰과 결정 성향의 출처를 분리",
    "conditions": [
      "현침 상징 외 실제 오류 탐지 근거 필요",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "오류를 잘 못 봐도 결론은 빠를 수 있음",
    "exclusions": [
      "현침 명칭으로 분석 능력 승인",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "다른 needle 규칙과 달리 MBTI 원문은 결정 필터 중심",
    "applicabilityRef": "fkr:app:legacy:entj-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "decisive-correction",
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
    "id": "fkr:legacy:entj-alone",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entj-alone",
    "existingRuleSha256": "e858795d1fbba6d3b70f84d805007144ac866cf766229c93af92767ff29854da",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "사람들 앞에서는 결론을 이끌지만 중요한 판단 전에는 혼자 있고 싶습니다. 밖에서 보이는 자신감 뒤에, 조용히 생각을 정리하는 시간이 있습니다.",
    "originalDomains": [
      "identity",
      "relationships"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_hwagae"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hwagae",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hwagae:401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
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
      "meaning": "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTJ",
          "area": "identity",
          "traitId": "public_presence_private_distance",
          "file": "docs/product/mbti/source/ENTJ.json",
          "pointer": "/traits/identity/4",
          "sourceCoverage": "direct",
          "sourceVersion": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
          "sha256": "b304a20b6dc45d6479ccfac3daf7043848162f299799e2e787f4834d4a85a131",
          "plainKoSha256": "597b98e1837181dd3bfcbdb8c37a0b41634bb1623022bc1b3f743ce3e5aaf5ce"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "사적인 관계를 넓게 풀기보다 대중적 존재감과 영향력을 드러내는 데 더 익숙하다. 가까운 일상 공유보다 깊은 토론과 성취의 동맹을 선호한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "ENERGY_DIRECTION",
        "direction": 1,
        "facetRef": "sar:facet:ENERGY_DIRECTION:channel-switch",
        "definition": "장면에 따른 정리 통로의 전환",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "공적 영향력과 사적 공유의 다른 경계",
    "jointReason": "화개의 몰입 상징과 공적 존재감 trait는 사람 수보다 활동 기능의 차이",
    "positive": "공동 목표 토론과 개인 일상 공개를 선택적으로 나눔",
    "risk": "공적 자신감을 사적 친밀감으로 요구받음",
    "goodIntentionMistake": "팀과 가깝게 지내려 원치 않는 일상까지 공유",
    "twist": "사적 거리를 설명하면 공적 협력이 더 편해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 발표 뒤 혼자 정리할 시간을 알리는 장면"
    },
    "behaviorQuestion": "공유할 의제와 공개하지 않을 정보를 정하기",
    "conditions": [
      "화개의 적용 범위와 실제 공개 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "공개 활동 뒤에도 사적 교류를 원할 수 있음",
    "exclusions": [
      "외향 유형이므로 실제 외로움이나 피로 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "enfp-alone의 사회적 에너지 획득과 공적 영향력은 다름",
    "applicabilityRef": "fkr:app:legacy:entj-alone",
    "legacyTagReview": {
      "originalMyeongliTag": "solitude",
      "originalMbtiTag": "sociability",
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
    "id": "fkr:legacy:intj-inquiry",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intj-inquiry",
    "existingRuleSha256": "f7fb508a902986a20be31a6458ca9a249f7cb105420f0e21d4b2a378ffd22bbc",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "다들 이해했다며 넘어가도 혼자 질문 하나가 남습니다. 설명이 앞뒤로 맞아떨어져야 비로소 마음이 놓입니다.",
    "originalDomains": [
      "study",
      "identity",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "ten_god_pian_yin",
        "sinsal_gwimun"
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
        },
        {
          "id": "foundation:shinsal_gwiin:gwimun",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:gwimun:e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
          "recordSha256": "e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
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
      "meaning": "남이 넘긴 질문을 끝까지 파고듭니다. / 그냥 지나치기 어려운 질문을 집요하게 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTJ",
          "area": "thinkingStyle",
          "traitId": "system_first_thinking",
          "file": "docs/product/mbti/source/INTJ.json",
          "pointer": "/traits/thinkingStyle/0",
          "sourceCoverage": "direct",
          "sourceVersion": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
          "sha256": "41d3a67731d994d294cf37f81479c67138a353fdb0c5daa9c7a89242a0ed12a9",
          "plainKoSha256": "7fbbc908f57f42701222f1021bc8736ed0b4be9dcad1909c0d891cc88e2b5cbf"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "현상을 단편적으로 보지 않고, 그 뒤에 있는 원리와 구조를 먼저 찾는다. 패턴이 보이지 않거나 논리적 연결이 약한 설명은 쉽게 받아들이지 않는다.",
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
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:counterpattern",
        "definition": "맞지 않는 사례를 적극 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "납득할 원리와 설명을 바꿀 반례",
    "jointReason": "편인·귀문의 탐구 해석을 시스템 원리 선호와 비교하되 지적 능력으로 승격하지 않음",
    "positive": "원인 모델을 세우고 맞지 않는 사례도 남김",
    "risk": "논리적으로 정돈된 설명을 현실의 정답으로 확정",
    "goodIntentionMistake": "정확히 이해하려 상대 설명의 생활 맥락을 잘라냄",
    "twist": "반례가 모델의 경계를 알려주면 탐구가 더 쓸모 있어짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 사용자의 예외 사례를 모델 옆에 적는 장면"
    },
    "behaviorQuestion": "설명 가능한 범위와 모르는 범위를 구분",
    "conditions": [
      "해당 근거·원문 성향·검증 가능한 자료 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "논리적 일관성에 관심 없고 실용만 원하는 상황도 있음",
    "exclusions": [
      "편인·귀문으로 지능·진실 탐지 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "intp-inquiry의 질문 지속보다 원리·구조 수용 기준에 초점",
    "applicabilityRef": "fkr:app:legacy:intj-inquiry",
    "legacyTagReview": {
      "originalMyeongliTag": "inquiry",
      "originalMbtiTag": "inquiry",
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
    "id": "fkr:legacy:intj-charm",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intj-charm",
    "existingRuleSha256": "bb447890cd5619ec1e4e64aa8b054a8aa18624cf187f9d3e9edd2e33a11318ea",
    "legacyKind": "contrast",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "대화는 다정했는데 관계의 문은 아직 천천히 여는 중입니다. 상대는 벌써 가까워졌다고 느끼고, 본인은 이제부터 알아보는 단계입니다.",
    "originalDomains": [
      "love"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hongyeom"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hongyeom",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hongyeom:dc1aea5623b68e37576e8634fafa3908869cb2c6e31a92e8aebe16e383d8c822",
          "recordSha256": "dc1aea5623b68e37576e8634fafa3908869cb2c6e31a92e8aebe16e383d8c822",
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
      "meaning": "가까워질수록 매력이 살아납니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTJ",
          "area": "love",
          "traitId": "slow_high_standard_love",
          "file": "docs/product/mbti/source/INTJ.json",
          "pointer": "/traits/love/0",
          "sourceCoverage": "direct",
          "sourceVersion": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
          "sha256": "2f8fc9cceba32de6e199c6220fab7d9fef1dada30e4cba75293e5e88718b7d3d",
          "plainKoSha256": "0b9cfffe4bbb1b70d2e853bddec5a469cd194f10e753064e06aa13e228722df0"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "쉽게 빠지는 편이 아니다. 상대가 매력적인지보다 삶의 방향, 지적 기준, 장기 가능성이 맞는지를 오래 본다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DECISION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:DECISION_STYLE:option-hold",
        "definition": "가능성을 남길 이유와 기한을 설명",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "호감의 전달과 관계 선택을 다른 단계로 보기",
    "jointReason": "홍염의 친밀 매력 상징은 상대 호감이 아니며 높은 장기 기준과 직접 반대도 아님",
    "positive": "다정한 반응과 관계를 정할 의사를 구분해 알림",
    "risk": "온기를 관계 확정으로 읽게 한 뒤 설명을 미룸",
    "goodIntentionMistake": "상대를 다치게 하지 않으려 모호한 기대를 남김",
    "twist": "신중한 기준을 말해도 친밀한 표현은 계속 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 즐거운 대화 뒤 관계를 알아가는 속도를 설명하는 장면"
    },
    "behaviorQuestion": "호감 표현과 실제 약속을 구분",
    "conditions": [
      "실제 교제 단계·상호 동의·장기 기준 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "다정한 표현 없이도 신중하게 관계를 정할 수 있음",
    "exclusions": [
      "홍염으로 상대가 이미 사랑한다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "isfp-love의 공개 속도와 INTJ의 선택 기준은 다름",
    "applicabilityRef": "fkr:app:legacy:intj-charm",
    "legacyTagReview": {
      "originalMyeongliTag": "intimate-attraction",
      "originalMbtiTag": "reserved-affection",
      "relatedTags": [
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
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
    "id": "fkr:legacy:intj-money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intj-money",
    "existingRuleSha256": "bd412d97f7484ae1af461ebcad120b88b2875feaf964dc7e20d71343b49359a9",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "머릿속 계산만으로는 마음이 안 놓입니다. 어디에 얼마가 남는지 보일 때 돈 걱정도 조용해집니다.",
    "originalDomains": [
      "money"
    ],
    "contexts": [],
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
          "type": "INTJ",
          "area": "money",
          "traitId": "cashflow_system_design",
          "file": "docs/product/mbti/source/INTJ.json",
          "pointer": "/traits/money/3",
          "sourceCoverage": "inferred",
          "sourceVersion": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
          "sha256": "593dab331795ea2eb3b71adc106c582b81ebd9313941afe64d416eb4cd69f8e0",
          "plainKoSha256": "2709acb43e3d427cd0d560fd5601cb1b6c7f6812fba7fa599ed053169b78d656"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INTJ는 돈을 기분으로 관리하기보다 구조로 통제할 때 안정된다. 예산, 자동이체, 목표별 계좌, 장기 자금 계획처럼 규칙이 보이면 지출 판단도 차분해진다. 돈 관리가 머릿속 계산에만 머물면 실제 현금흐름과 계획 사이에 오차가 생긴다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
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
    "coreMeaning": "예산 규칙과 실제 흐름의 차이를 갱신",
    "jointReason": "정재의 꾸준한 관리 해석과 inferred 현금흐름 trait를 실제 기록에서 비교",
    "positive": "예산을 고정 답이 아닌 확인 가능한 가설로 사용",
    "risk": "정리된 표를 실제 여력으로 착각",
    "goodIntentionMistake": "불안을 줄이려 모든 소액 지출까지 통제",
    "twist": "예외 항목을 두면 규칙이 더 오래 유지될 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 예상 비용과 실제 청구 차이를 갱신하는 장면"
    },
    "behaviorQuestion": "고정비·예외·수정일을 구분",
    "conditions": [
      "inferred 상태·실제 기록·본인 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "체계적 예산보다 단순 한도가 편할 수 있음",
    "exclusions": [
      "inferred 원문을 검증된 재무 능력으로 승격",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "istj-marriage는 공동 역할, 이 규칙은 개인 자원 흐름",
    "applicabilityRef": "fkr:app:legacy:intj-money",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "consistency",
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
    "id": "fkr:legacy:intp-inquiry",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intp-inquiry",
    "existingRuleSha256": "d726feef523a8e7e17845992548775bb5b9a101c6efa9f6928fb5d3dfb803eba",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "하나만 찾아보려다 관련 글을 다섯 개쯤 열어놓습니다. 답을 아는 것보다 왜 그런지 납득하는 일이 더 재미있습니다.",
    "originalDomains": [
      "study",
      "identity",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_gwimun",
        "ten_god_pian_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:gwimun",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:gwimun:e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
          "recordSha256": "e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        },
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
      "meaning": "그냥 지나치기 어려운 질문을 집요하게 파고듭니다. / 남이 넘긴 질문을 끝까지 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTP",
          "area": "thinkingStyle",
          "traitId": "why_question_loop",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/thinkingStyle/2",
          "sourceCoverage": "direct",
          "sourceVersion": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
          "sha256": "47d9a3968e95fec9bc328ed27f3cd38f057c65d86d473fc05f2480cb92d1faad",
          "plainKoSha256": "739dc638b462814fed1ee27da1ffc47cb7fb2a3999e74896cddb17632f5b5b4e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "왜라는 질문을 자주 품고, 근본 원인을 알고 싶어 한다. 모르는 부분이 남아 있으면 찝찝해하고, 관심 대상의 구조를 끝까지 탐구한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-parking",
        "definition": "당장 필요 없는 질문을 보관",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "끝없는 질문에서 지금 필요한 답을 고르기",
    "jointReason": "편인·귀문의 탐구 후보와 왜를 묻는 trait의 공통점에 조사 종료 조건을 더함",
    "positive": "관심 질문을 보류함으로써 현재 과제의 답을 완성",
    "risk": "관련 자료를 모으며 실제 질문에서 멀어짐",
    "goodIntentionMistake": "빈틈 없는 답을 주려 설명 분량만 늘림",
    "twist": "조사하지 않을 질문을 정하는 것이 깊이를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 조사 탭 중 오늘 답할 질문만 남기는 장면"
    },
    "behaviorQuestion": "답할 질문·보류 질문·다시 볼 시점을 나누기",
    "conditions": [
      "실제 질문과 조사 기한·원천 성향 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "자료를 더 모아도 이해가 늘지 않을 수 있음",
    "exclusions": [
      "질문량으로 전문성·우월성 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "구조 기반 intp-pressure-learning과 달리 압박·지원 전제 없음",
    "applicabilityRef": "fkr:app:legacy:intp-inquiry",
    "legacyTagReview": {
      "originalMyeongliTag": "inquiry",
      "originalMbtiTag": "inquiry",
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
    "id": "fkr:legacy:intp-space",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intp-space",
    "existingRuleSha256": "2448b97dedc14605ce2e67eeb41b86e66459219a917c7ea9669b908044d38b93",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "좋아하는 사람이어도 하루의 모든 틈을 채워주길 바라지는 않습니다. 혼자 몰입할 시간을 존중받을 때 오히려 오래 마음을 줍니다.",
    "originalDomains": [
      "love",
      "relationships"
    ],
    "contexts": [],
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
          "type": "INTP",
          "area": "love",
          "traitId": "freedom_based_attachment",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/love/3",
          "sourceCoverage": "direct",
          "sourceVersion": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
          "sha256": "e0c6e86484eb4e18ed09f552d844eed205d79e57d932f9361fb576e95f73fa40",
          "plainKoSha256": "d99c8368f208e8f6b200e21fa298529080ce26c4339901976049ce259283fce4"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "연애에서도 혼자 생각하고 관심사에 몰입할 시간이 필요하다. 상대가 이를 인정하면 안정적이지만, 계속 확인과 반응을 요구하면 피로가 커진다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
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
    "coreMeaning": "개인 몰입을 유지하면서 받을 도움을 고르기",
    "jointReason": "비견의 독립 후보와 사적 몰입 trait가 거절 아닌 선택권에서 만남",
    "positive": "혼자 할 부분과 함께할 부분을 명확히 제안",
    "risk": "공간 요청을 설명 없이 연락 단절로 사용",
    "goodIntentionMistake": "상대 부담을 줄이려 필요한 도움까지 거절",
    "twist": "도움을 선택해 받는 것도 자율성일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 혼자 공부할 저녁과 함께할 시간을 정하는 장면"
    },
    "behaviorQuestion": "공간의 목적과 다음 연락을 합의",
    "conditions": [
      "실제 관계·몰입 필요·상대 동의 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "함께 생각해야 더 잘 몰입하는 날도 있음",
    "exclusions": [
      "비견으로 친밀감 능력 부족 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "istp-love의 통제 거부보다 몰입 시간의 기능에 초점",
    "applicabilityRef": "fkr:app:legacy:intp-space",
    "legacyTagReview": {
      "originalMyeongliTag": "autonomy",
      "originalMbtiTag": "autonomy",
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
    "id": "fkr:legacy:intp-expression",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "intp-expression",
    "existingRuleSha256": "cb4aaab3d15081bde182d42f9cf7d37b7de30750899b4267708d253372380dc0",
    "legacyKind": "complement",
    "researchRelation": "task_complement",
    "originalMeaning": "평소엔 조용한데 관심 있는 이야기가 나오면 말문이 열립니다. 하고 싶은 말이 없는 게 아니라, 내 이야기가 시작되는 문이 따로 있습니다.",
    "originalDomains": [
      "relationships",
      "identity"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "distribution:output-low"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:no_output",
          "auditRef": "source-ref-catalog.json#csr:profile:no_output:bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "recordSha256": "bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "relation": "related_not_equivalent",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "표현의 통로를 다른 행동 습관과 함께 살펴볼 자리입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INTP",
          "area": "communication",
          "traitId": "topic_triggered_talk",
          "file": "docs/product/mbti/source/INTP.json",
          "pointer": "/traits/communication/4",
          "sourceCoverage": "direct",
          "sourceVersion": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
          "sha256": "b80ee9ec7e231d030fddb5a5ce2ec3877a8e3dbe789d1ba843cf1199fb2ce5b0",
          "plainKoSha256": "26d31a88aca37456da9fd636b13a304fca97d455fd0e6d859cb72369b30b8e7c"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "평소에는 말이 적다가 잘 아는 주제가 나오면 갑자기 설명이 길어진다. 관심 밖의 주제에는 잘 알지도 않고 알려고 하지도 않는다.",
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
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "관심사가 표현을 여는 조건",
    "jointReason": "식상 저신호는 표현 결핍이 아니며 주제 촉발 말하기를 별도 통로로 비교",
    "positive": "청자의 질문에 맞는 관심사 설명으로 대화를 시작",
    "risk": "관심사를 말할 기회만 찾고 상대 참여를 놓침",
    "goodIntentionMistake": "정확히 알려주려 일방적 강의를 계속함",
    "twist": "짧은 질문을 받으면 긴 설명보다 표현이 잘 통할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 관심 주제 설명 전 상대가 궁금한 범위를 묻는 장면"
    },
    "behaviorQuestion": "설명할 범위와 질문할 틈을 남기기",
    "conditions": [
      "유효한 저신호 범위·실제 주제·청자 동의 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "관심 주제여도 말보다 글이 편할 수 있음",
    "exclusions": [
      "식상 부족이므로 말·감정이 없다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "enfj-expression의 사회적 표현보다 특정 관심사 촉발",
    "applicabilityRef": "fkr:app:legacy:intp-expression",
    "legacyTagReview": {
      "originalMyeongliTag": "expression-gap",
      "originalMbtiTag": "expression",
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
    "id": "fkr:legacy:entp-rules",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entp-rules",
    "existingRuleSha256": "2138ef8b573b3d2785f6935f3841f77fda432494b04d0e9c31643f4c8a6f92d4",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "약속을 지켜야 한다는 건 압니다. 그런데 더 재미있고 빠른 방법이 보이면, 정해진 순서를 그대로 따르기가 영 심심합니다.",
    "originalDomains": [
      "work",
      "identity"
    ],
    "contexts": [],
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
          "area": "thinkingStyle",
          "traitId": "possibility_scanning",
          "file": "docs/product/mbti/source/ENTP.json",
          "pointer": "/traits/thinkingStyle/0",
          "sourceCoverage": "direct",
          "sourceVersion": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
          "sha256": "022a47d4dd2f078284c0817cc681f94eaa2b7415509a6b77ff2281a8b0ab5b46",
          "plainKoSha256": "679603cb68926194d9f090465587172a616d7e1d2f72506ef2a1d0ed40dea019"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTP의 사고는 하나의 답에 오래 머무르지 않는다. 서로 관련 없어 보이는 분야를 연결하고, 지금 방식 말고 다른 경로가 있는지 빠르게 훑는다.",
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
    "coreMeaning": "약속의 결과와 바꿀 방법을 분리",
    "jointReason": "정관의 역할 기준과 가능성 탐색은 같은 대상에서 반대인지 먼저 확인",
    "positive": "약속한 결과를 지키며 절차 시험을 제안",
    "risk": "방법 변경을 이유로 기한과 책임까지 바꿈",
    "goodIntentionMistake": "더 나은 답을 찾으려 합의를 계속 뒤집음",
    "twist": "고정할 최소 약속이 있으면 실험 여지가 커짐",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 납기와 시험 절차를 따로 합의하는 장면"
    },
    "behaviorQuestion": "바뀌는 방법과 유지할 약속을 공지",
    "conditions": [
      "실제 규칙 목적·변경권·기한 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "규칙을 바꿀 필요가 없는 안전 과제도 있음",
    "exclusions": [
      "ENTP이므로 정관 기준과 항상 반항한다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "상관견관 구조 규칙과 달리 구조 긴장을 계산하지 않음",
    "applicabilityRef": "fkr:app:legacy:entp-rules",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "experimentation",
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
    "id": "fkr:legacy:entp-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "entp-needle",
    "existingRuleSha256": "e5bd51065ffe22e48d630c9dd0dcafe82f1b121e9b31193ecd4d5c1018288c5e",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "말은 멋진데 뭔가 앞뒤가 안 맞으면 바로 걸립니다. 다 같이 고개를 끄덕이는 순간에 혼자 질문을 던지는 편입니다.",
    "originalDomains": [
      "strengths",
      "work",
      "weaknesses"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENTP",
          "area": "thinkingStyle",
          "traitId": "flaw_detection",
          "file": "docs/product/mbti/source/ENTP.json",
          "pointer": "/traits/thinkingStyle/4",
          "sourceCoverage": "direct",
          "sourceVersion": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
          "sha256": "1dba8b2921149e0ba4f92f0bb267fdaf15b3bb7d96a159e11da85b900132a42b",
          "plainKoSha256": "28cb06912c33644c7843a196656c55ea751c554948499212ef09e2d7a07eda6d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENTP는 논리적 모순, 시스템 결함, 말과 행동의 불일치를 잘 찾아낸다. 전통적인 가치나 다수가 따르는 방식도 다른 각도에서 해체해 본다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:counterpattern",
        "definition": "맞지 않는 사례를 적극 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "허점을 찾은 뒤 대안의 반례도 확인",
    "jointReason": "현침 정밀함은 미검증 응용이며 MBTI 논리 결함 trait와 동일 전통 사실이 아님",
    "positive": "원래 안과 자기 대안 모두 같은 검토 기준에 놓음",
    "risk": "다른 사람의 모순만 찾고 자기 가정은 예외로 둠",
    "goodIntentionMistake": "나쁜 결정을 막으려 논의를 해체만 함",
    "twist": "대안에도 같은 질문을 적용하면 반론이 협의로 바뀜",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 기존 절차와 새 절차의 실패 조건을 비교하는 장면"
    },
    "behaviorQuestion": "원안·대안에 공통 기준 적용",
    "conditions": [
      "독립 오류 근거·반론 안전·대안 검토 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "논리 차이를 보고도 굳이 공개 반론하지 않을 수 있음",
    "exclusions": [
      "현침으로 진실 판별 능력 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "istj-needle의 데이터 오류와 논리·행동 불일치는 다른 대상",
    "applicabilityRef": "fkr:app:legacy:entp-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:infj-depth",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "infj-depth",
    "existingRuleSha256": "63eca51a2ce56f748fa078eb391b1f1aa604a57e770a4f65b8df340fc37c4ea9",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "짧은 대화가 끝난 뒤에야 생각이 길어집니다. 남들은 잊은 말의 작은 차이를 혼자 다시 들여다보는 편입니다.",
    "originalDomains": [
      "identity",
      "study",
      "weaknesses"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "ten_god_pian_yin",
        "sinsal_gwimun"
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
        },
        {
          "id": "foundation:shinsal_gwiin:gwimun",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:gwimun:e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
          "recordSha256": "e197ee96e2a8d171cc1d925453cafb5ebf277d82666f23192db395cc967b7e03",
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
      "meaning": "남이 넘긴 질문을 끝까지 파고듭니다. / 그냥 지나치기 어려운 질문을 집요하게 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFJ",
          "area": "thinkingStyle",
          "traitId": "private_analysis_loop",
          "file": "docs/product/mbti/source/INFJ.json",
          "pointer": "/traits/thinkingStyle/1",
          "sourceCoverage": "direct",
          "sourceVersion": "394227f31f485014d3f8be75060d1f03b3b3afa13cd464c9b1716624bf3f6500",
          "sha256": "5411c3cb9de564e78e11d2fd24d1e5c8ba861cab348a2362ce7dd50a280f3293",
          "plainKoSha256": "6f3cd6efacc501dc5aebe73fc78d77089398317eb5a48d59d81f0445f7df1def"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFJ는 중요한 생각을 바로 말하기보다 혼자 정리하고 분석한 뒤 꺼내는 편이다. Ni와 Ti가 결합되면 감정적인 사람처럼 보여도 내부에서는 상당히 논리적인 검토가 진행된다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "ENERGY_DIRECTION",
        "direction": 1,
        "facetRef": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DEPTH",
        "direction": 1,
        "facetRef": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "혼자 정리한 생각을 확인 가능한 말로 꺼내기",
    "jointReason": "편인·귀문의 탐구 해석과 사적 분석 trait가 전달 전 숙고에서 관련",
    "positive": "상대 말을 해석한 부분과 실제 들은 부분을 구분",
    "risk": "오래 생각한 해석을 상대의 숨은 의도로 확정",
    "goodIntentionMistake": "이해하려고 직접 묻는 대신 혼자 설명을 완성",
    "twist": "짧은 중간 질문이 혼자 하는 분석의 오류를 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 대화 뒤 메모 중 추측 부분만 다시 묻는 장면"
    },
    "behaviorQuestion": "관찰·추측·확인 질문을 나눔",
    "conditions": [
      "실제 대화와 원천 성향·해석의 반례 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "혼자 정리해도 상대 뜻을 모를 수 있음",
    "exclusions": [
      "귀문으로 타인 의도·거짓 탐지 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INTJ의 시스템 원리보다 사적 정리와 전달 시점에 초점",
    "applicabilityRef": "fkr:app:legacy:infj-depth",
    "legacyTagReview": {
      "originalMyeongliTag": "inquiry",
      "originalMbtiTag": "inquiry",
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
    "id": "fkr:legacy:infj-marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "infj-marriage",
    "existingRuleSha256": "9a436be0aa46cef5b86624d3707ddfbe38c1461b435ceb88acef74965eccfaaa",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "함께 있는 시간이 좋아도 혼자 조용해질 틈이 필요합니다. 말수가 줄었다고 마음까지 멀어진 건 아닙니다.",
    "originalDomains": [
      "marriage"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_hwagae"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hwagae",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hwagae:401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
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
      "meaning": "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFJ",
          "area": "marriage",
          "traitId": "private_time_needed",
          "file": "docs/product/mbti/source/INFJ.json",
          "pointer": "/traits/marriage/1",
          "sourceCoverage": "direct",
          "sourceVersion": "394227f31f485014d3f8be75060d1f03b3b3afa13cd464c9b1716624bf3f6500",
          "sha256": "0c8d2331162ffcae7502ee7fe2e00d904c4443cc59f7340d2258281c0eb6dc07",
          "plainKoSha256": "4e13217a80bfa20d60992d1d50149ff2ebf9af095110ca0362f81ae63436d1ff"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFJ는 혼자만의 시간이 침해당하는 것을 싫어하지만 이를 바로 표현하지 못할 수 있다. 결혼 생활에서는 정서적 친밀감과 개인 공간을 동시에 보장해야 한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
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
    "coreMeaning": "함께 사는 친밀감과 사적 여백의 재협의",
    "jointReason": "화개의 몰입 상징을 실제 공간 필요와 비교하되 혼인 상태는 별도 입력",
    "positive": "공동 책임을 남긴 채 혼자 있을 때를 정함",
    "risk": "필요를 말하지 않고 상대가 알아주길 기대",
    "goodIntentionMistake": "상대를 배려해 계속 맞추다가 갑자기 단절",
    "twist": "미리 알린 짧은 사적 시간이 공동 시간을 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 저녁 혼자 정리 시간과 돌봄 분담을 정하는 장면"
    },
    "behaviorQuestion": "공간 요청과 실제 인수인계 함께 설명",
    "conditions": [
      "혼인·동거·분담·개인 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "공간보다 함께 조용히 있는 것이 편할 수 있음",
    "exclusions": [
      "화개이므로 결혼이 어렵거나 외롭다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "istp-marriage는 간섭 한도, 이 규칙은 요청 표현과 재협의",
    "applicabilityRef": "fkr:app:legacy:infj-marriage",
    "legacyTagReview": {
      "originalMyeongliTag": "solitude",
      "originalMbtiTag": "solitude",
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
    "id": "fkr:legacy:infp-expression",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "infp-expression",
    "existingRuleSha256": "84ce98e11c02daafc943cc9c4c271d70cc6b6f1d9d7a477ab52508489bba3409",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "그대로 외우면 안 들어오던 말도 내 경험에 빗대면 선명해집니다. 설명하다 보면 남이 준 답이 아니라 내 이야기가 됩니다.",
    "originalDomains": [
      "study",
      "strengths"
    ],
    "contexts": [],
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
          "area": "study",
          "traitId": "storytelling_learning",
          "file": "docs/product/mbti/source/INFP.json",
          "pointer": "/traits/study/0",
          "sourceCoverage": "direct",
          "sourceVersion": "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
          "sha256": "755a3f723c3fee625f3d87b22006a625c0565f207ecb4587e7f5b2662539e660",
          "plainKoSha256": "b417a8a233dafbbc945db2da122aabdcf5a8fd520eb2021fdf035f104b4be7e2"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFP는 암기와 반복보다 창의력, 상상력, 스토리텔링을 통한 학습에서 더 잘 열린다. 자기만의 의미가 붙은 정보는 오래 기억할 수 있다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CREATION",
        "direction": 1,
        "facetRef": "sar:facet:CREATION:recombination",
        "definition": "알고 있는 재료를 다른 방식으로 결합",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "자기 이야기로 이해한 내용을 다시 검증",
    "jointReason": "식신의 산출 후보와 스토리 학습이 기억용 변환에서 만남",
    "positive": "예시로 개념을 익힌 뒤 다른 과제에도 적용",
    "risk": "자기에게 의미 있는 이야기만 정답처럼 기억",
    "goodIntentionMistake": "잘 이해하려 사실과 비유의 경계를 지움",
    "twist": "이야기에서 벗어난 반례가 오히려 배움을 넓힐 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 개념을 짧은 이야기로 설명한 뒤 다른 사례에 적용하는 장면"
    },
    "behaviorQuestion": "비유와 원래 개념을 나눠 확인",
    "conditions": [
      "학습 과제·정확한 자료·실제 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "반복 연습이 더 적합한 과제도 있음",
    "exclusions": [
      "INFP·식신이므로 암기 불능 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "istp-study의 감각 실습과 이야기 재구성은 다른 통로",
    "applicabilityRef": "fkr:app:legacy:infp-expression",
    "legacyTagReview": {
      "originalMyeongliTag": "expression",
      "originalMbtiTag": "expression",
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
    "id": "fkr:legacy:infp-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "infp-needle",
    "existingRuleSha256": "7ee40a3afa5ccb16db90a580eddce0dd60604a6a4696a61b542b4884b3e7202d",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "평소에는 넘어가도 말의 진심이 어긋나는 순간은 잘 알아챕니다. 부드러운 사람이 갑자기 날카로워졌다는 말을 듣는 이유입니다.",
    "originalDomains": [
      "relationships",
      "weaknesses"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "INFP",
          "area": "thinkingStyle",
          "traitId": "contextual_truth_detection",
          "file": "docs/product/mbti/source/INFP.json",
          "pointer": "/traits/thinkingStyle/5",
          "sourceCoverage": "direct",
          "sourceVersion": "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
          "sha256": "274398cf9e120d6cd633dff6e484b3051ee56ff0ec71c9444cd8de9af769ebf4",
          "plainKoSha256": "3c09c9a5077b5e0aa44a011f88fed917b945b9cde9bbd9bfcfc65f915acda0ca"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "INFP는 말의 뉘앙스, 평소 성향과 현재 행동의 불협화음, 이야기의 논리적 비약, 은유적 의미를 연결해 진정성과 거짓의 배경을 파악한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "말의 불협화음과 진실 판정을 분리",
    "jointReason": "현침을 진실 탐지 근거로 쓰지 않고 실제 trait의 맥락 비교를 질문 후보로 제한",
    "positive": "말·행동 차이를 보고 상황 설명을 추가로 요청",
    "risk": "불일치를 곧 거짓·위선이라고 확정",
    "goodIntentionMistake": "진정성을 지키려 상대의 다른 사정을 지움",
    "twist": "말이 달라진 이유를 물으면 판단을 수정할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 다른 답이 나온 일정 조건을 다시 확인하는 장면"
    },
    "behaviorQuestion": "관찰한 차이만 말하고 이유 묻기",
    "conditions": [
      "실제 발언·상황 변화·다른 설명 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "표현 실수여도 진심은 같을 수 있음",
    "exclusions": [
      "현침이나 INFP로 거짓말 탐지 승인",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "isfp-needle은 비언어 관찰, 이 규칙은 서사·맥락 불일치",
    "applicabilityRef": "fkr:app:legacy:infp-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:enfj-help",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfj-help",
    "existingRuleSha256": "8dc1643634900a0e970a784fdfb094982c9ed6765f3407d9ca7e52bfb2f19ca9",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "누가 막막해하면 방법만 알려주고 끝내기 어렵습니다. 그 사람이 해내는 모습까지 보고 싶고, 그런 마음이 좋은 사람을 곁에 남깁니다.",
    "originalDomains": [
      "relationships",
      "strengths",
      "work"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "ten_god_zheng_yin",
        "gwiin_cheoneul"
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
        },
        {
          "id": "foundation:shinsal_gwiin:cheoneul",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:cheoneul:043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
          "recordSha256": "043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
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
      "meaning": "배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다. / 사람복이 있습니다. 막힌 길에서 도움을 연결하는 좋은 패입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFJ",
          "area": "identity",
          "traitId": "compassionate_facilitator",
          "file": "docs/product/mbti/source/ENFJ.json",
          "pointer": "/traits/identity/0",
          "sourceCoverage": "direct",
          "sourceVersion": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
          "sha256": "050c9065f29693df0df7d183fd4144b35cd18f08bd92fed358d575ba06761127",
          "plainKoSha256": "493c5a7a585674ee3c43172d48956f9dc9bc6cc92695a98254b75165a9649b13"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFJ는 사람을 향한 연민과 이해심이 강하다. 타인의 관심사와 필요를 진지하게 듣고, 그 사람이 더 편안하고 성장할 수 있도록 실제로 움직인다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "받는 도움과 제공할 도움의 방향을 구별",
    "jointReason": "정인·귀인의 수혜 해석과 필요를 듣는 trait는 동일 help라는 이유만으로 같지 않음",
    "positive": "받을 지원을 고르고 상대가 원하는 도움도 물음",
    "risk": "내가 도움을 주면 반드시 사람복이 돌아온다고 기대",
    "goodIntentionMistake": "성장을 돕고 싶어 상대 결정을 대신함",
    "twist": "필요하지 않은 개입을 멈추는 것도 지원일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 조언을 청한 사람에게 필요한 방식부터 묻는 장면"
    },
    "behaviorQuestion": "수혜·제공·동의의 주체를 따로 기록",
    "conditions": [
      "실제 도움 방향과 원천 행동·지원 여력 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "도움을 잘 받아도 타인을 자주 돕지 않을 수 있음",
    "exclusions": [
      "귀인 수혜로 CARE·보답·성공 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "esfj-help의 실제 제공 행동과 경청·성장 지원을 구분",
    "applicabilityRef": "fkr:app:legacy:enfj-help",
    "legacyTagReview": {
      "originalMyeongliTag": "help",
      "originalMbtiTag": "help",
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
    "id": "fkr:legacy:enfj-expression",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfj-expression",
    "existingRuleSha256": "93207b6d091b91f6cf00791d6006ace7f228720218f8d57ef0061359a8e97807",
    "legacyKind": "complement",
    "researchRelation": "task_complement",
    "originalMeaning": "혼자 생각할 때보다 사람 앞에서 이야기를 풀 때 말이 살아납니다. 막막해하는 사람의 마음을 대신 정리해주는 일이 표현의 통로가 됩니다.",
    "originalDomains": [
      "relationships",
      "work"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "distribution:output-low"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:no_output",
          "auditRef": "source-ref-catalog.json#csr:profile:no_output:bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "recordSha256": "bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "relation": "related_not_equivalent",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "표현의 통로를 다른 행동 습관과 함께 살펴볼 자리입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFJ",
          "area": "communication",
          "traitId": "eloquent_social_speech",
          "file": "docs/product/mbti/source/ENFJ.json",
          "pointer": "/traits/communication/0",
          "sourceCoverage": "direct",
          "sourceVersion": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
          "sha256": "3d962b24e96da939dec02304178a8678858f19f3054ead5086cb30e849c81a21",
          "plainKoSha256": "c35da4eef9d0d1fadeb0ff08df7f8bfa6c36646feeefc64b798f480cee11060f"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFJ는 말과 글의 재능이 뛰어나며, 대화의 주도권을 쉽게 가져간다. 분위기에 맞는 표현과 비유로 사람들의 공감을 끌어낸다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "말이 나오는 환경과 실제로 전달된 뜻",
    "jointReason": "저신호 분포와 사회적 언어 trait는 표현의 양이 아닌 통로 차이",
    "positive": "청자 반응을 확인하며 생각을 말로 정리",
    "risk": "능숙한 말이 상대의 동의까지 대신한다고 착각",
    "goodIntentionMistake": "분위기를 돕기 위해 말할 틈을 혼자 채움",
    "twist": "잠시 멈추는 것이 상대의 표현을 열 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 발표 뒤 질문을 기다려 상대 말로 이해를 확인하는 장면"
    },
    "behaviorQuestion": "내 표현·상대 이해·동의를 구별",
    "conditions": [
      "저신호의 유효 범위·실제 청자·대화 권한 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "사람 앞이어도 글이 더 편한 상황이 있음",
    "exclusions": [
      "식상 부족을 웅변으로 치료한다고 주장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INTP의 주제 촉발과 달리 사회적 청자 조건이 핵심",
    "applicabilityRef": "fkr:app:legacy:enfj-expression",
    "legacyTagReview": {
      "originalMyeongliTag": "expression-gap",
      "originalMbtiTag": "expression",
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
    "id": "fkr:legacy:enfp-connection",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfp-connection",
    "existingRuleSha256": "b64ae483b4f94a39d35fcc7ce33473ece4ad43772740e4133250a21299d9cd35",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "친구 이야기에서 여행 장면이 떠오르고, 거기서 새 아이디어가 나옵니다. 남들에게는 뜬금없어 보여도 내 머릿속에서는 이미 이어져 있습니다.",
    "originalDomains": [
      "identity",
      "work",
      "strengths"
    ],
    "contexts": [],
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
          "type": "ENFP",
          "area": "thinkingStyle",
          "traitId": "ne_connection_thinking",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/thinkingStyle/0",
          "sourceCoverage": "direct",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "a7901c07e7ef80a12b76c53d0b81f3b1abf2abd6954749e9fcd97b6a27bb265f",
          "plainKoSha256": "68d176153713f5206cea0bd613cecc83c1987d0aa20263fbdefaa2f852c58fdc"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP의 직관은 단순한 호기심이 아니라 서로 관련 없어 보이는 것들 사이에서 의미와 연결을 찾아내는 방식이다. 어떤 사안의 세부보다 전체 맥락과 가능성을 먼저 잡는다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:cross-link",
        "definition": "다른 영역의 관계를 가설로 연결",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CURIOSITY",
        "direction": 1,
        "facetRef": "sar:facet:CURIOSITY:alternative-search",
        "definition": "기존 답 밖의 자료를 찾아봄",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "먼 연결을 과제에 맞는 가능성으로 좁히기",
    "jointReason": "편인의 다른 관점 후보와 연상 연결 trait를 적용 가능한 가설에서 비교",
    "positive": "낯선 정보를 잇고 필요한 검증을 남김",
    "risk": "연결이 떠오른 것을 인과관계로 확정",
    "goodIntentionMistake": "아이디어를 돕고 싶어 주제와 먼 이야기를 계속 보탬",
    "twist": "끊어둘 연결을 고르면 발상이 더 명료해질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 고객 이야기와 다른 분야 사례를 비교 후 실제 차이를 적는 장면"
    },
    "behaviorQuestion": "유사점·차이·시험할 가정을 분리",
    "conditions": [
      "원천 연결 성향·실제 과제·반례 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "재미있는 연상이 해결책에는 쓸모 없을 수 있음",
    "exclusions": [
      "편인+ENFP이면 창의적 성공 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "intj-inquiry의 일관된 체계보다 먼 정보 사이 가설",
    "applicabilityRef": "fkr:app:legacy:enfp-connection",
    "legacyTagReview": {
      "originalMyeongliTag": "inquiry",
      "originalMbtiTag": "inquiry",
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
    "id": "fkr:legacy:enfp-expression",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfp-expression",
    "existingRuleSha256": "1873b984cee36b0ed201ed542d56064be514cee92f18f086c6c3abb8cb5fd13e",
    "legacyKind": "complement",
    "researchRelation": "task_complement",
    "originalMeaning": "혼자서는 정리 안 되던 마음도 좋아하는 사람 앞에서는 표정과 말로 나옵니다. 표현의 힘을 꼭 혼자 짜낼 필요는 없는 사람입니다.",
    "originalDomains": [
      "identity",
      "relationships",
      "love"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "distribution:output-low"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:no_output",
          "auditRef": "source-ref-catalog.json#csr:profile:no_output:bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "recordSha256": "bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "relation": "related_not_equivalent",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "표현의 통로를 다른 행동 습관과 함께 살펴볼 자리입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFP",
          "area": "identity",
          "traitId": "expressive_authenticity",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/identity/3",
          "sourceCoverage": "direct",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "7cc03d8d37dbec0c99385f0472d23a018eb0401b4a35bfb39021d6f5c8250c56",
          "plainKoSha256": "954a3906e8ff1a7a6537de8f0e3b2f5f27a5cb1fefe1b764b0b8314a7a1c5c8d"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP는 감정이 얼굴과 말투에 잘 드러난다. 가식적으로 숨기기보다는 좋고 싫음, 기쁨과 실망이 자연스럽게 밖으로 나온다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "자연스러운 반응과 공개 선택의 구별",
    "jointReason": "식상 저신호는 감정 부재가 아니며 얼굴·말투의 표현을 별도 관찰",
    "positive": "밖으로 나오는 반응을 의도와 범위로 설명",
    "risk": "즉각 드러난 감정을 최종 약속으로 읽게 함",
    "goodIntentionMistake": "진솔하려 상대의 사적 정보까지 공개",
    "twist": "지금 말하지 않을 자유도 진솔함과 공존",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 실망한 표정과 아직 결정하지 않은 의견을 구분하는 장면"
    },
    "behaviorQuestion": "현재 반응과 확정 의사를 따로 알림",
    "conditions": [
      "실제 표현 맥락·공개 동의·저신호 유효성 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "감정이 있어도 안전 때문에 드러내지 않을 수 있음",
    "exclusions": [
      "식상 부족이 실제 감정 부족이라고 주장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ESFP의 자기 이야기 공유와 감정 반응의 노출은 다름",
    "applicabilityRef": "fkr:app:legacy:enfp-expression",
    "legacyTagReview": {
      "originalMyeongliTag": "expression-gap",
      "originalMbtiTag": "expression",
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
    "id": "fkr:legacy:enfp-alone",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfp-alone",
    "existingRuleSha256": "835eda231bfa60d550ee94da499a0782f7dcb43fca89b209ea87c145f270898d",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "모임에서는 신나게 이야기하고 집에 오면 아무 말도 하기 싫습니다. 사람에게서 힘을 얻는 마음과 혼자 깊어지는 마음이 같이 있습니다.",
    "originalDomains": [
      "identity",
      "relationships"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_hwagae",
        "ten_god_pian_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hwagae",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hwagae:401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        },
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
      "meaning": "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다. / 남이 넘긴 질문을 끝까지 파고듭니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ENFP",
          "area": "identity",
          "traitId": "people_centered_energy",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/identity/1",
          "sourceCoverage": "direct",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "d5ee57333a4e56a077112db8baf7a9b84ee5878e7195fef1344042ffa83c3f5e",
          "plainKoSha256": "1e14ee4eb570ac885bea5400233f4caadc1cd6d359d417a81d5608f4ba6aaa52"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP는 사회적 상호작용에서 많은 에너지를 얻는다. 사람의 이야기, 감정, 경험을 흥미롭게 듣고, 그 안에서 새로운 대화와 관계의 가능성을 찾는다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:rest-access",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "교류의 즐거움과 회복 방법을 따로 확인",
    "jointReason": "화개·편인의 몰입 후보와 사람 중심 에너지는 반대 성격이 아니라 다른 활동 기능일 수 있음",
    "positive": "즐길 만남과 쉬는 방식을 실제 여력에 맞게 선택",
    "risk": "사람을 좋아한다는 말로 모임 과부하를 정당화",
    "goodIntentionMistake": "친구를 실망시키지 않으려 계속 참여",
    "twist": "모임을 줄여도 관계의 관심은 유지될 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 긴 모임 뒤 혼자 있을 저녁을 미리 말하는 장면"
    },
    "behaviorQuestion": "참여 욕구와 현재 부하를 별도 질문",
    "conditions": [
      "교류 선호·실제 피로·쉬는 방식 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "교류 자체가 회복이 되는 날도 있음",
    "exclusions": [
      "외향이므로 반드시 혼자 지쳐 있다고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ENTJ의 공적 영향력·ESFJ의 분위기 읽기와 다름",
    "applicabilityRef": "fkr:app:legacy:enfp-alone",
    "legacyTagReview": {
      "originalMyeongliTag": "solitude",
      "originalMbtiTag": "sociability",
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
    "id": "fkr:legacy:enfp-budget",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "enfp-budget",
    "existingRuleSha256": "8bf956438418b60480c8e66c022933e51d5abd3de96c638c6ce341fa6ee71f30",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "돈을 차곡차곡 남기고 싶은데 재미있는 여행 공지는 또 그냥 못 넘깁니다. 안정도 경험도 포기하기 싫어서 결제창 앞에서 생각이 많아집니다.",
    "originalDomains": [
      "money"
    ],
    "contexts": [],
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
          "type": "ENFP",
          "area": "money",
          "traitId": "experience_spending",
          "file": "docs/product/mbti/source/ENFP.json",
          "pointer": "/traits/money/0",
          "sourceCoverage": "inferred",
          "sourceVersion": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
          "sha256": "a039fb5ebbd332c4df2c1933f7bbb17e7c7681f9e2e96bf771dcd5a6c181b2ae",
          "plainKoSha256": "413e4bee7116671a6c36b6e15f3a919c1e437fb581f5add47c96adf0f0c235da"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ENFP는 강렬하고 감각적인 삶, 새로운 경험, 사람들과 공유할 이야기에 끌린다. 돈도 물건보다 경험, 여행, 모임, 자기표현에 흐르기 쉽다.",
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
    "coreMeaning": "남길 자원과 경험의 가치를 함께 배분",
    "jointReason": "정재의 축적 후보와 inferred 경험 소비 trait는 어떤 지출이 가치 있는지의 차이",
    "positive": "필수 비축과 선택 경험의 한도를 나눔",
    "risk": "절약·경험 중 하나만 도덕적 정답으로 삼음",
    "goodIntentionMistake": "추억을 만들려 공동 비용을 먼저 약속",
    "twist": "지출하지 않는 경험도 원하는 가치를 줄 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 여행 공지를 보고 공동 예산과 개인 선택을 나누는 장면"
    },
    "behaviorQuestion": "필수비·비축·경험 예산을 합의",
    "conditions": [
      "inferred 상태·실제 여력·소유권·동의 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "경험을 좋아해도 검소할 수 있음",
    "exclusions": [
      "ENFP이므로 낭비·저축 실패 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "intj-money의 규칙 관리와 지출 가치 선택은 다름",
    "applicabilityRef": "fkr:app:legacy:enfp-budget",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "experience-spending",
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
    "id": "fkr:legacy:istj-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istj-needle",
    "existingRuleSha256": "2fc7b368a7a36c4f389bb2a8c550c89eb35930b87da25cd2799e8e7f097a4258",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "다들 괜찮다며 넘긴 자료에서 혼자 숫자 하나가 걸립니다. 어긋난 순서가 보이면 고치기 전까지 마음이 안 놓이는 편입니다.",
    "originalDomains": [
      "work",
      "strengths",
      "study"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISTJ",
          "area": "thinkingStyle",
          "traitId": "efficient_error_detection",
          "file": "docs/product/mbti/source/ISTJ.json",
          "pointer": "/traits/thinkingStyle/1",
          "sourceCoverage": "direct",
          "sourceVersion": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a",
          "sha256": "734fb61164252cce9b9ed3b18c88183abd8db93ebbce0135f116621e1bb06fae",
          "plainKoSha256": "b1c4340792a2be816e9c9dda32267554926f1fbe92a37f646777f2ee35b77113"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "감정이 아니라 효율, 실용성, 데이터 오류를 계속 검토한다. 시스템의 결함이나 논리적 모순을 보면 그냥 넘기기 어렵다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:outcome-check",
        "definition": "실행 뒤 남은 결과를 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "숫자·순서의 오류와 실제 영향 구분",
    "jointReason": "현침 정밀함은 미검증 연결이며 실제 데이터 검토 trait에서만 질문을 구체화",
    "positive": "사용 결과에 영향 주는 오류부터 고침",
    "risk": "사소한 차이까지 같은 긴급도로 처리",
    "goodIntentionMistake": "품질을 지키려 마감 뒤에도 수정 확대",
    "twist": "수정하지 않을 차이를 정하면 중요한 오류를 더 잘 다룸",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 검수 목록에서 사용자 영향 순으로 순서를 정하는 장면"
    },
    "behaviorQuestion": "오류·영향·수정 비용을 나누기",
    "conditions": [
      "독립 오류 자료·합의된 검수 기준·마감 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "오류를 알아도 고칠 권한이 없을 수 있음",
    "exclusions": [
      "현침으로 정확한 업무 능력 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ENTP의 논리 반론보다 데이터·운영 결과 오류",
    "applicabilityRef": "fkr:app:legacy:istj-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:istj-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istj-love",
    "existingRuleSha256": "877931c42dbbeb2e166eba2a2d4ec4fc03fefc40edfc1c6c2815d45eac571e77",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "큰 말보다 약속한 시간에 오는 사람이 좋습니다. 본인도 챙겨주고 기억하는 것으로 마음을 다 전했다고 생각하는 편입니다.",
    "originalDomains": [
      "love",
      "relationships"
    ],
    "contexts": [],
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
          "type": "ISTJ",
          "area": "love",
          "traitId": "trust_first_love",
          "file": "docs/product/mbti/source/ISTJ.json",
          "pointer": "/traits/love/0",
          "sourceCoverage": "direct",
          "sourceVersion": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a",
          "sha256": "17eec3bac834387f9c208dd6a2bc5ca527d14720aa113c4bcd13b59e507e05a0",
          "plainKoSha256": "6cf5aaf11c27bd6255903f9e39e5dc8f87c903d2aed9f451ff36205ee1bae04b"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "연애에서는 설렘보다 신뢰, 책임, 약속 이행을 먼저 본다. 잘 맞는 사람을 만나면 관계를 오래 유지하는 힘이 있다.",
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
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "신뢰를 쌓는 약속과 바꿔야 하는 조건",
    "jointReason": "정관 기준 해석과 약속 이행 trait를 합의된 실제 약속으로 제한",
    "positive": "같은 태도와 변경 공지로 예측 가능성 유지",
    "risk": "오래 지킨 관행을 상대도 원한다고 가정",
    "goodIntentionMistake": "책임 있게 하려 연락 방식까지 의무화",
    "twist": "변경 이유를 미리 말하는 것이 약속의 신뢰를 지킬 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 바뀐 근무 때문에 연락 시점을 다시 합의하는 장면"
    },
    "behaviorQuestion": "지킬 약속과 수정할 조건을 함께 알림",
    "conditions": [
      "실제 교제·약속·상대의 필요 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "즉흥적 만남을 신뢰 표현으로 느끼는 사람도 있음",
    "exclusions": [
      "정관이면 충실한 연인·장기 유지 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ISFJ의 마음 열림 속도와 약속 이행은 다름",
    "applicabilityRef": "fkr:app:legacy:istj-love",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "consistency",
      "relatedTags": [
        {
          "tag": "leadership",
          "researchRef": "sar:tag:leadership",
          "relation": "ONE_TO_MANY",
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
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:legacy:istj-marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istj-marriage",
    "existingRuleSha256": "b4b92be100ddb48fb6589324838f718bc4d234a123d6a9237eb6805cce1d9ddd",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "누가 할지 정하지 않은 집안일이 자꾸 눈에 들어옵니다. 사랑해도 생활의 약속까지 저절로 맞아지지는 않는다고 느끼는 편입니다.",
    "originalDomains": [
      "marriage"
    ],
    "contexts": [],
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
          "type": "ISTJ",
          "area": "marriage",
          "traitId": "fixed_role_and_budget",
          "file": "docs/product/mbti/source/ISTJ.json",
          "pointer": "/traits/marriage/2",
          "sourceCoverage": "inferred",
          "sourceVersion": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a",
          "sha256": "cf342a791bcdb1515b83c8fd88c4eb8f2d94ee89a11dc1bd9f02f9afbb763c7e",
          "plainKoSha256": "c7315c0dbc80ccc218bbd74d2c41751c2749e561e2fac9050537769885390737"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ISTJ는 결혼 생활에서 누가 무엇을 맡는지, 돈을 어떻게 쓰는지, 가족 책임을 어디까지 나눌지 분명해야 안정된다. 애매한 합의와 즉흥적인 돈 사용은 사랑 문제보다 생활 신뢰 문제로 느껴진다.",
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
        "axis": "RESOURCE_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "공동 생활의 돈과 보이지 않는 역할",
    "jointReason": "정재 자원 해석과 inferred 역할·예산 trait를 합의와 실제 노동에 연결",
    "positive": "지출과 가사 책임을 같은 협의에서 확인",
    "risk": "공식 분담표에 없는 정신적 부담을 누락",
    "goodIntentionMistake": "공평하게 나누려 상황 변화까지 같은 양으로 강제",
    "twist": "분담을 자주 갱신하면 예측 가능성이 높아질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 월 예산과 돌봄 일정의 숨은 일을 함께 적는 장면"
    },
    "behaviorQuestion": "비용·실행·기억할 책임을 나눠 기록",
    "conditions": [
      "혼인·동거·inferred 상태·실제 역할 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "수입 비율과 가사 분담 비율이 같을 필요는 없음",
    "exclusions": [
      "유형·성별로 가사와 생계 역할 배정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "intj-money는 개인 흐름, 이 규칙은 공동 소유·의무",
    "applicabilityRef": "fkr:app:legacy:istj-marriage",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "consistency",
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
    "id": "fkr:legacy:isfj-learning",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "isfj-learning",
    "existingRuleSha256": "aade51d7de2ea42fc79440a2fa1f04344866129c04426468f10ae95b6a0dde8a",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "한번 겪은 실수와 도움이 됐던 방법을 잘 기억합니다. 다시 비슷한 일이 생기면 누구보다 조용히 준비를 챙깁니다.",
    "originalDomains": [
      "study",
      "strengths"
    ],
    "contexts": [],
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
          "type": "ISFJ",
          "area": "thinkingStyle",
          "traitId": "sensory_memory_judgment",
          "file": "docs/product/mbti/source/ISFJ.json",
          "pointer": "/traits/thinkingStyle/0",
          "sourceCoverage": "direct",
          "sourceVersion": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
          "sha256": "9312705ee838258bd8e6de956a289c6457ff46dbb6ef35b1a90b23fcf7e5fbd8",
          "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "가능성이나 직감보다 직접 본 데이터, 과거 경험, 구체적인 증거를 기준으로 판단한다. 기억에 남은 장면과 감각을 세밀하게 저장해 다음 선택의 기준으로 삼는다.",
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
        "axis": "PATTERN_SENSE",
        "direction": 1,
        "facetRef": "sar:facet:PATTERN_SENSE:counterpattern",
        "definition": "맞지 않는 사례를 적극 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "기억한 사례가 다음 상황에도 맞는지 확인",
    "jointReason": "정인의 배움 후보와 구체 경험 판단 trait를 기억→적용 사이 조건에 연결",
    "positive": "도움 된 사례를 꺼내되 달라진 조건도 확인",
    "risk": "기억에 생생한 사례를 전체의 규칙으로 사용",
    "goodIntentionMistake": "실수를 막으려 처음과 다른 상황에도 같은 절차 적용",
    "twist": "기억과 다른 예외가 새로운 학습의 출발점이 될 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 과거 대응 기록과 이번 고객의 차이를 비교하는 장면"
    },
    "behaviorQuestion": "같은 조건·달라진 조건을 나누기",
    "conditions": [
      "실제 사례 기록·새 맥락·본인 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "잘 기억해도 새 과제에 적용되지 않을 수 있음",
    "exclusions": [
      "정인·ISFJ로 기억력·학업 성과 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INTP의 원인 탐구보다 구체 사례의 재사용 범위",
    "applicabilityRef": "fkr:app:legacy:isfj-learning",
    "legacyTagReview": {
      "originalMyeongliTag": "learning",
      "originalMbtiTag": "learning",
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
    "id": "fkr:legacy:isfj-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "isfj-love",
    "existingRuleSha256": "2d245f20b0fe96f77036f4c84bf8e2f27a8c96f9c02bd6daf3b5cf664e5f55d2",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "좋다는 말 한 번보다 며칠 뒤에도 같은 태도인지 봅니다. 마음이 열리는 속도는 느려도 한번 믿으면 쉽게 가볍게 대하지 않습니다.",
    "originalDomains": [
      "love",
      "relationships"
    ],
    "contexts": [],
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
          "type": "ISFJ",
          "area": "love",
          "traitId": "slow_trust_love",
          "file": "docs/product/mbti/source/ISFJ.json",
          "pointer": "/traits/love/0",
          "sourceCoverage": "direct",
          "sourceVersion": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
          "sha256": "0afe6707005e20976ebc353e404321c21ea0ed026a2657c1527a5d42fb51ea84",
          "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "연애를 빨리 시작하기보다 여러 번 상대를 살펴본 뒤 안정감을 느낄 때 마음을 연다. 시작은 느려도 한 번 들어가면 오래 책임지고 깊게 챙긴다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "DECISION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:DECISION_STYLE:option-hold",
        "definition": "가능성을 남길 이유와 기한을 설명",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "STABILITY",
        "direction": 1,
        "facetRef": "sar:facet:STABILITY:minimum-security",
        "definition": "유지할 최소 생활 조건을 정함",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "관계를 알아가는 속도와 안심 기준",
    "jointReason": "정관의 일관성 후보와 천천히 신뢰를 확인하는 trait는 결정을 미루는 이유를 질문",
    "positive": "마음 열기 전 필요한 경험과 기다릴 시간을 설명",
    "risk": "확인 기준을 말하지 않고 상대를 계속 평가",
    "goodIntentionMistake": "상처를 피하려 확정할 수 없는 보장을 요구",
    "twist": "불확실함을 말하는 대화가 오히려 안심을 줄 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 아직 알아가는 단계임과 다시 이야기할 때를 알리는 장면"
    },
    "behaviorQuestion": "필요한 확인과 요구할 수 없는 보장을 구별",
    "conditions": [
      "실제 교제 단계·자발적 기다림·동의 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "느리게 시작했어도 관계를 짧게 끝낼 수 있음",
    "exclusions": [
      "시작 속도로 충실함·결혼 결과 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ISTJ의 지킨 약속보다 관계 시작 전 안심 기준",
    "applicabilityRef": "fkr:app:legacy:isfj-love",
    "legacyTagReview": {
      "originalMyeongliTag": "consistency",
      "originalMbtiTag": "consistency",
      "relatedTags": [
        {
          "tag": "decisive-correction",
          "researchRef": "sar:tag:decisive-correction",
          "relation": "ONE_TO_MANY",
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
        }
      ],
      "use": "reference_only_no_new_semanticConnection"
    }
  },
  {
    "id": "fkr:legacy:estj-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "estj-needle",
    "existingRuleSha256": "58bc6b3ac03b5e2416ab6b57b7296053e5634b86e9b301088737454dcee98d49",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "수고했다는 말보다 틀린 곳부터 눈에 들어옵니다. 고치면 끝날 일이라고 생각했는데 상대는 그 말투를 오래 기억하기도 합니다.",
    "originalDomains": [
      "work",
      "weaknesses"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTJ",
          "area": "communication",
          "traitId": "corrective_feedback",
          "file": "docs/product/mbti/source/ESTJ.json",
          "pointer": "/traits/communication/2",
          "sourceCoverage": "direct",
          "sourceVersion": "8187be30ddd97adf87c1afedf15f179da1a25aa871dfa0ad9a6aadf6d4a25fc6",
          "sha256": "f257c3a956697751e8d8dccc1846fd61fbc277d0a57eb7ebe3ab165d821c484e",
          "plainKoSha256": "0bfd1840f8efbf8aeb302a975d9e6bfbb6ffb9519d769ebc1c745548c2197e19"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTJ는 문제점을 발견하면 부드럽게 포장하기보다 바로잡기 위한 피드백을 준다. 본인은 실용적 조언이라고 생각하지만 상대는 평가나 공격으로 느낄 수 있다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "COMMUNICATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "수정할 내용과 사람 평가를 나누는 피드백",
    "jointReason": "현침→예리함은 미검증이며 corrective_feedback trait의 실제 요청 방식과 비교",
    "positive": "검수 기준·수정할 행동을 구체적으로 말함",
    "risk": "오류 지적이 전체 역량 평가로 전달",
    "goodIntentionMistake": "도움을 주려 수고와 제약을 건너뜀",
    "twist": "한 문장의 기준 설명이 추가 지적보다 더 정확할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 보고서 수정 요청에 이유와 완료 기준을 붙이는 장면"
    },
    "behaviorQuestion": "관찰·영향·수정 요청을 분리",
    "conditions": [
      "독립 오류 자료·평가 권한·거절 안전 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "직설적이어도 공격 의도가 아닐 수 있음",
    "exclusions": [
      "현침이므로 비판이 항상 정확하다고 주장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "entj-needle의 결정 확고함보다 실제 피드백 행동",
    "applicabilityRef": "fkr:app:legacy:estj-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:estj-status",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "estj-status",
    "existingRuleSha256": "8b93c3a5324f78625cb8bfab2a1476cc8366bd1733c0219bbe1ebd1871c2309b",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "사람들이 망설일 때 일을 끝까지 맡는 쪽입니다. 덕분에 존재감이 커지지만, 어느새 모든 일이 내 차지가 되면 억울합니다.",
    "originalDomains": [
      "work",
      "success/fortune",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_jangseong"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:jangseong",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:jangseong:32e09231866902c37b2db529935baa2e5982deea821635fa2c8c0044217d0f3d",
          "recordSha256": "32e09231866902c37b2db529935baa2e5982deea821635fa2c8c0044217d0f3d",
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
      "meaning": "앞에 서고 이름을 알릴 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTJ",
          "area": "identity",
          "traitId": "responsible_operator",
          "file": "docs/product/mbti/source/ESTJ.json",
          "pointer": "/traits/identity/0",
          "sourceCoverage": "direct",
          "sourceVersion": "8187be30ddd97adf87c1afedf15f179da1a25aa871dfa0ad9a6aadf6d4a25fc6",
          "sha256": "cc90d5ce07e2707070dff522f22e3db8afb0f43ea520b755b986df0ad3c78833",
          "plainKoSha256": "fde888702a41a8a41d872a3c33904971f8c317126655597b46d07ca5258b134e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTJ는 자신에게 맡겨진 역할을 끝까지 수행해야 한다고 느낀다. 일과 관계에서 약속, 의무, 성과를 가볍게 여기지 않으며, 주변 사람에게도 같은 수준의 책임감을 기대한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "STATUS_DRIVE",
        "direction": 1,
        "facetRef": "sar:facet:STATUS_DRIVE:formal-role",
        "definition": "공식 위치의 책임과 기준을 검토",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "DUTY",
        "direction": 1,
        "facetRef": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "공식 위치보다 실제 맡은 역할의 범위",
    "jointReason": "장성의 위치 상징과 책임 수행 trait가 일치하는 대상은 맡은 역할이지 지배 권한이 아님",
    "positive": "직함과 무관하게 완료할 의무를 명확히 함",
    "risk": "성실한 수행을 타인의 결정권 장악으로 확대",
    "goodIntentionMistake": "잘 끝내려 남의 업무까지 맡음",
    "twist": "권한 밖 일을 돌려주는 것도 책임 있는 운영일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 책임자 이름과 승인권을 다른 칸에 적는 장면"
    },
    "behaviorQuestion": "직함·권한·실행 의무를 나눔",
    "conditions": [
      "실제 공식 역할·위임·지원 자원 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "책임감이 있어도 대표 역할을 원하지 않을 수 있음",
    "exclusions": [
      "장성+ESTJ로 리더·승진·높은 지위 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "entj-pressure는 긴급 조율, 이 규칙은 역할 이행",
    "applicabilityRef": "fkr:app:legacy:estj-status",
    "legacyTagReview": {
      "originalMyeongliTag": "leadership",
      "originalMbtiTag": "leadership",
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
    "id": "fkr:legacy:esfj-help",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "esfj-help",
    "existingRuleSha256": "563aa78e77a454d503cb28a55914866a0b24ef56d0abdf5570c2728ee8f06c83",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "누가 잘 못 끼고 있는지 먼저 눈에 들어옵니다. 챙긴 기억이 쌓여서 나도 도움이 필요할 때 부를 사람이 생기는 쪽입니다.",
    "originalDomains": [
      "relationships",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "gwiin_cheoneul",
        "ten_god_zheng_yin"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:cheoneul",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:cheoneul:043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
          "recordSha256": "043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
          "relation": "existing_feature_reference",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": null,
            "approvedForCustomer": null
          }
        },
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
      "meaning": "사람복이 있습니다. 막힌 길에서 도움을 연결하는 좋은 패입니다. / 배운 것과 받은 도움을 내 힘으로 만드는 재주가 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFJ",
          "area": "identity",
          "traitId": "warm_provider_identity",
          "file": "docs/product/mbti/source/ESFJ.json",
          "pointer": "/traits/identity/1",
          "sourceCoverage": "direct",
          "sourceVersion": "40e80ffb692c97690487293c0d59b87715fa6ab25ce6978ec3eefc890525bcf8",
          "sha256": "ec99220bf92305dd5aa42a031b2546557b46c1e4df10dd0b29733db37353813a",
          "plainKoSha256": "710a4b9318f25b21860959e72b17c7f9b399799bae9c4381532efce48db06170"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "사람에게 관심이 많고 나눔과 베풂을 중요하게 여긴다. 도움이 필요한 사람이 보이면 말로 위로하는 데서 끝나지 않고 실제로 챙기고 연결하고 움직인다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "CARE",
        "direction": 1,
        "facetRef": "sar:facet:CARE:practical-support",
        "definition": "동의한 구체적 부담을 덜어줌",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "지원 네트워크와 실제 제공 노동을 구별",
    "jointReason": "귀인·정인의 받는 도움 해석과 나눔 행동은 방향을 확인해야 함께 읽을 수 있음",
    "positive": "실제로 필요한 사람에게 동의한 도움을 연결",
    "risk": "돌봄을 제공했으니 보답받아야 한다고 기대",
    "goodIntentionMistake": "누구도 소외되지 않게 하려 자기 여력을 무시",
    "twist": "직접 돕지 않고 적절한 지원자를 연결할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 요청자의 동의를 받고 필요한 기관을 알려주는 장면"
    },
    "behaviorQuestion": "받을 도움·제공할 도움·대신 연결할 도움을 구별",
    "conditions": [
      "도움 방향·동의·실제 지원 자원 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "지원 받는 사람이 제공 역할을 맡을 필요는 없음",
    "exclusions": [
      "귀인으로 타고난 선함·보답 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ENFJ의 경청·성장 지원과 직접 챙기는 노동의 차이",
    "applicabilityRef": "fkr:app:legacy:esfj-help",
    "legacyTagReview": {
      "originalMyeongliTag": "help",
      "originalMbtiTag": "help",
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
    "id": "fkr:legacy:esfj-alone",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "esfj-alone",
    "existingRuleSha256": "fd7b3702016ea1fe5f1ba54d2b0df56a4f9662e7a5afc44e094cd01873a49a93",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "어디서든 잘 맞춰주는 사람처럼 보여도 혼자 조용해질 시간이 필요합니다. 모임을 즐기는 것과 늘 사람 곁에 있고 싶은 건 다른 마음입니다.",
    "originalDomains": [
      "identity"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_hwagae"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hwagae",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hwagae:401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
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
      "meaning": "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFJ",
          "area": "identity",
          "traitId": "social_adaptation_engine",
          "file": "docs/product/mbti/source/ESFJ.json",
          "pointer": "/traits/identity/0",
          "sourceCoverage": "direct",
          "sourceVersion": "40e80ffb692c97690487293c0d59b87715fa6ab25ce6978ec3eefc890525bcf8",
          "sha256": "ec8e811aecd95c0e4a11af7b4c24e24b53e345f1c2c615abf578e657b6a3f912",
          "plainKoSha256": "6603fc98a0bec74866125f573fa99f114e0aa62f52023d8e0f874641a72a026b"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESFJ는 사람 많은 환경에서 긴장하기보다 관계의 흐름을 읽고 자기 자리를 빠르게 잡는다. 누가 소외되어 있는지, 누가 분위기를 이끌고 있는지, 어떤 말이 지금 필요한지를 감각적으로 파악한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RECOVERY_NEED",
        "direction": 1,
        "facetRef": "sar:facet:RECOVERY_NEED:return-agreement",
        "definition": "회복 뒤 다시 응답할 시점을 합의",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "분위기를 읽는 참여와 쉬는 요청의 조율",
    "jointReason": "화개의 사적 몰입 후보와 사회 적응 trait는 상호작용의 노력과 휴식의 조건",
    "positive": "모임에서 맡을 역할과 이후 응답 가능 시간을 알림",
    "risk": "잘 맞춘다는 기대 때문에 쉴 틈을 요청하지 못함",
    "goodIntentionMistake": "분위기를 지키려 항상 갈등 중재자가 됨",
    "twist": "한 번 쉬겠다고 알리는 일이 관계의 기대를 더 현실적으로 만듦",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 모임 정리 역할을 나누고 먼저 귀가하는 장면"
    },
    "behaviorQuestion": "맡을 참여와 쉬는 범위를 미리 합의",
    "conditions": [
      "실제 모임 역할·부하·휴식 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "다른 사람과 조용히 있는 것이 회복일 수 있음",
    "exclusions": [
      "사회 적응이 좋으므로 숨은 피로 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ENFP의 교류 즐거움과 적응 노동은 다름",
    "applicabilityRef": "fkr:app:legacy:esfj-alone",
    "legacyTagReview": {
      "originalMyeongliTag": "solitude",
      "originalMbtiTag": "sociability",
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
    "id": "fkr:legacy:istp-study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istp-study",
    "existingRuleSha256": "8357e557402386ee43df54a29bd2fc6958775ef907f024ecad32753eaa379710",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "설명을 오래 듣는 것보다 한번 직접 만져보는 게 빠릅니다. 어디가 안 되는지 손으로 확인할 때 생각도 또렷해집니다.",
    "originalDomains": [
      "study",
      "strengths",
      "work"
    ],
    "contexts": [],
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
          "type": "ISTP",
          "area": "study",
          "traitId": "hands_on_learning",
          "file": "docs/product/mbti/source/ISTP.json",
          "pointer": "/traits/study/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
          "sha256": "e0447b375086c01b1bf46ec0e5539289e4495aa5e4c7929fd2aba12657060697",
          "plainKoSha256": "ed5c7ae76780fdc9eaaf6ccdb480309117e8aaabdf7b2bfab21e5155bd365160"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "이론 설명을 오래 듣는 것보다 직접 해보는 학습에 강하다. 실험, 제작, 장비, 게임, 스포츠처럼 몸과 감각이 들어가야 몰입된다.",
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
        "axis": "LEARNING",
        "direction": 1,
        "facetRef": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "직접 시험한 결과를 다른 과제에도 설명",
    "jointReason": "식신 산출 해석과 실습 학습 trait가 시험→피드백→전이에서 만남",
    "positive": "작은 실습으로 작동 조건을 확인",
    "risk": "한번 성공한 조작을 개념 이해로 착각",
    "goodIntentionMistake": "빨리 알려주려 안전 설명을 건너뜀",
    "twist": "실패한 시험의 조건을 적으면 다음 실습이 짧아질 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 장비 실습의 성공·실패 설정을 나눠 기록하는 장면"
    },
    "behaviorQuestion": "시험 조건·결과·다음 적용을 정리",
    "conditions": [
      "실제 도구·안전·학습 과제·선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "실습보다 사전 이론이 먼저 필요한 위험 과제도 있음",
    "exclusions": [
      "ISTP이므로 이론 학습 불능 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INFP의 이야기 재구성과 실제 조작 피드백은 다름",
    "applicabilityRef": "fkr:app:legacy:istp-study",
    "legacyTagReview": {
      "originalMyeongliTag": "practical-learning",
      "originalMbtiTag": "practical-learning",
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
    "id": "fkr:legacy:istp-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istp-love",
    "existingRuleSha256": "78d14e1baa73122b1a7372565b17be926f3c74fd2218d410648bf1b8cc558811",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "가까워졌다고 모든 시간을 보고하고 싶지는 않습니다. 간섭이 줄어들면 오히려 먼저 다가갈 마음이 생기는 편입니다.",
    "originalDomains": [
      "love",
      "relationships"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "ten_god_bijian",
        "sinsal_yangin"
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
        },
        {
          "id": "foundation:shinsal_gwiin:yangin",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:yangin:185b6bfd05f46fdb401e75ba619d195179cbb69a20a6c410e9e61be5d2f96ad4",
          "recordSha256": "185b6bfd05f46fdb401e75ba619d195179cbb69a20a6c410e9e61be5d2f96ad4",
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
      "meaning": "자기 기준이 분명합니다. / 결정할 때 자기 선을 분명하게 지킵니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISTP",
          "area": "love",
          "traitId": "freedom_love_boundary",
          "file": "docs/product/mbti/source/ISTP.json",
          "pointer": "/traits/love/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
          "sha256": "0d7c4e17ce8e31aa432757a8784a892f852c30422cd96a2472202c012dda8a96",
          "plainKoSha256": "a8e7109a34d1aad89bc233fd0df96a16beb27737232147d73c32124a0e350fc7"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "연애에서도 혼자 있는 시간과 삶의 자율성을 중요하게 본다. 상대가 통제하려 들면 감정적으로 설득하기보다 거리를 둔다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "AUTONOMY",
        "direction": 1,
        "facetRef": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "BOUNDARY",
        "direction": 1,
        "facetRef": "sar:facet:BOUNDARY:privacy",
        "definition": "정보·시간의 사적 범위를 정함",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "개인 선택과 공동 약속의 경계",
    "jointReason": "비견·양인의 자율 후보와 통제 거부 trait를 실제 선택권·동의 범위에서 비교",
    "positive": "개인 시간과 관계 약속을 동시에 명확히 함",
    "risk": "공동 책임까지 간섭으로 보고 일방적으로 철회",
    "goodIntentionMistake": "갈등을 줄이려 설명 없이 거리를 둠",
    "twist": "협의해서 선택한 공동 약속도 자율성에 포함",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 개인 일정과 함께 정할 일정을 다른 칸에 적는 장면"
    },
    "behaviorQuestion": "사생활·공동 영향·약속을 나눔",
    "conditions": [
      "실제 관계·공동 책임·거절의 안전 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "자율성을 중시해도 자주 함께 있을 수 있음",
    "exclusions": [
      "비견·양인·ISTP로 애정 능력 부족 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INTP의 몰입 지원보다 통제·사생활 경계",
    "applicabilityRef": "fkr:app:legacy:istp-love",
    "legacyTagReview": {
      "originalMyeongliTag": "autonomy",
      "originalMbtiTag": "autonomy",
      "relatedTags": [
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
    "id": "fkr:legacy:istp-marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "istp-marriage",
    "existingRuleSha256": "6331b7134466ae593ebd17309ef98c2017e44c2e8bdf76cf9e31707332ad33c0",
    "legacyKind": "overlap",
    "researchRelation": "conditional_correspondence",
    "originalMeaning": "한집에 있어도 각자 좋아하는 일에 빠질 시간이 있으면 편합니다. 옆에서 말없이 자기 일을 해도 사이가 멀어진 건 아닙니다.",
    "originalDomains": [
      "marriage"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "twelve_sinsal_hwagae"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hwagae",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hwagae:401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
          "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
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
      "meaning": "혼자 몰입하며 자기 세계를 깊게 만드는 힘이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISTP",
          "area": "marriage",
          "traitId": "space_based_marriage",
          "file": "docs/product/mbti/source/ISTP.json",
          "pointer": "/traits/marriage/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
          "sha256": "9c87a39b77f3a980c984cccbcdc66a691a808b41e0b7326d3d2e0893a3a6729f",
          "plainKoSha256": "85a45872c9105751f918f46094e7edde43b64c904b7495d0b647f2bf7844d224"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "결혼이나 장기 관계에서도 각자의 시간과 공간이 필요하다. 너무 많은 확인, 간섭, 통제는 관계의 피로를 빠르게 키운다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
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
    "coreMeaning": "같은 공간에서 각자 몰입할 권리와 의무",
    "jointReason": "화개 몰입 후보와 장기 공간 trait를 실제 동거·돌봄 조건에 연결",
    "positive": "개인 몰입을 보장하되 공동 업무를 인계",
    "risk": "각자 시간이 공동 생활 노동의 회피가 됨",
    "goodIntentionMistake": "편하게 두려 필요한 요구까지 말하지 않음",
    "twist": "같이 조용히 있어도 충분한 공동 시간이 될 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 같은 방에서 각자 작업하되 가사 차례를 정하는 장면"
    },
    "behaviorQuestion": "사적 여백과 공동 노동을 함께 합의",
    "conditions": [
      "혼인·동거·분담·실제 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "공간이 있어도 일정한 함께 시간이 필요할 수 있음",
    "exclusions": [
      "화개로 결혼 불화나 무관심 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INFJ의 표현 어려움보다 간섭·공동 책임의 경계",
    "applicabilityRef": "fkr:app:legacy:istp-marriage",
    "legacyTagReview": {
      "originalMyeongliTag": "solitude",
      "originalMbtiTag": "solitude",
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
    "id": "fkr:legacy:isfp-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "isfp-love",
    "existingRuleSha256": "571a0b4798fa9bb05674f44a5179bf0a41b63e520a7b1ac835e11a9d969be728",
    "legacyKind": "contrast",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "처음에는 마음을 많이 말하지 않습니다. 그런데 가까워지면 상대의 취향을 기억한 작은 챙김에서 매력이 더 또렷해집니다.",
    "originalDomains": [
      "love",
      "relationships"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hongyeom"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hongyeom",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hongyeom:dc1aea5623b68e37576e8634fafa3908869cb2c6e31a92e8aebe16e383d8c822",
          "recordSha256": "dc1aea5623b68e37576e8634fafa3908869cb2c6e31a92e8aebe16e383d8c822",
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
      "meaning": "가까워질수록 매력이 살아납니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISFP",
          "area": "love",
          "traitId": "slow_open_romantic",
          "file": "docs/product/mbti/source/ISFP.json",
          "pointer": "/traits/love/0",
          "sourceCoverage": "direct",
          "sourceVersion": "c29503d26796af4c3dbc8c9298f4bf8d0636570e63c0494169bcf95d722d38d8",
          "sha256": "d554fd46f3f0bf957c55df99dac6e23c7d428afdab7d49043f550be66c8b6baa",
          "plainKoSha256": "5472e24d811bfa3b9385abd4c2d577af19f3dbea3e3bdec6a5b06e98bb674c9e"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "마음을 여는 데 시간이 걸리지만 사랑에 빠지면 연인에게 충실하고 로맨틱해진다. 연애에 올인하는 성향이 있어 관계가 삶의 큰 중심이 된다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "RELATION_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "공개 표현과 가까워지는 속도의 차이",
    "jointReason": "홍염의 친밀 매력 상징과 느린 공개 trait를 시점이 다른 조건으로 검토",
    "positive": "마음 표현의 범위와 실제 관계 단계를 설명",
    "risk": "친밀한 행동을 상대에게 같은 속도로 요구",
    "goodIntentionMistake": "충실함을 보여주려 자신의 시간을 모두 내줌",
    "twist": "천천히 열어도 선명하게 거절·동의를 말할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 좋아하는 활동을 제안하되 공개 여부는 묻는 장면"
    },
    "behaviorQuestion": "친밀 행동·공개·관계 약속 각각 확인",
    "conditions": [
      "실제 관계 단계·동의·개인 여력 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "가까워져도 공개 표현을 원하지 않을 수 있음",
    "exclusions": [
      "홍염·ISFP로 사랑에 올인·충실함 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INTJ의 장기 선택 기준보다 표현 공개와 접촉 범위",
    "applicabilityRef": "fkr:app:legacy:isfp-love",
    "legacyTagReview": {
      "originalMyeongliTag": "intimate-attraction",
      "originalMbtiTag": "reserved-affection",
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
    "id": "fkr:legacy:isfp-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "isfp-needle",
    "existingRuleSha256": "6f499c21117855fdd45906a6696e006927a83634a2b8bb00d1de8901225ab292",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "괜찮다는 말보다 표정의 작은 변화가 먼저 보입니다. 겉으로 크게 말하지 않아도 그냥 지나치지 않는 감각이 있습니다.",
    "originalDomains": [
      "identity",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ISFP",
          "area": "thinkingStyle",
          "traitId": "sensory_truth_detector",
          "file": "docs/product/mbti/source/ISFP.json",
          "pointer": "/traits/thinkingStyle/1",
          "sourceCoverage": "direct",
          "sourceVersion": "c29503d26796af4c3dbc8c9298f4bf8d0636570e63c0494169bcf95d722d38d8",
          "sha256": "571de81aac5352f2bf331f6fb87ce131f94cffd56c037250363329aef29ceb93",
          "plainKoSha256": "9b6f388f24143d0a6fe95d75c6eca9931955bfcce9a30eb3ce5cd631cafa9cb5"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "상대의 표정, 말투, 떨림, 미세한 긴장처럼 비언어 신호에 민감하다. 말과 행동이 다르면 몸으로 먼저 알아차리고, 가식과 위선을 강하게 싫어한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "definition": "말·표정·참여의 변화를 관찰",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRECISION",
        "direction": 1,
        "facetRef": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "미세한 신호 관찰과 의도 확인을 구별",
    "jointReason": "현침의 자형 상징이 표정 해독 능력 근거는 아니며 실제 trait도 마음을 증명하지 않음",
    "positive": "말과 표정의 차이를 보고 필요한 확인 질문을 함",
    "risk": "표정의 긴장을 거짓이나 불성실로 단정",
    "goodIntentionMistake": "불편을 덜어주려 상대가 원치 않는 설명을 대신함",
    "twist": "안 읽힌다고 인정하면 오해를 줄일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 손이 멈춘 이유가 피로인지 어려움인지 묻는 장면"
    },
    "behaviorQuestion": "본 신호와 추정한 뜻을 분리",
    "conditions": [
      "실제 관찰·추가 설명·대안 원인 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "긴장한 표정이어도 거짓말은 아닐 수 있음",
    "exclusions": [
      "유형·현침으로 진심 탐지 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "INFP의 서사 불일치·ESTP의 현장 데이터와 구별",
    "applicabilityRef": "fkr:app:legacy:isfp-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
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
    "id": "fkr:legacy:estp-needle",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "estp-needle",
    "existingRuleSha256": "7b1363d6080992a108c6d8407616a7d527466ed43b8cfe86ff25004fb032722b",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "상대가 괜찮다고 해도 손이 멈춘 지점은 놓치지 않습니다. 긴 설명보다 지금 보이는 반응에 맞춰 바꾸는 쪽입니다.",
    "originalDomains": [
      "work",
      "strengths"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_hyeonchim"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:hyeonchim",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:hyeonchim:4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
          "recordSha256": "4f0df2ce604a6fcf28cf05fe29a6a2ac18a977d51fae3c9b4db7a7f403bd20dc",
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
      "meaning": "남이 놓친 작은 오류와 말의 차이가 잘 보입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESTP",
          "area": "thinkingStyle",
          "traitId": "se_now_data",
          "file": "docs/product/mbti/source/ESTP.json",
          "pointer": "/traits/thinkingStyle/0",
          "sourceCoverage": "direct",
          "sourceVersion": "cbad165b46fa8b9af38e16c47a76a1113255ac3041ccdd765cc2a035834807ec",
          "sha256": "7b714a4789afdae5915c4e27fae3baf7e7684c091792eb841f8fadd3b1cd9526",
          "plainKoSha256": "ed73b917431b4226d522423661e98ad01864eb3f964eb22fa47c99c9362de3c5"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "주기능 Se는 ESTP가 눈앞의 장면, 표정, 움직임, 냄새, 소리, 촉감 같은 현재 데이터를 빠르게 받아들이게 만든다. 그래서 분위기와 맥락을 몸으로 먼저 읽는다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "direction": 1,
        "facetRef": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "definition": "말·표정·참여의 변화를 관찰",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "PRACTICALITY",
        "direction": 1,
        "facetRef": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "현재 반응을 작은 조정의 피드백으로 사용",
    "jointReason": "현침으로 감각 우월을 승인하지 않고 현재 데이터 trait를 실제 시험 조건과 비교",
    "positive": "멈춘 동작을 관찰하고 사용 방법을 작은 범위에서 수정",
    "risk": "눈앞 반응만 보고 장기 원인·의도를 확정",
    "goodIntentionMistake": "빨리 편하게 해주려 설명 없이 조작을 대신함",
    "twist": "잠깐 질문한 뒤 시험하면 더 빠른 수정이 가능",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 시연 중 사용자가 멈춘 단계만 다시 확인하는 장면"
    },
    "behaviorQuestion": "관찰·질문·시험·결과를 나누기",
    "conditions": [
      "독립 현장 관찰·동의·안전한 조정 범위 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "보이는 반응에 중요한 원인이 드러나지 않을 수 있음",
    "exclusions": [
      "Se·현침으로 판단 정확성·감각 능력 확정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ISTJ의 데이터 검수보다 현장 반응의 즉시 시험",
    "applicabilityRef": "fkr:app:legacy:estp-needle",
    "legacyTagReview": {
      "originalMyeongliTag": "precision",
      "originalMbtiTag": "precision",
      "relatedTags": [
        {
          "tag": "wealth",
          "researchRef": "sar:tag:wealth",
          "relation": "NOT_EQUIVALENT",
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
    "id": "fkr:legacy:estp-study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "estp-study",
    "existingRuleSha256": "0f76fe662d09b104461d90362e5ff96131a5debe94f8066576791a4c277f4e79",
    "legacyKind": "contrast",
    "researchRelation": "contextual_difference",
    "originalMeaning": "알아야 안심되는 마음과 일단 해보고 싶은 마음이 같이 있습니다. 직접 부딪힌 뒤 다시 읽으면 처음엔 지루하던 설명도 달라 보입니다.",
    "originalDomains": [
      "study"
    ],
    "contexts": [],
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
          "area": "study",
          "traitId": "experiential_learning",
          "file": "docs/product/mbti/source/ESTP.json",
          "pointer": "/traits/study/0",
          "sourceCoverage": "direct",
          "sourceVersion": "cbad165b46fa8b9af38e16c47a76a1113255ac3041ccdd765cc2a035834807ec",
          "sha256": "d74635abd854a1f57c2957d408fe15960e1f805ff3206e56ea49c8efa41216ed",
          "plainKoSha256": "0c96181db11af35f6079e19c032e0b84a663c39ab1040b179a6824a34a06cc40"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "ESTP는 사전 이론 공부보다 직접 뛰어들어 체험으로 배우는 편이 잘 맞는다. 실습, 실전, 사례, 게임화된 학습에서 이해 속도가 빨라진다.",
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
        "axis": "RISK_STYLE",
        "direction": 1,
        "facetRef": "sar:facet:RISK_STYLE:reversible-probe",
        "definition": "되돌릴 수 있는 시험을 선택",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "설명과 체험의 순서를 과제에 맞춰 선택",
    "jointReason": "정인의 준비 해석과 체험 선호는 학습 전후 순서의 차이일 수 있음",
    "positive": "안전 설명 뒤 작은 체험으로 필요한 질문을 찾음",
    "risk": "모든 사전 학습을 지루한 것으로 배제",
    "goodIntentionMistake": "몰입을 돕기 위해 위험한 과제를 바로 실행",
    "twist": "체험 후 읽는 설명도 학습의 중요한 절반일 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 안전한 모형을 먼저 조작한 뒤 원리를 다시 읽는 장면"
    },
    "behaviorQuestion": "필수 사전 조건과 시험 뒤 읽을 설명을 구별",
    "conditions": [
      "과제 위험·기초 지식·실제 선호 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "비가역 위험 과제는 충분한 사전 교육이 먼저임",
    "exclusions": [
      "ESTP로 사전 공부 불능·정인과 필연 충돌 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ISTP의 결과 전이보다 체험과 설명의 순서 긴장",
    "applicabilityRef": "fkr:app:legacy:estp-study",
    "legacyTagReview": {
      "originalMyeongliTag": "learning",
      "originalMbtiTag": "practical-learning",
      "relatedTags": [
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
    "id": "fkr:legacy:esfp-charm",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "esfp-charm",
    "existingRuleSha256": "9a0bb91e73c95a40830f86e30274468b8222fbfb1464753fbd9c92ee289ba540",
    "legacyKind": "overlap",
    "researchRelation": "non_equivalent_requires_review",
    "originalMeaning": "사람들이 반응해주면 표정부터 살아납니다. 가만히 준비할 때보다 직접 보여주는 자리에서 매력이 더 잘 보이는 편입니다.",
    "originalDomains": [
      "identity",
      "strengths",
      "success/fortune"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "sinsal_dohwa"
      ],
      "researchRefs": [
        {
          "id": "foundation:shinsal_gwiin:dohwa",
          "auditRef": "source-ref-catalog.json#foundation:shinsal_gwiin:dohwa:debf8f8fa431fed9978dc8fe01062dc0db3454c93d48fc519c1896c7cdc5049a",
          "recordSha256": "debf8f8fa431fed9978dc8fe01062dc0db3454c93d48fc519c1896c7cdc5049a",
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
      "meaning": "첫인상에서 눈에 들어오는 매력이 있습니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFP",
          "area": "identity",
          "traitId": "spotlight_identity",
          "file": "docs/product/mbti/source/ESFP.json",
          "pointer": "/traits/identity/5",
          "sourceCoverage": "direct",
          "sourceVersion": "b22468fccc71563e5d256aa160d778fa3c61f582e1ead73caea369402a0f1248",
          "sha256": "0cf17a07ef58030fde017c017741eb3a1836d2d3de2ef4020d20f1257b3b26be",
          "plainKoSha256": "bb068dde71bb281299a51fe0635248220ef89223aefc4b2e8ab4bdc572e9213f"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "무대의 중심에 서는 것과 사람들의 관심을 즐긴다. 장기자랑, 축제, 모임, 대중 앞의 표현에서 자기 에너지를 확인한다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "CHARISMA",
        "direction": 1,
        "facetRef": "sar:facet:CHARISMA:situated-attention",
        "definition": "특정 장면에서 타인이 주목한 현상",
        "role": "myeongli_related_meaning_not_calculated_axis_binding"
      },
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "role": "mbti_related_meaning_not_new_annotation"
      }
    ],
    "orientationPolicy": "fixed_source_roles",
    "coreMeaning": "주목을 즐기는 조건과 공개할 범위",
    "jointReason": "도화의 노출 상징은 실제 호감이 아니며 무대 선호와 같은 과제인지 확인",
    "positive": "자발적으로 선택한 자리에서 표현을 시도",
    "risk": "관심을 유지하려 원치 않는 공개까지 감수",
    "goodIntentionMistake": "분위기를 살리려 다른 사람 이야기를 대신 공개",
    "twist": "작은 청중을 고르는 것이 표현을 더 편하게 할 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 발표 참여는 고르되 개인 이야기 공개는 제한하는 장면"
    },
    "behaviorQuestion": "주목·표현·동의를 별도 확인",
    "conditions": [
      "실제 참여 의사·청자·공개 동의 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "무대를 즐겨도 낯선 모임은 피할 수 있음",
    "exclusions": [
      "도화·ESFP로 모든 사람에게 인기 보장",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "charisma 일반 보완과 달리 원천의 무대 조건 명시",
    "applicabilityRef": "fkr:app:legacy:esfp-charm",
    "legacyTagReview": {
      "originalMyeongliTag": "first-attraction",
      "originalMbtiTag": "first-attraction",
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
    "id": "fkr:legacy:esfp-expression",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:legacy-fusion",
      "repo:material-registry",
      "authored:fusion-research"
    ],
    "sourceFactPolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
    "missingEvidencePolicy": "withhold_no_fallback_fact",
    "scopeRef": "fkr:scope:individual",
    "origin": "legacy_rule",
    "existingRuleId": "esfp-expression",
    "existingRuleSha256": "3ded739d0bdb2dedbe5b5c0a0c7d6ca82d95f96cb4a654383e28df4a67ac5305",
    "legacyKind": "complement",
    "researchRelation": "task_complement",
    "originalMeaning": "정리된 말이 있어야만 이야기를 시작하는 건 아닙니다. 먼저 웃고 내 이야기를 나누다 보면 마음이 밖으로 나오는 길이 생깁니다.",
    "originalDomains": [
      "relationships",
      "identity"
    ],
    "contexts": [],
    "myeongli": {
      "features": [
        "distribution:output-low"
      ],
      "researchRefs": [
        {
          "id": "csr:profile:no_output",
          "auditRef": "source-ref-catalog.json#csr:profile:no_output:bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "recordSha256": "bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
          "relation": "related_not_equivalent",
          "originalStatus": {
            "verification": null,
            "review": null,
            "class": null,
            "traditionalClass": null,
            "connectedToRuntime": false,
            "approvedForCustomer": null
          }
        }
      ],
      "meaning": "표현의 통로를 다른 행동 습관과 함께 살펴볼 자리입니다.",
      "applicationStatus": "actual_evidence_still_required",
      "meaningStatus": "existing_authored_definition_not_individual_fact"
    },
    "mbti": {
      "traitRefs": [
        {
          "type": "ESFP",
          "area": "communication",
          "traitId": "honest_self_disclosure",
          "file": "docs/product/mbti/source/ESFP.json",
          "pointer": "/traits/communication/0",
          "sourceCoverage": "direct",
          "sourceVersion": "b22468fccc71563e5d256aa160d778fa3c61f582e1ead73caea369402a0f1248",
          "sha256": "88e603e0b43570f9790e874e20ef59c138648ff3ee68bee2146c9657dedd5b24",
          "plainKoSha256": "5409ea6f8c4e4a24b657675a5243577873701e6a7d85cee52f8fa3fdba060e88"
        }
      ],
      "requiredSourceAxes": [],
      "meaning": "자신의 이야기를 누구에게나 솔직하게 털어놓는 편이다. 친밀감을 만들 때 숨기는 것보다 먼저 말하고 웃고 나누는 방식을 쓴다.",
      "sourceStatus": "existing_local_source_not_empirical"
    },
    "facets": [
      {
        "axis": "EXPRESSION",
        "direction": 1,
        "facetRef": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
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
    "coreMeaning": "자기 이야기 공유와 상호 참여의 경계",
    "jointReason": "식상 저신호와 솔직한 자기 공개 trait를 친밀함의 통로로 비교",
    "positive": "공개할 범위를 고르고 상대의 차례를 남김",
    "risk": "많이 공개하면 상대도 같은 만큼 말해야 한다고 기대",
    "goodIntentionMistake": "친해지려 비밀까지 먼저 털어놓음",
    "twist": "말하지 않을 이야기를 남겨도 친밀함을 만들 수 있음",
    "fictionalScene": {
      "kind": "fictional_not_customer_history",
      "text": "가상으로 자기 경험을 나눈 뒤 상대가 답하지 않을 자유를 알리는 장면"
    },
    "behaviorQuestion": "공개 범위·청자의 참여·기록 동의를 확인",
    "conditions": [
      "실제 표현 통로·사생활·저신호 범위 확인",
      "동일한 개인의 실제 명리 Evidence와 원천 MBTI trait를 따로 확인한다.",
      "출처 direct/inferred는 실증 타당성이나 해당 개인의 일치가 아니다."
    ],
    "counterexample": "자기 공개보다 공동 활동이 편할 수 있음",
    "exclusions": [
      "저신호를 고친 성격·친밀감 보장이라고 단정",
      "관련 facet 참조만으로 실제 계산·행동 근거를 생성하지 않는다."
    ],
    "distinction": "ENFP의 감정 반응과 ESFP의 자기 이야기 공개는 다름",
    "applicabilityRef": "fkr:app:legacy:esfp-expression",
    "legacyTagReview": {
      "originalMyeongliTag": "expression-gap",
      "originalMbtiTag": "expression",
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
  }
];
