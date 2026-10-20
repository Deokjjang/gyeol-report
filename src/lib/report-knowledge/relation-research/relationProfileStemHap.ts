import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_STEM_HAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:stem_hap",
    "key": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "label": "천간합",
    "hanja": "天干合",
    "aliases": [
      "천간합",
      "십간합",
      "오합"
    ],
    "existingDefinition": "두 천간의 배합을 논하는 분류. 합의 존재와 합화 성립은 구분한다.",
    "definition": "서로 다른 오행의 음양 천간이 정해진 다섯 쌍으로 만나는 배합이다. 쌍의 존재, 서로 묶이는 작용, 화기 성립은 별개의 판단이다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회는 5쌍의 이름과 음양 배합을 서술하고, 힘의 불균형·중복 합·화기 조건을 별도로 논한다. 성별 도덕 평가나 혼인 예언은 역사적 서술의 존재만 기록하고 채택하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "formation": {
      "membership": "甲己·乙庚·丙辛·丁壬·戊癸의 실제 두 천간이 필요하다. 지장간끼리의 암합으로 확장하지 않는다.",
      "direction": "쌍 일치는 대칭이나 일간에서 본 십성 역할은 방향에 따라 다르다.",
      "positions": "원생 함수는 거리와 무관하게 6기둥쌍을 검사한다. 자평진전의 격간·원거리·쟁합 논의는 별도 작용 조건이다.",
      "season": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다.",
      "multiple": "2대1의 쟁합을 단일 1대1 배합과 같게 읽지 않는다.",
      "operation": "합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다."
    },
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "겉 천간 합으로 지장간·합화·인물의 사랑을 확정하는 경우.",
      "멀리 떨어진 천간의 표 일치를 강한 실제 작용으로 동일시하는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "상생·상극만으로 읽던 두 오행에 배합에 의한 작용의 얽힘이라는 검토 변수가 더해진다. 누구의 십성이 묶이는지 확인하지 않으면 합의 이득을 정할 수 없다.",
      "positive": "방해가 되는 작용이 다른 배합으로 완화되는 조건을 검토할 수 있다. 현실에서는 협의가 실제 양쪽의 부담을 줄이는지 질문한다.",
      "risk": "필요한 작용도 묶일 수 있으므로 맞추는 행위 자체를 유리하다고 고정하지 않는다.",
      "excess": "여러 요구를 동시에 맞추려는 상황이 실제로 있다면 양보의 책임 소재가 사라질 수 있다. 쟁합을 외도로 읽지 않는다.",
      "reversal": "합하지 못함이 필요한 기능을 보존할 수 있고, 순조로운 합이 필요한 독립성을 줄일 수도 있다.",
      "mitigation": "자평진전 五의 격간·원거리·합일류일·일간 본신합을 서로 다른 조건으로 검토한다.",
      "coOccurrence": "충·쟁합이 함께 있으면 실제 기둥과 위치를 남긴다. 합이라는 이유만으로 다른 관계를 삭제하지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "yukhap",
        "difference": "천간의 노출된 작용 배합과 지지의 정해진 짝은 대상 층위가 다르다."
      },
      {
        "other": "banhap",
        "difference": "자평진전의 원거리 천간 半合 표현을 지지 반합 ID와 합치지 않는다."
      }
    ],
    "lineage": [
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다."
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
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ]
  }
] as const satisfies readonly RelationProfile[];
