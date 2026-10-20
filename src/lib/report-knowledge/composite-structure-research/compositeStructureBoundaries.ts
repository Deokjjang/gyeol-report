import type { CompositeBoundary } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_BOUNDARIES = [
  {
    "id": "csr:boundary:mokda_hwasik:personality",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "준비가 실제 표현을 막는다는 근거가 있나요?",
    "gap": "목생화 강화와 소멸을 구별할 전통 성립식 미확정",
    "additionalEvidence": "목·화·수·조습의 조건 및 실제 준비·실행 기록",
    "doNotApply": "계획이 많아 실행 못하는 사람이라고 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:career",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "지원 자료가 업무 산출을 방해하나요?",
    "gap": "영문 feeds_fire와 내부 출력 약화 풀이의 방향 충돌",
    "additionalEvidence": "업무의 입력·완료 과정과 화의 기반을 함께 확인",
    "doNotApply": "준비형 직업·실행 부족 직무 적성 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:money",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "자원 투입이 회수 지연의 원인인가요?",
    "gap": "목·화만으로 재성 경로와 경제적 회수 확인 불가",
    "additionalEvidence": "실제 원가·수요·회수와 식상생재 성립 여부",
    "doNotApply": "투자 실패나 매출 지연을 목다화식으로 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:study",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "교재가 많아서 성적이 떨어지나요?",
    "gap": "자료량과 학습 결과의 인과를 명리로 입증하지 못함",
    "additionalEvidence": "학습 시간·이해·연습 자료 및 명칭 교감",
    "doNotApply": "시험 결과를 목의 우세로 설명 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:love",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "생각이 많아 마음을 표현 못하나요?",
    "gap": "화의 소멸과 감정 표현 사이 직접 전거 없음",
    "additionalEvidence": "실제 대화·표현 선호 및 확정된 구조 정의",
    "doNotApply": "표현 부족·연애 실패 성향 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:marriage",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "생활 계획과 실행의 차이는 무엇인가요?",
    "gap": "계획·실행 비유는 기존 편집 가설로만 존재",
    "additionalEvidence": "실제 공동생활의 일정·역할 및 원국 조건",
    "doNotApply": "가사 실행 부족을 배우자 성격으로 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:family",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "가족의 준비가 선택을 막나요?",
    "gap": "목을 가족 지원으로 고정할 근거 없음",
    "additionalEvidence": "가족 요청·동의·실제 도움과 명칭 성립 확인",
    "doNotApply": "가족 간섭의 과거 사건 생성 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mokda_hwasik:relationships",
    "targetId": "foundation:structure:mokda_hwasik",
    "profileRef": "csr:profile:mokda_hwasik",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mokda_hwasik:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mokda_hwasik#inference",
    "formationRef": "csr:profile:mokda_hwasik#formation",
    "readerQuestion": "조언이 참여를 줄인다는 근거가 있나요?",
    "gap": "관계 행동과 목화 역전의 연결 미검증",
    "additionalEvidence": "실제 모임의 입력·산출·참여 기록",
    "doNotApply": "사교·협업 능력 부족으로 환산 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:personality",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수의 낮은 라벨이 내 행동을 설명하나요?",
    "gap": "물 부족→유연성 부족의 직접 전거 미확보",
    "additionalEvidence": "실제 판단 행동과 전체 생극·계절 조건",
    "doNotApply": "완고함·감정 부족·회복 부족 성격 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:career",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수 부족이 직무 선택의 근거인가요?",
    "gap": "오행 비중을 직업 능력으로 환산할 근거 없음",
    "additionalEvidence": "직무 경험·역량·관심과 실제 필요한 구조",
    "doNotApply": "물 관련 직업을 보충 처방으로 권하는 자료 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:money",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수가 적으면 돈의 흐름도 약한가요?",
    "gap": "수와 현금 흐름을 동일시하는 연결 미검증",
    "additionalEvidence": "실제 재무 자료·재성 및 전달 경로",
    "doNotApply": "유동성 부족·재운 부진을 라벨로 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:study",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수의 부재가 학습 방식을 결정하나요?",
    "gap": "수→지능·기억의 개인화 연결 미검증",
    "additionalEvidence": "실제 학습 기록과 전체 십성·구조",
    "doNotApply": "머리가 나쁨·암기 부족·특정 공부법 강제 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:love",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수가 적으면 관계가 메마르나요?",
    "gap": "물상과 애정 표현 사이 직접 근거 없음",
    "additionalEvidence": "실제 표현·선호·상대 반응",
    "doNotApply": "냉정함·공감 부족·연애 실패 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:marriage",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수가 필요한 공동생활인가요?",
    "gap": "오행 보충을 동거의 조절 처방으로 번역 불가",
    "additionalEvidence": "실제 공동생활·합의 및 전체 한난조습 검토",
    "doNotApply": "배우자 오행·혼인 성패를 보충 대상으로 지정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:family",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수가 적어 가족 도움이 없나요?",
    "gap": "수와 특정 가족 지원의 실제 존재를 연결 불가",
    "additionalEvidence": "실제 가족 경험·지원 요청·동의",
    "doNotApply": "부모·가족 부재나 단절 경험 생성 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:water_weak:relationships",
    "targetId": "foundation:structure:water_weak",
    "profileRef": "csr:profile:water_weak",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "water_weak:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:water_weak#inference",
    "formationRef": "csr:profile:water_weak#formation",
    "readerQuestion": "수가 적으면 관계를 조율 못하나요?",
    "gap": "수와 사교·중재 역량의 직접 연결 미검증",
    "additionalEvidence": "실제 역할·대화 방식·공동 작업 기록",
    "doNotApply": "사회성 부족·갈등 필연이라고 표시 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:personality",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "계절 조건이 성격을 단독 결정하나요?",
    "gap": "월령은 판단의 환경이지 독립 성격형이 아님",
    "additionalEvidence": "월령·통근·투출·생극과 실제 행동",
    "doNotApply": "봄생은 성장형·겨울생은 내향형 같은 환산 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:career",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "월령에서 직업을 바로 고를 수 있나요?",
    "gap": "계절 권한만으로 구체적 업무 역량 확인 불가",
    "additionalEvidence": "주객이 구분된 구조와 직무·숙련·권한",
    "doNotApply": "월지 하나로 직업군·성공 시기 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:money",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "월령이 재산 규모를 말하나요?",
    "gap": "월령 재성의 권한과 현실 자산은 다른 층위",
    "additionalEvidence": "재성 경로·일간 여력·실제 재무",
    "doNotApply": "득령 재성에서 부유함을 직접 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:study",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "득령한 요소가 좋은 학습법인가요?",
    "gap": "계절의 기세를 과목 적성으로 바꿀 근거 없음",
    "additionalEvidence": "학습 목표·경험과 적용 가능한 십성 흐름",
    "doNotApply": "월지로 시험 합격·학습 능력 확정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:love",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "계절이 연애 방식을 정하나요?",
    "gap": "월령과 실제 표현 방식 사이 독립 연결 없음",
    "additionalEvidence": "실제 교제·소통과 전체 배합",
    "doNotApply": "월지로 애정 성격이나 상대 유형 확정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:marriage",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "월령은 공동생활의 어떤 조건인가요?",
    "gap": "성립 조건일 뿐 결혼 양식의 독립 근거가 아님",
    "additionalEvidence": "실제 생활 합의·구조·부담 경로",
    "doNotApply": "월지로 배우자 성격·혼인 사건 생성 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:family",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "월령이 가족의 실제 모습을 말하나요?",
    "gap": "월주 위치 상징과 가족 사건은 구분해야 함",
    "additionalEvidence": "실제 가족 구성·경험·동의",
    "doNotApply": "월령을 부모 직업·재산·양육 방식으로 환산 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:season_command:relationships",
    "targetId": "foundation:structure:season_command",
    "profileRef": "csr:profile:season_command",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "season_command:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:season_command#inference",
    "formationRef": "csr:profile:season_command#formation",
    "readerQuestion": "같은 월령이면 관계 태도도 같나요?",
    "gap": "같은 계절에 다른 원국·생활 맥락이 존재",
    "additionalEvidence": "기타 기둥·십성 연결과 실제 집단 역할",
    "doNotApply": "월령만으로 사교성·동료 관계를 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:personality",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "약점을 돕는다는 말이 내 행동 처방인가요?",
    "gap": "명리의 강약 대상과 실제 능력은 다름",
    "additionalEvidence": "부억 대상·예외 및 실제 행동의 어려움",
    "doNotApply": "약한 오행의 성격을 억지로 만들라는 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:career",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "일에서 무엇을 더하고 덜어야 하나요?",
    "gap": "부억은 원국 조절 원리이며 업무 조언이 아님",
    "additionalEvidence": "직무 병목과 검증된 구조의 조절 대상",
    "doNotApply": "신강이면 무조건 창업·신약이면 취업 같은 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:money",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "재무 비중을 오행과 맞춰야 하나요?",
    "gap": "명리 균형과 자산 배분의 타당성은 별개",
    "additionalEvidence": "실제 위험·유동성·목표와 재무 근거",
    "doNotApply": "오행 개수에 따른 투자 비율·수익 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:study",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "약한 요소를 공부로 보충해야 하나요?",
    "gap": "부억의 도움과 학습 보충은 의미 층위가 다름",
    "additionalEvidence": "실제 학습 약점·과목 목표·지원 방식",
    "doNotApply": "용신 과목·색상으로 성적 향상 보장 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:love",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "상대가 내 약한 오행을 채워야 하나요?",
    "gap": "부억 대상을 상대에게 투사하는 연결 미지원",
    "additionalEvidence": "실제 관계 동의·양쪽 계산·관계 계약",
    "doNotApply": "부족 오행을 이유로 상대 선택·배제 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:marriage",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "결혼이 원국 균형을 완성하나요?",
    "gap": "부억 원리로 혼인의 필요·결과를 추론 불가",
    "additionalEvidence": "실제 공동생활 조건과 별도 관계 근거",
    "doNotApply": "결혼을 용신 보충 또는 운 개선 수단으로 표시 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:family",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "가족이 부족한 기운을 대신해야 하나요?",
    "gap": "생조 기호와 실제 가족 역할을 동일시 불가",
    "additionalEvidence": "실제 가족의 의사·자원·도움 요청",
    "doNotApply": "가족 희생을 명리적 보완 의무로 정당화 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:support_restraint:relationships",
    "targetId": "foundation:structure:support_restraint",
    "profileRef": "csr:profile:support_restraint",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "support_restraint:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:support_restraint#inference",
    "formationRef": "csr:profile:support_restraint#formation",
    "readerQuestion": "균형을 위해 특정 사람을 만나야 하나요?",
    "gap": "오행 조절과 사회적 관계의 상호성은 별개",
    "additionalEvidence": "실제 관계의 동의·목적·역할",
    "doNotApply": "특정 오행 사람에게 의존·회피 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:personality",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "차고 따뜻한 사주가 감정 온도인가요?",
    "gap": "한난은 작용 환경이며 실제 친절·냉정의 값이 아님",
    "additionalEvidence": "전체 한난 배합과 실제 행동·감정 자료",
    "doNotApply": "차가운 사주라 차가운 사람이라는 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:career",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "따뜻한 직업이 필요한가요?",
    "gap": "조후 기호와 산업·현장 온도를 연결 불가",
    "additionalEvidence": "실제 직무·환경·역량과 승인된 조후 판단",
    "doNotApply": "화 직종이 성공 처방이라는 직접 응용 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:money",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "한난이 현금의 흐름을 결정하나요?",
    "gap": "기후 조건과 거래·재산 결과의 직접 연결 없음",
    "additionalEvidence": "실제 재무 및 재성 작용의 검증된 경로",
    "doNotApply": "따뜻해지면 돈이 들어온다는 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:study",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "기후 조건이 공부의 속도를 정하나요?",
    "gap": "전통 작용 환경을 기억·집중 수치로 환산 불가",
    "additionalEvidence": "실제 학습 기록·지원·전체 구조",
    "doNotApply": "겨울생에게 특정 공부법을 고정 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:love",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "사주의 온도로 애정 표현을 읽나요?",
    "gap": "한난과 실제 관계의 감정 표현은 다름",
    "additionalEvidence": "실제 소통·선호 및 별도 관계 근거",
    "doNotApply": "따뜻한 배우자가 필수라고 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:marriage",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "온난 보완이 결혼의 조건인가요?",
    "gap": "조후와 공동생활 성패의 인과 미검증",
    "additionalEvidence": "실제 생활 조건·동의·개별 관계 해석",
    "doNotApply": "상대 오행으로 결혼 성패·시기 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:family",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "차가운 원국이 가족 분위기를 말하나요?",
    "gap": "물상과 실제 가족 정서 사이 근거 부족",
    "additionalEvidence": "실제 가족 경험과 현재 지원",
    "doNotApply": "냉정한 양육·가족 불화를 생성 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:temperature:relationships",
    "targetId": "foundation:structure:temperature",
    "profileRef": "csr:profile:temperature",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "temperature:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:temperature#inference",
    "formationRef": "csr:profile:temperature#formation",
    "readerQuestion": "한난으로 사람 사이 거리를 정하나요?",
    "gap": "계절 조건과 사회적 거리의 직접 연결 없음",
    "additionalEvidence": "실제 집단 역할·대화·선호",
    "doNotApply": "냉담함·친화력·중재 능력 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:personality",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "건조·습윤이 감정의 양인가요?",
    "gap": "조습은 감정량이나 성격 척도가 아님",
    "additionalEvidence": "조습 판단과 실제 행동을 분리한 자료",
    "doNotApply": "메마른 성격·감정 과잉이라는 환산 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:career",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "건조한 사주에는 유연한 일이 맞나요?",
    "gap": "물상과 직무 적성의 직접 근거 없음",
    "additionalEvidence": "실제 업무·숙련·환경과 전체 배합",
    "doNotApply": "조습으로 직업·업무 성과를 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:money",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "조습이 자원 순환을 뜻하나요?",
    "gap": "습함→돈 정체 같은 은유의 명리 근거 부족",
    "additionalEvidence": "실제 유동성·계약과 별도 재성 흐름",
    "doNotApply": "부동산·현금 비중을 조습으로 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:study",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "건습 조건으로 학습법을 고르나요?",
    "gap": "원국 환경과 학습 방식의 개인화 연결 없음",
    "additionalEvidence": "실제 과목·이해·연습 자료",
    "doNotApply": "메마른 원국은 암기형 같은 성격 변환 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:love",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "관계가 건조하다는 말은 계산 결과인가요?",
    "gap": "관계 은유와 명리 조습은 다른 개념",
    "additionalEvidence": "실제 교제·대화·표현 자료",
    "doNotApply": "애정 부족·감정 과다를 조습으로 판단 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:marriage",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "공동생활에 물의 보완이 필요한가요?",
    "gap": "조습을 생활·배우자 처방으로 번역 불가",
    "additionalEvidence": "전체 배합과 실제 생활의 동의·필요",
    "doNotApply": "수가 있는 상대가 결혼 해결책이라는 자료 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:family",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "조습이 가족의 정서 환경인가요?",
    "gap": "명리 물상과 실제 가족 경험을 연결하지 못함",
    "additionalEvidence": "실제 경험·가족 의사·지원 자료",
    "doNotApply": "가족 무관심·과보호 사건 생성 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:moisture:relationships",
    "targetId": "foundation:structure:moisture",
    "profileRef": "csr:profile:moisture",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "moisture:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:moisture#inference",
    "formationRef": "csr:profile:moisture#formation",
    "readerQuestion": "습한 원국은 관계가 끈끈한가요?",
    "gap": "기호 환경과 유대 강도 사이 근거 없음",
    "additionalEvidence": "실제 집단의 신뢰·경계·역할",
    "doNotApply": "유대감·의존·고립을 조습으로 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:personality",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "personality",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:personality 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "갈등 사이의 연결을 실제로 확인했나요?",
    "gap": "통관 원리만으로 개인의 중재 성향은 미확정",
    "additionalEvidence": "양 작용·중개·방해의 경로와 실제 행동",
    "doNotApply": "타고난 조정자라는 인격 배정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:career",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "career",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:career 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "업무 중간 자원이 문제를 풀어 주나요?",
    "gap": "중개 오행의 존재와 실무 프로세스는 별개",
    "additionalEvidence": "실제 병목·권한과 검증된 명리 경로",
    "doNotApply": "통관이 있으니 관리자·컨설턴트 적합 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:money",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "money",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:money 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "중간 거래가 자원을 이어 주나요?",
    "gap": "상생 연결과 수익·유동성은 다른 층위",
    "additionalEvidence": "실제 거래·비용·책임 및 재성 흐름",
    "doNotApply": "중개업·연쇄 투자 성공을 통관으로 예언 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:study",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "study",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:study 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "설명 하나가 이해를 연결하나요?",
    "gap": "통관을 학습 능력으로 환산할 직접 근거 부족",
    "additionalEvidence": "실제 막힌 개념·설명 효과와 별도 구조",
    "doNotApply": "통관이 곧 지능·융합 학습 재능이라는 단정 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:love",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "love",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:love 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "중개자가 관계 문제를 풀어야 하나요?",
    "gap": "원국의 중개와 실제 관계 중재는 별개",
    "additionalEvidence": "당사자 동의·문제·중재의 적합성",
    "doNotApply": "제삼자 개입이 무조건 해답이라는 처방 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:marriage",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "marriage",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:marriage 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "공동생활 갈등은 중개로만 풀리나요?",
    "gap": "통관만으로 갈등 해결 조건을 확정 불가",
    "additionalEvidence": "실제 안전·권한·동의와 문제 경로",
    "doNotApply": "부부 문제를 참거나 중개로 해소하라는 강제 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:family",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "family",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:family 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "가족 사이를 내가 이어야 하나요?",
    "gap": "통관을 가족 중재 의무로 바꿀 근거 없음",
    "additionalEvidence": "실제 가족의 의사·경계·책임",
    "doNotApply": "당사자 아닌 사람에게 화해 책임 부여 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  },
  {
    "id": "csr:boundary:mediation:relationships",
    "targetId": "foundation:structure:mediation",
    "profileRef": "csr:profile:mediation",
    "domain": "relationships",
    "class": "E_UNVERIFIED",
    "approvedForCustomer": false,
    "connectedToRuntime": false,
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "mediation:relationships 분야별 조건부 편집 연구. 문헌의 직접 생활 명제 아님."
      }
    ],
    "structuralMeaningRef": "csr:profile:mediation#inference",
    "formationRef": "csr:profile:mediation#formation",
    "readerQuestion": "갈등을 연결할 조건이 갖춰졌나요?",
    "gap": "오행 연결과 사회적 중재의 효과는 미검증",
    "additionalEvidence": "실제 양측 목표·권한·방해 조건",
    "doNotApply": "통관을 화해·관계 성공 보장으로 사용 금지",
    "researchAction": "구조 정의·작용 조건과 실제 분야 자료를 확보해 별도 연결 검토. 현재 직접 성향 진술로 승격하지 않는다."
  }
] as const satisfies readonly CompositeBoundary[];
