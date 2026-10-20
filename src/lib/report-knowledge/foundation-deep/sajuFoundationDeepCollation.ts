import type { DeepCollation } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_COLLATION = [
  {
    "id": "deep:collation:乙酉",
    "targetId": "foundation:day_pillar:乙酉",
    "issue": "六乙日詩의 여섯째 행 누락",
    "review": "open_after_additional_source_search",
    "finding": "HY1521 卷五 天元坐煞에서 甲申乙酉를 확인했으나 누락된 시구 자체를 복원하지 못했다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 乙酉",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 辛(偏官) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:丙子",
    "targetId": "foundation:day_pillar:丙子",
    "issue": "子中有辛生癸旺",
    "review": "open_after_additional_source_search",
    "finding": "辛이 癸를 생한다는 설명일 가능성과 子中藏辛이라는 해석을 구분해야 한다. 문구만으로 장간 辛을 추가할 수 없다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 丙子",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 癸(正官) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:癸丑",
    "targetId": "foundation:day_pillar:癸丑",
    "issue": "羊刃 명칭",
    "review": "open_after_additional_source_search",
    "finding": "卷三의 음간 포함 설명과 卷五 五陽有刃五陰無刃가 병존한다. 글자 오류라고 단정하지 않고 계보 선택으로 남긴다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 癸丑",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 己(偏官)·癸(比肩)·辛(偏印) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:乙未",
    "targetId": "foundation:day_pillar:乙未",
    "issue": "丁傷官",
    "review": "open_after_additional_source_search",
    "finding": "현행 getTenGod(乙,丁)은 食神이다. 시구의 傷官을 계산 정의로 쓰지 않으며 영인본의 정확한 글자와 인용 계보가 필요하다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 乙未",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 己(偏財)·丁(食神)·乙(比肩) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:庚戌",
    "targetId": "foundation:day_pillar:庚戌",
    "issue": "戌中旺丙",
    "review": "open_after_additional_source_search",
    "finding": "현재 戌의 戊辛丁 고정 저장과 다른 계절·분야 설명인지 전사 오류인지 확정하지 못했다. 丙 저장 근거를 만들지 않는다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 庚戌",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 戊(偏印)·辛(劫財)·丁(正官) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:壬戌",
    "targetId": "foundation:day_pillar:壬戌",
    "issue": "身作丙戊財官",
    "review": "open_after_additional_source_search",
    "finding": "丙戊가 재관의 유형을 든 것인지 저장 집합을 뜻하는지 문맥·원판 대조가 필요하다. 戌의 丁을 丙으로 바꾸지 않는다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 壬戌",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 戊(偏官)·辛(正印)·丁(正財) 및 기존 ID를 보존한다."
    ]
  },
  {
    "id": "deep:collation:辛巳",
    "targetId": "foundation:day_pillar:辛巳",
    "issue": "丙戌建祿",
    "review": "open_after_additional_source_search",
    "finding": "戌이 戊의 전사 혼동일 가능성은 가설일 뿐이다. 戌을 천간으로 취급하거나 원문을 조용히 정정하지 않는다.",
    "checkedSources": [
      {
        "sourceId": "completion-sm4",
        "locator": "六十日詩 / 辛巳",
        "proposition": "기존 의문 구절을 다시 대조했다."
      },
      {
        "sourceId": "deep-sm4-alt",
        "locator": "卷四 편제 대조",
        "proposition": "별도 온라인 卷四는 같은 日詩 절이 없어 독립 교감본으로 사용하지 못했다."
      },
      {
        "sourceId": "deep-sm5-hy",
        "locator": "天元坐煞 / 印食官財 관련 절",
        "proposition": "해당 개념의 관련 전사는 확보했으나 여섯 日詩 글자의 독립 영인 교감은 아니다."
      }
    ],
    "followUp": [
      "六十日詩가 수록된 정확한 원판의 영인과 다른 계보 판본을 일대일 대조한다.",
      "현행 구조 丙(正官)·戊(正印)·庚(劫財) 및 기존 ID를 보존한다."
    ]
  }
] as const satisfies readonly DeepCollation[];
