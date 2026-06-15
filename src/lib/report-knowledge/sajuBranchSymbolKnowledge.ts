import type { FiveElement } from "./sajuKnowledgeTypes";

export type SajuBranchSymbolEntry = {
  readonly branch: string;
  readonly labelKo: string;
  readonly animalKo: string;
  readonly element: FiveElement;
  readonly yinYang: "yin" | "yang";
  readonly seasonKo: string;
  readonly colorToken: FiveElement;
  readonly symbolicImage: string;
  readonly positiveKeywords: readonly string[];
  readonly cautionKeywords: readonly string[];
  readonly sceneSeeds: readonly string[];
};

const unsafeBranchSymbolClaims = [
  "100%",
  "반드시",
  "무조건",
  "운명 확정",
  "수익 보장",
  "성공 보장",
  "진단",
  "치료",
] as const;

export const SAJU_BRANCH_SYMBOL_KNOWLEDGE = [
  {
    branch: "子",
    labelKo: "자",
    animalKo: "쥐",
    element: "water",
    yinYang: "yang",
    seasonKo: "겨울",
    colorToken: "water",
    symbolicImage:
      "쥐는 한밤의 물처럼 작고 빠르게 움직이며, 보이지 않는 곳에서 정보를 모으고 길을 찾는 지지입니다.",
    positiveKeywords: ["기민함", "정보 감각", "생존력"],
    cautionKeywords: ["과한 계산", "불안정한 리듬"],
    sceneSeeds: ["밤에 생각이 빨라지는 장면", "정보를 먼저 모으는 장면"],
  },
  {
    branch: "丑",
    labelKo: "축",
    animalKo: "소",
    element: "earth",
    yinYang: "yin",
    seasonKo: "겨울 끝",
    colorToken: "earth",
    symbolicImage:
      "소는 겨울 끝의 얼어붙은 흙처럼 느리지만 오래 버티며, 씨앗과 자원을 안쪽에 품는 지지입니다.",
    positiveKeywords: ["지속력", "저장", "성실함"],
    cautionKeywords: ["고집", "느린 전환"],
    sceneSeeds: ["오래 쌓아 결과를 만드는 장면", "쉽게 방향을 바꾸지 않는 장면"],
  },
  {
    branch: "寅",
    labelKo: "인",
    animalKo: "호랑이",
    element: "wood",
    yinYang: "yang",
    seasonKo: "봄 시작",
    colorToken: "wood",
    symbolicImage:
      "호랑이는 봄이 막 열리는 숲의 힘처럼 앞으로 치고 나가며, 새 판을 열려는 추진을 가진 지지입니다.",
    positiveKeywords: ["개척", "추진", "용기"],
    cautionKeywords: ["성급함", "충돌"],
    sceneSeeds: ["새로운 일을 먼저 시작하는 장면", "답답한 판을 밀어 여는 장면"],
  },
  {
    branch: "卯",
    labelKo: "묘",
    animalKo: "토끼",
    element: "wood",
    yinYang: "yin",
    seasonKo: "봄",
    colorToken: "wood",
    symbolicImage:
      "토끼는 봄의 목처럼 부드럽게 번지고 자라며, 관계와 공간 안에서 섬세하게 확장하는 지지입니다.",
    positiveKeywords: ["성장", "섬세함", "관계 감각"],
    cautionKeywords: ["예민함", "우회적 표현"],
    sceneSeeds: ["분위기를 살피며 움직이는 장면", "부드럽지만 선을 지키는 장면"],
  },
  {
    branch: "辰",
    labelKo: "진",
    animalKo: "용",
    element: "earth",
    yinYang: "yang",
    seasonKo: "봄 끝",
    colorToken: "earth",
    symbolicImage:
      "용은 봄 끝의 큰 흙과 물기를 함께 품어, 보이는 안정감 아래 여러 가능성이 움직이는 지지입니다.",
    positiveKeywords: ["저장", "변화 가능성", "기반"],
    cautionKeywords: ["복잡함", "속내를 늦게 드러냄"],
    sceneSeeds: ["여러 가능성을 한 번에 품는 장면", "겉은 차분해도 안쪽이 바쁜 장면"],
  },
  {
    branch: "巳",
    labelKo: "사",
    animalKo: "뱀",
    element: "fire",
    yinYang: "yin",
    seasonKo: "여름 시작",
    colorToken: "fire",
    symbolicImage:
      "뱀은 여름이 시작되는 불의 감각처럼 조용히 열을 모으고, 타이밍을 보며 정확히 움직이는 지지입니다.",
    positiveKeywords: ["집중", "전략", "감각"],
    cautionKeywords: ["의심", "과열"],
    sceneSeeds: ["조용히 관찰하다가 정확히 움직이는 장면", "분위기보다 타이밍을 보는 장면"],
  },
  {
    branch: "午",
    labelKo: "오",
    animalKo: "말",
    element: "fire",
    yinYang: "yang",
    seasonKo: "여름",
    colorToken: "fire",
    symbolicImage:
      "말은 한낮의 불처럼 앞으로 달리며, 존재감과 표현, 속도와 열기를 밖으로 드러내는 지지입니다.",
    positiveKeywords: ["표현", "속도", "존재감"],
    cautionKeywords: ["과열", "속도 차이"],
    sceneSeeds: ["앞에 나서 분위기를 여는 장면", "속도가 빨라 주변 리듬을 놓치는 장면"],
  },
  {
    branch: "未",
    labelKo: "미",
    animalKo: "양",
    element: "earth",
    yinYang: "yin",
    seasonKo: "여름 끝",
    colorToken: "earth",
    symbolicImage:
      "양은 여름 끝의 따뜻한 흙처럼 열매를 품고 다듬으며, 관계와 자원을 부드럽게 정리하는 지지입니다.",
    positiveKeywords: ["정리", "돌봄", "축적"],
    cautionKeywords: ["망설임", "감정의 잔열"],
    sceneSeeds: ["사람과 일을 부드럽게 조율하는 장면", "마무리를 오래 붙잡는 장면"],
  },
  {
    branch: "申",
    labelKo: "신",
    animalKo: "원숭이",
    element: "metal",
    yinYang: "yang",
    seasonKo: "가을 시작",
    colorToken: "metal",
    symbolicImage:
      "원숭이는 금의 기민함과 계산 감각을 가진 지지입니다. 상황을 빠르게 훑고 생존 가능한 구조를 찾는 이미지입니다.",
    positiveKeywords: ["판단", "기민함", "생존 감각"],
    cautionKeywords: ["날카로운 말", "빠른 단정"],
    sceneSeeds: ["상황의 허점을 먼저 보는 장면", "빠르게 기준을 세우는 장면"],
  },
  {
    branch: "酉",
    labelKo: "유",
    animalKo: "닭",
    element: "metal",
    yinYang: "yin",
    seasonKo: "가을",
    colorToken: "metal",
    symbolicImage:
      "닭은 가을 금처럼 정확히 가르고 드러내며, 기준과 완성도를 선명하게 만드는 지지입니다.",
    positiveKeywords: ["정밀함", "완성도", "기준"],
    cautionKeywords: ["비판성", "차가운 표현"],
    sceneSeeds: ["작은 오류를 놓치지 않는 장면", "결과물의 완성도를 높이는 장면"],
  },
  {
    branch: "戌",
    labelKo: "술",
    animalKo: "개",
    element: "earth",
    yinYang: "yang",
    seasonKo: "가을 끝",
    colorToken: "earth",
    symbolicImage:
      "개는 가을 끝의 마른 흙처럼 지킬 것을 지키고, 책임과 경계선을 세우는 지지입니다.",
    positiveKeywords: ["충직함", "경계", "책임"],
    cautionKeywords: ["방어성", "경직"],
    sceneSeeds: ["맡은 것을 끝까지 지키는 장면", "선을 넘는 상황에 민감해지는 장면"],
  },
  {
    branch: "亥",
    labelKo: "해",
    animalKo: "돼지",
    element: "water",
    yinYang: "yin",
    seasonKo: "겨울 시작",
    colorToken: "water",
    symbolicImage:
      "돼지는 겨울 물의 저장성을 품은 지지입니다. 바깥으로 크게 드러내기보다 감정, 자원, 쉼을 안쪽에 저장하는 이미지입니다.",
    positiveKeywords: ["저장", "직관", "감정의 깊이"],
    cautionKeywords: ["고립", "과몰입"],
    sceneSeeds: ["감정을 안쪽에 오래 품는 장면", "혼자 쉬어야 다시 살아나는 장면"],
  },
] as const satisfies readonly SajuBranchSymbolEntry[];

