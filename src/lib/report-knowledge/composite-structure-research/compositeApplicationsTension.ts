import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_TENSION = [
  {
    "id": "csr:application:sanggwan_gyeongwan:personality",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "맞는 말이 어떤 기준을 건드리나요?",
    "core": "수정 요구와 기존 규범의 접점",
    "positive": "논점과 전달 방식 분리",
    "risk": "사람을 논박하며 기준은 미확인",
    "excess": "빈틈 발견이 모든 합의 부정으로 변질",
    "unexpected": "질문이 대립보다 기준을 드러냄",
    "conditionalScene": "규칙이 이상하다면 목적부터 확인",
    "action": "반례와 개선안을 함께 제시",
    "additionalEvidence": "실제 규칙·의견",
    "contrast": "관살혼잡은 요구 두 종류의 혼재",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:career",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "개선안에 실행 통로가 있나요?",
    "core": "비판에서 제도 수정으로 가는 조건",
    "positive": "근거와 대안으로 변경 제안",
    "risk": "권한 없이 즉시 규칙 폐기",
    "excess": "정확한 지적이 공개 망신으로 변질",
    "unexpected": "단계적 시험이 기준을 바꿀 수 있음",
    "conditionalScene": "업무 규정이 불편하면 담당과 시범 범위 확인",
    "action": "개선 효과와 부작용을 같이 기록",
    "additionalEvidence": "실제 권한·규정",
    "contrast": "식상생재는 교환 목적지이며 정관 제어와 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:money",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "계약의 허점을 어떤 절차로 고치나요?",
    "core": "불합리 조항과 공식 책임",
    "positive": "근거를 들어 수정 협의",
    "risk": "내 해석만으로 의무 무시",
    "excess": "지적이 거래 전체 불신으로 확대",
    "unexpected": "수정 가능한 조항을 좁히면 합의 쉬움",
    "conditionalScene": "계약이 불리하다면 문제 조항 표시",
    "action": "공식 확인·수정 여부 기록",
    "additionalEvidence": "실제 계약·전문 검토",
    "contrast": "법적 분쟁을 구조로 예언하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:study",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "정답의 한계를 어떻게 검증하나요?",
    "core": "창의적 풀이와 채점 기준",
    "positive": "대안과 조건을 함께 설명",
    "risk": "채점 기준을 몰라 유효한 답도 손해",
    "excess": "비판이 기본 개념 학습을 대체",
    "unexpected": "먼저 기준을 알면 반례도 정확해짐",
    "conditionalScene": "다른 풀이를 쓰면 요구 조건부터 확인",
    "action": "표준 풀이와 차이를 적기",
    "additionalEvidence": "실제 과목·평가",
    "contrast": "무조건 반항적 학생이라는 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:love",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "서운함을 옳고 그름으로만 말하나요?",
    "core": "감정 표현이 관계 규칙을 건드리는 지점",
    "positive": "필요와 요청을 구체화",
    "risk": "대화가 상대 심판으로 바뀜",
    "excess": "논리적 설명이 감정의 존재를 지움",
    "unexpected": "합의한 규칙을 함께 고칠 수 있음",
    "conditionalScene": "다툼이 있다면 감정과 규칙을 따로 말하기",
    "action": "상대가 들은 의미 확인",
    "additionalEvidence": "실제 교제·대화",
    "contrast": "관성을 배우자의 실제 성격으로 읽지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:marriage",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "기존 생활 규칙을 누가 바꿀 수 있나요?",
    "core": "공동 규범 수정의 합의",
    "positive": "비효율을 구체적으로 개선",
    "risk": "한쪽이 기존 약속 일방 폐기",
    "excess": "개선이 끝없는 교정으로 변질",
    "unexpected": "작은 예외가 더 공정한 규칙을 만듦",
    "conditionalScene": "가사 규칙이 안 맞으면 시범 변경 합의",
    "action": "변경 후 두 사람의 비용 비교",
    "additionalEvidence": "실제 공동생활·동의",
    "contrast": "관살혼잡의 이중 요구와 다른 규칙 제어",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:family",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "가족 관행을 바꾸는 말은 닿나요?",
    "core": "관행 비판과 가족의 의미",
    "positive": "대안으로 세대 차이 대화",
    "risk": "관행을 지킨 사람까지 폄하",
    "excess": "수정 의지가 관계 단절 처방으로 확대",
    "unexpected": "관행의 목적을 살린 변경 가능",
    "conditionalScene": "명절 방식이 힘들면 비용·목적 같이 확인",
    "action": "한 항목의 대안부터 제안",
    "additionalEvidence": "실제 관행·가족 동의",
    "contrast": "부모와 갈등했다는 과거 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:sanggwan_gyeongwan:relationships",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "profileRef": "csr:profile:sanggwan_gyeongwan",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "sanggwan_gyeongwan:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:sanggwan_gyeongwan#inference",
    "formationRef": "csr:profile:sanggwan_gyeongwan#formation",
    "readerQuestion": "지적을 받은 사람도 참여할 수 있나요?",
    "core": "집단 기준의 공개 수정",
    "positive": "문제와 사람의 평가 분리",
    "risk": "공개 지적이 방어만 유발",
    "excess": "정확함이 발언권 독점으로 변질",
    "unexpected": "질문 방식이 새 기준을 합의하게 함",
    "conditionalScene": "모임 운영이 불편하면 근거·대안 공유",
    "action": "담당자가 답할 시간을 남기기",
    "additionalEvidence": "실제 집단·규칙",
    "contrast": "관성 강함 자체와 다른 출력→규범 긴장",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:personality",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "서로 다른 기준을 동시에 따르나요?",
    "core": "안정 규칙과 긴급 요구의 구분",
    "positive": "상황별 우선순위 명시",
    "risk": "모든 요구를 최고 기준으로 수용",
    "excess": "민감함이 자기 기준의 상시 변경",
    "unexpected": "충돌을 인식하면 기준을 물을 수 있음",
    "conditionalScene": "지시가 다르면 무엇이 우선인지 확인",
    "action": "기준·예외·책임자를 적기",
    "additionalEvidence": "실제 복수 요구",
    "contrast": "관성 강함만으로 요구 충돌을 확정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:career",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "평소 절차와 긴급 지시가 맞나요?",
    "core": "업무 요구의 주객 정리",
    "positive": "긴급 예외의 승인자 확인",
    "risk": "속도와 절차 실패를 모두 개인 탓",
    "excess": "대응력이 책임 떠안기로 변질",
    "unexpected": "상충 기준을 가시화하면 운영 개선 가능",
    "conditionalScene": "상사 지시가 다르면 우선순위 공동 확인",
    "action": "변경 지시를 기록하고 공유",
    "additionalEvidence": "실제 지시·권한",
    "contrast": "상관견관은 내가 기준을 제어하는 경로",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:money",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "안정과 속도 기준을 구분하나요?",
    "core": "재무 의무의 상충 요구",
    "positive": "유동성과 수익 목표를 분리",
    "risk": "급한 회수와 장기 약속을 혼합",
    "excess": "모든 기대를 충족하려 무리한 거래",
    "unexpected": "거래별 기준을 나누면 불필요한 긴장 감소",
    "conditionalScene": "공동 자금이라면 사용·회수 기준 확인",
    "action": "긴급 지출 승인 절차 합의",
    "additionalEvidence": "실제 자금·합의",
    "contrast": "혼잡은 손실·사기 예언이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:study",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "과목마다 평가 방식이 다른가요?",
    "core": "서로 다른 학업 기준",
    "positive": "평가별 연습 방식 선택",
    "risk": "암기와 창의 요구를 뒤섞음",
    "excess": "모든 방식에 완벽을 요구",
    "unexpected": "기준 차이가 전략을 분리하는 단서",
    "conditionalScene": "여러 시험이면 과목별 채점표 대조",
    "action": "필수 방식과 선택 방식을 나누기",
    "additionalEvidence": "실제 과목·채점",
    "contrast": "관인상생은 지원 경로, 혼잡은 기준 정리",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:love",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "상대의 기대가 일관된가요?",
    "core": "관계 규칙과 상황 요구의 구분",
    "positive": "바뀌는 기대를 함께 설명",
    "risk": "서로 모순된 기대를 모두 수용",
    "excess": "책임감이 상시 눈치 보기로 변질",
    "unexpected": "기준을 말로 확인하면 오해가 줄 수 있음",
    "conditionalScene": "같은 행동에 반응이 다르면 상황 질문",
    "action": "평소 약속과 예외를 합의",
    "additionalEvidence": "실제 교제·상호 동의",
    "contrast": "복수 연애·부정직을 혼잡으로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:marriage",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "공동 규칙과 긴급 예외를 나누나요?",
    "core": "일상 기준과 급한 역할",
    "positive": "예외 처리의 책임 합의",
    "risk": "예외가 영구 의무로 굳음",
    "excess": "안정 유지가 변화 거부로 변질",
    "unexpected": "예외에 끝을 정하면 규칙도 유지 가능",
    "conditionalScene": "돌발 일정이면 누가 무엇을 바꿀지 확인",
    "action": "예외 종료 후 역할 복귀 합의",
    "additionalEvidence": "실제 공동생활",
    "contrast": "배우자 수·혼인 불안을 구조로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:family",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "가족의 서로 다른 요구를 누가 정하나요?",
    "core": "가족 기대의 우선순위",
    "positive": "당사자별 요구를 분리",
    "risk": "모두 만족시키려 일정 과밀",
    "excess": "조정 능력이 전달자 역할 고정으로 변질",
    "unexpected": "직접 대화가 중개 부담을 줄일 수 있음",
    "conditionalScene": "가족 요청이 충돌하면 한자리에서 확인",
    "action": "결정권과 부담을 같은 사람에게 연결",
    "additionalEvidence": "실제 가족 요청",
    "contrast": "관성 압박형은 지원 부족 조건이 별도",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  },
  {
    "id": "csr:application:gwansal_honjob:relationships",
    "targetId": "foundation:structure:gwansal_honjob",
    "profileRef": "csr:profile:gwansal_honjob",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "gwansal_honjob:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:gwansal_honjob#inference",
    "formationRef": "csr:profile:gwansal_honjob#formation",
    "readerQuestion": "모임마다 역할 기준이 다른가요?",
    "core": "집단별 요구의 경계",
    "positive": "참여 범위와 기준을 명시",
    "risk": "한 집단의 기준을 다른 집단에 적용",
    "excess": "적응이 개인 기준 상실로 변질",
    "unexpected": "집단마다 다른 역할을 택할 수 있음",
    "conditionalScene": "단체를 여러 곳 맡으면 일정·의무 대조",
    "action": "각 모임의 수락 범위 따로 정하기",
    "additionalEvidence": "실제 집단·의무",
    "contrast": "비겁다자는 동류 비중이며 관살의 주객과 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
