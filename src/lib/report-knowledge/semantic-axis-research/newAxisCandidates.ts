/** Offline research only. */
import type { NewAxisCandidate } from "./semanticResearchTypes";
export const NEW_AXIS_CANDIDATES: readonly NewAxisCandidate[] = [
  {
    "id": "sar:new-axis:uncertainty-calibration",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "follow_up_required",
    "sourceRefs": [
      "repo:foundationRanking",
      "authored:semantic-decomposition"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "name": "불확실성 보정",
    "definition": "자신이 아는 범위와 확신의 정도를 실제 근거에 맞추고 갱신하는 행동",
    "relatedAxes": [
      "PRECISION",
      "DECISION_STYLE",
      "RISK_STYLE"
    ],
    "distinction": "오류를 찾는 능력·결론을 내리는 선호·손실 감수와 확신의 적절성은 다름",
    "independenceReason": "같은 오류 탐지나 결정 속도에서도 확신을 수정하는 방식은 달라질 수 있다는 연구 질문",
    "substitutionLimit": "정밀함 점수만으로 불확실성을 잘 인정한다고 추론할 수 없음",
    "domains": [
      "identity",
      "work",
      "study",
      "relationships"
    ],
    "overlapRisk": "PRECISION의 논리 일관성과 LEARNING의 피드백 수용을 재명명할 위험",
    "verificationRequired": [
      "독립 행동 정의와 실제 관찰 자료",
      "기존 축으로 설명되지 않는 추가 정보",
      "신뢰도·상황 변화·반례 검토",
      "명리·MBTI 상징을 실증 측정치로 대체하지 않음"
    ],
    "disposition": "research_only_no_scoring"
  },
  {
    "id": "sar:new-axis:reciprocity-negotiation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "follow_up_required",
    "sourceRefs": [
      "primary:mbti-relationships",
      "authored:semantic-decomposition"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "name": "상호성 협의",
    "definition": "두 당사자가 기여·요청·거절·부담의 교환을 함께 조정하는 관계 과정",
    "relatedAxes": [
      "CARE",
      "DUTY",
      "BOUNDARY",
      "SOCIAL_ATTUNEMENT"
    ],
    "distinction": "도움을 주는 개인 성향과 두 사람이 동의한 교환의 공정성은 다름",
    "independenceReason": "개인 축만으로 양방향 관계의 합의와 부담 배분을 보존하기 어려움",
    "substitutionLimit": "A와 B의 CARE 합계로 관계의 상호성을 계산할 수 없음",
    "domains": [
      "love",
      "marriage",
      "relationships",
      "work"
    ],
    "overlapRisk": "CARE+BOUNDARY의 조건부 조합이나 관계 Context로 충분할 수 있음",
    "verificationRequired": [
      "개인 축보다 관계 메타데이터가 적절한지 우선 검토",
      "A/B 각자의 진술과 권력·동의 조건",
      "법적·가족 역할과 주관적 만족의 차이",
      "점수 축 독립성 미입증 상태 유지"
    ],
    "disposition": "research_only_no_scoring"
  }
];
