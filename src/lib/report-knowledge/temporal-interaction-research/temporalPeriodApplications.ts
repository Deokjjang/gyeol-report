import type { PeriodApplication } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_PERIOD_APPLICATIONS = [
  {
    "id": "tr:year:A:2023",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2023",
    "factsRef": "offline-periods.json#/major/A/years/2023",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"癸卯\",\"annualGod\":\"상관\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯午 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"plain\":\"子卯 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2023:癸卯",
      "major:4:戊寅:year:2023:癸卯:ten-god",
      "major:4:戊寅:year:2023:癸卯:boundary",
      "major:4:戊寅:year:2023:癸卯:natal:파:卯午:month",
      "major:4:戊寅:year:2023:癸卯:natal:형:子卯:day"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:상관"
    ],
    "question": "표현을 바꾸는 상관 질문에서 원국 월지의 파와 일지의 형을 서로 다른 자리의 확인으로 나눌 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:상관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2024",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2024",
    "factsRef": "offline-periods.json#/major/A/years/2024",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"甲辰\",\"annualGod\":\"편재\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2024:甲辰",
      "major:4:戊寅:year:2024:甲辰:ten-god",
      "major:4:戊寅:year:2024:甲辰:natal:반합:辰子:day",
      "major:4:戊寅:year:2024:甲辰:natal:파:丑辰:year",
      "major:4:戊寅:year:2024:甲辰:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:편재"
    ],
    "question": "새 외부 자원을 보는 편재 질문에서 일지 반합과 연지 파·시지 해를 같은 결과로 묶고 있지 않은가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:편재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2025",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2025",
    "factsRef": "offline-periods.json#/major/A/years/2025",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"乙巳\",\"annualGod\":\"정재\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"寅\",\"巳\"],\"plain\":\"寅巳 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"寅\",\"巳\"],\"plain\":\"寅巳 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"巳丑 반합 금 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2025:乙巳",
      "major:4:戊寅:year:2025:乙巳:ten-god",
      "major:4:戊寅:year:2025:乙巳:cycle:해:寅巳:cycle",
      "major:4:戊寅:year:2025:乙巳:cycle:형:寅巳:cycle",
      "major:4:戊寅:year:2025:乙巳:natal:반합:巳丑:year"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:정재"
    ],
    "question": "정재의 운영 질문과 대운의 해·형을 연결할 때 실제 관리 비용과 반복 부담을 분리했는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:정재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2026",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026",
    "factsRef": "offline-periods.json#/major/A/years/2026",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"丙午\",\"annualGod\":\"편관\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"午\",\"寅\"],\"plain\":\"午寅 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑午 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"午午 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"plain\":\"子午 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯午 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2026:丙午",
      "major:4:戊寅:year:2026:丙午:ten-god",
      "major:4:戊寅:year:2026:丙午:cycle:반합:午寅:cycle",
      "major:4:戊寅:year:2026:丙午:natal:해:丑午:year",
      "major:4:戊寅:year:2026:丙午:natal:형:午午:month",
      "major:4:戊寅:year:2026:丙午:natal:충:子午:day",
      "major:4:戊寅:year:2026:丙午:natal:파:卯午:hour"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:편관"
    ],
    "question": "편관의 강한 요구를 운의 반합과 원국 일지 충 가운데 어떤 실제 업무 조건에서 확인할 것인가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:편관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2027",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2027",
    "factsRef": "offline-periods.json#/major/A/years/2027",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"丁未\",\"annualGod\":\"정관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"未卯 반합 목 흐름은 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"午未 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"plain\":\"子未 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2027:丁未",
      "major:4:戊寅:year:2027:丁未:ten-god",
      "major:4:戊寅:year:2027:丁未:natal:반합:未卯:hour",
      "major:4:戊寅:year:2027:丁未:natal:충:丑未:year",
      "major:4:戊寅:year:2027:丁未:natal:형:未丑:year",
      "major:4:戊寅:year:2027:丁未:natal:육합:午未:month",
      "major:4:戊寅:year:2027:丁未:natal:해:子未:day"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:정관"
    ],
    "question": "정관의 공적 기준을 설명하면서 원국의 합·충·형·해가 닿는 각 자리를 사건 대신 서로 다른 조건으로 보았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:정관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2028",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2028",
    "factsRef": "offline-periods.json#/major/A/years/2028",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"戊申\",\"annualGod\":\"편인\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"plain\":\"寅申 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"plain\":\"申寅 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"申子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2028:戊申",
      "major:4:戊寅:year:2028:戊申:ten-god",
      "major:4:戊寅:year:2028:戊申:cycle:충:寅申:cycle",
      "major:4:戊寅:year:2028:戊申:cycle:형:申寅:cycle",
      "major:4:戊寅:year:2028:戊申:natal:반합:申子:day",
      "major:4:戊寅:year:2028:戊申:element:metal:missing"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:편인"
    ],
    "question": "편인 역할이 반복되는 가운데 운의 寅申 충·申寅 형과 원국 일지 申子 반합을 배치 조정·반복 부담·부분 연결로 나눌 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:편인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2029",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2029",
    "factsRef": "offline-periods.json#/major/A/years/2029",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"己酉\",\"annualGod\":\"정인\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"酉丑 반합 금 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"plain\":\"子酉 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯酉 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2029:己酉",
      "major:4:戊寅:year:2029:己酉:ten-god",
      "major:4:戊寅:year:2029:己酉:natal:반합:酉丑:year",
      "major:4:戊寅:year:2029:己酉:natal:파:子酉:day",
      "major:4:戊寅:year:2029:己酉:natal:충:卯酉:hour",
      "major:4:戊寅:year:2029:己酉:element:metal:missing"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:정인"
    ],
    "question": "정인의 기초 지원 질문과 원국 시지 卯酉 충을 연결할 때 도움 수용과 기존 방식 변경을 구별했는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:정인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2030",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2030",
    "factsRef": "offline-periods.json#/major/A/years/2030",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"庚戌\",\"annualGod\":\"비견\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"寅\"],\"plain\":\"戌寅 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"戌午 반합 화 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑戌 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯戌 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2030:庚戌",
      "major:4:戊寅:year:2030:庚戌:ten-god",
      "major:4:戊寅:year:2030:庚戌:cycle:반합:戌寅:cycle",
      "major:4:戊寅:year:2030:庚戌:natal:반합:戌午:month",
      "major:4:戊寅:year:2030:庚戌:natal:형:丑戌:year",
      "major:4:戊寅:year:2030:庚戌:natal:육합:卯戌:hour",
      "major:4:戊寅:year:2030:庚戌:element:metal:missing"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:비견"
    ],
    "question": "비견의 독자 판단을 살리면서 운의 반합과 원국의 형·육합이 보여 주는 접점을 별개로 확인했는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:비견",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2031",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2031",
    "factsRef": "offline-periods.json#/major/A/years/2031",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"辛亥\",\"annualGod\":\"겁재\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"寅\",\"亥\"],\"plain\":\"寅亥 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"寅\",\"亥\"],\"plain\":\"寅亥 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"亥卯 반합 목 흐름은 시지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2031:辛亥",
      "major:4:戊寅:year:2031:辛亥:ten-god",
      "major:4:戊寅:year:2031:辛亥:cycle:육합:寅亥:cycle",
      "major:4:戊寅:year:2031:辛亥:cycle:파:寅亥:cycle",
      "major:4:戊寅:year:2031:辛亥:natal:반합:亥卯:hour",
      "major:4:戊寅:year:2031:辛亥:element:metal:missing"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:겁재"
    ],
    "question": "겁재의 공동 배분을 검토할 때 운과 연주의 寅亥 육합·파를 협업 성공과 실패 두 예언으로 만들고 있지 않은가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:겁재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2032",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2032",
    "factsRef": "offline-periods.json#/major/A/years/2032",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편인\",\"annual\":\"壬子\",\"annualGod\":\"식신\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"육합\",\"branches\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"plain\":\"子丑 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"子午 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"子卯 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:戊寅:year:2032:壬子",
      "major:4:戊寅:year:2032:壬子:ten-god",
      "major:4:戊寅:year:2032:壬子:boundary",
      "major:4:戊寅:year:2032:壬子:natal:육합:子丑:year",
      "major:4:戊寅:year:2032:壬子:natal:충:子午:month",
      "major:4:戊寅:year:2032:壬子:natal:형:子卯:hour"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:식신"
    ],
    "question": "식신의 지속 산출에서 원국 연지 육합·월지 충·시지 형을 서로 다른 수행 조건으로 정리할 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:식신",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2033",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2033",
    "factsRef": "offline-periods.json#/major/A/years/2033",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"癸丑\",\"annualGod\":\"상관\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"丑午 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"plain\":\"子丑 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
    "evidenceRefs": [
      "major:5:丁丑:year:2033:癸丑",
      "major:5:丁丑:year:2033:癸丑:ten-god",
      "major:5:丁丑:year:2033:癸丑:boundary",
      "major:5:丁丑:year:2033:癸丑:natal:해:丑午:month",
      "major:5:丁丑:year:2033:癸丑:natal:육합:子丑:day"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:상관"
    ],
    "question": "정관 배경으로 바뀌는 구간에서 상관의 제안은 어떤 공통 기준으로 검토할까? 새 대운 관계를 전환 전까지 확장하지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:상관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2034",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2034",
    "factsRef": "offline-periods.json#/major/A/years/2034",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"甲寅\",\"annualGod\":\"편재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅午 반합 화 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
    "evidenceRefs": [
      "major:5:丁丑:year:2034:甲寅",
      "major:5:丁丑:year:2034:甲寅:ten-god",
      "major:5:丁丑:year:2034:甲寅:natal:반합:寅午:month"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:편재"
    ],
    "question": "정관 배경에서 편재의 새 제안을 원국 월지 반합이라는 실제 접점과 어떻게 구별할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:편재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2035",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2035",
    "factsRef": "offline-periods.json#/major/A/years/2035",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"乙卯\",\"annualGod\":\"정재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯午 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"plain\":\"子卯 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:5:丁丑:year:2035:乙卯",
      "major:5:丁丑:year:2035:乙卯:ten-god",
      "major:5:丁丑:year:2035:乙卯:natal:파:卯午:month",
      "major:5:丁丑:year:2035:乙卯:natal:형:子卯:day"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:정재"
    ],
    "question": "정재의 관리 질문이 2025년과 같더라도 운간이 달라지고 운-세운 관계가 없다는 차이를 어떻게 보여 줄까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:정재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:A:2036",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2036",
    "factsRef": "offline-periods.json#/major/A/years/2036",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"丁丑\",\"dayunGod\":\"정관\",\"annual\":\"丙辰\",\"annualGod\":\"편관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑辰 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:5:丁丑:year:2036:丙辰",
      "major:5:丁丑:year:2036:丙辰:ten-god",
      "major:5:丁丑:year:2036:丙辰:cycle:파:丑辰:cycle",
      "major:5:丁丑:year:2036:丙辰:natal:반합:辰子:day",
      "major:5:丁丑:year:2036:丙辰:natal:파:丑辰:year",
      "major:5:丁丑:year:2036:丙辰:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:편관"
    ],
    "question": "편관의 요구를 검토할 때 운의 丑辰 파와 natal 연지의 같은 파를 같은 소유자의 중복으로 오해하지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:편관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2023",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2023",
    "factsRef": "offline-periods.json#/major/B/years/2023",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"庚辰\",\"dayunGod\":\"편관\",\"annual\":\"癸卯\",\"annualGod\":\"정인\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"plain\":\"卯辰 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"卯未 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:3:庚辰:year:2023:癸卯",
      "major:3:庚辰:year:2023:癸卯:ten-god",
      "major:3:庚辰:year:2023:癸卯:boundary",
      "major:3:庚辰:year:2023:癸卯:cycle:해:卯辰:cycle",
      "major:3:庚辰:year:2023:癸卯:natal:반합:卯未:month-hour",
      "major:3:庚辰:year:2023:癸卯:natal:파:卯午:year",
      "major:3:庚辰:year:2023:癸卯:element:water:missing"
    ],
    "roleRefs": [
      "tr:god:편관",
      "tr:god:정인"
    ],
    "question": "편관 장기 배경 속 정인의 지원 질문과 운의 卯辰 해를 어떤 실제 지원 조건에서 분리해 확인할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편관",
      "tr:god:정인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2024",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2024",
    "factsRef": "offline-periods.json#/major/B/years/2024",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"甲辰\",\"annualGod\":\"비견\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"plain\":\"卯辰 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2024:甲辰",
      "major:4:己卯:year:2024:甲辰:ten-god",
      "major:4:己卯:year:2024:甲辰:boundary",
      "major:4:己卯:year:2024:甲辰:cycle:해:卯辰:cycle",
      "major:4:己卯:year:2024:甲辰:natal:반합:辰申:day",
      "major:4:己卯:year:2024:甲辰:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:비견"
    ],
    "question": "정재 배경의 시작 전후에 비견의 독자 판단 질문을 적용할 때 실제 교운 이전 조건을 남겨 두었는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:비견",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2025",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2025",
    "factsRef": "offline-periods.json#/major/B/years/2025",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"乙巳\",\"annualGod\":\"겁재\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2025:乙巳",
      "major:4:己卯:year:2025:乙巳:ten-god",
      "major:4:己卯:year:2025:乙巳:natal:육합:巳申:day",
      "major:4:己卯:year:2025:乙巳:natal:형:巳申:day",
      "major:4:己卯:year:2025:乙巳:natal:파:巳申:day"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:겁재"
    ],
    "question": "겁재의 공동 배분과 natal 일지 巳申 육합·형·파를 세 사건으로 더하지 않고 어떤 합의 조건으로 나눌까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:겁재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2026",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026",
    "factsRef": "offline-periods.json#/major/B/years/2026",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"丙午\",\"annualGod\":\"식신\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"午午 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"午未 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯午 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2026:丙午",
      "major:4:己卯:year:2026:丙午:ten-god",
      "major:4:己卯:year:2026:丙午:cycle:파:卯午:cycle",
      "major:4:己卯:year:2026:丙午:natal:형:午午:year",
      "major:4:己卯:year:2026:丙午:natal:육합:午未:month",
      "major:4:己卯:year:2026:丙午:natal:파:卯午:hour"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:식신"
    ],
    "question": "정재 배경에서 식신의 산출을 유지하며 운과 원국 시지의 卯午 파가 다른 소유자임을 구별했는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:식신",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2027",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2027",
    "factsRef": "offline-periods.json#/major/B/years/2027",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"丁未\",\"annualGod\":\"상관\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"plain\":\"未卯 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"未卯 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"午未 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2027:丁未",
      "major:4:己卯:year:2027:丁未:ten-god",
      "major:4:己卯:year:2027:丁未:cycle:반합:未卯:cycle",
      "major:4:己卯:year:2027:丁未:natal:반합:未卯:month-hour",
      "major:4:己卯:year:2027:丁未:natal:육합:午未:year"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:상관"
    ],
    "question": "상관 제안을 검토하며 운의 未卯 반합과 원국 월·시지의 반합을 접점별로 설명할 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:상관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2028",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2028",
    "factsRef": "offline-periods.json#/major/B/years/2028",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"戊申\",\"annualGod\":\"편재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[]}",
    "evidenceRefs": [
      "major:4:己卯:year:2028:戊申",
      "major:4:己卯:year:2028:戊申:ten-god"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편재"
    ],
    "question": "편재의 외부 자원 질문은 남지만 운·원국 관계 배열이 모두 빈 해에 어떤 근거까지 설명할 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2029",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2029",
    "factsRef": "offline-periods.json#/major/B/years/2029",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"己酉\",\"annualGod\":\"정재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"plain\":\"卯酉 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯酉 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2029:己酉",
      "major:4:己卯:year:2029:己酉:ten-god",
      "major:4:己卯:year:2029:己酉:cycle:충:卯酉:cycle",
      "major:4:己卯:year:2029:己酉:natal:충:卯酉:hour"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:정재"
    ],
    "question": "정재가 반복돼도 운의 卯酉 충과 원국 시지 충은 어떤 서로 다른 비교를 제공하는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:정재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2030",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2030",
    "factsRef": "offline-periods.json#/major/B/years/2030",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"庚戌\",\"annualGod\":\"편관\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"戌午 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"戌未 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"plain\":\"未戌 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯戌 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2030:庚戌",
      "major:4:己卯:year:2030:庚戌:ten-god",
      "major:4:己卯:year:2030:庚戌:cycle:육합:卯戌:cycle",
      "major:4:己卯:year:2030:庚戌:natal:반합:戌午:year",
      "major:4:己卯:year:2030:庚戌:natal:형:戌未:month",
      "major:4:己卯:year:2030:庚戌:natal:파:未戌:month",
      "major:4:己卯:year:2030:庚戌:natal:육합:卯戌:hour"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편관"
    ],
    "question": "편관 요구를 살필 때 운의 육합과 natal 월지 형·파를 같은 대상의 길흉으로 합산하고 있지 않은가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2031",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2031",
    "factsRef": "offline-periods.json#/major/B/years/2031",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"辛亥\",\"annualGod\":\"정관\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"卯\"],\"plain\":\"亥卯 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"삼합\",\"branches\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"亥卯未 삼합 목 흐름은 월지, 시지를 통해 그 해의 큰 흐름을 키울 수 있습니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"plain\":\"申亥 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2031:辛亥",
      "major:4:己卯:year:2031:辛亥:ten-god",
      "major:4:己卯:year:2031:辛亥:cycle:반합:亥卯:cycle",
      "major:4:己卯:year:2031:辛亥:natal:삼합:亥卯未:month-hour",
      "major:4:己卯:year:2031:辛亥:natal:해:申亥:day",
      "major:4:己卯:year:2031:辛亥:element:water:missing"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:정관"
    ],
    "question": "정관의 기준 질문에서 natal 亥卯未 삼합은 실제3자이며 운의 亥卯 반합과 구성이 어떻게 다른가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:정관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2032",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2032",
    "factsRef": "offline-periods.json#/major/B/years/2032",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"壬子\",\"annualGod\":\"편인\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"plain\":\"子卯 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"子申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"子午 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"子未 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"plain\":\"子卯 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2032:壬子",
      "major:4:己卯:year:2032:壬子:ten-god",
      "major:4:己卯:year:2032:壬子:cycle:형:子卯:cycle",
      "major:4:己卯:year:2032:壬子:natal:반합:子申:day",
      "major:4:己卯:year:2032:壬子:natal:충:子午:year",
      "major:4:己卯:year:2032:壬子:natal:해:子未:month",
      "major:4:己卯:year:2032:壬子:natal:형:子卯:hour",
      "major:4:己卯:year:2032:壬子:element:water:missing"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편인"
    ],
    "question": "편인의 관점 전환과 운의 子卯 형·원국 연지 충을 각각 다른 검토 질문으로 나눴는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2033",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2033",
    "factsRef": "offline-periods.json#/major/B/years/2033",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"己卯\",\"dayunGod\":\"정재\",\"annual\":\"癸丑\",\"annualGod\":\"정인\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑午 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"plain\":\"丑未 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"plain\":\"未丑 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:己卯:year:2033:癸丑",
      "major:4:己卯:year:2033:癸丑:ten-god",
      "major:4:己卯:year:2033:癸丑:boundary",
      "major:4:己卯:year:2033:癸丑:natal:해:丑午:year",
      "major:4:己卯:year:2033:癸丑:natal:충:丑未:month",
      "major:4:己卯:year:2033:癸丑:natal:형:未丑:month",
      "major:4:己卯:year:2033:癸丑:element:water:missing"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:정인"
    ],
    "question": "정인의 지원 질문에 natal 월지 丑未 충·형이 닿을 때 지원의 존재와 실제 이용 조건을 구별할 수 있는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:정인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2034",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2034",
    "factsRef": "offline-periods.json#/major/B/years/2034",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"甲寅\",\"annualGod\":\"비견\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"寅午 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"寅申 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"plain\":\"申寅 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:5:戊寅:year:2034:甲寅",
      "major:5:戊寅:year:2034:甲寅:ten-god",
      "major:5:戊寅:year:2034:甲寅:boundary",
      "major:5:戊寅:year:2034:甲寅:natal:반합:寅午:year",
      "major:5:戊寅:year:2034:甲寅:natal:충:寅申:day",
      "major:5:戊寅:year:2034:甲寅:natal:형:申寅:day"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:비견"
    ],
    "question": "다음 戊寅 편재 배경과 비견의 올해 역할을 구별하고 전환 이후 寅申 충·형을 그 해 전체에 확대하지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:비견",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2035",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2035",
    "factsRef": "offline-periods.json#/major/B/years/2035",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"乙卯\",\"annualGod\":\"겁재\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"plain\":\"卯未 반합 목 흐름은 월지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"파\",\"branches\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯午 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:5:戊寅:year:2035:乙卯",
      "major:5:戊寅:year:2035:乙卯:ten-god",
      "major:5:戊寅:year:2035:乙卯:natal:반합:卯未:month-hour",
      "major:5:戊寅:year:2035:乙卯:natal:파:卯午:year"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:겁재"
    ],
    "question": "겁재 질문이 2025년과 같아도 natal 일지가 아닌 월·시지 반합이 접점이라는 차이를 남겼는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:겁재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:B:2036",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2036",
    "factsRef": "offline-periods.json#/major/B/years/2036",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"戊寅\",\"dayunGod\":\"편재\",\"annual\":\"丙辰\",\"annualGod\":\"식신\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"辰申 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:5:戊寅:year:2036:丙辰",
      "major:5:戊寅:year:2036:丙辰:ten-god",
      "major:5:戊寅:year:2036:丙辰:natal:반합:辰申:day",
      "major:5:戊寅:year:2036:丙辰:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:식신"
    ],
    "question": "식신의 산출 질문이 2026년과 같아도 배경이 편재이고 운의 파가 없다는 차이를 어떤 자원 운영 질문으로 보여 줄까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:식신",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2023",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2023",
    "factsRef": "offline-periods.json#/major/C/years/2023",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"癸卯\",\"annualGod\":\"정재\",\"elements\":[\"water\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:3:壬申:year:2023:癸卯",
      "major:3:壬申:year:2023:癸卯:ten-god",
      "major:3:壬申:year:2023:癸卯:natal:반합:卯亥:month",
      "major:3:壬申:year:2023:癸卯:natal:육합:卯戌:year",
      "major:3:壬申:year:2023:癸卯:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정재"
    ],
    "question": "편재 장기 배경에서 정재의 확정 자원을 볼 때 natal 연지 육합과 시지 해의 다른 접점을 어떻게 확인할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2024",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2024",
    "factsRef": "offline-periods.json#/major/C/years/2024",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"甲辰\",\"annualGod\":\"편관\",\"elements\":[\"wood\",\"earth\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"plain\":\"辰申 반합 수 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"辰申 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"辰戌 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰辰 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:3:壬申:year:2024:甲辰",
      "major:3:壬申:year:2024:甲辰:ten-god",
      "major:3:壬申:year:2024:甲辰:cycle:반합:辰申:cycle",
      "major:3:壬申:year:2024:甲辰:natal:반합:辰申:day-hour",
      "major:3:壬申:year:2024:甲辰:natal:충:辰戌:year",
      "major:3:壬申:year:2024:甲辰:natal:형:辰辰:hour",
      "major:3:壬申:year:2024:甲辰:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:편관"
    ],
    "question": "편관의 요구 질문에 운과 natal의 辰申 반합을 각각 어느 소유자의 연결로 표시할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:편관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2025",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2025",
    "factsRef": "offline-periods.json#/major/C/years/2025",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"乙巳\",\"annualGod\":\"정관\",\"elements\":[\"wood\",\"fire\"],\"cycleRelations\":[{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"plain\":\"巳申 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"巳亥 충은 월지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"형\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"巳申 파는 일지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:3:壬申:year:2025:乙巳",
      "major:3:壬申:year:2025:乙巳:ten-god",
      "major:3:壬申:year:2025:乙巳:cycle:육합:巳申:cycle",
      "major:3:壬申:year:2025:乙巳:cycle:형:巳申:cycle",
      "major:3:壬申:year:2025:乙巳:cycle:파:巳申:cycle",
      "major:3:壬申:year:2025:乙巳:natal:충:巳亥:month",
      "major:3:壬申:year:2025:乙巳:natal:육합:巳申:day",
      "major:3:壬申:year:2025:乙巳:natal:형:巳申:day",
      "major:3:壬申:year:2025:乙巳:natal:파:巳申:day",
      "major:3:壬申:year:2025:乙巳:element:fire:missing"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정관"
    ],
    "question": "정관의 기준과 운의 巳申 육합·형·파, natal 월지 巳亥 충을 같은 실제 업무의 어떤 다른 조건으로 나눌까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2026",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026",
    "factsRef": "offline-periods.json#/major/C/years/2026",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"丙午\",\"annualGod\":\"편인\",\"elements\":[\"fire\",\"fire\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"午戌 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}]}",
    "evidenceRefs": [
      "major:3:壬申:year:2026:丙午",
      "major:3:壬申:year:2026:丙午:ten-god",
      "major:3:壬申:year:2026:丙午:natal:반합:午戌:year",
      "major:3:壬申:year:2026:丙午:element:fire:missing"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:편인"
    ],
    "question": "편인의 관점 질문에서 운-세운 관계가 없고 natal 연지 반합만 있는 차이를 어떻게 제한해 설명할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:편인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2027",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2027",
    "factsRef": "offline-periods.json#/major/C/years/2027",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"壬申\",\"dayunGod\":\"편재\",\"annual\":\"丁未\",\"annualGod\":\"정인\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"未亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"plain\":\"戌未 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"未戌 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:3:壬申:year:2027:丁未",
      "major:3:壬申:year:2027:丁未:ten-god",
      "major:3:壬申:year:2027:丁未:boundary",
      "major:3:壬申:year:2027:丁未:natal:반합:未亥:month",
      "major:3:壬申:year:2027:丁未:natal:형:戌未:year",
      "major:3:壬申:year:2027:丁未:natal:파:未戌:year",
      "major:3:壬申:year:2027:丁未:element:fire:missing",
      "major:3:壬申:year:2027:丁未:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정인"
    ],
    "question": "정인의 기초 지원과 natal 연지 형·파를 연결할 때 실제 지원의 유무를 꾸며내지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2028",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2028",
    "factsRef": "offline-periods.json#/major/C/years/2028",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"戊申\",\"annualGod\":\"비견\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"申辰 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"申亥 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2028:戊申",
      "major:4:辛未:year:2028:戊申:ten-god",
      "major:4:辛未:year:2028:戊申:boundary",
      "major:4:辛未:year:2028:戊申:natal:반합:申辰:day-hour",
      "major:4:辛未:year:2028:戊申:natal:해:申亥:month",
      "major:4:辛未:year:2028:戊申:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:비견"
    ],
    "question": "2028-04-23 21:42 KST 이전 壬申 편재와 이후 辛未 상관을 나누고 비견의 연간 역할을 각 구간에 따로 검토할 준비가 됐는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:비견",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2029",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2029",
    "factsRef": "offline-periods.json#/major/C/years/2029",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"己酉\",\"annualGod\":\"겁재\",\"elements\":[\"earth\",\"metal\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"해\",\"branches\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"酉戌 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"},{\"type\":\"육합\",\"branches\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰酉 육합은 시지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2029:己酉",
      "major:4:辛未:year:2029:己酉:ten-god",
      "major:4:辛未:year:2029:己酉:natal:해:酉戌:year",
      "major:4:辛未:year:2029:己酉:natal:육합:辰酉:hour",
      "major:4:辛未:year:2029:己酉:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:겁재"
    ],
    "question": "상관 배경에서 겁재의 공동 배분을 논할 때 natal 연지 해와 시지 육합을 실제 합의의 어떤 다른 조건으로 볼까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:겁재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2030",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2030",
    "factsRef": "offline-periods.json#/major/C/years/2030",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"庚戌\",\"annualGod\":\"식신\",\"elements\":[\"metal\",\"earth\"],\"cycleRelations\":[{\"type\":\"형\",\"branches\":[\"戌\",\"未\"],\"plain\":\"戌未 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"未\",\"戌\"],\"plain\":\"未戌 파는 연지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}],\"natalRelations\":[{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰戌 충은 시지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2030:庚戌",
      "major:4:辛未:year:2030:庚戌:ten-god",
      "major:4:辛未:year:2030:庚戌:cycle:형:戌未:cycle",
      "major:4:辛未:year:2030:庚戌:cycle:파:未戌:cycle",
      "major:4:辛未:year:2030:庚戌:natal:충:辰戌:hour",
      "major:4:辛未:year:2030:庚戌:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:식신"
    ],
    "question": "식신의 지속 산출 질문에 운의 戌未 형·파와 natal 시지 辰戌 충을 어떻게 별개로 확인할까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:식신",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2031",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2031",
    "factsRef": "offline-periods.json#/major/C/years/2031",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"辛亥\",\"annualGod\":\"상관\",\"elements\":[\"metal\",\"water\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"亥\",\"未\"],\"plain\":\"亥未 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"亥亥 형은 월지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"해\",\"branches\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"plain\":\"申亥 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2031:辛亥",
      "major:4:辛未:year:2031:辛亥:ten-god",
      "major:4:辛未:year:2031:辛亥:cycle:반합:亥未:cycle",
      "major:4:辛未:year:2031:辛亥:natal:형:亥亥:month",
      "major:4:辛未:year:2031:辛亥:natal:해:申亥:day"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:상관"
    ],
    "question": "상관이 반복돼도 운의 亥未 반합과 natal 월지 亥亥 형을 같은 성격 강화로 합치지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:상관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2032",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2032",
    "factsRef": "offline-periods.json#/major/C/years/2032",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"壬子\",\"annualGod\":\"편재\",\"elements\":[\"water\",\"water\"],\"cycleRelations\":[{\"type\":\"해\",\"branches\":[\"子\",\"未\"],\"plain\":\"子未 해는 연지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}],\"natalRelations\":[{\"type\":\"삼합\",\"branches\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"申子辰 삼합 수 흐름은 일지, 시지를 통해 그 해의 큰 흐름을 키울 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2032:壬子",
      "major:4:辛未:year:2032:壬子:ten-god",
      "major:4:辛未:year:2032:壬子:cycle:해:子未:cycle",
      "major:4:辛未:year:2032:壬子:natal:삼합:申子辰:day-hour"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:편재"
    ],
    "question": "편재의 탐색 질문에서 운의 子未 해와 natal 申子辰 삼합은 참가자 수와 출처가 어떻게 다른가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:편재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2033",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2033",
    "factsRef": "offline-periods.json#/major/C/years/2033",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"癸丑\",\"annualGod\":\"정재\",\"elements\":[\"water\",\"earth\"],\"cycleRelations\":[{\"type\":\"충\",\"branches\":[\"丑\",\"未\"],\"plain\":\"丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"未\",\"丑\"],\"plain\":\"未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}],\"natalRelations\":[{\"type\":\"형\",\"branches\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"丑戌 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"},{\"type\":\"파\",\"branches\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"丑辰 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2033:癸丑",
      "major:4:辛未:year:2033:癸丑:ten-god",
      "major:4:辛未:year:2033:癸丑:cycle:충:丑未:cycle",
      "major:4:辛未:year:2033:癸丑:cycle:형:未丑:cycle",
      "major:4:辛未:year:2033:癸丑:natal:형:丑戌:year",
      "major:4:辛未:year:2033:癸丑:natal:파:丑辰:hour",
      "major:4:辛未:year:2033:癸丑:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:정재"
    ],
    "question": "정재의 관리 질문과 운의 丑未 충·형을 연결할 때 실제 자원 한도부터 확인했는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:정재",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2034",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2034",
    "factsRef": "offline-periods.json#/major/C/years/2034",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"甲寅\",\"annualGod\":\"편관\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"寅戌 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅亥 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"파\",\"branches\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"寅亥 파는 월지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다.\"},{\"type\":\"충\",\"branches\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"plain\":\"寅申 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"plain\":\"申寅 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2034:甲寅",
      "major:4:辛未:year:2034:甲寅:ten-god",
      "major:4:辛未:year:2034:甲寅:natal:반합:寅戌:year",
      "major:4:辛未:year:2034:甲寅:natal:육합:寅亥:month",
      "major:4:辛未:year:2034:甲寅:natal:파:寅亥:month",
      "major:4:辛未:year:2034:甲寅:natal:충:寅申:day",
      "major:4:辛未:year:2034:甲寅:natal:형:申寅:day"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:편관"
    ],
    "question": "편관의 대응 질문에 natal 일지 寅申 충·형과 월지 寅亥 육합·파를 서로 다른 접점으로 남겼는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:편관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2035",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2035",
    "factsRef": "offline-periods.json#/major/C/years/2035",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"乙卯\",\"annualGod\":\"정관\",\"elements\":[\"wood\",\"wood\"],\"cycleRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"未\"],\"plain\":\"卯未 반합 목 흐름은 연지에서 특정 기운을 부분적으로 키웁니다.\"}],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"plain\":\"卯亥 반합 목 흐름은 월지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"육합\",\"branches\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"卯戌 육합은 연지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다.\"},{\"type\":\"해\",\"branches\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"卯辰 해는 시지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2035:乙卯",
      "major:4:辛未:year:2035:乙卯:ten-god",
      "major:4:辛未:year:2035:乙卯:cycle:반합:卯未:cycle",
      "major:4:辛未:year:2035:乙卯:natal:반합:卯亥:month",
      "major:4:辛未:year:2035:乙卯:natal:육합:卯戌:year",
      "major:4:辛未:year:2035:乙卯:natal:해:卯辰:hour"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:정관"
    ],
    "question": "정관의 기준 질문에서 운의 卯未 반합과 natal 연지 육합·시지 해를 한 관계 결과로 요약하지 않았는가?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:정관",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:year:C:2036",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2036",
    "factsRef": "offline-periods.json#/major/C/years/2036",
    "calculatedFactClass": "B",
    "observedSignature": "{\"cycle\":\"辛未\",\"dayunGod\":\"상관\",\"annual\":\"丙辰\",\"annualGod\":\"편인\",\"elements\":[\"fire\",\"earth\"],\"cycleRelations\":[],\"natalRelations\":[{\"type\":\"반합\",\"branches\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"plain\":\"辰申 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다.\"},{\"type\":\"충\",\"branches\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"plain\":\"辰戌 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다.\"},{\"type\":\"형\",\"branches\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"plain\":\"辰辰 형은 시지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다.\"}]}",
    "evidenceRefs": [
      "major:4:辛未:year:2036:丙辰",
      "major:4:辛未:year:2036:丙辰:ten-god",
      "major:4:辛未:year:2036:丙辰:natal:반합:辰申:day-hour",
      "major:4:辛未:year:2036:丙辰:natal:충:辰戌:year",
      "major:4:辛未:year:2036:丙辰:natal:형:辰辰:hour",
      "major:4:辛未:year:2036:丙辰:element:fire:missing",
      "major:4:辛未:year:2036:丙辰:element:earth:heavy"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:편인"
    ],
    "question": "편인 역할이 2026년에 다시 나와도 상관 배경과 natal 연지 辰戌 충·시지 辰辰 형의 차이를 어떤 검증 질문으로 드러낼까?",
    "newInformation": "운간 역할·그해 연간 역할·원국 접점·운과의 접점을 각각 비교한다. 앞뒤 해의 실제 signature를 대조하며 관계가 같으면 새 사건 차이를 만들지 않는다.",
    "timeLimit": "명목 연도 요약이며 입춘·교운 전후 상세 관계 ledger가 아니다. 전환이 있으면 horizon의 실제 시각·범위보다 넓게 적용하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:편인",
      "tr:scope:dayun_saeun"
    ],
    "excluded": "개인 경험·승진·소득·혼인 등 실제 사건을 입력 없이 서술하지 않는다."
  },
  {
    "id": "tr:month:A:1",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-01",
    "factsRef": "offline-periods.json#/annual/A/months/1",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"丑\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:1:1:month",
      "month-v2:2026:1:1:annual",
      "month-v2:2026:1:1:dayun",
      "month-v2:2026:1:1:ten_gods",
      "month-v2:2026:1:1:elements",
      "month-v2:2026:1:1:month:2026:1:branch:육합:子丑",
      "month-v2:2026:1:1:month:2026:1:branch:충:子午",
      "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:ten_gods",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month:2026:1:branch:육합:子丑",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:상관",
      "tr:god:정인"
    ],
    "question": "소한 전 戊子 편인·상관과 이후 己丑 정인·정인을 나누고 natal 접점과 이전 연주 반합을 각각 어떻게 확인할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:상관",
      "tr:god:정인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:2",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-02",
    "factsRef": "offline-periods.json#/annual/A/months/2",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"丑\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:2:1:month",
      "month-v2:2026:2:1:annual",
      "month-v2:2026:2:1:dayun",
      "month-v2:2026:2:1:ten_gods",
      "month-v2:2026:2:1:elements",
      "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
      "month-v2:2026:2:1:month:2026:2:branch:육합:子丑",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:ten_gods",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:element:missing:metal",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
    ],
    "roleRefs": [
      "tr:god:정인",
      "tr:god:비견",
      "tr:god:편재"
    ],
    "question": "입춘 전 정인 기반과 이후 庚寅 비견·편재 역할의 차이를 실효 연주 변경과 함께 설명할 수 있는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정인",
      "tr:god:비견",
      "tr:god:편재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:3",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-03",
    "factsRef": "offline-periods.json#/annual/A/months/3",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"卯\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:3:1:month",
      "month-v2:2026:3:1:annual",
      "month-v2:2026:3:1:dayun",
      "month-v2:2026:3:1:ten_gods",
      "month-v2:2026:3:1:elements",
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
      "month-v2:2026:3:1:month:2026:3:element:missing:metal",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:ten_gods",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
      "month-v2:2026:3:2:month:2026:3:element:missing:metal",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "roleRefs": [
      "tr:god:비견",
      "tr:god:편재",
      "tr:god:겁재",
      "tr:god:정재"
    ],
    "question": "비견·편재에서 辛卯 겁재·정재로 바뀔 때 독자 탐색과 공동 자원 관리를 어떤 실제 과제로 구별할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:비견",
      "tr:god:편재",
      "tr:god:겁재",
      "tr:god:정재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:4",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-04",
    "factsRef": "offline-periods.json#/annual/A/months/4",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"卯\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"辰\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:4:1:month",
      "month-v2:2026:4:1:annual",
      "month-v2:2026:4:1:dayun",
      "month-v2:2026:4:1:ten_gods",
      "month-v2:2026:4:1:elements",
      "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
      "month-v2:2026:4:1:month:2026:4:branch:형:子卯",
      "month-v2:2026:4:1:month:2026:4:element:missing:metal",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:ten_gods",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
      "month-v2:2026:4:2:month:2026:4:branch:파:丑辰",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰"
    ],
    "roleRefs": [
      "tr:god:겁재",
      "tr:god:정재",
      "tr:god:식신",
      "tr:god:편인"
    ],
    "question": "겁재의 분담에서 壬辰 식신·편인으로 넘어갈 때 작은 산출과 다른 관점의 검증을 나눌 수 있는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:겁재",
      "tr:god:정재",
      "tr:god:식신",
      "tr:god:편인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:5",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-05",
    "factsRef": "offline-periods.json#/annual/A/months/5",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"辰\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:반합:巳丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:4:해:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:4:형:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:5:1:month",
      "month-v2:2026:5:1:annual",
      "month-v2:2026:5:1:dayun",
      "month-v2:2026:5:1:ten_gods",
      "month-v2:2026:5:1:elements",
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰子",
      "month-v2:2026:5:1:month:2026:5:branch:파:丑辰",
      "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:ten_gods",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month:2026:5:branch:반합:巳丑",
      "month-v2:2026:5:2:month_dayun_branch:4:해:寅巳",
      "month-v2:2026:5:2:month_dayun_branch:4:형:寅巳"
    ],
    "roleRefs": [
      "tr:god:식신",
      "tr:god:편인",
      "tr:god:상관",
      "tr:god:편관"
    ],
    "question": "癸巳 상관·편관 구간에서 운의 寅巳 해·형은 제안과 요구 사이의 어떤 실제 조건을 확인하게 하는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:식신",
      "tr:god:편인",
      "tr:god:상관",
      "tr:god:편관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:6",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-06",
    "factsRef": "offline-periods.json#/annual/A/months/6",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:반합:巳丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:4:해:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:4:형:寅巳\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"寅\",\"巳\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"午\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"午\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_dayun_branch:4:반합:寅午\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:6:1:month",
      "month-v2:2026:6:1:annual",
      "month-v2:2026:6:1:dayun",
      "month-v2:2026:6:1:ten_gods",
      "month-v2:2026:6:1:elements",
      "month-v2:2026:6:1:month:2026:6:branch:반합:巳丑",
      "month-v2:2026:6:1:month_dayun_branch:4:해:寅巳",
      "month-v2:2026:6:1:month_dayun_branch:4:형:寅巳",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:ten_gods",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month:2026:6:branch:해:丑午",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month:2026:6:branch:충:子午",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:반합:寅午"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:편관",
      "tr:god:편재",
      "tr:god:정관"
    ],
    "question": "甲午 편재·정관 구간의 natal 일지 子午 충과 운의 寅午 반합을 서로 다른 대상의 질문으로 유지했는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:편관",
      "tr:god:편재",
      "tr:god:정관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:7",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-07",
    "factsRef": "offline-periods.json#/annual/A/months/7",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"午\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"午\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_dayun_branch:4:반합:寅午\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"未\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"未\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:7:1:month",
      "month-v2:2026:7:1:annual",
      "month-v2:2026:7:1:dayun",
      "month-v2:2026:7:1:ten_gods",
      "month-v2:2026:7:1:elements",
      "month-v2:2026:7:1:month:2026:7:branch:해:丑午",
      "month-v2:2026:7:1:month:2026:7:branch:형:午午",
      "month-v2:2026:7:1:month:2026:7:branch:충:子午",
      "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:1:month_dayun_branch:4:반합:寅午",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:ten_gods",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:충:丑未",
      "month-v2:2026:7:2:month:2026:7:branch:형:未丑",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month:2026:7:branch:해:子未",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정관",
      "tr:god:정재",
      "tr:god:정인"
    ],
    "question": "乙未 정재·정인 구간에서 natal 연지 충·형과 월지 육합을 자원 운영과 지원 조건으로 따로 확인할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정관",
      "tr:god:정재",
      "tr:god:정인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:8",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-08",
    "factsRef": "offline-periods.json#/annual/A/months/8",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"未\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"未\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:반합:申子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month_dayun_branch:4:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month_dayun_branch:4:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:8:1:month",
      "month-v2:2026:8:1:annual",
      "month-v2:2026:8:1:dayun",
      "month-v2:2026:8:1:ten_gods",
      "month-v2:2026:8:1:elements",
      "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
      "month-v2:2026:8:1:month:2026:8:branch:충:丑未",
      "month-v2:2026:8:1:month:2026:8:branch:형:未丑",
      "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
      "month-v2:2026:8:1:month:2026:8:branch:해:子未",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:ten_gods",
      "month-v2:2026:8:2:elements",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申子",
      "month-v2:2026:8:2:month:2026:8:element:missing:metal",
      "month-v2:2026:8:2:month_dayun_branch:4:충:寅申",
      "month-v2:2026:8:2:month_dayun_branch:4:형:申寅"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:정인",
      "tr:god:편관",
      "tr:god:비견"
    ],
    "question": "丙申 편관·비견 구간에서 운의 寅申 충·형과 natal 일지 申子 반합을 장기 배치와 작은 실행으로 나눴는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:정인",
      "tr:god:편관",
      "tr:god:비견",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:9",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-09",
    "factsRef": "offline-periods.json#/annual/A/months/9",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:반합:申子\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"子\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month_dayun_branch:4:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month_dayun_branch:4:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"申\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:반합:酉丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:파:子酉\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"酉\",\"participants\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:9:1:month",
      "month-v2:2026:9:1:annual",
      "month-v2:2026:9:1:dayun",
      "month-v2:2026:9:1:ten_gods",
      "month-v2:2026:9:1:elements",
      "month-v2:2026:9:1:month:2026:9:branch:반합:申子",
      "month-v2:2026:9:1:month:2026:9:element:missing:metal",
      "month-v2:2026:9:1:month_dayun_branch:4:충:寅申",
      "month-v2:2026:9:1:month_dayun_branch:4:형:申寅",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:ten_gods",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month:2026:9:branch:반합:酉丑",
      "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month:2026:9:element:missing:metal"
    ],
    "roleRefs": [
      "tr:god:편관",
      "tr:god:비견",
      "tr:god:정관",
      "tr:god:겁재"
    ],
    "question": "丁酉 정관·겁재 구간에서 운-월 관계가 사라지고 natal 시지 卯酉 충이 남는 차이는 무엇인가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편관",
      "tr:god:비견",
      "tr:god:정관",
      "tr:god:겁재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:10",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-10",
    "factsRef": "offline-periods.json#/annual/A/months/10",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:반합:酉丑\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:파:子酉\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"酉\",\"participants\":[\"子\",\"酉\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:10:1:month",
      "month-v2:2026:10:1:annual",
      "month-v2:2026:10:1:dayun",
      "month-v2:2026:10:1:ten_gods",
      "month-v2:2026:10:1:elements",
      "month-v2:2026:10:1:month:2026:10:branch:반합:酉丑",
      "month-v2:2026:10:1:month:2026:10:branch:파:子酉",
      "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
      "month-v2:2026:10:1:month:2026:10:element:missing:metal",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:ten_gods",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:형:丑戌",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인"
    ],
    "question": "戊戌 편인·편인 구간에서 운寅·연午·월戌이 보여도 실제 기간쌍 반합만 검출됐음을 구별하고 허위3기간 삼합 승격을 막았는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:11",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-11",
    "factsRef": "offline-periods.json#/annual/A/months/11",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_dayun_branch:4:반합:寅戌\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:반합:亥卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:파:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:11:1:month",
      "month-v2:2026:11:1:annual",
      "month-v2:2026:11:1:dayun",
      "month-v2:2026:11:1:ten_gods",
      "month-v2:2026:11:1:elements",
      "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
      "month-v2:2026:11:1:month:2026:11:branch:형:丑戌",
      "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:1:month_dayun_branch:4:반합:寅戌",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:ten_gods",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month:2026:11:branch:반합:亥卯",
      "month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥",
      "month-v2:2026:11:2:month_dayun_branch:4:파:寅亥"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:정인",
      "tr:god:식신"
    ],
    "question": "己亥 정인·식신 구간에서 운과의 육합·파를 지원의 활용과 산출 유지의 어떤 질문으로 나눌까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:정인",
      "tr:god:식신",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:A:12",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "A",
    "period": "2026-12",
    "factsRef": "offline-periods.json#/annual/A/months/12",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:반합:亥卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:육합:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:파:寅亥\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"寅\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"戊寅\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"戊寅\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:육합:子丑\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"丑\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:element:missing:metal\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"metal\",\"monthElements\":[\"metal\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:12:1:month",
      "month-v2:2026:12:1:annual",
      "month-v2:2026:12:1:dayun",
      "month-v2:2026:12:1:ten_gods",
      "month-v2:2026:12:1:elements",
      "month-v2:2026:12:1:month:2026:12:branch:반합:亥卯",
      "month-v2:2026:12:1:month_dayun_branch:4:육합:寅亥",
      "month-v2:2026:12:1:month_dayun_branch:4:파:寅亥",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:ten_gods",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month:2026:12:branch:육합:子丑",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:metal",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午"
    ],
    "roleRefs": [
      "tr:god:정인",
      "tr:god:식신",
      "tr:god:비견",
      "tr:god:상관"
    ],
    "question": "庚子 비견·상관 구간에서 natal 월지와 실효 연주 각각의 子午 충은 소유자가 어떻게 다른가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정인",
      "tr:god:식신",
      "tr:god:비견",
      "tr:god:상관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:1",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-01",
    "factsRef": "offline-periods.json#/annual/B/months/1",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:반합:子申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month_dayun_branch:4:형:子卯\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"子\",\"卯\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:1:1:month",
      "month-v2:2026:1:1:annual",
      "month-v2:2026:1:1:dayun",
      "month-v2:2026:1:1:ten_gods",
      "month-v2:2026:1:1:elements",
      "month-v2:2026:1:1:month:2026:1:branch:반합:子申",
      "month-v2:2026:1:1:month:2026:1:branch:충:子午",
      "month-v2:2026:1:1:month:2026:1:branch:해:子未",
      "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
      "month-v2:2026:1:1:month:2026:1:element:missing:water",
      "month-v2:2026:1:1:month_dayun_branch:4:형:子卯",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:ten_gods",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month:2026:1:branch:충:丑未",
      "month-v2:2026:1:2:month:2026:1:branch:형:未丑",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정인",
      "tr:god:정재"
    ],
    "question": "戊子 편재·정인에서 己丑 정재·정재로 바뀌는 자원 운영의 실제 확인 항목은 무엇인가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정인",
      "tr:god:정재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:2",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-02",
    "factsRef": "offline-periods.json#/annual/B/months/2",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:해:丑午\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:충:丑未\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:형:未丑\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"未\",\"丑\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:2:1:month",
      "month-v2:2026:2:1:annual",
      "month-v2:2026:2:1:dayun",
      "month-v2:2026:2:1:ten_gods",
      "month-v2:2026:2:1:elements",
      "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
      "month-v2:2026:2:1:month:2026:2:branch:충:丑未",
      "month-v2:2026:2:1:month:2026:2:branch:형:未丑",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:ten_gods",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편관",
      "tr:god:비견"
    ],
    "question": "庚寅 편관·비견과 실효 丙午 식신의 역할을 섞지 않고 요구·독자 수행·산출을 구별할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편관",
      "tr:god:비견",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:3",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-03",
    "factsRef": "offline-periods.json#/annual/B/months/3",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:반합:卯未\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:3:1:month",
      "month-v2:2026:3:1:annual",
      "month-v2:2026:3:1:dayun",
      "month-v2:2026:3:1:ten_gods",
      "month-v2:2026:3:1:elements",
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
      "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
      "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:ten_gods",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯未",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "roleRefs": [
      "tr:god:편관",
      "tr:god:비견",
      "tr:god:정관",
      "tr:god:겁재"
    ],
    "question": "辛卯 정관·겁재 구간의 natal 반합과 연운 파를 공동 책임의 어떤 합의에서 따로 확인할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편관",
      "tr:god:비견",
      "tr:god:정관",
      "tr:god:겁재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:4",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-04",
    "factsRef": "offline-periods.json#/annual/B/months/4",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:반합:卯未\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month_dayun_branch:4:해:卯辰\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"卯\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:4:1:month",
      "month-v2:2026:4:1:annual",
      "month-v2:2026:4:1:dayun",
      "month-v2:2026:4:1:ten_gods",
      "month-v2:2026:4:1:elements",
      "month-v2:2026:4:1:month:2026:4:branch:반합:卯未",
      "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:ten_gods",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:2:month:2026:4:element:missing:water",
      "month-v2:2026:4:2:month_dayun_branch:4:해:卯辰"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인",
      "tr:god:편재"
    ],
    "question": "壬辰 편인·정재 구간에서 운과 natal 시지의 卯辰 해가 다른 참가자임을 어떻게 표시할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인",
      "tr:god:편재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:5",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-05",
    "factsRef": "offline-periods.json#/annual/B/months/5",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"辰\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month_dayun_branch:4:해:卯辰\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"卯\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:5:1:month",
      "month-v2:2026:5:1:annual",
      "month-v2:2026:5:1:dayun",
      "month-v2:2026:5:1:ten_gods",
      "month-v2:2026:5:1:elements",
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
      "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
      "month-v2:2026:5:1:month:2026:5:element:missing:water",
      "month-v2:2026:5:1:month_dayun_branch:4:해:卯辰",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:ten_gods",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
      "month-v2:2026:5:2:month:2026:5:element:missing:water"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:편재",
      "tr:god:정인",
      "tr:god:식신"
    ],
    "question": "癸巳 정인·식신 구간에서 natal 일지 巳申 육합·형·파를 지원과 생산의 실제 조건으로 나눴는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:편재",
      "tr:god:정인",
      "tr:god:식신",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:6",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-06",
    "factsRef": "offline-periods.json#/annual/B/months/6",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_dayun_branch:4:파:卯午\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:6:1:month",
      "month-v2:2026:6:1:annual",
      "month-v2:2026:6:1:dayun",
      "month-v2:2026:6:1:ten_gods",
      "month-v2:2026:6:1:elements",
      "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
      "month-v2:2026:6:1:month:2026:6:element:missing:water",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:ten_gods",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month:2026:6:branch:육합:午未",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:파:卯午"
    ],
    "roleRefs": [
      "tr:god:정인",
      "tr:god:식신",
      "tr:god:비견",
      "tr:god:상관"
    ],
    "question": "甲午 비견·상관 구간에서 독자 판단과 새 표현을 나누고 운과의 卯午 파를 어디까지 적용할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정인",
      "tr:god:식신",
      "tr:god:비견",
      "tr:god:상관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:7",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-07",
    "factsRef": "offline-periods.json#/annual/B/months/7",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:형:午午\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:파:卯午\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"午\",\"participants\":[\"卯\",\"午\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_dayun_branch:4:파:卯午\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_dayun_branch:4:반합:卯未\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"卯\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:7:1:month",
      "month-v2:2026:7:1:annual",
      "month-v2:2026:7:1:dayun",
      "month-v2:2026:7:1:ten_gods",
      "month-v2:2026:7:1:elements",
      "month-v2:2026:7:1:month:2026:7:branch:형:午午",
      "month-v2:2026:7:1:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:1:month_dayun_branch:4:파:卯午",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:ten_gods",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:7:2:month_dayun_branch:4:반합:卯未"
    ],
    "roleRefs": [
      "tr:god:비견",
      "tr:god:상관",
      "tr:god:겁재",
      "tr:god:정재"
    ],
    "question": "乙未 겁재·편재 구간의 운·원국 반합과 연운 육합에서 공동 자원과 외부 탐색을 어떻게 구분할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:비견",
      "tr:god:상관",
      "tr:god:겁재",
      "tr:god:정재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:8",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-08",
    "factsRef": "offline-periods.json#/annual/B/months/8",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未卯\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"卯\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:육합:午未\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"未\",\"participants\":[\"午\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_dayun_branch:4:반합:卯未\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"卯\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[]}]",
    "evidenceRefs": [
      "month-v2:2026:8:1:month",
      "month-v2:2026:8:1:annual",
      "month-v2:2026:8:1:dayun",
      "month-v2:2026:8:1:ten_gods",
      "month-v2:2026:8:1:elements",
      "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
      "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:1:month_dayun_branch:4:반합:卯未",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:ten_gods",
      "month-v2:2026:8:2:elements"
    ],
    "roleRefs": [
      "tr:god:겁재",
      "tr:god:정재",
      "tr:god:식신",
      "tr:god:편관"
    ],
    "question": "丙申 식신·편관 구간에 관계 배열이 비어 있으면 생산과 요구의 십성 질문만 어떻게 남길까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:겁재",
      "tr:god:정재",
      "tr:god:식신",
      "tr:god:편관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:9",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-09",
    "factsRef": "offline-periods.json#/annual/B/months/9",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month_dayun_branch:4:충:卯酉\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"卯\",\"酉\"],\"monthBranch\":\"酉\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:9:1:month",
      "month-v2:2026:9:1:annual",
      "month-v2:2026:9:1:dayun",
      "month-v2:2026:9:1:ten_gods",
      "month-v2:2026:9:1:elements",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:ten_gods",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month_dayun_branch:4:충:卯酉"
    ],
    "roleRefs": [
      "tr:god:식신",
      "tr:god:편관",
      "tr:god:상관",
      "tr:god:정관"
    ],
    "question": "丁酉 상관·정관에서 natal 시지와 운지의 卯酉 충을 서로 다른 기준 검토로 볼 수 있는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:식신",
      "tr:god:편관",
      "tr:god:상관",
      "tr:god:정관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:10",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-10",
    "factsRef": "offline-periods.json#/annual/B/months/10",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:충:卯酉\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"酉\",\"participants\":[\"卯\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month_dayun_branch:4:충:卯酉\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"卯\",\"酉\"],\"monthBranch\":\"酉\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"戌\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"卯\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:10:1:month",
      "month-v2:2026:10:1:annual",
      "month-v2:2026:10:1:dayun",
      "month-v2:2026:10:1:ten_gods",
      "month-v2:2026:10:1:elements",
      "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
      "month-v2:2026:10:1:month_dayun_branch:4:충:卯酉",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:ten_gods",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:형:戌未",
      "month-v2:2026:10:2:month:2026:10:branch:파:未戌",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:정관",
      "tr:god:편재"
    ],
    "question": "戊戌 편재·편재 구간의 새 기회 질문이 반복돼도 natal 형·파와 운 육합을 별개로 확인했는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:정관",
      "tr:god:편재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:11",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-11",
    "factsRef": "offline-periods.json#/annual/B/months/11",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:반합:戌午\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"戌\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"戌\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"戌\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_dayun_branch:4:육합:卯戌\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"卯\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"亥\",\"卯\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:11:1:month",
      "month-v2:2026:11:1:annual",
      "month-v2:2026:11:1:dayun",
      "month-v2:2026:11:1:ten_gods",
      "month-v2:2026:11:1:elements",
      "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
      "month-v2:2026:11:1:month:2026:11:branch:형:戌未",
      "month-v2:2026:11:1:month:2026:11:branch:파:未戌",
      "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:1:month_dayun_branch:4:육합:卯戌",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:ten_gods",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:element:missing:water",
      "month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:정재",
      "tr:god:편인"
    ],
    "question": "己亥 정재·편인 구간에서 실제 natal 삼합과 운의 반합을 구성 수·원국 자리로 구별했는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:정재",
      "tr:god:편인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:B:12",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "B",
    "period": "2026-12",
    "factsRef": "offline-periods.json#/annual/B/months/12",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:삼합:亥卯未\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"卯\",\"未\"],\"affectedPillars\":[\"month\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:4:반합:亥卯\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"亥\",\"卯\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":4,\"ganji\":\"己卯\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:반합:子申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:충:子午\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"午\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:해:子未\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"未\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:형:子卯\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"子\",\"participants\":[\"子\",\"卯\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month:2026:12:element:missing:water\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"water\",\"monthElements\":[\"water\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_dayun_branch:4:형:子卯\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"子\",\"卯\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":4,\"pillar\":\"己卯\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:12:1:month",
      "month-v2:2026:12:1:annual",
      "month-v2:2026:12:1:dayun",
      "month-v2:2026:12:1:ten_gods",
      "month-v2:2026:12:1:elements",
      "month-v2:2026:12:1:month:2026:12:branch:삼합:亥卯未",
      "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
      "month-v2:2026:12:1:month:2026:12:element:missing:water",
      "month-v2:2026:12:1:month_dayun_branch:4:반합:亥卯",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:ten_gods",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month:2026:12:branch:반합:子申",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:해:子未",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:water",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:4:형:子卯"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편인",
      "tr:god:편관",
      "tr:god:정인"
    ],
    "question": "庚子 편관·정인 구간에서 연운 子午 충과 운의 子卯 형을 요구·지원의 어떤 조건으로 나눌까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편인",
      "tr:god:편관",
      "tr:god:정인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:1",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-01",
    "factsRef": "offline-periods.json#/annual/C/months/1",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-01-01T00:00:00+09:00\",\"end\":\"2026-01-05T17:23:10+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"子\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:1:1:month:2026:1:branch:삼합:申子辰\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"子\",\"participants\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month:2026:1:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:1:month_dayun_branch:3:반합:申子\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"子\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-01-05T17:23:10+09:00\",\"end\":\"2026-02-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month:2026:1:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:1:1:month",
      "month-v2:2026:1:1:annual",
      "month-v2:2026:1:1:dayun",
      "month-v2:2026:1:1:ten_gods",
      "month-v2:2026:1:1:elements",
      "month-v2:2026:1:1:month:2026:1:branch:삼합:申子辰",
      "month-v2:2026:1:1:month:2026:1:element:heavy:earth",
      "month-v2:2026:1:1:month_dayun_branch:3:반합:申子",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:ten_gods",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month:2026:1:branch:형:丑戌",
      "month-v2:2026:1:2:month:2026:1:branch:파:丑辰",
      "month-v2:2026:1:2:month:2026:1:element:heavy:earth",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "roleRefs": [
      "tr:god:비견",
      "tr:god:정재",
      "tr:god:겁재"
    ],
    "question": "戊子 비견·정재의 natal 삼합과 己丑 겁재·겁재의 natal 형·파를 같은 자원 공유 조언으로 요약하지 않았는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:비견",
      "tr:god:정재",
      "tr:god:겁재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:2",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-02",
    "factsRef": "offline-periods.json#/annual/C/months/2",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-02-01T00:00:00+09:00\",\"end\":\"2026-02-04T05:02:08+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"丑\"},\"annual\":{\"stem\":\"乙\",\"branch\":\"巳\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:형:丑戌\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:branch:파:丑辰\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"丑\",\"participants\":[\"丑\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month:2026:2:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"巳\",\"丑\"],\"monthBranch\":\"丑\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"乙巳\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-02-04T05:02:08+09:00\",\"end\":\"2026-03-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:반합:寅戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:육합:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:파:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month:2026:2:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_dayun_branch:3:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:2:2:month_dayun_branch:3:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:2:1:month",
      "month-v2:2026:2:1:annual",
      "month-v2:2026:2:1:dayun",
      "month-v2:2026:2:1:ten_gods",
      "month-v2:2026:2:1:elements",
      "month-v2:2026:2:1:month:2026:2:branch:형:丑戌",
      "month-v2:2026:2:1:month:2026:2:branch:파:丑辰",
      "month-v2:2026:2:1:month:2026:2:element:heavy:earth",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:ten_gods",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅戌",
      "month-v2:2026:2:2:month:2026:2:branch:육합:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:파:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:2:2:month_dayun_branch:3:충:寅申",
      "month-v2:2026:2:2:month_dayun_branch:3:형:申寅"
    ],
    "roleRefs": [
      "tr:god:겁재",
      "tr:god:식신",
      "tr:god:편관"
    ],
    "question": "庚寅 식신·편관 구간의 운 寅申 충·형과 연운 寅午 반합을 다른 소유자의 요구와 생산 질문으로 나눌까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:겁재",
      "tr:god:식신",
      "tr:god:편관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:3",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-03",
    "factsRef": "offline-periods.json#/annual/C/months/3",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-03-01T00:00:00+09:00\",\"end\":\"2026-03-05T22:59:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"寅\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"편관\",\"relations\":[{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:반합:寅戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:육합:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:파:寅亥\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:충:寅申\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"寅\",\"participants\":[\"寅\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month:2026:3:branch:형:申寅\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"寅\",\"participants\":[\"申\",\"寅\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"寅\",\"午\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_dayun_branch:3:충:寅申\",\"source\":\"month_dayun_branch\",\"type\":\"충\",\"participants\":[\"寅\",\"申\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:1:month_dayun_branch:3:형:申寅\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"申\",\"寅\"],\"monthBranch\":\"寅\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-03-05T22:59:00+09:00\",\"end\":\"2026-04-01T00:00:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:반합:卯亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month:2026:3:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:3:2:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:3:1:month",
      "month-v2:2026:3:1:annual",
      "month-v2:2026:3:1:dayun",
      "month-v2:2026:3:1:ten_gods",
      "month-v2:2026:3:1:elements",
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅戌",
      "month-v2:2026:3:1:month:2026:3:branch:육합:寅亥",
      "month-v2:2026:3:1:month:2026:3:branch:파:寅亥",
      "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
      "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:1:month_dayun_branch:3:충:寅申",
      "month-v2:2026:3:1:month_dayun_branch:3:형:申寅",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:ten_gods",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯亥",
      "month-v2:2026:3:2:month:2026:3:branch:육합:卯戌",
      "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "roleRefs": [
      "tr:god:식신",
      "tr:god:편관",
      "tr:god:상관",
      "tr:god:정관"
    ],
    "question": "辛卯 상관·정관 구간의 natal 연지 육합과 시지 해를 실제 제안의 기준·검토 조건으로 구분할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:식신",
      "tr:god:편관",
      "tr:god:상관",
      "tr:god:정관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:4",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-04",
    "factsRef": "offline-periods.json#/annual/C/months/4",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-04-01T00:00:00+09:00\",\"end\":\"2026-04-05T03:40:00+09:00\",\"month\":{\"stem\":\"辛\",\"branch\":\"卯\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"상관\",\"branchGod\":\"정관\",\"relations\":[{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:반합:卯亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:육합:卯戌\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month:2026:4:branch:해:卯辰\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"卯\",\"participants\":[\"卯\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:1:month_annual_branch:丙午:파:卯午\",\"source\":\"month_annual_branch\",\"type\":\"파\",\"participants\":[\"卯\",\"午\"],\"monthBranch\":\"卯\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-04-05T03:40:00+09:00\",\"end\":\"2026-05-01T00:00:00+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:branch:형:辰辰\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month:2026:4:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:4:2:month_dayun_branch:3:반합:申辰\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:4:1:month",
      "month-v2:2026:4:1:annual",
      "month-v2:2026:4:1:dayun",
      "month-v2:2026:4:1:ten_gods",
      "month-v2:2026:4:1:elements",
      "month-v2:2026:4:1:month:2026:4:branch:반합:卯亥",
      "month-v2:2026:4:1:month:2026:4:branch:육합:卯戌",
      "month-v2:2026:4:1:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:ten_gods",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:충:辰戌",
      "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
      "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
      "month-v2:2026:4:2:month_dayun_branch:3:반합:申辰"
    ],
    "roleRefs": [
      "tr:god:상관",
      "tr:god:정관",
      "tr:god:편재",
      "tr:god:비견"
    ],
    "question": "壬辰 편재·비견 구간에서 토 heavy 표지와 natal 辰戌 충을 돈의 위험 점수로 더하지 않았는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:상관",
      "tr:god:정관",
      "tr:god:편재",
      "tr:god:비견",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:5",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-05",
    "factsRef": "offline-periods.json#/annual/C/months/5",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-05-01T00:00:00+09:00\",\"end\":\"2026-05-05T20:48:44+09:00\",\"month\":{\"stem\":\"壬\",\"branch\":\"辰\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편재\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:반합:辰申\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"申\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:branch:형:辰辰\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"辰\",\"participants\":[\"辰\",\"辰\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month:2026:5:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:1:month_dayun_branch:3:반합:申辰\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"辰\"],\"monthBranch\":\"辰\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-05-05T20:48:44+09:00\",\"end\":\"2026-06-01T00:00:00+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:충:巳亥\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month:2026:5:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:육합:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:형:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:5:2:month_dayun_branch:3:파:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:5:1:month",
      "month-v2:2026:5:1:annual",
      "month-v2:2026:5:1:dayun",
      "month-v2:2026:5:1:ten_gods",
      "month-v2:2026:5:1:elements",
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
      "month-v2:2026:5:1:month:2026:5:branch:충:辰戌",
      "month-v2:2026:5:1:month:2026:5:branch:형:辰辰",
      "month-v2:2026:5:1:month:2026:5:element:heavy:earth",
      "month-v2:2026:5:1:month_dayun_branch:3:반합:申辰",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:ten_gods",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month:2026:5:branch:충:巳亥",
      "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
      "month-v2:2026:5:2:month:2026:5:element:missing:fire",
      "month-v2:2026:5:2:month:2026:5:element:heavy:earth",
      "month-v2:2026:5:2:month_dayun_branch:3:육합:巳申",
      "month-v2:2026:5:2:month_dayun_branch:3:형:巳申",
      "month-v2:2026:5:2:month_dayun_branch:3:파:巳申"
    ],
    "roleRefs": [
      "tr:god:편재",
      "tr:god:비견",
      "tr:god:정재",
      "tr:god:편인"
    ],
    "question": "癸巳 정재·편인 구간의 natal 월지 충과 운의 육합·형·파에서 자원 운영과 정보 검증을 어떻게 나눌까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편재",
      "tr:god:비견",
      "tr:god:정재",
      "tr:god:편인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:6",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-06",
    "factsRef": "offline-periods.json#/annual/C/months/6",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-06-01T00:00:00+09:00\",\"end\":\"2026-06-06T00:48:21+09:00\",\"month\":{\"stem\":\"癸\",\"branch\":\"巳\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정재\",\"branchGod\":\"편인\",\"relations\":[{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:충:巳亥\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:육합:巳申\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:형:巳申\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:branch:파:巳申\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"巳\",\"participants\":[\"巳\",\"申\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month:2026:6:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:육합:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"육합\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:형:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"형\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:1:month_dayun_branch:3:파:巳申\",\"source\":\"month_dayun_branch\",\"type\":\"파\",\"participants\":[\"巳\",\"申\"],\"monthBranch\":\"巳\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-06-06T00:48:21+09:00\",\"end\":\"2026-07-01T00:00:00+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:6:2:month:2026:6:branch:반합:午戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month:2026:6:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:6:2:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:6:1:month",
      "month-v2:2026:6:1:annual",
      "month-v2:2026:6:1:dayun",
      "month-v2:2026:6:1:ten_gods",
      "month-v2:2026:6:1:elements",
      "month-v2:2026:6:1:month:2026:6:branch:충:巳亥",
      "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
      "month-v2:2026:6:1:month:2026:6:element:missing:fire",
      "month-v2:2026:6:1:month:2026:6:element:heavy:earth",
      "month-v2:2026:6:1:month_dayun_branch:3:육합:巳申",
      "month-v2:2026:6:1:month_dayun_branch:3:형:巳申",
      "month-v2:2026:6:1:month_dayun_branch:3:파:巳申",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:ten_gods",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month:2026:6:branch:반합:午戌",
      "month-v2:2026:6:2:month:2026:6:element:missing:fire",
      "month-v2:2026:6:2:month:2026:6:element:heavy:earth",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午"
    ],
    "roleRefs": [
      "tr:god:정재",
      "tr:god:편인",
      "tr:god:편관",
      "tr:god:정인"
    ],
    "question": "甲午 편관·정인 구간의 실효 연주 午午 형이 natal 형이 아닌 기간간 접점임을 남겼는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정재",
      "tr:god:편인",
      "tr:god:편관",
      "tr:god:정인",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:7",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-07",
    "factsRef": "offline-periods.json#/annual/C/months/7",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-07-01T00:00:00+09:00\",\"end\":\"2026-07-07T10:56:57+09:00\",\"month\":{\"stem\":\"甲\",\"branch\":\"午\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편관\",\"branchGod\":\"정인\",\"relations\":[{\"id\":\"month-v2:2026:7:1:month:2026:7:branch:반합:午戌\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"午\",\"participants\":[\"午\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month:2026:7:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:1:month_annual_branch:丙午:형:午午\",\"source\":\"month_annual_branch\",\"type\":\"형\",\"participants\":[\"午\",\"午\"],\"monthBranch\":\"午\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-07-07T10:56:57+09:00\",\"end\":\"2026-08-01T00:00:00+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:반합:未亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month:2026:7:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:7:2:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:7:1:month",
      "month-v2:2026:7:1:annual",
      "month-v2:2026:7:1:dayun",
      "month-v2:2026:7:1:ten_gods",
      "month-v2:2026:7:1:elements",
      "month-v2:2026:7:1:month:2026:7:branch:반합:午戌",
      "month-v2:2026:7:1:month:2026:7:element:missing:fire",
      "month-v2:2026:7:1:month:2026:7:element:heavy:earth",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:ten_gods",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未亥",
      "month-v2:2026:7:2:month:2026:7:branch:형:戌未",
      "month-v2:2026:7:2:month:2026:7:branch:파:未戌",
      "month-v2:2026:7:2:month:2026:7:element:heavy:earth",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
    ],
    "roleRefs": [
      "tr:god:편관",
      "tr:god:정인",
      "tr:god:정관",
      "tr:god:겁재"
    ],
    "question": "乙未 정관·겁재 구간에서 natal 형·파와 연운 육합을 책임 기준과 분담 조건으로 따로 볼 수 있는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편관",
      "tr:god:정인",
      "tr:god:정관",
      "tr:god:겁재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:8",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-08",
    "factsRef": "offline-periods.json#/annual/C/months/8",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-08-01T00:00:00+09:00\",\"end\":\"2026-08-07T20:42:43+09:00\",\"month\":{\"stem\":\"乙\",\"branch\":\"未\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정관\",\"branchGod\":\"겁재\",\"relations\":[{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:반합:未亥\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:형:戌未\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"未\",\"participants\":[\"戌\",\"未\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:branch:파:未戌\",\"source\":\"month_natal_branch\",\"type\":\"파\",\"monthBranch\":\"未\",\"participants\":[\"未\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month:2026:8:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:1:month_annual_branch:丙午:육합:午未\",\"source\":\"month_annual_branch\",\"type\":\"육합\",\"participants\":[\"午\",\"未\"],\"monthBranch\":\"未\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-08-07T20:42:43+09:00\",\"end\":\"2026-09-01T00:00:00+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:반합:申辰\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:8:2:month:2026:8:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:8:1:month",
      "month-v2:2026:8:1:annual",
      "month-v2:2026:8:1:dayun",
      "month-v2:2026:8:1:ten_gods",
      "month-v2:2026:8:1:elements",
      "month-v2:2026:8:1:month:2026:8:branch:반합:未亥",
      "month-v2:2026:8:1:month:2026:8:branch:형:戌未",
      "month-v2:2026:8:1:month:2026:8:branch:파:未戌",
      "month-v2:2026:8:1:month:2026:8:element:heavy:earth",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:ten_gods",
      "month-v2:2026:8:2:elements",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申辰",
      "month-v2:2026:8:2:month:2026:8:branch:해:申亥",
      "month-v2:2026:8:2:month:2026:8:element:missing:fire",
      "month-v2:2026:8:2:month:2026:8:element:heavy:earth"
    ],
    "roleRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인",
      "tr:god:식신"
    ],
    "question": "丙申 편인·식신 구간에서 natal 월지 申亥 해는 조사와 산출 사이의 어떤 확인 질문을 주는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정관",
      "tr:god:겁재",
      "tr:god:편인",
      "tr:god:식신",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:9",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-09",
    "factsRef": "offline-periods.json#/annual/C/months/9",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-09-01T00:00:00+09:00\",\"end\":\"2026-09-07T23:41:16+09:00\",\"month\":{\"stem\":\"丙\",\"branch\":\"申\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"편인\",\"branchGod\":\"식신\",\"relations\":[{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:반합:申辰\",\"source\":\"month_natal_branch\",\"type\":\"반합\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"申\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:1:month:2026:9:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-09-07T23:41:16+09:00\",\"end\":\"2026-10-01T00:00:00+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:해:酉戌\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:branch:육합:辰酉\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"酉\",\"participants\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:9:2:month:2026:9:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:9:1:month",
      "month-v2:2026:9:1:annual",
      "month-v2:2026:9:1:dayun",
      "month-v2:2026:9:1:ten_gods",
      "month-v2:2026:9:1:elements",
      "month-v2:2026:9:1:month:2026:9:branch:반합:申辰",
      "month-v2:2026:9:1:month:2026:9:branch:해:申亥",
      "month-v2:2026:9:1:month:2026:9:element:missing:fire",
      "month-v2:2026:9:1:month:2026:9:element:heavy:earth",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:ten_gods",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month:2026:9:branch:해:酉戌",
      "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
      "month-v2:2026:9:2:month:2026:9:element:missing:fire",
      "month-v2:2026:9:2:month:2026:9:element:heavy:earth"
    ],
    "roleRefs": [
      "tr:god:편인",
      "tr:god:식신",
      "tr:god:정인",
      "tr:god:상관"
    ],
    "question": "丁酉 정인·상관 구간의 natal 시지 辰酉 육합과 연지 酉戌 해를 지원 활용과 새 설명으로 구분할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:편인",
      "tr:god:식신",
      "tr:god:정인",
      "tr:god:상관",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:10",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-10",
    "factsRef": "offline-periods.json#/annual/C/months/10",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-10-01T00:00:00+09:00\",\"end\":\"2026-10-08T15:29:17+09:00\",\"month\":{\"stem\":\"丁\",\"branch\":\"酉\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"정인\",\"branchGod\":\"상관\",\"relations\":[{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:해:酉戌\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"酉\",\"participants\":[\"酉\",\"戌\"],\"affectedPillars\":[\"year\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:branch:육합:辰酉\",\"source\":\"month_natal_branch\",\"type\":\"육합\",\"monthBranch\":\"酉\",\"participants\":[\"辰\",\"酉\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:missing:fire\",\"source\":\"month_natal_element\",\"type\":\"missing_element_present\",\"element\":\"fire\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:1:month:2026:10:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_generated\",\"element\":\"earth\",\"monthElements\":[\"fire\"],\"certainty\":\"confirmed\"}]},{\"start\":\"2026-10-08T15:29:17+09:00\",\"end\":\"2026-11-01T00:00:00+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:10:2:month:2026:10:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"戌\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month:2026:10:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:10:1:month",
      "month-v2:2026:10:1:annual",
      "month-v2:2026:10:1:dayun",
      "month-v2:2026:10:1:ten_gods",
      "month-v2:2026:10:1:elements",
      "month-v2:2026:10:1:month:2026:10:branch:해:酉戌",
      "month-v2:2026:10:1:month:2026:10:branch:육합:辰酉",
      "month-v2:2026:10:1:month:2026:10:element:missing:fire",
      "month-v2:2026:10:1:month:2026:10:element:heavy:earth",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:ten_gods",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
      "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌"
    ],
    "roleRefs": [
      "tr:god:정인",
      "tr:god:상관",
      "tr:god:비견"
    ],
    "question": "戊戌 비견·비견 구간에서 natal 시지 辰戌 충과 연운 午戌 반합의 다른 접점을 어떻게 확인할까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:정인",
      "tr:god:상관",
      "tr:god:비견",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:11",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-11",
    "factsRef": "offline-periods.json#/annual/C/months/11",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-11-01T00:00:00+09:00\",\"end\":\"2026-11-07T18:52:05+09:00\",\"month\":{\"stem\":\"戊\",\"branch\":\"戌\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"비견\",\"branchGod\":\"비견\",\"relations\":[{\"id\":\"month-v2:2026:11:1:month:2026:11:branch:충:辰戌\",\"source\":\"month_natal_branch\",\"type\":\"충\",\"monthBranch\":\"戌\",\"participants\":[\"辰\",\"戌\"],\"affectedPillars\":[\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month:2026:11:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌\",\"source\":\"month_annual_branch\",\"type\":\"반합\",\"participants\":[\"午\",\"戌\"],\"monthBranch\":\"戌\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-11-07T18:52:05+09:00\",\"end\":\"2026-12-01T00:00:00+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:형:亥亥\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month:2026:11:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:11:2:month_dayun_branch:3:해:申亥\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"申\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:11:1:month",
      "month-v2:2026:11:1:annual",
      "month-v2:2026:11:1:dayun",
      "month-v2:2026:11:1:ten_gods",
      "month-v2:2026:11:1:elements",
      "month-v2:2026:11:1:month:2026:11:branch:충:辰戌",
      "month-v2:2026:11:1:month:2026:11:element:heavy:earth",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:ten_gods",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month:2026:11:branch:형:亥亥",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:element:heavy:earth",
      "month-v2:2026:11:2:month_dayun_branch:3:해:申亥"
    ],
    "roleRefs": [
      "tr:god:비견",
      "tr:god:겁재",
      "tr:god:편재"
    ],
    "question": "己亥 겁재·편재 구간에서 운과 natal 일지의 申亥 해를 같은 위험의 중복으로 부풀리지 않았는가?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:비견",
      "tr:god:겁재",
      "tr:god:편재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  },
  {
    "id": "tr:month:C:12",
    "class": "D",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "personCase": "C",
    "period": "2026-12",
    "factsRef": "offline-periods.json#/annual/C/months/12",
    "calculatedFactClass": "B",
    "observedSignature": "[{\"start\":\"2026-12-01T00:00:00+09:00\",\"end\":\"2026-12-07T11:52:32+09:00\",\"month\":{\"stem\":\"己\",\"branch\":\"亥\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"겁재\",\"branchGod\":\"편재\",\"relations\":[{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:형:亥亥\",\"source\":\"month_natal_branch\",\"type\":\"형\",\"monthBranch\":\"亥\",\"participants\":[\"亥\",\"亥\"],\"affectedPillars\":[\"month\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:branch:해:申亥\",\"source\":\"month_natal_branch\",\"type\":\"해\",\"monthBranch\":\"亥\",\"participants\":[\"申\",\"亥\"],\"affectedPillars\":[\"day\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month:2026:12:element:heavy:earth\",\"source\":\"month_natal_element\",\"type\":\"heavy_element_present\",\"element\":\"earth\",\"monthElements\":[\"earth\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:1:month_dayun_branch:3:해:申亥\",\"source\":\"month_dayun_branch\",\"type\":\"해\",\"participants\":[\"申\",\"亥\"],\"monthBranch\":\"亥\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]},{\"start\":\"2026-12-07T11:52:32+09:00\",\"end\":\"2027-01-01T00:00:00+09:00\",\"month\":{\"stem\":\"庚\",\"branch\":\"子\"},\"annual\":{\"stem\":\"丙\",\"branch\":\"午\"},\"dayun\":{\"status\":\"active\",\"cycles\":[{\"index\":3,\"ganji\":\"壬申\"}],\"includesBeforeFirstCycle\":false,\"transitionRange\":null},\"stemGod\":\"식신\",\"branchGod\":\"정재\",\"relations\":[{\"id\":\"month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰\",\"source\":\"month_natal_branch\",\"type\":\"삼합\",\"monthBranch\":\"子\",\"participants\":[\"申\",\"子\",\"辰\"],\"affectedPillars\":[\"day\",\"hour\"],\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_annual_branch:丙午:충:子午\",\"source\":\"month_annual_branch\",\"type\":\"충\",\"participants\":[\"子\",\"午\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"annual\",\"pillar\":\"丙午\"},\"certainty\":\"confirmed\"},{\"id\":\"month-v2:2026:12:2:month_dayun_branch:3:반합:申子\",\"source\":\"month_dayun_branch\",\"type\":\"반합\",\"participants\":[\"申\",\"子\"],\"monthBranch\":\"子\",\"counterpart\":{\"scope\":\"dayun\",\"cycleIndex\":3,\"pillar\":\"壬申\"},\"certainty\":\"confirmed\"}]}]",
    "evidenceRefs": [
      "month-v2:2026:12:1:month",
      "month-v2:2026:12:1:annual",
      "month-v2:2026:12:1:dayun",
      "month-v2:2026:12:1:ten_gods",
      "month-v2:2026:12:1:elements",
      "month-v2:2026:12:1:month:2026:12:branch:형:亥亥",
      "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
      "month-v2:2026:12:1:month:2026:12:element:heavy:earth",
      "month-v2:2026:12:1:month_dayun_branch:3:해:申亥",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:ten_gods",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:3:반합:申子"
    ],
    "roleRefs": [
      "tr:god:겁재",
      "tr:god:편재",
      "tr:god:식신",
      "tr:god:정재"
    ],
    "question": "庚子 식신·정재 구간의 실제 natal 申子辰 삼합과 운의 申子 반합을 어떤 산출·운영 조건으로 나눌까?",
    "newInformation": "같은 달 안의 전후 월주·십성·실효 연주·대운·관계를 비교한다. 다음 달 초와 직전 달 후반의 동일 구간 내용은 새로운 사실로 중복 집계하지 않는다.",
    "timeLimit": "각 segment의 [startKst,endKstExclusive)만 적용하며 focus로 월 전체를 대체하지 않는다.",
    "positiveRiskReversalRefs": [
      "tr:god:겁재",
      "tr:god:편재",
      "tr:god:식신",
      "tr:god:정재",
      "tr:scope:natal_wolun",
      "tr:scope:dayun_wolun",
      "tr:scope:saeun_wolun"
    ],
    "excluded": "3기간 삼합·미지원 천간합·원진·합화·월별 사건을 새로 계산하거나 생성하지 않는다."
  }
] as const satisfies readonly PeriodApplication[];
