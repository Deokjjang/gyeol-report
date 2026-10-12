import type { CompositeApplication } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_APPLICATIONS_ABSENCE = [
  {
    "id": "csr:application:no_resource:personality",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "나는 실제로 어떻게 배우나요?",
    "core": "기호 부재와 실제 학습 방식의 분리",
    "positive": "이미 효과 있는 방식을 발견",
    "risk": "무인성을 배우지 못함으로 오해",
    "excess": "독학 가설을 사람의 고정 특성으로 확대",
    "unexpected": "강의·독학 모두 잘 맞을 수 있음",
    "conditionalScene": "새로 익힌 일이 있다면 경로를 돌아보기",
    "action": "효과 있던 도움을 구체적으로 적기",
    "additionalEvidence": "실제 학습 경험",
    "contrast": "신약과 달리 여력 부족을 뜻하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:career",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "직무 지원을 어떤 방식으로 받나요?",
    "core": "인성 기호 밖의 실제 지원 확인",
    "positive": "현장·문서·동료 도움을 비교",
    "risk": "도움이 필요 없다고 처방",
    "excess": "경험 학습을 이유로 교육 생략",
    "unexpected": "정식 교육이 가장 맞을 수도 있음",
    "conditionalScene": "새 직무라면 필요한 안내를 질문",
    "action": "학습 방식별 실제 효과 기록",
    "additionalEvidence": "실제 직무·지원",
    "contrast": "무인성만으로 현장형 직업을 배정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:money",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "모르는 계약을 어디서 확인하나요?",
    "core": "지식 기호와 재무 이해의 구분",
    "positive": "이해 안 된 조건을 질문",
    "risk": "무인성이니 감으로 거래",
    "excess": "독립 판단이 검토 거절로 변질",
    "unexpected": "외부 설명을 활용해도 기호와 모순 아님",
    "conditionalScene": "계약이 있다면 모르는 항목 표시",
    "action": "적절한 검토 창구 이용",
    "additionalEvidence": "실제 계약·이해 수준",
    "contrast": "재성이나 투자 적성을 부재에서 만들지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:study",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "어떤 설명이 나에게 도움이 됐나요?",
    "core": "실제 학습 통로를 여는 질문",
    "positive": "자료·연습·지도 효과 비교",
    "risk": "독학형이라고 고정",
    "excess": "설명이 필요 없는 사람으로 취급",
    "unexpected": "체계적인 설명을 선호할 수도 있음",
    "conditionalScene": "공부가 막히면 방식별 짧게 시험",
    "action": "잘 된 방법을 결과로 확인",
    "additionalEvidence": "실제 학습 기록",
    "contrast": "인성다자의 반대 능력 척도가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:love",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "상대의 마음을 무엇으로 확인하나요?",
    "core": "추측 대신 실제 대화",
    "positive": "필요한 정보를 직접 들음",
    "risk": "무인성을 공감 부족으로 해석",
    "excess": "독립성을 이유로 도움 대화 생략",
    "unexpected": "상세한 설명이 친밀함을 돕기도 함",
    "conditionalScene": "오해가 있다면 해석보다 질문",
    "action": "들은 말과 추측을 분리",
    "additionalEvidence": "실제 교제·대화",
    "contrast": "부재가 감정 이해 부족을 뜻하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:marriage",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "생활 지식을 누구와 나누나요?",
    "core": "기호 밖의 공동 학습",
    "positive": "도움 되는 자료를 함께 선택",
    "risk": "배울 필요가 없다고 생각",
    "excess": "시행착오를 항상 최선으로 처방",
    "unexpected": "매뉴얼이 가장 효율적인 경우도 있음",
    "conditionalScene": "새 생활 일을 맡으면 안내 확인",
    "action": "알고 싶은 단계부터 공유",
    "additionalEvidence": "실제 공동생활·지식",
    "contrast": "관인상생의 계산된 지원 경로와 구분",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:family",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "가족 도움은 실제로 어떤 형태인가요?",
    "core": "인성 부재와 가족사의 경계",
    "positive": "현재 지원의 유무를 직접 확인",
    "risk": "부모 도움 없었다고 추정",
    "excess": "독립을 가족 단절로 해석",
    "unexpected": "가족 지원이 충분해도 무인성일 수 있음",
    "conditionalScene": "도움을 논한다면 실제 필요 질문",
    "action": "원하는 도움과 가능한 도움 연결",
    "additionalEvidence": "실제 가족 경험·동의",
    "contrast": "인성은 부모 존재의 측정값이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_resource:relationships",
    "targetId": "foundation:structure:no_resource",
    "profileRef": "csr:profile:no_resource",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_resource:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_resource#inference",
    "formationRef": "csr:profile:no_resource#formation",
    "readerQuestion": "도움을 묻고 받을 통로가 있나요?",
    "core": "관측되지 않은 기호와 실제 사회 자원",
    "positive": "필요한 조언을 구체적으로 요청",
    "risk": "조언을 싫어한다고 고정",
    "excess": "자립 처방이 고립을 정당화",
    "unexpected": "외부 지원을 활발히 쓰는 사람일 수 있음",
    "conditionalScene": "공동 일을 한다면 문의 담당 확인",
    "action": "질문 가능한 통로를 명시",
    "additionalEvidence": "실제 관계·지원",
    "contrast": "비겁 등 다른 지원 경로도 확인 필요",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
  },
  {
    "id": "csr:application:no_output:personality",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "나는 어떤 방식으로 생각을 드러내나요?",
    "core": "기호 부재와 실제 표현의 분리",
    "positive": "여러 표현 방법을 비교",
    "risk": "무식상을 침묵으로 단정",
    "excess": "행동형이라는 가설을 고정 성격으로 확대",
    "unexpected": "말·글을 능숙하게 쓸 수도 있음",
    "conditionalScene": "전하고 싶은 일이 있다면 방식 선택",
    "action": "상대가 이해했는지 확인",
    "additionalEvidence": "실제 표현 경험",
    "contrast": "식상 약함과 0 관측은 다름",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:career",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "일의 결과를 어떻게 보여 주나요?",
    "core": "식상 기호 밖의 실제 산출",
    "positive": "능력의 증거를 작업물로 확인",
    "risk": "표현 직무를 배제",
    "excess": "조용한 업무만 맞는다고 처방",
    "unexpected": "발표·제작을 잘할 수도 있음",
    "conditionalScene": "성과를 설명해야 하면 실제 사례 정리",
    "action": "직무 요구와 경험을 대조",
    "additionalEvidence": "실제 직무·포트폴리오",
    "contrast": "부재로 창작 능력·직업을 결정하지 않음",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:money",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "가치와 조건을 어떻게 설명하나요?",
    "core": "기호와 거래 전달 능력의 구분",
    "positive": "설명·문서의 효과를 검증",
    "risk": "협상 못한다고 단정",
    "excess": "말하지 않아도 알아준다고 가정",
    "unexpected": "명확한 계약 설명이 강점일 수 있음",
    "conditionalScene": "거래가 있다면 전달된 조건 확인",
    "action": "합의 내용을 문서로 남기기",
    "additionalEvidence": "실제 거래·대화",
    "contrast": "생재 경로는 별도 근거 없으면 미확정",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:study",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "배운 것을 어떻게 확인하나요?",
    "core": "표현 기호와 학습 출력의 구별",
    "positive": "말·글·문제 풀이를 시험",
    "risk": "이론형 학습자라고 고정",
    "excess": "실습을 피해야 한다고 처방",
    "unexpected": "발표가 가장 좋은 검증일 수 있음",
    "conditionalScene": "학습한 내용이 있다면 편한 방식으로 재현",
    "action": "실제 이해 결과로 방식 선택",
    "additionalEvidence": "실제 과목·숙련",
    "contrast": "인성 유무도 함께 별도 확인",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:love",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "마음을 전달한 방식이 인식됐나요?",
    "core": "표현과 수용의 실제 확인",
    "positive": "상대에게 맞는 방식을 탐색",
    "risk": "무식상이니 말 안 해도 된다고 생각",
    "excess": "행동만으로 충분하다고 처방",
    "unexpected": "직접 말하는 것이 가장 편할 수도 있음",
    "conditionalScene": "감사를 전하면 어떻게 들렸는지 질문",
    "action": "말·시간·도움의 선호 비교",
    "additionalEvidence": "실제 교제·반응",
    "contrast": "식상 부재는 애정 부족이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:marriage",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "약속과 감정을 어떤 방식으로 나누나요?",
    "core": "공동생활의 전달 방식",
    "positive": "서로 알아듣는 형식 합의",
    "risk": "표현을 포기하는 근거로 사용",
    "excess": "역할 수행으로 모든 감정 대체",
    "unexpected": "말로 확인하면 오해가 줄 수도 있음",
    "conditionalScene": "일정이 바뀌면 명확한 통로로 알리기",
    "action": "전달 여부를 함께 확인",
    "additionalEvidence": "실제 공동생활·대화",
    "contrast": "무자녀·혼인 불안으로 추정 금지",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:family",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "가족에게 필요한 말을 하고 있나요?",
    "core": "가족 대화의 실제 통로",
    "positive": "익숙한 방식 밖도 시험",
    "risk": "말 없는 가족이었다고 추정",
    "excess": "행동으로만 증명해야 한다고 처방",
    "unexpected": "편지·대화가 잘 맞을 수 있음",
    "conditionalScene": "요청이 있다면 원하는 것을 직접 말하기",
    "action": "반응으로 전달 방법 조정",
    "additionalEvidence": "실제 가족 대화",
    "contrast": "식상은 실제 자녀 존재의 증거가 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  },
  {
    "id": "csr:application:no_output:relationships",
    "targetId": "foundation:structure:no_output",
    "profileRef": "csr:profile:no_output",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "no_output:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:no_output#inference",
    "formationRef": "csr:profile:no_output#formation",
    "readerQuestion": "모임에서 어떤 참여가 편한가요?",
    "core": "참여 형식과 기호 부재의 분리",
    "positive": "발표·기록·진행을 실제로 선택",
    "risk": "발언 능력이 없다고 판단",
    "excess": "후방 역할만 배정",
    "unexpected": "사회적 발표가 강점일 수도 있음",
    "conditionalScene": "역할을 나눈다면 당사자 선호 질문",
    "action": "시도 후 적합성을 확인",
    "additionalEvidence": "실제 집단·선호",
    "contrast": "내향성·사회성의 계산값이 아님",
    "doNotApply": "프로필의 성립이 미확정이거나 이 분야의 실제 맥락·당사자 동의가 없으면 성향·사건 진술로 사용하지 않는다. 표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
  }
] as const satisfies readonly CompositeApplication[];
