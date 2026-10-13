/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH09_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH09.P1:recall-curiosity-with-choice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 도입된 긍정 원천을 어떤 지원·선택 조건과 회수하는가?",
    "coreMeaning": "앞서 도입된 함께 알아볼 가능성을 자녀의 선택과 함께 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "같은 A/B 실제 원천과 표시 의미가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "같은 유형이 같은 관심을 보장하지 않았음을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "부모의 지원과 자녀의 변경 선택을 함께 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "새 성공·감정·사건 없이 가능성으로 닫는다.",
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
        "sourceKey": "67f918c8959cf547910b",
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
      "recall",
      "positive"
    ],
    "positive": "관심을 함께 확인할 가능성",
    "risk": "공통 유형을 행복 보장으로 확대",
    "factBomb": "함께 좋아할 것이라는 기대에도 다른 답은 남아 있어야 한다.",
    "twist": "닮은 점을 증명하지 않아도 새로운 관심을 들을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 활동 장면에서 자녀가 고른 주제와 지원 범위를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "실제 표시된 조건을 유지한다.",
    "childAvailableChoice": "참여·변경·중단을 고를 수 있다.",
    "counterexample": "앞서 표시되지 않았거나 타입·역할이 다르면 보류한다.",
    "distinctFromOtherParagraphs": "CH04 공통 관심의 조건 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P1:shared-curiosity-with-no-performance"
    ],
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
          "type": "ENFP",
          "sourceKey": "67f918c8959cf547910b",
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
      "condition": "공통 유형을 행복 보장으로 확대",
      "parentChecksFirst": "실제 표시된 조건을 유지한다.",
      "childExpression": "참여·변경·중단을 고를 수 있다.",
      "adultChange": "실제 표시된 조건을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "참여·변경·중단을 고를 수 있다.",
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
    "id": "pcpr:material:CH09.P1:recall-opportunity-with-voice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 도입된 긍정 원천을 어떤 지원·선택 조건과 회수하는가?",
    "coreMeaning": "앞서 도입된 활동 지원을 보호 책임과 자녀의 목적을 남기는 조건으로 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "같은 사람·원천·단계 조건이 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "기회를 제공한 사실이나 실제 성과를 새로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "성인 지원과 자녀의 참여 선택을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "지원의 가능성을 결과 보장으로 바꾸지 않는다.",
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "recall",
      "positive"
    ],
    "positive": "지원과 자녀 목적을 함께 남길 가능성",
    "risk": "기회를 받았으니 성공할 의무를 추가",
    "factBomb": "지원의 수고가 아이의 결과를 소유할 권리는 아니다.",
    "twist": "시도를 줄이거나 바꾸어도 배움의 질문은 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 활동의 실제 지원·선택 범위를 다시 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "같은 의미와 보호 조건을 회수한다.",
    "childAvailableChoice": "참여·거절·수정을 선택할 수 있다.",
    "counterexample": "도입 원천이나 실제 조건이 없으면 보류한다.",
    "distinctFromOtherParagraphs": "CH04 다른 방식의 긍정 가능성 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P1:opportunity-with-child-voice"
    ],
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
      "condition": "기회를 받았으니 성공할 의무를 추가",
      "parentChecksFirst": "같은 의미와 보호 조건을 회수한다.",
      "childExpression": "참여·거절·수정을 선택할 수 있다.",
      "adultChange": "같은 의미와 보호 조건을 회수한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "참여·거절·수정을 선택할 수 있다.",
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
    "id": "pcpr:material:CH09.P1:recall-learning-with-mistake-space",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 도입된 긍정 원천을 어떤 지원·선택 조건과 회수하는가?",
    "coreMeaning": "앞서 도입된 자료 지원과 모른다고 말할 자리를 함께 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "같은 부모·자녀의 실제 원천과 도입 의미를 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "성실함 참고를 실제 성취로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "부모는 필요한 도움을 확인하고 자녀의 질문을 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "새 학업 결과나 능력 평가를 추가하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "7cad2339fed7bcabefd7",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "a147b57a7d16ec148fec",
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
        "id": "sar:facet:PRECISION:standard-consistency",
        "axis": "PRECISION",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "condition": "같은 기준을 적용해도 되는 조건 확인",
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
      "recall",
      "positive"
    ],
    "positive": "필요한 지원을 구체화할 가능성",
    "risk": "좋은 자녀니 혼자 잘할 것이라 결론",
    "factBomb": "꾸준해 보인다는 말에도 모르는 것을 물을 자리는 남아 있어야 한다.",
    "twist": "도움을 요청하는 선택도 스스로 배우는 과정일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 학습 질문과 필요한 자료를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "실수·지원 조건을 유지한다.",
    "childAvailableChoice": "모름·추가 설명·휴식을 말할 수 있다.",
    "counterexample": "실제 도입되지 않은 학습 강점을 붙이지 않는다.",
    "distinctFromOtherParagraphs": "CH04 자료 지원의 긍정 조건 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P1:knowledge-support-without-perfect-child"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "7cad2339fed7bcabefd7",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "a147b57a7d16ec148fec",
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
      "condition": "좋은 자녀니 혼자 잘할 것이라 결론",
      "parentChecksFirst": "실수·지원 조건을 유지한다.",
      "childExpression": "모름·추가 설명·휴식을 말할 수 있다.",
      "adultChange": "실수·지원 조건을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "모름·추가 설명·휴식을 말할 수 있다.",
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
    "id": "pcpr:material:CH09.P2:recall-harmony-needs-support",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "UNKNOWN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "관계·개인 결합·표현 강점의 원래 출처를 어떻게 유지하는가?",
    "coreMeaning": "앞서 도입된 실제 반합을 지원과 선택의 조건과 함께 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "같은 실제 관계 ID·참여자·기둥과 도입 의미가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "전통 이견과 실제 관계 질의 비동일성을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "부모의 보호와 자녀 선택은 별도 확인 조건이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "새 관계·점수·운명적 가족을 추가하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "69aac2d24f114cdd40fb",
        "sourceUse": "actual_canonical_membership_required",
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
      "recall",
      "positive",
      "canonical"
    ],
    "positive": "연결을 실제 지원 질문으로 쓸 가능성",
    "risk": "합을 좋은 부모·자녀의 보장으로 확대",
    "factBomb": "좋은 연결을 말해도 의견을 들었는지는 따로 확인해야 한다.",
    "twist": "상징은 실제 행동을 점검할 질문으로 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 도움 장면의 선택과 지원 조건을 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "같은 출처와 비단정 조건을 회수한다.",
    "childAvailableChoice": "도움 범위를 말하거나 다른 지원을 고를 수 있다.",
    "counterexample": "실제 반합 또는 선행 표시가 없으면 보류한다.",
    "distinctFromOtherParagraphs": "CH04 명리 긍정의 출처를 그대로 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P4:harmony-needs-child-consent"
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
      "condition": "합을 좋은 부모·자녀의 보장으로 확대",
      "parentChecksFirst": "같은 출처와 비단정 조건을 회수한다.",
      "childExpression": "도움 범위를 말하거나 다른 지원을 고를 수 있다.",
      "adultChange": "같은 출처와 비단정 조건을 회수한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "도움 범위를 말하거나 다른 지원을 고를 수 있다.",
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
    "id": "pcpr:material:CH09.P2:recall-care-without-role-transfer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "mode": "RECALL",
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
    "readerQuestion": "관계·개인 결합·표현 강점의 원래 출처를 어떻게 유지하는가?",
    "coreMeaning": "앞서 도입된 배려 가능성을 성인의 책임을 남기는 조건으로 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "같은 A 개인 Fusion 두 root와 B 원천·실제 표시 의미가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "개인 Fusion을 공동 점수로 합치지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "자녀가 부모 감정을 맡지 않는 경계를 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "새 희생·가족 갈등·심리 효과를 추가하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "31fe578398dda7ed2b7e",
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
        "owner": "A",
        "sourceKey": "73f1ae9fb0a7c110106b",
        "sourceUse": "both_same_person_roots_required",
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "recall",
      "positive",
      "fusion"
    ],
    "positive": "관심과 정확한 책임을 함께 남길 가능성",
    "risk": "다정한 자녀가 가족을 유지한다고 결론",
    "factBomb": "잘 챙긴다는 칭찬이 아이에게 가족의 감정을 맡기는 말이 되어서는 안 된다.",
    "twist": "성인 지원이 마련돼야 자녀의 관심도 선택으로 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 성인 지원 장면의 책임 경계를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "부모 지원과 개인 root 조건을 유지한다.",
    "childAvailableChoice": "관심을 표현하거나 멈출 수 있다.",
    "counterexample": "원래 Fusion context·root·표시 의미가 없으면 보류한다.",
    "distinctFromOtherParagraphs": "CH04 개인 결합의 강점과 책임 경계 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P4:care-is-not-fixed-family-role"
    ],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISFJ",
          "sourceKey": "31fe578398dda7ed2b7e",
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
      "condition": "다정한 자녀가 가족을 유지한다고 결론",
      "parentChecksFirst": "부모 지원과 개인 root 조건을 유지한다.",
      "childExpression": "관심을 표현하거나 멈출 수 있다.",
      "adultChange": "부모 지원과 개인 root 조건을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심을 표현하거나 멈출 수 있다.",
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
    "id": "pcpr:material:CH09.P2:recall-many-routes-to-trust",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "관계·개인 결합·표현 강점의 원래 출처를 어떻게 유지하는가?",
    "coreMeaning": "앞서 도입된 여러 표현 통로의 가능성을 실제 수신 조건과 함께 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "같은 사람·유형·단계·도입 의미가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "다른 속도를 실제 애정이나 능력으로 평가하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "부모의 수신과 자녀의 표현 선택을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "새 신뢰의 사실이나 사건을 붙이지 않는다.",
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
      "recall",
      "positive",
      "trust"
    ],
    "positive": "다른 방식으로도 설명이 도착할 가능성",
    "risk": "많이 말해야 신뢰한다는 결론",
    "factBomb": "말할 통로가 있다는 설명에도 실제 들어줄 반응이 필요하다.",
    "twist": "적게 말해도 중요한 내용은 도착할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 글·말 통로에서 확인했던 수신 범위를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "실제 도입된 통로와 선택을 회수한다.",
    "childAvailableChoice": "말·글·보류를 고를 수 있다.",
    "counterexample": "앞선 통로가 표시되지 않았으면 마지막에 새 특성을 만들지 않는다.",
    "distinctFromOtherParagraphs": "CH04 표현 차이의 긍정 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P2:quiet-and-spoken-routes"
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
      "condition": "많이 말해야 신뢰한다는 결론",
      "parentChecksFirst": "실제 도입된 통로와 선택을 회수한다.",
      "childExpression": "말·글·보류를 고를 수 있다.",
      "adultChange": "실제 도입된 통로와 선택을 회수한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말·글·보류를 고를 수 있다.",
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
    "id": "pcpr:material:CH09.P3:recall-expectation-repair",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 부담과 부모 조정에서 이어갈 실천은 무엇인가?",
    "coreMeaning": "앞선 기대 부담과 부모의 확정 전 선택권 조정을 일관되게 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "동일한 A→B 부담과 A 조정이 실제 표시돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "부모의 바람과 자녀 선택을 나눴던 이유를 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "지원은 결과의 대가가 아니라는 조건을 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "실제 갈등 해결이나 성과를 새로 단정하지 않는다.",
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
      "recall",
      "repair"
    ],
    "positive": "관심이 결정에 들어갈 가능성",
    "risk": "부담을 말했으니 관계가 회복됐다고 서술",
    "factBomb": "의견을 물은 것과 선택을 실제 돌려준 것은 다른 단계다.",
    "twist": "부모가 초안을 바꾸는 행동이 지원의 방향을 보여줄 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 활동 신청의 수정·보류 범위를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기대와 지원을 분리했던 행동을 유지한다.",
    "childAvailableChoice": "다른 관심·거절·보류를 고를 수 있다.",
    "counterexample": "두 의미 중 하나가 없거나 방향·조건이 다르면 보류한다.",
    "distinctFromOtherParagraphs": "CH05 부담→CH08 부모 행동 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH05.P3:ab-expectation-becomes-result-debt",
      "pcpr:material:CH08.P2:a-change-expectation-before-enrollment"
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
      "condition": "부담을 말했으니 관계가 회복됐다고 서술",
      "parentChecksFirst": "기대와 지원을 분리했던 행동을 유지한다.",
      "childExpression": "다른 관심·거절·보류를 고를 수 있다.",
      "adultChange": "기대와 지원을 분리했던 행동을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "다른 관심·거절·보류를 고를 수 있다.",
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
    "id": "pcpr:material:CH09.P3:recall-protection-repair",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 부담과 부모 조정에서 이어갈 실천은 무엇인가?",
    "coreMeaning": "앞선 정답 질문의 반복과 실제 위험·선택을 나눈 조정을 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "같은 사람·원천·보호 조건으로 실제 표시돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "부모가 위험을 확인할 책임을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "자녀의 작은 방법 선택과 중단·지원 통로를 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "새 위험·허용 판단을 추가하지 않는다.",
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
      "recall",
      "repair"
    ],
    "positive": "보호와 선택을 함께 확인할 가능성",
    "risk": "자녀가 스스로 안전을 책임지게 함",
    "factBomb": "스스로 골랐다는 말에도 도울 어른의 책임은 남는다.",
    "twist": "위험을 좁혀 설명하면 남길 선택도 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 활동의 안전·지원·재검토를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "실제 보호 기준과 선택 범위를 유지한다.",
    "childAvailableChoice": "방법·중단·도움을 선택할 수 있다.",
    "counterexample": "앞선 위험 조건과 조정이 미도입이면 보류한다.",
    "distinctFromOtherParagraphs": "CH07 반복→CH08 보호 조정 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:protection-question-test-loop",
      "pcpr:material:CH08.P1:repair-protection-test"
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
      "condition": "자녀가 스스로 안전을 책임지게 함",
      "parentChecksFirst": "실제 보호 기준과 선택 범위를 유지한다.",
      "childExpression": "방법·중단·도움을 선택할 수 있다.",
      "adultChange": "실제 보호 기준과 선택 범위를 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "방법·중단·도움을 선택할 수 있다.",
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
    "id": "pcpr:material:CH09.P3:recall-parent-regulation-repair",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "TEEN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "앞선 부담과 부모 조정에서 이어갈 실천은 무엇인가?",
    "coreMeaning": "앞선 정서 책임 전가 조건과 부모가 성인 지원을 찾는 조정을 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "같은 사람·조건의 두 의미가 실제 표시돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "자녀의 위로·용서를 회복의 조건으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "부모의 반응·안전 돌봄·지원 책임을 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "실제 사과·과거 피해·해결 사실을 만들지 않는다.",
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
      "recall",
      "repair"
    ],
    "positive": "자녀의 정서 부담을 줄일 가능성",
    "risk": "자녀가 화해를 완성해야 한다고 결론",
    "factBomb": "미안하다는 말 뒤에도 어른이 바꿀 행동은 어른에게 남는다.",
    "twist": "지원받는 부모의 행동이 책임을 더 정확히 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 반응 조절 장면의 수정할 행동과 지원을 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "사과와 성인 지원의 경계를 유지한다.",
    "childAvailableChoice": "즉시 답하지 않거나 도움을 요청할 수 있다.",
    "counterexample": "위험한 행동을 대화·사과만으로 해결했다고 쓰지 않는다.",
    "distinctFromOtherParagraphs": "CH07 정서 고리→CH08 성인 책임 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH07.P3:child-comfort-parent-loop",
      "pcpr:material:CH08.P1:repair-parent-emotional-responsibility"
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
      "condition": "자녀가 화해를 완성해야 한다고 결론",
      "parentChecksFirst": "사과와 성인 지원의 경계를 유지한다.",
      "childExpression": "즉시 답하지 않거나 도움을 요청할 수 있다.",
      "adultChange": "사과와 성인 지원의 경계를 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "즉시 답하지 않거나 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH09.P4:recall-young-support-and-small-choice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "YOUNG"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 소개된 단계·지원·경계만으로 어떤 지속 방향을 남기는가?",
    "coreMeaning": "앞선 반응적 지원과 구체적인 규칙·작은 선택을 마지막 방향으로 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "같은 실제 단계·상황에서 두 의미가 표시돼야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "부모의 관찰과 안전 책임을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "자녀의 신호·방법·중단 선택을 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "발달 향상이나 능력 결과를 예언하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "e5ebcee2b4f04948ce2b",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "b1ef5ca26a18193d1227",
        "sourceUse": "context_guidance_not_person_fact",
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
      "recall",
      "positive",
      "development"
    ],
    "positive": "지원 안에서 직접 해볼 가능성",
    "risk": "자녀가 부모의 설명을 완성해야 한다고 요구",
    "factBomb": "어린 자녀의 작은 반응에도 어른이 확인할 책임은 남는다.",
    "twist": "완성품이 없어도 함께 알아본 질문은 남을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 활동의 지원과 작은 선택을 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "관찰·설명·안전 지원을 유지한다.",
    "childAvailableChoice": "고르거나 멈추고 도움을 요청할 수 있다.",
    "counterexample": "단계·지원이 미확인이면 구체 적용을 보류한다.",
    "distinctFromOtherParagraphs": "CH04 관심→CH08 어린 자녀 회복의 긍정 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P3:young-signal-and-response",
      "pcpr:material:CH08.P4:young-rule-repair-with-model"
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
      "condition": "자녀가 부모의 설명을 완성해야 한다고 요구",
      "parentChecksFirst": "관찰·설명·안전 지원을 유지한다.",
      "childExpression": "고르거나 멈추고 도움을 요청할 수 있다.",
      "adultChange": "관찰·설명·안전 지원을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "고르거나 멈추고 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH09.P4:recall-adult-support-and-boundary",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "ADULT"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 소개된 단계·지원·경계만으로 어떤 지속 방향을 남기는가?",
    "coreMeaning": "앞선 성인 자녀의 지원 선택과 연락·정보 경계를 마지막 방향으로 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "같은 성인 대학 맥락과 실제 도입 의미가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "부모의 조언과 본인의 결정을 구분한 조건을 유지한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "연락·방문·정보 공유의 현재 동의를 잇는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "새 독립 능력·생활 사실을 추가하지 않는다.",
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
      "recall",
      "positive",
      "adultChild"
    ],
    "positive": "연결과 독립을 함께 남길 가능성",
    "risk": "가족이라 모든 경계를 없애도 된다고 결론",
    "factBomb": "지원의 기억이 현재 동의를 대신하지는 않는다.",
    "twist": "작은 연결과 필요한 도움만으로도 관계를 이어갈 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 대학 지원·방문 범위를 다시 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "동의한 지원과 경계를 유지한다.",
    "childAvailableChoice": "조언·방문·연락을 고를 수 있다.",
    "counterexample": "성인 전체로 일반화하거나 미성년 맥락에 쓰지 않는다.",
    "distinctFromOtherParagraphs": "CH04 성인 지원→CH08 동의 경계 회수",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P3:adult-resource-with-consent",
      "pcpr:material:CH08.P4:adult-consent-and-contact-review"
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
      "condition": "가족이라 모든 경계를 없애도 된다고 결론",
      "parentChecksFirst": "동의한 지원과 경계를 유지한다.",
      "childExpression": "조언·방문·연락을 고를 수 있다.",
      "adultChange": "동의한 지원과 경계를 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "조언·방문·연락을 고를 수 있다.",
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
    "id": "pcpr:material:CH09.P4:recall-role-changes-with-context",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "mode": "RECALL",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "ADULT"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 소개된 단계·지원·경계만으로 어떤 지속 방향을 남기는가?",
    "coreMeaning": "앞선 역할 변화와 현재 동의의 재검토를 지속 방향으로 회수한다.",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "실제 성인 맥락으로 호환되는 선행 의미만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "생년월일만으로 발달·지원 필요를 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "과거의 보호 방식과 현재 결정권을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "새 가족 사건·미래 관계 결과를 붙이지 않는다.",
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "recall",
      "positive",
      "development"
    ],
    "positive": "현재에 맞는 연결을 다시 고를 가능성",
    "risk": "성인 자녀를 영구적인 지시 대상으로 결론",
    "factBomb": "오래된 관계에도 지금의 선택을 다시 묻는 일은 필요할 수 있다.",
    "twist": "지원 방식이 달라져도 관심이 사라지는 것은 아닐 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "앞선 가상 생활 변화의 지원·경계를 다시 본다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "상황·동의·재검토 조건을 유지한다.",
    "childAvailableChoice": "현재 필요한 도움과 경계를 말할 수 있다.",
    "counterexample": "실제 도입 의미나 성인 맥락이 없으면 보류한다.",
    "distinctFromOtherParagraphs": "CH04 변화 가능성→CH08 현재 동의로 마무리",
    "precedingMeaningRefs": [
      "pcpr:material:CH04.P4:change-rules-with-development",
      "pcpr:material:CH08.P4:adult-consent-and-contact-review"
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
      "condition": "성인 자녀를 영구적인 지시 대상으로 결론",
      "parentChecksFirst": "상황·동의·재검토 조건을 유지한다.",
      "childExpression": "현재 필요한 도움과 경계를 말할 수 있다.",
      "adultChange": "상황·동의·재검토 조건을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "현재 필요한 도움과 경계를 말할 수 있다.",
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
