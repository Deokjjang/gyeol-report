import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_STRENGTH = [
  {
    "id": "csr:profile:jaeda_sinyak",
    "targetId": "foundation:structure:jaeda_sinyak",
    "key": "jaeda_sinyak",
    "label": "재다신약",
    "hanja": "財多身弱",
    "aliases": [
      "재다신약"
    ],
    "family": "strength",
    "participants": {
      "tenGods": [
        "偏財",
        "正財",
        "比肩",
        "劫財",
        "偏印",
        "正印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간의 감당 여력에 비해 재성의 부담이 두드러진다고 보는 조건부 구조이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "jaeda_sinyak"
        }
      ]
    },
    "researchDefinition": "재성의 작용을 일간이 맡아야 하는데 일간을 받치는 기반이 상대적으로 부족한 배합을 검토한다. 재성 개수와 현금 자산은 다르다.",
    "formation": {
      "strength": "일간의 생조·통근보다 재성 부담이 우세한지 교차 검토. 종재 성립은 별도 미지원.",
      "position": "재성의 자리와 일간까지의 작용 경로를 보며 먼 잠재 장간 하나로 확정하지 않는다.",
      "monthCommand": "재성이 득령했는지와 일간이 실령해도 다른 뿌리로 버티는지를 구분.",
      "visibleStems": "재성 투출과 지지 기반을 함께 확인. 투출 개수가 감당 능력 자체는 아님.",
      "roots": "비겁의 뿌리·인성의 생조가 충분하면 신약 전제부터 다시 검토.",
      "hiddenStems": "재성과 인성의 장간을 같은 개수로 단순 합산하지 않는다.",
      "generationControl": "일간→재성의 극은 일간의 힘을 쓰며, 재성이 관살을 생하면 부담 경로가 더해질 수 있음.",
      "additional": "인성의 실제 지원, 비겁의 분담, 재극인의 간섭을 구분할 전체 원국 필요."
    },
    "counterconditions": [
      "강약 경계·미상 시주로 방향 역전",
      "재성만 많고 일간도 충분히 강함",
      "실제 자산·부채 정보 없음"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "정재 절은 재다신약의 감당 문제와 인성·비겁으로 달라지는 조건을 함께 논한다. 문헌의 빈부·가족 예언은 채택하지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論正財: 財多身弱 / 印助 / 比助"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "통제해야 할 대상의 규모와 그것을 맡는 기반의 불균형이다. 재성 강함과 달리 일간 여력의 상대 조건이 필수다.",
      "positive": "실제 할 일과 자원을 나눌 수 있다면 많은 현실 과제를 선별하고 분담하는 질문으로 쓸 수 있다.",
      "risk": "지원 없이 책임 범위만 확대하면 감당 여력의 문제가 성과 평가로 가려질 수 있다.",
      "strengthToRisk": "현실적인 결과를 놓치지 않는 태도가 모든 부담을 혼자 해결하려는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "능력이 부족하다는 낙인 대신 역할·지원 규모의 불일치를 발견하는 관점으로 전환 가능하다.",
      "tension": "재성 강함은 자원 비중이고 재다신약은 그 비중과 일간 여력의 불균형이다.",
      "limits": "신약을 건강·능력·가난으로 번역하지 않는다. 도움의 실제 존재와 개인 경험은 입력 확인 사항이다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:wealth_heavy",
        "difference": "재성 강함은 가족 비중의 관측이고 재다신약은 약한 일간의 감당 부족까지 요구한다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [
        "wealthHeavyWeakDaymaster"
      ],
      "legacyPatternCodes": [
        "WEAK_DAYMASTER_WITH_STRONG_WEALTH"
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
      "인성의 실제 지원, 비겁의 분담, 재극인의 간섭을 구분할 전체 원국 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論正財: 財多身弱 / 印助 / 比助"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:singang",
    "targetId": "foundation:structure:singang",
    "key": "singang",
    "label": "신강",
    "hanja": "身強",
    "aliases": [
      "신강"
    ],
    "family": "strength",
    "participants": {
      "tenGods": [
        "比肩",
        "劫財",
        "正印",
        "偏印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "현행 일간 강약 분석에서 지원이 상대적으로 강한 쪽으로 분류한 상태이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "singang"
        }
      ]
    },
    "researchDefinition": "일간을 돕는 계절·뿌리·생조의 기세가 설기·재관의 요구에 비해 강한 상태. 인성형 지원과 비겁형 지원을 나눠 읽는다.",
    "formation": {
      "strength": "월령·통근·생조·설극을 종합. 강함을 성공률이나 체력으로 환산하지 않음.",
      "position": "년월일시의 도움과 방해를 구분하며 일간 자체를 별도 비견으로 중복 계산하지 않음.",
      "monthCommand": "득령만으로 확정 불가. 실령해도 다른 뿌리와 생조가 강하면 달라짐.",
      "visibleStems": "투간 비겁과 인성은 역할이 다르며 숫자가 많아도 무근이면 제한.",
      "roots": "일간과 같은 오행의 실질 뿌리 및 뿌리의 충·합 미해결 여부.",
      "hiddenStems": "본기·중기·여기를 구별. 장간의 단순 총량은 월령의 권한과 같지 않음.",
      "generationControl": "인성→일간의 생조와 일간→식상 설기를 분리해 여유가 쓰일 경로를 봄.",
      "additional": "종강·전왕·합화 등 특수 전제는 현행 판정에서 확정하지 않는다."
    },
    "counterconditions": [
      "월령만으로 신강 확정",
      "시주 후보가 강약을 뒤집음",
      "자립 능력·인품으로 환산"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "월령이 중요해도 다른 자리의 손익과 통근을 함께 봐야 하며, 천간 동류의 수와 지지 뿌리의 비중을 같게 보지 않는 설명이 있다.",
        "sourceRefs": [
          {
            "sourceId": "zp6",
            "locator": "論十干得時不旺失時不弱"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "지원이 많다는 관측은 지원을 무엇으로 흘려보낼지라는 질문을 만든다. 비겁 우세라면 동류, 인성 우세라면 수용 기반이라는 차이가 남는다.",
      "positive": "출력이나 책임을 실제로 맡을 조건이 있다면 자기 기반을 외부 결과에 쓰는 선택을 검토한다.",
      "risk": "지원을 더 받는 일만 반복하면 이미 있는 기반이 실행으로 이어지지 않을 수 있다.",
      "strengthToRisk": "버팀이 필요한 상황과 방향을 바꿔야 하는 상황을 구별하지 못하면 지속성이 고착으로 바뀐다.",
      "weaknessToResource": "충분한 기반은 타인의 기준을 시험해 볼 여유가 될 수 있어 강함이 곧 고집은 아니다.",
      "tension": "비겁다자는 특정 가족의 우세이고 신강은 여러 생조·소모 조건의 종합이다.",
      "limits": "자신감·독립성·건강·리더십은 확인된 성격 자료 없이 단정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:bigeop_many",
        "difference": "신강은 월령·뿌리·생조·설극의 종합이며 비겁이 우세하지 않아도 인성 지원으로 강하게 분류될 수 있다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "analyzeV4Strength와 원생 analyzeSajuStructure의 강약 결과는 서로 다른 정책이며 같은 수치·등급으로 병합하지 않음.",
      "codeRefs": [
        "src/lib/interpretation-v4/strength.ts",
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "종강·전왕·합화 등 특수 전제는 현행 판정에서 확정하지 않는다.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp6",
        "locator": "論十干得時不旺失時不弱"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:sinyak",
    "targetId": "foundation:structure:sinyak",
    "key": "sinyak",
    "label": "신약",
    "hanja": "身弱",
    "aliases": [
      "신약"
    ],
    "family": "strength",
    "participants": {
      "tenGods": [
        "比肩",
        "劫財",
        "正印",
        "偏印",
        "食神",
        "傷官",
        "偏財",
        "正財",
        "正官",
        "偏官"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "현행 일간 강약 분석에서 지원이 상대적으로 약한 쪽으로 분류한 상태이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "sinyak"
        }
      ]
    },
    "researchDefinition": "일간을 받치는 기반보다 설기·재성·관성의 상대 요구가 우세한 상태. 무엇이 약하게 만드는지에 따라 설명을 분리한다.",
    "formation": {
      "strength": "설기·재관·생조·통근의 상대 조건. 종격 여부를 일반 신약과 혼합하지 않음.",
      "position": "부담이 일간에 닿는 위치와 지원의 거리를 확인.",
      "monthCommand": "실령과 신약은 동일하지 않으며 득령해도 다른 소모가 우세할 수 있음.",
      "visibleStems": "표면의 지원과 실제 지지 기반을 구별.",
      "roots": "본기 뿌리와 잔여 뿌리를 확인하며 뿌리 하나의 존재만으로 결론내지 않음.",
      "hiddenStems": "숨은 인성과 비겁을 누락하지 않고 미상 시주에는 완전 부재를 주장하지 않음.",
      "generationControl": "식상 설기·재성에 쓰는 힘·관성 제어는 서로 다른 부담 경로.",
      "additional": "재다·식상 과다·관성 압박 중 어떤 경로인지 추가 분리 필요."
    },
    "counterconditions": [
      "실령만으로 약함 확정",
      "전체 기세가 종격 조건일 가능성",
      "건강·의지·능력 저하 단정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "쇠약하면 돕는다는 원칙에도 강약이 뒤집히는 경우와 극단 기세의 예외를 함께 논한다. 일반 부억을 모든 원국에 고정 적용하지 않는다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "衰旺論"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "약함이라는 단일 이름보다 무엇을 맡고 어떤 지원이 닿는지의 상대 관계가 해석의 중심이다.",
      "positive": "지원 경로가 실제로 있다면 부담을 줄이거나 나눌 기준을 구체화할 수 있다.",
      "risk": "신약을 무능으로 받아들이면 가능한 선택까지 미리 제한하게 된다.",
      "strengthToRisk": "도움을 구하는 전략이 판단 전부를 넘기는 의존으로 확대될 때 주의한다.",
      "weaknessToResource": "제약을 아는 태도가 업무의 범위와 협업 조건을 정교하게 만드는 자원이 될 수 있다.",
      "tension": "재다신약은 재성 경로, 식상 과다형은 설기 경로, 관성 압박형은 제어 경로다.",
      "limits": "소극적 사람·실패할 사람이라는 성격·결과 확정에 사용하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:weak_output",
        "difference": "신약은 부담 경로가 특정되지 않았고 식상 과다형 신약은 그 중 설기 우세를 추가로 관측한다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "analyzeV4Strength와 원생 analyzeSajuStructure의 강약 결과는 서로 다른 정책이며 같은 수치·등급으로 병합하지 않음.",
      "codeRefs": [
        "src/lib/interpretation-v4/strength.ts",
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "재다·식상 과다·관성 압박 중 어떤 경로인지 추가 분리 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "衰旺論"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:weak_output",
    "targetId": "foundation:structure:weak_output",
    "key": "weak_output",
    "label": "식상 과다형 신약 후보",
    "hanja": "身弱食傷偏重候補",
    "aliases": [
      "식상 과다형 신약 후보"
    ],
    "family": "strength",
    "participants": {
      "tenGods": [
        "食神",
        "傷官",
        "比肩",
        "劫財",
        "正印",
        "偏印"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간이 약하다고 분석되고 식상 발산이 두드러지는 현행 후보이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "weak_output"
        }
      ]
    },
    "researchDefinition": "현행 원생 분석이 신약과 식상 가중 문턱을 함께 관측한 후보. 전통적인 식상격 완성이나 실제 과로 진단이 아니다.",
    "formation": {
      "strength": "원생 약함 점수와 식상 가중>=1은 내부 조건. V4 계절·뿌리 판정과 별개.",
      "position": "생산 작용이 어느 기둥에 있고 지원과 이어지는지 추가 확인.",
      "monthCommand": "원생 점수는 월령 세부 기세를 완성하지 않으므로 별도 검토 필요.",
      "visibleStems": "식상 투출 여부는 원생 후보의 필수 판정에 들어 있지 않음.",
      "roots": "일간의 뿌리를 별도 V4 자료로 점검해야 한다.",
      "hiddenStems": "장간 식상과 투간 식상의 차이는 후보명만으로 알 수 없음.",
      "generationControl": "일간→식상의 설기와 식상→재성 연결 유무를 분리.",
      "additional": "현실의 산출 빈도·마감·회복 조건 없이는 생활 적용 불가."
    },
    "counterconditions": [
      "원생 신약을 V4 확신 판정으로 취급",
      "식상은 있지만 일간도 충분히 지원됨",
      "식상생재로 자동 승격"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "일간과 일간이 생하는 식상을 모자 관계로 설명하는 논설은 있으나, 이 내부 후보의 수치 문턱은 문헌 규칙이 아니다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "衰旺論 / 母子論: 日主與所生"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "밖으로 쓰는 흐름과 그것을 받치는 기반을 함께 묻는다. 출력이 많다는 관측과 실제 산출의 품질은 분리한다.",
      "positive": "범위와 주기를 조절할 상황이라면 적은 산출을 끝까지 남기는 방식으로 활용한다.",
      "risk": "할 수 있는 표현의 종류를 모두 동시에 맡으면 지원에 비해 요구가 커질 수 있다.",
      "strengthToRisk": "반응을 즉시 내는 장점이 늘 응답해야 한다는 의무로 바뀔 수 있다.",
      "weaknessToResource": "출력 제약이 선택과 편집의 기준을 세우는 계기가 될 수 있다.",
      "tension": "식상 강함에는 신약 조건이 없고 식상생재에는 재성까지의 실질 연결이 더 필요하다.",
      "limits": "체력·질환·창작 능력과 실제 번아웃 경험을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:output_heavy",
        "difference": "식상 강함은 비중, 식상 과다형 신약은 그 식상을 감당할 지원의 상대 부족이라는 조건이 더 있다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [
        "WEAK_DAYMASTER_WITH_STRONG_OUTPUT"
      ],
      "actualBehavior": "원생 analyzeSajuStructure의 제한된 점수/라벨 후보. V4 STRUCTURE_RULES에는 이 이름의 독립 판정 없음.",
      "codeRefs": [
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "현실의 산출 빈도·마감·회복 조건 없이는 생활 적용 불가.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "衰旺論 / 母子論: 日主與所生"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:weak_officer",
    "targetId": "foundation:structure:weak_officer",
    "key": "weak_officer",
    "label": "관성 압박형 신약 후보",
    "hanja": "身弱官殺偏重候補",
    "aliases": [
      "관성 압박형 신약 후보"
    ],
    "family": "strength",
    "participants": {
      "tenGods": [
        "正官",
        "偏官",
        "正印",
        "偏印",
        "比肩",
        "劫財"
      ],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "일간이 약하다고 분석되고 관성 부담이 두드러지는 현행 후보이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "weak_officer"
        }
      ]
    },
    "researchDefinition": "원생 약함 점수와 관성 가중>=0.8이 함께 나타나는 내부 후보. 정관·편관의 성립과 제화는 별도다.",
    "formation": {
      "strength": "원생 약함 점수와 관성 가중은 보수적 후보이며 고전 성립식이 아님.",
      "position": "관성이 일간을 제어하는 자리 및 인성의 중개 가능성을 구분.",
      "monthCommand": "관성이 득령한지와 일간의 계절 지원을 후보 바깥에서 확인.",
      "visibleStems": "정관·편관 투출을 구분. 관성 묶음만으로 혼잡 확정 금지.",
      "roots": "일간과 인성의 뿌리 유무를 따로 확인.",
      "hiddenStems": "숨은 관성과 노출 관성의 상대 작용을 동일시하지 않음.",
      "generationControl": "관성→인성→일간과 식상제살 경로에 따라 단순 압박 설명이 제한됨.",
      "additional": "현실 역할·평가 기준·권한·지원의 실제 자료 필요."
    },
    "counterconditions": [
      "관성 존재를 피해 경험으로 번역",
      "인성 생조가 충분한데 압박만 강조",
      "정관과 편관 모두 있다고 자동 혼잡"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "편관 절은 일간·살의 상대 기세, 인성의 화와 식신의 제어에 따라 해석을 달리한다. 원생 관성 합계와는 범위가 다르다.",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論偏官: 身強煞弱 / 身弱煞強 / 印助化"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "외부 기준이 존재하는 것보다 그것을 감당할 지원 경로와 권한이 충분한지가 쟁점이다.",
      "positive": "역할을 조절할 수 있다면 책임 범위와 배울 지원을 함께 명시하는 데 쓸 수 있다.",
      "risk": "평가 기준을 자기 가치 전체로 받아들이면 역할 한계와 개인 능력을 혼동하기 쉽다.",
      "strengthToRisk": "성실한 대응이 모든 요구를 거절하지 못하는 방식으로 과용될 수 있다.",
      "weaknessToResource": "요구의 무게를 감지하는 태도는 부당하거나 모순된 기준을 빨리 확인하는 질문이 될 수 있다.",
      "tension": "관인·살인상생은 중개 경로를 확인하지만 이 후보는 부담과 지원의 상대 부족을 먼저 본다.",
      "limits": "학대·권력 피해·불안 장애·실제 직장 경험을 추정하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:salin_sangsaeng",
        "difference": "관성 압박형은 지원 대비 부담 후보, 살인상생은 편관→인성→일간의 중개 경로를 확인하는 구조다."
      }
    ],
    "support": {
      "classification": "A_DETECTED_CANDIDATE",
      "lineageOrDefinitionVaries": false,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [
        "WEAK_DAYMASTER_WITH_STRONG_OFFICER"
      ],
      "actualBehavior": "원생 analyzeSajuStructure의 제한된 점수/라벨 후보. V4 STRUCTURE_RULES에는 이 이름의 독립 판정 없음.",
      "codeRefs": [
        "src/lib/saju/structureAnalysis.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "현실 역할·평가 기준·권한·지원의 실제 자료 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "sm5",
        "locator": "論偏官: 身強煞弱 / 身弱煞強 / 印助化"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
