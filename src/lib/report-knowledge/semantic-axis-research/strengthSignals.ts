/** Offline authored semantic research. Import only from research tests; no runtime connection. */
import type { SignalResearch } from "./semanticResearchTypes";

export const STRENGTH_SIGNAL_RESEARCH: readonly SignalResearch[] = [
  {
    "id": "sar:signal:supported",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking",
      "repo:mbtiSemanticAnnotations"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "state": "supported",
    "meaning": "동일 맥락의 유효한 양성 근거가 있음",
    "permitted": "출처 범위 안의 행동 후보를 검토",
    "forbidden": "점수만으로 능력·도덕성 확정"
  },
  {
    "id": "sar:signal:weak",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking",
      "repo:mbtiSemanticAnnotations"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "state": "weak",
    "meaning": "확인 신호가 약하며 부재와 다름",
    "permitted": "근거의 범위와 불확실성을 알림",
    "forbidden": "반대 성격이나 부족한 사람으로 판단"
  },
  {
    "id": "sar:signal:absent",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking",
      "repo:mbtiSemanticAnnotations"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "state": "absent",
    "meaning": "이 경로에서 근거를 관찰하지 못함",
    "permitted": "다른 경로와 실제 행동을 질문",
    "forbidden": "그 행동이나 능력 자체가 없다고 결론"
  },
  {
    "id": "sar:signal:contrary_observed",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking",
      "repo:mbtiSemanticAnnotations"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "state": "contrary_observed",
    "meaning": "별도의 실제 반대 행동 근거가 있음",
    "permitted": "반대 자료의 출처·맥락을 독립 보존",
    "forbidden": "기존 축의 낮은 값에서 반대 행동 생성"
  },
  {
    "id": "sar:signal:unresolved",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking",
      "repo:mbtiSemanticAnnotations"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "state": "unresolved",
    "meaning": "긍정·부정 상쇄 또는 적용 조건 미확정",
    "permitted": "판정을 보류하고 조건을 확인",
    "forbidden": "0을 중립 성격이나 완성된 판단으로 읽음"
  }
];
