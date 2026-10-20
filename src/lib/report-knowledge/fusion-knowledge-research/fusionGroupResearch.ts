/** Static offline Fusion knowledge. Never imported by runtime or a barrel. */
import type { GroupResearch } from "./fusionResearchTypes";
export const FUSION_GROUP_RESEARCH: readonly GroupResearch[] = [
  {
    "id": "fkr:group:THINKING_ANALYSIS",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "THINKING_ANALYSIS",
    "target": "질문의 대상·오류·원인·설명의 적용 범위",
    "distinction": "알고 싶은 것과 실제 검증할 것을 구분",
    "forbidden": "깊이·정밀함을 지능이나 진실 탐지로 승격 금지",
    "requires": "학습/업무의 정확한 과제·자료·종료 기준",
    "examples": "C001의 지원과 C002의 원인 조사처럼 같은 PRECISION도 대상이 다름",
    "existingContexts": [
      "identity",
      "work",
      "learning"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:EXECUTION_STRATEGY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "EXECUTION_STRATEGY",
    "target": "발의·착수·선택 종료·유지의 순서",
    "distinction": "같은 목표에서 단계별 다른 비용을 확인",
    "forbidden": "INITIATIVE를 빠른 속도나 완수 보장으로 변환 금지",
    "requires": "실제 권한·기한·가역성·피드백",
    "examples": "C013 발의·C021 속도·C022 유지의 독립적 관찰",
    "existingContexts": [
      "identity",
      "work"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:LEADERSHIP_STATUS",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "LEADERSHIP_STATUS",
    "target": "조율권·의무·공로·인정 기준",
    "distinction": "사람을 이끄는 행동과 직위·책임을 구별",
    "forbidden": "직함과 사회적 인정 욕구로 지위·능력 확정 금지",
    "requires": "공식 권한·평가권·자원·거절 안전",
    "examples": "C025 지원·C027 위임·C031 직책·C036 완료 의무",
    "existingContexts": [
      "work",
      "identity"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:MONEY_REALITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "MONEY_REALITY",
    "target": "자원 흐름·비축·교환·가치·위험",
    "distinction": "실제 여력과 기대 수익을 다른 칸에 기록",
    "forbidden": "관리 의미로 재산·투자·매출 보장 금지",
    "requires": "실제 자료·소유·공동 동의·손실 한도",
    "examples": "C037 흐름·C038 비축·C041 선택권 교환·C046 위험",
    "existingContexts": [
      "money",
      "work"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:SOCIAL_COMMUNICATION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "SOCIAL_COMMUNICATION",
    "target": "관찰·해석·전달·동의·개입",
    "distinction": "읽힌 반응과 상대가 동의한 뜻을 구분",
    "forbidden": "분위기·미소·말투로 의도·진심 확정 금지",
    "requires": "실제 상대·발언 환경·동의·공개 범위",
    "examples": "C049 도움 필요·C050 수신·C058 주목과 의견 통로",
    "existingContexts": [
      "social",
      "work",
      "identity"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:CREATION_LEARNING",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "CREATION_LEARNING",
    "target": "질문·습득·전이·산출·완료",
    "distinction": "만들거나 설명한 사실과 실제 이해를 구별",
    "forbidden": "제작물·성적·능력·창작 성공 자동 보장 금지",
    "requires": "실제 과제·자료·실습·사용자·피드백",
    "examples": "C064 제작 시험·C066 설명·C067 적용 범위",
    "existingContexts": [
      "learning",
      "work",
      "identity"
    ],
    "actualRuleCount": 12
  },
  {
    "id": "fkr:group:RELATIONSHIP",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "RELATIONSHIP",
    "target": "지원·친밀·공간·표현의 상호 합의",
    "distinction": "개인의 두 특성과 양측의 실제 관계를 구분",
    "forbidden": "한 개인 Fusion으로 상대 호감·관계 결과 확정 금지",
    "requires": "실제 관계 유형·양측 근거·방향·동의",
    "examples": "C073 지원 지속·C078 공개 경계·C081 선호 갱신",
    "existingContexts": [
      "love",
      "social"
    ],
    "actualRuleCount": 10
  },
  {
    "id": "fkr:group:CHANGE_RECOVERY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_editorial_not_empirical",
    "sourceRefs": [
      "repo:complement-registry",
      "authored:fusion-research"
    ],
    "group": "CHANGE_RECOVERY",
    "target": "변경 선택·조건 대응·기반·회복 여백",
    "distinction": "변화 선호·부하·쉬는 방법을 서로 구별",
    "forbidden": "변화 선호로 적응 능력·소진·회복 기간 단정 금지",
    "requires": "실제 변경·부하·지원·가역성·원국/기간 scope",
    "examples": "C084 선호/대응·C086 생각 정리·C091 위험·C096 기반",
    "existingContexts": [
      "identity",
      "recovery",
      "stress",
      "work"
    ],
    "actualRuleCount": 14
  }
];
