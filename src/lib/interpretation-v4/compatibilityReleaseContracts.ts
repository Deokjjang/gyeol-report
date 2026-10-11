import type { PairCategory } from "./compatibilityNarrativeTypes";
export const COMPATIBILITY_RELEASE_VERSION = "compatibility-editorial-release-01-v1" as const;
const chapter = (id: string, key: string, title: string, rows: readonly (readonly [string, string, string, string, string])[]) => ({
  id, key, title, paragraphs: rows.map(([purpose, ...sentences], i) => ({ id: `P${i + 1}`, purpose, sentences })),
});
/** The existing P1–P8 questions are allocated before realization, including
 * reserved friction, repair and positive material. No new pair calculation. */
export const COMPATIBILITY_READER_CHAPTERS = [
  chapter("CH01", "core", "우리라는 관계의 핵심", [
    ["두 사람을 한마디로 설명하면", "특징적인 조합", "대표 성향 대비", "함께하는 장면", "관계의 상징"],
    ["명리에서 보는 두 사람의 관계", "실제 명리 관계", "쉬운 의미", "상호 영향", "강점과 주의 조건"],
    ["MBTI가 보여주는 우리", "A의 실제 MBTI", "B의 실제 MBTI", "공통점과 차이", "상호작용"],
    ["이 관계를 이해하는 가장 중요한 기준", "좋은 점", "조심할 차이", "관계별 조건", "앞으로의 질문"],
  ]),
  chapter("CH02", "person-a", "A는 이 관계에서 어떤 사람인가", [
    ["A의 관계 성향", "대표 행동", "명리 근거", "MBTI 선호", "B와의 관계"],
    ["A가 관계에서 중요하게 여기는 것", "관계 조건", "실제 이유", "B와의 장면", "충족될 때"],
    ["A가 관계에 가져오는 장점", "특징적 강점", "실제 근거", "B에게 좋은 상황", "유지 조건"],
    ["A가 조심해야 할 부분", "과사용 위험", "원인", "B가 받는 뜻", "조절 행동"],
  ]),
  chapter("CH03", "person-b", "B는 이 관계에서 어떤 사람인가", [
    ["B의 관계 성향", "독립적 행동", "명리 근거", "MBTI 선호", "A와의 관계"],
    ["B가 관계에서 중요하게 여기는 것", "관계 조건", "독립적 이유", "A와의 장면", "충족될 때"],
    ["B가 관계에 가져오는 장점", "특징적 강점", "독립적 근거", "A에게 좋은 상황", "유지 조건"],
    ["B가 조심해야 할 부분", "과사용 위험", "원인", "A가 받는 뜻", "조절 행동"],
  ]),
  chapter("CH04", "delight", "우리가 잘 맞는 이유", [
    ["두 사람의 공통점", "검증된 공통점 또는 다른 기여", "각자 근거", "함께하는 행동", "강점의 조건"],
    ["서로 다른 장점이 만날 때", "검증된 보완 또는 다른 장점", "실제 근거", "도움의 장면", "좋은 차이의 경계"],
    ["함께 있을 때 좋은 순간", "관계별 상황", "A의 기여", "B의 기여", "함께 얻는 결과"],
    ["이 관계에서 키울 수 있는 좋은 힘", "가치 있는 특징", "좋은 관계의 조건", "과사용 위험", "활용 방향"],
  ]),
  chapter("CH05", "direction-ab", "A가 B에게 주는 영향", [
    ["A는 B에게 어떤 자극을 주는가", "A→B 영향", "받는 사람 기준 십성", "구체적 행동", "B에게 남는 의미"],
    ["A가 B에게 주는 좋은 영향", "도움 되는 강점", "실제 근거", "관계별 장면", "발휘 조건"],
    ["A의 행동이 B에게 부담이 되는 순간", "부담 행동", "검증된 차이", "의도와 경험", "악화 조건"],
    ["A가 영향력을 잘 사용하는 방법", "조정할 행동", "B의 필요", "확인할 실천", "A→B 가능성"],
  ]),
  chapter("CH06", "direction-ba", "B가 A에게 주는 영향", [
    ["B는 A에게 어떤 자극을 주는가", "B→A 영향", "받는 사람 기준 십성", "다른 방향 행동", "A에게 남는 의미"],
    ["B가 A에게 주는 좋은 영향", "도움 되는 강점", "독립적 근거", "관계별 장면", "발휘 조건"],
    ["B의 행동이 A에게 부담이 되는 순간", "부담 행동", "검증된 차이", "의도와 경험", "악화 조건"],
    ["B가 영향력을 잘 사용하는 방법", "조정할 행동", "A의 필요", "확인할 실천", "B→A 가능성"],
  ]),
  chapter("CH07", "friction", "우리가 부딪히는 이유", [
    ["가장 중요한 차이", "불일치 또는 확인할 조건", "각자의 성향", "다른 이해", "답답함의 이유"],
    ["명리에서 보이는 충돌", "실제 충돌 또는 부재", "쉬운 의미", "다른 반응", "긍정적 여지"],
    ["이 관계의 팩폭", "반복 문제", "방향별 원인", "악화 장면", "직설적 결론"],
    ["갈등이 커지는 조건", "주의 상황", "A의 기대", "B의 기대", "다르게 전달되는 뜻"],
  ]),
  chapter("CH08", "repair", "우리가 다시 잘 지내는 방법", [
    ["우리에게 필요한 조율", "앞선 갈등 질문", "실제 원인", "각자 필요", "조정 기준"],
    ["A가 바꾸면 좋은 행동", "A의 전략", "필요한 이유", "실천 방법", "B에게 남는 변화"],
    ["B가 바꾸면 좋은 행동", "B의 전략", "필요한 이유", "다른 실천 방법", "A에게 남는 변화"],
    ["둘이 함께 지킬 약속", "공동 목표", "A의 역할", "B의 역할", "관계별 원칙"],
  ]),
  chapter("CH09", "fortune", "오래 이어갈 수 있는 우리의 좋은 힘", [
    ["두 사람이 가진 좋은 힘", "긍정적 특징", "실제 명리·MBTI", "함께하는 장점", "지속 조건"],
    ["함께 활용할 수 있는 좋은 기운", "검증된 좋은 기운", "근거와 의미", "관계의 가능성", "현실적 활용"],
    ["관계를 오래 지키는 선택", "조율 원칙", "개인별 이유", "실천 행동", "지속 조건"],
    ["우리라는 관계의 마지막 메시지", "특징적인 상호작용", "함께 만드는 가치", "기억할 기준", "관계별 결론"],
  ]),
] as const;
export type PairReleaseSentence = {
  chapterId: string; paragraphId: string; sentenceRole: string; roleDescription: string; text: string;
  relationshipCategory: PairCategory; personAId: string; personBId: string;
  subjectPersonId?: string; targetPersonId?: string;
  canonicalEvidenceIds: string[]; individualEvidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[];
  relationIds: string[]; directionId?: string; semanticTheme: string; sourceCandidateId?: string;
  provenance: { materialId: string; sourceRegistryKey: string; application: "SOURCE" | "CONDITIONAL_APPLICATION" | "RECALL"; sourceRefs: string[] };
};
export type PairReleaseDraft = { version: string; chapters: { id: string; key: string; title: string;
  paragraphs: { id: string; purpose: string; text: string; sentences: PairReleaseSentence[] }[] }[]; bodyLength: number; shortages: string[] };
