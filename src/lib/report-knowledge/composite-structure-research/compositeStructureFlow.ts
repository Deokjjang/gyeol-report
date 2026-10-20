import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_FLOW = [
  {
    "id": "csr:profile:siksang_saengjae",
    "targetId": "foundation:structure:siksang_saengjae",
    "key": "siksang_saengjae",
    "label": "식상생재",
    "hanja": "食傷生財",
    "aliases": [
      "식상생재"
    ],
    "family": "flow",
    "participants": {
      "tenGods": [
        "食神",
        "傷官",
        "偏財",
        "正財"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간이 생하는 식상에서 일간이 극하는 재성으로 이어지는 오행 상생 관계이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "siksang_saengjae"
        }
      ]
    },
    "researchDefinition": "일간이 생하는 식상이 다시 재성을 생하는 연속 관계. 식신과 상관의 역할 차이, 재성의 수용 조건을 남겨 둔다.",
    "formation": {
      "strength": "일간이 설기와 재성 작용을 감당할지 확인. 약한 일간에 같은 흐름을 무조건 이익으로 읽지 않음.",
      "position": "V4는 같은·인접 기둥의 의미 있는 식상→재성 쌍을 확인.",
      "monthCommand": "식상의 득령과 재성의 계절 기반을 구분하며 월령 격국의 주객은 별도 검토.",
      "visibleStems": "최소 한쪽 투간 및 양 군의 기반이 필요. 두 이름의 단순 공존은 부족.",
      "roots": "식상·재성 각각의 뿌리와 일간 여력 필요.",
      "hiddenStems": "본기 두 곳 또는 투간+장간의 지원이라는 V4 조건은 전통 격국의 동의어가 아님.",
      "generationControl": "일간→식상→재성의 상생이며 인성이 식상을 제어하면 경로가 달라짐.",
      "additional": "산출물이 교환될 실제 상대·수요·계약은 명리 밖의 확인 사항."
    },
    "counterconditions": [
      "공존만 있고 연결 없음",
      "강한 인성의 식상 제어",
      "일간 여력 부족 또는 재성 훼손"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "식신생재와 상관생재를 성립 예로 다루면서 재성의 합과 살의 개입 등으로 달라지는 조건도 함께 제시한다.",
        "sourceRefs": [
          {
            "sourceId": "zp9",
            "locator": "論用神成敗救應: 食神生財 / 傷官生財"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "표현·산출과 자원 회수의 사이에 전달 경로가 있다는 조건이다. 식상 하나의 재능 설명에 수요와 전달의 질문이 추가된다.",
      "positive": "산출과 이용자의 필요가 실제로 만나면 만든 것을 교환 가능한 형태로 다듬는 질문이 된다.",
      "risk": "연결이 있어도 공급 비용·회수 속도가 맞지 않으면 제작량이 보상으로 남지 않을 수 있다.",
      "strengthToRisk": "쓸모를 확인하는 장점이 모든 취미와 배려를 거래로 바꾸는 과용이 될 수 있다.",
      "weaknessToResource": "완성도 경쟁보다 작은 결과의 쓰임을 확인하는 방식이 발전의 단서가 될 수 있다.",
      "tension": "재생관은 재성 이후 책임 체계로 가고 식상생재는 산출에서 교환 대상으로 가는 단계다.",
      "limits": "재능·매출·투자 성과가 이미 검증되었다고 말하지 않는다. 실제 영업·활동 입력이 필요하다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:jaesaenggwan",
        "difference": "식상생재는 산출→자원, 재생관은 자원→정관으로 출발점과 목적지가 다르다. 한 경로가 다른 경로를 보증하지 않는다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "outputCreatesWealth"
      ],
      "legacyPatternCodes": [],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "산출물이 교환될 실제 상대·수요·계약은 명리 밖의 확인 사항.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp9",
        "locator": "論用神成敗救應: 食神生財 / 傷官生財"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:jaesaenggwan",
    "targetId": "foundation:structure:jaesaenggwan",
    "key": "jaesaenggwan",
    "label": "재생관",
    "hanja": "財生官",
    "aliases": [
      "재생관"
    ],
    "family": "flow",
    "participants": {
      "tenGods": [
        "正財",
        "偏財",
        "正官"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간이 극하는 재성에서 일간을 극하는 관성으로 이어지는 오행 상생 관계이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "jaesaenggwan"
        }
      ]
    },
    "researchDefinition": "재성이 정관을 생하는 연결. 재성이 편관을 키우는 경우를 동일한 이름으로 처리하지 않는다.",
    "formation": {
      "strength": "재성과 관성 작용을 감당할 일간 여력. 신약이면 역할 증가가 부담일 수 있음.",
      "position": "V4는 같은·인접 기둥의 재성→정관 연결을 확인.",
      "monthCommand": "재성·정관의 월령 기반 및 무엇을 주로 쓰는 격국인지 별도 판단.",
      "visibleStems": "적어도 한쪽 투간과 두 군의 충분한 기반. 편관 단독은 대상 아님.",
      "roots": "재성·정관 뿌리와 일간의 기반을 나눠 확인.",
      "hiddenStems": "장간 공존만으로 자원이 관성에 전달된다고 확정하지 않음.",
      "generationControl": "재성→정관 생조. 상관 제어와 편관 혼재는 해당 V4 후보를 억제.",
      "additional": "권한·성과 배분·규정의 현실 정보 없이는 승진·사회 지위로 변환 불가."
    },
    "counterconditions": [
      "편관만 존재",
      "상관·편관의 강한 개입",
      "자원은 늘어도 일간 지원이 불충분"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "재성과 관성의 상생을 논하지만 월령의 주된 쓰임과 전체 배치를 먼저 구별한다. 보이는 두 십성을 모두 같은 격으로 읽지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "zp8",
            "locator": "論用神: 財生官 / 官喜透財"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "자원의 규모와 공식 역할의 기준이 연결되는 단계다. 돈이 많다는 해석보다 어떤 자원이 어떤 책임을 뒷받침하는지를 묻는다.",
      "positive": "실제 성과가 책임의 근거로 인정되는 환경이라면 맡을 권한과 자원을 함께 협의할 수 있다.",
      "risk": "성과만큼 의무가 커지는데 권한은 늘지 않으면 이 연결은 부담으로 읽힐 수 있다.",
      "strengthToRisk": "신뢰를 쌓는 일이 평가를 유지하기 위해 자원을 계속 투입하는 순환으로 바뀔 수 있다.",
      "weaknessToResource": "책임이 명확해지면 오히려 추가 요청을 거절할 객관적인 기준을 얻을 수 있다.",
      "tension": "재다신약과 달리 약함이 정의 조건은 아니며 관인상생과 달리 인성으로 일간을 돕는 마지막 경로는 미확인이다.",
      "limits": "승진·공직·부유함·배우자 지위는 추론하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:officer_resource",
        "difference": "재생관의 종점은 정관이고 관인상생은 정관→인성→일간까지 확인한다. 책임 증가와 지원 증가를 동일시하지 않는다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "wealthCreatesOfficer"
      ],
      "legacyPatternCodes": [],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "권한·성과 배분·규정의 현실 정보 없이는 승진·사회 지위로 변환 불가.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp8",
        "locator": "論用神: 財生官 / 官喜透財"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:officer_resource",
    "targetId": "foundation:structure:officer_resource",
    "key": "officer_resource",
    "label": "관인상생",
    "hanja": "官印相生",
    "aliases": [
      "관인상생"
    ],
    "family": "flow",
    "participants": {
      "tenGods": [
        "正官",
        "正印",
        "偏印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "정관에서 인성으로 이어져 일간을 생조하는 관계를 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "officer_resource"
        }
      ]
    },
    "researchDefinition": "정관이 인성을 생하고 그 인성이 일간을 돕는 연속 연결. 관·인 두 이름이 있다는 사실만으로 완성하지 않는다.",
    "formation": {
      "strength": "관의 제어와 인성 생조가 일간에 어떻게 닿는지 함께 봄. 신강인중이면 지원 추가가 항상 유리하지 않음.",
      "position": "관→인성, 인성→일간의 두 경로 필요. V4는 인접 및 일간 도달 위치를 요구.",
      "monthCommand": "관격의 인 보호와 인격의 관 생조는 주된 쓰임이 다르므로 월령을 구분.",
      "visibleStems": "정관·인성의 투출/기반, 편관 혼입을 점검.",
      "roots": "인성의 뿌리가 있어도 재성에 손상되면 중개 기능 제한.",
      "hiddenStems": "장간의 인성은 월령 인격 확정과 다름.",
      "generationControl": "정관→인성→일간. 재극인·상관극관·편관 혼재가 경로를 바꿀 수 있음.",
      "additional": "실제 교육·문서·조언이 책임 수행에 쓰일 통로를 확인해야 현대 적용 가능."
    },
    "counterconditions": [
      "인성이 일간에 닿는 경로 없음",
      "강한 재성·상관·편관 개입",
      "관인 공존을 관인격으로 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "정관패인과 인수용관을 구별하는 설명이 있다. 두 요소의 공존보다 월령의 주객과 보호·생조 역할이 중요하다.",
        "sourceRefs": [
          {
            "sourceId": "zp8",
            "locator": "論用神: 正官佩印與印綬用官之別"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "규범의 요구를 자료·학습·지원이 중개하여 일간에 전달하는 흐름이다. 관성의 책임 설명에 어떻게 익히고 이해할지라는 경로가 더해진다.",
      "positive": "실제 기준과 배울 자원이 맞으면 요구를 이해 가능한 절차와 역량으로 바꾸는 후보다.",
      "risk": "권위 있는 설명을 충분히 모으는 일이 스스로 판단하는 과정을 대체할 수 있다.",
      "strengthToRisk": "기준을 깊이 배우는 강점이 허락을 받기 전에는 움직이지 못하는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "규정을 잘 이해하면 따라야 할 범위와 바꿔도 되는 범위를 더 명확하게 나눌 수 있다.",
      "tension": "살인상생은 편관의 강한 제어를 중개하며 관인상생은 정관의 기준과 인성의 지원을 잇는다.",
      "limits": "학위·공무원 합격·명예·도움의 실제 경험을 확정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:salin_sangsaeng",
        "difference": "출발 십성이 정관/편관으로 다르다. 같은 인성이라도 무엇을 중개하는지와 제화 조건을 구별한다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "officerResourceFlow"
      ],
      "legacyPatternCodes": [],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "실제 교육·문서·조언이 책임 수행에 쓰일 통로를 확인해야 현대 적용 가능.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp8",
        "locator": "論用神: 正官佩印與印綬用官之別"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:salin_sangsaeng",
    "targetId": "foundation:structure:salin_sangsaeng",
    "key": "salin_sangsaeng",
    "label": "살인상생",
    "hanja": "殺印相生",
    "aliases": [
      "살인상생"
    ],
    "family": "flow",
    "participants": {
      "tenGods": [
        "偏官",
        "正印",
        "偏印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간을 극하는 편관과 일간을 생하는 인성의 연속 생조를 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "salin_sangsaeng"
        }
      ]
    },
    "researchDefinition": "편관이 인성을 생하고 인성이 일간을 돕는 경로. 칠살이 존재한다는 사실과 그것이 인성을 통해 화하는 조건을 분리한다.",
    "formation": {
      "strength": "편관·인성·일간의 상대 기세를 검토. 일간 강약 하나로 유불리 고정 금지.",
      "position": "살→인성 및 인성→일간의 중개 경로를 모두 확인.",
      "monthCommand": "월령의 살 또는 인이 무엇을 주로 쓰는지에 따라 같은 배치도 역할이 달라짐.",
      "visibleStems": "편관과 인성의 실제 노출·기반. 정관 혼입을 별도 점검.",
      "roots": "인성의 뿌리와 일간 지원이 제화에 기여하는지 확인.",
      "hiddenStems": "숨은 인성 이름 하나로 살의 작용이 모두 완화된다고 하지 않음.",
      "generationControl": "살→인성→일간의 생조는 식상→살의 제어와 다르다. 재극인은 중개를 훼손할 수 있음.",
      "additional": "교육·지원 없이 압박 자체를 성장 자원으로 낭만화하지 않는다."
    },
    "counterconditions": [
      "인성→일간 경로 없음",
      "식상제살을 살인상생으로 혼합",
      "재성의 인성 제어 또는 정관 혼재"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "편관 절에서 인성의 화와 식신의 제어를 별도 경로로 다루며 과다·부족을 함께 제한한다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論偏官: 煞助印生 / 諸制合生化無太過不及"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "직접 맞서는 제어가 아니라 중간의 인성을 통해 지원으로 돌리는 관계다. 압박·배움·감당 기반의 세 부분을 확인해야 한다.",
      "positive": "위험한 과제에 실제 훈련·문서·지도자가 붙는다면 대응 절차를 자신의 역량으로 남길 가능성을 검토한다.",
      "risk": "살이 인성을 생한다는 이름으로 과도한 요구나 위해 환경을 정당화해서는 안 된다.",
      "strengthToRisk": "배움으로 대응하는 장점이 모든 어려움을 혼자 연구해 견디는 방식으로 굳어질 수 있다.",
      "weaknessToResource": "문제의 무게를 인정하는 것이 도움의 종류를 정확하게 요청하는 출발점이 될 수 있다.",
      "tension": "관인상생과 십성 출발점이 다르며 식신제살과는 생조 중개/직접 제어라는 차이가 있다.",
      "limits": "고난을 겪었다거나 그 덕에 성공했다는 과거 서사를 만들지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:weak_officer",
        "difference": "편관의 존재나 일간 부담만으로 살인상생은 아니다. 인성이 편관에서 생조받아 일간에 닿는 두 경로가 필요하다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "killingResourceFlow"
      ],
      "legacyPatternCodes": [],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "교육·지원 없이 압박 자체를 성장 자원으로 낭만화하지 않는다.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論偏官: 煞助印生 / 諸制合生化無太過不及"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
