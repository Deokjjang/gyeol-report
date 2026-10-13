/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { ReuseResearch } from "./researchTypes";

export const LOVE_SEMANTIC_REUSE_RESEARCH: readonly ReuseResearch[] = [
  {
    "id": "lkr:reuse:01",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH01",
      "CH02",
      "CH06"
    ],
    "sharedMeaning": "도움 필요 확인",
    "distinctQuestions": [
      "나는 어떻게 돕는가?",
      "처음/가까운 사이에 어떤 가치를 주는가?",
      "언제 도움이 부담으로 엇갈리는가?"
    ],
    "duplicateRisk": "같은 잘 챙김 문장의 반복",
    "reuseCondition": "같은 원천을 회수하더라도 과정·매력·과용 조건이 실제로 다를 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:02",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH01",
      "CH03",
      "CH05"
    ],
    "sharedMeaning": "개인 선택권",
    "distinctQuestions": [
      "애정 안에 어떤 자기 자리가 필요한가?",
      "편한 관계의 조건은?",
      "가까워진 뒤 어떻게 공간과 재연결을 고를까?"
    ],
    "duplicateRisk": "혼자 시간이 필요하다는 결론만 세 번 출력",
    "reuseCondition": "주어가 본인 성향·관계 조건·조율 행동으로 바뀌며 새 정보가 있을 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:03",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH02",
      "CH04"
    ],
    "sharedMeaning": "관심 표현",
    "distinctQuestions": [
      "어떤 첫 매력을 쓸 수 있는가?",
      "현재 상태에서는 무엇을 표현하고 확인할까?"
    ],
    "duplicateRisk": "밝게 표현한다는 뜻을 상태 단어만 바꾸기",
    "reuseCondition": "현재 enum의 관찰·질문·속도·과제를 실제로 추가할 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:04",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH02",
      "CH05"
    ],
    "sharedMeaning": "가까운 매력",
    "distinctQuestions": [
      "가까워지면 어떤 가치가 보일 수 있는가?",
      "무엇을 원하고 어떻게 관계를 지속할까?"
    ],
    "duplicateRisk": "같은 private 문장을 두 챕터의 새 정보로 계산",
    "reuseCondition": "매력의 수신 가치와 유지·공간의 조건을 구분할 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:05",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH03",
      "CH07"
    ],
    "sharedMeaning": "관계 선택과 생활 조건",
    "distinctQuestions": [
      "어떤 응답을 관찰할까?",
      "공동생활을 선택한다면 어떤 일을 함께 정할까?"
    ],
    "duplicateRisk": "이상형 조건을 배우자의 실제 성격으로 전환",
    "reuseCondition": "상대의 실제 입력 없이 환경·합의 질문으로만 둘 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:06",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH04",
      "CH07"
    ],
    "sharedMeaning": "결혼 준비의 결정",
    "distinctQuestions": [
      "준비 중 애정을 어떻게 들을까?",
      "장기 공동생활의 책임과 수정 절차는?"
    ],
    "duplicateRisk": "같은 준비 일정 이야기 반복",
    "reuseCondition": "CH04는 현재 준비 맥락, CH07은 생활 운영의 지속 조건일 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:07",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH05",
      "CH06"
    ],
    "sharedMeaning": "재연결",
    "distinctQuestions": [
      "깊은 관계에 필요한 통로는?",
      "갈등의 어느 행동을 어떻게 바꿀까?"
    ],
    "duplicateRisk": "돌아올 시간을 말하라는 조언만 반복",
    "reuseCondition": "기본 필요와 구체적인 오해 순환·회복 행동을 구분할 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:08",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH06",
      "CH07"
    ],
    "sharedMeaning": "공동 책임",
    "distinctQuestions": [
      "선한 의도와 실제 부담이 언제 어긋날까?",
      "역할·돈·가사·휴식을 어떤 단위로 나눌까?"
    ],
    "duplicateRisk": "일방 희생 금지 문장의 반복",
    "reuseCondition": "갈등의 메커니즘과 과제별 운영 조건이 별도일 때",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:09",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH07",
      "CH08"
    ],
    "sharedMeaning": "돌봄과 자율",
    "distinctQuestions": [
      "성인끼리 공동 책임은 어떻게 정할까?",
      "부모 역할을 선택한다면 나이·안전·의존을 어떻게 고려할까?"
    ],
    "duplicateRisk": "배우자 조율을 아이에게 그대로 적용",
    "reuseCondition": "아이의 실제 연령과 보호 책임을 별도 확인하고 adult owner만 유지",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:10",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH01",
      "CH08"
    ],
    "sharedMeaning": "본인의 돌봄",
    "distinctQuestions": [
      "애정에서 내 필요는?",
      "조건부 양육에서 보호·선택·도움 통로는?"
    ],
    "duplicateRisk": "love trait를 parenting이나 child 사실로 전이",
    "reuseCondition": "parenting 분야 source와 아이의 실제 정보 범위를 각각 확인",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:11",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH02",
      "CH09"
    ],
    "sharedMeaning": "긍정 자원",
    "distinctQuestions": [
      "매력으로 쓸 행동은?",
      "실제 검증된 자원과 적용 조건은?"
    ],
    "duplicateRisk": "마지막에 모든 대안 후보를 한 사람의 장점으로 합산",
    "reuseCondition": "P1/P2 새 긍정은 실제 source 필요; P3/P4는 도입된 호환 의미만",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:12",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH06",
      "CH09"
    ],
    "sharedMeaning": "팩폭과 방향",
    "distinctQuestions": [
      "무엇이 왜 부담이 될 수 있는가?",
      "앞서 읽은 위험에서 어떤 작은 선택을 회수할까?"
    ],
    "duplicateRisk": "미선택 위험을 고객의 경험으로 마무리",
    "reuseCondition": "실제 소개된 의미와 동일 owner의 다음 행동으로만 회수",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:13",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH01",
      "CH03",
      "CH06"
    ],
    "sharedMeaning": "명리와 MBTI의 유사 뜻",
    "distinctQuestions": [
      "출처별로 무엇을 말하는가?",
      "어떤 조건을 선택할까?",
      "충분하지 않은 근거는 무엇인가?"
    ],
    "duplicateRisk": "원국·MBTI·Fusion을 독립 근거 세 개로 부풀리기",
    "reuseCondition": "계산 사실·유형 자료·결합 규칙의 서로 다른 역할을 확인",
    "independentFactsAdded": 0
  },
  {
    "id": "lkr:reuse:14",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapters": [
      "CH07",
      "CH08",
      "CH09"
    ],
    "sharedMeaning": "역할 선택권",
    "distinctQuestions": [
      "공동생활을 선택한다면?",
      "양육을 선택한다면?",
      "어떤 관계 기준을 남길까?"
    ],
    "duplicateRisk": "결혼·출산을 자연스러운 최종 단계로 강요",
    "reuseCondition": "현재 상태와 미래 의사를 분리하고 비선택을 결함화하지 않음",
    "independentFactsAdded": 0
  }
];
