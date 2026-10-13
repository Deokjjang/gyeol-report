/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH03_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH03.P1:b-interest-not-achievement-label",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B의 관심과 질문을 능력 사실 없이 어떻게 들을 수 있는가?",
    "coreMeaning": "B의 관심별 탐색 참고를 지능이나 성취의 사실과 구분해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "자녀 B의 child 원천을 부모의 특성으로 사용하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "지식이 많다는 원문은 실제 능력 평가로 승인하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "현재 궁금한 것과 도움받을 자료를 직접 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "관심이 없다는 답도 문제 행동으로 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "5895562b63068759bb90",
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
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
      "childRole",
      "learning"
    ],
    "positive": "관심을 설명할 통로",
    "risk": "유형으로 잘할 과목을 미리 지정",
    "factBomb": "관심을 묻는 자리가 재능을 증명하는 시험이 되면 질문하기 어려워질 수 있다.",
    "twist": "많이 아는 분야보다 아직 모르는 것을 묻는 선택도 탐색의 일부다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새 주제를 알아본다면 부모는 지금 궁금한 질문부터 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "능력 평가를 멈추고 필요한 자료·안전·시간을 지원한다.",
    "childAvailableChoice": "관심을 설명하거나 바꾸고 도움을 요청할 수 있다.",
    "counterexample": "성적·지능·진단·적성을 원천 문장으로 확정하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 독립적인 탐색 출발점",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "5895562b63068759bb90",
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
      "condition": "유형으로 잘할 과목을 미리 지정",
      "parentChecksFirst": "능력 평가를 멈추고 필요한 자료·안전·시간을 지원한다.",
      "childExpression": "관심을 설명하거나 바꾸고 도움을 요청할 수 있다.",
      "adultChange": "능력 평가를 멈추고 필요한 자료·안전·시간을 지원한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심을 설명하거나 바꾸고 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH03.P1:b-fairness-question-not-rebellion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B의 관심과 질문을 능력 사실 없이 어떻게 들을 수 있는가?",
    "coreMeaning": "B의 공정한 기준 관심을 규칙에 대한 질문의 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "공정함 관련 참고는 실제 불만이나 반항의 이력이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "자녀가 알아듣지 못한 이유와 부모의 의도를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "규칙이 누구에게 어떻게 적용되는지 확인할 수 있어야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "안전 책임은 자녀의 설득 능력에 달려 있지 않다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "dbac6788077f6b449dd2",
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
    "topics": [
      "childRole",
      "communication"
    ],
    "positive": "기준의 빈틈을 알릴 가능성",
    "risk": "부모가 납득할 논리를 대야만 의견을 허용",
    "factBomb": "이유를 잘 말하는 자녀만 존중받아야 하는 것은 아니다.",
    "twist": "짧은 질문도 규칙을 더 정확히 설명할 단서가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 일상 규칙의 차이를 묻는다면 부모는 비교 대신 실제 적용 이유를 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "질문을 듣고 바꿀 부분과 보호할 조건을 구분한다.",
    "childAvailableChoice": "왜 다른지 묻거나 이해하기 쉬운 설명을 요청할 수 있다.",
    "counterexample": "실제 갈등이 없으면 규칙을 싫어했던 경험으로 서술하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 기준 질문과 부모 설명 책임",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESTJ",
          "sourceKey": "dbac6788077f6b449dd2",
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
      "condition": "부모가 납득할 논리를 대야만 의견을 허용",
      "parentChecksFirst": "질문을 듣고 바꿀 부분과 보호할 조건을 구분한다.",
      "childExpression": "왜 다른지 묻거나 이해하기 쉬운 설명을 요청할 수 있다.",
      "adultChange": "질문을 듣고 바꿀 부분과 보호할 조건을 구분한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "왜 다른지 묻거나 이해하기 쉬운 설명을 요청할 수 있다.",
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
    "id": "pcpr:material:CH03.P1:b-expression-without-talent-prediction",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀 B의 관심과 질문을 능력 사실 없이 어떻게 들을 수 있는가?",
    "coreMeaning": "B의 감각적 표현 참고를 실제 재능·직업 판단과 분리하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "child 원천의 활동 관심은 개인의 현재 적성이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "표현 결과보다 자녀가 선택하고 바꿀 범위를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "부모는 필요한 재료·비용·안전 조건을 검토한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "그림이나 활동을 하지 않는다고 유형과 다른 자녀로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "e082f6c2d0c63170fc6e",
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
        "id": "sar:facet:EXPRESSION:visibility-control",
        "axis": "EXPRESSION",
        "definition": "드러낼 범위와 대상을 고름",
        "condition": "공개 동의를 별도로 확인",
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
      "childRole",
      "learning"
    ],
    "positive": "다른 표현 통로를 시험할 가능성",
    "risk": "예체능 소질을 정해 성과를 요구",
    "factBomb": "표현할 기회를 준다는 말과 잘하는 결과를 요구하는 말은 다르다.",
    "twist": "마음에 들지 않은 작품을 바꾸는 선택도 자기표현일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 표현 활동을 고른다면 자녀는 해보고 싶은 방식과 멈출 지점을 고른다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "활동을 시험할 조건을 마련하되 결과를 약속받지 않는다.",
    "childAvailableChoice": "말·글·만들기 등 편한 방법을 선택할 수 있다.",
    "counterexample": "재능·건강·감각 특성을 유형에서 단정하지 않는다.",
    "distinctFromOtherParagraphs": "표현의 가능성과 능력 사실 분리",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "e082f6c2d0c63170fc6e",
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
      "condition": "예체능 소질을 정해 성과를 요구",
      "parentChecksFirst": "활동을 시험할 조건을 마련하되 결과를 약속받지 않는다.",
      "childExpression": "말·글·만들기 등 편한 방법을 선택할 수 있다.",
      "adultChange": "활동을 시험할 조건을 마련하되 결과를 약속받지 않는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말·글·만들기 등 편한 방법을 선택할 수 있다.",
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
    "id": "pcpr:material:CH03.P2:b-predictable-help-sequence",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀가 도움받고 표현할 통로는 어떻게 마련되는가?",
    "coreMeaning": "B의 순서를 알고 싶은 참고를 실제 안내와 도움의 필요로 확인하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "예측 가능한 순서 원천은 자녀가 불안을 겪는다는 진단이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "무엇이 먼저인지와 도움받을 때를 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "자녀가 기억 못한 부분은 다시 보여줄 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "기대 수준은 실제 이해와 수행 가능성을 확인해 정한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "cf5096af08861edcca86",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "5511525de4a015d143f6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
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
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "childRole",
      "protection"
    ],
    "positive": "다음 행동을 알아볼 단서",
    "risk": "유형을 이유로 모든 변화를 금지",
    "factBomb": "설명을 한 번 했다는 사실이 다음에도 도움 없이 할 수 있다는 뜻은 아니다.",
    "twist": "짧은 예고와 다시 보여주기가 선택할 준비를 도울 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 어린 자녀의 활동 순서를 바꾼다면 부모는 다음 행동 하나를 보여준다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "변경 이유와 지금 가능한 행동을 설명한다.",
    "childAvailableChoice": "순서를 다시 묻거나 도움을 요청할 수 있다.",
    "counterexample": "실제 연령·이해 능력 미확인 시 단계별 방법을 확정하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 안내 필요와 실제 지원",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "cf5096af08861edcca86",
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
      "condition": "유형을 이유로 모든 변화를 금지",
      "parentChecksFirst": "변경 이유와 지금 가능한 행동을 설명한다.",
      "childExpression": "순서를 다시 묻거나 도움을 요청할 수 있다.",
      "adultChange": "변경 이유와 지금 가능한 행동을 설명한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "순서를 다시 묻거나 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH03.P2:b-quiet-route-to-help",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀가 도움받고 표현할 통로는 어떻게 마련되는가?",
    "coreMeaning": "B의 글로 정리하는 참고를 안전한 의견 통로의 후보로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "글이 편하다는 설명은 실제 대화 능력 부족이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "자녀는 말·글·다른 지원자 중 가능한 통로를 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "부모는 즉답이나 공개 설명을 강요하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "표현 방식이 달라도 내용은 실제로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
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
      "childRole",
      "trust"
    ],
    "positive": "정리한 의견을 전달할 여지",
    "risk": "말이 적다고 감정이나 의견이 없다고 봄",
    "factBomb": "바로 말하지 못한다는 사실이 할 말이 없다는 뜻은 아니다.",
    "twist": "조금 늦게 온 설명도 중요한 정보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 어려운 이야기를 꺼낸다면 부모는 글로 남겨도 되는지 묻고 확인할 때를 정한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "통로를 마련하고 수신했다는 반응을 남긴다.",
    "childAvailableChoice": "말하거나 쓰거나 준비될 때까지 보류할 수 있다.",
    "counterexample": "실제 위험이 급한 상황의 보호를 표현 대기만으로 미루지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 표현 통로와 부모의 수신 책임",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
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
      "condition": "말이 적다고 감정이나 의견이 없다고 봄",
      "parentChecksFirst": "통로를 마련하고 수신했다는 반응을 남긴다.",
      "childExpression": "말하거나 쓰거나 준비될 때까지 보류할 수 있다.",
      "adultChange": "통로를 마련하고 수신했다는 반응을 남긴다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말하거나 쓰거나 준비될 때까지 보류할 수 있다.",
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
    "id": "pcpr:material:CH03.P2:b-gentle-feedback-without-fragile-label",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀가 도움받고 표현할 통로는 어떻게 마련되는가?",
    "coreMeaning": "B의 거친 반응에 대한 참고를 현재 피드백 조건을 묻는 자료로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "민감하다는 원문은 실제 정서 상태를 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "자녀가 불편한 말과 바꿔야 할 행동을 나눠 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "부모는 내용 전달을 이유로 모욕을 정당화하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "칭찬만 해야 한다거나 자녀가 반드시 충격받았다고 말하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "childRole",
      "trust"
    ],
    "positive": "존중을 유지한 구체적인 피드백 가능성",
    "risk": "상처받기 쉬운 유형이라며 설명을 생략",
    "factBomb": "맞는 말을 했다는 이유가 어떤 말투든 괜찮다는 허락은 아니다.",
    "twist": "부드러운 말과 분명한 기준은 함께 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 행동을 고쳐야 한다면 부모는 인격 대신 바꿀 행동 하나를 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반응을 듣고 필요한 설명과 지원을 조정한다.",
    "childAvailableChoice": "불편한 표현을 말하거나 도움받을 통로를 선택할 수 있다.",
    "counterexample": "심리 진단·트라우마·실제 피해를 유형으로 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "현재 피드백의 조건과 정서 사실 구분",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
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
      "condition": "상처받기 쉬운 유형이라며 설명을 생략",
      "parentChecksFirst": "반응을 듣고 필요한 설명과 지원을 조정한다.",
      "childExpression": "불편한 표현을 말하거나 도움받을 통로를 선택할 수 있다.",
      "adultChange": "반응을 듣고 필요한 설명과 지원을 조정한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "불편한 표현을 말하거나 도움받을 통로를 선택할 수 있다.",
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
    "id": "pcpr:material:CH03.P3:b-questions-expand-parent-information",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀의 관점이 성인 책임을 맡지 않고 기여할 조건은 무엇인가?",
    "coreMeaning": "B의 질문 관심이 부모가 놓친 내용을 알려줄 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "지식이 빨리 는다고 한 원문을 현재 능력으로 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "자녀의 질문은 부모를 가르칠 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "부모는 모르는 내용을 같이 확인할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "관심의 변화도 설명할 수 있게 남긴다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "3b16f6d2078a7dd2a82f",
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
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
      "childRole",
      "learning"
    ],
    "positive": "새로운 관점을 들을 기회",
    "risk": "질문을 많이 해야 좋은 자녀라고 평가",
    "factBomb": "부모가 배웠다는 좋은 결과도 아이가 계속 흥미로운 답을 내야 할 이유는 아니다.",
    "twist": "질문 하나가 결론보다 함께 확인할 과정을 만들 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새로운 관심을 말한다면 부모는 자녀가 궁금한 부분을 따라 자료를 찾는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "배우는 책임을 자녀에게 맡기지 않고 필요한 검증을 한다.",
    "childAvailableChoice": "알고 싶은 질문을 고르거나 설명을 멈출 수 있다.",
    "counterexample": "실제 관심·학업 속도·성적을 추론하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 기여를 교육 의무로 만들지 않음",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "3b16f6d2078a7dd2a82f",
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
      "condition": "질문을 많이 해야 좋은 자녀라고 평가",
      "parentChecksFirst": "배우는 책임을 자녀에게 맡기지 않고 필요한 검증을 한다.",
      "childExpression": "알고 싶은 질문을 고르거나 설명을 멈출 수 있다.",
      "adultChange": "배우는 책임을 자녀에게 맡기지 않고 필요한 검증을 한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "알고 싶은 질문을 고르거나 설명을 멈출 수 있다.",
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
    "id": "pcpr:material:CH03.P3:b-peer-care-not-family-regulator",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
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
    "readerQuestion": "자녀의 관점이 성인 책임을 맡지 않고 기여할 조건은 무엇인가?",
    "coreMeaning": "B의 다른 사람을 돕는 참고를 부모 감정의 관리 의무와 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "친화력 원문은 실제 인기나 돌봄 능력의 사실이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "자녀가 다른 사람을 걱정해도 어른의 문제를 맡지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "부모는 자녀가 감당할 수 없는 요청을 성인에게 돌린다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "자녀가 도움을 거절해도 관계의 가치가 줄지 않는다.",
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
      "childRole",
      "roles"
    ],
    "positive": "자녀가 중요하게 보는 사람과 필요를 알 기회",
    "risk": "다정함을 가족 감정의 조정 책임으로 만듦",
    "factBomb": "잘 위로한다는 칭찬이 아이에게 어른을 계속 달래라는 부탁이 되어서는 안 된다.",
    "twist": "도와주지 않아도 된다는 경계가 자녀의 관심을 지킬 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 자녀가 부모의 피로를 걱정한다면 부모는 성인 지원을 찾을 책임이 자신에게 있음을 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "부모의 정서 조절과 지원 요청을 직접 맡는다.",
    "childAvailableChoice": "걱정을 표현하거나 자신의 활동으로 돌아갈 수 있다.",
    "counterexample": "실제 부모의 피로·가족 갈등을 만들지 않는다.",
    "distinctFromOtherParagraphs": "돌봄 관심과 부모 역할 전가의 차이",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
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
      "condition": "다정함을 가족 감정의 조정 책임으로 만듦",
      "parentChecksFirst": "부모의 정서 조절과 지원 요청을 직접 맡는다.",
      "childExpression": "걱정을 표현하거나 자신의 활동으로 돌아갈 수 있다.",
      "adultChange": "부모의 정서 조절과 지원 요청을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "걱정을 표현하거나 자신의 활동으로 돌아갈 수 있다.",
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
    "id": "pcpr:material:CH03.P3:b-deep-interest-with-change-option",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀의 관점이 성인 책임을 맡지 않고 기여할 조건은 무엇인가?",
    "coreMeaning": "B의 한 분야에 몰입하는 참고를 관심 지속과 변경 선택의 질문으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "최고가 되고 싶다는 원문은 실제 목표나 성취가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "부모는 흥미의 깊이와 결과 약속을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "자녀가 방향을 바꾸거나 쉬어도 지원 요청이 가능해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "성과가 없다는 이유로 시도의 의미를 없애지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "e522803dbd756411fcef",
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
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
      "childRole",
      "learning"
    ],
    "positive": "깊이 알아볼 시간을 지원할 가능성",
    "risk": "한번 고른 관심을 평생 적성으로 고정",
    "factBomb": "오래 좋아했다는 사실도 계속 좋아해야 할 계약은 아니다.",
    "twist": "중단이나 변경을 알아보는 선택이 관심을 더 정확히 확인하게 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동을 계속할지 논의한다면 부모는 현재 필요한 지원과 바뀐 관심을 함께 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "목표 대신 현재 선택과 부담을 확인한다.",
    "childAvailableChoice": "이어가거나 바꾸고 휴식을 요청할 수 있다.",
    "counterexample": "실제 몰입·재능·미래 직업을 유형으로 정하지 않는다.",
    "distinctFromOtherParagraphs": "관심의 깊이와 영구 진로를 분리",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "INTJ",
          "sourceKey": "e522803dbd756411fcef",
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
      "condition": "한번 고른 관심을 평생 적성으로 고정",
      "parentChecksFirst": "목표 대신 현재 선택과 부담을 확인한다.",
      "childExpression": "이어가거나 바꾸고 휴식을 요청할 수 있다.",
      "adultChange": "목표 대신 현재 선택과 부담을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "이어가거나 바꾸고 휴식을 요청할 수 있다.",
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
    "id": "pcpr:material:CH03.P4:b-brief-answer-still-has-choice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀의 응답·동의·활동 참고를 실제 마음과 어떻게 구분하는가?",
    "coreMeaning": "B의 짧은 대답 참고를 이해·동의·도움 필요와 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "짧은 응답 원문을 실제 이해나 무관심의 증거로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "부모는 무엇에 답했는지 확인할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "자녀의 응답 길이를 관계 성실함의 기준으로 삼지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "내용이 미확인이면 추측으로 빈칸을 채우지 않는다.",
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
        "owner": "GUIDANCE",
        "sourceKey": "ee509907f7d870f38308",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "childRole",
      "communication"
    ],
    "positive": "핵심 질문으로 이해를 확인할 가능성",
    "risk": "짧은 말에 숨은 의도나 반항을 붙임",
    "factBomb": "응답이 짧다는 이유로 부모가 원하는 뜻을 대신 넣을 수는 없다.",
    "twist": "짧아도 선택이 명확한 답은 긴 설명보다 도움이 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 여부를 묻는다면 부모는 동의와 도움 필요를 따로 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "질문 하나씩 내용과 현재 동의를 확인한다.",
    "childAvailableChoice": "짧게 답하거나 다시 설명해달라고 요청할 수 있다.",
    "counterexample": "실제 언어·인지 능력을 유형으로 판정하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 응답 길이와 의미의 비동일성",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "242d420d68455dae6761",
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
      "condition": "짧은 말에 숨은 의도나 반항을 붙임",
      "parentChecksFirst": "질문 하나씩 내용과 현재 동의를 확인한다.",
      "childExpression": "짧게 답하거나 다시 설명해달라고 요청할 수 있다.",
      "adultChange": "질문 하나씩 내용과 현재 동의를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "짧게 답하거나 다시 설명해달라고 요청할 수 있다.",
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
    "id": "pcpr:material:CH03.P4:b-agreement-can-hide-unasked-view",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "자녀의 응답·동의·활동 참고를 실제 마음과 어떻게 구분하는가?",
    "coreMeaning": "B의 규칙 준수 참고가 말하지 않은 의견을 지우지 않도록 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "모범적인 자녀 원문은 실제 행동이나 성적의 확인이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "따르겠다는 답과 원하는 선택은 다른 질문이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "부모는 바꿔 말해도 불이익이 없을 통로를 마련한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "자녀에게 부모를 안심시키려고 동의할 의무를 주지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "a98212d9a6491c70cd80",
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
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
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
      "childRole",
      "autonomy"
    ],
    "positive": "작은 이견을 일찍 들을 가능성",
    "risk": "좋은 자녀라는 평가 때문에 거절을 어렵게 만듦",
    "factBomb": "괜찮다고 말한 아이에게도 다시 고를 자리가 필요할 수 있다.",
    "twist": "새로운 의견을 듣는 것이 약속을 가볍게 보는 일만은 아니다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 정한 일정을 다시 본다면 부모는 바꾸고 싶은 항목을 조용히 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "복종을 칭찬하기보다 실제 선택을 확인한다.",
    "childAvailableChoice": "동의를 수정하거나 어려운 항목을 말할 수 있다.",
    "counterexample": "실제 숨긴 감정이나 과거 억압을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "자녀의 조용한 동의와 자유로운 선택 분리",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ISFJ",
          "sourceKey": "a98212d9a6491c70cd80",
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
      "condition": "좋은 자녀라는 평가 때문에 거절을 어렵게 만듦",
      "parentChecksFirst": "복종을 칭찬하기보다 실제 선택을 확인한다.",
      "childExpression": "동의를 수정하거나 어려운 항목을 말할 수 있다.",
      "adultChange": "복종을 칭찬하기보다 실제 선택을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "동의를 수정하거나 어려운 항목을 말할 수 있다.",
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
    "id": "pcpr:material:CH03.P4:b-active-interest-not-risk-identity",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
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
    "readerQuestion": "자녀의 응답·동의·활동 참고를 실제 마음과 어떻게 구분하는가?",
    "coreMeaning": "B의 짧은 설명·직접 활동 참고를 위험한 자녀라는 평가와 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "긴 이야기를 어려워한다는 설명은 실제 주의력 진단이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "부모는 필요한 안전 설명을 이해할 방법으로 바꾼다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "자녀는 무엇을 해보고 싶은지 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "실제 위험을 확인하고 필요한 보호는 성인이 맡는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "15bdd9dde80da5ce278d",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
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
      "childRole",
      "protection"
    ],
    "positive": "활동과 설명을 연결할 여지",
    "risk": "활동적 유형이라 위험을 감수할 사람으로 고정",
    "factBomb": "활동을 좋아한다는 참고만으로 위험을 이해했거나 감당할 수 있다고 볼 수는 없다.",
    "twist": "짧은 설명과 보여주기가 긴 설득보다 필요한 정보를 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새 활동을 시작한다면 부모는 안전한 방법을 확인하고 이해했는지 다시 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "위험·지원·중단 신호를 실제 상황에서 확인한다.",
    "childAvailableChoice": "설명을 다시 요청하거나 중단하고 도움을 청할 수 있다.",
    "counterexample": "실제 위험 허용이나 신체 능력을 유형으로 판정하지 않는다.",
    "distinctFromOtherParagraphs": "행동 참고와 안전 판단 분리",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "B",
          "type": "ESTP",
          "sourceKey": "15bdd9dde80da5ce278d",
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
      "condition": "활동적 유형이라 위험을 감수할 사람으로 고정",
      "parentChecksFirst": "위험·지원·중단 신호를 실제 상황에서 확인한다.",
      "childExpression": "설명을 다시 요청하거나 중단하고 도움을 청할 수 있다.",
      "adultChange": "위험·지원·중단 신호를 실제 상황에서 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "설명을 다시 요청하거나 중단하고 도움을 청할 수 있다.",
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
