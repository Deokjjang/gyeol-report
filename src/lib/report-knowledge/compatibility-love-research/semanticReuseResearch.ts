/** Static offline research only. No scoring, resolution or customer output. */
import type { ReuseReview } from "./researchTypes";
export const LOVE_PAIR_REUSE_RESEARCH: readonly ReuseReview[] = [
  {
    "id": "clr:reuse:0",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH01",
      "CH04"
    ],
    "sharedMeaning": "표현의 접점",
    "questions": [
      "CH01은 대표 차이를 소개한다.",
      "CH04는 상대가 실제로 선택할 수 있을 때 생기는 이익을 검토한다."
    ],
    "reuseCondition": "같은 축을 다시 나열하지 않고 긍정 작동의 별도 조건과 반례를 더한다.",
    "duplicateRisk": "도입의 대비를 강점 발견으로 이름만 바꾸는 반복",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:1",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH02",
      "CH03"
    ],
    "sharedMeaning": "독립적인 연애 성향",
    "questions": [
      "A 본인의 trait로 A의 가능성을 읽는다.",
      "B 본인의 trait로 B의 필요를 읽는다."
    ],
    "reuseCondition": "유형이 같아도 source owner와 실제 응답을 따로 확인하고 차이를 지어내지 않는다.",
    "duplicateRisk": "이름만 교환한 A 설명을 B의 별도 근거로 계산",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:2",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH04",
      "CH09"
    ],
    "sharedMeaning": "강점의 활용",
    "questions": [
      "CH04는 도움으로 작동할 조건을 발견한다.",
      "CH09는 실제 도입한 조건을 새 상황에서 지킬 질문으로 회수한다."
    ],
    "reuseCondition": "actuallyDisplayed ledger와 같은 person IDs·조건이 있는 항목만 회수한다.",
    "duplicateRisk": "마지막에서 새 귀인·합·긍정 운세를 도입",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:3",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH05",
      "CH06"
    ],
    "sharedMeaning": "방향별 영향",
    "questions": [
      "A의 제안과 B의 수신을 구분한다.",
      "B의 표현과 A의 수신을 구분한다."
    ],
    "reuseCondition": "각 수신자 기준 십성과 양쪽 개인 root를 따로 대조한다. 동일 결과면 의미를 억지로 구별하지 않는다.",
    "duplicateRisk": "AB의 이름을 바꾸어 BA를 만들고 독립 사실로 집계",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:4",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH05",
      "CH07"
    ],
    "sharedMeaning": "A가 보태는 것과 그 비용",
    "questions": [
      "제안이 상대의 선택을 넓히는 조건",
      "같은 제안이 재량을 좁힐 때의 실제 조건"
    ],
    "reuseCondition": "좋은 기여와 비용의 발생 조건이 달라야 하며 과거 갈등을 만들지 않는다.",
    "duplicateRisk": "A의 강한 표현만으로 B의 불편을 확정",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:5",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH06",
      "CH07"
    ],
    "sharedMeaning": "B의 수신·기여와 오해",
    "questions": [
      "B의 기여가 A에게 닿을 조건",
      "기대와 실제 수신이 어긋날 조건"
    ],
    "reuseCondition": "A 실제 필요를 별도 확인하고 B 원천의 주어를 유지한다.",
    "duplicateRisk": "B가 조용하므로 회피했다는 사실을 추정",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:6",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH07",
      "CH08"
    ],
    "sharedMeaning": "갈등과 회복",
    "questions": [
      "CH07은 해석이 어긋날 발생·악화 조건",
      "CH08은 누가 바꾸고 언제 확인할지의 선택"
    ],
    "reuseCondition": "앞선 갈등의 같은 조건과 실제 자발적 동의가 있을 때만 행동을 제안한다.",
    "duplicateRisk": "대화하라는 공통 문구로 책임과 안전 문제를 지움",
    "independentFactsAdded": 0
  },
  {
    "id": "clr:reuse:7",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapters": [
      "CH01",
      "CH09"
    ],
    "sharedMeaning": "첫 기준과 마지막 선택",
    "questions": [
      "처음에 서로 다른 출발점을 이해한다.",
      "끝에서는 현재 상황에 맞게 한 가지 행동을 다시 선택한다."
    ],
    "reuseCondition": "앞서 도입된 같은 의미의 새로운 적용 질문으로 제한한다.",
    "duplicateRisk": "처음의 관계 상징을 예언으로 되풀이",
    "independentFactsAdded": 0
  }
];
