import type { DeepHiddenStem } from "./sajuFoundationDeepTypes";

/** Offline research only. No runtime consumer or executable interpretation rule. */
export const DEEP_HIDDEN_STEMS = [
  {
    "id": "deep:hidden:子",
    "targetId": "foundation:hidden_stem:子",
    "stored": [
      {
        "stem": "癸",
        "role": "MAIN",
        "weight": 0.6
      }
    ],
    "elementComposition": [
      "WATER"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "月令司事의 壬七日癸二十三日 표는 현재 子癸 고정 집합과 다르다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:子:personality",
      "deep:hidden_requirement:子:career",
      "deep:hidden_requirement:子:money",
      "deep:hidden_requirement:子:study",
      "deep:hidden_requirement:子:love",
      "deep:hidden_requirement:子:marriage",
      "deep:hidden_requirement:子:family",
      "deep:hidden_requirement:子:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:丑",
    "targetId": "foundation:hidden_stem:丑",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "癸",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "辛",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "METAL",
      "WATER"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷五 論雜氣의 癸辛己 집합은 현행 세 글자와 같다. 순서·가중치는 별개다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:丑:personality",
      "deep:hidden_requirement:丑:career",
      "deep:hidden_requirement:丑:money",
      "deep:hidden_requirement:丑:study",
      "deep:hidden_requirement:丑:love",
      "deep:hidden_requirement:丑:marriage",
      "deep:hidden_requirement:丑:family",
      "deep:hidden_requirement:丑:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:寅",
    "targetId": "foundation:hidden_stem:寅",
    "stored": [
      {
        "stem": "甲",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "丙",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "FIRE",
      "WOOD"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷二 人元司事는 艮土·丙長生·甲을 들며 일수 배치에는 다른 설을 병기한다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:寅:personality",
      "deep:hidden_requirement:寅:career",
      "deep:hidden_requirement:寅:money",
      "deep:hidden_requirement:寅:study",
      "deep:hidden_requirement:寅:love",
      "deep:hidden_requirement:寅:marriage",
      "deep:hidden_requirement:寅:family",
      "deep:hidden_requirement:寅:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:卯",
    "targetId": "foundation:hidden_stem:卯",
    "stored": [
      {
        "stem": "乙",
        "role": "MAIN",
        "weight": 0.6
      }
    ],
    "elementComposition": [
      "WOOD"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "月令司事에는 甲·乙 또는 癸까지 등장해 현재 고정 乙 집합과 같지 않다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:卯:personality",
      "deep:hidden_requirement:卯:career",
      "deep:hidden_requirement:卯:money",
      "deep:hidden_requirement:卯:study",
      "deep:hidden_requirement:卯:love",
      "deep:hidden_requirement:卯:marriage",
      "deep:hidden_requirement:卯:family",
      "deep:hidden_requirement:卯:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:辰",
    "targetId": "foundation:hidden_stem:辰",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "乙",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "癸",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "WATER",
      "WOOD"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷五 論雜氣의 乙戊癸 집합은 현행 세 글자와 같다. 水庫와 실제 돈 창고를 나눈다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:辰:personality",
      "deep:hidden_requirement:辰:career",
      "deep:hidden_requirement:辰:money",
      "deep:hidden_requirement:辰:study",
      "deep:hidden_requirement:辰:love",
      "deep:hidden_requirement:辰:marriage",
      "deep:hidden_requirement:辰:family",
      "deep:hidden_requirement:辰:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:巳",
    "targetId": "foundation:hidden_stem:巳",
    "stored": [
      {
        "stem": "丙",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "戊",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "庚",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "FIRE",
      "METAL"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷二 人元司事의 戊·庚長生·丙과 성분은 같다. 寄生와 월령 일수는 고정 weight가 아니다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:巳:personality",
      "deep:hidden_requirement:巳:career",
      "deep:hidden_requirement:巳:money",
      "deep:hidden_requirement:巳:study",
      "deep:hidden_requirement:巳:love",
      "deep:hidden_requirement:巳:marriage",
      "deep:hidden_requirement:巳:family",
      "deep:hidden_requirement:巳:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:午",
    "targetId": "foundation:hidden_stem:午",
    "stored": [
      {
        "stem": "丁",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "己",
        "role": "SUB",
        "weight": 0.3
      }
    ],
    "elementComposition": [
      "EARTH",
      "FIRE"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷四 六庚日詩의 午中丁己와 성분은 같다. 月令司事의 丙·丁 또는 乙 포함표와는 다르다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:午:personality",
      "deep:hidden_requirement:午:career",
      "deep:hidden_requirement:午:money",
      "deep:hidden_requirement:午:study",
      "deep:hidden_requirement:午:love",
      "deep:hidden_requirement:午:marriage",
      "deep:hidden_requirement:午:family",
      "deep:hidden_requirement:午:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:未",
    "targetId": "foundation:hidden_stem:未",
    "stored": [
      {
        "stem": "己",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "丁",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "乙",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "FIRE",
      "WOOD"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷五 論雜氣의 丁己乙 집합은 현행 세 글자와 같다. 月令司事의 甲木墓庫와는 표현 축이 다르다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:未:personality",
      "deep:hidden_requirement:未:career",
      "deep:hidden_requirement:未:money",
      "deep:hidden_requirement:未:study",
      "deep:hidden_requirement:未:love",
      "deep:hidden_requirement:未:marriage",
      "deep:hidden_requirement:未:family",
      "deep:hidden_requirement:未:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:申",
    "targetId": "foundation:hidden_stem:申",
    "stored": [
      {
        "stem": "庚",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "壬",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "戊",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "METAL",
      "WATER"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷二 人元司事는 坤土·壬長生·庚을 들며 다른 표는 己까지 기재한다. 현재 고정 집합과 구분한다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:申:personality",
      "deep:hidden_requirement:申:career",
      "deep:hidden_requirement:申:money",
      "deep:hidden_requirement:申:study",
      "deep:hidden_requirement:申:love",
      "deep:hidden_requirement:申:marriage",
      "deep:hidden_requirement:申:family",
      "deep:hidden_requirement:申:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:酉",
    "targetId": "foundation:hidden_stem:酉",
    "stored": [
      {
        "stem": "辛",
        "role": "MAIN",
        "weight": 0.6
      }
    ],
    "elementComposition": [
      "METAL"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "月令司事에는 庚·辛 또는 丁까지 기재되어 현재 辛 집합과 같지 않다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:酉:personality",
      "deep:hidden_requirement:酉:career",
      "deep:hidden_requirement:酉:money",
      "deep:hidden_requirement:酉:study",
      "deep:hidden_requirement:酉:love",
      "deep:hidden_requirement:酉:marriage",
      "deep:hidden_requirement:酉:family",
      "deep:hidden_requirement:酉:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:戌",
    "targetId": "foundation:hidden_stem:戌",
    "stored": [
      {
        "stem": "戊",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "辛",
        "role": "SUB",
        "weight": 0.3
      },
      {
        "stem": "丁",
        "role": "MINOR",
        "weight": 0.1
      }
    ],
    "elementComposition": [
      "EARTH",
      "FIRE",
      "METAL"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷五 論雜氣의 辛戊丁 집합은 현행 세 글자와 같다. 火庫는 실제 화재의 근거가 아니다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:戌:personality",
      "deep:hidden_requirement:戌:career",
      "deep:hidden_requirement:戌:money",
      "deep:hidden_requirement:戌:study",
      "deep:hidden_requirement:戌:love",
      "deep:hidden_requirement:戌:marriage",
      "deep:hidden_requirement:戌:family",
      "deep:hidden_requirement:戌:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  },
  {
    "id": "deep:hidden:亥",
    "targetId": "foundation:hidden_stem:亥",
    "stored": [
      {
        "stem": "壬",
        "role": "MAIN",
        "weight": 0.6
      },
      {
        "stem": "甲",
        "role": "SUB",
        "weight": 0.3
      }
    ],
    "elementComposition": [
      "WATER",
      "WOOD"
    ],
    "roleTerminology": "MAIN은 본기의 저장 역할이다. SUB·MINOR를 중기·여기 또는 사령 순서로 자동 번역하지 않는다.",
    "weightMeaning": "0.6/0.3/0.1은 기존 프로젝트 weight이며 확률·성격 비중·사령 일수·발현 강도의 검증값이 아니다.",
    "seasonalDistinction": [
      "卷二 人元司事는 戊·甲·壬을 기재해 현행 고정 壬甲과 같지 않다."
    ],
    "positionalLimits": [
      "월지일 때도 절입 후 사령과 고정 저장 집합은 다르다.",
      "년·일·시의 장간을 월령의 계절 권한으로 읽지 않는다.",
      "출생시간 미상이면 시지와 그 저장 집합을 가정하지 않는다."
    ],
    "manifestationConditions": [
      "기준 일간이 있어야 상대 십성이 정해진다.",
      "장간이 있다는 사실, 천간으로 투출한 사실, 통근·생조·제화로 기능하는 조건을 구별한다.",
      "한 글자·두 글자·세 글자의 개수를 심리 복잡성이나 사건 수로 해석하지 않는다."
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
      },
      {
        "sourceId": "deep-wuxing",
        "locator": "PDF 60·65·70 卷12 월절",
        "proposition": "시기별 사령 기술이 존재하며 고정 저장 집합·현재 weight와는 별개다."
      }
    ],
    "requirementIds": [
      "deep:hidden_requirement:亥:personality",
      "deep:hidden_requirement:亥:career",
      "deep:hidden_requirement:亥:money",
      "deep:hidden_requirement:亥:study",
      "deep:hidden_requirement:亥:love",
      "deep:hidden_requirement:亥:marriage",
      "deep:hidden_requirement:亥:family",
      "deep:hidden_requirement:亥:relationships"
    ],
    "review": "all_eight_premises_reviewed_not_filled"
  }
] as const satisfies readonly DeepHiddenStem[];
