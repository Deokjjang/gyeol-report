import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_COMPARISON_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:compare:common",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "같은 cycle과 원국 root가 지속되는가?",
    "requires": [
      "연도별 annual ID가 다르더라도 기반 root는 하나로 보존"
    ],
    "positive": "공통 배경을 짧게 환기해 반복 설명을 줄임",
    "risk": "문장 변형을 새로운 근거로 세지 않음",
    "twist": "지속 자체를 해당 연도의 정보 기능으로 인정",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:difference",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "이전 연도와 실제 달라진 참가자·기간·관계는 무엇인가?",
    "requires": [
      "연주·십성·관계 ID·범위의 차이를 분리"
    ],
    "positive": "변화가 생긴 층위만 새 설명으로 제시",
    "risk": "관계 수 차이만으로 더 좋은 해를 만들지 않음",
    "twist": "차이가 없으면 새로운 서사를 만들 필요 없음",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:repeated-god",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "같은 십성이 돌아왔을 때 배경은 같은가?",
    "requires": [
      "이전 year와 cycle·원국/세운 관계를 함께 비교"
    ],
    "positive": "동일 과제의 다른 적용 조건을 확인",
    "risk": "같은 십성=같은 사건·같은 기분 금지",
    "twist": "배경도 같다면 유지·재점검으로 분류",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:root-use",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "같은 원국 특성이 다른 생활 조건에서 쓰이는가?",
    "requires": [
      "원국 root는 유지, 기간 claim과 맥락은 별도"
    ],
    "positive": "새로운 활용은 조건부 예시로 구별",
    "risk": "새 활용을 새 natal fact로 복제하지 않음",
    "twist": "사용처의 변경과 사실의 증가는 다름",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:new-relation",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "새 관계가 실제 검출되고 유효한가?",
    "requires": [
      "실제 reason ID·참가자·기간·성립 조건 검사"
    ],
    "positive": "신규 접점이나 조정 질문의 근거를 제시",
    "risk": "연구 relation label로 계산 결과를 대체 금지",
    "twist": "긍정과 긴장이 같이 있으면 둘 다 남김",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:continuation",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "새 근거가 없다면 어떤 질문을 유지하는가?",
    "requires": [
      "기존 root와 유효 기간이 유지되는 경우만"
    ],
    "positive": "장기 방향을 다시 점검할 기준을 제공",
    "risk": "새 운의 변화라고 포장하지 않음",
    "twist": "조용한 해·평온한 삶을 추정하지 않음",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:transition",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "같은 연도 안에서 어느 배경이 바뀌는가?",
    "requires": [
      "before/uncertain/after 구간과 현재 지원 범위"
    ],
    "positive": "전환 이전·이후의 질문을 독립 비교",
    "risk": "after 관계를 전체 연도로 확대 금지",
    "twist": "같은 연주라도 대운 배경이 달라짐",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:past-limit",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "입력되지 않은 과거 경험을 만들고 있지 않은가?",
    "requires": [
      "과거 fact와 독자의 기억 확인을 분리"
    ],
    "positive": "그런 장면이 있었다면 무엇을 배웠는지 질문",
    "risk": "이미 경험·손실·이별·성공했다고 단정 금지",
    "twist": "기억이 없으면 해석의 적용을 유보",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  },
  {
    "id": "mfpr:compare:future-condition",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_year",
    "question": "먼 미래에 현재 상태를 그대로 투영하고 있지 않은가?",
    "requires": [
      "시기 계산과 실제 직업·혼인·수입 미상을 분리"
    ],
    "positive": "생활 상태가 달라져도 적용 가능한 기준 제시",
    "risk": "현재 직업 14년 유지·미래 역할 확보 금지",
    "twist": "조건 변화에 따라 적용 영역을 바꿀 수 있음",
    "sourceRefs": [
      "mfpr:source:horizon",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "newScoreOrWeight": false
  }
];
