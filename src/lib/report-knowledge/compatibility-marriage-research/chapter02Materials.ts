/** Offline marriage research; no runtime binding or customer approval. */
import type { MarriageMaterial } from "./researchTypes";
export const MARRIAGE_CH02_MATERIALS: readonly MarriageMaterial[] = [
  {
    "id": "cmpr:material:CH02.P1:a-operating-standards",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A가 실제로 가진 성향 중 공동생활 운영에 쓸 조건은 무엇인가?",
    "coreMeaning": "A가 생활의 기준을 먼저 정하려는 가능성을 실제 책임·권한의 합의와 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "A의 일정·역할을 명확히 하는 선호를 A 자료에서 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "정관 정의는 A의 실제 원국 위치·성립 조건이 있어야 적용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "A의 ESTJ marriage 원천과 B의 기본 합의 필요를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "B가 바꿀 부분을 말할 수 있어야 기준이 공동 약속이 된다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ab15fd60b429d7c073a5",
        "sourceUse": "own_entered_type_only",
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
        "sourceKey": "ce1defc1af72408fec4a",
        "sourceUse": "actual_natal_condition_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:minimum-security",
        "axis": "STABILITY",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "planning"
    ],
    "positive": "해야 할 일을 예측할 단서",
    "risk": "명확함을 혼자 정할 권한으로 해석",
    "factBomb": "내가 먼저 정리했다고 상대가 이미 동의한 것은 아니다.",
    "twist": "기준을 수정할 수 있으면 설명도 짧아질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 선택한다면 A가 청소 완료 수준의 초안을 제안하고 B가 수정한다."
    },
    "senderAdjustment": "초안과 합의한 기준을 구분한다.",
    "recipientQuestion": "어디까지가 필요한 기본이고 어떤 부분은 A의 선호인가?",
    "counterexample": "A의 실제 원국이나 해당 trait가 없으면 관리 성향을 그 근거로 배정하지 않는다.",
    "distinctFromOtherParagraphs": "A의 생활 운영 출발점이며 실제 가사 실력 판정 아님",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ESTJ",
          "sourceKey": "ab15fd60b429d7c073a5"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "ca7a14f7190d5daca6c5"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "A",
          "sourceKey": "ce1defc1af72408fec4a",
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
      "question": "어디까지가 필요한 기본이고 어떤 부분은 A의 선호인가?",
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
    "id": "cmpr:material:CH02.P1:a-quiet-system-support",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A가 실제로 가진 성향 중 공동생활 운영에 쓸 조건은 무엇인가?",
    "coreMeaning": "A의 반복 업무를 시스템으로 다룰 가능성과 B의 생활 관리 관심을 따로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "A의 자동화·분담표 원천은 A에게만 적용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "식신 정의는 A 원국의 실제 성립 조건을 별도로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "INTP marriage의 시스템 선호는 현재 운영 능력의 증거가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "B가 실제 원하는 도움과 남는 확인 업무를 묻는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "d8ee6a6775c1d5a71420",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "657f0a60c702c59fd825",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "actual_natal_condition_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
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
      "invisibleLabor"
    ],
    "positive": "기억에만 기대지 않는 반복 업무를 검토할 가능성",
    "risk": "장치를 만든 뒤 예외 처리를 B에게 모두 남김",
    "factBomb": "자동으로 된다는 말 뒤에도 누군가는 오류를 확인한다.",
    "twist": "예외 담당을 정하면 도구가 실제 부담을 덜 여지가 생긴다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 정기 주문을 시험하며 누락 알림과 확인 담당을 정한다."
    },
    "senderAdjustment": "정상 작동과 예외 상황의 담당을 함께 제안한다.",
    "recipientQuestion": "장치가 멈췄을 때 누가 알아차리고 무엇을 할 수 있는가?",
    "counterexample": "도구 사용에 동의하지 않거나 실제 접근이 없으면 자동화를 필수 해법으로 정하지 않는다.",
    "distinctFromOtherParagraphs": "A의 기여 후보와 B에게 남는 관리 부담 구별",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "d8ee6a6775c1d5a71420"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "657f0a60c702c59fd825"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "A",
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
      "question": "장치가 멈췄을 때 누가 알아차리고 무엇을 할 수 있는가?",
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
    "id": "cmpr:material:CH02.P2:a-rest-is-a-resource",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 중요하게 여길 필요와 공동 책임은 어떻게 다른가?",
    "coreMeaning": "A가 혼자 정비할 시간을 필요로 하는 조건과 남은 생활 업무의 배분을 함께 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "개인 시간의 빈도·범위는 A의 source와 실제 선택으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "돌봄을 살피는 B의 trait가 A의 일을 대신할 의무는 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "쉬는 시간과 마치지 못한 일의 인수인계를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "양쪽의 휴식이 실제로 남는지를 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "3ec17287e2091c585ba3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "4b07fe3f9004cfc8a777",
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
        "id": "sar:facet:RECOVERY_NEED:rest-access",
        "axis": "RECOVERY_NEED",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "condition": "선호·돌봄·경제 제약을 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "rest",
      "household"
    ],
    "positive": "휴식과 담당을 함께 계획할 가능성",
    "risk": "A의 휴식을 위해 B의 대기를 무기한 남김",
    "factBomb": "내가 쉬는 동안 끝날 일이라면 누가 그 시간을 쓰는지 물어야 한다.",
    "twist": "할 일을 줄이는 선택도 휴식을 나누는 방법이다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A의 개인 활동 전 남은 정리와 다시 맡을 시간을 정한다."
    },
    "senderAdjustment": "휴식의 범위·남은 업무·재연결 시점을 말한다.",
    "recipientQuestion": "누가 쉬고 누가 대기하는지 실제 시간을 같이 볼 수 있는가?",
    "counterexample": "B가 이미 지친 상황을 A의 자유를 위한 지원 자원으로 간주하지 않는다.",
    "distinctFromOtherParagraphs": "A의 필요와 상대의 자원 소모를 한 사실로 합치지 않음",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTP",
          "sourceKey": "3ec17287e2091c585ba3"
        },
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "4b07fe3f9004cfc8a777"
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
      "question": "누가 쉬고 누가 대기하는지 실제 시간을 같이 볼 수 있는가?",
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
    "id": "cmpr:material:CH02.P2:a-meaning-needs-operations",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 중요하게 여길 필요와 공동 책임은 어떻게 다른가?",
    "coreMeaning": "A가 공동생활의 의미를 중시할 때 기본 운영 합의가 별도로 필요한 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "A의 가치 대화와 생활 합의 원천은 A 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "B의 최소 약속 선호는 A의 가치관을 대신 설명하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "돈·가사·일정 중 지금 함께 정할 항목 하나를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "같은 미래를 말해도 실제 담당은 별개다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "76e292b7c203da2c2773",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "1a999512214f329e5c2f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
      "decision",
      "household"
    ],
    "positive": "의미를 생활의 선택으로 옮길 가능성",
    "risk": "깊이 이해하면 알아서 할 것이라는 기대",
    "factBomb": "큰 가치에 동의해도 오늘의 담당은 아직 비어 있을 수 있다.",
    "twist": "작은 운영 약속이 중요한 가치를 지키는 방법이 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 준비한다면 편안한 집이라는 말에 필요한 일 하나씩을 적는다."
    },
    "senderAdjustment": "가치·결과·실행 담당을 나눈다.",
    "recipientQuestion": "지키고 싶은 가치가 이번 주에는 어떤 선택을 뜻하는가?",
    "counterexample": "실제 공동생활을 원하지 않는 경우 생활 합의를 관계의 의무로 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 의미 조건과 실제 역할의 연결 질문",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "76e292b7c203da2c2773"
        },
        {
          "owner": "B",
          "type": "ESTP",
          "sourceKey": "1a999512214f329e5c2f"
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
      "question": "지키고 싶은 가치가 이번 주에는 어떤 선택을 뜻하는가?",
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
    "id": "cmpr:material:CH02.P3:a-complete-task-ownership",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A의 강점이 상대의 일을 대신 정하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "A의 책임 관심을 업무 하나의 준비부터 확인까지 맡을 수 있는 조건부 기여로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "A의 역할 합의 trait와 개인 DUTY·CARE Fusion을 따로 검증한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "잘 맡는다는 가능성은 모든 가사를 배정할 이유가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "B와 업무의 완료 기준·예외 처리·지원 필요를 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "역할 교환과 줄일 수 있는 일의 선택도 남겨둔다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "3e5a71d4f1d3543288c0",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "b12fea8ea813649979b7",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "73f1ae9fb0a7c110106b",
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
    "householdTopics": [
      "household",
      "invisibleLabor"
    ],
    "positive": "책임의 끝을 알아볼 가능성",
    "risk": "A가 담당 목록 전체의 관리자까지 떠맡음",
    "factBomb": "끝까지 맡는 사람에게 모든 일의 시작까지 맡기면 분담은 줄어들지 않는다.",
    "twist": "완료를 맡기되 전체 배분은 함께 고를 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A가 소모품 하나의 확인·구매·보관·재점검을 맡아본다."
    },
    "senderAdjustment": "업무 하나의 범위와 전체 관리 책임을 구분한다.",
    "recipientQuestion": "완료까지 맡을 수 있는 일과 공동 조정이 필요한 일은 무엇인가?",
    "counterexample": "Fusion context·양쪽 root가 없으면 원천 trait만으로 결합 사실을 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 독립적 기여와 생활 전체의 책임 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "3e5a71d4f1d3543288c0"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "b12fea8ea813649979b7"
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
      "question": "완료까지 맡을 수 있는 일과 공동 조정이 필요한 일은 무엇인가?",
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
    "id": "cmpr:material:CH02.P3:a-notice-with-permission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A의 강점이 상대의 일을 대신 정하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "A의 필요를 알아차리는 관심이 B가 선택한 지원으로 도착할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "A의 돌봄·표현 관련 실제 개인 근거를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 독립적인 생각·시간은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "A가 발견한 문제와 B가 도움받고 싶은 문제를 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "거절하면 지원의 방식이나 크기를 다시 설득하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "4b07fe3f9004cfc8a777",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "65948269d71f3a38b299",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "16a8411e967484ac9826",
        "sourceUse": "both_same_person_roots_required",
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
    "positive": "필요한 부담을 정확히 덜 기회",
    "risk": "상대의 현재 필요를 대신 결정",
    "factBomb": "더 잘 챙길 수 있다는 생각이 대신 정할 권한은 아니다.",
    "twist": "물어보고 멈추는 행동도 돌봄의 일부가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활 중인 상황을 검토한다면 A가 B의 남은 일정에 어떤 지원이 필요한지 묻는다."
    },
    "senderAdjustment": "한 가지 도움을 제안하고 선택을 기다린다.",
    "recipientQuestion": "지금 직접 하고 싶은 부분과 도움을 고를 부분은 어디인가?",
    "counterexample": "실제 긴급 안전 의무가 있는 경우와 일상 선택 지원을 구분한다.",
    "distinctFromOtherParagraphs": "A의 관찰 강점을 B의 만족 사실로 바꾸지 않음",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "4b07fe3f9004cfc8a777"
        },
        {
          "owner": "B",
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
      "question": "지금 직접 하고 싶은 부분과 도움을 고를 부분은 어디인가?",
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
    "id": "cmpr:material:CH02.P4:a-management-becomes-permission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A의 좋은 의도가 상대의 시간과 재량을 줄이는 조건은 무엇인가?",
    "coreMeaning": "A의 비용 관리 관심이 B의 개인 지출까지 허가제로 바뀔 위험 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "공동 재정의 명확성을 원하는 원천은 A에게 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "B의 선택권 요구와 실제 자원 소유는 별도 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "공동 비용과 개인 재량의 범위를 먼저 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "안전하지 않은 경제적 통제는 절약 성향의 차이로 조율하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "8670a7cd306dd817250d",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "784d30632e34635a9483",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d14789ba6fb57b594e8d",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "cbdcf487f0263d4eb781",
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "financial",
      "autonomy"
    ],
    "positive": "공동 비용을 알아보기 쉬울 가능성",
    "risk": "기록을 요구하며 개인 재량을 사실상 차단",
    "factBomb": "관리하는 역할은 상대의 돈을 허락할 권한이 아니다.",
    "twist": "공유할 범위를 줄여도 공동 비용의 확인은 가능할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 생활비를 함께 관리한다면 A가 공동 항목만 정리하고 개인 내역은 동의 범위를 묻는다."
    },
    "senderAdjustment": "재정 정보의 목적과 열람 범위를 따로 정한다.",
    "recipientQuestion": "공동 결정에 필요한 정보와 각자에게 남길 사적 정보는 무엇인가?",
    "counterexample": "공동 비용·재산 정보가 없으면 실제 통제나 소득 수준을 판정하지 않는다.",
    "distinctFromOtherParagraphs": "A의 운영 자원과 B의 경제적 자율성 경계",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ESTJ",
          "sourceKey": "8670a7cd306dd817250d"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "784d30632e34635a9483"
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
      "question": "공동 결정에 필요한 정보와 각자에게 남길 사적 정보는 무엇인가?",
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
    "id": "cmpr:material:CH02.P4:a-corrects-unagreed-standard",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A의 좋은 의도가 상대의 시간과 재량을 줄이는 조건은 무엇인가?",
    "coreMeaning": "A가 익숙한 생활 기준을 합의하지 않은 정답으로 적용할 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "A의 기준 과용 자료는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "B의 감각적 편안함은 B source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "위생·안전의 필요와 개인 취향의 차이를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "상대가 실제로 불편했는지는 직접 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "1b7aeda1752892b8905a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "b42d6c513c37bfd7f4ee",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
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
      "household",
      "decision"
    ],
    "positive": "필요한 누락을 발견할 가능성",
    "risk": "완료한 일을 자기 방식이 아니라며 다시 시킴",
    "factBomb": "다시 하게 만든 시간이 누구의 기준을 위한 것인지 물어야 한다.",
    "twist": "필수 결과만 합의하면 방법의 차이는 남겨둘 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 수납 위치의 변경과 실제 찾기 어려운 문제를 나눠 말한다."
    },
    "senderAdjustment": "고칠 결과와 바꾸지 않아도 될 방법을 구분한다.",
    "recipientQuestion": "그 기준은 안전 때문인가, 함께 정한 조건인가, A의 선호인가?",
    "counterexample": "실제 안전 위험을 단순 취향 차이로 축소하지 않는다.",
    "distinctFromOtherParagraphs": "A의 과사용 비용이며 가사 능력의 우열 판정 아님",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "1b7aeda1752892b8905a"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "b42d6c513c37bfd7f4ee"
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
      "question": "그 기준은 안전 때문인가, 함께 정한 조건인가, A의 선호인가?",
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
