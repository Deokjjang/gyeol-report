import type { Material } from "./researchTypes";

/** Existing offline calculation observations, not new calculations or runtime bindings. */
export const MAJOR_OBSERVED_PERIOD_RESEARCH: readonly Material[] = [
  {
    "id": "mfpr:observed:a-2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "같은 편인 이름 아래 서로 다른 관계 조건",
    "meaning": "대운–세운 寅申 충과 申寅 형, 세운–원국 일지 申子 반합을 서로 다른 scope로 비교한다.",
    "positive": "기존 방식의 조정과 일부 연결 가능성을 함께 확인할 질문을 마련한다.",
    "risk": "충·형을 실패 확률로 합산하거나 반합이 긴장을 해소한다고 주장하지 않는다.",
    "twist": "연결될 부분이 있어도 기존 일정의 수정은 별도 과제일 수 있다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "01-business",
      "year": 2028,
      "recordSha256": "38a7cc15a4cdce1a1d9c0a3302c2ada37722ba8812982ef75462fa516b6aa8cf"
    },
    "observedFacts": {
      "cycle": {
        "index": 4,
        "ganji": "戊寅",
        "tenGod": "편인",
        "elements": [
          "토",
          "목"
        ],
        "startYear": 2023,
        "endYear": 2032,
        "theme": "남들이 지나친 단서를 자기 언어로 엮는 것"
      },
      "annual": {
        "year": 2028,
        "ganji": "戊申",
        "tenGod": "편인",
        "stemElement": "earth",
        "branchElement": "metal",
        "cycleRelations": [
          {
            "type": "충",
            "branches": [
              "寅",
              "申"
            ],
            "plain": "寅申 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다."
          },
          {
            "type": "형",
            "branches": [
              "申",
              "寅"
            ],
            "plain": "申寅 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다."
          }
        ],
        "natalRelations": [
          {
            "type": "반합",
            "branches": [
              "申",
              "子"
            ],
            "affectedPillars": [
              "day"
            ],
            "plain": "申子 반합 수 흐름은 일지에서 특정 기운을 부분적으로 키웁니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:4:戊寅:year:2028:戊申:cycle:충:寅申:cycle",
            "kind": "cycle-relation",
            "priority": 4,
            "text": "대운 지지와 寅·申 충: 기존 배치와 새 요구의 조정"
          },
          {
            "evidenceId": "major:4:戊寅:year:2028:戊申:cycle:형:申寅:cycle",
            "kind": "cycle-relation",
            "priority": 4,
            "text": "대운 지지와 申·寅 형: 되풀이되는 제약과 부담의 점검"
          },
          {
            "evidenceId": "major:4:戊寅:year:2028:戊申:natal:반합:申子:day",
            "kind": "natal-relation",
            "priority": 2,
            "text": "일지와 申·子 반합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:4:戊寅:year:2028:戊申:element:metal:missing",
            "kind": "element",
            "priority": 2,
            "text": "원국의 금 부족 조건에 금 기운이 들어옵니다. 보완 가능성을 보되 생활의 결과까지 보장하는 근거로 쓰지는 않습니다."
          },
          {
            "evidenceId": "major:4:戊寅:year:2028:戊申:ten-god",
            "kind": "ten-god",
            "priority": 1,
            "text": "편인이 대운과 세운에 겹쳐 장기 과제를 같은 관점에서 다시 다룹니다."
          }
        ],
        "evidenceIds": [
          "major:4:戊寅:year:2028:戊申",
          "major:4:戊寅:year:2028:戊申:ten-god",
          "major:4:戊寅:year:2028:戊申:cycle:충:寅申:cycle",
          "major:4:戊寅:year:2028:戊申:cycle:형:申寅:cycle",
          "major:4:戊寅:year:2028:戊申:natal:반합:申子:day",
          "major:4:戊寅:year:2028:戊申:element:metal:missing"
        ],
        "importance": "important",
        "focus": "새로운 관점과 선택적 탐색",
        "detail": {
          "coreFlow": "2028년 戊申 · 편인 · 토·금: 새로운 관점과 선택적 탐색. 대운과 같은 편인 관점이 겹칩니다. 집중해서 읽을 근거: 대운 지지와 寅·申 충: 기존 배치와 새 요구의 조정.",
          "realWorldScenes": "판단 근거와 실제 결과를 다루는 일이 있다면, 서로 다른 설명을 작은 사례로 비교하는 장면에 이 관점을 적용해 볼 수 있습니다.\n일에서는 낯선 방법을 검토할 때 기존 답과 무엇이 다른지 비교하고, 조사만 늘어나지 않도록 실제 적용할 작은 문제를 정합니다.\n돈에서는 정보를 더 모으는 일과 돈을 투입하는 결정을 분리하면 새로운 관점에 끌려 비용을 먼저 확정하는 일을 줄일 수 있습니다.\n관계에서는 혼자 해석한 상대의 의도와 직접 확인한 말을 구분해야 생각을 정리하는 시간이 오해로 길어지지 않습니다.",
          "cautionPoint": "일지와 申·子 반합: 연결되는 역할과 약속의 범위 확인. 충분히 이해해야 시작할 수 있다는 기준이 실행 시점을 계속 뒤로 옮길 수 있습니다. 원국의 금 부족 조건에 금 기운이 들어옵니다. 보완 가능성을 보되 생활의 결과까지 보장하는 근거로 쓰지는 않습니다.",
          "actionStandard": "판단 근거와 실제 결과를 실제로 맡는 경우에는 두 가설을 구분할 확인 질문을 만들고 실제 결과로 좁힙니다."
        }
      },
      "transition": null
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:a-2027",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "대운 관계 미검출과 원국의 여러 접점",
    "meaning": "대운–세운 관계는 없지만 연지 丑未 충/未丑 형, 월지 午未 육합 등 원국 관계는 남는다.",
    "positive": "타고난 여러 자리와 올해 조건이 다른 질문을 제공함을 구분한다.",
    "risk": "대운 관계가 없다는 이유로 전체가 관계 없는 해라고 요약하지 않는다.",
    "twist": "연결과 조정의 대상이 서로 다르면 둘을 상쇄할 필요가 없다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "01-business",
      "year": 2027,
      "recordSha256": "dee828add5e313789fae7be0c1788f98177e81b46e2645fc97eb27529d8caf2f"
    },
    "observedFacts": {
      "cycle": {
        "index": 4,
        "ganji": "戊寅",
        "tenGod": "편인",
        "elements": [
          "토",
          "목"
        ],
        "startYear": 2023,
        "endYear": 2032,
        "theme": "남들이 지나친 단서를 자기 언어로 엮는 것"
      },
      "annual": {
        "year": 2027,
        "ganji": "丁未",
        "tenGod": "정관",
        "stemElement": "fire",
        "branchElement": "earth",
        "cycleRelations": [],
        "natalRelations": [
          {
            "type": "반합",
            "branches": [
              "未",
              "卯"
            ],
            "affectedPillars": [
              "hour"
            ],
            "plain": "未卯 반합 목 흐름은 시지에서 특정 기운을 부분적으로 키웁니다."
          },
          {
            "type": "충",
            "branches": [
              "丑",
              "未"
            ],
            "affectedPillars": [
              "year"
            ],
            "plain": "丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다."
          },
          {
            "type": "형",
            "branches": [
              "未",
              "丑"
            ],
            "affectedPillars": [
              "year"
            ],
            "plain": "未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다."
          },
          {
            "type": "육합",
            "branches": [
              "午",
              "未"
            ],
            "affectedPillars": [
              "month"
            ],
            "plain": "午未 육합은 월지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다."
          },
          {
            "type": "해",
            "branches": [
              "子",
              "未"
            ],
            "affectedPillars": [
              "day"
            ],
            "plain": "子未 해는 일지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:4:戊寅:year:2027:丁未:natal:반합:未卯:hour",
            "kind": "natal-relation",
            "priority": 2,
            "text": "시지와 未·卯 반합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:4:戊寅:year:2027:丁未:natal:충:丑未:year",
            "kind": "natal-relation",
            "priority": 2,
            "text": "연지와 丑·未 충: 기존 배치와 새 요구의 조정"
          },
          {
            "evidenceId": "major:4:戊寅:year:2027:丁未:natal:형:未丑:year",
            "kind": "natal-relation",
            "priority": 2,
            "text": "연지와 未·丑 형: 되풀이되는 제약과 부담의 점검"
          },
          {
            "evidenceId": "major:4:戊寅:year:2027:丁未:natal:육합:午未:month",
            "kind": "natal-relation",
            "priority": 2,
            "text": "월지와 午·未 육합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:4:戊寅:year:2027:丁未:natal:해:子未:day",
            "kind": "natal-relation",
            "priority": 2,
            "text": "일지와 子·未 해: 겉으로 드러나지 않은 불편의 확인"
          }
        ],
        "evidenceIds": [
          "major:4:戊寅:year:2027:丁未",
          "major:4:戊寅:year:2027:丁未:ten-god",
          "major:4:戊寅:year:2027:丁未:natal:반합:未卯:hour",
          "major:4:戊寅:year:2027:丁未:natal:충:丑未:year",
          "major:4:戊寅:year:2027:丁未:natal:형:未丑:year",
          "major:4:戊寅:year:2027:丁未:natal:육합:午未:month",
          "major:4:戊寅:year:2027:丁未:natal:해:子未:day"
        ],
        "importance": "standard",
        "focus": "공식적인 역할과 신뢰의 기준",
        "detail": {
          "coreFlow": "2027년 丁未 · 정관 · 화·토: 공식적인 역할과 신뢰의 기준. 편인 대운의 장기 배경에 정관의 연간 질문이 더해집니다.",
          "realWorldScenes": "평가받을 기준과 맡을 역할을 명확히 하면 책임을 쌓을 수 있지만, 타인의 기대를 모두 내 업무로 받아들이지는 않습니다.",
          "cautionPoint": "연지와 丑·未 충: 기존 배치와 새 요구의 조정.",
          "actionStandard": "평가 항목·업무 경계·합의 내용을 같은 문서에 남깁니다."
        }
      },
      "transition": null
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:b-2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "두 relation 배열이 모두 빈 연도",
    "meaning": "己卯 정재 배경과 戊申 편재 연주 사실은 있으나 cycle/natal branch relation 검출은 없다.",
    "positive": "운영의 지속과 외부 선택을 비교하는 일반 십성 질문으로 한정한다.",
    "risk": "관계가 없으므로 평온·수익 확보·위험 없음이라고 말하지 않는다.",
    "twist": "추가 사건을 창작하지 않고 유지/비교 기능으로 분류할 수 있다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "02-employee",
      "year": 2028,
      "recordSha256": "d5e65b45e9f7392096c624627e6304f995eb035ad5850de1ccd211ba1b712250"
    },
    "observedFacts": {
      "cycle": {
        "index": 4,
        "ganji": "己卯",
        "tenGod": "정재",
        "elements": [
          "토",
          "목"
        ],
        "startYear": 2024,
        "endYear": 2033,
        "theme": "돈과 생활을 반복 가능한 구조로 굳히는 것"
      },
      "annual": {
        "year": 2028,
        "ganji": "戊申",
        "tenGod": "편재",
        "stemElement": "earth",
        "branchElement": "metal",
        "cycleRelations": [],
        "natalRelations": [],
        "reasons": [],
        "evidenceIds": [
          "major:4:己卯:year:2028:戊申",
          "major:4:己卯:year:2028:戊申:ten-god"
        ],
        "importance": "quiet",
        "focus": "외부 기회와 거래의 범위",
        "detail": {
          "coreFlow": "2028년 戊申 · 편재 · 토·금: 외부 기회와 거래의 범위. 정재 대운의 장기 배경에 편재의 연간 질문이 더해집니다.",
          "realWorldScenes": "일의 접점이 밖으로 넓어지는 선택에서는 제안을 많이 받는 것보다 끝까지 맡을 수 있는 업무를 고르는 기준이 중요합니다.",
          "cautionPoint": "선택지가 늘었다는 이유로 수익이나 상대의 신뢰가 이미 확보됐다고 보지 않습니다.",
          "actionStandard": "기회마다 비용·회수일·책임 한도를 먼저 적고 비교합니다."
        }
      },
      "transition": null
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:b-2034",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "교운 이후의 편재와 원국 설명 분리",
    "meaning": "2034-01-14 17:30 KST 전후 己卯 정재에서 戊寅 편재로 바뀐다. 甲寅 비견은 그 해 연주 십성이다.",
    "positive": "세 층위의 십성 이름이 다를 수 있음을 명확히 보여준다.",
    "risk": "원국 정재나 이전 정재를 다음 대운 편재 특징으로 바꾸지 않는다.",
    "twist": "같은 자원 관리 능력이 외부 선택을 다루는 조건에도 쓰일 수 있다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "02-employee",
      "year": 2034,
      "recordSha256": "ef842fc6f6fc0c53be501515f032a53460f3ff9f21add42566c6107fed533251"
    },
    "observedFacts": {
      "cycle": {
        "index": 5,
        "ganji": "戊寅",
        "tenGod": "편재",
        "elements": [
          "토",
          "목"
        ],
        "startYear": 2034,
        "endYear": 2043,
        "theme": "밖의 기회와 자원을 연결하는 것"
      },
      "annual": {
        "year": 2034,
        "ganji": "甲寅",
        "tenGod": "비견",
        "stemElement": "wood",
        "branchElement": "wood",
        "cycleRelations": [],
        "natalRelations": [
          {
            "type": "반합",
            "branches": [
              "寅",
              "午"
            ],
            "affectedPillars": [
              "year"
            ],
            "plain": "寅午 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다."
          },
          {
            "type": "충",
            "branches": [
              "寅",
              "申"
            ],
            "affectedPillars": [
              "day"
            ],
            "plain": "寅申 충은 일지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다."
          },
          {
            "type": "형",
            "branches": [
              "申",
              "寅"
            ],
            "affectedPillars": [
              "day"
            ],
            "plain": "申寅 형은 일지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:5:戊寅:year:2034:甲寅:boundary",
            "kind": "transition",
            "priority": 4,
            "text": "대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다."
          },
          {
            "evidenceId": "major:5:戊寅:year:2034:甲寅:natal:반합:寅午:year",
            "kind": "natal-relation",
            "priority": 2,
            "text": "연지와 寅·午 반합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:5:戊寅:year:2034:甲寅:natal:충:寅申:day",
            "kind": "natal-relation",
            "priority": 3,
            "text": "일지와 寅·申 충: 기존 배치와 새 요구의 조정"
          },
          {
            "evidenceId": "major:5:戊寅:year:2034:甲寅:natal:형:申寅:day",
            "kind": "natal-relation",
            "priority": 3,
            "text": "일지와 申·寅 형: 되풀이되는 제약과 부담의 점검"
          }
        ],
        "evidenceIds": [
          "major:5:戊寅:year:2034:甲寅",
          "major:5:戊寅:year:2034:甲寅:ten-god",
          "major:5:戊寅:year:2034:甲寅:boundary",
          "major:5:戊寅:year:2034:甲寅:natal:반합:寅午:year",
          "major:5:戊寅:year:2034:甲寅:natal:충:寅申:day",
          "major:5:戊寅:year:2034:甲寅:natal:형:申寅:day"
        ],
        "importance": "important",
        "focus": "독립적인 판단과 동료 사이의 경계",
        "detail": {
          "coreFlow": "2034년 甲寅 · 비견 · 목·목: 독립적인 판단과 동료 사이의 경계. 편재 대운의 장기 배경에 비견의 연간 질문이 더해집니다. 집중해서 읽을 근거: 대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다.",
          "realWorldScenes": "영업·개발·지원 사이의 인수인계를 다루는 일이 있다면, 각자의 판단과 공동 기준이 어디서 다른지 비교하는 장면에 이 관점을 적용해 볼 수 있습니다.\n일에서는 자기 방식으로 끝낼 일과 동료의 검토가 필요한 일을 나누면 독립성이 고립으로 바뀌는 것을 막을 수 있습니다.\n돈에서는 내가 통제할 예산과 공동 지출을 구분하는 것이 우선이며, 남과 비슷한 수준을 맞추기 위한 소비는 따로 점검합니다.\n관계에서는 대등함을 원하는 장면에서는 부탁을 수락할 권리만큼 거절할 권리도 서로 인정해야 합니다.",
          "cautionPoint": "일지와 寅·申 충: 기존 배치와 새 요구의 조정. 내 기준이 분명해지는 만큼 다른 방식도 가능한 문제에서 경쟁을 만들지 않는지 살펴봅니다.",
          "actionStandard": "영업·개발·지원 사이의 인수인계를 실제로 맡는 경우에는 각자 결정할 항목과 공동 검토할 항목을 나눕니다."
        }
      },
      "transition": {
        "year": 2034,
        "dateLabel": "2034-01-14 17:30 한국시간",
        "startSolarKst": "2034-01-14T17:30:00+09:00",
        "startSolarRange": {
          "earliestKst": "2034-01-14T17:30:00+09:00",
          "latestKst": "2034-01-14T17:30:00+09:00"
        },
        "before": {
          "index": 4,
          "ganji": "己卯",
          "tenGod": "정재",
          "elements": [
            "토",
            "목"
          ],
          "startYear": 2024,
          "endYear": 2033,
          "theme": "돈과 생활을 반복 가능한 구조로 굳히는 것"
        },
        "after": {
          "index": 5,
          "ganji": "戊寅",
          "tenGod": "편재",
          "elements": [
            "토",
            "목"
          ],
          "startYear": 2034,
          "endYear": 2043,
          "theme": "밖의 기회와 자원을 연결하는 것"
        }
      }
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:c-2028",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "하나의 연도 안에서 달라지는 대운 배경",
    "meaning": "2028-04-23 21:42 KST 이전 壬申 편재, 정각 이후 辛未 상관이며 戊申 비견은 연주다.",
    "positive": "방법을 바꾸는 장기 질문과 개인의 평소 반응을 구분할 수 있다.",
    "risk": "연도 row의 after 관계를 이전 壬申 구간에 소급하거나 원국 편관을 새 대운 십성으로 표시하지 않는다.",
    "twist": "전환 이후 질문을 준비하는 행위와 이미 활성됐다는 사실은 다르다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "03-freelance",
      "year": 2028,
      "recordSha256": "615fb20d55482a69ec798dd3982a4a6615396cb2f67a5b6b84c8130a9e4cf8b9"
    },
    "observedFacts": {
      "cycle": {
        "index": 4,
        "ganji": "辛未",
        "tenGod": "상관",
        "elements": [
          "금",
          "토"
        ],
        "startYear": 2028,
        "endYear": 2037,
        "theme": "익숙한 답을 바꾸고 내 목소리를 내는 것"
      },
      "annual": {
        "year": 2028,
        "ganji": "戊申",
        "tenGod": "비견",
        "stemElement": "earth",
        "branchElement": "metal",
        "cycleRelations": [],
        "natalRelations": [
          {
            "type": "반합",
            "branches": [
              "申",
              "辰"
            ],
            "affectedPillars": [
              "day",
              "hour"
            ],
            "plain": "申辰 반합 수 흐름은 일지, 시지에서 특정 기운을 부분적으로 키웁니다."
          },
          {
            "type": "해",
            "branches": [
              "申",
              "亥"
            ],
            "affectedPillars": [
              "month"
            ],
            "plain": "申亥 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:4:辛未:year:2028:戊申:boundary",
            "kind": "transition",
            "priority": 4,
            "text": "대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다."
          },
          {
            "evidenceId": "major:4:辛未:year:2028:戊申:natal:반합:申辰:day-hour",
            "kind": "natal-relation",
            "priority": 2,
            "text": "일지·시지와 申·辰 반합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:4:辛未:year:2028:戊申:natal:해:申亥:month",
            "kind": "natal-relation",
            "priority": 2,
            "text": "월지와 申·亥 해: 겉으로 드러나지 않은 불편의 확인"
          },
          {
            "evidenceId": "major:4:辛未:year:2028:戊申:element:earth:heavy",
            "kind": "element",
            "priority": 2,
            "text": "원국에서 강한 토 기운과 세운의 토 기운이 겹쳐, 이미 많이 쓰는 방식을 더 밀기보다 과부하를 점검합니다."
          }
        ],
        "evidenceIds": [
          "major:4:辛未:year:2028:戊申",
          "major:4:辛未:year:2028:戊申:ten-god",
          "major:4:辛未:year:2028:戊申:boundary",
          "major:4:辛未:year:2028:戊申:natal:반합:申辰:day-hour",
          "major:4:辛未:year:2028:戊申:natal:해:申亥:month",
          "major:4:辛未:year:2028:戊申:element:earth:heavy"
        ],
        "importance": "important",
        "focus": "독립적인 판단과 동료 사이의 경계",
        "detail": {
          "coreFlow": "2028년 戊申 · 비견 · 토·금: 독립적인 판단과 동료 사이의 경계. 상관 대운의 장기 배경에 비견의 연간 질문이 더해집니다. 집중해서 읽을 근거: 대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다.",
          "realWorldScenes": "기획·제작·검토 담당자의 작업 경계를 다루는 일이 있다면, 각자의 판단과 공동 기준이 어디서 다른지 비교하는 장면에 이 관점을 적용해 볼 수 있습니다.\n일에서는 자기 방식으로 끝낼 일과 동료의 검토가 필요한 일을 나누면 독립성이 고립으로 바뀌는 것을 막을 수 있습니다.\n돈에서는 내가 통제할 예산과 공동 지출을 구분하는 것이 우선이며, 남과 비슷한 수준을 맞추기 위한 소비는 따로 점검합니다.\n관계에서는 대등함을 원하는 장면에서는 부탁을 수락할 권리만큼 거절할 권리도 서로 인정해야 합니다.",
          "cautionPoint": "일지·시지와 申·辰 반합: 연결되는 역할과 약속의 범위 확인. 내 기준이 분명해지는 만큼 다른 방식도 가능한 문제에서 경쟁을 만들지 않는지 살펴봅니다. 원국에서 강한 토 기운과 세운의 토 기운이 겹쳐, 이미 많이 쓰는 방식을 더 밀기보다 과부하를 점검합니다.",
          "actionStandard": "기획·제작·검토 담당자의 작업 경계를 실제로 맡는 경우에는 각자 결정할 항목과 공동 검토할 항목을 나눕니다."
        }
      },
      "transition": {
        "year": 2028,
        "dateLabel": "2028-04-23 21:42 한국시간",
        "startSolarKst": "2028-04-23T21:42:00+09:00",
        "startSolarRange": {
          "earliestKst": "2028-04-23T21:42:00+09:00",
          "latestKst": "2028-04-23T21:42:00+09:00"
        },
        "before": {
          "index": 3,
          "ganji": "壬申",
          "tenGod": "편재",
          "elements": [
            "수",
            "금"
          ],
          "startYear": 2018,
          "endYear": 2027,
          "theme": "밖의 기회와 자원을 연결하는 것"
        },
        "after": {
          "index": 4,
          "ganji": "辛未",
          "tenGod": "상관",
          "elements": [
            "금",
            "토"
          ],
          "startYear": 2028,
          "endYear": 2037,
          "theme": "익숙한 답을 바꾸고 내 목소리를 내는 것"
        }
      }
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:c-2033",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "다른 scope의 충·형과 원국 조정",
    "meaning": "辛未 대운과 癸丑 세운의 丑未 충/未丑 형, 원국 연지 丑戌 형/시지 丑辰 파를 분리한다.",
    "positive": "반복 부담과 세부 수정의 대상이 다름을 확인한다.",
    "risk": "서로 다른 관계 이름을 같은 사람·사건으로 합치거나 재난으로 해석하지 않는다.",
    "twist": "조정할 대상이 구체적일수록 생활의 선택 범위를 좁힐 수 있다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "03-freelance",
      "year": 2033,
      "recordSha256": "e936dfe1c38c49e6d32fd0634b02ddd49b93d00b8e8d16c1d88f7ff897257c78"
    },
    "observedFacts": {
      "cycle": {
        "index": 4,
        "ganji": "辛未",
        "tenGod": "상관",
        "elements": [
          "금",
          "토"
        ],
        "startYear": 2028,
        "endYear": 2037,
        "theme": "익숙한 답을 바꾸고 내 목소리를 내는 것"
      },
      "annual": {
        "year": 2033,
        "ganji": "癸丑",
        "tenGod": "정재",
        "stemElement": "water",
        "branchElement": "earth",
        "cycleRelations": [
          {
            "type": "충",
            "branches": [
              "丑",
              "未"
            ],
            "plain": "丑未 충은 연지의 익숙한 리듬을 흔들어 바꾸거나 정리하게 만드는 신호입니다."
          },
          {
            "type": "형",
            "branches": [
              "未",
              "丑"
            ],
            "plain": "未丑 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다."
          }
        ],
        "natalRelations": [
          {
            "type": "형",
            "branches": [
              "丑",
              "戌"
            ],
            "affectedPillars": [
              "year"
            ],
            "plain": "丑戌 형은 연지에서 누적 부담이나 스스로 몰아붙이는 흐름이 커질 수 있음을 봅니다."
          },
          {
            "type": "파",
            "branches": [
              "丑",
              "辰"
            ],
            "affectedPillars": [
              "hour"
            ],
            "plain": "丑辰 파는 시지에서 기존 방식이 깨지거나 다시 조정되는 장면을 만들 수 있습니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:4:辛未:year:2033:癸丑:cycle:충:丑未:cycle",
            "kind": "cycle-relation",
            "priority": 4,
            "text": "대운 지지와 丑·未 충: 기존 배치와 새 요구의 조정"
          },
          {
            "evidenceId": "major:4:辛未:year:2033:癸丑:cycle:형:未丑:cycle",
            "kind": "cycle-relation",
            "priority": 4,
            "text": "대운 지지와 未·丑 형: 되풀이되는 제약과 부담의 점검"
          },
          {
            "evidenceId": "major:4:辛未:year:2033:癸丑:natal:형:丑戌:year",
            "kind": "natal-relation",
            "priority": 2,
            "text": "연지와 丑·戌 형: 되풀이되는 제약과 부담의 점검"
          },
          {
            "evidenceId": "major:4:辛未:year:2033:癸丑:natal:파:丑辰:hour",
            "kind": "natal-relation",
            "priority": 2,
            "text": "시지와 丑·辰 파: 유지하던 방식의 세부 수정"
          },
          {
            "evidenceId": "major:4:辛未:year:2033:癸丑:element:earth:heavy",
            "kind": "element",
            "priority": 2,
            "text": "원국에서 강한 토 기운과 세운의 토 기운이 겹쳐, 이미 많이 쓰는 방식을 더 밀기보다 과부하를 점검합니다."
          }
        ],
        "evidenceIds": [
          "major:4:辛未:year:2033:癸丑",
          "major:4:辛未:year:2033:癸丑:ten-god",
          "major:4:辛未:year:2033:癸丑:cycle:충:丑未:cycle",
          "major:4:辛未:year:2033:癸丑:cycle:형:未丑:cycle",
          "major:4:辛未:year:2033:癸丑:natal:형:丑戌:year",
          "major:4:辛未:year:2033:癸丑:natal:파:丑辰:hour",
          "major:4:辛未:year:2033:癸丑:element:earth:heavy"
        ],
        "importance": "important",
        "focus": "지속 가능한 수입과 생활 운영",
        "detail": {
          "coreFlow": "2033년 癸丑 · 정재 · 수·토: 지속 가능한 수입과 생활 운영. 상관 대운의 장기 배경에 정재의 연간 질문이 더해집니다. 집중해서 읽을 근거: 대운 지지와 丑·未 충: 기존 배치와 새 요구의 조정.",
          "realWorldScenes": "제작 시간·수정 범위·견적을 다루는 일이 있다면, 반복해서 유지할 조건을 실제 기록과 맞추는 장면에 이 관점을 적용해 볼 수 있습니다.\n일에서는 반복 업무의 양과 보상이 맞는지 살피고, 꾸준히 수행할 수 있는 범위에서 신뢰를 쌓는 방식에 초점을 둡니다.\n돈에서는 정기 수입과 고정 지출을 같은 기간으로 맞춰 보면 모호했던 부담이 드러나며 작은 비용도 누적으로 판단할 수 있습니다.\n관계에서는 생활의 약속을 안정적으로 지키는 장점과 상대의 변화를 허용할 여유를 함께 남겨 둡니다.",
          "cautionPoint": "연지와 丑·戌 형: 되풀이되는 제약과 부담의 점검. 안정적인 방식을 지키느라 필요한 변경까지 미루면 관리가 통제로 느껴질 수 있습니다. 원국에서 강한 토 기운과 세운의 토 기운이 겹쳐, 이미 많이 쓰는 방식을 더 밀기보다 과부하를 점검합니다.",
          "actionStandard": "제작 시간·수정 범위·견적을 실제로 맡는 경우에는 계획한 양과 실제 사용량을 같은 기간으로 비교합니다."
        }
      },
      "transition": null
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:c-2026",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "A 2028과 같은 편인 세운의 다른 배경",
    "meaning": "壬申 편재 대운에서 丙午 편인 세운을 읽는다. A의 戊寅 편인 대운과 다른 참가 조건이다.",
    "positive": "같은 십성 설명보다 실제 다른 배경과 관계를 비교한다.",
    "risk": "같은 편인이라는 이유로 같은 해석·직업 장면·독립 근거라고 보지 않는다.",
    "twist": "새 근거가 없으면 동일 정의를 반복하지 않고 다른 적용 조건만 남긴다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "03-freelance",
      "year": 2026,
      "recordSha256": "ebc4b92d3ccaae7137e6eb052927dd97f9f11999576a42812b1a004feee90a14"
    },
    "observedFacts": {
      "cycle": {
        "index": 3,
        "ganji": "壬申",
        "tenGod": "편재",
        "elements": [
          "수",
          "금"
        ],
        "startYear": 2018,
        "endYear": 2027,
        "theme": "밖의 기회와 자원을 연결하는 것"
      },
      "annual": {
        "year": 2026,
        "ganji": "丙午",
        "tenGod": "편인",
        "stemElement": "fire",
        "branchElement": "fire",
        "cycleRelations": [],
        "natalRelations": [
          {
            "type": "반합",
            "branches": [
              "午",
              "戌"
            ],
            "affectedPillars": [
              "year"
            ],
            "plain": "午戌 반합 화 흐름은 연지에서 특정 기운을 부분적으로 키웁니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:3:壬申:year:2026:丙午:natal:반합:午戌:year",
            "kind": "natal-relation",
            "priority": 2,
            "text": "연지와 午·戌 반합: 연결되는 역할과 약속의 범위 확인"
          },
          {
            "evidenceId": "major:3:壬申:year:2026:丙午:element:fire:missing",
            "kind": "element",
            "priority": 2,
            "text": "원국의 화 부족 조건에 화 기운이 들어옵니다. 보완 가능성을 보되 생활의 결과까지 보장하는 근거로 쓰지는 않습니다."
          }
        ],
        "evidenceIds": [
          "major:3:壬申:year:2026:丙午",
          "major:3:壬申:year:2026:丙午:ten-god",
          "major:3:壬申:year:2026:丙午:natal:반합:午戌:year",
          "major:3:壬申:year:2026:丙午:element:fire:missing"
        ],
        "importance": "standard",
        "focus": "새로운 관점과 선택적 탐색",
        "detail": {
          "coreFlow": "2026년 丙午 · 편인 · 화·화: 새로운 관점과 선택적 탐색. 편재 대운의 장기 배경에 편인의 연간 질문이 더해집니다.",
          "realWorldScenes": "낯선 방법을 검토할 때 기존 답과 무엇이 다른지 비교하고, 조사만 늘어나지 않도록 실제 적용할 작은 문제를 정합니다.",
          "cautionPoint": "연지와 午·戌 반합: 연결되는 역할과 약속의 범위 확인.",
          "actionStandard": "탐색을 끝낼 질문과 첫 적용 날짜를 한 쌍으로 정합니다."
        }
      },
      "transition": null
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  },
  {
    "id": "mfpr:observed:d-2033",
    "productKey": "major_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "observed_offline_period",
    "question": "시각 범위를 유지하는 다음 대운",
    "meaning": "첫 시각은 null이며 2033-06-14 02:00~2033-10-15 23:59:59 KST가 교운 가능 범위다.",
    "positive": "확정 전후와 불확실 내부를 나누어 해석의 한계를 알린다.",
    "risk": "범위 중앙을 실제 교운 시각으로 만들거나 미상 시주를 보충하지 않는다.",
    "twist": "불확실 구간 밖의 확인된 기간 사실은 여전히 사용할 수 있다.",
    "sourceRefs": [
      "mfpr:source:decade",
      "mfpr:source:interaction",
      "mfpr:source:editorial"
    ],
    "verification": "observed_calculation_with_conditional_editorial_application",
    "sourceObservation": {
      "file": "docs/validation/v4-major-fortune-product-knowledge-01/baseline-generation.json",
      "caseId": "04-time-unknown",
      "year": 2033,
      "recordSha256": "f569fa4efa34fc8e8471f14ed77da337bb0604296191c31359094ebcd407d6ca"
    },
    "observedFacts": {
      "cycle": {
        "index": 5,
        "ganji": "丁丑",
        "tenGod": "정관",
        "elements": [
          "화",
          "토"
        ],
        "startYear": 2033,
        "endYear": 2042,
        "theme": "신뢰를 자리와 역할로 바꾸는 것"
      },
      "annual": {
        "year": 2033,
        "ganji": "癸丑",
        "tenGod": "상관",
        "stemElement": "water",
        "branchElement": "earth",
        "cycleRelations": [],
        "natalRelations": [
          {
            "type": "해",
            "branches": [
              "丑",
              "午"
            ],
            "affectedPillars": [
              "month"
            ],
            "plain": "丑午 해는 월지에서 작은 어긋남이나 미묘한 피로가 누적되기 쉬운 신호입니다."
          },
          {
            "type": "육합",
            "branches": [
              "子",
              "丑"
            ],
            "affectedPillars": [
              "day"
            ],
            "plain": "子丑 육합은 일지에 묶이는 리듬을 만들어, 해당 영역에서 실제 움직임이나 약속이 생기기 쉽습니다."
          }
        ],
        "reasons": [
          {
            "evidenceId": "major:5:丁丑:year:2033:癸丑:boundary",
            "kind": "transition",
            "priority": 4,
            "text": "대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다."
          },
          {
            "evidenceId": "major:5:丁丑:year:2033:癸丑:natal:해:丑午:month",
            "kind": "natal-relation",
            "priority": 2,
            "text": "월지와 丑·午 해: 겉으로 드러나지 않은 불편의 확인"
          },
          {
            "evidenceId": "major:5:丁丑:year:2033:癸丑:natal:육합:子丑:day",
            "kind": "natal-relation",
            "priority": 2,
            "text": "일지와 子·丑 육합: 연결되는 역할과 약속의 범위 확인"
          }
        ],
        "evidenceIds": [
          "major:5:丁丑:year:2033:癸丑",
          "major:5:丁丑:year:2033:癸丑:ten-god",
          "major:5:丁丑:year:2033:癸丑:boundary",
          "major:5:丁丑:year:2033:癸丑:natal:해:丑午:month",
          "major:5:丁丑:year:2033:癸丑:natal:육합:子丑:day"
        ],
        "importance": "important",
        "focus": "기존 방식에 대한 표현과 개선",
        "detail": {
          "coreFlow": "2033년 癸丑 · 상관 · 수·토: 기존 방식에 대한 표현과 개선. 정관 대운의 장기 배경에 상관의 연간 질문이 더해집니다. 집중해서 읽을 근거: 대운이 바뀌는 첫 연도로, 교운 전후를 구분해 읽어야 합니다.",
          "realWorldScenes": "함께 맡을 일과 각자의 책임을 다루는 일이 있다면, 기존 방식의 불편을 대안으로 바꾸어 제안하는 장면에 이 관점을 적용해 볼 수 있습니다.\n일에서는 불편한 절차를 발견했을 때 비판으로 끝내기보다 바꿀 대안과 시험 범위를 제시하면 표현이 업무 개선으로 이어집니다.\n돈에서는 새 방식의 기대 이익과 전환 비용을 따로 계산해야 흥미로운 제안이 생활비를 압박하지 않습니다.\n관계에서는 정확한 지적도 상대에게 평가처럼 들릴 수 있어, 바꾸고 싶은 행동과 사람에 대한 판단을 구분합니다.",
          "cautionPoint": "월지와 丑·午 해: 겉으로 드러나지 않은 불편의 확인. 맞는 말이라는 확신이 전달 시점과 상대의 수용 여지를 대신해 주지는 않습니다.",
          "actionStandard": "함께 맡을 일과 각자의 책임을 실제로 맡는 경우에는 바꿀 한 항목의 전후 차이를 보여 주고 시험 범위를 합의합니다."
        }
      },
      "transition": {
        "year": 2033,
        "dateLabel": "2033-06-14 02:00~2033-10-15 23:59 한국시간",
        "startSolarKst": null,
        "startSolarRange": {
          "earliestKst": "2033-06-14T02:00:00+09:00",
          "latestKst": "2033-10-15T23:59:59+09:00"
        },
        "before": {
          "index": 4,
          "ganji": "戊寅",
          "tenGod": "편인",
          "elements": [
            "토",
            "목"
          ],
          "startYear": 2023,
          "endYear": 2032,
          "theme": "남들이 지나친 단서를 자기 언어로 엮는 것"
        },
        "after": {
          "index": 5,
          "ganji": "丁丑",
          "tenGod": "정관",
          "elements": [
            "화",
            "토"
          ],
          "startYear": 2033,
          "endYear": 2042,
          "theme": "신뢰를 자리와 역할로 바꾸는 것"
        }
      }
    },
    "factRootPolicy": "observed original IDs retained here as audit references only, never minted or bound as new research runtimeEvidenceIds",
    "unsupported": "composite verdict, pre-transition detailed interactions and actual events are not inferred"
  }
];
