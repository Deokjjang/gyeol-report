import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_STRENGTH = [
  {
    "id": "csr:application:jaeda_sinyak:personality",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "성과를 챙길수록 내 몫도 커지나요?",
    "core": "결과 욕구와 감당 범위를 분리하는 질문",
    "positive": "할 수 있는 몫을 선별",
    "risk": "남의 과제까지 자기 평가로 수용",
    "excess": "책임 선별이 책임 독점으로 변질",
    "unexpected": "덜 맡는 선택이 결과를 지킬 수 있음",
    "conditionalScene": "부탁이 몰린다면 완료 범위부터 협의",
    "action": "수락 전 필요한 지원 적기",
    "additionalEvidence": "실제 요청량·거절 권한",
    "contrast": "재성 우세만으로는 감당 부족을 말할 수 없음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:career",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "커진 업무에 자원도 따라오나요?",
    "core": "담당 규모와 지원의 불균형",
    "positive": "예산·인력과 납기를 함께 협상",
    "risk": "산출 목표만 늘고 지원은 고정",
    "excess": "유능함을 보이려 범위 계속 확장",
    "unexpected": "분담이 성과의 조건일 수 있음",
    "conditionalScene": "수주가 늘었다면 담당자별 납기 확인",
    "action": "인수 기준과 추가 비용 명시",
    "additionalEvidence": "실제 업무·인력·권한",
    "contrast": "식상 과다형은 생산량, 이 후보는 관리 대상 부담",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:money",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "매출과 내게 남는 돈은 같은가요?",
    "core": "취급 규모와 회수 가능한 몫의 차이",
    "positive": "지출·회수 주기를 함께 비교",
    "risk": "매출을 자기 자산으로 착각",
    "excess": "기회마다 자금을 넓게 묶음",
    "unexpected": "거래를 줄여 유동성을 지킬 수도 있음",
    "conditionalScene": "외상이 늘었다면 회수일과 비용 대조",
    "action": "자금 회수 전 새 의무 제한",
    "additionalEvidence": "수입·부채·현금 흐름",
    "contrast": "재생관의 책임 연결과 별개인 감당 문제",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:study",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "준비할 시험이 내 시간보다 많나요?",
    "core": "학습 목표의 범위와 지원 여력",
    "positive": "중요한 목표에 시간을 배정",
    "risk": "자격증 수로 자신을 평가",
    "excess": "모든 과목에 같은 완성도 요구",
    "unexpected": "목표 축소가 학습 포기가 아닐 수 있음",
    "conditionalScene": "시험이 겹친다면 남은 시간부터 계산",
    "action": "핵심 한 과제와 질문 시간 확보",
    "additionalEvidence": "실제 학습 일정·도움",
    "contrast": "인성다자의 자료 축적과 달리 목표 부담을 질문",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:love",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "챙김을 모두 내가 맡고 있나요?",
    "core": "실용적 배려와 일방 부담의 경계",
    "positive": "가능한 배려를 서로 합의",
    "risk": "관계의 모든 문제를 대신 해결",
    "excess": "선물·일정 관리로 마음까지 증명",
    "unexpected": "도움을 받는 일이 친밀함일 수 있음",
    "conditionalScene": "데이트 준비를 독점한다면 역할 나누기",
    "action": "원하는 배려를 말로 확인",
    "additionalEvidence": "실제 교제·상호 동의",
    "contrast": "재성 강함 자체가 돌봄 독점의 근거는 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:marriage",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "함께 사는 책임은 누가 감당하나요?",
    "core": "공동생활의 규모와 각자 여력",
    "positive": "재정·가사 책임을 현실에 맞춤",
    "risk": "가족 목표를 한 사람이 모두 부담",
    "excess": "안정 추구가 일방 책임으로 변질",
    "unexpected": "작은 생활 규모가 관계를 지킬 수 있음",
    "conditionalScene": "주거 비용이 커졌다면 각자 부담 점검",
    "action": "정기적으로 역할과 지출 재협의",
    "additionalEvidence": "실제 공동생활·예산",
    "contrast": "관성 압박형은 규범 부담, 여기서는 자원 감당",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:family",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "가족을 돕는 범위가 정해져 있나요?",
    "core": "가족 지원의 지속 가능한 규모",
    "positive": "도움을 한도 안에서 지속",
    "risk": "타인의 지출까지 무기한 책임",
    "excess": "고마움 기대가 책임 독점으로 변질",
    "unexpected": "한도가 있어야 오래 도울 수 있음",
    "conditionalScene": "가족 지원 요청이 있다면 상환·한도 확인",
    "action": "지원 가능한 기간을 명시",
    "additionalEvidence": "실제 요청·부양 관계",
    "contrast": "재성 기호는 가족 사건을 증명하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:jaeda_sinyak:relationships",
    "targetId": "foundation:structure:jaeda_sinyak",
    "profileRef": "csr:profile:jaeda_sinyak",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaeda_sinyak:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaeda_sinyak#inference",
    "formationRef": "csr:profile:jaeda_sinyak#formation",
    "readerQuestion": "모임의 비용과 일을 혼자 맡나요?",
    "core": "사람을 잇는 부담의 분배",
    "positive": "모임 운영을 공동 책임으로 전환",
    "risk": "총무·예약 역할이 고정",
    "excess": "실용적 신뢰가 무한 봉사로 변질",
    "unexpected": "분담 요청이 관계를 고르는 기준이 될 수 있음",
    "conditionalScene": "정기 모임을 맡았다면 업무 목록 공유",
    "action": "다음 회차 역할 순환 제안",
    "additionalEvidence": "실제 모임·역할 동의",
    "contrast": "비겁다자는 동류 배분, 여기서는 부담 대비 지원",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
  },
  {
    "id": "csr:application:singang:personality",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "내 기반은 어디에서 오나요?",
    "core": "동류 지원과 지식 지원을 구분",
    "positive": "이미 가진 기반을 새 시도에 사용",
    "risk": "지원이 많음을 우월함으로 해석",
    "excess": "버티는 힘이 수정 거부로 변질",
    "unexpected": "튼튼한 기반은 실험의 여유일 수 있음",
    "conditionalScene": "의견이 엇갈린다면 작은 시험 허용",
    "action": "내 판단을 바꿀 조건 정하기",
    "additionalEvidence": "실제 의사결정·지원 형태",
    "contrast": "비겁다자와 달리 인성형 신강도 존재",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:career",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "준비된 기반을 어디에 쓰나요?",
    "core": "기반과 외부 역할의 접점",
    "positive": "지원 자원을 산출에 연결",
    "risk": "배경만 믿고 수요를 무시",
    "excess": "자율성이 협업 거부로 변질",
    "unexpected": "더 어려운 일보다 다른 방식이 적절할 수 있음",
    "conditionalScene": "반복 업무가 익숙하다면 작은 개선안 시험",
    "action": "산출과 피드백을 한 주기로 묶기",
    "additionalEvidence": "실제 업무·수요·지원",
    "contrast": "식상 강함은 출력 우세이며 기반 자체와 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:money",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "감당할 수 있음과 투자할 이유는 같나요?",
    "core": "여력과 자원 배분의 타당성",
    "positive": "남는 여력을 목적별로 구분",
    "risk": "지원이 있으니 손실도 괜찮다고 판단",
    "excess": "자기 확신으로 검증 생략",
    "unexpected": "충분한 여력이 거래를 거절할 자유가 됨",
    "conditionalScene": "투자 제안이 있다면 목적과 손실 한도 확인",
    "action": "근거와 여력을 별도로 기록",
    "additionalEvidence": "실제 자산·위험 수용",
    "contrast": "재성 강함과 달리 돈의 보유를 뜻하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:study",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "아는 기반을 새 문제에 써 보나요?",
    "core": "학습 자원의 전환",
    "positive": "기존 이해를 변형 문제에 적용",
    "risk": "익숙한 방식만 반복",
    "excess": "자신 있는 분야에서 질문을 생략",
    "unexpected": "틀려 볼 여유가 학습 기반일 수 있음",
    "conditionalScene": "기출이 익숙하다면 다른 조건 문제 시도",
    "action": "오답의 전제부터 비교",
    "additionalEvidence": "실제 숙련·과목·피드백",
    "contrast": "인성다자의 준비 축적과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:love",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "함께 결정할 자리를 남기나요?",
    "core": "자기 기반과 상대의 선택권",
    "positive": "안정된 기준 위에서 차이 수용",
    "risk": "내가 감당하니 내가 정한다고 판단",
    "excess": "주도성이 상대 의견 삭제로 변질",
    "unexpected": "양보가 자기 기준 상실은 아닐 수 있음",
    "conditionalScene": "여행을 계획한다면 각자 우선순위 비교",
    "action": "서로 독립 결정할 항목 정하기",
    "additionalEvidence": "실제 교제·선호",
    "contrast": "신강을 지배 성향으로 고정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:marriage",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "각자의 독립 기반을 지키나요?",
    "core": "공동생활 속 자율의 배치",
    "positive": "도움과 개별 결정을 양립",
    "risk": "한 사람의 안정이 전체 기준이 됨",
    "excess": "잘 버티는 사람이 모든 결정을 독점",
    "unexpected": "분리된 시간이 공동생활을 돕기도 함",
    "conditionalScene": "생활 방식이 다르면 공동·개인 영역 분리",
    "action": "변경할 규칙의 합의 방식 정하기",
    "additionalEvidence": "실제 동거·합의",
    "contrast": "비겁 비중만으로 배우자 관계를 읽지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:family",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "가족의 도움을 어떻게 되돌려 쓰나요?",
    "core": "받은 기반과 현재 선택의 구분",
    "positive": "지원 위에서 새 역할을 선택",
    "risk": "지원자의 기대를 모두 계승",
    "excess": "자립이 도움 거절로 변질",
    "unexpected": "도움을 인정해도 선택은 독립 가능",
    "conditionalScene": "가족 도움을 받는다면 조건 확인",
    "action": "감사와 결정권을 따로 대화",
    "additionalEvidence": "실제 가족 지원·조건",
    "contrast": "인성 기호를 부모 지원의 사실로 취급하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:singang:relationships",
    "targetId": "foundation:structure:singang",
    "profileRef": "csr:profile:singang",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "singang:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:singang#inference",
    "formationRef": "csr:profile:singang#formation",
    "readerQuestion": "의견이 달라도 함께 일할 수 있나요?",
    "core": "자기 기준의 안정과 수정 가능성",
    "positive": "차이를 두고도 공동 목표 유지",
    "risk": "버틴 시간을 정답의 근거로 사용",
    "excess": "지속성이 타협 불능으로 변질",
    "unexpected": "기반이 튼튼하면 의견 수정이 쉬울 수 있음",
    "conditionalScene": "공동 계획이 있다면 시험 기간 합의",
    "action": "평가 기준을 결과 전에 정하기",
    "additionalEvidence": "실제 집단·결정 과정",
    "contrast": "신강은 협력 능력의 증명이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
  },
  {
    "id": "csr:application:sinyak:personality",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "부담의 출처를 하나로 묶고 있나요?",
    "core": "설기·관리·평가 요구의 분리",
    "positive": "지원이 필요한 지점을 구체화",
    "risk": "모든 어려움을 자기 약함으로 수용",
    "excess": "도움 요청이 판단 위임으로 확대",
    "unexpected": "한계를 알면 선택 기준이 선명해짐",
    "conditionalScene": "일이 버겁다면 요구의 종류부터 분류",
    "action": "부담 하나와 도움 하나를 연결",
    "additionalEvidence": "실제 부담·가능한 지원",
    "contrast": "재다신약 등 세부 경로가 있어야 원인 특정",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:career",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "업무를 줄일지 지원을 더할지 아나요?",
    "core": "범위 조절과 생조의 차이",
    "positive": "맞는 지원을 요청",
    "risk": "불명확한 역할을 조건 확인 없이 수락",
    "excess": "협력이 모든 결정의 의존으로 변질",
    "unexpected": "범위를 명시하면 작은 역할도 전문성이 됨",
    "conditionalScene": "새 업무를 맡는다면 교육·담당 범위 확인",
    "action": "지원 없이 늘어난 일을 가시화",
    "additionalEvidence": "업무·교육·권한",
    "contrast": "관성 압박만이 신약의 원인은 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:money",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "돈을 맡을 범위와 도움은 맞나요?",
    "core": "거래 부담과 판단 지원",
    "positive": "복잡도를 감당 가능한 수준으로 축소",
    "risk": "자산 부족이라는 낙인",
    "excess": "전문가 조언에 검증 없이 위임",
    "unexpected": "거래하지 않는 선택도 판단임",
    "conditionalScene": "복잡한 계약이라면 이해 못한 조건 표시",
    "action": "비용과 책임을 독립 확인",
    "additionalEvidence": "실제 계약·소득·부채",
    "contrast": "신약은 경제력 측정값이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:study",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "필요한 도움은 설명인가 연습인가요?",
    "core": "학습 부담별 지원 선택",
    "positive": "실제 막힌 단계에 맞는 도움",
    "risk": "학습 속도를 타고난 한계로 확정",
    "excess": "자료와 강사만 계속 교체",
    "unexpected": "작은 반복이 지원 이상의 기반이 될 수 있음",
    "conditionalScene": "문제가 안 풀리면 개념·풀이 단계 구분",
    "action": "막힌 한 단계를 질문",
    "additionalEvidence": "실제 과목·학습 기록",
    "contrast": "무인성과 학습 능력 부재는 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:love",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "도움을 받아도 내 선택을 말하나요?",
    "core": "친밀한 지원과 결정권",
    "positive": "구체적인 도움을 주고받음",
    "risk": "관계 유지를 위해 선호를 숨김",
    "excess": "배려가 상대 판단 전부 수용으로 변질",
    "unexpected": "거절이 관계 조건을 명료하게 함",
    "conditionalScene": "결정이 어렵다면 원하는 도움의 종류 설명",
    "action": "선호와 요청을 분리해서 말하기",
    "additionalEvidence": "실제 교제·동의",
    "contrast": "신약을 순종적 성격으로 읽지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:marriage",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "공동생활의 부담은 조절 가능한가요?",
    "core": "생활 역할과 지원 경로",
    "positive": "가능한 책임을 나눔",
    "risk": "약하다는 이유로 선택권 박탈",
    "excess": "보호가 한쪽의 결정 독점으로 변질",
    "unexpected": "작은 독립 역할이 자신만의 기반이 됨",
    "conditionalScene": "역할을 정한다면 각자 가능한 범위 확인",
    "action": "정기 재조정 날짜 정하기",
    "additionalEvidence": "실제 공동생활·자원",
    "contrast": "배우자 지원은 원국에서 확인한 사실이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:family",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "가족 요청에 필요한 조건을 말하나요?",
    "core": "도움과 의무의 양방향 경계",
    "positive": "지속할 수 있는 지원 합의",
    "risk": "기대를 거절 못해 범위 확대",
    "excess": "보호 요청이 가족 통제로 굳어짐",
    "unexpected": "조건부 지원이 관계를 오래 지킬 수 있음",
    "conditionalScene": "부양을 논한다면 비용·시간부터 나누기",
    "action": "할 수 없는 일도 명시",
    "additionalEvidence": "실제 가족 상황",
    "contrast": "신약으로 가족 의존의 과거를 만들지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:sinyak:relationships",
    "targetId": "foundation:structure:sinyak",
    "profileRef": "csr:profile:sinyak",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sinyak:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sinyak#inference",
    "formationRef": "csr:profile:sinyak#formation",
    "readerQuestion": "함께하기 위해 무엇을 나누나요?",
    "core": "협력의 단위와 개인 여력",
    "positive": "잘 맞는 부분을 분담",
    "risk": "타인의 속도에 모두 맞춤",
    "excess": "연대가 자기 판단 포기로 변질",
    "unexpected": "작은 기여도 합의하면 동등한 참여임",
    "conditionalScene": "공동 프로젝트라면 기여 단위를 정하기",
    "action": "연락·결정 담당을 나눔",
    "additionalEvidence": "실제 집단·합의",
    "contrast": "비겁의 존재만으로 친구 지원을 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
  },
  {
    "id": "csr:application:weak_output:personality",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "꺼낸 생각을 마칠 여력도 있나요?",
    "core": "산출 욕구와 유지 기반",
    "positive": "작은 완료를 남김",
    "risk": "새 반응마다 일 추가",
    "excess": "즉답이 상시 응답으로 변질",
    "unexpected": "말을 줄여도 표현은 선명해질 수 있음",
    "conditionalScene": "약속이 쌓인다면 미완료 목록 확인",
    "action": "새 일 전에 마칠 일 하나 선택",
    "additionalEvidence": "실제 산출·지원",
    "contrast": "식상 강함에는 감당 부족 조건이 없음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:career",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "동시 작업 수는 적절한가요?",
    "core": "생산 범위와 지속 조건",
    "positive": "담당 산출을 선별",
    "risk": "여러 초안만 남음",
    "excess": "다재다능을 보이려 업무 확대",
    "unexpected": "하나를 끝내는 편집도 생산 역량임",
    "conditionalScene": "제작물이 겹친다면 납품 단위 축소",
    "action": "동시 진행 한도를 협의",
    "additionalEvidence": "실제 마감·분업",
    "contrast": "재다신약의 관리 대상 부담과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:money",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "제작비가 회수보다 앞서나요?",
    "core": "설기 비용과 자원 회수",
    "positive": "작은 단위로 비용 검증",
    "risk": "산출을 매출로 착각",
    "excess": "수익 없이 제작만 확장",
    "unexpected": "중단 기준이 다음 시도를 보호",
    "conditionalScene": "개인 판매를 한다면 제작비부터 기록",
    "action": "회수 전 증산 여부 재검토",
    "additionalEvidence": "실제 판매·비용",
    "contrast": "식상생재 경로는 별도 확인 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:study",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "설명하는 시간과 익히는 시간은 맞나요?",
    "core": "학습 출력의 여력",
    "positive": "짧은 풀이로 이해 확인",
    "risk": "모든 내용을 재작성",
    "excess": "정리 노트가 학습을 대체",
    "unexpected": "덜 쓰고 검증하는 것이 효율적일 수 있음",
    "conditionalScene": "노트가 늘면 실제 문제 풀이와 비교",
    "action": "한 개념을 한 문제로 시험",
    "additionalEvidence": "실제 공부 시간·숙련",
    "contrast": "인성다자는 입력 축적, 여기서는 출력 부담",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:love",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "항상 즐겁게 반응해야 하나요?",
    "core": "감정 표현의 지속 범위",
    "positive": "가능한 연락 방식을 합의",
    "risk": "반응량을 애정으로 평가",
    "excess": "즐거움 제공이 의무로 변질",
    "unexpected": "짧은 확인이 긴 대화보다 정확할 수 있음",
    "conditionalScene": "연락이 버겁다면 가능한 시간 설명",
    "action": "응답 기대를 함께 조정",
    "additionalEvidence": "실제 교제·연락",
    "contrast": "무식상과 달리 출력 비중은 관측됨",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:marriage",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "약속을 만들고 유지할 여력은 있나요?",
    "core": "공동 계획의 산출과 실행",
    "positive": "실행 가능한 약속 선별",
    "risk": "새 계획이 기존 역할을 밀어냄",
    "excess": "활기가 일정 과밀로 변질",
    "unexpected": "반복 가능한 작은 계획이 안정이 됨",
    "conditionalScene": "행사가 겹친다면 유지 비용 확인",
    "action": "한 번의 행사와 일상 책임 분리",
    "additionalEvidence": "실제 공동생활·시간",
    "contrast": "가족 사건이나 자녀 수를 식상으로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:family",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "가족 부탁에 바로 답해야 하나요?",
    "core": "요청 반응과 실행 여력",
    "positive": "응답과 수행을 구분",
    "risk": "먼저 약속하고 뒤늦게 부담",
    "excess": "살가움이 상시 해결사 역할로 변질",
    "unexpected": "답을 늦추는 것이 정확한 약속이 됨",
    "conditionalScene": "부탁을 받으면 일정 확인 후 답하기",
    "action": "가능한 수행 시점 명시",
    "additionalEvidence": "실제 가족 요청",
    "contrast": "식상=자녀라는 사건 번역과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_output:relationships",
    "targetId": "foundation:structure:weak_output",
    "profileRef": "csr:profile:weak_output",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_output:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_output#inference",
    "formationRef": "csr:profile:weak_output#formation",
    "readerQuestion": "모임의 분위기를 혼자 책임지나요?",
    "core": "사교 산출의 부담",
    "positive": "참여 방식을 나눔",
    "risk": "침묵을 실패로 받아들임",
    "excess": "재미 제공이 관계 노동으로 변질",
    "unexpected": "듣는 시간이 새 연결을 만들 수 있음",
    "conditionalScene": "진행을 맡는다면 역할을 교대",
    "action": "행사 뒤 필요한 휴식 확인",
    "additionalEvidence": "실제 모임·역할",
    "contrast": "산출 과다는 외향성의 증거가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:personality",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "기준과 자기 가치를 분리하나요?",
    "core": "평가 요구와 감당 지원",
    "positive": "기준을 확인해 부담 한정",
    "risk": "실수를 사람 전체의 실패로 평가",
    "excess": "성실함이 자기 검열로 변질",
    "unexpected": "불명확한 요구를 묻는 것이 책임임",
    "conditionalScene": "평가가 두렵다면 확인 가능한 항목 분리",
    "action": "통제 가능한 행동부터 적기",
    "additionalEvidence": "실제 평가 상황",
    "contrast": "관성 강함만으로 감당 부족은 미확정",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:career",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "책임에 권한과 교육도 붙나요?",
    "core": "요구와 지원의 비대칭",
    "positive": "필요한 권한을 요청",
    "risk": "책임만 받고 수단은 없음",
    "excess": "성실한 수락이 업무 무한 확장",
    "unexpected": "조건을 묻는 일이 사고를 줄임",
    "conditionalScene": "업무를 맡는다면 승인권·지원자 확인",
    "action": "책임 범위를 문서로 협의",
    "additionalEvidence": "실제 직무·교육",
    "contrast": "살인상생은 지원 중개까지 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:money",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "계약의 의무를 모두 이해하나요?",
    "core": "재무 책임과 감당 조건",
    "positive": "의무와 보장을 함께 비교",
    "risk": "보증·기한을 형식으로 취급",
    "excess": "신뢰를 보이려 타인 책임 인수",
    "unexpected": "거절이 재정적 관계를 보호",
    "conditionalScene": "계약을 한다면 최악의 의무 확인",
    "action": "모르는 조건을 확인 전 보류",
    "additionalEvidence": "실제 계약·채무",
    "contrast": "관성 압박은 손실 사건 예언이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:study",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "시험 기준에 맞는 지원이 있나요?",
    "core": "평가 압력과 학습 도구",
    "positive": "채점 기준으로 연습 선택",
    "risk": "점수로 능력 전체를 판단",
    "excess": "기준 충족이 끝없는 문제집 구매",
    "unexpected": "채점표가 불필요한 공부를 덜어 줌",
    "conditionalScene": "시험을 앞두면 배점과 약점 대조",
    "action": "약한 한 항목의 도움 요청",
    "additionalEvidence": "실제 시험·성적",
    "contrast": "관인상생의 실제 학습 중개와 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:love",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "관계의 규칙은 함께 정했나요?",
    "core": "관계 기대와 선택권",
    "positive": "서로 가능한 약속 합의",
    "risk": "일방 기준을 사랑의 조건으로 수용",
    "excess": "성실함이 통제 수용으로 변질",
    "unexpected": "불편한 규칙을 묻는 일이 존중임",
    "conditionalScene": "연락 규칙이 있다면 동의 여부 확인",
    "action": "동의하지 않은 요구 구분",
    "additionalEvidence": "실제 교제·안전",
    "contrast": "피해 경험을 원국으로 추정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:marriage",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "역할의 기준이 현실에 맞나요?",
    "core": "공동생활의 의무와 지원",
    "positive": "규칙을 실제 여력에 맞춤",
    "risk": "모범 가족 기준을 모두 수행",
    "excess": "책임이 자기희생으로 굳음",
    "unexpected": "규칙 축소가 관계를 지속시킬 수 있음",
    "conditionalScene": "가사가 밀린다면 시간·능력부터 확인",
    "action": "필수와 선택 책임을 나누기",
    "additionalEvidence": "실제 공동생활",
    "contrast": "관성으로 배우자 성격을 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:family",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "가족 기대와 내 권한은 맞나요?",
    "core": "부양 의무의 합의",
    "positive": "책임과 결정권 함께 조정",
    "risk": "기대가 의무로 자동 전환",
    "excess": "효도 평가가 무한 요구로 변질",
    "unexpected": "범위를 말하는 것이 지속 조건",
    "conditionalScene": "가족 계획을 논한다면 당사자 동의 확인",
    "action": "의무로 여긴 항목의 근거 묻기",
    "additionalEvidence": "실제 가족·부양",
    "contrast": "압박형 후보는 과거 가족사를 증명하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  },
  {
    "id": "csr:application:weak_officer:relationships",
    "targetId": "foundation:structure:weak_officer",
    "profileRef": "csr:profile:weak_officer",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "weak_officer:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:weak_officer#inference",
    "formationRef": "csr:profile:weak_officer#formation",
    "readerQuestion": "모든 부탁을 약속으로 받나요?",
    "core": "사회적 기대의 경계",
    "positive": "명확한 역할만 수락",
    "risk": "평판을 지키려 무리한 수락",
    "excess": "신뢰가 거절 불능으로 변질",
    "unexpected": "범위가 분명할수록 신뢰가 지속",
    "conditionalScene": "단체 역할을 맡는다면 종료 조건 확인",
    "action": "수락 전에 담당 범위 공유",
    "additionalEvidence": "실제 단체·평가",
    "contrast": "혼잡은 복수 요구 미정리, 여기서는 지원 대비 부담",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
