/** Offline marriage research; no runtime binding or customer approval. */
import type { MarriageMaterial } from "./researchTypes";
export const MARRIAGE_CH06_MATERIALS: readonly MarriageMaterial[] = [
  {
    "id": "cmpr:material:CH06.P1:ba-receivable-help",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A가 수신자인 실제 십성 및 B의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "B→A의 정인 관계를 도움을 받을 통로와 A가 실제로 수락한 지원으로 구분해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B의 돌봄 제안 가능성은 B trait에서 출발한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 일간을 viewer로 B 일간을 본 실제 정인 결과가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 A가 받을 도움과 직접 마칠 일을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A가 안심하거나 의지했다는 실제 감정을 명리 관계로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "fe11b875c7ad3a9c8318",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "4b07fe3f9004cfc8a777",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "65948269d71f3a38b299",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:AUTONOMY:chosen-support",
        "axis": "AUTONOMY",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "autonomy"
    ],
    "positive": "선택한 지원을 받아볼 가능성",
    "risk": "B가 보호해 준다는 뜻으로 A의 선택을 먼저 끝냄",
    "factBomb": "도움받을 여지가 있다고 누구에게 무엇을 맡길지가 정해지는 것은 아니다.",
    "twist": "받지 않을 부분을 말할 수 있어야 도움도 선택으로 남는다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 A의 남은 일을 듣고 요청한 한 단계만 맡는다."
    },
    "senderAdjustment": "제안한 지원과 실제 수락한 범위를 구분한다.",
    "recipientQuestion": "받고 싶은 도움과 직접 이어갈 부분은 무엇인가?",
    "counterexample": "A 기준 정인 결과나 실제 수락 조건이 없으면 도움받은 사실로 사용하지 않는다.",
    "distinctFromOtherParagraphs": "정인 수신 상징과 B의 실제 돌봄 능력을 구별",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "4b07fe3f9004cfc8a777"
        },
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "65948269d71f3a38b299"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_BA",
          "sourceKey": "fe11b875c7ad3a9c8318",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "받고 싶은 도움과 직접 이어갈 부분은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P1:ba-question-hidden-upkeep",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A가 수신자인 실제 십성 및 B의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "B→A의 편인 관계를 익숙한 생활 절차의 이유와 숨은 유지 일을 물을 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B의 시스템 제안은 B source로 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 일간에서 B를 본 실제 편인 결과를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 반복 업무의 이유와 실제 필요한 단계를 하나씩 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "B가 실제 통찰을 주거나 A의 방식이 비효율적이라고 단정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "78ca1a3776c53c2d0b48",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "d8ee6a6775c1d5a71420",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "f3c3648ae7632ade1bdb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "c97137956156f94d70da",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CURIOSITY:question-making",
        "axis": "CURIOSITY",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "invisibleLabor",
      "household"
    ],
    "positive": "당연히 맡았던 일을 다시 설명할 기회",
    "risk": "이유를 묻는 질문이 A의 수고를 불필요하다고 평가",
    "factBomb": "왜 하는지 묻는 말에는 지금까지 누가 했는지도 들어가야 한다.",
    "twist": "줄일 일뿐 아니라 계속 필요한 일도 더 잘 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 검토한다면 B가 반복 구매의 확인 이유를 듣고 줄일 단계를 함께 고른다."
    },
    "senderAdjustment": "질문·검증된 필요·수정 제안을 나눈다.",
    "recipientQuestion": "그 확인을 하지 않으면 실제 어떤 일이 남는가?",
    "counterexample": "편인 결과가 없으면 해당 명리 자극으로 설명하지 않으며 실제 업무 누락도 만들지 않는다.",
    "distinctFromOtherParagraphs": "B의 질문과 A의 유지 부담을 수신자 기준으로 연구",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "d8ee6a6775c1d5a71420"
        },
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "f3c3648ae7632ade1bdb"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_BA",
          "sourceKey": "78ca1a3776c53c2d0b48",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "그 확인을 하지 않으면 실제 어떤 일이 남는가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P1:ba-enjoyment-with-maintenance",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A가 수신자인 실제 십성 및 B의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "B→A의 식신 관계를 생활의 즐거움과 그것을 유지할 자원의 선택으로 구분해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B의 함께 즐기는 활동 선호는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A를 viewer로 B 일간을 본 기존 식신 결과만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 활동 준비와 이후 정리까지 범위를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A가 실제 즐거웠거나 긴장이 풀렸다고 예언하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "e880c2158a048d04ef23",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "3e5a71d4f1d3543288c0",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "financial"
    ],
    "positive": "기존 일상에 원하는 활동을 보탤 여지",
    "risk": "즐거우니 시간·비용·뒷정리는 설명하지 않아도 된다고 여김",
    "factBomb": "좋은 시간을 제안해도 그 뒤의 정리가 저절로 끝나지는 않는다.",
    "twist": "작은 활동을 고르면 즐거움과 유지 책임을 함께 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 집에서 할 활동과 준비·정리 담당을 A와 고른다."
    },
    "senderAdjustment": "활동의 제안과 전체 부담을 같이 설명한다.",
    "recipientQuestion": "이번 활동에서 함께 즐길 부분과 감당할 준비는 어디까지인가?",
    "counterexample": "식신 결과나 A의 참여 의사가 없으면 좋은 효과를 확정하지 않는다.",
    "distinctFromOtherParagraphs": "식신의 정의와 실제 공동 활동의 선택 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESFP",
          "sourceKey": "e880c2158a048d04ef23"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "3e5a71d4f1d3543288c0"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_BA",
          "sourceKey": "90e77590d3ea07930ba1",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "이번 활동에서 함께 즐길 부분과 감당할 준비는 어디까지인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P1:ba-peer-voice-not-identical-needs",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A가 수신자인 실제 십성 및 B의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "B→A의 비견 관계를 각자 의견을 가진 채 생활 약속에 참여할 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B의 자율성과 기본 합의 필요는 B의 실제 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 일간을 기준으로 본 B의 실제 비견 결과가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 같은 생활 항목에 대한 서로 다른 최소 조건을 말한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "같은 십성이라고 A/B의 행동과 실제 감정을 동일하게 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "3f130780549c6cb7a467",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ca7a14f7190d5daca6c5",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "ab15fd60b429d7c073a5",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "decision",
      "autonomy"
    ],
    "positive": "동등하게 의견을 낼 질문",
    "risk": "같은 답을 해야 대등한 관계라고 강요",
    "factBomb": "같은 오행 분류가 같은 생활 기준을 뜻하지는 않는다.",
    "twist": "비슷한 관계 분류에서도 다른 답이 나와야 선택이 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 공간을 정한다면 B가 자기 조건을 말하고 A도 별도로 기준을 설명한다."
    },
    "senderAdjustment": "의견을 낼 권리와 결과의 동일함을 구분한다.",
    "recipientQuestion": "동의하는 부분과 다른 답을 유지할 부분은 무엇인가?",
    "counterexample": "양방향이 같은 비견이면 다른 명리 효과를 임의로 만들어 구별하지 않는다.",
    "distinctFromOtherParagraphs": "수렴 가능한 방향 의미에서도 원천과 수신자를 유지",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "ca7a14f7190d5daca6c5"
        },
        {
          "owner": "A",
          "type": "ESTJ",
          "sourceKey": "ab15fd60b429d7c073a5"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_BA",
          "sourceKey": "3f130780549c6cb7a467",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "동의하는 부분과 다른 답을 유지할 부분은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P2:ba-update-family-information",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 지원이 A의 준비와 유지까지 덜어주려면 무엇이 필요한가?",
    "coreMeaning": "B가 가족 연락의 정보를 보탤 때 A가 함께 결정할 범위를 지킬 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 관계망 관심과 개인 경계 root는 B에게만 배정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 개인 정보·목표·시간은 A source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "요청받은 내용과 아직 답하지 않은 범위를 구분해 전달한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "관계를 잘 이어준다는 이유로 A의 지원을 미리 약속하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "24baf614208a551324d1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "65948269d71f3a38b299",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "48f610dc9f5d9e5b4404",
        "sourceUse": "both_same_person_roots_required",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "family",
      "decision"
    ],
    "positive": "공동 검토에 필요한 정보를 덜어줄 가능성",
    "risk": "외부의 기대를 확정된 의무로 전달",
    "factBomb": "누군가 부탁했다는 사실과 우리가 맡았다는 약속은 다른 단계다.",
    "twist": "미정인 상태를 정확히 전하는 것도 관계를 돌보는 일일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 친족 행사를 논의한다면 B가 요청 내용만 전하고 A에게 참여 범위를 묻는다."
    },
    "senderAdjustment": "전달한 사실·새 요청·공동 답변을 분리한다.",
    "recipientQuestion": "지금 요청받은 것 중 함께 결정할 항목은 무엇인가?",
    "counterexample": "특정 가족의 요구·경제 사정·성격을 입력 없이 생성하지 않는다.",
    "distinctFromOtherParagraphs": "B의 정보 기여와 A의 동의 여부를 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "24baf614208a551324d1"
        },
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "65948269d71f3a38b299"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "지금 요청받은 것 중 함께 결정할 항목은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P2:ba-prepare-changed-work-window",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 지원이 A의 준비와 유지까지 덜어주려면 무엇이 필요한가?",
    "coreMeaning": "B가 생활 변화의 대안을 보탤 때 A에게 준비할 정보를 줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 새 경험·합의 관심과 A의 변화 검토 자료는 독립적이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "현재 일·소득이 바뀌었다는 사실을 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 변화의 시작·기간·남을 담당을 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "A가 즉시 같은 속도로 따라갈 의무는 없다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "ede67b716c40fbe4b6c4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "axis": "ADAPTABILITY",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "transition",
      "planning"
    ],
    "positive": "여건 변화에 맞는 선택을 미리 살필 여지",
    "risk": "새 계획만 말하고 이전 약속의 처리는 생략",
    "factBomb": "다음 계획이 생겨도 이전 일의 끝은 아직 남아 있을 수 있다.",
    "twist": "끝내거나 넘길 일을 먼저 정하면 새 선택이 덜 무거워질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 근무 시간이 달라진다면 B가 바뀔 가사 구간과 임시 담당을 A와 고른다."
    },
    "senderAdjustment": "변경될 조건·유지할 결과·재검토 때를 함께 알린다.",
    "recipientQuestion": "무엇이 언제부터 달라지고 어떤 일은 그대로 남는가?",
    "counterexample": "실제 직업·근무·수입 변화가 확인되지 않으면 일어난 사건으로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "B의 대안과 A가 준비할 시간을 연결",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "ede67b716c40fbe4b6c4"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "무엇이 언제부터 달라지고 어떤 일은 그대로 남는가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P2:ba-quiet-maintenance-report",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 지원이 A의 준비와 유지까지 덜어주려면 무엇이 필요한가?",
    "coreMeaning": "B의 조용한 실행이 A에게 현재 맡은 범위를 알아볼 정보로 도착할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 행동 중심 표현은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 생활 합의 자료가 더 긴 감정 보고의 의무를 뜻하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "무엇을 끝냈고 무엇이 남았는지 짧게 알려준다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "수고를 알아봤는지는 실제 A의 답을 기다린다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "aee3349d23ea4285cd4f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "76e292b7c203da2c2773",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "invisibleLabor"
    ],
    "positive": "중복 확인과 남은 일의 혼동을 줄일 여지",
    "risk": "아무 말 없이 일부만 끝내고 전체를 맡았다고 여김",
    "factBomb": "말없이 했다는 장점에도 아직 남은 일은 알려야 한다.",
    "twist": "한 줄의 완료 정보가 긴 해명보다 정확할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 맡은 점검 뒤 남은 확인 한 가지를 A에게 알린다."
    },
    "senderAdjustment": "완료·미완료·다음 담당만 짧게 전한다.",
    "recipientQuestion": "현재 내가 끝낸 일과 당신이 알고 있어야 할 미정 항목은 무엇인가?",
    "counterexample": "A가 보고를 원하지 않거나 합의 범위가 다르면 소통량을 무조건 늘리지 않는다.",
    "distinctFromOtherParagraphs": "B의 행동을 알아볼 정보와 A의 실제 감정 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "aee3349d23ea4285cd4f"
        },
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "76e292b7c203da2c2773"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "현재 내가 끝낸 일과 당신이 알고 있어야 할 미정 항목은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P2:ba-new-routine-small-test",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 지원이 A의 준비와 유지까지 덜어주려면 무엇이 필요한가?",
    "coreMeaning": "B의 새로운 생활 아이디어가 A의 안정 조건을 유지하며 시험될 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 개인 STRUCTURE_STYLE·ADAPTABILITY root와 context를 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 안정적 생활 관심은 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 새 방법에서 유지할 결과·시험 범위·되돌릴 때를 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "새로움을 원한다는 자료만으로 효율적이라고 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0f0ff8ddade0c147030c",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "4438f18bddb2caa9cb2c",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "743668481abf74260870",
        "sourceUse": "both_same_person_roots_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ADAPTABILITY:feedback-uptake",
        "axis": "ADAPTABILITY",
        "definition": "받은 정보의 유효 부분을 반영",
        "condition": "정보의 신뢰성과 권한을 확인",
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
    "householdTopics": [
      "household",
      "transition"
    ],
    "positive": "유지 부담을 다른 방법으로 살필 기회",
    "risk": "실험을 계속 바꾸어 A가 모든 예외를 수습",
    "factBomb": "시도는 새로워도 뒤처리를 늘 같은 사람이 한다면 같은 분담이다.",
    "twist": "종료 조건이 있으면 안정 선호도 실험의 일부가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 식사 준비의 한 단계만 바꾸고 예외 대응을 맡는다."
    },
    "senderAdjustment": "제안자가 맡을 시험 운영과 복원 범위를 말한다.",
    "recipientQuestion": "이 방법을 멈출 조건과 되돌릴 담당은 누구인가?",
    "counterexample": "해당 Fusion이 현재 결혼 projection에 허용된다는 사실로 자동 승격하지 않는다.",
    "distinctFromOtherParagraphs": "B의 실험 기여와 A의 지속 조건을 함께 검토",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "0f0ff8ddade0c147030c"
        },
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "4438f18bddb2caa9cb2c"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "이 방법을 멈출 조건과 되돌릴 담당은 누구인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P3:ba-visible-only-finish",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 방식 때문에 A에게 남는 기다림과 뒤처리는 무엇일 수 있는가?",
    "coreMeaning": "B가 보이는 실행만 끝낼 때 A에게 확인·기억 업무가 남을 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 직접 처리 방식은 실제로 일부만 했다는 경험이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A의 운영 합의 필요는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "실행했다는 의도와 A가 계속 관리할 가능성을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "끝의 기준이 없으면 A의 추가 요청과 B의 피로가 반복될 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "aee3349d23ea4285cd4f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "76e292b7c203da2c2773",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "c97137956156f94d70da",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "invisibleLabor",
      "household"
    ],
    "positive": "완료 범위를 다시 맞출 질문",
    "risk": "도와줬다는 말로 이후 확인을 모두 A에게 남김",
    "factBomb": "눈에 보이는 일이 끝나도 다음 일을 기억할 사람이 남을 수 있다.",
    "twist": "작은 업무 전체를 맡으면 요청 횟수도 줄어들 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활의 구매를 맡는다면 B가 주문 뒤 수령·보관·누락 확인까지 맡을지 말한다."
    },
    "senderAdjustment": "끝난 단계와 남은 관리 업무를 드러낸다.",
    "recipientQuestion": "지금 내가 끝냈다고 보는 지점과 당신에게 남은 일은 어디인가?",
    "counterexample": "실제 업무를 입력 없이 배정하거나 이미 불공평했다고 판정하지 않는다.",
    "distinctFromOtherParagraphs": "B의 완료 정의가 A에게 남길 비용",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "aee3349d23ea4285cd4f"
        },
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "76e292b7c203da2c2773"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "지금 내가 끝냈다고 보는 지점과 당신에게 남은 일은 어디인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P3:ba-kinship-commitment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 방식 때문에 A에게 남는 기다림과 뒤처리는 무엇일 수 있는가?",
    "coreMeaning": "B가 외부 가족의 행사·지출을 먼저 약속할 때 A의 자원 선택이 줄어들 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 행사 예산 관심은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A의 개인 재량은 실제 공동 비용·시간 정보와 별도로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "관계를 챙기려는 의도와 A가 이미 담당으로 정해질 가능성을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "외부 약속을 취소할 비용이 생긴 뒤 A의 동의를 묻는 순서가 부담이 될 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "eca31a528cf641ff4613",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "65948269d71f3a38b299",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d14789ba6fb57b594e8d",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "family",
      "financial"
    ],
    "positive": "친족 요청을 공동 검토로 바꿀 기회",
    "risk": "가족을 위한 뜻으로 A의 시간·지출을 미리 배정",
    "factBomb": "이미 하겠다고 말했다면 상대의 선택은 나중에 도착한다.",
    "twist": "확인 후 답하겠다는 한마디가 외부 관계와 개인 재량을 함께 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 가족 행사를 논의한다면 B가 아직 확정하지 않은 지원 범위를 A에게 먼저 묻는다."
    },
    "senderAdjustment": "외부 요청과 내부 공동 동의를 분리한다.",
    "recipientQuestion": "다른 사람에게 약속하기 전에 무엇을 함께 확인해야 하는가?",
    "counterexample": "가족의 실제 권리·법적 의무·간섭 사실을 이 자료로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "B가 외부에 약속하는 순서의 방향별 비용",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "eca31a528cf641ff4613"
        },
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "65948269d71f3a38b299"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "다른 사람에게 약속하기 전에 무엇을 함께 확인해야 하는가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P3:ba-change-without-handover",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 방식 때문에 A에게 남는 기다림과 뒤처리는 무엇일 수 있는가?",
    "coreMeaning": "B가 계획을 바꾸면서 남은 일을 넘기지 않을 때 A에게 유지 부담이 생길 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 자유·합의 원천과 A의 변화 완충 원천을 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "변경을 원한다는 자료로 실제 약속 위반을 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "변경 이유와 남은 업무의 인수인계를 다른 질문으로 다룬다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "A가 모든 예외를 알아서 처리할 것이라는 기대가 반복 비용이 될 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "ede67b716c40fbe4b6c4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
    "householdTopics": [
      "transition",
      "household"
    ],
    "positive": "변화에 맞춘 역할 조정의 기회",
    "risk": "남은 일을 말하지 않고 새 일정으로 이동",
    "factBomb": "바뀐 일정이 알려져도 누가 남은 일을 맡는지는 별도다.",
    "twist": "담당을 줄이거나 일을 생략하는 선택도 인수인계의 일부일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 근무 시간 변경을 검토한다면 B가 유지할 일과 조정할 일을 A와 나눈다."
    },
    "senderAdjustment": "변경 사실·잔여 업무·임시 담당을 함께 말한다.",
    "recipientQuestion": "지금까지 방식으로 계속하기 어려운 일과 잠시 줄일 일은 무엇인가?",
    "counterexample": "현재 일·소득·시간 제약이 확인되지 않으면 발생한 전환으로 서술하지 않는다.",
    "distinctFromOtherParagraphs": "B의 변경과 A에게 남는 유지 책임 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "ede67b716c40fbe4b6c4"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "지금까지 방식으로 계속하기 어려운 일과 잠시 줄일 일은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P3:ba-unanswered-plan",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 방식 때문에 A에게 남는 기다림과 뒤처리는 무엇일 수 있는가?",
    "coreMeaning": "B가 불편한 의견을 보류할 때 A에게 없는 동의로 전달될 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 갈등 회피 원천은 B에게만 배정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A의 빠른 결정 필요는 B에게 즉시 동의할 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "생각 중·반대·동의를 다른 상태로 알릴 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "미정임을 알리지 않으면 A가 선택한 이후 되돌릴 비용이 커질 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "be9cb942010f0a199f50",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "bb5cae1a58466e6ff51a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DECISION_STYLE:option-hold",
        "axis": "DECISION_STYLE",
        "definition": "가능성을 남길 이유와 기한을 설명",
        "condition": "보류의 이익과 비용을 비교할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "decision",
      "autonomy"
    ],
    "positive": "선택 상태를 명료하게 할 여지",
    "risk": "괜찮다는 말 뒤에 실제 반대 조건을 모두 남김",
    "factBomb": "부드럽게 넘긴 답이 합의로 남으면 다음 선택이 먼저 움직인다.",
    "twist": "완성된 답이 없어도 보류 이유 하나는 말할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활 계획을 검토한다면 B가 아직 결정 못한 조건과 다시 말할 때를 알린다."
    },
    "senderAdjustment": "현재 답의 상태와 검토 시간을 명시한다.",
    "recipientQuestion": "지금 동의한 부분과 아직 답하지 않은 부분은 어디인가?",
    "counterexample": "B가 이미 분명히 거절했다면 A가 존중하지 않은 문제를 B의 표현 탓으로 돌리지 않는다.",
    "distinctFromOtherParagraphs": "B의 응답 정보와 A의 결정 권한을 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "be9cb942010f0a199f50"
        },
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "bb5cae1a58466e6ff51a"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "지금 동의한 부분과 아직 답하지 않은 부분은 어디인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P4:ba-state-completion-boundary",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 먼저 확인할 범위와 A에게 남길 선택은 무엇인가?",
    "coreMeaning": "B가 한 업무를 맡을 때 완료 수준과 이후 확인을 함께 제안하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B는 현재 맡은 일과 아직 맡지 않은 단계를 말한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A의 기준과 직접 확인하고 싶은 부분을 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "완료·예외 알림·다음 점검 담당을 한 업무에서 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "B가 같은 방식을 따라야만 책임진 것으로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "aee3349d23ea4285cd4f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "76e292b7c203da2c2773",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "c97137956156f94d70da",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "invisibleLabor",
      "repair"
    ],
    "positive": "반복 요청을 줄일 책임 합의",
    "risk": "기준만 받아 적고 계속 A에게 다음 지시를 요구",
    "factBomb": "매번 무엇을 할지 물어야 한다면 맡은 범위를 다시 정할 필요가 있다.",
    "twist": "필요한 정보를 한 번에 넘기면 다른 방식으로도 끝낼 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 정기 구매 업무의 종료 기준과 누락 알림을 A와 정한다."
    },
    "senderAdjustment": "방법의 재량과 완료 책임을 같이 제안한다.",
    "recipientQuestion": "내가 혼자 마칠 수 있으려면 어떤 정보와 권한이 필요한가?",
    "counterexample": "실제 접근·기술·시간이 없는 업무를 무리하게 맡으라는 조언은 아니다.",
    "distinctFromOtherParagraphs": "B의 인수 범위와 A의 관리 부담 감소",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "aee3349d23ea4285cd4f"
        },
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "76e292b7c203da2c2773"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "내가 혼자 마칠 수 있으려면 어떤 정보와 권한이 필요한가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P4:ba-confirm-before-external-promise",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 먼저 확인할 범위와 A에게 남길 선택은 무엇인가?",
    "coreMeaning": "B가 외부에 약속하기 전에 A의 비용·시간·정보 공개 동의를 확인하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B는 실제 요청과 아직 확정하지 않은 답을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A가 참여하지 않을 권리와 함께 볼 공동 영향을 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "참석·지원·공개할 정보를 별도의 선택으로 둔다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "좋은 가족 관계를 이유로 A의 선택을 대신하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "eca31a528cf641ff4613",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "65948269d71f3a38b299",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d14789ba6fb57b594e8d",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "family",
      "repair"
    ],
    "positive": "외부 약속의 범위를 함께 고를 여지",
    "risk": "A가 거절하면 체면을 잃게 했다고 책임을 돌림",
    "factBomb": "확인 없이 한 약속의 수습을 상대의 배려 의무로 만들 수는 없다.",
    "twist": "잠깐 보류하는 답이 오래 지킬 약속을 더 정확히 만들 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 친족 모임을 준비한다면 B가 확인 후 답할 내용만 먼저 알린다."
    },
    "senderAdjustment": "외부 답변의 효력과 공동 확정 조건을 나눈다.",
    "recipientQuestion": "지금 단독으로 답할 수 있는 내용과 확인이 필요한 내용은 무엇인가?",
    "counterexample": "실제 친족의 요구가 없으면 갈등이 이미 생긴 것으로 회고하지 않는다.",
    "distinctFromOtherParagraphs": "B의 대외 약속 조정이며 A의 성격 평가 아님",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "eca31a528cf641ff4613"
        },
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "65948269d71f3a38b299"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "지금 단독으로 답할 수 있는 내용과 확인이 필요한 내용은 무엇인가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P4:ba-handover-before-new-schedule",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 먼저 확인할 범위와 A에게 남길 선택은 무엇인가?",
    "coreMeaning": "B가 새 생활 조건을 선택할 때 이전 책임의 임시 조정을 함께 제안하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B는 바뀔 조건과 아직 모르는 기간을 알린다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A의 현재 여력을 유형에서 추정하지 않고 직접 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "줄일 일·넘길 일·유지할 일과 재점검 때를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "A의 이전 동의를 무기한 추가 담당으로 늘리지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "ede67b716c40fbe4b6c4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:STABILITY:protective-change",
        "axis": "STABILITY",
        "definition": "지속을 위해 필요한 변경을 수용",
        "condition": "유지할 가치와 바꿀 방법을 구분",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "transition",
      "repair"
    ],
    "positive": "변경과 지속의 책임을 함께 볼 가능성",
    "risk": "새 계획의 좋은 점만 말하고 부담을 감수하라고 기대",
    "factBomb": "변화를 지지한다는 답이 남은 모든 일을 맡겠다는 약속은 아니다.",
    "twist": "일부를 줄이는 계획이 새 목표를 더 오래 지키게 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 학업을 다시 시작한다면 B가 기존 가사 중 임시로 조정할 항목을 A와 고른다."
    },
    "senderAdjustment": "전환을 지지하는 일과 업무를 맡는 동의를 구분한다.",
    "recipientQuestion": "어떤 임시 약속을 언제 다시 검토하면 좋은가?",
    "counterexample": "학업·이직·사업·소득 변화가 실제로 일어났다는 사실은 생성하지 않는다.",
    "distinctFromOtherParagraphs": "B의 전환 제안과 A의 실제 지원 가능성 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "ede67b716c40fbe4b6c4"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "어떤 임시 약속을 언제 다시 검토하면 좋은가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cmpr:material:CH06.P4:ba-name-pending-answer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 먼저 확인할 범위와 A에게 남길 선택은 무엇인가?",
    "coreMeaning": "B가 완성된 답을 기다리지 않고 검토 중인 상태를 A에게 전달하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B는 동의하지 않은 부분을 한 항목으로 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A가 지금 결정에 필요한 정보를 무엇으로 보는지 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "지금 가능한 답·추가 자료·다시 말할 때를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "A의 실망이나 재촉을 피하려 동의를 연기하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "be9cb942010f0a199f50",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "bb5cae1a58466e6ff51a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "decision",
      "repair"
    ],
    "positive": "보류도 공동 결정의 정보로 남길 가능성",
    "risk": "아직 모르겠다는 말만 반복하고 검토 통로를 닫음",
    "factBomb": "답이 미정이어도 언제 무엇을 더 볼지는 함께 정할 수 있다.",
    "twist": "짧은 보류 설명이 전체를 방어하는 긴 말보다 정확할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 지출을 고른다면 B가 아직 모르는 유지 비용과 확인할 자료를 말한다."
    },
    "senderAdjustment": "보류의 이유와 실제 검토 범위를 명시한다.",
    "recipientQuestion": "어떤 자료를 더 보면 답하거나 거절할 수 있는가?",
    "counterexample": "거절의 안전이 없으면 표현 훈련으로 책임을 B에게 전가하지 않는다.",
    "distinctFromOtherParagraphs": "B의 답할 권리와 공동 결정의 필요한 정보 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "be9cb942010f0a199f50"
        },
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "bb5cae1a58466e6ff51a"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "sourceUsesAreConjunctive": true,
      "mbtiPair": "두 유형이 모두 입력된 경우 실제 forward와 reverse 원천의 marriagePattern·sourceCoverage를 각각 확인한다. 예측 법칙이나 개인 점수에 더하지 않는다.",
      "fusion": "A/B 개인별 기존 rule과 같은 사람의 명리·MBTI 두 root 및 실제 source assignment를 확인한다. 기존 context·domain 밖이면 보류하고 후속 검토한다.",
      "canonicalPair": "지원되는 실제 cross-person 관계 ID·종류·참여자·기둥·성립 조건을 확인한다. 미지원 형·파·원진·천간합 정의를 검출 결과로 바꾸지 않는다.",
      "unknownMbti": "해당 사람의 MBTI·개인 Fusion·양방향 Pair 후보를 보류한다. 상대 유형·원국으로 생성하지 않는다.",
      "unknownBirthTime": "시주 및 시주가 필요한 관계를 보충하지 않는다. 확인된 나머지 기둥만 사용한다.",
      "marriageStatus": "UNKNOWN: marriage 카테고리와 내부 married 편집 값은 실제 혼인·동거 사실이 아니다.",
      "householdFacts": "소득·재산·채무·직업·자녀·부모 성격·가사 능력·과거 갈등은 입력에 없으므로 UNKNOWN이다.",
      "recall": "같은 person ID·원천·방향·조건으로 앞서 실제 표시된 의미만 회수한다. CH09에서 새로운 특징이나 사건을 도입하지 않는다.",
      "safety": "위협·폭력·감시·경제적 통제는 성향 차이로 정당화하거나 양쪽의 동등한 조율 문제로 만들지 않는다. 화해·동거를 강요하지 않는다."
    },
    "jointDecision": {
      "question": "어떤 자료를 더 보면 답하거나 거절할 수 있는가?",
      "authority": "공동 항목은 양쪽 동의, 개인 영역은 본인 선택. 실제 권한을 유형이나 소득으로 배정하지 않음.",
      "cost": "금액·시간·에너지의 실제 값은 UNKNOWN. 필요한 준비·실행·대기 비용을 조건부 질문으로 확인.",
      "reviewTrigger": "다음 같은 결정 또는 업무 주기에서 완료·남은 부담·예외를 확인",
      "processRoles": [
        "notice",
        "prepare",
        "decide",
        "execute",
        "monitor",
        "handle_exception",
        "remember_next_cycle"
      ],
      "assignedBy": "people_consent_not_gender_or_type"
    },
    "disallowed": [
      "미입력 혼인·동거·재정·자녀·가족 성격·직업·과거 사건 단정",
      "성별 또는 유형으로 가사·돌봄·승인권 배정",
      "합·공통축·반대유형을 성공·갈등·상호보완 보장으로 사용",
      "개인 root와 Fusion·Pair 참고를 독립 세 사실로 중복 집계",
      "투자·법률·세금 자문 및 임의 금액·비율 처방"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  }
];
