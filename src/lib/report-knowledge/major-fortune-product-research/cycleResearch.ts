import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_CYCLE_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:cycle:stem",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "stem",
    "scope": "dayun",
    "meaning": "천간은 대운 간지의 드러난 층위를 구별하는 표지다.",
    "positive": "선택의 주제를 이름 붙여 장기 역할을 비교한다.",
    "risk": "천간 하나만으로 외부 성취를 확정할 수 없다.",
    "twist": "표현된 목표가 작아도 지속할 기준을 선명하게 할 수 있다.",
    "distinction": "같은 오행의 지지와 천간도 같은 관계로 합치지 않는다.",
    "requires": [
      "대운 천간·일간과 기존 십성 계산값"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:branch",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "branch",
    "scope": "dayun",
    "meaning": "대운 지지는 원국·세운 지지 관계의 실제 참가 요소다.",
    "positive": "연결 또는 조정이 필요한 생활 조건을 구체적으로 묻는다.",
    "risk": "지지 속 모든 지장간을 활성 사건으로 펼치지 않는다.",
    "twist": "관계가 없으면 지지의 일반 상징만 보류 후보로 남긴다.",
    "distinction": "지지 자체와 지장간·검출 관계는 다른 fact root다.",
    "requires": [
      "대운 지지·원국 자리·검출 관계와 기간"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:ten-god",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "ten-god",
    "scope": "dayun",
    "meaning": "대운 십성은 일간을 기준으로 대운 천간을 읽는 관계 범주다.",
    "positive": "10년 배경에서 계속 검토할 과제를 구별한다.",
    "risk": "십성명으로 직업·자산·배우자 출현을 예언하지 않는다.",
    "twist": "익숙한 이름이 다시 와도 이전과 다른 배경을 비교할 수 있다.",
    "distinction": "원국 동일 십성은 개인 기반이며 대운 십성과 출처가 다르다.",
    "requires": [
      "일간·대운 천간·getTenGodForStemPair 결과"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:element",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "element",
    "scope": "dayun",
    "meaning": "대운 오행은 원국에 더해 읽는 요소 표지이며 강도 결과가 아니다.",
    "positive": "이미 자주 쓰는 방식과 보완할 선택을 구분한다.",
    "risk": "부족 오행 유입을 곧 용신·건강 개선으로 연결하지 않는다.",
    "twist": "덜 쓰는 방식의 추가가 기존 강점의 포기를 뜻하지 않는다.",
    "distinction": "오행 개수와 격국·희기·세력은 서로 다른 주장이다.",
    "requires": [
      "대운 간지 오행·원국 실제 분포·기존 elementEffect"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:natal-link",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "natal-link",
    "scope": "dayun",
    "meaning": "타고난 성향과 기간 조건은 같은 문장에서도 출처를 나눠야 한다.",
    "positive": "평소 잘하는 방식이 새 과제에 쓰일 조건을 찾는다.",
    "risk": "주제 유사성이 실제 생극·합충을 계산한 증거는 아니다.",
    "twist": "새 상황이 약점을 없애기보다 강점의 사용처를 바꿀 수 있다.",
    "distinction": "개인 반응 설명과 기간 변화 설명을 독립해 남긴다.",
    "requires": [
      "원국 feature ID·대운 ID·주제 관련성"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:natal-structure",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "natal-structure",
    "scope": "dayun",
    "meaning": "복합 구조의 기존 성립 상태가 있을 때만 대운과 비교한다.",
    "positive": "개별 십성 나열보다 원국 내 조건 차이를 이해한다.",
    "risk": "연구에 격국 이름이 있다는 이유로 고객의 격국을 확정하지 않는다.",
    "twist": "구조 판단이 미상이어도 확정된 일간·간지 정보는 보존한다.",
    "distinction": "원국 구조 성립과 대운에서 변화했다는 주장은 별도다.",
    "requires": [
      "기존 구조 ID·성립/미성립/판정불가·참가자"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:reinforce",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "reinforce",
    "scope": "dayun",
    "meaning": "같은 의미를 다시 만나는 것과 힘이 실제로 강화되는 것을 구별한다.",
    "positive": "이미 연습한 판단을 다른 과제에도 적용해 볼 수 있다.",
    "risk": "동일 십성·오행만으로 두 배의 운이나 증거 수를 주장하지 않는다.",
    "twist": "잘하는 방식을 덜 쓰는 선택이 과용을 줄일 수 있다.",
    "distinction": "동일 root의 문장 변형은 새 근거가 아니다.",
    "requires": [
      "독립 원국·대운 사실과 실제 강화 조건"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:coexist",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "coexist",
    "scope": "dayun",
    "meaning": "다른 주제는 서로 상쇄하지 않고 각자의 조건에서 함께 존재할 수 있다.",
    "positive": "탐색과 안정처럼 병행할 수 있는 요구를 나눈다.",
    "risk": "다른 의미의 존재를 자동 갈등이나 음양 불균형으로 진단하지 않는다.",
    "twist": "두 목표의 담당 범위를 나누면 모순처럼 보이던 요구도 가능하다.",
    "distinction": "개념 공존과 실제 상충 관계는 다르다.",
    "requires": [
      "범위가 겹치는 서로 다른 사실·생활 맥락"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:tension",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "tension",
    "scope": "dayun",
    "meaning": "긴장은 실제 검출 관계와 조건부 행동 부담을 구별해 읽는다.",
    "positive": "바꿀 일정과 남길 기준을 먼저 협의할 수 있다.",
    "risk": "충·형을 사고·실패·질병으로 번역하지 않는다.",
    "twist": "조정 필요성이 기존 무리한 구조를 발견할 기회가 될 수 있다.",
    "distinction": "관계 검출은 사건 발생·강도·해소의 확정이 아니다.",
    "requires": [
      "관계 종류·참가자·원국 자리·유효 기간"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:choice",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "choice",
    "scope": "dayun",
    "meaning": "새 대운은 가능한 선택을 비교할 배경이지 강제 전환 명령이 아니다.",
    "positive": "되돌릴 수 있는 작은 선택으로 새 요구를 시험한다.",
    "risk": "교운 시각에 퇴사·결혼·투자를 실행해야 한다고 말하지 않는다.",
    "twist": "같은 일을 다른 책임 범위로 이어가는 것도 변화다.",
    "distinction": "기간 변경과 실제 기회 제공은 별도다.",
    "requires": [
      "이전/새 주기의 실제 간지·십성·전환 조건"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:continuity",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "continuity",
    "scope": "dayun",
    "meaning": "기간이 바뀌어도 유효한 원국 근거와 축적된 자원은 자동 소멸하지 않는다.",
    "positive": "남길 강점과 다시 검토할 적용 범위를 나눈다.",
    "risk": "오래 했다는 경험은 입력되지 않았으면 사실로 쓰지 않는다.",
    "twist": "멈추지 않고 유지하는 선택에도 비교할 정보가 있다.",
    "distinction": "지속 질문은 새 운세 사실로 세지 않는다.",
    "requires": [
      "이전·현재의 동일 root와 달라진 기간 사실"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:overuse",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "overuse",
    "scope": "dayun",
    "meaning": "장기 반복의 위험은 실제 행동과 자원의 한계를 확인할 때 설명 가능하다.",
    "positive": "강점을 계속 쓰기 위한 중단·위임 기준을 찾는다.",
    "risk": "10년간 같은 심리·과로가 지속됐다고 단정하지 않는다.",
    "twist": "강도의 감소가 장기적 재현성을 높일 수 있다.",
    "distinction": "과용 가능성과 과용 발생 사실은 다르다.",
    "requires": [
      "원국 주의 의미·기간 과제·현재 상태 확인"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:weak-basis",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "weak-basis",
    "scope": "dayun",
    "meaning": "직접 관계가 없으면 일반 십성 질문과 검증된 원국 설명을 구분해 제한한다.",
    "positive": "정보가 적은 부분을 드러내 독자의 오해를 줄인다.",
    "risk": "관계 미검출을 평온·불운 없음으로 설명하지 않는다.",
    "twist": "설명을 유보하는 것이 더 정확한 정보가 된다.",
    "distinction": "근거 부족과 부정 결과는 다르다.",
    "requires": [
      "있는 사실 목록·없는 관계 목록·판정 확정성"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:previous",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "previous",
    "scope": "dayun",
    "meaning": "이전 대운 비교는 두 기간의 계산값과 역할 차이를 보여주는 작업이다.",
    "positive": "같은 성향을 쓰는 조건이 어떻게 바뀌는지 비교한다.",
    "risk": "과거 사건을 복원하거나 후회를 유도하지 않는다.",
    "twist": "변화가 적으면 장기 기준의 지속을 솔직하게 분류한다.",
    "distinction": "기억한 경험이 없으면 회고 질문만 제시한다.",
    "requires": [
      "이전/현재 cycle ID·십성·기간"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:next",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "next",
    "scope": "dayun",
    "meaning": "다음 대운은 미래 조건의 연구 대상이며 현재 활성 대운과 바꾸어 말하지 않는다.",
    "positive": "현재 선택에서 다음에도 남길 자원을 검토한다.",
    "risk": "다음 십성 특징으로 원국 십성을 잘못 표시하지 않는다.",
    "twist": "다음 과제와 다른 현행 강점도 필요한 기반일 수 있다.",
    "distinction": "원국 설명은 타고난 조건, 다음 대운은 기간 조건이다.",
    "requires": [
      "다음 cycle ID·확정/범위 경계·원국 연결 지원"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  },
  {
    "id": "mfpr:cycle:context",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "topic": "context",
    "scope": "dayun",
    "meaning": "직업·관계 입력은 현재 장면의 조건이지 14년 생활 이력이 아니다.",
    "positive": "취업·휴식·자영업 등 상태가 달라져도 질문을 적용한다.",
    "risk": "현재 직업을 모든 과거·미래 연도의 사실로 전파하지 않는다.",
    "twist": "역할이 달라져도 동일 자원을 다른 방식으로 활용할 수 있다.",
    "distinction": "생활 사례와 명리 사실은 별도 출처다.",
    "requires": [
      "입력 시점·현행 상태·조건부 예시 구분"
    ],
    "counterconditions": [
      "필요한 사실 또는 유효 기간이 확인되지 않음"
    ],
    "domains": [
      "self",
      "work",
      "money",
      "learning",
      "social",
      "love_marriage",
      "family_life",
      "long_term_choice"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "noEventPrediction": true
  }
];
