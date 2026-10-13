import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_RELATION_PRACTICES: readonly Study[] = [
  {
    "id": "afpr:relation:육합",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "두 참가자의 연결을 약속·협업 접점으로 검토한다.",
    "positive": "서로 맞는 부분과 각자 결정할 부분을 나눌 수 있다.",
    "risk": "접점이 있다는 이유로 비용·기여·신뢰까지 합의됐다고 가정",
    "twist": "선택권을 나누어 두는 것이 함께 움직일 조건을 유지할 수 있다.",
    "action": "함께 맡을 범위와 종료 기준을 따로 확인한다.",
    "scene": {
      "text": "가상으로 짧은 협업의 산출물과 각자 결정할 방법을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 연결·생활 장면이 없으면 인연 출현을 예측하지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "육합",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:삼합",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "실제 세 지지가 확인될 때만 모이는 방향을 검토한다.",
    "positive": "공통 목표와 각자의 기여를 구체화할 수 있다.",
    "risk": "두 참가자 반합이나 단순 pair를 완성 삼합으로 확대",
    "twist": "모일 수 있는 힘이 있어도 작은 범위로 시작할 수 있다.",
    "action": "세 참가자·owner·자리와 함께 끝낼 몫을 확인한다.",
    "scene": {
      "text": "가상으로 세 역할이 있는 과제에서 공통 완료 기준을 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "month_annual/dayun binary table에는 완전 삼합을 만들어 넣지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "삼합",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:반합",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "일부 연결은 완성된 삼합·합의와 구별한다.",
    "positive": "부족한 조건을 작은 시도로 확인할 수 있다.",
    "risk": "맞닿은 부분만 보고 모든 조건에 동의했다고 여김",
    "twist": "다른 부분은 분리해도 제한된 협력은 가능할 수 있다.",
    "action": "확인한 접점과 아직 합의하지 않은 비용을 나눈다.",
    "scene": {
      "text": "가상으로 짧게 함께 해본 뒤 다음에도 가능한지 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "미참가 세 번째 지지나 실제 합화를 생성하지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "반합",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:충",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "기존 리듬과 다른 요구의 조정을 검토한다.",
    "positive": "바꿀 순서와 담당을 미리 확인할 수 있다.",
    "risk": "조정을 반드시 실패·이별·사고로 번역",
    "twist": "변경 필요성이 무리한 기존 일정의 발견을 도울 수 있다.",
    "action": "새 요청 때문에 바뀔 기존 약속을 나란히 놓는다.",
    "scene": {
      "text": "가상으로 두 마감이 겹치면 각 책임자와 변경 범위를 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 다른 요구가 없는데 갈등이 이미 발생했다고 말하지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "충",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:형",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "되풀이되는 부담과 책임 기준을 점검한다.",
    "positive": "반복 비용의 조건을 조정할 수 있다.",
    "risk": "참는 의지나 통제를 늘리면 해결된다고 단정",
    "twist": "담당을 줄이는 선택이 수행의 지속을 도울 수 있다.",
    "action": "반복 요청의 빈도와 맡을 한도를 확인한다.",
    "scene": {
      "text": "가상으로 같은 수정 요구가 오면 수정 횟수와 승인선을 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "쌍 형을 전체 삼형·처벌·질병 판정으로 승격하지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "형",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:파",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "맞춘 절차와 역할의 세부를 다시 확인한다.",
    "positive": "작은 변경으로 실제 약속을 유지할 수 있다.",
    "risk": "절차 수정 가능성을 관계 파괴·계약 파기로 단정",
    "twist": "큰 원칙을 남기고 방법만 바꿀 수도 있다.",
    "action": "바꾼 순서를 함께하는 사람도 알고 있는지 확인한다.",
    "scene": {
      "text": "가상으로 파일 전달 방식만 바꾼 뒤 새 절차를 공유한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "변경 필요가 확인되지 않으면 깨진 사건을 만들지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "파",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  },
  {
    "id": "afpr:relation:해",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "confirmed_segment_relation",
    "meaning": "드러나지 않은 기대 차이를 확인하는 질문이다.",
    "positive": "설명한 내용과 이해한 내용을 비교할 수 있다.",
    "risk": "숨은 악의·배신·타인의 속마음을 확정",
    "twist": "일찍 물어보는 선택이 추측의 비용을 줄일 수 있다.",
    "action": "상대가 이해한 일정·도움 범위를 짧게 확인한다.",
    "scene": {
      "text": "가상으로 도와주기 전에 지금 필요한 도움이 무엇인지 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 발언·약속이 없으면 오해가 발생했다고 쓰지 않는다.",
    "requires": [
      "actual relation ID/type",
      "real participant owner and pillar",
      "matching valid interval",
      "actual contextual question"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "kind": "해",
    "noRelationDetection": true,
    "noOverallLuckVerdict": true
  }
];
