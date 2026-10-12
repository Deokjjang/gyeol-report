import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_WEIGHT = [
  {
    "id": "csr:profile:bigeop_many",
    "targetId": "foundation:structure:bigeop_many",
    "key": "bigeop_many",
    "label": "비겁다자",
    "hanja": "比劫偏重",
    "aliases": [
      "비겁다자"
    ],
    "family": "weight",
    "participants": {
      "tenGods": [
        "比肩",
        "劫財"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "비견·겁재의 비중이 두드러지는 내부 분류이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "bigeop_many"
        }
      ]
    },
    "researchDefinition": "비견·겁재의 상대 비중이 두드러진 상태. 동류의 지원과 재성에 대한 경쟁 가능성은 전체 경로에 따라 구분한다.",
    "formation": {
      "strength": "비겁 우세와 신강은 다르다. 인성·관성·식상까지 종합.",
      "position": "복수 독립 위치에서 비겁이 의미 있게 나타나는지 확인.",
      "monthCommand": "비겁 득령과 다른 계절의 비겁 투출은 동등하지 않음.",
      "visibleStems": "V4 heavy는 투간과 지지 기반을 요구.",
      "roots": "동류 뿌리는 일간 지원이지만 합충 미해결은 확신 제한.",
      "hiddenStems": "지장간 비겁 비중과 표면 동류는 분리.",
      "generationControl": "비겁→식상→재성은 통로, 비겁과 재성의 직접 경쟁은 다른 조건.",
      "additional": "V4 34%·가중2 등은 내부 경계이며 사람 간 경쟁 횟수가 아님."
    },
    "counterconditions": [
      "독립 위치·통근 부족",
      "재성을 함께 키울 식상 경로를 누락",
      "비겁을 실제 형제·동료로 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "재성이 약하고 비겁이 무거운 조건과 식신으로 흐름을 바꾸는 조건을 구별한다. 비겁의 존재만으로 재물 손실을 확정하지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "zp9",
            "locator": "論用神成敗救應: 財輕比重 / 食以化劫"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "동류가 여럿이라는 관측은 지원과 자원 배분이라는 두 방향을 만든다. 비견·겁재를 묶어 보되 음양 역할 차이는 지우지 않는다.",
      "positive": "공동 목표와 배분 기준이 있다면 독립된 힘을 협력 산출에 모으는 질문으로 활용할 수 있다.",
      "risk": "동류의 수가 늘어도 몫과 권한이 정리되지 않으면 참여가 경쟁으로 바뀔 수 있다.",
      "strengthToRisk": "자기 기준을 지키는 장점이 타인의 방식과 분업을 거절하는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "경쟁이 비교 평가 대신 공동 숙련의 기준이 될 가능성도 있다.",
      "tension": "신강은 일간 전체 여력이고 비겁다자는 지원 가족 중 동류의 상대 비중이다.",
      "limits": "실제 형제 수·사업 동업·경쟁심·돈을 빼앗긴 경험을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:resource_many",
        "difference": "둘 다 일간을 도울 수 있지만 비겁은 같은 오행의 동류이고 인성은 일간을 생하는 오행이다. 동등한 분배와 입력 지원은 다른 질문이다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "peerHeavy"
      ],
      "legacyPatternCodes": [
        "PEER_HEAVY"
      ],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "V4 34%·가중2 등은 내부 경계이며 사람 간 경쟁 횟수가 아님.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp9",
        "locator": "論用神成敗救應: 財輕比重 / 食以化劫"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:resource_many",
    "targetId": "foundation:structure:resource_many",
    "key": "resource_many",
    "label": "인성다자",
    "hanja": "印星偏重",
    "aliases": [
      "인성다자"
    ],
    "family": "weight",
    "participants": {
      "tenGods": [
        "正印",
        "偏印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "정인·편인의 비중이 두드러지는 내부 분류이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "resource_many"
        }
      ]
    },
    "researchDefinition": "인성의 상대 비중이 두드러진 상태. 생조가 유효한지, 식상의 쓰임을 막는지, 일간의 필요를 넘는지는 별도다.",
    "formation": {
      "strength": "일간이 지원을 필요로 하는지와 신강인중인지 구분.",
      "position": "인성의 위치와 일간 도달 경로를 확인.",
      "monthCommand": "월령 인격과 다른 자리 인성 우세를 동일시하지 않음.",
      "visibleStems": "V4 인성 heavy의 투간·기반 조건과 전통 인격의 성립을 구별.",
      "roots": "인성 통근 및 일간의 뿌리를 각각 확인.",
      "hiddenStems": "편인 존재만으로 도식이 아니며 실제 식신 제어 경로 필요.",
      "generationControl": "인성→일간 생조, 인성극식상, 재극인은 조건에 따라 역할 반전.",
      "additional": "학력·부모 지원·교육 환경은 실제 정보가 필요."
    },
    "counterconditions": [
      "인성 많음만으로 학업 우수",
      "편인 존재를 무조건 도식",
      "일간이 이미 강한데 추가 지원만 이익으로 읽음"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "몸과 인성이 함께 왕할 때 식상으로 흐르게 하거나 많은 인성이 재성과 만나는 별도 조건을 설명한다. 인성 추가가 항상 이익은 아니다.",
        "sourceRefs": [
          {
            "sourceId": "zp9",
            "locator": "論用神成敗救應: 身印兩旺用食傷 / 印多逢財"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "일간으로 들어오는 자원이 집중되는 배합이다. 받는 기반의 장점과 그 기반이 바깥 쓰임을 막는 조건을 함께 묻는다.",
      "positive": "지원이 실제 판단과 실행에 쓰이면 수집한 자료를 맥락 있는 기준으로 남길 가능성이 있다.",
      "risk": "지원과 설명을 더하는 일이 이미 할 수 있는 행동을 계속 미루게 만들 수 있다.",
      "strengthToRisk": "충분히 이해하려는 장점이 불확실성을 전혀 허용하지 못하는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "지원이 충분하다는 확인은 추가 준비보다 작은 검증을 선택할 여유가 될 수 있다.",
      "tension": "관인상생은 관에서 인성으로 오는 경로를 요구하지만 인성다자는 인성 자체의 우세다.",
      "limits": "학벌·지능·가족 보호·실제 지식 수준을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:officer_resource",
        "difference": "인성 우세만으로 정관→인성의 출처나 인성→일간의 유효 경로가 확정되지 않는다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "resourceHeavy"
      ],
      "legacyPatternCodes": [
        "RESOURCE_HEAVY"
      ],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "학력·부모 지원·교육 환경은 실제 정보가 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp9",
        "locator": "論用神成敗救應: 身印兩旺用食傷 / 印多逢財"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:output_heavy",
    "targetId": "foundation:structure:output_heavy",
    "key": "output_heavy",
    "label": "식상 강함",
    "hanja": "食傷偏重",
    "aliases": [
      "식상 강함"
    ],
    "family": "weight",
    "participants": {
      "tenGods": [
        "食神",
        "傷官"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "현행 구조 분석의 식상 비중이 높은 조건이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "output_heavy"
        }
      ]
    },
    "researchDefinition": "식신·상관의 상대 비중이 높은 상태. 밖으로 생하는 작용이며 식상생재·식상제살의 목적지까지 자동 확정하지 않는다.",
    "formation": {
      "strength": "설기를 일간이 감당하는지, 식신·상관 각각의 쓰임을 구분.",
      "position": "복수 위치의 식상이 별도로 의미 있는지 확인.",
      "monthCommand": "계절의 식상 힘과 일간 지원을 함께 검토.",
      "visibleStems": "V4 heavy 투간 조건을 만족해도 실제 발언·창작 행동을 증명하지 않음.",
      "roots": "식상의 지지 기반과 일간 뿌리 둘 다 필요.",
      "hiddenStems": "본기 식상과 잠재 장간 식상을 동일 강도로 읽지 않음.",
      "generationControl": "일간→식상 이후 재성 생조·살 제어·관 제어는 다른 경로.",
      "additional": "현실 산출의 형식·질·빈도·수용자를 별도로 확인."
    },
    "counterconditions": [
      "식상 우세를 신약 또는 생재로 자동 연결",
      "식신과 상관의 차이를 삭제",
      "식상이 많아 말이 많다고 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "식신·상관의 각 쓰임, 생재와 제어·인성의 개입을 별도로 논한다. 현행 두 십성 묶음의 비중은 단일 고전 격국이 아니다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論食神 / 論傷官"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "일간에서 외부로 나가는 작용이 집중된다. 무엇을 남기고 어디에 닿는지가 비중 그 자체보다 다음 해석 질문이다.",
      "positive": "실제 표현 통로가 있다면 여러 생각을 결과물로 시험하는 후보가 된다.",
      "risk": "받아들이는 사람이나 다음 경로를 보지 않으면 산출만 늘고 전달은 줄 수 있다.",
      "strengthToRisk": "활발한 산출이 편집·경청·완료를 건너뛰는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "외부에 꺼낸 결과가 자기 기준을 수정할 피드백 자료가 될 수 있다.",
      "tension": "식상생재는 목적지 재성의 연결, 식상 과다형 신약은 일간 지원 부족을 추가로 요구한다.",
      "limits": "창작 재능·자녀 수·실제 말투·행동 빈도를 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:siksang_saengjae",
        "difference": "식상 비중이 높아도 재성의 지지와 실제 식상→재성 연결이 없으면 식상생재 후보가 아니다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "outputHeavy"
      ],
      "legacyPatternCodes": [
        "OUTPUT_HEAVY"
      ],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "현실 산출의 형식·질·빈도·수용자를 별도로 확인.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論食神 / 論傷官"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:wealth_heavy",
    "targetId": "foundation:structure:wealth_heavy",
    "key": "wealth_heavy",
    "label": "재성 강함",
    "hanja": "財星偏重",
    "aliases": [
      "재성 강함"
    ],
    "family": "weight",
    "participants": {
      "tenGods": [
        "正財",
        "偏財"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "현행 구조 분석의 재성 비중이 높은 조건이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "wealth_heavy"
        }
      ]
    },
    "researchDefinition": "재성의 상대 비중이 높은 상태. 일간이 극하는 대상의 우세이며 소유 자산·부유함·재다신약과 동의어가 아니다.",
    "formation": {
      "strength": "일간 여력 없이 재성 우세의 이익을 확정하지 않음.",
      "position": "독립된 위치의 재성 및 관인으로 이어지는 경로 확인.",
      "monthCommand": "재성의 득령과 일간의 계절 지원은 별도.",
      "visibleStems": "V4 heavy는 투간·통근을 요구하며 숨은 재성 하나로 우세 확정 불가.",
      "roots": "재성 뿌리와 일간 뿌리를 같이 검토.",
      "hiddenStems": "장간 재성은 통장·부동산·배우자의 실제 존재를 뜻하지 않음.",
      "generationControl": "재극인·재생관살·식상생재는 우세 이후의 서로 다른 쓰임.",
      "additional": "실제 수입·비용·부채·운용 권한을 확인해야 현대 재물 질문으로 적용."
    },
    "counterconditions": [
      "재성 많음을 부자로 해석",
      "일간 부담과 지원 누락",
      "재성 강함을 정재형 성격으로 일괄 설명"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "정재·편재 절은 재성과 일간의 경중, 식신·관살·비겁·인성에 따른 조건 차이를 논한다. 재성량을 현금량으로 바꾸는 근거는 아니다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論正財 / 論偏財: 身財輕重"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "관리·교환해야 할 대상이 집중되는 조건이다. 정재와 편재의 서로 다른 취급 방식도 추가 확인 사항으로 남긴다.",
      "positive": "자원 접근과 판단 권한이 실제로 있다면 여러 대상의 비용과 쓰임을 비교하는 질문이 된다.",
      "risk": "대상이 많아지는 것과 내게 남는 몫이 늘어나는 것을 혼동할 수 있다.",
      "strengthToRisk": "실용을 보는 태도가 모든 선택을 회수 가능한 가치로만 평가하는 과용이 될 수 있다.",
      "weaknessToResource": "자원이 많아 보일수록 오히려 덜 맡을 대상을 정하는 선택이 중요할 수 있다.",
      "tension": "재다신약은 감당 부족, 재생관은 정관으로 가는 연결, 재성 강함은 비중의 관측이다.",
      "limits": "부유함·사업 적성·배우자 성격·재물 사건을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:jaeda_sinyak",
        "difference": "재성이 강한 것만으로 일간이 약한 것은 아니다. 재다신약에는 별도 강약 확신과 상대 부담 조건이 필요하다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "wealthHeavy"
      ],
      "legacyPatternCodes": [
        "WEALTH_HEAVY"
      ],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "실제 수입·비용·부채·운용 권한을 확인해야 현대 재물 질문으로 적용.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論正財 / 論偏財: 身財輕重"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:officer_heavy",
    "targetId": "foundation:structure:officer_heavy",
    "key": "officer_heavy",
    "label": "관성 강함",
    "hanja": "官殺偏重",
    "aliases": [
      "관성 강함"
    ],
    "family": "weight",
    "participants": {
      "tenGods": [
        "正官",
        "偏官"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "현행 구조 분석의 관성 비중이 높은 조건이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "officer_heavy"
        }
      ]
    },
    "researchDefinition": "정관·편관 가족의 상대 비중이 높은 상태. 관살혼잡이나 관인상생이 완성된 것은 아니다.",
    "formation": {
      "strength": "관성 제어를 일간이 감당하는지와 인성 지원 여부.",
      "position": "관성 독립 위치와 일간 도달·제화 경로 확인.",
      "monthCommand": "관성 득령과 실제 월령 격국을 분리.",
      "visibleStems": "한 종류 관성만 우세해도 heavy 가능. 정관·편관 모두 투출하는 혼잡과 다름.",
      "roots": "관성 뿌리와 일간 지원을 각각 확인.",
      "hiddenStems": "장간 관성의 존재가 현실 상사나 법적 지위를 특정하지 않음.",
      "generationControl": "관→인성→일간의 중개, 식상 제관살 등 다른 경로는 별도.",
      "additional": "권한·의무·평가 체계가 실제로 있는지 입력 확인."
    },
    "counterconditions": [
      "관성이 많아 출세한다고 해석",
      "비중을 관살혼잡과 혼동",
      "규정에 따른 실제 행동을 추정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "관성과 일간의 경중·지원·제화를 구별하는 논설이 있다. 정관·편관을 묶은 현행 비중 후보와 개별 격국을 동일시하지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論正官 / 論偏官: 官煞與身強弱"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "일간을 제어하는 축이 집중되는 관측이다. 어떤 기준이 누구에게 닿고 무엇이 중개하는지를 추가로 묻는다.",
      "positive": "권한과 요구가 실제로 일치하면 책임 범위를 정교하게 관리하는 질문으로 쓸 수 있다.",
      "risk": "외부 기준이 많다는 관측을 모든 기준에 복종해야 한다는 처방으로 바꾸면 안 된다.",
      "strengthToRisk": "약속을 지키는 장점이 평가에서 벗어난 선택까지 검열하는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "명확한 경계는 무한한 요구를 줄여 자율성을 늘리는 도구가 될 수 있다.",
      "tension": "관살혼잡은 두 관성의 미정리, 관성 압박형 신약은 감당 부족이라는 추가 조건이 있다.",
      "limits": "공직·성공·도덕성·범죄·부부 관계를 단정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:gwansal_honjob",
        "difference": "관성 총 비중과 정관·편관의 동시 노출·거류 문제는 다르다. 하나의 관성이 강한 경우를 혼잡으로 읽지 않는다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "officerHeavy"
      ],
      "legacyPatternCodes": [
        "OFFICER_HEAVY"
      ],
      "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
      "codeRefs": [
        "src/lib/interpretation-v4/structureRules.ts",
        "src/lib/interpretation-v4/structureEvidence.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "권한·의무·평가 체계가 실제로 있는지 입력 확인.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論正官 / 論偏官: 官煞與身強弱"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
