import type { DomainApplication } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_DOMAINS = [
  {
    "id": "tr:domain:natal_dayun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "원래 익숙한 반응과 장기적으로 맡을 역할이 다를 때 어느 부분을 연습할까?",
    "positive": "기존 성향을 자원으로 남기고 새 역할의 연습량을 정한다.",
    "risk": "운간을 새 성격 검사 결과로 읽지 않는다.",
    "reversal": "다른 역할을 맡는 것이 본래 성향의 부정은 아닐 수 있다.",
    "action": "원국 반응·대운 역할·실제 연습을 각각 적는다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "기존 역량을 오래 쓸 환경과 새 대운 역할 사이에 어떤 업무 조건이 필요한가?",
    "positive": "장기적으로 재사용할 역량과 새로 배울 업무를 나눈다.",
    "risk": "편관 운을 위험한 직업, 정관 운을 취업 확정으로 읽지 않는다.",
    "reversal": "직종을 바꾸지 않고 역할만 바꿔도 적응할 수 있다.",
    "action": "직업명 대신 실제 업무·권한·지원 조건을 비교한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "원래의 자원 관리 방식과 장기적인 기회 탐색의 감당 한도가 맞는가?",
    "positive": "기반 자원과 탐색 자원을 분리해 여력을 확인한다.",
    "risk": "재성 운이 10년 부나 손실을 보장하지 않는다.",
    "reversal": "확장보다 한도를 지키는 선택이 기반을 남길 수 있다.",
    "action": "확정 자원·고정 비용·탐색 한도를 나눠 쓴다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "평소 배우는 방식이 장기 과제의 새 기능을 익히는 데 충분한가?",
    "positive": "기초 학습과 전환 학습의 순서를 구체화한다.",
    "risk": "인성 운을 학력·합격으로 치환하지 않는다.",
    "reversal": "더 배우기보다 이미 아는 것을 활용할 차례일 수 있다.",
    "action": "배울 역량과 실제 적용할 과제를 연결한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "익숙한 친밀감 표현을 오래 유지하면서 어떤 생활 경계를 다시 합의할까?",
    "positive": "반복되는 표현과 상대가 원하는 행동을 나눈다.",
    "risk": "원국-운 관계를 상대의 애정 변화로 단정하지 않는다.",
    "reversal": "다르게 표현해도 친밀감의 가치는 유지될 수 있다.",
    "action": "실제 상대의 말과 자신의 기대를 분리한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 생활 역할의 변화가 있다면 함께 맡을 책임을 어떻게 조정할까?",
    "positive": "실제 동거·돌봄·가사 조건을 합의할 기회를 검토한다.",
    "risk": "관성·재성 운으로 혼인 시기나 배우자를 지정하지 않는다.",
    "reversal": "결혼 여부보다 기존 공동 생활의 역할 조정이 먼저일 수 있다.",
    "action": "공동 책임과 개인 선택권을 별도로 합의한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "오래 맡아 온 가족 역할 가운데 유지할 것과 돌려줄 것은 무엇인가?",
    "positive": "지속 가능한 지원의 범위를 확인한다.",
    "risk": "원국 자리를 특정 가족의 사건으로 대입하지 않는다.",
    "reversal": "지원의 양을 줄여 관계를 지속할 수 있다.",
    "action": "실제 요청·가능 시간·다른 지원 통로를 나눈다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_dayun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "기존 대인 방식과 장기 역할이 만나는 자리에서 어떤 관계를 지속할까?",
    "positive": "연결의 수보다 유지할 접점과 경계를 찾는다.",
    "risk": "합을 평생 인연, 충을 인연 단절로 읽지 않는다.",
    "reversal": "덜 자주 만나도 필요한 관계가 남을 수 있다.",
    "action": "유지 이유와 실제 상호 기여를 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_dayun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 자극받는 원국의 반응과 실제 환경 요구를 구별할 수 있는가?",
    "positive": "자동 반응을 관찰하고 올해 선택 범위를 좁힌다.",
    "risk": "세운 요소를 타고난 인격으로 설명하지 않는다.",
    "reversal": "익숙한 반응을 쓰지 않는 선택도 가능하다.",
    "action": "반응이 나타난 실제 상황만 기록한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 연주가 닿는 기존 역량을 어떤 실제 과제에서 쓸 수 있는가?",
    "positive": "직업명이 아닌 수행 기능으로 연결한다.",
    "risk": "연간 십성만으로 승진·폐업을 확정하지 않는다.",
    "reversal": "새 일을 맡기보다 기존 과제의 수행 조건을 바꿀 수 있다.",
    "action": "확정 과제·평가 기준·추가 여력을 비교한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해의 가변 자원과 평소 관리 방식 사이에 어떤 확인이 필요한가?",
    "positive": "미확정 수입과 실제 확보한 자원을 분리한다.",
    "risk": "연지 합을 투자 이익이나 금전 사건으로 쓰지 않는다.",
    "reversal": "기회를 놓치는 비용보다 감당 못할 약속의 비용이 클 수 있다.",
    "action": "예상·확정·최대 감당 손실을 별도 칸에 둔다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 새 학습 요구가 기존 이해의 어느 공백을 드러내는가?",
    "positive": "전체 재학습보다 필요한 공백에 집중한다.",
    "risk": "인성 등장만으로 학습 성공을 보장하지 않는다.",
    "reversal": "낯선 과제는 다른 설명을 찾는 계기가 될 수 있다.",
    "action": "실제 틀린 문제와 모르는 개념을 연결한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해의 관계 해석과 상대의 확인된 행동은 어디서 다른가?",
    "positive": "추측을 질문으로 바꿀 조건을 검토한다.",
    "risk": "원진·해를 상대 악의의 근거로 쓰지 않는다.",
    "reversal": "판단 유예가 오해의 확대를 막을 수 있다.",
    "action": "들은 말·본 행동·내 추측을 구분한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 함께 결정할 일이 있다면 기존 책임 분담과 맞는가?",
    "positive": "공동 선택의 실제 조건을 점검한다.",
    "risk": "올해 일지 관계를 결혼·이혼 사건으로 확정하지 않는다.",
    "reversal": "결정 시기를 늦추는 것이 합의를 선명하게 할 수 있다.",
    "action": "의사·자원·책임이 확인된 항목부터 합의한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 가족의 실제 요청이 기존 역할에 무엇을 더 요구하는가?",
    "positive": "한 해 단위로 지원 가능한 범위를 정한다.",
    "risk": "연지·시지를 부모나 자녀의 사건 예언으로 쓰지 않는다.",
    "reversal": "지원 방식의 변경이 가족을 버리는 의미는 아니다.",
    "action": "당사자 요청과 내가 떠맡은 기대를 나눈다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_saeun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 새 접점과 기존 관계를 같은 기준으로 대하고 있는가?",
    "positive": "새 연결에 맞는 상호 기대를 확인한다.",
    "risk": "같은 지지라는 이유로 서로 다른 사람을 같은 인연으로 묶지 않는다.",
    "reversal": "새 관계를 늘리기보다 기존 접점을 정리할 수 있다.",
    "action": "각 관계의 실제 목적과 합의를 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "절입 전후 같은 상황에서 내 반응을 다르게 선택할 여지가 있는가?",
    "positive": "짧은 관찰 기간에서 바꿀 행동 하나를 정한다.",
    "risk": "월간지 변화가 성격을 바꿨다고 하지 않는다.",
    "reversal": "실제 변화가 없으면 변화 서사를 억지로 만들지 않는다.",
    "action": "경계 양쪽의 상황과 행동을 따로 기록한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 구간 원국 접점이 있는 과제에서 실행 방식을 무엇부터 시험할까?",
    "positive": "전체 경력을 바꾸기보다 작은 업무 단위를 수정한다.",
    "risk": "월운 충을 퇴사나 이직의 신호로 단정하지 않는다.",
    "reversal": "변경 대신 현재 배치가 유효한지 확인하는 시험도 가능하다.",
    "action": "실제 과제 하나와 확인할 결과를 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 절입 구간의 새 요구가 평소 자원 한도를 넘는가?",
    "positive": "짧은 기간에 쓸 시간·금액의 한도를 확인한다.",
    "risk": "월운 재성을 월별 수익률로 번역하지 않는다.",
    "reversal": "지출을 늦추는 것이 작은 실험의 여력을 남긴다.",
    "action": "확정 지출과 선택 지출을 구분한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 월주 기능을 확인할 작은 학습 산출은 무엇인가?",
    "positive": "배운 내용 한 가지를 실제 문제에 적용한다.",
    "risk": "월운 인성을 시험 결과로 확정하지 않는다.",
    "reversal": "더 읽기보다 잘못 이해한 부분을 확인할 수 있다.",
    "action": "복습 범위와 실제 산출 하나를 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 구간에 관계 해석을 확인할 구체적인 대화가 있는가?",
    "positive": "기분의 추측을 실제 질문과 행동으로 옮긴다.",
    "risk": "월운 관계를 만남·이별이 예정됐다는 뜻으로 쓰지 않는다.",
    "reversal": "상대가 답할 준비가 없다면 질문을 미룰 수 있다.",
    "action": "질문 의도와 상대 선택권을 함께 남긴다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 구간의 공동 생활 약속을 누가 언제 실행하는가?",
    "positive": "짧은 일정에서 분담의 실행 가능성을 확인한다.",
    "risk": "월운 합을 혼인 확정으로 승격하지 않는다.",
    "reversal": "분담을 줄이는 편이 실제 이행을 높일 수 있다.",
    "action": "당사자 동의가 있는 일정만 점검한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 구간 가족 지원에서 지금 가능한 행동은 무엇인가?",
    "positive": "작은 지원의 실제 범위를 정한다.",
    "risk": "시주 미상에 자녀 상황을 만들어 넣지 않는다.",
    "reversal": "직접 해결보다 정보나 다른 지원 연결이 적절할 수 있다.",
    "action": "요청 확인 뒤 가능한 시간 하나를 제시한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:natal_wolun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "이번 구간 접점에서 서로 다르게 이해한 약속이 있는가?",
    "positive": "한 번의 확인으로 작은 어긋남을 구별한다.",
    "risk": "해·원진 관계로 불화를 확정하지 않는다.",
    "reversal": "약속을 새로 만들기보다 불필요한 기대를 지울 수 있다.",
    "action": "사실 확인과 평가를 분리해 묻는다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:natal_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 역할과 올해 역할이 다를 때 내 성향으로 오해한 부담이 있는가?",
    "positive": "역할 간 조정과 개인 성향을 분리한다.",
    "risk": "서로 다른 십성을 이중 인격으로 표현하지 않는다.",
    "reversal": "두 역할을 나누면 충돌이 아니라 선택 자원이 될 수 있다.",
    "action": "장기 유지·올해 추가·내 반응을 분리한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "대운 역할을 유지하면서 올해 연간 과제의 책임을 누가 맡을까?",
    "positive": "장기 역량과 연간 평가를 연결한다.",
    "risk": "같은 십성 반복을 승진 확률 증가로 읽지 않는다.",
    "reversal": "같은 역할도 수행 조건을 바꾸면 부담을 줄일 수 있다.",
    "action": "장기 목표와 올해 평가 산출을 나눈다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 자원 기반에서 올해 새 제안에 배정할 여력은 얼마인가?",
    "positive": "기간별 자원의 규모와 확정성을 분리한다.",
    "risk": "편재·정재 조합을 자산 상승으로 확정하지 않는다.",
    "reversal": "새 제안을 줄여 장기 기반을 보호할 수 있다.",
    "action": "장기 고정 비용과 올해 탐색 비용을 비교한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기적으로 익힐 역량과 올해 필요한 지식을 어떻게 순서화할까?",
    "positive": "기초와 단기 과제의 관계를 명확히 한다.",
    "risk": "관인 조합을 합격 공식으로 쓰지 않는다.",
    "reversal": "올해 과제로 장기 학습의 공백을 발견할 수 있다.",
    "action": "지속 학습과 올해 적용 과제를 대응시킨다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 관계 기준과 올해의 실제 생활 요구를 함께 말할 수 있는가?",
    "positive": "기준과 일시적 요구를 구별해 협의한다.",
    "risk": "기간간 합·충을 상대 감정으로 대입하지 않는다.",
    "reversal": "올해 요구를 줄여 장기 약속을 유지할 수 있다.",
    "action": "함께 확인한 생활 요구만 논의한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 공동 계획에서 올해 실행 가능한 책임은 무엇인가?",
    "positive": "큰 약속을 연간 실행 조건으로 나눈다.",
    "risk": "두 기간의 관성을 혼인 예정의 증거로 중복 가산하지 않는다.",
    "reversal": "올해 보류할 부분을 정하면 장기 계획이 선명해질 수 있다.",
    "action": "자원·동의·일정의 확인 상태를 분리한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 가족 역할과 올해 추가 지원이 같은 사람에게 집중되는가?",
    "positive": "지속 지원과 일시 지원을 분담한다.",
    "risk": "두 기간의 긴장을 가족 사건으로 단정하지 않는다.",
    "reversal": "추가 지원을 다른 경로로 나누는 선택을 검토한다.",
    "action": "지속 역할과 연간 한시 요청을 구분한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_saeun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "오래 유지할 관계와 올해 새 접점에 같은 시간을 쓰고 있는가?",
    "positive": "관계별 목적에 맞는 자원을 배정한다.",
    "risk": "기간 쌍을 두 사람 사이의 궁합으로 바꾸지 않는다.",
    "reversal": "새 연결을 작게 시험해 장기 관계를 보호할 수 있다.",
    "action": "연간 접점의 종료·재검토 시점을 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_saeun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 역할의 부담과 이번 짧은 구간의 요구를 구별했는가?",
    "positive": "일시적 반응을 평생 성향으로 일반화하지 않는다.",
    "risk": "월운을 이유로 자기 능력 전체를 평가하지 않는다.",
    "reversal": "이번 조정이 장기 기준을 더 명확히 할 수 있다.",
    "action": "유지 기준 하나와 바꿀 행동 하나를 고른다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 업무 목표를 지키며 이번 구간의 배치를 어떻게 바꿀까?",
    "positive": "작은 배치 변경으로 유지 조건을 시험한다.",
    "risk": "교운 후보의 월운 충을 장기 실패로 쓰지 않는다.",
    "reversal": "일을 더 받기보다 순서를 바꾸는 편이 유효할 수 있다.",
    "action": "활성 대운 확정 구간에서 과제 순서를 비교한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 고정 비용에 이번 구간의 추가 지출이 얹힐 여력이 있는가?",
    "positive": "짧은 기간 예산을 장기 한도와 연결한다.",
    "risk": "월운 합을 투자 시점 보장으로 쓰지 않는다.",
    "reversal": "이번 지출을 보류해 장기 선택지를 남길 수 있다.",
    "action": "구간 종료 전 확정해야 할 지출만 표시한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "오래 배울 기능을 이번 구간의 어떤 작은 문제에서 시험할까?",
    "positive": "장기 학습을 작은 실행으로 검증한다.",
    "risk": "월간 십성을 역량 취득 완료로 해석하지 않는다.",
    "reversal": "잘 안 되는 부분의 확인도 유효한 결과다.",
    "action": "하나의 과제와 관찰 기준을 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "오래 유지할 관계 기준을 이번 구간 대화에서 어떻게 표현할까?",
    "positive": "일시 요구와 장기 약속을 구별한다.",
    "risk": "교운 범위의 두 후보를 두 번의 관계 위기로 쓰지 않는다.",
    "reversal": "지금 말하지 않을 부분을 정하는 것도 선택이다.",
    "action": "현재 확정된 요청에 한정해 대화한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "공동 생활의 장기 분담을 이번 일정에 실제로 적용할 수 있는가?",
    "positive": "큰 분담을 짧은 일정에서 점검한다.",
    "risk": "월운으로 장기 혼인 결과를 판정하지 않는다.",
    "reversal": "작은 재분담이 큰 계획을 보존할 수 있다.",
    "action": "일정별 책임자와 지원 가능 시간을 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "오래 맡는 가족 지원과 이번 구간의 추가 요청을 나눴는가?",
    "positive": "한시 지원을 장기 의무로 굳히지 않는다.",
    "risk": "월운을 가족의 건강·사고로 번역하지 않는다.",
    "reversal": "다른 사람의 도움을 연결해 지속성을 남길 수 있다.",
    "action": "한시 지원의 종료 조건을 합의한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:dayun_wolun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "장기 관계 원칙과 이번 구간의 모임·협의가 맞는가?",
    "positive": "짧은 접점의 역할을 분명히 한다.",
    "risk": "월운 관계를 사람의 성품 판정으로 쓰지 않는다.",
    "reversal": "만남 횟수를 줄여도 필요한 협의는 유지될 수 있다.",
    "action": "실제 목적과 필요한 참여자만 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:dayun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:personality",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "personality",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 방향을 이번 구간에 옮기며 어떤 반응을 관찰할까?",
    "positive": "연간 방향을 작은 행동으로 확인한다.",
    "risk": "월별 기분을 연간 성격의 증명으로 쓰지 않는다.",
    "reversal": "월간 반응이 달라도 연간 목표를 바로 포기할 필요는 없다.",
    "action": "실효 연주가 같은 구간에서 행동을 비교한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:career",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "career",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 과제의 이번 구간 산출과 승인 조건은 무엇인가?",
    "positive": "연간 목표를 실제 짧은 납품 단위로 나눈다.",
    "risk": "월운 합·충을 계약 성사·실패로 단정하지 않는다.",
    "reversal": "산출 크기를 줄이면 품질 확인이 쉬워질 수 있다.",
    "action": "구간별 산출·마감·승인을 나눈다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:money",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "money",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 자원 목표에서 이번 구간에 확정된 부분은 얼마인가?",
    "positive": "예상과 실제 확보의 차이를 짧게 확인한다.",
    "risk": "연월 재성을 수익률 예측으로 쓰지 않는다.",
    "reversal": "확보가 늦어지면 지출 순서를 바꿀 수 있다.",
    "action": "기간별 확정 자원과 지출 시점을 대응시킨다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:study",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "study",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 학습 목표의 어떤 기능을 이번 구간에 확인할까?",
    "positive": "연간 범위를 작은 검증 과제로 나눈다.",
    "risk": "연월 인성의 반복을 합격 확률로 더하지 않는다.",
    "reversal": "복습이 새 진도보다 필요한 구간일 수 있다.",
    "action": "과제 하나와 피드백 시점을 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:love",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "love",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 원하는 관계 방식이 이번 구간 실제 대화와 맞는가?",
    "positive": "연간 기대를 상대가 확인할 행동으로 표현한다.",
    "risk": "월주와 연주 관계를 상대 마음의 변화로 읽지 않는다.",
    "reversal": "기대를 줄이면 실제 합의가 더 선명해질 수 있다.",
    "action": "상대가 동의한 작은 행동만 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:marriage",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "marriage",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 공동 계획에서 이번 구간에 함께 결정할 것은 무엇인가?",
    "positive": "공동 계획의 실행 순서를 구체화한다.",
    "risk": "연월 합을 혼인·임신으로 예언하지 않는다.",
    "reversal": "결정을 나누면 부담을 줄이고 선택권을 남길 수 있다.",
    "action": "입춘 경계 양쪽을 같은 연간 근거로 묶지 않는다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:family",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "family",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 가족 지원 계획의 이번 구간 분담이 가능한가?",
    "positive": "일정과 실제 가용 자원을 맞춘다.",
    "risk": "연월 관계로 가족 사건을 꾸며내지 않는다.",
    "reversal": "한시적인 외부 지원이 계획을 유지할 수 있다.",
    "action": "당사자의 요청과 실제 가능한 시간을 확인한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  },
  {
    "id": "tr:domain:saeun_wolun:relationships",
    "class": "D",
    "sourceRefs": [
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "domain": "relationships",
    "condition": "이 질문과 관련된 실제 생활 장면이 있고 당사자의 정보·의사가 확인된 경우에만 검토한다.",
    "question": "올해 연결할 관계에서 이번 구간에 필요한 확인은 무엇인가?",
    "positive": "연간 목적에 맞는 접점을 작게 만든다.",
    "risk": "연월 쌍을 사람 간 궁합으로 옮기지 않는다.",
    "reversal": "새 연결보다 기존 약속 확인이 필요할 수 있다.",
    "action": "접점의 목적과 재검토 시각을 정한다.",
    "doNotInfer": "일반적인 생활 질문을 개인 운세의 확정 결과나 발생한 과거 사건으로 승격하지 않는다.",
    "evidenceRequired": [
      "tr:scope:saeun_wolun",
      "참가자 소유자·기준 일간·적용 구간",
      "실제 분야 맥락과 자원·동의"
    ]
  }
] as const satisfies readonly DomainApplication[];
