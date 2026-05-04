import type { DayPillarProfile } from "./dayPillarProfileTypes";

export const DAY_PILLAR_PROFILES = [
  {
    code: "丙申",
    nameKo: "병신일주",
    stem: "丙",
    branch: "申",
    imageKo: "밝은 태양이 날카로운 금속 위에 비치는 이미지입니다.",
    coreSummaryKo:
      "병신일주는 밝게 드러나는 표현성과 빠른 판단력이 함께 작동하는 구조입니다. 겉으로는 자신감 있고 분명하게 움직이지만, 안쪽에서는 상황을 예리하게 계산하고 선택지를 빠르게 비교하는 흐름이 강해질 수 있습니다.",
    structureKo:
      "丙 화 일간이 申 금 위에 앉은 구조로, 화의 표현성·추진력과 금의 판단력·분별력이 함께 작동합니다. 일지 申 안에는 금·수·토의 기운이 함께 있어, 단순한 열정보다 현실 판단과 긴장 관리가 중요한 일주로 볼 수 있습니다.",
    strengthItems: [
      {
        titleKo: "빠른 판단과 실행",
        bodyKo:
          "상황을 오래 끌기보다 핵심을 빠르게 파악하고 움직이는 힘이 있습니다.",
      },
      {
        titleKo: "분명한 표현력",
        bodyKo:
          "생각과 감정을 흐릿하게 숨기기보다 비교적 선명하게 드러내는 편입니다.",
      },
      {
        titleKo: "현실 감각",
        bodyKo:
          "이상만 좇기보다 실제 조건, 결과, 효율을 함께 보려는 감각이 살아납니다.",
      },
    ],
    cautionItems: [
      {
        titleKo: "속도와 예민함",
        bodyKo:
          "판단이 빠른 만큼 말이나 반응도 빨라져, 주변에서는 날카롭게 느낄 수 있습니다.",
      },
      {
        titleKo: "내적 긴장",
        bodyKo:
          "겉으로는 밝게 보이더라도 안쪽에서는 판단과 비교가 계속 돌아가 피로가 쌓일 수 있습니다.",
      },
    ],
    developmentItems: [
      {
        titleKo: "판단 전 완충 시간",
        bodyKo:
          "중요한 선택에서는 바로 결론을 내리기보다 한 번 멈추고 감정과 조건을 나누어 보는 것이 좋습니다.",
      },
      {
        titleKo: "표현의 온도 조절",
        bodyKo:
          "정확하게 말하는 힘은 장점이지만, 관계에서는 말의 속도와 강도를 조절할수록 설득력이 커집니다.",
      },
    ],
    tones: ["SHARP", "PRACTICAL", "INDEPENDENT"],
    themes: [
      "SELF_EXPRESSION",
      "REALITY_SENSE",
      "DISCIPLINE",
      "RESOURCEFULNESS",
    ],
    mbtiHints: [
      {
        axisHint: "TF",
        tendencyKo:
          "상황을 감정보다 기준과 판단으로 정리하려는 흐름이 강해질 수 있습니다.",
        cautionKo:
          "다만 실제 관계에서는 정서적 반응도 함께 작동하므로 T/F 한쪽으로 단순화하지 않는 편이 좋습니다.",
      },
      {
        axisHint: "JP",
        tendencyKo:
          "선택지를 빠르게 정리하고 방향을 잡으려는 경향이 나타날 수 있습니다.",
        cautionKo:
          "환경 변화가 클 때는 계획형과 유연형의 모습이 함께 드러날 수 있습니다.",
      },
    ],
  },
] as const satisfies readonly DayPillarProfile[];
