import type { GodRole } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_GOD_ROLES = [
  {
    "id": "tr:god:비견",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "비견",
    "group": "peer",
    "traditionalRef": "자기 기준과 동등한 주체; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "자기 방식과 동료 간 경계를 여러 해 유지할 기반",
    "saeun": "올해 독자 결정과 공동 결정의 경계를 검토",
    "wolun": "이번 구간 혼자 끝낼 일과 함께 나눌 일을 구별",
    "positive": "자율적인 수행 단위를 만든다.",
    "risk": "독립성을 고집해 협의 비용을 상대에게 넘길 수 있다.",
    "reversal": "도움을 받는 선택도 자율성의 포기가 아닐 수 있다.",
    "extraEvidence": "실제 협업 구조·권한"
  },
  {
    "id": "tr:god:겁재",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "겁재",
    "group": "peer",
    "traditionalRef": "동류와 자원의 공유·경쟁; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "협력 자원과 배분 규칙을 지속적으로 재점검",
    "saeun": "올해 공동 자원의 비용과 기여를 따로 확인",
    "wolun": "이번 구간 시간·비용을 같이 쓰는 범위를 좁힘",
    "positive": "함께 쓰는 자원의 활용 범위를 넓힐 수 있다.",
    "risk": "경쟁·분배를 도난이나 배신 사건으로 단정하지 않는다.",
    "reversal": "분담을 줄이는 편이 협업을 오래 유지할 수도 있다.",
    "extraEvidence": "실제 소유권·배분 약속"
  },
  {
    "id": "tr:god:식신",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "식신",
    "group": "output",
    "traditionalRef": "지속적으로 밖에 내놓는 산출; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "축적한 능력을 반복 가능한 생산 방식으로 유지",
    "saeun": "올해 결과물을 지속할 공급과 품질 확인",
    "wolun": "이번 구간 작은 산출물의 완성·휴식 리듬 관찰",
    "positive": "한 번의 성과보다 재현 가능한 방식에 강점을 둔다.",
    "risk": "생산량 증가만으로 보상이나 건강을 보장하지 않는다.",
    "reversal": "생산량을 줄여 품질을 남기는 선택을 검토한다.",
    "extraEvidence": "실제 산출·유지 비용"
  },
  {
    "id": "tr:god:상관",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "상관",
    "group": "output",
    "traditionalRef": "기존 기준 밖의 표현과 재검토; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "축적한 관행을 검토하고 설명하는 통로를 마련",
    "saeun": "올해 다른 제안을 누구에게 어떤 기준으로 설명할지 점검",
    "wolun": "이번 구간 비판과 대안을 분리해 작게 시험",
    "positive": "새 설명이 고정된 운영을 개선할 단서가 될 수 있다.",
    "risk": "반대 의견의 정당성과 전달 방식은 별도로 확인한다.",
    "reversal": "더 많이 표현하기보다 대상에 맞게 다듬는 것이 효과적일 수 있다.",
    "extraEvidence": "실제 기준·제안·수신자"
  },
  {
    "id": "tr:god:편재",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "편재",
    "group": "resource",
    "traditionalRef": "외부의 가변적인 자원과 기회; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "다양한 연결을 관리할 여력과 자원 경계 구축",
    "saeun": "올해 새 제안의 규모와 실제 확보한 자원 분리",
    "wolun": "이번 구간 탐색 비용과 중단 기준을 정함",
    "positive": "새 연결을 비교할 선택지가 생긴다는 관점이다.",
    "risk": "운간 편재를 매출·투자 수익의 확정으로 쓰지 않는다.",
    "reversal": "기회를 거절하는 편이 중요한 자원을 보존할 수 있다.",
    "extraEvidence": "실제 제안·유동성·감당 여력"
  },
  {
    "id": "tr:god:정재",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "정재",
    "group": "resource",
    "traditionalRef": "정해진 자원의 축적과 관리; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "기반 자원의 지속적인 운영과 배분 체계를 점검",
    "saeun": "올해 수입·시간·지출의 실제 확정 항목을 확인",
    "wolun": "이번 구간 예정 자원과 이미 확보된 자원을 구분",
    "positive": "작은 누수를 줄여 지속 가능성을 살핀다.",
    "risk": "규칙적 수입이 발생했다고 꾸며내지 않는다.",
    "reversal": "정밀 관리가 기회를 놓치게 하면 허용 범위를 따로 둔다.",
    "extraEvidence": "실제 예산·시간표·확정 금액"
  },
  {
    "id": "tr:god:편관",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "편관",
    "group": "constraint",
    "traditionalRef": "집중된 통제 요구와 대응; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "부담이 큰 요구를 다룰 준비·지원 구조를 유지",
    "saeun": "올해 강한 요구의 범위와 감당 조건 점검",
    "wolun": "이번 구간 급한 요구의 우선순위와 지원을 확인",
    "positive": "긴장 속에서 실행 조건을 명확히 할 질문이다.",
    "risk": "재난·질병·범죄나 공격적인 성격의 증거가 아니다.",
    "reversal": "혼자 버티기보다 권한을 돌려주는 선택이 유효할 수 있다.",
    "extraEvidence": "실제 위험·요구·지원자"
  },
  {
    "id": "tr:god:정관",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "정관",
    "group": "constraint",
    "traditionalRef": "정해진 기준과 공적 책임; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "기준·책임을 일관되게 수행할 체계 구축",
    "saeun": "올해 평가 기준과 맡을 책임의 경계 확인",
    "wolun": "이번 구간 마감·승인·역할을 명시",
    "positive": "공정한 기준을 공유하는 자원을 검토한다.",
    "risk": "승진·취업·혼인을 기준 하나로 예언하지 않는다.",
    "reversal": "규칙 준수보다 불필요한 규칙의 재협의가 필요할 수 있다.",
    "extraEvidence": "실제 규정·평가 절차"
  },
  {
    "id": "tr:god:편인",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "편인",
    "group": "support",
    "traditionalRef": "선별적인 수용과 관점 전환; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "특화된 지식과 다른 관점의 활용 경로 마련",
    "saeun": "올해 익숙한 설명으로 해결되지 않는 질문을 분리",
    "wolun": "이번 구간 다른 자료를 비교하되 적용을 유예",
    "positive": "다른 관점이 막힌 문제의 가설을 넓힌다.",
    "risk": "독특한 생각을 검증된 결론이나 고립 사건으로 만들지 않는다.",
    "reversal": "추가 조사보다 이미 아는 것을 시험할 때일 수 있다.",
    "extraEvidence": "실제 자료·검증 방법"
  },
  {
    "id": "tr:god:정인",
    "class": "C",
    "sourceRefs": [
      "repo-gods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "god": "정인",
    "group": "support",
    "traditionalRef": "기반이 되는 학습과 보호 자원; 기초 십성 정의의 요약 참조이며 아래 기간 적용은 연구 추론이다.",
    "dayun": "받은 지식·지원을 실행 가능한 기반으로 정리",
    "saeun": "올해 배울 내용과 실제 받을 수 있는 도움 구별",
    "wolun": "이번 구간 복습·문서화·질문할 범위를 정함",
    "positive": "기초를 다시 익혀 시행착오의 범위를 줄인다.",
    "risk": "자격증·합격·귀인 출현을 보장하지 않는다.",
    "reversal": "지원이 많아도 스스로 실행할 단위가 필요할 수 있다.",
    "extraEvidence": "실제 교육·지원 이용 조건"
  }
] as const satisfies readonly GodRole[];
