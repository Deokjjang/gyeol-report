/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH08_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH08.P1:repair-result-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "coreMeaning": "지원 대가로 결과를 요구하는 반복을 부모의 기대 수정과 현재 지원 확인으로 바꾸는 절차다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 도입된 기대 반복의 같은 조건을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "부모는 실제 이번 결정과 자신의 바람을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "자녀는 관심·부담·보류를 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "다음 시도 뒤 지원이 적절했는지 부모가 다시 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "46eb373ed8de497e1ba3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "7ad9ba971bacdf36c537",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "expectation"
    ],
    "positive": "지원과 선택을 분리할 가능성",
    "risk": "사과 뒤에도 같은 결과를 요구",
    "factBomb": "아이의 답을 바꾸게 하는 사과라면 어른의 기대는 아직 그대로일 수 있다.",
    "twist": "결과 약속 없이도 지원할 한 행동을 정할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 진로 논의가 반복된다면 부모는 지금 필요한 자료와 수정 가능한 결정을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기대 압박을 줄이고 실제 지원을 마련한다.",
    "childAvailableChoice": "관심을 말하거나 답하지 않을 수 있다.",
    "counterexample": "실제 갈등·성적·비용이 없으면 회고나 교육 처방으로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "CH07 기대 고리를 부모의 지원 행동으로 전환",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:result-debt-loop"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "46eb373ed8de497e1ba3",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "7ad9ba971bacdf36c537",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "사과 뒤에도 같은 결과를 요구",
      "parentChecksFirst": "기대 압박을 줄이고 실제 지원을 마련한다.",
      "childExpression": "관심을 말하거나 답하지 않을 수 있다.",
      "adultChange": "기대 압박을 줄이고 실제 지원을 마련한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심을 말하거나 답하지 않을 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P1:repair-protection-test",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "coreMeaning": "정답을 요구하는 보호 질문을 실제 위험·지원·선택의 구분으로 바꾸는 절차다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞선 보호 반복과 실제 안전 조건을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "부모가 필요한 보호를 직접 판단하고 이유를 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "자녀가 바꿀 수 있는 방법을 실제로 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "시도 뒤 안전과 도움 필요를 다시 본다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "3888aa2e5b9fb179e218",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "71b3ec665e36ff80d62e",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "protection"
    ],
    "positive": "보호와 선택이 함께 남을 가능성",
    "risk": "자녀가 동의하면 부모 책임이 끝났다고 봄",
    "factBomb": "고르게 했다는 말만으로 어른의 안전 확인이 끝나지는 않는다.",
    "twist": "제한의 이유를 좁히면 남길 선택이 더 분명해질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동을 시험한다면 부모는 지원·중단 신호·다시 볼 때를 마련한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "안전 기준을 설명하고 불필요한 제한을 줄인다.",
    "childAvailableChoice": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
    "counterexample": "실제 위험을 유형으로 판정하거나 필요한 보호를 철회하지 않는다.",
    "distinctFromOtherParagraphs": "CH07 보호 고리를 실제 지원 범위로 전환",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:protection-question-test-loop"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "3888aa2e5b9fb179e218",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "71b3ec665e36ff80d62e",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "자녀가 동의하면 부모 책임이 끝났다고 봄",
      "parentChecksFirst": "안전 기준을 설명하고 불필요한 제한을 줄인다.",
      "childExpression": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
      "adultChange": "안전 기준을 설명하고 불필요한 제한을 줄인다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P1:repair-debate-and-return",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "coreMeaning": "반박과 설명 중단의 반복을 수신 확인·표현 통로·재확인으로 바꾸는 절차다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 도입된 같은 대화 조건만 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "부모가 먼저 반박을 멈추고 들은 뜻을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "자녀는 글·말·보류를 선택할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "부모가 수신한 내용과 다시 결정할 때를 명확히 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "1de5594bb3cc1a883744",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "d50e782170a5c0a71e15",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "communication"
    ],
    "positive": "설명할 시간을 남길 가능성",
    "risk": "중단을 벌이나 잠수로 사용",
    "factBomb": "기다리겠다는 말에도 다시 들을 자리가 있어야 한다.",
    "twist": "바로 답을 얻지 않아도 다음 확인을 분명히 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 대화가 막힌다면 부모는 표현 방법과 다시 확인할 때를 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반박·답변 요구를 줄이고 실제 수신을 확인한다.",
    "childAvailableChoice": "요약을 고치거나 다른 통로로 전할 수 있다.",
    "counterexample": "위험한 대면 대화를 회복의 필수 조건으로 삼지 않는다.",
    "distinctFromOtherParagraphs": "CH07 대화 반복의 수신 절차",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:debate-silence-loop"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTP",
          "sourceKey": "1de5594bb3cc1a883744",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "INFJ",
          "sourceKey": "d50e782170a5c0a71e15",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "중단을 벌이나 잠수로 사용",
      "parentChecksFirst": "반박·답변 요구를 줄이고 실제 수신을 확인한다.",
      "childExpression": "요약을 고치거나 다른 통로로 전할 수 있다.",
      "adultChange": "반박·답변 요구를 줄이고 실제 수신을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "요약을 고치거나 다른 통로로 전할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P1:repair-parent-emotional-responsibility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 반복을 부모 책임 중심의 어떤 확인 절차로 바꿀 수 있는가?",
    "coreMeaning": "자녀의 위로를 기다리는 반복을 부모의 반응 조절·사과·성인 지원으로 바꾸는 절차다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞선 정서 책임 전가 조건을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "부모가 잘못한 행동을 구체적으로 인정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "자녀의 용서나 위로를 지원의 조건으로 삼지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "부모가 같은 요구를 줄였는지 다음 상황에서 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "cb9ee7415c4e3089e7f9",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "758f1fd0edec5f2f8304",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "aaac0cf1c3f696a21cc6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "adultSupport"
    ],
    "positive": "자녀가 감정 관리 역할을 내려놓을 가능성",
    "risk": "사과받은 자녀에게 괜찮다고 해달라고 요구",
    "factBomb": "미안하다는 말의 끝이 아이의 위로 요구가 되어서는 안 된다.",
    "twist": "부모가 외부 지원을 받는 선택이 가족의 책임을 더 정확히 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 거칠게 반응했다면 부모는 안전을 유지하고 멈춘 뒤 수정할 행동을 말한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반응 조절·안전 돌봄·성인 지원을 직접 맡는다.",
    "childAvailableChoice": "사과에 즉시 답하지 않고 자신의 필요를 말할 수 있다.",
    "counterexample": "실제 폭력·위협은 사과와 대화만으로 해결 가능하다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "CH07 정서 고리를 부모 책임으로 전환",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:child-comfort-parent-loop"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "cb9ee7415c4e3089e7f9",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "758f1fd0edec5f2f8304",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "사과받은 자녀에게 괜찮다고 해달라고 요구",
      "parentChecksFirst": "반응 조절·안전 돌봄·성인 지원을 직접 맡는다.",
      "childExpression": "사과에 즉시 답하지 않고 자신의 필요를 말할 수 있다.",
      "adultChange": "반응 조절·안전 돌봄·성인 지원을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "사과에 즉시 답하지 않고 자신의 필요를 말할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P2:a-change-expectation-before-enrollment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "coreMeaning": "부모가 지원을 대가로 삼은 기대를 확정 전의 실제 선택권으로 조정하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "같은 A→B 부담이 앞서 도입돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모는 자기 기대와 자녀가 선택한 것을 다시 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "이미 준비한 사정도 자녀의 성과 의무로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "다음 결정을 확정하기 전에 의견을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "46eb373ed8de497e1ba3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "7ad9ba971bacdf36c537",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
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
    "topics": [
      "repair",
      "parentAction"
    ],
    "positive": "관심이 실제 결정에 들어갈 가능성",
    "risk": "의견을 묻고도 결정을 바꾸지 않음",
    "factBomb": "물어봤다는 기록만으로 선택권을 돌려준 것은 아니다.",
    "twist": "지원의 목적을 바꾸면 결과 약속이 없어도 도움이 남는다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 신청 전이라면 부모는 수정·거절·보류할 항목을 남긴다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "확정 전 선택과 지원 조건을 다시 연다.",
    "childAvailableChoice": "다른 관심이나 보류를 말할 수 있다.",
    "counterexample": "실제 필요와 안전상 제한은 별도 확인한다.",
    "distinctFromOtherParagraphs": "CH05 기대 부담에 대응하는 A의 실행",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-expectation-becomes-result-debt"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "46eb373ed8de497e1ba3",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "INFP",
          "sourceKey": "7ad9ba971bacdf36c537",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "의견을 묻고도 결정을 바꾸지 않음",
      "parentChecksFirst": "확정 전 선택과 지원 조건을 다시 연다.",
      "childExpression": "다른 관심이나 보류를 말할 수 있다.",
      "adultChange": "확정 전 선택과 지원 조건을 다시 연다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "다른 관심이나 보류를 말할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P2:a-reduce-unnecessary-restriction",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "coreMeaning": "부모가 필요한 보호와 바꾸어도 되는 제한을 구분해 수정하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "같은 A→B 보호 부담과 실제 위험이 확인돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모의 불안은 성인 지원으로 다룬다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "자녀가 고를 작은 방법을 실제로 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "시도 뒤 보호가 적절했는지 부모가 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "3888aa2e5b9fb179e218",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "71b3ec665e36ff80d62e",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "parentAction"
    ],
    "positive": "안전을 유지하면서 선택을 돌려줄 가능성",
    "risk": "보호를 줄이려 모든 판단을 자녀에게 넘김",
    "factBomb": "통제를 줄이는 일은 돌봄을 줄이는 일과 다르다.",
    "twist": "도울 준비가 있을 때 직접 해볼 범위가 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 방식을 다시 본다면 부모는 제한한 이유와 지원을 점검한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "불필요한 제한을 수정하고 보호를 유지한다.",
    "childAvailableChoice": "방법·도움·중단을 고를 수 있다.",
    "counterexample": "실제 전문 위험 판단을 일반 조언으로 대체하지 않는다.",
    "distinctFromOtherParagraphs": "CH05 보호 과용에 대응하는 A의 조정",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-protection-removes-small-choice"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "3888aa2e5b9fb179e218",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "71b3ec665e36ff80d62e",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "보호를 줄이려 모든 판단을 자녀에게 넘김",
      "parentChecksFirst": "불필요한 제한을 수정하고 보호를 유지한다.",
      "childExpression": "방법·도움·중단을 고를 수 있다.",
      "adultChange": "불필요한 제한을 수정하고 보호를 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "방법·도움·중단을 고를 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P2:a-receive-before-rebuttal",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "coreMeaning": "부모가 반박 전 수신한 내용을 확인하고 표현 속도를 자녀에게 남기는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "같은 A→B 대화 부담만 이어간다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모는 요약이 맞는지 묻고 수정받는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "자녀는 말이나 글의 범위를 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "부모가 설명을 바꿨는지 다음 대화에서 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "1de5594bb3cc1a883744",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "d50e782170a5c0a71e15",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "parentAction"
    ],
    "positive": "목소리 크기와 다른 이해의 기회",
    "risk": "요약을 자녀 논리를 공격할 준비로 사용",
    "factBomb": "잘 듣는다는 말은 반박 순서를 기다리는 것과 다르다.",
    "twist": "부모가 모른다고 인정하면 설명을 다시 시작할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 의견이 다르다면 부모는 먼저 들은 내용을 되짚는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반박을 멈추고 실제 수신을 확인한다.",
    "childAvailableChoice": "요약을 고치거나 나중에 전할 수 있다.",
    "counterexample": "자녀가 안전하지 않은 대화를 직접 해결하게 하지 않는다.",
    "distinctFromOtherParagraphs": "CH05 토론 과용에 대응하는 A의 수신 행동",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-debate-overwhelms-child"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTP",
          "sourceKey": "1de5594bb3cc1a883744",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "INFJ",
          "sourceKey": "d50e782170a5c0a71e15",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "요약을 자녀 논리를 공격할 준비로 사용",
      "parentChecksFirst": "반박을 멈추고 실제 수신을 확인한다.",
      "childExpression": "요약을 고치거나 나중에 전할 수 있다.",
      "adultChange": "반박을 멈추고 실제 수신을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "요약을 고치거나 나중에 전할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P2:a-stop-comfort-demand",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A가 앞선 부담을 줄이려 실제로 바꿀 행동은 무엇인가?",
    "coreMeaning": "부모가 자녀에게 요구한 위로를 거두고 성인 지원을 찾는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "같은 A→B 정서 부담 조건이 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모는 자신의 반응과 말의 영향을 인정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "자녀의 고마움·용서를 대가로 묻지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "실제 요구가 줄었는지 부모가 다시 점검한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "cb9ee7415c4e3089e7f9",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "758f1fd0edec5f2f8304",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "aaac0cf1c3f696a21cc6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "parentAction"
    ],
    "positive": "자녀에게 정서 책임을 남기지 않을 가능성",
    "risk": "사과 뒤에도 마음을 알아달라고 반복",
    "factBomb": "사과를 끝내는 책임까지 아이에게 맡기면 부담은 남는다.",
    "twist": "성인 지원을 받는 행동이 부모의 수정 의사를 보여줄 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 부모가 피로를 쏟아냈다면 자녀에게 계속 듣지 않아도 된다고 말하고 지원을 구한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "사과·반응 조절·안전 돌봄을 직접 맡는다.",
    "childAvailableChoice": "답변·거리·지원 요청을 선택할 수 있다.",
    "counterexample": "위험한 행동을 사과만으로 정상화하지 않는다.",
    "distinctFromOtherParagraphs": "CH05 정서 요구에 대응하는 A의 책임",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-care-asks-for-parent-comfort"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "cb9ee7415c4e3089e7f9",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "758f1fd0edec5f2f8304",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "사과 뒤에도 마음을 알아달라고 반복",
      "parentChecksFirst": "사과·반응 조절·안전 돌봄을 직접 맡는다.",
      "childExpression": "답변·거리·지원 요청을 선택할 수 있다.",
      "adultChange": "사과·반응 조절·안전 돌봄을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "답변·거리·지원 요청을 선택할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P3:child-question-route-parent-receives",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "coreMeaning": "자녀가 질문할 통로를 고르고 부모가 권한 반응을 수정할 회복 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "같은 B→A 질문 부담이 앞서 도입돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모가 질문을 불순종으로 단정한 해석을 돌아본다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "자녀는 직접 말하기 어려우면 다른 통로를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "부모가 실제로 질문을 받았는지 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "71b3ec665e36ff80d62e",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "825fd4e9a742a121464b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "childChoice"
    ],
    "positive": "안전하게 질문할 가능성",
    "risk": "자녀의 설명 솜씨에 회복을 맡김",
    "factBomb": "질문할 자리를 여는 일은 질문을 잘하는 아이만의 몫이 아니다.",
    "twist": "짧은 질문도 부모가 행동을 바꿀 정보를 줄 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 규칙을 다시 본다면 부모는 의견을 받을 통로와 수정할 범위를 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "불이익 없는 반응과 설명을 마련한다.",
    "childAvailableChoice": "질문·보류·안전한 지원자를 선택할 수 있다.",
    "counterexample": "강압 상황에서 직접 설득을 자녀의 의무로 삼지 않는다.",
    "distinctFromOtherParagraphs": "B의 표현 선택과 A의 수신 책임",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-question-treated-as-rejection"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "71b3ec665e36ff80d62e",
          "domain": "CHILDREN"
        },
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "825fd4e9a742a121464b",
          "domain": "PARENTS"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "자녀의 설명 솜씨에 회복을 맡김",
      "parentChecksFirst": "불이익 없는 반응과 설명을 마련한다.",
      "childExpression": "질문·보류·안전한 지원자를 선택할 수 있다.",
      "adultChange": "불이익 없는 반응과 설명을 마련한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "질문·보류·안전한 지원자를 선택할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P3:child-short-request-parent-supports",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "coreMeaning": "자녀가 짧게 요청해도 부모가 필요한 안전과 지원을 확인하는 회복 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "같은 B→A 응답 부담을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모는 알고 싶은 사정과 지금 필요한 지원을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "자녀는 설명을 나중에 하거나 다른 통로를 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "부모가 도움을 먼저 확인했는지 점검한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "242d420d68455dae6761",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "f56616fb042e916a2137",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "childChoice"
    ],
    "positive": "지원 요청의 부담을 낮출 가능성",
    "risk": "부모가 만족할 설명을 해야 도와줌",
    "factBomb": "설명이 완성될 때까지 필요한 도움을 미뤄야 하는 것은 아니다.",
    "twist": "도움을 받은 뒤 더 말할 여지도 생길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 짧게 도움을 청한다면 부모는 급한 위험과 원하는 지원부터 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "수신·지원·추가 질문의 범위를 나눈다.",
    "childAvailableChoice": "짧은 요청·보류·다른 안전한 도움을 고를 수 있다.",
    "counterexample": "긴급 위험의 전문 판단을 대화로 대신하지 않는다.",
    "distinctFromOtherParagraphs": "B의 짧은 요청과 A의 지원 책임",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-quiet-response-increases-parent-demand"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "242d420d68455dae6761",
          "domain": "CHILDREN"
        },
        {
          "owner": "A",
          "type": "ESFJ",
          "sourceKey": "f56616fb042e916a2137",
          "domain": "PARENTS"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "부모가 만족할 설명을 해야 도와줌",
      "parentChecksFirst": "수신·지원·추가 질문의 범위를 나눈다.",
      "childExpression": "짧은 요청·보류·다른 안전한 도움을 고를 수 있다.",
      "adultChange": "수신·지원·추가 질문의 범위를 나눈다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "짧은 요청·보류·다른 안전한 도움을 고를 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P3:child-change-parent-replans",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "coreMeaning": "자녀가 바뀐 관심을 말하고 부모가 현재 지원을 조정하는 회복 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "같은 B→A 변화 조건이 도입돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모는 과거 준비를 현재 참여 의무로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "작은 시험·지원 범위·다시 볼 때를 정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "자녀가 새 성과를 보장할 필요는 없다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "6fa914122dba7be984fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "d34d165d4966692ca6cb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
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
    "topics": [
      "repair",
      "childChoice"
    ],
    "positive": "현재 관심을 지원에 반영할 가능성",
    "risk": "마지막 기회라며 변경을 압박",
    "factBomb": "바뀐 관심을 설명하는 일이 부모의 수고를 갚는 시험이 되어서는 안 된다.",
    "twist": "종료 조건을 정하면 현재 탐색도 구체적으로 볼 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동을 바꾼다면 부모는 필요한 지원과 실제 남은 부담을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "자신의 기대와 지원 계획을 수정한다.",
    "childAvailableChoice": "관심·대안·휴식을 선택할 수 있다.",
    "counterexample": "실제 실패·비용·이력은 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "B 변화 표현과 A 계획 수정",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-interest-changes-parent-plan"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "6fa914122dba7be984fd",
          "domain": "CHILDREN"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "d34d165d4966692ca6cb",
          "domain": "PARENTS"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "마지막 기회라며 변경을 압박",
      "parentChecksFirst": "자신의 기대와 지원 계획을 수정한다.",
      "childExpression": "관심·대안·휴식을 선택할 수 있다.",
      "adultChange": "자신의 기대와 지원 계획을 수정한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심·대안·휴식을 선택할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P3:child-boundary-parent-seeks-adult",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "SCHOOL",
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B에게 남길 표현 선택과 부모의 보호·응답은 무엇인가?",
    "coreMeaning": "자녀가 부모 감정의 돌봄을 멈출 수 있게 부모가 지원 책임을 되찾는 회복 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "같은 B→A 정서 전가 조건을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "부모가 아이의 위로를 성인 지원과 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "자녀가 거절해도 안전과 관심을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "부모의 요구와 지원 대상이 바뀌었는지 점검한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "758f1fd0edec5f2f8304",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "cb9ee7415c4e3089e7f9",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "childChoice"
    ],
    "positive": "자녀의 관심과 경계를 함께 남길 가능성",
    "risk": "거절한 자녀를 차갑다고 평가",
    "factBomb": "아이의 경계를 존중하는 일도 부모가 감당할 반응의 일부다.",
    "twist": "부모가 지원받으면 자녀는 가족의 조정자가 되지 않아도 된다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 자녀가 듣기 어렵다고 말한다면 부모는 받아들이고 필요한 지원을 구한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반응 조절과 성인 지원을 직접 맡는다.",
    "childAvailableChoice": "멈춤·거리·도움 요청을 고를 수 있다.",
    "counterexample": "위험을 자녀의 경계 표현 부족으로 돌리지 않는다.",
    "distinctFromOtherParagraphs": "B의 경계와 A의 성인 책임",
    "precedingMeaningRefs": [
      "pcpr:material:CH06.P3:ba-care-becomes-parent-dependence"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "758f1fd0edec5f2f8304",
          "domain": "CHILDREN"
        },
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "cb9ee7415c4e3089e7f9",
          "domain": "PARENTS"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "거절한 자녀를 차갑다고 평가",
      "parentChecksFirst": "반응 조절과 성인 지원을 직접 맡는다.",
      "childExpression": "멈춤·거리·도움 요청을 고를 수 있다.",
      "adultChange": "반응 조절과 성인 지원을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "멈춤·거리·도움 요청을 고를 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P4:young-rule-repair-with-model",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "coreMeaning": "어린 자녀에게 규칙을 다시 설명할 때 성인의 행동 모델과 실제 작은 선택을 남긴다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "실제 이해·수행 가능성과 안전을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "부모가 바꿀 행동도 구체적으로 말한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "자녀에게 과거를 반성해 설명할 성인 책임을 요구하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "다음 같은 활동에서 지원이 맞았는지 살핀다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "5511525de4a015d143f6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "b1ef5ca26a18193d1227",
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
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "development"
    ],
    "positive": "실행 가능한 규칙을 다시 알아볼 가능성",
    "risk": "어른의 큰 사과 뒤 같은 모욕 반복",
    "factBomb": "다음 행동이 바뀌지 않으면 미안하다는 설명만으로 규칙이 달라지지 않는다.",
    "twist": "어른도 지키는 모습을 보이는 것이 길게 설명하는 것보다 명확할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 정리 규칙이 어려웠다면 부모는 필요한 행동을 보여주고 가능한 방법을 남긴다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "설명·모델·안전 지원을 맡는다.",
    "childAvailableChoice": "작은 방법을 고르거나 도움을 요청할 수 있다.",
    "counterexample": "발달·언어·안전 판단을 유형으로 대체하지 않는다.",
    "distinctFromOtherParagraphs": "어린 자녀 맥락의 비대칭적 회복",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "어른의 큰 사과 뒤 같은 모욕 반복",
      "parentChecksFirst": "설명·모델·안전 지원을 맡는다.",
      "childExpression": "작은 방법을 고르거나 도움을 요청할 수 있다.",
      "adultChange": "설명·모델·안전 지원을 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "작은 방법을 고르거나 도움을 요청할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P4:teen-device-rule-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "coreMeaning": "기기 약속을 실제 목적·지원·재검토 계기로 다시 정할 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "실제 필요와 위험을 함께 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "부모가 제한의 이유와 변경 가능한 항목을 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "자녀가 필요한 사용과 불편한 범위를 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "상황이 달라지면 규칙과 지원을 다시 본다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "repair",
      "digital"
    ],
    "positive": "목적에 맞는 약속을 만들 가능성",
    "risk": "일방 규칙을 공동 합의라고 부름",
    "factBomb": "함께 정했다는 말에는 자녀가 바꿀 수 있었던 부분도 있어야 한다.",
    "twist": "작은 항목을 시험하면 모든 사용을 한 번에 판단하지 않아도 된다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 기기 규칙을 다시 본다면 부모는 목적과 다음 검토 계기를 정한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "안전·이유·선택·재검토를 마련한다.",
    "childAvailableChoice": "의견·대안·도움 요청을 선택할 수 있다.",
    "counterexample": "수치 처방·진단·법률 판단으로 확대하지 않는다.",
    "distinctFromOtherParagraphs": "디지털 갈등의 구체적인 재검토 절차",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P1:device-rule-needs-reason"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "일방 규칙을 공동 합의라고 부름",
      "parentChecksFirst": "안전·이유·선택·재검토를 마련한다.",
      "childExpression": "의견·대안·도움 요청을 선택할 수 있다.",
      "adultChange": "안전·이유·선택·재검토를 마련한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "의견·대안·도움 요청을 선택할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P4:adult-consent-and-contact-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "ADULT"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "coreMeaning": "성인 자녀의 연락·방문·정보 경계를 현재 동의로 다시 정하는 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "실제 성인 대학 맥락과 당사자 선택을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "부모가 원하는 연결과 상대가 가능한 범위를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "조언·실행 지원·개인 결정은 별도 합의한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "생활 조건이 바뀌면 동의 범위를 다시 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "58ee6bd5417794df4aec",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
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
    "topics": [
      "repair",
      "adultChild"
    ],
    "positive": "독립 속에서 가능한 연결을 남길 가능성",
    "risk": "과거 지원을 경계 거절의 벌로 사용",
    "factBomb": "예전에 도왔다는 사실이 지금의 방문 동의를 대신하지 않는다.",
    "twist": "작은 연락 합의로도 연결과 각자 생활을 함께 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 방문을 조정한다면 부모는 날짜·범위·공개 정보를 먼저 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "승인 요구를 줄이고 동의한 지원만 맡는다.",
    "childAvailableChoice": "방문·연락·조언·정보 경계를 선택할 수 있다.",
    "counterexample": "성인 전체의 법적 의무·지원 필요를 일반화하지 않는다.",
    "distinctFromOtherParagraphs": "성인 자녀의 독립적 회복 합의",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P1:adult-contact-is-not-permission"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "과거 지원을 경계 거절의 벌로 사용",
      "parentChecksFirst": "승인 요구를 줄이고 동의한 지원만 맡는다.",
      "childExpression": "방문·연락·조언·정보 경계를 선택할 수 있다.",
      "adultChange": "승인 요구를 줄이고 동의한 지원만 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "방문·연락·조언·정보 경계를 선택할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "pcpr:material:CH08.P4:safety-support-not-forced-reunion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG",
      "SCHOOL",
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "단계·상황별 규칙·동의·지원·재검토를 어떻게 남기는가?",
    "coreMeaning": "안전 우려를 일반 화해가 아닌 성인의 보호·전문 지원으로 구분하는 인수 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "실제 위험 판단은 전문 절차와 정보가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "성격 설명이 위험한 행동을 정당화하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "자녀에게 가해자 설득이나 가족 유지 책임을 주지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "안전한 지원과 필요한 보호는 성인이 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "4d0792e403615a91db52",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "topics": [
      "repair",
      "safety"
    ],
    "positive": "안전과 일반 조율의 경계를 남길 가능성",
    "risk": "화해·용서·가족 재결합을 우선 요구",
    "factBomb": "아이의 안전이 어른의 체면을 지키는 일 뒤로 밀려서는 안 된다.",
    "twist": "거리를 두고 지원받는 선택도 관계 판단과 별개로 필요할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 안전 우려가 있다면 성인은 적절한 보호와 전문 지원을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "보호·지원·안전 확인을 맡는다.",
    "childAvailableChoice": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
    "counterexample": "의료·심리·법률·아동보호 판단을 연구 DB로 대체하지 않는다.",
    "distinctFromOtherParagraphs": "갈등 조율과 다른 안전 경로",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P4:coercion-not-equal-style-conflict"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [],
      "direction": null,
      "canonicalPair": "지원되는 실제 관계 ID·종류·refs·기둥·양쪽 person ID·성립 조건 필요. 정의나 미상 시주로 검출하지 않음.",
      "mbtiPair": "일반 forward/reverse 원천 참고. parentChild 전용 pattern 필드는 없다. love/marriagePattern·관계명·reportLine을 양육 사실로 전용하지 않음.",
      "fusion": "같은 사람의 실제 명리·MBTI 두 root·rule·source assignment·기존 contexts/domain을 확인. 부모/자녀 개인 Fusion을 Pair 점수로 더하지 않음.",
      "projection": "PARENTS/CHILDREN 원천 존재는 현재 비연애 V4 scoring 기여나 적용 승인이 아님. 후속 별도 검토.",
      "development": "독립 나이 계산 없음. 실제 기준일·입력 검증·현재 지원 필요 확인 후 맥락 선택. birthDate나 MBTI는 발달·능력 검사 아님.",
      "guidanceScope": "외부 안내는 각 원천의 나이·상황 범위에 한정. TEEN/ADULT 비교는 각 맥락을 분리하며 양쪽 지침을 같은 사람에게 동시에 자동 적용하지 않음.",
      "unknownAge": "UNKNOWN 맥락은 일반 확인 질문만. 단계별 훈육·권한·자율성 범위 판정 보류.",
      "unknownMbti": "해당 개인 MBTI/Fusion 및 Pair 후보 보류. 상대 유형·명리·나이로 보충하지 않음. 원천이 없는 주장을 만들지 않음.",
      "unknownBirthTime": "시주·시주 관련 관계를 보충하지 않음. 실제 확인된 다른 기둥만 사용.",
      "recall": "같은 person ID·roleVersion·원천·방향·맥락으로 앞서 실제 표시된 호환 의미만 회수. 후보 존재를 표시 이력으로 보지 않음.",
      "minorSafety": "미성년 안전·돌봄·성인 감정 조절·지원 확보 책임은 성인에게 남음. 자녀가 부모를 위로·설득·용서하거나 가족을 유지할 의무 없음.",
      "adultBoundary": "성인 자녀의 선택·동의·독립적 생활 경계 존중. 지원 필요·능력 미확인 상태에서 영구 통제권이나 무조건적 독립을 판정하지 않음.",
      "professionalBoundary": "폭력·학대·방임·강압을 성향 차이로 정상화하지 않음. 의료·심리·법률·아동보호 판단은 연구 DB로 대체하지 않음."
    },
    "repairPlan": {
      "condition": "화해·용서·가족 재결합을 우선 요구",
      "parentChecksFirst": "보호·지원·안전 확인을 맡는다.",
      "childExpression": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
      "adultChange": "보호·지원·안전 확인을 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
      "revisit": "다음 같은 활동·결정 또는 실제 조건이 바뀔 때 부모가 지원·설명·선택 범위를 다시 확인",
      "improvementCheck": "부모가 구체 행동을 바꿨는가, 자녀에게 불이익 없는 의견·도움 통로가 실제 남았는가. 순종·성과를 회복 척도로 쓰지 않음.",
      "childMustRepairParent": false
    },
    "disallowed": [
      "자녀의 성적·지능·적성·정서·발달·실제 행동·미래 성격 단정",
      "부모 유형으로 양육 성공률·좋은/나쁜 부모 판정",
      "부모 감정·안전·가족 유지 책임을 미성년 자녀에게 전가",
      "성인 자녀를 영구적 허락 대상으로 해석",
      "역할 없는 과거 입력에 부모/자녀를 자동 생성",
      "연애·배우자·성적 매력의 부모·자녀 전용",
      "연구 ID를 계산 Evidence ID로 승격",
      "실제 경험을 가상 장면으로부터 창작"
    ],
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  }
];
