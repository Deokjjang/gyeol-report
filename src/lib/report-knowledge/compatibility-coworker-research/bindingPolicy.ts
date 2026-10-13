/** Static offline coworker research. No runtime registration or customer approval. */
import type { BindingPolicy } from "./researchTypes";
export const CW_BINDING_POLICY: readonly BindingPolicy[] = [
  {
    "id": "cwpr:binding-policy:v1",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "roles": {
      "personA": "A",
      "personB": "B"
    },
    "rules": [
      "coworker 카테고리와 V4 역할 버전 확인. 대칭은 동일 방향·동일 직급 의미 아님.",
      "A/B 각자의 실제 natal Evidence·MBTI source node·개인 Fusion root·person ID를 확인. 상대 trait 복사 금지.",
      "sourceCoverage·review·source path/hash 보존. 정의·연구·가상 장면을 실제 계산 ID로 승격하지 않음.",
      "WORK/CAREER/THINKING 원천은 현 비연애 projection의 허용 node가 아니다. 후속 domain·context·원천 적합성 승인 전 보류.",
      "현재 projection에 허용된 node라도 실제 candidate primaryEligible·invalidReasons·root·signed axis·context를 별도 확인. 원천의 positiveUse/risk는 reference 필드이지 같은 scoring root가 아님.",
      "개인 Fusion은 같은 사람의 실제 두 root·rule·source assignment·contexts/domain 필요. 신설 Pair 점수 금지.",
      "실제 canonical 관계 ID·kind·양쪽 person refs·위치·성립 조건 필요. 미지원·미상 시주·원국 내부·기간 관계로 대체 금지.",
      "AB viewer B,target A; BA viewer A,target B. 같은 십성 결과는 보존. 십성의 제약·지원 분류는 조직 권한·업무 능력·성과 증거 아님.",
      "Pair 일반 문구는 방향별 참고. love/marriagePattern·reportLine·관계명을 직장 성과로 전용 금지.",
      "회사·직무·직급·경력·실제 과거·결정권·자원은 추가 검증 전 UNKNOWN. 모든 장면 hypothetical_only.",
      "unknown MBTI면 그 개인 trait/Fusion·Pair 보류. 상대 유형·일간으로 채우지 않음. 출생시간 미상은 시주·관련관계 보충 금지.",
      "CH08은 실제 표시된 CH07/방향별 부담과 같은 owner·task·root·direction인지 확인. A/B 행동·필요 권한·재확인 결과를 구분.",
      "CH09는 실제 introduced ledger의 같은 두 사람·owner·task·root·direction·actuallyDisplayed가 필요. 후보 존재는 표시 이력 아님.",
      "같은 fact root·공통축·Fusion·Pair·역할 링크·회수를 독립 근거로 중복 집계하지 않음.",
      "부당행위·보복·강압·안전 문제를 유형 차이로 조율하거나 화해를 강요하지 않음. 전문·조직 판단은 별도 통로."
    ],
    "withholdReasons": [
      "UNKNOWN_PERSON_OWNER",
      "MISSING_ACTUAL_NATAL_ROOT",
      "UNKNOWN_MBTI",
      "MISSING_SAME_PERSON_FUSION_ROOTS",
      "DOMAIN_NOT_APPROVED",
      "CONTEXT_NOT_VERIFIED",
      "UNSUPPORTED_RELATION",
      "MISSING_DIRECTION_ID",
      "UNKNOWN_JOB_AUTHORITY",
      "NOT_ACTUALLY_DISPLAYED",
      "DUPLICATE_FACT_ROOT",
      "SAFETY_ORGANIZATIONAL_SUPPORT_REQUIRED"
    ],
    "newEngineImplemented": false
  }
];
