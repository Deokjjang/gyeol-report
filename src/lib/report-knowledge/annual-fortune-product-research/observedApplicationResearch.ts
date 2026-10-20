import type { Study } from "./researchTypes";

/** Interpretive research against actual observed conditions. Current prose is unchanged. */
export const ANNUAL_OBSERVED_APPLICATIONS: readonly Study[] = [
  {
    "id": "afpr:case-study:nominal-stem",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "연도 단위 甲己 천간합과 1월 실효 연주는 다르다.",
    "positive": "선택한 2024년 전체 표와 현재 구간의 癸卯 근거를 분리해 읽을 수 있다.",
    "risk": "甲 annualStemRelations를 癸인 입춘 전 구간에 자동 적용하면 참가 천간이 바뀐다.",
    "twist": "같은 Book 안에서도 연간 표의 사실과 구간 claim의 사용 조건은 다를 수 있다.",
    "action": "실효 연주가 甲辰인 구간인지 확인한 뒤 해당 천간합의 시간 사용을 검토한다.",
    "scene": {
      "text": "가상으로 1월의 계획을 연간 표와 구간 표의 서로 다른 칸에 기록한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "annualStemRelations의 source는 존재해도 counterpart stem이 다르면 그 segment claim을 보류한다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "PAST",
      "month": 1,
      "recordSha256": "b6e2af1810c7d95e7cac84d1f3fb7675b5b31c5eff8f5a56c2f4ae26d447f6f5"
    },
    "actualScope": {
      "selectedYear": 2024,
      "focus": {
        "start": "2024-01-06T05:49:22+09:00",
        "end": "2024-02-01T00:00:00+09:00",
        "pillar": {
          "stem": "乙",
          "branch": "丑"
        },
        "effectiveAnnual": {
          "stem": "癸",
          "branch": "卯"
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
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "甲",
            "branch": "子"
          },
          "effectiveAnnualPillar": {
            "stem": "癸",
            "branch": "卯"
          },
          "activeDayunContext": {
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
          "startKst": "2024-01-01T00:00:00+09:00",
          "endKstExclusive": "2024-01-06T05:49:22+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "상관",
          "elements": [
            "wood",
            "water"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2024:1:1:month:2024:1:branch:육합:子丑",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "子",
              "participants": [
                "子",
                "丑"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2024:1:1:month:2024:1:branch:충:子午",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "子",
              "participants": [
                "子",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2024:1:1:month:2024:1:branch:형:子卯",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "子",
              "participants": [
                "子",
                "卯"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2024:1:1:month_annual_branch:癸卯:형:子卯",
              "source": "month_annual_branch",
              "type": "형",
              "participants": [
                "子",
                "卯"
              ],
              "monthBranch": "子",
              "counterpart": {
                "scope": "annual",
                "pillar": "癸卯"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2024:1:1:month",
            "month-v2:2024:1:1:annual",
            "month-v2:2024:1:1:dayun",
            "month-v2:2024:1:1:ten_gods",
            "month-v2:2024:1:1:elements",
            "month-v2:2024:1:1:month:2024:1:branch:육합:子丑",
            "month-v2:2024:1:1:month:2024:1:branch:충:子午",
            "month-v2:2024:1:1:month:2024:1:branch:형:子卯",
            "month-v2:2024:1:1:month_annual_branch:癸卯:형:子卯"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "乙",
            "branch": "丑"
          },
          "effectiveAnnualPillar": {
            "stem": "癸",
            "branch": "卯"
          },
          "activeDayunContext": {
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
          "startKst": "2024-01-06T05:49:22+09:00",
          "endKstExclusive": "2024-02-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:소한"
          ],
          "stemTenGod": "정재",
          "branchTenGod": "정인",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2024:1:2:month:2024:1:branch:해:丑午",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "丑",
              "participants": [
                "丑",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2024:1:2:month:2024:1:branch:육합:子丑",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "丑",
              "participants": [
                "子",
                "丑"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2024:1:2:month",
            "month-v2:2024:1:2:annual",
            "month-v2:2024:1:2:dayun",
            "month-v2:2024:1:2:ten_gods",
            "month-v2:2024:1:2:elements",
            "month-v2:2024:1:2:month:2024:1:branch:해:丑午",
            "month-v2:2024:1:2:month:2024:1:branch:육합:子丑"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [
        {
          "position": "hour",
          "natalStem": "己",
          "annualStem": "甲",
          "type": "천간합",
          "sourceRefs": [
            "saju/constants:STEM_COMBINATIONS",
            "natal:hour:stem",
            "annual:2024:stem"
          ]
        }
      ],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:ipchun-stem",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "2026 입춘 전 乙巳에서 정각 이후 丙午로 바뀐다.",
    "positive": "원국 辛과 연간 丙의 조합 표를 어느 구간에 대조할 수 있는지 구별한다.",
    "risk": "2월 전체에 丙辛 천간합을 적용하거나 합화 성립으로 확대하지 않는다.",
    "twist": "같은 원국 천간도 실효 연주가 달라지면 해당 비교의 조건이 달라진다.",
    "action": "2026-02-04 05:02:08 KST 전후 연주·월주를 나란히 확인한다.",
    "scene": {
      "text": "가상으로 같은 약속을 입춘 전과 뒤의 기간 조건에서 따로 검토한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "천간 쌍의 검출은 합화·사건·성공을 계산한 결과가 아니다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "EXACT_DAYUN",
      "month": 2,
      "recordSha256": "ef2152a95598e4ca4e0f1fed37474b8779caea75bd6ba9b55d81efc90cb67f9c"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "index": 2,
              "ganji": "壬辰"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "편재"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "己",
            "branch": "丑"
          },
          "effectiveAnnualPillar": {
            "stem": "乙",
            "branch": "巳"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "壬辰"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-02-01T00:00:00+09:00",
          "endKstExclusive": "2026-02-04T05:02:08+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "상관",
          "branchTenGod": "상관",
          "elements": [
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:2:1:month:2026:2:branch:반합:丑巳",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "丑",
              "participants": [
                "丑",
                "巳"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "丑",
              "participants": [
                "丑",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month:2026:2:branch:파:丑辰",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "丑",
              "participants": [
                "丑",
                "辰"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month:2026:2:branch:충:丑未",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "丑",
              "participants": [
                "丑",
                "未"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month:2026:2:branch:형:未丑",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "丑",
              "participants": [
                "未",
                "丑"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month:2026:2:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "巳",
                "丑"
              ],
              "monthBranch": "丑",
              "counterpart": {
                "scope": "annual",
                "pillar": "乙巳"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:1:month_dayun_branch:2:파:丑辰",
              "source": "month_dayun_branch",
              "type": "파",
              "participants": [
                "丑",
                "辰"
              ],
              "monthBranch": "丑",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 2,
                "pillar": "壬辰"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:2:1:month",
            "month-v2:2026:2:1:annual",
            "month-v2:2026:2:1:dayun",
            "month-v2:2026:2:1:ten_gods",
            "month-v2:2026:2:1:elements",
            "month-v2:2026:2:1:month:2026:2:branch:반합:丑巳",
            "month-v2:2026:2:1:month:2026:2:branch:해:丑午",
            "month-v2:2026:2:1:month:2026:2:branch:파:丑辰",
            "month-v2:2026:2:1:month:2026:2:branch:충:丑未",
            "month-v2:2026:2:1:month:2026:2:branch:형:未丑",
            "month-v2:2026:2:1:month:2026:2:element:heavy:earth",
            "month-v2:2026:2:1:month_annual_branch:乙巳:반합:巳丑",
            "month-v2:2026:2:1:month_dayun_branch:2:파:丑辰"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "庚",
            "branch": "寅"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "壬辰"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-02-04T05:02:08+09:00",
          "endKstExclusive": "2026-03-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:입춘"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "편인",
          "elements": [
            "metal",
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "寅",
              "participants": [
                "寅",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:2:month:2026:2:branch:해:寅巳",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "寅",
              "participants": [
                "寅",
                "巳"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:2:month:2026:2:branch:형:寅巳",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "寅",
              "participants": [
                "寅",
                "巳"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:2:month:2026:2:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:2:month:2026:2:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "fire",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "寅",
                "午"
              ],
              "monthBranch": "寅",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:2:2:month",
            "month-v2:2026:2:2:annual",
            "month-v2:2026:2:2:dayun",
            "month-v2:2026:2:2:ten_gods",
            "month-v2:2026:2:2:elements",
            "month-v2:2026:2:2:month:2026:2:branch:반합:寅午",
            "month-v2:2026:2:2:month:2026:2:branch:해:寅巳",
            "month-v2:2026:2:2:month:2026:2:branch:형:寅巳",
            "month-v2:2026:2:2:month:2026:2:element:missing:metal",
            "month-v2:2026:2:2:month:2026:2:element:heavy:fire",
            "month-v2:2026:2:2:month_annual_branch:丙午:반합:寅午"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [
        {
          "position": "year",
          "natalStem": "辛",
          "annualStem": "丙",
          "type": "천간합",
          "sourceRefs": [
            "saju/constants:STEM_COMBINATIONS",
            "natal:year:stem",
            "annual:2026:stem"
          ]
        }
      ],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:root-period",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "원국의 조정과 대운의 접점은 같은 근거가 아니다.",
    "positive": "학습 예산의 질문과 원국/대운 관계의 소유자를 나눠 설명할 수 있다.",
    "risk": "원국 子卯 형과 대운 酉–월운 卯 충을 한 사건이나 손실 점수로 합산하지 않는다.",
    "twist": "같은 생활 장면을 다뤄도 조정할 조건이 서로 다를 수 있다.",
    "action": "실제 준비비·생활비가 있다면 반복 부담과 기존 약속의 변경을 별도로 확인한다.",
    "scene": {
      "text": "가상으로 교재비와 모임 시간을 같은 예산에서 비교하되 담당 문제를 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 돈·일정 상황을 모르면 발생한 지출이나 갈등으로 서술하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 3,
      "recordSha256": "2ce1c5529fcd5330c4d9f5eaf469d78f458c5f1d505927b186f47c6ff49edf8f"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "정재"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "庚",
            "branch": "寅"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-03-01T00:00:00+09:00",
          "endKstExclusive": "2026-03-05T22:59:00+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "편인",
          "elements": [
            "metal",
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "寅",
              "participants": [
                "寅",
                "午"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:1:month:2026:3:element:missing:wood",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "wood",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:1:month:2026:3:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:1:month:2026:3:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "fire",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "寅",
                "午"
              ],
              "monthBranch": "寅",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:3:1:month",
            "month-v2:2026:3:1:annual",
            "month-v2:2026:3:1:dayun",
            "month-v2:2026:3:1:ten_gods",
            "month-v2:2026:3:1:elements",
            "month-v2:2026:3:1:month:2026:3:branch:반합:寅午",
            "month-v2:2026:3:1:month:2026:3:element:missing:wood",
            "month-v2:2026:3:1:month:2026:3:element:missing:metal",
            "month-v2:2026:3:1:month:2026:3:element:heavy:fire",
            "month-v2:2026:3:1:month_annual_branch:丙午:반합:寅午"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "辛",
            "branch": "卯"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-03-05T22:59:00+09:00",
          "endKstExclusive": "2026-04-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:경칩"
          ],
          "stemTenGod": "정재",
          "branchTenGod": "정인",
          "elements": [
            "metal",
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "卯",
              "participants": [
                "子",
                "卯"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "午"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month:2026:3:element:missing:wood",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "wood",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month:2026:3:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month:2026:3:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "fire",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午",
              "source": "month_annual_branch",
              "type": "파",
              "participants": [
                "卯",
                "午"
              ],
              "monthBranch": "卯",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:3:2:month_dayun_branch:3:충:卯酉",
              "source": "month_dayun_branch",
              "type": "충",
              "participants": [
                "卯",
                "酉"
              ],
              "monthBranch": "卯",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:3:2:month",
            "month-v2:2026:3:2:annual",
            "month-v2:2026:3:2:dayun",
            "month-v2:2026:3:2:ten_gods",
            "month-v2:2026:3:2:elements",
            "month-v2:2026:3:2:month:2026:3:branch:해:卯辰",
            "month-v2:2026:3:2:month:2026:3:branch:형:子卯",
            "month-v2:2026:3:2:month:2026:3:branch:파:卯午",
            "month-v2:2026:3:2:month:2026:3:element:missing:wood",
            "month-v2:2026:3:2:month:2026:3:element:missing:metal",
            "month-v2:2026:3:2:month:2026:3:element:heavy:fire",
            "month-v2:2026:3:2:month_annual_branch:丙午:파:卯午",
            "month-v2:2026:3:2:month_dayun_branch:3:충:卯酉"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:mixed-actors",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "원국 월지 子의 반합과 연지 辰의 형은 참가자가 다르다.",
    "positive": "연결할 접점과 반복 부담을 별도 질문으로 남길 수 있다.",
    "risk": "辰子 반합이 辰辰 형을 없애거나 시험 결과를 보장한다고 주장하지 않는다.",
    "twist": "함께 잘할 부분을 찾으면서도 부담의 기준을 다듬을 수 있다.",
    "action": "실제 과제가 있다면 같이 풀 부분과 도움을 요청할 기준을 나눈다.",
    "scene": {
      "text": "가상으로 조별 과제에서 공통 자료와 개인 마감의 부담을 별도로 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "관계 이름만으로 실제 반복 부담이나 상대 행동을 확정하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 4,
      "recordSha256": "9f0201ebaaa5f133613cf50aa57bff3c77385b88a82c7d0858c389d81820bb3e"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "편관"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "辛",
            "branch": "卯"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-04-01T00:00:00+09:00",
          "endKstExclusive": "2026-04-05T03:40:00+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "정재",
          "branchTenGod": "정인",
          "elements": [
            "metal",
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:4:1:month:2026:4:branch:해:卯辰",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month:2026:4:branch:형:子卯",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "卯",
              "participants": [
                "子",
                "卯"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "午"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month:2026:4:element:missing:wood",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "wood",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month:2026:4:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month:2026:4:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "fire",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
              "source": "month_annual_branch",
              "type": "파",
              "participants": [
                "卯",
                "午"
              ],
              "monthBranch": "卯",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:1:month_dayun_branch:3:충:卯酉",
              "source": "month_dayun_branch",
              "type": "충",
              "participants": [
                "卯",
                "酉"
              ],
              "monthBranch": "卯",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:4:1:month",
            "month-v2:2026:4:1:annual",
            "month-v2:2026:4:1:dayun",
            "month-v2:2026:4:1:ten_gods",
            "month-v2:2026:4:1:elements",
            "month-v2:2026:4:1:month:2026:4:branch:해:卯辰",
            "month-v2:2026:4:1:month:2026:4:branch:형:子卯",
            "month-v2:2026:4:1:month:2026:4:branch:파:卯午",
            "month-v2:2026:4:1:month:2026:4:element:missing:wood",
            "month-v2:2026:4:1:month:2026:4:element:missing:metal",
            "month-v2:2026:4:1:month:2026:4:element:heavy:fire",
            "month-v2:2026:4:1:month_annual_branch:丙午:파:卯午",
            "month-v2:2026:4:1:month_dayun_branch:3:충:卯酉"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "壬",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-04-05T03:40:00+09:00",
          "endKstExclusive": "2026-05-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:청명"
          ],
          "stemTenGod": "편관",
          "branchTenGod": "식신",
          "elements": [
            "water",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "子"
              ],
              "affectedPillars": [
                "year",
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:4:2:month_dayun_branch:3:육합:辰酉",
              "source": "month_dayun_branch",
              "type": "육합",
              "participants": [
                "辰",
                "酉"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:4:2:month",
            "month-v2:2026:4:2:annual",
            "month-v2:2026:4:2:dayun",
            "month-v2:2026:4:2:ten_gods",
            "month-v2:2026:4:2:elements",
            "month-v2:2026:4:2:month:2026:4:branch:반합:辰子",
            "month-v2:2026:4:2:month:2026:4:branch:형:辰辰",
            "month-v2:2026:4:2:month:2026:4:element:heavy:earth",
            "month-v2:2026:4:2:month_dayun_branch:3:육합:辰酉"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:dayun-only",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "focus의 지지 관계는 월운 巳와 대운 酉의 반합이다.",
    "positive": "정관의 기한·완료 기준을 장기 배경과의 제한된 접점으로 검토한다.",
    "risk": "원국 일지 관계나 완전 삼합이 있는 것처럼 장면을 추가하지 않는다.",
    "twist": "일부 조건만 맞아도 작은 약속을 완료하는 선택은 가능할 수 있다.",
    "action": "모임이나 과제에서 실제 맡은 일이 있다면 종료 기준을 확인한다.",
    "scene": {
      "text": "가상으로 모임 준비의 한 가지 결과만 맡고 완료일을 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "반합이 모든 역할·비용에 대한 합의라는 뜻은 아니다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 5,
      "recordSha256": "2ab4e1092fcdfd74174a86b9345bd4f648dcf65daccca3e8adf6007b9dd02dfb"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "정관"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "壬",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-05-01T00:00:00+09:00",
          "endKstExclusive": "2026-05-05T20:48:44+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "편관",
          "branchTenGod": "식신",
          "elements": [
            "water",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:5:1:month:2026:5:branch:반합:辰子",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "子"
              ],
              "affectedPillars": [
                "year",
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:5:1:month:2026:5:branch:형:辰辰",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:5:1:month:2026:5:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:5:1:month_dayun_branch:3:육합:辰酉",
              "source": "month_dayun_branch",
              "type": "육합",
              "participants": [
                "辰",
                "酉"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:5:1:month",
            "month-v2:2026:5:1:annual",
            "month-v2:2026:5:1:dayun",
            "month-v2:2026:5:1:ten_gods",
            "month-v2:2026:5:1:elements",
            "month-v2:2026:5:1:month:2026:5:branch:반합:辰子",
            "month-v2:2026:5:1:month:2026:5:branch:형:辰辰",
            "month-v2:2026:5:1:month:2026:5:element:heavy:earth",
            "month-v2:2026:5:1:month_dayun_branch:3:육합:辰酉"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "癸",
            "branch": "巳"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-05-05T20:48:44+09:00",
          "endKstExclusive": "2026-06-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:입하"
          ],
          "stemTenGod": "정관",
          "branchTenGod": "비견",
          "elements": [
            "water",
            "fire"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:5:2:month:2026:5:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:5:2:month:2026:5:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "earth",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:5:2:month_dayun_branch:3:반합:巳酉",
              "source": "month_dayun_branch",
              "type": "반합",
              "participants": [
                "巳",
                "酉"
              ],
              "monthBranch": "巳",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:5:2:month",
            "month-v2:2026:5:2:annual",
            "month-v2:2026:5:2:dayun",
            "month-v2:2026:5:2:ten_gods",
            "month-v2:2026:5:2:elements",
            "month-v2:2026:5:2:month:2026:5:element:heavy:fire",
            "month-v2:2026:5:2:month:2026:5:element:heavy:earth",
            "month-v2:2026:5:2:month_dayun_branch:3:반합:巳酉"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:sparse-focus",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "입추 뒤 丙申 focus에 지지 관계가 검출되지 않았다.",
    "positive": "식신의 작은 산출 질문과 확인된 오행·개인 기반을 구분해 사용할 수 있다.",
    "risk": "8월 전체에 관계가 없거나 평온·수익이 보장된다고 말하지 않는다.",
    "twist": "관계가 없어도 새 근거를 만들지 않고 유지·실행 점검으로 정보 기능을 정할 수 있다.",
    "action": "설명할 작은 결과가 있다면 완성 기준과 피드백을 확인한다.",
    "scene": {
      "text": "가상으로 복잡한 자료 한 부분을 쉬운 예로 설명해본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "입추 이전 segment의 관계가 남아 있으므로 focus 부재를 달 전체로 확대하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "B",
      "month": 8,
      "recordSha256": "edc84cc4751c5fde62cacf35a8cf5249b5a9af58bc158a8b20799747ad469125"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "乙",
            "branch": "未"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
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
          "startKst": "2026-08-01T00:00:00+09:00",
          "endKstExclusive": "2026-08-07T20:42:43+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "겁재",
          "branchTenGod": "정재",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "未",
              "participants": [
                "未",
                "卯"
              ],
              "affectedPillars": [
                "month",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "未",
              "participants": [
                "午",
                "未"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
              "source": "month_annual_branch",
              "type": "육합",
              "participants": [
                "午",
                "未"
              ],
              "monthBranch": "未",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month_dayun_branch:4:반합:卯未",
              "source": "month_dayun_branch",
              "type": "반합",
              "participants": [
                "卯",
                "未"
              ],
              "monthBranch": "未",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 4,
                "pillar": "己卯"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:8:1:month",
            "month-v2:2026:8:1:annual",
            "month-v2:2026:8:1:dayun",
            "month-v2:2026:8:1:ten_gods",
            "month-v2:2026:8:1:elements",
            "month-v2:2026:8:1:month:2026:8:branch:반합:未卯",
            "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
            "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
            "month-v2:2026:8:1:month_dayun_branch:4:반합:卯未"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "丙",
            "branch": "申"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
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
          "startKst": "2026-08-07T20:42:43+09:00",
          "endKstExclusive": "2026-09-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:입추"
          ],
          "stemTenGod": "식신",
          "branchTenGod": "편관",
          "elements": [
            "fire",
            "metal"
          ],
          "relationFacts": [],
          "evidenceIds": [
            "month-v2:2026:8:2:month",
            "month-v2:2026:8:2:annual",
            "month-v2:2026:8:2:dayun",
            "month-v2:2026:8:2:ten_gods",
            "month-v2:2026:8:2:elements"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:true-three-actors",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "월운 申과 원국 子·辰의 실제 세 지지가 삼합을 이룬다.",
    "positive": "여러 역할이 만나는 질문을 실제 참가자 범위에서 검토할 수 있다.",
    "risk": "세운/대운과 월운 두 참가자만으로 같은 삼합을 새로 만들지 않는다.",
    "twist": "모이는 접점이 있어도 각각 맡을 몫은 따로 정할 수 있다.",
    "action": "함께하는 과제가 있다면 공통 목표와 각자 끝낼 결과를 확인한다.",
    "scene": {
      "text": "가상으로 공동 발표에서 자료·정리·설명의 담당을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "삼합이라는 명칭이 실제 팀원 수·성공·재물 증가를 뜻하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 8,
      "recordSha256": "b5db0fe3b694e9838c6412abd4521b10e801b15cb1e91a7e3179cd719e3fde82"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "비견"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "乙",
            "branch": "未"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-08-01T00:00:00+09:00",
          "endKstExclusive": "2026-08-07T20:42:43+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "정인",
          "branchTenGod": "상관",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:8:1:month:2026:8:branch:해:子未",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "未",
              "participants": [
                "子",
                "未"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "未",
              "participants": [
                "午",
                "未"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month:2026:8:element:missing:wood",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "wood",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month:2026:8:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "fire",
              "monthElements": [
                "wood"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month:2026:8:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未",
              "source": "month_annual_branch",
              "type": "육합",
              "participants": [
                "午",
                "未"
              ],
              "monthBranch": "未",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:8:1:month",
            "month-v2:2026:8:1:annual",
            "month-v2:2026:8:1:dayun",
            "month-v2:2026:8:1:ten_gods",
            "month-v2:2026:8:1:elements",
            "month-v2:2026:8:1:month:2026:8:branch:해:子未",
            "month-v2:2026:8:1:month:2026:8:branch:육합:午未",
            "month-v2:2026:8:1:month:2026:8:element:missing:wood",
            "month-v2:2026:8:1:month:2026:8:element:heavy:fire",
            "month-v2:2026:8:1:month:2026:8:element:heavy:earth",
            "month-v2:2026:8:1:month_annual_branch:丙午:육합:午未"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "丙",
            "branch": "申"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-08-07T20:42:43+09:00",
          "endKstExclusive": "2026-09-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:입추"
          ],
          "stemTenGod": "비견",
          "branchTenGod": "편재",
          "elements": [
            "fire",
            "metal"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:8:2:month:2026:8:branch:삼합:申子辰",
              "source": "month_natal_branch",
              "type": "삼합",
              "monthBranch": "申",
              "participants": [
                "申",
                "子",
                "辰"
              ],
              "affectedPillars": [
                "year",
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:2:month:2026:8:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:2:month:2026:8:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:8:2:month:2026:8:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "earth",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:8:2:month",
            "month-v2:2026:8:2:annual",
            "month-v2:2026:8:2:dayun",
            "month-v2:2026:8:2:ten_gods",
            "month-v2:2026:8:2:elements",
            "month-v2:2026:8:2:month:2026:8:branch:삼합:申子辰",
            "month-v2:2026:8:2:month:2026:8:element:missing:metal",
            "month-v2:2026:8:2:month:2026:8:element:heavy:fire",
            "month-v2:2026:8:2:month:2026:8:element:heavy:earth"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:canonical-help",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "선택된 천을귀인 재료는 실제 월운 target의 canonical 관찰에 따른다.",
    "positive": "도움을 구할 구체적인 질문과 적용할 과제를 정할 수 있다.",
    "risk": "원국 귀인을 새로 발생한 월운 근거로 복제하거나 후원자 출현을 보장하지 않는다.",
    "twist": "도움을 받되 결정과 수행을 본인이 맡는 것이 기반을 키울 수 있다.",
    "action": "막힌 문제가 있다면 필요한 설명의 범위를 좁혀 묻는다.",
    "scene": {
      "text": "가상으로 운영의 한 절차를 아는 사람에게 질문하고 직접 적용한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 도움을 줄 사람이 있다는 사실은 신살 관찰만으로 확인되지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "A",
      "month": 7,
      "recordSha256": "638fb8c88f340670800849d7efa9284158702d041fe3d13b17219b78c5d5c965"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "甲",
            "branch": "午"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
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
          "startKst": "2026-07-01T00:00:00+09:00",
          "endKstExclusive": "2026-07-07T10:56:57+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "정관",
          "elements": [
            "wood",
            "fire"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:7:1:month:2026:7:branch:해:丑午",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "午",
              "participants": [
                "丑",
                "午"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:1:month:2026:7:branch:형:午午",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "午",
              "participants": [
                "午",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:1:month:2026:7:branch:충:子午",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "午",
              "participants": [
                "子",
                "午"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:1:month:2026:7:branch:파:卯午",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "午",
              "participants": [
                "卯",
                "午"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:1:month_annual_branch:丙午:형:午午",
              "source": "month_annual_branch",
              "type": "형",
              "participants": [
                "午",
                "午"
              ],
              "monthBranch": "午",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:1:month_dayun_branch:4:반합:寅午",
              "source": "month_dayun_branch",
              "type": "반합",
              "participants": [
                "寅",
                "午"
              ],
              "monthBranch": "午",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 4,
                "pillar": "戊寅"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
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
            "month-v2:2026:7:1:month_dayun_branch:4:반합:寅午"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "乙",
            "branch": "未"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
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
          "startKst": "2026-07-07T10:56:57+09:00",
          "endKstExclusive": "2026-08-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:소서"
          ],
          "stemTenGod": "정재",
          "branchTenGod": "정인",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:7:2:month:2026:7:branch:반합:未卯",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "未",
              "participants": [
                "未",
                "卯"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:2:month:2026:7:branch:충:丑未",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "未",
              "participants": [
                "丑",
                "未"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:2:month:2026:7:branch:형:未丑",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "未",
              "participants": [
                "未",
                "丑"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:2:month:2026:7:branch:육합:午未",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "未",
              "participants": [
                "午",
                "未"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:2:month:2026:7:branch:해:子未",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "未",
              "participants": [
                "子",
                "未"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:7:2:month_annual_branch:丙午:육합:午未",
              "source": "month_annual_branch",
              "type": "육합",
              "participants": [
                "午",
                "未"
              ],
              "monthBranch": "未",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
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
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": {
        "feature": "gwiin_cheoneul",
        "observations": [
          {
            "id": "annual-month:2026-07-07T10:56:57+09:00:CHEON_EUL_GWIIN:month.branch",
            "code": "CHEON_EUL_GWIIN",
            "label": "천을귀인",
            "kind": "noble",
            "basis": {
              "anchor": "natal.day.stem",
              "anchorValue": "庚",
              "target": "month.branch",
              "targetValue": "未",
              "rule": "DAY_STEM_TO_BRANCH"
            },
            "sourceRefs": [
              "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
              "calendarMonths:7:2026-07-07T10:56:57+09:00",
              "natal.day.stem"
            ]
          }
        ],
        "sourceRefs": [
          "annual-month:2026-07-07T10:56:57+09:00:CHEON_EUL_GWIIN:month.branch",
          "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
          "calendarMonths:7:2026-07-07T10:56:57+09:00",
          "natal.day.stem"
        ]
      }
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:appearance-not-outcome",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "선택된 도화 transit과 원국/대운 관계는 출처가 다르다.",
    "positive": "표현을 보여줄 접점과 역할 조정 조건을 나누어 검토한다.",
    "risk": "인기·호감·연애 성사 또는 실제 타인의 마음을 예언하지 않는다.",
    "twist": "눈에 띄는 기회가 있어도 작은 공동 결과에 집중하는 선택이 가능하다.",
    "action": "활동이 있다면 자신이 보여줄 결과와 공동 기여를 구체화한다.",
    "scene": {
      "text": "가상으로 모임에서 만든 결과를 소개하되 상대의 실제 반응을 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "도화가 선택됐다는 사실은 모든 관계 근거가 고객 원고에 표시됐다는 뜻이 아니다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 9,
      "recordSha256": "5f065b99bd8f9bdb35a15c3e4abe301a6a3bb4278a818aa2d9d888a9e04cff94"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "겁재"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "丙",
            "branch": "申"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-09-01T00:00:00+09:00",
          "endKstExclusive": "2026-09-07T23:41:16+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "비견",
          "branchTenGod": "편재",
          "elements": [
            "fire",
            "metal"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:9:1:month:2026:9:branch:삼합:申子辰",
              "source": "month_natal_branch",
              "type": "삼합",
              "monthBranch": "申",
              "participants": [
                "申",
                "子",
                "辰"
              ],
              "affectedPillars": [
                "year",
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:1:month:2026:9:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:1:month:2026:9:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:1:month:2026:9:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "earth",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:9:1:month",
            "month-v2:2026:9:1:annual",
            "month-v2:2026:9:1:dayun",
            "month-v2:2026:9:1:ten_gods",
            "month-v2:2026:9:1:elements",
            "month-v2:2026:9:1:month:2026:9:branch:삼합:申子辰",
            "month-v2:2026:9:1:month:2026:9:element:missing:metal",
            "month-v2:2026:9:1:month:2026:9:element:heavy:fire",
            "month-v2:2026:9:1:month:2026:9:element:heavy:earth"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "丁",
            "branch": "酉"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-09-07T23:41:16+09:00",
          "endKstExclusive": "2026-10-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:백로"
          ],
          "stemTenGod": "겁재",
          "branchTenGod": "정재",
          "elements": [
            "fire",
            "metal"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "酉",
              "participants": [
                "辰",
                "酉"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "酉",
              "participants": [
                "子",
                "酉"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:2:month:2026:9:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:2:month:2026:9:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:2:month:2026:9:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "earth",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:9:2:month_dayun_branch:3:형:酉酉",
              "source": "month_dayun_branch",
              "type": "형",
              "participants": [
                "酉",
                "酉"
              ],
              "monthBranch": "酉",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:9:2:month",
            "month-v2:2026:9:2:annual",
            "month-v2:2026:9:2:dayun",
            "month-v2:2026:9:2:ten_gods",
            "month-v2:2026:9:2:elements",
            "month-v2:2026:9:2:month:2026:9:branch:육합:辰酉",
            "month-v2:2026:9:2:month:2026:9:branch:파:子酉",
            "month-v2:2026:9:2:month:2026:9:element:missing:metal",
            "month-v2:2026:9:2:month:2026:9:element:heavy:fire",
            "month-v2:2026:9:2:month:2026:9:element:heavy:earth",
            "month-v2:2026:9:2:month_dayun_branch:3:형:酉酉"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": {
        "feature": "sinsal_dohwa",
        "observations": [
          {
            "id": "annual-month:2026-09-07T23:41:16+09:00:DOHWASAL:month.branch",
            "code": "DOHWASAL",
            "label": "도화살",
            "kind": "shinsal",
            "basis": {
              "anchor": "natal.year.branch",
              "anchorValue": "辰",
              "target": "month.branch",
              "targetValue": "酉",
              "rule": "YEAR_BRANCH_TO_BRANCH"
            },
            "sourceRefs": [
              "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:DOHWASAL",
              "calendarMonths:9:2026-09-07T23:41:16+09:00",
              "natal.year.branch"
            ]
          },
          {
            "id": "annual-month:2026-09-07T23:41:16+09:00:TWELVE_NYEONSAL:month.branch",
            "code": "TWELVE_NYEONSAL",
            "label": "년살",
            "kind": "shinsal",
            "basis": {
              "anchor": "natal.year.branch",
              "anchorValue": "辰",
              "target": "month.branch",
              "targetValue": "酉",
              "rule": "BRANCH_GROUP_TO_BRANCH"
            },
            "sourceRefs": [
              "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:TWELVE_NYEONSAL",
              "calendarMonths:9:2026-09-07T23:41:16+09:00",
              "natal.year.branch"
            ]
          }
        ],
        "sourceRefs": [
          "annual-month:2026-09-07T23:41:16+09:00:DOHWASAL:month.branch",
          "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:DOHWASAL",
          "calendarMonths:9:2026-09-07T23:41:16+09:00",
          "natal.year.branch",
          "annual-month:2026-09-07T23:41:16+09:00:TWELVE_NYEONSAL:month.branch",
          "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:TWELVE_NYEONSAL"
        ]
      }
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:output-with-adjustment",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "일지·시지 午와 戌의 반합, 연지 辰과 戌의 충이 공존한다.",
    "positive": "식신의 발표·실습 결과를 보여줄 접점과 일정 조정을 나누어 이해한다.",
    "risk": "반합이 충을 상쇄하거나 시험·성과 결과를 보장한다고 읽지 않는다.",
    "twist": "산출 범위를 줄이면서도 연결할 결과는 남길 수 있다.",
    "action": "실제 발표가 있다면 작은 완성본과 변경할 기존 약속을 함께 정한다.",
    "scene": {
      "text": "가상으로 실습 결과 한 부분을 완성하고 겹친 일정을 조정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "같은 午가 두 원국 자리에 있어도 독립적인 성공 근거를 두 배로 세지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 10,
      "recordSha256": "55e2a37bdf8916fb57a9b41c2be362620879ee1bc1d5453d38a74b4a63dcd723"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "식신"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "丁",
            "branch": "酉"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-10-01T00:00:00+09:00",
          "endKstExclusive": "2026-10-08T15:29:17+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "겁재",
          "branchTenGod": "정재",
          "elements": [
            "fire",
            "metal"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:10:1:month:2026:10:branch:육합:辰酉",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "酉",
              "participants": [
                "辰",
                "酉"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:1:month:2026:10:branch:파:子酉",
              "source": "month_natal_branch",
              "type": "파",
              "monthBranch": "酉",
              "participants": [
                "子",
                "酉"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:1:month:2026:10:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:1:month:2026:10:element:heavy:fire",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:1:month:2026:10:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_generated",
              "element": "earth",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:1:month_dayun_branch:3:형:酉酉",
              "source": "month_dayun_branch",
              "type": "형",
              "participants": [
                "酉",
                "酉"
              ],
              "monthBranch": "酉",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:10:1:month",
            "month-v2:2026:10:1:annual",
            "month-v2:2026:10:1:dayun",
            "month-v2:2026:10:1:ten_gods",
            "month-v2:2026:10:1:elements",
            "month-v2:2026:10:1:month:2026:10:branch:육합:辰酉",
            "month-v2:2026:10:1:month:2026:10:branch:파:子酉",
            "month-v2:2026:10:1:month:2026:10:element:missing:metal",
            "month-v2:2026:10:1:month:2026:10:element:heavy:fire",
            "month-v2:2026:10:1:month:2026:10:element:heavy:earth",
            "month-v2:2026:10:1:month_dayun_branch:3:형:酉酉"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "戊",
            "branch": "戌"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-10-08T15:29:17+09:00",
          "endKstExclusive": "2026-11-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:한로"
          ],
          "stemTenGod": "식신",
          "branchTenGod": "식신",
          "elements": [
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "戌",
              "participants": [
                "戌",
                "午"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "戌",
              "participants": [
                "辰",
                "戌"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "午",
                "戌"
              ],
              "monthBranch": "戌",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:10:2:month_dayun_branch:3:해:酉戌",
              "source": "month_dayun_branch",
              "type": "해",
              "participants": [
                "酉",
                "戌"
              ],
              "monthBranch": "戌",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:10:2:month",
            "month-v2:2026:10:2:annual",
            "month-v2:2026:10:2:dayun",
            "month-v2:2026:10:2:ten_gods",
            "month-v2:2026:10:2:elements",
            "month-v2:2026:10:2:month:2026:10:branch:반합:戌午",
            "month-v2:2026:10:2:month:2026:10:branch:충:辰戌",
            "month-v2:2026:10:2:month:2026:10:element:heavy:earth",
            "month-v2:2026:10:2:month_annual_branch:丙午:반합:午戌",
            "month-v2:2026:10:2:month_dayun_branch:3:해:酉戌"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:range-inside",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "4월의 실제 절입 뒤 교운 earliest 경계가 추가된다.",
    "positive": "확정 월주·원국·연주 관계와 대운 후보 관계를 구분한다.",
    "risk": "두 가능한 대운의 관계를 동시에 확정한 한 구간으로 합산하지 않는다.",
    "twist": "두 후보에 공통인 생활 확인부터 적용할 수 있다.",
    "action": "어느 대운일 때 성립하는지 각 counterpart cycle과 certainty를 확인한다.",
    "scene": {
      "text": "가상으로 역할이 확정되지 않은 동안 공통 준비와 후보별 비용을 따로 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "대운 범위가 정확한 시각으로 변환됐다고 표시하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "RANGE_DAYUN",
      "month": 4,
      "recordSha256": "305831795f20f3594215cdde36da1e4af9d65f3e22c2f6d546ae5cb5c5a8aa94"
    },
    "actualScope": {
      "selectedYear": 2027,
      "focus": {
        "start": "2027-04-05T09:17:31+09:00",
        "end": "2027-04-08T00:00:00+09:00",
        "pillar": {
          "stem": "甲",
          "branch": "辰"
        },
        "effectiveAnnual": {
          "stem": "丁",
          "branch": "未"
        },
        "dayun": {
          "status": "active",
          "cycles": [
            {
              "index": 2,
              "ganji": "己巳"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "비견"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "癸",
            "branch": "卯"
          },
          "effectiveAnnualPillar": {
            "stem": "丁",
            "branch": "未"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "己巳"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2027-04-01T00:00:00+09:00",
          "endKstExclusive": "2027-04-05T09:17:31+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "정인",
          "branchTenGod": "겁재",
          "elements": [
            "water",
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2027:4:1:month:2027:4:branch:반합:卯未",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "未"
              ],
              "affectedPillars": [
                "year",
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2027:4:1:month:2027:4:element:missing:water",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "water",
              "monthElements": [
                "water"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2027:4:1:month_annual_branch:丁未:반합:卯未",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "卯",
                "未"
              ],
              "monthBranch": "卯",
              "counterpart": {
                "scope": "annual",
                "pillar": "丁未"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2027:4:1:month",
            "month-v2:2027:4:1:annual",
            "month-v2:2027:4:1:dayun",
            "month-v2:2027:4:1:ten_gods",
            "month-v2:2027:4:1:elements",
            "month-v2:2027:4:1:month:2027:4:branch:반합:卯未",
            "month-v2:2027:4:1:month:2027:4:element:missing:water",
            "month-v2:2027:4:1:month_annual_branch:丁未:반합:卯未"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "甲",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "丁",
            "branch": "未"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "己巳"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2027-04-05T09:17:31+09:00",
          "endKstExclusive": "2027-04-08T00:00:00+09:00",
          "boundaryReason": [
            "jie:청명"
          ],
          "stemTenGod": "비견",
          "branchTenGod": "편재",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2027:4:2:month:2027:4:branch:반합:辰申",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "申"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2027:4:2:month:2027:4:branch:해:卯辰",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "辰",
              "participants": [
                "卯",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2027:4:2:month",
            "month-v2:2027:4:2:annual",
            "month-v2:2027:4:2:dayun",
            "month-v2:2027:4:2:ten_gods",
            "month-v2:2027:4:2:elements",
            "month-v2:2027:4:2:month:2027:4:branch:반합:辰申",
            "month-v2:2027:4:2:month:2027:4:branch:해:卯辰"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "甲",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "丁",
            "branch": "未"
          },
          "activeDayunContext": {
            "status": "transition_uncertain",
            "cycles": [
              {
                "index": 2,
                "ganji": "己巳"
              },
              {
                "index": 3,
                "ganji": "戊辰"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": {
              "earliestKst": "2027-04-08T00:00:00+09:00",
              "latestKst": "2027-08-08T21:59:59+09:00"
            }
          },
          "startKst": "2027-04-08T00:00:00+09:00",
          "endKstExclusive": "2027-05-01T00:00:00+09:00",
          "boundaryReason": [
            "dayun_uncertainty_start"
          ],
          "stemTenGod": "비견",
          "branchTenGod": "편재",
          "elements": [
            "wood",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2027:4:3:month:2027:4:branch:반합:辰申",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "申"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2027:4:3:month:2027:4:branch:해:卯辰",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "辰",
              "participants": [
                "卯",
                "辰"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2027:4:3:month_dayun_branch:3:형:辰辰",
              "source": "month_dayun_branch",
              "type": "형",
              "participants": [
                "辰",
                "辰"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "戊辰"
              },
              "certainty": "conditional"
            }
          ],
          "evidenceIds": [
            "month-v2:2027:4:3:month",
            "month-v2:2027:4:3:annual",
            "month-v2:2027:4:3:dayun",
            "month-v2:2027:4:3:ten_gods",
            "month-v2:2027:4:3:elements",
            "month-v2:2027:4:3:month:2027:4:branch:반합:辰申",
            "month-v2:2027:4:3:month:2027:4:branch:해:卯辰",
            "month-v2:2027:4:3:month_dayun_branch:3:형:辰辰"
          ],
          "uncertainty": [
            {
              "kind": "dayun_transition",
              "range": {
                "earliestKst": "2027-04-08T00:00:00+09:00",
                "latestKst": "2027-08-08T21:59:59+09:00"
              }
            }
          ]
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": {
        "feature": "gwiin_woldeok",
        "observations": [
          {
            "id": "annual-month:2027-04-05T09:17:31+09:00:WOL_DEOK_GWIIN:month.stem",
            "code": "WOL_DEOK_GWIIN",
            "label": "월덕귀인",
            "kind": "noble",
            "basis": {
              "anchor": "natal.month.branch",
              "anchorValue": "未",
              "target": "month.stem",
              "targetValue": "甲",
              "rule": "MONTH_BRANCH_TO_STEM"
            },
            "sourceRefs": [
              "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:WOL_DEOK_GWIIN",
              "calendarMonths:4:2027-04-05T09:17:31+09:00",
              "natal.month.branch"
            ]
          }
        ],
        "sourceRefs": [
          "annual-month:2027-04-05T09:17:31+09:00:WOL_DEOK_GWIIN:month.stem",
          "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:WOL_DEOK_GWIIN",
          "calendarMonths:4:2027-04-05T09:17:31+09:00",
          "natal.month.branch"
        ]
      }
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:annual-has-both-sides",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "2028년 4월의 월주가 유지되는 구간에서 교운이 따로 일어난다.",
    "positive": "현재 annual calendar의 전후 검출 결과를 각각 비교할 수 있다. 이 사례는 전환 전 申辰 반합, 전환 뒤 해당 pair 관계 미검출이다.",
    "risk": "major 상품 연도 row의 한계나 after 관계를 annual의 전후 ledger와 혼동하지 않는다.",
    "twist": "월주가 같더라도 달라진 대운 참가자만 새 정보로 설명할 수 있다.",
    "action": "2028-04-23 21:42 KST 전후 cycle과 해당 month_dayun_branch fact를 별도로 확인한다.",
    "scene": {
      "text": "가상으로 진행 중인 의뢰의 책임 범위를 전후 조건에 비춰 다시 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "오프라인 미래 policyDate는 실제 2026년 판매 허용이나 사건 발생을 의미하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "FUTURE_OFFLINE",
      "month": 4,
      "recordSha256": "2e555d859362736d3c3ca9f7d85149fb6b796566560f32b77599b324f3dfa33c"
    },
    "actualScope": {
      "selectedYear": 2028,
      "focus": {
        "start": "2028-04-04T15:03:06+09:00",
        "end": "2028-04-23T21:42:00+09:00",
        "pillar": {
          "stem": "丙",
          "branch": "辰"
        },
        "effectiveAnnual": {
          "stem": "戊",
          "branch": "申"
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
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "乙",
            "branch": "卯"
          },
          "effectiveAnnualPillar": {
            "stem": "戊",
            "branch": "申"
          },
          "activeDayunContext": {
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
          "startKst": "2028-04-01T00:00:00+09:00",
          "endKstExclusive": "2028-04-04T15:03:06+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "정관",
          "branchTenGod": "정관",
          "elements": [
            "wood"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2028:4:1:month:2028:4:branch:반합:卯亥",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "亥"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:1:month:2028:4:branch:육합:卯戌",
              "source": "month_natal_branch",
              "type": "육합",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "戌"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:1:month:2028:4:branch:해:卯辰",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "卯",
              "participants": [
                "卯",
                "辰"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2028:4:1:month",
            "month-v2:2028:4:1:annual",
            "month-v2:2028:4:1:dayun",
            "month-v2:2028:4:1:ten_gods",
            "month-v2:2028:4:1:elements",
            "month-v2:2028:4:1:month:2028:4:branch:반합:卯亥",
            "month-v2:2028:4:1:month:2028:4:branch:육합:卯戌",
            "month-v2:2028:4:1:month:2028:4:branch:해:卯辰"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "丙",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "戊",
            "branch": "申"
          },
          "activeDayunContext": {
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
          "startKst": "2028-04-04T15:03:06+09:00",
          "endKstExclusive": "2028-04-23T21:42:00+09:00",
          "boundaryReason": [
            "jie:청명"
          ],
          "stemTenGod": "편인",
          "branchTenGod": "비견",
          "elements": [
            "fire",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2028:4:2:month:2028:4:branch:반합:辰申",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "申"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month:2028:4:branch:충:辰戌",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "戌"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month:2028:4:branch:형:辰辰",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "辰"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month:2028:4:element:missing:fire",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month:2028:4:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth",
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month_annual_branch:戊申:반합:申辰",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "申",
                "辰"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "annual",
                "pillar": "戊申"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:2:month_dayun_branch:3:반합:申辰",
              "source": "month_dayun_branch",
              "type": "반합",
              "participants": [
                "申",
                "辰"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "壬申"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2028:4:2:month",
            "month-v2:2028:4:2:annual",
            "month-v2:2028:4:2:dayun",
            "month-v2:2028:4:2:ten_gods",
            "month-v2:2028:4:2:elements",
            "month-v2:2028:4:2:month:2028:4:branch:반합:辰申",
            "month-v2:2028:4:2:month:2028:4:branch:충:辰戌",
            "month-v2:2028:4:2:month:2028:4:branch:형:辰辰",
            "month-v2:2028:4:2:month:2028:4:element:missing:fire",
            "month-v2:2028:4:2:month:2028:4:element:heavy:earth",
            "month-v2:2028:4:2:month_annual_branch:戊申:반합:申辰",
            "month-v2:2028:4:2:month_dayun_branch:3:반합:申辰"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "丙",
            "branch": "辰"
          },
          "effectiveAnnualPillar": {
            "stem": "戊",
            "branch": "申"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 4,
                "ganji": "辛未"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2028-04-23T21:42:00+09:00",
          "endKstExclusive": "2028-05-01T00:00:00+09:00",
          "boundaryReason": [
            "dayun_transition"
          ],
          "stemTenGod": "편인",
          "branchTenGod": "비견",
          "elements": [
            "fire",
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2028:4:3:month:2028:4:branch:반합:辰申",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "申"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:3:month:2028:4:branch:충:辰戌",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "戌"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:3:month:2028:4:branch:형:辰辰",
              "source": "month_natal_branch",
              "type": "형",
              "monthBranch": "辰",
              "participants": [
                "辰",
                "辰"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:3:month:2028:4:element:missing:fire",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "fire",
              "monthElements": [
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:3:month:2028:4:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth",
                "fire"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2028:4:3:month_annual_branch:戊申:반합:申辰",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "申",
                "辰"
              ],
              "monthBranch": "辰",
              "counterpart": {
                "scope": "annual",
                "pillar": "戊申"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2028:4:3:month",
            "month-v2:2028:4:3:annual",
            "month-v2:2028:4:3:dayun",
            "month-v2:2028:4:3:ten_gods",
            "month-v2:2028:4:3:elements",
            "month-v2:2028:4:3:month:2028:4:branch:반합:辰申",
            "month-v2:2028:4:3:month:2028:4:branch:충:辰戌",
            "month-v2:2028:4:3:month:2028:4:branch:형:辰辰",
            "month-v2:2028:4:3:month:2028:4:element:missing:fire",
            "month-v2:2028:4:3:month:2028:4:element:heavy:earth",
            "month-v2:2028:4:3:month_annual_branch:戊申:반합:申辰"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:december-three-segments",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "12월에는 월초·대설 뒤·교운 뒤의 세 구간이 존재한다.",
    "positive": "같은 양력월 안에서 무엇이 먼저 바뀌고 무엇이 유지되는지 이해할 수 있다.",
    "risk": "모든 달을 두 segment로 고정하거나 12월을 운의 결말로 만들지 않는다.",
    "twist": "대설 뒤 월주는 이어져도 12월30일 교운 뒤 대운 관계는 달라진다.",
    "action": "각 [start,end)에서 월주·연주·cycle과 원래 ID를 나란히 확인한다.",
    "scene": {
      "text": "가상으로 연말에 진행 중인 과제를 새 배경에서도 계속할 조건을 검토한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "짧은 마지막 구간도 삭제하지 않으며 새 대운의 사건을 예언하지 않는다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "EXACT_DAYUN",
      "month": 12,
      "recordSha256": "eaeef299996055c6622dc818066f5c7fb0d052259e81153d83fa99c7b69b3eff"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
        "start": "2026-12-07T11:52:32+09:00",
        "end": "2026-12-30T15:30:00+09:00",
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
              "index": 2,
              "ganji": "壬辰"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "편재"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "己",
            "branch": "亥"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "壬辰"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-12-01T00:00:00+09:00",
          "endKstExclusive": "2026-12-07T11:52:32+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "상관",
          "branchTenGod": "편관",
          "elements": [
            "earth",
            "water"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:12:1:month:2026:12:branch:반합:亥未",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "亥",
              "participants": [
                "亥",
                "未"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:1:month:2026:12:branch:충:巳亥",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "亥",
              "participants": [
                "巳",
                "亥"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:1:month:2026:12:element:missing:water",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "water",
              "monthElements": [
                "water"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:1:month:2026:12:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:12:1:month",
            "month-v2:2026:12:1:annual",
            "month-v2:2026:12:1:dayun",
            "month-v2:2026:12:1:ten_gods",
            "month-v2:2026:12:1:elements",
            "month-v2:2026:12:1:month:2026:12:branch:반합:亥未",
            "month-v2:2026:12:1:month:2026:12:branch:충:巳亥",
            "month-v2:2026:12:1:month:2026:12:element:missing:water",
            "month-v2:2026:12:1:month:2026:12:element:heavy:earth"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "庚",
            "branch": "子"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 2,
                "ganji": "壬辰"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-12-07T11:52:32+09:00",
          "endKstExclusive": "2026-12-30T15:30:00+09:00",
          "boundaryReason": [
            "jie:대설"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "정관",
          "elements": [
            "metal",
            "water"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:12:2:month:2026:12:branch:반합:子辰",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "子",
              "participants": [
                "子",
                "辰"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month:2026:12:branch:충:子午",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "子",
              "participants": [
                "子",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month:2026:12:branch:해:子未",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "子",
              "participants": [
                "子",
                "未"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month:2026:12:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month:2026:12:element:missing:water",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "water",
              "monthElements": [
                "water"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
              "source": "month_annual_branch",
              "type": "충",
              "participants": [
                "子",
                "午"
              ],
              "monthBranch": "子",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:2:month_dayun_branch:2:반합:子辰",
              "source": "month_dayun_branch",
              "type": "반합",
              "participants": [
                "子",
                "辰"
              ],
              "monthBranch": "子",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 2,
                "pillar": "壬辰"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:12:2:month",
            "month-v2:2026:12:2:annual",
            "month-v2:2026:12:2:dayun",
            "month-v2:2026:12:2:ten_gods",
            "month-v2:2026:12:2:elements",
            "month-v2:2026:12:2:month:2026:12:branch:반합:子辰",
            "month-v2:2026:12:2:month:2026:12:branch:충:子午",
            "month-v2:2026:12:2:month:2026:12:branch:해:子未",
            "month-v2:2026:12:2:month:2026:12:element:missing:metal",
            "month-v2:2026:12:2:month:2026:12:element:missing:water",
            "month-v2:2026:12:2:month_annual_branch:丙午:충:子午",
            "month-v2:2026:12:2:month_dayun_branch:2:반합:子辰"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "庚",
            "branch": "子"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "辛卯"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-12-30T15:30:00+09:00",
          "endKstExclusive": "2027-01-01T00:00:00+09:00",
          "boundaryReason": [
            "dayun_transition"
          ],
          "stemTenGod": "편재",
          "branchTenGod": "정관",
          "elements": [
            "metal",
            "water"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:12:3:month:2026:12:branch:반합:子辰",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "子",
              "participants": [
                "子",
                "辰"
              ],
              "affectedPillars": [
                "day"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month:2026:12:branch:충:子午",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "子",
              "participants": [
                "子",
                "午"
              ],
              "affectedPillars": [
                "month"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month:2026:12:branch:해:子未",
              "source": "month_natal_branch",
              "type": "해",
              "monthBranch": "子",
              "participants": [
                "子",
                "未"
              ],
              "affectedPillars": [
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month:2026:12:element:missing:metal",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "metal",
              "monthElements": [
                "metal"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month:2026:12:element:missing:water",
              "source": "month_natal_element",
              "type": "missing_element_present",
              "element": "water",
              "monthElements": [
                "water"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month_annual_branch:丙午:충:子午",
              "source": "month_annual_branch",
              "type": "충",
              "participants": [
                "子",
                "午"
              ],
              "monthBranch": "子",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:12:3:month_dayun_branch:3:형:子卯",
              "source": "month_dayun_branch",
              "type": "형",
              "participants": [
                "子",
                "卯"
              ],
              "monthBranch": "子",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "辛卯"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:12:3:month",
            "month-v2:2026:12:3:annual",
            "month-v2:2026:12:3:dayun",
            "month-v2:2026:12:3:ten_gods",
            "month-v2:2026:12:3:elements",
            "month-v2:2026:12:3:month:2026:12:branch:반합:子辰",
            "month-v2:2026:12:3:month:2026:12:branch:충:子午",
            "month-v2:2026:12:3:month:2026:12:branch:해:子未",
            "month-v2:2026:12:3:month:2026:12:element:missing:metal",
            "month-v2:2026:12:3:month:2026:12:element:missing:water",
            "month-v2:2026:12:3:month_annual_branch:丙午:충:子午",
            "month-v2:2026:12:3:month_dayun_branch:3:형:子卯"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [
        {
          "position": "year",
          "natalStem": "辛",
          "annualStem": "丙",
          "type": "천간합",
          "sourceRefs": [
            "saju/constants:STEM_COMBINATIONS",
            "natal:year:stem",
            "annual:2026:stem"
          ]
        }
      ],
      "selectedTransit": null
    },
    "bindingImplemented": false
  },
  {
    "id": "afpr:case-study:no-branch-with-transit",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_observed_segment_application",
    "meaning": "focus의 지지 관계가 비어도 천을귀인 transit은 별도 출처로 존재한다.",
    "positive": "관계 부재와 도움 질문의 적용 조건을 서로 대체하지 않고 남긴다.",
    "risk": "귀인 관찰을 지지 합으로 표시하거나 도움·성과를 보장하지 않는다.",
    "twist": "근거 종류가 다르면 같은 달의 정보도 서로 다른 한계를 갖는다.",
    "action": "막힌 과제가 있다면 필요한 도움의 범위와 직접 시험할 대안을 정한다.",
    "scene": {
      "text": "가상으로 다른 풀이의 차이를 설명하고 이해되지 않는 부분을 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "actual 도움·상대 반응은 계산으로 확인되지 않았으므로 조건형 장면만 사용한다.",
    "requires": [
      "actual sourceObservation before binding",
      "owner/reference stem/target and time bounds",
      "only matching actual supported facts",
      "actual context or conditional scene"
    ],
    "disallowed": [
      "미입력 과거 경험 단정",
      "미래 사건 예언",
      "연구 ID의 Evidence 발급"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:interaction",
      "afpr:source:editorial"
    ],
    "verification": "actual_offline_observation_with_conditional_editorial_research",
    "sourceObservation": {
      "file": "docs/validation/v4-annual-fortune-product-knowledge-01/monthly-information-matrix.json",
      "caseId": "H_STUDENT",
      "month": 11,
      "recordSha256": "325d1cf0b9634e51499e26570767992987493018b3a74ae710827c1a776c96cd"
    },
    "actualScope": {
      "selectedYear": 2026,
      "focus": {
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
              "ganji": "乙酉"
            }
          ],
          "includesBeforeFirstCycle": false,
          "transitionRange": null
        },
        "god": "상관"
      },
      "allMonthSegments": [
        {
          "monthPillar": {
            "stem": "戊",
            "branch": "戌"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-11-01T00:00:00+09:00",
          "endKstExclusive": "2026-11-07T18:52:05+09:00",
          "boundaryReason": [
            "calendar_month_start"
          ],
          "stemTenGod": "식신",
          "branchTenGod": "식신",
          "elements": [
            "earth"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
              "source": "month_natal_branch",
              "type": "반합",
              "monthBranch": "戌",
              "participants": [
                "戌",
                "午"
              ],
              "affectedPillars": [
                "day",
                "hour"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:11:1:month:2026:11:branch:충:辰戌",
              "source": "month_natal_branch",
              "type": "충",
              "monthBranch": "戌",
              "participants": [
                "辰",
                "戌"
              ],
              "affectedPillars": [
                "year"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:11:1:month:2026:11:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
              "source": "month_annual_branch",
              "type": "반합",
              "participants": [
                "午",
                "戌"
              ],
              "monthBranch": "戌",
              "counterpart": {
                "scope": "annual",
                "pillar": "丙午"
              },
              "certainty": "confirmed"
            },
            {
              "id": "month-v2:2026:11:1:month_dayun_branch:3:해:酉戌",
              "source": "month_dayun_branch",
              "type": "해",
              "participants": [
                "酉",
                "戌"
              ],
              "monthBranch": "戌",
              "counterpart": {
                "scope": "dayun",
                "cycleIndex": 3,
                "pillar": "乙酉"
              },
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:11:1:month",
            "month-v2:2026:11:1:annual",
            "month-v2:2026:11:1:dayun",
            "month-v2:2026:11:1:ten_gods",
            "month-v2:2026:11:1:elements",
            "month-v2:2026:11:1:month:2026:11:branch:반합:戌午",
            "month-v2:2026:11:1:month:2026:11:branch:충:辰戌",
            "month-v2:2026:11:1:month:2026:11:element:heavy:earth",
            "month-v2:2026:11:1:month_annual_branch:丙午:반합:午戌",
            "month-v2:2026:11:1:month_dayun_branch:3:해:酉戌"
          ],
          "uncertainty": []
        },
        {
          "monthPillar": {
            "stem": "己",
            "branch": "亥"
          },
          "effectiveAnnualPillar": {
            "stem": "丙",
            "branch": "午"
          },
          "activeDayunContext": {
            "status": "active",
            "cycles": [
              {
                "index": 3,
                "ganji": "乙酉"
              }
            ],
            "includesBeforeFirstCycle": false,
            "transitionRange": null
          },
          "startKst": "2026-11-07T18:52:05+09:00",
          "endKstExclusive": "2026-12-01T00:00:00+09:00",
          "boundaryReason": [
            "jie:입동"
          ],
          "stemTenGod": "상관",
          "branchTenGod": "편관",
          "elements": [
            "earth",
            "water"
          ],
          "relationFacts": [
            {
              "id": "month-v2:2026:11:2:month:2026:11:element:heavy:earth",
              "source": "month_natal_element",
              "type": "heavy_element_present",
              "element": "earth",
              "monthElements": [
                "earth"
              ],
              "certainty": "confirmed"
            }
          ],
          "evidenceIds": [
            "month-v2:2026:11:2:month",
            "month-v2:2026:11:2:annual",
            "month-v2:2026:11:2:dayun",
            "month-v2:2026:11:2:ten_gods",
            "month-v2:2026:11:2:elements",
            "month-v2:2026:11:2:month:2026:11:element:heavy:earth"
          ],
          "uncertainty": []
        }
      ],
      "annualStemRelations": [],
      "selectedTransit": {
        "feature": "gwiin_cheoneul",
        "observations": [
          {
            "id": "annual-month:2026-11-07T18:52:05+09:00:CHEON_EUL_GWIIN:month.branch",
            "code": "CHEON_EUL_GWIIN",
            "label": "천을귀인",
            "kind": "noble",
            "basis": {
              "anchor": "natal.day.stem",
              "anchorValue": "丙",
              "target": "month.branch",
              "targetValue": "亥",
              "rule": "DAY_STEM_TO_BRANCH"
            },
            "sourceRefs": [
              "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
              "calendarMonths:11:2026-11-07T18:52:05+09:00",
              "natal.day.stem"
            ]
          }
        ],
        "sourceRefs": [
          "annual-month:2026-11-07T18:52:05+09:00:CHEON_EUL_GWIIN:month.branch",
          "src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:CHEON_EUL_GWIIN",
          "calendarMonths:11:2026-11-07T18:52:05+09:00",
          "natal.day.stem"
        ]
      }
    },
    "bindingImplemented": false
  }
];
