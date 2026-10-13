/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH05_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH05.P1:ab-rule-as-explanation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
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
    "readerQuestion": "자녀 B 기준의 실제 십성과 A 원천은 어떤 지원 질문을 만드는가?",
    "coreMeaning": "B 수신 기준 정관 정의와 양쪽 원천을 규칙의 이유를 설명할 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "실제 A→B 수신 십성과 방향 ID를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "정관 정의는 부모가 옳다는 판정이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "부모의 사고 지원과 자녀의 질문 원천을 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "규칙의 이유와 바꿀 방법은 실제 상황에서 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "825fd4e9a742a121464b",
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
        "owner": "DIRECTION_AB",
        "sourceKey": "ce1defc1af72408fec4a",
        "sourceUse": "recipient_direction_definition",
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
      "direction",
      "protection"
    ],
    "positive": "예측 가능한 설명이 도움될 여지",
    "risk": "십성을 복종 요구의 근거로 사용",
    "factBomb": "기준을 설명할 권한이 자녀의 질문을 끝낼 권한은 아니다.",
    "twist": "이유를 다시 묻는 자녀의 말이 규칙을 더 정확히 만들 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 규칙을 설명한다면 부모는 안전 목적과 바꿀 부분을 나눈다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "자녀의 질문을 듣고 자신의 설명을 점검한다.",
    "childAvailableChoice": "이유를 묻거나 다른 방법을 제안할 수 있다.",
    "counterexample": "실제 수신 정관·양쪽 source가 없으면 이 후보를 보류한다.",
    "distinctFromOtherParagraphs": "수신자 십성과 부모의 설명 기여",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "825fd4e9a742a121464b",
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
      "actualNatalAndDirectionRoots": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "ce1defc1af72408fec4a",
          "sourceUse": "recipient_direction_definition",
          "actualCalculatedRootRequired": true
        }
      ],
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
      "condition": "십성을 복종 요구의 근거로 사용",
      "parentChecksFirst": "자녀의 질문을 듣고 자신의 설명을 점검한다.",
      "childExpression": "이유를 묻거나 다른 방법을 제안할 수 있다.",
      "adultChange": "자녀의 질문을 듣고 자신의 설명을 점검한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "이유를 묻거나 다른 방법을 제안할 수 있다.",
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
    "id": "pcpr:material:CH05.P1:ab-support-without-answer-ownership",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
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
    "readerQuestion": "자녀 B 기준의 실제 십성과 A 원천은 어떤 지원 질문을 만드는가?",
    "coreMeaning": "B 수신 정인 정의를 안심할 설명의 질문으로 쓰되 선택을 대신하지 않는다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "실제 방향·정인 정의를 개인 원국 정인과 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A의 경청 관심과 B의 정리 통로는 별개다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "자녀가 필요한 지원과 말할 범위를 고를 수 있어야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "받은 도움을 부모에게 모두 공개할 빚으로 만들지 않는다.",
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
        "sourceKey": "d50e782170a5c0a71e15",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "fe11b875c7ad3a9c8318",
        "sourceUse": "recipient_direction_definition",
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
      "direction",
      "trust"
    ],
    "positive": "도움을 요청할 여지",
    "risk": "보호했다는 이유로 결정과 정보 소유권을 요구",
    "factBomb": "안심시켜주겠다는 말에도 자녀가 원하지 않는 답은 있을 수 있다.",
    "twist": "기다리는 지원이 곧바로 해결하는 지원보다 필요할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 고민을 듣는다면 부모는 조언이 필요한지 먼저 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "지원 방식과 수신 여부를 확인한다.",
    "childAvailableChoice": "말·글·보류·다른 지원을 선택할 수 있다.",
    "counterexample": "실제 방향이나 나이·상황 조건이 없으면 보류한다.",
    "distinctFromOtherParagraphs": "방향 기여와 자녀의 정보 선택",
    "precedingMeaningRefs": [],
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
          "type": "INFJ",
          "sourceKey": "d50e782170a5c0a71e15",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "fe11b875c7ad3a9c8318",
          "sourceUse": "recipient_direction_definition",
          "actualCalculatedRootRequired": true
        }
      ],
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
      "condition": "보호했다는 이유로 결정과 정보 소유권을 요구",
      "parentChecksFirst": "지원 방식과 수신 여부를 확인한다.",
      "childExpression": "말·글·보류·다른 지원을 선택할 수 있다.",
      "adultChange": "지원 방식과 수신 여부를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말·글·보류·다른 지원을 선택할 수 있다.",
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
    "id": "pcpr:material:CH05.P1:ab-new-opportunity-with-safety",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
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
    "readerQuestion": "자녀 B 기준의 실제 십성과 A 원천은 어떤 지원 질문을 만드는가?",
    "coreMeaning": "B 수신 편재 정의와 활동 지원을 실제 기회·안전·선택 확인으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "편재는 돈이나 성공의 실제 사실이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "양쪽 원천과 B가 원하는 시도를 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "비용·위험·지원은 성인이 검토한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "자녀는 기회를 거절하거나 범위를 바꿀 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "34a4a6cf8a718fb338a9",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "0b40f2b7112d3c882b3a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "recipient_direction_definition",
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
      "direction",
      "learning"
    ],
    "positive": "지원할 선택지를 넓힐 가능성",
    "risk": "기회를 줬으니 성과를 내라고 압박",
    "factBomb": "좋은 기회라는 부모의 판단이 자녀의 동의를 대신하지는 않는다.",
    "twist": "시도 범위를 줄여도 새로운 정보를 얻는 기회는 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새 활동을 제안한다면 부모는 실제 부담과 지원을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "지원 준비와 참여 결정을 분리한다.",
    "childAvailableChoice": "참여·수정·거절을 말할 수 있다.",
    "counterexample": "실제 수신 편재·적용 조건이 없으면 보류하고 진로·재물 결과를 예언하지 않는다.",
    "distinctFromOtherParagraphs": "새 자극의 긍정 조건과 성인 보호",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ESTP",
          "sourceKey": "34a4a6cf8a718fb338a9",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENTJ",
          "sourceKey": "0b40f2b7112d3c882b3a",
          "domain": "CHILDREN"
        }
      ],
      "personA": "A 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. parenting 원천은 A 부모 역할에만 참고.",
      "personB": "B 본인의 실제 원국·입력 MBTI·개인 Fusion root만 사용. child 원천은 미검증 어린 시기 참고이며 성인 자녀에게 자동 전용하지 않음.",
      "actualNatalAndDirectionRoots": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "bbc18a4e615032647a49",
          "sourceUse": "recipient_direction_definition",
          "actualCalculatedRootRequired": true
        }
      ],
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
      "condition": "기회를 줬으니 성과를 내라고 압박",
      "parentChecksFirst": "지원 준비와 참여 결정을 분리한다.",
      "childExpression": "참여·수정·거절을 말할 수 있다.",
      "adultChange": "지원 준비와 참여 결정을 분리한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "참여·수정·거절을 말할 수 있다.",
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
    "id": "pcpr:material:CH05.P1:ab-pressure-is-not-protection",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
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
    "readerQuestion": "자녀 B 기준의 실제 십성과 A 원천은 어떤 지원 질문을 만드는가?",
    "coreMeaning": "B 수신 편관 정의를 안전 기준 확인의 질문으로 쓰되 압박을 정당화하지 않는다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "실제 방향 십성과 개인 원국 정의를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A의 책임 확인 선호와 B의 반응 가설은 별개다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "부모는 실제 위험과 자신의 불안을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "강압·위협은 유형 차이로 조율하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "0c2824cc2f62a5c72693",
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
        "owner": "DIRECTION_AB",
        "sourceKey": "f8f90022e047bfe61557",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "direction",
      "protection"
    ],
    "positive": "필요한 보호 기준을 분명히 할 여지",
    "risk": "편관이라 엄격해야 자녀가 성장한다고 단정",
    "factBomb": "걱정이 크다는 이유로 모든 통제가 보호가 되는 것은 아니다.",
    "twist": "위험을 구체화하면 제한하지 않아도 될 선택도 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동을 걱정한다면 부모는 확인된 위험과 지원 방법을 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "실제 안전을 확인하고 불필요한 제한을 다시 본다.",
    "childAvailableChoice": "어려운 조건을 말하고 안전한 도움을 요청할 수 있다.",
    "counterexample": "편관·학대·실제 감정을 서로 동일시하지 않는다.",
    "distinctFromOtherParagraphs": "십성의 자극과 강압의 비정당성",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "0c2824cc2f62a5c72693",
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
      "actualNatalAndDirectionRoots": [
        {
          "owner": "DIRECTION_AB",
          "sourceKey": "f8f90022e047bfe61557",
          "sourceUse": "recipient_direction_definition",
          "actualCalculatedRootRequired": true
        }
      ],
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
      "condition": "편관이라 엄격해야 자녀가 성장한다고 단정",
      "parentChecksFirst": "실제 안전을 확인하고 불필요한 제한을 다시 본다.",
      "childExpression": "어려운 조건을 말하고 안전한 도움을 요청할 수 있다.",
      "adultChange": "실제 안전을 확인하고 불필요한 제한을 다시 본다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "어려운 조건을 말하고 안전한 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH05.P2:ab-preview-before-change",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A의 지원이 자녀의 시도를 도울 조건은 무엇인가?",
    "coreMeaning": "부모의 예측 가능한 환경 관심이 자녀의 다음 행동을 도울 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 안내와 B의 순서 참고를 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "변경 예고는 이해를 확인한 뒤에만 유용성을 검토한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "부모가 필요한 지원을 직접 준비한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "아직 못한 행동을 의지 부족으로 판단하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f9709a2aaf92c814cb26",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
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
      "direction",
      "protection"
    ],
    "positive": "다음 행동을 알아볼 가능성",
    "risk": "설명했으니 혼자 해야 한다고 요구",
    "factBomb": "예고한 것과 도움 없이 수행할 수 있는 것은 다른 정보다.",
    "twist": "짧은 안내를 반복해도 자녀의 실패 판정일 필요는 없다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 순서를 바꾼다면 부모는 다음 행동을 보여주고 필요한 지원을 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "안내와 지원을 함께 제공한다.",
    "childAvailableChoice": "다시 듣거나 보여달라고 요청할 수 있다.",
    "counterexample": "실제 단계·능력이 없으면 실행 가능성을 판정하지 않는다.",
    "distinctFromOtherParagraphs": "A의 예고가 B에게 도착할 조건",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "f9709a2aaf92c814cb26",
          "domain": "PARENTS"
        },
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
      "condition": "설명했으니 혼자 해야 한다고 요구",
      "parentChecksFirst": "안내와 지원을 함께 제공한다.",
      "childExpression": "다시 듣거나 보여달라고 요청할 수 있다.",
      "adultChange": "안내와 지원을 함께 제공한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "다시 듣거나 보여달라고 요청할 수 있다.",
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
    "id": "pcpr:material:CH05.P2:ab-notice-without-mind-reading",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
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
    "readerQuestion": "부모 A의 지원이 자녀의 시도를 도울 조건은 무엇인가?",
    "coreMeaning": "부모가 표정에 관심을 갖는 지원을 자녀의 실제 필요 확인으로 연결한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 관심과 B의 따뜻한 환경 참고는 독립이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "표정의 뜻을 부모가 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "도움이 필요한지와 지금 말할지를 따로 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "답이 없으면 숨은 감정을 만들어내지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ea9519a12540624c4823",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "272c67e0206eba757597",
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
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
      "direction",
      "trust"
    ],
    "positive": "불편을 말할 통로",
    "risk": "도움 의도를 이유로 사생활을 캐묻기",
    "factBomb": "잘 살핀다는 말이 속마음을 대신 아는 뜻은 아니다.",
    "twist": "지금 말하지 않아도 되는 반응이 나중의 도움 요청을 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 표정이 달라 보인다면 부모는 관찰을 말하고 필요한 지원을 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "추측을 질문으로 바꾸고 선택을 기다린다.",
    "childAvailableChoice": "말하거나 보류하고 다른 지원을 고를 수 있다.",
    "counterexample": "실제 감정·친구 관계·사건을 유형으로 추론하지 않는다.",
    "distinctFromOtherParagraphs": "관찰 기여의 수신 조건",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ENFP",
          "sourceKey": "ea9519a12540624c4823",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "272c67e0206eba757597",
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
      "condition": "도움 의도를 이유로 사생활을 캐묻기",
      "parentChecksFirst": "추측을 질문으로 바꾸고 선택을 기다린다.",
      "childExpression": "말하거나 보류하고 다른 지원을 고를 수 있다.",
      "adultChange": "추측을 질문으로 바꾸고 선택을 기다린다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말하거나 보류하고 다른 지원을 고를 수 있다.",
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
    "id": "pcpr:material:CH05.P2:ab-help-one-step-then-return",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "부모 A의 지원이 자녀의 시도를 도울 조건은 무엇인가?",
    "coreMeaning": "부모의 경험 지원과 자녀의 직접 해보기 참고를 필요한 만큼의 도움으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "손감각·능력 원문을 실제 솜씨로 승인하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "부모는 안전한 시도 범위를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "막힌 부분만 돕고 다음 방법은 자녀에게 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "결과보다 지원이 필요한 지점을 본다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "88e81f230552092ca55c",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "b7c4f738dad8d6d8d61c",
        "sourceUse": "own_entered_type_only",
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
      "direction",
      "learning"
    ],
    "positive": "직접 시도한 부분을 남길 가능성",
    "risk": "완성품을 빨리 만들려고 모두 대신 함",
    "factBomb": "끝내준 결과가 아이가 해본 경험을 대신할 수는 없다.",
    "twist": "조금 덜 완성돼도 직접 고른 방법이 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 만들기를 한다면 부모는 안전을 확인하고 요청받은 부분만 돕는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "개입 범위를 묻고 안전 책임은 유지한다.",
    "childAvailableChoice": "도움을 요청하거나 직접 다시 해볼 수 있다.",
    "counterexample": "실제 도구 안전·발달·기술 능력을 유형으로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "도움과 대신 실행의 차이",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFP",
          "sourceKey": "88e81f230552092ca55c",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "b7c4f738dad8d6d8d61c",
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
      "condition": "완성품을 빨리 만들려고 모두 대신 함",
      "parentChecksFirst": "개입 범위를 묻고 안전 책임은 유지한다.",
      "childExpression": "도움을 요청하거나 직접 다시 해볼 수 있다.",
      "adultChange": "개입 범위를 묻고 안전 책임은 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "도움을 요청하거나 직접 다시 해볼 수 있다.",
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
    "id": "pcpr:material:CH05.P2:ab-allow-wrong-first-answer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
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
    "readerQuestion": "부모 A의 지원이 자녀의 시도를 도울 조건은 무엇인가?",
    "coreMeaning": "부모의 원리 설명과 자녀의 이유 질문을 틀린 첫 답도 허용하는 탐색으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "자녀의 질문 참고를 지적 우수성으로 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "부모의 설명과 자녀가 묻는 문제를 먼저 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "모르는 답을 함께 확인할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "논리로 이긴 반응을 좋은 교육으로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "43161eed254c850e342b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "668bff6bf74135a0bc03",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "direction",
      "learning"
    ],
    "positive": "다른 가정을 검토할 가능성",
    "risk": "질문할수록 부모를 설득해야 하는 시험이 됨",
    "factBomb": "정답을 아는 부모라도 자녀의 질문을 아직 모를 수 있다.",
    "twist": "틀린 첫 가설이 무엇을 더 알아볼지 보여줄 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 다른 방법을 제안한다면 부모는 이유를 듣고 확인할 자료를 함께 고른다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "질문을 끝내기보다 이해 여부를 확인한다.",
    "childAvailableChoice": "모르거나 다르게 생각한다고 말할 수 있다.",
    "counterexample": "학력·지능·성과를 유형으로 확정하지 않는다.",
    "distinctFromOtherParagraphs": "설명 기여와 탐색의 주도권",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "43161eed254c850e342b",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "INTJ",
          "sourceKey": "668bff6bf74135a0bc03",
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
      "condition": "질문할수록 부모를 설득해야 하는 시험이 됨",
      "parentChecksFirst": "질문을 끝내기보다 이해 여부를 확인한다.",
      "childExpression": "모르거나 다르게 생각한다고 말할 수 있다.",
      "adultChange": "질문을 끝내기보다 이해 여부를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "모르거나 다르게 생각한다고 말할 수 있다.",
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
    "id": "pcpr:material:CH05.P3:ab-expectation-becomes-result-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
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
    "readerQuestion": "부모의 편의·기대가 자녀에게 남길 부담은 무엇인가?",
    "coreMeaning": "부모의 기대가 자녀에게 결과로 보답할 빚이 되는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 성공 투영 원문은 실제 행동 이력이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 반응 가설을 현재 감정으로 단정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "지원한 일과 원하는 결과를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "자녀의 다른 관심을 부모 실패로 번역하지 않는다.",
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
      "direction",
      "friction"
    ],
    "positive": "필요한 지원을 명시할 기회",
    "risk": "돌봄을 성과의 대가로 만듦",
    "factBomb": "많이 지원했다는 사실이 자녀의 결과를 부모의 평가표로 만들 권리는 아니다.",
    "twist": "기대의 크기를 말하는 대신 지금 필요한 도움을 물을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 진로를 논의한다면 부모는 자기 기대와 자녀의 관심을 따로 적는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "조건 없는 돌봄과 현재 선택을 분리한다.",
    "childAvailableChoice": "관심·부담·지원 필요를 말하거나 보류할 수 있다.",
    "counterexample": "실제 성적·지원 비용·과거 압박을 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 기대 과용이 B에게 남길 부담",
    "precedingMeaningRefs": [],
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
      "condition": "돌봄을 성과의 대가로 만듦",
      "parentChecksFirst": "조건 없는 돌봄과 현재 선택을 분리한다.",
      "childExpression": "관심·부담·지원 필요를 말하거나 보류할 수 있다.",
      "adultChange": "조건 없는 돌봄과 현재 선택을 분리한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심·부담·지원 필요를 말하거나 보류할 수 있다.",
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
    "id": "pcpr:material:CH05.P3:ab-protection-removes-small-choice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
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
    "readerQuestion": "부모의 편의·기대가 자녀에게 남길 부담은 무엇인가?",
    "coreMeaning": "부모가 위험을 줄이려는 마음으로 바꿀 수 있는 선택까지 없애는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "보호 관심과 자녀 질문은 별도 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "걱정과 확인된 위험을 구별한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "부모는 꼭 지킬 안전 조건을 직접 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "위험하지 않은 방법 선택을 자녀에게 남긴다.",
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
      "direction",
      "friction"
    ],
    "positive": "필요한 보호 범위를 알아볼 기회",
    "risk": "모든 질문을 위험 감수 성향으로 평가",
    "factBomb": "아무것도 고를 수 없다면 선택을 줬다는 설명은 다시 확인해야 한다.",
    "twist": "실제 위험을 좁히면 남길 수 있는 자유가 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 방법을 논의한다면 부모는 제한한 항목과 안전 이유를 점검한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "확인된 위험에 맞게 제한 범위를 다시 본다.",
    "childAvailableChoice": "가능한 다른 방법을 제안하거나 설명을 요청할 수 있다.",
    "counterexample": "실제 위험 판단을 성격 차이로 축소하지 않는다.",
    "distinctFromOtherParagraphs": "보호와 선택권 제거의 구분",
    "precedingMeaningRefs": [],
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
      "condition": "모든 질문을 위험 감수 성향으로 평가",
      "parentChecksFirst": "확인된 위험에 맞게 제한 범위를 다시 본다.",
      "childExpression": "가능한 다른 방법을 제안하거나 설명을 요청할 수 있다.",
      "adultChange": "확인된 위험에 맞게 제한 범위를 다시 본다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "가능한 다른 방법을 제안하거나 설명을 요청할 수 있다.",
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
    "id": "pcpr:material:CH05.P3:ab-debate-overwhelms-child",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
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
    "readerQuestion": "부모의 편의·기대가 자녀에게 남길 부담은 무엇인가?",
    "coreMeaning": "부모의 토론 관심이 자녀의 설명을 이기는 대화로 바뀌는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 말로 설득하는 참고는 실제 논쟁 이력이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 정리 통로를 소극적 성격으로 고정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "대답할 시간과 다른 표현 방법을 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "부모가 이긴 결론을 자녀 동의로 간주하지 않는다.",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "direction",
      "friction"
    ],
    "positive": "논점을 함께 확인할 기회",
    "risk": "말재주로 자녀의 설명을 닫음",
    "factBomb": "대답을 못 했다는 사실이 부모의 결론에 동의했다는 뜻은 아니다.",
    "twist": "잠깐 멈춰 글로 듣는 방법이 더 정확한 답을 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 의견이 다르다면 부모는 반박 전에 자녀의 설명을 끝까지 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "속도와 방식의 권한을 점검한다.",
    "childAvailableChoice": "시간·글·다른 통로를 요청할 수 있다.",
    "counterexample": "실제 언어 능력·불안·갈등을 추론하지 않는다.",
    "distinctFromOtherParagraphs": "A의 대화 과용과 B의 발언권",
    "precedingMeaningRefs": [],
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
      "condition": "말재주로 자녀의 설명을 닫음",
      "parentChecksFirst": "속도와 방식의 권한을 점검한다.",
      "childExpression": "시간·글·다른 통로를 요청할 수 있다.",
      "adultChange": "속도와 방식의 권한을 점검한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "시간·글·다른 통로를 요청할 수 있다.",
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
    "id": "pcpr:material:CH05.P3:ab-care-asks-for-parent-comfort",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
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
    "readerQuestion": "부모의 편의·기대가 자녀에게 남길 부담은 무엇인가?",
    "coreMeaning": "부모의 가까움 기대가 자녀에게 성인 감정의 위로를 요구하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 연결 관심과 B의 배려 참고는 독립이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "자녀의 다정함은 성인 지원 자원이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "부모는 자기 반응을 조절하고 성인 지원을 찾는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "자녀가 걱정을 듣지 않겠다고 해도 존중받아야 한다.",
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
      "direction",
      "friction"
    ],
    "positive": "도움과 정서 경계를 확인할 기회",
    "risk": "자녀의 위로를 좋은 관계의 조건으로 삼음",
    "factBomb": "부모 마음을 잘 알아주는 아이도 부모의 마음을 책임질 사람은 아니다.",
    "twist": "어른끼리 도움을 구하는 선택이 자녀의 관심을 지킬 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 부모가 피로를 말한다면 자녀에게 달래달라고 요구하지 않고 성인 지원을 찾는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "자신의 감정과 지원 요청을 직접 맡는다.",
    "childAvailableChoice": "걱정을 말하거나 자기 활동으로 돌아갈 수 있다.",
    "counterexample": "실제 피로·가족 문제·위로 경험을 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "A의 정서 의존 요구를 제한",
    "precedingMeaningRefs": [],
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
      "condition": "자녀의 위로를 좋은 관계의 조건으로 삼음",
      "parentChecksFirst": "자신의 감정과 지원 요청을 직접 맡는다.",
      "childExpression": "걱정을 말하거나 자기 활동으로 돌아갈 수 있다.",
      "adultChange": "자신의 감정과 지원 요청을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "걱정을 말하거나 자기 활동으로 돌아갈 수 있다.",
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
    "id": "pcpr:material:CH05.P4:ab-return-choice-before-commitment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
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
    "readerQuestion": "부모가 먼저 수정할 권한·행동과 자녀에게 남길 선택은 무엇인가?",
    "coreMeaning": "기대에 따른 결정을 확정하기 전 자녀의 관심을 들을 부모 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "양쪽 실제 원천과 현재 결정의 범위를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "부모의 미래 계획을 자녀가 이미 선택한 것으로 보지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "지원할 조건과 자녀가 수정할 부분을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "다시 확인할 때까지 확정하지 않을 범위를 남긴다.",
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
      "direction",
      "repair"
    ],
    "positive": "자녀의 목소리가 선택에 들어갈 가능성",
    "risk": "질문만 하고 예정대로 확정",
    "factBomb": "의견을 물었다는 사실과 의견이 결정에 들어갔다는 것은 다르다.",
    "twist": "초안을 바꾸는 부모의 행동이 선택권을 보여줄 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동을 신청한다면 부모는 신청 전에 자녀의 관심과 거절을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "확정 전에 수정·보류할 자리를 실제로 남긴다.",
    "childAvailableChoice": "동의·다른 관심·보류를 선택할 수 있다.",
    "counterexample": "실제 안전상 성인 결정이 필요한 부분은 별도 판단한다.",
    "distinctFromOtherParagraphs": "A의 기대 부담에 대응하는 권한 조정",
    "precedingMeaningRefs": [],
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
      "condition": "질문만 하고 예정대로 확정",
      "parentChecksFirst": "확정 전에 수정·보류할 자리를 실제로 남긴다.",
      "childExpression": "동의·다른 관심·보류를 선택할 수 있다.",
      "adultChange": "확정 전에 수정·보류할 자리를 실제로 남긴다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "동의·다른 관심·보류를 선택할 수 있다.",
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
    "id": "pcpr:material:CH05.P4:ab-explain-protection-and-try",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
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
    "readerQuestion": "부모가 먼저 수정할 권한·행동과 자녀에게 남길 선택은 무엇인가?",
    "coreMeaning": "부모가 안전을 맡으면서 자녀에게 남길 시도 범위를 설명하는 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "실제 위험과 자녀의 질문 내용을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "부모의 불안을 사실상의 위험으로 대체하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "보호할 결과와 바꿀 수 있는 방법을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "지원·중단 신호·재검토를 부모가 마련한다.",
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
      "direction",
      "repair"
    ],
    "positive": "보호 안에서 작은 선택을 시험할 가능성",
    "risk": "자녀가 괜찮다고 하면 보호를 철회",
    "factBomb": "직접 해본다는 말에도 도울 준비는 어른에게 남는다.",
    "twist": "안전 기준이 분명하면 부모가 대신할 필요가 없는 부분도 보인다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새 활동을 시험한다면 부모는 지원과 중단 방법을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "제한 이유·선택·지원 통로를 설명한다.",
    "childAvailableChoice": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
    "counterexample": "실제 전문 위험 판단을 유형이나 동의만으로 대신하지 않는다.",
    "distinctFromOtherParagraphs": "A의 보호 과용을 줄이는 실제 범위",
    "precedingMeaningRefs": [],
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
      "condition": "자녀가 괜찮다고 하면 보호를 철회",
      "parentChecksFirst": "제한 이유·선택·지원 통로를 설명한다.",
      "childExpression": "방법을 고르거나 멈추고 도움을 요청할 수 있다.",
      "adultChange": "제한 이유·선택·지원 통로를 설명한다.",
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
    "id": "pcpr:material:CH05.P4:ab-listen-before-answer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
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
    "readerQuestion": "부모가 먼저 수정할 권한·행동과 자녀에게 남길 선택은 무엇인가?",
    "coreMeaning": "부모의 빠른 반박을 멈추고 자녀의 설명을 확인할 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A/B 원천과 표현 방식의 실제 적합성을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "부모는 자녀의 주장을 요약해 뜻이 맞는지 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "답할 시간과 다른 전달 통로를 선택하게 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "무슨 결정을 언제 다시 볼지 부모가 확인한다.",
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
      "direction",
      "repair"
    ],
    "positive": "설명을 알아들은 뒤 답할 가능성",
    "risk": "요약을 다시 반박하기 위한 절차로 사용",
    "factBomb": "잘 들었다고 말하려면 내 결론보다 자녀가 한 말을 먼저 확인해야 한다.",
    "twist": "즉시 답하지 않는 것이 설명을 무시하는 뜻만은 아니다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 의견이 다르다면 부모는 들은 뜻을 되짚고 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반박 전 수신 내용을 확인한다.",
    "childAvailableChoice": "요약을 고치거나 나중에 글로 전할 수 있다.",
    "counterexample": "대화가 안전하지 않다면 직접 설득을 강요하지 않는다.",
    "distinctFromOtherParagraphs": "A 대화 속도 조정의 구체적 행동",
    "precedingMeaningRefs": [],
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
      "condition": "요약을 다시 반박하기 위한 절차로 사용",
      "parentChecksFirst": "반박 전 수신 내용을 확인한다.",
      "childExpression": "요약을 고치거나 나중에 글로 전할 수 있다.",
      "adultChange": "반박 전 수신 내용을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "요약을 고치거나 나중에 글로 전할 수 있다.",
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
    "id": "pcpr:material:CH05.P4:ab-parent-support-outside-child",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
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
    "readerQuestion": "부모가 먼저 수정할 권한·행동과 자녀에게 남길 선택은 무엇인가?",
    "coreMeaning": "부모의 감정 조절과 지원을 자녀 밖에서 마련할 조정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "원천은 부모의 현재 정서나 피해 사실을 검증하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "부모는 반응을 멈추되 필요한 안전 돌봄은 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "잘못한 말은 자녀의 반응을 조건으로 하지 않고 인정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "도움이 더 필요하면 적절한 성인 지원을 찾는다.",
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
      "direction",
      "repair"
    ],
    "positive": "자녀가 부모의 기분을 관리하지 않을 여지",
    "risk": "사과 뒤 자녀에게 위로나 용서를 요구",
    "factBomb": "미안하다는 말이 부모를 괜찮다고 해줄 다음 일을 아이에게 주어서는 안 된다.",
    "twist": "어른이 스스로 수정하는 모습이 도움을 요청할 통로를 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 부모가 거칠게 반응했다면 안전을 유지하며 멈추고 바꿀 행동을 말한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반응 조절·사과·성인 지원을 직접 맡는다.",
    "childAvailableChoice": "사과에 즉시 답하거나 용서할 의무 없이 자신의 필요를 말할 수 있다.",
    "counterexample": "폭력·강압은 사과 한 번의 성격 조율 문제로 축소하지 않는다.",
    "distinctFromOtherParagraphs": "부모 지원 책임을 유지하는 A 조정",
    "precedingMeaningRefs": [],
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
      "condition": "사과 뒤 자녀에게 위로나 용서를 요구",
      "parentChecksFirst": "반응 조절·사과·성인 지원을 직접 맡는다.",
      "childExpression": "사과에 즉시 답하거나 용서할 의무 없이 자신의 필요를 말할 수 있다.",
      "adultChange": "반응 조절·사과·성인 지원을 직접 맡는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "사과에 즉시 답하거나 용서할 의무 없이 자신의 필요를 말할 수 있다.",
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
