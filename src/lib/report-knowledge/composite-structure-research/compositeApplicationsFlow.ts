import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_FLOW = [
  {
    "id": "csr:application:siksang_saengjae:personality",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "잘하는 것의 쓰임을 확인하나요?",
    "core": "산출과 수용의 연결",
    "positive": "반응으로 결과물을 조정",
    "risk": "반응 없음을 재능 부재로 해석",
    "excess": "쓸모 평가가 모든 즐거움 지배",
    "unexpected": "작은 시도가 큰 준비보다 정보를 줌",
    "conditionalScene": "새 아이디어라면 한 사람에게 시험",
    "action": "무엇이 실제 쓰였는지 질문",
    "additionalEvidence": "실제 산출·수용자",
    "contrast": "식상 강함은 재성 목적지를 보장하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:career",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "결과물이 누구의 문제를 푸나요?",
    "core": "제작에서 교환으로 가는 단계",
    "positive": "납품 단위와 수요 일치",
    "risk": "공급만 늘리고 이용은 미확인",
    "excess": "판매 가능한 것만 만들려 함",
    "unexpected": "적은 제작량도 정확한 수요면 유용",
    "conditionalScene": "의뢰를 받으면 사용 장면 먼저 확인",
    "action": "샘플 뒤 구매·사용 조건 점검",
    "additionalEvidence": "업무·고객·계약",
    "contrast": "재생관은 성과 이후 역할의 변화",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:money",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "값을 받는 조건은 정해졌나요?",
    "core": "기술·표현과 회수 경로",
    "positive": "원가와 지급 시점 명시",
    "risk": "매출 전 제작비 확대",
    "excess": "모든 솜씨의 상품화",
    "unexpected": "팔지 않을 작업을 남겨도 됨",
    "conditionalScene": "판매를 시작한다면 단가·원가 비교",
    "action": "매출과 순회수를 분리 기록",
    "additionalEvidence": "실제 판매·가격·비용",
    "contrast": "재성 강함 자체와 다른 전달 경로",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:study",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "배운 것을 어떤 결과로 시험하나요?",
    "core": "지식 출력의 실제 효용",
    "positive": "작은 프로젝트로 이해 확인",
    "risk": "점수·판매만 배움의 가치로 평가",
    "excess": "성과 없는 탐구를 모두 중단",
    "unexpected": "비상업 결과도 적용의 증거가 됨",
    "conditionalScene": "과제를 한다면 사용자가 쓸 예제 제작",
    "action": "피드백 한 가지를 수정에 반영",
    "additionalEvidence": "실제 과목·과제",
    "contrast": "관인상생의 기준 학습과 달리 출력의 쓰임",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:love",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "해 준 일이 상대에게 도움이 됐나요?",
    "core": "배려 산출과 상대의 필요",
    "positive": "원하는 도움을 확인",
    "risk": "선물로 반응을 구매하려 함",
    "excess": "관계가 기여량 계산으로 변질",
    "unexpected": "덜 해 주는 것이 더 맞는 배려일 수 있음",
    "conditionalScene": "선물을 준비한다면 원하는 방식 질문",
    "action": "고마움과 보답 의무를 분리",
    "additionalEvidence": "실제 교제·선호",
    "contrast": "재성을 연인의 실제 존재로 읽지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:marriage",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "서로 만든 것이 생활에 남나요?",
    "core": "공동 노력과 공유 효용",
    "positive": "공동 과제를 실용적으로 나눔",
    "risk": "가사 기여를 거래로만 계산",
    "excess": "모든 수고에 즉시 보상 요구",
    "unexpected": "측정 안 되는 배려도 가치가 있음",
    "conditionalScene": "집을 꾸민다면 각자의 사용 장면 확인",
    "action": "노력의 양과 효용을 함께 대화",
    "additionalEvidence": "실제 공동생활·역할",
    "contrast": "관인상생의 규범 지원과 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:family",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "가족 도움의 방식이 맞나요?",
    "core": "해 준 일과 실제 필요",
    "positive": "필요한 물건·도움을 공동 선택",
    "risk": "원하지 않은 도움을 강요",
    "excess": "보답을 기대한 제작·지출 확대",
    "unexpected": "도움 요청을 듣는 것이 첫 산출임",
    "conditionalScene": "가족을 돕는다면 사용 여부 확인",
    "action": "원하는 도움과 가능한 도움 대조",
    "additionalEvidence": "실제 가족 요청",
    "contrast": "가족 부양 사건을 생재로 예언하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:siksang_saengjae:relationships",
    "targetId": "foundation:structure:siksang_saengjae",
    "profileRef": "csr:profile:siksang_saengjae",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "siksang_saengjae:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:siksang_saengjae#inference",
    "formationRef": "csr:profile:siksang_saengjae#formation",
    "readerQuestion": "함께 만든 결과의 몫은 정했나요?",
    "core": "협력 산출의 교환·배분",
    "positive": "기여와 회수를 투명하게 합의",
    "risk": "친분으로 지급 조건 생략",
    "excess": "모든 만남을 영업으로 바꿈",
    "unexpected": "거래와 우정의 경계를 두면 둘 다 유지",
    "conditionalScene": "공동 판매라면 비용·권리 먼저 확인",
    "action": "수익·저작권 배분 명시",
    "additionalEvidence": "실제 협업·계약",
    "contrast": "비겁다자는 동류 비중, 여기서는 산출→자원",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
  },
  {
    "id": "csr:application:jaesaenggwan:personality",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "성과가 새 기준을 만들고 있나요?",
    "core": "자원과 역할 기대의 연결",
    "positive": "성과의 쓰임을 명확히 함",
    "risk": "결과로 자기 지위만 증명",
    "excess": "인정을 위해 의무 계속 확대",
    "unexpected": "역할 기준이 거절의 근거가 됨",
    "conditionalScene": "성과가 늘면 따라온 기대를 분류",
    "action": "추가 책임의 조건 말하기",
    "additionalEvidence": "실제 성과·역할",
    "contrast": "식상생재는 결과 제작 단계",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:career",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "성과에 맞는 권한이 생기나요?",
    "core": "자원을 책임 체계로 전환",
    "positive": "권한·예산·평가를 함께 협상",
    "risk": "성과만큼 무보상 책임 증가",
    "excess": "자리 유지에 자원 과투입",
    "unexpected": "역할을 좁혀도 신뢰를 지킬 수 있음",
    "conditionalScene": "승진을 논한다면 담당·권한 함께 확인",
    "action": "성과와 새 의무를 별도 합의",
    "additionalEvidence": "실제 조직·결정권",
    "contrast": "관인상생은 배움의 지원 경로까지 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:money",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "자원 투입이 어떤 의무를 낳나요?",
    "core": "돈과 계약 책임의 접점",
    "positive": "투입에 따른 권리 명확화",
    "risk": "지출을 지위 확보로 착각",
    "excess": "평판을 위해 불필요한 비용 지속",
    "unexpected": "권리를 확인하면 적은 투입도 충분",
    "conditionalScene": "출자를 한다면 의결권·책임 확인",
    "action": "회수와 법적 의무를 분리 점검",
    "additionalEvidence": "실제 출자·계약",
    "contrast": "재성 우세만으로 관성 연결은 미확정",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:study",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "자격을 얻은 뒤 무엇을 맡나요?",
    "core": "학습 자원과 공식 역할",
    "positive": "자격의 실제 활용 범위 확인",
    "risk": "증서만으로 권한이 있다고 생각",
    "excess": "역할 확보를 위한 자격 무한 추가",
    "unexpected": "필요한 자격만 갖추는 편이 유효",
    "conditionalScene": "자격을 고르면 실제 직무 조건 확인",
    "action": "학습 비용과 역할 요건 비교",
    "additionalEvidence": "실제 자격·진로",
    "contrast": "인성의 학습 그 자체와 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:love",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "실용적 챙김이 약속이 되나요?",
    "core": "제공한 자원과 관계 기대",
    "positive": "기대할 수 있는 배려 합의",
    "risk": "선물이 관계 권리로 바뀜",
    "excess": "신뢰가 의무 목록으로 변질",
    "unexpected": "작은 약속이 큰 제공보다 분명",
    "conditionalScene": "큰 지출을 한다면 서로의 의미 확인",
    "action": "선물과 결정권을 분리",
    "additionalEvidence": "실제 교제·지출",
    "contrast": "관성은 혼인 상태의 증거가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:marriage",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "재정 기여와 결정권은 공정한가요?",
    "core": "생활 자원과 공동 책임",
    "positive": "비용·가사·권한 함께 합의",
    "risk": "돈을 낸 사람이 모든 규칙 결정",
    "excess": "역할을 지키려 수입만 늘림",
    "unexpected": "비금전 기여도 권리 논의에 포함",
    "conditionalScene": "예산을 정한다면 돌봄 시간도 계산",
    "action": "부담과 권한을 함께 재협의",
    "additionalEvidence": "실제 공동생활·예산",
    "contrast": "재다신약은 감당 부족을 별도 요구",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:family",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "지원이 새로운 가족 의무가 되나요?",
    "core": "지원 자원과 역할 기대",
    "positive": "도움의 조건을 투명하게 함",
    "risk": "일회 지원이 영구 의무가 됨",
    "excess": "신뢰 유지에 지원 계속 확대",
    "unexpected": "지원 한도가 기대도 명확히 함",
    "conditionalScene": "가족 비용을 낸다면 기간·목적 확인",
    "action": "도움과 향후 책임 분리",
    "additionalEvidence": "실제 가족 요청",
    "contrast": "재성이 부모·배우자 사건을 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:jaesaenggwan:relationships",
    "targetId": "foundation:structure:jaesaenggwan",
    "profileRef": "csr:profile:jaesaenggwan",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "jaesaenggwan:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:jaesaenggwan#inference",
    "formationRef": "csr:profile:jaesaenggwan#formation",
    "readerQuestion": "기여한 만큼 어떤 역할을 맡나요?",
    "core": "자원 제공과 집단 책임",
    "positive": "운영 권한을 합의",
    "risk": "후원 때문에 역할이 고정",
    "excess": "자리 유지를 위한 비용 과용",
    "unexpected": "역할을 내려놓아도 기여는 남음",
    "conditionalScene": "모임을 후원하면 권한·의무 확인",
    "action": "지원 종료 조건을 먼저 정하기",
    "additionalEvidence": "실제 집단·후원",
    "contrast": "비겁 배분과 다른 자원→규범 경로",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 승진·공직·부유함·배우자 지위는 추론하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:personality",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "기준을 이해한 뒤 판단하나요?",
    "core": "규범이 지식 지원을 거치는 흐름",
    "positive": "이유를 알고 기준 적용",
    "risk": "설명한 권위를 정답으로 수용",
    "excess": "이해가 허락 대기로 변질",
    "unexpected": "기준을 알수록 수정 범위도 보임",
    "conditionalScene": "새 규칙이라면 목적과 예외 확인",
    "action": "따를 부분과 판단할 부분 나누기",
    "additionalEvidence": "실제 규칙·자료",
    "contrast": "인성 우세와 달리 정관 출발 경로 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:career",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "교육이 책임 수행에 연결되나요?",
    "core": "역할→학습→감당의 연결",
    "positive": "업무 기준을 절차로 익힘",
    "risk": "교육 수료를 실무 능력으로 착각",
    "excess": "책임마다 공부를 무한 추가",
    "unexpected": "모르는 부분을 묻는 것이 전문성임",
    "conditionalScene": "새 직무라면 사례·매뉴얼·담당자 확인",
    "action": "배운 기준을 실제 한 건에 적용",
    "additionalEvidence": "직무·교육·피드백",
    "contrast": "살인상생은 편관의 강한 제약을 중개",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:money",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "재무 규정을 내가 이해하나요?",
    "core": "의무를 자료로 해석하는 과정",
    "positive": "계약 설명을 판단 도구로 사용",
    "risk": "기관 권위만 믿고 조건 생략",
    "excess": "검토가 많아도 핵심 비용은 미확인",
    "unexpected": "설명이 명료하면 거래를 거절하기 쉬움",
    "conditionalScene": "계약을 검토한다면 수수료·의무의 근거 확인",
    "action": "요약을 원문 조건과 대조",
    "additionalEvidence": "실제 금융 계약·자료",
    "contrast": "재생관은 자원이 책임으로 가는 앞 단계",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:study",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "채점 기준을 이해로 바꾸나요?",
    "core": "평가 기준과 학습 지원",
    "positive": "루브릭으로 학습 방향 조정",
    "risk": "정답 설명을 암기로만 수용",
    "excess": "공식 해설 없이는 시도 못함",
    "unexpected": "규칙 이해가 변형 문제를 돕기도 함",
    "conditionalScene": "시험 준비라면 예제와 배점 연결",
    "action": "해설 없이 한 번 풀고 비교",
    "additionalEvidence": "실제 과목·평가 기준",
    "contrast": "인성다자는 기준의 출발점을 요구하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:love",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "관계를 분석하는 목적은 무엇인가요?",
    "core": "약속을 이해 가능한 말로 풀기",
    "positive": "서로의 기대를 구체화",
    "risk": "설명으로 감정 반응 대체",
    "excess": "올바른 답을 찾느라 대화 지연",
    "unexpected": "이해와 즉각적 공감은 함께 가능",
    "conditionalScene": "갈등이 있다면 약속의 의미부터 질문",
    "action": "해결 설명 전 감정 확인",
    "additionalEvidence": "실제 교제·대화",
    "contrast": "관성의 관계 사건을 추론하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:marriage",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "생활 규칙은 배우고 바꿀 수 있나요?",
    "core": "공동 기준을 학습·조정하는 과정",
    "positive": "역할을 절차로 공유",
    "risk": "모범 가정의 규칙을 그대로 적용",
    "excess": "매뉴얼화가 작은 차이까지 통제",
    "unexpected": "익힌 규칙도 둘에게 맞게 수정 가능",
    "conditionalScene": "가사 분담을 정하면 작업 기준도 공유",
    "action": "예외가 생길 때의 절차 합의",
    "additionalEvidence": "실제 공동생활·동의",
    "contrast": "살인상생의 위기 대응과 달리 일상 기준",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:family",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "가족의 기준을 이해와 구별하나요?",
    "core": "전해진 규범과 현재 판단",
    "positive": "배경을 알며 선택권 보존",
    "risk": "가족 설명을 절대 규칙으로 수용",
    "excess": "잘 이해하면 모두 따라야 한다고 생각",
    "unexpected": "이해하면서도 다른 선택 가능",
    "conditionalScene": "가족 관행을 논하면 이유와 현재 비용 확인",
    "action": "계승할 부분을 당사자끼리 결정",
    "additionalEvidence": "실제 관행·가족 의견",
    "contrast": "인성 기호는 가족 배경의 실제 사실이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:officer_resource:relationships",
    "targetId": "foundation:structure:officer_resource",
    "profileRef": "csr:profile:officer_resource",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "officer_resource:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:officer_resource#inference",
    "formationRef": "csr:profile:officer_resource#formation",
    "readerQuestion": "모임 규칙을 새 사람도 이해하나요?",
    "core": "규범 전달의 지원 경로",
    "positive": "자료로 참여 장벽 낮춤",
    "risk": "오래된 기준만 정답으로 유지",
    "excess": "친절한 안내가 규칙 과잉으로 변질",
    "unexpected": "쉽게 설명하다 보면 불필요한 규칙도 보임",
    "conditionalScene": "새 회원이 있다면 안내를 함께 검토",
    "action": "규칙의 목적과 문의 경로 공유",
    "additionalEvidence": "실제 집단·규칙",
    "contrast": "관성 강함 자체는 설명 지원을 보장하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:personality",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "어려움을 배움으로만 견디나요?",
    "core": "압박과 지원의 중개 여부",
    "positive": "문제에 맞는 도움 요청",
    "risk": "고통 자체를 성장 근거로 수용",
    "excess": "탐구가 무한 버티기로 변질",
    "unexpected": "도움 요청이 대응 역량일 수 있음",
    "conditionalScene": "낯선 과제가 있다면 지원부터 확인",
    "action": "배울 것과 중단할 조건 나누기",
    "additionalEvidence": "실제 제약·지원",
    "contrast": "관인상생과 편관 출발점이 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:career",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "위험한 과제에 훈련이 붙나요?",
    "core": "강한 요구→훈련→대응의 경로",
    "positive": "사례·지도자로 대응 체계 구축",
    "risk": "교육 없이 난제를 맡음",
    "excess": "문제 해결사가 모든 위기를 인수",
    "unexpected": "지원 체계가 있어야 도전이 학습이 됨",
    "conditionalScene": "장애 대응을 맡으면 매뉴얼·선임 확보",
    "action": "학습 결과를 복구 절차로 남기기",
    "additionalEvidence": "실제 직무·훈련·안전",
    "contrast": "식신제살은 직접 제어, 여기서는 인성 중개",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:money",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "급한 재무 판단에 검토 통로가 있나요?",
    "core": "압박을 정보 검토로 전환",
    "positive": "시간·전문 설명을 확보",
    "risk": "급함을 근거로 계약 수락",
    "excess": "조사량만 늘고 책임 조건은 미확인",
    "unexpected": "잠시 보류하는 것도 대응임",
    "conditionalScene": "급한 계약 제안이라면 검토 시간 요청",
    "action": "기한·의무·불확실 항목을 따로 기록",
    "additionalEvidence": "실제 계약·검토 가능성",
    "contrast": "재성 우세와 다른 제약→지원 경로",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:study",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "낯선 시험을 어디서부터 이해하나요?",
    "core": "난도와 학습 지원의 연결",
    "positive": "실패 지점을 자료로 변환",
    "risk": "어려울수록 좋은 교육이라 믿음",
    "excess": "난제 수집이 기본 숙련을 밀어냄",
    "unexpected": "쉬운 연습이 어려운 문제의 기반일 수 있음",
    "conditionalScene": "새 시험이라면 출제 기준·지도자 확인",
    "action": "한 오답의 원인을 추적",
    "additionalEvidence": "실제 시험·지원",
    "contrast": "인성다자는 편관 요구를 필수로 하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:love",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "상대의 어려움을 모두 해결하려 하나요?",
    "core": "관계 압박과 지원 선택",
    "positive": "듣기·정보·도움 중 필요한 것 확인",
    "risk": "아픔을 성장 기회로 설교",
    "excess": "해결 노력이 감정 확인을 대체",
    "unexpected": "답이 없어도 곁에 있는 지원 가능",
    "conditionalScene": "상대가 힘들다면 원하는 도움 질문",
    "action": "전문 도움과 내 역할 구별",
    "additionalEvidence": "실제 교제·요청",
    "contrast": "원국으로 상대의 고난을 만들지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:marriage",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "생활 위기를 배울 체계가 있나요?",
    "core": "공동 부담과 지원 경로",
    "positive": "대응 순서와 도움 창구 마련",
    "risk": "한 사람이 위기를 전담",
    "excess": "가족 문제를 모두 자기 과제로 연구",
    "unexpected": "역할을 줄여야 체계가 지속될 수 있음",
    "conditionalScene": "갑작스런 지출이라면 정보·담당 분리",
    "action": "재발 대응과 일상 회복을 함께 계획",
    "additionalEvidence": "실제 공동 문제·동의",
    "contrast": "관인상생의 일상 기준과 다른 강한 요구",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:family",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "가족 문제에 어떤 도움을 붙이나요?",
    "core": "부담의 전문 지원 연결",
    "positive": "당사자 동의로 도움 요청",
    "risk": "가족이니 모두 감당해야 한다고 생각",
    "excess": "배움으로 모든 문제를 해결하려 함",
    "unexpected": "내 역할 밖을 아는 것이 지원임",
    "conditionalScene": "돌봄 부담이 있다면 외부 자원 확인",
    "action": "가족 역할과 전문가 역할 구분",
    "additionalEvidence": "실제 가족 문제·동의",
    "contrast": "가족 고난 경험을 계산으로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  },
  {
    "id": "csr:application:salin_sangsaeng:relationships",
    "targetId": "foundation:structure:salin_sangsaeng",
    "profileRef": "csr:profile:salin_sangsaeng",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "salin_sangsaeng:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:salin_sangsaeng#inference",
    "formationRef": "csr:profile:salin_sangsaeng#formation",
    "readerQuestion": "집단의 위기를 혼자 연구하나요?",
    "core": "강한 요구의 공동 학습",
    "positive": "대응 지식을 공유",
    "risk": "문제 해결이 특정인에게 집중",
    "excess": "전문성이 상시 비상 대기로 변질",
    "unexpected": "지식을 나누면 의존이 줄 수 있음",
    "conditionalScene": "단체 문제가 있다면 사례·담당 기록",
    "action": "다음 담당자도 쓸 절차 작성",
    "additionalEvidence": "실제 집단 문제·권한",
    "contrast": "관성 압박 후보는 중개 지원을 미확인",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
