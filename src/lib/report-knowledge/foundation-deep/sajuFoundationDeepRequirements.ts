import type { DeepMaterial } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_HIDDEN_REQUIREMENTS = [
  {
    "id": "deep:hidden_requirement:子:personality",
    "targetId": "foundation:hidden_stem:子",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "子의 저장 집합 癸을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:career",
    "targetId": "foundation:hidden_stem:子",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "子의 저장 집합 癸을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:money",
    "targetId": "foundation:hidden_stem:子",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "子의 저장 집합 癸을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:study",
    "targetId": "foundation:hidden_stem:子",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "子의 저장 집합 癸을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:love",
    "targetId": "foundation:hidden_stem:子",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "子의 저장 집합 癸을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:marriage",
    "targetId": "foundation:hidden_stem:子",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "子의 저장 집합 癸을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:family",
    "targetId": "foundation:hidden_stem:子",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "子의 저장 집합 癸을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:子:relationships",
    "targetId": "foundation:hidden_stem:子",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "子의 저장 집합 癸을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:personality",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:career",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:money",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:study",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:love",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:marriage",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:family",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:丑:relationships",
    "targetId": "foundation:hidden_stem:丑",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "丑의 저장 집합 己·癸·辛을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:personality",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:career",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:money",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:study",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:love",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:marriage",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:family",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:寅:relationships",
    "targetId": "foundation:hidden_stem:寅",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "寅의 저장 집합 甲·丙·戊을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:personality",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "卯의 저장 집합 乙을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:career",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "卯의 저장 집합 乙을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:money",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "卯의 저장 집합 乙을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:study",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "卯의 저장 집합 乙을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:love",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "卯의 저장 집합 乙을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:marriage",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "卯의 저장 집합 乙을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:family",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "卯의 저장 집합 乙을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:卯:relationships",
    "targetId": "foundation:hidden_stem:卯",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "卯의 저장 집합 乙을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:personality",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:career",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:money",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:study",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:love",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:marriage",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:family",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:辰:relationships",
    "targetId": "foundation:hidden_stem:辰",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "辰의 저장 집합 戊·乙·癸을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:personality",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:career",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:money",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:study",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:love",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:marriage",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:family",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:巳:relationships",
    "targetId": "foundation:hidden_stem:巳",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "巳의 저장 집합 丙·戊·庚을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:personality",
    "targetId": "foundation:hidden_stem:午",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:career",
    "targetId": "foundation:hidden_stem:午",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:money",
    "targetId": "foundation:hidden_stem:午",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:study",
    "targetId": "foundation:hidden_stem:午",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "午의 저장 집합 丁·己을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:love",
    "targetId": "foundation:hidden_stem:午",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "午의 저장 집합 丁·己을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:marriage",
    "targetId": "foundation:hidden_stem:午",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:family",
    "targetId": "foundation:hidden_stem:午",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:午:relationships",
    "targetId": "foundation:hidden_stem:午",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "午의 저장 집합 丁·己을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:personality",
    "targetId": "foundation:hidden_stem:未",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:career",
    "targetId": "foundation:hidden_stem:未",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:money",
    "targetId": "foundation:hidden_stem:未",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:study",
    "targetId": "foundation:hidden_stem:未",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:love",
    "targetId": "foundation:hidden_stem:未",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:marriage",
    "targetId": "foundation:hidden_stem:未",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:family",
    "targetId": "foundation:hidden_stem:未",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:未:relationships",
    "targetId": "foundation:hidden_stem:未",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "未의 저장 집합 己·丁·乙을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:personality",
    "targetId": "foundation:hidden_stem:申",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:career",
    "targetId": "foundation:hidden_stem:申",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:money",
    "targetId": "foundation:hidden_stem:申",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:study",
    "targetId": "foundation:hidden_stem:申",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:love",
    "targetId": "foundation:hidden_stem:申",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:marriage",
    "targetId": "foundation:hidden_stem:申",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:family",
    "targetId": "foundation:hidden_stem:申",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:申:relationships",
    "targetId": "foundation:hidden_stem:申",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "申의 저장 집합 庚·壬·戊을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:personality",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "酉의 저장 집합 辛을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:career",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "酉의 저장 집합 辛을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:money",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "酉의 저장 집합 辛을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:study",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "酉의 저장 집합 辛을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:love",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "酉의 저장 집합 辛을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:marriage",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "酉의 저장 집합 辛을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:family",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "酉의 저장 집합 辛을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:酉:relationships",
    "targetId": "foundation:hidden_stem:酉",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "酉의 저장 집합 辛을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:personality",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:career",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:money",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:study",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:love",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:marriage",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:family",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:戌:relationships",
    "targetId": "foundation:hidden_stem:戌",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "戌의 저장 집합 戊·辛·丁을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:personality",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "personality",
    "readerQuestion": "어떤 판단 습관이 본인에게 확인되는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 성격에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간의 존재를 숨은 성격으로 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 장간의 십성",
      "투출·통근·월령·강약",
      "본인이 확인한 행동과 반례",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:career",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "career",
    "readerQuestion": "실제 업무의 어떤 요구와 연결되는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 직업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 직종·승진·능력을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 직업·권한·업무",
      "산출·재성·관성의 기존 근거",
      "월령·투출·지지 위치",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:money",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "money",
    "readerQuestion": "저장 자원과 실제 현금 흐름이 구별되는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 재물에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "藏干을 저축액·횡재로 환산",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 실제 재성 여부",
      "수입·부채·유동성·손실 한도",
      "재성의 생조·제약·투출",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:study",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "study",
    "readerQuestion": "실제 학습 과제에 필요한 지원은 무엇인가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 학업에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 지능·합격을 확정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "일간 대비 인성·식상 여부",
      "기초 수준·학습 환경·피드백",
      "인성의 생조와 산출 제약의 실제 관계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:love",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "love",
    "readerQuestion": "상대와 합의한 기대가 무엇인가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 연애에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "잠재적 관계나 호감을 사실로 생성",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "본인이 밝힌 관계 상태와 동의",
      "원국 전체의 관련 근거",
      "실제 대화·선호·경계",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:marriage",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "marriage",
    "readerQuestion": "공동생활의 비용·돌봄을 어떻게 나누는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 결혼에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "배우자 존재·결혼 시기·외도를 단정",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 혼인·동거 여부",
      "일지 위치와 일간 대비 관계",
      "상호 동의·공동 자원·가사 현실",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:family",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "family",
    "readerQuestion": "가족 지원의 당사자와 범위가 확인되는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 가족에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "부모·형제·자녀 사건을 만들어 냄",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 가족 구성과 당사자 동의",
      "년월일시의 실제 위치",
      "지원 여력·필요·갈등의 입력",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  },
  {
    "id": "deep:hidden_requirement:亥:relationships",
    "targetId": "foundation:hidden_stem:亥",
    "domain": "relationships",
    "readerQuestion": "어떤 모임의 어떤 약속을 검토하는가?",
    "coreMeaning": "亥의 저장 집합 壬·甲을 인간관계에 직접 투영할 수 없어 필요한 전제를 명시한다.",
    "positive": "필요한 기존 계산 근거와 실제 입력이 모두 갖춰진 경우에만 적용 후보의 타당성을 검토할 수 있다.",
    "caution": "장간으로 대인 능력·귀인을 보장",
    "differentiation": "저장 집합의 존재·일간 대비 상대 관계·실제 발현을 서로 다른 단계로 분리한다.",
    "prerequisites": [
      "실제 협업·모임 맥락",
      "비겁·식상·관성 등 전체 관계",
      "역할·보상·거절권의 합의",
      "새 계산·복합 규칙을 구현하지 않고 다음 연구의 요구사항으로만 보존한다."
    ],
    "evidenceLevel": "research_requirements_only",
    "review": "unverified_application_after_premise_review",
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "followUp": [
      "영역별 실제 전거와 복합 조건의 지원 범위를 확인해야 한다. 현재는 해석 재료가 아니다."
    ]
  }
] as const satisfies readonly DeepMaterial[];
