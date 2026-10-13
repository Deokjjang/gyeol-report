/** Offline authored semantic research. Import only from research tests; no runtime connection. */
import type { ApplicabilityResearch } from "./semanticResearchTypes";

export const SEMANTIC_APPLICABILITY: readonly ApplicabilityResearch[] = [
  {
    "id": "sar:app:ACTION_TEMPO",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ACTION_TEMPO",
    "products": {
      "comprehensive": {
        "question": "결정 뒤 착수 간격이 다른 특성과 어떻게 맞물리는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "마감과 검토 비용 사이 첫 작업은 언제 가능한가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "호감 표현을 시작할 시점과 상대 준비가 맞는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 착수 속도 차이는 어떤 대기 비용을 만드는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 전환에서 시험과 검토의 순서를 어떻게 나눌까?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "월별 기한 안에서 되돌릴 작은 행동은 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "데이트 제안에 답할 시간을 어떻게 알릴까?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "생활 수리의 착수 시점은 누가 합의할까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 준비 시간을 기다릴 수 있는 과제인가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공동 작업의 첫 산출물은 언제 주고받을까?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "지시 뒤 검토 시간과 착수 기한을 구분했는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "공동 투자 전 검토 기간과 실행일을 합의했는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "만남 제안에 즉답하지 않아도 약속을 유지할 수 있는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:ENERGY_DIRECTION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ENERGY_DIRECTION",
    "products": {
      "comprehensive": {
        "question": "안에서 정리하는 시간과 밖에서 교환하는 때는 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "발표 전 혼자 준비할 시간과 협의 시간을 확보했는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "애정은 사적 정리와 공개 표현 중 어디서 편해지는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "겉의 활동량과 안의 처리 방향을 구별했는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "역할이 바뀌어도 필요한 정리 통로는 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 공개 활동 뒤 정리 여백을 둘 수 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "대화 후 혼자 생각하는 시간을 어떻게 설명할까?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "같은 집에서 사적 정리와 함께 대화를 배분할까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "말을 바로 요구하기 전에 아이의 처리 시간을 보장했는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "회의 전 문서와 현장 토론 중 어떤 통로가 필요한가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "공개 발언을 역량 평가로 오인하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "협상 전 각자의 검토와 공동 논의가 모두 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "모임 참여와 사적 휴식 중 무엇을 요청하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:STRUCTURE_STYLE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STRUCTURE_STYLE",
    "products": {
      "comprehensive": {
        "question": "계획 선호와 상황 대응은 어떤 조건에서 바뀌는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "반복 운영과 탐색 업무에 같은 절차가 필요한가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계의 약속과 즉흥적인 즐거움은 어디서 조율할까?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 다른 계획 수준을 어떤 합의로 연결할까?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 배경 변화 때 유지할 기준과 바꿀 절차는 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "달라진 조건에 일정표를 갱신할 필요가 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "데이트 계획에서 필수 약속과 즉흥 구간은 무엇인가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가사 일정의 고정 항목과 예외를 구분했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "발달 단계에 맞는 일과와 선택 여지를 남겼는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공유 일정의 고정 기한과 개인 방법을 나눴는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "평가 기준은 고정하되 수행 방법의 재량을 주는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "운영 규칙을 바꿀 승인 절차가 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "정기 만남과 즉흥 연락을 서로 강요하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:COMMUNICATION_STYLE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "COMMUNICATION_STYLE",
    "products": {
      "comprehensive": {
        "question": "명료함과 관계 온도를 어떤 통로로 함께 전하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "피드백의 내용과 전달 형식을 구분하는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "이견과 애정 요청이 상대에게 알아듣게 전달되는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "직설·완곡 차이가 실제 뜻의 차이인가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "오래된 소통 방식이 새 역할에도 적합한가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "민감한 협의에 메시지와 대면 중 무엇이 맞는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "거절과 호감을 추측에 맡기지 않았는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "돈과 가사 이견의 요청을 분명히 했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 이해 수준에 맞게 요청을 설명하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "수정 요청의 기준과 말투를 따로 점검했는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "권력 차이 때문에 완곡해진 말을 알아듣는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "협상에서 확정 약속과 탐색 의견을 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "농담이 불편하다는 요청을 존중하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:CHANGE_ORIENTATION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CHANGE_ORIENTATION",
    "products": {
      "comprehensive": {
        "question": "익숙함과 새로움의 선호는 능력과 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "운영을 유지할 부분과 실험할 부분은 무엇인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "새 경험의 욕구와 관계의 예측 가능성을 나눌까?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "새로움의 양을 한쪽 기준으로 정하지 않는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "기간 변화의 계산과 개인의 변화 선호를 구별했는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "새 계획은 월별 여력과 일치하는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "새 데이트를 원하는 이유와 편한 방식이 다른가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "이사와 생활 방식 변경의 비용을 같이 봤는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "환경 변화에 적응할 시간을 아이에게 주는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "기존 도구 유지와 새 도구 시험의 범위는 어디인가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "조직 변경에 의견을 낼 통로가 있는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "새 시장 진입과 기존 고객 유지의 순서를 나눴는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "새 모임 참여를 우정의 증명으로 요구하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:DECISION_STYLE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "DECISION_STYLE",
    "products": {
      "comprehensive": {
        "question": "선택을 닫는 기준과 다시 여는 조건은 무엇인가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "결정권자와 추가 정보의 마감은 누구에게 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계 결정을 서두르거나 무기한 미루는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 결정 시점이 실제로 충돌하는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 선택을 재검토할 조건을 남겼는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 결정이 다음 달 수정 가능한가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계 정의를 언제 다시 이야기할지 합의했는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 생활 결정의 마감과 보류 이유를 공유했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이에게 선택지를 줄 때 선택 시간을 보장했는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "누가 어떤 근거로 최종 결정을 하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "팀원이 결정할 권한과 보고 기준은 명확한가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "의견 교착의 처리 절차가 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "장소 결정을 못 할 때 기한과 대안을 정하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:RELATION_STYLE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RELATION_STYLE",
    "products": {
      "comprehensive": {
        "question": "개인 공간과 연결 욕구를 애정과 분리해 설명할까?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "협업에 필요한 연결과 개인 집중의 경계는 어디인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "연락·친밀감·사생활의 기대가 합의됐는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "거리 선호가 서로의 거절로 오독되는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할 변화가 기존 관계의 공간에 미치는 조건은?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "월별 만남량이 실제 여력과 맞는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "연락 빈도가 다른 두 사람은 어떻게 합의할까?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "함께 살아도 각자 몰입할 시간을 인정하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호가 필요한 나이와 사생활 권한을 구별하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "협업 연락과 개인 시간의 경계가 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "업무상 연결을 사적 친밀감으로 요구하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "독립 운영 영역과 공동 승인 영역은 어디인가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "연락 간격을 우정의 크기로 재단하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:RISK_STYLE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RISK_STYLE",
    "products": {
      "comprehensive": {
        "question": "불확실성 감수와 목표의 크기를 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "허용 손실과 중단 조건이 있는 시도인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "친밀감의 속도에 안전과 동의가 확보됐는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "누가 감수하는 위험이며 누가 동의해야 하는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 전환에서 생계 안전판을 어떻게 유지할까?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "짧은 시험이 되돌릴 수 있는 범위인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "새 관계 경험을 거절할 자유가 있는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 자산의 위험 한도를 함께 정했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호자의 위험 선호를 아이에게 투사하지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "업무 실험의 실패 비용은 누가 부담하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "실패를 허용한다고 말하면서 불이익을 주지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "개인 낙관과 공동 자본의 위험을 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "모험 활동 참여를 친밀함의 조건으로 삼지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:INITIATIVE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "INITIATIVE",
    "products": {
      "comprehensive": {
        "question": "먼저 시작하는 행동과 속도·리더십은 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "문제 제안 뒤 실제 맡을 범위는 무엇인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "먼저 표현해도 상대의 답을 기다릴 수 있는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "한쪽만 관계의 시작을 맡고 있지는 않은가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "새 배경에서 먼저 시험할 작은 선택은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 스스로 시작할 수 있는 범위는 어디인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "연락을 먼저 하는 부담을 나눌 수 있는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "집안의 필요한 일을 누가 발견하고 제안하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "대신 해주기 전에 아이가 시작할 여지를 남기는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "발의와 업무 배정을 구분하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "팀원이 먼저 제안해도 결정권은 명확한가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "새 사업 제안자의 역할과 공동 동의를 구분했는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "항상 한 사람이 만남을 주선하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:GOAL_DRIVE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "GOAL_DRIVE",
    "products": {
      "comprehensive": {
        "question": "목표 지향성과 의미·경쟁은 어떻게 다르게 움직이는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "성과 목표가 직무·학습의 현실 조건과 맞는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계의 진도를 성과 목표처럼 취급하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 목표가 같아도 우선순위가 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 목표는 새 조건에서 유효한가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "올해 목표를 월별 가능한 단위로 나눌 수 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계의 속도를 한쪽 목표로 정하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "개인 목표와 가정의 공동 목표가 충돌하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호자 목표와 아이가 원하는 것을 구별하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공동 목표와 개인 평가 지표가 일치하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "목표 수치에 필요한 자원과 권한을 주는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "성장 목표와 이익 배분 기준이 합의됐는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구의 계획을 응원과 지시 중 어떻게 대하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:EXPANSION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "EXPANSION",
    "products": {
      "comprehensive": {
        "question": "범위를 넓히는 욕구와 유지 능력은 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "고객·업무·학습 범위를 늘릴 여력이 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "만남을 늘리는 것과 친밀감을 깊게 하는 것은 다른가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "한쪽의 확대가 상대의 부담을 늘리는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "새 장기 기회와 유지할 기반을 함께 보는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 확장에 필요한 시간과 비용은 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "함께할 활동 수가 상대에게도 적절한가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가족 계획을 넓힐 실제 여건과 동의가 있는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "새 활동을 늘리기 전에 아이의 피로를 확인했는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "업무 범위가 늘 때 인수인계와 인력이 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "역할 확대에 권한과 보상이 따라오는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "시장 확대와 현금·운영 여력을 함께 검토하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "새 사람을 소개할 때 친구의 의사를 물었는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:PERSISTENCE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "PERSISTENCE",
    "products": {
      "comprehensive": {
        "question": "오래 이어감과 바꿀 때를 아는 판단은 어떻게 공존하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "반복 연습과 손실 누적의 경계를 어디에 둘까?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계의 지속을 상대의 동의 없이 미덕으로 삼는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "계속하는 이유와 멈출 기준을 함께 말할 수 있는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 노력에서 유지할 가치와 매몰비용은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 반복이 실제 개선으로 이어지는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "거절 뒤 계속 연락하는 행동을 끈기로 포장하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "생활 약속을 유지하되 불공정한 분담을 고칠 수 있는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 연습 지속과 중단 신호를 함께 듣는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "막힌 작업을 계속할지 도움을 요청할지 합의했는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "버티는 팀원에게만 일을 맡기지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "손실 사업의 지속 기준과 종료 절차가 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "오랜 우정을 이유로 불편한 요청을 강요하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:ADAPTABILITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ADAPTABILITY",
    "products": {
      "comprehensive": {
        "question": "변화에 맞추는 능력과 새로움 선호를 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "바뀐 조건에 방법을 수정할 여지가 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "상대에게 맞추면서 자기 요구도 남기는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "상호 조정인가 한쪽만 참는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "전환의 전후 조건을 나누어 조정하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 바뀐 일정에 수정할 방법이 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "약속 변경 때 한쪽만 시간을 바꾸는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "생활 환경 변화의 부담을 어떻게 나눌까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "전환에 필요한 아이의 준비와 예측 정보를 주는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "새 요구가 들어오면 범위와 기한을 갱신하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "유연한 팀원에게 예외 업무를 몰지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "시장 변경에 계약·역할도 함께 갱신하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "취향이 바뀐 친구와 새 방식으로 만날 수 있는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:DEPTH",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "DEPTH",
    "products": {
      "comprehensive": {
        "question": "깊이 확인하는 대상과 멈출 기준은 무엇인가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "원인 분석이 의사결정에 필요한 깊이인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "상대의 말을 깊게 듣는 것과 추측을 구별하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "같은 대화에서 서로 원하는 깊이가 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 흐름의 원인과 삶의 실제 사건을 구별하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 분석으로 새 정보가 생기는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "짧은 답에 없는 속뜻을 꾸미지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "오래된 문제를 다룰 시간과 동의를 확보했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 마음을 해석하기보다 직접 물어보는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "원인 조사와 당장 복구할 일을 나누는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "심층 보고에 필요한 자료와 시간을 주는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "의사결정에 필요한 실사 범위를 정했는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "깊은 이야기를 나눌 준비가 서로 되어 있는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:CURIOSITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CURIOSITY",
    "products": {
      "comprehensive": {
        "question": "질문의 폭과 끝까지 이해하는 깊이는 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "새 질문이 업무·학습 목표와 연결되는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관심 질문이 상대의 사생활을 침범하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 궁금해하는 대상이 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 관심의 변화와 실제 기간 근거를 구분하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 확인할 질문과 미룰 질문은 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "호기심과 동의 없는 질문의 경계는 어디인가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가족의 새 관심을 자원 배분과 어떻게 조율할까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 질문을 정답 주입 없이 탐색하게 하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "새 가설을 시험할 자료를 함께 고르는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "질문을 지시 불복종으로 오독하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "새 분야 조사와 실행 약속을 구별하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구가 답하고 싶지 않은 질문을 멈추는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:PATTERN_SENSE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "PATTERN_SENSE",
    "products": {
      "comprehensive": {
        "question": "반복 발견과 원인 확정을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "고객·업무 데이터의 패턴에 반례가 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "한번의 반응을 관계 패턴으로 확대하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 관찰한 반복의 표본과 맥락이 같은가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "기간의 반복과 개인의 고정 성격을 혼동하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "월별 관찰이 충분해 반복이라 부를 수 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "늦은 답장 몇 번을 마음의 증거로 정하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가사 갈등의 반복에 바뀐 조건도 기록하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 한 행동을 고정 성격으로 낙인찍지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "오류의 재발 조건과 우연을 구별하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "팀원 한 명의 사례를 유형 전체로 일반화하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "시장의 반복이 다음 성과를 보장한다고 말하지 않는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구의 달라진 상황을 오래된 이미지에 가두지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:PRECISION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "PRECISION",
    "products": {
      "comprehensive": {
        "question": "오류 탐지·일관성·완성도는 어디서 따로 나타나는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "중요 오류와 사소한 차이에 다른 검토량을 쓰는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "말의 차이를 바로잡을 때 관계의 요청도 듣는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "둘의 정확성 기준이 같은 대상에 적용되는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 계획의 전제와 검토 범위를 갱신하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 수치·기한·문서의 실제 차이를 확인했는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "표현 실수를 애정의 결함으로 키우지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 지출 기록의 오차와 사람의 신뢰를 분리하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "작은 실수를 아이의 가치 평가로 삼지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "산출물 기준과 검수 책임을 명시했는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "피드백이 기준 설명인가 사람 비난인가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "계약 수치와 전제의 일관성을 함께 검토하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구 말의 사소한 오류를 고칠 필요가 있는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:LEARNING",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "LEARNING",
    "products": {
      "comprehensive": {
        "question": "지식 축적과 질문·성적을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "배운 내용을 실제 과제에 전이할 수 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계에서 배운 표현이 상대에게도 유효한가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 다른 학습 통로를 설명할 수 있는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "긴 기간에 배움을 쌓을 환경이 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 연습과 피드백의 주기가 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계 조언을 두 사람의 실제 합의로 검증하는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "새 생활 기술을 누가 어떻게 익히는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 연령과 이해 수준에 맞는 학습인가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "서로 아는 것을 전달할 자료가 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "교육 기회와 업무 평가를 공정하게 연결하는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "동업에 부족한 지식을 누가 검증할까?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구의 경험담을 보편 정답으로 강요하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:STRATEGY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STRATEGY",
    "products": {
      "comprehensive": {
        "question": "목표와 경로·제약을 연결하는 사고는 무엇인가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "우선순위와 대안 경로가 현실 자원과 맞는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "상대를 얻기 위한 조작과 상호 계획을 구별하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 계획에서 누가 비용을 부담하는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 경로의 분기와 수정 조건이 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "올해 계획을 이번 달 실행 순서로 좁힐 수 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계 계획에 상대의 선택권이 있는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 생활의 우선순위와 비상 계획을 합의했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 삶을 부모 전략의 도구로 삼지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "의존 작업과 병목을 함께 보는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "일정 전략에 팀원의 의견과 자원이 반영되는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "출구·교착·자본 배분의 계획이 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "만남을 사람 관리의 수단으로 취급하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:CREATION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CREATION",
    "products": {
      "comprehensive": {
        "question": "기존 것을 익히는 일과 새 결과를 만드는 일은 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "새 산출물의 용도와 검증 기준은 무엇인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "표현 방식의 새로움이 상대에게도 편안한가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "각자의 결과물에 공동 저작의 동의가 있는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 창작을 유지할 기반은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 만들 수 있는 작은 결과물은 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "서프라이즈가 상대의 원치 않는 공개가 아닌가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가정의 새 방식에 모두 참여할 선택이 있는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 작품을 부모 성과로 소유하지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "아이디어 제안과 산출물의 공로를 나누는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "새 방식 시험에 실패 여지를 주는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "공동 제작물의 소유와 사용권이 정해졌는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "함께 만든 것을 공개할 동의를 받았는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:EXPRESSION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "EXPRESSION",
    "products": {
      "comprehensive": {
        "question": "생각을 꺼내는 양·매체·명료함을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "말·글·시연 중 어떤 매체가 과제에 적합한가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "애정 표현의 통로와 상대가 받는 방식은 같은가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 다른 표현량을 마음의 크기로 읽지 않는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "기간 변화 속 표현 환경이 달라지는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 내용을 전달할 청자와 매체가 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "말보다 행동으로 표현할 통로도 인정하는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 생활의 요구를 구체적으로 말하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "말이 적은 아이에게 다른 표현 통로를 주는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "회의 발언과 문서 기여를 동등하게 보는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "조용한 팀원의 의견을 받을 통로가 있는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "외부 발표에서 공동 약속의 범위를 지키는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구의 개인 이야기를 허락 없이 공개하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:SOCIAL_ATTUNEMENT",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "SOCIAL_ATTUNEMENT",
    "products": {
      "comprehensive": {
        "question": "상대 신호를 알아차리는 일과 마음을 아는 일은 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "고객 반응과 실제 요구를 확인하는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "표정을 읽은 뒤 뜻을 직접 물어보는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "상대의 감정을 추측으로 확정하지 않는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할 변화 때 주변 기대를 재확인하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 신호가 상황 때문인지 확인했는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "상대가 괜찮다 할 때 추가 동의를 존중하는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "서로의 피로 신호를 말로 확인하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 표정에 없는 의도를 덧붙이지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "회의의 침묵에 의견을 낼 안전을 만드는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "권력 차이 때문에 감춘 반응을 고려하는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "협상 분위기와 계약 동의를 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구가 원할 때만 감정 이야기에 들어가는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:CARE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CARE",
    "products": {
      "comprehensive": {
        "question": "돌봄의 필요·동의·지속 가능성을 나눌까?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "지원이 상대의 업무 자율성을 지키는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "챙김이 원한 방식인지 확인하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "주는 돌봄과 받는 부담이 비대칭인가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "오랜 돌봄의 역할과 지원 자원이 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 가능한 도움과 한계를 알릴 수 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "도움을 거절해도 애정 부족으로 읽지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가사·돌봄 노동의 편중을 어떻게 조정할까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호와 아이의 자기 시도 사이를 어떻게 나눌까?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "대신 처리하기보다 필요한 도움을 물었는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "지원이 평가 압박이나 과잉 개입이 되지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "동업자 지원과 무상 노동을 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구가 도움보다 경청을 원하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:CHARISMA",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CHARISMA",
    "products": {
      "comprehensive": {
        "question": "주목·설득·동의를 서로 구분하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "발표의 존재감과 실제 업무 능력을 구분하는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "눈길을 끄는 것과 상호 호감을 구별하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "한 사람의 존재감이 다른 사람의 발언을 가리는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할에서 주목을 분담할 수 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 공개 기회의 조건과 여력이 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "매력을 상대의 거절권보다 앞세우지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "사회적 주목과 가정 내 권한을 구별하는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 주목받음을 성과 압박으로 만들지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "발표자의 공로가 공동 기여를 가리지 않는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "목소리 큰 사람에게만 기회를 주지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "대표자의 이미지와 실제 공동 권한이 일치하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "모임 중심이 한 사람으로 고정되지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:DUTY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "DUTY",
    "products": {
      "comprehensive": {
        "question": "맡은 역할·약속·경계가 어떻게 다른가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "책임에 필요한 권한과 자원이 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "애정과 의무를 구별해 합의하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "성실한 한 사람에게 책임이 몰리는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 책임을 유지·수정할 조건은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 약속의 범위를 갱신해야 하는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "연락을 의무화하기 전에 서로 합의했는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 생활의 보이지 않는 책임을 누가 지는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호자의 책임을 아이에게 떠넘기지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "인수인계의 완료 기준이 명확한가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "책임만 주고 권한을 빼지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "법적 의무와 개인 호의를 구별하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "부탁을 거절하면 우정을 의심하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:LEADERSHIP",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "LEADERSHIP",
    "products": {
      "comprehensive": {
        "question": "이끄는 행동과 직함·시작을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "방향 조율과 결정권의 범위가 맞는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "상대를 이끄는 말에 선택권이 남는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "주도권을 상황에 따라 교환할 수 있는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "새 역할에서 권한과 책임이 달라지는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 조율해야 할 실제 공동 목표가 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "데이트 결정을 한 사람이 독점하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가정 결정을 공동 권한으로 다루는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "보호 권한이 아이 의견을 지우지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공식 지휘권 없이 조율할 합의가 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "위임 뒤 결과를 검토하는 기준이 명확한가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "대표권과 동업자 의결권의 경계가 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "모임 주최자가 친구의 선택을 대신하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:AUTONOMY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "AUTONOMY",
    "products": {
      "comprehensive": {
        "question": "자기 선택과 타인에게 미치는 책임을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "직무 재량과 협업의 의존성이 명확한가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "친밀감 속 개인 공간을 합의했는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 독립 영역과 공동 영역은 어디인가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할 변경에 실제 선택권이 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 자율적으로 바꿀 수 있는 부분은 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "개인 시간을 연락 거절로 오독하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 결정과 개인 취향을 나눴는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "발달 단계에 맞는 자율 선택을 허용하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "업무 방법의 재량과 공유 결과를 분리하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "위임한 결정권을 뒤에서 회수하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "독립 집행 한도와 공동 승인이 정해졌는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구가 다른 모임을 선택할 권리를 인정하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:COMPETITION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "COMPETITION",
    "products": {
      "comprehensive": {
        "question": "비교의 자극과 적대감을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "성과 비교가 성장 정보인가 불공정한 압박인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계를 승패나 소유로 다루지 않는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 경쟁이 협력을 침해하는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 비교 기준이 자신의 가치와 맞는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 비교 지표가 실제로 유효한가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "다른 사람과 비교하며 애정을 시험하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "소득·가사 기여를 승패로 계산하지 않는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이를 타인과 비교해 동기를 강요하지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "개인 순위가 정보 공유를 막는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "평가 기준과 기회가 공정한가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "동업자 간 경쟁과 공동 이익을 어떻게 조율할까?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "게임 승패가 친구의 가치 평가가 되지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:BOUNDARY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "BOUNDARY",
    "products": {
      "comprehensive": {
        "question": "범위·동의·거절과 정확성을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "업무 범위와 추가 요청의 승인 기준은 무엇인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "사적 정보와 접촉에 동의가 있는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로의 경계가 다를 때 합의를 찾는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할 변화 때 기존 경계를 재협의하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 추가 요청을 거절할 통로가 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계의 친밀함이 사생활 침해를 허용하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 생활에서도 개인 소유와 정보가 존중되는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "안전을 위한 제한과 아이 사생활을 구별하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "동료의 업무 외 시간을 존중하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "권력 차이로 거절이 어려운 요청인가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "계약 범위와 우정의 부탁을 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "연락·돈·공개의 허용선을 물었는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:PRACTICALITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "PRACTICALITY",
    "products": {
      "comprehensive": {
        "question": "실행 가능한 선택과 가치 판단을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "비용·도구·기한을 고려한 적용인가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "효율이 관계의 감정 요청을 지우지 않는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "한쪽의 편리함이 다른 쪽의 수고인가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 목표를 유지할 현실 기반은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 실행 가능한 단위와 비용은 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "해결책 전에 상대가 원하는 도움을 묻는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "생활 개선의 편익과 노동을 같이 보는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이에게 맞는 실제 도구와 환경이 있는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "좋은 아이디어가 현재 도구로 구현 가능한가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "효율 목표에 실제 인력과 시간이 있는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "수익 가정과 운영 비용을 검증하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "효율적인 만남이 서로에게 편안한가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:RESOURCE_SENSE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RESOURCE_SENSE",
    "products": {
      "comprehensive": {
        "question": "흐름·보유·배분과 실제 부를 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "현금·시간·도구의 흐름을 볼 수 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "데이트 지출에 여력과 동의가 반영되는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "자원을 주고받는 방향이 공정한가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 비축과 사용의 목적을 구별하는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 한도와 실제 지출을 확인하는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "비용을 애정의 크기로 재단하지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "공동 예산과 개인 사용권을 합의했는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 필요와 보호자 지출 목표를 구별하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공유 자원 사용의 우선순위가 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "팀원의 시간도 자원으로 존중하는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "출자·현금흐름·이익 배분을 구분하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "빌린 돈과 선물의 조건을 명확히 하는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:OPPORTUNITY_SENSE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "OPPORTUNITY_SENSE",
    "products": {
      "comprehensive": {
        "question": "가능성 발견과 실제 실현 가능성을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "기회에 필요한 역량·자원·검증이 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "새 만남의 가능성과 상대의 선택은 다른가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "한쪽의 기회가 상대에게 의무가 되는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 배경에서 열릴 선택을 조건부로 보는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 기회의 기한과 확인할 정보는 무엇인가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "호감을 기회로만 취급해 동의를 놓치지 않는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "개인 기회와 공동 생활 비용을 함께 보는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이에게 열린 선택과 부모 기대를 구별하는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "새 제안이 기존 약속을 침해하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "기회 배분의 기준이 공개돼 있는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "거래 기회에 실제 수요와 위험을 확인하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "인맥을 친구에게 의무적으로 제공하게 하지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:STABILITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STABILITY",
    "products": {
      "comprehensive": {
        "question": "연속성·예측 가능성과 변화 거부를 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "운영 안전망과 개선 시험을 함께 둘 수 있는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "안심할 약속과 관계 통제를 구별하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "서로 안정감을 느끼는 조건이 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 변화 속 유지할 기반은 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 기본 생활을 지킬 여력이 있는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "예측 가능한 연락과 감시를 구별하는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "주거·예산·가사의 기본 합의가 있는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이에게 예측 가능한 일과와 변화 설명을 주는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "서비스 연속성과 변경 계획을 구분하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "팀원의 불확실성을 줄일 정보를 제공하는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "운영 기반과 성장 자본을 나눠 보는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "정기 만남이 의무나 배제가 되지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:STATUS_DRIVE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STATUS_DRIVE",
    "products": {
      "comprehensive": {
        "question": "인정 욕구와 실제 지위·역량을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "평가 기준과 본인이 원하는 인정이 일치하는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "상대의 지위를 관계 가치로 대체하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 인정 욕구가 발언권에 영향을 주는가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 역할 변화의 인정 기준이 달라지는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 가시적 성과와 실제 기여를 구분하는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계를 과시할 때 상대의 동의가 있는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "사회적 체면과 가족의 실제 필요를 나누는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 성취를 보호자의 명예로 삼지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "공로와 직함이 기여를 정확히 반영하는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "공개 칭찬과 공정한 평가가 연결되는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "대표 명의와 동업자 공로를 함께 보전하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "친구의 성공을 내 비교 순위로 읽지 않는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:MEANING",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "MEANING",
    "products": {
      "comprehensive": {
        "question": "가치·이유와 목표 성과를 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "보상과 일이 지닌 개인 가치가 어떻게 다른가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "관계의 의미를 상대에게 같은 답으로 요구하는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람이 중요하게 여기는 이유가 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 선택에서 지키고 싶은 가치는 무엇인가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 선택이 실제 가치와 연결되는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "관계의 의미를 각자의 말로 설명할 수 있는가?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가족의 공동 가치와 개인 가치를 나눌까?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 관심에 보호자 의미를 강요하지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "업무 목적을 이해하고 다른 의견을 낼 수 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "조직 명분이 무리한 희생을 정당화하지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "사업 목적과 의사결정 기준이 일치하는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "우정의 의미가 달라도 존중할 수 있는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  },
  {
    "id": "sar:app:RECOVERY_NEED",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "authored:scope-questions"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RECOVERY_NEED",
    "products": {
      "comprehensive": {
        "question": "휴식 필요와 내향성·진단을 구별하는가?",
        "gateRef": "sar:gate:product:comprehensive"
      },
      "career": {
        "question": "업무 부하와 회복 가능한 여백을 확인하는가?",
        "gateRef": "sar:gate:product:career"
      },
      "love": {
        "question": "연락을 쉬는 요청을 거절로 읽지 않는가?",
        "gateRef": "sar:gate:product:love"
      },
      "compatibility": {
        "question": "두 사람의 회복 시간과 돌봄 부담이 다른가?",
        "gateRef": "sar:gate:product:compatibility"
      },
      "major_fortune": {
        "question": "장기 책임을 버틸 지원과 휴식 조건이 있는가?",
        "gateRef": "sar:gate:product:major_fortune"
      },
      "annual_fortune": {
        "question": "이번 달 실제 피로와 휴식 여건을 확인하는가?",
        "gateRef": "sar:gate:product:annual_fortune"
      }
    },
    "relationships": {
      "love": {
        "question": "함께 쉬기와 혼자 쉬기의 동의를 나눌까?",
        "gateRef": "sar:gate:relationship:love"
      },
      "marriage": {
        "question": "가사·돌봄 속 쉬는 시간을 공정하게 나누는가?",
        "gateRef": "sar:gate:relationship:marriage"
      },
      "parentChild": {
        "question": "아이의 피로 신호를 게으름으로 부르지 않는가?",
        "gateRef": "sar:gate:relationship:parentChild"
      },
      "coworker": {
        "question": "동료의 회복을 위해 인수인계할 수 있는가?",
        "gateRef": "sar:gate:relationship:coworker"
      },
      "managerReport": {
        "question": "휴식을 허용하면서 평가 불이익을 주지 않는가?",
        "gateRef": "sar:gate:relationship:managerReport"
      },
      "businessPartner": {
        "question": "동업자의 부재를 대비할 운영 여력이 있는가?",
        "gateRef": "sar:gate:relationship:businessPartner"
      },
      "friendship": {
        "question": "모임을 쉬어도 우정이 유지되는가?",
        "gateRef": "sar:gate:relationship:friendship"
      }
    },
    "suitability": "conditional_question_candidate_only",
    "scope": "not_product_or_category_database"
  }
];
