import type { ElementCombination } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_ELEMENT_COMBINATIONS = [
  {
    "id": "tr:element:WOOD:WOOD",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WOOD → WOOD",
    "meaning": "같은 목이 겹칠 때 새 확장과 기존 확장의 실제 자원 경쟁을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WOOD",
    "right": "WOOD",
    "direction": "same",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WOOD:FIRE",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WOOD → FIRE",
    "meaning": "목에서 화로 이어지는 산출이 준비 자원을 소모하는 속도를 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WOOD",
    "right": "FIRE",
    "direction": "generates",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WOOD:EARTH",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WOOD → EARTH",
    "meaning": "목극토의 제어 관계와 토 자원을 실제로 감당할 여력을 따로 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WOOD",
    "right": "EARTH",
    "direction": "controls",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WOOD:METAL",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WOOD → METAL",
    "meaning": "금극목에서 기준·정리가 확장 방향을 제한하는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WOOD",
    "right": "METAL",
    "direction": "controlled_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WOOD:WATER",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WOOD → WATER",
    "meaning": "수생목의 공급이 실제로 이용 가능한 도움인지 축적만 되는지 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WOOD",
    "right": "WATER",
    "direction": "generated_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:FIRE:WOOD",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "FIRE → WOOD",
    "meaning": "목생화에서 기반의 공급과 밖으로 드러나는 활동의 속도를 비교한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "FIRE",
    "right": "WOOD",
    "direction": "generated_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:FIRE:FIRE",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "FIRE → FIRE",
    "meaning": "같은 화의 반복은 표현 기회의 증가와 소진 조건을 함께 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "FIRE",
    "right": "FIRE",
    "direction": "same",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:FIRE:EARTH",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "FIRE → EARTH",
    "meaning": "화생토에서 표현 뒤의 결과를 유지할 운영 기반이 있는지 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "FIRE",
    "right": "EARTH",
    "direction": "generates",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:FIRE:METAL",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "FIRE → METAL",
    "meaning": "화극금은 기준을 바꾸려는 활동과 필요한 규율의 보존을 나눠 본다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "FIRE",
    "right": "METAL",
    "direction": "controls",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:FIRE:WATER",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "FIRE → WATER",
    "meaning": "수극화에서 제약이 표현을 막는지 속도를 조절하는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "FIRE",
    "right": "WATER",
    "direction": "controlled_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:EARTH:WOOD",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "EARTH → WOOD",
    "meaning": "목극토에서 기존 기반을 조정할 요구와 보존할 기능을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "EARTH",
    "right": "WOOD",
    "direction": "controlled_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:EARTH:FIRE",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "EARTH → FIRE",
    "meaning": "화생토에서 들어오는 활동이 실제 유지 자원이 되는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "EARTH",
    "right": "FIRE",
    "direction": "generated_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:EARTH:EARTH",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "EARTH → EARTH",
    "meaning": "같은 토의 반복은 기반의 안정과 변화가 막히는 비용을 나눠 본다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "EARTH",
    "right": "EARTH",
    "direction": "same",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:EARTH:METAL",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "EARTH → METAL",
    "meaning": "토생금에서 축적 자원을 기준·도구로 옮기는 비용을 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "EARTH",
    "right": "METAL",
    "direction": "generates",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:EARTH:WATER",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "EARTH → WATER",
    "meaning": "토극수에서 유동 자원을 묶는 관리와 필요한 흐름의 방해를 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "EARTH",
    "right": "WATER",
    "direction": "controls",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:METAL:WOOD",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "METAL → WOOD",
    "meaning": "금극목에서 정리가 확장의 낭비를 줄이는지 가능성을 없애는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "METAL",
    "right": "WOOD",
    "direction": "controls",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:METAL:FIRE",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "METAL → FIRE",
    "meaning": "화극금에서 새 활동의 요구에 맞춰 기준을 수정할 여력을 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "METAL",
    "right": "FIRE",
    "direction": "controlled_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:METAL:EARTH",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "METAL → EARTH",
    "meaning": "토생금에서 기반 자원이 실제 판단 도구로 이어지는 조건을 검토한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "METAL",
    "right": "EARTH",
    "direction": "generated_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:METAL:METAL",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "METAL → METAL",
    "meaning": "같은 금의 반복은 정밀한 기준과 지나친 선별의 차이를 점검한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "METAL",
    "right": "METAL",
    "direction": "same",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:METAL:WATER",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "METAL → WATER",
    "meaning": "금생수에서 정리한 지식·도구를 순환시키는 통로를 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "METAL",
    "right": "WATER",
    "direction": "generates",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WATER:WOOD",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WATER → WOOD",
    "meaning": "수생목에서 정보·공급을 실제 확장으로 옮길 기반을 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WATER",
    "right": "WOOD",
    "direction": "generates",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WATER:FIRE",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WATER → FIRE",
    "meaning": "수극화에서 흐름의 조절이 필요한 표현을 끊지 않는지 살핀다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WATER",
    "right": "FIRE",
    "direction": "controls",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WATER:EARTH",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WATER → EARTH",
    "meaning": "토극수에서 관리 조건과 유동성을 잃는 비용을 비교한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WATER",
    "right": "EARTH",
    "direction": "controlled_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WATER:METAL",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WATER → METAL",
    "meaning": "금생수에서 기준이 정보의 질을 높이는지 탐색만 늘리는지 확인한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WATER",
    "right": "METAL",
    "direction": "generated_by",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:element:WATER:WATER",
    "class": "C",
    "sourceRefs": [
      "repo-elements",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "WATER → WATER",
    "meaning": "같은 수의 반복은 탐색 범위와 결정을 미루는 조건을 구별한다. 이는 현대적 기능 비유를 포함한 조건부 비교이며 오행 자체의 사건 효과를 뜻하지 않는다.",
    "positive": "필요한 기능이 실제 자원과 연결될 때 보완 가능성을 검토한다.",
    "risk": "상생이면 좋고 상극이면 나쁘다는 단순 판정은 하지 않는다.",
    "reversal": "과잉 공급이면 생조가 부담이 되고 필요한 통제이면 극이 조정 자원이 될 수 있다.",
    "distinction": "왼쪽과 오른쪽의 기간 소유자를 뒤집으면 생성·제어 방향도 뒤집힌다.",
    "requires": [
      "실제 간·지 본기 오행",
      "양쪽 소유자와 적용 구간",
      "월령·통근·배합의 별도 근거",
      "현실 자원의 조건"
    ],
    "excludes": [
      "개수만으로 신강·신약 확정",
      "부족 오행 유입을 자동 호전으로 표현",
      "건강·재물 성공 확정"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "left": "WATER",
    "right": "WATER",
    "direction": "same",
    "strengthCalculated": false,
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  }
] as const satisfies readonly ElementCombination[];
