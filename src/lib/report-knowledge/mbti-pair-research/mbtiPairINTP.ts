import type { MbtiPairResearch } from "./mbtiPairResearchTypes";

export const MBTI_PAIR_RESEARCH_INTP = [
  {
    "id": "mpr:INTP:INTJ",
    "sourceType": "INTP",
    "targetType": "INTJ",
    "jointReviewId": "mpj:INTJ:INTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "42db8402f72f7d4efd266db9a0ef824cf0c3f27d739d902520aa08371430ca7f",
      "label": "준동일 관계",
      "sourceRelationName": "Quasi-Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "5a125cc720eaf22fa36b6ecabde8d5fcbb7c2a53b37eb15e22673e3445ca377e",
      "label": "무난한 친선 관계",
      "sourceRelationName": "Friendly",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "원리와 논리를 오래 다룰 수 있다는 접점이 있다. 탐구의 재미와 결정을 내려야 하는 책임은 별도다.",
    "difference": "INTJ의 방향 설정과 INTP의 가설 확장이 같은 토론 안에서 다른 종료 기준이 될 수 있음",
    "directionalContribution": "닫힌 계획에 반례를 던져 적용 범위 과신을 줄임",
    "targetContribution": "여러 가설 중 이번에 시험할 범위를 정하는 기준 제공",
    "friction": {
      "condition": "확정된 일정 직전에 새로운 가설이 추가될 때",
      "sourceIntentionCandidate": "아직 검토하지 못한 가능성을 남기는 질문",
      "targetMayMisreadSource": "이미 한 합의를 피하는 태도로 들릴 가능성",
      "targetIntentionCandidate": "실행할 선택지를 좁히려는 정리",
      "sourceMayMisreadTarget": "생각을 더 하지 말라는 통제로 들릴 가능성"
    },
    "repair": {
      "sourceQuestion": "추가 질문이 마감에 주는 부담을 알렸는가?",
      "targetQuestion": "이번 결정에 꼭 필요한 검토만 골랐는가?",
      "jointAgreement": "탐색 시간과 확정 시간을 구분하고 미해결 가설은 별도 기록",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "토론을 멈추는 합의가 지적 교류를 보호할 수도 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTJ:INTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "주말 프로젝트에서 하나만 구현하고 다른 아이디어는 목록에 남기는 장면"
      },
      {
        "id": "mpj:INTJ:INTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "서로 조용히 쉬고 싶지만 공동 집안일 완료 시점을 따로 맞추는 장면"
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
    "counterexample": "실제 INTP가 빠르게 확정하거나 INTJ가 탐색을 선호하면 역할 재배치",
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
      "user-source:INTP",
      "user-source:INTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:INTP",
    "sourceType": "INTP",
    "targetType": "INTP",
    "jointReviewId": "mpj:INTP:INTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "f3c3ca726a9e76e07a9a8ef23f154e6b265f0273c2d5c76cebf83a2ad2f253f9",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "f3c3ca726a9e76e07a9a8ef23f154e6b265f0273c2d5c76cebf83a2ad2f253f9",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "논리와 가설을 오래 탐색하는 대화가 편할 수 있다. 조용한 공존과 공동 책임의 완료는 다른 문제다.",
    "difference": "같은 유형이라는 정보로 누가 더 미루거나 빠르게 답할지 배정할 수 없음",
    "directionalContribution": "자기 모델을 설명해 상대의 반례 검토를 돕기",
    "targetContribution": "상대가 생략한 전제를 질문해 가설을 다듬기",
    "friction": {
      "condition": "둘 다 생각할 시간을 원하지만 공동 일정은 다가올 때",
      "sourceIntentionCandidate": "납득할 설명을 더 찾는 유보",
      "targetMayMisreadSource": "약속을 맡을 의사가 없다고 읽힐 가능성",
      "targetIntentionCandidate": "개인 탐구 공간을 지키는 거리두기",
      "sourceMayMisreadTarget": "관계 자체에 관심이 없다고 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "생각 중인 일과 맡은 일을 구분했는가?",
      "targetQuestion": "지금 가능한 응답과 나중에 할 검토를 나눴는가?",
      "jointAgreement": "탐구는 열어두고 공동 과제 완료는 각자 확인",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "말이 적어 편해도 같은 필요를 가진다고 추정할 수 없음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:INTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "두 사람이 관심 주제를 연구하되 발표 담당을 따로 정하는 장면"
      },
      {
        "id": "mpj:INTP:INTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "조용한 휴일에 청소 범위를 직접 나누는 장면"
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
    "counterexample": "실제 실행 습관은 학습·환경에 따라 다르므로 동일 약점 가정 금지",
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
      "user-source:INTP",
      "user-source:INTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ENTJ",
    "sourceType": "INTP",
    "targetType": "ENTJ",
    "jointReviewId": "mpj:INTP:ENTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "697c391f5775aada8a532f208b2785773d7a885974380223b84e5ef56f7a78c6",
      "label": "반대 관계",
      "sourceRelationName": "Contrary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "307a3404c5ba218a109e2919131a1341494c5b35cfbbfc6d36bb9c3f314a9aa2",
      "label": "대척 관계",
      "sourceRelationName": "Contrary",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "논리와 해결 가능성을 검토하는 관심이 만날 수 있다. 검토의 깊이가 실행의 속도와 다를 때 서로의 자료를 보완한다.",
    "difference": "INTP의 내부 납득 시간과 ENTJ의 실행 결정 시점이 다를 수 있음",
    "directionalContribution": "추진안의 논리적 빈틈을 발견",
    "targetContribution": "검토를 실제 선택과 책임으로 연결",
    "friction": {
      "condition": "회의 중 즉답을 재촉하거나 결정 뒤 질문을 계속 추가할 때",
      "sourceIntentionCandidate": "납득할 전제를 확인하는 질문",
      "targetMayMisreadSource": "진행을 방해하는 반대로 읽힐 가능성",
      "targetIntentionCandidate": "기회를 놓치지 않으려는 결정",
      "sourceMayMisreadTarget": "생각할 권리를 빼앗는 지시로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "결정에 영향을 주는 질문인지 밝혔는가?",
      "targetQuestion": "검토할 자료를 미리 주었는가?",
      "jointAgreement": "사전 검토와 현장 결정을 구분하고 유보 사항 표시",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "질문을 줄이는 대신 먼저 받으면 실행도 빨라질 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ENTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "기획안 공유 후 다음 회의에서 실행 범위를 정하는 장면"
      },
      {
        "id": "mpj:INTP:ENTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "조언을 구할 때 해결책과 혼자 생각할 시간을 함께 고르는 장면"
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
    "counterexample": "직급상 명령을 관계 선호로 정당화하지 않음",
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
      "user-source:INTP",
      "user-source:ENTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ENTP",
    "sourceType": "INTP",
    "targetType": "ENTP",
    "jointReviewId": "mpj:INTP:ENTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "c13cd91533ac746a418b3a7ee82936abcc3d888df682e72beda7a1409e40622d",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTP.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "1602f8c1ccb9a7dcecee11c230adc2816aef6ca0b3b38f73f823c83389c262bb",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "가능성과 논리의 빈틈을 함께 다루는 놀이가 접점이다. 흥미로운 대화가 곧 공동 약속이라는 뜻은 아니다.",
    "difference": "혼자 가설을 정리하는 방식과 말로 가능성을 늘리는 방식이 다를 수 있음",
    "directionalContribution": "빠른 제안의 전제를 차분히 검토",
    "targetContribution": "혼자 고정한 모델에 다른 연결을 제안",
    "friction": {
      "condition": "계속 바뀌는 대화가 개인 검토를 끊거나 침묵을 무반응으로 볼 때",
      "sourceIntentionCandidate": "논리를 완성하려는 잠깐의 침묵",
      "targetMayMisreadSource": "흥미 없는 대화로 읽힐 가능성",
      "targetIntentionCandidate": "생각을 이어가려는 새 반론",
      "sourceMayMisreadTarget": "앞선 설명을 듣지 않은 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "검토 시간이 필요하다고 말했는가?",
      "targetQuestion": "새 주제 전에 앞선 생각을 마칠 틈을 주었는가?",
      "jointAgreement": "떠오른 생각은 기록하고 이번에 다룰 질문을 고름",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "대화 중단이 지적 거리두기가 아니라 탐구를 위한 조건일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ENTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 글의 주제를 정하며 보류 아이디어를 따로 저장하는 장면"
      },
      {
        "id": "mpj:INTP:ENTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "모임 뒤 혼자 정리한 의견을 나중에 나누는 장면"
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
    "counterexample": "말의 양을 이해력·친밀감의 척도로 쓰지 않음",
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
      "user-source:INTP",
      "user-source:ENTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:INFJ",
    "sourceType": "INTP",
    "targetType": "INFJ",
    "jointReviewId": "mpj:INTP:INFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "c65ff13e2f26d1b50a95645b36d6f127feabb0da4250b62701dbf89c8e4e9134",
      "label": "수혜자-후원자 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "f542efda509cfe4d1d15b6bc574fe829e7b12119fd2aaed86089f489031a7a20",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "표면의 설명을 넘어 이유를 탐색하는 관심이 만날 수 있다. 사실의 설명과 마음의 요청을 따로 듣는 것이 접점이다.",
    "difference": "논리적 결론을 원하는 대화와 의미·정서 맥락을 나누는 대화가 다를 수 있음",
    "directionalContribution": "막연한 해석의 가정과 대안을 확인",
    "targetContribution": "논리 검토에서 빠진 관계 영향을 질문",
    "friction": {
      "condition": "고민에 즉시 분석을 붙이거나 우회 표현을 정답 맞히기로 바꿀 때",
      "sourceIntentionCandidate": "문제의 원인을 정리하려는 질문",
      "targetMayMisreadSource": "마음을 평가하는 시험으로 읽힐 가능성",
      "targetIntentionCandidate": "상처를 줄이려는 간접 요청",
      "sourceMayMisreadTarget": "해결할 것이 없는 모호한 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "설명과 공감 중 무엇이 필요한지 물었는가?",
      "targetQuestion": "원하는 행동을 한 가지 직접 전했는가?",
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
      "user-source:INTP",
      "user-source:INFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:INFP",
    "sourceType": "INTP",
    "targetType": "INFP",
    "jointReviewId": "mpj:INTP:INFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "12496d46192eed232178d20491d539bcf3f4f7495b6ca1627682623f3222dc7d",
      "label": "유사 관계",
      "sourceRelationName": "Look-a-like",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "d1c14ea3860d2e65819b292a1ee9b9e9d82ea1ce96253feed8c307f0fc23335f",
      "label": "유사 관계",
      "sourceRelationName": "Look-a-like",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "혼자 생각할 공간과 가능성을 탐색하는 관심이 겹칠 수 있다. 서로의 기준을 논리와 가치 중 하나로 환원하지 않는다.",
    "difference": "논리적 납득과 내적 가치의 수용은 다른 판단 과정일 수 있음",
    "directionalContribution": "선택 이유의 앞뒤를 살펴 실행 대안을 찾기",
    "targetContribution": "논리적으로 가능한 안의 개인적 부담을 드러내기",
    "friction": {
      "condition": "가치 표현을 논증 부족으로 지적하거나 반론을 악의로 단정할 때",
      "sourceIntentionCandidate": "일관성을 검토하려는 질문",
      "targetMayMisreadSource": "자기 신념을 비웃는 말로 읽힐 가능성",
      "targetIntentionCandidate": "자신의 경계를 지키는 거절",
      "sourceMayMisreadTarget": "합리적 대화를 거부하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "질문이 가치 선택권을 침범하지 않는가?",
      "targetQuestion": "거절할 조건을 구체적으로 말했는가?",
      "jointAgreement": "설명 가능한 이유와 양보할 수 없는 선을 함께 적음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "같은 상상을 즐겨도 실제 결정에서 다른 답을 택할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:INFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "책 모임에서 작품의 논리와 개인적 의미를 따로 나누는 장면"
      },
      {
        "id": "mpj:INTP:INFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공동 선택을 앞두고 불편한 조건부터 확인하는 장면"
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
    "counterexample": "실제 가치관 일치·불일치는 MBTI로 정할 수 없음",
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
        "B_TERM_ALIAS_OR_LABEL_VARIANT",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INTP",
      "user-source:INFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ENFJ",
    "sourceType": "INTP",
    "targetType": "ENFJ",
    "jointReviewId": "mpj:INTP:ENFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "14a6596211c2fee58e7fb91272631854b07ae36adf2b2d7c6c265e2a890a82a1",
      "label": "분석과 관계 리더십이 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "780bf11f043b16c3a15a07cb19574359dd184a82e697a0670ce3e987d65dd3a8",
      "label": "반이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "생각을 나누며 서로를 이해하려는 접점을 만들 수 있다. 참여를 돕는 질문도 응답할 시간에 대한 합의가 필요하다.",
    "difference": "사적 검토와 관계 속 감정 확인이 다른 리듬을 가질 수 있음",
    "directionalContribution": "관계의 문제를 논리적 항목으로 정리",
    "targetContribution": "검토가 사람에게 어떤 영향을 주는지 알리기",
    "friction": {
      "condition": "즉답·표현을 거듭 요구하거나 관계 질문을 모두 불필요로 볼 때",
      "sourceIntentionCandidate": "생각을 정리할 시간을 확보하는 짧은 답",
      "targetMayMisreadSource": "관심이 사라진 것으로 읽힐 가능성",
      "targetIntentionCandidate": "서로의 상태를 확인하려는 질문",
      "sourceMayMisreadTarget": "감정 반응을 강요하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "돌아와 답할 때를 정할 수 있는가?",
      "targetQuestion": "지금 답하지 않을 권리를 인정했는가?",
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
      "user-source:INTP",
      "user-source:ENFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ENFP",
    "sourceType": "INTP",
    "targetType": "ENFP",
    "jointReviewId": "mpj:INTP:ENFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "18771e01e1b906c47aef415b5cd932fd43cadca8802ba0c5a0b6bf3b49ba4ed0",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFP.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "5909ece18bf69864110a319d4a897eeba48ff660edd782b5610a95b83356d540",
      "label": "사고 자극 관계",
      "sourceRelationName": "Inferred Intellectual Tension",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "새 연결과 가능성의 이야기가 활발해질 수 있다. 대화의 즐거움과 서로가 원하는 지지 방식은 구분한다.",
    "difference": "논리 검토의 질문과 의미·반응을 나누는 이야기가 다를 수 있음",
    "directionalContribution": "즐거운 아이디어의 가정과 제약을 확인",
    "targetContribution": "닫힌 탐구에 사람·이야기의 새 맥락을 더함",
    "friction": {
      "condition": "기쁜 제안을 즉시 반박하거나 검토 중에 주제를 계속 바꿀 때",
      "sourceIntentionCandidate": "가능성을 더 정확히 보려는 질문",
      "targetMayMisreadSource": "기쁨을 꺾는 흠잡기로 읽힐 가능성",
      "targetIntentionCandidate": "흥미를 함께 나누려는 이야기 전환",
      "sourceMayMisreadTarget": "집중을 방해하는 산만함으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금은 함께 기뻐할 때인지 물었는가?",
      "targetQuestion": "상대가 붙잡고 있는 질문을 들었는가?",
      "jointAgreement": "반응을 나누는 시간과 검토할 시간을 구분",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "가벼운 첫 반응 뒤에도 진지한 검토를 선택할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ENFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "새 취미 아이디어를 나눈 뒤 실제 일정은 별도로 정하는 장면"
      },
      {
        "id": "mpj:INTP:ENFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "서로의 관심 주제를 하나씩 번갈아 이야기하는 장면"
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
    "counterexample": "표현이 적다고 애정 부족·표현이 많다고 집중력 부족 단정 금지",
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
      "user-source:INTP",
      "user-source:ENFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ISTJ",
    "sourceType": "INTP",
    "targetType": "ISTJ",
    "jointReviewId": "mpj:INTP:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "86924c5271768aac3abb6060479ff0b7a760a185b3a7afd3f6bd6be023c65bc6",
      "label": "후원자-수혜자 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "60b55b4ce8ffa96674534d7cfec574f5dceafe681e92b5d8bf6509603f49b455",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "조용히 자기 일을 하고 정확한 근거를 보려는 접점이 있다. 약속의 완료 기준과 그 이유를 함께 확인한다.",
    "difference": "내부 모델의 타당성과 기존 기록·절차의 신뢰성이 다른 근거일 수 있음",
    "directionalContribution": "반복 절차의 목적을 질문해 개선 가능성을 찾기",
    "targetContribution": "탐구를 완료할 일정과 누락 항목을 드러내기",
    "friction": {
      "condition": "이유 없는 절차 강요와 설명 없는 일정 지연이 겹칠 때",
      "sourceIntentionCandidate": "불필요한 노력을 줄이려는 질문",
      "targetMayMisreadSource": "책임을 회피하는 핑계로 읽힐 가능성",
      "targetIntentionCandidate": "약속을 유지하려는 일정 확인",
      "sourceMayMisreadTarget": "개인 탐구를 감시하는 잔소리로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "질문과 맡은 책임의 이행을 분리했는가?",
      "targetQuestion": "절차가 필요한 실제 이유를 설명했는가?",
      "jointAgreement": "완료 조건과 방법 선택권을 같이 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "규칙의 이유가 보이면 자율과 책임이 함께 가능",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 자료 정리에서 필수 형식과 자유로운 분석을 나누는 장면"
      },
      {
        "id": "mpj:INTP:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "집안 공과금 담당과 각자 자유 시간을 정하는 장면"
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
    "counterexample": "실제 미루기·시간 엄수 여부는 유형보다 관찰한 행동 우선",
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
      "user-source:INTP",
      "user-source:ISTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ISFJ",
    "sourceType": "INTP",
    "targetType": "ISFJ",
    "jointReviewId": "mpj:INTP:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "8a0d4e9bbbed765af00787eb2c9365184a556f81a594d38151b5a8021986f5e5",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "b32045d0fedbf990073d4cc106edb0e5f0c43d24cc58b9cf2e9738794914ac2b",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "큰 반응을 요구하지 않는 친숙한 관계에서 편안함을 찾을 수 있다. 돌봄과 개인 시간에 대한 동의는 따로 확인한다.",
    "difference": "논리 탐구의 여백과 세부 생활 기준의 안정이 다른 필요일 수 있음",
    "directionalContribution": "익숙한 부담을 줄일 다른 해결 경로 제시",
    "targetContribution": "공동 일정과 작은 필요의 누락을 확인",
    "friction": {
      "condition": "돌봄을 당연히 받거나 확인을 모두 간섭으로 볼 때",
      "sourceIntentionCandidate": "혼자 해결할 공간을 확보하려는 유보",
      "targetMayMisreadSource": "챙김을 거절하는 냉정함으로 읽힐 가능성",
      "targetIntentionCandidate": "필요를 기억하고 확인하는 도움",
      "sourceMayMisreadTarget": "독립성을 인정하지 않는 통제로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "도움의 수고와 거절할 부분을 함께 말했는가?",
      "targetQuestion": "상대가 직접 맡고 싶은 일을 물었는가?",
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
      "user-source:INTP",
      "user-source:ISFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ESTJ",
    "sourceType": "INTP",
    "targetType": "ESTJ",
    "jointReviewId": "mpj:INTP:ESTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "062c81179613424d3593bc1b684eec2841bf0d580772e9cf1332874c2629d6da",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTJ.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "a8cb7aac585cf2c96f8ddab7a51008491fbbead476e40cb7aad962ec9e589e4a",
      "label": "논리는 통하지만 생활 방식은 크게 다른 관계",
      "sourceRelationName": "Logic but Different Lifestyle",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "논리와 문제 해결을 이야기할 수 있다. 같은 해결 의지도 요구하는 완료 시점과 재량에서 달라질 수 있다.",
    "difference": "납득을 위한 검토와 기준에 따른 신속 실행이 다른 속도를 가질 수 있음",
    "directionalContribution": "정해진 방법의 비효율을 찾아 대안을 제안",
    "targetContribution": "탐구를 실제 결과물과 기한으로 연결",
    "friction": {
      "condition": "방법까지 세세히 지시하거나 정한 기한을 말없이 넘길 때",
      "sourceIntentionCandidate": "원리를 이해한 뒤 방법을 고르는 질문",
      "targetMayMisreadSource": "지시를 피하는 변명으로 읽힐 가능성",
      "targetIntentionCandidate": "완료 책임을 분명히 하는 확인",
      "sourceMayMisreadTarget": "사고 과정을 통제하는 감시로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "검토가 끝날 때와 납품 가능한 범위를 알렸는가?",
      "targetQuestion": "결과 기준과 방법의 재량을 구분했는가?",
      "jointAgreement": "중간 산출물 하나와 최종 기준을 정하고 방법은 협의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "구체적인 결과 약속이 오히려 사고의 자율성을 보호할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ESTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "회의 전 요구사항을 받고 답변 시점을 정하는 장면"
      },
      {
        "id": "mpj:INTP:ESTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "가사 분담에서 원하는 결과와 수행 방식을 나누는 장면"
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
    "counterexample": "업무상 정당한 권한과 과도한 통제는 유형만으로 판정하지 않음",
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
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:INTP",
      "user-source:ESTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ESFJ",
    "sourceType": "INTP",
    "targetType": "ESFJ",
    "jointReviewId": "mpj:INTP:ESFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "b05461de872df2fdc82681df0fe3da281935874b512f294ee9a07c34eff75fb7",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "91f5afbc183a6c78c382b889b6d7e892c76e5ccdb9185561783d2cdfbfe1a221",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "서로의 다른 관심 영역을 질문하면 논리와 생활 맥락을 함께 볼 수 있다. 보완이 돌봄 전담으로 굳지 않게 한다.",
    "difference": "개인 탐구의 조용함과 안부·반응으로 관계를 확인하는 방식이 다를 수 있음",
    "directionalContribution": "관계 일정의 부담과 대안을 구조화",
    "targetContribution": "탐구가 타인에게 전달되는 방식과 참여감을 확인",
    "friction": {
      "condition": "안부를 시간 낭비로 부르거나 응답을 친밀감 시험으로 쓸 때",
      "sourceIntentionCandidate": "집중을 유지하려는 대화 축소",
      "targetMayMisreadSource": "자신을 밀어내는 태도로 읽힐 가능성",
      "targetIntentionCandidate": "소속감을 나누려는 가벼운 대화",
      "sourceMayMisreadTarget": "원하지 않는 사교를 강요하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "짧게라도 가능한 응답을 골랐는가?",
      "targetQuestion": "상대가 선택할 참여 형태를 남겼는가?",
      "jointAgreement": "안부 빈도와 개인 시간을 서로 정하고 생활 책임은 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "반대 선호가 서로의 결핍이나 우열을 뜻하지 않음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ESFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "모임에 잠시 참여한 뒤 개인 시간을 갖기로 합의하는 장면"
      },
      {
        "id": "mpj:INTP:ESFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "행사 준비의 연락과 자료 검토를 각자 맡는 장면"
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
    "counterexample": "최고 궁합·자연스러운 가사 역할 분담이라는 결론 금지",
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
      "user-source:INTP",
      "user-source:ESFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ISTP",
    "sourceType": "INTP",
    "targetType": "ISTP",
    "jointReviewId": "mpj:INTP:ISTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "9dc65ec0487a31d043647278f92336b1fb772b733cf2068ba93d37bf226b2ce0",
      "label": "원리 탐구와 현장 해결이 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTP.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "d82f2e82f5949e40fe317c71c81650f4c9c4b3ac24fd15c91d4984585898d1fa",
      "label": "분석 공명 관계",
      "sourceRelationName": "Inferred Analytic Kinship",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "스스로 납득한 원리를 중시하고 간섭을 줄이려는 접점이 있다. 서로 맡은 일을 알리는 최소 신호도 필요하다.",
    "difference": "가설을 확장하는 탐구와 현재 작동을 정리하는 간결함이 다를 수 있음",
    "directionalContribution": "당장의 해법이 다른 상황에도 맞는지 질문",
    "targetContribution": "긴 가설을 실제로 확인할 작은 시험 제안",
    "friction": {
      "condition": "설명이 계속 길어지거나 현장 변경이 공유되지 않을 때",
      "sourceIntentionCandidate": "적용 범위를 확인하는 추가 설명",
      "targetMayMisreadSource": "쓸모없는 이론을 붙이는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "필요한 부분만 해결하는 간단한 답",
      "sourceMayMisreadTarget": "생각을 무시하는 반응으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "설명이 지금의 시험에 필요한가?",
      "targetQuestion": "어디까지 해결했는지 알려주었는가?",
      "jointAgreement": "짧은 시험 뒤 필요할 때 원리 설명을 이어감",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "말하지 않아 편해도 책임의 상태는 서로 다르게 알고 있을 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ISTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "도구를 함께 써 보며 원리 검토와 작동 확인을 나누는 장면"
      },
      {
        "id": "mpj:INTP:ISTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "공동 과제에서 끝낸 일만 짧게 남기는 장면"
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
    "counterexample": "실제 기술 능력·감정 부족을 유형으로 추론하지 않음",
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
      "user-source:INTP",
      "user-source:ISTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ISFP",
    "sourceType": "INTP",
    "targetType": "ISFP",
    "jointReviewId": "mpj:INTP:ISFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "d66732c9d6009d09ab19008ab6853b43be4dfaa4bfc2be1bda5b23c8ed8b0609",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFP.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "05a695f46896c69219628444548b307de823c62acf85dbe14e43690eb92b85c1",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "사적 공간을 존중하는 조용한 관계가 접점이 될 수 있다. 말이 적다는 공통점만으로 같은 판단 기준을 추정하지 않는다.",
    "difference": "논리적 일관성과 내적 가치의 수용이 다른 질문을 만들 수 있음",
    "directionalContribution": "막연한 선택의 제약과 대안을 정리",
    "targetContribution": "가능한 해법 중 원치 않는 조건을 드러내기",
    "friction": {
      "condition": "감정을 분석 대상으로만 보거나 침묵을 답으로 확정할 때",
      "sourceIntentionCandidate": "이유를 이해하려는 질문",
      "targetMayMisreadSource": "마음을 논박하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "감정을 정리하며 답을 늦추는 침묵",
      "sourceMayMisreadTarget": "논의할 의사가 없는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "질문을 받고 싶은지 확인했는가?",
      "targetQuestion": "답이 어렵다는 신호를 줄 수 있는가?",
      "jointAgreement": "분석 동의를 먼저 받고 거절 조건은 설명 없이도 존중",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "간단한 도움과 공감은 서로 대체할 수 없는 선택지",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ISFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "함께 볼 영화를 고르며 취향 이유를 캐묻지 않는 장면"
      },
      {
        "id": "mpj:INTP:ISFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "고민을 들을 때 해결·경청 중 하나를 먼저 고르는 장면"
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
    "counterexample": "상대의 표정이나 침묵에서 실제 감정을 확정하지 않음",
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
      "user-source:INTP",
      "user-source:ISFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ESTP",
    "sourceType": "INTP",
    "targetType": "ESTP",
    "jointReviewId": "mpj:INTP:ESTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "cb23ccc5f6218191b3fffeb97713625e7d5efe0d790ff71bb995c4ddbd76a48b",
      "label": "생각의 실험과 현장 자극이 만나는 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTP.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "63d0fafe27d2351e2a6fe67a2becc1a226564bd296f3fbdd4e759526fd49636d",
      "label": "논리-행동 자극 관계",
      "sourceRelationName": "Inferred Logic-Action Stimulation",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "원리를 이해하고 시험하려는 관심이 만날 수 있다. 머릿속 검토와 현장 자료를 주고받는 합의가 중요하다.",
    "difference": "가설 정리 시간과 즉시 시도하는 속도가 다를 수 있음",
    "directionalContribution": "현장 결과가 왜 나왔는지 가정을 정리",
    "targetContribution": "이론의 적용 여부를 볼 실제 자료 제시",
    "friction": {
      "condition": "시험 전에 합의가 없거나 설명을 듣기 전에 움직일 때",
      "sourceIntentionCandidate": "안전하고 타당한 시험을 위한 검토",
      "targetMayMisreadSource": "시도를 막는 망설임으로 읽힐 가능성",
      "targetIntentionCandidate": "직접 확인하려는 빠른 제안",
      "sourceMayMisreadTarget": "공동 부담을 가볍게 보는 행동으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "확인하고 싶은 핵심 한 가지는 무엇인가?",
      "targetQuestion": "시도에 필요한 동의를 받았는가?",
      "jointAgreement": "안전한 소규모 시험과 결과 검토를 한 묶음으로 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "긴 설명 대신 실험 결과로 대화가 깊어질 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ESTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 취미의 새 방법을 제한된 범위에서 시험하는 장면"
      },
      {
        "id": "mpj:INTP:ESTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "모임 전에 쉬고 싶은 시간과 참여할 활동을 나누는 장면"
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
    "counterexample": "위험·법적 책임이 있는 시도는 흥미나 유형으로 허용할 수 없음",
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
      "user-source:INTP",
      "user-source:ESTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:INTP:ESFP",
    "sourceType": "INTP",
    "targetType": "ESFP",
    "jointReviewId": "mpj:INTP:ESFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "57b0d14af8614f5518631b68e1fa8be9429e44e745db719bd0c0d56bce7729be",
      "label": "갈등 관계",
      "sourceRelationName": "Conflicting",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFP.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "1d8de7191593d49b4a3886fc5e2c03019a130c0e1008a7c10eb56145140655d4",
      "label": "갈등 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "흥미로운 경험과 그 이유를 서로 질문할 수 있다. 같이 즐기는 시간과 혼자 이해하는 시간이 다를 수 있다.",
    "difference": "논리 분석의 조용함과 경험·자기 이야기를 나누는 표현량이 다를 수 있음",
    "directionalContribution": "즐거운 경험을 유지할 조건과 제약을 살피기",
    "targetContribution": "분석 밖 실제 반응과 경험의 의미를 전달",
    "friction": {
      "condition": "이야기에 곧바로 논리 평가를 붙이거나 설명 중 참여를 재촉할 때",
      "sourceIntentionCandidate": "경험의 원인을 확인하는 질문",
      "targetMayMisreadSource": "즐거움을 평가절하하는 말로 읽힐 가능성",
      "targetIntentionCandidate": "자신의 경험을 나누려는 긴 이야기",
      "sourceMayMisreadTarget": "결론 없는 말로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "지금 질문이 경험 공유를 막고 있지 않은가?",
      "targetQuestion": "상대에게 생각할 틈을 주었는가?",
      "jointAgreement": "경험 공유 뒤 원하는 경우에만 분석 시간을 가짐",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "함께 활동하는 것과 같은 방식으로 말하는 것은 별개",
    "fictionalScenes": [
      {
        "id": "mpj:INTP:ESFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "활동 후 각자 좋았던 부분과 불편했던 조건을 나누는 장면"
      },
      {
        "id": "mpj:INTP:ESFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "초대를 거절할 때 대신 가능한 만남 방식을 고르는 장면"
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
    "counterexample": "밝은 표현을 얕음·조용한 분석을 무정함으로 규정하지 않음",
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
      "user-source:INTP",
      "user-source:ESFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  }
] as const satisfies readonly MbtiPairResearch[];
