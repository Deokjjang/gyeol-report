import type { ObservedView } from "./researchTypes";

/** Actual producer observations, never newly authored monthly facts. */
export const ANNUAL_OBSERVED_MONTH_VIEWS: readonly ObservedView[] = [
  {
    "id": "afpr:observed:A:month:1",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 1,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 1,
      "recordSha256": "7ba362fe37f436cf1d5f1899246e7ee9ae08beccec4e03391e8160e3d0adf7c7"
    },
    "actualFocus": {
      "start": "2026-01-05T17:23:10+09:00",
      "end": "2026-02-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "丑"
      },
      "effectiveAnnual": {
        "stem": "乙",
        "branch": "巳"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:1:1:month:2026:1:branch:육합:子丑",
      "month-v2:2026:1:1:month:2026:1:branch:충:子午",
      "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month:2026:1:branch:육합:子丑",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:1:2026-01-05T17:23:10+09:00",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:month:2026:1:branch:육합:子丑",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:1:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 1월의 己丑 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:2",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 2,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 2,
      "recordSha256": "8a44212c9a2ec7b906ba740fc7ef8652ff7c23d33dc84207f1e4ca96d8d13c9e"
    },
    "actualFocus": {
      "start": "2026-02-04T05:02:08+09:00",
      "end": "2026-03-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "寅"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "비견"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
      "month-v2:2026:2:1:month:2026:2:branch:육합:子丑",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:element:missing:metal",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:2:2026-02-04T05:02:08+09:00",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:element:missing:metal",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:2:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 2월의 庚寅 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:3",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 3,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 3,
      "recordSha256": "bcb22553c1126ac50064c018d88d7855ec2c4895693b81e1af2cbfe33c7339f8"
    },
    "actualFocus": {
      "start": "2026-03-05T22:59:00+09:00",
      "end": "2026-04-01T00:00:00+09:00",
      "pillar": {
        "stem": "辛",
        "branch": "卯"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "겁재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
      "month-v2:2026:3:1:month:2026:3:element:missing:metal",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
      "month-v2:2026:3:2:month:2026:3:element:missing:metal",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:3:2026-03-05T22:59:00+09:00",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
      "month-v2:2026:3:2:month:2026:3:element:missing:metal",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:3:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 3월의 辛卯 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:4",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 4,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 4,
      "recordSha256": "efbc9154cc6fb74f3f3c79013f15d183fd52a092023de6546ab1a6646f8eb4bf"
    },
    "actualFocus": {
      "start": "2026-04-05T03:40:00+09:00",
      "end": "2026-05-01T00:00:00+09:00",
      "pillar": {
        "stem": "壬",
        "branch": "辰"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "식신"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
      "month-v2:2026:4:1:month:2026:4:branch:형:子卯",
      "month-v2:2026:4:1:month:2026:4:element:missing:metal",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
      "month-v2:2026:4:2:month:2026:4:branch:파:丑辰",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:4:2026-04-05T03:40:00+09:00",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
      "month-v2:2026:4:2:month:2026:4:branch:파:丑辰",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 4월의 壬辰 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:5",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 5,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 5,
      "recordSha256": "aff17cea245f2a2ec0e5090f394ff6949a974ce01f6d118fe780c65a61c20f3a"
    },
    "actualFocus": {
      "start": "2026-05-05T20:48:44+09:00",
      "end": "2026-06-01T00:00:00+09:00",
      "pillar": {
        "stem": "癸",
        "branch": "巳"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "상관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰子",
      "month-v2:2026:5:1:month:2026:5:branch:파:丑辰",
      "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
      "month-v2:2026:5:2:month:2026:5:branch:반합:巳丑",
      "month-v2:2026:5:2:month_dayun_branch:4:해:寅巳",
      "month-v2:2026:5:2:month_dayun_branch:4:형:寅巳"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:5:2026-05-05T20:48:44+09:00",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:month:2026:5:branch:반합:巳丑",
      "month-v2:2026:5:2:month_dayun_branch:4:해:寅巳",
      "month-v2:2026:5:2:month_dayun_branch:4:형:寅巳",
      "month-v2:2026:5:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 5월의 癸巳 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:6",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 6,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 6,
      "recordSha256": "7e3487445677d1ac2f9b277250aac4990f0c4030c0b4ea556d19d5505d66d84f"
    },
    "actualFocus": {
      "start": "2026-06-06T00:48:21+09:00",
      "end": "2026-07-01T00:00:00+09:00",
      "pillar": {
        "stem": "甲",
        "branch": "午"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:6:1:month:2026:6:branch:반합:巳丑",
      "month-v2:2026:6:1:month_dayun_branch:4:해:寅巳",
      "month-v2:2026:6:1:month_dayun_branch:4:형:寅巳",
      "month-v2:2026:6:2:month:2026:6:branch:해:丑午",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month:2026:6:branch:충:子午",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:반합:寅午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:6:2026-06-06T00:48:21+09:00",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:month:2026:6:branch:충:子午",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month:2026:6:branch:해:丑午",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:반합:寅午",
      "month-v2:2026:6:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 6월의 甲午 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:7",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 7,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 7,
      "recordSha256": "638fb8c88f340670800849d7efa9284158702d041fe3d13b17219b78c5d5c965"
    },
    "actualFocus": {
      "start": "2026-07-07T10:56:57+09:00",
      "end": "2026-08-01T00:00:00+09:00",
      "pillar": {
        "stem": "乙",
        "branch": "未"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:7:1:month:2026:7:branch:해:丑午",
      "month-v2:2026:7:1:month:2026:7:branch:형:午午",
      "month-v2:2026:7:1:month:2026:7:branch:충:子午",
      "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:1:month_dayun_branch:4:반합:寅午",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:충:丑未",
      "month-v2:2026:7:2:month:2026:7:branch:형:未丑",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month:2026:7:branch:해:子未",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:7:2026-07-07T10:56:57+09:00",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month:2026:7:branch:충:丑未",
      "month-v2:2026:7:2:month:2026:7:branch:해:子未",
      "month-v2:2026:7:2:month:2026:7:branch:형:未丑",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:7:2:ten_gods",
      "annual-month:2026-07-07T10:56:57+09:00:CHEON_EUL_GWIIN:month.branch",
      "natal.day.stem",
      "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
      "SajuCalcResult:tenGods.distribution:正財",
      "calendar:saju-calendar-kst-v2",
      "content-period:정재",
      "sajuKnowledgeBase:ten_god_zheng_cai",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_zheng_cai",
      "v4:semantic-meaning:ten_god_zheng_cai",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 7월의 乙未 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:8",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 8,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 8,
      "recordSha256": "bb436292d5ba7f3d7d4b4c3e10683e826d54d89f257e9764c420893693f913d5"
    },
    "actualFocus": {
      "start": "2026-08-07T20:42:43+09:00",
      "end": "2026-09-01T00:00:00+09:00",
      "pillar": {
        "stem": "丙",
        "branch": "申"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
      "month-v2:2026:8:1:month:2026:8:branch:충:丑未",
      "month-v2:2026:8:1:month:2026:8:branch:형:未丑",
      "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
      "month-v2:2026:8:1:month:2026:8:branch:해:子未",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申子",
      "month-v2:2026:8:2:month:2026:8:element:missing:metal",
      "month-v2:2026:8:2:month_dayun_branch:4:충:寅申",
      "month-v2:2026:8:2:month_dayun_branch:4:형:申寅"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:8:2026-08-07T20:42:43+09:00",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:elements",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申子",
      "month-v2:2026:8:2:month:2026:8:element:missing:metal",
      "month-v2:2026:8:2:month_dayun_branch:4:충:寅申",
      "month-v2:2026:8:2:month_dayun_branch:4:형:申寅",
      "month-v2:2026:8:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 8월의 丙申 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:9",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 9,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 9,
      "recordSha256": "3dfc39c77c076bbbcae2abc46a54ac35e8eaf1c4ce4185e9b30ac84fab096bfc"
    },
    "actualFocus": {
      "start": "2026-09-07T23:41:16+09:00",
      "end": "2026-10-01T00:00:00+09:00",
      "pillar": {
        "stem": "丁",
        "branch": "酉"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:9:1:month:2026:9:branch:반합:申子",
      "month-v2:2026:9:1:month:2026:9:element:missing:metal",
      "month-v2:2026:9:1:month_dayun_branch:4:충:寅申",
      "month-v2:2026:9:1:month_dayun_branch:4:형:申寅",
      "month-v2:2026:9:2:month:2026:9:branch:반합:酉丑",
      "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month:2026:9:element:missing:metal"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:9:2026-09-07T23:41:16+09:00",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:month:2026:9:branch:반합:酉丑",
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
      "month-v2:2026:9:2:month:2026:9:element:missing:metal",
      "month-v2:2026:9:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 9월의 丁酉 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:10",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 10,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 10,
      "recordSha256": "5298f83f5699d28ed8a06e17a4b1d74dee89b900153020d2b3b55214ebbdca33"
    },
    "actualFocus": {
      "start": "2026-10-08T15:29:17+09:00",
      "end": "2026-11-01T00:00:00+09:00",
      "pillar": {
        "stem": "戊",
        "branch": "戌"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:10:1:month:2026:10:branch:반합:酉丑",
      "month-v2:2026:10:1:month:2026:10:branch:파:子酉",
      "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
      "month-v2:2026:10:1:month:2026:10:element:missing:metal",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:형:丑戌",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:10:2026-10-08T15:29:17+09:00",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month:2026:10:branch:형:丑戌",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:반합:寅戌",
      "month-v2:2026:10:2:ten_gods",
      "canonical-natal-table-v1:features:sinsal_gwimun",
      "content-period:편인",
      "natal:sinsal_gwimun",
      "sajuFeatureTaxonomy:sinsal_gwimun",
      "v1:gwimun:pair",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:sinsal_gwimun",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 10월의 戊戌 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:11",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 11,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 11,
      "recordSha256": "2abf9570d2c0548d1656f0df289a84446815d0544b3e0fe64ca26d72f219adc6"
    },
    "actualFocus": {
      "start": "2026-11-07T18:52:05+09:00",
      "end": "2026-12-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "亥"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
      "month-v2:2026:11:1:month:2026:11:branch:형:丑戌",
      "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:1:month_dayun_branch:4:반합:寅戌",
      "month-v2:2026:11:2:month:2026:11:branch:반합:亥卯",
      "month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥",
      "month-v2:2026:11:2:month_dayun_branch:4:파:寅亥"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:11:2026-11-07T18:52:05+09:00",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:month:2026:11:branch:반합:亥卯",
      "month-v2:2026:11:2:month_dayun_branch:4:육합:寅亥",
      "month-v2:2026:11:2:month_dayun_branch:4:파:寅亥",
      "month-v2:2026:11:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business",
      "basis:DAY_STEM_TO_BRANCH",
      "branch:丑",
      "canonical-natal-table-v1:features:gwiin_cheoneul",
      "content-period:정인",
      "dayStem:庚",
      "natal:gwiin_cheoneul",
      "position:year",
      "sajuFeatureTaxonomy:gwiin_cheoneul",
      "shinsal:CHEON_EUL_GWIIN",
      "v1:gwiin:경:축",
      "v1:gwiin:천을귀인",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:gwiin_cheoneul",
      "annual-month:2026-11-07T18:52:05+09:00:MUN_CHANG_GWIIN:month.branch",
      "natal.day.stem",
      "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:MUN_CHANG_GWIIN",
      "mbti:INFJ:traits:growth:help_without_overcontrol:plainKo",
      "mbti:INFJ:traits:identity:idealistic_reformer:plainKo",
      "mbti:INFJ:traits:love:careful_start_deep_love:plainKo",
      "mbti:INFJ:traits:love:quiet_care_partner:plainKo",
      "mbti:INFJ:traits:strengths:compassion:plainKo",
      "mbti:INFJ:traits:strengths:peace_keeping:plainKo",
      "mbti:INFJ:traits:strengths:practical_insight:plainKo",
      "natal:hour:branch:卯",
      "natal:hour:stem:己",
      "natal:ten-god:hour:visible:己",
      "natal:ten-god:month:SUB:己",
      "natal:ten-god:month:visible:壬",
      "natal:ten-god:year:MAIN:己",
      "natal:year:stem:乙",
      "supplement:marker:DOHWA",
      "P02_GOOD_RELATION_RECIPROCITY"
    ],
    "researchQuestion": "이 11월의 己亥 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:A:month:12",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "A",
    "month": 12,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 12,
      "recordSha256": "65b6de241bf404b63cb9ce3ad57354c97862580eb04666218b12e5e2ea2255be"
    },
    "actualFocus": {
      "start": "2026-12-07T11:52:32+09:00",
      "end": "2027-01-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "子"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "戊寅"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "비견"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:12:1:month:2026:12:branch:반합:亥卯",
      "month-v2:2026:12:1:month_dayun_branch:4:육합:寅亥",
      "month-v2:2026:12:1:month_dayun_branch:4:파:寅亥",
      "month-v2:2026:12:2:month:2026:12:branch:육합:子丑",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:metal",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:12:2026-12-07T11:52:32+09:00",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:month:2026:12:branch:육합:子丑",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:metal",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:ten_gods",
      "careerContextV3:function:business_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:business"
    ],
    "researchQuestion": "이 12월의 庚子 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:1",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 1,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 1,
      "recordSha256": "c13d46c0283e553a8a41ef3a56e0328810b56c2930aaef613a2d175a5f3456a2"
    },
    "actualFocus": {
      "start": "2026-01-05T17:23:10+09:00",
      "end": "2026-02-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "丑"
      },
      "effectiveAnnual": {
        "stem": "乙",
        "branch": "巳"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:1:1:month:2026:1:branch:반합:子申",
      "month-v2:2026:1:1:month:2026:1:branch:충:子午",
      "month-v2:2026:1:1:month:2026:1:branch:해:子未",
      "month-v2:2026:1:1:month:2026:1:branch:형:子卯",
      "month-v2:2026:1:1:month:2026:1:element:missing:water",
      "month-v2:2026:1:1:month_dayun_branch:4:형:子卯",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month:2026:1:branch:충:丑未",
      "month-v2:2026:1:2:month:2026:1:branch:형:未丑",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:1:2026-01-05T17:23:10+09:00",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:month:2026:1:branch:충:丑未",
      "month-v2:2026:1:2:month:2026:1:branch:해:丑午",
      "month-v2:2026:1:2:month:2026:1:branch:형:未丑",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:1:2:ten_gods",
      "annual-month:2026-01-05T17:23:10+09:00:CHEON_EUL_GWIIN:month.branch",
      "natal.day.stem",
      "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
      "SajuCalcResult:tenGods.distribution:正財",
      "calendar:saju-calendar-kst-v2",
      "content-period:정재",
      "sajuKnowledgeBase:ten_god_zheng_cai",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_zheng_cai",
      "v4:semantic-meaning:ten_god_zheng_cai",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee",
      "natal:day:stem:甲",
      "natal:ten-god:day:MAIN:庚",
      "natal:ten-god:day:SUB:壬",
      "natal:ten-god:hour:visible:丁",
      "natal:ten-god:month:SUB:丁",
      "natal:ten-god:year:MAIN:丁",
      "natal:ten-god:year:visible:庚",
      "natal:year:stem:庚",
      "supplement:marker:YANGIN"
    ],
    "researchQuestion": "이 1월의 己丑 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:2",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 2,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 2,
      "recordSha256": "58a31d015c819f342e288c82cda687dec6a3320117ce0a69fb7be13c233bfd63"
    },
    "actualFocus": {
      "start": "2026-02-04T05:02:08+09:00",
      "end": "2026-03-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "寅"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
      "month-v2:2026:2:1:month:2026:2:branch:충:丑未",
      "month-v2:2026:2:1:month:2026:2:branch:형:未丑",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:2:2026-02-04T05:02:08+09:00",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:2:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 2월의 庚寅 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:3",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 3,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 3,
      "recordSha256": "b23ea75c8c48498f270155283808e976ea1e2894554e82708bd357e47d53e239"
    },
    "actualFocus": {
      "start": "2026-03-05T22:59:00+09:00",
      "end": "2026-04-01T00:00:00+09:00",
      "pillar": {
        "stem": "辛",
        "branch": "卯"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
      "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
      "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯未",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:3:2026-03-05T22:59:00+09:00",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯未",
      "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:3:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 3월의 辛卯 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:4",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 4,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 4,
      "recordSha256": "750908e91be6d8c8f8f759b9b7ade15297c8c29ec6b0e710051707db308cc496"
    },
    "actualFocus": {
      "start": "2026-04-05T03:40:00+09:00",
      "end": "2026-05-01T00:00:00+09:00",
      "pillar": {
        "stem": "壬",
        "branch": "辰"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:4:1:month:2026:4:branch:반합:卯未",
      "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:2:month:2026:4:element:missing:water",
      "month-v2:2026:4:2:month_dayun_branch:4:해:卯辰"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:4:2026-04-05T03:40:00+09:00",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:2:month:2026:4:element:missing:water",
      "month-v2:2026:4:2:month_dayun_branch:4:해:卯辰",
      "month-v2:2026:4:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 4월의 壬辰 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:5",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 5,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 5,
      "recordSha256": "984d48daa9aba314325d6727d0a4cdb5f18b9507a53ecf638b6abae577da25f1"
    },
    "actualFocus": {
      "start": "2026-05-05T20:48:44+09:00",
      "end": "2026-06-01T00:00:00+09:00",
      "pillar": {
        "stem": "癸",
        "branch": "巳"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
      "month-v2:2026:5:1:month:2026:5:branch:해:卯辰",
      "month-v2:2026:5:1:month:2026:5:element:missing:water",
      "month-v2:2026:5:1:month_dayun_branch:4:해:卯辰",
      "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
      "month-v2:2026:5:2:month:2026:5:element:missing:water"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:5:2026-05-05T20:48:44+09:00",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
      "month-v2:2026:5:2:month:2026:5:element:missing:water",
      "month-v2:2026:5:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 5월의 癸巳 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:6",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 6,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 6,
      "recordSha256": "6b49ac54e23160f707b6cc15ecd076914e4c44607e557d9ade510f0890833097"
    },
    "actualFocus": {
      "start": "2026-06-06T00:48:21+09:00",
      "end": "2026-07-01T00:00:00+09:00",
      "pillar": {
        "stem": "甲",
        "branch": "午"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "비견"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
      "month-v2:2026:6:1:month:2026:6:element:missing:water",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month:2026:6:branch:육합:午未",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:파:卯午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:6:2026-06-06T00:48:21+09:00",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:month:2026:6:branch:육합:午未",
      "month-v2:2026:6:2:month:2026:6:branch:파:卯午",
      "month-v2:2026:6:2:month:2026:6:branch:형:午午",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:month_dayun_branch:4:파:卯午",
      "month-v2:2026:6:2:ten_gods",
      "annual-month:2026-06-06T00:48:21+09:00:WOL_DEOK_GWIIN:month.stem",
      "natal.month.branch",
      "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:WOL_DEOK_GWIIN",
      "canonical-natal-table-v1:features:sinsal_yangin",
      "content-period:비견",
      "natal:sinsal_yangin",
      "sajuFeatureTaxonomy:sinsal_yangin",
      "v1:yangin:갑:묘",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:sinsal_yangin",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 6월의 甲午 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:7",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 7,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 7,
      "recordSha256": "1f527b01f12bc363ff389821c302a2416d02fb532e5b126f965c5a2496c1b311"
    },
    "actualFocus": {
      "start": "2026-07-07T10:56:57+09:00",
      "end": "2026-08-01T00:00:00+09:00",
      "pillar": {
        "stem": "乙",
        "branch": "未"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "겁재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:7:1:month:2026:7:branch:형:午午",
      "month-v2:2026:7:1:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:1:month_dayun_branch:4:파:卯午",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:7:2:month_dayun_branch:4:반합:卯未"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:7:2026-07-07T10:56:57+09:00",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
      "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:7:2:month_dayun_branch:4:반합:卯未",
      "month-v2:2026:7:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 7월의 乙未 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:8",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 8,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 8,
      "recordSha256": "edc84cc4751c5fde62cacf35a8cf5249b5a9af58bc158a8b20799747ad469125"
    },
    "actualFocus": {
      "start": "2026-08-07T20:42:43+09:00",
      "end": "2026-09-01T00:00:00+09:00",
      "pillar": {
        "stem": "丙",
        "branch": "申"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "식신"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
      "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:1:month_dayun_branch:4:반합:卯未"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:8:2026-08-07T20:42:43+09:00",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:elements",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 8월의 丙申 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:9",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 9,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 9,
      "recordSha256": "db9875f2c96d0d68199a5aebce42d166a68190b1ee1f26cfced540861a6e365f"
    },
    "actualFocus": {
      "start": "2026-09-07T23:41:16+09:00",
      "end": "2026-10-01T00:00:00+09:00",
      "pillar": {
        "stem": "丁",
        "branch": "酉"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "상관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month_dayun_branch:4:충:卯酉"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:9:2026-09-07T23:41:16+09:00",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:month:2026:9:branch:충:卯酉",
      "month-v2:2026:9:2:month_dayun_branch:4:충:卯酉",
      "month-v2:2026:9:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 9월의 丁酉 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:10",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 10,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 10,
      "recordSha256": "80ee026bd16cd2bc1dd5fe23fdc9265f7d20b38ce21f0903f0dbf011a59a96b0"
    },
    "actualFocus": {
      "start": "2026-10-08T15:29:17+09:00",
      "end": "2026-11-01T00:00:00+09:00",
      "pillar": {
        "stem": "戊",
        "branch": "戌"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:10:1:month:2026:10:branch:충:卯酉",
      "month-v2:2026:10:1:month_dayun_branch:4:충:卯酉",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:형:戌未",
      "month-v2:2026:10:2:month:2026:10:branch:파:未戌",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:10:2026-10-08T15:29:17+09:00",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
      "month-v2:2026:10:2:month:2026:10:branch:육합:卯戌",
      "month-v2:2026:10:2:month:2026:10:branch:파:未戌",
      "month-v2:2026:10:2:month:2026:10:branch:형:戌未",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:month_dayun_branch:4:육합:卯戌",
      "month-v2:2026:10:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee",
      "basis:BRANCH_GROUP_TO_BRANCH",
      "basis:YEAR_BRANCH_TO_BRANCH",
      "branch:申",
      "canonical-natal-table-v1:features:twelve_sinsal_yeokma",
      "content-period:편재",
      "natal:twelve_sinsal_yeokma",
      "position:day",
      "reference:YEAR_BRANCH",
      "referenceBranch:午",
      "sajuFeatureTaxonomy:twelve_sinsal_yeokma",
      "shinsal:TWELVE_YEOKMASAL",
      "shinsal:YEOKMASAL",
      "source:BRANCH_GROUP_TO_BRANCH",
      "v1:sinsal:역마살",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:twelve_sinsal_yeokma",
      "yearBranch:午",
      "foundation:element:EARTH:BALANCED",
      "mbti:ENTJ:traits:money:capitalist_resource_logic:plainKo",
      "mbti:ENTJ:traits:money:spending_for_speed:plainKo",
      "natal:month:branch:未",
      "natal:ten-god:day:MINOR:戊",
      "natal:ten-god:month:MAIN:己",
      "natal:ten-god:month:visible:癸",
      "natal:ten-god:year:SUB:己",
      "supplement:marker:BANAN",
      "supplement:stage:month:묘",
      "M02_ACCUMULATION"
    ],
    "researchQuestion": "이 10월의 戊戌 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:11",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 11,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 11,
      "recordSha256": "a29dc270b0a9b2882f527d9b62f1929486a4b819a5db56865543e8ff67dca1c1"
    },
    "actualFocus": {
      "start": "2026-11-07T18:52:05+09:00",
      "end": "2026-12-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "亥"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
      "month-v2:2026:11:1:month:2026:11:branch:형:戌未",
      "month-v2:2026:11:1:month:2026:11:branch:파:未戌",
      "month-v2:2026:11:1:month:2026:11:branch:육합:卯戌",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:1:month_dayun_branch:4:육합:卯戌",
      "month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:element:missing:water",
      "month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:11:2026-11-07T18:52:05+09:00",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:month:2026:11:branch:삼합:亥卯未",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:element:missing:water",
      "month-v2:2026:11:2:month_dayun_branch:4:반합:亥卯",
      "month-v2:2026:11:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee"
    ],
    "researchQuestion": "이 11월의 己亥 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:B:month:12",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "B",
    "month": 12,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 12,
      "recordSha256": "3cb064f08f8e9b48b3fcd6fe2f753225b9eb85eb8a133fcb0f80a4e1a8c33a54"
    },
    "actualFocus": {
      "start": "2026-12-07T11:52:32+09:00",
      "end": "2027-01-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "子"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 4,
            "ganji": "己卯"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:12:1:month:2026:12:branch:삼합:亥卯未",
      "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
      "month-v2:2026:12:1:month:2026:12:element:missing:water",
      "month-v2:2026:12:1:month_dayun_branch:4:반합:亥卯",
      "month-v2:2026:12:2:month:2026:12:branch:반합:子申",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:해:子未",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:water",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:4:형:子卯"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:12:2026-12-07T11:52:32+09:00",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:month:2026:12:branch:반합:子申",
      "month-v2:2026:12:2:month:2026:12:branch:충:子午",
      "month-v2:2026:12:2:month:2026:12:branch:해:子未",
      "month-v2:2026:12:2:month:2026:12:branch:형:子卯",
      "month-v2:2026:12:2:month:2026:12:element:missing:water",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:4:형:子卯",
      "month-v2:2026:12:2:ten_gods",
      "careerContextV3:function:sales_operations",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:employee",
      "SajuCalcResult:tenGods.distribution:偏官",
      "calendar:saju-calendar-kst-v2",
      "content-period:편관",
      "sajuKnowledgeBase:ten_god_qi_sha",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_qi_sha",
      "v4:semantic-meaning:ten_god_qi_sha"
    ],
    "researchQuestion": "이 12월의 庚子 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:1",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 1,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 1,
      "recordSha256": "7e7dee0ddf5f00fcec5c07c49c0a925db3534d9dac2152dc51bb38e68cb388ef"
    },
    "actualFocus": {
      "start": "2026-01-05T17:23:10+09:00",
      "end": "2026-02-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "丑"
      },
      "effectiveAnnual": {
        "stem": "乙",
        "branch": "巳"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "겁재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:1:1:month:2026:1:branch:삼합:申子辰",
      "month-v2:2026:1:1:month:2026:1:element:heavy:earth",
      "month-v2:2026:1:1:month_dayun_branch:3:반합:申子",
      "month-v2:2026:1:2:month:2026:1:branch:형:丑戌",
      "month-v2:2026:1:2:month:2026:1:branch:파:丑辰",
      "month-v2:2026:1:2:month:2026:1:element:heavy:earth",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:1:2026-01-05T17:23:10+09:00",
      "month-v2:2026:1:2:annual",
      "month-v2:2026:1:2:dayun",
      "month-v2:2026:1:2:elements",
      "month-v2:2026:1:2:month",
      "month-v2:2026:1:2:month:2026:1:branch:파:丑辰",
      "month-v2:2026:1:2:month:2026:1:branch:형:丑戌",
      "month-v2:2026:1:2:month:2026:1:element:heavy:earth",
      "month-v2:2026:1:2:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:1:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 1월의 己丑 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:2",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 2,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 2,
      "recordSha256": "b4595c2a1b5d180cee787b7833ebfd934cc49a2286b032eed4a64decffa012bb"
    },
    "actualFocus": {
      "start": "2026-02-04T05:02:08+09:00",
      "end": "2026-03-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "寅"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "식신"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:2:1:month:2026:2:branch:형:丑戌",
      "month-v2:2026:2:1:month:2026:2:branch:파:丑辰",
      "month-v2:2026:2:1:month:2026:2:element:heavy:earth",
      "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅戌",
      "month-v2:2026:2:2:month:2026:2:branch:육합:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:파:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:2:2:month_dayun_branch:3:충:寅申",
      "month-v2:2026:2:2:month_dayun_branch:3:형:申寅"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:2:2026-02-04T05:02:08+09:00",
      "month-v2:2026:2:2:annual",
      "month-v2:2026:2:2:dayun",
      "month-v2:2026:2:2:elements",
      "month-v2:2026:2:2:month",
      "month-v2:2026:2:2:month:2026:2:branch:반합:寅戌",
      "month-v2:2026:2:2:month:2026:2:branch:육합:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:충:寅申",
      "month-v2:2026:2:2:month:2026:2:branch:파:寅亥",
      "month-v2:2026:2:2:month:2026:2:branch:형:申寅",
      "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:2:2:month_dayun_branch:3:충:寅申",
      "month-v2:2026:2:2:month_dayun_branch:3:형:申寅",
      "month-v2:2026:2:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 2월의 庚寅 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:3",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 3,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 3,
      "recordSha256": "cce3ec6b01c0ed6bff75445743ed53508095da61343cad01c0a59a36cd32d58c"
    },
    "actualFocus": {
      "start": "2026-03-05T22:59:00+09:00",
      "end": "2026-04-01T00:00:00+09:00",
      "pillar": {
        "stem": "辛",
        "branch": "卯"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "상관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:3:1:month:2026:3:branch:반합:寅戌",
      "month-v2:2026:3:1:month:2026:3:branch:육합:寅亥",
      "month-v2:2026:3:1:month:2026:3:branch:파:寅亥",
      "month-v2:2026:3:1:month:2026:3:branch:충:寅申",
      "month-v2:2026:3:1:month:2026:3:branch:형:申寅",
      "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
      "month-v2:2026:3:1:month_dayun_branch:3:충:寅申",
      "month-v2:2026:3:1:month_dayun_branch:3:형:申寅",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯亥",
      "month-v2:2026:3:2:month:2026:3:branch:육합:卯戌",
      "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:3:2026-03-05T22:59:00+09:00",
      "month-v2:2026:3:2:annual",
      "month-v2:2026:3:2:dayun",
      "month-v2:2026:3:2:elements",
      "month-v2:2026:3:2:month",
      "month-v2:2026:3:2:month:2026:3:branch:반합:卯亥",
      "month-v2:2026:3:2:month:2026:3:branch:육합:卯戌",
      "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
      "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:3:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 3월의 辛卯 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:4",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 4,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 4,
      "recordSha256": "629400c5b16954c33cfeeb6dd7cad1d9c6b159be3e64d95e74bca21c94c932d3"
    },
    "actualFocus": {
      "start": "2026-04-05T03:40:00+09:00",
      "end": "2026-05-01T00:00:00+09:00",
      "pillar": {
        "stem": "壬",
        "branch": "辰"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:4:1:month:2026:4:branch:반합:卯亥",
      "month-v2:2026:4:1:month:2026:4:branch:육합:卯戌",
      "month-v2:2026:4:1:month:2026:4:branch:해:卯辰",
      "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:충:辰戌",
      "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
      "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
      "month-v2:2026:4:2:month_dayun_branch:3:반합:申辰"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:4:2026-04-05T03:40:00+09:00",
      "month-v2:2026:4:2:annual",
      "month-v2:2026:4:2:dayun",
      "month-v2:2026:4:2:elements",
      "month-v2:2026:4:2:month",
      "month-v2:2026:4:2:month:2026:4:branch:반합:辰申",
      "month-v2:2026:4:2:month:2026:4:branch:충:辰戌",
      "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
      "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
      "month-v2:2026:4:2:month_dayun_branch:3:반합:申辰",
      "month-v2:2026:4:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance",
      "SajuCalcResult:tenGods.distribution:偏財",
      "calendar:saju-calendar-kst-v2",
      "content-period:편재",
      "sajuKnowledgeBase:ten_god_pian_cai",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_pian_cai",
      "v4:semantic-meaning:ten_god_pian_cai",
      "foundation:element:EARTH:STRONG",
      "foundation:element:WOOD:BALANCED",
      "foundation:yin_yang:STRONG_YANG",
      "natal:day:stem:戊",
      "natal:hour:branch:辰",
      "natal:month:stem:乙",
      "natal:ten-god:day:SUB:壬",
      "natal:ten-god:hour:MINOR:癸",
      "natal:ten-god:month:MAIN:壬",
      "natal:ten-god:year:MINOR:丁",
      "natal:year:branch:戌",
      "natal:year:stem:甲",
      "supplement:marker:JAEGO",
      "supplement:stage:year:묘"
    ],
    "researchQuestion": "이 4월의 壬辰 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:5",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 5,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 5,
      "recordSha256": "2eb5da02fa490f598c1fc1775a24aa541debed849076182e89204057b03a2806"
    },
    "actualFocus": {
      "start": "2026-05-05T20:48:44+09:00",
      "end": "2026-06-01T00:00:00+09:00",
      "pillar": {
        "stem": "癸",
        "branch": "巳"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:5:1:month:2026:5:branch:반합:辰申",
      "month-v2:2026:5:1:month:2026:5:branch:충:辰戌",
      "month-v2:2026:5:1:month:2026:5:branch:형:辰辰",
      "month-v2:2026:5:1:month:2026:5:element:heavy:earth",
      "month-v2:2026:5:1:month_dayun_branch:3:반합:申辰",
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
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:5:2026-05-05T20:48:44+09:00",
      "month-v2:2026:5:2:annual",
      "month-v2:2026:5:2:dayun",
      "month-v2:2026:5:2:elements",
      "month-v2:2026:5:2:month",
      "month-v2:2026:5:2:month:2026:5:branch:육합:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:충:巳亥",
      "month-v2:2026:5:2:month:2026:5:branch:파:巳申",
      "month-v2:2026:5:2:month:2026:5:branch:형:巳申",
      "month-v2:2026:5:2:month:2026:5:element:heavy:earth",
      "month-v2:2026:5:2:month:2026:5:element:missing:fire",
      "month-v2:2026:5:2:month_dayun_branch:3:육합:巳申",
      "month-v2:2026:5:2:month_dayun_branch:3:파:巳申",
      "month-v2:2026:5:2:month_dayun_branch:3:형:巳申",
      "month-v2:2026:5:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 5월의 癸巳 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:6",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 6,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 6,
      "recordSha256": "9f529072a26c7fd1a58c027e47814921ca902247e7484c50a07d4985283d25d0"
    },
    "actualFocus": {
      "start": "2026-06-06T00:48:21+09:00",
      "end": "2026-07-01T00:00:00+09:00",
      "pillar": {
        "stem": "甲",
        "branch": "午"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:6:1:month:2026:6:branch:충:巳亥",
      "month-v2:2026:6:1:month:2026:6:branch:육합:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:형:巳申",
      "month-v2:2026:6:1:month:2026:6:branch:파:巳申",
      "month-v2:2026:6:1:month:2026:6:element:missing:fire",
      "month-v2:2026:6:1:month:2026:6:element:heavy:earth",
      "month-v2:2026:6:1:month_dayun_branch:3:육합:巳申",
      "month-v2:2026:6:1:month_dayun_branch:3:형:巳申",
      "month-v2:2026:6:1:month_dayun_branch:3:파:巳申",
      "month-v2:2026:6:2:month:2026:6:branch:반합:午戌",
      "month-v2:2026:6:2:month:2026:6:element:missing:fire",
      "month-v2:2026:6:2:month:2026:6:element:heavy:earth",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:6:2026-06-06T00:48:21+09:00",
      "month-v2:2026:6:2:annual",
      "month-v2:2026:6:2:dayun",
      "month-v2:2026:6:2:elements",
      "month-v2:2026:6:2:month",
      "month-v2:2026:6:2:month:2026:6:branch:반합:午戌",
      "month-v2:2026:6:2:month:2026:6:element:heavy:earth",
      "month-v2:2026:6:2:month:2026:6:element:missing:fire",
      "month-v2:2026:6:2:month_annual_branch:丙午:형:午午",
      "month-v2:2026:6:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 6월의 甲午 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:7",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 7,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 7,
      "recordSha256": "647a822680861f346b9b4f312198488446bd0ea47953ca8e821b9d861b8a3f1e"
    },
    "actualFocus": {
      "start": "2026-07-07T10:56:57+09:00",
      "end": "2026-08-01T00:00:00+09:00",
      "pillar": {
        "stem": "乙",
        "branch": "未"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정관"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:7:1:month:2026:7:branch:반합:午戌",
      "month-v2:2026:7:1:month:2026:7:element:missing:fire",
      "month-v2:2026:7:1:month:2026:7:element:heavy:earth",
      "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未亥",
      "month-v2:2026:7:2:month:2026:7:branch:형:戌未",
      "month-v2:2026:7:2:month:2026:7:branch:파:未戌",
      "month-v2:2026:7:2:month:2026:7:element:heavy:earth",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:7:2026-07-07T10:56:57+09:00",
      "month-v2:2026:7:2:annual",
      "month-v2:2026:7:2:dayun",
      "month-v2:2026:7:2:elements",
      "month-v2:2026:7:2:month",
      "month-v2:2026:7:2:month:2026:7:branch:반합:未亥",
      "month-v2:2026:7:2:month:2026:7:branch:파:未戌",
      "month-v2:2026:7:2:month:2026:7:branch:형:戌未",
      "month-v2:2026:7:2:month:2026:7:element:heavy:earth",
      "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:7:2:ten_gods",
      "annual-month:2026-07-07T10:56:57+09:00:CHEON_EUL_GWIIN:month.branch",
      "natal.day.stem",
      "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
      "SajuCalcResult:tenGods.distribution:正官",
      "calendar:saju-calendar-kst-v2",
      "content-period:정관",
      "sajuKnowledgeBase:ten_god_zheng_guan",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_zheng_guan",
      "v4:semantic-meaning:ten_god_zheng_guan",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 7월의 乙未 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:8",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 8,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 8,
      "recordSha256": "858cdfe15104d3676402982613141cf53841a0d19a8f3b736c568aafc286abb0"
    },
    "actualFocus": {
      "start": "2026-08-07T20:42:43+09:00",
      "end": "2026-09-01T00:00:00+09:00",
      "pillar": {
        "stem": "丙",
        "branch": "申"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "편인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:8:1:month:2026:8:branch:반합:未亥",
      "month-v2:2026:8:1:month:2026:8:branch:형:戌未",
      "month-v2:2026:8:1:month:2026:8:branch:파:未戌",
      "month-v2:2026:8:1:month:2026:8:element:heavy:earth",
      "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申辰",
      "month-v2:2026:8:2:month:2026:8:branch:해:申亥",
      "month-v2:2026:8:2:month:2026:8:element:missing:fire",
      "month-v2:2026:8:2:month:2026:8:element:heavy:earth"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:8:2026-08-07T20:42:43+09:00",
      "month-v2:2026:8:2:annual",
      "month-v2:2026:8:2:dayun",
      "month-v2:2026:8:2:elements",
      "month-v2:2026:8:2:month",
      "month-v2:2026:8:2:month:2026:8:branch:반합:申辰",
      "month-v2:2026:8:2:month:2026:8:branch:해:申亥",
      "month-v2:2026:8:2:month:2026:8:element:heavy:earth",
      "month-v2:2026:8:2:month:2026:8:element:missing:fire",
      "month-v2:2026:8:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 8월의 丙申 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:9",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 9,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 9,
      "recordSha256": "783aa8dc592d3f80e14ca621602e37dc508a5b3ff31183c5b813d7fa47b43670"
    },
    "actualFocus": {
      "start": "2026-09-07T23:41:16+09:00",
      "end": "2026-10-01T00:00:00+09:00",
      "pillar": {
        "stem": "丁",
        "branch": "酉"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "정인"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:9:1:month:2026:9:branch:반합:申辰",
      "month-v2:2026:9:1:month:2026:9:branch:해:申亥",
      "month-v2:2026:9:1:month:2026:9:element:missing:fire",
      "month-v2:2026:9:1:month:2026:9:element:heavy:earth",
      "month-v2:2026:9:2:month:2026:9:branch:해:酉戌",
      "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
      "month-v2:2026:9:2:month:2026:9:element:missing:fire",
      "month-v2:2026:9:2:month:2026:9:element:heavy:earth"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:9:2026-09-07T23:41:16+09:00",
      "month-v2:2026:9:2:annual",
      "month-v2:2026:9:2:dayun",
      "month-v2:2026:9:2:elements",
      "month-v2:2026:9:2:month",
      "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
      "month-v2:2026:9:2:month:2026:9:branch:해:酉戌",
      "month-v2:2026:9:2:month:2026:9:element:heavy:earth",
      "month-v2:2026:9:2:month:2026:9:element:missing:fire",
      "month-v2:2026:9:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 9월의 丁酉 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:10",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 10,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 10,
      "recordSha256": "8ef2598042b88ea70ccc8ef6d1c0ad0e5509129bb15216191fe6b0610936bcd5"
    },
    "actualFocus": {
      "start": "2026-10-08T15:29:17+09:00",
      "end": "2026-11-01T00:00:00+09:00",
      "pillar": {
        "stem": "戊",
        "branch": "戌"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "비견"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:10:1:month:2026:10:branch:해:酉戌",
      "month-v2:2026:10:1:month:2026:10:branch:육합:辰酉",
      "month-v2:2026:10:1:month:2026:10:element:missing:fire",
      "month-v2:2026:10:1:month:2026:10:element:heavy:earth",
      "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
      "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:10:2026-10-08T15:29:17+09:00",
      "month-v2:2026:10:2:annual",
      "month-v2:2026:10:2:dayun",
      "month-v2:2026:10:2:elements",
      "month-v2:2026:10:2:month",
      "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
      "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
      "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:10:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance",
      "SajuCalcResult:tenGods.distribution:比肩",
      "calendar:saju-calendar-kst-v2",
      "content-period:비견",
      "sajuKnowledgeBase:ten_god_bijian",
      "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:ten_god_bijian",
      "v4:semantic-meaning:ten_god_bijian",
      "mbti:ENFP:traits:child:anti_conservative_child:plainKo",
      "mbti:ENFP:traits:child:playful_social_child:plainKo",
      "mbti:ENFP:traits:identity:people_centered_energy:plainKo",
      "mbti:ENFP:traits:identity:warm_individualist:plainKo",
      "mbti:ENFP:traits:relationships:wide_light_network:plainKo",
      "natal:ten-god:day:MINOR:戊",
      "natal:ten-god:hour:MAIN:戊",
      "natal:ten-god:hour:visible:丙",
      "natal:ten-god:year:MAIN:戊",
      "natal:ten-god:year:SUB:辛",
      "natal:year:stem:甲",
      "resonance:PR057"
    ],
    "researchQuestion": "이 10월의 戊戌 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:11",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 11,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 11,
      "recordSha256": "001fc66b2c8c7f193704883d1fecf8fc3a4cd1063aa9cc75ca019d9fbfc0037f"
    },
    "actualFocus": {
      "start": "2026-11-07T18:52:05+09:00",
      "end": "2026-12-01T00:00:00+09:00",
      "pillar": {
        "stem": "己",
        "branch": "亥"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "겁재"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:11:1:month:2026:11:branch:충:辰戌",
      "month-v2:2026:11:1:month:2026:11:element:heavy:earth",
      "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
      "month-v2:2026:11:2:month:2026:11:branch:형:亥亥",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:element:heavy:earth",
      "month-v2:2026:11:2:month_dayun_branch:3:해:申亥"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:11:2026-11-07T18:52:05+09:00",
      "month-v2:2026:11:2:annual",
      "month-v2:2026:11:2:dayun",
      "month-v2:2026:11:2:elements",
      "month-v2:2026:11:2:month",
      "month-v2:2026:11:2:month:2026:11:branch:해:申亥",
      "month-v2:2026:11:2:month:2026:11:branch:형:亥亥",
      "month-v2:2026:11:2:month:2026:11:element:heavy:earth",
      "month-v2:2026:11:2:month_dayun_branch:3:해:申亥",
      "month-v2:2026:11:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance"
    ],
    "researchQuestion": "이 11월의 己亥 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  },
  {
    "id": "afpr:observed:C:month:12",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "caseId": "C",
    "month": 12,
    "selectedYear": 2026,
    "scope": "actual_offline_month_observation",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "C",
      "month": 12,
      "recordSha256": "26eff65b1a0e2f4f133cf98c97e034dfc36b7b9b1ac213a85912fe8476fddf97"
    },
    "actualFocus": {
      "start": "2026-12-07T11:52:32+09:00",
      "end": "2027-01-01T00:00:00+09:00",
      "pillar": {
        "stem": "庚",
        "branch": "子"
      },
      "effectiveAnnual": {
        "stem": "丙",
        "branch": "午"
      },
      "dayun": {
        "status": "active",
        "cycles": [
          {
            "index": 3,
            "ganji": "壬申"
          }
        ],
        "includesBeforeFirstCycle": false,
        "transitionRange": null
      },
      "god": "식신"
    },
    "segmentCount": 2,
    "originalFactIds": [
      "month-v2:2026:12:1:month:2026:12:branch:형:亥亥",
      "month-v2:2026:12:1:month:2026:12:branch:해:申亥",
      "month-v2:2026:12:1:month:2026:12:element:heavy:earth",
      "month-v2:2026:12:1:month_dayun_branch:3:해:申亥",
      "month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:3:반합:申子"
    ],
    "displayedProofSourceRefs": [
      "annual-month-jie-kst-v2",
      "calendarMonths:12:2026-12-07T11:52:32+09:00",
      "month-v2:2026:12:2:annual",
      "month-v2:2026:12:2:dayun",
      "month-v2:2026:12:2:elements",
      "month-v2:2026:12:2:month",
      "month-v2:2026:12:2:month:2026:12:branch:삼합:申子辰",
      "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
      "month-v2:2026:12:2:month_dayun_branch:3:반합:申子",
      "month-v2:2026:12:2:ten_gods",
      "careerContextV3:function:design",
      "input:detailJob",
      "input:jobStatus",
      "v4:major-setting:freelance",
      "basis:DAY_STEM_TO_BRANCH",
      "branch:申",
      "canonical-natal-table-v1:features:gwiin_munchang",
      "content-period:식신",
      "dayStem:戊",
      "natal:gwiin_munchang",
      "position:day",
      "sajuFeatureTaxonomy:gwiin_munchang",
      "shinsal:MUN_CHANG_GWIIN",
      "v1:gwiin:무:신",
      "v1:gwiin:문창귀인",
      "v4-content-synthesis-13a-1",
      "v4:material-depth:gwiin_munchang"
    ],
    "researchQuestion": "이 12월의 庚子 focus와 실제 다른 segment에서 무엇이 바뀌고, 어떤 사실이 같은 원국 root로 유지되는가?",
    "referenceOnly": true,
    "notNewMeaningOrEvidence": true,
    "applicationPolicy": "use verified Study conditions only; no correction or new allocation in current prose",
    "bindingImplemented": false
  }
];
