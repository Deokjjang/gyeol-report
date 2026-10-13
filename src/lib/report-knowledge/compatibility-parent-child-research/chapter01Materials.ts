/** Static parent/child research. No runtime binding, age inference or customer approval. */
import type { ParentChildMaterial } from "./researchTypes";
export const PC_CH01_MATERIALS: readonly ParentChildMaterial[] = [
  {
    "id": "pcpr:material:CH01.P1:predictability-with-room-to-try",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
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
    "readerQuestion": "부모의 보호와 자녀의 탐색은 어떤 다른 책임을 가지는가?",
    "coreMeaning": "부모가 바라는 꾸준함과 자녀의 관심 탐색을 서로 다른 책임의 질문으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "부모 A의 책임 기대는 A의 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "자녀 B의 관심별 몰입 가설은 능력이나 성적의 사실이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "안전을 마련할 어른과 시도할 자녀의 몫을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "같은 목표보다 질문을 다시 가져올 통로가 관계의 첫 기준이다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "63aa4d746575e86c7743",
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
      "roles",
      "learning"
    ],
    "positive": "예측 가능한 지원 안에서 관심을 시험할 가능성",
    "risk": "꾸준함을 부모가 고른 진로에 따르는 것으로 정의",
    "factBomb": "성실하길 바란다는 말에 자녀의 관심을 대신 고를 권한까지 들어 있지는 않다.",
    "twist": "짧은 시험 기간이 평생의 목표를 먼저 확정하는 것보다 선택을 알아보게 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 학습 활동을 고른다면 부모는 안전과 비용 범위를 확인하고 자녀가 시험할 주제를 고른다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기대와 현재 시도를 나누어 설명한다.",
    "childAvailableChoice": "지금 직접 해보고 싶은 부분과 도움이 필요한 부분을 말하거나 보류할 수 있다.",
    "counterexample": "실제 관심·학습 상태가 없으면 집중력 부족이나 성적을 추론하지 않는다.",
    "distinctFromOtherParagraphs": "첫 관계 기준이며 실제 교육 성과 판정 아님",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "63aa4d746575e86c7743",
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
      "condition": "꾸준함을 부모가 고른 진로에 따르는 것으로 정의",
      "parentChecksFirst": "기대와 현재 시도를 나누어 설명한다.",
      "childExpression": "지금 직접 해보고 싶은 부분과 도움이 필요한 부분을 말하거나 보류할 수 있다.",
      "adultChange": "기대와 현재 시도를 나누어 설명한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "지금 직접 해보고 싶은 부분과 도움이 필요한 부분을 말하거나 보류할 수 있다.",
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
    "id": "pcpr:material:CH01.P1:autonomy-with-adult-responsibility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
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
    "readerQuestion": "부모의 보호와 자녀의 탐색은 어떤 다른 책임을 가지는가?",
    "coreMeaning": "자율성을 주려는 부모와 공정한 기준을 묻는 자녀 사이에서 설명과 보호의 책임을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A의 자율성 지향은 실제 감독을 했다는 사실이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "B의 규칙 관심은 모든 규칙에 복종한다는 뜻이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "부모는 필요한 안전 조건과 바꿀 수 있는 방법을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "자녀의 동의 여부가 어른의 돌봄 책임을 없애지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "10d4177606458102491b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "dbac6788077f6b449dd2",
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
      "roles",
      "protection"
    ],
    "positive": "예측할 수 있는 경계 안의 선택",
    "risk": "자유라는 말로 위험 판단까지 자녀에게 넘김",
    "factBomb": "스스로 고르라는 말만으로 필요한 보호가 마련되지는 않는다.",
    "twist": "명확한 안전 경계가 오히려 직접 고를 범위를 보이게 할 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 새 활동을 준비한다면 부모가 실제 위험과 지원을 확인한 뒤 자녀의 방법을 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "보호할 조건을 직접 점검하고 이유를 설명한다.",
    "childAvailableChoice": "이유를 묻고 가능한 방법을 제안하거나 지원을 요청할 수 있다.",
    "counterexample": "실제 위험·연령·상황이 미확인이라면 구체적인 허용 여부를 판정하지 않는다.",
    "distinctFromOtherParagraphs": "자유와 방치의 차이를 도입",
    "precedingMeaningRefs": [],
    "requirements": {
      "fixedRole": "V4 fixed-ab-v1 확인 시 A 부모/B 자녀. 역할 없는 과거 입력·잘못된 버전·교환된 역할의 실제 적합성을 새로 만들지 않는다.",
      "enteredTypePredicates": [
        {
          "owner": "A",
          "type": "INFP",
          "sourceKey": "10d4177606458102491b",
          "domain": "PARENTS"
        },
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
      "condition": "자유라는 말로 위험 판단까지 자녀에게 넘김",
      "parentChecksFirst": "보호할 조건을 직접 점검하고 이유를 설명한다.",
      "childExpression": "이유를 묻고 가능한 방법을 제안하거나 지원을 요청할 수 있다.",
      "adultChange": "보호할 조건을 직접 점검하고 이유를 설명한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "이유를 묻고 가능한 방법을 제안하거나 지원을 요청할 수 있다.",
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
    "id": "pcpr:material:CH01.P2:harmony-not-parenting-proof",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
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
    "readerQuestion": "실제 관계 종류와 좋은 양육의 판단을 어떻게 구분하는가?",
    "coreMeaning": "실제 子丑 육합의 관계 분류를 좋은 양육의 증거와 구분하는 자료다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "실제 양쪽 기둥·참여자·육합 ID가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "연결의 전통 상징은 부모의 행동이나 자녀의 신뢰를 측정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "도움의 필요와 역할은 실제 상황에서 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "양육 책임은 합의 유무와 관계없이 성인에게 남는다.",
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
      "canonical",
      "roles"
    ],
    "positive": "검출된 연결을 이해의 질문으로 사용할 여지",
    "risk": "합이라는 이름으로 보호·경청 검토를 생략",
    "factBomb": "사주가 이어진다는 설명이 자녀의 말을 들어봤다는 증거는 아니다.",
    "twist": "좋은 상징도 실제 지원을 확인할 질문으로만 남길 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 도움 방식을 이야기한다면 부모는 자녀가 원하는 범위를 먼저 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "관계 종류와 실제 돌봄 행동을 분리한다.",
    "childAvailableChoice": "말할 준비가 되면 필요한 도움을 선택할 수 있다.",
    "counterexample": "육합 refs가 없거나 역할 버전이 없으면 실제 부모·자녀 관계로 적용하지 않는다.",
    "distinctFromOtherParagraphs": "명리 분류와 실제 관계 질의 비동일성",
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
      "condition": "합이라는 이름으로 보호·경청 검토를 생략",
      "parentChecksFirst": "관계 종류와 실제 돌봄 행동을 분리한다.",
      "childExpression": "말할 준비가 되면 필요한 도움을 선택할 수 있다.",
      "adultChange": "관계 종류와 실제 돌봄 행동을 분리한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "말할 준비가 되면 필요한 도움을 선택할 수 있다.",
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
    "id": "pcpr:material:CH01.P2:clash-not-disobedience",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
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
    "readerQuestion": "실제 관계 종류와 좋은 양육의 판단을 어떻게 구분하는가?",
    "coreMeaning": "실제 寅申 충을 자녀의 불순종이나 부모의 실패로 바꾸지 않는 질문을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "실제 충의 위치·참여자·ID를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "대향의 전통 의미는 실제 다툼의 원인 검증이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "서로 다른 의견은 무엇을 묻고 있는지 따로 듣는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "하나의 관계로 가족 전체를 판단하지 않는다.",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "topics": [
      "canonical",
      "communication"
    ],
    "positive": "차이를 작은 질문으로 나눌 가능성",
    "risk": "충을 이유로 자녀의 설명을 포기",
    "factBomb": "충이라는 이름을 안다고 자녀가 무엇을 걱정하는지 알게 되는 것은 아니다.",
    "twist": "같지 않은 의견도 부모가 기준을 점검할 정보가 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 생활 규칙을 논의한다면 부모는 질문을 반항으로 분류하기 전에 내용을 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "계산 관계와 실제 발언의 의미를 구분한다.",
    "childAvailableChoice": "규칙의 어려운 부분을 말하거나 다른 통로로 질문할 수 있다.",
    "counterexample": "실제 충이 없거나 말할 안전이 없으면 갈등 조율 후보를 보류한다.",
    "distinctFromOtherParagraphs": "관계 분류를 행동 원인으로 만들지 않는 명리 설명",
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
      "condition": "충을 이유로 자녀의 설명을 포기",
      "parentChecksFirst": "계산 관계와 실제 발언의 의미를 구분한다.",
      "childExpression": "규칙의 어려운 부분을 말하거나 다른 통로로 질문할 수 있다.",
      "adultChange": "계산 관계와 실제 발언의 의미를 구분한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "규칙의 어려운 부분을 말하거나 다른 통로로 질문할 수 있다.",
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
    "id": "pcpr:material:CH01.P3:pair-is-not-development-test",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
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
    "readerQuestion": "각자의 유형 참고가 무엇을 확인하게 하고 무엇은 말하지 못하는가?",
    "coreMeaning": "부모의 사고 지원과 자녀의 규칙 질문을 양쪽 원천으로 비교하되 발달 검사로 읽지 않는다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A의 생각하는 방법을 가르치려는 설명은 부모 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B의 이유를 묻는 설명은 자녀 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "양방향 Pair는 일반 참고이며 양육 적합성 검증이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "질문이 가능한 환경과 실제 이해 여부를 따로 확인한다.",
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
        "owner": "PAIR_AB",
        "sourceKey": "4c8fec77bf18db714ce9",
        "sourceUse": "directed_reference_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_BA",
        "sourceKey": "7b92392c46e9ec2206cf",
        "sourceUse": "directed_reference_only",
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
      "mbtiPair",
      "learning"
    ],
    "positive": "이유를 함께 살필 대화 가능성",
    "risk": "논쟁을 잘하면 자녀가 성숙하거나 우수하다고 판정",
    "factBomb": "질문에 답을 많이 준 것과 자녀의 질문을 알아들은 것은 다를 수 있다.",
    "twist": "부모도 모른다고 말하면 질문을 함께 확인할 여지가 남는다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 규칙의 이유를 묻는다면 부모는 답을 시험하지 않고 질문의 뜻을 다시 듣는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "가르칠 내용과 자녀가 궁금한 내용을 나눈다.",
    "childAvailableChoice": "이해 못한 부분을 다시 묻거나 다른 설명을 요청할 수 있다.",
    "counterexample": "한쪽 MBTI 미상·실제 단계 미확인일 때 유형 Pair로 설명을 보충하지 않는다.",
    "distinctFromOtherParagraphs": "원천 domain과 일반 Pair의 적용 한계",
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
      "condition": "논쟁을 잘하면 자녀가 성숙하거나 우수하다고 판정",
      "parentChecksFirst": "가르칠 내용과 자녀가 궁금한 내용을 나눈다.",
      "childExpression": "이해 못한 부분을 다시 묻거나 다른 설명을 요청할 수 있다.",
      "adultChange": "가르칠 내용과 자녀가 궁금한 내용을 나눈다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "이해 못한 부분을 다시 묻거나 다른 설명을 요청할 수 있다.",
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
    "id": "pcpr:material:CH01.P3:same-type-not-same-power",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
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
    "readerQuestion": "각자의 유형 참고가 무엇을 확인하게 하고 무엇은 말하지 못하는가?",
    "coreMeaning": "같은 유형의 규칙 관심이 있어도 부모 권한과 자녀의 발언권은 같지 않은 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "부모의 예측 가능한 환경 관심은 A에게만 배정한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "자녀의 규칙 준수 참고가 실제 순종이나 성적의 사실은 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "닮은 선호 속에서도 싫거나 모르는 말을 할 자리를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "부모는 조용한 반응을 동의로 대신하지 않는다.",
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
        "sourceKey": "a98212d9a6491c70cd80",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "eb40d39f2065a867ad79",
        "sourceUse": "directed_reference_only",
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
      "mbtiPair",
      "roles"
    ],
    "positive": "익숙한 기준을 설명할 공통 단서",
    "risk": "착해 보인다는 이유로 어려움을 묻지 않음",
    "factBomb": "말을 잘 듣는다는 평가만으로 말할 자리가 충분했다고 알 수는 없다.",
    "twist": "공통점이 많을수록 다른 의견을 따로 물어볼 이유가 생긴다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 일정표를 만든다면 부모는 자녀가 바꾸고 싶은 항목을 비공개로도 말할 수 있게 한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "기준 준수와 자유로운 의견을 별도로 확인한다.",
    "childAvailableChoice": "같은 의견을 요구받지 않고 어려운 항목을 말할 수 있다.",
    "counterexample": "자녀가 실제 규칙을 잘 지킨다고 입력 없이 서술하지 않는다.",
    "distinctFromOtherParagraphs": "같은 유형과 역할 비대칭의 구분",
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
      "condition": "착해 보인다는 이유로 어려움을 묻지 않음",
      "parentChecksFirst": "기준 준수와 자유로운 의견을 별도로 확인한다.",
      "childExpression": "같은 의견을 요구받지 않고 어려운 항목을 말할 수 있다.",
      "adultChange": "기준 준수와 자유로운 의견을 별도로 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "같은 의견을 요구받지 않고 어려운 항목을 말할 수 있다.",
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
    "id": "pcpr:material:CH01.P4:fixed-role-not-age-diagnosis",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
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
    "readerQuestion": "고정 역할과 실제 나이·생활 맥락을 어떻게 구분하는가?",
    "coreMeaning": "A=부모·B=자녀 고정 역할과 실제 발달 단계 미확인을 함께 유지하는 기준을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "역할 버전이 확인된 V4 입력에만 고정 라벨을 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "생년월일은 발달·능력·동거·법적 보호자 관계를 검증하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "나이와 적용 상황이 확인돼야 단계별 질문을 고른다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "역할 없는 과거 입력에 부모 역할을 새로 만들지 않는다.",
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
      "roles",
      "development"
    ],
    "positive": "모르는 조건을 남긴 정확한 관계 질문",
    "risk": "자녀를 모두 어린아이로 취급",
    "factBomb": "자녀라는 역할명에는 현재 스스로 결정할 수 있는 범위까지 적혀 있지 않다.",
    "twist": "미확인 상태를 남겨도 필요한 지원을 물을 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 지원 범위를 이야기한다면 먼저 어떤 상황을 함께 정하려는지 확인한다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "단계와 실제 관계를 추측하지 않고 적용 전제를 확인한다.",
    "childAvailableChoice": "확인할 맥락을 말하거나 제공하지 않을 수 있다.",
    "counterexample": "역할 버전·실제 상황이 없으면 구체적인 양육 전략을 확정하지 않는다.",
    "distinctFromOtherParagraphs": "고정 역할과 나이·관계 사실의 경계",
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
      "condition": "자녀를 모두 어린아이로 취급",
      "parentChecksFirst": "단계와 실제 관계를 추측하지 않고 적용 전제를 확인한다.",
      "childExpression": "확인할 맥락을 말하거나 제공하지 않을 수 있다.",
      "adultChange": "단계와 실제 관계를 추측하지 않고 적용 전제를 확인한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "확인할 맥락을 말하거나 제공하지 않을 수 있다.",
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
    "id": "pcpr:material:CH01.P4:adult-child-has-own-life",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "parentChild",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
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
    "readerQuestion": "고정 역할과 실제 나이·생활 맥락을 어떻게 구분하는가?",
    "coreMeaning": "성인 자녀 맥락이 확인됐다면 도움과 독립적 결정을 구분하는 관계 기준을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "대학생 지원 안내는 실제 그 맥락에만 참고한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "성인 자녀라는 이유로 부모의 통제권을 무기한 유지하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "도움받을 부분과 본인이 결정할 부분을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "지원의 동의 범위는 실제 당사자가 확인한다.",
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
      "adultChild",
      "roles"
    ],
    "positive": "연결을 유지하면서 결정 주체를 남길 가능성",
    "risk": "지원했다는 이유로 모든 선택의 승인권을 요구",
    "factBomb": "도움을 준다는 사실이 상대 삶의 결정권까지 넘겨받는 뜻은 아니다.",
    "twist": "답을 대신 내지 않는 지원도 관계를 이어갈 방법이 될 수 있다.",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가상으로 성인 자녀가 진로 정보를 요청한다면 부모는 자료를 건네고 필요한 지원 범위를 묻는다.",
      "notDevelopmentalObservation": true
    },
    "parentResponsibleAction": "조언·실행 지원·결정을 구분한다.",
    "childAvailableChoice": "조언을 고르거나 거절하고 직접 결정할 수 있다.",
    "counterexample": "실제 성인 여부·의사결정 지원 필요가 없으면 독립 가능성을 유형으로 판정하지 않는다.",
    "distinctFromOtherParagraphs": "미성년 보호와 다른 성인 자녀의 적용 기준",
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
      "condition": "지원했다는 이유로 모든 선택의 승인권을 요구",
      "parentChecksFirst": "조언·실행 지원·결정을 구분한다.",
      "childExpression": "조언을 고르거나 거절하고 직접 결정할 수 있다.",
      "adultChange": "조언·실행 지원·결정을 구분한다.",
      "safetyNonNegotiable": "실제 필요한 보호 유지. 모욕·폭력·강압 금지. 전문 판단을 일반 조율로 대체하지 않음.",
      "choiceLeftToChild": "조언을 고르거나 거절하고 직접 결정할 수 있다.",
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