export const SAJU_BRANCH_SYMBOL_BY_BRANCH = new Map<string, SajuBranchSymbolEntry>(
  SAJU_BRANCH_SYMBOL_KNOWLEDGE.flatMap((entry) => [
    [entry.branch, entry],
    [entry.labelKo, entry],
    [entry.animalKo, entry],
  ]),
);

export function getSajuBranchSymbolEntry(
  branchOrLabel: string | undefined,
): SajuBranchSymbolEntry | undefined {
  if (branchOrLabel === undefined) {
    return undefined;
  }

  return SAJU_BRANCH_SYMBOL_BY_BRANCH.get(branchOrLabel.trim());
}

export function assertSajuBranchSymbolSafety(): void {
  const text = SAJU_BRANCH_SYMBOL_KNOWLEDGE.map((entry) =>
    [
      entry.branch,
      entry.labelKo,
      entry.animalKo,
      entry.seasonKo,
      entry.symbolicImage,
      ...entry.positiveKeywords,
      ...entry.cautionKeywords,
      ...entry.sceneSeeds,
    ].join("\n"),
  ).join("\n");

  for (const claim of unsafeBranchSymbolClaims) {
    if (text.includes(claim)) {
      throw new Error(`Unsafe branch symbol claim: ${claim}`);
    }
  }
}
