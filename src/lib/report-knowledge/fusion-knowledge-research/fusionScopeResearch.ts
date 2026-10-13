/** Offline static scope research, not a binding implementation. */
import type { ScopeContract } from "./fusionResearchTypes";
export const FUSION_SCOPE_RESEARCH: readonly ScopeContract[] = [
  {
    "id": "fkr:scope:individual",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:binding-blueprint",
      "authored:fusion-research"
    ],
    "scope": "individual",
    "requires": [
      "동일 개인의 원국 명리 Evidence와 실제 primary MBTI source node",
      "출처 버전·hash·성립 조건·기존 방향·같은 Context",
      "별도 산출물의 의미 대응이며 독립 명리 사실과 MBTI 자료만 보존"
    ],
    "failures": [
      "OWNER_MISMATCH",
      "PRIOR_ONLY",
      "REFERENCE_ONLY",
      "MISSING_CONDITION",
      "RESEARCH_ID_IS_NOT_EVIDENCE"
    ],
    "independentFactsAdded": 0,
    "counterpartInferenceAllowed": false,
    "periodCalculationFromMbtiAllowed": false
  },
  {
    "id": "fkr:scope:person_comparison",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:binding-blueprint",
      "authored:fusion-research"
    ],
    "scope": "person_comparison",
    "requires": [
      "A 개인 Fusion과 B 개인 Fusion은 각자의 소유자·출처를 유지",
      "비교 대상·기준·실제 역할을 명시",
      "A→B와 B→A의 질문을 각각 검토"
    ],
    "failures": [
      "CROSS_PERSON_AS_ONE_PERSON",
      "DIRECTION_SWAP",
      "COUNTERPART_MIND_INFERENCE"
    ],
    "independentFactsAdded": 0,
    "counterpartInferenceAllowed": false,
    "periodCalculationFromMbtiAllowed": false
  },
  {
    "id": "fkr:scope:relationship_interaction",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:binding-blueprint",
      "authored:fusion-research"
    ],
    "scope": "relationship_interaction",
    "requires": [
      "실제 관계 유형·권력·동의·역할",
      "두 개인의 원천과 별도의 실제 관계 Evidence",
      "참여 기둥·주체·방향별 사실을 보존"
    ],
    "failures": [
      "PAIR_REFERENCE_AS_PERSON_SCORE",
      "UNSUPPORTED_RELATION_PRODUCER",
      "ROLE_ASYMMETRY_IGNORED"
    ],
    "independentFactsAdded": 0,
    "counterpartInferenceAllowed": false,
    "periodCalculationFromMbtiAllowed": false
  },
  {
    "id": "fkr:scope:temporal_reference",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:binding-blueprint",
      "authored:fusion-research"
    ],
    "scope": "temporal_reference",
    "requires": [
      "실제 기존 대운/세운/월운 계산과 [start,end) 구간·timezone",
      "원국과 기간 참여자의 출처·전환 전후 교집합",
      "MBTI는 행동 참고이며 시기 계산 또는 사건 근거가 아님"
    ],
    "failures": [
      "NATAL_PERIOD_LAUNDERING",
      "OUTSIDE_INTERVAL",
      "TRANSITION_MIX",
      "MBTI_AS_TIME_PRODUCER"
    ],
    "independentFactsAdded": 0,
    "counterpartInferenceAllowed": false,
    "periodCalculationFromMbtiAllowed": false
  }
];
