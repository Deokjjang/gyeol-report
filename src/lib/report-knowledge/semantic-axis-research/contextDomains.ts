/** Offline authored semantic research. Import only from research tests; no runtime connection. */
import type { ContextDomainResearch } from "./semanticResearchTypes";

export const CONTEXT_DOMAIN_RESEARCH: readonly ContextDomainResearch[] = [
  {
    "id": "sar:context:identity:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "identity",
    "relation": "direct_scope",
    "reason": "명칭상 분석 범위가 대응하지만 개인 적용은 별도 검증",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "strengths",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "weaknesses",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "work",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "marriage",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:identity:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "relationships",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "개인 입력과 실제 행동 확인"
    ]
  },
  {
    "id": "sar:context:identity:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "identity",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "개인 입력과 실제 행동 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:work:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "weaknesses",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "work",
    "relation": "direct_scope",
    "reason": "명칭상 분석 범위가 대응하지만 개인 적용은 별도 검증",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "money",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "study",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "marriage",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "직무·역할·기한·평가권 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:work:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "relationships",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "직무·역할·기한·평가권 확인"
    ]
  },
  {
    "id": "sar:context:work:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "work",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "직무·역할·기한·평가권 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:money:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "weaknesses",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "work",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "money",
    "relation": "direct_scope",
    "reason": "명칭상 분석 범위가 대응하지만 개인 적용은 별도 검증",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "marriage",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 여력·소유·위험 동의 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:money:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "relationships",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 여력·소유·위험 동의 확인"
    ]
  },
  {
    "id": "sar:context:money:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "money",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "실제 여력·소유·위험 동의 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:social:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "weaknesses",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "work",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "love",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "marriage",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:social:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "relationships",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인"
    ]
  },
  {
    "id": "sar:context:social:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "social",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "관계 유형·당사자·권력 차이·동의 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:love:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "weaknesses",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "work",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "love",
    "relation": "direct_scope",
    "reason": "명칭상 분석 범위가 대응하지만 개인 적용은 별도 검증",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "marriage",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 관계 상태·상호 동의 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:love:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "relationships",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 관계 상태·상호 동의 확인"
    ]
  },
  {
    "id": "sar:context:love:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "love",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "실제 관계 상태·상호 동의 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:stress:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "weaknesses",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "work",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "marriage",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:stress:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "relationships",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지"
    ]
  },
  {
    "id": "sar:context:stress:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "stress",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "부하 조건과 평소 행동 비교; 진단 금지",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:learning:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "strengths",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "weaknesses",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "work",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "study",
    "relation": "direct_scope",
    "reason": "명칭상 분석 범위가 대응하지만 개인 적용은 별도 검증",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "marriage",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:learning:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "relationships",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인"
    ]
  },
  {
    "id": "sar:context:learning:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "learning",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "학습 대상·방법·발달 단계 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  },
  {
    "id": "sar:context:recovery:identity",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "identity",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:strengths",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "strengths",
    "relation": "conditions_required",
    "reason": "강점·약점은 분야가 아닌 평가 층위이며 같은 행동도 환경에 따라 달라짐",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:weaknesses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "weaknesses",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:work",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "work",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:money",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "money",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "study",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "love",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "marriage",
    "relation": "additional_context",
    "reason": "이 Context만으로 해당 분야의 실제 상태나 역할을 알 수 없음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인",
      "혼인·공동생활 여부를 추정하지 않음"
    ]
  },
  {
    "id": "sar:context:recovery:relationships",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "relationships",
    "relation": "partial_scope",
    "reason": "일부 상황만 겹치며 관계·역할·대상 조건을 잃으면 해석이 달라짐",
    "requirements": [
      "실제 부하·회복 여력·지원 확인"
    ]
  },
  {
    "id": "sar:context:recovery:success/fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:semanticCore",
      "repo:types",
      "repo:fusionContext"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "context": "recovery",
    "domain": "success/fortune",
    "relation": "not_transferable",
    "reason": "행동 맥락은 성공·재물·결혼 등 결과를 뒷받침하지 않음",
    "requirements": [
      "실제 부하·회복 여력·지원 확인",
      "명리의 독립 결과 근거와 승인 계약이 없는 한 연결 금지"
    ]
  }
];
