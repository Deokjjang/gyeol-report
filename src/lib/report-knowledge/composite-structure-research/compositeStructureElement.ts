import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_ELEMENT = [
  {
    "id": "csr:profile:toda_maegeum",
    "targetId": "foundation:structure:toda_maegeum",
    "key": "toda_maegeum",
    "label": "토다매금",
    "hanja": "土多埋金",
    "aliases": [
      "토다매금"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "土",
        "金"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "토가 겹쳐 금의 쓰임을 가리는 상황에 빗댄 조건부 구조이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "toda_maegeum"
        }
      ]
    },
    "researchDefinition": "금이 토의 생조를 받더라도 토가 지나쳐 금의 쓰임을 가릴 수 있다는 상생 과용의 물상. 토와 금의 숫자만으로 전통 성립을 확정하지 않는다.",
    "formation": {
      "strength": "금이 토의 부담을 견딜 기세인지 확인. 금왕·토박과 구분.",
      "position": "토가 금을 둘러싼 위치와 실제 전달 경로.",
      "monthCommand": "가을 금왕의 토와 겨울·여름의 토를 같은 조건으로 읽지 않음.",
      "visibleStems": "토·금의 투간 여부는 확인 자료이며 개수 자체가 매금 판정 아님.",
      "roots": "금의 독립 통근과 토의 건습을 함께 검토.",
      "hiddenStems": "토 지지 속 금을 토 총량에 중복 계산하지 않으며 저장 역할을 분리.",
      "generationControl": "토생금의 도움이 과도하면 작용이 가려질 수 있다는 조건부 논설.",
      "additional": "V2 토>=4·금>0 표시는 단순 후보. V4의 독립 매금 판정은 없음."
    },
    "counterconditions": [
      "금이 왕하고 토가 적절히 생조",
      "토의 건습·금 뿌리 미검토",
      "토 많음만으로 판단 지연 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "금의 계절과 토의 두께에 따라 생조와 매몰을 달리 설명한다. 토생금을 항상 이익으로 읽지 않는 물상이다.",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行: 金 / 土 / 土多金埋"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "지원 역할의 토가 지나쳐 지원 대상 금의 쓰임을 가리는 역전이다. 단순한 토 과다보다 생조의 수혜자가 실제로 작용할 수 있는지가 핵심이다.",
      "positive": "지원의 양과 결정권을 함께 조절할 수 있다면 필요한 기반만 남기는 질문으로 활용 가능하다.",
      "risk": "보호·절차를 계속 더하는 것이 대상의 판단이나 사용을 막을 수 있다.",
      "strengthToRisk": "안정된 지원이 검토·승인을 끝없이 늘리는 방식으로 과용될 수 있다.",
      "weaknessToResource": "지원의 일부를 덜어내는 것이 방치가 아니라 대상의 기능을 회복하는 조건일 수 있다.",
      "tension": "인성다자는 일간 상대 십성이고 토다매금은 토·금의 생조 배합으로 모든 일간의 인성 문제는 아니다.",
      "limits": "판단력·성격·정신 건강과 토의 물상을 직접 동일시하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:resource_many",
        "difference": "토가 일간을 생하는 인성인 원국에서만 일부 맥락이 겹친다. 모든 일간에 토=인성이라는 동일화를 적용할 수 없다."
      }
    ],
    "support": {
      "classification": "B_FACTS_NO_V4_DETECTOR",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음. V2 toSpecialPatterns는 earth>=4 && metal>0 후보를 생성하나 이는 전통 매금 확인이 아님.",
      "codeRefs": [
        "src/lib/report-knowledge/sajuComputedFactsMapper.ts",
        "src/lib/report-knowledge/sajuComputedFactsTypes.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "V2 토>=4·금>0 표시는 단순 후보. V4의 독립 매금 판정은 없음.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm1",
        "locator": "論五行: 金 / 土 / 土多金埋"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:geumda_mokjeol",
    "targetId": "foundation:structure:geumda_mokjeol",
    "key": "geumda_mokjeol",
    "label": "금다목절",
    "hanja": "金多木折",
    "aliases": [
      "금다목절"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "金",
        "木"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "금의 제어가 목의 여력에 비해 지나칠 수 있다는 기존 내부 구조명이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "geumda_mokjeol"
        }
      ]
    },
    "researchDefinition": "목의 여력에 비해 금의 제어가 지나치는 상황. 금극목의 조절 가능성과 과도 제어를 구별한다.",
    "formation": {
      "strength": "목의 통근·생조보다 금의 제어가 우세한지 검토.",
      "position": "금→목이 실제 닿는 위치와 수의 중개를 확인.",
      "monthCommand": "봄 목왕·가을 금왕의 차이. 득령만으로 확정하지 않음.",
      "visibleStems": "금·목 투간과 각 뿌리를 점검.",
      "roots": "목의 뿌리가 깊으면 같은 금 개수도 다르게 읽음.",
      "hiddenStems": "장간의 목 지원과 화의 금 제어를 누락하지 않음.",
      "generationControl": "적절한 금은 목의 쓰임을 조절하지만 약한 목에 과하면 제한. 수를 통한 생조는 별도 검토.",
      "additional": "V4 독립 판정 없음. 전체 상대 기세를 확인하기 전 성립 확정 불가."
    },
    "counterconditions": [
      "목이 충분히 왕하여 금의 조절이 필요",
      "금이 약하거나 제어 경로 차단",
      "규칙·비판이 무조건 나쁘다고 해석"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "목의 계절·강약과 금의 경중에 따라 조절과 과도 제어를 구별하는 설명이 있다.",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行: 木弱逢金 / 春秋之木"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "제어가 있는 것 자체보다 성장 대상을 다듬을 여력과 제어량의 비례가 쟁점이다.",
      "positive": "기준을 단계에 맞게 적용할 수 있다면 필요한 수정과 성장 공간을 함께 남기는 질문이 된다.",
      "risk": "아직 기반이 부족한 대상에 완성 기준을 먼저 요구하면 가능성을 시험하기도 전에 제한할 수 있다.",
      "strengthToRisk": "정확함을 높이는 장점이 시행착오를 전혀 허용하지 않는 방식으로 과용될 수 있다.",
      "weaknessToResource": "제약이 명확하고 감당 가능하면 방향을 선별하는 도움으로 작용할 수 있다.",
      "tension": "상관견관은 일간 상대 십성의 출력→정관 제어, 금다목절은 금→목 배합의 상대 과도다.",
      "limits": "실제 피해·엄격한 부모·성장 실패·상해를 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:fire_metal",
        "difference": "금이 목을 제어하는 배합과 화가 금을 제어하는 배합은 제어자·대상이 다르며 같은 교정 비유로 성립을 대체할 수 없다."
      }
    ],
    "support": {
      "classification": "B_FACTS_NO_V4_DETECTOR",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음. 계산 facts enum과 매핑의 존재는 producer의 존재가 아님. 전수 검색에서 해당 specialPatterns의 소스 생산 경로를 찾지 못했으며 fixture 투입은 존재.",
      "codeRefs": [
        "src/lib/report-knowledge/sajuComputedFactsMapper.ts",
        "src/lib/report-knowledge/sajuComputedFactsTypes.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "V4 독립 판정 없음. 전체 상대 기세를 확인하기 전 성립 확정 불가.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm1",
        "locator": "論五行: 木弱逢金 / 春秋之木"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:mokda_hwasik",
    "targetId": "foundation:structure:mokda_hwasik",
    "key": "mokda_hwasik",
    "label": "목다화식",
    "hanja": "木多火熄〔內部名稱・未校定〕",
    "aliases": [
      "목다화식"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "木",
        "火"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "목의 공급이 지나쳐 화의 쓰임이 흐려지는 상황을 살피는 내부 구조명이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "mokda_hwasik"
        }
      ]
    },
    "researchDefinition": "기존 DB가 계획과 출력의 불균형을 붙인 내부 명칭. 해당 한자 성립과 일반적인 목생화의 역전 조건은 아직 확정하지 않는다.",
    "formation": {
      "strength": "목의 우세만으로 화가 꺼진다고 할 수 없음. 화의 기세와 수·조습 필요.",
      "position": "목과 화의 위치를 확인해도 내부 이름의 전통 성립이 자동 확인되지는 않음.",
      "monthCommand": "계절의 목왕·화왕과 습목·건목 조건을 구별해야 함.",
      "visibleStems": "목·화 투출만으로 지원 과용의 방향 확정 불가.",
      "roots": "화의 뿌리·목의 성질 및 수의 개입을 추가 검토.",
      "hiddenStems": "장간의 화 기반을 보지 않고 화의 소멸을 말하지 않음.",
      "generationControl": "전통 발췌에는 목다화치가 있어 목→화 강화와 약화의 조건을 먼저 분리해야 함.",
      "additional": "wood_excess_feeds_fire 매핑과 내부 한국어 풀이의 방향 충돌 해결 전 응용 승인 금지."
    },
    "counterconditions": [
      "목이 많아 반드시 화가 소멸한다고 주장",
      "木多火熾를 木多火熄의 근거로 제시",
      "실행 부진을 계산된 사실로 취급"
    ],
    "traditional": [
      {
        "class": "E_UNVERIFIED",
        "text": "목다화식이라는 내부 명칭은 확인했으나 전통 성립식을 고정할 직접 전거는 확보하지 못했다. 삼명통회 권1의 목다화치 논설과 의미 방향이 달라 자동 병합하지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "repo-foundation",
            "locator": "mokda_hwasik"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "지원 재료와 출력 여력의 불일치라는 기존 편집 가설은 보존하되, 목·화의 검증된 명리 사실과 분리한다.",
      "positive": "조건 검증 전에는 생활 성향을 말하지 않고 지원이 실제 출력에 쓰이는지라는 연구 질문을 남긴다.",
      "risk": "강화와 소멸의 반대 의미를 같은 코드에 넣으면 고객 해석을 뒤집을 수 있다.",
      "strengthToRisk": "준비가 많음을 실행 부족으로 해석하는 관행 자체가 과용 위험이다.",
      "weaknessToResource": "목이 화를 돕는 조건에서는 오히려 출력 강화가 가능하므로 기존 부정 풀이를 고정할 수 없다.",
      "tension": "토다매금의 생조 역전을 이름만 바꿔 복제하지 않는다. 목·화에는 별도의 조건과 전거가 필요하다.",
      "limits": "이 구조의 8영역은 미검증 연구로만 보존하고 직접 고객 적용하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:toda_maegeum",
        "difference": "토다매금의 지원 과용 논설을 목·화로 복제할 수 없다. 목다화치와 역방향인 목다화식은 별도의 전거·조건이 필요하다."
      }
    ],
    "support": {
      "classification": "B_FACTS_NO_V4_DETECTOR",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음. 계산 facts enum과 매핑의 존재는 producer의 존재가 아님. 전수 검색에서 해당 specialPatterns의 소스 생산 경로를 찾지 못했으며 fixture 투입은 존재.",
      "codeRefs": [
        "src/lib/report-knowledge/sajuComputedFactsMapper.ts",
        "src/lib/report-knowledge/sajuComputedFactsTypes.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "wood_excess_feeds_fire 매핑과 내부 한국어 풀이의 방향 충돌 해결 전 응용 승인 금지.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "repo-foundation",
        "locator": "mokda_hwasik"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:suda_mokbu",
    "targetId": "foundation:structure:suda_mokbu",
    "key": "suda_mokbu",
    "label": "수다목부",
    "hanja": "水多木浮",
    "aliases": [
      "수다목부"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "水",
        "木"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "물이 넘쳐 목이 뜨는 상황에 빗댄 조건부 구조이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "suda_mokbu"
        }
      ]
    },
    "researchDefinition": "목을 생하는 수가 지나치고 목의 기반이 부족해 생조가 정착으로 이어지지 않는 물상. 수생목의 과용 조건이다.",
    "formation": {
      "strength": "수의 우세와 목의 통근·수용 여력을 함께 검토.",
      "position": "목의 뿌리와 수가 작용하는 위치, 토의 제수 가능성을 확인.",
      "monthCommand": "겨울 수왕과 봄 목왕의 차이 및 한난을 같이 검토.",
      "visibleStems": "물·목 투출량만으로 떠오름을 확정하지 않음.",
      "roots": "깊은 목 뿌리가 있으면 같은 수량도 생조일 수 있음.",
      "hiddenStems": "지장간 토·목의 기반을 누락하지 않음.",
      "generationControl": "수생목과 수과다에 의한 부유를 구별. 토의 제수도 과하면 목을 해칠 수 있어 자동 처방 아님.",
      "additional": "실제 감정·정보량과 물의 양을 동일시하지 않고 생활 맥락을 별도 확인."
    },
    "counterconditions": [
      "목이 수를 받아 쓸 충분한 뿌리",
      "수의 계절·제어 미검토",
      "감정 과잉·우유부단을 오행 수량으로 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "목과 수의 양·계절에 따라 생조와 표류를 달리 보는 설명이 있다. 실제 감정이나 이주 사건의 근거로 쓰지는 않는다.",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行: 木賴水生少則滋潤多則漂流"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "공급이 충분해도 수용 대상의 기반이 없으면 연결이 정착되지 않을 수 있다는 조건이다.",
      "positive": "받는 정보와 그것을 붙잡을 기준을 함께 정할 수 있다면 입력을 실행 단위로 좁히는 질문이 된다.",
      "risk": "공급을 더 늘리는 해결이 이미 불안정한 선택을 더 자주 바꾸게 만들 수 있다.",
      "strengthToRisk": "여러 관점을 수용하는 장점이 새 정보마다 방향을 바꾸는 방식으로 과용될 수 있다.",
      "weaknessToResource": "유연하게 바꾸는 태도가 기준만 있으면 환경 변화에 맞는 조정 능력으로 쓰일 수 있다.",
      "tension": "토다매금은 지원이 덮는 물상, 수다목부는 지원을 받는 대상의 정착 기반 문제다.",
      "limits": "감정·정신 상태·거주 이동·실제 관계 불안정을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:toda_maegeum",
        "difference": "수다목부는 수혜자 목의 정착 기반과 공급의 상대 문제, 토다매금은 금의 쓰임을 토가 가리는 물상이다."
      }
    ],
    "support": {
      "classification": "B_FACTS_NO_V4_DETECTOR",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음. 계산 facts enum과 매핑의 존재는 producer의 존재가 아님. 전수 검색에서 해당 specialPatterns의 소스 생산 경로를 찾지 못했으며 fixture 투입은 존재.",
      "codeRefs": [
        "src/lib/report-knowledge/sajuComputedFactsMapper.ts",
        "src/lib/report-knowledge/sajuComputedFactsTypes.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "실제 감정·정보량과 물의 양을 동일시하지 않고 생활 맥락을 별도 확인.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm1",
        "locator": "論五行: 木賴水生少則滋潤多則漂流"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:fire_metal",
    "targetId": "foundation:structure:fire_metal",
    "key": "fire_metal",
    "label": "화금 긴장 구조",
    "hanja": "火金緊張候補〔內部名稱〕",
    "aliases": [
      "화금 긴장 구조"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "火",
        "金"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "화와 금의 강함 표시가 함께 있는 현행 휴리스틱 후보이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "fire_metal"
        }
      ]
    },
    "researchDefinition": "원생 오행 라벨에 FIRE_STRONG과 METAL_STRONG이 함께 있는 후보. 화극금의 유불리나 전통 단련 구조 완성을 판정하지 않는다.",
    "formation": {
      "strength": "화·금 상대 기세와 일간 관계를 후보 바깥에서 확인.",
      "position": "두 오행이 어느 위치에서 닿는지 원생 라벨만으로 알 수 없음.",
      "monthCommand": "여름 화왕·가을 금왕, 한난조습에 따라 방향이 달라짐.",
      "visibleStems": "투출·통근은 원생 동시 라벨 판정의 필수 조건이 아님.",
      "roots": "금의 뿌리와 화의 기반을 별도로 확인.",
      "hiddenStems": "장간 토의 중개·수의 제화 등 누락 가능.",
      "generationControl": "화극금이 조절인지 과도 제어인지 검토. 토의 중개 가능성은 새 계산하지 않음.",
      "additional": "현실의 기준 수정·실험 조건이 있어야 편집 사례 질문으로 사용."
    },
    "counterconditions": [
      "동시 라벨로 화금 전쟁 확정",
      "열정과 판단력이라는 성격을 자동 배정",
      "화가 강하면 금을 이긴다고 고정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "금과 화의 경중 및 쓰임에 따라 단련과 손상이 달라지는 논설이 있다. 원생 두 strong 라벨만으로 어느 쪽인지 결정하지 못한다.",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行: 金重火輕 / 金輕火重 / 金未成器"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "제어의 양과 대상의 상태를 맞춰야 한다는 검토다. 화와 금의 독립 성격을 더한 설명으로 끝내지 않는다.",
      "positive": "수정할 대상과 검증 기준이 실제로 있다면 변화의 강도를 단계적으로 시험하는 질문이 된다.",
      "risk": "대상의 상태를 보지 않은 강한 교정은 필요한 기능까지 훼손할 수 있다.",
      "strengthToRisk": "빠른 개선 시도가 검증을 생략하는 방식으로 과용될 수 있다.",
      "weaknessToResource": "충분히 준비된 대상은 제약을 통해 쓰임이 선명해질 수 있어 긴장이 항상 손상은 아니다.",
      "tension": "금다목절은 금→목, 화금 후보는 화→금이며 지배·피지배 오행이 다르다.",
      "limits": "다혈질·날카로운 성격·금속 사고·질병·성공을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:geumda_mokjeol",
        "difference": "화금 동시 strong 라벨은 화극금의 유불리를 판정하지 않으며 금다목절과 달리 약한 목이라는 대상 전제도 없다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [
        "FIRE_METAL_TENSION"
      ],
      "actualBehavior": "원생 analyzeSajuStructure의 제한된 점수/라벨 후보. V4 STRUCTURE_RULES에는 이 이름의 독립 판정 없음.",
      "codeRefs": [
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "현실의 기준 수정·실험 조건이 있어야 편집 사례 질문으로 사용.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm1",
        "locator": "論五行: 金重火輕 / 金輕火重 / 金未成器"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:water_weak",
    "targetId": "foundation:structure:water_weak",
    "key": "water_weak",
    "label": "수 기운 보완 필요",
    "hanja": "水弱・水缺候補〔內部名稱〕",
    "aliases": [
      "수 기운 보완 필요"
    ],
    "family": "element",
    "participants": {
      "tenGods": [],
      "elements": [
        "水"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "수의 약함 또는 결핍 표시에서 생성되는 현행 내부 후보이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "water_weak"
        }
      ]
    },
    "researchDefinition": "원생 WATER_WEAK 또는 WATER_MISSING 라벨에서 생성되는 내부 후보. 일간 신약이나 실제 회복 부족을 판정하지 않는다.",
    "formation": {
      "strength": "수의 비중과 일간 강약은 다른 값. 수를 늘릴 필요가 있는지는 전체 기세에 달림.",
      "position": "어떤 위치의 수가 확인되거나 없는지 원국 자료 추가 확인.",
      "monthCommand": "계절상 수의 강약과 건습·한난은 단일 missing 라벨과 다름.",
      "visibleStems": "표면 수 부재와 장간 수 부재를 분리.",
      "roots": "수의 뿌리와 금의 생조, 목의 설기를 함께 확인.",
      "hiddenStems": "장간 수의 유무를 확인하기 전 물이 없다고 확정하지 않음.",
      "generationControl": "금생수·수생목·토극수 등 전체 경로에 따라 보충의 유불리가 달라짐.",
      "additional": "수 부족→휴식 부족이라는 기존 문구의 직접 전거·현실 지표가 부족함."
    },
    "counterconditions": [
      "수 부족을 탈수·신장·휴식 부족으로 환산",
      "수 추가를 모든 원국의 처방으로 제시",
      "신약과 혼동"
    ],
    "traditional": [
      {
        "class": "E_UNVERIFIED",
        "text": "원생 라벨과 기존 회복 문구를 확인했으나 수 부족이 실제 회복 방식이나 성격을 결정한다는 직접 전거는 확보하지 못했다.",
        "sourceRefs": [
          {
            "sourceId": "repo-foundation",
            "locator": "water_weak"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "기호 비중과 생활 회복의 연결은 아직 검증되지 않은 가설이다. 필요한 오행을 정하는 판단과 건강 조언은 분리해야 한다.",
      "positive": "부족한 기호를 보완하라는 말 대신 실제 생활 자료를 확보할 연구 질문으로 남긴다.",
      "risk": "원국에 필요하지 않은 수까지 늘리라는 보편 처방이나 건강 진단으로 오용될 수 있다.",
      "strengthToRisk": "휴식을 권하는 일반 조언이 명리의 개인화된 사실처럼 표시되는 위험이 있다.",
      "weaknessToResource": "수가 적은 것이 특정 원국에서는 과도한 한습을 덜 수 있으므로 결핍을 무조건 불리하게 읽지 않는다.",
      "tension": "수다목부는 수·목의 상대 배합이고 이 후보는 수의 낮은 라벨뿐이다.",
      "limits": "8영역 모두 수 부족에서 직접 성격·직업·재물·관계를 읽는 자료는 미승인이다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:sinyak",
        "difference": "수의 낮은 비중 라벨과 일간의 강약은 다른 기준이다. 일간에 따라 수가 돕거나 소모·제어하는 역할도 달라진다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [
        "WATER_WEAK_RECOVERY_NEEDED"
      ],
      "actualBehavior": "원생 analyzeSajuStructure의 제한된 점수/라벨 후보. V4 STRUCTURE_RULES에는 이 이름의 독립 판정 없음.",
      "codeRefs": [
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "수 부족→휴식 부족이라는 기존 문구의 직접 전거·현실 지표가 부족함.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "repo-foundation",
        "locator": "water_weak"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
