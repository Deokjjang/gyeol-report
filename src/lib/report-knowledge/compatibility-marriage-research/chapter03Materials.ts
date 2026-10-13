/** Offline marriage research; no runtime binding or customer approval. */
import type { MarriageMaterial } from "./researchTypes";
export const MARRIAGE_CH03_MATERIALS: readonly MarriageMaterial[] = [
  {
    "id": "cmpr:material:CH03.P1:b-adaptable-day-plan",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B의 독립적인 원천은 생활 운영의 어떤 질문을 만드는가?",
    "coreMeaning": "B가 생활의 선택을 넓힐 가능성과 변경 뒤 남는 책임을 함께 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "B의 자유와 합의 선호는 B의 독립 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "편재 정의는 B 원국에 실제 해당 조건이 있는지 별도로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "B의 ENFP marriage trait를 A의 안정 원천과 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "새 제안의 처리 비용과 맡을 사람까지 말할 때 선택에 보탬이 된다.",
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
      },
      {
        "owner": "B",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "actual_natal_condition_required",
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
      "planning",
      "transition"
    ],
    "positive": "바뀐 여건에 맞는 대안을 찾을 가능성",
    "risk": "변경만 제안하고 취소·재예약은 A에게 남김",
    "factBomb": "새로운 답을 찾았다고 이전 준비가 사라지는 것은 아니다.",
    "twist": "변경의 뒷일을 맡으면 새로움도 공동 기여가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 휴일 계획을 바꿀 때 기존 예약의 처리를 함께 제안한다."
    },
    "senderAdjustment": "제안·확정·기존 약속 처리를 나눈다.",
    "recipientQuestion": "이번 변경 때문에 다시 해야 할 일과 그 담당은 무엇인가?",
    "counterexample": "실제 변경 비용이 없고 양쪽이 편하면 즉흥성 자체를 문제로 만들지 않는다.",
    "distinctFromOtherParagraphs": "B의 변경 기여와 A의 실제 손해를 구분",
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
      "natalDefinitions": [
        {
          "owner": "B",
          "sourceKey": "bbc18a4e615032647a49",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "이번 변경 때문에 다시 해야 할 일과 그 담당은 무엇인가?",
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
    "id": "cmpr:material:CH03.P1:b-visible-practical-support",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B의 독립적인 원천은 생활 운영의 어떤 질문을 만드는가?",
    "coreMeaning": "B의 직접 해결하는 표현을 생활 업무의 책임 범위와 구분하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "B의 실제 도움 방식은 B trait에서 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "식신 정의를 B의 현재 솜씨나 실제 수리 능력으로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "B의 ISTP marriage 원천과 A의 생활 합의 필요는 별개다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "무엇을 맡고 어디에서 지원을 요청할지 설명해야 한다.",
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
        "owner": "B",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "actual_natal_condition_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRACTICALITY:use-test",
        "axis": "PRACTICALITY",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
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
    "householdTopics": [
      "household",
      "decision"
    ],
    "positive": "필요한 실행을 구체화할 가능성",
    "risk": "해결 가능한 부분만 하고 확인은 상대가 알아서 하리라 기대",
    "factBomb": "고쳤다는 말과 다음에도 관리한다는 약속은 다른 정보다.",
    "twist": "완료의 뜻을 짧게 말하면 행동도 더 분명하게 전달될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 선택한다면 B가 물건 점검 뒤 남은 확인과 전문 도움이 필요한 범위를 알린다."
    },
    "senderAdjustment": "현재 한 일·앞으로 맡을 일·맡지 못할 일을 나눈다.",
    "recipientQuestion": "지금 끝난 부분과 이후에도 확인할 부분은 어디인가?",
    "counterexample": "실제 기술·안전 정보가 없으면 위험한 작업을 직접 하도록 권하지 않는다.",
    "distinctFromOtherParagraphs": "B의 실행 통로와 검증된 기술 능력 분리",
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
      "natalDefinitions": [
        {
          "owner": "B",
          "sourceKey": "90e77590d3ea07930ba1",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "지금 끝난 부분과 이후에도 확인할 부분은 어디인가?",
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
    "id": "cmpr:material:CH03.P2:b-sensory-common-space",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 중요하게 여길 필요를 A의 기준과 어떻게 구분하는가?",
    "coreMeaning": "B가 편한 공간의 조건을 공동 공간의 합의와 구분해 말할 필요를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "소리·냄새·취향·휴식의 감각은 B의 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "A의 생활 질서 선호가 공용 공간의 정답은 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "공유 공간과 개인 공간의 바꿀 범위를 함께 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "몸으로 느끼는 불편도 동의받은 선택으로 전달해야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "b42d6c513c37bfd7f4ee",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:STABILITY:minimum-security",
        "axis": "STABILITY",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "autonomy",
      "household"
    ],
    "positive": "공동 공간에서 놓친 사용 조건을 알릴 가능성",
    "risk": "불편을 숨기다가 모든 환경 변경을 거절",
    "factBomb": "말하지 않은 편안함은 상대가 맞혀야 할 시험이 아니다.",
    "twist": "작은 환경 조건 하나를 말하면 전체를 바꾸지 않아도 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 밤의 소리와 조명 중 어려운 항목 하나를 설명한다."
    },
    "senderAdjustment": "현재 불편·가능한 조정·개인에게 남길 범위를 나눈다.",
    "recipientQuestion": "공동으로 바꿀 조건과 각자 공간에서 고를 조건은 무엇인가?",
    "counterexample": "현재 주거 환경이나 장애·건강 정보를 입력 없이 특정하지 않는다.",
    "distinctFromOtherParagraphs": "B의 편안함 조건이며 A의 과거 배려 부족 판정 아님",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "b42d6c513c37bfd7f4ee"
        },
        {
          "owner": "A",
          "type": "ESTJ",
          "sourceKey": "ab15fd60b429d7c073a5"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "공동으로 바꿀 조건과 각자 공간에서 고를 조건은 무엇인가?",
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
    "id": "cmpr:material:CH03.P2:b-acknowledgement-not-assignment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 중요하게 여길 필요를 A의 기준과 어떻게 구분하는가?",
    "coreMeaning": "B가 수고를 알아주길 원하는 조건과 실제 담당을 다시 나눌 필요를 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "B의 감사 수신 자료는 B의 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "A의 지원 필요를 B의 계속된 책임으로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "칭찬과 실제 업무 이전은 서로 다른 선택이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "B가 맡고 싶지 않은 일도 말할 수 있어야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0c283e400d1572c869f6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "40735f88ad4496657858",
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
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
      "rest"
    ],
    "positive": "보이지 않는 수고를 이야기할 통로",
    "risk": "인정받으면 계속 혼자 맡아도 된다는 합의",
    "factBomb": "고맙다는 말이 다음 일의 담당자를 바꾸지는 않는다.",
    "twist": "수고를 줄이는 조정이 감사보다 더 필요한 날도 있을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 한다면 B가 기억해 온 구매·연락 업무 중 넘길 항목을 고른다."
    },
    "senderAdjustment": "감사 표현과 역할 재협의를 따로 요청한다.",
    "recipientQuestion": "알아주길 바라는 일과 실제로 덜 맡고 싶은 일은 무엇인가?",
    "counterexample": "B가 실제 그 일을 했다는 입력이 없으면 지난 헌신으로 서술하지 않는다.",
    "distinctFromOtherParagraphs": "B의 인정 필요와 생활 책임의 이전을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "0c283e400d1572c869f6"
        },
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "40735f88ad4496657858"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "알아주길 바라는 일과 실제로 덜 맡고 싶은 일은 무엇인가?",
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
    "id": "cmpr:material:CH03.P3:b-family-boundary-contribution",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B가 제공할 가능성이 있는 지원의 적용 조건은 무엇인가?",
    "coreMeaning": "B의 관계망을 살피는 관심이 두 사람의 사생활을 함께 지킬 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "B의 친족·사회 경계 trait와 개인 RELATION_STYLE·BOUNDARY root를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 개인 정보·시간은 A에게 별도로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "가족에게 알릴 내용과 아직 논의 중인 내용은 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "관계를 잘 챙긴다는 가능성은 친족을 대신 통제한다는 뜻이 아니다.",
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
      "autonomy"
    ],
    "positive": "연락의 범위와 전달 담당을 논의할 기회",
    "risk": "두 사람의 선택을 모두 외부에 설명할 의무로 만듦",
    "factBomb": "가족을 잘 챙긴다는 말이 상대의 사생활을 대신 공개할 권한은 아니다.",
    "twist": "덜 알리는 선택도 관계의 경계를 유지하는 기여가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 가족 행사를 논의한다면 B가 알릴 일정과 공개하지 않을 개인 사정을 A와 고른다."
    },
    "senderAdjustment": "전달할 정보의 범위와 동의를 확인한다.",
    "recipientQuestion": "어떤 내용은 함께 전하고 어떤 것은 각자에게 남길 것인가?",
    "counterexample": "특정 친족의 간섭·성격·요구가 실제로 있다고 추론하지 않는다.",
    "distinctFromOtherParagraphs": "B의 외부 관계 기여와 A의 정보 소유권 구분",
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
      "direction": null,
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
      "question": "어떤 내용은 함께 전하고 어떤 것은 각자에게 남길 것인가?",
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
    "id": "cmpr:material:CH03.P3:b-useful-simplification",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B가 제공할 가능성이 있는 지원의 적용 조건은 무엇인가?",
    "coreMeaning": "B가 반복 업무의 절차를 줄일 아이디어를 실제 인수인계와 연결할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "B의 시스템 제안 원천과 개인 AUTONOMY·CARE를 검증한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 돌봄 책임 trait가 도구를 운영할 의무는 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "누가 쓸 수 있고 오류를 어떻게 발견할지 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "제안의 좋은 점은 실제 확인 부담이 줄 때만 검토한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
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
        "owner": "B",
        "sourceKey": "fa83818c7308d0737c2f",
        "sourceUse": "both_same_person_roots_required",
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
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "invisibleLabor"
    ],
    "positive": "반복 기억을 외부 도구로 옮길 여지",
    "risk": "설계는 B가 하고 유지·수정은 A에게 자동 배정",
    "factBomb": "새 도구를 도입했다면 그 도구를 돌보는 일도 새로 생긴다.",
    "twist": "작은 시험과 되돌릴 조건이 있으면 편리함을 실제로 확인할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 B가 공유 목록 하나를 시험하고 접근·수정·누락 확인을 맡아본다."
    },
    "senderAdjustment": "도구의 제안자와 운영 담당을 함께 정한다.",
    "recipientQuestion": "이 방법이 누구의 기억을 줄이고 누구의 확인을 늘리는가?",
    "counterexample": "상대가 접근하거나 사용하기 어려운 도구라면 효율적인 해법으로 확정하지 않는다.",
    "distinctFromOtherParagraphs": "B의 개선 기여와 A의 실제 관리 부담 구분",
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
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "이 방법이 누구의 기억을 줄이고 누구의 확인을 늘리는가?",
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
    "id": "cmpr:material:CH03.P4:b-avoids-budget-answer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B의 방식이 공동 준비나 확인을 생략하는 조건은 무엇인가?",
    "coreMeaning": "B가 불편한 재정 논의를 미룰 때 동의하지 않은 선택이 확정될 수 있는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "B의 갈등 회피 원천은 실제 불편을 숨겼다는 사건이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "A의 명확한 재정 권한 선호와 B의 아직 답하지 못한 이유는 별도다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "동의한 비용과 검토 중인 비용을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "거절·보류를 말할 안전이 있어야 재논의가 가능하다.",
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
        "sourceKey": "8670a7cd306dd817250d",
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
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
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
    "householdTopics": [
      "financial",
      "decision"
    ],
    "positive": "보류를 합의의 정보로 남길 여지",
    "risk": "침묵을 동의로 해석하게 두고 뒤늦게 전체 결정을 철회",
    "factBomb": "아직 답이 없다는 상태를 괜찮다는 약속으로 남겨두면 비용이 먼저 확정될 수 있다.",
    "twist": "모르겠다는 답과 다시 볼 때를 함께 말하면 결정권을 지킬 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 구매를 검토한다면 B가 아직 확인 못한 비용 항목과 답할 때를 알린다."
    },
    "senderAdjustment": "현재 동의 범위와 추가 검토를 명시한다.",
    "recipientQuestion": "어떤 정보가 더 있어야 결정하거나 거절할 수 있는가?",
    "counterexample": "B가 이미 거절했다면 더 잘 설명하지 못한 탓으로 돌리지 않는다.",
    "distinctFromOtherParagraphs": "B의 정보 제공 책임과 자유로운 거절을 함께 유지",
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
          "type": "ESTJ",
          "sourceKey": "8670a7cd306dd817250d"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "어떤 정보가 더 있어야 결정하거나 거절할 수 있는가?",
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
    "id": "cmpr:material:CH03.P4:b-expands-social-cost",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B의 방식이 공동 준비나 확인을 생략하는 조건은 무엇인가?",
    "coreMeaning": "B의 관계 행사 관심이 돈뿐 아니라 A의 휴식과 준비 시간을 사용할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "B의 행사·돌봄 예산 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "A의 개인 시간은 B의 사교를 위한 기본 자원이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "참여·준비·비용·이동·정리의 부담을 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "좋은 뜻의 행사여도 참석과 지원을 거절할 선택이 필요하다.",
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
        "sourceKey": "3ec17287e2091c585ba3",
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
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RECOVERY_NEED:rest-access",
        "axis": "RECOVERY_NEED",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "condition": "선호·돌봄·경제 제약을 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "family",
      "financial",
      "rest"
    ],
    "positive": "외부 관계와 생활 여력을 함께 볼 가능성",
    "risk": "체면을 지키려 공동 자원 사용을 먼저 약속",
    "factBomb": "가족을 위한 자리라도 두 사람의 시간까지 이미 허락받은 것은 아니다.",
    "twist": "규모나 참석 범위를 줄여도 마음을 전할 방법은 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 친족 모임을 계획한다면 B가 참석 시간과 준비 항목을 확정하기 전에 A에게 묻는다."
    },
    "senderAdjustment": "참석 동의와 준비 지원을 서로 다른 요청으로 제안한다.",
    "recipientQuestion": "참석 여부와 별개로 맡을 수 있는 준비가 있는가?",
    "counterexample": "실제 가족 행사나 지출이 없으면 이미 부담을 겪은 것처럼 쓰지 않는다.",
    "distinctFromOtherParagraphs": "B의 확장 비용이며 모든 가족 관계를 위험으로 보지 않음",
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
          "type": "ISTP",
          "sourceKey": "3ec17287e2091c585ba3"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": null,
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
      "question": "참석 여부와 별개로 맡을 수 있는 준비가 있는가?",
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
