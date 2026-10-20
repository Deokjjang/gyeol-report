import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_WEIGHT = [
  {
    "id": "csr:application:bigeop_many:personality",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "같은 편이 늘면 판단도 좋아지나요?",
    "core": "동류의 지원과 독립 기준",
    "positive": "서로의 기준을 비교",
    "risk": "다수 동의를 정답으로 수용",
    "excess": "자립이 타인 방식 거절로 변질",
    "unexpected": "비슷한 사람도 다른 몫을 가질 수 있음",
    "conditionalScene": "동료 의견이 같다면 반례도 질문",
    "action": "동의와 검증을 분리",
    "additionalEvidence": "실제 동료·결정 방식",
    "contrast": "신강은 동류 외 인성 지원도 포함",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:career",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "함께 일할 때 몫은 명확한가요?",
    "core": "동류의 협력과 경쟁 조건",
    "positive": "독립 역량을 분업에 활용",
    "risk": "역할 중복으로 기여 평가 혼란",
    "excess": "경쟁이 정보 독점으로 변질",
    "unexpected": "동료의 숙련이 내 자원이 될 수 있음",
    "conditionalScene": "팀이 커지면 담당 산출부터 구분",
    "action": "공동 목표와 개별 권한 명시",
    "additionalEvidence": "실제 협업·평가",
    "contrast": "식상생재는 공동 산출 이후의 회수 경로",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:money",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "공동 자금의 권리는 정해졌나요?",
    "core": "동류와 재성 배분의 조건",
    "positive": "지분·비용 투명화",
    "risk": "친분으로 배분 합의 생략",
    "excess": "비교심이 불필요한 지출을 유발",
    "unexpected": "분명한 몫이 경쟁을 협력으로 바꿈",
    "conditionalScene": "동업을 한다면 출자·권리 기록",
    "action": "정산 주기와 이탈 조건 합의",
    "additionalEvidence": "실제 공동 자금",
    "contrast": "겁재 이름만으로 탈재를 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:study",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "비슷한 학습자가 도움이 되나요?",
    "core": "동류 연습과 개인 진도",
    "positive": "서로 설명하며 숙련 검증",
    "risk": "남의 속도를 자기 목표로 삼음",
    "excess": "경쟁이 질문 은폐로 변질",
    "unexpected": "다른 진도가 공동 학습을 보완",
    "conditionalScene": "스터디를 한다면 역할과 개인 목표 확인",
    "action": "함께 풀 것과 따로 익힐 것 나누기",
    "additionalEvidence": "실제 학습 모임",
    "contrast": "인성다자는 입력 지원의 비중",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:love",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "가까워져도 선택의 공간이 있나요?",
    "core": "동등함과 각자의 기준",
    "positive": "서로의 독립 선택 존중",
    "risk": "모든 결정을 비교·대결로 처리",
    "excess": "자립이 도움 거부로 변질",
    "unexpected": "다름을 인정하면 친밀함도 유지",
    "conditionalScene": "취미가 다르면 함께·따로 시간을 합의",
    "action": "경쟁이 된 대화를 선호 대화로 바꾸기",
    "additionalEvidence": "실제 교제·선호",
    "contrast": "비겁을 경쟁 연인으로 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:marriage",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "두 사람의 몫을 어떻게 정하나요?",
    "core": "동등한 권리와 역할 분담",
    "positive": "기여 방식을 여러 형태로 인정",
    "risk": "항목마다 똑같은 양만 요구",
    "excess": "공평함이 점수 계산으로 변질",
    "unexpected": "분담이 달라도 합의하면 동등함 유지",
    "conditionalScene": "가사를 나누면 시간·난도 함께 비교",
    "action": "정기적으로 부담의 체감 확인",
    "additionalEvidence": "실제 공동생활·동의",
    "contrast": "신강과 달리 비겁 가족의 상대 우세",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:family",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "형제 같은 위치에서도 역할이 다른가요?",
    "core": "가족 동류의 권리·부담",
    "positive": "당사자별 가능한 몫 합의",
    "risk": "같은 지위라 같은 부담을 요구",
    "excess": "연대가 사적 선택 통제로 변질",
    "unexpected": "각자 다르게 돕는 것도 협력임",
    "conditionalScene": "가족 비용을 나누면 실제 여력 확인",
    "action": "인원수 대신 감당 기준으로 논의",
    "additionalEvidence": "실제 가족 구성·여력",
    "contrast": "비겁으로 실제 형제 수를 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:bigeop_many:relationships",
    "targetId": "foundation:structure:bigeop_many",
    "profileRef": "csr:profile:bigeop_many",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "bigeop_many:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:bigeop_many#inference",
    "formationRef": "csr:profile:bigeop_many#formation",
    "readerQuestion": "동료애와 경쟁을 구별하나요?",
    "core": "동류 연결의 목표·배분",
    "positive": "공동 기준으로 경쟁을 학습화",
    "risk": "성과 비교가 관계 평가로 확대",
    "excess": "결속이 배타성으로 변질",
    "unexpected": "다른 집단의 의견이 결속을 돕기도 함",
    "conditionalScene": "친목 모임이면 신입의 발언도 확인",
    "action": "공유할 정보와 개인 몫 합의",
    "additionalEvidence": "실제 집단·목표",
    "contrast": "관살혼잡의 상충 규범과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:personality",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "이해한 것과 해 본 것을 구분하나요?",
    "core": "수용 자원과 실제 판단",
    "positive": "자료를 비교 기준으로 정리",
    "risk": "설명이 많아도 실행은 미확인",
    "excess": "준비가 불확실성 회피로 변질",
    "unexpected": "충분히 알면 작게 시험할 여유가 생김",
    "conditionalScene": "자료를 모았다면 가설 하나 시험",
    "action": "더 조사할 조건을 정하기",
    "additionalEvidence": "실제 자료·실행",
    "contrast": "신강은 인성 외 동류 지원도 포함",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:career",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "준비 자료가 업무를 돕나요?",
    "core": "지원 축적과 현장 사용",
    "positive": "지식을 재사용 가능한 절차로 바꿈",
    "risk": "정리만 늘고 담당 일은 지연",
    "excess": "전문성 증명이 문서량 경쟁으로 변질",
    "unexpected": "간단한 안내가 두꺼운 보고서보다 유효",
    "conditionalScene": "매뉴얼을 만들면 실제 사용자에게 시험",
    "action": "쓰지 않는 항목을 구분",
    "additionalEvidence": "실제 직무·자료 수용",
    "contrast": "관인상생은 관성 출발 경로가 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:money",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "조사를 충분히 했다는 기준은 있나요?",
    "core": "재무 정보와 결정의 경계",
    "positive": "조건 비교로 이해 범위 확대",
    "risk": "정보량을 위험 제거로 착각",
    "excess": "확신을 얻으려 조사 무한 반복",
    "unexpected": "불확실성을 인정하면 보류도 가능",
    "conditionalScene": "금융 자료를 읽으면 비용·책임 먼저 비교",
    "action": "확인된 사실과 전망 분리",
    "additionalEvidence": "실제 계약·정보 출처",
    "contrast": "인성을 실제 자산으로 환산하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:study",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "학습 자료가 내 이해로 바뀌나요?",
    "core": "입력 축적과 개념 연결",
    "positive": "여러 설명을 자기 말로 비교",
    "risk": "자료 소유를 숙련으로 생각",
    "excess": "완벽한 교재를 찾느라 시작 지연",
    "unexpected": "부족한 설명이 직접 검증의 계기가 됨",
    "conditionalScene": "강의를 들었다면 한 문제에 적용",
    "action": "설명 없이 재현해 보기",
    "additionalEvidence": "실제 과목·학습 기록",
    "contrast": "무인성 여부는 학습 능력의 반대 척도가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:love",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "상대를 이해하는 것과 묻는 것은 같나요?",
    "core": "관계 정보와 직접 확인",
    "positive": "배경을 듣고 반응을 조정",
    "risk": "분석으로 상대 마음을 확정",
    "excess": "이해하려는 태도가 해석 독점으로 변질",
    "unexpected": "모른다고 말하면 대화가 열릴 수 있음",
    "conditionalScene": "상대 행동이 궁금하면 이유를 질문",
    "action": "추측과 들은 말을 구분",
    "additionalEvidence": "실제 교제·대화",
    "contrast": "관인상생의 약속 이해 경로와 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:marriage",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "배운 생활 방식이 둘에게 맞나요?",
    "core": "축적한 모범과 공동 실제",
    "positive": "도움 되는 자료만 선택",
    "risk": "외부 조언으로 상대를 평가",
    "excess": "준비가 생활 규칙 과잉으로 변질",
    "unexpected": "둘의 시행착오가 외부 정답보다 유용",
    "conditionalScene": "살림 정보를 찾으면 작은 시범부터 합의",
    "action": "효과를 두 사람 기준으로 검토",
    "additionalEvidence": "실제 공동생활",
    "contrast": "인성은 배우자 지원의 사실이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:family",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "가족의 조언을 어떻게 받아들이나요?",
    "core": "보호·설명과 선택권",
    "positive": "도움과 현재 필요를 대조",
    "risk": "과거 조언을 현재 정답으로 고정",
    "excess": "보호가 자기 결정 대신함",
    "unexpected": "받지 않는 도움도 존중의 대상",
    "conditionalScene": "조언을 받으면 적용 조건부터 묻기",
    "action": "감사와 수락을 분리",
    "additionalEvidence": "실제 가족 지원",
    "contrast": "인성다자로 부모의 실제 보호를 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:resource_many:relationships",
    "targetId": "foundation:structure:resource_many",
    "profileRef": "csr:profile:resource_many",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "resource_many:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:resource_many#inference",
    "formationRef": "csr:profile:resource_many#formation",
    "readerQuestion": "도움을 줄 때 무엇이 필요한가요?",
    "core": "지원 자원의 적합성",
    "positive": "정보·경청·실행 도움 구분",
    "risk": "설명을 많이 주면 도움이라 생각",
    "excess": "조언이 상대 선택 침범으로 변질",
    "unexpected": "짧은 질문이 긴 설명보다 유용",
    "conditionalScene": "친구가 고민하면 원하는 도움 확인",
    "action": "도움 뒤 실제 쓰임을 물어보기",
    "additionalEvidence": "실제 요청·동의",
    "contrast": "살인상생은 강한 요구의 중개 경로 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:personality",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "꺼낸 생각을 다시 듣고 있나요?",
    "core": "외부 산출과 피드백",
    "positive": "표현을 검증 자료로 사용",
    "risk": "반응 전 다음 출력으로 이동",
    "excess": "다양성이 미완료 누적으로 변질",
    "unexpected": "편집이 표현을 더 분명하게 함",
    "conditionalScene": "아이디어가 많으면 한 개만 시험",
    "action": "남길 기준을 미리 정하기",
    "additionalEvidence": "실제 산출·피드백",
    "contrast": "식상 과다형 신약은 지원 부족 추가",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:career",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "산출량과 쓰임이 함께 늘어나나요?",
    "core": "생산과 전달의 구분",
    "positive": "초안·시험으로 문제 발견",
    "risk": "만든 수만 성과로 기록",
    "excess": "활발한 제작이 완료 기준 삭제",
    "unexpected": "덜 만들어도 전달이 좋아질 수 있음",
    "conditionalScene": "초안이 쌓이면 사용자 반응 확인",
    "action": "완료와 폐기 기준 합의",
    "additionalEvidence": "실제 직무·수용자",
    "contrast": "식상생재는 회수 대상까지 연결 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:money",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "잘 만든 것의 비용을 알고 있나요?",
    "core": "산출과 경제 조건의 분리",
    "positive": "제작 단위의 비용 확인",
    "risk": "재능을 수익으로 착각",
    "excess": "자기 작업에 과도한 선투입",
    "unexpected": "비상업 작업을 남기는 선택 가능",
    "conditionalScene": "판매 생각이 있으면 원가부터 계산",
    "action": "제작량과 회수 계획 따로 점검",
    "additionalEvidence": "실제 판매·비용",
    "contrast": "재성 우세는 다른 가족의 관측",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:study",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "풀이를 보여 주며 이해를 확인하나요?",
    "core": "학습 출력의 검증",
    "positive": "설명·실습으로 약점 발견",
    "risk": "유창한 설명을 숙련으로 착각",
    "excess": "정리 형식에 시간 과투입",
    "unexpected": "말을 줄이고 풀면 틈이 보일 수 있음",
    "conditionalScene": "공부했다면 새 문제로 재현",
    "action": "표현 오류와 개념 오류 구분",
    "additionalEvidence": "실제 과목·숙련",
    "contrast": "인성다자는 수용 자료 축적 중심",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:love",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "표현한 마음이 상대에게 닿나요?",
    "core": "표현량과 수용의 차이",
    "positive": "상대가 편한 표현을 확인",
    "risk": "많이 말하면 충분히 전했다고 생각",
    "excess": "열정적 표현이 상대 시간 침범",
    "unexpected": "조용한 확인도 적극적 표현임",
    "conditionalScene": "연락을 자주 한다면 상대의 선호 확인",
    "action": "반응을 들을 자리를 남기기",
    "additionalEvidence": "실제 교제·연락",
    "contrast": "무식상은 표현 불능의 반대가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:marriage",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "새 계획과 유지할 일은 균형인가요?",
    "core": "공동생활의 산출과 지속",
    "positive": "작은 개선을 실제로 마침",
    "risk": "아이디어가 일상 역할을 밀어냄",
    "excess": "즐거운 계획이 일정 과밀로 변질",
    "unexpected": "반복 가능한 계획이 더 만족스러울 수 있음",
    "conditionalScene": "집안 개선을 제안하면 유지 비용 확인",
    "action": "시작과 마무리 담당 합의",
    "additionalEvidence": "실제 공동생활·시간",
    "contrast": "식상으로 자녀 수를 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:family",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "가족에게 해 주는 일의 기준은 있나요?",
    "core": "표현·생산의 가족 내 쓰임",
    "positive": "원하는 도움으로 산출 조정",
    "risk": "내가 좋다고 가족도 좋다고 생각",
    "excess": "활기가 행사·일정 강요로 변질",
    "unexpected": "작은 맞춤 도움이 큰 행사보다 유효",
    "conditionalScene": "행사를 준비하면 참여 의사 먼저 질문",
    "action": "제안과 동의를 구별",
    "additionalEvidence": "실제 가족 의사",
    "contrast": "식상은 가족 사건의 증거가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:output_heavy:relationships",
    "targetId": "foundation:structure:output_heavy",
    "profileRef": "csr:profile:output_heavy",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "output_heavy:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:output_heavy#inference",
    "formationRef": "csr:profile:output_heavy#formation",
    "readerQuestion": "내가 말하는 시간과 듣는 시간은 어떤가요?",
    "core": "집단의 표현·수용 통로",
    "positive": "다양한 의견을 바깥에 꺼냄",
    "risk": "발언량이 기여의 기준이 됨",
    "excess": "진행 능력이 발언권 독점으로 변질",
    "unexpected": "질문도 생산적인 참여임",
    "conditionalScene": "회의를 이끌면 조용한 사람 의견 확인",
    "action": "정리 뒤 수정 시간을 남기기",
    "additionalEvidence": "실제 집단·대화",
    "contrast": "관성 긴장과 달리 규범 제어는 필수 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:personality",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "쓸모 외의 가치도 남겨 두나요?",
    "core": "관리 대상과 가치 판단",
    "positive": "자원의 쓰임을 비교",
    "risk": "모든 선택을 회수 가치로 평가",
    "excess": "실용성이 경험의 다양성 삭제",
    "unexpected": "덜 갖는 선택이 관리 여력을 줌",
    "conditionalScene": "선택지가 많다면 유지 비용 비교",
    "action": "목적 없는 보유를 구별",
    "additionalEvidence": "실제 선택·관리 경험",
    "contrast": "재다신약은 감당 부족이 추가 조건",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:career",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "맡은 자원의 규모와 권한은 맞나요?",
    "core": "관리·교환 대상의 집중",
    "positive": "비용과 성과를 함께 봄",
    "risk": "취급량을 내 성과로 착각",
    "excess": "관리 범위가 끝없이 확장",
    "unexpected": "대상을 줄여 정확도를 높일 수 있음",
    "conditionalScene": "예산 담당이면 집행 권한 확인",
    "action": "관리량과 실제 책임 분리",
    "additionalEvidence": "실제 직무·자원",
    "contrast": "재생관은 정관으로의 연결 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:money",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "소유·매출·유동성을 구분하나요?",
    "core": "재성 기호와 실제 자산의 경계",
    "positive": "자원 종류별 쓰임 확인",
    "risk": "많이 다루면 많이 남는다고 생각",
    "excess": "기회 포착이 보유 과다로 변질",
    "unexpected": "현금을 남기는 선택도 운용임",
    "conditionalScene": "자산을 점검하면 회수 가능 시점 구분",
    "action": "자산·부채·현금 흐름 별도 기록",
    "additionalEvidence": "실제 재무 자료",
    "contrast": "재성량은 부의 측정값이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:study",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "학습 비용과 실제 쓰임은 맞나요?",
    "core": "교육 자원의 관리",
    "positive": "목표에 맞는 도구를 선택",
    "risk": "비싼 자료가 좋은 학습이라고 생각",
    "excess": "효용 평가가 기초 탐구 삭제",
    "unexpected": "당장 안 쓰는 개념도 기반이 될 수 있음",
    "conditionalScene": "강좌를 고르면 목표·선행 수준 비교",
    "action": "구매보다 학습 시간을 먼저 확보",
    "additionalEvidence": "실제 과목·비용",
    "contrast": "인성다자는 받아들이는 지식의 비중",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:love",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "배려를 금액으로 재고 있나요?",
    "core": "실용 자원과 감정의 차이",
    "positive": "필요한 도움을 구체화",
    "risk": "지출로 마음을 모두 증명",
    "excess": "보답 계산이 관계를 거래로 만듦",
    "unexpected": "비금전 배려가 더 맞을 수 있음",
    "conditionalScene": "선물을 고르면 상대의 실제 선호 질문",
    "action": "비용과 의미를 따로 대화",
    "additionalEvidence": "실제 교제·선호",
    "contrast": "재성은 연인의 존재·성격을 특정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:marriage",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "공동 자원을 누가 어떻게 쓰나요?",
    "core": "생활 자원의 권리·효용",
    "positive": "비용과 이용을 투명하게 함",
    "risk": "재정 기여로 모든 결정권 주장",
    "excess": "효율이 상대 선호를 지움",
    "unexpected": "개인 예산이 공동 안정에 도움 가능",
    "conditionalScene": "예산을 짜면 공동·개인 항목 나누기",
    "action": "비금전 기여도 함께 확인",
    "additionalEvidence": "실제 공동생활·예산",
    "contrast": "관성 우세는 의무 기준의 별도 관측",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:family",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "가족 지원의 효과를 확인하나요?",
    "core": "도움 자원의 적합성",
    "positive": "당사자에게 필요한 방식 선택",
    "risk": "지원 금액을 관계의 가치로 평가",
    "excess": "관리 의지가 가족 선택 통제로 변질",
    "unexpected": "작은 지원도 시점이 맞으면 유용",
    "conditionalScene": "지원 요청이면 목적·기간 확인",
    "action": "도움과 결정권을 분리",
    "additionalEvidence": "실제 가족 요청·동의",
    "contrast": "재성으로 특정 가족사를 만들지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:wealth_heavy:relationships",
    "targetId": "foundation:structure:wealth_heavy",
    "profileRef": "csr:profile:wealth_heavy",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "wealth_heavy:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:wealth_heavy#inference",
    "formationRef": "csr:profile:wealth_heavy#formation",
    "readerQuestion": "관계에서 자원이 어떤 역할을 하나요?",
    "core": "교환과 친분의 경계",
    "positive": "공동 비용을 투명하게 분담",
    "risk": "자원 제공으로 호의를 요구",
    "excess": "모임이 거래 기회로만 바뀜",
    "unexpected": "거래 없는 만남도 지속 자원임",
    "conditionalScene": "친구와 거래하면 조건 먼저 기록",
    "action": "정산과 친밀함을 별도 확인",
    "additionalEvidence": "실제 모임·거래",
    "contrast": "비겁다자의 동류 비중과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:personality",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "내 기준과 외부 기준을 구별하나요?",
    "core": "제어 축과 자기 판단",
    "positive": "의무의 범위를 명확하게 함",
    "risk": "평가를 자기 가치로 수용",
    "excess": "책임감이 전 영역 검열로 변질",
    "unexpected": "규칙이 선택의 여유를 만들 수도 있음",
    "conditionalScene": "해야 할 일이 많다면 근거별 분류",
    "action": "의무와 기대를 구분",
    "additionalEvidence": "실제 평가·역할",
    "contrast": "관성 압박형 신약은 지원 부족을 더 요구",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:career",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "역할에 맞는 권한이 있나요?",
    "core": "책임 기준과 결정권",
    "positive": "이행 기준을 공유",
    "risk": "책임만 많고 재량은 불명확",
    "excess": "신뢰가 모든 요청 수락으로 변질",
    "unexpected": "선명한 역할은 불필요한 업무를 줄임",
    "conditionalScene": "업무를 맡으면 성공·종료 기준 확인",
    "action": "승인자와 수행자 나누기",
    "additionalEvidence": "실제 직무·권한",
    "contrast": "관살혼잡은 두 관성의 노출·미정리 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:money",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "재무 의무를 누구 기준으로 지키나요?",
    "core": "규정·계약과 자율 판단",
    "positive": "기한·한도·의무를 관리",
    "risk": "평판 때문에 과도한 보증 수락",
    "excess": "정확함이 작은 지출까지 통제로 변질",
    "unexpected": "분명한 한도가 거절을 쉽게 함",
    "conditionalScene": "계약을 한다면 책임 범위 확인",
    "action": "의무 없는 요청은 따로 판단",
    "additionalEvidence": "실제 계약·재무",
    "contrast": "관성은 소득이나 지위를 측정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:study",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "평가 기준이 학습을 돕나요?",
    "core": "채점·일정과 배움의 접점",
    "positive": "요구 조건을 연습에 반영",
    "risk": "성적만으로 학습 의미 평가",
    "excess": "규칙 충족이 탐구를 막음",
    "unexpected": "시간 제한이 핵심을 고르는 도구가 됨",
    "conditionalScene": "시험이면 배점과 학습 목표 대조",
    "action": "평가 밖 탐구 시간도 분리",
    "additionalEvidence": "실제 시험·목표",
    "contrast": "관인상생은 학습 지원까지 잇는 별도 흐름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:love",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "약속이 두 사람에게 같은 의미인가요?",
    "core": "관계 기준의 합의",
    "positive": "예측 가능한 약속을 만듦",
    "risk": "내 기준을 상대에게 강요",
    "excess": "성실한 확인이 감시로 변질",
    "unexpected": "합의한 경계가 자유를 지킬 수 있음",
    "conditionalScene": "연락 약속이라면 서로의 기대 확인",
    "action": "기준 변경을 말할 통로 남기기",
    "additionalEvidence": "실제 교제·동의",
    "contrast": "관성으로 상대 성격·혼인 여부 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:marriage",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "생활의 의무와 선택을 나누나요?",
    "core": "공동 규칙과 자율 영역",
    "positive": "필수 역할을 명확하게 함",
    "risk": "모든 취향을 규칙으로 처리",
    "excess": "질서가 작은 차이까지 교정",
    "unexpected": "개인 영역을 두면 공동 규칙도 유지",
    "conditionalScene": "생활 규칙을 정하면 필수 항목부터 합의",
    "action": "예외와 개인 시간을 함께 정하기",
    "additionalEvidence": "실제 공동생활·동의",
    "contrast": "혼잡의 복수 기준과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:family",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "가족 기대가 합의된 의무인가요?",
    "core": "가족 규범의 범위",
    "positive": "당사자별 역할을 정함",
    "risk": "관행을 영구 의무로 수용",
    "excess": "책임이 희생 평가로 변질",
    "unexpected": "새 기준이 가족 부담을 줄일 수 있음",
    "conditionalScene": "부양을 논하면 가능한 시간·비용 확인",
    "action": "기대와 법적·합의 의무 구분",
    "additionalEvidence": "실제 가족·부양",
    "contrast": "가족 권위나 피해 경험은 미확인",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  },
  {
    "id": "csr:application:officer_heavy:relationships",
    "targetId": "foundation:structure:officer_heavy",
    "profileRef": "csr:profile:officer_heavy",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_heavy:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_heavy#inference",
    "formationRef": "csr:profile:officer_heavy#formation",
    "readerQuestion": "믿을 만한 사람이 되려 무엇을 맡나요?",
    "core": "사회적 약속의 지속 조건",
    "positive": "가능한 역할을 정확히 수행",
    "risk": "평판 때문에 거절하지 못함",
    "excess": "일관성이 변화 거부로 변질",
    "unexpected": "역할을 바꾸는 것이 신뢰를 지키기도 함",
    "conditionalScene": "단체 일을 맡으면 종료 시점 합의",
    "action": "연장 요청은 다시 검토",
    "additionalEvidence": "실제 모임·책임",
    "contrast": "관인상생의 지원 체계는 별도 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
