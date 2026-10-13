/** Offline authored semantic research. Import only from research tests; no runtime connection. */
import type { DirectionResearch } from "./semanticResearchTypes";

export const BIPOLAR_RESEARCH: readonly DirectionResearch[] = [
  {
    "id": "sar:direction:ACTION_TEMPO:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ACTION_TEMPO",
    "direction": -1,
    "label": "천천히 검토",
    "definition": "착수 전 확인할 시간을 둠",
    "positive": "되돌리기 어려운 실수를 줄임",
    "risk": "끝낼 기준 없이 검토를 연장",
    "environment": "안전 점검과 비가역 결정",
    "contrast": "속도와 시작 주도권은 다름",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:ACTION_TEMPO:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ACTION_TEMPO",
    "direction": 1,
    "label": "빠르게 행동",
    "definition": "작은 첫 행동을 일찍 실행",
    "positive": "실험에서 빠르게 피드백을 받음",
    "risk": "상대 준비와 안전 검토를 건너뜀",
    "environment": "되돌릴 수 있는 시험과 긴급 대응",
    "contrast": "빠른 실행도 검토 항목을 가질 수 있음",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:ENERGY_DIRECTION:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ENERGY_DIRECTION",
    "direction": -1,
    "label": "안으로 모음",
    "definition": "생각을 사적으로 정리한 뒤 꺼냄",
    "positive": "내부 검토로 말의 밀도를 높임",
    "risk": "정리 중이라는 신호가 없어 오해",
    "environment": "방해 없는 작업과 사전 준비",
    "contrast": "침묵은 사회적 관심 결핍과 다름",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:ENERGY_DIRECTION:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "ENERGY_DIRECTION",
    "direction": 1,
    "label": "밖으로 발산",
    "definition": "대화와 공개 활동으로 생각을 전개",
    "positive": "교환 과정에서 관점을 넓힘",
    "risk": "정리 전 내용을 확정안처럼 전달",
    "environment": "공동 발상과 실시간 토론",
    "contrast": "많이 말해도 친밀감은 별도 합의",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:STRUCTURE_STYLE:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STRUCTURE_STYLE",
    "direction": -1,
    "label": "유연·즉흥",
    "definition": "상황에 따라 순서와 방법을 조정",
    "positive": "예외 대응과 탐색에 여지를 둠",
    "risk": "공동 의존 일정까지 예고 없이 변경",
    "environment": "목표만 정해진 탐색 업무",
    "contrast": "유연함은 약속을 어기는 성격이 아님",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:STRUCTURE_STYLE:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "STRUCTURE_STYLE",
    "direction": 1,
    "label": "기준·계획",
    "definition": "기준과 순서를 먼저 명시",
    "positive": "공동 작업의 예측 가능성을 높임",
    "risk": "바뀐 조건에도 오래된 계획을 고수",
    "environment": "반복 운영과 여러 사람의 일정",
    "contrast": "계획 선호는 모든 오류 탐지와 다름",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:COMMUNICATION_STYLE:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "COMMUNICATION_STYLE",
    "direction": -1,
    "label": "완곡·간접",
    "definition": "관계의 온도를 살피며 뜻을 전달",
    "positive": "민감한 이야기에 진입할 여지를 만듦",
    "risk": "상대가 핵심 요청을 알아채야 함",
    "environment": "체면과 안전을 고려하는 협의",
    "contrast": "간접 표현이 거짓이나 비겁함은 아님",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:COMMUNICATION_STYLE:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "COMMUNICATION_STYLE",
    "direction": 1,
    "label": "직설·명확",
    "definition": "요청과 이견을 분명히 표현",
    "positive": "해석 비용과 재확인을 줄임",
    "risk": "내용의 명료함을 말의 공격성 면책으로 씀",
    "environment": "책임과 기한을 확인하는 협업",
    "contrast": "정확한 말도 배려와 공존 가능",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:CHANGE_ORIENTATION:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CHANGE_ORIENTATION",
    "direction": -1,
    "label": "익숙함·안정",
    "definition": "검증된 방식을 우선 유지",
    "positive": "생활과 서비스의 연속성을 보전",
    "risk": "변경 비용만 보고 개선 이익을 놓침",
    "environment": "중단 비용이 큰 운영",
    "contrast": "낯섦을 선호하지 않아도 적응은 가능",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:CHANGE_ORIENTATION:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "CHANGE_ORIENTATION",
    "direction": 1,
    "label": "변화·새로움",
    "definition": "새 방식과 다른 선택을 탐색",
    "positive": "익숙한 한계를 다른 방법으로 점검",
    "risk": "유지할 가치가 있는 방식도 교체",
    "environment": "대안 탐색과 개선 실험",
    "contrast": "새로움 선호가 변화 대응 능력을 보증하지 않음",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:DECISION_STYLE:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "DECISION_STYLE",
    "direction": -1,
    "label": "가능성을 열어둠",
    "definition": "선택지를 닫기 전 대안을 더 보유",
    "positive": "초기 정보의 편향을 줄임",
    "risk": "결정 시점이 필요한 상대를 기다리게 함",
    "environment": "불확실하고 추가 정보가 유효한 상황",
    "contrast": "열린 판단은 책임 회피와 다름",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:DECISION_STYLE:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "DECISION_STYLE",
    "direction": 1,
    "label": "결론·결정",
    "definition": "선택 기준에 따라 대안을 정리",
    "positive": "다음 행동과 책임을 분명히 함",
    "risk": "새 정보가 나와도 결론을 번복하지 않음",
    "environment": "행동이 다른 사람의 결정을 기다리는 상황",
    "contrast": "결론이 빨라도 행동 속도는 별개",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:RELATION_STYLE:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RELATION_STYLE",
    "direction": -1,
    "label": "자기 영역",
    "definition": "함께 있어도 개인 공간을 유지",
    "positive": "관계 안에서 각자의 집중을 보전",
    "risk": "연락 기준을 설명하지 않아 거절로 읽힘",
    "environment": "개별 몰입과 선택적 교류",
    "contrast": "개인 공간은 애정이나 CARE 부족의 증거가 아님",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:RELATION_STYLE:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RELATION_STYLE",
    "direction": 1,
    "label": "함께 연결",
    "definition": "공유 활동과 교류를 자주 선택",
    "positive": "필요한 연결과 공동 경험을 마련",
    "risk": "친밀함을 이유로 상대 공간까지 점유",
    "environment": "동의한 공동 활동과 상호 지원",
    "contrast": "함께 있음은 상대의 동의나 만족을 증명하지 않음",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:RISK_STYLE:negative",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RISK_STYLE",
    "direction": -1,
    "label": "안전·검토",
    "definition": "손실과 되돌릴 방법을 먼저 확인",
    "positive": "회복 불가능한 손실을 제한",
    "risk": "모든 불확실성을 제거하려 기회를 놓침",
    "environment": "생계와 공동 자산이 걸린 결정",
    "contrast": "신중함은 목표 부족과 다름",
    "defectInferenceAllowed": false
  },
  {
    "id": "sar:direction:RISK_STYLE:positive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "axis": "RISK_STYLE",
    "direction": 1,
    "label": "도전·감수",
    "definition": "허용 손실 안에서 불확실한 시도를 선택",
    "positive": "작은 시도로 새 가능성을 확인",
    "risk": "감수할 수 있는 자기 손실과 타인 손실을 혼동",
    "environment": "위험 한도와 중단 조건이 있는 실험",
    "contrast": "감수 성향은 투자 성공 확률이 아님",
    "defectInferenceAllowed": false
  }
];
