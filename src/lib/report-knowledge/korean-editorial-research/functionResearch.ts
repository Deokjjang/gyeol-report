import type { FunctionStudy } from "./researchTypes";

/** Offline research only; not imported by runtime or existing barrels. */
export const KOREAN_EDITORIAL_FUNCTIONS: readonly FunctionStudy[] = [
  {
    "id": "ker:function:opening",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "opening",
    "purpose": "독자가 확인할 질문을 연다",
    "inputs": [
      "승인된 관심 주제",
      "앞서 소개한 조건"
    ],
    "structure": "관찰 가능한 질문 → 읽을 범위",
    "suitable": "첫 문단에서 범위를 알릴 때",
    "unsuitable": "확인 안 된 독자의 고민을 안다고 할 때",
    "good": "검토할 때 무엇을 확인해야 결정이 쉬워질까요?",
    "bad": "당신은 늘 결정을 못 내려 괴로웠죠.",
    "grammar": "질문이 과거 사실을 전제하지 않음",
    "preservation": "관심을 묻되 새 성향을 부여하지 않음",
    "evidenceLevel": "질문 근거 또는 이미 승인된 claim",
    "distinction": "설명과 달리 답을 아직 주장하지 않음",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:explanation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "explanation",
    "purpose": "해석의 대상과 조건을 풀어 쓴다",
    "inputs": [
      "승인 claim",
      "정의",
      "적용 조건"
    ],
    "structure": "개념 → 쉬운 뜻 → 조건의 경계",
    "suitable": "전문 용어를 처음 설명할 때",
    "unsuitable": "쉬운 말이라는 이유로 정의를 바꿀 때",
    "good": "검토를 중시한다는 설명은, 결정 전에 판단할 이유를 확인하려는 면을 가리킵니다.",
    "bad": "생각이 많으니 의지가 약한 사람입니다.",
    "grammar": "명사 정의와 인과 서술 구분",
    "preservation": "의지·건강·성공으로 의미 확장 금지",
    "evidenceLevel": "원래 정의와 승인된 적용",
    "distinction": "장면과 달리 하나의 개념을 설명",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:concretization",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "concretization",
    "purpose": "추상적인 뜻을 확인 가능한 행동 단위로 좁힌다",
    "inputs": [
      "claim",
      "허용 행동 범위"
    ],
    "structure": "추상 뜻 → 관찰할 행동 → 확인 질문",
    "suitable": "무엇을 본다는 뜻인지 불명확할 때",
    "unsuitable": "행동을 실제 이력으로 바꿀 때",
    "good": "검토가 필요하다면, 비교할 항목을 정했는지와 언제 결론을 낼지를 함께 볼 수 있습니다.",
    "bad": "지난 회의에서도 답을 미뤄 모두가 기다렸습니다.",
    "grammar": "행동 주체와 조건절 유지",
    "preservation": "구체화는 사실의 추가가 아닌 예시임",
    "evidenceLevel": "행동과 claim의 연결 검토",
    "distinction": "생활 장면보다 행동의 최소 단위를 명시",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "positive",
    "purpose": "특성이 유용해지는 조건을 밝힌다",
    "inputs": [
      "장점 claim",
      "필요 자원",
      "상황"
    ],
    "structure": "특성 → 유용한 조건 → 가능한 기여",
    "suitable": "그 특성에 맞는 과제가 있을 때",
    "unsuitable": "다른 사람보다 우월하다고 할 때",
    "good": "확인할 기준이 분명하다면, 꼼꼼한 검토는 놓친 오류를 찾는 데 도움이 될 수 있습니다.",
    "bad": "당신의 완벽함은 언제나 성공을 만듭니다.",
    "grammar": "조건형을 결과 확정형으로 변환하지 않음",
    "preservation": "장점의 범위와 가능성 유지",
    "evidenceLevel": "실제 개인 근거와 적용 조건",
    "distinction": "칭찬이 아니라 유용성을 설명",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:risk",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "risk",
    "purpose": "과용이나 불일치의 비용을 설명한다",
    "inputs": [
      "같은 특성",
      "과용 조건",
      "검증된 위험"
    ],
    "structure": "유효한 특성 → 맞지 않는 조건 → 부담",
    "suitable": "기준·자원·권한이 어긋날 때",
    "unsuitable": "아무 장점 뒤에 일반 단점을 붙일 때",
    "good": "확인 기준이 정해지지 않으면, 검토를 늘리고도 결정을 내리기 어려울 수 있습니다.",
    "bad": "꼼꼼한 사람은 결국 모두 기회를 놓칩니다.",
    "grammar": "조건절과 결과절의 주체 일치",
    "preservation": "가능 비용을 필연 손실로 바꾸지 않음",
    "evidenceLevel": "위험 자체의 별도 승인 필요",
    "distinction": "팩폭과 달리 부담 경로를 차분히 설명",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:blunt",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "blunt",
    "purpose": "해석 근거가 있는 취약점을 짧고 분명하게 말한다",
    "inputs": [
      "위험 claim",
      "발생 조건",
      "주체"
    ],
    "structure": "조건 → 회피하기 어려운 행동 비용",
    "suitable": "완곡한 말이 핵심을 흐릴 때",
    "unsuitable": "비난·진단·속마음 추정",
    "good": "기준 없이 확인만 늘린다면, 꼼꼼함이 아니라 결정을 미루는 시간이 될 수 있습니다.",
    "bad": "겁이 많아서 아무것도 못 하는 사람이네요.",
    "grammar": "성격 낙인 대신 행동과 조건을 서술",
    "preservation": "의도·병리·인격 결함을 추가하지 않음",
    "evidenceLevel": "개인 위험 근거가 없으면 보류",
    "distinction": "위험 설명보다 직설적이되 의미 강도는 같음",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:twist",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "twist",
    "purpose": "같은 특성을 보는 유효한 관점을 바꾼다",
    "inputs": [
      "앞선 claim",
      "다른 승인 관점"
    ],
    "structure": "기존 이해 → 다른 비용/쓸모 → 조건",
    "suitable": "독자가 이미 뜻을 이해한 뒤",
    "unsuitable": "의외의 성격을 새로 만들어 놀라게 할 때",
    "good": "신중함을 버릴 필요는 없습니다. 무엇을 확인할지 정하면 그 신중함을 결정에도 쓸 수 있습니다.",
    "bad": "사실 당신은 누구보다 대담한 승부사입니다.",
    "grammar": "양극 축의 반대 성격 자동 생성 금지",
    "preservation": "관점 전환과 새 사실을 구분",
    "evidenceLevel": "반전 관점도 승인 의미 안에 있어야 함",
    "distinction": "일반적인 균형 조언이 아니라 재해석",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:comparison",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "comparison",
    "purpose": "두 조건의 공통점과 다른 기준을 나눈다",
    "inputs": [
      "양쪽 승인 claim",
      "같은 비교 축"
    ],
    "structure": "공통 기준 → 실제 차이 → 비교 한계",
    "suitable": "두 상황/두 사람을 나란히 볼 때",
    "unsuitable": "한쪽 강점으로 다른 쪽 결함 확정",
    "good": "혼자 검토하는 시간과 함께 결론을 정하는 시간은 구분할 수 있습니다.",
    "bad": "검토하는 A와 달리 B는 생각 없이 행동합니다.",
    "grammar": "생략된 주어·비교 기준을 복원",
    "preservation": "비교하지 않은 우열·차이를 만들지 않음",
    "evidenceLevel": "두 대상 각각의 근거",
    "distinction": "Fusion과 달리 연결 효과를 주장하지 않음",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:fusion",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "fusion",
    "purpose": "서로 다른 근거의 공통·보완·긴장을 전달한다",
    "inputs": [
      "동일 owner의 승인 Fusion",
      "양쪽 root"
    ],
    "structure": "각 근거 역할 → 승인 연결 → 적용 조건",
    "suitable": "실제 Fusion 연결이 승인된 경우",
    "unsuitable": "MBTI만으로 월운이나 새 인과를 계산",
    "good": "두 근거가 같은 판단 방향을 가리킨다면, 어느 상황에서 그 반응이 나타나는지 함께 살펴볼 수 있습니다.",
    "bad": "MBTI가 강하니 다음 달 재물운도 두 배입니다.",
    "grammar": "참조자·강도·부정 방향 보존",
    "preservation": "보완=반대 성격, 약함=결함으로 바꾸지 않음",
    "evidenceLevel": "실제 동일인 Fusion 및 양쪽 원천",
    "distinction": "단순 병렬 비교와 승인 연결 구분",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:scene",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "scene",
    "purpose": "가상 상황으로 의미를 이해하게 한다",
    "inputs": [
      "승인 claim",
      "상황 자격",
      "가상 표시"
    ],
    "structure": "가상 도입 → 선택 순간 → claim과 연결",
    "suitable": "생활 적용이 필요한 대목",
    "unsuitable": "미입력 경험을 회상시킬 때",
    "good": "가령 자료를 검토하는 상황이라면, 확인할 항목과 제출 시점을 따로 적어볼 수 있습니다.",
    "bad": "지난번 제출을 늦춘 뒤 후회한 경험이 있죠.",
    "grammar": "가상 도입과 시제 유지",
    "preservation": "장면은 고객 이력/새 Evidence가 아님",
    "evidenceLevel": "실제 상태가 없으면 조건부로만 제시",
    "distinction": "구체화보다 인물·상황·선택 순간이 있음",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:action",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "action",
    "purpose": "검토 가능한 선택과 종료 기준을 제안한다",
    "inputs": [
      "승인 적용",
      "실제 권한",
      "가능 자원"
    ],
    "structure": "할 일 → 범위 → 확인/종료 조건",
    "suitable": "독자가 선택할 수 있는 행동일 때",
    "unsuitable": "투자·건강·법적 결과를 보장",
    "good": "이번 검토에서 꼭 확인할 두 항목과 결론을 낼 시점을 먼저 정해보세요.",
    "bad": "당장 계약하면 반드시 수익이 납니다.",
    "grammar": "명령의 대상·책임 범위를 분명히 함",
    "preservation": "조언도 원래 의미/상황 범위 안에 둠",
    "evidenceLevel": "행동 관련 원천과 현실 조건",
    "distinction": "장면의 묘사와 실제 제안 분리",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:transition",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "transition",
    "purpose": "앞선 정보와 다음 질문의 관계를 드러낸다",
    "inputs": [
      "실제 앞/뒤 claim",
      "논리 관계"
    ],
    "structure": "앞선 핵심 → 전환 이유 → 다음 질문",
    "suitable": "관점·기간·대상을 바꿀 때",
    "unsuitable": "그런데/그래서로 없는 인과를 만들 때",
    "good": "확인할 기준을 봤다면, 이제 그 기준을 언제 결정에 쓸지 살펴볼 차례입니다.",
    "bad": "그래서 내년에는 반드시 합격합니다.",
    "grammar": "접속어가 나타내는 논리 검증",
    "preservation": "후행 사실은 후행 근거에서만 옴",
    "evidenceLevel": "양쪽 의미와 연결 자격",
    "distinction": "새 정의를 늘리는 대신 독서 방향 표시",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:summary",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "summary",
    "purpose": "이미 설명한 의미를 정확히 회수한다",
    "inputs": [
      "introduced 의미",
      "범위",
      "근거"
    ],
    "structure": "핵심 조건 → 핵심 뜻 → 적용 경계",
    "suitable": "장/구간을 정리할 때",
    "unsuitable": "소개하지 않은 특징을 결론에 추가",
    "good": "검토의 쓸모는 확인 기준이 분명할 때 살아나고, 그 기준이 없으면 결정이 늦어질 수 있다는 점입니다.",
    "bad": "정리하면 당신은 타고난 리더이자 재물복의 주인공입니다.",
    "grammar": "조건·부정·대상 생략 금지",
    "preservation": "짧아져도 의미 범위는 유지",
    "evidenceLevel": "실제 introduced ledger 필요",
    "distinction": "마무리보다 의미의 정확한 압축에 집중",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  },
  {
    "id": "ker:function:closing",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "function": "closing",
    "purpose": "앞선 이해를 기억할 질문으로 남긴다",
    "inputs": [
      "소개된 claim",
      "독자 선택권"
    ],
    "structure": "앞선 이해 → 남길 기준/질문",
    "suitable": "Book/챕터의 끝",
    "unsuitable": "미소개 운세·성격·감성으로 채울 때",
    "good": "충분히 살펴본 뒤에는, 무엇을 확인하면 내 결정을 믿을 수 있을지 남겨보세요.",
    "bad": "이제 온 우주가 당신의 성공을 약속합니다.",
    "grammar": "미래 보장 대신 독자의 선택을 남김",
    "preservation": "마지막 문장은 새 분석의 장소가 아님",
    "evidenceLevel": "앞서 설명된 의미만 회수",
    "distinction": "요약과 달리 읽기 후 남길 질문의 역할",
    "sourceRefs": [
      "ker:source:editorial",
      "ker:source:runtime"
    ]
  }
];
