import type { Domain } from "./types";
import type { JobStatus } from "../report-generation/reportInputTypes";

export const CAREER_RELEASE_VERSION = "career-full-content-refinement-01-v2" as const;
const chapter = (id: string, key: string, title: string, domain: Domain, paragraphs: readonly (readonly [string, string, string, string, string])[]) => ({
  id, key, title, domain, paragraphs: paragraphs.map(([purpose, ...sentences], i) => ({ id: `P${i + 1}`, purpose, sentences })),
});
/** Independent reader questions; K1-K10 and the recommendation order stay intact. */
export const CAREER_READER_CHAPTERS = [
  chapter("CH01", "core", "나는 어떻게 일하는 사람인가", "identity", [
    ["타고난 업무 성향", "대표 업무 방식", "구체적 업무 상황", "그 방식의 장점", "기억할 업무 정체성"],
    ["명리와 MBTI가 말하는 업무 방식", "실제 명리 근거", "쉬운 의미", "실제 MBTI 업무 특성", "두 분석의 결합"],
    ["일을 시작하고 끝내는 방식", "시작 방식", "진행 중 행동", "마무리 방식", "효과적인 조건과 주의점"],
    ["나에게 맞는 일의 조건", "능력이 살아나는 환경", "적합한 이유", "불편한 조건", "선택 기준"],
  ]),
  chapter("CH02", "strengths", "나만의 강점과 숨은 재능", "strengths", [
    ["가장 강한 업무 능력", "주요 강점", "근거", "발휘 장면", "실제 가치"],
    ["두 번째 전문적 재능", "다른 재능", "독립 근거", "문제 해결 장면", "발전 조건"],
    ["의외로 잘할 수 있는 것", "덜 익숙한 활용 가능성", "실제 결합 근거", "다른 업무의 활용", "가능성의 의미"],
    ["재능을 실력으로 바꾸는 방법", "공통 조건", "성과로 바꿀 요소", "부족해질 부분", "구체적 행동"],
  ]),
  chapter("CH03", "roles", "적성과 잘 맞는 직업", "work", [
    ["나에게 맞는 일의 공통점", "적합한 직무의 공통점", "근거", "만족 조건", "직업 선택 기준"],
    ["추천 직업과 역할", "실제 첫 추천", "추천 이유", "활용 강점", "현실적 조건"],
    ["다른 직업 가능성", "다른 실제 추천", "독립 근거", "발휘 능력", "준비와 조건"],
    ["맞지 않는 적성과 업무", "실제 회피 환경", "불편한 이유", "가능한 문제", "회피와 조정 구분"],
  ]),
  chapter("CH04", "organization", "직장과 조직생활", "work", [
    ["함께 일하는 나", "협업 특징", "소통 근거", "타인에게 주는 장점", "좋은 협업 조건"],
    ["조직 안에서의 역할", "적합한 역할", "근거", "적용 상황", "한계"],
    ["직장생활 팩폭", "반복 위험", "실제 근거", "충돌과 성과 비용", "조정 행동"],
    ["나에게 맞는 조직문화", "편안한 환경", "자율성 규칙 소통", "피할 문제", "개선 방법"],
  ]),
  chapter("CH05", "current", "지금의 커리어와 다음 선택", "work", [
    ["현재 상태에서의 나", "입력한 상태", "연결 강점", "가능한 어려움", "선택 기준"],
    ["지금 활용할 수 있는 재능", "현재 활용 능력", "개인 근거", "실제 가능한 활동", "활용 방법"],
    ["앞으로 성장할 수 있는 부분", "발전 능력", "필요한 이유", "부족해질 부분", "성장 확인"],
    ["다음 선택을 위한 전략", "상태별 우선순위", "성급한 판단", "작은 시도", "다음 단계 기준"],
  ]),
  chapter("CH06", "money", "돈을 버는 힘과 재물 관리", "money", [
    ["나는 어떤 방식으로 돈을 버는 사람인가", "수익 관련 경향", "명리 재물 근거", "MBTI 판단 선호", "가치 생산 방식"],
    ["수익으로 이어질 수 있는 능력", "검증된 재능", "근거", "직업적 활용", "경제적 가치 조건"],
    ["돈과 관련된 팩폭", "가능한 약점", "그 근거", "지출 기회 시간 위험", "선택 기준"],
    ["나에게 맞는 재물 관리", "관리 원칙", "소득 비용 시간", "개인 점검 방식", "현실적인 결론"],
  ]),
  chapter("CH07", "study", "학업과 실력 향상", "study", [
    ["내가 공부하는 방식", "학습 특징", "실제 학업 자료", "명리 근거", "적합한 방식"],
    ["잘 배우는 분야와 환경", "흥미와 능력 조건", "학습 근거", "학습 활동", "환경"],
    ["학업과 성장의 약점", "가능한 실수", "원인", "지속성 비용", "학습 방법"],
    ["자격·기술·전문성 만들기", "발전 능력", "능력의 가치", "상태별 전략", "실력 확인"],
  ]),
  chapter("CH08", "fortune", "성공 가능성과 아픈 팩폭", "success/fortune", [
    ["내가 가진 좋은 기운", "승인된 긍정 특징", "실제 근거", "발휘 상황", "실현 조건"],
    ["인정받을 수 있는 나의 힘", "타인에게 주는 가치", "독립 근거", "인정받을 상황", "드러내는 방법"],
    ["성공을 방해하는 나의 약점", "중요 위험", "원인", "기회와 비용", "과사용 방지"],
    ["좋은 힘을 제대로 사용하는 조건", "활용 가치", "가치가 커질 조건", "피할 행동", "현실적 희망"],
  ]),
  chapter("CH09", "direction", "나만의 커리어 전략", "strengths", [
    ["가장 중요한 직업 선택 기준", "핵심 조건", "중요한 이유", "선택 질문", "잘못된 선택 방지"],
    ["내가 반드시 조심해야 할 것", "소개된 위험", "연결 이유", "악화 조건", "보완 방법"],
    ["앞으로 실천할 성장 전략", "첫 행동", "장기 능력", "일 돈 학업 연결", "성장 확인"],
    ["마지막 메시지", "소개된 강점", "긍정 가능성", "기억할 원칙", "개인별 마무리"],
  ]),
] as const;

export type CareerReleaseSentence = {
  chapterId: string; paragraphId: string; sentenceRole: string; roleDescription: string; text: string;
  sourceCandidateId: string; evidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[];
  semanticTheme: string; lifeStatus: JobStatus; jobContext: string;
  provenance: { materialId: string; application: "SOURCE" | "CONDITIONAL_APPLICATION" | "RECALL"; axis?: string; direction?: 1 | -1; sourceRefs: string[] };
};
export type CareerReleaseParagraph = { id: string; purpose: string; text: string; sentences: CareerReleaseSentence[] };
export type CareerReleaseDraft = { version: string; chapters: { id: string; key: string; title: string; paragraphs: CareerReleaseParagraph[] }[]; bodyLength: number; shortages: string[] };
