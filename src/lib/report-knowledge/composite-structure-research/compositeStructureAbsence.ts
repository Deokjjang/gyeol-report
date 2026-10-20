import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_ABSENCE = [
  {
    "id": "csr:profile:no_resource",
    "targetId": "foundation:structure:no_resource",
    "key": "no_resource",
    "label": "무인성",
    "hanja": "無印星觀測",
    "aliases": [
      "무인성"
    ],
    "family": "absence",
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
      "text": "확인된 원국 범위에서 인성 신호가 없는 상태를 부르는 내부 분류이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "no_resource"
        }
      ]
    },
    "researchDefinition": "확정된 네 기둥의 천간·지장간에서 인성 신호가 관찰되지 않는 범위 제한적 분류. 다른 지원 경로까지 없다는 뜻은 아니다.",
    "formation": {
      "strength": "강약과 별개. 비겁 통근 등 다른 생조가 있을 수 있음.",
      "position": "확정 네 기둥 모두를 검사해야 완전 부재라는 내부 표현 사용 가능.",
      "monthCommand": "월지의 모든 저장 천간까지 확인. 월령 인격 부재와 생활 지원 부재는 별개.",
      "visibleStems": "투간 인성이 없다는 이유만으로 무인성 확정 금지.",
      "roots": "일간 뿌리가 없는 상태와 무인성은 다름.",
      "hiddenStems": "숨은 정인·편인 하나라도 있으면 현행 부재 조건 불성립.",
      "generationControl": "인성→일간 경로가 관측되지 않는다는 한계이며 학습 불능으로 연결 불가.",
      "additional": "미상 시주는 부재 판정 금지. 실제 배움·가족 지원 정보 필요."
    },
    "counterconditions": [
      "시주 미확정",
      "인성이 장간에 존재",
      "인성 없음으로 부모·학업·지능 부재 추정"
    ],
    "traditional": [
      {
        "class": "E_UNVERIFIED",
        "text": "현재 부재 분류의 범위는 저장소에서 확인했다. 무인성이 특정 학습 방식이나 가족사를 결정한다는 전통 직접 근거는 확보하지 못했다.",
        "sourceRefs": [
          {
            "sourceId": "repo-foundation",
            "locator": "no_resource"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "기호의 부재는 특정 생조 경로를 관찰하지 못했다는 정보다. 다른 경로와 실제 학습 행동을 함께 물어야 한다.",
      "positive": "이미 쓰는 학습·지원 방식을 실제 사례로 확인하면 특정 형식에만 의존하지 않는 선택을 탐색할 수 있다.",
      "risk": "부재를 부족한 사람이라는 말로 바꾸면 관측하지 않은 능력을 평가하게 된다.",
      "strengthToRisk": "직접 해 보는 방식을 질문 후보로 쓸 수 있어도 항상 독학형이라고 고정하면 과용이다.",
      "weaknessToResource": "인성이 없는 기호 조합에서도 교육·도움을 충분히 활용하는 사람이 있을 수 있다.",
      "tension": "신약은 상대 여력이고 무인성은 특정 십성의 관측 부재로 서로 함의하지 않는다.",
      "limits": "인성의 부재만으로 학습 스타일·부모 관계·학업 성적을 말하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:resource_many",
        "difference": "확정 원국에서 0 관측과 우세 관측의 차이다. 양쪽 모두 실제 학습 능력이나 부모 지원을 측정하지 않는다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "noResource"
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
      "미상 시주는 부재 판정 금지. 실제 배움·가족 지원 정보 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "repo-foundation",
        "locator": "no_resource"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:no_output",
    "targetId": "foundation:structure:no_output",
    "key": "no_output",
    "label": "무식상",
    "hanja": "無食傷觀測",
    "aliases": [
      "무식상"
    ],
    "family": "absence",
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
      "text": "확인된 원국 범위에서 식상 신호가 없는 상태를 부르는 내부 분류이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "no_output"
        }
      ]
    },
    "researchDefinition": "확정 네 기둥 천간·지장간에서 식상 신호가 관찰되지 않는 내부 분류. 말·표현·생산·자녀의 부재가 아니다.",
    "formation": {
      "strength": "일간 강약과 별개이며 재관으로 힘을 쓰는 경로가 있을 수 있음.",
      "position": "네 기둥 전체의 천간·지장간을 검사.",
      "monthCommand": "월지 장간의 식상도 포함. 특정 월령 격국이 아닌 부재 관측.",
      "visibleStems": "투간이 없더라도 장간에 있으면 무식상 아님.",
      "roots": "일간의 뿌리나 실제 행동 능력과 식상 유무를 분리.",
      "hiddenStems": "식신·상관 장간 하나라도 있으면 현행 부재 조건 불성립.",
      "generationControl": "일간→식상의 기호 경로를 관측하지 못했다는 정보에 한정.",
      "additional": "미상 시주는 판정 금지. 표현의 실제 형식·수용자 반응 필요."
    },
    "counterconditions": [
      "시주 미확정",
      "장간 식신·상관 존재",
      "말 못함·무자녀·창작 불능으로 추론"
    ],
    "traditional": [
      {
        "class": "E_UNVERIFIED",
        "text": "현행 부재 분류만 확인했다. 무식상을 조용한 성격·행동형 표현·자녀 부재로 직접 연결하는 전거는 확보하지 못했다.",
        "sourceRefs": [
          {
            "sourceId": "repo-foundation",
            "locator": "no_output"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "출력 기호가 보이지 않는다는 사실과 사람이 실제로 표현하지 않는다는 사실은 다르다. 표현의 다른 통로를 입력으로 확인해야 한다.",
      "positive": "실제 편한 표현과 상대가 알아듣는 방식을 비교하는 질문으로만 활용할 수 있다.",
      "risk": "무식상이라는 이름이 말할 필요가 없다는 면책이나 표현 불능의 낙인이 될 수 있다.",
      "strengthToRisk": "조용한 행동을 존중하는 태도가 확인 대화를 생략하는 처방으로 확대되면 과용이다.",
      "weaknessToResource": "식상 부재 관측과 무대·글쓰기의 실제 역량은 함께 존재할 수 있다.",
      "tension": "식상 약함은 비중의 낮음이고 무식상은 확정 범위에서의 0 관측이다.",
      "limits": "표현 방식·자녀·감정 전달 능력을 단정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:output_heavy",
        "difference": "0 관측과 우세 관측은 기호 범위의 차이일 뿐 표현 능력의 양 끝이 아니다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "noOutput"
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
      "미상 시주는 판정 금지. 표현의 실제 형식·수용자 반응 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "repo-foundation",
        "locator": "no_output"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
