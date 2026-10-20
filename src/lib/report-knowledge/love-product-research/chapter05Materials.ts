/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH05_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH05.P1:close-unguarded-detail",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "가까운 사람에게 보여주는 모습",
    "researchKind": "mbti_application",
    "coreMeaning": "가까워질수록 사소한 취향과 불편을 숨길 필요가 줄어드는 모습을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "친밀한 행동",
        "knowledge": "slow_open_romantic는 본인의 열리는 속도 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "말수가 늘어나는 것보다 어떤 내용을 편하게 고르는지 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "긍정적 가치",
        "knowledge": "원치 않는 공개를 하지 않아도 편안함을 느낄 여지가 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "첫인상과 차이",
        "knowledge": "이 변화는 실제 관계가 있을 때 확인할 가능성이다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "7262748ae842a059b4fc"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:visibility-control",
        "axis": "EXPRESSION",
        "definition": "드러낼 범위와 대상을 고름",
        "condition": "공개 동의를 별도로 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "자기 모습으로 참여할 공간",
    "risk": "친해지면 전부 공유해야 한다고 기대",
    "factBomb": "가깝다는 이유가 개인의 빈칸을 없애지는 않는다.",
    "twist": "더 말하지 않아도 덜 꾸미는 것이 친밀함일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 좋아하지 않는 약속을 짧게 말하고 대안을 제안한다."
      }
    ],
    "repairAction": "취향 하나와 불편 하나를 부담 없는 범위에서 전한다.",
    "counterexample": "친밀해져도 공개를 늘리지 않는 것이 편한 사람이라면 사적인 이야기를 더 꺼내도록 요구하지 않는다.",
    "applicationLimit": "실제 비밀·상처·과거 사건을 채우지 않는다.",
    "distinctFromOtherParagraphs": "첫인상 매력과 다른 공개 범위의 변화",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 비밀·상처·과거 사건을 채우지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P1:close-attuned-question",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "가까운 사람에게 보여주는 모습",
    "researchKind": "mbti_application",
    "coreMeaning": "익숙한 사람의 변화를 빨리 알아채는 감각을 확인 질문으로 쓰는 친밀함을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "친밀한 행동",
        "knowledge": "attuned_partner는 본인 반응 감지 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "평소보다 조용하다는 관찰과 그 이유의 추측을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "긍정적 가치",
        "knowledge": "잘 안다는 믿음보다 지금의 답을 들을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "첫인상과 차이",
        "knowledge": "상대의 마음을 정확히 맞힌 사실로 처리하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6e846060eca8b8a32399"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "작은 변화를 놓치지 않고 관심을 전할 가능성",
    "risk": "이유를 정한 채 해명을 요구",
    "factBomb": "가까운 사람이어도 내 추측이 그 사람의 답은 아니다.",
    "twist": "모르는 이유를 물을 때 익숙함이 더 다정해질 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 조용한 저녁에 피곤한지 이야기하고 싶은지 묻는다."
      }
    ],
    "repairAction": "관찰 한 가지와 열린 질문 한 가지로 시작한다.",
    "counterexample": "조용한 이유를 이미 설명했다면 반복해서 감정을 확인하는 질문은 관심보다 부담이 될 수 있다.",
    "applicationLimit": "실제 상대의 우울·분노·애정 감소를 진단하지 않는다.",
    "distinctFromOtherParagraphs": "상대의 현재 답을 갱신하는 친밀함",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 우울·분노·애정 감소를 진단하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P1:close-practical-trust",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "가까운 사람에게 보여주는 모습",
    "researchKind": "mbti_application",
    "coreMeaning": "가까운 사이에서 약속한 몫을 이어가는 행동이 신뢰로 쓰이는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "친밀한 행동",
        "knowledge": "reliable_partner는 본인의 책임 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "할 수 있는 범위를 알고 맡은 일을 끝내는 행동을 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "긍정적 가치",
        "knowledge": "상대가 매번 확인할 부담을 줄일 가능성을 검토한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "첫인상과 차이",
        "knowledge": "계속 맡아야 하는 영구 역할은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1cb30f8035bfd0a67e8e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "서로 기대할 수 있는 작은 행동",
    "risk": "잘한다는 이유로 모든 책임을 떠맡거나 통제",
    "factBomb": "믿고 맡긴다는 말이 선택권을 넘겼다는 말은 아니다.",
    "twist": "역할을 바꿀 수 있어야 책임도 선택으로 남는다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 준비의 담당을 맡되 다음 번 변경 가능성을 둔다."
      }
    ],
    "repairAction": "담당과 완료 기준을 나누고 어려우면 일찍 알린다.",
    "counterexample": "현재 담당을 계속할 여력이 없다면 잘해왔다는 이유로 신뢰의 의무를 유지시키지 않는다.",
    "applicationLimit": "실제 능력·완료 성과·상대 만족을 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "친밀함에서 역할의 예측 가능성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 능력·완료 성과·상대 만족을 만들어내지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P1:close-shared-story",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "가까운 사람에게 보여주는 모습",
    "researchKind": "mbti_application",
    "coreMeaning": "작은 하루의 이야기를 나누며 같은 경험이 없어도 가까움을 잇는 방식을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "친밀한 행동",
        "knowledge": "story_and_episode_talk는 본인 대화 통로 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "상대가 함께 있지 않은 일을 들을 수 있게 맥락을 준다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "긍정적 가치",
        "knowledge": "큰 사건 없이도 서로의 관심을 알아갈 여지를 만든다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "첫인상과 차이",
        "knowledge": "상대도 같은 길이로 말해야 한다는 요구는 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "62e33b4e8bf4f9071748"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "일상 경험을 나눌 통로",
    "risk": "대화량을 관계의 깊이로만 평가",
    "factBomb": "내 이야기가 길었다고 상대의 말을 들은 것은 아니다.",
    "twist": "짧게 나누고 묻는 한마디가 더 가까울 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 하루의 한 장면을 말한 뒤 상대가 기억한 순간을 묻는다."
      }
    ],
    "repairAction": "이야기 하나 뒤에 듣는 차례를 둔다.",
    "counterexample": "상대가 그날은 듣기 어려운 상태라고 답하면 일상 교환을 계속하는 것이 친밀함의 조건은 아니다.",
    "applicationLimit": "실제 하루의 사건을 고객의 경험처럼 쓰지 않는다.",
    "distinctFromOtherParagraphs": "표현의 양보다 사적 일상을 교환하는 과정",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 하루의 사건을 고객의 경험처럼 쓰지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P2:need-acknowledged-care",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "깊은 관계에서 원하는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "돌봄을 알아봐주길 원하는 필요와 실제 책임 분담을 서로 다른 답으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "유지 조건",
        "knowledge": "gratitude_maintenance는 본인의 인정 필요 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "성향적 이유",
        "knowledge": "고마운 말과 다음에 맡아줄 행동을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "이해받을 때",
        "knowledge": "수고가 보이면 요청을 숨기지 않을 가능성이 생긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "충족되지 않을 때",
        "knowledge": "감사 부족을 애정 부족으로 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0c283e400d1572c869f6"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "서로의 참여를 구체적으로 알아볼 가능성",
    "risk": "인정만 받으면 과부하도 괜찮다고 넘기기",
    "factBomb": "고맙다는 말이 쉬어야 할 필요를 대신하지는 않는다.",
    "twist": "감사를 받은 뒤에도 역할을 줄여달라고 말할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 준비 수고를 말하고 다음 일정의 담당을 요청한다."
      }
    ],
    "repairAction": "인정받고 싶은 부분과 실제 필요한 몫을 따로 말한다.",
    "counterexample": "구체적인 감사가 충분해도 실제 과부하가 있다면 인정의 부족이 아니라 역할 조정이 필요할 수 있다.",
    "applicationLimit": "실제 희생의 역사나 상대의 무감사를 생성하지 않는다.",
    "distinctFromOtherParagraphs": "인정 수신과 생활 부담의 독립성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 희생의 역사나 상대의 무감사를 생성하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P2:need-deep-understood",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "깊은 관계에서 원하는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "깊게 이해받고 싶은 필요에서 상대가 동의해야 한다는 요구를 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "유지 조건",
        "knowledge": "deep_true_connection은 본인의 연결 선호 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "성향적 이유",
        "knowledge": "이유를 설명하고 들은 뜻을 확인하는 방법을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "이해받을 때",
        "knowledge": "의견이 달라도 중요했던 마음을 알아갈 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "충족되지 않을 때",
        "knowledge": "내 생각을 모두 이해할 의무를 상대에게 주지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a469049c0715564eddeb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DEPTH:context-layer",
        "axis": "DEPTH",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "중요한 뜻을 말할 기회",
    "risk": "다른 답을 이해 부족으로 해석",
    "factBomb": "이해했다는 답과 동의한다는 답은 같은 것이 아니다.",
    "twist": "다르게 생각하면서도 소중한 이유를 인정할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 의견 차이에서 왜 중요했는지만 먼저 설명한다."
      }
    ],
    "repairAction": "동의 요청 전에 들은 뜻을 확인한다.",
    "counterexample": "의견이 같아도 중요한 이유를 듣지 않는다면 깊은 이해의 조건은 확인되지 않았다.",
    "applicationLimit": "실제 정서적 결핍이나 상처를 만들지 않는다.",
    "distinctFromOtherParagraphs": "깊이의 선호와 합의 결과를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 정서적 결핍이나 상처를 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P2:need-not-changed-person",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "깊은 관계에서 원하는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "자기 목표를 지지받고 싶은 필요를 상대가 모든 목표를 대신 떠받치는 역할과 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "유지 조건",
        "knowledge": "independence_support_need는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "성향적 이유",
        "knowledge": "지지가 필요한 부분과 본인이 맡을 부분을 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "이해받을 때",
        "knowledge": "응원과 실제 도움을 각각 요청할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "충족되지 않을 때",
        "knowledge": "상대의 목표와 여력도 별도 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "61214d91803abc1b85d2"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "각자의 도전을 관계 안에 둘 가능성",
    "risk": "지원받을 권리를 일방적인 우선순위로 만들기",
    "factBomb": "내 목표가 중요하다는 사실이 상대의 시간을 먼저 예약하지는 않는다.",
    "twist": "직접 돕지 않는 응원도 유효할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바쁜 주에 필요한 도움과 혼자 할 몫을 나눠 말한다."
      }
    ],
    "repairAction": "도움의 범위를 묻고 거절 가능한 대안을 둔다.",
    "counterexample": "상대가 지원을 제공할 여력이 없다면 다른 도움을 찾거나 목표 수행의 몫을 조정해야 한다.",
    "applicationLimit": "상대의 직업·여력·능력을 본인 자료에서 만들지 않는다.",
    "distinctFromOtherParagraphs": "자기 목표와 관계 참여의 균형",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 직업·여력·능력을 본인 자료에서 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P2:need-return-signal",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "깊은 관계에서 원하는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "깊은 관계에서 혼자 정리할 필요와 다시 연결될 정보를 함께 원하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "유지 조건",
        "knowledge": "개인 몰입 필요가 실제 본인에게 맞는지 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "성향적 이유",
        "knowledge": "쉬는 이유를 모두 설명하지 않아도 가능한 시점은 알릴 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "이해받을 때",
        "knowledge": "상대가 무기한 기다리지 않도록 선택 정보를 남긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "충족되지 않을 때",
        "knowledge": "연락하지 못한 이유를 실제 과거 사실로 채우지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2f90ecfe06a11bd76f98"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "공간을 지키며 재연결할 통로",
    "risk": "친밀함을 이유로 대화의 기한을 생략",
    "factBomb": "돌아올 말을 하지 않으면 혼자 쉬는 시간도 상대에게는 대기시간이 된다.",
    "twist": "짧은 안내로 긴 해명을 줄일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 지금은 혼자 정리하고 저녁에 이야기하겠다고 알린다."
      }
    ],
    "repairAction": "돌아올 때와 지금 답할 수 있는 최소 정보를 정한다.",
    "counterexample": "안전하지 않거나 원치 않는 대화라면 다시 연결될 시간을 약속할 의무가 없다.",
    "applicationLimit": "쉬는 필요를 회피형 진단으로 바꾸지 않는다.",
    "distinctFromOtherParagraphs": "상대가 기다릴지 고를 정보를 남기는 친밀함",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "쉬는 필요를 회피형 진단으로 바꾸지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P3:space-chosen-company",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "애정과 독립성의 균형",
    "researchKind": "mbti_application",
    "coreMeaning": "같은 활동을 하되 각자 참여 강도를 고를 수 있는 친밀함을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "친밀감과 공간",
        "knowledge": "shared_hobby_bond는 본인 취미 연결 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "명리와 MBTI",
        "knowledge": "같이 하는 취미와 쉬고 싶은 시간을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "서로 다른 필요",
        "knowledge": "같은 장소에서 다른 활동을 해도 관계 참여가 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "거리와 소통",
        "knowledge": "함께하는 활동의 존재는 실제 입력으로 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "bab526a6c2566c56931d"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "axis": "RELATION_STYLE",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "계속 반응하지 않아도 편한 시간을 고를 가능성",
    "risk": "같은 취미를 가져야 가까워진다고 요구",
    "factBomb": "취미가 겹치는 것과 모든 시간을 같이 쓰는 것은 다르다.",
    "twist": "다르게 쉬면서도 다시 만날 자리를 둘 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 같은 방에서 각자 읽은 뒤 짧게 이야기를 나눈다."
      }
    ],
    "repairAction": "같이할 부분과 각자할 부분을 고른다.",
    "counterexample": "같은 공간에 있는 것 자체가 쉬기 어렵다는 답이라면 함께 다른 활동을 하는 장면은 맞지 않을 수 있다.",
    "applicationLimit": "실제 상대의 취미나 관계 만족을 만들지 않는다.",
    "distinctFromOtherParagraphs": "공간의 공동 사용과 지속 반응 요구의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 취미나 관계 만족을 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P3:space-not-passcode",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "애정과 독립성의 균형",
    "researchKind": "legacy_application",
    "coreMeaning": "친밀함을 개인 정보의 무제한 접근으로 증명하지 않는 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "친밀감과 공간",
        "knowledge": "기존 boundary는 편집 응용이며 실제 signed 근거를 별도 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "명리와 MBTI",
        "knowledge": "공유할 생활 정보와 개인 메시지의 사생활을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "서로 다른 필요",
        "knowledge": "거절해도 불이익이 없어야 공유가 선택으로 남는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "거리와 소통",
        "knowledge": "의심을 해결하려 비밀번호 공개를 기본값으로 권하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "86ce278eca349b89b4d4"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "가깝게 지내면서도 사적 범위를 고를 가능성",
    "risk": "공개량을 신뢰의 유일한 증거로 삼기",
    "factBomb": "믿는다는 말은 전부 검사하겠다는 권한이 아니다.",
    "twist": "사생활을 인정하는 것이 신뢰를 지킬 방법이 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 일정은 공유하되 개인 메시지 접근은 거절한다."
      }
    ],
    "repairAction": "필요한 공동 정보와 사적 정보를 구분한다.",
    "counterexample": "공동 일정처럼 실제로 함께 필요한 정보는 개인 메시지의 사생활과 같은 범위로 숨기지 않는다.",
    "applicationLimit": "감시·통제·강요를 성격 차이로 설명하지 않는다.",
    "distinctFromOtherParagraphs": "친밀감의 경계와 동의를 직접 다룸",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "감시·통제·강요를 성격 차이로 설명하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P3:space-care-fusion",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "애정과 독립성의 균형",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "관계를 아끼면서 혼자 있고 싶은 두 필요를 동시에 말하는 조건부 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "친밀감과 공간",
        "knowledge": "C077 양측 근거는 실제 본인의 source assignment로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "명리와 MBTI",
        "knowledge": "상대의 필요가 보이더라도 가능한 지원의 시간을 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "서로 다른 필요",
        "knowledge": "일부 도움을 주고 쉬는 선택을 함께 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "거리와 소통",
        "knowledge": "돌봄과 독립이 모순된 성격이라고 평가하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fa83818c7308d0737c2f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "두 필요를 숨기지 않고 조절",
    "risk": "도와준 뒤 아무 설명 없이 끊기",
    "factBomb": "아끼는 마음이 크다고 내 시간이 없어져야 하는 것은 아니다.",
    "twist": "한계를 먼저 말하면 돌봄도 더 정확히 고를 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 함께 해결할 부분과 다음 날 도울 부분을 나눈다."
      }
    ],
    "repairAction": "지금 가능한 도움과 개인 시간을 동시에 알린다.",
    "counterexample": "기존 양측 근거가 있어도 긴급한 공동 책임이 있다면 쉬는 시간의 배정부터 따로 협의해야 한다.",
    "applicationLimit": "한쪽 근거가 없으면 결합 설명을 쓰지 않는다.",
    "distinctFromOtherParagraphs": "CH01 방식 소개와 달리 실제 가까운 장면의 조율",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "한쪽 근거가 없으면 결합 설명을 쓰지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P3:space-recovery-attunement",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "애정과 독립성의 균형",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "상대 반응을 살피느라 쓴 에너지와 실제 회복 방법을 분리하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "친밀감과 공간",
        "knowledge": "C080은 실제 부하와 양측 source 조건이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "명리와 MBTI",
        "knowledge": "상대의 감정 관리가 모두 내 역할인지 질문한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "서로 다른 필요",
        "knowledge": "교류를 줄일지 다른 방식으로 쉴지 선택할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "거리와 소통",
        "knowledge": "눈치가 좋으면 반드시 사람을 피해야 한다는 규칙은 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1be2f30bf579c8de2ede"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "회복 필요를 말할 통로",
    "risk": "항상 괜찮은 표정을 유지하다 갑자기 거리 두기",
    "factBomb": "반응을 잘 읽는다고 늘 반응할 의무는 없다.",
    "twist": "함께 조용히 쉬는 선택도 회복일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 모임 후 답장 시간을 조절하고 필요한 연락만 남긴다."
      }
    ],
    "repairAction": "실제 회복 선호를 듣고 가능한 참여를 고른다.",
    "counterexample": "사회적 교류가 실제로 회복이 되는 경우에는 반응을 줄이는 처방을 기본값으로 두지 않는다.",
    "applicationLimit": "본인이나 상대의 소진을 진단하지 않는다.",
    "distinctFromOtherParagraphs": "개인 공간과 실제 부하 인식은 별도 정보",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "본인이나 상대의 소진을 진단하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P4:sustain-small-promises",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "오래 관계를 유지하는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "오래 유지할 힘을 작은 약속의 이행과 수정으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "지속 강점",
        "knowledge": "본인의 신뢰 중심 자료가 실제로 맞는지 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "실제 근거",
        "knowledge": "크게 약속하기보다 가능한 범위를 먼저 말한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "오랜 관계의 행동",
        "knowledge": "지키기 어려워지면 수정할 수 있어야 반복이 선택으로 남는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "과사용 방지",
        "knowledge": "반복이 관계 유지의 보장은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5190684455c102b45097"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "기대할 행동을 작게 명확히 할 가능성",
    "risk": "관계를 지키려고 감당 못 할 약속을 계속 늘리기",
    "factBomb": "오래 하겠다는 말보다 지금 가능한 몫이 먼저다.",
    "twist": "약속을 줄이는 것이 지킬 힘을 남길 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 매일 긴 통화 대신 가능한 짧은 안부를 정한다."
      }
    ],
    "repairAction": "빈도·변경 안내·어려운 날의 대안을 정한다.",
    "counterexample": "실제로 지킬 수 없는 상태가 이어진다면 약속의 표현만 바꾸는 것보다 역할·자원의 조정이 필요할 수 있다.",
    "applicationLimit": "유형으로 충실함이나 관계 지속 기간을 예측하지 않는다.",
    "distinctFromOtherParagraphs": "지속 강점의 행동 단위와 과용 방지",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "유형으로 충실함이나 관계 지속 기간을 예측하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P4:sustain-current-person",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "오래 관계를 유지하는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "익숙한 사람을 예전 취향에 고정하지 않고 현재 관심을 듣는 지속 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "지속 강점",
        "knowledge": "warm_confidant_partner는 본인의 대화 관심 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "실제 근거",
        "knowledge": "새 관심이 생겼는지 물으며 기억을 갱신한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "오랜 관계의 행동",
        "knowledge": "변화를 배신이나 이전 모습의 상실로 보지 않을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "과사용 방지",
        "knowledge": "모든 변화에 같이 참여할 의무는 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "96a809889e7203550ec2"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CURIOSITY:question-making",
        "axis": "CURIOSITY",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "다시 알아갈 대화의 여지",
    "risk": "새로움을 계속 보여줘야 사랑받는다고 요구",
    "factBomb": "지금도 안다고 믿는 순간이 새 이야기를 놓칠 때일 수 있다.",
    "twist": "새 경험이 없어도 현재 생각은 달라질 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 최근 달라진 관심과 그대로 좋아하는 것을 묻는다."
      }
    ],
    "repairAction": "새 답 하나를 듣고 과거 답과 비교 평가하지 않는다.",
    "counterexample": "지금도 같은 취향이 편하다는 실제 답을 받으면 새 관심을 보여달라는 요구를 추가하지 않는다.",
    "applicationLimit": "실제 상대의 변화나 애정 감소를 만들지 않는다.",
    "distinctFromOtherParagraphs": "새 이벤트보다 사람의 정보 갱신",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 변화나 애정 감소를 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P4:sustain-repair-access",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "오래 관계를 유지하는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "오래가는 관계에서 완벽히 다투지 않는 것보다 다시 말할 통로를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "지속 강점",
        "knowledge": "trust_repair_pace는 inferred 원천임을 유지한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "실제 근거",
        "knowledge": "언제 어떤 범위로 다시 이야기할지 합의할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "오랜 관계의 행동",
        "knowledge": "마음이 바로 풀리지 않아도 행동의 수정은 별도로 시작할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "과사용 방지",
        "knowledge": "상대가 원하지 않는 회복을 강요하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "855363fd8de29e58adea"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "갈등 뒤에도 선택 가능한 대화",
    "risk": "용서할 때까지 기다리게 하거나 즉시 용서를 요구",
    "factBomb": "미안하다는 말은 상대의 회복 시간을 끝내는 버튼이 아니다.",
    "twist": "거리와 대화의 조건을 같이 둘 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 어려운 대화 뒤 다음에 확인할 항목과 시간을 남긴다."
      }
    ],
    "repairAction": "재대화 여부·시점·중단 조건을 각각 묻는다.",
    "counterexample": "상대가 회복이나 재대화를 원하지 않으면 통로를 열어둔다는 이유로 계속 연락하지 않는다.",
    "applicationLimit": "위협·학대 상황에서 화해를 의무로 두지 않는다.",
    "distinctFromOtherParagraphs": "장기 강점을 관계 회복 접근성으로 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "위협·학대 상황에서 화해를 의무로 두지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH05.P4:sustain-reciprocal-expression",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "오래 관계를 유지하는 힘",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "표현을 지속하는 힘에 지금도 맞는 방식인지 확인하는 조건을 더한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "지속 강점",
        "knowledge": "기존 C082가 실제 양측 source를 충족해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "실제 근거",
        "knowledge": "연락이나 행동의 반복이 상대에게 부담인지 물어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "오랜 관계의 행동",
        "knowledge": "주기가 달라져도 합의한 관심 통로는 남길 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "과사용 방지",
        "knowledge": "한 가지 행동을 사랑의 유일한 척도로 쓰지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5cee60f48e9d45ace3fb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "생활 변화에 맞춰 표현을 이어갈 가능성",
    "risk": "같은 반응을 매번 연출하게 하기",
    "factBomb": "꾸준한 관계에는 바꿔 말할 수 있는 표현도 필요하다.",
    "twist": "반복을 줄이고 더 정확히 전달할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 일이 늘어난 달에는 연락 방식의 수신을 다시 확인한다."
      }
    ],
    "repairAction": "가능한 표현과 반가운 수신을 동시에 묻는다.",
    "counterexample": "같은 표현이 부담이라고 확인되면 꾸준함을 유지하기보다 방식을 바꾸는 것이 먼저다.",
    "applicationLimit": "실제 빈도나 관계의 성과를 만들지 않는다.",
    "distinctFromOtherParagraphs": "CH04의 현재 재조정보다 장기 지속 원칙",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "실제 빈도나 관계의 성과를 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  }
];
