/** Static offline coworker research. No runtime registration or customer approval. */
import type { CoworkerMaterial } from "./researchTypes";
export const CW_CH01_MATERIALS: readonly CoworkerMaterial[] = [
  {
    "id": "cwpr:material:CH01.P1:question-before-start",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "협업 착수 전에 두 사람이 어떤 다른 정보를 필요로 할 수 있는가?",
    "coreMeaning": "A의 사전 사고 시간과 B의 현장 대응 선호를 착수 전 정보의 질문으로 구분한다.",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A는 미리 검토할 주제가 필요할 수 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "B의 현장 대응 선호는 즉시 실행 권한이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 착수에서 모르는 조건을 먼저 적는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "시작의 속도보다 첫 확인의 대상이 관계를 설명한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ce1c5899365d6cd736a8",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "d0c24f23fe8ce695264a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "goal",
    "workFunctions": [
      "planning",
      "execution"
    ],
    "outputType": "착수 질문표",
    "positive": "검토와 작은 확인을 함께 설계",
    "risk": "준비를 지연으로 실행을 성급함으로 단정",
    "factBomb": "빨리 시작했다는 사실만으로 같은 일을 이해한 것은 아니다.",
    "twist": "짧은 시험이 더 긴 검토의 질문을 만들 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 새 과제의 목표와 미확인 조건을 함께 적는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "먼저 읽을 질문 전달",
      "personB": "되돌릴 수 있는 첫 확인 제안"
    },
    "counterexample": "긴급 안전 대응은 별도 절차를 따른다.",
    "distinctFromOtherParagraphs": "전체 협업의 착수 기준이며 세부 마감 조정과 다름",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "ce1c5899365d6cd736a8",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ESTP",
          "sourceKey": "d0c24f23fe8ce695264a",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 새 과제의 목표와 미확인 조건을 함께 적는다면",
      "aChange": "먼저 읽을 질문 전달",
      "bChange": "되돌릴 수 있는 첫 확인 제안",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "착수 질문표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P1:standard-and-experiment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "협업 착수 전에 두 사람이 어떤 다른 정보를 필요로 할 수 있는가?",
    "coreMeaning": "지킬 기준과 새 방법의 탐색을 같은 목표 안의 다른 기여로 연구한다.",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A의 기준 선호는 현행 절차가 항상 옳다는 뜻이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "B의 발상 선호는 실행 가능한 해결책의 증명이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 계획에 고정 조건과 실험 범위를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "둘의 차이를 좋은 팀이라는 판정 대신 질문으로 남긴다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "871f1880dae3d3831abc",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "467622fb374bd18f05b9",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "planning",
      "experiment"
    ],
    "outputType": "실험 범위표",
    "positive": "기준 안에서 대안 시험",
    "risk": "기준 전부 폐기 또는 새 제안 전부 차단",
    "factBomb": "좋은 발상도 지켜야 할 조건을 몰라서는 비교하기 어렵다.",
    "twist": "고정할 부분이 있어야 새 방법의 차이도 보인다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 제안서의 필수 항목과 실험 항목을 나눈다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "필수 기준의 이유 공유",
      "personB": "한정된 대안 제시"
    },
    "counterexample": "실험이 금지된 안전 규정은 바꾸지 않는다.",
    "distinctFromOtherParagraphs": "도입의 범위 구분이며 CH04는 실제 조합 산출물",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "871f1880dae3d3831abc",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ENTP",
          "sourceKey": "467622fb374bd18f05b9",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 제안서의 필수 항목과 실험 항목을 나눈다면",
      "aChange": "필수 기준의 이유 공유",
      "bChange": "한정된 대안 제시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "실험 범위표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P1:focus-and-contact",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "협업 착수 전에 두 사람이 어떤 다른 정보를 필요로 할 수 있는가?",
    "coreMeaning": "혼자 정리할 시간과 함께 목표를 확인할 접점의 공존을 연구한다.",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A의 조용한 집중 선호는 관계 거부가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "B의 협력 선호는 상시 회의 의무가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 문서 작업에 연결 시점을 정한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "연락량보다 필요한 정보가 도착하는 조건을 본다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "248692af90259c9eebe4",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "cdc60c6b316ee8a858c1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "information",
    "workFunctions": [
      "focus",
      "communication"
    ],
    "outputType": "정보 접점표",
    "positive": "집중과 공동 이해의 공존",
    "risk": "침묵을 무관심 반응을 동의로 판단",
    "factBomb": "회의 참석 시간이 곧 결과물을 이해한 시간은 아니다.",
    "twist": "적은 접점도 필요한 자료가 있으면 구체적일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 공동 문서를 각자 읽고 질문만 모은다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "응답 가능한 시점 알림",
      "personB": "공동 확인할 목표 정리"
    },
    "counterexample": "실제 업무 방식은 당사자 확인 전 미상이다.",
    "distinctFromOtherParagraphs": "업무 접점의 도입이며 친밀감 크기 판단 아님",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "INFJ",
          "sourceKey": "248692af90259c9eebe4",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ENFJ",
          "sourceKey": "cdc60c6b316ee8a858c1",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 공동 문서를 각자 읽고 질문만 모은다면",
      "aChange": "응답 가능한 시점 알림",
      "bChange": "공동 확인할 목표 정리",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "정보 접점표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P1:output-not-rank",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "협업 착수 전에 두 사람이 어떤 다른 정보를 필요로 할 수 있는가?",
    "coreMeaning": "책임의 명료함과 조용한 추가 기여를 보되 순서로 권한을 부여하지 않는다.",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A 원천의 권한 관심은 실제 직급 정보가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "B의 더 챙김은 무한한 지원 의무가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 과제에서 담당과 미확인 승인자를 따로 적는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "coworker의 대칭은 동일 직급이라는 뜻도 아니다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "c782e08817e7f4ae8cd7",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "c537d089d3ff0412ed96",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "workStage": "goal",
    "workFunctions": [
      "roles",
      "authority"
    ],
    "outputType": "담당 확인표",
    "positive": "담당과 지원의 구분",
    "risk": "A가 결정하고 B가 돕는 역할 고정",
    "factBomb": "이름을 먼저 썼다고 최종 결정권까지 먼저 생기지는 않는다.",
    "twist": "권한을 모른다고 표시하는 일이 잘못된 명령을 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 완료 기준의 승인자가 알려지지 않았다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확인된 담당만 말함",
      "personB": "추가 지원의 한도 말함"
    },
    "counterexample": "실제 권한 자료가 오기 전 승인자 판정 보류",
    "distinctFromOtherParagraphs": "coworker 범위 도입",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "INTJ",
          "sourceKey": "c782e08817e7f4ae8cd7",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISFJ",
          "sourceKey": "c537d089d3ff0412ed96",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 완료 기준의 승인자가 알려지지 않았다면",
      "aChange": "확인된 담당만 말함",
      "bChange": "추가 지원의 한도 말함",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "담당 확인표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P2:harmony-is-classification",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 관계와 업무 능력을 어떻게 구별하는가?",
    "coreMeaning": "실제 子丑 육합은 전통 관계 분류이며 협업 능력 검증과 구분한다.",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "양쪽 실제 refs와 관계 ID가 있어야 한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "합의 전통 의미를 성과 확률로 바꾸지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "가상 목표 확인 질문과 계산 근거의 층위를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "강점 가능성은 실제 기여 조건을 추가 확인한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "84d1ddc4aa078aa8fa5f",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
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
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "goal",
    "workFunctions": [
      "canonical"
    ],
    "outputType": "근거 설명 메모",
    "positive": "같이 지킬 조건을 묻는 출발점",
    "risk": "합이면 결과가 좋다고 예측",
    "factBomb": "합이 검출되어도 누가 무엇을 끝낼지는 입력에 없다.",
    "twist": "다름 없는 관계도 역할 확인은 필요하다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 같은 일정에 참여한다면 담당부터 묻는다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 맡을 범위 제안",
      "personB": "가능한 수신 범위 확인"
    },
    "counterexample": "실제 육합 없으면 적용 보류",
    "distinctFromOtherParagraphs": "관계 분류와 운영 사실의 구별",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 같은 일정에 참여한다면 담당부터 묻는다.",
      "aChange": "자기 맡을 범위 제안",
      "bChange": "가능한 수신 범위 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "근거 설명 메모",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P2:clash-not-failure",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 관계와 업무 능력을 어떻게 구별하는가?",
    "coreMeaning": "실제 子午 충의 전통 긴장 분류를 실패의 예언과 구분한다.",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "계산된 교차 관계와 기둥을 먼저 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "충은 실제 동료 갈등의 증거가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "가상 방식 변경의 확인 조건만 제안한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "긍정·주의는 실제 작업 맥락과 별도 검토한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "941361dcf854c0c9f213",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CHANGE_ORIENTATION:chosen-change",
        "axis": "CHANGE_ORIENTATION",
        "definition": "스스로 선택한 변화와 강제 변화를 구별",
        "condition": "변경 권한과 실제 제약이 확인될 때",
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
    "workStage": "plan",
    "workFunctions": [
      "canonical"
    ],
    "outputType": "변경 질문 메모",
    "positive": "변경을 명료하게 묻기",
    "risk": "문제를 전부 충 탓으로 돌림",
    "factBomb": "충의 이름이 실제 사건의 원인을 대신하지는 않는다.",
    "twist": "긴장 분류가 있어도 명확한 범위 안의 협업은 가능하다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 작업 방식이 바뀐다면 영향을 묻는다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "바뀔 조건 기록",
      "personB": "영향받는 작업 알림"
    },
    "counterexample": "실제 충 미검출 시 충 설명 금지",
    "distinctFromOtherParagraphs": "관계의 쉬운 의미이며 CH07은 부담 조건",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 작업 방식이 바뀐다면 영향을 묻는다.",
      "aChange": "바뀔 조건 기록",
      "bChange": "영향받는 작업 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "변경 질문 메모",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P2:missing-relation-withhold",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 관계와 업무 능력을 어떻게 구별하는가?",
    "coreMeaning": "교차 관계가 검출되지 않으면 성격 관계를 지어내지 않고 확인 질문을 남긴다.",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "관계 미검출을 실제 결과로 보존한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "미검출은 나쁜 궁합도 완벽한 궁합도 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "가상 업무 요구는 일반 운영 질문으로 구분한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "방향 십성은 별도 계산이며 관계 부재를 메우지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
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
      }
    ],
    "workStage": "information",
    "workFunctions": [
      "canonical",
      "unknown"
    ],
    "outputType": "근거 부재 안내",
    "positive": "없는 근거를 만들지 않는 설명",
    "risk": "빈칸을 합이나 충으로 보충",
    "factBomb": "아무 관계가 없다는 계산이 아무 문제가 없다는 보장은 아니다.",
    "twist": "개인별 자료는 교차 관계 없이도 따로 확인할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 계산에 관계 ID가 없다면 일반 질문만 남긴다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "업무 정보 확인",
      "personB": "성향 판정 보류"
    },
    "counterexample": "관계가 실제 검출된 경우 그 ID를 별도 사용",
    "distinctFromOtherParagraphs": "부재를 처리하는 독립 후보",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 계산에 관계 ID가 없다면 일반 질문만 남긴다.",
      "aChange": "업무 정보 확인",
      "bChange": "성향 판정 보류",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "근거 부재 안내",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P2:three-part-formation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 관계와 업무 능력을 어떻게 구별하는가?",
    "coreMeaning": "삼합의 완전 구성과 두 글자 반합을 다른 계산으로 보존한다.",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "申子辰의 실제 참여자와 성립 조건을 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "정의에 글자가 있다고 실제 삼합이 된 것은 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "가상 계획 설명에서도 지지 수를 보충하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "관계 종류를 정확히 남기는 것이 해석의 첫 경계다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "21e5bae7c546ac98d6e5",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
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
      }
    ],
    "workStage": "review",
    "workFunctions": [
      "canonical",
      "formation"
    ],
    "outputType": "관계 구성표",
    "positive": "관계 설명의 출처 명료",
    "risk": "누락된 세 번째 지지 상상",
    "factBomb": "협업의 빈 역할을 찾듯 지지도 빈칸을 마음대로 채울 수는 없다.",
    "twist": "관계 수가 적어도 출처가 분명한 설명이 더 유용할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 근거가 두 글자만 담았다면 종류를 다시 확인한다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 refs 확인",
      "personB": "설명 범위 점검"
    },
    "counterexample": "삼합 미성립이면 이 후보 보류",
    "distinctFromOtherParagraphs": "성립 조건 연구이며 생산성 가설 아님",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 근거가 두 글자만 담았다면 종류를 다시 확인한다.",
      "aChange": "실제 refs 확인",
      "bChange": "설명 범위 점검",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "관계 구성표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P3:spoken-versus-private",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 사고·전달 선호에서 어떤 업무 질문을 확인하는가?",
    "coreMeaning": "대화하며 가설을 바꾸는 선호와 혼자 답을 다듬는 선호의 정보 차이를 연구한다.",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A의 반론은 확정 결론과 구분한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B의 즉답 유보를 동의나 거부로 판정하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "Pair 일반 문구는 방향별 참고로만 쓴다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "업무 답의 확정 시점을 서로 묻는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "053c20b20130d6ffcf7b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ce1c5899365d6cd736a8",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "5559e5065c4be9076ec2",
        "sourceUse": "directed_reference_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_BA",
        "sourceKey": "48ccafc8053b86a1df7e",
        "sourceUse": "directed_reference_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "axis": "ENERGY_DIRECTION",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:ENERGY_DIRECTION:dialogic-processing",
        "axis": "ENERGY_DIRECTION",
        "definition": "대화 속에서 생각을 발전",
        "condition": "대화 상대가 참여에 동의할 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "draft",
    "workFunctions": [
      "mbtiPair",
      "communication"
    ],
    "outputType": "회의 가설 목록",
    "positive": "발산과 정리의 연결",
    "risk": "발언 중 가설을 확정 약속으로 기록",
    "factBomb": "말을 많이 한 사람이 더 많이 확정한 것은 아니다.",
    "twist": "늦은 답이 앞선 가정을 바꿀 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 아이디어 회의 뒤 각자의 확정 의견을 받는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가설과 결론 표시",
      "personB": "검토 뒤 답할 시점 제안"
    },
    "counterexample": "두 유형·실제 trait 없으면 보류",
    "distinctFromOtherParagraphs": "업무 사고 통로의 비교",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENTP",
          "sourceKey": "053c20b20130d6ffcf7b",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "ce1c5899365d6cd736a8",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 아이디어 회의 뒤 각자의 확정 의견을 받는다면",
      "aChange": "가설과 결론 표시",
      "bChange": "검토 뒤 답할 시점 제안",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "회의 가설 목록",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P3:pace-and-done",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 사고·전달 선호에서 어떤 업무 질문을 확인하는가?",
    "coreMeaning": "핵심만 듣고 시험하려는 선호와 일정 약속을 먼저 보는 선호를 구분한다.",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A의 짧은 설명 선호는 정보 생략 권리가 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B의 시간 관심은 실제 지각 경험이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "가상 시연과 인계 시각을 분리한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "Pair의 예측처럼 업무 평가를 만들지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ab58584bb46db51081a8",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "51a36ebd6ebe0593251c",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "c2540685581fa615363b",
        "sourceUse": "directed_reference_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
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
    "workStage": "plan",
    "workFunctions": [
      "mbtiPair",
      "deadline"
    ],
    "outputType": "시연 인계표",
    "positive": "짧은 시험과 시간 확인",
    "risk": "빠름을 능력 지킴을 고집으로 판정",
    "factBomb": "핵심을 들었다는 말과 넘길 시간을 알았다는 말은 다르다.",
    "twist": "시험 시간을 정하면 속도와 약속을 함께 볼 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 빠른 시연 뒤 넘길 시각을 따로 적는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "필수 조건 요약",
      "personB": "검토 시간 확인"
    },
    "counterexample": "실제 마감 정보 없으면 시각 처방 금지",
    "distinctFromOtherParagraphs": "유형 비교이며 일정 운영은 후속",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ESTP",
          "sourceKey": "ab58584bb46db51081a8",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "51a36ebd6ebe0593251c",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 빠른 시연 뒤 넘길 시각을 따로 적는다면",
      "aChange": "필수 조건 요약",
      "bChange": "검토 시간 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "시연 인계표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P3:shared-precision-not-proof",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 사고·전달 선호에서 어떤 업무 질문을 확인하는가?",
    "coreMeaning": "둘 다 정확성을 중시해도 확인하는 오류가 같다고 가정하지 않는다.",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A의 절차 오류 관심은 A 자료다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B의 정의 정확성은 B 자료다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "가상 표의 수치와 용어를 각각 검토한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "공통 축도 독립 능력 증거 두 개로 과대 집계하지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "c7fee219fcf7a5b642fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "45a8725d424b6f14e7fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:PRECISION:argument-coherence",
        "axis": "PRECISION",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "condition": "주장 사실과 감정 경험을 구분",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "review",
    "workFunctions": [
      "mbti",
      "quality"
    ],
    "outputType": "검토 항목표",
    "positive": "검토 대상의 구분",
    "risk": "같은 꼼꼼함이라는 말로 검토 배분 생략",
    "factBomb": "둘 다 꼼꼼해도 같은 칸만 보면 빈칸은 남는다.",
    "twist": "비슷한 선호가 다른 검토 항목을 맡는 이유가 될 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 보고서에 수치 검토와 개념 검토를 나눈다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 자료 기준 확인",
      "personB": "정의와 결론 확인"
    },
    "counterexample": "각자의 실제 검토 능력은 별도 확인",
    "distinctFromOtherParagraphs": "공통 선호의 내부 차이",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "c7fee219fcf7a5b642fd",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "INTJ",
          "sourceKey": "45a8725d424b6f14e7fd",
          "domain": "THINKING"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 보고서에 수치 검토와 개념 검토를 나눈다면",
      "aChange": "실제 자료 기준 확인",
      "bChange": "정의와 결론 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "검토 항목표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P3:unknown-type-no-substitution",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 사고·전달 선호에서 어떤 업무 질문을 확인하는가?",
    "coreMeaning": "MBTI 미상인 사람의 업무 선호는 상대 유형으로 보충하지 않는다.",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A 미상과 B 미상은 독립 상태다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "Pair와 해당 개인 Fusion은 보류한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "가상 업무 선호를 직접 질문할 수는 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "질문에 답하기 전 성격을 확정하지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:chosen-support",
        "axis": "AUTONOMY",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "information",
    "workFunctions": [
      "unknown",
      "mbti"
    ],
    "outputType": "선호 확인 질문",
    "positive": "자기 설명을 받을 자리",
    "risk": "이름이나 직업으로 유형 추정",
    "factBomb": "유형을 모르는 빈칸이 상대 유형의 복사칸은 아니다.",
    "twist": "미상이어도 필요한 자료와 시간은 직접 묻는다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상으로 검토 방식부터 물어본다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자신이 편한 자료 말함",
      "personB": "원하는 전달 방식 제안"
    },
    "counterexample": "답변이 없으면 선호 결론 보류",
    "distinctFromOtherParagraphs": "미상 입력 안전성",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상으로 검토 방식부터 물어본다면",
      "aChange": "자신이 편한 자료 말함",
      "bChange": "원하는 전달 방식 제안",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "선호 확인 질문",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P4:phase-before-person",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "작업 단계·지원·결과·반복의 경계를 어떻게 잡는가?",
    "coreMeaning": "일의 단계와 사람의 능력을 분리하는 것을 협업의 첫 판단 기준으로 둔다.",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "같은 행동도 기획과 최종 검토에서 의미가 다르다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "유형 자료는 단계별 질문의 참고다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "가상 현재 단계와 다음 산출물을 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "구체한 질문을 뒤 장에서 확장한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRATEGY:sequence-design",
        "axis": "STRATEGY",
        "definition": "의존 관계에 맞게 순서를 배치",
        "condition": "담당자의 재량·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "goal",
    "workFunctions": [
      "process"
    ],
    "outputType": "단계 지도",
    "positive": "필요한 기여의 위치 확인",
    "risk": "개인 장단점으로 모든 단계 설명",
    "factBomb": "좋은 질문도 납품 직전에는 다른 작업을 만들 수 있다.",
    "twist": "일을 바꾸지 않고 질문할 시점을 바꿀 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 산출물의 현재 단계를 적는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "현재 단계 공유",
      "personB": "다음 수신 조건 확인"
    },
    "counterexample": "단계가 없으면 실제 장면 해석 보류",
    "distinctFromOtherParagraphs": "전 장의 판단 기준",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 산출물의 현재 단계를 적는다면",
      "aChange": "현재 단계 공유",
      "bChange": "다음 수신 조건 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "단계 지도",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P4:support-not-transfer",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "작업 단계·지원·결과·반복의 경계를 어떻게 잡는가?",
    "coreMeaning": "동료의 도움과 담당 책임 인수를 다른 계약으로 연구한다.",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "지원 제안은 능력 부족의 판정이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "도움을 받는다고 담당이 자동 이전되지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "가상 일부 작업의 범위를 정한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "실제 조직 승인 필요성은 UNKNOWN으로 남긴다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "983ac049dd4d1607030f",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
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
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "support",
      "roles"
    ],
    "outputType": "지원 범위표",
    "positive": "부담을 구체적으로 덜 가능성",
    "risk": "도움이 비공식 책임 이전이 됨",
    "factBomb": "도와줬다는 말만으로 누가 끝낼지 정해지지는 않는다.",
    "twist": "작은 지원이 전체 인수보다 분명할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 자료 정리만 지원한다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가능한 도움 범위 말함",
      "personB": "남은 담당 확인"
    },
    "counterexample": "자격·권한 필요한 업무는 별도 절차",
    "distinctFromOtherParagraphs": "도움과 책임의 첫 경계",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 자료 정리만 지원한다면",
      "aChange": "가능한 도움 범위 말함",
      "bChange": "남은 담당 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "지원 범위표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P4:result-and-respect",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "작업 단계·지원·결과·반복의 경계를 어떻게 잡는가?",
    "coreMeaning": "작업물의 기준과 상대를 존중하는 전달을 동시에 확인한다.",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "수정 의견과 인격 평가는 다르다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "의도는 실제 당사자에게 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "가상 오류의 위치와 영향을 구분한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "일의 문제를 관계 전체의 결론으로 바꾸지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "99abb271c1ef0a874619",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "feedback",
    "workFunctions": [
      "feedback",
      "quality"
    ],
    "outputType": "피드백 기준",
    "positive": "수정 가능한 문제의 명료화",
    "risk": "좋은 의도를 공격적 전달의 면책으로 사용",
    "factBomb": "맞는 지적도 고칠 위치가 없으면 작업 지시가 되기 어렵다.",
    "twist": "부드러운 질문도 필요한 기준을 분명히 할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 문서 오류의 위치와 요청을 함께 남긴다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "관찰한 사실만 전달",
      "personB": "받은 뜻을 확인"
    },
    "counterexample": "괴롭힘은 일반 피드백 조율로 대체하지 않는다.",
    "distinctFromOtherParagraphs": "도입 기준이며 CH08은 수정 절차",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 문서 오류의 위치와 요청을 함께 남긴다면",
      "aChange": "관찰한 사실만 전달",
      "bChange": "받은 뜻을 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "피드백 기준",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH01.P4:repeat-or-project",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "작업 단계·지원·결과·반복의 경계를 어떻게 잡는가?",
    "coreMeaning": "반복 업무의 안정과 프로젝트의 변경을 다른 협업 조건으로 본다.",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "반복 작업은 이전 절차의 갱신을 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "새 프로젝트는 아직 없는 기준을 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "가상 다음 작업의 변한 조건을 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "신뢰를 의견 일치나 실제 과거 이력으로 만들지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "1b369a62ec425b1ebbe5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "0388561cdeef5da930d4",
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
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "axis": "ADAPTABILITY",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "maintenance",
    "workFunctions": [
      "process",
      "trust"
    ],
    "outputType": "갱신 메모",
    "positive": "상황에 맞춘 확인",
    "risk": "지난 방식이 늘 맞다고 고정",
    "factBomb": "익숙해졌다는 사실이 이번 조건까지 같다는 뜻은 아니다.",
    "twist": "재확인 한 번이 불필요한 전면 회의를 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 같은 일을 다시 한다면 바뀐 조건만 찾는다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "변경 조건 공유",
      "personB": "유지 가능한 부분 확인"
    },
    "counterexample": "실제 반복 경험 미입력 상태 보존",
    "distinctFromOtherParagraphs": "반복·프로젝트 구분의 도입",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상 같은 일을 다시 한다면 바뀐 조건만 찾는다.",
      "aChange": "변경 조건 공유",
      "bChange": "유지 가능한 부분 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "갱신 메모",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  }
];
