import type { MbtiPairResearch } from "./mbtiPairResearchTypes";

export const MBTI_PAIR_RESEARCH_ISTJ = [
  {
    "id": "mpr:ISTJ:INTJ",
    "sourceType": "ISTJ",
    "targetType": "INTJ",
    "jointReviewId": "mpj:INTJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/6",
      "sha256": "d904c447ebc6c781116138c5157316b554699823d41542a67650a735c65c7d09",
      "label": "유사 관계",
      "sourceRelationName": "Look-a-like",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "1de2fde7842d8448ac51501eb6c6f64f6b88ab4a2e13d8169c133733b80147a0",
      "label": "무난한 친선 관계",
      "sourceRelationName": "Friendly",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "기준을 정하고 책임 있게 유지하려는 접점이 있다. 체계를 좋아한다는 공통점이 같은 체계에 대한 합의는 아니다.",
    "difference": "새 구조의 설명력과 기존 기록의 신뢰성을 우선하는 순서가 다를 수 있음",
    "directionalContribution": "새 구조를 적용하기 전 누적 기록과 누락 위험을 점검",
    "targetContribution": "전례가 맞지 않는 조건을 찾아 재설계 가능성을 제시",
    "friction": {
      "condition": "전례를 낡았다고 버리거나 새 안을 경험 없다고 닫을 때",
      "sourceIntentionCandidate": "이미 검증된 안전 장치를 지키려는 질문",
      "targetMayMisreadSource": "아무것도 바꾸지 않으려는 저항으로 읽힐 가능성",
      "targetIntentionCandidate": "더 넓게 적용되는 구조를 찾으려는 수정",
      "sourceMayMisreadTarget": "축적한 경험을 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "전례가 지금도 맞는 조건을 확인했는가?",
      "targetQuestion": "새 안이 기존 문제를 줄인다는 자료가 있는가?",
      "jointAgreement": "보존할 절차와 시험할 변경을 구분해 비교 기록",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "보수적으로 보이는 검토가 실험을 안전하게 만들어줄 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INTJ:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "집안 비용 관리 방식을 바꾸며 이전 기록과 새 항목을 비교하는 장면"
      },
      {
        "id": "mpj:INTJ:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "행사 운영을 개선하되 누락되기 쉬운 준비 항목은 남기는 장면"
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
    "counterexample": "전문 경험 차이가 더 큰 원인이라면 유형 설명보다 실제 숙련도 우선",
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
      "user-source:ISTJ",
      "user-source:INTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:INTP",
    "sourceType": "ISTJ",
    "targetType": "INTP",
    "jointReviewId": "mpj:INTP:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/13",
      "sha256": "60b55b4ce8ffa96674534d7cfec574f5dceafe681e92b5d8bf6509603f49b455",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INTP.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "86924c5271768aac3abb6060479ff0b7a760a185b3a7afd3f6bd6be023c65bc6",
      "label": "후원자-수혜자 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "조용히 자기 일을 하고 정확한 근거를 보려는 접점이 있다. 약속의 완료 기준과 그 이유를 함께 확인한다.",
    "difference": "내부 모델의 타당성과 기존 기록·절차의 신뢰성이 다른 근거일 수 있음",
    "directionalContribution": "탐구를 완료할 일정과 누락 항목을 드러내기",
    "targetContribution": "반복 절차의 목적을 질문해 개선 가능성을 찾기",
    "friction": {
      "condition": "이유 없는 절차 강요와 설명 없는 일정 지연이 겹칠 때",
      "sourceIntentionCandidate": "약속을 유지하려는 일정 확인",
      "targetMayMisreadSource": "개인 탐구를 감시하는 잔소리로 읽힐 가능성",
      "targetIntentionCandidate": "불필요한 노력을 줄이려는 질문",
      "sourceMayMisreadTarget": "책임을 회피하는 핑계로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "절차가 필요한 실제 이유를 설명했는가?",
      "targetQuestion": "질문과 맡은 책임의 이행을 분리했는가?",
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
      "user-source:ISTJ",
      "user-source:INTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ENTJ",
    "sourceType": "ISTJ",
    "targetType": "ENTJ",
    "jointReviewId": "mpj:ENTJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/15",
      "sha256": "bebe69a636f5ceb2354c8eff042951c880a5e32ada58c89d93167c4a7f0d22d6",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "cd9fdf9c3842cb6fe14e176b15c7e7f73256460ad5bf26167776b78fd09fa0d9",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "책임과 실제 결과를 중시하는 접점이 있다. 변화가 필요한 근거와 유지할 안전 장치를 함께 다룬다.",
    "difference": "미래 목표의 재설계와 과거 기록의 검증이 다른 출발점일 수 있음",
    "directionalContribution": "변경안이 놓친 누적 절차와 이력 확인",
    "targetContribution": "전례가 현재 목표에 맞는지 질문",
    "friction": {
      "condition": "속도를 이유로 기록을 건너뛰거나 전례만으로 새 안을 닫을 때",
      "sourceIntentionCandidate": "실수를 막으려는 절차 확인",
      "targetMayMisreadSource": "진행을 막는 보수성으로 읽힐 가능성",
      "targetIntentionCandidate": "장기 목표를 위해 바꾸려는 결정",
      "sourceMayMisreadTarget": "책임질 과정을 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "전례의 적용 조건을 확인했는가?",
      "targetQuestion": "변경 후 책임 구조까지 설명했는가?",
      "jointAgreement": "유지할 절차와 변경 실험을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "기록 검토가 추진력의 반대가 아니라 기반일 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENTJ:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 운영 방식 변경 전 이전 오류를 검토하는 장면"
      },
      {
        "id": "mpj:ENTJ:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "일정 단축에 영향을 받는 담당자의 조건을 묻는 장면"
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
    "counterexample": "법적 절차나 숙련 차이를 성격 문제로 돌리지 않음",
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
      "user-source:ISTJ",
      "user-source:ENTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ENTP",
    "sourceType": "ISTJ",
    "targetType": "ENTP",
    "jointReviewId": "mpj:ENTP:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "bb153f3c5ac0da22e342acf9f01cc9aca46bbdf73a135a8e62f7dadc1732ff8e",
      "label": "준이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENTP.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "df6da54047e33b60a6ce9445aa8a2a783c40e9b658045c91e895132935f74b2f",
      "label": "반이중성 관계",
      "sourceRelationName": "Semi-Duality",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "문제에 이유가 있어야 한다는 점에서 접점을 찾을 수 있다. 새 방법과 검증된 기록은 비교할 자료다.",
    "difference": "가능성 전환과 기존 경험의 신뢰가 다를 수 있음",
    "directionalContribution": "새 안의 누락과 변경 비용 확인",
    "targetContribution": "전례의 적용 한계를 질문",
    "friction": {
      "condition": "합의된 절차를 농담으로 무효화할 때",
      "sourceIntentionCandidate": "누락을 막는 재확인",
      "targetMayMisreadSource": "새 시도를 막는 고집으로 읽힐 가능성",
      "targetIntentionCandidate": "다른 방법을 찾는 제안",
      "sourceMayMisreadTarget": "약속을 가볍게 여기는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "기존 방식의 이유를 전했는가?",
      "targetQuestion": "변경 비용을 설명했는가?",
      "jointAgreement": "변경 요청 시점과 검증 항목을 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "일부 규칙을 고정하면 실험 여백이 생김",
    "fictionalScenes": [
      {
        "id": "mpj:ENTP:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "여행 중 확정 예약과 바꿀 활동을 나누는 장면"
      },
      {
        "id": "mpj:ENTP:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "문서 절차를 작은 범위에서 시험 변경하는 장면"
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
    "counterexample": "규칙 준수를 창의성 부족으로 해석하지 않음",
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
      "user-source:ISTJ",
      "user-source:ENTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:INFJ",
    "sourceType": "ISTJ",
    "targetType": "INFJ",
    "jointReviewId": "mpj:INFJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/8",
      "sha256": "e14b21308426f8f51817c5b4600d8b2e3f1e4034cf7d6473de2b6228c6699257",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFJ.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "ac93723ce3512f2005be749bf6f70f767b08e9387af2dc0e85ea87465768c55a",
      "label": "초자아 관계",
      "sourceRelationName": "Super-Ego",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "오래 유지할 신뢰와 책임을 중시할 접점이 있다. 방향의 의미와 실제 기록을 함께 비교한다.",
    "difference": "미래 맥락의 해석과 검증된 경험의 적용이 다를 수 있음",
    "directionalContribution": "의미 있는 제안의 현실 제약을 확인",
    "targetContribution": "관행이 사람에게 주는 장기 영향을 질문",
    "friction": {
      "condition": "의미를 공상으로 부르거나 전례를 낡음으로 취급할 때",
      "sourceIntentionCandidate": "경험의 안전 장치를 지키는 말",
      "targetMayMisreadSource": "변화를 막는 단정으로 읽힐 가능성",
      "targetIntentionCandidate": "방향을 재검토하려는 질문",
      "sourceMayMisreadTarget": "지킨 책임을 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "전례가 맞는 조건을 설명했는가?",
      "targetQuestion": "제안의 실제 단계를 말했는가?",
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
      "user-source:ISTJ",
      "user-source:INFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:INFP",
    "sourceType": "ISTJ",
    "targetType": "INFP",
    "jointReviewId": "mpj:INFP:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "880add597de553f386c1a41dfc2fd9646a09e2cbc9108824caf35c435c189b33",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/INFP.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "d2d408505f9625d420d68fa1795fc7c3d48c6bbf0123ee9f38ebe9c4946f3b41",
      "label": "활동 관계",
      "sourceRelationName": "Activity",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "소중한 약속을 지키려는 의지에서 접점을 찾을 수 있다. 의미와 현실 조건이 함께 보여야 한다.",
    "difference": "내적 가치의 수용과 검증된 기록의 안정이 다를 수 있음",
    "directionalContribution": "원하는 일을 지속할 일정과 준비를 확인",
    "targetContribution": "절차가 개인에게 주는 의미를 질문",
    "friction": {
      "condition": "의미를 비현실로 부르거나 규칙을 마음 부족으로 볼 때",
      "sourceIntentionCandidate": "일정을 지키려는 확인",
      "targetMayMisreadSource": "개인 선택을 통제하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "맞지 않는 조건을 거절하는 말",
      "sourceMayMisreadTarget": "책임을 피하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "기준의 이유를 전했는가?",
      "targetQuestion": "불편한 조건과 가능한 대안을 나눴는가?",
      "jointAgreement": "목적과 일정의 필수 조건을 같이 적음",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "선명한 약속이 창작·개인 시간을 보호할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:INFP:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "함께 할 활동에서 예산과 원하는 의미를 확인하는 장면"
      },
      {
        "id": "mpj:INFP:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "기념일 표현과 실제 준비 책임을 나누는 장면"
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
    "counterexample": "성실함·현실감의 높낮이를 유형으로 배정하지 않음",
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
      "user-source:ISTJ",
      "user-source:INFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ENFJ",
    "sourceType": "ISTJ",
    "targetType": "ENFJ",
    "jointReviewId": "mpj:ENFJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/4",
      "sha256": "7ebe89b60facf72f99aa5a77fe75aa27d03a2e57712d0faf158fc9e0b86297ba",
      "label": "갈등 관계",
      "sourceRelationName": "Conflicting",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "cb5ff1e97985f2d51f50b32904b3f1ecd4dda7c342cdd57702df01b338c0f137",
      "label": "갈등 관계",
      "sourceRelationName": "Conflict",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "지키고 싶은 관계를 실제 책임으로 연결할 접점이 있다. 약속 이행과 정서 확인을 서로 대신하지 않는다.",
    "difference": "마음을 말로 맞추는 과정과 기록·행동의 신뢰가 다를 수 있음",
    "directionalContribution": "공동 방향을 일정과 역할로 정리",
    "targetContribution": "실행 과정의 참여 부담을 확인",
    "friction": {
      "condition": "행동했으니 표현은 필요 없거나 표현이 없으니 관심 없다고 볼 때",
      "sourceIntentionCandidate": "약속을 지켜 지지하는 행동",
      "targetMayMisreadSource": "정서 요구를 무시하는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "감정을 함께 확인하려는 대화",
      "sourceMayMisreadTarget": "책임 외 요구가 늘어나는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "상대의 수고와 별개로 마음을 들었는가?",
      "targetQuestion": "원하는 표현을 구체적으로 말했는가?",
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
      "user-source:ISTJ",
      "user-source:ENFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ENFP",
    "sourceType": "ISTJ",
    "targetType": "ENFP",
    "jointReviewId": "mpj:ENFP:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/0",
      "sha256": "c7ad74a304f3a8f92d951a040b763ad9d37b6f41614a40c80f08db70c77fc097",
      "label": "상호 보완 관계",
      "sourceRelationName": "Duality / TRUITY complementary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ENFP.json",
      "pointer": "/relationshipHints/notablePairs/11",
      "sha256": "733b5e81b47d5cfdf6670a3c315dce43d34fd24376cdb71847aa5651de2d5c46",
      "label": "이중성 관계",
      "sourceRelationName": "Duality",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "새로운 시도를 오래 유지하는 문제에서 접점을 만들 수 있다. 변화의 즐거움과 기존 책임을 함께 다룬다.",
    "difference": "가능성 확장과 검증된 일정·기록의 안정이 다를 수 있음",
    "directionalContribution": "새 제안이 유지될 준비와 약속을 확인",
    "targetContribution": "전례 밖의 다른 경로를 제안",
    "friction": {
      "condition": "확정 일정을 즉흥 변경하거나 제안을 무조건 닫을 때",
      "sourceIntentionCandidate": "약속을 지키려는 재확인",
      "targetMayMisreadSource": "자유를 묶는 통제로 읽힐 가능성",
      "targetIntentionCandidate": "새 경험을 나누는 변경 제안",
      "sourceMayMisreadTarget": "신뢰를 가볍게 보는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "예외를 허용할 조건을 말했는가?",
      "targetQuestion": "변경이 줄 부담을 알렸는가?",
      "jointAgreement": "고정 약속과 유연한 구간을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "기본 구조가 있으면 새로운 시도를 더 편히 할 수도 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ENFP:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "여행 예약은 지키고 활동 후보는 남기는 장면"
      },
      {
        "id": "mpj:ENFP:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "일정 변경 전에 영향받는 담당에게 묻는 장면"
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
    "counterexample": "반대 유형의 자동 보완·만족 보장 금지",
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
      "system": "mixed_named_sources_unverified",
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
      "user-source:ISTJ",
      "user-source:ENFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ISTJ",
    "sourceType": "ISTJ",
    "targetType": "ISTJ",
    "jointReviewId": "mpj:ISTJ:ISTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "280f855190a73ee46bda41e89d04797155766f274b45cfa7e6d0ef2ddb3ccabf",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/1",
      "sha256": "280f855190a73ee46bda41e89d04797155766f274b45cfa7e6d0ef2ddb3ccabf",
      "label": "동일 관계",
      "sourceRelationName": "Identical",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "검증된 약속과 생활 질서를 중시하는 접점이 있다. 각자 익힌 기준이 같다는 뜻은 아니다.",
    "difference": "경험·기준·표현 선호는 같은 유형에서 구분 불가",
    "directionalContribution": "자기 기준의 근거를 공개해 비교 가능하게 함",
    "targetContribution": "상대 기준의 적용 조건을 질문",
    "friction": {
      "condition": "서로의 익숙한 방식을 공통 규칙으로 전제할 때",
      "sourceIntentionCandidate": "실수를 막는 기준 확인",
      "targetMayMisreadSource": "내 경험을 무시하는 지적으로 읽힐 가능성",
      "targetIntentionCandidate": "신뢰를 행동으로 보여주는 태도",
      "sourceMayMisreadTarget": "마음을 말하지 않는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "내 기준의 이유를 설명했는가?",
      "targetQuestion": "표현이 필요한 요청도 들었는가?",
      "jointAgreement": "기존 방식 두 개를 비교해 공동 규칙 선택",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "같은 규칙 선호도 다른 규칙을 선택할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ISTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "집안 정리 기준을 각자 설명하는 장면"
      },
      {
        "id": "mpj:ISTJ:ISTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "기념일 준비와 원하는 표현을 따로 묻는 장면"
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
    "counterexample": "동일형의 감정 부족·완벽한 책임을 단정하지 않음",
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
      "user-source:ISTJ",
      "user-source:ISTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ISFJ",
    "sourceType": "ISTJ",
    "targetType": "ISFJ",
    "jointReviewId": "mpj:ISTJ:ISFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "0f61c1c6495946766f1801bd5aad6ae5467ae17065ac41e3726500f057cc0bd3",
      "label": "비교 관계",
      "sourceRelationName": "Comparative",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFJ.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "560d5c03968fb504f6817007f328bd347dcdafe6415c556724431478ba5151ca",
      "label": "안정과 책임이 닮은 관계",
      "sourceRelationName": "inferred",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "existingSourceStatus": "source_local_inferred",
    "sharedGround": "기억한 약속과 작은 책임을 지키려는 접점이 있다. 조용한 협력에도 부담을 확인할 말이 필요하다.",
    "difference": "실무 정확성의 기준과 상대 필요의 챙김이 다를 수 있음",
    "directionalContribution": "돌봄의 담당과 반복 일정을 정리",
    "targetContribution": "기준에 빠진 개인 필요와 작은 변화를 확인",
    "friction": {
      "condition": "수고를 당연히 받거나 불편을 모두 참을 때",
      "sourceIntentionCandidate": "정확한 완료를 위한 점검",
      "targetMayMisreadSource": "노력을 인정하지 않는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "관계를 지키려는 조용한 양보",
      "sourceMayMisreadTarget": "아무 부담 없다는 동의로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "수고와 수정 요청을 나눴는가?",
      "targetQuestion": "감당할 선을 말했는가?",
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
      "user-source:ISTJ",
      "user-source:ISFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ESTJ",
    "sourceType": "ISTJ",
    "targetType": "ESTJ",
    "jointReviewId": "mpj:ISTJ:ESTJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/3",
      "sha256": "81ba48a16ef57cf19989f7d86c26af0a9e13d515a0118ee1afefa72252dea9fe",
      "label": "거울 관계",
      "sourceRelationName": "Mirror",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTJ.json",
      "pointer": "/relationshipHints/notablePairs/2",
      "sha256": "98e3bc76b19ee8d4b3e0594d42a32833e5a86000e2d9d70036130930cecf79f2",
      "label": "조용하지만 강한 책임 중심 관계",
      "sourceRelationName": "Responsibility Pair",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "기록·절차·약속의 신뢰가 접점이다. 기준이 닮아도 확인하고 결정하는 속도는 다를 수 있다.",
    "difference": "차분히 경험을 검토하는 방식과 명료하게 진척을 요구하는 방식이 다를 수 있음",
    "directionalContribution": "빠른 실행의 누락을 기록으로 확인",
    "targetContribution": "검토 결과를 책임과 기한으로 연결",
    "friction": {
      "condition": "확인 중인 사람에게 계속 즉답을 요구할 때",
      "sourceIntentionCandidate": "오류를 줄이는 추가 확인",
      "targetMayMisreadSource": "불필요한 지연으로 읽힐 가능성",
      "targetIntentionCandidate": "진척을 확보하는 직접 질문",
      "sourceMayMisreadTarget": "신뢰하지 않는 감시로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "확인이 끝날 때를 알렸는가?",
      "targetQuestion": "점검 시점을 미리 합의했는가?",
      "jointAgreement": "사전 검토와 중간 확인 주기를 정함",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "명료한 기준이 있어도 감정 표현 요청은 별도로 들음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ESTJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 서류의 검토와 제출 시간을 나누는 장면"
      },
      {
        "id": "mpj:ISTJ:ESTJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "일정 변경에 필요한 자료를 미리 주는 장면"
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
    "counterexample": "속도로 능력·헌신을 평가하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISTJ",
      "user-source:ESTJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ESFJ",
    "sourceType": "ISTJ",
    "targetType": "ESFJ",
    "jointReviewId": "mpj:ISTJ:ESFJ",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/14",
      "sha256": "7b423047419c0a03b067eddeda5be37bd10c9a032b1073b94f4bdfe17f769566",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "a1cba90cd92422ee98e8831d434ae7d4d2b3f3c48db3aa001d6dc57ac67e3f88",
      "label": "감독 관계",
      "sourceRelationName": "Supervision",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "생활의 약속과 예절을 지키려는 접점이 있다. 행동의 신뢰와 말로 확인하는 소속감을 따로 인정한다.",
    "difference": "조용한 이행과 잦은 안부·참여 확인이 다를 수 있음",
    "directionalContribution": "관계 일정의 현실 부담을 정리",
    "targetContribution": "지킨 책임이 상대에게 전달되는 표현을 확인",
    "friction": {
      "condition": "약속을 했으니 표현은 불필요하다고 볼 때",
      "sourceIntentionCandidate": "책임을 지키는 조용한 행동",
      "targetMayMisreadSource": "안부를 피하는 무관심으로 읽힐 가능성",
      "targetIntentionCandidate": "관계 확인을 위한 대화",
      "sourceMayMisreadTarget": "집중을 방해하는 요구로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "가능한 표현을 골랐는가?",
      "targetQuestion": "원하는 연락량을 물었는가?",
      "jointAgreement": "실무 일정과 안부 방식을 따로 합의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "책임 이행과 작은 감사는 동시에 가능",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ESFJ:scene:1",
        "kind": "fictional_not_user_history",
        "text": "가족 행사 준비와 참석·연락 선호를 나누는 장면"
      },
      {
        "id": "mpj:ISTJ:ESFJ:scene:2",
        "kind": "fictional_not_user_history",
        "text": "집중 시간엔 나중에 답할 시점만 알리는 장면"
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
    "counterexample": "예절 차이를 도덕성 차이로 평가하지 않음",
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
      "user-source:ISTJ",
      "user-source:ESFJ",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ISTP",
    "sourceType": "ISTJ",
    "targetType": "ISTP",
    "jointReviewId": "mpj:ISTJ:ISTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "cbe8bed640d9fe97216e9bd253f4ce615178389f9fda151ea5ea17c4a7e7b468",
      "label": "준동일 관계",
      "sourceRelationName": "Quasi-Identical",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISTP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "831cdc4c03e8a31f9669146e6831f3584fdc6d1fca151da4ece805e3492e8f72",
      "label": "실용 절차 긴장 관계",
      "sourceRelationName": "Inferred Practical-Procedure Tension",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "실제로 작동하는 해법을 찾고 간섭을 줄이는 접점이 있다. 절차와 재량의 범위를 함께 정한다.",
    "difference": "검증된 순서의 유지와 필요한 부분만 고치는 방식이 다를 수 있음",
    "directionalContribution": "수정에서 빠진 이력·안전 조건 확인",
    "targetContribution": "기존 절차의 불필요한 부분을 시험",
    "friction": {
      "condition": "정해진 방법을 말없이 바꾸거나 모든 방법을 강제할 때",
      "sourceIntentionCandidate": "누락을 막는 절차 확인",
      "targetMayMisreadSource": "재량을 없애는 관리로 읽힐 가능성",
      "targetIntentionCandidate": "현재 문제를 간단히 고치는 변경",
      "sourceMayMisreadTarget": "책임 절차를 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "필수와 선택 절차를 나눴는가?",
      "targetQuestion": "변경 내용을 남겼는가?",
      "jointAgreement": "목적·안전 조건은 고정하고 방법은 협의",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "절차 준수와 실용적 수정은 양립 가능",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ISTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공동 도구 관리에서 바꿀 방법과 남길 기록을 정하는 장면"
      },
      {
        "id": "mpj:ISTJ:ISTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "생활 책임의 완료 기준만 공유하는 장면"
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
    "counterexample": "안전 규칙을 자유 선호로 생략하지 않음",
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
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISTJ",
      "user-source:ISTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ISFP",
    "sourceType": "ISTJ",
    "targetType": "ISFP",
    "jointReviewId": "mpj:ISTJ:ISFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/7",
      "sha256": "354fc95bb1c1aea3be75c935dd66f10fb6b3e8bd88a426524f1c092f20c1f5ce",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ISFP.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "4e4c7e6d05f0e34d08fb944b6e7502d745bdee77986391fce6fb9e26808c90ae",
      "label": "이익 관계",
      "sourceRelationName": "Benefit",
      "sourceCoverage": "direct"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "조용한 관계와 개인 생활을 존중할 접점이 있다. 기준 설명에도 상대의 가치 선택을 남긴다.",
    "difference": "익숙한 기록의 신뢰와 내적 가치의 수용이 다를 수 있음",
    "directionalContribution": "원하는 생활을 지탱할 일정과 준비 확인",
    "targetContribution": "실무 기준이 개인 취향을 넘는지 질문",
    "friction": {
      "condition": "피드백이 생활 전체의 평가로 넓어질 때",
      "sourceIntentionCandidate": "약속을 지키려는 지적",
      "targetMayMisreadSource": "취향을 부정하는 말로 읽힐 가능성",
      "targetIntentionCandidate": "답을 정리하는 침묵",
      "sourceMayMisreadTarget": "문제를 외면하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "행동 한 가지에 대해 말했는가?",
      "targetQuestion": "대화가 어려운 때를 알렸는가?",
      "jointAgreement": "공동 규칙과 개인 취향을 분리",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "말이 적은 동의에도 다시 선택권을 확인할 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ISFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "공유 공간의 필수 규칙과 개인 장식을 나누는 장면"
      },
      {
        "id": "mpj:ISTJ:ISFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "기분이 가라앉았을 때 답할 시간을 묻는 장면"
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
    "counterexample": "침묵을 동의·거절로 확정하지 않음",
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
      "user-source:ISTJ",
      "user-source:ISFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ESTP",
    "sourceType": "ISTJ",
    "targetType": "ESTP",
    "jointReviewId": "mpj:ISTJ:ESTP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/5",
      "sha256": "3ed2b3159d0fd78588677673f1b2960ae10bd9810806ef43b5c85db9f6ca5a34",
      "label": "대척 관계",
      "sourceRelationName": "Contrary",
      "sourceCoverage": "direct"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESTP.json",
      "pointer": "/relationshipHints/notablePairs/9",
      "sha256": "35283fcc0e8e9a347475e4679de6c0623dbcc6c2a86ff6fea9fa1ce07bef5850",
      "label": "절차-즉흥 긴장 관계",
      "sourceRelationName": "Inferred Procedure-Spontaneity Tension",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "현실 문제를 해결하려는 관심이 접점이다. 기록과 현장 자료를 서로의 검증으로 삼는다.",
    "difference": "검증된 순서와 현재 상황의 즉각 수정이 다를 수 있음",
    "directionalContribution": "빠른 시도의 누락과 이후 책임 확인",
    "targetContribution": "전례가 지금도 맞는지 현장에서 확인",
    "friction": {
      "condition": "합의 없이 현장 변경을 실행할 때",
      "sourceIntentionCandidate": "약속을 지키려는 재확인",
      "targetMayMisreadSource": "행동을 막는 통제로 읽힐 가능성",
      "targetIntentionCandidate": "현재 문제를 고치는 시도",
      "sourceMayMisreadTarget": "앞선 준비를 무시하는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "바꿔도 되는 범위를 말했는가?",
      "targetQuestion": "변경의 영향을 알렸는가?",
      "jointAgreement": "필수 안전·일정과 현장 재량을 나눔",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "충분한 기본 규칙이 빠른 수정의 기반이 될 수 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ESTP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "행사 동선 변경 전 안전 조건을 확인하는 장면"
      },
      {
        "id": "mpj:ISTJ:ESTP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "외출 계획에서 예약과 자유 활동을 나누는 장면"
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
    "counterexample": "활동성으로 위험 허용 범위를 정하지 않음",
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
        "C_LOCAL_OR_MIXED_SYSTEM_NAME_UNRESOLVED",
        "D_SOURCE_LOCAL_COVERAGE_DIFFERS",
        "F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED"
      ],
      "mappingStatus": "not_established",
      "approvedForCustomer": false
    },
    "conflictStatus": "source_meaning_preserved_new_conditions_not_empirically_verified",
    "sourceRefs": [
      "user-source:ISTJ",
      "user-source:ESTP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  },
  {
    "id": "mpr:ISTJ:ESFP",
    "sourceType": "ISTJ",
    "targetType": "ESFP",
    "jointReviewId": "mpj:ISTJ:ESFP",
    "sourceRecord": {
      "file": "docs/product/mbti/source/ISTJ.json",
      "pointer": "/relationshipHints/notablePairs/12",
      "sha256": "4e1143ef30cd546b8e11e3c70dae10c71d4666568569b172597d51ed9fb9b036",
      "label": "환상 관계",
      "sourceRelationName": "Illusionary",
      "sourceCoverage": "inferred"
    },
    "reverseSourceRecord": {
      "file": "docs/product/mbti/source/ESFP.json",
      "pointer": "/relationshipHints/notablePairs/10",
      "sha256": "2a99e5a4ed20052e1a20d09dd6fbf0fe34e9922ffff12355341815fffe0a3c14",
      "label": "절차-즐거움 긴장 관계",
      "sourceRelationName": "Inferred Procedure-Joy Tension",
      "sourceCoverage": "inferred"
    },
    "reverseSourceStatus": "present",
    "sourceTraitRefs": [
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
    "sharedGround": "함께 유지할 생활을 실제 경험으로 확인하는 접점이 있다. 약속과 즐거움을 서로 지우지 않는다.",
    "difference": "일정·역할의 안정과 즉흥 경험의 즐거움이 다를 수 있음",
    "directionalContribution": "즐거운 제안의 비용·준비를 정리",
    "targetContribution": "고정 일정에 실제 만족과 여유를 더함",
    "friction": {
      "condition": "예고 없는 활동이 기존 준비를 바꿀 때",
      "sourceIntentionCandidate": "일관성을 지키려는 거절",
      "targetMayMisreadSource": "함께할 마음이 없는 것으로 읽힐 가능성",
      "targetIntentionCandidate": "즐거움을 나누는 초대",
      "sourceMayMisreadTarget": "약속을 가볍게 여기는 것으로 읽힐 가능성"
    },
    "repair": {
      "sourceQuestion": "대신 가능한 활동을 말했는가?",
      "targetQuestion": "먼저 일정 동의를 받았는가?",
      "jointAgreement": "고정 약속 뒤 선택 활동을 둠",
      "timingLimit": "회복 시간·연락 빈도를 유형으로 배정하지 않는다. 각자의 필요와 다시 이야기할 시점을 직접 정한다."
    },
    "twist": "안정된 준비가 즐거운 경험의 여백을 만들 수도 있음",
    "fictionalScenes": [
      {
        "id": "mpj:ISTJ:ESFP:scene:1",
        "kind": "fictional_not_user_history",
        "text": "주말의 해야 할 일과 자유 시간을 나누는 장면"
      },
      {
        "id": "mpj:ISTJ:ESFP:scene:2",
        "kind": "fictional_not_user_history",
        "text": "깜짝 이벤트 전에 허용 범위를 묻는 장면"
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
    "counterexample": "소비·책임의 실제 수준을 유형으로 추론하지 않음",
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
      "user-source:ISTJ",
      "user-source:ESFP",
      "mbf:relationships"
    ],
    "verification": "editorially_reviewed_conditional_not_empirical",
    "connectedToRuntime": false,
    "approvedForCustomer": false
  }
] as const satisfies readonly MbtiPairResearch[];
