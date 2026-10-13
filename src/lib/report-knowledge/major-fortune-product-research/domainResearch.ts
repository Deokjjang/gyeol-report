import type { Material } from "./researchTypes";

/** Independent offline research. No runtime registration or calculated evidence. */
export const MAJOR_DOMAIN_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:domain:self",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "self",
    "scope": "conditional_life_application",
    "meaning": "기본 성향과 기간 과제를 분리",
    "positive": "타고난 기준 중 지금 적용할 부분",
    "risk": "대운을 성격이 완전히 바뀌는 원인으로 해석",
    "twist": "같은 성향이 다른 선택에도 쓰일 수 있음",
    "condition": "평소 반응이 확인된다면 새 요구와 나란히 비교",
    "limitation": "개인 특성과 기간 사실을 독립 보존",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:work",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "work",
    "scope": "conditional_life_application",
    "meaning": "직함보다 책임과 선택 범위를 장기 비교",
    "positive": "권한·투입·마감 조건에 맞는 역할",
    "risk": "미래 취업·이직·승진 보장",
    "twist": "일을 줄여 핵심 책임을 유지하는 선택",
    "condition": "해당 시기에 업무가 있다면 맡을 범위를 확인",
    "limitation": "현재 직업이 14년 유지된다는 전제 제외",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:money",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "money",
    "scope": "conditional_life_application",
    "meaning": "돈의 크기 대신 자원의 유입·유지·회수",
    "positive": "기간별 비용·회수일·여유분 비교",
    "risk": "재성=이익·부·투자 수익 확정",
    "twist": "확장을 멈춰 자원을 보존할 선택",
    "condition": "거래나 지출 계획이 있다면 조건을 비교",
    "limitation": "실제 소득·부채·자산은 미입력 상태",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:learning",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "learning",
    "scope": "conditional_life_application",
    "meaning": "지식의 확보와 활용을 여러 해 비교",
    "positive": "학습 종료·적용·검토 기준",
    "risk": "인성=합격·학위·지원자 보장",
    "twist": "이미 아는 것을 쓰는 편이 새 공부보다 유효",
    "condition": "공부·기술 습득을 한다면 사용할 과제를 확인",
    "limitation": "학생 상태를 미래에도 유지한다고 전제하지 않음",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:social",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "social",
    "scope": "conditional_life_application",
    "meaning": "공동 약속과 개인 자원의 지속 가능성",
    "positive": "기여·책임·거절 범위를 조정",
    "risk": "합=좋은 인연·충=배신 단정",
    "twist": "관계 범위 축소가 신뢰를 유지",
    "condition": "협업·만남이 있다면 양쪽 요구를 확인",
    "limitation": "특정 상대의 생각·관계 기간 미상",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:love_marriage",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "love_marriage",
    "scope": "conditional_life_application",
    "meaning": "친밀함을 유지할 생활 조건의 장기 비교",
    "positive": "관계가 있다면 약속·생활·결정권 확인",
    "risk": "결혼·이별·임신·배우자 출현 예측",
    "twist": "혼인 여부와 무관하게 경계·돌봄 기준 활용",
    "condition": "해당 시기 실제 관계가 있을 때만 장면 적용",
    "limitation": "관계 상태·상대 정보 없는 궁합 해석 제외",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:family_life",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "family_life",
    "scope": "conditional_life_application",
    "meaning": "돌봄·생활 운영의 책임 범위",
    "positive": "현재 역할과 사용 가능한 지원 구별",
    "risk": "부모·자녀 사건·질병·거주 이동 단정",
    "twist": "위임으로 관계를 오래 유지할 가능성",
    "condition": "돌봄 책임이 있다면 담당·종료·회복 조건 확인",
    "limitation": "가족 구성과 미래 부담을 임의 생성하지 않음",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  },
  {
    "id": "mfpr:domain:long_term_choice",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "domain": "long_term_choice",
    "scope": "conditional_life_application",
    "meaning": "현재 자원을 다음 조건에서도 쓸 수 있는지",
    "positive": "되돌릴 수 있는 시도와 남길 기준",
    "risk": "교운 시각을 결정 실행일로 강제",
    "twist": "같은 선택을 유지하는 것도 비교의 결과",
    "condition": "장기 목표가 있다면 이전/새 배경의 요구 비교",
    "limitation": "10년·14년 뒤의 성취·직업을 결론으로 확정하지 않음",
    "requires": [
      "해당 시점의 actual period fact",
      "실제 생활 상태 또는 조건형 장면",
      "사용한 개인 근거와 시간 근거의 분리"
    ],
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:editorial"
    ],
    "verification": "conditional_editorial",
    "sceneIsCustomerHistory": false
  }
];
