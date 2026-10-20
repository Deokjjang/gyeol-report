import type { MbtiPairResearch } from "./mbtiPairResearchTypes";

export const MBTI_PAIR_RESEARCH_ISFJ = [
  {
    "id": "mpr:ISFJ:INTJ",
    "sourceType": "ISFJ",
    "targetType": "INTJ",
    "jointReviewId": "mpj:INTJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "7c3471fd8bb1e16068489e80b03a47f8585ecf01f4b56d2e08a667625827abed",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "08c7651aa71adf50b82fff5db721ca950b4f05aab01c639815a0d66e2128a839",
      "label": "장단점 역전 관계",
      "sourceRelationName": "Opposite Strengths",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "INTJ",
        "domain": "thinkingStyle",
        "traitId": "system_first_thinking",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "7fbbc908f57f42701222f1021bc8736ed0b4be9dcad1909c0d891cc88e2b5cbf"
      },
      {
        "type": "INTJ",
        "domain": "thinkingStyle",
        "traitId": "evidence_based_vision",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "03e4174903caada3bc9807ecd158b46ea5d0aa30c2633b24468345f5cf1547f7"
      },
      {
        "type": "INTJ",
        "domain": "communication",
        "traitId": "blunt_fact_delivery",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "de0d58fbdb68bc4a9cf09c634eb49adf09f4e3ebec3fe6b0105e5c6bb25ffc68"
      },
      {
        "type": "INTJ",
        "domain": "communication",
        "traitId": "sarcastic_humor",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2e9be37803751d5684a0498d9463024d80f5b5840ba694acca47d824dd3b6830"
      },
      {
        "type": "INTJ",
        "domain": "workplace",
        "traitId": "anti_politics_work_style",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2cd4a099223cd20b305ce9054b48bdfb6b498f80b12c21d7984bbad52054a38d"
      },
      {
        "type": "INTJ",
        "domain": "workplace",
        "traitId": "boss_challenge_risk",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "385df267e89d781ddc83f6704b83f3abfde843f462730a2061b8d764a672ec80"
      },
      {
        "type": "INTJ",
        "domain": "relationships",
        "traitId": "selective_friendship",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "5e5de3fe3528494dbc2767a0629148bd8782bda4a4dfb80661cc42342740138a"
      },
      {
        "type": "INTJ",
        "domain": "relationships",
        "traitId": "deep_idea_bond",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "4984e4fccb37946c367134b57e0a4e9d56875f32518a05eb566107d87638edb9"
      },
      {
        "type": "INTJ",
        "domain": "love",
        "traitId": "slow_high_standard_love",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "0b9cfffe4bbb1b70d2e853bddec5a469cd194f10e753064e06aa13e228722df0"
      },
      {
        "type": "INTJ",
        "domain": "love",
        "traitId": "strategic_romance_awkwardness",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "90026a393f8a22d8af4164b5e13f3bc52aa55449177e446ff9a0d1a1e911eb22"
      },
      {
        "type": "INTJ",
        "domain": "marriage",
        "traitId": "future_planned_marriage",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "dac6f0b12971fd4111dc12014f107e624374b4c41fc1f8f9077c8ae4f56c949b"
      },
      {
        "type": "INTJ",
        "domain": "marriage",
        "traitId": "autonomy_in_marriage",
        "file": "docs/product/mbti/source/INTJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "358f42349b40aa31061d30acafcec5530d079f8dedf0fcba902b006c3cc9b5c6"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "소수의 신뢰하는 관계와 지속 가능한 생활을 중시하는 접점이 있다. 챙김의 방식에 대한 동의가 신뢰를 지킨다.",
    "difference": "독립적 방향 설계와 익숙한 세부 돌봄이 도움의 의미를 달리할 수 있음",
    "directionalContribution": "설계가 놓친 작은 생활 필요와 지난 합의를 상기",
    "targetContribution": "반복 부담을 줄일 구조를 함께 찾아봄",
    "friction": {
      "condition": "요청하지 않은 돌봄을 계속하거나 개선안으로 돌봄을 평가할 때",
      "sourceIntentionCandidate": "기억한 필요를 챙기려는 확인",
      "targetMayMisreadSource": "개인 선택을 관리하는 간섭으로 읽힐 가능성",
      "targetIntentionCandidate": "불필요한 절차를 줄이려는 조정",
      "sourceMayMisreadTarget": "수고와 애정을 무시하는 비판으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "도움이 필요한지 먼저 물었는가?",
      "targetQuestion": "상대의 수고를 인정한 뒤 바꿀 점을 말했는가?",
      "jointAgreement": "도움받을 항목과 각자 맡을 항목을 따로 표시",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "조용한 돌봄도 거절할 수 있고 독립성도 무관심과 다름",
    "fictionalScenes": [
      {
        "id": "mpj:INTJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "식사 준비에서 필요한 도움과 혼자 할 일을 나누는 장면"
      },
      {
        "id": "mpj:INTJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "기념일 계획의 규모보다 실제로 원하는 표현을 묻는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "실제 돌봄 관계·생활 공유가 없으면 가족 역할을 추정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "superego",
      "system": "socionics_term_family",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:INTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:INTP",
    "sourceType": "ISFJ",
    "targetType": "INTP",
    "jointReviewId": "mpj:INTP:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "b32045d0fedbf990073d4cc106edb0e5f0c43d24cc58b9cf2e9738794914ac2b",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "8a0d4e9bbbed765af00787eb2c9365184a556f81a594d38151b5a8021986f5e5",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "INTP",
        "domain": "thinkingStyle",
        "traitId": "ti_internal_model",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "ecaaf5978080fd93a4bda1fefbb5f126099d00fde9192e330604671a60792e7f"
      },
      {
        "type": "INTP",
        "domain": "thinkingStyle",
        "traitId": "ne_possibility_storm",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9c2c08d51b2d3391c93a8fcf2dfb62629f31b89e631b1e2faf789888c6e94664"
      },
      {
        "type": "INTP",
        "domain": "communication",
        "traitId": "direct_everyday_speech",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "36b08e13d5cabc4d9845ccd0034921c67843665f15f1c14290bf005bfea97a0e"
      },
      {
        "type": "INTP",
        "domain": "communication",
        "traitId": "learned_social_reactions",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b45c17fe3d55e0f680f5b84d622315fc46e3dded5c68c684280949890aa1a74d"
      },
      {
        "type": "INTP",
        "domain": "workplace",
        "traitId": "needs_thinking_time",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "0744f9e46934b3bbe67347f67d651f543e9c3fff29270f033ae5b79e6da8aef8"
      },
      {
        "type": "INTP",
        "domain": "workplace",
        "traitId": "anti_bureaucracy_work",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "43199257fe7f7ea5a67938b1fed708729433cdc207ab7a09347431ff7c6bd8cd"
      },
      {
        "type": "INTP",
        "domain": "relationships",
        "traitId": "low_need_for_human_ties",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f629f48fa5791411b7252b5b584b26277126eff16094a875bf68f0db916b3046"
      },
      {
        "type": "INTP",
        "domain": "relationships",
        "traitId": "respect_for_listening_mind",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "16db1fe88d711b1379e8459a2afcc36768111a861c2ba1c408b44fa0d8cccd6d"
      },
      {
        "type": "INTP",
        "domain": "love",
        "traitId": "careful_narrow_love",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f29a444a19ae84609d23fe8291c2cc05ca0b1f2ef5e552aabec4f85d18b78e95"
      },
      {
        "type": "INTP",
        "domain": "love",
        "traitId": "witty_intellectual_attraction",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a0e070449d65ebb08f7dda163971485e8010ffb991a567b8b843d4ffb5a25ec1"
      },
      {
        "type": "INTP",
        "domain": "marriage",
        "traitId": "marriage_with_space",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "7a2eead72df2616d3f8a2503c2a98bfdf4cc52c857a52d4988e9995cb31f3b33"
      },
      {
        "type": "INTP",
        "domain": "marriage",
        "traitId": "household_support_need",
        "file": "docs/product/mbti/source/INTP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "718f751dbed3bfe42f4ee2f6bf791c5454a4accdc9c9bbdc3e4350bb018659cb"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "큰 반응을 요구하지 않는 친숙한 관계에서 편안함을 찾을 수 있다. 돌봄과 개인 시간에 대한 동의는 따로 확인한다.",
    "difference": "논리 탐구의 여백과 세부 생활 기준의 안정이 다른 필요일 수 있음",
    "directionalContribution": "공동 일정과 작은 필요의 누락을 확인",
    "targetContribution": "익숙한 부담을 줄일 다른 해결 경로 제시",
    "friction": {
      "condition": "돌봄을 당연히 받거나 확인을 모두 간섭으로 볼 때",
      "sourceIntentionCandidate": "필요를 기억하고 확인하는 도움",
      "targetMayMisreadSource": "독립성을 인정하지 않는 통제로 읽힐 가능성",
      "targetIntentionCandidate": "혼자 해결할 공간을 확보하려는 유보",
      "sourceMayMisreadTarget": "챙김을 거절하는 냉정함으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대가 직접 맡고 싶은 일을 물었는가?",
      "targetQuestion": "도움의 수고와 거절할 부분을 함께 말했는가?",
      "jointAgreement": "돌봄 항목을 요청제로 바꾸고 공동 책임은 각자 맡음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "함께 편한 여가와 함께 사는 책임은 다른 합의가 필요",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "외출 준비를 도와줄 항목과 혼자 챙길 항목을 고르는 장면"
      },
      {
        "id": "mpj:INTP:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공유 공간 정리의 기준과 담당을 직접 나누는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "한쪽이 생활을 전담해야 한다는 역할 결론 금지",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "activation",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:INTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ENTJ",
    "sourceType": "ISFJ",
    "targetType": "ENTJ",
    "jointReviewId": "mpj:ENTJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "9b50d1ad0ca37f4700d5545db6e257e3e9789c102861f6ebba60a6aec71af46c",
      "label": "갈등 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "9fe81666223c3778f7a153813d346b7c647409936175b63624848f39ec767e6f",
      "label": "갈등 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ENTJ",
        "domain": "thinkingStyle",
        "traitId": "te_ni_strategy",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "33aa6cad52d860affad5c8489cc5ad41b753aace827d395e9a8fc9105d172e9a"
      },
      {
        "type": "ENTJ",
        "domain": "thinkingStyle",
        "traitId": "criticism_as_growth",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "3517258f96261d5f668e9f536f86bdc59b515eeea4ef644af4cf68ce55872c53"
      },
      {
        "type": "ENTJ",
        "domain": "communication",
        "traitId": "clear_assertive_language",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a0248d69af85d74881be3f9c2f625cd37d19f4b318b68682bd4b96cf6abea050"
      },
      {
        "type": "ENTJ",
        "domain": "communication",
        "traitId": "challenge_communication",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "d3f4faeef8849d855d837dfef1bf8e07cfef05cde733074b15cd8e9ff60bbba9"
      },
      {
        "type": "ENTJ",
        "domain": "workplace",
        "traitId": "direct_feedback_leader",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "7af999ce803069473e2ec5c697c973d575433cac1847558a48170a00b49680e3"
      },
      {
        "type": "ENTJ",
        "domain": "workplace",
        "traitId": "turnaround_reformer",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "fd60ffe9bdddf0f4442a749160fb8b7480b4a1fd202a2b8775f08ef733b10392"
      },
      {
        "type": "ENTJ",
        "domain": "relationships",
        "traitId": "strategic_friend_filter",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "01fcc77ca4ce559b21cf746573befd1641975fecdea321daa4c051d271469f6e"
      },
      {
        "type": "ENTJ",
        "domain": "relationships",
        "traitId": "debate_as_bonding",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "0fb1bf00dbe6db1f36ea90599ab849df3fa442480574ca08925a783eefb5afad"
      },
      {
        "type": "ENTJ",
        "domain": "love",
        "traitId": "planned_intense_romance",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "5a9c3977e1561297a9f5039c26c63bd2a4f7a800fe0814779bf3011d8a941510"
      },
      {
        "type": "ENTJ",
        "domain": "love",
        "traitId": "long_term_filter",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "3bbd7bf1d25d4570138ca8ef6e96e95a223c80de63d8a9dc73ead2ef845ac8b1"
      },
      {
        "type": "ENTJ",
        "domain": "marriage",
        "traitId": "achievement_partner_marriage",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "49518905f307060c5ab2216a972c217b8de4a2bf9316a819ce6f6340313cf086"
      },
      {
        "type": "ENTJ",
        "domain": "marriage",
        "traitId": "dominance_marriage_risk",
        "file": "docs/product/mbti/source/ENTJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "55b73917f839fb0f0b902b00986050a3f4e4e81ba96db4dfc5c0bc977745cf1d"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "맡은 일을 책임지려는 관심이 겹칠 수 있다. 완료를 돕는 말도 상대가 받아들일 형식을 확인한다.",
    "difference": "빠른 개선 피드백과 세심한 기준·완곡한 표현이 다를 수 있음",
    "directionalContribution": "실행 과정에서 놓친 작은 필요와 순서를 발견",
    "targetContribution": "반복 부담의 원인을 찾아 조정",
    "friction": {
      "condition": "공개적인 직설과 말하지 않은 부담이 겹칠 때",
      "sourceIntentionCandidate": "관계를 지키려는 조심스러운 답",
      "targetMayMisreadSource": "문제가 없다는 동의로 읽힐 가능성",
      "targetIntentionCandidate": "실수를 줄이려는 즉각 지적",
      "sourceMayMisreadTarget": "수고 전체를 부정하는 평가로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "어려운 조건을 구체적으로 전했는가?",
      "targetQuestion": "사람과 수정할 작업을 나눠 말했는가?",
      "jointAgreement": "피드백은 동의한 자리에서 한 항목씩 다룸",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "조용한 이견을 먼저 받으면 수정 비용도 줄일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENTJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "준비 작업의 세부 기준을 미리 함께 확인하는 장면"
      },
      {
        "id": "mpj:ENTJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "도움을 요청받은 범위만 바꾸기로 하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "침묵·순응을 동의나 낮은 역량으로 추정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "conflict",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ENTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ENTP",
    "sourceType": "ISFJ",
    "targetType": "ENTP",
    "jointReviewId": "mpj:ENTP:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "65a331d9123350c3b46423f16e8560e601cec4de08b941dc1c29206bd0d33178",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTP.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "e9a4383e38b4eeb1eda3f28e53390f7601113934b649d1f1de647f32ed7d4714",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ENTP",
        "domain": "thinkingStyle",
        "traitId": "possibility_scanning",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "679603cb68926194d9f090465587172a616d7e1d2f72506ef2a1d0ed40dea019"
      },
      {
        "type": "ENTP",
        "domain": "thinkingStyle",
        "traitId": "logical_core_detection",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c7941890b2256ab54623e8791c2d2057dc5021486ca311f6ea3145e994ce4e33"
      },
      {
        "type": "ENTP",
        "domain": "communication",
        "traitId": "direct_speech",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "fbd5a624bd9e5f78abf102b4d48763f125ed92dd7ea3b754ed915d7e7b5aa9c4"
      },
      {
        "type": "ENTP",
        "domain": "communication",
        "traitId": "charming_argument",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c21e460b5a0de6c088525e3ec29842b0ea1df2edef70bd82cea9681834cc28dd"
      },
      {
        "type": "ENTP",
        "domain": "workplace",
        "traitId": "autonomy_required",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "3f3a7056b94a574fd3b2182b4ffb6bd1a73c3c4b8b840f93061bb269f47b0e5d"
      },
      {
        "type": "ENTP",
        "domain": "workplace",
        "traitId": "brainstorming_leader",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "65e50ce5b0b31b4dd242b778c5d6b511ceedc16462a244e8a156ad3ea8f26441"
      },
      {
        "type": "ENTP",
        "domain": "relationships",
        "traitId": "quick_connection",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2440e71e0d5116715b908d08629688637dc40451ba1e3eea24c5c13453d49439"
      },
      {
        "type": "ENTP",
        "domain": "relationships",
        "traitId": "selective_loyalty",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "3f6f017758bafe5ee9e54e8e325016a9be3b41ff5e5ca1445a43ff40fafb7481"
      },
      {
        "type": "ENTP",
        "domain": "love",
        "traitId": "ideal_type_filter",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6e49b535cd5d30be962498ffb519c78640395ddeecfeb1518ea9a3aead42ade3"
      },
      {
        "type": "ENTP",
        "domain": "love",
        "traitId": "fast_start_romance",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e53ce89296e310e8f012af1b4a8f0e78740f6c31b6e003c906e3ba67623f9767"
      },
      {
        "type": "ENTP",
        "domain": "marriage",
        "traitId": "marriage_needs_space",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "6788b02ac7018068c5964933bce94233edf1ef3825b4638d468f725e27d250a9"
      },
      {
        "type": "ENTP",
        "domain": "marriage",
        "traitId": "shared_growth_marriage",
        "file": "docs/product/mbti/source/ENTP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "49a4d315f179197f03adf2268ac6371a625f1e484bbb61efc555552b36bcf188"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "서로 다른 질문이 생활의 빈칸을 드러낼 수 있다. 새 제안과 세부 챙김을 자동 역할로 굳히지 않는다.",
    "difference": "전환이 많은 탐색과 일관된 진행의 안정이 다를 수 있음",
    "directionalContribution": "제안이 실현될 준비 항목 확인",
    "targetContribution": "익숙한 부담을 줄일 대안 제시",
    "friction": {
      "condition": "잦은 변경 뒤 정리를 한쪽에게 맡길 때",
      "sourceIntentionCandidate": "일정을 지키려는 확인",
      "targetMayMisreadSource": "자유를 통제하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "더 나은 가능성을 찾는 수정",
      "sourceMayMisreadTarget": "수고를 무시하는 번복으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "도움의 한계를 전했는가?",
      "targetQuestion": "변경 뒤 맡을 일을 정했는가?",
      "jointAgreement": "변경안에는 담당과 영향도 같이 적음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "꼼꼼한 질문이 실험을 금지하는 것은 아님",
    "fictionalScenes": [
      {
        "id": "mpj:ENTP:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 행사에서 새 아이디어의 준비를 제안자가 맡는 장면"
      },
      {
        "id": "mpj:ENTP:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "개인 시간을 건드리지 않는 안부 방식을 정하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "이상적 궁합·자연스러운 돌봄 분담 승인 금지",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "duality",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ENTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:INFJ",
    "sourceType": "ISFJ",
    "targetType": "INFJ",
    "jointReviewId": "mpj:INFJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "353b066044f5137280ce4a33151f55e9d2a2cfa1bd167312812fcafaa3e7b957",
      "label": "생활 안정과 깊은 의미가 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "0f6bcbe167d41659fa7ab68740cc4a4543be5f4e434039dd2a4fb725036a47ce",
      "label": "흡사 관계",
      "sourceRelationName": "Look-a-like",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "INFJ",
        "domain": "thinkingStyle",
        "traitId": "ni_pattern_prediction",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "ea06cfc35c8a2555b1390ee29a24f2ad9ee4cdbe6073d0de9d334552855c7014"
      },
      {
        "type": "INFJ",
        "domain": "thinkingStyle",
        "traitId": "private_analysis_loop",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "6f3cd6efacc501dc5aebe73fc78d77089398317eb5a48d59d81f0445f7df1def"
      },
      {
        "type": "INFJ",
        "domain": "communication",
        "traitId": "indirect_expression",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "e76bbabae0ef6468208cc5fae3eb326df28f876496591fcb439c5f9d56e9a1e8"
      },
      {
        "type": "INFJ",
        "domain": "communication",
        "traitId": "gentle_language",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "6e9b1e8b17eaf6e294ee0ebeb1cb63ca4f605a30a89f15cd4f1c272320af57c7"
      },
      {
        "type": "INFJ",
        "domain": "workplace",
        "traitId": "horizontal_structure_fit",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "7920656d5923663f214c95918124951f6ad41a598843fa163a57bcb474339669"
      },
      {
        "type": "INFJ",
        "domain": "workplace",
        "traitId": "calm_deep_work",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "eaab4d63e08442fa220b97122228953789da0ecba916c6dadc2b7578a5f8504e"
      },
      {
        "type": "INFJ",
        "domain": "relationships",
        "traitId": "deep_true_connection",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6c3221eabc6fd2beb5514ce735fa8efaaa90fddacf58087b2b22758241d59fa4"
      },
      {
        "type": "INFJ",
        "domain": "relationships",
        "traitId": "door_slam_boundary",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b070ef71b86aa6542547a434e52bf5ae802bd1d89aaf66dbb6e7523f74aa2b16"
      },
      {
        "type": "INFJ",
        "domain": "love",
        "traitId": "careful_start_deep_love",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "ec288950c077a7f02b78c2af28f8bd1187dba9de684b156e2405c686fdd48ccf"
      },
      {
        "type": "INFJ",
        "domain": "love",
        "traitId": "romantic_ideal_love",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9b07e701d371327ec24d0443017b4179d186d7f2e4e1fda63cfa50422bda9992"
      },
      {
        "type": "INFJ",
        "domain": "marriage",
        "traitId": "meaningful_long_bond",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "685232f2b1de304288b617d7a656c0f937cfafe74917cf544b8e10d8e9ae252e"
      },
      {
        "type": "INFJ",
        "domain": "marriage",
        "traitId": "private_time_needed",
        "file": "docs/product/mbti/source/INFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "4e13217a80bfa20d60992d1d50149ff2ebf9af095110ca0362f81ae63436d1ff"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "신중한 관계 시작과 조심스러운 표현이 접점이다. 배려가 닮아도 필요한 도움의 종류는 다를 수 있다.",
    "difference": "미래 의미와 반복 맥락을 보는 렌즈가 과거의 구체 기억과 다를 수 있음",
    "directionalContribution": "큰 방향을 생활 속 준비 항목으로 연결",
    "targetContribution": "익숙한 돌봄의 목적과 장기 부담을 질문",
    "friction": {
      "condition": "서로 추측해서 돕고 실제 요청은 묻지 않을 때",
      "sourceIntentionCandidate": "기억한 필요를 챙기는 행동",
      "targetMayMisreadSource": "지난 기준에 묶는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "의미를 더 살피려는 대화",
      "sourceMayMisreadTarget": "실제 수고를 못 알아보는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "예전 필요가 지금도 같은지 확인했는가?",
      "targetQuestion": "어떤 도움이 필요한지 물었는가?",
      "jointAgreement": "현재 요청과 기억에 근거한 도움을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "둘 다 부드러워도 같은 상황을 원하지 않을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "생활 변화에서 실제 준비와 원하는 이유를 나누는 장면"
      },
      {
        "id": "mpj:INFJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "작은 불편을 참고 넘기지 않고 한 항목만 말하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "타인의 감정을 흡수·감지한다는 원천 표현을 검증 사실로 쓰지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:INFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:INFP",
    "sourceType": "ISFJ",
    "targetType": "INFP",
    "jointReviewId": "mpj:INFP:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "b849eb2b334b8cace272470cc0f79da4e9fda4f147877c732c7c82970d8d1d04",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFP.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "e24c200461f9ee61ed6a459801199cfc733d1be5fe15ce2f017d4abc9b424e33",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "INFP",
        "domain": "thinkingStyle",
        "traitId": "fi_inner_alignment",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "18e2b43db4b9ff2ce0e19f44e786caf50868b835062ee8a10ceff79019d7024c"
      },
      {
        "type": "INFP",
        "domain": "thinkingStyle",
        "traitId": "ne_branching_imagination",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "0c0a9af711c2f78cc2d20463ef414125d76bf81838802685d18975c2673e5256"
      },
      {
        "type": "INFP",
        "domain": "communication",
        "traitId": "gentle_metaphoric_speech",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "df4cdeaaa1a74b28431f02996a88501a038de73d0bdcbd20ccb3083982b635ab"
      },
      {
        "type": "INFP",
        "domain": "communication",
        "traitId": "slow_to_show_affection",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c8ecbafb18102e625149745af922b3ea3439095ca0bc15409a738ec89df46741"
      },
      {
        "type": "INFP",
        "domain": "workplace",
        "traitId": "autonomy_required",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "74580027ae5ad27e773634ec2a08d5d721bdfcf9645f255fcbf4bc8eb869d876"
      },
      {
        "type": "INFP",
        "domain": "workplace",
        "traitId": "low_competition_environment",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e48dcda440160dac9e61b5b85d258dc47f36283442fa47bb004650767a08e4c6"
      },
      {
        "type": "INFP",
        "domain": "relationships",
        "traitId": "deep_value_based_bonds",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "826efadffc1a0ba755998d9bb8bca1aa13beff6a80593ba6924139924e3ec79e"
      },
      {
        "type": "INFP",
        "domain": "relationships",
        "traitId": "boundary_against_cruelty",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b111109947fa925e547ccbb3490355bb11f27c55f75a9b9217b4a7fa968dd714"
      },
      {
        "type": "INFP",
        "domain": "love",
        "traitId": "deep_emotional_bond",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "b173c89dc731ef040729f411d74e9b8f49db7ef6c4829f1fe17fe9365fc878c8"
      },
      {
        "type": "INFP",
        "domain": "love",
        "traitId": "artistic_dates",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1d7e23a6951530d95ab4913cf1b736cec11ff7456cad3d3354beb54aee986b6c"
      },
      {
        "type": "INFP",
        "domain": "marriage",
        "traitId": "freedom_romance_marriage",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f877ea71112bea8f36ed19194d8b223613ced4831a87b45f761c6052b4766d7c"
      },
      {
        "type": "INFP",
        "domain": "marriage",
        "traitId": "devotion_and_boundary",
        "file": "docs/product/mbti/source/INFP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c0adf46bd9d3ec72786d2d61d151db1108c6c389287d6bdfbf78d687b89e2ee5"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "조용하고 신뢰하는 관계를 소중히 여길 접점이 있다. 도움을 주고받는 범위를 직접 확인한다.",
    "difference": "가치의 내적 수용과 기억한 생활 필요의 챙김이 다를 수 있음",
    "directionalContribution": "원하는 의미를 작은 생활 행동으로 옮기기",
    "targetContribution": "익숙한 돌봄이 지금의 가치와 맞는지 질문",
    "friction": {
      "condition": "상대가 원치 않는 도움을 계속 맞춰줄 때",
      "sourceIntentionCandidate": "기억한 필요를 챙기는 제안",
      "targetMayMisreadSource": "기존 역할에 묶는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "자유와 의미를 지키는 거절",
      "sourceMayMisreadTarget": "수고를 밀어내는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금도 필요한 도움인가?",
      "targetQuestion": "고마움과 거절을 함께 말했는가?",
      "jointAgreement": "도움 항목은 요청하고 책임은 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "배려가 많아도 말하지 않은 기대는 일치하지 않을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFP:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "선물보다 필요한 도움의 종류를 묻는 장면"
      },
      {
        "id": "mpj:INFP:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공동 집안일을 조용히 떠안지 않고 나누는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "한쪽이 현실을 맡고 다른 쪽이 의미를 맡는 고정 역할 금지",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "benefit",
      "system": "socionics_term_family",
      "reasonClasses": [
        "A_ASYMMETRIC_FAMILY_ROLES_UNVERIFIED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:INFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ENFJ",
    "sourceType": "ISFJ",
    "targetType": "ENFJ",
    "jointReviewId": "mpj:ENFJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "afdfe234ad109aa6cbc55439b9fc590d3f0d6e996a8f4a746a08ee7efde6911d",
      "label": "조용한 보호와 적극적 선도가 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "6f3f77258e950d4af75b4a63c53d5a16c882fb4918ee548229ad28aa37c99dc7",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ENFJ",
        "domain": "thinkingStyle",
        "traitId": "fe_first_judgment",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6c6030aafd9c16492de89cb5c9fa9334df09745b55a98cc2445aad8998a44458"
      },
      {
        "type": "ENFJ",
        "domain": "thinkingStyle",
        "traitId": "future_meaning_orientation",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a035c8afc59a1a9ee0227da808331ad4904bcc08386c6d6b98d62ff13527f162"
      },
      {
        "type": "ENFJ",
        "domain": "communication",
        "traitId": "eloquent_social_speech",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "c35da4eef9d0d1fadeb0ff08df7f8bfa6c36646feeefc64b798f480cee11060f"
      },
      {
        "type": "ENFJ",
        "domain": "communication",
        "traitId": "gentle_feedback",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "7caedd4e21b4c08fcc9641bfefb82142b7f8d69ded45ba48e8199ce91bd1ec61"
      },
      {
        "type": "ENFJ",
        "domain": "workplace",
        "traitId": "collaborative_environment",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "8d219f175811e20225e227fec5e4e97d118bc8d5b0784575d0dc6a95a9b72c8e"
      },
      {
        "type": "ENFJ",
        "domain": "workplace",
        "traitId": "tension_sensitive_work",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "47a6337072621b148225d69a4f66872362d2b2c52ef9508c3df3d664041f20f8"
      },
      {
        "type": "ENFJ",
        "domain": "relationships",
        "traitId": "wide_social_bonding",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "9fbe0e46ca9e757aab955191a1fa1957019f279f5714e7ac50e528268ea2dee6"
      },
      {
        "type": "ENFJ",
        "domain": "relationships",
        "traitId": "warm_but_selective_cutoff",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "4ad522286f5879c16f8b08c6970dc960415c3a8710300eb9be25c549666c846d"
      },
      {
        "type": "ENFJ",
        "domain": "love",
        "traitId": "full_hearted_love",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "39bc693833b926655020899ebdd8ab19004fa730aaaea41075b46bd81ada45ae"
      },
      {
        "type": "ENFJ",
        "domain": "love",
        "traitId": "emotional_confirmation_need",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b4420ecef332272c62209875c8d45f0a5fa226436d0ebe61283614c0a6d2f2f5"
      },
      {
        "type": "ENFJ",
        "domain": "marriage",
        "traitId": "future_planning_partner",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "e66fe2e6b6dfd321cbc8c1bf767c462ec4858c0a45e0e1cad3889178958cbcf8"
      },
      {
        "type": "ENFJ",
        "domain": "marriage",
        "traitId": "marital_emotional_labor",
        "file": "docs/product/mbti/source/ENFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "9bc3b87411148aeda32372eee9d07d004762db61a4a916a812f8c1aee30a2326"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "배려와 관계 책임을 중시하는 접점이 있다. 보호하려는 마음에도 상대의 선택권이 필요하다.",
    "difference": "관계를 넓히는 조율과 익숙한 세부를 챙기는 안정이 다를 수 있음",
    "directionalContribution": "공동 비전을 작은 준비와 생활 약속으로 연결",
    "targetContribution": "조용한 필요를 공동 논의로 가져오기",
    "friction": {
      "condition": "개선·참여를 권하며 거절을 놓칠 때",
      "sourceIntentionCandidate": "마찰을 피하는 조심스러운 답",
      "targetMayMisreadSource": "동의하는 반응으로 읽힐 가능성",
      "targetIntentionCandidate": "더 나은 관계를 위한 설득",
      "sourceMayMisreadTarget": "기존 수고를 고치려는 평가로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "한계를 직접 알렸는가?",
      "targetQuestion": "도움을 요청받았는가?",
      "jointAgreement": "도움받을 범위와 거절 가능한 역할을 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "배려가 닮아도 모두를 챙길 필요는 없음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 진행과 조용한 준비 중 맡을 일을 고르는 장면"
      },
      {
        "id": "mpj:ENFJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "요청 없이 대신한 일을 다음에는 먼저 묻는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "말 없는 양보를 자발적 동의로 보지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ENFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ENFP",
    "sourceType": "ISFJ",
    "targetType": "ENFP",
    "jointReviewId": "mpj:ENFP:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "64ce6132ad4229ce42b798f60e9e19dad9ca345610ac6fb4be79ecdeb9803885",
      "label": "반이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFP.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "9fde4dc476eadb193156caab28eecbb696582532c6e4c42b57cabc32d3f54efe",
      "label": "반-이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ENFP",
        "domain": "thinkingStyle",
        "traitId": "ne_connection_thinking",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "68d176153713f5206cea0bd613cecc83c1987d0aa20263fbdefaa2f852c58fdc"
      },
      {
        "type": "ENFP",
        "domain": "thinkingStyle",
        "traitId": "imaginative_storytelling",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "539d339a74f64f38d682a270a9d5118985fdfcc4813f724778caed2d1c11f2cc"
      },
      {
        "type": "ENFP",
        "domain": "communication",
        "traitId": "easy_conversation",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6bb60eafed38ff548e55db40438c6b15e90253504dc01c51cf4476b07560f1ab"
      },
      {
        "type": "ENFP",
        "domain": "communication",
        "traitId": "random_but_charming_speech",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9bdfcdccc7628084d7584933866964f7457ebdc240b71dead12ee151530b3b12"
      },
      {
        "type": "ENFP",
        "domain": "workplace",
        "traitId": "novelty_required_work",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "3e6855d9cb854cbe5a02bfaa327200e5b63faa9f913e8754b8c498cb117ef0e8"
      },
      {
        "type": "ENFP",
        "domain": "workplace",
        "traitId": "deadline_sprint_style",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "6c2f70bbd1cfbdc8c2296f988a065f87ad1bdd8771ca47032e55b04da217bc25"
      },
      {
        "type": "ENFP",
        "domain": "relationships",
        "traitId": "wide_light_network",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f9427e37e92060c44c6193e4904efa43cfa854c271d5da4aaa2d6e34595725ba"
      },
      {
        "type": "ENFP",
        "domain": "relationships",
        "traitId": "joy_giver",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "124153af9c4f64a932f06c0e48ec965eb2deedc46abd348cc50aa71a538718bd"
      },
      {
        "type": "ENFP",
        "domain": "love",
        "traitId": "passionate_romance",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "bc03c20270d9263d74e5f4eb1123f373f2e6909ef95eb790ab3e005e146133a8"
      },
      {
        "type": "ENFP",
        "domain": "love",
        "traitId": "warm_confidant_partner",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "51b0c8a849e951d17b1a3d773ad0f448653944945e88ccaabd24f3b6e4580e6f"
      },
      {
        "type": "ENFP",
        "domain": "marriage",
        "traitId": "creative_family_life",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "c50159703e69fe71903234a397a1d109a9eb6cb6e1b61b16ee08f605e96bf6c8"
      },
      {
        "type": "ENFP",
        "domain": "marriage",
        "traitId": "freedom_in_marriage",
        "file": "docs/product/mbti/source/ENFP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "ef7c11cb305d70d6a0c867fba4fc19ad508754b69d2fe8e56758aa4388911e1a"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "다정한 관심과 생활의 편안함에서 접점이 생길 수 있다. 새 초대와 익숙한 리듬을 함께 선택한다.",
    "difference": "연결을 넓히는 변화와 기억한 필요의 안정이 다를 수 있음",
    "directionalContribution": "새 제안의 세부 준비와 부담을 확인",
    "targetContribution": "익숙한 활동에 새로운 선택지를 더함",
    "friction": {
      "condition": "제안이 잦아지며 기존 준비가 반복 취소될 때",
      "sourceIntentionCandidate": "안정을 지키려는 확인",
      "targetMayMisreadSource": "변화를 막는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "즐거움을 더하려는 새 제안",
      "sourceMayMisreadTarget": "수고를 가볍게 보는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 부담을 직접 말했는가?",
      "targetQuestion": "변경 뒤 준비도 맡았는가?",
      "jointAgreement": "새 활동은 하나씩 선택하고 준비 책임을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "거절할 수 있는 초대가 관계를 편하게 할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFP:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "새 모임 제안에 참가 방식부터 고르는 장면"
      },
      {
        "id": "mpj:ENFP:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "기존 준비를 바꾸기 전 비용을 함께 확인하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "돌봄을 당연한 역할로 배정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "semi_duality",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ENFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ISTJ",
    "sourceType": "ISFJ",
    "targetType": "ISTJ",
    "jointReviewId": "mpj:ISTJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "560d5c03968fb504f6817007f328bd347dcdafe6415c556724431478ba5151ca",
      "label": "안정과 책임이 닮은 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "0f61c1c6495946766f1801bd5aad6ae5467ae17065ac41e3726500f057cc0bd3",
      "label": "비교 관계",
      "sourceRelationName": "Comparative",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ISTJ",
        "domain": "thinkingStyle",
        "traitId": "past_data_decision",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "b362f8b53802e249035ce0979a3ee1c7c11752e020c26f4c9f2a6e340d110bef"
      },
      {
        "type": "ISTJ",
        "domain": "thinkingStyle",
        "traitId": "efficient_error_detection",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b1c4340792a2be816e9c9dda32267554926f1fbe92a37f646777f2ee35b77113"
      },
      {
        "type": "ISTJ",
        "domain": "communication",
        "traitId": "reserved_directness",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "accb5a5eac218f8263a128e9d53e46e7a4d96fb63eeb22300d3491888cff6116"
      },
      {
        "type": "ISTJ",
        "domain": "communication",
        "traitId": "apology_difficulty",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e1d767f800dca016987c31c4008328f8826dc859cea8abe3f4d639e4e36c70ec"
      },
      {
        "type": "ISTJ",
        "domain": "workplace",
        "traitId": "rule_following_reliability",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "718254e25a4059b2ee415f8c20895622eb30fde5652862527de34c9fa2821cee"
      },
      {
        "type": "ISTJ",
        "domain": "workplace",
        "traitId": "time_promise_strictness",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "aeeac6ab7bf8593830f8d8aa4d1801abe01f3ae7ff5c79c2cc8c1d76f466d394"
      },
      {
        "type": "ISTJ",
        "domain": "relationships",
        "traitId": "hard_boundary_after_disrespect",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "9d86fba811ab530488a658d9ab64185a8ff0474f161ed4e9c4cce8da41326668"
      },
      {
        "type": "ISTJ",
        "domain": "relationships",
        "traitId": "few_but_stable_bonds",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "ab2d15afd4370f03a0f41eba8939364c03a76e97e7a98223c0744c07d7272405"
      },
      {
        "type": "ISTJ",
        "domain": "love",
        "traitId": "trust_first_love",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6cf5aaf11c27bd6255903f9e39e5dc8f87c903d2aed9f451ff36205ee1bae04b"
      },
      {
        "type": "ISTJ",
        "domain": "love",
        "traitId": "reserved_affection",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c176fbf27a9edec12f6738d5768bfd04ef6665d7ec481b5f1dee0aa0231fca1c"
      },
      {
        "type": "ISTJ",
        "domain": "marriage",
        "traitId": "stable_household_builder",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "232c1b20ba65d2747302df353bdbc25db6bf9e72683bc376809b5d4dc4f3cb7b"
      },
      {
        "type": "ISTJ",
        "domain": "marriage",
        "traitId": "spouse_control_risk",
        "file": "docs/product/mbti/source/ISTJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2c6f627426a9ab0c554d3d1420da466ea7ef44c3fd812681e32eb60c8b91ae97"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "기억한 약속과 작은 책임을 지키려는 접점이 있다. 조용한 협력에도 부담을 확인할 말이 필요하다.",
    "difference": "실무 정확성의 기준과 상대 필요의 챙김이 다를 수 있음",
    "directionalContribution": "기준에 빠진 개인 필요와 작은 변화를 확인",
    "targetContribution": "돌봄의 담당과 반복 일정을 정리",
    "friction": {
      "condition": "수고를 당연히 받거나 불편을 모두 참을 때",
      "sourceIntentionCandidate": "관계를 지키려는 조용한 양보",
      "targetMayMisreadSource": "아무 부담 없다는 동의로 읽힐 가능성",
      "targetIntentionCandidate": "정확한 완료를 위한 점검",
      "sourceMayMisreadTarget": "노력을 인정하지 않는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "감당할 선을 말했는가?",
      "targetQuestion": "수고와 수정 요청을 나눴는가?",
      "jointAgreement": "정기 책임과 도움 요청을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "안정적으로 보여도 거절할 일이 있을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 집안일에서 맡을 수 없는 항목도 말하는 장면"
      },
      {
        "id": "mpj:ISTJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "준비를 마친 뒤 감사와 불편을 따로 나누는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "배려·책임의 크기를 유형으로 비교하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ISTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ISFJ",
    "sourceType": "ISFJ",
    "targetType": "ISFJ",
    "jointReviewId": "mpj:ISFJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "ce3d4c7af0a0956049bfe95f3d0a60f062858a3d0592173a1d9031aee789dfd4",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "ce3d4c7af0a0956049bfe95f3d0a60f062858a3d0592173a1d9031aee789dfd4",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "작은 필요를 기억하고 신뢰를 쌓는 접점이 있다. 서로 챙겨도 각자의 한계는 직접 들어야 한다.",
    "difference": "개별 부담·가족 역할은 같은 유형에서 알 수 없음",
    "directionalContribution": "자기 부담을 말해 돌봄 범위 조정",
    "targetContribution": "상대가 원하는 도움을 직접 확인",
    "friction": {
      "condition": "둘 다 말없이 추가 일을 맡을 때",
      "sourceIntentionCandidate": "관계를 지키려는 양보",
      "targetMayMisreadSource": "계속 맡아도 된다는 동의로 읽힐 가능성",
      "targetIntentionCandidate": "기억한 취향을 챙기는 행동",
      "sourceMayMisreadTarget": "변한 필요를 놓치는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 감당할 수 있는가?",
      "targetQuestion": "지난 필요가 지금도 같은가?",
      "jointAgreement": "도움 전 질문하고 담당을 재분배",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "같은 배려도 원하지 않는 방식이 될 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ISFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "행사 준비의 부담을 항목별로 나누는 장면"
      },
      {
        "id": "mpj:ISFJ:ISFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "선물 대신 필요한 도움을 직접 고르는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "동일형의 완벽한 이해·무한 돌봄을 가정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "identity",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ISFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ESTJ",
    "sourceType": "ISFJ",
    "targetType": "ESTJ",
    "jointReviewId": "mpj:ISFJ:ESTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "2777e6c03162f2e0767272c46c69445d0cb3c462316374d8b9e7c85cbc95a90d",
      "label": "생활 안정과 관리가 맞물리는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "c44b1899e7cb04e88a7fb9991b7ea86d28497d3e38031e42b52431f8b679e93d",
      "label": "안정적이고 실용적인 보완 관계",
      "sourceRelationName": "Stable Complement",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ESTJ",
        "domain": "thinkingStyle",
        "traitId": "te_fact_execution",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "647a3416eec9df0dec02d49bf02ae5964422a9c8ffdbc7cdd81a4b1024bbf39a"
      },
      {
        "type": "ESTJ",
        "domain": "thinkingStyle",
        "traitId": "si_verified_process",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "690e12aa0d145b3ee3a82159afc777b59be6db6bcebd82846c0975e08abe190f"
      },
      {
        "type": "ESTJ",
        "domain": "communication",
        "traitId": "direct_speech",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "b42472c2d274b91acab92976b60eede124c61102e0ba878a58edf0affd02d72d"
      },
      {
        "type": "ESTJ",
        "domain": "communication",
        "traitId": "logic_over_emotional_appeal",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "217a3db4d00e40461ca2d13576c95fb5f2eca54eefef7526abc22e27b1ffc3c6"
      },
      {
        "type": "ESTJ",
        "domain": "workplace",
        "traitId": "clear_expectations",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "843cb5aa623a28a56fb9e8d5504b18e374a6511bdc96ea59aa9ca7e1a09128e8"
      },
      {
        "type": "ESTJ",
        "domain": "workplace",
        "traitId": "micro_management_precision",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "afe2aeb3b1be6568595f7b11ee775a728ebddb5ba343541178e175e463012f37"
      },
      {
        "type": "ESTJ",
        "domain": "relationships",
        "traitId": "trust_by_reliability",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f0d559e8a74bfac980de00b28c8a2bba5b8b92dd83fd6c8047ceb9470b5d0023"
      },
      {
        "type": "ESTJ",
        "domain": "relationships",
        "traitId": "solution_first_relation",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "5f290c3819cc4211b3fe1d6e05ac3f52801464af70694f9ddc658732dd26e428"
      },
      {
        "type": "ESTJ",
        "domain": "love",
        "traitId": "stable_long_term_love",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "bb6b741e6f0332ff32265c982493683a2078fb3ec2b513257256c200d7905437"
      },
      {
        "type": "ESTJ",
        "domain": "love",
        "traitId": "love_through_action",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "20c99f8ea78bd474836ea2f3efeee7f3963601a1f3393006f335d365e469a852"
      },
      {
        "type": "ESTJ",
        "domain": "marriage",
        "traitId": "structured_household",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "1dc03d676329b7244212ab1b1df79028f0830b8a6a8cb6b37c0fd9e4fe10ca22"
      },
      {
        "type": "ESTJ",
        "domain": "marriage",
        "traitId": "reliable_partner",
        "file": "docs/product/mbti/source/ESTJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "f8f62ff6f19b79149112aea9dc83e56caa97360fb78550c02e126582a9763c9d"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "일관된 약속과 생활 책임을 중시하는 접점이 있다. 정확성만큼 부담을 말할 통로가 필요하다.",
    "difference": "조심스러운 표현과 직접 수정 요구가 다를 수 있음",
    "directionalContribution": "기준이 사람에게 주는 작은 부담을 알리기",
    "targetContribution": "돌봄·준비의 완료 기준과 책임을 정리",
    "friction": {
      "condition": "공개 지적에 어려움을 말하지 못할 때",
      "sourceIntentionCandidate": "관계를 지키려는 완곡한 답",
      "targetMayMisreadSource": "문제없다는 동의로 읽힐 가능성",
      "targetIntentionCandidate": "결과를 고치는 직접 지적",
      "sourceMayMisreadTarget": "수고 전체를 낮추는 평가로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "어려운 조건을 특정했는가?",
      "targetQuestion": "먼저 수고와 제약을 들었는가?",
      "jointAgreement": "수정 항목은 하나씩 동의한 자리에서 말함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "부드러운 표현도 분명한 거절일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ESTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "준비 작업의 기준과 가능한 범위를 미리 정하는 장면"
      },
      {
        "id": "mpj:ISFJ:ESTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "집안일 수정 요청 전 부담을 확인하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "순응을 낮은 능력·자발적 동의로 보지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ESTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ESFJ",
    "sourceType": "ISFJ",
    "targetType": "ESFJ",
    "jointReviewId": "mpj:ISFJ:ESFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "149d963716412543a683ce103a896c26d04e2aac3b57aae29aed13e1ec6b7dbf",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "9836e0aabf05765eabb1f462707cc08c2c1fb5ae9a0331873a786d16d6c6aed3",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ESFJ",
        "domain": "thinkingStyle",
        "traitId": "practical_evidence_need",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "125bd83aa6bb4ccecab086cb2f5706ed7c589a9ac3e4bcc76c442ff1bf87c8ff"
      },
      {
        "type": "ESFJ",
        "domain": "thinkingStyle",
        "traitId": "memory_over_understanding",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b4f2bb3307dc2a4e53f1b23871f31df95af9cd0ba65e35196a292a8744ef7bc4"
      },
      {
        "type": "ESFJ",
        "domain": "communication",
        "traitId": "warm_positive_communication",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "dbd419d33b049c5b36bae325c0fe39500ec7fe07150df0acbe17efdf16e25529"
      },
      {
        "type": "ESFJ",
        "domain": "communication",
        "traitId": "goal_process_instruction",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2f3655c2885038dc3a17e41b87bd7884862696c0f183b27f6a2450f4c13c49d7"
      },
      {
        "type": "ESFJ",
        "domain": "workplace",
        "traitId": "team_morale_builder",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f1359fe174badd05f135c478198348f600a7758df989b42c72893435fc9a9ef2"
      },
      {
        "type": "ESFJ",
        "domain": "workplace",
        "traitId": "punctual_pressure",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e73855bd3e8cad642d847b423b3538170579ea39cb7a92512f9ab784b1195189"
      },
      {
        "type": "ESFJ",
        "domain": "relationships",
        "traitId": "small_talk_bonding",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "f9fd90fdda33044817adf4add1b1adc3ddec3f9acff2f1eba9cc3c13545ba21a"
      },
      {
        "type": "ESFJ",
        "domain": "relationships",
        "traitId": "inclusion_drive",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "056d430366261cfc8eb365f7c709e62ab92afba21cc45754e8d0f5beb3ca676d"
      },
      {
        "type": "ESFJ",
        "domain": "love",
        "traitId": "observing_then_devoted",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "8143ba9cd546c0a5c988cbb0be7d60d4805609b53bb8358f1933d52de9de66de"
      },
      {
        "type": "ESFJ",
        "domain": "love",
        "traitId": "reciprocal_expression_need",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "634d70affbbd6975510d4158e96fdf79be11331a100531a096299672a2ed8e26"
      },
      {
        "type": "ESFJ",
        "domain": "marriage",
        "traitId": "domestic_spouse_pattern",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a2542baff4929781bb717800818049485dcb3bfb85b4fe55b029207e6fbfa0d3"
      },
      {
        "type": "ESFJ",
        "domain": "marriage",
        "traitId": "traditional_role_expectation",
        "file": "docs/product/mbti/source/ESFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a62c23f88d36c7b660f9c493686bf9d064eab2c1320316c8abe5618ac7c9c9b9"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "작은 안부와 생활 책임을 챙기는 접점이 있다. 관계의 폭과 활동량은 따로 선택한다.",
    "difference": "익숙한 소수 관계와 넓은 참여·소개가 다를 수 있음",
    "directionalContribution": "많은 모임에서 놓친 작은 필요를 확인",
    "targetContribution": "조용한 준비가 공유되도록 연락 통로 제공",
    "friction": {
      "condition": "초대가 이어지고 거절을 예의 문제로 볼 때",
      "sourceIntentionCandidate": "회복 시간을 확보하는 유보",
      "targetMayMisreadSource": "관계를 멀리하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "소속감을 나누는 초대",
      "sourceMayMisreadTarget": "쉬는 시간을 빼앗는 요구로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "가능한 참여량을 말했는가?",
      "targetQuestion": "빠질 권리를 남겼는가?",
      "jointAgreement": "참여 범위와 준비 부담을 각각 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "따뜻함이 비슷해도 연락 빈도는 다를 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ESFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 참석과 준비 중 가능한 역할을 고르는 장면"
      },
      {
        "id": "mpj:ISFJ:ESFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "행사 다음 날 쉬는 시간을 먼저 표시하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "사교 범위로 배려 수준을 평가하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "mirror",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ESFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ISTP",
    "sourceType": "ISFJ",
    "targetType": "ISTP",
    "jointReviewId": "mpj:ISFJ:ISTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "bce7a22425237ed9678da6e1bd6ee9a62d2da94d924de6a9e16dc6eab8308b48",
      "label": "실용과 자율을 조율해야 하는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTP.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "522e6e34dab54621393ad0fc40e5667bbf030f75bc3c7f9985c2568d29148e5f",
      "label": "조용한 생활 보완 관계",
      "sourceRelationName": "Inferred Quiet-Care Tension",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ISTP",
        "domain": "thinkingStyle",
        "traitId": "internal_logic_frame",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "69ef7a94e5c46b0b202c8e977ea909597a2f08fa68cf5daff06469c112610623"
      },
      {
        "type": "ISTP",
        "domain": "thinkingStyle",
        "traitId": "contradiction_intolerance",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a88dd676e58063ebda48dc840b9a5ce7b1ffa3e3dcc7059c36f4c2fd8cca49ef"
      },
      {
        "type": "ISTP",
        "domain": "communication",
        "traitId": "few_words_direct",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32ef0cb0ef49d97007594c64d7aefcf3235e6cd306bb35c7f9ebca047c517891"
      },
      {
        "type": "ISTP",
        "domain": "communication",
        "traitId": "no_fake_comfort",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "4fda849deb72b825513a9f457829091b335c141940d31849061bd64621260965"
      },
      {
        "type": "ISTP",
        "domain": "workplace",
        "traitId": "anti_micromanagement",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "6bc8ca221dc55a5b03ea9c264f0428bbaea16c3207e0e3496bd90f873487ffc8"
      },
      {
        "type": "ISTP",
        "domain": "workplace",
        "traitId": "quiet_but_social_when_needed",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e0fef73e5cc5a7ce88c4b8ecea2707c8c838de4a382365c3f5fb59896f58b896"
      },
      {
        "type": "ISTP",
        "domain": "relationships",
        "traitId": "low_intrusion_relation",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "b1262cdf728643e2b20542574abf788c3b86ca9062fad0faf446ee7054b8370c"
      },
      {
        "type": "ISTP",
        "domain": "relationships",
        "traitId": "comfortable_people_only",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "83cb3b9d319cbd02894bb68d2bc3c8192cf2d52725547b4aabbc4211ca5f35d2"
      },
      {
        "type": "ISTP",
        "domain": "love",
        "traitId": "freedom_love_boundary",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a8e7109a34d1aad89bc233fd0df96a16beb27737232147d73c32124a0e350fc7"
      },
      {
        "type": "ISTP",
        "domain": "love",
        "traitId": "old_bond_keeper",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "d594d1ffa9d3c1c59a554962e6e3499faebccf197d203105d76162baf943604a"
      },
      {
        "type": "ISTP",
        "domain": "marriage",
        "traitId": "space_based_marriage",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "85a45872c9105751f918f46094e7edde43b64c904b7495d0b647f2bf7844d224"
      },
      {
        "type": "ISTP",
        "domain": "marriage",
        "traitId": "shared_hobby_bond",
        "file": "docs/product/mbti/source/ISTP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "02141fc4aed864b2e28adcbc4ede2028c6162ad8511d6be8eda93bc9aafbeaf3"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "생활의 구체적 문제를 줄이는 접점이 있다. 챙김과 자율의 경계를 직접 합의한다.",
    "difference": "기억한 필요의 확인과 간섭 없는 간결한 해결이 다를 수 있음",
    "directionalContribution": "해결 뒤 남은 생활 부담을 확인",
    "targetContribution": "반복 부담을 줄일 실용 대안 제시",
    "friction": {
      "condition": "요청 전 도움을 반복하거나 응답을 생략할 때",
      "sourceIntentionCandidate": "필요를 챙기는 질문",
      "targetMayMisreadSource": "개인 영역을 관리하는 간섭으로 읽힐 가능성",
      "targetIntentionCandidate": "혼자 처리하려는 짧은 답",
      "sourceMayMisreadTarget": "도움을 밀어내는 무관심으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 도움이 필요한가?",
      "targetQuestion": "혼자 할 일과 공유할 일을 알렸는가?",
      "jointAgreement": "요청할 도움과 공동 책임을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "간섭을 줄여도 짧은 감사는 선택할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ISTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "장비 문제의 도움 범위만 먼저 정하는 장면"
      },
      {
        "id": "mpj:ISFJ:ISTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "집안일 기준과 방법의 재량을 나누는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "생활·정서 노동을 한쪽에 고정 배정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ISTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ISFP",
    "sourceType": "ISFJ",
    "targetType": "ISFP",
    "jointReviewId": "mpj:ISFJ:ISFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "9f53a627802bb00449d86b547b91d39e8eae1179c9f8b33f1f381b20818a094c",
      "label": "준동일 관계",
      "sourceRelationName": "Quasi-Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFP.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "b05dba3dac94b770031a759e79036b3c692a2fe78f52e6e13a91e7e7caf34a76",
      "label": "준동일 관계",
      "sourceRelationName": "Quasi-Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ISFP",
        "domain": "thinkingStyle",
        "traitId": "fi_value_alignment",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "7aa00c057120bab5c645b4b1c9259c4ceb886bbd701503ecc11c12ed6dd9c547"
      },
      {
        "type": "ISFP",
        "domain": "thinkingStyle",
        "traitId": "sensory_truth_detector",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9b6f388f24143d0a6fe95d75c6eca9931955bfcce9a30eb3ce5cd631cafa9cb5"
      },
      {
        "type": "ISFP",
        "domain": "communication",
        "traitId": "silent_when_angry",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "cfa39d419a7f94c599ef0867867151467354eca90f604ef7d80940c16098f897"
      },
      {
        "type": "ISFP",
        "domain": "communication",
        "traitId": "hard_to_state_opinion",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "078eecf60dd2be19d7347f1f6dd2a9302dce395fd97f47523a26d3249f3843b6"
      },
      {
        "type": "ISFP",
        "domain": "workplace",
        "traitId": "conflict_silent_exit",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "ad65d328a8cc03ad0072b3c4850876529e51edd57a958309cdd4875fb30a8378"
      },
      {
        "type": "ISFP",
        "domain": "workplace",
        "traitId": "anti_authority_control",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a18ba61e2e2cb3bbce65cdf56556b962154b70e7e3f3a47609bfd7334af94676"
      },
      {
        "type": "ISFP",
        "domain": "relationships",
        "traitId": "harmony_before_argument",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "30b2e559c38aa56efe1e3b8c8fcf81d954c5467a0fc36f303a2b0aaaffb49b26"
      },
      {
        "type": "ISFP",
        "domain": "relationships",
        "traitId": "accepting_but_boundaried",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "c0730044a6adb87391114a0ad073c1d26c0e1de1ea94aec002c383c2643c9283"
      },
      {
        "type": "ISFP",
        "domain": "love",
        "traitId": "slow_open_romantic",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "5472e24d811bfa3b9385abd4c2d577af19f3dbea3e3bdec6a5b06e98bb674c9e"
      },
      {
        "type": "ISFP",
        "domain": "love",
        "traitId": "unspoken_crush_pattern",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "826324ce16eee11ad6328fcc60df564bc2594c166f4e9ba05b5a41e9452c8f54"
      },
      {
        "type": "ISFP",
        "domain": "marriage",
        "traitId": "freedom_needed_marriage",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "5a2692ea458a1133a7c3b345894c409b9f5ec40eee11a85832eef44e592756be"
      },
      {
        "type": "ISFP",
        "domain": "marriage",
        "traitId": "romantic_daily_care",
        "file": "docs/product/mbti/source/ISFP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "ea9c3a7fb6f46c5ccf4c00ccee31ff46a4434de06b9ba66c647077295d718c31"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "조용하고 부드러운 관계가 접점일 수 있다. 배려의 방식에도 개인 선택권을 남긴다.",
    "difference": "익숙한 생활 안정과 개인 가치·자유의 수용이 다를 수 있음",
    "directionalContribution": "원하는 경험을 지탱할 준비 확인",
    "targetContribution": "기존 돌봄이 개인 경계를 넘는지 알리기",
    "friction": {
      "condition": "챙김을 거절하지 못해 부담이 쌓일 때",
      "sourceIntentionCandidate": "기억한 기준을 지키는 도움",
      "targetMayMisreadSource": "선택을 대신하는 간섭으로 읽힐 가능성",
      "targetIntentionCandidate": "감정을 정리하는 침묵",
      "sourceMayMisreadTarget": "계속 도와도 된다는 신호로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대가 실제로 원하는가?",
      "targetQuestion": "원치 않는 도움을 말할 수 있는가?",
      "jointAgreement": "도움 항목과 개인 취향을 따로 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "부드러운 말투도 서로 다른 결정을 포함할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ISFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "외출 준비에서 챙길 것과 직접 고를 것을 나누는 장면"
      },
      {
        "id": "mpj:ISFJ:ISFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "선물의 취향을 기억만 믿지 않고 다시 묻는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "침묵을 마음의 일치로 해석하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "quasi_identity",
      "system": "socionics_term_family",
      "reasonClasses": [
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ISFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ESTP",
    "sourceType": "ISFJ",
    "targetType": "ESTP",
    "jointReviewId": "mpj:ISFJ:ESTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "ec1679edbd76a27151de162502500e0598f5277514ba21dfb738c66686ad71e3",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "ea7eba76a7902b1020a75b809b6a4dce4712c46eca021097309573857a55c93b",
      "label": "안정-자극 조율 관계",
      "sourceRelationName": "Inferred Stability-Stimulation Balance",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ESTP",
        "domain": "thinkingStyle",
        "traitId": "se_now_data",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "ed73b917431b4226d522423661e98ad01864eb3f964eb22fa47c99c9362de3c5"
      },
      {
        "type": "ESTP",
        "domain": "thinkingStyle",
        "traitId": "ti_practical_analysis",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "542307b6c0678bd00a54d4f899c632e94774937d920da64f548a6b413f8ef542"
      },
      {
        "type": "ESTP",
        "domain": "communication",
        "traitId": "straight_humor",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "91dd7586675883d592482bad50cee3af8a870c0d6aae0c026ea3d48e56012387"
      },
      {
        "type": "ESTP",
        "domain": "communication",
        "traitId": "short_explanation_preference",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "cf93f4b87c87c39a036b4e188b5af1dbdd8580808e26549f666f645f4ad9ebf3"
      },
      {
        "type": "ESTP",
        "domain": "workplace",
        "traitId": "crisis_solver",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a920fe885ef9bdc8676d8393ec9222b8a1bed20c6a1599becad19041f8ae07b3"
      },
      {
        "type": "ESTP",
        "domain": "workplace",
        "traitId": "low_tolerance_for_boredom",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "dbf859cb345585b277d9a8de6d336dd9bc4181e09e4a73e02522315c9011bd43"
      },
      {
        "type": "ESTP",
        "domain": "relationships",
        "traitId": "wide_social_circle",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a1cf406c57ffdbe242660540b130403d9ba553b9365f5eb7bd69c62d565a97ac"
      },
      {
        "type": "ESTP",
        "domain": "relationships",
        "traitId": "slow_to_cut_off",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "e2f323da5c95fe283dafd7ac72ee97ae05f7ef3f5e640203b43d6a35582b0dff"
      },
      {
        "type": "ESTP",
        "domain": "love",
        "traitId": "fun_active_love",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "97bef63be942072afaf2d445046e1cc1971010eb0fd5ba71c73525e3a5c9dfa7"
      },
      {
        "type": "ESTP",
        "domain": "love",
        "traitId": "freedom_in_love",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "4a63ae73bda92fdb7124349b6785bc7efa661d63665bde79c491210273fe7ffd"
      },
      {
        "type": "ESTP",
        "domain": "marriage",
        "traitId": "dynamic_marriage",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "969bb1c84ccb09c1084c39fe72372d9e2004696d981e23747eabafa97b6bd377"
      },
      {
        "type": "ESTP",
        "domain": "marriage",
        "traitId": "commitment_structure_need",
        "file": "docs/product/mbti/source/ESTP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "e36c648970c4541a8d96338497d0683119dc4b78357499355ea497b4dcb0dcb9"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "현재 생활의 필요와 현장 문제를 함께 살필 접점이 있다. 안정과 새 경험의 범위를 합의한다.",
    "difference": "구체적 기준의 일관성과 현장 즉시 수정이 다를 수 있음",
    "directionalContribution": "활동 뒤 남을 준비·일정 부담 확인",
    "targetContribution": "익숙한 방식의 대안을 현장에서 제시",
    "friction": {
      "condition": "잦은 변경이 예고 없이 준비를 바꿀 때",
      "sourceIntentionCandidate": "안정을 확인하는 질문",
      "targetMayMisreadSource": "자유를 막는 걱정으로 읽힐 가능성",
      "targetIntentionCandidate": "경험을 제안하는 빠른 말",
      "sourceMayMisreadTarget": "기존 수고를 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "실제 걱정 항목을 말했는가?",
      "targetQuestion": "변경 뒤 정리도 맡았는가?",
      "jointAgreement": "준비 비용과 변경 가능 구간을 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "작은 준비가 새 활동의 부담을 줄일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ESTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "나들이에서 예약과 자유 활동을 나누는 장면"
      },
      {
        "id": "mpj:ISFJ:ESTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "농담이 불편한 때 즉시 멈춰 달라고 말하는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "활동 동의를 성향에서 추정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": "mirage",
      "system": "socionics_term_family",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ESTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISFJ:ESFP",
    "sourceType": "ISFJ",
    "targetType": "ESFP",
    "jointReviewId": "mpj:ISFJ:ESFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "31497f79d3c059a631677e3f5cc465d2ee1c37574ca8b52001fe00869ecd5501",
      "label": "생활 안정과 즐거움의 속도 차이 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFP.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "24d07254bfcf86fbfad140d80a8c859ab805fcd69f2e725f84545e0a8967b047",
      "label": "돌봄-활동 보완 관계",
      "sourceRelationName": "Inferred Care-Activity Complement",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "sensory_memory_judgment",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "32e2faf7bc710674473d1544aeaa3062f5fc5b70d4894f1a84d8ed4d7b3b6c94"
      },
      {
        "type": "ISFJ",
        "domain": "thinkingStyle",
        "traitId": "detail_first_attention",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "2fba4f7e7c4713bcb4cd71abca4005bf616aa2a4977c560ef389277b44e6e757"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "careful_word_choice",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "eba8436f4c7015990a86ec562dee9ed584489902536b355c4527d8aa031da704"
      },
      {
        "type": "ISFJ",
        "domain": "communication",
        "traitId": "small_talk_support",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "1097b18b0f77270f8fb72a510879b4c7586dab1d47ab63e8e6ea364eb708cca5"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "guideline_micro_manager",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "16250fc8cd51bb8bad1e1448b928cd5a60a9ebc6396843bb70b81ea28923343e"
      },
      {
        "type": "ISFJ",
        "domain": "workplace",
        "traitId": "conflict_avoidance_at_work",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "98fe3c4cb1fd36fff5570a288dd4aee4e63cb98565d0474420cbbc310617170f"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "hard_to_enter_reliable_once_in",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "a678848639e512af4bdaafb1dfe7910ed2c0cba0953eab3e24fe378919cc05f6"
      },
      {
        "type": "ISFJ",
        "domain": "relationships",
        "traitId": "memory_based_affection",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "9f32f5a080fb4b6805ac171fe036969be6b5e0a3816ab6229cce6aa671d69783"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "slow_trust_love",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "2b74f1a4a53087aff6ee0fa0f320610698bc8ca29e91d5e370159141bdd73c35"
      },
      {
        "type": "ISFJ",
        "domain": "love",
        "traitId": "devoted_partner",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "a99991d98d1ae4dc4793fb0202d944b24848af9837bc598eaa4643dbbfffa30d"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "home_stability_builder",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "afb80a45740c82da4404b987f803f4c4c78ad43f4813e31ebd5987b92b9a9883"
      },
      {
        "type": "ISFJ",
        "domain": "marriage",
        "traitId": "traditional_family_role",
        "file": "docs/product/mbti/source/ISFJ.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "74427f7a056b0f8974def316f7f886941b55d4f15c6215005f7668cf345e56a3"
      }
    ],
    "targetTraitRefs": [
      {
        "type": "ESFP",
        "domain": "thinkingStyle",
        "traitId": "experience_based_learning",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/thinkingStyle/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "3106c1b99e65ba71379cab72875cfcb3469fbd922d78616828686c4e163139be"
      },
      {
        "type": "ESFP",
        "domain": "thinkingStyle",
        "traitId": "anti_theory_bias",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/thinkingStyle/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b065c8b498bc19cac4c230a8a09d5cd7ddc4d58d58cc9befd67ffdd38f37e41c"
      },
      {
        "type": "ESFP",
        "domain": "communication",
        "traitId": "honest_self_disclosure",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/communication/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "5409ea6f8c4e4a24b657675a5243577873701e6a7d85cee52f8fa3fdba060e88"
      },
      {
        "type": "ESFP",
        "domain": "communication",
        "traitId": "many_words_low_structure",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/communication/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b3acab775707b2156ccaddf60533d8af79fb0288ff6361264a0c2098d58078b4"
      },
      {
        "type": "ESFP",
        "domain": "workplace",
        "traitId": "anti_bureaucracy_work",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/workplace/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "c100494a64248c4982419afa4b99705dae0e4b588d4f938ba55c7769de064f19"
      },
      {
        "type": "ESFP",
        "domain": "workplace",
        "traitId": "people_nearby_energy",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/workplace/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "ad49db02a657299f21a5d3a4efcbeb55f6f59eb2cc9d63ae7c9c03151c8d4604"
      },
      {
        "type": "ESFP",
        "domain": "relationships",
        "traitId": "no_prejudice_acceptance",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/relationships/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "d949d2b366894b3fc7fd5fe02a45780d3923cc240e984d30b17ef1b6c9852daa"
      },
      {
        "type": "ESFP",
        "domain": "relationships",
        "traitId": "story_and_episode_talk",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/relationships/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "591b812c966db056beaf7ecf5278003f560f29d2c38f6a8721b44eb60e665b68"
      },
      {
        "type": "ESFP",
        "domain": "love",
        "traitId": "expressive_love_style",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/love/0",
        "sourceCoverage": "direct",
        "plainKoSha256": "48f47e9f743c1f5f001b4bac608a8d62e4d83fc8be23fe4e2a2c6790a4f58200"
      },
      {
        "type": "ESFP",
        "domain": "love",
        "traitId": "romantic_surprise",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/love/1",
        "sourceCoverage": "direct",
        "plainKoSha256": "b66100a1312c9c6849d1daea59d2a8b79e8fe5fb1588228e075d1bf532d39743"
      },
      {
        "type": "ESFP",
        "domain": "marriage",
        "traitId": "fun_household_partner",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/marriage/0",
        "sourceCoverage": "inferred",
        "plainKoSha256": "00ba0787f3d8eb9cc904a5625763ff1580d68a011e00c1c439c92dd902db9538"
      },
      {
        "type": "ESFP",
        "domain": "marriage",
        "traitId": "freedom_in_marriage",
        "file": "docs/product/mbti/source/ESFP.json",
        "pointer": "/traits/marriage/1",
        "sourceCoverage": "inferred",
        "plainKoSha256": "0407bcb5af6dac3eff7f745abc856c5d7178c973063bb6b7ce7b585b5b51f142"
      }
    ],
    "basisDomains": [
      "thinkingStyle",
      "communication",
      "workplace",
      "relationships",
      "love",
      "marriage"
    ],
    "provenance": "two_trait_conditional_comparison",
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "일상에서 다정한 경험을 나누는 접점이 있다. 챙김과 즐거움의 비용을 함께 확인한다.",
    "difference": "익숙한 루틴의 안정과 즉흥 경험의 표현이 다를 수 있음",
    "directionalContribution": "활동을 지속할 준비와 예산 확인",
    "targetContribution": "반복 일상에 현재의 즐거움을 더함",
    "friction": {
      "condition": "초대가 늘며 준비와 비용이 한쪽에 남을 때",
      "sourceIntentionCandidate": "생활 부담을 줄이는 확인",
      "targetMayMisreadSource": "재미를 막는 관리로 읽힐 가능성",
      "targetIntentionCandidate": "기쁨을 나누는 초대",
      "sourceMayMisreadTarget": "기존 책임을 잊는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "감당할 범위를 말했는가?",
      "targetQuestion": "준비와 정리를 함께 맡았는가?",
      "jointAgreement": "활동 선택 전에 담당·비용을 확인",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "밝은 표현도 쉬어야 하는 날이 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISFJ:ESFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "소규모 모임의 준비를 직접 나누는 장면"
      },
      {
        "id": "mpj:ISFJ:ESFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "예정 밖 활동의 참여 여부를 따로 묻는 장면"
      }
    ],
    "categoryApplicability": [
      {
        "category": "love",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 교제와 상호 동의가 확인될 때만 표현·만남에 참고; 호감 추정 금지"
      },
      {
        "category": "marriage",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 공동생활·책임이 있을 때만 참고; 혼인 상태 추정 금지"
      },
      {
        "category": "parent_child",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 역할·발달 단계와 관찰된 선호 우선; 성인 MBTI에서 자녀 유형·존재 역추론 금지"
      },
      {
        "category": "coworkers",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 업무 범위·기한·협업 재량 확인"
      },
      {
        "category": "manager_team",
        "scope": "basic_interaction_candidate_only",
        "gate": "공식 권한·평가·거절의 불이익을 먼저 확인; 권력 문제를 유형 차이로 축소 금지"
      },
      {
        "category": "business",
        "scope": "basic_interaction_candidate_only",
        "gate": "계약·전문성·책임을 먼저 확인; 지분·법적 판단·수익 예측 자료 아님"
      },
      {
        "category": "friends",
        "scope": "basic_interaction_candidate_only",
        "gate": "실제 참여·공개·연락의 동의를 먼저 확인"
      }
    ],
    "counterexample": "소비 수준·가족 역할을 유형으로 배정하지 않음",
    "applicationGate": "두 사람 모두 인용한 원천 성향이 실제로 맞는지 확인한다. 맞지 않거나 역할·환경·경험이 더 적절한 설명이면 적용하지 않는다. 도움·질문·활동은 상대 동의가 있을 때만 선택한다.",
    "disallowedClaims": [
      "상대 감정·의도·과거 사건의 확정",
      "성공률·만족도·이별·결혼·출산 예측",
      "명칭에 따른 최고·최악 관계 판정",
      "요청자·감독자·돌봄 역할의 자동 배정",
      "폭력·강압·차별을 유형 차이로 정당화",
      "능력·지능·질환·우월성 판단"
    ],
    "relationNameReview": {
      "termFamily": null,
      "system": "source_local_inference_label",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISFJ",
      "user-source:ESFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  }
] as const satisfies readonly MbtiPairResearch[];
