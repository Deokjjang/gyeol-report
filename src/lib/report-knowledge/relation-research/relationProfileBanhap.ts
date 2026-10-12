import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_BANHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:banhap",
    "key": "banhap",
    "targetId": "foundation:relation:banhap",
    "label": "지지 반합",
    "hanja": "地支半合",
    "aliases": [
      "지지 반합",
      "반합",
      "삼합의 부분 조합"
    ],
    "existingDefinition": "기존 관계 의미 레지스트리에 있는 부분 결속 분류다.",
    "definition": "기존 생산자는 각 삼합의 서로 다른 두 글자12쌍을 부분 연결로 판정한다. 왕지를 포함한8쌍과 왕지가 없는4쌍의 전승 차이를 보존한다.",
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "삼명통회의 결자 불완전 삼합 설명은 확인했다. 현재12쌍 전부를 동등한 半合으로 부르는 고전 직접 전거는 확인하지 못했다. 현대 제공자는 왕지 없는 생고 조합의 이견을 명시한다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "formation": {
      "membership": "동일한 4삼합 안의 서로 다른 두 글자.",
      "direction": "집합 소속은 대칭이며 생왕·왕고·생고의 구성 차이를 기록한다.",
      "positions": "원국 원생 생산자 없음. 교차 사람 또는 기간의 실제 refs만 사용한다.",
      "season": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다.",
      "multiple": "세 번째 글자가 실제로 확인되면 전체 삼합과 같은 참여 집합의 중복을 점검한다.",
      "operation": "12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다."
    },
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "부분 연결이므로 완전 삼합 효과의 정확히 절반이라고 수치화하는 경우.",
      "같은 지지 두 개로 서로 다른 두 글자 조건을 만족시키는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "시작과 중심, 중심과 저장, 시작과 저장은 빠진 역할이 다르다. 단순 약한 삼합이라는 말보다 부족한 구성의 종류가 새 정보다.",
      "positive": "완성되지 않은 연결을 제한된 실험으로 확인할 질문을 제공한다.",
      "risk": "부분 접점을 전체 합의나 완전 작용으로 확대하는 경우를 경계한다.",
      "excess": "일치하는 일부만 반복 확인하면 핵심 역할이 비어 있다는 사실을 놓칠 수 있다.",
      "reversal": "불완전함은 추가 구성 전까지 결정을 유보할 이유가 될 수 있으며 나쁜 관계의 증거가 아니다.",
      "mitigation": "실제 빠진 글자와 현실의 빠진 역할은 다른 자료다. 상징을 사실로 채워 넣지 않는다.",
      "coOccurrence": "교차 경로는 full/half가 함께 남을 수 있다. 같은 참여 집합을 새로운 여러 결과로 세지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "samhap",
        "difference": "없는 세 번째 구성과 화국을 대신 주장하지 않는다."
      },
      {
        "other": "stem_hap",
        "difference": "원거리 천간 합에 쓰인 半合 용어는 이 지지 관계와 별개다."
      }
    ],
    "lineage": [
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다."
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
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": [
      "natal"
    ]
  }
] as const satisfies readonly RelationProfile[];
