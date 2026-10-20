import type { ProductStyle } from "./researchTypes";

/** Offline source-catalog references only. No runtime import, resolver or binding. */
export const KOREAN_PRODUCT_STYLES: readonly ProductStyle[] = [
  {
    "id": "ker:product:comprehensive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "saju_mbti_full",
    "questions": "서로 다른 면이 어떤 한 사람의 선택 안에서 이어지는가",
    "structure": "인물상 → 다른 영역의 관찰 → 긴장 → 앞서 소개한 면의 회수",
    "analogy": "같은 지도에서 다른 길을 읽는 비교; 지도=성격 전체라는 단정 금지",
    "scene": "일상 선택을 한 뒤 이유를 설명하는 조건부 장면",
    "positive": "영역이 달라져도 쓸 수 있는 확인된 강점",
    "risk": "같은 강점의 과용 조건",
    "twist": "모순처럼 보이는 면의 다른 적용 조건",
    "action": "다음 선택에서 확인할 질문 하나",
    "transition": "새 영역에서는 무엇이 다른지 먼저 제시",
    "closing": "소개한 면을 묶되 새 사람복·재물복 추가 금지",
    "distinction": "전문 상품의 결정을 한꺼번에 요약하는 대신 인물 이해",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:209f2dd332aa98742549",
      "originalId": "cpr:material:CH01.P1:understand-before-answer",
      "recordSha256": "d5c8c83b8a93f53cdfbca3486e37add6093d216dbc463108043f5f23ddd06687",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  },
  {
    "id": "ker:product:career",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "career_money_study",
    "questions": "어떤 과제·완료 조건·돈·학습 선택에서 성향이 쓰이는가",
    "structure": "실제 과제 → 이유 → 자원/권한 → 검토할 선택",
    "analogy": "도구의 쓰임과 작업의 요구 비교; 직업명=능력 금지",
    "scene": "요청 수락 전에 범위와 마감을 확인한다면",
    "positive": "일의 특정 단계에 기여할 조건",
    "risk": "능력과 맡은 책임·보상의 불일치",
    "twist": "잘하는 일을 더 맡는 대신 검토권을 확보하는 관점",
    "action": "과제·완료 기준·시간·보상 조건 확인",
    "transition": "직업에서 돈으로 넘어갈 때 다른 판단 기준 제시",
    "closing": "실제 자격·선택권이 있는 방향만 질문으로 회수",
    "distinction": "일·돈·학습 의사결정; 친밀 장면 전용 금지",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:36e7031d6b957b8e8af9",
      "originalId": "ckr:material:CH01.P1:request-framing",
      "recordSha256": "7898afcabf1677c724795136ca4a05ab1e719153b62162578a5c8fc904db4ec7",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  },
  {
    "id": "ker:product:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "love_marriage_child",
    "questions": "관심을 표현하고 받으며 가까워질 때 어떤 조건이 필요한가",
    "structure": "감정 표현 → 받는 방식 → 거리/동의 → 회복",
    "analogy": "문을 열고 기다리는 비유; 상대 마음을 안다는 근거 아님",
    "scene": "그 시기에 관계가 있다면 필요한 도움을 묻는 대화",
    "positive": "동의한 배려·알아듣게 전한 애정",
    "risk": "호의의 양을 상대 마음의 증거로 계산하는 부담",
    "twist": "조용한 반응과 애정 부족을 나누는 관점",
    "action": "답을 대신 정하기 전 원하는 도움을 질문",
    "transition": "표현에서 갈등으로 갈 때 상대 반응을 조건부로 분리",
    "closing": "혼인·자녀 여부를 예언하지 않고 필요한 기준 남김",
    "distinction": "한 사람의 친밀감과 선택; 실제 두 사람 궁합 근거 대체 금지",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:2577a774ae93b5a02bc3",
      "originalId": "lkr:material:CH01.P1:care-asked",
      "recordSha256": "1d2755961f4decb208074932f613298d8a34b535bef5668e2800a842d5f2782c",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  },
  {
    "id": "ker:product:pair-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "saju_mbti_compatibility",
    "questions": "두 사람 각각의 필요와 두 방향의 영향을 구분할 수 있는가",
    "structure": "A 설명 → B 설명 → 같은/다른 기준 → A→B → B→A → 회복",
    "analogy": "서로 다른 두 속도의 비교; 실제 속도 확인 없으면 보류",
    "scene": "관계 유형에 맞는 별도 장면 선택",
    "positive": "양쪽 원천이 확인된 기여",
    "risk": "의도와 받은 경험을 같다고 처리하는 부담",
    "twist": "같은 행동도 받는 조건에 따라 의미가 달라질 여지",
    "action": "당사자에게 받은 느낌과 원하는 범위를 따로 질문",
    "transition": "방향 전환마다 주체·받는 사람 다시 표시",
    "closing": "소개한 두 사람의 의미만 회수; 운명·성공 보장 금지",
    "distinction": "개인 성향 설명과 별도 방향 근거 필요",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:f608d6b3a7a9320d4a58",
      "originalId": "clr:material:CH01.P1:response-and-thought",
      "recordSha256": "fdd4e5d8ecf6e2a194a461ff1f1fe67a15f3805eee4af78ddb80663ff56d1fe0",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  },
  {
    "id": "ker:product:major",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "major_fortune",
    "questions": "장기 배경이 바뀌는 경계와 각 해의 실제 조건은 무엇인가",
    "structure": "현재 대운 → 다음 대운 → 전환 범위 → 실제 14년 비교",
    "analogy": "책의 장이 바뀌는 비유; 실제 사건 발생과 동일시 금지",
    "scene": "그 시기에 해당 활동을 한다면 긴 역할을 비교",
    "positive": "원국 강점을 새 장기 조건에 활용할 가능성",
    "risk": "전환 전 근거를 전환 뒤로 넓히는 오류",
    "twist": "장기 배경 유지도 새로운 생활 적용의 조건일 수 있음",
    "action": "전환 시점·기간별 질문을 구분해 검토",
    "transition": "원국·대운·세운 출처가 바뀜을 쉬운 말로 알림",
    "closing": "14년에서 실제 소개한 흐름과 선택만 회수",
    "distinction": "10년 주기 배경과 14년 관찰 범위; 14개 새 대운 금지",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:7fc382c0b4166d31afef",
      "originalId": "mfpr:cycle:stem",
      "recordSha256": "9fc16f0c38382bee97b92646235ccb787dc46b4ed8ef0139ca2497409b004b64",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  },
  {
    "id": "ker:product:annual",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "productKey": "annual_fortune",
    "questions": "한 해의 질문과 월별 실제 구간의 차이는 무엇인가",
    "structure": "선택 연도 → 실효 연주 → 전체 월 ledger → 대표 focus → 비교",
    "analogy": "한 달 달력 안의 구간 비교; 1일=명리월 시작 금지",
    "scene": "해당 구간에 실제 선택이 있다면 적용할 조건",
    "positive": "검증된 월별 접점에서 쓸 수 있는 힘",
    "risk": "대표 focus를 양력월 전체로 확장하는 오류",
    "twist": "같은 십성의 재등장은 유지/비교 기능으로도 읽음",
    "action": "정확 시각·조건·앞뒤 원천을 비교",
    "transition": "연간 근거와 월간 근거가 다름을 알리고 이동",
    "closing": "미소개 미래 사건 없이 한 해의 확인 질문 남김",
    "distinction": "한 해/12양력월/가변 segment; 대운·직업 DB 기간 치환 금지",
    "prohibitedStyle": [
      "unearned praise or blame",
      "guaranteed events or invented history",
      "word-only variation counted as new knowledge"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:35be5c640d2334857c0b",
      "originalId": "afpr:core:stem",
      "recordSha256": "c5da79b9a643cdec379a812d95195b7d96ef86a5c06f4931ec4e0f2d63794990",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    }
  }
];
