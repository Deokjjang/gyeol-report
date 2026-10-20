import type { MbtiPairResearch } from "./mbtiPairResearchTypes";

export const MBTI_PAIR_RESEARCH_ENFJ = [
  {
    "id": "mpr:ENFJ:INTJ",
    "sourceType": "ENFJ",
    "targetType": "INTJ",
    "jointReviewId": "mpj:INTJ:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "d4627bd77ff529c704845a5195fb8bf33abe8ac77f4402006e2734931010c315",
      "label": "사제 관계",
      "sourceRelationName": "Pedagogy",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "d07e061f0276e54945b7fb51a6ca8ac62937b8c71ffde7e4f75debec384458f4",
      "label": "흥미로운 관계",
      "sourceRelationName": "Interesting",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "미래의 방향을 함께 생각할 수 있다. 계획의 타당성과 당사자의 참여 의사를 동시에 확인하면 접점이 넓어진다.",
    "difference": "독립 검토 시간과 관계 속에서 함께 방향을 말하는 시간이 다를 수 있음",
    "directionalContribution": "계획을 받아들일 사람의 의견과 참여 조건을 확인",
    "targetContribution": "공동 비전의 실행 제약과 우선순위를 분명히 함",
    "friction": {
      "condition": "침묵을 참여 거절로 보거나 잦은 확인을 간섭으로 단정할 때",
      "sourceIntentionCandidate": "함께 미래를 맞추려는 감정 확인",
      "targetMayMisreadSource": "자율 시간을 계속 침범하는 요구로 읽힐 가능성",
      "targetIntentionCandidate": "혼자 판단을 정리하려는 거리두기",
      "sourceMayMisreadTarget": "관계에 관심이 없는 반응으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "확인 질문을 거절할 자유도 주었는가?",
      "targetQuestion": "돌아와 이야기할 때를 알렸는가?",
      "jointAgreement": "개인 검토 시간 뒤 공동 대화 시간을 합의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "명료한 계획만으로도 지지할 수 있지만 감사 표현을 대신하지는 못함",
    "fictionalScenes": [
      {
        "id": "mpj:INTJ:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 목표 회의 전에 각자 생각을 적어 오는 장면"
      },
      {
        "id": "mpj:INTJ:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "혼자 쉬는 날에도 짧은 안부 방식만 서로 고르는 장면"
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
    "counterexample": "실제 연락·대화 선호가 다르면 E/I만으로 빈도 배정 금지",
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
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:INTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:INTP",
    "sourceType": "ENFJ",
    "targetType": "INTP",
    "jointReviewId": "mpj:INTP:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "780bf11f043b16c3a15a07cb19574359dd184a82e697a0670ce3e987d65dd3a8",
      "label": "반이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "14a6596211c2fee58e7fb91272631854b07ae36adf2b2d7c6c265e2a890a82a1",
      "label": "분석과 관계 리더십이 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "생각을 나누며 서로를 이해하려는 접점을 만들 수 있다. 참여를 돕는 질문도 응답할 시간에 대한 합의가 필요하다.",
    "difference": "사적 검토와 관계 속 감정 확인이 다른 리듬을 가질 수 있음",
    "directionalContribution": "검토가 사람에게 어떤 영향을 주는지 알리기",
    "targetContribution": "관계의 문제를 논리적 항목으로 정리",
    "friction": {
      "condition": "즉답·표현을 거듭 요구하거나 관계 질문을 모두 불필요로 볼 때",
      "sourceIntentionCandidate": "서로의 상태를 확인하려는 질문",
      "targetMayMisreadSource": "감정 반응을 강요하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "생각을 정리할 시간을 확보하는 짧은 답",
      "sourceMayMisreadTarget": "관심이 사라진 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 답하지 않을 권리를 인정했는가?",
      "targetQuestion": "돌아와 답할 때를 정할 수 있는가?",
      "jointAgreement": "짧은 상태 확인과 긴 대화 시간을 따로 합의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "따뜻한 반응을 즉시 하지 않아도 이해하려는 노력이 있을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 후 긴 대화 대신 나중에 생각을 보내기로 하는 장면"
      },
      {
        "id": "mpj:INTP:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "다음 만남을 잡을 때 개인 연구 시간도 함께 표시하는 장면"
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
    "counterexample": "실제 응답 선호를 묻지 않고 감정 노동을 한쪽에 배정하지 않음",
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
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:INTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ENTJ",
    "sourceType": "ENFJ",
    "targetType": "ENTJ",
    "jointReviewId": "mpj:ENTJ:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "9c0d8b50db3e1899b5f343d73f358a8a21d2a003f88d6be7920bdfb4bad1fe0d",
      "label": "흡사 관계",
      "sourceRelationName": "Look-alike",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "68a9138b14138311b4e3de2ad634f23ddad73545c1143f71fc7f7063bf5a218b",
      "label": "흡사 관계",
      "sourceRelationName": "Kindred",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람들과 공동 목표를 이루려는 관심이 겹친다. 목표의 완료와 참여자의 동의는 별도 점검 항목이다.",
    "difference": "결과 중심 피드백과 관계 영향 중심 조율이 다를 수 있음",
    "directionalContribution": "실행 과정에서 말하지 못한 부담을 확인",
    "targetContribution": "논의를 실제 책임과 일정으로 연결",
    "friction": {
      "condition": "서로의 조율 방식을 비효율 또는 냉정함으로 규정할 때",
      "sourceIntentionCandidate": "참여자의 마음을 확인하는 대화",
      "targetMayMisreadSource": "결정을 늦추는 우회로로 읽힐 가능성",
      "targetIntentionCandidate": "문제를 명료하게 바로잡는 직설",
      "sourceMayMisreadTarget": "사람을 성과로만 평가하는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "조율 뒤 결정할 기준을 제시했는가?",
      "targetQuestion": "반대 의견이 나올 통로를 남겼는가?",
      "jointAgreement": "결과 기준과 참여 조건을 함께 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "강한 리더십끼리도 듣기 역할을 번갈아 맡을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENTJ:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "팀 계획에서 산출물과 참여 부담을 따로 검토하는 장면"
      },
      {
        "id": "mpj:ENTJ:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "모임을 조직하며 진행과 의견 수렴을 나누는 장면"
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
    "counterexample": "공식 역할·권한은 유형으로 배정하지 않음",
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
        "C_DISTINCT_SOCIONICS_TERM_FAMILIES_MAPPING_UNVERIFIED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:ENTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ENTP",
    "sourceType": "ENFJ",
    "targetType": "ENTP",
    "jointReviewId": "mpj:ENTP:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "93e218aa8ae609187236a0f943dad345d65cab46e0d77e415acc384adc8ce503",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTP.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "982fd4e23e02ee80a316bfb2bac5ee5cde1469cdbd0e7f436795b7061cadee9f",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람과 대화 속에서 가능성을 확장할 접점이 있다. 활발한 대화에도 누가 부담을 떠안는지 점검한다.",
    "difference": "논리를 흔드는 재미와 관계 영향을 조율하는 목적이 다를 수 있음",
    "directionalContribution": "아이디어가 실제 참여로 이어질 조건 확인",
    "targetContribution": "집단 합의의 다른 선택지를 드러내기",
    "friction": {
      "condition": "공개 반론에 누군가의 체면·선택권이 걸릴 때",
      "sourceIntentionCandidate": "참여자의 마음을 돌보는 중재",
      "targetMayMisreadSource": "의견을 막는 분위기 관리로 읽힐 가능성",
      "targetIntentionCandidate": "생각을 움직이는 장난",
      "sourceMayMisreadTarget": "관계를 무시하는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "중재가 실제 이견을 지우지 않는가?",
      "targetQuestion": "반론의 장소와 동의를 골랐는가?",
      "jointAgreement": "아이디어 평가와 당사자 존중을 따로 확인",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "좋은 분위기 안에서도 반대 의견이 필요",
    "fictionalScenes": [
      {
        "id": "mpj:ENTP:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 안건을 새로 제안하되 참여 부담을 묻는 장면"
      },
      {
        "id": "mpj:ENTP:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "한 사람이 계속 수습할 때 부담을 나누는 장면"
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
    "counterexample": "정서 조율을 고정 역할로 배정하지 않음",
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
      "user-source:ENFJ",
      "user-source:ENTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:INFJ",
    "sourceType": "ENFJ",
    "targetType": "INFJ",
    "jointReviewId": "mpj:INFJ:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "c92ef7e96364ac5ba69e404cedc3dccce73a4fbf941dfcc03504a923a5ca3497",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "fcce50086087c3066d2126251c2da437879e03ea925baaaad82592b10909faba",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "공동 비전과 사람의 영향을 중시하는 접점이 있다. 관계의 폭과 깊이를 같은 기준으로 재단하지 않는다.",
    "difference": "혼자 정리하는 시간과 모임 속 조율의 속도가 다를 수 있음",
    "directionalContribution": "개별 생각이 공동 참여로 이어질 통로 제공",
    "targetContribution": "활동의 목적과 당사자의 작은 부담을 깊게 질문",
    "friction": {
      "condition": "모임 확장을 모두에게 당연한 선택으로 제시할 때",
      "sourceIntentionCandidate": "다른 사람도 참여시키려는 초대",
      "targetMayMisreadSource": "개인 경계를 넓히는 압박으로 읽힐 가능성",
      "targetIntentionCandidate": "소수와 깊게 나누려는 선택",
      "sourceMayMisreadTarget": "관계 확장을 거부하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "초대와 의무를 구분했는가?",
      "targetQuestion": "참여하지 않아도 지지할 방식을 말했는가?",
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
      "user-source:ENFJ",
      "user-source:INFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:INFP",
    "sourceType": "ENFJ",
    "targetType": "INFP",
    "jointReviewId": "mpj:INFP:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "a19376126fef3ac86eb240a63eaa67855739c382cf82b3ac42e636625a6d5e0b",
      "label": "대척 관계",
      "sourceRelationName": "Contrary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFP.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "eca981c09641f3ad51204fa380f57288b9e85802ee0daf6711941459949e006c",
      "label": "반대 관계",
      "sourceRelationName": "Contrary",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람의 마음과 관계의 의미를 중요하게 볼 접점이 있다. 공동 조화와 개인 동의를 함께 확보한다.",
    "difference": "내적 가치의 수용과 사람들 사이의 조율이 다를 수 있음",
    "directionalContribution": "개인 생각이 공동 행동으로 이어질 통로 제공",
    "targetContribution": "집단 합의가 놓친 개인 경계를 드러내기",
    "friction": {
      "condition": "좋은 취지라는 이유로 참여를 기대할 때",
      "sourceIntentionCandidate": "관계를 위해 설득하는 말",
      "targetMayMisreadSource": "개인 선택을 교정하는 압박으로 읽힐 가능성",
      "targetIntentionCandidate": "자기 기준을 지키는 유보",
      "sourceMayMisreadTarget": "모두의 노력을 거부하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "개별 동의를 다시 받았는가?",
      "targetQuestion": "거절 조건을 분명히 말했는가?",
      "jointAgreement": "공동 목표와 참여 방식은 따로 동의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "따뜻한 설득도 원치 않으면 거절할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFP:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "봉사 모임의 취지에는 동의하되 역할은 고르는 장면"
      },
      {
        "id": "mpj:INFP:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "관계 고민에서 조율보다 경청을 먼저 요청하는 장면"
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
    "counterexample": "다수의 조화를 개인 경계보다 우선해야 한다고 결론 금지",
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
      "termFamily": "extinguishment",
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
      "user-source:ENFJ",
      "user-source:INFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ENFJ",
    "sourceType": "ENFJ",
    "targetType": "ENFJ",
    "jointReviewId": "mpj:ENFJ:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "e57ee65a5251dc60a686ed66ee4e994deba5c4983b26245e15fa6e057bd1f46f",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "e57ee65a5251dc60a686ed66ee4e994deba5c4983b26245e15fa6e057bd1f46f",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람들과 의미 있는 미래를 나누려는 접점이 있다. 함께 챙기는 마음도 부담을 대신 정할 권리는 아니다.",
    "difference": "개별 필요·참여 범위는 같은 유형으로 알 수 없음",
    "directionalContribution": "자기 부담을 말해 공동 조율의 자료 제공",
    "targetContribution": "상대가 말하지 않은 의견을 질문으로 확인",
    "friction": {
      "condition": "둘 다 분위기를 위해 반대를 숨길 때",
      "sourceIntentionCandidate": "관계를 편하게 하려는 양보",
      "targetMayMisreadSource": "실제 동의로 읽힐 가능성",
      "targetIntentionCandidate": "함께 해결하려는 반복 확인",
      "sourceMayMisreadTarget": "혼자 쉴 권리를 줄이는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "내가 맡을 수 있는 선을 말했는가?",
      "targetQuestion": "상대의 거절도 들었는가?",
      "jointAgreement": "돌봄과 조율의 담당을 번갈아 맡음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "좋은 분위기에도 이견은 존재할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ENFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임 운영에서 맡을 일과 쉬는 날을 정하는 장면"
      },
      {
        "id": "mpj:ENFJ:ENFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "감정 대화를 쉬어도 되는 신호를 고르는 장면"
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
    "counterexample": "두 사람 모두 공감 능력이 높다고 보증하지 않음",
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
      "user-source:ENFJ",
      "user-source:ENFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ENFP",
    "sourceType": "ENFJ",
    "targetType": "ENFP",
    "jointReviewId": "mpj:ENFJ:ENFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "be8b68a042df1e6b4f1c1c3767f383dc36f4513a8bdeddce603499a787439f60",
      "label": "거짓 동일 관계",
      "sourceRelationName": "Quasi-Identity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "0576c11bc8317f57dc652e6958144b909f0e60352426558ae519ffa1cbc773a9",
      "label": "거짓 동일 관계",
      "sourceRelationName": "False Identical",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "새로운 사람과 의미를 연결하는 활기가 접점이다. 공동 방향과 탐색의 자유를 따로 합의한다.",
    "difference": "관계의 방향을 맞추는 흐름과 가능성을 열어두는 흐름이 다를 수 있음",
    "directionalContribution": "여러 제안을 공동 목표와 참여로 연결",
    "targetContribution": "고정된 목표에 다른 이야기와 경로 제시",
    "friction": {
      "condition": "관심 표현이 곧 장기 약속으로 취급될 때",
      "sourceIntentionCandidate": "관계의 다음 방향을 확인하는 질문",
      "targetMayMisreadSource": "자유로운 탐색을 묶는 요구로 읽힐 가능성",
      "targetIntentionCandidate": "흥미로운 가능성을 나누는 말",
      "sourceMayMisreadTarget": "확정을 피하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "제안과 약속을 구분했는가?",
      "targetQuestion": "맡은 일과 새 흥미를 나눴는가?",
      "jointAgreement": "확정한 약속과 후보 활동을 따로 적음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "닮은 밝은 표현도 관계 책임의 뜻은 다를 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ENFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 모임의 목적과 선택 활동을 나누는 장면"
      },
      {
        "id": "mpj:ENFJ:ENFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "다음 만남을 잡으며 각자의 여백을 확인하는 장면"
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
    "counterexample": "표현의 열기로 미래 헌신을 예측하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:ENFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ISTJ",
    "sourceType": "ENFJ",
    "targetType": "ISTJ",
    "jointReviewId": "mpj:ENFJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "cb5ff1e97985f2d51f50b32904b3f1ecd4dda7c342cdd57702df01b338c0f137",
      "label": "갈등 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "7ebe89b60facf72f99aa5a77fe75aa27d03a2e57712d0faf158fc9e0b86297ba",
      "label": "갈등 관계",
      "sourceRelationName": "Conflicting",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "지키고 싶은 관계를 실제 책임으로 연결할 접점이 있다. 약속 이행과 정서 확인을 서로 대신하지 않는다.",
    "difference": "마음을 말로 맞추는 과정과 기록·행동의 신뢰가 다를 수 있음",
    "directionalContribution": "실행 과정의 참여 부담을 확인",
    "targetContribution": "공동 방향을 일정과 역할로 정리",
    "friction": {
      "condition": "행동했으니 표현은 필요 없거나 표현이 없으니 관심 없다고 볼 때",
      "sourceIntentionCandidate": "감정을 함께 확인하려는 대화",
      "targetMayMisreadSource": "책임 외 요구가 늘어나는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "약속을 지켜 지지하는 행동",
      "sourceMayMisreadTarget": "정서 요구를 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "원하는 표현을 구체적으로 말했는가?",
      "targetQuestion": "상대의 수고와 별개로 마음을 들었는가?",
      "jointAgreement": "실무 점검과 안부를 별도로 고름",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "적은 말도 지지일 수 있으나 표현 요청을 지우지는 못함",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "기념일 준비와 원하는 반응을 따로 묻는 장면"
      },
      {
        "id": "mpj:ENFJ:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공동 일정 뒤 감당한 부담을 직접 확인하는 장면"
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
    "counterexample": "책임감·배려의 우열을 유형으로 정하지 않음",
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
      "user-source:ENFJ",
      "user-source:ISTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ISFJ",
    "sourceType": "ENFJ",
    "targetType": "ISFJ",
    "jointReviewId": "mpj:ENFJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "6f3f77258e950d4af75b4a63c53d5a16c882fb4918ee548229ad28aa37c99dc7",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "afdfe234ad109aa6cbc55439b9fc590d3f0d6e996a8f4a746a08ee7efde6911d",
      "label": "조용한 보호와 적극적 선도가 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "배려와 관계 책임을 중시하는 접점이 있다. 보호하려는 마음에도 상대의 선택권이 필요하다.",
    "difference": "관계를 넓히는 조율과 익숙한 세부를 챙기는 안정이 다를 수 있음",
    "directionalContribution": "조용한 필요를 공동 논의로 가져오기",
    "targetContribution": "공동 비전을 작은 준비와 생활 약속으로 연결",
    "friction": {
      "condition": "개선·참여를 권하며 거절을 놓칠 때",
      "sourceIntentionCandidate": "더 나은 관계를 위한 설득",
      "targetMayMisreadSource": "기존 수고를 고치려는 평가로 읽힐 가능성",
      "targetIntentionCandidate": "마찰을 피하는 조심스러운 답",
      "sourceMayMisreadTarget": "동의하는 반응으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "도움을 요청받았는가?",
      "targetQuestion": "한계를 직접 알렸는가?",
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
      "termFamily": "supervision",
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
      "user-source:ENFJ",
      "user-source:ISFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ESTJ",
    "sourceType": "ENFJ",
    "targetType": "ESTJ",
    "jointReviewId": "mpj:ENFJ:ESTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "14bcc83711b893596ea9a524e0d31ae995a891c5d588e427bcd382172d4731a3",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "d41ffc64fd4388fec02e853b4a1afd5708a77bf4d44ab04cdf73419c68e7259e",
      "label": "공동체 지향은 맞지만 기준이 다른 관계",
      "sourceRelationName": "Different Leadership Values",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "공동 일을 이끌고 책임을 분명히 할 접점이 있다. 관계의 동의와 결과 기준을 함께 확인한다.",
    "difference": "사람의 상황을 고려하는 설득과 사실·결과 중심 판단이 다를 수 있음",
    "directionalContribution": "명확한 기준이 참여자에게 전달되는 방식을 확인",
    "targetContribution": "따뜻한 목표를 완료 조건으로 정리",
    "friction": {
      "condition": "피드백을 서로 분위기 관리 또는 냉정한 지시로 볼 때",
      "sourceIntentionCandidate": "수용을 돕는 완곡한 조율",
      "targetMayMisreadSource": "문제를 흐리는 말로 읽힐 가능성",
      "targetIntentionCandidate": "결과를 바로잡는 직접 지적",
      "sourceMayMisreadTarget": "사람을 평가하는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "수정할 행동을 분명히 했는가?",
      "targetQuestion": "지적의 영향도 들었는가?",
      "jointAgreement": "수정 기준과 전달 방식을 각각 합의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "따뜻한 태도도 책임 기준을 명료하게 할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ESTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 행사에서 피드백의 장소와 항목을 정하는 장면"
      },
      {
        "id": "mpj:ENFJ:ESTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "마감 부담을 호소할 때 실제 조정안을 같이 적는 장면"
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
    "counterexample": "리더십 자격을 성향으로 판정하지 않음",
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
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:ESTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ESFJ",
    "sourceType": "ENFJ",
    "targetType": "ESFJ",
    "jointReviewId": "mpj:ENFJ:ESFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "467419fffdb2215f967065467a6d0db95d77fea0f89ba1dd50d13dc36076a5c3",
      "label": "비교 관계",
      "sourceRelationName": "Comparative",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "567d4b766b3c906dbbcdf4b2a4ee605a34e02a7b96ef8b4051dd7d7001decbf4",
      "label": "비교 관계",
      "sourceRelationName": "Comparative",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "참여감과 관계의 따뜻함을 유지하려는 접점이 있다. 챙기는 방식이 달라도 상대의 의사를 먼저 묻는다.",
    "difference": "미래의 공동 의미와 현재 생활의 안부·절차가 다를 수 있음",
    "directionalContribution": "익숙한 모임의 장기 목적을 질문",
    "targetContribution": "비전을 실제 준비와 연락으로 연결",
    "friction": {
      "condition": "둘 다 분위기를 위해 필요한 이견을 미룰 때",
      "sourceIntentionCandidate": "방향을 바꾸려는 의미 질문",
      "targetMayMisreadSource": "현재 수고를 낮추는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "안정을 지키려는 세부 확인",
      "sourceMayMisreadTarget": "큰 방향을 막는 형식으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "수고를 인정하며 목적을 물었는가?",
      "targetQuestion": "현재 방식이 계속 필요한가?",
      "jointAgreement": "이견 하나를 공개하고 바꿀 항목을 고름",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "사람을 위하는 목적도 다른 선택으로 이어질 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ESFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "정기 모임의 목적과 준비 부담을 재검토하는 장면"
      },
      {
        "id": "mpj:ENFJ:ESFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "행사 뒤 감사와 불편함을 따로 말하는 장면"
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
    "counterexample": "갈등이 적다는 이유로 성장·만족을 보증하지 않음",
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
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ENFJ",
      "user-source:ESFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ISTP",
    "sourceType": "ENFJ",
    "targetType": "ISTP",
    "jointReviewId": "mpj:ENFJ:ISTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "82a30cbee6954a603592e8e093511bd8d498a5294736f3107e73bcca5597b17e",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTP.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "88e65a90aac6efb846e8afbe0890df01aea9b27d8ce01126eb782499c015d8aa",
      "label": "편안한 집단 관계",
      "sourceRelationName": "Beta comfort",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "서로 필요한 도움의 형태를 묻는 데 접점을 만들 수 있다. 감정 대화와 실용적 해결은 선택지로 둔다.",
    "difference": "관계를 말로 확인하는 흐름과 간결한 해결·자율이 다를 수 있음",
    "directionalContribution": "실용 해법의 당사자 영향을 전달",
    "targetContribution": "큰 관계 고민에서 지금 바꿀 행동을 찾기",
    "friction": {
      "condition": "잦은 감정 확인 또는 해결만 주는 답이 반복될 때",
      "sourceIntentionCandidate": "연결을 확인하는 질문",
      "targetMayMisreadSource": "개인 시간을 관리하는 요구로 읽힐 가능성",
      "targetIntentionCandidate": "실제로 도우려는 짧은 해법",
      "sourceMayMisreadTarget": "마음을 덮는 반응으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 대화할 수 있는지 물었는가?",
      "targetQuestion": "먼저 들어주기를 원하는가?",
      "jointAgreement": "짧은 상태 확인과 선택한 도움을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "활동을 함께하는 것도 관계 확인의 방식일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ISTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 취미 뒤 대화할 양을 서로 고르는 장면"
      },
      {
        "id": "mpj:ENFJ:ISTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "고민에 듣기·실행 도움 중 하나를 선택하는 장면"
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
    "counterexample": "정서 노동과 수리 역할을 자동 배정하지 않음",
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
      "user-source:ENFJ",
      "user-source:ISTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ISFP",
    "sourceType": "ENFJ",
    "targetType": "ISFP",
    "jointReviewId": "mpj:ENFJ:ISFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "ecd925b759b02c7808eb3ab019c78371988e6018db867d52ef16446ec141c574",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFP.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "16aec1b428f572b47190276a8bba43fb8997fdb7a739aabeb5faa219a2957d58",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람을 존중하고 다정한 관계를 원할 접점이 있다. 보호나 조율이 개인 선택을 대신하지 않게 한다.",
    "difference": "관계를 말로 이끄는 흐름과 조용히 가치를 확인하는 흐름이 다를 수 있음",
    "directionalContribution": "원하는 마음을 공동 대화에 담도록 돕기",
    "targetContribution": "좋은 취지의 계획이 개인 선을 넘는지 질문",
    "friction": {
      "condition": "상대가 말하기 전 해석·도움을 정해줄 때",
      "sourceIntentionCandidate": "관계를 개선하려는 권유",
      "targetMayMisreadSource": "선택을 교정하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "마음을 정리하는 침묵",
      "sourceMayMisreadTarget": "더 설득해도 된다는 신호로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대의 답을 기다렸는가?",
      "targetQuestion": "원치 않는 도움을 말할 수 있는가?",
      "jointAgreement": "도움은 요청 범위 안에서만 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "부드러운 관계에도 분명한 거절권이 필요",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ISFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 활동에서 공개 참여와 개인 역할을 고르는 장면"
      },
      {
        "id": "mpj:ENFJ:ISFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "조언을 멈춰 달라는 요청을 이유 없이도 존중하는 장면"
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
    "counterexample": "침묵을 숨은 동의로 쓰지 않음",
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
      "user-source:ENFJ",
      "user-source:ISFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ESTP",
    "sourceType": "ENFJ",
    "targetType": "ESTP",
    "jointReviewId": "mpj:ENFJ:ESTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "a4591e42a78343bd5db260f5c33bf6d05f57eaf43d494a42f6d7a93b7da0401a",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTP.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "2d89a77cccb2229e5f02a6913edde9a264fdad2c7e1122f1373a7a7a1d1eadc0",
      "label": "같은 Beta 그룹의 사람 중심 활동 관계",
      "sourceRelationName": "Beta Comfort",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사람과 현장을 움직이는 활기가 접점이다. 관계의 의미와 활동의 재미는 함께 확인할 수 있다.",
    "difference": "공동 방향을 말로 맞추는 과정과 즉시 경험하는 속도가 다를 수 있음",
    "directionalContribution": "행동의 참여 조건과 관계 영향을 확인",
    "targetContribution": "말한 목표가 현장에서 맞는지 자료 제공",
    "friction": {
      "condition": "재미있는 제안을 관계의 동의 없이 실행할 때",
      "sourceIntentionCandidate": "함께할 의미를 확인하는 질문",
      "targetMayMisreadSource": "활동을 제한하는 잔소리로 읽힐 가능성",
      "targetIntentionCandidate": "활력을 나누는 빠른 제안",
      "sourceMayMisreadTarget": "관계 점검을 피하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "참여자의 실제 선택을 들었는가?",
      "targetQuestion": "활동 뒤 남을 책임을 정했는가?",
      "jointAgreement": "활동의 동의·비용·정리를 같이 확인",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "같은 활기도 서로 다른 회복 시간을 필요로 할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ESTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임의 새 활동 전에 참여·중단 방식을 고르는 장면"
      },
      {
        "id": "mpj:ENFJ:ESTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "농담이 불편할 때 바로 멈추는 규칙을 정하는 장면"
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
    "counterexample": "반응의 활기로 관계 만족을 추정하지 않음",
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
      "user-source:ENFJ",
      "user-source:ESTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ENFJ:ESFP",
    "sourceType": "ENFJ",
    "targetType": "ESFP",
    "jointReviewId": "mpj:ENFJ:ESFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "c3c084a61cf0db4f8bc28a33d2a0758364f367113f8d2f8cc27eb45588e53a43",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "a737c3f5c3f7451c777fd841c0a3b4471c4a5bfdae8823a3b303423dd42b6c8d",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_direct",
    "sharedGround": "마음을 표현하고 함께 경험하는 따뜻함이 접점이다. 보호와 표현이 일방적인 맞춤으로 굳지 않게 한다.",
    "difference": "미래 방향을 함께 확인하는 흐름과 현재 경험의 즐거움이 다를 수 있음",
    "directionalContribution": "즐거운 경험을 지속할 조건을 정리",
    "targetContribution": "장기 계획에 현재의 실제 만족을 더함",
    "friction": {
      "condition": "한쪽이 관계의 방향을 정하고 다른 쪽은 계속 기쁘게 할 때",
      "sourceIntentionCandidate": "함께 성장하려는 조언",
      "targetMayMisreadSource": "삶을 관리하는 평가로 읽힐 가능성",
      "targetIntentionCandidate": "즐거움을 나누는 표현",
      "sourceMayMisreadTarget": "진지한 문제를 피하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대가 원한 변화인가?",
      "targetQuestion": "원하는 관계 방향도 말했는가?",
      "jointAgreement": "목표와 오늘 원하는 경험을 따로 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "기쁘게 하는 행동에도 거절할 자유가 필요",
    "fictionalScenes": [
      {
        "id": "mpj:ENFJ:ESFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 약속의 목적과 즐길 활동을 함께 정하는 장면"
      },
      {
        "id": "mpj:ENFJ:ESFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "피곤한 날 표현을 줄여도 되는지 묻는 장면"
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
    "counterexample": "고정된 보호자·수혜자 역할을 승인하지 않음",
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
      "user-source:ENFJ",
      "user-source:ESFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  }
] as const satisfies readonly MbtiPairResearch[];
