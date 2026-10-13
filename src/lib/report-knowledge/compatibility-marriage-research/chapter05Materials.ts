/** Offline marriage research; no runtime binding or customer approval. */
import type { MarriageMaterial } from "./researchTypes";
export const MARRIAGE_CH05_MATERIALS: readonly MarriageMaterial[] = [
  {
    "id": "cmpr:material:CH05.P1:ab-rule-with-revision",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B가 수신자인 실제 십성 및 A의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "A→B의 정관 관계를 생활 약속의 기준과 B의 실제 선택권을 함께 살필 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A가 기준을 제안할 때 B가 바꿀 항목이 남아야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B 일간을 viewer로 A 일간을 본 실제 정관 결과가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 공동생활 규칙의 초안과 수정할 때를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B가 책임감이나 안정감을 실제 느꼈다고 단정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "ce1defc1af72408fec4a",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "decision",
      "household"
    ],
    "positive": "기본 생활 약속을 알아볼 가능성",
    "risk": "규칙 제안을 B의 생활 전체를 관리할 권한으로 바꿈",
    "factBomb": "정관으로 보인다고 상대를 지휘할 권한이 생기는 것은 아니다.",
    "twist": "수정할 절차가 있으면 기준도 공동 선택으로 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A가 정리의 최소 결과를 제안하고 B가 방법을 고른다."
    },
    "senderAdjustment": "필수 결과·방법 재량·재검토 때를 분리한다.",
    "recipientQuestion": "어떤 기준은 편하고 어떤 부분은 직접 고르고 싶은가?",
    "counterexample": "B 기준 결과가 정관이 아니면 그 십성의 자극으로 설명하지 않는다.",
    "distinctFromOtherParagraphs": "수신자 B 기준의 실제 분류와 A의 행동 가설 분리",
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
          "owner": "DIRECTION_AB",
          "sourceKey": "ce1defc1af72408fec4a",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "어떤 기준은 편하고 어떤 부분은 직접 고르고 싶은가?",
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
    "id": "cmpr:material:CH05.P1:ab-resource-explanation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B가 수신자인 실제 십성 및 A의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "A→B의 정재 관계를 공동 비용의 범위를 구체적으로 묻는 조건부 자극으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A의 기준·정산 관심은 실제 개인 원천으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B 일간 기준으로 A를 본 기존 정재 결과만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상 공동 지출의 현재 비용과 이후 부담을 나눠 본다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B의 경제력·자산·실제 도움이나 돈이 늘어날 결과는 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "e2ed5b09b1f8185708cd",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "b64fa2920704301bf622",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "005c28927dc7664b56c9",
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
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
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
      "financial",
      "decision"
    ],
    "positive": "자원의 사용 범위를 알아볼 질문",
    "risk": "계산을 더 자세히 했다는 이유로 B의 우선순위를 배제",
    "factBomb": "비용을 잘 설명해도 상대의 동의까지 대신 계산할 수는 없다.",
    "twist": "설명을 줄이고 필요한 정보만 남겨도 함께 결정할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 생활비를 함께 관리한다면 A가 공동 항목의 기준을 보여주고 B가 목적을 보탠다."
    },
    "senderAdjustment": "재물 상징·개인 판단 선호·실제 비용 자료를 분리한다.",
    "recipientQuestion": "이 비용의 목적과 지금 감당할 수 있는 범위는 무엇인가?",
    "counterexample": "정재 결과나 실제 공동 비용 전제가 없으면 돈 관계의 사실로 배정하지 않는다.",
    "distinctFromOtherParagraphs": "정재의 정의와 생활 재정 질문을 연결하되 소득 추정 없음",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "b64fa2920704301bf622"
        },
        {
          "owner": "B",
          "type": "ESFP",
          "sourceKey": "005c28927dc7664b56c9"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "e2ed5b09b1f8185708cd",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "이 비용의 목적과 지금 감당할 수 있는 범위는 무엇인가?",
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
    "id": "cmpr:material:CH05.P1:ab-opportunity-with-maintenance",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B가 수신자인 실제 십성 및 A의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "A→B의 편재 관계를 새로운 생활 선택과 실제 유지 부담을 같이 검토할 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A의 현장 판단 선호는 A trait에서 출발한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B를 viewer로 A 일간을 본 실제 편재 결과를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 새 생활 방법의 시도 범위와 중단 조건을 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B가 실제 기회를 얻었다거나 경제적 성과가 생겼다고 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "7c9abcce396427f7c18f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "76e292b7c203da2c2773",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:OPPORTUNITY_SENSE:option-discovery",
        "axis": "OPPORTUNITY_SENSE",
        "definition": "새 연결에서 가능한 선택을 찾음",
        "condition": "접근 가능성과 조건 확인",
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
      "transition",
      "decision"
    ],
    "positive": "다른 생활 선택을 검토할 여지",
    "risk": "기회라는 말로 검토와 동의를 앞질러 확정",
    "factBomb": "좋은 기회여도 유지할 시간을 함께 고르지 않았다면 공동 계획이 아니다.",
    "twist": "작게 시험하는 선택은 기회를 버리는 일이 아닐 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 선택한다면 A가 외부 활동 계획을 제안하고 B가 생활에 미칠 범위를 묻는다."
    },
    "senderAdjustment": "시도할 내용과 유지·복원할 책임을 함께 말한다.",
    "recipientQuestion": "이 선택이 반복되면 누가 어떤 시간을 더 써야 하는가?",
    "counterexample": "실제 편재가 아니거나 B가 검토를 원하지 않으면 긍정 효과를 확정하지 않는다.",
    "distinctFromOtherParagraphs": "기회 상징과 실제 생활 변화의 선택 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ESTP",
          "sourceKey": "7c9abcce396427f7c18f"
        },
        {
          "owner": "B",
          "type": "INFJ",
          "sourceKey": "76e292b7c203da2c2773"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "bbc18a4e615032647a49",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "이 선택이 반복되면 누가 어떤 시간을 더 써야 하는가?",
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
    "id": "cmpr:material:CH05.P1:ab-standards-without-performance-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B가 수신자인 실제 십성 및 A의 원천은 어떤 도움 질문을 만드는가?",
    "coreMeaning": "A→B의 편관 관계를 기준의 긴장 가능성과 생활에서 평가받지 않을 필요를 구분해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A의 목표 추진은 A의 실제 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B 일간에서 A를 본 기존 편관 결과가 있어야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 마칠 일의 수준과 쉬는 범위를 따로 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B가 실제 압박을 받았다는 경험이나 A의 통제 성격을 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "f8f90022e047bfe61557",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "422820469afcb4fa68c4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "04bdba29a1fd1c319537",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "rest"
    ],
    "positive": "중요한 기준을 다시 살필 가능성",
    "risk": "집을 모든 행동이 평가받는 공간으로 만듦",
    "factBomb": "잘하자는 말이 많아질수록 쉴 수 있는지부터 확인해야 할 수 있다.",
    "twist": "완료 수준을 낮추는 선택이 필요한 책임을 더 잘 지키게 할 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A가 집안의 개선 항목 하나만 제안하고 B에게 유지 가능한 수준을 묻는다."
    },
    "senderAdjustment": "개선 과제와 사람에 대한 평가를 나눈다.",
    "recipientQuestion": "지금 꼭 바꿀 일과 그대로 두어도 되는 일은 무엇인가?",
    "counterexample": "편관 결과가 없으면 해당 긴장을 실제 방향 근거로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "방향의 명리 정의와 실제 평가·휴식 경험을 구별",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "422820469afcb4fa68c4"
        },
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "04bdba29a1fd1c319537"
        }
      ],
      "natalDefinitions": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "f8f90022e047bfe61557",
          "actualCalculatedRootRequired": true
        }
      ],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "지금 꼭 바꿀 일과 그대로 두어도 되는 일은 무엇인가?",
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
    "id": "cmpr:material:CH05.P2:ab-advance-plan-information",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 제안이 B의 생활 선택을 넓힐 조건은 무엇인가?",
    "coreMeaning": "A의 앞선 계획이 B에게 변경을 고를 정보를 줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 역할 구조 관심은 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 자유·합의 선호는 독립 source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 주간 계획에서 확정·초안·미정 항목을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "B가 검토할 여지가 있어야 A의 준비가 도움으로 작동할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "048c520649d4c0b898cb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "planning",
      "autonomy"
    ],
    "positive": "각자 시간을 조정할 정보",
    "risk": "초안부터 최종 일정처럼 공유",
    "factBomb": "계획을 알려주는 것과 함께 정하는 것은 다른 행동이다.",
    "twist": "미정 항목을 보이면 계획이 선택을 닫기보다 넓힐 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A가 휴일 초안을 공유하고 B가 바꿀 항목을 고른다."
    },
    "senderAdjustment": "확정 상태와 답할 때를 분명히 알린다.",
    "recipientQuestion": "이 중 함께 바꿀 수 있는 항목과 미리 알아야 할 항목은 무엇인가?",
    "counterexample": "B가 실제로 계획 정보를 원하지 않는다면 더 많은 일정 공유를 무조건 요구하지 않는다.",
    "distinctFromOtherParagraphs": "A의 준비가 B에게 주는 정보의 조건",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "048c520649d4c0b898cb"
        },
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "이 중 함께 바꿀 수 있는 항목과 미리 알아야 할 항목은 무엇인가?",
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
    "id": "cmpr:material:CH05.P2:ab-care-with-whole-task",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 제안이 B의 생활 선택을 넓힐 조건은 무엇인가?",
    "coreMeaning": "A의 돌봄 기여가 B의 반복 업무 하나를 실제로 덜어줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 책임·돌봄 양측 root를 실제 개인 Fusion으로 검증한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 시스템 선호는 전체 생활을 A에게 맡길 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "시작·준비·실행·확인 중 맡을 범위를 함께 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "실제 부담이 줄었는지는 B의 답과 현재 여건으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f3c3648ae7632ade1bdb",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
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
      "invisibleLabor"
    ],
    "positive": "일부 업무를 끝까지 맡길 선택",
    "risk": "돕는 과정에서 확인과 지시를 B에게 계속 요구",
    "factBomb": "실행만 맡아도 모든 설명이 상대에게 남으면 업무는 아직 나뉘는 중이다.",
    "twist": "끝까지 맡을 작은 일을 고르면 도움도 더 분명해질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활 중이라면 A가 한 번의 장보기를 맡을 때 품목 확인과 보관까지 범위를 정한다."
    },
    "senderAdjustment": "도움의 크기보다 실제 넘길 단계를 확인한다.",
    "recipientQuestion": "내가 맡으면 당신에게 남지 않을 일은 무엇인가?",
    "counterexample": "B가 직접 하기를 원하거나 A의 여력이 없으면 대신 맡기를 장점으로 강요하지 않는다.",
    "distinctFromOtherParagraphs": "A의 제공과 B의 관리 부담 감소를 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "f3c3648ae7632ade1bdb"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "d8ee6a6775c1d5a71420"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "내가 맡으면 당신에게 남지 않을 일은 무엇인가?",
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
    "id": "cmpr:material:CH05.P2:ab-expense-purpose-dialogue",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 제안이 B의 생활 선택을 넓힐 조건은 무엇인가?",
    "coreMeaning": "A의 비용 설명이 B의 생활 목적을 지우지 않고 공동 선택을 도울 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 예산 관심은 현재 수입이나 실제 예산 관리 실력이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 표현 비용 자료도 실제 소비 내역이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가격·사용 목적·반복 부담 중 함께 볼 항목을 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "설명이 상대를 설득해 이겨야 끝나는 과정이 되지 않아야 한다.",
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
        "sourceKey": "005c28927dc7664b56c9",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "financial",
      "decision"
    ],
    "positive": "서로의 우선순위를 알아볼 기회",
    "risk": "필요 비용을 낭비라거나 즐거움을 무책임으로 단정",
    "factBomb": "숫자가 자세하다고 다른 목적이 사라지는 것은 아니다.",
    "twist": "목적을 두 개 남겨두면 줄일 규모를 함께 고를 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 구매를 검토한다면 A가 이후 비용을 설명하고 B가 실제 원하는 사용을 말한다."
    },
    "senderAdjustment": "비용 정보와 가치 판단을 따로 묻는다.",
    "recipientQuestion": "둘 다 남기고 싶은 목적과 줄일 수 있는 규모는 무엇인가?",
    "counterexample": "실제 비용이 없으면 구체 금액·저축률·구매 결과를 생성하지 않는다.",
    "distinctFromOtherParagraphs": "A가 보태는 경제 정보와 B의 목적 수신",
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
          "type": "ESFP",
          "sourceKey": "005c28927dc7664b56c9"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "둘 다 남기고 싶은 목적과 줄일 수 있는 규모는 무엇인가?",
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
    "id": "cmpr:material:CH05.P2:ab-support-before-family-contact",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 제안이 B의 생활 선택을 넓힐 조건은 무엇인가?",
    "coreMeaning": "A가 외부 가족과의 조율을 맡을 때 B의 공개 동의를 지킬 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 사회 관계 원천과 개인 경계 root를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 개인 공간 선호는 실제 친족 갈등의 증거가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "연락에 포함할 내용과 확정해도 되는 범위를 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "상대를 대신 설명하거나 지원을 먼저 약속하지 않아야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "24baf614208a551324d1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "30b373f5892dd5de9b47",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
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
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "family",
      "autonomy"
    ],
    "positive": "불필요한 전달 부담을 덜 기회",
    "risk": "잘 조율하려고 B의 개인 사정까지 공개",
    "factBomb": "설명을 대신해 줄 수 있어도 공개할 내용을 대신 고를 수는 없다.",
    "twist": "대답을 늦추고 확인하는 일이 관계를 더 정확히 지킬 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 가족 모임을 논의한다면 A가 연락 전 B에게 전달할 일정만 확인한다."
    },
    "senderAdjustment": "전달 담당과 정보 결정권을 나눈다.",
    "recipientQuestion": "상대에게 알려도 되는 내용과 확인 후 답할 내용은 무엇인가?",
    "counterexample": "실제 가족 정보나 동의 없이 간섭한 친족·피해 경험을 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 대외 기여와 B의 정보 경계를 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "24baf614208a551324d1"
        },
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "30b373f5892dd5de9b47"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "상대에게 알려도 되는 내용과 확인 후 답할 내용은 무엇인가?",
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
    "id": "cmpr:material:CH05.P3:ab-unilateral-budget",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 편리함 때문에 B에게 남는 비용은 무엇일 수 있는가?",
    "coreMeaning": "A가 공동 비용의 기준을 먼저 확정할 때 B의 동의가 형식이 될 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 비용 관리 행동 가능성은 실제 소유권과 다르다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 최소 합의·자율성 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "효율을 위한 의도와 B가 고르지 못할 가능성을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "이미 결정한 뒤 허락을 받으면 수정할 비용이 B에게 남을 수 있다.",
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
        "sourceKey": "ca7a14f7190d5daca6c5",
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "financial",
      "decision"
    ],
    "positive": "재정 운영의 범위를 명확히 할 기회",
    "risk": "상대의 개인 재량까지 공동 기준으로 통합",
    "factBomb": "고르라고 말해도 이미 비용이 확정됐다면 선택은 뒤늦게 온다.",
    "twist": "확정 전에 미정으로 남기면 같은 관리 능력도 협의에 쓰일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활비를 정한다면 A가 임시안과 아직 합의하지 않은 항목을 따로 보여준다."
    },
    "senderAdjustment": "초안의 효력을 낮추고 B의 수정 시간을 둔다.",
    "recipientQuestion": "지금 바꿀 수 없는 것으로 처리된 항목이 있는가?",
    "counterexample": "위협·필수 자원 차단이 있으면 절약 방식 차이로 공동 조율하지 않는다.",
    "distinctFromOtherParagraphs": "A의 확정 순서가 만드는 방향별 비용",
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
          "sourceKey": "ca7a14f7190d5daca6c5"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "지금 바꿀 수 없는 것으로 처리된 항목이 있는가?",
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
    "id": "cmpr:material:CH05.P3:ab-holiday-finality",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 편리함 때문에 B에게 남는 비용은 무엇일 수 있는가?",
    "coreMeaning": "A가 생활 결정을 빠르게 확정할 때 B의 아직 정리되지 않은 조건이 빠질 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 명확한 결정 선호는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 내적 정리 필요는 B에게 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "침묵의 이유와 이미 동의한 범위를 같은 것으로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "바꿀 여지가 사라진 뒤 반대 이유를 묻는 순서가 악화를 만들 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "bb5cae1a58466e6ff51a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "04bdba29a1fd1c319537",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DECISION_STYLE:closure-criteria",
        "axis": "DECISION_STYLE",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "condition": "결정의 영향과 정보 범위가 명시될 때",
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
      "planning",
      "autonomy"
    ],
    "positive": "결정할 과제를 작게 정할 가능성",
    "risk": "대답이 느리다는 이유로 A가 전체 결론을 냄",
    "factBomb": "답할 시간을 주지 않았다면 동의가 늦다는 말부터 다시 봐야 한다.",
    "twist": "임시 결정을 표시하면 보류와 진행을 나눌 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살 집의 조건을 고른다면 A가 B의 미정 항목이 남은 상태에서 계약을 확정하지 않는다."
    },
    "senderAdjustment": "제안·검토·확정을 분리한다.",
    "recipientQuestion": "어떤 조건을 아직 말하지 못했으며 언제 검토할 수 있는가?",
    "counterexample": "법적 계약·실제 부동산 거래의 자문으로 쓰거나 특정 거래를 지시하지 않는다.",
    "distinctFromOtherParagraphs": "A의 주도와 B의 수신 시간을 구별",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "bb5cae1a58466e6ff51a"
        },
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "04bdba29a1fd1c319537"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "어떤 조건을 아직 말하지 못했으며 언제 검토할 수 있는가?",
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
    "id": "cmpr:material:CH05.P3:ab-care-as-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 편리함 때문에 B에게 남는 비용은 무엇일 수 있는가?",
    "coreMeaning": "A가 먼저 챙긴 일을 B의 보상 의무로 읽게 될 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 자연스럽게 맡는 원천은 A 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 반복 책임 자료가 실제 약속 위반을 뜻하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "요청한 일·자발적으로 한 일·합의한 담당을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "알아주길 기다리며 계속 맡으면 실제 조정을 말하기 어려워질 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f3c3648ae7632ade1bdb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "e79993a436c219093ea5",
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
      "household"
    ],
    "positive": "현재 맡은 범위를 재협의할 통로",
    "risk": "미리 한 수고를 나중에 같은 양의 빚으로 청구",
    "factBomb": "혼자 맡았다는 사실만으로 상대가 그 담당에 동의한 것은 아니다.",
    "twist": "다음 부탁을 명시하면 지난 수고를 계산하지 않고도 도움을 구할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 A가 소모품 관리 중 덜 맡을 단계를 B에게 구체적으로 요청한다."
    },
    "senderAdjustment": "현재 한 일과 다음에 합의할 일을 구분한다.",
    "recipientQuestion": "어느 단계부터 실제로 넘기고 싶은가?",
    "counterexample": "실제 수고·착취·희생의 과거를 입력 없이 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 제공 기대와 B의 동의 없는 채무를 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "f3c3648ae7632ade1bdb"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "e79993a436c219093ea5"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "어느 단계부터 실제로 넘기고 싶은가?",
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
    "id": "cmpr:material:CH05.P3:ab-standard-remakes",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 편리함 때문에 B에게 남는 비용은 무엇일 수 있는가?",
    "coreMeaning": "A가 완료한 일을 자신의 방식과 다르다는 이유로 반복 요구할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 기준 적용 위험은 실제 교정 행동이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 운영 공백 원천은 모든 결과가 틀렸다는 뜻이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "안전상 누락과 정돈 취향을 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "완료 기준을 뒤늦게 바꾸면 B의 실행 시간이 다시 소모될 수 있다.",
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
        "sourceKey": "c72ad7e4dbeab2b8b75f",
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
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "decision"
    ],
    "positive": "필요한 결과를 알아볼 가능성",
    "risk": "수정이 반복되며 B는 A의 확인만 기다림",
    "factBomb": "기준이 매번 끝난 뒤에 생기면 책임을 맡겨도 끝낼 수 없다.",
    "twist": "방법을 남겨 두고 결과를 합의하면 검토 횟수를 줄일 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공용 공간을 함께 정리한다면 A가 실제 찾기 어려운 항목만 설명한다."
    },
    "senderAdjustment": "앞선 기준과 새로 추가한 선호를 구분한다.",
    "recipientQuestion": "처음 합의한 완료 기준에서 무엇이 실제로 빠졌는가?",
    "counterexample": "실제 위생·안전 문제를 취향이라며 그대로 두라는 조언은 아니다.",
    "distinctFromOtherParagraphs": "A의 교정 비용이며 B의 실제 무능을 단정하지 않음",
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
          "type": "ENFP",
          "sourceKey": "c72ad7e4dbeab2b8b75f"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "처음 합의한 완료 기준에서 무엇이 실제로 빠졌는가?",
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
    "id": "cmpr:material:CH05.P4:ab-return-choice-before-commitment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 먼저 바꿀 행동과 B에게 남겨야 할 권한은 무엇인가?",
    "coreMeaning": "A가 결정 영향력을 쓰기 전에 B의 검토·거절 범위를 실제로 남기는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 확정 전 단계와 필요한 결정을 명시한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 정리할 조건과 답하기 어려운 부분을 별도 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "한 가지 제안의 효력과 다시 볼 때를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "B가 동의하지 않아도 검토에 참여할 권한이 남아야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "bb5cae1a58466e6ff51a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "04bdba29a1fd1c319537",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DECISION_STYLE:option-hold",
        "axis": "DECISION_STYLE",
        "definition": "가능성을 남길 이유와 기한을 설명",
        "condition": "보류의 이익과 비용을 비교할 때",
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
    "positive": "속도와 참여를 함께 고를 가능성",
    "risk": "검토 시간은 주지만 결론을 바꾸지 않음",
    "factBomb": "의견을 들었다는 말과 의견 때문에 바꿀 수 있다는 말은 다르다.",
    "twist": "미정인 범위를 보이면 빠른 사람도 기다릴 이유를 알 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 준비한다면 A가 선택안 두 개와 아직 확정하지 않은 조건을 설명한다."
    },
    "senderAdjustment": "결정의 효력과 변경 가능한 범위를 말한다.",
    "recipientQuestion": "내 제안에서 지금 바꿀 수 있는 부분은 무엇인가?",
    "counterexample": "안전상 즉시 필요한 임시 조치와 장기 공동 결정을 구분한다.",
    "distinctFromOtherParagraphs": "A의 조정 행동과 B의 실제 참여 조건",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "bb5cae1a58466e6ff51a"
        },
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "04bdba29a1fd1c319537"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "내 제안에서 지금 바꿀 수 있는 부분은 무엇인가?",
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
    "id": "cmpr:material:CH05.P4:ab-own-one-whole-process",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 먼저 바꿀 행동과 B에게 남겨야 할 권한은 무엇인가?",
    "coreMeaning": "A가 덜 맡고 싶은 일을 끝까지 넘길 조건을 B와 협의하는 조정 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 무엇을 알아차리고 확인해 왔는지 현재 사실을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 실제 시간·접근·필요 정보는 B에게 물어야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "담당·완료 기준·예외 알림을 한 업무에서 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "실행만 넘기고 계속 관리하는 구조를 당연하게 두지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f3c3648ae7632ade1bdb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "e79993a436c219093ea5",
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
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "invisibleLabor",
      "repair"
    ],
    "positive": "책임의 범위를 명확히 옮길 가능성",
    "risk": "A가 모든 지시를 계속 제공하며 분담됐다고 끝냄",
    "factBomb": "담당을 바꿨는데 기억하는 사람은 그대로라면 조정은 끝나지 않았다.",
    "twist": "작은 업무 전체를 옮기면 큰 목록을 반씩 나누는 것보다 분명할 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활을 한다면 A가 반복 구매 하나를 넘기며 필요한 정보와 확인 기준을 공유한다."
    },
    "senderAdjustment": "실행·관리·예외 대응의 이전을 따로 확인한다.",
    "recipientQuestion": "이 일이 끝나기까지 내가 계속 알려줘야 하는 부분은 무엇인가?",
    "counterexample": "실제 담당 변경에 동의하지 않았거나 B가 접근할 수 없으면 이전됐다고 쓰지 않는다.",
    "distinctFromOtherParagraphs": "A의 부담 감소와 B의 책임 수락을 함께 다룸",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "f3c3648ae7632ade1bdb"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "e79993a436c219093ea5"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "이 일이 끝나기까지 내가 계속 알려줘야 하는 부분은 무엇인가?",
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
    "id": "cmpr:material:CH05.P4:ab-joint-cost-private-discretion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 먼저 바꿀 행동과 B에게 남겨야 할 권한은 무엇인가?",
    "coreMeaning": "A가 공동 비용 확인과 B의 개인 지출 재량을 분리하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 함께 볼 비용의 목적과 범위를 제안한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B에게 남겨야 할 사적 선택과 실제 공동 영향은 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "열람할 항목·공동 확정할 때·개인에게 남길 범위를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "B의 거절과 정보 경계를 관리 능력 부족으로 읽지 않는다.",
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
        "sourceKey": "ca7a14f7190d5daca6c5",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "financial",
      "repair"
    ],
    "positive": "재정 정보를 필요한 만큼 함께 볼 가능성",
    "risk": "공동생활을 이유로 모든 내역을 요구",
    "factBomb": "투명하자는 말이 상대의 모든 선택을 허락제로 만들 수는 없다.",
    "twist": "공동 항목이 분명하면 개인 내역을 덜 공유해도 필요한 협의는 가능할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 생활비를 같이 관리한다면 A가 공동 지출표의 범위만 합의한다."
    },
    "senderAdjustment": "공유의 목적과 개인 재량을 함께 설명한다.",
    "recipientQuestion": "함께 결정하려면 어떤 정보까지 필요한가?",
    "counterexample": "위협·경제적 통제가 있으면 정보 공유를 더 잘하라는 화해 처방으로 끝내지 않는다.",
    "distinctFromOtherParagraphs": "A의 비용 관리 조정과 B의 자율성 유지",
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
          "sourceKey": "ca7a14f7190d5daca6c5"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "함께 결정하려면 어떤 정보까지 필요한가?",
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
    "id": "cmpr:material:CH05.P4:ab-check-impact-before-correction",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 먼저 바꿀 행동과 B에게 남겨야 할 권한은 무엇인가?",
    "coreMeaning": "A가 수정 요구 전에 B의 실제 결과와 들은 뜻을 확인하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 안전상 고칠 일과 자기 선호를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 실제 맡은 범위와 현재 여력을 별도로 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "이번에 바꿀 행동 한 가지와 그대로 둘 부분을 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "B가 평가받았다는 실제 감정은 듣기 전 확정하지 않는다.",
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
        "sourceKey": "c72ad7e4dbeab2b8b75f",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:standard-consistency",
        "axis": "PRECISION",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "condition": "같은 기준을 적용해도 되는 조건 확인",
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
      "repair"
    ],
    "positive": "필요한 교정만 남길 가능성",
    "risk": "부드러운 말투로 같은 재작업을 계속 요청",
    "factBomb": "말투를 바꿔도 기준이 계속 늘어나면 끝낼 수 없다는 부담은 남는다.",
    "twist": "교정할 수를 줄이면 중요한 누락은 더 잘 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공용 공간의 정리를 다시 본다면 A가 합의했던 완료 기준부터 확인한다."
    },
    "senderAdjustment": "현재 결과·합의한 기준·새 제안을 나눠 말한다.",
    "recipientQuestion": "내가 말한 수정 중 무엇이 필요 정보이고 무엇이 새 기준인가?",
    "counterexample": "실제 안전 위험을 늦추거나 타협할 이유로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "A가 줄일 행동의 구체성으로 generic 대화 조언과 구분",
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
          "type": "ENFP",
          "sourceKey": "c72ad7e4dbeab2b8b75f"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
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
      "question": "내가 말한 수정 중 무엇이 필요 정보이고 무엇이 새 기준인가?",
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
