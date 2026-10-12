import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_PA = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:pa",
    "key": "pa",
    "targetId": "foundation:relation:pa",
    "label": "지지 파",
    "hanja": "地支破",
    "aliases": [
      "지지 파",
      "파",
      "육파",
      "六破"
    ],
    "existingDefinition": "기존 관계 의미 레지스트리에 있는 파 관계 분류다.",
    "definition": "현행 기간 계산은 子酉·丑辰·寅亥·卯午·巳申·未戌의 여섯 쌍을 파로 판정한다. 직접 고전 기원과 조합별 독립 사건 의미는 미확인이다.",
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "현대 제공자의6쌍·육합과의 겹침·이견은 확인했다. 고전에서 破라는 일반 표현이 보인다는 사실만으로 현재 六破 표 전체의 출처를 확정하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "formation": {
      "membership": "현행 육파6쌍의 실제 두 글자.",
      "direction": "현행 검출은 양방향 대칭이다. 한쪽이 상대를 파한다는 다른 설명은 자동 병합하지 않는다.",
      "positions": "기간 쌍 producer와 원국 원생 미지원·궁합 미지원을 구별한다.",
      "season": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다.",
      "multiple": "같은 쌍이 합·형에도 속하는지 확인한다.",
      "operation": "파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다."
    },
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "寅亥·巳申의 합과 파를 시작은 좋고 끝은 반드시 나쁘다는 시간 순서로 바꾸는 경우.",
      "고전의 破字 일반 용례를 현행 표의 확정 전거로 사용하는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "파 연구는 어떤 배합·기존 유지 조건이 달라지는지 확인하는 문제다. 관계별 임의의 감정·사건 의미를 만들기보다 겹침과 다른 생극을 검토한다.",
      "positive": "실제로 유지에 문제가 있는 방식이라면 전체 파괴보다 수정 가능한 연결부를 찾는 질문으로 활용할 수 있다.",
      "risk": "현실의 경미한 차이를 관계 붕괴나 손실로 과대 해석할 수 있다.",
      "excess": "수정한다는 명분으로 계속 바꾸면 검증할 기준과 안정된 운영이 사라질 수 있다.",
      "reversal": "낡은 절차의 수정이 도움 될 수 있지만 파 자체가 혁신 재능이라는 뜻은 아니다.",
      "mitigation": "실제 유지 문제와 변경 비용을 확인하며 고전 계보·독립 작용의 미확정 상태를 유지한다.",
      "coOccurrence": "합·형과 겹치는 짝은 하나의 실제 조합에 여러 분류가 붙은 것이다. 독립 사건의 시간 순서를 생성하지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "chung",
        "difference": "대향 충과 다른 여섯 조합이며 강도가 약하다는 현대 견해는 계산된 수치가 아니다."
      },
      {
        "other": "yukhap",
        "difference": "寅亥·巳申의 겹침은 합의 취소 또는 파의 자동 승리를 뜻하지 않는다."
      }
    ],
    "lineage": [
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다."
    ],
    "safety": [
      "성공·재물 증가·혼인·이별·사고·질병·외도·법적 처벌·과거 사건을 확정하지 않는다.",
      "미상 시주를 보충하지 않으며 확인하지 못한 관계의 부재도 확정하지 않는다.",
      "두 사람의 관계는 한 사람의 타고난 성향이 아니며 기간 관계는 적용 구간 밖으로 확장하지 않는다."
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "handoff": [
      "실제 producer·참여 기둥·간지·성립 상태·출처를 확인한다.",
      "학설·작용 조건·다른 관계·실제 분야 맥락을 대조한다.",
      "연구 ID를 계산 Evidence ID로 변환하거나 점수에 자동 더하지 않는다."
    ],
    "producerScopeRefs": [
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": [
      "natal",
      "cross_person"
    ]
  }
] as const satisfies readonly RelationProfile[];
