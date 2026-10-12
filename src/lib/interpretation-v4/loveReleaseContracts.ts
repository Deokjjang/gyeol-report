import type { Domain } from "./types";
import type { RelationshipStatus } from "../report-generation/reportInputTypes";
export const LOVE_RELEASE_VERSION = "love-editorial-quality-fix-01-v1" as const;
const chapter = (id: string, key: string, title: string, domain: Domain, rows: readonly (readonly [string, string, string, string, string])[]) => ({
  id, key, title, domain, paragraphs: rows.map(([purpose, ...sentences], i) => ({ id: `P${i + 1}`, purpose, sentences })),
});
/** Reader questions only. The existing L1-L9 relationship decisions stay intact. */
export const LOVE_READER_CHAPTERS = [
  chapter("CH01", "core", "사랑할 때의 나", "love", [
    ["나의 기본적인 연애 스타일", "대표 성향", "친밀감의 행동", "긍정적인 면", "핵심 연애 방식"],
    ["명리와 MBTI가 설명하는 사랑", "실제 명리 근거", "쉬운 의미", "실제 관계 MBTI", "검증된 결합"],
    ["마음을 표현하고 받아들이는 방식", "애정 행동", "근거", "오해 조건", "잘 전달되는 상황"],
    ["나에게 사랑이란 무엇인가", "중요 조건", "개인적 이유", "충족 여부의 차이", "핵심 특징"],
  ]),
  chapter("CH02", "attraction", "나만의 연애 매력", "love", [
    ["처음 만날 때의 매력", "첫 매력", "근거", "생활 장면", "좋게 작동할 조건"],
    ["가까워질수록 살아나는 매력", "친밀한 매력", "개인 근거", "함께하는 행동", "상대에게 주는 가치"],
    ["나만의 특별한 연애 장점", "다른 장점", "독립 근거와 결합", "도움이 되는 순간", "유지 조건"],
    ["내 매력을 가장 잘 활용하는 방법", "대표 매력", "과사용 위험", "자연스러운 행동", "긍정적 결론"],
  ]),
  chapter("CH03", "partner", "끌리는 상대와 편안한 관계", "relationships", [
    ["내가 끌리기 쉬운 사람", "끌리는 특징", "매력의 이유", "호감 장면", "조건과 관계의 구분"],
    ["나와 편안한 사람", "편안한 조건", "자신의 근거", "맞춰갈 행동", "안정감의 요소"],
    ["서로 다른 모습이 도움이 될 때", "도움 되는 차이", "검증된 근거", "긍정적 영향", "갈등으로 변할 조건"],
    ["관계를 선택할 때 중요한 기준", "관계 기준", "필요한 이유", "실제 살필 행동", "알아보는 방법"],
  ]),
  chapter("CH04", "current", "호감과 연애의 시작", "love", [
    ["호감이 생겼을 때의 나", "상태에 맞는 관심", "실제 근거", "만남과 대화", "매력의 조건"],
    ["마음을 표현하는 속도", "방식과 속도", "근거", "속도 차이", "편안한 표현"],
    ["썸에서 반복하기 쉬운 실수", "초기 약점", "실제 근거", "오해의 장면", "조정 행동"],
    ["관계를 시작할 때 기억할 것", "좋은 힘", "서두름과 주저함", "선택의 여지", "긍정적 메시지"],
  ]),
  chapter("CH05", "intimacy", "가까워질수록 드러나는 나", "love", [
    ["가까운 사람에게 보여주는 모습", "친밀한 행동", "실제 근거", "긍정적 가치", "첫인상과 차이"],
    ["깊은 관계에서 원하는 것", "유지 조건", "성향적 이유", "이해받을 때", "충족되지 않을 때"],
    ["애정과 독립성의 균형", "친밀감과 공간", "명리와 MBTI", "서로 다른 필요", "거리와 소통"],
    ["오래 관계를 유지하는 힘", "지속 강점", "실제 근거", "오랜 관계의 행동", "과사용 방지"],
  ]),
  chapter("CH06", "shadow", "연애 팩폭과 갈등 해결", "weaknesses", [
    ["연애에서 가장 아픈 단점", "실제 약점", "구체적 행동", "의도와 행동 차이", "인상적인 팩폭"],
    ["왜 그런 문제가 생기는가", "명리 근거", "쉬운 의미", "MBTI 조건", "개인별 원인"],
    ["갈등이 커지는 순간", "문제 상황", "의도", "상대의 해석", "반복 조건"],
    ["다툰 뒤 다시 가까워지는 방법", "개인별 행동", "대화 방식", "실제 시도", "장점 회복"],
  ]),
  chapter("CH07", "home", "결혼과 함께 사는 생활", "marriage", [
    ["결혼생활에서의 나", "상태별 생활 성향", "실제 근거", "생활 행동", "장점과 조건"],
    ["함께 사는 사람에게 줄 수 있는 힘", "생활 강점", "실제 근거", "책임 돌봄 운영", "안정적 생활"],
    ["결혼생활에서의 팩폭", "생활 위험", "성향적 이유", "역할 돈 습관", "조정 방법"],
    ["오래 함께할 수 있는 생활의 조건", "생활 기준", "필요한 이유", "함께 조정할 부분", "편안한 생활"],
  ]),
  chapter("CH08", "parenting", "자녀와 부모 역할", "relationships", [
    ["내가 부모가 된다면", "조건부 부모 강점", "실제 본인 근거", "돌봄 행동", "좋은 적용 조건"],
    ["아이에게 줄 수 있는 좋은 영향", "다른 양육 강점", "실제 근거", "함께하는 상황", "양육 조건"],
    ["부모 역할에서 조심할 점", "과해질 성향", "부담의 이유", "보호 교육 기대", "의도와 필요 구분"],
    ["나에게 맞는 부모 역할", "긍정적 역할", "주의점 보완", "일상 행동", "따뜻한 마무리"],
  ]),
  chapter("CH09", "direction", "사랑에서 가진 좋은 기운과 앞으로의 방향", "success/fortune", [
    ["내가 가진 좋은 사랑의 기운", "검증된 좋은 힘", "실제 명리 근거", "좋은 가능성", "활용 조건"],
    ["나만의 관계 재능", "다른 강점", "명리와 MBTI 근거", "상대에게 주는 가치", "지속 조건"],
    ["더 좋은 관계를 위한 선택", "소개한 원칙", "앞선 위험과 연결", "작은 행동", "긍정적 변화"],
    ["마지막 메시지", "대표 사랑의 특징", "긍정적 강점", "앞으로의 기준", "개인별 마무리"],
  ]),
] as const;
export type LoveReleaseSentence = {
  chapterId: string; paragraphId: string; sentenceRole: string; roleDescription: string; text: string;
  sourceCandidateId: string; evidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[]; semanticTheme: string;
  relationshipStatus: RelationshipStatus; context: string;
  provenance: { materialId: string; application: "SOURCE" | "CONDITIONAL_APPLICATION" | "RECALL"; sourceRefs: string[]; axis?: string; direction?: 1 | -1 };
};
export type LoveReleaseDraft = { version: string; chapters: { id: string; key: string; title: string; paragraphs: { id: string; purpose: string; text: string; sentences: LoveReleaseSentence[] }[] }[]; bodyLength: number; shortages: string[] };
