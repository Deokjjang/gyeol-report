/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH07_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH07.P1:expectation-and-interest-differ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
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
    "readerQuestion": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "coreMeaning": "부모가 바라는 안정과 자녀의 현재 관심이 다른 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "양쪽 원천은 실제 진로의 확인이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "부모의 걱정과 자녀의 관심을 다른 질문으로 둔다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "지원 범위와 바꿀 수 있는 활동을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "불일치를 성실함·감사의 부족으로 번역하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "d34d165d4966692ca6cb",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "6fa914122dba7be984fd",
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "friction",
      "learning"
    ],
    "positive": "목적과 지원을 다시 확인할 여지",
    "risk": "같은 미래를 원해야 좋은 자녀라고 평가",
    "factBomb": "부모의 계획과 다르다는 사실만으로 자녀의 계획이 없는 것은 아니다.",
    "twist": "작은 탐색으로 차이가 실제 무엇인지 알아볼 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 선택이 다르다면 부모는 관심과 걱정을 따로 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "현재 목적과 실제 지원을 확인한다.",
    "childAvailableChoice": "다른 관심·보류·도움 필요를 말할 수 있다.",
    "counterexample": "실제 성적·진로·경제 조건을 만들지 않는다.",
    "distinctFromOtherParagraphs": "차이의 발생 조건이며 과거 다툼 아님",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "d34d165d4966692ca6cb",
          "domain": "PARENTS"
        },
        {
          "owner": "B",
          "type": "ENFP",
          "sourceKey": "6fa914122dba7be984fd",
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
      "condition": "같은 미래를 원해야 좋은 자녀라고 평가",
      "parentChecksFirst": "현재 목적과 실제 지원을 확인한다.",
      "childExpression": "다른 관심·보류·도움 필요를 말할 수 있다.",
      "adultChange": "현재 목적과 실제 지원을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "다른 관심·보류·도움 필요를 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P1:privacy-and-safety-are-different",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
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
    "readerQuestion": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "coreMeaning": "안전 확인과 자녀의 사적 정보 공개를 구분해야 할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "A의 보호 관심과 B의 응답 참고는 별개다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "부모는 필요한 정보의 목적을 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "사생활 전체를 확인해야 안전하다고 단정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "실제 위험 정보가 있으면 적절한 보호 판단이 필요하다.",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
      "friction",
      "privacy"
    ],
    "positive": "확인 범위를 좁힐 가능성",
    "risk": "감시를 관심으로 정당화",
    "factBomb": "걱정된다는 마음만으로 모든 비밀을 알아야 할 권한이 생기지는 않는다.",
    "twist": "정보를 덜 요구해도 필요한 안전 확인은 가능할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 연락 범위를 정한다면 부모는 안전 목적과 필요한 정보만 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "목적·범위·지원 통로를 점검한다.",
    "childAvailableChoice": "어려운 공개 범위를 말하거나 안전한 지원자를 고를 수 있다.",
    "counterexample": "구체적인 보호 판단을 유형·일반 사생활 지침으로 대신하지 않는다.",
    "distinctFromOtherParagraphs": "사생활과 실제 보호의 경계",
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
      "condition": "감시를 관심으로 정당화",
      "parentChecksFirst": "목적·범위·지원 통로를 점검한다.",
      "childExpression": "어려운 공개 범위를 말하거나 안전한 지원자를 고를 수 있다.",
      "adultChange": "목적·범위·지원 통로를 점검한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "어려운 공개 범위를 말하거나 안전한 지원자를 고를 수 있다.",
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
    "id": "pcpr:material:CH07.P1:device-rule-needs-reason",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
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
    "readerQuestion": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "coreMeaning": "디지털 기기 약속에서 안전 목적·생활 필요·선택 범위를 나눌 질문을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "실제 사용량·위험·학교 요구는 미입력이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "부모의 불편과 확인된 위험을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "시간 수치를 유형으로 처방하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "자녀의 의견과 필요한 성인 보호를 함께 확인한다.",
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
      "friction",
      "digital"
    ],
    "positive": "규칙의 목적을 알아볼 가능성",
    "risk": "질문을 기기 중독이나 불순종으로 진단",
    "factBomb": "기기를 싫어한다는 부모의 마음과 실제 위험은 같은 근거가 아니다.",
    "twist": "목적을 좁히면 바꾸어도 되는 사용 방식이 보일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 기기 사용을 논의한다면 부모는 실제 필요한 사용과 걱정할 조건을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "목적·대안·재검토를 마련한다.",
    "childAvailableChoice": "현재 필요한 사용과 불편한 규칙을 말할 수 있다.",
    "counterexample": "중독·질환·학업 문제·위험 행동을 입력 없이 판정하지 않는다.",
    "distinctFromOtherParagraphs": "유형 없는 디지털 규칙의 조건부 질문",
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
      "condition": "질문을 기기 중독이나 불순종으로 진단",
      "parentChecksFirst": "목적·대안·재검토를 마련한다.",
      "childExpression": "현재 필요한 사용과 불편한 규칙을 말할 수 있다.",
      "adultChange": "목적·대안·재검토를 마련한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "현재 필요한 사용과 불편한 규칙을 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P1:adult-contact-is-not-permission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
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
    "readerQuestion": "기대·사생활·기기·성인 연락에서 무엇이 다른 질문인가?",
    "coreMeaning": "성인 자녀의 연락·방문 경계와 부모의 관계 기대가 다를 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "실제 성인 대학 맥락·당사자 동의를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "부모의 서운함은 자녀가 즉시 해결할 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "연락의 목적·가능한 통로·개인 결정을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "지원을 이유로 방문이나 정보 공개를 강요하지 않는다.",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
      "friction",
      "adultChild"
    ],
    "positive": "현재 가능한 연결을 찾을 여지",
    "risk": "답이 늦다는 이유로 독립 결정을 제한",
    "factBomb": "가족이라는 말이 상대의 시간을 언제든 써도 된다는 허락은 아니다.",
    "twist": "동의한 작은 연결이 요구만 늘리는 연락보다 지속 가능할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 방문을 논의한다면 부모는 날짜와 범위를 미리 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기대와 실제 동의를 분리한다.",
    "childAvailableChoice": "거절·다른 날짜·정보 경계를 선택할 수 있다.",
    "counterexample": "성인 전체의 가족 의무나 법률 판단으로 일반화하지 않는다.",
    "distinctFromOtherParagraphs": "성인 자녀의 경계 차이",
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
      "condition": "답이 늦다는 이유로 독립 결정을 제한",
      "parentChecksFirst": "기대와 실제 동의를 분리한다.",
      "childExpression": "거절·다른 날짜·정보 경계를 선택할 수 있다.",
      "adultChange": "기대와 실제 동의를 분리한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "거절·다른 날짜·정보 경계를 선택할 수 있다.",
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
    "id": "pcpr:material:CH07.P2:clash-without-family-blame",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
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
    "readerQuestion": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "coreMeaning": "실제 子午 충과 대화의 어려움을 인과로 확정하지 않는 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "현재 실제 cross-person refs·kind·ID를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "전통 대향 구조는 불행이나 자녀의 반항을 증명하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "실제 질문과 부모 반응은 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "관계 하나로 가족 전체를 판정하지 않는다.",
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
      "friction",
      "canonical"
    ],
    "positive": "갈등 질문의 출처를 구분할 가능성",
    "risk": "충 때문에 갈등이 필연적이라고 판단",
    "factBomb": "충을 설명하는 말이 부모의 반응을 돌아볼 책임을 없애지는 않는다.",
    "twist": "출처를 구분하면 고칠 수 있는 실제 행동을 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 규칙에 이견이 있다면 부모는 관계 명칭 대신 발언과 지원 조건을 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "계산 사실과 행동의 선택을 분리한다.",
    "childAvailableChoice": "다른 의견과 지원 필요를 표현할 수 있다.",
    "counterexample": "실제 충이 없으면 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "명리 분류와 갈등 원인 분리",
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
      "condition": "충 때문에 갈등이 필연적이라고 판단",
      "parentChecksFirst": "계산 사실과 행동의 선택을 분리한다.",
      "childExpression": "다른 의견과 지원 필요를 표현할 수 있다.",
      "adultChange": "계산 사실과 행동의 선택을 분리한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "다른 의견과 지원 필요를 표현할 수 있다.",
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
    "id": "pcpr:material:CH07.P2:harm-not-wonjin-child",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "UNKNOWN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "coreMeaning": "같은 글자의 해와 미지원 원진을 구분하고 자녀의 성격 판정으로 옮기지 않는다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "해의 실제 관계 ID와 refs가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "원진 정의는 현재 교차 producer의 검출 결과가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "종류·출처·지원 여부를 따로 기록한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "근거 부족을 심리적 불화로 채우지 않는다.",
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
      "friction",
      "canonical"
    ],
    "positive": "지원 범위를 정확히 알 가능성",
    "risk": "해를 원진으로 바꿔 가족 불행을 설명",
    "factBomb": "같은 글자가 적혔다고 서로 다른 관계 이름을 바꾸어 쓸 수는 없다.",
    "twist": "모르는 관계를 남겨두어도 실제 도움 질문은 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 관계를 설명한다면 부모·자녀의 실제 필요는 별도 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "검출과 연구 정의를 구분한다.",
    "childAvailableChoice": "관계 명칭을 자기 문제로 받아들일 의무 없이 질문할 수 있다.",
    "counterexample": "미지원 원진의 참여자·영향을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "미지원 관계의 비적용",
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
      "condition": "해를 원진으로 바꿔 가족 불행을 설명",
      "parentChecksFirst": "검출과 연구 정의를 구분한다.",
      "childExpression": "관계 명칭을 자기 문제로 받아들일 의무 없이 질문할 수 있다.",
      "adultChange": "검출과 연구 정의를 구분한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관계 명칭을 자기 문제로 받아들일 의무 없이 질문할 수 있다.",
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
    "id": "pcpr:material:CH07.P2:no-relation-is-not-missing-bond",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "roleVersion": "compatibility-fixed-ab-v1",
    "roles": {
      "personA": "부모",
      "personB": "자녀"
    },
    "developmentalContexts": [
      "UNKNOWN"
    ],
    "developmentNotAssessed": true,
    "readerQuestion": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "coreMeaning": "교차 관계가 없을 때 가족의 연결 부족을 만들어내지 않는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "관계 미검출은 검사 범위 안의 결과일 뿐이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "지원되지 않은 관계나 미상 시주를 보충하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "양쪽 개인 원천과 실제 관계 경험은 별도다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "부모의 보호 책임은 관계 검출로 결정되지 않는다.",
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
      "friction",
      "canonical"
    ],
    "positive": "없는 근거를 정확히 남길 가능성",
    "risk": "관계가 없으니 애착이나 이해가 부족하다고 평가",
    "factBomb": "사주 관계가 안 나왔다는 사실이 실제로 서로를 모른다는 답은 아니다.",
    "twist": "검출하지 못한 설명 대신 현재 필요한 지원을 물을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 어려움을 논의한다면 부모는 관계 명칭 없이 지금의 필요를 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "근거의 부재를 관계의 결함으로 읽지 않는다.",
    "childAvailableChoice": "필요한 도움이나 다른 의견을 말할 수 있다.",
    "counterexample": "애착·정서·가족 질을 계산 부재로 진단하지 않는다.",
    "distinctFromOtherParagraphs": "관계 미검출의 안전한 처리",
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
      "condition": "관계가 없으니 애착이나 이해가 부족하다고 평가",
      "parentChecksFirst": "근거의 부재를 관계의 결함으로 읽지 않는다.",
      "childExpression": "필요한 도움이나 다른 의견을 말할 수 있다.",
      "adultChange": "근거의 부재를 관계의 결함으로 읽지 않는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "필요한 도움이나 다른 의견을 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P2:harmony-and-disagreement-coexist",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
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
    "readerQuestion": "실제 명리 관계를 가족 갈등의 원인으로 만들지 않으려면 무엇이 필요한가?",
    "coreMeaning": "합과 충이 실제로 함께 있어도 다른 대상의 조건을 구분해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "두 관계 각각 실제 참여 기둥과 ID를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "좋은 합이 충을 지우거나 충이 합을 무효화한다고 계산하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "실제 생활의 동의·지원은 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "명리 관계를 점수 재계산이나 교육 성과로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "84d1ddc4aa078aa8fa5f",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "SHARED",
        "sourceKey": "21a2cc4649da9423a26d",
        "sourceUse": "actual_canonical_membership_required",
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
      "friction",
      "canonical"
    ],
    "positive": "출처를 분리한 복합 질문",
    "risk": "좋고 나쁨 하나로 가족을 평가",
    "factBomb": "좋은 관계 하나가 어려운 행동을 정당화하지는 않는다.",
    "twist": "다른 연결을 구분하면 실제로 확인할 질문도 달라질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 지원 방식을 이야기한다면 부모는 참여 관계와 현재 질문을 각각 설명한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "각각의 출처와 비단정 조건을 유지한다.",
    "childAvailableChoice": "관계 분류와 실제 경험이 다르다고 말할 수 있다.",
    "counterexample": "실제 관계 한쪽이 없으면 공존 설명을 보류한다.",
    "distinctFromOtherParagraphs": "복수 관계의 대상 구분",
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
      "condition": "좋고 나쁨 하나로 가족을 평가",
      "parentChecksFirst": "각각의 출처와 비단정 조건을 유지한다.",
      "childExpression": "관계 분류와 실제 경험이 다르다고 말할 수 있다.",
      "adultChange": "각각의 출처와 비단정 조건을 유지한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관계 분류와 실제 경험이 다르다고 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P3:result-debt-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
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
    "readerQuestion": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "기대→지원 대가 요구→관심 설명 위축의 반복 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "양쪽 원천은 실제 반복 이력이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "부모의 의도와 자녀에게 남을 결과 부담을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "부모는 지원과 성과 기대를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "자녀가 부모의 성공감을 회복할 의무는 없다.",
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
      "friction",
      "expectation"
    ],
    "positive": "반복의 조건을 알아볼 기회",
    "risk": "설명이 줄면 지원을 줄이겠다고 압박",
    "factBomb": "결과로 증명하라는 말을 반복하면 필요한 도움을 묻는 말은 줄어들 수 있다.",
    "twist": "성과를 약속받지 않아도 현재 시도는 함께 확인할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 같은 진로 논의가 반복된다면 부모는 현재 한 결정만 분리한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기대와 조건 없는 보호를 구분한다.",
    "childAvailableChoice": "관심·부담·보류를 말할 수 있다.",
    "counterexample": "실제 성적·지원 철회·과거 갈등을 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "A 부담의 악화 순서",
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
      "condition": "설명이 줄면 지원을 줄이겠다고 압박",
      "parentChecksFirst": "기대와 조건 없는 보호를 구분한다.",
      "childExpression": "관심·부담·보류를 말할 수 있다.",
      "adultChange": "기대와 조건 없는 보호를 구분한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "관심·부담·보류를 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P3:protection-question-test-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
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
    "readerQuestion": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "걱정→정답 확인 질문→자녀 설명 차단의 반복 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "부모의 보호 의도와 실제 질문의 기능을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "안전 판단은 실제 위험 근거가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "부모는 이미 정한 답을 시험하는지 점검한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "자녀가 질문을 잘해야 선택권을 주는 조건을 걸지 않는다.",
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
      "friction",
      "protection"
    ],
    "positive": "보호와 검사 질문을 구분할 가능성",
    "risk": "질문 형식만으로 선택권을 줬다고 여김",
    "factBomb": "모든 선택지를 없애고 묻는 말은 자녀에게 정답 맞히기만 남길 수 있다.",
    "twist": "바꿀 부분을 실제 남기면 질문의 역할이 달라질 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 활동 허용을 논의한다면 부모는 안전 조건과 열어둘 방법을 구분한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "질문의 목적과 실제 선택 범위를 확인한다.",
    "childAvailableChoice": "이유를 묻거나 다른 방법을 말할 수 있다.",
    "counterexample": "구체 위험·보호 필요를 유형으로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "보호 과용의 반복 고리",
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
      "condition": "질문 형식만으로 선택권을 줬다고 여김",
      "parentChecksFirst": "질문의 목적과 실제 선택 범위를 확인한다.",
      "childExpression": "이유를 묻거나 다른 방법을 말할 수 있다.",
      "adultChange": "질문의 목적과 실제 선택 범위를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "이유를 묻거나 다른 방법을 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P3:debate-silence-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
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
    "readerQuestion": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "빠른 반박→설명 중단→더 많은 질문의 반복 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "반박과 침묵은 실제 과거 사건이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "부모는 내용 확인과 답변 요구를 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "자녀에게 정리 시간과 다른 통로를 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "기다릴 동안 필요한 보호는 유지한다.",
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
      "friction",
      "communication"
    ],
    "positive": "설명할 통로를 다시 고를 기회",
    "risk": "말이 없으니 더 몰아붙여야 한다고 판단",
    "factBomb": "대답을 늘리라고 할수록 들으려는 내용이 멀어질 수 있다.",
    "twist": "대화의 속도를 낮추면 적게 말해도 정확한 정보가 올 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 대화가 막힌다면 부모는 질문을 멈추고 전달 방법을 다시 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "반박을 멈추고 수신을 확인한다.",
    "childAvailableChoice": "말·글·보류를 고를 수 있다.",
    "counterexample": "위험한 직접 대화를 자녀에게 강요하지 않는다.",
    "distinctFromOtherParagraphs": "대화 방식의 악화 순서",
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
      "condition": "말이 없으니 더 몰아붙여야 한다고 판단",
      "parentChecksFirst": "반박을 멈추고 수신을 확인한다.",
      "childExpression": "말·글·보류를 고를 수 있다.",
      "adultChange": "반박을 멈추고 수신을 확인한다.",
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
    "id": "pcpr:material:CH07.P3:child-comfort-parent-loop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
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
    "readerQuestion": "기대·보호 검사·반박·위로 요구가 반복을 키우는 순서는 무엇인가?",
    "coreMeaning": "부모 불편→자녀 위로 기대→자녀 경계 축소의 반복 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "실제 의존·돌봄 이력을 유형에서 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "부모의 필요는 성인 지원으로 다룬다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "자녀가 걱정을 표현해도 그 뒤의 책임은 부모에게 남는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "안전과 돌봄을 자녀의 반응에 조건화하지 않는다.",
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
      "friction",
      "adultSupport"
    ],
    "positive": "정서 책임의 경계를 확인할 기회",
    "risk": "좋은 자녀는 부모 마음을 알아야 한다고 요구",
    "factBomb": "아이에게 위로받는 편함이 아이에게 어떤 일을 남기는지 어른이 먼저 봐야 한다.",
    "twist": "부모가 성인 도움을 구하면 자녀는 관심을 표현하는 데서 멈출 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 자녀에게 자꾸 마음을 털어놓고 싶다면 부모는 지원 대상을 다시 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "자신의 반응·요구·성인 지원을 점검한다.",
    "childAvailableChoice": "대화 범위를 줄이거나 도움을 요청할 수 있다.",
    "counterexample": "실제 위험은 양쪽의 성향 차이로 조율하지 않는다.",
    "distinctFromOtherParagraphs": "부모의 정서 책임 전가를 제한하는 반복 조건",
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
      "condition": "좋은 자녀는 부모 마음을 알아야 한다고 요구",
      "parentChecksFirst": "자신의 반응·요구·성인 지원을 점검한다.",
      "childExpression": "대화 범위를 줄이거나 도움을 요청할 수 있다.",
      "adultChange": "자신의 반응·요구·성인 지원을 점검한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "대화 범위를 줄이거나 도움을 요청할 수 있다.",
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
    "id": "pcpr:material:CH07.P4:comparison-removes-own-question",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
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
    "readerQuestion": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "coreMeaning": "다른 가족·또래와의 비교가 현재 지원 질문을 지울 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 비교 경험이나 형제 존재는 미입력이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "부모가 원하는 결과와 자녀의 현재 질문을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "비교 대신 바꿀 행동과 필요한 도움을 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "자녀의 가치를 성과 순서로 평가하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
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
      "friction",
      "learning"
    ],
    "positive": "현재 필요한 지원을 볼 가능성",
    "risk": "비교를 동기부여로만 정당화",
    "factBomb": "다른 아이 이야기를 오래 해도 지금 내 아이가 막힌 곳은 알 수 없다.",
    "twist": "현재 한 질문을 듣는 것이 더 구체적인 지원을 만들 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 학습을 논의한다면 부모는 또래 순위 대신 필요한 자료를 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "비교를 멈추고 실제 지원을 확인한다.",
    "childAvailableChoice": "자기 질문과 도움 필요를 말할 수 있다.",
    "counterexample": "형제·또래 성과·가정 이력을 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "비교의 비용과 지원의 초점",
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
      "condition": "비교를 동기부여로만 정당화",
      "parentChecksFirst": "비교를 멈추고 실제 지원을 확인한다.",
      "childExpression": "자기 질문과 도움 필요를 말할 수 있다.",
      "adultChange": "비교를 멈추고 실제 지원을 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "자기 질문과 도움 필요를 말할 수 있다.",
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
    "id": "pcpr:material:CH07.P4:digital-monitoring-is-not-trust",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
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
    "readerQuestion": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "coreMeaning": "확인 필요를 무제한 감시나 위협으로 바꾸지 않을 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 위험·보호 필요는 전문적 판단과 실제 정보가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "단순 기기 사용 갈등과 학대·강압은 다르다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "부모는 정보 확인의 목적·범위·보호 계획을 설명한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "자녀에게 위험한 감시를 스스로 해결하라고 요구하지 않는다.",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
      "friction",
      "digital",
      "safety"
    ],
    "positive": "필요한 안전 범위를 구별할 가능성",
    "risk": "몰래 모든 정보를 보는 것을 보호 성향으로 미화",
    "factBomb": "걱정의 크기만으로 사생활 침해가 사라지지는 않는다.",
    "twist": "정보를 덜 요구하면서도 도움을 요청할 통로를 강화할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 온라인 안전을 논의한다면 부모는 실제 위험과 지원 경로를 먼저 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "안전 문제를 성격의 탓으로 돌리지 않는다.",
    "childAvailableChoice": "안전한 성인·전문 지원을 선택할 수 있다.",
    "counterexample": "법률·아동보호 판단이나 위기 개입을 유형 조언으로 대신하지 않는다.",
    "distinctFromOtherParagraphs": "감시와 보호의 안전 경계",
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
      "condition": "몰래 모든 정보를 보는 것을 보호 성향으로 미화",
      "parentChecksFirst": "안전 문제를 성격의 탓으로 돌리지 않는다.",
      "childExpression": "안전한 성인·전문 지원을 선택할 수 있다.",
      "adultChange": "안전 문제를 성격의 탓으로 돌리지 않는다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "안전한 성인·전문 지원을 선택할 수 있다.",
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
    "id": "pcpr:material:CH07.P4:adult-choice-not-permanent-approval",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
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
    "readerQuestion": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "coreMeaning": "성인 자녀의 선택을 과거 부모 역할의 영구 승인 대상으로 볼 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 성인 맥락과 지원 필요를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "부모의 조언과 상대의 결정권은 다르다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "관계 유지와 모든 결정 공개를 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "돌봄 지원이 필요해도 실제 동의·능력을 별도로 확인한다.",
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
      "friction",
      "adultChild"
    ],
    "positive": "현재에 맞는 경계를 정할 가능성",
    "risk": "지원했으니 진로·방문·연락을 모두 정함",
    "factBomb": "예전의 보호 책임이 지금 모든 선택의 허락권으로 남는 것은 아니다.",
    "twist": "요청받은 지원만 맡아도 연결을 유지할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 대학 생활 결정을 논의한다면 부모는 원하는 지원 범위만 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "승인 요구를 줄이고 정보 제공 범위를 확인한다.",
    "childAvailableChoice": "결정·조언 수신·연락 경계를 고를 수 있다.",
    "counterexample": "성인 전체의 법적 의무·능력을 일반화하지 않는다.",
    "distinctFromOtherParagraphs": "성인 관계의 권한 과용",
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
      "condition": "지원했으니 진로·방문·연락을 모두 정함",
      "parentChecksFirst": "승인 요구를 줄이고 정보 제공 범위를 확인한다.",
      "childExpression": "결정·조언 수신·연락 경계를 고를 수 있다.",
      "adultChange": "승인 요구를 줄이고 정보 제공 범위를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "결정·조언 수신·연락 경계를 고를 수 있다.",
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
    "id": "pcpr:material:CH07.P4:coercion-not-equal-style-conflict",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
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
    "readerQuestion": "비교·감시·영구 승인권·강압에서 어른이 돌아볼 경계는 무엇인가?",
    "coreMeaning": "폭력·방임·강압을 부모와 자녀의 같은 성향 차이로 만들지 않는 안전 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "유형이나 명리로 실제 가해·피해를 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "위험한 상황은 일반 대화의 잘못을 반씩 나눌 문제가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "미성년 안전과 필요한 보호를 성인이 책임진다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "자녀에게 설득·용서·관계 유지로 해결하라 요구하지 않는다.",
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
      "friction",
      "safety"
    ],
    "positive": "성격 설명과 안전 판단을 구분할 가능성",
    "risk": "학대를 궁합이 안 맞는 결과로 미화",
    "factBomb": "어른의 위험한 행동을 아이가 더 잘 이해했어야 할 문제로 돌릴 수는 없다.",
    "twist": "안전한 지원으로 거리를 두는 선택도 보호의 일부일 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 안전 우려가 있다면 성인은 적절한 보호·전문 지원을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "안전 확보와 전문 판단을 우선한다.",
    "childAvailableChoice": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
    "counterexample": "일반 연구 DB로 의료·심리·법률·아동보호 판단을 대신하지 않는다.",
    "distinctFromOtherParagraphs": "조율하면 안 되는 안전 문제의 분리",
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
      "condition": "학대를 궁합이 안 맞는 결과로 미화",
      "parentChecksFirst": "안전 확보와 전문 판단을 우선한다.",
      "childExpression": "안전한 도움을 요청하거나 위험한 대화를 중단할 수 있다.",
      "adultChange": "안전 확보와 전문 판단을 우선한다.",
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
