import type { MbtiPairResearch } from "./mbtiPairResearchTypes";

export const MBTI_PAIR_RESEARCH_INFJ = [
  {
    "id": "mpr:INFJ:INTJ",
    "sourceType": "INFJ",
    "targetType": "INTJ",
    "jointReviewId": "mpj:INTJ:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "588a7e6213e213faeca707ea4f7a017f4fd53b5e4f62d6b6887d70c98c56a1bf",
      "label": "비교 관계",
      "sourceRelationName": "Comparative",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "c948ae01b5aa0f13cf9f6fd4093afe520bb5544f07eaf87460f7c0cbbf26ce41",
      "label": "흥미로운 관계",
      "sourceRelationName": "Interesting",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "겉의 사건보다 그 뒤의 패턴과 방향을 읽으려는 관심이 만날 수 있다. 같은 미래 이야기도 확인하는 근거는 다르다.",
    "difference": "논리적 구조의 정합성과 사람에게 갖는 의미가 다른 질문을 만들 수 있음",
    "directionalContribution": "계획이 사람에게 주는 부담과 관계의 맥락을 질문",
    "targetContribution": "큰 의미를 실행 가능한 가정과 단계로 풀어봄",
    "friction": {
      "condition": "의미 설명을 근거 없는 감정으로 줄이거나 논리를 냉정함으로 규정할 때",
      "sourceIntentionCandidate": "계획의 정서적 영향을 우회적으로 알리는 말",
      "targetMayMisreadSource": "결정을 피하는 모호한 반응으로 읽힐 가능성",
      "targetIntentionCandidate": "정확하지 않은 설명을 정리하려는 말",
      "sourceMayMisreadTarget": "내 가치나 경험을 지우는 평가로 들릴 가능성"
    },
    "repair": {
      "sourceQuestion": "상대가 바꿀 수 있는 요청을 직접 말했는가?",
      "targetQuestion": "논리 오류와 상대가 중요하게 여기는 가치를 나눴는가?",
      "jointAgreement": "자료 확인과 영향 확인을 각각 한 번 하고 수정점을 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "조용한 공감처럼 보여도 상대 마음을 알아맞힌 증거는 없음",
    "fictionalScenes": [
      {
        "id": "mpj:INTJ:INFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 이사에서 통근 조건과 생활의 의미를 따로 적는 장면"
      },
      {
        "id": "mpj:INTJ:INFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "말이 줄었을 때 불만을 추정하지 않고 쉬고 싶은지 묻는 장면"
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
    "counterexample": "실제 가치 우선순위가 같으면 과장된 논리 대 감정 구도 제외",
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
      "termFamily": "kindred",
      "system": "socionics_term_family",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:INTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:INTP",
    "sourceType": "INFJ",
    "targetType": "INTP",
    "jointReviewId": "mpj:INTP:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "f542efda509cfe4d1d15b6bc574fe829e7b12119fd2aaed86089f489031a7a20",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "c65ff13e2f26d1b50a95645b36d6f127feabb0da4250b62701dbf89c8e4e9134",
      "label": "수혜자-후원자 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "표면의 설명을 넘어 이유를 탐색하는 관심이 만날 수 있다. 사실의 설명과 마음의 요청을 따로 듣는 것이 접점이다.",
    "difference": "논리적 결론을 원하는 대화와 의미·정서 맥락을 나누는 대화가 다를 수 있음",
    "directionalContribution": "논리 검토에서 빠진 관계 영향을 질문",
    "targetContribution": "막연한 해석의 가정과 대안을 확인",
    "friction": {
      "condition": "고민에 즉시 분석을 붙이거나 우회 표현을 정답 맞히기로 바꿀 때",
      "sourceIntentionCandidate": "상처를 줄이려는 간접 요청",
      "targetMayMisreadSource": "해결할 것이 없는 모호한 말로 읽힐 가능성",
      "targetIntentionCandidate": "문제의 원인을 정리하려는 질문",
      "sourceMayMisreadTarget": "마음을 평가하는 시험으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "원하는 행동을 한 가지 직접 전했는가?",
      "targetQuestion": "설명과 공감 중 무엇이 필요한지 물었는가?",
      "jointAgreement": "감정 확인 뒤 분석 동의를 받고 구체 요청 정리",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "분석적인 말도 돌봄일 수 있으나 상대가 원하는 도움과 같지는 않음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:INFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "친구의 고민에서 들어주기와 원인 검토의 순서를 고르는 장면"
      },
      {
        "id": "mpj:INTP:INFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "불편한 농담을 들었을 때 영향과 수정 요청을 나누는 장면"
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
    "counterexample": "상대가 말하지 않은 내면 의미를 유형으로 읽었다고 주장 금지",
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
      "user-source:INFJ",
      "user-source:INTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ENTJ",
    "sourceType": "INFJ",
    "targetType": "ENTJ",
    "jointReviewId": "mpj:ENTJ:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "ff70dcf9818480fa94d6d39ab1d80c1a25c619312886773a66aa93c1ea929ebb",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "5eb294b19d64bb416e282d099078bc0c975c117b03c20a172a23ca490c0a88a2",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "공동의 미래와 큰 의미를 다룰 접점이 있다. 추진 안에 당사자의 수용 조건도 포함해야 한다.",
    "difference": "직접적인 개선 언어와 우회적인 의미 표현의 속도가 다를 수 있음",
    "directionalContribution": "목표 추진이 관계에 주는 부담을 드러내기",
    "targetContribution": "가치 있는 방향을 실행 단계로 옮길 대안 제공",
    "friction": {
      "condition": "개선 제안이 요청 없이 반복될 때",
      "sourceIntentionCandidate": "상처를 줄이려는 완곡한 문제 제기",
      "targetMayMisreadSource": "동의하면서 지연하는 태도로 읽힐 가능성",
      "targetIntentionCandidate": "문제를 빨리 바꾸려는 피드백",
      "sourceMayMisreadTarget": "삶의 방향을 교정하는 평가로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "수정해 달라는 행동을 직접 밝혔는가?",
      "targetQuestion": "개선보다 듣기를 원하는지 확인했는가?",
      "jointAgreement": "가치 동의와 실행 동의를 따로 확인",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "완곡한 반대도 명확한 거절로 존중할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENTJ:INFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 봉사 계획에서 참여 부담과 목적을 함께 적는 장면"
      },
      {
        "id": "mpj:ENTJ:INFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "고민에 해결책을 내기 전에 원하는 도움을 묻는 장면"
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
    "counterexample": "감정 안전 문제를 한쪽의 민감함으로 축소하지 않음",
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
      "termFamily": "supervision",
      "system": "socionics_term_family",
      "reasonClasses": [
        "A_ASYMMETRIC_FAMILY_ROLES_UNVERIFIED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ENTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ENTP",
    "sourceType": "INFJ",
    "targetType": "ENTP",
    "jointReviewId": "mpj:ENTP:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "f98ecc5a611179b860643540f8584f3985b3688f69674d97bfbdbbc1c37411dc",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTP.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "bb60b61c385a3f88801ccbe64b43db181694f1fdfd83920104659aff8ba2ed3b",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "다른 가능성과 숨은 의미를 탐색하는 대화가 만날 수 있다. 반론의 놀이와 개인의 가치 표현은 같은 대상이 아니다.",
    "difference": "말로 전환하는 탐색과 혼자 의미를 정리하는 흐름이 다를 수 있음",
    "directionalContribution": "아이디어가 사람에게 주는 영향을 질문",
    "targetContribution": "고정된 해석에 다른 가능성을 열기",
    "friction": {
      "condition": "개인 고민까지 반론 놀이로 다룰 때",
      "sourceIntentionCandidate": "상처를 줄이려는 우회 요청",
      "targetMayMisreadSource": "동의 없는 암시로 읽힐 가능성",
      "targetIntentionCandidate": "전제를 시험하는 비유",
      "sourceMayMisreadTarget": "마음을 가볍게 여기는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "원하는 수정 행동을 말했는가?",
      "targetQuestion": "지금 반론을 원하는가?",
      "jointAgreement": "생각 실험과 개인 요청을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "직설이 명료해도 수용 가능한 온도는 따로 확인",
    "fictionalScenes": [
      {
        "id": "mpj:ENTP:INFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "책 토론과 개인 고민의 대화 규칙을 다르게 정하는 장면"
      },
      {
        "id": "mpj:ENTP:INFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "농담 뒤 실제 영향과 중단 요청을 묻는 장면"
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
    "counterexample": "상대가 숨긴 뜻을 알아냈다는 주장 금지",
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
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ENTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:INFJ",
    "sourceType": "INFJ",
    "targetType": "INFJ",
    "jointReviewId": "mpj:INFJ:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "0e5b312a541488f503381a5ca6030bd0a43211421c16736b5e9ebdaf505bddab",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "0e5b312a541488f503381a5ca6030bd0a43211421c16736b5e9ebdaf505bddab",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "깊은 의미를 나누고 조심스럽게 말하는 접점이 있다. 서로 비슷해 보여도 말하지 않은 요청은 확인해야 한다.",
    "difference": "개별 경계·회복 시간은 같은 유형으로 구분 불가",
    "directionalContribution": "자기 해석을 말로 풀어 공동 검토의 자료 제공",
    "targetContribution": "상대 해석과 관찰 사실을 나눠 질문",
    "friction": {
      "condition": "둘 다 불편함을 완곡하게만 알릴 때",
      "sourceIntentionCandidate": "상처를 줄이려는 암시",
      "targetMayMisreadSource": "문제가 크지 않다는 뜻으로 읽힐 가능성",
      "targetIntentionCandidate": "혼자 마음을 정리하는 거리두기",
      "sourceMayMisreadTarget": "관계를 끝내려는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "원하는 행동을 직접 말했는가?",
      "targetQuestion": "상대 해석을 확인했는가?",
      "jointAgreement": "관찰·해석·요청을 나눠 한 가지씩 말함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "잘 이해하는 느낌도 마음을 읽은 증거는 아님",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:INFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 일정의 작은 불편을 구체 요청으로 바꾸는 장면"
      },
      {
        "id": "mpj:INFJ:INFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "각자 쉬는 시간 뒤 다시 이야기할 때를 정하는 장면"
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
    "counterexample": "같은 유형이라고 상처·회복 방식이 같다고 단정 금지",
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
      "user-source:INFJ",
      "user-source:INFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:INFP",
    "sourceType": "INFJ",
    "targetType": "INFP",
    "jointReviewId": "mpj:INFJ:INFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "ef22cfc0099e3112fdebc0a72413b411223357c13070405b42430067654a6481",
      "label": "거짓 동일 관계",
      "sourceRelationName": "False Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFP.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "1af171fa69178cf3bdb28dc9f081dbc71401a8732a8254b256224d0dc045cf9d",
      "label": "준동일 관계",
      "sourceRelationName": "Quasi-Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "진실한 관계와 개인의 의미를 찾는 관심이 만날 수 있다. 따뜻한 표현 속 판단 기준의 차이를 살핀다.",
    "difference": "관계의 장기 의미 해석과 개인 가치의 수용이 다를 수 있음",
    "directionalContribution": "개별 고민의 반복 맥락을 정리",
    "targetContribution": "큰 의미가 개인 선택을 덮는지 질문",
    "friction": {
      "condition": "서로가 상대의 진심을 대신 설명할 때",
      "sourceIntentionCandidate": "관계의 의미를 읽으려는 질문",
      "targetMayMisreadSource": "내 가치를 교정하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "내적 기준을 지키는 유보",
      "sourceMayMisreadTarget": "공동 방향을 거절하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대가 말한 사실과 내 해석을 나눴는가?",
      "targetQuestion": "나의 선을 구체적으로 알렸는가?",
      "jointAgreement": "상대 의도는 질문으로 확인하고 자기 경계만 설명",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "비슷한 언어로 서로 다른 답을 선택할 수도 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:INFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "함께 할 봉사의 목적과 개인 거절 조건을 나누는 장면"
      },
      {
        "id": "mpj:INFJ:INFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "고민에 의미를 붙이기 전 해석을 원하는지 묻는 장면"
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
    "counterexample": "인지 기능 명칭을 실제 개인의 마음 판정에 쓰지 않음",
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
      "system": "source_local_unresolved",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:INFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ENFJ",
    "sourceType": "INFJ",
    "targetType": "ENFJ",
    "jointReviewId": "mpj:INFJ:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "fcce50086087c3066d2126251c2da437879e03ea925baaaad82592b10909faba",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "c92ef7e96364ac5ba69e404cedc3dccce73a4fbf941dfcc03504a923a5ca3497",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "공동 비전과 사람의 영향을 중시하는 접점이 있다. 관계의 폭과 깊이를 같은 기준으로 재단하지 않는다.",
    "difference": "혼자 정리하는 시간과 모임 속 조율의 속도가 다를 수 있음",
    "directionalContribution": "활동의 목적과 당사자의 작은 부담을 깊게 질문",
    "targetContribution": "개별 생각이 공동 참여로 이어질 통로 제공",
    "friction": {
      "condition": "모임 확장을 모두에게 당연한 선택으로 제시할 때",
      "sourceIntentionCandidate": "소수와 깊게 나누려는 선택",
      "targetMayMisreadSource": "관계 확장을 거부하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "다른 사람도 참여시키려는 초대",
      "sourceMayMisreadTarget": "개인 경계를 넓히는 압박으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "참여하지 않아도 지지할 방식을 말했는가?",
      "targetQuestion": "초대와 의무를 구분했는가?",
      "jointAgreement": "참여 범위와 혼자 정리할 시간을 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "활동량이 달라도 공동 비전은 유지 가능",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 준비에서 공개 진행과 사전 검토를 나누는 장면"
      },
      {
        "id": "mpj:INFJ:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "만남 뒤 각자의 회복 시간을 직접 고르는 장면"
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
    "counterexample": "내향·외향으로 관계의 깊이나 헌신을 평가하지 않음",
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
      "user-source:INFJ",
      "user-source:ENFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ENFP",
    "sourceType": "INFJ",
    "targetType": "ENFP",
    "jointReviewId": "mpj:INFJ:ENFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "7eff45c613cbea02e8e00641ff5ea8884a09a964a05a04bb74501092b75a78f0",
      "label": "보완 관계",
      "sourceRelationName": "Complementary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "213d96b3a70731884e8097152689d742f016c829271371e640be339ae4b8f5b6",
      "label": "보완 관계",
      "sourceRelationName": "Supplement",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "새 의미와 가능성에 대한 대화가 접점이다. 밝은 시작과 깊은 검토 사이에 서로의 속도를 확인한다.",
    "difference": "개인적 의미를 정리하는 흐름과 여러 연결을 나누는 흐름이 다를 수 있음",
    "directionalContribution": "새 제안의 목적과 지속 조건을 정리",
    "targetContribution": "닫힌 해석에 다른 사람·이야기의 맥락 제공",
    "friction": {
      "condition": "새 만남·활동 제안이 검토 시간 없이 이어질 때",
      "sourceIntentionCandidate": "의미를 숙고하는 유보",
      "targetMayMisreadSource": "흥미를 잃었다는 반응으로 읽힐 가능성",
      "targetIntentionCandidate": "즐거움을 나누는 즉각 제안",
      "sourceMayMisreadTarget": "마음을 정리할 틈이 없는 요구로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "생각 뒤 답할 때를 알렸는가?",
      "targetQuestion": "상대가 선택할 활동량을 물었는가?",
      "jointAgreement": "확정할 한 가지와 열어둘 후보를 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "활기 있는 제안도 혼자 숙고해 받아들일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ENFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 여행 목적을 정한 뒤 활동 후보를 고르는 장면"
      },
      {
        "id": "mpj:INFJ:ENFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "초대가 연속될 때 쉬는 날을 먼저 표시하는 장면"
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
    "counterexample": "관계 안정·끌림을 깊이와 활기의 자동 보완으로 보장하지 않음",
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
      "system": "source_local_unresolved",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ENFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ISTJ",
    "sourceType": "INFJ",
    "targetType": "ISTJ",
    "jointReviewId": "mpj:INFJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "ac93723ce3512f2005be749bf6f70f767b08e9387af2dc0e85ea87465768c55a",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "e14b21308426f8f51817c5b4600d8b2e3f1e4034cf7d6473de2b6228c6699257",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "오래 유지할 신뢰와 책임을 중시할 접점이 있다. 방향의 의미와 실제 기록을 함께 비교한다.",
    "difference": "미래 맥락의 해석과 검증된 경험의 적용이 다를 수 있음",
    "directionalContribution": "관행이 사람에게 주는 장기 영향을 질문",
    "targetContribution": "의미 있는 제안의 현실 제약을 확인",
    "friction": {
      "condition": "의미를 공상으로 부르거나 전례를 낡음으로 취급할 때",
      "sourceIntentionCandidate": "방향을 재검토하려는 질문",
      "targetMayMisreadSource": "지킨 책임을 무시하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "경험의 안전 장치를 지키는 말",
      "sourceMayMisreadTarget": "변화를 막는 단정으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "제안의 실제 단계를 말했는가?",
      "targetQuestion": "전례가 맞는 조건을 설명했는가?",
      "jointAgreement": "관찰 자료와 가치 목표를 각각 적음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "다른 근거를 확인하면 같은 결론에도 새 이유가 생김",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "생활 방식 변경 전 기록과 원하는 방향을 함께 적는 장면"
      },
      {
        "id": "mpj:INFJ:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "말 없는 불편을 구체 행동 요청으로 확인하는 장면"
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
    "counterexample": "실제 생활 책임이나 도덕성을 유형으로 비교하지 않음",
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
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ISTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ISFJ",
    "sourceType": "INFJ",
    "targetType": "ISFJ",
    "jointReviewId": "mpj:INFJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "0f6bcbe167d41659fa7ab68740cc4a4543be5f4e434039dd2a4fb725036a47ce",
      "label": "흡사 관계",
      "sourceRelationName": "Look-a-like",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "353b066044f5137280ce4a33151f55e9d2a2cfa1bd167312812fcafaa3e7b957",
      "label": "생활 안정과 깊은 의미가 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "신중한 관계 시작과 조심스러운 표현이 접점이다. 배려가 닮아도 필요한 도움의 종류는 다를 수 있다.",
    "difference": "미래 의미와 반복 맥락을 보는 렌즈가 과거의 구체 기억과 다를 수 있음",
    "directionalContribution": "익숙한 돌봄의 목적과 장기 부담을 질문",
    "targetContribution": "큰 방향을 생활 속 준비 항목으로 연결",
    "friction": {
      "condition": "서로 추측해서 돕고 실제 요청은 묻지 않을 때",
      "sourceIntentionCandidate": "의미를 더 살피려는 대화",
      "targetMayMisreadSource": "실제 수고를 못 알아보는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "기억한 필요를 챙기는 행동",
      "sourceMayMisreadTarget": "지난 기준에 묶는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "어떤 도움이 필요한지 물었는가?",
      "targetQuestion": "예전 필요가 지금도 같은지 확인했는가?",
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
      "termFamily": "business",
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
      "user-source:INFJ",
      "user-source:ISFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ESTJ",
    "sourceType": "INFJ",
    "targetType": "ESTJ",
    "jointReviewId": "mpj:INFJ:ESTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "4a4c65bcc02c4ae40656203f7508ae08f0ff902736647a4214641bdb25efef24",
      "label": "갈등 관계",
      "sourceRelationName": "Conflicting",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTJ.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "8fcba510d201a8781e92bb12166c009462c9e073fedccf53d31c0d723ad463d5",
      "label": "안정과 이상이 만나는 어려운 보완 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "의미 있는 일을 실제로 유지하려는 목표에서 접점이 생길 수 있다. 가치와 완료 기준을 함께 말한다.",
    "difference": "관계 영향의 숙고와 사실·결과 중심의 빠른 정리가 다를 수 있음",
    "directionalContribution": "결과 기준이 당사자에게 주는 영향을 설명",
    "targetContribution": "목표를 실제 일정과 책임으로 연결",
    "friction": {
      "condition": "직설적 수정 요구와 간접적 이견이 맞물릴 때",
      "sourceIntentionCandidate": "사람의 부담을 알리는 완곡한 말",
      "targetMayMisreadSource": "실행을 미루는 모호함으로 읽힐 가능성",
      "targetIntentionCandidate": "결과를 바로잡는 명확한 지적",
      "sourceMayMisreadTarget": "내 의미를 낮추는 평가로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "바꿔 달라는 행동을 특정했는가?",
      "targetQuestion": "지적 전에 영향과 이유를 들었는가?",
      "jointAgreement": "사실 확인·영향 확인·수정 약속을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "따뜻한 전달과 분명한 기준은 공존 가능",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ESTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 작업의 기한과 감당 가능한 범위를 같이 정하는 장면"
      },
      {
        "id": "mpj:INFJ:ESTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공개 지적 대신 동의한 자리에서 수정점을 말하는 장면"
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
    "counterexample": "갈등을 예언하거나 한쪽이 항상 상처받는다고 배정하지 않음",
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
      "user-source:INFJ",
      "user-source:ESTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ESFJ",
    "sourceType": "INFJ",
    "targetType": "ESFJ",
    "jointReviewId": "mpj:INFJ:ESFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "d11c82dc495ec6891a71ccf175de825027259223821c5039e9fa3fd7549555e5",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "3c7c5f8891484b480e9142c16d89cc0a886ed2f9b6999e7712bd474038d330d5",
      "label": "관계의 온도와 의미가 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "사람을 배려하고 관계를 유지하려는 관심이 겹친다. 배려를 받는 방식은 당사자에게 다시 묻는다.",
    "difference": "깊은 의미 대화와 생활 안부·소속감 확인이 다를 수 있음",
    "directionalContribution": "반복 행사나 돌봄이 갖는 개인적 의미를 질문",
    "targetContribution": "생각을 구체적인 안부와 준비로 연결",
    "friction": {
      "condition": "안부 참여를 예의로 고정하거나 일상 대화를 얕다고 볼 때",
      "sourceIntentionCandidate": "조용히 정리할 공간을 구하는 말",
      "targetMayMisreadSource": "관계에서 빠지려는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "참여감을 살피는 소개·초대",
      "sourceMayMisreadTarget": "개인 사생활을 공개하는 부담으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "원하는 연결 방식을 알렸는가?",
      "targetQuestion": "소개·공개에 동의를 받았는가?",
      "jointAgreement": "안부 빈도와 공개 범위를 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "사교를 줄여도 관계에 의미를 둘 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ESFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 소개 전에 공유해도 될 정보를 묻는 장면"
      },
      {
        "id": "mpj:INFJ:ESFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "돌봄 요청과 쉬고 싶은 시간을 따로 말하는 장면"
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
    "counterexample": "관계 노동의 의무를 성향으로 정당화하지 않음",
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
      "termFamily": "supervision",
      "system": "socionics_term_family",
      "reasonClasses": [
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ESFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ISTP",
    "sourceType": "INFJ",
    "targetType": "ISTP",
    "jointReviewId": "mpj:INFJ:ISTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "d70fbd7d4751cbe56d672d5fe437aab969a78e03628e607613ce1c48d624fd3f",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTP.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "d7242d380106b34a6fe888ad12bd3d7376a28734915fa912468844fac8bad042",
      "label": "편안한 집단 관계",
      "sourceRelationName": "Beta comfort",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "조용한 자율성과 문제를 깊이 살피는 접점이 있을 수 있다. 해석과 해결 중 필요한 도움을 구분한다.",
    "difference": "의미·맥락의 긴 설명과 실제 해결의 간결함이 다를 수 있음",
    "directionalContribution": "현장 문제의 반복 맥락과 영향을 질문",
    "targetContribution": "막연한 고민에서 지금 바꿀 부분을 확인",
    "friction": {
      "condition": "긴 감정 설명에 해결만 답하거나 짧은 답을 마음 부족으로 볼 때",
      "sourceIntentionCandidate": "경험의 의미를 나누는 이야기",
      "targetMayMisreadSource": "당장 할 일이 없는 말로 읽힐 가능성",
      "targetIntentionCandidate": "불편을 줄이는 간단한 해법",
      "sourceMayMisreadTarget": "감정을 끝내려는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금은 들어주기를 원하는지 말했는가?",
      "targetQuestion": "해결책을 원한 요청인지 확인했는가?",
      "jointAgreement": "경청과 해결 시간을 별도로 고름",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "짧은 실용적 도움도 관심의 방식일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ISTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "불편한 모임 뒤 듣기와 다음 행동 중 도움을 고르는 장면"
      },
      {
        "id": "mpj:INFJ:ISTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "함께 취미를 하며 말할 양을 직접 맞추는 장면"
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
    "counterexample": "간결함을 공감 능력 부족으로 단정하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ISTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ISFP",
    "sourceType": "INFJ",
    "targetType": "ISFP",
    "jointReviewId": "mpj:INFJ:ISFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "4ba2bc087fc5a2535ed65513ef44981e22b251097196527381672030ea10d01c",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "d4d6a238cd93d7af0b072f88ec458e40b9e941b0a11a477c00953af451571cbc",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "개인 경계와 조용한 관계를 존중하는 접점이 있다. 서로 말이 적어도 이해했다고 가정하지 않는다.",
    "difference": "미래 의미의 해석과 지금의 가치·감각 수용이 다를 수 있음",
    "directionalContribution": "현재 선택의 장기 의미를 함께 살피기",
    "targetContribution": "큰 해석이 놓친 현재의 불편을 알리기",
    "friction": {
      "condition": "상대의 침묵에 의미를 대신 붙일 때",
      "sourceIntentionCandidate": "의도를 이해하려는 조심스러운 해석",
      "targetMayMisreadSource": "마음을 정해버리는 말로 읽힐 가능성",
      "targetIntentionCandidate": "느낌을 정리하는 침묵",
      "sourceMayMisreadTarget": "동의 또는 거절로 잘못 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "추측을 사실처럼 말하지 않았는가?",
      "targetQuestion": "짧게라도 필요한 시간을 알렸는가?",
      "jointAgreement": "해석 대신 확인 질문 하나를 사용",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "같은 조용함이 같은 감정은 아님",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ISFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 작품을 보며 각자의 느낌을 직접 듣는 장면"
      },
      {
        "id": "mpj:INFJ:ISFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "미래 약속에 현재 불편한 조건부터 묻는 장면"
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
    "counterexample": "표정·기운으로 감정을 알아낸다는 주장 제외",
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
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ISFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ESTP",
    "sourceType": "INFJ",
    "targetType": "ESTP",
    "jointReviewId": "mpj:INFJ:ESTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "953872c6f5ff4bedb10a5f58d19fccf156de03ed94e4c1a0363184c43de4e187",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "5ab345f1eb82e8871f7e21871185ac93502a0b1b3bbbe299388a5d249b13f738",
      "label": "같은 Beta 그룹의 감각과 통찰 보완",
      "sourceRelationName": "Beta Comfort",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "생각한 방향을 실제 상황에서 확인하는 접점을 만들 수 있다. 행동의 자료와 사람의 의미를 함께 살핀다.",
    "difference": "숙고하는 맥락과 현장의 즉각 반응이 다를 수 있음",
    "directionalContribution": "빠른 시도가 당사자에게 갖는 영향을 질문",
    "targetContribution": "가설의 현실 적용 여부를 확인",
    "friction": {
      "condition": "충분한 동의 없이 활동을 재촉하거나 경험 전 해석을 고정할 때",
      "sourceIntentionCandidate": "의미를 검토하는 유보",
      "targetMayMisreadSource": "행동을 막는 망설임으로 읽힐 가능성",
      "targetIntentionCandidate": "현장을 확인하려는 즉시 제안",
      "sourceMayMisreadTarget": "자극을 강요하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "작은 경험으로 확인할 부분이 있는가?",
      "targetQuestion": "참여 범위와 중단권을 물었는가?",
      "jointAgreement": "선택 가능한 작은 활동 뒤 각자 해석을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "조용한 비전과 현장 경험이 서로의 오류를 줄일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ESTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "행사 동선을 체험하며 참여자의 부담을 확인하는 장면"
      },
      {
        "id": "mpj:INFJ:ESTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "농담의 의도보다 상대가 원하는 중단을 먼저 듣는 장면"
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
    "counterexample": "반대 선호를 자동 끌림·최적 보완으로 승인하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ESTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INFJ:ESFP",
    "sourceType": "INFJ",
    "targetType": "ESFP",
    "jointReviewId": "mpj:INFJ:ESFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "20d4c39ef86dccc8c3aab3eeb61b25e7147868635b2b98bf1f9984035d40beda",
      "label": "반-이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFP.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "ce58ac131537053c6ab97faf449a0b4711c183e951405a7603f3575de57f2850",
      "label": "깊이-표현 보완 관계",
      "sourceRelationName": "Inferred Depth-Expression Complement",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "개인의 경험에 의미를 붙이고 나눌 수 있다. 즐거움과 깊이를 서로 다른 가치로 존중한다.",
    "difference": "조용히 의미를 숙고하는 시간과 직접 경험을 표현하는 시간이 다를 수 있음",
    "directionalContribution": "즐거운 제안이 원하는 방향과 맞는지 질문",
    "targetContribution": "추상적 해석에 실제 경험의 반응을 더함",
    "friction": {
      "condition": "활동 참여를 재촉하거나 경험을 깊이 없는 것으로 평가할 때",
      "sourceIntentionCandidate": "생각할 공간을 지키는 유보",
      "targetMayMisreadSource": "함께할 마음이 없다는 뜻으로 읽힐 가능성",
      "targetIntentionCandidate": "경험을 함께 나누는 초대",
      "sourceMayMisreadTarget": "자기 리듬을 침범하는 요구로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "가능한 참여 방식을 말했는가?",
      "targetQuestion": "거절할 수 있는 초대였는가?",
      "jointAgreement": "활동과 조용한 시간을 모두 선택 가능하게 둠",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "함께 말하지 않는 시간도 만남의 일부가 될 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFJ:ESFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "전시 관람 후 말할지 혼자 감상할지 고르는 장면"
      },
      {
        "id": "mpj:INFJ:ESFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "모임 뒤 쉬는 날과 다음 만남을 분리하는 장면"
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
    "counterexample": "현재 즐거움과 미래 의미 중 우월한 기준을 정하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INFJ",
      "user-source:ESFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  }
] as const satisfies readonly MbtiPairResearch[];
