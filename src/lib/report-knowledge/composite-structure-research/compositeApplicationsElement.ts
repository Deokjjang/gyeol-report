import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_ELEMENT = [
  {
    "id": "csr:application:toda_maegeum:personality",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "도움이 판단 공간을 덮고 있나요?",
    "core": "지원량과 수혜자의 작용 공간",
    "positive": "필요한 기반만 남김",
    "risk": "보호가 선택을 지연",
    "excess": "안정 추구가 승인 과잉으로 변질",
    "unexpected": "지원 축소가 자립을 돕기도 함",
    "conditionalScene": "확인 절차가 많다면 목적별 분류",
    "action": "결정에 필요한 자료만 추리기",
    "additionalEvidence": "실제 지원·판단 과정",
    "contrast": "인성다자는 일간 상대, 여기서는 토→금",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:career",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "절차가 핵심 기능을 돕나요?",
    "core": "기반의 두께와 실무의 쓰임",
    "positive": "지원 업무를 실제 산출에 맞춤",
    "risk": "보고 때문에 실행이 가려짐",
    "excess": "안정된 운영이 문서량 증가로 변질",
    "unexpected": "절차를 덜어 품질을 높일 수 있음",
    "conditionalScene": "승인이 반복되면 필요한 검토만 확인",
    "action": "한 절차의 효과를 시범 비교",
    "additionalEvidence": "실제 업무·절차",
    "contrast": "화금 후보의 교정 강도와 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:money",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "자원을 보유하느라 쓰지 못하나요?",
    "core": "기반 유지와 자원 사용 공간",
    "positive": "필요한 유지비만 선택",
    "risk": "보호 비용이 사용 여력을 잠식",
    "excess": "안정이 유동성 상실로 변질",
    "unexpected": "덜 보유하는 것이 선택지를 늘림",
    "conditionalScene": "고정비가 크면 실제 사용량 확인",
    "action": "유지비와 효용을 함께 점검",
    "additionalEvidence": "실제 자산·유동성",
    "contrast": "토의 양은 부동산 보유를 뜻하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:study",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "자료가 풀이를 가리고 있나요?",
    "core": "학습 기반과 핵심 적용",
    "positive": "필요한 설명만 선별",
    "risk": "보조 자료가 문제 해결을 지연",
    "excess": "완벽한 기반을 기다리며 시작 지연",
    "unexpected": "단순한 예제가 이해를 드러낼 수 있음",
    "conditionalScene": "자료가 쌓이면 한 문제부터 풀기",
    "action": "사용한 근거만 표시",
    "additionalEvidence": "실제 과목·자료",
    "contrast": "인성다자와 공유 주제지만 상대 오행 전제가 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:love",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "챙김이 상대의 선택을 덮나요?",
    "core": "보호와 자율의 배합",
    "positive": "원하는 도움만 제공",
    "risk": "배려가 결정권을 대신함",
    "excess": "안전 확인이 관계 통제로 변질",
    "unexpected": "덜 챙기는 것이 존중일 수 있음",
    "conditionalScene": "상대를 도우려면 원하는 범위 질문",
    "action": "도움 뒤 선택권을 남기기",
    "additionalEvidence": "실제 교제·동의",
    "contrast": "물상을 고정된 보호자 성격으로 취급하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:marriage",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "안정 장치가 생활을 답답하게 하나요?",
    "core": "공동 기반과 개인 기능",
    "positive": "필수 안전·절차를 선별",
    "risk": "모든 생활을 규칙으로 덮음",
    "excess": "안정 추구가 작은 변화도 막음",
    "unexpected": "규칙 축소가 공동 자율성을 늘림",
    "conditionalScene": "생활 규칙이 많으면 쓰는 항목 확인",
    "action": "효과 없는 확인 절차 재합의",
    "additionalEvidence": "실제 공동생활·규칙",
    "contrast": "관성 우세의 규범과 명리 전제가 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:family",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "보호받는 사람이 결정할 수 있나요?",
    "core": "가족 지원과 당사자 역할",
    "positive": "필요한 기반만 지원",
    "risk": "지원자가 모든 선택을 대행",
    "excess": "걱정이 독립 기회를 막음",
    "unexpected": "직접 결정할 공간이 지원 효과를 높임",
    "conditionalScene": "가족을 돕는다면 선택 주체 확인",
    "action": "지원과 결정 담당을 분리",
    "additionalEvidence": "실제 가족 지원·동의",
    "contrast": "가족 보호 경험은 토금에서 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:toda_maegeum:relationships",
    "targetId": "foundation:structure:toda_maegeum",
    "profileRef": "csr:profile:toda_maegeum",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "toda_maegeum:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:toda_maegeum#inference",
    "formationRef": "csr:profile:toda_maegeum#formation",
    "readerQuestion": "집단 지원이 개인 역할을 가리나요?",
    "core": "지원 조직과 실제 참여",
    "positive": "담당자의 판단 공간 확보",
    "risk": "회의·승인이 참여를 대체",
    "excess": "안정 운영이 관성적 절차 유지",
    "unexpected": "작은 재량이 참여를 늘릴 수 있음",
    "conditionalScene": "단체 절차가 많으면 참여자 의견 확인",
    "action": "한 결정을 담당자에게 명확히 맡기기",
    "additionalEvidence": "실제 집단·권한",
    "contrast": "비겁의 동료 배분과 다른 생조 과용 물상",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:personality",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "기준이 성장 단계에 맞나요?",
    "core": "제어 강도와 대상의 여력",
    "positive": "수정할 부분을 단계로 나눔",
    "risk": "초기 시도를 완성 기준으로 평가",
    "excess": "정확함이 시행착오 금지로 변질",
    "unexpected": "감당 가능한 기준은 방향을 돕기도 함",
    "conditionalScene": "새 시도라면 필요한 최소 기준 확인",
    "action": "단계별 성공 기준 정하기",
    "additionalEvidence": "실제 시도·평가",
    "contrast": "금극목 자체가 손상을 뜻하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:career",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "교정이 실무를 성장시키나요?",
    "core": "검토 강도와 숙련 기반",
    "positive": "필수 품질부터 단계적으로 적용",
    "risk": "초보에게 모든 기준 동시 요구",
    "excess": "검수가 생산 중단으로 변질",
    "unexpected": "분명한 제한이 학습 경로가 될 수 있음",
    "conditionalScene": "신규 업무라면 숙련도와 검토량 대조",
    "action": "필수 오류와 개선 제안 구분",
    "additionalEvidence": "실제 직무·숙련",
    "contrast": "화금은 교정 대상이 금으로 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:money",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "비용 기준이 필요한 시도를 막나요?",
    "core": "자원 제어와 발전 단계",
    "positive": "감당할 시험 비용을 정함",
    "risk": "초기부터 즉시 수익 요구",
    "excess": "절약이 필요한 투자까지 삭제",
    "unexpected": "한정된 시험비가 위험을 줄임",
    "conditionalScene": "새 사업안이면 작은 검증 비용 합의",
    "action": "중단 기준과 학습 결과 같이 기록",
    "additionalEvidence": "실제 예산·사업 입력",
    "contrast": "재성의 부·성공을 오행 배합으로 만들지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:study",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "오답 교정이 이해를 돕나요?",
    "core": "평가량과 학습 여력",
    "positive": "핵심 오류부터 수정",
    "risk": "모든 실수를 같은 강도로 질책",
    "excess": "정확성 집착이 질문 회피를 만듦",
    "unexpected": "적절한 제약이 풀이를 명료하게 함",
    "conditionalScene": "오답이 많다면 원인 하나만 분리",
    "action": "숙련 단계별 과제 선택",
    "additionalEvidence": "실제 학습·피드백",
    "contrast": "상관견관은 출력→정관이며 다른 전제",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:love",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "조언이 상대의 시도를 막나요?",
    "core": "교정과 관계의 자율성",
    "positive": "요청된 부분만 조언",
    "risk": "걱정으로 상대 선택을 제한",
    "excess": "정확한 말이 상시 평가로 변질",
    "unexpected": "명확한 경계가 존중을 돕기도 함",
    "conditionalScene": "조언하려면 원하는 도움인지 질문",
    "action": "평가와 요청을 나누기",
    "additionalEvidence": "실제 교제·동의",
    "contrast": "엄격한 연인 성격을 물상으로 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:marriage",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "생활 기준이 현실 여력에 맞나요?",
    "core": "공동 기준과 각자의 단계",
    "positive": "필수 기준을 함께 선택",
    "risk": "한 사람의 완성도를 모두에게 적용",
    "excess": "질서가 작은 실수의 처벌로 변질",
    "unexpected": "수준별 역할이 실질 분담을 돕기도 함",
    "conditionalScene": "가사를 새로 맡으면 과정부터 공유",
    "action": "숙련에 맞춰 기준 조정",
    "additionalEvidence": "실제 공동생활·역량",
    "contrast": "관성 강함과 오행 제어는 동일 구조 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:family",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "가족의 기대가 시도를 허용하나요?",
    "core": "성장 지원과 제어량",
    "positive": "가능한 단계에 맞는 기대",
    "risk": "성장 전에 결과부터 요구",
    "excess": "조언이 가족 선택 통제로 변질",
    "unexpected": "작은 책임이 성장 기반을 만들 수 있음",
    "conditionalScene": "가족 진로를 논하면 당사자 목표 확인",
    "action": "결과보다 시도 조건 합의",
    "additionalEvidence": "실제 가족·동의",
    "contrast": "부모의 엄격함을 사주로 만들어내지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:geumda_mokjeol:relationships",
    "targetId": "foundation:structure:geumda_mokjeol",
    "profileRef": "csr:profile:geumda_mokjeol",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "geumda_mokjeol:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:geumda_mokjeol#inference",
    "formationRef": "csr:profile:geumda_mokjeol#formation",
    "readerQuestion": "피드백이 참여를 키우나요?",
    "core": "집단 검토와 참여 여력",
    "positive": "구체적 수정 기회를 제공",
    "risk": "공개 평가가 발언을 줄임",
    "excess": "품질 관리가 참여 배제로 변질",
    "unexpected": "필수 규칙은 신입을 도울 수도 있음",
    "conditionalScene": "새 참여자에게 피드백이면 단계 설명",
    "action": "수정 가능한 행동만 말하기",
    "additionalEvidence": "실제 집단·평가",
    "contrast": "상관견관과 달리 관성 출처가 특정되지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:personality",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "새 정보마다 방향이 바뀌나요?",
    "core": "공급과 정착 기준의 관계",
    "positive": "입력을 목표와 연결",
    "risk": "관점 수집이 결정 지연",
    "excess": "유연함이 기준 없는 전환으로 변질",
    "unexpected": "기준이 있으면 변화가 조정 능력이 됨",
    "conditionalScene": "선택지가 늘면 목적 하나부터 확인",
    "action": "바꿀 조건과 유지할 조건 정하기",
    "additionalEvidence": "실제 입력·결정 경험",
    "contrast": "토다매금은 덮임, 여기서는 정착 기반 문제",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:career",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "요청을 실행 단위로 붙잡나요?",
    "core": "업무 입력과 작업 기반",
    "positive": "핵심 요구를 산출로 좁힘",
    "risk": "새 요청마다 작업 재시작",
    "excess": "수용성이 방향 상시 변경으로 변질",
    "unexpected": "변경 창구가 있으면 유연성도 유지",
    "conditionalScene": "요구가 바뀌면 담당·우선순위 확인",
    "action": "변경 요청을 한 주기로 모으기",
    "additionalEvidence": "실제 업무·변경 기록",
    "contrast": "식상 과다는 출력 집중이며 공급 우세와 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:money",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "정보를 어떤 기준으로 거래에 쓰나요?",
    "core": "재무 정보와 운용 기준",
    "positive": "목표에 맞는 자료만 비교",
    "risk": "새 전망마다 매매 변경",
    "excess": "정보 수용이 추종 거래로 변질",
    "unexpected": "자료를 덜 봐야 기준을 지킬 수도 있음",
    "conditionalScene": "제안이 늘면 투자 목적부터 확인",
    "action": "판단 주기와 보류 기준 기록",
    "additionalEvidence": "실제 자산·목표",
    "contrast": "물의 양을 재무 변동성으로 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:study",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "자료가 기억과 풀이로 남나요?",
    "core": "학습 공급과 정착 장치",
    "positive": "반복·재현으로 지식 고정",
    "risk": "새 강의가 이전 학습을 덮음",
    "excess": "호기심이 자료 교체로 변질",
    "unexpected": "작은 복습이 많은 입력보다 유용",
    "conditionalScene": "강의가 쌓이면 한 개념 재현",
    "action": "같은 문제를 다른 날 다시 풀기",
    "additionalEvidence": "실제 공부·숙련",
    "contrast": "인성다자는 일간 상대 지원이며 같은 계산 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:love",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "주변 조언에 관계 기준이 흔들리나요?",
    "core": "관계 정보와 당사자 합의",
    "positive": "여러 의견 중 둘의 기준 선택",
    "risk": "외부 평가마다 약속 변경",
    "excess": "공감이 타인 기대 수용으로 변질",
    "unexpected": "대화로 기준을 세우면 유연함도 유지",
    "conditionalScene": "관계 조언을 들으면 당사자에게 확인",
    "action": "추측 대신 합의한 기준 기록",
    "additionalEvidence": "실제 교제·대화",
    "contrast": "수다로 감정 과잉을 단정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:marriage",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "생활 방식을 자주 바꾸는 이유는 무엇인가요?",
    "core": "새 입력과 공동생활의 기반",
    "positive": "필요한 변화만 시험",
    "risk": "외부 모범마다 규칙 재설계",
    "excess": "적응이 예측 가능성 상실로 변질",
    "unexpected": "시험 기간이 있으면 변화 부담이 줄음",
    "conditionalScene": "새 살림법이면 한 항목만 시범 적용",
    "action": "유지·폐기 기준을 함께 정하기",
    "additionalEvidence": "실제 공동생활·변경",
    "contrast": "조습은 판단 환경이며 직접 생활 성향 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:family",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "가족 조언을 정착시킬 기준이 있나요?",
    "core": "가족 정보와 자기 선택",
    "positive": "현재 필요에 맞춰 조언 선택",
    "risk": "모든 의견을 동시에 따름",
    "excess": "유연함이 결정권 양도로 변질",
    "unexpected": "들을 수 있어도 모두 수락할 필요 없음",
    "conditionalScene": "가족 의견이 많으면 목표부터 공유",
    "action": "최종 결정 주체 명시",
    "additionalEvidence": "실제 가족 대화",
    "contrast": "가족의 과거 간섭을 물상으로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:suda_mokbu:relationships",
    "targetId": "foundation:structure:suda_mokbu",
    "profileRef": "csr:profile:suda_mokbu",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "suda_mokbu:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:suda_mokbu#inference",
    "formationRef": "csr:profile:suda_mokbu#formation",
    "readerQuestion": "여러 모임을 잇는 기준은 무엇인가요?",
    "core": "넓은 입력과 관계의 지속",
    "positive": "가능한 참여를 선별",
    "risk": "새 만남이 기존 약속을 밀어냄",
    "excess": "연결이 일정 과밀로 변질",
    "unexpected": "작은 반복 만남이 관계 기반이 됨",
    "conditionalScene": "초대가 많으면 유지할 약속부터 확인",
    "action": "참여 가능한 주기를 정하기",
    "additionalEvidence": "실제 집단·일정",
    "contrast": "비겁다자의 동류 우세와 다른 전제",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:personality",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "고치려는 대상의 상태를 아나요?",
    "core": "교정 강도와 실제 상태",
    "positive": "변화를 단계적으로 검증",
    "risk": "강한 변화가 항상 개선이라 생각",
    "excess": "추진력이 검증 생략으로 변질",
    "unexpected": "덜 바꾸는 선택이 기능을 보전",
    "conditionalScene": "습관을 바꾸면 효과부터 작게 확인",
    "action": "변경 전후 기준을 동일하게 기록",
    "additionalEvidence": "실제 대상·피드백",
    "contrast": "금다목절과 제어 대상이 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:career",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "개선 속도와 검증 주기가 맞나요?",
    "core": "변형 작업과 품질 기준",
    "positive": "시험 결과로 교정량 조절",
    "risk": "빠른 개편이 필요한 기능도 제거",
    "excess": "단련이 상시 재작업으로 변질",
    "unexpected": "이미 적절한 부분은 보존하는 게 개선",
    "conditionalScene": "제품을 고치면 한 기능씩 시험",
    "action": "원인·변경·검증 결과를 묶기",
    "additionalEvidence": "실제 직무·검증",
    "contrast": "원생 동시 strong은 실제 단련 판정이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:money",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "자원 재배치의 효과를 검증하나요?",
    "core": "교정 비용과 기능 보존",
    "positive": "변경 단위의 비용 확인",
    "risk": "강한 조정이 효율을 보장한다고 믿음",
    "excess": "절감이 필요한 자원까지 제거",
    "unexpected": "유지하는 결정에도 근거가 필요",
    "conditionalScene": "예산을 바꾸면 핵심 기능 먼저 확인",
    "action": "절감액과 기능 손실을 함께 비교",
    "additionalEvidence": "실제 예산·효용",
    "contrast": "화금 라벨은 손익 계산이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:study",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "훈련 강도가 숙련에 맞나요?",
    "core": "연습의 제약과 대상 상태",
    "positive": "난도를 단계별로 조정",
    "risk": "어려울수록 좋은 훈련이라 생각",
    "excess": "강도 경쟁이 기본 오류를 고착",
    "unexpected": "적절한 제한이 풀이를 정교하게 함",
    "conditionalScene": "연습을 늘리면 오류 변화부터 확인",
    "action": "속도와 정확도 지표를 분리",
    "additionalEvidence": "실제 과목·숙련",
    "contrast": "관성 압박형은 일간 상대 십성 조건",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:love",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "문제를 바로 고치려만 하나요?",
    "core": "관계 변화와 상대의 수용",
    "positive": "요청된 변화부터 협의",
    "risk": "상대를 교정 대상으로 취급",
    "excess": "솔직함이 상시 평가로 변질",
    "unexpected": "듣는 단계가 변화보다 먼저일 수 있음",
    "conditionalScene": "불편을 말한다면 원하는 변화 확인",
    "action": "요청과 상대 동의를 함께 점검",
    "additionalEvidence": "실제 교제·동의",
    "contrast": "강한 화금으로 다혈질을 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:marriage",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "생활 개선이 필요한 기능을 지키나요?",
    "core": "공동생활의 변화 강도",
    "positive": "작은 시범으로 영향 확인",
    "risk": "전면 개편으로 익숙한 도움 제거",
    "excess": "효율이 생활의 취향을 삭제",
    "unexpected": "유지할 요소를 정하면 변화도 쉬움",
    "conditionalScene": "생활을 바꾸려면 불편한 한 항목 선택",
    "action": "두 사람의 체감 효과 비교",
    "additionalEvidence": "실제 공동생활",
    "contrast": "물상은 부부 갈등 사실의 근거가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:family",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "가족을 바꾸려는 도움은 동의됐나요?",
    "core": "교정 의도와 당사자 선택",
    "positive": "요청된 도움을 맞춤 제공",
    "risk": "좋은 의도로 선택권 침해",
    "excess": "걱정이 강한 개입으로 변질",
    "unexpected": "조언하지 않는 선택도 존중임",
    "conditionalScene": "변화를 권하려면 필요 여부 질문",
    "action": "도움의 범위와 종료 조건 정하기",
    "additionalEvidence": "실제 가족 요청",
    "contrast": "화금으로 가족 성격·상해를 예언하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  },
  {
    "id": "csr:application:fire_metal:relationships",
    "targetId": "foundation:structure:fire_metal",
    "profileRef": "csr:profile:fire_metal",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "fire_metal:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:fire_metal#inference",
    "formationRef": "csr:profile:fire_metal#formation",
    "readerQuestion": "집단 개선의 비용을 누가 감당하나요?",
    "core": "변경 강도와 참여자의 여력",
    "positive": "단계적 전환과 지원 확보",
    "risk": "효율 때문에 기존 참여자 배제",
    "excess": "강한 리더십이 검증 독점으로 변질",
    "unexpected": "작은 변경이 참여를 더 유지",
    "conditionalScene": "단체 운영을 바꾸면 영향받는 사람 확인",
    "action": "시범 뒤 지속 여부 함께 결정",
    "additionalEvidence": "실제 집단·권한",
    "contrast": "통관 성립은 중개 경로를 별도 확인해야 함",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
