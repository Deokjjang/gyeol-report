import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_WONJIN = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:wonjin",
    "key": "wonjin",
    "targetId": "foundation:relation:wonjin",
    "label": "원진 관계",
    "hanja": "怨嗔",
    "aliases": [
      "원진 관계",
      "원진",
      "怨嗔煞"
    ],
    "existingDefinition": "기존 관계 의미 레지스트리에 있는 원진 분류다.",
    "definition": "현행 정규화 facts는 子未·丑午·寅酉·卯申·辰亥·巳戌을 원진살로 검출하고 V4는 이 신호를 원진 관계로 투영한다. 원생 관계 결과와 별개다.",
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "현대 저자의6쌍·인접 조건·원국과 교차 일지 기준을 확인했고 학술 초록에서 명칭과 해석 원리의 연구를 확인했다. 고전 기원·조합별 예측 효력은 미확인이다.",
      "sourceRefs": [
        {
          "sourceId": "wonjin",
          "locator": "적용 / 성립의 여러 방법 / 인접 기준 / 참고자료"
        }
      ]
    },
    "formation": {
      "membership": "프로젝트의 실제6쌍 표를 보존한다. 원진살과 원진 관계에 별도 새 증거를 만들지 않는다.",
      "direction": "검출은 대칭이다. 원망하는 사람·좋아하는 사람을 간지로 정하지 않는다.",
      "positions": "facts 검출은 인접 여부를 요구하지 않으나 확인한 현대 저자는 인접 원국·교차 일지를 주장한다.",
      "season": "기존 신호만으로 힘·길흉·감정 집중도를 계산한 것처럼 쓰지 않는다.",
      "multiple": "같은 pair가 원진살·관계·월운에 재표시되더라도 소유자·기간·출처를 먼저 확인한다.",
      "operation": "foundation 투영에는 일치한 쌍이 노출되지 않는다. 쌍을 추측해 설명하지 않는다."
    },
    "exclusions": [
      "끌림·집착·혐오·외도·관계 실패를 실제 감정이나 사건으로 단정하는 경우.",
      "귀문과4쌍이 겹친다는 이유로 정신질환·영적 능력을 강화하는 경우.",
      "궁합의 원진 검출 미지원인데 각 사람의 원진살을 교차 원진으로 만드는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "현재 자료가 허용하는 것은 표의6쌍과 서로 다른 전승 조건의 대조다. 당사자의 감정·관계 결과는 이 기호로 알 수 없다.",
      "positive": "실제로 서로 다르게 이해한 대화가 확인된다면 오해를 검증하는 질문은 만들 수 있다. 원진의 특수 효능으로 주장하지 않는다.",
      "risk": "이름의 부정적 뜻이 상대에 대한 낙인과 확인 편향을 만들 수 있다.",
      "excess": "관계를 관찰한다며 상대의 반응을 과도하게 추적하거나 동의를 침해하지 않는다.",
      "reversal": "기호가 불편해 보여도 실제 관계가 안정적이면 그 현실을 우선한다. 원진에 고유한 긍정 성격을 새로 부여하지 않는다.",
      "mitigation": "실제 발언·당사자 설명·동의·관계 경계를 확인하며 해소 의무나 관계 유지 의무를 강요하지 않는다.",
      "coOccurrence": "육해와2쌍, 귀문과4쌍이 겹친다. 표 중복을 같은 의미·독립 위험의 누적으로 바꾸지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "hae",
        "difference": "여섯 쌍 전체가 같지 않으며 학술·전승의 정의도 별도다."
      },
      {
        "other": "hyeong",
        "difference": "자형의 반복과 원진의 서로 다른 두 지지는 구성부터 다르다."
      }
    ],
    "lineage": [
      "고전 전거 미확인; 학술 초록의 참고문헌을 읽은 원전으로 승격하지 않는다.",
      "현대 저자의 책·팟캐스트 참고는 이번에 직접 열람하지 않아 직접 출처로 채택하지 않는다.",
      "현대 전승 확인은 개인 사건에 대한 실증이 아니다."
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
      "natal",
      "natal_month"
    ],
    "unsupportedProducerScopeRefs": [
      "cross_person",
      "natal_major",
      "natal_annual",
      "between_periods"
    ]
  }
] as const satisfies readonly RelationProfile[];
