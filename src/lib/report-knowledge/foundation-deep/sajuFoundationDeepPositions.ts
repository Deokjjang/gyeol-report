import type { DeepPosition } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_POSITIONS = [
  {
    "id": "deep:position:bijian:year",
    "targetId": "foundation:ten_god:bijian",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "편재 논의에서 연간 비견의 분재 영향을 다른 위치와 비교한다.",
    "condition": "편재와 비견의 실제 위치·강약을 함께 본다는 해당 절에 한정한다. 조상이나 형제의 사건을 만들지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 比肩出干・年上比肩最重",
        "proposition": "편재 논의에서 연간 비견의 분재 영향을 다른 위치와 비교한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:bijian:month",
    "targetId": "foundation:ten_god:bijian",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "같은 편재 논의에서 월간 비견의 영향을 연간과 차등 설명한다.",
    "condition": "월령 전체의 비견 해석과 이 특정 분재 문맥을 동일하게 만들지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 月稍次之",
        "proposition": "같은 편재 논의에서 월간 비견의 영향을 연간과 차등 설명한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:bijian:day",
    "targetId": "foundation:ten_god:bijian",
    "position": "day",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:bijian:hour",
    "targetId": "foundation:ten_god:bijian",
    "position": "hour",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:jie_cai:year",
    "targetId": "foundation:ten_god:jie_cai",
    "position": "year",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:jie_cai:month",
    "targetId": "foundation:ten_god:jie_cai",
    "position": "month",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:jie_cai:day",
    "targetId": "foundation:ten_god:jie_cai",
    "position": "day",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:jie_cai:hour",
    "targetId": "foundation:ten_god:jie_cai",
    "position": "hour",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "비견·겁재의 위치별 동등한 생활 의미 또는 단일 위치의 독립 작용을 승인할 정확한 구절을 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:shi_shen:year",
    "targetId": "foundation:ten_god:shi_shen",
    "position": "year",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "재·식이 년월에 있는 경우를 일시의 경우와 분리해 서술하는 역사 구절을 확인했다.",
    "condition": "일주와 식신·재성의 생왕을 함께 논하는 문맥이다. 조상 재산·가족 사실은 승인하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論食神 / 財食在歲月上",
        "proposition": "재·식이 년월에 있는 경우를 일시의 경우와 분리해 서술하는 역사 구절을 확인했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論食神 / 財食在歲月上",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:shi_shen:month",
    "targetId": "foundation:ten_god:shi_shen",
    "position": "month",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "월령 또는 월간의 식신을 몸의 상태·시간 관성과 함께 논한다.",
    "condition": "월간 투출과 월령 격은 서로 다르다. 식신의 위치만으로 학업·부를 단정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論食神 / 月令值食身健旺; 月露食神時露官",
        "proposition": "월령 또는 월간의 식신을 몸의 상태·시간 관성과 함께 논한다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論食神 / 月令值食身健旺; 月露食神時露官",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:shi_shen:day",
    "targetId": "foundation:ten_god:shi_shen",
    "position": "day",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "일·시를 년·월과 구별한 구절의 존재를 확인했다.",
    "condition": "일간 자체는 자기 기준이므로 식신이라고 부르지 않는다. 일지 장간·다른 조건이 있어야 하며 배우자·자녀 사건은 승인하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論食神 / 財食在歲月上…在日時",
        "proposition": "일·시를 년·월과 구별한 구절의 존재를 확인했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論食神 / 財食在歲月上…在日時",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:shi_shen:hour",
    "targetId": "foundation:ten_god:shi_shen",
    "position": "hour",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "戊일 庚시의 식신이 화가 왕한 경우와 결합되는 제한을 확인했다.",
    "condition": "이 특정 조합을 모든 식신 시주에 일반화하지 않는다. 출생시간 미상이면 적용 불가.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論食神 / 戊日庚時不宜火旺",
        "proposition": "戊일 庚시의 식신이 화가 왕한 경우와 결합되는 제한을 확인했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論食神 / 戊日庚時不宜火旺",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:shang_guan:year",
    "targetId": "foundation:ten_god:shang_guan",
    "position": "year",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "년간 상관을 월의 추가 조건과 함께 논하는 구절이 있다.",
    "condition": "역사적 조상·불행 단정은 제외한다. 년간 상관이 있다는 사실만으로 위험을 승인하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論傷官 / 年干傷官…甲日丁卯年寅午戌月",
        "proposition": "년간 상관을 월의 추가 조건과 함께 논하는 구절이 있다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論傷官 / 年干傷官…甲日丁卯年寅午戌月",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:shang_guan:month",
    "targetId": "foundation:ten_god:shang_guan",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "월지의 상관과 다른 관성의 잔존 여부를 함께 검토한다.",
    "condition": "傷盡 여부와 강약·관성의 유무가 확인되어야 하며 상관 하나로 조직 갈등을 추정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論傷官 / 月支傷官・時上傷官・傷盡",
        "proposition": "월지의 상관과 다른 관성의 잔존 여부를 함께 검토한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:shang_guan:day",
    "targetId": "foundation:ten_god:shang_guan",
    "position": "day",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "일지의 저장 인성과 일간 자체를 구분하는 것은 가능하지만 이 위치만의 독립 생활 해석 전거는 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:shang_guan:hour",
    "targetId": "foundation:ten_god:shang_guan",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상의 상관도 다른 기둥의 관성과 함께 읽는다.",
    "condition": "시주가 실제로 있고 傷盡 등 본문의 추가 조건이 있을 때만 읽는다. 자녀·노년 사건으로 바꾸지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論傷官 / 時上傷官・傷盡",
        "proposition": "시상의 상관도 다른 기둥의 관성과 함께 읽는다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_cai:year",
    "targetId": "foundation:ten_god:pian_cai",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "연상의 편재는 생왕과 월령·다른 기둥의 통기를 함께 요구한다.",
    "condition": "일간의 감당력과 재성의 실제 기세를 확인한다. 고전의 조상 재산 주장은 고객의 가족 사실로 전용하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 年上偏財生旺・月令柱中通氣",
        "proposition": "연상의 편재는 생왕과 월령·다른 기둥의 통기를 함께 요구한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_cai:month",
    "targetId": "foundation:ten_god:pian_cai",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "월상의 편재를 일간의 감당력과 함께 본다.",
    "condition": "실제 월령·일간 강약·분탈 조건을 확인한다. 직업·소득을 정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 偏財月令所帶最重・身勢勝任",
        "proposition": "월상의 편재를 일간의 감당력과 함께 본다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_cai:day",
    "targetId": "foundation:ten_god:pian_cai",
    "position": "day",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "연월에 없고 일시에 재성이 있는 경우를 묶어서 설명한다. 일지 편재만의 독립 성격 공식은 아니다.",
    "condition": "실제 연월일시의 재성과 겁패·충극 조건을 함께 확인한다. 혼인 상대의 재산이나 실제 창업 경력을 단정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏財 / 年月本無日時帶財",
        "proposition": "연월에 없고 일시에 재성이 있는 경우를 묶어서 설명한다. 일지 편재만의 독립 성격 공식은 아니다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_cai:hour",
    "targetId": "foundation:ten_god:pian_cai",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상 편재의 별도 격 설명은 한 자리와 신왕 등 조건을 요구한다.",
    "condition": "출생시간·실제 편재의 수·강약을 확인한다. 현재 DB의 계산 판정을 확장하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "時上偏財 / 止許一位・身旺",
        "proposition": "시상 편재의 별도 격 설명은 한 자리와 신왕 등 조건을 요구한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_cai:year",
    "targetId": "foundation:ten_god:zheng_cai",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "연상의 정재를 보는 별도 설명은 일간의 감당력과 다른 기둥의 지원을 함께 요구한다.",
    "condition": "고전의 가문·부귀 단정은 채택하지 않는다. 연상 한 글자에서 실제 상속을 추정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "歲帶正馬 / 年干正財・日主徤旺",
        "proposition": "연상의 정재를 보는 별도 설명은 일간의 감당력과 다른 기둥의 지원을 함께 요구한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_cai:month",
    "targetId": "foundation:ten_god:zheng_cai",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "월상의 정재는 得時라는 조건과 함께 설명된다.",
    "condition": "월령과 실제 기세를 확인한다. 정재가 있다는 이유만으로 월급 생활을 확정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論正財 / 月地支坐財官謂之得時",
        "proposition": "월상의 정재는 得時라는 조건과 함께 설명된다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_cai:day",
    "targetId": "foundation:ten_god:zheng_cai",
    "position": "day",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "일지의 정재를 得位로 구분하되 전체 재성·일간 조건을 함께 본다.",
    "condition": "배우자의 인격이나 자산을 단정하지 않는다. 실재 인물의 정보는 별도로 확인한다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論正財 / 日地支坐財官謂之得位",
        "proposition": "일지의 정재를 得位로 구분하되 전체 재성·일간 조건을 함께 본다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_cai:hour",
    "targetId": "foundation:ten_god:zheng_cai",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상의 정재는 별도 위치 설명과 재관·월기 조건을 함께 갖는다.",
    "condition": "시주 미상 제외. 有成이라는 고전 표현을 노후 수익 보장으로 번역하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論正財 / 時地支坐財官謂之有成; 時帶正馬",
        "proposition": "시상의 정재는 별도 위치 설명과 재관·월기 조건을 함께 갖는다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:qi_sha:year",
    "targetId": "foundation:ten_god:qi_sha",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "연상 칠살은 제복과 일간의 감당력을 함께 살핀다.",
    "condition": "고전의 집안·부모 사건은 사용하지 않는다. 실제 제화 관계가 필요하다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "年上七煞 / 制伏・身旺",
        "proposition": "연상 칠살은 제복과 일간의 감당력을 함께 살핀다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:qi_sha:month",
    "targetId": "foundation:ten_god:qi_sha",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "월령 편관은 일간과 살의 균형 및 제화를 요구한다.",
    "condition": "월령의 실제 살과 강약을 확인한다. 위압적인 직장이나 부모를 상상하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論偏官 / 月令偏官・身煞兩停",
        "proposition": "월령 편관은 일간과 살의 균형 및 제화를 요구한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:qi_sha:day",
    "targetId": "foundation:ten_god:qi_sha",
    "position": "day",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "일지에 살을 둔 구성을 별도 절에서 설명하며 생조·제화 조건을 붙인다.",
    "condition": "일지의 실제 장간과 일간을 확인한다. 배우자 폭력이나 실패의 예언으로 쓰지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "天元坐煞 / 甲申乙酉・日主徤旺",
        "proposition": "일지에 살을 둔 구성을 별도 절에서 설명하며 생조·제화 조건을 붙인다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:qi_sha:hour",
    "targetId": "foundation:ten_god:qi_sha",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상 편관의 격은 한 자리와 다른 세 기둥의 중복 여부를 구분한다.",
    "condition": "실제 시주와 추가 조건이 있는 자료 연구에 한정한다. 새 격국 계산이나 말년 사건을 만들지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "時上一位貴 / 止許一位・三處不要再見",
        "proposition": "시상 편관의 격은 한 자리와 다른 세 기둥의 중복 여부를 구분한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_guan:year",
    "targetId": "foundation:ten_god:zheng_guan",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "연상의 정관도 월령 정관과 같은 희기 조건을 살핀다.",
    "condition": "신왕·재인과 혼잡 여부 등 본문의 조건에 한정한다. 실제 가문·성공 시기를 확정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "歲德正官 / 喜忌與月令正官同論",
        "proposition": "연상의 정관도 월령 정관과 같은 희기 조건을 살핀다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_guan:month",
    "targetId": "foundation:ten_god:zheng_guan",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "정관 설명은 월령과 지장간·투출을 먼저 확인한다.",
    "condition": "해당 관성의 실제 관계·강약·재인 조건이 필요하다. 월간과 월령을 자동으로 동일시하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論正官 / 先㸔月令・支藏干透",
        "proposition": "정관 설명은 월령과 지장간·투출을 먼저 확인한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_guan:day",
    "targetId": "foundation:ten_god:zheng_guan",
    "position": "day",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "일지의 관을 별도 설명하지만 일간과 관의 균형 등 조건을 붙인다.",
    "condition": "같은 절의 편관·납음 관법이 섞이는 대목은 구별한다. 실제 일간 대비 정관인 부분만 참고한다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "天元坐禄 / 日主與官貴相停",
        "proposition": "일지의 관을 별도 설명하지만 일간과 관의 균형 등 조건을 붙인다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_guan:hour",
    "targetId": "foundation:ten_god:zheng_guan",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상의 정관도 인의 도움·월령·재의 지원을 함께 본다.",
    "condition": "시주 미상 제외. 고전의 늦은 복·자녀 단정은 연구 기록에서만 경계하고 고객 사실로 쓰지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "時上正官 / 印助・月令通生旺",
        "proposition": "시상의 정관도 인의 도움·월령·재의 지원을 함께 본다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_yin:year",
    "targetId": "foundation:ten_god:pian_yin",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "도식 절에 연주 위치의 梟 비유가 있지만 가족 사건의 확정은 채택하지 않는다.",
    "condition": "편인과 식신의 실제 조합을 확인해야 한다. 柱中無食只以偏印論이라는 예외를 유지한다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論倒食 / 梟居祖位",
        "proposition": "도식 절에 연주 위치의 梟 비유가 있지만 가족 사건의 확정은 채택하지 않는다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:pian_yin:month",
    "targetId": "foundation:ten_god:pian_yin",
    "position": "month",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "월령 편인을 년·시 재성 및 신왕 조건과 함께 구분하는 구절을 확인했다.",
    "condition": "예시 甲亥·壬申 등은 상대 관계와 월령을 함께 읽는다. 편인 존재와 도식 성립은 동일하지 않다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論印綬 / 甲日子月正印亥月偏印; 偏印月令年時見財",
        "proposition": "월령 편인을 년·시 재성 및 신왕 조건과 함께 구분하는 구절을 확인했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論印綬 / 甲日子月正印亥月偏印; 偏印月令年時見財",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:pian_yin:day",
    "targetId": "foundation:ten_god:pian_yin",
    "position": "day",
    "wasUnverified": true,
    "review": "unverified_after_search",
    "meaning": "일지의 저장 인성과 일간 자체를 구분하는 것은 가능하지만 이 위치만의 독립 생활 해석 전거는 확보하지 못했다.",
    "condition": "그 위치의 실제 글자와 일간·월령·제화 조건 및 해당 전거 확보 전에는 사용하지 않는다.",
    "sourceRefs": [],
    "followUp": [
      "卷五 관련 절·卷七·별도 HY1521 전사를 조사했다. 정확한 위치·기준 간·조건을 묶은 일차 전거와 판본 대조가 필요하다."
    ]
  },
  {
    "id": "deep:position:pian_yin:hour",
    "targetId": "foundation:ten_god:pian_yin",
    "position": "hour",
    "wasUnverified": true,
    "review": "limited_passage_checked",
    "meaning": "년·시·월령 편인의 길흉이 아직 정해지지 않았다는 인용을 확인했다.",
    "condition": "시주가 확인되어도 이것은 길흉 미정이라는 제한의 전거다. 자녀·노년 사건이나 확정적 긍정 의미의 검증이 아니다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論倒食 / 年時月令有偏印凶吉未明",
        "proposition": "년·시·월령 편인의 길흉이 아직 정해지지 않았다는 인용을 확인했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "論倒食 / 年時月令有偏印凶吉未明",
        "proposition": "동일 주제의 추가 전사를 확인했으며 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "위치만의 생활 성향으로 일반화하지 않는다. 조건과 제한의 출현만 확인했다."
    ]
  },
  {
    "id": "deep:position:zheng_yin:year",
    "targetId": "foundation:ten_god:zheng_yin",
    "position": "year",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "인수 절의 연간 설명은 귀록 등 별도 조건을 요구한다.",
    "condition": "인수 절은 정·편인을 포괄하는 대목이 있어 실제 일간 대비 정인인지 먼저 구분한다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論印綬 / 年干湏歸禄; 時逢生印",
        "proposition": "인수 절의 연간 설명은 귀록 등 별도 조건을 요구한다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_yin:month",
    "targetId": "foundation:ten_god:zheng_yin",
    "position": "month",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "인수의 월기 중요도를 설명하는 문맥이다.",
    "condition": "월령과 실제 정인 관계를 확인한다. 인수 일반을 곧바로 정인 고유 성격으로 만들지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論印綬 / 月最要",
        "proposition": "인수의 월기 중요도를 설명하는 문맥이다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_yin:day",
    "targetId": "foundation:ten_god:zheng_yin",
    "position": "day",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "인수 절은 월 다음에 일시를 함께 살피지만 독립된 일지 성격 공식은 제시하지 않는다.",
    "condition": "자료의 범위는 위치 비교까지다. 실제 정인과 강약·투출을 별도로 확인한다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "論印綬 / 日時次之",
        "proposition": "인수 절은 월 다음에 일시를 함께 살피지만 독립된 일지 성격 공식은 제시하지 않는다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  },
  {
    "id": "deep:position:zheng_yin:hour",
    "targetId": "foundation:ten_god:zheng_yin",
    "position": "hour",
    "wasUnverified": false,
    "review": "inherited_conditional_passage",
    "meaning": "시상의 인수는 일간이 도움을 받는 구성과 함께 설명된다.",
    "condition": "시주와 정인 관계가 실제로 있을 때만 해당 대목을 연구한다. 자녀·말년 복을 단정하지 않는다.",
    "sourceRefs": [
      {
        "sourceId": "completion-sm5",
        "locator": "時逢生印 / 時上印綬・日主得助",
        "proposition": "시상의 인수는 일간이 도움을 받는 구성과 함께 설명된다."
      }
    ],
    "followUp": [
      "이전 구절의 제한을 유지한다. 이번에 별도의 검증 완료로 집계하지 않는다."
    ]
  }
] as const satisfies readonly DeepPosition[];
