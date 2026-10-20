/** Static offline friendship research. No runtime registration or customer approval. */
import type { BindingDesign } from "./researchTypes";
export const FRIENDSHIP_BINDING_DESIGN: readonly BindingDesign[] = [
  {
    "id": "frpr:binding:ownership",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "A/B 개인 root 분리",
    "requiredChecks": [
      "실제 personId·입력 유형·명리 refs·태어난 시간의 미상 상태",
      "Pair나 상대 개인 원천은 해당 개인 사실로 대체 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:direction",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "각 방향 독립 검증",
    "requiredChecks": [
      "AB는 viewer B,target A; BA는 viewer A,target B",
      "각 방향 ID·Pair 방향·수신자 실제 source",
      "의미가 같으면 강제 차별화 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:canonical",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "관계 정의와 실제 검출 분리",
    "requiredChecks": [
      "현재 지원 kind와 양쪽 기둥·소유자·참여 구성",
      "미지원 형·파·원진·천간합·누락 지지 보충 금지",
      "전통 class를 계산 사실·우정의 성패로 승격 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:all-ancestors",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "전체 ancestry 검토",
    "requiredChecks": [
      "허용 node가 하나 있더라도 혼합 side·comparison의 모든 ancestor 확인",
      "owner·domain·context·sourceCoverage·condition·source-local 검증 상태",
      "CHILDREN은 친구 개인 성향의 라이선스 아님"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:fusion",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "개인 Fusion 두 실제 root",
    "requiredChecks": [
      "같은 개인의 actual 명리 root와 actual MBTI root",
      "facet 역할·sign·같은 Context·원천 의미의 관련성",
      "Fusion 후보 존재를 새 계산이나 두 사람의 효과로 처리 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:context",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "실제 관계 이력 UNKNOWN",
    "requiredChecks": [
      "동창·직장·옛 친구·거래·비밀·질투·단절 사실 미입력",
      "모든 생활 장면 hypothetical_only",
      "관찰이 없는 경우 조건부 질문만; 사건 창작 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:repair",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "CH07과 같은 문제의 조정",
    "requiredChecks": [
      "실제로 표시한 갈등과 같은 사건·사람·요청",
      "각자 바꿀 수 있는 행동과 동의·안전·재검토",
      "사과·용서·재친밀감·접촉은 별도 선택"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:recall",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "CH09 실제 표시 이력",
    "requiredChecks": [
      "source group 안에서는 필요한 roots를 AND 검증",
      "호환되는 실제 표시 group 중에서만 회수; 서로 배타적 타입·장면 합치기 금지",
      "새 근거·강점·평생 우정 결론 추가 금지"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  },
  {
    "id": "frpr:binding:withhold",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "rule": "근거 부족 시 보류",
    "requiredChecks": [
      "현재 projection이 허용하지 않는 domain을 카테고리 관련성으로 우회 금지",
      "원문 source가 단정적이어도 실제 친구 수·외로움·신뢰·지속 예측으로 전용 금지",
      "연결·선택·score·원고 생성·Book 변경은 다음 승인 범위"
    ],
    "failure": "withhold",
    "newEngineImplemented": false
  }
];
