import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_CHUNG = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:chung",
    "key": "chung",
    "targetId": "foundation:relation:chung",
    "label": "지지 충",
    "hanja": "地支衝",
    "aliases": [
      "지지 충",
      "충",
      "육충",
      "沖"
    ],
    "existingDefinition": "마주 놓인 지지의 상충을 논하는 관계 분류다.",
    "definition": "십이지에서 대향하는 여섯 쌍의 충이다. 같은 양·음끼리의 대향이며 원래 오행과 장간의 서로 다른 작용을 함께 살핀다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회 論衝擊는 대향과 충의 유불리 조건을 논한다. 적천수의 왕쇠별 충 설명과 창고를 충해 열어야 하는지의 논란을 별개로 둔다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "formation": {
      "membership": "子午·丑未·寅申·卯酉·辰戌·巳亥의 두 자리.",
      "direction": "대칭 검출과 어느 쪽의 여력이 더 변하는지는 다르다.",
      "positions": "월령과 일지의 위치를 보존하되 위치를 직장·배우자 사건으로 고정하지 않는다.",
      "season": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다.",
      "multiple": "여러 충의 참여자를 각각 기록하고 한 충으로 연도 전체를 판단하지 않는다.",
      "operation": "방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다."
    },
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "辰戌·丑未가 모두 토라는 이유로 무작용이라 하거나 충하면 항상 재고가 열린다고 하는 경우.",
      "합이 있다는 이유만으로 충 사실을 계산에서 삭제하는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "대향 관계는 두 기능을 기존 배치 그대로 유지하기 어려운 조건을 검토하게 한다. 변화의 좋고 나쁨은 실제 대상의 역할에 달려 있다.",
      "positive": "유지할 이유가 약한 배치가 있다면 수정 가능성을 검토하는 질문으로 사용할 수 있다.",
      "risk": "필요한 뿌리나 유용한 기능의 지지가 약해지는 조건은 별도 점검 대상이다.",
      "excess": "현실의 모든 불편을 전면 교체로 해결하려 하면 바꿀 필요 없는 자원까지 잃을 수 있다.",
      "reversal": "불리한 배치의 재조정은 도움이 될 수 있지만 편안한 기존 배치의 붕괴도 가능하므로 충 자체를 호재로 뒤집지 않는다.",
      "mitigation": "자평진전 七의 해충은 합·삼합의 참여가 실제로 유지되는 조건에 달려 있고 해법이 다시 묶이면 충이 남는 예도 있다.",
      "coOccurrence": "寅申은 형, 巳亥는 삼합 소속 다른 그룹의 충이다. 여러 이름의 공유 기둥을 묶어 사실을 중복 세지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "pa",
        "difference": "충은 대향 여섯 쌍이고 파는 다른 여섯 쌍이다. 둘 다 변화라는 말만으로 정의할 수 없다."
      },
      {
        "other": "hyeong",
        "difference": "형의 순환·자형·부분 구성을 대향 충으로 환원하지 않는다."
      }
    ],
    "lineage": [
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다."
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
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": []
  }
] as const satisfies readonly RelationProfile[];
