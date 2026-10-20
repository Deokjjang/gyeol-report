import type { CompletionResearch } from "./sajuFoundationCompletionTypes";

/** Offline research; intentionally unconnected to runtime. */
export const COMPLETION_HIDDENSTEMS = [
  {
    "id": "completion:hidden_stem:子",
    "targetId": "foundation:hidden_stem:子",
    "label": "자의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "癸 한 글자를 저장한다.",
    "traditional": [
      "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 한 글자 저장이 심리의 단순함을 뜻하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "한 글자 저장이 심리의 단순함을 뜻하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "한 글자 저장이 심리의 단순함을 뜻하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.子",
        "proposition": "癸 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
      }
    ],
    "pending": [
      "현행 子의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "癸"
    ]
  },
  {
    "id": "completion:hidden_stem:丑",
    "targetId": "foundation:hidden_stem:丑",
    "label": "축의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "己의 토·癸의 수·辛의 금을 저장한다.",
    "traditional": [
      "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 未와 토는 같지만 수금 저장을 목화 저장과 바꾸지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "未와 토는 같지만 수금 저장을 목화 저장과 바꾸지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "未와 토는 같지만 수금 저장을 목화 저장과 바꾸지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.丑",
        "proposition": "己의 토·癸의 수·辛의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
      }
    ],
    "pending": [
      "현행 丑의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "己",
      "癸",
      "辛"
    ]
  },
  {
    "id": "completion:hidden_stem:寅",
    "targetId": "foundation:hidden_stem:寅",
    "label": "인의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "甲의 목·丙의 화·戊의 토를 저장한다.",
    "traditional": [
      "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 卯처럼 목 한 글자만 저장하는 것으로 단순화하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "卯처럼 목 한 글자만 저장하는 것으로 단순화하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "卯처럼 목 한 글자만 저장하는 것으로 단순화하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.寅",
        "proposition": "甲의 목·丙의 화·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
      }
    ],
    "pending": [
      "현행 寅의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "甲",
      "丙",
      "戊"
    ]
  },
  {
    "id": "completion:hidden_stem:卯",
    "targetId": "foundation:hidden_stem:卯",
    "label": "묘의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "乙 한 글자를 저장한다.",
    "traditional": [
      "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 陰木 주오행과 음간의 실제 강약은 별개다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "陰木 주오행과 음간의 실제 강약은 별개다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "陰木 주오행과 음간의 실제 강약은 별개다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.卯",
        "proposition": "乙 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
      }
    ],
    "pending": [
      "현행 卯의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "乙"
    ]
  },
  {
    "id": "completion:hidden_stem:辰",
    "targetId": "foundation:hidden_stem:辰",
    "label": "진의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "戊의 토·乙의 목·癸의 수를 저장한다.",
    "traditional": [
      "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 戌의 丁火·辛金 저장과 辰의 乙木·癸水를 혼동하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "戌의 丁火·辛金 저장과 辰의 乙木·癸水를 혼동하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "戌의 丁火·辛金 저장과 辰의 乙木·癸水를 혼동하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.辰",
        "proposition": "戊의 토·乙의 목·癸의 수를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
      }
    ],
    "pending": [
      "현행 辰의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "戊",
      "乙",
      "癸"
    ]
  },
  {
    "id": "completion:hidden_stem:巳",
    "targetId": "foundation:hidden_stem:巳",
    "label": "사의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "丙의 화·戊의 토·庚의 금을 저장한다.",
    "traditional": [
      "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 午의 丁己 두 글자와 달리 庚이 있다는 사실만 남기며 숨은 직업을 추정하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "午의 丁己 두 글자와 달리 庚이 있다는 사실만 남기며 숨은 직업을 추정하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "午의 丁己 두 글자와 달리 庚이 있다는 사실만 남기며 숨은 직업을 추정하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.巳",
        "proposition": "丙의 화·戊의 토·庚의 금을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
      }
    ],
    "pending": [
      "현행 巳의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "丙",
      "戊",
      "庚"
    ]
  },
  {
    "id": "completion:hidden_stem:午",
    "targetId": "foundation:hidden_stem:午",
    "label": "오의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "丁의 화·己의 토를 저장한다.",
    "traditional": [
      "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 午가 陽支인데 丁己가 陰干인 사실은 오류가 아니다. 분류 축이 다르다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "午가 陽支인데 丁己가 陰干인 사실은 오류가 아니다. 분류 축이 다르다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "午가 陽支인데 丁己가 陰干인 사실은 오류가 아니다. 분류 축이 다르다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.午",
        "proposition": "丁의 화·己의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
      }
    ],
    "pending": [
      "현행 午의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "丁",
      "己"
    ]
  },
  {
    "id": "completion:hidden_stem:未",
    "targetId": "foundation:hidden_stem:未",
    "label": "미의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "己의 토·丁의 화·乙의 목을 저장한다.",
    "traditional": [
      "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 丑의 한습한 수금 저장으로 바꾸지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "丑의 한습한 수금 저장으로 바꾸지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "丑의 한습한 수금 저장으로 바꾸지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.未",
        "proposition": "己의 토·丁의 화·乙의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
      }
    ],
    "pending": [
      "현행 未의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "己",
      "丁",
      "乙"
    ]
  },
  {
    "id": "completion:hidden_stem:申",
    "targetId": "foundation:hidden_stem:申",
    "label": "신의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "庚의 금·壬의 수·戊의 토를 저장한다.",
    "traditional": [
      "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 酉처럼 辛 한 글자 저장으로 대신하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "酉처럼 辛 한 글자 저장으로 대신하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "酉처럼 辛 한 글자 저장으로 대신하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.申",
        "proposition": "庚의 금·壬의 수·戊의 토를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
      }
    ],
    "pending": [
      "현행 申의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "庚",
      "壬",
      "戊"
    ]
  },
  {
    "id": "completion:hidden_stem:酉",
    "targetId": "foundation:hidden_stem:酉",
    "label": "유의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "辛 한 글자를 저장한다.",
    "traditional": [
      "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 한 글자 저장을 완벽주의나 순수성의 성격 근거로 승격하지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "한 글자 저장을 완벽주의나 순수성의 성격 근거로 승격하지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "한 글자 저장을 완벽주의나 순수성의 성격 근거로 승격하지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.酉",
        "proposition": "辛 한 글자를 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
      }
    ],
    "pending": [
      "현행 酉의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "辛"
    ]
  },
  {
    "id": "completion:hidden_stem:戌",
    "targetId": "foundation:hidden_stem:戌",
    "label": "술의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "戊의 토·辛의 금·丁의 화를 저장한다.",
    "traditional": [
      "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 辰의 수목 잔여와 다른 조토·금화 저장이다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "辰의 수목 잔여와 다른 조토·금화 저장이다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "辰의 수목 잔여와 다른 조토·금화 저장이다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.戌",
        "proposition": "戊의 토·辛의 금·丁의 화를 저장한다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論雜氣",
        "proposition": "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
      }
    ],
    "pending": [
      "현행 戌의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "戊",
      "辛",
      "丁"
    ]
  },
  {
    "id": "completion:hidden_stem:亥",
    "targetId": "foundation:hidden_stem:亥",
    "label": "해의 지장간",
    "kind": "source_research_profile",
    "review": "repository_composition",
    "interpretationReview": "research_metadata_only",
    "core": "壬의 수·甲의 목을 저장한다.",
    "traditional": [
      "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
    ],
    "positive": "주오행만으로 보이지 않는 저장 천간의 구성을 구별해 읽을 수 있다. 子의 癸 하나 저장과 달리 甲이 있으나 숨은 성격·미래 성취로 읽지 않는다.",
    "risk": "저장 천간의 개수·weight를 숨은 욕망·심리 비율·실제 사건으로 오인할 수 있다.",
    "behavior": {
      "judgment": "고정 집합에서 실제 확인된 천간만 읽는다.",
      "action": "일간이 없으면 이 저장 천간의 십성을 가정하지 않는다.",
      "expression": "장간과 사령일수·weight의 출처를 따로 설명한다.",
      "conflict": "계보가 다른 표는 병기하고 단일 정답으로 합치지 않는다.",
      "environment": "지지와 일간·위치가 실제로 확인된 자료 조사에 한정한다."
    },
    "growth": "저장 집합·사령 시기·십성 관계·현재 투출을 각각 구분한다.",
    "unexpected": "子의 癸 하나 저장과 달리 甲이 있으나 숨은 성격·미래 성취로 읽지 않는다.",
    "conditions": [
      "실제 계산된 지지와 기존 HIDDEN_STEMS를 참조하고 일간 대비 십성·위치·월령은 별도로 확인하는 경우.",
      "실제 생활 습관이 확인된 경우에만 아래 현대적 예시를 검토한다. 항목의 존재만으로 그 습관을 추론하지 않는다."
    ],
    "domains": {},
    "contrasts": [
      "子의 癸 하나 저장과 달리 甲이 있으나 숨은 성격·미래 성취로 읽지 않는다."
    ],
    "limitations": [
      "역사 문헌의 기술 확인은 예측의 실증이나 개인 성격의 확정이 아니다.",
      "출생시간이 없으면 시주의 근거·가족 사건·노년 사건을 가정하지 않는다.",
      "직업·수입·연애·혼인·출산·질병·사고·실제 과거 경험을 이 요소 하나로 단정하지 않는다.",
      "0.6/0.3/0.1은 기존 프로젝트의 저장 계약이며 고전 일수·확률·성격 비중이 아니다."
    ],
    "sourceRefs": [
      {
        "sourceId": "completion-repo",
        "locator": "HIDDEN_STEMS.亥",
        "proposition": "壬의 수·甲의 목을 저장한다."
      },
      {
        "sourceId": "completion-sm2",
        "locator": "論人元司事・論地支",
        "proposition": "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
      }
    ],
    "pending": [
      "현행 亥의 고정 집합을 모든 연월일시에서 쓰는 동일 판본 전거는 추가 교감. 卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다.",
      "생활 분야 해석은 이 집합만으로 만들 수 없다. 일간·투출·월령·위치의 실제 관계가 필요하며 이번에는 복합 DB를 만들지 않는다."
    ],
    "hiddenStems": [
      "壬",
      "甲"
    ]
  }
] as const satisfies readonly CompletionResearch[];
