import type { DeepDayPillar } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_DAY_PILLARS = [
  {
    "id": "deep:day_pillar:甲子",
    "targetId": "foundation:day_pillar:甲子",
    "label": "갑자일주",
    "stem": "甲",
    "branch": "子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "곧게 세우는 목표와 뒤에서 받아들이는 배움의 조합",
    "strengthMeaning": "익힌 원리를 자기 계획의 뼈대로 바꾸는 힘",
    "overuseCondition": "보호받은 설명을 현실에서 시험하지 않고 정답으로 붙들 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲子#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲戌",
        "meaning": "일주 甲子의 저장 구성은 癸(正印)이고, 같은 일간의 비교 일주 甲戌의 저장 구성은 戊(偏財)·辛(正官)·丁(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙子",
        "meaning": "甲子 / 丙子: 지지 子의 저장 집합은 같지만 기준 일간이 달라 각각 癸(正印) / 癸(正官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲子:personality",
      "deep:application:day_pillar:甲子:career",
      "deep:application:day_pillar:甲子:money",
      "deep:application:day_pillar:甲子:study",
      "deep:application:day_pillar:甲子:love",
      "deep:application:day_pillar:甲子:marriage",
      "deep:application:day_pillar:甲子:family",
      "deep:application:day_pillar:甲子:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.子 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 子",
        "proposition": "甲坐子는 沐浴의 이름과 별개로 子中癸의 생조를 함께 본다. 六甲日詩는 계절 재검토를 요구한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙丑",
    "targetId": "foundation:day_pillar:乙丑",
    "label": "을축일주",
    "stem": "乙",
    "branch": "丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏印"
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "유연한 성장 방향을 차갑고 복합적인 토양에서 조율하는 조합",
    "strengthMeaning": "서두르지 않고 관계·자료·규칙을 함께 보존하는 가능성",
    "overuseCondition": "충분히 준비될 때까지 표현을 뒤로 미뤄 의도가 보이지 않을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙丑#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙亥",
        "meaning": "일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이고, 같은 일간의 비교 일주 乙亥의 저장 구성은 壬(正印)·甲(劫財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁丑",
        "meaning": "乙丑 / 丁丑: 지지 丑의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏財)·癸(偏印)·辛(偏官) / 己(食神)·癸(偏官)·辛(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙丑:personality",
      "deep:application:day_pillar:乙丑:career",
      "deep:application:day_pillar:乙丑:money",
      "deep:application:day_pillar:乙丑:study",
      "deep:application:day_pillar:乙丑:love",
      "deep:application:day_pillar:乙丑:marriage",
      "deep:application:day_pillar:乙丑:family",
      "deep:application:day_pillar:乙丑:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.丑 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六乙日詩 / 丑",
        "proposition": "六乙日詩는 丑中己辛癸의 財官印과 금국·합화 조건을 언급한다. 합화 성립은 이 자료에서 판정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙寅",
    "targetId": "foundation:day_pillar:丙寅",
    "label": "병인일주",
    "stem": "丙",
    "branch": "寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "比肩"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "밝게 드러내는 힘을 배움과 시작의 연료로 받치는 조합",
    "strengthMeaning": "새로운 이해를 다른 사람이 참여할 출발점으로 만드는 방향",
    "overuseCondition": "시작의 활력이 지속 운영의 부담을 가릴 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙寅#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙子",
        "meaning": "일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이고, 같은 일간의 비교 일주 丙子의 저장 구성은 癸(正官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:戊寅",
        "meaning": "丙寅 / 戊寅: 지지 寅의 저장 집합은 같지만 기준 일간이 달라 각각 甲(偏印)·丙(比肩)·戊(食神) / 甲(偏官)·丙(偏印)·戊(比肩)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙寅:personality",
      "deep:application:day_pillar:丙寅:career",
      "deep:application:day_pillar:丙寅:money",
      "deep:application:day_pillar:丙寅:study",
      "deep:application:day_pillar:丙寅:love",
      "deep:application:day_pillar:丙寅:marriage",
      "deep:application:day_pillar:丙寅:family",
      "deep:application:day_pillar:丙寅:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.寅 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 寅",
        "proposition": "六丙日詩는 寅의 長生·食神 생왕을 들고 월시를 재검토한다. 수명 예언은 채택하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁卯",
    "targetId": "foundation:day_pillar:丁卯",
    "label": "정묘일주",
    "stem": "丁",
    "branch": "卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "섬세한 표현을 지속적으로 길러 주는 배움의 토양과 연결하는 조합",
    "strengthMeaning": "한 사람에게 맞는 설명과 돌봄을 꾸준히 다듬는 방향",
    "overuseCondition": "준비와 배려를 오래 하다 직접 요구할 시점을 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁卯#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁丑",
        "meaning": "일주 丁卯의 저장 구성은 乙(偏印)이고, 같은 일간의 비교 일주 丁丑의 저장 구성은 己(食神)·癸(偏官)·辛(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:己卯",
        "meaning": "丁卯 / 己卯: 지지 卯의 저장 집합은 같지만 기준 일간이 달라 각각 乙(偏印) / 乙(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁卯:personality",
      "deep:application:day_pillar:丁卯:career",
      "deep:application:day_pillar:丁卯:money",
      "deep:application:day_pillar:丁卯:study",
      "deep:application:day_pillar:丁卯:love",
      "deep:application:day_pillar:丁卯:marriage",
      "deep:application:day_pillar:丁卯:family",
      "deep:application:day_pillar:丁卯:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.卯 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 卯",
        "proposition": "六丁日詩는 卯의 財官 무기와 다른 기둥의 조건을 설명한다. 별개로 기존 장간 卯乙은 丁의 생조 관계다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊辰",
    "targetId": "foundation:day_pillar:戊辰",
    "label": "무진일주",
    "stem": "戊",
    "branch": "辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正官"
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "큰 틀을 유지하면서 안의 여러 자원을 조정하는 조합",
    "strengthMeaning": "여러 요구를 받을 수 있는 운영 기반을 만드는 가능성",
    "overuseCondition": "포괄하는 역할이 커져 책임의 경계가 불분명해질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊辰#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊寅",
        "meaning": "일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이고, 같은 일간의 비교 일주 戊寅의 저장 구성은 甲(偏官)·丙(偏印)·戊(比肩)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:庚辰",
        "meaning": "戊辰 / 庚辰: 지지 辰의 저장 집합은 같지만 기준 일간이 달라 각각 戊(比肩)·乙(正官)·癸(正財) / 戊(偏印)·乙(正財)·癸(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊辰:personality",
      "deep:application:day_pillar:戊辰:career",
      "deep:application:day_pillar:戊辰:money",
      "deep:application:day_pillar:戊辰:study",
      "deep:application:day_pillar:戊辰:love",
      "deep:application:day_pillar:戊辰:marriage",
      "deep:application:day_pillar:戊辰:family",
      "deep:application:day_pillar:戊辰:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.辰 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 辰",
        "proposition": "六戊日詩는 辰을 壬癸의 庫로 비유하고 乙餘氣를 들어 財官의 사용 조건을 살핀다. 이는 현재 辰戊乙癸 저장 집합을 다시 정의하는 구절이 아니다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己巳",
    "targetId": "foundation:day_pillar:己巳",
    "label": "기사일주",
    "stem": "己",
    "branch": "巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正印"
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "劫財"
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "작은 현실을 돌보는 토양에 강한 온기가 공급되는 조합",
    "strengthMeaning": "배운 방법을 생활과 작업의 구체적인 루틴으로 정착시키는 방향",
    "overuseCondition": "익숙한 지원 방식에 머물러 새로운 조건을 늦게 볼 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己巳#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己卯",
        "meaning": "일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이고, 같은 일간의 비교 일주 己卯의 저장 구성은 乙(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:辛巳",
        "meaning": "己巳 / 辛巳: 지지 巳의 저장 집합은 같지만 기준 일간이 달라 각각 丙(正印)·戊(劫財)·庚(傷官) / 丙(正官)·戊(正印)·庚(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己巳:personality",
      "deep:application:day_pillar:己巳:career",
      "deep:application:day_pillar:己巳:money",
      "deep:application:day_pillar:己巳:study",
      "deep:application:day_pillar:己巳:love",
      "deep:application:day_pillar:己巳:marriage",
      "deep:application:day_pillar:己巳:family",
      "deep:application:day_pillar:己巳:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.巳 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 巳",
        "proposition": "六己日詩는 巳의 丙旺·印生身과 水絶木病 조건을 언급한다. 財官 부재를 평생 결핍으로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚午",
    "targetId": "foundation:day_pillar:庚午",
    "label": "경오일주",
    "stem": "庚",
    "branch": "午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正官"
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "큰 결단을 규율과 배움으로 다듬는 조합",
    "strengthMeaning": "명확한 판단을 책임 있는 실행 절차로 바꾸는 방향",
    "overuseCondition": "옳은 절차를 강조하다 현장의 다른 속도를 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚午#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚辰",
        "meaning": "일주 庚午의 저장 구성은 丁(正官)·己(正印)이고, 같은 일간의 비교 일주 庚辰의 저장 구성은 戊(偏印)·乙(正財)·癸(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:壬午",
        "meaning": "庚午 / 壬午: 지지 午의 저장 집합은 같지만 기준 일간이 달라 각각 丁(正官)·己(正印) / 丁(正財)·己(正官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚午:personality",
      "deep:application:day_pillar:庚午:career",
      "deep:application:day_pillar:庚午:money",
      "deep:application:day_pillar:庚午:study",
      "deep:application:day_pillar:庚午:love",
      "deep:application:day_pillar:庚午:marriage",
      "deep:application:day_pillar:庚午:family",
      "deep:application:day_pillar:庚午:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.午 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 午",
        "proposition": "六庚日詩는 午의 丁己를 官印으로 설명하고 金敗라는 명칭만으로 불리함을 정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛未",
    "targetId": "foundation:day_pillar:辛未",
    "label": "신미일주",
    "stem": "辛",
    "branch": "未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏官"
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "정교한 구별이 온조한 자원·압력·지원의 혼합과 만나는 조합",
    "strengthMeaning": "복합적인 요구를 세밀하게 조정해 품질을 유지하는 방향",
    "overuseCondition": "좋은 결과를 위해 숨은 부담을 계속 감수할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛未#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛巳",
        "meaning": "일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이고, 같은 일간의 비교 일주 辛巳의 저장 구성은 丙(正官)·戊(正印)·庚(劫財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:癸未",
        "meaning": "辛未 / 癸未: 지지 未의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏印)·丁(偏官)·乙(偏財) / 己(偏官)·丁(偏財)·乙(食神)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛未:personality",
      "deep:application:day_pillar:辛未:career",
      "deep:application:day_pillar:辛未:money",
      "deep:application:day_pillar:辛未:study",
      "deep:application:day_pillar:辛未:love",
      "deep:application:day_pillar:辛未:marriage",
      "deep:application:day_pillar:辛未:family",
      "deep:application:day_pillar:辛未:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.未 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 未",
        "proposition": "六辛日詩는 未中木財·丁煞·己倒食을 들고 身旺·생조 조건을 본다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬申",
    "targetId": "foundation:day_pillar:壬申",
    "label": "임신일주",
    "stem": "壬",
    "branch": "申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "比肩"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "넓은 흐름이 배움과 금기의 지원을 받는 조합",
    "strengthMeaning": "다른 정보와 자원을 받아 큰 맥락으로 연결하는 방향",
    "overuseCondition": "새로 받아들일 것이 많아 실행의 초점이 흩어질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬申#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬午",
        "meaning": "일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이고, 같은 일간의 비교 일주 壬午의 저장 구성은 丁(正財)·己(正官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲申",
        "meaning": "壬申 / 甲申: 지지 申의 저장 집합은 같지만 기준 일간이 달라 각각 庚(偏印)·壬(比肩)·戊(偏官) / 庚(偏官)·壬(偏印)·戊(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬申:personality",
      "deep:application:day_pillar:壬申:career",
      "deep:application:day_pillar:壬申:money",
      "deep:application:day_pillar:壬申:study",
      "deep:application:day_pillar:壬申:love",
      "deep:application:day_pillar:壬申:marriage",
      "deep:application:day_pillar:壬申:family",
      "deep:application:day_pillar:壬申:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.申 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 申",
        "proposition": "六壬日詩는 申의 長生·學堂을 들고 財官의 별도 조건을 본다. 지적 능력·학력을 보증하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸酉",
    "targetId": "foundation:day_pillar:癸酉",
    "label": "계유일주",
    "stem": "癸",
    "branch": "酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "미세한 수기가 정돈된 배움과 검증의 지원을 받는 조합",
    "strengthMeaning": "잘 정리된 정보에서 중요한 차이를 찾아내는 가능성",
    "overuseCondition": "확인한 기준에 기대어 스스로 시도할 기회를 줄일 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸酉#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸未",
        "meaning": "일주 癸酉의 저장 구성은 辛(偏印)이고, 같은 일간의 비교 일주 癸未의 저장 구성은 己(偏官)·丁(偏財)·乙(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙酉",
        "meaning": "癸酉 / 乙酉: 지지 酉의 저장 집합은 같지만 기준 일간이 달라 각각 辛(偏印) / 辛(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸酉:personality",
      "deep:application:day_pillar:癸酉:career",
      "deep:application:day_pillar:癸酉:money",
      "deep:application:day_pillar:癸酉:study",
      "deep:application:day_pillar:癸酉:love",
      "deep:application:day_pillar:癸酉:marriage",
      "deep:application:day_pillar:癸酉:family",
      "deep:application:day_pillar:癸酉:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.酉 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 酉",
        "proposition": "六癸日詩는 酉의 衰敗 명칭과 身旺月의 도움을 함께 설명한다. 단계명을 현실 실패로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:甲戌",
    "targetId": "foundation:day_pillar:甲戌",
    "label": "갑술일주",
    "stem": "甲",
    "branch": "戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正官"
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "큰 원칙을 현실의 자원과 검증 기준에 착지시키는 조합",
    "strengthMeaning": "시작한 일을 결과물과 인수 기준까지 가져가는 방향",
    "overuseCondition": "책임과 성과를 한꺼번에 떠안아 수정할 여지를 줄일 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲戌#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "일주 甲戌의 저장 구성은 戊(偏財)·辛(正官)·丁(傷官)이고, 같은 일간의 비교 일주 甲子의 저장 구성은 癸(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙戌",
        "meaning": "甲戌 / 丙戌: 지지 戌의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏財)·辛(正官)·丁(傷官) / 戊(食神)·辛(正財)·丁(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲戌:personality",
      "deep:application:day_pillar:甲戌:career",
      "deep:application:day_pillar:甲戌:money",
      "deep:application:day_pillar:甲戌:study",
      "deep:application:day_pillar:甲戌:love",
      "deep:application:day_pillar:甲戌:marriage",
      "deep:application:day_pillar:甲戌:family",
      "deep:application:day_pillar:甲戌:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.戌 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 戌",
        "proposition": "六甲日詩는 戌中의 戊와 辛, 火氣를 함께 언급한다. 한 가지 재관 이름만으로 길흉을 정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙亥",
    "targetId": "foundation:day_pillar:乙亥",
    "label": "을해일주",
    "stem": "乙",
    "branch": "亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正印"
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "유연한 목기가 배움과 큰 흐름의 지원을 만나는 조합",
    "strengthMeaning": "다른 관점을 흡수해 연결할 수 있는 여지",
    "overuseCondition": "받아들이는 정보와 관계가 많아 자기 선택이 희미해질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙亥#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "일주 乙亥의 저장 구성은 壬(正印)·甲(劫財)이고, 같은 일간의 비교 일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁亥",
        "meaning": "乙亥 / 丁亥: 지지 亥의 저장 집합은 같지만 기준 일간이 달라 각각 壬(正印)·甲(劫財) / 壬(正官)·甲(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙亥:personality",
      "deep:application:day_pillar:乙亥:career",
      "deep:application:day_pillar:乙亥:money",
      "deep:application:day_pillar:乙亥:study",
      "deep:application:day_pillar:乙亥:love",
      "deep:application:day_pillar:乙亥:marriage",
      "deep:application:day_pillar:乙亥:family",
      "deep:application:day_pillar:乙亥:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.亥 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六乙日詩 / 亥",
        "proposition": "六乙日詩는 亥에서의 死 명칭과 壬의 生氣印綬를 함께 읽는다. 死를 실제 죽음으로 해석하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙子",
    "targetId": "foundation:day_pillar:丙子",
    "label": "병자일주",
    "stem": "丙",
    "branch": "子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "밝은 표현과 차가운 규율이 나란히 놓이는 조합",
    "strengthMeaning": "보이는 설명을 명확한 기준 안에 담는 가능성",
    "overuseCondition": "열정과 자기 검열이 번갈아 강해져 표현을 막을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙子#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "일주 丙子의 저장 구성은 癸(正官)이고, 같은 일간의 비교 일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "丙子 / 甲子: 지지 子의 저장 집합은 같지만 기준 일간이 달라 각각 癸(正官) / 癸(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙子:personality",
      "deep:application:day_pillar:丙子:career",
      "deep:application:day_pillar:丙子:money",
      "deep:application:day_pillar:丙子:study",
      "deep:application:day_pillar:丙子:love",
      "deep:application:day_pillar:丙子:marriage",
      "deep:application:day_pillar:丙子:family",
      "deep:application:day_pillar:丙子:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.子 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 子",
        "proposition": "六丙日詩는 子의 官鄉과 得時를 강조한다. 子中辛이라는 전사 표현은 현행 장간 癸와 맞지 않아 문자 교감 보류다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "六丙日詩의 子中辛 표현을 영인본과 교감할 것. 현행 子癸를 변경하지 않음.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁丑",
    "targetId": "foundation:day_pillar:丁丑",
    "label": "정축일주",
    "stem": "丁",
    "branch": "丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏官"
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "작은 불빛이 차갑게 저장된 현실 조건을 천천히 다루는 조합",
    "strengthMeaning": "복잡한 사정을 세심하게 관리하며 꾸준히 준비하는 가능성",
    "overuseCondition": "온기를 쓰는 일보다 문제를 보관하는 데 힘을 소진할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁丑#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "일주 丁丑의 저장 구성은 己(食神)·癸(偏官)·辛(偏財)이고, 같은 일간의 비교 일주 丁卯의 저장 구성은 乙(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "丁丑 / 乙丑: 지지 丑의 저장 집합은 같지만 기준 일간이 달라 각각 己(食神)·癸(偏官)·辛(偏財) / 己(偏財)·癸(偏印)·辛(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁丑:personality",
      "deep:application:day_pillar:丁丑:career",
      "deep:application:day_pillar:丁丑:money",
      "deep:application:day_pillar:丁丑:study",
      "deep:application:day_pillar:丁丑:love",
      "deep:application:day_pillar:丁丑:marriage",
      "deep:application:day_pillar:丁丑:family",
      "deep:application:day_pillar:丁丑:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.丑 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 丑",
        "proposition": "六丁日詩는 丑의 金庫·癸水 잔여를 들어 財官과 월시의 조건을 함께 본다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊寅",
    "targetId": "foundation:day_pillar:戊寅",
    "label": "무인일주",
    "stem": "戊",
    "branch": "寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏印"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "유지하려는 큰 틀이 새 방향과 요구를 받아 조정되는 조합",
    "strengthMeaning": "외부 과제를 받아 구조를 현실에 맞게 바꾸는 방향",
    "overuseCondition": "강한 요구를 전부 책임으로 받아들여 경직될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊寅#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "일주 戊寅의 저장 구성은 甲(偏官)·丙(偏印)·戊(比肩)이고, 같은 일간의 비교 일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "戊寅 / 丙寅: 지지 寅의 저장 집합은 같지만 기준 일간이 달라 각각 甲(偏官)·丙(偏印)·戊(比肩) / 甲(偏印)·丙(比肩)·戊(食神)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊寅:personality",
      "deep:application:day_pillar:戊寅:career",
      "deep:application:day_pillar:戊寅:money",
      "deep:application:day_pillar:戊寅:study",
      "deep:application:day_pillar:戊寅:love",
      "deep:application:day_pillar:戊寅:marriage",
      "deep:application:day_pillar:戊寅:family",
      "deep:application:day_pillar:戊寅:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.寅 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 寅",
        "proposition": "六戊日詩는 寅中甲의 偏官과 火生土의 도움을 함께 설명한다. 압력만 떼어 내 흉으로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己卯",
    "targetId": "foundation:day_pillar:己卯",
    "label": "기묘일주",
    "stem": "己",
    "branch": "卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "세밀한 현실 조정이 선명한 외부 요구와 만나는 조합",
    "strengthMeaning": "까다로운 조건을 작은 실행 단계로 풀어내는 가능성",
    "overuseCondition": "요구에 맞추느라 생활의 세부까지 긴장할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己卯#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "일주 己卯의 저장 구성은 乙(偏官)이고, 같은 일간의 비교 일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "己卯 / 丁卯: 지지 卯의 저장 집합은 같지만 기준 일간이 달라 각각 乙(偏官) / 乙(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己卯:personality",
      "deep:application:day_pillar:己卯:career",
      "deep:application:day_pillar:己卯:money",
      "deep:application:day_pillar:己卯:study",
      "deep:application:day_pillar:己卯:love",
      "deep:application:day_pillar:己卯:marriage",
      "deep:application:day_pillar:己卯:family",
      "deep:application:day_pillar:己卯:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.卯 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 卯",
        "proposition": "六己日詩는 卯中乙의 偏官과 己土司令·得地의 힘을 함께 요구한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚辰",
    "targetId": "foundation:day_pillar:庚辰",
    "label": "경진일주",
    "stem": "庚",
    "branch": "辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正財"
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "단단한 결단이 습토의 자원 저장과 만나는 조합",
    "strengthMeaning": "복잡한 자원을 정리해 실행 가능한 체계를 만드는 가능성",
    "overuseCondition": "정리와 통제의 범위가 커져 보류된 사정을 잘라낼 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚辰#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "일주 庚辰의 저장 구성은 戊(偏印)·乙(正財)·癸(傷官)이고, 같은 일간의 비교 일주 庚午의 저장 구성은 丁(正官)·己(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "庚辰 / 戊辰: 지지 辰의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏印)·乙(正財)·癸(傷官) / 戊(比肩)·乙(正官)·癸(正財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚辰:personality",
      "deep:application:day_pillar:庚辰:career",
      "deep:application:day_pillar:庚辰:money",
      "deep:application:day_pillar:庚辰:study",
      "deep:application:day_pillar:庚辰:love",
      "deep:application:day_pillar:庚辰:marriage",
      "deep:application:day_pillar:庚辰:family",
      "deep:application:day_pillar:庚辰:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.辰 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 辰",
        "proposition": "六庚日詩는 辰의 魁罡 이름·乙餘氣와 다른 격에 드는 조건을 병기한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛巳",
    "targetId": "foundation:day_pillar:辛巳",
    "label": "신사일주",
    "stem": "辛",
    "branch": "巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正官"
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正印"
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "정교한 금기가 강한 열과 규율 속에서 다듬어지는 조합",
    "strengthMeaning": "엄격한 검증을 거쳐 세부 품질을 끌어올리는 가능성",
    "overuseCondition": "평가 기준에 맞추려 계속 자신을 과도하게 수정할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛巳#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "일주 辛巳의 저장 구성은 丙(正官)·戊(正印)·庚(劫財)이고, 같은 일간의 비교 일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "辛巳 / 己巳: 지지 巳의 저장 집합은 같지만 기준 일간이 달라 각각 丙(正官)·戊(正印)·庚(劫財) / 丙(正印)·戊(劫財)·庚(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛巳:personality",
      "deep:application:day_pillar:辛巳:career",
      "deep:application:day_pillar:辛巳:money",
      "deep:application:day_pillar:辛巳:study",
      "deep:application:day_pillar:辛巳:love",
      "deep:application:day_pillar:辛巳:marriage",
      "deep:application:day_pillar:辛巳:family",
      "deep:application:day_pillar:辛巳:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.巳 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 巳",
        "proposition": "六辛日詩는 巳의 官印과 死地에도 의지할 조건이 있음을 설명한다. 死는 사건이 아니다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "六辛日詩의 丙戌建祿 표기는 원문 글자 교감 필요. 현행 丙戊庚 장간을 유지하며 戌을 천간으로 취급하지 않음.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬午",
    "targetId": "foundation:day_pillar:壬午",
    "label": "임오일주",
    "stem": "壬",
    "branch": "午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正財"
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "넓은 흐름이 따뜻한 자원과 생활의 규율에 닿는 조합",
    "strengthMeaning": "큰 가능성을 실제 필요와 약속에 연결하는 방향",
    "overuseCondition": "기회와 책임을 동시에 늘려 자신이 감당할 흐름을 넘길 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬午#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "일주 壬午의 저장 구성은 丁(正財)·己(正官)이고, 같은 일간의 비교 일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "壬午 / 庚午: 지지 午의 저장 집합은 같지만 기준 일간이 달라 각각 丁(正財)·己(正官) / 丁(正官)·己(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬午:personality",
      "deep:application:day_pillar:壬午:career",
      "deep:application:day_pillar:壬午:money",
      "deep:application:day_pillar:壬午:study",
      "deep:application:day_pillar:壬午:love",
      "deep:application:day_pillar:壬午:marriage",
      "deep:application:day_pillar:壬午:family",
      "deep:application:day_pillar:壬午:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.午 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 午",
        "proposition": "六壬日詩는 午의 祿馬同鄉·財官을 설명한다. 실제 지위·재산을 뜻하는 것으로 승격하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸未",
    "targetId": "foundation:day_pillar:癸未",
    "label": "계미일주",
    "stem": "癸",
    "branch": "未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏財"
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "미세한 흐름이 온조한 토양의 자원·압력과 만나는 조합",
    "strengthMeaning": "복합적인 사정을 세심하게 조율해 생활을 유지하는 방향",
    "overuseCondition": "작은 요구를 모두 받아들여 부담이 누적될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸未#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "일주 癸未의 저장 구성은 己(偏官)·丁(偏財)·乙(食神)이고, 같은 일간의 비교 일주 癸酉의 저장 구성은 辛(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "癸未 / 辛未: 지지 未의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏官)·丁(偏財)·乙(食神) / 己(偏印)·丁(偏官)·乙(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸未:personality",
      "deep:application:day_pillar:癸未:career",
      "deep:application:day_pillar:癸未:money",
      "deep:application:day_pillar:癸未:study",
      "deep:application:day_pillar:癸未:love",
      "deep:application:day_pillar:癸未:marriage",
      "deep:application:day_pillar:癸未:family",
      "deep:application:day_pillar:癸未:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.未 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 未",
        "proposition": "六癸日詩는 未의 偏官偏財와 身旺·제화 조건을 든다. 질박하다는 원문 평을 고정 성격으로 승인하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:甲申",
    "targetId": "foundation:day_pillar:甲申",
    "label": "갑신일주",
    "stem": "甲",
    "branch": "申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏印"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "자기 방향을 외부의 엄격한 시험과 맞대는 조합",
    "strengthMeaning": "도전의 규칙을 파악하고 기술을 보완하는 힘",
    "overuseCondition": "모든 평가를 생존 경쟁으로 받아들여 힘을 과하게 쓸 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲申#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "일주 甲申의 저장 구성은 庚(偏官)·壬(偏印)·戊(偏財)이고, 같은 일간의 비교 일주 甲子의 저장 구성은 癸(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "甲申 / 壬申: 지지 申의 저장 집합은 같지만 기준 일간이 달라 각각 庚(偏官)·壬(偏印)·戊(偏財) / 庚(偏印)·壬(比肩)·戊(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲申:personality",
      "deep:application:day_pillar:甲申:career",
      "deep:application:day_pillar:甲申:money",
      "deep:application:day_pillar:甲申:study",
      "deep:application:day_pillar:甲申:love",
      "deep:application:day_pillar:甲申:marriage",
      "deep:application:day_pillar:甲申:family",
      "deep:application:day_pillar:甲申:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.申 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 申",
        "proposition": "六甲日詩는 申中庚의 압력과 가을 조건을 언급한다. 제화·생조 여부 없이 위해를 확정할 수 없다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙酉",
    "targetId": "foundation:day_pillar:乙酉",
    "label": "을유일주",
    "stem": "乙",
    "branch": "酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "부드러운 조정 방식이 선명한 평가 기준과 맞닿는 조합",
    "strengthMeaning": "세부를 조율해 외부 기준에 맞는 결과를 만드는 가능성",
    "overuseCondition": "평가받는 느낌 때문에 자기 의견을 지나치게 깎을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙酉#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "일주 乙酉의 저장 구성은 辛(偏官)이고, 같은 일간의 비교 일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "乙酉 / 癸酉: 지지 酉의 저장 집합은 같지만 기준 일간이 달라 각각 辛(偏官) / 辛(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙酉:personality",
      "deep:application:day_pillar:乙酉:career",
      "deep:application:day_pillar:乙酉:money",
      "deep:application:day_pillar:乙酉:study",
      "deep:application:day_pillar:乙酉:love",
      "deep:application:day_pillar:乙酉:marriage",
      "deep:application:day_pillar:乙酉:family",
      "deep:application:day_pillar:乙酉:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.酉 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm5",
        "locator": "論偏官 / 天元坐煞 (乙酉例)",
        "proposition": "卷四 六乙日詩 전사에는 酉의 독립 항목이 빠져 있다. 卷五 天元坐煞는 甲申·乙酉를 예로 들고 身旺·제화 조건을 둔다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "六乙日詩의 酉 누락을 영인본과 교감할 것. 별도 天元坐煞 절만 현재 직접 확인함.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙戌",
    "targetId": "foundation:day_pillar:丙戌",
    "label": "병술일주",
    "stem": "丙",
    "branch": "戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正財"
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "표현의 열기를 결과가 남는 틀 안에 담는 조합",
    "strengthMeaning": "생각을 끝까지 다듬어 전달할 산출물로 남기는 방향",
    "overuseCondition": "완성도와 신념을 한데 묶어 피드백을 거부할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙戌#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "일주 丙戌의 저장 구성은 戊(食神)·辛(正財)·丁(劫財)이고, 같은 일간의 비교 일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲戌",
        "meaning": "丙戌 / 甲戌: 지지 戌의 저장 집합은 같지만 기준 일간이 달라 각각 戊(食神)·辛(正財)·丁(劫財) / 戊(偏財)·辛(正官)·丁(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙戌:personality",
      "deep:application:day_pillar:丙戌:career",
      "deep:application:day_pillar:丙戌:money",
      "deep:application:day_pillar:丙戌:study",
      "deep:application:day_pillar:丙戌:love",
      "deep:application:day_pillar:丙戌:marriage",
      "deep:application:day_pillar:丙戌:family",
      "deep:application:day_pillar:丙戌:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.戌 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 戌",
        "proposition": "六丙日詩는 戌의 辛金 잔여와 火墓·여름의 財官 조건을 설명한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁亥",
    "targetId": "foundation:day_pillar:丁亥",
    "label": "정해일주",
    "stem": "丁",
    "branch": "亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正官"
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "섬세한 표현이 넓은 수기·규율·배움과 맞닿는 조합",
    "strengthMeaning": "깊은 이해를 상대가 받아들일 말로 조정하는 방향",
    "overuseCondition": "상대의 기준과 감정을 너무 많이 수용해 경계가 희미해질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁亥#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "일주 丁亥의 저장 구성은 壬(正官)·甲(正印)이고, 같은 일간의 비교 일주 丁卯의 저장 구성은 乙(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙亥",
        "meaning": "丁亥 / 乙亥: 지지 亥의 저장 집합은 같지만 기준 일간이 달라 각각 壬(正官)·甲(正印) / 壬(正印)·甲(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁亥:personality",
      "deep:application:day_pillar:丁亥:career",
      "deep:application:day_pillar:丁亥:money",
      "deep:application:day_pillar:丁亥:study",
      "deep:application:day_pillar:丁亥:love",
      "deep:application:day_pillar:丁亥:marriage",
      "deep:application:day_pillar:丁亥:family",
      "deep:application:day_pillar:丁亥:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.亥 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 亥",
        "proposition": "六丁日詩는 亥의 壬官과 日貴 이름을 들며 시주 조건을 더한다. 귀인 명칭만으로 지위를 보장하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊子",
    "targetId": "foundation:day_pillar:戊子",
    "label": "무자일주",
    "stem": "戊",
    "branch": "子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "큰 기반을 유동적인 필요와 자원 흐름에 연결하는 조합",
    "strengthMeaning": "안정된 틀 안에서 지출·서비스의 흐름을 관리하는 가능성",
    "overuseCondition": "안정을 지키려 모든 흐름을 붙잡아 변경을 어렵게 할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊子#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "일주 戊子의 저장 구성은 癸(正財)이고, 같은 일간의 비교 일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "戊子 / 甲子: 지지 子의 저장 집합은 같지만 기준 일간이 달라 각각 癸(正財) / 癸(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊子:personality",
      "deep:application:day_pillar:戊子:career",
      "deep:application:day_pillar:戊子:money",
      "deep:application:day_pillar:戊子:study",
      "deep:application:day_pillar:戊子:love",
      "deep:application:day_pillar:戊子:marriage",
      "deep:application:day_pillar:戊子:family",
      "deep:application:day_pillar:戊子:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.子 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 子",
        "proposition": "六戊日詩는 子中癸財를 짚고 다른 기둥의 조건을 든다. 水財를 실제 소득으로 바로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己丑",
    "targetId": "foundation:day_pillar:己丑",
    "label": "기축일주",
    "stem": "己",
    "branch": "丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏財"
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "작은 토양이 한습한 저장 구조에서 자원을 천천히 다루는 조합",
    "strengthMeaning": "빠뜨린 비용과 유지 항목을 챙겨 지속성을 높이는 방향",
    "overuseCondition": "아껴 두는 일이 필요한 사용과 표현까지 미룰 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己丑#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "일주 己丑의 저장 구성은 己(比肩)·癸(偏財)·辛(食神)이고, 같은 일간의 비교 일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "己丑 / 乙丑: 지지 丑의 저장 집합은 같지만 기준 일간이 달라 각각 己(比肩)·癸(偏財)·辛(食神) / 己(偏財)·癸(偏印)·辛(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己丑:personality",
      "deep:application:day_pillar:己丑:career",
      "deep:application:day_pillar:己丑:money",
      "deep:application:day_pillar:己丑:study",
      "deep:application:day_pillar:己丑:love",
      "deep:application:day_pillar:己丑:marriage",
      "deep:application:day_pillar:己丑:family",
      "deep:application:day_pillar:己丑:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.丑 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 丑",
        "proposition": "六己日詩는 丑의 財鄉과 월의 도움을 함께 든다. 藏財를 실제 저축액으로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚寅",
    "targetId": "foundation:day_pillar:庚寅",
    "label": "경인일주",
    "stem": "庚",
    "branch": "寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏官"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "단단한 실행이 성장 자원과 외부 과제를 동시에 상대하는 조합",
    "strengthMeaning": "새 환경의 문제를 명확한 실행 과제로 바꾸는 방향",
    "overuseCondition": "기회를 잡으려 긴장과 부담까지 한꺼번에 떠안을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚寅#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "일주 庚寅의 저장 구성은 甲(偏財)·丙(偏官)·戊(偏印)이고, 같은 일간의 비교 일주 庚午의 저장 구성은 丁(正官)·己(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "庚寅 / 丙寅: 지지 寅의 저장 집합은 같지만 기준 일간이 달라 각각 甲(偏財)·丙(偏官)·戊(偏印) / 甲(偏印)·丙(比肩)·戊(食神)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚寅:personality",
      "deep:application:day_pillar:庚寅:career",
      "deep:application:day_pillar:庚寅:money",
      "deep:application:day_pillar:庚寅:study",
      "deep:application:day_pillar:庚寅:love",
      "deep:application:day_pillar:庚寅:marriage",
      "deep:application:day_pillar:庚寅:family",
      "deep:application:day_pillar:庚寅:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.寅 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 寅",
        "proposition": "六庚日詩는 寅의 財煞 생왕과 身旺·化鬼 조건을 함께 든다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛卯",
    "targetId": "foundation:day_pillar:辛卯",
    "label": "신묘일주",
    "stem": "辛",
    "branch": "卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "정교한 판단을 성장하는 실용 자원에 적용하는 조합",
    "strengthMeaning": "필요한 것의 가치를 세밀하게 가려 쓰는 방향",
    "overuseCondition": "가치 비교가 많아져 만족을 느낄 기준이 계속 높아질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛卯#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "일주 辛卯의 저장 구성은 乙(偏財)이고, 같은 일간의 비교 일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "辛卯 / 丁卯: 지지 卯의 저장 집합은 같지만 기준 일간이 달라 각각 乙(偏財) / 乙(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛卯:personality",
      "deep:application:day_pillar:辛卯:career",
      "deep:application:day_pillar:辛卯:money",
      "deep:application:day_pillar:辛卯:study",
      "deep:application:day_pillar:辛卯:love",
      "deep:application:day_pillar:辛卯:marriage",
      "deep:application:day_pillar:辛卯:family",
      "deep:application:day_pillar:辛卯:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.卯 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 卯",
        "proposition": "六辛日詩는 卯의 財地와 身衰 명칭을 나누고 시주의 도움을 본다. 재지가 실제 부를 뜻하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬辰",
    "targetId": "foundation:day_pillar:壬辰",
    "label": "임진일주",
    "stem": "壬",
    "branch": "辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "傷官"
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "넓은 수기가 습토의 저장·경계와 만나는 조합",
    "strengthMeaning": "많은 가능성을 담아 장기적인 구조로 묶는 방향",
    "overuseCondition": "확장과 보존을 동시에 추구해 결정이 크게 흔들릴 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬辰#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "일주 壬辰의 저장 구성은 戊(偏官)·乙(傷官)·癸(劫財)이고, 같은 일간의 비교 일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "壬辰 / 戊辰: 지지 辰의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏官)·乙(傷官)·癸(劫財) / 戊(比肩)·乙(正官)·癸(正財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬辰:personality",
      "deep:application:day_pillar:壬辰:career",
      "deep:application:day_pillar:壬辰:money",
      "deep:application:day_pillar:壬辰:study",
      "deep:application:day_pillar:壬辰:love",
      "deep:application:day_pillar:壬辰:marriage",
      "deep:application:day_pillar:壬辰:family",
      "deep:application:day_pillar:壬辰:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.辰 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 辰",
        "proposition": "六壬日詩는 辰의 魁罡·制禦와 다른 격의 조건을 나누어 설명한다. 단일 일주로 격을 판정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸巳",
    "targetId": "foundation:day_pillar:癸巳",
    "label": "계사일주",
    "stem": "癸",
    "branch": "巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正財"
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正官"
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "미세한 수기를 열기·자원·규율·지원의 혼합에 적용하는 조합",
    "strengthMeaning": "복잡한 환경의 세부를 읽어 실행 방법을 조정하는 가능성",
    "overuseCondition": "조건을 계속 맞추느라 본인의 한계가 보이지 않을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸巳#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "일주 癸巳의 저장 구성은 丙(正財)·戊(正官)·庚(正印)이고, 같은 일간의 비교 일주 癸酉의 저장 구성은 辛(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "癸巳 / 己巳: 지지 巳의 저장 집합은 같지만 기준 일간이 달라 각각 丙(正財)·戊(正官)·庚(正印) / 丙(正印)·戊(劫財)·庚(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸巳:personality",
      "deep:application:day_pillar:癸巳:career",
      "deep:application:day_pillar:癸巳:money",
      "deep:application:day_pillar:癸巳:study",
      "deep:application:day_pillar:癸巳:love",
      "deep:application:day_pillar:癸巳:marriage",
      "deep:application:day_pillar:癸巳:family",
      "deep:application:day_pillar:癸巳:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.巳 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 巳",
        "proposition": "六癸日詩는 巳의 財官印 생왕을 언급하고 시주 조건을 둔다. 세 이름의 완비가 성공 보증은 아니다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:甲午",
    "targetId": "foundation:day_pillar:甲午",
    "label": "갑오일주",
    "stem": "甲",
    "branch": "午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "傷官"
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "방향을 공개적인 표현과 산출로 밀어내는 조합",
    "strengthMeaning": "생각을 전달 가능한 형태로 빠르게 드러내는 가능성",
    "overuseCondition": "발표와 실행이 앞서가 자원·지속 가능성 확인을 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲午#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "일주 甲午의 저장 구성은 丁(傷官)·己(正財)이고, 같은 일간의 비교 일주 甲子의 저장 구성은 癸(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "甲午 / 庚午: 지지 午의 저장 집합은 같지만 기준 일간이 달라 각각 丁(傷官)·己(正財) / 丁(正官)·己(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲午:personality",
      "deep:application:day_pillar:甲午:career",
      "deep:application:day_pillar:甲午:money",
      "deep:application:day_pillar:甲午:study",
      "deep:application:day_pillar:甲午:love",
      "deep:application:day_pillar:甲午:marriage",
      "deep:application:day_pillar:甲午:family",
      "deep:application:day_pillar:甲午:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.午 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 午",
        "proposition": "六甲日詩는 午中己財와 丁傷官을 짚으며 여름 조건을 별도로 둔다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙未",
    "targetId": "foundation:day_pillar:乙未",
    "label": "을미일주",
    "stem": "乙",
    "branch": "未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "食神"
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "부드러운 성장과 저장된 온기·현실 자원을 함께 다루는 조합",
    "strengthMeaning": "사람이 익숙해질 시간을 주면서 결과를 만들어 가는 방향",
    "overuseCondition": "배려와 오래된 약속이 누적되어 새 요구를 거절하기 어려울 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙未#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "일주 乙未의 저장 구성은 己(偏財)·丁(食神)·乙(比肩)이고, 같은 일간의 비교 일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "乙未 / 辛未: 지지 未의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏財)·丁(食神)·乙(比肩) / 己(偏印)·丁(偏官)·乙(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙未:personality",
      "deep:application:day_pillar:乙未:career",
      "deep:application:day_pillar:乙未:money",
      "deep:application:day_pillar:乙未:study",
      "deep:application:day_pillar:乙未:love",
      "deep:application:day_pillar:乙未:marriage",
      "deep:application:day_pillar:乙未:family",
      "deep:application:day_pillar:乙未:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.未 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六乙日詩 / 未",
        "proposition": "六乙日詩는 未의 木本局·己財와 丁傷官이라는 표현을 쓴다. 丁의 명칭은 현행 乙→丁 食神과 충돌하므로 전사 확인 사실만 남기고 십성 정의로 사용하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      },
      {
        "sourceId": "completion-repo-ten-gods",
        "locator": "getTenGod(乙, 丁)",
        "proposition": "동일 음양의 목이 화를 생하는 현행 관계는 食神이며 원문 丁傷官과 구별한다."
      }
    ],
    "followUp": [
      "六乙日詩의 丁傷官은 현행 乙丁 食神과 충돌한다. 십성 정의로 채택하지 않고 영인본·타 판본을 교감할 것.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙申",
    "targetId": "foundation:day_pillar:丙申",
    "label": "병신일주",
    "stem": "丙",
    "branch": "申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏官"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "공개적인 추진을 실용 자원과 외부 시험에 연결하는 조합",
    "strengthMeaning": "아이디어를 시장·평가의 언어로 빠르게 시험하는 가능성",
    "overuseCondition": "기회와 압력을 모두 받아들여 속도 조절을 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙申#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "일주 丙申의 저장 구성은 庚(偏財)·壬(偏官)·戊(食神)이고, 같은 일간의 비교 일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "丙申 / 壬申: 지지 申의 저장 집합은 같지만 기준 일간이 달라 각각 庚(偏財)·壬(偏官)·戊(食神) / 庚(偏印)·壬(比肩)·戊(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙申:personality",
      "deep:application:day_pillar:丙申:career",
      "deep:application:day_pillar:丙申:money",
      "deep:application:day_pillar:丙申:study",
      "deep:application:day_pillar:丙申:love",
      "deep:application:day_pillar:丙申:marriage",
      "deep:application:day_pillar:丙申:family",
      "deep:application:day_pillar:丙申:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.申 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 申",
        "proposition": "六丙日詩는 申中庚財·壬煞와 通月을 함께 짚는다. 재·살의 존재가 수익·재난을 뜻하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁酉",
    "targetId": "foundation:day_pillar:丁酉",
    "label": "정유일주",
    "stem": "丁",
    "branch": "酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "정교한 불빛을 구체적인 자원과 완성 기준에 비추는 조합",
    "strengthMeaning": "작은 차이를 결과물의 품질로 바꾸는 가능성",
    "overuseCondition": "좋고 나쁨의 평가가 섬세함을 넘어 까다로운 통제가 될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁酉#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "일주 丁酉의 저장 구성은 辛(偏財)이고, 같은 일간의 비교 일주 丁卯의 저장 구성은 乙(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "丁酉 / 癸酉: 지지 酉의 저장 집합은 같지만 기준 일간이 달라 각각 辛(偏財) / 辛(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁酉:personality",
      "deep:application:day_pillar:丁酉:career",
      "deep:application:day_pillar:丁酉:money",
      "deep:application:day_pillar:丁酉:study",
      "deep:application:day_pillar:丁酉:love",
      "deep:application:day_pillar:丁酉:marriage",
      "deep:application:day_pillar:丁酉:family",
      "deep:application:day_pillar:丁酉:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.酉 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 酉",
        "proposition": "六丁日詩는 酉에서 長生·學堂을 언급한다. 이는 음간 운성의 해당 전승이며 학업 성적을 보증하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊戌",
    "targetId": "foundation:day_pillar:戊戌",
    "label": "무술일주",
    "stem": "戊",
    "branch": "戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "傷官"
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "큰 틀과 경계가 건조한 저장 기반에서 겹치는 조합",
    "strengthMeaning": "오랫동안 지킬 기준을 만들고 마감을 책임지는 방향",
    "overuseCondition": "기준을 지키는 일이 변화 자체를 막는 방어가 될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊戌#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "일주 戊戌의 저장 구성은 戊(比肩)·辛(傷官)·丁(正印)이고, 같은 일간의 비교 일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲戌",
        "meaning": "戊戌 / 甲戌: 지지 戌의 저장 집합은 같지만 기준 일간이 달라 각각 戊(比肩)·辛(傷官)·丁(正印) / 戊(偏財)·辛(正官)·丁(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊戌:personality",
      "deep:application:day_pillar:戊戌:career",
      "deep:application:day_pillar:戊戌:money",
      "deep:application:day_pillar:戊戌:study",
      "deep:application:day_pillar:戊戌:love",
      "deep:application:day_pillar:戊戌:marriage",
      "deep:application:day_pillar:戊戌:family",
      "deep:application:day_pillar:戊戌:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.戌 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 戌",
        "proposition": "六戊日詩는 戊戌의 魁罡 논법과 다른 격에 들어가는 경우를 구분한다. 단일 일주로 격을 확정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己亥",
    "targetId": "foundation:day_pillar:己亥",
    "label": "기해일주",
    "stem": "己",
    "branch": "亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正財"
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "세밀한 생활 기반이 흐르는 자원과 성장 요구를 만나는 조합",
    "strengthMeaning": "변하는 사정을 현실적으로 받아들여 지원하는 가능성",
    "overuseCondition": "여러 필요를 받아 주다 본인의 생활 기반이 약해질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己亥#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "일주 己亥의 저장 구성은 壬(正財)·甲(正官)이고, 같은 일간의 비교 일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙亥",
        "meaning": "己亥 / 乙亥: 지지 亥의 저장 집합은 같지만 기준 일간이 달라 각각 壬(正財)·甲(正官) / 壬(正印)·甲(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己亥:personality",
      "deep:application:day_pillar:己亥:career",
      "deep:application:day_pillar:己亥:money",
      "deep:application:day_pillar:己亥:study",
      "deep:application:day_pillar:己亥:love",
      "deep:application:day_pillar:己亥:marriage",
      "deep:application:day_pillar:己亥:family",
      "deep:application:day_pillar:己亥:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.亥 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 亥",
        "proposition": "六己日詩는 亥를 財官 자리로 설명하면서 다른 기둥·시주를 확인한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚子",
    "targetId": "foundation:day_pillar:庚子",
    "label": "경자일주",
    "stem": "庚",
    "branch": "子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "단단한 생각이 많은 설명과 산출로 풀려 나가는 조합",
    "strengthMeaning": "복잡한 문제를 명료한 말과 도구로 해체하는 가능성",
    "overuseCondition": "날카로운 분석이 관계의 맥락을 지워 버릴 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚子#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "일주 庚子의 저장 구성은 癸(傷官)이고, 같은 일간의 비교 일주 庚午의 저장 구성은 丁(正官)·己(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "庚子 / 甲子: 지지 子의 저장 집합은 같지만 기준 일간이 달라 각각 癸(傷官) / 癸(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚子:personality",
      "deep:application:day_pillar:庚子:career",
      "deep:application:day_pillar:庚子:money",
      "deep:application:day_pillar:庚子:study",
      "deep:application:day_pillar:庚子:love",
      "deep:application:day_pillar:庚子:marriage",
      "deep:application:day_pillar:庚子:family",
      "deep:application:day_pillar:庚子:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.子 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 子",
        "proposition": "六庚日詩는 子의 金沈 비유와 월·丁火의 조절을 든다. 실제 침몰·사고 해석은 배제한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛丑",
    "targetId": "foundation:day_pillar:辛丑",
    "label": "신축일주",
    "stem": "辛",
    "branch": "丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "食神"
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "정교한 금기가 한습한 저장 기반에서 천천히 산출을 준비하는 조합",
    "strengthMeaning": "축적한 자료를 정확하게 골라 신뢰할 결과로 만드는 가능성",
    "overuseCondition": "틀리지 않으려는 준비가 공개와 사용을 늦출 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛丑#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "일주 辛丑의 저장 구성은 己(偏印)·癸(食神)·辛(比肩)이고, 같은 일간의 비교 일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "辛丑 / 乙丑: 지지 丑의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏印)·癸(食神)·辛(比肩) / 己(偏財)·癸(偏印)·辛(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛丑:personality",
      "deep:application:day_pillar:辛丑:career",
      "deep:application:day_pillar:辛丑:money",
      "deep:application:day_pillar:辛丑:study",
      "deep:application:day_pillar:辛丑:love",
      "deep:application:day_pillar:辛丑:marriage",
      "deep:application:day_pillar:辛丑:family",
      "deep:application:day_pillar:辛丑:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.丑 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 丑",
        "proposition": "六辛日詩는 丑中癸食과 財官의 별도 조건을 든다. 장간·월령·투출은 서로 다른 정보다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬寅",
    "targetId": "foundation:day_pillar:壬寅",
    "label": "임인일주",
    "stem": "壬",
    "branch": "寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏財"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "넓은 흐름을 성장과 산출의 방향으로 내보내는 조합",
    "strengthMeaning": "다양한 가능성을 새로운 활동과 설명으로 전환하는 방향",
    "overuseCondition": "확장이 계속되어 진행 중인 일을 마무리하지 못할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬寅#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "일주 壬寅의 저장 구성은 甲(食神)·丙(偏財)·戊(偏官)이고, 같은 일간의 비교 일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "壬寅 / 丙寅: 지지 寅의 저장 집합은 같지만 기준 일간이 달라 각각 甲(食神)·丙(偏財)·戊(偏官) / 甲(偏印)·丙(比肩)·戊(食神)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬寅:personality",
      "deep:application:day_pillar:壬寅:career",
      "deep:application:day_pillar:壬寅:money",
      "deep:application:day_pillar:壬寅:study",
      "deep:application:day_pillar:壬寅:love",
      "deep:application:day_pillar:壬寅:marriage",
      "deep:application:day_pillar:壬寅:family",
      "deep:application:day_pillar:壬寅:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.寅 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 寅",
        "proposition": "六壬日詩는 寅의 財食 생왕·水火旣濟 비유를 들고 시주의 조건을 더한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸卯",
    "targetId": "foundation:day_pillar:癸卯",
    "label": "계묘일주",
    "stem": "癸",
    "branch": "卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "미세한 수기가 부드러운 성장과 산출로 이어지는 조합",
    "strengthMeaning": "작은 관찰을 다른 사람이 이해할 표현으로 키우는 방향",
    "overuseCondition": "섬세한 표현을 계속 다듬느라 마감을 늦출 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸卯#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "일주 癸卯의 저장 구성은 乙(食神)이고, 같은 일간의 비교 일주 癸酉의 저장 구성은 辛(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "癸卯 / 丁卯: 지지 卯의 저장 집합은 같지만 기준 일간이 달라 각각 乙(食神) / 乙(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸卯:personality",
      "deep:application:day_pillar:癸卯:career",
      "deep:application:day_pillar:癸卯:money",
      "deep:application:day_pillar:癸卯:study",
      "deep:application:day_pillar:癸卯:love",
      "deep:application:day_pillar:癸卯:marriage",
      "deep:application:day_pillar:癸卯:family",
      "deep:application:day_pillar:癸卯:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.卯 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 卯",
        "proposition": "六癸日詩는 卯의 長生學堂·食神 건왕과 財官의 별도 조건을 설명한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:甲辰",
    "targetId": "foundation:day_pillar:甲辰",
    "label": "갑진일주",
    "stem": "甲",
    "branch": "辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏財"
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "劫財"
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正印"
      }
    ],
    "coreMeaning": "큰 줄기를 세우되 여러 가능성을 안에 보관하는 조합",
    "strengthMeaning": "서로 다른 자료와 자원을 묶어 다음 단계의 기반을 만드는 방향",
    "overuseCondition": "준비 중인 선택지가 쌓여 실행 결정을 미룰 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲辰#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "일주 甲辰의 저장 구성은 戊(偏財)·乙(劫財)·癸(正印)이고, 같은 일간의 비교 일주 甲子의 저장 구성은 癸(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "甲辰 / 戊辰: 지지 辰의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏財)·乙(劫財)·癸(正印) / 戊(比肩)·乙(正官)·癸(正財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲辰:personality",
      "deep:application:day_pillar:甲辰:career",
      "deep:application:day_pillar:甲辰:money",
      "deep:application:day_pillar:甲辰:study",
      "deep:application:day_pillar:甲辰:love",
      "deep:application:day_pillar:甲辰:marriage",
      "deep:application:day_pillar:甲辰:family",
      "deep:application:day_pillar:甲辰:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.辰 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 辰",
        "proposition": "六甲日詩는 辰의 財庫 비유와 수기의 발생을 함께 든다. 창고를 실제 재산으로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙巳",
    "targetId": "foundation:day_pillar:乙巳",
    "label": "을사일주",
    "stem": "乙",
    "branch": "巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "傷官"
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正財"
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "유연한 목기가 강한 표현과 현실 검증의 열기를 만나는 조합",
    "strengthMeaning": "상황에 맞춰 제안 방식을 바꾸고 반응을 빠르게 읽는 방향",
    "overuseCondition": "반응을 끌어내려 여러 요구에 동시에 맞추다 소진될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙巳#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "일주 乙巳의 저장 구성은 丙(傷官)·戊(正財)·庚(正官)이고, 같은 일간의 비교 일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "乙巳 / 己巳: 지지 巳의 저장 집합은 같지만 기준 일간이 달라 각각 丙(傷官)·戊(正財)·庚(正官) / 丙(正印)·戊(劫財)·庚(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙巳:personality",
      "deep:application:day_pillar:乙巳:career",
      "deep:application:day_pillar:乙巳:money",
      "deep:application:day_pillar:乙巳:study",
      "deep:application:day_pillar:乙巳:love",
      "deep:application:day_pillar:乙巳:marriage",
      "deep:application:day_pillar:乙巳:family",
      "deep:application:day_pillar:乙巳:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.巳 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六乙日詩 / 巳",
        "proposition": "六乙日詩는 巳의 金局·化金 조건을 든다. 성별에 따른 배우자 위해 단정은 해석 재료에서 제외한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙午",
    "targetId": "foundation:day_pillar:丙午",
    "label": "병오일주",
    "stem": "丙",
    "branch": "午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "劫財"
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "드러나는 화기가 같은 화기 기반 위에서 크게 작동하는 조합",
    "strengthMeaning": "의도를 분명히 보여주고 사람의 행동을 시작하게 하는 방향",
    "overuseCondition": "표현의 강도가 합의의 속도를 앞지를 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙午#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "일주 丙午의 저장 구성은 丁(劫財)·己(傷官)이고, 같은 일간의 비교 일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "丙午 / 庚午: 지지 午의 저장 집합은 같지만 기준 일간이 달라 각각 丁(劫財)·己(傷官) / 丁(正官)·己(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙午:personality",
      "deep:application:day_pillar:丙午:career",
      "deep:application:day_pillar:丙午:money",
      "deep:application:day_pillar:丙午:study",
      "deep:application:day_pillar:丙午:love",
      "deep:application:day_pillar:丙午:marriage",
      "deep:application:day_pillar:丙午:family",
      "deep:application:day_pillar:丙午:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.午 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 午",
        "proposition": "六丙日詩는 午를 日刃·火旺으로 설명하며 다른 글자의 조절을 본다. 배우자 위해 예언은 배제한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁未",
    "targetId": "foundation:day_pillar:丁未",
    "label": "정미일주",
    "stem": "丁",
    "branch": "未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "比肩"
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "안에 남은 온기와 배움을 지속 가능한 돌봄으로 잇는 조합",
    "strengthMeaning": "익숙한 경험을 다른 사람이 쓰기 좋은 형태로 전하는 방향",
    "overuseCondition": "돌봄과 자기 역할을 분리하지 못해 쉬는 데 죄책감을 느낄 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁未#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "일주 丁未의 저장 구성은 己(食神)·丁(比肩)·乙(偏印)이고, 같은 일간의 비교 일주 丁卯의 저장 구성은 乙(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "丁未 / 辛未: 지지 未의 저장 집합은 같지만 기준 일간이 달라 각각 己(食神)·丁(比肩)·乙(偏印) / 己(偏印)·丁(偏官)·乙(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁未:personality",
      "deep:application:day_pillar:丁未:career",
      "deep:application:day_pillar:丁未:money",
      "deep:application:day_pillar:丁未:study",
      "deep:application:day_pillar:丁未:love",
      "deep:application:day_pillar:丁未:marriage",
      "deep:application:day_pillar:丁未:family",
      "deep:application:day_pillar:丁未:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.未 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 未",
        "proposition": "六丁日詩는 未의 木餘氣·印生身을 설명한다. 목기의 지원과 화토의 조절을 분리해 본다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊申",
    "targetId": "foundation:day_pillar:戊申",
    "label": "무신일주",
    "stem": "戊",
    "branch": "申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏財"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "큰 기반에서 산출과 유동 자원의 통로를 여는 조합",
    "strengthMeaning": "축적한 자원을 가공해 실제로 쓰이게 하는 가능성",
    "overuseCondition": "처리 효율을 높이다 사람의 적응 시간을 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊申#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "일주 戊申의 저장 구성은 庚(食神)·壬(偏財)·戊(比肩)이고, 같은 일간의 비교 일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "戊申 / 壬申: 지지 申의 저장 집합은 같지만 기준 일간이 달라 각각 庚(食神)·壬(偏財)·戊(比肩) / 庚(偏印)·壬(比肩)·戊(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊申:personality",
      "deep:application:day_pillar:戊申:career",
      "deep:application:day_pillar:戊申:money",
      "deep:application:day_pillar:戊申:study",
      "deep:application:day_pillar:戊申:love",
      "deep:application:day_pillar:戊申:marriage",
      "deep:application:day_pillar:戊申:family",
      "deep:application:day_pillar:戊申:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.申 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 申",
        "proposition": "六戊日詩는 申의 壬長生·甲絶을 들어 財와 官을 나누어 설명한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己酉",
    "targetId": "foundation:day_pillar:己酉",
    "label": "기유일주",
    "stem": "己",
    "branch": "酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      }
    ],
    "coreMeaning": "세밀한 토양이 정돈된 산출의 통로를 만나는 조합",
    "strengthMeaning": "작은 기술을 반복 가능한 품질로 만드는 방향",
    "overuseCondition": "정리한 형식에 맞지 않는 예외를 불필요한 것으로 버릴 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己酉#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "일주 己酉의 저장 구성은 辛(食神)이고, 같은 일간의 비교 일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "己酉 / 癸酉: 지지 酉의 저장 집합은 같지만 기준 일간이 달라 각각 辛(食神) / 辛(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己酉:personality",
      "deep:application:day_pillar:己酉:career",
      "deep:application:day_pillar:己酉:money",
      "deep:application:day_pillar:己酉:study",
      "deep:application:day_pillar:己酉:love",
      "deep:application:day_pillar:己酉:marriage",
      "deep:application:day_pillar:己酉:family",
      "deep:application:day_pillar:己酉:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.酉 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 酉",
        "proposition": "六己日詩는 酉에서 財祿이 등을 진다고 표현한다. 기존 장간 辛은 己의 食神 관계로 별도 대조한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚戌",
    "targetId": "foundation:day_pillar:庚戌",
    "label": "경술일주",
    "stem": "庚",
    "branch": "戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏印"
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "劫財"
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "단단한 결단을 건조한 저장과 검증의 환경에 두는 조합",
    "strengthMeaning": "기준과 경계를 선명하게 해 오래 유지할 결과를 만드는 방향",
    "overuseCondition": "정당한 기준이라는 확신이 수정과 화해를 막을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚戌#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "일주 庚戌의 저장 구성은 戊(偏印)·辛(劫財)·丁(正官)이고, 같은 일간의 비교 일주 庚午의 저장 구성은 丁(正官)·己(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲戌",
        "meaning": "庚戌 / 甲戌: 지지 戌의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏印)·辛(劫財)·丁(正官) / 戊(偏財)·辛(正官)·丁(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚戌:personality",
      "deep:application:day_pillar:庚戌:career",
      "deep:application:day_pillar:庚戌:money",
      "deep:application:day_pillar:庚戌:study",
      "deep:application:day_pillar:庚戌:love",
      "deep:application:day_pillar:庚戌:marriage",
      "deep:application:day_pillar:庚戌:family",
      "deep:application:day_pillar:庚戌:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.戌 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 戌",
        "proposition": "六庚日詩는 戌의 魁罡과 火氣·身煞 강약을 구분한다. 괴강 이름으로 성품을 확정하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "六庚日詩의 戌中旺丙 표현은 현행 戌戊辛丁 고정 장간과 구별해 교감한다. 새 丙 근거를 만들지 않음.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛亥",
    "targetId": "foundation:day_pillar:辛亥",
    "label": "신해일주",
    "stem": "辛",
    "branch": "亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "傷官"
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "정교한 구별을 넓은 정보와 표현의 흐름에 풀어내는 조합",
    "strengthMeaning": "미세한 차이를 이해하기 쉬운 이야기로 전하는 방향",
    "overuseCondition": "표현과 비교가 많아져 결론을 내릴 힘이 흩어질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛亥#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "일주 辛亥의 저장 구성은 壬(傷官)·甲(正財)이고, 같은 일간의 비교 일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙亥",
        "meaning": "辛亥 / 乙亥: 지지 亥의 저장 집합은 같지만 기준 일간이 달라 각각 壬(傷官)·甲(正財) / 壬(正印)·甲(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛亥:personality",
      "deep:application:day_pillar:辛亥:career",
      "deep:application:day_pillar:辛亥:money",
      "deep:application:day_pillar:辛亥:study",
      "deep:application:day_pillar:辛亥:love",
      "deep:application:day_pillar:辛亥:marriage",
      "deep:application:day_pillar:辛亥:family",
      "deep:application:day_pillar:辛亥:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.亥 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 亥",
        "proposition": "六辛日詩는 亥의 沐浴과 財生官絶을 병기한다. 名稱 하나로 연애·성적 행실을 판단하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬子",
    "targetId": "foundation:day_pillar:壬子",
    "label": "임자일주",
    "stem": "壬",
    "branch": "子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "넓은 흐름과 같은 수기의 기반이 겹치는 조합",
    "strengthMeaning": "변화 속에서도 자기 흐름을 이어 가는 가능성",
    "overuseCondition": "자유롭게 움직이는 것이 다른 사람의 예측 가능성을 낮출 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬子#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "일주 壬子의 저장 구성은 癸(劫財)이고, 같은 일간의 비교 일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "壬子 / 甲子: 지지 子의 저장 집합은 같지만 기준 일간이 달라 각각 癸(劫財) / 癸(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬子:personality",
      "deep:application:day_pillar:壬子:career",
      "deep:application:day_pillar:壬子:money",
      "deep:application:day_pillar:壬子:study",
      "deep:application:day_pillar:壬子:love",
      "deep:application:day_pillar:壬子:marriage",
      "deep:application:day_pillar:壬子:family",
      "deep:application:day_pillar:壬子:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.子 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 子",
        "proposition": "六壬日詩는 子의 日刃·飛天祿馬 논법을 언급한다. 다른 원국 조건 없는 격 적용은 금지한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸丑",
    "targetId": "foundation:day_pillar:癸丑",
    "label": "계축일주",
    "stem": "癸",
    "branch": "丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "比肩"
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "미세한 수기가 한습한 저장과 경계의 토양에 놓이는 조합",
    "strengthMeaning": "작은 변화를 기록하고 자원을 오래 유지하는 가능성",
    "overuseCondition": "겉으로 표현하지 않은 불편이 안에 쌓일 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸丑#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "일주 癸丑의 저장 구성은 己(偏官)·癸(比肩)·辛(偏印)이고, 같은 일간의 비교 일주 癸酉의 저장 구성은 辛(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "癸丑 / 乙丑: 지지 丑의 저장 집합은 같지만 기준 일간이 달라 각각 己(偏官)·癸(比肩)·辛(偏印) / 己(偏財)·癸(偏印)·辛(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸丑:personality",
      "deep:application:day_pillar:癸丑:career",
      "deep:application:day_pillar:癸丑:money",
      "deep:application:day_pillar:癸丑:study",
      "deep:application:day_pillar:癸丑:love",
      "deep:application:day_pillar:癸丑:marriage",
      "deep:application:day_pillar:癸丑:family",
      "deep:application:day_pillar:癸丑:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.丑 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 丑",
        "proposition": "六癸日詩는 丑의 己專位·七煞와 刃의 충파 조건을 든다. 음간 양인 학설 차이는 별도 보류한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "음간 양인 포함 학설 차이와 해당 구절의 글자 교감. 현행 판정과 분리.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:甲寅",
    "targetId": "foundation:day_pillar:甲寅",
    "label": "갑인일주",
    "stem": "甲",
    "branch": "寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "食神"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏財"
      }
    ],
    "coreMeaning": "세운 목표를 자기 뿌리에서 밀어 올리는 조합",
    "strengthMeaning": "주도권을 갖고 처음 길을 여는 지속성",
    "overuseCondition": "자기 방식의 일관성이 타인의 도움을 받지 못하는 고집이 될 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:甲寅#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:甲子",
        "meaning": "일주 甲寅의 저장 구성은 甲(比肩)·丙(食神)·戊(偏財)이고, 같은 일간의 비교 일주 甲子의 저장 구성은 癸(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "甲寅 / 丙寅: 지지 寅의 저장 집합은 같지만 기준 일간이 달라 각각 甲(比肩)·丙(食神)·戊(偏財) / 甲(偏印)·丙(比肩)·戊(食神)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:甲寅:personality",
      "deep:application:day_pillar:甲寅:career",
      "deep:application:day_pillar:甲寅:money",
      "deep:application:day_pillar:甲寅:study",
      "deep:application:day_pillar:甲寅:love",
      "deep:application:day_pillar:甲寅:marriage",
      "deep:application:day_pillar:甲寅:family",
      "deep:application:day_pillar:甲寅:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.寅 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六甲日詩 / 寅",
        "proposition": "六甲日詩는 寅을 甲의 建祿 자리로 설명하되 財官과 월시의 조건을 별도로 검토한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:乙卯",
    "targetId": "foundation:day_pillar:乙卯",
    "label": "을묘일주",
    "stem": "乙",
    "branch": "卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "유연하지만 자기 성장 방향은 놓지 않는 겹목 조합",
    "strengthMeaning": "작은 수정으로 방향을 유지하며 넓혀 가는 가능성",
    "overuseCondition": "겉으로 맞추는 동안 속으로는 선택을 굳혀 합의를 지연할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:乙卯#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:乙丑",
        "meaning": "일주 乙卯의 저장 구성은 乙(比肩)이고, 같은 일간의 비교 일주 乙丑의 저장 구성은 己(偏財)·癸(偏印)·辛(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "乙卯 / 丁卯: 지지 卯의 저장 집합은 같지만 기준 일간이 달라 각각 乙(比肩) / 乙(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:乙卯:personality",
      "deep:application:day_pillar:乙卯:career",
      "deep:application:day_pillar:乙卯:money",
      "deep:application:day_pillar:乙卯:study",
      "deep:application:day_pillar:乙卯:love",
      "deep:application:day_pillar:乙卯:marriage",
      "deep:application:day_pillar:乙卯:family",
      "deep:application:day_pillar:乙卯:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.卯 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六乙日詩 / 卯",
        "proposition": "六乙日詩는 卯의 乙坐祿과 財官의 별도 조건을 설명한다. 목기가 같다고 자동으로 성취가 생기지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丙辰",
    "targetId": "foundation:day_pillar:丙辰",
    "label": "병진일주",
    "stem": "丙",
    "branch": "辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "食神"
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正印"
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正官"
      }
    ],
    "coreMeaning": "밝은 생각을 습한 토양의 기록과 조절로 받치는 조합",
    "strengthMeaning": "복잡한 내용을 설명하면서도 확인할 자료를 남기는 가능성",
    "overuseCondition": "드러내는 말과 보관한 고민 사이의 차이가 커질 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丙辰#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丙寅",
        "meaning": "일주 丙辰의 저장 구성은 戊(食神)·乙(正印)·癸(正官)이고, 같은 일간의 비교 일주 丙寅의 저장 구성은 甲(偏印)·丙(比肩)·戊(食神)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "丙辰 / 戊辰: 지지 辰의 저장 집합은 같지만 기준 일간이 달라 각각 戊(食神)·乙(正印)·癸(正官) / 戊(比肩)·乙(正官)·癸(正財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丙辰:personality",
      "deep:application:day_pillar:丙辰:career",
      "deep:application:day_pillar:丙辰:money",
      "deep:application:day_pillar:丙辰:study",
      "deep:application:day_pillar:丙辰:love",
      "deep:application:day_pillar:丙辰:marriage",
      "deep:application:day_pillar:丙辰:family",
      "deep:application:day_pillar:丙辰:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.辰 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丙日詩 / 辰",
        "proposition": "六丙日詩는 辰을 官庫로 부르고 겨울 및 시주의 조건을 든다. 庫는 실제 공직·재산의 보증이 아니다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:丁巳",
    "targetId": "foundation:day_pillar:丁巳",
    "label": "정사일주",
    "stem": "丁",
    "branch": "巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "劫財"
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "傷官"
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "섬세한 집중을 스스로 유지하는 화기 기반에 올리는 조합",
    "strengthMeaning": "관심 있는 대상을 깊게 다듬어 선명하게 보여주는 방향",
    "overuseCondition": "몰입한 기준에 주변의 속도를 맞추려 할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:丁巳#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:丁卯",
        "meaning": "일주 丁巳의 저장 구성은 丙(劫財)·戊(傷官)·庚(正財)이고, 같은 일간의 비교 일주 丁卯의 저장 구성은 乙(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "丁巳 / 己巳: 지지 巳의 저장 집합은 같지만 기준 일간이 달라 각각 丙(劫財)·戊(傷官)·庚(正財) / 丙(正印)·戊(劫財)·庚(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:丁巳:personality",
      "deep:application:day_pillar:丁巳:career",
      "deep:application:day_pillar:丁巳:money",
      "deep:application:day_pillar:丁巳:study",
      "deep:application:day_pillar:丁巳:love",
      "deep:application:day_pillar:丁巳:marriage",
      "deep:application:day_pillar:丁巳:family",
      "deep:application:day_pillar:丁巳:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.巳 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六丁日詩 / 巳",
        "proposition": "六丁日詩는 巳의 火旺·丙戊 작용과 다른 글자의 조절을 본다. 친족 위해 단정은 제외한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:戊午",
    "targetId": "foundation:day_pillar:戊午",
    "label": "무오일주",
    "stem": "戊",
    "branch": "午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "正印"
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "劫財"
      }
    ],
    "coreMeaning": "큰 틀이 온기와 지원을 강하게 받는 조합",
    "strengthMeaning": "공동의 일을 버틸 안정적인 중심을 세우는 방향",
    "overuseCondition": "스스로 충분하다는 감각이 외부 점검을 늦출 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:戊午#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:戊辰",
        "meaning": "일주 戊午의 저장 구성은 丁(正印)·己(劫財)이고, 같은 일간의 비교 일주 戊辰의 저장 구성은 戊(比肩)·乙(正官)·癸(正財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "戊午 / 庚午: 지지 午의 저장 집합은 같지만 기준 일간이 달라 각각 丁(正印)·己(劫財) / 丁(正官)·己(正印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:戊午:personality",
      "deep:application:day_pillar:戊午:career",
      "deep:application:day_pillar:戊午:money",
      "deep:application:day_pillar:戊午:study",
      "deep:application:day_pillar:戊午:love",
      "deep:application:day_pillar:戊午:marriage",
      "deep:application:day_pillar:戊午:family",
      "deep:application:day_pillar:戊午:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.午 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六戊日詩 / 午",
        "proposition": "六戊日詩는 午의 日刃과 印綬를 함께 언급하고 화월 조건을 더한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:己未",
    "targetId": "foundation:day_pillar:己未",
    "label": "기미일주",
    "stem": "己",
    "branch": "未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "偏印"
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏官"
      }
    ],
    "coreMeaning": "생활을 기르는 토양에 온기와 성장의 잔여가 함께 남는 조합",
    "strengthMeaning": "사람이 적응하며 자랄 수 있는 지속적인 돌봄을 만드는 방향",
    "overuseCondition": "관계와 의무가 얽혀 이미 끝난 역할을 내려놓지 못할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:己未#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:己巳",
        "meaning": "일주 己未의 저장 구성은 己(比肩)·丁(偏印)·乙(偏官)이고, 같은 일간의 비교 일주 己巳의 저장 구성은 丙(正印)·戊(劫財)·庚(傷官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "己未 / 辛未: 지지 未의 저장 집합은 같지만 기준 일간이 달라 각각 己(比肩)·丁(偏印)·乙(偏官) / 己(偏印)·丁(偏官)·乙(偏財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:己未:personality",
      "deep:application:day_pillar:己未:career",
      "deep:application:day_pillar:己未:money",
      "deep:application:day_pillar:己未:study",
      "deep:application:day_pillar:己未:love",
      "deep:application:day_pillar:己未:marriage",
      "deep:application:day_pillar:己未:family",
      "deep:application:day_pillar:己未:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.未 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六己日詩 / 未",
        "proposition": "六己日詩는 未의 官庫·有木無水와 시주 조건을 짚는다. 庫를 미래 직위로 해석하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:庚申",
    "targetId": "foundation:day_pillar:庚申",
    "label": "경신일주",
    "stem": "庚",
    "branch": "申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "食神"
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "偏印"
      }
    ],
    "coreMeaning": "단단한 판단이 같은 금기의 기반을 갖는 조합",
    "strengthMeaning": "도구와 기준을 스스로 정해 어려운 일을 처리하는 가능성",
    "overuseCondition": "자기 방식의 효율을 다른 사람에게도 동일하게 요구할 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:庚申#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:庚午",
        "meaning": "일주 庚申의 저장 구성은 庚(比肩)·壬(食神)·戊(偏印)이고, 같은 일간의 비교 일주 庚午의 저장 구성은 丁(正官)·己(正印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "庚申 / 壬申: 지지 申의 저장 집합은 같지만 기준 일간이 달라 각각 庚(比肩)·壬(食神)·戊(偏印) / 庚(偏印)·壬(比肩)·戊(偏官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:庚申:personality",
      "deep:application:day_pillar:庚申:career",
      "deep:application:day_pillar:庚申:money",
      "deep:application:day_pillar:庚申:study",
      "deep:application:day_pillar:庚申:love",
      "deep:application:day_pillar:庚申:marriage",
      "deep:application:day_pillar:庚申:family",
      "deep:application:day_pillar:庚申:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.申 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六庚日詩 / 申",
        "proposition": "六庚日詩는 申의 自坐建祿을 든다. 身旺 명칭을 성취·수명 보증으로 사용하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:辛酉",
    "targetId": "foundation:day_pillar:辛酉",
    "label": "신유일주",
    "stem": "辛",
    "branch": "酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "比肩"
      }
    ],
    "coreMeaning": "정교한 구별과 같은 금기의 기준이 겹치는 조합",
    "strengthMeaning": "자기 기준을 일관된 품질로 유지하는 가능성",
    "overuseCondition": "작은 차이를 지키려 협의 가능한 여지까지 줄일 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:辛酉#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:辛未",
        "meaning": "일주 辛酉의 저장 구성은 辛(比肩)이고, 같은 일간의 비교 일주 辛未의 저장 구성은 己(偏印)·丁(偏官)·乙(偏財)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "辛酉 / 癸酉: 지지 酉의 저장 집합은 같지만 기준 일간이 달라 각각 辛(比肩) / 辛(偏印)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:辛酉:personality",
      "deep:application:day_pillar:辛酉:career",
      "deep:application:day_pillar:辛酉:money",
      "deep:application:day_pillar:辛酉:study",
      "deep:application:day_pillar:辛酉:love",
      "deep:application:day_pillar:辛酉:marriage",
      "deep:application:day_pillar:辛酉:family",
      "deep:application:day_pillar:辛酉:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.酉 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六辛日詩 / 酉",
        "proposition": "六辛日詩는 酉의 辛建祿과 財官의 별도 조건을 설명한다. 같은 기운의 집중을 우월함으로 읽지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:壬戌",
    "targetId": "foundation:day_pillar:壬戌",
    "label": "임술일주",
    "stem": "壬",
    "branch": "戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "偏官"
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "正印"
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1,
        "tenGod": "正財"
      }
    ],
    "coreMeaning": "넓은 흐름을 건조한 저장·자원·책임에 연결하는 조합",
    "strengthMeaning": "흩어진 가능성을 현실의 약속과 결과로 모으는 방향",
    "overuseCondition": "책임 있게 끝내려 여러 사정을 한꺼번에 떠안을 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:壬戌#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:壬申",
        "meaning": "일주 壬戌의 저장 구성은 戊(偏官)·辛(正印)·丁(正財)이고, 같은 일간의 비교 일주 壬申의 저장 구성은 庚(偏印)·壬(比肩)·戊(偏官)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:甲戌",
        "meaning": "壬戌 / 甲戌: 지지 戌의 저장 집합은 같지만 기준 일간이 달라 각각 戊(偏官)·辛(正印)·丁(正財) / 戊(偏財)·辛(正官)·丁(傷官)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:壬戌:personality",
      "deep:application:day_pillar:壬戌:career",
      "deep:application:day_pillar:壬戌:money",
      "deep:application:day_pillar:壬戌:study",
      "deep:application:day_pillar:壬戌:love",
      "deep:application:day_pillar:壬戌:marriage",
      "deep:application:day_pillar:壬戌:family",
      "deep:application:day_pillar:壬戌:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.戌 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六壬日詩 / 戌",
        "proposition": "六壬日詩는 戌의 財官雙美·玄武當權 이름과 다른 기둥의 배합을 요구한다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "六壬日詩의 身作丙戊 표현을 현행 戌戊辛丁 및 해당 분야 관법과 분리 교감. 丙 저장 근거로 쓰지 않음.",
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  },
  {
    "id": "deep:day_pillar:癸亥",
    "targetId": "foundation:day_pillar:癸亥",
    "label": "계해일주",
    "stem": "癸",
    "branch": "亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6,
        "tenGod": "劫財"
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3,
        "tenGod": "傷官"
      }
    ],
    "coreMeaning": "미세한 수기와 넓은 수기 기반이 이어지는 조합",
    "strengthMeaning": "여러 가능성을 유연하게 탐색하고 맥락을 깊게 읽는 방향",
    "overuseCondition": "흐름을 따라가다 본인의 결정을 말할 시점을 놓칠 수 있다.",
    "inheritedMeaningRef": "completion:day_pillar:癸亥#core,positive,risk",
    "contrasts": [
      {
        "kind": "same_stem",
        "otherTargetId": "foundation:day_pillar:癸酉",
        "meaning": "일주 癸亥의 저장 구성은 壬(劫財)·甲(傷官)이고, 같은 일간의 비교 일주 癸酉의 저장 구성은 辛(偏印)이다. 지지와 일간 대비 장간의 관계가 다르며 성격의 우열을 뜻하지 않는다."
      },
      {
        "kind": "same_branch",
        "otherTargetId": "foundation:day_pillar:乙亥",
        "meaning": "癸亥 / 乙亥: 지지 亥의 저장 집합은 같지만 기준 일간이 달라 각각 壬(劫財)·甲(傷官) / 壬(正印)·甲(劫財)로 읽는다. 동일 지지를 동일 십성으로 취급하지 않는다."
      }
    ],
    "applicationIds": [
      "deep:application:day_pillar:癸亥:personality",
      "deep:application:day_pillar:癸亥:career",
      "deep:application:day_pillar:癸亥:money",
      "deep:application:day_pillar:癸亥:study",
      "deep:application:day_pillar:癸亥:love",
      "deep:application:day_pillar:癸亥:marriage",
      "deep:application:day_pillar:癸亥:family",
      "deep:application:day_pillar:癸亥:relationships"
    ],
    "evidenceLevel": "repository_structure_with_conditional_applications",
    "review": "all_eight_domains_reviewed",
    "sourceRefs": [
      {
        "sourceId": "deep-repo",
        "locator": "HIDDEN_STEMS.亥 / getTenGod",
        "proposition": "기존 계산 관계의 읽기 전용 대조이다. 새로운 성립식은 아니다."
      },
      {
        "sourceId": "completion-sm4",
        "locator": "論十干坐支兼得月時及行運吉凶 / 六癸日詩 / 亥",
        "proposition": "六癸日詩는 亥多·癸亥時 등 飛沖의 조건을 특정한다. 한 개 亥에서 가상의 財官을 생성하지 않는다."
      },
      {
        "sourceId": "completion-repo",
        "locator": "SEXAGENARY_CYCLE / HIDDEN_STEMS",
        "proposition": "간지 조합·음양·오행·고정 장간은 기존 상수에 대조한다."
      }
    ],
    "followUp": [
      "월령·통근·투출 등 복합 조건이 없으면 개별 일주의 생활 성향으로 승격하지 않는다."
    ]
  }
] as const satisfies readonly DeepDayPillar[];
