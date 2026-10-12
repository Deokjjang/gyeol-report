import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_TENSION = [
  {
    "id": "csr:profile:sanggwan_gyeongwan",
    "targetId": "foundation:structure:sanggwan_gyeongwan",
    "key": "sanggwan_gyeongwan",
    "label": "상관견관",
    "hanja": "傷官見官",
    "aliases": [
      "상관견관"
    ],
    "family": "tension",
    "participants": {
      "tenGods": [
        "傷官",
        "正官",
        "正印",
        "偏印",
        "正財",
        "偏財"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "상관의 제어가 정관에 닿는 조건을 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "sanggwan_gyeongwan"
        }
      ]
    },
    "researchDefinition": "상관이 정관을 제어하는 실제 경로를 살피는 긴장. 상관과 정관의 공존, 일반 관살 압박과는 구별한다.",
    "formation": {
      "strength": "상관·정관·일간의 상대 기세와 무엇을 쓰는지를 검토.",
      "position": "V4는 인접 투간 사이의 실제 상극 쌍을 요구. 숨은 공존만으로 확정하지 않음.",
      "monthCommand": "월령·한난의 예외가 있어 정관이 나타났다고 일률적 흉으로 보지 않음.",
      "visibleStems": "양 군의 노출과 지지 기반이 있어야 현행 긴장 후보.",
      "roots": "정관·상관의 뿌리와 인성·재성의 중개를 확인.",
      "hiddenStems": "장간의 상관과 천간 정관은 작용 경로가 확인되기 전 공존 관측에 한정.",
      "generationControl": "상관극관, 인성제상관, 상관생재→재생관은 서로 다른 경로.",
      "additional": "현실의 규칙·비판 방식·개선 권한을 확인해 생활 후보로 한정."
    },
    "counterconditions": [
      "실제 노출 상극 경로 없음",
      "인성·재성의 충분한 중개",
      "금수 상관의 조후 예외를 무시"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "상관견관의 일반적 경계와 금수 조합의 기후 조건에 따른 예외를 함께 설명한다. 계절과 배치를 보지 않은 일률적 금기는 부적절하다.",
        "sourceRefs": [
          {
            "sourceId": "zp14",
            "locator": "論用神配氣候得失: 金水傷官例外"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "자신이 만든 표현·수정 요구가 기존의 정관 기준을 건드리는 관계다. 비판 능력 자체보다 무엇을 어떻게 바꿀지에 관한 긴장이다.",
      "positive": "수정 권한과 전달 통로가 있다면 규칙의 모순을 구체적인 개선안으로 옮길 질문이 된다.",
      "risk": "정당한 지적도 기존 책임의 목적을 듣지 않으면 의사소통 충돌이 생길 수 있다.",
      "strengthToRisk": "기준의 빈틈을 보는 힘이 모든 합의를 논파해야 한다는 방식으로 과용될 수 있다.",
      "weaknessToResource": "서로 다른 기준을 드러내는 대화가 검증 절차를 명확히 하는 자원이 될 수 있다.",
      "tension": "관살혼잡은 두 제어 방식의 혼재, 상관견관은 출력이 정관을 제어하는 경로다.",
      "limits": "법적 분쟁·실직·배우자 갈등·반항적 인격을 예언하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:gwansal_honjob",
        "difference": "상관견관은 상관이 정관을 제어하는 경로이고 관살혼잡은 정관·편관이라는 두 제어 방식의 미정리다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "hurtingOfficerMeetsOfficer"
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
      "현실의 규칙·비판 방식·개선 권한을 확인해 생활 후보로 한정.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp14",
        "locator": "論用神配氣候得失: 金水傷官例外"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:gwansal_honjob",
    "targetId": "foundation:structure:gwansal_honjob",
    "key": "gwansal_honjob",
    "label": "관살혼잡",
    "hanja": "官殺混雜",
    "aliases": [
      "관살혼잡"
    ],
    "family": "tension",
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
      "text": "정관과 편관이 함께 나타나는 상태. 서로 섞였다는 사실만으로 흉하게 보지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "gwansal_honjob"
        }
      ]
    },
    "researchDefinition": "정관과 편관이 섞여 작용하는지를 보는 구조. 둘의 존재와 쓰임의 정리 여부를 구별하며 공존만으로 부정 판정하지 않는다.",
    "formation": {
      "strength": "관살·일간·지원의 상대 기세. 관과 살의 많고 적음만으로 판단하지 않음.",
      "position": "V4는 다른 천간에 노출된 정관·편관과 각자의 지지 기반을 요구.",
      "monthCommand": "월령의 주된 관살과 다른 자리의 개입을 구분.",
      "visibleStems": "둘 다 투출해야 현행 후보. 장간 공존과는 다름.",
      "roots": "양쪽의 뿌리 및 일간 감당 여력을 확인.",
      "hiddenStems": "월지에 감춰진 관살과 표면 투간의 제거·존치 조건은 문헌에서 다르게 설명됨.",
      "generationControl": "합·제·인성·식상으로 어느 경로가 정리되는지 검토. V4는 강한 중개 시 불확실로 억제.",
      "additional": "현실의 여러 요구가 실제로 모순되는지 확인하지 않고 이중 압박을 단정하지 않음."
    },
    "counterconditions": [
      "둘 다 노출·통근하지 않음",
      "제화·거류로 역할이 정리됨",
      "두 요구가 공존한다는 이유로 악성 판정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "관살의 경중·노출·월령·거류에 따라 관살을 취하고 남기는 논설이 있다. 혼재의 이름만으로 사람이나 삶을 흉하게 읽지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論偏官: 去官留煞 / 去煞留官 / 去留不清"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "같은 제어 가족 안에서도 안정된 기준과 강한 제약의 두 쓰임을 구별한다. 중요한 것은 요구 개수보다 서로 양립 가능한지다.",
      "positive": "조건과 우선순위를 정할 권한이 있다면 다른 요구를 구분하고 대응 기준을 세우는 후보다.",
      "risk": "서로 다른 요구를 모두 최우선으로 받으면 무엇을 충족했는지 판단하기 어려워질 수 있다.",
      "strengthToRisk": "여러 기준을 감지하는 강점이 상황마다 자기 기준까지 바꾸는 방식으로 과용될 수 있다.",
      "weaknessToResource": "모순을 알아차리는 태도는 지시와 평가의 책임자를 분명하게 만드는 자원이 될 수 있다.",
      "tension": "관성 강함은 관살 가족의 비중, 혼잡은 정관·편관의 역할 미정리다.",
      "limits": "부정직·복수 연애·권력욕·관재수 같은 도덕·사건 판정에 사용하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:officer_heavy",
        "difference": "관성 우세는 한 종류만 강해도 가능하지만 V4 혼잡 후보는 정관·편관 둘 다 노출·기반을 갖추어야 한다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "mixedOfficers"
      ],
      "legacyPatternCodes": [
        "MIXED_OFFICER_KILLING"
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
      "현실의 여러 요구가 실제로 모순되는지 확인하지 않고 이중 압박을 단정하지 않음.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論偏官: 去官留煞 / 去煞留官 / 去留不清"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
