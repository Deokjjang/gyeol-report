import type { CompositeProfile } from "./compositeStructureTypes";

// Offline research only; no runtime connection or customer application approval.
export const COMPOSITE_PRINCIPLE = [
  {
    "id": "csr:profile:season_command",
    "targetId": "foundation:structure:season_command",
    "key": "season_command",
    "label": "월령",
    "hanja": "月令",
    "aliases": [
      "월령"
    ],
    "family": "principle",
    "participants": {
      "tenGods": [],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "태어난 달의 지지가 나타내는 계절의 힘을 중요한 해석 조건으로 보는 관점이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "season_command"
        }
      ]
    },
    "researchDefinition": "태어난 절기 월의 지지가 대표하는 계절 권한과 그 안의 인원 작용을 검토하는 판단 조건. 독립 성격형이 아니다.",
    "formation": {
      "strength": "득령은 강약의 한 조건이며 득령=신강 공식은 아님.",
      "position": "월지의 계절 역할을 년지·일지·시지의 위치 의미와 구별.",
      "monthCommand": "절기 월지와 실제 출생 월 경계가 확정되어야 함. 사령 일수 계보는 별도.",
      "visibleStems": "월지 장간의 투출과 다른 자리 투간을 구별.",
      "roots": "월령의 지지 기반과 다른 뿌리의 손익을 함께 봄.",
      "hiddenStems": "저장 장간의 고정 weight를 사령 일수로 바꾸지 않음.",
      "generationControl": "월령의 주된 기세가 원국 생조·설극에 미치는 조건을 검토.",
      "additional": "계보별 사령표·격국 취용 기준을 선택하지 않은 상태에서는 완전한 월령 취용 판정 불가."
    },
    "counterconditions": [
      "달력 숫자 월과 절기 월 혼동",
      "고정 장간 가중치를 실제 사령비로 환산",
      "월령 하나로 성격·강약 확정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "월령을 제강으로, 월지 속 인원의 작용을 취용의 조건으로 설명한다. 해당 일수 논설은 현재 고정 저장 가중치와 같은 자료가 아니다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "月令論"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "같은 요소도 어떤 계절 권한 안에 놓이는지에 따라 쓰임의 조건이 달라진다. 요소 개수에 환경 조건을 추가하는 판단 원리다.",
      "positive": "계절과 전체 배합을 확인하면 표면 비중만으로 내린 결론을 다시 점검할 수 있다.",
      "risk": "월령에 절대 권한을 주면 다른 자리의 뿌리와 실제 생극을 놓칠 수 있다.",
      "strengthToRisk": "중요한 기준을 세우는 일이 하나의 기준으로 모든 차이를 지우는 과용이 될 수 있다.",
      "weaknessToResource": "실령한 요소라도 뿌리와 생조가 있으면 충분히 쓰일 가능성이 있어 낮은 계절 권한이 곧 무능은 아니다.",
      "tension": "부억은 여력 조절, 한난·조습은 작용 환경, 월령은 계절의 권한이라는 판단 목적 차이.",
      "limits": "8분야의 직접 성향이 아니라 다른 해석의 적용 조건이다. 생활 응용은 추가 십성·맥락 없이는 보류."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:support_restraint",
        "difference": "월령은 계절 권한을 읽는 조건, 부억은 선택한 작용을 돕고 덜어내는 조절 목적이다."
      }
    ],
    "support": {
      "classification": "B_FACTS_NO_V4_DETECTOR",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음.",
      "codeRefs": [
        "src/lib/saju/constants.ts",
        "src/lib/saju/types.ts",
        "src/lib/interpretation-v4/strength.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "계보별 사령표·격국 취용 기준을 선택하지 않은 상태에서는 완전한 월령 취용 판정 불가.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "月令論"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:support_restraint",
    "targetId": "foundation:structure:support_restraint",
    "key": "support_restraint",
    "label": "부억",
    "hanja": "扶抑",
    "aliases": [
      "부억"
    ],
    "family": "principle",
    "participants": {
      "tenGods": [],
      "elements": [],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "약한 것을 돕고 강한 것을 덜어내는 원칙을 쓰되 전체 기세에 따라 예외를 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "support_restraint"
        }
      ]
    },
    "researchDefinition": "일간 또는 선택한 작용의 과다·부족을 돕고 덜어내는 조절 관점. 월령 격국의 용신 개념과 자동 병합하지 않는다.",
    "formation": {
      "strength": "무엇을 강약의 기준으로 삼는지와 종격 등 예외부터 확인.",
      "position": "지원·설기·제어가 실제 닿는 위치를 확인.",
      "monthCommand": "월령과 전체 기세를 함께 봄. 계절 하나로 약한 쪽 보충을 처방하지 않음.",
      "visibleStems": "투간된 도움과 잠재 도움의 실제 쓰임을 분리.",
      "roots": "유효한 뿌리와 충합 미해결을 검토.",
      "hiddenStems": "인성·비겁·설극의 장간을 누락하지 않음.",
      "generationControl": "생조·설기·극·재성에 쓰는 힘의 관계를 구별하며 모든 극을 해롭다고 보지 않음.",
      "additional": "신강/신약 판정과 취용 원리는 별도. 현행은 완전한 용신·종격을 지원하지 않음."
    },
    "counterconditions": [
      "극단 기세의 예외 무시",
      "개수 적은 오행을 무조건 보충",
      "부억 용신과 격국 용신의 같은 이름을 자동 병합"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "왕하면 덜고 쇠하면 돕는 일반 원칙과 그 방향을 뒤집을 수 있는 예외를 함께 논한다. 기계적인 균등화와 다르다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "衰旺論 / 中和論"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "조절 대상과 방법을 분리한다. 지원을 더할 때와 이미 있는 힘을 밖으로 쓸 때가 달라 같은 보완 문구로 처리할 수 없다.",
      "positive": "적용 대상과 예외를 확인하면 무엇을 더하거나 줄일지 판단하는 조건을 명료하게 할 수 있다.",
      "risk": "균형을 모든 요소의 같은 개수로 이해하면 실제 쓰임을 훼손할 수 있다.",
      "strengthToRisk": "약점을 돕는 장점이 강한 작용의 쓸모까지 줄이는 과용으로 바뀔 수 있다.",
      "weaknessToResource": "많은 요소를 없애는 대신 흘려보낼 경로를 찾는 것이 조절일 수 있다.",
      "tension": "통관은 두 작용 사이 연결, 부억은 선택한 작용의 여력 조절이다. 조후와 판단 목적도 다르다.",
      "limits": "생활 습관·직업 적합·재무 비중의 균등 처방으로 직접 사용하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:mediation",
        "difference": "부억은 여력의 증감, 통관은 제어 관계 사이의 생조 연결과 방해 해소를 묻는다."
      }
    ],
    "support": {
      "classification": "C_KNOWLEDGE_ONLY",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 지식 정의만 있고 완전한 성립·취용 판정 미지원.",
      "codeRefs": [
        "src/lib/saju/constants.ts",
        "src/lib/saju/types.ts",
        "src/lib/interpretation-v4/strength.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "신강/신약 판정과 취용 원리는 별도. 현행은 완전한 용신·종격을 지원하지 않음.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "衰旺論 / 中和論"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:temperature",
    "targetId": "foundation:structure:temperature",
    "key": "temperature",
    "label": "한난",
    "hanja": "寒暖",
    "aliases": [
      "한난"
    ],
    "family": "principle",
    "participants": {
      "tenGods": [],
      "elements": [
        "木",
        "火",
        "土",
        "金",
        "水"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "원국의 차고 따뜻한 조건이 오행의 작용에 미치는 차이를 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "temperature"
        }
      ]
    },
    "researchDefinition": "원국의 계절과 배합에서 차고 따뜻한 작용 환경을 살피는 논법. 실제 기온·체온·따뜻한 성격을 측정한 값이 아니다.",
    "formation": {
      "strength": "강약과 한난은 다르며 강한 기세라도 작용 환경은 제한될 수 있음.",
      "position": "한난을 만드는 간지의 위치와 연결을 함께 검토.",
      "monthCommand": "겨울·여름이라는 계절만으로 온도 결론을 고정하지 않음.",
      "visibleStems": "화·수 투출의 작용을 일간·전체 배합에 비추어 확인.",
      "roots": "화의 뿌리·수의 기반 등 작용 지속 조건 필요.",
      "hiddenStems": "숨은 화·수·토를 누락하지 않되 실제 온도 숫자로 만들지 않음.",
      "generationControl": "같은 생조 관계도 한난 조건에서 달리 읽는 전통 논설을 별도 계보로 보존.",
      "additional": "조후 판단 기준·예외를 승인한 독립 detector 없음."
    },
    "counterconditions": [
      "추운 계절을 냉정한 사람으로 환산",
      "화 존재만으로 온난 완성",
      "건강·거주·직업 처방"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "월령 격국과 기후를 함께 보는 설명에서 같은 관인·식상 배합도 겨울 목과 여름 목 등에서 쓰임을 달리한다.",
        "sourceRefs": [
          {
            "sourceId": "zp14",
            "locator": "論用神配氣候得失"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "관계가 있다는 것과 그 관계가 작용할 환경이 갖춰졌다는 것은 다르다. 한난은 이 환경을 검토하는 축이다.",
      "positive": "표면의 상생만으로 유리함을 선언하기 전에 작용 조건을 다시 묻게 한다.",
      "risk": "추위·온기의 비유를 사람의 감정이나 체질로 옮기면 출처가 없는 성격·건강 해석이 된다.",
      "strengthToRisk": "온기를 더하는 한 방향 처방은 이미 더운 배합에서 반대의 문제가 될 수 있다.",
      "weaknessToResource": "한난의 조절은 단순한 생조를 덜어내는 방향일 수도 있어 강약 보완과 다를 수 있다.",
      "tension": "조습은 건조·습윤 조건이며 한난과 상관이 있어도 동일 축은 아니다.",
      "limits": "8분야 모두 한난만의 직접 생활 특성은 미승인. 다른 검증된 구조의 조건으로만 연구."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:moisture",
        "difference": "한난은 차고 따뜻한 작용 환경, 조습은 건조·습윤 조건이다. 한습·조열처럼 교차할 수 있어 동일 축이 아니다."
      }
    ],
    "support": {
      "classification": "C_KNOWLEDGE_ONLY",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 지식 정의만 있고 완전한 성립·취용 판정 미지원.",
      "codeRefs": [
        "src/lib/saju/constants.ts",
        "src/lib/saju/types.ts",
        "src/lib/interpretation-v4/strength.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "조후 판단 기준·예외를 승인한 독립 detector 없음.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "zp14",
        "locator": "論用神配氣候得失"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:moisture",
    "targetId": "foundation:structure:moisture",
    "key": "moisture",
    "label": "조습",
    "hanja": "燥濕",
    "aliases": [
      "조습"
    ],
    "family": "principle",
    "participants": {
      "tenGods": [],
      "elements": [
        "木",
        "火",
        "土",
        "金",
        "水"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "원국의 건조함과 습함이 오행의 쓰임에 미치는 조건을 살피는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "moisture"
        }
      ]
    },
    "researchDefinition": "원국의 건조·습윤 배합이 각 오행의 쓰임에 주는 조건을 살피는 관점. 실제 습도·피부·감정량의 지표가 아니다.",
    "formation": {
      "strength": "과도·부족을 무엇의 쓰임에 비추어 말하는지 확인.",
      "position": "조·습을 만드는 간지의 연결과 전체 배합을 검토.",
      "monthCommand": "계절에 더해 토의 성질·화수 배합을 확인.",
      "visibleStems": "투간 화·수만으로 조습 완성 판정하지 않음.",
      "roots": "작용할 뿌리와 이를 받는 오행의 조건 필요.",
      "hiddenStems": "辰丑·戌未의 저장 성질을 단일 토 개수로 지우지 않음.",
      "generationControl": "생조가 많아도 지나친 습·조로 쓰임이 달라질 수 있다는 논설.",
      "additional": "독립 조습 수치·임계·용신 판정 미지원. 한난과 교차 검토 필요."
    },
    "counterconditions": [
      "건조함을 매정함·습함을 감정 과잉으로 환산",
      "토 네 종류를 동일 조건으로 취급",
      "실제 질환·피부 상태 추정"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "이 전사본은 조습을 독립 燥濕論 제목이 아니라 한난론 안의 단락으로 다룬다. 과도한 건습과 일부 배합의 예외를 설명한다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "寒暖論 안의 地道有燥濕 단락"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "같은 오행 지원이라도 받는 환경이 지나치면 작용이 제한된다는 조건이다. 물을 더하는 처방 자체가 정답은 아니다.",
      "positive": "관계가 실제로 작용하는 데 필요한 환경과 예외를 기록하게 한다.",
      "risk": "조습 비유를 감정이나 신체의 건조·습윤으로 직접 읽으면 범위를 넘는다.",
      "strengthToRisk": "보완하려고 더하는 자원이 이미 과한 조건을 강화할 수 있다.",
      "weaknessToResource": "부족해 보이는 오행을 더하지 않는 것이 다른 배합의 작용을 보전할 수 있다.",
      "tension": "한난과 달리 건습 조건이며 수다목부·토다매금의 성립 검토에 쓰이지만 그 이름과 같지 않다.",
      "limits": "기존 dt 燥濕論 locator는 이 판본의 실제 제목과 불일치한다. 이전 파일은 보존하고 충돌로 기록."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:temperature",
        "difference": "습함이 언제나 차가움, 건조함이 언제나 따뜻함은 아니다. 조습과 한난의 교차 조건을 따로 기록해야 한다."
      }
    ],
    "support": {
      "classification": "C_KNOWLEDGE_ONLY",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 지식 정의만 있고 완전한 성립·취용 판정 미지원.",
      "codeRefs": [
        "src/lib/saju/constants.ts",
        "src/lib/saju/types.ts",
        "src/lib/interpretation-v4/strength.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "독립 조습 수치·임계·용신 판정 미지원. 한난과 교차 검토 필요.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "寒暖論 안의 地道有燥濕 단락"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  },
  {
    "id": "csr:profile:mediation",
    "targetId": "foundation:structure:mediation",
    "key": "mediation",
    "label": "통관",
    "hanja": "通關",
    "aliases": [
      "통관"
    ],
    "family": "principle",
    "participants": {
      "tenGods": [],
      "elements": [
        "木",
        "火",
        "土",
        "金",
        "水"
      ],
      "natalScope": "일간을 기준으로 한 확정 원국. 대운·세운의 요소를 혼입하지 않는다."
    },
    "existingDefinition": {
      "class": "B_REPOSITORY",
      "text": "서로 제어하는 두 기운 사이에 생조의 연결을 살피고 그 연결의 방해 조건도 함께 보는 논법이다.",
      "sourceRefs": [
        {
          "sourceId": "repo-foundation",
          "locator": "mediation"
        }
      ]
    },
    "researchDefinition": "서로 제어하는 작용 사이에 생조의 연결을 두고 간격·방해를 해소할 수 있는지 살피는 논법. 중간 오행의 존재만으로 성립하지 않는다.",
    "formation": {
      "strength": "양쪽과 중간 작용의 상대 기세가 연결을 감당하는지 확인.",
      "position": "중간 오행이 양쪽에 실제 닿는 경로 필요. 떨어진 공존은 부족.",
      "monthCommand": "중개 오행의 계절 권한·필요성을 검토.",
      "visibleStems": "중간 기운의 투출과 기반을 함께 검토.",
      "roots": "중개자의 통근·손상·합충 미해결 확인.",
      "hiddenStems": "장간 하나의 존재를 실제 중개 기능으로 자동 승격하지 않음.",
      "generationControl": "木→火→土, 火→土→金, 土→金→水, 金→水→木, 水→木→火의 조건부 연결 설명.",
      "additional": "현재 특정 흐름 rule은 있으나 범용 통관 성립 detector는 없음. 관계 재계산 금지."
    },
    "counterconditions": [
      "중간 오행만 있다고 통관 확정",
      "상극 대상을 잘못 연결",
      "충합이 있다고 자동 해소 주장"
    ],
    "traditional": [
      {
        "class": "A_TEXT_CHECKED",
        "text": "두 작용 사이의 간격과 방해를 구별하며 중간의 생조뿐 아니라 방해가 해소되는 조건까지 설명한다.",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "通隔論"
          }
        ]
      }
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "강한 쪽을 없애는 조절과 달리 사이를 연결하여 서로의 작용이 전달될 조건을 묻는다.",
      "positive": "확인된 연결과 방해 조건을 기록하면 공존을 실제 흐름으로 과장하는 오류를 줄일 수 있다.",
      "risk": "중간 자원 하나를 모든 갈등의 해결책으로 읽으면 연결 실패의 조건을 놓친다.",
      "strengthToRisk": "중개를 계속 더하는 것이 필요한 경계 설정을 미루는 방식으로 과용될 수 있다.",
      "weaknessToResource": "긴장이 남더라도 다른 통로가 열려 작용 방향이 달라질 수 있으나 실제 관계 확인이 선행되어야 한다.",
      "tension": "관인상생·살인상생은 특정 십성 흐름이고 통관은 일반 연결 원리다. 같은 사례라도 판단 대상이 다르다.",
      "limits": "상담 능력·화해 결과·분쟁 해소·인간관계 성공을 직접 예측하지 않는다."
    },
    "distinctions": [
      {
        "otherTargetId": "foundation:structure:officer_resource",
        "difference": "통관은 일반적인 연결 원리, 관인상생은 정관→인성→일간이라는 특정 십성 경로다. 특정 후보를 범용 통관 판정으로 승격하지 않는다."
      }
    ],
    "support": {
      "classification": "C_KNOWLEDGE_ONLY",
      "lineageOrDefinitionVaries": true,
      "insufficientForTraditionalFormation": true,
      "v4RuleIds": [],
      "legacyPatternCodes": [],
      "actualBehavior": "기존 지식 정의만 있고 완전한 성립·취용 판정 미지원.",
      "codeRefs": [
        "src/lib/saju/constants.ts",
        "src/lib/saju/types.ts",
        "src/lib/interpretation-v4/strength.ts"
      ],
      "runtimeEvidenceIds": []
    },
    "handoff": [
      "연구 ID는 계산 Evidence ID가 아님. 승인된 기존 계산 provenance와 참여 위치를 별도 연결할 것.",
      "현재 특정 흐름 rule은 있으나 범용 통관 성립 detector는 없음. 관계 재계산 금지.",
      "전통 계보와 현대 예시를 구별하고 실제 입력의 맥락·반례를 확인할 것.",
      "미상 시주·경계 강약·합충 미해결은 범위를 축소하거나 적용을 보류할 것."
    ],
    "sourceRefs": [
      {
        "sourceId": "dt",
        "locator": "通隔論"
      },
      {
        "sourceId": "authored",
        "locator": "조건부 구조 연구; 경험적 검증 아님"
      }
    ],
    "connectedToRuntime": false
  }
] as const satisfies readonly CompositeProfile[];
