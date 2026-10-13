/** Offline marriage research; no runtime binding or customer approval. */
import type { MarriageMaterial } from "./researchTypes";
export const MARRIAGE_CH07_MATERIALS: readonly MarriageMaterial[] = [
  {
    "id": "cmpr:material:CH07.P1:money-purpose-difference",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "돈·공간·휴식·친족 요청에서 기준이 달라질 조건은 무엇인가?",
    "coreMeaning": "공동 비용의 안정과 생활의 즐거움이 다른 필요로 전달될 갈등 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "불일치는 실제 양쪽 원천과 이번 비용의 목적을 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 예산 관심과 B의 표현 비용은 별도 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "아끼자는 말과 즐기자는 말을 서로의 무책임이나 무관심으로 번역하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "목적을 듣지 않은 채 허락 여부만 묻는 순서가 답답함을 키울 수 있다.",
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
    "positive": "지출 목적을 비교할 가능성",
    "risk": "같은 비용을 인격의 우열로 평가",
    "factBomb": "가격을 논의하다 사람의 성실함을 채점하면 바꿀 항목이 사라진다.",
    "twist": "두 목적을 남기고 규모를 바꾸는 선택이 있을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 지출을 논의한다면 필요한 유지 비용과 원하는 경험을 따로 적는다."
    },
    "senderAdjustment": "비용의 목적과 실제 감당 범위를 먼저 확인한다.",
    "recipientQuestion": "줄이려는 것은 돈인가, 준비 시간인가, 불확실함인가?",
    "counterexample": "실제 재정 상황이 없으면 과소비·빈곤·자산 격차를 만들지 않는다.",
    "distinctFromOtherParagraphs": "차이의 발생 조건이며 이전 소비 갈등의 회고 아님",
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
      "question": "줄이려는 것은 돈인가, 준비 시간인가, 불확실함인가?",
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
    "id": "cmpr:material:CH07.P1:cleanliness-and-comfort-criteria",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "돈·공간·휴식·친족 요청에서 기준이 달라질 조건은 무엇인가?",
    "coreMeaning": "정돈 결과와 감각적 편안함의 기준이 다를 때 합의할 범위를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "실제 함께 사용하는 공간과 바꿀 수 있는 조건이 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 생활 질서와 B의 감각적 편안함은 각자의 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "정리됐다는 말과 쉬기 편하다는 말을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "말하지 않은 기준으로 끝난 일을 평가하면 방법 재량이 줄어들 수 있다.",
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
        "sourceKey": "b42d6c513c37bfd7f4ee",
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
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "autonomy"
    ],
    "positive": "공동 결과와 개인 선호를 알아볼 기회",
    "risk": "모든 공간에 한 사람의 기준만 적용",
    "factBomb": "내게 편한 집이라는 말이 상대에게도 편하다는 답은 아니다.",
    "twist": "공유 영역을 좁혀 합의하면 각자 취향은 더 많이 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 공용 수납과 개인 물건의 정리 범위를 나눈다."
    },
    "senderAdjustment": "공동 기준·개인 영역·안전 조건을 구분한다.",
    "recipientQuestion": "함께 쓰는 영역에서 꼭 필요한 기준은 무엇인가?",
    "counterexample": "실제 위생·건강·주거 조건이 없으면 의학적 위험이나 생활 습관을 추론하지 않는다.",
    "distinctFromOtherParagraphs": "청소의 우열 대신 서로 다른 완료 기준을 연구",
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
      "question": "함께 쓰는 영역에서 꼭 필요한 기준은 무엇인가?",
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
    "id": "cmpr:material:CH07.P1:rest-order-and-waiting",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "돈·공간·휴식·친족 요청에서 기준이 달라질 조건은 무엇인가?",
    "coreMeaning": "다른 휴식 방식을 고를 때 누가 남은 일과 대기를 맡는지 확인할 갈등 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "휴식이 필요하다는 자료만으로 업무 부담을 계산하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 조용한 시간과 B의 외부 활동은 독립 선호다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "쉬는 방법과 쉬는 동안 남을 담당은 다른 질문이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "매번 같은 사람이 대기하면 시간 배분의 불만이 커질 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "11b961b29814398740e5",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ddc9ce0a084b0b51c3bf",
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
      "invisibleLabor"
    ],
    "positive": "양쪽의 중단 없는 시간을 검토할 가능성",
    "risk": "내 휴식만 먼저 확정하고 상대는 남은 때에 쉬게 함",
    "factBomb": "나중에 쉬면 된다는 말은 그 시간까지 비어 있다는 약속이 아니다.",
    "twist": "일을 줄이거나 순서를 바꾸면 두 방식의 휴식이 함께 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 휴일 업무와 각자 쉴 구간을 나란히 본다."
    },
    "senderAdjustment": "휴식의 순서·길이·대기 업무를 따로 확인한다.",
    "recipientQuestion": "각자 언제 실제로 일을 내려놓을 수 있는가?",
    "counterexample": "실제 자녀·돌봄 대상·근무 시간을 입력 없이 배정하지 않는다.",
    "distinctFromOtherParagraphs": "회복 방식과 대기 책임의 차이를 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "11b961b29814398740e5"
        },
        {
          "owner": "B",
          "type": "ESTP",
          "sourceKey": "ddc9ce0a084b0b51c3bf"
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
      "question": "각자 언제 실제로 일을 내려놓을 수 있는가?",
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
    "id": "cmpr:material:CH07.P1:family-request-vs-common-consent",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "돈·공간·휴식·친족 요청에서 기준이 달라질 조건은 무엇인가?",
    "coreMeaning": "가족을 챙길 관심이 같아도 참석·지원 범위의 합의가 다를 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "실제 외부 요청은 별도 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 관계망 관심과 B의 가족 지원 경계는 독립 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "좋은 뜻에 동의하는 일과 시간·돈을 맡는 일을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "밖에 먼저 약속하면 내부의 거절이 사람을 실망시킨 일처럼 전달될 수 있다.",
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
        "sourceKey": "d4a61263d8611202dcef",
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
      "financial"
    ],
    "positive": "공동 자원의 범위를 알아볼 기회",
    "risk": "가족을 위한 선택이니 설명 없이 따라야 한다고 여김",
    "factBomb": "가족을 생각한다는 말에도 누구의 자원을 쓰는지가 들어가야 한다.",
    "twist": "거절과 다른 방식의 지원을 나눠볼 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 친족 행사를 논의한다면 참석·준비·비용·공개할 정보를 따로 고른다."
    },
    "senderAdjustment": "외부 요청과 두 사람의 실제 동의를 구별한다.",
    "recipientQuestion": "어느 부분은 개인이 정하고 어느 부분은 함께 정해야 하는가?",
    "counterexample": "친족의 성격·간섭·요구나 법적 의무를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "가족 경계의 생활 조건이며 실제 양가 갈등 판정 아님",
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
          "type": "ISFJ",
          "sourceKey": "d4a61263d8611202dcef"
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
      "question": "어느 부분은 개인이 정하고 어느 부분은 함께 정해야 하는가?",
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
    "id": "cmpr:material:CH07.P2:detected-clash-shared-timing",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 검출 관계와 생활 차이를 혼동하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "실제 교차 子午 충의 대상과 생활 변경의 개인 조건을 분리해 설명하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "두 사람의 실제 子午 refs·위치·canonical ID만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "충은 대향하는 분류이며 실제 일정 위반이나 이혼의 증거가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "A의 변경 완충과 B의 합의 선호는 각자 trait를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "변경 정보를 나누는 생활 선택을 살필 수 있으나 충이 갈등을 일으켰다는 인과는 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "941361dcf854c0c9f213",
        "sourceUse": "actual_canonical_membership_required",
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
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:protective-change",
        "axis": "STABILITY",
        "definition": "지속을 위해 필요한 변경을 수용",
        "condition": "유지할 가치와 바꿀 방법을 구분",
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
      "natalRelation",
      "transition"
    ],
    "positive": "바꿀 조건을 구체적으로 묻는 기회",
    "risk": "한 관계로 모든 생활 차이를 설명",
    "factBomb": "충을 설명해도 이번에 바뀐 약속은 별도로 확인해야 한다.",
    "twist": "시기와 담당을 나누면 변화의 좋은 부분도 남겨둘 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활 방식이 달라진다면 바뀐 일과 유지할 일을 함께 적는다."
    },
    "senderAdjustment": "계산된 관계·개인 자료·가정한 변화의 층위를 나눈다.",
    "recipientQuestion": "이번 변화에서 실제로 조정할 일이 있는가?",
    "counterexample": "기간의 충이나 원국 내부 관계를 교차 관계로 바꿔 쓰지 않는다.",
    "distinctFromOtherParagraphs": "실제 충의 출처와 공동생활 변화 질문 구별",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "ede67b716c40fbe4b6c4"
        },
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
        }
      ],
      "natalDefinitions": [],
      "relationDefinitions": [
        {
          "sourceKey": "941361dcf854c0c9f213",
          "sourceId": "rr:combination:chung:子午",
          "members": [
            "子",
            "午"
          ],
          "researchDefinitionOnly": true,
          "actualProducerRequired": true
        }
      ],
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
      "question": "이번 변화에서 실제로 조정할 일이 있는가?",
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
    "id": "cmpr:material:CH07.P2:clash-not-decision-cause",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 검출 관계와 생활 차이를 혼동하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "실제 寅申 충이 있는 경우에도 결정 속도 차이의 원천과 별도로 설명하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "검출된 관계의 양쪽 참여 기둥을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "관계 종류만으로 강한 사람·약한 사람이나 결과를 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "빠른 확정과 검토 필요는 각자의 MBTI source로 따로 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "동의와 보류를 명시할 여지는 실제 협의의 조건에서 찾는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "21a2cc4649da9423a26d",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
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
      "natalRelation",
      "decision"
    ],
    "positive": "다른 기준을 말할 질문",
    "risk": "충을 상대가 내 말을 안 듣는 이유로 고정",
    "factBomb": "계산된 충을 근거로 상대의 반대를 틀린 답으로 만들 수는 없다.",
    "twist": "차이를 설명할 이름보다 실제 수정할 범위가 더 유용할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 생활 계획을 선택한다면 검토 중인 조건과 확정할 항목을 나눈다."
    },
    "senderAdjustment": "명리 분류와 현재 의사결정의 정보를 분리한다.",
    "recipientQuestion": "어떤 의견은 아직 반영되지 않았는가?",
    "counterexample": "실제 寅申 충이 없으면 검출 사실로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "관계 검출의 사실과 발신·수신 가설의 출처 구별",
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
      "relationDefinitions": [
        {
          "sourceKey": "21a2cc4649da9423a26d",
          "sourceId": "rr:combination:chung:寅申",
          "members": [
            "寅",
            "申"
          ],
          "researchDefinitionOnly": true,
          "actualProducerRequired": true
        }
      ],
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
      "question": "어떤 의견은 아직 반영되지 않았는가?",
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
    "id": "cmpr:material:CH07.P2:harm-unsupported-wonjin",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 검출 관계와 생활 차이를 혼동하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "子未가 등장해도 실제 해와 연구에만 있는 원진을 다른 지원 상태로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "실제 canonical harm refs가 있어야 교차 해를 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "원진은 현행 교차 producer가 미지원이므로 비교·보류용이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "각자의 기대는 개인 trait와 실제 확인에서 따로 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "불편을 말로 확인할 여지는 원진 검출의 주장 없이 남길 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "e23b027944c5f0d3197a",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "SHARED",
        "sourceKey": "88af77cc76890045d0ca",
        "sourceUse": "unsupported_comparison_only",
        "knowledgeIsRuntimeEvidence": false
      },
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
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
      "natalRelation",
      "financial"
    ],
    "positive": "지원 범위와 기대를 정확히 구분할 기회",
    "risk": "같은 글자라는 이유로 위험 관계를 두 번 집계",
    "factBomb": "한 쌍의 글자에 이름을 더 붙여도 새 계산 근거가 생기지는 않는다.",
    "twist": "설명할 수 없는 부분을 남겨 두면 실제로 확인할 질문이 분명해진다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 지출을 논의한다면 짧은 답이 동의였는지 확인하되 원진 때문이라고 하지 않는다."
    },
    "senderAdjustment": "실제 관계 kind와 미지원 정의를 분리한다.",
    "recipientQuestion": "우리가 실제로 합의한 항목은 무엇인가?",
    "counterexample": "원진 연구표를 actual ID로 만들거나 관계의 불행을 예언하지 않는다.",
    "distinctFromOtherParagraphs": "교차 producer의 미지원 비교와 실제 해의 조건",
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
      "relationDefinitions": [
        {
          "sourceKey": "e23b027944c5f0d3197a",
          "sourceId": "rr:combination:hae:子未",
          "members": [
            "子",
            "未"
          ],
          "researchDefinitionOnly": true,
          "actualProducerRequired": true
        },
        {
          "sourceKey": "88af77cc76890045d0ca",
          "sourceId": "rr:combination:wonjin:子未",
          "members": [
            "子",
            "未"
          ],
          "researchDefinitionOnly": true,
          "actualProducerRequired": true
        }
      ],
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
      "question": "우리가 실제로 합의한 항목은 무엇인가?",
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
    "id": "cmpr:material:CH07.P2:no-pair-relation-no-hidden-defect",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 검출 관계와 생활 차이를 혼동하지 않으려면 무엇이 필요한가?",
    "coreMeaning": "실제 검출된 교차 지지 관계가 없을 때 생활의 숨은 문제를 만들어내지 않는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "현재 producer의 관계 부재와 계산의 지원 범위를 정확히 기록한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "관계가 없다는 것은 명리 전체나 방향 십성이 없다는 뜻이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "A/B 같은 유형의 실제 원천과 현재 필요한 정보는 각각 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "공통 업무가 있다면 담당·완료 기준을 묻되 불화가 있었다고 채우지 않는다.",
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
        "sourceKey": "bedf4254e50989e1a90e",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "natalRelation",
      "household"
    ],
    "positive": "근거 부재를 실제 확인으로 남길 가능성",
    "risk": "특별한 관계가 없으니 일반적 갈등을 실제 문제처럼 삽입",
    "factBomb": "빈 관계 목록은 숨은 불화의 목록이 아니다.",
    "twist": "관계 이름이 없어도 실제로 선택한 생활 약속은 확인할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 함께 살게 된다면 반복 업무의 담당과 소통할 때를 먼저 묻는다."
    },
    "senderAdjustment": "검출 부재·개인 원천·가상 생활 질문을 구별한다.",
    "recipientQuestion": "지금 함께 확인하고 싶은 생활 항목이 있는가?",
    "counterexample": "근거 부족을 완벽한 궁합이나 나쁜 관계의 증거로 승격하지 않는다.",
    "distinctFromOtherParagraphs": "불충분한 관계 근거의 안전한 처리",
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
          "type": "INTP",
          "sourceKey": "bedf4254e50989e1a90e"
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
      "question": "지금 함께 확인하고 싶은 생활 항목이 있는가?",
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
    "id": "cmpr:material:CH07.P3:criteria-revision-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "기준·허락·관리·미응답이 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "A의 기준 추가와 B의 변경이 설명 없는 재작업으로 이어질 반복 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "합의한 결과와 새로 생긴 요구가 섞이면 끝을 알기 어려울 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "A의 교정 가능성과 B의 변경 책임을 별도 원천으로 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "수정이 늘수록 B가 결론을 미루고 A가 다시 확인하는 가상 고리를 살핀다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "처음 합의한 기준과 달라진 이유를 분리해야 바꿀 행동이 보인다.",
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
        "sourceKey": "0f0d27792b96a8ad87ad",
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
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "household",
      "repair"
    ],
    "positive": "재작업의 실제 원인을 좁힐 여지",
    "risk": "끝난 일마다 전체 생활 태도를 평가",
    "factBomb": "기준을 늘리는 사람과 변경을 알리지 않는 사람이 만나면 일의 끝이 사라질 수 있다.",
    "twist": "한 번에 한 기준만 수정하면 다른 방식도 끝낼 공간이 생길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 업무를 다시 논의한다면 현재 결과·처음 기준·변경 조건을 나란히 본다."
    },
    "senderAdjustment": "이번 한 항목의 기준 변경만 확인한다.",
    "recipientQuestion": "처음 합의에서 무엇이 달라졌고 누가 그 정보를 못 받았는가?",
    "counterexample": "누가 먼저 잘못했는지나 실제 반복 갈등을 source만으로 판정하지 않는다.",
    "distinctFromOtherParagraphs": "방향별 기여·비용을 반복의 성립 조건으로 통합",
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
          "sourceKey": "0f0d27792b96a8ad87ad"
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
      "question": "처음 합의에서 무엇이 달라졌고 누가 그 정보를 못 받았는가?",
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
    "id": "cmpr:material:CH07.P3:budget-permission-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "기준·허락·관리·미응답이 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "A의 비용 통합과 B의 답변 회피가 공동·개인 영역을 흐릴 반복 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "공동 비용의 범위가 불명확하면 모든 선택이 협의 대상으로 늘 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "A의 권한 정리와 B의 기본 합의·자유는 독립 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "내역을 더 요구할수록 B가 설명을 줄이는 가상 악순환을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "자원 차단·위협이 있으면 대화 방식의 대등한 갈등으로 정상화하지 않는다.",
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
      "repair"
    ],
    "positive": "실제 공동 범위를 다시 정할 여지",
    "risk": "투명성 명목으로 개인 선택을 계속 심사",
    "factBomb": "공동생활비를 묻다가 모든 개인 선택을 허가하면 질문의 목적이 달라진다.",
    "twist": "공동 범위를 줄여 확인하면 필요한 협의는 더 선명해질 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 생활비를 함께 관리한다면 공동 항목과 개인 재량을 다시 분류한다."
    },
    "senderAdjustment": "공유 목적·열람 범위·실제 결정권을 따로 확인한다.",
    "recipientQuestion": "어떤 정보가 공동 비용의 결정에 꼭 필요한가?",
    "counterexample": "실제 경제적 통제는 양쪽 소통 문제라는 설명으로 축소하지 않는다.",
    "distinctFromOtherParagraphs": "정보·권한의 확대가 만드는 반복 비용",
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
      "question": "어떤 정보가 공동 비용의 결정에 꼭 필요한가?",
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
    "id": "cmpr:material:CH07.P3:care-manager-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "기준·허락·관리·미응답이 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "A의 알아서 챙김과 B의 지시 대기가 생활 관리 책임을 한쪽에 남길 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "누가 필요를 알고 언제 실행을 시작하는지 현재 업무를 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "A의 돌봄 원천과 B의 반복 책임 자료는 서로 대신할 수 없다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "A가 알려줘야 B가 시작한다면 준비·기억 부담은 계속 A에게 남을 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "감사와 지적을 늘리기보다 전체 업무의 소유를 다시 정할 필요를 살핀다.",
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
      "repair"
    ],
    "positive": "업무 단위를 명확히 할 기회",
    "risk": "A는 기억하고 B는 요청받은 순간만 돕는 구조를 당연시",
    "factBomb": "시키면 한다는 말에는 무엇을 시킬지 기억하는 사람이 남아 있다.",
    "twist": "작은 일 하나를 끝까지 맡으면 도움이라는 말의 경계가 바뀔 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활의 반복 구매를 나눈다면 발견부터 누락 확인까지 누가 맡을지 본다."
    },
    "senderAdjustment": "도움의 횟수와 관리 책임을 구별한다.",
    "recipientQuestion": "이 일이 필요하다는 사실을 누가 처음 알아차리고 다음에도 기억하는가?",
    "counterexample": "이미 불공평한 분담이 있었다고 추정하거나 책임을 성별로 배정하지 않는다.",
    "distinctFromOtherParagraphs": "보이지 않는 관리의 구체적 반복 조건",
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
      "question": "이 일이 필요하다는 사실을 누가 처음 알아차리고 다음에도 기억하는가?",
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
    "id": "cmpr:material:CH07.P3:decision-silence-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "기준·허락·관리·미응답이 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "A의 빠른 확정과 B의 미정 답이 서로 없는 동의를 만들 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "검토 중인 답을 확정으로 처리하면 반대가 뒤늦게 드러날 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "A의 명확한 결정 필요와 B의 표현 보류를 각각 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "A가 재촉할수록 B가 모호하게 넘기는 가상 장면의 성립 조건을 살핀다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "반대해도 안전한지와 실제 확정 기한을 먼저 구분한다.",
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
        "sourceKey": "be9cb942010f0a199f50",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "householdTopics": [
      "decision",
      "repair"
    ],
    "positive": "선택 상태를 명료하게 할 여지",
    "risk": "대답의 속도로 책임감을 평가",
    "factBomb": "결정이 빨리 끝나도 동의가 없었다면 다시 시작해야 할 수 있다.",
    "twist": "아직 모르는 항목을 남겨 두는 것이 실제 진행에 도움이 될 수도 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동생활 계획을 고른다면 찬성·반대·미정 항목과 검토 때를 각각 표시한다."
    },
    "senderAdjustment": "답의 상태와 결정의 효력을 나눈다.",
    "recipientQuestion": "지금까지의 답 중 실제 동의와 단순 보류는 무엇인가?",
    "counterexample": "B가 분명히 거절한 경우를 양쪽 오해로 바꾸지 않는다.",
    "distinctFromOtherParagraphs": "발신과 수신의 다른 원인을 같은 생활 선택에 놓음",
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
          "sourceKey": "be9cb942010f0a199f50"
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
      "question": "지금까지의 답 중 실제 동의와 단순 보류는 무엇인가?",
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
    "id": "cmpr:material:CH07.P4:scores-of-past-work",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "편리함이 상대에게 넘기는 부담과 안전 경계는 무엇인가?",
    "coreMeaning": "한 업무의 미완료가 지난 수고 전체의 경쟁으로 바뀔 악화 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "주의할 것은 현재 바꿀 행동이 사람의 성실함 평가로 번지는 경우다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A가 빨리 해결하고 싶은 기대를 A source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "B가 불편을 늦게 말할 가능성은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "현재 일을 다루지 못할수록 과거의 모든 담당이 논쟁에 들어올 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "330a2038a4ac4d374d63",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "cd4db85b9a6b894d203d",
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
    "householdTopics": [
      "household",
      "repair"
    ],
    "positive": "이번 항목을 작게 좁힐 기회",
    "risk": "지난 수고를 모두 상환해야 현재 요청을 들을 수 있다고 조건을 검",
    "factBomb": "지난 일 전체를 이겨야 오늘의 일을 나눌 수 있다면 합의는 시작되기 어렵다.",
    "twist": "기록을 누가 더 했는지보다 지금 바꿀 항목을 고르는 데 쓸 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 가사 문제를 다시 논의한다면 이번 한 업무의 완료 기준만 먼저 맞춘다."
    },
    "senderAdjustment": "현재 사실·받은 뜻·다음 행동을 한 항목에서 나눈다.",
    "recipientQuestion": "지금 해결할 한 가지와 별도로 이야기할 과거 주제는 무엇인가?",
    "counterexample": "입력받지 않은 과거 수고·싸움·희생을 실제 사건으로 서술하지 않는다.",
    "distinctFromOtherParagraphs": "현재 문제가 전체 관계의 채점으로 커지는 조건",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ESTJ",
          "sourceKey": "330a2038a4ac4d374d63"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "cd4db85b9a6b894d203d"
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
      "question": "지금 해결할 한 가지와 별도로 이야기할 과거 주제는 무엇인가?",
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
    "id": "cmpr:material:CH07.P4:family-image-becomes-cost",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "편리함이 상대에게 넘기는 부담과 안전 경계는 무엇인가?",
    "coreMeaning": "좋은 가족으로 보여야 한다는 기대가 현재 생활 여력을 지울 악화 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 외부 기대가 있는지 확인하기 전에는 가상 조건이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A의 관계망 관심을 외부 평판을 위한 실제 행동으로 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "B의 지원 성향을 무제한 가족 의무로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "체면 때문에 거절할 수 없으면 비용·시간의 동의가 형식이 될 수 있다.",
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
        "sourceKey": "d4a61263d8611202dcef",
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
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
      "family",
      "financial"
    ],
    "positive": "현재 가능한 지원을 다시 볼 여지",
    "risk": "양가 중 누구를 더 챙겼는지 관계의 충성도로 평가",
    "factBomb": "좋은 마음을 보이려는 자리에도 두 사람의 생활 한계는 남아 있다.",
    "twist": "도움을 줄이는 결정이 장기적으로 지킬 범위를 더 정확히 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 친족 지원을 검토한다면 현재 여력과 반복 지원의 가능 여부를 따로 확인한다."
    },
    "senderAdjustment": "한 번의 지원과 계속되는 담당을 구별한다.",
    "recipientQuestion": "이번 약속이 다음에도 해야 한다는 기대를 남기는가?",
    "counterexample": "실제 친족 요구·재산·법적 의무를 생성하거나 평가하지 않는다.",
    "distinctFromOtherParagraphs": "외부 평가가 내부 자원을 가리는 악화 조건",
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
          "type": "ISFJ",
          "sourceKey": "d4a61263d8611202dcef"
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
      "question": "이번 약속이 다음에도 해야 한다는 기대를 남기는가?",
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
    "id": "cmpr:material:CH07.P4:old-fairness-after-change",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "편리함이 상대에게 넘기는 부담과 안전 경계는 무엇인가?",
    "coreMeaning": "생활 조건이 달라져도 예전 분담을 유지할 때 부담이 커질 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "근무·수입·시간 변화는 실제로 확인된 경우에만 사실로 쓴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A의 변화 완충 필요와 B의 자유·합의 자료는 각각 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "소득의 변화와 가사·돌봄·대기 시간의 변화는 따로 비교한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "변화를 지지했다는 답이 모든 추가 책임의 동의는 아니다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ede67b716c40fbe4b6c4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "0f0d27792b96a8ad87ad",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "c97137956156f94d70da",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
      "financial",
      "rest"
    ],
    "positive": "임시 분담을 다시 고를 기회",
    "risk": "돈을 덜 번 쪽이 모든 무급 업무를 맡아야 한다고 결정",
    "factBomb": "돈의 양만 바뀌었다고 하루의 시간까지 자동으로 비는 것은 아니다.",
    "twist": "업무를 줄이거나 지원 범위를 바꾸는 것도 공평함을 다시 정하는 선택이다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 근무 시간이 변한다면 현재 남는 시간과 맡을 수 있는 일을 각각 적는다."
    },
    "senderAdjustment": "변경된 자원·기존 역할·임시 조정 기간을 나눈다.",
    "recipientQuestion": "이전 합의에서 지금 감당하기 어려운 부분은 무엇인가?",
    "counterexample": "실제 소득·직업·돌봄 정보 없이 특정 분담 비율이나 금액을 제시하지 않는다.",
    "distinctFromOtherParagraphs": "생활 전환의 비용과 소득에 따른 역할 강요를 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. 상대 자료로 대체하지 않는다.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용한다. A 자료를 B에게 복사하지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "ede67b716c40fbe4b6c4"
        },
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "0f0d27792b96a8ad87ad"
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
      "question": "이전 합의에서 지금 감당하기 어려운 부분은 무엇인가?",
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
    "id": "cmpr:material:CH07.P4:coercion-is-outside-style",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "편리함이 상대에게 넘기는 부담과 안전 경계는 무엇인가?",
    "coreMeaning": "거절에 대한 위협·감시·필수 자원 차단은 일반 생활 방식 차이로 조율하지 않는 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "이 자료는 실제 가해자나 피해자를 판정하는 검사가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A의 명확한 권한 선호를 실제 통제 행동으로 추정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "B의 갈등 회피를 피해를 감수해야 할 성격으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "안전한 거절이 없으면 더 잘 협의하라는 공동 책임의 조언을 중단한다.",
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
        "sourceKey": "be9cb942010f0a199f50",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
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
      "safety",
      "financial",
      "autonomy"
    ],
    "positive": "조율 가능한 문제의 범위를 구분할 기회",
    "risk": "관리·절약·배려라는 말로 강요를 정상화",
    "factBomb": "상대가 두려워 거절하지 못한다면 단순한 의견 차이라는 설명은 충분하지 않다.",
    "twist": "함께 살지 않거나 대화를 중단하는 선택도 남겨야 한다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "premise": "hypothetical_only_actual_marriage_unknown",
      "text": "가상으로 공동 재정의 안전을 검토한다면 자유롭게 거절하고 필요한 자원에 접근할 수 있는지 먼저 확인한다."
    },
    "senderAdjustment": "안전 확인과 성향 조율을 분리한다.",
    "recipientQuestion": "거절하거나 중단했을 때 위협·불이익이 생길 우려가 있는가?",
    "counterexample": "유형·성별·사주로 실제 폭력·학대·경제적 통제를 예측하지 않는다.",
    "distinctFromOtherParagraphs": "안전의 적용 경계이며 관계 유지나 화해를 의무로 만들지 않음",
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
          "type": "INFP",
          "sourceKey": "be9cb942010f0a199f50"
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
      "question": "거절하거나 중단했을 때 위협·불이익이 생길 우려가 있는가?",
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
